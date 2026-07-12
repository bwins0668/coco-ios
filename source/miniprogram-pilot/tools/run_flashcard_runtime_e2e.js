#!/usr/bin/env node
/**
 * tools/run_flashcard_runtime_e2e.js
 * Unified entry point for flashcard runtime E2E tests.
 *
 * Fixes v2:
 *  - Check automation WebSocket port 9421 FIRST; reuse if listening.
 *  - NEVER kill existing DevTools processes we didn't start.
 *  - Exponential backoff waiting for automation port.
 *  - Proper async flow (no setTimeout for process control).
 *  - Detailed diagnostic output on failure.
 *
 * Usage:
 *   node tools/run_flashcard_runtime_e2e.js           # standalone
 *   node tools/run_miniprogram_checks.js               # orchestrated (auto-detect & skip)
 *
 * Exit codes:
 *   0  All tests passed
 *   1  Tests failed or DevTools unavailable
 */

'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');
const net = require('net');

const ROOT = path.resolve(__dirname, '..');
const AUTOMATION_WS_PORT = 9421;
const HTTP_API_PORT = 9420;

// ------- Helpers -------

function findDevToolsDir() {
  const d = 'I:\\微信web开发者工具';
  return fs.existsSync(d) ? d : null;
}

function cliPath() {
  const dir = findDevToolsDir();
  return dir ? path.join(dir, 'cli.js') : null;
}

function nodeExePath() {
  const dir = findDevToolsDir();
  return dir ? path.join(dir, 'node.exe') : null;
}

/** Returns true if a TCP connection can be established to 127.0.0.1:port */
function isPortListening(port) {
  return new Promise(resolve => {
    const sock = new net.Socket();
    let done = false;
    const cleanup = () => {
      if (!done) { done = true; sock.destroy(); }
    };
    sock.once('connect', () => { cleanup(); resolve(true); });
    sock.once('error', () => { cleanup(); resolve(false); });
    sock.connect(port, '127.0.0.1');
    setTimeout(() => { cleanup(); resolve(false); }, 1500);
  });
}

/** Probe whether the HTTP API at port 9420 responds (means IDE is properly running) */
function probeHttpApi(port) {
  try {
    const http = require('http');
    return new Promise(resolve => {
      const req = http.get(`http://127.0.0.1:${port}/does-not-exist`, res => {
        resolve(true);  // any response → server is alive
      });
      req.on('error', () => resolve(false));
      req.setTimeout(3000, () => { req.destroy(); resolve(false); });
    });
  } catch (_) {
    return Promise.resolve(false);
  }
}

/**
 * Launch DevTools with both HTTP API (9420) and automation WebSocket (9421).
 * Returns { ok, stdout, stderr, exitCode, command }.
 */
