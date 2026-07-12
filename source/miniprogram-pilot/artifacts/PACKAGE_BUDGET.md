# Package Budget (Release Candidate)

Hard limit (productization): **subpackage ≤ 1.80 MB** for course-sg/course-itpass (productization gate).  
Watch line (audit): **1.50 MB**.  
Quiz split package smoke guard: **≤ 2.30 MB**.

## Current measured sizes (local audit)

| Package | Size | Budget | Status |
|---|---:|---:|---|
| main-package candidate | 281.4 KB | ≤ 2 MB practical | OK |
| packages/course-sg | **1.66 MB** | ≤ 1.80 MB | OK (was 1.96) |
| packages/course-itpass | 911.5 KB | ≤ 1.80 MB | OK |
| packages/course-content | 127.6 KB | ≤ 500 KB | OK |
| packages/quiz | 433.1 KB | ≤ 2.30 MB | OK |
| packages/quiz-itpass-1 | 1.67 MB | ≤ 2.30 MB | OK / watch |
| packages/quiz-itpass-2 | 1.41 MB | ≤ 2.30 MB | OK |
| packages/quiz-itpass-3 | 1.58 MB | ≤ 2.30 MB | OK / watch |
| packages/quiz-itpass-4 | 1.73 MB | ≤ 2.30 MB | OK / watch |
| packages/quiz-itpass-5 | 1.68 MB | ≤ 2.30 MB | OK / watch |
| packages/quiz-sg-1 | 827.1 KB | ≤ 2.30 MB | OK |
| packages/quiz-sg-2 | 1.41 MB | ≤ 2.30 MB | OK |
| packages/java-course-a | 1.58 MB | ≤ 2.30 MB | OK / watch |
| packages/java-course-b | 1.53 MB | ≤ 2.30 MB | OK / watch |
| packages/python-course | 947.7 KB | ≤ 2.30 MB | OK |
| packages/sql-course | 40.5 KB | ≤ 2.30 MB | OK |
| packages/glossary | 1.16 MB | ≤ 2.30 MB | OK |

## Engineering rule that recovered course-sg

- Compact chapter/data JSON serialization (`module.exports=<compact json>`)
- **Do not compact** code modules with functions (`manifest.js`, `loader.js`, `term-resolver.js`, `sources.js`)
- Do not delete learningExperience / knowledge content for size

## Future growth headroom

| Package | Free under 1.80MB | Free under 2.30MB |
|---|---:|---:|
| course-sg | ~0.14 MB | ~0.64 MB |
| quiz-itpass-4 | n/a | ~0.57 MB |
| quiz-itpass-1 | n/a | ~0.63 MB |

If course-sg grows again: split chapters into secondary subpackage or lazy remote content — do not strip Golden LE.
