#!/usr/bin/env node
'use strict';

/*
 * tools/check_design_tokens.js
 * Quiet Paper · R6 · P0 设计令牌与基础组件静态契约检查。
 *
 * 不执行小程序代码、不做真机/渲染验收，只做以下静态校验：
 *   1. styles/tokens.wxss 内权威 --qp-* 令牌全部存在且取值精确匹配；
 *   2. 令牌在 :host 与 page 两个上下文块均声明，且两块取值完全一致（防漂移）；
 *   3. 不存在权威清单之外的 --qp-* 令牌（未授权令牌）；
 *   4. 不存在任何深色主题令牌 / prefers-color-scheme（夜间模式未冻结）；
 *   5. 四个基础组件 (ui-button / option-item / section-divider / status-badge)
 *      的 js / json / wxml / wxss 必要文件齐全；
 *   6. 四个组件均通过同一机制 @import 引用 styles/tokens.wxss（统一可见性）；
 *   7. 令牌文件与组件源码不触发 content compliance 禁词；
 *   8. 上述新增文件无明显空白字符问题（CRLF/CR、行尾空白、制表符缩进、文末多余空行）。
 *
 * 退出码：0 全部通过；1 任一断言失败。
 */

var fs = require('fs');
var path = require('path');
var compliance = require('./check_content_compliance');

var ROOT = path.resolve(__dirname, '..');
var TOKENS_REL = 'styles/tokens.wxss';

/* -------------------------------------------------------------------------
 * 权威令牌清单（R6 Claude Design 交接包真源；取值来自本轮设计交接）。
 * 顺序无关；校验按"名 → 值"精确匹配。
 * ------------------------------------------------------------------------- */
var AUTHORITATIVE_TOKENS = {
  // colors
  '--qp-color-canvas': '#F2EDE0',
  '--qp-color-surface': '#FFFDF5',
  '--qp-color-surface-muted': '#F4F3EF',
  '--qp-color-fill-warm': '#E8DFC8',
  '--qp-color-ink': '#1A1410',
  '--qp-color-text-secondary': '#6F6B65',
  '--qp-color-text-tertiary': '#8A7060',
  '--qp-color-text-quaternary': '#8A8680',
  '--qp-color-text-ghost': '#C9C4BD',
  '--qp-color-text-phantom': '#D8CEB8',
  '--qp-color-line': 'rgba(33,31,28,.08)',
  '--qp-color-line-strong': 'rgba(33,31,28,.14)',
  '--qp-color-primary': '#37418A',
  '--qp-color-primary-pressed': '#2C3676',
  '--qp-color-primary-soft': '#ECEEF6',
  '--qp-color-editorial': '#C5123A',
  '--qp-color-success': '#4E8A5E',
  '--qp-color-success-soft': '#EAF1EC',
  '--qp-color-danger': '#BE5750',
  '--qp-color-danger-soft': '#F7ECEB',
  '--qp-color-warning-soft': '#FBF1E9',
  '--qp-color-disabled-bg': 'rgba(33,31,28,.10)',
  '--qp-color-disabled-text': '#C9C4BD',
  // typography
  '--qp-font-size-masthead': '68rpx',
  '--qp-font-size-display': '80rpx',
  '--qp-font-size-page-title': '56rpx',
  '--qp-font-size-section-title': '34rpx',
  '--qp-font-size-body': '30rpx',
  '--qp-font-size-caption': '26rpx',
  '--qp-font-size-label': '22rpx',
  '--qp-font-weight-regular': '400',
  '--qp-font-weight-semibold': '600',
  '--qp-line-height-tight': '1.25',
  '--qp-line-height-normal': '1.5',
  '--qp-line-height-relaxed': '1.7',
  // spacing
  '--qp-space-1': '8rpx',
  '--qp-space-2': '16rpx',
  '--qp-space-3': '24rpx',
  '--qp-space-4': '32rpx',
  '--qp-space-5': '40rpx',
  '--qp-space-6': '48rpx',
  '--qp-space-8': '64rpx',
  // shape and control
  '--qp-radius-tag': '10rpx',
  '--qp-radius-sm': '20rpx',
  '--qp-radius-md': '24rpx',
  '--qp-radius-lg': '32rpx',
  '--qp-border-width': '2rpx',
  '--qp-control-height': '88rpx',
  // data
  '--qp-font-family-data': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
};

