// utils/home-streak.js
// R4.0 Pure date-calculation module for Home streak.
//
// Given a saved streak record and a "now" Date, determines:
//   - current streak count
//   - whether to persist a new record
//   - the next record to persist (if any)
//
// No wx, no storage, no Page, no UI. Just math.
//
// R4.0 product policy (approved change from R3.7 frozen behavior):
//   - Missing / invalid record → seed {lastDate, count:1}
//   - Gap (diff > 1) → reset to 1 with seed (was: 0, no write)
//   - Invalid count (NaN, <=0, non-integer, string) → normalize to 1
//   - Negative diff → keep 0, no write (unchanged)
//   - Same day → keep count, no write (unchanged)
//   - Next day → +1, write (unchanged)

function isValidSaved(saved) {
  if (!saved || typeof saved !== 'object') return false;
  if (!saved.lastDate) return false;
  // lastDate must parse to a valid date
  try {
    var d = new Date(saved.lastDate);
    if (isNaN(d.getTime())) return false;
  } catch (e) {
    return false;
  }
  // count must be a finite, positive integer
  if (typeof saved.count !== 'number' || !isFinite(saved.count) || saved.count <= 0) return false;
  if (Math.floor(saved.count) !== saved.count) return false;
  return true;
}

function makeSeed(now) {
  return { lastDate: now.toISOString(), count: 1 };
}

function computeStreak(saved, now) {
  // Invalid or missing → seed with count=1
  if (!isValidSaved(saved)) {
    return { streakCount: 1, shouldWrite: true, nextRecord: makeSeed(now) };
  }

  var ld = new Date(saved.lastDate);
  var td = new Date(now.getTime());
  td.setHours(0, 0, 0, 0);
  var ldDay = new Date(ld.getFullYear(), ld.getMonth(), ld.getDate());
  var tdDay = new Date(td.getFullYear(), td.getMonth(), td.getDate());
  var diff = Math.floor((tdDay - ldDay) / 86400000);

  if (diff === 0) {
    // Same day — keep count, no write
    return { streakCount: saved.count, shouldWrite: false, nextRecord: null };
  }

  if (diff === 1) {
    // Consecutive day — increment and write
    var next = saved.count + 1;
    return { streakCount: next, shouldWrite: true, nextRecord: { lastDate: td.toISOString(), count: next } };
  }

  if (diff > 1) {
    // Gap — reset to 1 with new seed
    return { streakCount: 1, shouldWrite: true, nextRecord: makeSeed(now) };
  }

  // diff < 0: clock went backward — keep 0, don't write
  return { streakCount: 0, shouldWrite: false, nextRecord: null };
}

module.exports = {
  computeStreak: computeStreak,
  isValidSaved: isValidSaved,
  makeSeed: makeSeed
};
