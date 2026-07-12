// packages/quiz/data/flashcard-manifest.js
// Lightweight deck→subpackage mapping.
// No cross-package require — purely data.
'use strict';

var pastExamIndex = require('./past_exam_bank/index');

var PACKAGE_MAP = {
  'sg-1':     { packageName: 'quiz-sg-1',     packageRoot: 'packages/quiz-sg-1' },
  'sg-2':     { packageName: 'quiz-sg-2',     packageRoot: 'packages/quiz-sg-2' },
  'itpass-1': { packageName: 'quiz-itpass-1', packageRoot: 'packages/quiz-itpass-1' },
  'itpass-2': { packageName: 'quiz-itpass-2', packageRoot: 'packages/quiz-itpass-2' },
  'itpass-3': { packageName: 'quiz-itpass-3', packageRoot: 'packages/quiz-itpass-3' },
  'itpass-4': { packageName: 'quiz-itpass-4', packageRoot: 'packages/quiz-itpass-4' },
  'itpass-5': { packageName: 'quiz-itpass-5', packageRoot: 'packages/quiz-itpass-5' }
};

/**
 * Get deck info for a given course+yearId.
 * Returns { packageKey, packageName, packageRoot, yearId, label, count, playerRoute } or null.
 */
function getDeckInfo(course, yearId) {
  var years = pastExamIndex.getYears(course);
  console.log('[flashcard-manifest] getDeckInfo course=' + course + ' yearId=' + yearId + ' yearsCount=' + years.length);
  for (var i = 0; i < years.length; i++) {
    var y = years[i];
    console.log('[flashcard-manifest] checking year[' + i + ']: yearId=' + y.yearId + ' match=' + (y.yearId === yearId));
    if (y.yearId === yearId) {
      var pkg = PACKAGE_MAP[y.packageKey];
      if (!pkg) {
        console.error('[flashcard-manifest] PACKAGE_MAP missing key:', y.packageKey);
        return null;
      }
      return {
        packageKey: y.packageKey,
        packageName: pkg.packageName,
        packageRoot: pkg.packageRoot,
        yearId: y.yearId,
        label: y.label || y.year,
        count: y.count || 0,
        playerRoute: '/' + pkg.packageRoot + '/pages/flashcard-player/flashcard-player'
      };
    }
  }
  console.error('[flashcard-manifest] NO MATCH for yearId=' + yearId + ' in', years.map(function(y) { return y.yearId; }));
  return null;
}

/**
 * Get all years for a course as deck options (for deck selection UI).
 */
function getDecksForCourse(course) {
  var years = pastExamIndex.getYears(course);
  var decks = [];
  for (var i = 0; i < years.length; i++) {
    var y = years[i];
    var pkg = PACKAGE_MAP[y.packageKey];
    if (!pkg) continue;
    decks.push({
      packageKey: y.packageKey,
      packageName: pkg.packageName,
      yearId: y.yearId,
      label: y.label || y.year,
      count: y.count || 0
    });
  }
  return decks;
}

module.exports = {
  getDeckInfo: getDeckInfo,
  getDecksForCourse: getDecksForCourse,
  PACKAGE_MAP: PACKAGE_MAP
};
