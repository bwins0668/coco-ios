/**
 * check_r7_java_content_integrity_v2.js
 *
 * R7.RECOVERY-0 教学内容完整性检查器 v2。
 *
 * 设计目标（与 v1 originality contract 的关键区别）：
 * 1. 不要求每节文字"绝对唯一"。
 * 2. 过滤标题、lessonId、sourceRef、页码、固定栏目标题后比较正文。
 * 3. 过滤 class 名、变量名、注释、纯日志输出后比较代码行为。
 * 4. 将重复簇分为六类，而非简单的"通过/失败"。
 * 5. 不得偷偷将高风险簇标为 REVIEW 后无条件通过。
 * 6. 不得读取或相信 semanticFidelity、profile、pedagogicalDelta 等布尔标记。
 *
 * 重复簇分类：
 * - BOILERPLATE_ALLOWED         固定栏目标题、安全提醒、术语解释模板
 * - PROGRESSION_CANDIDATE        相邻节的递进式重复（概念链上的自然复用）
 * - LIKELY_TEMPLATE_REPLICATION  仅替换标题/页码/变量名/日志文字的大段重复
 * - CODE_BEHAVIOR_DUPLICATE      代码仅改 class 名、变量名、注释、println 内容
 * - LEARNER_VISIBLE_METADATA_NOISE 页码、sourceRef、lessonId 混入学生可见正文
 * - PLACEHOLDER_OR_STUFFING      dummy / null / keyword stuffing / TODO
 */

const fs = require('fs');
const path = require('path');

// ── 课程数据加载 ──────────────────────────────────────────────────

const CHAPTER_DIRS = [
  'packages/java-course-a/data/chapters',
  'packages/java-course-b/data/chapters',
  'packages/java-course-c/data/chapters',
];

function collectChapterFiles(root) {
  const files = [];
  for (const dir of CHAPTER_DIRS) {
    const full = path.resolve(root, dir);
    if (!fs.existsSync(full)) continue;
    for (const f of fs.readdirSync(full)) {
      if (/^java-ch\d+\.js$/.test(f)) files.push(path.join(dir, f));
    }
  }
  return files.sort();
}

function loadLessons(root) {
  const lessons = [];
  const files = collectChapterFiles(root);
  for (const f of files) {
    const mod = require(path.resolve(root, f));
    for (const l of (mod.lessons || [])) {
      lessons.push({ ...l, _chapterFile: f });
    }
  }
  return lessons;
}

// ── 文本规范化 ────────────────────────────────────────────────────

/**
 * 提取正文：将所有 block 的 ja/zh 拼接，过滤掉栏目标题和页码
 */
function extractBodyText(lesson, lang) {
  const blocks = lesson.blocks || [];
  const parts = [];
  for (const b of blocks) {
    const text = b[lang];
    if (!text) continue;
    // 过滤栏目标题中的固定模板文字
    let cleaned = text
      .replace(/この節のねらい|本节目标/g, '')
      .replace(/コードで見るポイント|从代码看重点/g, '')
      .replace(/ゼロから読む順番|零基础阅读顺序/g, '')
      .replace(/つまずきやすい点|容易卡住的点/g, '')
      .replace(/手を動かす前に|动手前确认/g, '')
      .replace(/このミニ例は教材本文の写しではなく[^。]*。/g, '')
      .replace(/这个小例子不是教材原文复制[^。]*。/g, '')
      .trim();
    if (cleaned.length > 10) parts.push(cleaned);
  }
  return parts.join('\n');
}

/**
 * 规范化文本用于比较：移除页码、lessonId、标题、专属术语
 */
