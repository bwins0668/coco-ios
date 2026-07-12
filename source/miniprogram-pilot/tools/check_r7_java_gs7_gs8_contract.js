/**
 * check_r7_java_gs7_gs8_contract.js
 * R7.GS7-GS8-REBUILD - Inheritance and GC golden contract checker.
 */
const fs = require('fs');
const path = require('path');

let root = process.cwd();
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root' && args[i + 1]) {
    root = path.resolve(args[i + 1]);
    i++;
  }
}

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

// Load chapters
function getChapterPath(pkg, file) {
  return path.resolve(root, 'packages', pkg, 'data', 'chapters', file);
}

function loadChapter(pkg, file) {
  const filePath = getChapterPath(pkg, file);
  if (!fs.existsSync(filePath)) {
    fail(`Chapter file does not exist: ${filePath}`);
    return null;
  }
  delete require.cache[require.resolve(filePath)];
  return require(filePath);
}

const ch07 = loadChapter('java-course-b', 'java-ch07.js');
const ch12 = loadChapter('java-course-b', 'java-ch12.js');

if (!ch07 || !ch12) {
  console.error('Failed to load required chapters.');
  process.exit(1);
}

const gs7Lesson = (ch07.lessons || []).find(l => l.lessonId === 'intro-ch07-lesson-001');
const gs8Lesson = (ch12.lessons || []).find(l => l.lessonId === 'practice-ch04-lesson-001');

if (!gs7Lesson) {
  fail('GS7 lesson (intro-ch07-lesson-001) not found in java-ch07.js');
}
if (!gs8Lesson) {
  fail('GS8 lesson (practice-ch04-lesson-001) not found in java-ch12.js');
}

function checkBilingual(obj, pathStr) {
  if (!obj) {
    fail(`Missing object at ${pathStr}`);
    return;
  }
  if (!obj.ja || !obj.ja.trim()) {
    fail(`Missing Japanese text at ${pathStr}`);
  }
  if (!obj.zh || !obj.zh.trim()) {
    fail(`Missing Chinese text at ${pathStr}`);
  }
}

function getLearnerVisibleText(lesson) {
  const parts = [];

  if (lesson.title) {
    parts.push(lesson.title.ja, lesson.title.zh);
  }
  if (lesson.objectives) {
    lesson.objectives.forEach(o => parts.push(o.ja, o.zh));
  }
  if (lesson.prerequisites) {
    lesson.prerequisites.forEach(p => parts.push(p.ja, p.zh));
  }
  if (lesson.blocks) {
    lesson.blocks.forEach(b => {
      parts.push(b.ja, b.zh);
      if (b.title) parts.push(b.title.ja, b.title.zh);
    });
  }
  if (lesson.terms) {
    lesson.terms.forEach(t => {
      parts.push(t.ja, t.zh);
      if (t.explanationJa) parts.push(t.explanationJa);
      if (t.explanationZh) parts.push(t.explanationZh);
    });
  }
  if (lesson.codeExamples) {
    lesson.codeExamples.forEach(c => {
      parts.push(c.jaExplanation, c.zhExplanation);
      if (c.lineNotes) {
        c.lineNotes.forEach(ln => parts.push(ln.ja, ln.zh));
      }
    });
  }
  if (lesson.commonMistakes) {
    lesson.commonMistakes.forEach(cm => parts.push(cm.ja, cm.zh));
  }
  if (lesson.handson) {
    parts.push(lesson.handson.ja, lesson.handson.zh);
  }
  if (lesson.summary) {
    parts.push(lesson.summary.ja, lesson.summary.zh);
  }
  if (lesson.nextLessonBridge) {
    parts.push(lesson.nextLessonBridge.ja, lesson.nextLessonBridge.zh);
  }

  return parts.filter(Boolean).join('\n');
}

