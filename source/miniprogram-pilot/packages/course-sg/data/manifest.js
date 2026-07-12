var sourcesModule = require('./sources');

var chapters = [
  {
    "id": "itpass-ch01",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 1,
    "titleJa": "第1章 ハードウェアと基礎理論［テクノロジ系］",
    "titleZh": "第1章 硬件与基础理论",
    "sectionGroups": [
      {
        "id": "itpass-ch01-sec-101",
        "nativeSectionId": "1-01",
        "titleJa": "1-01 情報に関する理論",
        "titleZh": "1-01 信息相关理论",
        "units": [
          {
            "id": "itpass-1-01",
            "titleJa": "1-01 情報に関する理論",
            "titleZh": "1-01 信息相关理论",
            "pdfPageStart": 18,
            "pdfPageEnd": 21,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-102",
        "nativeSectionId": "1-02",
        "titleJa": "1-02 コンピュータの構成とCPU",
        "titleZh": "1-02 计算机构成与CPU",
        "units": [
          {
            "id": "itpass-1-02",
            "titleJa": "1-02 コンピュータの構成とCPU",
            "titleZh": "1-02 计算机构成与CPU",
            "pdfPageStart": 22,
            "pdfPageEnd": 25,
            "questionCount": 2,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-103",
        "nativeSectionId": "1-03",
        "titleJa": "1-03 主記憶と補助記憶",
        "titleZh": "1-03 主存储器与辅助存储器",
        "units": [
          {
            "id": "itpass-1-03",
            "titleJa": "1-03 主記憶と補助記憶",
            "titleZh": "1-03 主存储器与辅助存储器",
            "pdfPageStart": 26,
            "pdfPageEnd": 31,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-104",
        "nativeSectionId": "1-04",
        "titleJa": "1-04 半導体メモリ",
        "titleZh": "1-04 半导体存储器",
        "units": [
          {
            "id": "itpass-1-04",
            "titleJa": "1-04 半導体メモリ",
            "titleZh": "1-04 半导体存储器",
            "pdfPageStart": 32,
            "pdfPageEnd": 35,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-105",
        "nativeSectionId": "1-05",
        "titleJa": "1-05 入出力装置",
        "titleZh": "1-05 输入输出设备",
        "units": [
          {
            "id": "itpass-1-05",
            "titleJa": "1-05 入出力装置",
            "titleZh": "1-05 输入输出设备",
            "pdfPageStart": 36,
            "pdfPageEnd": 41,
            "questionCount": 4,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-106",
        "nativeSectionId": "1-06",
        "titleJa": "1-06 入出力インタフェース",
        "titleZh": "1-06 输入输出接口",
        "units": [
          {
            "id": "itpass-1-06",
            "titleJa": "1-06 入出力インタフェース",
            "titleZh": "1-06 输入输出接口",
            "pdfPageStart": 42,
            "pdfPageEnd": 45,
            "questionCount": 3,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-107",
        "nativeSectionId": "1-07",
        "titleJa": "1-07 AI",
        "titleZh": "1-07 人工智能 (AI)",
        "units": [
          {
            "id": "itpass-1-07",
            "titleJa": "1-07 AI",
            "titleZh": "1-07 人工智能 (AI)",
            "pdfPageStart": 46,
            "pdfPageEnd": 55,
            "questionCount": 3,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-108",
        "nativeSectionId": "1-08",
        "titleJa": "1-08 確率と統計",
        "titleZh": "1-08 概率与统计",
        "units": [
          {
            "id": "itpass-1-08",
            "titleJa": "1-08 確率と統計",
            "titleZh": "1-08 概率与统计",
            "pdfPageStart": 56,
            "pdfPageEnd": 61,
            "questionCount": 3,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch01-sec-109",
        "nativeSectionId": "1-09",
        "titleJa": "1-09 基数変換",
        "titleZh": "1-09 进制转换",
        "units": [
          {
            "id": "itpass-1-09",
            "titleJa": "1-09 基数変換",
            "titleZh": "1-09 进制转换",
            "pdfPageStart": 62,
            "pdfPageEnd": 65,
            "questionCount": 3,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch02",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 2,
    "titleJa": "第2章 ソフトウェア［テクノロジ系］",
    "titleZh": "第2章 软件",
    "sectionGroups": [
      {
        "id": "itpass-ch02-sec-201",
        "nativeSectionId": "2-01",
        "titleJa": "2-01 ソフトウェア",
        "titleZh": "2-01 软件与OS分类",
        "units": [
          {
            "id": "itpass-2-01",
            "titleJa": "2-01 ソフトウェア",
            "titleZh": "2-01 软件与OS分类",
            "pdfPageStart": 68,
            "pdfPageEnd": 71,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-202",
        "nativeSectionId": "2-02",
        "titleJa": "2-02 ファイル管理",
        "titleZh": "2-02 文件管理与路径",
        "units": [
          {
            "id": "itpass-2-02",
            "titleJa": "2-02 ファイル管理",
            "titleZh": "2-02 文件管理与路径",
            "pdfPageStart": 72,
            "pdfPageEnd": 77,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-203",
        "nativeSectionId": "2-03",
        "titleJa": "2-03 ファイルのバックアップ",
        "titleZh": "2-03 文件备份方式",
        "units": [
          {
            "id": "itpass-2-03",
            "titleJa": "2-03 ファイルのバックアップ",
            "titleZh": "2-03 文件备份方式",
            "pdfPageStart": 78,
            "pdfPageEnd": 81,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-204",
        "nativeSectionId": "2-04",
        "titleJa": "2-04 表計算（相対参照と絶対参照）",
        "titleZh": "2-04 表计算：相对引用与绝对引用",
        "units": [
          {
            "id": "itpass-2-04",
            "titleJa": "2-04 表計算（相対参照と絶対参照）",
            "titleZh": "2-04 表计算：相对引用与绝对引用",
            "pdfPageStart": 82,
            "pdfPageEnd": 89,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-205",
        "nativeSectionId": "2-05",
        "titleJa": "2-05 表計算（関数）",
        "titleZh": "2-05 表计算：基本函数",
        "units": [
          {
            "id": "itpass-2-05",
            "titleJa": "2-05 表計算（関数）",
            "titleZh": "2-05 表计算：基本函数",
            "pdfPageStart": 90,
            "pdfPageEnd": 93,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-206",
        "nativeSectionId": "2-06",
        "titleJa": "2-06 表計算（関数の応用）",
        "titleZh": "2-06 表计算：高级应用函数",
        "units": [
          {
            "id": "itpass-2-06",
            "titleJa": "2-06 表計算（関数の応用）",
            "titleZh": "2-06 表计算：高级应用函数",
            "pdfPageStart": 94,
            "pdfPageEnd": 99,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-207",
        "nativeSectionId": "2-07",
        "titleJa": "2-07 ユーザインタフェース",
        "titleZh": "2-07 用户界面 (UI/UX)",
        "units": [
          {
            "id": "itpass-2-07",
            "titleJa": "2-07 ユーザインタフェース",
            "titleZh": "2-07 用户界面 (UI/UX)",
            "pdfPageStart": 100,
            "pdfPageEnd": 103,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch02-sec-208",
        "nativeSectionId": "2-08",
        "titleJa": "2-08 マルチメディア",
        "titleZh": "2-08 多媒体文件格式",
        "units": [
          {
            "id": "itpass-2-08",
            "titleJa": "2-08 マルチメディア",
            "titleZh": "2-08 多媒体文件格式",
            "pdfPageStart": 104,
            "pdfPageEnd": 107,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch03",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 3,
    "titleJa": "第3章 システム構成［テクノロジ系］",
    "titleZh": "第3章 系统构成",
    "sectionGroups": [
      {
        "id": "itpass-ch03-sec-301",
        "nativeSectionId": "3-01",
        "titleJa": "3-01 コンピュータの形態",
        "titleZh": "3-01 计算机部署形态",
        "units": [
          {
            "id": "itpass-3-01",
            "titleJa": "3-01 コンピュータの形態",
            "titleZh": "3-01 计算机部署形态",
            "pdfPageStart": 110,
            "pdfPageEnd": 115,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch03-sec-302",
        "nativeSectionId": "3-02",
        "titleJa": "3-02 システム構成",
        "titleZh": "3-02 高可用系统配置",
        "units": [
          {
            "id": "itpass-3-02",
            "titleJa": "3-02 システム構成",
            "titleZh": "3-02 高可用系统配置",
            "pdfPageStart": 116,
            "pdfPageEnd": 121,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch03-sec-303",
        "nativeSectionId": "3-03",
        "titleJa": "3-03 システムの信頼性",
        "titleZh": "3-03 系统可靠性计算 (Availability)",
        "units": [
          {
            "id": "itpass-3-03",
            "titleJa": "3-03 システムの信頼性",
            "titleZh": "3-03 系统可靠性计算 (Availability)",
            "pdfPageStart": 122,
            "pdfPageEnd": 127,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch03-sec-304",
        "nativeSectionId": "3-04",
        "titleJa": "3-04 システムの評価",
        "titleZh": "3-04 系统评估指标",
        "units": [
          {
            "id": "itpass-3-04",
            "titleJa": "3-04 システムの評価",
            "titleZh": "3-04 系统评估指标",
            "pdfPageStart": 128,
            "pdfPageEnd": 131,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch03-sec-305",
        "nativeSectionId": "3-05",
        "titleJa": "3-05 IoTシステムと組込みシステム",
        "titleZh": "3-05 IoT与嵌入式系统",
        "units": [
          {
            "id": "itpass-3-05",
            "titleJa": "3-05 IoTシステムと組込みシステム",
            "titleZh": "3-05 IoT与嵌入式系统",
            "pdfPageStart": 132,
            "pdfPageEnd": 137,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch03-sec-306",
        "nativeSectionId": "3-06",
        "titleJa": "3-06 ソリューションビジネスとシステム活用促進",
        "titleZh": "3-06 IT解决方案与业务外包",
        "units": [
          {
            "id": "itpass-3-06",
            "titleJa": "3-06 ソリューションビジネスとシステム活用促進",
            "titleZh": "3-06 IT解决方案与业务外包",
            "pdfPageStart": 138,
            "pdfPageEnd": 141,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch04",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 4,
    "titleJa": "第4章 ネットワーク［テクノロジ系］",
    "titleZh": "第4章 网络",
    "sectionGroups": [
      {
        "id": "itpass-ch04-sec-401",
        "nativeSectionId": "4-01",
        "titleJa": "4-01 ネットワークの構成",
        "titleZh": "4-01 网络物理连接与拓扑",
        "units": [
          {
            "id": "itpass-4-01",
            "titleJa": "4-01 ネットワークの構成",
            "titleZh": "4-01 网络物理连接与拓扑",
            "pdfPageStart": 146,
            "pdfPageEnd": 151,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-402",
        "nativeSectionId": "4-02",
        "titleJa": "4-02 無線LAN",
        "titleZh": "4-02 无线局域网 (Wi-Fi)",
        "units": [
          {
            "id": "itpass-4-02",
            "titleJa": "4-02 無線LAN",
            "titleZh": "4-02 无线局域网 (Wi-Fi)",
            "pdfPageStart": 152,
            "pdfPageEnd": 155,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-403",
        "nativeSectionId": "4-03",
        "titleJa": "4-03 通信プロトコル",
        "titleZh": "4-03 通信协议 (TCP/IP)",
        "units": [
          {
            "id": "itpass-4-03",
            "titleJa": "4-03 通信プロトコル",
            "titleZh": "4-03 通信协议 (TCP/IP)",
            "pdfPageStart": 156,
            "pdfPageEnd": 161,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-404",
        "nativeSectionId": "4-04",
        "titleJa": "4-04 インターネットの仕組み",
        "titleZh": "4-04 互联网寻址与解析 (DNS/IP)",
        "units": [
          {
            "id": "itpass-4-04",
            "titleJa": "4-04 インターネットの仕組み",
            "titleZh": "4-04 互联网寻址与解析 (DNS/IP)",
            "pdfPageStart": 162,
            "pdfPageEnd": 171,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-405",
        "nativeSectionId": "4-05",
        "titleJa": "4-05 通信サービス",
        "titleZh": "4-05 网络通信服务",
        "units": [
          {
            "id": "itpass-4-05",
            "titleJa": "4-05 通信サービス",
            "titleZh": "4-05 网络通信服务",
            "pdfPageStart": 172,
            "pdfPageEnd": 175,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-406",
        "nativeSectionId": "4-06",
        "titleJa": "4-06 Webページ",
        "titleZh": "4-06 网页技术 (HTTP/HTML)",
        "units": [
          {
            "id": "itpass-4-06",
            "titleJa": "4-06 Webページ",
            "titleZh": "4-06 网页技术 (HTTP/HTML)",
            "pdfPageStart": 176,
            "pdfPageEnd": 179,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch04-sec-407",
        "nativeSectionId": "4-07",
        "titleJa": "4-07 電子メール",
        "titleZh": "4-07 电子邮件协议",
        "units": [
          {
            "id": "itpass-4-07",
            "titleJa": "4-07 電子メール",
            "titleZh": "4-07 电子邮件协议",
            "pdfPageStart": 180,
            "pdfPageEnd": 183,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch05",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 5,
    "titleJa": "第5章 セキュリティ［テクノロジ系］",
    "titleZh": "第5章 安全",
    "sectionGroups": [
      {
        "id": "itpass-ch05-sec-501",
        "nativeSectionId": "5-01",
        "titleJa": "5-01 情報資産と脅威",
        "titleZh": "5-01 安全三要素与威胁分类",
        "units": [
          {
            "id": "itpass-5-01",
            "titleJa": "5-01 情報資産と脅威",
            "titleZh": "5-01 安全三要素与威胁分类",
            "pdfPageStart": 186,
            "pdfPageEnd": 193,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-502",
        "nativeSectionId": "5-02",
        "titleJa": "5-02 サイバー攻撃",
        "titleZh": "5-02 典型网络攻击手法",
        "units": [
          {
            "id": "itpass-5-02",
            "titleJa": "5-02 サイバー攻撃",
            "titleZh": "5-02 典型网络攻击手法",
            "pdfPageStart": 194,
            "pdfPageEnd": 201,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-503",
        "nativeSectionId": "5-03",
        "titleJa": "5-03 情報セキュリティマネジメント",
        "titleZh": "5-03 信息安全管理体系 (ISMS)",
        "units": [
          {
            "id": "itpass-5-03",
            "titleJa": "5-03 情報セキュリティマネジメント",
            "titleZh": "5-03 信息安全管理体系 (ISMS)",
            "pdfPageStart": 202,
            "pdfPageEnd": 207,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-504",
        "nativeSectionId": "5-04",
        "titleJa": "5-04 リスクマネジメント",
        "titleZh": "5-04 风险管理与风险对策",
        "units": [
          {
            "id": "itpass-5-04",
            "titleJa": "5-04 リスクマネジメント",
            "titleZh": "5-04 风险管理与风险对策",
            "pdfPageStart": 208,
            "pdfPageEnd": 211,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-505",
        "nativeSectionId": "5-05",
        "titleJa": "5-05 利用者認証",
        "titleZh": "5-05 用户身份验证",
        "units": [
          {
            "id": "itpass-5-05",
            "titleJa": "5-05 利用者認証",
            "titleZh": "5-05 用户身份验证",
            "pdfPageStart": 212,
            "pdfPageEnd": 217,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-506",
        "nativeSectionId": "5-06",
        "titleJa": "5-06 ネットワークセキュリティ",
        "titleZh": "5-06 网络防御技术 (Firewall/DMZ)",
        "units": [
          {
            "id": "itpass-5-06",
            "titleJa": "5-06 ネットワークセキュリティ",
            "titleZh": "5-06 网络防御技术 (Firewall/DMZ)",
            "pdfPageStart": 218,
            "pdfPageEnd": 223,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-507",
        "nativeSectionId": "5-07",
        "titleJa": "5-07 暗号化技術",
        "titleZh": "5-07 密码学与加密体制",
        "units": [
          {
            "id": "itpass-5-07",
            "titleJa": "5-07 暗号化技術",
            "titleZh": "5-07 密码学与加密体制",
            "pdfPageStart": 224,
            "pdfPageEnd": 229,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch05-sec-508",
        "nativeSectionId": "5-08",
        "titleJa": "5-08 デジタル署名と認証局",
        "titleZh": "5-08 数字签名与证书 (Signature/CA)",
        "units": [
          {
            "id": "itpass-5-08",
            "titleJa": "5-08 デジタル署名と認証局",
            "titleZh": "5-08 数字签名与证书 (Signature/CA)",
            "pdfPageStart": 230,
            "pdfPageEnd": 233,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch06",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 6,
    "titleJa": "第6章 データベース［テクノロジ系］",
    "titleZh": "第6章 数据库",
    "sectionGroups": [
      {
        "id": "itpass-ch06-sec-601",
        "nativeSectionId": "6-01",
        "titleJa": "6-01 データベースとデータ操作",
        "titleZh": "6-01 数据库概念与SQL基础",
        "units": [
          {
            "id": "itpass-6-01",
            "titleJa": "6-01 データベースとデータ操作",
            "titleZh": "6-01 数据库概念与SQL基础",
            "pdfPageStart": 240,
            "pdfPageEnd": 247,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch06-sec-602",
        "nativeSectionId": "6-02",
        "titleJa": "6-02 データベース設計",
        "titleZh": "6-02 数据库设计与ER模型 (E-R)",
        "units": [
          {
            "id": "itpass-6-02",
            "titleJa": "6-02 データベース設計",
            "titleZh": "6-02 数据库设计与ER模型 (E-R)",
            "pdfPageStart": 248,
            "pdfPageEnd": 253,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch06-sec-603",
        "nativeSectionId": "6-03",
        "titleJa": "6-03 データの正規化",
        "titleZh": "6-03 数据库规范化 (Normalisation)",
        "units": [
          {
            "id": "itpass-6-03",
            "titleJa": "6-03 データの正規化",
            "titleZh": "6-03 数据库规范化 (Normalisation)",
            "pdfPageStart": 254,
            "pdfPageEnd": 257,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch06-sec-604",
        "nativeSectionId": "6-04",
        "titleJa": "6-04 データの抽出と論理演算",
        "titleZh": "6-04 数据过滤与逻辑运算 (WHERE)",
        "units": [
          {
            "id": "itpass-6-04",
            "titleJa": "6-04 データの抽出と論理演算",
            "titleZh": "6-04 数据过滤与逻辑运算 (WHERE)",
            "pdfPageStart": 258,
            "pdfPageEnd": 263,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch06-sec-605",
        "nativeSectionId": "6-05",
        "titleJa": "6-05 データの整列と集計",
        "titleZh": "6-05 数据排序与分组聚合",
        "units": [
          {
            "id": "itpass-6-05",
            "titleJa": "6-05 データの整列と集計",
            "titleZh": "6-05 数据排序与分组聚合",
            "pdfPageStart": 264,
            "pdfPageEnd": 267,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch06-sec-606",
        "nativeSectionId": "6-06",
        "titleJa": "6-06 トランザクション処理",
        "titleZh": "6-06 事务处理与ACID特性 (ACID)",
        "units": [
          {
            "id": "itpass-6-06",
            "titleJa": "6-06 トランザクション処理",
            "titleZh": "6-06 事务处理与ACID特性 (ACID)",
            "pdfPageStart": 268,
            "pdfPageEnd": 271,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch07",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 7,
    "titleJa": "第7章 アルゴリズムとプログラミング［テクノロジ系］",
    "titleZh": "第7章 算法与编程",
    "sectionGroups": [
      {
        "id": "itpass-ch07-sec-701",
        "nativeSectionId": "7-01",
        "titleJa": "7-01 アルゴリズムとデータ構造",
        "titleZh": "7-01 算法与数据结构",
        "units": [
          {
            "id": "itpass-7-01",
            "titleJa": "7-01 アルゴリズムとデータ構造",
            "titleZh": "7-01 算法与数据结构",
            "pdfPageStart": 276,
            "pdfPageEnd": 285,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch07-sec-702",
        "nativeSectionId": "7-02",
        "titleJa": "7-02 擬似言語",
        "titleZh": "7-02 伪代码逻辑分析",
        "units": [
          {
            "id": "itpass-7-02",
            "titleJa": "7-02 擬似言語",
            "titleZh": "7-02 伪代码逻辑分析",
            "pdfPageStart": 286,
            "pdfPageEnd": 299,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch07-sec-703",
        "nativeSectionId": "7-03",
        "titleJa": "7-03 プログラム言語とマークアップ言語",
        "titleZh": "7-03 编程语言与标记语言 (HTML/XML)",
        "units": [
          {
            "id": "itpass-7-03",
            "titleJa": "7-03 プログラム言語とマークアップ言語",
            "titleZh": "7-03 编程语言与标记语言 (HTML/XML)",
            "pdfPageStart": 300,
            "pdfPageEnd": 303,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch08",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 8,
    "titleJa": "第8章 マネジメント［マネジメント系］",
    "titleZh": "第8章 管理",
    "sectionGroups": [
      {
        "id": "itpass-ch08-sec-801",
        "nativeSectionId": "8-01",
        "titleJa": "8-01 企画・要件定義プロセス",
        "titleZh": "8-01 系统规划与需求定义 (RFP)",
        "units": [
          {
            "id": "itpass-8-01",
            "titleJa": "8-01 企画・要件定義プロセス",
            "titleZh": "8-01 系统规划与需求定义 (RFP)",
            "pdfPageStart": 306,
            "pdfPageEnd": 311,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-802",
        "nativeSectionId": "8-02",
        "titleJa": "8-02 開発プロセス",
        "titleZh": "8-02 系统开发流程与测试",
        "units": [
          {
            "id": "itpass-8-02",
            "titleJa": "8-02 開発プロセス",
            "titleZh": "8-02 系统开发流程与测试",
            "pdfPageStart": 312,
            "pdfPageEnd": 315,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-803",
        "nativeSectionId": "8-03",
        "titleJa": "8-03 テスト手法と運用・保守プロセス",
        "titleZh": "8-03 测试手法与后期运维",
        "units": [
          {
            "id": "itpass-8-03",
            "titleJa": "8-03 テスト手法と運用・保守プロセス",
            "titleZh": "8-03 测试手法与后期运维",
            "pdfPageStart": 316,
            "pdfPageEnd": 321,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-804",
        "nativeSectionId": "8-04",
        "titleJa": "8-04 ソフトウェア開発手法",
        "titleZh": "8-04 软件开发模式 (Agile/Waterfall)",
        "units": [
          {
            "id": "itpass-8-04",
            "titleJa": "8-04 ソフトウェア開発手法",
            "titleZh": "8-04 软件开发模式 (Agile/Waterfall)",
            "pdfPageStart": 322,
            "pdfPageEnd": 329,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-805",
        "nativeSectionId": "8-05",
        "titleJa": "8-05 プロジェクトマネジメント",
        "titleZh": "8-05 项目管理与WBS (WBS)",
        "units": [
          {
            "id": "itpass-8-05",
            "titleJa": "8-05 プロジェクトマネジメント",
            "titleZh": "8-05 项目管理与WBS (WBS)",
            "pdfPageStart": 330,
            "pdfPageEnd": 337,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-806",
        "nativeSectionId": "8-06",
        "titleJa": "8-06 タイムマネジメント",
        "titleZh": "8-06 工期进度管理 (Critical Path)",
        "units": [
          {
            "id": "itpass-8-06",
            "titleJa": "8-06 タイムマネジメント",
            "titleZh": "8-06 工期进度管理 (Critical Path)",
            "pdfPageStart": 338,
            "pdfPageEnd": 347,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-807",
        "nativeSectionId": "8-07",
        "titleJa": "8-07 ITサービスマネジメント",
        "titleZh": "8-07 IT服务管理与SLA (SLA)",
        "units": [
          {
            "id": "itpass-8-07",
            "titleJa": "8-07 ITサービスマネジメント",
            "titleZh": "8-07 IT服务管理与SLA (SLA)",
            "pdfPageStart": 348,
            "pdfPageEnd": 355,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch08-sec-808",
        "nativeSectionId": "8-08",
        "titleJa": "8-08 システム監査",
        "titleZh": "8-08 系统审计 (System Audit)",
        "units": [
          {
            "id": "itpass-8-08",
            "titleJa": "8-08 システム監査",
            "titleZh": "8-08 系统审计 (System Audit)",
            "pdfPageStart": 356,
            "pdfPageEnd": 359,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch09",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 9,
    "titleJa": "第9章 企業活動と法務［ストラテジ系］",
    "titleZh": "第9章 企业活动与法务",
    "sectionGroups": [
      {
        "id": "itpass-ch09-sec-901",
        "nativeSectionId": "9-01",
        "titleJa": "9-01 財務諸表",
        "titleZh": "9-01 企业财务报表 (B/S & P/L)",
        "units": [
          {
            "id": "itpass-9-01",
            "titleJa": "9-01 財務諸表",
            "titleZh": "9-01 企业财务报表 (B/S & P/L)",
            "pdfPageStart": 362,
            "pdfPageEnd": 371,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-902",
        "nativeSectionId": "9-02",
        "titleJa": "9-02 損益分岐点と資産管理",
        "titleZh": "9-02 盈亏平衡点与折旧计算",
        "units": [
          {
            "id": "itpass-9-02",
            "titleJa": "9-02 損益分岐点と資産管理",
            "titleZh": "9-02 盈亏平衡点与折旧计算",
            "pdfPageStart": 372,
            "pdfPageEnd": 381,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-903",
        "nativeSectionId": "9-03",
        "titleJa": "9-03 知的財産権",
        "titleZh": "9-03 知识产权与著作权",
        "units": [
          {
            "id": "itpass-9-03",
            "titleJa": "9-03 知的財産権",
            "titleZh": "9-03 知识产权与著作权",
            "pdfPageStart": 382,
            "pdfPageEnd": 389,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-904",
        "nativeSectionId": "9-04",
        "titleJa": "9-04 セキュリティ関連・個人情報関連法規",
        "titleZh": "9-04 隐私保护与安全法规",
        "units": [
          {
            "id": "itpass-9-04",
            "titleJa": "9-04 セキュリティ関連・個人情報関連法規",
            "titleZh": "9-04 隐私保护与安全法规",
            "pdfPageStart": 390,
            "pdfPageEnd": 395,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-905",
        "nativeSectionId": "9-05",
        "titleJa": "9-05 労働関連・取引関連法規",
        "titleZh": "9-05 劳务派遣与外包合同法",
        "units": [
          {
            "id": "itpass-9-05",
            "titleJa": "9-05 労働関連・取引関連法規",
            "titleZh": "9-05 劳务派遣与外包合同法",
            "pdfPageStart": 396,
            "pdfPageEnd": 401,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-906",
        "nativeSectionId": "9-06",
        "titleJa": "9-06 業務分析",
        "titleZh": "9-06 业务分析与质量工具 (SWOT/3C)",
        "units": [
          {
            "id": "itpass-9-06",
            "titleJa": "9-06 業務分析",
            "titleZh": "9-06 业务分析与质量工具 (SWOT/3C)",
            "pdfPageStart": 402,
            "pdfPageEnd": 407,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-907",
        "nativeSectionId": "9-07",
        "titleJa": "9-07 データ利活用と問題解決",
        "titleZh": "9-07 数据挖掘与分析方法",
        "units": [
          {
            "id": "itpass-9-07",
            "titleJa": "9-07 データ利活用と問題解決",
            "titleZh": "9-07 数据挖掘与分析方法",
            "pdfPageStart": 408,
            "pdfPageEnd": 413,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch09-sec-908",
        "nativeSectionId": "9-08",
        "titleJa": "9-08 標準化",
        "titleZh": "9-08 行业标准与条码规范",
        "units": [
          {
            "id": "itpass-9-08",
            "titleJa": "9-08 標準化",
            "titleZh": "9-08 行业标准与条码规范",
            "pdfPageStart": 414,
            "pdfPageEnd": 417,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "itpass-ch10",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 10,
    "titleJa": "第10章 経営戦略とシステム戦略［ストラテジ系］",
    "titleZh": "第10章 经营战略与系统战略",
    "sectionGroups": [
      {
        "id": "itpass-ch10-sec-1001",
        "nativeSectionId": "10-01",
        "titleJa": "10-01 第4次産業革命とビッグデータ",
        "titleZh": "10-01 第四次工业革命与大数字",
        "units": [
          {
            "id": "itpass-10-01",
            "titleJa": "10-01 第4次産業革命とビッグデータ",
            "titleZh": "10-01 第四次工业革命与大数字",
            "pdfPageStart": 418,
            "pdfPageEnd": 423,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1002",
        "nativeSectionId": "10-02",
        "titleJa": "10-02 企業活動",
        "titleZh": "10-02 企业的社会责任 (CSR/SDGs)",
        "units": [
          {
            "id": "itpass-10-02",
            "titleJa": "10-02 企業活動",
            "titleZh": "10-02 企业的社会责任 (CSR/SDGs)",
            "pdfPageStart": 424,
            "pdfPageEnd": 429,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1003",
        "nativeSectionId": "10-03",
        "titleJa": "10-03 企業統治と内部統制",
        "titleZh": "10-03 公司治理与合规 (Governance)",
        "units": [
          {
            "id": "itpass-10-03",
            "titleJa": "10-03 企業統治と内部統制",
            "titleZh": "10-03 公司治理与合规 (Governance)",
            "pdfPageStart": 430,
            "pdfPageEnd": 433,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1004",
        "nativeSectionId": "10-04",
        "titleJa": "10-04 経営戦略",
        "titleZh": "10-04 企业经营战略 (M&A/OEM)",
        "units": [
          {
            "id": "itpass-10-04",
            "titleJa": "10-04 経営戦略",
            "titleZh": "10-04 企业经营战略 (M&A/OEM)",
            "pdfPageStart": 434,
            "pdfPageEnd": 443,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1005",
        "nativeSectionId": "10-05",
        "titleJa": "10-05 情報システム戦略と業務プロセス",
        "titleZh": "10-05 系统战略与流程重塑 (BPR)",
        "units": [
          {
            "id": "itpass-10-05",
            "titleJa": "10-05 情報システム戦略と業務プロセス",
            "titleZh": "10-05 系统战略与流程重塑 (BPR)",
            "pdfPageStart": 444,
            "pdfPageEnd": 451,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1006",
        "nativeSectionId": "10-06",
        "titleJa": "10-06 マーケティング戦略",
        "titleZh": "10-06 营销战略与客户运营 (4P/STP)",
        "units": [
          {
            "id": "itpass-10-06",
            "titleJa": "10-06 マーケティング戦略",
            "titleZh": "10-06 营销战略与客户运营 (4P/STP)",
            "pdfPageStart": 452,
            "pdfPageEnd": 459,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1007",
        "nativeSectionId": "10-07",
        "titleJa": "10-07 技術戦略",
        "titleZh": "10-07 技术战略与创新研发 (MOT)",
        "units": [
          {
            "id": "itpass-10-07",
            "titleJa": "10-07 技術戦略",
            "titleZh": "10-07 技术战略与创新研发 (MOT)",
            "pdfPageStart": 460,
            "pdfPageEnd": 465,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1008",
        "nativeSectionId": "10-08",
        "titleJa": "10-08 業績評価と経営管理システム",
        "titleZh": "10-08 业绩评价与资源系统 (BSC/ERP)",
        "units": [
          {
            "id": "itpass-10-08",
            "titleJa": "10-08 業績評価と経営管理システム",
            "titleZh": "10-08 业绩评价与资源系统 (BSC/ERP)",
            "pdfPageStart": 466,
            "pdfPageEnd": 471,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1009",
        "nativeSectionId": "10-09",
        "titleJa": "10-09 ビジネスシステムとエンジニアリング",
        "titleZh": "10-09 智能制造与并行工程",
        "units": [
          {
            "id": "itpass-10-09",
            "titleJa": "10-09 ビジネスシステムとエンジニアリング",
            "titleZh": "10-09 智能制造与并行工程",
            "pdfPageStart": 472,
            "pdfPageEnd": 477,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "itpass-ch10-sec-1010",
        "nativeSectionId": "10-10",
        "titleJa": "10-10 e-ビジネス",
        "titleZh": "10-10 电子商务与智能合约",
        "units": [
          {
            "id": "itpass-10-10",
            "titleJa": "10-10 e-ビジネス",
            "titleZh": "10-10 电子商务与智能合约",
            "pdfPageStart": 478,
            "pdfPageEnd": 481,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch01",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 1,
    "titleJa": "第1章 情報セキュリティとは",
    "titleZh": "第1章 什么是信息安全",
    "sectionGroups": [
      {
        "id": "sg-ch01-sec-11",
        "nativeSectionId": "1-1",
        "titleJa": "1-1 事例！ 情報セキュリティ",
        "titleZh": "事例！ 信息安全",
        "units": [
          {
            "id": "sg-1-1-1",
            "titleJa": "1-1-1 情報セキュリティとは",
            "titleZh": "1-1-1 什么是信息安全",
            "pdfPageStart": 36,
            "pdfPageEnd": 37,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-1-1-2",
            "titleJa": "1-1-2 【事例1】マルウェア感染",
            "titleZh": "1-1-2 案例一：恶意软件感染与威胁",
            "pdfPageStart": 38,
            "pdfPageEnd": 42,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-1-1-3",
            "titleJa": "1-1-3 【事例2】ランサムウェアとバックアップ",
            "titleZh": "1-1-3 案例二：勒索软件与网络隔离备份",
            "pdfPageStart": 43,
            "pdfPageEnd": 46,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch01-sec-12",
        "nativeSectionId": "1-2",
        "titleJa": "1-2 情報セキュリティの基本",
        "titleZh": "信息安全的基本",
        "units": [
          {
            "id": "sg-1-2-1",
            "titleJa": "1-2-1 情報セキュリティの目的と考え方",
            "titleZh": "1-2-1 信息安全的根本目的与思考方式",
            "pdfPageStart": 47,
            "pdfPageEnd": 50,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-1-2-2",
            "titleJa": "1-2-2 情報セキュリティの基本",
            "titleZh": "1-2-2 信息安全三要素 (CIA) 与衍生要素",
            "pdfPageStart": 51,
            "pdfPageEnd": 52,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-1-2-3",
            "titleJa": "1-2-3 脅威の種類",
            "titleZh": "1-2-3 安全威胁的分类 (人为/物理/技术)",
            "pdfPageStart": 53,
            "pdfPageEnd": 54,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-1-2-4",
            "titleJa": "1-2-4 マルウェア・不正プログラム",
            "titleZh": "恶意软件、不正プログラム",
            "pdfPageStart": 55,
            "pdfPageEnd": 57,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-1-2-5",
            "titleJa": "1-2-5 不正と攻撃のメカニズム",
            "titleZh": "不正与攻撃的メカニズム",
            "pdfPageStart": 58,
            "pdfPageEnd": 61,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-1-2-6",
            "titleJa": "1-2-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 62,
            "pdfPageEnd": 65,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch02",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 2,
    "titleJa": "第2章 情報セキュリティ技術",
    "titleZh": "第2章 信息安全技术",
    "sectionGroups": [
      {
        "id": "sg-ch02-sec-21",
        "nativeSectionId": "2-1",
        "titleJa": "2-1 サイバー攻撃手法",
        "titleZh": "网络攻击手法",
        "units": [
          {
            "id": "sg-2-1-1",
            "titleJa": "2-1-1 パスワードに関する攻撃",
            "titleZh": "2-1-1 针对密码的典型破解攻击 (暴力/字典/列表)",
            "pdfPageStart": 70,
            "pdfPageEnd": 71,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-1-2",
            "titleJa": "2-1-2 Webサイトに関する攻撃",
            "titleZh": "2-1-2 针对网站应用的攻击漏洞 (SQL注入/XSS/命令行注入)",
            "pdfPageStart": 72,
            "pdfPageEnd": 75,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-1-3",
            "titleJa": "2-1-3 通信に関する攻撃",
            "titleZh": "2-1-3 针对网络通信的攻击方式 (窃听/DoS/DDoS/中间人)",
            "pdfPageStart": 76,
            "pdfPageEnd": 79,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-1-4",
            "titleJa": "2-1-4 標的型攻撃・その他",
            "titleZh": "標的型攻撃、そ的他",
            "pdfPageStart": 80,
            "pdfPageEnd": 84,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-2-1-5",
            "titleJa": "2-1-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 85,
            "pdfPageEnd": 93,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch02-sec-22",
        "nativeSectionId": "2-2",
        "titleJa": "2-2 情報セキュリティ技術",
        "titleZh": "信息安全技术",
        "units": [
          {
            "id": "sg-2-2-1",
            "titleJa": "2-2-1 暗号化技術",
            "titleZh": "2-2-1 加密技术详解 (对称加密 AES 与非对称加密 RSA)",
            "pdfPageStart": 94,
            "pdfPageEnd": 103,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-2-2",
            "titleJa": "2-2-2 認証技術",
            "titleZh": "2-2-2 身份认证技术与数字签名 (改动检测与抗抵赖)",
            "pdfPageStart": 104,
            "pdfPageEnd": 109,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-2-3",
            "titleJa": "2-2-3 利用者認証・生体認証",
            "titleZh": "2-2-3 多要素认证与生物识别技术 (指纹/虹膜/静脉)",
            "pdfPageStart": 110,
            "pdfPageEnd": 116,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-2-4",
            "titleJa": "2-2-4 公開鍵基盤",
            "titleZh": "2-2-4 公钥基础设施 (PKI) 与数字证书机构 (CA)",
            "pdfPageStart": 117,
            "pdfPageEnd": 121,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-2-2-5",
            "titleJa": "2-2-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 122,
            "pdfPageEnd": 125,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch03",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 3,
    "titleJa": "第3章 情報セキュリティ管理",
    "titleZh": "第3章 信息安全管理",
    "sectionGroups": [
      {
        "id": "sg-ch03-sec-31",
        "nativeSectionId": "3-1",
        "titleJa": "3-1 情報セキュリティマネジメント",
        "titleZh": "信息安全管理",
        "units": [
          {
            "id": "sg-3-1-1",
            "titleJa": "3-1-1 情報セキュリティ管理",
            "titleZh": "3-1-1 信息安全方针金字塔与规章制度",
            "pdfPageStart": 134,
            "pdfPageEnd": 137,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-1-2",
            "titleJa": "3-1-2 情報セキュリティ諸規程",
            "titleZh": "3-1-2 各层级安全管理规定的核心要求",
            "pdfPageStart": 138,
            "pdfPageEnd": 139,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-1-3",
            "titleJa": "3-1-3 情報セキュリティマネジメントシステム",
            "titleZh": "3-1-3 信息安全管理体系 (ISMS) 与 PDCA 循环改善",
            "pdfPageStart": 140,
            "pdfPageEnd": 146,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-1-4",
            "titleJa": "3-1-4 情報セキュリティ継続",
            "titleZh": "信息安全継続",
            "pdfPageStart": 147,
            "pdfPageEnd": 148,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-3-1-5",
            "titleJa": "3-1-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 149,
            "pdfPageEnd": 154,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch03-sec-32",
        "nativeSectionId": "3-2",
        "titleJa": "3-2 リスク分析と評価",
        "titleZh": "风险分析与评价",
        "units": [
          {
            "id": "sg-3-2-1",
            "titleJa": "3-2-1 情報資産の調査・分類",
            "titleZh": "3-2-1 组织资产盘点、等级划分与价值评估",
            "pdfPageStart": 155,
            "pdfPageEnd": 155,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-2-2",
            "titleJa": "3-2-2 リスクの種類",
            "titleZh": "3-2-2 风险值估算 (威胁度 × 脆弱性 × 资产价值)",
            "pdfPageStart": 156,
            "pdfPageEnd": 157,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-2-3",
            "titleJa": "3-2-3 情報セキュリティリスクアセスメント",
            "titleZh": "3-2-3 信息安全风险评估的完整阶段 (识别/分析/评价)",
            "pdfPageStart": 158,
            "pdfPageEnd": 160,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-2-4",
            "titleJa": "3-2-4 情報セキュリティリスク対応",
            "titleZh": "信息安全风险対応",
            "pdfPageStart": 161,
            "pdfPageEnd": 163,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-3-2-5",
            "titleJa": "3-2-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 164,
            "pdfPageEnd": 169,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch03-sec-33",
        "nativeSectionId": "3-3",
        "titleJa": "3-3 情報セキュリティに対する取組み",
        "titleZh": "信息安全に対する取組み",
        "units": [
          {
            "id": "sg-3-3-1",
            "titleJa": "3-3-1 情報セキュリティ組織・機関",
            "titleZh": "3-3-1 安全事件应急协调机构与团队 (CSIRT/SOC/JPCERT)",
            "pdfPageStart": 170,
            "pdfPageEnd": 177,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-3-2",
            "titleJa": "3-3-2 セキュリティ評価",
            "titleZh": "3-3-2 信息技术安全评估通用国际标准 (ISO 15408 CC)",
            "pdfPageStart": 178,
            "pdfPageEnd": 184,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-3-3-3",
            "titleJa": "3-3-3 演習問題",
            "titleZh": "3-3-3 课后本章历年真题演练",
            "pdfPageStart": 185,
            "pdfPageEnd": 188,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch04",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 4,
    "titleJa": "第4章 情報セキュリティ対策",
    "titleZh": "第4章 信息安全对策",
    "sectionGroups": [
      {
        "id": "sg-ch04-sec-41",
        "nativeSectionId": "4-1",
        "titleJa": "4-1 人的セキュリティ対策",
        "titleZh": "人的安全对策",
        "units": [
          {
            "id": "sg-4-1-1",
            "titleJa": "4-1-1 人的セキュリティ対策",
            "titleZh": "4-1-1 人的安全对策与防范社会工程学欺骗",
            "pdfPageStart": 192,
            "pdfPageEnd": 197,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-1-2",
            "titleJa": "4-1-2 演習問題",
            "titleZh": "4-1-2 课后本章历年真题演练",
            "pdfPageStart": 198,
            "pdfPageEnd": 203,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch04-sec-42",
        "nativeSectionId": "4-2",
        "titleJa": "4-2 技術的セキュリティ対策",
        "titleZh": "技术的安全对策",
        "units": [
          {
            "id": "sg-4-2-1",
            "titleJa": "4-2-1 クラッキング・不正アクセス対策",
            "titleZh": "4-2-1 边界防御技术 (防火墙分组过滤机制与DMZ非武装区)",
            "pdfPageStart": 204,
            "pdfPageEnd": 208,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-2-2",
            "titleJa": "4-2-2 マルウェア・不正プログラム対策",
            "titleZh": "4-2-2 恶意软件防范技术与沙箱隔离监测 (Sandbox)",
            "pdfPageStart": 209,
            "pdfPageEnd": 212,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-2-3",
            "titleJa": "4-2-3 携帯端末・無線LANのセキュリティ対策",
            "titleZh": "4-2-3 移动终端与无线局域网安全加密协议 (WPA3)",
            "pdfPageStart": 213,
            "pdfPageEnd": 216,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-2-4",
            "titleJa": "4-2-4 デジタルフォレンジックス・証拠保全対策",
            "titleZh": "4-2-4 计算机司法取证与事故数字取证保全机制 (Forensics)",
            "pdfPageStart": 217,
            "pdfPageEnd": 218,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-2-5",
            "titleJa": "4-2-5 その他の技術的セキュリティ対策",
            "titleZh": "そ的他的技术的安全对策",
            "pdfPageStart": 219,
            "pdfPageEnd": 224,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-4-2-6",
            "titleJa": "4-2-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 225,
            "pdfPageEnd": 234,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch04-sec-43",
        "nativeSectionId": "4-3",
        "titleJa": "4-3 物理的セキュリティ対策",
        "titleZh": "物理的安全对策",
        "units": [
          {
            "id": "sg-4-3-1",
            "titleJa": "4-3-1 物理的セキュリティ対策",
            "titleZh": "4-3-1 机房入退室门禁管理与防尾随互锁安全门",
            "pdfPageStart": 235,
            "pdfPageEnd": 239,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-3-2",
            "titleJa": "4-3-2 演習問題",
            "titleZh": "4-3-2 课后本章历年真题演练",
            "pdfPageStart": 240,
            "pdfPageEnd": 243,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch04-sec-44",
        "nativeSectionId": "4-4",
        "titleJa": "4-4 セキュリティ実装技術",
        "titleZh": "安全実装技术",
        "units": [
          {
            "id": "sg-4-4-1",
            "titleJa": "4-4-1 セキュアプロトコル",
            "titleZh": "4-4-1 安全传输协议详解 (SSL/TLS, HTTPS, SSH, IPsec)",
            "pdfPageStart": 244,
            "pdfPageEnd": 245,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-4-4-2",
            "titleJa": "4-4-2 認証技術",
            "titleZh": "认证技术",
            "pdfPageStart": 246,
            "pdfPageEnd": 247,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-4-4-3",
            "titleJa": "4-4-3 ネットワークセキュリティ",
            "titleZh": "网络安全",
            "pdfPageStart": 248,
            "pdfPageEnd": 251,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-4-4-4",
            "titleJa": "4-4-4 データベースセキュリティ",
            "titleZh": "数据库安全",
            "pdfPageStart": 252,
            "pdfPageEnd": 253,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-4-4-5",
            "titleJa": "4-4-5 アプリケーションセキュリティ",
            "titleZh": "アプリケーション安全",
            "pdfPageStart": 254,
            "pdfPageEnd": 255,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-4-4-6",
            "titleJa": "4-4-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 256,
            "pdfPageEnd": 259,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch05",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 5,
    "titleJa": "第5章 法務",
    "titleZh": "第5章 法务",
    "sectionGroups": [
      {
        "id": "sg-ch05-sec-51",
        "nativeSectionId": "5-1",
        "titleJa": "5-1 情報セキュリティ関連法規",
        "titleZh": "信息安全関連法规",
        "units": [
          {
            "id": "sg-5-1-1",
            "titleJa": "5-1-1 サイバーセキュリティ基本法",
            "titleZh": "5-1-1 日本网络安全基本法基本框架",
            "pdfPageStart": 264,
            "pdfPageEnd": 265,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-5-1-2",
            "titleJa": "5-1-2 不正アクセス禁止法",
            "titleZh": "禁止非法访问法",
            "pdfPageStart": 266,
            "pdfPageEnd": 267,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-1-3",
            "titleJa": "5-1-3 個人情報保護法",
            "titleZh": "个人信息保护法",
            "pdfPageStart": 268,
            "pdfPageEnd": 272,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-1-4",
            "titleJa": "5-1-4 刑法",
            "titleZh": "刑法",
            "pdfPageStart": 273,
            "pdfPageEnd": 274,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-1-5",
            "titleJa": "5-1-5 その他のセキュリティ関連法規・基準",
            "titleZh": "そ的他的安全関連法规、基準",
            "pdfPageStart": 275,
            "pdfPageEnd": 278,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-1-6",
            "titleJa": "5-1-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 279,
            "pdfPageEnd": 286,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch05-sec-52",
        "nativeSectionId": "5-2",
        "titleJa": "5-2 その他の法規・標準",
        "titleZh": "そ的他的法规、標準",
        "units": [
          {
            "id": "sg-5-2-1",
            "titleJa": "5-2-1 知的財産権",
            "titleZh": "5-2-1 知识产权分类保护 (专利权/著作权/商标权)",
            "pdfPageStart": 287,
            "pdfPageEnd": 289,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-5-2-2",
            "titleJa": "5-2-2 労働関連・取引関連法規",
            "titleZh": "労働関連、取引関連法规",
            "pdfPageStart": 290,
            "pdfPageEnd": 293,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-2-3",
            "titleJa": "5-2-3 その他の法律・ガイドライン・技術者倫理",
            "titleZh": "そ的他的法律、ガイドライン、技术者倫理",
            "pdfPageStart": 294,
            "pdfPageEnd": 296,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-2-4",
            "titleJa": "5-2-4 標準化関連",
            "titleZh": "标准化関連",
            "pdfPageStart": 297,
            "pdfPageEnd": 298,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-5-2-5",
            "titleJa": "5-2-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 299,
            "pdfPageEnd": 302,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch06",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 6,
    "titleJa": "第6章 マネジメント",
    "titleZh": "第6章 管理",
    "sectionGroups": [
      {
        "id": "sg-ch06-sec-61",
        "nativeSectionId": "6-1",
        "titleJa": "6-1 システム監査",
        "titleZh": "系统审计",
        "units": [
          {
            "id": "sg-6-1-1",
            "titleJa": "6-1-1 システム監査",
            "titleZh": "6-1-1 系统审计的目的、审计流程与第三方评估原则",
            "pdfPageStart": 308,
            "pdfPageEnd": 315,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-6-1-2",
            "titleJa": "6-1-2 内部統制",
            "titleZh": "内部控制",
            "pdfPageStart": 316,
            "pdfPageEnd": 318,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-1-3",
            "titleJa": "6-1-3 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 319,
            "pdfPageEnd": 328,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch06-sec-62",
        "nativeSectionId": "6-2",
        "titleJa": "6-2 サービスマネジメント",
        "titleZh": "服务管理",
        "units": [
          {
            "id": "sg-6-2-1",
            "titleJa": "6-2-1 サービスマネジメント",
            "titleZh": "6-2-1 IT 服务管理的金科玉律 (ITIL框架与SLA协议指标)",
            "pdfPageStart": 329,
            "pdfPageEnd": 332,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-6-2-2",
            "titleJa": "6-2-2 サービスマネジメントシステムの計画及び運用",
            "titleZh": "服务管理系统的計画及び運用",
            "pdfPageStart": 333,
            "pdfPageEnd": 339,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-2-3",
            "titleJa": "6-2-3 パフォーマンス評価及び改善",
            "titleZh": "パフォーマンス评价及び改善",
            "pdfPageStart": 340,
            "pdfPageEnd": 341,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-2-4",
            "titleJa": "6-2-4 サービスの運用",
            "titleZh": "服务的運用",
            "pdfPageStart": 342,
            "pdfPageEnd": 344,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-2-5",
            "titleJa": "6-2-5 ファシリティマネジメント",
            "titleZh": "ファシリティ管理",
            "pdfPageStart": 345,
            "pdfPageEnd": 345,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-2-6",
            "titleJa": "6-2-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 346,
            "pdfPageEnd": 352,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch06-sec-63",
        "nativeSectionId": "6-3",
        "titleJa": "6-3 プロジェクトマネジメント",
        "titleZh": "项目管理",
        "units": [
          {
            "id": "sg-6-3-1",
            "titleJa": "6-3-1 プロジェクトマネジメント",
            "titleZh": "6-3-1 项目管理核心：PMBOK 九大知识领域概述",
            "pdfPageStart": 353,
            "pdfPageEnd": 356,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-6-3-2",
            "titleJa": "6-3-2 プロジェクトの統合",
            "titleZh": "项目的統合",
            "pdfPageStart": 357,
            "pdfPageEnd": 357,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-3",
            "titleJa": "6-3-3 プロジェクトのステークホルダ",
            "titleZh": "项目的ステークホルダ",
            "pdfPageStart": 358,
            "pdfPageEnd": 358,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-4",
            "titleJa": "6-3-4 プロジェクトのスコープ",
            "titleZh": "项目的スコープ",
            "pdfPageStart": 359,
            "pdfPageEnd": 360,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-5",
            "titleJa": "6-3-5 プロジェクトの資源",
            "titleZh": "项目的資源",
            "pdfPageStart": 361,
            "pdfPageEnd": 361,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-6",
            "titleJa": "6-3-6 プロジェクトの時間",
            "titleZh": "项目的時間",
            "pdfPageStart": 362,
            "pdfPageEnd": 364,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-7",
            "titleJa": "6-3-7 プロジェクトのコスト",
            "titleZh": "项目的コスト",
            "pdfPageStart": 365,
            "pdfPageEnd": 366,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-8",
            "titleJa": "6-3-8 プロジェクトのリスク",
            "titleZh": "项目的风险",
            "pdfPageStart": 367,
            "pdfPageEnd": 368,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-9",
            "titleJa": "6-3-9 プロジェクトの品質",
            "titleZh": "项目的品質",
            "pdfPageStart": 369,
            "pdfPageEnd": 370,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-10",
            "titleJa": "6-3-10 プロジェクトの調達",
            "titleZh": "项目的調達",
            "pdfPageStart": 371,
            "pdfPageEnd": 371,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-11",
            "titleJa": "6-3-11 プロジェクトのコミュニケーション",
            "titleZh": "项目的コミュニケーション",
            "pdfPageStart": 372,
            "pdfPageEnd": 372,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-6-3-12",
            "titleJa": "6-3-12 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 373,
            "pdfPageEnd": 376,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch07",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 7,
    "titleJa": "第7章 テクノロジ",
    "titleZh": "第7章 技术",
    "sectionGroups": [
      {
        "id": "sg-ch07-sec-71",
        "nativeSectionId": "7-1",
        "titleJa": "7-1 システム構成要素",
        "titleZh": "系统构成要素",
        "units": [
          {
            "id": "sg-7-1-1",
            "titleJa": "7-1-1 システムの構成",
            "titleZh": "7-1-1 典型计算机构成与多CPU并行系统",
            "pdfPageStart": 380,
            "pdfPageEnd": 388,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-7-1-2",
            "titleJa": "7-1-2 システムの評価指標",
            "titleZh": "系统的评价指標",
            "pdfPageStart": 389,
            "pdfPageEnd": 391,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-1-3",
            "titleJa": "7-1-3 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 392,
            "pdfPageEnd": 396,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch07-sec-72",
        "nativeSectionId": "7-2",
        "titleJa": "7-2 データベース",
        "titleZh": "数据库",
        "units": [
          {
            "id": "sg-7-2-1",
            "titleJa": "7-2-1 データベース方式",
            "titleZh": "7-2-1 数据库模式设计 (外模式/概念模式/内模式)",
            "pdfPageStart": 397,
            "pdfPageEnd": 398,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-7-2-2",
            "titleJa": "7-2-2 データベース設計",
            "titleZh": "数据库設計",
            "pdfPageStart": 399,
            "pdfPageEnd": 400,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-2-3",
            "titleJa": "7-2-3 データ操作",
            "titleZh": "数据操作",
            "pdfPageStart": 401,
            "pdfPageEnd": 403,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-2-4",
            "titleJa": "7-2-4 トランザクション処理",
            "titleZh": "トランザクション処理",
            "pdfPageStart": 404,
            "pdfPageEnd": 408,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-2-5",
            "titleJa": "7-2-5 データベース応用",
            "titleZh": "数据库応用",
            "pdfPageStart": 409,
            "pdfPageEnd": 410,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-2-6",
            "titleJa": "7-2-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 411,
            "pdfPageEnd": 414,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch07-sec-73",
        "nativeSectionId": "7-3",
        "titleJa": "7-3 ネットワーク",
        "titleZh": "网络",
        "units": [
          {
            "id": "sg-7-3-1",
            "titleJa": "7-3-1 ネットワーク方式",
            "titleZh": "7-3-1 计算机网络拓扑与硬件设备 (网卡/路由器/交换机)",
            "pdfPageStart": 415,
            "pdfPageEnd": 416,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-7-3-2",
            "titleJa": "7-3-2 データ通信と制御",
            "titleZh": "数据通信与制御",
            "pdfPageStart": 417,
            "pdfPageEnd": 421,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-3-3",
            "titleJa": "7-3-3 通信プロトコル",
            "titleZh": "通信プロトコル",
            "pdfPageStart": 422,
            "pdfPageEnd": 428,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-3-4",
            "titleJa": "7-3-4 ネットワーク管理",
            "titleZh": "网络管理",
            "pdfPageStart": 429,
            "pdfPageEnd": 429,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-3-5",
            "titleJa": "7-3-5 ネットワーク応用",
            "titleZh": "网络応用",
            "pdfPageStart": 430,
            "pdfPageEnd": 434,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-7-3-6",
            "titleJa": "7-3-6 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 435,
            "pdfPageEnd": 438,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch08",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 8,
    "titleJa": "第8章 ストラテジ",
    "titleZh": "第8章 战略",
    "sectionGroups": [
      {
        "id": "sg-ch08-sec-81",
        "nativeSectionId": "8-1",
        "titleJa": "8-1 企業活動",
        "titleZh": "企業活動",
        "units": [
          {
            "id": "sg-8-1-1",
            "titleJa": "8-1-1 経営・組織論",
            "titleZh": "8-1-1 现代企业管理结构与经营分析手法 (SWOT/3C)",
            "pdfPageStart": 440,
            "pdfPageEnd": 444,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-8-1-2",
            "titleJa": "8-1-2 業務分析・データ利活用",
            "titleZh": "業務分析、数据利活用",
            "pdfPageStart": 445,
            "pdfPageEnd": 449,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-1-3",
            "titleJa": "8-1-3 会計・財務",
            "titleZh": "会計、財務",
            "pdfPageStart": 450,
            "pdfPageEnd": 452,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-1-4",
            "titleJa": "8-1-4 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 453,
            "pdfPageEnd": 458,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch08-sec-82",
        "nativeSectionId": "8-2",
        "titleJa": "8-2 システム戦略",
        "titleZh": "系统戦略",
        "units": [
          {
            "id": "sg-8-2-1",
            "titleJa": "8-2-1 情報システム戦略",
            "titleZh": "8-2-1 信息系统策略规划、总体架构与关键绩效指标",
            "pdfPageStart": 459,
            "pdfPageEnd": 461,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-8-2-2",
            "titleJa": "8-2-2 業務プロセス",
            "titleZh": "業務プロセス",
            "pdfPageStart": 462,
            "pdfPageEnd": 463,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-2-3",
            "titleJa": "8-2-3 ソリューションビジネス",
            "titleZh": "ソリューションビジネス",
            "pdfPageStart": 464,
            "pdfPageEnd": 465,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-2-4",
            "titleJa": "8-2-4 システム活用促進・評価",
            "titleZh": "系统活用促進、评价",
            "pdfPageStart": 466,
            "pdfPageEnd": 467,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-2-5",
            "titleJa": "8-2-5 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 468,
            "pdfPageEnd": 472,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch08-sec-83",
        "nativeSectionId": "8-3",
        "titleJa": "8-3 システム企画",
        "titleZh": "系统企画",
        "units": [
          {
            "id": "sg-8-3-1",
            "titleJa": "8-3-1 システム化計画",
            "titleZh": "8-3-1 信息系统化初期规划与可行性评估编制",
            "pdfPageStart": 473,
            "pdfPageEnd": 474,
            "questionCount": 1,
            "practiceStatus": "has_existing_course_question"
          },
          {
            "id": "sg-8-3-2",
            "titleJa": "8-3-2 要件定義",
            "titleZh": "要件定義",
            "pdfPageStart": 475,
            "pdfPageEnd": 476,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-3-3",
            "titleJa": "8-3-3 調達計画・実施",
            "titleZh": "調達計画、実施",
            "pdfPageStart": 477,
            "pdfPageEnd": 480,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-8-3-4",
            "titleJa": "8-3-4 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 481,
            "pdfPageEnd": 484,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  },
  {
    "id": "sg-ch09",
    "exam": "sg",
    "sourceId": "sg_security_textbook",
    "order": 9,
    "titleJa": "第9章 科目B問題対策",
    "titleZh": "第9章 科目B问题",
    "sectionGroups": [
      {
        "id": "sg-ch09-sec-91",
        "nativeSectionId": "9-1",
        "titleJa": "9-1 科目B問題の解き方",
        "titleZh": "科目B問題的解き方",
        "units": [
          {
            "id": "sg-9-1-1",
            "titleJa": "9-1-1 科目B問題のポイント",
            "titleZh": "9-1-1 科目B問題のポイント",
            "pdfPageStart": 486,
            "pdfPageEnd": 492,
            "questionCount": 1,
            "practiceStatus": "no_verified_topic_practice"
          },
          {
            "id": "sg-9-1-2",
            "titleJa": "9-1-2 科目B問題の解き方",
            "titleZh": "科目B問題的解き方",
            "pdfPageStart": 493,
            "pdfPageEnd": 496,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      },
      {
        "id": "sg-ch09-sec-92",
        "nativeSectionId": "9-2",
        "titleJa": "9-2 科目B問題の演習",
        "titleZh": "科目B問題的演習",
        "units": [
          {
            "id": "sg-9-2-1",
            "titleJa": "9-2-1 演習問題",
            "titleZh": "练习题",
            "pdfPageStart": 497,
            "pdfPageEnd": 518,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          },
          {
            "id": "sg-9-2-2",
            "titleJa": "9-2-2 演習問題の解説",
            "titleZh": "练习题解析",
            "pdfPageStart": 519,
            "pdfPageEnd": 522,
            "questionCount": 0,
            "practiceStatus": "no_existing_course_question"
          }
        ]
      }
    ]
  }
];

function getSourceById(sourceId) {
  return (sourcesModule.sources || []).filter(function (source) { return source.sourceId === sourceId; })[0] || null;
}

function getCourseManifest(courseId) {
  var courseChapters = chapters.filter(function (chapter) { return chapter.exam === courseId; });
  if (!courseChapters.length) return null;
  var source = getSourceById(courseChapters[0].sourceId);
  return {
    courseId: courseId,
    courseName: courseId === 'sg' ? 'SG 情報セキュリティマネジメント' : 'IT Passport',
    sourceTitle: source ? source.displayTitleJa : '',
    chapters: courseChapters
  };
}

function getUnitSummary(courseId, unitId) {
  var courseChapters = chapters.filter(function (chapter) { return chapter.exam === courseId; });
  for (var i = 0; i < courseChapters.length; i++) {
    var groups = courseChapters[i].sectionGroups || [];
    for (var g = 0; g < groups.length; g++) {
      var units = groups[g].units || [];
      for (var j = 0; j < units.length; j++) {
        if (units[j].id === unitId) {
          var copy = {};
          for (var key in units[j]) copy[key] = units[j][key];
          copy.chapterId = courseChapters[i].id;
          copy.sectionGroupId = groups[g].id;
          return copy;
        }
      }
    }
  }
  return null;
}

module.exports = {
  sources: sourcesModule.sources,
  chapters: chapters,
  getSourceById: getSourceById,
  getCourseManifest: getCourseManifest,
  getUnitSummary: getUnitSummary
};
