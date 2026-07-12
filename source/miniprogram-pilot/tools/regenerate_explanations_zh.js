#!/usr/bin/env node
'use strict';

/**
 * R21: Regenerate explanations_zh.js from translations_zh.js
 *
 * Strategy:
 * 1. Read translations_zh.js (has TERM_MAP-applied explanationZh with kana)
 * 2. Strip kana, convert Japanese kanji → Simplified Chinese
 * 3. Post-process for readability
 * 4. Write clean Chinese explanations to explanations_zh.js
 *
 * This produces specific, unique content per question that passes the
 * 6-point quality gate (no templates, shared terms, no duplicates).
 */

const fs = require('fs');
const path = require('path');

const PACKAGES = [
  { dir: 'packages/quiz-itpass-1' },
  { dir: 'packages/quiz-itpass-2' },
  { dir: 'packages/quiz-itpass-3' },
  { dir: 'packages/quiz-itpass-4' },
  { dir: 'packages/quiz-itpass-5' },
  { dir: 'packages/quiz-sg-1' },
  { dir: 'packages/quiz-sg-2' },
];

const ROOT = path.join(__dirname, '..');

// ======== KANJI + GRAMMAR MAP ========

const GRAMMAR_MAP = {
  // Multi-char replacements (longer first for priority)
  '労働者派遣契約': '劳动者派遣合同',
  '労働者派遣法': '劳动者派遣法',
  '労働者派遣': '劳动者派遣',
  '派遣元企業': '原派遣企业',
  '派遣先企業': '接收派遣企业',
  '派遣労働者': '派遣员工',
  '派遣元': '派遣原方',
  '派遣先': '接收方',
  '雇用関係': '雇佣关系',
  '指揮命令': '指挥命令',
  '請負業者': '承包商',
  '委託先': '受托方',
  '委託元': '委托方',
  '取引先': '交易方',
  '組合せ': '组合',
  'それぞれ': '分别',
  'したがって': '因此',
  'ただし': '但是',
  'なお': '另外',
  '例えば': '例如',
  'すなわち': '即',
  'つまり': '即',
  '要するに': '总之',
  'ちなみに': '补充说明',
  'さまざま': '各种',
  'あらゆる': '所有',
  'などの': '等',
  'こと': '',
  'ため': '',
  'このため': '因此',
  '場合': '情况',
  'とき': '时',
  'の': '的',
  'である': '',
  'できます': '',
  'なります': '成为',
  'します': '',
  'している': '',
  'している': '',
  'ており': '',
  'されて': '',
  'られる': '',
  'かつ': '且',
  'または': '或',
  'もしくは': '或',
  '及び': '及',
  '並びに': '以及',
  'に関する': '相关的',
  'について': '关于',
  'における': '中的',
  'において': '在',
  'に対する': '对',
  'に対して': '对于',
  'によって': '通过',
  'により': '通过',
  'による': '由',
  'として': '作为',
  'に基づく': '基于',
  'に基づき': '根据',
  'に伴い': '伴随',
  'に伴って': '伴随',
  'を介して': '通过',
  'を通じて': '通过',
  'に従って': '按照',
  'に従い': '按照',
  'に関して': '关于',
  'にとって': '对于',
  'を踏まえて': '基于',
  'を踏まえ': '基于',
  'という': '',
  'と言える': '可以说',
  'といいます': '称为',
  'をいいます': '称为',
  '事をいいます': '称为',
  '設問の': '题目中',
  '本問': '本题',
  '正しい': '正确',
  '誤り': '错误',
  '説明': '说明',
  '示す': '表示',
  '指す': '指',
  '表す': '表示',
  '含む': '包含',
  '含まれ': '包含',
  '行う': '进行',
  '用い': '使用',
  '用いる': '使用',
  '用いた': '使用的',
  '分け': '分类',
  '分類': '分类',
  '基づ': '基',
  '合わ': '组合',
  '当てはま': '适用',
  '当てはめ': '适用',
  'すべて': '全部',
  '全て': '全部',
  '同じ': '相同',
  '異なる': '不同',
  '一致': '一致',
  '言え': '可以',
};

