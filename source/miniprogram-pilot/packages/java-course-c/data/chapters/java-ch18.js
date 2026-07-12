module.exports = {
  "chapter": {
    "chapterId": "java-ch18",
    "chapterOrder": 18,
    "sourceId": "java_practice_tsukuba",
    "sourceChapterId": "practice-ch10",
    "sourceChapter": "第10章 ネットワーク",
    "title": {
      "ja": "第10章 ネットワーク",
      "zh": "第10章 网络"
    },
    "pageStart": 157,
    "pageEnd": 162,
    "shard": "java-ch18.js",
    "sections": [
      {
        "sectionId": "practice-ch10-s001",
        "lessonId": "practice-ch10-lesson-001",
        "order": 1,
        "title": {
          "ja": "ネットワーク接続",
          "zh": "网络连接"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第10章 ネットワーク",
          "section": "ネットワーク接続",
          "pageStart": 158,
          "pageEnd": 158
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch10-s002",
        "lessonId": "practice-ch10-lesson-002",
        "order": 2,
        "title": {
          "ja": "IPアドレスとポート番号",
          "zh": "IPアドレスと端口号"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第10章 ネットワーク",
          "section": "IPアドレスとポート番号",
          "pageStart": 159,
          "pageEnd": 159
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch10-s003",
        "lessonId": "practice-ch10-lesson-003",
        "order": 3,
        "title": {
          "ja": "ServerSocketとSocket",
          "zh": "ServerSocketとSocket"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第10章 ネットワーク",
          "section": "ServerSocketとSocket",
          "pageStart": 160,
          "pageEnd": 160
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch10-s004",
        "lessonId": "practice-ch10-lesson-004",
        "order": 4,
        "title": {
          "ja": "サーバー側のプログラム例",
          "zh": "服务器側の程序例"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第10章 ネットワーク",
          "section": "サーバー側のプログラム例",
          "pageStart": 161,
          "pageEnd": 161
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch10-s005",
        "lessonId": "practice-ch10-lesson-005",
        "order": 5,
        "title": {
          "ja": "クライアント側のプログラム例",
          "zh": "客户端側の程序例"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第10章 ネットワーク",
          "section": "クライアント側のプログラム例",
          "pageStart": 162,
          "pageEnd": 162
        },
        "runnableExampleCount": 1
      }
    ]
  },
  "lessons": [
    {
      "lessonId": "practice-ch10-lesson-001",
      "chapterId": "java-ch18",
      "order": 1,
      "title": {
        "ja": "ネットワーク接続",
        "zh": "网络连接"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第10章 ネットワーク",
        "section": "ネットワーク接続",
        "pageStart": 158,
        "pageEnd": 158
      },
      "objectives": [
        {
          "ja": "「ネットワーク接続」がネットワークのどの場面で必要になるかを説明できる。",
          "zh": "能说明“网络连接”在网络通信的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、InetSocketAddressやSocketと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把InetSocketAddress 或 Socket和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch10-lesson-001",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材158ページ「ネットワーク接続」: 教材158ページの「ネットワーク接続」では、ホスト名、IP、ポート、ソケットの役割を分ける方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 158 页“网络连接”：教材第 158 页的“网络连接”用于理解：区分主机名、IP、端口和 socket 的作用。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch10-lesson-001",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材158ページ「ネットワーク接続」: この節の読み方は、接続先の住所と通信の入口を対応させることです。サンプルでは InetSocketAddress に注目し、InetSocketAddressやSocketがどこに現れるかを探します。",
          "zh": "教材第 158 页“网络连接”：本节的读法是：对应连接地址和通信入口。示例里先看 InetSocketAddress，再找出 InetSocketAddress 或 Socket 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch10-lesson-001",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材158ページ「ネットワーク接続」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ネットワーク接続」はその中でネットワークを理解するための手がかりになります。",
          "zh": "教材第 158 页“网络连接”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“网络连接”就是理解网络通信的线索。"
        },
        {
          "semanticKey": "risk-practice-ch10-lesson-001",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材158ページ「ネットワーク接続」: ここでの典型的なミスは、ポート番号とIPアドレスを一つの値のように扱ってしまう点です。出力の先頭は host=localhost なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 158 页“网络连接”：这里常见的错误是：容易把端口号和 IP 地址当成一个值。本例输出第一行是 host=localhost，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch10-lesson-001",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材158ページ「ネットワーク接続」: このミニ例は教材本文の写しではなく、ポート番号を変えて出力を確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 158 页“网络连接”：这个小例子不是教材原文复制，而是用来修改端口号并确认输出。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "network socket",
          "ja": "ネットワーク",
          "zh": "网络通信",
          "explanationJa": "「ネットワーク接続」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“网络连接”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch10-s001-example-01",
          "className": "JavaR7C18S001",
          "runnable": true,
          "code": "import java.net.InetSocketAddress;\npublic class JavaR7C18S001 {\n  public static void main(String[] args) {\n    InetSocketAddress address = new InetSocketAddress(\"localhost\", 8018);\n    System.out.println(\"host=\" + address.getHostString());\n    System.out.println(\"port=\" + address.getPort());\n    System.out.println(\"lesson=practice-ch10-lesson-001\");\n  }\n}\n",
          "expectedOutput": "host=localhost\nport=8018\nlesson=practice-ch10-lesson-001",
          "jaExplanation": "ネットワーク接続をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“网络连接”的最小示例。",
          "lineNotes": [
            {
              "line": 1,
              "snippet": "InetSocketAddress",
              "ja": "接続先のホスト名とポート番号をまとめます。",
              "zh": "把连接目标的主机名和端口号组合起来。"
            },
            {
              "line": 4,
              "snippet": "\"localhost\"",
              "ja": "localhostは自分のコンピュータを指す名前です。",
              "zh": "localhost 表示自己的电脑。"
            },
            {
              "line": 6,
              "snippet": "getPort()",
              "ja": "getPortでポート番号を確認します。",
              "zh": "用 getPort 确认端口号。"
            },
            {
              "line": 7,
              "snippet": "lesson=practice-ch10-lesson-001",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:158"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材158ページの節では、「ネットワーク接続」という用語だけを覚え、InetSocketAddressやSocketがコードのどこにあるか確認しない。",
          "zh": "在教材第 158 页对应的小节中，只记住“网络连接”这个词，却不确认InetSocketAddress 或 Socket在代码中的位置。"
        },
        {
          "ja": "教材158ページの節では、「ネットワーク接続」では、ポート番号とIPアドレスを一つの値のように扱ってしまう点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 158 页对应的小节中，在“网络连接”这一节，忽略容易把端口号和 IP 地址当成一个值，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch10-lesson-001 まで含めて出力を確認せず、期待される出力「host=localhost」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch10-lesson-001 这一行，就看到预期输出“host=localhost”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材158ページを確認してから、「ネットワーク接続」のサンプルで、port番号またはhost名を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 158 页，在“网络连接”这一节，只修改port 号或 host 名中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ネットワーク接続」では、ホスト名、IP、ポート、ソケットの役割を分ける方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“网络连接”这一节已经把区分主机名、IP、端口和 socket 的作用和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「IPアドレスとポート番号」です。本節のネットワークの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“IPアドレスと端口号”。请沿用本节对网络通信的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch10-lesson-002",
      "chapterId": "java-ch18",
      "order": 2,
      "title": {
        "ja": "IPアドレスとポート番号",
        "zh": "IPアドレスと端口号"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第10章 ネットワーク",
        "section": "IPアドレスとポート番号",
        "pageStart": 159,
        "pageEnd": 159
      },
      "objectives": [
        {
          "ja": "「IPアドレスとポート番号」がネットワークのどの場面で必要になるかを説明できる。",
          "zh": "能说明“IPアドレスと端口号”在网络通信的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、InetSocketAddressやSocketと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把InetSocketAddress 或 Socket和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch10-lesson-002",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材159ページ「IPアドレスとポート番号」: 教材159ページの「IPアドレスとポート番号」では、ホスト名、IP、ポート、ソケットの役割を分ける方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 159 页“IPアドレスと端口号”：教材第 159 页的“IPアドレスと端口号”用于理解：区分主机名、IP、端口和 socket 的作用。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch10-lesson-002",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材159ページ「IPアドレスとポート番号」: この節の読み方は、接続先の住所と通信の入口を対応させることです。サンプルでは InetSocketAddress に注目し、InetSocketAddressやSocketがどこに現れるかを探します。",
          "zh": "教材第 159 页“IPアドレスと端口号”：本节的读法是：对应连接地址和通信入口。示例里先看 InetSocketAddress，再找出 InetSocketAddress 或 Socket 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch10-lesson-002",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材159ページ「IPアドレスとポート番号」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「IPアドレスとポート番号」はその中でネットワークを理解するための手がかりになります。",
          "zh": "教材第 159 页“IPアドレスと端口号”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“IPアドレスと端口号”就是理解网络通信的线索。"
        },
        {
          "semanticKey": "risk-practice-ch10-lesson-002",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材159ページ「IPアドレスとポート番号」: ここでの典型的なミスは、ポート番号とIPアドレスを一つの値のように扱ってしまう点です。出力の先頭は host=localhost なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 159 页“IPアドレスと端口号”：这里常见的错误是：容易把端口号和 IP 地址当成一个值。本例输出第一行是 host=localhost，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch10-lesson-002",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材159ページ「IPアドレスとポート番号」: このミニ例は教材本文の写しではなく、ポート番号を変えて出力を確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 159 页“IPアドレスと端口号”：这个小例子不是教材原文复制，而是用来修改端口号并确认输出。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "network socket",
          "ja": "ネットワーク",
          "zh": "网络通信",
          "explanationJa": "「IPアドレスとポート番号」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“IPアドレスと端口号”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch10-s002-example-01",
          "className": "JavaR7C18S002",
          "runnable": true,
          "code": "import java.net.InetSocketAddress;\npublic class JavaR7C18S002 {\n  public static void main(String[] args) {\n    InetSocketAddress address = new InetSocketAddress(\"localhost\", 8019);\n    System.out.println(\"host=\" + address.getHostString());\n    System.out.println(\"port=\" + address.getPort());\n    System.out.println(\"lesson=practice-ch10-lesson-002\");\n  }\n}\n",
          "expectedOutput": "host=localhost\nport=8019\nlesson=practice-ch10-lesson-002",
          "jaExplanation": "IPアドレスとポート番号をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“IPアドレスと端口号”的最小示例。",
          "lineNotes": [
            {
              "line": 1,
              "snippet": "InetSocketAddress",
              "ja": "接続先のホスト名とポート番号をまとめます。",
              "zh": "把连接目标的主机名和端口号组合起来。"
            },
            {
              "line": 4,
              "snippet": "\"localhost\"",
              "ja": "localhostは自分のコンピュータを指す名前です。",
              "zh": "localhost 表示自己的电脑。"
            },
            {
              "line": 6,
              "snippet": "getPort()",
              "ja": "getPortでポート番号を確認します。",
              "zh": "用 getPort 确认端口号。"
            },
            {
              "line": 7,
              "snippet": "lesson=practice-ch10-lesson-002",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:159"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材159ページの節では、「IPアドレスとポート番号」という用語だけを覚え、InetSocketAddressやSocketがコードのどこにあるか確認しない。",
          "zh": "在教材第 159 页对应的小节中，只记住“IPアドレスと端口号”这个词，却不确认InetSocketAddress 或 Socket在代码中的位置。"
        },
        {
          "ja": "教材159ページの節では、「IPアドレスとポート番号」では、ポート番号とIPアドレスを一つの値のように扱ってしまう点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 159 页对应的小节中，在“IPアドレスと端口号”这一节，忽略容易把端口号和 IP 地址当成一个值，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch10-lesson-002 まで含めて出力を確認せず、期待される出力「host=localhost」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch10-lesson-002 这一行，就看到预期输出“host=localhost”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材159ページを確認してから、「IPアドレスとポート番号」のサンプルで、port番号またはhost名を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 159 页，在“IPアドレスと端口号”这一节，只修改port 号或 host 名中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「IPアドレスとポート番号」では、ホスト名、IP、ポート、ソケットの役割を分ける方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“IPアドレスと端口号”这一节已经把区分主机名、IP、端口和 socket 的作用和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ServerSocketとSocket」です。本節のネットワークの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“ServerSocketとSocket”。请沿用本节对网络通信的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch10-lesson-003",
      "chapterId": "java-ch18",
      "order": 3,
      "title": {
        "ja": "ServerSocketとSocket",
        "zh": "ServerSocketとSocket"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第10章 ネットワーク",
        "section": "ServerSocketとSocket",
        "pageStart": 160,
        "pageEnd": 160
      },
      "objectives": [
        {
          "ja": "「ServerSocketとSocket」がネットワークのどの場面で必要になるかを説明できる。",
          "zh": "能说明“ServerSocketとSocket”在网络通信的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、InetSocketAddressやSocketと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把InetSocketAddress 或 Socket和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch10-lesson-003",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材160ページ「ServerSocketとSocket」: 教材160ページの「ServerSocketとSocket」では、ホスト名、IP、ポート、ソケットの役割を分ける方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 160 页“ServerSocketとSocket”：教材第 160 页的“ServerSocketとSocket”用于理解：区分主机名、IP、端口和 socket 的作用。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch10-lesson-003",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材160ページ「ServerSocketとSocket」: この節の読み方は、接続先の住所と通信の入口を対応させることです。サンプルでは InetSocketAddress に注目し、InetSocketAddressやSocketがどこに現れるかを探します。",
          "zh": "教材第 160 页“ServerSocketとSocket”：本节的读法是：对应连接地址和通信入口。示例里先看 InetSocketAddress，再找出 InetSocketAddress 或 Socket 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch10-lesson-003",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材160ページ「ServerSocketとSocket」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ServerSocketとSocket」はその中でネットワークを理解するための手がかりになります。",
          "zh": "教材第 160 页“ServerSocketとSocket”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“ServerSocketとSocket”就是理解网络通信的线索。"
        },
        {
          "semanticKey": "risk-practice-ch10-lesson-003",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材160ページ「ServerSocketとSocket」: ここでの典型的なミスは、ポート番号とIPアドレスを一つの値のように扱ってしまう点です。出力の先頭は host=localhost なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 160 页“ServerSocketとSocket”：这里常见的错误是：容易把端口号和 IP 地址当成一个值。本例输出第一行是 host=localhost，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch10-lesson-003",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材160ページ「ServerSocketとSocket」: このミニ例は教材本文の写しではなく、ポート番号を変えて出力を確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 160 页“ServerSocketとSocket”：这个小例子不是教材原文复制，而是用来修改端口号并确认输出。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "network socket",
          "ja": "ネットワーク",
          "zh": "网络通信",
          "explanationJa": "「ServerSocketとSocket」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“ServerSocketとSocket”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch10-s003-example-01",
          "className": "JavaR7C18S003",
          "runnable": true,
          "code": "import java.net.InetSocketAddress;\npublic class JavaR7C18S003 {\n  public static void main(String[] args) {\n    InetSocketAddress address = new InetSocketAddress(\"localhost\", 8020);\n    System.out.println(\"host=\" + address.getHostString());\n    System.out.println(\"port=\" + address.getPort());\n    System.out.println(\"lesson=practice-ch10-lesson-003\");\n  }\n}\n",
          "expectedOutput": "host=localhost\nport=8020\nlesson=practice-ch10-lesson-003",
          "jaExplanation": "ServerSocketとSocketをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“ServerSocketとSocket”的最小示例。",
          "lineNotes": [
            {
              "line": 1,
              "snippet": "InetSocketAddress",
              "ja": "接続先のホスト名とポート番号をまとめます。",
              "zh": "把连接目标的主机名和端口号组合起来。"
            },
            {
              "line": 4,
              "snippet": "\"localhost\"",
              "ja": "localhostは自分のコンピュータを指す名前です。",
              "zh": "localhost 表示自己的电脑。"
            },
            {
              "line": 6,
              "snippet": "getPort()",
              "ja": "getPortでポート番号を確認します。",
              "zh": "用 getPort 确认端口号。"
            },
            {
              "line": 7,
              "snippet": "lesson=practice-ch10-lesson-003",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:160"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材160ページの節では、「ServerSocketとSocket」という用語だけを覚え、InetSocketAddressやSocketがコードのどこにあるか確認しない。",
          "zh": "在教材第 160 页对应的小节中，只记住“ServerSocketとSocket”这个词，却不确认InetSocketAddress 或 Socket在代码中的位置。"
        },
        {
          "ja": "教材160ページの節では、「ServerSocketとSocket」では、ポート番号とIPアドレスを一つの値のように扱ってしまう点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 160 页对应的小节中，在“ServerSocketとSocket”这一节，忽略容易把端口号和 IP 地址当成一个值，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch10-lesson-003 まで含めて出力を確認せず、期待される出力「host=localhost」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch10-lesson-003 这一行，就看到预期输出“host=localhost”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材160ページを確認してから、「ServerSocketとSocket」のサンプルで、port番号またはhost名を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 160 页，在“ServerSocketとSocket”这一节，只修改port 号或 host 名中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ServerSocketとSocket」では、ホスト名、IP、ポート、ソケットの役割を分ける方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“ServerSocketとSocket”这一节已经把区分主机名、IP、端口和 socket 的作用和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「サーバー側のプログラム例」です。本節のネットワークの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“服务器側の程序例”。请沿用本节对网络通信的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch10-lesson-004",
      "chapterId": "java-ch18",
      "order": 4,
      "title": {
        "ja": "サーバー側のプログラム例",
        "zh": "服务器側の程序例"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第10章 ネットワーク",
        "section": "サーバー側のプログラム例",
        "pageStart": 161,
        "pageEnd": 161
      },
      "objectives": [
        {
          "ja": "「サーバー側のプログラム例」がネットワークのどの場面で必要になるかを説明できる。",
          "zh": "能说明“服务器側の程序例”在网络通信的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、InetSocketAddressやSocketと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把InetSocketAddress 或 Socket和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch10-lesson-004",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材161ページ「サーバー側のプログラム例」: 教材161ページの「サーバー側のプログラム例」では、ホスト名、IP、ポート、ソケットの役割を分ける方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 161 页“服务器側の程序例”：教材第 161 页的“服务器側の程序例”用于理解：区分主机名、IP、端口和 socket 的作用。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch10-lesson-004",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材161ページ「サーバー側のプログラム例」: この節の読み方は、接続先の住所と通信の入口を対応させることです。サンプルでは InetSocketAddress に注目し、InetSocketAddressやSocketがどこに現れるかを探します。",
          "zh": "教材第 161 页“服务器側の程序例”：本节的读法是：对应连接地址和通信入口。示例里先看 InetSocketAddress，再找出 InetSocketAddress 或 Socket 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch10-lesson-004",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材161ページ「サーバー側のプログラム例」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「サーバー側のプログラム例」はその中でネットワークを理解するための手がかりになります。",
          "zh": "教材第 161 页“服务器側の程序例”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“服务器側の程序例”就是理解网络通信的线索。"
        },
        {
          "semanticKey": "risk-practice-ch10-lesson-004",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材161ページ「サーバー側のプログラム例」: ここでの典型的なミスは、ポート番号とIPアドレスを一つの値のように扱ってしまう点です。出力の先頭は host=localhost なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 161 页“服务器側の程序例”：这里常见的错误是：容易把端口号和 IP 地址当成一个值。本例输出第一行是 host=localhost，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch10-lesson-004",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材161ページ「サーバー側のプログラム例」: このミニ例は教材本文の写しではなく、ポート番号を変えて出力を確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 161 页“服务器側の程序例”：这个小例子不是教材原文复制，而是用来修改端口号并确认输出。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "network socket",
          "ja": "ネットワーク",
          "zh": "网络通信",
          "explanationJa": "「サーバー側のプログラム例」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“服务器側の程序例”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch10-s004-example-01",
          "className": "JavaR7C18S004",
          "runnable": true,
          "code": "import java.net.InetSocketAddress;\npublic class JavaR7C18S004 {\n  public static void main(String[] args) {\n    InetSocketAddress address = new InetSocketAddress(\"localhost\", 8021);\n    System.out.println(\"host=\" + address.getHostString());\n    System.out.println(\"port=\" + address.getPort());\n    System.out.println(\"lesson=practice-ch10-lesson-004\");\n  }\n}\n",
          "expectedOutput": "host=localhost\nport=8021\nlesson=practice-ch10-lesson-004",
          "jaExplanation": "サーバー側のプログラム例をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“サーバー側の程序例”的最小示例。",
          "lineNotes": [
            {
              "line": 1,
              "snippet": "InetSocketAddress",
              "ja": "接続先のホスト名とポート番号をまとめます。",
              "zh": "把连接目标的主机名和端口号组合起来。"
            },
            {
              "line": 4,
              "snippet": "\"localhost\"",
              "ja": "localhostは自分のコンピュータを指す名前です。",
              "zh": "localhost 表示自己的电脑。"
            },
            {
              "line": 6,
              "snippet": "getPort()",
              "ja": "getPortでポート番号を確認します。",
              "zh": "用 getPort 确认端口号。"
            },
            {
              "line": 7,
              "snippet": "lesson=practice-ch10-lesson-004",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:161"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材161ページの節では、「サーバー側のプログラム例」という用語だけを覚え、InetSocketAddressやSocketがコードのどこにあるか確認しない。",
          "zh": "在教材第 161 页对应的小节中，只记住“服务器側の程序例”这个词，却不确认InetSocketAddress 或 Socket在代码中的位置。"
        },
        {
          "ja": "教材161ページの節では、「サーバー側のプログラム例」では、ポート番号とIPアドレスを一つの値のように扱ってしまう点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 161 页对应的小节中，在“服务器側の程序例”这一节，忽略容易把端口号和 IP 地址当成一个值，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch10-lesson-004 まで含めて出力を確認せず、期待される出力「host=localhost」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch10-lesson-004 这一行，就看到预期输出“host=localhost”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材161ページを確認してから、「サーバー側のプログラム例」のサンプルで、port番号またはhost名を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 161 页，在“服务器側の程序例”这一节，只修改port 号或 host 名中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「サーバー側のプログラム例」では、ホスト名、IP、ポート、ソケットの役割を分ける方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“服务器側の程序例”这一节已经把区分主机名、IP、端口和 socket 的作用和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「クライアント側のプログラム例」です。本節のネットワークの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“客户端側の程序例”。请沿用本节对网络通信的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch10-lesson-005",
      "chapterId": "java-ch18",
      "order": 5,
      "title": {
        "ja": "クライアント側のプログラム例",
        "zh": "客户端側の程序例"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第10章 ネットワーク",
        "section": "クライアント側のプログラム例",
        "pageStart": 162,
        "pageEnd": 162
      },
      "objectives": [
        {
          "ja": "「クライアント側のプログラム例」がネットワークのどの場面で必要になるかを説明できる。",
          "zh": "能说明“客户端側の程序例”在网络通信的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、InetSocketAddressやSocketと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把InetSocketAddress 或 Socket和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch10-lesson-005",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材162ページ「クライアント側のプログラム例」: 教材162ページの「クライアント側のプログラム例」では、ホスト名、IP、ポート、ソケットの役割を分ける方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 162 页“客户端側の程序例”：教材第 162 页的“客户端側の程序例”用于理解：区分主机名、IP、端口和 socket 的作用。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch10-lesson-005",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材162ページ「クライアント側のプログラム例」: この節の読み方は、接続先の住所と通信の入口を対応させることです。サンプルでは InetSocketAddress に注目し、InetSocketAddressやSocketがどこに現れるかを探します。",
          "zh": "教材第 162 页“客户端側の程序例”：本节的读法是：对应连接地址和通信入口。示例里先看 InetSocketAddress，再找出 InetSocketAddress 或 Socket 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch10-lesson-005",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材162ページ「クライアント側のプログラム例」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「クライアント側のプログラム例」はその中でネットワークを理解するための手がかりになります。",
          "zh": "教材第 162 页“客户端側の程序例”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“客户端側の程序例”就是理解网络通信的线索。"
        },
        {
          "semanticKey": "risk-practice-ch10-lesson-005",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材162ページ「クライアント側のプログラム例」: ここでの典型的なミスは、ポート番号とIPアドレスを一つの値のように扱ってしまう点です。出力の先頭は host=localhost なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 162 页“客户端側の程序例”：这里常见的错误是：容易把端口号和 IP 地址当成一个值。本例输出第一行是 host=localhost，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch10-lesson-005",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材162ページ「クライアント側のプログラム例」: このミニ例は教材本文の写しではなく、ポート番号を変えて出力を確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 162 页“客户端側の程序例”：这个小例子不是教材原文复制，而是用来修改端口号并确认输出。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "network socket",
          "ja": "ネットワーク",
          "zh": "网络通信",
          "explanationJa": "「クライアント側のプログラム例」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“客户端側の程序例”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch10-s005-example-01",
          "className": "JavaR7C18S005",
          "runnable": true,
          "code": "import java.net.InetSocketAddress;\npublic class JavaR7C18S005 {\n  public static void main(String[] args) {\n    InetSocketAddress address = new InetSocketAddress(\"localhost\", 8022);\n    System.out.println(\"host=\" + address.getHostString());\n    System.out.println(\"port=\" + address.getPort());\n    System.out.println(\"lesson=practice-ch10-lesson-005\");\n  }\n}\n",
          "expectedOutput": "host=localhost\nport=8022\nlesson=practice-ch10-lesson-005",
          "jaExplanation": "クライアント側のプログラム例をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“クライアント側の程序例”的最小示例。",
          "lineNotes": [
            {
              "line": 1,
              "snippet": "InetSocketAddress",
              "ja": "接続先のホスト名とポート番号をまとめます。",
              "zh": "把连接目标的主机名和端口号组合起来。"
            },
            {
              "line": 4,
              "snippet": "\"localhost\"",
              "ja": "localhostは自分のコンピュータを指す名前です。",
              "zh": "localhost 表示自己的电脑。"
            },
            {
              "line": 6,
              "snippet": "getPort()",
              "ja": "getPortでポート番号を確認します。",
              "zh": "用 getPort 确认端口号。"
            },
            {
              "line": 7,
              "snippet": "lesson=practice-ch10-lesson-005",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:162"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材162ページの節では、「クライアント側のプログラム例」という用語だけを覚え、InetSocketAddressやSocketがコードのどこにあるか確認しない。",
          "zh": "在教材第 162 页对应的小节中，只记住“客户端側の程序例”这个词，却不确认InetSocketAddress 或 Socket在代码中的位置。"
        },
        {
          "ja": "教材162ページの節では、「クライアント側のプログラム例」では、ポート番号とIPアドレスを一つの値のように扱ってしまう点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 162 页对应的小节中，在“客户端側の程序例”这一节，忽略容易把端口号和 IP 地址当成一个值，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch10-lesson-005 まで含めて出力を確認せず、期待される出力「host=localhost」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch10-lesson-005 这一行，就看到预期输出“host=localhost”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材162ページを確認してから、「クライアント側のプログラム例」のサンプルで、port番号またはhost名を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 162 页，在“客户端側の程序例”这一节，只修改port 号或 host 名中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「クライアント側のプログラム例」では、ホスト名、IP、ポート、ソケットの役割を分ける方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“客户端側の程序例”这一节已经把区分主机名、IP、端口和 socket 的作用和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「コレクションとストリーム」です。本節のネットワークの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“集合とStream 流”。请沿用本节对网络通信的读法，比较新代码发生了什么变化。"
      }
    }
  ]
};
