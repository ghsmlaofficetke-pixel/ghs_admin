
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  fetchConsolidatedWork,
  workSelector,
} from "../../../../api/consolidate";
import html2pdf from "html2pdf.js";
import "./index.css"

/* ─────────────────────────────────────────
   TYPE CONFIG
───────────────────────────────────────── */
type WorkType =
  | "individual"
  | "ward_individual"
  | "community"
  | "ward_community"
  | "";

const TYPE_LABELS: Record<string, string> = {
  individual: "ವೈಯಕ್ತಿಕ",
  ward_individual: "ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ",
  community: "ಸಮುದಾಯ",
  ward_community: "ವಾರ್ಡ್ ಸಮುದಾಯ",
};

const INDIVIDUAL_COLS = [
  { key: "name", label: "ಹೆಸರು" },
  { key: "scheme", label: "ಯೋಜನೆ" },
  { key: "orderNumber", label: "ಆದೇಶ ಸಂಖ್ಯೆ" },
  { key: "mobile", label: "ಮೊಬೈಲ್" },
  { key: "address", label: "ವಿಳಾಸ" },
];

const COMMUNITY_COLS = [
  { key: "workDetails", label: "ಕೆಲಸ" },
  { key: "estimatedAmount", label: "ಮೊತ್ತ (ಲಕ್ಷ ರೂ.)" },
  { key: "scheme", label: "ಯೋಜನೆ" },
  { key: "department", label: "ಅನುಷ್ಠಾನ ಇಲಾಖೆ" },
  { key: "letterNumber", label: "ಪತ್ರ ಸಂಖ್ಯೆ" },
  { key: "remarks", label: "ಷರಾ" },
];

const COMMON_COLS = [
  { key: "taluk", label: "ತಾಲ್ಲೂಕು" },
  { key: "gp", label: "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ" },
  { key: "village", label: "ಗ್ರಾಮ / ವಾರ್ಡ್" },
  { key: "type", label: "ಪ್ರಕಾರ" },
];

type ColDef = { key: string; label: string };

function getDynamicCols(t: WorkType): ColDef[] {
  if (t === "individual" || t === "ward_individual") return INDIVIDUAL_COLS;
  return COMMUNITY_COLS;
}

function getCellValue(item: any, key: string): string {
  switch (key) {
    case "taluk":
      return item.location?.taluk?.name || "-";
    case "gp":
      return item.location?.gp?.name || "-";
    case "village":
      return item.location?.village?.name || item.location?.ward?.name || "-";
    case "type":
      return TYPE_LABELS[item.type] || item.type || "-";
    default:
      return item[key] != null ? String(item[key]) : "-";
  }
}

function clientSearch(list: any[], q: string): any[] {
  if (!q.trim()) return list;
  const lower = q.toLowerCase();
  return list.filter((item) =>
    [
      item.name,
      item.workDetails,
      item.scheme,
      item.orderNumber,
      item.mobile,
      item.address,
      item.department,
      item.letterNumber,
      item.remarks,
      item.location?.taluk?.name,
      item.location?.hobli?.name,
      item.location?.gp?.name,
      item.location?.village?.name,
      item.location?.ward?.name,
      TYPE_LABELS[item.type] || item.type,
    ].some((f) => f && String(f).toLowerCase().includes(lower))
  );
}

/* ─────────────────────────────────────────
   EXCEL DOWNLOAD
───────────────────────────────────────── */
async function downloadExcel(list: any[], cols: ColDef[], sheet: string) {
  const XLSX = await import("xlsx");
  const headers = ["#", ...cols.map((c) => c.label)];
  const rows = list.map((item, i) => [
    i + 1,
    ...cols.map((c) => getCellValue(item, c.key)),
  ]);
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws["!cols"] = headers.map((h, ci) => ({
    wch: Math.min(
      Math.max(h.length, ...rows.map((r) => String(r[ci] ?? "").length)) + 3,
      42
    ),
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, (sheet || "Report").slice(0, 31));
  XLSX.writeFile(wb, `work_report_${Date.now()}.xlsx`);
}

/* ─────────────────────────────────────────
   PDF DOWNLOAD
───────────────────────────────────────── */


/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const ExcelIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/><path d="M7 13l2 2 4-4"/>
  </svg>
);
const PdfIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const Spin = ({ cls }: { cls: string }) => (
  <span className={`w-3 h-3 rounded-full border-2 animate-spin inline-block ${cls}`} />
);

/* ─────────────────────────────────────────
   CARD
───────────────────────────────────────── */
const Card = ({
  title, count, active, onClick,
}: {
  title: string; count: number; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`p-[1px] rounded-xl w-full text-left transition-all
      ${active ? "ring-2 ring-blue-300 scale-[1]" : "opacity-80 hover:opacity-100"}`}
    style={{ background: "linear-gradient(to right,#2466d1,#06b6d4)" }}
  >
    <div className={`rounded-xl px-2 py-1 flex items-center justify-between gap-2
      ${active ? "bg-blue-50" : "bg-white"}`}>
      <span className="text-xs font-medium text-gray-700 truncate">{title}</span>
      <span className="text-sm font-bold text-[#265699] shrink-0">{count}</span>
    </div>
  </button>
);

/* ─────────────────────────────────────────
   SPINNER
───────────────────────────────────────── */
const Spinner = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-3">
    <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
    <span className="text-sm text-gray-400">ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</span>
  </div>
);