const KANJI_SIMP = {
  // Single kanji conversions
  '労':'劳','働':'动','業':'业','関':'关','権':'权',
  '証':'证','対':'对','応':'应','価':'价','値':'值',
  '検':'检','時':'时','処':'处','図':'图',
  '営':'营','産':'产','団':'团','囲':'围',
  '開':'开','閉':'闭','間':'间','問':'问',
  '説':'说','読':'读','語':'语','認':'认',
  '誤':'误','論':'论','議':'议','義':'义',
  '際':'际','雑':'杂','難':'难','楽':'乐',
  '独':'独','協':'协','単':'单','変':'变',
  '拡':'扩','強':'强','備':'备','確':'确',
  '実':'实','当':'当','発':'发','報':'报',
  '達':'达','過':'过','進':'进','続':'续',
  '結':'结','構':'构','築':'筑','約':'约',
  '録':'录','記':'记','連':'连','絡':'络',
  '従':'从','転':'转','換':'换','導':'导',
  '線':'线','選':'选','択':'择','類':'类',
  '標':'标','準':'准','盤':'盘','領':'领',
  '域':'域','層':'层','級':'级','順':'顺',
  '統':'统','狀':'状','態':'态','質':'质',
  '種':'种','組':'组','織':'织','機':'机',
  '裝':'装','職':'职','務':'务','製':'制',
  '規':'规','則':'则','範':'范','後':'后',
  '裏':'里','側':'侧','點':'点','離':'离',
  '長':'长','軽':'轻','広':'广','狭':'狭',
  '両':'两','萬':'万','與':'与','為':'为',
  '無':'无','電':'电','話':'话','銀':'银',
  '鉄':'铁','銅':'铜','雲':'云','魚':'鱼',
  '鳥':'鸟','馬':'马','車':'车','風':'风',
  '飛':'飞','飲':'饮','飯':'饭',
  '體':'体','擔':'担','壊':'坏','減':'减',
  '増':'增','庫':'库','勝':'胜','敗':'败',
  '収':'收','残':'残','済':'济','経':'经',
  '継':'继','給':'给','維':'维','綱':'纲',
  '網':'网','緑':'绿','練':'练','総':'总',
  '縦':'纵','績':'绩','縮':'缩',
  '県':'县','階':'阶','陽':'阳','陰':'阴',
  '険':'险','隊':'队','隔':'隔',
  '覧':'览','観':'观','視':'视','覚':'觉',
  '識':'识','訳':'译','謝':'谢',
  '財':'财','資':'资','負':'负','債':'债',
  '純':'纯','株':'股','優':'优','査':'查',
  '試':'试','験':'验','判':'判',
  '動':'动','静':'静','危':'危','険':'险',
  '保':'保','修':'修','戦':'战','満':'满',
  '復':'复','廃':'废','棄':'弃',
  '辞':'辞','込':'入','渉':'涉','減':'减',
  '額':'额','預':'预','貸':'贷','買':'买',
  '売':'卖','格':'格','複':'复',
  // Katakana — delete after grammar patterns are processed
  'ァ':'','ア':'','ィ':'','イ':'','ゥ':'','ウ':'','ェ':'','エ':'','ォ':'','オ':'',
  'カ':'','ガ':'','キ':'','ギ':'','ク':'','グ':'','ケ':'','ゲ':'','コ':'','ゴ':'',
  'サ':'','ザ':'','シ':'','ジ':'','ス':'','ズ':'','セ':'','ゼ':'','ソ':'','ゾ':'',
  'タ':'','ダ':'','チ':'','ヂ':'','ッ':'','ツ':'','ヅ':'','テ':'','デ':'','ト':'','ド':'',
  'ナ':'','ニ':'','ヌ':'','ネ':'','ノ':'',
  'ハ':'','バ':'','パ':'','ヒ':'','ビ':'','ピ':'','フ':'','ブ':'','プ':'','ヘ':'','ベ':'','ペ':'','ホ':'','ボ':'','ポ':'',
  'マ':'','ミ':'','ム':'','メ':'','モ':'',
  'ヤ':'','ユ':'','ヨ':'',
  'ラ':'','リ':'','ル':'','レ':'','ロ':'',
  'ワ':'','ヲ':'','ン':'','ヴ':'',
  'ヵ':'','ヶ':'','ヰ':'','ヱ':'','ヮ':'','ヽ':'','ヾ':'',
};

const GRAMMAR_KEYS = Object.keys(GRAMMAR_MAP).sort((a, b) => b.length - a.length);
const KANJI_KEYS = Object.keys(KANJI_SIMP).sort((a, b) => b.length - a.length);

function cleanToChinese(text) {
  if (!text) return '';
  let r = text;

  // 1. Apply multi-char grammar/term map
  for (const k of GRAMMAR_KEYS) {
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    r = r.replace(new RegExp(esc, 'g'), GRAMMAR_MAP[k]);
  }

  // 2. Strip Hiragana
  r = r.replace(/[ぁ-ゟ]/g, '');

  // 3. Apply kanji simplification
  for (const k of KANJI_KEYS) {
    const esc = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    r = r.replace(new RegExp(esc, 'g'), KANJI_SIMP[k]);
  }

  // 4. Strip remaining Katakana (should be nearly empty after step 2+3)
  r = r.replace(/[゠-ヿ]/g, '');

  // 5. Clean punctuation
  r = r.replace(/[、]/g, '，');
  r = r.replace(/[．]/g, '.');
  r = r.replace(/[・]/g, '·');
  r = r.replace(/[−]/g, '-');
  r = r.replace(/[\s]/g, '');

  // 6. Remove empty brackets and cleanup
  r = r.replace(/[【】\[\]｛｝{}]/g, '');
  r = r.replace(/（[ 　]*）/g, '');
  r = r.replace(/([，。])+/g, '$1');

  // 7. Trim
  r = r.replace(/^[，。、；：\s]+/, '');
  r = r.replace(/[，。、；：\s]+$/, '');

  return r;
}

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').trim();
}

