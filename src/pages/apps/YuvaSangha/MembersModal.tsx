import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import {
  yuvaSanghaSelector, YuvaMember,
  fetchYuvaMembers, createYuvaMember, updateYuvaMember, deleteYuvaMember,
} from '../../../api/yuvaSangha';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaUsers, FaSearch,
  FaArrowLeft, FaStar, FaPhone, FaFileExcel, FaFilePdf,
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  sangha: { _id: string; name: string; locationName?: string };
  onClose: () => void;
}

const TARGET = 15;

// Designation priority — top posts get special colors
const DESIGNATION_STYLE: Record<string, string> = {
  'ಅಧ್ಯಕ್ಷ':     'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'ಉಪಾಧ್ಯಕ್ಷ':   'bg-orange-100 text-orange-700 border border-orange-300',
  'ಕಾರ್ಯದರ್ಶಿ':  'bg-green-100 text-green-700 border border-green-300',
  'ಖಜಾಂಚಿ':      'bg-purple-100 text-purple-700 border border-purple-300',
  'ಸದಸ್ಯ':        'bg-blue-50 text-blue-600 border border-blue-200',
};
const DESIGNATION_ICON: Record<string, string> = {
  'ಅಧ್ಯಕ್ಷ': '👑', 'ಉಪಾಧ್ಯಕ್ಷ': '⭐', 'ಕಾರ್ಯದರ್ಶಿ': '📋', 'ಖಜಾಂಚಿ': '💰',
};

function getDesignationCls(d?: string) {
  if (!d) return 'bg-gray-100 text-gray-500 border border-gray-200';
  return DESIGNATION_STYLE[d] ?? 'bg-blue-50 text-blue-600 border border-blue-200';
}

