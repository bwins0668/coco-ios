#!/usr/bin/env node
// 将小程序当前 SQL 已开放课节转换为 iOS 通用 LessonUnit schema。
// 来源：source/miniprogram-pilot/packages/sql-course/data/chapters/sql-ch*.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'source/miniprogram-pilot/packages/sql-course/data/chapters');
const OUT_DIR = path.join(ROOT, 'ios/CoCoiOS/Resources/CourseData');
const OUT = path.join(OUT_DIR, 'sql-lesson-detail.json');

fs.mkdirSync(OUT_DIR, { recursive: true });

function loadModule(filePath) {
  const sandbox = { module: { exports: {} }, exports: {}, console };
  sandbox.exports = sandbox.module.exports;
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), sandbox, { filename: filePath });
  return sandbox.module.exports;
}

const detail = {};
const files = fs.existsSync(SRC)
  ? fs.readdirSync(SRC).filter(name => /^sql-ch\d+\.js$/.test(name)).sort()
  : [];

for (const file of files) {
  const data = loadModule(path.join(SRC, file));
  const chapter = data.chapter || {};
  const chapterId = chapter.chapterId;
  if (!chapterId) continue;

  const lessonsById = new Map((data.lessons || []).map(lesson => [lesson.lessonId || lesson.id, lesson]));
  const units = {};
  for (const section of chapter.sections || []) {
    const lesson = lessonsById.get(section.lessonId) || {};
    const blocks = lesson.blocks || [];
    units[section.sectionId] = {
      id: section.sectionId,
      titleZh: section.title?.zh || lesson.title?.zh || '',
      titleJa: section.title?.ja || lesson.title?.ja || '',
      overviewZh: lesson.objectives?.[0]?.zh || '',
      overviewJa: lesson.objectives?.[0]?.ja || '',
      learningGoalZh: lesson.playground?.taskZh || '',
      learningGoalJa: lesson.playground?.taskJa || '',
      sections: blocks.map(block => ({
        headingZh: block.title?.zh || '核心概念',
        headingJa: block.title?.ja || '',
        explanationZh: block.zh || '',
        explanationJa: block.ja || ''
      })),
      keyTerms: (lesson.terms || []).map(term => ({
        termZh: term.zh || '',
        termJa: term.ja || '',
        english: term.en || '',
        definitionZh: term.desc || '',
        definitionJa: '',
        examCueZh: ''
      })),
      caseBreakdown: [
        ...(lesson.analogy?.zh ? [{ labelZh: '生活化类比', bodyZh: lesson.analogy.zh }] : []),
        ...(lesson.summary?.zh ? [{ labelZh: '本节小结', bodyZh: lesson.summary.zh }] : [])
      ]
    };
  }
  detail[chapterId] = {
    chapterId,
    chapterTitleZh: chapter.title?.zh || '',
    chapterTitleJa: chapter.title?.ja || '',
    units
  };
}

const out = {
  generatedAt: new Date().toISOString(),
  totalChapters: Object.keys(detail).length,
  totalUnits: Object.values(detail).reduce((sum, chapter) => sum + Object.keys(chapter.units).length, 0),
  detail
};
fs.writeFileSync(OUT, JSON.stringify(out), 'utf8');
console.log(`[sql-lesson] wrote ${OUT} (${out.totalChapters} chapters / ${out.totalUnits} units)`);
