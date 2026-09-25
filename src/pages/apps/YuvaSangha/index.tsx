import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import {
  yuvaSanghaSelector, YuvaSangha,
  fetchYuvaSanghas, createYuvaSangha, updateYuvaSangha, deleteYuvaSangha,
} from '../../../api/yuvaSangha';
import { fetchAllGramaPanchayaths, gramaPanchayathSelector } from '../../../api/gramapanchayath';
import MembersPage from './MembersModal';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUsers, FaSearch, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';

const TARIKERE_PURASABHA_ID = '69a9303f2e0f1228f681877b';
const AJJAMPURA_PATANA_ID   = '69a9305c2e0f1228f681877d';
const BG = { background: 'linear-gradient(135deg, #2466d1, #06b6d4)' };

const AREA_CARDS = [
  { taluk: 'tarikere',  areaType: 'purasabha',      label: 'ತರೀಕೆರೆ ಪುರಸಭೆ',           color: 'from-violet-500 to-purple-600', icon: '🏛️', patanaId: TARIKERE_PURASABHA_ID },
  { taluk: 'tarikere',  areaType: 'gramapanchayath', label: 'ತರೀಕೆರೆ ತಾಲ್ಲೂಕು',         color: 'from-green-500 to-emerald-600', icon: '🌿', patanaId: null },
  { taluk: 'ajjampura', areaType: 'patana',          label: 'ಅಜ್ಜಂಪುರ ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ', color: 'from-orange-500 to-amber-600',  icon: '🏘️', patanaId: AJJAMPURA_PATANA_ID },
  { taluk: 'ajjampura', areaType: 'gramapanchayath', label: 'ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು',       color: 'from-blue-500 to-cyan-600',     icon: '🌾', patanaId: null },
] as const;

type AreaCard = typeof AREA_CARDS[number];

