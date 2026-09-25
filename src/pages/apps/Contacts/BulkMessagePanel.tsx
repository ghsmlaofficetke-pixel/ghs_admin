// src/pages/apps/Contacts/BulkMessagePanel.tsx
// Sub-component for bulk Voice Call + WhatsApp poster send
// Used ONLY inside VillageContacts.tsx — no other module is touched

import { useState, useRef } from 'react';
import { FaPhone, FaWhatsapp, FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { sendBulkVoiceCall, sendBulkWhatsApp, BulkSendResult } from '../../../api/bulkMessage';
import { uploadImageToFirebase } from '../../../utils/uploadImages';

interface Props {
  selectedVillageIds: string[];
  onClose: () => void;
}

type PanelMode = 'voice' | 'whatsapp' | null;

export default function BulkMessagePanel({ selectedVillageIds, onClose }: Props) {
  const [mode, setMode] = useState<PanelMode>(null);
  const [sending, setSending] = useState(false);
  const [results, setResults] = useState<BulkSendResult[] | null>(null);
  const [summary, setSummary] = useState<{ total: number; sent: number; failed: number } | null>(null);

  // Voice state
  const [audioUrl, setAudioUrl] = useState('');
  const [ttsText, setTtsText] = useState('');
  const audioFileRef = useRef<HTMLInputElement>(null);

  // WhatsApp state
  const [posterUrl, setPosterUrl] = useState('');
  const [caption, setCaption] = useState('');
  const posterFileRef = useRef<HTMLInputElement>(null);

  const count = selectedVillageIds.length;

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For audio, we just use a direct URL input or upload to Firebase storage
    // Using uploadImage util for simplicity (works for any file type)
    try {
      toast.info('Audio upload ಆಗುತ್ತಿದೆ...');
      const url = await uploadImageToFirebase(file, 'bulk-audio');
      setAudioUrl(url);
      toast.success('Audio upload ಆಯ್ತು ✅');
    } catch {
      toast.error('Audio upload ಆಗಲಿಲ್ಲ');
    }
  };

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.info('Poster upload ಆಗುತ್ತಿದೆ...');
      const url = await uploadImageToFirebase(file, 'bulk-posters');
      setPosterUrl(url);
      toast.success('Poster upload ಆಯ್ತು ✅');
    } catch {
      toast.error('Poster upload ಆಗಲಿಲ್ಲ');
    }
  };

  const handleSendVoice = async () => {
    if (!audioUrl && !ttsText.trim()) {
      toast.warn('Audio file upload ಮಾಡಿ ಅಥವಾ TTS text ಬರೆಯಿರಿ');
      return;
    }
    setSending(true);
    const res = await sendBulkVoiceCall(selectedVillageIds, audioUrl || undefined, ttsText || undefined);
    setSending(false);
    if (res) {
      setResults(res.results);
      setSummary(res.summary);
      toast.success(res.message);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!posterUrl) {
      toast.warn('Poster image upload ಮಾಡಿ');
      return;
    }
    setSending(true);
    const res = await sendBulkWhatsApp(selectedVillageIds, posterUrl, caption);
    setSending(false);
    if (res) {
      setResults(res.results);
      setSummary(res.summary);
      toast.success(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-2">
      <div className="bg-white dark:bg-[#1f2a38] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <div>
            <h2 className="font-bold text-sm text-gray-800 dark:text-white">
              📢 Bulk Message — {count} ಗ್ರಾಮ ಆಯ್ಕೆ
            </h2>
            <p className="text-xs text-gray-400">ಕಾರ್ಯಕರ್ತರಿಗೆ message ಕಳಿಸಿ</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition">
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Results view */}
          {results && summary ? (
            <div className="space-y-3">
              <div className="flex gap-3 text-sm font-semibold">
                <span className="text-green-600">✅ Sent: {summary.sent}</span>
                <span className="text-red-500">❌ Failed: {summary.failed}</span>
                <span className="text-gray-500">Total: {summary.total}</span>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1 border-b dark:border-gray-700">
                    {r.status === 'sent'
                      ? <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      : <FaTimesCircle className="text-red-500 flex-shrink-0" />}
                    <span className="font-medium truncate">{r.name || r.phone}</span>
                    <span className="text-gray-400 ml-auto">{r.phone}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setResults(null); setSummary(null); setMode(null); }}
                className="w-full py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                ಮತ್ತೆ ಕಳಿಸಿ / ಮುಚ್ಚಿ
              </button>
            </div>
          ) : (
            <>
              {/* Mode selector */}
              {!mode && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode('voice')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
                    <FaPhone className="text-indigo-600" size={22} />
                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Voice Call</span>
                    <span className="text-xs text-gray-400 text-center">Recorded / TTS audio call</span>
                  </button>
                  <button
                    onClick={() => setMode('whatsapp')}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-green-200 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition">
                    <FaWhatsapp className="text-green-600" size={22} />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">WhatsApp</span>
                    <span className="text-xs text-gray-400 text-center">Poster + caption send</span>
                  </button>
                </div>
              )}

              {/* Voice form */}
              {mode === 'voice' && (
                <div className="space-y-3">
                  <button onClick={() => setMode(null)} className="text-xs text-blue-500 hover:underline">← ಹಿಂದೆ</button>
                  <p className="text-xs text-gray-500">Audio file upload ಮಾಡಿ <strong>ಅಥವಾ</strong> TTS text ಬರೆಯಿರಿ</p>

                  {/* Audio file upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      🎵 Audio File Upload (mp3/wav)
                    </label>
                    <input ref={audioFileRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                    <button
                      onClick={() => audioFileRef.current?.click()}
                      className="w-full py-2 border-2 border-dashed border-indigo-300 rounded-xl text-xs text-indigo-600 hover:bg-indigo-50 transition">
                      {audioUrl ? '✅ Audio uploaded' : '📁 Audio file ಆಯ್ಕೆ ಮಾಡಿ'}
                    </button>
                    {audioUrl && (
                      <audio controls src={audioUrl} className="w-full mt-1 h-8" />
                    )}
                  </div>

                  <div className="text-center text-xs text-gray-400">— ಅಥವಾ —</div>

                  {/* TTS text */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      📝 TTS Text (ಕನ್ನಡ / English)
                    </label>
                    <textarea
                      value={ttsText}
                      onChange={e => setTtsText(e.target.value)}
                      rows={3}
                      placeholder="ಇಲ್ಲಿ message ಬರೆಯಿರಿ — TTS ಆಗಿ call ಹೋಗುತ್ತದೆ"
                      className="w-full border rounded-xl px-3 py-2 text-sm dark:bg-[#16202b] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSendVoice}
                    disabled={sending || (!audioUrl && !ttsText.trim())}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                    <FaPhone size={13} />
                    {sending ? 'Calling...' : `${count} ಗ್ರಾಮಗಳಿಗೆ Voice Call ಕಳಿಸಿ`}
                  </button>
                </div>
              )}

              {/* WhatsApp form */}
              {mode === 'whatsapp' && (
                <div className="space-y-3">
                  <button onClick={() => setMode(null)} className="text-xs text-blue-500 hover:underline">← ಹಿಂದೆ</button>

                  {/* Poster upload */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      🖼 Poster Image Upload
                    </label>
                    <input ref={posterFileRef} type="file" accept="image/*" onChange={handlePosterUpload} className="hidden" />
                    <button
                      onClick={() => posterFileRef.current?.click()}
                      className="w-full py-2 border-2 border-dashed border-green-300 rounded-xl text-xs text-green-600 hover:bg-green-50 transition">
                      {posterUrl ? '✅ Poster uploaded' : '📁 Poster image ಆಯ್ಕೆ ಮಾಡಿ'}
                    </button>
                    {posterUrl && (
                      <img src={posterUrl} alt="poster preview" className="w-full mt-1 rounded-lg max-h-32 object-contain border" />
                    )}
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      💬 Caption Text
                    </label>
                    <textarea
                      value={caption}
                      onChange={e => setCaption(e.target.value)}
                      rows={3}
                      placeholder="WhatsApp caption ಬರೆಯಿರಿ..."
                      className="w-full border rounded-xl px-3 py-2 text-sm dark:bg-[#16202b] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSendWhatsApp}
                    disabled={sending || !posterUrl}
                    className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
                    <FaWhatsapp size={14} />
                    {sending ? 'Sending...' : `${count} ಗ್ರಾಮಗಳಿಗೆ WhatsApp ಕಳಿಸಿ`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
