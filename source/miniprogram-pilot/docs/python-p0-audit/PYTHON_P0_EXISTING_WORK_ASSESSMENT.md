# PYTHON P0 — 「疑似已完成」内容真实性复验

用户记忆称"Python 可能已有 2–3 章被处理过"。本轮**不预设其已完成/冻结/可复用**，逐节复核。

## 复验结论：真实且高质量，但发布链路有断点

实际发现的是 **2 个运行时章 / 9 个 lesson**（比记忆的"2-3 章"更多的 lesson 粒度），全部为**原创、非模板**内容。

### 逐项回答 Section 5 的强制问题

| 问题 | 结论 |
|---|---|
| 是否真的符合 Java R8 级标准？ | **是**。schema 完整：objectives / blocks(why·mental-model·flow, 带 semanticKey) / terms(ja·zh·en+双语解释) / codeExamples(code·expectedOutput·lineNotes) / commonMistakes / handson / summary / nextLessonBridge。质量与 Java golden 同级。 |
| 是否只做了 code/summary 而其他字段模板化？ | **否**。全字段均有针对该主题的真实内容，无模板残留。 |
| 是否只完成部分 lesson？ | 章内 lesson 均完整；问题是**发布投影只暴露了 5/9**（见下）。 |
| 是否仍存在 source mapping 缺失？ | 部分：源映射为 **toc-only**，lesson 无内联 sourceRef；主题↔章节可核，原书代码逐句忠实性不可核（P-E）。 |
| 是否有旧版本工具未覆盖的字段？ | 未见字段被工具漏审导致的伪造；唯一 FAIL 是 projection 漂移（真实缺陷）。 |
| 是否有 chapter title/manifest/目录投影不同步？ | **是**。`course-registry.js` 投影停留在旧态（description/pathLabel + 只列 5 lesson）。 |
| 是否有 compile PASS 但教学语义错误？ | **未发现**。抽查的输出与代码语义一致，if语句 lesson 经 checker 实跑验证。 |
| 是否有日中混杂/英文残词/术语错误？ | **未发现**污染。英文技术词（interpreter/variable/list…）是刻意的双语教学设计（terms 内定义 en），非残词。 |

### 每个疑似已完成单元的保留结论

| lessonId | 章 | 内容结论 | 保留结论 |
|---|---|---|---|
| python-0007 起步/print | ch01 | GENUINELY_COMPLETE | **KEEP_AS_ACCEPTED** |
| python-0008 变量 | ch01 | GENUINELY_COMPLETE | **KEEP_AS_ACCEPTED** |
| python-0009 列表简介 | ch01 | GENUINELY_COMPLETE | **KEEP_AS_ACCEPTED** |
| python-0010 操作列表 | ch01 | GENUINELY_COMPLETE | **KEEP_AS_ACCEPTED** |
| python-0011 if语句 | ch01 | GENUINELY_COMPLETE（运行时验证） | **KEEP_AS_ACCEPTED** |
| python-0012 字典 | ch01 | 内容 COMPLETE，但被 projection 隐藏 | **KEEP_WITH_TARGETED_FIX** |
| python-0013 输入/while | ch02 | 内容 COMPLETE，但被 projection 隐藏 | **KEEP_WITH_TARGETED_FIX** |
| python-0014 函数 | ch02 | 内容 COMPLETE，但被 projection 隐藏 | **KEEP_WITH_TARGETED_FIX** |
| python-0015 类 | ch02 | 内容 COMPLETE，但被 projection 隐藏 | **KEEP_WITH_TARGETED_FIX** |

**没有任何单元判为 `REOPEN_FOR_FULL_REWRITE` 或 `INSUFFICIENT_EVIDENCE`。**

## Python 全量真实工作量

- **已发布 runtime**：9 lesson（≈ 第1本书 第1–9章主线）。
- **主线剩余**：第1本 第10–20章（文件异常/测试/外星人入侵/数据可视化/Web-Django）。
- **另两本书**：第2本《快速上手》18 章、第3本《极客项目》14 章——均 0 发布。
- **authoring backlog**：`artifacts/python-course-authoring-corpus/` 有 687 个 lessons + ~360 asset-specs 已撰写但**未进 runtime**。这是最大的"隐藏工作量"——需要一条 backlog→runtime 的发布/校验流水线，而非从零重写。

结论：Python 不是"几乎没做"，也不是"已完成"；而是**少量高质量内容已发布 + 一个大 authoring backlog 未发布 + 一个 registry 投影断点**。
