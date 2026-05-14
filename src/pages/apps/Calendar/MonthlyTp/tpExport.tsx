// tpExport.ts — FIXED: no empty space, correct budget per page type
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

const PAGE_W         = 794;
const PAGE_H         = 1123;
const HEADER_H_FIRST = 88;
const HEADER_H_CONT  = 40;
const FOOTER_H_FULL  = 56;  // last page
const FOOTER_H_SLIM  = 24;  // middle pages
const THEAD_H        = 38;
const COL_DATE       = 105;
const COL_TIME       = 78;
const COL_LOC        = 145;
const PAD            = 16;   // top+bottom padding inside body

const sanitizeKeepBold = (html: string): string =>
  (html || "").replace(/<(?!\/?(?:b|strong|br)\b)[^>]*>/gi, "").trim();

/* ─────────────────────────────────────────────
   BUDGET — exact per page position
───────────────────────────────────────────── */
const getBudget = (isFirstPage: boolean, isLastPage: boolean): number =>
  PAGE_H
  - (isFirstPage ? HEADER_H_FIRST : HEADER_H_CONT)
  - (isLastPage  ? FOOTER_H_FULL  : FOOTER_H_SLIM)
  - THEAD_H
  - PAD;

/* ─────────────────────────────────────────────
   BUILD ONE ROW HTML
───────────────────────────────────────────── */
const buildRow = (
  ev: any,
  tp: any,
  isFirstInGroup: boolean,
  isLastInGroup: boolean
): string => {
  const bb = isLastInGroup ? "border-bottom:2.5px solid #6b7280;" : "";
  const dateTd = isFirstInGroup
    ? `<td style="border:1px solid #9ca3af;${bb}padding:0;text-align:center;vertical-align:middle;font-weight:600;background:#f3f4f6;color:#111;line-height:1.5;width:${COL_DATE}px;">
        <div style="font-size:13px;padding:4px 6px 2px;">${formatDate(tp.date)}</div>
        <div style="font-size:11px;color:#555;padding:0 6px 4px;">${formatWeekdayKannada(tp.date)}</div>
       </td>`
    : `<td style="border:1px solid #9ca3af;${bb}padding:0;background:#f9fafb;width:${COL_DATE}px;"></td>`;
  return `<tr>
    ${dateTd}
    <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;text-align:center;font-size:13px;color:${ev.time ? "#111" : "#9ca3af"};vertical-align:middle;white-space:nowrap;width:${COL_TIME}px;">${ev.time || "–"}</td>
    <td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;vertical-align:top;line-height:1.7;word-break:break-word;color:#111;">${sanitizeKeepBold(ev.description || "–")}</td>
    <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;vertical-align:top;word-break:break-word;color:${ev.location ? "#111" : "#9ca3af"};width:${COL_LOC}px;">${ev.location || "–"}</td>
  </tr>`;
};

/* ─────────────────────────────────────────────
   MEASURE ACTUAL GROUP HEIGHTS via hidden DOM
───────────────────────────────────────────── */
interface RowGroup {
  rows: string[];
  height: number;
}

