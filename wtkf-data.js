// ─────────────────────────────────────────────────────────────────────────────
// WTKF Data Layer
// ─────────────────────────────────────────────────────────────────────────────
// Datakilden styres af SOURCE herunder.
//
// SOURCE: "sheets"  — henter live fra Google Sheets (publiceret til web)
// SOURCE: "local"   — henter fra lokale CSV-filer i /data/ (fallback / dev)
//
// ── Sådan finder du GID-numrene ───────────────────────────────────────────────
//   1. Åbn Google Sheets-filen i browseren
//   2. Klik på fanen "Fade" → se URL'en: ...#gid=XXXXXXXX  → det er FADE_GID
//   3. Klik på fanen "Andele" → se URL'en: ...#gid=YYYYYYYY → det er ANDELE_GID
//
// ── CSV-struktur (samme kolonner uanset kilde) ────────────────────────────────
//
//   Fade-ark — ét fad pr. række:
//     FAD_ID | Navn | År | Region | Type | Status | MaksAndele | FyldedeAndele
//           | Fadetype | ABV | Liter | Tørv_PPM | Sidst_besøgt | Forventede_noter | Destillat_noter
//
//   Andele-ark — ét MEDLEM pr. række, ét FAD pr. kolonne (bredt format):
//     Medlem | CRA-14 | ANN-16 | ARR-19 | ... osv.
//     Værdier er antal andele (0, 0.5, 1, 2, 3 …). 0 = ikke med i fadet.
//
//   ► Nyt fad:      Tilføj en række i Fade-arket + en kolonne i Andele-arket
//   ► Nyt medlem:   Tilføj en ny række i Andele-arket med 0 i alle fadkolonner
//
//   FAD_ID format: 3 bogstaver + 2-cifret årstal, fx BRU-26, SPR-27, GLF-25
// ─────────────────────────────────────────────────────────────────────────────

window.WTKF_CONFIG = {
  SOURCE: "sheets",         // "sheets" | "local"

  // ── Google Sheets (publiceret til web) ────────────────────────────────────
  // PUB_ID: den lange "2PACX-…" streng fra jeres "Publicér til web"-URL
  PUB_ID: "2PACX-1vRUeTYIACx_HnQ5gruA9KSWcQUWIKvBrOCAJmQ5Kvd6ViaqB4zkKaszmA9xEPCtDiHcT7gpAiNq9OYk",
  // GID: fanebladets numeriske ID (se #gid=XXXXX i URL'en når du er på fanen)
  FADE_GID:   "367938426",  // Fade-fanen
  ANDELE_GID: "0",          // Andele-fanen

  // ── Lokale CSV-filer (fallback) ───────────────────────────────────────────
  LOCAL_FADE:   "data/fade.csv",
  LOCAL_ANDELE: "data/andele.csv",
};

// ── Statisk indhold (ikke i CSV) ──────────────────────────────────────────────

