import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { fetchConsolidatedManavi, manaviSelector } from "../../../../api/manavi";
import { fetchAllpatana, patanaSelector } from "../../../../api/patana";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* ─────────────────────────────────────────── CONSTANTS */
const WORK_OPTIONS: Record<string, string[]> = {
  ಸಮುದಾಯ: [
    "ರಸ್ತೆ ಕಾಮಗಾರಿ","ಚರಂಡಿ ಕಾಮಗಾರಿ","ಜಲ್ಲಿ ಮೆಟ್ಲಿಂಗ್","ದೇವಾಲಯ",
    "ಸಮುದಾಯ ಭವನ","ಶಾಲೆ","ಕಾಲೇಜು","ಅಂಗನವಾಡಿ","ಚೆಕ್ ಡ್ಯಾಮ್",
    "ಸೇತುವೆ ಕಾಮಗಾರಿ","ಸ್ಮಶಾನ","ಕುಡಿಯುವ ನೀರು","ಸೋಲಾರ್‌/ಹೈಮಾಸ್ಟ್‌ ಲೈಟ್",
    "ಹಕ್ಕುಪತ್ರ ವಿತರಣೆ","ಕೆರೆ ಅಭಿವೃದ್ಧಿ","ಇತರೆ",
  ],
  ವೈಯಕ್ತಿಕ: [
    "ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿ","ಈರುಳ್ಳಿ ಶೆಡ್","ಗಂಗಾ ಕಲ್ಯಾಣ","ನೇರಸಾಲ",
    "ಉದ್ಯಮ ಶೀಲತಾ","ಸ್ವಾವಲಂಬಿ ಸಾರಥಿ","ವಿದ್ಯುತ್ ಪರಿವರ್ತಕ (TC)","ಉದ್ಯೋಗಿನಿ",
    "ತ್ರಿಚಕ್ರ ವಾಹನ","ಅಮೃತ ಸಿರಿ","ಕೌ ಮ್ಯಾಟ್","ಹೊಲಿಗೆ ಯಂತ್ರ",
    "ಅಡಿಕೆ ಸಂಸ್ಕರಣೆ ಘಟಕ","ನಾಮಿನಿ ಮೆಂಬರ್ಸ್","ಕುರಿ ಲೋನ್ Veternary Department",
    "ಶ್ರಮಶಕ್ತಿ ಯೋಜನೆ","ವೃತ್ತಿ ಪ್ರೋತ್ಸಾಹ","ಕಾರ್ಮಿಕ ಇಲಾಖೆಯ ಕಿಟ್ ಸೌಲಭ್ಯ",
    "ಹೊರಗುತ್ತಿಗೆ ಕೆಲಸ","ಬಗರ್‌ ಹುಕ್ಕುಂ","ಪಿಂಚಣಿ ಯೋಜನೆಗಳು","ಇತರೆ",
  ],
};