const measureGroups = async (monthlyData: any[]): Promise<RowGroup[]> => {
  let allRowsHtml = "";
  monthlyData.forEach((tp, gIdx) => {
    const evCount = tp.events.length;
    tp.events.forEach((ev: any, idx: number) => {
      const isLast = idx === evCount - 1;
      const bb = isLast ? "border-bottom:2.5px solid #6b7280;" : "";
      allRowsHtml += `<tr data-group="${gIdx}">`;
      if (idx === 0) {
        allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:0;text-align:center;vertical-align:middle;font-weight:600;background:#f3f4f6;color:#111;line-height:1.5;width:${COL_DATE}px;">
          <div style="font-size:13px;padding:4px 6px 2px;">${formatDate(tp.date)}</div>
          <div style="font-size:11px;color:#555;padding:0 6px 4px;">${formatWeekdayKannada(tp.date)}</div>
        </td>`;
      } else {
        allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:0;background:#f9fafb;width:${COL_DATE}px;"></td>`;
      }
      allRowsHtml += `
        <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;white-space:nowrap;width:${COL_TIME}px;">${ev.time || "–"}</td>
        <td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;line-height:1.7;word-break:break-word;">${sanitizeKeepBold(ev.description || "–")}</td>
        <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;word-break:break-word;width:${COL_LOC}px;">${ev.location || "–"}</td>
      </tr>`;
    });
  });

  const container = document.createElement("div");
  container.style.cssText = `position:fixed;top:0;left:-9999px;width:${PAGE_W}px;visibility:hidden;pointer-events:none;z-index:99999;`;
  container.innerHTML = `
    <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px;">
      <colgroup>
        <col style="width:${COL_DATE}px"/>
        <col style="width:${COL_TIME}px"/>
        <col/>
        <col style="width:${COL_LOC}px"/>
      </colgroup>
      <tbody id="mtbody">${allRowsHtml}</tbody>
    </table>`;
  document.body.appendChild(container);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 120));

  const groupHeights: number[] = new Array(monthlyData.length).fill(0);
  container.querySelectorAll<HTMLTableRowElement>("tr[data-group]").forEach(tr => {
    const g = parseInt(tr.getAttribute("data-group")!, 10);
    groupHeights[g] += tr.getBoundingClientRect().height;
  });
  document.body.removeChild(container);

  return monthlyData.map((tp, gIdx) => {
    const evCount = tp.events.length;
    const rows = tp.events.map((ev: any, idx: number) =>
      buildRow(ev, tp, idx === 0, idx === evCount - 1)
    );
    return { rows, height: Math.ceil(groupHeights[gIdx]) + 4 };
  });
};

/* ─────────────────────────────────────────────
   PAGINATE — 2-pass to know isLast correctly
   Pass 1: paginate assuming every page is NOT last (slim footer budget)
   Pass 2: last page identified → re-check if last page overflows with full footer
           if yes → push one more page
───────────────────────────────────────────── */
const paginateGroups = (groups: RowGroup[]): string[][] => {

  const doPass = (lastPageIndex: number): string[][] => {
    const pages: string[][] = [];
    let cur: string[] = [];
    let used = 0;

    const flush = () => { if (cur.length) { pages.push([...cur]); cur = []; used = 0; } };

    const budget = (pageIdx: number) => {
      const isFirst = pageIdx === 0;
      const isLast  = pageIdx === lastPageIndex;
      return getBudget(isFirst, isLast);
    };

    for (const group of groups) {
      const bud = budget(pages.length);
      if (used + group.height <= bud) {
        group.rows.forEach(r => cur.push(r));
        used += group.height;
      } else {
        flush();
        const freshBud = budget(pages.length);
        if (group.height <= freshBud) {
          group.rows.forEach(r => cur.push(r));
          used += group.height;
        } else {
          // Too tall — split row by row
          const rowH = group.height / group.rows.length;
          for (const row of group.rows) {
            if (used + rowH > budget(pages.length)) flush();
            cur.push(row);
            used += rowH;
          }
        }
      }
    }
    flush();

    if (pages.length === 0)
      pages.push([`<tr><td colspan="4" style="text-align:center;padding:28px;color:#9ca3af;font-size:13px;border:1px solid #9ca3af;">ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಗೆ ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮ ಇಲ್ಲ</td></tr>`]);

    return pages;
  };

  // Pass 1: assume last page = Infinity (all pages use slim footer budget)
  const pass1 = doPass(Infinity);
  const guessedLastIdx = pass1.length - 1;

  // Pass 2: now we know last page index — re-run with correct budget
  const pass2 = doPass(guessedLastIdx);

  // If pass2 has more pages than pass1 (last page overflowed with full footer),
  // run one more time with the new last index
  if (pass2.length > pass1.length) {
    return doPass(pass2.length - 1);
  }

  return pass2;
};

