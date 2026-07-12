// utils/profile-commands.js
// R3.5 Verified command boundary for Profile page data mutations and export.
//
// Each command maps 1:1 to a single, existing, audited storage API call.
// No generic dispatch. No arbitrary-key writes. No page/UI dependency.
//
// Page layer retains ALL user confirmation, file selection, JSON parse,
// toast, and refresh. This module ONLY calls the storage API and returns.
//
// Commands:
//   clearQuizAttempts()        → storage.clearQuizAttempts()
//   clearAllLocalUserData()    → storage.clearAllLocalUserData()
//   importLocalBackup(parsed)  → storage.importLocalBackup(parsed)
//   exportLocalBackup()        → storage.exportLocalBackup()

var storage = require('./storage');

function clearQuizAttempts() {
  storage.clearQuizAttempts();
}

function clearAllLocalUserData() {
  storage.clearAllLocalUserData();
}

function importLocalBackup(parsed) {
  storage.importLocalBackup(parsed);
}

function exportLocalBackup() {
  return storage.exportLocalBackup();
}

module.exports = {
  clearQuizAttempts: clearQuizAttempts,
  clearAllLocalUserData: clearAllLocalUserData,
  importLocalBackup: importLocalBackup,
  exportLocalBackup: exportLocalBackup
};
