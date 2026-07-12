'use strict';

/**
 * Chapter 1 textbook-grade knowledge packs.
 * Applied only to packages/course-sg/data/chapter-01.js units.
 */

function le(base) {
  return Object.assign({
    knowledgeStatus: 'textbook_reconstructed_v1',
    reconstructedAt: '2026-07-11'
  }, base);
}

const packs = {
  'sg-1-1-1': {
    titleZh: '1-1-1 什么是信息安全',
    overviewZh: '信息安全不是“装杀毒软件”的代名词，而是围绕信息资产，持续维持机密性、完整性、可用性（CIA）的一整套管理与技术思路。企业真正要保护的，是客户数据、合同、系统配置、业务连续性这些“用得上的东西”。本单元先建立总框架：资产在哪、会受什么威胁、脆弱点在哪、用什么对策、事故发生后先判断损害的是 CIA 中的哪一项。',
    learningGoalZh: '能够说明信息安全的保护对象与 CIA 三要素，并能根据案例判断“损害了什么、为什么要保护、该从哪类对策入手”。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '可以把信息安全想成“保护有价值信息的经营动作”，不是单一 IT 运维任务。先确认信息资产：订单、账号、设计图、服务器配置都属于资产。再看威胁与脆弱性：威胁是可能导致损害的来源，脆弱性是可被利用的弱点。事故发生后，先判断损害的是机密性、完整性还是可用性，再决定隔离、恢复还是加强访问控制。这样学，后面的攻击、管理、法规章节才有统一坐标系。',
        examFocusZh: 'IPA 很少只考“定义是什么”，更常给事故场景，让你判断损害的是 CIA 哪一项、对象是不是信息资产、对策是否对准了原因。关键词：机密性、完整性、可用性、信息资产、威胁、脆弱性。',
        commonMistakeZh: '常见错法是把信息安全窄化成“防病毒/防黑客”。题干若是数据被改、服务停摆、权限被滥用，答案往往落在完整性或可用性，而不是“再装一个杀毒软件”。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '读 SG 案例时，先找“受害对象—发生原因—影响结果—可选对策”四条线。对象是客户名单还是生产系统？原因是人为误操作、权限过大还是恶意软件？影响是泄露、被改，还是用不了？对策必须对准这根链条。若选项只谈网络速度、硬件性能，却不回答保护目标，基本可以排除。',
        examFocusZh: '看到“泄露/篡改/中断”优先映射到 CIA；看到“资产清单/负责人/对策”则更偏管理视角。不要被英文缩写吓住，CIA 只是三问：谁能看、是否被改、能不能用。',
        commonMistakeZh: '不要因为出现“病毒”字样就一律选技术杀毒。若题干强调业务停摆或数据不可用，考查重点可能是可用性与恢复，而不是恶意软件分类本身。'
      }
    ],
    commonTraps: [
      { trapZh: '把信息安全等同于杀毒或网络设备配置。' },
      { trapZh: '只看机密性，忽略完整性与可用性。' }
    ],
    learningExperience: le({
      goalZh: '建立“信息资产 → 威胁/脆弱性 → CIA 损害 → 对策”的课堂级理解，而不是背定义。',
      goalJa: '情報資産、脅威、脆弱性、CIA、対策の関係を授業のように説明できるようにする。',
      coreConcept: {
        headingZh: '信息安全保护的是“业务可用的信息状态”',
        headingJa: '情報セキュリティは使える情報状態を守る',
        bodyZh: '信息安全要回答三件事：不该看的人能不能看到（机密性），内容是否被擅自改过（完整性），需要时能不能正常使用（可用性）。企业买防火墙、做培训、写规程，最终都是为了维持这三种状态。因此学习时不要从产品名出发，而要从“保护对象和损害形态”出发。',
        bodyJa: '機密性・完全性・可用性を軸に、何を守り、何が損なわれたかを先に判断する。'
      },
      whyImportant: {
        headingZh: '为什么这一节几乎是全书入口',
        bodyZh: '后续所有攻击手法、管理流程、法规要求，最终都会回到 CIA 与资产保护。企业事故报告、ISO/ISMS、考试案例题也都用同一套语言。学不会这一节，后面章节会变成术语堆砌。'
      },
      prerequisiteConcepts: [
        { labelZh: '信息资产', bodyZh: '对组织有价值、需要保护的信息及其载体，包括电子与纸质。' },
        { labelZh: '威胁与脆弱性', bodyZh: '威胁是可能造成损害的来源；脆弱性是可被利用的弱点。两者相遇才形成风险。' },
        { labelZh: 'CIA 三要素', bodyZh: '机密性、完整性、可用性，是判断损害类型的基本标尺。' }
      ],
      caseBreakdown: [
        { labelZh: '场景', bodyZh: '某零售公司的会员名单被外部获取，同时官网下单功能短暂中断。' },
        { labelZh: '分析', bodyZh: '名单外泄损害机密性；下单中断损害可用性。二者可能同源（入侵），但保护目标不同。' },
        { labelZh: '课堂结论', bodyZh: '先分清“被看到了”还是“用不了了”，再选加密、访问控制、备份或冗余等对策。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '常见出法：给一段事故描述，问最合适说明/最优先保护目标/不恰当对策。题干关键词常是泄露、篡改、停止、资产、威胁、脆弱性。',
        keywords: ['机密性', '完整性', '可用性', '信息资产', '威胁', '脆弱性']
      },
      examCues: [
        { cueZh: '出现“被不应看的人看到”→ 机密性。' },
        { cueZh: '出现“内容被改/计算错误”→ 完整性。' },
        { cueZh: '出现“系统停/打不开/超时”→ 可用性。' }
      ],
      mistakeComparisons: [
        { aZh: '机密性', bZh: '完整性', bodyZh: '机密性管“谁能看”，完整性管“有没有被改”。泄露客户名单是机密性；订单金额被改是完整性。' },
        { aZh: '信息安全', bZh: '杀毒软件', bodyZh: '杀毒只是技术控制的一种；信息安全还包括资产分类、权限、备份、教育、规程与持续改进。' }
      ],
      memoryTips: [
        { tipZh: 'CIA 口诀：看得到吗？被改过吗？用得了吗？' },
        { tipZh: '做题先画四格：对象 / 原因 / 影响 / 对策。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题通常检验你是否能把案例现象映射到 CIA 或信息资产保护，而不是只认攻击名称。'
      }
    })
  },

  'sg-1-1-2': {
    titleZh: '1-1-2 案例一：恶意软件感染',
    overviewZh: '恶意软件感染案例训练你按“进入路径 → 发作现象 → 业务影响 → 初动响应”读题。附件、网页挂马、U 盘等都可能是入口；影响可能是泄露、篡改或业务中断。重点不是背病毒名词，而是会判断先隔离什么、保留哪些证据、如何避免扩大损害。',
    learningGoalZh: '能根据感染路径与症状，区分恶意软件场景，并说明初动响应的合理顺序。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '恶意软件是一类恶意程序的总称，病毒、木马、蠕虫等是其子类。课堂里更重要的是感染链：用户打开附件或访问恶意站点后，程序落地执行，再窃取账号、改文件或横向扩散。响应时先隔离终端、断网或限制通信，再取证与清除，最后做账号重置与补丁加固。只重启或只删文件，往往会漏掉持续控制手段。',
        examFocusZh: '题干常出现附件、宏、异常外连、杀软告警、信息泄露。问的是原因定位、初动动作或影响类型，而不是让你背厂商产品名。',
        commonMistakeZh: '一看到“中毒”就只选杀毒；忽略隔离、密码重置、日志保留，以及是否已造成泄露。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '把恶意软件题和勒索软件题分开：若强调加密要赎金、恢复依赖备份，更偏勒索软件；若强调间谍行为、后门、附件传播、异常进程，更偏一般恶意软件感染。再看题目要你回答的是“怎么进来的”还是“先做什么”。',
        examFocusZh: '关键词：附件、感染、不正程序、泄露、清除、初动响应。排除项常混入“先全公司公开致歉”或“先升级业务功能”等不对准事故链的动作。',
        commonMistakeZh: '不确认感染路径就直接恢复业务，可能把恶意程序再次带上线。'
      }
    ],
    commonTraps: [
      { trapZh: '把所有恶意软件场景都当成勒索软件。' },
      { trapZh: '忽略隔离与取证，只做清除。' }
    ],
    learningExperience: le({
      goalZh: '会用感染链读恶意软件案例，并给出合理初动响应。',
      goalJa: 'マルウェア感染を経路・影響・初動の順で説明できる。',
      coreConcept: {
        headingZh: '恶意软件题考的是“链”，不是名词表',
        headingJa: 'マルウェアは感染チェーンで読む',
        bodyZh: '入口、执行、权限、影响、响应是一条链。附件只是入口示例；真正危险是执行后的控制权与数据后果。课堂顺序永远是：止损 → 查清 → 清除 → 加固。',
        bodyJa: '侵入経路、実行、影響、初動対応を一連で捉える。'
      },
      whyImportant: {
        headingZh: '为什么企业与考试都反复出现',
        bodyZh: '现实中最多发的初始入侵路径之一就是邮件与浏览；考试用它检验你是否会“先隔离再处理”，而不是只会说“中毒了”。'
      },
      prerequisiteConcepts: [
        { labelZh: '附件与执行', bodyZh: '用户动作常是触发条件，程序获得执行机会后才形成感染。' },
        { labelZh: '影响形态', bodyZh: '泄露、篡改、中断分别对应不同保护目标。' },
        { labelZh: '事件响应', bodyZh: '先控制扩散，再分析与恢复。' }
      ],
      caseBreakdown: [
        { labelZh: '发生了什么', bodyZh: '员工打开来路不明的发票附件后，终端出现异常外连，部分客户资料疑似外传。' },
        { labelZh: '为什么危险', bodyZh: '不只是单机变慢，而是凭证与文件可能被持续窃取。' },
        { labelZh: '正确思路', bodyZh: '断网/隔离终端，重置相关账号，保留日志与样本，再清除并修补入口。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '给邮件或 Web 场景，问最恰当初动、最可能原因或应关注的影响。',
        keywords: ['附件', '感染', '不正程序', '信息泄露', '初动响应']
      },
      examCues: [
        { cueZh: '附件 + 宏/可执行文件 → 入口线索。' },
        { cueZh: '异常外连/未知进程 → 可能已失陷。' }
      ],
      mistakeComparisons: [
        { aZh: '病毒', bZh: '木马', bodyZh: '传统病毒强调自我复制感染文件；木马更强调伪装成正常程序、打开后门。题干若强调“看起来像正常软件”，更偏木马。' },
        { aZh: '清除', bZh: '隔离', bodyZh: '清除是去掉恶意代码；隔离是先阻止扩散。顺序错了会边清边扩散。' }
      ],
      memoryTips: [
        { tipZh: '响应四步：隔—查—清—固。' },
        { tipZh: '先问“怎么进来的”，再问“删不删得掉”。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题侧重感染路径与响应判断，检验你是否会把现象映射到恶意软件事件处理。'
      }
    })
  },

  'sg-1-1-3': {
    titleZh: '1-1-3 案例二：勒索软件与备份',
    overviewZh: '勒索软件会把业务数据加密，使“文件还在却不能用”。真正决定能否恢复的，不是有没有杀毒软件，而是备份是否隔离、是否多代、是否验证过恢复，以及 BCP 是否规定了业务优先级。本单元把攻击影响和恢复能力绑在一起讲。',
    learningGoalZh: '能把勒索软件案例拆成加密影响、备份条件、恢复步骤与业务连续性判断，并指出同网备份的风险。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '勒索软件的关键伤害是让数据或系统失去可用性，有时还伴随数据窃取。终端隔离只能止血，不能自动让业务回来。恢复靠的是未被加密的备份，以及可执行的恢复剧本。若备份与生产长期同网在线，攻击可能一并加密备份。因此要谈离线/隔离保存、世代管理、定期恢复演练。',
        examFocusZh: '关键词：勒索软件、加密、备份、恢复、网络隔离、业务连续性。题目常问“哪种备份方式更有效”或“仅有备份为何仍不够”。',
        commonMistakeZh: '以为“做过备份”就安全，却不看备份是否离线、是否测过恢复。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '和普通恶意软件题相比，勒索软件题更强调恢复路径。若选项只写“查杀木马”而不提隔离备份与业务恢复，通常不完整。看到“赎金”不要把焦点放在付不付，考试更常考技术与管理上的可恢复性。',
        examFocusZh: '出现离线保管、世代管理、恢复确认、优先业务，多半在考恢复能力与 BCP。',
        commonMistakeZh: '把同网共享盘备份当成充分对策。'
      }
    ],
    commonTraps: [
      { trapZh: '把备份与恢复混为一谈。' },
      { trapZh: '认为同网备份足够抵御勒索软件。' }
    ],
    learningExperience: le({
      goalZh: '先理解勒索软件、备份、恢复、离线隔离和 BCP 的关系，再用这些条件判断案例题的正确对策。',
      goalJa: 'ランサムウェアの事例を、攻撃の仕組み、バックアップの保存条件、復旧手順、業務継続の判断に分けて読めるようにする。',
      coreConcept: {
        headingZh: '勒索软件对策要看到“能否恢复业务”',
        headingJa: 'ランサムウェア対策は復旧可能性まで含めて考える',
        bodyZh: '勒索软件不是“普通病毒感染”四个字就能解释完。它会把数据加密，让企业即使有设备也无法使用业务数据。备份也不是复制一份就结束：如果备份一直连在同一网络里，也可能一起被加密。考试要你判断的是恢复能力，所以要同时看备份介质是否隔离、是否有多代版本、是否做过恢复测试，以及 BCP 是否规定了业务优先级。',
        bodyJa: '暗号化被害の後に業務を戻せるかが焦点。隔離バックアップ、世代管理、復旧訓練、BCPをセットで考える。'
      },
      whyImportant: {
        headingZh: '为什么考试与企业都极端重视',
        bodyZh: '勒索软件直接打击可用性与现金流转。有备份却恢复失败，等于没有备份。这一节把“安全投入”从杀毒扩展到恢复体系。'
      },
      prerequisiteConcepts: [
        { labelZh: '被加密的数据', bodyZh: '文件还在不代表业务可继续，关键是能否恢复可读可用的数据。' },
        { labelZh: '备份与恢复', bodyZh: '备份要能真的恢复，只有“有一份副本”不够。' },
        { labelZh: '业务连续性', bodyZh: 'BCP 规定先恢复什么、如何临时维持业务。' }
      ],
      caseBreakdown: [
        { labelZh: '发生了什么', bodyZh: '攻击者加密业务数据，使共享与业务系统无法正常使用。' },
        { labelZh: '为什么同网备份脆弱', bodyZh: '备份介质一直在线且同网时，攻击扩散可能连备份一起加密。' },
        { labelZh: '正确对策', bodyZh: '隔离感染终端，用未加密备份恢复，并按 BCP 优先恢复关键业务。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '常给勒索场景，比较备份方式或恢复步骤是否完整。',
        keywords: ['勒索软件', '加密', '备份', '恢复', '离线', 'BCP']
      },
      examCues: [
        { cueZh: '看到“有备份”还要继续看是否离线、多代、验证恢复。' },
        { cueZh: '强调业务继续与优先级时，从 BCP 角度读。' }
      ],
      mistakeComparisons: [
        { aZh: '备份', bZh: '恢复', bodyZh: '备份是保留副本；恢复是用副本让业务回来。考试爱设“有备份但没测恢复”的陷阱。' },
        { aZh: '同网保存', bZh: '离线保管', bodyZh: '同网方便但可能一起被加密；离线牺牲便利，换恢复底线。' }
      ],
      memoryTips: [
        { tipZh: '勒索三问：加密了吗？备份还干净吗？业务怎么续？' },
        { tipZh: '备份合格线：隔离 + 多代 + 演练。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题用于检验你是否把勒索影响读成恢复问题，而不是普通杀毒问题。'
      }
    })
  },

  'sg-1-2-1': {
    titleZh: '1-2-1 信息安全的目的与思考方式',
    overviewZh: '信息安全的根本目的，是支撑业务持续运行与可信。思考方式不是“零事故”，而是在资源有限下管理风险：识别资产与风险，选择可接受的控制，并持续改进。控制措施既包括技术，也包括规程、组织和人。',
    learningGoalZh: '能说明信息安全目标与风险管理思路，区分“消除一切风险”与“把风险控制在可接受范围”。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '先有业务目标，才有安全目标。安全目标通常表述为保护机密性、完整性、可用性，并支撑业务连续性。风险思考要求你比较“出事损失”和“对策成本”，选择避免、降低、转移或接受。控制措施要可执行、可检查，而不是只写口号。',
        examFocusZh: '题干出现风险、目标、控制、业务连续性时，优先看是否符合风险管理逻辑。',
        commonMistakeZh: '把目标写成“绝不发生任何事故”，忽略可接受风险与资源约束。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '若题目给两个对策，一个昂贵但收益有限，一个对准高影响风险，正确项往往是后者。安全是经营判断，不只是技术炫技。',
        examFocusZh: '关键词：风险、安全目标、业务连续性、控制措施。',
        commonMistakeZh: '只选“最强技术”，不问是否对准业务风险。'
      }
    ],
    commonTraps: [
      { trapZh: '追求零风险而忽视成本与可行性。' },
      { trapZh: '把安全目标与业务目标割裂。' }
    ],
    learningExperience: le({
      goalZh: '用“目标—风险—控制”讲清信息安全思考方式。',
      goalJa: '目的、リスク、管理策の関係で情報セキュリティを説明する。',
      coreConcept: {
        headingZh: '安全是为业务服务的风险管理',
        headingJa: 'セキュリティは事業のためのリスク管理',
        bodyZh: '没有业务对象，安全就失去坐标。先明确要保护什么、不能中断什么，再决定控制强度。考试爱考“看起来很安全但偏离目标”的选项。',
        bodyJa: '守る対象と許容できるリスクを先に決める。'
      },
      whyImportant: {
        headingZh: '为什么这是管理章节的总开关',
        bodyZh: '后面的方针、ISMS、风险评估都建立在“目标与风险”上。企业预算评审也问同样的话：为什么要做、不做会怎样。'
      },
      prerequisiteConcepts: [
        { labelZh: '风险', bodyZh: '威胁利用脆弱性造成影响的可能性与后果。' },
        { labelZh: '控制措施', bodyZh: '为降低风险而采取的管理、技术或物理手段。' },
        { labelZh: '业务连续性', bodyZh: '关键业务在中断后仍能持续或尽快恢复。' }
      ],
      caseBreakdown: [
        { labelZh: '场景', bodyZh: '公司要在“全盘加密所有终端”和“先保护客户数据库与备份”之间分配预算。' },
        { labelZh: '判断', bodyZh: '若客户数据泄露影响最大，应优先对准高影响资产，而不是平均用力。' },
        { labelZh: '结论', bodyZh: '目的决定优先级，优先级决定控制组合。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '常问哪项最符合信息安全目的，或哪项风险应对更合理。',
        keywords: ['风险', '安全目标', '控制', '业务连续性']
      },
      examCues: [
        { cueZh: '出现“可接受风险/残留风险”→ 风险管理思维。' },
        { cueZh: '出现“支撑业务”→ 安全服务业务，不是对立。' }
      ],
      mistakeComparisons: [
        { aZh: '安全目标', bZh: '技术手段', bodyZh: '目标是要达到的状态；技术是实现手段。手段再强，对错目标也无效。' },
        { aZh: '降低风险', bZh: '接受风险', bodyZh: '降低是采取措施减少；接受是明知仍保留并监控，通常用于低影响场景。' }
      ],
      memoryTips: [
        { tipZh: '三连问：保什么？怕什么？做什么？' },
        { tipZh: '安全投入按影响排序，不按热闹排序。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题检验你是否能从业务与风险角度解释安全目的。'
      }
    })
  },

  'sg-1-2-2': {
    titleZh: '1-2-2 信息安全基本要素（CIA 与扩展）',
    overviewZh: 'CIA 是基础三要素：机密性、完整性、可用性。扩展常讨论真实性、可问责性、不可否认性，用于解释认证、日志与数字签名等控制为何必要。本单元训练你把概念精确拆开，避免混用。',
    learningGoalZh: '能准确区分 CIA 与扩展属性，并能用生活化业务场景举例。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '机密性：防止未授权披露。完整性：防止未授权修改并保证正确。可用性：在需要时可用。真实性关注“是不是声称的那个人/系统”；可问责性关注“谁做了什么可追溯”；不可否认性关注“事后不能抵赖”。它们常由认证、授权、日志、签名等机制支撑。',
        examFocusZh: '题干给现象让你选被破坏的属性。关键词：泄露、篡改、中断、冒充、抵赖、日志。',
        commonMistakeZh: '把“登录成功”误当成完整性；把“网站慢”误当成机密性。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '先找损失形态：被看见、被改写、不能用、身份假、行为赖账。再映射属性。一个事故可同时伤及多项，但选项通常有一个“最直接”属性。',
        examFocusZh: '出现数字签名/证书，多关联真实性或不可否认性；出现审计日志，多关联可问责性。',
        commonMistakeZh: '把所有“安全”都答成机密性。'
      }
    ],
    commonTraps: [
      { trapZh: 'CIA 三要素互相替换。' },
      { trapZh: '忽略扩展属性与控制手段的对应。' }
    ],
    learningExperience: le({
      goalZh: '把 CIA 与扩展属性讲到能举业务例子。',
      goalJa: 'CIAと付加的属性を事例で区別できる。',
      coreConcept: {
        headingZh: '属性是“损失类型的标签”',
        headingJa: '属性は損失のラベル',
        bodyZh: '不要背翻译，背损失。泄露贴机密性，改数贴完整性，宕机贴可用性，假冒贴真实性，抵赖贴不可否认性，查不出人贴可问责性。',
        bodyJa: '何が損なわれたかで属性を選ぶ。'
      },
      whyImportant: {
        headingZh: '为什么几乎每套题都考',
        bodyZh: '它是全部分类题的底层语言。管理题、技术题、法规题最终都会问“破坏了什么性质”。'
      },
      prerequisiteConcepts: [
        { labelZh: '授权与未授权', bodyZh: '很多定义都建立在“是否获得许可”上。' },
        { labelZh: '日志与证据', bodyZh: '可问责与不可否认需要记录与证据链。' }
      ],
      caseBreakdown: [
        { labelZh: '场景A', bodyZh: '工资表被同事偷看 → 机密性。' },
        { labelZh: '场景B', bodyZh: '转账金额被改成更大数字 → 完整性。' },
        { labelZh: '场景C', bodyZh: '网银被钓鱼站冒充 → 真实性。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '最常见是“下列哪项说明正确/对应哪一属性”。',
        keywords: ['机密性', '完整性', '可用性', '真实性', '可问责性', '不可否认性']
      },
      examCues: [
        { cueZh: '“被看到”→ 机密性；“被改掉”→ 完整性；“打不开”→ 可用性。' }
      ],
      mistakeComparisons: [
        { aZh: '可用性', bZh: '完整性', bodyZh: '可用性是能不能用；完整性是内容对不对。系统能打开但数据错了，是完整性问题。' },
        { aZh: '真实性', bZh: '不可否认性', bodyZh: '真实性确认“当下身份/来源是否真”；不可否认性强调“事后无法否认曾执行某行为”。' }
      ],
      memoryTips: [
        { tipZh: 'CIA：看、改、用。' },
        { tipZh: '扩展：是谁、可追、难赖。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题多直接映射属性判断。'
      }
    })
  },

  'sg-1-2-3': {
    titleZh: '1-2-3 威胁的种类',
    overviewZh: '威胁可从来源与性质分类：人为故意、人为过失、物理环境、系统故障与技术攻击等。分类的意义是帮助选择对策：人的问题靠教育与流程，物理靠设施，技术靠系统控制。',
    learningGoalZh: '能按威胁类型给案例贴标签，并说明对应控制方向。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '威胁不是已经发生的事故，而是“可能造成损害的来源”。人为错误如误发邮件；灾害如火灾断电；故障如磁盘损坏；非法访问则是故意入侵。分类后才能避免“只买设备不改流程”或“只训人不做备份”。',
        examFocusZh: '给场景选威胁类型。关键词：人为失误、灾害、故障、非法访问。',
        commonMistakeZh: '把已发生的影响（泄露）当成威胁类型本身。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '先问“谁/什么在造成损害可能性”：人？自然？设备？攻击者？再选类型。影响可用于辅助，但不能替代分类。',
        examFocusZh: '自然灾害与设备故障都可能造成可用性下降，但来源不同，控制也不同。',
        commonMistakeZh: '把所有停机都归为攻击。'
      }
    ],
    commonTraps: [
      { trapZh: '混淆威胁与影响。' },
      { trapZh: '只识别外部攻击，忽略内部失误。' }
    ],
    learningExperience: le({
      goalZh: '会给威胁分类，并连到控制方向。',
      goalJa: '脅威を種類分けし対策方向へつなげる。',
      coreConcept: {
        headingZh: '分类是为了选对药',
        headingJa: '分類は対策のため',
        bodyZh: '同样是“系统停了”，可能是水灾、磁盘坏了或 DDoS。分类错了，对策就会错。',
        bodyJa: '原因の出どころで脅威を分ける。'
      },
      whyImportant: {
        headingZh: '为什么风险管理从识别威胁开始',
        bodyZh: '风险评估第一步常是识别威胁源。考试用分类题检查你是否只会背攻击名。'
      },
      prerequisiteConcepts: [
        { labelZh: '威胁', bodyZh: '可能带来损害的潜在原因。' },
        { labelZh: '脆弱性', bodyZh: '可被威胁利用的弱点。' }
      ],
      caseBreakdown: [
        { labelZh: '误删除客户数据', bodyZh: '偏人为过失威胁。' },
        { labelZh: '机房进水', bodyZh: '偏物理/环境威胁。' },
        { labelZh: '外部扫描撞库', bodyZh: '偏技术/故意攻击威胁。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '给出短场景，问属于哪类威胁。',
        keywords: ['人为', '灾害', '故障', '非法访问']
      },
      examCues: [
        { cueZh: '“操作失误”→ 人为过失。' },
        { cueZh: '“地震/停电”→ 灾害或物理环境。' }
      ],
      mistakeComparisons: [
        { aZh: '人为过失', bZh: '非法访问', bodyZh: '过失无恶意，非法访问强调未授权故意行为。' },
        { aZh: '故障', bZh: '灾害', bodyZh: '故障多来自系统/部件；灾害来自外部环境。' }
      ],
      memoryTips: [
        { tipZh: '威胁四盒：人、自然、设备、攻击者。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题检验威胁分类是否准确。'
      }
    })
  },

  'sg-1-2-4': {
    titleZh: '1-2-4 恶意软件与不正程序',
    overviewZh: '恶意软件包含病毒、蠕虫、木马、间谍软件、后门等。分类依据通常是传播方式与行为特征：是否依附文件、是否自传播、是否伪装、是否窃密、是否留后门。学习目标是会辨型，并知道防护与响应重点不同。',
    learningGoalZh: '能区分主要恶意软件类型，并说明各自典型行为与防护关注点。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '病毒常依附宿主文件传播；蠕虫可利用网络自我扩散；木马伪装成正当程序诱导安装；间谍软件侧重窃取；后门留下持续入口。现实样本可能组合多种特征，但考试仍要求抓“最显著特征”。',
        examFocusZh: '给行为描述选类型。关键词：自我复制、网络扩散、伪装、窃密、远程控制。',
        commonMistakeZh: '用“都是病毒”一句话代替分类。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '先看传播：要不要宿主？会不会自动扫网？再看目的：搞破坏、要控制权还是偷数据？后门强调持续性访问通道。',
        examFocusZh: '“看起来像正常软件”→ 木马；“自动感染局域网”→ 蠕虫概率高。',
        commonMistakeZh: '把后门与木马完全等同，忽略后门也可由其他感染后植入。'
      }
    ],
    commonTraps: [
      { trapZh: '类型名称与行为对不上。' },
      { trapZh: '忽略组合型样本，死记硬背单一特征。' }
    ],
    learningExperience: le({
      goalZh: '建立恶意软件类型对照表，能做题可迁移。',
      goalJa: '不正プログラムの種類を特徴で区別する。',
      coreConcept: {
        headingZh: '按“传播 + 行为”分类',
        headingJa: '伝播と挙動で分ける',
        bodyZh: '不要背名单，背两列：它怎么走，它想干什么。',
        bodyJa: '広がり方と目的で分類する。'
      },
      whyImportant: {
        headingZh: '为什么必须分清',
        bodyZh: '防护重点不同：蠕虫更重网络暴露面，木马更重来源与执行控制，间谍软件更重隐私与外连监测。'
      },
      prerequisiteConcepts: [
        { labelZh: '宿主与执行', bodyZh: '某些类型需要用户执行或文件宿主。' },
        { labelZh: '远程控制', bodyZh: '后门/部分木马用于长期操控。' }
      ],
      caseBreakdown: [
        { labelZh: '邮件带“发票.exe”', bodyZh: '更像木马投递。' },
        { labelZh: '漏洞利用后全网扫端口扩散', bodyZh: '更像蠕虫。' },
        { labelZh: '静默上传浏览器密码', bodyZh: '更像间谍软件行为。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '描述特征选名称，或选对应防护。',
        keywords: ['病毒', '蠕虫', '木马', '间谍软件', '后门']
      },
      examCues: [
        { cueZh: '自我感染文件 → 病毒色彩。' },
        { cueZh: '无需用户、网络扩散 → 蠕虫色彩。' }
      ],
      mistakeComparisons: [
        { aZh: '蠕虫', bZh: '病毒', bodyZh: '蠕虫强自传播；病毒更依赖宿主文件。' },
        { aZh: '木马', bZh: '后门', bodyZh: '木马强调伪装进入；后门强调留下通道。木马可安装后门。' }
      ],
      memoryTips: [
        { tipZh: '虫会爬网，毒会附着，马会伪装，谍会偷听，门会留口。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空，不伪造。'
      }
    })
  },

  'sg-1-2-5': {
    titleZh: '1-2-5 不正与攻击机制',
    overviewZh: '攻击常按链理解：侦察、初始访问、提权、横向移动、达成目标。冒充、漏洞利用、日志清理都是链上动作。学习重点是看懂攻击者如何推进，以及防守者应在哪一环设障与取证。',
    learningGoalZh: '能描述攻击链基本环节，并解释提权、冒充、漏洞与日志的意义。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '漏洞是可被利用的弱点；冒充用于骗取信任；提权把普通权限抬到管理权限；日志则是还原过程的证据。攻击成功往往不是单点，而是多个薄弱环节串联。',
        examFocusZh: '题干描述“先普通用户登录，后获得管理员权限”→ 提权。描述“伪装成正规站点/用户”→ 冒充。',
        commonMistakeZh: '只记攻击名字，不会对应到链上位置。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '读题时标注阶段：怎么进来、权限如何变大、目标是什么、有没有抹痕迹。选项若只解决末端症状，可能不是最佳。',
        examFocusZh: '关键词：权限提升、冒充、脆弱性、日志、攻击链。',
        commonMistakeZh: '忽视日志，导致无法追责与复盘。'
      }
    ],
    commonTraps: [
      { trapZh: '把提权与初始入侵混为一谈。' },
      { trapZh: '认为没有日志也能完整还原攻击。' }
    ],
    learningExperience: le({
      goalZh: '用攻击链解释不正访问如何发生与扩大。',
      goalJa: '攻撃の流れで不正を説明する。',
      coreConcept: {
        headingZh: '攻击是推进过程，不是单次点击',
        headingJa: '攻撃は連鎖',
        bodyZh: '进来 ≠ 成功。很多损害发生在提权与横向移动之后。防守要分层：减少入口、限制权限、保留证据。',
        bodyJa: '侵入、権限、目的達成を分けて見る。'
      },
      whyImportant: {
        headingZh: '为什么管理与技术都要懂',
        bodyZh: '权限设计、日志策略、漏洞管理都对应攻击链不同环节。考试用它连接技术点与管理点。'
      },
      prerequisiteConcepts: [
        { labelZh: '漏洞', bodyZh: '可被利用的弱点。' },
        { labelZh: '权限', bodyZh: '能做什么的边界。' },
        { labelZh: '日志', bodyZh: '行为记录，用于检测与审计。' }
      ],
      caseBreakdown: [
        { labelZh: '初始', bodyZh: '通过弱口令进入普通账号。' },
        { labelZh: '扩大', bodyZh: '利用本地漏洞提权到管理员。' },
        { labelZh: '收尾', bodyZh: '清理日志试图掩盖痕迹。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '给攻击过程片段，问名称或最有效对策环节。',
        keywords: ['提权', '冒充', '漏洞', '日志', '攻击链']
      },
      examCues: [
        { cueZh: '权限从低到高 → 提权。' },
        { cueZh: '假装合法身份 → 冒充。' }
      ],
      mistakeComparisons: [
        { aZh: '冒充', bZh: '提权', bodyZh: '冒充解决“我是谁”的欺骗；提权解决“我能做什么”的升级。' },
        { aZh: '检测', bZh: '取证', bodyZh: '检测发现异常；取证保全证据并还原过程，依赖日志与时间线。' }
      ],
      memoryTips: [
        { tipZh: '链上五字：进、扩、提、横、逃。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空。'
      }
    })
  },

  'sg-1-2-6': {
    titleZh: '1-2-6 第1章演习：把概念用到案例',
    overviewZh: '本章演习不是另起炉灶，而是把 CIA、威胁分类、恶意软件、攻击机制与响应思路放到综合题里。做题顺序建议：先定损失属性，再定威胁/攻击类型，最后选对准原因的对策。',
    learningGoalZh: '能在综合题中同时使用第1章多个概念，并写出判断路径。',
    sections: [
      {
        headingZh: '机制与作用',
        explanationZh: '演习题常混合多线索。正确方法是分层标注，而不是凭感觉选“最安全”的词。例如：先确认是否泄露（机密性），再看是否由附件感染（恶意软件路径），最后判断初动是否应隔离。',
        examFocusZh: '综合题会同时出现资产、威胁、影响、控制。按“属性→类型→对策”作答更稳。',
        commonMistakeZh: '看到多个术语就全选，或只抓最后一个出现的词。'
      },
      {
        headingZh: '案例题中的区分方法',
        explanationZh: '把选项逐个放回题干检验：它是否解释了原因？是否减少了已识别风险？是否可执行？不能解释题干条件的“正确术语”也是干扰项。',
        examFocusZh: '关键词来自全章：CIA、威胁、恶意软件、控制、响应。',
        commonMistakeZh: '用第2章以后的专深技术硬套第1章基础题。'
      }
    ],
    commonTraps: [
      { trapZh: '综合题中忽略题干条件，只背术语。' },
      { trapZh: '对策与原因错位。' }
    ],
    learningExperience: le({
      goalZh: '形成第1章综合题的固定解题脚本。',
      goalJa: '第1章の知識を総合問題で使う手順を身につける。',
      coreConcept: {
        headingZh: '演习是“组装”，不是新知识灌输',
        headingJa: '演習は組み立て',
        bodyZh: '把前面单元的标签系统装到同一案例上。谁保护对象，谁是威胁，损害哪项 CIA，对策对准哪一环。',
        bodyJa: '属性、脅威、対策を同一事例に貼る。'
      },
      whyImportant: {
        headingZh: '为什么单独成节',
        bodyZh: '考试真实形态就是综合。只会单点定义，遇到长文案会崩。'
      },
      prerequisiteConcepts: [
        { labelZh: 'CIA', bodyZh: '损失标签。' },
        { labelZh: '威胁/恶意软件/攻击链', bodyZh: '原因与路径标签。' },
        { labelZh: '控制与响应', bodyZh: '对策标签。' }
      ],
      caseBreakdown: [
        { labelZh: '读题', bodyZh: '圈出对象、现象、时间线。' },
        { labelZh: '贴标签', bodyZh: '属性、威胁类型、是否恶意软件、是否需隔离。' },
        { labelZh: '选对策', bodyZh: '只保留能解释并缓解主问题的选项。' }
      ],
      examPattern: {
        headingZh: 'IPA 怎么考',
        bodyZh: '长案例 + 多问，或单问但选项跨概念。',
        keywords: ['综合判断', 'CIA', '威胁', '恶意软件', '控制']
      },
      examCues: [
        { cueZh: '先属性后技术，先原因后工具。' }
      ],
      mistakeComparisons: [
        { aZh: '定义题思路', bZh: '案例题思路', bodyZh: '定义题匹配语句；案例题要条件→结论。' }
      ],
      memoryTips: [
        { tipZh: '综合题三板斧：标属性、定类型、选对准对策。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空。'
      }
    })
  }
};

const chapter1TermDefs = {
  'CIA': {
    definitionJa: '機密性・完全性・可用性の三つの基本特性をまとめた考え方。',
    definitionZh: '机密性、完整性、可用性三要素的合称，用于描述信息应被保护的基本状态。',
    examCueZh: '题干谈泄露/篡改/中断时，优先映射到 CIA。'
  },
  'CIA Triad': {
    definitionJa: '機密性・完全性・可用性の三つの基本特性をまとめた考え方。',
    definitionZh: '机密性、完整性、可用性三要素的合称，用于描述信息应被保护的基本状态。',
    examCueZh: '题干谈泄露/篡改/中断时，优先映射到 CIA。'
  },
  'Confidentiality': {
    definitionJa: '許可された者だけが情報にアクセスできる特性。',
    definitionZh: '仅允许授权者访问信息的特性，防止未授权披露。',
    examCueZh: '“被偷看/外泄”→ 机密性。'
  },
  'Integrity': {
    definitionJa: '情報が不正に改ざんされず正確である特性。',
    definitionZh: '信息未被未授权篡改、保持正确完整的特性。',
    examCueZh: '“被改数/内容不对”→ 完整性。'
  },
  'Availability': {
    definitionJa: '必要なときに情報やシステムを利用できる特性。',
    definitionZh: '在需要时能够使用信息或系统的特性。',
    examCueZh: '“打不开/停服/超时”→ 可用性。'
  },
  'Asset': {
    definitionJa: '組織にとって価値があり保護対象となる情報や資源。',
    definitionZh: '对组织有价值、需要保护的信息与相关资源。',
    examCueZh: '先找保护对象是什么资产。'
  },
  'Threat': {
    definitionJa: '資産に損害を与える可能性のある要因。',
    definitionZh: '可能对资产造成损害的潜在因素或来源。',
    examCueZh: '区分威胁（来源）与影响（结果）。'
  },
  'Vulnerability': {
    definitionJa: '脅威に付け込まれる弱点。',
    definitionZh: '可被威胁利用的弱点。',
    examCueZh: '弱口令、未打补丁、权限过大等都是脆弱性线索。'
  },
  'Malware': {
    definitionJa: '悪意ある動作をするプログラムの総称。',
    definitionZh: '以恶意行为为目的的程序总称。',
    examCueZh: '先看行为与传播，再细分类型。'
  },
  'Virus': {
    definitionJa: '宿主ファイルに寄生して広がる不正プログラム。',
    definitionZh: '常依附宿主文件进行感染传播的恶意程序。',
    examCueZh: '强调寄生/感染文件时偏病毒。'
  },
  'Trojan': {
    definitionJa: '正当なプログラムに見せかけて導入させる不正プログラム。',
    definitionZh: '伪装成正当程序诱导安装的恶意软件。',
    examCueZh: '“看起来正常却有害”→ 木马。'
  },
  'Trojan Horse': {
    definitionJa: '正当なプログラムに見せかけて導入させる不正プログラム。',
    definitionZh: '伪装成正当程序诱导安装的恶意软件。',
    examCueZh: '“看起来正常却有害”→ 木马。'
  },
  'Worm': {
    definitionJa: 'ネットワークなどを通じて自己拡散する不正プログラム。',
    definitionZh: '可借助网络等途径自我扩散的恶意程序。',
    examCueZh: '自动扩散/扫网 → 蠕虫。'
  },
  'Spyware': {
    definitionJa: '利用者情報を密かに収集する不正プログラム。',
    definitionZh: '在用户不知情下收集信息的恶意程序。',
    examCueZh: '静默上传账号/键盘记录 → 间谍软件。'
  },
  'Backdoor': {
    definitionJa: '正規の認証を迂回して侵入し続けるための入口。',
    definitionZh: '绕过正常认证、便于持续入侵的入口。',
    examCueZh: '“留下以后还能进”→ 后门。'
  },
  'Attachment': {
    definitionJa: 'メールなどに付けられたファイル。攻撃の侵入経路になりやすい。',
    definitionZh: '邮件等附带的文件，常被用作感染入口。',
    examCueZh: '附件 + 执行 → 入口线索。'
  },
  'Incident Response': {
    definitionJa: 'インシデント発生時の初動から復旧、再発防止までの対応活動。',
    definitionZh: '安全事件从发现、遏制、清除到恢复与改进的响应活动。',
    examCueZh: '问“先做什么”时，优先想隔离与止损。'
  },
  'Risk': {
    definitionJa: '脅威が脆弱性を突いて影響を与える可能性と影響の大きさ。',
    definitionZh: '威胁利用脆弱性造成影响的可能性与影响程度。',
    examCueZh: '风险=可能性×影响，不是单点威胁名。'
  },
  'Security Objective': {
    definitionJa: '組織が情報セキュリティで達成したい状態や目標。',
    definitionZh: '组织希望通过信息安全达成的状态与目标。',
    examCueZh: '目标先于手段。'
  },
  'Business Continuity': {
    definitionJa: '重要業務を中断させず、または早期に再開できること。',
    definitionZh: '关键业务不中断或能尽快恢复的能力。',
    examCueZh: '业务优先级、恢复顺序 → BCP/连续性。'
  },
  'Control': {
    definitionJa: 'リスクを抑えるための管理的・技術的・物理的な施策。',
    definitionZh: '用于抑制风险的管理、技术或物理措施。',
    examCueZh: '对策要对准已识别风险。'
  },
  'Authenticity': {
    definitionJa: '主体や情報が真正であることを保証する特性。',
    definitionZh: '保证主体或信息来源真实可信的特性。',
    examCueZh: '冒充/钓鱼站点 → 真实性。'
  },
  'Accountability': {
    definitionJa: '誰が何をしたかを追跡できる特性。',
    definitionZh: '能够追踪“谁做了什么”的特性。',
    examCueZh: '审计/日志追责 → 可问责性。'
  },
  'Non-repudiation': {
    definitionJa: '後から行為を否認できないようにする特性。',
    definitionZh: '使行为人事后无法否认其行为的特性。',
    examCueZh: '数字签名常支撑不可否认性。'
  },
  'Human Error': {
    definitionJa: '意図しない人の操作ミスによって生じる脅威。',
    definitionZh: '由非故意的人为操作失误带来的威胁。',
    examCueZh: '误发送/误删除 → 人为过失。'
  },
  'Disaster': {
    definitionJa: '地震、火災、水害など環境的な脅威。',
    definitionZh: '地震、火灾、水灾等环境性威胁。',
    examCueZh: '自然灾害场景。'
  },
  'Failure': {
    definitionJa: '機器やシステムの故障による脅威。',
    definitionZh: '设备或系统故障导致的威胁。',
    examCueZh: '硬件坏了/系统崩溃且无攻击迹象。'
  },
  'Unauthorized Access': {
    definitionJa: '許可なくシステムや情報へアクセスする行為。',
    definitionZh: '未经许可访问系统或信息的行为。',
    examCueZh: '未授权登录/越权访问。'
  },
  'Privilege Escalation': {
    definitionJa: '低い権限から高い権限へ引き上げる攻撃手法。',
    definitionZh: '从低权限提升到高权限的攻击手法。',
    examCueZh: '普通用户变管理员 → 提权。'
  },
  'Spoofing': {
    definitionJa: '正当な主体になりすます攻撃。',
    definitionZh: '伪装成合法主体的攻击。',
    examCueZh: '假站/假身份 → 冒充。'
  },
  'Log': {
    definitionJa: 'システムや利用者の動作記録。',
    definitionZh: '系统与用户行为的记录。',
    examCueZh: '检测、审计、取证都依赖日志。'
  },
  'Attack Chain': {
    definitionJa: '偵察から目的達成までの攻撃の一連の流れ。',
    definitionZh: '从侦察到达成目标的一连串攻击步骤。',
    examCueZh: '多阶段描述题。'
  },
  'Exercise': {
    definitionJa: '知識を確認するための演習問題。',
    definitionZh: '用于确认知识掌握情况的练习题。',
    examCueZh: '综合运用章节知识。'
  },
  'Ransomware': {
    definitionJa: 'データを暗号化し復旧と引き換えに金銭を要求するマルウェア。',
    definitionZh: '加密数据并勒索赎金的恶意软件。',
    examCueZh: '加密 + 赎金 + 恢复 → 勒索软件。'
  },
  'Backup': {
    definitionJa: '障害や攻撃に備えデータを別媒体へ保存すること。',
    definitionZh: '为应对故障或攻击而把数据另存的过程与结果。',
    examCueZh: '还要问是否隔离、多代、可恢复。'
  },
  'Restore': {
    definitionJa: 'バックアップなどから元の利用可能状態へ戻すこと。',
    definitionZh: '从备份等来源恢复到可用状态。',
    examCueZh: '有备份≠已恢复。'
  },
  'Offline Backup': {
    definitionJa: '本番環境から切り離して保管するバックアップ。',
    definitionZh: '与生产环境隔离保存的备份。',
    examCueZh: '勒索场景下的关键加分项。'
  },
  'BCP': {
    definitionJa: '事業継続計画。重要業務を続けるための計画。',
    definitionZh: '业务连续性计划，规定如何维持与恢复关键业务。',
    examCueZh: '优先级、替代手段、恢复时间。'
  }
};

module.exports = { packs, chapter1TermDefs };
