'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function walk(dir, acc) {
  acc = acc || [];
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'artifacts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

const files = walk(ROOT).filter((f) => /\.(js|wxml|wxss|json)$/i.test(f));
const refText = files.map((f) => {
  try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; }
}).join('\n');

const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
const registered = new Set();
(app.pages || []).forEach((p) => registered.add(p));
(app.subpackages || []).forEach((sp) => {
  (sp.pages || []).forEach((p) => registered.add(sp.root + '/' + p));
});

const deadish = [];
for (const f of files) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  if (rel.startsWith('tools/')) continue;
  if (rel === 'app.js' || rel === 'app.json' || rel === 'app.wxss') continue;
  if (rel.startsWith('custom-tab-bar/')) continue;
  if (/\/pages\//.test(rel)) continue; // page files are entry surfaces
  if (/(^|\/)(loader|manifest|index|sources|term-resolver)\.js$/.test(rel)) continue;
  if (/chapter-\d+\.js$|questions(_zh)?\.js$|explanations_zh\.js$|glossary_chunk_/.test(rel)) continue;

  const noext = rel.replace(/\.(js|json|wxml|wxss)$/i, '');
  const escaped = noext.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(escaped, 'g');
  const hits = (refText.match(re) || []).length;
  const size = fs.statSync(f).size;
  if (hits <= 1 && size >= 1024) {
    deadish.push({ rel, sizeKB: +(size / 1024).toFixed(1), hits });
  }
}
deadish.sort((a, b) => b.sizeKB - a.sizeKB);

console.log(JSON.stringify({
  scannedFiles: files.length,
  registeredPages: registered.size,
  deadishCandidates: deadish.slice(0, 40)
}, null, 2));
