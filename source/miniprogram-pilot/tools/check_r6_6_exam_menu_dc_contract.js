/**
 * tools/check_r6_6_exam_menu_dc_contract.js
 * R6.6A.1.4: Verifiable DC contract for exam-menu.
 * Usage: node tools/check_r6_6_exam_menu_dc_contract.js [--root <dir>]
 * Without --root, uses the repository root (__dirname/..).
 * With --root, reads all exam-menu files from <dir>/packages/quiz/pages/exam-menu/.
 */

var fs = require('fs');
var path = require('path');

// Parse --root
var rootDir = null;
var args = process.argv.slice(2);
for (var i = 0; i < args.length; i++) {
  if (args[i] === '--root' && args[i + 1]) {
    rootDir = path.resolve(args[i + 1]);
    i++;
  }
}
if (!rootDir) rootDir = path.resolve(__dirname, '..');

// Verify root exists
if (!fs.existsSync(rootDir)) {
  console.error('ERROR: root directory does not exist: ' + rootDir);
  process.exit(2);
}

var MENU_DIR = path.join(rootDir, 'packages', 'quiz', 'pages', 'exam-menu');

// Verify exam-menu directory exists
if (!fs.existsSync(MENU_DIR)) {
  console.error('ERROR: exam-menu directory not found at: ' + MENU_DIR);
  process.exit(2);
}

var errors = [];
var passes = [];

function fail(msg) { errors.push(msg); }
function pass(msg) { passes.push(msg); }
function read(f) {
  var filePath = path.join(MENU_DIR, f);
  if (!fs.existsSync(filePath)) { fail('file missing: ' + f); return ''; }
  try { return fs.readFileSync(filePath, 'utf8'); } catch (e) { fail('cannot read ' + f + ': ' + e.message); return ''; }
}

var jsonText = read('exam-menu.json');
var cfg = {};
try { cfg = JSON.parse(jsonText); } catch (e) { fail('cannot parse page.json: ' + e.message); }

var wxml = read('exam-menu.wxml');
var wxss = read('exam-menu.wxss');
var js = read('exam-menu.js');

console.log('=== R6.6 Exam Menu DC Contract ===');
console.log('Root: ' + rootDir);
console.log('');

// 1. Custom navigation
if (cfg.navigationStyle === 'custom') pass('navigationStyle: custom');
else fail('navigationStyle must be custom, got: ' + (cfg.navigationStyle || 'default'));

if (wxml.indexOf('r6-exam-nav') >= 0) pass('WXML custom nav header');
else fail('WXML missing r6-exam-nav header');

var hasLegacyNavigateBack = js.indexOf('navigateBack') >= 0;
var hasSecondaryFallbackBack = js.indexOf("secondaryNav.back(this, 'packages/quiz/pages/exam-menu/exam-menu')") >= 0;
if (wxml.indexOf('goBack') >= 0 && js.indexOf('goBack') >= 0 && (hasLegacyNavigateBack || hasSecondaryFallbackBack))
  pass('goBack handler: WXML bound + JS defined + stack/direct-entry fallback');
else
  fail('goBack incomplete: wxml=' + (wxml.indexOf('goBack') >= 0) +
    ' jsHandler=' + (js.indexOf('goBack') >= 0) +
    ' navigateBack=' + hasLegacyNavigateBack +
    ' secondaryFallback=' + hasSecondaryFallbackBack);

// 2. navSafeTop — must use real system API
if (wxml.indexOf('navSafeTop') >= 0) pass('navSafeTop in WXML');
else fail('navSafeTop missing from WXML');

if (js.indexOf('getMenuButtonBoundingClientRect') >= 0)
  pass('navSafeTop uses real system API (getMenuButtonBoundingClientRect)');
else
  fail('navSafeTop must use getMenuButtonBoundingClientRect, not hardcoded value only');

// 3. Stats area — real data bindings
var hasOA = wxml.indexOf('overallAccuracy') >= 0 && js.indexOf('overallAccuracy') >= 0;
var hasOT = wxml.indexOf('overallTotal') >= 0 && js.indexOf('overallTotal') >= 0;
var hasLP = wxml.indexOf('lastPracticeText') >= 0 && js.indexOf('lastPracticeText') >= 0;

if (hasOA) pass('overallAccuracy: WXML + JS');
else fail('overallAccuracy missing: wxml=' + (wxml.indexOf('overallAccuracy') >= 0) + ' js=' + (js.indexOf('overallAccuracy') >= 0));
if (hasOT) pass('overallTotal: WXML + JS');
else fail('overallTotal missing: wxml=' + (wxml.indexOf('overallTotal') >= 0) + ' js=' + (js.indexOf('overallTotal') >= 0));
if (hasLP) pass('lastPracticeText: WXML + JS');
else fail('lastPracticeText missing: wxml=' + (wxml.indexOf('lastPracticeText') >= 0) + ' js=' + (js.indexOf('lastPracticeText') >= 0));

// Verify JS has real setData paths (not just data declarations)
if (js.indexOf('setData') >= 0 && (js.indexOf('overallTotal') >= 0 || js.indexOf('overallAccuracy') >= 0))
  pass('stats have real setData assignments');
