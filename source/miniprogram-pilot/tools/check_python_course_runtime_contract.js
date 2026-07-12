const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { root: ROOT };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--root') {
      args.root = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function fail(errors, message) {
  errors.push(message);
}

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    fail(errors, 'missing file: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];
  const appText = read(root, 'app.json', errors);
  let app = {};
  try {
    app = appText ? JSON.parse(appText) : {};
  } catch (err) {
    fail(errors, 'app.json is not valid JSON: ' + err.message);
  }
  const pythonPkg = (app.subpackages || []).find((item) => item.root === 'packages/python-course');
  if (!pythonPkg) fail(errors, 'app.json missing packages/python-course subpackage');
  else {
    const pages = pythonPkg.pages || [];
    for (const page of ['pages/home/home', 'pages/chapter/chapter', 'pages/lesson/lesson']) {
      if (!pages.includes(page)) fail(errors, 'python-course subpackage missing page: ' + page);
    }
  }

  const packageFiles = [
    'data/python-course-manifest.js',
    'data/python-source-manifest.js',
    'data/chapters/python-gs-ch01.js',
    'utils/python-course-loader.js',
    'pages/home/home.js',
    'pages/home/home.wxml',
    'pages/home/home.wxss',
    'pages/home/home.json',
    'pages/chapter/chapter.js',
    'pages/chapter/chapter.wxml',
    'pages/chapter/chapter.wxss',
    'pages/chapter/chapter.json',
    'pages/lesson/lesson.js',
    'pages/lesson/lesson.wxml',
    'pages/lesson/lesson.wxss',
    'pages/lesson/lesson.json',
  ];
  for (const rel of packageFiles) read(root, 'packages/python-course/' + rel, errors);

  const homeWxml = read(root, 'packages/python-course/pages/home/home.wxml', errors);
  const chapterWxml = read(root, 'packages/python-course/pages/chapter/chapter.wxml', errors);
  const lessonWxml = read(root, 'packages/python-course/pages/lesson/lesson.wxml', errors);
  const lessonJs = read(root, 'packages/python-course/pages/lesson/lesson.js', errors);
  const lessonWxss = read(root, 'packages/python-course/pages/lesson/lesson.wxss', errors);
  const chapterJs = read(root, 'packages/python-course/pages/chapter/chapter.js', errors);
  const homeJs = read(root, 'packages/python-course/pages/home/home.js', errors);

  for (const [name, wxml] of [['home', homeWxml], ['chapter', chapterWxml], ['lesson', lessonWxml]]) {
    if (!/secondary-shell/.test(wxml)) fail(errors, name + ' page missing secondary shell');
    if (!/bindtap="goBack"/.test(wxml)) fail(errors, name + ' page missing goBack binding');
    if (/sourceRef|sourceUnitId|courseLessonId|spineHref|EPUB|z-library|1lib|z-lib/.test(wxml)) {
      fail(errors, name + ' page exposes internal source metadata');
    }
  }
  if (!/copyCode/.test(lessonJs) || !/setClipboardData/.test(lessonJs)) fail(errors, 'lesson page lacks copyCode support');
  if (!/expectedOutput/.test(lessonWxml)) fail(errors, 'lesson page must render expectedOutput');
  if (!/expectedObservation/.test(lessonWxml)) fail(errors, 'lesson page must render handson expectedObservation');
  if (!/Python/.test(lessonWxml)) fail(errors, 'lesson page must label Python code');
  if (!/overflow-x\s*:\s*auto/.test(lessonWxss) || !/max-width\s*:\s*100%/.test(lessonWxss)) fail(errors, 'lesson code block lacks horizontal containment');
  if (!/loadError/.test(lessonWxml) || !/返回/.test(lessonWxml)) fail(errors, 'lesson page lacks error state');
  if (!/loadError/.test(chapterWxml) || !/返回/.test(chapterWxml)) fail(errors, 'chapter page lacks error state');
  if (!/getChapterWithLessons/.test(chapterJs)) fail(errors, 'chapter page does not use loader');
  if (!/getFirstLessonRoute/.test(homeJs)) fail(errors, 'home page does not use first lesson route');

  const registry = requireFresh(root, 'utils/course-registry.js', errors);
  if (registry) {
    const pythonCourse = registry.getCourseById && registry.getCourseById('python');
    if (!pythonCourse) fail(errors, 'python missing from course registry');
    else if (pythonCourse.availability !== 'available') {
      fail(errors, 'python course registry must be available after P1 home release');
    }
  }
  const hostHomeWxml = read(root, 'pages/home/home.wxml', errors);
  if (/Python\s*\/\s*算法基础准备中|Python[^<\n\r]*准备中|准备中[^<\n\r]*Python/.test(hostHomeWxml)) {
    fail(errors, 'python course must not be labeled preparing on existing home navigation after P1 home release');
  }
  const nav = requireFresh(root, 'utils/navigation.js', errors);
  if (nav && nav.goCourseHome) {
    const captured = { navigateTo: [], toast: [] };
    global.wx = {
      navigateTo: function (opts) { captured.navigateTo.push(opts && opts.url); },
      switchTab: function () {},
      showToast: function (opts) { captured.toast.push(opts && opts.title); }
    };
    nav.goCourseHome('python');
    delete global.wx;
    if (captured.navigateTo[0] !== '/packages/python-course/pages/home/home') {
      fail(errors, 'python home release route must be /packages/python-course/pages/home/home');
    }
  }

  const loader = requireFresh(root, 'packages/python-course/utils/python-course-loader.js', errors);
  if (loader) {
    const manifest = loader.getManifest && loader.getManifest();
    if (!manifest || manifest.courseId !== 'python') fail(errors, 'loader cannot load Python manifest');
    if (!loader.getFirstLessonRoute || !/^\/packages\/python-course\/pages\/lesson\/lesson/.test(loader.getFirstLessonRoute())) {
      fail(errors, 'loader first lesson route missing or wrong');
    }
    if (!loader.getChapterWithLessons || !loader.getChapterWithLessons('python-gs-ch01')) fail(errors, 'loader cannot resolve visible chapter');
    if (!loader.getLessonById || !loader.getLessonById('python-gs-ch01', 'python-0007-gs1-run-visible-output')) {
      fail(errors, 'loader cannot resolve GS1');
    }
  }

  if (warnings.length) fail(errors, 'warnings are not allowed: ' + warnings.join('; '));
  if (errors.length) {
    console.error('[Python course runtime] FAIL');
    for (const err of errors) console.error('ERROR:', err);
    process.exit(1);
  }
  console.log('[Python course runtime] PASS: 0 errors, 0 warnings');
}

main();
