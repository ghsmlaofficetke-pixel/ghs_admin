import { useEffect, useMemo, useState, useCallback } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFileExcel, FaFilePdf } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AppDispatch } from "../../../redux/store";
import {
  fetchManaviByVillage,
  manaviSelector,
  deleteManavi,
} from "../../../api/manavi";
import { fetchVillageById, villageSelector } from "../../../api/village";
import AddEditManaviModal from "./AddEditManaviModal";
import "./index.css";

/* ═══════════════════════════════════════════════════════════
   DELETE CONFIRM MODAL
═══════════════════════════════════════════════════════════ */
function DeleteConfirmModal({
  open, onClose, onConfirm,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2" onClick={onClose}>
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-red-600 mb-2">ಡಿಲೀಟ್ ಖಚಿತಪಡಿಸಿ</h3>
        <p className="text-sm text-gray-700 mb-6">ಈ ಮನವಿಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಡಿಲೀಟ್ ಮಾಡಬೇಕಾ?</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">ರದ್ದುಮಾಡಿ</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">ಡಿಲೀಟ್</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PDF LOADER
═══════════════════════════════════════════════════════════ */
function PdfLoader({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="pdf-loader-overlay">
      <div className="pdf-loader-spinner" />
      <span className="pdf-loader-text">PDF ತಯಾರಾಗುತ್ತಿದೆ...</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const PAGE_SIZE = 5;

export default function VillageManavi() {
  const { id: villageId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { list, loading } = useSelector(manaviSelector);
  const { current: village } = useSelector(villageSelector);

  const [open, setOpen]             = useState(false);
  const [editData, setEditData]     = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage]             = useState(1);
  const [isPdf, setIsPdf]           = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (villageId) {
      dispatch(fetchManaviByVillage(villageId));
      dispatch(fetchVillageById(villageId));
    }
  }, [villageId, dispatch]);

  const filteredList = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    if (!q) return list;
    return list.filter((m: any) =>
      [m.work, m.type, m.caste, m.description, m.refer, m.status]
        .join(" ").toLowerCase().includes(q)
    );
  }, [list, searchText]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);

  const pagedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, page]);

  const displayData = isPdf ? filteredList : pagedData;

  const handleSearch = useCallback((val: string) => {
    setSearchText(val); setPage(1);
  }, []);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN");

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":  return "text-blue-600 font-semibold";
      case "Approved": return "text-green-600 font-semibold";
      case "Rejected": return "text-red-600 font-semibold";
      default:         return "text-gray-500";
    }
  };

  /* ── EXCEL ── */
  const handleExcelDownload = useCallback(() => {
    if (!filteredList.length) return;
    const excelData = filteredList.map((m: any, i: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": i + 1,
      "ಗ್ರಾಮ": village?.name || "",
      "ದಿನಾಂಕ": formatDate(m.createdAt),
      "ಪ್ರಕಾರ": m.type || "",
      "ಕೆಲಸ": m.work || "",
      "ಜಾತಿ": m.caste || "",
      "ವಿವರಣೆ": m.description || "",
      "ಉಲ್ಲೇಖ": m.refer || "",
      "ಸ್ಥಿತಿ": m.status || "",
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    ws["!cols"] = [{ wch:10 },{ wch:20 },{ wch:15 },{ wch:15 },{ wch:25 },{ wch:15 },{ wch:35 },{ wch:20 },{ wch:15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ಮನವಿಗಳು");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      `${village?.name || "Village"}_ಮನವಿ_List.xlsx`);
  }, [filteredList, village]);

  /* ── PDF ── */
  const handlePdfDownload = useCallback(async () => {
    if (pdfLoading) return;
    setPdfLoading(true); setIsPdf(true);
    await new Promise((r) => setTimeout(r, 800));
    await document.fonts.ready;
    const element = document.getElementById("manavi-pdf-area");
    if (!element) { setIsPdf(false); setPdfLoading(false); return; }
    const opt = {
      margin: [8, 6, 8, 6],
      filename: `${village?.name || "Village"}_ಮನವಿ_List.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      pagebreak: { mode: ["avoid-all", "css"] },
    };
    try {
    const h2p = await import("html2pdf.js");
    const html2pdf = (h2p as any).default ?? h2p;
      await (html2pdf() as any)
  .from(element)
  .set(opt)
  .save();
    } finally {
      setIsPdf(false); setPdfLoading(false);
    }
  }, [pdfLoading, village]);

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 8 }}>

      <PdfLoader visible={pdfLoading} />

      {/* ── HEADER ── */}
      <div className="cw-header">
        <h4 className="cw-title">
          {village?.name
            ? <><span className="cw-title-village">{village.name}</span>{" "}ಗ್ರಾಮದ ಮನವಿಗಳು</>
            : "ಮನವಿಗಳು"}
        </h4>
        <div className="search-wrap cw-search">
          <FaSearch />
          <input
            type="text"
            placeholder="ಮನವಿಗಳು ಹುಡುಕಿ..."
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="cw-actions">
          <button className="btn btn-excel" onClick={handleExcelDownload} disabled={!filteredList.length}>
            <FaFileExcel /><span>Excel</span>
          </button>
          <button className="btn btn-pdf" onClick={handlePdfDownload} disabled={pdfLoading || !filteredList.length}>
            <FaFilePdf /><span>{pdfLoading ? "ತಯಾರಾಗುತ್ತಿದೆ..." : "PDF"}</span>
          </button>
          <button className="btn btn-add" onClick={() => { setEditData(null); setOpen(true); }}>
            <FaPlus /><span>ಸೇರಿಸಿ</span>
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div
        id="manavi-pdf-area"
        style={isPdf ? {} : {
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "420px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}
      >
        {isPdf && (
          <div className="pdf-title">
            <h2>{village?.name || ""} ಗ್ರಾಮದ ಮನವಿಗಳು</h2>
            <p>ದಿನಾಂಕ: {new Date().toLocaleDateString("kn-IN")}</p>
          </div>
        )}

        <table className="page-break-table">
          <colgroup>
            <col style={{ width: 44 }} />
            <col style={{ width: isPdf ? "10%" : 105 }} />
            <col style={{ width: isPdf ? "10%" :  95 }} />
            <col style={{ width: isPdf ? "18%" : 175 }} />
            <col style={{ width: isPdf ? "10%" :  95 }} />
            <col style={{ width: isPdf ? "22%" : 215 }} />
            <col style={{ width: isPdf ? "14%" : 135 }} />
            <col style={{ width: isPdf ? "10%" :  95 }} />
            {!isPdf && <col style={{ width: 72 }} />}
          </colgroup>
          <thead>
            <tr>
              <th>ಕ್ರ.ಸಂ</th>
              <th>ದಿನಾಂಕ</th>
              <th>ಪ್ರಕಾರ</th>
              <th>ಕೆಲಸ</th>
              <th>ಜಾತಿ</th>
              <th>ವಿವರಣೆ</th>
              <th>Reference</th>
              <th>Status</th>
              {!isPdf && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr className="table-empty-row">
                <td colSpan={isPdf ? 8 : 9}>ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</td>
              </tr>
            )}
            {!loading && displayData.length === 0 && (
              <tr className="table-empty-row">
                <td colSpan={isPdf ? 8 : 9}>ಯಾವುದೇ ಮನವಿ ಇಲ್ಲ</td>
              </tr>
            )}
            {!loading && displayData.map((m: any, index: number) => (
              <tr key={m._id}>
                <td>{isPdf ? index + 1 : (page - 1) * PAGE_SIZE + index + 1}</td>
                <td>{formatDate(m.createdAt)}</td>
                <td>{m.type || "-"}</td>
                <td style={{ fontWeight: 500 }}>{m.work || "-"}</td>
                <td>{m.caste || "-"}</td>
                <td>{m.description || "-"}</td>
                <td>{m.refer || "-"}</td>
                <td><span className={getStatusClass(m.status)}>{m.status || "-"}</span></td>
                {!isPdf && (
                  <td className="action-cell">
                    <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                      <FaEdit style={{ cursor: "pointer", color: "#2563eb" }}
                        onClick={() => { setEditData(m); setOpen(true); }} />
                      <FaTrash style={{ cursor: "pointer", color: "#ef4444" }}
                        onClick={() => { setDeleteId(m._id); setDeleteOpen(true); }} />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      {!isPdf && totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← ಹಿಂದೆ</button>
          <span className="page-info">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>ಮುಂದೆ →</button>
        </div>
      )}

      {/* ── MODALS ── */}
      {villageId && (
        <AddEditManaviModal
          open={open}
          onClose={() => setOpen(false)}
          villageId={villageId}
          editData={editData}
        />
      )}
      <DeleteConfirmModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeleteId(null); }}
        onConfirm={() => {
          if (deleteId && villageId) dispatch(deleteManavi(deleteId, villageId));
        }}
      />
    </div>
  );
}