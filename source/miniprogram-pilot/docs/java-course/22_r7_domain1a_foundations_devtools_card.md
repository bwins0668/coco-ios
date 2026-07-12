# R7 Domain1A Foundations — DevTools Card

## Quick Verification

```bash
# Run the Domain1A fail-closed contract
node tools/check_r7_java_domain1a_contract.js

# Run TEMP A-Q self-tests
node tools/check_r7_java_domain1a_contract_selftest.js

# Individual gates
node tools/check_r7_java_gs1_contract.js        # GS1 frozen lesson hash
node tools/check_r7_java_gs2_contract.js        # GS2 frozen lesson hash
node tools/check_r7_java_no_quiz_contract.js     # No quiz token leakage
node tools/check_r7_java_bilingual_content_quality.js  # Bilingual quality
node tools/check_r7_java_examples_compile.js     # Java compile (336 examples)

# Diff scope
git diff --name-only
# Expected output (maximum 6 files):
#   packages/java-course-a/data/chapters/java-ch01.js
#   packages/java-course-a/data/chapters/java-ch02.js
#   tools/check_r7_java_domain1a_contract.js
#   tools/check_r7_java_domain1a_contract_selftest.js
#   docs/java-course/21_r7_domain1a_foundations_scope_audit.md
#   docs/java-course/22_r7_domain1a_foundations_devtools_card.md

# Worktree state
git status --short --branch
# Expected: only the 6 allowed files, no untracked files beyond the 4 new files
```

## Commit (after review)

```bash
git add packages/java-course-a/data/chapters/java-ch01.js \
        packages/java-course-a/data/chapters/java-ch02.js \
        tools/check_r7_java_domain1a_contract.js \
        tools/check_r7_java_domain1a_contract_selftest.js \
        docs/java-course/21_r7_domain1a_foundations_scope_audit.md \
        docs/java-course/22_r7_domain1a_foundations_devtools_card.md

git commit -m "feat(java): rebuild domain 1A program structure, output, and variable foundations"
```

## Blocked State Recovery

If any gate returns BLOCKED, verify:
1. `git diff --name-only` — only the 6 allowed files are modified
2. `node tools/check_r7_java_gs1_contract.js` — intro-ch01-lesson-001 is untouched
3. `node tools/check_r7_java_gs2_contract.js` — intro-ch02-lesson-004 is untouched
4. `git remote -v` — no remote configured
5. `git rev-parse --abbrev-ref --symbolic-full-name @{upstream}` — should fail (no upstream)

Do NOT:
- Run `git add .` or `git add -A`
- Push to any remote
- Modify any frozen lesson
- Read old Domain1A worktree content
