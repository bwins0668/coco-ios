'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

var errors = [];

// Review -> Flashcard
var rjs = path.join(root, "pages", "review", "review.js");
if (fs.existsSync(rjs)) {
  var c = fs.readFileSync(rjs, "utf8");
  if (!/goFlashcards\s*:\s*function/.test(c))
    errors.push("Review page missing goFlashcards function (JS)");
  if (!/nav\.goFlashcards|goFlashcards\(\)/.test(c))
    errors.push("Review page missing nav.goFlashcards call (JS)");
}

var rw = path.join(root, "pages", "review", "review.wxml");
if (fs.existsSync(rw)) {
  var wc = fs.readFileSync(rw, "utf8");
  if (!/goFlashcards/.test(wc))
    errors.push("Review page WXML missing goFlashcards binding");
}

// Flashcards-state safe require
var fcsPath = path.join(root, "utils", "flashcards-state.js");
if (fs.existsSync(fcsPath)) {
  var fcsJs = fs.readFileSync(fcsPath, "utf8");
  if (/\\.\\.\/data\/flashcard-summary-manifest/.test(fcsJs))
    errors.push("flashcards-state still requires blocked ../data/ path");
  else if (!/flashcard-summary-manifest/.test(fcsJs))
    errors.push("flashcards-state missing flashcard-summary-manifest require");
} else { errors.push("utils/flashcards-state.js not found"); }

var fsmPath = path.join(root, "utils", "flashcard-summary-manifest.js");
if (!fs.existsSync(fsmPath)) errors.push("utils/flashcard-summary-manifest.js not found");

// Flashcard center -> state
var fcPath = path.join(root, "pages", "flashcards", "flashcards.js");
if (fs.existsSync(fcPath)) {
  var fc = fs.readFileSync(fcPath, "utf8");
  if (!/flashcards-state/.test(fc)) errors.push("flashcards.js missing flashcards-state require");
}

// Deck select -> manifest + nav
var dsPath = path.join(root, "packages", "quiz", "pages", "flashcard-deck-select", "flashcard-deck-select.js");
if (fs.existsSync(dsPath)) {
  var ds = fs.readFileSync(dsPath, "utf8");
  if (!/flashcard-manifest/.test(ds)) errors.push("deck-select missing flashcard-manifest require");
}

console.log("=== R6.6C1 Runtime Entry Contract ===");
console.log("Root: " + path.resolve(root));
if (errors.length === 0) {
  console.log("[PASS] R6.6C1 runtime entry contract");
  process.exit(0);
} else {
  console.error("[FAIL] " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
