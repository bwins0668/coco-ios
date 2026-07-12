// packages/sql-course/data/chapters/sql-ch01.js
// 源：sql-learning-hub/data/lessons.js（lesson id=1）。字段映射进 d0 白名单 + sql-query lessonKind。
// expectedQuery 以正则字面量存储，消费页在自身 realm 得到原生 RegExp（跨 realm 安全）。

module.exports = {
  chapter: {
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
    sections: [
      {
        sectionId: 'sql-1-1',
        lessonId: 'lesson-sql-01',
        order: 1,
        title: {
          ja: '01-SQLやデータベースとは何か？',
          zh: '01-什么是数据库与 SQL？'
        },
        lessonKind: 'sql-query'
      }
    ]
  },
  lessons: [
    {
      lessonId: 'lesson-sql-01',
      chapterId: 'sql-ch01',
      order: 1,
      lessonKind: 'sql-query',
      title: {
        ja: '01-SQLやデータベースとは何か？',
        zh: '01-什么是数据库与 SQL？'
      },
      objectives: [
        {
          ja: 'データベース・RDB・SQL の関係を説明し、SELECT が「データを取ってくる」命令だと理解する。',
          zh: '能说明数据库、RDB 与 SQL 的关系，并理解 SELECT 是“取回数据”的命令。'
        }
      ],
      blocks: [
        {
          semanticKey: 'concept-db-and-sql',
          type: 'concept',
          title: {
            ja: 'データベースと SQL とは',
            zh: '数据库与 SQL 是什么'
          },
          ja: 'データベース(DB)とは、整理されたデータの集まりです。\n多くのシステムでは、データを「表(テーブル)」の形式で管理する**リレーショナルデータベース(RDB)**が使われます。\n**SQL**は、そのデータベースに対して「データを取ってきて」「データを登録して」と命令するための専用の言語です。\n今回は、あなたの学校のデータベースから学生マスタを取得する、もっとも基本的なデータ取得命令を学びましょう。',
          zh: '数据库（Database, 简称 DB）是按组织结构存储的数据集合。\n在大多数系统里，数据是以类似于 Excel 表格的“表（Table）”的形式存储在**关系型数据库（RDB）**中的。\n**SQL**（结构化查询语言）是用来给数据库发送指令（比如“读取数据”、“插入数据”）的专用语言。\n这一节我们将从你学校真实的“学生主表”中获取所有数据，体验最基本的查询指令。'
        }
      ],
      analogy: {
        zh: '学校的系统就像一个大抽屉（数据库），里面的 students_mst 文件夹就像是“学生表”，我们的 SQL 语句就是向它要数据的指令。'
      },
      terms: [
        {
          ja: 'データベース',
          zh: '数据库',
          en: 'Database (DB)',
          desc: '【出题特征/考点】题干中通常表述为“整理され、検索や加工がしやすいデータの集まり”（整理好的、易于检索加工的数据集合）。\n【释义】按组织结构在磁盘中保存数据的软件容器。'
        },
        {
          ja: 'SQL',
          zh: '结构化查询语言',
          en: 'Structured Query Language',
          desc: '【出题特征/考点】用于与关系型数据库（RDB）进行对话、发送查询与更新指令的国际标准专属语言。\n【释义】不同于普通编程语言，它是非过程化的声明式数据交互语言。'
        }
      ],
      example: {
        code: 'SELECT * FROM students_mst;'
      },
      playground: {
        taskJa: '学生マスタ (students_mst) のすべての列とすべての行を取得しましょう。',
        taskZh: '查询学生主表 (students_mst) 的所有列和所有行的数据。',
        expectedQuery: /^\s*SELECT\s+\*\s+FROM\s+students_mst\s*;?\s*$/i
      },
      quiz: {
        question: 'SQLとは何をするための言語ですか？ (SQL 是用来做什么的语言？)',
        options: [
          'ホームページのデザインを整える (调整网页设计)',
          'データベースを操作し、データを取得・加工する (操作数据库以获取和加工数据)',
          'スマートフォンアプリの画面を作る (制作手机 App 界面)'
        ],
        answerIdx: 1,
        hint: 'SQL stands for Structured Query Language. It works with databases.'
      },
      summary: {
        ja: 'データベースは整理されたデータの集まり、RDB は表形式の管理、SQL はその表に命令する言語。SELECT * FROM students_mst; で学生表全体を取得しました。',
        zh: '数据库是有组织的数据集合，RDB 用表来管理，SQL 是对表下达命令的语言。你用 SELECT * FROM students_mst; 取回了整张学生表。'
      }
    }
  ]
};
