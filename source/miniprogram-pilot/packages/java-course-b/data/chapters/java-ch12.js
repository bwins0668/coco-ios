module.exports = {
  "chapter": {
    "chapterId": "java-ch12",
    "chapterOrder": 12,
    "sourceId": "java_practice_tsukuba",
    "sourceChapterId": "practice-ch04",
    "sourceChapter": "第4章 ガーベッジコレクションとメモリ",
    "title": {
      "ja": "第4章 ガーベッジコレクションとメモリ",
      "zh": "第4章 垃圾回收と内存"
    },
    "pageStart": 62,
    "pageEnd": 70,
    "shard": "java-ch12.js",
    "sections": [
      {
        "sectionId": "practice-ch04-s001",
        "lessonId": "practice-ch04-lesson-001",
        "order": 1,
        "title": {
          "ja": "プログラムの実⾏とメモリ管理",
          "zh": "程序の実行と内存管理"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "プログラムの実⾏とメモリ管理",
          "pageStart": 63,
          "pageEnd": 63
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s002",
        "lessonId": "practice-ch04-lesson-002",
        "order": 2,
        "title": {
          "ja": "スタックとヒープ",
          "zh": "栈と堆"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "スタックとヒープ",
          "pageStart": 64,
          "pageEnd": 64
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s003",
        "lessonId": "practice-ch04-lesson-003",
        "order": 3,
        "title": {
          "ja": "空きメモリサイズの確認",
          "zh": "空き内存サイズの確認"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "空きメモリサイズの確認",
          "pageStart": 65,
          "pageEnd": 65
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s004",
        "lessonId": "practice-ch04-lesson-004",
        "order": 4,
        "title": {
          "ja": "使⽤できるサイズは有限",
          "zh": "使用できるサイズは有限"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "使⽤できるサイズは有限",
          "pageStart": 66,
          "pageEnd": 66
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s005",
        "lessonId": "practice-ch04-lesson-005",
        "order": 5,
        "title": {
          "ja": "ガーベッジコレクション",
          "zh": "垃圾回收"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "ガーベッジコレクション",
          "pageStart": 67,
          "pageEnd": 67
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s006",
        "lessonId": "practice-ch04-lesson-006",
        "order": 6,
        "title": {
          "ja": "ガーベッジコレクションの対象になるタイミング",
          "zh": "垃圾回收の対象になるタイミング"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "ガーベッジコレクションの対象になるタイミング",
          "pageStart": 68,
          "pageEnd": 68
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s007",
        "lessonId": "practice-ch04-lesson-007",
        "order": 7,
        "title": {
          "ja": "ガーベッジコレクションの対象になるタイミング",
          "zh": "垃圾回收の対象になるタイミング"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "ガーベッジコレクションの対象になるタイミング",
          "pageStart": 69,
          "pageEnd": 69
        },
        "runnableExampleCount": 1
      },
      {
        "sectionId": "practice-ch04-s008",
        "lessonId": "practice-ch04-lesson-008",
        "order": 8,
        "title": {
          "ja": "ガーベッジコレクションが実⾏されるタイミング",
          "zh": "垃圾回收が実行されるタイミング"
        },
        "sourceRef": {
          "sourceId": "java_practice_tsukuba",
          "chapter": "第4章 ガーベッジコレクションとメモリ",
          "section": "ガーベッジコレクションが実⾏されるタイミング",
          "pageStart": 70,
          "pageEnd": 70
        },
        "runnableExampleCount": 1
      }
    ]
  },
  "lessons": [
        {
      "lessonId": "practice-ch04-lesson-001",
      "chapterId": "java-ch12",
      "order": 1,
      "title": {
        "ja": "プログラムの実行とメモリ管理",
        "zh": "程序运行与内存管理"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "プログラムの実⾏とメモリ管理",
        "pageStart": 63,
        "pageEnd": 63
      },
      "objectives": [
        {
          "ja": "Javaにおけるオブジェクトのメモリライフサイクル（作成、参照、ガベージコレクションの対象化）を説明できること。",
          "zh": "能够解释 Java 中对象的内存生命周期（创建、引用、以及成为垃圾回收对象）。"
        },
        {
          "ja": "System.gc()は単なる回収要求であり、実行タイミングはJVMに依存し即時回収の保証はないことを説明できること。",
          "zh": "能够解释 System.gc() 仅是垃圾回收请求，其执行时机由 JVM 决定，并不保证立即进行回收。"
        }
      ],
      "prerequisites": [
        {
          "ja": "クラスのインスタンス化（newによるオブジェクト作成）と変数の参照の基本が理解できていること。",
          "zh": "已理解类的实例化（使用 new 创建对象）以及变量引用的基本概念。"
        }
      ],
      "blocks": [
        {
          "semanticKey": "goal-practice-ch04-lesson-001",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "プログラム実行中に生成されたオブジェクトがどのようにメモリ上に確保され、不要になった際にJVM（Java仮想マシン）のガベージコレクション（GC）によって回収されるのか、その基本原則を学びます。",
          "zh": "学习程序运行过程中创建的对象是如何在内存中分配空间，以及在不再需要时如何被 JVM（Java 虚拟机）的垃圾回收（GC）机制进行回收的基本原则。"
        },
        {
          "semanticKey": "mechanic-intro-ch12-lesson-001",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "オブジェクトが「不要になる（GCの対象になる）」とは、そのオブジェクトを指し示す参照（変数など）がすべて失われた状態を意味します。変数の値を `null` に設定することで、オブジェクトへの参照を明示的に解除できます。しかし、参照を解除しても、メモリが即座に解放されるわけではありません。",
          "zh": "对象“不再需要（成为 GC 的对象）”是指指向该对象的所有引用（如变量）全部丢失的状态。通过将变量赋值为 `null`，可以显式解除对对象的引用。然而，解除引用并不等同于内存瞬间被释放。"
        },
        {
          "semanticKey": "beginner-intro-ch12-lesson-001",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番：System.gc()の真实",
            "zh": "零基础阅读顺序：System.gc() 的真相"
          },
          "ja": "`System.gc()` は、JVMに対して「不要になったオブジェクトの回収（GC）を検討してください」と要請を送信するだけであり、直ちにメモリ解放を行う強制命令ではありません。実際にGCを実行するかどうか、またそのタイミングはJVMが自動的に決定します。初学者は、この「要求と実行の区分」をしっかり理解しましょう。",
          "zh": "`System.gc()` 只是向 JVM 发送“请考虑执行垃圾回收（GC）”的请求，而非强制立即释放内存的命令。是否真正执行 GC 以及何时执行，完全由 JVM 自动决定。初学者应深刻理解这种“请求与执行的分离”关系。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-001",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "プログラムの動作（ロジック）を「特定の時点でGCが実行されること」に依存させてはいけません。JVMの内部動作やGCの実行タイミングは不確実であり、実行環境によって変化します。また、参照解除（`null` 代入）を行っても、そのオブジェクトをまだ他の変数が参照している場合、GCの対象にはなりません。",
          "zh": "绝不要让程序的运行逻辑依赖于“在特定时间点执行垃圾回收”。JVM 的内部行为和 GC 的执行时机具有不确定性，会随着运行环境的变化而改变。另外，即便将某个变量赋值为 `null`，如果该对象仍被其他变量引用，它也不会成为 GC 的对象。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-001",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "このサンプルコードでは、`SampleObject` のインスタンスを作成し、その参照を変数 `obj` から解除（`null` 代入）した後に `System.gc()` を呼び出しています。コンソールに出力される各メッセージが、決定論的（確実）に実行される行為のみを記録しており、GCの実際の実行タイミング自体には依存していないことを確認してください。",
          "zh": "本示例中，创建了 `SampleObject` 实例，将变量 `obj` 解除引用（赋值为 `null`）后调用了 `System.gc()`。请确认控制台输出的各条信息仅记录了确定性执行的行为，而没有依赖于 GC 具体的执行时机。"
        }
      ],
      "terms": [
        {
          "en": "garbage collection (GC)",
          "ja": "ガベージコレクション",
          "zh": "垃圾回收",
          "explanationJa": "プログラムが使用しなくなったメモリ領域（どこからも参照されなくなったオブジェクト）を自動的に検出し、解放するJVMの機能。",
          "explanationZh": "JVM 自动检测并释放程序不再使用的内存空间（即无法通过任何引用访问的对象）的功能。"
        },
        {
          "en": "reference",
          "ja": "参照",
          "zh": "引用",
          "explanationJa": "メモリ上に存在するオブジェクトの位置（アドレス）を指し示す情報。変数を通じて操作を行います。",
          "explanationZh": "指向内存中存在对象的位置（地址）的信息，通过变量对其进行操作。"
        },
        {
          "en": "System.gc()",
          "ja": "System.gc()",
          "zh": "System.gc()",
          "explanationJa": "JVMに対してガベージコレクションの実行を促す（推奨する）ための静的メソッド。強制力はありません。",
          "explanationZh": "用于促使（建议）JVM 执行垃圾回收的静态方法，不具有强制执行力。"
        }
      ],
      "codeExamples": [
        {
          "exampleId": "practice-ch04-s001-example-01",
          "className": "JavaR7C12S001",
          "runnable": true,
          "code": "public class JavaR7C12S001 {\n  static class SampleObject {\n    String id;\n    SampleObject(String id) {\n      this.id = id;\n    }\n  }\n\n  public static void main(String[] args) {\n    // Create an object in memory\n    SampleObject obj = new SampleObject(\"Data-1\");\n    System.out.println(\"Created: \" + obj.id);\n    \n    // Clear the reference (object becomes eligible for GC if no other references exist)\n    obj = null;\n    System.out.println(\"Reference cleared (set to null)\");\n    \n    // Request GC (Note: JVM does not guarantee immediate execution, timing is unpredictable)\n    System.gc();\n    System.out.println(\"GC requested\");\n  }\n}\n",
          "expectedOutput": "Created: Data-1\nReference cleared (set to null)\nGC requested",
          "jaExplanation": "オブジェクトの生成、参照解除（null代入）、およびGC実行の要請（System.gc()）が順次実行される流れを確認します。出力結果は、GCの実行開始時や完了時期には依存せず、確定的に表示されます。",
          "zhExplanation": "验证对象创建、解除引用（赋值为 null）以及请求执行 GC（System.gc()）的顺序执行流程。输出结果具有确定性，不依赖于 GC 实际开始或完成的时机。",
          "lineNotes": [
            {
              "line": 3,
              "snippet": "static class SampleObject",
              "ja": "メモリ管理の対象とするシンプルなテスト用クラスを定義します。",
              "zh": "定义一个简单的测试类作为内存管理对象。"
            },
            {
              "line": 11,
              "snippet": "SampleObject obj = new SampleObject(\"Data-1\")",
              "ja": "ヒープメモリ上にオブジェクトを作成し、変数objに参照を代入します。",
              "zh": "在堆内存中创建对象，并将引用赋值给变量 obj。"
            },
            {
              "line": 15,
              "snippet": "obj = null",
              "ja": "参照をクリアして、オブジェクトをGC可能な状態にします。この時点ではメモリが解放されたとは限りません。",
              "zh": "清除引用，使对象处于可被 GC 回收的状态。此时内存不一定立刻被释放。"
            },
            {
              "line": 19,
              "snippet": "System.gc()",
              "ja": "JVMにGCの実行を要請します。直ちに実行される保証はありません。",
              "zh": "向 JVM 请求执行 GC，无法保证其会被立即执行。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:63"
        }
      ],
      "commonMistakes": [
        {
          "ja": "System.gc()を呼び出せば、メモリが必ずかつ直ちに解放されると誤解する。これは単なる要求であり実行はJVMの任意です。",
          "zh": "误以为调用 System.gc() 就一定会强制且立即释放内存。这仅仅是个请求，是否以及何时执行由 JVM 决定。"
        },
        {
          "ja": "変数に null を代入した瞬間に、そのオブジェクトのメモリが直ちに回収されて消滅したと考える。",
          "zh": "误以为将变量赋值为 null 的瞬间，该对象占用的内存就被立即回收并消失了。"
        },
        {
          "ja": "プログラムの正常な実行順序や処理ロジックを、GCが特定のミリ秒単位のタイミングで実行されることを前提にして記述する。",
          "zh": "编写程序逻辑时，错误地依赖于“GC 会在特定的毫秒级时间点执行完毕”这一无法预期的前提。"
        }
      ],
      "handson": {
        "ja": "このサンプルコードを実行し、出力される3行のメッセージを確認してください。次に、System.gc() を呼び出す前に「System.out.println(\"Before request\");」を追加し、確定的かつ順序通りに出力されることを観察してください（GCタイミング自体を観察するのではなく、手続き実行の確定性を確認します）。",
        "zh": "运行本示例代码，并确认输出的 3 行日志。接着，在调用 System.gc() 之前添加一行「System.out.println(\"Before request\");」，观察其是否按照确定的顺序输出（重在确认行为的确定性，而非去观察不可预测 of GC 执行时刻）。"
      },
      "summary": {
        "ja": "プログラムの実⾏とメモリ管理では、不要になったオブジェクトはGCにより自動回収される仕組みを学びました。`null` 代入による参照解除と `System.gc()` の非決定的な（確約されない）挙動について正しいメンタルモデルを持つことが重要です。",
        "zh": "在“程序运行与内存管理”中，学习了不再需要的对象会被 GC 自动回收 of 机制。对于将变量赋值为 `null` 解除引用以及 `System.gc()` の非決定性（不保证立即执行）行为，必须建立正确的认知心智模型。"
      },
      "nextLessonBridge": {
        "ja": "次は「スタックとヒープ」です。オブジェクトやローカル変数がメモリのどこ（スタックかヒープか）に格納されるかを詳しく追っていきます。",
        "zh": "下一节是“栈与堆”。我们将详细追踪对象和局部变量分别存储在内存的什么地方（栈还是堆）。"
      }
    },
{
      "lessonId": "practice-ch04-lesson-002",
      "chapterId": "java-ch12",
      "order": 2,
      "title": {
        "ja": "スタックとヒープ",
        "zh": "栈と堆"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "スタックとヒープ",
        "pageStart": 64,
        "pageEnd": 64
      },
      "objectives": [
        {
          "ja": "「スタックとヒープ」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“栈と堆”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-002",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材64ページ「スタックとヒープ」: 教材64ページの「スタックとヒープ」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 64 页“栈と堆”：教材第 64 页的“栈と堆”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-002",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材64ページ「スタックとヒープ」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 64 页“栈と堆”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-002",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材64ページ「スタックとヒープ」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「スタックとヒープ」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 64 页“栈と堆”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“栈と堆”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-002",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材64ページ「スタックとヒープ」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 64 页“栈と堆”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-002",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材64ページ「スタックとヒープ」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 64 页“栈と堆”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「スタックとヒープ」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“栈と堆”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s002-example-01",
          "className": "JavaR7C12S002",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S002 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-0\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-002\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-002",
          "jaExplanation": "スタックとヒープをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“スタックとヒープ”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-002",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:64"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材64ページの節では、「スタックとヒープ」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 64 页对应的小节中，只记住“栈と堆”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材64ページの節では、「スタックとヒープ」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 64 页对应的小节中，在“栈と堆”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-002 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-002 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材64ページを確認してから、「スタックとヒープ」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 64 页，在“栈と堆”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「スタックとヒープ」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“栈と堆”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「空きメモリサイズの確認」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“空き内存サイズの確認”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-003",
      "chapterId": "java-ch12",
      "order": 3,
      "title": {
        "ja": "空きメモリサイズの確認",
        "zh": "空き内存サイズの確認"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "空きメモリサイズの確認",
        "pageStart": 65,
        "pageEnd": 65
      },
      "objectives": [
        {
          "ja": "「空きメモリサイズの確認」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“空き内存サイズの確認”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-003",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材65ページ「空きメモリサイズの確認」: 教材65ページの「空きメモリサイズの確認」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 65 页“空き内存サイズの確認”：教材第 65 页的“空き内存サイズの確認”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-003",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材65ページ「空きメモリサイズの確認」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 65 页“空き内存サイズの確認”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-003",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材65ページ「空きメモリサイズの確認」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「空きメモリサイズの確認」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 65 页“空き内存サイズの確認”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“空き内存サイズの確認”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-003",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材65ページ「空きメモリサイズの確認」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 65 页“空き内存サイズの確認”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-003",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材65ページ「空きメモリサイズの確認」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 65 页“空き内存サイズの確認”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「空きメモリサイズの確認」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“空き内存サイズの確認”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s003-example-01",
          "className": "JavaR7C12S003",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S003 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-1\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-003\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-003",
          "jaExplanation": "空きメモリサイズの確認をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“空き内存サイズの確認”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-003",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:65"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材65ページの節では、「空きメモリサイズの確認」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 65 页对应的小节中，只记住“空き内存サイズの確認”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材65ページの節では、「空きメモリサイズの確認」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 65 页对应的小节中，在“空き内存サイズの確認”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-003 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-003 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材65ページを確認してから、「空きメモリサイズの確認」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 65 页，在“空き内存サイズの確認”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「空きメモリサイズの確認」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“空き内存サイズの確認”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「使⽤できるサイズは有限」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“使用できるサイズは有限”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-004",
      "chapterId": "java-ch12",
      "order": 4,
      "title": {
        "ja": "使⽤できるサイズは有限",
        "zh": "使用できるサイズは有限"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "使⽤できるサイズは有限",
        "pageStart": 66,
        "pageEnd": 66
      },
      "objectives": [
        {
          "ja": "「使⽤できるサイズは有限」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“使用できるサイズは有限”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-004",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材66ページ「使⽤できるサイズは有限」: 教材66ページの「使⽤できるサイズは有限」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 66 页“使用できるサイズは有限”：教材第 66 页的“使用できるサイズは有限”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-004",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材66ページ「使⽤できるサイズは有限」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 66 页“使用できるサイズは有限”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-004",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材66ページ「使⽤できるサイズは有限」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「使⽤できるサイズは有限」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 66 页“使用できるサイズは有限”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“使用できるサイズは有限”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-004",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材66ページ「使⽤できるサイズは有限」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 66 页“使用できるサイズは有限”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-004",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材66ページ「使⽤できるサイズは有限」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 66 页“使用できるサイズは有限”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「使⽤できるサイズは有限」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“使用できるサイズは有限”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s004-example-01",
          "className": "JavaR7C12S004",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S004 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-2\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-004\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-004",
          "jaExplanation": "使⽤できるサイズは有限をコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“使用できるサイズは有限”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-004",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:66"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材66ページの節では、「使⽤できるサイズは有限」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 66 页对应的小节中，只记住“使用できるサイズは有限”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材66ページの節では、「使⽤できるサイズは有限」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 66 页对应的小节中，在“使用できるサイズは有限”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-004 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-004 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材66ページを確認してから、「使⽤できるサイズは有限」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 66 页，在“使用できるサイズは有限”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「使⽤できるサイズは有限」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“使用できるサイズは有限”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ガーベッジコレクション」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“垃圾回收”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-005",
      "chapterId": "java-ch12",
      "order": 5,
      "title": {
        "ja": "ガーベッジコレクション",
        "zh": "垃圾回收"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "ガーベッジコレクション",
        "pageStart": 67,
        "pageEnd": 67
      },
      "objectives": [
        {
          "ja": "「ガーベッジコレクション」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“垃圾回收”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-005",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材67ページ「ガーベッジコレクション」: 教材67ページの「ガーベッジコレクション」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 67 页“垃圾回收”：教材第 67 页的“垃圾回收”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-005",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材67ページ「ガーベッジコレクション」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 67 页“垃圾回收”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-005",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材67ページ「ガーベッジコレクション」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ガーベッジコレクション」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 67 页“垃圾回收”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“垃圾回收”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-005",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材67ページ「ガーベッジコレクション」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 67 页“垃圾回收”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-005",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材67ページ「ガーベッジコレクション」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 67 页“垃圾回收”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「ガーベッジコレクション」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“垃圾回收”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s005-example-01",
          "className": "JavaR7C12S005",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S005 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-3\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-005\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-005",
          "jaExplanation": "ガーベッジコレクションをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“垃圾回收”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-005",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:67"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材67ページの節では、「ガーベッジコレクション」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 67 页对应的小节中，只记住“垃圾回收”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材67ページの節では、「ガーベッジコレクション」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 67 页对应的小节中，在“垃圾回收”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-005 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-005 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材67ページを確認してから、「ガーベッジコレクション」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 67 页，在“垃圾回收”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ガーベッジコレクション」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“垃圾回收”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ガーベッジコレクションの対象になるタイミング」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“垃圾回收の対象になるタイミング”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-006",
      "chapterId": "java-ch12",
      "order": 6,
      "title": {
        "ja": "ガーベッジコレクションの対象になるタイミング",
        "zh": "垃圾回收の対象になるタイミング"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "ガーベッジコレクションの対象になるタイミング",
        "pageStart": 68,
        "pageEnd": 68
      },
      "objectives": [
        {
          "ja": "「ガーベッジコレクションの対象になるタイミング」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“垃圾回收の対象になるタイミング”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-006",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材68ページ「ガーベッジコレクションの対象になるタイミング」: 教材68ページの「ガーベッジコレクションの対象になるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 68 页“垃圾回收の対象になるタイミング”：教材第 68 页的“垃圾回收の対象になるタイミング”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-006",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材68ページ「ガーベッジコレクションの対象になるタイミング」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 68 页“垃圾回收の対象になるタイミング”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-006",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材68ページ「ガーベッジコレクションの対象になるタイミング」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ガーベッジコレクションの対象になるタイミング」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 68 页“垃圾回收の対象になるタイミング”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“垃圾回收の対象になるタイミング”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-006",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材68ページ「ガーベッジコレクションの対象になるタイミング」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 68 页“垃圾回收の対象になるタイミング”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-006",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材68ページ「ガーベッジコレクションの対象になるタイミング」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 68 页“垃圾回收の対象になるタイミング”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「ガーベッジコレクションの対象になるタイミング」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“垃圾回收の対象になるタイミング”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s006-example-01",
          "className": "JavaR7C12S006",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S006 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-4\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-006\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-006",
          "jaExplanation": "ガーベッジコレクションの対象になるタイミングをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“垃圾回收の対象になるタイミング”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-006",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:68"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材68ページの節では、「ガーベッジコレクションの対象になるタイミング」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 68 页对应的小节中，只记住“垃圾回收の対象になるタイミング”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材68ページの節では、「ガーベッジコレクションの対象になるタイミング」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 68 页对应的小节中，在“垃圾回收の対象になるタイミング”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-006 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-006 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材68ページを確認してから、「ガーベッジコレクションの対象になるタイミング」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 68 页，在“垃圾回收の対象になるタイミング”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ガーベッジコレクションの対象になるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“垃圾回收の対象になるタイミング”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ガーベッジコレクションの対象になるタイミング」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“垃圾回收の対象になるタイミング”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-007",
      "chapterId": "java-ch12",
      "order": 7,
      "title": {
        "ja": "ガーベッジコレクションの対象になるタイミング",
        "zh": "垃圾回收の対象になるタイミング"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "ガーベッジコレクションの対象になるタイミング",
        "pageStart": 69,
        "pageEnd": 69
      },
      "objectives": [
        {
          "ja": "「ガーベッジコレクションの対象になるタイミング」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“垃圾回收の対象になるタイミング”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-007",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材69ページ「ガーベッジコレクションの対象になるタイミング」: 教材69ページの「ガーベッジコレクションの対象になるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 69 页“垃圾回收の対象になるタイミング”：教材第 69 页的“垃圾回收の対象になるタイミング”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-007",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材69ページ「ガーベッジコレクションの対象になるタイミング」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 69 页“垃圾回收の対象になるタイミング”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-007",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材69ページ「ガーベッジコレクションの対象になるタイミング」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ガーベッジコレクションの対象になるタイミング」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 69 页“垃圾回收の対象になるタイミング”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“垃圾回收の対象になるタイミング”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-007",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材69ページ「ガーベッジコレクションの対象になるタイミング」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 69 页“垃圾回收の対象になるタイミング”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-007",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材69ページ「ガーベッジコレクションの対象になるタイミング」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 69 页“垃圾回收の対象になるタイミング”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「ガーベッジコレクションの対象になるタイミング」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“垃圾回收の対象になるタイミング”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s007-example-01",
          "className": "JavaR7C12S007",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S007 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-5\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-007\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-007",
          "jaExplanation": "ガーベッジコレクションの対象になるタイミングをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“垃圾回收の対象になるタイミング”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-007",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:69"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材69ページの節では、「ガーベッジコレクションの対象になるタイミング」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 69 页对应的小节中，只记住“垃圾回收の対象になるタイミング”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材69ページの節では、「ガーベッジコレクションの対象になるタイミング」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 69 页对应的小节中，在“垃圾回收の対象になるタイミング”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-007 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-007 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材69ページを確認してから、「ガーベッジコレクションの対象になるタイミング」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 69 页，在“垃圾回收の対象になるタイミング”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ガーベッジコレクションの対象になるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“垃圾回收の対象になるタイミング”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「ガーベッジコレクションが実⾏されるタイミング」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“垃圾回收が実行されるタイミング”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    },
    {
      "lessonId": "practice-ch04-lesson-008",
      "chapterId": "java-ch12",
      "order": 8,
      "title": {
        "ja": "ガーベッジコレクションが実⾏されるタイミング",
        "zh": "垃圾回收が実行されるタイミング"
      },
      "sourceRef": {
        "sourceId": "java_practice_tsukuba",
        "chapter": "第4章 ガーベッジコレクションとメモリ",
        "section": "ガーベッジコレクションが実⾏されるタイミング",
        "pageStart": 70,
        "pageEnd": 70
      },
      "objectives": [
        {
          "ja": "「ガーベッジコレクションが実⾏されるタイミング」がコレクションのどの場面で必要になるかを説明できる。",
          "zh": "能说明“垃圾回收が実行されるタイミング”在集合框架的什么场景中会用到。"
        },
        {
          "ja": "短いJavaコードを読み、ArrayList、Map、Setと出力結果を根拠つきで結びつけられる。",
          "zh": "能阅读短 Java 代码，并有依据地把ArrayList、Map、Set和输出结果联系起来。"
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
          "semanticKey": "goal-practice-ch04-lesson-008",
          "type": "learning-goal",
          "title": {
            "ja": "この節のねらい",
            "zh": "本节目标"
          },
          "ja": "教材70ページ「ガーベッジコレクションが実⾏されるタイミング」: 教材70ページの「ガーベッジコレクションが実⾏されるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法を確認します。最初は暗記よりも、どの行で何が決まるかをゆっくり追います。",
          "zh": "教材第 70 页“垃圾回收が実行されるタイミング”：教材第 70 页的“垃圾回收が実行されるタイミング”用于理解：用 List、Map、Set 管理数量会变化的数据。零基础学习时先不要背术语，先确认每一行决定了什么。"
        },
        {
          "semanticKey": "mechanic-practice-ch04-lesson-008",
          "type": "mechanic",
          "title": {
            "ja": "コードで見るポイント",
            "zh": "从代码看重点"
          },
          "ja": "教材70ページ「ガーベッジコレクションが実⾏されるタイミング」: この節の読み方は、追加、取得、走査、型パラメータを対応させることです。サンプルでは ArrayList<String> に注目し、ArrayList、Map、Setがどこに現れるかを探します。",
          "zh": "教材第 70 页“垃圾回收が実行されるタイミング”：本节的读法是：对应添加、读取、遍历和类型参数。示例里先看 ArrayList<String>，再找出 ArrayList、Map、Set 出现的位置。"
        },
        {
          "semanticKey": "beginner-practice-ch04-lesson-008",
          "type": "beginner-note",
          "title": {
            "ja": "ゼロから読む順番",
            "zh": "零基础阅读顺序"
          },
          "ja": "教材70ページ「ガーベッジコレクションが実⾏されるタイミング」: 初心者は「入力値 -> 処理 -> 出力」の順で見ます。「ガーベッジコレクションが実⾏されるタイミング」はその中でコレクションを理解するための手がかりになります。",
          "zh": "教材第 70 页“垃圾回收が実行されるタイミング”：初学者可以按“输入值 -> 处理 -> 输出”的顺序看。“垃圾回收が実行されるタイミング”就是理解集合框架的线索。"
        },
        {
          "semanticKey": "risk-practice-ch04-lesson-008",
          "type": "pitfall",
          "title": {
            "ja": "つまずきやすい点",
            "zh": "容易卡住的点"
          },
          "ja": "教材70ページ「ガーベッジコレクションが実⾏されるタイミング」: ここでの典型的なミスは、添字アクセスとキーアクセスを混同しやすい点です。出力の先頭は size=2 なので、なぜその行になるかをコードに戻って説明します。",
          "zh": "教材第 70 页“垃圾回收が実行されるタイミング”：这里常见的错误是：容易混淆下标访问和 key 访问。本例输出第一行是 size=2，要能回到代码说明为什么得到这一行。"
        },
        {
          "semanticKey": "practice-practice-ch04-lesson-008",
          "type": "practice-prep",
          "title": {
            "ja": "手を動かす前に",
            "zh": "动手前确认"
          },
          "ja": "教材70ページ「ガーベッジコレクションが実⾏されるタイミング」: このミニ例は教材本文の写しではなく、要素を追加してsizeを確認するための確認用です。変更する前に、今の出力を一度自分で予想してください。",
          "zh": "教材第 70 页“垃圾回收が実行されるタイミング”：这个小例子不是教材原文复制，而是用来添加元素并确认 size。修改代码前，先自己预测当前输出。"
        }
      ],
      "terms": [
        {
          "en": "collection",
          "ja": "コレクション",
          "zh": "集合框架",
          "explanationJa": "「ガーベッジコレクションが実⾏されるタイミング」を読む中心語です。言葉だけでなく、サンプルのどの行で働くかを確認します。",
          "explanationZh": "这是阅读“垃圾回收が実行されるタイミング”时的核心术语。不要只记词义，还要确认它在示例哪一行发挥作用。"
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
          "exampleId": "practice-ch04-s008-example-01",
          "className": "JavaR7C12S008",
          "runnable": true,
          "code": "import java.util.ArrayList;\npublic class JavaR7C12S008 {\n  public static void main(String[] args) {\n    ArrayList<String> items = new ArrayList<>();\n    items.add(\"java\");\n    items.add(\"list-6\");\n    System.out.println(\"size=\" + items.size());\n    System.out.println(\"first=\" + items.get(0));\n    System.out.println(\"lesson=practice-ch04-lesson-008\");\n  }\n}\n",
          "expectedOutput": "size=2\nfirst=java\nlesson=practice-ch04-lesson-008",
          "jaExplanation": "ガーベッジコレクションが実⾏されるタイミングをコンソールで確認するための最小例です。",
          "zhExplanation": "这是用控制台确认“垃圾回收が运行されるタイミング”的最小示例。",
          "lineNotes": [
            {
              "line": 4,
              "snippet": "ArrayList<String>",
              "ja": "ArrayListは数が変わる文字列の集まりを扱えます。",
              "zh": "ArrayList 可以处理数量会变化的字符串集合。"
            },
            {
              "line": 5,
              "snippet": "items.add",
              "ja": "addで末尾に要素を追加します。",
              "zh": "用 add 在末尾追加元素。"
            },
            {
              "line": 8,
              "snippet": "items.get(0)",
              "ja": "get(0)で最初の要素を取り出します。",
              "zh": "用 get(0) 取出第一个元素。"
            },
            {
              "line": 9,
              "snippet": "lesson=practice-ch04-lesson-008",
              "ja": "最後の行で、このサンプルがどの節の確認用かを出力します。",
              "zh": "最后一行输出本示例对应的课程小节，便于对照预期输出。"
            }
          ],
          "sourceSectionRef": "java_practice_tsukuba:70"
        }
      ],
      "commonMistakes": [
        {
          "ja": "教材70ページの節では、「ガーベッジコレクションが実⾏されるタイミング」という用語だけを覚え、ArrayList、Map、Setがコードのどこにあるか確認しない。",
          "zh": "在教材第 70 页对应的小节中，只记住“垃圾回收が実行されるタイミング”这个词，却不确认ArrayList、Map、Set在代码中的位置。"
        },
        {
          "ja": "教材70ページの節では、「ガーベッジコレクションが実⾏されるタイミング」では、添字アクセスとキーアクセスを混同しやすい点を見落とし、出力だけを丸暗記してしまう。",
          "zh": "在教材第 70 页对应的小节中，在“垃圾回收が実行されるタイミング”这一节，忽略容易混淆下标访问和 key 访问，只把输出结果背下来。"
        },
        {
          "ja": "lesson=practice-ch04-lesson-008 まで含めて出力を確認せず、期待される出力「size=2」を、どの行が作ったか説明しないまま次へ進む。",
          "zh": "没有核对 lesson=practice-ch04-lesson-008 这一行，就看到预期输出“size=2”后，没有说明是哪一行生成的就继续往下学。"
        }
      ],
      "handson": {
        "ja": "教材70ページを確認してから、「ガーベッジコレクションが実⾏されるタイミング」のサンプルで、コレクションに入れる要素を1か所だけ変更し、変更前後の期待出力を2行でメモしてください。",
        "zh": "先对照教材第 70 页，在“垃圾回收が実行されるタイミング”这一节，只修改放入集合中的元素中的一处，并用两行记录修改前后的预期输出。"
      },
      "summary": {
        "ja": "「ガーベッジコレクションが実⾏されるタイミング」では、数が変わるデータをList、Map、Setなどで扱う方法をコードと出力で結びつけました。次に読む時も、用語 -> 行 -> 出力の順で確認します。",
        "zh": "“垃圾回收が実行されるタイミング”这一节已经把用 List、Map、Set 管理数量会变化的数据和代码、输出联系起来。下次阅读时仍按“术语 -> 代码行 -> 输出”的顺序确认。"
      },
      "nextLessonBridge": {
        "ja": "次は「⼤きさの変わる配列」です。本節のコレクションの読み方を使って、新しいコードの変化を比べます。",
        "zh": "下一节是“大きさの変わる数组”。请沿用本节对集合框架的读法，比较新代码发生了什么变化。"
      }
    }
  ]
};
