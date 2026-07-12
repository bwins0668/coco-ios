#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

const EXPECTED = {
  gs1Hash: '8E67A0E37E107A5E102DE4CBBA50FBC94656CDB056B3474750A57B6714619199',
  gs2Hash: 'C6028928DB1BDC2D27D9B90A522D7AEFFF6B121F0851937AC43B3D6576656FCF',
  sourceUnitsStableHash: 'B9AABA9126A5AEABEF473B2F6B0B0F4EB5798F6CB4E3BF57FB929ECC7305D97A',
  coverageHash: '7492487749078466FB9EE4141F65DE8356D20E7F0220BD676C70A9BC4F57D930',
  appJson: 'DBA99CBFC78136EDF69DA8C91391EAC5CCA56279B57697CF25E6019980B6D3CE',
  secondaryNav: '5957801570A494BDB37D723BA9DD1AEF7C6B067EB363AFA85E26E529821FB415',
  javaManifest: '8EF9A1B49C22E0EAE7B8DA7924930E1D3AB93B19973AAB8C8129B7A521704F59'
};

const KHAKI = {
  accent: '#9A7B48',
  strong: '#765A2B',
  soft: '#F4EBD8',
  border: '#D8C39A',
  ink: '#4A3B25'
};

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

function read(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function sha256(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing protected file: ' + rel);
    return '';
  }
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').toUpperCase();
}

function listFiles(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) listFiles(full, out);
    else out.push(full);
  }
}

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing module: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function assertHash(root, rel, expected, label, errors) {
  const actual = sha256(root, rel, errors);
  if (actual && actual !== expected) {
    errors.push(label + ' hash changed: ' + rel + ' expected ' + expected + ' got ' + actual);
  }
}

function checkAppJsonPythonRoutes(root, errors) {
  const file = path.join(root, 'app.json');
  let app = {};
  try {
    app = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push('app.json invalid after Python shard routing update: ' + err.message);
    return;
  }
  const packages = app.subpackages || [];
  const legacy = packages.find((pkg) => pkg.root === 'packages/python-course');
  const shard = packages.find((pkg) => pkg.root === 'packages/python-course-foundations-b');
  if (!legacy) errors.push('app.json missing legacy packages/python-course subpackage');
  else {
    ['pages/home/home', 'pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      if (!(legacy.pages || []).includes(page)) errors.push('legacy Python subpackage lost page: ' + page);
    });
  }
  if (!shard) errors.push('app.json missing packages/python-course-foundations-b shard');
  else {
    ['pages/chapter/chapter', 'pages/lesson/lesson'].forEach((page) => {
      if (!(shard.pages || []).includes(page)) errors.push('Python foundations shard missing page: ' + page);
    });
  }
}

function assertIncludes(text, token, label, errors) {
  if (!text.includes(token)) errors.push(label + ' missing ' + token);
}

function assertRegex(text, re, label, errors) {
  if (!re.test(text)) errors.push(label + ' missing pattern ' + re);
}

function hexToRgb(hex) {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw.slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16)
  };
}

function isObviousBrandGreen(hex) {
  const { r, g, b } = hexToRgb(hex);
  return g > r + 25 && g > b + 20 && g > 120;
}

function checkImports(rel, text, allowed, errors) {
  const imports = Array.from(text.matchAll(/@import\s+["']([^"']+)["']/g)).map((m) => m[1]);
  for (const item of imports) {
    if (!allowed.includes(item)) {
      errors.push(rel + ' imports disallowed shared/global style: ' + item);
    }
  }
}

