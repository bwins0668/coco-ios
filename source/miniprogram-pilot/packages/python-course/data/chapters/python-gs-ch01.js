module.exports = {
  chapter: {
    chapterId: 'python-gs-ch01',
    chapterOrder: 1,
    title: {
      ja: '最初の script と value',
      zh: '第一段脚本与值'
    },
    description: {
      ja: 'Python を小さく実行し、画面に出る結果と value の置き場所を分けて考える。',
      zh: '用很小的 Python 代码开始，分清屏幕输出和值的存放位置。'
    },
    shard: 'python-gs-ch01.js',
    sections: [
      {
        sectionId: 'python-gs1',
        lessonId: 'python-0007-gs1-run-visible-output',
        order: 1,
        title: {
          ja: 'Pythonスクリプトを動かして、見える結果を出す',
          zh: '运行 Python 脚本，得到看得见的结果'
        },
        runnableExampleCount: 1
      },
      {
        sectionId: 'python-gs2',
        lessonId: 'python-0008-gs2-values-and-variables',
        order: 2,
        title: {
          ja: '値を名前に入れて、あとから使う',
          zh: '把值放进名字里，再拿出来使用'
        },
        runnableExampleCount: 1
      },
      {
        sectionId: 'python-domain1a-list-intro',
        lessonId: 'python-0009-7d37969c-第-3-章-列表简介',
        order: 3,
        title: {
          ja: 'リストで複数の値を一つの名前にまとめる',
          zh: '用列表把多个值放在同一个名字下'
        },
        runnableExampleCount: 1
      },
      {
        sectionId: 'python-domain1a-list-operations',
        lessonId: 'python-0010-921b265b-第-4-章-操作列表',
        order: 4,
        title: {
          ja: 'リストを変えて、順番と中身の変化を見る',
          zh: '操作列表，观察顺序和内容怎样变化'
        },
        runnableExampleCount: 1
      },
        {
          sectionId: 'python-domain1a-if-statements',
          lessonId: 'python-0011-5c80c609-第-5-章-if语句',
          order: 5,
          title: {
            ja: 'if 文で条件に合う道を選ぶ',
            zh: '用 if 语句根据条件选择路径'
          },
          runnableExampleCount: 1
        },
        {
          sectionId: 'python-domain1b-dictionaries',
          lessonId: 'python-0012-5cc0ecc6-第-6-章-字典',
          order: 6,
          title: {
            ja: '辞書で key から value を取り出す',
            zh: '用字典通过 key 找到 value'
          },
          runnableExampleCount: 1
        }
      ]
  },
  lessons: [
    {
      lessonId: 'python-0007-gs1-run-visible-output',
      chapterId: 'python-gs-ch01',
      order: 1,
      title: {
        ja: 'Pythonスクリプトを動かして、見える結果を出す',
        zh: '运行 Python 脚本，得到看得见的结果'
      },
      objectives: [
        {
          ja: 'Python の script が上から順に実行され、print() の行が画面の出力になることを説明できる。',
          zh: '能说明 Python script 会从上到下执行，而 print() 这一行会变成屏幕上的输出。'
        },
        {
          ja: 'interpreter がコードを読み、statement ごとに処理して visible output を作る流れを追える。',
          zh: '能跟踪 interpreter 读取代码、逐条处理 statement、生成可见输出的过程。'
        }
      ],
      prerequisites: [
        {
          ja: 'Python 3.11 を実行できる環境と、短い文字列を入力できる editor があれば十分です。',
          zh: '只需要能运行 Python 3.11，并且有一个能输入短字符串的编辑器。'
        }
      ],
      blocks: [
        {
          semanticKey: 'why-output-first',
          type: 'why',
          title: {
            ja: 'なぜ最初に出力を見るのか',
            zh: '为什么先看输出'
          },
          ja: '最初の学習では、頭の中だけで「動いたはず」と思うより、画面に出た文字を確認する方が安全です。print() は、script の中の statement が本当に実行されたことを見せてくれます。',
          zh: '刚开始学习时，不要只在脑子里觉得“应该运行了”。先让屏幕出现文字，才能确认 statement 真的被执行了；print() 就是最小的可见反馈。'
        },
        {
          semanticKey: 'mental-script-flow',
          type: 'mental-model',
          title: {
            ja: '心の中のモデル',
            zh: '心智模型'
          },
          ja: 'script は上から下へ並んだ instruction の列です。interpreter は一行を読み、statement として処理し、必要なら output を外に出します。',
          zh: '可以把 script 想成从上到下排列的指令队列。interpreter 每次读一行，把它当作 statement 处理，需要显示时才把结果送到屏幕。'
        },
        {
          semanticKey: 'flow-read-run-show',
          type: 'execution-flow',
          title: {
            ja: '初期状態から出力まで',
            zh: '从初始状态到输出'
          },
          ja: '実行前、画面にはまだ何もありません。1 行目の print() が終わると最初の文字が出ます。同じ流れを 2 行目、3 行目、4 行目で繰り返します。',
          zh: '运行前，屏幕上还没有这段程序的结果。第 1 行 print() 完成后出现第一行文字，后面的第 2、3、4 行按同样顺序继续输出。'
        }
      ],
      terms: [
        {
          ja: 'Python',
          zh: 'Python 语言',
          en: 'Python',
          explanationJa: '読みやすさを大切にした programming language です。この節では小さな script を実行します。',
          explanationZh: '一种重视可读性的 programming language。本节只运行一段很小的 script。'
        },
        {
          ja: 'インタプリタ',
          zh: '解释器',
          en: 'interpreter',
          explanationJa: 'Python の statement を読み、順番に実行する役目です。',
          explanationZh: '负责读取 Python statement，并按顺序执行。'
        },
        {
          ja: '文',
          zh: '语句',
          en: 'statement',
          explanationJa: 'Python に「これをして」と伝える一つの命令です。',
          explanationZh: '告诉 Python “做这件事”的一条命令。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-gs1-visible-output',
          code: 'print("Python script starts")\nprint("interpreter reads line 2")\nprint("statement creates output")\nprint("visible result appears")',
          expectedOutput: 'Python script starts\ninterpreter reads line 2\nstatement creates output\nvisible result appears',
          lineNotes: [
            {
              line: 1,
              ja: '1 行目は script が始まったことを、そのまま画面へ出します。',
              zh: '第 1 行把脚本开始这件事直接输出到屏幕。'
            },
            {
              line: 2,
              ja: '2 行目は interpreter が次の statement に進んだことを見せます。',
              zh: '第 2 行展示 interpreter 已经进入下一条 statement。'
            },
            {
              line: 3,
              ja: '3 行目では statement が output を作る、という関係を言葉で確認します。',
              zh: '第 3 行用文字确认 statement 会生成 output 这一关系。'
            },
            {
              line: 4,
              ja: '最後の行が出たら、上から下への実行順を目で追えます。',
              zh: '最后一行出现时，就能用眼睛追踪从上到下的执行顺序。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'print の後ろの丸かっこを忘れると、Python は function call として読めません。',
          zh: '忘记 print 后面的圆括号时，Python 就无法把它读成一次 function call。'
        },
        {
          ja: '文字列の引用符を片方だけ消すと、どこまでが string なのか分からなくなります。',
          zh: '如果只删掉一边引号，Python 就不知道 string 到哪里结束。'
        },
        {
          ja: '出力の順番を逆に読んでしまうと、script が上から順に進む感覚が崩れます。',
          zh: '如果把输出顺序倒着理解，就会误解 script 从上到下执行的基本节奏。'
        }
      ],
      handson: {
        ja: '4 行のうち 2 行目の文字だけを、別の短い英語に変えて実行してみましょう。',
        zh: '把 4 行里第 2 行的文字改成另一句短英文，然后重新运行。',
        action: {
          ja: '2 行目だけを書き換え、他の 3 行はそのままにして実行します。',
          zh: '只改第 2 行，另外 3 行保持不变后运行。'
        },
        expectedObservation: {
          ja: '出力の 2 行目だけが変わり、1・3・4 行目の順番と文字は変わりません。',
          zh: '只有输出的第 2 行发生变化，第 1、3、4 行的顺序和文字不变。'
        }
      },
      summary: {
        ja: 'Python の最初の一歩は、script を実行し、statement が output になるところを確認することです。',
        zh: 'Python 的第一步，是运行 script，并确认 statement 如何变成屏幕上的 output。'
      },
      nextLessonBridge: {
        ja: '次は、毎回文字を直接書くのではなく、value に名前を付けてあとから使います。',
        zh: '下一节不再每次直接写文字，而是给 value 起名字，再在后面使用它。'
      }
    },
    {
      lessonId: 'python-0008-gs2-values-and-variables',
      chapterId: 'python-gs-ch01',
      order: 2,
      title: {
        ja: '値を名前に入れて、あとから使う',
        zh: '把值放进名字里，再拿出来使用'
      },
      objectives: [
        {
          ja: 'variable は value に名前を付け、あとから同じ value を使うための置き場所だと説明できる。',
          zh: '能说明 variable 是给 value 起名字、方便之后再次使用的存放位置。'
        },
        {
          ja: 'string と number を別々の value として扱い、expression が新しい結果を作る流れを追える。',
          zh: '能把 string 和 number 当作不同的 value，并追踪 expression 生成新结果的过程。'
        }
      ],
      prerequisites: [
        {
          ja: 'print() で画面に出力できること、script が上から順に動くことを理解していれば始められます。',
          zh: '只要理解 print() 可以输出到屏幕，以及 script 会从上到下运行，就可以开始。'
        }
      ],
      blocks: [
        {
          semanticKey: 'why-name-values',
          type: 'why',
          title: {
            ja: 'なぜ value に名前を付けるのか',
            zh: '为什么要给 value 起名字'
          },
          ja: '同じ言葉や数を何度も直接書くと、直す場所が増えて混乱します。variable に入れると、名前を読むだけで「今どの value を使っているか」を追いやすくなります。',
          zh: '如果同一个文字或数字每次都直接写，修改时会到处找。放进 variable 后，只要读名字，就能追踪现在使用的是哪个 value。'
        },
        {
          semanticKey: 'mental-label-box',
          type: 'mental-model',
          title: {
            ja: 'ラベル付きの箱として考える',
            zh: '把它想成贴了标签的盒子'
          },
          ja: 'variable は「名前のラベル」が付いた小さな箱のように考えます。右側の value を先に作り、左側の名前でその value を取り出せるようにします。',
          zh: '可以把 variable 想成贴着名字标签的小盒子。先生成右边的 value，再让左边的名字能把这个 value 取出来。'
        },
        {
          semanticKey: 'flow-assign-combine-print',
          type: 'execution-flow',
          title: {
            ja: '代入から表示まで',
            zh: '从赋值到显示'
          },
          ja: '最初に language へ string を入れ、次に topic_count へ number を入れます。その後、expression で message を作り、print() が名前の中身を画面へ出します。',
          zh: '先把 string 放进 language，再把 number 放进 topic_count。之后用 expression 生成 message，最后 print() 把名字里的内容输出到屏幕。'
        }
      ],
      terms: [
        {
          ja: '変数',
          zh: '变量',
          en: 'variable',
          explanationJa: 'value に名前を付けて、後の statement から使えるようにする仕組みです。',
          explanationZh: '给 value 起名字，让后面的 statement 可以继续使用。'
        },
        {
          ja: '文字列',
          zh: '字符串',
          en: 'string',
          explanationJa: '引用符で囲んだ文字の value です。文章やラベルを扱うときに使います。',
          explanationZh: '用引号包起来的文字 value，用来表示句子或标签。'
        },
        {
          ja: '式',
          zh: '表达式',
          en: 'expression',
          explanationJa: 'value や variable を組み合わせて、新しい value を作る書き方です。',
          explanationZh: '把 value 或 variable 组合起来，生成新 value 的写法。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-gs2-values-variables',
          code: 'language = "Python"\ntopic_count = 2\nmessage = language + " keeps values by name"\nprint(message)\nprint("visible topics:", topic_count)',
          expectedOutput: 'Python keeps values by name\nvisible topics: 2',
          lineNotes: [
            {
              line: 1,
              ja: 'language という名前に、string の value を入れます。',
              zh: '把一个 string value 放进名为 language 的变量。'
            },
            {
              line: 2,
              ja: 'topic_count には number の value を入れます。文字とは別の種類です。',
              zh: 'topic_count 存放 number value，和文字是不同类型。'
            },
            {
              line: 3,
              ja: 'expression が language の中身と新しい string をつなぎ、message を作ります。',
              zh: 'expression 把 language 里的内容和新的 string 连接起来，生成 message。'
            },
            {
              line: 4,
              ja: 'print(message) は名前そのものではなく、message の中の value を表示します。',
              zh: 'print(message) 显示的是 message 里的 value，而不是名字本身。'
            },
            {
              line: 5,
              ja: 'comma を使うと、文字と number を一つの出力行に並べられます。',
              zh: '使用逗号可以把文字和 number 放在同一行输出里。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'variable の名前を引用符で囲むと、名前の中身ではなく文字そのものとして出力されます。',
          zh: '如果把 variable 名字放进引号，输出的是名字这几个字符，而不是里面的 value。'
        },
        {
          ja: '右側の value を作る前に名前を使うと、Python はその名前をまだ知りません。',
          zh: '在生成右侧 value 之前就使用名字时，Python 还不知道这个名字代表什么。'
        },
        {
          ja: 'string と number をそのまま + でつなごうとすると、型の違いで止まることがあります。',
          zh: '直接用 + 连接 string 和 number 时，可能因为类型不同而停止运行。'
        }
      ],
      handson: {
        ja: 'language の value を別の短い単語に変え、message の出力だけがどう変わるか確認しましょう。',
        zh: '把 language 的 value 改成另一个短单词，观察 message 的输出如何变化。',
        action: {
          ja: '1 行目の "Python" だけを書き換え、残りの statement はそのまま実行します。',
          zh: '只改第 1 行的 "Python"，其余 statement 保持不变后运行。'
        },
        expectedObservation: {
          ja: '1 行目の出力の先頭だけが新しい単語になり、2 行目の topic_count は 2 のままです。',
          zh: '输出第 1 行的开头会变成新单词，第 2 行的 topic_count 仍然是 2。'
        }
      },
      summary: {
        ja: 'variable は value を名前で扱うための基礎です。名前を使うと、script の意味を追いやすくなります。',
        zh: 'variable 是用名字管理 value 的基础。使用名字后，script 的含义更容易追踪。'
      },
      nextLessonBridge: {
        ja: 'この先は、string を少し加工したり、number を expression で計算したりして、value の扱いを広げます。',
        zh: '后续会继续加工 string，或用 expression 计算 number，逐步扩展对 value 的使用。'
      }
    },
    {
      lessonId: 'python-0009-7d37969c-第-3-章-列表简介',
      chapterId: 'python-gs-ch01',
      order: 3,
      title: {
        ja: 'リストで複数の値を一つの名前にまとめる',
        zh: '用列表把多个值放在同一个名字下'
      },
      objectives: [
        {
          ja: 'list が複数の value を順番つきで持つ入れ物だと説明できる。',
          zh: '能说明 list 是按顺序保存多个 value 的容器。'
        },
        {
          ja: 'index を使って、最初と最後の element を取り出せる。',
          zh: '能用 index 取出第一个和最后一个 element。'
        }
      ],
      prerequisites: [
        {
          ja: 'GS2 の variable と value の考え方があれば十分です。list も一つの名前に入る value として扱います。',
          zh: '只需要理解 GS2 的 variable 和 value。list 也可以作为一个 value 放进名字里。'
        }
      ],
      blocks: [
        {
          type: 'why',
          semanticKey: 'why-list',
          title: {
            ja: 'なぜ list が必要なのか',
            zh: '为什么需要 list'
          },
          ja: '値が一つだけなら variable で足ります。しかし曜日、単語、点数のように同じ種類の値が並ぶと、一つずつ別名を作るより、順番ごと一つにまとめたほうが読みやすくなります。',
          zh: '只有一个值时 variable 就够了。但像星期、单词、分数这样有一组同类值时，与其给每个值都起一个名字，不如把它们连同顺序一起放进一个 list。'
        },
        {
          type: 'mental-model',
          semanticKey: 'mental-list',
          title: {
            ja: '心の中のモデル',
            zh: '心智模型'
          },
          ja: 'list は番号がついた小さな棚です。名前は棚全体を指し、index は棚の何番目を見るかを指定します。Python の最初の番号は 0 です。',
          zh: 'list 像一排带编号的小格子。名字指向整排格子，index 指定查看第几个格子。Python 的第一个编号是 0。'
        },
        {
          type: 'flow',
          semanticKey: 'flow-list',
          title: {
            ja: '初期状態から出力まで',
            zh: '从初始状态到输出'
          },
          ja: '最初に days という名前へ 3 つの文字列を入れます。次に len() で数を確認し、0 と -1 の index で先頭と末尾を表示します。',
          zh: '开始时把 3 个字符串放进 days。随后用 len() 查看数量，再用 0 和 -1 这两个 index 显示开头和结尾。'
        }
      ],
      terms: [
        {
          ja: 'リスト',
          zh: '列表',
          en: 'list',
          explanationJa: '複数の value を順番つきでまとめる Python の基本的な container です。',
          explanationZh: 'Python 中按顺序保存多个 value 的基础 container。'
        },
        {
          ja: '要素',
          zh: '元素',
          en: 'element',
          explanationJa: 'list の中に一つずつ入っている value です。',
          explanationZh: 'list 里一个一个保存的 value。'
        },
        {
          ja: 'インデックス',
          zh: '索引',
          en: 'index',
          explanationJa: 'list の位置を指定する番号です。先頭は 0 から始まります。',
          explanationZh: '指定 list 位置的编号，开头从 0 开始。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-domain1a-list-intro',
          code: 'days = ["Mon", "Tue", "Wed"]\nprint("list size:", len(days))\nprint("first day:", days[0])\nprint("last day:", days[-1])',
          expectedOutput: 'list size: 3\nfirst day: Mon\nlast day: Wed',
          lineNotes: [
            {
              line: 1,
              ja: '角かっこの中に 3 つの string を並べ、days という一つの名前に入れます。',
              zh: '在方括号中排列 3 个 string，并把整个列表放进 days 这个名字。'
            },
            {
              line: 2,
              ja: 'len(days) は list の element 数を返します。',
              zh: 'len(days) 返回 list 中 element 的数量。'
            },
            {
              line: 3,
              ja: 'days[0] は最初の element です。Python の index は 0 から始まります。',
              zh: 'days[0] 是第一个 element。Python 的 index 从 0 开始。'
            },
            {
              line: 4,
              ja: 'days[-1] は末尾の element を指す便利な書き方です。',
              zh: 'days[-1] 是指向最后一个 element 的便捷写法。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: '最初の element を days[1] で取ろうとすると、2 番目の値になります。',
          zh: '如果用 days[1] 取第一个 element，实际拿到的是第二个值。'
        },
        {
          ja: '角かっこを忘れると、複数の値を一つの list として作れません。',
          zh: '忘记方括号时，就不能把多个值组成一个 list。'
        },
        {
          ja: 'list の中の comma を抜かすと、Python が値の区切りを読めません。',
          zh: '漏掉 list 中的逗号时，Python 无法识别值之间的分隔。'
        }
      ],
      handson: {
        ja: 'days に "Thu" を足す前の準備として、4 番目の値を手で追加した list を作ってみましょう。',
        zh: '在学习自动追加之前，先手动把第 4 个值放进 days，观察数量和末尾。 ',
        action: {
          ja: '1 行目を ["Mon", "Tue", "Wed", "Thu"] に変えて実行します。',
          zh: '把第 1 行改成 ["Mon", "Tue", "Wed", "Thu"] 后运行。'
        },
        expectedObservation: {
          ja: 'list size は 4 になり、last day は Thu になります。',
          zh: 'list size 会变成 4，last day 会变成 Thu。'
        }
      },
      summary: {
        ja: 'list は、同じ意味の複数の value を順番ごと一つの名前で扱うための基本形です。',
        zh: 'list 是用一个名字管理多个同类 value，并保留顺序的基础形式。'
      },
      nextLessonBridge: {
        ja: '次は、作った list をそのまま眺めるだけでなく、あとから値を足したり書き換えたりします。',
        zh: '下一节不只是查看 list，而是会在运行过程中追加、改写和取出其中的值。'
      }
    },
    {
      lessonId: 'python-0010-921b265b-第-4-章-操作列表',
      chapterId: 'python-gs-ch01',
      order: 4,
      title: {
        ja: 'リストを変えて、順番と中身の変化を見る',
        zh: '操作列表，观察顺序和内容怎样变化'
      },
      objectives: [
        {
          ja: 'append、代入、pop が list の状態をどう変えるか追跡できる。',
          zh: '能追踪 append、赋值、pop 如何改变 list 的状态。'
        },
        {
          ja: 'list の操作は元の value をその場で変えることがあると説明できる。',
          zh: '能说明有些 list 操作会直接改变原来的 value。'
        }
      ],
      prerequisites: [
        {
          ja: 'list の中に element が順番に入っており、index で位置を指定できることを思い出してください。',
          zh: '请回忆 list 中的 element 有顺序，并且可以用 index 指定位置。'
        }
      ],
      blocks: [
        {
          type: 'why',
          semanticKey: 'why-list-ops',
          title: {
            ja: 'なぜ list を操作するのか',
            zh: '为什么要操作 list'
          },
          ja: '実際の program では、最初に決めた値だけで終わりません。学習タスクや買い物メモのように、あとから足す、書き換える、完了したものを取り出す場面が多くあります。',
          zh: '真实 program 不会只使用一开始写死的值。像学习任务、购物清单这类数据，经常需要追加、改写，或把已经完成的项目取出来。'
        },
        {
          type: 'mental-model',
          semanticKey: 'mental-list-ops',
          title: {
            ja: '心の中のモデル',
            zh: '心智模型'
          },
          ja: 'list は紙のメモではなく、動かせる行です。append は末尾に新しい札を置き、index への代入はその場所の札を入れ替え、pop は札を取り出して list から消します。',
          zh: 'list 不是静态纸条，而是一排可以移动的项目。append 在末尾放新项目，给 index 赋值会替换该位置，pop 会取出一个项目并从 list 中移走。'
        },
        {
          type: 'flow',
          semanticKey: 'flow-list-ops',
          title: {
            ja: '初期状態から出力まで',
            zh: '从初始状态到输出'
          },
          ja: 'tasks は 2 つの element から始まります。append 後に 3 つになり、代入で真ん中が変わり、pop で先頭が取り出されます。',
          zh: 'tasks 从 2 个 element 开始。append 后变成 3 个，赋值会改掉中间项，pop 会把开头取出。'
        }
      ],
      terms: [
        {
          ja: '追加',
          zh: '追加',
          en: 'append',
          explanationJa: 'list の末尾に新しい element を足す操作です。',
          explanationZh: '把新 element 放到 list 末尾的操作。'
        },
        {
          ja: '代入',
          zh: '赋值',
          en: 'assignment',
          explanationJa: '指定した場所へ新しい value を入れ直すことです。',
          explanationZh: '把新的 value 放到指定位置。'
        },
        {
          ja: '取り出し',
          zh: '弹出',
          en: 'pop',
          explanationJa: 'element を list から取り出し、同時に list から消す操作です。',
          explanationZh: '从 list 中取出 element，同时把它从 list 中移除。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-domain1a-list-operations',
          code: 'tasks = ["read", "practice"]\ntasks.append("review")\nprint("after append:", tasks)\ntasks[1] = "code"\nprint("after update:", tasks)\ndone = tasks.pop(0)\nprint("done:", done)\nprint("remaining:", tasks)',
          expectedOutput: 'after append: [\'read\', \'practice\', \'review\']\nafter update: [\'read\', \'code\', \'review\']\ndone: read\nremaining: [\'code\', \'review\']',
          lineNotes: [
            {
              line: 1,
              ja: 'tasks は 2 つの作業名を持つ list として始まります。',
              zh: 'tasks 一开始是包含两个任务名的 list。'
            },
            {
              line: 2,
              ja: 'append("review") は末尾へ新しい element を追加します。',
              zh: 'append("review") 会把新的 element 加到末尾。'
            },
            {
              line: 4,
              ja: 'tasks[1] への代入は、2 番目の element を "code" に置き換えます。',
              zh: '给 tasks[1] 赋值，会把第二个 element 替换为 "code"。'
            },
            {
              line: 6,
              ja: 'pop(0) は先頭の element を取り出し、その value を done に入れます。',
              zh: 'pop(0) 取出开头的 element，并把这个 value 放进 done。'
            },
            {
              line: 8,
              ja: '最後の出力では、取り出された "read" が list から消えていることを確認します。',
              zh: '最后的输出确认 "read" 已经从 list 中移除。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'append の戻り値を別の名前に入れようとすると、list そのものではなく None を見てしまうことがあります。',
          zh: '如果把 append 的返回值放进另一个名字，可能看到的不是 list，而是 None。'
        },
        {
          ja: 'pop したあとも元の list に同じ element が残ると思うと、残りの順番を読み間違えます。',
          zh: '如果以为 pop 后原 list 里还保留同一个 element，就会误读剩余顺序。'
        },
        {
          ja: 'index 1 を先頭だと思うと、更新したい場所と違う element を書き換えてしまいます。',
          zh: '如果把 index 1 当成开头，就会改错 element。'
        }
      ],
      handson: {
        ja: 'pop の位置を変えると、done と remaining がどう変わるか確認しましょう。',
        zh: '改变 pop 的位置，观察 done 和 remaining 如何变化。'
        ,
        action: {
          ja: '6 行目を done = tasks.pop(2) に変えて実行します。',
          zh: '把第 6 行改成 done = tasks.pop(2) 后运行。'
        },
        expectedObservation: {
          ja: 'done は review になり、remaining には read と code が順番どおり残ります。',
          zh: 'done 会变成 review，remaining 中会按顺序留下 read 和 code。'
        }
      },
      summary: {
        ja: 'list は見るだけでなく、追加、更新、取り出しによって状態を変えられます。',
        zh: 'list 不只是用来查看，还可以通过追加、更新、取出改变自身状态。'
      },
      nextLessonBridge: {
        ja: 'list の中身が変わると、次に必要なのは「どの状態なら何をするか」を選ぶことです。そこで if 文に進みます。',
        zh: '当 list 的内容会变化后，下一步就是根据不同状态选择要做什么，因此进入 if 语句。'
      }
    },
    {
      lessonId: 'python-0011-5c80c609-第-5-章-if语句',
      chapterId: 'python-gs-ch01',
      order: 5,
      title: {
        ja: 'if 文で条件に合う道を選ぶ',
        zh: '用 if 语句根据条件选择路径'
      },
      objectives: [
        {
          ja: '比較 expression が True / False を作り、if が実行する行を選ぶ流れを説明できる。',
          zh: '能说明比较 expression 生成 True / False，if 根据结果选择要执行的行。'
        },
        {
          ja: 'else が条件に合わない場合の別ルートを表すことを読める。',
          zh: '能读懂 else 表示条件不成立时的另一条路径。'
        }
      ],
      prerequisites: [
        {
          ja: 'number の value と variable を使い、print で途中の状態を確認できれば十分です。',
          zh: '只需要会使用 number value、variable，并用 print 确认中间状态。'
        }
      ],
      blocks: [
        {
          type: 'why',
          semanticKey: 'why-if',
          title: {
            ja: 'なぜ if が必要なのか',
            zh: '为什么需要 if'
          },
          ja: 'program は毎回同じ道だけを進むとは限りません。点数が基準以上なら合格、足りなければ再挑戦というように、value の状態によって次の行を選びたい場面があります。',
          zh: 'program 不一定每次都走同一条路。比如分数达到标准就通过，不够就重试，这类情况需要根据 value 的状态选择下一步。'
        },
        {
          type: 'mental-model',
          semanticKey: 'mental-if',
          title: {
            ja: '心の中のモデル',
            zh: '心智模型'
          },
          ja: 'if は分かれ道の標識です。条件が True なら if の内側へ進み、False なら else の内側へ進みます。indent は「この道に属する行」を示します。',
          zh: 'if 像岔路口的路标。条件为 True 时走 if 内部，为 False 时走 else 内部。缩进表示“这些行属于这条路径”。'
        },
        {
          type: 'flow',
          semanticKey: 'flow-if',
          title: {
            ja: '初期状態から出力まで',
            zh: '从初始状态到输出'
          },
          ja: 'score と target を作り、まず点数を出力します。比較が True なので pass 側の行だけが実行され、最後に確認行を出します。',
          zh: '先创建 score 和 target，并输出分数。比较结果为 True，所以只执行 pass 这条路径，最后输出确认行。'
        }
      ],
      terms: [
        {
          ja: '条件',
          zh: '条件',
          en: 'condition',
          explanationJa: 'True または False として読める判断式です。',
          explanationZh: '可以被读成 True 或 False 的判断式。'
        },
        {
          ja: '比較',
          zh: '比较',
          en: 'comparison',
          explanationJa: '二つの value を比べて、条件の結果を作ります。',
          explanationZh: '比较两个 value，并产生条件结果。'
        },
        {
          ja: 'インデント',
          zh: '缩进',
          en: 'indentation',
          explanationJa: 'if や else に属する行を Python に伝える左側の空白です。',
          explanationZh: '左侧空白，用来告诉 Python 哪些行属于 if 或 else。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-domain1a-if-statements',
          code: 'score = 78\ntarget = 60\nprint("score:", score)\nif score >= target:\n    print("result: pass")\nelse:\n    print("result: retry")\nprint("check complete")',
          expectedOutput: 'score: 78\nresult: pass\ncheck complete',
          lineNotes: [
            {
              line: 1,
              ja: 'score は今回判断したい number の value です。',
              zh: 'score 是这次要判断的 number value。'
            },
            {
              line: 2,
              ja: 'target は合格に必要な基準として使います。',
              zh: 'target 用作通过所需的标准。'
            },
            {
              line: 4,
              ja: 'score >= target は True または False を作る comparison です。',
              zh: 'score >= target 是会生成 True 或 False 的 comparison。'
            },
            {
              line: 5,
              ja: '条件が True なので、indent された pass 側の print だけが実行されます。',
              zh: '因为条件为 True，所以只执行缩进在 pass 路径下的 print。'
            },
            {
              line: 8,
              ja: 'if / else の外に戻った行は、どちらの道を通っても最後に実行されます。',
              zh: '回到 if / else 外面的行，不管走哪条路径，最后都会执行。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: 'if 行の末尾の colon を忘れると、Python は次の indented block が始まることを読めません。',
          zh: '忘记 if 行末尾的冒号时，Python 无法识别接下来要开始缩进代码块。'
        },
        {
          ja: 'indent をそろえないと、どの行が if に属するかがずれてしまいます。',
          zh: '缩进不一致时，Python 会误解哪些行属于 if。'
        },
        {
          ja: '= と == や >= を混同すると、比較ではなく別の意味として読まれます。',
          zh: '混淆 =、== 或 >= 时，代码就不是你想表达的比较含义。'
        }
      ],
      handson: {
        ja: 'score を基準未満にしたとき、どちらの道が実行されるか確認しましょう。',
        zh: '把 score 改成低于标准，确认程序会走哪条路径。',
        action: {
          ja: '1 行目を score = 52 に変えて実行します。',
          zh: '把第 1 行改成 score = 52 后运行。'
        },
        expectedObservation: {
          ja: '出力は result: retry になり、check complete は変わらず最後に表示されます。',
          zh: '输出会变成 result: retry，而 check complete 仍会在最后显示。'
        }
      },
      summary: {
        ja: 'if 文は、value を比較して True / False を作り、その結果で実行する道を選びます。',
        zh: 'if 语句会比较 value 得到 True / False，并根据结果选择执行路径。'
      },
      nextLessonBridge: {
        ja: 'ここまでで、複数の値を持つ list と、状態で道を選ぶ if をつなげました。次の小批次では、より多くの data を名前と構造で整理していきます。',
        zh: '到这里，我们把保存多个值的 list 和根据状态选择路径的 if 连起来了。下一小批次会继续用名字和结构整理更多 data。'
      }
    },
    {
      lessonId: 'python-0012-5cc0ecc6-第-6-章-字典',
      chapterId: 'python-gs-ch01',
      order: 6,
      title: {
        ja: '辞書で key から value を取り出す',
        zh: '用字典通过 key 找到 value'
      },
      objectives: [
        {
          ja: 'dictionary は key と value の対応を一つの名前で持つ container だと説明できる。',
          zh: '能说明 dictionary 是用一个名字保存 key 与 value 对应关系的 container。'
        },
        {
          ja: '角かっこと key を使って value を読み、代入で新しい key/value を追加できる。',
          zh: '能用方括号和 key 读取 value，并通过赋值追加新的 key/value。'
        }
      ],
      prerequisites: [
        {
          ja: 'variable に value を入れること、list が複数の element を順番で持つこと、if で状態を確認できることを思い出してください。',
          zh: '请回忆 variable 可以保存 value、list 可以按顺序保存多个 element、if 可以根据状态做判断。'
        }
      ],
      blocks: [
        {
          type: 'why',
          semanticKey: 'why-dictionary',
          title: {
            ja: 'なぜ dictionary が必要なのか',
            zh: '为什么需要 dictionary'
          },
          ja: 'list は順番を見るときに便利ですが、「名前に対応する値」「設定名に対応する値」のように、位置より意味で取り出したい data もあります。dictionary は key を使って、value の意味を直接たどれるようにします。',
          zh: 'list 适合按顺序查看数据，但有些 data 更适合按含义查找，比如“名字对应的值”“设置项对应的值”。dictionary 使用 key，让我们直接沿着含义找到 value。'
        },
        {
          type: 'mental-model',
          semanticKey: 'mental-dictionary',
          title: {
            ja: '心の中のモデル',
            zh: '心智模型'
          },
          ja: 'dictionary はラベル付きの引き出しです。key は引き出しのラベル、value は中身です。順番の番号ではなく、ラベルを指定して中身を取り出します。',
          zh: 'dictionary 像一组贴了标签的抽屉。key 是抽屉标签，value 是里面的内容。我们不是用顺序编号，而是用标签取出内容。'
        },
        {
          type: 'flow',
          semanticKey: 'flow-dictionary',
          title: {
            ja: '初期状態から出力まで',
            zh: '从初始状态到输出'
          },
          ja: '最初に profile へ 3 つの key/value を入れます。name と focus を key で読み、status を追加し、lessons を更新してから、key の一覧と更新後の value を表示します。',
          zh: '一开始把 3 组 key/value 放进 profile。随后用 key 读取 name 和 focus，追加 status，更新 lessons，最后输出 key 列表和更新后的 value。'
        }
      ],
      terms: [
        {
          ja: '辞書',
          zh: '字典',
          en: 'dictionary',
          explanationJa: 'key と value の対応を保存する Python の container です。',
          explanationZh: 'Python 中保存 key 与 value 对应关系的 container。'
        },
        {
          ja: 'キー',
          zh: '键',
          en: 'key',
          explanationJa: 'dictionary の value を取り出すためのラベルです。',
          explanationZh: '用于从 dictionary 中取出 value 的标签。'
        },
        {
          ja: '値',
          zh: '值',
          en: 'value',
          explanationJa: 'key に対応して保存される実際の data です。',
          explanationZh: '与 key 对应保存的实际 data。'
        },
        {
          ja: '検索',
          zh: '查找',
          en: 'lookup',
          explanationJa: 'key を指定して dictionary から value を読む操作です。',
          explanationZh: '指定 key，从 dictionary 中读取 value 的操作。'
        }
      ],
      codeExamples: [
        {
          exampleId: 'python-domain1b-dictionary-lookup',
          code: 'profile = {"name": "learner", "focus": "Python", "lessons": 6}\nprint("name:", profile["name"])\nprint("focus:", profile["focus"])\nprofile["status"] = "review ready"\nprofile["lessons"] = profile["lessons"] + 1\nprint("keys:", sorted(profile.keys()))\nprint("status:", profile["status"])\nprint("lessons:", profile["lessons"])',
          expectedOutput: 'name: learner\nfocus: Python\nkeys: [\'focus\', \'lessons\', \'name\', \'status\']\nstatus: review ready\nlessons: 7',
          lineNotes: [
            {
              line: 1,
              ja: '波かっこの中に key/value を 3 組入れ、profile という一つの名前に保存します。',
              zh: '在花括号中放入 3 组 key/value，并保存到 profile 这个名字里。'
            },
            {
              line: 2,
              ja: 'profile["name"] は name という key に対応する value を読みます。',
              zh: 'profile["name"] 会读取 name 这个 key 对应的 value。'
            },
            {
              line: 3,
              ja: '同じ dictionary から focus の value も key で取り出します。',
              zh: '同一个 dictionary 也可以通过 focus 这个 key 取出对应 value。'
            },
            {
              line: 4,
              ja: 'まだなかった status という key に、新しい value を追加します。',
              zh: '给原本不存在的 status 这个 key 追加新的 value。'
            },
            {
              line: 5,
              ja: '既存の lessons を読み、1 を足した結果で同じ key の value を更新します。',
              zh: '先读取已有 lessons，再加 1，并用结果更新同一个 key 的 value。'
            },
            {
              line: 6,
              ja: 'sorted(profile.keys()) で key の一覧を安定した順番にして表示します。',
              zh: 'sorted(profile.keys()) 会把 key 列表按稳定顺序输出。'
            },
            {
              line: 7,
              ja: '追加した status の value が dictionary に入ったことを確認します。',
              zh: '确认刚追加的 status value 已经进入 dictionary。'
            },
            {
              line: 8,
              ja: '更新後の lessons は 6 ではなく 7 として表示されます。',
              zh: '更新后的 lessons 会显示为 7，而不是原来的 6。'
            }
          ]
        }
      ],
      commonMistakes: [
        {
          ja: '存在しない key をそのまま読むと、Python はどの value を返せばよいか分からず止まります。',
          zh: '直接读取不存在的 key 时，Python 不知道该返回哪个 value，会停止运行。'
        },
        {
          ja: 'key の引用符を忘れると、文字ラベルではなく variable 名として読まれてしまいます。',
          zh: '忘记 key 的引号时，它会被当作 variable 名，而不是文字标签。'
        },
        {
          ja: 'list のように位置番号だけで考えると、dictionary の「意味で取り出す」強みを見落とします。',
          zh: '如果只按 list 的位置编号来理解，就会忽略 dictionary “按含义查找”的优势。'
        }
      ],
      handson: {
        ja: 'profile に新しい key を一つ足し、key 一覧と追加した value がどう変わるか確認しましょう。',
        zh: '给 profile 再添加一个新的 key，观察 key 列表和新增 value 如何变化。',
        action: {
          ja: '5 行目の後に profile["level"] = "start" を追加し、最後に print("level:", profile["level"]) を足して実行します。',
          zh: '在第 5 行后追加 profile["level"] = "start"，并在最后添加 print("level:", profile["level"]) 后运行。'
        },
        expectedObservation: {
          ja: 'keys の出力に level が含まれ、最後の行に level: start が表示されます。',
          zh: 'keys 的输出会包含 level，最后一行会显示 level: start。'
        }
      },
      summary: {
        ja: 'dictionary は、順番ではなく key の意味で value を取り出すための container です。追加と更新も key を通して行います。',
        zh: 'dictionary 是通过 key 的含义而不是顺序来取出 value 的 container。追加和更新也通过 key 完成。'
      },
      nextLessonBridge: {
        ja: 'key/value の対応を読めるようになると、設定や状態を一つの data として整理しやすくなります。次の公開範囲では、その data をどう動かすかをさらに細かく見ます。',
        zh: '读懂 key/value 对应关系后，就更容易把设置或状态整理成一份 data。下一次公开范围会继续观察如何让这些 data 动起来。'
      }
    }
  ]
};
