import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import "./index.css"

import {
  fetchAllMLALADD,
  createMLALADD,
  updateMLALADD,
  deleteMLALADD,
  mlaladdSelector,
} from "../../../api/mlaladd";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaArrowLeft, FaFileExcel, FaFilePdf } from "react-icons/fa";

import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import { string } from "yup";

/* ================= MODAL ================= */
const MLALADDModal = ({ close, editData, onSave }: any) => {
  const [form, setForm] = useState({
    year: "",
    phase: "1ನೇ ಕಂತು",
    work_description: "",
    amount: "",
    department: "",
    remark: "",
    status: ""
  });

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-3"
      onClick={close}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-800">
          {editData ? "ತಿದ್ದುಪಡಿ" : "ಹೊಸ ದಾಖಲೆ"}
        </h2>

        {/* FORM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {/* YEAR */}
          <input
            placeholder="ವರ್ಷ"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />

          {/* PHASE */}
          <select
            value={form.phase}
            onChange={(e) => setForm({ ...form, phase: e.target.value })}
            className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option>1ನೇ ಕಂತು</option>
            <option>2ನೇ ಕಂತು</option>
            <option>3ನೇ ಕಂತು</option>
            <option>4ನೇ ಕಂತು</option>
          </select>

          {/* WORK DESCRIPTION FULL */}
          <textarea
            placeholder="ವಿವರಣೆ"
            value={form.work_description}
            onChange={(e) =>
              setForm({ ...form, work_description: e.target.value })
            }
            className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
          />

          {/* DEPARTMENT */}
          <input
            placeholder="ಇಲಾಖೆ"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
            className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />

          {/* AMOUNT */}
          <input
            placeholder="ಮೊತ್ತ"
            type="string"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
            className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
          />

          {/* REMARK FULL */}
          <input
            placeholder="ಷರಾ"
            value={form.remark}
            onChange={(e) =>
              setForm({ ...form, remark: e.target.value })
            }
            className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
          />

          <input
            placeholder="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={close}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
          >
            ರದ್ದುಮಾಡಿ
          </button>

          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition"
          >
            ಉಳಿಸಿ
          </button>
        </div>

      </div>
    </div>
  );
};

/* ================= MAIN ================= */
export default function MLALADDPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(mlaladdSelector);

  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  

  const [isPdf, setIsPdf] = useState(false);


  useEffect(() => {
    dispatch(fetchAllMLALADD());
  }, [dispatch]);

  /* FILTER */
