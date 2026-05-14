import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchAllAdhiveshana,
  deleteAdhiveshana,
  adhiveshanaSelector,
  updateAdhiveshana,
  createAdhiveshana,
} from "../../../api/adhiveshana";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaPlus, FaSearch } from "react-icons/fa";

/* ─────────────────────────────────────────── TYPES */
type AdhiveshanaItem = {
  _id?: string;
  date: string;
  type: string;
  department: string;
  description: string;
};

const EMPTY_FORM: AdhiveshanaItem = {
  date: "",
  type: "ಬಜೆಟ್ ಅಧಿವೇಶನ",
  department: "",
  description: "",
};

const SESSION_TYPES = [
  "ಬಜೆಟ್ ಅಧಿವೇಶನ",
  "ಮಳೆಗಾಲದ ಅಧಿವೇಶನ",
  "ಚಳಿಗಾಲದ ಅಧಿವೇಶನ",
];

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
    <div className="aq-overlay" onClick={onClose}>
      <div className="aq-modal aq-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="aq-modal-icon aq-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="aq-modal-title" style={{ color: "#dc2626" }}>
          ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
        </h2>
        <p className="aq-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು
          ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="aq-modal-actions">
          <button className="aq-btn aq-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="aq-btn aq-btn-danger"
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
  editData: AdhiveshanaItem | null;
  onSave: (f: AdhiveshanaItem) => void;
}) {
  const [form, setForm] = useState<AdhiveshanaItem>(EMPTY_FORM);

  useEffect(() => {
    setForm(editData ? { ...editData } : EMPTY_FORM);
  }, [editData, open]);

  const set = (k: keyof AdhiveshanaItem, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="aq-overlay" onClick={onClose}>
      <div className="aq-modal aq-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="aq-modal-header">
          <div className="aq-modal-icon aq-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="aq-modal-title">
            {editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಪ್ರಶ್ನೆ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="aq-form-grid">
          <div className="aq-field">
            <label>ದಿನಾಂಕ</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
          <div className="aq-field">
            <label>
              ಅಧಿವೇಶನ ಪ್ರಕಾರ <span className="aq-required">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {SESSION_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="aq-field">
            <label>ಇಲಾಖೆ</label>
            <input
              placeholder="ಇಲಾಖೆ"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            />
          </div>
          <div className="aq-field aq-full">
            <label>
              ವಿವರಣೆ <span className="aq-required">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="ಪ್ರಶ್ನೆ / ವಿವರಣೆ ನಮೂದಿಸಿ..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        <div className="aq-modal-actions">
          <button className="aq-btn aq-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="aq-btn aq-btn-primary"
            onClick={() => {
              if (!form.type || !form.description) return;
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
export default function AdhiveshanaQuestionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(adhiveshanaSelector);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<AdhiveshanaItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllAdhiveshana());
  }, [dispatch]);

  /* ── FILTER */
  const filtered = useMemo(() => {
    const clean = (v: unknown) =>
      (v || "").toString().toLowerCase().replace(/\s+/g, " ").trim();
    const q = clean(search);
    return (list as AdhiveshanaItem[]).filter((item) => {
      const matchSearch =
        q.length < 1 ||
        [item.type, item.department, item.description].some((v) =>
          clean(v).includes(q)
        );
      return (
        (!typeFilter || clean(item.type) === clean(typeFilter)) && matchSearch
      );
    });
  }, [list, search, typeFilter]);

  /* ── SAVE */
  const handleSave = async (form: AdhiveshanaItem) => {
    if (editData) {
      await dispatch(updateAdhiveshana(editData._id!, form) as any);
    } else {
      await dispatch(createAdhiveshana(form) as any);
    }
    dispatch(fetchAllAdhiveshana());
    setOpenModal(false);
    setEditData(null);
  };

  /* ── DELETE */
  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteAdhiveshana(deleteId) as any);
    dispatch(fetchAllAdhiveshana());
    setDeleteId(null);
  };

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes aq-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes aq-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .aq-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER */
        .aq-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .aq-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }
        .aq-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .aq-title span { color: #2466d1; }
        .aq-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .aq-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        /* ── FILTERS */
        .aq-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .aq-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .aq-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .aq-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .aq-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        .aq-select {
          padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 8px;
          font-size: 13px; outline: none; background: #f8fafc; cursor: pointer; min-width: 160px;
        }
        .aq-select:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); }

        /* ── STATS */
        .aq-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }
        .aq-stat-chip {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .aq-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ── TABLE WRAP */
        .aq-table-wrap {
          flex: 1; margin: 8px 0 0; min-height: 0;
          display: flex; flex-direction: column; padding: 0 0 8px;
        }
        .aq-scroll {
          flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .aq-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .aq-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── TABLE */
        .aq-table {
          width: 100%; min-width: 700px;
          border-collapse: collapse; table-layout: fixed;
        }
        .aq-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.4;
        }
        .aq-table thead th.th-left { text-align: left; }
        .aq-table tbody tr { animation: aq-fade-in 0.25s ease forwards; }
        .aq-table tbody tr:nth-child(even) { background: #f8faff; }
        .aq-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }
        .aq-table tbody td {
          border: 1px solid #D4D4D4; padding: 8px 9px;
          font-size: 13px; color: #262626; line-height: 1.55;
          vertical-align: middle; word-break: break-word;
        }
        .aq-table tbody td.td-center { text-align: center; }
        .aq-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }

        .aq-type-badge {
          display: inline-block; padding: 2px 8px; border-radius: 12px;
          font-size: 11px; font-weight: 600;
          background: #eff6ff; color: #1d4ed8;
          border: 1px solid #bfdbfe; white-space: nowrap;
        }

        .aq-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .aq-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .aq-actions { display: flex; justify-content: center; gap: 10px; }
        .aq-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .aq-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .aq-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .aq-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }

        /* ── OVERLAY / MODAL */
        .aq-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px; animation: aq-fade-in 0.15s ease;
        }
        .aq-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: aq-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;
        }
        .aq-modal-sm { max-width: 400px; text-align: center; }
        .aq-modal-lg { max-width: 560px; }
        .aq-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .aq-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .aq-icon-primary { background: #eff6ff; color: #2466d1; }
        .aq-icon-danger  { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .aq-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .aq-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .aq-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        /* ── FORM */
        .aq-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .aq-field { display: flex; flex-direction: column; gap: 5px; }
        .aq-field.aq-full { grid-column: 1 / -1; }
        .aq-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .aq-required { color: #ef4444; }
        .aq-field input, .aq-field textarea, .aq-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;
        }
        .aq-field input:focus, .aq-field textarea:focus, .aq-field select:focus {
          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;
        }

        /* ── BUTTONS */
        .aq-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .aq-btn:active { transform: scale(0.97); }
        .aq-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .aq-btn-primary:hover { opacity: 0.9; }
        .aq-btn-ghost { background: #f1f5f9; color: #64748b; }
        .aq-btn-ghost:hover { background: #e2e8f0; }
        .aq-btn-danger { background: #dc2626; color: #fff; }
        .aq-btn-danger:hover { background: #b91c1c; }

        @media (max-width: 600px) {
          .aq-form-grid { grid-template-columns: 1fr; }
          .aq-field.aq-full { grid-column: 1 / -1; }
          .aq-title { font-size: 13px; }
          .aq-select { min-width: 130px; }
        }
      `}</style>

      <div className="aq-root">
        {/* ── HEADER */}
        <div className="aq-header">
          <div className="aq-header-top">
            <h1 className="aq-title">
              <span>ಅಧಿವೇಶನ</span> ಪ್ರಶ್ನೆಗಳು
            </h1>
            <button
              className="aq-add-btn"
              onClick={() => {
                setEditData(null);
                setOpenModal(true);
              }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          <div className="aq-filters">
            <div className="aq-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ಇಲಾಖೆ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="aq-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">ಎಲ್ಲಾ ಅಧಿವೇಶನ</option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── STATS */}
        <div className="aq-stats">
          <div className="aq-stat-chip">
            ಒಟ್ಟು ಪ್ರಶ್ನೆಗಳು: <strong>{filtered.length}</strong>
          </div>
          {search && (
            <div className="aq-stat-chip">
              ಫಿಲ್ಟರ್: <strong>"{search}"</strong>
            </div>
          )}
        </div>

        {/* ── TABLE */}
        <div className="aq-table-wrap">
          <div className="aq-scroll">
            <table className="aq-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: 160 }} />
                <col style={{ width: 140 }} />
                <col />
                <col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ಅಧಿವೇಶನ ಪ್ರಕಾರ</th>
                  <th className="th-left">ಇಲಾಖೆ</th>
                  <th className="th-left">ವಿವರಣೆ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="aq-empty">
                    <td colSpan={5}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={item._id}>
                      <td className="td-num">{i + 1}</td>
                      <td className="td-center">
                        <span className="aq-type-badge">{item.type}</span>
                      </td>
                      <td>{item.department}</td>
                      <td>{item.description}</td>
                      <td className="aq-action-cell">
                        <div className="aq-actions">
                          <FiEdit
                            size={16}
                            className="aq-edit-btn"
                            onClick={() => {
                              setEditData(item);
                              setOpenModal(true);
                            }}
                          />
                          <FiTrash2
                            size={16}
                            className="aq-del-btn"
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