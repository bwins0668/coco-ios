'use strict';
// tools/check_r6_6_flashcard_runtime_contract.js
// R6.6C: Verify that all flashcard player pages across all quiz subpackages
// share the same rendering contract:
//   - currentCard binding exists in WXML
//   - deck data require path resolves to real file
//   - empty/error state exists in WXML
//   - back/return handler references secondary-navigation
//   - root page element has "secondary-shell" class
//   - navigationStyle is "custom" (checked by entry contract but re-verified)
//
// Exit codes: 0 = PASS, 1 = contract violation(s)

var fs = require("fs");
var path = require("path");

var root = process.argv[2] || ".";

var quizSubs = [
  "quiz-itpass-1", "quiz-itpass-2", "quiz-itpass-3", "quiz-itpass-4", "quiz-itpass-5",
  "quiz-sg-1", "quiz-sg-2"
];

var errors = [];

console.log("=== R6.6C Flashcard Runtime Contract ===");
console.log("Root: " + path.resolve(root));

quizSubs.forEach(function(sub) {
  var prefix = "packages/" + sub;
  var playerRoute = prefix + "/pages/flashcard-player/flashcard-player";
  var playerJsPath = path.join(root, playerRoute + ".js");
  var playerWxmlPath = path.join(root, playerRoute + ".wxml");
  var playerWxssPath = path.join(root, playerRoute + ".wxss");
  var playerJsonPath = path.join(root, playerRoute + ".json");

  var subErrors = [];

  // --- Check JS ---
  if (!fs.existsSync(playerJsPath)) {
    subErrors.push("JS file missing");
  } else {
    var js = fs.readFileSync(playerJsPath, "utf8");

    // currentCard binding
    if (!/currentCard/.test(js)) {
      subErrors.push("currentCard not found in JS");
    }

    // require of deck data
    if (!/require\s*\(/.test(js)) {
      subErrors.push("no require calls in JS (may be bridge-only, acceptable)");
    } else {
      // Verify deck data require resolves
      var reqMatches = js.match(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
      if (reqMatches) {
        reqMatches.forEach(function(m) {
          var modPath = m.replace(/require\s*\(\s*['"]/, "").replace(/['"]\s*\)/, "");
          // Only check relative paths
          if (modPath.startsWith(".")) {
            var resolved = path.resolve(path.dirname(playerJsPath), modPath) + ".js";
            if (!fs.existsSync(resolved)) {
              subErrors.push("require target not found: " + modPath + " (resolved: " + resolved + ")");
            }
          }
        });
      }
    }

    // back handler
    if (!/goBack|back\(|secondary-navigation|secondaryNav/.test(js)) {
      subErrors.push("no back/return handler found in JS");
    } else {
      // Must explicitly use secondary-navigation
      if (!/secondary-navigation/.test(js)) {
        subErrors.push("back handler does not use secondary-navigation");
      }
    }
  }

  // --- Check WXML ---
  if (!fs.existsSync(playerWxmlPath)) {
    subErrors.push("WXML file missing");
  } else {
    var wxml = fs.readFileSync(playerWxmlPath, "utf8");

    // currentCard binding
    if (!/currentCard/.test(wxml)) {
      subErrors.push("currentCard not found in WXML");
    }

    // Secondary shell class
    if (!/secondary-shell/.test(wxml)) {
      subErrors.push("root element missing secondary-shell class");
    }

    // Empty / error state placeholder
    var hasEmptyState = /viewState\s*===\s*['"](empty|error)['"]/.test(wxml) || /fc-empty|fc-error/.test(wxml);
    var hasFallback = /wx:if\s*=\s*"\{\{.*(empty|error|!deck|!cards)/.test(wxml);
    if (!hasEmptyState && !hasFallback) {
      subErrors.push("no empty/error view state in WXML (player may white-screen on empty deck)");
    }

    // Back navigation element
    if (!/goBack|secondary-nav__back|bindtap.*back/.test(wxml)) {
      subErrors.push("no back navigation element in WXML");
    }
  }

  // --- Check WXSS ---
  if (!fs.existsSync(playerWxssPath)) {
    subErrors.push("WXSS file missing");
  } else {
    var wxss = fs.readFileSync(playerWxssPath, "utf8");
    // Check for Quiet Paper continuity — light mode canvas
    // Accept either --qp-color-canvas or the equivalent --bg-color (F2EDE0 in light mode)
    if (!/\-\-qp-color-canvas|\-\-bg-color/.test(wxss)) {
      subErrors.push("no background-color token found in WXSS (missing visual shell)");
    }
  }

  // --- Check JSON ---
  if (!fs.existsSync(playerJsonPath)) {
    subErrors.push("JSON file missing");
  } else {
    try {
      var pj = JSON.parse(fs.readFileSync(playerJsonPath, "utf8"));
      if (pj.navigationStyle !== "custom") {
        subErrors.push("navigationStyle is not custom");
      }
    } catch (e) {
      subErrors.push("JSON parse error: " + e.message);
    }
  }

  if (subErrors.length === 0) {
    console.log("[PASS] " + sub + ": flashcard runtime contract OK");
  } else {
    console.error("[FAIL] " + sub + ": " + subErrors.length + " issue(s):");
    subErrors.forEach(function(e) { console.error("  - " + e); });
    errors.push(sub + ": " + subErrors.join("; "));
  }
});

// Also verify the bridge pages
console.log("");
console.log("--- Bridge Page Verification ---");
quizSubs.forEach(function(sub) {
  var bridgeRoute = "packages/" + sub + "/pages/flashcard-bridge/flashcard-bridge";
  var bridgeJsPath = path.join(root, bridgeRoute + ".js");
  if (fs.existsSync(bridgeJsPath)) {
    var bjs = fs.readFileSync(bridgeJsPath, "utf8");
    if (/navigateTo|navigateBack|redirectTo|switchTab/.test(bjs)) {
      console.log("[PASS] " + sub + " bridge: has navigation logic");
    } else {
      console.error("[FAIL] " + sub + " bridge: no navigation logic found");
      errors.push(sub + " bridge: no navigation logic");
    }
  } else {
    console.log("[WARN] " + sub + " bridge: JS not found (may use WXML-only navigation)");
  }
});

console.log("");
console.log("=== Flashcard Contract Summary ===");
if (errors.length === 0) {
  console.log("[PASS] R6.6C flashcard runtime contract — all " + quizSubs.length + " subpackage players verified");
  process.exit(0);
} else {
  console.error("[FAIL] R6.6C flashcard runtime contract — " + errors.length + " violation(s):");
  errors.forEach(function(e) { console.error("  - " + e); });
  process.exit(1);
}
