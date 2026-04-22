import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";

import {
  fetchAdhiveshanaPdfs,
  deleteAdhiveshanaPdf,
  updateAdhiveshanaPdf,
  createAdhiveshanaPdf,
  adhiveshanaPdfSelector,
} from "../../../api/adhiveshanapdf";

import { uploadPdfToFirebase } from "../../../utils/uploadPdf";

import { FiTrash2, FiEdit } from "react-icons/fi";
import { FaFilePdf, FaArrowLeft } from "react-icons/fa";

/* ================= MODAL ================= */
const PdfModal = ({ close, editData, onSave }: any) => {
  const [form, setForm] = useState({
    date: "",
    description: "",
    department: "",
  });

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date || "",
        description: editData.description || "",
        department: editData.department || "",
      });
    }
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
      {editData ? "ಪ್ರಶ್ನೋತ್ತರಗಳ ತಿದ್ದುಪಡಿ" : "ಪ್ರಶ್ನೋತ್ತರಗಳನ್ನು ಸೇರಿಸಿ"}
    </h2>

    {/* FORM */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* DATE */}
      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
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

      {/* DESCRIPTION FULL */}
      <textarea
        placeholder="ವಿವರಣೆ"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* FILE FULL */}
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border border-slate-400 p-2 rounded text-sm col-span-full focus:ring-2 focus:ring-blue-100 outline-none bg-white"
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
        onClick={() => onSave(form, file)}
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
export default function AdhiveshanaPdfPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector(adhiveshanaPdfSelector);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdhiveshanaPdfs());
  }, [dispatch]);

  /* FILTER */
  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(
      (item: any) =>
        item.description?.toLowerCase().includes(q) ||
        item.department?.toLowerCase().includes(q)
    );
  }, [list, search]);

  /* SAVE (PDF optional ✅) */
  const handleSave = async (form: any, file: File | null) => {
    let payload: any = { ...form };

    if (file) {
      const url = await uploadPdfToFirebase(file);
      payload.pdfUrl = url;
      payload.fileName = file.name;
    }

    if (editData) {
      await dispatch(updateAdhiveshanaPdf(editData._id, payload));
    } else {
      await dispatch(createAdhiveshanaPdf(payload));
    }

    dispatch(fetchAdhiveshanaPdfs());
    setOpenModal(false);
    setEditData(null);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteAdhiveshanaPdf(deleteId));
      dispatch(fetchAdhiveshanaPdfs());
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-230px)] bg-gray-100">

      {/* HEADER */}
      <div className="bg-white shadow px-3 py-3 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 flex items-center sm:hidden justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
          >
            <FaArrowLeft size={14} />
          </button>

          <h1 className="font-bold text-[12px] sm:text-[16px] sm:text-start text-center">
            ಕೇಳಲಾದ ಪ್ರಶ್ನೋತ್ತರಗಳ ದಾಖಲೆಗಳು
          </h1>

          <button
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            className="px-3 py-1 rounded bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm"
          >
            + ಸೇರಿಸಿ
          </button>
        </div>

        <input
          placeholder="ಹುಡುಕಿ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full border p-2 rounded text-sm"
        />
      </div>

      {/* TABLE */}
   <div className="flex-1 pt-2 min-h-0">
  <div className="bg-white rounded-xl shadow h-full flex flex-col">

    {/* TABLE WRAPPER */}
    <div className="overflow-auto border rounded flex-1">

      <table className="min-w-full table-fixed border text-sm">

        {/* HEADER */}
        <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-20">
          <tr>
            <th className="border p-2 w-[70px]">Sl.No</th>
            <th className="border p-2 w-[130px]">ದಿನಾಂಕ</th>
            <th className="border p-2 w-[160px]">ಇಲಾಖೆ</th>
            <th className="border p-2 min-w-[250px] max-w-[350px]">
              ವಿವರಣೆ
            </th>
            <th className="border p-2 w-[80px] text-center">PDF</th>
            <th className="border p-2 w-[100px] text-center">ಕ್ರಿಯೆ</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {filteredData?.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-400">
                ಡೇಟಾ ಇಲ್ಲ
              </td>
            </tr>
          ) : (
            filteredData?.map((item: any, i: number) => (
              <tr key={item._id} className="hover:bg-gray-50">
                
                <td className="border p-2 text-center">
                  {i + 1}
                </td>

                <td className="border p-2 whitespace-nowrap">
                  {item.date}
                </td>

                <td className="border p-2 break-words">
                  {item.department}
                </td>

                <td className="border p-2 break-words leading-6 max-w-[350px]">
                  {item.description}
                </td>

                <td className="border p-2 text-center">
                  {item.pdfUrl ? (
                    <a href={item.pdfUrl} target="_blank">
                      <FaFilePdf className="text-red-500 text-lg mx-auto" />
                    </a>
                  ) : "-"}
                </td>

                <td className="border p-2 text-center">
                  <div className="flex justify-center gap-3">
                    <FiEdit
                      onClick={() => {
                        setEditData(item);
                        setOpenModal(true);
                      }}
                      className="text-blue-500 cursor-pointer"
                    />

                    <FiTrash2
                      onClick={() => setDeleteId(item._id)}
                      className="text-red-500 cursor-pointer"
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
        <PdfModal
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