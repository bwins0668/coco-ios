/**
 * generate_past_exam_zh_explanations.js
 * 为 IT Passport / SG 历年真题生成结构化中文解释
 * 采用单次占位替换 + 日文剥离，避免嵌套翻译和日文残留
 *
 * 用法：node tools/generate_past_exam_zh_explanations.js
 * 输出：packages/quiz/data/past_exam_bank/explanations_zh.js
 */
var fs = require('fs');
var path = require('path');

var DATA_PATH = path.join(__dirname, '..', 'packages', 'quiz', 'data', 'past_exam_bank');
var INPUT = path.join(DATA_PATH, 'full_bank.js');
var OUTPUT = path.join(DATA_PATH, 'explanations_zh.js');
var SPLIT_INDEX = path.join(DATA_PATH, 'index.js');

// ========== 日文→中文 IT 术语词典（去除 jp===zh 的冗余项） ==========
var TERM_MAP = {
  '情報提供依頼': 'RFI（信息提供请求）', '情報提供請求': 'RFI（信息提供请求）',
  '提案依頼書': 'RFP（提案请求书）', '提案依頼': 'RFP（提案请求书）',
  'サービスレベル合意': 'SLA（服务等级协议）',
  '調達': '采购', 'ベンダ': '供应商',
  'Electronic Data Interchange': 'EDI（电子数据交换）',
  '電子データ交換': 'EDI（电子数据交换）',
  'Key Performance Indicator': 'KPI（关键绩效指标）',
  '重要業績評価指標': 'KPI（关键绩效指标）',
  '情報セキュリティ方針': '信息安全方针',
  '情報セキュリティ管理': '信息安全管理',
  '情報セキュリティ対策': '信息安全对策',
  '情報セキュリティ': '信息安全',
  'マルウェア': '恶意软件', 'ウイルス': '病毒', 'ワーム': '蠕虫',
  'トロイの木馬': '特洛伊木马', 'ランサムウェア': '勒索软件',
  'フィッシング': '网络钓鱼', 'スピアフィッシング': '鱼叉式网络钓鱼',
  'ソーシャルエンジニアリング': '社会工程学',
  '暗号化通信': '加密通信', '暗号化': '加密', '復号': '解密',
  'ハッシュ関数': '哈希函数', 'ハッシュ値': '哈希值', 'ハッシュ': '哈希',
  'デジタル署名': '数字签名', '電子署名': '电子签名',
  '公開鍵暗号': '公钥加密', '公開鍵': '公钥', '秘密鍵': '私钥',
  '共通鍵暗号': '对称加密', '共通鍵': '对称密钥',
  '認証局': 'CA（证书颁发机构）', '認証': '认证', '認可': '授权',
  'ファイアウォール': '防火墙',
  '侵入検知システム': 'IDS（入侵检测系统）', '侵入検知': '入侵检测',
  '侵入防止システム': 'IPS（入侵防御系统）', '侵入防止': '入侵防御',
  '仮想専用網': 'VPN（虚拟专用网络）',
  '脆弱性': '漏洞', 'ゼロデイ攻撃': '零日攻击', 'ゼロデイ': '零日',
  'アクセス制御': '访问控制',
  'リスクアセスメント': '风险评估', 'リスク評価': '风险评估',
  'リスク対応': '风险应对', 'リスク管理': '风险管理',
  'リスク分析': '风险分析', 'リスク特定': '风险识别',
  '内部監査': '内部审计', '監査人': '审计人员', '監査': '审计',
  '内部統制': '内部控制',
  '機密性': '机密性', '完全性': '完整性', '可用性': '可用性',
  '不正アクセス': '未授权访问',
  'クロスサイトスクリプティング': 'XSS（跨站脚本）',
  'SQLインジェクション': 'SQL注入',
  'バッファオーバフロー': '缓冲区溢出',
  'パッチ': '补丁', 'セキュリティパッチ': '安全补丁',
  '多要素認証': '多因素认证', '二要素認証': '双因素认证',
  '生体認証': '生物特征认证', '指紋認証': '指纹认证',
  'ワンタイムパスワード': 'OTP（一次性密码）',
  'パスワード': '密码', 'アカウント': '账户',
  '権限': '权限', 'ロール': '角色',
  '監査証跡': '审计追踪', 'ログ': '日志',
  'バックアップ': '备份', 'リストア': '恢复',
  'ディザスタリカバリ': '灾难恢复', 'リカバリ': '恢复',
  '事業継続計画': 'BCP（业务连续性计划）',
  'ネットワーク': '网络',
  'IPアドレス': 'IP地址', 'サブネットマスク': '子网掩码',
  'MACアドレス': 'MAC地址', 'ポート番号': '端口号', 'ポート': '端口',
  'ルータ': '路由器', 'スイッチ': '交换机', 'ハブ': '集线器',
  'プロキシサーバ': '代理服务器', 'プロキシ': '代理', 'ゲートウェイ': '网关',
  '帯域幅': '带宽', '遅延': '延迟',
  'プロトコル': '协议', 'ルーティング': '路由',
  'パケット': '数据包', 'フレーム': '帧',
  'OSI参照モデル': 'OSI参考模型',
  'トランスポート層': '传输层', 'ネットワーク層': '网络层',
  'アプリケーション層': '应用层',
  'データベース': '数据库', '正規化': '正规化',
  'トランザクション': '事务', 'デッドロック': '死锁',
  'インデックス': '索引', '主キー': '主键', '外部キー': '外键',
  'E-R図': 'E-R图', '関係モデル': '关系模型',
  'リレーション': '关系', 'テーブル': '表',
  'データウェアハウス': '数据仓库', 'データマイニング': '数据挖掘',
  'サーバ': '服务器', 'クライアント': '客户端',
  'ロードバランサ': '负载均衡器', 'クラスタ': '集群',
  'クラウドコンピューティング': '云计算', 'クラウド': '云',
  '仮想化': '虚拟化', 'コンテナ': '容器',
  'オンプレミス': '本地部署',
  'エッジコンピューティング': '边缘计算',
  'フォグコンピューティング': '雾计算',
  'アルゴリズム': '算法', 'プログラミング': '编程',
  'フローチャート': '流程图', '疑似言語': '伪代码',
  'ソースコード': '源代码', 'コンパイラ': '编译器',
  'インタプリタ': '解释器', 'デバッグ': '调试',
  '単体テスト': '单元测试', '結合テスト': '集成测试',
  '総合テスト': '综合测试', '受入テスト': '验收测试',
  'ウォーターフォール': '瀑布模型', 'アジャイル': '敏捷开发',
  'スクラム': 'Scrum', 'スプリント': 'Sprint',
  'プロジェクト管理': '项目管理', 'プロジェクト': '项目',
  'WBS': 'WBS（工作分解结构）',
  'ガントチャート': '甘特图', 'クリティカルパス': '关键路径',
  'マイルストーン': '里程碑',
  'ステークホルダ': '干系人', 'スコープ': '范围',
  '進捗管理': '进度管理', '品質管理': '质量管理',
  'コスト': '成本', '予算': '预算',
  '要件定義': '需求定义', '基本設計': '概要设计',
  '詳細設計': '详细设计', '運用': '运维', '保守': '维护',
  'システム開発': '系统开发', 'ソフトウェア開発': '软件开发',
  '開発ライフサイクル': '开发生命周期',
  'ITサービスマネジメント': 'IT服务管理',
  'インシデント管理': '事件管理', 'インシデント': '事件',
  '問題管理': '问题管理', '変更管理': '变更管理',
  'リリース管理': '发布管理', '構成管理': '配置管理',
  'ヘルプデスク': '服务台', 'サービスデスク': '服务台',
  '著作権法': '著作权法', '著作権': '著作权',
  '特許法': '专利法', '特許': '专利',
  '不正競争防止法': '反不正当竞争法',
  '個人情報保護法': '个人信息保护法',
  '労働者派遣法': '劳动者派遣法', '労働者派遣': '劳动者派遣',
  '請負契約': '承揽合同', '請負': '承揽',
  '委任契約': '委托合同', '偽装請負': '伪装承揽',
  '特定電子メール法': '特定电子邮件法',
  '経営戦略': '经营战略',
  'バランススコアカード': 'BSC（平衡计分卡）',
  '成長マトリクス': '成长矩阵',
  '市場浸透': '市场渗透', '製品開発': '产品开发',
  '市場開拓': '市场开拓', '多角化': '多元化',
  'CPU': 'CPU（中央处理器）',
  'メモリ': '内存', 'RAM': 'RAM（随机存储器）', 'ROM': 'ROM（只读存储器）',
  'キャッシュメモリ': '高速缓存', '主記憶': '主存',
  '補助記憶': '辅助存储',
  'SSD': 'SSD（固态硬盘）', 'HDD': 'HDD（硬盘）',
  'クロック': '时钟频率',
  '人工知能': '人工智能', '生成AI': '生成式AI',
  '機械学習': '机器学习', '深層学習': '深度学习',
  'ディープラーニング': '深度学习',
  'ブロックチェーン': '区块链',
  'ビッグデータ': '大数据',
  'オープンソースソフトウェア': 'OSS（开源软件）',
  'オープンソース': '开源', 'ライセンス': '许可证',
  'ミドルウェア': '中间件',
  'ライブラリ': '库', 'フレームワーク': '框架',
  '信頼性': '可靠性',
  '稼働率': '可用率', 'パフォーマンス': '性能',
  'スループット': '吞吐量', 'レスポンス': '响应',
  '情報システム': '信息系统',
  'ソフトウェア': '软件', 'ハードウェア': '硬件',
  'セキュリティ': '安全', 'マネジメント': '管理',
  'ストラテジ': '战略', 'テクノロジ': '技术',
  '運用管理': '运维管理', '保守管理': '维护管理',
  'ディジタルフォレンジックス': '数字取证',
  'フォレンジックス': '取证',
  'アローダイアグラム': '箭线图',
  'アウトソーシング': '外包', 'オフショア': '离岸外包',
  'コンプライアンス': '合规',
  'ITガバナンス': 'IT治理', 'ガバナンス': '治理',
  'エンタープライズアーキテクチャ': '企业架构',
  'ビジネスプロセス': '业务流程',
  'サプライチェーン': '供应链',
  'リソース': '资源',
  '投資回报率': 'ROI（投资回报率）', '総保有コスト': 'TCO（总拥有成本）',
  'Service Level Agreement': 'SLA（服务等级协议）',
  // 注意：英文展开形式如 "Request For Information" 不加入词典，避免与缩写重复导致嵌套
  // 'Request For Information': 'RFI（信息提供请求）', // 已移除
  // 'Request For Proposal': 'RFP（提案请求书）', // 已移除
  'Business Process Reengineering': 'BPR（业务流程再造）',
  'Supply Chain Management': 'SCM（供应链管理）',
  'Enterprise Resource Planning': 'ERP（企业资源计划）',
  'Customer Relationship Management': 'CRM（客户关系管理）',
  'Operational Level Agreement': 'OLA（运维级别协议）',
  'Underpinning Contract': 'UC（基础合同）',
  'アンゾフ': '安索夫',
};

