import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { toast } from "react-toastify"; 
import {
  Booth,
  boothSelector,
  fetchBooths,
  createBooth,
  updateBooth,
  deleteBooth,
  bulkImportBooths,
} from "../../../api/booth";
import { FaFileExcel, FaPlus, FaSave, FaSearch, FaTimes } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const EMPTY_FORM: Booth = {
  partNo: "",
  boothName: "",
  boothArea: "",
  blaName: "",
  blaMobile: "",
  bloName: "",
  bloMobile: "",
};

/** Reads the uploaded excel by COLUMN POSITION (not header text) since
 *  the sheet ships with Kannada/English mixed headers that can vary:
 *  Part No | Booth Name | Booth Area | BLA Name | BLA Mobile | BLO Name | BLO Mobile
 */
function parseBoothExcel(file: File): Promise<Partial<Booth>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        });

        const [, ...body] = rows; // skip header row
        const parsed: Partial<Booth>[] = body
          .filter((r) => r && String(r[0]).trim() !== "")
          .map((r) => ({
            partNo: String(r[0] ?? "").trim(),
            boothName: String(r[1] ?? "").trim(),
            boothArea: String(r[2] ?? "").trim(),
            blaName: String(r[3] ?? "").trim(),
            blaMobile: String(r[4] ?? "").trim(),
            bloName: String(r[5] ?? "").trim(),
            bloMobile: String(r[6] ?? "").trim(),
          }));
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/** Strips anything that isn't a digit or a leading + so tel: links work
 *  even if the sheet/DB has spaces, dashes, or stray characters. */
function toTelHref(raw?: string): string {
  const cleaned = (raw || "").trim().replace(/[^\d+]/g, "");
  return `tel:${cleaned}`;
}

