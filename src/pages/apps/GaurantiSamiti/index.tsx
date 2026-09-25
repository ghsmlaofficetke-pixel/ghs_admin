import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { gramaPanchayathSelector, fetchAllGramaPanchayaths } from '../../../api/gramapanchayath';
import { AppDispatch } from '../../../redux/store';
import { FaTimes, FaChevronDown, FaShieldAlt } from 'react-icons/fa';
import { AREA_CARDS, TARIKERE_PURASABHA_ID, AJJAMPURA_PATANA_ID, MAX_MEMBERS } from './constants';
import ExpandedSection from './ExpandedSection';

const BG = { background: 'linear-gradient(135deg, #2466d1, #06b6d4)' };

export default function GauranthiSamitiPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list: gpList } = useSelector(gramaPanchayathSelector) as { list: any[] };
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [wardList, setWardList] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    dispatch(fetchAllGramaPanchayaths());
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    Promise.all([
      fetch(`${API_URL}/ward/panchayatipatana/${TARIKERE_PURASABHA_ID}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/ward/panchayatipatana/${AJJAMPURA_PATANA_ID}`, { headers }).then(r => r.json()),
    ]).then(([r1, r2]) => setWardList([...(r1?.data || []), ...(r2?.data || [])]));
  }, []);

  const toggle = (key: string) => setOpenKey(p => p === key ? null : key);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0" style={BG}>
        <div className="flex items-center gap-2.5">
          <FaShieldAlt size={18} className="text-white flex-shrink-0" />
          <div>
            <h1 className="text-sm font-black text-white">ಗ್ಯಾರಂಟಿ ಸಮಿತಿ</h1>
            <p className="text-white/70 text-[10px]">ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ • ಪ್ರತಿ ಸಮಿತಿಯಲ್ಲಿ {MAX_MEMBERS} ಸದಸ್ಯರು</p>
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">

          {/* Area Cards — 2 cols on mobile, 4 on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AREA_CARDS.map(c => {
              const key = `${c.taluk}-${c.areaType}`;
              const isOpen = openKey === key;
              return (
                <button
                  key={key}
                  onClick={() => toggle(key)}
                  className={`relative rounded-xl p-3 text-left transition-all duration-200 overflow-hidden
                    ${isOpen
                      ? 'shadow-md ring-2 ring-blue-300'
                      : 'bg-white border border-gray-200 hover:border-blue-200 hover:shadow-sm shadow-sm'
                    }`}
                  style={isOpen ? BG : {}}
                >
                  <p className={`text-[11px] font-bold leading-tight ${isOpen ? 'text-white' : 'text-gray-700'}`}>
                    {c.label}
                  </p>
                  <div className={`absolute top-2 right-2 transition-transform duration-200 ${isOpen ? 'text-white/70 rotate-180' : 'text-gray-300'}`}>
                    <FaChevronDown size={9} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Expanded Sections */}
          {AREA_CARDS.map(c => {
            const key = `${c.taluk}-${c.areaType}`;
            if (openKey !== key) return null;

            const sectionWards = c.areaType !== 'gramapanchayath'
              ? wardList.filter((w: any) => {
                  const pid = w.panchayatipatana?._id || w.panchayatipatana || w.panchayatipatanaId;
                  return String(pid) === String(c.patanaId);
                })
              : [];

            return (
              <div key={key}>
                {/* Section Header */}
                <div className="px-3 py-2.5 rounded-t-2xl flex items-center justify-between" style={BG}>
                  <p className="text-white font-bold text-xs">{c.label}</p>
                  <button
                    onClick={() => setOpenKey(null)}
                    className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
                <ExpandedSection card={c} allGPs={gpList} allWards={sectionWards} />
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}
