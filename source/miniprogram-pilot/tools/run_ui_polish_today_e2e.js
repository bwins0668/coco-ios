#!/usr/bin/env node
'use strict';

/* Starts ordinary WeChat DevTools automation when needed, then runs the
 * UI-only home/flashcard-center E2E. It never navigates to a deck/player. */
var childProcess = require('child_process');
var fs = require('fs');
var net = require('net');
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var DEVTOOLS = 'I:\\微信web开发者工具';
var NODE = path.join(DEVTOOLS, 'node.exe');
var CLI = path.join(DEVTOOLS, 'cli.js');
var HTTP_PORT = 9420;
var AUTO_PORT = 9421;

function listening(port) {
  return new Promise(function (resolve) {
    var socket = new net.Socket();
    var settled = false;
    function done(value) {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    }
    socket.once('connect', function () { done(true); });
    socket.once('error', function () { done(false); });
    socket.connect(port, '127.0.0.1');
    setTimeout(function () { done(false); }, 1200);
  });
}

function runCli(args, timeout) {
  var result = childProcess.spawnSync(NODE, [CLI].concat(args), {
    cwd: ROOT,
    timeout: timeout,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    input: 'y\n'
  });
  var output = String(result.stdout || '') + String(result.stderr || '');
  console.log('[devtools] ' + args.join(' ') + ' => ' + result.status);
  if (output) console.log(output.slice(0, 500));
  return result.status === 0;
}

async function waitForPort(port, timeoutMs) {
  var deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await listening(port)) return true;
    await new Promise(function (resolve) { setTimeout(resolve, 800); });
  }
  return false;
}

async function main() {
  if (!fs.existsSync(NODE) || !fs.existsSync(CLI)) {
    throw new Error('DevTools CLI not found at ' + DEVTOOLS);
  }
  if (!(await listening(AUTO_PORT))) {
    runCli(['open', '--project', ROOT, '--port', String(HTTP_PORT)], 120000);
    runCli(['auto', '--project', ROOT, '--auto-port', String(AUTO_PORT)], 30000);
    if (!(await waitForPort(AUTO_PORT, 60000))) {
      throw new Error('DevTools automation port ' + AUTO_PORT + ' did not open');
    }
  }
  var test = childProcess.spawnSync(process.execPath, [path.join(__dirname, 'e2e_ui_polish_today.js')], {
    cwd: ROOT,
    timeout: 180000,
    encoding: 'utf8',
    stdio: 'inherit'
  });
  process.exit(test.status === 0 ? 0 : 1);
}

main().catch(function (error) {
  console.error('[ui-e2e] ' + (error && error.stack || error));
  process.exit(1);
});