/* 必须同时声明令牌的两个上下文块选择器（组件隔离应对 + 页面级采纳）。 */
var REQUIRED_CONTEXTS = [':host', 'page'];

/* 四个基础组件及其必要文件后缀。 */
var COMPONENTS = ['ui-button', 'option-item', 'section-divider', 'status-badge'];
var COMPONENT_EXTS = ['js', 'json', 'wxml', 'wxss'];

/* 组件 wxss 引用令牌的统一机制（路径相对组件目录）。 */
var IMPORT_DIRECTIVE = '@import "../../styles/tokens.wxss";';

/* content compliance 清单复用通用检查器，避免在本脚本复制敏感内容。 */
var FORBIDDEN_WORDS = compliance.FORBIDDEN_WORDS;

/* 深色主题相关禁止出现的标记（夜间模式未冻结）。 */
var DARK_THEME_MARKERS = [
  'prefers-color-scheme',
  'data-theme',
  '.theme-dark',
  '.dark',
  '@media (prefers'
];

var failures = [];
var passes = [];

function fail(msg) { failures.push(msg); }
function pass(msg) { passes.push(msg); }

function readFileSafe(rel) {
  try {
    return fs.readFileSync(path.join(ROOT, rel), 'utf8');
  } catch (e) {
    return null;
  }
}

function fileExists(rel) {
  try {
    return fs.statSync(path.join(ROOT, rel)).isFile();
  } catch (e) {
    return false;
  }
}

/* 剥离 CSS 块注释，避免注释中的说明文字（如"本文件不含 prefers-color-scheme"）
 * 误命中深色标记检测。剥离时以等长空白替换，保持行号不变以便定位。 */
function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, function (m) {
    return m.replace(/[^\n]/g, ' ');
  });
}
function extractBlock(text, selector) {
  // 选择器后允许空白，随后是 '{' ... 匹配到对应 '}'。
  var idx = 0;
  while (true) {
    var at = text.indexOf(selector, idx);
    if (at < 0) return null;
    // 确保 selector 是独立 token（前面是行首/空白，后面是空白或 '{'）。
    var before = at === 0 ? '\n' : text.charAt(at - 1);
    var afterPos = at + selector.length;
    var after = text.charAt(afterPos);
    var boundaryOk = /\s/.test(before) || before === '\n' || before === '}' || before === ';';
    var nextOk = /\s/.test(after) || after === '{';
    if (boundaryOk && nextOk) {
      var brace = text.indexOf('{', afterPos);
      if (brace < 0) return null;
      // 简单括号配平（令牌块内无嵌套 {}，足够）。
      var depth = 0;
      for (var i = brace; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) return text.substring(brace + 1, i);
        }
      }
      return null;
    }
    idx = at + selector.length;
  }
}

/* 解析一个块内的所有 --qp-* 声明，返回 { name: value }。 */
function parseTokens(blockText) {
  var map = {};
  var re = /(--qp-[a-z0-9-]+)\s*:\s*([^;]+);/g;
  var m;
  while ((m = re.exec(blockText)) !== null) {
    map[m[1]] = m[2].trim();
  }
  return map;
}

