// pages/apps/VoiceQuery/VoiceQueryPage.tsx
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaSearch,
  FaTimes,
  FaPhone,
  FaUser,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaSpinner,
} from "react-icons/fa";
import { MdWork, MdPeople, MdHomeWork, MdContactPhone } from "react-icons/md";
import {
  searchByName,
  getGPDetail,
  searchGPs,
  type ContactPerson,
  type VillageResult,
  type WardResult,
  type ManaviItem,
  type WorkItem,
  type GPInfo,
  type NameSearchResult,
  type GPDetailResult,
  type GPSuggestion,
} from "../../../api/voiceQuery";

/* ─── types ──────────────────────────────────────────────────── */
type QueryResult =
  | (NameSearchResult & { gp?: undefined })
  | (GPDetailResult & { query?: undefined; wards?: undefined; wardManavis?: undefined; wardIndWorks?: undefined; wardComWorks?: undefined });

/* ─── status config ──────────────────────────────────────────── */
const STATUS_CONFIG: Record<string, { bg: string; color: string; dot: string }> = {
  Pending:       { bg: "#fff7ed", color: "#c2410c", dot: "#f97316" },
  Approved:      { bg: "#f0fdf4", color: "#15803d", dot: "#22c55e" },
  Completed:     { bg: "#eff6ff", color: "#1d4ed8", dot: "#3b82f6" },
  "In Progress": { bg: "#f0f9ff", color: "#0369a1", dot: "#0ea5e9" },
  Proposed:      { bg: "#faf5ff", color: "#7e22ce", dot: "#a855f7" },
};

/* ─── StatusBadge ────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
      flexShrink: 0,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ─── SectionHeader ──────────────────────────────────────────── */
function SectionHeader({
  icon, title, count, open, onToggle, accent,
}: {
  icon: React.ReactNode; title: string; count: number;
  open: boolean; onToggle: () => void; accent: string;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "10px 14px",
        background: open ? `${accent}12` : "#f8fafc",
        border: `1.5px solid ${open ? accent + "30" : "#e2e8f0"}`,
        borderRadius: 10, cursor: "pointer", marginBottom: 10,
        transition: "all 0.18s",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13, color: open ? accent : "#374151" }}>
        <span style={{ color: accent, display: "flex" }}>{icon}</span>
        {title}
        <span style={{
          background: accent, color: "#fff",
          borderRadius: 20, padding: "1px 9px", fontSize: 11, fontWeight: 700,
        }}>{count}</span>
      </span>
      <span style={{ color: open ? accent : "#94a3b8", fontSize: 12 }}>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    </button>
  );
}

