import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { fetchConsolidatedWork, workSelector } from "../../../../api/consolidate";
import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { FiSearch, FiX } from "react-icons/fi";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";

/* ─────────────────────────────────────────
   TYPES & COLUMNS
───────────────────────────────────────── */
type WorkType = "individual" | "ward_individual" | "community" | "ward_community" | "";

const TYPE_LABELS: Record<string, string> = {
  individual:      "ವೈಯಕ್ತಿಕ",
  ward_individual: "ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ",
  community:       "ಸಮುದಾಯ",
  ward_community:  "ವಾರ್ಡ್ ಸಮುದಾಯ",
};

const INDIVIDUAL_COLS = [
  { key: "name",        label: "ಹೆಸರು",       width: 160 },
  { key: "scheme",      label: "ಯೋಜನೆ",        width: 200 },
  { key: "orderNumber", label: "ಆದೇಶ ಸಂಖ್ಯೆ",  width: 120 },
  { key: "mobile",      label: "ಮೊಬೈಲ್",       width: 115 },
  { key: "address",     label: "ವಿಳಾಸ",        width: 200 },
];

const COMMUNITY_COLS = [
  { key: "workDetails",     label: "ಕೆಲಸದ ವಿವರ",      width: 220 },
  { key: "estimatedAmount", label: "ಮೊತ್ತ",            width: 70  },
  { key: "scheme",          label: "ಯೋಜನೆ",             width: 200 },
  { key: "department",      label: "ಅನುಷ್ಠಾನ ಇಲಾಖೆ",  width: 110 },
  { key: "letterNumber",    label: "ಪತ್ರ ಸಂಖ್ಯೆ",      width: 115 },
  { key: "remarks",         label: "ಷರಾ",               width: 140 },
];

const COMMON_COLS = [
  { key: "taluk",   label: "ತಾಲ್ಲೂಕು",        width: 100 },
  { key: "gp",      label: "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ",  width: 140 },
  { key: "village", label: "ಗ್ರಾಮ / ವಾರ್ಡ್",  width: 120 },
  { key: "type",    label: "ಪ್ರಕಾರ",           width: 120 },
];

type ColDef = { key: string; label: string; width: number };

function getDynamicCols(t: WorkType): ColDef[] {
  return t === "individual" || t === "ward_individual" ? INDIVIDUAL_COLS : COMMUNITY_COLS;
}

function getCellValue(item: any, key: string): string {
  switch (key) {
    case "taluk":   return item.location?.taluk?.name   || "-";
    case "gp":      return item.location?.gp?.name      || "-";
    case "village": return item.location?.village?.name || item.location?.ward?.name || "-";
    case "type":    return TYPE_LABELS[item.type]        || item.type || "-";
    default:        return item[key] != null ? String(item[key]) : "-";
  }
}

function clientSearch(list: any[], q: string): any[] {
  if (!q.trim()) return list;
  const lower = q.toLowerCase();
  return list.filter((item) =>
    [
      item.name, item.workDetails, item.scheme, item.orderNumber,
      item.mobile, item.address, item.department, item.letterNumber,
      item.remarks, item.location?.taluk?.name, item.location?.hobli?.name,
      item.location?.gp?.name, item.location?.village?.name,
      item.location?.ward?.name, TYPE_LABELS[item.type] || item.type,
    ].some((f) => f && String(f).toLowerCase().includes(lower))
  );
}

function getSingleValueCols(list: any[], cols: ColDef[]): Record<string, string> {
  const singles: Record<string, string> = {};
  for (const col of cols) {
    const vals = new Set(list.map((item) => getCellValue(item, col.key)));
    if (vals.size === 1) singles[col.key] = [...vals][0];
  }
  return singles;
}

const PDF_COL_PCT: Record<string, number> = {
  taluk: 8, gp: 11, village: 9, type: 8,
  name: 13, scheme: 18, orderNumber: 9, mobile: 9, address: 14,
  workDetails: 20, estimatedAmount: 8, department: 12, letterNumber: 9, remarks: 11,
};
function getPdfColWidths(cols: ColDef[]): Record<string, string> {
  const raw   = cols.map((c) => PDF_COL_PCT[c.key] ?? 10);
  const total = raw.reduce((a, b) => a + b, 0);
  const scale = 95 / total;
  const out: Record<string, string> = {};
  cols.forEach((c, i) => { out[c.key] = `${(raw[i] * scale).toFixed(1)}%`; });
  return out;
}

