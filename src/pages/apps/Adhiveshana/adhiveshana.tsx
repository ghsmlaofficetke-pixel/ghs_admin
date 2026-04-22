import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchAllAdhiveshana,
  deleteAdhiveshana,
  adhiveshanaSelector,
  updateAdhiveshana,
  createAdhiveshana,
} from "../../../api/adhiveshana";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

/* ================= MODAL ================= */
const AdhiveshanaModal = ({ close, editData, onSave }: any) => {
  const [form, setForm] = useState({
    date: "",
    type: "ಬಜೆಟ್ ಅಧಿವೇಶನ",
    department: "",
    description: "",
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
      {editData ? "ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಪ್ರಶ್ನೆ"}
    </h2>

    {/* FORM */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* TYPE */}
      <select
        value={form.type}
        onChange={(e) =>
          setForm({ ...form, type: e.target.value })
        }
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      >
        <option>ಬಜೆಟ್ ಅಧಿವೇಶನ</option>
        <option>ಮಳೆಗಾಲದ ಅಧಿವೇಶನ</option>
        <option>ಚಳಿಗಾಲದ ಅಧಿವೇಶನ</option>
      </select>

      {/* DEPARTMENT */}
      <input
        placeholder="ಇಲಾಖೆ"
        value={form.department}
        onChange={(e) =>
          setForm({ ...form, department: e.target.value })
        }
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* DESCRIPTION FULL */}
      <textarea
        placeholder="ವಿವರಣೆ"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
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
        ರದ್ದು
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

/* ================= MAIN PAGE ================= */
export default function AdhiveshanaQuestionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(adhiveshanaSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchAllAdhiveshana());
  }, []);

  /* FILTER */
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(
      (item: any) =>
        item.description?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q)
    );
  }, [list, search]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  /* SAVE */
  const handleSave = async (form: any) => {
    if (editData) {
      await dispatch(updateAdhiveshana(editData._id, form));
    } else {
      await dispatch(createAdhiveshana(form));
    }

    setOpenModal(false);
    setEditData(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-240px)] bg-gray-100">

      {/* HEADER */}
      {/* HEADER */}
<div className="bg-white shadow px-3 py-3 sticky top-0 z-30">

  {/* MOBILE HEADER */}
  <div className="flex items-center justify-between sm:hidden">
    <button
      onClick={() => window.history.back()}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
    >
      <FaArrowLeft size={14} />
    </button>

    <h1 className="font-semibold text-[12px] flex-1 text-center">
      ಅಧಿವೇಶನದಲ್ಲಿ ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು
    </h1>

    <button
      onClick={() => {
        setEditData(null);
        setOpenModal(true);
      }}
      className="w-20 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
    >
      + ಸೇರಿಸಿ
    </button>
  </div>

  {/* MOBILE SEARCH */}
  <div className="mt-2 sm:hidden">
    <input
      placeholder="ಹುಡುಕಿ..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
      className="w-full border p-2 rounded text-sm"
    />
  </div>

  {/* ✅ DESKTOP HEADER FIX */}
  <div className="hidden sm:flex items-center justify-between gap-4">

    {/* LEFT - TITLE */}
    <h1 className="font-bold text-[16px] text-start">
      ಅಧಿವೇಶನದಲ್ಲಿ ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು
    </h1>

    {/* RIGHT - SEARCH + BUTTON */}
    <div className="flex items-center gap-2">
      <input
        placeholder="ಹುಡುಕಿ..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="border px-3 py-1 rounded text-sm w-64"
      />

      <button
        onClick={() => {
          setEditData(null);
          setOpenModal(true);
        }}
        className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-4 py-1 rounded text-sm whitespace-nowrap"
      >
        + ಸೇರಿಸಿ
      </button>
    </div>
  </div>

</div>

      {/* TABLE */}
    <div className="flex-1 pt-3 min-h-0">
  <div className="bg-white rounded-xl shadow flex flex-col h-full">

    {/* TABLE WRAPPER */}
    <div className="overflow-auto border rounded flex-1">

      <table className="min-w-full table-fixed border text-sm">

        {/* HEADER */}
        <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20">
          <tr>
            <th className="border p-2 w-[80px] text-center">Sl.No</th>
            <th className="border p-2 w-[150px]">ಪ್ರಕಾರ</th>
            <th className="border p-2 w-[150px]">ಇಲಾಖೆ</th>
            <th className="border p-2 min-w-[250px] max-w-[350px]">ವಿವರಣೆ</th>
            <th className="border p-2 w-[100px] text-center">ಕ್ರಿಯೆ</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-6 text-gray-400">
                ಡೇಟಾ ಇಲ್ಲ
              </td>
            </tr>
          ) : (
            paginatedData.map((item: any, i: number) => (
              <tr key={item._id} className="hover:bg-gray-50">

                <td className="border p-2 text-center">
                  {(currentPage - 1) * pageSize + i + 1}
                </td>

                <td className="border p-2 break-words">
                  {item.type}
                </td>

                <td className="border p-2 break-words">
                  {item.department}
                </td>

                <td className="border p-2 break-words max-w-[350px]">
                  {item.description}
                </td>

                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-3">
                    <FiEdit
                      onClick={() => {
                        setEditData(item);
                        setOpenModal(true);
                      }}
                      className="cursor-pointer text-blue-500"
                    />

                    <FiTrash2
                      onClick={() => setDeleteId(item._id)}
                      className="cursor-pointer text-red-500"
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
</div>

      {/* MODAL */}
      {openModal && (
        <AdhiveshanaModal
          editData={editData}
          close={() => {
            setOpenModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* DELETE MODAL */}
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
        ನೀವು ಈ ದಾಖಲೆ ಅನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?
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
          onClick={async () => {
            await dispatch(deleteAdhiveshana(deleteId));
            setDeleteId(null);
          }}
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