/* ============================ 1. 令牌文件存在 ============================ */
var tokensText = readFileSafe(TOKENS_REL);
if (tokensText === null) {
  fail(TOKENS_REL + ' 不存在或不可读');
} else {
  pass(TOKENS_REL + ' 存在');

  /* ===================== 2. 深色主题标记检查（先于解析） =====================
   * 在剥离注释后的有效 CSS 上检测，避免注释说明文字误报。 */
  var tokensCss = stripCssComments(tokensText);
  var darkHit = [];
  for (var d = 0; d < DARK_THEME_MARKERS.length; d++) {
    if (tokensCss.indexOf(DARK_THEME_MARKERS[d]) >= 0) darkHit.push(DARK_THEME_MARKERS[d]);
  }
  // 令牌名层面的深色后缀（如 --qp-color-*-dark / --qp-*-night）
  var darkNameRe = /--qp-[a-z0-9-]*(?:-dark|-night|-dusk)\b/g;
  var dn;
  while ((dn = darkNameRe.exec(tokensCss)) !== null) darkHit.push(dn[0]);
  if (darkHit.length > 0) {
    fail(TOKENS_REL + ' 含深色主题标记（夜间模式未冻结）：' + darkHit.join(', '));
  } else {
    pass('无深色主题令牌 / prefers-color-scheme 标记');
  }

  /* ===================== 3. 两个上下文块解析与一致性 ===================== */
  var contextMaps = {};
  for (var c = 0; c < REQUIRED_CONTEXTS.length; c++) {
    var sel = REQUIRED_CONTEXTS[c];
    var block = extractBlock(tokensText, sel);
    if (block === null) {
      fail(TOKENS_REL + ' 缺少 ' + sel + '{} 令牌块');
      continue;
    }
    contextMaps[sel] = parseTokens(block);
    pass('解析到 ' + sel + '{} 令牌块（' + Object.keys(contextMaps[sel]).length + ' 个 --qp-* 声明）');
  }

  /* ===================== 4. 权威令牌精确匹配（逐块） ===================== */
  Object.keys(contextMaps).forEach(function (sel) {
    var map = contextMaps[sel];
    var authNames = Object.keys(AUTHORITATIVE_TOKENS);
    // 4a. 缺失或值不符
    for (var i = 0; i < authNames.length; i++) {
      var name = authNames[i];
      if (!(name in map)) {
        fail(sel + '{} 缺令牌 ' + name);
      } else if (map[name] !== AUTHORITATIVE_TOKENS[name]) {
        fail(sel + '{} 令牌 ' + name + ' 取值不符：期望 "' + AUTHORITATIVE_TOKENS[name] + '"，实际 "' + map[name] + '"');
      }
    }
    // 4b. 未授权令牌（出现但不在权威清单）
    var actualNames = Object.keys(map);
    for (var j = 0; j < actualNames.length; j++) {
      if (!(actualNames[j] in AUTHORITATIVE_TOKENS)) {
        fail(sel + '{} 出现未授权令牌 ' + actualNames[j]);
      }
    }
  });

  // 4c. 计数精确：两块都恰好等于权威数量时给出明确通过
  var expectedCount = Object.keys(AUTHORITATIVE_TOKENS).length;
  REQUIRED_CONTEXTS.forEach(function (sel) {
    if (contextMaps[sel] && Object.keys(contextMaps[sel]).length === expectedCount) {
      pass(sel + '{} 令牌数量精确为 ' + expectedCount + ' 个');
    }
  });

  /* ===================== 5. 两块取值一致（防漂移） ===================== */
  if (contextMaps[':host'] && contextMaps['page']) {
    var hostMap = contextMaps[':host'];
    var pageMap = contextMaps['page'];
    var allNames = {};
    Object.keys(hostMap).forEach(function (n) { allNames[n] = true; });
    Object.keys(pageMap).forEach(function (n) { allNames[n] = true; });
    var drift = [];
    Object.keys(allNames).forEach(function (n) {
      if (hostMap[n] !== pageMap[n]) {
        drift.push(n + ' (:host="' + hostMap[n] + '" vs page="' + pageMap[n] + '")');
      }
    });
    if (drift.length > 0) {
      fail(':host 与 page 令牌漂移：' + drift.join('; '));
    } else {
      pass(':host 与 page 两块令牌取值完全一致');
    }
  }
}

/* ===================== 6. 四组件必要文件齐全 ===================== */
COMPONENTS.forEach(function (name) {
  COMPONENT_EXTS.forEach(function (ext) {
    var rel = 'components/' + name + '/' + name + '.' + ext;
    if (fileExists(rel)) {
      pass('组件文件存在 ' + rel);
    } else {
      fail('组件缺文件 ' + rel);
    }
  });
});

