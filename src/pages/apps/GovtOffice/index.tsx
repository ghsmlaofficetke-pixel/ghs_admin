import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {fetchPanchaythPatanaGovtOffices,deleteGovtOffice} from "../../../api/govtoffice";
import './index.css'
import GovtOfficeEditModal from "./OfficeEditAdd";
import {FaPhone,FaEdit,FaPlus,FaTrash,FaChevronDown} from "react-icons/fa";

export default function GovtOfficeIndex() {
  const dispatch = useDispatch<AppDispatch>();
  const { list = [] } = useSelector((state: RootState) => state.govtoffice);

  const [taluk, setTaluk] = useState("tarikere");
  const [search, setSearch] = useState("");

  
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [openCard, setOpenCard] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const TALUK_MAP: any = {
    tarikere: "69a9303f2e0f1228f681877b",
    ajjampura: "69a9305c2e0f1228f681877d",
  };

  const panchayatId = TALUK_MAP[taluk];

  /* ================= FETCH ================= */
  useEffect(() => {
    if (panchayatId) {
      dispatch(fetchPanchaythPatanaGovtOffices(panchayatId));
    }
  }, [panchayatId]);

  useEffect(() => {
    setOpenCard(null); // reset accordion
  }, [list]);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return list.filter((o: any) => {
      return (
        o.office_name?.toLowerCase().includes(q) ||
        o.office_contact?.some((c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.designation?.toLowerCase().includes(q) ||
        c.phones?.some((ph: string) => ph.includes(q))
        )
      );
    });
  }, [list, search]);

  const confirmDelete = () => {
    if (deleteId && panchayatId) {
      dispatch(deleteGovtOffice(deleteId, panchayatId));
      setDeleteId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-150px)] flex flex-col bg-gray-100">

      {/* ================= HEADER ================= */}
    <div className="bg-white p-4 shadow sticky top-0 z-20 space-y-3">

        {/* TALUK */}
    <div className="flex flex-col md:flex-row md:items-center gap-3">

        {/* Heading */}
  <h1 className="md:text-center sm:hidden text-center sm:text-center font-bold text-[16px] ">
    ಇಲಾಖೆಗಳ ಸಂಪರ್ಕ
  </h1>
  
  {/* Buttons */}
  <div className="flex gap-2 flex-wrap justify-center md:justify-start">
    {["tarikere", "ajjampura"].map((t) => (
      <button
        key={t}
        onClick={() => setTaluk(t)}
        className={`px-6 py-1 rounded-full text-sm whitespace-nowrap ${
          taluk === t
            ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
            : "bg-gray-200"
        }`}
      >
        {t === "tarikere" ? "ತರೀಕೆರೆ ತಾಲ್ಲೂಕು" : "ಅಜ್ಜಂಪುರ ತಾಲ್ಲೂಕು"}
      </button>
    ))}
  </div>

  {/* Heading */}
  <h1 className=" text-center hidden sm:block font-bold text-[16px] ml-32 ">
    ಇಲಾಖೆಗಳ ಸಂಪರ್ಕ
  </h1>

</div>

        

        {/* SEARCH + ADD */}
        <div className="flex gap-2">
          <input
            placeholder="🔍 ಹುಡುಕಿ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-2 rounded"
          />

          <button
            onClick={() => {
              setEditData(null);
              setEditOpen(true);
            }}
            className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-4 text-[12px] sm:text-[14px] rounded flex items-center gap-2"
          >
            <FaPlus />
            ಹೊಸ ಇಲಾಖೆ
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto  pt-4">
        <div className="grid md:grid-cols-3 gap-4">

          {filtered.map((o: any) => (
            <div
              key={o._id}
              className="bg-white rounded-xl shadow border hover:shadow-lg transition"
            >

              {/* CARD HEADER */}
              <div className="flex justify-between items-center p-3 bg-[#265899] text-white rounded-t-xl">
                <div className="font-semibold text-sm">
                  {o.office_name}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditData(o);
                      setEditOpen(true);
                    }}
                  >
                    <FaEdit />
                  </button>

                  <button onClick={() => setDeleteId(o._id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* TOGGLE */}
              <div
                onClick={() =>
                  setOpenCard(prev => prev === o._id ? null : o._id)
                }
                className="p-3 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FaPhone className="text-red-500" />
                  ಸಂಪರ್ಕಗಳು
                </div>

                <FaChevronDown
                  className={`transition-transform ${
                    openCard === o._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* CONTACTS */}
              {openCard === o._id && (
                <div className="p-3 space-y-3 border-t bg-gray-50 animate-fadeIn">

                  {o.office_contact?.length ? (
                    o.office_contact.map((c: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                      >
                        <div className="text-sm font-semibold text-gray-800">
                          {c.designation}
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          {c.name}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {c.phones.map((ph: string, idx: number) => (
                            <a
                              key={idx}
                              href={`tel:${ph}`}
                              className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              <FaPhone size={10} />
                              {ph}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 text-center">
                      ಯಾವುದೇ ಸಂಪರ್ಕಗಳಿಲ್ಲ
                    </div>
                  )}

                </div>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* ================= DELETE MODAL ================= */}
   {deleteId && (
  <div
    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    onClick={() => setDeleteId(null)}
  >
    <div
      className="bg-white p-5 rounded-xl w-full max-w-sm shadow-lg text-start"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-bold mb-3 text-red-600">
        ಅಳಿಸುವುದು ದೃಢೀಕರಿಸಿ
      </h2>

      <p className="text-sm text-gray-700 mb-4">
        ನೀವು ಈ ಕಚೇರಿ ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?
        <br />
        ಈ ಕ್ರಿಯೆಯನ್ನು ಹಿಂದಿರುಗಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.
      </p>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setDeleteId(null)}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
        >
          ರದ್ದುಮಾಡಿ
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
        >
          ಅಳಿಸಿ
        </button>
      </div>
    </div>
  </div>
)}

      {/* ================= MODAL ================= */}
      <GovtOfficeEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        govtoffice={editData}
        panchayatId={panchayatId}
      />
    </div>
  );
}