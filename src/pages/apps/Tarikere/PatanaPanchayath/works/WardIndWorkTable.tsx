import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFileExcel, FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";

import { AppDispatch } from "../../../../../redux/store";
import {
  fetchIndividualByWard,
  createWardIndWork,
  updateWardIndWork,
  deleteWardIndWork,
  wardIndWorkSelector,
} from "../../../../../api/wardindwork";
import { fetchWardById, wardSelector } from "../../../../../api/ward";

/* ─────────────────────────────────────────── TYPES */
type IndItem = {
  _id?: string;
  name: string;
  mobile: string;
  scheme: string;
  address: string;
  orderNumber: string;
  Reference: string;
};

const EMPTY_FORM: IndItem = {
  name: "",
  mobile: "",
  scheme: "",
  address: "",
  orderNumber: "",
  Reference: "",
};

/* ─────────────────────────────────────────── PDF LOADER */
function PdfLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
      background: "rgba(255,255,255,0.90)", backdropFilter: "blur(5px)",
    }}>
      <div style={{
        width: 48, height: 48, border: "4px solid #dbeafe", borderTopColor: "#2466d1",
        borderRadius: "50%", animation: "ward-ind-spin 0.75s linear infinite",
      }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a3d7c" }}>PDF ತಯಾರಾಗುತ್ತಿದೆ...</span>
    </div>
  );
}

