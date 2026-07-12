// utils/mistakes-state.js
// R3.3 Pure read-model adapter for mistakes tab landing state.
//
// Reads wrong-question storage data and returns a view-model with the same
// shape that pages/mistakes/mistakes.js has always produced via its inline
// _loadState. No wx, no Page, no setData, no writes, no canonical data.
//
// Input: none (reads from storage internally)
// Output contract (stable):
//   {
//     wrongCount:     number (0+),
//     itpassCount:    number (0+),
//     sgCount:        number (0+),
//     lastWrongTime:  string (formatted date or '')
//   }
//
// Date formatting is intentionally self-contained — the page only ever needs
// the "M月D日" format for the last wrong time display.

var storage = require('./storage');

function formatDate(timestamp) {
  if (!timestamp) return '';
  var d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  return (d.getMonth() + 1) + '月' + d.getDate() + '日';
}

function getMistakesLandingState() {
  var count = 0;
  var stats = { itpass: 0, sg: 0 };
  var lastTime = null;

  try { count = storage.getWrongQuestionCount ? storage.getWrongQuestionCount() : 0; } catch (e) {}
  try { stats = storage.getWrongQuestionStats ? storage.getWrongQuestionStats() : { itpass: 0, sg: 0 }; } catch (e) {}
  try { lastTime = storage.getLastWrongTime ? storage.getLastWrongTime() : null; } catch (e) {}

  return {
    wrongCount: count || 0,
    itpassCount: (stats && stats.itpass) || 0,
    sgCount: (stats && stats.sg) || 0,
    lastWrongTime: formatDate(lastTime)
  };
}

module.exports = {
  getMistakesLandingState: getMistakesLandingState
};
