var terms = [
  {
    "id": "sg-info-security",
    "en": "Information Security",
    "ja": "情報セキュリティ",
    "zh": "信息安全",
    "termType": "security-concept",
    "definitionJa": "情報資産の機密性（Confidentiality）、完全性（Integrity）、可用性（Availability）を維持すること。この3要素をCIAトライアドと呼ぶ。",
    "definitionZh": "维护信息资产的机密性（Confidentiality）、完整性（Integrity）、可用性（Availability）。这三要素称为CIA三元组。",
    "contextJa": "SG試験ではCIAの各要素の定義と具体例、情報セキュリティポリシーの階層が頻出。",
    "contextZh": "SG考试中CIA各要素的定义与具体示例、信息安全策略的层级是常见考点。",
    "compareWith": [
      "sg-cia",
      "sg-risk-management"
    ],
    "examCueJa": "「機密性＝許可された者のみアクセス可能」「完全性＝データが正確で改ざんされていない」「可用性＝必要なときに利用可能」を正確に区別する。",
    "examCueZh": "准确区分「机密性=仅授权者可访问」「完整性=数据准确未被篡改」「可用性=需要时可用」。",
    "sourceRefs": [
      "sg-ch01"
    ]
  },
  {
    "id": "sg-malware",
    "en": "Malware",
    "ja": "マルウェア",
    "zh": "恶意软件",
    "termType": "security-threat",
    "definitionJa": "コンピュータウイルス、ワーム、トロイの木馬、スパイウェア、ランサムウェアなど、悪意のあるソフトウェアの総称。",
    "definitionZh": "恶意软件的统称，包括计算机病毒、蠕虫、特洛伊木马、间谍软件、勒索软件等。",
    "contextJa": "各マルウェアの感染経路、動作の違い、対策を区別できることが重要。",
    "contextZh": "能区分各恶意软件的感染途径、行为差异和对策很重要。",
    "compareWith": [
      "sg-virus",
      "sg-worm",
      "sg-ransomware"
    ],
    "examCueJa": "「ウイルス＝宿主が必要・自己複製」「ワーム＝自律拡散」「トロイの木馬＝有用ソフトを装う」「ランサムウェア＝データを暗号化し身代金要求」の区別を正確に。",
    "examCueZh": "准确区分「病毒=需要宿主·自我复制」「蠕虫=自主扩散」「特洛伊木马=伪装成有用软件」「勒索软件=加密数据索要赎金」。",
    "sourceRefs": [
      "sg-ch01"
    ]
  },
  {
    "id": "sg-ransomware",
    "en": "Ransomware",
    "ja": "ランサムウェア",
    "zh": "勒索软件",
    "termType": "security-threat",
    "definitionJa": "感染したコンピュータのファイルを暗号化し、復号のための身代金（ランサム）を要求するマルウェア。",
    "definitionZh": "加密受感染计算机的文件，要求支付赎金以解密的恶意软件。",
    "contextJa": "ランサムウェア対策として、定期的なバックアップ（特にオフラインバックアップ）が重要。",
    "contextZh": "作为勒索软件对策，定期备份（尤其是离线备份）至关重要。",
    "compareWith": [
      "sg-backup",
      "sg-malware"
    ],
    "examCueJa": "「ランサムウェア対策＝定期的バックアップ＋オフライン保管」「同一ネットワーク上のバックアップも暗号化される可能性がある」を理解する。",
    "examCueZh": "理解「勒索软件对策=定期备份+离线保管」「同一网络上的备份也可能被加密」。",
    "sourceRefs": [
      "sg-ch01"
    ]
  },
  {
    "id": "sg-backup",
    "en": "Backup",
    "ja": "バックアップ",
    "zh": "备份",
    "termType": "security-measure",
    "definitionJa": "データの消失や破損に備えて、データの複製を作成し保管すること。フルバックアップ、差分バックアップ、増分バックアップなどの方式がある。",
    "definitionZh": "为防范数据丢失或损坏，创建并保管数据副本。有全量备份、差异备份、增量备份等方式。",
    "contextJa": "ランサムウェア対策としてのオフラインバックアップの重要性、バックアップの3-2-1ルールが試験で問われる。",
    "contextZh": "考试会考察作为勒索软件对策的离线备份重要性、备份的3-2-1规则。",
    "compareWith": [
      "sg-ransomware",
      "sg-bcp"
    ],
    "examCueJa": "「バックアップがあれば復旧できる」だけでは不十分。「オフライン」「リストア手順の検証」「バックアップの世代管理」が実践的な対策として問われる。",
    "examCueZh": "仅「有备份就能恢复」不够。「离线」「恢复步骤验证」「备份的版本管理」作为实践对策会被考察。",
    "sourceRefs": [
      "sg-ch01"
    ]
  },
  {
    "id": "sg-access-control",
    "en": "Access Control",
    "ja": "アクセス制御",
    "zh": "访问控制",
    "termType": "security-measure",
    "definitionJa": "情報資産へのアクセスを許可された主体のみに制限するセキュリティ対策。物理的アクセス制御、論理的アクセス制御、生体認証などの種類がある。",
    "definitionZh": "将信息资产的访问限制为仅授权主体的安全对策。包括物理访问控制、逻辑访问控制、生物认证等类型。",
    "contextJa": "「主体（ユーザ）」「客体（ファイル等）」「アクセス権」の3要素、アクセス制御リスト（ACL）、MACとDACの違いが重要。",
    "contextZh": "「主体（用户）」「客体（文件等）」「访问权限」三要素、ACL、MAC与DAC的区别是重点。",
    "compareWith": [
      "sg-authentication",
      "sg-authorization"
    ],
    "examCueJa": "「認証=本人確認」「認可=権限付与」「アクセス制御=権限に基づくアクセス制限」の3段階を区別する。",
    "examCueZh": "区分「认证=身份确认」「授权=权限赋予」「访问控制=基于权限的访问限制」三个阶段。",
    "sourceRefs": [
      "sg-ch04"
    ]
  },
  {
    "id": "sg-pki",
    "en": "PKI",
    "ja": "PKI（公開鍵基盤）",
    "zh": "PKI（公钥基础设施）",
    "termType": "security-technology",
    "definitionJa": "Public Key Infrastructure。公開鍵暗号方式を用いたセキュリティ基盤。認証局（CA）が発行するデジタル証明書によって公開鍵の真正性を保証する。",
    "definitionZh": "公钥基础设施，使用公钥加密的安全基础设施。通过认证机构（CA）签发的数字证书保证公钥的真实性。",
    "contextJa": "デジタル署名の仕組み、認証局の役割、証明書失効リスト（CRL）が試験に出る。",
    "contextZh": "考试会出现数字签名机制、认证机构角色、证书吊销列表（CRL）。",
    "compareWith": [
      "sg-digital-signature",
      "sg-ca"
    ],
    "examCueJa": "「PKI=公開鍵の真正性を保証する基盤」「デジタル署名=改ざん検知と送信者認証を実現」の役割を理解する。",
    "examCueZh": "理解「PKI=保证公钥真实性的基础设施」「数字签名=实现篡改检测和发送者认证」。",
    "sourceRefs": [
      "sg-ch04"
    ]
  },
  {
    "id": "sg-isms",
    "en": "ISMS",
    "ja": "ISMS（情報セキュリティマネジメントシステム）",
    "zh": "ISMS（信息安全管理体系）",
    "termType": "security-management",
    "definitionJa": "Information Security Management System。組織の情報セキュリティを管理するための体系的な枠組み。ISO/IEC 27001が代表的な規格。PDCAサイクルに基づいて運用する。",
    "definitionZh": "信息安全管理体系，管理组织信息安全的系统性框架。ISO/IEC 27001是代表性标准。基于PDCA循环运作。",
    "contextJa": "ISMSの構築・運用プロセス、リスクアセスメントとリスク対応の関係、JIS Q 27001との対応が出題される。",
    "contextZh": "会考察ISMS的构建运营流程、风险评估与风险应对的关系、与JIS Q 27001的对应。",
    "compareWith": [
      "sg-risk-management",
      "sg-security-policy"
    ],
    "examCueJa": "「ISMS=PDCAによる継続的改善」Plan（計画）=リスクアセスメント、Do（実行）=対策実施、Check（評価）=監査、Act（改善）=是正の各フェーズを正確に。",
    "examCueZh": "准确把握「ISMS=基于PDCA的持续改进」各阶段。",
    "sourceRefs": [
      "sg-ch05"
    ]
  },
  {
    "id": "sg-vpn",
    "en": "VPN",
    "ja": "VPN（仮想プライベートネットワーク）",
    "zh": "VPN（虚拟专用网络）",
    "termType": "security-technology",
    "definitionJa": "Virtual Private Network。インターネットなどの公衆回線を用いて、仮想的な専用線を構築する技術。暗号化とトンネリングによって安全な通信を実現する。",
    "definitionZh": "虚拟专用网络，利用互联网等公共线路构建虚拟专线的技术。通过加密和隧道技术实现安全通信。",
    "contextJa": "IPsec-VPNとSSL-VPNの違い、トンネリングの仕組み、リモートアクセスVPNの用途が出題される。",
    "contextZh": "会考察IPsec-VPN与SSL-VPN的区别、隧道机制、远程访问VPN的用途。",
    "compareWith": [
      "sg-ipsec",
      "sg-ssl-tls"
    ],
    "examCueJa": "「VPN=公衆回線で仮想専用線を実現」「IPsec-VPNはネットワーク層で暗号化」「SSL-VPNはアプリケーション層で暗号化」の違いを理解する。",
    "examCueZh": "理解「VPN=通过公共线路实现虚拟专线」「IPsec-VPN在网络层加密」「SSL-VPN在应用层加密」的区别。",
    "sourceRefs": [
      "sg-ch06"
    ]
  },
  {
    "id": "sg-system-config",
    "en": "System Configuration",
    "ja": "システム構成",
    "zh": "系统构成",
    "termType": "system-concept",
    "definitionJa": "情報システムのハードウェア・ソフトウェア・ネットワークの組み合わせ方。集中処理システムと分散処理システム、クライアントサーバシステム、クラウドコンピューティングなどの構成がある。",
    "definitionZh": "信息系统硬件、软件、网络的组合方式。包括集中处理与分布式处理、客户端服务器系统、云计算等构成。",
    "contextJa": "可用性を高めるための二重化、冗長化、負荷分散の手法、フォールトトレラントシステムの考え方が出題される。",
    "contextZh": "会考察提高可用性的双工、冗余、负载均衡方法以及容错系统的概念。",
    "compareWith": [
      "sg-redundancy",
      "sg-fault-tolerance"
    ],
    "examCueJa": "「二重化=同一機器を2台用意」「冗長化=予備の機器を用意」「フォールトトレラント=故障してもシステム全体は停止しない設計」の違いを区別する。",
    "examCueZh": "区分「双工=准备两台相同设备」「冗余=准备备用设备」「容错=即使故障系统整体也不停止的设计」。",
    "sourceRefs": [
      "sg-ch07"
    ]
  },
  {
    "id": "sg-database",
    "en": "Database",
    "ja": "データベース方式",
    "zh": "数据库方式",
    "termType": "system-concept",
    "definitionJa": "データを効率的に管理・検索するためのシステム。関係データベース（RDB）が主流で、SQLを用いて操作する。正規化によってデータの重複を排除し整合性を保つ。",
    "definitionZh": "用于高效管理和检索数据的系统。关系数据库（RDB）是主流，使用SQL操作。通过规范化消除数据冗余、保持一致性。",
    "contextJa": "データベースのトランザクション管理、ACID特性、排他制御（ロック）、デッドロックの概念が頻出。",
    "contextZh": "数据库的事务管理、ACID特性、排他控制（锁）、死锁概念是常见考点。",
    "compareWith": [
      "sg-transaction",
      "sg-normalization"
    ],
    "examCueJa": "「ACID=原子性・一貫性・独立性・永続性」「排他制御=同時実行時のデータ整合性確保」「デッドロック=複数のトランザクションが互いにロック解放を待つ状態」を区別する。",
    "examCueZh": "区分「ACID=原子性一致性隔离性持久性」「排他控制=确保并发时数据一致性」「死锁=多个事务互相等待锁释放的状态」。",
    "sourceRefs": [
      "sg-ch07"
    ]
  },
  {
    "id": "sg-network",
    "en": "Network",
    "ja": "ネットワーク方式",
    "zh": "网络方式",
    "termType": "system-concept",
    "definitionJa": "コンピュータ同士を接続し、データやリソースを共有するための仕組み。LAN、WAN、インターネットVPNなどの接続形態、TCP/IPなどのプロトコルが基本となる。",
    "definitionZh": "连接计算机、共享数据和资源的机制。LAN、WAN、互联网VPN等连接形态，TCP/IP等协议是基础。",
    "contextJa": "ネットワークのセキュリティ対策として、ファイアウォール、IDS/IPS、DMZの配置、セグメント分割が重要。",
    "contextZh": "作为网络安全对策，防火墙、IDS/IPS、DMZ配置、网段划分很重要。",
    "compareWith": [
      "sg-firewall",
      "sg-segmentation"
    ],
    "examCueJa": "「DMZ=外部と内部の緩衝地帯」「セグメント分割=ネットワークを論理的に分離し被害範囲を限定」の役割を理解する。",
    "examCueZh": "理解「DMZ=外部与内部的缓冲地带」「网段划分=逻辑分离网络、限制受害范围」的角色。",
    "sourceRefs": [
      "sg-ch07"
    ]
  }
];
module.exports = terms;
