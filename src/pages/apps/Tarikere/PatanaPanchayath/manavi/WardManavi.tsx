import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { AppDispatch } from "../../../../../redux/store";

import {
  fetchWardmanaviByWard,
  wardmanaviSelector,
  deleteWardmanavi,
} from "../../../../../api/wardmanavi";

import { fetchWardById, wardSelector } from "../../../../../api/ward";

import AddEditWardManaviModal from "./AddEditWardManavi";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* DELETE MODAL */

function DeleteConfirmModal({ open, onClose, onConfirm }: any) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-sm rounded-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">ಡಿಲೀಟ್ ಖಚಿತಪಡಿಸಿ</h3>

        <p className="text-sm text-gray-600 mb-4">
          ಈ ಮನವಿಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WardManavi() {
  const { id } = useParams();
  const wardId = id ?? "";

  const dispatch = useDispatch<AppDispatch>();

  const { current: ward } = useSelector(wardSelector);
  const { list, loading } = useSelector(wardmanaviSelector);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [searchText, setSearchText] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (wardId) {
      dispatch(fetchWardmanaviByWard(wardId));
      dispatch(fetchWardById(wardId));
    }
  }, [wardId, dispatch]);

  /* FILTER */

  const filteredList = useMemo(() => {
    const q = searchText.toLowerCase();

    if (!q) return list;

    return list.filter(
      (m: any) =>
       m.work?.toLowerCase().includes(q) ||
    m.type?.toLowerCase().includes(q) ||   // ✅ NEW
    m.caste?.toLowerCase().includes(q) ||   // ✅ NEW
    m.description?.toLowerCase().includes(q) ||
    m.refer?.toLowerCase().includes(q) ||
    m.status?.toLowerCase().includes(q)
    );
  }, [list, searchText]);

  /* PAGINATION */

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page]);

  const totalPages = Math.ceil(filteredList.length / pageSize);

  const displayData = isPdf ? filteredList : pagedData;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN");

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-blue-600 font-semibold";
      case "Approved":
        return "text-green-600 font-semibold";
      case "Rejected":
        return "text-red-600 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  const confirmDelete = () => {
    if (deleteId) dispatch(deleteWardmanavi(deleteId, wardId));
  };

  /* EXCEL */

  const handleExcelDownload = () => {
    if (!filteredList.length) return;

    const excelData = filteredList.map((m: any, index: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": index + 1,
      "ವಾರ್ಡ್": ward?.name || "",
       "ದಿನಾಂಕ": formatDate(m.createdAt),
  "ಪ್ರಕಾರ": m.type || "",        // ✅ NEW
  "ಕೆಲಸ": m.work || "",
  "ಜಾತಿ": m.caste || "",
  "ವಿವರಣೆ": m.description || "",
  "ಉಲ್ಲೇಖ": m.refer || "",
  "ಸ್ಥಿತಿ": m.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ward Manavi");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `${ward?.name || "Ward"}_Manavi_List.xlsx`);
  };

  /* PDF */

  const handlePdfDownload = () => {
    const element = document.getElementById("ward-manavi-pdf");

    if (!element) return;

    setIsPdf(true);

    setTimeout(async () => {
      const opt = {
        margin: 10,
        filename: `${ward?.name || "Ward"}_ಮನವಿ_List.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"],},
      };
    const h2p = await import("html2pdf.js");
    const html2pdf = (h2p as any).default ?? h2p;


      (html2pdf() as any)
        .set(opt)
        .from(element)
        .save()
        .then(() => setIsPdf(false));
    }, 400);
  };

  return (
    <div className="bg-white rounded-lg p-3 border space-y-3">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between gap-2">

        <h3 className="font-semibold">
          {ward?.name} ಮನವಿಗಳು
        </h3>

        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center mb-2">
    {/* SEARCH */}
    <div className="relative w-full sm:w-56 sm:mb-0 mb-2">
      <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
      <input
        type="text"
        placeholder="ಹುಡುಕಿ..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1);
        }}
        className="w-full border rounded pl-9 pr-3 py-1 text-sm"
      />
    </div>

    {/* BUTTONS */}
    <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-2">
      {/* EXCEL */}
      <button
        onClick={handleExcelDownload}
        className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
        title="Excel"
      >
        <FaFileExcel />
        <span className=" sm:inline">Excel</span>
      </button>

      {/* PDF */}
      <button
        onClick={handlePdfDownload}
        className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
        title="PDF"
      >
        <FaFilePdf />
        <span className=" sm:inline">PDF</span>
      </button>

      {/* ADD */}
      <button
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 py-1 rounded text-sm"
        title="Add"
      >
        <FaPlus />
        <span className=" sm:inline">Add</span>
      </button>
    </div>
  </div>

      </div>

      {/* PDF AREA */}

      <div id="ward-manavi-pdf">

        {isPdf && (

          <div className="text-center mb-4">

            <h2 className="text-xl font-bold">
              {ward?.name} ವಾರ್ಡ್ ಮನವಿಗಳು
            </h2>

            <p className="text-sm text-gray-500">
              Generated on {new Date().toLocaleDateString("en-IN")}
            </p>

          </div>

        )}

       <div
  className={`overflow-x-auto border rounded ${
    isPdf ? "" : "max-h-[400px] overflow-y-auto"
  }`}
>

  <table className="min-w-full  border-[#969696] text-sm page-break-table">

    <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-10">

              <tr>
                <th className="border p-2">ಕ್ರಮ ಸಂಖ್ಯೆ</th>
    <th className="border p-2">ದಿನಾಂಕ</th>
    <th className="border p-2">ಪ್ರಕಾರ</th> {/* ✅ NEW */}
    <th className="border p-2">ಕೆಲಸ</th>
    <th className="border p-2">ಜಾತಿ</th>
    <th className="border p-2">ವಿವರಣೆ</th>
    <th className="border p-2">ಸೂಚನೆ</th>
    <th className="border p-2">Status</th>

                {!isPdf && (
                  <th className="border p-2 text-center">Action</th>
                )}

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Loading...
                  </td>
                </tr>

              ) : displayData.length ? (

                displayData.map((m:any,index:number)=>(

                  <tr key={m._id} className="text-[#0D0D0D]">

                    <td className="border border-[#969696] p-2 text-center">
                      {isPdf
                        ? index+1
                        : (page-1)*pageSize + index + 1}
                    </td>

                    <td className="border border-[#969696] p-2">{formatDate(m.createdAt)}</td>

        {/* ✅ TYPE */}
        <td className="border border-[#969696] p-2 font-medium">
          {m.type || "-"}
        </td>

        <td className="border p-2 font-medium">{m.work}</td>
        <td className="border p-2">{m.caste || "-"}</td>
        <td className="border p-2">{m.description || "-"}</td>
        <td className="border p-2">{m.refer || "-"}</td>
        <td className="border p-2">
          <span className={getStatusClass(m.status)}>
            {m.status || "-"}
          </span>
        </td>

                    {!isPdf && (

                      <td className="border p-2 text-center">

                        <div className="flex justify-center gap-3">

                          <button
                            className="text-blue-600"
                            onClick={()=>{setEditData(m);setOpen(true)}}
                          >
                            <FaEdit/>
                          </button>

                          <button
                            className="text-red-600"
                            onClick={()=>{setDeleteId(m._id);setDeleteOpen(true)}}
                          >
                            <FaTrash/>
                          </button>

                        </div>

                      </td>

                    )}

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    ಯಾವುದೇ ಮನವಿ ಇಲ್ಲ
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-end gap-2">

          <button
            disabled={page===1}
            onClick={()=>setPage(p=>p-1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            {page} / {totalPages}
          </span>

          <button
            disabled={page===totalPages}
            onClick={()=>setPage(p=>p+1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

      {wardId && (

        <AddEditWardManaviModal
          open={open}
          onClose={()=>setOpen(false)}
          wardId={wardId}
          editData={editData}
        />

      )}

      <DeleteConfirmModal
        open={deleteOpen}
        onClose={()=>{setDeleteOpen(false);setDeleteId(null)}}
        onConfirm={confirmDelete}
      />

    </div>
  );
}