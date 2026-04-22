import { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  createCommunityWork,
  updateCommunityWork,
} from "../../../../api/communitywork";

interface Props {
  open: boolean;
  onClose: () => void;
  villageId: string;
  editData?: any | null;
}

export default function AddEditCommunityWorkModal({
  open,
  onClose,
  villageId,
  editData,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    workDetails: "",
    estimatedAmount: "",
    scheme: "",
    department: "",
    letterNumber: "",
    remarks: "",
  });

  /* ================= PREFILL EDIT ================= */
  useEffect(() => {
    if (editData) {
      setForm({
        workDetails: editData.workDetails || "",
        estimatedAmount: editData.estimatedAmount || "",
        scheme: editData.scheme || "",
        department: editData.department || "",
        letterNumber: editData.letterNumber || "",
        remarks: editData.remarks || "",
      });
    } else {
      setForm({
        workDetails: "",
        estimatedAmount: "",
        scheme: "",
        department: "",
        letterNumber: "",
        remarks: "",
      });
    }
  }, [editData, open]);

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!form.workDetails || !form.scheme) {
      alert("ಕಾಮಗಾರಿಯ ವಿವರಗಳು ಅಗತ್ಯ");
      return;
    }

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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 px-3">
  <div
    ref={modalRef}
    className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-5"
  >

    {/* HEADER */}
    <div className="flex justify-between items-center border-b pb-2">
      <h3 className="text-lg font-semibold text-gray-800">
        {editData
          ? "ಸಮುದಾಯ ಕಾಮಗಾರಿ ತಿದ್ದುಪಡಿ / ಸೇರಿಸಿ"
          : "ಸಮುದಾಯ ಕಾಮಗಾರಿ ಸೇರಿಸಿ"}
      </h3>
      <button onClick={onClose} className="text-gray-500 hover:text-red-500">
        <FaTimes />
      </button>
    </div>

    {/* FORM */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

      {/* WORK DETAILS */}
      <textarea
        value={form?.workDetails}
        onChange={(e) =>
          setForm({ ...form, workDetails: e.target.value })
        }
        placeholder="ಕಾಮಗಾರಿಯ ವಿವರ"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        rows={2}
      />

      {/* AMOUNT */}
      <input
        type="number"
        value={form.estimatedAmount}
        onChange={(e) =>
          setForm({ ...form, estimatedAmount: e.target.value })
        }
        placeholder="ಅಂದಾಜು ಮೊತ್ತ (₹)"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* SCHEME */}
      <input
        value={form.scheme}
        onChange={(e) =>
          setForm({ ...form, scheme: e.target.value })
        }
        placeholder="ಯೋಜನೆ"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* DEPARTMENT */}
      <input
        value={form.department}
        onChange={(e) =>
          setForm({ ...form, department: e.target.value })
        }
        placeholder="ಅನುಷ್ಠಾನ ಇಲಾಖೆ"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* LETTER */}
      <input
        value={form.letterNumber}
        onChange={(e) =>
          setForm({ ...form, letterNumber: e.target.value })
        }
        placeholder="ಪತ್ರ ಸಂಖ್ಯೆ"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* REMARKS */}
      <textarea
        value={form.remarks}
        onChange={(e) =>
          setForm({ ...form, remarks: e.target.value })
        }
        placeholder="ಷರಾ / Remarks"
        className="border border-slate-400 p-2 rounded text-sm placeholder:text-gray-400 col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        rows={2}
      />
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
        {editData ? "Update" : "Save"}
      </button>
    </div>

  </div>
</div>
  );
}