function checkKhakiCss(root, errors) {
  const home = read(root, 'packages/python-course/pages/home/home.wxss', errors);
  const chapter = read(root, 'packages/python-course/pages/chapter/chapter.wxss', errors);
  const lesson = read(root, 'packages/python-course/pages/lesson/lesson.wxss', errors);
  const packageFiles = [];
  listFiles(path.join(root, 'packages/python-course'), packageFiles);
  const packageStyleText = packageFiles
    .filter((file) => /\.(wxss|wxml|js)$/.test(file))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n');

  checkImports('home.wxss', home, ['../../../../styles/secondary-page-shell.wxss', '../../../../styles/tokens.wxss'], errors);
  checkImports('chapter.wxss', chapter, ['../home/home.wxss'], errors);
  checkImports('lesson.wxss', lesson, ['../../../../styles/secondary-page-shell.wxss', '../../../../styles/tokens.wxss'], errors);

  for (const [name, value] of Object.entries(KHAKI)) {
    assertIncludes(home, '--python-khaki-' + name + ':' + value, 'home khaki token', errors);
    assertIncludes(lesson, '--python-khaki-' + name + ':' + value, 'lesson khaki token', errors);
  }

  assertRegex(home, /\.pc-btn--primary\{[^}]*background:var\(--python-khaki-accent\)/, 'Python home primary button', errors);
  assertRegex(home, /\.pc-hero\{[^}]*border-top:5rpx solid var\(--python-khaki-accent\)/, 'Python home hero border', errors);
  assertRegex(home, /\.pc-stat\{[^}]*background:var\(--python-khaki-soft\)/, 'Python home stat background', errors);
  assertRegex(home, /\.pc-hero,\s*\.pc-section,\s*\.pc-empty\{[^}]*border:[^;}]*var\(--python-khaki-border\)/, 'Python home card border', errors);
  assertRegex(lesson, /\.pl-btn\{[^}]*background:var\(--python-khaki-accent\)/, 'Python lesson button', errors);
  assertRegex(lesson, /\.pl-card--handson\{[^}]*border-left:6rpx solid var\(--python-khaki-accent\)/, 'Python handson accent', errors);
  assertRegex(lesson, /\.python-output\{[^}]*background:var\(--python-khaki-soft\)/, 'Python output background', errors);
  assertRegex(lesson, /\.pl-card\{[^}]*border:[^;}]*var\(--python-khaki-border\)/, 'Python lesson card border', errors);

  const forbidden = ['#2f9e44', '#eaf7ee'];
  for (const token of forbidden) {
    if (packageStyleText.toLowerCase().includes(token)) errors.push('old Python green remains in package: ' + token);
  }
  const greenWords = packageStyleText.match(/\b(?:green|lime|emerald|cyan|teal)\b/gi) || [];
  if (greenWords.length) errors.push('brand green wording remains in Python package styles: ' + Array.from(new Set(greenWords)).join(', '));
  const hexes = Array.from(packageStyleText.matchAll(/#[0-9A-Fa-f]{3,8}/g)).map((m) => m[0]);
  const badGreens = Array.from(new Set(hexes.filter(isObviousBrandGreen)));
  if (badGreens.length) errors.push('obvious bright/grass/teal green remains in Python package: ' + badGreens.join(', '));
}

function checkRuntime(root, errors) {
  const loader = requireFresh(root, 'packages/python-course/utils/python-course-loader.js', errors);
  if (!loader) return;
  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const manifest = loader.getManifest();
  const firstRoute = loader.getFirstLessonRoute();
  const gs1 = loader.getLessonById('python-gs-ch01', 'python-0007-gs1-run-visible-output');
  const gs2 = loader.getLessonById('python-gs-ch01', 'python-0008-gs2-values-and-variables');
  if (!manifest || manifest.courseId !== 'python') errors.push('Python manifest not loaded');
  if (firstRoute !== '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output') {
    errors.push('GS1 direct-entry route changed');
  }
  if (!gs1 || !gs2) errors.push('GS1 or GS2 no longer resolves through loader');
  if (loader.getLessonById('python-gs-ch01', 'missing') !== null) errors.push('missing lesson must stay controlled null/error state');
  const visibleIds = manifest.chapters.flatMap((chapter) => chapter.sections.map((section) => section.lessonId));
  const sourceVisibleIds = sourceModule && sourceModule.pythonSourceManifest
    ? (sourceModule.pythonSourceManifest.courseLessons || []).filter((lesson) => lesson.visibility === 'visible').map((lesson) => lesson.courseLessonId)
    : [];
  if (visibleIds.length !== sourceVisibleIds.length || visibleIds.some((id) => !sourceVisibleIds.includes(id))) {
    errors.push('visible Python lesson list does not match source manifest visible set: ' + visibleIds.join(', '));
  }
}

function checkDocs(root, errors) {
  const contract = read(root, 'docs/python-course/04_python_khaki_visual_contract.md', errors);
  const card = read(root, 'docs/python-course/05_python_khaki_devtools_card.md', errors);
  for (const value of Object.values(KHAKI)) assertIncludes(contract, value, 'khaki visual contract doc', errors);
  for (const route of [
    '/packages/python-course/pages/home/home',
    '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output',
    '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables'
  ]) {
    assertIncludes(card, route, 'khaki DevTools card', errors);
  }
  assertIncludes(contract, 'Python 首页仍保持隐藏入口', 'khaki visual contract doc', errors);
  assertIncludes(card, '不能出现绿色品牌元素', 'khaki DevTools card', errors);
}

function checkProtectedPythonData(root, errors) {
  const chapter = requireFresh(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (chapter && Array.isArray(chapter.lessons)) {
    const gs1 = chapter.lessons.find((lesson) => lesson.lessonId === 'python-0007-gs1-run-visible-output');
    const gs2 = chapter.lessons.find((lesson) => lesson.lessonId === 'python-0008-gs2-values-and-variables');
    if (digest(gs1 || {}) !== EXPECTED.gs1Hash) errors.push('GS1 learner-visible lesson hash changed');
    if (digest(gs2 || {}) !== EXPECTED.gs2Hash) errors.push('GS2 learner-visible lesson hash changed');
  }
  const sourceModule = requireFresh(root, 'packages/python-course/data/python-source-manifest.js', errors);
  const sourceManifest = sourceModule && sourceModule.pythonSourceManifest;
  if (sourceManifest) {
    const stableSourceUnits = (sourceManifest.sourceUnits || []).map((u) => ({
      sourceUnitId: u.sourceUnitId,
      sourceOrder: u.sourceOrder,
      tocPath: u.tocPath,
      title: u.title,
      displayTitle: u.displayTitle,
      depth: u.depth,
      parentSourceUnitId: u.parentSourceUnitId,
      type: u.type
    }));
    if (digest(stableSourceUnits) !== EXPECTED.sourceUnitsStableHash) errors.push('sourceUnits stable IDs/order/tocPath drifted');
    if (digest(sourceManifest.coverage || {}) !== EXPECTED.coverageHash) errors.push('source coverage hash drifted');
  }
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkAppJsonPythonRoutes(root, errors);
  assertHash(root, 'utils/secondary-navigation.js', EXPECTED.secondaryNav, 'secondary navigation', errors);
  assertHash(root, 'packages/java-course/data/java-course-manifest.js', EXPECTED.javaManifest, 'Java course manifest', errors);

  checkProtectedPythonData(root, errors);
  checkKhakiCss(root, errors);
  checkRuntime(root, errors);
  checkDocs(root, errors);

  const lessonText = read(root, 'packages/python-course/data/chapters/python-gs-ch01.js', errors);
  if (/knowledgePoints/.test(lessonText)) errors.push('knowledgePoints must not exist in Python lesson data');

  if (errors.length || warnings.length) {
    console.error('[Python khaki visual contract] FAIL');
    for (const err of errors) console.error('ERROR:', err);
    for (const warn of warnings) console.error('WARNING:', warn);
    process.exit(1);
  }
  console.log('[Python khaki visual contract] PASS: 0 errors, 0 warnings');
}

main();