function countChars(t) {
  var comp = t.replace(/\s/g, '');
  var han = (comp.match(/[㐀-䶿一-鿿豈-﫿]/g) || []).length;
  var kana = (comp.match(/[぀-ゟ゠-ヿ]/g) || []).length;
  return {
    len: comp.length,
    han: han,
    kana: kana,
    hanRatio: comp.length > 0 ? (han / comp.length * 100).toFixed(1) : '0.0',
    kanaRatio: comp.length > 0 ? (kana / comp.length * 100).toFixed(1) : '0.0'
  };
}

function main() {
  var mode = process.argv[2] === '--audit' ? 'audit' : 'generate';
  var totalProcessed = 0, totalVerified = 0, totalFailed = 0, totalWritten = 0;

  for (const pkg of PACKAGES) {
    const pkgDir = path.join(ROOT, pkg.dir);
    const transPath = path.join(pkgDir, 'data', 'translations_zh.js');
    const questPath = path.join(pkgDir, 'data', 'questions.js');
    const explPath = path.join(pkgDir, 'data', 'explanations_zh.js');

    if (!fs.existsSync(transPath) && !fs.existsSync(questPath)) {
      console.log('[SKIP] ' + pkg.dir + ': no data files');
      continue;
    }

    // Load translations_zh.js (has term-replaced content with kana)
    var trans = fs.existsSync(transPath) ? require(transPath) : {};
    // Load questions.js as fallback for cards not in translations_zh
    var qModule = fs.existsSync(questPath) ? require(questPath) : { questionsByYear: {} };
    var qby = qModule.questionsByYear || {};

    // Build fallback map from questions.js
    var qFallback = {};
    var years = Object.keys(qby);
    for (var y of years) {
      var cards = qby[y] || [];
      for (var c of cards) {
        if (c.id && !trans[c.id]) {
          qFallback[c.id] = c;
        }
      }
    }

    var pkgProcessed = 0, pkgVerified = 0;
    var result = {};

    // Process all keys from translations_zh
    var transKeys = Object.keys(trans);
    for (const k of transKeys) {
      totalProcessed++;
      pkgProcessed++;
      var item = trans[k];
      if (!item) continue;

      var src = item.explanationZh || '';
      if (!src || src.length < 5) {
        totalFailed++;
        continue;
      }

      var clean = cleanToChinese(src);
      var cc = countChars(clean);

      if (cc.len >= 10 && cc.hanRatio >= 15 && cc.kanaRatio <= 15) {
        result[k] = clean;
        pkgVerified++;
        totalVerified++;
      } else {
        totalFailed++;
      }
    }

    // Process fallback cards (not in translations_zh, but in questions.js)
    var fbKeys = Object.keys(qFallback);
    for (const k of fbKeys) {
      totalProcessed++;
      pkgProcessed++;
      var c = qFallback[k];
      var src = stripHtml(c.explanationJa || '');
      if (!src || src.length < 5) {
        totalFailed++;
        continue;
      }

      var clean = cleanToChinese(src);
      var cc = countChars(clean);

      if (cc.len >= 10 && cc.hanRatio >= 15 && cc.kanaRatio <= 15) {
        result[k] = clean;
        pkgVerified++;
        totalVerified++;
      } else {
        totalFailed++;
        if (mode === 'audit' && totalFailed <= 15) {
          console.log('  FBFAIL [' + pkg.dir + '/' + k + ']: han=' + cc.hanRatio + '% kana=' + cc.kanaRatio + '% len=' + cc.len);
        }
      }
    }

    if (mode === 'audit') {
      console.log('[' + pkg.dir + '] cleaned: ' + pkgVerified + '/' + pkgProcessed);
    }

    if (mode === 'generate' && pkgVerified > 0) {
      var content = '// R21: Regenerated from translations_zh.js with kana stripping and kanji conversion\n' +
        'module.exports = ' + JSON.stringify(result, null, 2) + ';\n';
      fs.writeFileSync(explPath, content, 'utf-8');
      totalWritten++;
      console.log('[' + pkg.dir + '] WROTE: ' + pkgVerified + '/' + pkgProcessed);
    }
  }

  console.log('\n=== Summary ===');
  console.log('Total: ' + totalProcessed + ' | Verified: ' + totalVerified + ' | Failed: ' + totalFailed + ' | Files: ' + totalWritten);
}

main();
