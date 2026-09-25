import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import { createWardmanavi, updateWardmanavi } from "../../../../../api/wardmanavi";

interface Props {
  open: boolean;
  onClose: () => void;
  wardId: string;
  editData?: any | null;
}

/* ═══════════════════════════════════════════════════════════
   CUSTOM DROPDOWN  (identical to village version)
═══════════════════════════════════════════════════════════ */
function CustomDropdown({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full border rounded px-3 py-2 text-sm bg-white text-left flex justify-between items-center"
      >
        <span className="truncate">{value || placeholder}</span>
        <span className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
          {options.length ? (
            options.map((opt) => (
              <div
                key={opt}
                className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">No options</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   OPTIONS  (shared with village modal — same lists)
═══════════════════════════════════════════════════════════ */
const TYPE_OPTIONS = ["ಸಮುದಾಯ", "ವೈಯಕ್ತಿಕ"];

const SAMUDAYA_WORKS = [
  "ರಸ್ತೆ ಕಾಮಗಾರಿ", "ಚರಂಡಿ ಕಾಮಗಾರಿ", "ಜಲ್ಲಿ ಮೆಟ್ಲಿಂಗ್", "ದೇವಾಲಯ",
  "ಸಮುದಾಯ ಭವನ", "ಶಾಲೆ", "ಕಾಲೇಜು", "ಅಂಗನವಾಡಿ", "ಚೆಕ್ ಡ್ಯಾಮ್",
  "ಸೇತುವೆ ಕಾಮಗಾರಿ", "ಸ್ಮಶಾನ", "ಕುಡಿಯುವ ನೀರು",
  "ಸೋಲಾರ್‌/ಹೈಮಾಸ್ಟ್‌ ಲೈಟ್", "ಹಕ್ಕುಪತ್ರ ವಿತರಣೆ", "ಕೆರೆ ಅಭಿವೃದ್ಧಿ", "ಇತರೆ",
];

const VAIYAKTIKA_WORKS = [
  "ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿ", "ಈರುಳ್ಳಿ ಶೆಡ್", "ಗಂಗಾ ಕಲ್ಯಾಣ", "ನೇರಸಾಲ",
  "ಉದ್ಯಮ ಶೀಲತಾ", "ಸ್ವಾವಲಂಬಿ ಸಾರಥಿ", "ವಿದ್ಯುತ್ ಪರಿವರ್ತಕ (TC)", "ಉದ್ಯೋಗಿನಿ",
  "ತ್ರಿಚಕ್ರ ವಾಹನ", "ಅಮೃತ ಸಿರಿ", "ಕೌ ಮ್ಯಾಟ್", "ಹೊಲಿಗೆ ಯಂತ್ರ",
  "ಅಡಿಕೆ ಸಂಸ್ಕರಣೆ ಘಟಕ", "ನಾಮಿನಿ ಮೆಂಬರ್ಸ್", "ಕುರಿ ಲೋನ್ Veternary Department",
  "ಶ್ರಮಶಕ್ತಿ ಯೋಜನೆ", "ವೃತ್ತಿ ಪ್ರೋತ್ಸಾಹ", "ಕಾರ್ಮಿಕ ಇಲಾಖೆಯ ಕಿಟ್ ಸೌಲಭ್ಯ",
  "ಹೊರಗುತ್ತಿಗೆ ಕೆಲಸ", "ಬಗರ್‌ ಹುಕ್ಕುಂ", "ಪಿಂಚಣಿ ಯೋಜನೆಗಳು", "ಇತರೆ",
];

const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

/* ═══════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════ */
export default function AddEditWardManaviModal({ open, onClose, wardId, editData }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [type,        setType]        = useState("");
  const [work,        setWork]        = useState("");
  const [caste,       setCaste]       = useState("");
  const [description, setDescription] = useState("");
  const [refer,       setRefer]       = useState("");
  const [status,      setStatus]      = useState("");

  useEffect(() => {
    if (editData) {
      setType(editData.type || "");
      setWork(editData.work || "");
      setCaste(editData.caste || "");
      setDescription(editData.description || "");
      setRefer(editData.refer || "");
      setStatus(editData.status || "");
    } else {
      setType(""); setWork(""); setCaste("");
      setDescription(""); setRefer(""); setStatus("");
    }
  }, [editData, open]);

  if (!open) return null;

  const workOptions =
    type === "ಸಮುದಾಯ"  ? SAMUDAYA_WORKS  :
    type === "ವೈಯಕ್ತಿಕ" ? VAIYAKTIKA_WORKS : [];

  const handleSubmit = () => {
    if (!type) return alert("ಪ್ರಕಾರ ಆಯ್ಕೆ ಮಾಡಿ");
    if (!work) return alert("ಕೆಲಸ ಆಯ್ಕೆ ಮಾಡಿ");

    const payload: any = { type, work, caste, description, refer, ward: wardId };
    if (editData?._id) {
      payload.status = status;
      dispatch(updateWardmanavi(editData._id, payload));
    } else {
      dispatch(createWardmanavi(payload));
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-800">
          {editData ? "ಮನವಿ ತಿದ್ದುಪಡಿ" : "ಮನವಿ ಸೇರಿಸಿ"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* TYPE */}
          <div className="col-span-full">
            <label className="block text-sm mb-1">ಪ್ರಕಾರ / Type</label>
            <CustomDropdown
              value={type}
              onChange={(val) => { setType(val); setWork(""); setCaste(""); }}
              placeholder="Select Type"
              options={TYPE_OPTIONS}
            />
          </div>

          {/* WORK */}
          {type && (
            <div className="col-span-full">
              <label className="block text-sm mb-1">ಕೆಲಸ / Work</label>
              <CustomDropdown
                value={work}
                onChange={setWork}
                placeholder="Select Work"
                options={workOptions}
              />
            </div>
          )}

          {/* CASTE — only for ವೈಯಕ್ತಿಕ */}
          {type === "ವೈಯಕ್ತಿಕ" && (
            <input
              value={caste}
              onChange={(e) => setCaste(e.target.value)}
              placeholder="ಜಾತಿ / Caste"
              className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none col-span-full"
            />
          )}

          {/* DESCRIPTION */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ವಿವರಣೆ / Description"
            className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
            rows={3}
          />

          {/* REFER */}
          <input
            value={refer}
            onChange={(e) => setRefer(e.target.value)}
            placeholder="ಉಲ್ಲೇಖಿಸಿದವರು / Refer By"
            className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none col-span-full"
          />

          {/* STATUS — only on edit, uses dropdown like ward version */}
          {editData && (
            <div className="col-span-full">
              <label className="block text-sm mb-1">Status</label>
              <CustomDropdown
                value={status}
                onChange={setStatus}
                placeholder="Select Status"
                options={STATUS_OPTIONS}
              />
            </div>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
          >
            ರದ್ದು
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition"
          >
            {editData ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}