function normalizeForComparison(text, lesson) {
  let s = text;

  // 移除页码引用
  s = s.replace(/教材\s*\d+\s*ページ/g, '{page}');
  s = s.replace(/教材第\s*\d+\s*页/g, '{page}');
  s = s.replace(/教材\d+ページ/g, '{page}');

  // 移除 lessonId 变体
  if (lesson.lessonId) {
    s = s.replace(new RegExp(escapeRegex(lesson.lessonId), 'g'), '{lessonId}');
  }

  // 移除标题
  if (lesson.title) {
    const titles = [lesson.title.ja, lesson.title.zh].filter(Boolean);
    for (const t of titles) {
      s = s.replace(new RegExp(escapeRegex(t), 'g'), '{title}');
    }
  }

  // 移除日文全角书名号包裹的术语
  s = s.replace(/「[^」]+」/g, '{quoted}');

  // 标准化空白
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

/**
 * 规范化代码（移除 class 名、变量名、注释、日志文字）用于比较代码行为
 */
function normalizeCode(code) {
  if (!code) return '';
  let s = code;

  // 移除单行注释
  s = s.replace(/\/\/.*$/gm, '');
  // 移除多行注释
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  // 替换 class 名
  s = s.replace(/class\s+JavaR7\w+/g, 'class __CLS__');
  // 替换变量声明
  s = s.replace(/\b(String|int|double|boolean|float|long|char|byte|short)\s+(\w+)\s*=/g, '$1 __VAR__ =');
  s = s.replace(/\b(\w+)\s*=\s*new\s/g, '__VAR__ = new ');
  // 替换字符串和数字字面量
  s = s.replace(/"[^"]*"/g, '__STR__');
  s = s.replace(/\b\d+\b/g, '__NUM__');
  // 替换所有 println 参数
  s = s.replace(/System\.out\.println\s*\([^)]+\)/g, 'System.out.println(__EXPR__)');
  // 标准化空白
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

/**
 * 计算简化的 Jaccard 相似度（基于 token 集合）
 */
function jaccardSimilarity(a, b) {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  let intersect = 0;
  for (const t of tokensA) {
    if (tokensB.has(t)) intersect++;
  }
  const union = tokensA.size + tokensB.size - intersect;
  return union === 0 ? 0 : intersect / union;
}

function tokenize(text) {
  // 用 Unicode 感知分词（中文/日文按字符，英文按词）
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

function escapeRegex(s) {
  return (s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── 检查器核心 ────────────────────────────────────────────────────

const findings = [];
const stats = {
  lessons: 0,
  boilerplateAllowed: 0,
  progressionCandidate: 0,
  likelyTemplateReplication: 0,
  codeBehaviorDuplicate: 0,
  learnerVisibleMetadataNoise: 0,
  placeholderOrStuffing: 0,
};

function addFinding(clusterId, type, lessonId, field, normalizedSnippet, reason, lessonIds) {
  findings.push({
    clusterId,
    type,
    lessonId,
    field,
    normalizedSnippet: normalizedSnippet.substring(0, 120),
    reason,
    lessonIds: lessonIds || [lessonId],
    isAdjacent: false, // will be computed later
    solutionHint: '',
  });
  switch (type) {
    case 'BOILERPLATE_ALLOWED': stats.boilerplateAllowed++; break;
    case 'PROGRESSION_CANDIDATE': stats.progressionCandidate++; break;
    case 'LIKELY_TEMPLATE_REPLICATION': stats.likelyTemplateReplication++; break;
    case 'CODE_BEHAVIOR_DUPLICATE': stats.codeBehaviorDuplicate++; break;
    case 'LEARNER_VISIBLE_METADATA_NOISE': stats.learnerVisibleMetadataNoise++; break;
    case 'PLACEHOLDER_OR_STUFFING': stats.placeholderOrStuffing++; break;
  }
}

/**
 * 检查 learner-visible metadata 噪音
 */
function checkLearnerVisibleNoise(lessons) {
  for (const l of lessons) {
    const lessonId = l.lessonId || 'unknown';

    // 检查 blocks 中的教材页码
    for (const b of (l.blocks || [])) {
      for (const lang of ['ja', 'zh']) {
        const text = b[lang] || '';
        // 检查正文中（非栏目标题中）的页码引用
        const bodyText = text
          .replace(/^教材\d+ページ[「「].*?[」」][:：]\s*/, '')
          .replace(/^教材第\s*\d+\s*页["""].*?["""][:：]\s*/, '');
        if (/教材\s*\d+\s*ページ/.test(bodyText) || /教材第\s*\d+\s*页/.test(bodyText)) {
          // 只在正文体中（非前缀）仍有页码时报告
          const matches = bodyText.match(/教材\s*\d+\s*[ページ页]/g);
          if (matches && bodyText.length > 50) {
            addFinding(
              `NOISE-${lessonId}-${lang}`,
              'LEARNER_VISIBLE_METADATA_NOISE',
              lessonId,
              `blocks.${lang}`,
              bodyText.substring(0, 120),
              `教材页码出现在学生可见的正文中（非栏目标题前缀），语言: ${lang}`,
              [lessonId]
            );
          }
        }
      }
    }

    // 检查 handson 中的页码
    if (l.handson) {
      for (const lang of ['ja', 'zh']) {
        const text = l.handson[lang] || '';
        if (/教材\s*\d+\s*[ページ页]/.test(text)) {
          addFinding(
            `NOISE-HS-${lessonId}-${lang}`,
            'LEARNER_VISIBLE_METADATA_NOISE',
            lessonId,
            `handson.${lang}`,
            text.substring(0, 120),
            `handson 中包含教材页码引用，语言: ${lang}`,
            [lessonId]
          );
        }
      }
    }

    // 检查 commonMistakes 中的页码
    if (l.commonMistakes) {
      for (const m of l.commonMistakes) {
        for (const lang of ['ja', 'zh']) {
          const text = m[lang] || '';
          if (/教材\s*\d+\s*[ページ页]/.test(text)) {
            addFinding(
              `NOISE-CM-${lessonId}-${lang}`,
              'LEARNER_VISIBLE_METADATA_NOISE',
              lessonId,
              `commonMistakes.${lang}`,
              text.substring(0, 120),
              `commonMistakes 中包含教材页码引用，语言: ${lang}`,
              [lessonId]
            );
          }
        }
      }
    }

    // 检查 code examples 中是否含有 lessonId 混入输出
    for (const ex of (l.codeExamples || [])) {
      if (/lesson=/.test(ex.code || '') || /lesson=/.test(ex.expectedOutput || '')) {
        addFinding(
          `NOISE-CODE-${lessonId}`,
          'LEARNER_VISIBLE_METADATA_NOISE',
          lessonId,
          'codeExamples.output',
          (ex.expectedOutput || '').substring(0, 120),
          'lessonId 混入代码输出内容，学生可见',
          [lessonId]
        );
      }
    }
  }
}

/**
 * 检查 placeholder / stuffing
 */
function checkPlaceholders(lessons) {
  for (const l of lessons) {
    const lessonId = l.lessonId || 'unknown';
    const allText = JSON.stringify(l);

    if (/TODO|PLACEHOLDER|TBD|FIXME/i.test(allText)) {
      const match = allText.match(/(TODO|PLACEHOLDER|TBD|FIXME)[^"]{0,50}/i);
      addFinding(
        `STUFF-${lessonId}`,
        'PLACEHOLDER_OR_STUFFING',
        lessonId,
        'any',
        match ? match[0] : 'TODO/PLACEHOLDER detected',
        '内容中存在占位符或未完成标记',
        [lessonId]
      );
    }

    // 检查 dummy / null stuffing
    const blocksText = (l.blocks || []).map(b => (b.ja || '') + ' ' + (b.zh || '')).join(' ');
    if (/dummy/i.test(blocksText) && !/dummyStream/.test(blocksText)) {
      addFinding(
        `STUFF-DUMMY-${lessonId}`,
        'PLACEHOLDER_OR_STUFFING',
        lessonId,
        'blocks',
        blocksText.substring(0, 120),
        '正文中出现 "dummy" 关键字（非 GC 教学场景）',
        [lessonId]
      );
    }
  }
}

/**
 * 检查正文重复（核心解释、commonMistakes、handson）
 */
function checkContentDuplication(lessons) {
  const SIMILARITY_THRESHOLD = 0.85;
  const HIGH_SIMILARITY_THRESHOLD = 0.95;

  // 分组：同一 chapter 内的 lesson
  const byChapter = {};
  for (const l of lessons) {
    const ch = l.chapterId || 'unknown';
    if (!byChapter[ch]) byChapter[ch] = [];
    byChapter[ch].push(l);
  }

  // 只比较同一 chapter 内的 lesson（跨 chapter 比较交由 PROGRESSION 检查）
  for (const [chId, chLessons] of Object.entries(byChapter)) {
    for (let i = 0; i < chLessons.length; i++) {
      for (let j = i + 1; j < chLessons.length; j++) {
        const a = chLessons[i];
        const b = chLessons[j];
        const adj = Math.abs((a.order || 0) - (b.order || 0)) <= 2;

        // 1. 比较正文 (zh)
        const bodyZhA = normalizeForComparison(extractBodyText(a, 'zh'), a);
        const bodyZhB = normalizeForComparison(extractBodyText(b, 'zh'), b);
        if (bodyZhA.length > 20 && bodyZhB.length > 20) {
          const sim = jaccardSimilarity(bodyZhA, bodyZhB);
          if (sim >= HIGH_SIMILARITY_THRESHOLD) {
            const type = adj ? 'PROGRESSION_CANDIDATE' : 'LIKELY_TEMPLATE_REPLICATION';
            addFinding(
              `DUP-ZH-${a.lessonId}-${b.lessonId}`,
              type,
              a.lessonId,
              'blocks.zh',
              bodyZhA.substring(0, 120),
              `中文正文与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}${adj ? ' (相邻节，可能为递进)' : ''}`,
              [a.lessonId, b.lessonId]
            );
          } else if (sim >= SIMILARITY_THRESHOLD) {
            addFinding(
              `SIM-ZH-${a.lessonId}-${b.lessonId}`,
              'PROGRESSION_CANDIDATE',
              a.lessonId,
              'blocks.zh',
              bodyZhA.substring(0, 120),
              `中文正文与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}（中等相似，可能是递进复用）`,
              [a.lessonId, b.lessonId]
            );
          }
        }

        // 2. 比较正文 (ja)
        const bodyJaA = normalizeForComparison(extractBodyText(a, 'ja'), a);
        const bodyJaB = normalizeForComparison(extractBodyText(b, 'ja'), b);
        if (bodyJaA.length > 20 && bodyJaB.length > 20) {
          const sim = jaccardSimilarity(bodyJaA, bodyJaB);
          if (sim >= HIGH_SIMILARITY_THRESHOLD) {
            const type = adj ? 'PROGRESSION_CANDIDATE' : 'LIKELY_TEMPLATE_REPLICATION';
            addFinding(
              `DUP-JA-${a.lessonId}-${b.lessonId}`,
              type,
              a.lessonId,
              'blocks.ja',
              bodyJaA.substring(0, 120),
              `日文正文与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}${adj ? ' (相邻节，可能为递进)' : ''}`,
              [a.lessonId, b.lessonId]
            );
          } else if (sim >= SIMILARITY_THRESHOLD) {
            addFinding(
              `SIM-JA-${a.lessonId}-${b.lessonId}`,
              'PROGRESSION_CANDIDATE',
              a.lessonId,
              'blocks.ja',
              bodyJaA.substring(0, 120),
              `日文正文与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}（中等相似，可能是递进复用）`,
              [a.lessonId, b.lessonId]
            );
          }
        }

        // 3. 比较 commonMistakes
        const cmA = normalizeForComparison(
          (a.commonMistakes || []).map(m => (m.zh || '') + ' ' + (m.ja || '')).join(' ||| '),
          a
        );
        const cmB = normalizeForComparison(
          (b.commonMistakes || []).map(m => (m.zh || '') + ' ' + (m.ja || '')).join(' ||| '),
          b
        );
        if (cmA.length > 20 && cmB.length > 20) {
          const sim = jaccardSimilarity(cmA, cmB);
          if (sim >= HIGH_SIMILARITY_THRESHOLD) {
            const type = adj ? 'PROGRESSION_CANDIDATE' : 'LIKELY_TEMPLATE_REPLICATION';
            addFinding(
              `DUP-CM-${a.lessonId}-${b.lessonId}`,
              type,
              a.lessonId,
              'commonMistakes',
              cmA.substring(0, 120),
              `commonMistakes 与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}（疑似仅替换术语）`,
              [a.lessonId, b.lessonId]
            );
          }
        }

        // 4. 比较 handson
        const hsA = normalizeForComparison((a.handson || {}).zh || '', a);
        const hsB = normalizeForComparison((b.handson || {}).zh || '', b);
        if (hsA.length > 20 && hsB.length > 20) {
          const sim = jaccardSimilarity(hsA, hsB);
          if (sim >= HIGH_SIMILARITY_THRESHOLD) {
            const type = adj ? 'PROGRESSION_CANDIDATE' : 'LIKELY_TEMPLATE_REPLICATION';
            addFinding(
              `DUP-HS-${a.lessonId}-${b.lessonId}`,
              type,
              a.lessonId,
              'handson',
              hsA.substring(0, 120),
              `handson 与 ${b.lessonId} 的 Jaccard 相似度为 ${sim.toFixed(4)}${adj ? ' (相邻节)' : ''}`,
              [a.lessonId, b.lessonId]
            );
          }
        }
      }
    }
  }
}

/**
 * 检查代码行为重复
 */
function checkCodeDuplication(lessons) {
  const seen = new Map(); // normalizedCode -> { lessonId, order, chapterId }

  for (const l of lessons) {
    for (const ex of (l.codeExamples || [])) {
      const norm = normalizeCode(ex.code || '');
      if (norm.length < 20) continue;

      if (seen.has(norm)) {
        const prev = seen.get(norm);
        const adj = l.chapterId === prev.chapterId &&
          Math.abs((l.order || 0) - (prev.order || 0)) <= 2;
        const type = adj ? 'PROGRESSION_CANDIDATE' : 'CODE_BEHAVIOR_DUPLICATE';
        addFinding(
          `CODE-DUP-${l.lessonId}-${prev.lessonId}`,
          type,
          l.lessonId,
          'codeExamples.code',
          norm.substring(0, 120),
          `代码行为与 ${prev.lessonId} 完全相同（仅可能修改了 class 名、变量名、注释或日志）${adj ? ' (相邻节，可能为递进)' : ''}`,
          [l.lessonId, prev.lessonId]
        );
      } else {
        seen.set(norm, { lessonId: l.lessonId, order: l.order, chapterId: l.chapterId });
      }
    }
  }
}

/**
 * 计算每个 finding 的相邻性
 */
function computeAdjacency(lessons, findings) {
  const lessonMap = new Map();
  for (const l of lessons) {
    lessonMap.set(l.lessonId, l);
  }

  for (const f of findings) {
    if (f.lessonIds.length >= 2) {
      const a = lessonMap.get(f.lessonIds[0]);
      const b = lessonMap.get(f.lessonIds[1]);
      if (a && b) {
        f.isAdjacent = a.chapterId === b.chapterId &&
          Math.abs((a.order || 0) - (b.order || 0)) <= 2;
      }
    }
  }
}

/**
 * 对 findings 去重合并
 */
function deduplicateFindings(findings) {
  const seen = new Set();
  const result = [];
  for (const f of findings) {
    const key = `${f.type}|${f.field}|${[...f.lessonIds].sort().join(',')}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(f);
    }
  }
  return result;
}

/**
 * 生成聚类库存报告
 */
function generateClusterInventory(findings, lessons) {
  const lines = [];

  lines.push('# R7 教学内容重复簇库存');
  lines.push('');
  lines.push('> 由 `tools/check_r7_java_content_integrity_v2.js` 自动生成');
  lines.push('> 基线: 43724d8 (R7.0A.1)');
  lines.push('');
  lines.push(`总 lesson 数: ${lessons.length}`);
  lines.push(`总 finding 数: ${findings.length} (去重后)`);
  lines.push('');

  // 统计分类
  const byType = {};
  for (const f of findings) {
    if (!byType[f.type]) byType[f.type] = [];
    byType[f.type].push(f);
  }

  lines.push('## 分类摘要');
  lines.push('');
  lines.push('| 类型 | 数量 | 说明 |');
  lines.push('|---|---|---|');
  for (const [type, items] of Object.entries(byType)) {
    lines.push(`| ${type} | ${items.length} | ${describeType(type)} |`);
  }
  lines.push('');

  // 详细输出每个高风险类别
  const highRiskTypes = ['LIKELY_TEMPLATE_REPLICATION', 'CODE_BEHAVIOR_DUPLICATE', 'LEARNER_VISIBLE_METADATA_NOISE', 'PLACEHOLDER_OR_STUFFING'];
  for (const type of highRiskTypes) {
    const items = byType[type] || [];
    if (items.length === 0) {
      lines.push(`## ${type}`);
      lines.push('');
      lines.push('未检测到此类问题。');
      lines.push('');
      continue;
    }

    lines.push(`## ${type} (${items.length} 条)`);
    lines.push('');
    lines.push('| clusterId | lessonId | 字段 | 标准化片段 | 是否相邻 | 建议 |');
    lines.push('|---|---|---|---|---|---|');

    for (const f of items.slice(0, 200)) {
      const adj = f.isAdjacent ? '是' : '否';
      const hint = suggestSolution(f);
      const escapedSnippet = f.normalizedSnippet.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      lines.push(`| ${f.clusterId} | ${f.lessonIds.join(', ')} | ${f.field} | ${escapedSnippet} | ${adj} | ${hint} |`);
    }
    if (items.length > 200) {
      lines.push(`| ... | (另有 ${items.length - 200} 条) | | | | |`);
    }
    lines.push('');
  }

  // PROGRESSION_CANDIDATE 简要列表
  const prog = byType['PROGRESSION_CANDIDATE'] || [];
  lines.push(`## PROGRESSION_CANDIDATE (${prog.length} 条)`);
  lines.push('');
  lines.push('以下 lesson 对显示中等以上的文本相似度，可能为递进式复用。需人工审核确认。');
  lines.push('');
  for (const f of prog.slice(0, 50)) {
    lines.push(`- \`${f.lessonIds.join(' ⇄ ')}\` — ${f.field} — ${f.reason}`);
  }
  if (prog.length > 50) {
    lines.push(`- ... (另有 ${prog.length - 50} 条)`);
  }
  lines.push('');

  return lines.join('\n');
}

function describeType(type) {
  const desc = {
    'BOILERPLATE_ALLOWED': '固定栏目标题、安全提醒、术语解释模板 — 允许复用',
    'PROGRESSION_CANDIDATE': '相邻/同概念链 lesson 间的递进式复用 — 需人工确认',
    'LIKELY_TEMPLATE_REPLICATION': '仅替换标题/页码/术语名的大段重复 — 高风险',
    'CODE_BEHAVIOR_DUPLICATE': '代码行为完全相同，仅改了表面名称 — 高风险',
    'LEARNER_VISIBLE_METADATA_NOISE': '页码、lessonId 等元数据混入学生可见内容 — 需清理',
    'PLACEHOLDER_OR_STUFFING': 'dummy、null、TODO 等占位符混入正文 — 需清理',
  };
  return desc[type] || type;
}

function suggestSolution(finding) {
  switch (finding.type) {
    case 'LIKELY_TEMPLATE_REPLICATION':
      return '需逐节重写，确保每节的解释、易错点、动手任务聚焦本节独有概念和行为';
    case 'CODE_BEHAVIOR_DUPLICATE':
      return '需为本节设计新的代码行为（新输入、新处理逻辑、新输出），而非仅改表面文字';
    case 'LEARNER_VISIBLE_METADATA_NOISE':
      return '从正文/代码输出中移除页码或 lessonId，改用非可见的 sourceRef 追踪';
    case 'PLACEHOLDER_OR_STUFFING':
      return '移除占位符，替换为真实的教学内容';
    case 'PROGRESSION_CANDIDATE':
      return '人工确认本节是否在概念、行为、易错点上确实比前节有新内容';
    default:
      return '无需操作';
  }
}

// ── 主入口 ────────────────────────────────────────────────────────

function main() {
  const root = process.cwd();
  const writeReport = process.argv.includes('--write-report');
  const lessons = loadLessons(root);
  stats.lessons = lessons.length;

  if (lessons.length === 0) {
    console.log('[R7 integrity v2] ERROR: 未找到任何 lesson 数据');
    process.exit(1);
  }

  // 执行各项检查
  checkLearnerVisibleNoise(lessons);
  checkPlaceholders(lessons);
  checkContentDuplication(lessons);
  checkCodeDuplication(lessons);

  // 后处理
  computeAdjacency(lessons, findings);
  const deduped = deduplicateFindings(findings);

  // 生成集群库存
  const report = generateClusterInventory(deduped, lessons);

  const outPath = path.resolve(root, 'docs/java-course/10_r7_content_cluster_inventory.md');
  if (writeReport) {
    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, report, 'utf-8');
  }

  // 输出摘要
  console.log(`[R7 integrity v2] Scanned ${lessons.length} lessons.`);
  console.log(`[R7 integrity v2] Findings (deduplicated): ${deduped.length}`);
  console.log(`[R7 integrity v2]   LIKELY_TEMPLATE_REPLICATION: ${stats.likelyTemplateReplication}`);
  console.log(`[R7 integrity v2]   CODE_BEHAVIOR_DUPLICATE: ${stats.codeBehaviorDuplicate}`);
  console.log(`[R7 integrity v2]   LEARNER_VISIBLE_METADATA_NOISE: ${stats.learnerVisibleMetadataNoise}`);
  console.log(`[R7 integrity v2]   PLACEHOLDER_OR_STUFFING: ${stats.placeholderOrStuffing}`);
  console.log(`[R7 integrity v2]   PROGRESSION_CANDIDATE: ${stats.progressionCandidate}`);
  console.log(`[R7 integrity v2]   BOILERPLATE_ALLOWED: ${stats.boilerplateAllowed}`);
  if (writeReport) {
    console.log(`[R7 integrity v2] Report written to: ${outPath}`);
  } else {
    console.log(`[R7 integrity v2] Report not written (default read-only). Use --write-report to update: ${outPath}`);
  }

  // 输出高风险数量便于后续报告
  const highRisk = stats.likelyTemplateReplication + stats.codeBehaviorDuplicate +
    stats.learnerVisibleMetadataNoise + stats.placeholderOrStuffing;

  if (highRisk > 0) {
    console.log(`[R7 integrity v2] WARNING: ${highRisk} high-risk findings detected (not a blocking failure — requires manual review)`);
    // exit 0: v2 checker 不将风险作为硬门禁
    process.exit(0);
  } else {
    console.log('[R7 integrity v2] No high-risk findings detected.');
    process.exit(0);
  }
}

main();
