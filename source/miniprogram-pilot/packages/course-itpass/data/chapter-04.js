module.exports = {
  "chapter": {
    "id": "itpass-ch04",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 4,
    "titleJa": "第4章 ネットワーク［テクノロジ系］",
    "titleZh": "第4章 网络"
  },
  "units": [
    {
      "id": "itpass-4-01",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "4-01",
      "titleJa": "4-01 ネットワークの構成",
      "titleZh": "4-01 网络物理连接与拓扑",
      "overviewJa": "ネットワークの構成は、ネットワーク分野で複数の機器を通信媒体とネットワーク機器で接続し、LANやWANとして資源を共有できる形にするための単元です。PDF 146-151ページの「ネットワークの構成」を定位語に、クライアントサーバ方式、ピアツーピア方式、LAN、WAN、ルータ、スイッチなどは、接続範囲と役割分担を説明するための語です。物理的なつながりと論理的な通信範囲を分けて読むと、構成図の意味が見えます。試験では設問では「社内」「拠点間」「サーバが集中管理」「端末同士が直接共有」などの表現が判断線になります。通信プロトコルやインターネットの仕組みとの違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "网络构成用于把多台设备通过传输介质和网络设备连接起来，形成 LAN 或 WAN，让数据和资源能够共享。本单元依据 PDF 146-151 页的「ネットワークの構成」定位，重点理解：客户端服务器、P2P、LAN、WAN、路由器和交换机描述的是连接范围与角色分工。先看设备怎样连，再看通信范围和转发边界，才能读懂网络结构图。考试常用题干里的“公司内部、据点之间、服务器集中管理、终端直接共享”等词，是判断构成方式的线索来换说法；同时要和通信协议或互联网寻址机制区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「ネットワークの構成」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-01 网络物理连接与拓扑”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "ネットワークの構成を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。クライアントサーバ方式、ピアツーピア方式、LAN、WAN、ルータ、スイッチなどは、接続範囲と役割分担を説明するための語です。物理的なつながりと論理的な通信範囲を分けて読むと、構成図の意味が見えます。この関係を押さえると、ネットワークの構成は単なる用語ではなく、複数の機器を通信媒体とネットワーク機器で接続し、LANやWANとして資源を共有できる形にするための考え方として理解できます。英語表記ではLAN、WAN、Client Server、Peer to Peer、Router、Switchが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习网络构成时，先不要背孤立名词，而要看它在场景中把多台设备通过传输介质和网络设备连接起来，形成 LAN 或 WAN，让数据和资源能够共享。客户端服务器、P2P、LAN、WAN、路由器和交换机描述的是连接范围与角色分工。先看设备怎样连，再看通信范围和转发边界，才能读懂网络结构图。这样复习时能把LAN、WAN、Client Server、Peer to Peer、Router、Switch等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "LAN",
            "WAN",
            "Client Server",
            "Peer to Peer",
            "Router",
            "Switch"
          ],
          "examFocusJa": "「ネットワークの構成」の設問では、設問では「社内」「拠点間」「サーバが集中管理」「端末同士が直接共有」などの表現が判断線になります。最初に対象、条件、結果を確認し、通信プロトコルやインターネットの仕組みに当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「ネットワークの構成」相关题时，先抓题干里的“公司内部、据点之间、服务器集中管理、终端直接共享”等词，是判断构成方式的线索。再检查选项是否其实在描述通信协议或互联网寻址机制，用对象、条件、结果来排除。",
          "commonMistakeJa": "「ネットワークの構成」を通信プロトコルやインターネットの仕組みと混同すると誤答します。特に接続形態を問う問題で、TCP/IPやDNSのような通信ルールを答える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「ネットワークの構成」和通信协议或互联网寻址机制混淆，尤其是题目问连接形态时，却误选 TCP/IP 或 DNS 这类通信规则。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 146,
              "pdfPageEnd": 151,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-01 ネットワークの構成",
              "anchorTermsJa": [
                "ネットワークの構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、ネットワークの構成という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「社内」「拠点間」「サーバが集中管理」「端末同士が直接共有」などの表現が判断線になります。その語が出たら、まず複数の機器を通信媒体とネットワーク機器で接続し、LANやWANとして資源を共有できる形にするという役割に合うかを確認します。合わない場合は、通信プロトコルやインターネットの仕組みの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写网络构成这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。题干里的“公司内部、据点之间、服务器集中管理、终端直接共享”等词，是判断构成方式的线索。看到这些线索时，先判断是否符合“把多台设备通过传输介质和网络设备连接起来，形成 LAN 或 WAN，让数据和资源能够共享”这个作用；如果不符合，就可能是在让你误选通信协议或互联网寻址机制。",
          "englishTerms": [
            "LAN",
            "WAN",
            "Client Server",
            "Peer to Peer",
            "Router",
            "Switch"
          ],
          "examFocusJa": "ネットワークの構成の見分け方は、設問では「社内」「拠点間」「サーバが集中管理」「端末同士が直接共有」などの表現が判断線になりますを文章中から拾い、通信プロトコルやインターネットの仕組みではなくネットワークの構成を答えるべき条件かを確認することです。",
          "examFocusZh": "网络构成的判断线索是题干里的“公司内部、据点之间、服务器集中管理、终端直接共享”等词，是判断构成方式的线索，同时确认题干要求的是否是网络构成，而不是通信协议或互联网寻址机制。",
          "commonMistakeJa": "ネットワークの構成ではなく通信プロトコルやインターネットの仕組みの説明を選ぶ誤りに注意します。原因は、接続形態を問う問題で、TCP/IPやDNSのような通信ルールを答えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「ネットワークの構成」（网络物理连接与拓扑）和通信协议或互联网寻址机制混淆。错误通常来自题目问连接形态时，却误选 TCP/IP 或 DNS 这类通信规则，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 146,
              "pdfPageEnd": 151,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-01 ネットワークの構成",
              "anchorTermsJa": [
                "ネットワークの構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "LAN",
          "termZh": "LAN",
          "english": "LAN"
        },
        {
          "termJa": "WAN",
          "termZh": "WAN",
          "english": "WAN"
        },
        {
          "termJa": "Client Server",
          "termZh": "Client Server",
          "english": "Client Server"
        },
        {
          "termJa": "Peer to Peer",
          "termZh": "Peer to Peer",
          "english": "Peer to Peer"
        },
        {
          "termJa": "Router",
          "termZh": "Router",
          "english": "Router"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "ネットワークの構成と通信プロトコルやインターネットの仕組みを混同する",
          "trapZh": "把网络构成和通信协议或互联网寻址机制混为一谈。"
        },
        {
          "trapJa": "接続形態を問う問題で、TCP/IPやDNSのような通信ルールを答える",
          "trapZh": "题目问连接形态时，却误选 TCP/IP 或 DNS 这类通信规则"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0036"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 146,
          "pdfPageEnd": 151,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-01 ネットワークの構成",
          "anchorTermsJa": [
            "ネットワークの構成"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-02",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "4-02",
      "titleJa": "4-02 無線LAN",
      "titleZh": "4-02 无线局域网 (Wi-Fi)",
      "overviewJa": "無線LANは、ネットワーク分野でケーブルではなく電波で端末をアクセスポイントに接続し、同じLANへ参加させるための単元です。PDF 152-155ページの「無線LAN」を定位語に、SSIDは無線ネットワークを識別する名前、アクセスポイントは端末を有線側ネットワークへ橋渡しする機器、暗号化方式は通信内容の盗聴を防ぐ条件です。電波は便利ですが、到達範囲、干渉、暗号化設定を合わせて考える必要があります。試験では設問では「SSID」「アクセスポイント」「暗号化キー」「WPA」「電波干渉」が無線LANを示す語になります。有線LANやBluetoothとの違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "无线局域网用于不用网线，而是通过无线电波把终端接入访问点，从而加入同一个 LAN。本单元依据 PDF 152-155 页的「無線LAN」定位，重点理解：SSID 是无线网络名称，Access Point 负责把无线终端接到有线网络，WPA 等加密方式用于保护通信内容。无线 LAN 的便利性和电波范围、干扰、加密配置必须一起理解。考试常用题干出现 SSID、访问点、加密密钥、WPA、电波干扰时，通常是在考无线 LAN 的性质来换说法；同时要和有线 LAN 或 Bluetooth区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「無線LAN」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-02 无线局域网 (Wi-Fi)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "無線LANを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。SSIDは無線ネットワークを識別する名前、アクセスポイントは端末を有線側ネットワークへ橋渡しする機器、暗号化方式は通信内容の盗聴を防ぐ条件です。電波は便利ですが、到達範囲、干渉、暗号化設定を合わせて考える必要があります。この関係を押さえると、無線LANは単なる用語ではなく、ケーブルではなく電波で端末をアクセスポイントに接続し、同じLANへ参加させるための考え方として理解できます。英語表記ではWi-Fi、SSID、Access Point、WPA、WPA2、WPA3が出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习无线局域网时，先不要背孤立名词，而要看它在场景中不用网线，而是通过无线电波把终端接入访问点，从而加入同一个 LAN。SSID 是无线网络名称，Access Point 负责把无线终端接到有线网络，WPA 等加密方式用于保护通信内容。无线 LAN 的便利性和电波范围、干扰、加密配置必须一起理解。这样复习时能把Wi-Fi、SSID、Access Point、WPA、WPA2、WPA3等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "Wi-Fi",
            "SSID",
            "Access Point",
            "WPA",
            "WPA2",
            "WPA3"
          ],
          "examFocusJa": "「無線LAN」の設問では、設問では「SSID」「アクセスポイント」「暗号化キー」「WPA」「電波干渉」が無線LANを示す語になります。最初に対象、条件、結果を確認し、有線LANやBluetoothに当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「無線LAN」相关题时，先抓题干出现 SSID、访问点、加密密钥、WPA、电波干扰时，通常是在考无线 LAN 的性质。再检查选项是否其实在描述有线 LAN 或 Bluetooth，用对象、条件、结果来排除。",
          "commonMistakeJa": "「無線LAN」を有線LANやBluetoothと混同すると誤答します。特にSSIDを暗号化方式そのものと考える、又は電波が届けば安全性も確保されると考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「無線LAN」和有线 LAN 或 Bluetooth混淆，尤其是把 SSID 当成加密方式，或误以为只要能收到信号就已经保证安全。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 152,
              "pdfPageEnd": 155,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-02 無線LAN",
              "anchorTermsJa": [
                "無線LAN"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、無線LANという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「SSID」「アクセスポイント」「暗号化キー」「WPA」「電波干渉」が無線LANを示す語になります。その語が出たら、まずケーブルではなく電波で端末をアクセスポイントに接続し、同じLANへ参加させるという役割に合うかを確認します。合わない場合は、有線LANやBluetoothの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写无线局域网这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。题干出现 SSID、访问点、加密密钥、WPA、电波干扰时，通常是在考无线 LAN 的性质。看到这些线索时，先判断是否符合“不用网线，而是通过无线电波把终端接入访问点，从而加入同一个 LAN”这个作用；如果不符合，就可能是在让你误选有线 LAN 或 Bluetooth。",
          "englishTerms": [
            "Wi-Fi",
            "SSID",
            "Access Point",
            "WPA",
            "WPA2",
            "WPA3"
          ],
          "examFocusJa": "無線LANの見分け方は、設問では「SSID」「アクセスポイント」「暗号化キー」「WPA」「電波干渉」が無線LANを示す語になりますを文章中から拾い、有線LANやBluetoothではなく無線LANを答えるべき条件かを確認することです。",
          "examFocusZh": "无线局域网的判断线索是题干出现 SSID、访问点、加密密钥、WPA、电波干扰时，通常是在考无线 LAN 的性质，同时确认题干要求的是否是无线局域网，而不是有线 LAN 或 Bluetooth。",
          "commonMistakeJa": "無線LANではなく有線LANやBluetoothの説明を選ぶ誤りに注意します。原因は、SSIDを暗号化方式そのものと考える、又は電波が届けば安全性も確保されると考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「無線LAN」（无线局域网 (Wi-Fi)）和有线 LAN 或 Bluetooth混淆。错误通常来自把 SSID 当成加密方式，或误以为只要能收到信号就已经保证安全，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 152,
              "pdfPageEnd": 155,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-02 無線LAN",
              "anchorTermsJa": [
                "無線LAN"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Wi-Fi",
          "termZh": "Wi-Fi",
          "english": "Wi-Fi"
        },
        {
          "termJa": "SSID",
          "termZh": "SSID",
          "english": "SSID"
        },
        {
          "termJa": "Access Point",
          "termZh": "Access Point",
          "english": "Access Point"
        },
        {
          "termJa": "WPA",
          "termZh": "WPA",
          "english": "WPA"
        },
        {
          "termJa": "WPA2",
          "termZh": "WPA2",
          "english": "WPA2"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "無線LANと有線LANやBluetoothを混同する",
          "trapZh": "把无线局域网和有线 LAN 或 Bluetooth混为一谈。"
        },
        {
          "trapJa": "SSIDを暗号化方式そのものと考える、又は電波が届けば安全性も確保されると考える",
          "trapZh": "把 SSID 当成加密方式，或误以为只要能收到信号就已经保证安全"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0037"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 152,
          "pdfPageEnd": 155,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-02 無線LAN",
          "anchorTermsJa": [
            "無線LAN"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-03",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "4-03",
      "titleJa": "4-03 通信プロトコル",
      "titleZh": "4-03 通信协议 (TCP/IP)",
      "overviewJa": "通信プロトコルは、ネットワーク分野で異なる機器同士が同じ手順と形式でデータを送受信できるようにする約束事を定めるための単元です。PDF 156-161ページの「通信プロトコル」を定位語に、TCP/IPはネットワーク通信の基本的なプロトコル群で、IPは宛先までパケットを届ける役割、TCPは順序や再送によって信頼性を高める役割、UDPは確認を省いて軽く送る役割を持ちます。階層ごとの役割を分けると、どの説明がどのプロトコルか判断できます。試験では設問では「再送」「コネクション」「IPアドレス」「ポート番号」「パケット」などが判断線になります。通信サービスやWebページの利用場面との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "通信协议用于规定设备之间发送和接收数据的共同规则，使不同设备能按同一格式通信。本单元依据 PDF 156-161 页的「通信プロトコル」定位，重点理解：TCP/IP 是网络通信的协议族。IP 负责把包送到目的地，TCP 通过顺序控制和重传提高可靠性，UDP 省略确认以降低开销。把每层的责任拆开，就能判断选项描述的是哪个协议。考试常用题干出现重传、连接、IP 地址、端口号、数据包等词时，要对应 TCP、UDP、IP 各自的职责来换说法；同时要和通信服务或网页使用场景区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「通信プロトコル」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-03 通信协议 (TCP/IP)”相关选项，并说清楚判断依据。",
      "sourceAccess": {
        "mode": "locator_only",
        "status": "unbound",
        "displayLabel": "原书定位已验证 / 原书阅读尚未绑定",
        "documentId": null,
        "url": null
      },
      "learningExperience": {
        "goalJa": "TCP/IP、TCP、UDP、IP、ポート番号を、通信の役割分担と試験の判断語に結び付けて読めるようにする。",
        "goalZh": "把通信协议理解成分层协作的规则：谁负责寻址、谁负责可靠传输、谁负责端口识别，再用题干条件区分。",
        "coreConcept": {
          "headingJa": "通信プロトコルは機器同士が同じ手順で話すための約束事",
          "headingZh": "通信协议是设备之间共同遵守的通信规则",
          "bodyJa": "通信プロトコルは、異なる機器やソフトウェアがデータを送受信するときに、形式、順序、宛先、誤りへの対応をそろえるための約束事です。TCP/IPはインターネットで使われる代表的なプロトコル群で、IPはパケットを宛先へ届ける役割、TCPは順序制御や再送で信頼性を高める役割、UDPは確認処理を省いて軽く送る役割を持ちます。ポート番号は、同じ端末の中でどのアプリケーションに渡す通信かを区別する目印です。",
          "bodyZh": "不要把 TCP/IP 当成一个孤立名词背。它是一组让网络通信成立的规则：IP 解决“送到哪台设备”，TCP 解决“可靠、按顺序送达”，UDP 解决“少确认、低开销发送”，Port 解决“交给哪个应用”。考试常把这些角色改写成重传、连接、IP 地址、端口号、数据包等条件，让你判断选项对应哪一层或哪一种协议。"
        },
        "examCues": [
          {
            "cueJa": "「再送」「順序制御」「コネクション」があればTCPの信頼性に関する説明として読む。",
            "cueZh": "题干出现重传、顺序控制、连接时，通常是在问 TCP 的可靠传输。"
          },
          {
            "cueJa": "「軽量」「リアルタイム」「確認を省く」があればUDPの特徴、「IPアドレス」があればIPの宛先指定を確認する。",
            "cueZh": "出现轻量、实时、省略确认时看 UDP；出现 IP 地址时看 IP 的寻址职责。"
          },
          {
            "cueJa": "「ポート番号」は通信相手の機器ではなく、同一機器内のアプリケーションを識別する条件として扱う。",
            "cueZh": "端口号不是识别哪台电脑，而是识别同一设备上的哪个应用或服务。"
          }
        ],
        "mistakeComparisons": [
          {
            "aJa": "TCP",
            "bJa": "UDP",
            "bodyJa": "TCPは確認応答や再送で信頼性を高め、UDPは確認を省いて処理を軽くします。どちらも同じ信頼性の通信と考えると誤答します。",
            "bodyZh": "TCP 重可靠，UDP 重轻量和低延迟。把两者都理解成“普通传输协议”会丢掉考试判断点。"
          },
          {
            "aJa": "IPアドレス",
            "bJa": "ポート番号",
            "bodyJa": "IPアドレスは相手の機器を識別し、ポート番号はその機器内のアプリケーションやサービスを識別します。",
            "bodyZh": "IP 地址定位设备，Port 定位设备里的服务。题目常用这个差别区分网络层和传输层。"
          }
        ]
      },
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "通信プロトコルを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。TCP/IPはネットワーク通信の基本的なプロトコル群で、IPは宛先までパケットを届ける役割、TCPは順序や再送によって信頼性を高める役割、UDPは確認を省いて軽く送る役割を持ちます。階層ごとの役割を分けると、どの説明がどのプロトコルか判断できます。この関係を押さえると、通信プロトコルは単なる用語ではなく、異なる機器同士が同じ手順と形式でデータを送受信できるようにする約束事を定めるための考え方として理解できます。英語表記ではTCP/IP、TCP、UDP、IP、Port、Packetが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习通信协议时，先不要背孤立名词，而要看它在场景中规定设备之间发送和接收数据的共同规则，使不同设备能按同一格式通信。TCP/IP 是网络通信的协议族。IP 负责把包送到目的地，TCP 通过顺序控制和重传提高可靠性，UDP 省略确认以降低开销。把每层的责任拆开，就能判断选项描述的是哪个协议。这样复习时能把TCP/IP、TCP、UDP、IP、Port、Packet等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "TCP/IP",
            "TCP",
            "UDP",
            "IP",
            "Port",
            "Packet"
          ],
          "examFocusJa": "「通信プロトコル」の設問では、設問では「再送」「コネクション」「IPアドレス」「ポート番号」「パケット」などが判断線になります。最初に対象、条件、結果を確認し、通信サービスやWebページの利用場面に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「通信プロトコル」相关题时，先抓题干出现重传、连接、IP 地址、端口号、数据包等词时，要对应 TCP、UDP、IP 各自的职责。再检查选项是否其实在描述通信服务或网页使用场景，用对象、条件、结果来排除。",
          "commonMistakeJa": "「通信プロトコル」を通信サービスやWebページの利用場面と混同すると誤答します。特にTCPとUDPをどちらも同じ信頼性の通信と考える、又はIPを暗号化方式と誤解する場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「通信プロトコル」和通信服务或网页使用场景混淆，尤其是把 TCP 和 UDP 都当成同样可靠的通信，或误把 IP 当成加密方式。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、通信プロトコルという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「再送」「コネクション」「IPアドレス」「ポート番号」「パケット」などが判断線になります。その語が出たら、まず異なる機器同士が同じ手順と形式でデータを送受信できるようにする約束事を定めるという役割に合うかを確認します。合わない場合は、通信サービスやWebページの利用場面の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写通信协议这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。题干出现重传、连接、IP 地址、端口号、数据包等词时，要对应 TCP、UDP、IP 各自的职责。看到这些线索时，先判断是否符合“规定设备之间发送和接收数据的共同规则，使不同设备能按同一格式通信”这个作用；如果不符合，就可能是在让你误选通信服务或网页使用场景。",
          "englishTerms": [
            "TCP/IP",
            "TCP",
            "UDP",
            "IP",
            "Port",
            "Packet"
          ],
          "examFocusJa": "通信プロトコルの見分け方は、設問では「再送」「コネクション」「IPアドレス」「ポート番号」「パケット」などが判断線になりますを文章中から拾い、通信サービスやWebページの利用場面ではなく通信プロトコルを答えるべき条件かを確認することです。",
          "examFocusZh": "通信协议的判断线索是题干出现重传、连接、IP 地址、端口号、数据包等词时，要对应 TCP、UDP、IP 各自的职责，同时确认题干要求的是否是通信协议，而不是通信服务或网页使用场景。",
          "commonMistakeJa": "通信プロトコルではなく通信サービスやWebページの利用場面の説明を選ぶ誤りに注意します。原因は、TCPとUDPをどちらも同じ信頼性の通信と考える、又はIPを暗号化方式と誤解するときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「通信プロトコル」（通信协议 (TCP/IP)）和通信服务或网页使用场景混淆。错误通常来自把 TCP 和 UDP 都当成同样可靠的通信，或误把 IP 当成加密方式，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "id": "tcp-ip",
          "en": "TCP/IP",
          "ja": "TCP/IP",
          "zh": "TCP/IP 协议族",
          "termJa": "TCP/IP",
          "termZh": "TCP/IP 协议族",
          "english": "TCP/IP",
          "expansionEn": "Transmission Control Protocol / Internet Protocol",
          "termType": "protocol-suite",
          "definitionJa": "インターネットで標準的に使われるプロトコル群で、複数の層の役割を組み合わせて通信を成立させます。",
          "definitionZh": "TCP/IP 是互联网常用的协议族，通过多层规则协作完成寻址、传输和应用通信。",
          "contextJa": "この単元では、IP、TCP、UDP、ポート番号を個別に覚える前に、TCP/IP全体の役割分担を押さえます。",
          "contextZh": "本节先用 TCP/IP 作为总框架，再拆开理解 IP、TCP、UDP 和 Port 各自负责什么。",
          "compareWith": [
            "tcp",
            "udp",
            "ip"
          ],
          "examCueJa": "「インターネットの基本的なプロトコル群」とあればTCP/IPとして読む。",
          "examCueZh": "看到互联网基础协议族、分层通信规则时，对应 TCP/IP。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "tcp",
          "en": "TCP",
          "ja": "TCP",
          "zh": "TCP 可靠传输协议",
          "termJa": "TCP",
          "termZh": "TCP 可靠传输协议",
          "english": "TCP",
          "expansionEn": "Transmission Control Protocol",
          "termType": "transport-protocol",
          "definitionJa": "確認応答、順序制御、再送などによって、データを信頼性高く届けるためのプロトコルです。",
          "definitionZh": "TCP 通过确认、顺序控制和重传，提高数据传输的可靠性。",
          "contextJa": "Webやメールなど、欠落や順序違いを避けたい通信を説明するときに、UDPとの違いが問われます。",
          "contextZh": "本节用 TCP 区分“可靠传输”和“轻量发送”，它常和 UDP 放在一起考。",
          "compareWith": [
            "udp",
            "ip",
            "port"
          ],
          "examCueJa": "「再送」「確認応答」「コネクション」「順序制御」はTCPの判断語です。",
          "examCueZh": "出现重传、确认、连接、顺序控制时，通常选 TCP。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "udp",
          "en": "UDP",
          "ja": "UDP",
          "zh": "UDP 轻量传输协议",
          "termJa": "UDP",
          "termZh": "UDP 轻量传输协议",
          "english": "UDP",
          "expansionEn": "User Datagram Protocol",
          "termType": "transport-protocol",
          "definitionJa": "確認応答や再送を基本的に行わず、軽量にデータを送るためのプロトコルです。",
          "definitionZh": "UDP 通常省略确认和重传，因此开销小、速度快，但可靠性控制较弱。",
          "contextJa": "リアルタイム性や軽さを重視する通信の説明で、TCPの信頼性と対比して出題されます。",
          "contextZh": "本节用 UDP 帮你理解：不是所有通信都优先可靠性，有些场景更重视低延迟和简单处理。",
          "compareWith": [
            "tcp",
            "ip",
            "packet"
          ],
          "examCueJa": "「確認を省く」「軽量」「リアルタイム性」はUDPの判断語です。",
          "examCueZh": "出现省略确认、轻量、实时性时，通常对应 UDP。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "ip",
          "en": "IP",
          "ja": "IP",
          "zh": "IP 网络层协议",
          "termJa": "IP",
          "termZh": "IP 网络层协议",
          "english": "IP",
          "expansionEn": "Internet Protocol",
          "termType": "network-protocol",
          "definitionJa": "IPアドレスを使って、パケットを宛先の機器へ届ける役割を持つプロトコルです。",
          "definitionZh": "IP 使用 IP 地址把数据包送往目标设备，重点是寻址和转发。",
          "contextJa": "IPは暗号化方式ではなく、宛先へ届けるためのネットワーク層の役割として扱います。",
          "contextZh": "本节提醒不要把 IP 误解成加密或应用服务；它的关键词是地址和送达目标设备。",
          "compareWith": [
            "port",
            "tcp",
            "packet"
          ],
          "examCueJa": "「IPアドレス」「宛先」「パケット配送」があればIPの役割を確認する。",
          "examCueZh": "出现 IP 地址、目的地、数据包转发时，要看 IP 的职责。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "port",
          "en": "Port",
          "ja": "ポート番号",
          "zh": "端口号",
          "termJa": "ポート番号",
          "termZh": "端口号",
          "english": "Port",
          "termType": "transport-identifier",
          "definitionJa": "同じ機器の中で、どのアプリケーションやサービスに通信を渡すかを識別する番号です。",
          "definitionZh": "端口号用于区分同一设备上的不同应用或服务，让通信交给正确的程序。",
          "contextJa": "IPアドレスが機器を示すのに対し、ポート番号は機器内の通信先サービスを示します。",
          "contextZh": "本节用 Port 区分“哪台设备”和“设备里的哪个服务”，这是常见考点。",
          "compareWith": [
            "ip",
            "tcp",
            "udp"
          ],
          "examCueJa": "「アプリケーションの識別」「サービスの識別」があればポート番号を確認する。",
          "examCueZh": "出现识别应用、识别服务时，对应端口号，而不是 IP 地址。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "id": "packet",
          "en": "Packet",
          "ja": "パケット",
          "zh": "数据包",
          "termJa": "パケット",
          "termZh": "数据包",
          "english": "Packet",
          "termType": "network-data-unit",
          "definitionJa": "ネットワーク上で扱いやすい大きさに分割されたデータの単位です。",
          "definitionZh": "数据包是网络传输时把数据切分成较小单位后的传输单位。",
          "contextJa": "IPはパケットを宛先へ届け、TCPはその順序や再送を制御するという役割分担で理解します。",
          "contextZh": "本节用 Packet 串起 IP 与 TCP 的职责：IP 负责送包，TCP 负责可靠性控制。",
          "compareWith": [
            "ip",
            "tcp",
            "udp"
          ],
          "examCueJa": "「分割されたデータ」「配送」「順序」が出たらパケットと関連プロトコルを結び付ける。",
          "examCueZh": "出现被切分的数据、传送、顺序时，要联想到 Packet 及其相关协议。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 156,
              "pdfPageEnd": 161,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-03 通信プロトコル",
              "anchorTermsJa": [
                "通信プロトコル"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "commonTraps": [
        {
          "trapJa": "通信プロトコルと通信サービスやWebページの利用場面を混同する",
          "trapZh": "把通信协议和通信服务或网页使用场景混为一谈。"
        },
        {
          "trapJa": "TCPとUDPをどちらも同じ信頼性の通信と考える、又はIPを暗号化方式と誤解する",
          "trapZh": "把 TCP 和 UDP 都当成同样可靠的通信，或误把 IP 当成加密方式"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0038"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 156,
          "pdfPageEnd": 161,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-03 通信プロトコル",
          "anchorTermsJa": [
            "通信プロトコル"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-04",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "4-04",
      "titleJa": "4-04 インターネットの仕組み",
      "titleZh": "4-04 互联网寻址与解析 (DNS/IP)",
      "overviewJa": "インターネットの仕組みは、ネットワーク分野で世界中のネットワークを相互接続し、IPアドレス、ドメイン名、DNS、ルーティングで目的の相手へ到達させるための単元です。PDF 162-171ページの「インターネットの仕組み」を定位語に、利用者はURLやドメイン名で相手を指定しますが、実際の通信ではDNSでIPアドレスを得て、ルータが経路を選びながらパケットを転送します。名前解決と経路制御を分けると、Webが表示されるまでの流れを説明できます。試験では設問では「ドメイン名」「DNS」「IPアドレス」「ルータ」「URL」「名前解決」が重要な判断語です。WebページのHTMLや電子メールの送受信手順との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "互联网机制用于把全球网络互联起来，通过 IP 地址、域名、DNS 和路由把通信送到目标主机。本单元依据 PDF 162-171 页的「インターネットの仕組み」定位，重点理解：用户看到的是 URL 或域名，但实际通信先由 DNS 把域名解析为 IP 地址，再由路由器选择路径转发数据包。把“名字解析”和“路径转发”分开，网页访问流程就清楚了。考试常用题干中的域名、DNS、IP 地址、路由器、URL、名称解析，是判断互联网机制的关键字来换说法；同时要和网页 HTML 或电子邮件收发协议区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「インターネットの仕組み」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-04 互联网寻址与解析 (DNS/IP)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "インターネットの仕組みを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。利用者はURLやドメイン名で相手を指定しますが、実際の通信ではDNSでIPアドレスを得て、ルータが経路を選びながらパケットを転送します。名前解決と経路制御を分けると、Webが表示されるまでの流れを説明できます。この関係を押さえると、インターネットの仕組みは単なる用語ではなく、世界中のネットワークを相互接続し、IPアドレス、ドメイン名、DNS、ルーティングで目的の相手へ到達させるための考え方として理解できます。英語表記ではDNS、IP Address、URL、Domain、Router、NATが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习互联网机制时，先不要背孤立名词，而要看它在场景中把全球网络互联起来，通过 IP 地址、域名、DNS 和路由把通信送到目标主机。用户看到的是 URL 或域名，但实际通信先由 DNS 把域名解析为 IP 地址，再由路由器选择路径转发数据包。把“名字解析”和“路径转发”分开，网页访问流程就清楚了。这样复习时能把DNS、IP Address、URL、Domain、Router、NAT等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "DNS",
            "IP Address",
            "URL",
            "Domain",
            "Router",
            "NAT"
          ],
          "examFocusJa": "「インターネットの仕組み」の設問では、設問では「ドメイン名」「DNS」「IPアドレス」「ルータ」「URL」「名前解決」が重要な判断語です。最初に対象、条件、結果を確認し、WebページのHTMLや電子メールの送受信手順に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「インターネットの仕組み」相关题时，先抓题干中的域名、DNS、IP 地址、路由器、URL、名称解析，是判断互联网机制的关键字。再检查选项是否其实在描述网页 HTML 或电子邮件收发协议，用对象、条件、结果来排除。",
          "commonMistakeJa": "「インターネットの仕組み」をWebページのHTMLや電子メールの送受信手順と混同すると誤答します。特にDNSをWebページを保存するサーバと考える、又はURLそのものが通信経路だと考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「インターネットの仕組み」和网页 HTML 或电子邮件收发协议混淆，尤其是把 DNS 当成保存网页内容的服务器，或误以为 URL 本身就是网络路径。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 162,
              "pdfPageEnd": 171,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-04 インターネットの仕組み",
              "anchorTermsJa": [
                "インターネットの仕組み"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、インターネットの仕組みという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「ドメイン名」「DNS」「IPアドレス」「ルータ」「URL」「名前解決」が重要な判断語です。その語が出たら、まず世界中のネットワークを相互接続し、IPアドレス、ドメイン名、DNS、ルーティングで目的の相手へ到達させるという役割に合うかを確認します。合わない場合は、WebページのHTMLや電子メールの送受信手順の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写互联网机制这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。题干中的域名、DNS、IP 地址、路由器、URL、名称解析，是判断互联网机制的关键字。看到这些线索时，先判断是否符合“把全球网络互联起来，通过 IP 地址、域名、DNS 和路由把通信送到目标主机”这个作用；如果不符合，就可能是在让你误选网页 HTML 或电子邮件收发协议。",
          "englishTerms": [
            "DNS",
            "IP Address",
            "URL",
            "Domain",
            "Router",
            "NAT"
          ],
          "examFocusJa": "インターネットの仕組みの見分け方は、設問では「ドメイン名」「DNS」「IPアドレス」「ルータ」「URL」「名前解決」が重要な判断語ですを文章中から拾い、WebページのHTMLや電子メールの送受信手順ではなくインターネットの仕組みを答えるべき条件かを確認することです。",
          "examFocusZh": "互联网机制的判断线索是题干中的域名、DNS、IP 地址、路由器、URL、名称解析，是判断互联网机制的关键字，同时确认题干要求的是否是互联网机制，而不是网页 HTML 或电子邮件收发协议。",
          "commonMistakeJa": "インターネットの仕組みではなくWebページのHTMLや電子メールの送受信手順の説明を選ぶ誤りに注意します。原因は、DNSをWebページを保存するサーバと考える、又はURLそのものが通信経路だと考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「インターネットの仕組み」（互联网寻址与解析 (DNS/IP)）和网页 HTML 或电子邮件收发协议混淆。错误通常来自把 DNS 当成保存网页内容的服务器，或误以为 URL 本身就是网络路径，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 162,
              "pdfPageEnd": 171,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-04 インターネットの仕組み",
              "anchorTermsJa": [
                "インターネットの仕組み"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "DNS",
          "termZh": "DNS",
          "english": "DNS"
        },
        {
          "termJa": "IP Address",
          "termZh": "IP Address",
          "english": "IP Address"
        },
        {
          "termJa": "URL",
          "termZh": "URL",
          "english": "URL"
        },
        {
          "termJa": "Domain",
          "termZh": "Domain",
          "english": "Domain"
        },
        {
          "termJa": "Router",
          "termZh": "Router",
          "english": "Router"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "インターネットの仕組みとWebページのHTMLや電子メールの送受信手順を混同する",
          "trapZh": "把互联网机制和网页 HTML 或电子邮件收发协议混为一谈。"
        },
        {
          "trapJa": "DNSをWebページを保存するサーバと考える、又はURLそのものが通信経路だと考える",
          "trapZh": "把 DNS 当成保存网页内容的服务器，或误以为 URL 本身就是网络路径"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0039"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 162,
          "pdfPageEnd": 171,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-04 インターネットの仕組み",
          "anchorTermsJa": [
            "インターネットの仕組み"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-05",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "4-05",
      "titleJa": "4-05 通信サービス",
      "titleZh": "4-05 网络通信服务",
      "overviewJa": "通信サービスは、ネットワーク分野で利用者や組織がインターネットや拠点間通信を利用するための回線、接続方式、提供事業者のサービスを選ぶための単元です。PDF 172-175ページの「通信サービス」を定位語に、光回線、モバイル通信、専用線、VPNなどは、速度、利用場所、費用、セキュリティ、可用性の条件で選び分けます。プロトコル名ではなく、誰がどの範囲をどの品質で接続したいかを見る単元です。試験では設問では「外出先」「拠点間」「専用線」「VPN」「通信事業者」「通信速度」「可用性」が判断線です。通信プロトコルやネットワーク機器の構成との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "通信服务用于让个人或组织选择接入互联网、移动通信或据点间连接所需的线路、接入方式和运营服务。本单元依据 PDF 172-175 页的「通信サービス」定位，重点理解：光纤、移动通信、专线、VPN 等服务要按速度、使用地点、费用、安全性和可用性选择。这里考的不是协议名称，而是谁要在什么范围内用什么质量连接网络。考试常用外出、据点间、专线、VPN、通信运营商、通信速度、可用性，是通信服务题的主要线索来换说法；同时要和通信协议或网络设备构成区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「通信サービス」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-05 网络通信服务”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "通信サービスを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。光回線、モバイル通信、専用線、VPNなどは、速度、利用場所、費用、セキュリティ、可用性の条件で選び分けます。プロトコル名ではなく、誰がどの範囲をどの品質で接続したいかを見る単元です。この関係を押さえると、通信サービスは単なる用語ではなく、利用者や組織がインターネットや拠点間通信を利用するための回線、接続方式、提供事業者のサービスを選ぶための考え方として理解できます。英語表記ではISP、FTTH、LTE、5G、VPN、Dedicated Lineが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习通信服务时，先不要背孤立名词，而要看它在场景中让个人或组织选择接入互联网、移动通信或据点间连接所需的线路、接入方式和运营服务。光纤、移动通信、专线、VPN 等服务要按速度、使用地点、费用、安全性和可用性选择。这里考的不是协议名称，而是谁要在什么范围内用什么质量连接网络。这样复习时能把ISP、FTTH、LTE、5G、VPN、Dedicated Line等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "ISP",
            "FTTH",
            "LTE",
            "5G",
            "VPN",
            "Dedicated Line"
          ],
          "examFocusJa": "「通信サービス」の設問では、設問では「外出先」「拠点間」「専用線」「VPN」「通信事業者」「通信速度」「可用性」が判断線です。最初に対象、条件、結果を確認し、通信プロトコルやネットワーク機器の構成に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「通信サービス」相关题时，先抓外出、据点间、专线、VPN、通信运营商、通信速度、可用性，是通信服务题的主要线索。再检查选项是否其实在描述通信协议或网络设备构成，用对象、条件、结果来排除。",
          "commonMistakeJa": "「通信サービス」を通信プロトコルやネットワーク機器の構成と混同すると誤答します。特に回線サービスの選定問題で、TCPやHTTPのような通信手順を答える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「通信サービス」和通信协议或网络设备构成混淆，尤其是题目问线路或接入服务选择，却误选 TCP、HTTP 这类通信步骤。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 172,
              "pdfPageEnd": 175,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-05 通信サービス",
              "anchorTermsJa": [
                "通信サービス"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、通信サービスという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「外出先」「拠点間」「専用線」「VPN」「通信事業者」「通信速度」「可用性」が判断線です。その語が出たら、まず利用者や組織がインターネットや拠点間通信を利用するための回線、接続方式、提供事業者のサービスを選ぶという役割に合うかを確認します。合わない場合は、通信プロトコルやネットワーク機器の構成の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写通信服务这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。外出、据点间、专线、VPN、通信运营商、通信速度、可用性，是通信服务题的主要线索。看到这些线索时，先判断是否符合“让个人或组织选择接入互联网、移动通信或据点间连接所需的线路、接入方式和运营服务”这个作用；如果不符合，就可能是在让你误选通信协议或网络设备构成。",
          "englishTerms": [
            "ISP",
            "FTTH",
            "LTE",
            "5G",
            "VPN",
            "Dedicated Line"
          ],
          "examFocusJa": "通信サービスの見分け方は、設問では「外出先」「拠点間」「専用線」「VPN」「通信事業者」「通信速度」「可用性」が判断線ですを文章中から拾い、通信プロトコルやネットワーク機器の構成ではなく通信サービスを答えるべき条件かを確認することです。",
          "examFocusZh": "通信服务的判断线索是外出、据点间、专线、VPN、通信运营商、通信速度、可用性，是通信服务题的主要线索，同时确认题干要求的是否是通信服务，而不是通信协议或网络设备构成。",
          "commonMistakeJa": "通信サービスではなく通信プロトコルやネットワーク機器の構成の説明を選ぶ誤りに注意します。原因は、回線サービスの選定問題で、TCPやHTTPのような通信手順を答えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「通信サービス」（网络通信服务）和通信协议或网络设备构成混淆。错误通常来自题目问线路或接入服务选择，却误选 TCP、HTTP 这类通信步骤，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 172,
              "pdfPageEnd": 175,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-05 通信サービス",
              "anchorTermsJa": [
                "通信サービス"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ISP",
          "termZh": "ISP",
          "english": "ISP"
        },
        {
          "termJa": "FTTH",
          "termZh": "FTTH",
          "english": "FTTH"
        },
        {
          "termJa": "LTE",
          "termZh": "LTE",
          "english": "LTE"
        },
        {
          "termJa": "5G",
          "termZh": "5G",
          "english": "5G"
        },
        {
          "termJa": "VPN",
          "termZh": "VPN",
          "english": "VPN"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "通信サービスと通信プロトコルやネットワーク機器の構成を混同する",
          "trapZh": "把通信服务和通信协议或网络设备构成混为一谈。"
        },
        {
          "trapJa": "回線サービスの選定問題で、TCPやHTTPのような通信手順を答える",
          "trapZh": "题目问线路或接入服务选择，却误选 TCP、HTTP 这类通信步骤"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0040"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 172,
          "pdfPageEnd": 175,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-05 通信サービス",
          "anchorTermsJa": [
            "通信サービス"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-06",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "4-06",
      "titleJa": "4-06 Webページ",
      "titleZh": "4-06 网页技术 (HTTP/HTML)",
      "overviewJa": "Webページは、ネットワーク分野でブラウザとWebサーバがHTTP又はHTTPSで通信し、HTMLなどのデータを解釈して画面に表示するための単元です。PDF 176-179ページの「Webページ」を定位語に、HTMLは文書構造、CSSは見た目、JavaScriptは動き、HTTPは取得や送信の手順、HTTPSは通信経路の暗号化を担います。ページの内容を作る技術と、サーバから取得する通信手順を分けると選択肢を判断しやすくなります。試験では設問では「ブラウザ」「Webサーバ」「URL」「HTML」「HTTP」「HTTPS」「暗号化」が判断語になります。電子メールやDNSの名前解決との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "网页技术用于浏览器和 Web 服务器通过 HTTP 或 HTTPS 通信，取得 HTML 等数据并解释显示成页面。本单元依据 PDF 176-179 页的「Webページ」定位，重点理解：HTML 描述结构，CSS 控制样式，JavaScript 负责交互，HTTP 规定请求响应，HTTPS 保护通信路径。把“页面内容技术”和“取得页面的通信协议”分开，选项就不会混在一起。考试常用浏览器、Web 服务器、URL、HTML、HTTP、HTTPS、加密，是网页技术题的判断词来换说法；同时要和电子邮件或 DNS 名称解析区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「Webページ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-06 网页技术 (HTTP/HTML)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "Webページを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。HTMLは文書構造、CSSは見た目、JavaScriptは動き、HTTPは取得や送信の手順、HTTPSは通信経路の暗号化を担います。ページの内容を作る技術と、サーバから取得する通信手順を分けると選択肢を判断しやすくなります。この関係を押さえると、Webページは単なる用語ではなく、ブラウザとWebサーバがHTTP又はHTTPSで通信し、HTMLなどのデータを解釈して画面に表示するための考え方として理解できます。英語表記ではWeb、HTTP、HTTPS、HTML、CSS、JavaScriptが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习网页技术时，先不要背孤立名词，而要看它在场景中浏览器和 Web 服务器通过 HTTP 或 HTTPS 通信，取得 HTML 等数据并解释显示成页面。HTML 描述结构，CSS 控制样式，JavaScript 负责交互，HTTP 规定请求响应，HTTPS 保护通信路径。把“页面内容技术”和“取得页面的通信协议”分开，选项就不会混在一起。这样复习时能把Web、HTTP、HTTPS、HTML、CSS、JavaScript等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "Web",
            "HTTP",
            "HTTPS",
            "HTML",
            "CSS",
            "JavaScript"
          ],
          "examFocusJa": "「Webページ」の設問では、設問では「ブラウザ」「Webサーバ」「URL」「HTML」「HTTP」「HTTPS」「暗号化」が判断語になります。最初に対象、条件、結果を確認し、電子メールやDNSの名前解決に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「Webページ」相关题时，先抓浏览器、Web 服务器、URL、HTML、HTTP、HTTPS、加密，是网页技术题的判断词。再检查选项是否其实在描述电子邮件或 DNS 名称解析，用对象、条件、结果来排除。",
          "commonMistakeJa": "「Webページ」を電子メールやDNSの名前解決と混同すると誤答します。特にHTMLを通信を暗号化する仕組みと考える、又はHTTPSをページの見た目を作る言語と考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「Webページ」和电子邮件或 DNS 名称解析混淆，尤其是把 HTML 当成加密通信机制，或把 HTTPS 当成控制页面样式的语言。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 176,
              "pdfPageEnd": 179,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-06 Webページ",
              "anchorTermsJa": [
                "Webページ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、Webページという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「ブラウザ」「Webサーバ」「URL」「HTML」「HTTP」「HTTPS」「暗号化」が判断語になります。その語が出たら、まずブラウザとWebサーバがHTTP又はHTTPSで通信し、HTMLなどのデータを解釈して画面に表示するという役割に合うかを確認します。合わない場合は、電子メールやDNSの名前解決の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写网页技术这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。浏览器、Web 服务器、URL、HTML、HTTP、HTTPS、加密，是网页技术题的判断词。看到这些线索时，先判断是否符合“浏览器和 Web 服务器通过 HTTP 或 HTTPS 通信，取得 HTML 等数据并解释显示成页面”这个作用；如果不符合，就可能是在让你误选电子邮件或 DNS 名称解析。",
          "englishTerms": [
            "Web",
            "HTTP",
            "HTTPS",
            "HTML",
            "CSS",
            "JavaScript"
          ],
          "examFocusJa": "Webページの見分け方は、設問では「ブラウザ」「Webサーバ」「URL」「HTML」「HTTP」「HTTPS」「暗号化」が判断語になりますを文章中から拾い、電子メールやDNSの名前解決ではなくWebページを答えるべき条件かを確認することです。",
          "examFocusZh": "网页技术的判断线索是浏览器、Web 服务器、URL、HTML、HTTP、HTTPS、加密，是网页技术题的判断词，同时确认题干要求的是否是网页技术，而不是电子邮件或 DNS 名称解析。",
          "commonMistakeJa": "Webページではなく電子メールやDNSの名前解決の説明を選ぶ誤りに注意します。原因は、HTMLを通信を暗号化する仕組みと考える、又はHTTPSをページの見た目を作る言語と考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「Webページ」（网页技术 (HTTP/HTML)）和电子邮件或 DNS 名称解析混淆。错误通常来自把 HTML 当成加密通信机制，或把 HTTPS 当成控制页面样式的语言，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 176,
              "pdfPageEnd": 179,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-06 Webページ",
              "anchorTermsJa": [
                "Webページ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Web",
          "termZh": "Web",
          "english": "Web"
        },
        {
          "termJa": "HTTP",
          "termZh": "HTTP",
          "english": "HTTP"
        },
        {
          "termJa": "HTTPS",
          "termZh": "HTTPS",
          "english": "HTTPS"
        },
        {
          "termJa": "HTML",
          "termZh": "HTML",
          "english": "HTML"
        },
        {
          "termJa": "CSS",
          "termZh": "CSS",
          "english": "CSS"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "Webページと電子メールやDNSの名前解決を混同する",
          "trapZh": "把网页技术和电子邮件或 DNS 名称解析混为一谈。"
        },
        {
          "trapJa": "HTMLを通信を暗号化する仕組みと考える、又はHTTPSをページの見た目を作る言語と考える",
          "trapZh": "把 HTML 当成加密通信机制，或把 HTTPS 当成控制页面样式的语言"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0041"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 176,
          "pdfPageEnd": 179,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-06 Webページ",
          "anchorTermsJa": [
            "Webページ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-4-07",
      "exam": "itpass",
      "chapterId": "itpass-ch04",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "4-07",
      "titleJa": "4-07 電子メール",
      "titleZh": "4-07 电子邮件协议",
      "overviewJa": "電子メールは、ネットワーク分野で送信者と受信者のメールサーバを経由してメッセージを配送し、受信者が端末から取り出せるようにするための単元です。PDF 180-183ページの「電子メール」を定位語に、SMTPはメール送信、POP3やIMAPは受信やサーバ上のメール管理、MIMEは添付ファイルや文字種の扱いに関係します。To、Cc、Bccは宛先の見え方を変えるため、通信手順と宛先表示を分けて読む必要があります。試験では設問では「SMTP」「POP3」「IMAP」「MIME」「Cc」「Bcc」「メールサーバ」が判断線です。Webページ閲覧やファイル共有との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "电子邮件用于通过发件人和收件人的邮件服务器转发消息，让收件人能从终端读取邮件。本单元依据 PDF 180-183 页的「電子メール」定位，重点理解：SMTP 负责发送邮件，POP3 和 IMAP 负责接收或管理服务器上的邮件，MIME 处理附件和字符类型。To、Cc、Bcc 改变的是收件人可见性，要和收发协议区分开。考试常用SMTP、POP3、IMAP、MIME、Cc、Bcc、邮件服务器，是电子邮件题的核心线索来换说法；同时要和网页浏览或文件共享区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「電子メール」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“4-07 电子邮件协议”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "電子メールを学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。SMTPはメール送信、POP3やIMAPは受信やサーバ上のメール管理、MIMEは添付ファイルや文字種の扱いに関係します。To、Cc、Bccは宛先の見え方を変えるため、通信手順と宛先表示を分けて読む必要があります。この関係を押さえると、電子メールは単なる用語ではなく、送信者と受信者のメールサーバを経由してメッセージを配送し、受信者が端末から取り出せるようにするための考え方として理解できます。英語表記ではSMTP、POP3、IMAP、MIME、Cc、Bccが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习电子邮件时，先不要背孤立名词，而要看它在场景中通过发件人和收件人的邮件服务器转发消息，让收件人能从终端读取邮件。SMTP 负责发送邮件，POP3 和 IMAP 负责接收或管理服务器上的邮件，MIME 处理附件和字符类型。To、Cc、Bcc 改变的是收件人可见性，要和收发协议区分开。这样复习时能把SMTP、POP3、IMAP、MIME、Cc、Bcc等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "SMTP",
            "POP3",
            "IMAP",
            "MIME",
            "Cc",
            "Bcc"
          ],
          "examFocusJa": "「電子メール」の設問では、設問では「SMTP」「POP3」「IMAP」「MIME」「Cc」「Bcc」「メールサーバ」が判断線です。最初に対象、条件、結果を確認し、Webページ閲覧やファイル共有に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「電子メール」相关题时，先抓SMTP、POP3、IMAP、MIME、Cc、Bcc、邮件服务器，是电子邮件题的核心线索。再检查选项是否其实在描述网页浏览或文件共享，用对象、条件、结果来排除。",
          "commonMistakeJa": "「電子メール」をWebページ閲覧やファイル共有と混同すると誤答します。特にSMTPでメールを受信すると考える、又はBccの宛先が全員に見えると考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「電子メール」和网页浏览或文件共享混淆，尤其是误以为 SMTP 用于收信，或误以为 Bcc 的收件人会被所有人看到。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 180,
              "pdfPageEnd": 183,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-07 電子メール",
              "anchorTermsJa": [
                "電子メール"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、電子メールという見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「SMTP」「POP3」「IMAP」「MIME」「Cc」「Bcc」「メールサーバ」が判断線です。その語が出たら、まず送信者と受信者のメールサーバを経由してメッセージを配送し、受信者が端末から取り出せるようにするという役割に合うかを確認します。合わない場合は、Webページ閲覧やファイル共有の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写电子邮件这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。SMTP、POP3、IMAP、MIME、Cc、Bcc、邮件服务器，是电子邮件题的核心线索。看到这些线索时，先判断是否符合“通过发件人和收件人的邮件服务器转发消息，让收件人能从终端读取邮件”这个作用；如果不符合，就可能是在让你误选网页浏览或文件共享。",
          "englishTerms": [
            "SMTP",
            "POP3",
            "IMAP",
            "MIME",
            "Cc",
            "Bcc"
          ],
          "examFocusJa": "電子メールの見分け方は、設問では「SMTP」「POP3」「IMAP」「MIME」「Cc」「Bcc」「メールサーバ」が判断線ですを文章中から拾い、Webページ閲覧やファイル共有ではなく電子メールを答えるべき条件かを確認することです。",
          "examFocusZh": "电子邮件的判断线索是SMTP、POP3、IMAP、MIME、Cc、Bcc、邮件服务器，是电子邮件题的核心线索，同时确认题干要求的是否是电子邮件，而不是网页浏览或文件共享。",
          "commonMistakeJa": "電子メールではなくWebページ閲覧やファイル共有の説明を選ぶ誤りに注意します。原因は、SMTPでメールを受信すると考える、又はBccの宛先が全員に見えると考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「電子メール」（电子邮件协议）和网页浏览或文件共享混淆。错误通常来自误以为 SMTP 用于收信，或误以为 Bcc 的收件人会被所有人看到，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 180,
              "pdfPageEnd": 183,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "4-07 電子メール",
              "anchorTermsJa": [
                "電子メール"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SMTP",
          "termZh": "SMTP",
          "english": "SMTP"
        },
        {
          "termJa": "POP3",
          "termZh": "POP3",
          "english": "POP3"
        },
        {
          "termJa": "IMAP",
          "termZh": "IMAP",
          "english": "IMAP"
        },
        {
          "termJa": "MIME",
          "termZh": "MIME",
          "english": "MIME"
        },
        {
          "termJa": "Cc",
          "termZh": "Cc",
          "english": "Cc"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "電子メールとWebページ閲覧やファイル共有を混同する",
          "trapZh": "把电子邮件和网页浏览或文件共享混为一谈。"
        },
        {
          "trapJa": "SMTPでメールを受信すると考える、又はBccの宛先が全員に見えると考える",
          "trapZh": "误以为 SMTP 用于收信，或误以为 Bcc 的收件人会被所有人看到"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0042"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 180,
          "pdfPageEnd": 183,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "4-07 電子メール",
          "anchorTermsJa": [
            "電子メール"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
