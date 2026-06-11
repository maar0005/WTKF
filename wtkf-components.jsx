// wtkf-components.jsx
// CaskModal + DataTable — assigned to window for use by the main app

// ── CaskModal ─────────────────────────────────────────────────────────────────
function CaskModal({ cask, onClose, t, a, serif }) {
  const total    = cask.andele.reduce((s, m) => s + m.andele, 0);
  const pct      = Math.round((cask.filledAndele / cask.maxAndele) * 100);
  const statusLabel = { lagrer: "Lagrer", aftappet: "Afyldt" };
  const statusColor = { lagrer: "oklch(68% 0.14 65)", aftappet: "oklch(55% 0.08 220)" };

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 500,
      background: "oklch(5% 0.01 55 / 0.85)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.bgCard, border: `1px solid ${t.border}`,
        width: "100%", maxWidth: 640, maxHeight: "90vh",
        overflowY: "auto", position: "relative",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 20px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: t.textFaint, marginBottom: 6 }}>
                {cask.region} · {cask.year}
              </div>
              <h2 style={{ fontFamily: serif, fontSize: 30, fontWeight: 400, color: t.text, lineHeight: 1.1 }}>{cask.name}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              <button onClick={onClose} aria-label="Luk" style={{
                background: "none", border: `1px solid ${t.border}`,
                color: t.textMuted, cursor: "pointer",
                width: 32, height: 32, fontSize: 16, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>×</button>
              <span style={{
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "4px 10px", border: `1px solid ${statusColor[cask.status]}55`,
                color: statusColor[cask.status], background: `${statusColor[cask.status]}14`,
                fontWeight: 600, whiteSpace: "nowrap",
              }}>{statusLabel[cask.status]}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              ["Fadetype",     cask.fadetype || "—"],
              ["Region",       cask.region],
              ["ABV",          cask.abv ? `${cask.abv}%` : "Lagrer…"],
              ["Størrelse",    cask.liter ? `${cask.liter} L` : "—"],
              ["Tørv (PPM)",   cask.peatPPM != null ? (cask.peatPPM === 0 ? "Unpeated" : `${cask.peatPPM} PPM`) : "—"],
              ["Sidst besøgt", cask.sidstBesøgt || "—"],
            ].map(([label, val]) => (
              <div key={label} style={{ background: t.bg, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textFaint, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Forventede noter */}
          {cask.forventedeNoter && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: t.textFaint, marginBottom: 8 }}>Forventede smagsnoter</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cask.forventedeNoter.split(",").map(n => n.trim()).filter(Boolean).map(note => (
                  <span key={note} style={{ fontSize: 12, padding: "4px 10px", background: `${a.primary}18`, color: a.primary, border: `1px solid ${a.primary}33` }}>{note}</span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {cask.notes && (
            <p style={{ fontSize: 14, lineHeight: 1.72, color: t.textMuted, marginBottom: 28, textWrap: "pretty", borderLeft: `2px solid ${a.primary}`, paddingLeft: 16 }}>
              {cask.notes}
            </p>
          )}

          {/* Member breakdown */}
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textFaint, marginBottom: 14 }}>
            Andelsfordeling
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...cask.andele].sort((a, b) => b.andele - a.andele).map(m => (
              <div key={m.navn} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: t.textMuted, flex: 1 }}>{m.navn}</span>
                <span style={{ fontFamily: "monospace", fontSize: 12, color: t.text, minWidth: 28, textAlign: "right" }}>{m.andele}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DataTable (Oversigtsark) ───────────────────────────────────────────────────
function DataTable({ casks, onSelectCask, t, a, serif }) {
  const [sortKey,  setSortKey]  = React.useState("year");
  const [sortDir,  setSortDir]  = React.useState("desc");
  const [filter,   setFilter]   = React.useState("Alle");

  const statusLabel = { lagrer: "Lagrer", aftappet: "Afyldt" };
  const statusColor = { lagrer: "oklch(68% 0.14 65)", aftappet: "oklch(55% 0.08 220)" };
  const filterKeys  = ["Alle", "Lagrer", "Afyldt"];
  const filterMap   = { "Lagrer": ["lagrer"], "Afyldt": ["aftappet"] };

  const cols = [
    { key: "name",   label: "Destilleri" },
    { key: "year",   label: "År" },
    { key: "region", label: "Region" },
    { key: "fadetype", label: "Fadetype" },
    { key: "status", label: "Status" },
    { key: "abv",    label: "ABV" },
    { key: "filledAndele", label: "Andele" },
  ];

  const toggle = key => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const visible = casks
    .filter(c => filter === "Alle" || (filterMap[filter] || []).includes(c.status))
    .sort((a, b) => {
      const av = a[sortKey] ?? ""; const bv = b[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv), "da", { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <div>
      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 0, border: `1.5px solid ${t.border}`, marginBottom: 24, width: "fit-content" }}>
        {filterKeys.map((f, fi) => {
          const active = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "9px 18px", fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", fontWeight: 600, cursor: "pointer",
              background: active ? a.primary : "transparent",
              color: active ? "oklch(12% 0.015 55)" : t.textMuted,
              border: "none", borderLeft: fi > 0 ? `1px solid ${t.border}` : "none",
              fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s, color 0.15s",
            }}>{f}</button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${t.border}` }}>
              {cols.map(col => (
                <th key={col.key} onClick={() => toggle(col.key)} style={{
                  padding: "10px 16px", textAlign: "left", cursor: "pointer",
                  fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: sortKey === col.key ? a.primary : t.textFaint,
                  fontWeight: 600, whiteSpace: "nowrap", background: t.bgCard,
                  userSelect: "none",
                }}>
                  {col.label}
                  {sortKey === col.key && <span style={{ marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
              <th style={{ padding: "10px 16px", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textFaint, background: t.bgCard }}></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((cask, i) => (
              <tr key={cask.id}
                onClick={() => onSelectCask(cask)}
                style={{
                  borderBottom: `1px solid ${t.border}`,
                  background: i % 2 === 0 ? t.bgCard : t.bg,
                  cursor: "pointer", transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? t.bgCard : t.bg}
              >
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: serif, fontSize: 16, color: t.text }}>{cask.name}</span>
                </td>
                <td style={{ padding: "14px 16px", color: t.textMuted, fontFamily: "monospace" }}>{cask.year}</td>
                <td style={{ padding: "14px 16px", color: t.textMuted }}>{cask.region}</td>
                <td style={{ padding: "14px 16px", color: t.textFaint, fontSize: 12 }}>{cask.fadetype || "—"}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                    padding: "3px 9px", border: `1px solid ${statusColor[cask.status]}55`,
                    color: statusColor[cask.status], background: `${statusColor[cask.status]}14`,
                    fontWeight: 600, whiteSpace: "nowrap",
                  }}>{statusLabel[cask.status]}</span>
                </td>
                <td style={{ padding: "14px 16px", fontFamily: "monospace", color: cask.abv ? t.text : t.textFaint, fontSize: 13 }}>
                  {cask.abv ? `${cask.abv}%` : "—"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 13, color: t.textMuted }}>
                    {cask.andele.reduce((s, m) => s + m.andele, 0)}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: t.textFaint, fontSize: 13 }}>→</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── MemberTable ───────────────────────────────────────────────────────────────
// Cross-tab: rows = members, columns = casks, cells = andele count
function MemberTable({ casks, medlemmer, t, a, serif, onSelectCask }) {
  const statusColor = { lagrer: "oklch(68% 0.14 65)", aftappet: "oklch(55% 0.08 220)" };
  const statusLabel = { lagrer: "Lagrer", aftappet: "Afyldt" };
  const statusLabelFull = { lagrer: "Lagrer", aftappet: "Afyldt" };

  const [query, setQuery]   = React.useState("");
  const [focused, setFocused] = React.useState(null); // single-member focus

  // Build sorted cask list
  const order       = { lagrer: 0, aftappet: 1 };
  const sortedCasks = [...casks].sort((a, b) =>
    order[a.status] !== order[b.status]
      ? order[a.status] - order[b.status]
      : parseInt(b.year) - parseInt(a.year)
  );

  // Collect all unique member names — brug fuld liste fra data hvis tilgængelig
  const memberSet = new Set(medlemmer && medlemmer.length ? medlemmer : []);
  sortedCasks.forEach(c => c.andele.forEach(m => memberSet.add(m.navn)));
  const members = [...memberSet];

  // Build lookup: memberName → caskId → andele
  const lookup = {};
  members.forEach(m => { lookup[m] = {}; });
  sortedCasks.forEach(c => c.andele.forEach(m => { lookup[m.navn][c.id] = m.andele; }));

  const rowTotal = m => sortedCasks.reduce((s, c) => s + (lookup[m][c.id] || 0), 0);
  const colTotal = c => members.reduce((s, m) => s + (lookup[m][c.id] || 0), 0);
  const grandTotal = members.reduce((s, m) => s + rowTotal(m), 0);
  const sortedMembers = [...members].sort((a, b) => rowTotal(b) - rowTotal(a));

  // Filtered suggestions for autocomplete
  const q = query.trim().toLowerCase();
  const suggestions = q.length >= 1
    ? sortedMembers.filter(m => m.toLowerCase().includes(q))
    : [];

  // The member currently "focused" (either from search or click)
  const activeMember = focused || (suggestions.length === 1 ? suggestions[0] : null);

  // ── Single-member card view ──────────────────────────────────────────────
  function MemberCard({ member }) {
    const total = rowTotal(member);
    const ownedCasks = sortedCasks.filter(c => (lookup[member][c.id] || 0) > 0);

    return (
      <div style={{ animation: "fadeSlideIn 0.22s ease" }}>
        <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:none; } }`}</style>

        {/* Header card */}
        <div style={{
          background: t.bgCard, border: `1px solid ${t.border}`,
          borderTop: `3px solid ${a.primary}`,
          padding: "24px 28px", marginBottom: 16,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: a.primary, marginBottom: 6 }}>Medlemsprofil</div>
            <h3 style={{ fontFamily: serif, fontSize: 28, fontWeight: 400, color: t.text, lineHeight: 1.1 }}>{member}</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: t.textFaint, marginBottom: 4 }}>Andele i alt</div>
            <div style={{ fontFamily: serif, fontSize: 42, color: a.primary, lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 11, color: t.textFaint, marginTop: 4 }}>på {ownedCasks.length} {ownedCasks.length === 1 ? "fad" : "fade"}</div>
          </div>
        </div>

        {/* Cask rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sortedCasks.map(c => {
            const val = lookup[member][c.id] || 0;
            const fadTotal = c.andele.reduce((s, m) => s + m.andele, 0);
            const pct = fadTotal > 0 ? Math.round((val / fadTotal) * 100) : 0;
            if (!val) return null;
            return (
              <div key={c.id}
                onClick={() => onSelectCask && onSelectCask(c)}
                style={{
                  background: t.bgCard, border: `1px solid ${t.border}`,
                  padding: "18px 24px", cursor: "pointer", transition: "border-color 0.18s, transform 0.18s",
                  display: "flex", flexDirection: "column", gap: 12,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.primary}55`; e.currentTarget.style.transform = "translateX(3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: t.textFaint, marginBottom: 4 }}>{c.year} · {c.region}</div>
                    <div style={{ fontFamily: serif, fontSize: 18, color: t.text, lineHeight: 1.2 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: t.textFaint, marginTop: 4 }}>{c.fadetype || ""}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span style={{
                      fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
                      padding: "3px 9px", border: `1px solid ${statusColor[c.status]}55`,
                      color: statusColor[c.status], background: `${statusColor[c.status]}14`, fontWeight: 600,
                    }}>{statusLabelFull[c.status]}</span>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: serif, fontSize: 32, color: a.primary, lineHeight: 1 }}>{val}</span>
                      <span style={{ fontSize: 11, color: t.textFaint, marginLeft: 4 }}>andele</span>
                    </div>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase" }}>Din andel af fad</span>
                    <span style={{ fontSize: 10, fontFamily: "monospace", color: t.textMuted }}>{val} ud af {fadTotal} andele</span>
                  </div>
                  <div style={{ height: 4, background: t.border }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: a.primary, opacity: 0.7 }} />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Casks not in */}
          {sortedCasks.some(c => !lookup[member][c.id]) && (
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 12, color: t.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", userSelect: "none", padding: "8px 0" }}>
                Fade uden andele ({sortedCasks.filter(c => !lookup[member][c.id]).length})
              </summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                {sortedCasks.filter(c => !lookup[member][c.id]).map(c => (
                  <div key={c.id}
                    onClick={() => onSelectCask && onSelectCask(c)}
                    style={{ background: t.bg, border: `1px solid ${t.border}`, padding: "12px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: 0.6 }}
                  >
                    <div>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: t.textFaint, marginRight: 10 }}>{c.year}</span>
                      <span style={{ fontSize: 14, color: t.textMuted }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 10, color: t.textFaint }}>Ikke andel →</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  // ── Full cross-table ─────────────────────────────────────────────────────
  function FullTable({ filteredMembers }) {
    const cellStyle = (val) => ({
      padding: "11px 14px", textAlign: "center", fontFamily: "monospace",
      fontSize: val ? 14 : 12, color: val ? a.primary : t.textFaint,
      fontWeight: val ? 600 : 400, whiteSpace: "nowrap",
    });

    return (
      <div style={{ overflowX: "auto", border: `1px solid ${t.border}` }}>
        <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%", minWidth: 900 }}>
          <thead>
            {/* Status band row */}
            <tr style={{ background: t.bg }}>
              <th style={{ padding: "8px 16px", minWidth: 130, position: "sticky", left: 0, background: t.bg, zIndex: 2 }} />
              {(() => {
                const groups = [];
                sortedCasks.forEach(c => {
                  const last = groups[groups.length - 1];
                  if (last && last.status === c.status) last.count++;
                  else groups.push({ status: c.status, count: 1 });
                });
                return groups.map((g, i) => (
                  <th key={i} colSpan={g.count} style={{
                    padding: "6px 0", textAlign: "center", fontSize: 9,
                    letterSpacing: "0.16em", textTransform: "uppercase",
                    color: statusColor[g.status], fontWeight: 600,
                    borderLeft: `1px solid ${t.border}`,
                    borderBottom: `1px solid ${statusColor[g.status]}44`,
                    background: `${statusColor[g.status]}08`,
                  }}>{statusLabel[g.status]}</th>
                ));
              })()}
              <th style={{ borderLeft: `1px solid ${t.border}`, background: t.bg }} />
            </tr>

            {/* Cask name row */}
            <tr style={{ borderBottom: `2px solid ${t.border}` }}>
              <th style={{
                padding: "12px 16px", textAlign: "left", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase", color: t.textFaint,
                fontWeight: 600, position: "sticky", left: 0, background: t.bgCard, zIndex: 2,
                borderRight: `1px solid ${t.border}`,
              }}>Medlem</th>
              {sortedCasks.map(c => (
                <th key={c.id}
                  onClick={() => onSelectCask && onSelectCask(c)}
                  style={{
                    padding: "10px 8px", textAlign: "center", cursor: "pointer",
                    fontSize: 11, color: t.textMuted, fontWeight: 500,
                    borderLeft: `1px solid ${t.border}`,
                    background: t.bgCard, minWidth: 80, maxWidth: 100,
                    transition: "color 0.15s", lineHeight: 1.3,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = a.primary}
                  onMouseLeave={e => e.currentTarget.style.color = t.textMuted}
                >
                  <div style={{ fontFamily: serif, fontWeight: 400, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 90 }}>
                    {c.name.replace("Isle of Arran (LAGG)", "LAGG")}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: statusColor[c.status], marginTop: 2 }}>{c.year}</div>
                </th>
              ))}
              <th style={{
                padding: "10px 14px", textAlign: "center", fontSize: 10,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: a.primary, fontWeight: 700,
                borderLeft: `2px solid ${t.border}`, background: t.bgCard,
                position: "sticky", right: 0, zIndex: 2,
              }}>Total</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member, ri) => {
              const total = rowTotal(member);
              const isHighlighted = q && member.toLowerCase().includes(q);
              return (
                <tr key={member}
                  onClick={() => setFocused(member)}
                  style={{
                    borderBottom: `1px solid ${t.border}`,
                    background: isHighlighted ? `${a.primary}12` : (ri % 2 === 0 ? t.bgCard : t.bg),
                    cursor: "pointer", transition: "background 0.12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
                  onMouseLeave={e => e.currentTarget.style.background = isHighlighted ? `${a.primary}12` : (ri % 2 === 0 ? t.bgCard : t.bg)}
                >
                  <td style={{
                    padding: "12px 16px", fontWeight: isHighlighted ? 600 : 500,
                    color: isHighlighted ? a.primary : t.text, fontSize: 14,
                    position: "sticky", left: 0, background: "inherit", zIndex: 1,
                    borderRight: `1px solid ${t.border}`, whiteSpace: "nowrap",
                  }}>{member}</td>
                  {sortedCasks.map(c => {
                    const val = lookup[member][c.id] || 0;
                    return (
                      <td key={c.id} style={{ ...cellStyle(val), borderLeft: `1px solid ${t.border}` }}
                        onClick={ev => { ev.stopPropagation(); onSelectCask && onSelectCask(c); }}
                      >
                        {val || <span style={{ opacity: 0.3 }}>—</span>}
                      </td>
                    );
                  })}
                  <td style={{
                    padding: "12px 14px", textAlign: "center", fontFamily: serif,
                    fontSize: 18, color: a.primary, fontWeight: 400,
                    borderLeft: `2px solid ${t.border}`,
                    position: "sticky", right: 0, background: "inherit", zIndex: 1,
                  }}>{total}</td>
                </tr>
              );
            })}

            {/* Column totals row */}
            <tr style={{ borderTop: `2px solid ${t.border}`, background: t.bg }}>
              <td style={{
                padding: "12px 16px", fontSize: 10, letterSpacing: "0.14em",
                textTransform: "uppercase", color: t.textFaint, fontWeight: 600,
                position: "sticky", left: 0, background: t.bg, zIndex: 1,
                borderRight: `1px solid ${t.border}`,
              }}>Totalt optaget</td>
              {sortedCasks.map(c => (
                <td key={c.id} style={{
                  padding: "12px 8px", textAlign: "center",
                  borderLeft: `1px solid ${t.border}`,
                  fontFamily: "monospace", fontSize: 13, color: t.textMuted,
                }}>
                  <div>{colTotal(c)}</div>
                </td>
              ))}
              <td style={{
                padding: "12px 14px", textAlign: "center", fontFamily: serif,
                fontSize: 20, color: t.text, fontWeight: 700,
                borderLeft: `2px solid ${t.border}`,
                position: "sticky", right: 0, background: t.bg, zIndex: 1,
              }}>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const showCard = activeMember !== null;
  const tableMembers = q && !showCard
    ? sortedMembers.filter(m => m.toLowerCase().includes(q))
    : sortedMembers;

  return (
    <div>
      {/* ── Search bar ── */}
      <div style={{ marginBottom: 24, position: "relative", maxWidth: 420 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{
            position: "absolute", left: 14, fontSize: 16, color: t.textFaint,
            pointerEvents: "none", lineHeight: 1,
          }}>⌕</span>
          <input
            type="text"
            placeholder="Søg dit navn…"
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(null); }}
            style={{
              width: "100%", padding: "12px 40px 12px 40px",
              background: t.bgCard, border: `1.5px solid ${query ? a.primary : t.border}`,
              color: t.text, fontSize: 15, fontFamily: "'DM Sans', sans-serif",
              outline: "none", transition: "border-color 0.18s",
              letterSpacing: "0.01em",
            }}
            onFocus={e => e.target.style.borderColor = a.primary}
            onBlur={e => e.target.style.borderColor = query ? a.primary : t.border}
          />
          {query && (
            <button onClick={() => { setQuery(""); setFocused(null); }} aria-label="Ryd søgning" style={{
              position: "absolute", right: 12, background: "none", border: "none",
              color: t.textFaint, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "2px 4px",
            }}>×</button>
          )}
        </div>

        {/* Dropdown suggestions */}
        {q.length >= 1 && suggestions.length > 1 && !focused && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
            background: t.bgCard, border: `1px solid ${t.border}`,
            borderTop: "none", boxShadow: `0 8px 24px oklch(0% 0 0 / 0.18)`,
            maxHeight: 280, overflowY: "auto",
          }}>
            {suggestions.map(m => (
              <button key={m} onMouseDown={() => { setFocused(m); setQuery(m); }}
                style={{
                  display: "block", width: "100%", padding: "12px 16px",
                  background: "none", border: "none", borderBottom: `1px solid ${t.border}`,
                  color: t.text, fontSize: 14, textAlign: "left", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "background 0.12s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = t.bgHover}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                {(() => {
                  const idx = m.toLowerCase().indexOf(q);
                  if (idx === -1) return m;
                  return <>
                    {m.substring(0, idx)}
                    <span style={{ color: a.primary, fontWeight: 600 }}>{m.substring(idx, idx + q.length)}</span>
                    {m.substring(idx + q.length)}
                  </>;
                })()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── View toggle hint ── */}
      {showCard && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textFaint, letterSpacing: "0.06em" }}>
            Viser andele for <strong style={{ color: t.text }}>{activeMember}</strong>
          </div>
          <button onClick={() => { setFocused(null); setQuery(""); }} style={{
            background: "none", border: `1px solid ${t.border}`,
            color: t.textMuted, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "7px 16px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "color 0.15s, border-color 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.text; }}
            onMouseLeave={e => { e.currentTarget.style.color = t.textMuted; e.currentTarget.style.borderColor = t.border; }}
          >
            ← Vis alle
          </button>
        </div>
      )}

      {/* ── Content: card or table ── */}
      {showCard
        ? <MemberCard member={activeMember} />
        : <FullTable filteredMembers={tableMembers} />
      }

      {/* No results */}
      {q.length >= 1 && suggestions.length === 0 && (
        <div style={{ padding: "32px 0", textAlign: "center", color: t.textFaint, fontSize: 14 }}>
          Ingen medlemmer matcher "<em>{query}</em>"
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CaskModal, DataTable, MemberTable });
