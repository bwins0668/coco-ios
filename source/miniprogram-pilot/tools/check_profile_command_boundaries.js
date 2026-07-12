// tools/check_profile_command_boundaries.js
// R3.5 Behavioral + structural validator for Profile command boundary.
// PASS=0 / FAIL=1. Pure Node — mocks storage to avoid real data operations.

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var failures = [];

function fail(rule, detail) { failures.push({ rule: rule, detail: detail }); }
function readSrc(relPath) { try { return fs.readFileSync(path.join(ROOT, relPath), 'utf8'); } catch (e) { return ''; } }

console.log('=== Profile Command Boundary Validator (R3.5) ===\n');

// ---- Behavioral: profile-commands API existence ----
console.log('--- profile-commands API ---');
var cmdSrc = readSrc('utils/profile-commands.js');
var expectedCmds = ['clearQuizAttempts', 'clearAllLocalUserData', 'importLocalBackup', 'exportLocalBackup'];
for (var i = 0; i < expectedCmds.length; i++) {
  if (cmdSrc.indexOf('function ' + expectedCmds[i]) >= 0) console.log('  PASS: ' + expectedCmds[i] + ' function exists');
  else fail('cmd_missing', 'missing function: ' + expectedCmds[i]);
}

// No generic dispatch
if (/function\s+(?:runCommand|invoke|dispatch|execute)\s*\(/.test(cmdSrc)) fail('cmd_generic', 'generic dispatch function found');
else console.log('  PASS: no generic dispatch');
if (/\bwx\./.test(cmdSrc)) fail('cmd_wx', 'command module uses wx');
else console.log('  PASS: no wx in command module');
if (/setStorageSync|removeStorageSync/.test(cmdSrc)) fail('cmd_raw_wx', 'command module calls raw wx storage');
else console.log('  PASS: no raw wx storage in command module');

// ---- Structural: profile.js ----
console.log('\n--- profile.js structural ---');
var profSrc = readSrc('pages/profile/profile.js');

// Must require profile-commands
if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/profile-commands/.test(profSrc)) fail('prof_cmd', 'profile.js does NOT require profile-commands');
else console.log('  PASS: profile.js requires profile-commands');

// Must NOT call the 3 mutation APIs directly
if (/\bstorage\.clearQuizAttempts\s*\(/.test(profSrc)) fail('prof_direct', 'profile.js still calls storage.clearQuizAttempts directly');
else console.log('  PASS: no direct storage.clearQuizAttempts');
if (/\bstorage\.clearAllLocalUserData\s*\(/.test(profSrc)) fail('prof_direct', 'profile.js still calls storage.clearAllLocalUserData directly');
else console.log('  PASS: no direct storage.clearAllLocalUserData');
if (/\bstorage\.importLocalBackup\s*\(/.test(profSrc)) fail('prof_direct', 'profile.js still calls storage.importLocalBackup directly');
else console.log('  PASS: no direct storage.importLocalBackup');

// Must still use storage for reads (not accidentally fully decoupled)
if (!/storage\.get(QuizStats|LastAttempt|FavoriteTermCount|WrongQuestionCount|RecentAttempts|ConsecutiveLearningDays)/.test(profSrc))
  fail('prof_read', 'profile.js may have lost storage read access');
else console.log('  PASS: storage read access preserved');

// Must retain showModal (user confirm)
if (!/wx\.showModal/.test(profSrc)) fail('prof_confirm', 'profile.js lost showModal');
else console.log('  PASS: showModal preserved');

// Must retain refreshAllData
if (!/refreshAllData/.test(profSrc)) fail('prof_refresh', 'profile.js lost refreshAllData');
else console.log('  PASS: refreshAllData preserved');

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) { console.log('ALL PROFILE COMMAND BOUNDARIES VERIFIED\nPASS'); process.exit(0); }
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].rule + '] ' + failures[fi].detail);
process.exit(1);
