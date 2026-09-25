import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { toast } from "react-toastify";
import {
  fetchElectionSummary,
  saveElectionSummary,
  electionSelector,
  BoothWiseVote,
  CasteWiseVote,
  ElectionType,
  EMPTY_PARTY_VOTES,
  PartyVotes,
} from "../../../api/election";
import { fetchBooths, boothSelector } from "../../../api/booth";
import { FaTrophy, FaPlus, FaSave, FaSearch, FaEdit } from "react-icons/fa";
import { FiTrash2, FiX, FiChevronLeft } from "react-icons/fi";

const PARTY_COLUMNS: { key: keyof PartyVotes; label: string; color: string }[] = [
  { key: "congress", label: "ಕಾಂಗ್ರೆಸ್", color: "#1a56db" },
  { key: "bjp", label: "ಬಿಜೆಪಿ", color: "#e05c00" },
  { key: "jds", label: "ಜೆಡಿಎಸ್", color: "#16a34a" },
  { key: "independent", label: "ಪಕ್ಷೇತರ", color: "#7c3aed" },
  { key: "others", label: "ಇತರೆ", color: "#64748b" },
];

const emptyBoothRow = (): BoothWiseVote => ({
  partNo: "", boothName: "", boothArea: "",
  totalVoters: 0, takenVotes: { ...EMPTY_PARTY_VOTES }, description: "",
});

