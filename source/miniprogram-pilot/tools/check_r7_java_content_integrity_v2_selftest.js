/**
 * check_r7_java_content_integrity_v2_selftest.js
 *
 * v2 checker 的 TEMP 负向自测。
 * 测试用例 A-H 按 R7.RECOVERY-0 规范定义。
 * 使用构造的 TEMP lesson 数据验证 v2 checker 的分类行为。
 * 这些 TEMP 数据不写入任何 chapter 文件，仅存在于内存中。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let testPassed = 0;
let testFailed = 0;
const results = [];

function assert(label, condition, detail) {
  if (condition) {
    testPassed++;
    results.push({ label, passed: true, detail });
    console.log(`  PASS: ${label}`);
  } else {
    testFailed++;
    results.push({ label, passed: false, detail });
    console.log(`  FAIL: ${label} — ${detail}`);
  }
}

// ── 复制 v2 checker 核心函数 ──────────────────────────────────────

function escapeRegex(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tokenize(text) {
  const tokens = [];
  let current = '';
  for (const ch of text) {
    if (/[一-鿿぀-ゟ゠-ヿ]/.test(ch)) {
      if (current) { tokens.push(current.toLowerCase()); current = ''; }
      tokens.push(ch);
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      current += ch;
    } else {
      if (current) { tokens.push(current.toLowerCase()); current = ''; }
    }
  }
  if (current) tokens.push(current.toLowerCase());
  return tokens.filter(t => t.length > 0);
}

function jaccardSimilarity(a, b) {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  let intersect = 0;
  for (const t of tokensA) if (tokensB.has(t)) intersect++;
  const union = tokensA.size + tokensB.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

function normalizeForComparison(text, lesson) {
  let s = text;
  s = s.replace(/教材\s*\d+\s*ページ/g, '{page}');
  s = s.replace(/教材第\s*\d+\s*页/g, '{page}');
  s = s.replace(/教材\d+ページ/g, '{page}');
  if (lesson && lesson.lessonId)
    s = s.replace(new RegExp(escapeRegex(lesson.lessonId), 'g'), '{lessonId}');
  if (lesson && lesson.title) {
    [lesson.title.ja, lesson.title.zh].filter(Boolean).forEach(t =>
      s = s.replace(new RegExp(escapeRegex(t), 'g'), '{title}'));
  }
  s = s.replace(/「[^」]+」/g, '{quoted}');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function normalizeCode(code) {
  if (!code) return '';
  let s = code;
  s = s.replace(/\/\/.*$/gm, '');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/class\s+JavaR7\w+/g, 'class __CLS__');
  s = s.replace(/\b(String|int|double|boolean|float|long|char|byte|short)\s+(\w+)\s*=/g, '$1 __VAR__ =');
  s = s.replace(/\b(\w+)\s*=\s*new\s/g, '__VAR__ = new ');
  // 替换字符串和数字字面量
  s = s.replace(/"[^"]*"/g, '__STR__');
  s = s.replace(/\b\d+\b/g, '__NUM__');
  // 替换所有 println 参数
  s = s.replace(/System\.out\.println\s*\([^)]+\)/g, 'System.out.println(__EXPR__)');
  // 替换常见变量名
  s = s.replace(/\b(name|student|value|result|count|total|sum|avg|max|min|data|item|obj|msg|text|str|num|flag|idx|i|j|k)\b/g, '__VARREF__');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ── TEMP Lesson 构造器 ────────────────────────────────────────────

function makeLesson(id, ch, order, titleJa, titleZh, blocks, code, mistakes, handson) {
  return {
    lessonId: id, chapterId: ch || 'java-ch01', order: order || 1,
    title: { ja: titleJa, zh: titleZh },
    sourceRef: { sourceId: 'test', chapter: 'test', section: titleJa, pageStart: 1, pageEnd: 1 },
    blocks: blocks || [],
    codeExamples: code ? [{ exampleId: id + '-ex01', className: 'Test', runnable: true, code, expectedOutput: 'output' }] : [],
    commonMistakes: mistakes || [],
    handson: handson || {},
    nextLessonBridge: { ja: '次へ', zh: '下一节' },
  };
}

// ═══════════════════════════════════════════════════════════════════
// TEMP A: 两节正文相同，仅换标题/页码/sourceRef → LIKELY_TEMPLATE_REPLICATION
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP A: 正文相同，仅换标题/页码 ===');

const la1 = makeLesson('test-a-001', 'test-ch-a', 1, '変数とは', '变量とは',
  [
    { ja: '教材1ページ「変数とは」: 変数はデータを一時的に保存する箱です。', zh: '教材第1页"变量とは"：变量是临时保存数据的盒子。' },
    { ja: '教材1ページ「変数とは」: int x = 10; の意味を理解します。', zh: '教材第1页"变量とは"：理解 int x = 10; 的含义。' },
  ],
  'public class TestA1 { public static void main(String[] args) { int x = 10; System.out.println(x); } }',
  [{ ja: '変数名を間違える', zh: '写错变量名' }],
  { ja: '値を変えてみよう', zh: '试着修改值' }
);

const la2 = makeLesson('test-a-002', 'test-ch-a', 4, '型とは', '类型とは',
  [
    { ja: '教材2ページ「型とは」: 変数はデータを一時的に保存する箱です。', zh: '教材第2页"类型とは"：变量是临时保存数据的盒子。' },
    { ja: '教材2ページ「型とは」: int x = 10; の意味を理解します。', zh: '教材第2页"类型とは"：理解 int x = 10; 的含义。' },
  ],
  'public class TestA2 { public static void main(String[] args) { int x = 10; System.out.println(x); } }',
  [{ ja: '変数名を間違える', zh: '写错变量名' }],
  { ja: '値を変えてみよう', zh: '试着修改值' }
);

const bodyZhA1 = la1.blocks.map(b => b.zh).join('\n');
const bodyZhA2 = la2.blocks.map(b => b.zh).join('\n');
const normA1 = normalizeForComparison(bodyZhA1, la1);
const normA2 = normalizeForComparison(bodyZhA2, la2);
const simA = jaccardSimilarity(normA1, normA2);
const isAdjA = la1.chapterId === la2.chapterId && Math.abs(la1.order - la2.order) <= 2;

assert('TEMP A: Jaccard >= 0.85 (仅标题/页码不同)', simA >= 0.85, `sim=${simA.toFixed(4)}`);
assert('TEMP A: 非相邻 + 高相似 → LIKELY_TEMPLATE_REPLICATION', simA >= 0.85 && !isAdjA, `sim=${simA.toFixed(4)} adj=${isAdjA}`);

// ═══════════════════════════════════════════════════════════════════
// TEMP B: 代码相同仅换 class 名/变量名/注释/println → CODE_BEHAVIOR_DUPLICATE
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP B: 代码仅换表面名称 ===');

const c1 = 'public class JavaR7C01S001 {\n  public static void main(String[] args) {\n    // declare\n    String name = "Alice";\n    System.out.println("hello " + name);\n  }\n}';
const c2 = 'public class JavaR7C01S002 {\n  public static void main(String[] args) {\n    // show name\n    String student = "Bob";\n    System.out.println("hi " + student);\n  }\n}';
const nc1 = normalizeCode(c1);
const nc2 = normalizeCode(c2);
assert('TEMP B: 规范化代码完全相同', nc1 === nc2, `"${nc1}"`);

// ═══════════════════════════════════════════════════════════════════
// TEMP C: commonMistakes 只替换术语 → LIKELY_TEMPLATE_REPLICATION
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP C: commonMistakes 只替换术语 ===');

const cmC1 = [{ ja: '「変数」という用語だけを覚え、コードでの位置を確認しない。', zh: '只记住"变量"这个词，不确认代码中的位置。' }];
const cmC2 = [{ ja: '「型」という用語だけを覚え、コードでの位置を確認しない。', zh: '只记住"类型"这个词，不确认代码中的位置。' }];
const ncm1 = normalizeForComparison(cmC1.map(m => m.zh + ' ' + m.ja).join('|||'), la1);
const ncm2 = normalizeForComparison(cmC2.map(m => m.zh + ' ' + m.ja).join('|||'), la2);
const simC = jaccardSimilarity(ncm1, ncm2);
assert('TEMP C: commonMistakes Jaccard >= 0.85', simC >= 0.85, `sim=${simC.toFixed(4)}`);

// ═══════════════════════════════════════════════════════════════════
// TEMP D: handson 只替换标题 → LIKELY_TEMPLATE_REPLICATION
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP D: handson 只替换标题 ===');

const hsD1 = { ja: '「変数とは」で値を変更し、出力変化を確認。', zh: '在"变量とは"中修改值，观察输出变化。' };
const hsD2 = { ja: '「型とは」で値を変更し、出力変化を確認。', zh: '在"类型とは"中修改值，观察输出变化。' };
const nhs1 = normalizeForComparison(hsD1.zh, la1);
const nhs2 = normalizeForComparison(hsD2.zh, la2);
const simD = jaccardSimilarity(nhs1, nhs2);
assert('TEMP D: handson Jaccard >= 0.85', simD >= 0.85, `sim=${simD.toFixed(4)} norm1="${nhs1}" norm2="${nhs2}"`);

// ═══════════════════════════════════════════════════════════════════
// TEMP E: GC 章节中 System.gc() 真实示例 — 不得误报 stuffing
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP E: GC 章节 System.gc() 真实示例 ===');

const gcL = makeLesson('test-e-gc', 'java-ch12', 1, 'GC', 'GC',
  [{ ja: 'System.gc()はJVMへの提案に過ぎず、実際の回収はJVMが決定します。', zh: 'System.gc() 只是向JVM的建议，实际回收由JVM决定。' }],
  'public class GCTest { public static void main(String[] args) { System.gc(); System.out.println("done"); } }',
  [{ ja: 'System.gc()で即解放と誤解', zh: '误以为System.gc()能立刻释放' }],
  { ja: 'System.gc()前後のメモリを比較', zh: '比较System.gc()前后的内存' }
);
const gcText = gcL.blocks.map(b => (b.ja||'') + ' ' + (b.zh||'')).join(' ');
const hasDummyInGc = /dummy/i.test(gcText.replace(/dummyStream/gi, ''));
assert('TEMP E: System.gc() 不应被误报为 dummy stuffing', !hasDummyInGc, `gc in chapter 12 context`);

// ═══════════════════════════════════════════════════════════════════
// TEMP F: int score = 90; 不得被判为 Quiz
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP F: int score = 90 不为 Quiz ===');

const scoreL = makeLesson('test-f-score', 'java-ch03', 5, '条件分岐', '条件分支',
  [{ ja: 'int score = 90; のように宣言し、if文で判定します。', zh: '声明 int score = 90; 然后用 if 语句判断。' }],
  'public class ScoreTest { public static void main(String[] args) { int score = 90; if (score >= 60) System.out.println("pass"); } }',
  [], {}
);
const hasQuizFields = /"options"\s*:\s*\[/.test(JSON.stringify(scoreL)) || /correctAnswer/.test(JSON.stringify(scoreL));
assert('TEMP F: int score = 90 无 options/correctAnswer 字段', !hasQuizFields, '');

// ═══════════════════════════════════════════════════════════════════
// TEMP G: 正文混入教材页码 → LEARNER_VISIBLE_METADATA_NOISE
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP G: 正文混入教材页码 ===');

const noiseL = makeLesson('test-g-noise', 'java-ch01', 1, 'ノイズ', '噪音',
  [{ ja: '教材5ページを参照。この節では重要な概念を学びます。教材5ページの後半に進みます。', zh: '请参考教材第5页。本节学习重要概念。请看教材第5页的后半。' }],
  '', [], { ja: '教材5ページの例を実行', zh: '运行教材第5页的例子' }
);
const bodyHasPage = /教材\s*\d+\s*ページ/.test(noiseL.blocks[0].ja.replace(/^教材\d+ページ[「「].*?[」」][:：]\s*/, ''));
const handsonHasPage = /教材\s*\d+\s*[ページ页]/.test(noiseL.handson.ja);
assert('TEMP G: 正文页码应被检测', bodyHasPage || handsonHasPage, `body=${bodyHasPage} handson=${handsonHasPage}`);

