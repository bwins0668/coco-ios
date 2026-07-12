// tools/check_architecture_boundaries.js
// M3 Architecture Boundary Guardrails — read-only, PASS=0 / FAIL=1.
//
// Protects the Course Shell architecture boundary (R3.0):
//   1. Course / Organizer pages must NOT directly require utils/storage.js
//   2. Course / Organizer pages must NOT directly require canonical question data
//   3. Course / Organizer pages must NOT directly call setStorageSync / removeStorageSync
//   4. Organizer must get wrong/favorite state ONLY through course-question-state
//   5. Course page must NOT re-implement exact exam filtering
//   6. Complex Course / Organizer navigation must go through utils/navigation.js
//   7. Forbidden files must not appear in the current diff
//   8. No new storage keys must be introduced
//
// Scope: pages/course/**, pages/course-organize/**, pages/practice/**,
//        pages/mistakes/**, pages/glossary/**,
//        utils/course-question-state.js, utils/navigation.js.
//        Other pages (home, flashcards, profile)
//        are legacy and NOT evaluated by this checker.
//
// Never reads question bank text, never writes storage, never does broad repo grep.

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var FAIL = 0;
var failures = [];

// ---- Helpers ----

function readFileSafe(relPath) {
  var full = path.join(ROOT, relPath);
  try { return fs.readFileSync(full, 'utf8'); } catch (e) { return null; }
}

function fail(rule, file, detail) {
  failures.push({ rule: rule, file: file, detail: detail });
}

// ---- Boundary Rules ----

