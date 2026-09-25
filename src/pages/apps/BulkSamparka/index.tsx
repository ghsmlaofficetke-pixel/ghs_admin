import { useState, useRef, useEffect, useMemo } from 'react';
import {
  FaPhone, FaTimes, FaCheckCircle, FaTimesCircle,
  FaSearch, FaUsers, FaHistory, FaInfoCircle, FaUpload,
  FaRupeeSign, FaExternalLinkAlt, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  sendDirectVoice, fetchBulkLogs, fetchBulkLogDetail,
  BulkRecipient, BulkLog, BulkSendResult,
} from '../../../api/bulkMessage';
import { uploadImageToFirebase } from '../../../utils/uploadImages';

type Tab = 'send' | 'history' | 'provider';

const EXOTEL = {
  name: 'Exotel',
  website: 'https://exotel.com',
  signup: 'https://exotel.com/sign-up',
  pricing: [
    { label: 'Outbound call (mobile)', price: '₹0.50/min' },
    { label: 'Outbound call (landline)', price: '₹0.30/min' },
    { label: 'IVR / recorded message', price: '₹0.50/min' },
  ],
  free: '₹500 free credits on signup',
  plan: '₹999/month Starter — includes virtual number',
  envVars: ['EXOTEL_SID', 'EXOTEL_TOKEN', 'EXOTEL_CALLER_ID', 'EXOTEL_APP_ID'],
  note: 'Virtual number (ExoPhone) ಕೊಳ್ಳಬೇಕು. Audio mp3/wav format ಬೇಕು. DND numbers ಗೆ call ಹೋಗುವುದಿಲ್ಲ.',
};

