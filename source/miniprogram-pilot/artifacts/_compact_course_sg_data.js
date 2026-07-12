'use strict';
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'packages', 'course-sg', 'data');

let before = 0;
let after = 0;
const rows = [];

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
  const abs = path.join(dir, f);
  const raw = fs.readFileSync(abs, 'utf8');
  before += Buffer.byteLength(raw);

  // Keep non-data modules (loader/term-resolver/sources) intact if they are code, not pure data dumps
  if (f === 'loader.js' || f === 'term-resolver.js' || f === 'sources.js') {
    after += Buffer.byteLength(raw);
    rows.push({ f, action: 'keep-code', before: raw.length, after: raw.length });
    continue;
  }

  try {
    const resolved = require.resolve(abs);
    delete require.cache[resolved];
    const mod = require(abs);
    const compact = 'module.exports=' + JSON.stringify(mod) + ';\n';
    fs.writeFileSync(abs, compact, 'utf8');
    after += Buffer.byteLength(compact);
    rows.push({
      f,
      action: 'compact',
      beforeKB: +(raw.length / 1024).toFixed(1),
      afterKB: +(compact.length / 1024).toFixed(1),
      savedKB: +((raw.length - compact.length) / 1024).toFixed(1)
    });
  } catch (e) {
    after += Buffer.byteLength(raw);
    rows.push({ f, action: 'error', error: e.message });
  }
}

console.log(JSON.stringify({
  beforeMB: +(before / 1024 / 1024).toFixed(3),
  afterMB: +(after / 1024 / 1024).toFixed(3),
  savedMB: +((before - after) / 1024 / 1024).toFixed(3),
  rows
}, null, 2));
