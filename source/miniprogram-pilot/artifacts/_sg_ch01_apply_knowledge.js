'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { packs, chapter1TermDefs } = require('./_sg_ch01_knowledge_packs');

const chapterPath = path.join(ROOT, 'packages/course-sg/data/chapter-01.js');
const chapter = require(chapterPath);

const TEMPLATE_RE = /先判断它属于|先判断它是在讲|这样可以把|不是直接问定义|做SG案例题时不会只按词面选择|考试常用.*是判断/;

function stripTemplate(text) {
  return String(text || '');
}

let updated = 0;
for (const unit of chapter.units || []) {
  const pack = packs[unit.id];
  if (!pack) continue;

  if (pack.titleZh) unit.titleZh = pack.titleZh;
  if (pack.overviewZh) unit.overviewZh = pack.overviewZh;
  if (pack.learningGoalZh) unit.learningGoalZh = pack.learningGoalZh;

  if (Array.isArray(pack.sections) && Array.isArray(unit.sections)) {
    for (let i = 0; i < unit.sections.length && i < pack.sections.length; i++) {
      const src = pack.sections[i];
      const dst = unit.sections[i];
      if (src.headingZh) dst.headingZh = src.headingZh;
      if (src.explanationZh) dst.explanationZh = src.explanationZh;
      if (src.examFocusZh) dst.examFocusZh = src.examFocusZh;
      if (src.commonMistakeZh) dst.commonMistakeZh = src.commonMistakeZh;
    }
  }

  if (Array.isArray(pack.commonTraps) && Array.isArray(unit.commonTraps)) {
    for (let i = 0; i < unit.commonTraps.length && i < pack.commonTraps.length; i++) {
      if (pack.commonTraps[i].trapZh) unit.commonTraps[i].trapZh = pack.commonTraps[i].trapZh;
    }
  }

  // Merge LE: preserve any existing rich JA fields when present, overwrite with pack
  unit.learningExperience = Object.assign({}, unit.learningExperience || {}, pack.learningExperience);

  // Ensure quizMapping honesty
  if (!unit.learningExperience.quizMapping) {
    unit.learningExperience.quizMapping = {
      relatedQuestionIds: unit.relatedQuestionIds || [],
      explanationZh: (unit.relatedQuestionIds && unit.relatedQuestionIds.length)
        ? '已关联既有课程题，详见 learningExperience.quizMapping。'
        : '本单元暂无已验证关联题，保持为空。'
    };
  }
  if (!unit.relatedQuestionIds || unit.relatedQuestionIds.length === 0) {
    unit.learningExperience.quizMapping.relatedQuestionIds = [];
  } else {
    unit.learningExperience.quizMapping.relatedQuestionIds = unit.relatedQuestionIds.slice();
  }

  // Enrich keyTerms with definitions for chapter1
  unit.keyTerms = (unit.keyTerms || []).map((term) => {
    const key = term.english || term.en || term.termJa || term.ja || term.termZh || '';
    const def = chapter1TermDefs[key] || chapter1TermDefs[term.termJa] || chapter1TermDefs[term.ja] || null;
    const next = Object.assign({}, term);
    if (def) {
      next.definitionJa = def.definitionJa;
      next.definitionZh = def.definitionZh;
      next.examCueZh = def.examCueZh;
      if (!next.zh || next.zh === next.en || next.zh === next.english) {
        // keep existing zh if meaningful; else leave
      }
    }
    return next;
  });

  unit.knowledgeReconstructionStatus = 'chapter1_textbook_v1';
  updated += 1;
}

const out = 'module.exports = ' + JSON.stringify(chapter, null, 2) + ';\n';
fs.writeFileSync(chapterPath, out, 'utf8');

// Validate no templates remain in ch1 explanationZh
let templateHits = 0;
let leCount = 0;
for (const unit of chapter.units || []) {
  if (unit.learningExperience) leCount += 1;
  for (const s of unit.sections || []) {
    if (TEMPLATE_RE.test(String(s.explanationZh || ''))) templateHits += 1;
    if (TEMPLATE_RE.test(String(unit.overviewZh || ''))) templateHits += 1;
  }
}

console.log(JSON.stringify({
  updatedUnits: updated,
  totalUnits: (chapter.units || []).length,
  learningExperienceCount: leCount,
  remainingTemplateHits: templateHits,
  chapterPath: path.relative(ROOT, chapterPath).replace(/\\/g, '/')
}, null, 2));
