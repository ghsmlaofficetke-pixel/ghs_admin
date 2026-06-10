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

/* ─── helpers ────────────────────────────────────────────────── */

const STATUS_COLORS: Record<string, string> = {
  Pending:       "badge-warning",
  Approved:      "badge-success",
  Completed:     "badge-primary",
  "In Progress": "badge-info",
  Proposed:      "badge-secondary",
};

type QueryResult = (NameSearchResult & { gp?: undefined }) |
                   (GPDetailResult & { query?: undefined; wards?: undefined; wardManavis?: undefined; wardIndWorks?: undefined; wardComWorks?: undefined });

/* ─── sub-components ─────────────────────────────────────────── */

function SectionHeader({
  icon, title, count, open, onToggle,
}: {
  icon: React.ReactNode; title: string; count: number; open: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-100 d-flex align-items-center justify-content-between p-3 border-0 rounded-3 mb-2 text-start"
      style={{ background: "var(--ct-body-bg, #f5f5f5)", cursor: "pointer" }}
    >
      <span className="d-flex align-items-center gap-2 fw-semibold">
        {icon}
        {title}
        <span className="badge bg-primary rounded-pill">{count}</span>
      </span>
      {open ? <FaChevronUp /> : <FaChevronDown />}
    </button>
  );
}

