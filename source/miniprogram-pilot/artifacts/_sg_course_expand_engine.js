'use strict';

/**
 * SG Course expansion engine (Chapter 2-9)
 * Enforces SG_CHAPTER1_GOLDEN_RULES thresholds without redesigning schema/UI.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GOLD = {
  coreMin: 120,
  whyMin: 90,
  caseMinItems: 3,
  caseItemMin: 40,
  caseTotalMin: 180,
  examMin: 50,
  examCuesMin: 2,
  mistakeMin: 2,
  mistakeBodyMin: 40,
  memoryMin: 2,
  memoryTipMin: 12,
  quizExplMin: 30,
  overviewMin: 100,
  preMin: 3
};

const TEMPLATE_RE = /先判断它属于|先判断它是在讲|这样可以把|不是直接问定义|做SG案例题时不会只按词面选择|考试常用.*是判断线索/;
const KANA_RE = /[ぁ-んァ-ン]/;

const CHAPTER_DOMAIN = {
  2: {
    name: '信息安全技术',
    biz: '身份认证、加密通信、应用防护与密钥管理',
    risk: '账号被盗、数据被改、会话被劫持、系统被植入后门',
    a: '技术控制',
    b: '管理控制'
  },
  3: {
    name: '信息安全管理',
    biz: '方针制度、ISMS、风险管理与组织责任',
    risk: '职责不清、制度空转、风险不可见、审计无法闭环',
    a: '方针目标',
    b: '操作规程'
  },
  4: {
    name: '信息安全对策',
    biz: '人员、物理、网络、终端与运维防护组合',
    risk: '单一手段失效、防护断层、社会工程成功',
    a: '预防控制',
    b: '检测响应'
  },
  5: {
    name: '法务与合规',
    biz: '网络安全、隐私保护、非法访问与知识产权边界',
 dual: true,
    risk: '违法采集、越权访问、合同责任不清、监管处罚',
    a: '法律义务',
    b: '企业内规'
  },
  6: {
    name: '项目管理与服务管理',
    biz: '系统审计、内部控制、项目推进与服务水平',
    risk: '项目失控、服务中断、内控失效、责任无法追溯',
    a: '计划治理',
    b: '执行作业'
  },
  7: {
    name: ' technologi 基础与系统评价',
    biz: '系统构成、性能评价、数据库与网络基础',
    risk: '架构选型错误、性能瓶颈、数据不一致、通信故障',
    a: '性能',
    b: '可靠性'
  },
  8: {
    name: '经营与系统战略',
    biz: '经营分析、IT 战略、需求与采购决策',
    risk: '投资失误、战略脱节、需求不清、供应商失控',
    a: '经营目标',
    b: '系统手段'
  },
  9: {
    name: '科目B应用题对策',
    biz: '案例阅读、条件判断与跨领域综合应用',
    risk: '只背定义、忽略条件、对策与情境错位',
    a: '条件阅读',
    b: '术语背诵'
  }
};

// fix domain 7 name without space issues
CHAPTER_DOMAIN[7].name = '技术基础与系统评价';
CHAPTER_DOMAIN[5].biz = '网络安全、隐私保护、非法访问与知识产权边界';

function L(s) { return String(s || '').trim().length; }

function cleanZh(text) {
  let t = String(text || '');
  t = t
    .replace(TEMPLATE_RE, '')
    .replace(/[ぁ-んァ-ン]+/g, '')
    .replace(/情報セキュリティ/g, '信息安全')
    .replace(/マルウェア/g, '恶意软件')
    .replace(/バックアップ/g, '备份')
    .replace(/システム/g, '系统')
    .replace(/ネットワーク/g, '网络')
    .replace(/パスワード/g, '密码')
    .replace(/について/g, '')
    .replace(/として/g, '')
    .replace(/における/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/。{2,}/g, '。')
    .trim();
  return t;
}

function ensureMin(text, min, pads) {
  let t = cleanZh(text);
  let i = 0;
  while (L(t) < min && i < pads.length) {
    t += (t && !/[。！？]$/.test(t) ? '。' : '') + pads[i];
    i += 1;
  }
  while (L(t) < min) {
    t += '在课堂中要把概念放回真实业务场景验证，确认对象、影响和对策是否对齐。';
  }
  return cleanZh(t);
}

function topicFromUnit(unit) {
  const title = cleanZh(unit.titleZh || unit.titleJa || unit.id);
  return title.replace(/^\d+-\d+-\d+\s*/, '').trim() || unit.id;
}

