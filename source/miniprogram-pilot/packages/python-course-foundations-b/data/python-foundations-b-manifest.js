var manifest = {
  courseId: 'python',
  shardId: 'python-course-foundations-b',
  title: {
    ja: 'Python入門 続編',
    zh: 'Python 入门续篇'
  },
  subtitle: {
    ja: '入力、関数、class を小さな実行例でつなぐ',
    zh: '用小型可运行示例衔接输入、函数与 class'
  },
  totalChapters: 1,
  totalSections: 3,
  chapters: [
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
