#!/usr/bin/env node
// 合并 glossary chunks 到单一 Bundle JSON
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SRC = path.join(ROOT, 'source/miniprogram-pilot/packages/glossary/data/chunks');
const OUT_DIR = path.join(ROOT, 'ios/CoCoiOS/Resources/GlossaryData');
const OUT = path.join(OUT_DIR, 'glossary.json');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => f.startsWith('glossary_chunk_') && f.endsWith('.js')).sort();
console.log(`[glossary] found ${files.length} chunk files`);

let all = [];
for (const f of files) {
    const content = fs.readFileSync(path.join(SRC, f), 'utf-8');
    // 提取 [...]; 部分
    const m = content.match(/glossaryChunk\s*=\s*(\[[\s\S]*?\]);/);
    if (!m) {
        console.warn(`[glossary] no chunk in ${f}`);
        continue;
    }
    let arr;
    try {
        arr = JSON.parse(m[1]);
    } catch (e) {
        console.error(`[glossary] parse failed in ${f}: ${e.message}`);
        process.exit(1);
    }
    console.log(`[glossary]  +${arr.length} from ${f}`);
    all = all.concat(arr);
}

console.log(`[glossary] total: ${all.length} terms`);

// 简化字段映射到 iOS Bundle
const simplified = all.map(t => ({
    id: t.id,
    term: t.term,
    zh: t.zh,
    ja: t.ja,
    en: t.term,                    // term 通常就是英文
    category: t.category || '',
    level: t.level || 'basic',
    tags: t.tags || [],
    explanationZh: t.explanationZh || '',
    explanationJa: t.explanationJa || '',
    example: t.example || ''
}));

const output = {
    generatedAt: new Date().toISOString(),
    total: simplified.length,
    categories: [...new Set(simplified.map(t => t.category))].sort(),
    terms: simplified
};

fs.writeFileSync(OUT, JSON.stringify(output, null, 0), 'utf-8');
console.log(`[glossary] wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`);