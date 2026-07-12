// Generated chunk loader. Each loader requires only one detail chunk.
var glossaryIndex = require('./glossary_index').glossaryIndex;

var CHUNK_SIZE = 50;
var CHUNK_LOADERS = {
  '000': function () { return require('./chunks/glossary_chunk_000').glossaryChunk; },
  '001': function () { return require('./chunks/glossary_chunk_001').glossaryChunk; },
  '002': function () { return require('./chunks/glossary_chunk_002').glossaryChunk; },
  '003': function () { return require('./chunks/glossary_chunk_003').glossaryChunk; },
  '004': function () { return require('./chunks/glossary_chunk_004').glossaryChunk; },
  '005': function () { return require('./chunks/glossary_chunk_005').glossaryChunk; },
  '006': function () { return require('./chunks/glossary_chunk_006').glossaryChunk; },
  '007': function () { return require('./chunks/glossary_chunk_007').glossaryChunk; },
  '008': function () { return require('./chunks/glossary_chunk_008').glossaryChunk; },
  '009': function () { return require('./chunks/glossary_chunk_009').glossaryChunk; },
  '010': function () { return require('./chunks/glossary_chunk_010').glossaryChunk; },
  '011': function () { return require('./chunks/glossary_chunk_011').glossaryChunk; },
  '012': function () { return require('./chunks/glossary_chunk_012').glossaryChunk; },
  '013': function () { return require('./chunks/glossary_chunk_013').glossaryChunk; },
  '014': function () { return require('./chunks/glossary_chunk_014').glossaryChunk; },
  '015': function () { return require('./chunks/glossary_chunk_015').glossaryChunk; },
  '016': function () { return require('./chunks/glossary_chunk_016').glossaryChunk; },
  '017': function () { return require('./chunks/glossary_chunk_017').glossaryChunk; },
  '018': function () { return require('./chunks/glossary_chunk_018').glossaryChunk; },
  '019': function () { return require('./chunks/glossary_chunk_019').glossaryChunk; },
  '020': function () { return require('./chunks/glossary_chunk_020').glossaryChunk; },
  '021': function () { return require('./chunks/glossary_chunk_021').glossaryChunk; },
  '022': function () { return require('./chunks/glossary_chunk_022').glossaryChunk; },
  '023': function () { return require('./chunks/glossary_chunk_023').glossaryChunk; },
  '024': function () { return require('./chunks/glossary_chunk_024').glossaryChunk; },
  '025': function () { return require('./chunks/glossary_chunk_025').glossaryChunk; },
  '026': function () { return require('./chunks/glossary_chunk_026').glossaryChunk; },
  '027': function () { return require('./chunks/glossary_chunk_027').glossaryChunk; },
  '028': function () { return require('./chunks/glossary_chunk_028').glossaryChunk; },
  '029': function () { return require('./chunks/glossary_chunk_029').glossaryChunk; }
};

var chunkCache = {};

function getChunkIdByTermId(id) {
  if (id === undefined || id === null || id === '') return null;
  var targetId = String(id);
  for (var i = 0; i < glossaryIndex.length; i++) {
    if (String(glossaryIndex[i].id) === targetId) {
      return ('00' + Math.floor(i / CHUNK_SIZE)).slice(-3);
    }
  }
  return null;
}

function loadChunk(chunkId) {
  if (!chunkId || !CHUNK_LOADERS[chunkId]) return null;
  if (!chunkCache[chunkId]) {
    chunkCache[chunkId] = CHUNK_LOADERS[chunkId]();
  }
  return chunkCache[chunkId];
}

function getTermById(id) {
  var chunkId = getChunkIdByTermId(id);
  var chunk = loadChunk(chunkId);
  if (!Array.isArray(chunk)) return null;
  var targetId = String(id);
  for (var i = 0; i < chunk.length; i++) {
    if (String(chunk[i].id) === targetId) return chunk[i];
  }
  return null;
}

function getTermsByIds(ids) {
  if (!Array.isArray(ids)) return [];
  var results = [];
  var seen = {};
  for (var i = 0; i < ids.length; i++) {
    var rawId = ids[i];
    if (rawId === undefined || rawId === null || rawId === '') continue;
    var id = String(rawId);
    if (seen[id]) continue;
    seen[id] = true;
    var term = getTermById(id);
    if (term) results.push(term);
  }
  return results;
}

module.exports = {
  getTermById: getTermById,
  getTermsByIds: getTermsByIds,
  getChunkIdByTermId: getChunkIdByTermId
};