function ContactCard({ name, phones, subtitle }: { name: string; phones: string[]; subtitle?: string }) {
  return (
    <div
      className="d-flex align-items-start gap-2 p-2 rounded-2 mb-2"
      style={{ background: "rgba(13,110,253,0.06)", border: "1px solid rgba(13,110,253,0.15)" }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
        style={{ width: 36, height: 36, background: "rgba(13,110,253,0.12)", fontSize: 14 }}
      >
        <FaUser style={{ color: "#0d6efd" }} />
      </div>
      <div className="flex-grow-1 min-w-0">
        <div className="fw-semibold text-truncate">{name}</div>
        {subtitle && <div className="text-muted small">{subtitle}</div>}
        {phones.map((ph, i) => (
          <a
            key={i} href={`tel:${ph}`}
            className="d-flex align-items-center gap-1 text-decoration-none small mt-1"
            style={{ color: "#0d6efd" }}
          >
            <FaPhone size={10} /> {ph}
          </a>
        ))}
      </div>
    </div>
  );
}

function ManaviRow({ m, locationLabel }: { m: ManaviItem; locationLabel: string }) {
  return (
    <div
      className="p-2 rounded-2 mb-2"
      style={{ background: "rgba(25,135,84,0.06)", border: "1px solid rgba(25,135,84,0.15)" }}
    >
      <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
        <div className="flex-grow-1">
          <div className="fw-semibold">{m.work}</div>
          <div className="small text-muted">
            {m.type}{m.caste ? ` · ${m.caste}` : ""}{locationLabel ? ` · ${locationLabel}` : ""}
          </div>
          {m.description && <div className="small text-muted mt-1">{m.description}</div>}
        </div>
        <span className={`badge ${STATUS_COLORS[m.status] || "badge-secondary"} flex-shrink-0`}>
          {m.status}
        </span>
      </div>
    </div>
  );
}

function WorkRow({ w }: { w: WorkItem }) {
  const isInd = w.type === "individual" || w.type === "ward_individual";
  const location = w.village || w.ward || "";
  return (
    <div
      className="p-2 rounded-2 mb-2"
      style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.3)" }}
    >
      <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap">
        <div className="flex-grow-1">
          {isInd ? (
            <>
              <div className="fw-semibold">{w.name || "—"}</div>
              <div className="small text-muted">
                {[w.scheme, w.orderNumber, w.address].filter(Boolean).join(" · ")}
              </div>
              {w.mobile && (
                <a href={`tel:${w.mobile}`} className="d-flex align-items-center gap-1 text-decoration-none small mt-1" style={{ color: "#0d6efd" }}>
                  <FaPhone size={10} /> {w.mobile}
                </a>
              )}
            </>
          ) : (
            <>
              <div className="fw-semibold">{w.workDetails || "—"}</div>
              <div className="small text-muted">
                {[w.scheme, w.department, w.letterNumber].filter(Boolean).join(" · ")}
                {w.estimatedAmount ? ` · ₹${w.estimatedAmount}L` : ""}
              </div>
              {w.remarks && <div className="small text-muted mt-1">{w.remarks}</div>}
            </>
          )}
          {location && (
            <div className="small text-muted mt-1">
              <FaMapMarkerAlt size={10} className="me-1" />{location}
            </div>
          )}
        </div>
        {w.status && (
          <span className={`badge ${STATUS_COLORS[w.status] || "badge-secondary"} flex-shrink-0`}>
            {w.status}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="text-center text-muted py-3 small">{message}</div>;
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
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) {
      toast.error("ನಿಮ್ಮ browser ಅಲ್ಲಿ Voice support ಇಲ್ಲ. Chrome use ಮಾಡಿ.");
      return;
    }
    const rec = new SR();
    rec.lang = "kn-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart  = () => setListening(true);
    rec.onend    = () => setListening(false);
    rec.onerror  = (e: any) => {
      setListening(false);
      if (e.error !== "no-speech") toast.error("Voice error: " + e.error);
    };
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setSearchText(t);
      if (mode === "village") doVillageSearch(t);
    };
    recognitionRef.current = rec;
    rec.start();
  }, [mode]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  /* ── village search ── */
  const doVillageSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await searchByName(q);
      setResult(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ── GP autocomplete ── */
  const handleGpInput = (val: string) => {
    setSearchText(val);
    setResult(null);
    if (gpSearchTimeout.current) clearTimeout(gpSearchTimeout.current);
    if (!val.trim()) { setGpSuggestions([]); return; }
    gpSearchTimeout.current = setTimeout(async () => {
      try {
        const data = await searchGPs(val);
        setGpSuggestions(data);
        setShowGpDropdown(true);
      } catch { /* silent */ }
    }, 300);
  };

  const selectGP = async (gp: GPSuggestion) => {
    setSearchText(gp.name);
    setShowGpDropdown(false);
    setLoading(true);
    setResult(null);
    try {
      const data = await getGPDetail(gp._id);
      setResult(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "GP data fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setSearchText("");
    setResult(null);
    setGpSuggestions([]);
    setShowGpDropdown(false);
    inputRef.current?.focus();
  };

  /* ── derived ── */
  const isGPResult = result && "gp" in result && result.gp;
  const allManavis  = [
    ...(result?.manavis  || []),
    ...((result as NameSearchResult)?.wardManavis  || []),
  ];
  const allIndWorks = [
    ...(result?.indWorks || []),
    ...((result as NameSearchResult)?.wardIndWorks || []),
  ];
  const allComWorks = [
    ...(result?.comWorks || []),
    ...((result as NameSearchResult)?.wardComWorks || []),
  ];
  const wards       = (result as NameSearchResult)?.wards || [];
  const totalCount  =
    (result?.villages?.length || 0) + wards.length +
    allManavis.length + allIndWorks.length + allComWorks.length +
    ((result as GPDetailResult)?.gp?.pdo?.length || 0);

  /* ── render ── */
  return (
    <div className="container-fluid px-3 py-3" style={{ maxWidth: 800 }}>

      {/* Header */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <MdContactPhone size={24} className="text-primary" />
        <div>
          <h5 className="mb-0 fw-bold">ಧ್ವನಿ ಹುಡುಕಾಟ</h5>
          <p className="text-muted small mb-0">
            MIC ಒತ್ತಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ — ಊರು, GP, contacts, manavi, work ಕಾಣಿ
          </p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="d-flex gap-2 mb-3">
        {(["village", "gp"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); clearAll(); }}
            className={`btn btn-sm px-3 rounded-pill ${mode === m ? "btn-primary" : "btn-outline-secondary"}`}
          >
            {m === "village" ? "ಊರು / ವಾರ್ಡ್ ಹುಡುಕಿ" : "ಗ್ರಾ.ಪಂ ಹುಡುಕಿ"}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (mode === "village") doVillageSearch(searchText); }}
        className="position-relative mb-3"
      >
        <div className="input-group input-group-lg shadow-sm">
          <span className="input-group-text bg-white border-end-0">
            <FaSearch className="text-muted" />
          </span>

          <input
            ref={inputRef}
            type="text"
            className="form-control border-start-0 border-end-0 ps-0"
            placeholder={
              mode === "village"
                ? "ಊರಿನ ಹೆಸರು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ MIC ಒತ್ತಿ…"
                : "GP ಹೆಸರು ಟೈಪ್ ಮಾಡಿ…"
            }
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (mode === "gp") handleGpInput(e.target.value);
            }}
            autoComplete="off"
          />

          {searchText && (
            <button type="button" className="btn btn-outline-secondary border-start-0 border-end-0" onClick={clearAll}>
              <FaTimes />
            </button>
          )}

          {/* Mic */}
          <button
            type="button"
            className={`btn ${listening ? "btn-danger" : "btn-outline-primary"} border-start-0`}
            onClick={listening ? stopListening : startListening}
          >
            <span className="d-flex align-items-center gap-1">
              {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              <span className="d-none d-sm-inline small">
                {listening ? "ನಿಲ್ಲಿಸಿ" : "ಮಾತಾಡಿ"}
              </span>
            </span>
          </button>

          {mode === "village" && (
            <button type="submit" className="btn btn-primary">ಹುಡುಕಿ</button>
          )}
        </div>

        {/* GP dropdown */}
        {mode === "gp" && showGpDropdown && gpSuggestions.length > 0 && (
          <div
            className="position-absolute w-100 bg-white border rounded-3 shadow"
            style={{ top: "100%", zIndex: 1000, maxHeight: 240, overflowY: "auto" }}
          >
            {gpSuggestions.map((gp) => (
              <button
                key={gp._id}
                type="button"
                className="w-100 text-start px-3 py-2 border-0 bg-transparent"
                style={{ borderBottom: "1px solid #eee" }}
                onMouseDown={() => selectGP(gp)}
              >
                <div className="fw-semibold">{gp.name}</div>
                {gp.hobli && <div className="small text-muted">{gp.hobli.name}</div>}
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Listening indicator */}
      {listening && (
        <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3">
          <span className="spinner-grow spinner-grow-sm" />
          ಕೇಳ್ತಿದ್ದೇನೆ… ಮಾತಾಡಿ
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-5">
          <FaSpinner className="fa-spin text-primary" size={28} />
          <div className="mt-2 text-muted">Data ತರ್ತಿದ್ದೇನೆ…</div>
        </div>
      )}

      {/* Results */}
      {!loading && result && (
        <>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-muted small">
              {(result as NameSearchResult).query
                ? `"${(result as NameSearchResult).query}" ಗಾಗಿ ಫಲಿತಾಂಶ`
                : isGPResult
                ? `${(result as GPDetailResult).gp.name} — ಗ್ರಾ.ಪಂ`
                : "ಫಲಿತಾಂಶ"}
            </span>
            <span className="badge bg-primary rounded-pill">{totalCount} ಒಟ್ಟು</span>
          </div>

          {totalCount === 0 && (
            <div className="text-center py-5 text-muted">
              <FaSearch size={36} className="mb-3 opacity-25" />
              <div>ಯಾವ data ಸಿಗಲಿಲ್ಲ</div>
            </div>
          )}

          {/* GP PDO */}
          {isGPResult && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <MdHomeWork className="text-primary" size={20} />
                  <div>
                    <div className="fw-bold">{(result as GPDetailResult).gp.name}</div>
                    <div className="small text-muted">
                      {[(result as GPDetailResult).gp.hobli, (result as GPDetailResult).gp.taluk]
                        .filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </div>
                <SectionHeader
                  icon={<MdContactPhone />}
                  title="PDO / ಗ್ರಾ.ಪಂ ಸಂಪರ್ಕ"
                  count={(result as GPDetailResult).gp.pdo?.length || 0}
                  open={openSections.pdo}
                  onToggle={() => toggleSection("pdo")}
                />
                {openSections.pdo && (
                  (result as GPDetailResult).gp.pdo?.length
                    ? (result as GPDetailResult).gp.pdo.map((p, i) => (
                        <ContactCard key={i} name={p.name} phones={p.phones} subtitle="PDO" />
                      ))
                    : <EmptyState message="PDO info ಇಲ್ಲ" />
                )}
              </div>
            </div>
          )}

          {/* Villages */}
          {(result.villages?.length || 0) > 0 && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <SectionHeader
                  icon={<FaMapMarkerAlt />}
                  title="ಗ್ರಾಮಗಳು"
                  count={result.villages.length}
                  open={openSections.villages}
                  onToggle={() => toggleSection("villages")}
                />
                {openSections.villages && result.villages.map((v) => (
                  <div key={v._id} className="mb-3">
                    <div className="fw-semibold d-flex align-items-center gap-1 mb-1">
                      <FaMapMarkerAlt size={12} />
                      {v.name}
                      {v.gp && (
                        <span className="badge bg-light text-dark small fw-normal ms-1">{v.gp}</span>
                      )}
                    </div>
                    {v.contactPersons?.length
                      ? v.contactPersons.map((cp, i) => (
                          <ContactCard key={i} name={cp.name} phones={cp.phones} />
                        ))
                      : <EmptyState message="Contact ಇಲ್ಲ" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wards */}
          {wards.length > 0 && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <SectionHeader
                  icon={<FaMapMarkerAlt />}
                  title="ವಾರ್ಡ್‌ಗಳು"
                  count={wards.length}
                  open={openSections.wards}
                  onToggle={() => toggleSection("wards")}
                />
                {openSections.wards && wards.map((w) => (
                  <div key={w._id} className="mb-3">
                    <div className="fw-semibold d-flex align-items-center gap-1 mb-1">
                      <FaMapMarkerAlt size={12} />
                      {w.name}
                      {w.taluk && (
                        <span className="badge bg-light text-dark small fw-normal ms-1">{w.taluk}</span>
                      )}
                    </div>
                    {w.contactPersons?.length
                      ? w.contactPersons.map((cp, i) => (
                          <ContactCard key={i} name={cp.name} phones={cp.phones} />
                        ))
                      : <EmptyState message="Contact ಇಲ್ಲ" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manavi */}
          {allManavis.length > 0 && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <SectionHeader
                  icon={<MdPeople />}
                  title="ಮನವಿಗಳು"
                  count={allManavis.length}
                  open={openSections.manavis}
                  onToggle={() => toggleSection("manavis")}
                />
                {openSections.manavis && allManavis.map((m) => (
                  <ManaviRow key={m._id} m={m} locationLabel={m.village || m.ward || ""} />
                ))}
              </div>
            </div>
          )}

          {/* Individual works */}
          {allIndWorks.length > 0 && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <SectionHeader
                  icon={<MdWork />}
                  title="ವೈಯಕ್ತಿಕ ಕೆಲಸಗಳು"
                  count={allIndWorks.length}
                  open={openSections.indWorks}
                  onToggle={() => toggleSection("indWorks")}
                />
                {openSections.indWorks && allIndWorks.map((w) => <WorkRow key={w._id} w={w} />)}
              </div>
            </div>
          )}

          {/* Community works */}
          {allComWorks.length > 0 && (
            <div className="card border-0 shadow-sm mb-3 rounded-3">
              <div className="card-body p-3">
                <SectionHeader
                  icon={<MdWork />}
                  title="ಸಮುದಾಯ ಕೆಲಸಗಳು"
                  count={allComWorks.length}
                  open={openSections.comWorks}
                  onToggle={() => toggleSection("comWorks")}
                />
                {openSections.comWorks && allComWorks.map((w) => <WorkRow key={w._id} w={w} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}