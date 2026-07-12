#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

const EXPECTED = {
  java: {
    chapterCount: 19,
    sectionCount: 336,
    titleJa: 'Java入門 / Java実践',
    titleZh: 'Java 基础 / Java 实践',
    route: '/packages/java-course/pages/home/home'
  },
  python: {
    route: '/packages/python-course/pages/home/home',
    pathLabelJa: 'Python入門 / リスト / 条件分岐',
    pathLabelZh: 'Python 入门 / 列表 / 条件分支',
    visibleLessonIds: [
      'python-0007-gs1-run-visible-output',
      'python-0008-gs2-values-and-variables',
      'python-0009-7d37969c-第-3-章-列表简介',
      'python-0010-921b265b-第-4-章-操作列表',
      'python-0011-5c80c609-第-5-章-if语句'
    ]
  },
  protectedHashes: {
    'app.json': 'F69F0C9DD61A6D071F570AC40D913057B987388707234F3DFD9CDFC533812B9E',
    'app.wxss': 'A9AA0AEA331B1796D9F822EB1FF9FD9C2028F3AC7F8C683E58F989D1EB40A2E5',
    'styles/tokens.wxss': 'E6F43B1E98EA0F1C9C21A670A4CBE2B36CBCEEA9E94B85A853EE0D7305EA5836',
    'styles/secondary-page-shell.wxss': 'A7A1608E6C8D412F0A3F1D3BAF585B91A7183696F450FCA73762D632E9017C1E',
    'utils/secondary-navigation.js': '5957801570A494BDB37D723BA9DD1AEF7C6B067EB363AFA85E26E529821FB415',
    'utils/course-registry.js': '17785E23C9A3EF1071E07A1F20E9774C6621706381872335F4105ADBAF259196',
    'utils/python-public-course-summary.js': 'F508CD811F59511F504D74CE36444D4959CEA517740565D8169EB759B8EA86C1',
    'packages/java-course/data/java-course-manifest.js': '8EF9A1B49C22E0EAE7B8DA7924930E1D3AB93B19973AAB8C8129B7A521704F59'
  }
};

const EXPECTED_COURSES = {
  itpass: {
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'IT Passport',
    availability: 'available',
    description: 'ITパスポート試験対策 · 按年度模拟练习'
  },
  sg: {
    kind: 'exam',
    courseKind: 'certification',
    displayName: 'SG 信息安全',
    availability: 'available',
    description: '情報セキュリティマネジメント · 专项强化'
  },
  mos365: {
    kind: 'certification',
    courseKind: 'legacy-practice',
    displayName: 'MOS 365',
    availability: 'unresolved',
    description: 'MOS 365 认证考试 — 入口待确认'
  },
  python: {
    kind: 'language',
    courseKind: 'learning',
    displayName: 'Python',
    availability: 'available',
    description: 'Python 编程学习 — GS1 / GS2 已开放'
  },
  java: {
    kind: 'language',
    courseKind: 'learning',
    displayName: 'Java',
    availability: 'planned',
    description: 'Java 编程学习 — 后续课程'
  },
  algorithm: {
    kind: 'fundamentals',
    courseKind: 'learning',
    displayName: '算法基础',
    availability: 'planned',
    description: '算法与数据结构 — 后续课程'
  }
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

function requireFresh(root, rel, errors) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push('missing module: ' + rel);
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function assert(condition, message, errors) {
  if (!condition) errors.push(message);
}

function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function getClassAttr(attrs) {
  const match = /\bclass\s*=\s*"([^"]*)"/.exec(attrs) || /\bclass\s*=\s*'([^']*)'/.exec(attrs);
  return match ? match[1] : '';
}

function selectorBody(css, className) {
  const re = new RegExp('\\.' + className.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\}', 'm');
  const match = re.exec(css);
  return match ? match[1] : '';
}

function selectorHasDisplayNone(css, className) {
  return /display\s*:\s*none\s*;?/i.test(selectorBody(css, className));
}

function checkBeginnerBadgeVisibility(homeWxml, homeWxss, errors) {
  const javaHidden = selectorHasDisplayNone(homeWxss, 'r7-java-course-entry__pill');
  const pythonHidden = selectorHasDisplayNone(homeWxss, 'r8-python-course-entry__pill');
  const hiddenClasses = {
    'r7-java-course-entry__pill': javaHidden,
    'r8-python-course-entry__pill': pythonHidden
  };
  const source = stripComments(homeWxml);
  const re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g;
  let match;
  const visible = [];
  let javaSeen = false;
  let pythonSeen = false;
  while ((match = re.exec(source)) !== null) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    if (!/面向零基础/.test(body)) continue;
    const classAttr = getClassAttr(attrs);
    const classes = classAttr.split(/\s+/).filter(Boolean);
    if (classes.includes('r7-java-course-entry__pill')) javaSeen = true;
    if (classes.includes('r8-python-course-entry__pill')) pythonSeen = true;
    const isHidden = classes.some((name) => hiddenClasses[name]);
    if (!isHidden) visible.push('<text class="' + classAttr + '">' + body.trim() + '</text>');
  }
  assert(javaSeen, 'Java beginner badge source no longer matches expected direct badge node', errors);
  assert(pythonSeen, 'Python beginner badge source no longer matches expected direct badge node', errors);
  assert(javaHidden, 'Java beginner badge node exists but is still renderable; r7-java-course-entry__pill must be display:none', errors);
  assert(pythonHidden, 'Python beginner badge node exists but is still renderable; r8-python-course-entry__pill must be display:none', errors);
  if (visible.length) {
    errors.push('visible beginner badge text remains in home WXML: ' + visible.join(' | '));
  }
}

