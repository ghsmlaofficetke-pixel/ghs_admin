import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";

import {
  fetchAllSchem,
  createSchem,
  updateSchem,
  deleteSchem,
  schemSelector,
} from "../../../api/schem";

import { Pencil, Trash2 } from "lucide-react";
import SchemDetails from "./schemDetails";
import { FaArrowLeft } from "react-icons/fa";

export default function SchemPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector(schemSelector);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* ================= INIT ================= */
  useEffect(() => {
    dispatch(fetchAllSchem());
  }, [dispatch]);

  /* ================= REFRESH AFTER BACK ================= */
  useEffect(() => {
    if (!selectedId) {
      dispatch(fetchAllSchem());
    }
  }, [selectedId]);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editId) {
      dispatch(
        updateSchem(editId, {
          name: name.trim(),
          description: description.trim(),
        })
      );
    } else {
      dispatch(
        createSchem({
          name: name.trim(),
          description: description.trim(),
        })
      );
    }

    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditId(null);
    setOpenModal(false);
  };

  /* ================= EDIT ================= */
  const handleEdit = (item: any) => {
    setName(item.name);
    setDescription(item.description || "");
    setEditId(item._id);
    setOpenModal(true);
  };

  /* ================= DELETE ================= */
  const handleDeleteConfirm = () => {
    if (deleteId) {
      dispatch(deleteSchem(deleteId));
      setDeleteId(null);
    }
  };

  /* ================= SEARCH ================= */
  const filteredList = (list || []).filter((item: any) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= DETAILS ================= */
  if (selectedId) {
    return (
      <SchemDetails
        schemId={selectedId}
        onBack={() => {
          setSelectedId(null);
          dispatch(fetchAllSchem());
        }}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">

      {/* HEADER */}
     <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b px-4 py-3">

  {/* ===== MOBILE HEADER ===== */}
  <div className="flex items-center justify-between sm:hidden">

    {/* BACK */}
    <button
      onClick={() => window.history.back()}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
    >
       <FaArrowLeft size={14} />
    </button>

    {/* TITLE */}
    <h1 className="text-sm font-semibold text-gray-800 text-center">
      ವಿವಿಧ ಅನುದಾನಗಳು
    </h1>

    {/* ADD */}
    <button
      onClick={() => setOpenModal(true)}
      className="px-3 py-1 rounded bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-xs"
    >
       + ಸೇರಿಸಿ
    </button>
  </div>

  {/* MOBILE SEARCH */}
  <div className="mt-3 sm:hidden">
    <input
      type="text"
      placeholder="ಹುಡುಕಿ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
    />
  </div>

  {/* ===== DESKTOP HEADER ===== */}
  <div className="hidden sm:flex sm:items-center sm:justify-between gap-3">

    <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
      ವಿವಿಧ ಅನುದಾನಗಳು
    </h1>

    <div className="flex gap-2">

      <input
        type="text"
        placeholder="ಹುಡುಕಿ..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64 border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
      />

      <button
        onClick={() => setOpenModal(true)}
        className="px-4 py-2 rounded bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white text-sm"
      >
        + ಸೇರಿಸಿ
      </button>

    </div>
  </div>

</div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">

        {loading ? (
          /* LOADING */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : filteredList.length === 0 ? (
          /* EMPTY */
          <div className="text-center text-gray-400 mt-10 text-sm">
            ಯಾವುದೇ ಯೋಜನೆಗಳು ಲಭ್ಯವಿಲ್ಲ
          </div>
        ) : (
          /* CARDS */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList?.map((item: any) => (
              <div
                key={item._id}
                onClick={() => setSelectedId(item._id)}
                className="group rounded-2xl p-[1px] bg-gradient-to-r from-[#2466d1]/30 to-cyan-400/30 hover:from-[#2466d1] hover:to-cyan-300 transition-all cursor-pointer"
              >
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-blue-200/40 via-cyan-200/30 to-indigo-200/40 group-hover:from-blue-400/60 group-hover:to-cyan-400/60 transition-all">

                  <div className="relative bg-gradient-to-br from-white to-blue-50/60 rounded-2xl p-5 h-full flex flex-col justify-between shadow-sm group-hover:shadow-xl transition">

                    <div>
                      <h2 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition">
                        {item.name}
                      </h2>

                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {item?.description || "ವಿವರಣೆ ಇಲ್ಲ"}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 opacity-70 group-hover:opacity-100">
                      <Pencil
                        size={16}
                        className="text-blue-600 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                      />

                      <Trash2
                        size={16}
                        className="text-red-500 hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteId(item._id);
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div
            className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-800">
              {editId ? "ಅನುದಾನ ತಿದ್ದುಪಡಿ" : "ಹೊಸ ಅನುದಾನ ಸೇರಿಸಿ"}
            </h2>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ಅನುದಾನ ಹೆಸರು"
              className="w-full border px-3 py-2 rounded text-sm"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ವಿವರಣೆ"
              rows={3}
              className="w-full border px-3 py-2 rounded text-sm"
            />

            <div className="flex justify-end gap-2">
              <button onClick={resetForm} className="px-4 py-2 border rounded text-sm">
                ರದ್ದು
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-sm text-white rounded bg-gradient-to-r from-[#2466d1] to-cyan-500"
              >
                ಉಳಿಸಿ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}

       {deleteId && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setDeleteId(null)}
  >
    <div
      className="bg-white p-5 rounded-xl w-full max-w-sm shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold mb-3 text-red-600">
        ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        ನೀವು ಈ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?
        <br />
        ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
        >
          ರದ್ದುಮಾಡಿ
        </button>

        <button
          onClick={handleDeleteConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          ಅಳಿಸಿ
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}