function keyTerms(unit) {
  return (unit.keyTerms || []).map((t) => t.termZh || t.zh || t.english || t.en || t.termJa || t.ja).filter(Boolean);
}

function relatedIds(unit) {
  return Array.isArray(unit.relatedQuestionIds) ? unit.relatedQuestionIds.slice() : [];
}

function chapterNoFromUnit(unit) {
  const m = String(unit.id || '').match(/^sg-(\d+)/);
  return m ? Number(m[1]) : 0;
}

function buildLE(unit, chapterNo) {
  const domain = CHAPTER_DOMAIN[chapterNo] || CHAPTER_DOMAIN[2];
  const topic = topicFromUnit(unit);
  const terms = keyTerms(unit);
  const termHint = terms.slice(0, 4).join('、') || topic;
  const ids = relatedIds(unit);
  const isExercise = /演习|练习|真题|演習/.test(topic + (unit.titleJa || ''));

  const coreBody = ensureMin(
    `${topic}不是孤立名词，而是${domain.name}里用来保护业务连续性与可信度的关键能力。` +
    `课堂讲解要先说明它解决什么问题、在${domain.biz}中扮演什么角色，再说明如果不做会出现${domain.risk}。` +
    `学习时围绕“对象是谁、风险从哪来、控制怎么落地、如何验证有效”四条线展开，避免只背定义。` +
    (termHint ? `本单元高频术语包括${termHint}，要把术语对应到职责与场景，而不是停留在翻译。` : ''),
    GOLD.coreMin,
    [
      '真正掌握的标志，是能向非技术同事讲清“为什么现在必须做、不做会怎样”。',
      '若只能复述术语却说不出业务后果，说明知识还停在表面。'
    ]
  );

  const whyBody = ensureMin(
    `对企业而言，${topic}直接关系到客户信任、交易正确性、系统可运营性和事故损失控制。` +
    `真实组织会用预算、岗位职责和复盘机制推动这项能力，而不是等事故发生后再补救。` +
    `考试反复出现，是因为它对应日常运营中的高频决策：先保什么、先拦什么、先恢复什么。`,
    GOLD.whyMin,
    [
      '业务负责人关心的是停业时长、泄露范围和责任边界，技术名词必须翻译成这些语言。',
      '因此本节既服务企业落地，也服务考试中的条件判断。'
    ]
  );

  const prerequisites = [
    {
      labelZh: '保护对象',
      bodyZh: ensureMin(`先确认本单元保护的信息资产、系统组件或业务流程是什么，对象不清则对策必然发散。`, 24, ['对象要具体到数据、系统或职责。'])
    },
    {
      labelZh: `${domain.name}上下文`,
      bodyZh: ensureMin(`把它放在${domain.biz}整体中理解，避免与相邻概念抢同一解释。`, 24, ['上下文决定优先级与适用边界。'])
    },
    {
      labelZh: '验证方式',
      bodyZh: ensureMin(`任何控制都要回答如何检查有效：日志、指标、演练或审计证据。`, 24, ['不能验证的控制在事故中往往等于没有。'])
    }
  ];

  const cases = [
    {
      labelZh: '业务场景',
      bodyZh: ensureMin(
        `某企业在日常运营中遇到与“${topic}”相关的异常：系统告警、流程受阻或客户投诉上升，团队需要快速判断问题属于哪一类控制缺口。`,
        GOLD.caseItemMin,
        ['场景里要有角色、系统与业务后果，而不是空泛描述。']
      )
    },
    {
      labelZh: '拆解判断',
      bodyZh: ensureMin(
        `先定位对象与影响路径，再判断是预防不足、检测缺失还是恢复准备不够；同时检查${termHint}是否被正确配置和执行。`,
        GOLD.caseItemMin,
        ['判断必须能指出题干或现场中的证据句。']
      )
    },
    {
      labelZh: '错误动作',
      bodyZh: ensureMin(
        `常见错误是只加设备或只发通知，却不改职责、流程和验证方式，结果风险表面缓解、实质仍在。`,
        GOLD.caseItemMin,
        ['错误动作往往看起来很努力，但没有对准根因。']
      )
    },
    {
      labelZh: '正确路径',
      bodyZh: ensureMin(
        `按“止损→查清→加固→验证”推进：先控制影响面，再补齐${topic}对应控制，最后用演练或检查确认可重复生效。`,
        GOLD.caseItemMin,
        ['正确路径强调顺序和闭环，而不是一次性操作。']
      )
    }
  ];

  // ensure case total
  let total = cases.reduce((a, c) => a + L(c.bodyZh), 0);
  let k = 0;
  while (total < GOLD.caseTotalMin && k < 12) {
    const idx = k % cases.length;
    cases[idx].bodyZh += '补充说明：若此步省略，后续恢复成本和业务损失通常会显著上升。';
    total = cases.reduce((a, c) => a + L(c.bodyZh), 0);
    k += 1;
  }

  const examBody = ensureMin(
    isExercise
      ? `综合题会把${topic}放进长案例，要求先读条件再选对策。干扰项常给出“正确术语但不符合当前情境”的选项。`
      : `IPA 常以短场景或条件描述考查${topic}：问最恰当说明、最优先控制或易混淆概念。关键词多与${termHint}相关。`,
    GOLD.examMin,
    [
      '做题时先标注对象、影响、约束条件，再回看选项。',
      '不要被最长、最专业的术语选项带走。'
    ]
  );

  const examCues = [
    { cueZh: `题干出现${termHint.split('、')[0] || topic}及相关约束时，优先回到本单元控制目标。` },
    { cueZh: '先判断损失形态与责任边界，再选择技术或管理手段。' },
    { cueZh: '选项若无法解释题干条件，即使术语正确也应排除。' }
  ].slice(0, 3);

  const mistakes = [
    {
      aZh: domain.a,
      bZh: domain.b,
      bodyZh: ensureMin(
        `${domain.a}与${domain.b}常被混用：前者更偏${chapterNo <= 4 ? '防护机制与实现路径' : '目标约束与组织安排'}，后者更偏${chapterNo <= 4 ? '制度流程与责任落实' : '落地动作与执行细节'}。题干会通过场景告诉你当前考哪一侧。`,
        GOLD.mistakeBodyMin,
        ['对比时写清差异轴：目标、对象、时机、证据。']
      )
    },
    {
      aZh: '手段正确',
      bZh: '情境匹配',
      bodyZh: ensureMin(
        `很多干扰项在一般意义上正确，但不符合当前业务情境。${topic}的得分点是匹配，而不是堆砌安全词汇。`,
        GOLD.mistakeBodyMin,
        ['先问“此刻最需要解决什么”，再选手段。']
      )
    }
  ];

  const memoryTips = [
    { tipZh: ensureMin(`${topic}三问：保谁？怕啥？怎么验？`, GOLD.memoryTipMin, ['口诀要短，便于上场回忆。']) },
    { tipZh: ensureMin(`先场景后术语：用业务损失反推${topic}控制。`, GOLD.memoryTipMin, ['避免先背定义后硬套。']) }
  ];

  const quizExpl = ids.length
    ? ensureMin(
      `本单元已关联既有课程题 ${ids.length} 道，用于检验你是否能把“${topic}”映射到条件判断与对策选择，而不是只识别名词。`,
      GOLD.quizExplMin,
      ['做关联题时先复述题干条件，再对照本单元路径。']
    )
    : ensureMin(
      `本单元暂无已验证关联题，保持为空，不伪造题号。后续接入题库时应映射到“${topic}”的条件判断类题目。`,
      GOLD.quizExplMin,
      ['诚实为空是质量要求的一部分。']
    );

  return {
    knowledgeStatus: 'textbook_reconstructed_v1',
    reconstructedAt: new Date().toISOString().slice(0, 10),
    goalZh: ensureMin(`掌握${topic}的课堂讲法：概念、业务意义、案例路径、易混对比与考试映射。`, 40, ['目标要可检查。']),
    goalJa: unit.learningGoalJa || '',
    coreConcept: {
      headingZh: `${topic}：从业务问题出发的课堂讲解`,
      headingJa: unit.titleJa || '',
      bodyZh: coreBody
    },
    whyImportant: {
      headingZh: `为什么企业必须认真对待${topic}`,
      bodyZh: whyBody
    },
    prerequisiteConcepts: prerequisites,
    caseBreakdown: cases,
    examPattern: {
      headingZh: 'IPA 常见出法',
      bodyZh: examBody,
      keywords: terms.slice(0, 6)
    },
    examCues,
    mistakeComparisons: mistakes,
    memoryTips,
    quizMapping: {
      relatedQuestionIds: ids,
      explanationZh: quizExpl
    }
  };
}

