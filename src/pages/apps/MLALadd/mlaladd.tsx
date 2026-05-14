import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchAllMLALADD,
  createMLALADD,
  updateMLALADD,
  deleteMLALADD,
  mlaladdSelector,
} from "../../../api/mlaladd";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFileExcel, FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { generatePDF } from "../../../utils/pdf";

/* ─────────────────────────────────────────── TYPES */
type MLAItem = {
  _id?: string;
  year: string;
  phase: string;
  work_description: string;
  amount: string;
  department: string;
  remark: string;
  status: string;
};

const EMPTY_FORM: MLAItem = {
  year: "", phase: "1ನೇ ಕಂತು", work_description: "",
  amount: "", department: "", remark: "", status: "",
};

const PHASES = ["1ನೇ ಕಂತು", "2ನೇ ಕಂತು", "3ನೇ ಕಂತು", "4ನೇ ಕಂತು"];

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
        borderRadius: "50%", animation: "ml-spin 0.75s linear infinite",
      }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a3d7c" }}>PDF ತಯಾರಾಗುತ್ತಿದೆ...</span>
    </div>
  );
}

/* ─────────────────────────────────────────── DELETE MODAL */
function DeleteModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <div className="ml-overlay" onClick={onClose}>
      <div className="ml-modal ml-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="ml-modal-icon ml-icon-danger"><FiTrash2 size={22} /></div>
        <h2 className="ml-modal-title" style={{ color: "#dc2626" }}>ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h2>
        <p className="ml-modal-desc">ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.</p>
        <div className="ml-modal-actions">
          <button className="ml-btn ml-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button className="ml-btn ml-btn-danger" onClick={() => { onConfirm(); onClose(); }}>ಅಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── FORM MODAL */
