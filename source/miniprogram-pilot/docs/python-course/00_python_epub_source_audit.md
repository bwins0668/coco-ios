# Python EPUB source audit

本文件记录 R8.PYTHON-0A 的只读目录取证结果。仓库没有保存 EPUB、解压文件、正文、图片或原书代码；课程内容只使用目录标题和结构信息建立 source map。

## Source file

| item | value |
|---|---|
| EPUB 文件名 | Python编程三剑客：Python编程从入门到实践 快速上手 极客编程 (埃里克·马瑟斯 (Eric Matthes), Al Sweigart etc.) (z-library.sk, 1lib.sk, z-lib.sk).epub |
| SHA-256 | 860F181731A4699BD412686599596A6101AECE5EB70DD837A15FB2B88F25F7EF |
| 文件大小 | 17,260,692 bytes |
| 读取方式 | `tools/audit_python_epub_source.py --epub <local file> --json <TEMP json>` |
| 仓库落盘 | 仅落 source manifest、统计文档和原创课程内容 |

## Metadata

| field | value |
|---|---|
| title | Python编程三剑客（套装全3册） |
| creator | 斯维加特; Mahesh Venkitachalam; 埃里克·马瑟斯 |
| publisher | 人民邮电出版社有限公司 |
| date | 2020-10-01 |
| language | zh |
| identifier | urn:uuid:273fd756-62f2-4858-8d67-99e08f24bba9; B0957H468D |

## OPF / navigation

| item | value |
|---|---|
| OPF path | OEBPS/content.opf |
| OPF manifest items | 380 |
| OPF spine items | 66 |
| OPF toc id | ncx |
| nav.xhtml | not present in this EPUB |
| toc.ncx | OEBPS/toc.ncx |
| navigation authority | toc.ncx |

## TOC coverage

| metric | count |
|---|---:|
| total TOC nodes | 968 |
| deepest source units | 790 |
| lesson_candidate | 699 |
| parent_group_only | 17 |
| explicit_exclusion | 74 |

## Type distribution

| type | count |
|---|---:|
| appendix | 46 |
| chapter | 20 |
| copyright | 5 |
| exercise | 32 |
| frontmatter | 11 |
| non-pedagogical | 10 |
| part | 17 |
| preface | 2 |
| section | 251 |
| subsection | 396 |

## Depth distribution

| depth | count |
|---|---:|
| 2 | 55 |
| 3 | 206 |
| 4 | 529 |

## Exclusion reason distribution

| reason | count |
|---|---:|
| 版权信息不是课程 lesson。 | 5 |
| 作者、译者、致谢或宣传性信息不作为课程 lesson。 | 11 |
| 前言/导读用于阅读说明，不作为本轮课程 lesson。 | 2 |
| 附录属于安装、参考或延伸资料，不进入本轮课程 lesson。 | 46 |
| 社区、购书或广告信息不作为课程 lesson。 | 10 |

## First source units

| order | sourceUnitId | type | inclusion | title |
|---:|---|---|---|---|
| 1 | py-src-0001-fde3cd97-版权声明 | copyright | explicit_exclusion | 版权声明 |
| 2 | py-src-0002-84f26632-不容错过的成长之旅 | frontmatter | explicit_exclusion | 不容错过的成长之旅 |
| 3 | py-src-0003-7951627f-第1版赞誉 | frontmatter | explicit_exclusion | 第1版赞誉 |
| 4 | py-src-0004-ebccb787-前言 | preface | explicit_exclusion | 前言 |
| 5 | py-src-0005-5e56d8c8-导读 | preface | explicit_exclusion | 导读 |
| 6 | py-src-0006-5c221189-第一部分-基础知识 | part | parent_group_only | 第一部分 基础知识 |
| 7 | py-src-0007-7a787e55-第-1-章-起步 | chapter | lesson_candidate | 第 1 章 起步 |
| 8 | py-src-0008-f41e62b5-第-2-章-变量和简单数据类型 | chapter | lesson_candidate | 第 2 章 变量和简单数据类型 |

## Boundary

The source map covers every deepest TOC node from `toc.ncx`. It stores short titles, hierarchy, href anchors, inclusion type, and exclusion reasons. It does not store textbook body paragraphs, textbook examples, image assets, HTML payloads, or redistributed chapter content.
