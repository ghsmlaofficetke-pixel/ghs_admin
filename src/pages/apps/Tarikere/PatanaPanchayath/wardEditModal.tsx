import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface Person {
  name: string;
  phones: string[];
}

interface WardEditModalProps {
  open: boolean;
  onClose: () => void;
  ward: any;
  onSave: (data: any) => void;
}

export default function WardEditModal({
  open,
  onClose,
  ward,
  onSave,
}: WardEditModalProps) {

  const [name, setName] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    if (!open) return;

    setName(ward?.name || "");

    setPersons(
      ward?.contactPersons
        ? JSON.parse(JSON.stringify(ward.contactPersons))
        : []
    );

  }, [open, ward]);

  if (!open) return null;

  /* ADD PERSON */

  const addPerson = () => {
    setPersons((prev) => [
      { name: "", phones: [""] },
      ...prev,
    ]);
  };

  /* REMOVE PERSON */

  const removePerson = (idx: number) => {
    setPersons(persons.filter((_, i) => i !== idx));
  };

  /* UPDATE NAME */

  const updatePersonName = (idx: number, value: string) => {
    const copy = [...persons];
    copy[idx].name = value;
    setPersons(copy);
  };

  /* UPDATE PHONE */

  const updatePhone = (pIdx: number, phIdx: number, value: string) => {
    const copy = [...persons];
    copy[pIdx].phones[phIdx] = value;
    setPersons(copy);
  };

  /* ADD PHONE */

  const addPhone = (pIdx: number) => {
    const copy = [...persons];
    copy[pIdx].phones.push("");
    setPersons(copy);
  };

  /* SAVE */

  const handleSave = () => {

    if (!name.trim()) {
      toast.error("ವಾರ್ಡ್ ಹೆಸರು ಹಾಕಿ");
      return;
    }

    const payload = {
      ...ward,
      name,
      contactPersons: persons,
    };

    onSave(payload);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3"
      onClick={onClose}
    >

      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-lg p-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* TITLE */}

        <h2 className="text-lg font-bold mb-3">
          ವಾರ್ಡ್ ಸಂಪಾದನೆ
        </h2>

        <div className="space-y-4">

          {/* WARD NAME */}

          <div>
            <label className="text-sm font-semibold">
              ವಾರ್ಡ್ ಹೆಸರು
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="ವಾರ್ಡ್ ಹೆಸರು"
            />
          </div>

          {/* CONTACT PERSONS */}

          <div>

            <div className="flex items-center justify-between mb-2">

              <span className="font-semibold text-sm">
                ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು
              </span>

              <button
                onClick={addPerson}
                className="flex items-center gap-1 text-sm text-blue-600"
              >
                <FaPlus /> Add
              </button>

            </div>

            <div className="space-y-3">

              {persons.map((p, pIdx) => (

                <div
                  key={pIdx}
                  className="border rounded-lg p-3 space-y-2"
                >

                  <div className="flex items-center">

                    <input
                      value={p.name}
                      onChange={(e) =>
                        updatePersonName(pIdx, e.target.value)
                      }
                      className="flex-1 border rounded-md p-2"
                      placeholder="ಹೆಸರು"
                    />

                    <button
                      onClick={() => removePerson(pIdx)}
                      className="ml-2 text-red-500"
                    >
                      <FaTrash />
                    </button>

                  </div>

                  <div className="space-y-2">

                    {p.phones.map((ph, phIdx) => (

                      <input
                        key={phIdx}
                        value={ph}
                        onChange={(e) =>
                          updatePhone(pIdx, phIdx, e.target.value)
                        }
                        className="w-full border rounded-md p-2"
                        placeholder="ಫೋನ್"
                      />

                    ))}

                    <button
                      onClick={() => addPhone(pIdx)}
                      className="text-sm text-green-600"
                    >
                      + Add Phone
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-2 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white rounded-lg"
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}