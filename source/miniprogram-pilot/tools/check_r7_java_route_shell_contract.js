const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const JAVA_ROOTS = ['packages/java-course', 'packages/java-course-a', 'packages/java-course-b', 'packages/java-course-c'];
const pages = JAVA_ROOTS.flatMap((root) => {
  const list = root === 'packages/java-course'
    ? [['home', 'pages/home/home'], ['chapter', 'pages/chapter/chapter'], ['lesson', 'pages/lesson/lesson']]
    : [['chapter', 'pages/chapter/chapter'], ['lesson', 'pages/lesson/lesson']];
  return list.map((item) => [root + ':' + item[0], root, item[1]]);
});

function fail(message) {
  console.error('[R7 Java route shell] FAIL:', message);
  process.exit(1);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) fail('missing file: ' + rel);
  return fs.readFileSync(file, 'utf8');
}

for (const [name, root, base] of pages) {
  const relBase = root + '/' + base;
  const json = JSON.parse(read(relBase + '.json'));
  const js = read(relBase + '.js');
  const wxml = read(relBase + '.wxml');
  const wxss = read(relBase + '.wxss');
  if (json.navigationStyle !== 'custom') fail(name + ' page must use custom navigation');
  if (!/secondary-shell|jc-page/.test(wxml)) fail(name + ' page missing secondary shell root');
  if (!/bindtap="goBack"/.test(wxml) || !/goBack\s*:\s*function/.test(js)) fail(name + ' page missing return handler');
  if (!/72rpx/.test(wxss) && !/secondary-page-shell/.test(wxss)) fail(name + ' page lacks 72rpx back control evidence');
  if (/\.[^{]*back[^{]*\{[^}]*width\s*:\s*100%/s.test(wxss)) fail(name + ' back control may be full width');
  if (!/overflow-x\s*:\s*hidden|overflow-x\s*:\s*auto/.test(wxss)) fail(name + ' lacks horizontal overflow containment');
}

for (const root of JAVA_ROOTS) {
  const lessonJs = read(root + '/pages/lesson/lesson.js');
  const lessonWxml = read(root + '/pages/lesson/lesson.wxml');
  const lessonWxss = read(root + '/pages/lesson/lesson.wxss');
  if (!/copyCode/.test(lessonJs) || !/setClipboardData/.test(lessonJs)) fail(root + ' lesson page lacks copy code support');
  if (!/expectedOutput/.test(lessonWxml)) fail(root + ' lesson page does not render expected output');
  if (!/java-code/.test(lessonWxml) || !/Java/.test(lessonWxml)) fail(root + ' lesson page does not label Java code');
  if (!/overflow-x\s*:\s*auto/.test(lessonWxss) || !/max-width\s*:\s*100%/.test(lessonWxss)) fail(root + ' code block can overflow page');
}

console.log('[R7 Java route shell] PASS:', pages.length, 'pages checked');
