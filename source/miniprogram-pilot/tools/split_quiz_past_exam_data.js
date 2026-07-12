#!/usr/bin/env node
/**
 * Split the past-exam question bank into small WeChat subpackages.
 *
 * The quiz shell package must stay lightweight. Each generated data package
 * owns the quiz page for its years, so the runtime never needs a sibling
 * subpackage require for the large bank data.
 */

'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var QUIZ_DATA_ROOT = path.join(ROOT, 'packages', 'quiz', 'data');
var PAST_BANK_ROOT = path.join(QUIZ_DATA_ROOT, 'past_exam_bank');
var FULL_BANK_PATH = path.join(PAST_BANK_ROOT, 'full_bank.js');
var FULL_EXPLANATIONS_PATH = path.join(PAST_BANK_ROOT, 'explanations_zh.js');
var QUESTIONS_PATH = path.join(QUIZ_DATA_ROOT, 'questions.js');
var COURSE_QUESTIONS_PATH = path.join(QUIZ_DATA_ROOT, 'course_questions.js');

var SOURCE_PAGE_DIR = path.join(ROOT, 'packages', 'quiz', 'pages', 'quiz');

var GROUPS = [
  {
    key: 'itpass-1',
    root: 'packages/quiz-itpass-1',
    name: 'quiz-itpass-1',
    exam: 'itpass',
    yearIds: ['01_aki', '02_aki', '03_haru']
  },
  {
    key: 'itpass-2',
    root: 'packages/quiz-itpass-2',
    name: 'quiz-itpass-2',
    exam: 'itpass',
    yearIds: ['04_haru', '05_haru', '06_haru']
  },
  {
    key: 'itpass-3',
    root: 'packages/quiz-itpass-3',
    name: 'quiz-itpass-3',
    exam: 'itpass',
    yearIds: ['07_haru', '08_haru', '28_aki']
  },
  {
    key: 'itpass-4',
    root: 'packages/quiz-itpass-4',
    name: 'quiz-itpass-4',
    exam: 'itpass',
    yearIds: ['28_haru', '29_aki', '29_haru']
  },
  {
    key: 'itpass-5',
    root: 'packages/quiz-itpass-5',
    name: 'quiz-itpass-5',
    exam: 'itpass',
    yearIds: ['30_aki', '30_haru', '31_haru']
  },
  {
    key: 'sg-1',
    root: 'packages/quiz-sg-1',
    name: 'quiz-sg-1',
    exam: 'sg',
    yearIds: ['sg_01_aki', 'sg_05_haru', 'sg_06_haru', 'sg_07_haru', 'sg_28_aki']
  },
  {
    key: 'sg-2',
    root: 'packages/quiz-sg-2',
    name: 'quiz-sg-2',
    exam: 'sg',
    yearIds: ['sg_28_haru', 'sg_29_aki', 'sg_29_haru', 'sg_30_aki', 'sg_30_haru', 'sg_31_haru']
  }
];

function toPosix(file) {
  return file.replace(/\\/g, '/');
}

