
import { useEffect } from "react";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllHoblis, hobliSelector } from "../../api/hobli";
import { fetchAllGramaPanchayaths } from "../../api/gramapanchayath";
import { fetchAllVillages } from "../../api/village";
import { ChevronRight, ClipboardList, Map, Building2, Landmark } from "lucide-react";
import map from "../../assets/images/brands/poster.webp";
import { useNavigate } from "react-router-dom";
import TaskWidget from "./components/TaskWidget";

const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const hobliState = useSelector(hobliSelector);
  const gpState = useSelector((state: RootState) => state.gramaPanchayath);
  const villageState = useSelector((state: RootState) => state.village);

  const hoblis = hobliState?.all_hobli || [];
  const gramaPanchayaths = gpState?.list || [];
  const villages = villageState?.list || [];

  useEffect(() => {
    dispatch(fetchAllHoblis());
    dispatch(fetchAllGramaPanchayaths());
    dispatch(fetchAllVillages());
  }, [dispatch]);

  const mobileCards = [
    {
      title: "ತರೀಕೆರೆ (ತಾ)",
      subtitle: "Tarikere",
      icon: <ClipboardList size={24} />,
      bg: "from-purple-500 to-indigo-500",
      path: "/apps/taluk/tarikere",
    },
    {
    title: "ಅಜ್ಜಂಪುರ (ತಾ)",
    subtitle: "Ajjampura",
    icon: <ClipboardList size={24} />, // ✅ changed
    bg: "from-yellow-500 to-orange-500",
    path: "/apps/taluk/ajjampura",
  },
  {
    title: "ಪುರಸಭೆ ತರೀಕೆರೆ",
    subtitle: "Municipality",
    icon: <Landmark size={24} />, // ✅ changed
    bg: "from-pink-500 to-rose-500",
    path: "/apps/panchayath/purasabetarikere",
  },
  {
    title: "ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ",
    subtitle: "Town Panchayat",
    icon: <Landmark size={24} />, // ✅ changed
    bg: "from-green-500 to-emerald-500",
    path: "/apps/panchayath/panchayathajjampura",
  },
  ];

  return (
    <>
      {/* ================= DESKTOP VIEW ================= */}

    <div className="hidden md:grid xl:grid-cols-5 md:grid-cols-2 gap-6 mb-2 ">

 <TaskWidget title="ತಾಲ್ಲೂಕುಗಳು" time={2} />
  <TaskWidget title="ಹೋಬಳಿಗಳು" time={hoblis.length} />
  <TaskWidget title="ಪಂಚಾಯತಿಗಳು" time={gramaPanchayaths.length} />
  <TaskWidget title="ಗ್ರಾಮಗಳು" time={villages.length} /> 

  {/* LAST BOX */}

  <div className="bg-gradient-to-r from-blue-50 to-indigo-50  rounded-xl shadow-sm p-2 flex flex-col justify-between">

    <div className="flex flex-col gap-2">

      {/* PURASABE */}

      <div
        onClick={() => navigate("/apps/panchayath/purasabetarikere")}
        className="flex items-center justify-between bg-white hover:bg-blue-100 px-3 py-1 rounded-lg cursor-pointer transition"
      >
        <span className="text-[#275799] text-[14px] font-semibold ">
          ಪುರಸಭೆ ತರೀಕೆರೆ
        </span>

       {/* <span className="text-[#9c1315] text-md font-bold">= 23</span> */}
      </div>

      {/* TOWN PANCHAYATH */}

      <div
        onClick={() => navigate("/apps/panchayath/panchayathajjampura")}
        className="flex items-center justify-between bg-white hover:bg-green-100 px-3 py-1 rounded-lg cursor-pointer transition"
      >
        <span className="text-[#275799] text-[14px] font-semibold">
          ಪಟ್ಟಣ ಪಂಚಾಯಿತಿ ಅಜ್ಜಂಪುರ 
        </span>

        {/* <span className="text-[#9c1315] text-md font-bold">= 11</span> */}
      </div>

    </div>

  </div>

</div>

      {/* ================= MOBILE VIEW ================= */}

      <div className="md:hidden px-3 py-2 bg-gray-100 flex flex-col gap-2">

  {/* MAP */}

  <div className="bg-white rounded-xl shadow-sm p-2">
    <img
      src={map}
      alt="Tarikere Taluk Map"
     className="w-full h-[220px] sm:h-[300px] lg:h-[350px] object-contain border rounded"
    />
  </div>

  {/* TP BUTTON */}

  <div
  onClick={() => navigate("/apps/calendar")}
  className="bg-gradient-to-r from-[#76a0e6] to-cyan-200 rounded-xl shadow-md mt-2 p-4 mb-3 flex items-center justify-between cursor-pointer hover:shadow-lg transition"
>
  
  {/* LEFT ICON */}

  <div className="flex items-center gap-3">

    <div className="bg-purple-50 text-blue-600 w-12 h-12 flex items-center justify-center rounded-xl">
      <ClipboardList size={22} />
    </div>

    <div>
      <h2 className="text-sm font-semibold text-gray-800">
        TP ( ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು )
      </h2>

      <p className="text-xs text-gray-500">
        Tour Programme
      </p>
    </div>

  </div>

  {/* RIGHT ARROW */}

  <ChevronRight size={22} className="text-gray-400" />

</div>

  {/* CARDS */}

  <div className="grid grid-cols-2 gap-4">

{mobileCards.map((card, index) => (
  <div
    key={index}
    onClick={() => navigate(card.path)}
    className="group relative rounded-2xl p-[1px] border-gradient-to-r from-[#2466d1] to-cyan-500 cursor-pointer active:scale-95 transition-all duration-200"
  >
    {/* INNER CARD */}
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 text-center shadow-sm group-hover:shadow-lg transition">

      {/* ICON */}
      <div
        className={`bg-gradient-to-r ${card.bg} text-white w-11 h-11 flex items-center justify-center rounded-xl mx-auto mb-2 shadow-md group-hover:scale-110 transition`}
      >
        {card.icon}
      </div>

      {/* TITLE */}
      <h3 className="font-semibold text-[#2466d1] text-[13px] leading-tight">
        {card.title}
      </h3>

      {/* SUBTITLE */}
      <p className="text-[11px] text-gray-500 mt-1 leading-snug">
        {card.subtitle}
      </p>

    </div>

    {/* GLOW EFFECT */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-[#2466d1]/10 to-cyan-500/10 blur-md"></div>
  </div>
))}

  </div>

</div>
    </>
  );
};

export default Tasks;