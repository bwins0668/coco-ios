var manifest = {
  courseId: 'python',
  title: {
    ja: 'Python入門',
    zh: 'Python 入门'
  },
  subtitle: {
    ja: '見える出力から始める、日中バイリンガルの小さな実行コース',
    zh: '从看得见的输出开始，用日中双语一步步运行代码'
  },
  totalChapters: 2,
  totalSections: 9,
  chapters: [
    {
      chapterId: 'python-gs-ch01',
      chapterOrder: 1,
      title: {
        ja: '最初の script と value',
        zh: '第一段脚本与值'
      },
      description: {
        ja: 'print() で結果を見て、次に value を名前で扱う。',
        zh: '先用 print() 看到结果，再把值放进名字里使用。'
      },
      shard: 'python-gs-ch01.js',
      packageRoot: 'packages/python-course',
      chapterRoute: '/packages/python-course/pages/chapter/chapter?chapterId=python-gs-ch01',
      sections: [
        {
          sectionId: 'python-gs1',
          lessonId: 'python-0007-gs1-run-visible-output',
          order: 1,
          title: {
            ja: 'Pythonスクリプトを動かして、見える結果を出す',
            zh: '运行 Python 脚本，得到看得见的结果'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0007-gs1-run-visible-output'
        },
        {
          sectionId: 'python-gs2',
          lessonId: 'python-0008-gs2-values-and-variables',
          order: 2,
          title: {
            ja: '値を名前に入れて、あとから使う',
            zh: '把值放进名字里，再拿出来使用'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0008-gs2-values-and-variables'
        },
        {
          sectionId: 'python-domain1a-list-intro',
          lessonId: 'python-0009-7d37969c-第-3-章-列表简介',
          order: 3,
          title: {
            ja: 'リストで複数の値を一つの名前にまとめる',
            zh: '用列表把多个值放在同一个名字下'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0009-7d37969c-第-3-章-列表简介'
        },
        {
          sectionId: 'python-domain1a-list-operations',
          lessonId: 'python-0010-921b265b-第-4-章-操作列表',
          order: 4,
          title: {
            ja: 'リストを変えて、順番と中身の変化を見る',
            zh: '操作列表，观察顺序和内容怎样变化'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0010-921b265b-第-4-章-操作列表'
        },
        {
          sectionId: 'python-domain1a-if-statements',
          lessonId: 'python-0011-5c80c609-第-5-章-if语句',
          order: 5,
          title: {
            ja: 'if 文で条件に合う道を選ぶ',
            zh: '用 if 语句根据条件选择路径'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0011-5c80c609-第-5-章-if语句'
        },
        {
          sectionId: 'python-domain1b-dictionaries',
          lessonId: 'python-0012-5cc0ecc6-第-6-章-字典',
          order: 6,
          title: {
            ja: '辞書で key から value を取り出す',
            zh: '用字典通过 key 找到 value'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course/pages/lesson/lesson?chapterId=python-gs-ch01&sectionId=python-0012-5cc0ecc6-第-6-章-字典'
        }
      ]
    },
    {
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
      packageRoot: 'packages/python-course-foundations-b',
      chapterRoute: '/packages/python-course-foundations-b/pages/chapter/chapter?chapterId=python-foundations-b-ch01',
      sections: [
        {
          sectionId: 'python-domain1c-input-while',
          lessonId: 'python-0013-3f4a9a6a-第-7-章-用户输入和while循环',
          order: 7,
          title: {
            ja: 'input() と while で、決まった回数の対話を作る',
            zh: '用 input() 和 while 做一段可控交互'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0013-3f4a9a6a-第-7-章-用户输入和while循环'
        },
        {
          sectionId: 'python-functions-small-steps',
          lessonId: 'python-0014-75c7d812-第-8-章-函数',
          order: 8,
          title: {
            ja: 'function で処理に名前を付け、同じ形で再利用する',
            zh: '用 function 给处理命名，并按同一形状复用'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0014-75c7d812-第-8-章-函数'
        },
        {
          sectionId: 'python-class-small-state',
          lessonId: 'python-0015-0f96233e-第-9-章-类',
          order: 9,
          title: {
            ja: 'class で data と動きを一つの小さな型にまとめる',
            zh: '用 class 把 data 和行为合成一个小型类型'
          },
          runnableExampleCount: 1,
          lessonRoute: '/packages/python-course-foundations-b/pages/lesson/lesson?chapterId=python-foundations-b-ch01&sectionId=python-0015-0f96233e-第-9-章-类'
        }
      ]
    }
  ]
};

module.exports = { manifest: manifest };
