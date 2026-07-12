# PYTHON P-E — 源证据可复现说明

本文件保证 P-E 的每个索引与每条映射状态都能**从零重算**，且不依赖任何库外私有状态。

## 前置

- 基线 worktree：Python canonical 侧 clone，start HEAD `e143868`，无 remote。
- EPUB 只读源：`G:/项目/python教材`（禁改）。
- node ≥ 18（本轮 v24.16）。纯 node，无需外部 unzip / 第三方包。

## 步骤 1：EPUB 全文提取（committed 索引 + 库外缓存）

```bash
node tools/extract_python_epub_source_evidence.js --check   # 校验 sha256 与可解析性
node tools/extract_python_epub_source_evidence.js           # 生成 4 个索引 + 缓存
```

产物：
- `docs/python-source-evidence/PYTHON_EPUB_{FULLTEXT_INVENTORY,SPINE_INDEX,SECTION_ANCHOR_INDEX,CODEBLOCK_INDEX}.json`（committed）
- `G:/项目/_python_source_evidence_cache/`（**不进 Git**，worktree 之外）

确定性：EPUB 指纹固定（`860F1817…`），提取纯函数（正文归一 + sha256），同输入必得同 hash。

## 步骤 2：687(实际 699) lesson + 391 asset-spec 映射清分

映射脚本不作为独立 tool 提交（遵守本轮 diff 白名单：仅 extract 工具 + docs）。
将以下脚本存为临时文件并运行即可重算 `PYTHON_ARTIFACT_SOURCE_MAPPING.json` 与 `PYTHON_ARTIFACT_MAPPING_SUMMARY.json`：

```js
'use strict';
var fs = require('fs'), path = require('path');
var ROOT = process.cwd();
var corpus = require(ROOT + '/artifacts/python-course-authoring-corpus/corpus-manifest.json');
var secIdx = require(ROOT + '/docs/python-source-evidence/PYTHON_EPUB_SECTION_ANCHOR_INDEX.json').sections;
var PUBLISHED = new Set(require(ROOT + '/packages/python-course/data/python-source-manifest.js').pythonSourceManifest.releaseVisibility.visibleCourseLessonIds);
function titleTail(uid){ var m=uid.match(/^py-src-\d+-[0-9a-f]+-(.+)$/); return m?m[1]:''; }
function norm(s){ return (s||'').replace(/[\s\-–—­·・.．。、,，:：()（）]/g,'').toLowerCase(); }
var docCount={}; secIdx.forEach(function(s){ docCount[s.xhtmlPath]=(docCount[s.xhtmlPath]||0)+1; });
var secByNorm={}; secIdx.forEach(function(s){ var k=norm(s.sectionTitle); (secByNorm[k]=secByNorm[k]||[]).push(s); });
var specDir = ROOT + '/artifacts/python-course-authoring-corpus/asset-specs';
var specIds = new Set(fs.readdirSync(specDir).map(function(f){ var m=f.match(/(python-\d+)/); return m?m[1]:null; }).filter(Boolean));
var records = corpus.records.map(function(r){
  var tail=titleTail(r.sourceUnitId), hit=secByNorm[norm(tail)], status, conf, book=null, matched=null;
  if(!hit){ status='UNMAPPED'; conf='NONE'; }
  else if(hit.length>1){ status='AMBIGUOUS'; conf='LOW'; book=hit[0].bookId; }
  else { matched=hit[0]; book=matched.bookId; status='FULLTEXT_LINKED'; conf=docCount[matched.xhtmlPath]>1?'MEDIUM':'HIGH'; }
  var shortId=(r.courseLessonId.match(/(python-\d+)/)||[])[1];
  var elig = r.contentStatus!=='written' ? 'BLOCKED_BY_ARTIFACT_DEFECT' : (status==='FULLTEXT_LINKED'?'ELIGIBLE_FOR_NEXT_AUDIT_BATCH':'BLOCKED_BY_SOURCE_EVIDENCE');
  return { lessonId:r.courseLessonId, artifactPath:'artifacts/python-course-authoring-corpus/'+r.recordPath,
    bookCandidate:book, chapterCandidate:matched?(matched.chapterTitle||matched.sectionTitle):'', sourceUnitId:r.sourceUnitId,
    matchedAnchor:matched?{xhtmlPath:matched.xhtmlPath,anchor:matched.anchor,spineIndex:matched.spineIndex,sectionTitle:matched.sectionTitle}:null,
    mappingStatus:status, mappingConfidence:conf, hasAssetSpec:specIds.has(shortId),
    alreadyPublishedRuntime:PUBLISHED.has(r.courseLessonId), contentStatus:r.contentStatus,
    releaseEligibility: (r.contentStatus==='written'&&PUBLISHED.has(r.courseLessonId))?'ALREADY_RELEASED':elig,
    requiresHumanSourceReview: status!=='FULLTEXT_LINKED' };
});
// 汇总同 summary（略；见 PYTHON_ARTIFACT_MAPPING_SUMMARY.json）
fs.writeFileSync(ROOT+'/docs/python-source-evidence/PYTHON_ARTIFACT_SOURCE_MAPPING.json', JSON.stringify({records:records},null,2)+'\n');
console.log('records:',records.length);
```

运行：`cd <worktree>; node <该脚本>`。

## 映射语义（重要）

- `FULLTEXT_LINKED`：sourceUnitId 标题唯一匹配到已提取的 section（我们持有其所属 doc 的正文/代码）。**不等于可发布**，仅表示"具备进入内容审计的最低教材证据"。
- `MEDIUM` 置信：证据为 doc-level（尤其 Book1 单文档），非逐节精确切片。
- `AMBIGUOUS`：标题匹配到多个 section（多为项目"第 N 步"重复步骤名）。
- `UNMAPPED`：标题无匹配（编号缺失/特殊引号）。
- `releaseEligibility`：`ALREADY_RELEASED`(9) / `ELIGIBLE_FOR_NEXT_AUDIT_BATCH` / `BLOCKED_BY_SOURCE_EVIDENCE` / `BLOCKED_BY_ARTIFACT_DEFECT`。

## 归一化规则（匹配可复现的关键）

`norm(s)` = 删除 `[\s\-–—­·・.．。、,，:：()（）]` 后小写。用于消解 "1.1" ↔ "1-1"、全角/半角括号、点号差异。任何调整此规则都会改变匹配数，务必与本文件同步。