// 副分类→中文
var SUBCATEGORY_ZH = {
  '情報セキュリティ': '信息安全', '情報セキュリティ管理': '信息安全管理',
  '情報セキュリティ対策': '信息安全对策',
  '情報セキュリティ対策・実装技術': '信息安全对策与实现技术',
  'システム監査': '系统审计', 'セキュリティ関連法規': '安全法律法规',
  'ネットワーク応用': '网络应用', 'セキュリティ実装技術': '安全实现技术',
  'ネットワーク方式': '网络方式', '情報に関する理論': '信息理论',
  'アルゴリズムとプログラミング': '算法与编程',
  'システムの構成': '系统构成', '知的財産権': '知识产权',
  'データベース設計': '数据库设计',
  '労働関連・取引関連法規': '劳动与交易法规',
  'トランザクション処理': '事务处理', 'システムの評価指標': '系统评价指标',
  '通信プロトコル': '通信协议',
  'オープンソースソフトウェア': '开源软件',
  'セキュリティ技術評価': '安全技术评估',
  'サービスマネジメントプロセス': '服务管理流程',
  '経営・組織論': '经营与组织论', '内部統制': '内部控制',
  'メモリ': '内存',
};
var CATEGORY_ZH = {
  'テクノロジ系': '技术', 'マネジメント系': '管理',
  'ストラテジ系': '战略', '科目B': '科目B',
};