else
  fail('stats may lack real setData: check onShow/onLoad for setData with overallTotal/Accuracy');

// 4. State branches — real conditionals
var hasDataBranch = wxml.indexOf('overallTotal > 0') >= 0;
var hasEmptyBranch = wxml.indexOf('overallTotal === 0') >= 0;
if (hasDataBranch) pass('conditional: overallTotal > 0 (has data)');
else fail('missing overallTotal > 0 conditional');
if (hasEmptyBranch) pass('conditional: overallTotal === 0 (empty state)');
else fail('missing overallTotal === 0 conditional');

// Suggestion must have wx:if based on real data
if (wxml.indexOf('suggestion') >= 0 && (wxml.indexOf('wx:if') >= 0 || wxml.indexOf('wx:elif') >= 0))
  pass('suggestion uses real conditional rendering');
else
  fail('suggestion may be unconditional — missing wx:if/wx:elif guard');

// 5. Practice entry handlers
var handlers = [
  { name: 'goLessonQuiz', check: wxml.indexOf('goLessonQuiz') >= 0 && js.indexOf('goLessonQuiz') >= 0 && js.indexOf('goLessonQuiz') >= 0 },
  { name: 'goPastExam', check: wxml.indexOf('goPastExam') >= 0 && js.indexOf('goPastExam') >= 0 && js.indexOf('goPastExam') >= 0 },
  { name: 'goFlashcardCourse', check: wxml.indexOf('goFlashcardCourse') >= 0 && js.indexOf('goFlashcardCourse') >= 0 && js.indexOf('goFlashcardCourse') >= 0 }
];
handlers.forEach(function (h) {
  if (h.check) pass('practice handler: ' + h.name + ' (WXML + JS)');
  else fail('practice handler broken: ' + h.name);
});

if (js.indexOf('wx.navigateTo') >= 0) pass('practice handlers use wx.navigateTo');
else fail('practice handlers must use real navigation');

// 6. Past exam year selection — MUST be preserved
var hasToggle = wxml.indexOf('togglePastExamList') >= 0 && js.indexOf('togglePastExamList') >= 0;
var hasYearChip = wxml.indexOf('goPastExamYear') >= 0 && js.indexOf('goPastExamYear') >= 0;
var hasYearData = wxml.indexOf('data-year-id') >= 0;
var hasCatchtap = wxml.indexOf('catchtap=\"goPastExamYear\"') >= 0;
var hasGetRoute = js.indexOf('pastExamIndex.getRoute') >= 0;
var hasNavigate = js.indexOf('wx.navigateTo') >= 0;

if (hasToggle && hasYearChip && hasYearData && hasCatchtap)
  pass('year selection: toggle + chips + catchtap + data-year-id all present');
else {
  fail('year selection BROKEN: toggle=' + hasToggle + ' chip=' + hasYearChip + ' data=' + hasYearData + ' catchtap=' + hasCatchtap);
}

if (hasGetRoute) pass('year selection: resolves via pastExamIndex.getRoute');
else fail('year selection missing pastExamIndex.getRoute');

if (hasNavigate) pass('year selection: navigates to real quiz route');
else fail('year selection missing wx.navigateTo');

// Verify goPastExamYear uses real dataset + navigateTo
if (js.indexOf('goPastExamYear') >= 0 && js.indexOf('currentTarget') >= 0)
  pass('goPastExamYear uses event.currentTarget (safe event isolation)');
else
  fail('goPastExamYear should use currentTarget.dataset for event isolation');

// 7. WXSS — QP shell
var hasCanvas = wxss.indexOf('qp-color-canvas') >= 0 || wxss.indexOf('#F2EDE0') >= 0;
if (hasCanvas) pass('QP canvas background');
else fail('missing QP canvas background');

if (wxss.indexOf('safe-area-inset-bottom') >= 0 || wxml.indexOf('navSafeTop') >= 0)
  pass('safe-area handling present');
else
  fail('missing safe-area handling');

// No custom-tab-bar
if (wxml.indexOf('custom-tab-bar') < 0) pass('no custom-tab-bar (secondary page)');
else fail('secondary page must not bind custom-tab-bar');

// No hidden test anchors
if (wxml.indexOf('display:none') < 0 && wxss.indexOf('display:none') < 0)
  pass('no display:none hidden anchors');
else
  fail('contains display:none — possible hidden test anchor');

// 8. File existence check (redundant with read(), but explicit)
var files = ['exam-menu.json', 'exam-menu.wxml', 'exam-menu.wxss', 'exam-menu.js'];
var allFilesExist = true;
files.forEach(function (f) {
  if (!fs.existsSync(path.join(MENU_DIR, f))) { fail('file missing: ' + f); allFilesExist = false; }
});
if (allFilesExist) pass('all 4 exam-menu files present');

// ---- Report ----
console.log('');
console.log('Results: ' + passes.length + ' passed, ' + errors.length + ' failed');
if (errors.length > 0) {
  console.log('\nErrors:');
  errors.forEach(function (e) { console.log('  \u2717 ' + e); });
  console.log('\n[FAIL] exam-menu DC contract not met');
  process.exit(1);
} else {
  console.log('\n[PASS] exam-menu DC contract verified');
  process.exit(0);
}
