var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var REPO = path.resolve(__dirname, "..");
var TEMP = fs.mkdtempSync(path.join(os.tmpdir(), "py-evf2-"));

function node(args, cwd) {
  var r = cp.spawnSync("node", args, { cwd: cwd || REPO, encoding: "utf8", windowsHide: true });
  return { code: r.status, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

function copyRepo(label) {
  var dir = path.join(TEMP, label);
  fs.cpSync(REPO, dir, { recursive: true, filter: function(src) { return src.indexOf("node_modules") === -1 && src.indexOf(".git") === -1; } });
  return dir;
}

function runChecker(dir, script, expectedCode, expectedText) {
  var r = node([path.join(REPO, script), "--root", dir], dir);
  var code = r.code;
  var out = (r.stdout + "\n" + r.stderr).toLowerCase();
  var ok = code === expectedCode;
  if (expectedText && ok) { var ts = Array.isArray(expectedText) ? expectedText : [expectedText]; ok = ts.every(function(t) { return out.indexOf(t.toLowerCase()) !== -1; }); }
  return { ok: ok, code: code, output: out };
}

var allPass = true;
var total = 0;
var passed = 0;

function test(label, script, expectedCode, expectedText) {
  total++;
  var r = runChecker(REPO, script, expectedCode, expectedText);
  if (r.ok) { passed++; console.log("| " + label + " | " + script.replace("tools/","") + " | exit " + r.code + " | PASS"); }
  else { allPass = false; console.log("| " + label + " | " + script.replace("tools/","") + " | exit " + r.code + " | FAIL"); }
}

console.log("--- L: Real repository checkers ---");
test("L-gs1_gs2", "tools/check_python_gs1_gs2_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-domain1a", "tools/check_python_domain1a_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-domain1b", "tools/check_python_domain1b_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-khaki_visual", "tools/check_python_khaki_visual_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-app_config", "tools/check_python_app_config_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-published_lesson_truth", "tools/check_python_published_lesson_truth_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-shard_train1", "tools/check_python_shard_train1_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-safe_stdin", "tools/check_python_safe_stdin_contract.js", 0, "PASS: 0 errors, 0 warnings");
test("L-full_course_ledger", "tools/check_python_full_course_ledger_contract.js", 0, "PASS: 0 errors, 0 warnings");

try { fs.rmSync(TEMP, { recursive: true, force: true }); } catch(e) {}

console.log("");
console.log("=== Selftest Summary ===");
console.log("Passed: " + passed + "/" + total);
if (!allPass) { console.log("SOME TESTS FAILED"); process.exit(1); }
console.log("[Python evidence-F2 selftest] PASS: all " + total + " real-repo checkers matched expected exits");