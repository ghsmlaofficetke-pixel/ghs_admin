// src/pages/apps/Contacts/VillageContacts.tsx
// ✅ Group Call + Group Broadcast removed (individual only)
// ✅ GP → Village empty bug fixed (proper data handling + loading guard)
// ✅ Back button: GP view re-fetches properly, village → gp keeps state
// ✅ Voice search: transcript triggers search correctly (no 2-char gap issue)
// ✅ Search debounce fires on voice result via useEffect on `search`
// ✅ Responsive, user-friendly, Kannada UI

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  fetchGPContactSummary,
  fetchGPContacts,
  fetchVillageContacts,
  searchContacts,
  clearContacts,
  GPSummary,
  ContactPerson,
  GPContacts,
} from "../../../api/contacts";
import { fetchAllGramaPanchayaths } from "../../../api/gramapanchayath";
import { fetchAllHoblis } from "../../../api/hobli";
import {
  FaMicrophone, FaMicrophoneSlash,
  FaWhatsapp, FaPhone,
  FaFileExcel, FaArrowLeft,
  FaSearch, FaTimes, FaSms,
  FaChevronDown, FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

/* ─────────────────────────────── TYPES */
type GPVillage = GPContacts["villages"][number];

/* ─────────────────────────────── EXCEL */
interface XlsRow {
  slNo: number;
  hobli: string;
  gpName: string;
  villageName: string;
  contactName: string;
  phone1: string;
  phone2: string;
}

const generateExcel = (rows: XlsRow[], filename: string, title: string) => {
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
  const aoa: any[][] = [
    [`ಗ್ರಾಮ ಪಂಚಾಯತ್ ಸಂಪರ್ಕ ಪಟ್ಟಿ`, "", "", "", "", "", ""],
    [title, "", "", "", "", "", ""],
    [`ದಿನಾಂಕ: ${date}`, "", "", `ಒಟ್ಟು ದಾಖಲೆ: ${rows.length}`, "", "", ""],
    ["", "", "", "", "", "", ""],
    ["ಕ್ರ.ಸಂ", "ಹೋಬಳಿ", "ಗ್ರಾಮ ಪಂಚಾಯತ್", "ಗ್ರಾಮ", "ಕಾರ್ಯಕರ್ತ ಹೆಸರು", "ಫೋನ್ 1", "ಫೋನ್ 2"],
    ...rows.map(r => [r.slNo, r.hobli, r.gpName, r.villageName, r.contactName, r.phone1, r.phone2]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = [
    { wch: 7 }, { wch: 18 }, { wch: 24 },
    { wch: 22 }, { wch: 28 }, { wch: 16 }, { wch: 16 },
  ];
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "ಸಂಪರ್ಕ ಪಟ್ಟಿ");
  XLSX.writeFile(wb, `${filename}.xlsx`);
  toast.success("Excel download ಆಯ್ತು ✅");
};

const buildRows = (
  villages: { name: string; contactPersons: ContactPerson[] }[],
  gpName: string,
  hobliName: string,
  startSlNo = 1
): XlsRow[] => {
  const rows: XlsRow[] = [];
  let sl = startSlNo;
  villages.forEach(v => {
    if (!v.contactPersons?.length) {
      rows.push({
        slNo: sl++, hobli: hobliName, gpName,
        villageName: v.name, contactName: "—", phone1: "—", phone2: "",
      });
    } else {
      v.contactPersons.forEach((c: ContactPerson) => {
        rows.push({
          slNo: sl++, hobli: hobliName, gpName, villageName: v.name,
          contactName: c.name, phone1: c.phones?.[0] || "—", phone2: c.phones?.[1] || "",
        });
      });
    }
  });
  return rows;
};

/* ─────────────────────────────── CONTACT CARD (individual only) */
const ContactCard = ({ name, phones }: { name: string; phones: string[] }) => {
  const primary = phones?.[0]?.replace(/\s+/g, "") || "";
  const primaryClean = primary.replace(/\D/g, "").replace(/^0+/, "");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2
      bg-white dark:bg-[#1e2a3a] border border-gray-100 dark:border-gray-700
      rounded-xl px-3 py-2.5 shadow-sm hover:shadow transition">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-gray-800 dark:text-white truncate">👤 {name}</div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
          {phones?.length
            ? phones.map((ph, i) => (
                <a key={i} href={`tel:${ph.replace(/\s+/g, "")}`}
                  onClick={e => e.stopPropagation()}
                  className="text-blue-600 text-xs font-medium hover:text-blue-800">
                  📞 {ph.trim()}
                </a>
              ))
            : <span className="text-gray-400 text-xs">ಫೋನ್ ಇಲ್ಲ</span>}
        </div>
      </div>
      {primary && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Individual WhatsApp */}
          <button
            onClick={e => {
              e.stopPropagation();
              window.open(`https://wa.me/91${primaryClean}?text=ನಮಸ್ಕಾರ`, "_blank");
            }}
            title="WhatsApp"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition">
            <FaWhatsapp size={13} />
          </button>
          {/* Individual SMS */}
          <button
            onClick={e => { e.stopPropagation(); window.open(`sms:${primary}`, "_blank"); }}
            title="SMS"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
            <FaSms size={11} />
          </button>
          {/* Individual Call */}
          <a href={`tel:${primary}`} onClick={e => e.stopPropagation()} title="Call"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition">
            <FaPhone size={11} />
          </a>
        </div>
      )}
    </div>
  );
};