/* ─────────────────────────────────────────── CARD */
const Card = ({
  title,
  data,
  expandedCard,
  setExpandedCard,
  isMobile,
}: any) => {
  const isOpen = Array.isArray(expandedCard)
    ? expandedCard.includes(title)
    : expandedCard === title;

  const toggle = () => {
    if (isMobile) {
      setExpandedCard((prev: any) => {
        const arr = Array.isArray(prev) ? prev : [];
        return arr.includes(title)
          ? arr.filter((t: string) => t !== title)
          : [...arr, title];
      });
    } else {
      setExpandedCard(isOpen ? null : title);
    }
  };

  return (
    <div className={`mv-card ${isOpen ? "mv-card-open" : ""}`}>
      <div className="mv-card-header" onClick={toggle}>
        <span className="mv-card-title">{title}</span>
        <span className="mv-card-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      <div className={`mv-card-body ${isOpen ? "mv-card-body-open" : ""}`}>
        <div className="mv-card-scroll">
          {data?.length ? (
            data.map((item: any, i: number) => (
              <div key={i} className="mv-card-row">
                <span className="mv-card-label">{item._id}</span>
                <span className="mv-card-count">{item.count}</span>
              </div>
            ))
          ) : (
            <p className="mv-card-empty">ಡೇಟಾ ಇಲ್ಲ</p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────── MAIN */
const ManaviDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { consolidated, loading } = useSelector(manaviSelector);
  const { list: all_patana } = useSelector(patanaSelector);

  const [expandedCard, setExpandedCard] = useState<string | string[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    type: "", work: "", patana: "", hobli: "", gp: "", village: "",
  });

  /* ── RESIZE */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setExpandedCard(isMobile ? [] : null);
  }, [isMobile]);

  /* ── FETCH */
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchConsolidatedManavi(filters));
    }, 400);
    return () => clearTimeout(delay);
  }, [filters]);

  useEffect(() => {
    dispatch(fetchAllpatana());
  }, []);

  /* ── HANDLERS */
  const handleChange = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const handleTypeChange = (value: string) =>
    setFilters((prev) => ({ ...prev, type: value, work: "" }));

  const handleReset = () => {
    setFilters({ type: "", work: "", patana: "", hobli: "", gp: "", village: "" });
    setSearch("");
  };

  /* ── FILTER */
  const filteredList = useMemo(() => {
    const list = consolidated?.list || [];
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter((item: any) =>
      [item.work, item.type, item.description, item.gpName,
       item.villageName, item.wardName, item.patanaName]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [search, consolidated]);

  /* ── EXCEL */
  const downloadExcel = () => {
    const data = filteredList.map((m: any, i: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": i + 1,
      "ಗ್ರಾಮ ಪಂಚಾಯತ್": m?.source === "WARD" ? m?.patanaName || "Ward Area" : m?.gpName || "-",
      "ಗ್ರಾಮ": m?.source === "WARD" ? m?.wardName || "-" : m?.villageName || "-",
      "ಕೆಲಸ": m.work, "ಪ್ರಕಾರ": m.type, "ವಿವರಣೆ": m.description,
      "ಜಾತಿ": m.caste, "Refrence": m.refer, "Status": m.status,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), "Manavi_Report.xlsx");
  };

  /* ── PDF */
  const handlePdfDownload = async () => {
    const element = document.getElementById("mv-pdf-area");
    if (!element) return;
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 800));
    const h2p = await import("html2pdf.js");
    const html2pdf = (h2p as any).default ?? h2p;
    (html2pdf() as any)
      .from(element)
      .set({
        margin: 5,
        filename: "ಕ್ರೋಡಿಕೃತ ಮನವಿಗಳ ವರದಿ.pdf",
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .save()
      .then(() => setIsPdf(false));
  };

  const CARDS = [
    { title: "ತಾಲ್ಲೂಕು ಪ್ರಕಾರ",       data: consolidated?.patanaWise },
    { title: "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಪ್ರಕಾರ", data: consolidated?.gpWise },
    { title: "ಗ್ರಾಮ ಪ್ರಕಾರ",           data: consolidated?.villageWise },
    { title: "ವಾರ್ಡ್ ಪ್ರಕಾರ",          data: consolidated?.wardWise },
  ];

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes mv-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes mv-spin { to { transform: rotate(360deg); } }

        /* ── ROOT */
        .mv-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 150px);
          min-height: 0; overflow: hidden;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
        }

        /* ── HEADER */
        .mv-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 8px 12px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
          display: flex; flex-direction: column; gap: 8px;
        }

        /* ── TOP ROW */
        .mv-header-top {
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px;
          flex-wrap: wrap;
        }
        .mv-title {
          font-size: 14px; font-weight: 700; color: #1a3d7c;
          white-space: nowrap; flex-shrink: 0;
        }
        .mv-title span { color: #2466d1; }

        /* ── FILTER ROW */
        .mv-filter-row {
          display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
        }
        .mv-select {
          padding: 6px 8px; border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 12px; outline: none; background: #f8fafc; cursor: pointer;
          font-family: inherit; color: #1e293b;
          min-width: 0; flex: 1 1 110px; max-width: 160px;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .mv-select:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); }

        .mv-reset-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 5px 10px; border-radius: 8px;
          background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; cursor: pointer;
          font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .mv-reset-btn:hover { background: #dc2626; color: #fff; }

        /* ── CARDS */
        .mv-cards-mobile {
          display: flex; gap: 8px;
          overflow-x: auto; padding-bottom: 2px;
          scrollbar-width: none;
        }
        .mv-cards-mobile::-webkit-scrollbar { display: none; }
        .mv-cards-mobile > * { flex-shrink: 0; width: 75vw; }

        .mv-cards-desktop { display: none; grid-template-columns: repeat(4, 1fr); gap: 8px; }

        @media (min-width: 768px) {
          .mv-cards-mobile { display: none; }
          .mv-cards-desktop { display: grid; }
        }

        /* ── CARD */
        .mv-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
          overflow: hidden; transition: box-shadow 0.15s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .mv-card-open { box-shadow: 0 4px 16px rgba(36,102,209,0.12); border-color: #bfdbfe; }
        .mv-card-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 10px; cursor: pointer;
          background: linear-gradient(135deg, #eff6ff, #f0fdfa);
          user-select: none;
        }
        .mv-card-title { font-size: 12px; font-weight: 700; color: #1a3d7c; }
        .mv-card-arrow { font-size: 10px; color: #94a3b8; }
        .mv-card-body {
          max-height: 0; overflow: hidden;
          transition: max-height 0.3s ease;
        }
        .mv-card-body-open {
          max-height: 180px;
          border-top: 1px solid #e2e8f0;
        }
        .mv-card-scroll { padding: 6px; overflow-y: auto; max-height: 180px; }
        .mv-card-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 4px 6px; border-radius: 6px; margin-bottom: 2px; background: #f8fafc;
        }
        .mv-card-row:hover { background: #eff6ff; }
        .mv-card-label {
          font-size: 11px; color: #374151; flex: 1; min-width: 0;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .mv-card-count {
          font-size: 10px; font-weight: 700;
          background: #dbeafe; color: #1d4ed8;
          padding: 1px 7px; border-radius: 20px; flex-shrink: 0; margin-left: 4px;
        }
        .mv-card-empty { font-size: 11px; color: #94a3b8; text-align: center; padding: 8px; }

        /* ── HEADER */
        .mv-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 6px 10px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
          display: flex; flex-direction: column; gap: 6px;
        }

        /* ── ONE ROW — title + filters + search + total + buttons */
        .mv-control-row {
          display: flex; align-items: center; gap: 5px;
          overflow-x: auto; flex-wrap: nowrap;
          scrollbar-width: none;
        }
        .mv-control-row::-webkit-scrollbar { display: none; }

        .mv-title {
          font-size: 12px; font-weight: 700; color: #1a3d7c;
          white-space: nowrap; flex-shrink: 0;
        }
        .mv-title span { color: #2466d1; }

        .mv-divider {
          width: 1px; height: 18px; background: #e2e8f0;
          flex-shrink: 0;
        }

        .mv-select {
          padding: 5px 4px; border: 1px solid #e2e8f0; border-radius: 7px;
          font-size: 11px; outline: none; background: #f8fafc; cursor: pointer;
          font-family: inherit; color: #1e293b;
          flex-shrink: 0; width: 90px;
          transition: border-color 0.15s;
        }
        .mv-select:focus { border-color: #2466d1; }

        .mv-reset-btn {
          display: inline-flex; align-items: center;
          padding: 4px 6px; border-radius: 6px;
          background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; cursor: pointer;
          font-size: 10.5px; font-weight: 700; white-space: nowrap; flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
        }
        .mv-reset-btn:hover { background: #dc2626; color: #fff; }

        .mv-search-inline {
          position: relative; flex: 1 1 70px; min-width: 40px;
        }
        .mv-search-inline svg {
          position: absolute; left: 7px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none;
        }
        .mv-search-inline input {
          width: 100%; padding: 5px 6px 5px 23px;
          border: 1px solid #e2e8f0; border-radius: 14px;
          font-size: 11px; outline: none; background: #f8fafc;
          box-sizing: border-box; transition: border-color 0.15s;
        }
        .mv-search-inline input:focus { border-color: #2466d1; background: #fff; }

        .mv-total-chip {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; padding: 4px 8px; border-radius: 6px;
          font-size: 10.5px; font-weight: 700; white-space: nowrap; flex-shrink: 0;
        }

        .mv-export-btns { display: flex; gap: 4px; flex-shrink: 0; }
        .mv-btn-excel, .mv-btn-pdf {
          display: inline-flex; align-items: center;
          padding: 4px 7px; border-radius: 6px;
          border: none; cursor: pointer; font-size: 10.5px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
        }
        .mv-btn-excel { background: #16a34a; color: #fff; }
        .mv-btn-excel:hover { background: #15803d; }
        .mv-btn-pdf   { background: #dc2626; color: #fff; }
        .mv-btn-pdf:hover { background: #b91c1c; }
        .mv-btn-excel:active, .mv-btn-pdf:active { transform: scale(0.97); }

        @media (min-width: 768px) {
          .mv-header { padding: 8px 14px; gap: 8px; }
          .mv-title { font-size: 15px; }
          .mv-select { width: 130px; font-size: 12.5px; padding: 6px 8px; }
          .mv-search-inline input { font-size: 12.5px; padding: 6px 8px 6px 28px; }
          .mv-search-inline { flex: 1 1 180px; }
          .mv-total-chip { font-size: 12.5px; padding: 5px 12px; border-radius: 8px; }
          .mv-btn-excel, .mv-btn-pdf { font-size: 12.5px; padding: 6px 12px; border-radius: 7px; }
          .mv-reset-btn { font-size: 12px; padding: 5px 10px; }
        }

        /* ── TABLE WRAP */
        .mv-table-wrap {
          flex: 1; min-height: 0;
          display: flex; flex-direction: column;
          padding: 3px 0px 4px;
        }
        .mv-scroll {
          flex: 1; min-height: 0;
          overflow-x: auto; overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .mv-scroll::-webkit-scrollbar { height: 5px; width: 5px; }
        .mv-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── TABLE */
        .mv-table {
          width: 100%;
          min-width: 960px;
          border-collapse: collapse;
          table-layout: fixed;
        }
        .mv-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 11.5px; font-weight: 700;
          padding: 9px 7px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact;
          line-height: 1.4;
        }
        .mv-table thead th.th-left { text-align: left; }
        .mv-table tbody tr { animation: mv-fade-in 0.25s ease forwards; }
        .mv-table tbody tr:nth-child(even) { background: #f8faff; }
        .mv-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }
        .mv-table tbody tr.mv-ward-row { background: #fefce8; }
        .mv-table tbody tr.mv-ward-row:hover { background: #fef9c3; }
        .mv-table tbody td {
          border: 1px solid #D4D4D4; padding: 6px 7px;
          font-size: 12px; color: #262626; line-height: 1.4;
          vertical-align: middle;
          overflow: hidden;
          word-break: break-word;
          white-space: normal;
        }
        .mv-table tbody td.td-vivara {
          min-width: 200px;
          max-width: 260px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: break-word;
          line-height: 1.5;
        }
        .mv-table tbody td.td-center { text-align: center; }
        .mv-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .mv-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 13px; }

        /* ── PDF */
        .mv-pdf-title {
          text-align: center; margin-bottom: 12px;
          padding: 10px; border-bottom: 2px solid #2466d1;
        }
        .mv-pdf-title h2 { font-size: 17px; font-weight: 700; margin: 0 0 4px; color: #1a3d7c; }
        .mv-pdf-title p  { font-size: 11px; margin: 0; color: #4b5563; }

        /* ── LOADING */
        .mv-loading {
          text-align: center; padding: 20px;
          font-size: 13px; color: #64748b;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .mv-spin {
          width: 18px; height: 18px;
          border: 3px solid #dbeafe; border-top-color: #2466d1;
          border-radius: 50%; animation: mv-spin 0.7s linear infinite;
          display: inline-block;
        }

 /* ── DEFAULT */
.mv-mobile-only { display: none; }
.mv-desktop-only { display: flex; }

/* ── MOBILE */
@media (max-width: 767px) {
  .mv-mobile-only { display: block; }
  .mv-desktop-only { display: none; }

  .mv-title-row {
    margin-bottom: 4px;
  }

  .mv-filter-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }

  .mv-search-row {
  display: flex;
  justify-content: space-between;
    width: 100%;
    padding-bottom: 10px;
  }

  .mv-search-full {
    width: 100%;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    font-size: 12px;
  }

  .mv-action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
  }
}

        /* ── RESPONSIVE TABLE WRAP */

        @media print {
          .mv-scroll { overflow: visible !important; max-height: none !important; }
          .mv-table thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="mv-root">

        {/* ── HEADER */}
     <div className="mv-header">

  {/* ───────── DESKTOP (OLD VIEW) */}
  <div className="mv-control-row mv-desktop-only">
    <h1 className="mv-title">
      <span>ಕ್ರೋಡಿಕೃತ</span> ಮನವಿಗಳು
    </h1>

    <div className="mv-divider" />

    <select
      className="mv-select"
      value={filters.type}
      onChange={(e) => handleTypeChange(e.target.value)}
    >
      <option value="">ಎಲ್ಲಾ ವಿಧ</option>
      <option value="ವೈಯಕ್ತಿಕ">ವೈಯಕ್ತಿಕ</option>
      <option value="ಸಮುದಾಯ">ಸಮುದಾಯ</option>
    </select>

    <select
      className="mv-select"
      value={filters.work}
      onChange={(e) => handleChange("work", e.target.value)}
      disabled={!filters.type}
    >
      <option value="">ಎಲ್ಲಾ ಕೆಲಸ</option>
      {(WORK_OPTIONS[filters.type] || []).map((w) => (
        <option key={w} value={w}>{w}</option>
      ))}
    </select>

    {(filters.type || filters.work || search) && (
      <button className="mv-reset-btn" onClick={handleReset}>✕</button>
    )}

    <div className="mv-divider" />

    <div className="mv-search-inline">
      <input
        placeholder="ಹುಡುಕಿ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="mv-total-chip">
      {filteredList?.length ?? consolidated?.total ?? 0}
    </div>

    <div className="mv-export-btns">
      <button className="mv-btn-excel" onClick={downloadExcel}>Excel</button>
      <button className="mv-btn-pdf" onClick={handlePdfDownload}>PDF</button>
    </div>
  </div>


  {/* ───────── MOBILE (NEW VIEW) */}
  <div className="mv-mobile-only">

    {/* TITLE */}
    <div className="mv-title-row">
      <h1 className="mv-title">
        <span>ಕ್ರೋಡಿಕೃತ</span> ಮನವಿಗಳು
      </h1>
    </div>

    {/* FILTER */}
    <div className="mv-filter-row">
      <select
        className="mv-select"
        value={filters.type}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value="">ಎಲ್ಲಾ ವಿಧ</option>
        <option value="ವೈಯಕ್ತಿಕ">ವೈಯಕ್ತಿಕ</option>
        <option value="ಸಮುದಾಯ">ಸಮುದಾಯ</option>
      </select>

      <select
        className="mv-select"
        value={filters.work}
        onChange={(e) => handleChange("work", e.target.value)}
        disabled={!filters.type}
      >
        <option value="">ಎಲ್ಲಾ ಕೆಲಸ</option>
        {(WORK_OPTIONS[filters.type] || []).map((w) => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>

      {(filters.type || filters.work || search) && (
        <button className="mv-reset-btn" onClick={handleReset}>✕</button>
      )}

       <div className="mv-total-chip">
        {filteredList?.length ?? consolidated?.total ?? 0}
      </div>
    </div>

    {/* SEARCH */}
    <div className="mv-search-row">
      <div>
      <input
        className="mv-search-full"
        placeholder="ಹುಡುಕಿ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

     </div>
     

      <div className="mv-export-btns">
        <button className="mv-btn-excel" onClick={downloadExcel}>Excel</button>
        <button className="mv-btn-pdf" onClick={handlePdfDownload}>PDF</button>
      </div>
    
    </div>

    

  </div>

</div>

        {/* ── TABLE */}
        <div className="mv-table-wrap">
          <div id="mv-pdf-area" className={isPdf ? "" : "mv-scroll"}>
            {isPdf && (
              <div className="mv-pdf-title">
                <h2>ಕ್ರೋಡಿಕೃತ ಮನವಿಗಳ ವರದಿ</h2>
                <p>
                  ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")}
                  &nbsp;|&nbsp; ಒಟ್ಟು: {filteredList?.length ?? 0}
                </p>
              </div>
            )}

            <table className="mv-table">
              <colgroup>
                <col style={{ width: 40 }} />
                <col style={{ width: isPdf ? "13%" : 120 }} />
                <col style={{ width: isPdf ? "10%" : 105 }} />
                <col style={{ width: isPdf ? "8%"  : 78  }} />
                <col style={{ width: isPdf ? "13%" : 100 }} />
                <col style={{ width: isPdf ? "22%" : 220 }} />
                <col style={{ width: isPdf ? "10%" : 55  }} />
                <col style={{ width: isPdf ? "10%" : 95  }} />
                <col style={{ width: isPdf ? "9%"  : 85  }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ಗ್ರಾಮ ಪಂಚಾಯತಿ</th>
                  <th className="th-left">ಗ್ರಾಮ</th>
                  <th className="th-left">ಪ್ರಕಾರ</th>
                  <th className="th-left">ಕೆಲಸ</th>
                  <th className="th-left">ವಿವರಣೆ</th>
                  <th>ಜಾತಿ</th>
                  <th>Reference</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9}>
                      <div className="mv-loading">
                        <span className="mv-spin" /> ಲೋಡ್ ಆಗುತ್ತಿದೆ...
                      </div>
                    </td>
                  </tr>
                ) : filteredList?.length === 0 ? (
                  <tr className="mv-empty">
                    <td colSpan={9}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filteredList.map((item: any, i: number) => (
                    <tr
                      key={item._id ?? i}
                      className={item.source === "WARD" ? "mv-ward-row" : ""}
                    >
                      <td className="td-num">{i + 1}</td>
                      <td>
                        {item?.source === "WARD"
                          ? item?.patanaName || "Ward Area"
                          : item?.gpName || "—"}
                      </td>
                      <td>
                        {item?.source === "WARD"
                          ? item?.wardName || "—"
                          : item?.villageName || "—"}
                      </td>
                      <td>{item.type}</td>
                      <td>{item.work}</td>
                      <td className="td-vivara">{item.description}</td>
                      <td className="td-center">{item.caste}</td>
                      <td className="td-center">{item.refer}</td>
                      <td className="td-center">{item.status}</td>
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

export default ManaviDashboard;