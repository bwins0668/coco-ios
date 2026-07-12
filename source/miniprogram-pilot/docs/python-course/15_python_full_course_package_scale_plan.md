# Python Full Course Package Scale Plan

本文件是 R8.PYTHON-FULL-P0-D1B 阶段 A 的包体扩容预案。它只建立 shard trigger 与 release contract；本轮不得创建新 subpackage。

## Current Size

| 项目 | 当前值 |
|---|---:|
| Python package audit size | 935.1 KB (17 files) |
| 当前公开 lesson | 5 |
| 当前 next_candidate | 1 |
| soft warning threshold | 1.00 MB |
| package audit target fail line | 1.8 MB |
| WeChat single-package hard limit | 2 MB |

真实来源：`tools/audit_miniprogram_package_size.js` 中 `PACKAGE_FAIL = 1.8 * ONE_MB`，`HARD_LIMIT = 2 * ONE_MB`。当前 Python package 已接近 1 MB，不能把未来 699 节继续无上限塞入 `packages/python-course/**`。

## Current Content Footprint

当前 5 节公开 lesson 与 source manifest 同在 `packages/python-course`。现有 Domain1A 增量已经把 Python package 推到 935.1 KB (17 files)，其中最大的文件是 source manifest；未来正文如果继续写入当前 package，会很快触发 soft threshold。

## shard trigger

当增加下一 domain 后出现任一条件，必须停止继续向当前 Python package 写 content，进入专门的 `R8.PYTHON-SHARD-P1`：

1. Python package 超过 1.00 MB soft warning threshold。
2. `node tools/audit_miniprogram_package_size.js` 失败。
3. 预计下一完整 domain 会超过现有 package audit 的 1.8 MB target fail line 或微信 2 MB single-package hard limit。

触发后不得通过删内容、压缩教学质量、隐藏 checker 或降低 lesson 标准绕过。

## Future Shard Strategy

- 首页与 public projection 永远保留在 main package。
- Python Home / current foundations package 保持轻量。
- future content shard 只承载 lesson data / chapter data。
- main package 不得 require shard JS，也不得 require `packages/python-course/**` lesson body。
- chapter / lesson loader 通过 route 与 subpackage runtime 边界加载。
- 每个 shard 只负责连续 release domain。
- 不复制 source map。
- 不复制已有 lesson data。
- 不破坏 existing direct-entry route。

## Ledger Package Targets

| packageTarget | lesson 数 |
|---|---:|
| packages/python-course | 6 |
| planned-python-foundations-continuation | 8 |
| future-python-content-shard-01 | 49 |
| future-python-content-shard-02 | 69 |
| future-python-content-shard-03 | 68 |
| future-python-content-shard-04 | 73 |
| future-python-content-shard-05 | 79 |
| future-python-content-shard-06 | 62 |
| future-python-content-shard-07 | 57 |
| future-python-content-shard-08 | 79 |
| future-python-content-shard-09 | 68 |
| future-python-content-shard-10 | 68 |
| future-python-content-shard-11 | 13 |

当前 `published` 与 `next_candidate` 指向 `packages/python-course`；后续 planned / deferred domain 已预留 future shard packageTarget，因此总账不会把 699 entries 全指向同一个永不扩容 package。

## Audit Contract

`tools/check_python_package_scale_contract.js` 必须检查：当前 package size 由真实 audit 计算；1.00 MB soft threshold 被记录；hard threshold 来源明确；release ledger 每个 domain 都有 packageTarget；main package projection 不含 lesson body；shard trigger 可被后续 round 复用。
