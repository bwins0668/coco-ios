'use strict';

var meta = require('./meta');
var PLAYABLE_BY_YEAR = { '04_haru': 99, '05_haru': 99, '06_haru': 99 };
var DECK_MAP = {};

for (var i = 0; i < meta.years.length; i++) {
  var year = meta.years[i];
  var deckId = year.exam + '/' + year.yearId;
  var sourceCountExpected = Number(year.count || 0);
  var playableCountExpected = Number(PLAYABLE_BY_YEAR[year.yearId] || sourceCountExpected);
  DECK_MAP[deckId] = {
    deckId: deckId,
    course: year.exam,
    yearId: year.yearId,
    yearLabel: year.label,
    sourceCountExpected: sourceCountExpected,
    playableCountExpected: playableCountExpected,
    rawExpectedCount: sourceCountExpected,
    renderableExpectedCount: playableCountExpected,
    sourceType: 'past_exam_japanese'
  };
}

function getDeckInfo(deckId) { return DECK_MAP[deckId] || null; }
function getAllLocalDecks() {
  var result = [];
  for (var key in DECK_MAP) {
    if (Object.prototype.hasOwnProperty.call(DECK_MAP, key)) result.push(DECK_MAP[key]);
  }
  return result;
}

module.exports = { getDeckInfo: getDeckInfo, getAllLocalDecks: getAllLocalDecks, meta: meta };
