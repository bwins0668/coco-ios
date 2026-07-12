# R7 GS1 DevTools 人工验收卡

> 仅验收 GS1 (intro-ch01-lesson-001) | 390px / 375px / 430px

---

## 验收项目

| # | 页面/场景 | 390px 验收项 | 375px 验收项 | 430px 验收项 |
|---|---|---|---|---|
| 1 | Java 首页入口 | tabBar icon/label 正常，点击进入 Java Course Home | 同上 | 同上 |
| 2 | Java Course Home | ch01 卡片可见，标题"Java言語に触れる"完整 | 同上 | 卡片间距合适 |
| 3 | GS1 lesson 页 | 标题"プログラムとは"完整，5个block全部可见，代码块可滚动 | 同上，padding不溢出 | 两列或多列时布局正常 |
| 4 | 最长日语block | "初めてJavaコードを見るときは…" 完整，无截断 | 同上 | 同上 |
| 5 | 最长中文block | "第一次看 Java 代码时…" 完整，"预测→运行→对比"可见 | 同上 | 同上 |
| 6 | 代码块 | 5行Java代码完整，语法高亮正常，无横向溢出 | 代码字号适中 | 同上 |
| 7 | handson block | 3步操作完整，"改字符串→移println→读错误"清晰 | 同上 | 同上 |
| 8 | commonMistakes | 3条错误完整展开，每条有错误信息示例 | 同上 | 同上 |
| 9 | terms区域 | class/main/println 三个术语卡片完整，日中英三语可见 | 同上 | 同上 |
| 10 | nextLessonBridge | "次は「Java言語のプログラムコード」です" 可见 | 同上 | 同上 |
| 11 | direct-entry 无栈返回 | 从分享链接直接进入GS1，返回不白屏 | 同上 | 同上 |
| 12 | error state | 网络错误时的错误提示/重试按钮 | 同上 | 同上 |

---

## 抽检命令

在微信开发者工具 Console 中执行：

```javascript
// 确认当前页面GS1 lesson数据加载
const pages = getCurrentPages();
const page = pages[pages.length - 1];
console.log('lessonId:', page.data.lesson?.lessonId);
console.log('title.zh:', page.data.lesson?.title?.zh);
console.log('blocks:', page.data.lesson?.blocks?.length);
console.log('hasCode:', !!page.data.lesson?.codeExamples?.length);
```

---

## 验收通过标准

- [ ] 12项全部通过390px/375px/430px
- [ ] 无learner-visible页码/lessonId/sourceRef
- [ ] 无console报错
- [ ] 代码块显示与expectedOutput一致
- [ ] 从Java Course Home返回不白屏
- [ ] 从分享链接进入GS1后返回不白屏
