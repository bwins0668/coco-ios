const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const EXPECTED = [
  "python-0007-gs1-run-visible-output",
  "python-0008-gs2-values-and-variables",
  "python-0009-7d37969c-第-3-章-列表简介",
  "python-0010-921b265b-第-4-章-操作列表",
  "python-0011-5c80c609-第-5-章-if语句",
  "python-0012-5cc0ecc6-第-6-章-字典",
  "python-0013-3f4a9a6a-第-7-章-用户输入和while循环",
  "python-0014-75c7d812-第-8-章-函数",
  "python-0015-0f96233e-第-9-章-类"
];

const EXPECTED_SHARD = EXPECTED.slice(6);

function requireFresh(root, rel) {
  delete require.cache[require.resolve(path.join(root, rel))];
  return require(path.join(root, rel));
}

function fail(errors, msg) { errors.push(msg); }

function readManifestIds(root, manifestRel) {
  const mod = requireFresh(root, manifestRel);
  const m = mod.manifest || mod;
  const ids = [];
  (m.chapters || []).forEach(function(ch) {
    (ch.sections || []).forEach(function(sec) {
      if (sec.lessonId) ids.push(sec.lessonId);
    });
  });
  return ids;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) { if (a[i] !== b[i]) return false; }
  return true;
}

function checkDedup(ids, label, errors) {
  var seen = {};
  ids.forEach(function(id) {
    if (seen[id]) fail(errors, label + " duplicate: " + id);
    seen[id] = true;
  });
}

function main() {
  var root = ROOT;
  var errors = [];

  var legacyIds = readManifestIds(root, "packages/python-course/data/python-course-manifest.js");
  var shardIds = readManifestIds(root, "packages/python-course-foundations-b/data/python-foundations-b-manifest.js");

  var sumMod = requireFresh(root, "utils/python-public-course-summary.js");
  var projectionIds = Array.isArray(sumMod.visibleLessonIds) ? sumMod.visibleLessonIds.slice() : [];

  var ledgerMod = requireFresh(root, "tools/python-full-course-release-ledger.js");
  var ledger = ledgerMod.buildPythonFullCourseReleaseLedger();
  var entries = ledger.entries || [];
  var ledgerIds = entries
    .filter(function(e) { return e.status === "published"; })
    .sort(function(a, b) { return a.sourceOrder - b.sourceOrder; })
    .map(function(e) { return e.courseLessonId; });

  console.log("[Python published truth] Checking four-source consistency...");

  if (legacyIds.length !== 9) fail(errors, "legacy manifest: " + legacyIds.length + " IDs, expected 9");
  if (!arraysEqual(legacyIds, EXPECTED)) fail(errors, "legacy manifest order mismatch");
  checkDedup(legacyIds, "legacy manifest", errors);

  if (shardIds.length !== 3) fail(errors, "shard manifest: " + shardIds.length + " IDs, expected 3");
  if (!arraysEqual(shardIds, EXPECTED_SHARD)) fail(errors, "shard manifest order mismatch");
  checkDedup(shardIds, "shard manifest", errors);

  if (projectionIds.length !== 9) fail(errors, "public projection: " + projectionIds.length + " IDs, expected 9");
  if (!arraysEqual(projectionIds, EXPECTED)) fail(errors, "public projection order mismatch");
  checkDedup(projectionIds, "public projection", errors);

  if (ledgerIds.length !== 9) fail(errors, "release ledger: " + ledgerIds.length + " published, expected 9");
  if (!arraysEqual(ledgerIds, EXPECTED)) fail(errors, "release ledger order mismatch");
  checkDedup(ledgerIds, "release ledger", errors);

  // Cross-check includes
  var unexpectedLegacy = legacyIds.filter(function(id) { return EXPECTED.indexOf(id) === -1; });
  var missingLegacy = EXPECTED.filter(function(id) { return legacyIds.indexOf(id) === -1; });
  unexpectedLegacy.forEach(function(id) { fail(errors, "legacy manifest unexpected: " + id); });
  missingLegacy.forEach(function(id) { fail(errors, "legacy manifest missing: " + id); });

  var unexpectedProj = projectionIds.filter(function(id) { return EXPECTED.indexOf(id) === -1; });
  var missingProj = EXPECTED.filter(function(id) { return projectionIds.indexOf(id) === -1; });
  unexpectedProj.forEach(function(id) { fail(errors, "public projection unexpected: " + id); });
  missingProj.forEach(function(id) { fail(errors, "public projection missing: " + id); });

  var unexpectedLedger = ledgerIds.filter(function(id) { return EXPECTED.indexOf(id) === -1; });
  var missingLedger = EXPECTED.filter(function(id) { return ledgerIds.indexOf(id) === -1; });
  unexpectedLedger.forEach(function(id) { fail(errors, "release ledger unexpected: " + id); });
  missingLedger.forEach(function(id) { fail(errors, "release ledger missing: " + id); });

  var unexpectedShard = shardIds.filter(function(id) { return EXPECTED_SHARD.indexOf(id) === -1; });
  var missingShard = EXPECTED_SHARD.filter(function(id) { return shardIds.indexOf(id) === -1; });
  unexpectedShard.forEach(function(id) { fail(errors, "shard manifest unexpected: " + id); });
  missingShard.forEach(function(id) { fail(errors, "shard manifest missing: " + id); });

  // Verify no deferred lesson leaked in
  var deferredIds = entries.filter(function(e) { return e.status === "deferred_asset_required"; }).map(function(e) { return e.courseLessonId; });
  deferredIds.forEach(function(id) {
    if (EXPECTED.indexOf(id) !== -1) fail(errors, "deferred_asset_required leaked into published: " + id);
  });

  if (errors.length) {
    console.error("[Python published truth] FAIL");
    errors.forEach(function(e) { console.error("ERROR: " + e); });
    process.exit(1);
  }
  console.log("[Python published truth] PASS: 0 errors, 0 warnings");
  console.log("  Verified 9 published lessons across 4 sources");
}

main();