export default function BlaBloList() {
  const dispatch = useDispatch<AppDispatch>();
  const { booths, loading } = useSelector(boothSelector);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Booth>(EMPTY_FORM);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    dispatch(fetchBooths());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return booths;
    return booths.filter((b) =>
      [b.partNo, b.boothName, b.boothArea, b.blaName, b.blaMobile, b.bloName, b.bloMobile]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [booths, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (b: Booth) => {
    setEditingId(b._id || null);
    setForm({ ...b });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleFormChange = (key: keyof Booth, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.partNo.trim() || !form.boothName.trim()) {
      toast.error("Part No ಮತ್ತು Booth Name ಅಗತ್ಯ — ದಯವಿಟ್ಟು ಭರ್ತಿ ಮಾಡಿ");
      return;
    }
    try {
      if (editingId) {
        await dispatch(updateBooth(editingId, form) as any);
      } else {
        await dispatch(createBooth(form) as any);
      }
      closeForm();
    } catch {
      /* toast already shown */
    }
  };

  const handleDelete = async (b: Booth) => {
    if (!b._id) return;
    if (!window.confirm(`"${b.boothName}" (Part No ${b.partNo}) ಅಳಿಸಬೇಕೆ?`)) return;
    await dispatch(deleteBooth(b._id) as any);
  };

  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const rows = await parseBoothExcel(file);
      if (!rows.length) {
        window.alert("Excel ನಲ್ಲಿ ಯಾವುದೇ ಸಾಲುಗಳು ಸಿಗಲಿಲ್ಲ");
      } else {
        await dispatch(bulkImportBooths(rows, "upsert") as any);
      }
    } catch (err) {
      window.alert("Excel ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಫಾರ್ಮ್ಯಾಟ್ ಪರಿಶೀಲಿಸಿ.");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  /** Exports the currently visible (search-filtered) rows to a structured
   *  .xlsx file — proper headers, column widths, and mobile numbers forced
   *  to text so leading "+"/"0" never get stripped by Excel's auto-format. */
  const handleExportExcel = () => {
    if (!filtered.length) {
      window.alert("Export ಮಾಡಲು ಯಾವುದೇ Data ಇಲ್ಲ");
      return;
    }

    const headers = [
      "ಕ್ರ.ಸಂ",
      "ಭಾಗದ ಸಂಖ್ಯೆ",
      "ಮತಗಟ್ಟೆಯ ಹೆಸರು",
      "ಮತಗಟ್ಟೆಯ ವ್ಯಾಪ್ತಿಯ ಪ್ರದೇಶ",
      "BLA-2 ಹೆಸರು",
      "BLA-2 ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      "BLO ಹೆಸರು",
      "BLO ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    ];

    const rows = filtered.map((b, idx) => [
      idx + 1,
      b.partNo || "",
      b.boothName || "",
      b.boothArea || "",
      b.blaName || "",
      b.blaMobile || "",
      b.bloName || "",
      b.bloMobile || "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Column widths so nothing is clipped or hidden when opened
    ws["!cols"] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 32 },
      { wch: 24 },
      { wch: 26 },
      { wch: 16 },
      { wch: 26 },
      { wch: 16 },
    ];

    // Force mobile number columns to text format (index 5 = BLA mobile, 7 = BLO mobile)
    const range = XLSX.utils.decode_range(ws["!ref"] as string);
    for (let r = 1; r <= range.e.r; r++) {
      [5, 7].forEach((c) => {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (ws[cellRef]) ws[cellRef].z = "@";
      });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BLA-BLO List");

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `BLA-BLO-List-${dateStr}.xlsx`);
  };

  return (
    <>
      <style>{`
        .bla-root { display:flex; flex-direction:column; height:calc(100vh - 158px); min-height:0;
          background:#f0f4f8; font-family:'Segoe UI','Noto Sans Kannada',sans-serif; overflow:hidden; }
        .bla-header { padding:14px; flex-shrink:0; }
        .bla-title { font-size:15px; font-weight:700; color:#1a3d7c; margin-bottom:10px; text-align:center; }
        .bla-toolbar { display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; }
        .bla-search { display:flex; align-items:center; gap:8px; background:#fff; border:1.5px solid #e2e8f0;
          border-radius:10px; padding:8px 12px; flex:1; min-width:200px; max-width:340px; }
        .bla-search input { border:none; outline:none; font-size:13px; flex:1; background:transparent; }
        .bla-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .bla-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; border-radius:10px;
          font-size:12.5px; font-weight:700; border:none; cursor:pointer; transition:all .15s ease; white-space:nowrap; }
        .bla-btn-primary { background:linear-gradient(135deg,#2466d1,#06b6d4); color:#fff; box-shadow:0 3px 10px rgba(36,102,209,.3); }
        .bla-btn-primary:hover { opacity:.92; transform:scale(1.02); }
        .bla-btn-excel { background:#e7f8ef; color:#0f8a4b; border:1px solid #86e0ae; }
        .bla-btn-excel:hover { background:#d3f3e2; }
        .bla-btn-excel:disabled { opacity:.6; cursor:not-allowed; }
        .bla-count { font-size:12px; color:#64748b; margin-top:6px; }

        /* ---- Table area: single scroll container handles both axes,
               so the sticky header and horizontal scroll never fight
               each other or create nested/double scrollbars. ---- */
        .bla-content { flex:1; min-height:0; padding:0 14px 14px; display:flex; }
        .bla-table-scroll { width:100%; overflow:auto; -webkit-overflow-scrolling:touch;
          background:#fff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.06);
          position:relative; }
        .bla-table { width:100%; min-width:920px; border-collapse:collapse; }
        .bla-table thead th { background:linear-gradient(180deg,#06b6d4 0%,#2466d1 100%); color:#fff; font-size:12px;
          padding:10px 8px; text-align:left; border:1px solid rgba(255,255,255,.2); white-space:nowrap;
          position:sticky; top:0; z-index:10; }
        /* keep the very first column pinned on the left too, so it stays
           visible while scrolling horizontally through the wide table */
        .bla-table thead th:first-child { left:0; z-index:11; }
        .bla-table tbody td:first-child { position:sticky; left:0; background:#fff; z-index:1; }
        .bla-table tr:nth-child(even) td:first-child { background:#f8fafc; }
        .bla-table td { border:1px solid #e2e8f0; padding:8px; font-size:12.5px; color:#1e293b; }
        .bla-table tr:nth-child(even) td { background:#f8fafc; }
        .bla-row-actions { display:flex; gap:10px; justify-content:center; }
        .bla-edit-icon { color:#2466d1; cursor:pointer; }
        .bla-edit-icon:hover { color:#164a9c; }
        .bla-del-icon { color:#ef4444; cursor:pointer; }
        .bla-del-icon:hover { color:#b91c1c; }
        .bla-empty { text-align:center; padding:40px; color:#94a3b8; font-size:13px; }

        .bla-phone-link { color:#0f8a4b; font-weight:600; text-decoration:none; display:inline-flex;
          align-items:center; gap:5px; cursor:pointer; }
        .bla-phone-link:hover { text-decoration:underline; color:#0b6a3a; }
        .bla-phone-link:empty { display:none; }

        .bla-overlay { position:fixed; inset:0; background:rgba(15,23,42,.45); display:flex; align-items:center;
          justify-content:center; z-index:1000; padding:16px; }
        .bla-modal { background:#fff; border-radius:14px; padding:20px; width:100%; max-width:480px;
          max-height:90vh; overflow:auto; box-shadow:0 10px 40px rgba(0,0,0,.25); }
        .bla-modal-title { font-size:14px; font-weight:700; color:#1a3d7c; margin-bottom:14px;
          display:flex; align-items:center; justify-content:space-between; }
        .bla-modal-close { cursor:pointer; color:#64748b; }
        .bla-field { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
        .bla-field label { font-size:12px; font-weight:600; color:#64748b; }
        .bla-field input { border:1.5px solid #e2e8f0; border-radius:8px; padding:8px 10px; font-size:13px;
          outline:none; background:#f8fafc; color:#1e293b; font-family:inherit; }
        .bla-field input:focus { border-color:#2466d1; box-shadow:0 0 0 3px rgba(36,102,209,.12); background:#fff; }
        .bla-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
        .bla-btn-ghost { background:#f1f5f9; color:#475569; }
        .bla-btn-ghost:hover { background:#e2e8f0; }

        @media (max-width:600px) {
          .bla-toolbar { flex-direction:column; align-items:stretch; }
          .bla-search { max-width:none; }
        }
      `}</style>

      <div className="bla-root">
        <div className="bla-header">
          <div className="bla-title">BLA-2 / BLO  — ವಿವರ</div>
          <div className="bla-toolbar">
            <div className="bla-search">
              <FaSearch size={12} color="#94a3b8" />
              <input
                placeholder="Part No / Booth / BLA-2 / BLO ಹುಡುಕಿ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="bla-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileChosen}
              />
              <button
                className="bla-btn bla-btn-excel"
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
              >
                <FaFileExcel size={13} />
                {importing ? "ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Excel ಅಪ್ಲೋಡ್"}
              </button>
              <button className="bla-btn bla-btn-excel" onClick={handleExportExcel}>
                <FaFileExcel size={13} /> Excel ಡೌನ್‌ಲೋಡ್
              </button>
              <button className="bla-btn bla-btn-primary" onClick={openCreate}>
                <FaPlus size={12} /> ಹೊಸ Booth ಸೇರಿಸಿ
              </button>
            </div>
          </div>
          <div className="bla-count">
            ಒಟ್ಟು {filtered.length} Booth{loading ? " • ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : ""}
          </div>
        </div>

        <div className="bla-content">
          <div className="bla-table-scroll">
            <table className="bla-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ಕ್ರ.ಸಂ</th>
                  <th style={{ width: 60 }}>ಭಾಗದ ಸಂಖ್ಯೆ</th>
                  <th>ಮತಗಟ್ಟೆಯ ಹೆಸರು</th>
                  <th style={{ width: 80 }}>ಮತಗಟ್ಟೆಯ ವ್ಯಾಪ್ತಿಯ ಪ್ರದೇಶ</th>
                  <th>BLA-2 ಹೆಸರು</th>
                  <th style={{ width: 100 }}>BLA-2 ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</th>
                  <th>BLO ಹೆಸರು</th>
                  <th style={{ width: 120 }}>BLO ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</th>
                  <th style={{ width: 80 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, idx) => (
                  <tr key={b._id || idx}>
                    <td style={{ textAlign: "center", fontWeight: 700, color: "#1a3d7c" }}>{idx + 1}</td>
                    <td>{b.partNo}</td>
                    <td style={{ width: 40 }}>{b.boothName}</td>
                    <td>{b.boothArea}</td>
                    <td>{b.blaName}</td>
                    <td>
                      {b.blaMobile ? (
                        <a
                          href={toTelHref(b.blaMobile)}
                          className="bla-phone-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {b.blaMobile}
                        </a>
                      ) : null}
                    </td>
                    <td>{b.bloName}</td>
                    <td>
                      {b.bloMobile ? (
                        <a
                          href={toTelHref(b.bloMobile)}
                          className="bla-phone-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {b.bloMobile}
                        </a>
                      ) : null}
                    </td>
                    <td>
                      <div className="bla-row-actions">
                        <FiEdit2 className="bla-edit-icon" size={15} onClick={() => openEdit(b)} />
                        <FiTrash2 className="bla-del-icon" size={15} onClick={() => handleDelete(b)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !loading && (
              <div className="bla-empty">
                ಯಾವುದೇ Booth ಇಲ್ಲ. Excel ಅಪ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಹೊಸದಾಗಿ ಸೇರಿಸಿ.
              </div>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bla-overlay" onClick={closeForm}>
          <div className="bla-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bla-modal-title">
              {editingId ? "Booth ವಿವರ ಸಂಪಾದಿಸಿ" : "ಹೊಸ Booth ಸೇರಿಸಿ"}
              <FaTimes className="bla-modal-close" onClick={closeForm} />
            </div>

            <div className="bla-field">
              <label>ಭಾಗದ ಸಂಖ್ಯೆ *</label>
              <input value={form.partNo} onChange={(e) => handleFormChange("partNo", e.target.value)} placeholder="" />
            </div>
            <div className="bla-field">
              <label>ಮತಗಟ್ಟೆಯ ಹೆಸರು *</label>
              <input value={form.boothName} onChange={(e) => handleFormChange("boothName", e.target.value)} placeholder="Booth ಹೆಸರು" />
            </div>
            <div className="bla-field">
              <label>ಮತಗಟ್ಟೆಯ ವ್ಯಾಪ್ತಿಯ ಪ್ರದೇಶ</label>
              <input value={form.boothArea} onChange={(e) => handleFormChange("boothArea", e.target.value)} placeholder="ಗ್ರಾಮ / ಪ್ರದೇಶ" />
            </div>
            <div className="bla-field">
              <label>BLA-2 ಹೆಸರು</label>
              <input value={form.blaName} onChange={(e) => handleFormChange("blaName", e.target.value)} placeholder="BLA ಹೆಸರು" />
            </div>
            <div className="bla-field">
              <label>BLA-2 ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</label>
              <input value={form.blaMobile} onChange={(e) => handleFormChange("blaMobile", e.target.value)} placeholder="+91..." />
            </div>
            <div className="bla-field">
              <label>BLO ಹೆಸರು</label>
              <input value={form.bloName} onChange={(e) => handleFormChange("bloName", e.target.value)} placeholder="BLO ಹೆಸರು" />
            </div>
            <div className="bla-field">
              <label>BLO ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</label>
              <input value={form.bloMobile} onChange={(e) => handleFormChange("bloMobile", e.target.value)} placeholder="+91..." />
            </div>

            <div className="bla-modal-actions">
              <button className="bla-btn bla-btn-ghost" onClick={closeForm}>ರದ್ದು</button>
              <button className="bla-btn bla-btn-primary" onClick={handleSave}>
                <FaSave size={12} /> ಉಳಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}