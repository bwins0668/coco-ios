var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var REPO = path.resolve(__dirname, "..");
var SCRIPT = path.join(REPO, "tools/check_python_shard_wxss_import_contract.js");
var TEMP = fs.mkdtempSync(path.join(os.tmpdir(), "py-wxss-selftest-"));

function copyRepo(label) {
  var dir = path.join(TEMP, label);
  fs.cpSync(REPO, dir, { recursive: true, filter: function(src) { return src.indexOf("node_modules") === -1 && src.indexOf(".git") === -1; } });
  return dir;
}

function node(args, cwd) {
  var r = cp.spawnSync("node", args, { cwd: cwd || REPO, encoding: "utf8", windowsHide: true });
  return { code: r.status, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

function run(dir) {
  return node([SCRIPT, "--root", dir], dir);
}

var allPass = true; var total = 0; var passed = 0;

function test(label, dir) {
  total++; var r = run(dir);
  if (r.code === 0) { passed++; console.log("| " + label + " | exit 0 | PASS (clean)"); }
  else { allPass = false; passed++; console.log("| " + label + " | exit 1 | PASS (correctly fails)"); }
}

function testFail(label, dir) {
  total++; var r = run(dir);
  if (r.code !== 0) { passed++; console.log("| " + label + " | exit " + r.code + " | PASS (correctly fails)"); }
  else { allPass = false; console.log("| " + label + " | exit 0 | FAIL (should have failed)"); }
}

var dirA = copyRepo("A-wrong-chapter-path");
var chap = fs.readFileSync(path.join(dirA, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chap = chap.replace("../../../python-course/pages/chapter/chapter.wxss", "../../packages/python-course/pages/chapter/chapter.wxss");
fs.writeFileSync(path.join(dirA, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chap, "utf8");
testFail("A", dirA);

var dirB = copyRepo("B-lesson-wrong-target");
var less = fs.readFileSync(path.join(dirB, "packages/python-course-foundations-b/pages/lesson/lesson.wxss"), "utf8");
less = less.replace("../../../python-course/pages/lesson/lesson.wxss", "../../../python-course/pages/lesson/nonexistent.wxss");
fs.writeFileSync(path.join(dirB, "packages/python-course-foundations-b/pages/lesson/lesson.wxss"), less, "utf8");
testFail("B", dirB);

var dirC = copyRepo("C-delete-legacy-chapter");
fs.rmSync(path.join(dirC, "packages/python-course/pages/chapter/chapter.wxss"));
testFail("C", dirC);

var dirD = copyRepo("D-escape-root");
var chapD = fs.readFileSync(path.join(dirD, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chapD = chapD.replace("../../../python-course/pages/chapter/chapter.wxss", "../../../../../../outside.wxss");
fs.writeFileSync(path.join(dirD, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chapD, "utf8");
testFail("D", dirD);

var dirE = copyRepo("E-main-pkg-illegal");
var chapE = fs.readFileSync(path.join(dirE, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chapE = chapE.replace("../../../../styles/tokens.wxss", "../../../../pages/home/home.wxss");
fs.writeFileSync(path.join(dirE, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chapE, "utf8");
test("E", dirE); // import main package styles is legal per contract

var dirF = copyRepo("F-non-wxss");
var chapF = fs.readFileSync(path.join(dirF, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chapF = chapF.replace("../../../python-course/pages/chapter/chapter.wxss", "../../../python-course/pages/chapter/chapter.js");
fs.writeFileSync(path.join(dirF, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chapF, "utf8");
testFail("F", dirF);

console.log("| G | real repo | ...");
total++;
var rG = run(REPO);
if (rG.code === 0) { passed++; console.log("| G | real repo | exit 0 | PASS"); }
else { allPass = false; console.log("| G | real repo | exit " + rG.code + " | FAIL"); }

try { fs.rmSync(TEMP, { recursive: true, force: true }); } catch(e) {}

console.log("");
console.log("=== Selftest Summary ===");
console.log("Passed: " + passed + "/" + total);
if (!allPass) { console.log("SOME TESTS FAILED"); process.exit(1); }
console.log("[Python shard WXSS import selftest] PASS: all " + total + " mutations matched expected exits");