function LogDetailModal({ logId, onClose }: { logId: string; onClose: () => void }) {
  const [log, setLog] = useState<BulkLog | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchBulkLogDetail(logId).then(setLog); }, [logId]);

  const filtered = useMemo(() => {
    if (!log?.recipients) return [];
    return log.recipients.filter(r =>
      [r.name, r.phone].some(v => v?.toLowerCase().includes(search.toLowerCase()))
    );
  }, [log, search]);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-2">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <p className="font-bold text-sm text-gray-800">📞 Call Report</p>
            {log && <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString('kn-IN')}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><FaTimes size={16} /></button>
        </div>

        {!log ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50 border-b text-center">
              <div><p className="text-lg font-black text-gray-700">{log.totalCount}</p><p className="text-[10px] text-gray-400">ಒಟ್ಟು</p></div>
              <div><p className="text-lg font-black text-green-600">{log.sentCount}</p><p className="text-[10px] text-gray-400">✅ Sent</p></div>
              <div><p className="text-lg font-black text-red-500">{log.failedCount}</p><p className="text-[10px] text-gray-400">❌ Failed</p></div>
            </div>
            <div className="px-4 py-2 border-b">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${log.totalCount ? (log.sentCount / log.totalCount) * 100 : 0}%` }} />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {log.totalCount ? Math.round((log.sentCount / log.totalCount) * 100) : 0}% success
              </p>
            </div>
            <div className="px-4 py-2 border-b flex items-center gap-2">
              <FaSearch size={11} className="text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ಹೆಸರು / ಫೋನ್..." className="flex-1 text-xs focus:outline-none" />
              {search && <button onClick={() => setSearch('')}><FaTimes size={10} className="text-gray-400" /></button>}
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {filtered.map((r, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2.5">
                  {r.status === 'sent'
                    ? <FaCheckCircle className="text-green-500 flex-shrink-0" size={13} />
                    : <FaTimesCircle className="text-red-400 flex-shrink-0" size={13} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{r.name || '—'}</p>
                    <p className="text-[10px] text-gray-400">{r.phone}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {r.status === 'sent' ? 'Sent' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BulkSamparkaPage() {
  const [tab, setTab]               = useState<Tab>('send');
  const [sending, setSending]       = useState(false);
  const [logs, setLogs]             = useState<BulkLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [detailId, setDetailId]     = useState<string | null>(null);
  const [providerOpen, setProviderOpen] = useState(false);

  const [recipients, setRecipients] = useState<BulkRecipient[]>([]);
  const [rName, setRName]   = useState('');
  const [rPhone, setRPhone] = useState('');
  const [search, setSearch] = useState('');

  const [audioUrl, setAudioUrl] = useState('');
  const [ttsText, setTtsText]   = useState('');
  const audioRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<{ summary: { total: number; sent: number; failed: number }; results: BulkSendResult[] } | null>(null);

  useEffect(() => { if (tab === 'history') loadLogs(); }, [tab]);

  const loadLogs = async () => {
    setLogsLoading(true);
    setLogs(await fetchBulkLogs('voice', 50));
    setLogsLoading(false);
  };

  const filteredR = useMemo(() =>
    recipients.filter(r => [r.name, r.phone].some(v => v.toLowerCase().includes(search.toLowerCase())))
  , [recipients, search]);

  const addRecipient = () => {
    const phone = rPhone.replace(/\D/g, '');
    if (phone.length < 10) { toast.warn('Valid 10-digit phone ಬೇಕು'); return; }
    if (recipients.some(r => r.phone.replace(/\D/g, '') === phone)) { toast.warn('ಈ ನಂಬರ್ ಈಗಾಗಲೇ ಇದೆ'); return; }
    setRecipients(p => [...p, { name: rName.trim() || phone, phone }]);
    setRName(''); setRPhone('');
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.info('Audio upload ಆಗುತ್ತಿದೆ...');
    try { setAudioUrl(await uploadImageToFirebase(file, 'bulk-audio')); toast.success('Audio ready ✅'); }
    catch { toast.error('Upload ಆಗಲಿಲ್ಲ'); }
  };

  const handleSend = async () => {
    if (!recipients.length) { toast.warn('ಕನಿಷ್ಠ 1 recipient ಸೇರಿಸಿ'); return; }
    if (!audioUrl && !ttsText.trim()) { toast.warn('Audio file ಅಥವಾ TTS text ಬೇಕು'); return; }
    setSending(true);
    const res = await sendDirectVoice(recipients, audioUrl || undefined, ttsText || undefined);
    setSending(false);
    if (res) { setResult({ summary: res.summary, results: res.results }); toast.success(res.message); loadLogs(); }
  };

  const resetSend = () => { setResult(null); setAudioUrl(''); setTtsText(''); };

  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2466d1] to-cyan-500 px-4 py-4">
        <h1 className="text-white font-black text-lg">📞 ಕಾರ್ಯಕರ್ತರ ಸಂಪರ್ಕ</h1>
        <p className="text-blue-100 text-xs mt-0.5">Bulk Voice Call — Exotel</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <p className="text-white font-black text-lg">{recipients.length}</p>
            <p className="text-blue-100 text-[10px]">Recipients</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <p className="text-white font-black text-lg">{logs.length}</p>
            <p className="text-blue-100 text-[10px]">Past Calls</p>
          </div>
          <div className="flex-1 bg-white/15 rounded-xl px-3 py-2 text-center">
            <p className="text-white font-black text-lg">{logs.reduce((s, l) => s + l.sentCount, 0)}</p>
            <p className="text-blue-100 text-[10px]">Total Sent</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b shadow-sm">
        {([
          { key: 'send', label: '📤 ಕಳಿಸಿ' },
          { key: 'history', label: '📋 History' },
          { key: 'provider', label: '💡 Exotel' },
        ] as { key: Tab; label: string }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 text-xs font-bold transition border-b-2 ${tab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── SEND TAB ── */}
        {tab === 'send' && (
          <div className="p-4 space-y-4">
            {result ? (
              <div className="space-y-3">
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                  <p className="font-bold text-gray-800 text-sm">📊 Call Report</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 rounded-xl py-2"><p className="font-black text-gray-700 text-lg">{result.summary.total}</p><p className="text-[10px] text-gray-400">ಒಟ್ಟು</p></div>
                    <div className="bg-green-50 rounded-xl py-2"><p className="font-black text-green-600 text-lg">{result.summary.sent}</p><p className="text-[10px] text-gray-400">✅ Sent</p></div>
                    <div className="bg-red-50 rounded-xl py-2"><p className="font-black text-red-500 text-lg">{result.summary.failed}</p><p className="text-[10px] text-gray-400">❌ Failed</p></div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.summary.total ? (result.summary.sent / result.summary.total) * 100 : 0}%` }} />
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {result.results.map((r, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1.5">
                        {r.status === 'sent' ? <FaCheckCircle className="text-green-500 flex-shrink-0" size={11} /> : <FaTimesCircle className="text-red-400 flex-shrink-0" size={11} />}
                        <span className="font-medium truncate flex-1">{r.name || r.phone}</span>
                        <span className="text-gray-400">{r.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={resetSend} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm font-bold shadow">
                  ← ಮತ್ತೆ ಕಳಿಸಿ
                </button>
              </div>
            ) : (
              <>
                {/* Recipients */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                  <p className="font-bold text-sm text-gray-700 flex items-center gap-2">
                    <FaUsers size={13} className="text-blue-500" /> Recipients ({recipients.length})
                  </p>
                  <div className="flex gap-2">
                    <input value={rName} onChange={e => setRName(e.target.value)} placeholder="ಹೆಸರು (optional)"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <input value={rPhone} onChange={e => setRPhone(e.target.value)} onKeyDown={e => e.key === 'Enter' && addRecipient()}
                      placeholder="ಫೋನ್ ನಂಬರ್ *" type="tel" inputMode="numeric"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200" />
                    <button onClick={addRecipient} className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition">+ Add</button>
                  </div>
                  {recipients.length > 0 && (
                    <>
                      <div className="flex items-center gap-2">
                        <FaSearch size={11} className="text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ಹುಡುಕಿ..." className="flex-1 text-xs focus:outline-none text-gray-600" />
                        {search && <button onClick={() => setSearch('')}><FaTimes size={10} className="text-gray-400" /></button>}
                        <button onClick={() => setRecipients([])} className="text-[10px] text-red-400 hover:text-red-600 font-semibold">Clear all</button>
                      </div>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {filteredR.map((r, i) => (
                          <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-100">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 truncate">{r.name}</p>
                              <p className="text-[10px] text-gray-400">{r.phone}</p>
                            </div>
                            <button onClick={() => setRecipients(p => p.filter(x => x.phone !== r.phone))} className="text-red-400 hover:text-red-600 p-1">
                              <FaTimes size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Audio setup */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                  <p className="font-bold text-sm text-gray-700">🎵 Audio Setup</p>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">Audio File Upload (mp3/wav)</label>
                    <input ref={audioRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    <button onClick={() => audioRef.current?.click()}
                      className="w-full py-2.5 border-2 border-dashed border-indigo-300 rounded-xl text-xs text-indigo-600 hover:bg-indigo-50 flex items-center justify-center gap-2 transition">
                      <FaUpload size={11} />
                      {audioUrl ? '✅ Audio uploaded — change ಮಾಡಲು click ಮಾಡಿ' : 'Audio file ಆಯ್ಕೆ ಮಾಡಿ'}
                    </button>
                    {audioUrl && <audio controls src={audioUrl} className="w-full mt-2 h-8" />}
                  </div>
                  <div className="text-center text-xs text-gray-400">— ಅಥವಾ TTS text —</div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">📝 TTS Message (ಕನ್ನಡ / English)</label>
                    <textarea value={ttsText} onChange={e => setTtsText(e.target.value)} rows={3}
                      placeholder="ಇಲ್ಲಿ message ಬರೆಯಿರಿ — voice ಆಗಿ call ಹೋಗುತ್ತದೆ"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                  </div>

                  {recipients.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 flex items-center gap-2">
                      <FaRupeeSign size={11} className="text-yellow-600" />
                      <p className="text-xs text-yellow-800">
                        ಅಂದಾಜು ವೆಚ್ಚ: <strong>₹{(recipients.length * 0.50).toFixed(2)} – ₹{(recipients.length * 1.00).toFixed(2)}</strong> ({recipients.length} calls)
                      </p>
                    </div>
                  )}

                  <button onClick={handleSend} disabled={sending || !recipients.length}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow disabled:opacity-40 transition flex items-center justify-center gap-2">
                    <FaPhone size={13} />
                    {sending ? 'Calling...' : `${recipients.length} ಜನರಿಗೆ Voice Call ಕಳಿಸಿ`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {tab === 'history' && (
          <div className="p-4 space-y-3">
            {logsLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-7 h-7 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
                <FaHistory size={32} className="text-gray-200" />
                <p className="text-sm">ಇನ್ನೂ ಯಾವ call ಆಗಿಲ್ಲ</p>
              </div>
            ) : (
              logs.map(log => (
                <button key={log._id} onClick={() => setDetailId(log._id)}
                  className="w-full bg-white rounded-2xl shadow-sm p-4 text-left hover:shadow-md transition">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="text-indigo-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-800">Voice Call</p>
                        <p className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleDateString('kn-IN')}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">ಒಟ್ಟು: {log.totalCount}</span>
                        <span className="text-xs text-green-600 font-semibold">✅ {log.sentCount}</span>
                        <span className="text-xs text-red-500 font-semibold">❌ {log.failedCount}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full"
                          style={{ width: `${log.totalCount ? (log.sentCount / log.totalCount) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {/* ── PROVIDER TAB ── */}
        {tab === 'provider' && (
          <div className="p-4 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 flex gap-2">
              <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={14} />
              <p className="text-xs text-blue-800">
                Voice call ಗೆ <strong>Exotel</strong> ಬಳಸಲಾಗಿದೆ. Backend{' '}
                <code className="bg-blue-100 px-1 rounded">.env</code> ನಲ್ಲಿ keys ಹಾಕಿದ ನಂತರ ಕೆಲಸ ಮಾಡುತ್ತದೆ.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-blue-200 overflow-hidden">
              <button onClick={() => setProviderOpen(o => !o)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-left">
                <span className="text-2xl">📞</span>
                <div className="flex-1">
                  <p className="font-bold text-sm text-blue-700">Exotel</p>
                  <p className="text-xs text-gray-500">Voice Call API</p>
                </div>
                <a href={EXOTEL.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                  className="text-xs font-semibold text-blue-600 flex items-center gap-1 mr-2">
                  Website <FaExternalLinkAlt size={9} />
                </a>
                {providerOpen ? <FaChevronUp size={12} className="text-gray-400" /> : <FaChevronDown size={12} className="text-gray-400" />}
              </button>

              {providerOpen && (
                <div className="px-4 py-3 space-y-3 bg-white">
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-1.5">💰 Pricing</p>
                    {EXOTEL.pricing.map((row, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
                        <span className="text-gray-600">{row.label}</span>
                        <span className="font-bold text-blue-700">{row.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl px-3 py-2 bg-blue-50">
                      <span className="font-semibold text-gray-600">🎁 Free: </span>
                      <span className="text-gray-700">{EXOTEL.free}</span>
                    </div>
                    <div className="rounded-xl px-3 py-2 bg-gray-50">
                      <span className="font-semibold text-gray-600">⚙️ Plan: </span>
                      <span className="text-gray-700">{EXOTEL.plan}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 mb-1">.env keys:</p>
                    <div className="flex flex-wrap gap-1">
                      {EXOTEL.envVars.map(v => (
                        <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800">{v}</span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800">
                    ⚠️ {EXOTEL.note}
                  </div>
                  <a href={EXOTEL.signup} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition">
                    Sign up for Exotel <FaExternalLinkAlt size={9} />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {detailId && <LogDetailModal logId={detailId} onClose={() => setDetailId(null)} />}
    </div>
  );
}
