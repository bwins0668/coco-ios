#!/usr/bin/env node
/**
 * run_miniprogram_checks.js — One-command gate for all miniprogram maintenance checks.
 *
 * Normal mode runs fourteen checks, including miniprogram_smoke_test.js.
 * JSON mode is intentionally leaf-only: it excludes the smoke test so R3.91
 * can query this command without spawning the smoke test again.
 *
 * Exit code: 0 if all checks pass, 1 if any leaf or normal-mode check fails.
 * No external dependencies.
 */

'use strict';

var child_process = require('child_process');
var fs = require('fs');
var path = require('path');

var JSON_MODE = process.argv.indexOf('--json') !== -1;
// JSON mode executes each leaf check once. Normal mode adds one smoke check
// that verifies the JSON leaf contract without recursively invoking itself.
var LEAF_CHECKS = [
  { title: 'Subpackage registry', command: 'node tools/check_subpackage_registry.js', cmd: 'node', args: ['tools/check_subpackage_registry.js'] },
  { title: 'P0 release dependency closure', command: 'node tools/check_p0_release_dependency_closure.js', cmd: 'node', args: ['tools/check_p0_release_dependency_closure.js'] },
  { title: 'P0 content truthfulness', command: 'node tools/check_flashcard_p0_content_truthfulness.js', cmd: 'node', args: ['tools/check_flashcard_p0_content_truthfulness.js'] },
  { title: 'Content compliance', command: 'node tools/check_content_compliance.js', cmd: 'node', args: ['tools/check_content_compliance.js'] },
  { title: 'Quiz explanations', command: 'node tools/check_quiz_explanations.js', cmd: 'node', args: ['tools/check_quiz_explanations.js'] },
  { title: 'Package size audit', command: 'node tools/audit_miniprogram_package_size.js', cmd: 'node', args: ['tools/audit_miniprogram_package_size.js'] },
  { title: 'Architecture boundaries', command: 'node tools/check_architecture_boundaries.js', cmd: 'node', args: ['tools/check_architecture_boundaries.js'] },
  { title: 'Practice tab boundaries', command: 'node tools/check_practice_boundaries.js', cmd: 'node', args: ['tools/check_practice_boundaries.js'] },
  { title: 'Legacy nav contracts', command: 'node tools/check_legacy_navigation_contracts.js', cmd: 'node', args: ['tools/check_legacy_navigation_contracts.js'] },
  { title: 'Tab read models', command: 'node tools/check_tab_read_models.js', cmd: 'node', args: ['tools/check_tab_read_models.js'] },
  { title: 'Flashcards boundaries', command: 'node tools/check_flashcards_boundaries.js', cmd: 'node', args: ['tools/check_flashcards_boundaries.js'] },
  { title: 'Profile commands', command: 'node tools/check_profile_command_boundaries.js', cmd: 'node', args: ['tools/check_profile_command_boundaries.js'] },
  { title: 'Home streak contract', command: 'node tools/check_home_streak_contract.js', cmd: 'node', args: ['tools/check_home_streak_contract.js'] },
  { title: 'Release packaging', command: 'node tools/check_release_packaging.js', cmd: 'node', args: ['tools/check_release_packaging.js'] },
 { title: 'Textbook course content', command: 'node tools/check_textbook_course_content.js', cmd: 'node', args: ['tools/check_textbook_course_content.js'] },
  { title: 'Textbook course fidelity', command: 'node tools/check_textbook_course_fidelity.js --all', cmd: 'node', args: ['tools/check_textbook_course_fidelity.js', '--all'] },
  { title: 'SG course knowledge golden', command: 'node tools/check_sg_course_knowledge.js --all', cmd: 'node', args: ['tools/check_sg_course_knowledge.js', '--all'] },
  { title: 'Textbook productization', command: 'node tools/check_textbook_productization.js --all', cmd: 'node', args: ['tools/check_textbook_productization.js', '--all'] },
];
// Eighteen external leaf checks plus the inline JavaScript syntax leaf.
var LEAF_TOTAL_CHECKS = 19;
var TOTAL_CHECKS = 19;
if (JSON_MODE) TOTAL_CHECKS = LEAF_TOTAL_CHECKS;

// --- Helpers ---

function log() {
  if (!JSON_MODE) {
    console.log.apply(console, arguments);
  }
}

function boundedOutput(value) {
  return String(value || '').trim().slice(0, 12000);
}

