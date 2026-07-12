// packages/sql-course/data/sql-source-manifest.js
// 源映射（Source of Truth: sql-learning-hub/data/lessons.js, 7章/36课）。
// courseLessons: 全 36 课登记（visible=已发布可见, planned=内部态未开放）。
// releaseVisibility: 当前唯一可见 lessonId 列表（golden 首发）。
// 自动生成，勿手改。重新生成：node scripts/build_sql_course_source_manifest.js

var courseChapters = [
  {
    "chapterId": "sql-ch01",
    "titleZh": "数据库的基础",
    "lessonCount": 2,
    "lessonIds": [
      "lesson-sql-01",
      "lesson-sql-02"
    ]
  },
  {
    "chapterId": "sql-ch02",
    "titleZh": "SELECT文的基本",
    "lessonCount": 13,
    "lessonIds": [
      "lesson-sql-03",
      "lesson-sql-04",
      "lesson-sql-05",
      "lesson-sql-06",
      "lesson-sql-07",
      "lesson-sql-08",
      "lesson-sql-09",
      "lesson-sql-10",
      "lesson-sql-11",
      "lesson-sql-12",
      "lesson-sql-13",
      "lesson-sql-14",
      "lesson-sql-15"
    ]
  },
  {
    "chapterId": "sql-ch03",
    "titleZh": "SQL函数与聚合",
    "lessonCount": 5,
    "lessonIds": [
      "lesson-sql-16",
      "lesson-sql-17",
      "lesson-sql-18",
      "lesson-sql-19",
      "lesson-sql-20"
    ]
  },
  {
    "chapterId": "sql-ch04",
    "titleZh": "多表联接 (JOIN)",
    "lessonCount": 5,
    "lessonIds": [
      "lesson-sql-21",
      "lesson-sql-22",
      "lesson-sql-23",
      "lesson-sql-24",
      "lesson-sql-25"
    ]
  },
  {
    "chapterId": "sql-ch05",
    "titleZh": "数据操作 (DML)",
    "lessonCount": 3,
    "lessonIds": [
      "lesson-sql-26",
      "lesson-sql-27",
      "lesson-sql-28"
    ]
  },
  {
    "chapterId": "sql-ch06",
    "titleZh": "表结构定义 (DDL)",
    "lessonCount": 5,
    "lessonIds": [
      "lesson-sql-29",
      "lesson-sql-30",
      "lesson-sql-31",
      "lesson-sql-32",
      "lesson-sql-33"
    ]
  },
  {
    "chapterId": "sql-ch07",
    "titleZh": "数据库的进阶与应用",
    "lessonCount": 3,
    "lessonIds": [
      "lesson-sql-34",
      "lesson-sql-35",
      "lesson-sql-36"
    ]
  }
];

