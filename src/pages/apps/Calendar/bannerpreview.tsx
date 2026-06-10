import { FaDownload, FaChevronLeft, FaChevronRight, FaFacebookF, FaInstagram, FaGlobe } from "react-icons/fa";
import FooterImg from "../../../assets/images/footer.png";
import LeaderImg from "../../../assets/images/leader.png";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import DOMPurify from "dompurify";

/* ================= TYPES ================= */
interface TPEvent {
  time: string;
  description: string;
  location?: string;
}

interface TPForDate {
  date: string;
  events: TPEvent[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  tpForDate: TPForDate | null;
  activeDate: string;
  theme?: BannerTheme;
}

type BannerTheme = "blue" | "green" | "purple";

/* ================= POSTER MODE ================= */
type PosterMode = "blue" | "green" | "meroon";

const themeStyles = {
  blue: {
    bannerBg: "bg-gradient-to-b from-sky-100 via-sky-50 to-white",
    headerGradient: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700",
    titleText: "bg-gradient-to-r from-blue-700 to-blue-900 text-transparent bg-clip-text",
    pageBorder: "ring-blue-300",
    footerGradient: "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800",
    footerIcon: "text-[#225de6]",
  },
  green: {
    bannerBg: "bg-gradient-to-b from-green-100 via-green-50 to-white",
    headerGradient: "bg-gradient-to-r from-green-600 via-green-500 to-green-700",
    titleText: "bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text",
    pageBorder: "ring-green-300",
    footerGradient: "bg-gradient-to-r from-green-700 via-green-600 to-green-800",
    footerIcon: "text-[#21c45d]",
  },
  meroon: {
    bannerBg: "bg-gradient-to-b from-[#d4b89a] via-[#efe5d8] to-white",
    headerGradient: "bg-gradient-to-b from-[#a32e2e] to-[#7a2e1d]",
    titleText: " text-[#8b1c1c]",
    pageBorder: "ring-[#8b1c1c]",
    footerGradient: "bg-gradient-to-r from-[#8b1c1c] via-[#a83232] to-[#7a2e1d]",
    footerIcon: "text-[#a32e2e]",
  },
};

/* ================= UTIL ================= */
const chunkEvents = (events: TPEvent[], size = 3) => {
  const chunks: TPEvent[][] = [];
  for (let i = 0; i < events.length; i += size) {
    chunks.push(events.slice(i, i + size));
  }
  return chunks;
};

const safeDate = (dateStr: string) => {
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
};


const convertTimeToMinutes = (time: string) => {
  if (!time) return 0;

  const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const modifier = match[3]?.toUpperCase();

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

/* ================= COMPONENT ================= */
const BannerPreviewModal = ({ open, onClose, tpForDate, activeDate }: Props) => {
  const [posterMode, setPosterMode] = useState<PosterMode>("blue");
  if (!open || !tpForDate || !tpForDate.events.length) return null;

const sortedEvents = [...tpForDate.events].sort(
  (a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
);

const pages = chunkEvents(sortedEvents, 3);
  const multiPage = pages.length > 1;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

const kannadaMonths: Record<string, number> = {
  "ಜನವರಿ": 0,
  "ಫೆಬ್ರುವರಿ": 1,
  "ಮಾರ್ಚ್": 2,
  "ಏಪ್ರಿಲ್": 3,
  "ಮೇ": 4,
  "ಜೂನ್": 5,
  "ಜುಲೈ": 6,
  "ಆಗಸ್ಟ್": 7,
  "ಸೆಪ್ಟೆಂಬರ್": 8,
  "ಅಕ್ಟೋಬರ್": 9,
  "ನವೆಂಬರ್": 10,
  "ಡಿಸೆಂಬರ್": 11,
};

// 2️⃣ Split the activeDate string
const [monthKannada, dayStr, yearStr] = activeDate.replace(',', '').split(' ');
const dateDay = parseInt(dayStr, 10);
const monthNumber = kannadaMonths[monthKannada];
const year = parseInt(yearStr, 10);

// 3️⃣ Create a proper JS Date object
const dateObj = new Date(year, monthNumber, dateDay);

// 4️⃣ Get the weekday in Kannada
const weekDayKannada = dateObj.toLocaleDateString("kn-IN", { weekday: "long" });


  /* ================= SLIDE CONTROL ================= */
  const scrollToPage = (index: number) => {
    if (!sliderRef.current) return;
    const width = 620 + 24;
    sliderRef.current.scrollTo({ left: index * width, behavior: "smooth" });
    setCurrentPage(index);
  };


const fbLink = encodeURIComponent("https://www.facebook.com/GHSrinivasTarikere/");
const instaLink = encodeURIComponent("https://www.instagram.com/srinivasgowdahanumaiah");
const webLink = encodeURIComponent("https://tarikeremlaghsrinivas.com/");

  /* ================= DOWNLOAD ================= */
  const downloadPNG = async () => {
    try {
      await document.fonts.ready;

      for (let i = 0; i < pages.length; i++) {
        const node = document.getElementById(`tp-banner-${i}`);
        if (!node) continue;

        const scale = 2;

        const dataUrl = await toPng(node, {
          cacheBust: true,
          backgroundColor: "#ffffff",
          width: node.offsetWidth * scale,
          height: node.offsetHeight * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          },
          pixelRatio: scale,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `TP-${activeDate}-${i + 1}.png`;
        link.click();
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      console.error("PNG export failed:", err);
      alert("Download failed. Please reload and try again.");
    }
  };

  const theme = themeStyles[posterMode];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-[580px] my-auto">

        {/* ================= POSTER MODE BUTTONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {(["blue", "green", "meroon"] as PosterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setPosterMode(mode)}
              className={`rounded-xl text-white py-2 font-bold shadow hover:scale-[1.02] transition
                ${mode === "blue" ? "bg-gradient-to-r from-sky-500 to-blue-600" :
                  mode === "green" ? "bg-gradient-to-r from-green-500 to-emerald-600" :
                  "bg-gradient-to-r from-[#8b1c1c] via-[#a32e2e] to-[#7a2e1d] text-white"}`}
            >
              WA Poster – {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl relative flex flex-col max-h-[75vh]">

          {/* ================= SLIDER ================= */}
          <div className="relative overflow-y-auto flex-1">
            {multiPage && currentPage > 0 && (
              <button onClick={() => scrollToPage(currentPage - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3">
                <FaChevronLeft size={20} />
              </button>
            )}

            {multiPage && currentPage < pages.length - 1 && (
              <button onClick={() => scrollToPage(currentPage + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-3">
                <FaChevronRight size={20} />
              </button>
            )}

            <div ref={sliderRef} className="whitespace-nowrap overflow-x-auto snap-x snap-mandatory p-4">
              {pages?.map((events, pageIndex) => (
                <div
                  key={pageIndex}
                  id={`tp-banner-${pageIndex}`}
                  className={`inline-block align-top snap-center w-[520px] ${theme.bannerBg} border overflow-hidden mr-2 ${theme.pageBorder} rounded-xl`}
                >

                  {/* ================= HEADER ================= */}
                  <div className="py-4 flex items-center justify-between">
                    <div className="relative flex items-center">
                     <div className="flex flex-col justify-center bg-white text-[#1e5eff] w-[60px] h-[50px] pl-2 shadow-md z-10">
                  <span className={`text-[11px] font-bold leading-none  ${theme.titleText}`}>{monthKannada}</span>
                  <span className={`text-[20px] font-extrabold text-center leading-none mt-1 pr-3 ${theme.titleText}`}>{dateDay}</span>
                  </div>

                      <div className="relative w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[20px]">
                        <div className="absolute top-[-22px] left-[-20px] w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[17px] border-l-white" />
                      </div>
                    </div>

                    <div className="flex-1 text-center px-4">
                      <div className={`text-[16px] font-black ${theme.titleText}`}>
                        ಶಾಸಕರ ದೈನಂದಿನ ಕಾರ್ಯಕಲಾಪಗಳು
                      </div>
                      <div className="text-[14px] font-bold text-indigo-900 mt-1">
                        ದಿನಾಂಕ: {activeDate} {weekDayKannada}
                      </div>
                    </div>

                    <img src={LeaderImg} className="h-[80px] w-[80px] object-contain rounded-full" />
                  </div>

                  {/* ================= EVENTS (FIXED) ================= */}
                  <div className="py-1">
                    <div className="bg-white rounded-[16px] p-3 box-border">

                      {/* TABLE HEADER */}
                      <div
                        className={`grid grid-cols-[minmax(90px,120px)_minmax(0,1fr)] ${theme.headerGradient}
                        text-white text-[16px] font-bold rounded-t-xl shadow-lg overflow-hidden`}
                      >
                        <div className="p-3 text-center border-r border-white">ಸಮಯ</div>
                        <div className="p-3 text-center">ಕಾರ್ಯಕ್ರಮಗಳು</div>
                      </div>

                      {/* TABLE BODY */}
                      <div className="divide-y border border-[#B7B3B3] overflow-hidden">
                        {events?.map((ev, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-[minmax(90px,120px)_minmax(0,1fr)]"
                          >
                            {/* TIME */}
                            <div className="py-2 px-2 text-center font-extrabold text-fuchsia-900 border-r border-[#B7B3B3]">
                              {ev.time}
                            </div>

                            {/* EVENT CONTENT */}
                            <div className="py-2 px-3 min-w-0 space-y-1">
                              <div
  className="font-bold break-words leading-relaxed whitespace-pre-wrap 
             [&_p]:m-0 [&_p]:mb-1 [&_br]:block"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(ev.description),
  }}
/>

                              {ev.location && (
                                <div className="text-green-700 font-bold break-words whitespace-normal">
                                  ಸ್ಥಳ: {ev.location}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* FOOT NOTE */}
                      <div className="flex justify-between pt-2">
                        {multiPage && (
                          <div className="text-[12px] text-[#7a2e1d] font-bold">
                            ಪುಟ – {pageIndex + 1}
                          </div>
                        )}
                        {multiPage && pageIndex < pages.length - 1 && (
                          <div className="text-right font-bold text-[#a32e2e]">
                            ಮುಂದುವರಿದು…
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ================= FOOTER ================= */}
                  <div className="h-[70px] border-t mt-1 flex items-center justify-between pl-2 bg-white">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <img
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${fbLink}`}
                          className="h-[45px] w-[45px]"
                        />
                        <FaFacebookF
                          className={`${theme.footerIcon} text-[12px]`}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instaLink}`}
                          className="h-[45px] w-[45px]"
                        />
                        <FaInstagram
                          className={`${theme.footerIcon} text-[12px]`}
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${webLink}`}
                          className="h-[45px] w-[45px]"
                        />
                        <FaGlobe
                          className={`${theme.footerIcon} text-[12px]`}
                        />
                      </div>
                    </div>

                    <div className={`flex items-center ${theme.footerGradient} rounded-l-lg h-[60px] ml-3 pl-2`}>
                      <div className="text-white">
                        <div className="text-[18px] font-extrabold leading-tight">ಜಿ. ಹೆಚ್. ಶ್ರೀನಿವಾಸ</div>
                        <div className="text-[14px] text-[#ffd9c9]">ಶಾಸಕರು – ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ</div>
                      </div>
                      <img src={FooterImg} className="h-[96px] object-contain mb-3" />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-between px-4 pb-4 mt-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
              Close
            </button>
            <button
              onClick={downloadPNG}
              className="flex items-center gap-2 px-5 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Download
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BannerPreviewModal;