/* ─────────────────────────────────────────────
   BUILD PAGE HTML
───────────────────────────────────────────── */
const buildPage = (
  rows: string,
  filterLabel: string,
  isFirst: boolean,
  isLast: boolean,
  pageNum: number,
  totalPages: number
): string => {
  const header = isFirst
    ? `<div style="background:#fff;text-align:center;padding:16px 24px 14px;border-bottom:2px solid #111;flex-shrink:0;">
        <div style="font-size:16px;font-weight:800;color:#111;line-height:1.7;">&#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0; &#x0C9C;&#x0CBF;.&#x0CB9;&#x0CC6;&#x0C9A;&#x0CCD;. &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0;&#x0CA8;&#x0CBF;&#x0CB5;&#x0CBE;&#x0CB8;, &#x0CB6;&#x0CBE;&#x0CB8;&#x0C95;&#x0CB0;&#x0CC1;, &#x0CA4;&#x0CB0;&#x0CC0;&#x0C95;&#x0CC6;&#x0CB0;&#x0CC6; &#x0CB5;&#x0CBF;&#x0CA7;&#x0CBE;&#x0CA8; &#x0CB8;&#x0CAD;&#x0CBE;&#x0C95;&#x0CCD;&#x0CB7;&#x0CC7;&#x0CA4;&#x0CCD;&#x0CB0; &#x0CB0;&#x0CB5;&#x0CB0;&#x0CC1;</div>
        <div style="font-size:13px;color:#333;margin-top:5px;">${filterLabel} &#x0CB0; &#x0CAE;&#x0CBE;&#x0CB9;&#x0CC6;&#x0CAF;&#x0CB2;&#x0CCD;&#x0CB2;&#x0CBF; &#x0C95;&#x0AF3;&#x0C97;&#x0CCA;&#x0CB3;&#x0CCD;&#x0CB3;&#x0CB2;&#x0CBF;&#x0CB0;&#x0CC1;&#x0CB5; &#x0CAA;&#x0CCD;&#x0CB0;&#x0CB5;&#x0CBE;&#x0CB8; &#x0C95;&#x0CBE;&#x0CB0;&#x0CCD;&#x0CAF;&#x0C95;&#x0CCD;&#x0CB0;&#x0CAE;&#x0C97;&#x0CB3;&#x0CC1;</div>
      </div>`
    : `<div style="background:#f3f4f6;text-align:center;padding:10px 20px;border-bottom:1px solid #d1d5db;font-size:12px;color:#333;font-weight:600;flex-shrink:0;">
        &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0; &#x0C9C;&#x0CBF;.&#x0CB9;&#x0CC6;&#x0C9A;&#x0CCD;. &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0;&#x0CA8;&#x0CBF;&#x0CB5;&#x0CBE;&#x0CB8; — ${filterLabel} — &#x0CAE;&#x0CC1;&#x0C82;&#x0CA6;&#x0CC1;&#x0CB5;&#x0CB0;&#x0CBF;&#x0CA6;&#x0CC6;...
      </div>`;

  const thead = `<tr>${["ದಿನಾಂಕ","ಸಮಯ","ಕಾರ್ಯಕ್ರಮ","ಸ್ಥಳ"].map(h =>
    `<th style="background:#e5e7eb;color:#111;font-weight:700;font-size:14px;padding:9px 10px;border:1px solid #9ca3af;text-align:center;">${h}</th>`
  ).join("")}</tr>`;

  const footer = isLast
    ? `<div style="border-top:2px solid #111;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;flex-shrink:0;">
        <div style="font-size:10px;color:#555;">Generated: ${new Date().toLocaleDateString("en-GB")}</div>
        <div style="text-align:center;line-height:1.7;">
          <div style="font-size:10px;color:#555;">ಸಹಿ/-</div>
          <div style="font-weight:700;font-size:13px;color:#111;">ಶ್ರೀನಿವಾಸ ಡಿ.</div>
          <div style="font-size:10px;color:#555;">ಶಾಸಕರ ಆಪ್ತ ಸಹಾಯಕರು</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px;color:#333;">GHS MLA Office — Tarikere</div>
          <div style="font-size:10px;color:#333;margin-top:3px;">Page ${pageNum} of ${totalPages}</div>
        </div>
      </div>`
    : `<div style="border-top:1px solid #d1d5db;padding:5px 20px;display:flex;justify-content:flex-end;background:#f9fafb;flex-shrink:0;">
        <div style="font-size:9px;color:#9ca3af;">Page ${pageNum} of ${totalPages}</div>
      </div>`;

  return `
    <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;color:#111;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;">
      ${header}
      <div style="flex:1;overflow:hidden;padding:8px 20px;">
        <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px;">
          <colgroup>
            <col style="width:${COL_DATE}px"/>
            <col style="width:${COL_TIME}px"/>
            <col/>
            <col style="width:${COL_LOC}px"/>
          </colgroup>
          <thead>${thead}</thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${footer}
    </div>`;
};

