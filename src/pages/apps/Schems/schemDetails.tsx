import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import {
  fetchAllMainSchemData,
  schemSelector,
  createMainSchemData,
  updateMainSchemData,
  deleteMainSchemData,
} from "../../../api/schemdata";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaArrowLeft, FaFileExcel, FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";

import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

/* ─────────────────────────────────────────── TYPES */
type Props = { schemId: string; onBack: () => void };

type DataType = {
  _id?: string;
  year: string;
  administrative_department: string;
  work_description: string;
  implementation_department: string;
  amount: string;
  remark: string;
  status: string;
};

const EMPTY_FORM: DataType = {
  year: "",
  administrative_department: "",
  work_description: "",
  implementation_department: "",
  amount: "",
  remark: "",
  status: "",
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
        borderRadius: "50%", animation: "sd-spin 0.75s linear infinite",
      }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a3d7c" }}>PDF ತಯಾರಾಗುತ್ತಿದೆ...</span>
    </div>
  );
}

/* ─────────────────────────────────────────── DELETE MODAL */
function DeleteModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="sd-overlay" onClick={onClose}>
      <div className="sd-modal sd-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="sd-modal-icon sd-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="sd-modal-title" style={{ color: "#dc2626" }}>ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h2>
        <p className="sd-modal-desc">ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.</p>
        <div className="sd-modal-actions">
          <button className="sd-btn sd-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button className="sd-btn sd-btn-danger" onClick={() => { onConfirm(); onClose(); }}>ಅಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── FORM MODAL */
