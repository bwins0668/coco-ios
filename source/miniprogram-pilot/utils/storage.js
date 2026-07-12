// utils/storage.js
// 本地存储工具模块（收藏 + 错题本）

// ========== 收藏术语 ==========

const FAVORITE_TERMS_KEY = "study-tools-mini-favorite-terms-v1";

function getFavoriteTerms() {
  try {
    const list = wx.getStorageSync(FAVORITE_TERMS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getFavoriteTerms failed", error);
    return [];
  }
}

function saveFavoriteTerms(list) {
  try {
    wx.setStorageSync(FAVORITE_TERMS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveFavoriteTerms failed", error);
  }
}

function isFavoriteTerm(id) {
  return getFavoriteTerms().some((item) => item.id === id);
}

function addFavoriteTerm(id) {
  const list = getFavoriteTerms();
  if (!list.some((item) => item.id === id)) {
    list.push({
      id,
      savedAt: Date.now()
    });
    saveFavoriteTerms(list);
  }
  return getFavoriteTerms();
}

function removeFavoriteTerm(id) {
  const list = getFavoriteTerms().filter((item) => item.id !== id);
  saveFavoriteTerms(list);
  return list;
}

function getFavoriteTermCount() {
  return getFavoriteTerms().length;
}

/**
 * 获取收藏术语统计
 * 返回 { total, lastSavedAt }
 */
function getFavoriteTermStats() {
  var list = getFavoriteTerms();
  var stats = { total: list.length, lastSavedAt: null };
  for (var i = 0; i < list.length; i++) {
    var t = list[i];
    if (t && typeof t.savedAt === 'number') {
      if (t.savedAt > (stats.lastSavedAt || 0)) {
        stats.lastSavedAt = t.savedAt;
      }
    }
  }
  return stats;
}

// ========== 收藏题目（独立领域，R2.7） ==========
// 与术语收藏 / 闪卡 / 错题完全隔离。只存身份与轻量时间，不存题目正文。

const FAVORITE_QUESTIONS_KEY = "study-tools-mini-favorite-questions-v1";

function getFavoriteQuestions() {
  try {
    var raw = wx.getStorageSync(FAVORITE_QUESTIONS_KEY);
    if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
      return { version: 1, items: raw.items };
    }
    return { version: 1, items: [] };
  } catch (error) {
    console.warn("getFavoriteQuestions failed", error);
    return { version: 1, items: [] };
  }
}

function saveFavoriteQuestions(data) {
  var items = (data && Array.isArray(data.items)) ? data.items : [];
  try {
    wx.setStorageSync(FAVORITE_QUESTIONS_KEY, { version: 1, items: items });
  } catch (error) {
    console.warn("saveFavoriteQuestions failed", error);
  }
}

// ========== 错题本 ==========

const WRONG_QUESTIONS_KEY = "study-tools-mini-wrong-questions-v1";

function getWrongQuestions() {
  try {
    const list = wx.getStorageSync(WRONG_QUESTIONS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getWrongQuestions failed", error);
    return [];
  }
}

function saveWrongQuestions(list) {
  try {
    wx.setStorageSync(WRONG_QUESTIONS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveWrongQuestions failed", error);
  }
}

function normalizeQuestionSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  return {
    id: snapshot.id,
    exam: snapshot.exam,
    sourceType: snapshot.sourceType,
    yearId: snapshot.yearId,
    year: snapshot.year,
    number: snapshot.number,
    category: snapshot.category,
    level: snapshot.level,
    questionZh: snapshot.questionZh || '',
    questionJa: snapshot.questionJa || '',
    options: Array.isArray(snapshot.options) ? snapshot.options.slice(0, 8) : [],
    answer: snapshot.answer,
    explanationZh: snapshot.explanationZh || '',
    explanationJa: snapshot.explanationJa || '',
    translationStatus: snapshot.translationStatus,
    explanationStatus: snapshot.explanationStatus
  };
}

function addWrongQuestion(questionId, exam, lastAnswer, questionSnapshot) {
  var list = getWrongQuestions();
  var now = Date.now();
  var snapshot = normalizeQuestionSnapshot(questionSnapshot);
  // 查找是否已存在
  var found = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === questionId) {
      list[i].wrongAt = now;
      list[i].lastAnswer = lastAnswer;
      if (snapshot) {
        list[i].questionSnapshot = snapshot;
        list[i].sourceType = snapshot.sourceType || list[i].sourceType;
        list[i].yearId = snapshot.yearId || list[i].yearId;
      }
      found = true;
      break;
    }
  }
  // 不存在则新增
  if (!found) {
    list.push({
      id: questionId,
      exam: exam,
      wrongAt: now,
      lastAnswer: lastAnswer,
      sourceType: snapshot && snapshot.sourceType,
      yearId: snapshot && snapshot.yearId,
      questionSnapshot: snapshot
    });
  }
  saveWrongQuestions(list);
  return list;
}

