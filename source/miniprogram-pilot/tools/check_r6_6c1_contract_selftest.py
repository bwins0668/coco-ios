#!/usr/bin/env python3
"""tools/check_r6_6c1_contract_selftest.py — TEMP A-J negative verification"""
import json, os, re, shutil, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

def run_node(script, args=None, cwd=None):
    cmd = ["node", script]
    if args:
        cmd.extend(args)
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=cwd or ROOT)
    return result.returncode, result.stdout, result.stderr

def copy_fixture(subset=None, dest_dir=None):
    """Copy minimal project subset for a checker test"""
    d = dest_dir or tempfile.mkdtemp(prefix="r6c1_fixture_")
    # Copy app.json (needed by all checkers)
    shutil.copy2(os.path.join(ROOT, "app.json"), d)
    # Copy utils/secondary-navigation.js (needed by visual shell)
    os.makedirs(os.path.join(d, "utils"), exist_ok=True)
    nav_src = os.path.join(ROOT, "utils", "secondary-navigation.js")
    if os.path.exists(nav_src):
        shutil.copy2(nav_src, os.path.join(d, "utils", "secondary-navigation.js"))
    # Copy specific files
    if subset:
        for src_rel in subset:
            src = os.path.join(ROOT, src_rel)
            dst = os.path.join(d, src_rel)
            if os.path.exists(src):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
    return d

def write_utf8_lf(path, content):
    """Write content with LF line endings only"""
    content = content.replace("\r\n", "\n")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)

def read_utf8(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

results = []
PASS = "PASS"
FAIL = "FAIL"

# ========== TEMP J: Current repo ==========
print("=" * 60)
print("TEMP J: Current repo — all 4 checkers should PASS")
print("=" * 60)
checkers = [
    "tools/check_r6_6c1_runtime_module_resolution_contract.js",
    "tools/check_r6_6c1_runtime_entry_contract.js",
    "tools/check_r6_6c1_secondary_visual_shell_contract.js",
    "tools/check_r6_6c1_flashcard_runtime_contract.js",
]
all_pass = True
for c in checkers:
    code, out, err = run_node(c)
    status = PASS if code == 0 else FAIL
    if code != 0:
        all_pass = False
    print(f"  {c}: exit={code} {status}")
    if code != 0:
        print(f"    stderr: {err[:200]}")
results.append(("J", "Current repo all PASS", PASS if all_pass else FAIL, "exit=0 for all 4" if all_pass else "at least one exit=1"))

# ========== TEMP A: Broken flashcard manifest require ==========
print("\n" + "=" * 60)
print("TEMP A: Break manifest require -> module checker FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "utils/flashcards-state.js",
    "utils/flashcard-summary-manifest.js",
    "pages/flashcards/flashcards.js",
    "pages/flashcards/flashcards.wxml",
    "pages/flashcards/flashcards.json",
])
os.makedirs(os.path.join(d, "pages", "flashcards"), exist_ok=True)
# Copy all page JS for require resolution
for f in os.listdir(os.path.join(ROOT, "pages")):
    sub = os.path.join(ROOT, "pages", f)
    if os.path.isdir(sub):
        for pf in os.listdir(sub):
            if pf.endswith(".js"):
                dst_dir = os.path.join(d, "pages", f)
                os.makedirs(dst_dir, exist_ok=True)
                src = os.path.join(sub, pf)
                if os.path.isfile(src):
                    shutil.copy2(src, os.path.join(dst_dir, pf))

# Mutate: change require to blocked path
fcs_path = os.path.join(d, "utils", "flashcards-state.js")
content = read_utf8(fcs_path)
assert "./flashcard-summary-manifest" in content, "Precondition: must contain safe require"
content = content.replace("require('./flashcard-summary-manifest')", "require('../data/flashcard-summary-manifest')")
assert "../data/flashcard-summary-manifest" in content, "Mutation must succeed"
write_utf8_lf(fcs_path, content)

code, out, err = run_node("tools/check_r6_6c1_runtime_module_resolution_contract.js")
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
if code == 0:
    print(f"  Should have failed but passed!")
