module.exports = {
  "chapter": {
    "id": "itpass-ch06",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 6,
    "titleJa": "第6章 データベース［テクノロジ系］",
    "titleZh": "第6章 数据库"
  },
  "units": [
    {
      "id": "itpass-6-01",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "6-01",
      "titleJa": "6-01 データベースとデータ操作",
      "titleZh": "6-01 数据库概念与SQL基础",
      "overviewJa": "データベースとデータ操作は、データベース分野で大量のデータを表として整理し、DBMSとSQLで検索、追加、更新、削除を一貫して扱うための単元です。PDF 240-247ページの「データベースとデータ操作」を定位語に、リレーショナルデータベースでは、表、行、列でデータを管理します。DBMSはデータの整合性、共有、障害回復、権限管理を担い、SQLはSELECT、INSERT、UPDATE、DELETEなどの操作を記述する言語です。試験では設問では「表」「行」「列」「DBMS」「SQL」「SELECT」「INSERT」「UPDATE」「DELETE」が判断語です。表計算ソフトや単純なファイル管理との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "数据库与数据操作用于把大量数据整理成表，通过 DBMS 和 SQL 统一执行查询、追加、更新、删除。本单元依据 PDF 240-247 页的「データベースとデータ操作」定位，重点理解：关系数据库用表、行、列管理数据。DBMS 负责一致性、共享、恢复和权限，SQL 用 SELECT、INSERT、UPDATE、DELETE 描述具体操作。考试常用表、行、列、DBMS、SQL、SELECT、INSERT、UPDATE、DELETE，是数据库操作题的关键词来换说法；同时要和电子表格或普通文件管理区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「データベースとデータ操作」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-01 数据库概念与SQL基础”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベースとデータ操作を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。リレーショナルデータベースでは、表、行、列でデータを管理します。DBMSはデータの整合性、共有、障害回復、権限管理を担い、SQLはSELECT、INSERT、UPDATE、DELETEなどの操作を記述する言語です。この関係を押さえると、データベースとデータ操作は単なる用語ではなく、大量のデータを表として整理し、DBMSとSQLで検索、追加、更新、削除を一貫して扱うための考え方として理解できます。英語表記ではDatabase、DBMS、SQL、SELECT、INSERT、UPDATE、DELETEが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习数据库与数据操作时，先不要背孤立名词，而要看它在场景中把大量数据整理成表，通过 DBMS 和 SQL 统一执行查询、追加、更新、删除。关系数据库用表、行、列管理数据。DBMS 负责一致性、共享、恢复和权限，SQL 用 SELECT、INSERT、UPDATE、DELETE 描述具体操作。这样复习时能把Database、DBMS、SQL、SELECT、INSERT、UPDATE、DELETE等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "Database",
            "DBMS",
            "SQL",
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
          ],
          "examFocusJa": "「データベースとデータ操作」の設問では、設問では「表」「行」「列」「DBMS」「SQL」「SELECT」「INSERT」「UPDATE」「DELETE」が判断語です。最初に対象、条件、結果を確認し、表計算ソフトや単純なファイル管理に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「データベースとデータ操作」相关题时，先抓表、行、列、DBMS、SQL、SELECT、INSERT、UPDATE、DELETE，是数据库操作题的关键词。再检查选项是否其实在描述电子表格或普通文件管理，用对象、条件、结果来排除。",
          "commonMistakeJa": "「データベースとデータ操作」を表計算ソフトや単純なファイル管理と混同すると誤答します。特にデータベースを単なるファイル置き場と考える、又はDBMSとSQLを同じものと考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「データベースとデータ操作」和电子表格或普通文件管理混淆，尤其是把数据库当成普通文件夹，或把 DBMS 和 SQL 当成同一个东西。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 240,
              "pdfPageEnd": 247,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-01 データベースとデータ操作",
              "anchorTermsJa": [
                "データベースとデータ操作"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、データベースとデータ操作という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「表」「行」「列」「DBMS」「SQL」「SELECT」「INSERT」「UPDATE」「DELETE」が判断語です。その語が出たら、まず大量のデータを表として整理し、DBMSとSQLで検索、追加、更新、削除を一貫して扱うという役割に合うかを確認します。合わない場合は、表計算ソフトや単純なファイル管理の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写数据库与数据操作这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。表、行、列、DBMS、SQL、SELECT、INSERT、UPDATE、DELETE，是数据库操作题的关键词。看到这些线索时，先判断是否符合“把大量数据整理成表，通过 DBMS 和 SQL 统一执行查询、追加、更新、删除”这个作用；如果不符合，就可能是在让你误选电子表格或普通文件管理。",
          "englishTerms": [
            "Database",
            "DBMS",
            "SQL",
            "SELECT",
            "INSERT",
            "UPDATE",
            "DELETE"
          ],
          "examFocusJa": "データベースとデータ操作の見分け方は、設問では「表」「行」「列」「DBMS」「SQL」「SELECT」「INSERT」「UPDATE」「DELETE」が判断語ですを文章中から拾い、表計算ソフトや単純なファイル管理ではなくデータベースとデータ操作を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库与数据操作的判断线索是表、行、列、DBMS、SQL、SELECT、INSERT、UPDATE、DELETE，是数据库操作题的关键词，同时确认题干要求的是否是数据库与数据操作，而不是电子表格或普通文件管理。",
          "commonMistakeJa": "データベースとデータ操作ではなく表計算ソフトや単純なファイル管理の説明を選ぶ誤りに注意します。原因は、データベースを単なるファイル置き場と考える、又はDBMSとSQLを同じものと考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベースとデータ操作」（数据库概念与SQL基础）和电子表格或普通文件管理混淆。错误通常来自把数据库当成普通文件夹，或把 DBMS 和 SQL 当成同一个东西，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 240,
              "pdfPageEnd": 247,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-01 データベースとデータ操作",
              "anchorTermsJa": [
                "データベースとデータ操作"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Database",
          "termZh": "Database",
          "english": "Database"
        },
        {
          "termJa": "DBMS",
          "termZh": "DBMS",
          "english": "DBMS"
        },
        {
          "termJa": "SQL",
          "termZh": "SQL",
          "english": "SQL"
        },
        {
          "termJa": "SELECT",
          "termZh": "SELECT",
          "english": "SELECT"
        },
        {
          "termJa": "INSERT",
          "termZh": "INSERT",
          "english": "INSERT"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベースとデータ操作と表計算ソフトや単純なファイル管理を混同する",
          "trapZh": "把数据库与数据操作和电子表格或普通文件管理混为一谈。"
        },
        {
          "trapJa": "データベースを単なるファイル置き場と考える、又はDBMSとSQLを同じものと考える",
          "trapZh": "把数据库当成普通文件夹，或把 DBMS 和 SQL 当成同一个东西"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0051"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 240,
          "pdfPageEnd": 247,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-01 データベースとデータ操作",
          "anchorTermsJa": [
            "データベースとデータ操作"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-6-02",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "6-02",
      "titleJa": "6-02 データベース設計",
      "titleZh": "6-02 数据库设计与ER模型 (E-R)",
      "overviewJa": "データベース設計は、データベース分野で業務で扱う対象、属性、関係を整理し、矛盾なく表へ落とし込める構造を作るための単元です。PDF 248-253ページの「データベース設計」を定位語に、E-R図では、実体、属性、関連を使って業務データの構造を表します。主キーは行を一意に識別し、外部キーは表同士の関係を保ちます。設計段階では、何を一つの実体として扱うか、どの属性をどの表に置くかを判断します。試験では設問では「E-R図」「実体」「属性」「関連」「主キー」「外部キー」「一意識別」が判断線です。データの正規化やSQL操作との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "数据库设计用于整理业务对象、属性和关系，形成能无矛盾转换为表结构的设计。本单元依据 PDF 248-253 页的「データベース設計」定位，重点理解：E-R 图用实体、属性、关系表示业务数据结构。主键唯一识别一行，外键维持表之间的关系。设计时要判断什么算一个实体，属性应该放在哪张表里。考试常用E-R 图、实体、属性、关系、主键、外键、唯一识别，是数据库设计题的线索来换说法；同时要和规范化或 SQL 操作区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「データベース設計」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-02 数据库设计与ER模型 (E-R)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データベース設計を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。E-R図では、実体、属性、関連を使って業務データの構造を表します。主キーは行を一意に識別し、外部キーは表同士の関係を保ちます。設計段階では、何を一つの実体として扱うか、どの属性をどの表に置くかを判断します。この関係を押さえると、データベース設計は単なる用語ではなく、業務で扱う対象、属性、関係を整理し、矛盾なく表へ落とし込める構造を作るための考え方として理解できます。英語表記ではER Diagram、Entity、Attribute、Primary Key、Foreign Key、Cardinalityが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习数据库设计时，先不要背孤立名词，而要看它在场景中整理业务对象、属性和关系，形成能无矛盾转换为表结构的设计。E-R 图用实体、属性、关系表示业务数据结构。主键唯一识别一行，外键维持表之间的关系。设计时要判断什么算一个实体，属性应该放在哪张表里。这样复习时能把ER Diagram、Entity、Attribute、Primary Key、Foreign Key、Cardinality等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "ER Diagram",
            "Entity",
            "Attribute",
            "Primary Key",
            "Foreign Key",
            "Cardinality"
          ],
          "examFocusJa": "「データベース設計」の設問では、設問では「E-R図」「実体」「属性」「関連」「主キー」「外部キー」「一意識別」が判断線です。最初に対象、条件、結果を確認し、データの正規化やSQL操作に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「データベース設計」相关题时，先抓E-R 图、实体、属性、关系、主键、外键、唯一识别，是数据库设计题的线索。再检查选项是否其实在描述规范化或 SQL 操作，用对象、条件、结果来排除。",
          "commonMistakeJa": "「データベース設計」をデータの正規化やSQL操作と混同すると誤答します。特に主キーを重複してよい項目と考える、又は外部キーを表内だけで完結する識別子と考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「データベース設計」和规范化或 SQL 操作混淆，尤其是误以为主键可以重复，或把外键当成只在本表内使用的标识。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 248,
              "pdfPageEnd": 253,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-02 データベース設計",
              "anchorTermsJa": [
                "データベース設計"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、データベース設計という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「E-R図」「実体」「属性」「関連」「主キー」「外部キー」「一意識別」が判断線です。その語が出たら、まず業務で扱う対象、属性、関係を整理し、矛盾なく表へ落とし込める構造を作るという役割に合うかを確認します。合わない場合は、データの正規化やSQL操作の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写数据库设计这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。E-R 图、实体、属性、关系、主键、外键、唯一识别，是数据库设计题的线索。看到这些线索时，先判断是否符合“整理业务对象、属性和关系，形成能无矛盾转换为表结构的设计”这个作用；如果不符合，就可能是在让你误选规范化或 SQL 操作。",
          "englishTerms": [
            "ER Diagram",
            "Entity",
            "Attribute",
            "Primary Key",
            "Foreign Key",
            "Cardinality"
          ],
          "examFocusJa": "データベース設計の見分け方は、設問では「E-R図」「実体」「属性」「関連」「主キー」「外部キー」「一意識別」が判断線ですを文章中から拾い、データの正規化やSQL操作ではなくデータベース設計を答えるべき条件かを確認することです。",
          "examFocusZh": "数据库设计的判断线索是E-R 图、实体、属性、关系、主键、外键、唯一识别，是数据库设计题的线索，同时确认题干要求的是否是数据库设计，而不是规范化或 SQL 操作。",
          "commonMistakeJa": "データベース設計ではなくデータの正規化やSQL操作の説明を選ぶ誤りに注意します。原因は、主キーを重複してよい項目と考える、又は外部キーを表内だけで完結する識別子と考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データベース設計」（数据库设计与ER模型 (E-R)）和规范化或 SQL 操作混淆。错误通常来自误以为主键可以重复，或把外键当成只在本表内使用的标识，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 248,
              "pdfPageEnd": 253,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-02 データベース設計",
              "anchorTermsJa": [
                "データベース設計"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ER Diagram",
          "termZh": "ER Diagram",
          "english": "ER Diagram"
        },
        {
          "termJa": "Entity",
          "termZh": "Entity",
          "english": "Entity"
        },
        {
          "termJa": "Attribute",
          "termZh": "Attribute",
          "english": "Attribute"
        },
        {
          "termJa": "Primary Key",
          "termZh": "Primary Key",
          "english": "Primary Key"
        },
        {
          "termJa": "Foreign Key",
          "termZh": "Foreign Key",
          "english": "Foreign Key"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データベース設計とデータの正規化やSQL操作を混同する",
          "trapZh": "把数据库设计和规范化或 SQL 操作混为一谈。"
        },
        {
          "trapJa": "主キーを重複してよい項目と考える、又は外部キーを表内だけで完結する識別子と考える",
          "trapZh": "误以为主键可以重复，或把外键当成只在本表内使用的标识"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0052"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 248,
          "pdfPageEnd": 253,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-02 データベース設計",
          "anchorTermsJa": [
            "データベース設計"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-6-03",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "6-03",
      "titleJa": "6-03 データの正規化",
      "titleZh": "6-03 数据库规范化 (Normalisation)",
      "overviewJa": "データの正規化は、データベース分野で重複や更新時の不整合を減らすため、関数従属性に基づいて表を適切に分割するための単元です。PDF 254-257ページの「データの正規化」を定位語に、正規化では、繰り返し項目をなくす、部分関数従属を分ける、推移的関数従属を分けるという流れで表を整理します。目的は表を細かくすること自体ではなく、追加、更新、削除時の矛盾を防ぐことです。試験では設問では「第1正規形」「第2正規形」「第3正規形」「関数従属性」「重複」「更新異常」が判断語です。データベース設計や検索SQLとの違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "数据规范化用于为了减少重复和更新异常，根据函数依赖把表适当地拆分。本单元依据 PDF 254-257 页的「データの正規化」定位，重点理解：规范化会消除重复组、拆分部分函数依赖、拆分传递函数依赖。目的不是把表越拆越碎，而是避免插入、更新、删除时发生不一致。考试常用第一范式、第二范式、第三范式、函数依赖、重复、更新异常，是规范化题的关键来换说法；同时要和数据库设计或查询 SQL区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「データの正規化」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-03 数据库规范化 (Normalisation)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データの正規化を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。正規化では、繰り返し項目をなくす、部分関数従属を分ける、推移的関数従属を分けるという流れで表を整理します。目的は表を細かくすること自体ではなく、追加、更新、削除時の矛盾を防ぐことです。この関係を押さえると、データの正規化は単なる用語ではなく、重複や更新時の不整合を減らすため、関数従属性に基づいて表を適切に分割するための考え方として理解できます。英語表記ではNormalization、1NF、2NF、3NF、Functional Dependency、Update Anomalyが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习数据规范化时，先不要背孤立名词，而要看它在场景中为了减少重复和更新异常，根据函数依赖把表适当地拆分。规范化会消除重复组、拆分部分函数依赖、拆分传递函数依赖。目的不是把表越拆越碎，而是避免插入、更新、删除时发生不一致。这样复习时能把Normalization、1NF、2NF、3NF、Functional Dependency、Update Anomaly等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "Normalization",
            "1NF",
            "2NF",
            "3NF",
            "Functional Dependency",
            "Update Anomaly"
          ],
          "examFocusJa": "「データの正規化」の設問では、設問では「第1正規形」「第2正規形」「第3正規形」「関数従属性」「重複」「更新異常」が判断語です。最初に対象、条件、結果を確認し、データベース設計や検索SQLに当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「データの正規化」相关题时，先抓第一范式、第二范式、第三范式、函数依赖、重复、更新异常，是规范化题的关键。再检查选项是否其实在描述数据库设计或查询 SQL，用对象、条件、结果来排除。",
          "commonMistakeJa": "「データの正規化」をデータベース設計や検索SQLと混同すると誤答します。特に正規化を検索速度を必ず上げる処理と考える、又は関連する列を無条件に別表へ分ける場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「データの正規化」和数据库设计或查询 SQL混淆，尤其是误以为规范化一定提高查询速度，或把相关列无条件拆成不同表。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 254,
              "pdfPageEnd": 257,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-03 データの正規化",
              "anchorTermsJa": [
                "データの正規化"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、データの正規化という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「第1正規形」「第2正規形」「第3正規形」「関数従属性」「重複」「更新異常」が判断語です。その語が出たら、まず重複や更新時の不整合を減らすため、関数従属性に基づいて表を適切に分割するという役割に合うかを確認します。合わない場合は、データベース設計や検索SQLの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写数据规范化这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。第一范式、第二范式、第三范式、函数依赖、重复、更新异常，是规范化题的关键。看到这些线索时，先判断是否符合“为了减少重复和更新异常，根据函数依赖把表适当地拆分”这个作用；如果不符合，就可能是在让你误选数据库设计或查询 SQL。",
          "englishTerms": [
            "Normalization",
            "1NF",
            "2NF",
            "3NF",
            "Functional Dependency",
            "Update Anomaly"
          ],
          "examFocusJa": "データの正規化の見分け方は、設問では「第1正規形」「第2正規形」「第3正規形」「関数従属性」「重複」「更新異常」が判断語ですを文章中から拾い、データベース設計や検索SQLではなくデータの正規化を答えるべき条件かを確認することです。",
          "examFocusZh": "数据规范化的判断线索是第一范式、第二范式、第三范式、函数依赖、重复、更新异常，是规范化题的关键，同时确认题干要求的是否是数据规范化，而不是数据库设计或查询 SQL。",
          "commonMistakeJa": "データの正規化ではなくデータベース設計や検索SQLの説明を選ぶ誤りに注意します。原因は、正規化を検索速度を必ず上げる処理と考える、又は関連する列を無条件に別表へ分けるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データの正規化」（数据库规范化 (Normalisation)）和数据库设计或查询 SQL混淆。错误通常来自误以为规范化一定提高查询速度，或把相关列无条件拆成不同表，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 254,
              "pdfPageEnd": 257,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-03 データの正規化",
              "anchorTermsJa": [
                "データの正規化"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Normalization",
          "termZh": "Normalization",
          "english": "Normalization"
        },
        {
          "termJa": "1NF",
          "termZh": "1NF",
          "english": "1NF"
        },
        {
          "termJa": "2NF",
          "termZh": "2NF",
          "english": "2NF"
        },
        {
          "termJa": "3NF",
          "termZh": "3NF",
          "english": "3NF"
        },
        {
          "termJa": "Functional Dependency",
          "termZh": "Functional Dependency",
          "english": "Functional Dependency"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データの正規化とデータベース設計や検索SQLを混同する",
          "trapZh": "把数据规范化和数据库设计或查询 SQL混为一谈。"
        },
        {
          "trapJa": "正規化を検索速度を必ず上げる処理と考える、又は関連する列を無条件に別表へ分ける",
          "trapZh": "误以为规范化一定提高查询速度，或把相关列无条件拆成不同表"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0053"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 254,
          "pdfPageEnd": 257,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-03 データの正規化",
          "anchorTermsJa": [
            "データの正規化"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-6-04",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 4,
      "nativeSectionId": "6-04",
      "titleJa": "6-04 データの抽出と論理演算",
      "titleZh": "6-04 数据过滤与逻辑运算 (WHERE)",
      "overviewJa": "データの抽出と論理演算は、データベース分野でSQLのWHERE句と論理演算を使い、条件に合う行だけを表から取り出すための単元です。PDF 258-263ページの「データの抽出と論理演算」を定位語に、SELECT文では、WHERE句に比較演算子、AND、OR、NOT、LIKEなどを組み合わせて抽出条件を表します。ANDは両方を満たす、ORはいずれかを満たす、NOTは条件を否定するため、集合の範囲として読むと誤りを防げます。試験では設問では「SELECT」「WHERE」「AND」「OR」「NOT」「比較演算子」「LIKE」「条件に一致」が判断線です。整列や集計のORDER BY、GROUP BYとの違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "数据抽取与逻辑运算用于用 SQL 的 WHERE 子句和逻辑运算，从表中取出符合条件的行。本单元依据 PDF 258-263 页的「データの抽出と論理演算」定位，重点理解：SELECT 中的 WHERE 可结合比较运算符、AND、OR、NOT、LIKE 表示抽取条件。AND 是同时满足，OR 是任一满足，NOT 是否定条件，把它看成集合范围更不容易错。考试常用SELECT、WHERE、AND、OR、NOT、比较运算符、LIKE、符合条件，是本单元的判断词来换说法；同时要和排序和分组聚合中的 ORDER BY、GROUP BY区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「データの抽出と論理演算」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-04 数据过滤与逻辑运算 (WHERE)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データの抽出と論理演算を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。SELECT文では、WHERE句に比較演算子、AND、OR、NOT、LIKEなどを組み合わせて抽出条件を表します。ANDは両方を満たす、ORはいずれかを満たす、NOTは条件を否定するため、集合の範囲として読むと誤りを防げます。この関係を押さえると、データの抽出と論理演算は単なる用語ではなく、SQLのWHERE句と論理演算を使い、条件に合う行だけを表から取り出すための考え方として理解できます。英語表記ではSQL、SELECT、WHERE、AND、OR、NOT、LIKEが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习数据抽取与逻辑运算时，先不要背孤立名词，而要看它在场景中用 SQL 的 WHERE 子句和逻辑运算，从表中取出符合条件的行。SELECT 中的 WHERE 可结合比较运算符、AND、OR、NOT、LIKE 表示抽取条件。AND 是同时满足，OR 是任一满足，NOT 是否定条件，把它看成集合范围更不容易错。这样复习时能把SQL、SELECT、WHERE、AND、OR、NOT、LIKE等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "SQL",
            "SELECT",
            "WHERE",
            "AND",
            "OR",
            "NOT",
            "LIKE"
          ],
          "examFocusJa": "「データの抽出と論理演算」の設問では、設問では「SELECT」「WHERE」「AND」「OR」「NOT」「比較演算子」「LIKE」「条件に一致」が判断線です。最初に対象、条件、結果を確認し、整列や集計のORDER BY、GROUP BYに当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「データの抽出と論理演算」相关题时，先抓SELECT、WHERE、AND、OR、NOT、比较运算符、LIKE、符合条件，是本单元的判断词。再检查选项是否其实在描述排序和分组聚合中的 ORDER BY、GROUP BY，用对象、条件、结果来排除。",
          "commonMistakeJa": "「データの抽出と論理演算」を整列や集計のORDER BY、GROUP BYと混同すると誤答します。特にANDとORの範囲を逆に読む、又は抽出条件を並べ替え条件と混同する場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「データの抽出と論理演算」和排序和分组聚合中的 ORDER BY、GROUP BY混淆，尤其是把 AND 和 OR 的范围读反，或把筛选条件和排序条件混淆。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 258,
              "pdfPageEnd": 263,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-04 データの抽出と論理演算",
              "anchorTermsJa": [
                "データの抽出と論理演算"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、データの抽出と論理演算という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「SELECT」「WHERE」「AND」「OR」「NOT」「比較演算子」「LIKE」「条件に一致」が判断線です。その語が出たら、まずSQLのWHERE句と論理演算を使い、条件に合う行だけを表から取り出すという役割に合うかを確認します。合わない場合は、整列や集計のORDER BY、GROUP BYの説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写数据抽取与逻辑运算这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。SELECT、WHERE、AND、OR、NOT、比较运算符、LIKE、符合条件，是本单元的判断词。看到这些线索时，先判断是否符合“用 SQL 的 WHERE 子句和逻辑运算，从表中取出符合条件的行”这个作用；如果不符合，就可能是在让你误选排序和分组聚合中的 ORDER BY、GROUP BY。",
          "englishTerms": [
            "SQL",
            "SELECT",
            "WHERE",
            "AND",
            "OR",
            "NOT",
            "LIKE"
          ],
          "examFocusJa": "データの抽出と論理演算の見分け方は、設問では「SELECT」「WHERE」「AND」「OR」「NOT」「比較演算子」「LIKE」「条件に一致」が判断線ですを文章中から拾い、整列や集計のORDER BY、GROUP BYではなくデータの抽出と論理演算を答えるべき条件かを確認することです。",
          "examFocusZh": "数据抽取与逻辑运算的判断线索是SELECT、WHERE、AND、OR、NOT、比较运算符、LIKE、符合条件，是本单元的判断词，同时确认题干要求的是否是数据抽取与逻辑运算，而不是排序和分组聚合中的 ORDER BY、GROUP BY。",
          "commonMistakeJa": "データの抽出と論理演算ではなく整列や集計のORDER BY、GROUP BYの説明を選ぶ誤りに注意します。原因は、ANDとORの範囲を逆に読む、又は抽出条件を並べ替え条件と混同するときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データの抽出と論理演算」（数据过滤与逻辑运算 (WHERE)）和排序和分组聚合中的 ORDER BY、GROUP BY混淆。错误通常来自把 AND 和 OR 的范围读反，或把筛选条件和排序条件混淆，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 258,
              "pdfPageEnd": 263,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-04 データの抽出と論理演算",
              "anchorTermsJa": [
                "データの抽出と論理演算"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "SQL",
          "termZh": "SQL",
          "english": "SQL"
        },
        {
          "termJa": "SELECT",
          "termZh": "SELECT",
          "english": "SELECT"
        },
        {
          "termJa": "WHERE",
          "termZh": "WHERE",
          "english": "WHERE"
        },
        {
          "termJa": "AND",
          "termZh": "AND",
          "english": "AND"
        },
        {
          "termJa": "OR",
          "termZh": "OR",
          "english": "OR"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データの抽出と論理演算と整列や集計のORDER BY、GROUP BYを混同する",
          "trapZh": "把数据抽取与逻辑运算和排序和分组聚合中的 ORDER BY、GROUP BY混为一谈。"
        },
        {
          "trapJa": "ANDとORの範囲を逆に読む、又は抽出条件を並べ替え条件と混同する",
          "trapZh": "把 AND 和 OR 的范围读反，或把筛选条件和排序条件混淆"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0054"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 258,
          "pdfPageEnd": 263,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-04 データの抽出と論理演算",
          "anchorTermsJa": [
            "データの抽出と論理演算"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-6-05",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 5,
      "nativeSectionId": "6-05",
      "titleJa": "6-05 データの整列と集計",
      "titleZh": "6-05 数据排序与分组聚合",
      "overviewJa": "データの整列と集計は、データベース分野でSQLで抽出した結果を並べ替え、グループごとに件数や合計などを集計するための単元です。PDF 264-267ページの「データの整列と集計」を定位語に、ORDER BYは結果の表示順を決め、GROUP BYは同じ値を持つ行をまとめ、COUNT、SUM、AVGなどの集計関数で値を計算します。WHEREは集計前の行を絞り込み、HAVINGは集計後のグループを絞り込む点を分けて覚えます。試験では設問では「ORDER BY」「昇順」「降順」「GROUP BY」「COUNT」「SUM」「AVG」「HAVING」が判断語です。WHERE句による単純な行抽出との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "数据排序与聚合用于用 SQL 对查询结果排序，并按组统计件数、合计、平均等聚合值。本单元依据 PDF 264-267 页的「データの整列と集計」定位，重点理解：ORDER BY 决定显示顺序，GROUP BY 把相同值的行分组，COUNT、SUM、AVG 计算聚合值。WHERE 筛选聚合前的行，HAVING 筛选聚合后的组，要分开记。考试常用ORDER BY、升序、降序、GROUP BY、COUNT、SUM、AVG、HAVING，是排序与聚合题的关键来换说法；同时要和WHERE 子句的单纯行筛选区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「データの整列と集計」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-05 数据排序与分组聚合”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "データの整列と集計を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。ORDER BYは結果の表示順を決め、GROUP BYは同じ値を持つ行をまとめ、COUNT、SUM、AVGなどの集計関数で値を計算します。WHEREは集計前の行を絞り込み、HAVINGは集計後のグループを絞り込む点を分けて覚えます。この関係を押さえると、データの整列と集計は単なる用語ではなく、SQLで抽出した結果を並べ替え、グループごとに件数や合計などを集計するための考え方として理解できます。英語表記ではORDER BY、GROUP BY、COUNT、SUM、AVG、HAVINGが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习数据排序与聚合时，先不要背孤立名词，而要看它在场景中用 SQL 对查询结果排序，并按组统计件数、合计、平均等聚合值。ORDER BY 决定显示顺序，GROUP BY 把相同值的行分组，COUNT、SUM、AVG 计算聚合值。WHERE 筛选聚合前的行，HAVING 筛选聚合后的组，要分开记。这样复习时能把ORDER BY、GROUP BY、COUNT、SUM、AVG、HAVING等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "ORDER BY",
            "GROUP BY",
            "COUNT",
            "SUM",
            "AVG",
            "HAVING"
          ],
          "examFocusJa": "「データの整列と集計」の設問では、設問では「ORDER BY」「昇順」「降順」「GROUP BY」「COUNT」「SUM」「AVG」「HAVING」が判断語です。最初に対象、条件、結果を確認し、WHERE句による単純な行抽出に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「データの整列と集計」相关题时，先抓ORDER BY、升序、降序、GROUP BY、COUNT、SUM、AVG、HAVING，是排序与聚合题的关键。再检查选项是否其实在描述WHERE 子句的单纯行筛选，用对象、条件、结果来排除。",
          "commonMistakeJa": "「データの整列と集計」をWHERE句による単純な行抽出と混同すると誤答します。特にGROUP BYを表示順の指定と考える、又はHAVINGとWHEREの適用タイミングを混同する場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「データの整列と集計」和WHERE 子句的单纯行筛选混淆，尤其是把 GROUP BY 当成排序，或混淆 HAVING 与 WHERE 的适用时机。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 264,
              "pdfPageEnd": 267,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-05 データの整列と集計",
              "anchorTermsJa": [
                "データの整列と集計"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、データの整列と集計という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「ORDER BY」「昇順」「降順」「GROUP BY」「COUNT」「SUM」「AVG」「HAVING」が判断語です。その語が出たら、まずSQLで抽出した結果を並べ替え、グループごとに件数や合計などを集計するという役割に合うかを確認します。合わない場合は、WHERE句による単純な行抽出の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写数据排序与聚合这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。ORDER BY、升序、降序、GROUP BY、COUNT、SUM、AVG、HAVING，是排序与聚合题的关键。看到这些线索时，先判断是否符合“用 SQL 对查询结果排序，并按组统计件数、合计、平均等聚合值”这个作用；如果不符合，就可能是在让你误选WHERE 子句的单纯行筛选。",
          "englishTerms": [
            "ORDER BY",
            "GROUP BY",
            "COUNT",
            "SUM",
            "AVG",
            "HAVING"
          ],
          "examFocusJa": "データの整列と集計の見分け方は、設問では「ORDER BY」「昇順」「降順」「GROUP BY」「COUNT」「SUM」「AVG」「HAVING」が判断語ですを文章中から拾い、WHERE句による単純な行抽出ではなくデータの整列と集計を答えるべき条件かを確認することです。",
          "examFocusZh": "数据排序与聚合的判断线索是ORDER BY、升序、降序、GROUP BY、COUNT、SUM、AVG、HAVING，是排序与聚合题的关键，同时确认题干要求的是否是数据排序与聚合，而不是WHERE 子句的单纯行筛选。",
          "commonMistakeJa": "データの整列と集計ではなくWHERE句による単純な行抽出の説明を選ぶ誤りに注意します。原因は、GROUP BYを表示順の指定と考える、又はHAVINGとWHEREの適用タイミングを混同するときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「データの整列と集計」（数据排序与分组聚合）和WHERE 子句的单纯行筛选混淆。错误通常来自把 GROUP BY 当成排序，或混淆 HAVING 与 WHERE 的适用时机，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 264,
              "pdfPageEnd": 267,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-05 データの整列と集計",
              "anchorTermsJa": [
                "データの整列と集計"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "ORDER BY",
          "termZh": "ORDER BY",
          "english": "ORDER BY"
        },
        {
          "termJa": "GROUP BY",
          "termZh": "GROUP BY",
          "english": "GROUP BY"
        },
        {
          "termJa": "COUNT",
          "termZh": "COUNT",
          "english": "COUNT"
        },
        {
          "termJa": "SUM",
          "termZh": "SUM",
          "english": "SUM"
        },
        {
          "termJa": "AVG",
          "termZh": "AVG",
          "english": "AVG"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "データの整列と集計とWHERE句による単純な行抽出を混同する",
          "trapZh": "把数据排序与聚合和WHERE 子句的单纯行筛选混为一谈。"
        },
        {
          "trapJa": "GROUP BYを表示順の指定と考える、又はHAVINGとWHEREの適用タイミングを混同する",
          "trapZh": "把 GROUP BY 当成排序，或混淆 HAVING 与 WHERE 的适用时机"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0055"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 264,
          "pdfPageEnd": 267,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-05 データの整列と集計",
          "anchorTermsJa": [
            "データの整列と集計"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-6-06",
      "exam": "itpass",
      "chapterId": "itpass-ch06",
      "topicId": "technology",
      "order": 6,
      "nativeSectionId": "6-06",
      "titleJa": "6-06 トランザクション処理",
      "titleZh": "6-06 事务处理与ACID特性 (ACID)",
      "overviewJa": "トランザクション処理は、データベース分野で複数の更新処理を一つのまとまりとして扱い、成功時は確定し、失敗時は元へ戻して整合性を守るための単元です。PDF 268-271ページの「トランザクション処理」を定位語に、トランザクションはACID特性で説明されます。原子性は全部実行か全部取消し、一貫性は整合した状態を保つこと、独立性は同時実行の影響を制御すること、永続性は確定後の結果を失わないことです。コミット、ロールバック、ロックを状況に応じて判断します。試験では設問では「ACID」「コミット」「ロールバック」「排他制御」「ロック」「同時実行」「整合性」が判断線です。バックアップや単純なSQL検索との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "事务处理用于把多个更新操作当作一个整体，成功时提交，失败时回滚，以保护数据一致性。本单元依据 PDF 268-271 页的「トランザクション処理」定位，重点理解：事务用 ACID 描述。原子性表示要么全做要么全取消，一致性保持正确状态，隔离性控制并发影响，持久性保证提交后不丢失。做题时要把 Commit、Rollback、Lock 放回失败和并发场景。考试常用ACID、Commit、Rollback、排他控制、锁、并发执行、一致性，是事务处理题的判断词来换说法；同时要和备份或单纯 SQL 查询区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「トランザクション処理」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“6-06 事务处理与ACID特性 (ACID)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "トランザクション処理を学ぶときは、まず「何を守る、つなぐ、処理する、又は整理する単元なのか」を具体的な流れで捉えます。トランザクションはACID特性で説明されます。原子性は全部実行か全部取消し、一貫性は整合した状態を保つこと、独立性は同時実行の影響を制御すること、永続性は確定後の結果を失わないことです。コミット、ロールバック、ロックを状況に応じて判断します。この関係を押さえると、トランザクション処理は単なる用語ではなく、複数の更新処理を一つのまとまりとして扱い、成功時は確定し、失敗時は元へ戻して整合性を守るための考え方として理解できます。英語表記ではTransaction、ACID、Commit、Rollback、Lock、Concurrency Controlが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习事务处理时，先不要背孤立名词，而要看它在场景中把多个更新操作当作一个整体，成功时提交，失败时回滚，以保护数据一致性。事务用 ACID 描述。原子性表示要么全做要么全取消，一致性保持正确状态，隔离性控制并发影响，持久性保证提交后不丢失。做题时要把 Commit、Rollback、Lock 放回失败和并发场景。这样复习时能把Transaction、ACID、Commit、Rollback、Lock、Concurrency Control等英文术语和具体作用对应起来，遇到题干换成图示、流程或业务条件时也能判断。",
          "englishTerms": [
            "Transaction",
            "ACID",
            "Commit",
            "Rollback",
            "Lock",
            "Concurrency Control"
          ],
          "examFocusJa": "「トランザクション処理」の設問では、設問では「ACID」「コミット」「ロールバック」「排他制御」「ロック」「同時実行」「整合性」が判断線です。最初に対象、条件、結果を確認し、バックアップや単純なSQL検索に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「トランザクション処理」相关题时，先抓ACID、Commit、Rollback、排他控制、锁、并发执行、一致性，是事务处理题的判断词。再检查选项是否其实在描述备份或单纯 SQL 查询，用对象、条件、结果来排除。",
          "commonMistakeJa": "「トランザクション処理」をバックアップや単純なSQL検索と混同すると誤答します。特にコミット前の処理を確定済みと考える、又はロールバックをバックアップからの復元と混同する場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「トランザクション処理」和备份或单纯 SQL 查询混淆，尤其是把提交前的处理当成已确定，或把 Rollback 和从备份恢复混淆。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 268,
              "pdfPageEnd": 271,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-06 トランザクション処理",
              "anchorTermsJa": [
                "トランザクション処理"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、トランザクション処理という見出しそのものではなく、具体的な利用条件、障害条件、入力条件、又は管理上の判断として出されることがあります。設問では「ACID」「コミット」「ロールバック」「排他制御」「ロック」「同時実行」「整合性」が判断線です。その語が出たら、まず複数の更新処理を一つのまとまりとして扱い、成功時は確定し、失敗時は元へ戻して整合性を守るという役割に合うかを確認します。合わない場合は、バックアップや単純なSQL検索の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写事务处理这个标题，可能换成使用条件、故障条件、输入条件或管理判断来问。ACID、Commit、Rollback、排他控制、锁、并发执行、一致性，是事务处理题的判断词。看到这些线索时，先判断是否符合“把多个更新操作当作一个整体，成功时提交，失败时回滚，以保护数据一致性”这个作用；如果不符合，就可能是在让你误选备份或单纯 SQL 查询。",
          "englishTerms": [
            "Transaction",
            "ACID",
            "Commit",
            "Rollback",
            "Lock",
            "Concurrency Control"
          ],
          "examFocusJa": "トランザクション処理の見分け方は、設問では「ACID」「コミット」「ロールバック」「排他制御」「ロック」「同時実行」「整合性」が判断線ですを文章中から拾い、バックアップや単純なSQL検索ではなくトランザクション処理を答えるべき条件かを確認することです。",
          "examFocusZh": "事务处理的判断线索是ACID、Commit、Rollback、排他控制、锁、并发执行、一致性，是事务处理题的判断词，同时确认题干要求的是否是事务处理，而不是备份或单纯 SQL 查询。",
          "commonMistakeJa": "トランザクション処理ではなくバックアップや単純なSQL検索の説明を選ぶ誤りに注意します。原因は、コミット前の処理を確定済みと考える、又はロールバックをバックアップからの復元と混同するときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「トランザクション処理」（事务处理与ACID特性 (ACID)）和备份或单纯 SQL 查询混淆。错误通常来自把提交前的处理当成已确定，或把 Rollback 和从备份恢复混淆，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 268,
              "pdfPageEnd": 271,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "6-06 トランザクション処理",
              "anchorTermsJa": [
                "トランザクション処理"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Transaction",
          "termZh": "Transaction",
          "english": "Transaction"
        },
        {
          "termJa": "ACID",
          "termZh": "ACID",
          "english": "ACID"
        },
        {
          "termJa": "Commit",
          "termZh": "Commit",
          "english": "Commit"
        },
        {
          "termJa": "Rollback",
          "termZh": "Rollback",
          "english": "Rollback"
        },
        {
          "termJa": "Lock",
          "termZh": "Lock",
          "english": "Lock"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "トランザクション処理とバックアップや単純なSQL検索を混同する",
          "trapZh": "把事务处理和备份或单纯 SQL 查询混为一谈。"
        },
        {
          "trapJa": "コミット前の処理を確定済みと考える、又はロールバックをバックアップからの復元と混同する",
          "trapZh": "把提交前的处理当成已确定，或把 Rollback 和从备份恢复混淆"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0056"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 268,
          "pdfPageEnd": 271,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "6-06 トランザクション処理",
          "anchorTermsJa": [
            "トランザクション処理"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
