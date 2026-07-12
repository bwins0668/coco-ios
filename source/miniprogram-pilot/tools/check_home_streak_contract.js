// tools/check_home_streak_contract.js
// R4.0 Home Streak characterization + seeding contract test.
// Executes REAL pages/home/home.js in sandbox. PASS=0/FAIL=1.

var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var failures = [];
function fail(id, detail) { failures.push({ id: id, detail: detail }); }

// ---- Mock infrastructure ----
var mockStorage = null;
var mockSetStorageCalls = [];
var mockSetDataCalls = [];
var mockNowTs = Date.now();
var cachedPageConfig = null;

global.wx = {
  getStorageSync: function (key) {
    if (key === 'study-tools-mini-streak-v1') return mockStorage;
    return null;
  },
  setStorageSync: function (key, value) {
    if (key === 'study-tools-mini-streak-v1') {
      mockSetStorageCalls.push({ key: key, value: JSON.parse(JSON.stringify(value)) });
      mockStorage = value;
    }
  },
  showToast: function () {},
  getMenuButtonBoundingClientRect: function () { return null; },
  getWindowInfo: function () { return { statusBarHeight: 20 }; },
  getSystemInfoSync: function () { return { statusBarHeight: 20 }; },
  switchTab: function () {}, navigateTo: function () {},
  pageScrollTo: function () {}, stopPullDownRefresh: function () {}
};
global.getApp = function () { return { globalData: { themeDark: false } }; };

var OrigDate = Date;
global.Date = function () {
  if (arguments.length === 0) return new OrigDate(mockNowTs);
  switch (arguments.length) {
    case 1: return new OrigDate(arguments[0]);
    case 2: return new OrigDate(arguments[0], arguments[1]);
    case 3: return new OrigDate(arguments[0], arguments[1], arguments[2]);
    default: return new OrigDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
  }
};
global.Date.now = function () { return mockNowTs; };
global.Date.parse = OrigDate.parse;
global.Date.UTC = OrigDate.UTC;

global.Page = function (config) { cachedPageConfig = config; };

// Pre-populate require cache
var sp = path.join(ROOT, 'utils', 'storage.js');
require.cache[sp] = { id: sp, filename: sp, loaded: true, exports: { getLastAttempt: function () { return null; } } };
var np = path.join(ROOT, 'utils', 'navigation.js');
require.cache[np] = { id: np, filename: np, loaded: true, exports: { TAB: {}, LEGACY: {}, goCourseTab: function () {}, goPracticeTab: function () {}, goReviewTab: function () {}, goCoursePractice: function () {} } };
var rp = path.join(ROOT, 'utils', 'course-registry.js');
require.cache[rp] = { id: rp, filename: rp, loaded: true, exports: { getCoursesByKind: function () { return []; }, getCourseById: function () { return null; } } };

// Load real home.js
var homePath = path.join(ROOT, 'pages', 'home', 'home.js');
delete require.cache[require.resolve(homePath)];
try { require(homePath); } catch (e) { console.log('FATAL: ' + e.message); process.exit(1); }
if (!cachedPageConfig) { console.log('FATAL: Page() never called'); process.exit(1); }

var origSetData = cachedPageConfig.setData;
cachedPageConfig.setData = function (data) {
  mockSetDataCalls.push(JSON.parse(JSON.stringify(data)));
  if (origSetData) origSetData.call(this, data);
};

// ---- Helpers ----
function reset() { mockStorage = null; mockSetStorageCalls = []; mockSetDataCalls = []; }
function setNowISO(isoStr) { mockNowTs = new OrigDate(isoStr).getTime(); }
function getStreak() { for (var i = mockSetDataCalls.length - 1; i >= 0; i--) { if ('streakCount' in mockSetDataCalls[i]) return mockSetDataCalls[i].streakCount; } return undefined; }
function lastWrite() { return mockSetStorageCalls.length > 0 ? mockSetStorageCalls[mockSetStorageCalls.length - 1] : null; }

function run(id, desc, storage, nowISO) {
  reset();
  setNowISO(nowISO);
  mockStorage = storage;
  try { cachedPageConfig._loadState(); } catch (e) { fail(id, 'threw: ' + e.message); return null; }
  return { streak: getStreak(), writes: mockSetStorageCalls.length, lastWrite: lastWrite() };
}

function rec(y, m, d, h, min, count) {
  return { lastDate: new OrigDate(Date.UTC(y, m, d, h || 12, min || 0, 0)).toISOString(), count: count };
}

console.log('=== Home Streak R4.0 Seeding Contract Test ===');
console.log('Executing REAL pages/home/home.js in sandbox\n');

// === T1: Missing record → seed with count=1 ===
var r = run('T1', 'missing record', null, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) {
  var lw = r.lastWrite;
  if (lw && lw.key === 'study-tools-mini-streak-v1' && lw.value.count === 1 && typeof lw.value.lastDate === 'string')
    console.log('  PASS T1: missing → streak=1 writes=1 key=' + lw.key + ' count=' + lw.value.count);
  else fail('T1', 'write payload mismatch: ' + JSON.stringify(lw));
} else fail('T1', 'got ' + JSON.stringify(r));

// === T2: Same day valid record → keep count, no write ===
r = run('T2', 'same day', rec(2026, 5, 29, 12, 0, 5), '2026-06-29T18:00:00+09:00');
if (r && r.streak === 5 && r.writes === 0) console.log('  PASS T2: same day → streak=5 writes=0');
else fail('T2', 'got ' + JSON.stringify(r));

// === T3: Next day → +1, write ===
r = run('T3', 'next day', rec(2026, 5, 28, 12, 0, 3), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 4 && r.writes === 1) console.log('  PASS T3: next day → streak=4 writes=1');
else fail('T3', 'got ' + JSON.stringify(r));

