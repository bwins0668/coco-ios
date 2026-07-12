module.exports = {
  "chapter": {
    "id": "itpass-ch01",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 1,
    "titleJa": "第1章 ハードウェアと基礎理論［テクノロジ系］",
    "titleZh": "第1章 硬件与基础理论"
  },
  "units": [
    {
      "id": "itpass-1-01",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "1-01",
      "titleJa": "1-01 情報に関する理論",
      "titleZh": "1-01 信息相关理论",
      "overviewJa": "情報に関する理論は、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 18-21ページの見出し語である情報に関する理論を手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「情報に関する理論」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「情報に関する理論」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-01 信息相关理论”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "情報に関する理論を理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、情報に関する理論が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「情報に関する理論」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「情報に関する理論」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「情報に関する理論」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「情報に関する理論」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「情報に関する理論」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 18,
              "pdfPageEnd": 21,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-01 情報に関する理論",
              "anchorTermsJa": [
                "情報に関する理論"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、情報に関する理論が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。情報に関する理論に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく情報に関する理論を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「情報に関する理論」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「情報に関する理論」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "情報に関する理論の見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「情報に関する理論」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "情報に関する理論ではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「情報に関する理論」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 18,
              "pdfPageEnd": 21,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-01 情報に関する理論",
              "anchorTermsJa": [
                "情報に関する理論"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "情報に関する理論",
          "termZh": "信息相关理论",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0001"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 18,
          "pdfPageEnd": 21,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-01 情報に関する理論",
          "anchorTermsJa": [
            "情報に関する理論"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-02",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "1-02",
      "titleJa": "1-02 コンピュータの構成とCPU",
      "titleZh": "1-02 计算机构成与CPU",
      "overviewJa": "コンピュータの構成とCPUは、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 22-25ページの見出し語であるコンピュータの構成とCPUを手掛かりに、問題文ではCPUの制御装置・演算装置・クロック・命令実行の関係を確認します。主記憶や補助記憶との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「コンピュータの構成とCPU」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分主存储器和辅助存储器，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「コンピュータの構成とCPU」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-02 计算机构成与CPU”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "コンピュータの構成とCPUを理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、コンピュータの構成とCPUが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。CPUのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「コンピュータの構成とCPU」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 CPU 等英文术语，要判断它描述的是部件、流程、指标还是风险，并分清 CPU 负责执行命令，存储装置负责保存数据，这样才能和相邻概念分开。",
          "englishTerms": [
            "CPU"
          ],
          "examFocusJa": "「コンピュータの構成とCPU」の設問では、CPUの制御装置・演算装置・クロック・命令実行の関係が最初の判断線です。選択肢に主記憶や補助記憶が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「コンピュータの構成とCPU」相关题时，先抓CPU 的控制、运算、时钟和指令执行关系。如果选项同时出现主存储器和辅助存储器，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「コンピュータの構成とCPU」を主記憶や補助記憶と混同すると誤答します。特にCPUが記憶容量を増やす装置だと考えると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「コンピュータの構成とCPU」和主存储器和辅助存储器混淆，尤其是误以为 CPU 是增加存储容量的部件。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 22,
              "pdfPageEnd": 25,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-02 コンピュータの構成とCPU",
              "anchorTermsJa": [
                "コンピュータの構成とCPU"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、コンピュータの構成とCPUが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。コンピュータの構成とCPUに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。CPUの制御装置・演算装置・クロック・命令実行の関係を根拠にすれば、似た選択肢が出ても、主記憶や補助記憶ではなくコンピュータの構成とCPUを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「コンピュータの構成とCPU」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住CPU 的控制、运算、时钟和指令执行关系，再和主存储器和辅助存储器比较，就能知道当前条件到底指向「コンピュータの構成とCPU」还是另一个概念。",
          "englishTerms": [
            "CPU"
          ],
          "examFocusJa": "コンピュータの構成とCPUの見分け方は、CPUの制御装置・演算装置・クロック・命令実行の関係を文章中から拾い、主記憶や補助記憶に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「コンピュータの構成とCPU」的判断线索是CPU 的控制、运算、时钟和指令执行关系，同时检查题干是否混入主存储器和辅助存储器的条件。",
          "commonMistakeJa": "コンピュータの構成とCPUではなく主記憶や補助記憶の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「コンピュータの構成とCPU」误选成主存储器和辅助存储器。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 22,
              "pdfPageEnd": 25,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-02 コンピュータの構成とCPU",
              "anchorTermsJa": [
                "コンピュータの構成とCPU"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "コンピュータの構成とCPU",
          "termZh": "计算机构成与CPU",
          "english": "CPU"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0002",
        "q-itpass-lesson-0003"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 22,
          "pdfPageEnd": 25,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-02 コンピュータの構成とCPU",
          "anchorTermsJa": [
            "コンピュータの構成とCPU"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-03",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "1-03",
      "titleJa": "1-03 主記憶と補助記憶",
      "titleZh": "1-03 主存储器与辅助存储器",
      "overviewJa": "主記憶と補助記憶は、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 26-31ページの見出し語である主記憶と補助記憶を手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「主記憶と補助記憶」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「主記憶と補助記憶」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-03 主存储器与辅助存储器”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "主記憶と補助記憶を理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、主記憶と補助記憶が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「主記憶と補助記憶」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「主記憶と補助記憶」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「主記憶と補助記憶」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「主記憶と補助記憶」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「主記憶と補助記憶」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 26,
              "pdfPageEnd": 31,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-03 主記憶と補助記憶",
              "anchorTermsJa": [
                "主記憶と補助記憶"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、主記憶と補助記憶が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。主記憶と補助記憶に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく主記憶と補助記憶を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「主記憶と補助記憶」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「主記憶と補助記憶」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "主記憶と補助記憶の見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「主記憶と補助記憶」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "主記憶と補助記憶ではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「主記憶と補助記憶」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 26,
              "pdfPageEnd": 31,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-03 主記憶と補助記憶",
              "anchorTermsJa": [
                "主記憶と補助記憶"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "主記憶と補助記憶",
          "termZh": "主存储器与辅助存储器",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0004"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 26,
          "pdfPageEnd": 31,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-03 主記憶と補助記憶",
          "anchorTermsJa": [
            "主記憶と補助記憶"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-04",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "1-04",
      "titleJa": "1-04 半導体メモリ",
      "titleZh": "1-04 半导体存储器",
      "overviewJa": "半導体メモリは、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 32-35ページの見出し語である半導体メモリを手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「半導体メモリ」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「半導体メモリ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-04 半导体存储器”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "半導体メモリを理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、半導体メモリが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「半導体メモリ」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「半導体メモリ」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「半導体メモリ」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「半導体メモリ」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「半導体メモリ」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 32,
              "pdfPageEnd": 35,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-04 半導体メモリ",
              "anchorTermsJa": [
                "半導体メモリ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、半導体メモリが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。半導体メモリに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく半導体メモリを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「半導体メモリ」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「半導体メモリ」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "半導体メモリの見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「半導体メモリ」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "半導体メモリではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「半導体メモリ」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 32,
              "pdfPageEnd": 35,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-04 半導体メモリ",
              "anchorTermsJa": [
                "半導体メモリ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "半導体メモリ",
          "termZh": "半导体存储器",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0005"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 32,
          "pdfPageEnd": 35,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-04 半導体メモリ",
          "anchorTermsJa": [
            "半導体メモリ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-05",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "1-05",
      "titleJa": "1-05 入出力装置",
      "titleZh": "1-05 输入输出设备",
      "overviewJa": "入出力装置は、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 36-41ページの見出し語である入出力装置を手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「入出力装置」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「入出力装置」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-05 输入输出设备”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "入出力装置を理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、入出力装置が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「入出力装置」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「入出力装置」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「入出力装置」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「入出力装置」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「入出力装置」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 36,
              "pdfPageEnd": 41,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-05 入出力装置",
              "anchorTermsJa": [
                "入出力装置"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、入出力装置が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。入出力装置に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく入出力装置を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「入出力装置」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「入出力装置」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "入出力装置の見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「入出力装置」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "入出力装置ではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「入出力装置」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 36,
              "pdfPageEnd": 41,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-05 入出力装置",
              "anchorTermsJa": [
                "入出力装置"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "入出力装置",
          "termZh": "输入输出设备",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0006",
        "q-itpass-lesson-0007",
        "q-itpass-lesson-0008",
        "q-itpass-lesson-0009"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 36,
          "pdfPageEnd": 41,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-05 入出力装置",
          "anchorTermsJa": [
            "入出力装置"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-06",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "1-06",
      "titleJa": "1-06 入出力インタフェース",
      "titleZh": "1-06 输入输出接口",
      "overviewJa": "入出力インタフェースは、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 42-45ページの見出し語である入出力インタフェースを手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「入出力インタフェース」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「入出力インタフェース」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-06 输入输出接口”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "入出力インタフェースを理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、入出力インタフェースが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「入出力インタフェース」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「入出力インタフェース」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「入出力インタフェース」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「入出力インタフェース」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「入出力インタフェース」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 42,
              "pdfPageEnd": 45,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-06 入出力インタフェース",
              "anchorTermsJa": [
                "入出力インタフェース"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、入出力インタフェースが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。入出力インタフェースに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく入出力インタフェースを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「入出力インタフェース」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「入出力インタフェース」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "入出力インタフェースの見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「入出力インタフェース」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "入出力インタフェースではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「入出力インタフェース」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 42,
              "pdfPageEnd": 45,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-06 入出力インタフェース",
              "anchorTermsJa": [
                "入出力インタフェース"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "入出力インタフェース",
          "termZh": "输入输出接口",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0010",
        "q-itpass-lesson-0011",
        "q-itpass-lesson-0012"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 42,
          "pdfPageEnd": 45,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-06 入出力インタフェース",
          "anchorTermsJa": [
            "入出力インタフェース"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-07",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "1-07",
      "titleJa": "1-07 AI",
      "titleZh": "1-07 人工智能 (AI)",
      "overviewJa": "AIは、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 46-55ページの見出し語であるAIを手掛かりに、問題文では学習データ、推論、生成AI、機械学習の使い分けを確認します。従来のルールベース処理との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「AI」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分传统规则式处理，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「AI」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-07 人工智能 (AI)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "AIを理解する第一歩は、学習データから特徴を抽出し、推論や生成に使う仕組みとして処理の流れに置くことです。ルールを人が細かく書く処理と、データから傾向を学ぶ処理を分けて考えることで、AIが単独の流行語ではなく、入力条件から結果を判断するための手掛かりになります。AIのような英語表現が出る場合も、略語だけではなく、学習、推論、生成、評価のどの段階を指すのかを結び付けて読む必要があります。",
          "explanationZh": "理解「AI」时，不要停在“智能”这个词面，而要看它是否利用数据学习特征，再把结果用于推理、分类或生成。题干如果写的是人工设定规则，那不一定是 AI；如果强调训练数据、模型、推论或生成式 AI，就要按数据如何影响输出去判断，并注意输出仍需评价，这样才能和传统规则式处理分开。",
          "englishTerms": [
            "AI"
          ],
          "examFocusJa": "「AI」の設問では、学習データ、推論、生成AI、機械学習の使い分けが最初の判断線です。選択肢に従来のルールベース処理が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「AI」相关题时，先抓学习数据、推理、生成式 AI 和机器学习的区分。如果选项同时出现传统规则式处理，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「AI」を従来のルールベース処理と混同すると誤答します。特にAIなら必ず正解を保証すると考えると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「AI」和传统规则式处理混淆，尤其是误以为 AI 一定能保证输出正确。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 46,
              "pdfPageEnd": 55,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-07 AI",
              "anchorTermsJa": [
                "AI"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、AIが使われる場面をチャット、画像認識、需要予測などの例だけで固定せず、条件が変わったときに学習済みモデルが何を入力として何を出力するかを見ることが大切です。AIに関する説明では、機械学習、深層学習、生成AI、推論結果の扱いが問われます。学習データ、推論、生成AI、機械学習の使い分けを根拠にすれば、似た選択肢が出ても、従来のルールベース処理ではなくAIを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「AI」当作数据、模型和输出之间的判断模型，而不是孤立词条。题干可能换成客服、图像识别、推荐或生成文本来问，但核心仍是是否通过学习数据形成模型，并用模型进行推理或生成。只要抓住学习数据、推理、生成式 AI 和机器学习的区分，再和传统规则式处理比较，就能知道当前条件到底指向「AI」还是另一个概念。",
          "englishTerms": [
            "AI"
          ],
          "examFocusJa": "AIの見分け方は、学習データ、推論、生成AI、機械学習の使い分けを文章中から拾い、従来のルールベース処理に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「AI」的判断线索是学习数据、推理、生成式 AI 和机器学习的区分，同时检查题干是否混入传统规则式处理的条件。",
          "commonMistakeJa": "AIではなく従来のルールベース処理の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「AI」误选成传统规则式处理。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 46,
              "pdfPageEnd": 55,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-07 AI",
              "anchorTermsJa": [
                "AI"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "AI",
          "termZh": "人工智能 (AI)",
          "english": "AI"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0013",
        "q-itpass-lesson-0014",
        "q-itpass-lesson-0015"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 46,
          "pdfPageEnd": 55,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-07 AI",
          "anchorTermsJa": [
            "AI"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-08",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "1-08",
      "titleJa": "1-08 確率と統計",
      "titleZh": "1-08 概率与统计",
      "overviewJa": "確率と統計は、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 56-61ページの見出し語である確率と統計を手掛かりに、問題文では処理主体、記憶場所、数値の表し方がどれかを確認します。CPU・メモリ・補助記憶・入力装置の役割との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「確率と統計」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分CPU、内存、辅助存储和输入输出设备的作用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「確率と統計」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-08 概率与统计”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "確率と統計を理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、確率と統計が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「確率と統計」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「確率と統計」の設問では、処理主体、記憶場所、数値の表し方がどれかが最初の判断線です。選択肢にCPU・メモリ・補助記憶・入力装置の役割が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「確率と統計」相关题时，先抓处理主体、存储位置或数值表示方式是什么。如果选项同时出现CPU、内存、辅助存储和输入输出设备的作用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「確率と統計」をCPU・メモリ・補助記憶・入力装置の役割と混同すると誤答します。特に装置名と処理の担当を逆にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「確率と統計」和CPU、内存、辅助存储和输入输出设备的作用混淆，尤其是把设备名称和实际负责的处理环节对反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 56,
              "pdfPageEnd": 61,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-08 確率と統計",
              "anchorTermsJa": [
                "確率と統計"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、確率と統計が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。確率と統計に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。処理主体、記憶場所、数値の表し方がどれかを根拠にすれば、似た選択肢が出ても、CPU・メモリ・補助記憶・入力装置の役割ではなく確率と統計を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「確率と統計」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住处理主体、存储位置或数值表示方式是什么，再和CPU、内存、辅助存储和输入输出设备的作用比较，就能知道当前条件到底指向「確率と統計」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "確率と統計の見分け方は、処理主体、記憶場所、数値の表し方がどれかを文章中から拾い、CPU・メモリ・補助記憶・入力装置の役割に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「確率と統計」的判断线索是处理主体、存储位置或数值表示方式是什么，同时检查题干是否混入CPU、内存、辅助存储和输入输出设备的作用的条件。",
          "commonMistakeJa": "確率と統計ではなくCPU・メモリ・補助記憶・入力装置の役割の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「確率と統計」误选成CPU、内存、辅助存储和输入输出设备的作用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 56,
              "pdfPageEnd": 61,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-08 確率と統計",
              "anchorTermsJa": [
                "確率と統計"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "確率と統計",
          "termZh": "概率与统计",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0016",
        "q-itpass-lesson-0017",
        "q-itpass-lesson-0018"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 56,
          "pdfPageEnd": 61,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-08 確率と統計",
          "anchorTermsJa": [
            "確率と統計"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-1-09",
      "exam": "itpass",
      "chapterId": "itpass-ch01",
      "topicId": "technology",
      "order": 9,
      "nativeSectionId": "1-09",
      "titleJa": "1-09 基数変換",
      "titleZh": "1-09 进制转换",
      "overviewJa": "基数変換は、ハードウェアと基礎理論の中でコンピュータの構成要素、数値表現、性能の意味を判断するための重要単元です。PDF 62-65ページの見出し語である基数変換を手掛かりに、問題文では2進数、10進数、16進数の桁の重みを確認します。ビット数と表現できる値の個数との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「基数変換」建立可解题的理解路径。先看它在硬件与基础理论中解决什么问题，再看区分设备作用、数据表示和运算流程。考试不会只问名称，通常会通过场景让你区分位数和可表示值的数量，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「基数変換」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“1-09 进制转换”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "基数変換を理解する第一歩は、ハードウェアと基礎理論における役割を具体的な処理の流れに置くことです。装置の役割、データ表現、演算の流れを分けて考えることで、基数変換が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「基数変換」时，不要停在术语表面，而要把它放回硬件与基础理论的处理链路里。也就是先确认对象，再确认区分设备作用、数据表示和运算流程。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「基数変換」の設問では、2進数、10進数、16進数の桁の重みが最初の判断線です。選択肢にビット数と表現できる値の個数が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「基数変換」相关题时，先抓二进制、十进制和十六进制的位权。如果选项同时出现位数和可表示值的数量，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「基数変換」をビット数と表現できる値の個数と混同すると誤答します。特に桁数と最大値を同じ意味にすると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「基数変換」和位数和可表示值的数量混淆，尤其是把位数和最大值当成同一件事。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 62,
              "pdfPageEnd": 65,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-09 基数変換",
              "anchorTermsJa": [
                "基数変換"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、基数変換を2進数から10進数へ直す作業だけで固定せず、各桁が基数の累乗をどれだけ持つかを追うことが大切です。基数変換に関する説明では、2進数、10進数、16進数の対応、桁の重み、ビット列の読み替えが問われます。2進数、10進数、16進数の桁の重みを根拠にすれば、似た選択肢が出ても、ビット数と表現できる値の個数ではなく基数変換を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「基数変換」看成位权计算，而不是孤立词条。二进制、十进制和十六进制之间转换时，每一位都代表基数的某个幂，题干常会用位串、数值范围或 16 进制缩写来换说法。只要抓住位权，再和“多少位能表示多少个值”的问题比较，就能知道当前条件到底指向「基数変換」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "基数変換の見分け方は、2進数、10進数、16進数の桁の重みを文章中から拾い、ビット数と表現できる値の個数に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「基数変換」的判断线索是二进制、十进制和十六进制的位权，同时检查题干是否混入位数和可表示值的数量的条件。",
          "commonMistakeJa": "基数変換ではなくビット数と表現できる値の個数の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「基数変換」误选成位数和可表示值的数量。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 62,
              "pdfPageEnd": 65,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "1-09 基数変換",
              "anchorTermsJa": [
                "基数変換"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "基数変換",
          "termZh": "进制转换",
          "english": "Information Technology"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "目的と手段を逆に読む",
          "trapZh": "把目的和手段读反，导致选到看似相关但不解决题干问题的选项。"
        },
        {
          "trapJa": "英略語だけを暗記する",
          "trapZh": "只背英文缩写，不理解日文正式表述和使用场景。"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0019",
        "q-itpass-lesson-0020",
        "q-itpass-lesson-0021"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 62,
          "pdfPageEnd": 65,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "1-09 基数変換",
          "anchorTermsJa": [
            "基数変換"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
