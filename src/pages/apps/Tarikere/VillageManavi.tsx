import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import { AppDispatch } from "../../../redux/store";
import {fetchManaviByVillage,manaviSelector,deleteManavi,} from "../../../api/manavi";
import { fetchVillageById, villageSelector } from "../../../api/village";
import AddEditManaviModal from "./AddEditManaviModal";

/* ================= DELETE CONFIRM MODAL ================= */

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmModal({ open, onClose, onConfirm }: DeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1f2a38] w-full max-w-sm rounded-lg p-4"
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

/* ================= MAIN COMPONENT ================= */

export default function VillageManavi() {
  const { id: villageId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector(manaviSelector);
  const { current: village } = useSelector(villageSelector);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const [searchText, setSearchText] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [isPdf, setIsPdf] = useState(false); // ⭐ NEW
 

  useEffect(() => {
    if (villageId) {
      dispatch(fetchManaviByVillage(villageId));
      dispatch(fetchVillageById(villageId));
    }
  }, [villageId, dispatch]);

  /* ================= FILTER ================= */

  const filteredList = useMemo(() => {
  const q = searchText.toLowerCase();
  if (!q) return list;

  return list.filter((m: any) =>
    m.work?.toLowerCase().includes(q) ||
    m.type?.toLowerCase().includes(q) ||   // ✅ NEW
    m.caste?.toLowerCase().includes(q) ||   // ✅ NEW
    m.description?.toLowerCase().includes(q) ||
    m.refer?.toLowerCase().includes(q) ||
    m.status?.toLowerCase().includes(q)
  );
}, [list, searchText]);

  /* ================= PAGINATION ================= */

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page]);

  const totalPages = Math.ceil(filteredList.length / pageSize);
  const displayData = isPdf ? filteredList : pagedData;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN");

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

  /* ================= EXCEL DOWNLOAD ================= */

  const handleExcelDownload = () => {
    if (!filteredList.length) return;

   const excelData = filteredList.map((m: any, index: number) => ({
  "ಕ್ರಮ ಸಂಖ್ಯೆ": index + 1,
  "ಗ್ರಾಮ": village?.name || "",
  "ದಿನಾಂಕ": formatDate(m.createdAt),
  "ಪ್ರಕಾರ": m.type || "",        // ✅ NEW
  "ಕೆಲಸ": m.work || "",
  "ಜಾತಿ": m.caste || "",
  "ವಿವರಣೆ": m.description || "",
  "ಉಲ್ಲೇಖ": m.refer || "",
  "ಸ್ಥಿತಿ": m.status || "",
}));
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
  { wch: 10 },
  { wch: 20 },
  { wch: 15 },
  { wch: 15 }, // ✅ TYPE
  { wch: 25 },
  { wch: 35 },
  { wch: 20 },
  { wch: 15 },
];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ಮನವಿಗಳು");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `${village?.name || "Village"}_ಮನವಿ_List.xlsx`);
  };

  /* ================= PDF DOWNLOAD ================= */

const handlePdfDownload = () => {
  const element = document.getElementById("manavi-pdf-area");
  if (!element) return;

  setIsPdf(true);

  setTimeout(() => {
    const opt = {
      margin: 10,
      filename: `${village?.name || "Village"}_ಮನವಿ_List.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape",
      },
       pagebreak: {
    mode: ["avoid-all", "css", "legacy"],
      },
    };

    (html2pdf() as any)
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsPdf(false);
      });
  }, 400);
};

  /* ================= UI ================= */

  return (
    <div className="bg-white dark:bg-[#1f2a38] rounded-lg p-2">
      {/* Header */}
<div className="flex flex-col gap-2  sm:flex-row sm:justify-between sm:items-center mb-3">
  {/* TITLE */}
  <h3 className="text-[12px] sm:text-[14px] font-semibold">
    {village?.name || "Loading..."} ಗ್ರಾಮದ ಮನವಿಗಳು
  </h3>

  {/* RIGHT ACTION BAR */}
  <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center">
    {/* SEARCH */}
    <div className="relative w-full sm:w-64">
      <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
      <input
        type="text"
        placeholder="ಮನವಿಗಳು ಹುಡುಕಿ..."
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setPage(1);
        }}
        className="w-full border  pl-9 pr-3 px-3 py-1 rounded text-sm"
      />
    </div>

    {/* BUTTONS */}
    <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex sm:gap-3 sm:pt-0 pt-2">

  {/* EXCEL */}
  <button
    onClick={handleExcelDownload}
    className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
  >
    <FaFileExcel />
    <span>Excel</span>
  </button>

  {/* PDF */}
  <button
    onClick={handlePdfDownload}
    className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
  >
    <FaFilePdf />
    <span>PDF</span>
  </button>

  {/* ADD */}
  <button
    onClick={() => {
      setEditData(null);
      setOpen(true);
    }}
    className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 py-1 rounded text-sm"
  >
    <FaPlus />
    <span>Add</span>
  </button>

</div>
  </div>
</div>

      {/* ================= PDF AREA ================= */}
      <div id="manavi-pdf-area">
        {/* PDF Heading ONLY for PDF */}
        {isPdf && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold">
              {village?.name || ""} ಗ್ರಾಮದ ಮನವಿಗಳು
            </h2>
            <p className="text-sm text-gray-600">
              Generated on: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        )}

        {/* Table */}
           <div
  className={`overflow-x-auto border rounded ${
    isPdf ? "" : "max-h-[400px] overflow-y-auto"
  }`}
>

  <table className="min-w-full border text-sm page-break-table">

    <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-10">
  <tr>
    <th className="border p-2">ಕ್ರಮ ಸಂಖ್ಯೆ</th>
    <th className="border p-2">ದಿನಾಂಕ</th>
    <th className="border p-2">ಪ್ರಕಾರ</th> {/* ✅ NEW */}
    <th className="border p-2">ಕೆಲಸ</th>
    <th className="border p-2">ಜಾತಿ</th>
    <th className="border p-2">ವಿವರಣೆ</th>
    <th className="border p-2">Refrence</th>
    <th className="border p-2">Status</th>
    {!isPdf && (
      <th className="border p-2 text-center">Action</th>
    )}
  </tr>
</thead>
            <tbody>
  {loading ? (
    <tr>
      <td colSpan={8} className="text-center p-4"> {/* updated */}
        Loading...
      </td>
    </tr>
  ) : pagedData.length ? (
    displayData?.map((m: any, index: number) => (
      <tr key={m._id} className="hover:bg-gray-50">
        <td className="border p-2 text-center">
          {isPdf
            ? index + 1
            : (page - 1) * pageSize + index + 1}
        </td>
        <td className="border p-2">{formatDate(m.createdAt)}</td>

        {/* ✅ TYPE */}
        <td className="border p-2 font-medium">
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
                onClick={() => {
                  setEditData(m);
                  setOpen(true);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-600"
                onClick={() => {
                  setDeleteId(m._id);
                  setDeleteOpen(true);
                }}
              >
                <FaTrash />
              </button>
            </div>
          </td>
        )}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={8} className="text-center p-4 text-gray-500"> {/* updated */}
        ಯಾವುದೇ ಮನವಿ ಇಲ್ಲ
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {villageId && (
        <AddEditManaviModal
          open={open}
          onClose={() => setOpen(false)}
          villageId={villageId}
          editData={editData}
        />
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => {setDeleteOpen(false);setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId && villageId) {
            dispatch(deleteManavi(deleteId, villageId));
          }
        }}
      />
    </div>
  );
}
