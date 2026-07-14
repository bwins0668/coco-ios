#!/usr/bin/env node
// 抽取 python 课程每个章节/小节的真实学习内容
// python schema: chapter.chapterId / chapter.title.{zh,ja} / data.lessons[]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const PILOT = path.join(ROOT, 'source/miniprogram-pilot/packages');
const OUT_DIR = path.join(ROOT, 'ios/CoCoiOS/Resources/CourseData');
const OUT = path.join(OUT_DIR, 'python-lesson-detail.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function loadInVM(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sandbox = { module: { exports: {} }, exports: {}, console, require };
    sandbox.module.exports = sandbox.exports;
    sandbox.global = sandbox;
    vm.createContext(sandbox);
    try { vm.runInContext(code, sandbox, { filename: filePath }); }
    catch (e) { console.error(`[python-lesson] vm error in ${filePath}: ${e.message}`); return null; }
    let result = sandbox.module.exports;
    if (typeof result === 'function') result = result();
    return result;
}

// lesson/case 归一化（与 sg/itpass LessonUnit 同 schema）
function normalizeLesson(raw) {
    return {
        id: raw.id || raw.lessonId || '',
        titleZh: raw.title?.zh || raw.titleZh || '',
        titleJa: raw.title?.ja || raw.titleJa || '',
        overviewZh: raw.overview?.zh || raw.overviewZh || raw.objectives?.[0]?.zh || '',
        overviewJa: raw.overview?.ja || raw.overviewJa || raw.objectives?.[0]?.ja || '',
        learningGoalZh: raw.learningGoal?.zh || raw.learningGoalZh || raw.handson?.zh || '',
        learningGoalJa: raw.learningGoal?.ja || raw.learningGoalJa || raw.handson?.ja || '',
        sections: (raw.blocks || raw.sections || []).map(s => ({
            headingZh: s.title?.zh || s.heading?.zh || s.headingZh || '',
            headingJa: s.title?.ja || s.heading?.ja || s.headingJa || '',
            explanationZh: s.zh || s.explanation?.zh || s.explanationZh || '',
            explanationJa: s.ja || s.explanation?.ja || s.explanationJa || ''
        })),
        keyTerms: (raw.terms || raw.keyTerms || []).map(t => ({
            termJa: t.ja || t.termJa || t.term || '',
            termZh: t.zh || t.termZh || '',
            english: t.en || t.english || '',
            definitionZh: t.explanationZh || t.definition?.zh || t.definitionZh || '',
            definitionJa: t.explanationJa || t.definition?.ja || t.definitionJa || '',
            examCueZh: t.examCue?.zh || t.examCueZh || ''
        })),
        caseBreakdown: [
            ...(raw.analogy?.zh ? [{ labelZh: '生活化类比', bodyZh: raw.analogy.zh }] : []),
            ...(raw.summary?.zh ? [{ labelZh: '本节小结', bodyZh: raw.summary.zh }] : []),
            ...((raw.caseBreakdown || raw.learningExperience?.caseBreakdown || []).map(c => ({
                labelZh: c.label?.zh || c.labelZh || '',
                bodyZh: c.body?.zh || c.bodyZh || ''
            })))
        ]
    };
}

const sources = [
    'python-course/data/chapters',
    'python-course-foundations-b/data/chapters'
];
const detail = {};

for (const subdir of sources) {
    const DIR = path.join(PILOT, subdir);
    if (!fs.existsSync(DIR)) { console.warn(`[python-lesson] missing dir ${DIR}`); continue; }
    const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort();
    for (const f of files) {
        const data = loadInVM(path.join(DIR, f));
        if (!data) continue;
        const ch = data.chapter || {};
        const chapterId = ch.chapterId || data.chapterId;
        if (!chapterId) continue;
        const lessons = data.lessons || data.units || [];
        if (lessons.length === 0) continue;
        if (!detail[chapterId]) {
            detail[chapterId] = {
                chapterId,
                chapterTitleZh: ch.title?.zh || ch.titleZh || '',
                chapterTitleJa: ch.title?.ja || ch.titleJa || '',
                units: {}
            };
        }
        for (const raw of lessons) {
            const u = normalizeLesson(raw);
            if (!u.id) continue;
            detail[chapterId].units[u.id] = u;
        }
        console.log(`[python-lesson] ${chapterId}: +${lessons.length} lessons (${subdir})`);
    }
}

const out = {
    generatedAt: new Date().toISOString(),
    totalChapters: Object.keys(detail).length,
    totalUnits: Object.values(detail).reduce((s, ch) => s + Object.keys(ch.units).length, 0),
    detail
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 0), 'utf-8');
console.log(`[python-lesson] wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB, ${out.totalUnits} units, ${out.totalChapters} chapters)`);
