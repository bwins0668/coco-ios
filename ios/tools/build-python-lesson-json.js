#!/usr/bin/env node
// 抽取 python 课程每个章节/小节的真实学习内容（合并 python-course + foundations-b）
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

const sources = [
    ['python-course/data', 'chapter-*.js'],
    ['python-course-foundations-b/data', 'chapter-*.js'],
    ['python-course/data', 'lesson-*.js'],
    ['python-course-foundations-b/data', 'lesson-*.js']
];
const detail = {};

function processFile(filePath) {
    const data = loadInVM(filePath);
    if (!data) return;
    // chapter-js 用 chapter.chapterId (snake), lesson-js 用顶级 id
    const chapterMeta = data.chapter || {};
    const chapterId = data.chapterId || chapterMeta.id || data.id;
    if (!chapterId) { console.warn(`[python-lesson] no chapterId in ${path.basename(filePath)}`); return; }
    // 收集 units；如果顶层是 unit 直接用 chapterId 作为 unitId
    let units = data.units;
    if (!units) {
        if (data.sections || data.keyTerms || data.learningExperience) {
            units = [{ id: chapterId + '-unit', titleZh: chapterMeta.titleZh || data.titleZh, titleJa: chapterMeta.titleJa || data.titleJa, sections: data.sections, keyTerms: data.keyTerms, learningExperience: data.learningExperience, overviewZh: data.overviewZh, overviewJa: data.overviewJa, learningGoalZh: data.learningGoalZh, learningGoalJa: data.learningGoalJa }];
        } else return;
    }
    if (!detail[chapterId]) {
        detail[chapterId] = {
            chapterId, chapterTitleZh: chapterMeta.titleZh || data.titleZh || '',
            chapterTitleJa: chapterMeta.titleJa || data.titleJa || '', units: {}
        };
    }
    if (!Array.isArray(units) || units.length === 0) return;
    for (const u of units) {
        if (!u || !u.id) continue;
        detail[chapterId].units[u.id] = {
            id: u.id, titleZh: u.titleZh || '', titleJa: u.titleJa || '',
            overviewZh: u.overviewZh || '', overviewJa: u.overviewJa || '',
            learningGoalZh: u.learningGoalZh || '', learningGoalJa: u.learningGoalJa || '',
            sections: (u.sections || []).map(s => ({
                headingZh: s.headingZh || '', headingJa: s.headingJa || '',
                explanationZh: s.explanationZh || '', explanationJa: s.explanationJa || ''
            })),
            keyTerms: (u.keyTerms || []).map(t => ({
                termJa: t.termJa || t.term || '', termZh: t.termZh || '',
                english: t.english || '', definitionZh: t.definitionZh || '',
                definitionJa: t.definitionJa || '', examCueZh: t.examCueZh || ''
            })),
            caseBreakdown: (u.learningExperience?.caseBreakdown || []).map(c => ({
                labelZh: c.labelZh || '', bodyZh: c.bodyZh || ''
            }))
        };
    }
    console.log(`[python-lesson] ${chapterId}: +${units.length} units (${path.basename(filePath)})`);
}

for (const [subdir, glob] of sources) {
    const DIR = path.join(PILOT, subdir);
    if (!fs.existsSync(DIR)) { console.warn(`[python-lesson] missing dir ${DIR}`); continue; }
    const prefix = glob.replace('*', '');
    const files = fs.readdirSync(DIR).filter(f => f.startsWith(prefix) && f.endsWith('.js')).sort();
    for (const f of files) {
        processFile(path.join(DIR, f));
    }
}

const out = {
    generatedAt: new Date().toISOString(),
    totalChapters: Object.keys(detail).length,
    totalUnits: Object.values(detail).reduce((s, ch) => s + Object.keys(ch.units).length, 0),
    detail
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 0), 'utf-8');
console.log(`[python-lesson] wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB, ${out.totalUnits} units)`);