/* ─── ContactCard ────────────────────────────────────────────── */
function ContactCard({ name, phones, subtitle }: { name: string; phones: string[]; subtitle?: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "10px 12px", borderRadius: 10, marginBottom: 8,
      background: "#fff", border: "1.5px solid #e0e7ff",
      boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <FaUser size={14} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#1e1b4b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {name}
        </div>
        {subtitle && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{subtitle}</div>}
        {phones.map((ph, i) => (
          <a key={i} href={`tel:${ph}`} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            color: "#4f46e5", fontSize: 12, fontWeight: 600,
            textDecoration: "none", marginTop: 4, marginRight: 10,
          }}>
            <span style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FaPhone size={9} color="#4f46e5" />
            </span>
            {ph}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── VillageCard ────────────────────────────────────────────── */
function VillageCard({ v }: { v: VillageResult }) {
  return (
    <div style={{
      background: "#fff", border: "1.5px solid #d1fae5",
      borderRadius: 12, padding: "12px 14px", marginBottom: 10,
      boxShadow: "0 1px 4px rgba(16,185,129,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <span style={{
          width: 28, height: 28, borderRadius: 8,
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <FaMapMarkerAlt size={12} color="#fff" />
        </span>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#064e3b" }}>{v.name}</span>
        {v.gp && (
          <span style={{
            fontSize: 11, background: "#ecfdf5", color: "#065f46",
            border: "1px solid #a7f3d0", borderRadius: 6, padding: "1px 8px", fontWeight: 600,
          }}>{v.gp}</span>
        )}
      </div>
      {v.contactPersons?.length
        ? v.contactPersons.map((cp, i) => <ContactCard key={i} name={cp.name} phones={cp.phones} />)
        : <EmptyState message="Contact ಇಲ್ಲ" />}
    </div>
  );
}

/* ─── ManaviRow ──────────────────────────────────────────────── */
function ManaviRow({ m, locationLabel }: { m: ManaviItem; locationLabel: string }) {
  return (
    <div style={{
      padding: "10px 12px", borderRadius: 10, marginBottom: 8,
      background: "#fff", border: "1.5px solid #fde68a",
      boxShadow: "0 1px 4px rgba(245,158,11,0.08)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1c1917", marginBottom: 3 }}>{m.work}</div>
          <div style={{ fontSize: 11, color: "#78716c" }}>
            {[m.type, m.caste, locationLabel].filter(Boolean).join(" · ")}
          </div>
          {m.description && (
            <div style={{ fontSize: 11, color: "#a8a29e", marginTop: 4 }}>{m.description}</div>
          )}
        </div>
        <StatusBadge status={m.status} />
      </div>
    </div>
  );
}

/* ─── WorkRow ────────────────────────────────────────────────── */
function WorkRow({ w }: { w: WorkItem }) {
  const isInd = w.type === "individual" || w.type === "ward_individual";
  const location = w.village || w.ward || "";
  return (
    <div style={{
      padding: "10px 12px", borderRadius: 10, marginBottom: 8,
      background: "#fff",
      border: `1.5px solid ${isInd ? "#bfdbfe" : "#ddd6fe"}`,
      boxShadow: `0 1px 4px ${isInd ? "rgba(59,130,246,0.08)" : "rgba(139,92,246,0.08)"}`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {isInd ? (
            <>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1e3a8a" }}>{w.name || "—"}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {[w.scheme, w.orderNumber, w.address].filter(Boolean).join(" · ")}
              </div>
              {w.mobile && (
                <a href={`tel:${w.mobile}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  color: "#2563eb", fontSize: 12, textDecoration: "none", marginTop: 4,
                }}>
                  <FaPhone size={9} /> {w.mobile}
                </a>
              )}
            </>
          ) : (
            <>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#3b0764" }}>{w.workDetails || "—"}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                {[w.scheme, w.department, w.letterNumber].filter(Boolean).join(" · ")}
                {w.estimatedAmount ? ` · ₹${w.estimatedAmount}L` : ""}
              </div>
              {w.remarks && <div style={{ fontSize: 11, color: "#a78bfa", marginTop: 3 }}>{w.remarks}</div>}
            </>
          )}
          {location && (
            <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
              <FaMapMarkerAlt size={9} />{location}
            </div>
          )}
        </div>
        {w.status && <StatusBadge status={w.status} />}
      </div>
    </div>
  );
}

/* ─── EmptyState ─────────────────────────────────────────────── */
function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: "center", padding: "12px 0", color: "#94a3b8", fontSize: 12 }}>
      {message}
    </div>
  );
}

/* ─── SectionCard ────────────────────────────────────────────── */
function SectionCard({
  icon, title, count, open, onToggle, accent, children,
}: {
  icon: React.ReactNode; title: string; count: number;
  open: boolean; onToggle: () => void; accent: string; children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div style={{
      background: "#f8fafc",
      borderRadius: 14,
      border: "1.5px solid #e2e8f0",
      marginBottom: 12,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "10px 14px 0" }}>
        <SectionHeader
          icon={icon} title={title} count={count}
          open={open} onToggle={onToggle} accent={accent}
        />
      </div>
      {open && (
        <div style={{ padding: "0 14px 12px" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */
export default function VoiceQueryPage() {
  const [searchText, setSearchText]         = useState("");
  const [mode, setMode]                     = useState<"village" | "gp">("village");
  const [listening, setListening]           = useState(false);
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState<QueryResult | null>(null);
  const [gpSuggestions, setGpSuggestions]   = useState<GPSuggestion[]>([]);
  const [showGpDropdown, setShowGpDropdown] = useState(false);
  const [openSections, setOpenSections]     = useState<Record<string, boolean>>({
    pdo: true, villages: true, wards: true, manavis: true,
    indWorks: true, comWorks: true,
  });

  const recognitionRef  = useRef<any>(null);
  const gpSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef        = useRef<HTMLInputElement>(null);

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  /* ── voice ── */
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("ನಿಮ್ಮ browser ಅಲ್ಲಿ Voice support ಇಲ್ಲ. Chrome use ಮಾಡಿ."); return; }
    const rec = new SR();
    rec.lang = "kn-IN"; rec.interimResults = false; rec.maxAlternatives = 1;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = (e: any) => { setListening(false); if (e.error !== "no-speech") toast.error("Voice error: " + e.error); };
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setSearchText(t); if (mode === "village") doVillageSearch(t); };
    recognitionRef.current = rec;
    rec.start();
  }, [mode]);

  const stopListening = () => { recognitionRef.current?.stop(); setListening(false); };

  const doVillageSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true); setResult(null);
    try { setResult(await searchByName(q)); }
    catch (err: any) { toast.error(err?.response?.data?.message || "Search failed"); }
    finally { setLoading(false); }
  };

  const handleGpInput = (val: string) => {
    setSearchText(val); setResult(null);
    if (gpSearchTimeout.current) clearTimeout(gpSearchTimeout.current);
    if (!val.trim()) { setGpSuggestions([]); return; }
    gpSearchTimeout.current = setTimeout(async () => {
      try { setGpSuggestions(await searchGPs(val)); setShowGpDropdown(true); } catch { /* silent */ }
    }, 300);
  };

  const selectGP = async (gp: GPSuggestion) => {
    setSearchText(gp.name); setShowGpDropdown(false); setLoading(true); setResult(null);
    try { setResult(await getGPDetail(gp._id)); }
    catch (err: any) { toast.error(err?.response?.data?.message || "GP data fetch failed"); }
    finally { setLoading(false); }
  };

  const clearAll = () => {
    setSearchText(""); setResult(null); setGpSuggestions([]); setShowGpDropdown(false);
    inputRef.current?.focus();
  };

  /* ── derived ── */
  const isGPResult = result && "gp" in result && result.gp;
  const allManavis  = [...(result?.manavis || []), ...((result as NameSearchResult)?.wardManavis || [])];
  const allIndWorks = [...(result?.indWorks || []), ...((result as NameSearchResult)?.wardIndWorks || [])];
  const allComWorks = [...(result?.comWorks || []), ...((result as NameSearchResult)?.wardComWorks || [])];
  const wards       = (result as NameSearchResult)?.wards || [];
  const totalCount  =
    (result?.villages?.length || 0) + wards.length +
    allManavis.length + allIndWorks.length + allComWorks.length +
    ((result as GPDetailResult)?.gp?.pdo?.length || 0);

  /* ── render ── */
  return (
    <>
      <style>{`
        @keyframes vq-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:0.8} }
        @keyframes vq-spin   { to{transform:rotate(360deg)} }
        @keyframes vq-fade   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes vq-wave   { 0%,100%{height:10px} 50%{height:24px} }
        .vq-mic-pulse { animation: vq-pulse 1s ease-in-out infinite; }
        .vq-spin { animation: vq-spin 0.8s linear infinite; }
        .vq-fade { animation: vq-fade 0.25s ease forwards; }
        .vq-tab { transition: all 0.18s; }
        .vq-tab:hover { transform: translateY(-1px); }
        .vq-search-input:focus { outline: none; }
        .vq-gp-item:hover { background: #f0f9ff !important; }
        .vq-clear:hover { background: #fee2e2 !important; color: #dc2626 !important; }
        .vq-wave-bar {
          width: 3px; border-radius: 3px; background: #ef4444;
          display: inline-block; margin: 0 1px;
          animation: vq-wave 0.6s ease-in-out infinite;
        }
        .vq-wave-bar:nth-child(2){animation-delay:0.1s}
        .vq-wave-bar:nth-child(3){animation-delay:0.2s}
        .vq-wave-bar:nth-child(4){animation-delay:0.15s}
        .vq-wave-bar:nth-child(5){animation-delay:0.05s}

        /* ── KEY FIX: make this page fill the content area and scroll internally ── */
        .vq-page-root {
          display: flex;
          flex-direction: column;
          height: 100%;          /* fill parent content area — no overflow to window */
          overflow: hidden;
          background: #f1f5f9;
          font-family: 'Segoe UI','Noto Sans Kannada',sans-serif;
        }

        /* sticky top: banner + search box */
        .vq-sticky-top {
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
          background: #f1f5f9;
        }

        /* scrollable results area */
        .vq-scroll-body {
          flex: 1 1 0;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          padding: 0 12px 24px;
          /* custom scrollbar */
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe #f1f5f9;
        }
        .vq-scroll-body::-webkit-scrollbar { width: 5px; }
        .vq-scroll-body::-webkit-scrollbar-track { background: #f1f5f9; }
        .vq-scroll-body::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 4px; }

        /* responsive: phones */
        @media (max-width: 480px) {
          .vq-search-inner { flex-wrap: wrap; gap: 6px !important; }
          .vq-search-inner .vq-input-wrap { width: 100% !important; order: 1; }
          .vq-search-inner .vq-btn-row { width: 100% !important; order: 2; display: flex; gap: 8px; }
          .vq-search-inner .vq-btn-row > * { flex: 1; }
          .vq-banner { padding: 10px 10px 14px !important; border-radius: 0 0 18px 18px !important; }
          .vq-banner-title { font-size: 15px !important; }
          .vq-banner-sub { font-size: 11px !important; }
        }
      `}</style>

      {/* ── PAGE ROOT — fills content area, no window scroll ── */}
      <div className="vq-page-root">

        {/* ══ STICKY TOP SECTION ══════════════════════════════════ */}
        <div className="vq-sticky-top">

          {/* HEADER BANNER */}
          <div
            className="vq-banner"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
              borderRadius: "0 0 20px 20px",
              padding: "6px 8px 10px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* decorative circles */}
            <div style={{ position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.05)",pointerEvents:"none" }}/>
            <div style={{ position:"absolute",bottom:-20,left:40,width:80,height:80,borderRadius:"50%",background:"rgba(139,92,246,0.2)",pointerEvents:"none" }}/>

            {/* title row */}
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8,position:"relative" }}>
              <div style={{
                width:42,height:42,borderRadius:13,flexShrink:0,
                background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:"0 4px 14px rgba(99,102,241,0.5)",
              }}>
                <MdContactPhone size={18} color="#fff"/>
              </div>
              <div>
                <div className="vq-banner-title" style={{ color:"#fff",fontWeight:800,fontSize:17,letterSpacing:0.3 }}>
                 ಧ್ವನಿಯಲ್ಲಿ ಹುಡುಕಿ
                </div>
                <div className="vq-banner-sub" style={{ color:"#c4b5fd",fontSize:12 }}>
                  Voice Search · ಊರು / GP / Contacts / ಕೆಲಸ
                </div>
              </div>
            </div>

            {/* MODE TABS */}
            <div style={{ display:"flex",gap:8,position:"relative" }}>
              {(["village","gp"] as const).map((m) => (
                <button
                  key={m}
                  className="vq-tab"
                  onClick={() => { setMode(m); clearAll(); }}
                  style={{
                    padding:"6px 16px",borderRadius:20,
                    border: mode===m ? "none" : "1.5px solid rgba(196,181,253,0.5)",
                    background: mode===m
                      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                      : "rgba(255,255,255,0.08)",
                    color: mode===m ? "#fff" : "#c4b5fd",
                    fontWeight:700,fontSize:13,cursor:"pointer",
                    boxShadow: mode===m ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                  }}
                >
                  {m === "village" ? "🏘 ಊರು / ವಾರ್ಡ್" : "🏛 ಗ್ರಾ.ಪಂ"}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH BOX — sits below banner, still sticky */}
          <div style={{ padding:"8px 10px 4px",background:"#f1f5f9" }}>
            <div style={{ position:"relative" }}>
              <div
                className="vq-search-inner"
                style={{
                  display:"flex",gap:8,alignItems:"center",
                  background:"#fff",
                  borderRadius:14,
                  border:"2px solid",
                  borderColor: listening ? "#ef4444" : "#e0e7ff",
                  boxShadow: listening
                    ? "0 0 0 4px rgba(239,68,68,0.12)"
                    : "0 4px 20px rgba(99,102,241,0.12)",
                  padding:"4px 4px 4px 8px",
                  transition:"all 0.2s",
                }}
              >
                <FaSearch size={13} style={{ color:"#a5b4fc",flexShrink:0 }} />

                <input
                  ref={inputRef}
                  className="vq-search-input"
                  type="text"
                  placeholder={mode==="village" ? "ಊರಿನ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ MIC ಒತ್ತಿ…" : "GP ಹೆಸರು ಟೈಪ್ ಮಾಡಿ…"}
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); if (mode==="gp") handleGpInput(e.target.value); }}
                  onKeyDown={(e) => { if(e.key==="Enter" && mode==="village") doVillageSearch(searchText); }}
                  autoComplete="off"
                  style={{
                    flex:1,border:"none",background:"transparent",
                    fontSize:14,fontFamily:"inherit",color:"#1e1b4b",
                    minWidth:0,
                  }}
                />

                {searchText && (
                  <button
                    className="vq-clear"
                    onClick={clearAll}
                    style={{
                      width:28,height:28,borderRadius:"50%",
                      border:"none",background:"#f1f5f9",
                      cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
                      flexShrink:0,transition:"all 0.15s",
                    }}
                  >
                    <FaTimes size={11} style={{ color:"#94a3b8" }} />
                  </button>
                )}

                <button
                  onClick={listening ? stopListening : startListening}
                  className={listening ? "vq-mic-pulse" : ""}
                  style={{
                    width:40,height:40,borderRadius:11,border:"none",cursor:"pointer",
                    background: listening
                      ? "linear-gradient(135deg,#ef4444,#dc2626)"
                      : "linear-gradient(135deg,#6366f1,#8b5cf6)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    flexShrink:0,
                    boxShadow: listening
                      ? "0 4px 12px rgba(239,68,68,0.4)"
                      : "0 4px 12px rgba(99,102,241,0.35)",
                    transition:"background 0.2s",
                  }}
                >
                  {listening ? <FaMicrophoneSlash size={16} color="#fff"/> : <FaMicrophone size={16} color="#fff"/>}
                </button>

                {mode==="village" && (
                  <button
                    onClick={() => doVillageSearch(searchText)}
                    style={{
                      padding:"9px 14px",borderRadius:10,border:"none",
                      background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                      color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",
                      boxShadow:"0 3px 10px rgba(79,70,229,0.3)",flexShrink:0,
                      whiteSpace:"nowrap",
                    }}
                  >
                    ಹುಡುಕಿ
                  </button>
                )}
              </div>

              {/* GP dropdown */}
              {mode==="gp" && showGpDropdown && gpSuggestions.length>0 && (
                <div style={{
                  position:"absolute",top:"calc(100% + 6px)",left:0,right:0,
                  background:"#fff",borderRadius:14,
                  border:"1.5px solid #e0e7ff",
                  boxShadow:"0 8px 24px rgba(99,102,241,0.15)",
                  zIndex:200,maxHeight:220,overflowY:"auto",
                }}>
                  {gpSuggestions.map((gp) => (
                    <button
                      key={gp._id}
                      className="vq-gp-item"
                      onMouseDown={() => selectGP(gp)}
                      style={{
                        width:"100%",textAlign:"left",
                        padding:"10px 14px",border:"none",
                        background:"transparent",cursor:"pointer",
                        borderBottom:"1px solid #f1f5f9",
                        transition:"background 0.12s",
                      }}
                    >
                      <div style={{ fontWeight:700,fontSize:13,color:"#1e1b4b" }}>{gp.name}</div>
                      {gp.hobli && <div style={{ fontSize:11,color:"#6b7280" }}>{gp.hobli.name}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* listening indicator */}
            {listening && (
              <div style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"9px 14px",marginTop:8,borderRadius:12,
                background:"#fef2f2",border:"1.5px solid #fecaca",
              }}>
                <div style={{ display:"flex",alignItems:"flex-end",gap:1,height:24 }}>
                  {[1,2,3,4,5].map(i=><span key={i} className="vq-wave-bar"/>)}
                </div>
                <span style={{ color:"#dc2626",fontWeight:700,fontSize:13 }}>ಕೇಳ್ತಿದ್ದೇನೆ… ಮಾತಾಡಿ</span>
              </div>
            )}
          </div>
        </div>
        {/* ══ END STICKY TOP ══════════════════════════════════════ */}


        {/* ══ SCROLLABLE RESULTS BODY ═════════════════════════════ */}
        <div className="vq-scroll-body">

          {/* LOADING */}
          {loading && (
            <div style={{ textAlign:"center",padding:"48px 0" }}>
              <div style={{ display:"inline-flex",flexDirection:"column",alignItems:"center",gap:12 }}>
                <div style={{
                  width:52,height:52,borderRadius:"50%",
                  border:"3px solid #e0e7ff",borderTopColor:"#6366f1",
                }} className="vq-spin"/>
                <div style={{ color:"#6366f1",fontWeight:700,fontSize:14 }}>Data ತರ್ತಿದ್ದೇನೆ…</div>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {!loading && result && (
            <div className="vq-fade">

              {/* result meta bar */}
              <div style={{
                display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"10px 14px",marginBottom:12,marginTop:4,
                background:"#fff",borderRadius:12,
                border:"1.5px solid #e0e7ff",
                boxShadow:"0 2px 8px rgba(99,102,241,0.08)",
              }}>
                <span style={{ fontSize:13,color:"#475569",fontWeight:600 }}>
                  {(result as NameSearchResult).query
                    ? <>"<span style={{color:"#4f46e5"}}>{(result as NameSearchResult).query}</span>" ಗಾಗಿ ಫಲಿತಾಂಶ</>
                    : isGPResult
                    ? <span style={{color:"#4f46e5"}}>{(result as GPDetailResult).gp.name} — ಗ್ರಾ.ಪಂ</span>
                    : "ಫಲಿತಾಂಶ"}
                </span>
                <span style={{
                  background:"linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color:"#fff",borderRadius:20,padding:"3px 12px",
                  fontSize:12,fontWeight:700,
                }}>{totalCount} ಒಟ್ಟು</span>
              </div>

              {/* no results */}
              {totalCount===0 && (
                <div style={{
                  textAlign:"center",padding:"48px 20px",
                  background:"#fff",borderRadius:16,
                  border:"1.5px dashed #e2e8f0",
                }}>
                  <div style={{ fontSize:40,marginBottom:12 }}>🔍</div>
                  <div style={{ color:"#64748b",fontWeight:700,fontSize:14 }}>ಯಾವ data ಸಿಗಲಿಲ್ಲ</div>
                  <div style={{ color:"#94a3b8",fontSize:12,marginTop:4 }}>ಬೇರೆ ಹೆಸರು ಪ್ರಯತ್ನಿಸಿ</div>
                </div>
              )}

              {/* GP info card */}
              {isGPResult && (
                <div style={{
                  background:"linear-gradient(135deg,#eff6ff,#f5f3ff)",
                  border:"1.5px solid #c7d2fe",
                  borderRadius:14,padding:"14px",marginBottom:12,
                  boxShadow:"0 2px 10px rgba(99,102,241,0.1)",
                }}>
                  <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
                    <div style={{
                      width:40,height:40,borderRadius:12,
                      background:"linear-gradient(135deg,#4f46e5,#7c3aed)",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                    }}>
                      <MdHomeWork size={20} color="#fff"/>
                    </div>
                    <div>
                      <div style={{ fontWeight:800,fontSize:15,color:"#1e1b4b" }}>
                        {(result as GPDetailResult).gp.name}
                      </div>
                      <div style={{ fontSize:12,color:"#6d28d9" }}>
                        {[(result as GPDetailResult).gp.hobli,(result as GPDetailResult).gp.taluk]
                          .filter(Boolean).join(" · ")}
                      </div>
                    </div>
                  </div>
                  <SectionHeader
                    icon={<MdContactPhone size={16}/>}
                    title="PDO / ಗ್ರಾ.ಪಂ ಸಂಪರ್ಕ"
                    count={(result as GPDetailResult).gp.pdo?.length||0}
                    open={openSections.pdo}
                    onToggle={()=>toggleSection("pdo")}
                    accent="#4f46e5"
                  />
                  {openSections.pdo && (
                    (result as GPDetailResult).gp.pdo?.length
                      ? (result as GPDetailResult).gp.pdo.map((p,i)=>(
                          <ContactCard key={i} name={p.name} phones={p.phones} subtitle="PDO"/>
                        ))
                      : <EmptyState message="PDO info ಇಲ್ಲ"/>
                  )}
                </div>
              )}

              {/* Villages */}
              <SectionCard
                icon={<FaMapMarkerAlt size={14}/>}
                title="ಗ್ರಾಮಗಳು"
                count={result.villages?.length||0}
                open={openSections.villages}
                onToggle={()=>toggleSection("villages")}
                accent="#10b981"
              >
                {result.villages?.map((v)=><VillageCard key={v._id} v={v}/>)}
              </SectionCard>

              {/* Wards */}
              <SectionCard
                icon={<FaMapMarkerAlt size={14}/>}
                title="ವಾರ್ಡ್‌ಗಳು"
                count={wards.length}
                open={openSections.wards}
                onToggle={()=>toggleSection("wards")}
                accent="#0ea5e9"
              >
                {wards.map((w)=>(
                  <div key={w._id} style={{
                    background:"#fff",border:"1.5px solid #bae6fd",
                    borderRadius:12,padding:"12px 14px",marginBottom:10,
                    boxShadow:"0 1px 4px rgba(14,165,233,0.08)",
                  }}>
                    <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:8 }}>
                      <span style={{
                        width:28,height:28,borderRadius:8,
                        background:"linear-gradient(135deg,#0ea5e9,#0284c7)",
                        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                      }}>
                        <FaMapMarkerAlt size={12} color="#fff"/>
                      </span>
                      <span style={{ fontWeight:700,fontSize:13,color:"#0c4a6e" }}>{w.name}</span>
                      {w.taluk && (
                        <span style={{
                          fontSize:11,background:"#e0f2fe",color:"#0369a1",
                          border:"1px solid #bae6fd",borderRadius:6,padding:"1px 8px",fontWeight:600,
                        }}>{w.taluk}</span>
                      )}
                    </div>
                    {w.contactPersons?.length
                      ? w.contactPersons.map((cp,i)=><ContactCard key={i} name={cp.name} phones={cp.phones}/>)
                      : <EmptyState message="Contact ಇಲ್ಲ"/>}
                  </div>
                ))}
              </SectionCard>

              {/* Manavis */}
              <SectionCard
                icon={<MdPeople size={16}/>}
                title="ಮನವಿಗಳು"
                count={allManavis.length}
                open={openSections.manavis}
                onToggle={()=>toggleSection("manavis")}
                accent="#f59e0b"
              >
                {allManavis.map((m)=>(
                  <ManaviRow key={m._id} m={m} locationLabel={m.village||m.ward||""}/>
                ))}
              </SectionCard>

              {/* Individual Works */}
              <SectionCard
                icon={<MdWork size={16}/>}
                title="ವೈಯಕ್ತಿಕ ಕೆಲಸಗಳು"
                count={allIndWorks.length}
                open={openSections.indWorks}
                onToggle={()=>toggleSection("indWorks")}
                accent="#3b82f6"
              >
                {allIndWorks.map((w)=><WorkRow key={w._id} w={w}/>)}
              </SectionCard>

              {/* Community Works */}
              <SectionCard
                icon={<MdWork size={16}/>}
                title="ಸಮುದಾಯ ಕೆಲಸಗಳು"
                count={allComWorks.length}
                open={openSections.comWorks}
                onToggle={()=>toggleSection("comWorks")}
                accent="#8b5cf6"
              >
                {allComWorks.map((w)=><WorkRow key={w._id} w={w}/>)}
              </SectionCard>

            </div>
          )}

          {/* EMPTY START STATE */}
          {!loading && !result && (
            <div style={{ marginTop: 6 }}>
              <div style={{
                textAlign:"center",padding:"36px 20px",
                background:"#fff",borderRadius:16,
                border:"1.5px dashed #c7d2fe",
              }}>
                <div style={{ fontSize:48,marginBottom:12 }}>🎤</div>
                <div style={{ fontWeight:800,fontSize:15,color:"#1e1b4b",marginBottom:6 }}>
                  ಹುಡುಕಾಟ ಪ್ರಾರಂಭಿಸಿ
                </div>
                <div style={{ color:"#6b7280",fontSize:12,lineHeight:1.7 }}>
                  MIC ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತಾಡಿ<br/>
                  ಅಥವಾ ಊರಿನ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ
                </div>
                <div style={{
                  display:"flex",justifyContent:"center",gap:8,marginTop:16,flexWrap:"wrap",
                }}>
                  {/* {["ಕೊಳ್ಳೇಗಾಲ","ತರೀಕೆರೆ","ಗ್ರಾಮ","ವಾರ್ಡ್"].map(hint=>(
                    <span
                      key={hint}
                      style={{
                        padding:"4px 12px",borderRadius:20,
                        background:"#eff6ff",color:"#4f46e5",
                        fontSize:12,fontWeight:600,
                        border:"1px solid #c7d2fe",cursor:"pointer",
                      }}
                      onClick={()=>{ setSearchText(hint); if(mode==="village") doVillageSearch(hint); }}
                    >{hint}</span>
                  ))} */}
                </div>
              </div>
            </div>
          )}

        </div>
        {/* ══ END SCROLL BODY ═════════════════════════════════════ */}

      </div>
    </>
  );
}