#!/usr/bin/env node
'use strict';
/**
 * Negative-mutation self-test for the courseRegistryHash guard in
 * check_python_domain1a_contract.js (T0 Track B).
 *
 * The guard is: sha256(utils/course-registry.js) === EXPECTED.courseRegistryHash.
 * This test proves the REFRESHED hash still discriminates:
 *   - the current audited registry matches EXPECTED  -> guard PASSES (legal)
 *   - restoring the old 5-ID projection              -> DIFFERS (caught)
 *   - any extra tamper                               -> DIFFERS (caught)
 *   - injecting an unpublished lesson id             -> DIFFERS (caught)
 *   - changing a non-Python (Java) course entry      -> DIFFERS (caught)
 * Real course-registry.js is never modified; mutations are in-memory only.
 */
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var ROOT = path.resolve(__dirname, '..');
var REG = path.join(ROOT, 'utils', 'course-registry.js');
var CHECKER_SRC = fs.readFileSync(path.join(ROOT, 'tools', 'check_python_domain1a_contract.js'), 'utf8');
var EXPECTED = (CHECKER_SRC.match(/courseRegistryHash:\s*'([0-9A-F]+)'/) || [])[1];
var real = fs.readFileSync(REG, 'utf8');
function sha(s) { return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex').toUpperCase(); }

// NB: the real file on disk is committed with CRLF; git/shaFile hashes the raw bytes.
// Read raw bytes for the legal-state comparison to mirror shaFile() exactly.
var realBytesHash = crypto.createHash('sha256').update(fs.readFileSync(REG)).digest('hex').toUpperCase();

var mutations = [
  { caseId: 'legal-current-registry', expect: 'MATCH', hash: realBytesHash },
  { caseId: 'restore-old-5id-projection', expect: 'DIFFER',
    hash: sha(real.replace(/(\s*'python-0012-[^']*',\n\s*'python-0013-[^']*',\n\s*'python-0014-[^']*',\n\s*'python-0015-[^']*')/, '')
      .replace(/'python-0011-5c80c609-第-5-章-if语句',/, "'python-0011-5c80c609-第-5-章-if语句'")) },
  { caseId: 'extra-tamper-comment', expect: 'DIFFER', hash: sha(real + '\n// tamper\n') },
  { caseId: 'inject-unpublished-lesson', expect: 'DIFFER',
    hash: sha(real.replace(/('python-0015-0f96233e-第-9-章-类')/, "$1,\n      'python-9999-unpublished-artifact'")) },
  { caseId: 'change-java-course-entry', expect: 'DIFFER',
    hash: sha(real.replace(/displayName:\s*'Java'/, "displayName: 'Java-TAMPERED'")) }
];

var results = [], allOk = true;
mutations.forEach(function (m) {
  var actual = m.hash === EXPECTED ? 'MATCH' : 'DIFFER';
  var ok = actual === m.expect;
  if (!ok) allOk = false;
  results.push({ caseId: m.caseId, expected: m.expect, actual: actual, guardCorrect: ok });
});

console.log(JSON.stringify({
  selftest: 'check_python_domain1a_registry_guard',
  expectedHashInChecker: EXPECTED,
  guardRetainsTamperDetection: allOk,
  cases: results
}, null, 2));
process.exit(allOk ? 0 : 1);
