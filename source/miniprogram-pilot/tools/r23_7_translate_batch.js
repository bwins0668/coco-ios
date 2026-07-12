#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ARTIFACTS = path.join(ROOT, 'artifacts');
const MANIFEST = path.join(ARTIFACTS, 'r23_7_canonical_manifest.jsonl');
const VISUAL_INVENTORY = path.join(ARTIFACTS, 'r23_6a2_image_question_inventory.json');
const BATCH_ROOT = path.join(ARTIFACTS, 'r23_7_batches');
const CHECKPOINT_ROOT = path.join(ARTIFACTS, 'r23_7_checkpoints');
const CACHE_PATH = path.join(ARTIFACTS, 'r23_7_translation_cache.json');

const PACKAGES = [
  'quiz-itpass-1',
  'quiz-itpass-2',
  'quiz-itpass-3',
  'quiz-itpass-4',
  'quiz-itpass-5',
  'quiz-sg-1',
  'quiz-sg-2'
];
const OPTION_KEYS = ['A', 'B', 'C', 'D'];
const SYMBOL_ONLY = /^[アイウエオカキクケコ]$/;
const STATEMENT_COMBINATION = /^[a-d](?:[，,、]\s*[a-d])*$/i;

function parseArgs(argv) {
  const args = { batchSize: 50, package: '', batchId: '', startAfter: '', dryRun: false };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--package') args.package = argv[++i];
    else if (arg === '--batch-size') args.batchSize = Number(argv[++i]);
    else if (arg === '--batch-id') args.batchId = argv[++i];
    else if (arg === '--start-after') args.startAfter = argv[++i];
    else if (arg === '--dry-run') args.dryRun = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!PACKAGES.includes(args.package)) throw new Error('--package must be one of the quiz packages');
  if (!Number.isInteger(args.batchSize) || args.batchSize < 1 || args.batchSize > 60) {
    throw new Error('--batch-size must be 1..60');
  }
  return args;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonMaybe(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function loadManifest() {
  return fs.readFileSync(MANIFEST, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function loadVisualMap() {
  const inventory = readJsonMaybe(VISUAL_INVENTORY, []);
  const map = new Map();
  for (const item of inventory) map.set(item.questionId, item);
  return map;
}

function loadCompletedIds(pkg) {
  const dir = path.join(CHECKPOINT_ROOT, pkg);
  const done = new Set();
  if (!fs.existsSync(dir)) return done;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.json')) continue;
    const checkpoint = readJsonMaybe(path.join(dir, name), null);
    if (checkpoint && !checkpoint.probe && checkpoint.semanticReviewPassed && checkpoint.fingerprintPassed) {
      for (const id of checkpoint.questionIds || []) done.add(id);
    }
  }
  return done;
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function polishChinese(value) {
  return String(value || '')
    .replace(/以下哪一项/g, '以下哪项')
    .replace(/哪一个/g, '哪项')
    .replace(/哪一项/g, '哪项')
    .replace(/是合适的/g, '最恰当')
    .replace(/适当/g, '恰当')
    .replace(/特许权/g, '专利权')
    .replace(/秘密密钥/g, '私钥')
    .replace(/公开密钥/g, '公钥')
    .replace(/不正访问/g, '非法访问')
    .replace(/据点/g, '站点')
    .replace(/[“"]a[”"]/g, '“A”')
    .replace(/[“"]i[”"]/g, '“B”')
    .replace(/[“"]u[”"]/g, '“C”')
    .replace(/[“"]e[”"]/g, '“D”')
    .replace(/[“"]我[”"]/g, '“B”')
    .replace(/[“"]U[”"]/g, '“C”')
    .replace(/[“"]E[”"]/g, '“D”')
    .replace(/speech-to-text conversion/g, '语音转文字')
    .replace(/United Nations Educational, Scientific and Culture Organization/g, '联合国教育、科学及文化组织')
    .replace(/Which of the following is an appropriate description regarding these\?/g, '以下哪项描述是恰当的？')
    .replace(/「売上」表の売上日が5月中であるureコード\(行\)について、reコードごとの总计金额计算をすると以下のようになります。/g, '先筛选“销售”表中销售日期在5月内的记录，再按商品代码汇总销售金额，结果如下。')
    .replace(/营业收入/g, '营业利润')
    .replace(/普通收入/g, '经常利润')
    .replace(/普通利润/g, '经常利润')
    .replace(/办公自动化の略/g, 'Office Automation 的缩写')
    .replace(/UMLの説明です/g, '这是 UML 的说明。')
    .replace(/eraning[u]?の说明です/gi, '这是电子学习的说明。')
    .replace(/实时商务/g, '电子商务')
    .replace(/预科学校/g, '培训机构')
    .replace(/非信息终端/g, '信息终端以外')
    .replace(/Internet of Things/g, '物联网')
    .replace(/哪个函数会判定/g, '哪个功能会被判定')
    .replace(/函数，所以/g, '功能，所以')
    .replace(/进程A/g, '工序A')
    .replace(/进程B/g, '工序B')
    .replace(/两种工艺/g, '两个工序')
    .replace(/[“"]To[”"]/g, '“收件人”')
    .replace(/[“"]Cc[”"]/g, '“抄送”')
    .replace(/[“"]Bcc[”"]/g, '“密件抄送”')
    .replace(/\bTo\b/g, '收件人')
    .replace(/\bCc\b/g, '抄送')
    .replace(/\bBcc\b/g, '密件抄送')
    .replace(/;.Cc/g, '；Cc')
    .replace(/;\.抄送/g, '；抄送')
    .replace(/Mr\. ([A-Z])/g, '$1先生')
    .replace(/(\d+) 号/g, '$1')
    .replace(/物体/g, '物')
    .replace(/([A-D])连/g, '$1公司')
    .replace(/指挥指挥/g, '指挥命令')
    .replace(/指导和命令/g, '指挥命令')
    .replace(/正确的[。.]/g, '正确。')
    .replace(/错误的[。.]/g, '错误。')
    .replace(/目的公司/g, '接收公司')
    .replace(/其被派遣公司/g, '接收公司')
    .replace(/也称为合资企业。/g, '也可称为合资公司。')
    .replace(/我们会判断每一个说法是正确还是错误/g, '可据此判断各选项的正误')
    .replace(/劳务派遣合同是劳务派遣公司的员工在劳务派遣公司的指挥命令下从事工作的劳动合同。/g, '劳务派遣合同规定：派遣劳动者由派遣公司雇用，并在接收公司指挥命令下工作。')
    .replace(/派遣公司与被派遣劳动者之间建立指挥命令关系/g, '接收公司与被派遣劳动者之间建立指挥命令关系')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function explainBoundaryOption(record, key) {
  const ja = record.optionsJa[key] || '';
  if (SYMBOL_ONLY.test(ja)) return `选项${key}（原题未提供文字内容）`;
  if (!ja) return `选项${key}（原题未提供文字选项）`;
  return '';
}

function isStatementCombination(value) {
  return STATEMENT_COMBINATION.test(String(value || '').trim());
}

function normalizeStatementCombination(value) {
  return String(value || '').trim().toLowerCase().split(/[，,、]\s*/).join('、');
}

function lineLooksMostlyEnglish(value) {
  const text = String(value || '').trim();
  const words = text.match(/\b[A-Za-z]{3,}\b/g) || [];
  const asciiLetters = (text.match(/[A-Za-z]/g) || []).length;
  const cjkLetters = (text.match(/[\u3400-\u9fff]/g) || []).length;
  return words.length >= 6 && asciiLetters > cjkLetters * 2;
}

function polishExplanation(value, correctAnswer) {
  let output = polishChinese(value);
  if (correctAnswer) {
    output = output
      .replace(/正确答案是[“"][A-Ea我Uiu][”"]/g, `正确答案是“${correctAnswer}”`)
      .replace(/正确答案是[“"]e[”"]/g, `正确答案是“${correctAnswer}”`)
      .replace(/[“"][A-Ea我Ueiu][”"]是正确答案/g, `“${correctAnswer}”是正确答案`)
      .replace(/答案是[“"][A-Ea我Ueiu][”"]/g, `答案是“${correctAnswer}”`)
      .replace(/正解是[“"][A-Ea我Ueiu][”"]/g, `正解是“${correctAnswer}”`)
      .replace(/[“"][A-Ea我Ueiu][”"]的组合最恰当/g, `“${correctAnswer}”的组合最恰当`)
      .replace(/[“"][A-Ea我Ueiu][”"]最恰当/g, `“${correctAnswer}”最恰当`);
    if (!/正确|因此|所以|关键|答案|选/.test(output)) {
      output += `\n\n因此，正确答案是“${correctAnswer}”。`;
    }
  }
  return output;
}

async function requestTranslation(source, sourceLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=zh-CN&dt=t&q=${encodeURIComponent(source)}`;
  let response = null;
  let lastError = null;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url);
    if (response.ok) break;
    const body = await response.text().catch(() => '');
    lastError = new Error(`translate failed: HTTP ${response.status} attempt ${attempt}${body ? ` ${body.slice(0, 120)}` : ''}`);
    if (![429, 500, 502, 503, 504].includes(response.status)) break;
    await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
  }
  if (!response || !response.ok) throw lastError || new Error('translate failed before response');
  const data = await response.json();
  return (data[0] || []).map((part) => part[0]).join('');
}

async function translateEnglishHeavyLines(text, cache) {
  const parts = String(text || '').split(/(\n+)/);
  const translated = [];
  for (const part of parts) {
    if (/^\n+$/.test(part) || !lineLooksMostlyEnglish(part)) {
      translated.push(part);
      continue;
    }
    const cacheKey = `en:${part}`;
    if (!cache[cacheKey]) {
      cache[cacheKey] = polishChinese(await requestTranslation(part, 'en'));
      fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    translated.push(cache[cacheKey]);
  }
  return polishChinese(translated.join(''));
}

async function translateWithCache(text, cache) {
  const source = stripHtml(text);
  if (!source) return '';
  if (cache[source]) return translateEnglishHeavyLines(polishChinese(cache[source]), cache);

  const translated = polishChinese(await requestTranslation(source, 'ja'));
  cache[source] = translated;
  fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
  await new Promise((resolve) => setTimeout(resolve, 120));
  const repaired = await translateEnglishHeavyLines(translated, cache);
  if (repaired !== translated) {
    cache[source] = repaired;
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
  }
  return repaired;
}

function chooseBatch(records, args) {
  const completed = loadCompletedIds(args.package);
  const packageRecords = records.filter((record) => record.package === args.package);
  const startIndex = args.startAfter
    ? packageRecords.findIndex((record) => record.questionId === args.startAfter) + 1
    : 0;
  const candidates = packageRecords.slice(Math.max(startIndex, 0)).filter((record) => !completed.has(record.questionId));
  return candidates.slice(0, args.batchSize);
}

function batchIdFor(pkg, batch) {
  if (batch.length === 0) return `${pkg}_empty`;
  return `${pkg}_${batch[0].questionId}_to_${batch[batch.length - 1].questionId}`;
}

async function main() {
  const args = parseArgs(process.argv);
  ensureDir(ARTIFACTS);
  ensureDir(BATCH_ROOT);
  ensureDir(CHECKPOINT_ROOT);
  ensureDir(path.join(BATCH_ROOT, args.package));
  ensureDir(path.join(CHECKPOINT_ROOT, args.package));

  const records = loadManifest();
  const visualMap = loadVisualMap();
  const cache = readJsonMaybe(CACHE_PATH, {});
  const batch = chooseBatch(records, args);
  const batchId = args.batchId || batchIdFor(args.package, batch);

  if (batch.length === 0) {
    console.log(JSON.stringify({ package: args.package, batchId, translatedCount: 0, nextQuestionId: '' }, null, 2));
    return;
  }

  const translations = [];
  for (const record of batch) {
    const visual = visualMap.get(record.questionId) || null;
    const optionsZh = {};
    const boundaryNotes = [];

    for (const key of OPTION_KEYS) {
      const boundary = explainBoundaryOption(record, key);
      if (boundary) {
        optionsZh[key] = boundary;
        boundaryNotes.push(`${key}: ${boundary}`);
      } else if (isStatementCombination(record.optionsJa[key])) {
        optionsZh[key] = normalizeStatementCombination(record.optionsJa[key]);
      } else {
        optionsZh[key] = await translateWithCache(record.optionsJa[key], cache);
      }
    }

    const questionZh = await translateWithCache(record.questionJa, cache);
    let explanationZh = await translateWithCache(record.explanationJa, cache);
    explanationZh = polishExplanation(explanationZh, record.correctAnswer);
    if (boundaryNotes.length > 0 || (visual && visual.classification !== 'actual_image_question')) {
      explanationZh += '\n\n边界说明：当前仓库没有可验证的图片或表格资源；中文说明只依据题干、选项中已有文字和日文解析，不补写不存在的图表内容。';
    }

    translations.push({
      package: record.package,
      questionId: record.questionId,
      sourceFingerprint: record.sourceFingerprint,
      questionZh: polishChinese(questionZh),
      optionsZh,
      explanationZh: polishExplanation(explanationZh, record.correctAnswer),
      correctAnswer: record.correctAnswer,
      visualClassification: visual ? visual.classification : '',
      optionTextStatus: record.optionTextStatus,
      generatedAt: new Date().toISOString()
    });
  }

  const payload = {
    package: args.package,
    batchId,
    questionIds: translations.map((item) => item.questionId),
    translations
  };
  const outPath = path.join(BATCH_ROOT, args.package, `${batchId}.json`);
  const checkpointPath = path.join(CHECKPOINT_ROOT, args.package, `${batchId}.json`);
  const existingCheckpoint = readJsonMaybe(checkpointPath, null);
  if (!args.dryRun) fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const checkpoint = {
    package: args.package,
    batchId,
    questionIds: payload.questionIds,
    translatedCount: translations.length,
    semanticReviewPassed: false,
    styleLintPassed: false,
    fingerprintPassed: false,
    retryCount: existingCheckpoint ? (existingCheckpoint.retryCount || 0) + 1 : 0,
    completedAt: ''
  };
  if (!args.dryRun) fs.writeFileSync(checkpointPath, `${JSON.stringify(checkpoint, null, 2)}\n`, 'utf8');

  console.log(JSON.stringify({
    package: args.package,
    batchId,
    translatedCount: translations.length,
    firstQuestionId: translations[0].questionId,
    lastQuestionId: translations[translations.length - 1].questionId,
    outPath: path.relative(ROOT, outPath).replace(/\\/g, '/'),
    checkpointPath: path.relative(ROOT, checkpointPath).replace(/\\/g, '/')
  }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
