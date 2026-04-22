
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../redux/store";

import {
  createWardComWork,
  updateWardComWork,
} from "../../../../../api/wardcomwork";

type Props = {
  open: boolean;
  onClose: () => void;
  wardId: string;
  editData?: any;
};

export default function AddEditWardComModal({
  open,
  onClose,
  wardId,
  editData,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    workDetails: "",
    estimatedAmount: "",
    scheme: "",
    department: "",
    letterNumber: "",
    remarks: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        workDetails: editData.workDetails || "",
        estimatedAmount: editData.estimatedAmount || "",
        scheme: editData.scheme || "",
        department: editData.department || "",
        letterNumber: editData.letterNumber || "",
        remarks: editData.remarks || "",
      });
    } else {
      setFormData({
        workDetails: "",
        estimatedAmount: "",
        scheme: "",
        department: "",
        letterNumber: "",
        remarks: "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


   const handleSubmit = () => {
      if (!formData.workDetails || !formData.scheme) {
        alert("ಕಾಮಗಾರಿಯ ವಿವರಗಳು ಅಗತ್ಯ");
        return;
      }
  
      const payload = {
        ...formData,
        ward: wardId,
        estimatedAmount: Number(formData.estimatedAmount) || 0,
      };
  
      if (editData?._id) {
        dispatch(updateWardComWork(editData._id, payload));
      } else {
        dispatch(createWardComWork(payload));
      }
  
      onClose();
    };

  return (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">

  <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-5">

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center border-b pb-2">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        ಸಮುದಾಯ ಕಾಮಗಾರಿಯ ವಿವರ
      </h2>

      <button
        onClick={onClose}
        className="text-gray-500 text-lg font-semibold hover:text-black"
      >
        ×
      </button>
    </div>

    {/* ===== FORM ===== */}
    <div className="space-y-3 text-sm">

      {/* WORK DETAILS (FULL) */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಕಾಮಗಾರಿಯ ವಿವರ
        </label>

        <textarea
          name="workDetails"
          value={formData.workDetails}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          rows={3}
        />
      </div>

      {/* AMOUNT + SCHEME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div>
          <label className="block text-sm font-medium mb-1">
            ಅಂದಾಜು ಮೊತ್ತ (₹)
          </label>

          <input
            type="number"
            name="estimatedAmount"
            value={formData.estimatedAmount}
            onChange={handleChange}
            className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            ಯೋಜನೆ
          </label>

          <input
            type="text"
            name="scheme"
            value={formData.scheme}
            onChange={handleChange}
            className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

      </div>

      {/* DEPARTMENT */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಅನುಷ್ಠಾನ ಇಲಾಖೆ
        </label>

        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      {/* LETTER NUMBER */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಪತ್ರ ಸಂಖ್ಯೆ
        </label>

        <input
          type="text"
          name="letterNumber"
          value={formData.letterNumber}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      {/* REMARKS */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ಷರಾ / Remarks
        </label>

        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          rows={2}
        />
      </div>

    </div>

    {/* ===== FOOTER ===== */}
    <div className="flex justify-end gap-2 pt-3 border-t">

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
        {editData ? "Update" : "Save"}
      </button>

    </div>

  </div>
</div>
  );
}
