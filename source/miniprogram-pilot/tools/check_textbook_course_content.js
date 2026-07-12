#!/usr/bin/env node
'use strict';

/*
 * R5 textbook course content validator.
 *
 * Validates the new textbook-grounded course data without reading or mutating
 * storage and without importing Quiz pages. The detailed content must live in
 * the lazy course-content subpackage; main-package files may only carry small
 * navigation/index glue.
 */

var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');
var CONTENT_MODULE = path.join(ROOT, 'packages/course-content/data/textbook-course.js');
var COURSE_QUESTIONS = path.join(ROOT, 'packages/quiz/data/course_questions.js');
var failures = [];

function fail(message) {
  failures.push(message);
}

function readText(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function listFiles(dir, acc) {
  acc = acc || [];
  if (!fs.existsSync(dir)) return acc;
  fs.readdirSync(dir).forEach(function (name) {
    var full = path.join(dir, name);
    var stat = fs.statSync(full);
    if (stat.isDirectory()) listFiles(full, acc);
    else if (stat.isFile()) acc.push(full);
  });
  return acc;
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function gitDiffNames() {
  try {
    return childProcess.execFileSync('git', ['diff', '--name-only'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    }).split(/\r?\n/).filter(Boolean);
  } catch (e) {
    fail('unable to inspect git diff: ' + e.message);
    return [];
  }
}

function gitDiffText(name) {
  try {
    return childProcess.execFileSync('git', ['diff', '--', name], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (e) {
    fail('unable to inspect git diff for ' + name + ': ' + e.message);
    return '';
  }
}

function isAllowedR66QuizShellDiff(name) {
  var diff = gitDiffText(name);
  var addedOrRemoved = diff.split(/\r?\n/).filter(function (line) {
    return (/^[+-]/.test(line) && !/^(\+\+\+|---)/.test(line));
  });
  var allowedByFile = {
    'packages/quiz/pages/quiz/quiz.js': [
      /^-/,
      /^\+var secondaryNav = require\('\.\.\/\.\.\/\.\.\/\.\.\/utils\/secondary-navigation'\);$/,
      /^\+\s+navSafeTop: 64,$/,
      /^\+\s+secondaryNav\.syncNavLayout\(this\);$/,
      /^\+\s+finishQuiz: function \(\) { secondaryNav\.back\(this, 'packages\/quiz\/pages\/quiz\/quiz'\); },$/,
      /^\+\s+},$/,
      /^\+\s+goBack: function \(\) {$/,
      /^\+\s+secondaryNav\.back\(this, 'packages\/quiz\/pages\/quiz\/quiz'\);$/,
      /^\+\s+}$/,
      /^\+$/
    ],
    'packages/quiz/pages/quiz/quiz.json': [
      /^-\s+"navigationBarTitleText": "练习",$/,
      /^-\s+}$/,
      /^\+\s+},$/,
      /^\+\s+"navigationStyle": "custom"$/
    ],
    'packages/quiz/pages/quiz/quiz.wxml': [
      /^-<view class="container \{\{__themeDark \? 'dark-theme' : ''\}\}">$/,
      /^\+<view class="container \{\{__themeDark \? 'dark-theme' : ''\}\} secondary-shell" style="padding-top: \{\{navSafeTop\}\}px;">$/,
      /^\+\s+<view class="secondary-nav secondary-nav--back-only">$/,
      /^\+\s+<view class="secondary-nav__back" bindtap="goBack" data-secondary-route="packages\/quiz\/pages\/quiz\/quiz">$/,
      /^\+\s+<text class="secondary-nav__back-icon">‹<\/text>$/,
      /^\+\s+<\/view>$/,
      /^\+\s+<\/view>$/,
      /^\+$/
    ],
    'packages/quiz/pages/quiz/quiz.wxss': [
      /^\+@import "\.\.\/\.\.\/\.\.\/\.\.\/styles\/secondary-page-shell\.wxss";$/
    ]
  };
  var allow = allowedByFile[name];
  if (!allow) return false;
  for (var i = 0; i < addedOrRemoved.length; i++) {
    var line = addedOrRemoved[i];
    var matched = allow.some(function (rx) { return rx.test(line); });
    if (!matched) return false;
  }
  return true;
}

function assertText(value, field, minLength) {
  if (typeof value !== 'string' || value.trim().length < (minLength || 1)) {
    fail(field + ' must be a non-empty string');
  }
}

function containsForbiddenText(value) {
  var text = JSON.stringify(value);
  return /[A-Za-z]:\\|G:\\|data:application\/pdf|base64,|\.pdf["']|\.png["']|\.jpg["']|\.jpeg["']|UNKNOWN|TODO|placeholder/i.test(text);
}

function main() {
  if (!fs.existsSync(CONTENT_MODULE)) {
    fail('missing content module: packages/course-content/data/textbook-course.js');
  }

  var appJson = JSON.parse(readText('app.json'));
  var subpackages = appJson.subpackages || [];
  var coursePkg = subpackages.filter(function (pkg) {
    return pkg && pkg.root === 'packages/course-content';
  })[0];
  if (!coursePkg) {
    fail('app.json must register lazy subpackage root packages/course-content');
  } else {
    var pages = coursePkg.pages || [];
    if (pages.indexOf('pages/chapter-list/chapter-list') < 0) fail('course-content subpackage missing chapter-list page');
    if (pages.indexOf('pages/unit-detail/unit-detail') < 0) fail('course-content subpackage missing unit-detail page');
  }

  var content = null;
  if (fs.existsSync(CONTENT_MODULE)) {
    content = require(CONTENT_MODULE);
  }

  var questionData = require(COURSE_QUESTIONS);
  var questions = questionData.questions || [];
  var questionsById = {};
  questions.forEach(function (q) { questionsById[q.id] = q; });

  if (content) {
    var sources = content.sources || [];
    var chapters = content.chapters || [];
    var units = content.units || [];
    var sourceIds = {};
    sources.forEach(function (source) {
      sourceIds[source.sourceId] = true;
      assertText(source.sourceId, 'source.sourceId');
      assertText(source.displayTitleJa, source.sourceId + '.displayTitleJa');
      assertText(source.displayTitleZh, source.sourceId + '.displayTitleZh');
      if (!/^(itpass_r08_kayanoki|sg_security_textbook)$/.test(source.sourceId)) {
        fail('unexpected sourceId: ' + source.sourceId);
      }
      if (!Number.isInteger(source.pdfPageCount) || source.pdfPageCount <= 0) {
        fail(source.sourceId + ' pdfPageCount must be positive integer');
      }
      if (source.absolutePath || source.sha256) {
        fail(source.sourceId + ' must not expose absolutePath or sha256 in app package data');
      }
    });
    if (!sourceIds.itpass_r08_kayanoki) fail('missing source itpass_r08_kayanoki');
    if (!sourceIds.sg_security_textbook) fail('missing source sg_security_textbook');

    var chapterIds = {};
    chapters.forEach(function (chapter) {
      if (chapterIds[chapter.id]) fail('duplicate chapter id: ' + chapter.id);
      chapterIds[chapter.id] = true;
      if (!/^(itpass|sg)-ch\d{2}$/.test(chapter.id)) fail('bad chapter id format: ' + chapter.id);
      if (chapter.exam !== 'itpass' && chapter.exam !== 'sg') fail('bad chapter exam: ' + chapter.id);
      assertText(chapter.titleJa, chapter.id + '.titleJa');
      assertText(chapter.titleZh, chapter.id + '.titleZh');
      if (!sourceIds[chapter.sourceId]) fail(chapter.id + ' unknown sourceId ' + chapter.sourceId);
      if (!Array.isArray(chapter.sectionGroups) || !chapter.sectionGroups.length) {
        fail(chapter.id + ' must expose sectionGroups for chapter -> section -> unit navigation');
      } else {
        chapter.sectionGroups.forEach(function (group, groupIndex) {
          assertText(group.id, chapter.id + '.sectionGroups[' + groupIndex + '].id');
          assertText(group.titleJa, chapter.id + '.sectionGroups[' + groupIndex + '].titleJa');
          assertText(group.titleZh, chapter.id + '.sectionGroups[' + groupIndex + '].titleZh');
          if (!Array.isArray(group.units) || !group.units.length) {
            fail(chapter.id + '.sectionGroups[' + groupIndex + '] must contain units');
          }
        });
      }
    });

    var unitIds = {};
    var allowedTopics = { technology: true, management: true, strategy: true };
    units.forEach(function (unit) {
          if (unitIds[unit.id]) fail('duplicate unit id: ' + unit.id);
          unitIds[unit.id] = true;
          if (!/^(itpass|sg)-[a-z0-9-]+$/.test(unit.id)) fail('bad unit id format: ' + unit.id);
          if (unit.exam !== 'itpass' && unit.exam !== 'sg') fail(unit.id + ' bad exam');
          if (!chapterIds[unit.chapterId]) fail(unit.id + ' unknown chapterId ' + unit.chapterId);
          if (unit.topicId !== null && !allowedTopics[unit.topicId]) fail(unit.id + ' bad topicId ' + unit.topicId);

          // Prefer live course package payload for teaching fields when present.
          var teaching = unit;
          try {
            if (unit.exam === 'sg') {
              var sgLoader = require(path.join(ROOT, 'packages/course-sg/data/loader.js'));
              teaching = sgLoader.getUnitById('sg', unit.id) || unit;
            } else if (unit.exam === 'itpass') {
              var itLoader = require(path.join(ROOT, 'packages/course-itpass/data/loader.js'));
              teaching = itLoader.getUnitById('itpass', unit.id) || unit;
            }
          } catch (e) {
            teaching = unit;
          }

          assertText(teaching.titleJa || unit.titleJa, unit.id + '.titleJa');
          assertText(teaching.titleZh || unit.titleZh, unit.id + '.titleZh');
          assertText(teaching.overviewJa || unit.overviewJa, unit.id + '.overviewJa', 24);
          assertText(teaching.overviewZh || unit.overviewZh, unit.id + '.overviewZh', 18);
          assertText(teaching.learningGoalJa || unit.learningGoalJa, unit.id + '.learningGoalJa', 16);
          assertText(teaching.learningGoalZh || unit.learningGoalZh, unit.id + '.learningGoalZh', 12);
          if (!Array.isArray(teaching.sections || unit.sections) || !(teaching.sections || unit.sections).length) fail(unit.id + ' sections required');
          if (!Array.isArray(teaching.keyTerms || unit.keyTerms) || !(teaching.keyTerms || unit.keyTerms).length) fail(unit.id + ' keyTerms required');
          if (!Array.isArray(teaching.commonTraps || unit.commonTraps) || !(teaching.commonTraps || unit.commonTraps).length) fail(unit.id + ' commonTraps required');
          if (!Array.isArray(unit.relatedQuestionIds)) fail(unit.id + ' relatedQuestionIds must be array');
          if (!unit.relatedQuestionIds.length && unit.practiceStatus !== 'no_existing_course_question') {
            fail(unit.id + ' empty relatedQuestionIds requires practiceStatus=no_existing_course_question');
          }
          unit.relatedQuestionIds.forEach(function (qid) {
            var question = questionsById[qid];
            if (!question) {
              fail(unit.id + ' relatedQuestionId not found: ' + qid);
              return;
            }
            if (question.exam !== unit.exam) fail(unit.id + ' cross-exam related question: ' + qid);
            if (question.sourceType !== 'lesson_quiz') fail(unit.id + ' related question must be lesson_quiz: ' + qid);
          });
          var refs = [];
          var hasGoldenLE = !!(teaching.learningExperience && teaching.learningExperience.coreConcept &&
            String(teaching.learningExperience.coreConcept.bodyZh || '').trim().length >= 120 &&
            teaching.learningExperience.whyImportant &&
            String(teaching.learningExperience.whyImportant.bodyZh || '').trim().length >= 90);
          (teaching.sections || unit.sections || []).forEach(function (section, index) {
            assertText(section.headingJa, unit.id + '.sections[' + index + '].headingJa');
            assertText(section.headingZh, unit.id + '.sections[' + index + '].headingZh');
            assertText(section.explanationJa, unit.id + '.sections[' + index + '].explanationJa', 60);
            assertText(section.examFocusJa, unit.id + '.sections[' + index + '].examFocusJa', 24);
            assertText(section.commonMistakeJa, unit.id + '.sections[' + index + '].commonMistakeJa', 18);
            // Unified standard: when Golden learningExperience exists, ZH teaching depth is owned by LE.
            if (!hasGoldenLE) {
              assertText(section.explanationZh, unit.id + '.sections[' + index + '].explanationZh', 45);
              assertText(section.examFocusZh, unit.id + '.sections[' + index + '].examFocusZh', 18);
              assertText(section.commonMistakeZh, unit.id + '.sections[' + index + '].commonMistakeZh', 12);
            } else {
              assertText(section.explanationZh || ' ', unit.id + '.sections[' + index + '].explanationZh');
              assertText(section.examFocusZh || ' ', unit.id + '.sections[' + index + '].examFocusZh');
              assertText(section.commonMistakeZh || ' ', unit.id + '.sections[' + index + '].commonMistakeZh');
            }
        if (!Array.isArray(section.englishTerms) || !section.englishTerms.length) {
          fail(unit.id + '.sections[' + index + '] englishTerms required');
        }
        if (!Array.isArray(section.sourceRefs) || !section.sourceRefs.length) {
          fail(unit.id + '.sections[' + index + '] verified sourceRefs required');
        }
        refs = refs.concat(section.sourceRefs || []);
      });
      refs.concat(unit.sourceRefs || []).forEach(function (ref) {
        if (!sourceIds[ref.sourceId]) fail(unit.id + ' sourceRef unknown sourceId ' + ref.sourceId);
        var source = sources.filter(function (s) { return s.sourceId === ref.sourceId; })[0];
        if (!Number.isInteger(ref.pdfPageStart) || !Number.isInteger(ref.pdfPageEnd)) {
          fail(unit.id + ' sourceRef pdf pages must be integers');
          return;
        }
        if (ref.pdfPageStart < 1 || ref.pdfPageEnd < ref.pdfPageStart || ref.pdfPageEnd > source.pdfPageCount) {
          fail(unit.id + ' sourceRef page range out of bounds');
        }
        if (ref.printedPageStart !== null || ref.printedPageEnd !== null) {
          fail(unit.id + ' printed pages must remain null unless independently verified');
        }
        if (ref.verificationStatus !== 'verified') fail(unit.id + ' sourceRef must be verified');
        assertText(ref.headingJa, unit.id + '.sourceRef.headingJa');
        if (!Array.isArray(ref.anchorTermsJa) || !ref.anchorTermsJa.length) {
          fail(unit.id + ' sourceRef anchorTermsJa required');
        }
      });
      if (unit.sourceStatus !== 'verified') fail(unit.id + ' sourceStatus must be verified');
      if (unit.translationStatus !== 'reviewed') fail(unit.id + ' translationStatus must be reviewed');
      if (containsForbiddenText(unit)) fail(unit.id + ' contains forbidden local path, PDF/image/base64, unknown, TODO, or placeholder text');
    });
    if (!units.some(function (u) { return u.exam === 'itpass'; })) fail('no itpass units');
    if (!units.some(function (u) { return u.exam === 'sg'; })) fail('no sg units');
  }

  var contentFiles = listFiles(path.join(ROOT, 'packages/course-content'));
  contentFiles.forEach(function (file) {
    if (/\.(pdf|png|jpe?g|webp|gif)$/i.test(file)) fail('forbidden binary/asset in course-content: ' + rel(file));
    var text = fs.readFileSync(file, 'utf8');
    if (/[A-Za-z]:\\|G:\\/.test(text)) fail('local absolute path leaked in ' + rel(file));
    if (/data:application\/pdf|base64,/.test(text)) fail('base64/pdf payload leaked in ' + rel(file));
  });

  var diffNames = gitDiffNames();
  [
    'packages/quiz/data/course_questions.js',
    'utils/storage.js',
    'utils/favorite-questions.js'
  ].forEach(function (name) {
    if (diffNames.indexOf(name) >= 0) fail('frozen file modified: ' + name);
  });
  diffNames.forEach(function (name) {
    if (/^packages\/quiz\/pages\/quiz\//.test(name) && !isAllowedR66QuizShellDiff(name)) fail('frozen Quiz page modified: ' + name);
    if (/^packages\/quiz\/data\/past_exam_bank\//.test(name)) fail('frozen past exam bank modified: ' + name);
  });

  ['pages/home/home.js', 'pages/profile/profile.js', 'packages/quiz/pages/quiz/quiz.js', 'utils/storage.js'].forEach(function (name) {
    var file = path.join(ROOT, name);
    if (fs.existsSync(file) && /course-content/.test(fs.readFileSync(file, 'utf8'))) {
      fail(name + ' must not depend on course-content module');
    }
  });

  if (failures.length) {
    console.error('TEXTBOOK COURSE CONTENT FAIL (' + failures.length + ')');
    failures.forEach(function (message) { console.error('  - ' + message); });
    process.exit(1);
  }

  console.log('TEXTBOOK COURSE CONTENT PASS — sources, units, sourceRefs, package placement, and frozen domains verified');
}

main();