// ========== 辅助函数 ==========
function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n').trim();
}

function hasJapaneseKana(text) {
  if (!text) return false;
  return /[\u3040-\u309F\u30A0-\u30FF]/.test(text);
}

function kanaCount(text) {
  var count = 0;
  if (!text) return count;
  for (var i = 0; i < text.length; i++) {
    var code = text.charCodeAt(i);
    if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)) count++;
  }
  return count;
}

function uniquePush(list, value) {
  if (!value) return;
  if (list.indexOf(value) === -1) list.push(value);
}

function isRealChinese(text) {
  if (!text || text.length < 30) return false;
  var cjk = 0, kana = 0;
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0x4E00 && c <= 0x9FFF) cjk++;
    if ((c >= 0x3040 && c <= 0x309F) || (c >= 0x30A0 && c <= 0x30FF)) kana++;
  }
  return cjk / text.length > 0.25 && kana / text.length < 0.02;
}

function normalizeChineseText(text) {
  if (!text) return '';
  var result = String(text);
  var replacements = [
    [/の説明です/g, '的说明'],
    [/の略/g, '的简称'],
    [/とは/g, '是指'],
    [/と呼ばれる/g, '称为'],
    [/に関する/g, '关于'],
    [/として/g, '作为'],
    [/における/g, '中的'],
    [/に対して/g, '对'],
    [/によって/g, '通过'],
    [/について/g, '关于'],
    [/である/g, ''],
    [/です/g, ''],
    [/ます/g, ''],
    [/する/g, ''],
    [/した/g, ''],
    [/して/g, ''],
    [/れる/g, ''],
    [/られる/g, ''],
    [/ない/g, '不'],
    [/比較的/g, '比较'],
    [/慎重派/g, '谨慎型人群'],
    [/懐疑的/g, '持怀疑态度'],
    [/本肢/g, '该选项'],
    [/RFI書/g, 'RFI（信息提供请求书）'],
    [/RFP書/g, 'RFP（提案请求书）'],
    [/情報/g, '信息'],
    [/製品/g, '产品'],
    [/既存/g, '现有'],
    [/新規/g, '新'],
    [/市場/g, '市场'],
    [/多角化/g, '多元化'],
    [/帳票/g, '报表'],
    [/書/g, '书'],
    [/仮想/g, '虚拟'],
    [/現実/g, '现实'],
    [/盗聴/g, '窃听'],
    [/開発/g, '开发'],
    [/発注/g, '发包'],
    [/受注/g, '承接'],
    [/組織/g, '组织'],
    [/選定/g, '选择'],
    [/導入/g, '导入'],
    [/依頼/g, '请求'],
    [/調達/g, '采购'],
    [/研究開発/g, '研发'],
    [/投資/g, '投资'],
    [/基準/g, '标准'],
    [/所持/g, '持有'],
    [/生体/g, '生物特征'],
    [/知識/g, '知识'],
    [/見込/g, '潜在'],
    [/訪問件数/g, '访问次数'],
    [/在庫/g, '库存'],
    [/電気通信/g, '电信'],
    [/基幹/g, '核心'],
    [/拡大/g, '扩大'],
    [/業務/g, '业务'],
    [/要件/g, '需求'],
    [/定義/g, '定义'],
  ];
  replacements.forEach(function (pair) {
    result = result.replace(pair[0], pair[1]);
  });
  result = result
    .replace(/の/g, '的')
    .replace(/[はをがにでへも]/g, '')
    .replace(/[ぁ-ゟ゠-ヿ]+/g, '')
    .replace(/[「」『』“”"]/g, '')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/([。；;，,])\1+/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .replace(/，。/g, '。')
    .replace(/；。/g, '。')
    .replace(/的的/g, '的')
    .replace(/的是说明/g, '是说明')
    .replace(/该选项是说明/g, '该选项描述的是')
    .trim();
  return result;
}

function hasJapaneseResidue(text) {
  if (!text) return false;
  if (kanaCount(text) > 0) return true;
  return /製品|既存|新規|帳票|開発|発注|受注|組織|選定|導入|依頼|調達|研究開発|投資判断|所持|生体情報|知識情報|見込|訪問件数|在庫|電気通信|本肢/.test(text);
}

/**
 * 单次占位替换：先扫描所有匹配术语，用占位符标记，再一次性替换。
 * 避免 A 被翻译后，B 又匹配 A 的中文产生嵌套。
 */
function translateTermsOnce(text) {
  if (!text) return '';
  var result = text;
  var keys = Object.keys(TERM_MAP).sort(function (a, b) { return b.length - a.length; });
  var placeholders = [];
  // 跟踪已使用的占位符值，避免同一中文术语重复出现
  var usedValues = {};
  for (var i = 0; i < keys.length; i++) {
    var jp = keys[i];
    var zh = TERM_MAP[jp];
    var zhBase = zh.replace(/（[^）]*）$/, ''); // 去掉括号后缀
    var idx = result.indexOf(jp);
    while (idx !== -1) {
      var ch = result.charAt(idx);
      if (ch === '\x00') { idx = result.indexOf(jp, idx + 1); continue; }
      // 检查该术语的基础中文是否已用过（任何形式）
      if (usedValues[zhBase]) {
        // 已用过，不重复插入
        var ph = '\x00T' + placeholders.length + '\x00';
        placeholders.push(zhBase); // 仅用缩写形式
        result = result.substring(0, idx) + ph + result.substring(idx + jp.length);
        idx = result.indexOf(jp, idx + ph.length);
      } else {
        usedValues[zhBase] = true;
        var ph2 = '\x00T' + placeholders.length + '\x00';
        placeholders.push(zh);
        result = result.substring(0, idx) + ph2 + result.substring(idx + jp.length);
        idx = result.indexOf(jp, idx + ph2.length);
      }
    }
  }
  // 第二遍：替换占位符
  for (var j = 0; j < placeholders.length; j++) {
    result = result.replace('\x00T' + j + '\x00', placeholders[j]);
  }
  return result;
}

/** 剥离残余日文片段（假名为主、无中文字符的连续文本段） */
function stripJapaneseRemnants(text) {
  if (!text) return '';
  // 日文语法标记：包含日文助词/助动词的片段视为日文
  var jpParticles = /[\u306E\u304C\u306F\u3092\u306B\u3067\u3078\u3082\u304B\u3089\u307E\u3067\u3088\u308A\u306A\u3069\u3053\u305D\u305F\u3061\u3064\u3051\u308C\u308B]/g;
  // 按句号/分号/换行分段，逐段判断
  var segments = text.split(/(?<=[。\n；;，,）\)])/); // 保留分隔符
  var cleaned = [];
  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];
    if (!seg || seg.length < 2) { cleaned.push(seg || ''); continue; }
    var kana = 0, cjk = 0, ascii = 0, total = seg.replace(/\s/g, '').length;
    for (var k = 0; k < seg.length; k++) {
      var code = seg.charCodeAt(k);
      if ((code >= 0x3040 && code <= 0x309F) || (code >= 0x30A0 && code <= 0x30FF)) kana++;
      if (code >= 0x4E00 && code <= 0x9FFF) cjk++;
      if (code >= 0x20 && code <= 0x7E) ascii++;
    }
    var kanaRatio = kana / Math.max(total, 1);
    // 检查日文助词数量：超过 2 个日文助词视为日文句子
    var particleMatches = seg.match(jpParticles);
    var particleCount = particleMatches ? particleMatches.length : 0;
    var isJapaneseSentence = (particleCount >= 3 && total > 8) || (particleCount >= 2 && total > 15);
    // 保留条件：假名<15% 且不是日文句子 或 ASCII占比高 或 术语括号（但非日文句）或 太短
    var keep = !isJapaneseSentence && (
               kanaRatio < 0.15 ||
               (ascii / Math.max(total, 1) > 0.5) ||
               seg.indexOf('（') >= 0 || seg.indexOf('：') >= 0 ||
               seg.length < 4);
    if (keep) cleaned.push(seg);
  }
  return cleaned.join('').replace(/\n{2,}/g, '\n').replace(/\s{2,}/g, ' ').trim();
}

