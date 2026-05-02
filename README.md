# WTKF – Whisky Tasting Klub Frederiksberg

Hjemmeside for WTKF, en privat whiskyforening på Frederiksberg.  
Siden hostes på [maar0005.github.io/WTKF](https://maar0005.github.io/WTKF/).

---

## Indhold

- `index.html` – Forsiden
- `Bestyrelse.html` – Bestyrelsesside
- `Vedtægter.html` – Foreningens vedtægter
- `nyheder/` – Nyheder og artikler
- `ture/` – Whiskyture til Skotland og andre destillerier
- `referater/` – Generalforsamlingsreferater
- `uploads/` – Billeder og medier

## Datakilde

Dynamiske data (fadoversigt, statistik m.m.) hentes fra foreningens Google Sheet:

[WTKF Dataark](https://docs.google.com/spreadsheets/d/1JnAcsjZRJdKtDIrD-Eqez3VgbhEEM74pz2cTV4lGBf8/edit?gid=0#gid=0)

Redigér arket for at opdatere indholdet på forsiden uden at ændre i koden.

## Teknologi

Hjemmesiden er bygget i ren HTML/CSS med React (via CDN) til forsiden.

---

## Guide: Sådan opdaterer du hjemmesiden

Alt redigering foregår direkte på GitHub — ingen kodekendskab nødvendigt.

### 1. Tilføj en nyhed

**Trin 1 — Opret HTML-filen**

1. Gå til mappen **`nyheder/`** på GitHub
2. Åbn **`Nyhed skabelon.html`** → klik **Raw** → kopiér al teksten
3. Gå tilbage til `nyheder/`, klik **Add file → Create new file**
4. Navngiv filen, fx `Generalforsamling 2026.html`
5. Sæt indholdet ind og ret de øverste linjer:

```html
const NYHED_TITEL      = "Generalforsamling 2026";
const NYHED_DATO       = "15. marts 2026";
const NYHED_KATEGORI   = "FORENING";   // FAD | TUR | FORENING | SMAGNING
const NYHED_UNDERTITEL = "Referat og billeder fra årets generalforsamling";
const NYHED_BILLEDE    = "";           // fx "../uploads/foto.jpg" eller tom
```

6. Skriv selve teksten i blokken `<script id="nyhed-raw" type="text/plain">` — bare copy-paste fra Word/mail
7. Klik **Commit changes**

**Trin 2 — Tilføj til oversigten**

1. Åbn **`nyheder/manifest.json`** og klik blyantsikonet
2. Tilføj en ny post øverst i listen:

```json
{
  "fil": "Generalforsamling 2026.html",
  "titel": "Generalforsamling 2026",
  "undertitel": "Referat og billeder fra årets generalforsamling",
  "dato": "2026-03-15",
  "datoVis": "15. marts 2026",
  "kategori": "FORENING",
  "billede": ""
},
```

> `dato` skal være `ÅÅÅÅ-MM-DD` — bruges til sortering. Husk komma efter `}` på alle poster undtagen den sidste.

3. Klik **Commit changes**

---

### 2. Tilføj en tur

**Trin 1 — Opret HTML-filen**

1. Gå til mappen **`ture/`**
2. Åbn **`Tur skabelon.html`** → Raw → kopiér
3. Opret ny fil i `ture/`, fx `Islay 2026.html`
4. Ret de øverste linjer:

```html
const TUR_TITEL       = "Islay 2026";
const TUR_DESTINATION = "Islay, Skotland";
const TUR_DATO        = "September 2026";
const TUR_AAR         = "2026";
const TUR_DELTAGERS   = 8;                         // 0 = vises ikke
const TUR_BILLEDE     = "../uploads/islay2026.jpg"; // eller ""
```

5. Skriv turteksten i `<script id="tur-raw" type="text/plain">` blokken
6. Klik **Commit changes**

**Trin 2 — Tilføj til oversigten**

1. Åbn **`ture/manifest.json`** og klik blyantsikonet
2. Tilføj øverst i listen:

```json
{
  "fil": "Islay 2026.html",
  "titel": "Islay 2026",
  "destination": "Islay, Skotland",
  "dato": "2026-09-01",
  "år": "2026",
  "billede": "../uploads/islay2026.jpg",
  "beskrivelse": "Fem dage på Islay med besøg hos Bruichladdich, Bowmore og Ardbeg."
},
```

3. Klik **Commit changes**

---

### 3. Tilføj et referat

**Trin 1 — Opret HTML-filen**

1. Gå til mappen **`referater/`**
2. Åbn **`Referat skabelon.html`** → Raw → kopiér
3. Opret ny fil, fx `Generalforsamling 2026.html`
4. Ret de tre øverste linjer:

```html
const REFERAT_TITEL = "WTKF Generalforsamling 2026";
const REFERAT_DATO  = "Forår 2026 · Frederiksberg";
const REFERAT_AAR   = "2026";
```

5. Sæt referatteksten ind i `<script id="referat-raw" type="text/plain">` — bare copy-paste
6. Klik **Commit changes**

**Trin 2 — Tilføj til datasættet**

1. Åbn **`wtkf-data.js`** → find sektionen `referater:`
2. Tilføj en linje:

```js
{ year: "2026", title: "WTKF Generalforsamling 2026", url: "referater/Generalforsamling 2026.html" },
```

3. Klik **Commit changes**

---

### 4. Opdater fade og andele

Fade og andele opdateres **udelukkende i Google Sheets** — hjemmesiden henter selv data derfra automatisk.

📊 [WTKF Dataark](https://docs.google.com/spreadsheets/d/1JnAcsjZRJdKtDIrD-Eqez3VgbhEEM74pz2cTV4lGBf8/edit?gid=0#gid=0)

Arket har to faneblade:

| Faneblad | Indhold |
|----------|---------|
| **Andele** | Én kolonne per fad, én række per medlem — tal angiver antal andele |
| **Fade** | Ét fad per række med `FAD_ID`, navn, destilleri, årstal m.m. |

Tilføj et nyt fad ved at oprette en ny række i **Fade** og en ny kolonne i **Andele** med samme `FAD_ID`. Hjemmesiden opdateres automatisk.

---

### 5. Upload et billede

1. Gå til mappen **`uploads/`** på GitHub
2. Klik **Add file → Upload files**
3. Træk billedet ind eller vælg det fra din computer
4. Klik **Commit changes**

Billedet bruges herefter med stien `../uploads/filnavn.jpg` i skabelonerne.

> Tips: Hold filnavne enkle uden mellemrum, fx `islay2026.jpg`. Komprimer billeder til under 1 MB før upload (brug fx [squoosh.app](https://squoosh.app)).

---

### 6. Arkivér gammelt indhold

Når en nyhed eller tur er forældet, flyttes den til arkivet i stedet for at slettes.

**Nyhed:** Fjern posten fra `nyheder/manifest.json` → flyt HTML-filen til `nyheder/arkiv/` → tilføj posten til `nyheder/arkiv/manifest.json`.

**Tur:** Samme fremgangsmåde med `ture/manifest.json` og `ture/arkiv/`.

---

### Hurtig oversigt

| Hvad | Filer der redigeres |
|------|---------------------|
| Ny nyhed | `nyheder/NyFil.html` + `nyheder/manifest.json` |
| Ny tur | `ture/NyFil.html` + `ture/manifest.json` |
| Nyt referat | `referater/NyFil.html` + `wtkf-data.js` |
| Nyt fad / andele | Google Sheets |
| Nyt billede | `uploads/` |
| Arkivér indhold | Flyt til `arkiv/` + opdater manifest |