// Rule 1: Course / Organizer / Practice pages must NOT directly require utils/storage.js
function checkRule1() {
  var pages = ['pages/course/course.js', 'pages/course-organize/course-organize.js', 'pages/practice/practice.js'];
  for (var i = 0; i < pages.length; i++) {
    var src = readFileSafe(pages[i]);
    if (!src) { fail(1, pages[i], 'file not readable'); continue; }
    if (/require\s*\(\s*["']\.\.\/\.\.\/utils\/storage(\.js)?["']\s*\)/.test(src)) {
      fail(1, pages[i], 'directly requires utils/storage.js');
    }
  }
}

// Rule 2: Course / Organizer pages must NOT directly require canonical questions/decks
function checkRule2() {
  var pages = ['pages/course/course.js', 'pages/course-organize/course-organize.js'];
  var banned = [
    'questions', 'course_questions', 'flashcard-export', 'flashcard-manifest',
    'deck-manifest', 'past_exam_bank', 'flashcard_adapter', 'flashcard-enrichment'
  ];
  for (var i = 0; i < pages.length; i++) {
    var src = readFileSafe(pages[i]);
    if (!src) continue;
    for (var j = 0; j < banned.length; j++) {
      var re = new RegExp('require\\s*\\(\\s*["\'][^"\')]*' + banned[j] + '[^"\')]*["\']\\s*\\)');
      if (re.test(src)) {
        fail(2, pages[i], 'directly requires canonical data: ' + banned[j]);
      }
    }
  }
}

// Rule 3: Course / Organizer / Practice pages must NOT directly call setStorageSync / removeStorageSync
function checkRule3() {
  var pages = ['pages/course/course.js', 'pages/course-organize/course-organize.js', 'pages/practice/practice.js'];
  for (var i = 0; i < pages.length; i++) {
    var src = readFileSafe(pages[i]);
    if (!src) continue;
    if (/\bsetStorageSync\s*\(/.test(src)) {
      fail(3, pages[i], 'directly calls setStorageSync');
    }
    if (/\bremoveStorageSync\s*\(/.test(src)) {
      fail(3, pages[i], 'directly calls removeStorageSync');
    }
  }
}

// Rule 4: Organizer must get wrong/favorite state ONLY through course-question-state
function checkRule4() {
  var src = readFileSafe('pages/course-organize/course-organize.js');
  if (!src) { fail(4, 'pages/course-organize/course-organize.js', 'file not readable'); return; }
  if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/course-question-state["']\s*\)/.test(src)) {
    fail(4, 'pages/course-organize/course-organize.js', 'does NOT require course-question-state');
  }
  if (/\bgetWrongQuestions\b/.test(src)) {
    fail(4, 'pages/course-organize/course-organize.js', 'directly calls getWrongQuestions');
  }
  if (/\bgetFavoriteQuestions\b/.test(src)) {
    fail(4, 'pages/course-organize/course-organize.js', 'directly calls getFavoriteQuestions');
  }
}

// Rule 5: Course page must NOT re-implement exact exam filtering
function checkRule5() {
  var src = readFileSafe('pages/course/course.js');
  if (!src) { fail(5, 'pages/course/course.js', 'file not readable'); return; }
  var reBlock = /if\s*\(\s*\w+\s*===\s*["']itpass["']\s*\)[\s\S]*?["']sg["']/;
  if (reBlock.test(src)) {
    fail(5, 'pages/course/course.js', 're-implements exam branching (use navigation.js)');
  }
}

// Rule 6: Complex Course / Organizer navigation must go through utils/navigation.js
function checkRule6() {
  var pages = ['pages/course/course.js', 'pages/course-organize/course-organize.js'];
  for (var i = 0; i < pages.length; i++) {
    var src = readFileSafe(pages[i]);
    if (!src) continue;
    var reRawNavigate = /wx\.navigateTo\s*\(\s*\{[^}]*url\s*:\s*["']\/pages\/course/;
    if (reRawNavigate.test(src)) {
      fail(6, pages[i], 'raw wx.navigateTo to course path (use navigation.js)');
    }
    var reRawSwitch = /wx\.switchTab\s*\(\s*\{[^}]*url\s*:\s*["']\/pages\//;
    if (reRawSwitch.test(src)) {
      fail(6, pages[i], 'raw wx.switchTab (use navigation.js)');
    }
  }
}

// Rule 7: Forbidden files — informational, actual check in git diff flow
function checkRule7_info() {
  var forbiddenPatterns = [
    'utils/storage.js',
    'packages/quiz/data/questions.js',
    'packages/quiz/data/course_questions.js'
  ];
  console.log('  Rule 7 (forbidden files): checked via git diff --name-only in commit flow.');
  console.log('  Forbidden patterns: ' + forbiddenPatterns.join(', '));
}

// Rule 8: No new storage keys in scope files
function checkRule8() {
  var scopeFiles = [
    'pages/course/course.js',
    'pages/course-organize/course-organize.js',
    'utils/course-question-state.js',
    'utils/navigation.js'
  ];
  var knownKeys = [
    '"study-tools-mini-favorite-terms-v1"', "'study-tools-mini-favorite-terms-v1'",
    '"study-tools-mini-wrong-questions-v1"', "'study-tools-mini-wrong-questions-v1'",
    '"study-tools-mini-quiz-attempts-v1"', "'study-tools-mini-quiz-attempts-v1'",
    '"study-tools-mini-favorite-questions-v1"', "'study-tools-mini-favorite-questions-v1'"
  ];
  for (var i = 0; i < scopeFiles.length; i++) {
    var src = readFileSafe(scopeFiles[i]);
    if (!src) continue;
    if (/\bsetStorageSync\s*\(/.test(src)) {
      fail(8, scopeFiles[i], 'introduces setStorageSync (potential new storage key)');
    }
    var keyRe = /["'][\w-]+-v\d+["']/g;
    var match;
    while ((match = keyRe.exec(src)) !== null) {
      var key = match[0];
      var lineStart = src.lastIndexOf('\n', match.index) + 1;
      var lineEnd = src.indexOf('\n', match.index);
      if (lineEnd === -1) lineEnd = src.length;
      var line = src.substring(lineStart, lineEnd);
      if (/storage|setStorage|getStorage|FAVORITE|WRONG|QUIZ|ANKI/i.test(line)) {
        var isKnown = false;
        for (var k = 0; k < knownKeys.length; k++) {
          if (line.indexOf(knownKeys[k]) >= 0) { isKnown = true; break; }
        }
        if (!isKnown) {
          fail(8, scopeFiles[i], 'potential new storage key: ' + key);
        }
      }
    }
  }
}

// Rule 10: Mistakes page must use navigation intents, not inline wx.navigateTo
function checkRule10() {
  var src = readFileSafe('pages/mistakes/mistakes.js');
  if (!src) { fail(10, 'pages/mistakes/mistakes.js', 'file not readable'); return; }
  // Must NOT contain raw wx.navigateTo with inline mistake URLs
  if (/wx\.navigateTo\s*\(\s*\{[^}]*\/packages\/quiz\/pages\/mistakes\/mistakes/.test(src)) {
    fail(10, 'pages/mistakes/mistakes.js', 'inline navigateTo to mistakes (use nav.goMistakes)');
  }
  if (/wx\.navigateTo\s*\(\s*\{[^}]*anki-player.*source=mistakes/.test(src)) {
    fail(10, 'pages/mistakes/mistakes.js', 'inline navigateTo to anki-player?source=mistakes (use nav.goMistakesAnkiReview)');
  }
  if (/wx\.navigateTo\s*\(\s*\{[^}]*exam-menu.*exam=itpass/.test(src)) {
    fail(10, 'pages/mistakes/mistakes.js', 'inline navigateTo to exam-menu?exam=itpass (use nav.goItPassport)');
  }
}
// Rule 11: Glossary page must use navigation intents, not inline wx.navigateTo
function checkRule11() {
  var src = readFileSafe('pages/glossary/glossary.js');
  if (!src) { fail(11, 'pages/glossary/glossary.js', 'file not readable'); return; }
  if (/wx\.navigateTo\s*\(\s*\{[^}]*anki-player.*from=glossary/.test(src)) {
    fail(11, 'pages/glossary/glossary.js', 'inline navigateTo to anki-player?from=glossary (use nav.goGlossaryAnkiReview)');
  }
  if (/wx\.navigateTo\s*\(\s*\{[^}]*term-search.*random=1/.test(src)) {
    fail(11, 'pages/glossary/glossary.js', 'inline navigateTo to term-search?random=1 (use nav.goGlossaryRandomTerm)');
  }
}

// Rule 12: Mistakes page must use mistakes-state, not direct storage
function checkRule12() {
  var src = readFileSafe('pages/mistakes/mistakes.js');
  if (!src) { fail(12, 'pages/mistakes/mistakes.js', 'file not readable'); return; }
  if (/require\s*\(\s*["']\.\.\/\.\.\/utils\/storage/.test(src)) {
    fail(12, 'pages/mistakes/mistakes.js', 'directly requires storage (use mistakes-state)');
  }
  if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/mistakes-state/.test(src)) {
    fail(12, 'pages/mistakes/mistakes.js', 'does NOT require mistakes-state');
  }
  if (/\bgetWrongQuestionCount\b/.test(src) || /\bgetWrongQuestionStats\b/.test(src) || /\bgetLastWrongTime\b/.test(src)) {
    fail(12, 'pages/mistakes/mistakes.js', 'directly calls storage API (use mistakes-state)');
  }
}

// Rule 13: Glossary page must use glossary-state, not direct storage
function checkRule13() {
  var src = readFileSafe('pages/glossary/glossary.js');
  if (!src) { fail(13, 'pages/glossary/glossary.js', 'file not readable'); return; }
  if (/require\s*\(\s*["']\.\.\/\.\.\/utils\/storage/.test(src)) {
    fail(13, 'pages/glossary/glossary.js', 'directly requires storage (use glossary-state)');
  }
  if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/glossary-state/.test(src)) {
    fail(13, 'pages/glossary/glossary.js', 'does NOT require glossary-state');
  }
  if (/\bgetFavoriteTermCount\b/.test(src)) {
    fail(13, 'pages/glossary/glossary.js', 'directly calls storage API (use glossary-state)');
  }
}

// Rule 14: Flashcards page must use flashcards-state, not direct canonical/wx
function checkRule14() {
  var src = readFileSafe('pages/flashcards/flashcards.js');
  if (!src) { fail(14, 'pages/flashcards/flashcards.js', 'file not readable'); return; }
  if (/require\s*\(\s*['"]\.\.\/\.\.\/data\/flashcard-summary-manifest/.test(src)) {
    fail(14, 'pages/flashcards/flashcards.js', 'directly requires flashcard-summary-manifest (use flashcards-state)');
  }
  if (/wx\.getStorageSync/.test(src)) {
    fail(14, 'pages/flashcards/flashcards.js', 'directly calls wx.getStorageSync (use flashcards-state)');
  }
  if (!/require\s*\(\s*['"]\.\.\/\.\.\/utils\/flashcards-state/.test(src)) {
    fail(14, 'pages/flashcards/flashcards.js', 'does NOT require flashcards-state');
  }
}

// Rule 15: Profile page must use profile-commands for data mutations
function checkRule15() {
  var src = readFileSafe('pages/profile/profile.js');
  if (!src) { fail(15, 'pages/profile/profile.js', 'file not readable'); return; }
  if (/\bstorage\.clearQuizAttempts\s*\(/.test(src))
    fail(15, 'pages/profile/profile.js', 'directly calls storage.clearQuizAttempts (use profile-commands)');
  if (/\bstorage\.clearAllLocalUserData\s*\(/.test(src))
    fail(15, 'pages/profile/profile.js', 'directly calls storage.clearAllLocalUserData (use profile-commands)');
  if (/\bstorage\.importLocalBackup\s*\(/.test(src))
    fail(15, 'pages/profile/profile.js', 'directly calls storage.importLocalBackup (use profile-commands)');
  if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/profile-commands/.test(src))
    fail(15, 'pages/profile/profile.js', 'does NOT require profile-commands');
}

// Rule 16: Home page must not directly wx.getStorageSync/setStorageSync for streak
function checkRule16() {
  var src = readFileSafe('pages/home/home.js');
  if (!src) { fail(16, 'pages/home/home.js', 'file not readable'); return; }
  if (/wx\.(get|set)StorageSync\s*\(\s*['"]study-tools-mini-streak/.test(src))
    fail(16, 'pages/home/home.js', 'directly accesses streak key via wx (use home-streak-persistence)');
  if (!/require\s*\(\s*['"]\.\.\/\.\.\/utils\/home-streak-persistence/.test(src))
    fail(16, 'pages/home/home.js', 'does NOT require home-streak-persistence');
}

function checkRule9() {
  var src = readFileSafe('pages/practice/practice.js');
  if (!src) { fail(9, 'pages/practice/practice.js', 'file not readable'); return; }
  if (!/require\s*\(\s*["']\.\.\/\.\.\/utils\/practice-state["']\s*\)/.test(src)) {
    fail(9, 'pages/practice/practice.js', 'does NOT require practice-state');
  }
  if (/\bgetLastAttempt\b/.test(src)) {
    fail(9, 'pages/practice/practice.js', 'directly calls getLastAttempt (use practice-state)');
  }
}

// ---- Run All Checks ----

function run() {
  console.log('=== Architecture Boundary Guardrails (M3+R3.1) ===\n');
  console.log('Scope: pages/course/**, pages/course-organize/**, pages/practice/**');
  console.log('       utils/course-question-state.js, utils/navigation.js\n');

  checkRule1();
  checkRule2();
  checkRule3();
  checkRule4();
  checkRule5();
  checkRule6();
  checkRule7_info();
  checkRule8();
  checkRule9();
  checkRule10();
  checkRule11();
  checkRule12();
  checkRule13();
  checkRule14();
  checkRule15();
  checkRule16();

  console.log('\n--- Results ---');
  if (failures.length === 0) {
    console.log('ALL BOUNDARIES INTACT');
    console.log('PASS');
    return 0;
  }

  console.log('BOUNDARY VIOLATIONS DETECTED (' + failures.length + '):\n');
  for (var i = 0; i < failures.length; i++) {
    var f = failures[i];
    console.log('  [' + f.rule + '] ' + f.file + ': ' + f.detail);
  }
  console.log('\nFAIL');
  return 1;
}

var exitCode = run();
process.exit(exitCode);