function removeWrongQuestion(questionId) {
  var list = getWrongQuestions().filter(function (item) {
    return item.id !== questionId;
  });
  saveWrongQuestions(list);
  return list;
}

function clearWrongQuestions() {
  saveWrongQuestions([]);
  return [];
}

function getWrongQuestionCount() {
  return getWrongQuestions().length;
}

/**
 * 按考试类型统计错题数量
 * 返回 { itpass: N, sg: N }
 */
function getWrongQuestionStats() {
  var list = getWrongQuestions();
  var stats = { itpass: 0, sg: 0 };
  for (var i = 0; i < list.length; i++) {
    var exam = list[i].exam;
    if (stats[exam] !== undefined) {
      stats[exam]++;
    }
  }
  return stats;
}

/**
 * 获取最近一次错题时间
 * 返回 timestamp 或 null
 */
function getLastWrongTime() {
  var list = getWrongQuestions();
  if (list.length === 0) return null;
  var latest = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].wrongAt > latest) {
      latest = list[i].wrongAt;
    }
  }
  return latest || null;
}

// ========== 做题记录 ==========

var QUIZ_ATTEMPTS_KEY = "study-tools-mini-quiz-attempts-v1";

function getQuizAttempts() {
  try {
    var list = wx.getStorageSync(QUIZ_ATTEMPTS_KEY);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.warn("getQuizAttempts failed", error);
    return [];
  }
}

function saveQuizAttempts(list) {
  try {
    wx.setStorageSync(QUIZ_ATTEMPTS_KEY, Array.isArray(list) ? list : []);
  } catch (error) {
    console.warn("saveQuizAttempts failed", error);
  }
}

function addQuizAttempt(payload) {
  var list = getQuizAttempts();
  var now = Date.now();
  var attempt = {
    id: "attempt-" + now + "-" + payload.questionId,
    questionId: payload.questionId,
    exam: payload.exam,
    sourceType: payload.sourceType,
    selectedAnswer: payload.selectedAnswer,
    correctAnswer: payload.correctAnswer,
    isCorrect: !!payload.isCorrect,
    answeredAt: now
  };
  // R2.6: optional verified topic practice context. Same storage key, no new key.
  // Only ever written for a registry-verified topic session; never for normal /
  // yearId / wrong_only attempts. Purely descriptive — never a resume checkpoint.
  if (payload.topicId) {
    attempt.topicId = payload.topicId;
    if (payload.topicTitleSnapshot) attempt.topicTitleSnapshot = payload.topicTitleSnapshot;
  }
  list.push(attempt);
  saveQuizAttempts(list);
  return list;
}

function clearQuizAttempts() {
  saveQuizAttempts([]);
  return [];
}

function getQuizAttemptCount() {
  return getQuizAttempts().length;
}

function getTodayQuizAttemptCount() {
  var list = getQuizAttempts();
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  var count = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].answeredAt >= todayStart) {
      count++;
    }
  }
  return count;
}

function getQuizStats() {
  var list = getQuizAttempts();
  var total = list.length;
  var correct = 0;
  var todayTotal = 0;
  var now = new Date();
  var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  var byExam = {
    itpass: { total: 0, correct: 0, wrong: 0, accuracy: 0 },
    sg: { total: 0, correct: 0, wrong: 0, accuracy: 0 }
  };
  var bySourceType = {
    lesson_quiz: { total: 0, correct: 0, wrong: 0, accuracy: 0 },
    past_exam_japanese: { total: 0, correct: 0, wrong: 0, accuracy: 0 }
  };

  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.isCorrect) correct++;

    if (a.answeredAt >= todayStart) todayTotal++;

    // by exam
    var examKey = a.exam;
    if (byExam[examKey]) {
      byExam[examKey].total++;
      if (a.isCorrect) byExam[examKey].correct++;
      else byExam[examKey].wrong++;
    }

    // by sourceType
    var srcKey = a.sourceType;
    if (bySourceType[srcKey]) {
      bySourceType[srcKey].total++;
      if (a.isCorrect) bySourceType[srcKey].correct++;
      else bySourceType[srcKey].wrong++;
    }
  }

  // calculate accuracy
  var accuracy = total > 0 ? Math.round(correct / total * 100) : 0;
  var examKeys = Object.keys(byExam);
  for (var e = 0; e < examKeys.length; e++) {
    var ek = byExam[examKeys[e]];
    ek.accuracy = ek.total > 0 ? Math.round(ek.correct / ek.total * 100) : 0;
  }
  var srcKeys = Object.keys(bySourceType);
  for (var s = 0; s < srcKeys.length; s++) {
    var sk = bySourceType[srcKeys[s]];
    sk.accuracy = sk.total > 0 ? Math.round(sk.correct / sk.total * 100) : 0;
  }

  return {
    total: total,
    correct: correct,
    wrong: total - correct,
    accuracy: accuracy,
    todayTotal: todayTotal,
    byExam: byExam,
    bySourceType: bySourceType
  };
}

/**
 * 按 exam + sourceType 获取统计
 */
function getLastAttempt() {
  var list = getQuizAttempts();
  if (list.length === 0) return null;
  var sorted = list.slice().sort(function (a, b) {
    return b.answeredAt - a.answeredAt;
  });
  return sorted[0];
}

/**
 * 获取指定考试方向最近一次练习的时间（timestamp）
 * 返回 timestamp 或 null
 */
function getLastAttemptByExam(exam) {
  var list = getQuizAttempts();
  if (list.length === 0) return null;
  var latest = 0;
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.exam === exam && a.answeredAt > latest) {
      latest = a.answeredAt;
    }
  }
  return latest || null;
}

function getQuizStatsByFilter(exam, sourceType) {
  var list = getQuizAttempts();
  var total = 0;
  var correct = 0;
  for (var i = 0; i < list.length; i++) {
    var a = list[i];
    if (a.exam === exam && a.sourceType === sourceType) {
      total++;
      if (a.isCorrect) correct++;
    }
  }
  return {
    total: total,
    correct: correct,
    wrong: total - correct,
    accuracy: total > 0 ? Math.round(correct / total * 100) : 0
  };
}

/**
 * 获取最近 N 条答题记录（按时间倒序）
 * 不改变旧数据结构，仅排序切片
 */
function getRecentAttempts(limit) {
  if (!limit || limit <= 0) limit = 10;
  var list = getQuizAttempts();
  if (list.length === 0) return [];
  var sorted = list.slice().sort(function (a, b) {
    return b.answeredAt - a.answeredAt;
  });
  return sorted.slice(0, limit);
}

/**
 * 计算连续学习天数
 * 基于 quiz attempts 的日期去重后，从今天往前数连续天数
 * 今天未学习则从昨天开始算
 */
function getConsecutiveLearningDays() {
  var list = getQuizAttempts();
  if (list.length === 0) return 0;

  // 收集所有有记录的日期（按天去重）
  var dateSet = {};
  for (var i = 0; i < list.length; i++) {
    var ts = list[i].answeredAt;
    if (!ts) continue;
    var d = new Date(ts);
    var dateKey = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    dateSet[dateKey] = true;
  }

  var dates = Object.keys(dateSet);
  if (dates.length === 0) return 0;

  // 排序（降序）
  dates.sort(function (a, b) { return b > a ? 1 : b < a ? -1 : 0; });

  // 获取今天和昨天的日期字符串
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var todayKey = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

  // 如果今天有记录，从今天开始算；否则从昨天开始算
  var hasToday = dateSet[todayKey];
  if (!hasToday) {
    // 检查昨天
    var yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    var yesterdayKey = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' + yesterday.getDate();
    if (!dateSet[yesterdayKey]) return 0; // 今天和昨天都没学，连续中断
  }

  // 从最近有记录的日期开始，往前数连续天数
  var streak = 0;
  var checkDate = hasToday ? today : new Date(today.getTime() - 24 * 60 * 60 * 1000);
  while (true) {
    var checkKey = checkDate.getFullYear() + '-' + (checkDate.getMonth() + 1) + '-' + checkDate.getDate();
    if (dateSet[checkKey]) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

// ========== 本地数据备份 / 恢复 ==========

function validateLocalBackup(backup) {
  if (!backup || typeof backup !== 'object') return false;
  if (backup.app !== 'study-tools-mini') return false;
  if (!backup.data || typeof backup.data !== 'object') return false;
  if (!Array.isArray(backup.data.favoriteTerms)) return false;
  if (!Array.isArray(backup.data.wrongQuestions)) return false;
  if (!Array.isArray(backup.data.quizAttempts)) return false;
  return true;
}

function exportLocalBackup() {
  var ankiStatus = {};
  try { ankiStatus = wx.getStorageSync(ANKI_STATUS_KEY) || {}; } catch (e) {}
  var flashcardProgress = null;
  try { flashcardProgress = wx.getStorageSync('flashcard_progress_v1') || null; } catch (e) {}
  return {
    app: 'study-tools-mini',
    version: 'v0.28.0',
    exportedAt: Date.now(),
    data: {
      favoriteTerms: getFavoriteTerms(),
      wrongQuestions: getWrongQuestions(),
      quizAttempts: getQuizAttempts(),
      // R2.7: optional independent question-favorite domain (object {version,items})
      favoriteQuestions: getFavoriteQuestions()
    },
    ankiStatus: ankiStatus,
    flashcardProgress: flashcardProgress
  };
}

function importLocalBackup(backup) {
  if (!validateLocalBackup(backup)) return false;
  saveFavoriteTerms(backup.data.favoriteTerms);
  saveWrongQuestions(backup.data.wrongQuestions);
  saveQuizAttempts(backup.data.quizAttempts);
  // R2.7: optional question favorites. Old backups omit this -> leave as-is (empty).
  // Corrupt shapes are ignored safely (only import a well-formed {items:[]}).
  var fq = backup.data.favoriteQuestions;
  if (fq && typeof fq === 'object' && Array.isArray(fq.items)) {
    saveFavoriteQuestions({ version: 1, items: fq.items });
  }
  if (backup.ankiStatus) {
    try { wx.setStorageSync(ANKI_STATUS_KEY, backup.ankiStatus); } catch (e) {}
  }
  if (backup.flashcardProgress) {
    try { wx.setStorageSync('flashcard_progress_v1', backup.flashcardProgress); } catch (e) {}
  }
  return true;
}

function clearAllLocalUserData() {
  saveFavoriteTerms([]);
  saveWrongQuestions([]);
  saveQuizAttempts([]);
  saveFavoriteQuestions({ version: 1, items: [] });
}

var ANKI_STATUS_KEY = 'study-tools-mini-anki-status-v1';
module.exports = {
  // 收藏术语
  FAVORITE_TERMS_KEY: FAVORITE_TERMS_KEY,
  getFavoriteTerms: getFavoriteTerms,
  saveFavoriteTerms: saveFavoriteTerms,
  // R2.7: independent question favorites raw accessors (domain logic in utils/favorite-questions.js)
  FAVORITE_QUESTIONS_KEY: FAVORITE_QUESTIONS_KEY,
  getFavoriteQuestions: getFavoriteQuestions,
  saveFavoriteQuestions: saveFavoriteQuestions,
  isFavoriteTerm: isFavoriteTerm,
  addFavoriteTerm: addFavoriteTerm,
  removeFavoriteTerm: removeFavoriteTerm,
  getFavoriteTermCount: getFavoriteTermCount,
  getFavoriteTermStats: getFavoriteTermStats,
  // 错题本
  WRONG_QUESTIONS_KEY: WRONG_QUESTIONS_KEY,
  getWrongQuestions: getWrongQuestions,
  saveWrongQuestions: saveWrongQuestions,
  addWrongQuestion: addWrongQuestion,
  removeWrongQuestion: removeWrongQuestion,
  clearWrongQuestions: clearWrongQuestions,
  getWrongQuestionCount: getWrongQuestionCount,
  getWrongQuestionStats: getWrongQuestionStats,
  getLastWrongTime: getLastWrongTime,
  // 做题记录
  QUIZ_ATTEMPTS_KEY: QUIZ_ATTEMPTS_KEY,
  getQuizAttempts: getQuizAttempts,
  saveQuizAttempts: saveQuizAttempts,
  addQuizAttempt: addQuizAttempt,
  clearQuizAttempts: clearQuizAttempts,
  getQuizAttemptCount: getQuizAttemptCount,
  getTodayQuizAttemptCount: getTodayQuizAttemptCount,
  getQuizStats: getQuizStats,
  getQuizStatsByFilter: getQuizStatsByFilter,
  getLastAttempt: getLastAttempt,
  getLastAttemptByExam: getLastAttemptByExam,
  getRecentAttempts: getRecentAttempts,
  getConsecutiveLearningDays: getConsecutiveLearningDays,
  // 本地数据备份 / 恢复
  validateLocalBackup: validateLocalBackup,
  exportLocalBackup: exportLocalBackup,
  importLocalBackup: importLocalBackup,
  clearAllLocalUserData: clearAllLocalUserData
};
