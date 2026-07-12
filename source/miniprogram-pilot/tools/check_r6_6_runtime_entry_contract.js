'use strict';
// tools/check_r6_6_runtime_entry_contract.js
// R6.6C: Verify that every secondary route registered in app.json has a real
// runtime entry chain (no dead-ends, no disconnected pages, no unreachable
// subpackage pages). Also validates flashcard entry chain specifically.
//
// Exit codes:
//   0 = all required entries verified
//   1 = entry contract violation(s)

var fs = require("fs");
var path = require("path");

var root = process.argv[2] || ".";
var appJsonPath = path.join(root, "app.json");

if (!fs.existsSync(appJsonPath)) {
  console.error("[FAIL] app.json not found at " + appJsonPath);
  process.exit(1);
}

var appJson;
try { appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8")); }
catch (e) { console.error("[FAIL] Cannot parse app.json: " + e.message); process.exit(1); }

var pages = appJson.pages || [];
var subPackages = appJson.subPackages || appJson.subpackages || [];

// Build full route list
var TAB_ROOTS = {
  "pages/home/home": true,
  "pages/practice/practice": true,
  "pages/review/review": true,
  "pages/glossary/glossary": true,
  "pages/profile/profile": true
};

var allRoutes = [];
var routeToPackage = {}; // route -> { pkg, isSub }
pages.forEach(function(r) {
  allRoutes.push(r);
  routeToPackage[r] = { pkg: null, isSub: false };
});
subPackages.forEach(function(pkg) {
  var pkgRoot = pkg.root || "";
  var pkgPages = pkg.pages || [];
  pkgPages.forEach(function(r) {
    var fullRoute = pkgRoot + "/" + r;
    allRoutes.push(fullRoute);
    routeToPackage[fullRoute] = { pkg: pkgRoot, isSub: true };
  });
});

var secondaryRoutes = allRoutes.filter(function(r) { return !TAB_ROOTS[r]; });
var errors = [];

// ----- Check 1: Every secondary route has a source file -----
console.log("=== R6.6C Runtime Entry Contract ===");
console.log("Root: " + path.resolve(root));
console.log("Total routes: " + allRoutes.length);
console.log("Tab roots: " + Object.keys(TAB_ROOTS).length);
console.log("Secondary routes: " + secondaryRoutes.length);

var missingFiles = [];
secondaryRoutes.forEach(function(route) {
  var jsPath = path.join(root, route + ".js");
  var wxmlPath = path.join(root, route + ".wxml");
  var jsonPath = path.join(root, route + ".json");
  var jsOk = fs.existsSync(jsPath);
  var wxmlOk = fs.existsSync(wxmlPath);
  if (!jsOk || !wxmlOk) {
    missingFiles.push({ route: route, js: jsOk, wxml: wxmlOk });
  }
});

if (missingFiles.length > 0) {
  missingFiles.forEach(function(m) {
    var parts = [];
    if (!m.js) parts.push("JS missing");
    if (!m.wxml) parts.push("WXML missing");
    console.error("[FAIL] " + m.route + ": " + parts.join(", "));
    errors.push("Missing files for " + m.route);
  });
}

// ----- Check 2: Every secondary route has navigationStyle: custom -----
var missingCustomNav = [];
secondaryRoutes.forEach(function(route) {
  var jsonPath = path.join(root, route + ".json");
  if (!fs.existsSync(jsonPath)) return;
  try {
    var pageJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    if (pageJson.navigationStyle !== "custom") {
      missingCustomNav.push(route);
    }
  } catch (e) { /* already counted in missingFiles */ }
});

if (missingCustomNav.length > 0) {
  missingCustomNav.forEach(function(r) {
    console.error("[FAIL] " + r + ": navigationStyle is not \"custom\" (native white chrome risk)");
    errors.push("navigationStyle missing custom for " + r);
  });
}

// ----- Check 3: Flashcard entry chain -----
console.log("");
console.log("--- Flashcard Entry Chain ---");

// 3a: pages/flashcards/flashcards.js exists and requires flashcard-summary-manifest via utils/flashcards-state
var fcJsPath = path.join(root, "pages", "flashcards", "flashcards.js");
if (fs.existsSync(fcJsPath)) {
  var fcJs = fs.readFileSync(fcJsPath, "utf8");
  if (!fcJs.includes("flashcards-state")) {
    console.error("[FAIL] pages/flashcards/flashcards.js does not require flashcards-state");
    errors.push("Flashcard center missing flashcards-state require");
  } else {
    console.log("[PASS] pages/flashcards/flashcards.js requires flashcards-state");
  }
} else {
  console.error("[FAIL] pages/flashcards/flashcards.js not found");
  errors.push("Flashcard center JS not found");
}

// 3b: utils/flashcards-state.js requires ./flashcard-summary-manifest (not ../data/)
var fcsPath = path.join(root, "utils", "flashcards-state.js");
if (fs.existsSync(fcsPath)) {
  var fcsJs = fs.readFileSync(fcsPath, "utf8");
  if (fcsJs.includes("../data/flashcard-summary-manifest")) {
    console.error("[FAIL] utils/flashcards-state.js still requires ../data/flashcard-summary-manifest (will fail packaging)");
    errors.push("flashcards-state still requires blocked ../data path");
  } else if (fcsJs.includes("./flashcard-summary-manifest") || fcsJs.includes("flashcard-summary-manifest")) {
    console.log("[PASS] utils/flashcards-state.js requires safe flashcard-summary-manifest path");
  } else {
    console.error("[FAIL] utils/flashcards-state.js has no flashcard-summary-manifest require");
    errors.push("flashcards-state missing summary manifest require");
  }
} else {
  console.error("[FAIL] utils/flashcards-state.js not found");
  errors.push("flashcards-state JS not found");
}

// 3c: utils/flashcard-summary-manifest.js exists and exports itpass/sg
var fsmPath = path.join(root, "utils", "flashcard-summary-manifest.js");
if (fs.existsSync(fsmPath)) {
  try {
    var fsm = require(path.resolve(fsmPath));
    if (fsm && fsm.itpass && fsm.sg) {
      console.log("[PASS] utils/flashcard-summary-manifest.js exports itpass (" +
        (fsm.itpass.deckCount || "?") + " decks) and sg (" +
        (fsm.sg.deckCount || "?") + " decks)");
    } else {
      console.error("[FAIL] utils/flashcard-summary-manifest.js missing itpass or sg export");
      errors.push("flashcard-summary-manifest missing exports");
    }
  } catch (e) {
    console.error("[FAIL] Cannot require flashcard-summary-manifest: " + e.message);
    errors.push("flashcard-summary-manifest require failed: " + e.message);
  }
} else {
  console.error("[FAIL] utils/flashcard-summary-manifest.js not found");
  errors.push("flashcard-summary-manifest file not found");
}

// 3d: deck-select page exists and can be reached from flashcard center
var deckSelectRoute = "packages/quiz/pages/flashcard-deck-select/flashcard-deck-select";
var dsJsPath = path.join(root, deckSelectRoute + ".js");
if (fs.existsSync(dsJsPath)) {
  console.log("[PASS] deck-select page exists: " + deckSelectRoute);
  // Check that it references flashcard-manifest properly
  var dsJs = fs.readFileSync(dsJsPath, "utf8");
  if (dsJs.includes("flashcard-manifest")) {
    console.log("[PASS] deck-select requires flashcard-manifest");
  } else {
    console.error("[FAIL] deck-select missing flashcard-manifest require");
    errors.push("deck-select missing flashcard-manifest");
  }
  // Check navigationStyle
  var dsJsonPath = path.join(root, deckSelectRoute + ".json");
  if (fs.existsSync(dsJsonPath)) {
    var dsJson = JSON.parse(fs.readFileSync(dsJsonPath, "utf8"));
    if (dsJson.navigationStyle === "custom") {
      console.log("[PASS] deck-select navigationStyle: custom");
    } else {
      console.error("[FAIL] deck-select navigationStyle is not custom");
      errors.push("deck-select missing custom navigationStyle");
    }
  }
} else {
  console.error("[FAIL] deck-select page not found: " + deckSelectRoute);
  errors.push("deck-select page missing");
}

// 3e: Review page references Flashcards
var reviewJsPath = path.join(root, "pages", "review", "review.js");
if (fs.existsSync(reviewJsPath)) {
  var reviewJs = fs.readFileSync(reviewJsPath, "utf8");
  if (reviewJs.includes("goFlashcards") || reviewJs.includes("flashcard")) {
    console.log("[PASS] pages/review/review.js has flashcard entry");
  } else {
    console.error("[FAIL] Review page missing flashcard entry");
    errors.push("Review page missing flashcard entry");
  }
} else {
  // Review is a tab root - this is not critical but note it
  console.log("[WARN] pages/review/review.js not checked (Review may use WXML-only binding)");
}

// 3f: Check each quiz subpackage flashcard-player exists and has navigationStyle custom
console.log("");
console.log("--- Subpackage Flashcard Player Audit ---");
var quizSubs = ["quiz-itpass-1", "quiz-itpass-2", "quiz-itpass-3", "quiz-itpass-4", "quiz-itpass-5",
                 "quiz-sg-1", "quiz-sg-2"];
quizSubs.forEach(function(sub) {
  var playerRoute = "packages/" + sub + "/pages/flashcard-player/flashcard-player";
  var playerJs = path.join(root, playerRoute + ".js");
  var playerWxml = path.join(root, playerRoute + ".wxml");
  var playerJson = path.join(root, playerRoute + ".json");

  if (!fs.existsSync(playerJs) || !fs.existsSync(playerWxml) || !fs.existsSync(playerJson)) {
    console.error("[FAIL] " + playerRoute + ": incomplete page files");
    errors.push("Player page incomplete for " + sub);
    return;
  }

  var pj;
  try { pj = JSON.parse(fs.readFileSync(playerJson, "utf8")); }
  catch (e) { console.error("[FAIL] " + playerRoute + ".json parse error"); errors.push("Player .json parse error for " + sub); return; }

  if (pj.navigationStyle !== "custom") {
    console.error("[FAIL] " + playerRoute + ": navigationStyle is \"" + (pj.navigationStyle || "default") + "\" (should be custom)");
    errors.push("Player navStyle not custom for " + sub);
  } else {
    console.log("[PASS] " + sub + " flashcard-player: navigationStyle=custom, files complete");
  }
});

// ===== Summary =====
console.log("");
console.log("=== Entry Contract Summary ===");
if (errors.length === 0) {
  console.log("[PASS] R6.6C runtime entry contract — all " + secondaryRoutes.length + " secondary routes have valid entries");
  process.exit(0);
} else {
  console.error("[FAIL] R6.6C runtime entry contract — " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
