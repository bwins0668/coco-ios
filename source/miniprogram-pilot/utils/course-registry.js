// utils/course-registry.js
// Static course registry — single source of truth for all course metadata.
// No storage, no progress, no fake content.

var COURSES = [
  {
    id: 'itpass',
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'IT Passport',
    displayNameJa: 'ITパスポート',
    availability: 'available',
    legacyEntryRoute: '/packages/quiz/pages/exam-menu/exam-menu?exam=itpass',
    description: 'ITパスポート試験対策 · 按年度模拟练习',
    capabilities: {
      courseShell: true,
      practice: true,
      textbook: true,
      chapterDirectory: true,
      questionOrganization: true
    }
  },
  {
    id: 'sg',
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'SG 信息安全',
    displayNameJa: '情報セキュリティ',
    availability: 'available',
    legacyEntryRoute: '/packages/quiz/pages/exam-menu/exam-menu?exam=sg',
    description: '情報セキュリティマネジメント · 专项强化',
    capabilities: {
      courseShell: true,
      practice: true,
      textbook: true,
      chapterDirectory: true,
      questionOrganization: true
    }
  },
  {
    id: 'mos365',
    kind: 'certification',
    courseKind: 'legacy-practice',
    displayName: 'MOS 365',
    displayNameJa: 'MOS 365',
    availability: 'unresolved',
    legacyEntryRoute: null,
    description: 'MOS 365 认证考试 — 入口待确认',
    capabilities: {
      courseShell: false,
      practice: false,
      textbook: false,
      chapterDirectory: false,
      questionOrganization: false
    }
  },
  {
    id: 'python',
    kind: 'language',
    courseKind: 'learning',
    displayName: 'Python',
    availability: 'available',
    legacyEntryRoute: null,
    description: 'Python 编程学习 — GS1 / GS2 已开放',
    pythonVisibleLessonIds: [
      'python-0007-gs1-run-visible-output',
      'python-0008-gs2-values-and-variables',
      'python-0009-7d37969c-第-3-章-列表简介',
      'python-0010-921b265b-第-4-章-操作列表',
      'python-0011-5c80c609-第-5-章-if语句',
      'python-0012-5cc0ecc6-第-6-章-字典',
      'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
      'python-0014-75c7d812-第-8-章-函数',
      'python-0015-0f96233e-第-9-章-类'
    ],
    pythonPathLabelJa: 'Python入門 / リスト / 条件分岐',
    pythonPathLabelZh: 'Python 入门 / 列表 / 条件分支',
    capabilities: {
      courseShell: true,
      practice: false,
      textbook: false,
      chapterDirectory: false,
      questionOrganization: false
    }
  },
  {
    id: 'java',
    kind: 'language',
    courseKind: 'learning',
    displayName: 'Java',
    availability: 'planned',
    legacyEntryRoute: null,
    description: 'Java 编程学习 — 后续课程',
    capabilities: {
      courseShell: true,
      practice: false,
      textbook: false,
      chapterDirectory: false,
      questionOrganization: false
    }
  },
  {
    id: 'algorithm',
    kind: 'fundamentals',
    courseKind: 'learning',
    displayName: '算法基础',
    availability: 'planned',
    legacyEntryRoute: null,
    description: '算法与数据结构 — 后续课程',
    capabilities: {
      courseShell: true,
      practice: false,
      textbook: false,
      chapterDirectory: false,
      questionOrganization: false
    }
  }
];

function getAllCourses() { return COURSES; }

function getCoursesByKind(kind) {
  return COURSES.filter(function (c) { return c.kind === kind; });
}

function getAvailableCourses() {
  return COURSES.filter(function (c) { return c.availability === 'available'; });
}

function getCourseById(id) {
  for (var i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === id) return COURSES[i];
  }
  return null;
}

/** Courses that have a course shell page (courseShell: true). */
function getCourseShellCourses() {
  return COURSES.filter(function (c) { return c.capabilities && c.capabilities.courseShell; });
}

/** Whether a courseId is safe to navigate to the course shell. */
function isCourseShellAvailable(courseId) {
  var c = getCourseById(courseId);
  return !!(c && c.capabilities && c.capabilities.courseShell);
}

module.exports = {
  COURSES: COURSES,
  getAllCourses: getAllCourses,
  getCoursesByKind: getCoursesByKind,
  getAvailableCourses: getAvailableCourses,
  getCourseById: getCourseById,
  getCourseShellCourses: getCourseShellCourses,
  isCourseShellAvailable: isCourseShellAvailable
};
