import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createStatdata, updateStatdata } from "../../../api/statdata";
import { FiEdit } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

interface Props {
  close: () => void;
  group: string;
  groups: any[];
  editData?: any;
  taluk: string;
}

const AddDataModal = ({ close, group, groups, editData, taluk }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(group);

  /* ── AUTO FILL */
  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setValue(editData.value || "");
      setSelectedGroup(
        typeof editData.group === "object"
          ? editData.group._id
          : editData.group || group
      );
    } else {
      setTitle("");
      setValue("");
      setSelectedGroup(group);
    }
  }, [editData, group]);

  /* ── SUBMIT */
  const handleSubmit = () => {
    if (!title || !value || !selectedGroup || !taluk) {
      alert("All fields required");
      return;
    }
    const payload = { title, value, group: selectedGroup, taluk };
    if (editData) {
      dispatch(updateStatdata(editData._id, payload));
    } else {
      dispatch(createStatdata(payload));
    }
    close();
  };

  return (
    <>
      <style>{`
        @keyframes dm-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes dm-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .dm-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px; animation: dm-fade-in 0.15s ease;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
        }
        .dm-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%; max-width: 500px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: dm-slide-up 0.2s ease; max-height: 90vh; overflow-y: auto;
        }
        .dm-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .dm-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: #eff6ff; color: #2466d1;
        }
        .dm-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }

        .dm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dm-field { display: flex; flex-direction: column; gap: 5px; }
        .dm-field.dm-full { grid-column: 1 / -1; }
        .dm-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .dm-required { color: #ef4444; }
        .dm-field input, .dm-field select {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; font-family: inherit; color: #1e293b;
        }
        .dm-field input:focus, .dm-field select:focus {
          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;
        }

        .dm-modal-actions {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9;
        }
        .dm-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .dm-btn:active { transform: scale(0.97); }
        .dm-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .dm-btn-primary:hover { opacity: 0.9; }
        .dm-btn-ghost { background: #f1f5f9; color: #64748b; }
        .dm-btn-ghost:hover { background: #e2e8f0; }

        @media (max-width: 480px) {
          .dm-form-grid { grid-template-columns: 1fr; }
          .dm-field.dm-full { grid-column: 1 / -1; }
        }
      `}</style>

      <div className="dm-overlay" onClick={close}>
        <div className="dm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dm-modal-header">
            <div className="dm-modal-icon">
              {editData ? <FiEdit size={18} /> : <FaPlus size={18} />}
            </div>
            <h2 className="dm-modal-title">
              {editData ? "ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ" : "ಮಾಹಿತಿ ಸೇರಿಸಿ"}
            </h2>
          </div>

          <div className="dm-form-grid">
            <div className="dm-field dm-full">
              <label>ಗುಂಪು <span className="dm-required">*</span></label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">ಆಯ್ಕೆ ಮಾಡಿ</option>
                {groups.map((g: any) => (
                  <option key={g._id} value={g._id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="dm-field">
              <label>ವಿವರಣೆ <span className="dm-required">*</span></label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ವಿವರಣೆ ನಮೂದಿಸಿ"
              />
            </div>

            <div className="dm-field">
              <label>ಸಂಖ್ಯೆ <span className="dm-required">*</span></label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="ಸಂಖ್ಯೆ ನಮೂದಿಸಿ"
              />
            </div>
          </div>

          <div className="dm-modal-actions">
            <button className="dm-btn dm-btn-ghost" onClick={close}>
              ರದ್ದುಮಾಡಿ
            </button>
            <button className="dm-btn dm-btn-primary" onClick={handleSubmit}>
              ಉಳಿಸಿ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDataModal;