// tools/audit_quiz_duplicates.js
// Audit quiz question data for duplicates across all data sources.

var courseData = require('../packages/quiz/data/course_questions');

function normalizeText(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[Ａ-Ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[ａ-ｚ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .replace(/[０-９]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0); })
    .toLowerCase();
}

function getQuestionDedupeKey(question) {
  var stem = normalizeText(question.questionZh || question.questionJa || question.title || question.term || '');
  var options = normalizeText(
    (question.options || []).map(function (o) { return (o.textZh || o.textJa || o.text || '').trim(); }).join('|')
  );
  var answer = normalizeText(question.answer || question.correctAnswer || question.correctIndex || '');
  return stem + '|' + options + '|' + answer;
}

function dedupeQuestions(questions) {
  var seen = Object.create(null);
  var unique = [];
  var duplicates = [];
  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var key = getQuestionDedupeKey(q);
    if (!key || key === '||') continue;
    if (seen[key]) {
      duplicates.push({ id: q.id, key: key, duplicateOf: seen[key] });
    } else {
      seen[key] = q.id;
      unique.push(q);
    }
  }
  return { unique: unique, duplicates: duplicates };
}

console.log('=== Course Questions Audit ===');
var courseQuestions = courseData.questions || [];
console.log('Total questions:', courseQuestions.length);

var byExam = {};
courseQuestions.forEach(function (q) {
  var e = q.exam || 'unknown';
  var s = q.sourceType || 'unknown';
  var bucket = e + '/' + s;
  if (!byExam[bucket]) byExam[bucket] = [];
  byExam[bucket].push(q);
});

Object.keys(byExam).sort().forEach(function (bucket) {
  var qs = byExam[bucket];
  var result = dedupeQuestions(qs);
  console.log('\n--- ' + bucket + ' (' + qs.length + ' questions) ---');
  console.log('  Unique:', result.unique.length);
  console.log('  Duplicates:', result.duplicates.length);
  if (result.duplicates.length > 0) {
    result.duplicates.forEach(function (d) {
      console.log('    DUP: ' + d.id + ' == ' + d.duplicateOf + ' (key: ' + d.key.substring(0, 80) + '...)');
    });
  }
});

var overallResult = dedupeQuestions(courseQuestions);
console.log('\n--- Overall Course ---');
console.log('  Total:', courseQuestions.length);
console.log('  Unique:', overallResult.unique.length);
console.log('  Duplicates:', overallResult.duplicates.length);

var sgQuestions = courseQuestions.filter(function (q) { return q.exam === 'sg'; });
var sgResult = dedupeQuestions(sgQuestions);
console.log('\n--- SG Overall ---');
console.log('  Total:', sgQuestions.length);
console.log('  Unique:', sgResult.unique.length);
console.log('  Duplicates:', sgResult.duplicates.length);
