# Python Full Course Release Ledger

本文件是 R8.PYTHON-FULL-P0-D1B 阶段 A 的全量发布总账说明。总账由 `tools/python-full-course-release-ledger.js` 从 `packages/python-course/data/python-source-manifest.js` 只读生成，不进入 learner-visible runtime，不复制 EPUB 正文、图片、HTML、href 或 anchor。

## Coverage

| 项目 | 当前实际值 | 证据 |
|---|---:|---|
| deepest source units | 790 | source manifest sourceUnits |
| lesson candidates | 699 | ledger entries / courseLessons |
| parent groups | 17 | sourceUnits inclusion=parent_group_only |
| explicit exclusions | 74 | sourceUnits inclusion=explicit_exclusion，且 reason 必填 |
| 当前 published lessons | 9 | releaseVisibility / public projection / Python manifest visible IDs |
| 当前 next_candidate lessons | 0 | next contiguous source unit is deferred_asset_required |

## Entry Contract

每个 release ledger entry 至少包含：`sourceUnitId`、`courseLessonId`、`sourceOrder`、`tocPath`、`parentRelation`、`type`、`releaseDomainKey`、`releaseWave`、`status`、`packageTarget`、`publishedVisibility`。

允许的 status 仅为：`published`、`next_candidate`、`planned`、`deferred_asset_required`、`explicit_exclusion`。本轮 ledger entries 覆盖 699 个 lesson_candidate；74 个 explicit exclusion 在 `explicitExclusions` 中单独保留 reason，不计入 699 个候选状态总和。

## Status Counts

| 状态 | lesson 数 |
|---|---:|
| published | 9 |
| next_candidate | 0 |
| planned | 299 |
| deferred_asset_required | 391 |
| explicit_exclusion | 0 |

总和：699 / 699 lesson candidates。

## Package Target Counts

| packageTarget | lesson 数 |
|---|---:|
| packages/python-course | 6 |
| packages/python-course-foundations-b | 3 |
| planned-python-foundations-continuation | 5 |
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

## Release Domains

