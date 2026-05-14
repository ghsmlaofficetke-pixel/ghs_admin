import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { createStatgroup } from "../../../api/statgroup";
import { FaPlus } from "react-icons/fa";

const AddGroupModal = ({ close, taluk }: { close: () => void; taluk: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(createStatgroup({ name, taluk }));
    close();
  };

  return (
    <>
      <style>{`
        @keyframes gm-fade-in  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes gm-slide-up { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:none; } }

        .gm-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; justify-content: center; align-items: center;
          z-index: 50; padding: 12px; animation: gm-fade-in 0.15s ease;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
        }
        .gm-modal {
          background: #fff; border-radius: 16px; padding: 24px; width: 100%; max-width: 400px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          animation: gm-slide-up 0.2s ease;
        }
        .gm-modal-header { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .gm-modal-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          background: #eff6ff; color: #2466d1;
        }
        .gm-modal-title { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }

        .gm-field { display: flex; flex-direction: column; gap: 5px; }
        .gm-field label { font-size: 12px; font-weight: 600; color: #64748b; }
        .gm-required { color: #ef4444; }
        .gm-field input {
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 8px 10px; font-size: 13px; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          background: #f8fafc; font-family: inherit; color: #1e293b;
        }
        .gm-field input:focus {
          border-color: #2466d1; box-shadow: 0 0 0 3px rgba(36,102,209,0.12); background: #fff;
        }

        .gm-modal-actions {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 18px; padding-top: 14px; border-top: 1px solid #f1f5f9;
        }
        .gm-btn {
          padding: 8px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; border: none; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .gm-btn:active { transform: scale(0.97); }
        .gm-btn-primary {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff; box-shadow: 0 2px 8px rgba(36,102,209,0.3);
        }
        .gm-btn-primary:hover { opacity: 0.9; }
        .gm-btn-ghost { background: #f1f5f9; color: #64748b; }
        .gm-btn-ghost:hover { background: #e2e8f0; }
      `}</style>

      <div className="gm-overlay" onClick={close}>
        <div className="gm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="gm-modal-header">
            <div className="gm-modal-icon">
              <FaPlus size={16} />
            </div>
            <h2 className="gm-modal-title">ಹೊಸ ಗುಂಪು ಸೇರಿಸಿ</h2>
          </div>

          <div className="gm-field">
            <label>ಗುಂಪಿನ ಹೆಸರು <span className="gm-required">*</span></label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ಗುಂಪಿನ ಹೆಸರು ನಮೂದಿಸಿ"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <div className="gm-modal-actions">
            <button className="gm-btn gm-btn-ghost" onClick={close}>
              ರದ್ದುಮಾಡಿ
            </button>
            <button className="gm-btn gm-btn-primary" onClick={handleSubmit}>
              ಉಳಿಸಿ
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddGroupModal;