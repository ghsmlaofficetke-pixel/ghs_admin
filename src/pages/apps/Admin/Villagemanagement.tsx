// src/pages/apps/Admin/VillageManagement.tsx
// ✅ FIXED: Caste name input full width — no more squished field
// ✅ FIXED: Caste list shows properly in table, with progress bars
// ✅ FIXED: Detail view shows all caste entries with pie-like bars
// ✅ FIXED: Edit save refetches all villages
// ✅ FIXED: Outer scroll removed — sidebar fixed, inner content scrolls
// ✅ NEW: Caste name is now a dropdown (Outvote master list)
// ✅ NEW: Population field added alongside House Count for each caste

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import {
  fetchAllVillages,
  createVillage,
  updateVillage,
  deleteVillage,
  villageSelector,
  Village,
  CasteDetail,
} from '../../../api/village';
import { fetchAllGramaPanchayaths, GramaPanchayath } from '../../../api/gramapanchayath';
import { PageBreadcrumb } from '../../../components';
import { toast } from 'react-toastify';

const isAdmin = () => {
  const role = localStorage.getItem('userRole') || '';
  return role === 'admin' || role === 'superadmin';
};

type FormType = {
  name: string;
  gpId: string;
  contactPersons: { name: string; phones: string[] }[];
  totalHouses: number;
  casteDetails: CasteDetail[];
  totalVoters: number;
};

const defaultForm = (): FormType => ({
  name: '',
  gpId: '',
  contactPersons: [{ name: '', phones: [''] }],
  totalHouses: 0,
  casteDetails: [],
  totalVoters: 0,
});