function runStep(index, total, title, cmd, args, opts) {
  var label = '[' + index + '/' + total + '] ' + title;
  var command = cmd + ' ' + args.join(' ');
  log('\n' + label);
  log('-'.repeat(40));
  var start = Date.now();
  var execOpts = Object.assign({ stdio: JSON_MODE ? 'pipe' : 'inherit' }, opts || {});
  try {
    child_process.execFileSync(cmd, args, execOpts);
  } catch (e) {
    var elapsed = Date.now() - start;
    var stdout = boundedOutput(e && e.stdout);
    var stderr = boundedOutput(e && e.stderr);
    var error = String(e && e.message || 'unknown child-process failure');
    if (!JSON_MODE) {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
    log(label + ' ... FAIL (' + elapsed + ' ms)');
    return {
      pass: false,
      title: title,
      elapsed: elapsed,
      command: command,
      exitCode: typeof e.status === 'number' ? e.status : null,
      stdout: stdout,
      stderr: stderr,
      error: error
    };
  }
  var elapsed2 = Date.now() - start;
  log(label + ' ... PASS (' + elapsed2 + ' ms)');
  return { pass: true, title: title, elapsed: elapsed2, command: command };
}

// --- JS syntax check (inline, same logic as the one-liner) ---

function checkJsSyntax() {
  var index = arguments.length > 0 ? arguments[0] : 15;
  var total = arguments.length > 1 ? arguments[1] : TOTAL_CHECKS;
  log('\n[' + index + '/' + total + '] JS syntax check');
  log('-'.repeat(40));
  var start = Date.now();

  var SKIP_DIRS = ['node_modules', '.git', '.workbuddy'];
  var files = [];

  function walk(d) {
    try {
      var entries = fs.readdirSync(d);
    } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i];
      var full = path.join(d, name);
      try {
        var stat = fs.statSync(full);
      } catch (e) { continue; }
      if (stat.isDirectory()) {
        if (SKIP_DIRS.indexOf(name) === -1) walk(full);
      } else if (stat.isFile() && name.endsWith('.js')) {
        files.push(full);
      }
    }
  }

  walk('.');

  var failed = [];
  for (var j = 0; j < files.length; j++) {
    try {
      child_process.execFileSync('node', ['--check', files[j]], { stdio: 'pipe' });
    } catch (e) {
      log('  SYNTAX ERROR: ' + files[j]);
      failed.push(files[j]);
    }
  }

  var elapsed = Date.now() - start;
  if (failed.length > 0) {
    log('[' + index + '/' + total + '] JS syntax check ... FAIL (' + elapsed + ' ms)');
    log('JS syntax FAILED: ' + failed.length + ' file(s)');
    return {
      pass: false,
      title: 'JS syntax',
      elapsed: elapsed,
      command: 'node --check (inline)',
      exitCode: 1,
      stdout: '',
      stderr: 'Syntax errors: ' + failed.join(', '),
      error: 'JavaScript syntax check failed'
    };
  }

  log('[' + index + '/' + total + '] JS syntax check ... PASS (' + elapsed + ' ms)');
  log('JS syntax OK: ' + files.length + ' file(s)');
  return { pass: true, title: 'JS syntax', elapsed: elapsed, command: 'node --check (inline)' };
}

// --- WXSS escaped newline guard (inline) ---

function checkWxssEscapedNewline() {
  var index = arguments.length > 0 ? arguments[0] : 15;
  var total = arguments.length > 1 ? arguments[1] : TOTAL_CHECKS;
  log('\n[' + index + '/' + total + '] WXSS escaped newline guard');
  log('-'.repeat(40));
  var start = Date.now();

  var SKIP_DIRS = ['node_modules', '.git', '.workbuddy'];
  var target = String.fromCharCode(92, 110); // literal backslash + n
  var badFiles = [];

  function walk(d) {
    try {
      var entries = fs.readdirSync(d);
    } catch (e) { return; }
    for (var i = 0; i < entries.length; i++) {
      var name = entries[i];
      var full = path.join(d, name);
      try {
        var stat = fs.statSync(full);
      } catch (e) { continue; }
      if (stat.isDirectory()) {
        if (SKIP_DIRS.indexOf(name) === -1) walk(full);
      } else if (stat.isFile() && name.endsWith('.wxss')) {
        var txt = fs.readFileSync(full, 'utf8');
        if (txt.indexOf(target) >= 0) {
          badFiles.push(full);
        }
      }
    }
  }

  walk('.');

  var elapsed = Date.now() - start;
  if (badFiles.length > 0) {
    log('[' + index + '/' + total + '] WXSS escaped newline guard ... FAIL (' + elapsed + ' ms)');
    log('WXSS literal \\n found in:');
    for (var k = 0; k < badFiles.length; k++) {
      log('  ' + badFiles[k]);
    }
    return {
      pass: false,
      title: 'WXSS \\n guard',
      elapsed: elapsed,
      command: 'fs scan (inline)',
      exitCode: 1,
      stdout: '',
      stderr: 'WXSS literal backslash+n found in: ' + badFiles.join(', '),
      error: 'WXSS escaped newline guard failed'
    };
  }

  log('[' + index + '/' + total + '] WXSS escaped newline guard ... PASS (' + elapsed + ' ms)');
  log('WXSS escaped newline guard OK: 0 violations');
  return { pass: true, title: 'WXSS \\n guard', elapsed: elapsed, command: 'fs scan (inline)' };
}

