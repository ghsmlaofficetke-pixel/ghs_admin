import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchGroupByTaluk,
  statgroupSelector,
} from "../../../api/statgroup";

import {
  fetchDataByGroup,
  statdataSelector,
  deleteStatdata,
} from "../../../api/statdata";

import AddGroupModal from "./addStatagroup";
import AddDataModal from "./addStatadata";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaPlus, FaSearch } from "react-icons/fa";

const TALUKS = ["ತರೀಕೆರೆ ತಾಲ್ಲೂಕು", "ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು"];

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
    <div className="st-overlay" onClick={onClose}>
      <div className="st-modal st-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="st-modal-icon st-icon-danger">
          <FiTrash2 size={22} />
        </div>
        <h2 className="st-modal-title" style={{ color: "#dc2626" }}>
          ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
        </h2>
        <p className="st-modal-desc">
          ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ? ಈ ಕ್ರಿಯೆಯನ್ನು
          ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
        </p>
        <div className="st-modal-actions">
          <button className="st-btn st-btn-ghost" onClick={onClose}>
            ರದ್ದುಮಾಡಿ
          </button>
          <button
            className="st-btn st-btn-danger"
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

/* ─────────────────────────────────────────── MAIN */
const StatisticsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { list: groups = [] } = useSelector(statgroupSelector);
  const { list: data = [] } = useSelector(statdataSelector);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [taluk, setTaluk] = useState("ತರೀಕೆರೆ ತಾಲ್ಲೂಕು");
  const [groupId, setGroupId] = useState("");
  const [search, setSearch] = useState("");

  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openDataModal, setOpenDataModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  /* ── FETCH GROUPS */
  useEffect(() => {
    if (taluk) {
      dispatch(fetchGroupByTaluk(taluk));
      setGroupId("");
    }
  }, [taluk]);

  /* ── DEFAULT GROUP */
  useEffect(() => {
    if (groups.length > 0 && !groupId) {
      const defaultGroup = groups.find((g: any) => g.name === "ಶಿಕ್ಷಣ");
      setGroupId(defaultGroup ? defaultGroup._id : groups[0]._id);
    }
  }, [groups]);

  /* ── FETCH DATA */
  useEffect(() => {
    if (groupId) dispatch(fetchDataByGroup(groupId));
  }, [groupId]);

  /* ── FILTER */
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter(
      (item: any) =>
        item.title?.toLowerCase().includes(q) ||
        item.value?.toString().includes(q)
    );
  }, [data, search]);

  const handleDelete = () => {
    if (!deleteId) return;
    dispatch(deleteStatdata(deleteId, groupId));
    setDeleteId(null);
  };

  /* ════════════════════════════════════════════════════════ RENDER */
  return (
    <>
      <style>{`
        @keyframes st-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes st-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .st-root {
          display: flex; flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── HEADER */
        .st-header {
          background: #fff; border-bottom: 1px solid #e2e8f0;
          padding: 10px 14px; flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(36,102,209,0.07);
        }
        .st-header-top {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          margin-bottom: 10px;
        }
        .st-title {
          font-size: 15px; font-weight: 700; color: #1a3d7c;
          flex: 1; text-align: center;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .st-title span { color: #2466d1; }
        .st-add-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 2px 8px rgba(36,102,209,0.28); flex-shrink: 0;
        }
        .st-add-btn:hover { opacity: 0.9; transform: scale(1.03); }
        .st-add-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* ── TALUK TABS */
        .st-taluk-bar {
          display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;
        }
        .st-taluk-btn {
          padding: 5px 14px; border-radius: 20px; border: none;
          font-size: 12.5px; font-weight: 600; cursor: pointer;
          transition: all 0.15s;
        }
        .st-taluk-active {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.28);
        }
        .st-taluk-inactive { background: #e2e8f0; color: #64748b; }
        .st-taluk-inactive:hover { background: #cbd5e1; }

        /* ── GROUP CHIPS */
        .st-group-bar {
          display: flex; gap: 6px; overflow-x: auto; align-items: center;
          scrollbar-width: none; padding-bottom: 2px;
        }
        .st-group-bar::-webkit-scrollbar { display: none; }
        .st-group-chip {
          padding: 4px 14px; border-radius: 20px; border: none;
          font-size: 12px; font-weight: 600; cursor: pointer;
          white-space: nowrap; transition: all 0.15s; flex-shrink: 0;
        }
        .st-group-active { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .st-group-inactive { background: #f1f5f9; color: #64748b; }
        .st-group-inactive:hover { background: #e2e8f0; }
        .st-group-add {
          padding: 4px 12px; border-radius: 20px; border: none;
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; font-size: 13px; font-weight: 700; cursor: pointer;
          flex-shrink: 0; transition: opacity 0.15s;
        }
        .st-group-add:hover { opacity: 0.85; }

        /* ── FILTERS */
        .st-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-top: 10px; }
        .st-search-wrap { position: relative; flex: 1 1 160px; min-width: 0; }
        .st-search-wrap svg {
          position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 12px; pointer-events: none;
        }
        .st-search-wrap input {
          width: 100%; padding: 7px 10px 7px 32px;
          border: 1px solid #e2e8f0; border-radius: 20px;
          font-size: 13px; outline: none; background: #f8fafc; box-sizing: border-box;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .st-search-wrap input:focus { border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.1); background: #fff; }

        /* ── STATS */
        .st-stats { display: flex; gap: 10px; padding: 8px 14px 0; flex-shrink: 0; flex-wrap: wrap; }
        .st-stat-chip {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 5px 12px; font-size: 12px; color: #64748b; font-weight: 500;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .st-stat-chip strong { color: #1a3d7c; font-size: 13px; }

        /* ── TABLE WRAP */
        .st-table-wrap {
          flex: 1; margin: 8px 0 0; min-height: 0;
          display: flex; flex-direction: column; padding: 0 0 8px;
        }
        .st-scroll {
          flex: 1; min-height: 0; overflow-x: auto; overflow-y: auto;
          border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06); background: #fff;
          scrollbar-width: thin; scrollbar-color: #c5c5c5 transparent;
        }
        .st-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .st-scroll::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 4px; }

        /* ── TABLE */
        .st-table {
          width: 100%; min-width: 500px;
          border-collapse: collapse; table-layout: fixed;
        }
        .st-table thead th {
          background: linear-gradient(180deg, #06b6d4 0%, #2466d1 100%);
          color: #fff; font-size: 12px; font-weight: 700;
          padding: 10px 8px; text-align: center;
          border: 1px solid rgba(255,255,255,0.2); white-space: nowrap;
          position: sticky; top: 0; z-index: 10;
          -webkit-print-color-adjust: exact; print-color-adjust: exact; line-height: 1.4;
        }
        .st-table thead th.th-left { text-align: left; }
        .st-table thead th.th-right { text-align: right; }
        .st-table tbody tr { animation: st-fade-in 0.25s ease forwards; }
        .st-table tbody tr:nth-child(even) { background: #f8faff; }
        .st-table tbody tr:hover { background: #ddeeff; transition: background 0.12s; }
        .st-table tbody td {
          border: 1px solid #D4D4D4; padding: 8px 9px;
          font-size: 13px; color: #262626; line-height: 1.55;
          vertical-align: middle; word-break: break-word;
        }
        .st-table tbody td.td-center { text-align: center; }
        .st-table tbody td.td-right { text-align: right; font-weight: 600; color: #1a3d7c; }
        .st-table tbody td.td-num { font-weight: 700; color: #1a3d7c; text-align: center; }
        .st-empty td { text-align: center; padding: 48px 0; color: #94a3b8; font-size: 14px; }
        .st-action-cell { text-align: center; width: 72px; min-width: 72px; }
        .st-actions { display: flex; justify-content: center; gap: 10px; }
        .st-edit-btn { cursor: pointer; color: #2563eb; transition: transform 0.1s, color 0.1s; }
        .st-edit-btn:hover { color: #1d4ed8; transform: scale(1.2); }
        .st-del-btn  { cursor: pointer; color: #ef4444; transition: transform 0.1s, color 0.1s; }
        .st-del-btn:hover  { color: #b91c1c; transform: scale(1.2); }

        /* ── OVERLAY / MODAL */
        .st-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px; animation: st-fade-in 0.15s ease;
        }
        .st-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: st-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;
        }
        .st-modal-sm { max-width: 400px; text-align: center; }
        .st-modal-icon {
          width: 38px; height: 38px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
        }
        .st-icon-danger { background: #fef2f2; color: #dc2626; }
        .st-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .st-modal-desc  { font-size: 13px; color: #64748b; margin: 6px 0 20px; line-height: 1.6; }
        .st-modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9; }

        /* ── BUTTONS */
        .st-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .st-btn:active { transform: scale(0.97); }
        .st-btn-ghost { background: #f1f5f9; color: #64748b; }
        .st-btn-ghost:hover { background: #e2e8f0; }
        .st-btn-danger { background: #dc2626; color: #fff; }
        .st-btn-danger:hover { background: #b91c1c; }

        @media (max-width: 600px) {
          .st-title { font-size: 13px; }
          .st-taluk-btn { font-size: 11.5px; padding: 4px 10px; }
        }
      `}</style>

      <div className="st-root">
        {/* ── HEADER */}
        <div className="st-header">
          <div className="st-header-top">
            {/* Taluk Tabs */}
            <div className="st-taluk-bar" style={{ margin: 0, flex: 1 }}>
              {TALUKS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTaluk(t)}
                  className={`st-taluk-btn ${
                    taluk === t ? "st-taluk-active" : "st-taluk-inactive"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <h1 className="st-title" style={{ flex: "0 0 auto", marginLeft: 8 }}>
              <span>ಸಂಖ್ಯಾ</span> ಮಾಹಿತಿ
            </h1>

            <button
              className="st-add-btn"
              disabled={!groupId}
              onClick={() => {
                setEditData(null);
                setOpenDataModal(true);
              }}
            >
              <FaPlus size={12} /> ಸೇರಿಸಿ
            </button>
          </div>

          {/* Group chips row */}
          <div className="st-group-bar">
            {groups.map((g: any) => (
              <button
                key={g._id}
                onClick={() => setGroupId(g._id)}
                className={`st-group-chip ${
                  groupId === g._id ? "st-group-active" : "st-group-inactive"
                }`}
              >
                {g.name}
              </button>
            ))}
            <button
              className="st-group-add"
              onClick={() => setOpenGroupModal(true)}
            >
              +
            </button>
          </div>

          {/* Search */}
          <div className="st-filters">
            <div className="st-search-wrap">
              <FaSearch />
              <input
                placeholder="ಹುಡುಕಿ... (ವಿವರಣೆ, ಸಂಖ್ಯೆ)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── STATS */}
        <div className="st-stats">
          <div className="st-stat-chip">
            ಒಟ್ಟು ದಾಖಲೆ: <strong>{filteredData.length}</strong>
          </div>
          {search && (
            <div className="st-stat-chip">
              ಫಿಲ್ಟರ್: <strong>"{search}"</strong>
            </div>
          )}
        </div>

        {/* ── TABLE */}
        <div className="st-table-wrap">
          <div className="st-scroll">
            <table className="st-table">
              <colgroup>
                <col style={{ width: 52 }} />
                <col />
                <col style={{ width: 140 }} />
                <col style={{ width: 72 }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ಕ್ರ.ಸಂ</th>
                  <th className="th-left">ವಿವರಣೆ</th>
                  <th className="th-right">ಸಂಖ್ಯೆ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr className="st-empty">
                    <td colSpan={4}>ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ</td>
                  </tr>
                ) : (
                  filteredData.map((item: any, index: number) => (
                    <tr key={item._id}>
                      <td className="td-num">{index + 1}</td>
                      <td>{item.title}</td>
                      <td className="td-right">{item.value}</td>
                      <td className="st-action-cell">
                        <div className="st-actions">
                          <FiEdit
                            size={16}
                            className="st-edit-btn"
                            onClick={() => {
                              setEditData(item);
                              setOpenDataModal(true);
                            }}
                          />
                          <FiTrash2
                            size={16}
                            className="st-del-btn"
                            onClick={() => setDeleteId(item._id)}
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
        {openGroupModal && (
          <AddGroupModal
            taluk={taluk}
            close={() => setOpenGroupModal(false)}
          />
        )}

        {openDataModal && (
          <AddDataModal
            group={groupId}
            groups={groups}
            taluk={taluk}
            editData={editData}
            close={() => {
              setOpenDataModal(false);
              setEditData(null);
            }}
          />
        )}

        <DeleteModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
        />
      </div>
    </>
  );
};

export default StatisticsPage;