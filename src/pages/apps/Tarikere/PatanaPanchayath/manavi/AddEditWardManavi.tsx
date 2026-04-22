import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";
import {createWardmanavi,updateWardmanavi,} from "../../../../../api/wardmanavi";

interface Props {
  open: boolean;
  onClose: () => void;
  wardId: string;
  editData?: any | null;
}

/* ===== Custom Dropdown ===== */

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
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
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
        onClick={() => setOpen(!open)}
        className="w-full border rounded px-3 py-2 text-sm bg-white text-left flex justify-between items-center"
      >
        <span className="truncate">{value || placeholder}</span>

        <span
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
     <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
          {options.length ? (
            options.map((opt) => (
              <div
                key={opt}
                className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AddEditWardManaviModal({
  open,
  onClose,
  wardId,
  editData,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [type, setType] = useState("");
  const [work, setWork] = useState("");
  const [caste, setCaste] = useState("");
  const [description, setDescription] = useState("");
  const [refer, setRefer] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (editData) {
      setType(editData.type || "");
      setWork(editData.work || "");
       setCaste(editData.caste || "");
      setDescription(editData.description || "");
      setRefer(editData.refer || "");
      setStatus(editData.status || "");
    } else {
       setType("");
      setWork("");
      setCaste("");
      setDescription("");
      setRefer("");
      setStatus("");
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!work) return alert("Work is required");

    const payload: any = {
      type,
      work,
      caste,
      description,
      refer,
      ward: wardId,
    };

    if (editData?._id) {
      payload.status = status;
      dispatch(updateWardmanavi(editData._id, payload));
    } else {
      dispatch(createWardmanavi(payload));
    }

    onClose();
  };

  /* ===== Work Options ===== */

  const typeOptions = ["ಸಮುದಾಯ", "ವೈಯಕ್ತಿಕ"];

  const samudayaWorks = [
    "ರಸ್ತೆ ಕಾಮಗಾರಿ",
    "ಚರಂಡಿ ಕಾಮಗಾರಿ",
    "ಜಲ್ಲಿ ಮೆಟ್ಲಿಂಗ್",
    "ದೇವಾಲಯ",
    "ಸಮುದಾಯ ಭವನ",
    "ಶಾಲೆ",
    "ಕಾಲೇಜು",
    "ಅಂಗನವಾಡಿ",
    "ಚೆಕ್ ಡ್ಯಾಮ್",
    "ಸೇತುವೆ ಕಾಮಗಾರಿ",
    "ಸ್ಮಶಾನ",
    "ಕುಡಿಯುವ ನೀರು",
    "ಸೋಲಾರ್‌/ಹೈಮಾಸ್ಟ್‌ ಲೈಟ್",
    "ಹಕ್ಕುಪತ್ರ ವಿತರಣೆ",
    "ಇತರೆ",
  ];

  const vaiyaktikaWorks = [
   "ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿ",
    "ಈರುಳ್ಳಿ ಶೆಡ್",
    "ಗಂಗಾ ಕಲ್ಯಾಣ",
    "ನೇರಸಾಲ",
    "ಉದ್ಯಮ ಶೀಲತಾ",
    "ಸ್ವಾವಲಂಬಿ ಸಾರಥಿ",
    "ವಿದ್ಯುತ್ ಪರಿವರ್ತಕ (TC)",
    "ಉದ್ಯೋಗಿನಿ",
    "ತ್ರಿಚಕ್ರ ವಾಹನ",
    "ಅಮೃತ ಸಿರಿ",
    "ಕೌ ಮ್ಯಾಟ್",
    "ಹೊಲಿಗೆ ಯಂತ್ರ",
    "ಅಡಿಕೆ ಸಂಸ್ಕರಣೆ ಘಟಕ",
    "ನಾಮಿನಿ ಮೆಂಬರ್ಸ್",
    "ಕುರಿ ಲೋನ್ Veternary Department",
    "ಶ್ರಮಶಕ್ತಿ ಯೋಜನೆ",
    "ವೃತ್ತಿ ಪ್ರೋತ್ಸಾಹ",
    "ಕಾರ್ಮಿಕ ಇಲಾಖೆಯ ಕಿಟ್ ಸೌಲಭ್ಯ",
    "ಹೊರಗುತ್ತಿಗೆ ಕೆಲಸ",
    "ಬಗರ್‌ ಹುಕ್ಕುಂ",
    "ಪಿಂಚಣಿ ಯೋಜನೆಗಳು",
    "ಇತರೆ"

  ];

    const workOptions =
    type === "ಸಮುದಾಯ"
      ? samudayaWorks
      : type === "ವೈಯಕ್ತಿಕ"
      ? vaiyaktikaWorks
      : [];


  const statusOptions = ["Pending", "Approved", "Rejected"];

  return (
    <div
  className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3"
  onClick={onClose}
>
  <div
    className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6"
    onClick={(e) => e.stopPropagation()}
  >

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center border-b pb-2 mb-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        {editData ? "Edit ಮನವಿ" : "Add ಮನವಿ"}
      </h2>
    </div>

    {/* ===== FORM ===== */}
    <div className="space-y-3 text-sm">

      {/* TYPE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಪ್ರಕಾರ / Type
        </label>
        <CustomDropdown
          value={type}
          onChange={(val) => {
            setType(val);
            setWork("");
            setCaste("");
          }}
          placeholder="Select Type"
          options={typeOptions}
        />
      </div>

      {/* WORK */}
      {type && (
        <div>
          <label className="block text-sm font-medium mb-1">
            ಕೆಲಸ / Work
          </label>
          <CustomDropdown
            value={work}
            onChange={setWork}
            placeholder="Select Work"
            options={workOptions}
          />
        </div>
      )}

      {/* CASTE */}
      {type === "ವೈಯಕ್ತಿಕ" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            ಜಾತಿ / Caste
          </label>
          <input
            value={caste}
            onChange={(e) => setCaste(e.target.value)}
            className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      )}

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ವಿವರಣೆ / Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          rows={3}
        />
      </div>

      {/* REFER */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಉಲ್ಲೇಖಿಸಿದವರು / ReferBy
        </label>
        <input
          value={refer}
          onChange={(e) => setRefer(e.target.value)}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      {/* STATUS */}
      {editData && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <CustomDropdown
            value={status}
            onChange={setStatus}
            placeholder="Select Status"
            options={statusOptions}
          />
        </div>
      )}

    </div>

    {/* ===== FOOTER ===== */}
    <div className="flex justify-end gap-2 mt-5 pt-3 border-t">

      <button
        onClick={onClose}
        className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={handleSubmit}
        className="px-5 py-2 text-sm rounded text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition"
      >
        {editData ? "Update" : "Create"}
      </button>

    </div>
  </div>
</div>
  );
}