function checkCommonContracts(lesson, label) {
  if (!lesson) return;

  // 1. Structural checklist
  if (!lesson.title) fail(`[${label}] Missing title`);
  else checkBilingual(lesson.title, `${label}.title`);

  if (!lesson.objectives || lesson.objectives.length < 2) {
    fail(`[${label}] Must have at least 2 objectives`);
  } else {
    lesson.objectives.forEach((o, i) => checkBilingual(o, `${label}.objectives[${i}]`));
  }

  if (!lesson.blocks || lesson.blocks.length === 0) {
    fail(`[${label}] Missing blocks`);
  } else {
    const blockTypes = lesson.blocks.map(b => b.type);
    if (!blockTypes.includes('learning-goal')) {
      fail(`[${label}] Missing learning-goal (why) block`);
    }
    const mindModelTypes = ['mechanic', 'beginner-note', 'pitfall', 'practice-prep'];
    mindModelTypes.forEach(t => {
      if (!blockTypes.includes(t)) {
        fail(`[${label}] Missing mind model block of type: ${t}`);
      }
    });

    lesson.blocks.forEach((b, i) => {
      checkBilingual(b, `${label}.blocks[${i}]`);
      if (b.title) checkBilingual(b.title, `${label}.blocks[${i}].title`);
    });
  }

  // Terms
  if (!lesson.terms || lesson.terms.length < 3) {
    fail(`[${label}] Must have at least 3 terms`);
  } else {
    lesson.terms.forEach((t, i) => {
      if (!t.en || !t.en.trim()) fail(`[${label}] Missing English term at index ${i}`);
      if (!t.ja || !t.ja.trim()) fail(`[${label}] Missing Japanese term at index ${i}`);
      if (!t.zh || !t.zh.trim()) fail(`[${label}] Missing Chinese term at index ${i}`);
      if (!t.explanationJa || !t.explanationJa.trim()) fail(`[${label}] Missing Japanese explanation for term ${t.en}`);
      if (!t.explanationZh || !t.explanationZh.trim()) fail(`[${label}] Missing Chinese explanation for term ${t.en}`);
    });
  }

  // Mistakes
  if (!lesson.commonMistakes || lesson.commonMistakes.length < 3) {
    fail(`[${label}] Must have at least 3 commonMistakes`);
  } else {
    lesson.commonMistakes.forEach((cm, i) => checkBilingual(cm, `${label}.commonMistakes[${i}]`));
  }

  // Hands-on
  if (!lesson.handson) {
    fail(`[${label}] Missing handson`);
  } else {
    checkBilingual(lesson.handson, `${label}.handson`);
  }

  // Summary
  if (!lesson.summary) {
    fail(`[${label}] Missing summary`);
  } else {
    checkBilingual(lesson.summary, `${label}.summary`);
  }

  // Next lesson bridge
  if (!lesson.nextLessonBridge) {
    fail(`[${label}] Missing nextLessonBridge`);
  } else {
    checkBilingual(lesson.nextLessonBridge, `${label}.nextLessonBridge`);
  }

  // Code Examples
  if (!lesson.codeExamples || lesson.codeExamples.length === 0) {
    fail(`[${label}] Missing codeExamples`);
  } else {
    lesson.codeExamples.forEach((ex, i) => {
      if (!ex.className || !ex.className.trim()) fail(`[${label}] Missing className at codeExamples[${i}]`);
      if (!ex.code || !ex.code.trim()) fail(`[${label}] Missing code at codeExamples[${i}]`);
      if (ex.runnable && (ex.expectedOutput === undefined || ex.expectedOutput === null)) {
        fail(`[${label}] Runnable code must have expectedOutput`);
      }

      // expectedOutput check: no lesson= or profile=
      if (ex.expectedOutput && (ex.expectedOutput.includes('lesson=') || ex.expectedOutput.includes('profile='))) {
        fail(`[${label}] expectedOutput must not contain lesson= or profile= metadata`);
      }

      // lineNotes
      if (!ex.lineNotes || ex.lineNotes.length < 4) {
        fail(`[${label}] Code example must have at least 4 lineNotes`);
      } else {
        ex.lineNotes.forEach((ln, j) => {
          if (!ln.line) fail(`[${label}] Missing line number in lineNotes[${j}]`);
          if (!ln.snippet || !ln.snippet.trim()) fail(`[${label}] Missing snippet in lineNotes[${j}]`);
          checkBilingual(ln, `${label}.codeExamples[${i}].lineNotes[${j}]`);
        });
      }
    });
  }

  // 2. Learner-visible noise check
  const visibleText = getLearnerVisibleText(lesson);
  const forbiddenPatterns = [
    /教材\d+ページ/i,
    /教材第?\s*\d+\s*页/i,
    /sourceRef/i,
    /lessonId/i,
    /chapterId/i,
    /profile/i,
    /semanticFidelity/i,
    /lesson=/i,
    /TODO/i,
    /TBD/i,
    /同上/i,
    /后面再说/i,
    /自行理解/i
  ];

  forbiddenPatterns.forEach(pattern => {
    if (pattern.test(visibleText)) {
      fail(`[${label}] Found forbidden pattern/noise in learner-visible text: ${pattern}`);
    }
  });

  // 3. No Quiz checks (cannot have Quiz-specific structures)
  function checkNoQuiz(obj, keyPath) {
    if (!obj || typeof obj !== 'object') return;
    for (const key in obj) {
      if (/^(options|correctAnswer|questionBank|wrongQuestion)$/i.test(key)) {
        fail(`[${label}] Forbidden Quiz structural key found: ${keyPath}.${key}`);
      }
      if (/^srs$/i.test(key)) {
        fail(`[${label}] Forbidden SRS structural key found: ${keyPath}.${key}`);
      }
      if (obj[key] && typeof obj[key] === 'object') {
        checkNoQuiz(obj[key], `${keyPath}.${key}`);
      }
    }
  }
  checkNoQuiz(lesson, label);
}

