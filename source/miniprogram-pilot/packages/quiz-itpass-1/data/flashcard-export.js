'use strict';
var loader = require('./loader');
try {
  (function() {
    var app = getApp();
    if (!app) return;
    app.globalData.__flashcard_cache = app.globalData.__flashcard_cache || {};
    var cache = app.globalData.__flashcard_cache;
    var key = 'itpass-1';
    if (!cache[key]) {
      cache[key] = loader.getAllQuestions();
      console.log('[flashcard-export]', key, 'registered', cache[key].length, 'questions');
    }
  })();
} catch(e) {
  console.warn('[flashcard-export] itpass-1 failed:', e);
}