function MultiWardPicker({ wards, selectedIds, usedIds, onChange, color }: {
  wards: any[]; selectedIds: string[]; usedIds: string[];
  onChange: (ids: string[]) => void; color: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  const selectedNames = wards.filter(w => selectedIds.includes(String(w._id))).map(w => w.name).join(', ');
  const available = wards.filter(w => !usedIds.includes(String(w._id)) || selectedIds.includes(String(w._id)));

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex justify-between items-center bg-white focus:outline-none focus:border-blue-400">
        <span className={`truncate font-medium ${selectedIds.length ? 'text-gray-800' : 'text-gray-400'}`}>
          {selectedIds.length ? selectedNames : '-- ವಾರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ --'}
        </span>
        <span className="ml-2 text-gray-400 flex-shrink-0">
          {open ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
          {wards.length === 0 && <div className="px-4 py-3 text-sm text-gray-400">ವಾರ್ಡ್ ಡೇಟಾ ಇಲ್ಲ</div>}
          {available.length === 0 && wards.length > 0 && <div className="px-4 py-3 text-sm text-amber-500 font-medium">ಎಲ್ಲಾ ವಾರ್ಡ್ ಗಳಿಗೆ ಸಂಘ ನೋಂದಣಿ ಆಗಿದೆ</div>}
          {available.map(w => {
            const sel = selectedIds.includes(String(w._id));
            return (
              <div key={w._id} onClick={() => toggle(String(w._id))}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition ${sel ? 'bg-blue-50' : 'hover:bg-blue-50'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition ${sel ? `bg-gradient-to-br ${color} border-transparent` : 'border-gray-300 bg-white'}`}>
                  {sel && <FaCheck size={9} className="text-white" />}
                </div>
                <span className={`font-medium ${sel ? 'text-blue-700' : 'text-gray-700'}`}>{w.name}</span>
              </div>
            );
          })}
        </div>
      )}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {wards.filter(w => selectedIds.includes(String(w._id))).map(w => (
            <span key={w._id} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${color} text-white`}>
              {w.name}
              <button onClick={() => toggle(String(w._id))} className="hover:opacity-70"><FaTimes size={8} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SanghaFormModal({ open, onClose, editSangha, card, refetch, allWards, allGPs }: {
  open: boolean; onClose: () => void; editSangha: YuvaSangha | null;
  card: AreaCard; refetch: object; allWards: any[]; allGPs: any[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { list } = useSelector(yuvaSanghaSelector);
  const isGp = card.areaType === 'gramapanchayath';

  const [name,    setName]    = useState('');
  const [remark,  setRemark]  = useState('');
  const [gpId,    setGpId]    = useState('');
  const [wardIds, setWardIds] = useState<string[]>([]);

  const usedWardIds = useMemo(() =>
    list.filter(s => s.taluk === card.taluk && s.areaType === card.areaType && s._id !== editSangha?._id)
      .flatMap(s => s.wardIds || (s.wardId ? [s.wardId] : [])).filter(Boolean).map(String) as string[],
    [list, card, editSangha]);

  const usedGpIds = useMemo(() =>
    list.filter(s => s.taluk === card.taluk && s.areaType === card.areaType && s._id !== editSangha?._id)
      .map(s => s.gpId).filter(Boolean).map(String) as string[],
    [list, card, editSangha]);

  useEffect(() => {
    if (!open) return;
    if (editSangha) {
      setName(editSangha.name || ''); setRemark(editSangha.remark || '');
      setGpId(editSangha.gpId || '');
      setWardIds((editSangha.wardIds || (editSangha.wardId ? [editSangha.wardId] : [])).map(String));
    } else { setName(''); setRemark(''); setGpId(''); setWardIds([]); }
  }, [open, editSangha]);

  if (!open) return null;

  const canSave = name.trim() && (isGp ? !!gpId : wardIds.length > 0);
  const availableGPs = allGPs.filter(g => !g.taluk || g.taluk === card.taluk).filter(g => !usedGpIds.includes(String(g._id)));

  const save = () => {
    if (!canSave) return;
    const locationName = isGp
      ? allGPs.find(g => String(g._id) === String(gpId))?.name || ''
      : allWards.filter(w => wardIds.includes(String(w._id))).map(w => w.name).join(', ');
    const payload: any = {
      name: name.trim(), remark, taluk: card.taluk, areaType: card.areaType, locationName,
      gpId: isGp ? gpId : null,
      wardId: !isGp && wardIds.length === 1 ? wardIds[0] : null,
      wardIds: !isGp ? wardIds : [], patanaId: null,
    };
    if (editSangha?._id) dispatch(updateYuvaSangha(editSangha._id, payload, refetch));
    else dispatch(createYuvaSangha(payload, refetch));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 rounded-t-3xl sm:rounded-t-2xl flex items-center justify-between flex-shrink-0" style={BG}>
          <div>
            <p className="text-white font-black text-sm">{editSangha ? 'ಸಂಘ ಬದಲಾಯಿಸಿ' : 'ಹೊಸ ಯುವ ಸಂಘ ನೋಂದಣಿ'}</p>
            <p className="text-white/70 text-xs">{card.label}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
            <FaTimes size={13} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isGp ? (
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಯ್ಕೆ ಮಾಡಿ *</label>
              <select value={gpId} onChange={e => setGpId(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 bg-white font-medium">
                <option value="">-- ಗ್ರಾಮ ಪಂಚಾಯತ್ ಆಯ್ಕೆ ಮಾಡಿ --</option>
                {availableGPs.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
              </select>
              {availableGPs.length === 0 && <p className="text-xs text-amber-600 mt-1">ಎಲ್ಲಾ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಗಳಿಗೆ ಸಂಘ ನೋಂದಣಿ ಆಗಿದೆ</p>}
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5">ವಾರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ *</label>
              <MultiWardPicker wards={allWards} selectedIds={wardIds} usedIds={usedWardIds} onChange={setWardIds} color={card.color} />
            </div>
          )}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">ಸಂಘದ ಹೆಸರು *</label>
            <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="ಸಂಘದ ಹೆಸರು ನಮೂದಿಸಿ"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 font-medium" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1.5">ಟಿಪ್ಪಣಿ</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="ಟಿಪ್ಪಣಿ..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 resize-none" />
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-6 pt-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-600">ರದ್ದು</button>
          <button onClick={save} disabled={!canSave}
            className="flex-1 py-3 rounded-xl text-white text-sm font-black shadow-lg hover:opacity-90 disabled:opacity-40"
            style={BG}>
            {editSangha ? 'ಉಳಿಸಿ' : 'ನೋಂದಣಿ ಮಾಡಿ'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ExpandedSection({ card, onViewMembers, allWards, allGPs }: {
  card: AreaCard; onViewMembers: (s: YuvaSangha) => void; allWards: any[]; allGPs: any[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { list } = useSelector(yuvaSanghaSelector);

  const [search,     setSearch]     = useState('');
  const [formOpen,   setFormOpen]   = useState(false);
  const [editSangha, setEditSangha] = useState<YuvaSangha | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);

  const refetch  = useMemo(() => ({ taluk: card.taluk, areaType: card.areaType }), [card]);
  const isGp     = card.areaType === 'gramapanchayath';
  const talukGPs = useMemo(() => allGPs.filter(g => !g.taluk || g.taluk === card.taluk), [allGPs, card.taluk]);

  useEffect(() => { dispatch(fetchYuvaSanghas(refetch)); }, [card.taluk, card.areaType]);

  const sanghas = useMemo(() => list.filter(s => s.taluk === card.taluk && s.areaType === card.areaType), [list, card]);

  const filtered = useMemo(() => {
    if (!search) return sanghas;
    const q = search.toLowerCase();
    return sanghas.filter(s => s.name.toLowerCase().includes(q) || (s.locationName || '').toLowerCase().includes(q));
  }, [sanghas, search]);

  const usedWardIds = useMemo(() => sanghas.flatMap(s => s.wardIds || (s.wardId ? [s.wardId] : [])).filter(Boolean).map(String) as string[], [sanghas]);
  const usedGpIds   = useMemo(() => sanghas.map(s => s.gpId).filter(Boolean).map(String) as string[], [sanghas]);

  const totalOptions = isGp ? talukGPs.length : allWards.length;
  const canAdd = isGp
    ? talukGPs.some(g => !usedGpIds.includes(String(g._id)))
    : allWards.some(w => !usedWardIds.includes(String(w._id)));

  const areaLbl = isGp ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್' : 'ವಾರ್ಡ್';

  return (
    <div className="border border-gray-200 rounded-b-2xl shadow-sm bg-white flex flex-col" style={{ maxHeight: '55vh' }}>

      {/* Stats */}
      <div className="flex items-center gap-3 px-3 py-2 bg-white border-b text-xs text-gray-500 flex-shrink-0">
        <span className="font-semibold text-gray-700">{sanghas.length} ನೋಂದಣಿ</span>
        {totalOptions > 0 && (
          <>
            <span className="text-gray-300">|</span>
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all`}
                style={{ width: `${Math.min((sanghas.length / totalOptions) * 100, 100)}%` }} />
            </div>
            <span className="font-medium">{Math.min(Math.round((sanghas.length / totalOptions) * 100), 100)}%</span>
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5">
          <FaSearch className="text-gray-400 flex-shrink-0" size={10} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ಸಂಘ ಹುಡುಕಿ..."
            className="flex-1 text-xs focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent min-w-0" />
          {search && <button onClick={() => setSearch('')}><FaTimes size={9} className="text-gray-400" /></button>}
        </div>
        <button onClick={() => { setEditSangha(null); setFormOpen(true); }} disabled={!canAdd}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex-shrink-0 ${!canAdd ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white hover:opacity-90'}`}
          style={canAdd ? BG : {}}>
          <FaPlus size={9} /> ಸೇರಿಸಿ
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <FaUsers size={28} className="text-gray-200" />
            <p className="text-xs">{search ? `"${search}" ಕಂಡುಬಂದಿಲ್ಲ` : 'ಇನ್ನೂ ಯಾವ ಸಂಘವೂ ನೋಂದಣಿ ಆಗಿಲ್ಲ'}</p>
            {canAdd && !search && (
              <button onClick={() => { setEditSangha(null); setFormOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition" style={BG}>
                <FaPlus size={10} /> ಮೊದಲ ಸಂಘ ನೋಂದಣಿ ಮಾಡಿ
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((s, idx) => (
              <div key={s._id}
                className={`flex items-center gap-2.5 px-3 py-2.5 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-black" style={BG}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                  {s.locationName && <p className="text-[10px] text-gray-400 truncate">{areaLbl}: {s.locationName}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onViewMembers(s)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-white text-xs font-bold hover:opacity-90 transition" style={BG}>
                    <FaUsers size={9} /><span className="hidden sm:inline">ಸದಸ್ಯರು</span>
                  </button>
                  <button onClick={() => { setEditSangha(s); setFormOpen(true); }} className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition">
                    <FaEdit size={10} />
                  </button>
                  <button onClick={() => setDeleteId(s._id!)} className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition">
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {formOpen && (
        <SanghaFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditSangha(null); }}
          editSangha={editSangha} card={card} refetch={refetch} allWards={allWards} allGPs={talukGPs} />
      )}

      {deleteId && (() => {
        const s = sanghas.find(x => x._id === deleteId);
        return s ? (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5 text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-black text-sm text-gray-800 mb-1">ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h3>
              <p className="text-xs font-bold text-gray-700 mb-1">{s.name}</p>
              {s.locationName && <p className="text-[10px] text-gray-400 mb-4">{s.locationName}</p>}
              <div className="flex gap-2">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl bg-gray-100 text-xs font-bold">ರದ್ದು</button>
                <button onClick={() => { dispatch(deleteYuvaSangha(s._id!, refetch)); setDeleteId(null); }}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-black hover:bg-red-700">ಅಳಿಸಿ</button>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}

export default function YuvaSanghaPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list }         = useSelector(yuvaSanghaSelector);
  const { list: gpList } = useSelector(gramaPanchayathSelector) as { list: any[] };

  const [openKey,    setOpenKey]    = useState<string | null>(null);
  const [membersFor, setMembersFor] = useState<YuvaSangha | null>(null);
  const [wardList,   setWardList]   = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    AREA_CARDS.forEach(c => dispatch(fetchYuvaSanghas({ taluk: c.taluk, areaType: c.areaType })));
    dispatch(fetchAllGramaPanchayaths());
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    Promise.all([
      fetch(`${API_URL}/ward/panchayatipatana/${TARIKERE_PURASABHA_ID}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/ward/panchayatipatana/${AJJAMPURA_PATANA_ID}`,   { headers }).then(r => r.json()),
    ]).then(([r1, r2]) => setWardList([...(r1?.data || r1 || []), ...(r2?.data || r2 || [])])).catch(console.error);
  }, []);

  const toggle = (key: string) => setOpenKey(prev => prev === key ? null : key);

  if (membersFor) {
    return (
      <MembersPage
        sangha={{ _id: membersFor._id!, name: membersFor.name, locationName: membersFor.locationName }}
        onClose={() => setMembersFor(null)}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0" style={BG}>
        <h1 className="font-black text-sm text-white">🌟 ಭಾರತ ಜೋಡೋ ಯುವ ಸಂಘ</h1>
        <p className="text-white/70 text-[10px] mt-0.5">ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ</p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">

          {/* Area Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AREA_CARDS.map(c => {
              const key    = `${c.taluk}-${c.areaType}`;
              const isOpen = openKey === key;
              return (
                <button key={key} onClick={() => toggle(key)}
                  className={`relative rounded-xl p-3 text-left transition-all duration-200 overflow-hidden ${isOpen ? 'shadow-md ring-2 ring-blue-300' : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-sm shadow-sm'}`}
                  style={isOpen ? BG : {}}>
                  <p className={`text-[11px] font-bold leading-tight ${isOpen ? 'text-white' : 'text-gray-700'}`}>{c.label}</p>
                  <div className={`absolute top-2 right-2 transition-transform duration-200 ${isOpen ? 'text-white/70 rotate-180' : 'text-gray-300'}`}>
                    <FaChevronDown size={9} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Sections */}
          {AREA_CARDS.map(c => {
            const key    = `${c.taluk}-${c.areaType}`;
            const isOpen = openKey === key;
            if (!isOpen) return null;

            const sectionWards = c.areaType !== 'gramapanchayath'
              ? wardList.filter((w: any) => {
                  const pid = w.panchayatipatana?._id || w.panchayatipatana || w.panchayatipatanaId;
                  return String(pid) === String(c.patanaId);
                })
              : [];

            return (
              <div key={key}>
                <div className="px-3 py-2.5 rounded-t-xl flex items-center justify-between" style={BG}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.icon}</span>
                    <span className="text-white font-bold text-xs">{c.label}</span>
                  </div>
                  <button onClick={() => setOpenKey(null)}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
                    <FaTimes size={10} />
                  </button>
                </div>
                <ExpandedSection card={c} onViewMembers={setMembersFor} allWards={sectionWards} allGPs={gpList} />
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
