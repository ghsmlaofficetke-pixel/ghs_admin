import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

import { AppDispatch, RootState } from "../../../../redux/store";
import {
  fetchPanchaythPatanaWards,
  updateWard,
} from "../../../../api/ward";

import WardEditModal from "./wardEditModal";

import WardManavi from "./manavi/WardManavi";
import WardWorks from "./works/WardWork";

export default function WardIndex() {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { panchayath, id } = useParams<{ panchayath?: string; id?: string }>();

  const wardState = useSelector((state: RootState) => state.ward);

  const wards = wardState?.list || [];

  const [searchText, setSearchText] = useState("");

  const [openWard,setOpenWard] = useState<string | null>(null);

  const [editOpen,setEditOpen] = useState(false);
  const [editData,setEditData] = useState<any>(null);

  const [activeTab,setActiveTab] = useState<"manavi"|"works">("manavi");

  /* ================= PANCHAYATH MAP ================= */

  const PANCHAYATH_ID_MAP: Record<string,string> = {

    purasabetarikere : "69a9303f2e0f1228f681877b",
    panchayathajjampura : "69a9305c2e0f1228f681877d",

  };

  const panchayathId = panchayath
    ? PANCHAYATH_ID_MAP[panchayath.toLowerCase()]
    : "";

  /* ================= LOAD WARDS ================= */

  useEffect(()=>{

    if(panchayathId){

      dispatch(fetchPanchaythPatanaWards(panchayathId));

    }

  },[dispatch,panchayathId]);

  /* ================= SEARCH ================= */

  const filteredWards = useMemo(()=>{

    const q = searchText.toLowerCase();

    if(!q) return wards;

    return wards.filter((w:any)=>
      (`${w?.wardNo} ${w?.name}`)
      .toLowerCase()
      .includes(q)
    );

  },[wards,searchText]);

  /* ================= EXPAND ================= */

  const toggleWard = (id:string)=>{

    setOpenWard(openWard === id ? null : id);

  };

  /* ================= EDIT SAVE ================= */

  const handleSave = (data:any)=>{

    if(!data?._id) return;

    dispatch(updateWard(data._id,{
      ...data,
      panchayatipatanaId:panchayathId
    }));

    setEditOpen(false);

  };

  /* ================= TITLE ================= */

  const title =
    panchayath?.toLowerCase()==="panchayathajjampura"
      ? "ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ"
      : "ಪುರಸಭೆ ತರೀಕೆರೆ";

  return (

    <div className="h-[calc(100vh-160px)] flex flex-col bg-gray-50">

      {/* ================= HEADER ================= */}

      <div className="sticky top-0 z-20 bg-white dark:bg-[#1f2a38] shadow">

       <div className="flex items-center justify-between py-2 px-3">

  {/* LEFT - BACK BUTTON */}

  <button
    onClick={() => navigate(-1)}
    className="flex items-center justify-center 
    w-8 h-8 rounded-full bg-gradient-to-r 
    from-[#2466d1] to-cyan-500 text-white shadow"
  >
    <FaArrowLeft size={14} />
  </button>

  {/* CENTER - TITLE */}

  <h1 className="font-bold text-sm md:text-lg text-center flex-1">
    {title}
  </h1>

  {/* RIGHT SIDE */}

  <div className="flex items-center gap-2">

    {/* COUNT */}

    {!id && (
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 
      text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
        ಒಟ್ಟು: {filteredWards.length}
      </div>
    )}

    {/* TABS */}

    {id && (
      <div className="flex gap-2">

        <button
          onClick={() => setActiveTab("manavi")}
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            activeTab === "manavi"
              ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
              : "bg-gray-200"
          }`}
        >
          ಮನವಿಗಳು
        </button>

        <button
          onClick={() => setActiveTab("works")}
          className={`px-3 py-1 rounded text-sm whitespace-nowrap ${
            activeTab === "works"
              ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
              : "bg-gray-200"
          }`}
        >
          ಕೆಲಸಗಳು
        </button>

      </div>
    )}

  </div>

</div>

        {/* SEARCH */}

        {!id && (

          <div className="px-3 pb-3">

            <input
              type="text"
              placeholder="ವಾರ್ಡ್ ಹುಡುಕಿ..."
              value={searchText}
              onChange={(e)=>setSearchText(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />

          </div>

        )}

      </div>

      {/* ================= CONTENT ================= */}

      <div className="flex-1 overflow-y-auto p-3 space-y-3">

        {/* ================= WARD MANAVI / WORK ================= */}

        {id && (

          <div className="bg-white p-2 rounded-lg shadow">

            {activeTab==="manavi" && <WardManavi/>}

            {activeTab==="works" && <WardWorks/>}

          </div>

        )}

        {/* ================= WARD LIST ================= */}

        {!id && (

          filteredWards?.map((ward:any)=> (

            <div
              key={ward._id}
              onClick={()=>navigate(`/apps/panchayath/${panchayath}/ward/${ward._id}`)}
              className="bg-white border rounded-xl shadow-sm p-4 relative cursor-pointer hover:shadow-md transition"
            >

              {/* EDIT BUTTON */}

              <button
                onClick={(e)=>{
                  e.stopPropagation();
                  setEditData(ward);
                  setEditOpen(true);
                }}
                className="absolute top-3 right-3"
              >
                <span className="text-xs bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white px-3 py-1 rounded-full">
                  Edit
                </span>
              </button>

              {/* WARD NAME */}

              <div className="font-bold text-[14px] sm:text-[16px] 
              bg-gradient-to-r from-[#2466d1] to-cyan-500 
              bg-clip-text text-transparent">

             {ward?.wardNo} - {ward?.name}

              </div>

              {/* CONTACT HEADER */}

              <div
                onClick={(e)=>{
                  e.stopPropagation();
                  toggleWard(ward._id);
                }}
                className="mt-3 flex items-center gap-2 cursor-pointer"
              >

                <span
                  className={`transform transition-transform text-pink-600 ${
                    openWard===ward._id ? "rotate-90" : ""
                  }`}
                >
                  ▶
                </span>

                <span className="font-semibold">

                  ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಗಳು

                </span>

              </div>

              {/* CONTACT LIST */}

              {openWard===ward._id && (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">

                  {ward?.contactPersons?.length ? (

                    ward.contactPersons.map((p:any,i:number)=> (

                      <div
                        key={i}
                        className="flex justify-between bg-gray-50 border rounded-lg px-3 py-2"
                      >

                        <div>👤 {p.name}</div>

                        <div className="flex gap-2">

                          {p?.phones?.map((ph:string,idx:number)=> (

                            <a
                              key={idx}
                              href={`tel:${ph}`}
                              onClick={(e)=>e.stopPropagation()}
                              className="text-blue-600 text-sm"
                            >

                              📞 {ph}

                            </a>

                          ))}

                        </div>

                      </div>

                    ))

                  ) : (

                    <div className="text-gray-500">

                      ಸಂಪರ್ಕ ಮಾಹಿತಿ ಇಲ್ಲ

                    </div>

                  )}

                </div>

              )}

            </div>

          ))

        )}

      </div>

      {/* ================= EDIT MODAL ================= */}

      <WardEditModal
        open={editOpen}
        onClose={()=>setEditOpen(false)}
        ward={editData}
        onSave={handleSave}
      />

    </div>

  );

}