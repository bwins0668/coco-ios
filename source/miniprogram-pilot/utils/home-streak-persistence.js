// utils/home-streak-persistence.js
// R4.0 Narrow persistence adapter for the Home streak key.
//
// Reads/writes ONLY the single fixed key "study-tools-mini-streak-v1".
// No dynamic keys. No generic storage method. No removeStorageSync.
// Delegates pure calculation to utils/home-streak.js.
//
// R4.0 change: storage read failure also seeds (was: silently returns 0).

var streak = require('./home-streak');

var KEY = 'study-tools-mini-streak-v1';

function getStreakCount() {
  var streakCount = 0;
  try {
    var sd = wx.getStorageSync(KEY);
    var now = new Date();
    var result = streak.computeStreak(sd, now);
    streakCount = result.streakCount;

    if (result.shouldWrite && result.nextRecord) {
      wx.setStorageSync(KEY, result.nextRecord);
    }
  } catch (e) {
    // Storage read error → seed with count=1
    var seed = streak.makeSeed(new Date());
    try { wx.setStorageSync(KEY, seed); } catch (e2) {}
    streakCount = 1;
  }
  return streakCount;
}

module.exports = { getStreakCount: getStreakCount };
