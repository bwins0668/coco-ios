#!/usr/bin/env node
// 抽取 sg 课程每个小节的真实学习内容（用 vm 沙箱 + require）
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'source/miniprogram-pilot/packages/course-sg/data');
const OUT_DIR = path.join(ROOT, 'ios/CoCoiOS/Resources/CourseData');
const OUT = path.join(OUT_DIR, 'sg-lesson-detail.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function loadInVM(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const sandbox = { module: { exports: {} }, exports: {}, console, require };
    sandbox.module.exports = sandbox.exports;
    sandbox.global = sandbox;
    vm.createContext(sandbox);
    try {
        vm.runInContext(code, sandbox, { filename: filePath });
    } catch (e) {
        console.error(`[sg-lesson] ${filePath}: vm error ${e.message}`);
        return null;
    }
    let result = sandbox.module.exports;
    if (typeof result === 'function') result = result();
    return result;
}

const chapterFiles = fs.readdirSync(SRC).filter(f => f.startsWith('chapter-') && f.endsWith('.js')).sort();
console.log(`[sg-lesson] found ${chapterFiles.length} chapter files`);

const detail = {};

for (const f of chapterFiles) {
    const fullPath = path.join(SRC, f);
    let data;
    try {
        data = loadInVM(fullPath);
    } catch (e) {
        console.error(`[sg-lesson] ${f} vm error: ${e.message}`);
        continue;
    }
    const chapterMeta = data.chapter || {};
    const units = data.units || [];
    if (units.length === 0) continue;
    const chapterId = chapterMeta.id || data.id;
    detail[chapterId] = {
        chapterId,
        chapterTitleZh: chapterMeta.titleZh || '',
        chapterTitleJa: chapterMeta.titleJa || '',
        units: {}
    };
    for (const u of units) {
        detail[chapterId].units[u.id] = {
            id: u.id,
            titleZh: u.titleZh || '',
            titleJa: u.titleJa || '',
            overviewZh: u.overviewZh || '',
            overviewJa: u.overviewJa || '',
            learningGoalZh: u.learningGoalZh || '',
            learningGoalJa: u.learningGoalJa || '',
            sections: (u.sections || []).map(s => ({
                headingZh: s.headingZh || '',
                headingJa: s.headingJa || '',
                explanationZh: s.explanationZh || '',
                explanationJa: s.explanationJa || ''
            })),
            keyTerms: (u.keyTerms || []).map(t => ({
                termJa: t.termJa || t.term || '',
                termZh: t.termZh || '',
                english: t.english || '',
                definitionZh: t.definitionZh || '',
                definitionJa: t.definitionJa || '',
                examCueZh: t.examCueZh || ''
            })),
            caseBreakdown: (u.learningExperience?.caseBreakdown || []).map(c => ({
                labelZh: c.labelZh || '',
                bodyZh: c.bodyZh || ''
            }))
        };
    }
    console.log(`[sg-lesson] ${chapterId}: ${units.length} units`);
}

const out = {
    generatedAt: new Date().toISOString(),
    totalChapters: Object.keys(detail).length,
    totalUnits: Object.values(detail).reduce((s, ch) => s + Object.keys(ch.units).length, 0),
    detail
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 0), 'utf-8');
console.log(`[sg-lesson] wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);