var courseLessons = [
  {
    "lessonId": "lesson-sql-01",
    "sourceId": 1,
    "chapterId": "sql-ch01",
    "section": "数据库的基础",
    "titleZh": "01-什么是数据库 and SQL？",
    "titleJa": "01-SQLやデータベースとは何か？",
    "status": "visible"
  },
  {
    "lessonId": "lesson-sql-02",
    "sourceId": 2,
    "chapterId": "sql-ch01",
    "section": "数据库的基础",
    "titleZh": "02-数据表结构（数据类型与主键）",
    "titleJa": "02-テーブル構造（型・主キー）",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-03",
    "sourceId": 3,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "03-SELECT语句①基本语法",
    "titleJa": "03-SELECT文①基本構文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-04",
    "sourceId": 4,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "04-SELECT语句②过滤条件：WHERE",
    "titleJa": "04-SELECT文②条件：where",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-05",
    "sourceId": 5,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "05-SELECT语句③多条件：AND",
    "titleJa": "05-SELECT文③条件：and",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-06",
    "sourceId": 6,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "06-SELECT语句④多条件：OR",
    "titleJa": "06-SELECT文④条件：or",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-07",
    "sourceId": 7,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "07-SELECT语句⑤组合：AND与OR结合",
    "titleJa": "07-SELECT文⑤条件：and・or",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-08",
    "sourceId": 8,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "08-SELECT语句⑥条件：比较运算符",
    "titleJa": "08-SELECT文⑥条件：比較演算子",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-09",
    "sourceId": 9,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "09-SELECT语句⑦条件：IS NULL 与 IS NOT NULL",
    "titleJa": "09-SELECT文⑦条件：is null / is not null",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-10",
    "sourceId": 10,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "10-SELECT语句⑧条件：LIKE 模糊查询",
    "titleJa": "10-SELECT文⑧条件：like",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-11",
    "sourceId": 11,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "11-SELECT语句⑨条件：BETWEEN 范围查询",
    "titleJa": "11-SELECT文⑨条件：between",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-12",
    "sourceId": 12,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "12-SELECT语句⑩条件：IN 集合查询",
    "titleJa": "12-SELECT文⑩条件：in",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-13",
    "sourceId": 13,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "13-SELECT语句⑪排序：ORDER BY",
    "titleJa": "13-SELECT文⑪並び替え",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-14",
    "sourceId": 14,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "14-SELECT语句⑫限制行数：LIMIT",
    "titleJa": "14-SELECT文⑫行数制限",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-15",
    "sourceId": 15,
    "chapterId": "sql-ch02",
    "section": "SELECT文的基本",
    "titleZh": "15-SELECT语句⑬排除重复：DISTINCT",
    "titleJa": "15-SELECT文⑬重複排除",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-16",
    "sourceId": 16,
    "chapterId": "sql-ch03",
    "section": "SQL函数与聚合",
    "titleZh": "16-SQL内置函数：字符串与日期操作",
    "titleJa": "16-関数：文字列・日付など",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-17",
    "sourceId": 17,
    "chapterId": "sql-ch03",
    "section": "SQL函数与聚合",
    "titleZh": "17-条件分支：CASE WHEN 表达式",
    "titleJa": "17-関数：case式",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-18",
    "sourceId": 18,
    "chapterId": "sql-ch03",
    "section": "SQL函数与聚合",
    "titleZh": "18-聚合函数：求和、平均、计数等",
    "titleJa": "18-集計関数：合計・平均・件数など",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-19",
    "sourceId": 19,
    "chapterId": "sql-ch03",
    "section": "SQL函数与聚合",
    "titleZh": "19-聚合数据②：分组 GROUP BY",
    "titleJa": "19-集計関数②：グループ化",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-20",
    "sourceId": 20,
    "chapterId": "sql-ch03",
    "section": "SQL函数与聚合",
    "titleZh": "20-聚合数据③：分组后过滤 HAVING",
    "titleJa": "20-集計関数③：グループ化条件",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-21",
    "sourceId": 21,
    "chapterId": "sql-ch04",
    "section": "多表联接 (JOIN)",
    "titleZh": "21-数据库设计与规范化",
    "titleJa": "21-データベース設計・正規化",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-22",
    "sourceId": 22,
    "chapterId": "sql-ch04",
    "section": "多表联接 (JOIN)",
    "titleZh": "22-多表联接①：内联接 INNER JOIN",
    "titleJa": "22-テーブル結合①：INNER JOIN",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-23",
    "sourceId": 23,
    "chapterId": "sql-ch04",
    "section": "多表联接 (JOIN)",
    "titleZh": "23-多表联接②：外联接 LEFT/RIGHT JOIN",
    "titleJa": "23-テーブル結合②：LEFT/RIGHT JOIN",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-24",
    "sourceId": 24,
    "chapterId": "sql-ch04",
    "section": "多表联接 (JOIN)",
    "titleZh": "24-自联接 Self Join",
    "titleJa": "24-テーブル結合③：複数結合と自己結合",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-25",
    "sourceId": 25,
    "chapterId": "sql-ch04",
    "section": "多表联接 (JOIN)",
    "titleZh": "25-子查询 Subquery",
    "titleJa": "25-副問合せ",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-26",
    "sourceId": 26,
    "chapterId": "sql-ch05",
    "section": "数据操作 (DML)",
    "titleZh": "26-数据插入：INSERT 语句",
    "titleJa": "26-INSERT文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-27",
    "sourceId": 27,
    "chapterId": "sql-ch05",
    "section": "数据操作 (DML)",
    "titleZh": "27-数据更新：UPDATE 语句",
    "titleJa": "27-UPDATE文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-28",
    "sourceId": 28,
    "chapterId": "sql-ch05",
    "section": "数据操作 (DML)",
    "titleZh": "28-数据删除：DELETE 语句",
    "titleJa": "28-DELETE文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-29",
    "sourceId": 29,
    "chapterId": "sql-ch06",
    "section": "表结构定义 (DDL)",
    "titleZh": "29-创建表：CREATE TABLE 语句",
    "titleJa": "29-CREATE文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-30",
    "sourceId": 30,
    "chapterId": "sql-ch06",
    "section": "表结构定义 (DDL)",
    "titleZh": "30-数据约束：NOT NULL, UNIQUE, DEFAULT",
    "titleJa": "30-制約：not null / unique / default",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-31",
    "sourceId": 31,
    "chapterId": "sql-ch06",
    "section": "表结构定义 (DDL)",
    "titleZh": "31-主键与自动递增：AUTO_INCREMENT",
    "titleJa": "31-主キーと自動採番",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-32",
    "sourceId": 32,
    "chapterId": "sql-ch06",
    "section": "表结构定义 (DDL)",
    "titleZh": "32-外键约束 FOREIGN KEY",
    "titleJa": "32-外部キー制約",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-33",
    "sourceId": 33,
    "chapterId": "sql-ch06",
    "section": "表结构定义 (DDL)",
    "titleZh": "33-表结构修改与删除：ALTER TABLE 与 DROP TABLE",
    "titleJa": "33-ALTER文・DROP文",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-34",
    "sourceId": 34,
    "chapterId": "sql-ch07",
    "section": "数据库的进阶与应用",
    "titleZh": "34-事务处理 Transaction",
    "titleJa": "34-トランザクション処理",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-35",
    "sourceId": 35,
    "chapterId": "sql-ch07",
    "section": "数据库的进阶与应用",
    "titleZh": "35-索引 Index",
    "titleJa": "35-インデックス",
    "status": "planned"
  },
  {
    "lessonId": "lesson-sql-36",
    "sourceId": 36,
    "chapterId": "sql-ch07",
    "section": "数据库的进阶与应用",
    "titleZh": "36-视图 View 与 存储过程",
    "titleJa": "36-ビュー・ストアドルーチン",
    "status": "planned"
  }
];

var releaseVisibility = ['lesson-sql-01'];

module.exports = { courseChapters: courseChapters, courseLessons: courseLessons, releaseVisibility: releaseVisibility };