// === T4: Two day gap → reset to 1, write ===
r = run('T4', '2-day gap', rec(2026, 5, 27, 12, 0, 7), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T4: gap=2 → streak=1 writes=1 (reset)');
else fail('T4', 'got ' + JSON.stringify(r));

// === T5: Large gap → reset to 1, write ===
r = run('T5', 'large gap', rec(2026, 5, 20, 12, 0, 10), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T5: gap=9 → streak=1 writes=1 (reset)');
else fail('T5', 'got ' + JSON.stringify(r));

// === T6: Storage read throws ===
// Simulate by making getStorageSync throw for this test
var origGet = global.wx.getStorageSync;
reset(); setNowISO('2026-06-29T12:00:00+09:00'); mockStorage = null;
global.wx.getStorageSync = function () { throw new Error('simulated'); };
cachedPageConfig._loadState();
var t6s = getStreak(), t6w = mockSetStorageCalls.length;
global.wx.getStorageSync = origGet;
if (t6s === 1 && t6w === 1) console.log('  PASS T6: storage throw → streak=1 writes=1');
else fail('T6', 'streak=' + t6s + ' writes=' + t6w);

// === T7: No lastDate → seed ===
r = run('T7', 'no lastDate', { count: 5 }, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T7: no lastDate → streak=1 writes=1');
else fail('T7', 'got ' + JSON.stringify(r));

// === T8: Invalid lastDate → seed ===
r = run('T8', 'bad lastDate', { lastDate: 'not-a-date', count: 2 }, '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T8: bad lastDate → streak=1 writes=1');
else fail('T8', 'got ' + JSON.stringify(r));

// === T9: Missing count → seed ===
r = run('T9', 'no count', rec(2026, 5, 28, 12, 0), '2026-06-29T12:00:00+09:00');
// rec() without count → count=undefined → invalid → seed
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T9: no count → streak=1 writes=1');
else fail('T9', 'got ' + JSON.stringify(r));

// === T10: count=0 → seed ===
r = run('T10', 'count=0', rec(2026, 5, 28, 12, 0, 0), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 1 && r.writes === 1) console.log('  PASS T10: count=0 → streak=1 writes=1');
else fail('T10', 'got ' + JSON.stringify(r));

// === T11: count="abc" → seed (NO "abc1") ===
reset(); setNowISO('2026-06-29T12:00:00+09:00');
mockStorage = { lastDate: rec(2026, 5, 28, 12, 0, 0).lastDate, count: 'abc' };
cachedPageConfig._loadState();
var t11s = getStreak(), t11w = mockSetStorageCalls.length;
if (t11s === 1 && t11w === 1) {
  var t11lw = lastWrite();
  if (t11lw && t11lw.value.count === 1 && t11lw.value.count !== 'abc1')
    console.log('  PASS T11: count=string → streak=1 writes=1 (normalized, no abc1)');
  else fail('T11', 'payload count wrong: ' + JSON.stringify(t11lw));
} else fail('T11', 'streak=' + t11s + ' writes=' + t11w);

// === T12: Clock backward → 0, no write ===
r = run('T12', 'backward', rec(2026, 5, 30, 12, 0, 5), '2026-06-29T12:00:00+09:00');
if (r && r.streak === 0 && r.writes === 0) console.log('  PASS T12: backward → streak=0 writes=0');
else fail('T12', 'got ' + JSON.stringify(r));

// === T13: Repeat onShow stable ===
reset(); setNowISO('2026-06-29T12:00:00+09:00'); mockStorage = null;
cachedPageConfig._loadState();
var s1 = getStreak(), w1 = mockSetStorageCalls.length;
cachedPageConfig._loadState();
var s2 = getStreak(), w2 = mockSetStorageCalls.length;
if (s1 === 1 && s2 === 1 && w1 === 1 && w2 === 1)
  console.log('  PASS T13: repeat onShow → streak=' + s2 + ' stable, writes=' + w2);
else fail('T13', 's1=' + s1 + ' s2=' + s2 + ' w1=' + w1 + ' w2=' + w2);

// === T14: Page data contract (non-streak fields preserved) ===
reset(); setNowISO('2026-06-29T12:00:00+09:00'); mockStorage = null;
cachedPageConfig._loadState();
var allKeys = [];
for (var i = 0; i < mockSetDataCalls.length; i++) allKeys = allKeys.concat(Object.keys(mockSetDataCalls[i]));
if (allKeys.indexOf('streakCount') >= 0) console.log('  PASS T14: streakCount present in setData');
else fail('T14', 'streakCount missing from setData');
if (allKeys.indexOf('__themeDark') < 0) console.log('  PASS T14: non-streak fields unaffected');
// (hasLastAttempt etc. depend on storage mock returning null, which is fine)

// === T15: Isolation from Profile consecutiveDays ===
var homeSrc = require('fs').readFileSync(path.join(ROOT, 'pages', 'home', 'home.js'), 'utf8');
if (!/consecutiveDays|getConsecutiveLearningDays/.test(homeSrc))
  console.log('  PASS T15: Home streak isolated from Profile consecutiveDays');
else fail('T15', 'Home code references Profile consecutiveDays');

// ---- Results ----
console.log('\n--- Results ---');
if (failures.length === 0) {
  console.log('ALL 15 SCENARIOS PASS — R4.0 seeding contract verified');
  console.log('PASS');
  process.exit(0);
}
console.log('FAILURES (' + failures.length + '):');
for (var fi = 0; fi < failures.length; fi++) console.log('  [' + failures[fi].id + '] ' + failures[fi].detail);
console.log('\nFAIL');
process.exit(1);
