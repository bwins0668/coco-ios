// utils/flashcards-persistence.js
// R3.4 Narrow, read-only persistence adapter for the Flashcards page.
//
// Only reads the TWO specific wx storage keys that flashcards.js has always
// accessed directly. No writes. No arbitrary-key access. No wx outside this
// file. The module IS the only place where wx.getStorageSync is called for
// flashcard-specific data — it is NOT a general storage wrapper.
//
// Keys (both read-only, no writes):
//   flashcard_progress_v1       → last flashcard progress snapshot
//   study-tools-mini-favorite-terms-v1 → anki favorite term list
//
// All returns are safe: never throws, always returns defaults on failure.

function readFlashcardProgress() {
  try {
    var raw = wx.getStorageSync('flashcard_progress_v1');
    if (raw && typeof raw === 'object') return raw;
    return null;
  } catch (e) {
    return null;
  }
}

function readAnkiFavoriteTerms() {
  try {
    var arr = wx.getStorageSync('study-tools-mini-favorite-terms-v1');
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

module.exports = {
  readFlashcardProgress: readFlashcardProgress,
  readAnkiFavoriteTerms: readAnkiFavoriteTerms
};