// Check GS7 Specifics
function checkGS7Contracts(lesson) {
  if (!lesson) return;
  checkCommonContracts(lesson, 'GS7');

  // Next lesson bridge target check
  if (lesson.nextLessonBridge) {
    const bridgeText = lesson.nextLessonBridge.ja + '\n' + lesson.nextLessonBridge.zh;
    if (!bridgeText.includes('Javaの継承') && !bridgeText.includes('Javaの继承')) {
      fail('[GS7] nextLessonBridge does not point to the real next lesson (Javaの継承)');
    }
  }

  // Java 21 Code Specifics
  const ex = lesson.codeExamples[0];
  if (ex) {
    const code = ex.code;

    // Parent & child check
    const hasParentClass = /class\s+Person\b/.test(code);
    const hasChildClass = /class\s+Student\s+extends\s+Person\b/.test(code);
    if (!hasParentClass || !hasChildClass) {
      fail('[GS7] Code example must define a Person parent class and a Student extends Person subclass');
    }

    // extends keyword check
    if (!code.includes('extends')) {
      fail('[GS7] Code example must use the "extends" keyword');
    }

    // Subclass instantiation
    if (!/new\s+Student\s*\(\s*\)/.test(code)) {
      fail('[GS7] main method must instantiate the subclass Student');
    }

    // Calling inherited member
    const hasInheritedCall = /student\.introduce\s*\(\s*\)/.test(code) || /student\.name\s*=/.test(code);
    if (!hasInheritedCall) {
      fail('[GS7] main method must call at least one inherited member (introduce() or name)');
    }

    // Subclass own member
    const hasSubclassField = /String\s+school\b/.test(code);
    const hasSubclassMethod = /void\s+study\s*\(\s*\)/.test(code);
    if (!hasSubclassField || !hasSubclassMethod) {
      fail('[GS7] Subclass Student must define its own field (school) and method (study())');
    }
    const hasOwnCall = /student\.study\s*\(\s*\)/.test(code) || /student\.school\s*=/.test(code);
    if (!hasOwnCall) {
      fail('[GS7] main method must call/use Student subclass specific members');
    }

    // Polymorphism check: must not use Parent p = new Child() or implements/interface/abstract
    if (code.includes('Parent student') || code.includes('Person student')) {
      fail('[GS7] Code example must instantiate Child as Child directly without polymorphism type assignment to Parent');
    }
    if (code.includes('interface ') || code.includes('implements ') || code.includes('abstract ')) {
      fail('[GS7] Code example must not introduce interface, implements or abstract keywords');
    }

    // Output check
    if (!ex.expectedOutput.includes('Name: Coco') || !ex.expectedOutput.includes('studying at Tech Academy')) {
      fail('[GS7] Code example expectedOutput does not prove parent reuse or subclass own functionality');
    }
  }

  // Learner-visible content specific inheritance explanations
  const visibleText = getLearnerVisibleText(lesson);
  if (!visibleText.includes('is-a') || !visibleText.includes('has-a')) {
    fail('[GS7] Learner-visible explanations must cover "is-a" vs "has-a" relationship context');
  }
}

