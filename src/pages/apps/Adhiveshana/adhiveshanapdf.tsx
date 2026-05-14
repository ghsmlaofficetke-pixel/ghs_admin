import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchAdhiveshanaPdfs,
  deleteAdhiveshanaPdf,
  updateAdhiveshanaPdf,
  createAdhiveshanaPdf,
  adhiveshanaPdfSelector,
} from "../../../api/adhiveshanapdf";

import { uploadPdfToFirebase } from "../../../utils/uploadPdf";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";

/* ─────────────────────────────────────────── TYPES */
type PdfItem = {
  _id?: string;
  date: string;
  description: string;
  department: string;
  pdfUrl?: string;
  fileName?: string;
};

const EMPTY_FORM = { date: "", description: "", department: "" };

/* ─────────────────────────────────────────── DELETE MODAL */
function DeleteModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal-icon ap-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="ap-modal-title" style={{ color: "#dc2626" }}>
          ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
        </h2>
        <p className="ap-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು
          ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="ap-modal-actions">
          <button className="ap-btn ap-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="ap-btn ap-btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            ಅಳಿಸಿ
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── FORM MODAL */
function FormModal({
  open,
  onClose,
  editData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  editData: PdfItem | null;
  onSave: (form: typeof EMPTY_FORM, file: File | null) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(
      editData
        ? {
            date: editData.date || "",
            description: editData.description || "",
            department: editData.department || "",
          }
        : EMPTY_FORM
    );
    setFile(null);
  }, [editData, open]);

  const set = (k: keyof typeof EMPTY_FORM, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="ap-overlay" onClick={onClose}>
      <div className="ap-modal ap-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal-header">
          <div className="ap-modal-icon ap-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="ap-modal-title">
            {editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="ap-form-grid">
          <div className="ap-field">
            <label>
              ದಿನಾಂಕ <span className="ap-required">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="ap-field">
            <label>ಇಲಾಖೆ</label>
            <input
              placeholder="ಇಲಾಖೆ"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            />
          </div>
          <div className="ap-field ap-full">
            <label>ವಿವರಣೆ</label>
            <textarea
              rows={3}
              placeholder="ವಿವರಣೆ ನಮೂದಿಸಿ..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="ap-field ap-full">
            <label>
              PDF ಫೈಲ್{" "}
              {editData && (
                <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                  (ಹೊಸದು upload ಮಾಡಲು)
                </span>
              )}
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="ap-modal-actions">
          <button className="ap-btn ap-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="ap-btn ap-btn-primary"
            onClick={() => {
              if (!form.date) return;
              onSave(form, file);
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
export default function AdhiveshanaPdfPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(adhiveshanaPdfSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<PdfItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdhiveshanaPdfs());
  }, [dispatch]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (list as PdfItem[]).filter(
      (item) =>
        (item.description || "").toLowerCase().includes(q) ||
        (item.department || "").toLowerCase().includes(q) ||
        (item.date || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  /* ── SAVE */
  const handleSave = async (form: typeof EMPTY_FORM, file: File | null) => {
    let payload: any = { ...form };
    if (file) {
      const url = await uploadPdfToFirebase(file);
      payload.pdfUrl = url;
      payload.fileName = file.name;
    }
    if (editData)
      await dispatch(updateAdhiveshanaPdf(editData._id!, payload) as any);
    else await dispatch(createAdhiveshanaPdf(payload) as any);
    dispatch(fetchAdhiveshanaPdfs());
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteAdhiveshanaPdf(deleteId) as any);
    dispatch(fetchAdhiveshanaPdfs());
    setDeleteId(null);
  };

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes ap-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes ap-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .ap-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER */
        .ap-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .ap-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }
        .ap-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .ap-title span { color: #2466d1; }
        .ap-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .ap-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ── FILTERS */
        .ap-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .ap-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .ap-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .ap-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .ap-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        /* ── STATS */
        .ap-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }
        .ap-stat-chip {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .ap-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ── TABLE WRAP */
        .ap-table-wrap {
          flex: 1; margin: 8px 0 0; min-height: 0;
          display: flex; flex-direction: column; padding: 0 0 8px;
        }
        .ap-scroll {
          flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .ap-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .ap-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── TABLE */
        .ap-table {
          width: 100%; min-width: 700px;
          border-collapse: collapse; table-layout: fixed;
        }
        .ap-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.4;
        }
        .ap-table thead th.th-left { text-align: left; }
        .ap-table tbody tr { animation: ap-fade-in 0.25s ease forwards; }
        .ap-table tbody tr:nth-child(even) { background: #f8faff; }
        .ap-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }
        .ap-table tbody td {
          border: 1px solid #D4D4D4; padding: 8px 9px;
          font-size: 13px; color: #262626; line-height: 1.55;
          vertical-align: middle; word-break: break-word;
        }
        .ap-table tbody td.td-center { text-align: center; }
        .ap-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .ap-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .ap-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .ap-actions { display: flex; justify-content: center; gap: 10px; }
        .ap-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .ap-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .ap-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .ap-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }
        .ap-pdf-link {
          display: inline-flex; align-items: center; justify-content: center;
          color: #dc2626; transition: transform 0.1s;
        }
        .ap-pdf-link:hover { transform: scale(1.2); }

        /* ── OVERLAY / MODAL */
        .ap-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px; animation: ap-fade-in 0.15s ease;
        }
        .ap-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: ap-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;
        }
        .ap-modal-sm { max-width: 400px; text-align: center; }
        .ap-modal-lg { max-width: 560px; }
        .ap-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .ap-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .ap-icon-primary { background: #eff6ff; color: #2466d1; }
        .ap-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .ap-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .ap-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .ap-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        /* ── FORM */
        .ap-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ap-field { display: flex; flex-direction: column; gap: 5px; }
        .ap-field.ap-full { grid-column: 1 / -1; }
        .ap-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .ap-required { color: #ef4444; }
        .ap-field input, .ap-field textarea, .ap-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;
        }
        .ap-field input[type="file"] { padding: 6px 10px; background: #fff; cursor: pointer; }
        .ap-field input:focus, .ap-field textarea:focus, .ap-field select:focus {
          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;
        }

        /* ── BUTTONS */
        .ap-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .ap-btn:active { transform: scale(0.97); }
        .ap-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .ap-btn-primary:hover { opacity: 0.9; }
        .ap-btn-ghost { background: #f1f5f9; color: #64748b; }
        .ap-btn-ghost:hover { background: #e2e8f0; }
        .ap-btn-danger { background: #dc2626; color: #fff; }
        .ap-btn-danger:hover { background: #b91c1c; }

        @media (max-width: 600px) {
          .ap-form-grid { grid-template-columns: 1fr; }
          .ap-field.ap-full { grid-column: 1 / -1; }
          .ap-title { font-size: 13px; }
        }
      `}</style>

      <div className="ap-root">
        {/* ── HEADER */}
        <div className="ap-header">
          <div className="ap-header-top">
            <h1 className="ap-title">
              <span>ಪ್ರಶ್ನೋತ್ತರ</span> ದಾಖಲೆಗಳು
            </h1>
            <button
              className="ap-add-btn"
              onClick={() => {
                setEditData(null);
                setOpenModal(true);
              }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="ap-filters">
            <div className="ap-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ, ದಿನಾಂಕ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── STATS */}
        <div className="ap-stats">
          <div className="ap-stat-chip">
            ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong>
          </div>
          {search && (
            <div className="ap-stat-chip">
              ಫಿಲ್ಟರ್: <strong>"{search}"</strong>
            </div>
          )}
        </div>

        {/* ── TABLE */}
        <div className="ap-table-wrap">
          <div className="ap-scroll">
            <table className="ap-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 140 }} />
                <col />
                <col style={{ width: 60 }} />
                <col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ದಿನಾಂಕ</th>
                  <th className="th-left">ಇಲಾಖೆ</th>
                  <th className="th-left">ವಿವರಣೆ</th>
                  <th>PDF</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="ap-empty">
                    <td colSpan={6}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered?.map((item, i) => (
                    <tr key={item._id}>
                      <td className="td-num">{i + 1}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.date}</td>
                      <td>{item.department}</td>
                      <td>{item.description}</td>
                      <td className="td-center">
                        {item.pdfUrl ? (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="ap-pdf-link"
                          >
                            <FaFilePdf size={18} />
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td className="ap-action-cell">
                        <div className="ap-actions">
                          <FiEdit
                            size={16}
                            className="ap-edit-btn"
                            onClick={() => {
                              setEditData(item);
                              setOpenModal(true);
                            }}
                          />
                          <FiTrash2
                            size={16}
                            className="ap-del-btn"
                            onClick={() => setDeleteId(item._id!)}
                          />
                        </div>
                      </td>
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
          onClose={() => {
            setOpenModal(false);
            setEditData(null);
          }}
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