/* ─────────────────────────────────────────── DELETE MODAL */
function DeleteModal({
  open, onClose, onConfirm,
}: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="ward-ind-overlay" onClick={onClose}>
      <div className="ward-ind-modal ward-ind-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="ward-ind-modal-icon ward-ind-icon-danger"><FiTrash2 size={22} /></div>
        <h2 className="ward-ind-modal-title" style={{ color: "#dc2626" }}>ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h2>
        <p className="ward-ind-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="ward-ind-modal-actions">
          <button className="ward-ind-btn ward-ind-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button className="ward-ind-btn ward-ind-btn-danger" onClick={() => { onConfirm(); onClose(); }}>ಅಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── FORM MODAL */
function FormModal({
  open, onClose, editData, onSave,
}: {
  open: boolean;
  onClose: () => void;
  editData: IndItem | null;
  onSave: (f: IndItem) => void;
}) {
  const [form, setForm] = useState<IndItem>(EMPTY_FORM);

  useEffect(() => {
    setForm(editData ? { ...editData } : EMPTY_FORM);
  }, [editData, open]);

  const set = (k: keyof IndItem, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;

  return (
    <div className="ward-ind-overlay" onClick={onClose}>
      <div className="ward-ind-modal ward-ind-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="ward-ind-modal-header">
          <div className="ward-ind-modal-icon ward-ind-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="ward-ind-modal-title">
            {editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="ward-ind-form-grid">
          <div className="ward-ind-field">
            <label>ಹೆಸರು <span className="ward-ind-required">*</span></label>
            <input
              placeholder="ಸಂಪೂರ್ಣ ಹೆಸರು"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="ward-ind-field">
            <label>ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</label>
            <input
              placeholder="10 ಅಂಕಿ ಸಂಖ್ಯೆ"
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
            />
          </div>

          <div className="ward-ind-field">
            <label>ಯೋಜನೆ <span className="ward-ind-required">*</span></label>
            <input
              placeholder="ಯೋಜನೆ ಹೆಸರು"
              value={form.scheme}
              onChange={(e) => set("scheme", e.target.value)}
            />
          </div>

          <div className="ward-ind-field">
            <label>ಆದೇಶ ಸಂಖ್ಯೆ</label>
            <input
              placeholder="Order Number"
              value={form.orderNumber}
              onChange={(e) => set("orderNumber", e.target.value)}
            />
          </div>

          <div className="ward-ind-field ward-ind-full">
            <label>ವಿಳಾಸ</label>
            <textarea
              rows={3}
              placeholder="ಸಂಪೂರ್ಣ ವಿಳಾಸ"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>

          <div className="ward-ind-field ward-ind-full">
            <label>ಷರಾ</label>
            <textarea
              rows={3}
              placeholder="Reference"
              value={form.Reference}
              onChange={(e) => set("Reference", e.target.value)}
            />
          </div>
        </div>

        <div className="ward-ind-modal-actions">
          <button className="ward-ind-btn ward-ind-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="ward-ind-btn ward-ind-btn-primary"
            onClick={() => {
              if (!form.name || !form.scheme) return;
              onSave(form);
            }}
          >
            ಉಳಿಸಿ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── MAIN */
export default function WardIndividualWorksTable({ wardId }: { wardId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [], loading } = useSelector(wardIndWorkSelector);
  const { current: ward }     = useSelector(wardSelector);

  const [search, setSearch]           = useState("");
  const [openModal, setOpenModal]     = useState(false);
  const [editData, setEditData]       = useState<IndItem | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [isPdf, setIsPdf]             = useState(false);
  const [pdfLoading, setPdfLoading]   = useState(false);

  useEffect(() => {
    if (wardId) {
      dispatch(fetchIndividualByWard(wardId));
      dispatch(fetchWardById(wardId));
    }
  }, [wardId, dispatch]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    return (list as IndItem[]).filter((item) => {
      if (!q) return true;
      return [item.name, item.scheme, item.mobile, item.orderNumber, item.address, item.Reference]
        .join(" ").toLowerCase().includes(q);
    });
  }, [list, search]);

  /* ── SAVE */
  const handleSave = (form: IndItem) => {
    const payload = { ...form, ward: wardId };
    if (editData?._id) {
      dispatch(updateWardIndWork(editData._id, payload));
    } else {
      dispatch(createWardIndWork(payload));
    }
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = () => {
    if (!deleteId) return;
    dispatch(deleteWardIndWork(deleteId, wardId));
    setDeleteId(null);
  };

  /* ── EXCEL */
  const exportExcel = () => {
    const title   = `${ward?.name || ""} ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ`;
    const dateStr = new Date().toLocaleDateString("en-IN");

    const headerRow = [
      "ಕ್ರ.ಸಂ", "ವಾರ್ಡ್", "ಹೆಸರು", "ಯೋಜನೆ",
      "ಆದೇಶ ಸಂಖ್ಯೆ", "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", "ವಿಳಾಸ", "ಷರಾ",
    ];

    const dataRows = filtered.map((item, i) => [
      i + 1,
      ward?.name || "",
      item.name,
      item.scheme,
      item.orderNumber,
      item.mobile,
      item.address,
      item.Reference,
    ]);

    const aoa = [
      [title],
      [`ದಿನಾಂಕ: ${dateStr}`, "", "", "", "", `ಒಟ್ಟು ದಾಖಲೆ: ${filtered.length}`],
      [],
      headerRow,
      ...dataRows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 7 }, { wch: 16 }, { wch: 22 }, { wch: 28 },
      { wch: 18 }, { wch: 16 }, { wch: 32 }, { wch: 24 },
    ];
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳು");
    XLSX.writeFile(wb, `${ward?.name || "Ward"}_ವೈಯಕ್ತಿಕ_ಫಲಾನುಭವಿಗಳು.xlsx`);
  };

  /* ── PDF */
  const exportPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 800));
    await document.fonts.ready;
    const element = document.getElementById("ward-ind-pdf-area");
    if (!element) { setIsPdf(false); setPdfLoading(false); return; }
    try {
      const h2p = await import("html2pdf.js");
      const html2pdf = (h2p as any).default ?? h2p;
      await (html2pdf() as any).from(element).set({
        margin: [8, 6, 8, 6],
        filename: `${ward?.name || "Ward"}_ವೈಯಕ್ತಿಕ_ಫಲಾನುಭವಿಗಳು.pdf`,
        image:       { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, letterRendering: true },
        jsPDF:       { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak:   { mode: ["avoid-all", "css"] },
      }).save();
    } finally {
      setIsPdf(false);
      setPdfLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes ward-ind-spin     { to { transform: rotate(360deg); } }
        @keyframes ward-ind-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes ward-ind-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .ward-ind-root {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 100%;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER */
        .ward-ind-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 12px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .ward-ind-header-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; margin-bottom: 6px;
        }
        .ward-ind-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ward-ind-title span { color: #2466d1; }

        .ward-ind-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .ward-ind-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ── FILTERS */
        .ward-ind-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .ward-ind-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .ward-ind-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .ward-ind-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc;
          box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ward-ind-search-wrap input:focus {
          border-color: #2466d1;
          box-shadow: 0 0 0 3px rgba(36,102,209,0.1);
          background: #fff;
        }
        .ward-ind-export-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .ward-ind-btn-excel, .ward-ind-btn-pdf {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 7px; border: none;
          cursor: pointer; font-size: 12.5px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
        }
        .ward-ind-btn-excel { background: #16a34a; color: #fff; }
        .ward-ind-btn-excel:hover:not(:disabled) { background: #15803d; }
        .ward-ind-btn-pdf   { background: #dc2626; color: #fff; }
        .ward-ind-btn-pdf:hover:not(:disabled)   { background: #b91c1c; }
        .ward-ind-btn-excel:disabled,
        .ward-ind-btn-pdf:disabled { opacity: 0.4; cursor: not-allowed; }
        .ward-ind-btn-excel:active,
        .ward-ind-btn-pdf:active   { transform: scale(0.97); }

        /* ── STATS */
        .ward-ind-stats {
          display: flex; gap: 10px; padding: 8px 12px;
          flex-shrink: 0; flex-wrap: wrap;
        }
        .ward-ind-stat-chip {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .ward-ind-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ── TABLE WRAP */
        .ward-ind-table-wrap {
          flex: 1;
          min-height: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 0 8px 8px;
          overflow: hidden;
        }

        /* ── SCROLL CONTAINER */
        .ward-ind-scroll {
          flex: 1 1 0;
          min-height: 0;
          overflow-x: auto;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          background: #fff;
          scrollbar-width: thin;
          scrollbar-color: #c5c5c5 transparent;
        }
        .ward-ind-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .ward-ind-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── PDF MODE */
        .ward-ind-pdf-print { width: 100%; background: #fff; }

        /* ── TABLE */
        .ward-ind-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; table-layout: fixed;
          page-break-inside: auto;
        }
        .ward-ind-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact;
          line-height: 1.4;
        }
        .ward-ind-table thead th.th-left { text-align: left; }
        .ward-ind-table tbody tr {
          animation: ward-ind-fade-in 0.25s ease forwards;
          page-break-inside: avoid; break-inside: avoid;
        }
        .ward-ind-table tbody tr:nth-child(even) { background: #f8faff; }
        .ward-ind-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }
        .ward-ind-table tbody td {
          border: 1px solid #D4D4D4; padding: 8px 9px;
          font-size: 13px; color: #262626;
          line-height: 1.55; vertical-align: middle; word-break: break-word;
        }
        .ward-ind-table tbody td.td-center { text-align: center; }
        .ward-ind-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }

        .ward-ind-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .ward-ind-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .ward-ind-actions { display: flex; justify-content: center; gap: 10px; }
        .ward-ind-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .ward-ind-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .ward-ind-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .ward-ind-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }

        /* ── PDF TITLE */
        .ward-ind-pdf-title {
          text-align: center; margin-bottom: 14px;
          padding: 10px 12px 12px;
          border-bottom: 2.5px solid #2466d1;
          background: linear-gradient(135deg, #eef4ff 0%, #fff 100%);
        }
        .ward-ind-pdf-title h2 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1a3d7c; }
        .ward-ind-pdf-title p  { font-size: 10.5px; margin: 0; color: #4b5563; }

        /* ── OVERLAY / MODAL */
        .ward-ind-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px;
          animation: ward-ind-fade-in 0.15s ease;
        }
        .ward-ind-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: ward-ind-slide-up 0.2s ease;
          max-height: 90vh; overflow-y: auto;
        }
        .ward-ind-modal-sm { max-width: 400px; text-align: center; }
        .ward-ind-modal-lg { max-width: 560px; }
        .ward-ind-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .ward-ind-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ward-ind-icon-primary { background: #eff6ff; color: #2466d1; }
        .ward-ind-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .ward-ind-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .ward-ind-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .ward-ind-modal-actions {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9;
        }

        /* ── FORM */
        .ward-ind-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ward-ind-field { display: flex; flex-direction: column; gap: 5px; }
        .ward-ind-field.ward-ind-full { grid-column: 1 / -1; }
        .ward-ind-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .ward-ind-required { color: #ef4444; }
        .ward-ind-field input, .ward-ind-field textarea {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;
        }
        .ward-ind-field input:focus, .ward-ind-field textarea:focus {
          border-color: #2466d1;
          box-shadow: 0 0 0 3px rgba(36,102,209,0.12);
          background: #fff;
        }

        /* ── BUTTONS */
        .ward-ind-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .ward-ind-btn:active { transform: scale(0.97); }
        .ward-ind-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .ward-ind-btn-primary:hover { opacity: 0.9; }
        .ward-ind-btn-ghost  { background: #f1f5f9; color: #64748b; }
        .ward-ind-btn-ghost:hover { background: #e2e8f0; }
        .ward-ind-btn-danger { background: #dc2626; color: #fff; }
        .ward-ind-btn-danger:hover { background: #b91c1c; }

        /* ── RESPONSIVE */
        @media (max-width: 600px) {
          .ward-ind-form-grid { grid-template-columns: 1fr; }
          .ward-ind-field.ward-ind-full { grid-column: 1 / -1; }
          .ward-ind-title { font-size: 13px; }
        }

        /* ── PRINT */
        @media print {
          html, body { height: auto !important; }
          .ward-ind-scroll { overflow: visible !important; max-height: none !important; }
          .ward-ind-table thead th {
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="ward-ind-root">
        <PdfLoader visible={pdfLoading} />

        {/* ── HEADER */}
        <div className="ward-ind-header">
          <div className="ward-ind-header-top">
            <h1 className="ward-ind-title">
              <span>{ward?.name || ""}</span>{ward?.name ? " ವಾರ್ಡ್ " : ""}ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ
            </h1>
            <button
              className="ward-ind-add-btn"
              onClick={() => { setEditData(null); setOpenModal(true); }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="ward-ind-filters">
            <div className="ward-ind-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ಹೆಸರು, ಯೋಜನೆ, ಮೊಬೈಲ್)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="ward-ind-export-btns">
              <button className="ward-ind-btn-excel" onClick={exportExcel} disabled={!filtered.length}>
                <FaFileExcel /> Excel
              </button>
              <button className="ward-ind-btn-pdf" onClick={exportPDF} disabled={pdfLoading || !filtered.length}>
                <FaFilePdf /> {pdfLoading ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS */}
        <div className="ward-ind-stats">
          <div className="ward-ind-stat-chip">
            ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong>
          </div>
          {search && (
            <div className="ward-ind-stat-chip">
              ಫಿಲ್ಟರ್: <strong>"{search}"</strong>
            </div>
          )}
        </div>

        {/* ── TABLE */}
        <div className="ward-ind-table-wrap">
          <div
            id="ward-ind-pdf-area"
            className={isPdf ? "ward-ind-pdf-print" : "ward-ind-scroll"}
          >
            {isPdf && (
              <div className="ward-ind-pdf-title">
                <h2>{ward?.name || ""} ವಾರ್ಡ್ ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ</h2>
                <p>
                  ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")}
                  &nbsp;|&nbsp; ಒಟ್ಟು ದಾಖಲೆ: {filtered.length}
                </p>
              </div>
            )}

            <table className="ward-ind-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: isPdf ? "18%" : 170 }} />
                <col style={{ width: isPdf ? "22%" : 200 }} />
                <col style={{ width: isPdf ? "11%" : 100 }} />
                <col style={{ width: isPdf ? "12%" : 120 }} />
                <col style={{ width: isPdf ? "18%" : 180 }} />
                <col style={{ width: isPdf ? "19%" : 170 }} />
                {!isPdf && <col style={{ width: 72 }} />}
              </colgroup>

              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ಹೆಸರು</th>
                  <th className="th-left">ಯೋಜನೆ</th>
                  <th>ಮೊಬೈಲ್</th>
                  <th>ಆದೇಶ ಸಂಖ್ಯೆ</th>
                  <th className="th-left">ವಿಳಾಸ</th>
                  <th className="th-left">ಷರಾ</th>
                  {!isPdf && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr className="ward-ind-empty">
                    <td colSpan={isPdf ? 7 : 8}>ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr className="ward-ind-empty">
                    <td colSpan={isPdf ? 7 : 8}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                )}
                {!loading && filtered.map((item, i) => (
                  <tr key={item._id}>
                    <td className="td-num">{i + 1}</td>
                    <td>{item.name || "—"}</td>
                    <td>{item.scheme || "—"}</td>
                    <td className="td-center">{item.mobile || "—"}</td>
                    <td className="td-center">{item.orderNumber || "—"}</td>
                    <td>{item.address || "—"}</td>
                    <td>{item.Reference || "—"}</td>
                    {!isPdf && (
                      <td className="ward-ind-action-cell">
                        <div className="ward-ind-actions">
                          <FiEdit
                            size={16}
                            className="ward-ind-edit-btn"
                            onClick={() => { setEditData(item); setOpenModal(true); }}
                          />
                          <FiTrash2
                            size={16}
                            className="ward-ind-del-btn"
                            onClick={() => setDeleteId(item._id!)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── MODALS */}
        <FormModal
          open={openModal}
          onClose={() => { setOpenModal(false); setEditData(null); }}
          editData={editData}
          onSave={handleSave}
        />
        <DeleteModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
}