#!/usr/bin/env node
// 抽取 java 课程每个章节/小节的真实学习内容（合并 a/b/c 三套）
// java schema 变体: chapter.chapterId / chapter.title.{ja,zh} / data.lessons[]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const PILOT = path.join(ROOT, 'source/miniprogram-pilot/packages');
const OUT_DIR = path.join(ROOT, 'ios/CoCoiOS/Resources/CourseData');
const OUT = path.join(OUT_DIR, 'java-lesson-detail.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function loadInVM(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sandbox = { module: { exports: {} }, exports: {}, console, require };
    sandbox.module.exports = sandbox.exports;
    sandbox.global = sandbox;
    vm.createContext(sandbox);
    try { vm.runInContext(code, sandbox, { filename: filePath }); }
    catch (e) { console.error(`[java-lesson] vm error in ${filePath}: ${e.message}`); return null; }
    let result = sandbox.module.exports;
    if (typeof result === 'function') result = result();
    return result;
}

function extractLesson(raw) {
    return {
        id: raw.id || raw.lessonId || '',
        titleZh: raw.title?.zh || raw.titleZh || '',
        titleJa: raw.title?.ja || raw.titleJa || '',
        overviewZh: raw.overviewZh || raw.overview?.zh || '',
        overviewJa: raw.overviewJa || raw.overview?.ja || '',
        learningGoalZh: raw.learningGoalZh || raw.learningGoal?.zh || '',
        learningGoalJa: raw.learningGoalJa || raw.learningGoal?.ja || '',
        sections: (raw.sections || []).map(s => ({
            headingZh: s.heading?.zh || s.headingZh || '',
            headingJa: s.heading?.ja || s.headingJa || '',
            explanationZh: s.explanation?.zh || s.explanationZh || '',
            explanationJa: s.explanation?.ja || s.explanationJa || ''
        })),
        keyTerms: (raw.keyTerms || []).map(t => ({
            termJa: t.ja || t.termJa || t.term || '',
            termZh: t.zh || t.termZh || '',
            english: t.english || '',
            definitionZh: t.definition?.zh || t.definitionZh || '',
            definitionJa: t.definition?.ja || t.definitionJa || '',
            examCueZh: t.examCue?.zh || t.examCueZh || ''
        })),
        caseBreakdown: (raw.learningExperience?.caseBreakdown || []).map(c => ({
            labelZh: c.labelZh || c.label?.zh || '',
            bodyZh: c.bodyZh || c.body?.zh || ''
        }))
    };
}

const sources = [
    'java-course-a/data/chapters',
    'java-course-b/data/chapters',
    'java-course-c/data/chapters'
];
const chapterRegex = /-ch\d+\.js$/;
const detail = {};

for (const subdir of sources) {
    const DIR = path.join(PILOT, subdir);
    if (!fs.existsSync(DIR)) { console.warn(`[java-lesson] missing dir ${DIR}`); continue; }
    const files = fs.readdirSync(DIR).filter(f => chapterRegex.test(f)).sort();
    for (const f of files) {
        const data = loadInVM(path.join(DIR, f));
        if (!data) continue;
        const ch = data.chapter || {};
        const chapterId = ch.chapterId || data.chapterId || '';
        if (!chapterId) continue;
        // 收集 lessons（schema 可能是 lessons[] 或 units[]）
        const rawLessons = data.lessons || data.units || [];
        if (rawLessons.length === 0) continue;
        if (!detail[chapterId]) {
            detail[chapterId] = {
                chapterId,
                chapterTitleZh: ch.title?.zh || ch.titleZh || '',
                chapterTitleJa: ch.title?.ja || ch.titleJa || '',
                units: {}
            };
        }
        for (const raw of rawLessons) {
            const u = extractLesson(raw);
            if (!u.id) continue;
            detail[chapterId].units[u.id] = u;
        }
        console.log(`[java-lesson] ${chapterId}: +${rawLessons.length} lessons (${subdir})`);
    }
}

const out = {
    generatedAt: new Date().toISOString(),
    totalChapters: Object.keys(detail).length,
    totalUnits: Object.values(detail).reduce((s, ch) => s + Object.keys(ch.units).length, 0),
    detail
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 0), 'utf-8');
console.log(`[java-lesson] wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB, ${out.totalUnits} units)`);
