import html2pdf from "html2pdf.js";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import './index.css'

/* =========================
   HELPERS
========================= */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

/* =========================
   EXPORT PDF (COMMUNITY STYLE)
========================= */
export const exportPDF = async (
  element: HTMLElement,
  fileName: string
) => {
  const opt = {
    margin: [12, 12, 12, 12], // top left bottom right
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: {
      mode: ["css"],
    },
  };

  await html2pdf().from(element).set(opt).save();
};

/* =========================
   EXPORT EXCEL
========================= */
export const exportExcel = (monthlyData: any[], fileName: string) => {
  const rows: any[] = [];

  monthlyData.forEach((tp) => {
    tp.events.forEach((ev: any) => {
      rows.push({
        Date: formatDate(tp.date),
        Day: formatWeekdayKannada(tp.date),
        Time: ev.time || "-",
        Description: ev.description || "",
        Location: ev.location || "-",
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tour Program");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};

/* =========================
   PRINT (UNCHANGED)
========================= */
export const printTP = (element: HTMLElement) => {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Print Tour Program</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 14mm;
          }

          body {
            font-family: "Times New Roman", serif;
            padding: 0;
          }

          .print-page {
            border: 2px solid #1e40af;
            padding: 16px;
            min-height: 180mm;
            box-sizing: border-box;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          td, th {
            border: 1px solid #000;
            padding: 8px;
            font-size: 13px;
            vertical-align: top;
          }

          th {
            background: #dbeafe;
            font-weight: 600;
            text-align: center;
          }

          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          tr {
            page-break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="print-page">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
  win.close();
};