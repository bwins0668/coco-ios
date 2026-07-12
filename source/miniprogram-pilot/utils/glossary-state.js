// utils/glossary-state.js
// R3.3 Pure read-model adapter for glossary tab landing state.
//
// Reads favorite-term storage data and returns a view-model with the same
// shape that pages/glossary/glossary.js has always produced. No wx, no Page,
// no setData, no writes, no canonical term data.
//
// Input: none (reads from storage internally)
// Output contract (stable):
//   {
//     favoriteCount: number (0+)
//   }

var storage = require('./storage');

function getGlossaryLandingState() {
  var count = 0;
  try { count = storage.getFavoriteTermCount ? storage.getFavoriteTermCount() : 0; } catch (e) {}
  return { favoriteCount: count || 0 };
}

module.exports = {
  getGlossaryLandingState: getGlossaryLandingState
};
