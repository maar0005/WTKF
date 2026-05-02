#!/usr/bin/env python3
"""Auto-generates nyheder/manifest.json and ture/manifest.json from HTML files."""
import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent

DANISH_MONTHS = {
    "januar": 1, "jan": 1,
    "februar": 2, "feb": 2,
    "marts": 3, "mar": 3,
    "april": 4, "apr": 4,
    "maj": 5,
    "juni": 6, "jun": 6,
    "juli": 7, "jul": 7,
    "august": 8, "aug": 8,
    "september": 9, "sep": 9,
    "oktober": 10, "okt": 10,
    "november": 11, "nov": 11,
    "december": 12, "dec": 12,
}

NYHED_SKIP = {"nyhed skabelon.html", "nyheder.html"}
TUR_SKIP   = {"tur skabelon.html", "ture.html"}


def extract_const(html, name):
    for pattern in [
        rf'const\s+{name}\s*=\s*"([^"]*)"',
        rf"const\s+{name}\s*=\s*'([^']*)'",
    ]:
        m = re.search(pattern, html)
        if m:
            return m.group(1)
    return ""


def danish_date_to_iso(dato_str):
    """'20. april 2026' → '2026-04-20'"""
    m = re.match(r"(\d{1,2})\.\s*(\w+)\s+(\d{4})", dato_str.strip())
    if m:
        day, month_name, year = m.groups()
        month = DANISH_MONTHS.get(month_name.lower(), 1)
        return f"{year}-{month:02d}-{int(day):02d}"
    return dato_str.strip()


def tur_date_to_iso(aar, dato_str):
    """Best-effort ISO date for sorting: year from TUR_AAR, month from TUR_DATO."""
    for name, num in DANISH_MONTHS.items():
        if name in dato_str.lower():
            return f"{aar}-{num:02d}-01"
    return f"{aar}-01-01"


def build_nyheder():
    folder = ROOT / "nyheder"
    entries = []
    for f in sorted(folder.glob("*.html")):
        if f.name.lower() in NYHED_SKIP:
            continue
        html = f.read_text(encoding="utf-8")
        if "NYHED_TITEL" not in html:
            continue
        dato_vis = extract_const(html, "NYHED_DATO")
        entries.append({
            "fil":       f.name,
            "titel":     extract_const(html, "NYHED_TITEL"),
            "undertitel":extract_const(html, "NYHED_UNDERTITEL"),
            "dato":      danish_date_to_iso(dato_vis),
            "datoVis":   dato_vis,
            "kategori":  extract_const(html, "NYHED_KATEGORI"),
            "billede":   extract_const(html, "NYHED_BILLEDE"),
        })
    entries.sort(key=lambda x: x["dato"], reverse=True)
    out = folder / "manifest.json"
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"nyheder/manifest.json: {len(entries)} poster")


def build_ture():
    folder = ROOT / "ture"
    entries = []
    for f in sorted(folder.glob("*.html")):
        if f.name.lower() in TUR_SKIP:
            continue
        html = f.read_text(encoding="utf-8")
        if "TUR_TITEL" not in html:
            continue
        aar      = extract_const(html, "TUR_AAR")
        dato_str = extract_const(html, "TUR_DATO")
        entries.append({
            "fil":        f.name,
            "titel":      extract_const(html, "TUR_TITEL"),
            "destination":extract_const(html, "TUR_DESTINATION"),
            "dato":       tur_date_to_iso(aar, dato_str),
            "år":         aar,
            "billede":    extract_const(html, "TUR_BILLEDE"),
            "beskrivelse":extract_const(html, "TUR_BESKRIVELSE"),
        })
    entries.sort(key=lambda x: x["dato"], reverse=True)
    out = folder / "manifest.json"
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"ture/manifest.json: {len(entries)} poster")


if __name__ == "__main__":
    build_nyheder()
    build_ture()