| domainKey | sourceOrder 起止 | lesson 数 | parent | 概念主题 | 当前 releaseWave | 当前状态 |
|---|---:|---:|---|---|---|---|
| python-gs1 | 7-7 | 1 | Python编程：从入门到实践（第2版） | Visible script output | released | published |
| python-gs2 | 8-8 | 1 | Python编程：从入门到实践（第2版） | Values, names, and variables | released | published |
| python-domain1a | 9-11 | 3 | Python编程：从入门到实践（第2版） | Core containers and branching foundations | released | published |
| python-domain1b | 12-12 | 1 | Python编程：从入门到实践（第2版） | Next contiguous source-mapped foundation domain | released | published |
| r8-train1-input-while | 13-13 | 1 | Python编程：从入门到实践（第2版） | Future contiguous foundation domain | released | published |
| r8-train1-functions | 14-14 | 1 | Python编程：从入门到实践（第2版） | 第 8 章 函数 | released | published |
| r8-train1-class | 15-15 | 1 | Python编程：从入门到实践（第2版） | 第 9 章 类 | released | published |
| python-full-domain-0003 | 16-16 | 1 | Python编程：从入门到实践（第2版） | 第 10 章 文件和异常 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0004 | 17-17 | 1 | Python编程：从入门到实践（第2版） | 第 11 章 测试代码 | future-controlled-release | planned |
| python-full-domain-0005 | 20-20 | 1 | Python编程：从入门到实践（第2版） | 第 12 章 武装飞船 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0006 | 21-21 | 1 | Python编程：从入门到实践（第2版） | 第 13 章 外星人来了 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0007 | 22-22 | 1 | Python编程：从入门到实践（第2版） | 第 14 章 记分 | future-controlled-release | planned |
| python-full-domain-0008 | 24-24 | 1 | Python编程：从入门到实践（第2版） | 第 15 章 生成数据 | future-controlled-release | planned |
| python-full-domain-0009 | 25-25 | 1 | Python编程：从入门到实践（第2版） | 第 16 章 下载数据 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0010 | 26-26 | 1 | Python编程：从入门到实践（第2版） | 第 17 章 使用API | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0011 | 28-28 | 1 | Python编程：从入门到实践（第2版） | 第 18 章 从Django入手 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0012 | 29-29 | 1 | Python编程：从入门到实践（第2版） | 第 19 章 用户账户 | future-controlled-release | planned |
| python-full-domain-0013 | 30-30 | 1 | Python编程：从入门到实践（第2版） | 第 20 章 设置应用程序的样式并部署 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0014 | 44-45 | 2 | Python编程快速上手——让繁琐工作自动化 > 前言 | Python编程快速上手——让繁琐工作自动化 > 前言 / 本书的读者对象 ... 编码规范 | future-controlled-release | planned |
| python-full-domain-0015 | 46-48 | 3 | Python编程快速上手——让繁琐工作自动化 > 前言 > 什么是编程 | Python编程快速上手——让繁琐工作自动化 > 前言 > 什么是编程 / 什么是Python ... 编程是创造性活动 | future-controlled-release | planned |
| python-full-domain-0016 | 49-50 | 2 | Python编程快速上手——让繁琐工作自动化 > 前言 | Python编程快速上手——让繁琐工作自动化 > 前言 / 本书简介 ... 下载和安装Python | future-controlled-release | planned |
| python-full-domain-0017 | 51-51 | 1 | Python编程快速上手——让繁琐工作自动化 > 前言 > 启动IDLE | 交互式环境 | future-controlled-release | planned |
| python-full-domain-0018 | 52-54 | 3 | Python编程快速上手——让繁琐工作自动化 > 前言 | Python编程快速上手——让繁琐工作自动化 > 前言 / 如何寻求帮助 ... 小结 | future-controlled-release | planned |
| python-full-domain-0019 | 56-58 | 3 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 / 1.1 在交互式环境中输入表达式 ... 1.3 字符串连接和复制 | future-controlled-release | planned |
| python-full-domain-0020 | 59-60 | 2 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 > 1.4 在变量中保存值 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 > 1.4 在变量中保存值 / 1.4.1 赋值语句 ... 1.4.2 变量名 | future-controlled-release | planned |
| python-full-domain-0021 | 61-61 | 1 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 | 1.5 第一个程序 | future-controlled-release | planned |
| python-full-domain-0022 | 62-66 | 5 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 > 1.6 程序剖析 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 > 1.6 程序剖析 / 1.6.1 注释 ... 1.6.5 len()函数 | future-controlled-release | planned |
| python-full-domain-0023 | 67-67 | 1 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 > 1.6 程序剖析 | 1.6.6 str()、int()和float()函数 | future-controlled-release | planned |
| python-full-domain-0024 | 68-69 | 2 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 | Python编程快速上手——让繁琐工作自动化 > 第1章 Python基础 / 1.7 小结 ... 1.8 习题 | future-controlled-release | planned |
| python-full-domain-0025 | 70-71 | 2 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 / 2.1 布尔值 ... 2.2 比较操作符 | future-controlled-release | planned |
| python-full-domain-0026 | 72-73 | 2 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.3 布尔操作符 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.3 布尔操作符 / 2.3.1 二元布尔操作符 ... 2.3.2 not操作符 | future-controlled-release | planned |
| python-full-domain-0027 | 74-74 | 1 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 | 2.4 混合布尔和比较操作符 | future-controlled-release | planned |
| python-full-domain-0028 | 75-76 | 2 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.5 控制流的元素 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.5 控制流的元素 / 2.5.1 条件 ... 2.5.2 代码块 | future-controlled-release | planned |
| python-full-domain-0029 | 77-77 | 1 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 | 2.6 程序执行 | future-controlled-release | planned |
| python-full-domain-0030 | 78-82 | 5 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.7 控制流语句 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.7 控制流语句 / 2.7.1 if语句 ... 2.7.5 恼人的循环 | future-controlled-release | planned |
| python-full-domain-0031 | 83-87 | 5 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.7 控制流语句 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.7 控制流语句 / 2.7.6 break语句 ... 2.7.10 range()的开始、停止和步长参数 | future-controlled-release | planned |
| python-full-domain-0032 | 88-88 | 1 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 > 2.8 导入模块 | from import语句 | future-controlled-release | planned |
| python-full-domain-0033 | 89-91 | 3 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 | Python编程快速上手——让繁琐工作自动化 > 第2章 控制流 / 2.9 用sys.exit()提前结束程序 ... 2.11 习题 | future-controlled-release | planned |
| python-full-domain-0034 | 92-95 | 4 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 / 3.1 def语句和参数 ... 3.4 关键字参数和print() | future-controlled-release | planned |
| python-full-domain-0035 | 96-99 | 4 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 > 3.5 局部和全局作用域 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 > 3.5 局部和全局作用域 / 3.5.1 局部变量不能在全局作用域内使用 ... 3.5.4 名称相同的局部变量和全局变量 | future-controlled-release | planned |
| python-full-domain-0036 | 100-104 | 5 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 / 3.6 global语句 ... 3.10 习题 | future-controlled-release | planned |
| python-full-domain-0037 | 105-106 | 2 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 > 3.11 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第3章 函数 > 3.11 实践项目 / 3.11.1 Collatz序列 ... 3.11.2 输入验证 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0038 | 107-111 | 5 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.1 列表数据类型 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.1 列表数据类型 / 4.1.1 用下标取得列表中的单个值 ... 4.1.5 用下标改变列表中的值 | future-controlled-release | planned |
| python-full-domain-0039 | 112-113 | 2 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.1 列表数据类型 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.1 列表数据类型 / 4.1.6 列表连接和列表复制 ... 4.1.7 用del语句从列表中删除值 | future-controlled-release | planned |
| python-full-domain-0040 | 114-116 | 3 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.2 使用列表 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.2 使用列表 / 4.2.1 列表用于循环 ... 4.2.3 多重赋值技巧 | future-controlled-release | planned |
| python-full-domain-0041 | 117-117 | 1 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 | 4.3 增强的赋值操作 | future-controlled-release | planned |
| python-full-domain-0042 | 118-121 | 4 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.4 方法 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.4 方法 / 4.4.1 用index()方法在列表中查找值 ... 4.4.4 用sort()方法将列表中的值排序 | future-controlled-release | planned |
| python-full-domain-0043 | 122-122 | 1 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 | 4.5 例子程序：神奇8球和列表 | future-controlled-release | planned |
| python-full-domain-0044 | 123-125 | 3 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.6 类似列表的类型：字符串和元组 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.6 类似列表的类型：字符串和元组 / 4.6.1 可变和不可变数据类型 ... 4.6.3 用list()和tuple()函数来转换类型 | future-controlled-release | planned |
| python-full-domain-0045 | 126-127 | 2 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.7 引用 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.7 引用 / 4.7.1 传递引用 ... 4.7.2 copy模块的copy()和deepcopy()函数 | future-controlled-release | planned |
| python-full-domain-0046 | 128-129 | 2 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 / 4.8 小结 ... 4.9 习题 | future-controlled-release | planned |
| python-full-domain-0047 | 130-131 | 2 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.10 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第4章 列表 > 4.10 实践项目 / 4.10.1 逗号代码 ... 4.10.2 字符图网格 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0048 | 132-136 | 5 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.1 字典数据类型 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.1 字典数据类型 / 5.1.1 字典与列表 ... 5.1.5 setdefault()方法 | future-controlled-release | planned |
| python-full-domain-0049 | 137-137 | 1 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 | 5.2 漂亮打印 | future-controlled-release | planned |
| python-full-domain-0050 | 138-139 | 2 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.3 使用数据结构对真实世界建模 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.3 使用数据结构对真实世界建模 / 5.3.1 井字棋盘 ... 5.3.2 嵌套的字典和列表 | future-controlled-release | planned |
| python-full-domain-0051 | 140-141 | 2 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 / 5.4 小结 ... 5.5 习题 | future-controlled-release | planned |
| python-full-domain-0052 | 142-143 | 2 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.6 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第5章 字典和结构化数据 > 5.6 实践项目 / 5.6.1 好玩游戏的物品清单 ... 5.6.2 列表到字典的函数，针对好玩游戏物品清单 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0053 | 144-148 | 5 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.1 处理字符串 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.1 处理字符串 / 6.1.1 字符串字面量 ... 6.1.5 用三重引号的多行字符串 | future-controlled-release | planned |
| python-full-domain-0054 | 149-151 | 3 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.1 处理字符串 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.1 处理字符串 / 6.1.6 多行注释 ... 6.1.8 字符串的in和not in操作符 | future-controlled-release | planned |
| python-full-domain-0055 | 152-156 | 5 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.2 有用的字符串方法 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.2 有用的字符串方法 / 6.2.1 字符串方法upper()、lower()、isupper()和islower() ... 6.2.5 用rjust()、ljust()和center()方法对齐文本 | future-controlled-release | planned |
| python-full-domain-0056 | 157-158 | 2 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.2 有用的字符串方法 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.2 有用的字符串方法 / 6.2.6 用strip()、rstrip()和lstrip()删除空白字符 ... 6.2.7 用pyperclip模块拷贝粘贴字符串 | future-controlled-release | planned |
| python-full-domain-0057 | 159-161 | 3 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.3 项目：口令保管箱 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.3 项目：口令保管箱 / 第1步：程序设计和数据结构 ... 第3步：复制正确的口令 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0058 | 162-164 | 3 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.4 项目：在Wiki标记中添加无序列表 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.4 项目：在Wiki标记中添加无序列表 / 第1步：从剪贴板中复制和粘贴 ... 第3步：连接修改过的行 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0059 | 165-166 | 2 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 / 6.5 小结 ... 6.6 习题 | future-controlled-release | planned |
| python-full-domain-0060 | 167-167 | 1 | Python编程快速上手——让繁琐工作自动化 > 第6章 字符串操作 > 6.7 实践项目 | 表格打印 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0061 | 169-169 | 1 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 | 7.1 不用正则表达式来查找文本模式 | future-controlled-release | planned |
| python-full-domain-0062 | 170-172 | 3 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.2 用正则表达式查找文本模式 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.2 用正则表达式查找文本模式 / 7.2.1 创建正则表达式对象 ... 7.2.3 正则表达式匹配复习 | future-controlled-release | planned |
| python-full-domain-0063 | 173-177 | 5 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.3 用正则表达式匹配更多模式 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.3 用正则表达式匹配更多模式 / 7.3.1 利用括号分组 ... 7.3.5 用加号匹配一次或多次 | future-controlled-release | planned |
| python-full-domain-0064 | 178-178 | 1 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.3 用正则表达式匹配更多模式 | 7.3.6 用花括号匹配特定次数 | future-controlled-release | planned |
| python-full-domain-0065 | 179-183 | 5 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 / 7.4 贪心和非贪心匹配 ... 7.8 插入字符和美元字符 | future-controlled-release | planned |
| python-full-domain-0066 | 184-185 | 2 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.9 通配字符 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.9 通配字符 / 7.9.1 用点-星匹配所有字符 ... 7.9.2 用句点字符匹配换行 | future-controlled-release | planned |
| python-full-domain-0067 | 186-190 | 5 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 / 7.10 正则表达式符号复习 ... 7.14 组合使用re.IGNORECASE、re.DOTALL和re.VERBOSE | future-controlled-release | planned |
| python-full-domain-0068 | 191-195 | 5 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.15 项目：电话号码和E-mail地址提取程序 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.15 项目：电话号码和E-mail地址提取程序 / 第1步：为电话号码创建一个正则表达式 ... 第5步：运行程序 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0069 | 196-196 | 1 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.15 项目：电话号码和E-mail地址提取程序 | 第6步：类似程序的构想 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0070 | 197-198 | 2 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 / 7.16 小结 ... 7.17 习题 | future-controlled-release | planned |
| python-full-domain-0071 | 199-200 | 2 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.18 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第7章 模式匹配与正则表达式 > 7.18 实践项目 / 7.18.1 强口令检测 ... 7.18.2 strip()的正则表达式版本 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0072 | 201-205 | 5 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.1 文件与文件路径 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.1 文件与文件路径 / 8.1.1 Windows上的倒斜杠以及OS X和Linux上的正斜杠 ... 8.1.5 os.path模块 | future-controlled-release | planned |
| python-full-domain-0073 | 206-208 | 3 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.1 文件与文件路径 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.1 文件与文件路径 / 8.1.6 处理绝对路径和相对路径 ... 8.1.8 检查路径有效性 | future-controlled-release | planned |
| python-full-domain-0074 | 209-211 | 3 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.2 文件读写过程 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.2 文件读写过程 / 8.2.1 用open()函数打开文件 ... 8.2.3 写入文件 | future-controlled-release | planned |
| python-full-domain-0075 | 212-213 | 2 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 / 8.3 用shelve模块保存变量 ... 8.4 用pprint.pformat()函数保存变量 | future-controlled-release | planned |
| python-full-domain-0076 | 214-217 | 4 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.5 项目：生成随机的测验试卷文件 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.5 项目：生成随机的测验试卷文件 / 第1步：将测验数据保存在一个字典中 ... 第4步：将内容写入测验试卷和答案文件 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0077 | 218-220 | 3 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.6 项目：多重剪贴板 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.6 项目：多重剪贴板 / 第1步：注释和shelf设置 ... 第3步：列出关键字和加载关键字的内容 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0078 | 221-222 | 2 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 / 8.7 小结 ... 8.8 习题 | future-controlled-release | planned |
| python-full-domain-0079 | 223-225 | 3 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.9 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第8章 读写文件 > 8.9 实践项目 / 8.9.1 扩展多重剪贴板 ... 8.9.3 正则表达式查找 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0080 | 226-229 | 4 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.1 shutil模块 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.1 shutil模块 / 9.1.1 复制文件和文件夹 ... 9.1.4 用send2trash模块安全地删除 | future-controlled-release | planned |
| python-full-domain-0081 | 230-230 | 1 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 | 9.2 遍历目录树 | future-controlled-release | planned |
| python-full-domain-0082 | 231-233 | 3 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.3 用zipfile模块压缩文件 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.3 用zipfile模块压缩文件 / 9.3.1 读取ZIP文件 ... 9.3.3 创建和添加到ZIP文件 | future-controlled-release | planned |
| python-full-domain-0083 | 234-237 | 4 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.4 项目：将带有美国风格日期的文件改名为欧洲风格日期 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.4 项目：将带有美国风格日期的文件改名为欧洲风格日期 / 第1步：为美国风格的日期创建一个正则表达式 ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0084 | 238-241 | 4 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.5 项目：将一个文件夹备份到一个ZIP文件 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.5 项目：将一个文件夹备份到一个ZIP文件 / 第1步：弄清楚ZIP文件的名称 ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0085 | 242-243 | 2 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 / 9.6 小结 ... 9.7 习题 | future-controlled-release | planned |
| python-full-domain-0086 | 244-246 | 3 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.8 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第9章 组织文件 > 9.8 实践项目 / 9.8.1 选择性拷贝 ... 9.8.3 消除缺失的编号 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0087 | 247-248 | 2 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 / 10.1 抛出异常 ... 10.2 取得反向跟踪的字符串 | future-controlled-release | planned |
| python-full-domain-0088 | 249-250 | 2 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.3 断言 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.3 断言 / 10.3.1 在交通灯模拟中使用断言 ... 10.3.2 禁用断言 | future-controlled-release | planned |
| python-full-domain-0089 | 251-255 | 5 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.4 日志 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.4 日志 / 10.4.1 使用日志模块 ... 10.4.5 将日志记录到文件 | future-controlled-release | planned |
| python-full-domain-0090 | 256-260 | 5 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.5 IDLE的调试器 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.5 IDLE的调试器 / 10.5.1 Go ... 10.5.5 Quit | future-controlled-release | planned |
| python-full-domain-0091 | 261-262 | 2 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.5 IDLE的调试器 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.5 IDLE的调试器 / 10.5.6 调试一个数字相加的程序 ... 10.5.7 断点 | future-controlled-release | planned |
| python-full-domain-0092 | 263-264 | 2 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 / 10.6 小结 ... 10.7 习题 | future-controlled-release | planned |
| python-full-domain-0093 | 265-265 | 1 | Python编程快速上手——让繁琐工作自动化 > 第10章 调试 > 10.8 实践项目 | 调试硬币抛掷 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0094 | 266-269 | 4 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.1 项目：利用webbrowser模块的mapIt.py | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.1 项目：利用webbrowser模块的mapIt.py / 第1步：弄清楚URL ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0095 | 270-271 | 2 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.2 用requests模块从Web下载文件 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.2 用requests模块从Web下载文件 / 11.2.1 用requests.get()函数下载一个网页 ... 11.2.2 检查错误 | future-controlled-release | planned |
| python-full-domain-0096 | 272-272 | 1 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 | 11.3 将下载的文件保存到硬盘 | future-controlled-release | planned |
| python-full-domain-0097 | 273-277 | 5 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.4 HTML | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.4 HTML / 11.4.1 学习HTML的资源 ... 11.4.5 使用开发者工具来寻找HTML元素 | future-controlled-release | planned |
| python-full-domain-0098 | 278-280 | 3 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.5 用BeautifulSoup模块解析HTML | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.5 用BeautifulSoup模块解析HTML / 11.5.1 从HTML创建一个BeautifulSoup对象 ... 11.5.3 通过元素的属性获取数据 | future-controlled-release | planned |
| python-full-domain-0099 | 281-284 | 4 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.6 项目：“I’m Feeling Lucky”Google查找 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.6 项目：“I’m Feeling Lucky”Google查找 / 第１步：获取命令行参数，并请求查找页面 ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0100 | 285-289 | 5 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.7 项目：下载所有XKCD漫画 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.7 项目：下载所有XKCD漫画 / 第1步：设计程序 ... 第5步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0101 | 290-294 | 5 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.8 用selenium模块控制浏览器 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.8 用selenium模块控制浏览器 / 11.8.1 启动selenium控制的浏览器 ... 11.8.5 发送特殊键 | future-controlled-release | planned |
| python-full-domain-0102 | 295-296 | 2 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.8 用selenium模块控制浏览器 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.8 用selenium模块控制浏览器 / 11.8.6 点击浏览器按钮 ... 11.8.7 关于selenium的更多信息 | future-controlled-release | planned |
| python-full-domain-0103 | 297-298 | 2 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 / 11.9 小结 ... 11.10 习题 | future-controlled-release | planned |
| python-full-domain-0104 | 299-302 | 4 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.11 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第11章 从Web抓取信息 > 11.11 实践项目 / 11.11.1 命令行邮件程序 ... 11.11.4 链接验证 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0105 | 303-304 | 2 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 / 12.1 Excel文档 ... 12.2 安装openpyxl模块 | future-controlled-release | planned |
| python-full-domain-0106 | 305-309 | 5 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.3 读取Excel文档 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.3 读取Excel文档 / 12.3.1 用openpyxl模块打开Excel文档 ... 12.3.5 从表中取得行和列 | future-controlled-release | planned |
| python-full-domain-0107 | 310-310 | 1 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.3 读取Excel文档 | 12.3.6 工作簿、工作表、单元格 | future-controlled-release | planned |
| python-full-domain-0108 | 311-314 | 4 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.4 项目：从电子表格中读取数据 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.4 项目：从电子表格中读取数据 / 第1步：读取电子表格数据 ... 第4步：类似程序的思想 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0109 | 315-317 | 3 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.5 写入Excel文档 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.5 写入Excel文档 / 12.5.1 创建并保存Excel文档 ... 12.5.3 将值写入单元格 | future-controlled-release | planned |
| python-full-domain-0110 | 318-320 | 3 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.6 项目：更新一个电子表格 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.6 项目：更新一个电子表格 / 第1步：利用更新信息建立数据结构 ... 第3步：类似程序的思想 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0111 | 321-323 | 3 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 / 12.7 设置单元格的字体风格 ... 12.9 公式 | future-controlled-release | planned |
| python-full-domain-0112 | 324-327 | 4 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.10 调整行和列 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.10 调整行和列 / 12.10.1 设置行高和列宽 ... 12.10.4 图表 | future-controlled-release | planned |
| python-full-domain-0113 | 328-329 | 2 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 / 12.11 小结 ... 12.12 习题 | future-controlled-release | planned |
| python-full-domain-0114 | 330-334 | 5 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.13 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第12章 处理Excel电子表格 > 12.13 实践项目 / 12.13.1 乘法表 ... 12.13.5 电子表格到文本文件 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0115 | 335-339 | 5 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.1 PDF文档 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.1 PDF文档 / 13.1.1 从PDF提取文本 ... 13.1.5 旋转页面 | future-controlled-release | planned |
| python-full-domain-0116 | 340-341 | 2 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.1 PDF文档 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.1 PDF文档 / 13.1.6 叠加页面 ... 13.1.7 加密PDF | future-controlled-release | planned |
| python-full-domain-0117 | 342-346 | 5 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.2 项目：从多个PDF中合并选择的页面 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.2 项目：从多个PDF中合并选择的页面 / 第1步：找到所有PDF文件 ... 第5步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0118 | 347-351 | 5 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.3 Word文档 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.3 Word文档 / 13.3.1 读取Word文档 ... 13.3.5 Run属性 | future-controlled-release | planned |
| python-full-domain-0119 | 352-355 | 4 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.3 Word文档 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.3 Word文档 / 13.3.6 写入Word文档 ... 13.3.9 添加图像 | future-controlled-release | planned |
| python-full-domain-0120 | 356-357 | 2 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 / 13.4 小结 ... 13.5 习题 | future-controlled-release | planned |
| python-full-domain-0121 | 358-360 | 3 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.6 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第13章 处理PDF和Word文档 > 13.6 实践项目 / 13.6.1 PDF偏执狂 ... 13.6.3 暴力PDF口令破解程序 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0122 | 361-364 | 4 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.1 csv模块 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.1 csv模块 / 14.1.1 Reader对象 ... 14.1.4 delimiter和lineterminator关键字参数 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0123 | 365-368 | 4 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.2 项目：从CSV文件中删除表头 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.2 项目：从CSV文件中删除表头 / 第1步：循环遍历每个CSV文件 ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0124 | 369-369 | 1 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 | 14.3 JSON和API | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0125 | 370-371 | 2 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.4 json模块 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.4 json模块 / 14.4.1 用loads()函数读取JSON ... 14.4.2 用dumps函数写出JSON | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0126 | 372-375 | 4 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.5 项目：取得当前的天气数据 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.5 项目：取得当前的天气数据 / 第1步：从命令行参数获取位置 ... 第4步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0127 | 376-377 | 2 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 / 14.6 小结 ... 14.7 习题 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0128 | 378-378 | 1 | Python编程快速上手——让繁琐工作自动化 > 第14章 处理CSV文件和JSON数据 > 14.8 实践项目 | Excel到CSV的转换程序 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0129 | 379-380 | 2 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.1 time模块 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.1 time模块 / 15.1.1 time.time()函数 ... 15.1.2 time.sleep()函数 | future-controlled-release | planned |
| python-full-domain-0130 | 381-381 | 1 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 | 15.2 数字四舍五入 | future-controlled-release | planned |
| python-full-domain-0131 | 382-384 | 3 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.3 项目：超级秒表 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.3 项目：超级秒表 / 第1步：设置程序来记录时间 ... 第3步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0132 | 385-388 | 4 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.4 datetime模块 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.4 datetime模块 / 15.4.1 timedelta数据类型 ... 15.4.4 将字符串转换成datetime对象 | future-controlled-release | planned |
| python-full-domain-0133 | 389-389 | 1 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 | 15.5 回顾Python的时间函数 | future-controlled-release | planned |
| python-full-domain-0134 | 390-391 | 2 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.6 多线程 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.6 多线程 / 15.6.1 向线程的目标函数传递参数 ... 15.6.2 并发问题 | future-controlled-release | planned |
| python-full-domain-0135 | 392-394 | 3 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.7 项目：多线程XKCD下载程序 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.7 项目：多线程XKCD下载程序 / 第1步：修改程序以使用函数 ... 第3步：等待所有线程结束 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0136 | 395-399 | 5 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.8 从Python启动其他程序 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.8 从Python启动其他程序 / 15.8.1 向Popen()传递命令行参数 ... 15.8.5 用默认的应用程序打开文件 | future-controlled-release | planned |
| python-full-domain-0137 | 400-402 | 3 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.9 项目：简单的倒计时程序 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.9 项目：简单的倒计时程序 / 第1步：倒计时 ... 第3步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0138 | 403-404 | 2 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 / 15.10 小结 ... 15.11 习题 | future-controlled-release | planned |
| python-full-domain-0139 | 405-406 | 2 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.12 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第15章 保持时间、计划任务和启动程序 > 15.12 实践项目 / 15.12.1 美化的秒表 ... 15.12.2 计划的Web漫画下载 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0140 | 407-407 | 1 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 | 16.1 SMTP | future-controlled-release | planned |
| python-full-domain-0141 | 408-412 | 5 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.2 发送电子邮件 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.2 发送电子邮件 / 16.2.1 连接到SMTP服务器 ... 16.2.5 发送电子邮件 | future-controlled-release | planned |
| python-full-domain-0142 | 413-413 | 1 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.2 发送电子邮件 | 16.2.6 从SMTP服务器断开 | future-controlled-release | planned |
| python-full-domain-0143 | 414-414 | 1 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 | 16.3 IMAP | future-controlled-release | planned |
| python-full-domain-0144 | 415-419 | 5 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.4 用IMAP获取和删除电子邮件 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.4 用IMAP获取和删除电子邮件 / 16.4.1 连接到IMAP服务器 ... 16.4.5 执行搜索 | future-controlled-release | planned |
| python-full-domain-0145 | 420-424 | 5 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.4 用IMAP获取和删除电子邮件 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.4 用IMAP获取和删除电子邮件 / 16.4.6 大小限制 ... 16.4.10 删除电子邮件 | future-controlled-release | planned |
| python-full-domain-0146 | 425-425 | 1 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.4 用IMAP获取和删除电子邮件 | 16.4.11 从IMAP服务器断开 | future-controlled-release | planned |
| python-full-domain-0147 | 426-428 | 3 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.5 项目：向会员发送会费提醒电子邮件 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.5 项目：向会员发送会费提醒电子邮件 / 第1步：打开Excel文件 ... 第3步：发送定制的电子邮件提醒 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0148 | 429-430 | 2 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.6 用Twilio发送短信 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.6 用Twilio发送短信 / 16.6.1 注册Twilio账号 ... 16.6.2 发送短信 | future-controlled-release | planned |
| python-full-domain-0149 | 431-433 | 3 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 / 16.7 项目：“只给我发短信”模块 ... 16.9 习题 | future-controlled-release | planned |
| python-full-domain-0150 | 434-437 | 4 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.10 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第16章 发送电子邮件和短信 > 16.10 实践项目 / 16.10.1 随机分配家务活的电子邮件程序 ... 16.10.4 通过电子邮件控制你的电脑 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0151 | 438-439 | 2 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.1 计算机图像基础 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.1 计算机图像基础 / 17.1.1 颜色和RGBA值 ... 17.1.2 坐标和Box元组 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0152 | 440-444 | 5 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.2 用Pillow操作图像 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.2 用Pillow操作图像 / 17.2.1 处理Image数据类型 ... 17.2.5 旋转和翻转图像 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0153 | 445-445 | 1 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.2 用Pillow操作图像 | 17.2.6 更改单个像素 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0154 | 446-450 | 5 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.3 项目：添加徽标 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.3 项目：添加徽标 / 第1步：打开徽标图像 ... 第5步：类似程序的想法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0155 | 451-452 | 2 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.4 在图像上绘画 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.4 在图像上绘画 / 17.4.1 绘制形状 ... 17.4.2 绘制文本 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0156 | 453-454 | 2 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 / 17.5 小结 ... 17.6 习题 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0157 | 455-457 | 3 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.7 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第17章 操作图像 > 17.7 实践项目 / 17.7.1 扩展和修正本章项目的程序 ... 17.7.3 定制的座位卡 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0158 | 458-458 | 1 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 | 18.1 安装pyautogui模块 | future-controlled-release | planned |
| python-full-domain-0159 | 459-460 | 2 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.2 走对路 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.2 走对路 / 18.2.1 通过注销关闭所有程序 ... 18.2.2 暂停和自动防故障装置 | future-controlled-release | planned |
| python-full-domain-0160 | 461-462 | 2 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.3 控制鼠标移动 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.3 控制鼠标移动 / 18.3.1 移动鼠标 ... 18.3.2 获取鼠标位置 | future-controlled-release | planned |
| python-full-domain-0161 | 463-465 | 3 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.4 项目：“现在鼠标在哪里？” | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.4 项目：“现在鼠标在哪里？” / 第1步：导入模块 ... 第3步：获取并打印鼠标坐标 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0162 | 466-468 | 3 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.5 控制鼠标交互 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.5 控制鼠标交互 / 18.5.1 点击鼠标 ... 18.5.3 滚动鼠标 | future-controlled-release | planned |
| python-full-domain-0163 | 469-470 | 2 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.6 处理屏幕 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.6 处理屏幕 / 18.6.1 获取屏幕快照 ... 18.6.2 分析屏幕快照 | future-controlled-release | planned |
| python-full-domain-0164 | 471-472 | 2 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 / 18.7 项目：扩展mouseNow程序 ... 18.8 图像识别 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0165 | 473-476 | 4 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.9 控制键盘 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.9 控制键盘 / 18.9.1 通过键盘发送一个字符串 ... 18.9.4 热键组合 | future-controlled-release | planned |
| python-full-domain-0166 | 477-477 | 1 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 | 18.10 复习PyAutoGUI的函数 | future-controlled-release | planned |
| python-full-domain-0167 | 478-482 | 5 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.11 项目：自动填表程序 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.11 项目：自动填表程序 / 第1步：弄清楚步骤 ... 第5步：提交表单并等待 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0168 | 483-484 | 2 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 / 18.12 小结 ... 18.13 习题 | future-controlled-release | planned |
| python-full-domain-0169 | 485-487 | 3 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.14 实践项目 | Python编程快速上手——让繁琐工作自动化 > 第18章 用GUI自动化控制键盘和鼠标 > 18.14 实践项目 / 18.14.1 看起来很忙 ... 18.14.3 玩游戏机器人指南 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0170 | 495-495 | 1 | Python编程快速上手——让繁琐工作自动化 > 欢迎来到异步社区！ | 异步社区的来历 | future-controlled-release | planned |
| python-full-domain-0171 | 498-498 | 1 | Python编程快速上手——让繁琐工作自动化 > 欢迎来到异步社区！ > 社区里都有什么？ | 与作译者互动 | future-controlled-release | planned |
| python-full-domain-0172 | 500-501 | 2 | Python编程快速上手——让繁琐工作自动化 > 欢迎来到异步社区！ > 社区里还可以做什么？ | Python编程快速上手——让繁琐工作自动化 > 欢迎来到异步社区！ > 社区里还可以做什么？ / 提交勘误 ... 写作 | future-controlled-release | planned |
| python-full-domain-0173 | 508-508 | 1 | Python极客项目编程 > 前言 | 本书的目标读者 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0174 | 514-515 | 2 | Python极客项目编程 > 前言 > 为何选择Python | Python极客项目编程 > 前言 > 为何选择Python / Python的版本 ... 本书的代码 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0175 | 517-518 | 2 | Python极客项目编程 > 第1章 解析iTunes播放列表 | Python极客项目编程 > 第1章 解析iTunes播放列表 / 1.1 iTunes播放列表文件剖析 ... 1.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0176 | 519-523 | 5 | Python极客项目编程 > 第1章 解析iTunes播放列表 > 1.3 代码 | Python极客项目编程 > 第1章 解析iTunes播放列表 > 1.3 代码 / 1.3.1 查找重复 ... 1.3.5 绘制数据 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0177 | 524-524 | 1 | Python极客项目编程 > 第1章 解析iTunes播放列表 > 1.3 代码 | 1.3.6 命令行选项 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0178 | 525-528 | 4 | Python极客项目编程 > 第1章 解析iTunes播放列表 | Python极客项目编程 > 第1章 解析iTunes播放列表 / 1.4 完整代码 ... 1.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0179 | 529-530 | 2 | Python极客项目编程 > 第2章 万花尺 > 2.1 参数方程 | Python极客项目编程 > 第2章 万花尺 > 2.1 参数方程 / 2.1.1 万花尺方程 ... 2.1.2 海龟画图 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0180 | 531-531 | 1 | Python极客项目编程 > 第2章 万花尺 | 2.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0181 | 532-536 | 5 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 / 2.3.1 Spiro构造函数 ... 2.3.5 创建动画 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0182 | 537-541 | 5 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 / 2.3.6 SpiroAnimator类 ... 2.3.10 显示或隐藏光标 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0183 | 542-543 | 2 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 | Python极客项目编程 > 第2章 万花尺 > 2.3 代码 / 2.3.11 保存曲线 ... 2.3.12 解析命令行参数和初始化 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0184 | 544-547 | 4 | Python极客项目编程 > 第2章 万花尺 | Python极客项目编程 > 第2章 万花尺 / 2.4 完整代码 ... 2.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0185 | 549-550 | 2 | Python极客项目编程 > 第3章 Conway生命游戏 | Python极客项目编程 > 第3章 Conway生命游戏 / 3.1 工作原理 ... 3.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0186 | 551-555 | 5 | Python极客项目编程 > 第3章 Conway生命游戏 > 3.3 代码 | Python极客项目编程 > 第3章 Conway生命游戏 > 3.3 代码 / 3.3.1 表示网格 ... 3.3.5 向程序发送命令行参数 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0187 | 556-556 | 1 | Python极客项目编程 > 第3章 Conway生命游戏 > 3.3 代码 | 3.3.6 初始化模拟 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0188 | 557-560 | 4 | Python极客项目编程 > 第3章 Conway生命游戏 | Python极客项目编程 > 第3章 Conway生命游戏 / 3.4 完整代码 ... 3.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0189 | 561-563 | 3 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 > 4.1 工作原理 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 > 4.1 工作原理 / 4.1.1 模拟 ... 4.1.3 小调五声音阶 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0190 | 564-564 | 1 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 | 4.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0191 | 565-569 | 5 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 > 4.3 代码 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 > 4.3 代码 / 4.3.1 用deque实现环形缓冲区 ... 4.3.5 main()方法 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0192 | 570-573 | 4 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 | Python极客项目编程 > 第4章 用Karplus-Strong算法产生音乐泛音 / 4.4 完整代码 ... 4.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0193 | 574-575 | 2 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 / 5.1 工作原理 ... 5.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0194 | 576-580 | 5 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 > 5.3 代码 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 > 5.3 代码 / 5.3.1 计算类鸟群的位置和速度 ... 5.3.5 添加个体 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0195 | 581-583 | 3 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 > 5.3 代码 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 > 5.3 代码 / 5.3.6 驱散类鸟群 ... 5.3.8 Boids类 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0196 | 584-587 | 4 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 | Python极客项目编程 > 第5章 类鸟群：仿真鸟群 / 5.4 完整代码 ... 5.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0197 | 589-590 | 2 | Python极客项目编程 > 第6章 ASCII文本图形 | Python极客项目编程 > 第6章 ASCII文本图形 / 6.1 工作原理 ... 6.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0198 | 591-595 | 5 | Python极客项目编程 > 第6章 ASCII文本图形 > 6.3 代码 | Python极客项目编程 > 第6章 ASCII文本图形 > 6.3 代码 / 6.3.1 定义灰度等级和网格 ... 6.3.5 将ASCII文本图形字符串写入文本文件 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0199 | 596-599 | 4 | Python极客项目编程 > 第6章 ASCII文本图形 | Python极客项目编程 > 第6章 ASCII文本图形 / 6.4 完整代码 ... 6.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0200 | 600-602 | 3 | Python极客项目编程 > 第7章 照片马赛克 > 7.1 工作原理 | Python极客项目编程 > 第7章 照片马赛克 > 7.1 工作原理 / 7.1.1 分割目标图像 ... 7.1.3 匹配图像 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0201 | 603-603 | 1 | Python极客项目编程 > 第7章 照片马赛克 | 7.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0202 | 604-608 | 5 | Python极客项目编程 > 第7章 照片马赛克 > 7.3 代码 | Python极客项目编程 > 第7章 照片马赛克 > 7.3 代码 / 7.3.1 读入小块图像 ... 7.3.5 创建图像网格 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0203 | 609-611 | 3 | Python极客项目编程 > 第7章 照片马赛克 > 7.3 代码 | Python极客项目编程 > 第7章 照片马赛克 > 7.3 代码 / 7.3.6 创建照片马赛克 ... 7.3.8 控制照片马赛克的大小 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0204 | 612-615 | 4 | Python极客项目编程 > 第7章 照片马赛克 | Python极客项目编程 > 第7章 照片马赛克 / 7.4 完整代码 ... 7.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0205 | 616-617 | 2 | Python极客项目编程 > 第8章 三维立体画 > 8.1 工作原理 | Python极客项目编程 > 第8章 三维立体画 > 8.1 工作原理 / 8.1.1 感知三维立体画中的深度 ... 8.1.2 深度图 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0206 | 618-618 | 1 | Python极客项目编程 > 第8章 三维立体画 | 8.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0207 | 619-622 | 4 | Python极客项目编程 > 第8章 三维立体画 > 8.3 代码 | Python极客项目编程 > 第8章 三维立体画 > 8.3 代码 / 8.3.1 重复给定的平铺图像 ... 8.3.4 命令行选项 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0208 | 623-626 | 4 | Python极客项目编程 > 第8章 三维立体画 | Python极客项目编程 > 第8章 三维立体画 / 8.4 完整代码 ... 8.7 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0209 | 628-628 | 1 | Python极客项目编程 > 第9章 理解OpenGL | 9.1 老式OpenGL | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0210 | 629-633 | 5 | Python极客项目编程 > 第9章 理解OpenGL > 9.2 现代OpenGL：三维图形管线 | Python极客项目编程 > 第9章 理解OpenGL > 9.2 现代OpenGL：三维图形管线 / 9.2.1 几何图元 ... 9.2.5 纹理贴图 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0211 | 634-634 | 1 | Python极客项目编程 > 第9章 理解OpenGL > 9.2 现代OpenGL：三维图形管线 | 9.2.6 显示OpenGL | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0212 | 635-635 | 1 | Python极客项目编程 > 第9章 理解OpenGL | 9.3 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0213 | 636-638 | 3 | Python极客项目编程 > 第9章 理解OpenGL > 9.4 代码 | Python极客项目编程 > 第9章 理解OpenGL > 9.4 代码 / 9.4.1 创建OpenGL窗口 ... 9.4.3 Scene类 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0214 | 639-642 | 4 | Python极客项目编程 > 第9章 理解OpenGL | Python极客项目编程 > 第9章 理解OpenGL / 9.5 完整代码 ... 9.8 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0215 | 643-647 | 5 | Python极客项目编程 > 第10章 粒子系统 > 10.1 工作原理 | Python极客项目编程 > 第10章 粒子系统 > 10.1 工作原理 / 10.1.1 为粒子运动建模 ... 10.1.5 使用公告板 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0216 | 648-648 | 1 | Python极客项目编程 > 第10章 粒子系统 > 10.1 工作原理 | 10.1.6 生成火花动画 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0217 | 649-649 | 1 | Python极客项目编程 > 第10章 粒子系统 | 10.2 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0218 | 650-654 | 5 | Python极客项目编程 > 第10章 粒子系统 > 10.3 粒子系统的代码 | Python极客项目编程 > 第10章 粒子系统 > 10.3 粒子系统的代码 / 10.3.1 定义粒子的几何形状 ... 10.3.5 创建片段着色器 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0219 | 655-656 | 2 | Python极客项目编程 > 第10章 粒子系统 > 10.3 粒子系统的代码 | Python极客项目编程 > 第10章 粒子系统 > 10.3 粒子系统的代码 / 10.3.6 渲染 ... 10.3.7 Camera类 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0220 | 657-658 | 2 | Python极客项目编程 > 第10章 粒子系统 | Python极客项目编程 > 第10章 粒子系统 / 10.4 粒子系统完整代码 ... 10.5 盒子代码 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0221 | 659-661 | 3 | Python极客项目编程 > 第10章 粒子系统 > 10.6 主程序代码 | Python极客项目编程 > 第10章 粒子系统 > 10.6 主程序代码 / 10.6.1 每步更新这些粒子 ... 10.6.3 管理主程序循环 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0222 | 662-665 | 4 | Python极客项目编程 > 第10章 粒子系统 | Python极客项目编程 > 第10章 粒子系统 / 10.7 完整主程序代码 ... 10.10 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0223 | 666-668 | 3 | Python极客项目编程 > 第11章 体渲染 > 11.1 工作原理 | Python极客项目编程 > 第11章 体渲染 > 11.1 工作原理 / 11.1.1 数据格式 ... 11.1.3 显示OpenGL窗口 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0224 | 669-672 | 4 | Python极客项目编程 > 第11章 体渲染 | Python极客项目编程 > 第11章 体渲染 / 11.2 所需模块 ... 11.5 完整的三维纹理代码 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0225 | 673-677 | 5 | Python极客项目编程 > 第11章 体渲染 > 11.6 生成光线 | Python极客项目编程 > 第11章 体渲染 > 11.6 生成光线 / 11.6.1 定义颜色立方体的几何形状 ... 11.6.5 渲染整个立方体 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0226 | 678-678 | 1 | Python极客项目编程 > 第11章 体渲染 > 11.6 生成光线 | 11.6.6 调整大小处理程序 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0227 | 679-679 | 1 | Python极客项目编程 > 第11章 体渲染 | 11.7 完整的光线生成代码 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0228 | 680-681 | 2 | Python极客项目编程 > 第11章 体渲染 > 11.8 体光线投射 | Python极客项目编程 > 第11章 体渲染 > 11.8 体光线投射 / 11.8.1 顶点着色器 ... 11.8.2 片段着色器 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0229 | 682-682 | 1 | Python极客项目编程 > 第11章 体渲染 | 11.9 完整的体光线投射代码 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0230 | 683-685 | 3 | Python极客项目编程 > 第11章 体渲染 > 11.10 二维切片 | Python极客项目编程 > 第11章 体渲染 > 11.10 二维切片 / 11.10.1 顶点着色器 ... 11.10.3 针对二维切片的用户界面 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0231 | 686-690 | 5 | Python极客项目编程 > 第11章 体渲染 | Python极客项目编程 > 第11章 体渲染 / 11.11 完整的二维切片代码 ... 11.15 小结 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0232 | 691-691 | 1 | Python极客项目编程 > 第11章 体渲染 | 11.16 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0233 | 693-693 | 1 | Python极客项目编程 > 第12章 Arduino简介 | 12.1 Arduino | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0234 | 694-697 | 4 | Python极客项目编程 > 第12章 Arduino简介 > 12.2 Arduino生态系统 | Python极客项目编程 > 第12章 Arduino简介 > 12.2 Arduino生态系统 / 12.2.1 语言 ... 12.2.4 外设 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0235 | 698-698 | 1 | Python极客项目编程 > 第12章 Arduino简介 | 12.3 所需模块 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0236 | 699-701 | 3 | Python极客项目编程 > 第12章 Arduino简介 > 12.4 搭建感光电路 | Python极客项目编程 > 第12章 Arduino简介 > 12.4 搭建感光电路 / 12.4.1 电路工作原理 ... 12.4.3 创建实时图表 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0237 | 702-706 | 5 | Python极客项目编程 > 第12章 Arduino简介 | Python极客项目编程 > 第12章 Arduino简介 / 12.5 Python代码 ... 12.9 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0238 | 707-708 | 2 | Python极客项目编程 > 第13章 激光音乐秀 > 13.1 用激光产生图案 | Python极客项目编程 > 第13章 激光音乐秀 > 13.1 用激光产生图案 / 13.1.1 电机控制 ... 13.1.2 快速傅里叶变换 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0239 | 709-710 | 2 | Python极客项目编程 > 第13章 激光音乐秀 > 13.2 所需模块 | Python极客项目编程 > 第13章 激光音乐秀 > 13.2 所需模块 / 13.2.1 搭建激光秀 ... 13.2.2 连接电机驱动器 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0240 | 711-713 | 3 | Python极客项目编程 > 第13章 激光音乐秀 > 13.3 Arduino程序 | Python极客项目编程 > 第13章 激光音乐秀 > 13.3 Arduino程序 / 13.3.1 配置Arduino数字输出引脚 ... 13.3.3 停止电机 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0241 | 714-718 | 5 | Python极客项目编程 > 第13章 激光音乐秀 > 13.4 Python代码 | Python极客项目编程 > 第13章 激光音乐秀 > 13.4 Python代码 / 13.4.1 选择音频设备 ... 13.4.5 将频率转换为电机速度和方向 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0242 | 719-721 | 3 | Python极客项目编程 > 第13章 激光音乐秀 > 13.4 Python代码 | Python极客项目编程 > 第13章 激光音乐秀 > 13.4 Python代码 / 13.4.6 测试电机设置 ... 13.4.8 手动测试 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0243 | 722-725 | 4 | Python极客项目编程 > 第13章 激光音乐秀 | Python极客项目编程 > 第13章 激光音乐秀 / 13.5 完整的Python代码 ... 13.8 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0244 | 726-728 | 3 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.1 硬件 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.1 硬件 / 14.1.1 DHT11温湿度传感器 ... 14.1.3 设置树莓派 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0245 | 729-733 | 5 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.2 安装和配置软件 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.2 安装和配置软件 / 14.2.1 操作系统 ... 14.2.5 通过SSH连接 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0246 | 734-736 | 3 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.2 安装和配置软件 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.2 安装和配置软件 / 14.2.6 Web框架Bottle ... 14.2.8 关闭树莓派 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0247 | 737-737 | 1 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 | 14.3 搭建硬件 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0248 | 738-742 | 5 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.4 代码 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 > 14.4 代码 / 14.4.1 处理传感器数据请求 ... 14.4.5 添加交互性 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0249 | 743-746 | 4 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 | Python极客项目编程 > 第14章 基于树莓派的天气监控器 / 14.5 完整代码 ... 14.8 实验 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0250 | 782-782 | 1 | Python极客项目编程 > 欢迎来到异步社区！ | 异步社区的来历 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0251 | 785-785 | 1 | Python极客项目编程 > 欢迎来到异步社区！ > 社区里都有什么？ | 与作译者互动 | future-sharding-or-asset-round | deferred_asset_required |
| python-full-domain-0252 | 787-788 | 2 | Python极客项目编程 > 欢迎来到异步社区！ > 社区里还可以做什么？ | Python极客项目编程 > 欢迎来到异步社区！ > 社区里还可以做什么？ / 提交勘误 ... 写作 | future-sharding-or-asset-round | deferred_asset_required |

## Release Contract

- `published` 只能对应 source manifest releaseVisibility、main-package public projection、Python manifest visible IDs 三方同时公开的 lesson。
- `next_candidate` 只能是当前 published domain 后面最早、连续、source-mapped 的候选域；本阶段不把它 learner-visible。
- `planned` 表示 source-mapped 且可教学，但正文尚未验收；不得称为已完成。
- `deferred_asset_required` 表示未来内容可能依赖项目、文件、网络、图形或包体策略，需要在专门 round 中处理。
- ledger 不显示 EPUB href、anchor、内部路径、页码，不复制教材正文或原书长代码。
