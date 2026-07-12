var terms = [
  {
    "id": "cpu",
    "en": "CPU",
    "ja": "CPU（中央処理装置）",
    "zh": "CPU（中央处理器）",
    "termType": "hardware-component",
    "definitionJa": "コンピュータの中心的な処理装置。プログラムの命令を読み取り、解釈し、実行する。演算装置（ALU）と制御装置から構成され、クロック信号に同期して動作する。",
    "definitionZh": "计算机的核心处理部件，负责读取、解释和执行程序指令。由运算器（ALU）和控制器组成，按时钟信号同步运行。",
    "contextJa": "ITパスポート試験では、CPUの構成要素、クロック周波数と処理速度の関係、パイプライン処理の基本概念が出題される。",
    "contextZh": "IT Passport考试会考察CPU的构成要素、时钟频率与处理速度的关系、流水线处理的基本概念。",
    "compareWith": [
      "gpu",
      "microcontroller"
    ],
    "examCueJa": "「クロック周波数が高いほど処理速度が速い」「パイプライン処理は命令の並列実行を可能にする」を正しく理解する。制御装置と演算装置の役割の違いを問う問題に注意。",
    "examCueZh": "正确理解「时钟频率越高处理速度越快」「流水线处理使指令可并行执行」。注意区分控制器和运算器的不同角色。",
    "sourceRefs": [
      "itpass-ch01"
    ]
  },
  {
    "id": "ram",
    "en": "RAM",
    "ja": "RAM（主記憶装置）",
    "zh": "RAM（主存储器）",
    "termType": "hardware-component",
    "definitionJa": "Random Access Memory。CPUが直接アクセスできる揮発性メモリ。電源を切るとデータが消える。DRAMとSRAMに分類され、主記憶装置として使用される。",
    "definitionZh": "随机存取存储器，CPU可直接访问的易失性内存。断电后数据消失。分为DRAM和SRAM，用作主存储器。",
    "contextJa": "DRAMとSRAMの違い（リフレッシュの要否、速度、コスト）、半導体メモリの分類が頻出。",
    "contextZh": "DRAM与SRAM的区别（是否需要刷新、速度、成本）、半导体存储器的分类是常见考点。",
    "compareWith": [
      "rom",
      "dram",
      "sram",
      "flash-memory"
    ],
    "examCueJa": "「RAMは揮発性、ROMは不揮発性」の基本分類を覚える。DRAMはリフレッシュが必要で安価、SRAMは高速だが高価。",
    "examCueZh": "记住「RAM是易失性、ROM是非易失性」的基本分类。DRAM需要刷新、价格低；SRAM速度快但价格高。",
    "sourceRefs": [
      "itpass-ch01"
    ]
  },
  {
    "id": "rom",
    "en": "ROM",
    "ja": "ROM（読出専用メモリ）",
    "zh": "ROM（只读存储器）",
    "termType": "hardware-component",
    "definitionJa": "Read Only Memory。電源を切ってもデータが消えない不揮発性メモリ。BIOSやファームウェアの格納に使用される。",
    "definitionZh": "只读存储器，断电后数据不消失的非易失性内存。用于存储BIOS和固件。",
    "contextJa": "ROMの種類と特徴（書き換え可否、消去方法）の区別が試験で問われる。フラッシュメモリはUSBメモリやSSDに使用される。",
    "contextZh": "考试会考察ROM各类型的特征（是否可改写、擦除方式）。闪存用于USB存储器和SSD。",
    "compareWith": [
      "ram",
      "flash-memory"
    ],
    "examCueJa": "「ROMは不揮発性」という基本性質と、各種ROMの書き換え可否の違いを整理する。EEPROMとフラッシュメモリは電気的に消去・書き換え可能。",
    "examCueZh": "整理「ROM是非易失性」的基本性质以及各类型ROM的改写能力差异。EEPROM和闪存可通过电信号擦除改写。",
    "sourceRefs": [
      "itpass-ch01"
    ]
  },
  {
    "id": "os",
    "en": "OS",
    "ja": "OS（オペレーティングシステム）",
    "zh": "OS（操作系统）",
    "termType": "software-concept",
    "definitionJa": "Operating System。コンピュータのハードウェア資源を管理し、アプリケーションに共通のインタフェースを提供する基本ソフトウェア。",
    "definitionZh": "操作系统，管理计算机硬件资源、为应用程序提供通用接口的基础软件。",
    "contextJa": "カーネルとシェルの役割の違い、マルチタスクの種類、仮想記憶の仕組みが頻出。",
    "contextZh": "内核与外壳的角色差异、多任务类型、虚拟内存机制是常见考点。",
    "compareWith": [
      "kernel",
      "shell",
      "firmware"
    ],
    "examCueJa": "「カーネルはOSの中核でハードウェアを直接制御」「シェルは利用者とOSのインタフェース」の区別を理解する。",
    "examCueZh": "理解「内核是OS核心，直接控制硬件」「外壳是用户与OS的接口」的区别。",
    "sourceRefs": [
      "itpass-ch02"
    ]
  },
  {
    "id": "dbms",
    "en": "DBMS",
    "ja": "DBMS（データベース管理システム）",
    "zh": "DBMS（数据库管理系统）",
    "termType": "software-concept",
    "definitionJa": "Database Management System。データベースを管理・操作するためのソフトウェア。データの一元管理、整合性保持、同時実行制御、障害回復などの機能を提供する。",
    "definitionZh": "数据库管理系统，用于管理和操作数据库的软件。提供数据集中管理、一致性维护、并发控制、故障恢复等功能。",
    "contextJa": "RDBMSが主流。SQLを用いてデータの定義・操作・制御を行う。正規化、トランザクション管理、ACID特性が重要。",
    "contextZh": "RDBMS是主流。使用SQL进行数据定义、操作和控制。规范化、事务管理、ACID特性是重点。",
    "compareWith": [
      "rdbms",
      "sql"
    ],
    "examCueJa": "「DBMSはデータの一元管理と整合性保持を実現する」「正規化はデータの重複を排除し整合性を高める」が基本。ACIDの各特性を区別できること。",
    "examCueZh": "「DBMS实现数据集中管理与一致性维护」「规范化消除数据冗余提高一致性」是基础。能区分ACID各特性。",
    "sourceRefs": [
      "itpass-ch03"
    ]
  },
  {
    "id": "lan",
    "en": "LAN",
    "ja": "LAN（ローカルエリアネットワーク）",
    "zh": "LAN（局域网）",
    "termType": "network-concept",
    "definitionJa": "Local Area Network。同一建物内や限られた範囲でコンピュータや機器を接続するネットワーク。Ethernet、Wi-Fiが代表的な規格。",
    "definitionZh": "局域网，在同一建筑物或有限范围内连接计算机和设备的网络。以太网、Wi-Fi是代表性标准。",
    "contextJa": "LANとWANの違い、CSMA/CD方式、スイッチングハブとリピータハブの違いが頻出。",
    "contextZh": "LAN与WAN的区别、CSMA/CD方式、交换式集线器与中继集线器的区别是常见考点。",
    "compareWith": [
      "wan",
      "vlan"
    ],
    "examCueJa": "「LANは限られた範囲」「WANは広域」の基本区別。CSMA/CDはEthernetの衝突検出方式。",
    "examCueZh": "基本区分「LAN是有限范围」「WAN是广域」。CSMA/CD是以太网的冲突检测方式。",
    "sourceRefs": [
      "itpass-ch04"
    ]
  },
  {
    "id": "firewall",
    "en": "Firewall",
    "ja": "ファイアウォール",
    "zh": "防火墙",
    "termType": "security-concept",
    "definitionJa": "ネットワークの境界に設置し、不正アクセスを防ぐセキュリティ機構。パケットフィルタリング、アプリケーションゲートウェイなどの方式がある。",
    "definitionZh": "设置在网络边界、防止非法访问的安全机制。有报文过滤、应用网关等方式。",
    "contextJa": "ファイアウォールの種類、DMZの概念、IDS/IPSとの違いが試験で問われる。",
    "contextZh": "考试会考察防火墙类型、DMZ概念、与IDS/IPS的区别。",
    "compareWith": [
      "ids",
      "ips",
      "dmz"
    ],
    "examCueJa": "「ファイアウォールはネットワーク境界防御」「IDSは検知、IPSは検知+防御」の役割の違いを理解する。",
    "examCueZh": "理解「防火墙是网络边界防御」「IDS检测、IPS检测+防御」的角色差异。",
    "sourceRefs": [
      "itpass-ch05"
    ]
  },
  {
    "id": "encryption",
    "en": "Encryption",
    "ja": "暗号化",
    "zh": "加密",
    "termType": "security-concept",
    "definitionJa": "データを第三者に読めない形式に変換する技術。共通鍵暗号方式（AES等）と公開鍵暗号方式（RSA等）に大別される。",
    "definitionZh": "将数据转换为第三方不可读形式的技术。分为对称密钥加密（AES等）和公钥加密（RSA等）。",
    "contextJa": "共通鍵暗号と公開鍵暗号の違い、それぞれの長所短所、ハイブリッド暗号方式の仕組みが重要。",
    "contextZh": "对称密钥与公钥加密的区别、各自的优缺点、混合加密方式是重点。",
    "compareWith": [
      "public-key",
      "symmetric-key",
      "hash"
    ],
    "examCueJa": "「共通鍵暗号=暗号化と復号に同じ鍵（高速）」「公開鍵暗号=暗号化と復号に異なる鍵（鍵配送が安全）」を区別する。",
    "examCueZh": "区分「对称密钥=加密解密用同一密钥（快速）」「公钥=加密解密用不同密钥（密钥分发安全）」。",
    "sourceRefs": [
      "itpass-ch05"
    ]
  },
  {
    "id": "sdlc",
    "en": "SDLC",
    "ja": "SDLC（システム開発ライフサイクル）",
    "zh": "SDLC（系统开发生命周期）",
    "termType": "development-concept",
    "definitionJa": "System Development Life Cycle。システム開発の計画から運用・保守までの一連の工程。要件定義、設計、実装、テスト、導入、運用の各フェーズからなる。",
    "definitionZh": "系统开发生命周期，从系统开发规划到运维的一系列工程。包括需求定义、设计、实现、测试、部署、运维各阶段。",
    "contextJa": "ウォータフォールモデルとアジャイル開発の違い、各テスト工程の役割が出題される。",
    "contextZh": "会考察瀑布模型与敏捷开发的区别、各测试阶段的角色。",
    "compareWith": [
      "waterfall",
      "agile"
    ],
    "examCueJa": "「ウォータフォール=前工程完了後に次工程」「アジャイル=短いサイクルで反復開発」の違い。",
    "examCueZh": "区分「瀑布=前阶段完成后进入下一阶段」「敏捷=短周期迭代开发」。",
    "sourceRefs": [
      "itpass-ch06"
    ]
  },
  {
    "id": "erp",
    "en": "ERP",
    "ja": "ERP（企業資源計画）",
    "zh": "ERP（企业资源计划）",
    "termType": "business-concept",
    "definitionJa": "Enterprise Resource Planning。企業の経営資源（人・物・金・情報）を統合的に管理するシステム。",
    "definitionZh": "企业资源计划，综合管理企业经营资源（人财物信息）的系统。",
    "contextJa": "ERPの導入目的、SCMやCRMとの違いが頻出。",
    "contextZh": "ERP的导入目的、与SCM和CRM的区别是常见考点。",
    "compareWith": [
      "scm",
      "crm"
    ],
    "examCueJa": "「ERPは社内資源の統合管理」「SCMは供給連鎖全体の最適化」「CRMは顧客関係管理」の対象範囲の違いを区別する。",
    "examCueZh": "区分「ERP是内部资源综合管理」「SCM是供应链整体优化」「CRM是客户关系管理」的对象范围差异。",
    "sourceRefs": [
      "itpass-ch09"
    ]
  },
  {
    "id": "algorithm",
    "en": "Algorithm",
    "ja": "アルゴリズム",
    "zh": "算法",
    "termType": "cs-concept",
    "definitionJa": "問題を解決するための手順や計算方法を定式化したもの。整列（ソート）、探索（サーチ）、再帰などの基本的なアルゴリズムが存在する。",
    "definitionZh": "将解决问题的步骤或计算方法形式化的产物。存在排序、搜索、递归等基本算法。",
    "contextJa": "整列アルゴリズムの種類とその計算量、探索アルゴリズムの違いが出題される。",
    "contextZh": "会考察排序算法类型及其计算量、搜索算法的区别。",
    "compareWith": [
      "sort",
      "search"
    ],
    "examCueJa": "「クイックソートは分割統治法で高速」「二分探索は整列済みデータが前提」の条件を理解する。",
    "examCueZh": "理解「快速排序使用分治法速度较快」「二分搜索以已排序数据为前提」的条件。",
    "sourceRefs": [
      "itpass-ch08"
    ]
  },
  {
    "id": "compliance",
    "en": "Compliance",
    "ja": "コンプライアンス",
    "zh": "合规",
    "termType": "legal-concept",
    "definitionJa": "法令や社会規範を遵守すること。企業活動においては、会社法、金融商品取引法、個人情報保護法などの法令遵守が求められる。",
    "definitionZh": "遵守法律法规和社会规范。在企业活动中需要遵守公司法、金融商品交易法、个人信息保护法等法规。",
    "contextJa": "コーポレートガバナンスと内部統制の関係、CSRとの関連が出題される。",
    "contextZh": "会考察公司治理与内部控制的关系、CSR的关联。",
    "compareWith": [
      "corporate-governance",
      "internal-control"
    ],
    "examCueJa": "「コンプライアンス=法令遵守」「内部統制=業務の効率性・財務報告の信頼性・法令遵守を確保する仕組み」の違いを理解する。",
    "examCueZh": "理解「合规=遵守法律」「内部控制=确保业务效率、财务报告可靠性、守法合规的机制」的区别。",
    "sourceRefs": [
      "itpass-ch10"
    ]
  }
];
module.exports = terms;
