import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFileExcel, FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";

import { AppDispatch } from "../../../../redux/store";
import {
  fetchCommunityByVillage,
  createCommunityWork,
  updateCommunityWork,
  deleteCommunityWork,
  communityWorkSelector,
} from "../../../../api/communitywork";
import { fetchVillageById, villageSelector } from "../../../../api/village";

/* ─────────────────────────────────────────── TYPES */
type ComItem = {
  _id?: string;
  workDetails: string;
  estimatedAmount: string;
  scheme: string;
  department: string;
  letterNumber: string;
  remarks: string;
};

const EMPTY_FORM: ComItem = {
  workDetails: "",
  estimatedAmount: "",
  scheme: "",
  department: "",
  letterNumber: "",
  remarks: "",
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
        borderRadius: "50%", animation: "com-spin 0.75s linear infinite",
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
    <div className="com-overlay" onClick={onClose}>
      <div className="com-modal com-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="com-modal-icon com-icon-danger"><FiTrash2 size={22} /></div>
        <h2 className="com-modal-title" style={{ color: "#dc2626" }}>ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h2>
        <p className="com-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="com-modal-actions">
          <button className="com-btn com-btn-ghost" onClick={onClose}>ರದ್ದುಮಾಡಿ</button>
          <button className="com-btn com-btn-danger" onClick={() => { onConfirm(); onClose(); }}>ಅಳಿಸಿ</button>
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
  editData: ComItem | null;
  onSave: (f: ComItem) => void;
}) {
  const [form, setForm] = useState<ComItem>(EMPTY_FORM);

  useEffect(() => {
    setForm(
      editData
        ? { ...editData, estimatedAmount: editData.estimatedAmount?.toString() || "" }
        : EMPTY_FORM
    );
  }, [editData, open]);

  const set = (k: keyof ComItem, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;

  return (
    <div className="com-overlay" onClick={onClose}>
      <div className="com-modal com-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="com-modal-header">
          <div className="com-modal-icon com-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="com-modal-title">
            {editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="com-form-grid">
          <div className="com-field com-full">
            <label>ಕಾಮಗಾರಿಯ ವಿವರ <span className="com-required">*</span></label>
            <textarea
              rows={3}
              placeholder="ಕಾಮಗಾರಿಯ ಸಂಪೂರ್ಣ ವಿವರ ನಮೂದಿಸಿ..."
              value={form.workDetails}
              onChange={(e) => set("workDetails", e.target.value)}
            />
          </div>

          <div className="com-field">
            <label>ಅಂದಾಜು ಮೊತ್ತ (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={form.estimatedAmount}
              onChange={(e) => set("estimatedAmount", e.target.value)}
            />
          </div>

          <div className="com-field">
            <label>ಯೋಜನೆ <span className="com-required">*</span></label>
            <input
              placeholder="ಯೋಜನೆ ಹೆಸರು"
              value={form.scheme}
              onChange={(e) => set("scheme", e.target.value)}
            />
          </div>

          <div className="com-field com-full">
            <label>ಅನುಷ್ಠಾನ ಇಲಾಖೆ</label>
            <input
              placeholder="ಇಲಾಖೆ ಹೆಸರು"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            />
          </div>

          <div className="com-field com-full">
            <label>ಪತ್ರ ಸಂಖ್ಯೆ</label>
            <input
              placeholder="Letter Number"
              value={form.letterNumber}
              onChange={(e) => set("letterNumber", e.target.value)}
            />
          </div>

          <div className="com-field com-full">
            <label>ಷರಾ / Remarks</label>
            <textarea
              rows={2}
              placeholder="ಷರಾ ಅಥವಾ ಟಿಪ್ಪಣಿ"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
            />
          </div>
        </div>

        <div className="com-modal-actions">
          <button className="com-btn com-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="com-btn com-btn-primary"
            onClick={() => {
              if (!form.workDetails || !form.scheme) return;
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
export default function CommunityWorksTable({ villageId }: { villageId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [], loading } = useSelector(communityWorkSelector);
  const { current: village }  = useSelector(villageSelector);

  const [search, setSearch]           = useState("");
  const [openModal, setOpenModal]     = useState(false);
  const [editData, setEditData]       = useState<ComItem | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [isPdf, setIsPdf]             = useState(false);
  const [pdfLoading, setPdfLoading]   = useState(false);

  useEffect(() => {
    if (villageId) {
      dispatch(fetchCommunityByVillage(villageId));
      dispatch(fetchVillageById(villageId));
    }
  }, [villageId, dispatch]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const q = (search || "").toLowerCase().trim();
    return (list as ComItem[]).filter((item) => {
      if (!q) return true;
      return [
        item.workDetails, item.scheme, item.department,
        item.letterNumber, item.remarks, item.estimatedAmount?.toString(),
      ].join(" ").toLowerCase().includes(q);
    });
  }, [list, search]);

  /* ── TOTAL AMOUNT */
  const totalAmount = useMemo(
    () => filtered.reduce((acc, d) => acc + (parseFloat(d.estimatedAmount) || 0), 0),
    [filtered]
  );

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
  }).format(totalAmount);

  /* ── SAVE */
  const handleSave = (form: ComItem) => {
    const payload = {
      ...form,
      village: villageId,
      estimatedAmount: Number(form.estimatedAmount) || 0,
    };
    if (editData?._id) {
      dispatch(updateCommunityWork(editData._id, payload));
    } else {
      dispatch(createCommunityWork(payload));
    }
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = () => {
    if (!deleteId) return;
    dispatch(deleteCommunityWork(deleteId, villageId));
    setDeleteId(null);
  };

  /* ── EXCEL */
  const exportExcel = () => {
    const title   = `${village?.name || ""} ಗ್ರಾಮದ ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು`;
    const dateStr = new Date().toLocaleDateString("en-IN");

    const headerRow = [
      "ಕ್ರ.ಸಂ", "ಗ್ರಾಮ", "ಕಾಮಗಾರಿಯ ವಿವರ",
      "ಅಂದಾಜು ಮೊತ್ತ (₹)", "ಯೋಜನೆ",
      "ಅನುಷ್ಠಾನ ಇಲಾಖೆ", "ಪತ್ರ ಸಂಖ್ಯೆ", "ಷರಾ",
    ];

    const dataRows = filtered.map((item, i) => [
      i + 1,
      village?.name || "",
      item.workDetails,
      parseFloat(item.estimatedAmount || "0"),
      item.scheme,
      item.department,
      item.letterNumber,
      item.remarks,
    ]);

    const aoa = [
      [title],
      [`ದಿನಾಂಕ: ${dateStr}`, "", "", "", `ಒಟ್ಟು ದಾಖಲೆ: ${filtered.length}`],
      [],
      headerRow,
      ...dataRows,
      [],
      ["", "", "ಒಟ್ಟು ಮೊತ್ತ →", formattedTotal, "", "", "", ""],
    ];

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [
      { wch: 7 }, { wch: 14 }, { wch: 40 }, { wch: 16 },
      { wch: 20 }, { wch: 22 }, { wch: 16 }, { wch: 24 },
    ];
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು");
    XLSX.writeFile(wb, `${village?.name || "Village"}_ಸಮುದಾಯ_ಕಾಮಗಾರಿ.xlsx`);
  };

  /* ── PDF */
  const exportPDF = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 800));
    await document.fonts.ready;
    const element = document.getElementById("com-pdf-area");
    if (!element) { setIsPdf(false); setPdfLoading(false); return; }
    try {
      const h2p = await import("html2pdf.js");
      const html2pdf = (h2p as any).default ?? h2p;
      await (html2pdf() as any).from(element).set({
        margin: [8, 6, 8, 6],
        filename: `${village?.name || "Village"}_ಸಮುದಾಯ_ಕಾಮಗಾರಿ.pdf`,
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
        @keyframes com-spin    { to { transform: rotate(360deg); } }
        @keyframes com-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes com-slide-up{ from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        /* ── ROOT
           calc(100vh - 158px) accounts for:
             ~60px  top navbar
             ~50px  page breadcrumb/header bar
             ~48px  tab switcher row
           Adjust the offset if your layout shell differs.
        ────────────────────────────────────────────────────────── */
        .com-root {
          display: flex;
          flex-direction: column;
  height: 100%;
  max-height: 100%;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        html, body, #root {
  height: 100%;
}

        /* ── HEADER – fixed height, never shrinks */
        .com-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 8px 12px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .com-header-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 8px; margin-bottom: 6px;
        }
        .com-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .com-title span { color: #2466d1; }

        .com-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .com-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ── FILTERS */
        .com-filters {
          display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
        }
        .com-search-wrap {
          position: relative; flex: 1 1 160px; min-width: 0;
        }
        .com-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .com-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc;
          box-sizing: border-box; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .com-search-wrap input:focus {
          border-color: #2466d1;
          box-shadow: 0 0 0 3px rgba(36,102,209,0.1);
          background: #fff;
        }

        .com-export-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .com-btn-excel, .com-btn-pdf {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 7px; border: none;
          cursor: pointer; font-size: 12.5px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s; white-space: nowrap;
        }
        .com-btn-excel { background: #16a34a; color: #fff; }
        .com-btn-excel:hover:not(:disabled) { background: #15803d; }
        .com-btn-pdf   { background: #dc2626; color: #fff; }
        .com-btn-pdf:hover:not(:disabled) { background: #b91c1c; }
        .com-btn-excel:disabled,
        .com-btn-pdf:disabled   { opacity: 0.4; cursor: not-allowed; }
        .com-btn-excel:active,
        .com-btn-pdf:active     { transform: scale(0.97); }

        /* ── STATS – fixed height, never shrinks */
        .com-stats {
          display: flex; gap: 10px; padding: 8px 12px;
          flex-shrink: 0; flex-wrap: wrap;
        }
        .com-stat-chip {
          background: #fff; border: 1px solid #e2e8f0;
          border-radius: 8px; padding: 5px 12px;
          font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .com-stat-chip strong { color: #1a3d7c; font-size: 13px; }
        .com-stat-chip.green strong { color: #15803d; }

        /* ── TABLE WRAP
           flex: 1 + min-height: 0 means "take all remaining vertical space
           but never force the parent to grow".  This is the key fix.
        ────────────────────────────────────────────────────────── */
        .com-table-wrap {
            flex: 1;
  min-height: 0;
  height: 100%;      /* CRITICAL – allows shrinking below content height */
          display: flex;
          flex-direction: column;
          padding: 0 8px 8px;
          overflow: hidden;     /* clip; actual scroll is on com-scroll */
        }

        /* ── SCROLL CONTAINER
           This is the element that actually scrolls.
           overflow-x: auto  → horizontal scroll when table is wider than viewport
           overflow-y: auto  → vertical scroll through rows
           flex: 1 + min-height: 0  → fills com-table-wrap without overflowing
        ────────────────────────────────────────────────────────── */
        .com-scroll {
          flex: 1 1 0;
          min-height: 0;          /* CRITICAL */
          overflow-x: auto;
          overflow-y: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          background: #fff;
          scrollbar-width: thin;
          scrollbar-color: #c5c5c5 transparent;
        }
        .com-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .com-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── PDF MODE wrapper – no scroll, expands fully for html2pdf */
        .com-pdf-area-print {
          width: 100%;
          background: #fff;
        }

        /* ── TABLE */
        .com-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; table-layout: fixed;
          page-break-inside: auto;
        }

        /* Sticky header – works because com-scroll is the scroll parent */
        .com-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
          white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact;
          line-height: 1.4;
        }
        .com-table thead th.th-left { text-align: left; }

        .com-table tbody tr {
          animation: com-fade-in 0.25s ease forwards;
          page-break-inside: avoid; break-inside: avoid;
        }
        .com-table tbody tr:nth-child(even) { background: #f8faff; }
        .com-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }

        .com-table tbody td {
          border: 1px solid #D4D4D4;
          padding: 8px 9px;
          font-size: 13px; color: #262626;
          line-height: 1.55; vertical-align: middle;
          word-break: break-word;
        }
        .com-table tbody td.td-center { text-align: center; }
        .com-table tbody td.td-num {
          font-weight: 700; color: #1a3d7c; text-align: center;
        }
        .com-table tbody td.td-amount {
          font-weight: 600; color: #15803d; white-space: nowrap;
        }

        .com-scheme-badge {
          display: inline-block; padding: 2px 8px; border-radius: 12px;
          font-size: 11px; font-weight: 600;
          background: #f0fdf4; color: #15803d;
          border: 1px solid #bbf7d0; white-space: nowrap;
        }

        .com-empty td {
          text-align: center; padding: 48px 0;
          color: #94a3b8; font-size: 14px;
        }
        .com-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .com-actions { display: flex; justify-content: center; gap: 10px; }
        .com-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .com-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .com-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .com-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }

        /* ── PDF TITLE */
        .com-pdf-title {
          text-align: center; margin-bottom: 14px;
          padding: 8px 10px 10px;
          border-bottom: 2.5px solid #2466d1;
          background: linear-gradient(135deg, #eef4ff 0%, #fff 100%);
        }
        .com-pdf-title h2 { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #1a3d7c; }
        .com-pdf-title p  { font-size: 10.5px; margin: 0; color: #4b5563; }

        /* ── OVERLAY / MODAL */
        .com-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px;
          animation: com-fade-in 0.15s ease;
        }
        .com-modal {
          background: #fff; border-radius: 16px;
          padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: com-slide-up 0.2s ease;
          max-height: 90vh; overflow-y: auto;
        }
        .com-modal-sm { max-width: 400px; text-align: center; }
        .com-modal-lg { max-width: 560px; }
        .com-modal-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 18px;
        }
        .com-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .com-icon-primary { background: #eff6ff; color: #2466d1; }
        .com-icon-danger  {
          background: #fef2f2; color: #dc2626;
          margin: 0 auto 10px; border-radius: 50%;
        }
        .com-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .com-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .com-modal-actions {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9;
        }

        /* ── FORM */
        .com-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .com-field { display: flex; flex-direction: column; gap: 5px; }
        .com-field.com-full { grid-column: 1 / -1; }
        .com-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .com-required { color: #ef4444; }
        .com-field input, .com-field textarea {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none;
          font-family: inherit; color: #1e293b;
        }
        .com-field input:focus, .com-field textarea:focus {
          border-color: #2466d1;
          box-shadow: 0 0 0 3px rgba(36,102,209,0.12);
          background: #fff;
        }

        /* ── BUTTONS */
        .com-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .com-btn:active { transform: scale(0.97); }
        .com-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .com-btn-primary:hover { opacity: 0.9; }
        .com-btn-ghost  { background: #f1f5f9; color: #64748b; }
        .com-btn-ghost:hover { background: #e2e8f0; }
        .com-btn-danger { background: #dc2626; color: #fff; }
        .com-btn-danger:hover { background: #b91c1c; }

        /* ── RESPONSIVE */
        @media (max-width: 600px) {
          .com-form-grid { grid-template-columns: 1fr; }
          .com-field.com-full { grid-column: 1 / -1; }
          .com-filters { gap: 6px; }
          .com-title { font-size: 13px; }
        }

        /* ── PRINT */
        @media print {
          html, body { height: auto !important; }
          .com-scroll { overflow: visible !important; max-height: none !important; }
          .com-table thead th {
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="com-root">
        <PdfLoader visible={pdfLoading} />

        {/* ── HEADER */}
        <div className="com-header">
          <div className="com-header-top">
            <h1 className="com-title">
              <span>{village?.name || ""}</span>{village?.name ? " ಗ್ರಾಮದ " : ""}ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು
            </h1>
            <button
              className="com-add-btn"
              onClick={() => { setEditData(null); setOpenModal(true); }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="com-filters">
            <div className="com-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ಕಾಮಗಾರಿ, ಯೋಜನೆ, ಇಲಾಖೆ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="com-export-btns">
              <button
                className="com-btn-excel"
                onClick={exportExcel}
                disabled={!filtered.length}
              >
                <FaFileExcel /> Excel
              </button>
              <button
                className="com-btn-pdf"
                onClick={exportPDF}
                disabled={pdfLoading || !filtered.length}
              >
                <FaFilePdf /> {pdfLoading ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}
              </button>
            </div>
          </div>
        </div>

        {/* ── STATS */}
        <div className="com-stats">
          <div className="com-stat-chip">
            ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong>
          </div>
          <div className="com-stat-chip green">
            ಒಟ್ಟು ಮೊತ್ತ: <strong>{formattedTotal}</strong>
          </div>
          {search && (
            <div className="com-stat-chip">
              ಫಿಲ್ಟರ್: <strong>"{search}"</strong>
            </div>
          )}
        </div>

        {/* ── TABLE */}
        <div className="com-table-wrap">
          <div
            id="com-pdf-area"
            className={isPdf ? "com-pdf-area-print" : "com-scroll"}
          >

            {isPdf && (
              <div className="com-pdf-title">
                <h2>{village?.name || ""} ಗ್ರಾಮದ ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು</h2>
                <p>
                  ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")}
                  &nbsp;|&nbsp; ಒಟ್ಟು ದಾಖಲೆ: {filtered.length}
                  &nbsp;|&nbsp; ಒಟ್ಟು ಮೊತ್ತ: {formattedTotal}
                </p>
              </div>
            )}

            <table className="com-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: isPdf ? "27%" : 260 }} />
                <col style={{ width: isPdf ? "10%" : 100 }} />
                <col style={{ width: isPdf ? "14%" : 170 }} />
                <col style={{ width: isPdf ? "13%" : 120 }} />
                <col style={{ width: isPdf ? "11%" : 100 }} />
                <col style={{ width: isPdf ? "12%" : 130 }} />
                {!isPdf && <col style={{ width: 72 }} />}
              </colgroup>

              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ಕಾಮಗಾರಿಯ ವಿವರ</th>
                  <th>ಮೊತ್ತ (ಲಕ್ಷ ₹)</th>
                  <th className="th-left">ಯೋಜನೆ</th>
                  <th className="th-left">ಅನುಷ್ಠಾನ ಇಲಾಖೆ</th>
                  <th>ಪತ್ರ ಸಂಖ್ಯೆ</th>
                  <th className="th-left">ಷರಾ</th>
                  {!isPdf && <th>Action</th>}
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr className="com-empty">
                    <td colSpan={isPdf ? 7 : 8}>ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr className="com-empty">
                    <td colSpan={isPdf ? 7 : 8}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                )}

                {!loading && filtered?.map((item, i) => (
                  <tr key={item._id}>
                    <td className="td-num">{i + 1}</td>
                    <td>{item.workDetails || "—"}</td>
                    <td className="td-amount td-center">
                      {item.estimatedAmount
                        ? `₹ ${Number(item.estimatedAmount).toLocaleString("en-IN")}`
                        : "—"}
                    </td>
                    <td>
                      <span>{item.scheme || "—"}</span>
                    </td>
                    <td>{item.department || "—"}</td>
                    <td className="td-center">{item.letterNumber || "—"}</td>
                    <td>{item.remarks || "—"}</td>
                    {!isPdf && (
                      <td className="com-action-cell">
                        <div className="com-actions">
                          <FiEdit
                            size={16}
                            className="com-edit-btn"
                            onClick={() => { setEditData(item); setOpenModal(true); }}
                          />
                          <FiTrash2
                            size={16}
                            className="com-del-btn"
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