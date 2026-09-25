import { useState } from 'react';
import { FaTimes, FaPlus, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { GaurantiSamiti, GSMember } from '../../../api/gaurantiSamiti';
import { AreaCard, MAX_MEMBERS, inp, lbl } from './constants';
import { MemberRow, WardPicker } from './SubComponents';
import { toast } from 'react-toastify';

const BG = { background: 'linear-gradient(135deg, #2466d1, #06b6d4)' };

interface Props {
  editData: GaurantiSamiti | null;
  card: AreaCard;
  allGPs: any[];
  allWards: any[];
  usedGpIds: string[];
  usedWardIds: string[];
  onClose: () => void;
  onSave: (data: Omit<GaurantiSamiti, '_id'>) => void;
}

export default function SamitiFormModal({ editData, card, allGPs, allWards, usedGpIds, usedWardIds, onClose, onSave }: Props) {
  const isGp = card.areaType === 'gramapanchayath';

  const [name,    setName]    = useState(editData?.name || '');
  const [remark,  setRemark]  = useState(editData?.remark || '');
  const [gpId,    setGpId]    = useState(editData?.gpId || '');
  const [wardIds, setWardIds] = useState<string[]>(
    (editData?.wardIds || (editData?.wardId ? [editData.wardId] : [])).map(String)
  );
  const [members, setMembers] = useState<GSMember[]>(editData?.members?.length ? editData.members : []);

  const availableGPs = allGPs.filter(g => !usedGpIds.includes(String(g._id)) || String(g._id) === String(editData?.gpId));

  const addMember = () => {
    if (members.length >= MAX_MEMBERS) { toast.warn(`ಗರಿಷ್ಠ ${MAX_MEMBERS} ಸದಸ್ಯರು ಮಾತ್ರ`); return; }
    setMembers(p => [...p, { name: '', phone: '', caste: '', address: '' }]);
  };

  const updateMember = (i: number, m: GSMember) => setMembers(p => p.map((x, idx) => idx === i ? m : x));
  const removeMember = (i: number) => setMembers(p => p.filter((_, idx) => idx !== i));

  const canSave = name.trim() && (isGp ? !!gpId : wardIds.length > 0) && members.every(m => m.name.trim());

  const handleSave = () => {
    if (!canSave) return;
    const locationName = isGp
      ? allGPs.find(g => String(g._id) === gpId)?.name || ''
      : allWards.filter(w => wardIds.includes(String(w._id))).map(w => w.name).join(', ');

    onSave({
      name: name.trim(), remark, taluk: card.taluk, areaType: card.areaType, locationName,
      gpId: isGp ? gpId : null,
      wardId: !isGp && wardIds.length === 1 ? wardIds[0] : null,
      wardIds: !isGp ? wardIds : [],
      members: members.map((m, i) => ({ ...m, serialNo: i + 1 })),
    });
  };

  const pct = Math.round((members.length / MAX_MEMBERS) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-5 py-4 rounded-t-3xl sm:rounded-t-2xl flex-shrink-0" style={BG}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <FaShieldAlt size={16} />
              </div>
              <div>
                <p className="text-white font-black text-sm">{editData ? 'ಸಮಿತಿ ಬದಲಾಯಿಸಿ' : 'ಹೊಸ ಗ್ಯಾರಂಟಿ ಸಮಿತಿ'}</p>
                <p className="text-white/70 text-xs">{card.label} • ಗರಿಷ್ಠ {MAX_MEMBERS} ಸದಸ್ಯರು</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition">
              <FaTimes size={13} />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-white/80 text-[11px] font-bold">{members.length}/{MAX_MEMBERS}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className={lbl}>{isGp ? 'ಗ್ರಾಮ ಪಂಚಾಯತ್ *' : 'ವಾರ್ಡ್ ಆಯ್ಕೆ *'}</label>
            {isGp ? (
              <>
                <select value={gpId} onChange={e => setGpId(e.target.value)} className={inp}>
                  <option value="">-- ಆಯ್ಕೆ ಮಾಡಿ --</option>
                  {availableGPs.map(g => <option key={g._id} value={g._id}>{g.name}</option>)}
                </select>
                {availableGPs.length === 0 && <p className="text-xs text-amber-600 mt-1">ಎಲ್ಲಾ ಗ್ರಾಮ ಪಂಚಾಯತ್ ಗಳಿಗೆ ಸಮಿತಿ ನೋಂದಣಿ ಆಗಿದೆ</p>}
              </>
            ) : (
              <WardPicker wards={allWards} selectedIds={wardIds} usedIds={usedWardIds} onChange={setWardIds} color="from-blue-500 to-cyan-500" />
            )}
          </div>

          <div>
            <label className={lbl}>ಸಮಿತಿ ಹೆಸರು *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="ಸಮಿತಿ ಹೆಸರು" className={inp} />
          </div>

          <div>
            <label className={lbl}>ಟಿಪ್ಪಣಿ</label>
            <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={2} placeholder="ಟಿಪ್ಪಣಿ..." className={`${inp} resize-none`} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${lbl} mb-0 flex items-center gap-1.5`}>
                <FaUsers size={11} className="text-gray-400" />
                ಸದಸ್ಯರು ({members.length}/{MAX_MEMBERS})
              </label>
              {members.length < MAX_MEMBERS && (
                <button onClick={addMember}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition"
                  style={BG}>
                  <FaPlus size={9} /> ಸದಸ್ಯ ಸೇರಿಸಿ
                </button>
              )}
            </div>
            {members.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm cursor-pointer hover:border-blue-200 transition" onClick={addMember}>
                <FaUsers className="mx-auto mb-1.5 text-gray-300" size={22} />
                ಇನ್ನೂ ಸದಸ್ಯರಿಲ್ಲ — ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ
              </div>
            ) : (
              <div className="space-y-3">
                {members.map((m, i) => (
                  <MemberRow key={i} idx={i} member={m} color="from-blue-500 to-cyan-500"
                    onChange={updated => updateMember(i, updated)}
                    onRemove={() => removeMember(i)} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 pb-6 pt-3 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-bold text-gray-600 transition">
            ರದ್ದು
          </button>
          <button onClick={handleSave} disabled={!canSave}
            className="flex-1 py-3 rounded-xl text-white text-sm font-black shadow-sm disabled:opacity-40 hover:opacity-90 transition"
            style={BG}>
            {editData ? 'ಉಳಿಸಿ' : 'ನೋಂದಣಿ ಮಾಡಿ'}
          </button>
        </div>
      </div>
    </div>
  );
}
