module.exports = {
  chapter: {
    chapterId: 'python-foundations-b-ch01',
    chapterOrder: 2,
    title: {
      ja: '入力から関数と class へ',
      zh: '从输入走向函数与 class'
    },
    description: {
      ja: 'Domain1B の辞書のあと、対話・分解・小さな状態を順に扱う。',
      zh: '在 Domain1B 的字典之后，依次学习交互、分解和小型状态。'
    },
    shard: 'python-foundations-b-ch01.js',
    sections: [
      {
        sectionId: 'python-domain1c-input-while',
        lessonId: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
        order: 7,
        title: {
          ja: 'input() と while で、決まった回数の対話を作る',
          zh: '用 input() 和 while 做一段可控交互'
        },
        runnableExampleCount: 1
      },
      {
        sectionId: 'python-functions-small-steps',
        lessonId: 'python-0014-75c7d812-第-8-章-函数',
        order: 8,
        title: {
          ja: 'function で処理に名前を付け、同じ形で再利用する',
          zh: '用 function 给处理命名，并按同一形状复用'
        },
        runnableExampleCount: 1
      },
      {
        sectionId: 'python-class-small-state',
        lessonId: 'python-0015-0f96233e-第-9-章-类',
        order: 9,
        title: {
          ja: 'class で data と動きを一つの小さな型にまとめる',
          zh: '用 class 把 data 和行为合成一个小型类型'
        },
        runnableExampleCount: 1
      }
    ]
  },
  lessons: [
    {
      lessonId: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
      chapterId: 'python-foundations-b-ch01',
      order: 7,
      title: {
        ja: 'input() と while で、決まった回数の対話を作る',
        zh: '用 input() 和 while 做一段可控交互'
      },
      objectives: [
        {
          ja: 'input() が文字列を受け取り、必要な型へ変換してから使う流れを説明できる。',
          zh: '能说明 input() 先收到字符串，再按需要转换类型后使用的流程。'
        },
        {
          ja: 'while の条件を更新し、終わりがある loop として安全に読める。',
          zh: '能更新 while 条件，把循环读成一个有结束点的安全 loop。'
        }
      ],
      prerequisites: [
        {
          ja: 'print()、変数、if、list、dictionary の基本を見たあとなら始められます。',
          zh: '已经看过 print()、变量、if、list、dictionary 的基本用法后即可开始。'
        }
      ],
      blocks: [
        {
          semanticKey: 'why-controlled-input',
          type: 'why',
          title: {
            ja: 'なぜ入力を決めてから練習するのか',
            zh: '为什么先把输入固定下来练习'
          },
          ja: '本物のアプリでは user input が毎回変わります。でも学習では、まず同じ sample input を使うと、loop が何回動き、どの output が出るかを安定して確認できます。',
          zh: '真实应用里的 user input 每次可能不同。但学习时先使用同一组 sample input，就能稳定确认 loop 会运行几次、产生哪些 output。'
        },
        {
          semanticKey: 'mental-input-loop-counter',
          type: 'mental-model',
          title: {
            ja: '入力、変換、回数カウンタ',
            zh: '输入、转换、次数计数器'
          },
          ja: 'input() は外から届いた文字を受け取る入口です。数字として比べたいときは int() で変換し、counter を 1 ずつ進めると while は終点に近づきます。',
          zh: 'input() 是接收外部文字的入口。需要当数字比较时用 int() 转换；counter 每次加 1，while 就会逐步接近终点。'
        },
        {
          semanticKey: 'flow-prompt-count-finish',
          type: 'execution-flow',
          title: {
            ja: '初期状態から終了まで',
            zh: '从初始状态到结束'
          },
          ja: '最初に name と回数を読みます。round_number は 1 から始まり、出力するたびに 1 増えます。count を超えた瞬間、条件が false になって loop を抜けます。',
          zh: '一开始读取 name 和次数。round_number 从 1 开始，每输出一次就加 1；当它超过 count 时，条件变成 false，程序退出 loop。'
        }
      ],
      terms: [
        {
          ja: '入力',
          zh: '输入',
          en: 'input',
          explanationJa: 'プログラムの外から届く文字列です。この節では sampleInput で固定します。',
          explanationZh: '从程序外部进入的字符串。本节用 sampleInput 固定它。'
        },
        {
          ja: 'while ループ',
          zh: 'while 循环',
          en: 'while loop',
          explanationJa: '条件が true の間だけ同じ block を繰り返す構文です。',
          explanationZh: '只要条件为 true，就重复执行同一个 block 的结构。'
        },
        {
          ja: 'カウンタ',
          zh: '计数器',
          en: 'counter',
          explanationJa: 'loop の進み具合を数えるための変数です。',
          explanationZh: '用于记录 loop 进展程度的变量。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-domain1c-safe-input-while',
          code: 'name = input("name: ")\ncount_text = input("practice count: ")\ncount = int(count_text)\nround_number = 1\nwhile round_number <= count:\n    print(f"{round_number}: {name} practices Python")\n    round_number += 1\nprint("loop complete")',
          sampleInput: 'Coco\n3',
          expectedOutput: 'name: practice count: 1: Coco practices Python\n2: Coco practices Python\n3: Coco practices Python\nloop complete',
          lineNotes: [
            {
              line: 1,
              ja: '1 行目は名前を文字列として受け取ります。',
              zh: '第 1 行把名字作为字符串接收。'
            },
            {
              line: 2,
              ja: '2 行目も文字列なので、まだ数として比較できません。',
              zh: '第 2 行同样先得到字符串，还不能直接当数字比较。'
            },
            {
              line: 3,
              ja: 'int() で回数を整数に変換します。',
              zh: '用 int() 把次数转换成整数。'
            },
            {
              line: 5,
              ja: 'while は round_number が count 以下の間だけ続きます。',
              zh: 'while 只在 round_number 小于等于 count 时继续。'
            },
            {
              line: 7,
              ja: 'counter を増やさないと、条件が変わらず終わりません。',
              zh: '如果不增加 counter，条件不会变化，循环也不会结束。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'input() の戻り値をすぐ数として扱うと、文字列と数の違いでつまずきます。',
          zh: '把 input() 的返回值立刻当数字用，会在字符串和数字的差异上出错。'
        },
        {
          ja: 'while の中で counter を更新し忘れると、同じ条件がずっと true のままになります。',
          zh: '忘记在 while 里面更新 counter，条件就可能一直保持 true。'
        },
        {
          ja: 'sample input の行数より input() が多いと、プログラムは次の入力を待ち続けます。',
          zh: '如果 input() 次数多于 sample input 的行数，程序会继续等待下一次输入。'
        }
      ],
      handson: {
        ja: 'sampleInput の 2 行目を 2 に変えて、出力行数がどう変わるか確認しましょう。',
        zh: '把 sampleInput 第 2 行改成 2，确认输出行数如何变化。',
        action: {
          ja: 'practice count を 3 から 2 に変え、code はそのまま実行します。',
          zh: '把 practice count 从 3 改成 2，代码本身不变后运行。'
        },
        expectedObservation: {
          ja: 'practice の行は 1 と 2 だけになり、最後の loop complete はそのまま出ます。',
          zh: 'practice 行只剩 1 和 2，最后的 loop complete 仍然会输出。'
        }
      },
      summary: {
        ja: 'input() は外から文字列を受け取り、while は更新される条件で繰り返しを制御します。',
        zh: 'input() 从外部接收字符串，while 用会更新的条件控制重复执行。'
      },
      nextLessonBridge: {
        ja: '次は、同じ形の処理に名前を付け、function として何度も使えるようにします。',
        zh: '下一节会给同一形状的处理起名字，把它变成可以多次使用的 function。'
      }
    },
    {
      lessonId: 'python-0014-75c7d812-第-8-章-函数',
      chapterId: 'python-foundations-b-ch01',
      order: 8,
      title: {
        ja: 'function で処理に名前を付け、同じ形で再利用する',
        zh: '用 function 给处理命名，并按同一形状复用'
      },
      objectives: [
        {
          ja: 'def で処理の入口を作り、parameter と return value の役割を説明できる。',
          zh: '能用 def 创建处理入口，并说明 parameter 与 return value 的作用。'
        },
        {
          ja: '同じ形の処理を function に分け、呼び出し側の code を読みやすくできる。',
          zh: '能把相同形状的处理拆成 function，让调用侧代码更易读。'
        }
      ],
      prerequisites: [
        {
          ja: '変数、文字列、数値、input の値を順番に追える状態なら始められます。',
          zh: '只要能按顺序追踪变量、字符串、数值和 input 的值，就可以开始。'
        }
      ],
      blocks: [
        {
          semanticKey: 'why-name-a-process',
          type: 'why',
          title: {
            ja: 'なぜ処理に名前を付けるのか',
            zh: '为什么要给处理起名字'
          },
          ja: '同じ形の code を何度も直接書くと、直す場所が増えます。function にすると、何をしたい処理なのかを名前で読めて、使う側の script が短くなります。',
          zh: '如果同一形状的 code 到处重复，修改点会变多。做成 function 后，可以通过名字读懂它要做什么，调用侧 script 也会变短。'
        },
        {
          semanticKey: 'mental-function-door',
          type: 'mental-model',
          title: {
            ja: '入口と出口として見る',
            zh: '把 function 看成入口和出口'
          },
          ja: 'parameter は function に渡す入口です。return は外へ返す出口です。中の処理は名前の内側に閉じ込め、呼び出し側は結果だけを受け取ります。',
          zh: 'parameter 是传入 function 的入口，return 是把结果送回外面的出口。内部处理被封装在名字里，调用侧只接收结果。'
        },
        {
          semanticKey: 'flow-call-return-print',
          type: 'execution-flow',
          title: {
            ja: '呼び出しから出力まで',
            zh: '从调用到输出'
          },
          ja: 'script は def の中身を先に登録します。function call が来たときだけ中へ入り、return value を作って呼び出し元へ戻します。',
          zh: 'script 会先注册 def 里面的内容。只有遇到 function call 时才进入函数内部，生成 return value 后回到调用位置。'
        }
      ],
      terms: [
        {
          ja: '関数',
          zh: '函数',
          en: 'function',
          explanationJa: '名前を付けた再利用できる処理のまとまりです。',
          explanationZh: '一组有名字、可以复用的处理。'
        },
        {
          ja: '引数',
          zh: '参数',
          en: 'parameter',
          explanationJa: 'function の入口で受け取る値です。',
          explanationZh: 'function 入口接收的值。'
        },
        {
          ja: '戻り値',
          zh: '返回值',
          en: 'return value',
          explanationJa: 'function の処理が外へ返す結果です。',
          explanationZh: 'function 处理完成后返回到外部的结果。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-functions-status-total',
          code: 'def make_status(name, minutes):\n    return f"{name}: {minutes} min"\n\ndef total_minutes(first, second):\n    return first + second\n\nmorning = make_status("reading", 15)\nevening = make_status("coding", 25)\nprint(morning)\nprint(evening)\nprint("total:", total_minutes(15, 25))',
          expectedOutput: 'reading: 15 min\ncoding: 25 min\ntotal: 40',
          lineNotes: [
            {
              line: 1,
              ja: 'make_status は名前と分数を受け取る入口を持ちます。',
              zh: 'make_status 有两个入口：名称和分钟数。'
            },
            {
              line: 2,
              ja: 'return は表示ではなく、文字列の結果を呼び出し元へ返します。',
              zh: 'return 不是显示，而是把字符串结果交回调用位置。'
            },
            {
              line: 4,
              ja: 'total_minutes は数値を足す処理だけに集中しています。',
              zh: 'total_minutes 只专注于把数值相加。'
            },
            {
              line: 7,
              ja: 'function call の結果を morning という名前に保存します。',
              zh: '把 function call 的结果保存到 morning 这个名字里。'
            },
            {
              line: 11,
              ja: 'print は return value を受け取ってから画面へ出します。',
              zh: 'print 接收 return value 后再输出到屏幕。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'function の中で print だけを書くと、呼び出し元で再利用できる値が残りません。',
          zh: '如果 function 里面只 print，调用侧就拿不到可复用的值。'
        },
        {
          ja: 'parameter の順番を呼び出し側で入れ替えると、意味が変わります。',
          zh: '调用时把 parameter 顺序弄反，含义也会改变。'
        },
        {
          ja: 'def の block をインデントしないと、Python は function の中身として読めません。',
          zh: '如果 def 的 block 没有缩进，Python 就不会把它读成 function 内部。'
        }
      ],
      handson: {
        ja: 'make_status に "review", 10 を渡す行を追加し、3 つ目の活動を表示してみましょう。',
        zh: '新增一行，把 "review", 10 传给 make_status，并显示第 3 个活动。',
        action: {
          ja: 'review = make_status("review", 10) を作り、print(review) を evening の後に置きます。',
          zh: '创建 review = make_status("review", 10)，并把 print(review) 放到 evening 后面。'
        },
        expectedObservation: {
          ja: 'reading と coding の間の仕組みは変わらず、review: 10 min が新しい行として増えます。',
          zh: 'reading 和 coding 的机制不变，只会多出 review: 10 min 这一行。'
        }
      },
      summary: {
        ja: 'function は処理に名前を付け、parameter を受け取り、return value を呼び出し元へ返します。',
        zh: 'function 给处理命名，接收 parameter，并把 return value 返回给调用侧。'
      },
      nextLessonBridge: {
        ja: '次は、function だけでなく data と動きを一緒に置く class を見ます。',
        zh: '下一节会看 class：不只放 function，还把 data 和行为放在一起。'
      }
    },
    {
      lessonId: 'python-0015-0f96233e-第-9-章-类',
      chapterId: 'python-foundations-b-ch01',
      order: 9,
      title: {
        ja: 'class で data と動きを一つの小さな型にまとめる',
        zh: '用 class 把 data 和行为合成一个小型类型'
      },
      objectives: [
        {
          ja: 'class、instance、attribute、method の関係を小さな状態変化で説明できる。',
          zh: '能通过小型状态变化说明 class、instance、attribute、method 的关系。'
        },
        {
          ja: '__init__() で初期状態を作り、method で instance の状態を変えられる。',
          zh: '能用 __init__() 创建初始状态，并用 method 改变 instance 的状态。'
        }
      ],
      prerequisites: [
        {
          ja: 'function の parameter と return value、dictionary の key/value を追えれば始められます。',
          zh: '只要能追踪 function 的 parameter / return value，以及 dictionary 的 key/value，就可以开始。'
        }
      ],
      blocks: [
        {
          semanticKey: 'why-class-keeps-state',
          type: 'why',
          title: {
            ja: 'なぜ data と動きを一緒に置くのか',
            zh: '为什么把 data 和行为放在一起'
          },
          ja: 'function だけでも処理は書けますが、同じ対象の状態を何度も更新するときは、data と操作を近くに置く方が読みやすくなります。class はその小さなまとまりを作ります。',
          zh: '只用 function 也能写处理，但当同一个对象的状态会被多次更新时，把 data 和操作放近一点更容易读。class 就是在创建这种小型组合。'
        },
        {
          semanticKey: 'mental-blueprint-instance',
          type: 'mental-model',
          title: {
            ja: '設計図と実物として見る',
            zh: '把 class 看成设计图，把 instance 看成实物'
          },
          ja: 'class は設計図です。instance はその設計図から作った実物です。attribute は実物が持つ状態で、method はその状態を読む・変える動きです。',
          zh: 'class 是设计图，instance 是按设计图创建出来的实物。attribute 是实物持有的状态，method 是读取或改变状态的动作。'
        },
        {
          semanticKey: 'flow-init-add-label',
          type: 'execution-flow',
          title: {
            ja: '初期化から状態更新まで',
            zh: '从初始化到状态更新'
          },
          ja: 'StudyTimer("Python") で instance が作られ、__init__() が name と minutes を用意します。add() は minutes を増やし、label() は今の状態を文字列にします。',
          zh: 'StudyTimer("Python") 创建 instance，__init__() 准备 name 和 minutes。add() 增加 minutes，label() 把当前状态变成字符串。'
        }
      ],
      terms: [
        {
          ja: 'クラス',
          zh: '类',
          en: 'class',
          explanationJa: 'data と method の形をまとめる設計図です。',
          explanationZh: '把 data 和 method 的形状组织在一起的设计图。'
        },
        {
          ja: 'インスタンス',
          zh: '实例',
          en: 'instance',
          explanationJa: 'class から作られた具体的な object です。',
          explanationZh: '由 class 创建出来的具体 object。'
        },
        {
          ja: '属性',
          zh: '属性',
          en: 'attribute',
          explanationJa: 'instance が持つ名前付きの状態です。',
          explanationZh: 'instance 持有的、有名字的状态。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-class-study-timer',
          code: 'class StudyTimer:\n    def __init__(self, name):\n        self.name = name\n        self.minutes = 0\n\n    def add(self, minutes):\n        self.minutes += minutes\n\n    def label(self):\n        return f"{self.name}: {self.minutes} min"\n\ntimer = StudyTimer("Python")\ntimer.add(20)\nprint(timer.label())\ntimer.add(10)\nprint(timer.label())',
          expectedOutput: 'Python: 20 min\nPython: 30 min',
          lineNotes: [
            {
              line: 1,
              ja: 'StudyTimer という新しい class の形を定義します。',
              zh: '定义一个名为 StudyTimer 的新 class 形状。'
            },
            {
              line: 2,
              ja: '__init__() は instance が作られた直後に初期状態を用意します。',
              zh: '__init__() 在 instance 刚创建后准备初始状态。'
            },
            {
              line: 4,
              ja: 'minutes はこの instance が覚えている累計時間です。',
              zh: 'minutes 是这个 instance 记住的累计时间。'
            },
            {
              line: 6,
              ja: 'add() は外から渡された分数を現在の状態に足します。',
              zh: 'add() 把外部传入的分钟数加到当前状态上。'
            },
            {
              line: 12,
              ja: 'timer は StudyTimer class から作られた具体的な instance です。',
              zh: 'timer 是由 StudyTimer class 创建出来的具体 instance。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'self を忘れると、method がどの instance の状態を使うのか分からなくなります。',
          zh: '忘记 self 时，method 就不知道要使用哪个 instance 的状态。'
        },
        {
          ja: '__init__ の名前や下線を間違えると、初期状態が期待どおり作られません。',
          zh: '把 __init__ 的名字或下划线写错，初始状态就不会按预期创建。'
        },
        {
          ja: 'class の attribute と普通の局所変数を混同すると、状態が保存されている場所を見失います。',
          zh: '混淆 class 的 attribute 和普通局部变量，会看不清状态到底保存在哪里。'
        }
      ],
      handson: {
        ja: 'timer.add(5) を最後にもう一度追加し、累計がどう変わるか確認しましょう。',
        zh: '在最后再追加一次 timer.add(5)，确认累计值如何变化。',
        action: {
          ja: '最後の print の前ではなく後ろに add(5) と print(timer.label()) を追加します。',
          zh: '不要加在最后一次 print 前面，而是在后面追加 add(5) 和 print(timer.label())。'
        },
        expectedObservation: {
          ja: '既存の 20 min、30 min の出力に続いて、Python: 35 min が追加で表示されます。',
          zh: '原来的 20 min、30 min 输出之后，会新增 Python: 35 min。'
        }
      },
      summary: {
        ja: 'class は data と method を一緒に置き、instance ごとの状態を読みやすく管理します。',
        zh: 'class 把 data 和 method 放在一起，让每个 instance 的状态更容易管理。'
      },
      nextLessonBridge: {
        ja: '次の候補は file と exception を含むため、asset と実行安全性を別ラウンドで扱います。',
        zh: '下一个候选包含 file 与 exception，需要在单独的 asset / 执行安全轮次中处理。'
      }
    }
  ]
};