/* ===================== 7. 四组件统一 @import 引用令牌 ===================== */
COMPONENTS.forEach(function (name) {
  var rel = 'components/' + name + '/' + name + '.wxss';
  var text = readFileSafe(rel);
  if (text === null) {
    fail(rel + ' 不可读，无法校验令牌引用');
    return;
  }
  if (text.indexOf(IMPORT_DIRECTIVE) >= 0) {
    pass(name + ' 通过统一机制引用令牌（' + IMPORT_DIRECTIVE + '）');
  } else {
    fail(name + ' 未通过统一机制引用令牌，缺少：' + IMPORT_DIRECTIVE);
  }
  // 禁止把令牌定义复制进组件（组件 wxss 不应自定义 --qp-* 取值）
  var localDef = /--qp-[a-z0-9-]+\s*:/.test(text);
  if (localDef) {
    fail(name + ' 组件 wxss 内出现 --qp-* 令牌定义（应只 @import，不得复制令牌）');
  }
});

/* ===================== 8. content compliance 禁词（令牌 + 组件源码） =====================
 * 扫描"内容文件"（令牌 + 四组件）是否触发禁词。
 * 本检查脚本自身不纳入禁词扫描：其 FORBIDDEN_WORDS 数组是检测逻辑而非内容违规，
 * 与 tools/check_content_compliance.js 将自身列入 SKIP_FILES 的处理完全同理。 */
var contentTargets = [TOKENS_REL];
COMPONENTS.forEach(function (name) {
  COMPONENT_EXTS.forEach(function (ext) {
    contentTargets.push('components/' + name + '/' + name + '.' + ext);
  });
});

var complianceHit = [];
contentTargets.forEach(function (rel) {
  var text = readFileSafe(rel);
  if (text === null) return;
  FORBIDDEN_WORDS.forEach(function (word) {
    if (text.indexOf(word) >= 0) {
      complianceHit.push(rel + ' -> "' + word + '"');
    }
  });
});
if (complianceHit.length > 0) {
  fail('P0 文件触发 content compliance 禁词：' + complianceHit.join('; '));
} else {
  pass('P0 内容文件（令牌 + 四组件）无 content compliance 禁词');
}

/* ===================== 9. 空白字符检查（全部新增文件，含本脚本） ===================== */
var whitespaceTargets = contentTargets.concat(['tools/check_design_tokens.js']);
var whitespaceHit = [];
whitespaceTargets.forEach(function (rel) {
  // 用 latin1 读原始字节，精确判断 \r 与行尾空白。
  var raw;
  try {
    raw = fs.readFileSync(path.join(ROOT, rel), 'latin1');
  } catch (e) {
    return;
  }
  if (raw.indexOf('\r') >= 0) {
    whitespaceHit.push(rel + ' 含 CR（非纯 LF 换行）');
  }
  var lines = raw.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    // 去掉可能残留的 \r 再判断行尾空白
    var l = line.replace(/\r$/, '');
    if (/[ \t]$/.test(l)) {
      whitespaceHit.push(rel + ':' + (i + 1) + ' 行尾有空白');
    }
    if (/^\t/.test(l) || /^( *)\t/.test(l)) {
      whitespaceHit.push(rel + ':' + (i + 1) + ' 使用制表符缩进');
    }
  }
  // 文末多余空行：恰好以单个 \n 结尾、且末尾无连续空行
  if (raw.length > 0) {
    if (!/\n$/.test(raw)) {
      whitespaceHit.push(rel + ' 文件未以换行结尾');
    } else if (/\n\s*\n$/.test(raw)) {
      whitespaceHit.push(rel + ' 文件末尾有多余空行');
    }
  }
});
if (whitespaceHit.length > 0) {
  fail('空白字符问题：' + whitespaceHit.join('; '));
} else {
  pass('P0 新增文件无空白字符问题（纯 LF、无行尾空白、无 Tab 缩进、单一文末换行）');
}

/* ============================== 输出 ============================== */
console.log('=== Quiet Paper · R6 Design Tokens Contract Check ===');
console.log('Root: ' + ROOT + '\n');
passes.forEach(function (p) { console.log('  PASS  ' + p); });
if (failures.length > 0) {
  console.log('');
  failures.forEach(function (f) { console.log('  FAIL  ' + f); });
  console.log('\n[FAIL] design tokens contract: ' + failures.length + ' 项不通过');
  process.exit(1);
}
console.log('\n[PASS] design tokens contract: 全部 ' + passes.length + ' 项通过');
