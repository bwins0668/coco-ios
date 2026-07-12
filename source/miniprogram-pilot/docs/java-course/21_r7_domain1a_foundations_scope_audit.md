# R7 Domain1A Foundations — Scope Audit

## Metadata

- **Date**: 2026-07-02
- **Round**: R7.DOMAIN-1A-R1
- **Baseline**: 56a9336314350a4d461a1f1603e146fd854bb0d4
- **Branch**: feature/r7-java-domain1a-r1-structured
- **Status**: READY_FOR_MANUAL_DOMAIN1A_REVIEW

## Scope

Ten lessons rebuilt across two chapters, covering the Java textbook pages 5-9 (Chapter 1) and pages 18-23 (Chapter 2):

### Chapter 1 (java-ch01.js) — Rebuilt Lessons

| Lesson ID | Page | Title (zh) | Focus |
|-----------|------|------------|-------|
| intro-ch01-lesson-002 | 5 | Java 程序代码 | Source code structure: class/method/statement hierarchy, delimiters |
| intro-ch01-lesson-003 | 6 | 程序代码的运行过程 | Two-stage execution: javac compile → java run |
| intro-ch01-lesson-004 | 7 | Java 语言的特点 | Platform independence, JVM, WORA |
| intro-ch01-lesson-005 | 8 | Java 语言的程序结构 | Five-tier file structure: package → import → class → method → statement |
| intro-ch01-lesson-006 | 9 | Java 程序结构：缩进与代码块 | Indentation, nesting visualization, code formatting |

### Chapter 2 (java-ch02.js) — Rebuilt Lessons

| Lesson ID | Page | Title (zh) | Focus |
|-----------|------|------------|-------|
| intro-ch02-lesson-001 | 18 | 输出 | System.out.print vs println, newline control |
| intro-ch02-lesson-002 | 19 | 转义字符 | Escape sequences: \\n, \\t, \\\", \\\\ |
| intro-ch02-lesson-003 | 20 | 输出练习 | Hands-on practice combining output techniques |
| intro-ch02-lesson-005 | 22 | 变量的使用 | Variable usage: assignment, integer division rules, type casting |
| intro-ch02-lesson-006 | 23 | 变量的声明与类型 | Primitive types (int, double, boolean, char), reference types (String) |

## Frozen Lessons (NOT modified)

| Lesson ID | Chapter |
|-----------|---------|
| intro-ch01-lesson-001 | java-ch01 (GS1 golden) |
| intro-ch02-lesson-004 | java-ch02 (GS2 golden) |
| All GS3-GS8 lessons | java-ch03 through java-ch19 |

## Allowed Fields

All rebuilt lessons use only the approved field vocabulary:
objectives, prerequisites, blocks, terms, codeExamples, lineNotes, commonMistakes, handson, summary, nextLessonBridge

No banned fields were introduced: knowledgePoints, profile, semanticFidelity, pedagogicalDelta.

## Verification Gates

| Gate | Result |
|------|--------|
| GS1 frozen lesson hash | PASS |
| GS2 frozen lesson hash | PASS |
| No-quiz contract (72 files) | PASS |
| Bilingual content quality (336 lessons) | PASS |
| Java compile (336 examples) | PASS |
| Diff scope (2 files only) | PASS |
| Originality (Domain1A scope) | PASS |
| TEMP A-Q selftest | PASS |