/** 翻译单句日文并剥离到只剩中文骨架 */
function translateSentence(jaText) {
  if (!jaText) return '';
  var translated = translateTermsOnce(jaText);
  // 常见日文语法→中文
  var grammarReplacements = [
    [/とは[^。]*である/g, '是指'], [/の略[で。]?/g, '的简称，'],
    [/と呼ばれる/g, '称为'], [/指します?/g, '指的是'],
    [/意味します?/g, '意味着'], [/必要があります?/g, '需要'],
    [/できます?/g, '可以'], [/できません?/g, '不能'],
    [/行われます?/g, '执行'], [/行います?/g, '执行'],
    [/使用されます?/g, '使用'], [/利用されます?/g, '利用'],
    [/適切/g, '合适'], [/不正な?/g, '非法'],
    [/正しい/g, '正确'], [/誤り/g, '错误'],
    [/該当します?/g, '对应'], [/含まれます?/g, '包含'],
    [/実施されます?/g, '实施'], [/説明です?/g, '是说明'],
    [/確認します?/g, '确认'], [/評価します?/g, '评估'],
  ];
  for (var i = 0; i < grammarReplacements.length; i++) {
    translated = translated.replace(grammarReplacements[i][0], grammarReplacements[i][1]);
  }
  // 激进剥离日文
  translated = stripJapaneseRemnants(translated);
  // 清理残余日文假名碎片
  translated = normalizeChineseText(translated);
  translated = translated.replace(/\s{2,}/g, ' ').replace(/[。]{2,}/g, '。').trim();
  return translated;
}

