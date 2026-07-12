# PYTHON P0 — 路径与基线判定报告

状态：**未触发 `PYTHON_PATH_BASELINE_CONFLICT`**（存在唯一可证明的线性 canonical 基线）

## 1. 真实仓库与内容位置

- 主 repo `G:/项目/study-tools-miniprogram`（branch `feature/ui-freeze-v1-foundation` @ `24ddb26`，有 remote `origin`）**不含任何 Python 内容**：全 refs 无 python 分支、无 python 路径。Python 工作从未合并回主线 / master。
- Python 内容存在于**独立 clone**（非主 repo 的 worktree），共发现 16 个 `study-tools-miniprogram-python-*-clean` 目录，均创建于 2026-07-03。

## 2. 16 个 python clone 的关系（git 可证明）

对全部 clone 的 HEAD 做可达性分析，结论：**它们构成同一条线性历史，唯一 tip = `801e251`**，其余全部是该 tip 的严格祖先（stale 检出），并非互相冲突的多基线。

线性主干（新 → 旧）：

```
801e251  feature/r8-python-full-corpus-auto      write complete bilingual authoring corpus   ← 唯一 TIP（canonical）
4e15b87  feature/r8-python-full-corpus-hq-b1 / fix/r8-python-shard-style-isolation
5275769  fix/r8-python-shard-train1-wxss-import
c33dd49  feature/r8-python-shard-train1-evidence-f2
48aa1ee  feature/r8-python-shard-train1-evidence-f1
18d0c29  feature/r8-python-shard-train1-auto     publish sharded multi-domain release train
f368b94  (scalable lesson shard + safe stdin runtime)
c390b10  feature/r8-python-full-program-d1b
3bcb83e  (full-course release ledger + scale plan)
057e342  feature/r8-python-home-runtime-f2
182d038  feature/r8-python-home-card-runtime-fix
ab430c0  feature/r8-python-home-card-structure
d73db8b  feature/r8-python-home-domain1a
65fffde  (approved golden lesson entry)
658e437  feature/r8-python-khaki-visual-refinement
196a0ac  feature/r8-python-source-map-goldens   establish source map + first bilingual golden lessons
56a9336  (java GS7/GS8 golden)  ← Python 工作叠在 Java golden lessons 之上
```

可达性证据：
- `git merge-base --is-ancestor 4e15b87 801e251` → 真（801e251 的父即 4e15b87）。
- `4e15b87` clone 的线性 log 完整包含 `18d0c29 / c390b10 / 196a0ac` 等全部候选 tip。
- `801e251` clone 的线性 log 追加包含 `196a0ac` 及其下的 Java golden。
- 唯一在 `18d0c29`/`4e15b87` clone 中「缺失对象」的 commit 是 `801e251`，原因是那些 clone 检出时点更早、未 fetch 后续提交——是 stale，不是 divergent。

## 3. 未提交改动（dirty tree）排查

- 绝大多数 stale clone 仅改动 `project.config.json` + `project.private.config.json`（DevTools 本地配置噪声，且本任务禁改）——**非竞争性 lesson 内容**。
- `python-full-corpus-hq-b1-clean` 有 untracked 实验工具/artifacts（`tools/_campaign.py`、`tools/_write_wave8.js`、`artifacts/python-course-authoring-corpus-hq-v1/` 等）——实验性 authoring 脚手架，**非提交的 canonical lesson**。
- canonical clone `full-corpus-auto-clean` @ 801e251 本身 **dirty=0**（干净）。

结论：无任何 dirty tree 构成竞争基线。

## 4. 锁定结论

| 项 | 值 |
|---|---|
| Canonical Python 基线 | `801e251fe35655f9cbf22cd84f75d9a0c407ec65` |
| 源分支 | `feature/r8-python-full-corpus-auto` |
| 源 clone | `study-tools-miniprogram-python-full-corpus-auto-clean` |
| 审计 worktree | `study-tools-miniprogram-python-p0-audit` |
| 审计分支 | `feature/python-content-p0-audit`（从 801e251 新建） |
| startHEAD（最终 diff 基准） | `801e251` |

## 5. 遗留风险（登记，不在本轮处理）

- **R-1**：canonical Python 内容从未合并到主 repo / master，仅存于侧 clone。未来发布需明确"哪个 repo 是 Python 权威源"。
- **R-2**：15 个 stale sibling clone + 若干 backup patch 长期滞留工作区，易误导后续轮次选错基线。建议归档。
- **R-3**：`hq-b1` clone 的 untracked authoring 工具链未纳入版本控制，存在丢失风险。