// --- Main ---

function main() {
  var totalStart = Date.now();

  log('========================================');
  log(' Miniprogram checks');
  log('========================================');
  log('Node: ' + process.version);
  log('CWD:  ' + process.cwd());
  log('Checks: ' + TOTAL_CHECKS);
  log('');

  var results = [];
  var checkIndex = 1;

  // The declaration above is the executable P0 leaf contract. JSON runs these
  // eleven leaves only; normal mode then runs one smoke process after they pass.
  for (var leafIndex = 0; leafIndex < LEAF_CHECKS.length; leafIndex++) {
    var leaf = LEAF_CHECKS[leafIndex];
    results.push(runStep(checkIndex++, TOTAL_CHECKS, leaf.title, leaf.cmd, leaf.args));
  }
  results.push(checkJsSyntax(checkIndex++, TOTAL_CHECKS));

  // R3.91 calls the JSON leaf contract from smoke. Never put smoke in JSON.
  if (!JSON_MODE) {
    results.push(runStep(checkIndex++, TOTAL_CHECKS,
      'Smoke test', 'node', ['tools/miniprogram_smoke_test.js']));
  }

  // Summary computation
  var totalElapsed = Date.now() - totalStart;
  var passedCount = 0;
  var failedCount = 0;
  var failedStep = null;
  for (var i = 0; i < results.length; i++) {
    if (results[i].pass) {
      passedCount++;
    } else {
      failedCount++;
      if (!failedStep) failedStep = results[i].title;
    }
  }
  var allPassed = failedCount === 0;

  // --- JSON mode output ---
  if (JSON_MODE) {
    var checks = [];
    var failures = [];
    for (var j = 0; j < results.length; j++) {
      var result = results[j];
      checks.push({
        index: j + 1,
        name: result.title,
        ok: result.pass,
        durationMs: result.elapsed,
        command: result.command
      });
      if (!result.pass) {
        failures.push({
          index: j + 1,
          name: result.title,
          command: result.command,
          exitCode: typeof result.exitCode === 'number' ? result.exitCode : 1,
          stdout: result.stdout || '',
          stderr: result.stderr || '',
          error: result.error || ('Check failed: ' + result.title)
        });
      }
    }

    var jsonResult = {
      success: allPassed,
      ok: allPassed,
      totalChecks: results.length,
      passedChecks: passedCount,
      failedChecks: failedCount,
      durationMs: totalElapsed,
      environment: {
        node: process.version,
        cwd: process.cwd()
      },
      checks: checks,
      steps: checks,
      failures: failures
    };

    if (!allPassed) {
      jsonResult.failedStep = failedStep;
      jsonResult.nextStep = 'inspect the error above, fix the issue, then rerun node tools/run_miniprogram_checks.js';
      jsonResult.error = 'Check failed: ' + failedStep;
    }

    console.log(JSON.stringify(jsonResult, null, 2));
    process.exit(allPassed ? 0 : 1);
    return;
  }

  // --- Human-readable summary (unchanged) ---
  log('\n========================================');
  log(' Summary');
  log('========================================');
  for (var k = 0; k < results.length; k++) {
    var status = results[k].pass ? 'PASS' : 'FAIL';
    var timing = ' (' + results[k].elapsed + ' ms)';
    log('  [' + (k + 1) + '/' + results.length + '] ' + results[k].title + ': ' + status + timing);
  }

  log('');
  if (allPassed) {
    log('All miniprogram checks passed in ' + totalElapsed + ' ms');
    process.exit(0);
  } else {
    log('Miniprogram checks failed');
    log('Failed step: ' + failedStep);
    log('Next step: inspect the error above, fix the issue, then rerun node tools/run_miniprogram_checks.js');
    process.exit(1);
  }
}

main();
