// packages/exam/data/schema.js
// ITpass / SG 题库数据协议与校验

var VALID_EXAMS = ['itpass', 'sg'];
var VALID_ANSWERS = ['A', 'B', 'C', 'D'];
var CHOICES_COUNT = 4;

var COMPLIANCE_RISK_WORDS = [
  '保证通过', '包过', '押题', '必过', '100%通过',
  '内部资料', '官方答案', '绝对安全', '永久保存'
];

function validateQuestion(q, index) {
  var errors = [];
  var label = 'question[' + (index !== undefined ? index : '?') + ']';

  if (!q || typeof q !== 'object') {
    return [label + ': not an object'];
  }

  if (typeof q.id !== 'string' || q.id.length === 0) {
    errors.push(label + ': id must be a non-empty string');
  }

  if (VALID_EXAMS.indexOf(q.exam) === -1) {
    errors.push(label + '.exam: must be "itpass" or "sg", got "' + q.exam + '"');
  }

  if (typeof q.source !== 'string' || q.source.length === 0) {
    errors.push(label + '.source: must be a non-empty string');
  }

  if (typeof q.sourceLabel !== 'string' || q.sourceLabel.length === 0) {
    errors.push(label + '.sourceLabel: must be a non-empty string');
  }

  if (typeof q.promptJa !== 'string' || q.promptJa.length === 0) {
    errors.push(label + '.promptJa: must be a non-empty string');
  }

  if (!Array.isArray(q.choicesJa) || q.choicesJa.length !== CHOICES_COUNT) {
    errors.push(label + '.choicesJa: must be an array of ' + CHOICES_COUNT + ' items');
  }

  if (VALID_ANSWERS.indexOf(q.answer) === -1) {
    errors.push(label + '.answer: must be A/B/C/D, got "' + q.answer + '"');
  }

  if (typeof q.explanationZh !== 'string' || q.explanationZh.length === 0) {
    errors.push(label + '.explanationZh: must be a non-empty string');
  }

  if (typeof q.explanationJa !== 'string' || q.explanationJa.length === 0) {
    errors.push(label + '.explanationJa: must be a non-empty string');
  }

  if (typeof q.modifiedFromOriginal !== 'boolean') {
    errors.push(label + '.modifiedFromOriginal: must be a boolean');
  }

  var textToCheck = (q.promptJa || '') + (q.explanationZh || '') + (q.explanationJa || '') + (q.whyWrongZh || '') + (q.whyWrongJa || '');
  for (var i = 0; i < COMPLIANCE_RISK_WORDS.length; i++) {
    if (textToCheck.indexOf(COMPLIANCE_RISK_WORDS[i]) >= 0) {
      errors.push(label + ': contains compliance risk word "' + COMPLIANCE_RISK_WORDS[i] + '"');
    }
  }

  if (typeof q.sourceLabel === 'string' && q.sourceLabel.indexOf('sample') >= 0 && q.sourceLabel.indexOf('mock') >= 0) {
    // sample/mock data should not claim to be official
  }

  return errors;
}

function validateQuestionBank(questions) {
  var allErrors = [];
  var ids = {};

  if (!Array.isArray(questions)) {
    return ['question bank must be an array'];
  }

  for (var i = 0; i < questions.length; i++) {
    var q = questions[i];
    var qErrors = validateQuestion(q, i);
    allErrors = allErrors.concat(qErrors);

    if (q && q.id) {
      if (ids[q.id]) {
        allErrors.push('duplicate id: ' + q.id);
      }
      ids[q.id] = true;
    }
  }

  return allErrors;
}

module.exports = {
  VALID_EXAMS: VALID_EXAMS,
  VALID_ANSWERS: VALID_ANSWERS,
  CHOICES_COUNT: CHOICES_COUNT,
  COMPLIANCE_RISK_WORDS: COMPLIANCE_RISK_WORDS,
  validateQuestion: validateQuestion,
  validateQuestionBank: validateQuestionBank
};
