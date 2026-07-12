module.exports = {
  "chapter": {
    "chapterId": "java-ch17",
    "chapterOrder": 17,
    "sourceId": "java_practice_tsukuba",
    "sourceChapterId": "practice-ch09",
    "sourceChapter": "第9章 グラフィックスとマウスイベント",
    "title": {
      "ja": "第9章 グラフィックスとマウスイベント",
      "zh": "第9章 图形とマウス事件"
    },
    "pageStart": 148,
    "pageEnd": 156,
    "shard": "java-ch17.js",
    "sections": [
      {
        "sectionId": "practice-ch09-s001",
        "lessonId": "practice-ch09-lesson-001",
        "order": 1,
        "title": {
          "ja": "import java.awt.*;",
          "zh": "import java.awt.*;"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "import java.awt.*;",
          "pageStart": 149,
          "pageEnd": 149
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s002",
        "lessonId": "practice-ch09-lesson-002",
        "order": 2,
        "title": {
          "ja": "Graphiscオブジェクトの座標系",
          "zh": "Graphisc对象の坐标系"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "Graphiscオブジェクトの座標系",
          "pageStart": 150,
          "pageEnd": 150
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s003",
        "lessonId": "practice-ch09-lesson-003",
        "order": 3,
        "title": {
          "ja": "直線の描画",
          "zh": "直线の绘制"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "直線の描画",
          "pageStart": 151,
          "pageEnd": 151
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s004",
        "lessonId": "practice-ch09-lesson-004",
        "order": 4,
        "title": {
          "ja": "様々な描画メソッド",
          "zh": "様々な绘制方法"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "様々な描画メソッド",
          "pageStart": 152,
          "pageEnd": 152
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s005",
        "lessonId": "practice-ch09-lesson-005",
        "order": 5,
        "title": {
          "ja": "Graphics2Dクラス",
          "zh": "Graphics2D类"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "Graphics2Dクラス",
          "pageStart": 153,
          "pageEnd": 153
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s006",
        "lessonId": "practice-ch09-lesson-006",
        "order": 6,
        "title": {
          "ja": "マウスイベント",
          "zh": "鼠标事件"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "マウスイベント",
          "pageStart": 154,
          "pageEnd": 154
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s007",
        "lessonId": "practice-ch09-lesson-007",
        "order": 7,
        "title": {
          "ja": "2つのイベントリスナ",
          "zh": "2つの事件监听器"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "2つのイベントリスナ",
          "pageStart": 155,
          "pageEnd": 155
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch09-s008",
        "lessonId": "practice-ch09-lesson-008",
        "order": 8,
        "title": {
          "ja": "import java.awt.event.*;",
          "zh": "import java.awt.event.*;"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第9章 グラフィックスとマウスイベント",
          "section": "import java.awt.event.*;",
          "pageStart": 156,
          "pageEnd": 156
        },
        "runnableExampleCount": 1
      }
    ]
  },
  "lessons": [
    {
      "lessonId": "practice-ch09-lesson-001",
      "chapterId": "java-ch17",
      "order": 1,
      "title": {
        "ja": "import java.awt.*;",
        "zh": "import java.awt.*;"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "import java.awt.*;",
        "pageStart": 149,
        "pageEnd": 149
      },
      "objectives": [
        {
          "ja": "「import java.awt.*;」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“import java.awt.*;”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-001",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材149ページ「import java.awt.*;」: 教材149ページの「import java.awt.*;」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 149 页“import java.awt.*;”：教材第 149 页的“import java.awt.*;”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-001",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材149ページ「import java.awt.*;」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 149 页“import java.awt.*;”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-001",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材149ページ「import java.awt.*;」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「import java.awt.*;」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 149 页“import java.awt.*;”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“import java.awt.*;”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-001",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材149ページ「import java.awt.*;」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=20 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 149 页“import java.awt.*;”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=20，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-001",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材149ページ「import java.awt.*;」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 149 页“import java.awt.*;”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「import java.awt.*;」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“import java.awt.*;”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s001-example-01",
          "className": "JavaR7C17S001",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S001 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(20, 20, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 19, 19);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-001\");\n  }\n}\n",
          "expectedOutput": "width=20\nlesson=practice-ch09-lesson-001",
          "jaExplanation": "import java.awt.*;をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“import java.awt.*;”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-001",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:149"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材149ページの節では、「import java.awt.*;」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 149 页对应的小节中，只记住“import java.awt.*;”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材149ページの節では、「import java.awt.*;」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 149 页对应的小节中，在“import java.awt.*;”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-001 まで含めて出力を確認せず、期待される出力「width=20」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-001 这一行，就看到预期输出“width=20”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材149ページを確認してから、「import java.awt.*;」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 149 页，在“import java.awt.*;”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「import java.awt.*;」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“import java.awt.*;”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「Graphiscオブジェクトの座標系」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“Graphisc对象の坐标系”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-002",
      "chapterId": "java-ch17",
      "order": 2,
      "title": {
        "ja": "Graphiscオブジェクトの座標系",
        "zh": "Graphisc对象の坐标系"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "Graphiscオブジェクトの座標系",
        "pageStart": 150,
        "pageEnd": 150
      },
      "objectives": [
        {
          "ja": "「Graphiscオブジェクトの座標系」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“Graphisc对象の坐标系”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-002",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材150ページ「Graphiscオブジェクトの座標系」: 教材150ページの「Graphiscオブジェクトの座標系」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 150 页“Graphisc对象の坐标系”：教材第 150 页的“Graphisc对象の坐标系”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-002",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材150ページ「Graphiscオブジェクトの座標系」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 150 页“Graphisc对象の坐标系”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-002",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材150ページ「Graphiscオブジェクトの座標系」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「Graphiscオブジェクトの座標系」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 150 页“Graphisc对象の坐标系”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“Graphisc对象の坐标系”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-002",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材150ページ「Graphiscオブジェクトの座標系」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=21 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 150 页“Graphisc对象の坐标系”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=21，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-002",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材150ページ「Graphiscオブジェクトの座標系」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 150 页“Graphisc对象の坐标系”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「Graphiscオブジェクトの座標系」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“Graphisc对象の坐标系”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s002-example-01",
          "className": "JavaR7C17S002",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S002 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(21, 21, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 20, 20);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-002\");\n  }\n}\n",
          "expectedOutput": "width=21\nlesson=practice-ch09-lesson-002",
          "jaExplanation": "Graphiscオブジェクトの座標系をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“Graphiscオブジェクトの坐标系”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-002",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:150"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材150ページの節では、「Graphiscオブジェクトの座標系」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 150 页对应的小节中，只记住“Graphisc对象の坐标系”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材150ページの節では、「Graphiscオブジェクトの座標系」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 150 页对应的小节中，在“Graphisc对象の坐标系”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-002 まで含めて出力を確認せず、期待される出力「width=21」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-002 这一行，就看到预期输出“width=21”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材150ページを確認してから、「Graphiscオブジェクトの座標系」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 150 页，在“Graphisc对象の坐标系”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「Graphiscオブジェクトの座標系」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“Graphisc对象の坐标系”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「直線の描画」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“直线の绘制”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-003",
      "chapterId": "java-ch17",
      "order": 3,
      "title": {
        "ja": "直線の描画",
        "zh": "直线の绘制"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "直線の描画",
        "pageStart": 151,
        "pageEnd": 151
      },
      "objectives": [
        {
          "ja": "「直線の描画」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“直线の绘制”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-003",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材151ページ「直線の描画」: 教材151ページの「直線の描画」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 151 页“直线の绘制”：教材第 151 页的“直线の绘制”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-003",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材151ページ「直線の描画」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 151 页“直线の绘制”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-003",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材151ページ「直線の描画」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「直線の描画」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 151 页“直线の绘制”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“直线の绘制”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-003",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材151ページ「直線の描画」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=22 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 151 页“直线の绘制”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=22，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-003",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材151ページ「直線の描画」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 151 页“直线の绘制”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「直線の描画」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“直线の绘制”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s003-example-01",
          "className": "JavaR7C17S003",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S003 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(22, 22, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 21, 21);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-003\");\n  }\n}\n",
          "expectedOutput": "width=22\nlesson=practice-ch09-lesson-003",
          "jaExplanation": "直線の描画をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“直線の绘制”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-003",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:151"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材151ページの節では、「直線の描画」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 151 页对应的小节中，只记住“直线の绘制”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材151ページの節では、「直線の描画」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 151 页对应的小节中，在“直线の绘制”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-003 まで含めて出力を確認せず、期待される出力「width=22」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-003 这一行，就看到预期输出“width=22”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材151ページを確認してから、「直線の描画」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 151 页，在“直线の绘制”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「直線の描画」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“直线の绘制”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「様々な描画メソッド」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“様々な绘制方法”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-004",
      "chapterId": "java-ch17",
      "order": 4,
      "title": {
        "ja": "様々な描画メソッド",
        "zh": "様々な绘制方法"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "様々な描画メソッド",
        "pageStart": 152,
        "pageEnd": 152
      },
      "objectives": [
        {
          "ja": "「様々な描画メソッド」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“様々な绘制方法”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-004",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材152ページ「様々な描画メソッド」: 教材152ページの「様々な描画メソッド」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 152 页“様々な绘制方法”：教材第 152 页的“様々な绘制方法”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-004",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材152ページ「様々な描画メソッド」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 152 页“様々な绘制方法”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-004",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材152ページ「様々な描画メソッド」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「様々な描画メソッド」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 152 页“様々な绘制方法”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“様々な绘制方法”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-004",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材152ページ「様々な描画メソッド」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=23 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 152 页“様々な绘制方法”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=23，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-004",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材152ページ「様々な描画メソッド」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 152 页“様々な绘制方法”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「様々な描画メソッド」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“様々な绘制方法”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s004-example-01",
          "className": "JavaR7C17S004",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S004 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(23, 23, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 22, 22);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-004\");\n  }\n}\n",
          "expectedOutput": "width=23\nlesson=practice-ch09-lesson-004",
          "jaExplanation": "様々な描画メソッドをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“様々な绘制方法”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-004",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:152"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材152ページの節では、「様々な描画メソッド」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 152 页对应的小节中，只记住“様々な绘制方法”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材152ページの節では、「様々な描画メソッド」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 152 页对应的小节中，在“様々な绘制方法”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-004 まで含めて出力を確認せず、期待される出力「width=23」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-004 这一行，就看到预期输出“width=23”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材152ページを確認してから、「様々な描画メソッド」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 152 页，在“様々な绘制方法”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「様々な描画メソッド」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“様々な绘制方法”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「Graphics2Dクラス」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“Graphics2D类”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-005",
      "chapterId": "java-ch17",
      "order": 5,
      "title": {
        "ja": "Graphics2Dクラス",
        "zh": "Graphics2D类"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "Graphics2Dクラス",
        "pageStart": 153,
        "pageEnd": 153
      },
      "objectives": [
        {
          "ja": "「Graphics2Dクラス」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“Graphics2D类”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-005",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材153ページ「Graphics2Dクラス」: 教材153ページの「Graphics2Dクラス」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 153 页“Graphics2D类”：教材第 153 页的“Graphics2D类”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-005",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材153ページ「Graphics2Dクラス」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 153 页“Graphics2D类”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-005",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材153ページ「Graphics2Dクラス」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「Graphics2Dクラス」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 153 页“Graphics2D类”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“Graphics2D类”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-005",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材153ページ「Graphics2Dクラス」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=24 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 153 页“Graphics2D类”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=24，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-005",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材153ページ「Graphics2Dクラス」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 153 页“Graphics2D类”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「Graphics2Dクラス」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“Graphics2D类”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s005-example-01",
          "className": "JavaR7C17S005",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S005 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(24, 24, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 23, 23);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-005\");\n  }\n}\n",
          "expectedOutput": "width=24\nlesson=practice-ch09-lesson-005",
          "jaExplanation": "Graphics2Dクラスをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“Graphics2D类”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-005",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:153"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材153ページの節では、「Graphics2Dクラス」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 153 页对应的小节中，只记住“Graphics2D类”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材153ページの節では、「Graphics2Dクラス」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 153 页对应的小节中，在“Graphics2D类”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-005 まで含めて出力を確認せず、期待される出力「width=24」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-005 这一行，就看到预期输出“width=24”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材153ページを確認してから、「Graphics2Dクラス」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 153 页，在“Graphics2D类”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「Graphics2Dクラス」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“Graphics2D类”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「マウスイベント」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“鼠标事件”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-006",
      "chapterId": "java-ch17",
      "order": 6,
      "title": {
        "ja": "マウスイベント",
        "zh": "鼠标事件"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "マウスイベント",
        "pageStart": 154,
        "pageEnd": 154
      },
      "objectives": [
        {
          "ja": "「マウスイベント」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“鼠标事件”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-006",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材154ページ「マウスイベント」: 教材154ページの「マウスイベント」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 154 页“鼠标事件”：教材第 154 页的“鼠标事件”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-006",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材154ページ「マウスイベント」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 154 页“鼠标事件”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-006",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材154ページ「マウスイベント」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「マウスイベント」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 154 页“鼠标事件”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“鼠标事件”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-006",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材154ページ「マウスイベント」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=20 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 154 页“鼠标事件”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=20，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-006",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材154ページ「マウスイベント」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 154 页“鼠标事件”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「マウスイベント」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“鼠标事件”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s006-example-01",
          "className": "JavaR7C17S006",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S006 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(20, 20, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 19, 19);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-006\");\n  }\n}\n",
          "expectedOutput": "width=20\nlesson=practice-ch09-lesson-006",
          "jaExplanation": "マウスイベントをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“マウス事件”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-006",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:154"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材154ページの節では、「マウスイベント」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 154 页对应的小节中，只记住“鼠标事件”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材154ページの節では、「マウスイベント」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 154 页对应的小节中，在“鼠标事件”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-006 まで含めて出力を確認せず、期待される出力「width=20」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-006 这一行，就看到预期输出“width=20”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材154ページを確認してから、「マウスイベント」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 154 页，在“鼠标事件”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「マウスイベント」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“鼠标事件”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「2つのイベントリスナ」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“2つの事件监听器”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-007",
      "chapterId": "java-ch17",
      "order": 7,
      "title": {
        "ja": "2つのイベントリスナ",
        "zh": "2つの事件监听器"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "2つのイベントリスナ",
        "pageStart": 155,
        "pageEnd": 155
      },
      "objectives": [
        {
          "ja": "「2つのイベントリスナ」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“2つの事件监听器”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-007",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材155ページ「2つのイベントリスナ」: 教材155ページの「2つのイベントリスナ」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 155 页“2つの事件监听器”：教材第 155 页的“2つの事件监听器”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-007",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材155ページ「2つのイベントリスナ」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 155 页“2つの事件监听器”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-007",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材155ページ「2つのイベントリスナ」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「2つのイベントリスナ」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 155 页“2つの事件监听器”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“2つの事件监听器”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-007",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材155ページ「2つのイベントリスナ」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=21 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 155 页“2つの事件监听器”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=21，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-007",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材155ページ「2つのイベントリスナ」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 155 页“2つの事件监听器”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「2つのイベントリスナ」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“2つの事件监听器”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s007-example-01",
          "className": "JavaR7C17S007",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S007 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(21, 21, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 20, 20);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-007\");\n  }\n}\n",
          "expectedOutput": "width=21\nlesson=practice-ch09-lesson-007",
          "jaExplanation": "2つのイベントリスナをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“2つの事件监听器”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-007",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:155"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材155ページの節では、「2つのイベントリスナ」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 155 页对应的小节中，只记住“2つの事件监听器”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材155ページの節では、「2つのイベントリスナ」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 155 页对应的小节中，在“2つの事件监听器”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-007 まで含めて出力を確認せず、期待される出力「width=21」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-007 这一行，就看到预期输出“width=21”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材155ページを確認してから、「2つのイベントリスナ」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 155 页，在“2つの事件监听器”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「2つのイベントリスナ」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“2つの事件监听器”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「import java.awt.event.*;」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“import java.awt.event.*;”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch09-lesson-008",
      "chapterId": "java-ch17",
      "order": 8,
      "title": {
        "ja": "import java.awt.event.*;",
        "zh": "import java.awt.event.*;"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第9章 グラフィックスとマウスイベント",
        "section": "import java.awt.event.*;",
        "pageStart": 156,
        "pageEnd": 156
      },
      "objectives": [
        {
          "ja": "「import java.awt.event.*;」が描画のどの場面で必要になるかを説明できる。",
          "zh": "能说明“import java.awt.event.*;”在图形绘制的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、BufferedImageとGraphics2Dと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把BufferedImage 和 Graphics2D和输出结果联系起来。"
        }
      ],
      "prerequisites": [
        {
          "ja": "class、mainメソッド、System.out.printlnの位置を見つけられれば始められます。",
          "zh": "只要能找出 class、main 方法和 System.out.println 的位置，就可以开始本节。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch09-lesson-008",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材156ページ「import java.awt.event.*;」: 教材156ページの「import java.awt.event.*;」では、座標を使って線や図形を描く考え方を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 156 页“import java.awt.event.*;”：教材第 156 页的“import java.awt.event.*;”用于理解：用坐标绘制线条和图形的思路。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch09-lesson-008",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材156ページ「import java.awt.event.*;」: この節の読み方は、座標、描画対象、イベント位置を対応させることです。サンプルでは new BufferedImage に注目し、BufferedImageとGraphics2Dがどこに現れるかを探します。",
          "zh": "教材第 156 页“import java.awt.event.*;”：本节的读法是：对应坐标、绘制对象和事件位置。示例里先看 new BufferedImage，再找出 BufferedImage 和 Graphics2D 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch09-lesson-008",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材156ページ「import java.awt.event.*;」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「import java.awt.event.*;」はその中で描画を理解するための手がかりになります。",
          "zh": "教材第 156 页“import java.awt.event.*;”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“import java.awt.event.*;”就是理解图形绘制的线索。"
        },
        {
          "semanticKey": "risk-practice-ch09-lesson-008",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材156ページ「import java.awt.event.*;」: ここでの典型的なミスは、x座標とy座標、幅と高さを逆に読みやすい点です。出力の先頭は width=22 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 156 页“import java.awt.event.*;”：这里常见的错误是：容易把 x/y 坐标、宽/高读反。本例输出第一行是 width=22，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch09-lesson-008",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材156ページ「import java.awt.event.*;」: このミニ例は教材本文の写しではなく、描画サイズや点の座標を変えるための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 156 页“import java.awt.event.*;”：这个小例子不是教材原文复制，而是用来修改绘制尺寸或点坐标。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "graphics",
          "ja": "描画",
          "zh": "图形绘制",
          "explanationJa": "「import java.awt.event.*;」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“import java.awt.event.*;”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
        },
        {
          "en": "runnable example",
          "ja": "実行できる例",
          "zh": "可运行示例",
          "explanationJa": "短いコードを実際にコンパイルし、予想した出力と比べるための例です。",
          "explanationZh": "用于真实编译运行短代码，并把结果和自己预测的输出进行对比。"
        },
        {
          "en": "expected output",
          "ja": "期待される出力",
          "zh": "预期输出",
          "explanationJa": "コードを正しく読めているかを確認するための基準です。",
          "explanationZh": "这是确认自己是否读懂代码的基准。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch09-s008-example-01",
          "className": "JavaR7C17S008",
          "runnable": true,
          "code": "import java.awt.Graphics2D;\nimport java.awt.image.BufferedImage;\npublic class JavaR7C17S008 {\n  public static void main(String[] args) {\n    BufferedImage image = new BufferedImage(22, 22, BufferedImage.TYPE_INT_ARGB);\n    Graphics2D g = image.createGraphics();\n    g.drawLine(0, 0, 21, 21);\n    g.dispose();\n    System.out.println(\"width=\" + image.getWidth());\n    System.out.println(\"lesson=practice-ch09-lesson-008\");\n  }\n}\n",
          "expectedOutput": "width=22\nlesson=practice-ch09-lesson-008",
          "jaExplanation": "import java.awt.event.*;をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“import java.awt.event.*;”的最小示例。",
          "lineNotes": [
            {
              "line": 5,
              "snippet": "new BufferedImage",
              "ja": "描画先になる小さな画像を作ります。",
              "zh": "创建作为绘制目标的小图片。"
            },
            {
              "line": 6,
              "snippet": "createGraphics",
              "ja": "Graphics2Dを取り出して描画命令を使います。",
              "zh": "取出 Graphics2D 后使用绘制命令。"
            },
            {
              "line": 7,
              "snippet": "drawLine",
              "ja": "座標を指定して直線を描きます。",
              "zh": "指定坐标绘制直线。"
            },
            {
              "line": 10,
              "snippet": "lesson=practice-ch09-lesson-008",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:156"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材156ページの節では、「import java.awt.event.*;」という用語だけを覚え、BufferedImageとGraphics2Dがコードのどこにあるか確認しない。",
          "zh": "在教材第 156 页对应的小节中，只记住“import java.awt.event.*;”这个词，却不确认BufferedImage 和 Graphics2D在代码中的位置。"
        },
        {
          "ja": "教材156ページの節では、「import java.awt.event.*;」では、x座標とy座標、幅と高さを逆に読みやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 156 页对应的小节中，在“import java.awt.event.*;”这一节，忽略容易把 x/y 坐标、宽/高读反，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch09-lesson-008 まで含めて出力を確認せず、期待される出力「width=22」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch09-lesson-008 这一行，就看到预期输出“width=22”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材156ページを確認してから、「import java.awt.event.*;」のサンプルで、Pointの座標または画像サイズを1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 156 页，在“import java.awt.event.*;”这一节，只修改Point 坐标或图片尺寸中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「import java.awt.event.*;」では、座標を使って線や図形を描く考え方をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“import java.awt.event.*;”这一节已经把用坐标绘制线条和图形的思路和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ネットワーク接続」です。本節の描画の読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“网络连接”。请沿用本节对图形绘制的读法，比较新代码发生了什么变化。"
      }
    }
  ]
};
