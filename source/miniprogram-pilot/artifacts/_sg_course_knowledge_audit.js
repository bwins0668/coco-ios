'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

function hasCJK(s) { return /[\u4e00-\u9fff]/.test(String(s || '')); }
function hasKana(s) { return /[ぁ-んァ-ン]/.test(String(s || '')); }
function hasJaish(s) {
  const t = String(s || '').trim();
  if (!t) return false;
  return hasKana(t) || /です|ます|である|として|について|における|など|という|を|は|が|に|の|で|と|から|まで|判断線|設問|誤答|押さえる/.test(t);
}
function classifyText(s) {
  const t = String(s || '').trim();
  if (!t) return 'missing';
  if (t === '—' || t === '-' || t === 'TODO' || t === 'TBD' || /占位|待补充|placeholder/i.test(t)) return 'placeholder';
  const cjk = hasCJK(t);
  const kana = hasKana(t);
  const jaish = hasJaish(t);
  if (cjk && !kana && !jaish) return 'zh';
  if (cjk && (kana || jaish)) return 'mixed_ja_zh';
  if (kana || jaish) return 'ja';
  if (/[A-Za-z]{3,}/.test(t) && !cjk) return 'en_or_latin';
  if (cjk) return 'zh';
  return 'other';
}
function bucket(cls) {
  if (cls === 'zh') return 'zh';
  if (cls === 'mixed_ja_zh') return 'mixed';
  if (cls === 'ja' || cls === 'en_or_latin' || cls === 'other') return 'ja_or_other';
  if (cls === 'placeholder') return 'placeholder';
  return 'missing';
}

const chapters = [];
for (let i = 1; i <= 9; i++) {
  const mod = require(path.join(ROOT, `packages/course-sg/data/chapter-0${i}.js`));
  chapters.push(mod);
}

const stats = {
  chapters: chapters.length,
  units: 0,
  sections: 0,
  traps: 0,
  sourceRefs: 0,
  keyTerms: 0,
  fields: {},
  perChapter: [],
  sampleMixedExpl: [],
  sampleZhExpl: [],
  unitsMissingAnyZh: []
};

function addField(name, val) {
  if (!stats.fields[name]) {
    stats.fields[name] = { zh: 0, ja_or_other: 0, mixed: 0, missing: 0, placeholder: 0, total: 0 };
  }
  const b = bucket(classifyText(val));
  stats.fields[name][b]++;
  stats.fields[name].total++;
}

for (const ch of chapters) {
  const meta = ch.chapter || ch;
  const chStat = {
    id: meta.id,
    titleJa: meta.titleJa,
    titleZh: meta.titleZh,
    units: 0,
    sections: 0,
    unitTitleZh: 0,
    learningGoalZh: 0,
    overviewZh: 0,
    sectionHeadingZh: 0,
    sectionExplZh: 0,
    sectionExplMixed: 0,
    sectionExplMissing: 0,
    examFocusZh: 0,
    mistakeZh: 0,
    trapZh: 0
  };
  addField('chapter.titleJa', meta.titleJa);
  addField('chapter.titleZh', meta.titleZh);

  for (const u of (ch.units || [])) {
    stats.units++;
    chStat.units++;
    addField('unit.titleJa', u.titleJa);
    addField('unit.titleZh', u.titleZh);
    addField('unit.learningGoalJa', u.learningGoalJa);
    addField('unit.learningGoalZh', u.learningGoalZh);
    addField('unit.overviewJa', u.overviewJa);
    addField('unit.overviewZh', u.overviewZh);
    if (bucket(classifyText(u.titleZh)) === 'zh') chStat.unitTitleZh++;
    if (bucket(classifyText(u.learningGoalZh)) === 'zh') chStat.learningGoalZh++;
    if (bucket(classifyText(u.overviewZh)) === 'zh') chStat.overviewZh++;
    const missing = {
      title: !String(u.titleZh || '').trim(),
      goal: !String(u.learningGoalZh || '').trim(),
      overview: !String(u.overviewZh || '').trim()
    };
    if (missing.title || missing.goal || missing.overview) {
      stats.unitsMissingAnyZh.push({ unitId: u.id, missing });
    }

    for (const s of (u.sections || [])) {
      stats.sections++;
      chStat.sections++;
      addField('section.headingJa', s.headingJa);
      addField('section.headingZh', s.headingZh);
      addField('section.explanationJa', s.explanationJa);
      addField('section.explanationZh', s.explanationZh);
      addField('section.examFocusJa', s.examFocusJa);
      addField('section.examFocusZh', s.examFocusZh);
      addField('section.commonMistakeJa', s.commonMistakeJa);
      addField('section.commonMistakeZh', s.commonMistakeZh);
      if (bucket(classifyText(s.headingZh)) === 'zh') chStat.sectionHeadingZh++;
      const explB = bucket(classifyText(s.explanationZh));
      if (explB === 'zh') chStat.sectionExplZh++;
      else if (explB === 'mixed') chStat.sectionExplMixed++;
      else if (explB === 'missing') chStat.sectionExplMissing++;
      if (bucket(classifyText(s.examFocusZh)) === 'zh') chStat.examFocusZh++;
      if (bucket(classifyText(s.commonMistakeZh)) === 'zh') chStat.mistakeZh++;
      if (stats.sampleMixedExpl.length < 6 && explB === 'mixed') {
        stats.sampleMixedExpl.push({
          unitId: u.id,
          headingJa: s.headingJa,
          explanationZh: String(s.explanationZh).slice(0, 160)
        });
      }
      if (stats.sampleZhExpl.length < 3 && explB === 'zh') {
        stats.sampleZhExpl.push({
          unitId: u.id,
          headingJa: s.headingJa,
          explanationZh: String(s.explanationZh).slice(0, 160)
        });
      }
      stats.sourceRefs += (s.sourceRefs || []).length;
    }

    for (const t of (u.commonTraps || [])) {
      stats.traps++;
      addField('trap.trapJa', t.trapJa);
      addField('trap.trapZh', t.trapZh);
      if (bucket(classifyText(t.trapZh)) === 'zh') chStat.trapZh++;
    }
    stats.keyTerms += (u.keyTerms || []).length;
    stats.sourceRefs += (u.sourceRefs || []).length;
  }
  stats.perChapter.push(chStat);
}

