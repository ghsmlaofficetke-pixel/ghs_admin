import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { tpSelector } from "../../../../api/tp";
import MonthlyTPPreview from "./MonthlyTPPreview";
import { getMonthlyTP } from "./useMonthlyTP";
import { exportPDF, exportExcel, formatDate, formatWeekdayKannada } from "./tpExport";
import { ModalLayout } from "../../../../components/HeadlessUI";

interface Props {
  open: boolean;
  onClose: () => void;
}

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

type ViewMode = "month" | "day";

const MonthlyTPModal = ({ open, onClose }: Props) => {
  const { all_tp } = useSelector(tpSelector);

  const [month, setMonth]           = useState(new Date().getMonth());
  const [year, setYear]             = useState(new Date().getFullYear());
  const [viewMode, setViewMode]     = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const monthlyData = useMemo(
    () => getMonthlyTP(all_tp, month, year),
    [all_tp, month, year]
  );

  const availableDays = useMemo(
    () => monthlyData.map((tp) => tp.date),
    [monthlyData]
  );

  const displayData = useMemo(() => {
    if (viewMode === "day" && selectedDay)
      return monthlyData.filter((tp) => tp.date === selectedDay);
    return monthlyData;
  }, [viewMode, selectedDay, monthlyData]);

  const filterLabel = useMemo(() => {
    if (viewMode === "day" && selectedDay)
      return `${formatDate(selectedDay)} - ${formatWeekdayKannada(selectedDay)}`;
    return `${months[month]} ${year}`;
  }, [viewMode, selectedDay, month, year]);

  const fileName = useMemo(() => {
    if (viewMode === "day" && selectedDay)
      return `TP-${selectedDay.slice(0, 10)}`;
    return `TP-${months[month]}-${year}`;
  }, [viewMode, selectedDay, month, year]);

  const handlePDF = () => {
    exportPDF(
      displayData,       // ← data directly, no ref needed
      fileName,
      filterLabel,
      () => setPdfLoading(true),
      () => setPdfLoading(false)
    );
  };

  return (
    <ModalLayout
      showModal={open}
      toggleModal={onClose}
      panelClassName="w-[98vw] max-w-[1600px] h-[95vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b px-5 py-3 bg-gray-50 shrink-0">
        <h3 className="text-lg font-bold text-gray-800">Monthly Tour Program</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-600 text-xl font-bold transition-colors">✕</button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 px-5 py-3 bg-white border-b items-center shrink-0">
        {/* View mode toggle */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
          {(["month","day"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                if (mode === "day" && !selectedDay && availableDays[0])
                  setSelectedDay(availableDays[0]);
              }}
              className={`px-4 py-2 font-medium transition-colors border-l first:border-l-0 border-gray-300 ${
                viewMode === mode
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {mode === "month" ? "ತಿಂಗಳು" : "ದಿನ"}
            </button>
          ))}
        </div>

        {/* Month */}
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={month}
          onChange={(e) => { setMonth(Number(e.target.value)); setSelectedDay(""); }}
        >
          {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>

        {/* Year */}
        <select
          className="border border-gray-300 w-24 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          value={year}
          onChange={(e) => { setYear(Number(e.target.value)); setSelectedDay(""); }}
        >
          {[2025, 2026, 2027, 2028].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Day select */}
        {viewMode === "day" && (
          <select
            className="border border-blue-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50 font-medium"
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

        {/* Exports */}
        <div className="flex gap-2 ml-auto">
          <button
            disabled={pdfLoading}
            onClick={handlePDF}
            className={`${
              pdfLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
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
            onClick={() => exportExcel(displayData, fileName, filterLabel)}
            className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            📊 Excel
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4">
        <MonthlyTPPreview
          ref={previewRef}
          month={months[month]}
          year={year}
          data={displayData}
          filterLabel={filterLabel}
        />
      </div>
    </ModalLayout>
  );
};

export default MonthlyTPModal;