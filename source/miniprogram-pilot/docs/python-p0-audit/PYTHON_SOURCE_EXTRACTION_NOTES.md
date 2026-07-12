# PYTHON P0 — EPUB 源提取说明（只读）

## 方法

- 对 `G:/项目/python教材` 下唯一 EPUB 做**只读**盘点：`unzip -l` 列内部结构，`unzip -o OEBPS/toc.ncx` 仅提取 TOC 到临时目录（`/tmp/epub`，非项目内），`sha256sum` 校验二进制指纹。**未修改、移动、重命名 EPUB 或源目录内任何文件。**
- TOC 标题脉络由 `toc.ncx` 的 `<text>` 节点提取，编码 utf-8，无乱码。

## 关键事实

1. 该 EPUB 是**合订本**：`Python编程三剑客（套装全3册）`，含 3 本独立书（见 chapter index）。用户口中"这本书"实际是三合一。
2. EPUB sha256 = `860F1817…F25F7EF`，与 `python-source-manifest.js` 中声明**逐字节一致** → 现有源映射的 EPUB 绑定真实可信。
3. 现有 `python-source-manifest.js` 的 `sourceKind` = **`toc-only-curriculum-map`**：
   - 已有：spine(66) / opf manifest(380) / TOC 锚点 / EPUB 指纹。
   - **缺失**：逐节正文抽取、逐 lesson 代码 evidence、页码级 anchor→lesson 精确绑定。
4. 运行时 9 个 lesson 对象**不含内联 `sourceRef` 字段**；源关系仅通过 `python-source-manifest.js` 的独立映射 + lessonId 中嵌入的 `第-N-章-xxx` 后缀间接表达。

## 对审计的影响

- **可做（本轮已做）**：title↔TOC 章节名一致性、objectives↔code↔output 语义一致性、code 运行时行为（通过 checker 实际执行）、双语一致性、semanticKey/lineNote 存在性与主题一致性。
- **暂不可做（须 P-E 全文抽取轮）**：把每个 lesson 的代码/讲解与教材**原文逐句**比对（教材是否真有该例、行号是否忠实原书）。当前 evidence 只到 TOC 级，无法证伪"代码是否忠实复刻书中示例"，只能证明"主题与章节归属一致"。

## 建议的可重复提取工具

- 仓库已存在 `tools/audit_python_epub_source.py`（只读 EPUB 源审计器，本轮未纳入运行基线，建议在 P-E 轮作为全文抽取入口评估）。
- 若做全文抽取，应输出 `textEvidencePath` / `codeEvidence[]` / `extractionConfidence` 三元组到独立 evidence 资产，**不得**回写 EPUB 源目录。
