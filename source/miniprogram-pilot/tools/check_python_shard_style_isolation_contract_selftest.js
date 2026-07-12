var fs = require("fs");
var path = require("path");
var os = require("os");
var cp = require("child_process");

var REPO = path.resolve(__dirname, "..");
var SCRIPT = path.join(REPO, "tools/check_python_shard_style_isolation_contract.js");
var TEMP = fs.mkdtempSync(path.join(os.tmpdir(), "py-style-iso-"));

function copyRepo(label) {
  var dir = path.join(TEMP, label);
  fs.cpSync(REPO, dir, { recursive: true, filter: function(src) { return src.indexOf("node_modules") === -1 && src.indexOf(".git") === -1; } });
  return dir;
}

function run(dir) {
  var r = cp.spawnSync("node", [SCRIPT, "--root", dir], { cwd: dir, encoding: "utf8", windowsHide: true });
  return { code: r.status, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

var allPass = true; var total = 0; var passed = 0;

function testFail(label, dir) {
  total++; var r = run(dir);
  if (r.code !== 0) { passed++; console.log("| " + label + " | exit " + r.code + " | PASS (correctly fails)"); }
  else { allPass = false; console.log("| " + label + " | exit 0 | FAIL (should have failed)"); }
}

function testPass(label, dir) {
  total++; var r = run(dir);
  if (r.code === 0) { passed++; console.log("| " + label + " | exit 0 | PASS"); }
  else { allPass = false; console.log("| " + label + " | exit " + r.code + " | FAIL"); }
}

var dirA = copyRepo("A-cross-chapter");
var chA = fs.readFileSync(path.join(dirA, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chA = chA.replace("../../styles/chapter-visual-contract.wxss", "../../../python-course/pages/chapter/chapter.wxss");
fs.writeFileSync(path.join(dirA, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chA, "utf8");
testFail("A", dirA);
var dirB = copyRepo("B-cross-lesson");
var lsB = fs.readFileSync(path.join(dirB, "packages/python-course-foundations-b/pages/lesson/lesson.wxss"), "utf8");
lsB = lsB.replace("../../styles/lesson-visual-contract.wxss", "../../../python-course/pages/lesson/lesson.wxss");
fs.writeFileSync(path.join(dirB, "packages/python-course-foundations-b/pages/lesson/lesson.wxss"), lsB, "utf8");
testFail("B", dirB);
var dirC = copyRepo("C-mirror-delete-rule");
var mcC = fs.readFileSync(path.join(dirC, "packages/python-course-foundations-b/styles/chapter-visual-contract.wxss"), "utf8");
mcC = mcC.replace(".pc-hero{padding:28rpx;", ".pc-hero{padding:50rpx;");
fs.writeFileSync(path.join(dirC, "packages/python-course-foundations-b/styles/chapter-visual-contract.wxss"), mcC, "utf8");
testFail("C", dirC);
var dirD = copyRepo("D-color-change");
var mlD = fs.readFileSync(path.join(dirD, "packages/python-course-foundations-b/styles/lesson-visual-contract.wxss"), "utf8");
mlD = mlD.replace("--python-khaki-accent:#9A7B48", "--python-khaki-accent:#FF0000");
fs.writeFileSync(path.join(dirD, "packages/python-course-foundations-b/styles/lesson-visual-contract.wxss"), mlD, "utf8");
testFail("D", dirD);
var dirE = copyRepo("E-overflow-change");
var mcE = fs.readFileSync(path.join(dirE, "packages/python-course-foundations-b/styles/chapter-visual-contract.wxss"), "utf8");
mcE = mcE.replace("overflow-x:hidden", "overflow-x:visible");
fs.writeFileSync(path.join(dirE, "packages/python-course-foundations-b/styles/chapter-visual-contract.wxss"), mcE, "utf8");
testFail("E", dirE);
var dirF = copyRepo("F-other-pkg");
var chF = fs.readFileSync(path.join(dirF, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chF = chF.replace("../../../../styles/tokens.wxss", "../../../java-course/pages/home/home.wxss");
fs.writeFileSync(path.join(dirF, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chF, "utf8");
testFail("F", dirF);
var dirG = copyRepo("G-main-pages");
var chG = fs.readFileSync(path.join(dirG, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), "utf8");
chG = chG.replace("../../../../styles/tokens.wxss", "../../../../pages/home/home.wxss");
fs.writeFileSync(path.join(dirG, "packages/python-course-foundations-b/pages/chapter/chapter.wxss"), chG, "utf8");
testFail("G", dirG);
testPass("H", REPO);
var dirI = copyRepo("I-delete-mirror");
fs.rmSync(path.join(dirI, "packages/python-course-foundations-b/styles/chapter-visual-contract.wxss"));
testFail("I", dirI);
console.log("| J | real repo | ...");
total++;
var rJ = run(REPO);
if (rJ.code === 0) { passed++; console.log("| J | real repo | exit 0 | PASS"); }
else { allPass = false; console.log("| J | real repo | exit " + rJ.code + " | FAIL"); }

try { fs.rmSync(TEMP, { recursive: true, force: true }); } catch(e) {}

console.log("");
console.log("=== Selftest Summary ===");
console.log("Passed: " + passed + "/" + total);
if (!allPass) { console.log("SOME TESTS FAILED"); process.exit(1); }
console.log("[Python shard style isolation selftest] PASS: all " + total + " mutations matched expected exits");