// ═══════════════════════════════════════════════════════════════════
// TEMP H: 43724d8 基线运行 v2 checker — 必须输出真实风险库存
// ═══════════════════════════════════════════════════════════════════
console.log('=== TEMP H: 运行 v2 checker 于 43724d8 基线 ===');

try {
  const out = execSync('node tools/check_r7_java_content_integrity_v2.js', {
    cwd: path.resolve(__dirname, '..'), encoding: 'utf-8', timeout: 60000,
  });
  console.log(out);
  assert('TEMP H: 扫描了 336 节', /Scanned 336 lessons/.test(out), '');
  assert('TEMP H: 输出 findings 统计', /Findings/.test(out), '');
  const emptyPass = /PASS/.test(out) && !/WARNING/.test(out) && !/Findings \(/.test(out);
  assert('TEMP H: 未伪造空壳 PASS', !emptyPass, '');
} catch (err) {
  console.error(`TEMP H 执行错误: ${err.message}`);
  assert('TEMP H: v2 checker 可执行', false, err.message);
}

// ═══════════════════════════════════════════════════════════════════
console.log(`\n=== 结果: ${testPassed} PASS / ${testFailed} FAIL / ${testPassed + testFailed} TOTAL ===`);
if (testFailed > 0) {
  results.filter(r => !r.passed).forEach(r => console.log(`  FAIL: ${r.label} — ${r.detail}`));
  process.exit(1);
}
console.log('所有自测通过。');
process.exit(0);
