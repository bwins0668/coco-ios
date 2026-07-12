'use strict';

/**
 * Phase 1B: enrich ALL Chapter1 units to Golden Baseline thresholds.
 * Uniform style rules applied to every unit.
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const chapterPath = path.join(ROOT, 'packages/course-sg/data/chapter-01.js');
const chapter = require(chapterPath);

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
  preMin: 3,
  preBodyMin: 24
};

function L(s) { return String(s || '').trim().length; }

const enrich = {
  'sg-1-1-1': {
    overviewZh: '信息安全不是“装杀毒软件”的代名词，而是围绕信息资产，持续维持机密性、完整性、可用性（CIA）的一整套管理与技术思路。企业真正要保护的，是客户数据、合同、系统配置和业务连续性这些“用得上的东西”。本单元先建立总框架：资产在哪、会受什么威胁、脆弱点在哪、用什么对策；事故发生后，先判断损害的是 CIA 中的哪一项，再决定隔离、恢复还是加强访问控制。',
    learningExperience: {
      goalZh: '建立“信息资产 → 威胁/脆弱性 → CIA 损害 → 对策”的课堂级理解，能像老师一样把事故讲清楚。',
      coreConcept: {
        headingZh: '信息安全保护的是“业务可用的信息状态”',
        bodyZh: '信息安全要回答三件事：不该看的人能不能看到（机密性），内容是否被擅自改过（完整性），需要时能不能正常使用（可用性）。企业买防火墙、做培训、写规程，最终都是为了维持这三种状态。学习时不要从产品名出发，而要从“保护对象和损害形态”出发：名单外泄、金额被改、系统打不开，分别对应不同问题。后面所有攻击、管理、法规章节，都可以放回这个坐标系。'
      },
      whyImportant: {
        headingZh: '为什么企业每天都在用这一节',
        bodyZh: '任何组织一旦依赖数据运转，就会同时面对泄露、篡改和中断三类风险。客户信任、交易正确性、营业能否开门，都挂在这三根轴上。考试反复考它，是因为真实事故报告、ISMS 和董事会沟通也用同一套语言：先说损害了什么，再谈花多少钱补哪里。'
      },
      prerequisiteConcepts: [
        { labelZh: '信息资产', bodyZh: '对组织有价值、需要保护的信息及其载体，包括电子文件、纸质资料、账号和配置。' },
        { labelZh: '威胁与脆弱性', bodyZh: '威胁是可能造成损害的来源；脆弱性是可被利用的弱点。两者相遇才形成风险。' },
        { labelZh: 'CIA 三要素', bodyZh: '机密性、完整性、可用性，是判断“坏在哪里”的基本标尺，不是三个孤立名词。' }
      ],
      caseBreakdown: [
        { labelZh: '业务场景', bodyZh: '某零售公司会员名单被外部获取，同时官网下单功能在高峰时段短暂中断，客服接到大量投诉。' },
        { labelZh: '拆解判断', bodyZh: '名单外泄直接损害机密性；下单中断损害可用性。二者可能同源，但保护目标不同，对策优先级也不同。' },
        { labelZh: '课堂结论', bodyZh: '先分清“被看到了”还是“用不了了”，再选加密、访问控制、备份或冗余。不要一上来就只说“再装杀毒”。' },
        { labelZh: '经营含义', bodyZh: '机密性事故伤害信任与合规；可用性事故直接损失成交。汇报时要按业务影响说话，而不是只报技术日志。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '很少只考“定义是什么”，更常给事故场景，让你判断损害的是 CIA 哪一项、对象是不是信息资产、对策是否对准原因。干扰项常把信息安全窄化成杀毒或网络设备。',
        keywords: ['机密性', '完整性', '可用性', '信息资产', '威胁', '脆弱性']
      },
      examCues: [
        { cueZh: '出现“被不应看的人看到/外泄”→ 机密性。' },
        { cueZh: '出现“内容被改/计算错误/金额不对”→ 完整性。' },
        { cueZh: '出现“系统停/打不开/超时无法下单”→ 可用性。' }
      ],
      mistakeComparisons: [
        { aZh: '机密性', bZh: '完整性', bodyZh: '机密性管“谁能看”，完整性管“有没有被改”。泄露客户名单是机密性；订单金额被改是完整性。两者都严重，但对策入口不同。' },
        { aZh: '信息安全', bZh: '杀毒软件', bodyZh: '杀毒只是技术控制的一种；信息安全还包括资产分类、权限、备份、教育、规程与持续改进。把安全等同于杀毒会漏掉大半风险。' }
      ],
      memoryTips: [
        { tipZh: 'CIA 三问口诀：看得到吗？被改过吗？用得了吗？' },
        { tipZh: '做题先画四格：对象 / 原因 / 影响 / 对策，再回选项。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题检验你是否能把案例现象映射到 CIA 或信息资产保护，而不是只认攻击名称。答对的关键是先定性损害，再选对策。'
      }
    }
  },

  'sg-1-1-2': {
    overviewZh: '恶意软件感染案例训练你按“进入路径 → 发作现象 → 业务影响 → 初动响应”读题。附件、网页挂马、U 盘都可能是入口；影响可能是泄露、篡改或业务中断。重点不是背病毒名词，而是会判断先隔离什么、保留哪些证据、如何避免扩大损害，以及恢复上线前要确认什么。',
    learningExperience: {
      goalZh: '会用感染链读恶意软件案例，并能说明合理初动响应顺序。',
      coreConcept: {
        headingZh: '恶意软件题考的是“链”，不是名词表',
        bodyZh: '入口、执行、权限、影响、响应是一条链。附件只是入口示例；真正危险是执行后的控制权与数据后果。课堂顺序永远是：止损（隔离）→ 查清（路径与范围）→ 清除 → 加固（补丁、口令、入口管控）。只重启或只删文件，往往会漏掉持续控制手段和已泄露账号。'
      },
      whyImportant: {
        headingZh: '为什么企业几乎每周都会碰到',
        bodyZh: '邮件与浏览仍是最常见的初始入侵路径之一。一旦终端失陷，损失可能是客户资料、邮箱转发规则或横向进入服务器。组织需要的是可执行的响应剧本，而不是事后才问“是不是病毒”。考试反复出现，是因为这对应真实运营中的第一反应能力。'
      },
      prerequisiteConcepts: [
        { labelZh: '附件与执行', bodyZh: '用户动作常是触发条件；程序获得执行机会后才形成感染。' },
        { labelZh: '影响形态', bodyZh: '泄露、篡改、中断分别对应不同保护目标，不能一律说“中毒了”。' },
        { labelZh: '事件响应', bodyZh: '先控制扩散，再分析与恢复；顺序错了会边处理边扩大。' }
      ],
      caseBreakdown: [
        { labelZh: '发生了什么', bodyZh: '员工打开来路不明的“发票附件”后，终端出现异常外连，部分客户资料疑似外传，同一邮箱还自动转发新邮件。' },
        { labelZh: '为什么危险', bodyZh: '不只是单机变慢，而是凭证、通讯录和后续邮件可能被持续窃取，形成二次欺诈。' },
        { labelZh: '错误动作', bodyZh: '立刻重装系统却不重置密码、不查邮件规则、不隔离网络，可能让攻击者继续用旧凭证登录。' },
        { labelZh: '正确思路', bodyZh: '断网/隔离终端，重置相关账号，保留日志与样本，再清除并修补入口；确认外传范围后再恢复业务。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '给邮件或 Web 场景，问最恰当初动、最可能原因或应关注的影响。干扰项常混入“先全公司公开致歉”或“先升级业务功能”等不对准事故链的动作。',
        keywords: ['附件', '感染', '不正程序', '信息泄露', '初动响应']
      },
      examCues: [
        { cueZh: '附件 + 宏/可执行文件 → 入口线索。' },
        { cueZh: '异常外连/未知进程 → 可能已失陷，先隔离。' }
      ],
      mistakeComparisons: [
        { aZh: '病毒', bZh: '木马', bodyZh: '传统病毒强调自我复制感染文件；木马更强调伪装成正常程序、打开后门。题干若强调“看起来像正常软件”，更偏木马。' },
        { aZh: '清除', bZh: '隔离', bodyZh: '清除是去掉恶意代码；隔离是先阻止扩散。顺序错了会边清边扩散，证据也可能被破坏。' }
      ],
      memoryTips: [
        { tipZh: '响应四步：隔—查—清—固，顺序不要倒。' },
        { tipZh: '先问“怎么进来的”，再问“删不删得掉”。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题侧重感染路径与响应判断，检验你是否会把现象映射到恶意软件事件处理，而不是只选“杀毒软件”四个字。'
      }
    }
  },

  'sg-1-1-3': {
    overviewZh: '勒索软件会把业务数据加密，使“文件还在却不能用”。真正决定能否恢复的，不是有没有杀毒软件，而是备份是否隔离、是否多代、是否验证过恢复，以及 BCP 是否规定了业务优先级。本单元把攻击影响和恢复能力绑在一起讲，避免“有备份却恢复失败”。',
    learningExperience: {
      goalZh: '能把勒索软件案例拆成加密影响、备份条件、恢复步骤与业务连续性判断，并指出同网备份风险。',
      coreConcept: {
        headingZh: '勒索软件对策要看到“能否恢复业务”',
        bodyZh: '勒索软件的关键伤害是让数据或系统失去可用性，有时还伴随数据窃取。终端隔离只能止血，不能自动让业务回来。恢复靠的是未被加密的备份，以及可执行的恢复剧本。若备份与生产长期同网在线，攻击可能一并加密备份。因此必须同时谈：隔离/离线保存、世代管理、定期恢复演练，以及 BCP 中的业务优先级。'
      },
      whyImportant: {
        headingZh: '为什么董事会也关心这一节',
        bodyZh: '勒索软件直接打击营业开门能力与现金流。很多企业“有备份却恢复失败”，等于没有备份。安全投入要从杀毒扩展到恢复体系：介质放哪、多久测一次、先恢复哪个系统。考试重视它，是因为现实事故损失常以停业天数计算。'
      },
      prerequisiteConcepts: [
        { labelZh: '被加密的数据', bodyZh: '文件还在不代表业务可继续，关键是能否恢复可读、可用的数据。' },
        { labelZh: '备份与恢复', bodyZh: '备份是保留副本；恢复是用副本让业务回来。两者不是同一件事。' },
        { labelZh: '业务连续性', bodyZh: 'BCP 规定先恢复什么、如何临时维持业务、何时恢复正常。' }
      ],
      caseBreakdown: [
        { labelZh: '发生了什么', bodyZh: '攻击者加密业务共享盘与部分数据库，员工无法打开订单与库存系统，生产线等待指令。' },
        { labelZh: '为什么同网备份脆弱', bodyZh: '备份介质一直在线且与生产同网时，攻击扩散可能连备份一起加密，恢复路径同时失效。' },
        { labelZh: '错误对策', bodyZh: '只强调“立刻付款”或“只杀毒不恢复”，都没有回答业务如何回到可用状态。' },
        { labelZh: '正确对策', bodyZh: '隔离感染终端，启用未加密的隔离备份恢复，并按 BCP 先恢复接单与支付等关键业务。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '常给勒索场景，比较备份方式或恢复步骤是否完整。题干出现“已备份但仍无法恢复”时，重点看是否离线、多代、演练过。',
        keywords: ['勒索软件', '加密', '备份', '恢复', '离线', 'BCP']
      },
      examCues: [
        { cueZh: '看到“有备份”还要继续看是否离线、多代、验证恢复。' },
        { cueZh: '强调业务继续与优先级时，从 BCP 角度读题。' }
      ],
      mistakeComparisons: [
        { aZh: '备份', bZh: '恢复', bodyZh: '备份是保留副本；恢复是用副本让系统或业务回来。考试爱设“有备份但没测恢复”的陷阱。' },
        { aZh: '同网保存', bZh: '离线保管', bodyZh: '同网方便但可能一起被加密；离线牺牲一些便利，用来保住最后恢复来源。' }
      ],
      memoryTips: [
        { tipZh: '勒索三问：加密了吗？备份还干净吗？业务怎么续？' },
        { tipZh: '备份合格线：隔离 + 多代 + 演练，缺一不可。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题用于检验你是否把勒索影响读成恢复问题，而不是普通杀毒问题；答案应体现隔离备份与业务恢复。'
      }
    }
  },

  'sg-1-2-1': {
    overviewZh: '信息安全的根本目的，是支撑业务持续运行与可信。思考方式不是“零事故”，而是在资源有限下管理风险：识别资产与风险，选择可接受的控制，并持续改进。控制措施既包括技术，也包括规程、组织和人。本单元建立“目标—风险—控制”的课堂主线。',
    learningExperience: {
      goalZh: '用“目标—风险—控制”讲清信息安全思考方式，并能比较对策是否对准业务风险。',
      coreConcept: {
        headingZh: '安全是为业务服务的风险管理',
        bodyZh: '没有业务对象，安全就失去坐标。先明确要保护什么、不能中断什么，再决定控制强度。风险思考要求比较“出事损失”和“对策成本”，在避免、降低、转移、接受之间做选择。考试爱考“看起来很安全但偏离目标”的选项：例如不计成本堆设备，却放任高影响资产无人负责。'
      },
      whyImportant: {
        headingZh: '为什么这是管理章节的总开关',
        bodyZh: '后面的方针、ISMS、风险评估、采购与审计都建立在“目标与风险”上。企业预算评审也会问同样的话：为什么要做、不做会怎样、做到什么程度算够。把安全写成口号，落地时一定失控。'
      },
      prerequisiteConcepts: [
        { labelZh: '风险', bodyZh: '威胁利用脆弱性造成影响的可能性与后果，不是单点攻击名称。' },
        { labelZh: '控制措施', bodyZh: '为降低风险而采取的管理、技术或物理手段，必须可执行可检查。' },
        { labelZh: '业务连续性', bodyZh: '关键业务在中断后仍能持续或尽快恢复的能力与安排。' }
      ],
      caseBreakdown: [
        { labelZh: '预算场景', bodyZh: '公司要在“全盘加密所有终端”和“先保护客户数据库与备份”之间分配有限预算。' },
        { labelZh: '风险排序', bodyZh: '若客户数据泄露影响最大且发生概率不低，应优先对准高影响资产，而不是平均用力。' },
        { labelZh: '错误思路', bodyZh: '只选“最强技术名词”，不问是否对准业务风险，也不问谁负责、如何验收。' },
        { labelZh: '正确结论', bodyZh: '目的决定优先级，优先级决定控制组合；安全投入要能讲清业务收益。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '常问哪项最符合信息安全目的，或哪项风险应对更合理。干扰项常是“绝对不发生事故”或“只上最贵设备”。',
        keywords: ['风险', '安全目标', '控制', '业务连续性']
      },
      examCues: [
        { cueZh: '出现“可接受风险/残留风险”→ 风险管理思维。' },
        { cueZh: '出现“支撑业务”→ 安全服务业务，不是对立。' }
      ],
      mistakeComparisons: [
        { aZh: '安全目标', bZh: '技术手段', bodyZh: '目标是要达到的状态；技术是实现手段。手段再强，对错目标也无效。' },
        { aZh: '降低风险', bZh: '接受风险', bodyZh: '降低是采取措施减少；接受是明知仍保留并监控，通常用于低影响且成本过高的场景。' }
      ],
      memoryTips: [
        { tipZh: '三连问：保什么？怕什么？做什么？' },
        { tipZh: '安全投入按影响排序，不按热闹排序。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题检验你是否能从业务与风险角度解释安全目的，而不是把答案写成“安装更多安全产品”。'
      }
    }
  },

  'sg-1-2-2': {
    overviewZh: 'CIA 是基础三要素：机密性、完整性、可用性。扩展常讨论真实性、可问责性、不可否认性，用于解释认证、日志与数字签名等控制为何必要。本单元训练你把概念精确拆开，用业务场景举例，避免混用。',
    learningExperience: {
      goalZh: '把 CIA 与扩展属性讲到能举业务例子，并在案例中选对“被破坏的性质”。',
      coreConcept: {
        headingZh: '属性是“损失类型的标签”',
        bodyZh: '不要只背翻译，要背损失形态。泄露贴机密性，改数贴完整性，宕机贴可用性，假冒贴真实性，抵赖贴不可否认性，查不出人贴可问责性。一个事故可同时伤及多项，但选项通常有一个“最直接”属性。认证、授权、日志、签名等控制，分别支撑不同属性。'
      },
      whyImportant: {
        headingZh: '为什么几乎每套题、每份事故报告都用它',
        bodyZh: '它是全部分类题的底层语言。管理题、技术题、法规题最终都会问“破坏了什么性质”。企业沟通时也要用它把技术故障翻译成业务语言：钱会不会错、数据会不会漏、门开不开得了。'
      },
      prerequisiteConcepts: [
        { labelZh: '授权与未授权', bodyZh: '很多定义都建立在“是否获得许可”上，离开授权谈安全会空转。' },
        { labelZh: '日志与证据', bodyZh: '可问责与不可否认需要记录与证据链，没有日志就很难追责。' },
        { labelZh: '业务场景映射', bodyZh: '能把“看/改/用/真/追/赖”对应到真实工作流程。' }
      ],
      caseBreakdown: [
        { labelZh: '场景A', bodyZh: '工资表被无关同事打开浏览 → 机密性被破坏。' },
        { labelZh: '场景B', bodyZh: '转账金额在系统中被改成更大数字 → 完整性被破坏。' },
        { labelZh: '场景C', bodyZh: '网银登录页被钓鱼站冒充 → 真实性出问题。' },
        { labelZh: '场景D', bodyZh: '关键操作无日志，事后无法确认是谁做的 → 可问责性不足。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '最常见是“下列哪项说明正确/对应哪一属性”。题干给现象，选项给属性名。出现数字签名/证书时，多关联真实性或不可否认性；出现审计日志时，多关联可问责性。',
        keywords: ['机密性', '完整性', '可用性', '真实性', '可问责性', '不可否认性']
      },
      examCues: [
        { cueZh: '“被看到”→ 机密性；“被改掉”→ 完整性；“打不开”→ 可用性。' },
        { cueZh: '“冒充/假站”→ 真实性；“事后抵赖”→ 不可否认性。' }
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
        explanationZh: '关联题多直接映射属性判断。得分关键是先找损失形态，再贴标签，不要被技术名词带跑。'
      }
    }
  },

  'sg-1-2-3': {
    overviewZh: '威胁可从来源与性质分类：人为故意、人为过失、物理环境、系统故障与技术攻击等。分类的意义是帮助选择对策：人的问题靠教育与流程，物理靠设施，技术靠系统控制。本单元训练你给案例贴对威胁标签，而不是把所有停机都叫“黑客攻击”。',
    learningExperience: {
      goalZh: '会给威胁分类，并连到控制方向，避免把影响当成威胁本身。',
      coreConcept: {
        headingZh: '分类是为了选对药',
        bodyZh: '威胁不是已经发生的事故结果，而是“可能造成损害的来源”。人为错误如误发邮件；灾害如火灾断电；故障如磁盘损坏；非法访问则是故意入侵。同样是“系统停了”，可能是水灾、磁盘坏了或 DDoS。分类错了，对策就会错：该做备份却只买防火墙，或该改流程却只训技术。'
      },
      whyImportant: {
        headingZh: '为什么风险管理从识别威胁开始',
        bodyZh: '企业做风险评估时，第一步常是识别威胁源。若把内部失误、供应链中断和外部攻击混成一锅，预算与责任都会放错位置。考试用分类题检查你是否只会背攻击名，而不懂来源差异。'
      },
      prerequisiteConcepts: [
        { labelZh: '威胁', bodyZh: '可能带来损害的潜在原因或来源，不等于已经发生的损失。' },
        { labelZh: '脆弱性', bodyZh: '可被威胁利用的弱点，如弱口令、无补丁、权限过大。' },
        { labelZh: '影响', bodyZh: '事故造成的结果，如停业、泄露；影响用于评估严重度，不能替代威胁分类。' }
      ],
      caseBreakdown: [
        { labelZh: '误删除客户数据', bodyZh: '偏人为过失威胁；对策侧重权限、二次确认、培训与恢复。' },
        { labelZh: '机房进水', bodyZh: '偏物理/环境威胁；对策侧重选址、排水、UPS 与容灾。' },
        { labelZh: '外部撞库扫描', bodyZh: '偏技术/故意攻击威胁；对策侧重认证强度、监测与封禁。' },
        { labelZh: '磁盘老化损坏', bodyZh: '偏故障威胁；对策侧重冗余、监控寿命与备份。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '给出短场景，问属于哪类威胁。自然灾害与设备故障都可能造成可用性下降，但来源不同，控制也不同。',
        keywords: ['人为', '灾害', '故障', '非法访问']
      },
      examCues: [
        { cueZh: '“操作失误/误发送”→ 人为过失。' },
        { cueZh: '“地震/停电/水灾”→ 灾害或物理环境。' },
        { cueZh: '“未授权登录/入侵”→ 非法访问。' }
      ],
      mistakeComparisons: [
        { aZh: '人为过失', bZh: '非法访问', bodyZh: '过失无恶意，重流程与培训；非法访问强调未授权故意行为，重认证与监测。' },
        { aZh: '故障', bZh: '灾害', bodyZh: '故障多来自系统/部件；灾害来自外部环境。两者都可能停机，但预防手段不同。' }
      ],
      memoryTips: [
        { tipZh: '威胁四盒：人、自然、设备、攻击者。' },
        { tipZh: '先问“谁/什么在造成损害可能”，再贴标签。' }
      ],
      quizMapping: {
        relatedQuestionIds: ['q-sg-lesson-0001'],
        explanationZh: '关联题检验威胁分类是否准确，以及你是否误把“泄露/停机”等影响直接当成威胁类型。'
      }
    }
  },

  'sg-1-2-4': {
    overviewZh: '恶意软件包含病毒、蠕虫、木马、间谍软件、后门等。分类依据通常是传播方式与行为特征：是否依附文件、是否自传播、是否伪装、是否窃密、是否留后门。学习目标是会辨型，并知道防护与响应重点不同，而不是背一串英文名。',
    learningExperience: {
      goalZh: '建立恶意软件类型对照表，能按“传播 + 行为”做题可迁移。',
      coreConcept: {
        headingZh: '按“传播 + 行为”分类',
        bodyZh: '不要只背名单，背两列：它怎么走，它想干什么。病毒常依附宿主文件；蠕虫可利用网络自我扩散；木马伪装成正当程序诱导安装；间谍软件侧重窃取；后门留下持续入口。现实样本可能组合多种特征，但考试仍要求抓“最显著特征”。防护重点因此不同：蠕虫重暴露面，木马重来源与执行控制，间谍软件重外连与隐私。'
      },
      whyImportant: {
        headingZh: '为什么必须分清类型',
        bodyZh: '企业选控制与写响应剧本时，类型决定侧重点。蠕虫爆发要快速隔离网段；木马事件要查下载来源与权限；间谍软件要查数据外传。分不清就会“统一重装”却留后门。'
      },
      prerequisiteConcepts: [
        { labelZh: '宿主与执行', bodyZh: '某些类型需要用户执行或文件宿主，入口管控很关键。' },
        { labelZh: '远程控制', bodyZh: '后门/部分木马用于长期操控，清除后还要查通道。' },
        { labelZh: '传播路径', bodyZh: '邮件、Web、移动介质、漏洞利用都是常见路径。' }
      ],
      caseBreakdown: [
        { labelZh: '邮件带“发票.exe”', bodyZh: '更像木马投递：伪装正当文件，诱导用户执行。' },
        { labelZh: '漏洞利用后全网扫端口扩散', bodyZh: '更像蠕虫：强调自动传播与网络暴露面。' },
        { labelZh: '静默上传浏览器密码', bodyZh: '更像间谍软件行为：目标是窃密而非单纯破坏。' },
        { labelZh: '清除后又被远程连入', bodyZh: '要怀疑后门仍在，不能只做一次杀毒扫描。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '描述特征选名称，或选对应防护。关键词常是自我复制、网络扩散、伪装、窃密、远程控制。',
        keywords: ['病毒', '蠕虫', '木马', '间谍软件', '后门']
      },
      examCues: [
        { cueZh: '自我感染文件 → 病毒色彩。' },
        { cueZh: '无需用户、网络扩散 → 蠕虫色彩。' },
        { cueZh: '看起来正常却有害 → 木马色彩。' }
      ],
      mistakeComparisons: [
        { aZh: '蠕虫', bZh: '病毒', bodyZh: '蠕虫强调自传播与网络扩散；病毒更依赖宿主文件。看到“自动感染局域网”优先想蠕虫。' },
        { aZh: '木马', bZh: '后门', bodyZh: '木马强调伪装进入；后门强调留下通道。木马可安装后门，但两者考查点不同。' }
      ],
      memoryTips: [
        { tipZh: '虫会爬网，毒会附着，马会伪装，谍会偷听，门会留口。' },
        { tipZh: '分类两列法：怎么传播 + 想干什么。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空，不伪造题号。后续若接入题库，应映射到“特征—类型—防护”判断题。'
      }
    }
  },

  'sg-1-2-5': {
    overviewZh: '攻击常按链理解：侦察、初始访问、提权、横向移动、达成目标。冒充、漏洞利用、日志清理都是链上动作。学习重点是看懂攻击者如何推进，以及防守者应在哪一环设障与取证，而不是只记单个攻击名。',
    learningExperience: {
      goalZh: '用攻击链解释不正访问如何发生与扩大，并能指出提权、冒充、漏洞与日志的位置。',
      coreConcept: {
        headingZh: '攻击是推进过程，不是单次点击',
        bodyZh: '进来不等于成功。很多损害发生在提权与横向移动之后。漏洞是可被利用的弱点；冒充用于骗取信任；提权把普通权限抬到管理权限；日志则是还原过程的证据。防守要分层：减少入口、限制权限、保留证据。只堵最后一环，往往已经晚了。'
      },
      whyImportant: {
        headingZh: '为什么管理与技术都要懂攻击链',
        bodyZh: '权限设计、日志策略、漏洞管理分别对应链上不同环节。企业事故复盘时，若说不清“怎么进来、怎么扩大”，就无法改流程。考试用它连接技术点与管理点，避免只会背工具名。'
      },
      prerequisiteConcepts: [
        { labelZh: '漏洞', bodyZh: '可被利用的弱点，如未打补丁、错误配置。' },
        { labelZh: '权限', bodyZh: '能做什么的边界；过大权限会让提权后果更严重。' },
        { labelZh: '日志', bodyZh: '行为记录，用于检测、审计与取证，需要时间同步与保护。' }
      ],
      caseBreakdown: [
        { labelZh: '初始', bodyZh: '通过弱口令进入普通账号，完成初始访问。' },
        { labelZh: '扩大', bodyZh: '利用本地漏洞把权限提升到管理员，开始访问更多系统。' },
        { labelZh: '行动', bodyZh: '横向移动到业务服务器，导出数据或植入后门。' },
        { labelZh: '收尾', bodyZh: '清理日志试图掩盖痕迹；若日志不完整，复盘会失败。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '给攻击过程片段，问名称或最有效对策环节。例如“先普通用户后管理员”对应提权；“伪装正规站点”对应冒充。',
        keywords: ['提权', '冒充', '漏洞', '日志', '攻击链']
      },
      examCues: [
        { cueZh: '权限从低到高 → 提权。' },
        { cueZh: '假装合法身份 → 冒充。' },
        { cueZh: '强调无法还原过程 → 日志/取证不足。' }
      ],
      mistakeComparisons: [
        { aZh: '冒充', bZh: '提权', bodyZh: '冒充解决“我是谁”的欺骗；提权解决“我能做什么”的升级。两者可连续发生，但不是同一动作。' },
        { aZh: '检测', bZh: '取证', bodyZh: '检测发现异常；取证保全证据并还原过程。没有日志保护，检测成功也可能无法追责。' }
      ],
      memoryTips: [
        { tipZh: '链上五字：进、扩、提、横、逃。' },
        { tipZh: '防守三板斧：少入口、限权限、留证据。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空。理想映射应落在“攻击阶段识别/对应控制”类题目。'
      }
    }
  },

  'sg-1-2-6': {
    overviewZh: '本章演习不是另起炉灶，而是把 CIA、威胁分类、恶意软件、攻击机制与响应思路放到综合题里。做题顺序建议：先定损失属性，再定威胁/攻击类型，最后选对准原因的对策。本单元训练的是“组装能力”，不是灌输新名词。',
    learningExperience: {
      goalZh: '形成第1章综合题的固定解题脚本，能在长案例中同时使用多个概念。',
      coreConcept: {
        headingZh: '演习是“组装”，不是新知识灌输',
        bodyZh: '把前面单元的标签系统装到同一案例上：谁是保护对象，谁是威胁，损害哪项 CIA，路径是恶意软件还是提权，对策是否对准原因。正确方法是分层标注，而不是凭感觉选“最安全”的词。选项里即使术语正确，只要解释不了题干条件，就是干扰项。'
      },
      whyImportant: {
        headingZh: '为什么单独成节',
        bodyZh: '真实考试与真实事故都是综合形态：一条故事里同时出现邮件、权限、停机和泄露。只会单点定义，遇到长文案会崩。企业值班也是综合判断：先止血，再定性，再通报。'
      },
      prerequisiteConcepts: [
        { labelZh: 'CIA', bodyZh: '损失标签：看、改、用。' },
        { labelZh: '威胁/恶意软件/攻击链', bodyZh: '原因与路径标签，决定查什么、隔什么。' },
        { labelZh: '控制与响应', bodyZh: '对策标签，必须对准已识别的原因与影响。' }
      ],
      caseBreakdown: [
        { labelZh: '读题', bodyZh: '圈出对象、现象、时间线：谁受害、发生了什么、先后顺序如何。' },
        { labelZh: '贴标签', bodyZh: '属性（CIA）、威胁类型、是否恶意软件、是否需要隔离与取证。' },
        { labelZh: '排干扰', bodyZh: '删除不能解释题干条件的“正确术语”，例如题干在谈误操作却选 DDoS。' },
        { labelZh: '选对策', bodyZh: '只保留能缓解主问题且顺序合理的选项：先止损，再恢复，再加固。' }
      ],
      examPattern: {
        headingZh: 'IPA 常见出法',
        bodyZh: '长案例 + 多问，或单问但选项跨概念。答题要展示路径，而不是堆术语。',
        keywords: ['综合判断', 'CIA', '威胁', '恶意软件', '控制']
      },
      examCues: [
        { cueZh: '先属性后技术，先原因后工具。' },
        { cueZh: '长文案先画时间线，再看选项。' }
      ],
      mistakeComparisons: [
        { aZh: '定义题思路', bZh: '案例题思路', bodyZh: '定义题匹配语句；案例题要条件→结论。把案例题当定义题会选“术语最漂亮”的干扰项。' },
        { aZh: '单点正确', bZh: '路径正确', bodyZh: '选项局部正确不够，必须串得起对象、原因、影响、对策整条路径。' }
      ],
      memoryTips: [
        { tipZh: '综合题三板斧：标属性、定类型、选对准对策。' },
        { tipZh: '时间线优先：先发生什么，后发生什么，再谈工具。' }
      ],
      quizMapping: {
        relatedQuestionIds: [],
        explanationZh: '本单元暂无已验证关联题，保持为空。它是第1章总复习位，后续应映射综合案例题而非单点定义题。'
      }
    }
  }
};

let updated = 0;
for (const unit of chapter.units || []) {
  const pack = enrich[unit.id];
  if (!pack) continue;
  if (pack.overviewZh) unit.overviewZh = pack.overviewZh;
  unit.learningExperience = Object.assign({}, unit.learningExperience || {}, pack.learningExperience);
  // keep goalJa if present; ensure goalZh from pack goal
  if (pack.learningExperience.goalZh) unit.learningExperience.goalZh = pack.learningExperience.goalZh;
  // quiz mapping honesty
  const real = unit.relatedQuestionIds || [];
  unit.learningExperience.quizMapping = unit.learningExperience.quizMapping || {};
  unit.learningExperience.quizMapping.relatedQuestionIds = real.slice();
  if (!real.length) {
    unit.learningExperience.quizMapping.relatedQuestionIds = [];
  }
  unit.knowledgeReconstructionStatus = 'chapter1_golden_baseline_v1';
  unit.goldenBaseline = true;
  updated += 1;
}

// Uniform section explanation polish: ensure no template and min length if short
const TEMPLATE_RE = /先判断它属于|先判断它是在讲|这样可以把|不是直接问定义|做SG案例题时不会只按词面选择/;
for (const unit of chapter.units || []) {
  if (TEMPLATE_RE.test(unit.overviewZh || '')) throw new Error('template in overview ' + unit.id);
  for (const s of unit.sections || []) {
    if (TEMPLATE_RE.test(s.explanationZh || '')) throw new Error('template in expl ' + unit.id);
  }
}

// Validate gold thresholds
const fails = [];
for (const unit of chapter.units || []) {
  const le = unit.learningExperience || {};
  const core = L(le.coreConcept && le.coreConcept.bodyZh);
  const why = L(le.whyImportant && le.whyImportant.bodyZh);
  const cases = le.caseBreakdown || [];
  const caseTotal = cases.reduce((a, c) => a + L(c.bodyZh), 0);
  const exam = L(le.examPattern && le.examPattern.bodyZh);
  const mistakes = le.mistakeComparisons || [];
  const mem = le.memoryTips || [];
  const quizExpl = L(le.quizMapping && le.quizMapping.explanationZh);
  if (core < GOLD.coreMin) fails.push(unit.id + ' core ' + core);
  if (why < GOLD.whyMin) fails.push(unit.id + ' why ' + why);
  if (cases.length < GOLD.caseMinItems) fails.push(unit.id + ' case count');
  if (caseTotal < GOLD.caseTotalMin) fails.push(unit.id + ' case total ' + caseTotal);
  if (cases.some((c) => L(c.bodyZh) < GOLD.caseItemMin)) fails.push(unit.id + ' case item short');
  if (exam < GOLD.examMin) fails.push(unit.id + ' exam ' + exam);
  if ((le.examCues || []).length < GOLD.examCuesMin) fails.push(unit.id + ' examCues');
  if (mistakes.length < GOLD.mistakeMin) fails.push(unit.id + ' mistake count');
  if (mistakes.some((m) => !m.aZh || !m.bZh || L(m.bodyZh) < GOLD.mistakeBodyMin)) fails.push(unit.id + ' mistake body');
  if (mem.length < GOLD.memoryMin) fails.push(unit.id + ' memory count');
  if (mem.some((m) => L(m.tipZh) < GOLD.memoryTipMin)) fails.push(unit.id + ' memory tip short');
  if (quizExpl < GOLD.quizExplMin) fails.push(unit.id + ' quiz expl');
  if (L(unit.overviewZh) < GOLD.overviewMin) fails.push(unit.id + ' overview');
  if ((le.prerequisiteConcepts || []).length < GOLD.preMin) fails.push(unit.id + ' pre count');
}

fs.writeFileSync(chapterPath, 'module.exports = ' + JSON.stringify(chapter, null, 2) + ';\n', 'utf8');
console.log(JSON.stringify({ updated, fails, failCount: fails.length, gold: GOLD }, null, 2));
if (fails.length) process.exit(1);
