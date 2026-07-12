# PYTHON P-E — EPUB 全文提取报告

工具：`tools/extract_python_epub_source_evidence.js`（纯 node，内置 zlib 解 DEFLATE，只读 EPUB）
运行：`node tools/extract_python_epub_source_evidence.js`（`--check` 仅校验指纹）

## EPUB inventory

| 项 | 值 |
|---|---|
| 文件 | Python编程三剑客：…从入门到实践 快速上手 极客编程….epub（合订本，全 3 册） |
| sha256 | `860F1817…F25F7EF`（与 source-manifest 绑定一致 ✓） |
| 大小 | 17,260,692 bytes |
| spine 条目 | 66（全部成功提取，0 失败） |
| NCX navPoint | 968（与 corpus-manifest `tocNodeCount:968` 完全一致 ✓） |
| 代码块 | 1795（`<pre class="代码无行号"><code>…`） |
| 可解析 | 是；无编码异常；无 spine href 缺失 |

## 提取产物（committed，docs/python-source-evidence/）

- `PYTHON_EPUB_FULLTEXT_INVENTORY.json` — EPUB 级指纹/元数据/成功率
- `PYTHON_EPUB_SPINE_INDEX.json` — 66 spine：order/href/textLen/textHash/codeBlockCount
- `PYTHON_EPUB_SECTION_ANCHOR_INDEX.json` — 968 section：bookId/depth/chapterTitle/sectionTitle/xhtmlPath/anchor/spineIndex/confidence
- `PYTHON_EPUB_CODEBLOCK_INDEX.json` — 1795 代码块：href/spineIndex/blockIndex/codeHash/lineCount/firstLine

## 三本书的 section / 结构分布（NCX）

| bookId | navPoint 数 | 说明 |
|---|---|---|
| book1-crash-course（从入门到实践） | 37 | **TOC 章级粗粒度**（只到"第 N 章"，无小节节点） |
| book2-automate（快速上手） | 585 | TOC 小节级细粒度（1.1 / 1.4.1 …） |
| book3-playground（极客项目） | 346 | 章/节级 |

depth≤2（书名+部分+章）节点 99；depth3=206；depth4=529。

**关键结构事实**：Book1 全书正文在单一 `text00001.html` 内，章节靠 `#nav_point_N` 锚点切分——因此 Book1 的 section 证据是**共享大文档级**（doc-level），非逐节切片；这决定了 Book1 lesson 的 fulltext 置信度上限为 MEDIUM（除非后续做锚点间文本切片）。

## 全文缓存（不进入 Git）

- 位置：`G:/项目/_python_source_evidence_cache/book-bundle/`（worktree 之外，天然不受 git 跟踪）
- 内容：66 个 `text0000X.html.txt`，每个含 `# TEXT`（归一正文）+ `# CODEBLOCKS`（逐块代码）
- Git 只收索引/哈希/摘要，不收正文缓存（符合门禁）。

## 风险与边界

- Book1 证据只到 doc-level（MEDIUM），逐章精确切片留待后续。
- 少量 section 标题含特殊全角引号/丢失编号，影响精确匹配（见 mapping 的 4 个 UNMAPPED）。
- 图片内文字（若有代码截图）未 OCR；本轮 codeblock 仅取 `<pre>` 文本块。
