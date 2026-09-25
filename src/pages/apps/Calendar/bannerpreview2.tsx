import { FaDownload, FaChevronLeft, FaChevronRight, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import LeaderLogo from "../../../assets/images/congress.png";
import LeaderPhoto from "../../../assets/images/banner.png";
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
    bannerBg: "bg-gradient-to-b from-sky-50 via-white to-sky-50",
    titleText: "text-blue-800",
    nameText: "text-blue-900",
    pageBorder: "ring-blue-300",
    accentLine: "from-transparent via-blue-500 to-transparent",
    timeBadge: "bg-blue-700",
    footerGradient: "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800",
    photoRing: "ring-blue-500",
    dashed: "border-blue-300",
  },
  green: {
    bannerBg: "bg-gradient-to-b from-[#fdf8ee] via-[#fbf3df] to-white",
    titleText: "text-green-800",
    nameText: "text-green-900",
    pageBorder: "ring-green-300",
    accentLine: "from-transparent via-green-600 to-transparent",
    timeBadge: "bg-green-700",
    footerGradient: "bg-gradient-to-r from-green-800 via-green-700 to-green-900",
    photoRing: "ring-green-600",
    dashed: "border-green-300",
  },
  meroon: {
    bannerBg: "bg-gradient-to-b from-[#f6e5dc] via-[#f2d6c4] to-white",
    titleText: "text-[#8b1c1c]",
    nameText: "text-[#7a2e1d]",
    pageBorder: "ring-[#8b1c1c]",
    accentLine: "from-transparent via-[#a32e2e] to-transparent",
    timeBadge: "bg-[#a32e2e]",
    footerGradient: "bg-gradient-to-r from-[#8b1c1c] via-[#a32e2e] to-[#7a2e1d]",
    photoRing: "ring-[#a32e2e]",
    dashed: "border-[#c98d78]",
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

const safeDate = (dateStr: string) => {
  // Handles Kannada-formatted "MonthName Day, Year" strings (e.g. "ಸೆಪ್ಟೆಂಬರ್ 10, 2026")
  const kannadaParts = dateStr.replace(",", "").trim().split(" ");
  if (kannadaParts.length === 3 && kannadaMonths[kannadaParts[0]] !== undefined) {
    const [monthName, dayStr, yearStr] = kannadaParts;
    return new Date(Number(yearStr), kannadaMonths[monthName], Number(dayStr));
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
};

const splitCostNote = (html: string): { cleanedHtml: string; cost: string | null } => {
  const div = document.createElement("div");
  div.innerHTML = html || "";

  let cost: string | null = null;
  const blocks = Array.from(div.querySelectorAll("p, div, li")).length
    ? Array.from(div.querySelectorAll("p, div, li"))
    : [div];

  for (const block of blocks) {
    const text = (block.textContent || "").trim();
    const match = text.match(/\(?\s*ಅಂದಾಜು[^)]*\)?/);
    if (match) {
      cost = match[0].replace(/^\(|\)$/g, "").trim();
      if (block !== div) block.remove();
      break;
    }
  }

  return { cleanedHtml: div.innerHTML, cost };
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
const BannerPreviewModal2 = ({ open, onClose, tpForDate, activeDate }: Props) => {
  const [posterMode, setPosterMode] = useState<PosterMode>("green");
  if (!open || !tpForDate || !tpForDate.events.length) return null;

  const sortedEvents = [...tpForDate.events].sort(
    (a, b) => convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
  );

  const pages = chunkEvents(sortedEvents, 3);
  const multiPage = pages.length > 1;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const dateObj = safeDate(activeDate);
  const weekDayKannada = dateObj.toLocaleDateString("kn-IN", { weekday: "long" });
  const dateDay = dateObj.getDate();
  const monthKannada = dateObj.toLocaleDateString("kn-IN", { month: "long" });
  const yearKannada = dateObj.getFullYear();

  const scrollToPage = (index: number) => {
    if (!sliderRef.current) return;
    const width = 620 + 24;
    sliderRef.current.scrollTo({ left: index * width, behavior: "smooth" });
    setCurrentPage(index);
  };

  /* ================= DOWNLOAD ================= */
  const downloadPNG = async () => {
    try {
      await document.fonts.ready;

      for (let i = 0; i < pages.length; i++) {
        const node = document.getElementById(`tp-banner2-${i}`);
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
        link.download = `TP-Design3-${activeDate}-${i + 1}.png`;
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
      <div className="w-full max-w-[660px] my-auto">

        {/* ================= POSTER MODE BUTTONS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {(["blue", "green", "meroon"] as PosterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setPosterMode(mode)}
              className={`rounded-xl text-white py-2 font-bold shadow hover:scale-[1.02] transition
                ${mode === "blue" ? "bg-gradient-to-r from-sky-500 to-blue-600" :
                  mode === "green" ? "bg-gradient-to-r from-green-600 to-emerald-700" :
                  "bg-gradient-to-r from-[#8b1c1c] via-[#a32e2e] to-[#7a2e1d] text-white"}`}
            >
              WA Poster – {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-xl relative flex flex-col max-h-[80vh]">

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
                  id={`tp-banner2-${pageIndex}`}
                  className={`inline-block align-top snap-center w-[620px] ${theme.bannerBg} border overflow-hidden mr-2 ${theme.pageBorder} rounded-2xl relative`}
                >
                  {/* ================= HEADER ================= */}
                  <div className="flex items-start justify-between px-3 pt-2">
                    {/* <img
                      src={LeaderLogo}
                      className="h-[60px] w-[60px] object-contain flex-shrink-0"
                      alt="Party Logo"
                    /> */}

                    <div className="flex-1 text-center px-1">
                      <div className={`text-[15px] font-bold ${theme.titleText}`}>
                        ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರದ
                      </div>
                      <div className={`text-[15px] font-bold ${theme.titleText}`}>
                        ಮಾನ್ಯ ಶಾಸಕರಾದ
                      </div>
                      <div className={`text-[22px] font-black leading-tight mt-1 ${theme.nameText}`}>
                        ಶ್ರೀಯುತ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸರವರ
                      </div>
                      <div className={`text-[14px] font-semibold mt-2 ${theme.titleText}`}>
                        ದಿನಾಂಕ {dateDay}/{monthKannada}/{yearKannada} ರ 
                      </div>
                      <div className={`text-[14px] font-semibold mt-2 ${theme.titleText}`}>
                      {weekDayKannada}ದ ಪ್ರವಾಸದ ವಿವರ
                      </div>
                    </div>

                    <img
                      src={LeaderPhoto}
                      className={`w-[30%] max-w-[140px] min-w-[90px] aspect-[5/6] object-cover object-top ${theme.photoRing} flex-shrink-0`}
                      alt="Leader"
                    />
                  </div>

                  {/* ================= DIVIDER ================= */}
                  <div className={`h-[2px] bg-gradient-to-r ${theme.accentLine} mx-2 mt-2`} />

                  {/* ================= EVENTS ================= */}
                  <div className="px-3 py-2 space-y-0">
                    {events?.map((ev, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-4 py-2 ${i < events.length - 1 ? `border-b border-dashed ${theme.dashed}` : ""}`}
                      >
                        {/* LEFT: TIME + LOCATION */}
                        <div className={`flex-shrink-0 w-[150px] space-y-2 pr-4 border-r-2 ${theme.dashed}`}>
                          <div className={`flex items-center gap-2 ${theme.timeBadge} text-white rounded-lg px-3 py-2 shadow`}>
                            <FaClock size={13} />
                            <span className="text-[13px] font-bold whitespace-normal">ಸಮಯ: {ev.time}</span>
                          </div>
                          {ev.location && (
                            <div className="flex items-start gap-1.5 text-green-700">
                              <FaMapMarkerAlt size={13} className="mt-[2px] flex-shrink-0" />
                              <span className="text-[12px] font-bold break-words whitespace-normal">
                                ಸ್ಥಳ: {ev.location}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* RIGHT: DESCRIPTION */}
                        <div className="flex-1 min-w-0">
                          {(() => {
                            const { cleanedHtml, cost } = splitCostNote(ev.description);
                            return (
                              <>
                                <div
                                  className="text-[14px] font-semibold text-gray-800 break-words leading-relaxed whitespace-pre-wrap
                                             [&_p]:m-0 [&_p]:mb-1 [&_br]:block"
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(cleanedHtml),
                                  }}
                                />
                                {cost && (
                                  <div className={`inline-block mt-2 text-[12px] font-bold text-amber-900 bg-amber-100 border ${theme.dashed} rounded-full px-3 py-1`}>
                                    ({cost})
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))}

                    {/* FOOT NOTE */}
                    {multiPage && (
                      <div className="flex justify-between pt-2">
                        <div className="text-[12px] font-bold text-gray-500">
                          ಪುಟ – {pageIndex + 1}
                        </div>
                        {pageIndex < pages.length - 1 && (
                          <div className={`text-right font-bold ${theme.titleText}`}>
                            ಮುಂದುವರಿದು…
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ================= FOOTER (minimal) ================= */}
                  <div className={`h-[10px] mt-1 bg-gradient-to-r ${theme.accentLine} opacity-80`} />

                  {/* ================= BOTTOM ILLUSTRATION STRIP ================= */}
                  <svg viewBox="0 0 620 40" className="w-full h-[36px] block" preserveAspectRatio="none">
                    <rect width="620" height="40" fill={posterMode === "blue" ? "#0c4a6e" : posterMode === "green" ? "#14532d" : "#5c1414"} />
                    <path d="M0 25 Q 60 5 120 25 T 240 25 T 360 25 T 480 25 T 620 25 V40 H0 Z" fill={posterMode === "blue" ? "#0369a1" : posterMode === "green" ? "#166534" : "#7a2e1d"} />
                  </svg>
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
              className="flex items-center gap-2 px-5 py-2 rounded bg-green-700 text-white hover:bg-green-800"
            >
              <FaDownload /> Download
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BannerPreviewModal2;