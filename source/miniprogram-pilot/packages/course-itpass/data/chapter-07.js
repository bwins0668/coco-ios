module.exports = {
  "chapter": {
    "id": "itpass-ch07",
    "exam": "itpass",
    "sourceId": "itpass_r08_kayanoki",
    "order": 7,
    "titleJa": "第7章 アルゴリズムとプログラミング［テクノロジ系］",
    "titleZh": "第7章 算法与编程"
  },
  "units": [
    {
      "id": "itpass-7-01",
      "exam": "itpass",
      "chapterId": "itpass-ch07",
      "topicId": "technology",
      "order": 1,
      "nativeSectionId": "7-01",
      "titleJa": "7-01 アルゴリズムとデータ構造",
      "titleZh": "7-01 算法与数据结构",
      "overviewJa": "アルゴリズムとデータ構造は、アルゴリズム分野で目的の処理を有限の手順に分解し、配列、リスト、スタック、キューなどの構造でデータを扱うための単元です。PDF 276-285ページの「アルゴリズムとデータ構造」を定位語に、アルゴリズムは順次、分岐、反復を組み合わせて処理を表し、データ構造はデータの格納、取り出し、探索のしやすさを左右します。処理手順とデータの持ち方を同時に見ることで、計算結果だけでなく効率や誤処理も判断できます。試験では「順次」「分岐」「反復」「配列」「スタック」「キュー」「探索」「整列」が判断線です。擬似言語やプログラム言語との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "算法与数据结构用于把目标处理拆成有限步骤，并用数组、链表、栈、队列等结构管理数据。本单元依据 PDF 276-285 页的「アルゴリズムとデータ構造」定位，重点理解：算法由顺序、分支、循环组合而成，数据结构决定数据存放、取出和查找方式。把处理步骤和数据保存方式一起看，才能判断结果、效率和常见错误。考试常用顺序、分支、循环、数组、栈、队列、查找、排序，是判断线索来换说法；同时要和伪代码或编程语言区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「アルゴリズムとデータ構造」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-01 算法与数据结构”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "アルゴリズムとデータ構造を学ぶときは、まず対象、目的、判断条件を具体的な流れで捉えます。アルゴリズムは順次、分岐、反復を組み合わせて処理を表し、データ構造はデータの格納、取り出し、探索のしやすさを左右します。処理手順とデータの持ち方を同時に見ることで、計算結果だけでなく効率や誤処理も判断できます。この関係を押さえると、アルゴリズムとデータ構造は単なる用語ではなく、目的の処理を有限の手順に分解し、配列、リスト、スタック、キューなどの構造でデータを扱うための考え方として理解できます。英語表記ではAlgorithm、Array、List、Stack、Queue、Search、Sortが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习算法与数据结构时，先不要背孤立名词，而要看它在场景中把目标处理拆成有限步骤，并用数组、链表、栈、队列等结构管理数据。算法由顺序、分支、循环组合而成，数据结构决定数据存放、取出和查找方式。把处理步骤和数据保存方式一起看，才能判断结果、效率和常见错误。这样复习时能把Algorithm、Array、List、Stack、Queue、Search、Sort等英文术语和具体作用对应起来，遇到题干换成图示、流程、合同或经营条件时也能判断。",
          "englishTerms": [
            "Algorithm",
            "Array",
            "List",
            "Stack",
            "Queue",
            "Search",
            "Sort"
          ],
          "examFocusJa": "「アルゴリズムとデータ構造」の設問では、「順次」「分岐」「反復」「配列」「スタック」「キュー」「探索」「整列」が判断線です。最初に対象、条件、結果を確認し、擬似言語やプログラム言語に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「アルゴリズムとデータ構造」相关题时，先抓顺序、分支、循环、数组、栈、队列、查找、排序，是判断线索。再检查选项是否其实在描述伪代码或编程语言，用对象、条件、结果来排除。",
          "commonMistakeJa": "「アルゴリズムとデータ構造」を擬似言語やプログラム言語と混同すると誤答します。特にデータ構造の特性を無視して、処理手順だけで答える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「アルゴリズムとデータ構造」和伪代码或编程语言混淆，尤其是只看处理步骤，忽视数据结构本身的先进后出、先进先出等特性。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 276,
              "pdfPageEnd": 285,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-01 アルゴリズムとデータ構造",
              "anchorTermsJa": [
                "アルゴリズムとデータ構造"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、アルゴリズムとデータ構造という見出しそのものではなく、具体的な利用条件、計算条件、契約条件、又は管理上の判断として出されることがあります。「順次」「分岐」「反復」「配列」「スタック」「キュー」「探索」「整列」が判断線です。その語が出たら、まず目的の処理を有限の手順に分解し、配列、リスト、スタック、キューなどの構造でデータを扱うという役割に合うかを確認します。合わない場合は、擬似言語やプログラム言語の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写算法与数据结构这个标题，可能换成使用条件、计算条件、合同关系或管理判断来问。顺序、分支、循环、数组、栈、队列、查找、排序，是判断线索。看到这些线索时，先判断是否符合“把目标处理拆成有限步骤，并用数组、链表、栈、队列等结构管理数据”这个作用；如果不符合，就可能是在让你误选伪代码或编程语言。",
          "englishTerms": [
            "Algorithm",
            "Array",
            "List",
            "Stack",
            "Queue",
            "Search",
            "Sort"
          ],
          "examFocusJa": "アルゴリズムとデータ構造の見分け方は、「順次」「分岐」「反復」「配列」「スタック」「キュー」「探索」「整列」が判断線ですを文章中から拾い、擬似言語やプログラム言語ではなくアルゴリズムとデータ構造を答えるべき条件かを確認することです。",
          "examFocusZh": "算法与数据结构的判断线索是顺序、分支、循环、数组、栈、队列、查找、排序，是判断线索，同时确认题干要求的是否是「アルゴリズムとデータ構造」，而不是伪代码或编程语言。",
          "commonMistakeJa": "アルゴリズムとデータ構造ではなく擬似言語やプログラム言語の説明を選ぶ誤りに注意します。原因は、データ構造の特性を無視して、処理手順だけで答えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「アルゴリズムとデータ構造」（算法与数据结构）和伪代码或编程语言混淆。错误通常来自只看处理步骤，忽视数据结构本身的先进后出、先进先出等特性，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 276,
              "pdfPageEnd": 285,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-01 アルゴリズムとデータ構造",
              "anchorTermsJa": [
                "アルゴリズムとデータ構造"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Algorithm",
          "termZh": "Algorithm",
          "english": "Algorithm"
        },
        {
          "termJa": "Array",
          "termZh": "Array",
          "english": "Array"
        },
        {
          "termJa": "List",
          "termZh": "List",
          "english": "List"
        },
        {
          "termJa": "Stack",
          "termZh": "Stack",
          "english": "Stack"
        },
        {
          "termJa": "Queue",
          "termZh": "Queue",
          "english": "Queue"
        },
        {
          "termJa": "Search",
          "termZh": "Search",
          "english": "Search"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "アルゴリズムとデータ構造と擬似言語やプログラム言語を混同する",
          "trapZh": "把算法与数据结构和伪代码或编程语言混为一谈。"
        },
        {
          "trapJa": "データ構造の特性を無視して、処理手順だけで答える",
          "trapZh": "只看处理步骤，忽视数据结构本身的先进后出、先进先出等特性"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0057"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 276,
          "pdfPageEnd": 285,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-01 アルゴリズムとデータ構造",
          "anchorTermsJa": [
            "アルゴリズムとデータ構造"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-7-02",
      "exam": "itpass",
      "chapterId": "itpass-ch07",
      "topicId": "technology",
      "order": 2,
      "nativeSectionId": "7-02",
      "titleJa": "7-02 擬似言語",
      "titleZh": "7-02 伪代码逻辑分析",
      "overviewJa": "擬似言語は、アルゴリズム分野で特定のプログラミング言語に依存せず、変数、代入、条件分岐、繰返しで処理内容を読み取るための単元です。PDF 286-299ページの「擬似言語」を定位語に、擬似言語では、変数の値がいつ更新されるか、ループが何回実行されるか、配列の添字がどこを指すかを追跡します。文法暗記よりも、各行の実行順序と条件成立時の値の変化を表で確認することが重要です。試験では「代入」「条件分岐」「繰返し」「添字」「初期値」「終了条件」が判断線です。自然文の説明や実在するプログラム言語の仕様との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "伪代码用于不依赖具体编程语言，用变量、赋值、条件分支和循环读出处理内容。本单元依据 PDF 286-299 页的「擬似言語」定位，重点理解：读伪代码时要跟踪变量何时更新、循环执行几次、数组下标指向哪里。关键不是背某种语法，而是按执行顺序记录条件成立时各变量如何变化。考试常用赋值、条件分支、循环、下标、初始值、结束条件，是伪代码题的线索来换说法；同时要和自然语言说明或具体编程语言语法区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「擬似言語」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-02 伪代码逻辑分析”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "擬似言語を学ぶときは、まず対象、目的、判断条件を具体的な流れで捉えます。擬似言語では、変数の値がいつ更新されるか、ループが何回実行されるか、配列の添字がどこを指すかを追跡します。文法暗記よりも、各行の実行順序と条件成立時の値の変化を表で確認することが重要です。この関係を押さえると、擬似言語は単なる用語ではなく、特定のプログラミング言語に依存せず、変数、代入、条件分岐、繰返しで処理内容を読み取るための考え方として理解できます。英語表記ではPseudo Code、Variable、Assignment、Loop、Array Index、Conditionが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习伪代码时，先不要背孤立名词，而要看它在场景中不依赖具体编程语言，用变量、赋值、条件分支和循环读出处理内容。读伪代码时要跟踪变量何时更新、循环执行几次、数组下标指向哪里。关键不是背某种语法，而是按执行顺序记录条件成立时各变量如何变化。这样复习时能把Pseudo Code、Variable、Assignment、Loop、Array Index、Condition等英文术语和具体作用对应起来，遇到题干换成图示、流程、合同或经营条件时也能判断。",
          "englishTerms": [
            "Pseudo Code",
            "Variable",
            "Assignment",
            "Loop",
            "Array Index",
            "Condition"
          ],
          "examFocusJa": "「擬似言語」の設問では、「代入」「条件分岐」「繰返し」「添字」「初期値」「終了条件」が判断線です。最初に対象、条件、結果を確認し、自然文の説明や実在するプログラム言語の仕様に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「擬似言語」相关题时，先抓赋值、条件分支、循环、下标、初始值、结束条件，是伪代码题的线索。再检查选项是否其实在描述自然语言说明或具体编程语言语法，用对象、条件、结果来排除。",
          "commonMistakeJa": "「擬似言語」を自然文の説明や実在するプログラム言語の仕様と混同すると誤答します。特に代入と比較を混同し、ループの終了条件を一回多く又は少なく数える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「擬似言語」和自然语言说明或具体编程语言语法混淆，尤其是把赋值和比较混淆，导致循环终止条件多算或少算一次。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 286,
              "pdfPageEnd": 299,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-02 擬似言語",
              "anchorTermsJa": [
                "擬似言語"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、擬似言語という見出しそのものではなく、具体的な利用条件、計算条件、契約条件、又は管理上の判断として出されることがあります。「代入」「条件分岐」「繰返し」「添字」「初期値」「終了条件」が判断線です。その語が出たら、まず特定のプログラミング言語に依存せず、変数、代入、条件分岐、繰返しで処理内容を読み取るという役割に合うかを確認します。合わない場合は、自然文の説明や実在するプログラム言語の仕様の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写伪代码这个标题，可能换成使用条件、计算条件、合同关系或管理判断来问。赋值、条件分支、循环、下标、初始值、结束条件，是伪代码题的线索。看到这些线索时，先判断是否符合“不依赖具体编程语言，用变量、赋值、条件分支和循环读出处理内容”这个作用；如果不符合，就可能是在让你误选自然语言说明或具体编程语言语法。",
          "englishTerms": [
            "Pseudo Code",
            "Variable",
            "Assignment",
            "Loop",
            "Array Index",
            "Condition"
          ],
          "examFocusJa": "擬似言語の見分け方は、「代入」「条件分岐」「繰返し」「添字」「初期値」「終了条件」が判断線ですを文章中から拾い、自然文の説明や実在するプログラム言語の仕様ではなく擬似言語を答えるべき条件かを確認することです。",
          "examFocusZh": "伪代码的判断线索是赋值、条件分支、循环、下标、初始值、结束条件，是伪代码题的线索，同时确认题干要求的是否是「擬似言語」，而不是自然语言说明或具体编程语言语法。",
          "commonMistakeJa": "擬似言語ではなく自然文の説明や実在するプログラム言語の仕様の説明を選ぶ誤りに注意します。原因は、代入と比較を混同し、ループの終了条件を一回多く又は少なく数えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「擬似言語」（伪代码）和自然语言说明或具体编程语言语法混淆。错误通常来自把赋值和比较混淆，导致循环终止条件多算或少算一次，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 286,
              "pdfPageEnd": 299,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-02 擬似言語",
              "anchorTermsJa": [
                "擬似言語"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Pseudo Code",
          "termZh": "Pseudo Code",
          "english": "Pseudo Code"
        },
        {
          "termJa": "Variable",
          "termZh": "Variable",
          "english": "Variable"
        },
        {
          "termJa": "Assignment",
          "termZh": "Assignment",
          "english": "Assignment"
        },
        {
          "termJa": "Loop",
          "termZh": "Loop",
          "english": "Loop"
        },
        {
          "termJa": "Array Index",
          "termZh": "Array Index",
          "english": "Array Index"
        },
        {
          "termJa": "Condition",
          "termZh": "Condition",
          "english": "Condition"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "擬似言語と自然文の説明や実在するプログラム言語の仕様を混同する",
          "trapZh": "把伪代码和自然语言说明或具体编程语言语法混为一谈。"
        },
        {
          "trapJa": "代入と比較を混同し、ループの終了条件を一回多く又は少なく数える",
          "trapZh": "把赋值和比较混淆，导致循环终止条件多算或少算一次"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0058"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 286,
          "pdfPageEnd": 299,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-02 擬似言語",
          "anchorTermsJa": [
            "擬似言語"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    },
    {
      "id": "itpass-7-03",
      "exam": "itpass",
      "chapterId": "itpass-ch07",
      "topicId": "technology",
      "order": 3,
      "nativeSectionId": "7-03",
      "titleJa": "7-03 プログラム言語とマークアップ言語",
      "titleZh": "7-03 编程语言与标记语言 (HTML/XML)",
      "overviewJa": "プログラム言語とマークアップ言語は、アルゴリズム分野で処理手順を書く言語と、文書構造や意味付けを書くマークアップ言語の違いを判断するための単元です。PDF 300-303ページの「プログラム言語とマークアップ言語」を定位語に、プログラム言語は計算や制御を記述し、コンパイラやインタプリタで実行されます。HTMLやXMLなどのマークアップ言語は、タグで文書の構造やデータの意味を表します。実行して処理するのか、構造を表すのかを分けて読むことが重要です。試験では「コンパイラ」「インタプリタ」「HTML」「XML」「タグ」「文書構造」が判断線です。Webページの通信手順や擬似言語との違いを押さえると、暗記語ではなく条件から選択肢を切り分けられます。",
      "overviewZh": "编程语言与标记语言用于区分用于写处理步骤的编程语言，以及用于标记文档结构和含义的标记语言。本单元依据 PDF 300-303 页的「プログラム言語とマークアップ言語」定位，重点理解：编程语言描述计算和控制流程，通过编译器或解释器执行。HTML、XML 等标记语言用标签表示文档结构或数据含义。题目要看是在“执行处理”还是“表示结构”。考试常用编译器、解释器、HTML、XML、标签、文档结构，是本单元线索来换说法；同时要和网页通信协议或伪代码区分，避免只按词面选答案。",
      "learningGoalJa": "問題文の条件を読み取り、「プログラム言語とマークアップ言語」に関する選択肢を根拠を持って判定できるようにする。",
      "learningGoalZh": "能根据题干条件判断“7-03 编程语言与标记语言 (HTML/XML)”相关选项，并说清楚判断依据。",
      "sections": [
        {
          "headingJa": "仕組みと役割",
          "headingZh": "机制与作用",
          "explanationJa": "プログラム言語とマークアップ言語を学ぶときは、まず対象、目的、判断条件を具体的な流れで捉えます。プログラム言語は計算や制御を記述し、コンパイラやインタプリタで実行されます。HTMLやXMLなどのマークアップ言語は、タグで文書の構造やデータの意味を表します。実行して処理するのか、構造を表すのかを分けて読むことが重要です。この関係を押さえると、プログラム言語とマークアップ言語は単なる用語ではなく、処理手順を書く言語と、文書構造や意味付けを書くマークアップ言語の違いを判断するための考え方として理解できます。英語表記ではCompiler、Interpreter、HTML、XML、Markup Language、Tagが出やすいため、略語と役割を結び付けて読むことが重要です。",
          "explanationZh": "学习编程语言与标记语言时，先不要背孤立名词，而要看它在场景中区分用于写处理步骤的编程语言，以及用于标记文档结构和含义的标记语言。编程语言描述计算和控制流程，通过编译器或解释器执行。HTML、XML 等标记语言用标签表示文档结构或数据含义。题目要看是在“执行处理”还是“表示结构”。这样复习时能把Compiler、Interpreter、HTML、XML、Markup Language、Tag等英文术语和具体作用对应起来，遇到题干换成图示、流程、合同或经营条件时也能判断。",
          "englishTerms": [
            "Compiler",
            "Interpreter",
            "HTML",
            "XML",
            "Markup Language",
            "Tag"
          ],
          "examFocusJa": "「プログラム言語とマークアップ言語」の設問では、「コンパイラ」「インタプリタ」「HTML」「XML」「タグ」「文書構造」が判断線です。最初に対象、条件、結果を確認し、Webページの通信手順や擬似言語に当てはまる説明が混ざっていないかを見ることが判断線です。",
          "examFocusZh": "看到「プログラム言語とマークアップ言語」相关题时，先抓编译器、解释器、HTML、XML、标签、文档结构，是本单元线索。再检查选项是否其实在描述网页通信协议或伪代码，用对象、条件、结果来排除。",
          "commonMistakeJa": "「プログラム言語とマークアップ言語」をWebページの通信手順や擬似言語と混同すると誤答します。特にHTMLを汎用の処理手順を書くプログラム言語と考える場合、問題文の条件ではなく近い語感だけで選んでしまいます。",
          "commonMistakeZh": "常见错误是把「プログラム言語とマークアップ言語」和网页通信协议或伪代码混淆，尤其是把 HTML 当成能描述通用处理流程的编程语言。不要按词面相似度选，要回到题干条件。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 300,
              "pdfPageEnd": 303,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-03 プログラム言語とマークアップ言語",
              "anchorTermsJa": [
                "プログラム言語とマークアップ言語"
              ],
              "verificationStatus": "verified"
            }
          ]
        },
        {
          "headingJa": "設問での切り分け",
          "headingZh": "题目中的区分方法",
          "explanationJa": "試験問題では、プログラム言語とマークアップ言語という見出しそのものではなく、具体的な利用条件、計算条件、契約条件、又は管理上の判断として出されることがあります。「コンパイラ」「インタプリタ」「HTML」「XML」「タグ」「文書構造」が判断線です。その語が出たら、まず処理手順を書く言語と、文書構造や意味付けを書くマークアップ言語の違いを判断するという役割に合うかを確認します。合わない場合は、Webページの通信手順や擬似言語の説明を選ばせるひっかけである可能性があります。",
          "explanationZh": "考试不一定直接写编程语言与标记语言这个标题，可能换成使用条件、计算条件、合同关系或管理判断来问。编译器、解释器、HTML、XML、标签、文档结构，是本单元线索。看到这些线索时，先判断是否符合“区分用于写处理步骤的编程语言，以及用于标记文档结构和含义的标记语言”这个作用；如果不符合，就可能是在让你误选网页通信协议或伪代码。",
          "englishTerms": [
            "Compiler",
            "Interpreter",
            "HTML",
            "XML",
            "Markup Language",
            "Tag"
          ],
          "examFocusJa": "プログラム言語とマークアップ言語の見分け方は、「コンパイラ」「インタプリタ」「HTML」「XML」「タグ」「文書構造」が判断線ですを文章中から拾い、Webページの通信手順や擬似言語ではなくプログラム言語とマークアップ言語を答えるべき条件かを確認することです。",
          "examFocusZh": "编程语言与标记语言的判断线索是编译器、解释器、HTML、XML、标签、文档结构，是本单元线索，同时确认题干要求的是否是「プログラム言語とマークアップ言語」，而不是网页通信协议或伪代码。",
          "commonMistakeJa": "プログラム言語とマークアップ言語ではなくWebページの通信手順や擬似言語の説明を選ぶ誤りに注意します。原因は、HTMLを汎用の処理手順を書くプログラム言語と考えるときに、目的、対象、操作タイミングの違いを読み落とすことです。",
          "commonMistakeZh": "不要误把「プログラム言語とマークアップ言語」（编程语言与标记语言）和网页通信协议或伪代码混淆。错误通常来自把 HTML 当成能描述通用处理流程的编程语言，本质是漏读目的、对象或操作时机的差别。",
          "sourceRefs": [
            {
              "sourceId": "itpass_r08_kayanoki",
              "pdfPageStart": 300,
              "pdfPageEnd": 303,
              "printedPageStart": null,
              "printedPageEnd": null,
              "headingJa": "7-03 プログラム言語とマークアップ言語",
              "anchorTermsJa": [
                "プログラム言語とマークアップ言語"
              ],
              "verificationStatus": "verified"
            }
          ]
        }
      ],
      "keyTerms": [
        {
          "termJa": "Compiler",
          "termZh": "Compiler",
          "english": "Compiler"
        },
        {
          "termJa": "Interpreter",
          "termZh": "Interpreter",
          "english": "Interpreter"
        },
        {
          "termJa": "HTML",
          "termZh": "HTML",
          "english": "HTML"
        },
        {
          "termJa": "XML",
          "termZh": "XML",
          "english": "XML"
        },
        {
          "termJa": "Markup Language",
          "termZh": "Markup Language",
          "english": "Markup Language"
        },
        {
          "termJa": "Tag",
          "termZh": "Tag",
          "english": "Tag"
        }
      ],
      "commonTraps": [
        {
          "trapJa": "プログラム言語とマークアップ言語とWebページの通信手順や擬似言語を混同する",
          "trapZh": "把编程语言与标记语言和网页通信协议或伪代码混为一谈。"
        },
        {
          "trapJa": "HTMLを汎用の処理手順を書くプログラム言語と考える",
          "trapZh": "把 HTML 当成能描述通用处理流程的编程语言"
        }
      ],
      "relatedQuestionIds": [
        "q-itpass-lesson-0059"
      ],
      "practiceStatus": "has_existing_course_question",
      "sourceRefs": [
        {
          "sourceId": "itpass_r08_kayanoki",
          "pdfPageStart": 300,
          "pdfPageEnd": 303,
          "printedPageStart": null,
          "printedPageEnd": null,
          "headingJa": "7-03 プログラム言語とマークアップ言語",
          "anchorTermsJa": [
            "プログラム言語とマークアップ言語"
          ],
          "verificationStatus": "verified"
        }
      ],
      "sourceStatus": "verified",
      "translationStatus": "reviewed"
    }
  ]
};
