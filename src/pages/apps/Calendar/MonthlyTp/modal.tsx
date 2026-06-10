import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { tpSelector } from "../../../../api/tp";
import MonthlyTPPreview from "./MonthlyTPPreview";
import { getMonthlyTP } from "./useMonthlyTP";
import { exportPDF, exportExcel, formatDate, formatWeekdayKannada } from "./tpExport";
import { ModalLayout } from "../../../../components/HeadlessUI";
import type { ViewMode } from "./tpExport";

interface Props {
  open: boolean;
  onClose: () => void;
}

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── date string helpers ──────────────────────────────────────────────────────
const toDateStr = (d: Date): string => d.toISOString().slice(0, 10);

const MonthlyTPModal = ({ open, onClose }: Props) => {
  const { all_tp } = useSelector(tpSelector);

  const [month, setMonth]           = useState(new Date().getMonth());
  const [year, setYear]             = useState(new Date().getFullYear());
  const [viewMode, setViewMode]     = useState<ViewMode>("monthly");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [fromDate, setFromDate]     = useState<string>("");
  const [toDate, setToDate]         = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);

  // All TPs for selected month+year
  const monthlyData = useMemo(
    () => getMonthlyTP(all_tp, month, year),
    [all_tp, month, year]
  );

  const availableDays = useMemo(
    () => monthlyData.map((tp) => tp.date),
    [monthlyData]
  );

  // Filtered display data
  const displayData = useMemo(() => {
    if (viewMode === "daily" && selectedDay)
      return monthlyData.filter((tp) => tp.date === selectedDay);

    if (viewMode === "weekly" && fromDate && toDate) {
      return monthlyData.filter((tp) => tp.date >= fromDate && tp.date <= toDate);
    }

    return monthlyData;
  }, [viewMode, selectedDay, fromDate, toDate, monthlyData]);

  const filterLabel = useMemo(() => {
    if (viewMode === "daily" && selectedDay)
      return `${formatDate(selectedDay)} - ${formatWeekdayKannada(selectedDay)}`;
    if (viewMode === "weekly" && fromDate && toDate)
      return `${formatDate(fromDate)} ರಿಂದ ${formatDate(toDate)}`;
    return `${months[month]} ${year}`;
  }, [viewMode, selectedDay, fromDate, toDate, month, year]);

  const fileName = useMemo(() => {
    if (viewMode === "daily" && selectedDay)
      return `TP-${selectedDay.slice(0, 10)}`;
    if (viewMode === "weekly" && fromDate && toDate)
      return `TP-${fromDate}-to-${toDate}`;
    return `TP-${months[month]}-${year}`;
  }, [viewMode, selectedDay, fromDate, toDate, month, year]);

  const handlePDF = () => {
    exportPDF(
      displayData,
      fileName,
      filterLabel,
      () => setPdfLoading(true),
      () => setPdfLoading(false),
      viewMode
    );
  };

  const handleModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "daily" && !selectedDay && availableDays[0])
      setSelectedDay(availableDays[0]);
    if (mode === "weekly" && !fromDate) {
      // default: first available day as from, last as to
      const sorted = [...availableDays].sort();
      if (sorted.length) {
        setFromDate(sorted[0]);
        setToDate(sorted[sorted.length - 1]);
      }
    }
  };

  // min/max for date pickers — restrict to current month
  const monthMin = toDateStr(new Date(year, month, 1));
  const monthMax = toDateStr(new Date(year, month + 1, 0));

  // ── tab config ───────────────────────────────────────────────────────────
  const tabs: { mode: ViewMode; label: string; icon: string; activeClass: string }[] = [
    { mode: "monthly", label: "ತಿಂಗಳು", icon: "📅", activeClass: "bg-blue-600 text-white shadow-md" },
    { mode: "weekly",  label: "ವಾರ",    icon: "📆", activeClass: "bg-green-600 text-white shadow-md" },
    { mode: "daily",   label: "ದಿನ",    icon: "🗓️", activeClass: "bg-amber-500 text-white shadow-md" },
  ];

  return (
    <ModalLayout
      showModal={open}
      toggleModal={onClose}
      panelClassName="w-[98vw] max-w-[1600px] h-[95vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* ── Modal Header ── */}
      <div className="flex justify-between items-center border-b px-5 py-3 bg-gray-50 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">Monthly Tour Program</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-600 text-xl font-bold transition-colors">✕</button>
      </div>

      {/* ── Controls bar ── */}
      <div className="flex flex-wrap gap-3 px-5 py-3 bg-white border-b items-center shrink-0">

        {/* View mode tabs */}
        <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm shadow-sm bg-gray-50 p-0.5 gap-0.5">
          {tabs.map(({ mode, label, icon, activeClass }) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-semibold transition-all duration-150 text-sm ${
                viewMode === mode ? activeClass : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Month */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={month}
          onChange={(e) => {
            setMonth(Number(e.target.value));
            setSelectedDay("");
            setFromDate("");
            setToDate("");
          }}
        >
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>

        {/* Year */}
        <select
          className="border border-gray-300 w-24 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
            setSelectedDay("");
            setFromDate("");
            setToDate("");
          }}
        >
          {[2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Day picker */}
        {viewMode === "daily" && (
          <select
            className="border border-amber-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 font-medium text-amber-900"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="">-- ದಿನ ಆಯ್ಕೆ ಮಾಡಿ --</option>
            {availableDays.map((d) => (
              <option key={d} value={d}>
                {formatDate(d)} — {formatWeekdayKannada(d)}
              </option>
            ))}
          </select>
        )}

        {/* Date range picker for weekly */}
        {viewMode === "weekly" && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-xl px-3 py-1.5">
            <span className="text-xs font-semibold text-green-700 shrink-0">ರಿಂದ</span>
            <input
              type="date"
              className="border-0 bg-transparent text-sm font-medium text-green-900 focus:outline-none focus:ring-0 w-36"
              value={fromDate}
              min={monthMin}
              max={toDate || monthMax}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <span className="text-green-400 font-bold">→</span>
            <span className="text-xs font-semibold text-green-700 shrink-0">ವರೆಗೆ</span>
            <input
              type="date"
              className="border-0 bg-transparent text-sm font-medium text-green-900 focus:outline-none focus:ring-0 w-36"
              value={toDate}
              min={fromDate || monthMin}
              max={monthMax}
              onChange={(e) => setToDate(e.target.value)}
            />
            {/* quick-clear */}
            {(fromDate || toDate) && (
              <button
                onClick={() => { setFromDate(""); setToDate(""); }}
                className="ml-1 text-green-400 hover:text-red-500 text-sm font-bold transition-colors"
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Export buttons */}
        <div className="flex gap-2 ml-auto">
          <button
            disabled={pdfLoading}
            onClick={handlePDF}
            className={`${
              pdfLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 active:scale-95"
            } text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2`}
          >
            {pdfLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Generating...
              </>
            ) : "📄 PDF"}
          </button>

          <button
            onClick={() => exportExcel(displayData, fileName, filterLabel, viewMode)}
            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            📊 Excel
          </button>
        </div>
      </div>

      {/* ── Preview ── */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <MonthlyTPPreview
          month={months[month]}
          year={year}
          data={displayData}
          filterLabel={filterLabel}
          viewMode={viewMode}
        />
      </div>
    </ModalLayout>
  );
};

export default MonthlyTPModal;