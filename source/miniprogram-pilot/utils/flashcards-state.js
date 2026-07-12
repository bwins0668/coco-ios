// utils/flashcards-state.js
// R3.4 Pure read-model for the Flashcards landing page.
//
// Combines:
//   - Canonical flashcard-summary-manifest (playable counts)
//   - Local flashcard progress (via persistence adapter)
//   - Anki favorite count (via persistence adapter)
//
// Returns a view-model with the exact same shape that
// pages/flashcards/flashcards.js has always produced via its inline methods.
//
// No wx, no Page, no setData, no writes, no navigation.

var manifest = require('./flashcard-summary-manifest');
var persistence = require('./flashcards-persistence');

function formatTimeAgo(ts) {
  if (!ts) return '';
  var now = Date.now();
  var diff = now - ts;
  if (diff < 0) return '';
  var minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return minutes + ' 分钟前';
  var hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' 小时前';
  var days = Math.floor(hours / 24);
  if (days < 7) return days + ' 天前';
  var d = new Date(ts);
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function getFlashcardsLandingState() {
  // ---- Deck stats (canonical summary, numbers only) ----
  var itpassCount = 0;
  var sgCount = 0;
  try {
    itpassCount = (manifest.itpass && manifest.itpass.playableCount) || 0;
    sgCount = (manifest.sg && manifest.sg.playableCount) || 0;
  } catch (e) {}

  // ---- Flashcard progress (local persistence) ----
  var hasLastProgress = false;
  var lastProgress = null;
  try {
    var progress = persistence.readFlashcardProgress();
    if (progress) {
      hasLastProgress = true;
      lastProgress = {
        course: progress.course || progress.exam || '',
        exam: progress.course || progress.exam || '',
        examTitle: progress.examTitle || '',
        deckLabel: progress.deckLabel || '年度模拟',
        currentIndex: progress.currentIndex || 0,
        total: progress.total || 0,
        lastTimeText: formatTimeAgo(progress.updatedAt)
      };
    }
  } catch (e) {}

  // ---- Anki stats (local persistence) ----
  var ankiFavoriteCount = 0;
  try {
    var terms = persistence.readAnkiFavoriteTerms();
    ankiFavoriteCount = terms.length;
  } catch (e) {}

  // ---- Courses (static with counts) ----
  var courses = [
    {
      exam: 'itpass',
      iconKey: 'document',
      title: 'IT Passport 闪卡',
      desc: '年度模拟 / 分类 / 错题 / 收藏',
      tags: ['IT', '年度模拟', '日语'],
      mockCount: itpassCount,
      mastered: 0,
      pending: 0
    },
    {
      exam: 'sg',
      iconKey: 'shield',
      title: 'SG 闪卡',
      desc: '年度模拟 / 分类 / 错题 / 收藏',
      tags: ['SG', '年度模拟', '日语'],
      mockCount: sgCount,
      mastered: 0,
      pending: 0
    }
  ];

  return {
    hasLastProgress: hasLastProgress,
    lastProgress: lastProgress,
    courses: courses,
    ankiFavoriteCount: ankiFavoriteCount,
    itpassCount: itpassCount,
    sgCount: sgCount
  };
}

module.exports = {
  getFlashcardsLandingState: getFlashcardsLandingState
};
