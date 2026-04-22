import { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { tpSelector } from "../../../../api/tp";
import MonthlyTPPreview from "./MonthlyTPPreview";
import { getMonthlyTP } from "./useMonthlyTP";
import { exportPDF, exportExcel, printTP } from "./tpExport";
import { ModalLayout } from "../../../../components/HeadlessUI";


interface Props {
  open: boolean;
  onClose: () => void;
}

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MonthlyTPModal = ({ open, onClose }: Props) => {
  const { all_tp } = useSelector(tpSelector);

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const previewRef = useRef<HTMLDivElement>(null);

  const monthlyData = useMemo(
    () => getMonthlyTP(all_tp, month, year),
    [all_tp, month, year]
  );

  return (
   <ModalLayout
  showModal={open}
  toggleModal={onClose}
  panelClassName="
    w-[120vw] 
    max-w-[1500px] 
    h-[95vh] 
    flex 
    flex-col 
    rounded-2xl 
    overflow-hidden
  "
>
  {/* Header */}
  <div className="flex justify-between items-center border-b px-4 sm:px-6 py-3 bg-gray-50">
    <h3 className="text-lg sm:text-xl font-bold">
      Monthly Tour Program
    </h3>
    <button
      onClick={onClose}
      className="text-xl font-bold hover:text-red-600"
    >
      ✕
    </button>
  </div>

  {/* Controls */}
  <div className="flex flex-wrap gap-3 sm:gap-4 p-4 sm:p-5 bg-white border-b items-center">
    <select
      className="border rounded-lg px-4 sm:px-6 py-2 w-full sm:w-auto"
      value={month}
      onChange={(e) => setMonth(Number(e.target.value))}
    >
      {months?.map((m, i) => (
        <option key={m} value={i}>
          {m}
        </option>
      ))}
    </select>

    <select
      className="border rounded-lg px-4 sm:px-8 py-2 w-full sm:w-auto"
      value={year}
      onChange={(e) => setYear(Number(e.target.value))}
    >
      {[2025, 2026, 2027, 2028].map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>

    <div className="flex gap-2 sm:gap-3 ml-auto flex-wrap ">
      <button
        className="bg-red-600  hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
        onClick={() =>
          previewRef?.current &&
          exportPDF(previewRef?.current, `TP-${months[month]}-${year}`)
        }
      >
        PDF
      </button>

      <button
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
  onClick={() =>
    exportExcel(monthlyData, `TP-${months[month]}-${year}`)
  }
>
  Excel
</button>

     {/* <button
  className="hidden md:inline-block bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
  onClick={() =>
    previewRef.current && printTP(previewRef.current)
  }
>
  Print
</button> */}
    </div>
  </div>

  {/* Preview */}
  <div className="flex-1 px-3 sm:px-5 pb-5 overflow-auto bg-gray-100">
    <MonthlyTPPreview
      ref={previewRef}
      month={months[month]}
      year={year}
      data={monthlyData}
    />
  </div>
</ModalLayout>

  );
};

export default MonthlyTPModal;
