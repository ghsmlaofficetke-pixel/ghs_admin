import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  fetchConsolidatedManavi,
  manaviSelector,
} from "../../../../api/manavi";
import { fetchAllpatana, patanaSelector } from "../../../../api/patana";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import html2pdf from "html2pdf.js";

/* ===============================
   MAIN COMPONENT
================================= */
const ManaviDashboard = () => {
const dispatch = useDispatch<AppDispatch>();
const { consolidated, loading } = useSelector(manaviSelector);
const { list: all_patana } = useSelector(patanaSelector);
const [expandedCard, setExpandedCard] = useState<string | string[] | null>(null);
const [isMobile, setIsMobile] = useState(false);


console.log(consolidated)


const workOptions: any = {
    "ಸಮುದಾಯ": [
      "ರಸ್ತೆ ಕಾಮಗಾರಿ",
    "ಚರಂಡಿ ಕಾಮಗಾರಿ",
    "ಜಲ್ಲಿ ಮೆಟ್ಲಿಂಗ್",
    "ದೇವಾಲಯ",
    "ಸಮುದಾಯ ಭವನ",
    "ಶಾಲೆ",
    "ಕಾಲೇಜು",
    "ಅಂಗನವಾಡಿ",
    "ಚೆಕ್ ಡ್ಯಾಮ್",
    "ಸೇತುವೆ ಕಾಮಗಾರಿ",
    "ಸ್ಮಶಾನ",
    "ಕುಡಿಯುವ ನೀರು",
    "ಸೋಲಾರ್‌/ಹೈಮಾಸ್ಟ್‌ ಲೈಟ್",
   "ಹಕ್ಕುಪತ್ರ ವಿತರಣೆ",
    "ಇತರೆ",
  ],

"ವೈಯಕ್ತಿಕ": [
     "ಟ್ರ್ಯಾಕ್ಟರ್ ಸಬ್ಸಿಡಿ",
    "ಈರುಳ್ಳಿ ಶೆಡ್",
    "ಗಂಗಾ ಕಲ್ಯಾಣ",
    "ನೇರಸಾಲ",
    "ಉದ್ಯಮ ಶೀಲತಾ",
    "ಸ್ವಾವಲಂಬಿ ಸಾರಥಿ",
    "ವಿದ್ಯುತ್ ಪರಿವರ್ತಕ (TC)",
    "ಉದ್ಯೋಗಿನಿ",
    "ತ್ರಿಚಕ್ರ ವಾಹನ",
    "ಅಮೃತ ಸಿರಿ",
    "ಕೌ ಮ್ಯಾಟ್",
    "ಹೊಲಿಗೆ ಯಂತ್ರ",
    "ಅಡಿಕೆ ಸಂಸ್ಕರಣೆ ಘಟಕ",
    "ನಾಮಿನಿ ಮೆಂಬರ್ಸ್",
    "ಕುರಿ ಲೋನ್ Veternary Department",
    "ಶ್ರಮಶಕ್ತಿ ಯೋಜನೆ",
    "ವೃತ್ತಿ ಪ್ರೋತ್ಸಾಹ",
    "ಕಾರ್ಮಿಕ ಇಲಾಖೆಯ ಕಿಟ್ ಸೌಲಭ್ಯ",
    "ಹೊರಗುತ್ತಿಗೆ ಕೆಲಸ",
    "ಬಗರ್‌ ಹುಕ್ಕುಂ",
    "ಪಿಂಚಣಿ ಯೋಜನೆಗಳು",
    "ಇತರೆ"
  ]}

  /* ===============================
     FILTER STATE
  ================================= */
  const [filters, setFilters] = useState({
    type: "",
    work: "",
    patana: "",
    hobli: "",
    gp: "",
    village: "",
  });

  const [search, setSearch] = useState("");
  const [isPdf, setIsPdf] = useState(false);

  /* ===============================
     FETCH DATA
  ================================= */
  useEffect(() => {
    const delay = setTimeout(() => {
      dispatch(fetchConsolidatedManavi(filters));
    }, 400);

    return () => clearTimeout(delay);
  }, [filters]);


useEffect(() => {
  dispatch(fetchAllpatana());
}, []);




  /* ===============================
     HANDLERS
  ================================= */
  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeChange = (value: string) => {
  setFilters((prev) => ({
    ...prev,
    type: value,
    work: "" // 🔥 reset work when type changes
  }));
};


  /* ===============================
     FILTERED TABLE DATA
  ================================= */
  const filteredList = useMemo(() => {
  const list = consolidated?.list || [];

  if (!search || search.trim() === "") return list;

  const searchText = search.toLowerCase();

  return list?.filter((item: any) => {
    const combinedText = [
      item.work,
      item.type,
      item.description,
      item.gpName,
      item.villageName,
      item.wardName,
      item.patanaName,
    ]
      .filter(Boolean) // ✅ remove undefined/null
      .join(" ")
      .toLowerCase();

    return combinedText.includes(searchText);
  });
}, [search, consolidated]);

const handleReset = () => {
  setFilters({
    type: "",
    work: "",
    patana: "",
    hobli: "",
    gp: "",
    village: "",
  });setSearch("");
};


  console.log(filteredList)

useEffect(() => {
  if (isMobile) {
    setExpandedCard([]); // mobile → multiple expand
  } else {
    setExpandedCard(null); // desktop → single expand
  }
}, [isMobile]); 

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  handleResize(); // set initially
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

  /* ===============================
     EXCEL DOWNLOAD
  ================================= */
  const downloadExcel = () => {
    const data = filteredList.map((m: any, i: number) => ({
      "ಕ್ರಮ ಸಂಖ್ಯೆ": i + 1,
      "ಗ್ರಾಮ ಪಂಚಾಯತ್": m?.source === "WARD"
    ? m?.patanaName || "Ward Area"
    : m?.gpName || "-",
      "ಗ್ರಾಮ":  m?.source === "WARD"
    ? m?.wardName || "-"
    : m?.villageName || "-",
      "ಕೆಲಸ": m.work,
      "ಪ್ರಕಾರ": m.type,
      "ವಿವರಣೆ": m.description,
      "ಜಾತಿ": m.caste,
      "Refrence":m.refer,
      "Status":m.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Report");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    saveAs(new Blob([buffer]), "Manavi_Report.xlsx");
  };

  /* ===============================
     PDF DOWNLOAD
  ================================= */
  const handlePdfDownload = () => {
    const element = document.getElementById("pdf-area");
    if (!element) return;

    setIsPdf(true);

    setTimeout(() => {
    const opt = {
  margin: 5,
  filename: "Manavi_Report.pdf",
  image: { type: "jpeg", quality: 1 },
  html2canvas: {
    scale: 2,
    useCORS: true,
  },
  jsPDF: {
    unit: "mm",
    format: "a4",
    orientation: "landscape",
  },
  pagebreak: {
    mode: ["avoid-all", "css", "legacy"],
  },
};
      (html2pdf() as any)
        .from(element)
        .set(opt)
        .save()
        .then(() => setIsPdf(false));
    }, 800);
  };


  


  /* ===============================
     UI
  ================================= */

   return (
  <div className="h-[calc(100vh-150px)] flex flex-col overflow-hidden">

    <div className="flex-shrink-0 space-y-3 p-2 bg-gray-50 sticky top-0 z-20">

      {/* FILTER SECTION */}
      <div className="bg-white p-2 rounded-xl shadow grid grid-cols-1 md:grid-cols-3 gap-3 sticky top-0">

        <h1 className="text-md font-bold text-[#265899]">ಕ್ರೋಡಿಕೃತ ಮನವಿಗಳ ವರದಿ</h1>

        <select
  value={filters.type}
  onChange={(e) => handleTypeChange(e.target.value)}
  className="border p-1 rounded"
>
  <option value="">ಎಲ್ಲಾ ವಿಧ</option>
  <option value="ವೈಯಕ್ತಿಕ">ವೈಯಕ್ತಿಕ</option>
  <option value="ಸಮುದಾಯ">ಸಮುದಾಯ</option>
</select>

        <select
  value={filters.work}
  onChange={(e) => handleChange("work", e.target.value)}
  className="border p-1 rounded"
>
  <option value="">Select Work</option>

  {(workOptions[filters.type] || []).map((w: string, i: number) => (
    <option key={i} value={w}>
      {w}
    </option>
  ))}
</select>


 {(filters?.type || search) && (
            <button
              onClick={handleReset}
              className="shrink-0 bg-red-50 text-red-600 border border-red-200 rounded-lg
                         px-3 py-[3px] text-xs font-semibold hover:bg-red-500 hover:text-white
                         transition-colors whitespace-nowrap w-28"
            >
              ✕ Reset
            </button>
          )}

      </div>

      {/* TOTAL */}
      

      {/* CARDS */}
         <div className="md:hidden flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
          {[
            { title: "ತಾಲ್ಲೂಕು ಪ್ರಕಾರ",         data: consolidated?.patanaWise },
            { title: "ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಪ್ರಕಾರ",   data: consolidated?.gpWise },
            { title: "ಗ್ರಾಮ ಪ್ರಕಾರ",             data: consolidated?.villageWise },
            { title: "ವಾರ್ಡ್ ಪ್ರಕಾರ",            data: consolidated?.wardWise },
          ].map(({ title, data }) => (
            <div key={title} className="snap-start flex-shrink-0 w-[75vw]">
              <Card
                title={title}
                data={data}
                expandedCard={expandedCard}
                setExpandedCard={setExpandedCard}
                isMobile={true}
              />
            </div>
          ))}
        </div>

        {/* Desktop grid — hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          <Card title="ತಾಲ್ಲೂಕು ಪ್ರಕಾರ"       data={consolidated?.patanaWise}   expandedCard={expandedCard} setExpandedCard={setExpandedCard} isMobile={false} />
          <Card title="ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಪ್ರಕಾರ" data={consolidated?.gpWise}       expandedCard={expandedCard} setExpandedCard={setExpandedCard} isMobile={false} />
          <Card title="ಗ್ರಾಮ ಪ್ರಕಾರ"           data={consolidated?.villageWise}  expandedCard={expandedCard} setExpandedCard={setExpandedCard} isMobile={false} />
          <Card title="ವಾರ್ಡ್ ಪ್ರಕಾರ"          data={consolidated?.wardWise}     expandedCard={expandedCard} setExpandedCard={setExpandedCard} isMobile={false} />
        </div>

      {/* SEARCH + ACTION */}
   <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">


     

  {/* 🔍 SEARCH */}
  <div className="w-full md:w-auto">
    <input
      type="text"
      placeholder="ಹುಡುಕಿ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full md:w-[350px] lg:w-[450px] border border-gray-300 rounded-full px-4 py-1 text-sm focus:ring-2 focus:ring-blue-200 outline-none"
    />
  </div>

  {/* 📊 TOTAL + BUTTONS (MOBILE SAME ROW) */}
  <div className="flex items-center justify-between gap-2 w-full md:w-auto">

    {/* TOTAL */}
    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow text-sm font-bold whitespace-nowrap">
      ಒಟ್ಟು : {consolidated?.total || 0}
    </div>

    {/* BUTTONS */}
    <div className="flex gap-2">
      <button
        onClick={downloadExcel}
        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
      >
        Excel
      </button>

      <button
        onClick={handlePdfDownload}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm"
      >
        PDF
      </button>
    </div>

  </div>
</div>
</div>
      {/* TABLE */}
     <div id="pdf-area" className="bg-white rounded-xl shadow h-full flex flex-col">
  
  {isPdf && (
    <div className="text-center mb-3">
      <h2 className="font-bold text-lg">ಕ್ರೋಡಿಕೃತ ಮನವಿಗಳ ವರದಿ</h2>
      <p className="text-sm">{new Date().toLocaleDateString()}</p>
    </div>
        )}

       <div className="flex-1 overflow-y-auto">
    <table className={`w-full text-sm border-collapse ${isPdf ? "page-break-table" : ""}`}>

          <thead className=" bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-[#2466d1] to-cyan-500 text-start">
              <th className="p-1 border">Sl.No</th>
             <th className="p-1 border">ಗ್ರಾಮ ಪಂಚಾಯತಿ</th>
             <th className="p-1 border">ಗ್ರಾಮ</th>
             <th className="p-1 border">ಪ್ರಕಾರ</th>
            <th className="p-1 border">ಕೆಲಸ</th>
            <th className="p-1 border">ವಿವರಣೆ</th>
            <th className="p-1 border">ಜಾತಿ</th>
            <th className="p-1 border">Refrence</th>
            <th className="p-1 border">Status	</th>
            </tr>
          </thead>

          <tbody>
  {filteredList?.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center p-4 text-gray-400">
        No Data
      </td>
    </tr>
  ) : (
    filteredList?.map((item: any, i: number) => (
     <tr className={`border-t ${item.source === "WARD" ? "bg-yellow-50" : ""}`}>
      <td className="p-1 border">{i + 1}</td>
      <td className="p-1 border">
  {item?.source === "WARD"
    ? item?.patanaName || "Ward Area"
    : item?.gpName || "-"}
</td>

<td className="p-1 border">
  {item?.source === "WARD"
    ? item?.wardName || "-"
    : item?.villageName || "-"}
</td>

        <td className="p-1 border">{item.type}</td>
        <td className="p-1 border">{item.work}</td>
        <td className="p-1 border">{item.description}</td>
         <td className="p-1 border">{item.caste}</td>
          <td className="p-1 border">{item.refer}</td>
           <td className="p-1 border">{item.status}</td>
      </tr>
    ))
  )}
</tbody>

        </table>

      </div>
      </div>

      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

    </div>
  );
};

/* ===============================
   CARD
================================= */



const Card = ({ title, data, expandedCard, setExpandedCard , isMobile }: any) => {
  const isOpen = Array.isArray(expandedCard)
  ? expandedCard.includes(title)
  : expandedCard === title;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 transition-all">

      {/* HEADER */}
      <div
        className="flex justify-between items-center px-3 py-2 cursor-pointer"
       onClick={() => {
  if (isMobile) {
    // 📱 MOBILE → multiple expand
    setExpandedCard((prev: any) => {
      const prevArray = Array.isArray(prev) ? prev : [];

      if (prevArray.includes(title)) {
        return prevArray.filter((t: string) => t !== title);
      } else {
        return [...prevArray, title];
      }
    });
  } else {
    // 💻 DESKTOP → single expand
    setExpandedCard(isOpen ? null : title);
  }
}}
      >
        <h3 className="font-semibold text-[13px] text-gray-700">
          {title}
        </h3>

        <span className="text-xs text-gray-500">
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {/* BODY */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-52 border-t" : "max-h-0"
        }`}
      >
        <div className="p-2 overflow-y-auto max-h-52">

          {data?.length ? (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-lg px-2 py-1 mb-1"
              >
                <span className="text-[12px] text-gray-700 truncate">
                  {item._id}
                </span>

                <span className="text-[11px] font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-xs text-center py-2">
              ಡೇಟಾ ಇಲ್ಲ
            </p>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManaviDashboard;