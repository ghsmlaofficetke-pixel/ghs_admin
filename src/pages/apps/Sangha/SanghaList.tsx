import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../../redux/store";
import {
  fetchSanghas, createSangha, updateSangha, deleteSangha,
  sanghaSelector, Sangha, AreaType, TalukType,
} from "../../../api/sangha";
import { FaArrowLeft, FaPlus, FaSearch, FaUsers, FaEdit } from "react-icons/fa";
import { FiTrash2, FiChevronRight } from "react-icons/fi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const getAuthConfig = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` } });

const AREA_LABELS: Record<string, string> = {
  gramapanchayath: "ಗ್ರಾಮ ಪಂಚಾಯತ್",
  purasabha: "ಪುರಸಭೆ ತರೀಕೆರೆ",
  patana: "ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ",
};

const PATANA_ID  = "69a9305c2e0f1228f681877d"; // panchayathajjampura
const PURASABHA_ID = "69a9303f2e0f1228f681877b"; // purasabetarikere

const TALUK_ID_MAP: Record<string, string> = {
  tarikere:  "697c608ce9a52546e447aa74",
  ajjampura: "697c60a0e9a52546e447aa76",
};

const EMPTY_FORM: Omit<Sangha, "_id" | "createdAt"> = {
  name: "", taluk: "tarikere", areaType: "gramapanchayath",
  gpId: null, wardIds: [], address: "", phone: "", remark: "",
};

export default function SanghaList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { taluk, areaType } = useParams<{ taluk: TalukType; areaType: AreaType }>();

  const { list, loading } = useSelector(sanghaSelector);

  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData]   = useState<Sangha | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  // GP list (for gramapanchayath)
  const [gpList, setGpList]       = useState<any[]>([]);
  // Ward list (for purasabha / patana)
  const [wardList, setWardList]   = useState<any[]>([]);

  const refetch = { taluk, areaType };

  useEffect(() => {
    if (taluk && areaType) dispatch(fetchSanghas({ taluk, areaType }));
  }, [taluk, areaType]);

  // Load GPs for gramapanchayath
  useEffect(() => {
    if (areaType !== "gramapanchayath") return;
    const talukId = TALUK_ID_MAP[taluk || ""];
    if (!talukId) return;
    // Fetch all hoblis for this taluk, then all GPs
    fetch(`${API_URL}/hoblis/panchayath/${talukId}`, getAuthConfig() as any)
      .then(r => r.json())
      .then(async data => {
        const hoblis = Array.isArray(data?.data) ? data.data : [];
        const allGPs: any[] = [];
        for (const h of hoblis) {
          const r2 = await fetch(`${API_URL}/grama-panchayaths/hobli/${h._id}`, getAuthConfig() as any);
          const d2 = await r2.json();
          const gps = Array.isArray(d2?.data) ? d2.data : Array.isArray(d2) ? d2 : [];
          allGPs.push(...gps);
        }
        setGpList(allGPs.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(console.error);
  }, [areaType, taluk]);

  // Load wards for purasabha / patana
  useEffect(() => {
    if (areaType !== "purasabha" && areaType !== "patana") return;
    const patanaId = areaType === "purasabha" ? PURASABHA_ID : PATANA_ID;
    fetch(`${API_URL}/ward/panchayatipatana/${patanaId}`, getAuthConfig() as any)
      .then(r => r.json())
      .then(data => setWardList(Array.isArray(data?.data) ? data.data : []))
      .catch(console.error);
  }, [areaType]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter(s => s.name.toLowerCase().includes(q));
  }, [list, search]);

  const handleDelete = () => {
    if (!deleteId) return;
    dispatch(deleteSangha(deleteId, refetch));
    setDeleteId(null);
  };

  const title = `${taluk === "ajjampura" ? "ಅಜ್ಜಂಪುರ" : "ತರೀಕೆರೆ"} — ${AREA_LABELS[areaType || ""] || ""}`;

  return (
    <div style={{ height: "calc(100vh - 158px)", display: "flex", flexDirection: "column", background: "#f0f4f8", fontFamily: "'Segoe UI','Noto Sans Kannada',sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "10px 14px", flexShrink: 0, boxShadow: "0 2px 8px rgba(36,102,209,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button onClick={() => navigate("/apps/sangha")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, background: "#fff", border: "1.5px solid #e2e8f0", color: "#1a3d7c", cursor: "pointer", fontSize: 13, fontWeight: 600, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <FaArrowLeft size={11} /> ಹಿಂದೆ
          </button>
          <div style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 700, color: "#1a3d7c" }}>{title}</div>
          <button onClick={() => { setEditData(null); setShowModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, background: "linear-gradient(135deg,#2466d1,#06b6d4)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px rgba(36,102,209,0.28)" }}>
            <FaPlus size={11} /> ಸಂಘ ಸೇರಿಸಿ
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <FaSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 12 }} />
          <input placeholder="ಸಂಘ ಹೆಸರು ಹುಡುಕಿ..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "7px 10px 7px 32px", border: "1px solid #e2e8f0", borderRadius: 20, fontSize: 13, outline: "none", background: "#f8fafc", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>ಒಟ್ಟು ಸಂಘಗಳು: <strong style={{ color: "#1a3d7c" }}>{filtered.length}</strong></div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {loading && <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 48, color: "#94a3b8" }}>
            <FaUsers size={36} style={{ marginBottom: 10, opacity: 0.3 }} />
            <div>ಯಾವುದೇ ಸಂಘ ನೋಂದಾಯಿಸಿಲ್ಲ</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>ಮೇಲೆ "ಸಂಘ ಸೇರಿಸಿ" ಒತ್ತಿ ಹೊಸ ಸಂಘ ಸೇರಿಸಿ</div>
          </div>
        )}
        {filtered.map((s, i) => (
          <div key={s._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#eff6ff,#ecfeff)", border: "1.5px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", color: "#2466d1", flexShrink: 0, fontWeight: 800, fontSize: 15 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1a3d7c", marginBottom: 2 }}>{s.name}</div>
              {s.phone && <div style={{ fontSize: 12, color: "#64748b" }}>📞 {s.phone}</div>}
              {s.address && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>📍 {s.address}</div>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <button onClick={() => navigate(`/apps/sangha/members/${s._id}`)}
                style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, background: "linear-gradient(135deg,#2466d1,#06b6d4)", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                <FaUsers size={11} /> ಸದಸ್ಯರು <FiChevronRight size={12} />
              </button>
              <button onClick={() => { setEditData(s); setShowModal(true); }}
                style={{ padding: "6px 10px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe", color: "#2466d1", cursor: "pointer" }}>
                <FaEdit size={13} />
              </button>
              <button onClick={() => setDeleteId(s._id!)}
                style={{ padding: "6px 10px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", cursor: "pointer" }}>
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showModal && (
        <SanghaFormModal
          editData={editData}
          taluk={taluk!}
          areaType={areaType!}
          gpList={gpList}
          wardList={wardList}
          existingGpIds={list.filter(s => s.gpId).map(s => s.gpId!)}
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSave={(payload) => {
            if (editData?._id) dispatch(updateSangha(editData._id, payload, refetch));
            else dispatch(createSangha(payload as Sangha, refetch));
            setShowModal(false); setEditData(null);
          }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#dc2626" }}><FiTrash2 size={22} /></div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>ಈ ಸಂಘ ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಸದಸ್ಯರ ಮಾಹಿತಿ ಅಳಿಸಲಾಗುತ್ತದೆ.</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>ರದ್ದುಮಾಡಿ</button>
              <button onClick={handleDelete} style={{ padding: "8px 20px", borderRadius: 8, background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>ಅಳಿಸಿ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Form Modal ── */
function SanghaFormModal({ editData, taluk, areaType, gpList, wardList, existingGpIds, onClose, onSave }: {
  editData: Sangha | null;
  taluk: string; areaType: string;
  gpList: any[]; wardList: any[];
  existingGpIds: string[];
  onClose: () => void;
  onSave: (p: Partial<Sangha>) => void;
}) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    gpId: editData?.gpId || "",
    wardIds: editData?.wardIds || [] as string[],
    address: editData?.address || "",
    phone: editData?.phone || "",
    remark: editData?.remark || "",
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleWard = (id: string) => {
    setForm(f => ({
      ...f,
      wardIds: f.wardIds.includes(id) ? f.wardIds.filter(w => w !== id) : [...f.wardIds, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (areaType === "gramapanchayath" && !form.gpId) return;
    if ((areaType === "purasabha" || areaType === "patana") && form.wardIds.length === 0) return;
    onSave({
      name: form.name.trim(),
      taluk: taluk as TalukType,
      areaType: areaType as AreaType,
      gpId: areaType === "gramapanchayath" ? form.gpId : null,
      wardIds: areaType !== "gramapanchayath" ? form.wardIds : [],
      address: form.address,
      phone: form.phone,
      remark: form.remark,
    });
  };

  // GPs available = all GPs minus already-registered ones (except current edit)
  const availableGPs = gpList.filter(gp =>
    !existingGpIds.includes(gp._id) || gp._id === editData?.gpId
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1a3d7c", marginBottom: 18 }}>
          {editData ? "ಸಂಘ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಸಂಘ ಸೇರಿಸಿ"}
        </div>

        <Field label="ಸಂಘದ ಹೆಸರು *">
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="ಸಂಘದ ಹೆಸರು ನಮೂದಿಸಿ" style={inputStyle} />
        </Field>

        {/* GP selector for gramapanchayath */}
        {areaType === "gramapanchayath" && (
          <Field label="ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಯ್ಕೆ ಮಾಡಿ *">
            <select value={form.gpId} onChange={e => set("gpId", e.target.value)} style={inputStyle}>
              <option value="">-- ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಯ್ಕೆ ಮಾಡಿ --</option>
              {availableGPs.map(gp => (
                <option key={gp._id} value={gp._id}>{gp.name}</option>
              ))}
            </select>
            {availableGPs.length === 0 && gpList.length > 0 && (
              <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 4 }}>⚠️ ಎಲ್ಲಾ ಗ್ರಾಮ ಪಂಚಾಯತ್‌ಗಳಿಗೆ ಈಗಾಗಲೇ ಸಂಘ ನೋಂದಾಯಿಸಲಾಗಿದೆ</div>
            )}
          </Field>
        )}

        {/* Ward multi-select for purasabha / patana */}
        {(areaType === "purasabha" || areaType === "patana") && (
          <Field label={`ವಾರ್ಡ್‌ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ * (${form.wardIds.length} ಆಯ್ಕೆ)`}>
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 10, maxHeight: 200, overflowY: "auto", background: "#f8fafc" }}>
              {wardList.length === 0 && <div style={{ fontSize: 12, color: "#94a3b8" }}>ವಾರ್ಡ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>}
              {wardList.map(w => (
                <label key={w._id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", cursor: "pointer", borderRadius: 6, marginBottom: 2 }}>
                  <input type="checkbox" checked={form.wardIds.includes(w._id)} onChange={() => toggleWard(w._id)}
                    style={{ width: 16, height: 16, cursor: "pointer", accentColor: "#2466d1" }} />
                  <span style={{ fontSize: 13, color: "#1e293b", fontWeight: form.wardIds.includes(w._id) ? 600 : 400 }}>
                    {w.wardNo ? `${w.wardNo} - ` : ""}{w.name}
                  </span>
                </label>
              ))}
            </div>
          </Field>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="ಫೋನ್ ನಂಬರ್">
            <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="ಫೋನ್ ನಂಬರ್" style={inputStyle} />
          </Field>
          <Field label="ವಿಳಾಸ">
            <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="ವಿಳಾಸ" style={inputStyle} />
          </Field>
        </div>

        <Field label="ಟಿಪ್ಪಣಿ">
          <textarea value={form.remark} onChange={e => set("remark", e.target.value)} rows={2} placeholder="ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ..." style={{ ...inputStyle, resize: "vertical" }} />
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
          <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 8, background: "#f1f5f9", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, color: "#64748b" }}>ರದ್ದುಮಾಡಿ</button>
          <button onClick={handleSubmit} style={{ padding: "8px 20px", borderRadius: 8, background: "linear-gradient(135deg,#2466d1,#06b6d4)", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>ಉಳಿಸಿ</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "8px 10px", border: "1.5px solid #e2e8f0", borderRadius: 8,
  fontSize: 13, outline: "none", background: "#f8fafc", fontFamily: "inherit",
  color: "#1e293b", boxSizing: "border-box",
};