/* ─────────────────────────────────────────
   EXCEL EXPORT
───────────────────────────────────────── */
async function downloadExcel(list: any[], cols: ColDef[], typeLabel: string) {
  const title   = `ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ${typeLabel ? ` — ${typeLabel}` : ""}`;
  const dateStr = new Date().toLocaleDateString("en-IN");
  const headerRow = ["ಕ್ರ.ಸಂ", ...cols.map((c) => c.label)];
  const dataRows  = list.map((item, i) => [i + 1, ...cols.map((c) => getCellValue(item, c.key))]);
  const aoa = [
    [title],
    [`ದಿನಾಂಕ: ${dateStr}`, "", "", `ಒಟ್ಟು: ${list.length}`],
    [],
    headerRow,
    ...dataRows,
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } }];
  ws["!cols"] = headerRow.map((_, ci) => ({
    wch: Math.min(
      Math.max(...[headerRow[ci], ...dataRows.map((r) => String(r[ci] ?? ""))].map((v) => String(v).length)) + 3,
      50
    ),
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, (typeLabel || "ಎಲ್ಲಾ").slice(0, 31));
  XLSX.writeFile(wb, `work_report_${Date.now()}.xlsx`);
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */
const TypeBadge = ({ type }: { type: string }) => {
  const map: Record<string, { bg: string; color: string }> = {
    individual:      { bg: "#eff6ff", color: "#1d4ed8" },
    ward_individual: { bg: "#f5f3ff", color: "#6d28d9" },
    community:       { bg: "#f0fdf4", color: "#15803d" },
    ward_community:  { bg: "#fffbeb", color: "#b45309" },
  };
  const s = map[type] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600,
      padding: "2px 9px", borderRadius: 20,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>
      {TYPE_LABELS[type] || type}
    </span>
  );
};

const FilterChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 600,
      border: active ? "1.5px solid #2466d1" : "1.5px solid #e2e8f0",
      background: active ? "#2466d1" : "#fff",
      color: active ? "#fff" : "#64748b",
      cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
      fontFamily: "inherit", flexShrink: 0,
    }}
  >
    {label}
  </button>
);

const Spinner = () => (
  <tr>
    <td colSpan={999} style={{ border: "none", padding: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: 12 }}>
        <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTopColor: "#2466d1", borderRadius: "50%", animation: "wd-spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 13, color: "#94a3b8" }}>ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</span>
      </div>
    </td>
  </tr>
);