function rel(file) {
  return toPosix(path.relative(ROOT, file));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function requireFresh(file) {
  delete require.cache[require.resolve(file)];
  return require(file);
}

function moduleText(header, value) {
  return header + '\nmodule.exports = ' + JSON.stringify(value) + ';\n';
}

function loadCourseQuestions() {
  var source = fs.existsSync(COURSE_QUESTIONS_PATH) ? COURSE_QUESTIONS_PATH : QUESTIONS_PATH;
  var mod = requireFresh(source);
  var list = Array.isArray(mod) ? mod : mod.questions;
  if (!Array.isArray(list)) {
    throw new Error('Cannot load course questions from ' + rel(source));
  }
  return list.filter(function (q) { return q && q.sourceType === 'lesson_quiz'; });
}

function loadPastBank() {
  if (fs.existsSync(FULL_BANK_PATH)) {
    return requireFresh(FULL_BANK_PATH);
  }

  var merged = [];
  GROUPS.forEach(function (group) {
    var file = path.join(ROOT, group.root, 'data', 'questions.js');
    if (!fs.existsSync(file)) return;
    var mod = requireFresh(file);
    var byYear = mod.questionsByYear || {};
    Object.keys(byYear).forEach(function (yearId) {
      merged = merged.concat(byYear[yearId] || []);
    });
  });
  if (merged.length === 0) {
    throw new Error('Cannot load past exam bank; full_bank.js missing and generated split packages are empty.');
  }
  return merged;
}

function loadExplanations() {
  if (fs.existsSync(FULL_EXPLANATIONS_PATH)) {
    return requireFresh(FULL_EXPLANATIONS_PATH);
  }

  var merged = {};
  GROUPS.forEach(function (group) {
    var file = path.join(ROOT, group.root, 'data', 'explanations_zh.js');
    if (!fs.existsSync(file)) return;
    var map = requireFresh(file);
    Object.keys(map || {}).forEach(function (id) {
      merged[id] = map[id];
    });
  });
  if (Object.keys(merged).length === 0) {
    throw new Error('Cannot load Chinese explanations; explanations_zh.js missing and generated split packages are empty.');
  }
  return merged;
}

function groupQuestionsByYear(questions) {
  var byYear = {};
  questions.forEach(function (q) {
    if (!q || q.sourceType !== 'past_exam_japanese') return;
    if (!byYear[q.yearId]) byYear[q.yearId] = [];
    byYear[q.yearId].push(q);
  });
  Object.keys(byYear).forEach(function (yearId) {
    byYear[yearId].sort(function (a, b) {
      var an = Number(a.number || 0);
      var bn = Number(b.number || 0);
      return an - bn;
    });
  });
  return byYear;
}

function buildMeta(group, questionsByYear) {
  var years = group.yearIds.map(function (yearId) {
    var questions = questionsByYear[yearId] || [];
    var first = questions[0] || {};
    return {
      exam: group.exam,
      yearId: yearId,
      year: first.year || yearId,
      label: first.year || yearId,
      count: questions.length,
      packageKey: group.key,
      packageRoot: group.root,
      route: '/' + group.root + '/pages/quiz/quiz?exam=' + group.exam +
        '&sourceType=past_exam_japanese&yearId=' + encodeURIComponent(yearId)
    };
  });

  return {
    packageKey: group.key,
    packageRoot: group.root,
    exam: group.exam,
    years: years,
    total: years.reduce(function (sum, item) { return sum + item.count; }, 0)
  };
}

function buildIndex(allMeta) {
  var years = [];
  allMeta.forEach(function (meta) {
    years = years.concat(meta.years);
  });
  years.sort(function (a, b) {
    if (a.exam !== b.exam) return a.exam < b.exam ? -1 : 1;
    return a.yearId < b.yearId ? -1 : a.yearId > b.yearId ? 1 : 0;
  });
  return {
    version: 'split-past-exam-v1',
    total: years.reduce(function (sum, item) { return sum + item.count; }, 0),
    exams: {
      itpass: years.filter(function (item) { return item.exam === 'itpass'; }).length,
      sg: years.filter(function (item) { return item.exam === 'sg'; }).length
    },
    years: years,
    packages: allMeta.map(function (meta) {
      return {
        key: meta.packageKey,
        root: meta.packageRoot,
        exam: meta.exam,
        total: meta.total,
        yearIds: meta.years.map(function (item) { return item.yearId; })
      };
    })
  };
}

function buildIndexJs(indexData) {
  return [
    '// Generated by tools/split_quiz_past_exam_data.js',
    "'use strict';",
    '',
    'var index = ' + JSON.stringify(indexData) + ';',
    '',
    'function cloneYear(item) {',
    '  return {',
    '    exam: item.exam,',
    '    yearId: item.yearId,',
    '    year: item.year,',
    '    label: item.label,',
    '    count: item.count,',
    '    packageKey: item.packageKey,',
    '    packageRoot: item.packageRoot,',
    '    route: item.route',
    '  };',
    '}',
    '',
    'function getYears(exam) {',
    '  return index.years.filter(function (item) {',
    '    return !exam || item.exam === exam;',
    '  }).map(cloneYear);',
    '}',
    '',
    'function getRoute(exam, yearId) {',
    '  for (var i = 0; i < index.years.length; i++) {',
    '    var item = index.years[i];',
    '    if (item.exam === exam && item.yearId === yearId) {',
    '      return cloneYear(item);',
    '    }',
    '  }',
    '  return null;',
    '}',
    '',
    'module.exports = {',
    '  version: index.version,',
    '  total: index.total,',
    '  exams: index.exams,',
    '  years: index.years,',
    '  packages: index.packages,',
    '  getYears: getYears,',
    '  getRoute: getRoute',
    '};',
    ''
  ].join('\n');
}

function buildSplitLoaderJs() {
  return [
    '// Generated by tools/split_quiz_past_exam_data.js',
    "'use strict';",
    '',
    "var questionsModule = require('./questions');",
    "var explanationsById = require('./explanations_zh');",
    "var translationsById = null;",
    "try {",
    "  translationsById = require('./translations_zh');",
    "} catch (e) {",
    "  // Ignore if translations_zh is not found",
    "}",
    "var meta = require('./meta');",
    '',
    'var questionsByYear = questionsModule.questionsByYear || {};',
    '',
    'function mergeTranslation(q) {',
    '  if (!q) return q;',
    '  if (explanationsById && explanationsById[q.id]) {',
    '    var exText = explanationsById[q.id];',
    '    if (exText && exText.length > 5) {',
    '      q.explanationZh = exText;',
    '    }',
    '  }',
    '  if (!translationsById) return q;',
    '  var t = translationsById[q.id];',
    '  if (!t) return q;',
    '  if (Array.isArray(t)) {',
    '    if (t[0] && t[0].length > 3) {',
    '      q.questionZh = t[0];',
    '    }',
    '    if (Array.isArray(t[1]) && q.options) {',
    '      for (var i = 0; i < t[1].length && i < q.options.length; i++) {',
    '        if (t[1][i] && t[1][i].length > 3) {',
    '          q.options[i].textZh = t[1][i];',
    '        }',
    '      }',
    '    }',
    '  } else if (t.questionZh) {',
    '    if (t.questionZh.length > 3) {',
    '      q.questionZh = t.questionZh;',
    '    }',
    '    if (t.options && q.options) {',
    '      for (var i = 0; i < t.options.length && i < q.options.length; i++) {',
    '        var opt = t.options[i];',
    '        if (typeof opt === \'string\' && opt.length > 3) {',
    '          q.options[i].textZh = opt;',
    '        } else if (opt && opt.textZh && opt.textZh.length > 3) {',
    '          q.options[i].textZh = opt.textZh;',
    '        }',
    '      }',
    '    }',
    '  }',
    "  q.hasZhTranslation = true;",
    "  q.zhFallbackFromJa = false;",
    "  q.translationStatus = 'needs_revision';",
    '  return q;',
    '}',
    '',
    'function getAllQuestions() {',
    '  var result = [];',
    '  Object.keys(questionsByYear).forEach(function (yearId) {',
    '    var list = questionsByYear[yearId] || [];',
    '    list.forEach(function(q) {',
    '      result.push(mergeTranslation(q));',
    '    });',
    '  });',
    '  return result;',
    '}',
    '',
    'function getQuestionsByYear(exam, yearId) {',
    '  var list = (questionsByYear[yearId] || []).slice();',
    '  list = list.map(function(q) { return mergeTranslation(q); });',
    '  if (!exam) return list;',
    '  return list.filter(function (q) { return q.exam === exam; });',
    '}',
    '',
    'module.exports = {',
    '  meta: meta,',
    '  questionsByYear: questionsByYear,',
    '  explanationsById: explanationsById,',
    '  translationsById: translationsById,',
    '  getAllQuestions: getAllQuestions,',
    '  getQuestionsByYear: getQuestionsByYear',
    '};',
    ''
  ].join('\n');
}

function buildSplitQuizPageJs() {
  return [
    '// Generated by tools/split_quiz_past_exam_data.js',
    '// Past-exam quiz page for one split data package.',
    "var pastExamLoader = require('../../data/loader');",
    'var generatedZhExplanations = pastExamLoader.explanationsById;',
    'var pastExamFull = pastExamLoader.getAllQuestions();',
    'var questionsModule = { questions: [] };',
    "var storage = require('../../../../utils/storage');",
    '',
    'function stripHtmlTags(html) {',
    "  if (!html || typeof html !== 'string') return '';",
    '  return html',
    "    .replace(/<br\\s*\\/?>/gi, '\\n')",
    "    .replace(/<\\/p>/gi, '\\n')",
    "    .replace(/<\\/div>/gi, '\\n')",
    "    .replace(/<[^>]+>/g, '')",
    "    .replace(/&nbsp;/g, ' ')",
    "    .replace(/&lt;/g, '<')",
    "    .replace(/&gt;/g, '>')",
    "    .replace(/&amp;/g, '&')",
    "    .replace(/&quot;/g, '\"')",
    "    .replace(/&#39;/g, \"'\")",
    "    .replace(/\\n{3,}/g, '\\n\\n')",
    '    .trim();',
    '}',
    '',
    'function hasJapaneseKana(text) {',
    '  if (!text) return false;',
    '  return /[\\u3040-\\u309F\\u30A0-\\u30FF]/.test(text);',
    '}',
    '',
    'function isMostlyJapanese(text) {',
    '  if (!text || text.length < 10) return false;',
    '  var kanaCount = 0;',
    '  for (var i = 0; i < text.length; i++) {',
    '    var code = text.charCodeAt(i);',
    '    if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF) || (code >= 0x4E00 && code <= 0x9FFF)) {',
    '      kanaCount++;',
    '    }',
    '  }',
    '  return kanaCount / text.length > 0.3;',
    '}',
    '',
    'function formatExplanation(raw) {',
    '  var cleaned = stripHtmlTags(raw);',
    "  if (!cleaned || cleaned.length < 5) return { clean: '', isJapanese: true };",
    '  var isJa = hasJapaneseKana(cleaned) || isMostlyJapanese(cleaned);',
    '  return { clean: cleaned, isJapanese: isJa };',
    '}',
    '',
    'function processQuestionForDisplay(q) {',
    '  var result = {};',
    '  for (var key in q) { result[key] = q[key]; }',
    '  if (q.questionZh) result.questionZhClean = stripHtmlTags(q.questionZh);',
    '  if (q.questionJa) result.questionJaClean = stripHtmlTags(q.questionJa);',
    "  var genExpl = generatedZhExplanations[q.id] || '';",
    '  if (genExpl && genExpl.length > 10) {',
    '    result.explanationZhClean = genExpl;',
    '  } else {',
    '    var zhResult = formatExplanation(q.explanationZh);',
    '    if (!zhResult.isJapanese && zhResult.clean && zhResult.clean.length > 10) {',
    '      result.explanationZhClean = zhResult.clean;',
    '    } else {',
    "      result.explanationZhClean = '正确答案：' + (q.answer || '') + '。本题考查IT基础知识，该选项最符合题意。';",
    '    }',
    '  }',
    '  var jaResult = formatExplanation(q.explanationJa);',
    '  result.explanationJaClean = jaResult.clean;',
    '  return result;',
    '}',
    '',
    'function createWrongQuestionSnapshot(q) {',
    '  if (!q) return null;',
    '  return {',
    '    id: q.id,',
    '    exam: q.exam,',
    '    sourceType: q.sourceType,',
    '    yearId: q.yearId,',
    '    year: q.year,',
    '    number: q.number,',
    '    category: q.category,',
    '    level: q.level,',
    '    questionZh: q.questionZhClean || q.questionZh || "",',
    '    questionJa: q.questionJaClean || q.questionJa || "",',
    '    options: q.options || [],',
    '    answer: q.answer,',
    '    explanationZh: q.explanationZhClean || q.explanationZh || "",',
    '    explanationJa: q.explanationJaClean || q.explanationJa || "",',
    '    translationStatus: q.translationStatus || "zh_fallback_from_ja",',
    '    explanationStatus: q.explanationStatus || "complete"',
    '  };',
    '}',
    '',
    'Page({',
    '  data: {',
    '    __themeDark: false,',
    "    exam: '',",
    "    sourceType: 'past_exam_japanese',",
    "    modeLabel: '日文题练习',",
    "    examTitle: '',",
    "    resultModeLabel: '',",
    '    questions: [],',
    '    currentIndex: 0,',
    '    currentQuestion: null,',
    "    selectedAnswer: '',",
    '    hasAnswered: false,',
    '    isCorrect: false,',
    '    isFinished: false,',
    '    showResult: false,',
    '    totalQuestions: 0,',
    '    sessionTotal: 0,',
    '    sessionCorrect: 0,',
    '    sessionWrong: 0,',
    '    sessionAccuracy: 0,',
    "    encouragementText: '',",
    "    accuracyLevel: '',",
    "    insightHint: '',",
    "    examBadge: '',",
    '    progressPercent: 0,',
    "    feedbackTip: '',",
    '    showFeedbackTip: false,',
    "    nextAction: '',",
    '    hasWrongQuestions: false,',
    '    answeredList: [],',
    '    showReview: false,',
    '    wrongQuestionIds: [],',
    '    showHint: false,',
    "    timerText: '',",
    '    startTime: 0,',
    "    yearId: ''",
    '  },',
    '',
    '  onLoad: function (options) {',
    '    this._applyTheme();',
    "    var exam = options.exam || 'itpass';",
    "    var sourceType = options.sourceType || 'past_exam_japanese';",
    "    var yearId = options.yearId || '';",
    '    var startTime = Date.now();',
    '    this.setData({ startTime: startTime });',
    '    this._timerInterval = setInterval(function () {',
    '      var diffSec = Math.floor((Date.now() - startTime) / 1000);',
    '      var minutes = Math.floor(diffSec / 60);',
    '      var seconds = diffSec % 60;',
    "      var timerText = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);",
    '      if (this && this.setData) this.setData({ timerText: timerText });',
    '    }.bind(this), 1000);',
    '',
    "    if (sourceType === 'wrong_only') {",
    '      this.loadWrongQuestions();',
    '      return;',
    '    }',
    '    this.loadPracticeQuestions(exam, sourceType, yearId);',
    '  },',
    '',
    '  loadPracticeQuestions: function (exam, sourceType, yearId) {',
    "    var examTitle = exam === 'sg' ? 'SG 考试' : 'IT Passport';",
    "    var examBadge = exam === 'sg' ? 'SG' : 'IT';",
    "    var modeLabel = sourceType === 'past_exam_japanese' ? '日文题练习' : '课程练习';",
    '    var baseQuestions = sourceType === "past_exam_japanese" ? pastExamFull : questionsModule.questions;',
    '    var allQuestions = baseQuestions.filter(function (question) {',
    '      return question.exam === exam && question.sourceType === sourceType;',
    '    });',
    '    if (yearId) allQuestions = allQuestions.filter(function (question) { return question.yearId === yearId; });',
    '',
    '    if (allQuestions.length > 0) {',
    '      var processed = allQuestions.map(processQuestionForDisplay);',
    "      var yearTag = yearId ? ('（' + yearId + '）') : '';",
    '      this.setData({',
    '        exam: exam,',
    "        examTitle: examTitle + ' - ' + modeLabel + yearTag,",
    '        examBadge: examBadge,',
    '        sourceType: sourceType,',
    '        modeLabel: modeLabel,',
    "        resultModeLabel: examTitle + ' · ' + modeLabel + yearTag,",
    '        questions: processed,',
    '        totalQuestions: processed.length,',
    '        currentQuestion: processed[0],',
    '        currentIndex: 0,',
    '        progressPercent: Math.round(1 / processed.length * 100) || 0,',
    "        selectedAnswer: '',",
    '        hasAnswered: false,',
    '        isCorrect: false,',
    '        isFinished: false,',
    '        showResult: false,',
    '        showFeedbackTip: false,',
    '        yearId: yearId',
    '      });',
    '    } else {',
    '      this.setData({',
    '        exam: exam,',
    "        examTitle: examTitle + ' - ' + modeLabel + (yearId ? ('（' + yearId + '）') : ''),",
    '        examBadge: examBadge,',
    '        sourceType: sourceType,',
    '        modeLabel: modeLabel,',
    "        resultModeLabel: examTitle + ' · ' + modeLabel,",
    '        questions: [],',
    '        currentQuestion: null,',
    '        isFinished: true,',
    '        showResult: false,',
    '        totalQuestions: 0,',
    '        showFeedbackTip: false,',
    '        yearId: yearId',
    '      });',
    '    }',
    '  },',
    '',
    '  selectAnswer: function (event) {',
    '    if (this.data.hasAnswered || !this.data.currentQuestion) return;',
    '    var key = event.currentTarget.dataset.key;',
    '    var correctAnswer = this.data.currentQuestion.answer;',
    '    var isCorrect = key === correctAnswer;',
    '    var attemptExam = this.data.exam;',
    '    if (!isCorrect) {',
    '      storage.addWrongQuestion(this.data.currentQuestion.id, attemptExam, key, createWrongQuestionSnapshot(this.data.currentQuestion));',
    '    }',
    '    storage.addQuizAttempt({',
    '      questionId: this.data.currentQuestion.id,',
    '      exam: attemptExam,',
    '      sourceType: this.data.sourceType,',
    '      selectedAnswer: key,',
    '      correctAnswer: correctAnswer,',
    '      isCorrect: isCorrect',
    '    });',
    '    var sessionTotal = this.data.sessionTotal + 1;',
    '    var sessionCorrect = this.data.sessionCorrect + (isCorrect ? 1 : 0);',
    '    var sessionWrong = this.data.sessionWrong + (isCorrect ? 0 : 1);',
    '    var answeredList = this.data.answeredList.slice();',
    '    answeredList.push({ questionId: this.data.currentQuestion.id, selectedAnswer: key, isCorrect: isCorrect });',
    '    var wrongQuestionIds = this.data.wrongQuestionIds.slice();',
    '    if (!isCorrect) wrongQuestionIds.push(this.data.currentQuestion.id);',
    "    var feedbackTip = isCorrect ? '回答正确，理解得不错！' : '正确答案是 ' + correctAnswer + '，建议结合解释理解知识点';",
    '    this.setData({',
    '      selectedAnswer: key,',
    '      hasAnswered: true,',
    '      isCorrect: isCorrect,',
    '      sessionTotal: sessionTotal,',
    '      sessionCorrect: sessionCorrect,',
    '      sessionWrong: sessionWrong,',
    '      sessionAccuracy: Math.round(sessionCorrect / sessionTotal * 100),',
    '      answeredList: answeredList,',
    '      wrongQuestionIds: wrongQuestionIds,',
    '      feedbackTip: feedbackTip,',
    '      showFeedbackTip: true',
    '    });',
    '  },',
    '',
    '  nextQuestion: function () {',
    '    var nextIndex = this.data.currentIndex + 1;',
    '    if (nextIndex >= this.data.questions.length) { this.showPracticeResult(); return; }',
    '    this.setData({',
    '      currentIndex: nextIndex,',
    '      currentQuestion: this.data.questions[nextIndex],',
    '      progressPercent: Math.round((nextIndex + 1) / this.data.totalQuestions * 100) || 0,',
    "      selectedAnswer: '',",
    '      hasAnswered: false,',
    '      isCorrect: false,',
    '      showFeedbackTip: false,',
    "      feedbackTip: ''",
    '    });',
    '  },',
    '',
    '  showPracticeResult: function () {',
    '    if (this._timerInterval) { clearInterval(this._timerInterval); this._timerInterval = null; }',
    '    var accuracy = this.data.sessionTotal > 0 ? Math.round(this.data.sessionCorrect / this.data.sessionTotal * 100) : 0;',
    "    var accuracyLevel = '';",
    "    var encouragement = '';",
    "    var insightHint = '';",
    "    var nextAction = '';",
    '    var hasWrongQuestions = this.data.sessionWrong > 0;',
    '    if (this.data.sessionTotal === 0) {',
    "      encouragement = '本次无答题记录'; accuracyLevel = 'none'; nextAction = '尝试开始一组新的练习';",
    '    } else if (accuracy >= 85) {',
    "      accuracyLevel = 'good'; encouragement = '掌握较好'; insightHint = '继续保持练习节奏，可以尝试其他考试方向'; nextAction = '建议尝试其他考试方向或日文题练习';",
    '    } else if (accuracy >= 60) {',
    "      accuracyLevel = 'moderate'; encouragement = '建议继续巩固'; insightHint = '建议再练一组巩固薄弱知识点'; nextAction = hasWrongQuestions ? '建议再练一次，并回顾本次错题' : '建议再来一组巩固练习';",
    '    } else {',
    "      accuracyLevel = 'low'; encouragement = '建议复盘错题'; insightHint = '建议先到错题本复习相关题目'; nextAction = '建议先复习本次错题，理解后再重新练习';",
    '    }',
    '    var questions = this.data.questions;',
    '    var answered = this.data.answeredList;',
    '    var reviewList = [];',
    '    for (var i = 0; i < answered.length; i++) {',
    '      var item = answered[i];',
    '      var question = null;',
    '      for (var j = 0; j < questions.length; j++) {',
    '        if (String(questions[j].id) === String(item.questionId)) { question = questions[j]; break; }',
    '      }',
    '      if (question) {',
    '        var qClean = processQuestionForDisplay(question);',
    '        reviewList.push({',
    '          questionId: item.questionId,',
    '          selectedAnswer: item.selectedAnswer,',
    '          isCorrect: item.isCorrect,',
    "          questionZh: qClean.questionZhClean || question.questionZh || '',",
    "          correctAnswer: question.answer || '',",
    "          hint: question.shared_hint || ''",
    '        });',
    '      }',
    '    }',
    '    this.setData({',
    '      isFinished: true,',
    '      showResult: true,',
    '      sessionAccuracy: accuracy,',
    '      encouragementText: encouragement,',
    '      accuracyLevel: accuracyLevel,',
    '      insightHint: insightHint,',
    '      nextAction: nextAction,',
    '      hasWrongQuestions: hasWrongQuestions,',
    '      reviewList: reviewList',
    '    });',
    '  },',
    '',
    '  toggleHint: function () { this.setData({ showHint: !this.data.showHint }); },',
    '',
    '  resetSession: function () {',
    '    this.setData({',
    '      currentIndex: 0, currentQuestion: null, selectedAnswer: "", hasAnswered: false,',
    '      isCorrect: false, isFinished: false, showResult: false, sessionTotal: 0,',
    '      sessionCorrect: 0, sessionWrong: 0, sessionAccuracy: 0, encouragementText: "",',
    '      accuracyLevel: "", insightHint: "", nextAction: "", hasWrongQuestions: false,',
    '      answeredList: [], showReview: false, wrongQuestionIds: [], showFeedbackTip: false, feedbackTip: ""',
    '    });',
    '  },',
    '',
    '  restartPractice: function () {',
    '    var exam = this.data.exam;',
    '    var sourceType = this.data.sourceType;',
    '    var yearId = this.data.yearId || "";',
    '    this.resetSession();',
    '    this.loadPracticeQuestions(exam, sourceType, yearId);',
    '  },',
    '',
    "  goMistakes: function () { wx.navigateTo({ url: '/packages/quiz/pages/mistakes/mistakes' }); },",
    "  goHome: function () { wx.switchTab({ url: '/pages/home/home' }); },",
    '  finishQuiz: function () { wx.navigateBack(); },',
    '  toggleReview: function () { this.setData({ showReview: !this.data.showReview }); },',
    '',
    '  loadWrongQuestions: function () {',
    '    this.setData({',
    "      exam: 'wrong_only', examTitle: '错题练习', examBadge: '错题', sourceType: 'wrong_only',",
    "      modeLabel: '错题重练', resultModeLabel: '错题练习 · 错题重练', questions: [],",
    '      currentQuestion: null, isFinished: true, showResult: false, totalQuestions: 0, showFeedbackTip: false',
    '    });',
    '  },',
    '',
    '  onShareAppMessage: function () {',
    "    var title = 'Study Tools 刷题';",
    '    if (this.data.showResult) {',
    '      title = "我在 Study Tools 刷题，正确率 " + (this.data.sessionAccuracy || 0) + "%，共 " + (this.data.sessionTotal || 0) + " 题，来挑战吧！";',
    '    }',
    "    return { title: title, path: '/packages/quiz/pages/exam-menu/exam-menu', imageUrl: '' };",
    '  },',
    '',
    '  retryWrongQuestions: function () {',
    '    var wrongIds = this.data.wrongQuestionIds || [];',
    "    if (wrongIds.length === 0) { wx.showToast({ title: '本次没有错题', icon: 'none' }); return; }",
    '    var allQuestions = this.data.questions;',
    '    var wrongQuestions = [];',
    '    for (var i = 0; i < allQuestions.length; i++) {',
    '      for (var j = 0; j < wrongIds.length; j++) {',
    '        if (String(allQuestions[i].id) === String(wrongIds[j])) { wrongQuestions.push(allQuestions[i]); break; }',
    '      }',
    '    }',
    "    if (wrongQuestions.length === 0) { wx.showToast({ title: '未找到错题', icon: 'none' }); return; }",
    '    this.setData({',
    '      questions: wrongQuestions, totalQuestions: wrongQuestions.length, currentIndex: 0,',
    '      currentQuestion: wrongQuestions[0], progressPercent: Math.round(1 / wrongQuestions.length * 100) || 0,',
    '      selectedAnswer: "", hasAnswered: false, isCorrect: false, isFinished: false, showResult: false,',
    '      sessionTotal: 0, sessionCorrect: 0, sessionWrong: 0, sessionAccuracy: 0, encouragementText: "",',
    '      accuracyLevel: "", insightHint: "", nextAction: "", hasWrongQuestions: false, wrongQuestionIds: [],',
    '      answeredList: [], showReview: false, showFeedbackTip: false',
    '    });',
    '  },',
    '',
    '  onShow: function () {',
    '    this._applyTheme();',
    '  },',
    '',
    '  onUnload: function () {',
    '    if (this._timerInterval) { clearInterval(this._timerInterval); this._timerInterval = null; }',
    "    wx.showToast({ title: '答题进度已保存', icon: 'success', duration: 1500 });",
    '  },',
    '',
    '  _applyTheme: function () {',
    '    var app = getApp();',
    '    var themeDark = !!(app && app.globalData && app.globalData.themeDark);',
    '    if (this.data.__themeDark !== themeDark) {',
    '      this.setData({ __themeDark: themeDark });',
    '    }',
    '  }',
    '});',
    ''
  ].join('\n');
}

function copyQuizPageAssets(group) {
  var targetDir = path.join(ROOT, group.root, 'pages', 'quiz');
  ensureDir(targetDir);
  ['wxml', 'wxss', 'json'].forEach(function (ext) {
    var source = path.join(SOURCE_PAGE_DIR, 'quiz.' + ext);
    var target = path.join(targetDir, 'quiz.' + ext);
    writeFile(target, fs.readFileSync(source, 'utf8'));
  });
  writeFile(path.join(targetDir, 'quiz.js'), buildSplitQuizPageJs());
}

function generate() {
  var courseQuestions = loadCourseQuestions();
  var pastBank = loadPastBank();
  var explanations = loadExplanations();
  var byYear = groupQuestionsByYear(pastBank);
  var allMeta = [];
  var seenIds = {};
  var missingExplanations = [];

  pastBank.forEach(function (q) {
    if (!explanations[q.id] || explanations[q.id].length < 60) {
      missingExplanations.push(q.id);
    }
    if (seenIds[q.id]) {
      throw new Error('Duplicate past exam question id: ' + q.id);
    }
    seenIds[q.id] = true;
  });

  if (pastBank.length !== 1945) {
    throw new Error('Expected 1945 past exam questions, got ' + pastBank.length);
  }
  if (missingExplanations.length > 0) {
    throw new Error('Missing or short Chinese explanations: ' + missingExplanations.slice(0, 5).join(', '));
  }

  writeFile(
    COURSE_QUESTIONS_PATH,
    moduleText('// Generated by tools/split_quiz_past_exam_data.js\n// Course quiz questions only; past exams live in split subpackages.', { questions: courseQuestions })
  );
  writeFile(
    QUESTIONS_PATH,
    "// Lightweight compatibility entry generated by tools/split_quiz_past_exam_data.js\nmodule.exports = require('./course_questions');\n"
  );

  GROUPS.forEach(function (group) {
    var groupQuestionsByYear = {};
    var groupExplanations = {};
    group.yearIds.forEach(function (yearId) {
      var list = byYear[yearId] || [];
      if (list.length === 0) {
        throw new Error('No questions found for ' + yearId);
      }
      groupQuestionsByYear[yearId] = list;
      list.forEach(function (q) {
        groupExplanations[q.id] = explanations[q.id];
      });
    });

    var meta = buildMeta(group, groupQuestionsByYear);
    allMeta.push(meta);

    var dataDir = path.join(ROOT, group.root, 'data');
    writeFile(
      path.join(dataDir, 'questions.js'),
      moduleText('// Generated by tools/split_quiz_past_exam_data.js', {
        packageKey: group.key,
        questionsByYear: groupQuestionsByYear
      })
    );
    writeFile(
      path.join(dataDir, 'explanations_zh.js'),
      moduleText('// Generated by tools/split_quiz_past_exam_data.js', groupExplanations)
    );
    writeFile(
      path.join(dataDir, 'meta.js'),
      moduleText('// Generated by tools/split_quiz_past_exam_data.js', meta)
    );
    writeFile(path.join(dataDir, 'loader.js'), buildSplitLoaderJs());
    copyQuizPageAssets(group);
  });

  writeFile(path.join(PAST_BANK_ROOT, 'index.js'), buildIndexJs(buildIndex(allMeta)));

  console.log('[OK] split quiz past exam data');
  console.log('  course questions: ' + courseQuestions.length);
  console.log('  past exam questions: ' + pastBank.length);
  console.log('  Chinese explanations: ' + Object.keys(explanations).length);
  allMeta.forEach(function (meta) {
    console.log('  ' + meta.packageRoot + ': ' + meta.total + ' questions, ' + meta.years.length + ' year(s)');
  });
}

generate();