const pedKeys = [
  'concept', 'whyImportant', 'examPattern', 'commonConfusion', 'distinction',
  'memoryTip', 'caseStudy', 'quizMapping', 'knowledge', 'summary', 'analysis',
  'translation', 'contentZh', 'contentJa', 'pedagogy', 'examples', 'detailedExplanation'
];
const pedPresence = {};
for (const k of pedKeys) pedPresence[k] = 0;
let unitsWithAnyPed = 0;
const unitKeys = new Set();
const sectionKeys = new Set();
for (const ch of chapters) {
  for (const u of (ch.units || [])) {
    Object.keys(u).forEach((k) => unitKeys.add(k));
    let hit = false;
    for (const k of pedKeys) {
      if (u[k] != null) {
        pedPresence[k]++;
        hit = true;
      }
    }
    for (const s of (u.sections || [])) {
      Object.keys(s).forEach((k) => sectionKeys.add(k));
      for (const k of pedKeys) {
        if (s[k] != null) {
          pedPresence[k]++;
          hit = true;
        }
      }
    }
    if (hit) unitsWithAnyPed++;
  }
}

function ratio(field) {
  const f = stats.fields[field];
  if (!f || !f.total) return null;
  return {
    total: f.total,
    zh: f.zh,
    mixed: f.mixed,
    ja_or_other: f.ja_or_other,
    missing: f.missing,
    placeholder: f.placeholder,
    zhRate: Number(((f.zh / f.total) * 100).toFixed(1)),
    presentRate: Number((((f.zh + f.mixed + f.ja_or_other) / f.total) * 100).toFixed(1))
  };
}

const explLens = [];
let templateLike = 0;
let templateA = 0;
let templateB = 0;
for (const ch of chapters) {
  for (const u of (ch.units || [])) {
    for (const s of (u.sections || [])) {
      const t = String(s.explanationZh || '');
      if (!t) continue;
      explLens.push(t.length);
      if (/先判断它属于/.test(t) || /先判断它是在讲/.test(t)) templateA++;
      if (/这样可以把.*等术语/.test(t) || /这样可以把/.test(t)) templateB++;
      if (/先判断它属于|这样可以把|不是直接问定义|做SG案例题时不会只按词面选择/.test(t)) templateLike++;
    }
  }
}
explLens.sort((a, b) => a - b);

