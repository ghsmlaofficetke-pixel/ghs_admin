import { useState, useMemo, useCallback, useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes, FaUsers, FaSearch, FaChevronDown, FaPlus, FaStar, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { GaurantiSamiti, fetchGaurantiSamitis, createGaurantiSamiti, updateGaurantiSamiti, deleteGaurantiSamiti } from '../../../api/gaurantiSamiti';
import { AreaCard, MAX_MEMBERS } from './constants';
import SamitiFormModal from './SamitiFormModal';

const BG = { background: 'linear-gradient(135deg, #2466d1, #06b6d4)' };

function SamitiCard({ samiti, idx, onEdit, onDelete }: {
  samiti: GaurantiSamiti; idx: number;
  onEdit: () => void; onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const filled = samiti.members.length;
  const complete = filled >= MAX_MEMBERS;

  return (
    <div className={`rounded-xl border overflow-hidden transition-all duration-200
      ${complete ? 'border-green-200 bg-green-50/30' : 'border-gray-200 bg-white'}`}>

      <div className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer" onClick={() => setOpen(p => !p)}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={BG}>
          {idx + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-bold text-gray-900 truncate">{samiti.name}</p>
            {complete && (
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                <FaCheckCircle size={7} /> ಪೂರ್ಣ
              </span>
            )}
          </div>
          {samiti.locationName && (
            <p className="text-[10px] text-gray-400 truncate">{samiti.locationName}</p>
          )}
        </div>

        <span className="text-[11px] font-bold text-gray-500 flex-shrink-0">{filled}/{MAX_MEMBERS}</span>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
            <FaEdit size={10} />
          </button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition">
            <FaTrash size={10} />
          </button>
          <div className={`text-gray-300 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <FaChevronDown size={9} />
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100">
          {samiti.members.length === 0 ? (
            <div className="px-3 py-3 text-center text-xs text-gray-400">
              ಇನ್ನೂ ಸದಸ್ಯರಿಲ್ಲ — Edit ಒತ್ತಿ ಸೇರಿಸಿ
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {samiti.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-black flex-shrink-0" style={BG}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{m.name}</p>
                    <div className="flex items-center gap-2">
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="flex items-center gap-0.5 text-[10px] text-blue-600 hover:underline">
                          <FaPhone size={7} />{m.phone}
                        </a>
                      )}
                      {m.caste && <span className="text-[10px] text-gray-400">{m.caste}</span>}
                    </div>
                  </div>
                  {i === 0 && (
                    <span className="text-[9px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5 flex-shrink-0">
                      <FaStar size={6} /> ಅಧ್ಯಕ್ಷ
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpandedSection({ card, allGPs, allWards }: { card: AreaCard; allGPs: any[]; allWards: any[] }) {
  const [samitis,  setSamitis]  = useState<GaurantiSamiti[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [search,   setSearch]   = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<GaurantiSamiti | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchGaurantiSamitis({ taluk: card.taluk, areaType: card.areaType });
    setSamitis(data);
    setLoading(false);
  }, [card.taluk, card.areaType]);

  useEffect(() => { load(); }, [load]);

  const isGp      = card.areaType === 'gramapanchayath';
  const talukGPs  = useMemo(() => allGPs.filter(g => !g.taluk || g.taluk === card.taluk), [allGPs, card.taluk]);
  const usedGpIds   = useMemo(() => samitis.map(s => String(s.gpId)).filter(Boolean), [samitis]);
  const usedWardIds = useMemo(() => samitis.flatMap(s => (s.wardIds || (s.wardId ? [s.wardId] : [])).map(String)), [samitis]);

  const filtered = useMemo(() => {
    if (!search) return samitis;
    const q = search.toLowerCase();
    return samitis.filter(s => s.name.toLowerCase().includes(q) || (s.locationName || '').toLowerCase().includes(q));
  }, [samitis, search]);

  const canAdd = isGp
    ? talukGPs.some(g => !usedGpIds.includes(String(g._id)))
    : allWards.some(w => !usedWardIds.includes(String(w._id)));

  const handleSave = async (data: Omit<GaurantiSamiti, '_id'>) => {
    if (editData?._id) await updateGaurantiSamiti(editData._id, data);
    else await createGaurantiSamiti(data);
    setFormOpen(false); setEditData(null);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteGaurantiSamiti(deleteId);
    setDeleteId(null); load();
  };

  const totalOptions   = isGp ? talukGPs.length : allWards.length;
  const completedCount = samitis.filter(s => s.members.length >= MAX_MEMBERS).length;
  const totalMembers   = samitis.reduce((s, x) => s + x.members.length, 0);
  const coveragePct    = totalOptions > 0 ? Math.min(Math.round((samitis.length / totalOptions) * 100), 100) : 0;

  return (
    <div className="bg-white border border-t-0 border-gray-200 rounded-b-2xl shadow-sm flex flex-col" style={{ maxHeight: '60vh' }}>

      {/* Stats — compact, no icons */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 flex-shrink-0">
        {[
          { label: 'ಸಮಿತಿ', value: `${samitis.length}/${totalOptions}` },
          { label: 'ಪೂರ್ಣ',  value: completedCount },
          { label: 'ಸದಸ್ಯರು', value: totalMembers },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center py-2">
            <span className="text-base font-black text-blue-600">{s.value}</span>
            <span className="text-[10px] text-gray-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Coverage bar */}
      {totalOptions > 0 && (
        <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-gray-400 whitespace-nowrap">ಕವರೇಜ್</span>
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${coveragePct}%`, ...BG }} />
          </div>
          <span className="text-[10px] font-black text-blue-600">{coveragePct}%</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <div className="flex-1 flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
          <FaSearch className="text-gray-400 flex-shrink-0" size={10} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ಸಮಿತಿ ಹುಡುಕಿ..."
            className="flex-1 text-xs focus:outline-none text-gray-700 placeholder-gray-400 bg-transparent min-w-0"
          />
          {search && <button onClick={() => setSearch('')}><FaTimes size={9} className="text-gray-400" /></button>}
        </div>
        <button
          onClick={() => { setEditData(null); setFormOpen(true); }}
          disabled={!canAdd}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex-shrink-0
            ${!canAdd ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'text-white hover:opacity-90'}`}
          style={canAdd ? BG : {}}
        >
          <FaPlus size={9} /> ಸೇರಿಸಿ
        </button>
      </div>

      {/* List — scrollable */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {loading && (
          <div className="text-center py-8 text-gray-400 text-xs">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
            <FaUsers size={28} className="text-gray-200" />
            <p className="text-xs">{search ? 'ಕಂಡುಬಂದಿಲ್ಲ' : 'ಇನ್ನೂ ಯಾವ ಸಮಿತಿಯೂ ನೋಂದಣಿ ಆಗಿಲ್ಲ'}</p>
            {canAdd && !search && (
              <button
                onClick={() => { setEditData(null); setFormOpen(true); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 transition"
                style={BG}
              >
                <FaPlus size={10} /> ಮೊದಲ ಸಮಿತಿ ನೋಂದಣಿ ಮಾಡಿ
              </button>
            )}
          </div>
        )}
        {filtered.map((s, i) => (
          <SamitiCard key={s._id} samiti={s} idx={i}
            onEdit={() => { setEditData(s); setFormOpen(true); }}
            onDelete={() => setDeleteId(s._id!)} />
        ))}
      </div>

      {formOpen && (
        <SamitiFormModal
          editData={editData} card={card} allGPs={talukGPs} allWards={allWards}
          usedGpIds={usedGpIds} usedWardIds={usedWardIds}
          onClose={() => { setFormOpen(false); setEditData(null); }}
          onSave={handleSave}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-3">
              <FaTrash className="text-red-500" size={18} />
            </div>
            <h3 className="font-black text-sm text-gray-800 mb-1.5">ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h3>
            <p className="text-xs text-gray-500 mb-4">ಈ ಸಮಿತಿ ಮತ್ತು ಎಲ್ಲಾ ಸದಸ್ಯರ ಮಾಹಿತಿ ಅಳಿಸಲಾಗುತ್ತದೆ.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 transition">
                ರದ್ದು
              </button>
              <button onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-xs font-black hover:bg-red-600 transition">
                ಅಳಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
