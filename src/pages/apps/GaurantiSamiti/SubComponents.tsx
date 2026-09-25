import { useState } from 'react';
import { FaTimes, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { GSMember } from '../../../api/gaurantiSamiti';
import { inp, lbl } from './constants';

export function MemberRow({ idx, member, onChange, onRemove, color }: {
  idx: number; member: GSMember;
  onChange: (m: GSMember) => void;
  onRemove: () => void;
  color: string;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 space-y-2 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
          {idx + 1}
        </div>
        <button onClick={onRemove} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition">
          <FaTimes size={10} />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className={lbl}>ಹೆಸರು *</label>
          <input value={member.name} onChange={e => onChange({ ...member, name: e.target.value })}
            placeholder="ಪೂರ್ಣ ಹೆಸರು" className={inp} />
        </div>
        <div>
          <label className={lbl}>ಫೋನ್</label>
          <input type="tel" inputMode="numeric" value={member.phone || ''} onChange={e => onChange({ ...member, phone: e.target.value })}
            placeholder="9876543210" className={inp} />
        </div>
        <div>
          <label className={lbl}>ಪ್ರವರ್ಗ</label>
          <input value={member.caste || ''} onChange={e => onChange({ ...member, caste: e.target.value })}
            placeholder="ಪ್ರವರ್ಗ" className={inp} />
        </div>
        <div>
          <label className={lbl}>ವಿಳಾಸ</label>
          <input value={member.address || ''} onChange={e => onChange({ ...member, address: e.target.value })}
            placeholder="ವಿಳಾಸ" className={inp} />
        </div>
      </div>
    </div>
  );
}

export function WardPicker({ wards, selectedIds, usedIds, onChange, color }: {
  wards: any[]; selectedIds: string[]; usedIds: string[];
  onChange: (ids: string[]) => void; color: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  const names = wards.filter(w => selectedIds.includes(String(w._id))).map(w => w.name).join(', ');
  const available = wards.filter(w => !usedIds.includes(String(w._id)) || selectedIds.includes(String(w._id)));

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm text-left flex justify-between items-center bg-white focus:outline-none focus:border-blue-400">
        <span className={`truncate font-medium ${selectedIds.length ? 'text-gray-800' : 'text-gray-400'}`}>
          {selectedIds.length ? names : '-- ವಾರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ --'}
        </span>
        {open ? <FaChevronUp size={11} className="text-gray-400" /> : <FaChevronDown size={11} className="text-gray-400" />}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {available.length === 0
            ? <div className="px-4 py-3 text-sm text-amber-500">ಎಲ್ಲಾ ವಾರ್ಡ್ ಗಳಿಗೆ ಸಮಿತಿ ನೋಂದಣಿ ಆಗಿದೆ</div>
            : available.map(w => {
                const sel = selectedIds.includes(String(w._id));
                return (
                  <div key={w._id} onClick={() => toggle(String(w._id))}
                    className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition ${sel ? 'bg-blue-50' : 'hover:bg-blue-50'}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel ? `bg-gradient-to-br ${color} border-transparent` : 'border-gray-300'}`}>
                      {sel && <FaCheck size={9} className="text-white" />}
                    </div>
                    <span className={`font-medium ${sel ? 'text-blue-700' : 'text-gray-700'}`}>{w.name}</span>
                  </div>
                );
              })
          }
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