results.append(("A", "Broken manifest require -> module checker", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP B: Delete Review flashcard entry ==========
print("\n" + "=" * 60)
print("TEMP B: Delete Review flashcard entry -> entry checker FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/review/review.js",
    "pages/review/review.wxml",
    "pages/review/review.json",
    "utils/navigation.js",
    "pages/flashcards/flashcards.js",
])
os.makedirs(os.path.join(d, "pages", "flashcards"), exist_ok=True)
for pf in os.listdir(os.path.join(ROOT, "pages", "flashcards")):
    shutil.copy2(os.path.join(ROOT, "pages", "flashcards", pf),
                 os.path.join(d, "pages", "flashcards", pf))

# Mutate: remove goFlashcards from JS AND WXML binding
review_js = os.path.join(d, "pages", "review", "review.js")
rjs = read_utf8(review_js)
assert "goFlashcards" in rjs, "Precondition"
rjs = re.sub(r"goFlashcards:\s*function\s*\(\)\s*\{[^}]*\},?\s*", "", rjs)
assert "goFlashcards" not in rjs or "goFlashcards:" not in rjs, "Must remove goFlashcards function"
write_utf8_lf(review_js, rjs)

review_wxml = os.path.join(d, "pages", "review", "review.wxml")
if os.path.exists(review_wxml):
    rw = read_utf8(review_wxml)
    if "goFlashcards" in rw:
        rw = re.sub(r'<[^>]*bindtap="goFlashcards"[^>]*>.*?</view>', "", rw, flags=re.DOTALL)
        write_utf8_lf(review_wxml, rw)

code, out, err = run_node("tools/check_r6_6c1_runtime_entry_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("B", "Delete Review flashcard entry -> entry checker", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP E: navigationStyle default ==========
print("\n" + "=" * 60)
print("TEMP E: navigationStyle default -> visual shell FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/course/course.js",
    "pages/course/course.wxml",
    "pages/course/course.json",
    "pages/course/course.wxss",
])

# Mutate
cj = os.path.join(d, "pages", "course", "course.json")
cjson = json.loads(read_utf8(cj))
cjson["navigationStyle"] = "default"
write_utf8_lf(cj, json.dumps(cjson, indent=2))

code, out, err = run_node("tools/check_r6_6c1_secondary_visual_shell_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("E", "navigationStyle default -> visual shell", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP F: Delete goBack handler ==========
print("\n" + "=" * 60)
print("TEMP F: Delete goBack handler -> visual shell FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/course/course.js",
    "pages/course/course.wxml",
    "pages/course/course.json",
    "pages/course/course.wxss",
])

# Mutate: remove goBack function from JS
cjs = os.path.join(d, "pages", "course", "course.js")
cjs_content = read_utf8(cjs)
cjs_content = re.sub(r"goBack\s*:\s*function\s*\(\)\s*\{[^}]*\},?\s*", "// REMOVED", cjs_content)
write_utf8_lf(cjs, cjs_content)

code, out, err = run_node("tools/check_r6_6c1_secondary_visual_shell_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("F", "Delete goBack handler -> visual shell", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP H: White background ==========
print("\n" + "=" * 60)
print("TEMP H: White root background -> visual shell FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/course/course.js",
    "pages/course/course.wxml",
    "pages/course/course.json",
    "pages/course/course.wxss",
])

# Mutate: set background to white
cwxss = os.path.join(d, "pages", "course", "course.wxss")
cwxss_content = read_utf8(cwxss)
cwxss_content = cwxss_content.replace("var(--qp-color-canvas)", "#ffffff")
write_utf8_lf(cwxss, cwxss_content)

code, out, err = run_node("tools/check_r6_6c1_secondary_visual_shell_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("H", "White root background -> visual shell", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP I: Delete fallback ==========
print("\n" + "=" * 60)
print("TEMP I: Delete fallback entry -> visual shell FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/course/course.js",
    "pages/course/course.wxml",
    "pages/course/course.json",
    "pages/course/course.wxss",
])

# Mutate: remove the course fallback from secondary-navigation.js
nav_path = os.path.join(d, "utils", "secondary-navigation.js")
nav_content = read_utf8(nav_path)
nav_content = re.sub(r"'pages/course/course':\s*\{[^}]*\},?\s*", "", nav_content)
write_utf8_lf(nav_path, nav_content)

code, out, err = run_node("tools/check_r6_6c1_secondary_visual_shell_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("I", "Delete fallback -> visual shell", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP C: CurrentCard removed ==========
print("\n" + "=" * 60)
print("TEMP C: Delete currentCard -> flashcard runtime FAIL")
print("=" * 60)
# Need a flashcard player fixture
fp_src = os.path.join(ROOT, "packages", "quiz-itpass-1", "pages", "flashcard-player")
d = copy_fixture()
os.makedirs(os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player"), exist_ok=True)
for f in os.listdir(fp_src):
    shutil.copy2(os.path.join(fp_src, f),
                 os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player", f))

# Mutate: remove currentCard from JS
fp_js = os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player", "flashcard-player.js")
fp_js_content = read_utf8(fp_js)
fp_js_content = fp_js_content.replace("currentCard", "REMOVED_CARD")
write_utf8_lf(fp_js, fp_js_content)

# Also remove from WXML
fp_wxml = os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player", "flashcard-player.wxml")
fp_wxml_content = read_utf8(fp_wxml)
fp_wxml_content = fp_wxml_content.replace("currentCard", "REMOVED_CARD")
write_utf8_lf(fp_wxml, fp_wxml_content)

code, out, err = run_node("tools/check_r6_6c1_flashcard_runtime_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("C", "Delete currentCard -> flashcard runtime", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP D: Empty/error states removed ==========
print("\n" + "=" * 60)
print("TEMP D: Delete empty/error states -> flashcard runtime FAIL")
print("=" * 60)
d = copy_fixture()
os.makedirs(os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player"), exist_ok=True)
for f in os.listdir(fp_src):
    shutil.copy2(os.path.join(fp_src, f),
                 os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player", f))

# Mutate: remove the WXML blocks for empty and error states
fp_wxml2 = os.path.join(d, "packages", "quiz-itpass-1", "pages", "flashcard-player", "flashcard-player.wxml")
fpw_content = read_utf8(fp_wxml2)
# Remove the fc-empty block
fpw_content = re.sub(r'<view class="fc-empty"[^>]*>.*?</view>', "", fpw_content, flags=re.DOTALL)
# Remove the fc-error block
fpw_content = re.sub(r'<view class="fc-error"[^>]*>.*?</view>', "", fpw_content, flags=re.DOTALL)
write_utf8_lf(fp_wxml2, fpw_content)

code, out, err = run_node("tools/check_r6_6c1_flashcard_runtime_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("D", "Delete empty/error states -> flashcard runtime", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== TEMP G: Full-width goBack bind ==========
print("\n" + "=" * 60)
print("TEMP G: Full-width goBack bind -> visual shell FAIL")
print("=" * 60)
d = copy_fixture(subset=[
    "pages/course/course.js",
    "pages/course/course.wxml",
    "pages/course/course.json",
    "pages/course/course.wxss",
])

# Mutate: add bindtap="goBack" to the root .cs-page container
cwxml = os.path.join(d, "pages", "course", "course.wxml")
cwxml_content = read_utf8(cwxml)
cwxml_content = cwxml_content.replace(
    '<view class="cs-page {{__themeDark',
    '<view class="cs-page {{__themeDark')
# Add goBack to the root view
cwxml_content = cwxml_content.replace(
    '<view class="cs-page',
    '<view bindtap="goBack" class="cs-page')
write_utf8_lf(cwxml, cwxml_content)

code, out, err = run_node("tools/check_r6_6c1_secondary_visual_shell_contract.js", cwd=d)
status = PASS if code != 0 else FAIL
print(f"  exit={code} {status}")
results.append(("G", "Full-width goBack bind -> visual shell", status, f"exit={code}"))

shutil.rmtree(d, ignore_errors=True)

# ========== Summary ==========
print("\n" + "=" * 60)
print("TEMP A-J RESULTS")
print("=" * 60)
all_results_pass = True
for label, desc, status, evidence in results:
    print(f"  {label}: {status} — {desc}")
    if status == FAIL:
        all_results_pass = False
        print(f"    Evidence: {evidence}")

print(f"\nFinal: {'ALL PASS' if all_results_pass else 'SOME FAILED'}")
sys.exit(0 if all_results_pass else 1)