function checkHomeCardContracts(root, errors) {
  const homeJs = read(root, 'pages/home/home.js', errors);
  const homeWxml = read(root, 'pages/home/home.wxml', errors);
  const homeWxss = read(root, 'pages/home/home.wxss', errors);

  checkBeginnerBadgeVisibility(homeWxml, homeWxss, errors);

  assert(/var JAVA_COURSE_SUMMARY\s*=\s*\{[\s\S]*chapterCount:\s*19[\s\S]*sectionCount:\s*336[\s\S]*titleJa:\s*'Java入門 \/ Java実践'[\s\S]*titleZh:\s*'Java 基础 \/ Java 实践'/m.test(homeJs), 'Java summary constants drifted from 057e342 baseline', errors);
  assert(homeJs.includes("url: '/packages/java-course/pages/home/home'"), 'Java home route changed in pages/home/home.js', errors);
  assert(homeWxml.includes('<text class="r6-course-strip__abbr">Ja</text>'), 'Java card abbr Ja changed or missing', errors);
  assert(homeWxml.includes('<text class="r6-course-strip__name">Java</text>'), 'Java card title changed or missing', errors);
  assert(homeWxml.includes('{{javaCourseSummary.titleJa}} / {{javaCourseSummary.titleZh}}'), 'Java path binding changed or missing', errors);
  assert(homeWxml.includes('{{javaCourseSummary.chapterCount}} 章节 · {{javaCourseSummary.sectionCount}} 小节 · 双语讲解'), 'Java chapter/section/bilingual meta binding changed or missing', errors);
  assert(/\.r7-java-course-entry\s*\{[\s\S]*border-left:\s*5rpx solid var\(--qp-color-primary\)[\s\S]*background:\s*var\(--qp-color-primary-soft\)/m.test(homeWxss), 'Java blue card accent/background changed', errors);

  assert(homeJs.includes("require('../../utils/python-public-course-summary')"), 'home.js must use main-package Python public summary', errors);
  assert(!/require\s*\(\s*['"][^'"]*packages\/python-course/.test(homeJs), 'home.js directly requires Python subpackage', errors);
  assert(/visibleLessonIds\s*\?\s*PythonPublicSummary\.visibleLessonIds\.length\s*:\s*0/.test(homeJs), 'Python sectionCount must remain dynamic from visibleLessonIds.length', errors);
  assert(!/sectionCount:\s*5/.test(homeJs), 'Python sectionCount must not be hardcoded to 5', errors);
  assert(homeWxml.includes('<text class="r6-course-strip__abbr">Py</text>'), 'Python card abbr Py changed or missing', errors);
  assert(homeWxml.includes('<text class="r6-course-strip__name">Python</text>'), 'Python card title changed or missing', errors);
  assert(homeWxml.includes('bindtap="goToCourse" data-course-id="python"'), 'Python card route binding changed or missing', errors);
  assert(homeWxml.includes('{{pythonCourseSummary.titleJa}} / {{pythonCourseSummary.titleZh}}'), 'Python path binding changed or missing', errors);
  assert(homeWxml.includes('{{pythonCourseSummary.sectionCount}} 小节 · 双语讲解'), 'Python dynamic count/bilingual meta binding changed or missing', errors);
  assert(/\.r8-python-course-entry\s*\{[\s\S]*border-left:\s*5rpx solid #9A7B48[\s\S]*background:\s*#F4EBD8/m.test(homeWxss), 'Python khaki card accent/background changed', errors);
  assert(/\.r8-python-course-entry__pill\s*\{[\s\S]*background:\s*#FFF9F0[\s\S]*color:\s*#765A2B/m.test(homeWxss), 'Python khaki pill colors changed', errors);

  assert(/cc-exam-row__badge">准备中<\/text>/.test(homeWxml), 'MOS/unresolved exam preparing badge renderer changed', errors);
  assert(homeWxml.includes('<view class="r6-course-strip__badge">算法基础准备中</view>'), 'Algorithm preparing badge changed or missing', errors);
  assert(/Java\s*\/\s*Python\s*已开放/.test(homeWxml), 'course section meta changed', errors);
  assert(!/knowledgePoints/.test(homeJs + '\n' + homeWxml), 'home files must not introduce knowledgePoints', errors);
}

function checkRegistryAndSummary(root, errors) {
  const registry = requireFresh(root, 'utils/course-registry.js', errors);
  const summary = requireFresh(root, 'utils/python-public-course-summary.js', errors);
  if (!registry || !summary) return;

  Object.keys(EXPECTED_COURSES).forEach((id) => {
    const actual = registry.getCourseById(id);
    assert(!!actual, 'missing course registry entry: ' + id, errors);
    if (!actual) return;
    Object.keys(EXPECTED_COURSES[id]).forEach((key) => {
      assert(actual[key] === EXPECTED_COURSES[id][key], id + ' ' + key + ' changed: expected ' + EXPECTED_COURSES[id][key] + ' got ' + actual[key], errors);
    });
  });

  assert(Array.isArray(summary.visibleLessonIds), 'Python public summary missing visibleLessonIds array', errors);
  assert(JSON.stringify(summary.visibleLessonIds || []) === JSON.stringify(EXPECTED.python.visibleLessonIds), 'Python public visibleLessonIds changed', errors);
  assert(summary.pathLabelJa === EXPECTED.python.pathLabelJa, 'Python pathLabelJa changed', errors);
  assert(summary.pathLabelZh === EXPECTED.python.pathLabelZh, 'Python pathLabelZh changed', errors);
  assert(summary.homeRoute === EXPECTED.python.route, 'Python homeRoute changed', errors);
  assert(summary.bilingualLabel === '双语讲解', 'Python bilingual label changed', errors);
}

function checkNavigation(root, errors) {
  const navText = read(root, 'utils/navigation.js', errors);
  assert(navText.includes("navigateToSafe('/packages/python-course/pages/home/home')"), 'Python goCourseHome route changed', errors);
  assert(navText.includes("navigateToSafe('/pages/course/course?courseId=' + courseId)"), 'generic course shell route changed', errors);

  const nav = requireFresh(root, 'utils/navigation.js', errors);
  if (!nav) return;
  const captured = { navigateTo: [], switchTab: [], toast: [] };
  global.wx = {
    navigateTo: function (opts) { captured.navigateTo.push(opts && opts.url); },
    switchTab: function (opts) { captured.switchTab.push(opts && opts.url); },
    showToast: function (opts) { captured.toast.push(opts && opts.title); }
  };
  try {
    nav.goCourseHome('python');
    nav.goCourseHome('java');
  } finally {
    delete global.wx;
  }
  assert(captured.navigateTo[0] === EXPECTED.python.route, 'Python runtime navigation route changed: ' + (captured.navigateTo[0] || '<none>'), errors);
  assert(captured.navigateTo[1] === '/pages/course/course?courseId=java', 'Java generic course route changed: ' + (captured.navigateTo[1] || '<none>'), errors);
}

function resolveModulePath(root, fromFile, request) {
  if (!request.startsWith('.')) return null;
  const base = path.resolve(path.dirname(fromFile), request);
  const candidates = [base, base + '.js', path.join(base, 'index.js')];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return candidates[1];
}

function checkMainPackageRequireGraph(root, errors) {
  const visited = new Set();
  const stack = [path.join(root, 'pages/home/home.js')];
  while (stack.length) {
    const file = path.resolve(stack.pop());
    if (visited.has(file)) continue;
    visited.add(file);
    const rel = path.relative(root, file).replace(/\\/g, '/');
    if (rel.startsWith('packages/python-course/')) {
      errors.push('home require graph enters Python subpackage: ' + rel);
      continue;
    }
    if (!fs.existsSync(file)) {
      errors.push('unresolved home require graph module: ' + rel);
      continue;
    }
    const text = fs.readFileSync(file, 'utf8');
    const re = /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let match;
    while ((match = re.exec(text)) !== null) {
      const resolved = resolveModulePath(root, file, match[1]);
      if (resolved) stack.push(resolved);
    }
  }
}

function checkProtectedFiles(root, errors) {
  Object.keys(EXPECTED.protectedHashes).forEach((rel) => {
    const actual = sha256(root, rel, errors);
    if (actual && actual !== EXPECTED.protectedHashes[rel]) {
      errors.push('protected file changed: ' + rel + ' expected ' + EXPECTED.protectedHashes[rel] + ' got ' + actual);
    }
  });
}

function main() {
  const { root } = parseArgs(process.argv);
  const errors = [];
  const warnings = [];

  checkProtectedFiles(root, errors);
  checkHomeCardContracts(root, errors);
  checkRegistryAndSummary(root, errors);
  checkNavigation(root, errors);
  checkMainPackageRequireGraph(root, errors);

  if (errors.length || warnings.length) {
    console.error('[Home beginner badge removal contract] FAIL');
    errors.forEach((err) => console.error('ERROR:', err));
    warnings.forEach((warn) => console.error('WARNING:', warn));
    process.exit(1);
  }
  console.log('[Home beginner badge removal contract] PASS: 0 errors, 0 warnings');
  console.log('Java/Python beginner badges are not rendered; routes, counts, colors, and preparing states are preserved.');
}

main();
