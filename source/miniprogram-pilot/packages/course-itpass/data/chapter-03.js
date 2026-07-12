module.exports = {
  "chapter": {
    "id": "itpass-ch03",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 3,
    "titleJa": "第3章 システム構成［テクノロジ系］",
    "titleZh": "第3章 系统构成"
  },
  "units": [
    {
      "id": "itpass-3-01",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "3-01",
      "titleJa": "3-01 コンピュータの形態",
      "titleZh": "3-01 计算机部署形态",
      "overviewJa": "コンピュータの形態は、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 110-115ページの見出し語であるコンピュータの形態を手掛かりに、問題文では可用性、信頼性、性能、拡張性のどの観点かを確認します。集中処理・分散処理・冗長構成・性能評価指標との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「コンピュータの形態」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分集中处理、分布处理、冗余构成和性能评价指标，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「コンピュータの形態」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-01 计算机部署形态”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "コンピュータの形態を理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、コンピュータの形態が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「コンピュータの形態」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「コンピュータの形態」の設問では、可用性、信頼性、性能、拡張性のどの観点かが最初の判断線です。選択肢に集中処理・分散処理・冗長構成・性能評価指標が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「コンピュータの形態」相关题时，先抓题目关注可用性、可靠性、性能还是扩展性。如果选项同时出现集中处理、分布处理、冗余构成和性能评价指标，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「コンピュータの形態」を集中処理・分散処理・冗長構成・性能評価指標と混同すると誤答します。特に稼働率向上策と処理性能向上策を混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「コンピュータの形態」和集中处理、分布处理、冗余构成和性能评价指标混淆，尤其是把提高可用性的措施和提高处理性能的措施混淆。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 110,
              "pdfPageEnd": 115,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-01 コンピュータの形態",
              "anchorTermsJa": [
                "コンピュータの形態"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、コンピュータの形態が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。コンピュータの形態に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。可用性、信頼性、性能、拡張性のどの観点かを根拠にすれば、似た選択肢が出ても、集中処理・分散処理・冗長構成・性能評価指標ではなくコンピュータの形態を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「コンピュータの形態」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住题目关注可用性、可靠性、性能还是扩展性，再和集中处理、分布处理、冗余构成和性能评价指标比较，就能知道当前条件到底指向「コンピュータの形態」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "コンピュータの形態の見分け方は、可用性、信頼性、性能、拡張性のどの観点かを文章中から拾い、集中処理・分散処理・冗長構成・性能評価指標に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「コンピュータの形態」的判断线索是题目关注可用性、可靠性、性能还是扩展性，同时检查题干是否混入集中处理、分布处理、冗余构成和性能评价指标的条件。",
          "commonMistakeJa": "コンピュータの形態ではなく集中処理・分散処理・冗長構成・性能評価指標の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「コンピュータの形態」误选成集中处理、分布处理、冗余构成和性能评价指标。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 110,
              "pdfPageEnd": 115,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-01 コンピュータの形態",
              "anchorTermsJa": [
                "コンピュータの形態"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "コンピュータの形態",
          "termZh": "计算机部署形态",
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
        "q-itpass-lesson-0030"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 110,
          "pdfPageEnd": 115,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-01 コンピュータの形態",
          "anchorTermsJa": [
            "コンピュータの形態"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-3-02",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "3-02",
      "titleJa": "3-02 システム構成",
      "titleZh": "3-02 高可用系统配置",
      "overviewJa": "システム構成は、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 116-121ページの見出し語であるシステム構成を手掛かりに、問題文では可用性、信頼性、性能、拡張性のどの観点かを確認します。集中処理・分散処理・冗長構成・性能評価指標との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「システム構成」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分集中处理、分布处理、冗余构成和性能评价指标，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「システム構成」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-02 高可用系统配置”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "システム構成を理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、システム構成が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「システム構成」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「システム構成」の設問では、可用性、信頼性、性能、拡張性のどの観点かが最初の判断線です。選択肢に集中処理・分散処理・冗長構成・性能評価指標が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「システム構成」相关题时，先抓题目关注可用性、可靠性、性能还是扩展性。如果选项同时出现集中处理、分布处理、冗余构成和性能评价指标，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「システム構成」を集中処理・分散処理・冗長構成・性能評価指標と混同すると誤答します。特に稼働率向上策と処理性能向上策を混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「システム構成」和集中处理、分布处理、冗余构成和性能评价指标混淆，尤其是把提高可用性的措施和提高处理性能的措施混淆。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 116,
              "pdfPageEnd": 121,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-02 システム構成",
              "anchorTermsJa": [
                "システム構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、システム構成が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。システム構成に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。可用性、信頼性、性能、拡張性のどの観点かを根拠にすれば、似た選択肢が出ても、集中処理・分散処理・冗長構成・性能評価指標ではなくシステム構成を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「システム構成」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住题目关注可用性、可靠性、性能还是扩展性，再和集中处理、分布处理、冗余构成和性能评价指标比较，就能知道当前条件到底指向「システム構成」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "システム構成の見分け方は、可用性、信頼性、性能、拡張性のどの観点かを文章中から拾い、集中処理・分散処理・冗長構成・性能評価指標に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「システム構成」的判断线索是题目关注可用性、可靠性、性能还是扩展性，同时检查题干是否混入集中处理、分布处理、冗余构成和性能评价指标的条件。",
          "commonMistakeJa": "システム構成ではなく集中処理・分散処理・冗長構成・性能評価指標の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「システム構成」误选成集中处理、分布处理、冗余构成和性能评价指标。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 116,
              "pdfPageEnd": 121,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-02 システム構成",
              "anchorTermsJa": [
                "システム構成"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "システム構成",
          "termZh": "高可用系统配置",
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
        "q-itpass-lesson-0031"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 116,
          "pdfPageEnd": 121,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-02 システム構成",
          "anchorTermsJa": [
            "システム構成"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-3-03",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "3-03",
      "titleJa": "3-03 システムの信頼性",
      "titleZh": "3-03 系统可靠性计算 (Availability)",
      "overviewJa": "システムの信頼性は、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 122-127ページの見出し語であるシステムの信頼性を手掛かりに、問題文ではMTBF、MTTR、稼働率、冗長化の関係を確認します。信頼性と性能との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「システムの信頼性」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分可靠性和性能，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「システムの信頼性」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-03 系统可靠性计算 (Availability)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "システムの信頼性を理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、システムの信頼性が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「システムの信頼性」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「システムの信頼性」の設問では、MTBF、MTTR、稼働率、冗長化の関係が最初の判断線です。選択肢に信頼性と性能が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「システムの信頼性」相关题时，先抓MTBF、MTTR、可用率和冗余的关系。如果选项同时出现可靠性和性能，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「システムの信頼性」を信頼性と性能と混同すると誤答します。特に速く処理できることを障害に強いことと混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「システムの信頼性」和可靠性和性能混淆，尤其是把处理速度快误认为抗故障能力强。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 122,
              "pdfPageEnd": 127,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-03 システムの信頼性",
              "anchorTermsJa": [
                "システムの信頼性"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、システムの信頼性を単に「壊れにくい」という印象で固定せず、故障間隔、修理時間、稼働できる割合を別々に読むことが大切です。システムの信頼性に関する説明では、MTBF、MTTR、稼働率、冗長化構成が問われます。MTBF、MTTR、稼働率、冗長化の関係を根拠にすれば、似た選択肢が出ても、単なる処理性能ではなくシステムの信頼性を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「システムの信頼性」拆成故障前能运行多久、故障后多久恢复、整体可用率是多少，而不是只理解成“性能好”。题干可能给 MTBF、MTTR、冗余构成或可用率公式。只要抓住这些量之间的关系，再和处理速度、吞吐量等性能指标比较，就能知道当前条件到底指向「システムの信頼性」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "システムの信頼性の見分け方は、MTBF、MTTR、稼働率、冗長化の関係を文章中から拾い、信頼性と性能に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「システムの信頼性」的判断线索是MTBF、MTTR、可用率和冗余的关系，同时检查题干是否混入可靠性和性能的条件。",
          "commonMistakeJa": "システムの信頼性ではなく信頼性と性能の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「システムの信頼性」误选成可靠性和性能。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 122,
              "pdfPageEnd": 127,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-03 システムの信頼性",
              "anchorTermsJa": [
                "システムの信頼性"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "システムの信頼性",
          "termZh": "系统可靠性计算 (Availability)",
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
        "q-itpass-lesson-0032"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 122,
          "pdfPageEnd": 127,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-03 システムの信頼性",
          "anchorTermsJa": [
            "システムの信頼性"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-3-04",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "3-04",
      "titleJa": "3-04 システムの評価",
      "titleZh": "3-04 系统评估指标",
      "overviewJa": "システムの評価は、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 128-131ページの見出し語であるシステムの評価を手掛かりに、問題文では可用性、信頼性、性能、拡張性のどの観点かを確認します。集中処理・分散処理・冗長構成・性能評価指標との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「システムの評価」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分集中处理、分布处理、冗余构成和性能评价指标，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「システムの評価」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-04 系统评估指标”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "システムの評価を理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、システムの評価が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「システムの評価」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「システムの評価」の設問では、可用性、信頼性、性能、拡張性のどの観点かが最初の判断線です。選択肢に集中処理・分散処理・冗長構成・性能評価指標が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「システムの評価」相关题时，先抓题目关注可用性、可靠性、性能还是扩展性。如果选项同时出现集中处理、分布处理、冗余构成和性能评价指标，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「システムの評価」を集中処理・分散処理・冗長構成・性能評価指標と混同すると誤答します。特に稼働率向上策と処理性能向上策を混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「システムの評価」和集中处理、分布处理、冗余构成和性能评价指标混淆，尤其是把提高可用性的措施和提高处理性能的措施混淆。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 128,
              "pdfPageEnd": 131,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-04 システムの評価",
              "anchorTermsJa": [
                "システムの評価"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、システムの評価が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。システムの評価に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。可用性、信頼性、性能、拡張性のどの観点かを根拠にすれば、似た選択肢が出ても、集中処理・分散処理・冗長構成・性能評価指標ではなくシステムの評価を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「システムの評価」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住题目关注可用性、可靠性、性能还是扩展性，再和集中处理、分布处理、冗余构成和性能评价指标比较，就能知道当前条件到底指向「システムの評価」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "システムの評価の見分け方は、可用性、信頼性、性能、拡張性のどの観点かを文章中から拾い、集中処理・分散処理・冗長構成・性能評価指標に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「システムの評価」的判断线索是题目关注可用性、可靠性、性能还是扩展性，同时检查题干是否混入集中处理、分布处理、冗余构成和性能评价指标的条件。",
          "commonMistakeJa": "システムの評価ではなく集中処理・分散処理・冗長構成・性能評価指標の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「システムの評価」误选成集中处理、分布处理、冗余构成和性能评价指标。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 128,
              "pdfPageEnd": 131,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-04 システムの評価",
              "anchorTermsJa": [
                "システムの評価"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "システムの評価",
          "termZh": "系统评估指标",
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
        "q-itpass-lesson-0033"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 128,
          "pdfPageEnd": 131,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-04 システムの評価",
          "anchorTermsJa": [
            "システムの評価"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-3-05",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "3-05",
      "titleJa": "3-05 IoTシステムと組込みシステム",
      "titleZh": "3-05 IoT与嵌入式系统",
      "overviewJa": "IoTシステムと組込みシステムは、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 132-137ページの見出し語であるIoTシステムと組込みシステムを手掛かりに、問題文では可用性、信頼性、性能、拡張性のどの観点かを確認します。集中処理・分散処理・冗長構成・性能評価指標との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「IoTシステムと組込みシステム」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分集中处理、分布处理、冗余构成和性能评价指标，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「IoTシステムと組込みシステム」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-05 IoT与嵌入式系统”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "IoTシステムと組込みシステムを理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、IoTシステムと組込みシステムが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。IoTのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「IoTシステムと組込みシステム」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 IoT 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "IoT"
          ],
          "examFocusJa": "「IoTシステムと組込みシステム」の設問では、可用性、信頼性、性能、拡張性のどの観点かが最初の判断線です。選択肢に集中処理・分散処理・冗長構成・性能評価指標が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「IoTシステムと組込みシステム」相关题时，先抓题目关注可用性、可靠性、性能还是扩展性。如果选项同时出现集中处理、分布处理、冗余构成和性能评价指标，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「IoTシステムと組込みシステム」を集中処理・分散処理・冗長構成・性能評価指標と混同すると誤答します。特に稼働率向上策と処理性能向上策を混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「IoTシステムと組込みシステム」和集中处理、分布处理、冗余构成和性能评价指标混淆，尤其是把提高可用性的措施和提高处理性能的措施混淆。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 132,
              "pdfPageEnd": 137,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-05 IoTシステムと組込みシステム",
              "anchorTermsJa": [
                "IoTシステムと組込みシステム"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、IoTシステムと組込みシステムが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。IoTシステムと組込みシステムに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。可用性、信頼性、性能、拡張性のどの観点かを根拠にすれば、似た選択肢が出ても、集中処理・分散処理・冗長構成・性能評価指標ではなくIoTシステムと組込みシステムを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「IoTシステムと組込みシステム」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住题目关注可用性、可靠性、性能还是扩展性，再和集中处理、分布处理、冗余构成和性能评价指标比较，就能知道当前条件到底指向「IoTシステムと組込みシステム」还是另一个概念。",
          "englishTerms": [
            "IoT"
          ],
          "examFocusJa": "IoTシステムと組込みシステムの見分け方は、可用性、信頼性、性能、拡張性のどの観点かを文章中から拾い、集中処理・分散処理・冗長構成・性能評価指標に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「IoTシステムと組込みシステム」的判断线索是题目关注可用性、可靠性、性能还是扩展性，同时检查题干是否混入集中处理、分布处理、冗余构成和性能评价指标的条件。",
          "commonMistakeJa": "IoTシステムと組込みシステムではなく集中処理・分散処理・冗長構成・性能評価指標の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「IoTシステムと組込みシステム」误选成集中处理、分布处理、冗余构成和性能评价指标。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 132,
              "pdfPageEnd": 137,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-05 IoTシステムと組込みシステム",
              "anchorTermsJa": [
                "IoTシステムと組込みシステム"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "IoTシステムと組込みシステム",
          "termZh": "IoT与嵌入式系统",
          "english": "IoT"
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
        "q-itpass-lesson-0034"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 132,
          "pdfPageEnd": 137,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-05 IoTシステムと組込みシステム",
          "anchorTermsJa": [
            "IoTシステムと組込みシステム"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-3-06",
      "exam": "itpass",
      "chapterId": "itpass-ch03",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "3-06",
      "titleJa": "3-06 ソリューションビジネスとシステム活用促進",
      "titleZh": "3-06 IT解决方案与业务外包",
      "overviewJa": "ソリューションビジネスとシステム活用促進は、システム構成と信頼性の中でシステム形態、冗長化、評価指標、IoT活用の違いを判断するための重要単元です。PDF 138-141ページの見出し語であるソリューションビジネスとシステム活用促進を手掛かりに、問題文では可用性、信頼性、性能、拡張性のどの観点かを確認します。集中処理・分散処理・冗長構成・性能評価指標との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「ソリューションビジネスとシステム活用促進」建立可解题的理解路径。先看它在系统构成与可靠性中解决什么问题，再看把构成方式、故障行为、评价公式和使用场景对应起来。考试不会只问名称，通常会通过场景让你区分集中处理、分布处理、冗余构成和性能评价指标，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「ソリューションビジネスとシステム活用促進」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“3-06 IT解决方案与业务外包”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "ソリューションビジネスとシステム活用促進を理解する第一歩は、システム構成と信頼性における役割を具体的な処理の流れに置くことです。構成方式、障害時の振る舞い、評価式、利用場面を対応させることで、ソリューションビジネスとシステム活用促進が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「ソリューションビジネスとシステム活用促進」时，不要停在术语表面，而要把它放回系统构成与可靠性的处理链路里。也就是先确认对象，再确认把构成方式、故障行为、评价公式和使用场景对应起来。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「ソリューションビジネスとシステム活用促進」の設問では、可用性、信頼性、性能、拡張性のどの観点かが最初の判断線です。選択肢に集中処理・分散処理・冗長構成・性能評価指標が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「ソリューションビジネスとシステム活用促進」相关题时，先抓题目关注可用性、可靠性、性能还是扩展性。如果选项同时出现集中处理、分布处理、冗余构成和性能评价指标，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「ソリューションビジネスとシステム活用促進」を集中処理・分散処理・冗長構成・性能評価指標と混同すると誤答します。特に稼働率向上策と処理性能向上策を混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「ソリューションビジネスとシステム活用促進」和集中处理、分布处理、冗余构成和性能评价指标混淆，尤其是把提高可用性的措施和提高处理性能的措施混淆。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 138,
              "pdfPageEnd": 141,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-06 ソリューションビジネスとシステム活用促進",
              "anchorTermsJa": [
                "ソリューションビジネスとシステム活用促進"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、ソリューションビジネスとシステム活用促進が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。ソリューションビジネスとシステム活用促進に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。可用性、信頼性、性能、拡張性のどの観点かを根拠にすれば、似た選択肢が出ても、集中処理・分散処理・冗長構成・性能評価指標ではなくソリューションビジネスとシステム活用促進を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「ソリューションビジネスとシステム活用促進」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住题目关注可用性、可靠性、性能还是扩展性，再和集中处理、分布处理、冗余构成和性能评价指标比较，就能知道当前条件到底指向「ソリューションビジネスとシステム活用促進」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "ソリューションビジネスとシステム活用促進の見分け方は、可用性、信頼性、性能、拡張性のどの観点かを文章中から拾い、集中処理・分散処理・冗長構成・性能評価指標に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「ソリューションビジネスとシステム活用促進」的判断线索是题目关注可用性、可靠性、性能还是扩展性，同时检查题干是否混入集中处理、分布处理、冗余构成和性能评价指标的条件。",
          "commonMistakeJa": "ソリューションビジネスとシステム活用促進ではなく集中処理・分散処理・冗長構成・性能評価指標の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「ソリューションビジネスとシステム活用促進」误选成集中处理、分布处理、冗余构成和性能评价指标。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 138,
              "pdfPageEnd": 141,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "3-06 ソリューションビジネスとシステム活用促進",
              "anchorTermsJa": [
                "ソリューションビジネスとシステム活用促進"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ソリューションビジネスとシステム活用促進",
          "termZh": "IT解决方案与业务外包",
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
        "q-itpass-lesson-0035"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 138,
          "pdfPageEnd": 141,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "3-06 ソリューションビジネスとシステム活用促進",
          "anchorTermsJa": [
            "ソリューションビジネスとシステム活用促進"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
