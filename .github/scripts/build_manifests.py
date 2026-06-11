#!/usr/bin/env python3
"""Auto-generates nyheder/manifest.json, ture/manifest.json, sitemap.xml og nyheder/feed.xml."""
import re
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote
from xml.sax.saxutils import escape

ROOT = Path(__file__).parent.parent.parent
BASE_URL = "https://wtkf.dk"  # produktionsdomænet — bruges i sitemap.xml og feed.xml

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
    return entries


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
    return entries


def url_for(rel_path):
    """Relativ sti → absolut, URL-enkodet adresse (danske tegn og mellemrum)."""
    return f"{BASE_URL}/{quote(str(rel_path), safe='/')}"


def iso_to_rfc822(iso_date):
    """'2026-04-20' → 'Mon, 20 Apr 2026 00:00:00 +0000' (RSS pubDate-format)."""
    try:
        dt = datetime.strptime(iso_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        return dt.strftime("%a, %d %b %Y %H:%M:%S +0000")
    except ValueError:
        return None


def build_sitemap(nyheder, ture):
    urls = [
        ("", None),
        ("Vedtægter.html", None),
        ("Bestyrelse.html", None),
        ("nyheder/Nyheder.html", None),
        ("ture/Ture.html", None),
        ("referater/Referater.html", None),
    ]
    urls += [(f"nyheder/{e['fil']}", e["dato"]) for e in nyheder]
    urls += [(f"ture/{e['fil']}", e["dato"]) for e in ture]
    for f in sorted((ROOT / "referater").glob("*.html")):
        if f.name.lower() not in {"referat skabelon.html", "referater.html"}:
            urls.append((f"referater/{f.name}", None))

    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, lastmod in urls:
        lines.append("  <url>")
        lines.append(f"    <loc>{escape(url_for(path))}</loc>")
        if lastmod and re.match(r"\d{4}-\d{2}-\d{2}$", lastmod):
            lines.append(f"    <lastmod>{lastmod}</lastmod>")
        lines.append("  </url>")
    lines.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"sitemap.xml: {len(urls)} adresser")


def build_rss(nyheder):
    items = []
    for e in nyheder:
        pub = iso_to_rfc822(e["dato"])
        link = url_for(f"nyheder/{e['fil']}")
        items.append("    <item>")
        items.append(f"      <title>{escape(e['titel'])}</title>")
        items.append(f"      <link>{escape(link)}</link>")
        items.append(f"      <guid isPermaLink=\"true\">{escape(link)}</guid>")
        if e.get("undertitel"):
            items.append(f"      <description>{escape(e['undertitel'])}</description>")
        if e.get("kategori"):
            items.append(f"      <category>{escape(e['kategori'])}</category>")
        if pub:
            items.append(f"      <pubDate>{pub}</pubDate>")
        items.append("    </item>")

    feed = "\n".join([
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        "    <title>WTKF Nyheder</title>",
        f"    <link>{BASE_URL}/nyheder/Nyheder.html</link>",
        "    <description>Seneste nyt fra WhiskyTønde Klappe Foreningen</description>",
        "    <language>da</language>",
        f'    <atom:link href="{BASE_URL}/nyheder/feed.xml" rel="self" type="application/rss+xml"/>',
        *items,
        "  </channel>",
        "</rss>",
    ])
    (ROOT / "nyheder" / "feed.xml").write_text(feed + "\n", encoding="utf-8")
    print(f"nyheder/feed.xml: {len(nyheder)} indslag")


if __name__ == "__main__":
    nyheder = build_nyheder()
    ture = build_ture()
    build_sitemap(nyheder, ture)
    build_rss(nyheder)