function FormModal({
  open, onClose, editData, onSave,
}: { open: boolean; onClose: () => void; editData: MLAItem | null; onSave: (f: MLAItem) => void }) {
  const [form, setForm] = useState<MLAItem>(EMPTY_FORM);

  useEffect(() => { setForm(editData ? { ...editData } : EMPTY_FORM); }, [editData, open]);

  const set = (k: keyof MLAItem, v: string) => setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="ml-overlay" onClick={onClose}>
      <div className="ml-modal ml-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="ml-modal-header">
          <div className="ml-modal-icon ml-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="ml-modal-title">{editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}</h2>
        </div>

        <div className="ml-form-grid">
          <div className="ml-field">
            <label>ವರ್ಷ <span className="ml-required">*</span></label>
            <input placeholder="2024-25" value={form.year} onChange={(e) => set("year", e.target.value)} />
          </div>
          <div className="ml-field">
            <label>ಕಂತು</label>
            <select value={form.phase} onChange={(e) => set("phase", e.target.value)}>
              {PHASES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="ml-field ml-full">
            <label>ಕಾಮಗಾರಿಯ ವಿವರಣೆ <span className="ml-required">*</span></label>
            <textarea rows={3} placeholder="ಕಾಮಗಾರಿಯ ವಿವರಣೆ ನಮೂದಿಸಿ..." value={form.work_description} onChange={(e) => set("work_description", e.target.value)} />
          </div>
          <div className="ml-field">
            <label>ಅನುಷ್ಠಾನ ಇಲಾಖೆ</label>
            <input placeholder="ಇಲಾಖೆ" value={form.department} onChange={(e) => set("department", e.target.value)} />
          </div>
          <div className="ml-field">
            <label>ಮೊತ್ತ (₹)</label>
            <input placeholder="0.00" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div className="ml-field ml-full">
            <label>ಷರಾ</label>
            <textarea rows={2} placeholder="ಷರಾ / ಟಿಪ್ಪಣಿ" value={form.remark} onChange={(e) => set("remark", e.target.value)} />
          </div>
          <div className="ml-field ml-full">
            <label>Status</label>
            <input placeholder="ಕೆಲಸ ನಡೆಯುತ್ತಿದೆ / ಪೂರ್ಣಗೊಂಡಿದೆ..." value={form.status} onChange={(e) => set("status", e.target.value)} />
          </div>
        </div>

        <div className="ml-modal-actions">
          <button className="ml-btn ml-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button
            className="ml-btn ml-btn-primary"
            onClick={() => { if (!form.year || !form.work_description) return; onSave(form); }}
          >ಉಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── MAIN */
export default function MLALADDPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(mlaladdSelector);

  const [search, setSearch]           = useState("");
  const [yearFilter, setYearFilter]   = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [openModal, setOpenModal]     = useState(false);
  const [editData, setEditData]       = useState<MLAItem | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [isPdf, setIsPdf]             = useState(false);
  const [pdfLoading, setPdfLoading]   = useState(false);

  useEffect(() => { dispatch(fetchAllMLALADD()); }, [dispatch]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const clean = (v: unknown) => (v || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
    const q = clean(search);
    return (list as MLAItem[]).filter((item) => {
      const matchSearch = q.length < 1 || [
        item.year, item.phase, item.department,
        item.work_description, item.remark, item.amount, item.status,
      ].some((v) => clean(v).includes(q));
      return (
        (!yearFilter  || clean(item.year)  === clean(yearFilter)) &&
        (!phaseFilter || clean(item.phase) === clean(phaseFilter)) &&
        matchSearch
      );
    });
  }, [list, search, yearFilter, phaseFilter]);

  /* ── SAVE */
  const handleSave = async (form: MLAItem) => {
    const payload = { ...form, amount: parseFloat(form.amount || "0") };
    if (editData) await dispatch(updateMLALADD(editData._id!, payload) as any);
    else await dispatch(createMLALADD(payload) as any);
    dispatch(fetchAllMLALADD());
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteMLALADD(deleteId) as any);
    dispatch(fetchAllMLALADD());
    setDeleteId(null);
  };

  /* ── total amount */
  const totalAmount = useMemo(() =>
    filtered.reduce((acc, d) => acc + (parseFloat(d.amount) || 0), 0),
    [filtered]);

    const formattedAmount = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format(totalAmount);

    
  /* ── unique years */
  const years = useMemo((): string[] => {
    const s = new Set((list as MLAItem[]).map((d) => d.year).filter(Boolean));
    return Array.from(s) as string[];
  }, [list]);

  /* ── EXCEL */
  const exportExcel = () => {
    const title = "MLA-LAD ಕಾಮಗಾರಿಗಳು";
    const dateStr = new Date().toLocaleDateString("en-IN");

    const headerRow = ["ಕ್ರ.ಸಂ", "ವರ್ಷ", "ಕಂತು", "ಕಾಮಗಾರಿಯ ಹೆಸರು", "ಮೊತ್ತ (₹)", "ಅನುಷ್ಠಾನ ಇಲಾಖೆ", "ಷರಾ", "Status"];

    const dataRows = filtered.map((item, i) => [
      i + 1, item.year, item.phase, item.work_description,
      parseFloat(item.amount || "0"), item.department, item.remark, item.status,
    ]);

    const aoa = [
      [title],
      [`ದಿನಾಂಕ: ${dateStr}`, "", "", "", `ಒಟ್ಟು ದಾಖಲೆ: ${filtered.length}`],
      [],
      headerRow,
      ...dataRows,
      [],
      ["", "", "", "ಒಟ್ಟು ಮೊತ್ತ →", formattedAmount, "", "", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 7 }, { wch: 10 }, { wch: 12 }, { wch: 48 },
      { wch: 14 }, { wch: 22 }, { wch: 28 }, { wch: 18 },
    ];
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MLALADD");
    XLSX.writeFile(wb, "MLALADD.xlsx");
  };

  /* ── PDF */
  const exportPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 800));
    await document.fonts.ready;
    const element = document.getElementById("mlaladd-pdf");
    if (!element) { setIsPdf(false); setPdfLoading(false); return; }
    try {
      await generatePDF(element, {
        filename: "MLALADD.pdf",
        margin: [8, 6, 8, 6],
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css"] },
      });
    } finally {
      setIsPdf(false);
      setPdfLoading(false);
    }
  };

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes ml-spin { to { transform: rotate(360deg); } }
        @keyframes ml-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes ml-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        /* ── ROOT */
        .ml-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER */
        .ml-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .ml-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }
        .ml-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ml-title span { color: #2466d1; }

        .ml-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28);
          flex-shrink: 0;
        }
        .ml-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ── FILTERS */
        .ml-filters {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        .ml-search-wrap {
          position: relative; flex: 1 1 160px; min-width: 0;
        }
        .ml-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .ml-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none;
          background: #f8fafc; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ml-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        .ml-select {
          padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 13px; outline: none; background: #f8fafc; cursor: pointer;
        }
        .ml-select:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); }
        .ml-select-year { min-width: 90px; }
        .ml-select-phase { min-width: 120px; }

        .ml-export-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .ml-btn-excel, .ml-btn-pdf {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 7px;
          border: none; cursor: pointer; font-size: 12.5px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
        }
        .ml-btn-excel { background: #16a34a; color: #fff; }
        .ml-btn-excel:hover:not(:disabled) { background: #15803d; }
        .ml-btn-pdf   { background: #dc2626; color: #fff; }
        .ml-btn-pdf:hover:not(:disabled) { background: #b91c1c; }
        .ml-btn-excel:disabled, .ml-btn-pdf:disabled { opacity: 0.4; cursor: not-allowed; }
        .ml-btn-excel:active, .ml-btn-pdf:active { transform: scale(0.97); }

        /* ── STATS */
        .ml-stats {
          display: flex; gap: 10px; padding: 8px 14px 0;
          flex-shrink: 0; flex-wrap: wrap;
        }
        .ml-stat-chip {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .ml-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ── TABLE WRAP */
        .ml-table-wrap {
          flex: 1; margin: 8px 0 0; min-height: 0;
          display: flex; flex-direction: column;
          padding: 0 0 8px;
        }
        .ml-scroll {
          flex: 1; min-height: 0;
          overflow-x: auto; overflow-y: auto;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          background: #fff;
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .ml-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .ml-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── TABLE */
        .ml-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; table-layout: fixed;
          page-break-inside: auto;
        }
        .ml-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact;
          line-height: 1.4;
        }
        .ml-table thead th.th-left { text-align: left; }

        .ml-table tbody tr {
          animation: ml-fade-in 0.25s ease forwards;
          page-break-inside: avoid; break-inside: avoid;
        }
        .ml-table tbody tr:nth-child(even) { background: #f8faff; }
        .ml-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }

        .ml-table tbody td {
          border: 1px solid #D4D4D4;
          padding: 8px 9px;
          font-size: 13px; color: #262626; line-height: 1.55;
          vertical-align: middle; word-break: break-word;
        }
        .ml-table tbody td.td-center { text-align: center; }
        .ml-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .ml-table tbody td.td-amount { font-weight: 600; color: #15803d; white-space: nowrap; }

        .ml-phase-badge {
          display: inline-block; padding: 2px 8px; border-radius: 12px;
          font-size: 11px; font-weight: 600;
          background: #f0fdf4; color: #15803d;
          border: 1px solid #bbf7d0; white-space: nowrap;
        }
        .ml-status-badge {
          display: inline-block; padding: 2px 8px; border-radius: 12px;
          font-size: 11px; font-weight: 600;
          background: #eff6ff; color: #1d4ed8;
          border: 1px solid #bfdbfe;
          white-space: normal; word-break: break-word; text-align: center;
        }

        .ml-empty td {
          text-align: center; padding: 48px 0;
          color: #94a3b8; font-size: 14px;
        }
        .ml-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .ml-actions { display: flex; justify-content: center; gap: 10px; }
        .ml-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .ml-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .ml-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .ml-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }

        /* ── PDF TITLE */
        .ml-pdf-title {
          text-align: center; margin-bottom: 14px;
          padding: 10px 12px 12px;
          border-bottom: 2.5px solid #2466d1;
          background: linear-gradient(135deg, #eef4ff 0%, #fff 100%);
        }
        .ml-pdf-title h2 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1a3d7c; }
        .ml-pdf-title p  { font-size: 10.5px; margin: 0; color: #4b5563; }

        /* ── OVERLAY / MODAL */
        .ml-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px;
          animation: ml-fade-in 0.15s ease;
        }
        .ml-modal {
          background: #fff; border-radius: 16px;
          padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: ml-slide-up 0.2s ease;
          max-height: 90vh; overflow-y: auto;
        }
        .ml-modal-sm { max-width: 400px; text-align: center; }
        .ml-modal-lg { max-width: 580px; }
        .ml-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .ml-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ml-icon-primary { background: #eff6ff; color: #2466d1; }
        .ml-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .ml-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .ml-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .ml-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        /* ── FORM */
        .ml-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ml-field { display: flex; flex-direction: column; gap: 5px; }
        .ml-field.ml-full { grid-column: 1 / -1; }
        .ml-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .ml-required { color: #ef4444; }
        .ml-field input, .ml-field textarea, .ml-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none;
          font-family: inherit; color: #1e293b;
        }
        .ml-field input:focus, .ml-field textarea:focus, .ml-field select:focus {
          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;
        }

        /* ── BUTTONS */
        .ml-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .ml-btn:active { transform: scale(0.97); }
        .ml-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .ml-btn-primary:hover { opacity: 0.9; }
        .ml-btn-ghost { background: #f1f5f9; color: #64748b; }
        .ml-btn-ghost:hover { background: #e2e8f0; }
        .ml-btn-danger { background: #dc2626; color: #fff; }
        .ml-btn-danger:hover { background: #b91c1c; }

        /* ── RESPONSIVE */
        @media (max-width: 600px) {
          .ml-form-grid { grid-template-columns: 1fr; }
          .ml-field.ml-full { grid-column: 1 / -1; }
          .ml-filters { gap: 6px; }
          .ml-title { font-size: 13px; }
        }

        /* ── PRINT */
        @media print {
          html, body { height: auto !important; }
          .ml-scroll { overflow: visible !important; max-height: none !important; }
          .ml-table thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="ml-root">
        <PdfLoader visible={pdfLoading} />

        {/* ── HEADER */}
        <div className="ml-header">
          <div className="ml-header-top">
            <h1 className="ml-title"><span>MLA-LAD</span> ಕಾಮಗಾರಿಗಳು</h1>
            <button className="ml-add-btn" onClick={() => { setEditData(null); setOpenModal(true); }}>
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="ml-filters">
            <div className="ml-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ, ಷರಾ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select className="ml-select ml-select-year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">ಎಲ್ಲಾ ವರ್ಷ</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            <select className="ml-select ml-select-phase" value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}>
              <option value="">ಎಲ್ಲಾ ಕಂತು</option>
              {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <div className="ml-export-btns">
              <button className="ml-btn-excel" onClick={exportExcel} disabled={!filtered.length}>
                <FaFileExcel /> Excel
              </button>
              <button className="ml-btn-pdf" onClick={exportPDF} disabled={pdfLoading || !filtered.length}>
                <FaFilePdf /> {pdfLoading ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS */}
        <div className="ml-stats">
          <div className="ml-stat-chip">ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong></div>
          <div className="ml-stat-chip">ಒಟ್ಟು ಮೊತ್ತ: <strong>{formattedAmount.toLocaleString()}</strong></div>
          {search && <div className="ml-stat-chip">ಫಿಲ್ಟರ್: <strong>"{search}"</strong></div>}
        </div>

        {/* ── TABLE */}
        <div className="ml-table-wrap">
          <div id="mlaladd-pdf" className={isPdf ? "" : "ml-scroll"}>
            {isPdf && (
              <div className="ml-pdf-title">
                <h2>MLA-LAD ಕಾಮಗಾರಿಗಳು</h2>
                <p>ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")} &nbsp;|&nbsp; ಒಟ್ಟು ದಾಖಲೆ: {filtered.length} &nbsp;|&nbsp; ಒಟ್ಟು ಮೊತ್ತ: {formattedAmount.toLocaleString()}</p>
              </div>
            )}

            <table className="ml-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: isPdf ? "7%" : 75 }} />
                <col style={{ width: isPdf ? "9%" : 95 }} />
                <col style={{ width: isPdf ? "30%" : 320 }} />
                <col style={{ width: isPdf ? "9%" : 85 }} />
                <col style={{ width: isPdf ? "12%" : 120 }} />
                <col style={{ width: isPdf ? "14%" : 140 }} />
                <col style={{ width: isPdf ? "10%" : 110 }} />
                {!isPdf && <col style={{ width: 72 }} />}
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ವರ್ಷ</th>
                  <th className="th-left">ಕಂತು</th>
                  <th className="th-left">ಕಾಮಗಾರಿಯ ಹೆಸರು</th>
                  <th>ಮೊತ್ತ </th>
                  <th className="th-left">ಅನುಷ್ಠಾನ ಇಲಾಖೆ</th>
                  <th className="th-left">ಷರಾ</th>
                  <th>Status</th>
                  {!isPdf && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="ml-empty">
                    <td colSpan={isPdf ? 8 : 9}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={item._id}>
                      <td className="td-num">{i + 1}</td>
                      <td>{item.year}</td>
                      <td className="td-center">
                        <span className="ml-phase-badge">{item.phase}</span>
                      </td>
                      <td>{item.work_description}</td>
                     <td className="td-amount">
  ₹ {parseFloat(item.amount || "0").toLocaleString("en-IN", {
  
  })}
</td>
                      <td>{item.department}</td>
                      <td>{item.remark}</td>
                      <td className="td-center">
                        {item.status ? <span className="ml-status-badge">{item.status}</span> : "—"}
                      </td>
                      {!isPdf && (
                        <td className="ml-action-cell">
                          <div className="ml-actions">
                            <FiEdit size={16} className="ml-edit-btn"
                              onClick={() => { setEditData(item); setOpenModal(true); }} />
                            <FiTrash2 size={16} className="ml-del-btn"
                              onClick={() => setDeleteId(item._id!)} />
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