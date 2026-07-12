#!/usr/bin/env python3
"""Audit the Python EPUB table of contents without extracting textbook body."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import posixpath
import re
import sys
import zipfile
from html import unescape
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.parse import unquote, urldefrag
import xml.etree.ElementTree as ET


CONTAINER_NS = {"c": "urn:oasis:names:tc:opendocument:xmlns:container"}
OPF_NS = {
    "opf": "http://www.idpf.org/2007/opf",
    "dc": "http://purl.org/dc/elements/1.1/",
}
NCX_NS = {"ncx": "http://www.daisy.org/z3986/2005/ncx/"}


TYPE_VALUES = {
    "frontmatter",
    "copyright",
    "preface",
    "part",
    "chapter",
    "section",
    "subsection",
    "exercise",
    "appendix",
    "index",
    "bibliography",
    "non-pedagogical",
    "unknown",
}


def _read_text(node: Optional[ET.Element]) -> str:
    if node is None:
        return ""
    return " ".join("".join(node.itertext()).split())


def _strip_ns(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def _sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest().upper()


def _safe_slug(text: str) -> str:
    text = unquote(unescape(text or "")).lower()
    text = re.sub(r"[^0-9a-zA-Z\u4e00-\u9fff]+", "-", text)
    text = text.strip("-")
    if not text:
        return "unit"
    return text[:48].strip("-") or "unit"


def _stable_id(order: int, toc_path: List[str], href: str) -> str:
    basis = "\n".join(toc_path) + "\n" + href
    digest = hashlib.sha1(basis.encode("utf-8")).hexdigest()[:8]
    slug = _safe_slug(toc_path[-1] if toc_path else "")
    return f"py-src-{order:04d}-{digest}-{slug}"


def _split_href(src: str) -> Tuple[str, str]:
    href, fragment = urldefrag(src or "")
    return unquote(href), unquote(fragment)


def _classify(title: str, toc_path: List[str], has_children: bool) -> Tuple[str, str, str]:
    full = " > ".join(toc_path)
    compact = re.sub(r"\s+", "", full)
    t = re.sub(r"\s+", "", title or "")

    if any(k in t for k in ["版权", "版权声明", "版权信息"]):
        return "copyright", "explicit_exclusion", "版权信息不是课程 lesson。"
    if any(k in t for k in ["作者简介", "技术评审者简介", "译者序", "致谢", "内容提要", "第1版赞誉", "不容错过", "后记"]):
        return "frontmatter", "explicit_exclusion", "作者、译者、致谢或宣传性信息不作为课程 lesson。"
    if any(k in t for k in ["欢迎来到异步社区", "购买图书", "下载资源", "加入异步", "会议活动", "纸电图书"]):
        return "non-pedagogical", "explicit_exclusion", "社区、购书或广告信息不作为课程 lesson。"
    if "索引" in t:
        return "index", "explicit_exclusion", "索引是查找工具，不作为课程 lesson。"
    if "参考文献" in t or "书目" in t:
        return "bibliography", "explicit_exclusion", "参考资料列表不作为课程 lesson。"
    if t in {"前言", "导读"} or t.startswith("前言"):
        return "preface", "explicit_exclusion", "前言/导读用于阅读说明，不作为本轮课程 lesson。"
    if re.search(r"(第[一二三四五六七八九十0-9]+部分|第一部分|第二部分|第三部分|第四部分|第五部分|项目[0-9])", t):
        return "part", "parent_group_only", "分部或项目标题只作为课程分组。"
    if t.startswith("附录") or re.match(r"^[A-Z]\.", t):
        return "appendix", "explicit_exclusion", "附录属于安装、参考或延伸资料，不进入本轮课程 lesson。"
    if any(k in t for k in ["习题", "实践项目", "实验", "练习题"]):
        return "exercise", "lesson_candidate", ""
    if re.match(r"^第\s*\d+\s*章", title or "") or re.match(r"^第[一二三四五六七八九十]+章", t):
        return "chapter", "lesson_candidate", ""
    if re.match(r"^\d+\.\d+\.\d+", t):
        return "subsection", "lesson_candidate", ""
    if re.match(r"^\d+\.\d+", t) or re.match(r"^[A-Z]\.\d+", t):
        return "section", "lesson_candidate", ""
    if has_children:
        return "part", "parent_group_only", "TOC 父节点只作为课程分组。"
    return "section", "lesson_candidate", ""


def _find_container_root(zf: zipfile.ZipFile) -> str:
    root = ET.fromstring(zf.read("META-INF/container.xml"))
    rootfile = root.find(".//c:rootfile", CONTAINER_NS)
    if rootfile is None or not rootfile.get("full-path"):
        raise RuntimeError("container.xml does not contain a rootfile path")
    return rootfile.get("full-path") or ""


def _metadata_from_opf(opf: ET.Element) -> Dict[str, List[str]]:
    metadata: Dict[str, List[str]] = {}
    md = opf.find("opf:metadata", OPF_NS)
    if md is None:
        return metadata
    for child in list(md):
        key = _strip_ns(child.tag)
        text = _read_text(child)
        if not text:
            continue
        metadata.setdefault(key, []).append(text)
    return metadata


def _manifest_from_opf(opf: ET.Element) -> List[Dict[str, str]]:
    manifest: List[Dict[str, str]] = []
    node = opf.find("opf:manifest", OPF_NS)
    if node is None:
        return manifest
    for item in node.findall("opf:item", OPF_NS):
        manifest.append(
            {
                "id": item.get("id", ""),
                "href": item.get("href", ""),
                "mediaType": item.get("media-type", ""),
                "properties": item.get("properties", ""),
            }
        )
    return manifest


def _spine_from_opf(opf: ET.Element, manifest_by_id: Dict[str, Dict[str, str]]) -> Tuple[List[Dict[str, str]], str]:
    spine: List[Dict[str, str]] = []
    node = opf.find("opf:spine", OPF_NS)
    toc_id = node.get("toc", "") if node is not None else ""
    if node is None:
        return spine, toc_id
    for order, itemref in enumerate(node.findall("opf:itemref", OPF_NS), start=1):
        idref = itemref.get("idref", "")
        item = manifest_by_id.get(idref, {})
        spine.append(
            {
                "order": order,
                "idref": idref,
                "href": item.get("href", ""),
                "linear": itemref.get("linear", "yes"),
                "mediaType": item.get("mediaType", ""),
            }
        )
    return spine, toc_id


def _find_nav_and_ncx(
    opf_path: str,
    manifest: List[Dict[str, str]],
    toc_id: str,
    names: Iterable[str],
) -> Tuple[Optional[str], str]:
    base = posixpath.dirname(opf_path)
    nav_path: Optional[str] = None
    ncx_path = ""
    by_id = {item["id"]: item for item in manifest}
    for item in manifest:
        props = item.get("properties", "")
        href = item.get("href", "")
        media = item.get("mediaType", "")
        full = posixpath.normpath(posixpath.join(base, href))
        if "nav" in props.split():
            nav_path = full
        if item.get("id") == toc_id or media == "application/x-dtbncx+xml" or href.lower().endswith(".ncx"):
            ncx_path = full
    if not ncx_path:
        for name in names:
            if name.lower().endswith("toc.ncx"):
                ncx_path = name
                break
    return nav_path, ncx_path


def _parse_ncx(zf: zipfile.ZipFile, ncx_path: str) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    ncx = ET.fromstring(zf.read(ncx_path))
    navmap = ncx.find("ncx:navMap", NCX_NS)
    if navmap is None:
        return [], []
    all_nodes: List[Dict[str, Any]] = []
    leaves: List[Dict[str, Any]] = []

    def walk(navpoint: ET.Element, path: List[str], depth: int, parent_id: str) -> None:
        title = _read_text(navpoint.find("ncx:navLabel/ncx:text", NCX_NS))
        content = navpoint.find("ncx:content", NCX_NS)
        src = content.get("src", "") if content is not None else ""
        href, anchor = _split_href(src)
        children = navpoint.findall("ncx:navPoint", NCX_NS)
        toc_path = path + ([title] if title else [])
        node_id = navpoint.get("id", "") or _stable_id(len(all_nodes) + 1, toc_path, src)
        node = {
            "nodeId": node_id,
            "parentNodeId": parent_id,
            "tocPath": toc_path,
            "displayTitle": title,
            "href": href,
            "anchor": anchor,
            "depth": depth,
            "playOrder": navpoint.get("playOrder", ""),
            "hasChildren": bool(children),
        }
        all_nodes.append(node)
        if not children:
            order = len(leaves) + 1
            typ, inclusion, reason = _classify(title, toc_path, False)
            unit = {
                "sourceUnitId": _stable_id(order, toc_path, src),
                "tocPath": toc_path,
                "displayTitle": title,
                "spineHref": href,
                "anchor": anchor,
                "depth": depth,
                "sourceOrder": order,
                "type": typ if typ in TYPE_VALUES else "unknown",
                "inclusion": inclusion,
            }
            if reason:
                unit["exclusionReason"] = reason
            leaves.append(unit)
        else:
            for child in children:
                walk(child, toc_path, depth + 1, node_id)

    for child in navmap.findall("ncx:navPoint", NCX_NS):
        walk(child, [], 1, "")
    return all_nodes, leaves


def audit(epub_path: str) -> Dict[str, Any]:
    epub_path = os.path.abspath(epub_path)
    if not os.path.exists(epub_path):
        raise FileNotFoundError(epub_path)
    stat = os.stat(epub_path)
    with zipfile.ZipFile(epub_path) as zf:
        names = zf.namelist()
        opf_path = _find_container_root(zf)
        opf = ET.fromstring(zf.read(opf_path))
        manifest = _manifest_from_opf(opf)
        manifest_by_id = {item["id"]: item for item in manifest}
        spine, toc_id = _spine_from_opf(opf, manifest_by_id)
        nav_path, ncx_path = _find_nav_and_ncx(opf_path, manifest, toc_id, names)
        if not ncx_path:
            raise RuntimeError("No toc.ncx found")
        toc_nodes, source_units = _parse_ncx(zf, ncx_path)

    counts: Dict[str, Any] = {
        "tocNodeCount": len(toc_nodes),
        "deepestSourceUnitCount": len(source_units),
        "lessonCandidateCount": sum(1 for u in source_units if u["inclusion"] == "lesson_candidate"),
        "parentGroupOnlyCount": sum(1 for u in source_units if u["inclusion"] == "parent_group_only"),
        "explicitExclusionCount": sum(1 for u in source_units if u["inclusion"] == "explicit_exclusion"),
        "typeCounts": {},
        "depthCounts": {},
        "exclusionReasonCounts": {},
    }
    for unit in source_units:
        counts["typeCounts"][unit["type"]] = counts["typeCounts"].get(unit["type"], 0) + 1
        d = str(unit["depth"])
        counts["depthCounts"][d] = counts["depthCounts"].get(d, 0) + 1
        if unit["inclusion"] == "explicit_exclusion":
            reason = unit.get("exclusionReason", "")
            counts["exclusionReasonCounts"][reason] = counts["exclusionReasonCounts"].get(reason, 0) + 1

    return {
        "schemaVersion": 1,
        "auditKind": "python_epub_source_audit",
        "epub": {
            "fileName": os.path.basename(epub_path),
            "sizeBytes": stat.st_size,
            "sha256": _sha256_file(epub_path),
        },
        "opf": {
            "path": opf_path,
            "metadata": _metadata_from_opf(opf),
            "manifestItemCount": len(manifest),
            "spineItemCount": len(spine),
            "tocId": toc_id,
        },
        "nav": {
            "navPath": nav_path,
            "ncxPath": ncx_path,
            "authority": "toc.ncx" if not nav_path else "nav.xhtml+toc.ncx",
        },
        "manifest": manifest,
        "spine": spine,
        "tocNodes": toc_nodes,
        "sourceUnits": source_units,
        "counts": counts,
    }


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Audit Python EPUB metadata and deepest TOC units.")
    parser.add_argument("--epub", required=True, help="Path to the source EPUB")
    parser.add_argument("--json", required=True, help="Path to a JSON output file, preferably in TEMP")
    args = parser.parse_args(argv)
    try:
        result = audit(args.epub)
        out_path = os.path.abspath(args.json)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8", newline="\n") as fh:
            json.dump(result, fh, ensure_ascii=False, indent=2)
            fh.write("\n")
        print(
            "[Python EPUB source audit] PASS:",
            result["counts"]["deepestSourceUnitCount"],
            "source units,",
            result["counts"]["lessonCandidateCount"],
            "lesson candidates",
        )
        return 0
    except Exception as exc:  # fail closed
        print("[Python EPUB source audit] FAIL:", str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
