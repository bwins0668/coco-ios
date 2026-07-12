'use strict';
var fs = require("fs");
var path = require("path");

var root = process.argv.indexOf("--root") >= 0
  ? path.resolve(process.argv[process.argv.indexOf("--root") + 1])
  : ".";

// Look for flashcard player pages in all subpackages
var subs = ["quiz-itpass-1", "quiz-itpass-2", "quiz-itpass-3", "quiz-itpass-4", "quiz-itpass-5", "quiz-sg-1", "quiz-sg-2"];
var errors = [];

subs.forEach(function(sub) {
  var prefix = "packages/" + sub;
  var jsP = path.join(root, prefix, "pages", "flashcard-player", "flashcard-player.js");
  var wxmlP = path.join(root, prefix, "pages", "flashcard-player", "flashcard-player.wxml");
  var subErrs = [];

  if (!fs.existsSync(jsP)) { subErrs.push("JS not found"); }
  else {
    var js = fs.readFileSync(jsP, "utf8");
    if (!/currentCard/.test(js)) subErrs.push("currentCard not in JS data/rendering");
    if (!/secondary-navigation/.test(js)) subErrs.push("no secondary-navigation require");
  }

  if (!fs.existsSync(wxmlP)) { subErrs.push("WXML not found"); }
  else {
    var w = fs.readFileSync(wxmlP, "utf8");
    if (!/currentCard/.test(w)) subErrs.push("currentCard not in WXML rendering");
    if (!/fc-empty|viewState.*empty/.test(w)) subErrs.push("no empty state in WXML");
    if (!/fc-error|viewState.*error/.test(w)) subErrs.push("no error state in WXML");
    if (!/secondary-shell/.test(w)) subErrs.push("no secondary-shell class on root");
    if (!/goBack|secondary-nav__back/.test(w)) subErrs.push("no back navigation in WXML");
  }

  if (subErrs.length > 0) {
    errors.push(sub + " flashcard-player: " + subErrs.join("; "));
    console.error("[FAIL] " + sub + ": " + subErrs.join(", "));
  } else {
    console.log("[PASS] " + sub + ": flashcard runtime contract OK");
  }
});

if (errors.length === 0) {
  console.log("[PASS] R6.6C1 flashcard runtime contract -- " + subs.length + " players verified");
  process.exit(0);
} else {
  console.error("[FAIL] " + errors.length + " subpackage(s) with violations");
  process.exit(1);
}
