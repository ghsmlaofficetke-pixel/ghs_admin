import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  createStatdata,
  updateStatdata,
} from "../../../api/statdata";

interface Props {
  close: () => void;
  group: string;
  groups: any[];
  editData?: any;
  taluk: string;
}

const AddDataModal = ({ close, group, groups, editData, taluk }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(group);

  /* ================= AUTO FILL ================= */
 useEffect(() => {
  if (editData) {
    setTitle(editData.title || "");
    setValue(editData.value || "");

    // 🔥 FIX: handle object OR string
    setSelectedGroup(
      typeof editData.group === "object"
        ? editData.group._id
        : editData.group || group
    );
  } else {
    setTitle("");
    setValue("");
    setSelectedGroup(group);
  }
}, [editData, group]);

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    if (!title || !value || !selectedGroup || !taluk) {
      alert("All fields required");
      return;
    }

    const payload = {
      title,
      value,
      group: selectedGroup, // ✅ backend match
      taluk,                // ✅ important
    };

    if (editData) {
      dispatch(updateStatdata(editData._id, payload));
    } else {
      dispatch(createStatdata(payload));
    }

    close();
  };

  return (
    <div
  className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-3"
  onClick={close}
>
  <div
    className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-xl"
    onClick={(e) => e.stopPropagation()}
  >

    {/* HEADER */}
    <h2 className="text-lg font-semibold text-gray-800">
      {editData ? "ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ" : "ಮಾಹಿತಿ ಸೇರಿಸಿ"}
    </h2>

    {/* FORM */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

      {/* GROUP SELECT */}
      <select
        value={selectedGroup}
        onChange={(e) => setSelectedGroup(e.target.value)}
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none col-span-full"
      >
        <option value="">Select Group</option>
        {groups.map((g: any) => (
          <option key={g._id} value={g._id}>
            {g.name}
          </option>
        ))}
      </select>

      {/* TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ವಿವರಣೆ"
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />

      {/* VALUE */}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="ಸಂಖ್ಯೆ"
        className="border border-slate-400 p-2 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
      />
    </div>

    {/* ACTIONS */}
    <div className="flex justify-end gap-2 pt-2">
      <button
        onClick={close}
        className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
      >
        ರದ್ದು
      </button>

      <button
        onClick={handleSubmit}
        className="px-5 py-2 rounded text-sm text-white bg-gradient-to-r from-[#2466d1] to-cyan-500 hover:scale-105 transition"
      >
        {editData ? "Update" : "Save"}
      </button>
    </div>

  </div>
</div>
  );
};

export default AddDataModal;