const fs = require('fs');
const path = require('path');

let ROOT = path.resolve(__dirname, '..');
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i] === '--root') {
    if (!process.argv[i + 1]) {
      console.error('[R7 Java originality] FAIL: --root requires a value');
      process.exit(1);
    }
    ROOT = path.resolve(process.argv[i + 1]);
    i++;
  }
}

const MANIFEST = path.join(ROOT, 'packages/java-course/data/java-course-manifest.js');
const BANNED = [
  /TODO/i,
  /TBD/i,
  /待补充/,
  /内容省略/,
  /説明省略/,
  /同教材/,
  /同上/,
  /后续再写/,
  /後で説明/,
  /自行理解/,
  /^略$/,
  /あとで/
];

const errors = [];
const warnings = [];

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function addError(message) {
  errors.push(message);
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function pairText(value) {
  return [text(value && value.ja), text(value && value.zh)].filter(Boolean).join('\n');
}

function readModule(file) {
  if (!fs.existsSync(file)) {
    addError('missing module: ' + rel(file));
    return null;
  }
  delete require.cache[require.resolve(file)];
  return require(file);
}

function loadLessons() {
  const manifestModule = readModule(MANIFEST);
  const manifest = manifestModule && manifestModule.manifest;
  if (!manifest || !Array.isArray(manifest.chapters)) {
    addError('missing manifest chapters');
    return { manifest: { chapters: [] }, lessons: [] };
  }
  const lessons = [];
  for (const chapter of manifest.chapters) {
    const shard = path.join(ROOT, chapter.packageRoot || 'packages/java-course', 'data/chapters', chapter.shard);
    const mod = readModule(shard);
    for (const lesson of (mod && mod.lessons) || []) {
      lessons.push({ chapter, lesson, shard });
    }
  }
  return { manifest, lessons };
}

function normalizeUnicode(value) {
  return text(value).normalize('NFKC').replace(/\u2424/g, '\n');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeTeaching(value, lesson) {
  let s = normalizeUnicode(value).toLowerCase();
  const candidates = [
    lesson.title && lesson.title.ja,
    lesson.title && lesson.title.zh,
    lesson.sourceRef && lesson.sourceRef.section,
    lesson.sourceRef && lesson.sourceRef.chapter
  ].filter(Boolean);
  for (const candidate of candidates) {
    s = s.replace(new RegExp(escapeRegExp(normalizeUnicode(candidate).toLowerCase()), 'g'), '{concept}');
  }
  return s
    .replace(/教材第\s*\d+\s*页/g, '教材第{page}页')
    .replace(/第\s*\d+\s*章/g, '第{chapter}章')
    .replace(/[0-9０-９]+/g, '{num}')
    .replace(/[「」『』"“”'`]/g, '')
    .replace(/[、。，．,.!?！？:：;；（）()［\]\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeExactBody(value) {
  return normalizeUnicode(value)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function firstN(value, max) {
  const s = String(value || '').replace(/\s+/g, ' ').trim();
  return s.length > max ? s.slice(0, max - 1) + '...' : s;
}

function collectDuplicates(rows, minCount) {
  const map = new Map();
  for (const row of rows) {
    if (!row.key || row.key.length < 30) continue;
    if (!map.has(row.key)) map.set(row.key, []);
    map.get(row.key).push(row);
  }
  return [...map.entries()]
    .filter(([, items]) => items.length >= minCount)
    .sort((a, b) => b[1].length - a[1].length);
}

function tokenSet(value) {
  return new Set(normalizeTeaching(value, { title: {}, sourceRef: {} }).split(' ').filter((x) => x.length > 1));
}

function jaccard(a, b) {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;
  let hit = 0;
  for (const token of left) if (right.has(token)) hit++;
  return hit / (left.size + right.size - hit);
}

function normalizeCodeExactShape(code) {
  let s = String(code || '').normalize('NFKC');
  const strings = [];
  s = s.replace(/"(?:\\.|[^"\\])*"/g, (match) => {
    const marker = '\u0001' + strings.length + '\u0002';
    strings.push(match);
    return marker;
  });
  s = s.replace(/\bJavaR7C\d+S\d+\b/g, 'CLASS_NAME');
  const keep = new Set([
    'abstract', 'ArrayList', 'Arrays', 'boolean', 'break', 'BufferedImage', 'BufferedReader',
    'ByteArrayOutputStream', 'case', 'catch', 'char', 'class', 'continue', 'default', 'double',
    'else', 'enum', 'Exception', 'extends', 'false', 'final', 'finally', 'float', 'for', 'HashMap',
    'HashSet', 'if', 'implements', 'import', 'int', 'interface', 'Integer', 'java', 'javax',
    'JButton', 'JLabel', 'JPanel', 'List', 'long', 'main', 'Map', 'Math', 'new', 'NumberFormatException',
    'CLASS_NAME', 'Object', 'out', 'Override', 'Path', 'Point', 'print', 'printf', 'println', 'private', 'protected',
    'public', 'return', 'Set', 'short', 'static', 'String', 'StringReader', 'super', 'switch',
    'System', 'this', 'Thread', 'throw', 'throws', 'true', 'try', 'void', 'while'
  ]);
  const ids = new Map();
  let id = 0;
  s = s.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g, (name) => {
    if (keep.has(name)) return name;
    if (!ids.has(name)) ids.set(name, 'ID' + (++id));
    return ids.get(name);
  });
  s = s.replace(/\u0001(\d+)\u0002/g, (_, index) => strings[Number(index)]);
  return s.replace(/\s+/g, ' ').trim();
}

function codeLines(code) {
  return String(code || '').replace(/\r\n/g, '\n').split('\n');
}

function lineContains(code, line, snippet) {
  const lines = codeLines(code);
  const index = Number(line) - 1;
  return Number.isInteger(index) && index >= 0 && index < lines.length && lines[index].includes(snippet);
}

function titleBlob(lesson) {
  return [
    lesson.title && lesson.title.ja,
    lesson.title && lesson.title.zh,
    lesson.sourceRef && lesson.sourceRef.section,
    lesson.sourceRef && lesson.sourceRef.chapter
  ].filter(Boolean).join(' ');
}

function expectedCodePatterns(lesson) {
  const blob = titleBlob(lesson);
  const patterns = [];
  if (/switch/.test(blob)) patterns.push(/\bswitch\b/);
  if (/if|条件/.test(blob)) patterns.push(/\bif\b|\?/);
  if (/for/.test(blob)) patterns.push(/\bfor\b/);
  if (/while/.test(blob)) patterns.push(/\bwhile\b/);
  if (/配列|数组|array/i.test(blob)) patterns.push(/\[\]|Arrays|ArrayList/);
  if (/メソッド|方法|戻り値|引数|参数|シグネチャ|オーバーロード|重载/.test(blob)) patterns.push(/\bstatic\b[\s\S]*\w+\s*\([^)]*\)\s*\{/);
  if (/コンストラクタ|构造/.test(blob)) patterns.push(/\bnew\b[\s\S]*\w+\s*\(/);
  if (/継承|继承|extends|ポリモーフ|多态|オーバーライド|重写|super/.test(blob)) patterns.push(/\bextends\b|\bsuper\b|@Override/);
  if (/抽象|abstract/.test(blob)) patterns.push(/\babstract\b/);
  if (/インタフェース|接口|interface/.test(blob)) patterns.push(/\binterface\b|\bimplements\b/);
  if (/private|public|protected|アクセス|访问|修飾|修饰/.test(blob)) patterns.push(/\bprivate\b|\bpublic\b|\bprotected\b/);
  if (/static|クラス変数|类变量|スタティック/.test(blob)) patterns.push(/\bstatic\b/);
  if (/final|定数|常量/.test(blob)) patterns.push(/\bfinal\b/);
  if (/String|文字列|字符串/.test(blob)) patterns.push(/\bString\b/);
  if (/パッケージ|包|API|import|Math/.test(blob)) patterns.push(/\bimport\b|Math\.|java\./);
  if (/標準出|出力|输出|エスケープ/.test(blob)) patterns.push(/System\.out\.print|System\.out\.println|\\n/);
  if (/例外|异常|try|catch|finally|throw/.test(blob)) patterns.push(/\btry\b|\bcatch\b|\bthrow\b|\bthrows\b/);
  if (/スレッド|线程|Thread|Runnable|同期/.test(blob)) patterns.push(/\bThread\b|\bRunnable\b|synchronized/);
  if (/コレクション|集合|リスト|マップ|セット|List|Map|Set|ArrayList|HashMap|HashSet/.test(blob)) patterns.push(/\bList\b|\bMap\b|\bSet\b|ArrayList|HashMap|HashSet/);
  if (/ジェネリクス|泛型/.test(blob)) patterns.push(/<\s*String\s*>|<\s*Integer\s*>|<\s*\w+\s*>/);
  if (/ラムダ|lambda|匿名|関数型/.test(blob)) patterns.push(/->|\bRunnable\b/);
  if (/ストリーム|Stream 流|stream/i.test(blob)) patterns.push(/\.stream\(\)|Stream/);
  if (/入出力|⼊出⼒|ファイル|文件|バッファ|シリアライ|フォルダ|Reader|Writer/.test(blob)) patterns.push(/Reader|Writer|Files|Path|StringReader|ByteArrayOutputStream/);
  if (/GUI|Swing|フレーム|ボタン|JButton|パネル|レイアウト|イベント|コンポーネント|组件|布局/.test(blob)) patterns.push(/JButton|JPanel|javax\.swing|BorderLayout|FlowLayout/);
  if (/Graphics|グラフィックス|描画|マウス|Graphics2D|座標|直線|坐标/.test(blob)) patterns.push(/Graphics2D|BufferedImage|Point|Mouse/);
  if (/ネットワーク|网络|Socket|ServerSocket|IP|ポート|サーバ|クライアント/.test(blob)) patterns.push(/Socket|ServerSocket|InetSocketAddress|URI/);
  if (!patterns.length) patterns.push(/\bclass\b[\s\S]*\bmain\b/);
  return patterns;
}

function checkBanned(value, label) {
  const s = text(value);
  for (const rx of BANNED) {
    if (rx.test(s)) addError(label + ' contains placeholder/banned wording: ' + firstN(s, 90));
  }
}

function checkPair(obj, label) {
  if (!obj || !text(obj.ja) || !text(obj.zh)) addError(label + ' missing ja/zh');
  checkBanned(obj && obj.ja, label + '.ja');
  checkBanned(obj && obj.zh, label + '.zh');
}

function uniqueCount(rows) {
  return new Set(rows.map((row) => row.key).filter(Boolean)).size;
}

const { manifest, lessons } = loadLessons();
const byId = new Map(lessons.map((row) => [row.lesson.lessonId, row]));
const orderedLessons = lessons.slice().sort((a, b) => {
  const ca = a.chapter.chapterOrder || 0;
  const cb = b.chapter.chapterOrder || 0;
  return ca === cb ? (a.lesson.order || 0) - (b.lesson.order || 0) : ca - cb;
});
const nextById = new Map();
for (let i = 0; i < orderedLessons.length - 1; i++) {
  nextById.set(orderedLessons[i].lesson.lessonId, orderedLessons[i + 1].lesson);
}

if (lessons.length !== 336) addError('expected 336 lessons, found ' + lessons.length);

const titleRows = [];
const jaRows = [];
const zhRows = [];
const handsonRows = [];
const mistakeRows = [];
const codeExactRows = [];
const codeShapeRows = [];
const nearDuplicateCandidates = [];
const boundaryCandidates = [];

for (const row of lessons) {
  const { lesson, chapter } = row;
  const id = lesson.lessonId || '(missing lessonId)';
  const label = id + ' (' + (chapter.chapterId || 'unknown chapter') + ')';

  checkPair(lesson.title, label + ' title');
  checkPair(lesson.handson, label + ' handson');
  checkPair(lesson.summary, label + ' summary');
  checkPair(lesson.nextLessonBridge, label + ' nextLessonBridge');

  if (!lesson.sourceRef || !lesson.sourceRef.sourceId || !lesson.sourceRef.chapter || !lesson.sourceRef.section) {
    addError(label + ' missing sourceRef');
  }
  if (!Array.isArray(lesson.blocks) || lesson.blocks.length < 4) addError(label + ' needs 4+ explanation blocks');
  if (!Array.isArray(lesson.commonMistakes) || lesson.commonMistakes.length < 2) addError(label + ' needs 2+ common mistakes');
  if (!Array.isArray(lesson.codeExamples) || !lesson.codeExamples.some((example) => example && example.runnable)) {
    addError(label + ' needs runnable Java example');
  }

  titleRows.push({ key: normalizeTeaching(pairText(lesson.title), lesson), id });
  const jaCore = (lesson.blocks || []).map((block, index) => {
    checkPair(block && block.title, label + ' block ' + index + ' title');
    checkBanned(block && block.ja, label + ' block ' + index + '.ja');
    checkBanned(block && block.zh, label + ' block ' + index + '.zh');
    if (!text(block && block.ja) || !text(block && block.zh)) addError(label + ' block ' + index + ' missing ja/zh body');
    return text(block && block.ja);
  }).join('\n');
  const zhCore = (lesson.blocks || []).map((block) => text(block && block.zh)).join('\n');
  jaRows.push({ key: normalizeExactBody(jaCore), id, value: jaCore });
  zhRows.push({ key: normalizeExactBody(zhCore), id, value: zhCore });

  for (const item of lesson.objectives || []) checkPair(item, label + ' objective');
  for (const item of lesson.prerequisites || []) checkPair(item, label + ' prerequisite');
  for (const item of lesson.commonMistakes || []) {
    checkPair(item, label + ' commonMistake');
    mistakeRows.push({ key: normalizeExactBody(pairText(item)), id, value: pairText(item) });
  }
  handsonRows.push({ key: normalizeExactBody(pairText(lesson.handson)), id, value: pairText(lesson.handson) });

  for (const term of lesson.terms || []) {
    if (!text(term.en) || !text(term.ja) || !text(term.zh) || !text(term.explanationJa) || !text(term.explanationZh)) {
      addError(label + ' incomplete term: ' + JSON.stringify(term));
    }
    checkBanned(term && term.explanationJa, label + ' term explanationJa');
    checkBanned(term && term.explanationZh, label + ' term explanationZh');
  }

  const next = nextById.get(id);
  if (next) {
    const bridge = pairText(lesson.nextLessonBridge);
    const nextTitles = [next.title && next.title.ja, next.title && next.title.zh].filter(Boolean);
    if (!nextTitles.some((title) => bridge.includes(title))) {
      addError(label + ' nextLessonBridge does not name next lesson: ' + firstN(bridge, 120));
    }
  }

  for (const example of lesson.codeExamples || []) {
    if (!example || !example.runnable) continue;
    const code = text(example.code);
    if (!example.exampleId || !example.className || !code || !text(example.expectedOutput)) {
      addError(label + ' incomplete runnable example');
      continue;
    }
    codeExactRows.push({ key: code, id: id + '/' + example.exampleId, value: code });
    codeShapeRows.push({ key: normalizeCodeExactShape(code), id: id + '/' + example.exampleId, value: code });
    if (!expectedCodePatterns(lesson).some((rx) => rx.test(code))) {
      addError(label + ' runnable code appears mismatched with lesson concept: ' + firstN(titleBlob(lesson), 90));
    }
    if (!Array.isArray(example.lineNotes) || example.lineNotes.length < 3) {
      addError(label + ' runnable example needs 3+ lineNotes');
    }
    for (const note of example.lineNotes || []) {
      checkPair(note, label + ' lineNote');
      if (!Number.isInteger(note.line) || !text(note.snippet)) {
        addError(label + ' lineNote missing line/snippet metadata');
      } else if (!lineContains(code, note.line, note.snippet)) {
        addError(label + ' lineNote snippet not found at line ' + note.line + ': ' + note.snippet);
      }
    }
  }
}

for (let i = 0; i < lessons.length; i++) {
  for (let j = i + 1; j < lessons.length; j++) {
    const left = zhRows[i];
    const right = zhRows[j];
    if (!left || !right || !left.value || !right.value) continue;
    const score = jaccard(left.value, right.value);
    if (score >= 0.94) {
      nearDuplicateCandidates.push({ left: left.id, right: right.id, score });
    } else if (score >= 0.9 && nearDuplicateCandidates.length < 30) {
      boundaryCandidates.push({ left: left.id, right: right.id, score });
    }
  }
}

const titleDuplicates = collectDuplicates(titleRows, 2);
const jaDuplicates = collectDuplicates(jaRows, 2);
const zhDuplicates = collectDuplicates(zhRows, 2);
const handsonDuplicates = collectDuplicates(handsonRows, 2);
const mistakeDuplicates = collectDuplicates(mistakeRows, 8);
const codeDuplicates = collectDuplicates(codeExactRows, 2);
const codeShapeDuplicates = collectDuplicates(codeShapeRows, 2);

for (const [key, items] of jaDuplicates) addError('core Japanese explanation repeated ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const [key, items] of zhDuplicates) addError('core Chinese explanation repeated ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const [key, items] of handsonDuplicates) addError('handson repeated ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const [key, items] of mistakeDuplicates) addError('commonMistakes generic/repeated ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const [key, items] of codeDuplicates) addError('runnable Java code exactly repeated ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const [key, items] of codeShapeDuplicates) addError('runnable Java code differs only by names ' + items.length + ' times: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 100));
for (const candidate of nearDuplicateCandidates.slice(0, 20)) {
  warnings.push('near-duplicate core Chinese explanation score=' + candidate.score.toFixed(2) + ': ' + candidate.left + ' <-> ' + candidate.right);
}

for (const [key, items] of titleDuplicates.slice(0, 20)) {
  warnings.push('title duplicate candidate ' + items.length + 'x: ' + items.map((x) => x.id).slice(0, 8).join(', ') + ' :: ' + firstN(key, 80));
}
for (const candidate of boundaryCandidates.slice(0, 20)) {
  warnings.push('boundary near-duplicate candidate score=' + candidate.score.toFixed(2) + ': ' + candidate.left + ' <-> ' + candidate.right);
}

console.log('[R7 Java originality] lesson count:', lessons.length);
console.log('[R7 Java originality] core JA unique:', uniqueCount(jaRows), '/', lessons.length);
console.log('[R7 Java originality] core ZH unique:', uniqueCount(zhRows), '/', lessons.length);
console.log('[R7 Java originality] title duplicate candidates:', titleDuplicates.length);
console.log('[R7 Java originality] near duplicate candidates:', nearDuplicateCandidates.length);
console.log('[R7 Java originality] code exact duplicate candidates:', codeDuplicates.length);
console.log('[R7 Java originality] code shape duplicate candidates:', codeShapeDuplicates.length);
console.log('[R7 Java originality] commonMistakes duplicate candidates:', mistakeDuplicates.length);
console.log('[R7 Java originality] handson duplicate candidates:', handsonDuplicates.length);
console.log('[R7 Java originality] vague/boundary manual review candidates:', boundaryCandidates.length);

for (const warning of warnings.slice(0, 25)) {
  console.log('[R7 Java originality] REVIEW:', warning);
}

if (errors.length) {
  for (const error of errors.slice(0, 80)) {
    console.error('[R7 Java originality] FAIL:', error);
  }
  if (errors.length > 80) console.error('[R7 Java originality] FAIL: +' + (errors.length - 80) + ' more errors');
  process.exit(1);
}

console.log('[R7 Java originality] PASS: originality and pedagogical contract satisfied');