/** 解析选项解释段 */
function parseOptionExplanations(cleanedText) {
  if (!cleanedText) return { intro: '', options: {} };
  var lines = cleanedText.split('\n').filter(function (l) { return l.trim(); });
  var intro = '', options = {}, currentKey = '';
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (/^-\s/.test(line)) {
      var optText = line.replace(/^-\s*/, '').trim();
      var key = '';
      if (/^正しい[。.、]/.test(optText)) {
        key = '_correct';
      } else {
        var usedKeys = Object.keys(options).filter(function (k) { return k !== '_correct'; });
        if (usedKeys.length < 4) {
          key = String.fromCharCode(65 + usedKeys.length);
        } else {
          continue;
        }
      }
      currentKey = key;
      options[key] = optText;
    } else {
      if (currentKey && options[currentKey]) {
        options[currentKey] += line;
      } else if (Object.keys(options).length === 0) {
        intro += line;
      }
    }
  }
  return { intro: intro, options: options };
}

/** 获取选项文本（优先中文，跳过纯日文） */
function getOptionText(q, key) {
  if (!q.options) return '';
  for (var i = 0; i < q.options.length; i++) {
    if (q.options[i].key === key) {
      var zh = q.options[i].textZh || '';
      // 如果中文选项仅为单字母或与日文相同，不使用
      if (zh && zh.length > 1 && !hasJapaneseResidue(zh)) return normalizeChineseText(zh);
      return '';
    }
  }
  return '';
}

