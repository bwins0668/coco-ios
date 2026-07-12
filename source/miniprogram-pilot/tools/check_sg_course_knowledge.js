#!/usr/bin/env node
'use strict';

/**
 * SG course knowledge quality gate — Golden Baseline edition.
 * Supports:
 *   node tools/check_sg_course_knowledge.js
 *   node tools/check_sg_course_knowledge.js --chapter 2
 *   node tools/check_sg_course_knowledge.js --all
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const TEMPLATE_RE = /先判断它属于|先判断它是在讲|这样可以把|不是直接问定义|做SG案例题时不会只按词面选择|考试常用.*是判断线索/;
const KANA_RE = /[ぁ-んァ-ン]/;

const GOLD = {
  coreMin: 120,
  whyMin: 90,
  caseMinItems: 3,
  caseItemMin: 40,
  caseTotalMin: 180,
  examMin: 50,
  examCuesMin: 2,
  mistakeMin: 2,
  mistakeBodyMin: 40,
  memoryMin: 2,
  memoryTipMin: 12,
  quizExplMin: 30,
  overviewMin: 100,
  preMin: 3
};

function hasText(v) {
  return !!(v && String(v).trim());
}

function len(v) {
  return String(v || '').trim().length;
}

function loadChapter(n) {
  const id = String(n).padStart(2, '0');
  const file = path.join(ROOT, `packages/course-sg/data/chapter-${id}.js`);
  delete require.cache[require.resolve(file)];
  return require(file);
}

function leComplete(le) {
  if (!le || typeof le !== 'object') return false;
  return !!(
    le.coreConcept &&
    hasText(le.coreConcept.bodyZh) &&
    le.whyImportant &&
    hasText(le.whyImportant.bodyZh) &&
    Array.isArray(le.prerequisiteConcepts) && le.prerequisiteConcepts.length >= GOLD.preMin &&
    Array.isArray(le.caseBreakdown) && le.caseBreakdown.length >= GOLD.caseMinItems &&
    le.examPattern && hasText(le.examPattern.bodyZh) &&
    Array.isArray(le.examCues) && le.examCues.length >= GOLD.examCuesMin &&
    Array.isArray(le.mistakeComparisons) && le.mistakeComparisons.length >= GOLD.mistakeMin &&
    Array.isArray(le.memoryTips) && le.memoryTips.length >= GOLD.memoryMin &&
    le.quizMapping
  );
}

function checkGoldenUnit(unit, failures) {
  const le = unit.learningExperience || {};
  const id = unit.id;

  if (!leComplete(le)) failures.push(`${id}: learningExperience incomplete for golden baseline`);

  if (len(le.coreConcept && le.coreConcept.bodyZh) < GOLD.coreMin) {
    failures.push(`${id}: coreConcept bodyZh < ${GOLD.coreMin}`);
  }
  if (len(le.whyImportant && le.whyImportant.bodyZh) < GOLD.whyMin) {
    failures.push(`${id}: whyImportant bodyZh < ${GOLD.whyMin}`);
  }
  const why = String((le.whyImportant && le.whyImportant.bodyZh) || '');
  if (why && /考试|IPA|出题/.test(why) && !/企业|业务|组织|经营|事故|损失|客户|预算|营业/.test(why)) {
    failures.push(`${id}: whyImportant appears exam-only without business meaning`);
  }

  const cases = le.caseBreakdown || [];
  if (cases.length < GOLD.caseMinItems) failures.push(`${id}: caseBreakdown count < ${GOLD.caseMinItems}`);
  let caseTotal = 0;
  cases.forEach((c, i) => {
    const n = len(c.bodyZh);
    caseTotal += n;
    if (n < GOLD.caseItemMin) failures.push(`${id}: caseBreakdown[${i}] bodyZh < ${GOLD.caseItemMin}`);
    if (!hasText(c.labelZh) && !hasText(c.labelJa)) failures.push(`${id}: caseBreakdown[${i}] missing label`);
  });
  if (caseTotal < GOLD.caseTotalMin) failures.push(`${id}: caseBreakdown total < ${GOLD.caseTotalMin}`);

  if (len(le.examPattern && le.examPattern.bodyZh) < GOLD.examMin) {
    failures.push(`${id}: examPattern bodyZh < ${GOLD.examMin}`);
  }
  if ((le.examCues || []).length < GOLD.examCuesMin) {
    failures.push(`${id}: examCues count < ${GOLD.examCuesMin}`);
  }

  const mistakes = le.mistakeComparisons || [];
  if (mistakes.length < GOLD.mistakeMin) failures.push(`${id}: mistakeComparisons count < ${GOLD.mistakeMin}`);
  mistakes.forEach((m, i) => {
    if (!hasText(m.aZh) || !hasText(m.bZh)) failures.push(`${id}: mistakeComparisons[${i}] missing A/B labels`);
    if (len(m.bodyZh) < GOLD.mistakeBodyMin) failures.push(`${id}: mistakeComparisons[${i}] bodyZh short`);
  });

  const tips = le.memoryTips || [];
  if (tips.length < GOLD.memoryMin) failures.push(`${id}: memoryTips count < ${GOLD.memoryMin}`);
  tips.forEach((t, i) => {
    if (len(t.tipZh) < GOLD.memoryTipMin) failures.push(`${id}: memoryTips[${i}] tipZh short`);
  });

  const qm = le.quizMapping || {};
  if (len(qm.explanationZh) < GOLD.quizExplMin) failures.push(`${id}: quizMapping explanationZh short`);
  const ids = qm.relatedQuestionIds || [];
  const real = unit.relatedQuestionIds || [];
  const a = ids.slice().sort().join('|');
  const b = real.slice().sort().join('|');
  if (a !== b) failures.push(`${id}: quizMapping relatedQuestionIds inconsistent with unit`);
  if (ids.length > 0 && real.length === 0) failures.push(`${id}: quizMapping forged relatedQuestionIds`);

  if (len(unit.overviewZh) < GOLD.overviewMin) failures.push(`${id}: overviewZh < ${GOLD.overviewMin}`);
  if (TEMPLATE_RE.test(String(unit.overviewZh || ''))) failures.push(`${id}: overviewZh template hit`);
  if (KANA_RE.test(String(unit.overviewZh || ''))) failures.push(`${id}: overviewZh contains kana`);

  // LE Chinese fields kana check
  const leZhChunks = [
    le.coreConcept && le.coreConcept.bodyZh,
    le.whyImportant && le.whyImportant.bodyZh,
    ...(le.caseBreakdown || []).map((c) => c.bodyZh),
    ...(le.mistakeComparisons || []).map((m) => m.bodyZh),
    ...(le.memoryTips || []).map((t) => t.tipZh),
    qm.explanationZh
  ];
  leZhChunks.forEach((chunk, i) => {
    if (KANA_RE.test(String(chunk || ''))) failures.push(`${id}: LE zh field[${i}] contains kana`);
  });

  (unit.sections || []).forEach((s, idx) => {
    if (TEMPLATE_RE.test(String(s.explanationZh || ''))) failures.push(`${id}: section[${idx}] template hit`);
    if (KANA_RE.test(String(s.explanationZh || ''))) failures.push(`${id}: section[${idx}] explanationZh contains kana`);
  });
}

function parseArgs(argv) {
  const args = { chapters: [1], mode: 'default' };
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--all') {
      args.chapters = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      args.mode = 'all';
    } else if (argv[i] === '--chapter') {
      args.chapters = [Number(argv[++i])];
      args.mode = 'chapter';
    }
  }
  return args;
}

function checkUi(failures) {
  const wxml = fs.readFileSync(path.join(ROOT, 'packages/course-sg/pages/unit-detail/unit-detail.wxml'), 'utf8');
  const js = fs.readFileSync(path.join(ROOT, 'packages/course-sg/pages/unit-detail/unit-detail.js'), 'utf8');
  if (!/hasLearningExperience/.test(wxml) || !/learningExperience/.test(wxml)) {
    failures.push('UI: unit-detail.wxml missing learningExperience binding');
  }
  if (!/hasLearningExperience/.test(js)) {
    failures.push('UI: unit-detail.js missing hasLearningExperience compatibility branch');
  }
  if (!/定义暂未完成/.test(wxml)) {
    failures.push('UI: missing honest empty term definition label');
  }
  if (!/showOriginal/.test(wxml) || !/toggleOriginal/.test(js)) {
    failures.push('UI: missing original Japanese collapsible control (golden reading rhythm)');
  }
}

function main() {
  const args = parseArgs(process.argv);
  const failures = [];
  const chapterReports = [];
  let allUnits = 0;
  let goldenPass = 0;
  let leCount = 0;
  let whyCount = 0;
  let memoryCount = 0;
  let quizMapCount = 0;
  let templateHits = 0;
  let mixedHits = 0;
  let termTotal = 0;
  let termDefReady = 0;

  const termResolver = require(path.join(ROOT, 'packages/course-sg/data/term-resolver.js'));

  args.chapters.forEach((chapterNo) => {
    const chapter = loadChapter(chapterNo);
    const units = chapter.units || [];
    let chPass = 0;
    let chFailBefore = failures.length;

    units.forEach((unit) => {
      allUnits += 1;
      const before = failures.length;
      checkGoldenUnit(unit, failures);
      if (failures.length === before) {
        goldenPass += 1;
        chPass += 1;
      }

      const le = unit.learningExperience;
      if (leComplete(le)) leCount += 1;
      if (le && le.whyImportant && hasText(le.whyImportant.bodyZh)) whyCount += 1;
      if (le && Array.isArray(le.memoryTips) && le.memoryTips.length >= GOLD.memoryMin) memoryCount += 1;
      if (le && le.quizMapping) quizMapCount += 1;
      if (TEMPLATE_RE.test(String(unit.overviewZh || ''))) templateHits += 1;
      if (KANA_RE.test(String(unit.overviewZh || ''))) mixedHits += 1;
      (unit.sections || []).forEach((s) => {
        if (TEMPLATE_RE.test(String(s.explanationZh || ''))) templateHits += 1;
        if (KANA_RE.test(String(s.explanationZh || ''))) mixedHits += 1;
      });

      const resolved = termResolver.resolveDisplayTerms(unit);
      (resolved.terms || []).forEach((t) => {
        termTotal += 1;
        if (t.definitionReady || hasText(t.definitionZh)) termDefReady += 1;
      });
    });

    chapterReports.push({
      chapter: chapterNo,
      id: chapter.chapter && chapter.chapter.id,
      titleZh: chapter.chapter && chapter.chapter.titleZh,
      units: units.length,
      goldenPass: chPass,
      completeRate: units.length ? +(chPass / units.length * 100).toFixed(1) : 0,
      newFailures: failures.length - chFailBefore
    });
  });

  checkUi(failures);

  const report = {
    scope: args.mode === 'all' ? 'chapters-1-to-9' : (`chapter-${String(args.chapters[0]).padStart(2, '0')}`),
    goldThresholds: GOLD,
    chapters: chapterReports,
    totals: {
      units: allUnits,
      goldenPass,
      learningExperienceComplete: leCount,
      whyImportant: whyCount,
      memoryTips: memoryCount,
      quizMapping: quizMapCount,
      templateHits,
      mixedKanaHits: mixedHits,
      termTotal,
      termDefinitionReady: termDefReady
    },
    rates: {
      goldenPass: allUnits ? +(goldenPass / allUnits * 100).toFixed(1) : 0,
      learningExperience: allUnits ? +(leCount / allUnits * 100).toFixed(1) : 0,
      whyImportant: allUnits ? +(whyCount / allUnits * 100).toFixed(1) : 0,
      memoryTips: allUnits ? +(memoryCount / allUnits * 100).toFixed(1) : 0,
      quizMapping: allUnits ? +(quizMapCount / allUnits * 100).toFixed(1) : 0,
      termDefinition: termTotal ? +(termDefReady / termTotal * 100).toFixed(1) : 0
    },
    failures: failures.slice(0, 100),
    failureCount: failures.length,
    ok: failures.length === 0 && goldenPass === allUnits && templateHits === 0 && mixedHits === 0
  };

  console.log('=== SG COURSE KNOWLEDGE GATE (GOLDEN) ===');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) {
    console.log('\n[FAIL] SG course knowledge gate');
    process.exit(1);
  }
  console.log('\n[PASS] SG course knowledge gate');
}

main();
