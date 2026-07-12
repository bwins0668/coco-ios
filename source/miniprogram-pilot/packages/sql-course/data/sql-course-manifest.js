var manifest = {
  courseId: 'sql',
  title: {
    ja: 'SQL データベース入門',
    zh: 'SQL 数据库核心'
  },
  subtitle: {
    ja: '見えるクエリ結果から始める、日中バイリンガルの SQL 実技コース',
    zh: '从看得见的查询结果开始，用日中双语练 SQL 实操'
  },
  totalChapters: 7,
  totalSections: 1,
  chapters: [
    {
      chapterId: 'sql-ch01',
      chapterOrder: 1,
      title: {
        ja: 'データベースの基礎',
        zh: '数据库的基础'
      },
      description: {
        ja: 'データベースと SQL の役割を知り、最初の SELECT で見える結果を出す。',
        zh: '认识数据库与 SQL 的角色，用第一条 SELECT 得到看得见的结果。'
      },
      shard: 'sql-ch01.js',
      packageRoot: 'packages/sql-course',
      chapterRoute: '/packages/sql-course/pages/chapter/chapter?chapterId=sql-ch01',
      sections: [
        {
          sectionId: 'sql-1-1',
          lessonId: 'lesson-sql-01',
          order: 1,
          title: {
            ja: '01-SQLやデータベースとは何か？',
            zh: '01-什么是数据库与 SQL？'
          },
          lessonKind: 'sql-query',
          lessonRoute: '/packages/sql-course/pages/lesson/lesson?chapterId=sql-ch01&sectionId=lesson-sql-01'
        }
      ]
    }
  ]
};

module.exports = { manifest: manifest };
