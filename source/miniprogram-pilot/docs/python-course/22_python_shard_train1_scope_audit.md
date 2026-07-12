# Python Shard Train1 Scope Audit

## Frozen Scope

TRAIN_SCOPE_FROZEN

本轮从 Domain1B 后第一个正常候选开始，只选择连续、真实、可发布且不跨越 asset deferral 的 source unit。

| 顺序 | domainKey | sourceOrder | sourceUnitId | courseLessonId | tocPath | parent | type | leaf | ledger status | 是否选入 |
|---:|---|---:|---|---|---|---|---|---|---|---|
| 1 | python-domain1c | 13 | py-src-0013-3f4a9a6a-第-7-章-用户输入和while循环 | python-0013-3f4a9a6a-第-7-章-用户输入和while循环 | Python编程：从入门到实践（第2版） > 第 7 章 用户输入和while循环 | Python编程：从入门到实践（第2版） | chapter | yes | next_candidate | yes |
| 2 | python-full-domain-0001 | 14 | py-src-0014-75c7d812-第-8-章-函数 | python-0014-75c7d812-第-8-章-函数 | Python编程：从入门到实践（第2版） > 第 8 章 函数 | Python编程：从入门到实践（第2版） | chapter | yes | planned | yes |
| 3 | python-full-domain-0002 | 15 | py-src-0015-0f96233e-第-9-章-类 | python-0015-0f96233e-第-9-章-类 | Python编程：从入门到实践（第2版） > 第 9 章 类 | Python编程：从入门到实践（第2版） | chapter | yes | planned | yes |
| 4 | python-full-domain-0003 | 16 | py-src-0016-3a01ec9d-第-10-章-文件和异常 | python-0016-3a01ec9d-第-10-章-文件和异常 | Python编程：从入门到实践（第2版） > 第 10 章 文件和异常 | Python编程：从入门到实践（第2版） | chapter | yes | deferred_asset_required | no |

## Stop Reason

第一个未选候选是 sourceOrder 16「第 10 章 文件和异常」。该单元涉及 file / exception 教学，ledger 规则判定为 `deferred_asset_required`，本轮不得跨越。

## Batch Plan

| Batch | domain | lesson | sourceOrder | gate |
|---|---|---|---|---|
| 1 | python-domain1c, python-full-domain-0001 | input/while, function | 13-14 | lightweight Python gates |
| 2 | python-full-domain-0002 | class | 15 | lightweight Python gates |
| 3 | none | none | none | skipped because scope ended before deferred sourceOrder 16 |

## Package Estimate

新 shard `packages/python-course-foundations-b` 在 Batch 1 前约 12.5 KB。三节完整内容预计仍远低于 1.00 MB soft threshold。
