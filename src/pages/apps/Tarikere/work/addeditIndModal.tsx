import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

import {
  createIndividualWork,
  updateIndividualWork,
} from "../../../../api/individualwork";

interface Props {
  open: boolean;
  onClose: () => void;
  villageId: string;
  editData?: any | null;
}

const initialState = {
  name: "",
  mobile: "",
  scheme: "",
  address: "",
  orderNumber: "",
};

export default function AddEditVillageIndModal({
  open,
  onClose,
  villageId,
  editData,
}: Props) {

  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState(initialState);

  /* =========================
     Load Edit Data
  ========================= */

  useEffect(() => {

    if (editData) {

      setForm({
        name: editData.name || "",
        mobile: editData.mobile || "",
        scheme: editData.scheme || "",
        address: editData.address || "",
        orderNumber: editData.orderNumber || "",
      });

    } else {

      setForm(initialState);

    }

  }, [editData, open]);

  /* =========================
     Input Change
  ========================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  /* =========================
     Submit
  ========================= */

  const handleSubmit = () => {

    if (!form.name || !form.scheme) {

      alert("ಹೆಸರು ಮತ್ತು ಯೋಜನೆ ಕಡ್ಡಾಯ");

      return;

    }

    const payload = {
      ...form,
      village: villageId,
    };

    if (editData?._id) {

      dispatch(updateIndividualWork(editData._id, payload));

    } else {

      dispatch(createIndividualWork(payload));

    }

    onClose();

  };

  if (!open) return null;

  return (

 <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3"
  onClick={onClose}
>
  <div
    className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6"
    onClick={(e) => e.stopPropagation()}
  >

    {/* ===== HEADER ===== */}
    <div className="flex justify-between items-center border-b pb-2 mb-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        {editData
          ? "ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಯ ವಿವರ ಸಂಪಾದನೆ"
          : "ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಯ ವಿವರ ಸೇರಿಸಿ"}
      </h2>

      <button
        onClick={onClose}
        className="text-lg font-semibold text-gray-500 hover:text-black"
      >
        ×
      </button>
    </div>

    {/* ===== FORM ===== */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

      {/* NAME */}
      <input
        name="name"
        placeholder="ಹೆಸರು"
        value={form.name}
        onChange={handleChange}
        className="border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* MOBILE */}
      <input
        name="mobile"
        placeholder="ಮೊಬೈಲ್ ನಂಬರ್"
        value={form.mobile}
        onChange={handleChange}
        className="border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* SCHEME */}
      <input
        name="scheme"
        placeholder="ಯೋಜನೆ"
        value={form.scheme}
        onChange={handleChange}
        className="border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* ORDER NUMBER */}
      <input
        name="orderNumber"
        placeholder="ಆದೇಶ ಸಂಖ್ಯೆ"
        value={form.orderNumber}
        onChange={handleChange}
        className="border border-slate-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* ADDRESS FULL */}
      <textarea
        name="address"
        placeholder="ವಿಳಾಸ"
        value={form.address}
        onChange={handleChange}
        className="border border-slate-300 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        rows={3}
      />

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
        {editData ? "Update" : "Save"}
      </button>

    </div>
  </div>
</div>

  );

}