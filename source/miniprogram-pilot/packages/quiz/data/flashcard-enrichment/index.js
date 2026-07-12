// packages/quiz/data/flashcard-enrichment/index.js
// Enrichment data index: maps card IDs to enrichment chunks.
// Loaded lazily when flashcard deck is accessed.

var ENRICHMENT_CHUNKS = {
  itpass: {},
  sg: {}
};

// Chunk registry: each chunk contains enrichment for a batch of cards
var CHUNK_REGISTRY = {
  itpass: [],
  sg: []
};

function loadEnrichmentChunk(course, chunkName) {
  if (ENRICHMENT_CHUNKS[course][chunkName]) {
    return ENRICHMENT_CHUNKS[course][chunkName];
  }
  try {
    var chunk = require('./' + course + '/' + chunkName);
    ENRICHMENT_CHUNKS[course][chunkName] = chunk;
    return chunk;
  } catch (e) {
    return null;
  }
}

function getEnrichmentForCard(course, cardId) {
  // Try all loaded chunks
  var chunks = ENRICHMENT_CHUNKS[course];
  var chunkNames = Object.keys(chunks);
  for (var i = 0; i < chunkNames.length; i++) {
    var chunk = chunks[chunkNames[i]];
    if (chunk && chunk[cardId]) {
      return chunk[cardId];
    }
  }
  return null;
}

function loadAllChunksForCourse(course) {
  var registry = CHUNK_REGISTRY[course] || [];
  for (var i = 0; i < registry.length; i++) {
    loadEnrichmentChunk(course, registry[i]);
  }
}

function registerChunk(course, chunkName) {
  if (CHUNK_REGISTRY[course].indexOf(chunkName) < 0) {
    CHUNK_REGISTRY[course].push(chunkName);
  }
}

module.exports = {
  loadEnrichmentChunk: loadEnrichmentChunk,
  getEnrichmentForCard: getEnrichmentForCard,
  loadAllChunksForCourse: loadAllChunksForCourse,
  registerChunk: registerChunk,
  CHUNK_REGISTRY: CHUNK_REGISTRY
};
