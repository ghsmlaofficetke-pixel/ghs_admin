import { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileExcel,
  FaFilePdf,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import './index.css'
import { AppDispatch } from "../../../../../redux/store";

import {
  fetchCommunityByWard,
  deleteWardComWork,
  wardcomWorkSelector,
} from "../../../../../api/wardcomwork";
import { fetchWardById, wardSelector  } from "../../../../../api/ward";

import AddEditWardComModal from "./AddEditWardComModal";

/* ================= DELETE MODAL ================= */

function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          ಡಿಲೀಟ್ ಖಚಿತಪಡಿಸಿ
        </h3>

        <p className="text-gray-700 mb-6">
          ಈ ಕಾಮಗಾರಿಯನ್ನು ಡಿಲೀಟ್ ಮಾಡಬೇಕಾ?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={onConfirm}
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

export default function WardCommunityWorksTable({
  wardId,
}: {
  wardId: string;
}) {

  const dispatch = useDispatch<AppDispatch>();

  const { list = [], loading } = useSelector(wardcomWorkSelector);
const { current: ward } = useSelector(wardSelector);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* SEARCH */

  const [searchText, setSearchText] = useState("");

  /* PAGINATION */

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 150;

  /* PDF MODE */

  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (wardId) {
      dispatch(fetchCommunityByWard(wardId));
      dispatch(fetchWardById(wardId));
    }
  }, [wardId, dispatch]);

  /* ================= SEARCH FILTER ================= */

  const filteredList = useMemo(() => {

    const q = searchText.toLowerCase();

    if (!q) return list;

    return list.filter((w: any) =>
      [
        w.workDetails,
        w.scheme,
        w.department,
        w.letterNumber,
        w.estimatedAmount?.toString(),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

  }, [list, searchText]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredList.length / pageSize);

  const paginatedList = useMemo(() => {

    const start = (currentPage - 1) * pageSize;

    return filteredList.slice(start, start + pageSize);

  }, [filteredList, currentPage]);

  const displayData = isPdf ? filteredList : paginatedList;

  /* ================= EXCEL DOWNLOAD ================= */

  const handleExcelDownload = () => {

    if (!filteredList.length) return;

    const excelData = filteredList.map((w: any, index: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": index + 1,
      "ಕಾಮಗಾರಿಯ ವಿವರ": w.workDetails || "",
      "ಅಂದಾಜು ಮೊತ್ತ (ಲಕ್ಷ ರೂ.)": w.estimatedAmount || "",
      "ಯೋಜನೆ": w.scheme || "",
      "ವಿಭಾಗ": w.department || "",
      "ಪತ್ರ ಸಂಖ್ಯೆ": w.letterNumber || "",
      "ಷರಾ": w.remarks || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 35 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Ward Community Works");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "Ward_Community_Works.xlsx"
    );

  };

  /* ================= PDF DOWNLOAD ================= */

  const handlePdfDownload = () => {

    const element = document.getElementById("ward-pdf-area");

    if (!element) return;

    setIsPdf(true);

    setTimeout(async () => {

      const opt = {
        margin: 10,
        filename: "Ward ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು.pdf",

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
    const h2p = await import("html2pdf.js");
    const html2pdf = (h2p as any).default ?? h2p;


      (html2pdf() as any)
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          setIsPdf(false);
        });

    }, 400);

  };

  /* ================= DELETE ================= */

  const confirmDelete = () => {

    if (deleteId) {
      dispatch(deleteWardComWork(deleteId, wardId));
      setDeleteId(null);
    }

  };

  return (
    <div className="space-y-3">

      {/* HEADER */}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">

        <h4 className="font-semibold text-[12px] sm:text-[14px]">
          {ward?.name} ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು
        </h4>

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
          setCurrentPage(1);
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

      <div id="ward-pdf-area">

        {isPdf && (
          <div className="mb-4 text-center">

            <h2 className="text-xl font-bold">
              ವಾರ್ಡ್ ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು
            </h2>

            <p className="text-sm text-gray-600">
              Generated on: {new Date().toLocaleDateString("en-IN")}
            </p>

          </div>
        )}

       <div className="overflow-x-auto max-h-[500px] overflow-y-auto border rounded">

  <table className="min-w-full border text-sm">

    <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-10">

              <tr>
                <th className="border p-2">Sl No</th>
                <th className="border p-2">ಕಾಮಗಾರಿಯ ವಿವರ</th>
                <th className="border p-2">ಅಂದಾಜು ಮೊತ್ತ</th>
                <th className="border p-2">ಯೋಜನೆ</th>
                <th className="border p-2">ವಿಭಾಗ</th>
                <th className="border p-2">ಪತ್ರ ಸಂಖ್ಯೆ</th>
                <th className="border p-2">ಷರಾ</th>
                {!isPdf && <th className="border p-2">Action</th>}
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && displayData.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                     ಯಾವುದೇ ದಾಖಲೆ ಇಲ್ಲ
                  </td>
                </tr>
              )}

              {displayData?.map((w: any, i: number) => (

                <tr key={w._id} className="text-[#0D0D0D]">

                  <td className="border p-2 text-center">
                    {isPdf
                      ? i + 1
                      : (currentPage - 1) * pageSize + i + 1}
                  </td>

                  <td className="border p-2">{w.workDetails}</td>

                  <td className="border p-2 text-center">
                    {w.estimatedAmount
                      ? `₹ ${Number(w.estimatedAmount).toLocaleString("en-IN")}`
                      : "-"}
                  </td>

                  <td className="border p-2">{w.scheme}</td>

                  <td className="border p-2">{w.department}</td>

                  <td className="border p-2">{w.letterNumber}</td>

                  <td className="border p-2">{w.remarks}</td>

                  {!isPdf && (

                    <td className="border p-2 text-center">

                      <div className="flex justify-center gap-3">

                        <FaEdit
                          className="cursor-pointer text-blue-600"
                          onClick={() => {
                            setEditData(w);
                            setOpen(true);
                          }}
                        />

                        <FaTrash
                          className="cursor-pointer text-red-600"
                          onClick={() => setDeleteId(w._id)}
                        />

                      </div>

                    </td>

                  )}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2 mt-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1 text-sm">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      )}

      {/* MODALS */}

      <AddEditWardComModal
        open={open}
        onClose={() => setOpen(false)}
        wardId={wardId}
        editData={editData}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

    </div>
  );
}