/* ── VIEW MODE: Summary display ── */
function SummaryView({
  summary, year, onEdit,
}: {
  summary: any; year: string; onEdit: () => void;
}) {
  const booths: BoothWiseVote[] = summary?.boothWiseVotes || [];
  const castes: CasteWiseVote[] = summary?.casteWiseVotes || [];
  const [boothSearch, setBoothSearch] = useState("");
  const [casteSearch, setCasteSearch] = useState("");

  const filteredBooths = useMemo(() => {
    const q = boothSearch.trim().toLowerCase();
    return !q ? booths : booths.filter(r =>
      r.partNo?.toLowerCase().includes(q) ||
      r.boothName?.toLowerCase().includes(q) ||
      r.boothArea?.toLowerCase().includes(q)
    );
  }, [booths, boothSearch]);

  const filteredCastes = useMemo(() => {
    const q = casteSearch.trim().toLowerCase();
    return !q ? castes : castes.filter(r => r.caste?.toLowerCase().includes(q));
  }, [castes, casteSearch]);

  const partyTotals = useMemo(() => {
    const t = { ...EMPTY_PARTY_VOTES };
    booths.forEach(r => {
      const tv = r.takenVotes || EMPTY_PARTY_VOTES;
      (Object.keys(t) as (keyof PartyVotes)[]).forEach(k => { t[k] += Number(tv[k]) || 0; });
    });
    return t;
  }, [booths]);

  const totalPolled = useMemo(() =>
    Object.values(partyTotals).reduce((s, v) => s + v, 0), [partyTotals]);
  const totalVoters = useMemo(() =>
    booths.reduce((s, r) => s + (Number(r.totalVoters) || 0), 0), [booths]);
  const casteTotal = useMemo(() =>
    castes.reduce((s, r) => s + (Number(r.votes) || 0), 0), [castes]);

  const hasData = summary?.winnerName || summary?.totalVotes || booths.length > 0;

  return (
    <div className="sv-root">
      <style>{`
        .sv-root { padding: 12px; overflow-y: auto; height: 100%; font-family: 'Segoe UI','Noto Sans Kannada',sans-serif; background: #f0f4f8; }
        .sv-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
        .sv-title { font-size:15px; font-weight:700; color:#1a3d7c; }
        .sv-title span { color:#2466d1; }
        .sv-edit-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; background:linear-gradient(135deg,#2466d1,#06b6d4); color:#fff; border:none; cursor:pointer; font-size:13px; font-weight:600; box-shadow:0 2px 8px rgba(36,102,209,0.28); }
        .sv-edit-btn:hover { opacity:0.9; }
        .sv-empty { text-align:center; padding:48px 0; color:#94a3b8; font-size:14px; }
        .sv-winner { background:linear-gradient(135deg,#fef9e7,#fdf1c7); border:1px solid #f2d675; border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:16px; margin-bottom:14px; box-shadow:0 2px 12px rgba(245,179,0,0.15); }
        .sv-winner-icon { color:#b45309; flex-shrink:0; }
        .sv-winner-name { font-size:18px; font-weight:800; color:#92400e; }
        .sv-winner-sub { font-size:12px; color:#a16207; margin-top:2px; }
        .sv-card { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .sv-card-title { font-size:13px; font-weight:700; color:#2466d1; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
        .sv-stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
        .sv-stat-box { background:#f8faff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; text-align:center; }
        .sv-stat-box .lbl { font-size:11px; color:#64748b; font-weight:600; }
        .sv-stat-box .val { font-size:18px; font-weight:800; color:#1a3d7c; margin-top:2px; }
        .sv-party-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin-top:8px; }
        .sv-party-box { border-radius:10px; padding:10px 8px; text-align:center; border:1px solid #e2e8f0; }
        .sv-party-box .plbl { font-size:11px; font-weight:700; margin-bottom:4px; }
        .sv-party-box .pval { font-size:16px; font-weight:800; color:#1a3d7c; }
        .sv-search-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; flex-wrap:wrap; }
        .sv-search { display:flex; align-items:center; gap:6px; border:1.5px solid #e2e8f0; border-radius:8px; padding:6px 10px; background:#f8fafc; flex:1; min-width:160px; max-width:320px; }
        .sv-search input { border:none; outline:none; background:transparent; font-size:13px; flex:1; font-family:inherit; color:#1e293b; }
        .sv-count { font-size:11px; color:#64748b; }
        .sv-table-scroll { overflow:auto; -webkit-overflow-scrolling:touch; max-height:420px; border:1px solid #e2e8f0; border-radius:8px; }
        .sv-booth-table { width:100%; min-width:900px; border-collapse:collapse; font-size:12.5px; }
        .sv-booth-table th { background:linear-gradient(180deg,#06b6d4,#2466d1); color:#fff; padding:8px 10px; text-align:left; border:1px solid rgba(255,255,255,0.2); white-space:nowrap; position:sticky; top:0; z-index:5; }
        .sv-booth-table td { border:1px solid #e2e8f0; padding:7px 10px; color:#1e293b; }
        .sv-booth-table tr:nth-child(even) td { background:#f8faff; }
        .sv-booth-table tr:hover td { background:#ddeeff; }
        .sv-booth-table .td-num { font-weight:700; color:#1a3d7c; text-align:center; }
        .sv-booth-table .td-total { font-weight:700; color:#1a3d7c; text-align:center; }
        .sv-caste-table { width:100%; border-collapse:collapse; font-size:13px; }
        .sv-caste-table th { background:linear-gradient(180deg,#06b6d4,#2466d1); color:#fff; padding:8px 10px; text-align:left; border:1px solid rgba(255,255,255,0.2); }
        .sv-caste-table td { border:1px solid #e2e8f0; padding:7px 10px; color:#1e293b; }
        .sv-caste-table tr:nth-child(even) td { background:#f8faff; }
        .sv-caste-table tr:hover td { background:#ddeeff; }
        .sv-caste-table .td-num { font-weight:700; color:#1a3d7c; text-align:center; }
        .sv-remark { background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; font-size:13px; color:#334155; line-height:1.6; white-space:pre-wrap; }
        @media(max-width:600px){
          .sv-stat-grid{grid-template-columns:1fr 1fr;}
          .sv-party-grid{grid-template-columns:repeat(3,1fr);}
        }
      `}</style>

      <div className="sv-topbar">
        <div className="sv-title"><span>{year}</span> ಚುನಾವಣಾ ಸಾರಾಂಶ</div>
        <button className="sv-edit-btn" onClick={onEdit}><FaEdit size={12} /> ಸಂಪಾದಿಸಿ</button>
      </div>

      {!hasData ? (
        <div className="sv-empty">
          <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
          <div>{year} ಚುನಾವಣಾ ಸಾರಾಂಶ ಇನ್ನೂ ನಮೂದಿಸಿಲ್ಲ</div>
          <div style={{ fontSize: 12, marginTop: 6, color: "#b0bec5" }}>ಸಂಪಾದಿಸಿ ಬಟನ್ ಒತ್ತಿ ಮಾಹಿತಿ ಸೇರಿಸಿ</div>
        </div>
      ) : (
        <>
          {/* Winner Banner */}
          {summary?.winnerName && (
            <div className="sv-winner">
              <FaTrophy size={28} className="sv-winner-icon" />
              <div>
                <div className="sv-winner-name">🏆 {summary.winnerName}</div>
                <div className="sv-winner-sub">
                  {summary.winnerParty}
                  {summary.leadVotes ? ` • ಗೆಲುವಿನ ಅಂತರ: ${Number(summary.leadVotes).toLocaleString("en-IN")} ಮತಗಳು` : ""}
                </div>
              </div>
            </div>
          )}

          {/* Vote Stats */}
          <div className="sv-card">
            <div className="sv-card-title">📊 ಮತಗಳ ಸಾರಾಂಶ</div>
            <div className="sv-stat-grid">
              <div className="sv-stat-box">
                <div className="lbl">ತರೀಕೆರೆ ತಾಲ್ಲೂಕು</div>
                <div className="val">{(Number(summary?.tarikereVotes) || 0).toLocaleString("en-IN")}</div>
              </div>
              <div className="sv-stat-box">
                <div className="lbl">ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು</div>
                <div className="val">{(Number(summary?.ajjampuraVotes) || 0).toLocaleString("en-IN")}</div>
              </div>
              <div className="sv-stat-box">
                <div className="lbl">ಒಟ್ಟು ಮತಗಳು</div>
                <div className="val">{(Number(summary?.totalVotes) || 0).toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          {/* Booth Stats */}
          {booths.length > 0 && (
            <div className="sv-card">
              <div className="sv-card-title">🗳️ ಮತಗಟ್ಟೆವಾರು ಸಾರಾಂಶ ({booths.length} ಮತಗಟ್ಟೆಗಳು)</div>
              <div className="sv-stat-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                <div className="sv-stat-box">
                  <div className="lbl">ಒಟ್ಟು ಮತದಾರರು</div>
                  <div className="val">{totalVoters.toLocaleString("en-IN")}</div>
                </div>
                <div className="sv-stat-box">
                  <div className="lbl">ಪಡೆದ ಮತಗಳು</div>
                  <div className="val">{totalPolled.toLocaleString("en-IN")}</div>
                </div>
                <div className="sv-stat-box">
                  <div className="lbl">ಮತದಾನ %</div>
                  <div className="val">{totalVoters > 0 ? ((totalPolled / totalVoters) * 100).toFixed(1) : "0"}%</div>
                </div>
              </div>
              <div className="sv-party-grid">
                {PARTY_COLUMNS.map(p => (
                  <div className="sv-party-box" key={p.key} style={{ background: p.color + "12", borderColor: p.color + "40" }}>
                    <div className="plbl" style={{ color: p.color }}>{p.label}</div>
                    <div className="pval">{partyTotals[p.key].toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>

              {/* Booth Table */}
              <div className="sv-search-row" style={{ marginTop: 12 }}>
                <div className="sv-search">
                  <FaSearch size={11} color="#94a3b8" />
                  <input placeholder="Part No / Booth ಹೆಸರು ಹುಡುಕಿ..." value={boothSearch} onChange={e => setBoothSearch(e.target.value)} />
                  {boothSearch && <FiX size={13} style={{ cursor: "pointer", color: "#94a3b8" }} onClick={() => setBoothSearch("")} />}
                </div>
                {boothSearch && <span className="sv-count">{filteredBooths.length}/{booths.length}</span>}
              </div>
              <div className="sv-table-scroll">
                <table className="sv-booth-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>ಕ್ರ.ಸಂ</th>
                      <th style={{ width: 50 }}>ಭಾಗ ಸಂ.</th>
                      <th>ಮತಗಟ್ಟೆ ಹೆಸರು</th>
                      <th>ಪ್ರದೇಶ</th>
                      <th style={{ width: 70 }}>ಮತದಾರರು</th>
                      {PARTY_COLUMNS.map(p => <th key={p.key} style={{ width: 65 }}>{p.label}</th>)}
                      <th style={{ width: 75 }}>ಒಟ್ಟು ಮತ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooths.length === 0 ? (
                      <tr><td colSpan={10} style={{ textAlign: "center", padding: 16, color: "#94a3b8" }}>ಫಲಿತಾಂಶ ಸಿಗಲಿಲ್ಲ</td></tr>
                    ) : filteredBooths.map((row, i) => {
                      const tv = row.takenVotes || EMPTY_PARTY_VOTES;
                      const rowTotal = Object.values(tv).reduce((s, v) => s + (Number(v) || 0), 0);
                      return (
                        <tr key={i}>
                          <td className="td-num">{i + 1}</td>
                          <td className="td-num">{row.partNo}</td>
                          <td>{row.boothName}</td>
                          <td>{row.boothArea}</td>
                          <td className="td-num">{(Number(row.totalVoters) || 0).toLocaleString("en-IN")}</td>
                          {PARTY_COLUMNS.map(p => (
                            <td key={p.key} className="td-num" style={{ color: p.color }}>
                              {(Number(tv[p.key]) || 0).toLocaleString("en-IN")}
                            </td>
                          ))}
                          <td className="td-total">{rowTotal.toLocaleString("en-IN")}</td>
                        </tr>
                      );
                    })}
                    {/* Totals row */}
                    {filteredBooths.length > 0 && (
                      <tr style={{ background: "#eff6ff", fontWeight: 700 }}>
                        <td colSpan={4} style={{ textAlign: "right", padding: "8px 10px", color: "#1a3d7c", fontSize: 12 }}>ಒಟ್ಟು →</td>
                        <td className="td-num">{filteredBooths.reduce((s, r) => s + (Number(r.totalVoters) || 0), 0).toLocaleString("en-IN")}</td>
                        {PARTY_COLUMNS.map(p => (
                          <td key={p.key} className="td-num" style={{ color: p.color }}>
                            {filteredBooths.reduce((s, r) => s + (Number((r.takenVotes || EMPTY_PARTY_VOTES)[p.key]) || 0), 0).toLocaleString("en-IN")}
                          </td>
                        ))}
                        <td className="td-total">
                          {filteredBooths.reduce((s, r) => {
                            const tv = r.takenVotes || EMPTY_PARTY_VOTES;
                            return s + Object.values(tv).reduce((a, v) => a + (Number(v) || 0), 0);
                          }, 0).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Caste Table */}
          {castes.length > 0 && (
            <div className="sv-card">
              <div className="sv-card-title">🏷️ ಜಾತಿವಾರು ಮತಗಳು</div>
              <div className="sv-search-row">
                <div className="sv-search">
                  <FaSearch size={11} color="#94a3b8" />
                  <input placeholder="ಜಾತಿ ಹುಡುಕಿ..." value={casteSearch} onChange={e => setCasteSearch(e.target.value)} />
                  {casteSearch && <FiX size={13} style={{ cursor: "pointer", color: "#94a3b8" }} onClick={() => setCasteSearch("")} />}
                </div>
                {casteSearch && <span className="sv-count">{filteredCastes.length}/{castes.length}</span>}
              </div>
              <table className="sv-caste-table">
                <thead>
                  <tr>
                    <th style={{ width: 48 }}>ಕ್ರ.ಸಂ</th>
                    <th>ಜಾತಿ</th>
                    <th style={{ width: 120 }}>ಮತಗಳು</th>
                    <th style={{ width: 80 }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCastes.map((row, i) => (
                    <tr key={i}>
                      <td className="td-num">{i + 1}</td>
                      <td>{row.caste}</td>
                      <td className="td-num">{(Number(row.votes) || 0).toLocaleString("en-IN")}</td>
                      <td className="td-num" style={{ color: "#64748b" }}>
                        {casteTotal > 0 ? ((Number(row.votes) / casteTotal) * 100).toFixed(1) : "0"}%
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: "#eff6ff", fontWeight: 700 }}>
                    <td colSpan={2} style={{ textAlign: "right", padding: "8px 10px", color: "#1a3d7c", fontSize: 12 }}>ಒಟ್ಟು →</td>
                    <td className="td-num">{casteTotal.toLocaleString("en-IN")}</td>
                    <td className="td-num">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Remark */}
          {summary?.remark && (
            <div className="sv-card">
              <div className="sv-card-title">📝 ಟಿಪ್ಪಣಿ</div>
              <div className="sv-remark">{summary.remark}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── EDIT MODE: Summary form ── */
function SummaryEdit({
  electionType, year, onSaved,
}: {
  electionType: ElectionType; year: string; onSaved: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, loading } = useSelector(electionSelector);
  const { booths } = useSelector(boothSelector);

  const [form, setForm] = useState({
    winnerName: "", winnerParty: "", leadVotes: "",
    tarikereVotes: "", ajjampuraVotes: "", totalVotes: "", remark: "",
  });
  const [boothRows, setBoothRows] = useState<BoothWiseVote[]>([emptyBoothRow()]);
  const [casteRows, setCasteRows] = useState<CasteWiseVote[]>([{ caste: "", votes: 0 }]);

  useEffect(() => {
    dispatch(fetchBooths());
  }, []);

  useEffect(() => {
    if (summary) {
      setForm({
        winnerName: summary.winnerName || "",
        winnerParty: summary.winnerParty || "",
        leadVotes: summary.leadVotes?.toString() || "",
        tarikereVotes: summary.tarikereVotes?.toString() || "",
        ajjampuraVotes: summary.ajjampuraVotes?.toString() || "",
        totalVotes: summary.totalVotes?.toString() || "",
        remark: summary.remark || "",
      });
      setBoothRows(summary.boothWiseVotes?.length ? summary.boothWiseVotes : [emptyBoothRow()]);
      setCasteRows(summary.casteWiseVotes?.length ? summary.casteWiseVotes : [{ caste: "", votes: 0 }]);
    }
  }, [summary]);

  const handleSave = async () => {
    try {
      await dispatch(saveElectionSummary(electionType, year, {
        winnerName: form.winnerName,
        winnerParty: form.winnerParty,
        leadVotes: Number(form.leadVotes) || 0,
        tarikereVotes: Number(form.tarikereVotes) || 0,
        ajjampuraVotes: Number(form.ajjampuraVotes) || 0,
        totalVotes: Number(form.totalVotes) || 0,
        remark: form.remark,
        boothWiseVotes: boothRows,
        casteWiseVotes: casteRows,
      }));
      toast.success("ಸಾರಾಂಶ ಉಳಿಸಲಾಗಿದೆ");
      onSaved();
    } catch {
      toast.error("ಉಳಿಸಲು ವಿಫಲವಾಗಿದೆ");
    }
  };

  const updateBoothRow = (i: number, field: keyof BoothWiseVote, val: any) =>
    setBoothRows(rows => rows.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const updateBoothVote = (i: number, key: keyof PartyVotes, val: string) =>
    setBoothRows(rows => rows.map((r, idx) =>
      idx === i ? { ...r, takenVotes: { ...(r.takenVotes || EMPTY_PARTY_VOTES), [key]: Number(val) || 0 } } : r
    ));

  return (
    <div style={{ padding: 12, overflowY: "auto", height: "100%", fontFamily: "'Segoe UI','Noto Sans Kannada',sans-serif", background: "#f0f4f8" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3d7c" }}><span style={{ color: "#2466d1" }}>{year}</span> ಸಾರಾಂಶ ಸಂಪಾದನೆ</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onSaved} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#1a3d7c", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <FiChevronLeft size={14} /> ಹಿಂದೆ
          </button>
          <button onClick={handleSave} disabled={loading} style={{ padding: "7px 14px", borderRadius: 8, background: "linear-gradient(135deg,#2466d1,#06b6d4)", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <FaSave size={12} /> ಉಳಿಸಿ
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#2466d1", marginBottom: 10 }}>🏆 ಗೆಲುವಿನ ಮಾಹಿತಿ</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {([
            ["winnerName", "ಗೆದ್ದ ಅಭ್ಯರ್ಥಿ"],
            ["winnerParty", "ಪಕ್ಷ"],
            ["leadVotes", "ಗೆಲುವಿನ ಅಂತರ"],
            ["tarikereVotes", "ತರೀಕೆರೆ ಮತಗಳು"],
            ["ajjampuraVotes", "ಅಜ್ಜಂಪುರ ಮತಗಳು"],
            ["totalVotes", "ಒಟ್ಟು ಮತಗಳು"],
          ] as [string, string][]).map(([key, label]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{label}</div>
              <input
                value={(form as any)[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>ಟಿಪ್ಪಣಿ</div>
          <textarea
            value={form.remark}
            onChange={e => setForm(f => ({ ...f, remark: e.target.value }))}
            rows={3}
            style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Booth Rows */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2466d1" }}>🗳️ ಮತಗಟ್ಟೆವಾರು ಮತಗಳು</div>
          <button onClick={() => setBoothRows(r => [...r, emptyBoothRow()])} style={{ padding: "5px 10px", borderRadius: 7, background: "#eff6ff", border: "1px solid #bfdbfe", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4, color: "#2466d1" }}>
            <FaPlus size={10} /> ಸೇರಿಸಿ
          </button>
        </div>
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: 420, border: "1px solid #e2e8f0", borderRadius: 8, WebkitOverflowScrolling: "touch" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "linear-gradient(180deg,#06b6d4,#2466d1)", position: "sticky", top: 0, zIndex: 5 }}>
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)", width: 40 }}>ಕ್ರ.ಸಂ</th>
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)", width: 60 }}>ಭಾಗ ಸಂ.</th>
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)" }}>ಮತಗಟ್ಟೆ ಹೆಸರು</th>
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)" }}>ಪ್ರದೇಶ</th>
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)", width: 80 }}>ಮತದಾರರು</th>
                {PARTY_COLUMNS.map(p => <th key={p.key} style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)", width: 70 }}>{p.label}</th>)}
                <th style={{ color: "#fff", padding: "7px 8px", border: "1px solid rgba(255,255,255,0.2)", width: 40 }}>ಅಳಿಸಿ</th>
              </tr>
            </thead>
            <tbody>
              {boothRows.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
                    <input value={row.partNo} onChange={e => updateBoothRow(i, "partNo", e.target.value)} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 6px", fontSize: 12, outline: "none" }} />
                  </td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
                    <input value={row.boothName} onChange={e => updateBoothRow(i, "boothName", e.target.value)} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 6px", fontSize: 12, outline: "none" }} />
                  </td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
                    <input value={row.boothArea} onChange={e => updateBoothRow(i, "boothArea", e.target.value)} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 6px", fontSize: 12, outline: "none" }} />
                  </td>
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
                    <input type="number" value={row.totalVoters} onChange={e => updateBoothRow(i, "totalVoters", Number(e.target.value))} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 6px", fontSize: 12, outline: "none" }} />
                  </td>
                  {PARTY_COLUMNS.map(p => (
                    <td key={p.key} style={{ border: "1px solid #e2e8f0", padding: "4px 6px" }}>
                      <input type="number" value={(row.takenVotes || EMPTY_PARTY_VOTES)[p.key]} onChange={e => updateBoothVote(i, p.key, e.target.value)} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 6px", fontSize: 12, outline: "none" }} />
                    </td>
                  ))}
                  <td style={{ border: "1px solid #e2e8f0", padding: "4px 6px", textAlign: "center" }}>
                    <button onClick={() => setBoothRows(r => r.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Caste Rows */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2466d1" }}>🏷️ ಜಾತಿವಾರು ಮತಗಳು</div>
          <button onClick={() => setCasteRows(r => [...r, { caste: "", votes: 0 }])} style={{ padding: "5px 10px", borderRadius: 7, background: "#eff6ff", border: "1px solid #bfdbfe", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4, color: "#2466d1" }}>
            <FaPlus size={10} /> ಸೇರಿಸಿ
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "linear-gradient(180deg,#06b6d4,#2466d1)" }}>
              <th style={{ color: "#fff", padding: "7px 10px", border: "1px solid rgba(255,255,255,0.2)", width: 48 }}>ಕ್ರ.ಸಂ</th>
              <th style={{ color: "#fff", padding: "7px 10px", border: "1px solid rgba(255,255,255,0.2)" }}>ಜಾತಿ</th>
              <th style={{ color: "#fff", padding: "7px 10px", border: "1px solid rgba(255,255,255,0.2)", width: 140 }}>ಮತಗಳು</th>
              <th style={{ color: "#fff", padding: "7px 10px", border: "1px solid rgba(255,255,255,0.2)", width: 48 }}>ಅಳಿಸಿ</th>
            </tr>
          </thead>
          <tbody>
            {casteRows.map((row, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #e2e8f0", padding: "5px 8px", textAlign: "center", color: "#64748b" }}>{i + 1}</td>
                <td style={{ border: "1px solid #e2e8f0", padding: "5px 8px" }}>
                  <input value={row.caste} onChange={e => setCasteRows(r => r.map((x, idx) => idx === i ? { ...x, caste: e.target.value } : x))} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 8px", fontSize: 13, outline: "none" }} />
                </td>
                <td style={{ border: "1px solid #e2e8f0", padding: "5px 8px" }}>
                  <input type="number" value={row.votes} onChange={e => setCasteRows(r => r.map((x, idx) => idx === i ? { ...x, votes: Number(e.target.value) } : x))} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 5, padding: "4px 8px", fontSize: 13, outline: "none" }} />
                </td>
                <td style={{ border: "1px solid #e2e8f0", padding: "5px 8px", textAlign: "center" }}>
                  <button onClick={() => setCasteRows(r => r.filter((_, idx) => idx !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}>
                    <FiTrash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── MAIN EXPORT ── */
export default function SummaryTab({
  electionType, year,
}: {
  electionType: ElectionType; year: string;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { summary } = useSelector(electionSelector);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchElectionSummary(electionType, year));
  }, [electionType, year]);

  if (editMode) {
    return (
      <SummaryEdit
        electionType={electionType}
        year={year}
        onSaved={() => {
          dispatch(fetchElectionSummary(electionType, year));
          setEditMode(false);
        }}
      />
    );
  }

  return (
    <SummaryView
      summary={summary}
      year={year}
      onEdit={() => setEditMode(true)}
    />
  );
}
