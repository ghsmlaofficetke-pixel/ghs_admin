import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  createGovtOffice,
  updateGovtOffice,
} from "../../../api/govtoffice";

export default function GovtOfficeEditModal({
  open,
  onClose,
  govtoffice,
  panchayatId,
}: any) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;

    setName(govtoffice?.office_name || "");

    const formattedContacts =
      govtoffice?.office_contact?.map((c: any) => ({
        name: c.name || "",
        designation: c.designation || "",
        phones: c.phones?.length ? c.phones : [""],
      })) || [];

    setContacts(formattedContacts);
  }, [open, govtoffice]);

  if (!open) return null;

 const handleSave = async () => {
  if (!name) return;

  if (getDuplicatePhones().length > 0) {
    return; // ❌ stop save
  }

  const payload = {
    office_name: name,
    office_contact: contacts,
    panchayatipatana: panchayatId,
  };

  try {
    if (govtoffice?._id) {
      await dispatch(updateGovtOffice(govtoffice._id, payload));
    } else {
      await dispatch(createGovtOffice(payload));
    }

    onClose();
  } catch (err: any) {
    console.log(err);
  }
};


 const getDuplicatePhones = () => {
  const allPhones = contacts
    .flatMap(c => c.phones)
    .map(ph => ph.trim())
    .filter(ph => ph);

  const duplicates = allPhones.filter(
    (ph, i) => allPhones.indexOf(ph) !== i
  );

  return duplicates;
};


  const updateContact = (index: number, field: string, value: any) => {
    const copy = [...contacts];
    copy[index] = { ...copy[index], [field]: value };
    setContacts(copy);
  };

  const updatePhone = (i: number, j: number, value: string) => {
    const copy = [...contacts];
    const phones = [...copy[i].phones];
    phones[j] = value;
    copy[i].phones = phones;
    setContacts(copy);
  };



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-xl p-5 rounded-2xl shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">ಇಲಾಖೆ ವಿವರ</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* OFFICE NAME */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ಆಫೀಸ್ ಹೆಸರು"
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 p-2 rounded-lg mb-4 outline-none"
        />

        {/* CONTACT LIST */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">

          {contacts.map((c, i) => (
            <div
              key={i}
              className="relative border rounded-xl p-4 bg-gray-50 shadow-sm"
            >

              {/* DELETE ICON TOP RIGHT */}
              <button
                onClick={() =>
                  setContacts(contacts.filter((_, idx) => idx !== i))
                }
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <FaTrash size={14} />
              </button>

              {/* NAME */}
              <input
                value={c.name}
                onChange={(e) =>
                  updateContact(i, "name", e.target.value)
                }
                placeholder="ಹೆಸರು"
                className="w-full border p-2 rounded-lg mb-2 focus:ring-1 focus:ring-blue-400 outline-none"
              />

              {/* DESIGNATION */}
              <input
                value={c.designation}
                onChange={(e) =>
                  updateContact(i, "designation", e.target.value)
                }
                placeholder="ಪದನಾಮ"
                className="w-full border p-2 rounded-lg mb-3 focus:ring-1 focus:ring-blue-400 outline-none"
              />

              {/* PHONES */}
             {c.phones.map((ph: string, j: number) => {
  const duplicates = getDuplicatePhones();
  const isDup = duplicates.includes(ph);

  return (
    <div key={j}>
      <input
        value={ph}
        onChange={(e) => updatePhone(i, j, e.target.value)}
        placeholder="ಫೋನ್ ಸಂಖ್ಯೆ"
        className={`w-full border p-2 rounded-lg mb-1 outline-none ${
          isDup ? "border-red-500 bg-red-50" : ""
        }`}
      />

      {isDup && (
        <p className="text-red-500 text-xs mb-2">
         ಒಂದೇ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಮರು ನಮೂದಿಸಬೇಡಿ
        </p>
      )}
    </div>
  );
})}

              {/* ADD PHONE */}
              <button
                onClick={() => {
                  const copy = [...contacts];
                  copy[i].phones = [...copy[i].phones, ""];
                  setContacts(copy);
                }}
                className="text-green-600 text-sm flex items-center gap-1"
              >
                <FaPlus size={12} /> Add Phone
              </button>

            </div>
          ))}

          {/* ADD CONTACT */}
          <button
            onClick={() =>
              setContacts([
  ...contacts,
  { name: "", designation: "", phones: [""] },
])
            }
            className="w-full border-2 border-dashed border-blue-400 text-blue-600 py-2 rounded-xl hover:bg-blue-50 flex justify-center items-center gap-2"
          >
            <FaPlus /> ಹೊಸ Contact ಸೇರಿಸಿ
          </button>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-1 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}