window.WTKF_STATIC = {
  trips: [
    {
      year: "2020",
      title: "Highland Tour",
      dest: "Dalmore · Balblair · Clynelish",
      desc: "Nordhøjlandets mørke mosedal og kystluft — WTKF besøgte tre destillerier med vidt forskellig karakter. Turen bød på tøndefyldning og en uforglemmelig rundtur langs den skotske kyst.",
      url: "http://wtkf.dk/tur-til-highland-2020/",
      deltagers: [],
    },
    {
      year: "2018",
      title: "Arran & Islay",
      dest: "Isle of Arran · Islay",
      desc: "Fra det blide Arran til Islays røgfyldte kystdestillerier — to øer, to helt forskellige whiskyverdener. Foreningen klappede tønder og vendte hjem med lys i øjnene.",
      url: "http://wtkf.dk/sample-page/tur-til-arranogislay2018/",
      deltagers: [],
    },
    {
      year: "2016",
      title: "Speyside Tur",
      dest: "Edinburgh · Speyside · Craigellachie",
      desc: "Foreningens første store pilgrimsrejse til Skotland. Afgang fra København 28. september, fire nætter i Speyside — den region i verden med flest whisky-destillerier. Her klappede vi vores første tønde med egne hænder.",
      url: "http://wtkf.dk/sample-page/tur-til-skotland-2016/",
      program: [
        "28. sep: Afgang KBH kl. 22:00 → Edinburgh kl. 22:50",
        "29. sep: Kørsel til Speyside (ca. 200 km) med stop undervejs",
        "29–01. okt: Destilleribesøg i Speyside-regionen",
        "01. okt: Kørsel sydpå, overnatning Edinburgh",
        "02. okt: Hjemrejse KBH kl. 16:10",
      ],
    },
  ],
  anecdotes: [
    { term: "Den Diemerske Grænse",  body: "Opkaldt efter WTKFs egen Peter Diemer: en whisky bør aldrig fortyndes under 46% ABV. Under dette punkt kolfiltreres whisky typisk, hvilket fjerner fedtsyrerne der giver kroppen og kompleksiteten. Cask Strength er guld — vand kan man altid selv tilsætte." },
    { term: "Tønde Klappe",          body: "Ritualets navn: at klappe sin tønde. Når foreningen besøger et destilleri og fylder et fad, markeres begivenheden med et klap på tønden — en hyldest til den tid og tålmodighed der nu starter." },
    { term: "Warehouse Dunnage",     body: "De lavloftede, fugtige lagerbygninger af sten og jord (dunnage warehouses) siges at give whisky den langsommeste og mest komplekse modning. WTKF foretrækker fade lagret i traditionelle warehouses frem for moderne pallehaller." },
  ],
  vaerdisaet: [
    { label: "Single Malt",        desc: "Udelukkende single malt Scotch whisky — maltede byggkorn, ét destilleri." },
    { label: "Cask Strength",      desc: "Aftappet direkte fra fadet uden fortynding. Hver dråbe som destilleriet lagde den til hvile." },
    { label: "Non-chill filtered", desc: "Over den Diemerske Grænse (46% ABV). Fedtsyrerne bevares — og dermed kroppen og kompleksiteten." },
    { label: "Single Cask",        desc: "Ét fad, ét udtryk. Ingen blending med andre fade — WTKF ejer det fulde fad." },
    { label: "Natural colour",     desc: "Ingen tilsætning af karamelfarve (E150a). Farven afspejler fadet alene." },
  ],
  news: [
    { date: "21. april 2026",   title: "Bruichladdich — nyt fad indkøbt",              cat: "Cask",     url: "http://wtkf.dk/bruichladdich/" },
    { date: "4. februar 2025",  title: "Bladnoch — andele bekræftet",                  cat: "Cask",     url: "http://wtkf.dk/bladnoch/" },
    { date: "Forår 2024",       title: "Generalforsamling 2024",                       cat: "Forening", url: "http://wtkf.dk/generalforsamling-2024/" },
    { date: "Forår 2023",       title: "WTKF Generalforsamling 2023",                  cat: "Forening", url: "http://wtkf.dk/wtkf-generalforsamling-2023/" },
    { date: "Forår 2021",       title: "Generalforsamling 2021",                       cat: "Forening", url: "http://wtkf.dk/generalforsamling-2021/" },
    { date: "2. oktober 2020",  title: "WTKF Generalforsamling 2020",                  cat: "Forening", url: "http://wtkf.dk/wtkf-generalforsamling-2020/" },
  ],
  referater: [
    { year: "2024", title: "Generalforsamling 2024",                          url: "http://wtkf.dk/generalforsamling-2024/" },
    { year: "2023", title: "WTKF Generalforsamling 2023",                     url: "http://wtkf.dk/wtkf-generalforsamling-2023/" },
    { year: "2021", title: "Generalforsamling 2021",                          url: "http://wtkf.dk/generalforsamling-2021/" },
    { year: "2020", title: "WTKF Generalforsamling 2020",                     url: "http://wtkf.dk/wtkf-generalforsamling-2020/" },
    { year: "2019", title: "WTKF Generalforsamling – Referat d. 21/03-2019",  url: "http://wtkf.dk/vedtaegter-referat/wtkf-generalforsamling-referat-d-21-03-2019/" },
    { year: "2018", title: "WTKF referat d. 22/03-2018",                      url: "http://wtkf.dk/wtkf-referat-d-2203-2018/" },
    { year: "2017", title: "WTKF referat d. 30. marts 2017",                  url: "http://wtkf.dk/vedtaegter-referat/wtkf-referat-d-30-marts-2017/" },
    { year: "2016", title: "WTKF referat 14. april 2016",                     url: "http://wtkf.dk/vedtaegter-referat/wtkf-referat-14-april-2016/" },
  ],
  bestyrelse: [
    { rolle: "Formand",    url: "http://wtkf.dk/vedtaegter-referat/bestyrelse-og-udvalg/" },
    { rolle: "Turudvalg",  url: "http://wtkf.dk/vedtaegter-referat/bestyrelse-og-udvalg/" },
    { rolle: "Kasserer",   url: "http://wtkf.dk/vedtaegter-referat/bestyrelse-og-udvalg/" },
  ],
};

// ── CSV-parser ────────────────────────────────────────────────────────────────