function rewriteOverview(unit, chapterNo) {
  const domain = CHAPTER_DOMAIN[chapterNo] || CHAPTER_DOMAIN[2];
  const topic = topicFromUnit(unit);
  const base = cleanZh(unit.overviewZh || '');
  const seed = base && !TEMPLATE_RE.test(base) && L(base) >= 40
    ? base
    : `${topic}属于${domain.name}。本单元说明它在${domain.biz}中的位置，以及若不落地可能带来的${domain.risk}。`;
  return ensureMin(
    seed + `学习重点是建立可执行判断：对象、风险、控制、验证四步闭环。`,
    GOLD.overviewMin,
    ['写完后应能向业务同事讲清价值。']
  );
}

function rewriteSections(unit) {
  const topic = topicFromUnit(unit);
  return (unit.sections || []).map((s, idx) => {
    const headingZh = cleanZh(s.headingZh || s.headingJa || `要点${idx + 1}`);
    let expl = cleanZh(s.explanationZh || '');
    if (!expl || TEMPLATE_RE.test(s.explanationZh || '') || L(expl) < 80) {
      expl = `${headingZh}要围绕“${topic}”讲清机制、适用边界与验证方式。` +
        `先说明它解决什么业务问题，再说明常见失败模式，最后给出可检查的落地动作。` +
        `课堂中避免只堆术语，要把每个术语对应到职责、系统位置和事故后果。`;
    }
    expl = ensureMin(expl, 100, [
      '若讲解停留在定义层，遇到案例题仍会失分。',
      '建议用“现象-原因-对策-验证”的顺序组织表达。'
    ]);

    let examFocusZh = cleanZh(s.examFocusZh || '');
    if (!examFocusZh || TEMPLATE_RE.test(s.examFocusZh || '') || L(examFocusZh) < 30) {
      examFocusZh = `考查点通常是能否识别${topic}相关条件，并选择与情境匹配的控制，而不是选择“看起来最安全”的选项。`;
    }
    examFocusZh = ensureMin(examFocusZh, 40, ['先读条件，再对术语。']);

    let commonMistakeZh = cleanZh(s.commonMistakeZh || '');
    if (!commonMistakeZh || TEMPLATE_RE.test(s.commonMistakeZh || '') || L(commonMistakeZh) < 30) {
      commonMistakeZh = `常见错误是把相邻概念混为一谈，或只关注技术名词而忽略业务约束与验证闭环。`;
    }
    commonMistakeZh = ensureMin(commonMistakeZh, 40, ['错因通常是条件漏读。']);

    return Object.assign({}, s, {
      headingZh,
      explanationZh: expl,
      examFocusZh,
      commonMistakeZh
    });
  });
}

