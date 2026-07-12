#!/usr/bin/env node
/**
 * extract_python_epub_source_evidence.js  (PYTHON.P-E, read-only)
 *
 * 只读提取 Python 教材 EPUB 的全文/代码证据，用于把 authoring corpus 的
 * lesson 从 toc-only 提升到可核验的 source evidence。
 *
 * 硬约束：
 *   - 只读 EPUB，绝不修改/移动/重命名源文件。
 *   - 全文缓存写到库外 CACHE_DIR，不进入 Git。
 *   - Git 只收 docs/python-source-evidence/ 下的索引/哈希/摘要。
 *   - 纯 node（内置 zlib 解 DEFLATE），不依赖外部 unzip。
 *
 * 用法：
 *   node tools/extract_python_epub_source_evidence.js            # 提取 + 写索引
 *   node tools/extract_python_epub_source_evidence.js --check    # 只校验 EPUB 指纹与可解析性
 */
'use strict';
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var crypto = require('crypto');

var EPUB_DIR = 'G:/项目/python教材';
var CACHE_DIR = 'G:/项目/_python_source_evidence_cache';
var OUT_DIR = path.resolve(__dirname, '..', 'docs', 'python-source-evidence');
var EXPECTED_SHA256 = '860F181731A4699BD412686599596A6101AECE5EB70DD837A15FB2B88F25F7EF';
var BOOK_TITLE_MARKERS = [
  { bookId: 'book1-crash-course', match: 'Python编程：从入门到实践' },
  { bookId: 'book2-automate', match: 'Python编程快速上手' },
  { bookId: 'book3-playground', match: 'Python极客项目编程' }
];