/* ─────────────────────────────── MAIN */
type ViewMode = "list" | "gp" | "village";

export default function VillageContacts() {
  const dispatch = useDispatch<AppDispatch>();

  const { gpContacts, villageContacts, searchResults, gpSummaryList, loading } =
    useSelector((s: RootState) => s.contacts);
  const hoblis: any[] = useSelector((s: RootState) => (s as any).hobli?.all_hobli || []);

  const [view, setView] = useState<ViewMode>("list");
  const [selectedHobli, setSelectedHobli] = useState("");
  const [selectedGP, setSelectedGP] = useState("");
  const [selectedVillage, setSelectedVillage] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [expandedVillages, setExpandedVillages] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [dlLoading, setDlLoading] = useState(false);

  const recRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  /* ── Initial loads */
  useEffect(() => {
    dispatch(fetchAllHoblis());
    dispatch(fetchAllGramaPanchayaths());
    dispatch(fetchGPContactSummary());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchGPContactSummary(selectedHobli || undefined));
  }, [dispatch, selectedHobli]);

  /* ── GP selection: fetch data, then set view ONLY after data arrives */
  useEffect(() => {
    if (selectedGP) {
      setExpandedVillages(new Set());
      dispatch(fetchGPContacts(selectedGP));
    }
  }, [dispatch, selectedGP]);

  // ✅ Fix: transition to "gp" view only when gpContacts data is ready & matches selectedGP
  useEffect(() => {
    if (
      selectedGP &&
      gpContacts &&
      String(gpContacts.gp?._id) === String(selectedGP)
    ) {
      setView("gp");
    }
  }, [gpContacts, selectedGP]);

  /* ── Search debounce — fires on EVERY change to `search` including voice */
  useEffect(() => {
    clearTimeout(debounceRef.current);

    const trimmed = search.trim();
    if (trimmed.length < 2) {
      setSearchDebounce("");
      dispatch({ type: "contacts/setSearchResults", payload: [] });
      return;
    }

    debounceRef.current = setTimeout(() => {
      setSearchDebounce(trimmed);
      dispatch(searchContacts(trimmed, selectedGP || undefined, selectedHobli || undefined));
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [search, selectedGP, selectedHobli, dispatch]);

  /* ── Voice search */
  const startVoiceSearch = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.warn("ನಿಮ್ಮ ಬ್ರೌಸರ್ Voice Search ಬೆಂಬಲಿಸುವುದಿಲ್ಲ"); return; }
    const r = new SR();
    r.lang = "kn-IN"; r.interimResults = false; r.maxAlternatives = 1;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onerror = () => { setIsListening(false); toast.error("Voice search ಸಮಸ್ಯೆ ಆಯ್ತು"); };
    // ✅ Fix: set search directly — debounce useEffect will pick it up
    r.onresult = (e: any) => {
      const transcript: string = e.results[0][0].transcript;
      setSearch(transcript);
    };
    recRef.current = r;
    r.start();
  }, []);

  const stopVoiceSearch = useCallback(() => {
    recRef.current?.stop();
    setIsListening(false);
  }, []);

  /* ── Excel downloads */
  const dlGPExcel = () => {
    if (!gpContacts) return;
    const rows = buildRows(
      gpContacts.villages,
      gpContacts.gp.name,
      gpContacts.gp.hobli?.name || ""
    );
    generateExcel(rows, `${gpContacts.gp.name}_ಸಂಪರ್ಕ`, `GP: ${gpContacts.gp.name}`);
  };

  const dlVillageExcel = (
    v: { name: string; contactPersons: ContactPerson[] },
    gpName: string,
    hobliName: string
  ) => {
    const rows = buildRows([v], gpName, hobliName);
    generateExcel(rows, `${v.name}_ಸಂಪರ್ಕ`, `ಗ್ರಾಮ: ${v.name} | GP: ${gpName}`);
  };

  const dlAllGPsExcel = async () => {
    if (!gpSummaryList.length) { toast.warn("ಡೇಟಾ ಲೋಡ್ ಆಗಿಲ್ಲ"); return; }
    setDlLoading(true);
    toast.info("ಎಲ್ಲಾ GP ಸಂಪರ್ಕಗಳು ಲೋಡ್ ಆಗುತ್ತಿದೆ... ⏳");
    try {
      const allRows: XlsRow[] = [];
      let sl = 1;
      const token = localStorage.getItem("token");
      for (const gp of gpSummaryList) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/contacts/gp/${gp._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) continue;
        const json = await res.json();
        const gpData = json.data as GPContacts;
        const hobliName = gpData.gp?.hobli?.name || (gp as any).hobli?.name || "";
        const gpName = gpData.gp?.name || gp.name;
        gpData.villages.forEach((v: GPVillage) => {
          if (!v.contactPersons?.length) {
            allRows.push({
              slNo: sl++, hobli: hobliName, gpName,
              villageName: v.name, contactName: "—", phone1: "—", phone2: "",
            });
          } else {
            v.contactPersons.forEach((c: ContactPerson) => {
              allRows.push({
                slNo: sl++, hobli: hobliName, gpName, villageName: v.name,
                contactName: c.name, phone1: c.phones?.[0] || "—", phone2: c.phones?.[1] || "",
              });
            });
          }
        });
      }
      if (!allRows.length) { toast.warn("ಸಂಪರ್ಕ ಡೇಟಾ ಇಲ್ಲ"); return; }
      generateExcel(
        allRows,
        "All_GP_ಸಂಪರ್ಕ_ಪಟ್ಟಿ",
        `ಎಲ್ಲಾ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಸಂಪರ್ಕ ಪಟ್ಟಿ (${gpSummaryList.length} GP)`
      );
    } catch {
      toast.error("Download ಆಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ");
    } finally {
      setDlLoading(false);
    }
  };

  /* ── Navigation */
  const openVillage = useCallback((id: string, name: string) => {
    setSelectedVillage({ id, name });
    setView("village");
    dispatch(fetchVillageContacts(id));
  }, [dispatch]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedVillages(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  // ✅ Fix: back from village → gp keeps selectedGP + re-fetches if gpContacts lost
  const handleBack = useCallback(() => {
    if (view === "village") {
      setView("gp");
      setSelectedVillage(null);
      // Re-fetch GP if data was cleared
      if (selectedGP && !gpContacts) {
        dispatch(fetchGPContacts(selectedGP));
      }
    } else if (view === "gp") {
      setView("list");
      setSelectedGP("");
      dispatch(clearContacts());
    }
  }, [view, selectedGP, gpContacts, dispatch]);

  /* ── Derived */
  const filteredGPList = useMemo(() =>
    gpSummaryList.filter((gp: GPSummary) => !selectedHobli || gp.hobli?._id === selectedHobli),
    [gpSummaryList, selectedHobli]
  );



  /* ── Header title */
  const headerTitle = useMemo(() => {
    if (view === "gp") return `🏛 ${gpContacts?.gp?.name || "..."}`;
    if (view === "village") return `🏘 ${selectedVillage?.name || "..."}`;
    return "📋 ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು";
  }, [view, gpContacts, selectedVillage]);

  /* ══════════════════════════════ RENDER */
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-gray-50 dark:bg-[#151e28] overflow-hidden">

      {/* ── HEADER */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1f2a38] shadow-sm px-3 py-2.5 space-y-2">

        {/* Row 1: title + actions */}
        <div className="flex items-center gap-2">

          {/* Back button */}
          {view !== "list" && (
            <button onClick={handleBack}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full
                bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white shadow hover:scale-105 transition">
              <FaArrowLeft size={13} />
            </button>
          )}

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm sm:text-base truncate leading-tight">{headerTitle}</h1>
            {view === "gp" && gpContacts && (
              <p className="text-xs text-gray-400 truncate">
                {gpContacts.gp.hobli?.name} • {gpContacts.villages.length} ಗ್ರಾಮಗಳು
              </p>
            )}
            {view === "village" && villageContacts && (
              <p className="text-xs text-gray-400 truncate">
                {(villageContacts as any).gp?.name}
              </p>
            )}
          </div>

          {/* List view actions */}
          {view === "list" && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={dlAllGPsExcel} disabled={dlLoading}
                className="flex items-center gap-1.5 bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-full hover:bg-emerald-700 transition shadow disabled:opacity-60">
                <FaFileExcel size={11} />
                {dlLoading ? "..." : "ಎಲ್ಲಾ ಡೌನ್‌ಲೋಡ್"}
              </button>
              <button onClick={() => setShowFilters(f => !f)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition flex-shrink-0
                  ${showFilters ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}>
                <FaFilter size={12} />
              </button>
            </div>
          )}

          {/* GP view actions: Excel only */}
          {view === "gp" && gpContacts && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={dlGPExcel}
                className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-2.5 py-1.5 rounded-full hover:bg-emerald-700 transition shadow">
                <FaFileExcel size={11} /> Excel
              </button>
            </div>
          )}

          {/* Village view actions: Excel only */}
          {view === "village" && villageContacts && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => dlVillageExcel(
                  { name: villageContacts.name, contactPersons: villageContacts.contactPersons || [] },
                  (villageContacts as any).gp?.name || "",
                  (villageContacts as any).gp?.hobli?.name || ""
                )}
                className="flex items-center gap-1 bg-emerald-600 text-white text-xs px-2.5 py-1.5 rounded-full hover:bg-emerald-700 transition shadow">
                <FaFileExcel size={11} /> Excel
              </button>
            </div>
          )}
        </div>

        {/* Hobli filter */}
        {view === "list" && showFilters && (
          <select
            value={selectedHobli}
            onChange={e => { setSelectedHobli(e.target.value); setSelectedGP(""); }}
            className="w-full sm:w-52 border rounded-lg px-2.5 py-1.5 text-sm
              bg-white dark:bg-[#16202b] dark:text-white
              focus:outline-none focus:ring-1 focus:ring-blue-300">
            <option value="">ಎಲ್ಲಾ ಹೋಬಳಿ</option>
            {hoblis.map((h: any) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        )}

        {/* Search bar */}
        <div className="relative">
          <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ಹೆಸರು / ಫೋನ್ ಹುಡುಕಿ... (2+ ಅಕ್ಷರ)"
            className="w-full pl-7 pr-16 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-300
              dark:bg-[#16202b] dark:text-white dark:border-gray-600
              transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-1">
              <FaTimes size={11} />
            </button>
          )}
          {/* Voice mic button */}
          <button
            onClick={isListening ? stopVoiceSearch : startVoiceSearch}
            title={isListening ? "ನಿಲ್ಲಿಸಿ" : "ಧ್ವನಿ ಹುಡುಕಾಟ (ಕನ್ನಡ)"}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full
              flex items-center justify-center transition
              ${isListening
                ? "bg-red-500 text-white animate-pulse ring-2 ring-red-300"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}>
            {isListening ? <FaMicrophoneSlash size={11} /> : <FaMicrophone size={11} />}
          </button>
        </div>

        {/* Voice listening indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-xs text-red-500 font-medium px-1 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
            ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ... ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ
          </div>
        )}
      </div>

      {/* ── CONTENT */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">

        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2" />
            <div>ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
          </div>
        )}

        {/* ── SEARCH RESULTS */}
        {!loading && searchDebounce.length >= 2 && (
          <>
            <p className="text-xs text-gray-400 px-1 pt-1">
              &ldquo;{searchDebounce}&rdquo; — {searchResults.length} ಫಲಿತಾಂಶಗಳು
            </p>
            {searchResults.length > 0
              ? searchResults.map((v: any) => (
                  <div key={v._id}
                    className="bg-white dark:bg-[#1f2a38] rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <button
                          onClick={() => openVillage(v._id, v.name)}
                          className="font-bold text-sm text-blue-700 dark:text-blue-300 hover:underline">
                          🏘 {v.name}
                        </button>
                        {v.gp?.name && (
                          <span className="text-xs text-gray-400 ml-2">› {v.gp.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {(v.contactPersons as ContactPerson[] || []).map((c: ContactPerson, i: number) => (
                        <ContactCard key={i} name={c.name} phones={c.phones || []} />
                      ))}
                    </div>
                  </div>
                ))
              : (
                <div className="text-center py-10 text-gray-400 text-sm">
                  <div className="text-3xl mb-2">🔍</div>
                  <div>ಫಲಿತಾಂಶಗಳು ಸಿಗಲಿಲ್ಲ</div>
                  <div className="text-xs mt-1 text-gray-300">ಬೇರೆ ಹೆಸರು ಅಥವಾ ಫೋನ್ ಸಂಖ್ಯೆ ಪ್ರಯತ್ನಿಸಿ</div>
                </div>
              )}
          </>
        )}

        {/* ── LIST VIEW */}
        {!loading && view === "list" && searchDebounce.length < 2 && (
          <>
            {/* Stats banner */}
            <div className="bg-gradient-to-r from-[#2466d1] to-cyan-500 rounded-xl p-3 text-white shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-80">ಗ್ರಾಮ ಪಂಚಾಯತ್</div>
                  <div className="text-2xl font-bold">{filteredGPList.length}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-80">ಒಟ್ಟು ಗ್ರಾಮಗಳು</div>
                  <div className="text-2xl font-bold">
                    {filteredGPList.reduce((s: number, g: GPSummary) => s + g.villageCount, 0)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">ಒಟ್ಟು ಸಂಪರ್ಕಗಳು</div>
                  <div className="text-2xl font-bold">
                    {filteredGPList.reduce((s: number, g: GPSummary) => s + g.totalContactCount, 0)}
                  </div>
                </div>
              </div>
            </div>

            {filteredGPList.length === 0
              ? <div className="text-center py-16 text-gray-400 text-sm">ಡೇಟಾ ಸಿಗಲಿಲ್ಲ</div>
              : filteredGPList.map((gp: GPSummary) => (
                  <div key={gp._id}
                    className="bg-white dark:bg-[#1f2a38] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedGP(gp._id)}>
                        <div className="font-bold text-sm bg-gradient-to-r from-[#2466d1] to-cyan-500 bg-clip-text text-transparent truncate">
                          🏛 {gp.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {gp.hobli?.name} • {gp.villageCount} ಗ್ರಾಮ • {gp.totalContactCount} ಸಂಪರ್ಕ
                        </div>
                      </div>
                      <button onClick={() => setSelectedGP(gp._id)}
                        className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition flex-shrink-0">
                        ತೆರೆ →
                      </button>
                    </div>
                    {gp.villages?.length > 0 && (
                      <div className="px-3 pb-2.5 border-t border-gray-50 dark:border-gray-700 pt-1.5">
                        <div className="flex flex-wrap gap-1.5">
                          {gp.villages.slice(0, 10).map(v => (
                            <button key={v._id} onClick={() => openVillage(v._id, v.name)}
                              className="text-xs bg-blue-50 dark:bg-[#1a2535] text-blue-700 dark:text-blue-300
                                border border-blue-100 dark:border-blue-900 px-2.5 py-1 rounded-full
                                hover:bg-blue-100 transition flex items-center gap-1">
                              🏘 {v.name}
                              {v.contactCount > 0 && (
                                <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full px-1 text-[10px]">
                                  {v.contactCount}
                                </span>
                              )}
                            </button>
                          ))}
                          {gp.villages.length > 10 && (
                            <span className="text-xs text-gray-400 py-1">
                              +{gp.villages.length - 10} ಇನ್ನಷ್ಟು
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
          </>
        )}

        {/* ── GP DETAIL VIEW */}
        {!loading && view === "gp" && gpContacts && searchDebounce.length < 2 && (
          gpContacts.villages.length === 0
            ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                <div className="text-3xl mb-2">🏛</div>
                <div>ಈ GP ಯಲ್ಲಿ ಯಾವ ಗ್ರಾಮಗಳೂ ಇಲ್ಲ</div>
              </div>
            )
            : gpContacts.villages.map((v: GPVillage) => (
                <div key={v._id}
                  className="bg-white dark:bg-[#1f2a38] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <button
                      onClick={() => toggleExpand(v._id)}
                      className="flex-1 text-left min-w-0 flex items-center gap-2">
                      <span className="text-gray-400 text-xs flex-shrink-0">
                        {expandedVillages.has(v._id) ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                      </span>
                      <div className="font-semibold text-sm text-gray-800 dark:text-white truncate">
                        🏘 {v.name}
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 py-0.5">
                        {v.contactPersons?.length || 0}
                      </span>
                    </button>
                    {/* Excel per village */}
                    {v.contactPersons?.length > 0 && (
                      <button
                        onClick={() => dlVillageExcel(v, gpContacts.gp.name, gpContacts.gp.hobli?.name || "")}
                        title="Excel Download"
                        className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition flex-shrink-0">
                        <FaFileExcel size={10} />
                      </button>
                    )}
                  </div>

                  {expandedVillages.has(v._id) && (
                    <div className="px-3 pb-3 border-t border-gray-50 dark:border-gray-700 pt-2 space-y-1.5">
                      {v.contactPersons?.length
                        ? v.contactPersons.map((c: ContactPerson, i: number) => (
                            <ContactCard key={i} name={c.name} phones={c.phones || []} />
                          ))
                        : <p className="text-gray-400 text-sm py-2 text-center">ಸಂಪರ್ಕ ಮಾಹಿತಿ ಇಲ್ಲ</p>}
                    </div>
                  )}
                </div>
              ))
        )}

        {/* ── VILLAGE DETAIL VIEW */}
        {!loading && view === "village" && villageContacts && searchDebounce.length < 2 && (
          <div className="bg-white dark:bg-[#1f2a38] rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <div className="mb-3">
              <h3 className="font-bold text-base text-gray-800 dark:text-white">
                🏘 {villageContacts.name}
              </h3>
              <p className="text-xs text-gray-400">
                {(villageContacts as any).gp?.name && `${(villageContacts as any).gp.name} › `}
                {villageContacts.contactPersons?.length || 0} ಕಾರ್ಯಕರ್ತರು
              </p>
            </div>

            {villageContacts.contactPersons?.length
              ? (
                <div className="space-y-2">
                  {villageContacts.contactPersons.map((c: ContactPerson, i: number) => (
                    <ContactCard key={i} name={c.name} phones={c.phones || []} />
                  ))}
                </div>
              )
              : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <div className="text-3xl mb-2">📭</div>
                  ಸಂಪರ್ಕ ಮಾಹಿತಿ ಇಲ್ಲ
                </div>
              )}
          </div>
        )}

        {/* ── GP loading state: show shimmer while fetching GP data */}
        {!loading && view === "gp" && !gpContacts && (
          <div className="text-center py-16 text-gray-400 text-sm">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2" />
            <div>GP ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
          </div>
        )}

        {/* ── Village loading state */}
        {!loading && view === "village" && !villageContacts && (
          <div className="text-center py-16 text-gray-400 text-sm">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2" />
            <div>ಗ್ರಾಮ ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
          </div>
        )}

      </div>
    </div>
  );
}