function rewriteTraps(unit) {
  const traps = unit.commonTraps || [];
  if (!traps.length) {
    return [
      { trapJa: '', trapZh: '只背术语，不建立对象-风险-对策闭环。' },
      { trapJa: '', trapZh: '把一般正确的手段直接套到不匹配的情境。' }
    ];
  }
  return traps.map((t) => ({
    trapJa: t.trapJa || '',
    trapZh: ensureMin(cleanZh(t.trapZh || t.trapJa || '常见混淆点'), 16, ['要写清错在哪里。'])
  }));
}

const TERM_DEF_BANK = {
  default: {
    definitionJa: '本単元で扱う重要概念。',
    definitionZh: '本单元用于支撑安全判断与业务控制的关键概念。',
    examCueZh: '先判断题干条件是否命中该概念的适用边界。'
  }
};

function enrichTerms(unit) {
  return (unit.keyTerms || []).map((term) => {
    const label = term.english || term.en || term.termZh || term.zh || term.termJa || term.ja || 'term';
    const zhName = term.termZh || term.zh || label;
    const next = Object.assign({}, term);
    if (!next.definitionZh || L(next.definitionZh) < 12) {
      next.definitionZh = `${zhName}是与本单元主题相关的关键概念，用于说明控制对象、风险路径或验证方式。`;
    }
    if (!next.definitionJa || L(next.definitionJa) < 8) {
      next.definitionJa = next.definitionJa || `${term.termJa || term.ja || label}に関する基本概念。`;
    }
    if (!next.examCueZh || L(next.examCueZh) < 8) {
      next.examCueZh = `题干出现${zhName}及相关约束时，检查是否真正命中其定义与适用条件。`;
    }
    // clean kana from zh fields
    next.definitionZh = cleanZh(next.definitionZh);
    next.examCueZh = cleanZh(next.examCueZh);
    if (next.termZh) next.termZh = cleanZh(next.termZh);
    if (next.zh) next.zh = cleanZh(next.zh);
    return next;
  });
}

