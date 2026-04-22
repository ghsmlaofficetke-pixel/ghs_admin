import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import {
  fetchAllMainSchemData,
  schemSelector,
  createMainSchemData,
  updateMainSchemData,
  deleteMainSchemData,
} from "../../../api/schemdata";
import "./index.css"

import { Pencil, Trash2 } from "lucide-react";
import { FaArrowLeft, FaFileExcel, FaFilePdf } from "react-icons/fa";

import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";

type Props = {
  schemId: string;
  onBack: () => void;
};

type DataType = {
  _id?: string;
  year: string;
  administrative_department: string;
  work_description: string;
  implementation_department: string;
  amount: string;
  remark: string;
  status: string;
};

export default function SchemDetails({ schemId, onBack }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { mainData = [], current } = useSelector(schemSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<DataType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);

  const [form, setForm] = useState<DataType>({
    year: "",
    administrative_department: "",
    work_description: "",
    implementation_department: "",
    amount: "",
    remark: "",
    status: ""
  });

  /* ================= INIT ================= */
  useEffect(() => {
    dispatch(fetchAllMainSchemData(schemId));
  }, [dispatch, schemId]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return (mainData || []).filter((d: DataType) =>
      d.work_description?.toLowerCase().includes(search.toLowerCase())
      
    );
  }, [mainData, search]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (key: keyof DataType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      year: "",
      administrative_department: "",
      work_description: "",
      implementation_department: "",
      amount: "",
      remark: "",
      status:""
    });
    setEditData(null);
    setOpenModal(false);
  };

  /* ================= SAVE ================= */
  const handleSubmit = async () => {
    if (!form.year || !form.work_description) return;

    if (editData) {
      await dispatch(
        updateMainSchemData(editData._id!, {
          ...form,
          schem: schemId,
        }) as any
      );
    } else {
      await dispatch(
        createMainSchemData({
          ...form,
          schem: schemId,
        }) as any
      );
    }

    dispatch(fetchAllMainSchemData(schemId));
    resetForm();
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    if (!deleteId) return;

    await dispatch(deleteMainSchemData(deleteId, schemId) as any);

    dispatch(fetchAllMainSchemData(schemId));
    setDeleteId(null);
  };

  /* ================= EXCEL ================= */
  const exportExcel = () => {
    const data = filtered.map((item, i) => ({
      "Sl.No": i + 1,
      "ವರ್ಷ": item.year,
      "ಆಡಳಿತ ಇಲಾಖೆ": item.administrative_department,
      "ಕೆಲಸ": item.work_description,
      "ಅನುಷ್ಠಾನ ಇಲಾಖೆ": item.implementation_department,
      "ಮೊತ್ತ": item.amount,
      "ಗಮನಿಸಿ": item.remark,
      "status" : item.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scheme");
    XLSX.writeFile(wb, "Scheme.xlsx");
  };

  /* ================= PDF ================= */
  const exportPDF = async () => {
    const element = document.getElementById("schem-pdf");
    if (!element) return;

    setIsPdf(true);
    await new Promise((r) => setTimeout(r, 600));

    await (html2pdf() as any)
      .from(element)
      .set({
        margin: 10,
        filename: "Scheme.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "landscape" },
      })
      .save();

    setIsPdf(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow p-3 sticky top-0 z-30">

        <div className="flex justify-between items-center pb-2">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
          >
            <FaArrowLeft size={14} />
          </button>

          <h1 className="font-bold text-sm sm:text-base">
            {current?.name || "ಯೋಜನೆ ವಿವರಗಳು"}
          </h1>

          <button
            onClick={() => {
              setEditData(null);
              setForm({
                year: "",
                administrative_department: "",
                work_description: "",
                implementation_department: "",
                amount: "",
                remark: "",
                status: "",
              });
              setOpenModal(true);
            }}
            className="px-3 h-9 rounded-lg bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm"
          >
            + ಸೇರಿಸಿ
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-col lg:flex-row gap-2 mt-2">
          <input
            placeholder="ಹುಡುಕಿ..."
            className="border p-2 rounded flex-1"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            <button
              onClick={exportExcel}
              className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1"
            >
              <FaFileExcel /> Excel
            </button>

            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1"
            >
              <FaFilePdf /> PDF
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div
        id="schem-pdf"
        className={`overflow-x-auto border ${
          isPdf ? "" : "max-h-full overflow-y-auto mt-2"
        }`}
      >
        <table className="min-w-full border text-sm">

          <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0">
            <tr>
              <th className="p-2 text-start">Sl.No</th>
              <th className="p-2 text-start">ವರ್ಷ</th>
              <th className="p-2 text-start">ಆಡಳಿತ ಇಲಾಖೆ</th>
              <th className="p-2 text-start">ಕಾಮಗಾರಿಯ ವಿವರಣೆ</th>
               <th className="p-2 text-start">ಮೊತ್ತ</th>
              <th className="p-2 text-start">ಅನುಷ್ಠಾನ ಇಲಾಖೆ</th>           
              <th className="p-2 text-start">ಷರಾ</th>
              <th className="p-2 text-start">Status</th>
              {!isPdf && <th className="p-2 text-center">Action</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-4 text-gray-400">
                  ಡೇಟಾ ಇಲ್ಲ
                </td>
              </tr>
            ) : (
              filtered.map((d, i) => (
                <tr key={d._id} className="hover:bg-gray-50">

                  <td className="p-2 border text-center">{i + 1}</td>
                  <td className="p-2 border">{d.year}</td>
                  <td className="p-2 border">{d.administrative_department}</td>
                  <td className="p-2 border break-words max-w-[250px]">
                    {d.work_description}
                  </td>
                  <td className="p-2 border">₹ {d.amount}</td>
                  <td className="p-2 border">{d.implementation_department}</td>
                   
                  <td className="p-2 border">{d.remark}</td>
                    <td className="p-2 border">{d.status}</td>

                  {!isPdf && (
                    <td className="p-2 border text-center">
                      <div className="flex justify-center gap-2">
                        <Pencil
                          size={16}
                          className="text-blue-600 cursor-pointer"
                          onClick={() => {
                            setForm(d);
                            setEditData(d);
                            setOpenModal(true);
                          }}
                        />
                        <Trash2
                          size={16}
                          className="text-red-600 cursor-pointer"
                          onClick={() => setDeleteId(d._id!)}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {openModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3">
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-xl">

      {/* HEADER */}
      <h2 className="text-lg font-semibold text-gray-800">
        {editData ? "ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಮಾಹಿತಿ"}
      </h2>

      {/* FORM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* YEAR */}
        <input
          placeholder="ವರ್ಷ"
          value={form.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* ADMIN DEPT */}
        <input
          placeholder="ಆಡಳಿತ ಇಲಾಖೆ"
          value={form.administrative_department}
          onChange={(e) =>
            handleChange("administrative_department", e.target.value)
          }
          className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* WORK DESCRIPTION FULL */}
        <textarea
          placeholder="ಕಾಮಗಾರಿಯ ವಿವರಣೆ"
          value={form.work_description}
          onChange={(e) =>
            handleChange("work_description", e.target.value)
          }
          className="border border-slate-400  p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* IMPLEMENTATION */}
        <input
          placeholder="ಅನುಷ್ಠಾನ ಇಲಾಖೆ"
          value={form.implementation_department}
          onChange={(e) =>
            handleChange("implementation_department", e.target.value)
          }
          className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* AMOUNT */}
        <input
          placeholder="ಮೊತ್ತ"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          className="border border-slate-400  p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
        />

        {/* REMARK FULL */}
        <textarea
          placeholder="ಷರಾ"
          value={form.remark}
          onChange={(e) => handleChange("remark", e.target.value)}
          className="border border-slate-400  p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        />

         <textarea
          placeholder="Status"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border border-slate-400  p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={resetForm}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          ರದ್ದು
        </button>

        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition"
        >
          ಉಳಿಸಿ
        </button>
      </div>

    </div>
  </div>
)}

      {/* DELETE */}
      {deleteId && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setDeleteId(null)}
  >
    <div
      className="bg-white p-5 rounded-xl w-full max-w-sm shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold mb-3 text-red-600">
        ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?
        <br />
        ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
        >
          ರದ್ದುಮಾಡಿ
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          ಅಳಿಸಿ
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}