/* ─────────────────────────────────────────
   COLUMN WIDTH HELPER
───────────────────────────────────────── */
function colWidth(key: string): number {
  if (key === "workDetails" || key === "address") return 220;
  if (key === "remarks" || key === "department") return 140;
  if (key === "scheme") return 180;
  return 110;
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
const WorkDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, consolidated, loading } = useSelector(workSelector);
  const meta = consolidated?.meta || {};
const [isPdf, setIsPdf] = useState(false);
  const [typeFilter, setTypeFilter] = useState<WorkType>("");
  const [search, setSearch] = useState("");
  const [dl, setDl] = useState<"pdf" | "excel" | null>(null);

  useEffect(() => {
    dispatch(
      fetchConsolidatedWork({
        type: typeFilter || undefined,
        limit: 100000,
      })
    );
  }, [typeFilter]);

  const rawList: any[] = list || [];
  const shown = clientSearch(rawList, search);
  const dynamicCols = getDynamicCols(typeFilter);
  const allCols = [...COMMON_COLS, ...dynamicCols];
  const typeLabel = TYPE_LABELS[typeFilter] || "";

  const handleReset = () => { setTypeFilter(""); setSearch(""); };

  const handleExcel = async () => {
    if (!shown.length || dl) return;
    setDl("excel");
    try { await downloadExcel(shown, allCols, typeLabel || "ಎಲ್ಲಾ"); }
    finally { setDl(null); }
  };


  const bd = meta?.breakdown || {};

const getWidth = () => {
  const w = window.innerWidth;
  if (w >= 1024 && w < 1280) return "80%";
  return "100%";
};

const isLg = window.innerWidth >= 1024 && window.innerWidth < 1280;


const handlePdfDownload = async () => {
  const element = document.getElementById("pdf-area");
  if (!element) return;

  setIsPdf(true);

  // ✅ wait for DOM update properly
  await new Promise((resolve) => setTimeout(resolve, 500));

  const opt = {
    margin: 5,
    filename: "Manavi_Report.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,   // ✅ fix blank issue
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "landscape",
    },
  };

  await (html2pdf() as any).from(element).set(opt).save();

  setIsPdf(false);
};

  /* ─── SINGLE outer div — no duplicate wrapper ─── */
  return (
    <div
  style={{
      width: getWidth(),
      margin: isLg ? "0 auto" : "0",
      height: "calc(100vh - 150px)",
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
      background: "#f9fafb",
      boxSizing: "border-box",
    }}
>
      {/* ══ TOP CONTROLS (never scrolls) ══ */}
      <div style={{ flexShrink: 0, padding: "4px 6px 3px", display: "flex", flexDirection: "column", gap: 4 }}>

        {/* Row 1: Select + Search + Reset */}
        <div className="flex flex-wrap gap-2 items-center bg-white px-2 py-2 rounded-xl shadow-sm">

          <h1 className="text-md font-bold text-[#265899]">ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ</h1>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as WorkType); setSearch(""); }}
            className="flex-1 min-w-[150px] max-w-[250px] border border-gray-200 rounded-full px-2 py-[7px]
           text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">ಎಲ್ಲಾ ವಿಧ</option>
            <option value="individual">ವೈಯಕ್ತಿಕ</option>
            <option value="community">ಸಮುದಾಯ</option>
            <option value="ward_individual">ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ</option>
            <option value="ward_community">ವಾರ್ಡ್ ಸಮುದಾಯ</option>
          </select>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ಹುಡುಕಿ... (ಹೆಸರು, ಗ್ರಾಮ, ತಾಲ್ಲೂಕು, ಕೆಲಸ...)"
            className="flex-1 min-w-[150px] max-w-[450px] border border-gray-200 rounded-full px-2 py-[7px] w-[40%]
                       text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />

          {(typeFilter || search) && (
            <button
              onClick={handleReset}
              className="shrink-0 bg-red-50 text-red-600 border border-red-200 rounded-lg
                         px-3 py-[7px] text-xs font-semibold hover:bg-red-500 hover:text-white
                         transition-colors whitespace-nowrap"
            >
              ✕ Reset
            </button>
          )}
        </div>

        {/* Row 2: Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Card title="ವೈಯಕ್ತಿಕ ಕೆಲಸಗಳು"  count={bd.individual     || 0} active={typeFilter === "individual"}      onClick={() => setTypeFilter(t => t === "individual" ? "" : "individual")} />
          <Card title="ಸಮುದಾಯ ಕೆಲಸಗಳು"    count={bd.community       || 0} active={typeFilter === "community"}       onClick={() => setTypeFilter(t => t === "community" ? "" : "community")} />
          <Card title="ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ"    count={bd.ward_individual || 0} active={typeFilter === "ward_individual"}  onClick={() => setTypeFilter(t => t === "ward_individual" ? "" : "ward_individual")} />
          <Card title="ವಾರ್ಡ್ ಸಮುದಾಯ"      count={bd.ward_community  || 0} active={typeFilter === "ward_community"}   onClick={() => setTypeFilter(t => t === "ward_community" ? "" : "ward_community")} />
        </div>

        {/* Row 3: Totals + Download */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              ಒಟ್ಟು : {meta?.total || 0}
            </span>
            {search?.trim() && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                ಹುಡುಕಾಟ ಫಲಿತಾಂಶ : {shown.length}
              </span>
            )}
            {typeLabel && (
              <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                {typeLabel}
              </span>
            )}
          </div>

          <div className="flex gap-2 ">
            <button
              onClick={handleExcel}
              disabled={!!dl || shown.length === 0}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200
                         px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                         hover:bg-emerald-600 hover:text-white hover:border-emerald-600
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {dl === "excel" ? <Spin cls="border-emerald-200 border-t-emerald-700" /> : <ExcelIcon />}
              {dl === "excel" ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "Excel"}
            </button>

    {/* <button
        onClick={handlePdfDownload}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        PDF
      </button> */}

            <button
              onClick={handlePdfDownload}
              disabled={!!dl || shown.length === 0}
              className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200
                         px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap
                         hover:bg-red-600 hover:text-white hover:border-red-600
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {dl === "pdf" ? <Spin cls="border-red-200 border-t-red-700" /> : <PdfIcon />}
              {dl === "pdf" ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ TABLE — fills all remaining height, scrolls both axes ══ */}
 <div
  id="pdf-area"
  style={{
    flex: isPdf ? "none" : 1,   // ✅ FIX
    height: isPdf ? "auto" : "100%", // ✅ FIX
    minHeight: 0,
    margin: "0",
    background: "#fff",

    overflow: isPdf ? "visible" : "auto",
    width: isPdf ? "1400px" : "100%",
    padding: isPdf ? "10px" : "0",
  }}
>
  {/* ✅ PDF HEADER */}
  {isPdf && (
    <div style={{ textAlign: "center", marginBottom: 10 }}>
      <h2 style={{ fontWeight: "bold", fontSize: 16 }}>
        ಕ್ರೋಡಿಕೃತ ಕೆಲಸಗಳ ವರದಿ
      </h2>
      <p style={{ fontSize: 11 }}>
        {new Date().toLocaleDateString()}
      </p>
    </div>
  )}

  <table
    className={isPdf ? "page-break-table" : ""}
    style={{
      width: isPdf ? "100%" : "max-content",
      minWidth: "100%",
      borderCollapse: "collapse",

      // ❗ important for PDF
      tableLayout: isPdf ? "fixed" : "auto",
    }}
  >
    <thead
      style={{
        background: "#2466d1",

        // ❌ disable sticky in PDF
        position: isPdf ? "static" : "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <tr>
        <th
          style={{
            padding: "5px",
            fontSize: isPdf ? 9 : 12,
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
        >
          Sl.No
        </th>

        {allCols.map((col) => {
          const w = colWidth(col.key);
          return (
            <th
              key={col.key}
              style={{
                width: isPdf ? undefined : w,
                minWidth: isPdf ? undefined : w,
                padding: "5px",
                fontSize: isPdf ? 9 : 12,
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "left",
                whiteSpace: "nowrap",
              }}
            >
              {col.label}
            </th>
          );
        })}
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan={allCols.length + 1}>
            <Spinner />
          </td>
        </tr>
      ) : shown.length === 0 ? (
        <tr>
          <td
            colSpan={allCols.length + 1}
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            ದಾಖಲೆಗಳು ಇಲ್ಲ
          </td>
        </tr>
      ) : (
        shown.map((item, i) => (
          <tr
            key={i}
            style={{
              background: i % 2 === 0 ? "#fff" : "#f0f7ff",
            }}
          >
            <td
              style={{
                padding: "4px",
                fontSize: isPdf ? 8 : 11,
                border: "1px solid #e5e7eb",
                textAlign: "center",
              }}
            >
              {i + 1}
            </td>

            {allCols.map((col) => (
              <td
                key={col.key}
                style={{
                  padding: "4px",
                  fontSize: isPdf ? 8 : 11,
                  border: "1px solid #e5e7eb",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {getCellValue(item, col.key)}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default WorkDashboard;