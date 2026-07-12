// Python learner-visible lesson content normalizer (F2)
//
// Historical baselines by commit:
//   GS1, GS2: 196a0acbab39b2ec0cb80226989563e3632f3347
//   Domain1A:  d73db8ba4e8c4ce8b0ccd4884fe45bf9cb7170a0
//   Domain1B:  c390b10e9e5f7fd819ed80fac943b07ed1c6fa99
//   Train1:    18d0c29aff5da2407189123928640d7a72f0ac1d
//
// Hash scope: learner-visible renderer-consumed fields only.
// Excludes: app.json, shard placement, loader, route registration,
//           internal source mapping, non-rendered metadata.

var crypto = require("crypto");

// Pre-sorted key arrays for deterministic JSON output
var BLOCK_KEYS = ["ja", "type", "zh"];
var TERM_KEYS = ["en", "ja", "zh"];
var EXAMPLE_KEYS = ["code", "exampleId", "expectedOutput", "lineNotes", "sampleInput"];
var LINE_NOTE_KEYS = ["ja", "line", "zh"];
var MISTAKE_KEYS = ["ja", "zh"];
var HANDSON_KEYS = ["action", "expectedObservation"];
var TOP_KEYS = [
  "blocks", "codeExamples", "commonMistakes", "handson",
  "lessonId", "nextLessonBridge", "objectives", "order",
  "prerequisites", "summary", "terms", "title"
];

function normalizeLessonHash(lesson) {
  if (!lesson) return "";
  var norm = {};

  for (var i = 0; i < TOP_KEYS.length; i++) {
    var key = TOP_KEYS[i];
    if (!(key in lesson)) continue;

    if (key === "blocks") {
      norm[key] = (lesson[key] || []).map(function(b) {
        var nb = {};
        BLOCK_KEYS.forEach(function(k) { if (b[k] !== undefined) nb[k] = b[k]; });
        return nb;
      });
    } else if (key === "terms") {
      norm[key] = (lesson[key] || []).map(function(t) {
        var nt = {};
        TERM_KEYS.forEach(function(k) { if (t[k] !== undefined) nt[k] = t[k]; });
        return nt;
      });
    } else if (key === "codeExamples") {
      norm[key] = (lesson[key] || []).map(function(ex) {
        var ne = {};
        EXAMPLE_KEYS.forEach(function(ek) {
          if (ex[ek] !== undefined) {
            if (ek === "lineNotes") {
              ne[ek] = (ex[ek] || []).map(function(ln) {
                var nl = {};
                LINE_NOTE_KEYS.forEach(function(lk) { if (ln[lk] !== undefined) nl[lk] = ln[lk]; });
                return nl;
              });
            } else {
              ne[ek] = ex[ek];
            }
          }
        });
        return ne;
      });
    } else if (key === "commonMistakes") {
      norm[key] = (lesson[key] || []).map(function(cm) {
        var nc = {};
        MISTAKE_KEYS.forEach(function(k) { if (cm[k] !== undefined) nc[k] = cm[k]; });
        return nc;
      });
    } else if (key === "handson") {
      var hs = lesson[key];
      if (hs) {
        var nh = {};
        HANDSON_KEYS.forEach(function(hk) {
          if (hs[hk]) nh[hk] = { ja: hs[hk].ja, zh: hs[hk].zh };
        });
        norm[key] = nh;
      }
    } else {
      norm[key] = lesson[key];
    }
  }

  return crypto.createHash("sha256").update(JSON.stringify(norm)).digest("hex").toUpperCase();
}

module.exports = { normalizeLessonHash: normalizeLessonHash };