// term resolver
const termResolver = require(path.join(ROOT, 'packages/course-sg/data/term-resolver.js'));
const canonIds = Object.keys(termResolver.canonicalMap || termResolver);
let canonCount = 0;
let canonWithZh = 0;
let sampleUnitTerms = null;
try {
  // term-resolver may export resolveDisplayTerms + internal map differently
  const sampleUnit = chapters[0].units[0];
  sampleUnitTerms = termResolver.resolveDisplayTerms
    ? termResolver.resolveDisplayTerms(sampleUnit)
    : null;
} catch (e) {
  sampleUnitTerms = { error: e.message };
}

// Try to count canonical entries by reading file text
const trSrc = require('fs').readFileSync(path.join(ROOT, 'packages/course-sg/data/term-resolver.js'), 'utf8');
const canonMatches = trSrc.match(/'sg-canon-\d+':/g) || [];
const aliasBlock = /aliasMap\s*=\s*\{([\s\S]*?)\n\}/.exec(trSrc);
const aliasCount = aliasBlock ? (aliasBlock[1].match(/:/g) || []).length : null;
const defJaMatches = (trSrc.match(/definitionJa:/g) || []).length;
const defZhMatches = (trSrc.match(/definitionZh:/g) || []).length;

const loader = require(path.join(ROOT, 'packages/course-sg/data/loader.js'));
const sampleLoaded = loader.getUnitById('sg', chapters[0].units[0].id);
const sampleHasZh = !!(sampleLoaded && sampleLoaded.explanationZh === undefined && sampleLoaded.overviewZh);

// chapter-list model
let chapterListModelKeys = null;
try {
  const model = require(path.join(ROOT, 'packages/course-sg/pages/chapter-list/chapter-list-model.js'));
  chapterListModelKeys = Object.keys(model);
} catch (e) {
  chapterListModelKeys = { error: e.message };
}

const report = {
  verified: {
    worktree: ROOT,
    package: 'packages/course-sg',
    chapters: stats.chapters,
    units: stats.units,
    sections: stats.sections,
    traps: stats.traps,
    sourceRefs: stats.sourceRefs,
    keyTermsEntries: stats.keyTerms,
    unitKeys: [...unitKeys].sort(),
    sectionKeys: [...sectionKeys].sort()
  },
  coverage: {
    chapterTitleZh: ratio('chapter.titleZh'),
    unitTitleZh: ratio('unit.titleZh'),
    learningGoalZh: ratio('unit.learningGoalZh'),
    overviewZh: ratio('unit.overviewZh'),
    sectionHeadingZh: ratio('section.headingZh'),
    sectionExplanationZh: ratio('section.explanationZh'),
    examFocusZh: ratio('section.examFocusZh'),
    commonMistakeZh: ratio('section.commonMistakeZh'),
    trapZh: ratio('trap.trapZh'),
    unitTitleJa: ratio('unit.titleJa'),
    learningGoalJa: ratio('unit.learningGoalJa'),
    overviewJa: ratio('unit.overviewJa'),
    sectionExplanationJa: ratio('section.explanationJa')
  },
  perChapter: stats.perChapter,
  pedagogicalExtraFields: pedPresence,
  unitsWithAnyPed,
  unitsMissingAnyZhCount: stats.unitsMissingAnyZh.length,
  unitsMissingAnyZhSample: stats.unitsMissingAnyZh.slice(0, 10),
  explanationZhQuality: {
    count: explLens.length,
    min: explLens[0] || 0,
    p50: explLens[Math.floor(explLens.length * 0.5)] || 0,
    p90: explLens[Math.floor(explLens.length * 0.9)] || 0,
    max: explLens[explLens.length - 1] || 0,
    templateLikeSectionHits: templateLike,
    templatePatternA: templateA,
    templatePatternB: templateB
  },
  termResolver: {
    canonEntryMarkers: canonMatches.length,
    aliasApprox: aliasCount,
    definitionJaMarkers: defJaMatches,
    definitionZhMarkers: defZhMatches,
    sampleResolve: sampleUnitTerms
  },
  runtimeProbe: {
    sampleUnitId: chapters[0].units[0].id,
    loaderReturnsUnit: !!sampleLoaded,
    sampleTitleZh: sampleLoaded && sampleLoaded.titleZh,
    sampleOverviewZhLen: sampleLoaded ? String(sampleLoaded.overviewZh || '').length : 0,
    sampleSection0HasExplanationZh: !!(sampleLoaded && sampleLoaded.sections && sampleLoaded.sections[0] && sampleLoaded.sections[0].explanationZh),
    chapterListModelKeys
  },
  samples: {
    mixedExpl: stats.sampleMixedExpl,
    zhExpl: stats.sampleZhExpl
  }
};

console.log(JSON.stringify(report, null, 2));