function launchDevTools() {
  const nodeExe = nodeExePath();
  const cli = cliPath();
  if (!nodeExe || !cli) return { ok: false, reason: 'DevTools CLI not found' };

  // Step A: open project → HTTP API on 9420
  const openCmd = [cli, 'open', '--project', ROOT, '--port', String(HTTP_API_PORT)];
  console.log(`[launch] 1/2: ${nodeExe} ${openCmd.join(' ')}`);
  const openResult = spawnSync(nodeExe, openCmd, {
    cwd: ROOT,
    timeout: 120000,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    input: 'y\n',
  });
  const openOut = (openResult.stdout || '') + (openResult.stderr || '');
  console.log(`[launch]   → exit=${openResult.status}, stdout+stderr=${
    openOut.substring(0, 400).replace(/\n/g, '\\n')}`);

  if (openResult.error) {
    return { ok: false, reason: `open spawn error: ${openResult.error.message}`,
             stdout: openOut, stderr: openResult.stderr, exitCode: openResult.status,
             command: [nodeExe, ...openCmd] };
  }

  // Step B: enable automation → WebSocket on 9421
  const autoCmd = [cli, 'auto', '--project', ROOT, '--auto-port', String(AUTOMATION_WS_PORT)];
  console.log(`[launch] 2/2: ${nodeExe} ${autoCmd.join(' ')}`);
  const autoResult = spawnSync(nodeExe, autoCmd, {
    cwd: ROOT,
    timeout: 30000,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  const autoOut = (autoResult.stdout || '') + (autoResult.stderr || '');
  console.log(`[launch]   → exit=${autoResult.status}, stdout+stderr=${
    autoOut.substring(0, 400).replace(/\n/g, '\\n')}`);

  return {
    ok: autoResult.status === 0,
    reason: autoResult.status === 0 ? null : 'auto command failed',
    stdout: openOut + '\n' + autoOut,
    exitCode: autoResult.status,
    command: [nodeExe, ...autoCmd],
  };
}

/**
 * Wait for automation WS port 9421 to become available, with exponential backoff.
 * Max wait ~63 seconds (1+2+4+8+16+32).
 */
async function waitForAutomationPort(maxMs = 60000) {
  const start = Date.now();
  let attempt = 0;
  while (Date.now() - start < maxMs) {
    attempt++;
    const listening = await isPortListening(AUTOMATION_WS_PORT);
    if (listening) {
      console.log(`[wait]  port ${AUTOMATION_WS_PORT} open after ${Date.now() - start}ms (attempt ${attempt})`);
      return true;
    }
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s...
    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 32000);
    const remaining = maxMs - (Date.now() - start);
    const actualDelay = Math.min(delay, remaining);
    if (actualDelay <= 0) break;
    console.log(`[wait]  attempt ${attempt}: port ${AUTOMATION_WS_PORT} not ready, waiting ${actualDelay}ms (${remaining}ms remaining)`);
    await new Promise(r => setTimeout(r, actualDelay));
  }
  console.log(`[wait]  port ${AUTOMATION_WS_PORT} NOT open after ${Date.now() - start}ms`);
  return false;
}

// ------- Main -------

async function main() {
  const isOrchestrated = process.argv.includes('--orchestrated');

  console.log('='.repeat(60));
  console.log('  Flashcard Runtime E2E Test Runner (v2)');
  console.log('='.repeat(60));

  // ----- 1. Detect DevTools CLI -----
  const dtDir = findDevToolsDir();
  const cli = cliPath();
  const nodeExe = nodeExePath();
  console.log(`\n[detect] DevTools dir: ${dtDir || 'NOT FOUND'}`);
  console.log(`[detect] node.exe:     ${nodeExe || 'NOT FOUND'}`);
  console.log(`[detect] cli.js:       ${cli || 'NOT FOUND'}`);

  if (!dtDir || !nodeExe || !cli) {
    const msg = 'WeChat DevTools not found at I:\\微信web开发者工具';
    if (isOrchestrated) { console.log(`[e2e] ${msg} — SKIPPED`); process.exit(0); }
    console.log(`[e2e] FATAL: ${msg}`); process.exit(1);
  }

  // ----- 2. Check automation WS port 9421 first (reuse if alive) -----
  let autoPortAlive = await isPortListening(AUTOMATION_WS_PORT);
  console.log(`[detect] automation WS ${AUTOMATION_WS_PORT}: ${autoPortAlive ? 'ALIVE' : 'CLOSED'}`);

  if (!autoPortAlive) {
    // Check if HTTP API is alive (IDE running without automation)
    const httpAlive = await probeHttpApi(HTTP_API_PORT);
    console.log(`[detect] HTTP API ${HTTP_API_PORT}: ${httpAlive ? 'ALIVE' : 'CLOSED'}`);

    if (httpAlive) {
      // IDE is running but without automation WS → just run `auto` command
      console.log('[e2e] IDE is running but automation not enabled. Running `auto` command...');
      const autoCmd = [cli, 'auto', '--project', ROOT, '--auto-port', String(AUTOMATION_WS_PORT)];
      console.log(`[e2e]   ${nodeExe} ${autoCmd.join(' ')}`);
      const result = spawnSync(nodeExe, autoCmd, {
        cwd: ROOT, timeout: 30000, encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const out = (result.stdout || '') + (result.stderr || '');
      console.log(`[e2e]   exit=${result.status}, output=${out.substring(0, 300).replace(/\n/g, '\\n')}`);
    } else {
      // Nothing running → full launch
      console.log('[e2e] No DevTools detected. Performing full launch...');
      const launch = launchDevTools();
      if (!launch.ok) {
        console.log(`[e2e] Launch FAILED:`);
        console.log(`  reason:   ${launch.reason}`);
        console.log(`  command:  ${(launch.command || []).join(' ')}`);
        console.log(`  exitCode: ${launch.exitCode}`);
        console.log(`  stdout:   ${(launch.stdout || '').substring(0, 600)}`);
        const msg = 'Could not start WeChat DevTools automation';
        if (isOrchestrated) { console.log(`[e2e] ${msg} — SKIPPED`); process.exit(0); }
        console.log(`[e2e] FATAL: ${msg}`); process.exit(1);
      }
    }

    // Wait for WS port to come up
    console.log('[e2e] Waiting for automation WebSocket port...');
    const ready = await waitForAutomationPort(60000);
    if (!ready) {
      console.log('[e2e] FATAL: Automation WebSocket port never came up.');
      console.log('  Try manually:');
      console.log(`    I:\\微信web开发者工具\\node.exe I:\\微信web开发者工具\\cli.js auto --project "${ROOT}" --auto-port ${AUTOMATION_WS_PORT}`);
      if (isOrchestrated) process.exit(0);
      process.exit(1);
    }
    autoPortAlive = true;
  }

  // ----- 3. Verify port is truly connectable (TCP only, not WebSocket) -----
  console.log(`[e2e] Automation port ${AUTOMATION_WS_PORT} is UP.`);
  // Add a short stabilization delay for DevTools to finish initializing
  console.log('[e2e] Waiting 3s for DevTools to stabilize...');
  await new Promise(r => setTimeout(r, 3000));

  // Double-check port is still up
  const stillUp = await isPortListening(AUTOMATION_WS_PORT);
  if (!stillUp) {
    console.log('[e2e] FATAL: Automation port went down during stabilization.');
    process.exit(1);
  }

  // ----- 4. Run the E2E test suite -----
  console.log('\n[e2e] Starting flashcard runtime E2E test...\n');
  const testScriptPath = path.join(__dirname, 'e2e_flashcard_runtime_test.js');
  const testResult = spawnSync(process.execPath, [testScriptPath], {
    cwd: ROOT,
    timeout: 180000,
    encoding: 'utf-8',
    stdio: 'inherit',
  });

  console.log(`\n[e2e] Test exit code: ${testResult.status}`);
  process.exit(testResult.status !== null ? testResult.status : 1);
}

// Prevent the script from exiting before async work completes
const mainPromise = main().catch(e => {
  console.error('[e2e] Unhandled error:', e.message);
  process.exit(1);
});