/* ─────────────────────────────────────────────
   CAPTURE ONE PAGE
───────────────────────────────────────────── */
const capturePage = async (html: string): Promise<HTMLCanvasElement> => {
  const wrap = document.createElement("div");
  wrap.style.cssText = `position:fixed;top:0;left:-9999px;width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;z-index:99999;pointer-events:none;`;
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 350));
  const canvas = await html2canvas(wrap, {
    scale: 2.5, useCORS: true, allowTaint: true,
    backgroundColor: "#ffffff", logging: false,
    width: PAGE_W, height: PAGE_H,
    windowWidth: PAGE_W, windowHeight: PAGE_H,
  });
  document.body.removeChild(wrap);
  return canvas;
};

/* ─────────────────────────────────────────────
   EXPORT PDF
───────────────────────────────────────────── */
export const exportPDF = async (
  monthlyData: any[],
  fileName: string,
  filterLabel: string,
  onStart?: () => void,
  onDone?: () => void
) => {
  onStart?.();
  try {
    const groups     = await measureGroups(monthlyData);
    const pageChunks = paginateGroups(groups);
    const total      = pageChunks.length;

    const pdf  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < total; i++) {
      if (i > 0) pdf.addPage();
      const html = buildPage(pageChunks[i].join(""), filterLabel, i === 0, i === total - 1, i + 1, total);
      const canvas = await capturePage(html);
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, pdfW, pdfH);
    }
    pdf.save(`${fileName}.pdf`);
  } catch (err) {
    console.error("PDF export failed:", err);
    alert("PDF generation failed. Please try again.");
  } finally {
    onDone?.();
  }
};

/* ─────────────────────────────────────────────
   EXPORT EXCEL
───────────────────────────────────────────── */
export const exportExcel = (
  monthlyData: any[],
  fileName: string,
  filterLabel: string
) => {
  const titleRow = ["ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು","","","",""];
  const subRow   = [`${filterLabel} ರ ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`,"","","",""];
  const blankRow = ["","","","",""];
  const headers  = ["ದಿನಾಂಕ","ವಾರ","ಸಮಯ","ಕಾರ್ಯಕ್ರಮ","ಸ್ಥಳ"];
  const dataRows: any[][] = [];
  monthlyData.forEach((tp) => {
    tp.events.forEach((ev: any, idx: number) => {
      dataRows.push([
        idx === 0 ? formatDate(tp.date) : "",
        idx === 0 ? formatWeekdayKannada(tp.date) : "",
        ev.time || "-",
        (ev.description || "").replace(/<[^>]*>/g, "").trim(),
        ev.location || "-",
      ]);
    });
  });
  const ws = XLSX.utils.aoa_to_sheet([titleRow, subRow, blankRow, headers, ...dataRows]);
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  ];
  ws["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 62 }, { wch: 34 }];
  ws["!rows"] = [{ hpt: 26 }, { hpt: 18 }, { hpt: 6 }, { hpt: 18 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tour Program");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${fileName}.xlsx`
  );
};