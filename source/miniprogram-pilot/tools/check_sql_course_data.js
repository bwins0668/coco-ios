#!/usr/bin/env node
/**
 * check_sql_course_data.js — SQL 课程数据契约门禁 (PASS=0 / FAIL=1)。
 * 校验 packages/sql-course 的 manifest / source-manifest / golden lesson shard。
 *
 * 断言：
 *  - manifest: courseId='sql', chapters 数组, 每章有 id/title.ja/zh
 *  - source-manifest: 36 课全登记, releaseVisibility 恰为 golden 集(lesson-sql-01)
 *  - loader: getChapterWithLessons('sql-ch01') 可取; getLessonById 命中
 *  - golden lesson (lesson-sql-01):
 *      lessonKind==='sql-query'
 *      title.ja/zh 非空, blocks 非空且每块 ja/zh 非空
 *      playground.expectedQuery instanceof RegExp 且命中 'SELECT * FROM students_mst;'
 *      quiz.options>=2 且 answerIdx 合法, hint 非空
 *      terms 非空, 无占位(concept 文本长度阈值)
 */
'use strict';
var path = require('path');
var ROOT = path.resolve(__dirname, '..');
var fail = 0;
function assert(cond, msg) { if (!cond) { console.error('FAIL: ' + msg); fail += 1; } }

var manifestMod = require(path.join(ROOT, 'packages/sql-course/data/sql-course-manifest.js'));
var manifest = manifestMod.manifest;
var sourceMod = require(path.join(ROOT, 'packages/sql-course/data/sql-source-manifest.js'));
var loader = require(path.join(ROOT, 'packages/sql-course/utils/sql-course-loader.js'));

// manifest
assert(!!manifest && manifest.courseId === 'sql', "manifest.courseId==='sql'");
assert(Array.isArray(manifest.chapters) && manifest.chapters.length >= 1, 'manifest.chapters 非空');
manifest.chapters.forEach(function (ch) {
  assert(!!ch.chapterId && ch.title && ch.title.ja && ch.title.zh, '章有 chapterId/title.ja/zh: ' + ch.chapterId);
});

// source-manifest: 36 课登记 + releaseVisibility
var courseLessons = sourceMod.courseLessons || [];
assert(courseLessons.length === 36, 'source-manifest courseLessons=36, 实际=' + courseLessons.length);
var vis = sourceMod.releaseVisibility || [];
assert(vis.length === 1 && vis[0] === 'lesson-sql-01', "releaseVisibility 恰为 ['lesson-sql-01'], 实际=" + JSON.stringify(vis));

// loader + golden lesson
var result = loader.getChapterWithLessons('sql-ch01');
assert(!!result && result.chapter && Array.isArray(result.lessons), "loader.getChapterWithLessons('sql-ch01') 可取");
var l1 = loader.getLessonById('sql-ch01', 'lesson-sql-01');
assert(!!l1, "getLessonById('sql-ch01','lesson-sql-01') 命中");
if (l1) {
  assert(l1.lessonKind === 'sql-query', "golden lessonKind==='sql-query'");
  assert(!!l1.title && l1.title.ja && l1.title.zh, 'golden title.ja/zh 非空');
  assert(Array.isArray(l1.blocks) && l1.blocks.length >= 1, 'golden blocks 非空');
  (l1.blocks || []).forEach(function (b, i) {
    assert(!!b.ja && !!b.zh, 'block[' + i + '] ja/zh 非空');
  });
  assert(l1.blocks && l1.blocks[0] && l1.blocks[0].zh.length >= 40, 'golden 概念非占位(zh>=40字)');
  assert(!!l1.playground && (l1.playground.expectedQuery instanceof RegExp), 'playground.expectedQuery 是 RegExp');
  assert(l1.playground && l1.playground.expectedQuery.test('SELECT * FROM students_mst;'), 'expectedQuery 命中标准答案');
  assert(l1.playground && !!l1.playground.taskJa && !!l1.playground.taskZh, 'playground task ja/zh 非空');
  assert(!!l1.quiz && Array.isArray(l1.quiz.options) && l1.quiz.options.length >= 2, 'quiz options>=2');
  assert(l1.quiz && l1.quiz.answerIdx >= 0 && l1.quiz.answerIdx < l1.quiz.options.length, 'quiz answerIdx 合法');
  assert(l1.quiz && !!l1.quiz.hint, 'quiz hint 非空');
  assert(Array.isArray(l1.terms) && l1.terms.length >= 1, 'terms 非空');
}

if (fail === 0) { console.log('PASS: SQL 课程数据契约通过（golden lesson-sql-01 / 36课登记 / sql-query / 正则命中）'); }
else { console.error('共 ' + fail + ' 条失败'); process.exit(1); }