/* ─── Member Form ─── */
function MemberForm({ sanghaId, initial, onClose }: {
  sanghaId: string; initial: YuvaMember | null; onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  // const [serialNo,    setSerialNo]    = useState('');
  const [regNo,       setRegNo]       = useState('');
  const [name,        setName]        = useState('');
  const [age,         setAge]         = useState('');
  const [designation, setDesignation] = useState('');
  const [phone,       setPhone]       = useState('');
  const [caste,       setCaste]       = useState('');
  const [address,     setAddress]     = useState('');

  useEffect(() => {
    if (initial) {
      // setSerialNo(initial.serialNo != null ? String(initial.serialNo) : '');
      setRegNo(initial.regNo || '');
      setName(initial.name || '');
      setAge(initial.age != null ? String(initial.age) : '');
      setDesignation(initial.designation || '');
      setPhone(initial.phone || '');
      setCaste(initial.caste || '');
      setAddress(initial.address || '');
    }
  }, [initial]);

  const handleSave = () => {
    if (!name.trim()) return;
    const payload: Omit<YuvaMember, '_id'> = {
      yuvaSanghaId: sanghaId,
      // serialNo: serialNo !== '' ? Number(serialNo) : null,
      regNo, name: name.trim(),
      age: age !== '' ? Number(age) : null,
      designation, phone, caste, address,
    };
    if (initial?._id) dispatch(updateYuvaMember(initial._id, payload, sanghaId));
    else              dispatch(createYuvaMember(payload));
    onClose();
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white';
  const lbl = 'text-xs font-semibold text-gray-500 block mb-1';

  const DESIGNATIONS = ['ಅಧ್ಯಕ್ಷ', 'ಉಪಾಧ್ಯಕ್ಷ', 'ಕಾರ್ಯದರ್ಶಿ', 'ಖಜಾಂಚಿ', 'ಸದಸ್ಯ'];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#2466d1] to-cyan-500 rounded-t-2xl flex-shrink-0">
          <div>
            <h3 className="text-white font-bold text-base">{initial ? 'ಸದಸ್ಯ ಬದಲಾಯಿಸಿ' : 'ಹೊಸ ಸದಸ್ಯ ಸೇರಿಸಿ'}</h3>
            <p className="text-blue-100 text-xs mt-0.5">ಹೆಸರು ಮಾತ್ರ ಅಗತ್ಯ</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center">
            <FaTimes size={13} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            {/* <div>
              <label className={lbl}>ಕ್ರಮಸಂಖ್ಯೆ</label>
              <input type="number" inputMode="numeric" value={serialNo} onChange={e => setSerialNo(e.target.value)} placeholder="1" className={inp} />
            </div> */}
            <div>
              <label className={lbl}>ನೋಂದಣಿ ಸಂಖ್ಯೆ</label>
              <input value={regNo} onChange={e => setRegNo(e.target.value)} placeholder="" className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>ಹೆಸರು <span className="text-red-400">*</span></label>
              <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="" className={`${inp} font-medium`} />
            </div>
            <div>
              <label className={lbl}>ವಯಸ್ಸು</label>
              <input type="number" inputMode="numeric" value={age} onChange={e => setAge(e.target.value)} placeholder="" className={inp} />
            </div>
            <div>
              <label className={lbl}>ಪದನಾಮ</label>
              <select value={designation} onChange={e => setDesignation(e.target.value)} className={inp}>
                <option value="">-- ಆಯ್ಕೆ ಮಾಡಿ --</option>
                {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>ಫೋನ್ ನಂಬರ್</label>
              <input type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value)} placeholder="" className={inp} />
            </div>
            <div>
              <label className={lbl}>ಪ್ರವರ್ಗ</label>
              <input value={caste} onChange={e => setCaste(e.target.value)} placeholder="" className={inp} />
            </div>
            <div className="col-span-2">
              <label className={lbl}>ವಿಳಾಸ</label>
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="" className={inp} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t bg-gray-50 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-sm font-semibold text-gray-600">ರದ್ದು</button>
          <button onClick={handleSave} disabled={!name.trim()} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm font-bold shadow hover:opacity-90 disabled:opacity-40">
            {initial ? 'ಉಳಿಸಿ' : 'ಸೇರಿಸಿ'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Export helpers ─── */
function exportExcel(members: YuvaMember[], sanghaName: string) {
  const rows = members.map((m, i) => ({
    'ಕ್ರಮ': m.serialNo ?? i + 1,
    'ನೋಂದಣಿ ಸಂಖ್ಯೆ': m.regNo || '',
    'ಹೆಸರು': m.name,
    'ಪದನಾಮ': m.designation || '',
    'ವಯಸ್ಸು': m.age ?? '',
    'ಫೋನ್': m.phone || '',
    'ಪ್ರವರ್ಗ': m.caste || '',
    'ವಿಳಾಸ': m.address || '',
  }));
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'ಸದಸ್ಯರು');
  XLSX.writeFile(wb, `${sanghaName}_ಸದಸ್ಯರು.xlsx`);
}

function exportPDF(members: YuvaMember[], sanghaName: string, locationName?: string) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(sanghaName, 14, 16);
  if (locationName) { doc.setFontSize(10); doc.text(locationName, 14, 23); }
  doc.setFontSize(10);
  doc.text(`ಒಟ್ಟು ಸದಸ್ಯರು: ${members.length}`, 14, locationName ? 30 : 23);

  autoTable(doc, {
    startY: locationName ? 35 : 28,
    head: [['#', 'ಹೆಸರು', 'ಪದನಾಮ', 'ವಯಸ್ಸು', 'ಫೋನ್', 'ಪ್ರವರ್ಗ']],
    body: members.map((m, i) => [
      m.serialNo ?? i + 1,
      m.name,
      m.designation || '-',
      m.age ?? '-',
      m.phone || '-',
      m.caste || '-',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [36, 102, 209], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 248, 255] },
  });

  doc.save(`${sanghaName}_ಸದಸ್ಯರು.pdf`);
}

/* ─── Main Members Page ─── */
export default function MembersPage({ sangha, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { members, loading } = useSelector(yuvaSanghaSelector);

  const [search,   setSearch]   = useState('');
  const [formFor,  setFormFor]  = useState<YuvaMember | null | 'new'>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { dispatch(fetchYuvaMembers(sangha._id)); }, [sangha._id]);

  const filtered = useMemo(() =>
    members.filter(m =>
      [m.name, m.phone, m.caste, m.designation, m.regNo, m.address]
        .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    ), [members, search]);

  const count   = members.length;
  const reached = count >= TARGET;
  const pct     = Math.min((count / TARGET) * 100, 100);

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col bg-gray-50">

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#2466d1] to-cyan-500 px-4 py-4">
        <div className="flex items-start gap-3">
          <button onClick={onClose} className="mt-0.5 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition flex-shrink-0">
            <FaArrowLeft size={14} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-black text-lg leading-tight truncate">{sangha.name}</h1>
            {sangha.locationName && <p className="text-blue-100 text-xs mt-0.5 truncate">{sangha.locationName}</p>}
          </div>
          <button
            onClick={() => setFormFor('new')}
            className="flex items-center gap-1.5 bg-white text-blue-700 px-3 py-2 rounded-xl text-xs font-bold shadow hover:shadow-md transition flex-shrink-0"
          >
            <FaPlus size={10} /> ಸದಸ್ಯ
          </button>
        </div>

        {/* Progress */}
        <div className="mt-4 bg-white/15 rounded-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FaUsers className="text-white" size={13} />
              <span className="text-white font-bold text-sm">{count} ಸದಸ್ಯರು</span>
              {reached && (
                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FaStar size={8} /> ಗುರಿ ತಲುಪಿದೆ!
                </span>
              )}
            </div>
            <span className="text-white/80 text-xs">ಗುರಿ: {TARGET}</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${reached ? 'bg-yellow-400' : 'bg-white'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex gap-1 mt-2.5 flex-wrap">
            {Array.from({ length: TARGET }).map((_, i) => (
              <div
                key={i}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  i < count
                    ? reached ? 'bg-yellow-400 border-yellow-300' : 'bg-white border-white/50'
                    : 'bg-white/10 border-white/20'
                }`}
              >
                {i < count && <FaUsers size={8} className={reached ? 'text-yellow-900' : 'text-blue-600'} />}
              </div>
            ))}
            {count > TARGET && (
              <div className="w-5 h-5 rounded-full bg-yellow-400 border-2 border-yellow-300 flex items-center justify-center">
                <span className="text-[8px] font-black text-yellow-900">+{count - TARGET}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search + Export ── */}
      <div className="px-4 py-2.5 bg-white border-b flex items-center gap-2 shadow-sm">
        <FaSearch className="text-gray-400 flex-shrink-0" size={13} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ಹೆಸರು, ಫೋನ್, ಪದನಾಮ, ಪ್ರವರ್ಗ ಹುಡುಕಿ..."
          className="flex-1 text-sm focus:outline-none text-gray-700 placeholder-gray-400"
        />
        {search && (
          <>
            <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600"><FaTimes size={12} /></button>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg">{filtered.length}</span>
          </>
        )}
        {/* Export buttons */}
        {members.length > 0 && (
          <div className="flex gap-1.5 ml-1 flex-shrink-0">
            <button
              onClick={() => exportExcel(members, sangha.name)}
              title="Excel ಡೌನ್‌ಲೋಡ್"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-bold border border-green-200 transition"
            >
              <FaFileExcel size={12} /> <span className="hidden sm:inline">Excel</span>
            </button>
            <button
              onClick={() => exportPDF(members, sangha.name, sangha.locationName)}
              title="PDF ಡೌನ್‌ಲೋಡ್"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold border border-red-200 transition"
            >
              <FaFilePdf size={12} /> <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto">
        {loading && members.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-3" />
            <p className="text-sm">ಲೋಡ್ ಆಗುತ್ತಿದೆ...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
            <FaUsers size={40} className="text-gray-200" />
            <p className="text-sm">{search ? 'ಯಾವ ಸದಸ್ಯರೂ ಕಂಡುಬಂದಿಲ್ಲ' : 'ಇನ್ನೂ ಸದಸ್ಯರಿಲ್ಲ'}</p>
            {!search && (
              <button
                onClick={() => setFormFor('new')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm font-bold shadow"
              >
                <FaPlus size={11} /> ಮೊದಲ ಸದಸ್ಯ ಸೇರಿಸಿ
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((m, idx) => {
              const isTop15 = idx < TARGET;
              const icon    = DESIGNATION_ICON[m.designation ?? ''];
              return (
                <div
                  key={m._id}
                  className={`flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-blue-50/40 ${
                    isTop15 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {/* Serial badge */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm ${
                    isTop15
                      ? 'bg-gradient-to-br from-[#2466d1] to-cyan-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {m.serialNo ?? idx + 1}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold leading-tight ${isTop15 ? 'text-gray-900' : 'text-gray-600'}`}>
                        {icon && <span className="mr-1">{icon}</span>}
                        {m.name}
                      </p>
                      {m.designation && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getDesignationCls(m.designation)}`}>
                          {m.designation}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-medium">
                          <FaPhone size={9} /> {m.phone}
                        </a>
                      )}
                      {m.caste && <span className="text-[11px] text-gray-400">{m.caste}</span>}
                      {m.age   && <span className="text-[11px] text-gray-400">{m.age} ವರ್ಷ</span>}
                      {m.regNo && <span className="text-[11px] text-gray-300">#{m.regNo}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setFormFor(m)} className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition">
                      <FaEdit size={12} />
                    </button>
                    <button onClick={() => setDeleteId(m._id!)} className="p-2 rounded-xl bg-red-50 text-red-400 hover:bg-red-100 transition">
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Form ── */}
      {formFor !== null && (
        <MemberForm
          sanghaId={sangha._id}
          initial={formFor === 'new' ? null : formFor}
          onClose={() => setFormFor(null)}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ</h3>
            <p className="text-sm text-gray-500 mb-5">ಈ ಸದಸ್ಯರ ದಾಖಲೆ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತದೆ.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-sm font-semibold">ರದ್ದು</button>
              <button
                onClick={() => { dispatch(deleteYuvaMember(deleteId, sangha._id)); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700"
              >ಅಳಿಸಿ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
