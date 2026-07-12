module.exports = {
  "chapter": {
    "id": "itpass-ch02",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 2,
    "titleJa": "第2章 ソフトウェア［テクノロジ系］",
    "titleZh": "第2章 软件"
  },
  "units": [
    {
      "id": "itpass-2-01",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "2-01",
      "titleJa": "2-01 ソフトウェア",
      "titleZh": "2-01 软件与OS分类",
      "overviewJa": "ソフトウェアは、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 68-71ページの見出し語であるソフトウェアを手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「ソフトウェア」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「ソフトウェア」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-01 软件与OS分类”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "ソフトウェアを理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、ソフトウェアが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「ソフトウェア」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「ソフトウェア」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「ソフトウェア」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「ソフトウェア」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「ソフトウェア」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 68,
              "pdfPageEnd": 71,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-01 ソフトウェア",
              "anchorTermsJa": [
                "ソフトウェア"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、ソフトウェアが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。ソフトウェアに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなくソフトウェアを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「ソフトウェア」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「ソフトウェア」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "ソフトウェアの見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「ソフトウェア」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "ソフトウェアではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「ソフトウェア」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 68,
              "pdfPageEnd": 71,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-01 ソフトウェア",
              "anchorTermsJa": [
                "ソフトウェア"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ソフトウェア",
          "termZh": "软件与OS分类",
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
        "q-itpass-lesson-0022"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 68,
          "pdfPageEnd": 71,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-01 ソフトウェア",
          "anchorTermsJa": [
            "ソフトウェア"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-02",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "2-02",
      "titleJa": "2-02 ファイル管理",
      "titleZh": "2-02 文件管理与路径",
      "overviewJa": "ファイル管理は、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 72-77ページの見出し語であるファイル管理を手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「ファイル管理」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「ファイル管理」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-02 文件管理与路径”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "ファイル管理を理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、ファイル管理が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「ファイル管理」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「ファイル管理」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「ファイル管理」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「ファイル管理」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「ファイル管理」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 72,
              "pdfPageEnd": 77,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-02 ファイル管理",
              "anchorTermsJa": [
                "ファイル管理"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、ファイル管理が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。ファイル管理に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなくファイル管理を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「ファイル管理」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「ファイル管理」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "ファイル管理の見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「ファイル管理」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "ファイル管理ではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「ファイル管理」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 72,
              "pdfPageEnd": 77,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-02 ファイル管理",
              "anchorTermsJa": [
                "ファイル管理"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ファイル管理",
          "termZh": "文件管理与路径",
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
        "q-itpass-lesson-0023"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 72,
          "pdfPageEnd": 77,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-02 ファイル管理",
          "anchorTermsJa": [
            "ファイル管理"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-03",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "2-03",
      "titleJa": "2-03 ファイルのバックアップ",
      "titleZh": "2-03 文件备份方式",
      "overviewJa": "ファイルのバックアップは、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 78-81ページの見出し語であるファイルのバックアップを手掛かりに、問題文ではフル、差分、増分の復元手順と保存量を確認します。差分バックアップと増分バックアップとの境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「ファイルのバックアップ」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分差异备份和增量备份，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「ファイルのバックアップ」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-03 文件备份方式”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "ファイルのバックアップを理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、ファイルのバックアップが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Backupのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「ファイルのバックアップ」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Backup 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Backup"
          ],
          "examFocusJa": "「ファイルのバックアップ」の設問では、フル、差分、増分の復元手順と保存量が最初の判断線です。選択肢に差分バックアップと増分バックアップが並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「ファイルのバックアップ」相关题时，先抓完全、差异、增量备份的恢复步骤和保存量。如果选项同时出现差异备份和增量备份，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「ファイルのバックアップ」を差分バックアップと増分バックアップと混同すると誤答します。特に復元時に必要なバックアップ世代を取り違えると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「ファイルのバックアップ」和差异备份和增量备份混淆，尤其是混淆恢复时需要哪些备份版本。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 78,
              "pdfPageEnd": 81,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-03 ファイルのバックアップ",
              "anchorTermsJa": [
                "ファイルのバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、ファイルのバックアップが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。ファイルのバックアップに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。フル、差分、増分の復元手順と保存量を根拠にすれば、似た選択肢が出ても、差分バックアップと増分バックアップではなくファイルのバックアップを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「ファイルのバックアップ」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住完全、差异、增量备份的恢复步骤和保存量，再和差异备份和增量备份比较，就能知道当前条件到底指向「ファイルのバックアップ」还是另一个概念。",
          "englishTerms": [
            "Backup"
          ],
          "examFocusJa": "ファイルのバックアップの見分け方は、フル、差分、増分の復元手順と保存量を文章中から拾い、差分バックアップと増分バックアップに当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「ファイルのバックアップ」的判断线索是完全、差异、增量备份的恢复步骤和保存量，同时检查题干是否混入差异备份和增量备份的条件。",
          "commonMistakeJa": "ファイルのバックアップではなく差分バックアップと増分バックアップの説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「ファイルのバックアップ」误选成差异备份和增量备份。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 78,
              "pdfPageEnd": 81,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-03 ファイルのバックアップ",
              "anchorTermsJa": [
                "ファイルのバックアップ"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ファイルのバックアップ",
          "termZh": "文件备份方式",
          "english": "Backup"
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
        "q-itpass-lesson-0024"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 78,
          "pdfPageEnd": 81,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-03 ファイルのバックアップ",
          "anchorTermsJa": [
            "ファイルのバックアップ"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-04",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "2-04",
      "titleJa": "2-04 表計算（相対参照と絶対参照）",
      "titleZh": "2-04 表计算：相对引用与绝对引用",
      "overviewJa": "表計算（相対参照と絶対参照）は、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 82-89ページの見出し語である表計算・相対参照と絶対参照を手掛かりに、問題文ではコピー時に行番号・列番号が変わるか固定されるかを確認します。相対参照と絶対参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「表計算（相対参照と絶対参照）」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分相对引用和绝对引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「表計算（相対参照と絶対参照）」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-04 表计算：相对引用与绝对引用”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "表計算（相対参照と絶対参照）を理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、表計算・相対参照と絶対参照が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「表計算（相対参照と絶対参照）」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「表計算（相対参照と絶対参照）」の設問では、コピー時に行番号・列番号が変わるか固定されるかが最初の判断線です。選択肢に相対参照と絶対参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「表計算（相対参照と絶対参照）」相关题时，先抓复制公式时行列是否变化或固定。如果选项同时出现相对引用和绝对引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「表計算（相対参照と絶対参照）」を相対参照と絶対参照と混同すると誤答します。特に$が付く位置と固定される方向を逆に読むと、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「表計算（相対参照と絶対参照）」和相对引用和绝对引用混淆，尤其是把 `$` 的位置和固定方向读反。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 82,
              "pdfPageEnd": 89,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-04 表計算（相対参照と絶対参照）",
              "anchorTermsJa": [
                "表計算",
                "相対参照と絶対参照"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、表計算（相対参照と絶対参照）が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。表計算・相対参照と絶対参照に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。コピー時に行番号・列番号が変わるか固定されるかを根拠にすれば、似た選択肢が出ても、相対参照と絶対参照ではなく表計算（相対参照と絶対参照）を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「表計算（相対参照と絶対参照）」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住复制公式时行列是否变化或固定，再和相对引用和绝对引用比较，就能知道当前条件到底指向「表計算（相対参照と絶対参照）」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "表計算（相対参照と絶対参照）の見分け方は、コピー時に行番号・列番号が変わるか固定されるかを文章中から拾い、相対参照と絶対参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「表計算（相対参照と絶対参照）」的判断线索是复制公式时行列是否变化或固定，同时检查题干是否混入相对引用和绝对引用的条件。",
          "commonMistakeJa": "表計算（相対参照と絶対参照）ではなく相対参照と絶対参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「表計算（相対参照と絶対参照）」误选成相对引用和绝对引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 82,
              "pdfPageEnd": 89,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-04 表計算（相対参照と絶対参照）",
              "anchorTermsJa": [
                "表計算",
                "相対参照と絶対参照"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "表計算（相対参照と絶対参照）",
          "termZh": "表计算：相对引用与绝对引用",
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
        "q-itpass-lesson-0025"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 82,
          "pdfPageEnd": 89,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-04 表計算（相対参照と絶対参照）",
          "anchorTermsJa": [
            "表計算",
            "相対参照と絶対参照"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-05",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "2-05",
      "titleJa": "2-05 表計算（関数）",
      "titleZh": "2-05 表计算：基本函数",
      "overviewJa": "表計算（関数）は、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 90-93ページの見出し語である表計算・関数を手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「表計算（関数）」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「表計算（関数）」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-05 表计算：基本函数”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "表計算（関数）を理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、表計算・関数が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「表計算（関数）」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「表計算（関数）」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「表計算（関数）」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「表計算（関数）」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「表計算（関数）」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 90,
              "pdfPageEnd": 93,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-05 表計算（関数）",
              "anchorTermsJa": [
                "表計算",
                "関数"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、表計算（関数）が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。表計算・関数に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなく表計算（関数）を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「表計算（関数）」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「表計算（関数）」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "表計算（関数）の見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「表計算（関数）」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "表計算（関数）ではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「表計算（関数）」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 90,
              "pdfPageEnd": 93,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-05 表計算（関数）",
              "anchorTermsJa": [
                "表計算",
                "関数"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "表計算（関数）",
          "termZh": "表计算：基本函数",
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
        "q-itpass-lesson-0026"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 90,
          "pdfPageEnd": 93,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-05 表計算（関数）",
          "anchorTermsJa": [
            "表計算",
            "関数"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-06",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "2-06",
      "titleJa": "2-06 表計算（関数の応用）",
      "titleZh": "2-06 表计算：高级应用函数",
      "overviewJa": "表計算（関数の応用）は、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 94-99ページの見出し語である表計算・関数の応用を手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「表計算（関数の応用）」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「表計算（関数の応用）」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-06 表计算：高级应用函数”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "表計算（関数の応用）を理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、表計算・関数の応用が単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「表計算（関数の応用）」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「表計算（関数の応用）」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「表計算（関数の応用）」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「表計算（関数の応用）」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「表計算（関数の応用）」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 94,
              "pdfPageEnd": 99,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-06 表計算（関数の応用）",
              "anchorTermsJa": [
                "表計算",
                "関数の応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、表計算（関数の応用）が使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。表計算・関数の応用に関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなく表計算（関数の応用）を選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「表計算（関数の応用）」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「表計算（関数の応用）」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "表計算（関数の応用）の見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「表計算（関数の応用）」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "表計算（関数の応用）ではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「表計算（関数の応用）」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 94,
              "pdfPageEnd": 99,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-06 表計算（関数の応用）",
              "anchorTermsJa": [
                "表計算",
                "関数の応用"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "表計算（関数の応用）",
          "termZh": "表计算：高级应用函数",
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
        "q-itpass-lesson-0027"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 94,
          "pdfPageEnd": 99,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-06 表計算（関数の応用）",
          "anchorTermsJa": [
            "表計算",
            "関数の応用"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-07",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 7,
      "nativeSectionId": "2-07",
      "titleJa": "2-07 ユーザインタフェース",
      "titleZh": "2-07 用户界面 (UI/UX)",
      "overviewJa": "ユーザインタフェースは、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 100-103ページの見出し語であるユーザインタフェースを手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「ユーザインタフェース」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「ユーザインタフェース」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-07 用户界面 (UI/UX)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "ユーザインタフェースを理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、ユーザインタフェースが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「ユーザインタフェース」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「ユーザインタフェース」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「ユーザインタフェース」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「ユーザインタフェース」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「ユーザインタフェース」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 100,
              "pdfPageEnd": 103,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-07 ユーザインタフェース",
              "anchorTermsJa": [
                "ユーザインタフェース"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、ユーザインタフェースが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。ユーザインタフェースに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなくユーザインタフェースを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「ユーザインタフェース」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「ユーザインタフェース」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "ユーザインタフェースの見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「ユーザインタフェース」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "ユーザインタフェースではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「ユーザインタフェース」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 100,
              "pdfPageEnd": 103,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-07 ユーザインタフェース",
              "anchorTermsJa": [
                "ユーザインタフェース"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ユーザインタフェース",
          "termZh": "用户界面 (UI/UX)",
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
        "q-itpass-lesson-0028"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 100,
          "pdfPageEnd": 103,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-07 ユーザインタフェース",
          "anchorTermsJa": [
            "ユーザインタフェース"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-2-08",
      "exam": "itpass",
      "chapterId": "itpass-ch02",
      "topicId": "technology",
      "order": 8,
      "nativeSectionId": "2-08",
      "titleJa": "2-08 マルチメディア",
      "titleZh": "2-08 多媒体文件格式",
      "overviewJa": "マルチメディアは、ソフトウェアと表計算の中でOS、ファイル、表計算、利用者インタフェースの責任範囲を判断するための重要単元です。PDF 104-107ページの見出し語であるマルチメディアを手掛かりに、問題文では操作対象がファイル、セル、関数、画面のどれかを確認します。OS・アプリケーション・ファイルパス・セル参照との境界を押さえると、単なる用語暗記ではなく根拠を持って選択肢を切り分けられます。",
      "overviewZh": "本单元围绕「マルチメディア」建立可解题的理解路径。先看它在软件与电子表格中解决什么问题，再看依次确认保存位置、引用方式、函数参数和显示形式。考试不会只问名称，通常会通过场景让你区分OS、应用程序、文件路径和单元格引用，所以复习时要把判断线索和常见误读一起记住。",
      "learningGoalJa": "問題文の条件を読み取り、「マルチメディア」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“2-08 多媒体文件格式”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "試験で押さえる観点",
          "headingZh": "考试理解重点",
          "explanationJa": "マルチメディアを理解する第一歩は、ソフトウェアと表計算における役割を具体的な処理の流れに置くことです。データの保存場所、参照方法、関数の引数、表示形式を順に追うことで、マルチメディアが単独の暗記語ではなく、入力条件から結果を判断するための手掛かりになります。Information Technologyのような英語表現が出る場合も、略語だけではなく、どの対象に働き、どの指標や状態を変えるのかを結び付けて読む必要があります。",
          "explanationZh": "理解「マルチメディア」时，不要停在术语表面，而要把它放回软件与电子表格的处理链路里。也就是先确认对象，再确认依次确认保存位置、引用方式、函数参数和显示形式。如果题干出现 Information Technology 等英文术语，要判断它描述的是部件、流程、指标还是风险，这样才能和相邻概念分开。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "「マルチメディア」の設問では、操作対象がファイル、セル、関数、画面のどれかが最初の判断線です。選択肢にOS・アプリケーション・ファイルパス・セル参照が並んだら、対象・条件・結果の三点を照合します。",
          "examFocusZh": "看到「マルチメディア」相关题时，先抓操作对象是文件、单元格、函数还是界面。如果选项同时出现OS、应用程序、文件路径和单元格引用，就按对象、条件、结果三步排除。",
          "commonMistakeJa": "「マルチメディア」をOS・アプリケーション・ファイルパス・セル参照と混同すると誤答します。特に相対参照と絶対参照、又はOSとアプリを混同すると、問題文が示す条件ではなく語感だけで選ぶ形になりやすいです。",
          "commonMistakeZh": "常见错误是把「マルチメディア」和OS、应用程序、文件路径和单元格引用混淆，尤其是混淆相对引用和绝对引用，或把 OS 与应用程序混为一谈。不要按词面相似度选择，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 104,
              "pdfPageEnd": 107,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-08 マルチメディア",
              "anchorTermsJa": [
                "マルチメディア"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "用語と問題文の読み方",
          "headingZh": "术语与题干读法",
          "explanationJa": "試験対策では、マルチメディアが使われる場面を一つの例だけで固定せず、条件が変わったときに何が変わるかを見ることが大切です。マルチメディアに関する説明では、役割、分類、計算関係、又は管理上の責任が問われます。操作対象がファイル、セル、関数、画面のどれかを根拠にすれば、似た選択肢が出ても、OS・アプリケーション・ファイルパス・セル参照ではなくマルチメディアを選ぶべき場面を判断できます。",
          "explanationZh": "做题时要把「マルチメディア」当作一个判断模型，而不是孤立词条。题干可能换成业务场景、设备描述、计算关系或管理责任来问。只要抓住操作对象是文件、单元格、函数还是界面，再和OS、应用程序、文件路径和单元格引用比较，就能知道当前条件到底指向「マルチメディア」还是另一个概念。",
          "englishTerms": [
            "Information Technology"
          ],
          "examFocusJa": "マルチメディアの見分け方は、操作対象がファイル、セル、関数、画面のどれかを文章中から拾い、OS・アプリケーション・ファイルパス・セル参照に当てはまる条件が混ざっていないか確認することです。",
          "examFocusZh": "「マルチメディア」的判断线索是操作对象是文件、单元格、函数还是界面，同时检查题干是否混入OS、应用程序、文件路径和单元格引用的条件。",
          "commonMistakeJa": "マルチメディアではなくOS・アプリケーション・ファイルパス・セル参照の説明を選ぶ誤りに注意します。原因は、対象の違い、順序の違い、又は評価する指標の違いを読み落とすことです。",
          "commonMistakeZh": "不要把「マルチメディア」误选成OS、应用程序、文件路径和单元格引用。真正差别通常在对象、步骤顺序或评价指标上，漏读这些条件就会选错。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 104,
              "pdfPageEnd": 107,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "2-08 マルチメディア",
              "anchorTermsJa": [
                "マルチメディア"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "マルチメディア",
          "termZh": "多媒体文件格式",
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
        "q-itpass-lesson-0029"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 104,
          "pdfPageEnd": 107,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "2-08 マルチメディア",
          "anchorTermsJa": [
            "マルチメディア"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
