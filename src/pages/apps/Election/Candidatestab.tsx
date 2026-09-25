import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  fetchElectionCandidates,
  createElectionCandidate,
  updateElectionCandidate,
  deleteElectionCandidate,
  electionSelector,
  ElectionCandidate,
  ElectionType,
} from "../../../api/election";

import { uploadImageToFirebase } from "../../../utils/uploadImages";
import { FiEdit, FiTrash2, FiUser } from "react-icons/fi";
import { FaPlus, FaSearch, FaTrophy, FaCrown } from "react-icons/fa";

const EMPTY_FORM = {
  party: "",
  candidateName: "",
  votes: "",
  isWinner: false,
  remark: "",
};

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
    <div className="mec-overlay" onClick={onClose}>
      <div className="mec-modal mec-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="mec-modal-icon mec-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="mec-modal-title" style={{ color: "#dc2626" }}>
          ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
        </h2>
        <p className="mec-modal-desc">
          ನೀವು ಈ ಅಭ್ಯರ್ಥಿಯ ಮಾಹಿತಿಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು
          ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="mec-modal-actions">
          <button className="mec-btn mec-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="mec-btn mec-btn-danger"
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
  editData: ElectionCandidate | null;
  onSave: (form: typeof EMPTY_FORM, file: File | null) => void;
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    setForm(
      editData
        ? {
            party: editData.party || "",
            candidateName: editData.candidateName || "",
            votes: String(editData.votes ?? ""),
            isWinner: !!editData.isWinner,
            remark: editData.remark || "",
          }
        : EMPTY_FORM
    );
    setPreview(editData?.candidateImage || "");
    setFile(null);
  }, [editData, open]);

  const set = (k: keyof typeof EMPTY_FORM, v: any) =>
    setForm((p) => ({ ...p, [k]: v }));

  if (!open) return null;
  return (
    <div className="mec-overlay" onClick={onClose}>
      <div className="mec-modal mec-modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mec-modal-header">
          <div className="mec-modal-icon mec-icon-primary">
            {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
          </div>
          <h2 className="mec-modal-title">
            {editData ? "ಅಭ್ಯರ್ಥಿ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಅಭ್ಯರ್ಥಿ ಸೇರಿಸಿ"}
          </h2>
        </div>

        <div className="mec-form-grid">
          <div className="mec-field mec-full" style={{ alignItems: "center" }}>
            <label>ಅಭ್ಯರ್ಥಿಯ ಫೋಟೋ</label>
            <div className="mec-photo-row">
              <div className="mec-photo-preview">
                {preview ? (
                  <img src={preview} alt="candidate" />
                ) : (
                  <FiUser size={32} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                  if (f) setPreview(URL.createObjectURL(f));
                }}
              />
            </div>
          </div>

          <div className="mec-field">
            <label>
              ಪಕ್ಷ <span className="mec-required">*</span>
            </label>
            <input
              placeholder="ಪಕ್ಷದ ಹೆಸರು"
              value={form.party}
              onChange={(e) => set("party", e.target.value)}
            />
          </div>
          <div className="mec-field">
            <label>
              ಅಭ್ಯರ್ಥಿಯ ಹೆಸರು <span className="mec-required">*</span>
            </label>
            <input
              placeholder="ಅಭ್ಯರ್ಥಿಯ ಹೆಸರು"
              value={form.candidateName}
              onChange={(e) => set("candidateName", e.target.value)}
            />
          </div>
          <div className="mec-field">
            <label>ಬಂದ ಮತಗಳು (Votes)</label>
            <input
              type="number"
              placeholder="0"
              value={form.votes}
              onChange={(e) => set("votes", e.target.value)}
            />
          </div>
          <div className="mec-field" style={{ justifyContent: "center" }}>
            <label>ಗೆದ್ದ ಅಭ್ಯರ್ಥಿಯೇ?</label>
            <label className="mec-checkbox">
              <input
                type="checkbox"
                checked={form.isWinner}
                onChange={(e) => set("isWinner", e.target.checked)}
              />
              <span>ಗೆದ್ದವರು (Winner)</span>
            </label>
          </div>
          <div className="mec-field mec-full">
            <label>ಟಿಪ್ಪಣಿ</label>
            <textarea
              rows={2}
              placeholder="ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ..."
              value={form.remark}
              onChange={(e) => set("remark", e.target.value)}
            />
          </div>
        </div>

        <div className="mec-modal-actions">
          <button className="mec-btn mec-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="mec-btn mec-btn-primary"
            onClick={() => {
              if (!form.party || !form.candidateName) return;
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

export default function CandidatesTab({
  electionType,
  year,
}: {
  electionType: ElectionType;
  year: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { candidates: list = [] } = useSelector(electionSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<ElectionCandidate | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchElectionCandidates(electionType, year));
    setSearch("");
  }, [dispatch, electionType, year]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (list as ElectionCandidate[]).filter(
      (c) =>
        (c.candidateName || "").toLowerCase().includes(q) ||
        (c.party || "").toLowerCase().includes(q)
    );
  }, [list, search]);

  const totalVotes = useMemo(
    () => filtered.reduce((sum, c) => sum + (Number(c.votes) || 0), 0),
    [filtered]
  );

  const handleSave = async (form: typeof EMPTY_FORM, file: File | null) => {
    let candidateImage = editData?.candidateImage || "";
    if (file) {
      candidateImage = await uploadImageToFirebase(
        file,
        `elections/${electionType.toLowerCase()}/${year}/candidates`
      );
    }
    const payload = {
      party: form.party,
      candidateName: form.candidateName,
      votes: Number(form.votes) || 0,
      isWinner: form.isWinner,
      remark: form.remark,
      candidateImage,
    };
    if (editData)
      await dispatch(
        updateElectionCandidate(electionType, year, editData._id!, payload) as any
      );
    else
      await dispatch(
        createElectionCandidate(electionType, year, payload) as any
      );
    setOpenModal(false);
    setEditData(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await dispatch(
      deleteElectionCandidate(electionType, year, deleteId) as any
    );
    setDeleteId(null);
  };

  return (
    <>
      <style>{`
        @keyframes mec-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes mec-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }
        @keyframes mec-shimmer  { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes mec-pop      { 0% { transform: scale(0.9); } 60% { transform: scale(1.06); } 100% { transform: scale(1); } }

        .mec-root {
          display: flex; flex-direction: column;
          height: 100%; min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }
        .mec-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .mec-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }
        .mec-title { font-size: 15px; font-weight: 700; color: #1a3d7c; flex: 1; text-align: center; }
        .mec-title span { color: #2466d1; }
        .mec-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .mec-add-btn:hover { opacity: 0.9; transform: scale(1.03); }

        .mec-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
        .mec-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .mec-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 12px; pointer-events: none; }
        .mec-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px; border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;
        }
        .mec-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        .mec-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }
        .mec-stat-chip {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .mec-stat-chip strong { color: #1a3d7c; font-size: 13px; }
        .mec-stat-chip.mec-stat-winner { background: linear-gradient(135deg, #fff7e0, #fff); border-color: #f3d98b; }
        .mec-stat-chip.mec-stat-winner strong { color: #b45309; }

        .mec-table-wrap { flex: 1; margin: 8px 0 0; min-height: 0; display: flex; flex-direction: column; padding: 0 0 8px; }
        .mec-scroll { flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff; }
        .mec-table { width: 100%; min-width: 780px; border-collapse: collapse; table-layout: fixed; }
        .mec-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700; padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap; position: sticky; top: 0; z-index: 10;
        }
        .mec-table thead th.th-left { text-align: left; }
        .mec-table tbody tr { animation: mec-fade-in 0.25s ease forwards; transition: background 0.15s; }
        .mec-table tbody tr:nth-child(even) { background: #f8faff; }
        .mec-table tbody tr:hover { background: #ddeeff; }

        /* Winner row: strong, celebratory highlight */
        .mec-table tbody tr.mec-winner-row {
          background: linear-gradient(90deg, #fff8e1 0%, #fef3c7 50%, #fff8e1 100%);
          box-shadow: inset 3px 0 0 0 #f5b301;
          position: relative;
        }
        .mec-table tbody tr.mec-winner-row:hover {
          background: linear-gradient(90deg, #fef0c3 0%, #fde68a 50%, #fef0c3 100%);
        }
        .mec-table tbody tr.mec-winner-row td {
          font-weight: 600;
        }
        .mec-table tbody tr.mec-winner-row td.td-num {
          color: #b45309;
        }

        .mec-table tbody td { border: 1px solid #D4D4D4; padding: 8px 9px; font-size: 13px; color: #262626; vertical-align: middle; word-break: break-word; }
        .mec-table tbody td.td-center { text-align: center; }
        .mec-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .mec-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .mec-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .mec-actions { display: flex; justify-content: center; gap: 10px; }
        .mec-edit-btn { cursor: pointer; color: #2563eb; }
        .mec-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .mec-del-btn { cursor: pointer; color: #ef4444; }
        .mec-del-btn:hover { color: #b91c1c; transform: scale(1.2); }

        .mec-avatar-wrap { position: relative; width: 40px; height: 40px; margin: 0 auto; }
        .mec-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; display: block; }
        .mec-avatar-placeholder { width: 40px; height: 40px; border-radius: 50%; background: #eef2f7; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .mec-winner-row .mec-avatar { border-color: #f5b301; box-shadow: 0 0 0 2px #fff, 0 0 0 3.5px #f5b301; }
        .mec-crown-badge {
          position: absolute; top: -9px; left: 50%; transform: translateX(-50%);
          color: #f5b301; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25));
          animation: mec-pop 0.3s ease;
        }

        /* Victory / winner result badge */
        .mec-winner-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: #fff; font-weight: 700; font-size: 11.5px;
          box-shadow: 0 2px 6px rgba(245,158,11,0.45);
          letter-spacing: 0.2px;
          animation: mec-pop 0.25s ease;
        }
        .mec-winner-badge svg { flex-shrink: 0; }
        .mec-pending-badge {
          color: #94a3b8; font-size: 12px; font-weight: 500;
        }

        .mec-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; justify-content: center; align-items: center; z-index: 50; padding: 12px; animation: mec-fade-in 0.15s ease; }
        .mec-modal { background: #fff; border-radius: 16px; padding: 24px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: mec-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto; }
        .mec-modal-sm { max-width: 400px; text-align: center; }
        .mec-modal-lg { max-width: 560px; }
        .mec-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .mec-modal-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .mec-icon-primary { background: #eff6ff; color: #2466d1; }
        .mec-icon-danger { background: #fef2f2; color: #dc2626; margin: 0 auto 10px; border-radius: 50%; }
        .mec-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .mec-modal-desc { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .mec-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        .mec-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .mec-field { display: flex; flex-direction: column; gap: 5px; }
        .mec-field.mec-full { grid-column: 1 / -1; }
        .mec-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .mec-required { color: #ef4444; }
        .mec-field input, .mec-field textarea, .mec-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-size: 13px; outline: none;
          background: #f8fafc; resize: none; font-family: inherit; color: #1e293b;
        }
        .mec-field input[type="file"] { padding: 6px 10px; background: #fff; cursor: pointer; }
        .mec-field input:focus, .mec-field textarea:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff; }
        .mec-photo-row { display: flex; align-items: center; gap: 14px; }
        .mec-photo-preview { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: #eef2f7; display: flex; align-items: center; justify-content: center; color: #94a3b8; flex-shrink: 0; border: 2px solid #e2e8f0; }
        .mec-photo-preview img { width: 100%; height: 100%; object-fit: cover; }
        .mec-checkbox { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #1e293b; cursor: pointer; }
        .mec-checkbox input { width: 16px; height: 16px; cursor: pointer; }

        .mec-btn { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; }
        .mec-btn:active { transform: scale(0.97); }
        .mec-btn-primary { background: linear-gradient(135deg, #2466d1, #06b6d4); color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3); }
        .mec-btn-primary:hover { opacity: 0.9; }
        .mec-btn-ghost { background: #f1f5f9; color: #64748b; }
        .mec-btn-ghost:hover { background: #e2e8f0; }
        .mec-btn-danger { background: #dc2626; color: #fff; }
        .mec-btn-danger:hover { background: #b91c1c; }

        @media (max-width: 600px) {
          .mec-form-grid { grid-template-columns: 1fr; }
          .mec-title { font-size: 13px; }
        }
      `}</style>

      <div className="mec-root">
        <div className="mec-header">
          <div className="mec-header-top">
            <h1 className="mec-title">
              <span>{year}</span> ಅಭ್ಯರ್ಥಿಗಳು
            </h1>
            <button
              className="mec-add-btn"
              onClick={() => {
                setEditData(null);
                setOpenModal(true);
              }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>
          <div className="mec-filters">
            <div className="mec-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ಅಭ್ಯರ್ಥಿ, ಪಕ್ಷ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mec-stats">
          <div className="mec-stat-chip">
            ಒಟ್ಟು ಅಭ್ಯರ್ಥಿಗಳು: <strong>{filtered.length}</strong>
          </div>
          <div className="mec-stat-chip">
            ಒಟ್ಟು ಮತಗಳು: <strong>{totalVotes.toLocaleString("en-IN")}</strong>
          </div>
          {/* <div className="mec-stat-chip mec-stat-winner">
            <FaTrophy size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
            ಗೆದ್ದವರು: <strong>{filtered.filter((c) => c.isWinner).length}</strong>
          </div> */}
        </div>

        <div className="mec-table-wrap">
          <div className="mec-scroll">
            <table className="mec-table">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: 94 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 80 }} />
                {/* <col style={{ width: 90 }} /> */}
                <col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th>ಫೋಟೋ</th>
                  <th className="th-left">ಪಕ್ಷ</th>
                  <th className="th-left">ಅಭ್ಯರ್ಥಿಗಳು</th>
                  <th>ಮತಗಳು</th>
                  {/* <th>ಫಲಿತಾಂಶ</th> */}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered?.length === 0 ? (
                  <tr className="mec-empty">
                    <td colSpan={7}>ಯಾವುದೇ ಅಭ್ಯರ್ಥಿ ಮಾಹಿತಿ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filtered?.map((c, i) => (
                    <tr key={c._id} className={c.isWinner ? "mec-winner-row" : ""}>
                      <td className="td-num">{i + 1}</td>
                      <td className="td-center">
                        <div className="mec-avatar-wrap">
                          {c.isWinner && (
                            <FaCrown size={14} className="mec-crown-badge" />
                          )}
                          {c.candidateImage ? (
                            <img
                              src={c.candidateImage}
                              alt={c.candidateName}
                              className="mec-avatar"
                            />
                          ) : (
                            <div className="mec-avatar-placeholder">
                              <FiUser size={20} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{c.party}</td>
                      <td>{c.candidateName}</td>
                      <td className="td-center">
                        {(c.votes || 0).toLocaleString("en-IN")}
                      </td>
                      {/* <td className="td-center">
                        {c.isWinner ? (
                          <span className="mec-winner-badge">
                            <FaTrophy size={12} /> ಗೆದ್ದವರು
                          </span>
                        ) : (
                          <span className="mec-pending-badge">—</span>
                        )}
                      </td> */}
                      <td className="mec-action-cell">
                        <div className="mec-actions">
                          <FiEdit
                            size={16}
                            className="mec-edit-btn"
                            onClick={() => {
                              setEditData(c);
                              setOpenModal(true);
                            }}
                          />
                          <FiTrash2
                            size={16}
                            className="mec-del-btn"
                            onClick={() => setDeleteId(c._id!)}
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