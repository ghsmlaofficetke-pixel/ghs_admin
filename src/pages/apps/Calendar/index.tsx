import { useEffect, useMemo, useState, useCallback } from "react";
import { EventClickArg, EventInput } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  fetchAllTp,
  createTp,
  updateTp,
  deleteTp,
  tpSelector,
  TP,
} from "../../../api/tp";

import Calendar from "./Calendar";
import AddEditEvent from "./AddEditEvent";
import { PageBreadcrumb } from "../../../components";
import TodayTPBanner from "./tpbanner";
import DeleteModal from "../../../layouts/Deletemodal";
import MonthlyTPModal from "./MonthlyTp/modal";
import BannerPreviewModal from "./bannerpreview";
import BannerPreviewModal1 from "./bannerpreview1";

/* =========================
   Types
========================= */

type BannerTheme = "blue" | "green" | "purple";

/* =========================
   Helpers
========================= */

const normalizeDate = (d?: string): string => {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("kn-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getTodayNormalized = (): string =>
  normalizeDate(new Date().toISOString());

/* =========================
   Side Panel
========================= */

interface SidePanelProps {
  selectedDate: string | null;
  onEdit: (tp: TP) => void;
  onDelete: (tpId: string) => void;
  onMonthlyTP: () => void;
  onBannerMode: (theme: BannerTheme) => void;
  onBannerMode1: (theme: BannerTheme) => void;
  bannerError: string | null;
  bannerError1: string | null;
}



const SidePanel = ({
  selectedDate,
  onEdit,
  onDelete,
  onMonthlyTP,
  onBannerMode,
  onBannerMode1,
  bannerError,
  bannerError1,
}: SidePanelProps) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 w-full">
      <div className="p-4 w-full bg-gradient-to-br from-rose-50 via-slate-50 to-teal-50">
        {/* Today's TP Banner */}
        <TodayTPBanner
          selectedDate={selectedDate}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* Monthly TP Button */}
       

        {/* WA Poster Buttons */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onBannerMode("blue")}
              className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600
                         text-white py-2.5 text-sm font-semibold
                         shadow hover:shadow-md active:scale-[0.98]
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              🖼️ WA Poster – Blue
            </button>
            {bannerError && (
              <p className="text-xs text-red-500 text-center px-1">{bannerError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <button
              onClick={() => onBannerMode1("green")}
              className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600
                         text-white py-2.5 text-sm font-semibold
                         shadow hover:shadow-md active:scale-[0.98]
                         transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              🖼️ WA Poster – Green
            </button>
            {bannerError1 && (
              <p className="text-xs text-red-500 text-center px-1">{bannerError1}</p>
            )}
          </div>
        </div>

         <button
          onClick={onMonthlyTP}
          className="mt-4 w-full rounded-xl
                     bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                     text-white py-3 text-sm font-semibold tracking-wide
                     shadow-md hover:shadow-lg active:scale-[0.98]
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          📅 Monthly Tour Program
        </button>
      </div>
    </div>
  );
};

/* =========================
   Calendar App
========================= */

const CalendarApp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { all_tp = [] } = useSelector(tpSelector);

  // Modal states
  const [show, setShow] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [openMonthlyTP, setOpenMonthlyTP] = useState(false);

  // Banner states
  const [openBanner, setOpenBanner] = useState(false);
  const [bannerMode, setBannerMode] = useState<BannerTheme | null>(null);
  const [openBanner1, setOpenBanner1] = useState(false);
  const [bannerMode1, setBannerMode1] = useState<BannerTheme | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [bannerError1, setBannerError1] = useState<string | null>(null);

  // Delete states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // TP states
  const [selectedTp, setSelectedTp] = useState<TP | null>(null);
  const [dateInfo, setDateInfo] = useState<{ date?: string }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(
    getTodayNormalized()
  );

  const today = useMemo(() => getTodayNormalized(), []);

  // Fetch all TPs on mount
  useEffect(() => {
    dispatch(fetchAllTp());
  }, [dispatch]);

  /* =========================
     Events
  ========================= */

const stripHtml = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};




const events: EventInput[] = useMemo(() => {
  return all_tp.flatMap((tp) =>
    (tp.events ?? []).map((ev, idx) => {
      const cleanDesc = stripHtml(ev.description ?? "").trim();

      let title = "";

      if (ev.time && cleanDesc) {
        title = `${ev.time} - ${cleanDesc}`;
      } else if (cleanDesc) {
        title = cleanDesc;
      } else if (ev.time) {
        title = ev.time;
      } else {
        title = "ಕಾರ್ಯಕ್ರಮ ವಿವರ ಇಲ್ಲ"; // fallback Kannada
      }

      return {
        id: `${tp._id ?? "unknown"}-${idx}`,
        title, // 🔥 ALWAYS NON-EMPTY
        start: normalizeDate(tp.date),
        allDay: true,
      };
    })
  );
}, [all_tp]);


  /* =========================
     Date Click
  ========================= */

  const onDateClick = useCallback(
    (arg: DateClickArg) => {
      const clickedDate = normalizeDate(arg.dateStr);
      setSelectedDate(clickedDate);

      const tpExists = all_tp.some(
        (tp) => normalizeDate(tp.date) === clickedDate
      );

      // Don't open add modal for past dates or dates that already have a TP
      if (clickedDate <= today || tpExists) {
        setShow(false);
        return;
      }

      setDateInfo({ date: clickedDate });
      setSelectedTp(null);
      setIsEditable(false);
      setShow(true);
    },
    [all_tp, today]
  );

  /* =========================
     Event Click
  ========================= */

  const onEventClick = useCallback(
    (arg: EventClickArg) => {
      const tp = all_tp.find((t) =>
        t._id ? arg.event.id?.startsWith(t._id) : false
      );

      if (!tp) return;

      const normalized = normalizeDate(tp.date);
      setSelectedDate(normalized);
      setSelectedTp(tp);
      setDateInfo({ date: tp.date });
      setIsEditable(true);
      setShow(true);
    },
    [all_tp]
  );

  /* =========================
     CRUD
  ========================= */

  const onAddEvent = useCallback(
    (data: TP) => {
      const finalDate = data.date ?? dateInfo.date;
      if (!finalDate) return;

      dispatch(
        createTp({
          date: finalDate,
          events: data.events ?? [],
        })
      );

      setShow(false);
      setSelectedTp(null);
    },
    [dispatch, dateInfo.date]
  );

  const onUpdateEvent = useCallback(
    (data: TP) => {
      if (!selectedTp?._id) return;

      dispatch(
        updateTp(selectedTp._id, {
          ...selectedTp,
          date: data.date ?? selectedTp.date,
          events: data.events ?? [],
        })
      );

      setShow(false);
    },
    [dispatch, selectedTp]
  );

  const onRemoveEvent = useCallback(() => {
    if (!selectedTp?._id) return;
    setDeleteId(selectedTp._id);
    setShow(false);
    setShowDeleteModal(true);
  }, [selectedTp]);

  const confirmDelete = useCallback(() => {
    if (!deleteId) return;
    dispatch(deleteTp(deleteId));
    setDeleteId(null);
    setShowDeleteModal(false);
    setSelectedTp(null);
  }, [dispatch, deleteId]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteId(null);
  }, []);

  /* =========================
     Active TP (for banner)
  ========================= */

  const activeTpForBanner = useMemo(() => {
    const keyDate = selectedDate ?? today;
    return (
      all_tp.find((tp) => normalizeDate(tp.date) === normalizeDate(keyDate)) ??
      null
    );
  }, [all_tp, selectedDate, today]);

  /* =========================
     Banner Handlers
  ========================= */

  const openBannerModal = useCallback(
    (theme: BannerTheme) => {
      setBannerError(null);
      if (!activeTpForBanner) {
        setBannerError("ಆಯ್ದ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಟೂರ್ ಪ್ರೋಗ್ರಾಂ ಇಲ್ಲ");
        return;
      }
      setSelectedTp(activeTpForBanner);
      setBannerMode(theme);
      setOpenBanner(true);
    },
    [activeTpForBanner]
  );

  const openBannerModal1 = useCallback(
    (theme: BannerTheme) => {
      setBannerError1(null);
      if (!activeTpForBanner) {
        setBannerError1("ಆಯ್ದ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಟೂರ್ ಪ್ರೋಗ್ರಾಂ ಇಲ್ಲ");
        return;
      }
      setSelectedTp(activeTpForBanner);
      setBannerMode1(theme);
      setOpenBanner1(true);
    },
    [activeTpForBanner]
  );

  const closeBannerModal = useCallback(() => {
    setOpenBanner(false);
    setBannerMode(null);
  }, []);

  const closeBannerModal1 = useCallback(() => {
    setOpenBanner1(false);
    setBannerMode1(null);
  }, []);

  /* =========================
     Render
  ========================= */

  return (
    <>
      <PageBreadcrumb
        title="Calendar"
        name="Tour Program"
        breadCrumbItems={["GHS", "Apps", "T P"]}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 w-full">

        {/* Left Panel */}
        <div className="card w-full shadow-sm">
          <div className="p-3 sm:p-6">
            <Calendar
              onDateClick={onDateClick}
              onEventClick={onEventClick}
              onDrop={() => {}}
              onEventDrop={() => {}}
              events={events}
            />
          </div>
        </div>
        

        {/* Right Panel – Calendar */}
        <div className="flex flex-col gap-4">
          {/* Create Event Button */}
          <div className="card w-full shadow-sm">
            <div className="p-4">
              <button
                className="w-full px-4 py-2.5 rounded-xl bg-primary text-white
                           text-sm font-semibold tracking-wide
                           hover:bg-primary/90 active:scale-[0.98]
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-primary/50
                           flex items-center justify-center gap-2"
                onClick={() => {
                  setIsEditable(false);
                  setSelectedTp(null);
                  setDateInfo({});
                  setShow(true);
                }}
              >
                <span className="text-lg leading-none">+</span>
                <span>Create New Event</span>
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <SidePanel
            selectedDate={selectedDate}
            onEdit={(tp) => {
              setSelectedTp(tp);
              setIsEditable(true);
              setShow(true);
            }}
            onDelete={(tpId) => {
              setDeleteId(tpId);
              setShowDeleteModal(true);
            }}
            onMonthlyTP={() => setOpenMonthlyTP(true)}
            onBannerMode={openBannerModal}
            onBannerMode1={openBannerModal1}
            bannerError={bannerError}
            bannerError1={bannerError1}
          />

          {/* No TP Notice */}
          {!activeTpForBanner && (
            <div
              className="p-4 bg-amber-50 border border-amber-100 rounded-xl
                          text-center text-amber-700 text-sm font-medium
                          flex items-center justify-center gap-2"
            >
              <span>📭</span>
              <span>ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಟೂರ್ ಪ್ರೋಗ್ರಾಂ ಇಲ್ಲ</span>
            </div>
          )}
        </div>
        
      </div>

      {/* Add / Edit Event Modal */}
      {show && (
        <AddEditEvent
          isOpen={show}
          isEditable={isEditable}
          eventData={selectedTp}
          defaultDate={dateInfo?.date}
          onAddEvent={onAddEvent}
          onUpdateEvent={onUpdateEvent}
          onRemoveEvent={onRemoveEvent}
          onClose={() => {
            setShow(false);
            setSelectedTp(null);
          }}
        />
      )}

      {/* Monthly TP Modal */}
      {openMonthlyTP && (
        <MonthlyTPModal
          open={openMonthlyTP}
          onClose={() => setOpenMonthlyTP(false)}
        />
      )}

      {/* Banner Preview – Blue */}
      {openBanner && selectedTp && bannerMode && (
        <BannerPreviewModal
          open={openBanner}
          onClose={closeBannerModal}
          tpForDate={selectedTp}
          activeDate={formatDate(selectedTp.date)}
          theme={bannerMode}
        />
      )}

      {/* Banner Preview – Green */}
      {openBanner1 && selectedTp && bannerMode1 && (
        <BannerPreviewModal1
          open={openBanner1}
          onClose={closeBannerModal1}
          tpForDate={selectedTp}
          activeDate={formatDate(selectedTp.date)}
          theme={bannerMode1}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        title="Delete Tour Program / ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮ ಅಳಿಸುವಿಕೆ"
        message="ಆಯ್ದ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮದ ಎಲ್ಲಾ ವಿವರಗಳು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲಾಗುತ್ತವೆ. ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ."
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default CalendarApp;