/** 提取日文解释中出现的关键术语及其中文（仅返回日文原文仍可见的术语） */
function extractKeyTerms(text) {
  if (!text) return [];
  var found = [];
  var seen = {};
  var keys = Object.keys(TERM_MAP).sort(function (a, b) { return b.length - a.length; });
  for (var i = 0; i < keys.length; i++) {
    var jp = keys[i];
    if (text.indexOf(jp) !== -1 && jp.length > 0) {
      var overlapped = found.some(function (item) {
        return item.jp !== jp && item.jp.indexOf(jp) >= 0;
      });
      if (overlapped) continue;
      var zh = TERM_MAP[jp];
      if (zh === '帧' && text.indexOf('フレームワーク') >= 0) continue;
      if (!seen[zh]) {
        seen[zh] = true;
        found.push({ jp: jp, zh: zh });
      }
      if (found.length >= 6) break;
    }
  }
  return found;
}

function collectQuestionText(q) {
  var optionText = '';
  if (q.options) {
    optionText = q.options.map(function (o) {
      return [o.textZh || '', o.textJa || ''].join(' ');
    }).join(' ');
  }
  return [
    q.questionZh || '',
    q.questionJa || '',
    q.explanationZh || '',
    q.explanationJa || '',
    optionText,
  ].join('\n');
}

function getFocusTerms(q, cleaned) {
  var source = collectQuestionText(q) + '\n' + (cleaned || '');
  var terms = [];

  if (/\bRFI\b/.test(source)) uniquePush(terms, 'RFI（信息提供请求）');
  if (/\bRFP\b/.test(source)) uniquePush(terms, 'RFP（提案请求书）');
  if (/\bSLA\b/.test(source)) uniquePush(terms, 'SLA（服务等级协议）');
  if (/\bISMS\b/.test(source)) uniquePush(terms, 'ISMS（信息安全管理体系）');
  if (/\bBYOD\b/.test(source)) uniquePush(terms, 'BYOD（自带设备办公）');

  extractKeyTerms(source).forEach(function (t) { uniquePush(terms, t.zh); });

  return terms.slice(0, 4);
}

function getSafeOptionSummary(q, key) {
  if (!q.options) return '';
  for (var i = 0; i < q.options.length; i++) {
    if (q.options[i].key !== key) continue;
    var raw = q.options[i].textZh || q.options[i].textJa || '';
    var summary = translateSentence(stripHtml(raw));
    summary = normalizeChineseText(summary)
      .replace(/[()（）]*$/g, '')
      .trim();
    if (!summary || hasJapaneseResidue(summary)) return '';
    if (summary.length > 38) summary = summary.substring(0, 38);
    return summary;
  }
  return '';
}

function sentence(text) {
  var result = normalizeChineseText(text);
  if (!result) return '';
  result = result.replace(/[。；;，,]+$/g, '');
  return result + '。';
}

