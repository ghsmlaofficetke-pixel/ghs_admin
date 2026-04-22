import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaFileExcel, FaSearch, FaFilePdf } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";
import './index.css'

import { AppDispatch } from "../../../../redux/store";
import {
  fetchIndividualByVillage,
  deleteIndividualWork,
  individualWorkSelector,
} from "../../../../api/individualwork";

import { fetchVillageById, villageSelector } from "../../../../api/village";

import AddEditIndividualWorkModal from "./addeditIndModal";

/* ================= DELETE CONFIRM MODAL ================= */

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
          ಈ ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರವನ್ನು ಶಾಶ್ವತವಾಗಿ ಡಿಲೀಟ್ ಮಾಡಬೇಕಾ?
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

export default function IndividualWorksTable({
  villageId,
}: {
  villageId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const { list = [], loading } = useSelector(individualWorkSelector);
  const { current: village } = useSelector(villageSelector);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  /* SEARCH */

  const [searchText, setSearchText] = useState("");

  /* PAGINATION */

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  /* PDF MODE */

  const [isPdf, setIsPdf] = useState(false);

  useEffect(() => {
    if (villageId) {
      dispatch(fetchIndividualByVillage(villageId));
      dispatch(fetchVillageById(villageId));
    }
  }, [villageId, dispatch]);

  /* ================= SEARCH FILTER ================= */

  const filteredList = useMemo(() => {
    const q = searchText.toLowerCase();
    if (!q) return list;

    return list.filter((w: any) =>
      [w.name, w.scheme, w.mobile].join(" ").toLowerCase().includes(q)
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
      "ಗ್ರಾಮ": village?.name || "",
      "ಹೆಸರು": w.name || "",
      "ಯೋಜನೆ": w.scheme || "",
      "ಆದೇಶ ಸಂಖ್ಯೆ": w.orderNumber || "",
      "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ": w.mobile || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ"
    );

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${village?.name || "Village"}_ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ.xlsx`
    );
  };

  /* ================= PDF DOWNLOAD ================= */

  const handlePdfDownload = async () => {
  const element = document.getElementById("individual-pdf-area");
  if (!element) return;

  // Step 1: Enable full data mode
  setIsPdf(true);

  // Step 2: Wait for React to re-render FULL DATA
  await new Promise((resolve) => setTimeout(resolve, 800)); // 🔥 important

  const opt = {
    margin: 10,
    filename: `${village?.name || "Village"}_ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ.pdf`,
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

  await (html2pdf() as any)
    .from(element)
    .set(opt)
    .save();

  // Step 3: Back to normal pagination
  setIsPdf(false);
};

  return (
    <div className="space-y-3">

      {/* HEADER */}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">

        <h5 className="font-semibold text-[12px] sm:text-[14px]">
          {village?.name ? (
            <>
              <span className="text-blue-500">{village.name}</span>{" "}
              ಗ್ರಾಮದ ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ
            </>
          ) : (
            "ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ"
          )}
        </h5>

        <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center mb-2">

          {/* SEARCH */}

          <div className="relative w-full sm:w-56">

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

            <button
              onClick={handleExcelDownload}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              <FaFileExcel /> Excel
            </button>

            <button
              onClick={handlePdfDownload}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              <FaFilePdf /> PDF
            </button>

            <button
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 py-1 rounded text-sm"
            >
              <FaPlus /> Add
            </button>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <div id="individual-pdf-area">
        {isPdf && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold">
              {village?.name || ""} ಗ್ರಾಮದ ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ
            </h2>
            <p className="text-sm text-gray-600">
              Generated on: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        )}


       <div
  className={`overflow-x-auto border rounded ${
    isPdf ? "" : "max-h-[400px] overflow-y-auto"
  }`}
>

  <table className="min-w-full border text-sm page-break-table">

    <thead className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-10">

              <tr>
                <th className="border p-2">Sl No</th>
                <th className="border p-2">ಹೆಸರು</th>
                <th className="border p-2">ಯೋಜನೆ</th>
                <th className="border p-2">ಮೊಬೈಲ್</th>
                <th className="border p-2">ಆದೇಶ ಸಂಖ್ಯೆ</th>
                <th className="border p-2">ವಿಳಾಸ</th>
                {!isPdf && <th className="border p-2">Action</th>}
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading && displayData?.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    ಯಾವುದೇ ದಾಖಲೆ ಇಲ್ಲ
                  </td>
                </tr>
              )}

              {displayData?.map((w: any, i: number) => (

                <tr key={w._id}>

                  <td className="border p-2 text-center">
                    {isPdf
                      ? i + 1
                      : (currentPage - 1) * pageSize + i + 1}
                  </td>

                  <td className="border p-2">{w.name}</td>
                  <td className="border p-2">{w.scheme}</td>
                  <td className="border p-2">{w.mobile || "-"}</td>
                  <td className="border p-2">{w.orderNumber || "-"}</td>
                  <td className="border p-2">{w.address || "-"}</td>

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

      <AddEditIndividualWorkModal
        open={open}
        onClose={() => setOpen(false)}
        villageId={villageId}
        editData={editData}
      />

      <DeleteConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            dispatch(deleteIndividualWork(deleteId, villageId));
            setDeleteId(null);
          }
        }}
      />

    </div>
  );
}