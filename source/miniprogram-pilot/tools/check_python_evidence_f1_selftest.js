var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var REPO = path.resolve(__dirname, "..");

function node(args, cwd) {
  var r = cp.spawnSync("node", args, { cwd: cwd || REPO, encoding: "utf8", windowsHide: true });
  return { code: r.status, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

function runChecker(dir, script, expectedCode, expectedText) {
  var result = node([path.join(REPO, script), "--root", dir], dir);
  var code = result.code;
  var output = (result.stdout + "\n" + result.stderr).toLowerCase();
  var ok = code === expectedCode;
  if (expectedText && ok) {
    var texts = Array.isArray(expectedText) ? expectedText : [expectedText];
    ok = texts.every(function(t) { return output.indexOf(t.toLowerCase()) !== -1; });
  }
  return { ok: ok, code: code, output: output };
}

var allPass = true;
var total = 0;
var passed = 0;

console.log("--- L: Current real repository ---");
var checkers = [
  "tools/check_python_gs1_gs2_contract.js",
  "tools/check_python_domain1a_contract.js",
  "tools/check_python_domain1b_contract.js",
  "tools/check_python_khaki_visual_contract.js",
  "tools/check_python_published_lesson_truth_contract.js",
  "tools/check_python_shard_train1_contract.js",
  "tools/check_python_full_course_ledger_contract.js",
  "tools/check_python_safe_stdin_contract.js"
];
checkers.forEach(function(script) {
  total++;
  var r = runChecker(REPO, script, 0, 'PASS: 0 errors, 0 warnings');
  if (r.ok) { passed++; console.log("| L-" + path.basename(script) + " | exit 0 | PASS"); }
  else { allPass = false; console.log("| L-" + path.basename(script) + " | exit " + r.code + " | FAIL: " + r.output.slice(0,120)); }
});

console.log("");
console.log("=== Selftest Summary ===");
console.log("Passed: " + passed + "/" + total);
if (!allPass) { console.log("SOME TESTS FAILED"); process.exit(1); }
console.log("[Python evidence-F1 selftest] PASS: all " + total + " real-repo checkers matched expected exits");