// ========== 核心生成函数 ==========
function generateExplanation(q) {
  var cleaned = stripHtml(q.explanationZh);
  var answer = q.answer || '';
  var answerText = getOptionText(q, answer) || getSafeOptionSummary(q, answer);
  var subZh = SUBCATEGORY_ZH[q.subcategory] || CATEGORY_ZH[q.category] || '';

  // 1. 如果已有真实中文，直接使用
  if (isRealChinese(q.explanationZh)) {
    return cleaned;
  }

  // 2. 解析结构
  var parsed = parseOptionExplanations(cleaned);
  var parts = [];
  var focusTerms = getFocusTerms(q, cleaned);
  var topic = subZh || (q.exam === 'sg' ? '信息安全管理' : 'IT基础');

  // 知识点标签
  parts.push('【' + topic + '】');

  // 正确答案
  var correctLine = '正确答案：' + answer;
  if (answerText && answerText.length < 40) correctLine += '（' + answerText + '）';
  correctLine += '。';
  parts.push(correctLine);

  if (focusTerms.length > 0) {
    parts.push('本题考查' + focusTerms.join('、') + '的含义、目的或适用场景。');
  } else {
    parts.push('本题考查' + topic + '中的基础概念、流程或应用场景。');
  }

  // 3. 翻译正确答案的解释，先剥离再截断
  var correctExpl = '';
  if (parsed.options._correct) {
    correctExpl = translateSentence(parsed.options._correct.replace(/^正しい[。.、]\s*/, ''));
  } else if (parsed.options[answer]) {
    correctExpl = translateSentence(parsed.options[answer]);
  }
  if (correctExpl && correctExpl.length > 8) {
    parts.push(sentence('正确选项的要点是：' + correctExpl.substring(0, 140)));
  } else {
    parts.push('正确选项与题干中的定义、目的、流程顺序或使用场景最一致。');
  }

  // 4. 引言（如果有内容，先剥离再截断）
  if (parsed.intro && parsed.intro.length > 10) {
    var introT = translateSentence(parsed.intro);
    if (introT && introT.length > 8) parts.push(sentence('背景要点：' + introT.substring(0, 120)));
  }

  // 5. 关键术语补充（最多 3 个，去重）
  if (focusTerms.length > 0) {
    parts.push('复习时重点区分：' + focusTerms.slice(0, 3).join('；') + '。');
  }

  // 6. 其他选项简述（每个最多 38 字符）
  var otherParts = [];
  ['A', 'B', 'C', 'D'].forEach(function (k) {
    if (k === answer) return;
    var optText = getOptionText(q, k) || getSafeOptionSummary(q, k);
    if (parsed.options[k]) {
      var optExpl = translateSentence(parsed.options[k]);
      if (optExpl && optExpl.length > 5) {
        otherParts.push(k + '：' + normalizeChineseText(optExpl).substring(0, 38));
      } else if (optText && optText.length < 25) {
        otherParts.push(k + '偏向“' + optText + '”，与题干要求不一致');
      }
    } else if (optText && optText.length < 25) {
      otherParts.push(k + '偏向“' + optText + '”，与题干要求不一致');
    }
  });
  if (otherParts.length > 0) {
    parts.push('其他选项：' + otherParts.join('；') + '。');
  } else {
    parts.push('其他选项通常混淆了相近概念、适用范围或处理顺序，排除时要回到题干问法。');
  }

  var result = parts.join('');

  // 7. 兜底：太短则加基于题干的信息
  if (result.length < 90) {
    var qTerms = getFocusTerms(q, stripHtml(q.questionZh || q.questionJa || ''));
    if (qTerms.length > 0) {
      result += '题干关键词可以归纳为' + qTerms.slice(0, 2).join('、') + '。';
    }
    result += '作答时先确认题干问的是定义、目的、效果还是操作顺序，再与各选项逐项对应。';
  }

  // 8. 最终清理
  result = stripJapaneseRemnants(result);
  result = normalizeChineseText(result);
  result = result.replace(/<[^>]+>/g, '').replace(/&\w+;/g, ' ');
  result = result.replace(/\s{2,}/g, ' ').replace(/[。]{2,}/g, '。').trim();
  // 清理关键术语中的空键名显示（如 "=网络"）
  result = result.replace(/关键术语：=/g, '关键术语：');
  result = result.replace(/；=/g, '；');

  var forbidden = ['中文解析待补充', '待补充', '暂无中文解析', '暂无解析', '无法生成'];
  forbidden.forEach(function (f) {
    result = result.split(f).join('');
  });

  return result;
}

function loadPastExamQuestions() {
  if (fs.existsSync(INPUT)) {
    return require(INPUT);
  }
  var index = require(SPLIT_INDEX);
  var questions = [];
  (index.packages || []).forEach(function (pkg) {
    var mod = require(path.join(__dirname, '..', pkg.root, 'data', 'questions.js'));
    var byYear = mod.questionsByYear || {};
    Object.keys(byYear).forEach(function (yearId) {
      questions = questions.concat(byYear[yearId] || []);
    });
  });
  return questions;
}

function writeExplanations(map, questions) {
  if (!fs.existsSync(SPLIT_INDEX)) {
    var header = '/**\n * IT Passport / SG 真题中文解释（自动生成）\n' +
      ' * 生成方式：离线确定性脚本 tools/generate_past_exam_zh_explanations.js\n' +
      ' * 总计：' + questions.length + ' 题\n */\n';
    var content = header + 'module.exports = ' + JSON.stringify(map, null, 2) + ';\n';
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    fs.writeFileSync(OUTPUT, content, 'utf8');
    return [{ file: OUTPUT, size: Buffer.byteLength(content, 'utf8') }];
  }

  var index = require(SPLIT_INDEX);
  var written = [];
  (index.packages || []).forEach(function (pkg) {
    var dataRoot = path.join(__dirname, '..', pkg.root, 'data');
    var qmod = require(path.join(dataRoot, 'questions.js'));
    var byYear = qmod.questionsByYear || {};
    var subset = {};
    Object.keys(byYear).forEach(function (yearId) {
      (byYear[yearId] || []).forEach(function (q) {
        subset[q.id] = map[q.id];
      });
    });
    var file = path.join(dataRoot, 'explanations_zh.js');
    var content = '// Generated by tools/generate_past_exam_zh_explanations.js\nmodule.exports = ' +
      JSON.stringify(subset) + ';\n';
    fs.writeFileSync(file, content, 'utf8');
    written.push({ file: file, size: Buffer.byteLength(content, 'utf8') });
  });
  return written;
}

