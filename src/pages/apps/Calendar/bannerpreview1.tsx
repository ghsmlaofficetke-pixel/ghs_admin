import {
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaFacebookF,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { toPng } from "html-to-image";
import FooterImg from "../../../assets/images/footer.png";
import LeaderImg from "../../../assets/images/leader.png";
import { useRef, useState } from "react";
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
}

type PosterMode = "blue" | "green" | "meroon";

/* ================= THEMES ================= */

const themeStyles = {
  blue: {
    bannerBg: "bg-gradient-to-b from-blue-100 via-blue-50 to-white",
    titleText: "text-blue-900 font-black",
    pageBorder: "ring-blue-300",
    footerGradient: "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700",
    footerIcon: "text-blue-700",
    dateBg: "bg-blue-600 text-white",
  },
  green: {
    bannerBg: "bg-gradient-to-b from-green-100 via-green-50 to-white",
    titleText: "text-green-900 font-black",
    pageBorder: "ring-green-300",
    footerGradient: "bg-gradient-to-r from-green-600 via-green-500 to-green-700",
    footerIcon: "text-green-700",
    dateBg: "bg-green-600 text-white",
  },
  meroon: {
    bannerBg: "bg-gradient-to-b from-[#f6e5dc] via-[#f2d6c4] to-white",
    titleText: "text-[#8b1c1c] font-black",
    pageBorder: "ring-[#8b1c1c]",
    footerGradient: "bg-gradient-to-r from-[#8b1c1c] via-[#a32e2e] to-[#7a2e1d]",
    footerIcon: "text-[#a32e2e]",
    dateBg: "bg-[#a32e2e] text-white",
  },
};

/* ================= HELPERS ================= */

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

const BannerPreviewModal = ({
  open,
  onClose,
  tpForDate,
  activeDate,
}: Props) => {
  const [posterMode, setPosterMode] = useState<PosterMode>("blue");
  if (!open || !tpForDate || !tpForDate.events.length) return null;

  const sortedEvents = [...tpForDate.events].sort(
  (a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
);

const pages = chunkEvents(sortedEvents, 3);
  const multiPage = pages.length > 1;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const dateObj = safeDate(activeDate);
  const weekDayKannada = dateObj.toLocaleDateString("kn-IN", {
    weekday: "long",
  });
  const dateDay = dateObj.getDate();
  const monthKannada = dateObj.toLocaleDateString("kn-IN", { month: "long" });

  const scrollToPage = (index: number) => {
    if (!sliderRef.current) return;
    const width = 540 + 16;
    sliderRef.current.scrollTo({ left: index * width, behavior: "smooth" });
    setCurrentPage(index);
  };

 


const fbLink = encodeURIComponent("https://www.facebook.com/GHSrinivasTarikere/");
const instaLink = encodeURIComponent("https://www.instagram.com/srinivasgowdahanumaiah");
const webLink = encodeURIComponent("https://tarikeremlaghsrinivas.com/");

  /* ================= EXACT PNG RENDER ================= */

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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 overflow-auto">
      <div className="w-full max-w-[520px]">

        {/* MODE BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          {(["blue", "green", "meroon"] as PosterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setPosterMode(mode)}
              className={`rounded-xl text-white py-2 font-bold shadow
              ${
                mode === "blue"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600"
                  : mode === "green"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-[#8b1c1c] via-[#a32e2e] to-[#7a2e1d]"
              }`}
            >
              WA Poster – {mode}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl relative overflow-hidden">

          {/* SLIDER */}
          <div className="relative">
            <div
              ref={sliderRef}
              className="whitespace-nowrap overflow-x-auto snap-x snap-mandatory p-2"
            >
              {pages.map((events, pageIndex) => (
                <div
                  key={pageIndex}
                  id={`tp-banner-${pageIndex}`}
                  className={`inline-block align-top snap-center w-[520px] ${theme.bannerBg} border ${theme.pageBorder} p-2`}
                >
                  {/* HEADER */}
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={LeaderImg}
                      className="h-[80px] w-[80px] object-contain"
                      alt="Leader"
                    />

                    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                      <div className={`${theme.titleText} text-[16px]`}>
                        ಶಾಸಕರ ದೈನಂದಿನ ಕಾರ್ಯಕಲಾಪಗಳು
                      </div>
                      <div
                        className={`${theme.dateBg} px-3 py-1 mt-1 rounded-full font-bold`}
                      >
                        {dateDay} {monthKannada} • {weekDayKannada}
                      </div>
                    </div>

                    <img
                      src={FooterImg}
                      className="h-[80px] w-[80px] object-contain"
                      alt="Footer"
                    />
                  </div>

                  {/* EVENTS (OVERLAP FIXED) */}
                  <div className="space-y-3">
                    {events.map((ev, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white rounded-2xl p-3 shadow border border-gray-200"
                      >
                        {/* TIME BADGE */}
                        <div className="flex-shrink-0 bg-red-500 text-white font-extrabold text-[14px] px-4 py-1.5 rounded-full mt-1">
                          {ev.time}
                        </div>

                        {/* TEXT COLUMN */}
                        <div className="flex-1 min-w-0 space-y-1">
                         <div
  className="font-bold break-words leading-relaxed whitespace-pre-wrap 
             [&_p]:m-0 [&_p]:mb-1 [&_br]:block"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(ev.description),
  }}
/>

                          {ev.location && (
                            <div className="text-green-700 font-semibold text-[14px] break-words whitespace-normal">
                              ಸ್ಥಳ: {ev.location}
                            </div>
                          )}

                         
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="h-[70px] border-t mt-4 flex items-center justify-start gap-6 bg-white">
                    <div
                      className={`flex items-center ${theme.footerGradient} rounded-xl h-[70px] pl-4 pr-4`}
                    >
                      <div className="text-white">
                        <div className="text-[18px] font-extrabold leading-tight">
                          ಜಿ. ಹೆಚ್. ಶ್ರೀನಿವಾಸ
                        </div>
                        <div className="text-[14px] text-[#ffd9c9]">
                          ಶಾಸಕರು – ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ
                        </div>
                      </div>
                    </div>

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
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between px-4 py-3 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Close
            </button>

            <button
              onClick={downloadPNG}
              className="flex items-center gap-2 px-5 py-2 rounded bg-green-600 text-white"
            >
              <FaDownload /> Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerPreviewModal;