function sha256(buf) { return crypto.createHash('sha256').update(buf).digest('hex').toUpperCase(); }
function sha256Str(s) { return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex'); }

// ---- 最小 ZIP 读取（central directory + local header + inflateRaw）----
function readZipEntries(buf) {
  var entries = {};
  // 定位 EOCD (0x06054b50)，从尾部回扫
  var eocd = -1;
  for (var i = buf.length - 22; i >= 0 && i > buf.length - 22 - 65536; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('EOCD not found — not a valid zip/epub');
  var cdCount = buf.readUInt16LE(eocd + 10);
  var cdOffset = buf.readUInt32LE(eocd + 16);
  var p = cdOffset;
  for (var n = 0; n < cdCount; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    var method = buf.readUInt16LE(p + 10);
    var compSize = buf.readUInt32LE(p + 20);
    var nameLen = buf.readUInt16LE(p + 28);
    var extraLen = buf.readUInt16LE(p + 30);
    var commentLen = buf.readUInt16LE(p + 32);
    var localOff = buf.readUInt32LE(p + 42);
    var name = buf.slice(p + 46, p + 46 + nameLen).toString('utf8');
    // 读 local header 取真实数据起点
    var lNameLen = buf.readUInt16LE(localOff + 26);
    var lExtraLen = buf.readUInt16LE(localOff + 28);
    var dataStart = localOff + 30 + lNameLen + lExtraLen;
    var comp = buf.slice(dataStart, dataStart + compSize);
    var content;
    if (method === 0) content = comp;
    else if (method === 8) content = zlib.inflateRawSync(comp);
    else throw new Error('unsupported zip method ' + method + ' for ' + name);
    entries[name] = content;
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

// ---- 极简 XML/HTML 帮助 ----
function decodeEntities(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
    .replace(/&amp;/g, '&');
}
function stripTags(s) { return decodeEntities(s.replace(/<[^>]+>/g, '')); }
function normText(s) { return stripTags(s).replace(/\s+/g, ' ').trim(); }

function extractCodeBlocks(html) {
  var out = [];
  var re = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
  var m;
  while ((m = re.exec(html))) {
    var inner = m[1].replace(/<br\s*\/?>/gi, '\n');
    var code = decodeEntities(inner.replace(/<[^>]+>/g, ''));
    code = code.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '');
    if (code.trim()) out.push(code);
  }
  return out;
}

function parseOpf(xml) {
  var manifest = {};
  var itemRe = /<item\b[^>]*\/>/gi, im;
  while ((im = itemRe.exec(xml))) {
    var tag = im[0];
    var id = (tag.match(/\bid="([^"]+)"/) || [])[1];
    var href = (tag.match(/\bhref="([^"]+)"/) || [])[1];
    var mt = (tag.match(/\bmedia-type="([^"]+)"/) || [])[1];
    if (id) manifest[id] = { href: href, mediaType: mt };
  }
  var spine = [];
  var srRe = /<itemref\b[^>]*\/>/gi, sm, order = 0;
  while ((sm = srRe.exec(xml))) {
    var idref = (sm[0].match(/\bidref="([^"]+)"/) || [])[1];
    order++;
    var item = manifest[idref] || {};
    spine.push({ order: order, idref: idref, href: item.href || null, mediaType: item.mediaType || null });
  }
  var title = (xml.match(/<dc:title[^>]*>([^<]*)<\/dc:title>/) || [])[1] || '';
  return { manifest: manifest, spine: spine, title: decodeEntities(title) };
}

function parseNcx(xml) {
  // 顺序解析 navPoint，按 <navPoint ...> 与 </navPoint> 追踪 depth
  var pts = [];
  var tokenRe = /<navPoint\b[^>]*>|<\/navPoint>|<text>([\s\S]*?)<\/text>|<content\b[^>]*src="([^"]*)"[^>]*\/>/gi;
  var depth = 0, pending = null, tok;
  while ((tok = tokenRe.exec(xml))) {
    var s = tok[0];
    if (/^<navPoint/i.test(s)) {
      if (pending) pts.push(pending);
      depth++;
      pending = { depth: depth, title: null, src: null };
    } else if (/^<\/navPoint>/i.test(s)) {
      depth--;
    } else if (/^<text>/i.test(s)) {
      if (pending && pending.title === null) pending.title = decodeEntities((tok[1] || '').trim());
    } else if (/^<content/i.test(s)) {
      if (pending && pending.src === null) pending.src = tok[2];
    }
  }
  if (pending) pts.push(pending);
  return pts.filter(function (p) { return p.title; });
}

function assignBooks(navPoints) {
  var currentBook = 'front-matter';
  return navPoints.map(function (np, idx) {
    for (var b = 0; b < BOOK_TITLE_MARKERS.length; b++) {
      if (np.depth === 1 && np.title.indexOf(BOOK_TITLE_MARKERS[b].match) === 0) {
        currentBook = BOOK_TITLE_MARKERS[b].bookId;
      }
    }
    return { playOrder: idx + 1, depth: np.depth, title: np.title, src: np.src || '', bookId: currentBook };
  });
}

function main() {
  var checkOnly = process.argv.indexOf('--check') >= 0;
  var files = fs.readdirSync(EPUB_DIR).filter(function (f) { return /\.epub$/i.test(f); });
  if (!files.length) { console.error('FAIL: no EPUB found in ' + EPUB_DIR); process.exit(1); }

  var reportBooks = [];
  var spineIndexAll = [], sectionIndexAll = [], codeIndexAll = [];
  var epubInventory = [];

  files.forEach(function (fileName) {
    var full = path.join(EPUB_DIR, fileName);
    var buf = fs.readFileSync(full);
    var digest = sha256(buf);
    var entries = readZipEntries(buf);
    var opfName = Object.keys(entries).find(function (k) { return /\.opf$/i.test(k); });
    var ncxName = Object.keys(entries).find(function (k) { return /\.ncx$/i.test(k); });
    var opf = parseOpf(entries[opfName].toString('utf8'));
    var nav = assignBooks(parseNcx(entries[ncxName].toString('utf8')));

    epubInventory.push({
      bookId: 'bundle-3in1', fileName: fileName, sha256: digest,
      sha256Matches: digest === EXPECTED_SHA256, fileSize: buf.length,
      title: opf.title, opfPath: opfName, tocPath: ncxName,
      spineCount: opf.spine.length, navPointCount: nav.length,
      extractable: true, encodingIssues: [], imageOrCodeRenderingRisks: []
    });

    // 每个 spine XHTML：文本 + 代码块
    var opfDir = opfName.indexOf('/') >= 0 ? opfName.slice(0, opfName.lastIndexOf('/') + 1) : '';
    var extractOk = 0, extractFail = 0;
    opf.spine.forEach(function (sp) {
      if (!sp.href || !/x?html?$/i.test(sp.href)) return;
      var key = opfDir + sp.href;
      var raw = entries[key];
      if (!raw) { extractFail++; spineIndexAll.push({ spineIndex: sp.order, href: sp.href, status: 'MISSING' }); return; }
      var html = raw.toString('utf8');
      var text = normText(html);
      var codes = extractCodeBlocks(html);
      var codeHashes = codes.map(function (c) { return sha256Str(c); });
      extractOk++;
      spineIndexAll.push({
        spineIndex: sp.order, href: sp.href, mediaType: sp.mediaType,
        textLen: text.length, textHash: sha256Str(text),
        codeBlockCount: codes.length
      });
      codes.forEach(function (c, ci) {
        codeIndexAll.push({
          href: sp.href, spineIndex: sp.order, blockIndex: ci,
          codeHash: sha256Str(c), lineCount: c.split('\n').length,
          firstLine: c.split('\n')[0].slice(0, 80)
        });
      });
      if (!checkOnly) {
        var cacheFile = path.join(CACHE_DIR, 'book-bundle', sp.href + '.txt');
        fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
        fs.writeFileSync(cacheFile, '# TEXT\n' + text + '\n\n# CODEBLOCKS\n' + codes.map(function (c, i) { return '## block ' + i + '\n' + c; }).join('\n\n'), 'utf8');
      }
    });

    // section-anchor index（NCX）
    nav.forEach(function (np) {
      var hrefPart = (np.src || '').split('#')[0];
      var anchor = (np.src || '').indexOf('#') >= 0 ? np.src.split('#')[1] : '';
      var sp = opf.spine.find(function (s) { return s.href === hrefPart; });
      sectionIndexAll.push({
        bookId: np.bookId, playOrder: np.playOrder, depth: np.depth,
        chapterTitle: np.depth <= 2 ? np.title : '', sectionTitle: np.title,
        xhtmlPath: hrefPart, anchor: anchor,
        spineIndex: sp ? sp.order : null,
        extractionConfidence: sp ? 'HIGH' : 'LOW',
        riskFlags: sp ? [] : ['spine-href-not-found']
      });
    });

    reportBooks.push({ fileName: fileName, spineOk: extractOk, spineFail: extractFail, navPoints: nav.length,
      codeBlocks: codeIndexAll.length });
  });

  if (checkOnly) {
    console.log('[extract --check] EPUB sha256 match:', epubInventory[0].sha256Matches,
      '| spine indexed:', spineIndexAll.length, '| navPoints:', sectionIndexAll.length,
      '| codeBlocks:', codeIndexAll.length);
    process.exit(epubInventory[0].sha256Matches ? 0 : 1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  var W = function (name, obj) { fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(obj, null, 2) + '\n', 'utf8'); };
  W('PYTHON_EPUB_FULLTEXT_INVENTORY.json', { generatedBy: 'extract_python_epub_source_evidence.js', epubs: epubInventory });
  W('PYTHON_EPUB_SPINE_INDEX.json', { count: spineIndexAll.length, spine: spineIndexAll });
  W('PYTHON_EPUB_SECTION_ANCHOR_INDEX.json', { count: sectionIndexAll.length, sections: sectionIndexAll });
  W('PYTHON_EPUB_CODEBLOCK_INDEX.json', { count: codeIndexAll.length, codeBlocks: codeIndexAll });

  console.log('[extract] DONE. spine=' + spineIndexAll.length + ' sections=' + sectionIndexAll.length +
    ' codeBlocks=' + codeIndexAll.length + ' | cache=' + CACHE_DIR + ' (git-excluded)');
  console.log(JSON.stringify(reportBooks, null, 2));
}

main();
