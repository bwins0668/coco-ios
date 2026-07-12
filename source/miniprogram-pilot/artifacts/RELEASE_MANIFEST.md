# Study Tools Mini Program · Release Manifest

Status target: `STUDY_TOOLS_RELEASE_CANDIDATE_READY`  
Workspace: `G:/项目/study-tools-miniprogram-quizzh-pilot`  
Branch: `chore/quizzh-sg1-pilot`  
Policy: no commit / no push / no merge / no release in this sprint

## A. Production runtime (must ship)

### App shell
- `app.js`, `app.json`, `app.wxss`
- `project.config.json` (packOptions.ignore must keep artifacts/tools noise out of upload)
- `sitemap.json` (if present)
- `custom-tab-bar/**`
- `styles/**`
- `utils/**` used by pages/packages
- `pages/**` (home / practice / review / course* / flashcards / glossary / mistakes / profile)

### Content subpackages
- `packages/quiz/**`
- `packages/quiz-itpass-1..5/**`
- `packages/quiz-sg-1/**`, `packages/quiz-sg-2/**`
- `packages/course-content/**`
- `packages/course-itpass/**`
- `packages/course-sg/**` (compact chapter data + loader/term-resolver/sources)
- `packages/java-course/**`, `packages/java-course-a/b/c/**`
- `packages/python-course/**`, `packages/python-course-foundations-b/**`
- `packages/sql-course/**`
- `packages/glossary/**`

## B. Tools (dev/CI only — do not upload as product content)

- `tools/**` (gates, smoke, audits)
- Keep available in repo for release verification:
  - `tools/run_miniprogram_checks.js`
  - `tools/miniprogram_smoke_test.js`
  - `tools/check_sg_course_knowledge.js`
  - `tools/check_textbook_course_*.js`
  - `tools/audit_miniprogram_package_size.js`

## C. Artifacts (non-release)

- `artifacts/**` including:
  - R23.7 batch/review/checkpoint/cache outputs
  - SG expansion/compact helper scripts
  - Golden rules docs
  - This release manifest

## D. Not product surface

- Dirty local-only notes, temporary audit scripts
- External worktrees outside this workspace
- Any secrets / private keys (none should be in tree)

## E. Language policy (productization)

- **Chinese primary** for product chrome (tab, home titles, CTAs)
- Japanese remains content language for exam source / original textbook blocks
- Home masthead updated: `课程 · 学习` (was mixed JP kicker)

## F. Textbook quality single source of truth

- Runtime SG teaching quality: **Golden learningExperience** (`tools/check_sg_course_knowledge.js`)
- Textbook fidelity/content checkers consume live package data and do not dual-fail ZH section shell when Golden LE exists