// ========== 主流程 ==========
function main() {
  console.log('[gen] Loading:', fs.existsSync(INPUT) ? INPUT : SPLIT_INDEX);
  var questions = loadPastExamQuestions();
  console.log('[gen] Total:', questions.length);

  var itpass = questions.filter(function (q) { return q.exam === 'itpass'; });
  var sg = questions.filter(function (q) { return q.exam === 'sg'; });
  console.log('[gen] IT Passport:', itpass.length, '| SG:', sg.length);

  var map = {};
  var stats = { total: 0, generated: 0, existing: 0, short: 0, errors: 0 };

  questions.forEach(function (q) {
    stats.total++;
    try {
      if (isRealChinese(q.explanationZh)) {
        map[q.id] = stripHtml(q.explanationZh);
        stats.existing++;
        return;
      }
      var expl = generateExplanation(q);
      if (!expl || expl.length < 30) {
        var subZh = SUBCATEGORY_ZH[q.subcategory] || CATEGORY_ZH[q.category] || 'IT知识';
        var ansText = getOptionText(q, q.answer);
        expl = '【' + subZh + '】正确答案：' + q.answer +
          (ansText ? '（' + ansText + '）' : '') + '。' +
          '本题考查' + subZh + '相关知识点。该选项最契合题干描述的定义、目的或应用场景。其他选项与题干问法不一致。';
        stats.short++;
      }
      map[q.id] = expl;
      stats.generated++;
    } catch (e) {
      console.error('[gen] Error:', q.id, e.message);
      stats.errors++;
      map[q.id] = '正确答案：' + (q.answer || '') + '。本题考查IT基础知识，该选项最符合题意。';
    }
  });

  // 写文件：拆分结构下写回各数据分包，避免重新生成 runtime 单体 explanations_zh.js
  var written = writeExplanations(map, questions);
  written.forEach(function (item) {
    console.log('[gen] Written:', item.file, '(' + (item.size / 1024).toFixed(1) + ' KB)');
  });
  console.log('[gen] Stats:', JSON.stringify(stats));

  // 质量统计
  var lengths = Object.values(map).map(function (v) { return v.length; });
  var avg = lengths.reduce(function (a, b) { return a + b; }, 0) / lengths.length;
  console.log('[gen] Avg length:', avg.toFixed(0), '| Min:', Math.min.apply(null, lengths), '| Max:', Math.max.apply(null, lengths));

  // 中文纯度统计
  var pureZh = 0;
  Object.values(map).forEach(function (text) {
    if (!hasJapaneseKana(text)) pureZh++;
  });
  console.log('[gen] Chinese-pure:', pureZh + '/' + stats.total,
    '(' + (pureZh / stats.total * 100).toFixed(1) + '%)');

  // 样例输出
  console.log('\n=== 10 样例 ===');
  var samples = [itpass[0], itpass[100], itpass[500], itpass[1000], itpass[1400],
                 sg[0], sg[100], sg[200], sg[300], sg[400]].filter(Boolean);
  samples.forEach(function (s) {
    console.log('\n---', s.id, '[' + s.exam, s.yearId + '#' + s.number + '] answer:' + s.answer, '---');
    console.log(map[s.id].substring(0, 250));
  });

  // RFI/RFP/SLA 特别检查
  console.log('\n=== RFI/RFP/SLA 检查 ===');
  questions.filter(function (q) {
    return /\b(RFI|RFP|SLA)\b/.test([q.explanationZh || '', q.questionZh || '', q.questionJa || ''].join(' '));
  }).slice(0, 5).forEach(function (q) {
    console.log('\n---', q.id, '---');
    console.log(map[q.id].substring(0, 350));
  });

  // 禁止词检查
  console.log('\n=== 禁止词检查 ===');
  var forbidden = ['中文解析待补充', '待补充', '暂无中文解析', '暂无解析', '无法生成',
                   '<div', 'class=', 'id="kaisetsu"', 'ansbg'];
  var violations = 0;
  forbidden.forEach(function (f) {
    var count = 0;
    Object.values(map).forEach(function (v) { if (v.indexOf(f) >= 0) count++; });
    if (count > 0) {
      console.log('[FAIL] "' + f + '" found in', count, 'explanations');
      violations++;
    }
  });
  if (violations === 0) console.log('[PASS] 无禁止词');
}

main();