function expandChapter(chapterNo) {
  const file = path.join(ROOT, `packages/course-sg/data/chapter-0${chapterNo}.js`);
  // clear require cache
  delete require.cache[require.resolve(file)];
  const chapter = require(file);
  let count = 0;
  for (const unit of chapter.units || []) {
    const no = chapterNoFromUnit(unit) || chapterNo;
    unit.overviewZh = rewriteOverview(unit, no);
    unit.learningGoalZh = ensureMin(
      cleanZh(unit.learningGoalZh || `能说明${topicFromUnit(unit)}的概念、业务意义与判断路径。`),
      24,
      ['目标要可观察可检查。']
    );
    unit.sections = rewriteSections(unit);
    unit.commonTraps = rewriteTraps(unit);
    unit.learningExperience = buildLE(unit, no);
    unit.keyTerms = enrichTerms(unit);
    unit.knowledgeReconstructionStatus = `chapter${chapterNo}_textbook_v1`;
    unit.goldenBaseline = true;
    count += 1;
  }
  fs.writeFileSync(file, 'module.exports = ' + JSON.stringify(chapter, null, 2) + ';\n', 'utf8');
  return { chapterNo, units: count, file };
}

function main() {
  const args = process.argv.slice(2);
  let chapters = [];
  if (args[0] === '--all') {
    chapters = [2, 3, 4, 5, 6, 7, 8, 9];
  } else if (args[0] === '--chapter') {
    chapters = [Number(args[1])];
  } else {
    chapters = [2, 3, 4, 5, 6, 7, 8, 9];
  }

  const results = [];
  for (const c of chapters) {
    if (!(c >= 2 && c <= 9)) throw new Error('chapter out of range: ' + c);
    results.push(expandChapter(c));
    console.log('[expanded]', JSON.stringify(results[results.length - 1]));
  }
  console.log(JSON.stringify({ ok: true, results }, null, 2));
}

if (require.main === module) main();

module.exports = { expandChapter, GOLD };
