// ================= TodayTPBanner.tsx =================
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { tpSelector, TP } from "../../../api/tp";
import Footer from "../../../assets/images/footer.png";
import { FaInstagram, FaGlobe } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

/* ================= UTILS ================= */
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("kn-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const getWeekDay = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("kn-IN", { weekday: "long" });

/* ================= TYPES ================= */
interface TodayTPBannerProps {
  selectedDate: string | null;
  onEdit?: (tp: any) => void;
  onDelete?: (tpId: string) => void;
}

/* ===== TIME SORT HELPER ===== */
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
const TodayTPBanner = ({
  selectedDate,
  onEdit,
  onDelete,
}: TodayTPBannerProps) => {
  const { all_tp } = useSelector(tpSelector);
  const [open, setOpen] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const activeDate = selectedDate || today;

  const tpForDate = useMemo(() => {
    return all_tp.find(
      (tp: TP) => new Date(tp.date).toISOString().split("T")[0] === activeDate
    );
  }, [all_tp, activeDate]);

  if (!tpForDate) {
    return (
      <div className="text-center text-gray-500 py-3 text-sm sm:text-lg font-medium">
        {formatDate(activeDate)} ರಂದು ಯಾವುದೇ ಶಾಸಕರ ದೈನಂದಿನ ಕಾರ್ಯಕಲಾಪಗಳಿಲ್ಲ
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ===== TITLE ===== */}
      <div className="text-center  sm:text-[16px] text-[14px] font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-red-500 mb-2">
        ಶಾಸಕರ ದೈನಂದಿನ ಕಾರ್ಯಕಲಾಪಗಳು
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* ===== HEADER ===== */}
        <div className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-3 sm:px-3 py-2 sm:py-1 rounded-lg shadow-md flex items-center justify-between">
          {/* LEFT (DATE) */}
          <button
            onClick={() => setOpen(!open)}
            className="font-bold text-sm sm:text-[16px] text-left"
          >
            {formatDate(activeDate)} • {getWeekDay(activeDate)}
          </button>

          {/* RIGHT (ACTIONS) */}
          <div className="flex items-center gap-3">
            {onEdit && (
              <button
                title="Edit"
                onClick={() => onEdit(tpForDate)}
                className="hover:text-yellow-300 transition"
              >
                <FiEdit2 className="text-lg sm:text-xl" />
              </button>
            )}

            {onDelete && (
              <button
                title="Delete"
                onClick={() => onDelete(tpForDate._id)}
                className="hover:text-red-300 transition"
              >
                <FiTrash2 className="text-lg sm:text-xl" />
              </button>
            )}

            <button
              onClick={() => setOpen(!open)}
              className="text-xl sm:text-2xl font-bold ml-1"
            >
              {open ? "−" : "+"}
            </button>
          </div>
        </div>

        {/* ===== CONTENT ===== */}
        {open && (
          <div className="mt-3 rounded-xl overflow-hidden shadow-lg bg-white">
            {/* TABLE HEADER */}
            <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold pl-4 py-2 sm:py-2">
              <div>ಸಮಯ</div>
              <div>ಕಾರ್ಯಕ್ರಮಗಳ ವಿವರ</div>
            </div>

            {/* EVENTS */}
          <div className="divide-y divide-gray-200">
  {tpForDate?.events
    ?.slice()
    ?.sort(
      (a: any, b: any) =>
        convertTimeToMinutes(a.time) - convertTimeToMinutes(b.time)
    )
    ?.map((ev: any, idx: number) => (
      <div
        key={idx}
        className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] p-3 sm:p-4 hover:bg-gray-50"
      >
        <div className="text-indigo-700 font-bold">
          {ev.time || "--"}
        </div>

        <div className="space-y-1">
          <div
            className="leading-relaxed max-w-none font-semibold"
            dangerouslySetInnerHTML={{ __html: ev.description }}
          />

          {ev.location && (
            <div className="text-green-700">
              ಸ್ಥಳ: {ev.location}
            </div>
          )}
        </div>
      </div>
    ))}
</div>

            {/* FOOTER */}
            <div className="bg-gradient-to-r from-sky-100 via-white to-sky-50 border-t">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="font-bold text-blue-800">
                    ಜಿ. ಹೆಚ್. ಶ್ರೀನಿವಾಸ
                  </div>
                  <div className="text-sm text-gray-700">
                    ಶಾಸಕರು – ತರೀಕೆರೆ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ
                  </div>
                </div>

                <img
                  src={Footer}
                  alt="MLA"
                  className="w-16 h-16 rounded-lg border"
                />
              </div>

              {/* SOCIAL */}
             <div className="
  flex flex-col sm:flex-row 
  items-center justify-center 
  gap-2 sm:gap-6 
  bg-gradient-to-r from-blue-600 to-cyan-500 
  text-white 
  py-2 px-3
  text-xs sm:text-sm md:text-base
">


  {/* Website */}
  <a
    href="https://tarikeremlaghsrinivas.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 
               hover:text-yellow-200 
               transition-all duration-200 
               break-all text-center"
  >
    <FaGlobe className="text-base sm:text-lg" />
    <span className="truncate">
      tarikeremlaghsrinivas.com
    </span>
  </a>

</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayTPBanner;