const PdfLoader = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
      background: "rgba(255,255,255,0.88)", backdropFilter: "blur(4px)",
    }}>
      <div style={{ width: 44, height: 44, border: "3px solid #e2e8f0", borderTopColor: "#2466d1", borderRadius: "50%", animation: "wd-spin 0.8s linear infinite" }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e40af" }}>PDF ತಯಾರಾಗುತ್ತಿದೆ...</span>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
const WorkDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, consolidated, loading } = useSelector(workSelector);
  const meta = consolidated?.meta || {};
  const bd   = meta?.breakdown   || {};

  const [isPdf,        setIsPdf]        = useState(false);
  const [pdfLoading,   setPdfLoading]   = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [typeFilter,   setTypeFilter]   = useState<WorkType>("");
  const [search,       setSearch]       = useState("");

  useEffect(() => {
    dispatch(fetchConsolidatedWork({ type: typeFilter || undefined, limit: 100000 }));
  }, [typeFilter]);

  const rawList     = (list || []) as any[];
  const shown       = useMemo(() => clientSearch(rawList, search), [rawList, search]);
  const dynamicCols = getDynamicCols(typeFilter);
  const allCols     = [...COMMON_COLS, ...dynamicCols];
  const typeLabel   = TYPE_LABELS[typeFilter] || "";

  const singleVals = useMemo(
    () => shown.length > 0 ? getSingleValueCols(shown, allCols) : {},
    [shown, typeFilter]
  );
  const tableCols     = allCols.filter((c) => !(c.key in singleVals));
  const pdfWidths     = getPdfColWidths(tableCols);
  const tableMinWidth = 52 + tableCols.reduce((s, c) => s + c.width, 0);

  const handleExcel = async () => {
    if (!shown.length || excelLoading) return;
    setExcelLoading(true);
    try { await downloadExcel(shown, tableCols, typeLabel); }
    finally { setExcelLoading(false); }
  };

  const handlePdf = async () => {
    if (pdfLoading || !shown.length) return;
    setPdfLoading(true);
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 700));
    await document.fonts.ready;
    const el = document.getElementById("work-pdf-area");
    if (!el) { setIsPdf(false); setPdfLoading(false); return; }
    try {
      await (html2pdf() as any).from(el).set({
        margin:      [5, 4, 6, 4],
        filename:    "ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ.pdf",
        image:       { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:       { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak:   { mode: ["avoid-all", "css"] },
      }).save();
    } finally {
      setIsPdf(false);
      setPdfLoading(false);
    }
  };

  const CHIPS = [
    { key: "" as WorkType,                label: "ಎಲ್ಲಾ",            count: meta?.total        || 0 },
    { key: "individual" as WorkType,      label: "ವೈಯಕ್ತಿಕ",         count: bd.individual      || 0 },
    { key: "community" as WorkType,       label: "ಸಮುದಾಯ",           count: bd.community       || 0 },
    { key: "ward_individual" as WorkType, label: "ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ", count: bd.ward_individual || 0 },
    { key: "ward_community" as WorkType,  label: "ವಾರ್ಡ್ ಸಮುದಾಯ",   count: bd.ward_community  || 0 },
  ];

  return (
    <>
      <style>{`
        @keyframes wd-spin { to { transform: rotate(360deg); } }

        /*
          RESPONSIVE LAYOUT
          ═════════════════
          Desktop: toolbar = single row [title | search(grow) | select | Excel | PDF]
          Mobile:  Row1 = [title | Excel | PDF]   (export always visible top-right)
                   Row2 = [search(full-width)]
                   Row3 = [select(full-width)]
                   Chips = horizontal scroll strip (no wrap)
        */

        .wd-root {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 150px);
          min-height: 0;
          width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          background: #f8fafc;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
        }

        /* ── HEADER ── */
        .wd-header {
          flex: 0 0 auto;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px 8px;
        }

        /*
          DESKTOP toolbar: single flex row, no wrap.
          Title + Search(flex:1) + Select + Buttons
        */
        .wd-toolbar {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .wd-title {
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          flex: 0 0 auto;
        }
        /* search: grows on desktop, full-width on mobile (handled below) */
        .wd-search {
          position: relative;
          flex: 1 1 0;
          min-width: 0;
        }
        .wd-search-icon {
          position: absolute;
          left: 9px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          display: flex;
          font-size: 13px;
          z-index: 1;
        }
        .wd-search input {
          width: 100%;
          box-sizing: border-box;
          padding: 6px 9px 6px 30px;
          border: 1.5px solid #e2e8f0;
          border-radius: 7px;
          font-size: 12.5px;
          outline: none;
          background: #f8fafc;
          font-family: inherit;
          color: #1e293b;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .wd-search input:focus {
          border-color: #93c5fd;
          box-shadow: 0 0 0 3px rgba(147,197,253,0.22);
          background: #fff;
        }
        .wd-select {
          flex: 0 0 auto;
          padding: 6px 9px;
          border: 1.5px solid #e2e8f0;
          border-radius: 7px;
          font-size: 12px;
          outline: none;
          background: #f8fafc;
          cursor: pointer;
          font-family: inherit;
          color: #374151;
        }
        /* export group — always flex:0 0 auto so it never disappears */
        .wd-export {
          flex: 0 0 auto;
          display: flex;
          gap: 6px;
        }
        .wd-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          font-family: inherit;
        }
        .wd-btn:disabled { opacity: 0.38; cursor: not-allowed; }
        .wd-btn-excel { background:#f0fdf4; color:#15803d; border:1.5px solid #86efac; }
        .wd-btn-excel:not(:disabled):hover { background:#16a34a; color:#fff; border-color:#16a34a; }
        .wd-btn-pdf   { background:#fef2f2; color:#dc2626; border:1.5px solid #fca5a5; }
        .wd-btn-pdf:not(:disabled):hover   { background:#dc2626; color:#fff; border-color:#dc2626; }

        /*
          MOBILE toolbar override (≤ 600px)
          ───────────────────────────────────
          Row 1: [title ··· spacer ··· Excel PDF]   — title left, buttons right
          Row 2: [search — full width]
          Row 3: [select — full width]
        */
        @media (max-width: 600px) {
          .wd-toolbar {
            flex-wrap: wrap;
            gap: 6px;
          }
          /* title takes as much space as possible, pushing export to right */
          .wd-title {
            flex: 1 1 auto;
          }
          /* export stays right on row 1 */
          .wd-export {
            flex: 0 0 auto;
            order: 1;           /* stays after title on row 1 */
          }
          /* search drops to row 2, full width */
          .wd-search {
            order: 2;
            flex: 0 0 100%;
            width: 100%;
          }
          /* select drops to row 3, full width */
          .wd-select {
            order: 3;
            width: 100%;
            box-sizing: border-box;
          }
          /* smaller button labels on very small screens */
          .wd-btn { padding: 5px 10px; font-size: 11.5px; }
        }

        /* ── FILTER CHIPS ──
           Desktop: wrap normally.
           Mobile: single horizontal scroll line — no wrapping, no overflow.
        */
        .wd-chips {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          /* default: wrap on desktop */
          flex-wrap: wrap;
        }
        @media (max-width: 600px) {
          .wd-chips {
            flex-wrap: nowrap;           /* single row */
            overflow-x: auto;           /* swipe-scrollable */
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;      /* hide scrollbar on mobile */
            padding: 7px 10px;
          }
          .wd-chips::-webkit-scrollbar { display: none; }
        }

        /* ── INFO BAR ── */
        .wd-infobar {
          flex: 0 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding: 5px 14px;
          background: #f0f6ff;
          border-bottom: 1px solid #dbeafe;
          font-size: 11.5px;
          color: #475569;
        }
        .wd-infobar strong { color: #1e40af; font-weight: 700; }

        /* ── TABLE BODY AREA ── */
        .wd-body {
          flex: 1 1 0;
          min-height: 0;
          position: relative;
          background: #fff;
        }
        /*
          position:absolute inset:0 → fills .wd-body exactly.
          overflow-x:auto + overflow-y:auto → both scrollbars inside, nothing leaks.
        */
        .wd-scroll {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          overflow-x: auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;  /* smooth momentum scroll on iOS */
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .wd-scroll::-webkit-scrollbar        { width: 6px; height: 6px; }
        .wd-scroll::-webkit-scrollbar-track  { background: #f1f5f9; }
        .wd-scroll::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 4px; }
        .wd-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .wd-scroll::-webkit-scrollbar-corner { background: #f1f5f9; }

        /* ── TABLE ── */
        .wd-table {
          border-collapse: collapse;
          table-layout: fixed;
          /* minWidth set inline → sum of col widths → triggers H scroll */
        }
        .wd-table thead th {
          background: linear-gradient(180deg, #2e7ddc 0%, #1a5bbf 100%);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 10px 10px;
          text-align: left;
          border-right: 1px solid rgba(255,255,255,0.2);
          border-bottom: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: sticky;
          top: 0;
          z-index: 10;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .wd-table thead th.th-center { text-align: center; }
        .wd-table tbody tr:nth-child(even) { background: #f8fafc; }
        .wd-table tbody tr:hover { background: #eff6ff; }
        .wd-table tbody td {
          padding: 8px 10px;
          font-size: 12.5px;
          color: #1e293b;
          border-bottom: 1px solid #D4D4D4;
          border-right: 1px solid #D4D4D4;
          vertical-align: middle;
          line-height: 1.5;
          word-break: break-word;
          white-space: normal;
        }
        .wd-table tbody td.td-sl {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          white-space: nowrap;
        }
        .wd-table tbody td.td-center { text-align: center; }

        /* ── PDF TITLE ── */
        .wd-pdf-title {
          text-align: center;
          padding: 10px 12px 12px;
          border-bottom: 2px solid #1a5bbf;
          margin-bottom: 10px;
        }
        .wd-pdf-title h2 { font-size:16px; font-weight:800; margin:0 0 3px; color:#0f172a; }
        .wd-pdf-title p  { font-size:10px; margin:0; color:#475569; }

        @media print {
          html, body { height: auto !important; }
          .wd-body   { position: static !important; overflow: visible !important; height: auto !important; }
          .wd-scroll { position: static !important; overflow: visible !important; }
          .wd-table thead th {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <PdfLoader visible={pdfLoading} />

      <div className="wd-root">

        {/* ══ HEADER ══ */}
        <div className="wd-header">
          {/*
            Desktop: [title] [search] [select] [Excel] [PDF]  — all one line
            Mobile:  Row1: [title ............... Excel PDF]
                     Row2: [search — full width          ]
                     Row3: [select — full width          ]
          */}
          <div className="wd-toolbar">
            <span className="wd-title">ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ</span>

            {/* Export pinned right on mobile (order:1), inline on desktop */}
            <div className="wd-export">
              <button
                className="wd-btn wd-btn-excel"
                onClick={handleExcel}
                disabled={excelLoading || shown.length === 0}
              >
                <FaFileExcel size={12} />
                {excelLoading ? "..." : "Excel"}
              </button>
              <button
                className="wd-btn wd-btn-pdf"
                onClick={handlePdf}
                disabled={pdfLoading || shown.length === 0}
              >
                <FaFilePdf size={12} />
                {pdfLoading ? "..." : "PDF"}
              </button>
            </div>

            {/* Search — row 2 on mobile */}
            <div className="wd-search">
              <span className="wd-search-icon"><FiSearch /></span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ಹೆಸರು, ಗ್ರಾಮ, ಕೆಲಸ, ತಾಲ್ಲೂಕು ಹುಡುಕಿ..."
              />
            </div>

            {/* Select — row 3 on mobile */}
            <select
              className="wd-select"
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value as WorkType); setSearch(""); }}
            >
              <option value="">ಎಲ್ಲಾ ವಿಧ</option>
              <option value="individual">ವೈಯಕ್ತಿಕ</option>
              <option value="community">ಸಮುದಾಯ</option>
              <option value="ward_individual">ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ</option>
              <option value="ward_community">ವಾರ್ಡ್ ಸಮುದಾಯ</option>
            </select>
          </div>
        </div>

        {/* ══ FILTER CHIPS ══
            Desktop: wrap.   Mobile: single horizontal scroll line (swipeable). */}
        <div className="wd-chips">
          {CHIPS.map(({ key, label, count }) => (
            <FilterChip
              key={String(key)}
              label={`${label} (${count})`}
              active={typeFilter === key}
              onClick={() => { setTypeFilter(key); setSearch(""); }}
            />
          ))}
          {search.trim() && (
            <span style={{
              display:"inline-flex", alignItems:"center", gap:4,
              padding:"4px 11px", borderRadius:20, flexShrink: 0,
              background:"#eff6ff", color:"#1d4ed8",
              border:"1px solid #bfdbfe", fontSize:12, fontWeight:600,
              marginLeft:"auto",
            }}>
              ಫಲಿತಾಂಶ: {shown.length}
              <button
                onClick={() => setSearch("")}
                style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", color:"#1d4ed8" }}
              >
                <FiX size={11} />
              </button>
            </span>
          )}
        </div>

        {/* ══ SINGLE-VALUE INFO BAR ══ */}
        {Object.keys(singleVals).length > 0 && (
          <div className="wd-infobar">
            {allCols
              .filter((col) => col.key in singleVals)
              .map((col) => (
                <span key={col.key}>
                  <strong>{col.label}:</strong>{" "}{singleVals[col.key]}
                </span>
              ))}
          </div>
        )}

        {/* ══ TABLE ══ */}
        <div className="wd-body">
          <div
            id="work-pdf-area"
            className={isPdf ? "" : "wd-scroll"}
          >
            {isPdf && (
              <div className="wd-pdf-title">
                <h2>ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ{typeLabel ? ` — ${typeLabel}` : ""}</h2>
                <p>ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")} &nbsp;|&nbsp; ಒಟ್ಟು: {shown.length}</p>
              </div>
            )}

            <table
              className="wd-table"
              style={{
                width:    isPdf ? "100%" : undefined,
                minWidth: isPdf ? undefined : `${tableMinWidth}px`,
              }}
            >
              <colgroup>
                <col style={{ width: isPdf ? "5%" : "52px" }} />
                {tableCols.map((col) => (
                  <col key={col.key} style={{ width: isPdf ? pdfWidths[col.key] : `${col.width}px` }} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  <th className="th-center">ಕ್ರ.ಸಂ</th>
                  {tableCols.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <Spinner />
                ) : shown.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableCols.length + 1}
                      style={{ textAlign:"center", padding:"56px 0", color:"#94a3b8", fontSize:13, border:"none" }}
                    >
                      ದಾಖಲೆಗಳು ಇಲ್ಲ
                    </td>
                  </tr>
                ) : (
                  shown.map((item, i) => (
                    <tr key={i} style={{ pageBreakInside:"avoid", breakInside:"avoid" }}>
                      <td className="td-sl">{i + 1}</td>
                      {tableCols.map((col) => {
                        const val      = getCellValue(item, col.key);
                        const isCenter = ["orderNumber","mobile","estimatedAmount","letterNumber"].includes(col.key);
                        return (
                          <td
                            key={col.key}
                            className={isCenter ? "td-center" : ""}
                            style={{
                              fontSize: isPdf ? 9.5 : 12.5,
                              padding:  isPdf ? "4px 5px" : "8px 10px",
                            }}
                          >
                            {col.key === "type" && !isPdf
                              ? <TypeBadge type={item.type} />
                              : val
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
};

export default WorkDashboard;