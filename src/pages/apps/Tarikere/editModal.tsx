import { useEffect, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface Person {
  name: string;
  phones: string[];
}

interface EditModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  type: "gp" | "village";
  initialData: any;
  onSave: (data: any) => void;
}

export default function EditModal({
  open,
  onClose,
  title,
  type,
  initialData,
  onSave,
}: EditModalProps) {
  const [name, setName] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    if (!open) return;

    setName(initialData?.name || "");

    if (type === "gp") {
      setPersons(
        initialData?.pdo ? JSON.parse(JSON.stringify(initialData.pdo)) : []
      );
    } else {
      setPersons(
        initialData?.contactPersons
          ? JSON.parse(JSON.stringify(initialData.contactPersons))
          : []
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

 const addPerson = () => 
  {setPersons((prev) => [{ name: "", phones: [""] },
    ...prev,
  ]);
};

  const removePerson = (idx: number) => {
    setPersons(persons.filter((_, i) => i !== idx));
  };

  const updatePersonName = (idx: number, value: string) => {
    const copy = [...persons];
    copy[idx].name = value;
    setPersons(copy);
  };

  const updatePhone = (pIdx: number, phIdx: number, value: string) => {
    const copy = [...persons];
    copy[pIdx].phones[phIdx] = value;
    setPersons(copy);
  };

  const addPhone = (pIdx: number) => {
    const copy = [...persons];
    copy[pIdx].phones.push("");
    setPersons(copy);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("ಹೆಸರು ಹಾಕಿ");
      return;
    }

    const payload =
      type === "gp"
        ? { ...initialData, name, pdo: persons }
        : { ...initialData, name, contactPersons: persons };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3"
     onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-4 overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-3">{title}</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold">ಹೆಸರು</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
              placeholder="ಹೆಸರು"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-sm">
                {type === "gp" ? "PDO ವಿವರಗಳು" : "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು"}
              </span>
              <button
                onClick={addPerson}
                className="flex items-center gap-1 text-sm text-blue-600"
              >
                <FaPlus /> Add
              </button>
            </div>

            <div className="space-y-3">
              {persons?.map((p, pIdx) => (
                <div key={pIdx} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
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
                      title="Delete Person"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {p?.phones?.map((ph, phIdx) => (
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

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
