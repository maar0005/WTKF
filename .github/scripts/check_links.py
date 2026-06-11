#!/usr/bin/env python3
"""Tjekker at interne links (href/src) i HTML-filerne peger på filer der findes."""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).parent.parent.parent

SKIP_DIRS = {".git", ".github", "data", "node_modules"}
SKIP_PREFIXES = ("http://", "https://", "mailto:", "tel:", "data:", "#", "javascript:")

LINK_RE = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']')


def html_files():
    for f in sorted(ROOT.rglob("*.html")):
        if not any(part in SKIP_DIRS for part in f.relative_to(ROOT).parts):
            yield f


def check():
    errors = []
    for f in html_files():
        text = f.read_text(encoding="utf-8")
        for link in LINK_RE.findall(text):
            if link.startswith(SKIP_PREFIXES) or not link.strip():
                continue
            if "${" in link:  # JS template-literal i skabelon-kode, ikke et reelt link
                continue
            path = unquote(urlparse(link).path)
            if not path:
                continue
            target = (ROOT / path.lstrip("/")) if path.startswith("/") else (f.parent / path)
            if not target.exists():
                errors.append(f"{f.relative_to(ROOT)}: brudt link → {link}")
    return errors


if __name__ == "__main__":
    errors = check()
    for e in errors:
        print(f"::error::{e}")
    if errors:
        print(f"\n{len(errors)} brudte interne links fundet")
        sys.exit(1)
    print("Alle interne links er OK")
