# 39_r6_6rc_release_candidate_manifest.md

## R6.6RC-1 候选版本清单

**候选版本 HEAD**: `edfcdac`
**Branch**: `feature/r6.6-secondary-route-dc-fidelity` (ahead 41)
**Worktree**: `G:\项目\study-tools-miniprogram-r6.6-secondary-routes`

### 本轮 Commits
```
edfcdac docs(release): prepare R6.6 true-device preview candidate workspace snapshot
44f7152 fix(ui): restore inline tab bar list for checker compatibility
```

### 全量历史 (累计)
```
edfcdac → 2886220 → 38c4044 → 62e3b42 → 9b939dd → 01f8a96 → 09d1981 → 168cef6 → ...
```

### 门禁结果

| 门禁 | 结果 |
|------|------|
| check_no_test_only_production_anchors | PASS |
| check_smoke_contract_integrity | PASS |
| check_r6_5_tab_page_shell_contract | 20/0 PASS |
| check_r6_5_tab_fullscreen_shell_contract | 35/0 PASS |
| check_r6_6_secondary_route_binding | 42/0 PASS |
| check_r6_6_exam_menu_dc_contract | 25/0 PASS |
| check_r6_6c1_runtime_module_resolution_contract | PASS |
| check_r6_6c1_runtime_entry_contract | PASS |
| check_r6_6c1_secondary_visual_shell_contract | 42 routes PASS |
| check_r6_6c1_flashcard_runtime_contract | 7 players PASS |
| check_r6_6c1_tabbar_lifecycle_ownership_contract | PASS |
| check_wxss_import_resolution | 73 imports PASS |
| run_miniprogram_checks --json | 18/18 PASS |
| check_textbook_term_coverage --all | ITP 73/73, SG 112/112 |
| audit_miniprogram_package_size | PASS |
| miniprogram_smoke_test | 158/159 (R3.31) |
| git diff --check | clean |

### 包体结果
- 总计: ~13.12 MB (380 files)
- quiz-itpass-1: 1.67 MB (超过 1.5MB 观察线)
- quiz-itpass-4: 1.52 MB (超过 1.5MB 观察线)

### Route 统计
- 总计: 47 route (5 TAB_ROOT + 42 secondary)

### 已知历史问题
- R3.31: `/packages/` 导航目标

### 受保护资产
- project.config.json: 本地修改，未提交
- project.private.config.json: 本地修改，未提交
- scratch/_temp_test.py: 用户本地
- scratch/_coldstart_sim.py: 一次性冷启动模拟

### 真机预览待确认项
详见 `docs/ui-rebuild/38_r6_6rc_true_device_preview_card.md`

### 声明
- 未 push / 未 PR / 未 merge
- 未上传体验版
- 未提交审核
- 未发布
- 未宣称人工验收