// skipRows: antal rækker der springes over efter header-rækken (bruges til
// Andele-arket som har en ekstra navne-række på linje 2)
function parseCSV(text, { skipRows = 0 } = {}) {
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1 + skipRows).filter(l => l.trim()).map(line => {
    const vals = splitCSVLine(line);
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (vals[i] || "").trim()]));
  });
}

// Handles quoted fields (commas inside quotes)
function splitCSVLine(line) {
  const result = []; let cur = ""; let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { result.push(cur); cur = ""; }
    else { cur += ch; }
  }
  result.push(cur);
  return result;
}

// ── CSV → cask objects ────────────────────────────────────────────────────────

// ── Bred andele-format → opslag ───────────────────────────────────────────────
// andele.csv er i bredt format: Medlem | CRA-14 | ANN-16 | ...
// Denne funktion bygger et opslag: { "CRA-14": [{navn, andele}, ...], ... }
// Medlemmer med 0 andele i alle fade medtages IKKE i opslaget (de er kun
// med som medlemmer). Medlemslisten kan læses ud som Object.keys på første kolonne.

function buildAndeleOpslag(andeleRows) {
  const opslag   = {};
  const medlemmer = [];
  if (!andeleRows.length) return { opslag, medlemmer };

  // Første kolonne er medlemsnavnet — kan hedde "Medlem", "ID", "Navn" el. lign.
  const navnKolonne = Object.keys(andeleRows[0])[0];
  const fadKolonner = Object.keys(andeleRows[0]).filter(k => k !== navnKolonne);

  for (const row of andeleRows) {
    const navn = row[navnKolonne];
    if (!navn) continue;
    medlemmer.push(navn);
    for (const fadID of fadKolonner) {
      const andele = parseFloat((row[fadID] || "0").replace(",", ".")) || 0;
      if (andele > 0) {
        if (!opslag[fadID]) opslag[fadID] = [];
        opslag[fadID].push({ navn, andele });
      }
    }
  }
  return { opslag, medlemmer };
}

function buildCasks(fadeRows, andeleRows) {
  const { opslag: andeleOpslag, medlemmer } = buildAndeleOpslag(andeleRows);

  const casks = fadeRows.map(row => {
    const fadID        = row["FAD_ID"];
    const name         = row["Navn"];
    const memberAndele = andeleOpslag[fadID] || [];
    return {
      id:              fadID,
      name,
      year:            row["År"],
      region:          row["Region"],
      type:            row["Type"],
      status:          row["Status"],
      fadetype:        row["Fadetype"] || "",
      abv:             row["ABV"] ? parseFloat(row["ABV"]) : null,
      liter:           row["Liter"] ? parseInt(row["Liter"]) : null,
      peatPPM:         row["Tørv_PPM"] !== undefined && row["Tørv_PPM"] !== "" ? parseInt(row["Tørv_PPM"]) : null,
      sidstBesøgt:     row["Sidst_besøgt"] || "",
      forventedeNoter: row["Forventede_noter"] || "",
      notes:           row["Destillat_noter"] || "",
      andele:          memberAndele,
    };
  });

  return { casks, medlemmer };
}

// ── Hoved-fetch ───────────────────────────────────────────────────────────────

window.WTKF_fetchData = async function () {
  const cfg = window.WTKF_CONFIG;

  try {
    let fadeRows, andeleRows;

    if (cfg.SOURCE === "sheets") {
      const pubBase = `https://docs.google.com/spreadsheets/d/e/${cfg.PUB_ID}/pub`;
      const fadeURL   = `${pubBase}?gid=${cfg.FADE_GID}&single=true&output=csv`;
      const andeleURL = `${pubBase}?gid=${cfg.ANDELE_GID}&single=true&output=csv`;
      [fadeRows, andeleRows] = await Promise.all([
        fetch(fadeURL).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} — Fade`); return r.text(); }).then(t => parseCSV(t)),
        fetch(andeleURL).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status} — Andele`); return r.text(); }).then(t => parseCSV(t, { skipRows: 1 })),
      ]);
    } else {
      // Local CSV files
      [fadeRows, andeleRows] = await Promise.all([
        fetch(cfg.LOCAL_FADE  + "?v=" + Date.now()).then(r => r.text()).then(parseCSV),
        fetch(cfg.LOCAL_ANDELE + "?v=" + Date.now()).then(r => r.text()).then(parseCSV),
      ]);
    }

    const { casks, medlemmer } = buildCasks(fadeRows, andeleRows);
    return {
      casks,
      medlemmer,
      ...window.WTKF_STATIC,
    };

  } catch (e) {
    console.error("WTKF: datafetch fejlede —", e);
    // Nødplan: returner tom cask-liste men vis siden
    return { casks: [], ...window.WTKF_STATIC };
  }
};