function FormModal({
  open, onClose, editData, onSave,
}: { open: boolean; onClose: () => void; editData: DataType | null; onSave: (f: DataType) => void }) {
  const [form, setForm] = useState<DataType>(EMPTY_FORM);

  useEffect(() => { setForm(editData ? { ...editData } : EMPTY_FORM); }, [editData, open]);

  const set = (k: keyof DataType, v: string) => setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="sd-overlay" onClick={onClose}>
      <div className="sd-modal sd-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="sd-modal-header">
          <div className="sd-modal-icon sd-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="sd-modal-title">{editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}</h2>
        </div>
        <div className="sd-form-grid">
          <div className="sd-field">
            <label>ವರ್ಷ <span className="sd-required">*</span></label>
            <input placeholder="2024-25" value={form.year} onChange={(e) => set("year", e.target.value)} />
          </div>
          <div className="sd-field">
            <label>ಆಡಳಿತ ಇಲಾಖೆ</label>
            <input placeholder="ಆಡಳಿತ ಇಲಾಖೆ" value={form.administrative_department} onChange={(e) => set("administrative_department", e.target.value)} />
          </div>
          <div className="sd-field sd-full">
            <label>ಕಾಮಗಾರಿಯ ವಿವರಣೆ <span className="sd-required">*</span></label>
            <textarea rows={3} placeholder="ಕಾಮಗಾರಿಯ ವಿವರಣೆ ನಮೂದಿಸಿ..." value={form.work_description} onChange={(e) => set("work_description", e.target.value)} />
          </div>
          <div className="sd-field">
            <label>ಅನುಷ್ಠಾನ ಇಲಾಖೆ</label>
            <input placeholder="ಅನುಷ್ಠಾನ ಇಲಾಖೆ" value={form.implementation_department} onChange={(e) => set("implementation_department", e.target.value)} />
          </div>
          <div className="sd-field">
            <label>ಮೊತ್ತ</label>
            <input placeholder="0.00" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div className="sd-field sd-full">
            <label>ಷರಾ</label>
            <textarea rows={2} placeholder="ಷರಾ / ಟಿಪ್ಪಣಿ" value={form.remark} onChange={(e) => set("remark", e.target.value)} />
          </div>
          <div className="sd-field sd-full">
            <label>Status</label>
            <input placeholder="ಕೆಲಸ ನಡೆಯುತ್ತಿದೆ / ಪೂರ್ಣಗೊಂಡಿದೆ..." value={form.status} onChange={(e) => set("status", e.target.value)} />
          </div>
        </div>
        <div className="sd-modal-actions">
          <button className="sd-btn sd-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button
            className="sd-btn sd-btn-primary"
            onClick={() => { if (!form.year || !form.work_description) return; onSave(form); }}
          >ಉಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── MAIN */
export default function SchemDetails({ schemId, onBack }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { mainData = [], current } = useSelector(schemSelector);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => { dispatch(fetchAllMainSchemData(schemId)); }, [dispatch, schemId]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return (mainData || []).filter((d: DataType) => {
      const matchYear = !yearFilter || (d.year || "").includes(yearFilter);
      const matchSearch = !q || [
        d.work_description, d.administrative_department,
        d.implementation_department, d.remark, d.status, d.year,
      ].some((v) => (v || "").toLowerCase().includes(q));
      return matchYear && matchSearch;
    });
  }, [mainData, search, yearFilter]);

  /* ── SAVE */
  const handleSave = async (form: DataType) => {
    if (editData) {
      await dispatch(updateMainSchemData(editData._id!, { ...form, schem: schemId }) as any);
    } else {
      await dispatch(createMainSchemData({ ...form, schem: schemId }) as any);
    }
    dispatch(fetchAllMainSchemData(schemId));
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteMainSchemData(deleteId, schemId) as any);
    dispatch(fetchAllMainSchemData(schemId));
    setDeleteId(null);
  };

  /* ── EXCEL */
  const exportExcel = () => {
    const title = current?.name || "Scheme";
    const dateStr = new Date().toLocaleDateString("en-IN");

    // Row 1: Title
    // Row 2: Date + total
    // Row 3: blank
    // Row 4: headers
    // Row 5+: data
    // Last: total row

    const headerRow = [
      "ಕ್ರ.ಸಂ", "ವರ್ಷ", "ಆಡಳಿತ ಇಲಾಖೆ", "ಕಾಮಗಾರಿಯ ವಿವರಣೆ",
      "ಮೊತ್ತ (₹)", "ಅನುಷ್ಠಾನ ಇಲಾಖೆ", "ಷರಾ", "Status",
    ];

    const dataRows = filtered.map((item: DataType, i: number) => [
      i + 1,
      item.year,
      item.administrative_department,
      item.work_description,
      parseFloat(item.amount || "0"),
      item.implementation_department,
      item.remark,
      item.status,
    ]);

    const totalRow = [
      "", "", "", "ಒಟ್ಟು ಮೊತ್ತ →",
      formattedAmount, "", "", "",
    ];

    const aoa = [
      [`${title} - ಅನುದಾನದ ವಿವರಗಳು`],
      [`ದಿನಾಂಕ: ${dateStr}`, "", "", "", `ಒಟ್ಟು ದಾಖಲೆ: ${filtered.length}`],
      [],
      headerRow,
      ...dataRows,
      [],
      totalRow,
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);

    /* column widths */
    ws["!cols"] = [
      { wch: 7 },
      { wch: 10 },
      { wch: 22 },
      { wch: 48 },
      { wch: 14 },
      { wch: 22 },
      { wch: 28 },
      { wch: 18 },
    ];

    /* merge title row A1:H1 */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31));
    XLSX.writeFile(wb, `${title}.xlsx`);
  };

  /* ── PDF */
  const exportPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 700));
    await document.fonts.ready;
    const element = document.getElementById("schem-pdf-table");
    if (!element) { setIsPdf(false); setPdfLoading(false); return; }
    try {
      await (html2pdf() as any).from(element).set({
        margin: [8, 6, 8, 6],
        filename: `${current?.name || "Scheme"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css"] },
      }).save();
    } finally {
      setIsPdf(false);
      setPdfLoading(false);
    }
  };

  /* ── unique years for filter dropdown */
  const years = useMemo((): string[] => {
    const s = new Set((mainData || []).map((d: DataType) => d.year).filter(Boolean));
    return Array.from(s) as string[];
  }, [mainData]);

  /* ── total amount */
  const totalAmount = useMemo(() =>
    filtered.reduce((acc: number, d: DataType) => acc + (parseFloat(d.amount) || 0), 0),
    [filtered]);

       const formattedAmount = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format(totalAmount);

  return (
    <>
      <style>{`
        /* ───── KEYFRAMES */
        @keyframes sd-spin { to { transform: rotate(360deg); } }
        @keyframes sd-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes sd-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        /* ───── ROOT */
        .sd-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 158px);
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ───── HEADER */
        .sd-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px 10px;
          flex-shrink: 0;
          position: sticky; top: 0; z-index: 30;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }

        .sd-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }

        .sd-back-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          border: none; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .sd-back-btn:hover { transform: scale(1.08); box-shadow: 0 4px 12px rgba(36,102,209,0.4); }

        .sd-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .sd-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28);
          flex-shrink: 0;
        }
        .sd-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ───── FILTERS ROW */
        .sd-filters {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }

        .sd-search-wrap {
          position: relative; flex: 1 1 160px; min-width: 0;
        }
        .sd-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .sd-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc;
          box-sizing: border-box;
        }
        .sd-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        .sd-year-select {
          padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 13px; outline: none; background: #f8fafc; cursor: pointer;
          min-width: 100px;
        }
        .sd-year-select:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); }

        .sd-export-btns { display: flex; gap: 6px; flex-shrink: 0; }

        .sd-btn-excel, .sd-btn-pdf {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 7px;
          border: none; cursor: pointer; font-size: 12.5px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .sd-btn-excel { background: #16a34a; color: #fff; }
        .sd-btn-excel:hover:not(:disabled) { background: #15803d; }
        .sd-btn-pdf   { background: #dc2626; color: #fff; }
        .sd-btn-pdf:hover:not(:disabled) { background: #b91c1c; }
        .sd-btn-excel:disabled, .sd-btn-pdf:disabled { opacity: 0.4; cursor: not-allowed; }
        .sd-btn-excel:active, .sd-btn-pdf:active { transform: scale(0.97); }

        /* ───── STATS BAR */
        .sd-stats {
          display: flex; gap: 10px; padding: 8px 14px 0;
          flex-shrink: 0; flex-wrap: wrap;
        }
        .sd-stat-chip {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .sd-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ───── TABLE WRAP */
        .sd-table-wrap {
          flex: 1; margin: 8px 0 0; overflow: hidden;
          display: flex; flex-direction: column;
          padding: 0 0 8px;
        }

        .sd-scroll {
          flex: 1; overflow-x: auto; overflow-y: auto;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          background: #fff;
          max-height: calc(100vh - 280px);
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .sd-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .sd-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ───── TABLE */
        .sd-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; table-layout: fixed;
          page-break-inside: auto;
        }

        .sd-table colgroup col:first-child { width: 48px; }

        .sd-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          line-height: 1.4;
        }
        .sd-table thead th.th-left { text-align: left; }

        .sd-table tbody tr {
          animation: sd-fade-in 0.25s ease forwards;
          page-break-inside: avoid; break-inside: avoid;
        }
        .sd-table tbody tr:nth-child(even) { background: #f8faff; }
        .sd-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }

        .sd-table tbody td {
          border: 1px solid #D4D4D4;
          padding: 8px 9px;
          font-size: 13px; color: #262626; line-height: 1.55;
          vertical-align: middle; word-break: break-word;
        }
        .sd-table tbody td.td-center { text-align: center; }
        .sd-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .sd-table tbody td.td-amount { font-weight: 600; color: #15803d; white-space: nowrap; }

        .sd-status-badge {
          display: inline-block; padding: 2px 8px; border-radius: 12px;
          font-size: 11px; font-weight: 600;
          background: #eff6ff; color: #1d4ed8;
          border: 1px solid #bfdbfe;
          white-space: normal; word-break: break-word; text-align: center;
        }

        .sd-empty td {
          text-align: center; padding: 48px 0;
          color: #94a3b8; font-size: 14px;
        }

        .sd-action-cell {
          text-align: center; width: 72px; min-width: 72px;
        }
        .sd-actions { display: flex; justify-content: center; gap: 10px; }

        .sd-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .sd-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .sd-del-btn { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .sd-del-btn:hover { color: #b91c1c; transform: scale(1.2); }

        /* ───── PDF TITLE */
        .sd-pdf-title {
          text-align: center; margin-bottom: 14px;
          padding: 10px 12px 12px;
          border-bottom: 2.5px solid #2466d1;
          background: linear-gradient(135deg, #eef4ff 0%, #fff 100%);
        }
        .sd-pdf-title h2 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1a3d7c; }
        .sd-pdf-title p  { font-size: 10.5px; margin: 0; color: #4b5563; }

        /* ───── MODALS */
        .sd-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px;
          animation: sd-fade-in 0.15s ease;
        }

        .sd-modal {
          background: #fff; border-radius: 16px;
          padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: sd-slide-up 0.2s ease;
          max-height: 90vh; overflow-y: auto;
        }
        .sd-modal-sm { max-width: 400px; text-align: center; }
        .sd-modal-lg { max-width: 580px; }

        .sd-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }

        .sd-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sd-icon-primary { background: #eff6ff; color: #2466d1; }
        .sd-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }

        .sd-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .sd-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }

        .sd-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        /* ───── FORM */
        .sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .sd-field { display: flex; flex-direction: column; gap: 5px; }
        .sd-field.sd-full { grid-column: 1 / -1; }

        .sd-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .sd-required { color: #ef4444; }

        .sd-field input,
        .sd-field textarea,
        .sd-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none;
          font-family: inherit; color: #1e293b;
        }
        .sd-field input:focus,
        .sd-field textarea:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff; }

        /* ───── BUTTONS (modal) */
        .sd-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
        }
        .sd-btn:active { transform: scale(0.97); }
        .sd-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .sd-btn-primary:hover { opacity: 0.9; }
        .sd-btn-ghost { background: #f1f5f9; color: #64748b; }
        .sd-btn-ghost:hover { background: #e2e8f0; }
        .sd-btn-danger { background: #dc2626; color: #fff; }
        .sd-btn-danger:hover { background: #b91c1c; }

        /* ───── RESPONSIVE */
        @media (max-width: 600px) {
          .sd-form-grid { grid-template-columns: 1fr; }
          .sd-field.sd-full { grid-column: 1 / -1; }
          .sd-filters { gap: 6px; }
          .sd-title { font-size: 13px; }
        }

        /* ───── PRINT */
        @media print {
          html, body { height: auto !important; }
          .sd-scroll { overflow: visible !important; max-height: none !important; }
          .sd-table thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="sd-root">
        <PdfLoader visible={pdfLoading} />

        {/* ── HEADER */}
        <div className="sd-header">
          <div className="sd-header-top">
            <button className="sd-back-btn" onClick={onBack} title="ಹಿಂದೆ ಹೋಗಿ">
              <FaArrowLeft size={14} />
            </button>
            <h1 className="sd-title">{current?.name || "ಅನುದಾನದ ವಿವರಗಳು"}</h1>
            <button className="sd-add-btn" onClick={() => { setEditData(null); setOpenModal(true); }}>
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="sd-filters">
            <div className="sd-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ, ಷರಾ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="sd-year-select"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            >
              <option value="">ಎಲ್ಲಾ ವರ್ಷ</option>
              {years.map((y: string) => <option key={y} value={y}>{y}</option>)}
            </select>

            <div className="sd-export-btns">
              <button
                className="sd-btn-excel"
                onClick={exportExcel}
                disabled={!filtered.length}
              >
                <FaFileExcel /> Excel
              </button>
              <button
                className="sd-btn-pdf"
                onClick={exportPDF}
                disabled={pdfLoading || !filtered.length}
              >
                <FaFilePdf /> {pdfLoading ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS BAR */}
        <div className="sd-stats">
          <div className="sd-stat-chip">ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong></div>
          <div className="sd-stat-chip">ಒಟ್ಟು ಮೊತ್ತ: <strong>  {formattedAmount.toLocaleString()}</strong></div>
          {search && <div className="sd-stat-chip">ಫಿಲ್ಟರ್: <strong>"{search}"</strong></div>}
        </div>

        {/* ── TABLE */}
        <div className="sd-table-wrap">
          <div
            id="schem-pdf-table"
            className={isPdf ? "" : "sd-scroll"}
            style={isPdf ? {} : {}}
          >
            {isPdf && (
              <div className="sd-pdf-title">
                <h2>{current?.name || "ಅನುದಾನದ ವಿವರಗಳು"}</h2>
                <p>ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")} &nbsp;|&nbsp; ಒಟ್ಟು ದಾಖಲೆ: {filtered.length} &nbsp;|&nbsp; ಒಟ್ಟು ಮೊತ್ತ: ₹ {formattedAmount.toLocaleString()}</p>
              </div>
            )}

            <table className="sd-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: isPdf ? "7%" : 70 }} />
                <col style={{ width: isPdf ? "12%" : 120 }} />
                <col style={{ width: isPdf ? "30%" : 300 }} />
                <col style={{ width: isPdf ? "9%" : 90 }} />
                <col style={{ width: isPdf ? "14%" : 120 }} />
                <col style={{ width: isPdf ? "14%" : 140 }} />
                <col style={{ width: isPdf ? "12%" : 110 }} />
                {!isPdf && <col style={{ width: 72 }} />}
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ವರ್ಷ</th>
                  <th className="th-left">ಆಡಳಿತ ಇಲಾಖೆ</th>
                  <th className="th-left">ಕಾಮಗಾರಿಯ ವಿವರಣೆ</th>
                  <th>ಮೊತ್ತ (₹)</th>
                  <th className="th-left">ಅನುಷ್ಠಾನ ಇಲಾಖೆ</th>
                  <th className="th-left">ಷರಾ</th>
                  <th>Status</th>
                  {!isPdf && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="sd-empty">
                    <td colSpan={isPdf ? 8 : 9}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered.map((d: DataType, i: number) => (
                    <tr key={d._id}>
                      <td className="td-num">{i + 1}</td>
                      <td>{d.year}</td>
                      <td>{d.administrative_department}</td>
                      <td>{d.work_description}</td>
                       <td className="td-amount">₹ {parseFloat(d.amount || "0").toLocaleString("en-IN", {})}</td>
                      <td>{d.implementation_department}</td>
                      <td>{d.remark}</td>
                      <td className="td-center">
                        {d.status ? <span className="sd-status-badge">{d.status}</span> : "—"}
                      </td>
                      {!isPdf && (
                        <td className="sd-action-cell">
                          <div className="sd-actions">
                            <FiEdit
                              size={16} className="sd-edit-btn"
                              onClick={() => { setEditData(d); setOpenModal(true); }}
                            />
                            <FiTrash2
                              size={16} className="sd-del-btn"
                              onClick={() => setDeleteId(d._id!)}
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
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