import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  fetchElectionPdfs,
  createElectionPdf,
  updateElectionPdf,
  deleteElectionPdf,
  electionSelector,
  ElectionPdf,
  ElectionType,
} from "../../../api/election";
import { uploadPdfToFirebase } from "../../../utils/uploadPdf";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaFilePdf, FaPlus, FaSearch } from "react-icons/fa";

const EMPTY_FORM = { date: "", description: "" };

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
    <div className="mep-overlay" onClick={onClose}>
      <div className="mep-modal mep-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mep-modal-icon mep-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="mep-modal-title" style={{ color: "#dc2626" }}>
          ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
        </h2>
        <p className="mep-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು
          ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="mep-modal-actions">
          <button className="mep-btn mep-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="mep-btn mep-btn-danger"
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

function FormModal({
  open,
  onClose,
  editData,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  editData: ElectionPdf | null;
  onSave: (form: typeof EMPTY_FORM, file: File | null) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    setForm(
      editData
        ? { date: editData.date || "", description: editData.description || "" }
        : EMPTY_FORM
    );
    setFile(null);
  }, [editData, open]);

  const set = (k: keyof typeof EMPTY_FORM, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="mep-overlay" onClick={onClose}>
      <div className="mep-modal mep-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mep-modal-header">
          <div className="mep-modal-icon mep-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="mep-modal-title">
            {editData ? "ದಾಖಲೆ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="mep-form-grid">
          <div className="mep-field">
            <label>
              ದಿನಾಂಕ <span className="mep-required">*</span>
            </label>
            <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="mep-field mep-full">
            <label>ವಿವರಣೆ</label>
            <textarea
              rows={3}
              placeholder="ವಿವರಣೆ ನಮೂದಿಸಿ..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="mep-field mep-full">
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

        <div className="mep-modal-actions">
          <button className="mep-btn mep-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="mep-btn mep-btn-primary"
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

export default function PdfsTab({
  electionType,
  year,
}: {
  electionType: ElectionType;
  year: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { pdfs: list = [] } = useSelector(electionSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<ElectionPdf | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchElectionPdfs(electionType, year));
    setSearch("");
  }, [dispatch, electionType, year]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (list as ElectionPdf[]).filter(
      (item) =>
        (item.description || "").toLowerCase().includes(q) ||
        (item.date || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  const handleSave = async (form: typeof EMPTY_FORM, file: File | null) => {
    let payload: any = { ...form };
    if (file) {
      const url = await uploadPdfToFirebase(
        file,
        `elections/${electionType.toLowerCase()}/${year}/pdf`
      );
      payload.pdfUrl = url;
      payload.fileName = file.name;
    }
    if (editData)
      await dispatch(
        updateElectionPdf(electionType, year, editData._id!, payload) as any
      );
    else await dispatch(createElectionPdf(electionType, year, payload) as any);
    setOpenModal(false);
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(deleteElectionPdf(electionType, year, deleteId) as any);
    setDeleteId(null);
  };

  return (
    <>
      <style>{`
        @keyframes mep-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes mep-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .mep-root {
          display: flex; flex-direction: column; height: 100%; min-height: 0;
          background: #f0f4f8; font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }
        .mep-header { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 10px 14px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(36,102,209,0.07); }
        .mep-header-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
        .mep-title { font-size: 15px; font-weight: 700; color: #1a3d7c; flex: 1; text-align: center; }
        .mep-title span { color: #2466d1; }
        .mep-add-btn {
          display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4); color: #fff; border: none; cursor: pointer;
          font-size: 13px; font-weight: 600; box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .mep-add-btn:hover { opacity: 0.9; transform: scale(1.03); }
        .mep-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .mep-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .mep-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 12px; pointer-events: none; }
        .mep-search-wrap input { width: 100%; padding: 7px 10px 7px 32px; border: 1px solid #e2e8f0; border-radius: 20px; font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box; }
        .mep-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }
        .mep-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }
        .mep-stat-chip { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .mep-stat-chip strong { color: #1a3d7c; font-size: 13px; }
        .mep-table-wrap { flex: 1; margin: 8px 0 0; min-height: 0; display: flex; flex-direction: column; padding: 0 0 8px; }
        .mep-scroll { flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff; }
        .mep-table { width: 100%; min-width: 600px; border-collapse: collapse; table-layout: fixed; }
        .mep-table thead th { background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%); color: #fff; font-size: 12px; font-weight: 700; padding: 10px 8px; text-align: center; border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; position: sticky; top: 0; z-index: 10; }
        .mep-table thead th.th-left { text-align: left; }
        .mep-table tbody tr { animation: mep-fade-in 0.25s ease forwards; }
        .mep-table tbody tr:nth-child(even) { background: #f8faff; }
        .mep-table tbody tr:hover { background: #ddeeff; }
        .mep-table tbody td { border: 1px solid #D4D4D4; padding: 8px 9px; font-size: 13px; color: #262626; vertical-align: middle; word-break: break-word; }
        .mep-table tbody td.td-center { text-align: center; }
        .mep-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .mep-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .mep-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .mep-actions { display: flex; justify-content: center; gap: 10px; }
        .mep-edit-btn { cursor: pointer; color: #2563eb; }
        .mep-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .mep-del-btn { cursor: pointer; color: #ef4444; }
        .mep-del-btn:hover { color: #b91c1c; transform: scale(1.2); }
        .mep-pdf-link { display: inline-flex; align-items: center; justify-content: center; color: #dc2626; }
        .mep-pdf-link:hover { transform: scale(1.2); }
        .mep-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; justify-content: center; align-items: center; z-index: 50; padding: 12px; animation: mep-fade-in 0.15s ease; }
        .mep-modal { background: #fff; border-radius: 16px; padding: 24px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: mep-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto; }
        .mep-modal-sm { max-width: 400px; text-align: center; }
        .mep-modal-lg { max-width: 560px; }
        .mep-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .mep-modal-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mep-icon-primary { background: #eff6ff; color: #2466d1; }
        .mep-icon-danger { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .mep-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .mep-modal-desc { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .mep-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
        .mep-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mep-field { display: flex; flex-direction: column; gap: 5px; }
        .mep-field.mep-full { grid-column: 1 / -1; }
        .mep-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .mep-required { color: #ef4444; }
        .mep-field input, .mep-field textarea { border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-size: 13px; outline: none; background: #f8fafc; resize: none; font-family: inherit; color: #1e293b; }
        .mep-field input[type="file"] { padding: 6px 10px; background: #fff; cursor: pointer; }
        .mep-field input:focus, .mep-field textarea:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff; }
        .mep-btn { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
        .mep-btn:active { transform: scale(0.97); }
        .mep-btn-primary { background: linear-gradient(135deg, #2466d1, #06b6d4); color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3); }
        .mep-btn-primary:hover { opacity: 0.9; }
        .mep-btn-ghost { background: #f1f5f9; color: #64748b; }
        .mep-btn-ghost:hover { background: #e2e8f0; }
        .mep-btn-danger { background: #dc2626; color: #fff; }
        .mep-btn-danger:hover { background: #b91c1c; }
        @media (max-width: 600px) {
          .mep-form-grid { grid-template-columns: 1fr; }
          .mep-title { font-size: 13px; }
        }
      `}</style>

      <div className="mep-root">
        <div className="mep-header">
          <div className="mep-header-top">
            <h1 className="mep-title">
              <span>{year}</span> ಚುನಾವಣಾ ದಾಖಲೆಗಳು (PDF)
            </h1>
            <button
              className="mep-add-btn"
              onClick={() => {
                setEditData(null);
                setOpenModal(true);
              }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>
          <div className="mep-filters">
            <div className="mep-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ದಿನಾಂಕ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mep-stats">
          <div className="mep-stat-chip">
            ಒಟ್ಟು ದಾಖಲೆ: <strong>{filtered.length}</strong>
          </div>
        </div>

        <div className="mep-table-wrap">
          <div className="mep-scroll">
            <table className="mep-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: 110 }} />
                <col />
                <col style={{ width: 60 }} />
                <col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ದಿನಾಂಕ</th>
                  <th className="th-left">ವಿವರಣೆ</th>
                  <th>PDF</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr className="mep-empty">
                    <td colSpan={5}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={item._id}>
                      <td className="td-num">{i + 1}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{item.date}</td>
                      <td>{item.description}</td>
                      <td className="td-center">
                        {item.pdfUrl ? (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mep-pdf-link"
                          >
                            <FaFilePdf size={18} />
                          </a>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td className="mep-action-cell">
                        <div className="mep-actions">
                          <FiEdit
                            size={16}
                            className="mep-edit-btn"
                            onClick={() => {
                              setEditData(item);
                              setOpenModal(true);
                            }}
                          />
                          <FiTrash2
                            size={16}
                            className="mep-del-btn"
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