const filteredData = useMemo(() => {
  const clean = (val: any) =>
    (val || "")
      .toString()
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const searchText = clean(search);

  return list.filter((item: any) => {
    const year = clean(item.year);
    const phase = clean(item.phase);
    const dept = clean(item.department);
    const desc = clean(item.work_description);
    const remark = clean(item.remark);
    const amount = clean(item.amount);
    const status = clean(item.status);

    // 👉 Only search if 2+ letters
    const matchesSearch =
      searchText.length < 1
        ? true
        : (
            year.includes(searchText) ||
            phase.includes(searchText) ||
            dept.includes(searchText) ||
            desc.includes(searchText) ||
            remark.includes(searchText) ||
            amount.includes(searchText) ||
            status.includes(searchText)
          );

    return (
      (!yearFilter || year === clean(yearFilter)) &&
      (!phaseFilter || phase === clean(phaseFilter)) &&
      matchesSearch
    );
  });
}, [list, search, yearFilter, phaseFilter]);

  /* SAVE */
 const handleSave = async (form: any) => {
  const payload = {
    ...form,
  };

  if (editData) {
    await dispatch(updateMLALADD(editData._id, payload));
  } else {
    await dispatch(createMLALADD(payload));
  }

  dispatch(fetchAllMLALADD());
  setOpenModal(false);
  setEditData(null);
};

  /* DELETE */
  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteMLALADD(deleteId));
      dispatch(fetchAllMLALADD());
      setDeleteId(null);
    }
  };

  /* EXCEL */
  const exportExcel = () => {
    const data = filteredData.map((item: any, i: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": i + 1,
      "ವರ್ಷ": item.year,
      "ಕಂತು": item.phase,
      "ಇಲಾಖೆ": item.department,
      "ವಿವರಣೆ": item.work_description,
      "ಮೊತ್ತ": item.amount,
      "ಷರಾ": item.remark,
      "Status": item.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MLALADD");
    XLSX.writeFile(wb, "MLALADD.xlsx");
  };

  /* PDF (UPDATED) */
 const exportPDF = async () => {
  const element = document.getElementById("mlaladd-pdf");
  if (!element) return;

  setIsPdf(true);

  await new Promise((r) => setTimeout(r, 800)); // important

  const opt = {
    margin: 10,
    filename: "MLALADD.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
    },
  };

  await (html2pdf() as any).from(element).set(opt).save();

  setIsPdf(false);
};

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow p-3 sticky top-0 z-30">
        <div className="flex justify-between items-center pb-2">
           <button
      onClick={() => window.history.back()}
      className="w-9 h-9 flex items-center sm:hidden justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
    >
      <FaArrowLeft size={14} />
    </button>

          <h1 className="font-bold text-sm sm:text-base">MLA-LAD Works</h1>

          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="px-3 h-9 rounded-lg bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm"
          >
            + ಸೇರಿಸಿ
          </button>
        </div>

        {/* FILTER */}
        <div className="mt-2 flex flex-col lg:flex-row gap-2">
          <input placeholder="ವರ್ಷ" className="border p-2 rounded w-full lg:w-32 border-gray-400" onChange={(e) => setYearFilter(e.target.value)} />

          <select className="border p-2 rounded w-full lg:w-44" onChange={(e) => setPhaseFilter(e.target.value)}>
            <option value="">All</option>
            <option>1ನೇ ಕಂತು</option>
            <option>2ನೇ ಕಂತು</option>
            <option>3ನೇ ಕಂತು</option>
            <option>4ನೇ ಕಂತು</option>
          </select>

          <input placeholder="ಹುಡುಕಿ..." className=" border-gray-400 border p-2 rounded  lg:flex-1" onChange={(e) => setSearch(e.target.value)} />

         <div className="flex justify-end gap-4">
          <button onClick={exportExcel} className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
            <FaFileExcel /> Excel
          </button>

          <button onClick={exportPDF} className="bg-red-600 text-white px-2 py-1 rounded flex items-center gap-1">
            <FaFilePdf /> PDF
          </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
  <div className="flex-1 min-h-0">
  <div
    id="mlaladd-pdf"
    className={`border rounded flex flex-col h-full ${
      isPdf ? "" : "bg-white mt-2"
    }`}
  >

    {/* TABLE WRAPPER */}
     <div className={`${isPdf ? "" : "flex-1"} w-full overflow-x-auto`}>
      
      <table className="min-w-[900px] md:min-w-full border text-sm page-break-table">
        
        {/* HEADER */}
        <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20 shadow">
          <tr>
            <th className="border p-2 w-[70px] whitespace-nowrap">Sl.No</th>
            <th className="border p-2 w-[100px] whitespace-nowrap">ವರ್ಷ</th>
            <th className="border p-2 w-[100px] whitespace-nowrap">ಕಂತು</th>

            <th className="border p-2 min-w-[250px] md:min-w-[300px]">
              ಕಾಮಗಾರಿಯ ಹೆಸರು
            </th>

            <th className="border p-2 w-[120px] whitespace-nowrap">ಮೊತ್ತ</th>

            <th className="border p-2 min-w-[140px]">
              ಅನುಷ್ಠಾನ ಇಲಾಖೆ
            </th>

            <th className="border p-2 min-w-[120px]">ಷರಾ</th>
            <th className="border p-2 min-w-[120px]">Status</th>

            {!isPdf && (
              <th className="border p-2 w-[100px] text-center whitespace-nowrap">
                Action
              </th>
            )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={isPdf ? 7 : 8}
                className="text-center p-4 text-gray-400"
              >
                ಡೇಟಾ ಇಲ್ಲ
              </td>
            </tr>
          ) : (
            filteredData.map((item: any, i: number) => (
              <tr key={item._id} className="hover:bg-gray-50">
                
                <td className="border p-2 whitespace-nowrap text-center">
                  {i + 1}
                </td>

                <td className="border p-2 whitespace-nowrap">
                  {item.year}
                </td>

                <td className="border p-2 whitespace-nowrap">
                  {item.phase}
                </td>

                <td className="border p-2 break-words">
                  {item.work_description}
                </td>

                <td className="border p-2 whitespace-nowrap">
                  ₹ {item.amount}
                </td>

                <td className="border p-2 break-words">
                  {item.department}
                </td>

                <td className="border p-2 break-words">
                  {item.remark}
                </td>

                <td className="border p-2 break-words">
                  {item.status}
                </td>

                {!isPdf && (
                  <td className="border p-2 text-center whitespace-nowrap">
                    <div className="flex justify-center gap-2">
                      <FiEdit
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                          setEditData(item);
                          setOpenModal(true);
                        }}
                      />
                      <FiTrash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => setDeleteId(item._id)}
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
  </div>
</div>

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
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          ಅಳಿಸಿ
        </button>
      </div>
    </div>
  </div>
)}

      {/* MODAL */}
      {openModal && (
        <MLALADDModal
          editData={editData}
          close={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}