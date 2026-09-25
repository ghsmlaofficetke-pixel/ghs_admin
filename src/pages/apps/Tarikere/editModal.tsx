import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTimes, FaUser, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

interface Person { name: string; phones: string[]; }

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  type: "gp" | "village";
  initialData: any;
  onSave: (data: any) => void;
}

export default function EditModal({ open, onClose, title, type, initialData, onSave }: EditModalProps) {
  const [name, setName] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(initialData?.name || "");
    const raw = type === "gp" ? initialData?.pdo : initialData?.contactPersons;
    setPersons(raw ? JSON.parse(JSON.stringify(raw)) : []);
  }, [open]);

  if (!open) return null;

  const addPerson = () => setPersons(p => [{ name: "", phones: [""] }, ...p]);
  const removePerson = (i: number) => setPersons(p => p.filter((_, idx) => idx !== i));
  const updateName = (i: number, v: string) => setPersons(p => { const c = [...p]; c[i] = { ...c[i], name: v }; return c; });
  const updatePhone = (pi: number, phi: number, v: string) => setPersons(p => { const c = [...p]; c[pi].phones[phi] = v; return c; });
  const addPhone = (pi: number) => setPersons(p => { const c = [...p]; c[pi].phones = [...c[pi].phones, ""]; return c; });
  const removePhone = (pi: number, phi: number) => setPersons(p => { const c = [...p]; c[pi].phones = c[pi].phones.filter((_, i) => i !== phi); return c; });

  const handleSave = () => {
    if (!name.trim()) { toast.error("ಹೆಸರು ಹಾಕಿ"); return; }
    const payload = type === "gp"
      ? { ...initialData, name, pdo: persons }
      : { ...initialData, name, contactPersons: persons };
    onSave(payload);
  };

  const label = type === "gp" ? "PDO ವಿವರಗಳು" : "ಕಾರ್ಯಕರ್ತರು";

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#2466d1] to-cyan-500 rounded-t-2xl sm:rounded-t-2xl flex-shrink-0">
          <h2 className="text-white font-bold text-base truncate">{title}</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/20 transition">
            <FaTimes size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Name field */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">ಹೆಸರು *</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ಹೆಸರು ನಮೂದಿಸಿ"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
          </div>

          {/* Persons section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
              <button
                onClick={addPerson}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 px-3 py-1.5 rounded-full shadow hover:opacity-90 transition"
              >
                <FaPlus size={9} /> ಸೇರಿಸಿ
              </button>
            </div>

            {persons.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                ಯಾರೂ ಇಲ್ಲ — ಮೇಲೆ "ಸೇರಿಸಿ" ಒತ್ತಿ
              </div>
            )}

            <div className="space-y-3">
              {persons.map((p, pi) => (
                <div key={pi} className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2.5">
                  {/* Person name row */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2466d1] to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <FaUser size={10} className="text-white" />
                    </div>
                    <input
                      value={p.name}
                      onChange={e => updateName(pi, e.target.value)}
                      placeholder="ಹೆಸರು"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      onClick={() => removePerson(pi)}
                      className="w-7 h-7 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center flex-shrink-0 transition"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>

                  {/* Phones */}
                  <div className="pl-9 space-y-2">
                    {p.phones.map((ph, phi) => (
                      <div key={phi} className="flex items-center gap-2">
                        <FaPhone size={10} className="text-gray-400 flex-shrink-0" />
                        <input
                          value={ph}
                          onChange={e => updatePhone(pi, phi, e.target.value)}
                          placeholder="ಫೋನ್ ನಂಬರ್"
                          type="tel"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {p.phones.length > 1 && (
                          <button
                            onClick={() => removePhone(pi, phi)}
                            className="w-6 h-6 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition"
                          >
                            <FaTimes size={8} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addPhone(pi)}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 transition"
                    >
                      <FaPlus size={8} /> ಫೋನ್ ಸೇರಿಸಿ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-600 transition"
          >
            ರದ್ದು
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm font-bold shadow hover:opacity-90 disabled:opacity-40 transition"
          >
            ಉಳಿಸಿ
          </button>
        </div>
      </div>
    </div>
  );
}