// Colour palette for caste bars — cycles if more entries
const CASTE_COLORS = [
  { bg: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-700'   },
  { bg: 'bg-emerald-500', light: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-violet-500', light: 'bg-violet-100',  text: 'text-violet-700' },
  { bg: 'bg-rose-500',   light: 'bg-rose-100',    text: 'text-rose-700'   },
  { bg: 'bg-amber-500',  light: 'bg-amber-100',   text: 'text-amber-700'  },
  { bg: 'bg-cyan-500',   light: 'bg-cyan-100',    text: 'text-cyan-700'   },
  { bg: 'bg-fuchsia-500',light: 'bg-fuchsia-100', text: 'text-fuchsia-700'},
  { bg: 'bg-teal-500',   light: 'bg-teal-100',    text: 'text-teal-700'   },
];

// Caste/Religion master list (from Outvote sheet)
const CASTE_OPTIONS = [
  { kn: 'ಆರ್ಯ ವೈಶ್ಯ' },
  { kn: 'ಬಲಿಜ' },
  { kn: 'ಬ್ರಾಹ್ಮಣ' },
  { kn: 'ಕ್ರಿಶ್ಚಿಯನ್' },
  { kn: 'ದೇವಾಂಗ / ನೇಕಾರ' },
  { kn: 'ಬಣಜಿಗ ಶೆಟ್ರು' },
  { kn: 'ಈಡಿಗ' },
  { kn: 'ಗಂಗಾಮತ / ಬೆಸ್ತ' },
  { kn: 'ಗೊಲ್ಲ / ಕಾಡುಗೊಲ್ಲ' },
  { kn: 'ನಾಯ್ಡು' },
  { kn: 'ಜೈನ' },
  { kn: 'ಕ್ಷತ್ರಿಯ' }, 
  { kn: 'ಕುಂಬಾರ' },
  { kn: 'ಕುರುಬ' },
  { kn: 'ಲಿಂಗಾಯತ - ಬಣಜಿಗ' },
  { kn: 'ಲಿಂಗಾಯತ - ಜಂಗಮ/ಐನಾರು' },
  { kn: 'ಲಿಂಗಾಯತ - ಕುಂಚಿಟಿಗ' },
  { kn: 'ಲಿಂಗಾಯತ - ನೋಳಂಬ' },
  { kn: 'ಲಿಂಗಾಯತ - ರೆಡ್ಡಿ' },
  { kn: 'ಲಿಂಗಾಯತ - ಸಾದರು' },
  { kn: 'ಲಿಂಗಾಯತ - ವೀರಶೈವ' },
  { kn: 'ಲಿಂಗಾಯತ' },
  { kn: 'ಲಿಂಗಾಯತ - ಇತರರು (ಗಾಣಿಗ, ಪಂಚಮಸಾಲಿ ಇತ್ಯಾದಿ)' },
  { kn: 'ಮಡಿವಾಳ' },
  { kn: 'ಮರಾಠ' },
  { kn: 'ಮುಸ್ಲಿಂ' }, 
  {kn: 'ಭಜಂತ್ರಿ'},
  {kn: 'ಬಂಟ್ಸ್'},
  { kn: 'ಸವಿತಾ ಸಮಾಜ' },
  { kn: 'SC - ಅದಿ ದ್ರಾವಿಡ / ಹೊಲೆಯ' },
  { kn: 'SC - ಅದಿ ಕರ್ನಾಟಕ / ಮಾದಿಗ' },
  { kn: 'SC - ಭೋವಿ / ವಡ್ಡರ್' },
  { kn: 'SC - ಲಂಬಾಣಿ / ಬಂಜಾರ' },
  { kn: 'SC - ಕೊರಮ' },
  { kn: 'SC - ಕೊರಚ' },
  { kn: 'SC - ಛಲವಾದಿ' },
  { kn: 'SC - ಬೇಡ/ಜಂಗಮ' },
  { kn: 'SC - ಇತರೆ' },
  { kn: 'ST - ವಾಲ್ಮೀಕಿ / ನಾಯಕ' },
  { kn: 'ST - ಮೇಧಾ' },
  { kn: 'ತಮಿಳು ಗೌಂಡರ್ / ತಿಗಳ' },
  { kn: 'ತೆಲುಗು' },
  { kn: 'ಉಪ್ಪಾರ' },
  { kn: 'ವಿಶ್ವಕರ್ಮ' },
  { kn: 'ಒಕ್ಕಲಿಗ - ಸರ್ಪ' },
  { kn: 'ಒಕ್ಕಲಿಗ - ತೆಲುಗು' },
  { kn: 'ಒಕ್ಕಲಿಗ - ಇತರರು' },
  { kn: 'ಇತರೆ' },
];

/* ── MODAL ── */
const Modal = ({
  title, onClose, children, wide,
}: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
  <div className={`bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-hidden flex flex-col`}>
  <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 flex-shrink-0">
  <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
  <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 text-white text-sm transition">✕</button>
  </div>
  <div className="overflow-y-auto flex-1 px-5 py-5">{children}</div>
  </div>
  </div>
);

/* ── SECTION HEADER ── */
const SectionHead = ({ icon, label, color }: { icon: string; label: string; color: string }) => (
  <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${color} flex items-center gap-1.5`}>
    <span>{icon}</span> {label}
  </p>
);

/* ── FIELD ── */
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="mb-3">
    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
      {label}{required && <span className="text-red-500 normal-case ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inp = 'w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-gray-300 dark:placeholder:text-gray-600';

/* ── STAT CARD ── */
const StatCard = ({ label, value, icon, from, to }: { label: string; value: number | string; icon: string; from: string; to: string }) => (
  <div className={`rounded-2xl p-2 flex items-center gap-3 shadow-sm bg-gradient-to-br ${from} ${to}`}>
    <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-xl flex-shrink-0">{icon}</div>
    <div className="min-w-0">
    <p className="text-xl font-extrabold text-white leading-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    <p className="text-[11px] text-white/80 mt-0.5 truncate">{label}</p>
    </div>
  </div>
);

/* ── CASTE BADGE ── */
const CasteBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
      {count} ಜಾತಿ
    </span>
  ) : <span className="text-gray-300 text-xs">—</span>;

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
const VillageManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: villages, loading } = useSelector(villageSelector);
  const gpList: GramaPanchayath[] = useSelector((s: RootState) => s.gramaPanchayath?.list || []);
  const gpLoading: boolean = useSelector((s: RootState) => s.gramaPanchayath?.loading || false);

  const [showForm, setShowForm]       = useState(false);
  const [showDetail, setShowDetail]   = useState<Village | null>(null);
  const [editing, setEditing]         = useState<Village | null>(null);
  const [form, setForm]               = useState<FormType>(defaultForm());
  const [search, setSearch]           = useState('');
  const [gpFilter, setGpFilter]       = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Village | null>(null);

  // ✅ FIX: casteRow now carries population, and every reset below includes it
  const [casteRow, setCasteRow] = useState<{ casteName: string; houseCount: string; population: string }>({
    casteName: '', houseCount: '', population: '',
  });

  // ✅ NEW: Caste-wise overall analysis popup (all villages combined)
  const [showCasteOverview, setShowCasteOverview] = useState(false);
  const [overviewCaste, setOverviewCaste] = useState('');

  if (!isAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-4xl">🔒</div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-700 dark:text-gray-200">Admin Access Only</p>
          <p className="text-sm text-gray-400 mt-1">ಈ ಪುಟ Admin ಮತ್ತು SuperAdmin ಗೆ ಮಾತ್ರ</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    dispatch(fetchAllVillages());
    dispatch(fetchAllGramaPanchayaths());
  }, [dispatch]);

  const gpMap = useMemo(() => {
    const m: Record<string, GramaPanchayath> = {};
    gpList.forEach((g) => { if (g._id) m[g._id] = g; });
    return m;
  }, [gpList]);

  const gpName = (v: Village): string => {
    if (typeof v.gramPanchayati === 'object' && v.gramPanchayati) {
      const gp = v.gramPanchayati as { name?: string; name_kn?: string; name_en?: string };
      return gp.name || gp.name_kn || gp.name_en || '—';
    }
    const gpId = (v.gramPanchayati as string) || v.gpId || '';
    return gpMap[gpId]?.name || '—';
  };

  // 🛠 FIX: this is the root cause of "missing" house totals. "ಒಟ್ಟು ಮನೆಗಳು" is a
  // separate manually-typed field from the caste-wise rows. If an admin fills in caste
  // details but leaves that top field blank/0, every house-count total on the page
  // (stat card, table rows, footer, detail view) used to show 0 — even though the caste
  // data is right there. This falls back to the caste-wise sum whenever the manual
  // total wasn't entered, so the count is never lost.
  const villageHouseCount = (v: Village): number => {
    if (v.totalHouses && v.totalHouses > 0) return v.totalHouses;
    return (v.casteDetails || []).reduce((s: number, c: CasteDetail) => s + (c.houseCount || 0), 0);
  };

  const filtered = useMemo(() => {
    return villages
      .filter((v: Village) => {
        const gpId =
          typeof v.gramPanchayati === 'object' && v.gramPanchayati
            ? (v.gramPanchayati as { _id: string })._id
            : (v.gramPanchayati as string) || v.gpId || '';

        return (
          (!gpFilter || gpId === gpFilter) &&
          (!search ||
            v.name.toLowerCase().includes(search.toLowerCase()))
        );
      })
      .sort((a: Village, b: Village) =>
        a.name.localeCompare(b.name, 'kn', {
          sensitivity: 'base',
        })
      );
  }, [villages, search, gpFilter]);

  const totalHouses = filtered.reduce((s: number, v: Village) => s + villageHouseCount(v), 0);
  const totalVoters = filtered.reduce((s: number, v: Village) => s + (v.totalVoters || 0), 0);
  // 🛠 FIX: this was never calculated before, so total population never showed up anywhere on the page
  const totalPopulation = filtered.reduce(
    (s: number, v: Village) => s + (v.casteDetails || []).reduce((cs: number, c: CasteDetail) => cs + (c.population || 0), 0),
    0
  );
  const casteTotalInForm = form.casteDetails.reduce((s: number, c: CasteDetail) => s + (c.houseCount || 0), 0);
  // ✅ NEW: population total for the form footer row
  const castePopTotalInForm = form.casteDetails.reduce((s: number, c: CasteDetail) => s + (c.population || 0), 0);
  // 🛠 FIX: "ಒಟ್ಟು ಮನೆಗಳು" is typed in manually, but the caste rows below have their own sum —
  // these two numbers used to silently drift apart with no warning. Flag it so admins can fix it.
  const houseCountMismatch = form.totalHouses > 0 && casteTotalInForm > 0 && form.totalHouses !== casteTotalInForm;

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm());
    setCasteRow({ casteName: '', houseCount: '', population: '' }); // ✅ FIX: was missing population
    setShowForm(true);
  };

  const openEdit = (v: Village) => {
    setEditing(v);
    const gpId =
      typeof v.gramPanchayati === 'object' && v.gramPanchayati !== null
        ? (v.gramPanchayati as { _id: string })._id
        : (v.gramPanchayati as string) || v.gpId || '';
    setForm({
      name: v.name || '',
      gpId,
      contactPersons: v.contactPersons?.length
        ? v.contactPersons.map((cp) => ({ name: cp.name || '', phones: cp.phones?.length ? [...cp.phones] : [''] }))
        : [{ name: '', phones: [''] }],
      totalHouses: v.totalHouses ?? 0,
      casteDetails: v.casteDetails ? v.casteDetails.map(c => ({ ...c })) : [],
      totalVoters: v.totalVoters ?? 0,
    });
    setCasteRow({ casteName: '', houseCount: '', population: '' }); // ✅ FIX: was missing population
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error('ಗ್ರಾಮದ ಹೆಸರು ಅಗತ್ಯ');
    if (!form.gpId)        return toast.error('ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಯ್ಕೆ ಮಾಡಿ');
    // 🛠 FIX: don't let a blank "ಒಟ್ಟು ಮನೆಗಳು" field save as 0 when caste rows already
    // have house counts — fall back to the caste-wise sum so the total is never lost.
    const enteredTotalHouses = Number(form.totalHouses) || 0;
    const finalTotalHouses = enteredTotalHouses > 0 ? enteredTotalHouses : casteTotalInForm;
    const payload: Village = {
      name: form.name.trim(),
      gpId: form.gpId,
      gramPanchayati: form.gpId,
      contactPersons: form.contactPersons.filter((cp) => cp.name.trim()).map((cp) => ({ name: cp.name.trim(), phones: cp.phones.filter(Boolean) })),
      totalHouses: finalTotalHouses,
      casteDetails: form.casteDetails,
      totalVoters: Number(form.totalVoters) || 0,
    };
    if (editing?._id) dispatch(updateVillage(editing._id, payload));
    else dispatch(createVillage(payload));
    setShowForm(false);
  };

  const updateCP = (idx: number, value: string) => setForm((f) => { const cps = [...f.contactPersons]; cps[idx] = { ...cps[idx], name: value }; return { ...f, contactPersons: cps }; });
  const addCP = () => setForm((f) => ({ ...f, contactPersons: [...f.contactPersons, { name: '', phones: [''] }] }));
  const removeCP = (idx: number) => setForm((f) => ({ ...f, contactPersons: f.contactPersons.filter((_, i) => i !== idx) }));
  const updatePhone = (cpIdx: number, phIdx: number, val: string) => setForm((f) => { const cps = [...f.contactPersons]; const phones = [...cps[cpIdx].phones]; phones[phIdx] = val; cps[cpIdx] = { ...cps[cpIdx], phones }; return { ...f, contactPersons: cps }; });
  const addPhone = (cpIdx: number) => setForm((f) => { const cps = [...f.contactPersons]; cps[cpIdx] = { ...cps[cpIdx], phones: [...cps[cpIdx].phones, ''] }; return { ...f, contactPersons: cps }; });
  const removePhone = (cpIdx: number, phIdx: number) => setForm((f) => { const cps = [...f.contactPersons]; cps[cpIdx] = { ...cps[cpIdx], phones: cps[cpIdx].phones.filter((_, i) => i !== phIdx) }; return { ...f, contactPersons: cps }; });

  const addCaste = () => {
    if (!casteRow.casteName.trim()) return toast.error('ಜಾತಿ ಹೆಸರು ನಮೂದಿಸಿ');
    if (form.casteDetails.some((c: CasteDetail) => c.casteName.toLowerCase() === casteRow.casteName.trim().toLowerCase()))
      return toast.error('ಈ ಜಾತಿ ಈಗಾಗಲೇ ಸೇರಿಸಲಾಗಿದೆ');
    const count = parseInt(casteRow.houseCount, 10);
    const pop = parseInt(casteRow.population, 10); // ✅ NEW
    setForm((f) => ({
      ...f,
      casteDetails: [
        ...f.casteDetails,
        {
          casteName: casteRow.casteName.trim(),
          houseCount: Number.isFinite(count) ? count : 0,
          population: Number.isFinite(pop) ? pop : 0, // ✅ NEW
        },
      ],
    }));
    setCasteRow({ casteName: '', houseCount: '', population: '' });
  };

  const updateCasteCount = (idx: number, raw: string) => setForm((f) => {
    const cd = [...f.casteDetails];
    const n = parseInt(raw, 10);
    cd[idx] = { ...cd[idx], houseCount: raw === '' ? 0 : (Number.isFinite(n) ? n : cd[idx].houseCount) };
    return { ...f, casteDetails: cd };
  });

  // ✅ NEW: this function was missing entirely — needed to edit population per row in the table
  const updateCastePopulation = (idx: number, raw: string) => setForm((f) => {
    const cd = [...f.casteDetails];
    const n = parseInt(raw, 10);
    cd[idx] = { ...cd[idx], population: raw === '' ? 0 : (Number.isFinite(n) ? n : cd[idx].population) };
    return { ...f, casteDetails: cd };
  });

  const removeCaste = (idx: number) => setForm((f) => ({ ...f, casteDetails: f.casteDetails.filter((_: CasteDetail, i: number) => i !== idx) }));

  // ✅ NEW: Aggregate caste data across ALL villages (houses + population + village count)
  const casteOverviewMap = useMemo(() => {
    const m: Record<string, { houseCount: number; population: number; villageCount: number }> = {};
    villages.forEach((v: Village) => {
      (v.casteDetails || []).forEach((cd: CasteDetail) => {
        if (!cd.casteName) return;
        if (!m[cd.casteName]) m[cd.casteName] = { houseCount: 0, population: 0, villageCount: 0 };
        m[cd.casteName].houseCount += cd.houseCount || 0;
        m[cd.casteName].population += cd.population || 0;
        m[cd.casteName].villageCount += 1;
      });
    });
    return m;
  }, [villages]);

  // 🛠 FIX: percentages were previously computed against the sum of only the caste-tagged
  // houses/population (grandTotalCasteHouses), which undercounts whenever a village's caste
  // rows don't add up to its real totalHouses. Use the REAL totals recorded on each village
  // as the denominator so "% of all houses" actually means all houses.
  const grandTotalHousesAll = useMemo(
    () => villages.reduce((s: number, v: Village) => s + villageHouseCount(v), 0),
    [villages]
  );
  // No village-level "total population" field exists yet, so population % is still measured
  // against the sum of population recorded across caste rows — kept, but labelled honestly below.
  const grandTotalCastePopulation = useMemo(
    () => Object.values(casteOverviewMap).reduce((s, c) => s + c.population, 0),
    [casteOverviewMap]
  );

  const overviewResult = overviewCaste ? casteOverviewMap[overviewCaste] : null;
  const overviewHousePct = overviewResult && grandTotalHousesAll > 0 ? (overviewResult.houseCount / grandTotalHousesAll) * 100 : 0;
  const overviewPopPct = overviewResult && grandTotalCastePopulation > 0 ? (overviewResult.population / grandTotalCastePopulation) * 100 : 0;

  /* ══════ RENDER ══════ */
  return (
    <div className="flex flex-col h-full min-h-0 gap-4">
      <PageBreadcrumb title="Village Management" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 flex-shrink-0">
        <StatCard label="ಒಟ್ಟು ಗ್ರಾಮಗಳು" value={filtered.length} icon="🏘️" from="from-blue-400" to="to-indigo-500 " />
        <StatCard label="ಒಟ್ಟು ಮನೆಗಳು" value={totalHouses} icon="🏠" from="from-emerald-400" to="to-teal-500" />
        <StatCard label="ಒಟ್ಟು ಮತದಾರರು" value={totalVoters} icon="🗳️" from="from-violet-400" to="to-purple-500" />
        {/* 🛠 NEW: this total was being tracked per-caste but never rolled up anywhere */}
        <StatCard label="ಒಟ್ಟು ಜನಸಂಖ್ಯೆ" value={totalPopulation} icon="👥" from="from-pink-400" to="to-rose-500" />
        <StatCard label="ಗ್ರಾ.ಪಂ ಸಂಖ್ಯೆ" value={gpList.length} icon="🏛️" from="from-amber-400" to="to-orange-500" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center flex-shrink-0">
        <div className="relative flex-1 min-w-[150px] max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input type="text" placeholder="ಗ್ರಾಮ ಹೆಸರು ಹುಡುಕಿ..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inp} pl-9`} />
        </div>
        <select value={gpFilter} onChange={(e) => setGpFilter(e.target.value)} className={`${inp} flex-1 min-w-[160px] max-w-xs`} disabled={gpLoading}>
          <option value="">{gpLoading ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : '🏛️ ಎಲ್ಲ ಗ್ರಾ.ಪಂ'}</option>
          {gpList.map((g: GramaPanchayath) => <option key={g._id} value={g._id}>{g.name}</option>)}
        </select>
        {(search || gpFilter) && (
          <button onClick={() => { setSearch(''); setGpFilter(''); }} className="px-2 py-1 rounded-xl border border-gray-200 dark:border-gray-600 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            ✕ ಎಲ್ಲ ತೋರಿಸಿ
          </button>
        )}
        {/* ✅ NEW: Caste-wise overall analysis button */}
        <button
          onClick={() => { setOverviewCaste(''); setShowCasteOverview(true); }}
          className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold transition shadow-md flex items-center gap-2 flex-shrink-0"
        >
          <span className="text-base leading-none">📊</span> ಜಾತಿ ವಿಶ್ಲೇಷಣೆ
        </button>
        <button onClick={openCreate} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold transition shadow-md flex items-center gap-2 flex-shrink-0">
          <span className="text-lg leading-none">+</span> ಹೊಸ ಗ್ರಾಮ
        </button>
      </div>

      {/* Table container — inner scroll */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-gray-400 py-20">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 text-gray-400 py-20">
              <span className="text-5xl">🏘️</span>
              <p className="text-sm font-semibold">ಯಾವುದೇ ಗ್ರಾಮ ಕಂಡುಬಂದಿಲ್ಲ</p>
              {(search || gpFilter) && <p className="text-xs opacity-60">ಫಿಲ್ಟರ್ ತೆಗೆದು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ</p>}
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((v: Village, i: number) => (
                  <div key={v._id} onClick={() => setShowDetail(v)} className="p-4 cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">#{i + 1}</span>
                          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm truncate">{v.name}</p>
                        </div>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-lg font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">🏛️ {gpName(v)}</span>
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openEdit(v)} className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-sm">✏️</button>
                        <button onClick={() => setConfirmDelete(v)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-sm">🗑️</button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <span>🏠 <strong className="text-emerald-600 dark:text-emerald-400">{villageHouseCount(v).toLocaleString()}</strong>{!v.totalHouses && villageHouseCount(v) > 0 && <span className="text-amber-500 ml-0.5" title="ಜಾತಿ ಮೊತ್ತದಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ">*</span>}</span>
                      <span>🗳️ <strong className="text-violet-600 dark:text-violet-400">{(v.totalVoters || 0).toLocaleString()}</strong></span>
                      <span className="ml-auto"><CasteBadge count={v.casteDetails?.length || 0} /></span>
                    </div>
                    {/* Mini caste bar preview on mobile */}
                    {(v.casteDetails || []).length > 0 && (() => {
                      const villageCasteTotal = v.casteDetails!.reduce((s, c) => s + c.houseCount, 0);
                      return (
                        <div className="mt-2 flex h-2 rounded-full overflow-hidden gap-px">
                          {v.casteDetails!.map((cd, ci) => {
                            const pct = villageCasteTotal > 0 ? (cd.houseCount / villageCasteTotal) * 100 : 0;
                            return <div key={ci} className={`${CASTE_COLORS[ci % CASTE_COLORS.length].bg} transition-all`} style={{ width: `${pct}%` }} title={cd.casteName} />;
                          })}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm min-w-[720px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gradient-to-r from-[#2466d1] to-cyan-500  text-white border-b border-gray-100 dark:border-gray-700">
                      <th className="px-4 py-3 text-left text-xs font-semibold w-10">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold w-10">ಗ್ರಾಮ ಹೆಸರು</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold ">ಗ್ರಾ.ಪಂ</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold ">ಮನೆ</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold ">ಮತದಾರ</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold ">ಜಾತಿ ವಿವರ</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold ">ಕ್ರಿಯೆ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {filtered.map((v: Village, i: number) => (
                      <tr key={v._id} onClick={() => setShowDetail(v)} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition cursor-pointer">
                        <td className="px-2 py-2 text-gray-400 text-xs font-mono">{i + 1}</td>
                        <td className="px-2 py-2 font-semibold text-gray-800 dark:text-gray-100">{v.name}</td>
                        <td className="px-2 py-2">
                          <span className="text-xs px-2 py-1 rounded-lg font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{gpName(v)}</span>
                        </td>
                        <td className="px-2 py-2 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          {villageHouseCount(v).toLocaleString()}
                          {!v.totalHouses && villageHouseCount(v) > 0 && <span className="text-amber-500 ml-0.5" title="ಜಾತಿ ಮೊತ್ತದಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ">*</span>}
                        </td>
                        <td className="px-2 py-2 text-center font-bold text-violet-600 dark:text-violet-400">{(v.totalVoters || 0).toLocaleString()}</td>
                        <td className="px-2 py-2 min-w-[160px]">
                          {(v.casteDetails || []).length > 0 ? (() => {
                            const villageCasteTotal = v.casteDetails!.reduce((s, c) => s + c.houseCount, 0);
                            return (
                            <div>
                              {/* Stacked colour bar */}
                              <div className="flex h-2.5 rounded-full overflow-hidden mb-1.5 gap-px">
                                {v.casteDetails!.map((cd, ci) => {
                                  const pct = villageCasteTotal > 0 ? (cd.houseCount / villageCasteTotal) * 100 : 0;
                                  return (
                                    <div
                                      key={ci}
                                      className={`${CASTE_COLORS[ci % CASTE_COLORS.length].bg}`}
                                      style={{ width: `${pct}%`, minWidth: pct > 0 ? '2px' : '0' }}
                                      title={`${cd.casteName}: ${cd.houseCount}`}
                                    />
                                  );
                                })}
                              </div>
                              {/* Caste chips — show up to 3, then "+N more" */}
                              <div className="flex flex-wrap gap-1">
                                {v.casteDetails!.slice(0, 3).map((cd, ci) => (
                                  <span key={ci} className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-semibold ${CASTE_COLORS[ci % CASTE_COLORS.length].light} ${CASTE_COLORS[ci % CASTE_COLORS.length].text}`}>
                                    {cd.casteName} <span className="opacity-70">({cd.houseCount})</span>
                                  </span>
                                ))}
                                {v.casteDetails!.length > 3 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold">+{v.casteDetails!.length - 3} ಇನ್ನೂ</span>
                                )}
                              </div>
                            </div>
                            );
                          })() : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => setShowDetail(v)} title="ವಿವರ" className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center text-sm transition">👁️</button>
                            <button onClick={() => openEdit(v)} title="ತಿದ್ದಿ" className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 flex items-center justify-center text-sm transition">✏️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {filtered?.length > 0 && (
                    <tfoot>
                      <tr className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-t-2 border-gray-200 dark:border-gray-600">
                        <td colSpan={3} className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400">ಒಟ್ಟು {filtered.length} ಗ್ರಾಮಗಳು</td>
                        <td className="px-4 py-3 text-center font-extrabold text-emerald-700 dark:text-emerald-400">{totalHouses.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center font-extrabold text-violet-700 dark:text-violet-400">{totalVoters.toLocaleString()}</td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
              {filtered.some((v: Village) => !v.totalHouses && villageHouseCount(v) > 0) && (
                <p className="text-[10px] text-amber-500 px-4 py-2 border-t border-amber-100 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
                  * ಈ ಗ್ರಾಮಗಳಿಗೆ ಒಟ್ಟು ಮನೆ ಸಂಖ್ಯೆ ನಮೂದಿಸಿಲ್ಲ — ಜಾತಿವಾರು ಮೊತ್ತದಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ. ತಿದ್ದಿ ಸರಿಪಡಿಸಿ.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ══════════ CREATE / EDIT MODAL ══════════ */}
      {showForm && (
        <Modal title={editing ? `✏️ ತಿದ್ದು — ${editing.name}` : '➕ ಹೊಸ ಗ್ರಾಮ ಸೇರಿಸಿ'} onClose={() => setShowForm(false)} wide>

          {/* Basic Info */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-4 mb-4">
            <SectionHead icon="📋" label="ಮೂಲ ಮಾಹಿತಿ" color="text-blue-600 dark:text-blue-400" />
            <Field label="ಗ್ರಾಮ ಹೆಸರು" required>
              <input className={inp} placeholder="ಗ್ರಾಮ ಹೆಸರು (ಕನ್ನಡ / English)" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </Field>
            <Field label="ಗ್ರಾಮ ಪಂಚಾಯತ್" required>
              <select className={inp} value={form.gpId} onChange={(e) => setForm((f) => ({ ...f, gpId: e.target.value }))} disabled={gpLoading}>
                <option value="">{gpLoading ? 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...' : '— ಆಯ್ಕೆ ಮಾಡಿ —'}</option>
                {gpList.map((g: GramaPanchayath) => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
            </Field>
          </div>

          {/* Houses & Voters */}
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 p-4 mb-4">
            <SectionHead icon="🏠" label="ಮನೆ ಹಾಗೂ ಮತದಾರ" color="text-emerald-600 dark:text-emerald-400" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="ಒಟ್ಟು ಮನೆಗಳು">
                <div className="flex gap-2">
                  <input type="number" min={0} className={inp} placeholder="0" value={form.totalHouses === 0 ? '' : form.totalHouses}
                    onChange={(e) => { const n = parseInt(e.target.value, 10); setForm((f) => ({ ...f, totalHouses: e.target.value === '' ? 0 : (Number.isFinite(n) ? n : f.totalHouses) })); }} />
                  {casteTotalInForm > 0 && form.totalHouses !== casteTotalInForm && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, totalHouses: casteTotalInForm }))}
                      title="ಜಾತಿವಾರು ಮೊತ್ತದಿಂದ ಭರ್ತಿ ಮಾಡಿ"
                      className="flex-shrink-0 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition"
                    >
                      ↺ {casteTotalInForm}
                    </button>
                  )}
                </div>
              </Field>
              <Field label="ಒಟ್ಟು ಮತದಾರರು">
                <input type="number" min={0} className={inp} placeholder="0" value={form.totalVoters === 0 ? '' : form.totalVoters}
                  onChange={(e) => { const n = parseInt(e.target.value, 10); setForm((f) => ({ ...f, totalVoters: e.target.value === '' ? 0 : (Number.isFinite(n) ? n : f.totalVoters) })); }} />
              </Field>
            </div>
          </div>

          {/* ── CASTE DETAILS — FIXED LAYOUT ── */}
          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <SectionHead icon="🏷️" label="ಜಾತಿವಾರು ಮನೆ ವಿವರ" color="text-amber-600 dark:text-amber-400" />
              {form.casteDetails.length > 0 && (
                <span className="text-[11px] font-bold text-amber-500">
                  ಜಾತಿ ಮೊತ್ತ: <span className="text-emerald-600">{casteTotalInForm.toLocaleString()}</span> ಮನೆ
                </span>
              )}
            </div>

            {/* 🛠 FIX: total houses (entered above) and the caste-wise sum used to be able to
                silently disagree with no indication to the admin — that mismatch is exactly what
                made the counts look "wrong" elsewhere on the page (bars, %, overview totals). */}
            {houseCountMismatch && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 mb-3">
                <span className="text-base leading-none">⚠️</span>
                <p className="text-xs text-red-600 dark:text-red-300 leading-snug">
                  ಒಟ್ಟು ಮನೆ ({form.totalHouses.toLocaleString()}) ಮತ್ತು ಜಾತಿವಾರು ಮೊತ್ತ ({casteTotalInForm.toLocaleString()}) ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಎರಡನ್ನೂ ಪರಿಶೀಲಿಸಿ.
                </p>
              </div>
            )}

            {/* INPUT CARD */}
            <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-amber-200 dark:border-amber-700 p-3 mb-3">
              <div className="flex flex-col md:flex-row gap-3 items-end flex-wrap">

                {/* Caste Name dropdown — responsive: full width on mobile, ~40% on desktop */}
                <div className="w-full md:w-[40%]">
                  <label className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                    ಜಾತಿ ಹೆಸರು
                  </label>
                  <select
                    className={`${inp} truncate`}
                    value={casteRow.casteName}
                    onChange={(e) =>
                      setCasteRow((c) => ({ ...c, casteName: e.target.value }))
                    }
                  >
                    <option value="">— ಜಾತಿ ಆಯ್ಕೆ ಮಾಡಿ —</option>
                    {CASTE_OPTIONS.map((c) => (
                      <option key={c.kn} value={c.kn}>
                        {c.kn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* House Count */}
                <div className="w-[48%] md:w-[25%]">
                  <label className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                    ಮನೆ ಸಂಖ್ಯೆ
                  </label>
                  <input
                    type="number"
                    min={0}
                    className={inp}
                    placeholder="0"
                    value={casteRow.houseCount}
                    onChange={(e) =>
                      setCasteRow((c) => ({ ...c, houseCount: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCaste();
                      }
                    }}
                  />
                </div>

                {/* Population — NEW */}
                <div className="w-[48%] md:w-[25%]">
                  <label className="block text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-1">
                    ಜನಸಂಖ್ಯೆ
                  </label>
                  <input
                    type="number"
                    min={0}
                    className={inp}
                    placeholder="0"
                    value={casteRow.population}
                    onChange={(e) =>
                      setCasteRow((c) => ({ ...c, population: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCaste();
                      }
                    }}
                  />
                </div>

                {/* Button */}
                <button
                  onClick={addCaste}
                  className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-bold transition flex-shrink-0 shadow-sm"
                >
                  + ಸೇರಿಸಿ
                </button>

              </div>
            </div>

            {/* Caste list */}
            {form.casteDetails.length > 0 ? (
              <div>
                {/* Colour bar preview */}
                <div className="flex h-3 rounded-full overflow-hidden mb-3 gap-px shadow-inner">
                  {form.casteDetails.map((cd, ci) => {
                    const pct = casteTotalInForm > 0 ? (cd.houseCount / casteTotalInForm) * 100 : 0;
                    return (
                      <div key={ci} className={`${CASTE_COLORS[ci % CASTE_COLORS.length].bg} transition-all`} style={{ width: `${pct}%`, minWidth: pct > 0 ? '3px' : '0' }} title={`${cd.casteName}: ${cd.houseCount}`} />
                    );
                  })}
                </div>
                <div className="rounded-xl overflow-hidden border border-amber-200 dark:border-amber-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-100 dark:bg-amber-900/30">
                        <th className="px-3 py-2 text-left text-[11px] font-bold text-amber-700 dark:text-amber-300 w-8">#</th>
                        <th className="px-3 py-2 text-left text-[11px] font-bold text-amber-700 dark:text-amber-300">ಜಾತಿ ಹೆಸರು</th>
                        <th className="px-3 py-2 text-center text-[11px] font-bold text-amber-700 dark:text-amber-300">ಮನೆ ಸಂ.</th>
                        <th className="px-3 py-2 text-center text-[11px] font-bold text-amber-700 dark:text-amber-300">ಜನಸಂಖ್ಯೆ</th>
                        <th className="px-3 py-2 text-right text-[11px] font-bold text-amber-700 dark:text-amber-300">%</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100 dark:divide-amber-800">
                      {form.casteDetails.map((cd: CasteDetail, idx: number) => {
                        const pct = casteTotalInForm > 0 ? ((cd.houseCount / casteTotalInForm) * 100) : 0;
                        const col = CASTE_COLORS[idx % CASTE_COLORS.length];
                        return (
                          <tr key={idx} className="bg-white dark:bg-gray-900/60">
                            <td className="px-3 py-2.5">
                              <span className={`inline-block w-5 h-5 rounded ${col.bg} opacity-80`} />
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-gray-700 dark:text-gray-200">{cd.casteName}</td>
                            <td className="px-3 py-2.5 text-center">
                              <input
                                type="number" min={0}
                                value={cd.houseCount === 0 ? '' : cd.houseCount}
                                onChange={(e) => updateCasteCount(idx, e.target.value)}
                                placeholder="0"
                                className="w-20 text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <input
                                type="number" min={0}
                                value={cd.population === 0 || cd.population === undefined ? '' : cd.population}
                                onChange={(e) => updateCastePopulation(idx, e.target.value)}
                                placeholder="0"
                                className="w-20 text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-sm font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${col.bg} rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-gray-500 w-10 text-right">{pct.toFixed(1)}%</span>
                              </div>
                            </td>
                            <td className="px-2 py-2.5">
                              <button onClick={() => removeCaste(idx)} className="w-6 h-6 rounded-full bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-400 hover:text-red-600 flex items-center justify-center text-xs transition">✕</button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-amber-50 dark:bg-amber-900/20">
                        <td colSpan={2} className="px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300">ಒಟ್ಟು</td>
                        <td className="px-3 py-2 text-center font-extrabold text-emerald-600">{casteTotalInForm.toLocaleString()}</td>
                        <td className="px-3 py-2 text-center font-extrabold text-blue-600">{castePopTotalInForm.toLocaleString()}</td>
                        <td colSpan={2} className="px-3 py-2 text-right text-xs font-bold text-amber-600">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-xl py-2 text-center">
                <p className="text-3xl mb-2">🏷️</p>
                <p className="text-xs text-gray-400">ಮೇಲೆ ಜಾತಿ ಹೆಸರು ಮತ್ತು ಮನೆ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ</p>
                <p className="text-[10px] text-gray-300 mt-0.5">+ ಸೇರಿಸಿ ಒತ್ತಿ ಅಥವಾ Enter ಒತ್ತಿ</p>
              </div>
            )}
          </div>

          {/* Contact Persons */}
          {/* <div className="rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <SectionHead icon="📞" label="ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು" color="text-violet-600 dark:text-violet-400" />
              <button onClick={addCP} className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400 font-bold">+ ಸಂಪರ್ಕ ಸೇರಿಸಿ</button>
            </div>
            <div className="space-y-3">
              {form.contactPersons.map((cp, cpIdx) => (
                <div key={cpIdx} className="rounded-xl border border-violet-100 dark:border-violet-800 bg-white dark:bg-gray-900/50 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-violet-500">ಸಂಪರ್ಕ {cpIdx + 1}</span>
                    {form.contactPersons.length > 1 && <button onClick={() => removeCP(cpIdx)} className="text-xs text-red-400 hover:text-red-600 font-semibold">ತೆಗೆ</button>}
                  </div>
                  <input className={`${inp} mb-2`} placeholder="ಹೆಸರು" value={cp.name} onChange={(e) => updateCP(cpIdx, e.target.value)} />
                  {cp.phones.map((ph, phIdx) => (
                    <div key={phIdx} className="flex gap-2 mb-1.5">
                      <input className={`${inp} flex-1`} placeholder={`📞 ಫೋನ್ ${phIdx + 1}`} value={ph} onChange={(e) => updatePhone(cpIdx, phIdx, e.target.value)} />
                      {cp.phones.length > 1 && <button onClick={() => removePhone(cpIdx, phIdx)} className="w-9 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-500 text-sm transition">✕</button>}
                    </div>
                  ))}
                  <button onClick={() => addPhone(cpIdx)} className="text-xs text-blue-500 hover:underline">+ ಫೋನ್ ಸೇರಿಸಿ</button>
                </div>
              ))}
            </div>
          </div> */}

          {/* Actions */}
          <div className="flex gap-3 pb-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">ರದ್ದು</button>
            <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold transition shadow-md">
              {editing ? '✅ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ' : '✅ ಗ್ರಾಮ ಸೇರಿಸಿ'}
            </button>
          </div>
        </Modal>
      )}

      {/* ══════════ DETAIL MODAL ══════════ */}
      {showDetail && (
        <Modal title={`📊 ${showDetail.name} — ವಿವರ`} onClose={() => setShowDetail(null)} wide>

          {/* GP badge */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 mb-4">
            <span className="text-2xl">🏛️</span>
            <div>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">ಗ್ರಾಮ ಪಂಚಾಯತ್</p>
              <p className="font-bold text-gray-800 dark:text-gray-100">{gpName(showDetail)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 p-4 text-center">
              <p className="text-3xl font-extrabold text-emerald-600">{villageHouseCount(showDetail).toLocaleString()}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-semibold">
                🏠 ಒಟ್ಟು ಮನೆಗಳು
                {!showDetail.totalHouses && villageHouseCount(showDetail) > 0 && (
                  <span className="block text-[10px] text-amber-500 font-normal normal-case mt-0.5">(ಜಾತಿ ಮೊತ್ತದಿಂದ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ)</span>
                )}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-100 dark:border-violet-800 p-4 text-center">
              <p className="text-3xl font-extrabold text-violet-600">{(showDetail.totalVoters || 0).toLocaleString()}</p>
              <p className="text-xs text-violet-700 dark:text-violet-300 mt-1 font-semibold">🗳️ ಒಟ್ಟು ಮತದಾರರು</p>
            </div>
          </div>

          {/* CASTE BREAKDOWN — rich detail view */}
          {(showDetail.casteDetails || []).length > 0 && (() => {
            const total = showDetail.casteDetails!.reduce((s: number, c: CasteDetail) => s + c.houseCount, 0);
            const totalPop = showDetail.casteDetails!.reduce((s: number, c: CasteDetail) => s + (c.population || 0), 0);
            return (
              <div className="mb-4">
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3">🏷️ ಜಾತಿವಾರು ಮನೆ ವಿವರ</p>

                {/* Full-width stacked bar */}
                <div className="flex h-5 rounded-xl overflow-hidden mb-1 shadow-inner gap-px">
                  {showDetail.casteDetails!.map((cd: CasteDetail, ci: number) => {
                    const pct = total > 0 ? (cd.houseCount / total) * 100 : 0;
                    return (
                      <div
                        key={ci}
                        className={`${CASTE_COLORS[ci % CASTE_COLORS.length].bg} flex items-center justify-center transition-all`}
                        style={{ width: `${pct}%`, minWidth: pct > 0 ? '4px' : '0' }}
                        title={`${cd.casteName}: ${cd.houseCount} (${pct.toFixed(1)}%)`}
                      >
                        {pct > 8 && <span className="text-[9px] font-bold text-white truncate px-1">{pct.toFixed(0)}%</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {showDetail.casteDetails!.map((cd: CasteDetail, ci: number) => {
                    const col = CASTE_COLORS[ci % CASTE_COLORS.length];
                    const pct = total > 0 ? ((cd.houseCount / total) * 100).toFixed(1) : '0';
                    return (
                      <span key={ci} className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-semibold ${col.light} ${col.text}`}>
                        <span className={`w-2 h-2 rounded-full ${col.bg} inline-block flex-shrink-0`} />
                        {cd.casteName} — {cd.houseCount} ({pct}%)
                      </span>
                    );
                  })}
                </div>

                {/* Detail table */}
                <div className="rounded-xl overflow-hidden border border-amber-100 dark:border-amber-700">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-50 dark:bg-amber-900/30">
                        <th className="px-3 py-2 text-left text-[11px] font-bold text-amber-600 dark:text-amber-300 w-8"></th>
                        <th className="px-3 py-2 text-left text-[11px] font-bold text-amber-600 dark:text-amber-300">ಜಾತಿ</th>
                        <th className="px-3 py-2 text-right text-[11px] font-bold text-amber-600 dark:text-amber-300">ಮನೆ</th>
                        <th className="px-3 py-2 text-right text-[11px] font-bold text-amber-600 dark:text-amber-300">ಜನಸಂಖ್ಯೆ</th>
                        <th className="px-3 py-2 text-right text-[11px] font-bold text-amber-600 dark:text-amber-300">ಪ್ರಮಾಣ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50 dark:divide-amber-800/50">
                      {showDetail.casteDetails!.map((cd: CasteDetail, i: number) => {
                        const pct = total > 0 ? ((cd.houseCount / total) * 100) : 0;
                        const col = CASTE_COLORS[i % CASTE_COLORS.length];
                        return (
                          <tr key={i} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition">
                            <td className="px-3 py-2.5">
                              <span className={`inline-block w-4 h-4 rounded ${col.bg}`} />
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-gray-700 dark:text-gray-200">{cd.casteName}</td>
                            <td className="px-3 py-2.5 text-right font-bold text-emerald-600">{cd.houseCount.toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-right font-bold text-blue-600">{(cd.population || 0).toLocaleString()}</td>
                            <td className="px-3 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div className={`h-full ${col.bg} rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-gray-500 w-12 text-right">{pct.toFixed(1)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-amber-50 dark:bg-amber-900/20 font-bold">
                        <td colSpan={2} className="px-3 py-2.5 text-xs text-amber-700 dark:text-amber-300">ಒಟ್ಟು</td>
                        <td className="px-3 py-2.5 text-right text-emerald-600">{total.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-blue-600">{totalPop.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-right text-xs text-amber-600">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* No caste data */}
          {(showDetail.casteDetails || []).length === 0 && (
            <div className="mb-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-5 text-center">
              <p className="text-xs text-gray-400">ಜಾತಿ ವಿವರ ದಾಖಲಾಗಿಲ್ಲ</p>
            </div>
          )}

          {/* Contact Persons */}
          {/* {(showDetail.contactPersons || []).filter((cp) => cp.name).length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-2">📞 ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು</p>
              <div className="space-y-2">
                {showDetail.contactPersons!.filter((cp) => cp.name).map((cp, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-violet-100 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-sm font-bold text-violet-600 flex-shrink-0">
                      {cp.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{cp.name}</p>
                      {cp.phones?.filter(Boolean).map((ph, pi) => (
                        <a key={pi} href={`tel:${ph}`} className="block text-xs text-blue-500 hover:underline">📞 {ph}</a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          <button
            onClick={() => { openEdit(showDetail); setShowDetail(null); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold transition shadow-md"
          >
            ✏️ ಈ ಗ್ರಾಮ ತಿದ್ದಿ
          </button>
        </Modal>
      )}

      {/* ══════════ CASTE-WISE OVERALL ANALYSIS MODAL ══════════ */}
      {showCasteOverview && (
        <Modal title="📊 ಜಾತಿವಾರು ಒಟ್ಟು ವಿಶ್ಲೇಷಣೆ" onClose={() => setShowCasteOverview(false)}>

          <div className="rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 p-4 mb-4">
            <SectionHead icon="🏷️" label="ಜಾತಿ ಆಯ್ಕೆ ಮಾಡಿ" color="text-amber-600 dark:text-amber-400" />
            <select
              className={inp}
              value={overviewCaste}
              onChange={(e) => setOverviewCaste(e.target.value)}
            >
              <option value="">— ಜಾತಿ ಆಯ್ಕೆ ಮಾಡಿ —</option>
              {CASTE_OPTIONS.map((c) => (
                <option key={c.kn} value={c.kn}>{c.kn}</option>
              ))}
            </select>
          </div>

          {!overviewCaste && (
            <div className="border-2 border-dashed border-amber-200 dark:border-amber-700 rounded-xl py-8 text-center">
              <p className="text-3xl mb-2">🏷️</p>
              <p className="text-xs text-gray-400">ವಿಶ್ಲೇಷಣೆ ನೋಡಲು ಮೇಲೆ ಒಂದು ಜಾತಿ ಆಯ್ಕೆ ಮಾಡಿ</p>
            </div>
          )}

          {overviewCaste && !overviewResult && (
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl py-8 text-center">
              <p className="text-3xl mb-2">😕</p>
              <p className="text-xs text-gray-400">ಈ ಜಾತಿಗೆ ಯಾವುದೇ ಗ್ರಾಮದಲ್ಲಿ ದಾಖಲೆ ಇಲ್ಲ</p>
            </div>
          )}

          {overviewCaste && overviewResult && (
            <div className="space-y-3">
              <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-center shadow-md">
                <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-1">ಆಯ್ಕೆ ಮಾಡಿದ ಜಾತಿ</p>
                <p className="text-white font-extrabold text-lg">{overviewCaste}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800 p-4 text-center">
                  <p className="text-2xl font-extrabold text-emerald-600">{overviewResult.houseCount.toLocaleString()}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-semibold">🏠 ಒಟ್ಟು ಮನೆಗಳು</p>
                  <p className="text-[11px] text-emerald-500 mt-0.5">{overviewHousePct.toFixed(1)}% ಎಲ್ಲಾ ಗ್ರಾಮಗಳ ಒಟ್ಟು ಮನೆಗಳಲ್ಲಿ</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-100 dark:border-blue-800 p-4 text-center">
                  <p className="text-2xl font-extrabold text-blue-600">{overviewResult.population.toLocaleString()}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 font-semibold">👥 ಒಟ್ಟು ಜನಸಂಖ್ಯೆ</p>
                  <p className="text-[11px] text-blue-500 mt-0.5">{overviewPopPct.toFixed(1)}% ಜಾತಿ ದಾಖಲಾದ ಜನಸಂಖ್ಯೆಯಲ್ಲಿ</p>
                </div>
              </div>

              {/* Percentage bars */}
              <div className="rounded-xl border border-amber-100 dark:border-amber-700 bg-white dark:bg-gray-900/50 p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">ಮನೆ ಪ್ರಮಾಣ</span>
                    <span className="text-xs font-bold text-emerald-600">{overviewHousePct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${overviewHousePct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">ಜನಸಂಖ್ಯೆ ಪ್ರಮಾಣ</span>
                    <span className="text-xs font-bold text-blue-600">{overviewPopPct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${overviewPopPct}%` }} />
                  </div>
                </div>
              </div>

              <p className="text-center text-[11px] text-gray-400">
                📍 {overviewResult.villageCount} ಗ್ರಾಮಗಳಲ್ಲಿ ಈ ಜಾತಿ ದಾಖಲಾಗಿದೆ · ಎಲ್ಲಾ {villages.length} ಗ್ರಾಮಗಳ ಆಧಾರದ ಮೇಲೆ ಲೆಕ್ಕ ಹಾಕಲಾಗಿದೆ
              </p>
            </div>
          )}
        </Modal>
      )}

      {/* ══════════ DELETE CONFIRM ══════════ */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
            <p className="font-bold text-gray-800 dark:text-gray-100 text-base mb-1">ಅಳಿಸಬೇಕೆ?</p>
            <p className="text-sm text-gray-500 mb-5">
              <strong className="text-gray-700 dark:text-gray-200">{confirmDelete.name}</strong> ಅನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-semibold">ರದ್ದು</button>
              <button
                onClick={() => {
                  const gpId =
                    typeof confirmDelete.gramPanchayati === 'object' && confirmDelete.gramPanchayati
                      ? (confirmDelete.gramPanchayati as { _id: string })._id
                      : (confirmDelete.gramPanchayati as string) || confirmDelete.gpId || '';
                  dispatch(deleteVillage(confirmDelete._id!, gpId));
                  setConfirmDelete(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition"
              >
                🗑️ ಹ್ಯಾಂ, ಅಳಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VillageManagement;