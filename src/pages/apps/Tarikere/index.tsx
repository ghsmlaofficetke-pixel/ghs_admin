import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { fetchGramaPanchayaths, updateGramaPanchayath } from "../../../api/gramapanchayath";
import {
  fetchGPVillages,
  updateVillage,
  clearVillageState,
} from "../../../api/village";
import { FaArrowLeft } from "react-icons/fa";
import EditModal from "./editModal";
import VillageManavi from "./VillageManavi";
import VillageWorks from "./work/VillageWorks";
import { useNavigate, useParams, useLocation } from "react-router-dom";

/* ================= CUSTOM DROPDOWN ================= */

function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  options: { _id: string; name: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = options?.find((o) => o._id === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className={`w-full border rounded-lg p-2 text-sm bg-white text-left
          flex justify-between items-center transition
          ${disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:border-blue-500"}`}
      >
        <span className="truncate font-semibold text-gray-800 tracking-wide">
          {selected ? selected.name : placeholder}
        </span>
        <span className={`ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
          bg-white border border-gray-200 rounded-xl shadow-xl">
          {options?.length ? (
            options.map((o) => (
              <div
                key={o._id}
                onClick={() => { onChange(o._id); setOpen(false); }}
                className={`p-2 text-sm font-bold cursor-pointer truncate transition
                  ${o._id === value
                    ? "bg-gradient-to-r from-[#2466d1]/20 to-cyan-400/20 text-blue-700"
                    : "text-gray-800 hover:bg-gradient-to-r hover:from-[#2466d1]/10 hover:to-cyan-400/10 hover:text-blue-700"
                  }`}
              >
                {o.name}
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">ಡೇಟಾ ಇಲ್ಲ</div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */

// Navigation levels:
//  0 — no hobli selected (just dropdown visible)
//  1 — hobli selected   → GP card list
//  2 — GP selected      → Village card list
//  3 — village detail   → id param present

export default function TarikereTownPanchayath() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { taluk, id } = useParams<{ taluk?: string; id?: string }>();

  // gramaPanchayaths + villages come from Redux (keyed to last fetch)
  // hoblis are managed locally to avoid cross-taluk Redux contamination
  const gpState      = useSelector((state: RootState) => state.gramaPanchayath);
  const villageState = useSelector((state: RootState) => state.village);
  const gramaPanchayaths = gpState?.list  || [];
  const villages         = villageState?.list || [];

  // ── local state ──
  const [hoblis,       setHoblis]       = useState<{ _id: string; name: string }[]>([]);
  const [selectedHobli, setSelectedHobli] = useState("");
  const [selectedGP,    setSelectedGP]    = useState("");
  const [searchText,  setSearchText]  = useState("");
  const [editOpen,    setEditOpen]    = useState(false);
  const [editData,    setEditData]    = useState<any>(null);
  const [editType,    setEditType]    = useState<"gp" | "village">("gp");
  const [activeTab,   setActiveTab]   = useState<"manavi" | "works">("manavi");
  const [openVillage, setOpenVillage] = useState<string | null>(null);
  const [openGP,      setOpenGP]      = useState<string | null>(null);
  const [search,   setSearch]   = useState("");
  const [results,  setResults]  = useState<any[]>([]);

  const TALUK_ID_MAP: Record<string, string> = {
    tarikere: "697c608ce9a52546e447aa74",
    ajjampura: "697c60a0e9a52546e447aa76",
  };

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // ── refs ──
  // loadedForTaluk    : which taluk's hoblis are in `hoblis` state
  // initDoneForTaluk  : init (auto-select / back-nav) ran for this taluk
  // pgHobli / pgGP    : value WE are about to set programmatically
  //                     so "user changed" effects can skip that render
  const loadedForTaluk   = useRef("");
  const initDoneForTaluk = useRef("");
  const pgHobli          = useRef("");
  const pgGP             = useRef("");

  /* ─────────────────────────────────────────────────────────────────
     STEP 1 — taluk param changes
     Fetch hoblis directly (not via Redux) so each taluk keeps its own list.
     Stale-fetch guard: if user switches taluk while fetch is in-flight,
     the resolved data is discarded.
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!taluk) return;
    if (loadedForTaluk.current === taluk) return; // already loading for this taluk
    loadedForTaluk.current   = taluk;
    initDoneForTaluk.current = "";

    // Poison programmatic refs so stale values from previous taluk can't match
    pgHobli.current = "__reset__";
    pgGP.current    = "__reset__";

    setHoblis([]);
    setSelectedHobli("");
    setSelectedGP("");
    setSearchText("");
    setResults([]);
    setSearch("");
    dispatch(clearVillageState());

    const talukId = TALUK_ID_MAP[taluk.toLowerCase()];
    if (!talukId) return;

    fetch(`${API_URL}/hoblis/panchayath/${talukId}`)
      .then((r) => r.json())
      .then((data) => {
        // Stale-fetch guard — user may have already switched taluk again
        if (loadedForTaluk.current !== taluk) return;
        const list: { _id: string; name: string }[] = data?.data || data || [];
        setHoblis(list);
      })
      .catch(console.error);
  }, [taluk]); // dispatch / API_URL are stable, no need in deps

  /* ─────────────────────────────────────────────────────────────────
     STEP 2 — hoblis loaded → ONE-TIME init per taluk
     Auto-selects first hobli  OR  restores back-nav state
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!hoblis.length || !taluk) return;
    if (initDoneForTaluk.current === taluk) return;
    initDoneForTaluk.current = taluk;

    const state: any = location.state;

    if (state?.hobli) {
      // Back-nav: restore hobli + optionally GP
      pgHobli.current = state.hobli;
      setSelectedHobli(state.hobli);
      dispatch(fetchGramaPanchayaths(state.hobli));

      if (state.gp) {
        pgGP.current = state.gp;
        setSelectedGP(state.gp);
        dispatch(fetchGPVillages(state.gp));
      }
    } else {
      // Fresh load: auto-select first hobli → GP list will show
      const firstId = hoblis[0]._id;
      pgHobli.current = firstId;
      setSelectedHobli(firstId);
      dispatch(fetchGramaPanchayaths(firstId));
    }
  }, [hoblis, taluk]); // location.state read once intentionally

  /* ─────────────────────────────────────────────────────────────────
     STEP 3 — User manually picked hobli from dropdown
     Skip if this render was triggered by our own STEP 2 programmatic set
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!selectedHobli) return;
    if (pgHobli.current === selectedHobli) {
      pgHobli.current = ""; // consume guard — only skip once
      return;
    }
    // Genuine user pick — clear GP / villages, fetch new GPs
    pgGP.current = "__clearing__";
    setSelectedGP("");
    dispatch(clearVillageState());
    setSearchText("");
    dispatch(fetchGramaPanchayaths(selectedHobli));
  }, [selectedHobli, dispatch]);

  /* ─────────────────────────────────────────────────────────────────
     STEP 4 — GP changed (user clicked GP card OR back-nav restore)
     Skip if this render was triggered by our own programmatic set
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!selectedGP) return;
    if (pgGP.current === selectedGP) {
      pgGP.current = ""; // consume guard
      return;
    }
    // User clicked a GP card — fetch villages
    dispatch(clearVillageState());
    dispatch(fetchGPVillages(selectedGP));
    setSearchText("");
  }, [selectedGP, dispatch]);

  /* ─────────────────────────────────────────────────────────────────
     SAFETY NET — returned to list route with selectedGP but empty villages
     (Redux was cleared while on village detail route)
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!id && selectedGP && villages.length === 0) {
      dispatch(fetchGPVillages(selectedGP));
    }
  }, [id]); // only re-run when route changes (id appears / disappears)

  /* ================= FILTER LOGIC ================= */

  const matchText = (text: string, q: string) => text?.toLowerCase().includes(q);

  const filteredGPs = useMemo(() => {
    const q = searchText.toLowerCase();
    if (!q) return gramaPanchayaths;
    return gramaPanchayaths.filter((gp: any) => {
      if (matchText(gp.name || "", q)) return true;
      return gp.pdo?.some(
        (p: any) =>
          matchText(p.name || "", q) ||
          p.phones?.some((ph: string) => matchText(ph || "", q))
      );
    });
  }, [gramaPanchayaths, searchText]);

  const filteredVillages = useMemo(() => {
    const q = searchText.toLowerCase();
    if (!q) return villages;
    return villages.filter((v: any) => {
      if (matchText(v.name || "", q)) return true;
      return v.contactPersons?.some(
        (c: any) =>
          matchText(c.name || "", q) ||
          c.phones?.some((ph: string) => matchText(ph || "", q))
      );
    });
  }, [villages, searchText]);

  /* ================= SAVE HANDLER ================= */

  const handleSave = (data: any) => {
    if (editType === "gp") {
      dispatch(updateGramaPanchayath(data._id, { ...data, hobliId: selectedHobli }) as any);
    } else {
      dispatch(updateVillage(data._id, { ...data, gpId: selectedGP }) as any);
    }
    setEditOpen(false);
  };

  /* ================= GLOBAL VILLAGE SEARCH ================= */

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.length < 2) { setResults([]); return; }
    const res = await fetch(`${API_URL}/villages/search?q=${value}`);
    const data = await res.json();
    // setResults(data.data || []);
  };

  /* ================= LABELS / DERIVED ================= */

  const talukTitle =
    taluk?.toLowerCase() === "ajjampura" ? "ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು" : "ತರೀಕೆರೆ ತಾಲ್ಲೂಕು";

  // Which "level" are we at?
  const level = id ? 3 : selectedGP ? 2 : selectedHobli ? 1 : 0;

  /* ================= BACK BUTTON HANDLER ================= */

  const handleBack = () => {
    if (level === 3) {
      const locState: any = location.state;
      navigate(`/apps/taluk/${taluk}`, {
        state: {
          hobli: locState?.hobli || selectedHobli,
          gp:    locState?.gp    || selectedGP,
        },
      });
    } else if (level === 2) {
      // Village list → GP list (keep hobli)
      pgGP.current = "__clearing__";
      setSelectedGP("");
      dispatch(clearVillageState());
      setSearchText("");
    } else if (level === 1) {
      // GP list → dropdown only (clear hobli)
      pgHobli.current = "__clearing__";
      pgGP.current    = "__clearing__";
      setSelectedHobli("");
      setSelectedGP("");
      setSearchText("");
    }
  };

  /* ================= BREADCRUMB ================= */

  const BreadcrumbSub = () => {
    if (level === 0 || level === 3) return null;
    const hobliName = hoblis.find((h) => h._id === selectedHobli)?.name || "";
    const gpName    = gramaPanchayaths.find((g: any) => g._id === selectedGP)?.name || "";
    return (
      <p className="text-xs text-gray-400 leading-none mt-0.5 truncate">
        {level === 1 && `${hobliName} › ಗ್ರಾಮ ಪಂಚಾಯತ್ ಪಟ್ಟಿ`}
        {level === 2 && `${hobliName} › ${gpName} › ಗ್ರಾಮಗಳ ಪಟ್ಟಿ`}
      </p>
    );
  };

  /* ================= VILLAGE CARD ================= */

  const VillageCard = ({ v }: { v: any }) => (
    <div
      onClick={() =>
        navigate(`/apps/${taluk}/village/${v._id}`, {
          state: { hobli: selectedHobli, gp: selectedGP },
        })
      }
      className="bg-white dark:bg-[#1f2a38] border border-gray-200 dark:border-gray-700
        rounded-xl p-3 sm:p-4 cursor-pointer
        hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        <div className="font-bold text-sm sm:text-base flex-1 min-w-0
          bg-gradient-to-r from-[#2466d1] to-cyan-500 bg-clip-text text-transparent truncate">
          {v.name}
        </div>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full whitespace-nowrap border border-blue-100">
          ಮನವಿ / ಕೆಲಸ
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setEditType("village"); setEditData(v); setEditOpen(true); }}
          className="text-xs bg-gradient-to-r from-[#2466d1] to-cyan-500
            text-white px-2.5 py-1 rounded-full shadow flex-shrink-0"
        >
          Edit
        </button>
      </div>

      {/* ಕಾರ್ಯಕರ್ತರು Toggle */}
      <div
        onClick={(e) => { e.stopPropagation(); setOpenVillage(openVillage === v._id ? null : v._id); }}
        className="mt-2.5 flex items-center gap-1.5 cursor-pointer select-none"
      >
        <span className={`text-[10px] text-[#d6277b] transition-transform duration-200
          ${openVillage === v._id ? "rotate-90" : ""} inline-block`}>▶</span>
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">ಕಾರ್ಯಕರ್ತರು</span>
        {v?.contactPersons?.length > 0 && (
          <span className="text-xs text-gray-400">({v.contactPersons.length})</span>
        )}
      </div>

      <div className={`overflow-hidden transition-all duration-300
        ${openVillage === v._id ? "max-h-[500px] mt-2" : "max-h-0"}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {v?.contactPersons?.length ? (
            v.contactPersons.map((c: any, idx: number) => (
              <div key={idx}
                className="flex items-center justify-between gap-2
                  bg-gray-50 dark:bg-[#16202b] border border-gray-100 dark:border-gray-700
                  rounded-lg px-3 py-2">
                <div className="font-medium text-sm text-gray-800 dark:text-white truncate">
                  👤 {c?.name}
                </div>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  {c?.phones?.length ? (
                    c.phones.map((phone: string, pIdx: number) => (
                      <a key={pIdx} href={`tel:${phone.replace(/\s+/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 text-xs font-medium hover:text-blue-800 whitespace-nowrap">
                        📞 {phone?.trim()}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">ಫೋನ್ ಇಲ್ಲ</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-sm col-span-full">ಸಂಪರ್ಕ ಮಾಹಿತಿ ಇಲ್ಲ</div>
          )}
        </div>
      </div>
    </div>
  );

  /* ================= RENDER ================= */

  return (
    <div className="h-[calc(100vh-190px)] flex flex-col bg-gray-50 dark:bg-[#151e28]">

      {/* ===== STICKY HEADER ===== */}
      <div className="sticky top-0 z-20 bg-white dark:bg-[#1f2a38] shadow-sm">

        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* BACK — visible at levels 1, 2, 3 */}
          {level >= 1 && (
            <button
              onClick={handleBack}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center
                rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500
                text-white shadow hover:scale-105 active:scale-95 transition"
            >
              <FaArrowLeft size={13} />
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-sm sm:text-base truncate leading-tight">
              {talukTitle}
            </h1>
            <BreadcrumbSub />
          </div>

          {/* GLOBAL SEARCH — list pages only */}
          {level < 3 && (
            <input
              type="text"
              placeholder="ಗ್ರಾಮ ಹುಡುಕಿ..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-28 sm:w-52 px-2.5 py-1.5 text-xs sm:text-sm border rounded-lg
                focus:outline-none focus:ring-1 focus:ring-blue-300 flex-shrink-0"
            />
          )}

          {/* TABS — village detail only */}
          {level === 3 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {(["manavi", "works"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 rounded text-xs sm:text-sm whitespace-nowrap transition ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white shadow"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {tab === "manavi" ? "ಮನವಿಗಳು" : "ಕೆಲಸಗಳು"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIST PAGE FILTERS — levels 0–2 */}
        {level < 3 && (
          <div className="px-3 pb-2.5 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-2">
            <CustomDropdown
              options={hoblis}
              value={selectedHobli}
              onChange={(v) => setSelectedHobli(v)}
              placeholder="ಹೋಬಳಿ ಆಯ್ಕೆಮಾಡಿ"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="ಹೆಸರು / ಫೋನ್ ಹುಡುಕಿ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-0
                  focus:outline-none focus:ring-1 focus:ring-blue-300"
              />
              <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100
                px-2.5 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 font-medium">
                {level === 2
                  ? `${filteredVillages.length} ಗ್ರಾಮ`
                  : `${filteredGPs.length} GP`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">

        {/* ── Global Search Results ── */}
        {search.length >= 2 && (
          <>
            {results.length > 0 ? (
              <>
                <p className="text-xs text-gray-400 px-1 pt-1">
                  "{search}" — {results.length} ಫಲಿತಾಂಶಗಳು
                </p>
                {results.map((v: any) => <VillageCard key={v._id} v={v} />)}
              </>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                ಫಲಿತಾಂಶಗಳು ಸಿಗಲಿಲ್ಲ
              </div>
            )}
          </>
        )}

        {/* ── Village Detail (level 3) ── */}
        {level === 3 && (
          <div className="bg-white dark:bg-[#1f2a38] rounded-xl shadow">
            {activeTab === "manavi" && <VillageManavi />}
            {activeTab === "works" && <VillageWorks />}
          </div>
        )}

        {/* ── List View (levels 0–2, search inactive) ── */}
        {level < 3 && search.length < 2 && (
          <>
            {/* Level 0: no hobli yet */}
            {level === 0 && hoblis.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
            )}
            {level === 0 && hoblis.length > 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">ಮೇಲೆ ಹೋಬಳಿ ಆಯ್ಕೆಮಾಡಿ</div>
            )}

            {/* Level 1: GP Cards */}
            {level === 1 && (
              <>
                {filteredGPs.map((gp: any) => (
                  <div
                    key={gp._id}
                    onClick={() => setSelectedGP(gp._id)}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4
                      cursor-pointer bg-white dark:bg-[#1f2a38]
                      hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-sm sm:text-base flex-1 min-w-0
                        bg-gradient-to-r from-[#2466d1] to-cyan-500 bg-clip-text text-transparent truncate">
                        {gp?.name}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditType("gp"); setEditData(gp); setEditOpen(true); }}
                        className="text-xs bg-gradient-to-r from-[#2466d1] to-cyan-500
                          text-white px-2.5 py-1 rounded-full shadow flex-shrink-0"
                      >
                        Edit
                      </button>
                    </div>

                    {/* PDO Toggle */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setOpenGP(openGP === gp._id ? null : gp._id); }}
                      className="mt-2.5 flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <span className={`text-[10px] text-[#d6277b] transition-transform duration-200
                        ${openGP === gp._id ? "rotate-90" : ""} inline-block`}>▶</span>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">PDO Contacts</span>
                      {gp?.pdo?.length > 0 && (
                        <span className="text-xs text-gray-400">({gp.pdo.length})</span>
                      )}
                    </div>

                    <div className={`overflow-hidden transition-all duration-300
                      ${openGP === gp._id ? "max-h-[400px] mt-2" : "max-h-0"}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {gp?.pdo?.length ? (
                          gp.pdo.map((p: any, idx: number) => (
                            <div key={idx}
                              className="flex items-center justify-between gap-2
                                bg-gray-50 dark:bg-[#16202b] border border-gray-100 dark:border-gray-700
                                rounded-lg px-3 py-2">
                              <div className="font-medium text-sm text-gray-800 dark:text-white truncate">
                                👤 {p?.name}
                              </div>
                              <div className="flex flex-col gap-0.5 flex-shrink-0">
                                {p.phones?.length ? (
                                  p.phones.map((phone: string, pIdx: number) => (
                                    <a key={pIdx} href={`tel:${phone.replace(/\s+/g, "")}`}
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-blue-600 text-xs font-medium hover:text-blue-800 whitespace-nowrap">
                                      📞 {phone.trim()}
                                    </a>
                                  ))
                                ) : (
                                  <span className="text-gray-400 text-xs">ಫೋನ್ ಇಲ್ಲ</span>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-sm">PDO ಮಾಹಿತಿ ಇಲ್ಲ</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredGPs.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    ಗ್ರಾಮ ಪಂಚಾಯತ್ ಡೇಟಾ ಸಿಗಲಿಲ್ಲ
                  </div>
                )}
              </>
            )}

            {/* Level 2: Village Cards */}
            {level === 2 && (
              <>
                {filteredVillages.map((v: any) => (
                  <VillageCard key={v._id} v={v} />
                ))}
                {filteredVillages.length === 0 && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    ಗ್ರಾಮಗಳ ಡೇಟಾ ಸಿಗಲಿಲ್ಲ
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
      <EditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={editType === "gp" ? "Edit Grama Panchayath" : "Edit Village"}
        type={editType}
        initialData={editData}
        onSave={handleSave}
      />
    </div>
  );
}