// Check GS8 Specifics
function checkGS8Contracts(lesson) {
  if (!lesson) return;
  checkCommonContracts(lesson, 'GS8');

  // Next lesson bridge target check
  if (lesson.nextLessonBridge) {
    const bridgeText = lesson.nextLessonBridge.ja + '\n' + lesson.nextLessonBridge.zh;
    if (!bridgeText.includes('スタックとヒープ') && !bridgeText.includes('栈与堆')) {
      fail('[GS8] nextLessonBridge does not point to the real next lesson (スタックとヒープ)');
    }
  }

  const visibleText = getLearnerVisibleText(lesson);

  // GC Non-immediate execution semantic checks
  const jaGcDisclaimer = /保証はない|保証されません|とは限りません/i.test(visibleText);
  const zhGcDisclaimer = /不保证/i.test(visibleText);
  if (!jaGcDisclaimer) {
    fail('[GS8] Learner-visible Japanese content must contain warning/disclaimer that GC execution is not immediately guaranteed');
  }
  if (!zhGcDisclaimer) {
    fail('[GS8] Learner-visible Chinese content must contain warning/disclaimer that GC execution is not immediately guaranteed');
  }

  // References vs Reclamation
  if (!visibleText.includes('null') || !visibleText.includes('参照')) {
    fail('[GS8] Learner-visible content must clearly distinguish references clearing (assigning null) from actual JVM object reclamation');
  }

  // Revert template check: check that GS8 does not have "コレクション" or "集合" in the handson
  if (lesson.handson) {
    const handsonStr = lesson.handson.ja + '\n' + lesson.handson.zh;
    if (handsonStr.includes('コレクション') || handsonStr.includes('集合')) {
      fail('[GS8] Reverted template check: Hands-on exercise should not mention collections/集合');
    }
  }

  // Java 21 Code Specifics
  const ex = lesson.codeExamples[0];
  if (ex) {
    const code = ex.code;

    // Check if System.gc() is called
    if (!code.includes('System.gc()')) {
      fail('[GS8] Code example must call System.gc() to demonstrate GC request');
    }

    // No finalize
    if (code.includes('finalize')) {
      fail('[GS8] Code example must not use finalize()');
    }

    // No Thread.sleep
    if (code.includes('Thread.sleep')) {
      fail('[GS8] Code example must not use Thread.sleep() to wait for GC');
    }

    // Expected output must be deterministic and must not assert GC happened
    if (ex.expectedOutput.includes('回收') || ex.expectedOutput.includes('GC done') || ex.expectedOutput.includes('GC completed')) {
      fail('[GS8] expectedOutput must not assert that GC actually finished or executed');
    }

    // Unstable values/memory size checks
    if (code.includes('freeMemory') || code.includes('totalMemory') || code.includes('maxMemory')) {
      fail('[GS8] Code example must not rely on unstable Runtime memory statistics');
    }
  }

  // Hands-on verification: must not ask to check exact reclamation timing
  const handsonText = lesson.handson.ja + '\n' + lesson.handson.zh;
  if (/確認|观察/i.test(handsonText) && /回收|解放|消滅/i.test(handsonText)) {
    if (!/手続き|确定|顺序/i.test(handsonText)) {
      fail('[GS8] Hands-on exercise must not ask to confirm GC or observe timing: ' + handsonText);
    }
  }
}

// Cross-Golden checks (avoid templates / copy-paste replication)
function checkCrossGoldenContracts() {
  if (!gs7Lesson || !gs8Lesson) return;

  // Compare GS7 and GS8 visible text similarity
  const text7 = getLearnerVisibleText(gs7Lesson);
  const text8 = getLearnerVisibleText(gs8Lesson);

  if (text7.replace(/\s+/g, '') === text8.replace(/\s+/g, '')) {
    fail('GS7 and GS8 learner visible texts are identical copies');
  }

  // Compare with GS5-GS6 to ensure no boilerplate replacement
  const ch05Path = path.resolve(root, 'packages/java-course-a/data/chapters/java-ch05.js');
  const ch06Path = path.resolve(root, 'packages/java-course-a/data/chapters/java-ch06.js');

  if (fs.existsSync(ch05Path)) {
    const ch05 = require(ch05Path);
    const gs5Lesson = (ch05.lessons || []).find(l => l.lessonId === 'intro-ch05-lesson-003');
    if (gs5Lesson) {
      const text5 = getLearnerVisibleText(gs5Lesson);
      if (text7.replace(/\s+/g, '') === text5.replace(/\s+/g, '')) {
        fail('GS7 learner visible text is a duplicate of GS5');
      }
    }
  }
}

checkGS7Contracts(gs7Lesson);
checkGS8Contracts(gs8Lesson);
checkCrossGoldenContracts();

console.log(`[GS7-GS8 Contract Checker] Completed with ${errors.length} errors and ${warnings.length} warnings.`);

if (errors.length > 0) {
  console.error('--- ERRORS ---');
  errors.forEach(e => console.error(e));
}
if (warnings.length > 0) {
  console.warn('--- WARNINGS ---');
  warnings.forEach(w => console.warn(w));
}

// Strict exit conditions: fail on error OR warning
if (errors.length > 0 || warnings.length > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
