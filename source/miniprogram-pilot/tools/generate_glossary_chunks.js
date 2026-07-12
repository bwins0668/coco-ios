const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_SOURCE_PATH = path.join(ROOT, 'packages/glossary/data/glossary.js');
const BACKUP_SOURCE_PATH = path.join(ROOT, 'tools/generated-backup/glossary_full_v0112.js');
const DATA_DIR = path.join(ROOT, 'packages/glossary/data');
const CHUNKS_DIR = path.join(DATA_DIR, 'chunks');
const CHUNK_SIZE = 50;

function loadGlossarySource() {
  if (fs.existsSync(PACKAGE_SOURCE_PATH)) {
    const glossaryModule = require(PACKAGE_SOURCE_PATH);
    return glossaryModule.glossaryData || glossaryModule.glossary;
  }
  if (fs.existsSync(BACKUP_SOURCE_PATH)) {
    const glossaryModule = require(BACKUP_SOURCE_PATH);
    return glossaryModule.glossaryData || glossaryModule.glossary;
  }
  if (fs.existsSync(CHUNKS_DIR)) {
    const chunks = fs.readdirSync(CHUNKS_DIR)
      .filter(function (name) { return /^glossary_chunk_\d{3}\.js$/.test(name); })
      .sort();
    let merged = [];
    for (const name of chunks) {
      const chunkModule = require(path.join(CHUNKS_DIR, name));
      merged = merged.concat(chunkModule.glossaryChunk || []);
    }
    return merged;
  }
  return null;
}

const glossary = loadGlossarySource();

if (!Array.isArray(glossary)) {
  throw new Error('Source glossary must export an array');
}

fs.mkdirSync(CHUNKS_DIR, { recursive: true });

for (const name of fs.readdirSync(CHUNKS_DIR)) {
  if (/^glossary_chunk_\d{3}\.js$/.test(name)) {
    fs.unlinkSync(path.join(CHUNKS_DIR, name));
  }
}

const index = glossary.map(function (item) {
  const entry = {
    id: item.id,
    term: item.term,
    zh: item.zh,
    ja: item.ja,
    category: item.category,
    level: item.level
  };
  if (Array.isArray(item.aliases) && item.aliases.length > 0) {
    entry.aliases = item.aliases;
  }
  return entry;
});

const indexContent = [
  '// Generated lightweight glossary index. Do not add detail fields here.',
  'var glossaryIndex = ' + JSON.stringify(index) + ';',
  '',
  'module.exports = {',
  '  glossaryIndex: glossaryIndex',
  '};',
  ''
].join('\n');
fs.writeFileSync(path.join(DATA_DIR, 'glossary_index.js'), indexContent, 'utf8');

const chunkIds = [];
for (let offset = 0; offset < glossary.length; offset += CHUNK_SIZE) {
  const chunkId = String(offset / CHUNK_SIZE).padStart(3, '0');
  const chunk = glossary.slice(offset, offset + CHUNK_SIZE);
  const chunkContent = [
    '// Generated glossary detail chunk ' + chunkId + '.',
    'var glossaryChunk = ' + JSON.stringify(chunk) + ';',
    '',
    'module.exports = {',
    '  glossaryChunk: glossaryChunk',
    '};',
    ''
  ].join('\n');
  fs.writeFileSync(
    path.join(CHUNKS_DIR, 'glossary_chunk_' + chunkId + '.js'),
    chunkContent,
    'utf8'
  );
  chunkIds.push(chunkId);
}

const loaderLines = [
  '// Generated chunk loader. Each loader requires only one detail chunk.',
  "var glossaryIndex = require('./glossary_index').glossaryIndex;",
  '',
  'var CHUNK_SIZE = ' + CHUNK_SIZE + ';',
  'var CHUNK_LOADERS = {'
];

for (let i = 0; i < chunkIds.length; i++) {
  const chunkId = chunkIds[i];
  const suffix = i === chunkIds.length - 1 ? '' : ',';
  loaderLines.push(
    "  '" + chunkId + "': function () { return require('./chunks/glossary_chunk_" +
      chunkId + "').glossaryChunk; }" + suffix
  );
}

loaderLines.push(
  '};',
  '',
  'var chunkCache = {};',
  '',
  'function getChunkIdByTermId(id) {',
  "  if (id === undefined || id === null || id === '') return null;",
  '  var targetId = String(id);',
  '  for (var i = 0; i < glossaryIndex.length; i++) {',
  '    if (String(glossaryIndex[i].id) === targetId) {',
  "      return ('00' + Math.floor(i / CHUNK_SIZE)).slice(-3);",
  '    }',
  '  }',
  '  return null;',
  '}',
  '',
  'function loadChunk(chunkId) {',
  '  if (!chunkId || !CHUNK_LOADERS[chunkId]) return null;',
  '  if (!chunkCache[chunkId]) {',
  '    chunkCache[chunkId] = CHUNK_LOADERS[chunkId]();',
  '  }',
  '  return chunkCache[chunkId];',
  '}',
  '',
  'function getTermById(id) {',
  '  var chunkId = getChunkIdByTermId(id);',
  '  var chunk = loadChunk(chunkId);',
  '  if (!Array.isArray(chunk)) return null;',
  '  var targetId = String(id);',
  '  for (var i = 0; i < chunk.length; i++) {',
  '    if (String(chunk[i].id) === targetId) return chunk[i];',
  '  }',
  '  return null;',
  '}',
  '',
  'function getTermsByIds(ids) {',
  '  if (!Array.isArray(ids)) return [];',
  '  var results = [];',
  '  var seen = {};',
  '  for (var i = 0; i < ids.length; i++) {',
  '    var rawId = ids[i];',
  "    if (rawId === undefined || rawId === null || rawId === '') continue;",
  '    var id = String(rawId);',
  '    if (seen[id]) continue;',
  '    seen[id] = true;',
  '    var term = getTermById(id);',
  '    if (term) results.push(term);',
  '  }',
  '  return results;',
  '}',
  '',
  'module.exports = {',
  '  getTermById: getTermById,',
  '  getTermsByIds: getTermsByIds,',
  '  getChunkIdByTermId: getChunkIdByTermId',
  '};',
  ''
);

fs.writeFileSync(
  path.join(DATA_DIR, 'glossary_loader.js'),
  loaderLines.join('\n'),
  'utf8'
);

console.log('Generated ' + index.length + ' index entries and ' + chunkIds.length + ' chunks.');
