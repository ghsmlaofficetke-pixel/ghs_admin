// // tpExport.ts — FIXED: no empty space, correct budget per page type
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";

// export const formatDate = (date: string) =>
//   new Date(date).toLocaleDateString("en-GB");

// export const formatWeekdayKannada = (date: string) =>
//   new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

// const PAGE_W         = 794;
// const PAGE_H         = 1123;
// const HEADER_H_FIRST = 88;
// const HEADER_H_CONT  = 40;
// const FOOTER_H_FULL  = 56;  // last page
// const FOOTER_H_SLIM  = 24;  // middle pages
// const THEAD_H        = 38;
// const COL_DATE       = 105;
// const COL_TIME       = 78;
// const COL_LOC        = 145;
// const PAD            = 16;   // top+bottom padding inside body

// const sanitizeKeepBold = (html: string): string =>
//   (html || "").replace(/<(?!\/?(?:b|strong|br)\b)[^>]*>/gi, "").trim();

// /* ─────────────────────────────────────────────
//    BUDGET — exact per page position
// ───────────────────────────────────────────── */
// const getBudget = (isFirstPage: boolean, isLastPage: boolean): number =>
//   PAGE_H
//   - (isFirstPage ? HEADER_H_FIRST : HEADER_H_CONT)
//   - (isLastPage  ? FOOTER_H_FULL  : FOOTER_H_SLIM)
//   - THEAD_H
//   - PAD;

// /* ─────────────────────────────────────────────
//    BUILD ONE ROW HTML
// ───────────────────────────────────────────── */
// const buildRow = (
//   ev: any,
//   tp: any,
//   isFirstInGroup: boolean,
//   isLastInGroup: boolean
// ): string => {
//   const bb = isLastInGroup ? "border-bottom:2.5px solid #6b7280;" : "";
//  const dateTd = isFirstInGroup
//   ? `<td rowspan="${tp.events.length}"
//       style="
//         border:1px solid #9ca3af;
//         ${bb}
//         padding:0;
//         text-align:center;
//         vertical-align:middle;
//         font-weight:600;
//         background:#f3f4f6;
//         color:#111;
//         line-height:1.5;
//         width:${COL_DATE}px;
//       ">
//         <div style="font-size:13px;padding:4px 6px 2px;">
//           ${formatDate(tp.date)}
//         </div>
//         <div style="font-size:11px;color:#555;padding:0 6px 4px;">
//           ${formatWeekdayKannada(tp.date)}
//         </div>
//      </td>`
//   : "";
//   return `<tr>
//     ${dateTd}
//     <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;text-align:center;font-size:13px;color:${ev.time ? "#111" : "#9ca3af"};vertical-align:middle;white-space:nowrap;width:${COL_TIME}px;">${ev.time || "–"}</td>
//     <td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;vertical-align:top;line-height:1.7;word-break:break-word;color:#111;">${sanitizeKeepBold(ev.description || "–")}</td>
//     <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;vertical-align:top;word-break:break-word;color:${ev.location ? "#111" : "#9ca3af"};width:${COL_LOC}px;">${ev.location || "–"}</td>
//   </tr>`;
// };

// /* ─────────────────────────────────────────────
//    MEASURE ACTUAL GROUP HEIGHTS via hidden DOM
// ───────────────────────────────────────────── */
// interface RowGroup {
//   rows: string[];
//   height: number;
// }

// const measureGroups = async (monthlyData: any[]): Promise<RowGroup[]> => {
//   let allRowsHtml = "";

//   monthlyData.forEach((tp, gIdx) => {
//     const evCount = tp.events.length;

//     tp.events.forEach((ev: any, idx: number) => {
//       const isLast = idx === evCount - 1;
//       const bb = isLast
//         ? "border-bottom:2.5px solid #6b7280;"
//         : "";

//       allRowsHtml += `<tr data-group="${gIdx}">`;

//       // ── DATE CELL (MERGED WITH ROWSPAN) ──
//       if (idx === 0) {
//         allRowsHtml += `
//           <td
//             rowspan="${evCount}"
//             style="
//               border:1px solid #9ca3af;
//               ${bb}
//               padding:0;
//               text-align:center;
//               vertical-align:middle;
//               font-weight:600;
//               background:#f3f4f6;
//               color:#111;
//               line-height:1.5;
//               width:${COL_DATE}px;
//             "
//           >
//             <div style="font-size:13px;padding:4px 6px 2px;">
//               ${formatDate(tp.date)}
//             </div>

//             <div style="font-size:11px;color:#555;padding:0 6px 4px;">
//               ${formatWeekdayKannada(tp.date)}
//             </div>
//           </td>
//         `;
//       }

//       // ── TIME ──
//       allRowsHtml += `
//         <td
//           style="
//             border:1px solid #9ca3af;
//             ${bb}
//             padding:8px 10px;
//             font-size:13px;
//             white-space:nowrap;
//             width:${COL_TIME}px;
//             text-align:center;
//             vertical-align:middle;
//             color:${ev.time ? "#111" : "#9ca3af"};
//           "
//         >
//           ${ev.time || "–"}
//         </td>
//       `;

//       // ── DESCRIPTION ──
//       allRowsHtml += `
//         <td
//           style="
//             border:1px solid #9ca3af;
//             ${bb}
//             padding:8px 12px;
//             font-size:13px;
//             line-height:1.7;
//             word-break:break-word;
//             vertical-align:top;
//             color:#111;
//           "
//         >
//           ${sanitizeKeepBold(ev.description || "–")}
//         </td>
//       `;

//       // ── LOCATION ──
//       allRowsHtml += `
//         <td
//           style="
//             border:1px solid #9ca3af;
//             ${bb}
//             padding:8px 10px;
//             font-size:13px;
//             word-break:break-word;
//             width:${COL_LOC}px;
//             vertical-align:top;
//             color:${ev.location ? "#111" : "#9ca3af"};
//           "
//         >
//           ${ev.location || "–"}
//         </td>
//       `;

//       allRowsHtml += `</tr>`;
//     });
//   });

//   const container = document.createElement("div");

//   container.style.cssText = `
//     position:fixed;
//     top:0;
//     left:-9999px;
//     width:${PAGE_W}px;
//     visibility:hidden;
//     pointer-events:none;
//     z-index:99999;
//     font-family:'Noto Sans Kannada',serif;
//   `;

//   container.innerHTML = `
//     <table
//       style="
//         width:100%;
//         border-collapse:collapse;
//         table-layout:fixed;
//         font-size:13px;
//       "
//     >
//       <colgroup>
//         <col style="width:${COL_DATE}px"/>
//         <col style="width:${COL_TIME}px"/>
//         <col/>
//         <col style="width:${COL_LOC}px"/>
//       </colgroup>

//       <tbody id="mtbody">
//         ${allRowsHtml}
//       </tbody>
//     </table>
//   `;

//   document.body.appendChild(container);

//   await document.fonts.ready;
//   await new Promise((r) => setTimeout(r, 600));

//   const groupHeights: number[] = new Array(monthlyData.length).fill(0);

//   container
//     .querySelectorAll<HTMLTableRowElement>("tr[data-group]")
//     .forEach((tr) => {
//       const g = parseInt(tr.getAttribute("data-group")!, 10);
//       groupHeights[g] += tr.getBoundingClientRect().height;
//     });

//   document.body.removeChild(container);

//   return monthlyData.map((tp, gIdx) => {
//     const evCount = tp.events.length;

//     const rows = tp.events.map((ev: any, idx: number) =>
//       buildRow(ev, tp, idx === 0, idx === evCount - 1)
//     );

//     return {
//       rows,
//       height: Math.ceil(groupHeights[gIdx]) + 4,
//     };
//   });
// };

// /* ─────────────────────────────────────────────
//    PAGINATE — 2-pass to know isLast correctly
//    Pass 1: paginate assuming every page is NOT last (slim footer budget)
//    Pass 2: last page identified → re-check if last page overflows with full footer
//            if yes → push one more page
// ───────────────────────────────────────────── */
// const paginateGroups = (groups: RowGroup[]): string[][] => {

//   const doPass = (lastPageIndex: number): string[][] => {
//     const pages: string[][] = [];
//     let cur: string[] = [];
//     let used = 0;

//     const flush = () => { if (cur.length) { pages.push([...cur]); cur = []; used = 0; } };

//     const budget = (pageIdx: number) => {
//       const isFirst = pageIdx === 0;
//       const isLast  = pageIdx === lastPageIndex;
//       return getBudget(isFirst, isLast);
//     };

//     for (const group of groups) {
//       const bud = budget(pages.length);
//       if (used + group.height <= bud) {
//         group.rows.forEach(r => cur.push(r));
//         used += group.height;
//       } else {
//         flush();
//         const freshBud = budget(pages.length);
//         if (group.height <= freshBud) {
//           group.rows.forEach(r => cur.push(r));
//           used += group.height;
//         } else {
//           // Too tall — split row by row
//           const rowH = group.height / group.rows.length;
//           for (const row of group.rows) {
//             if (used + rowH > budget(pages.length)) flush();
//             cur.push(row);
//             used += rowH;
//           }
//         }
//       }
//     }
//     flush();

//     if (pages.length === 0)
//       pages.push([`<tr><td colspan="4" style="text-align:center;padding:28px;color:#9ca3af;font-size:13px;border:1px solid #9ca3af;">ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಗೆ ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮ ಇಲ್ಲ</td></tr>`]);

//     return pages;
//   };

//   // Pass 1: assume last page = Infinity (all pages use slim footer budget)
//   const pass1 = doPass(Infinity);
//   const guessedLastIdx = pass1.length - 1;

//   // Pass 2: now we know last page index — re-run with correct budget
//   const pass2 = doPass(guessedLastIdx);

//   // If pass2 has more pages than pass1 (last page overflowed with full footer),
//   // run one more time with the new last index
//   if (pass2.length > pass1.length) {
//     return doPass(pass2.length - 1);
//   }

//   return pass2;
// };

// /* ─────────────────────────────────────────────
//    BUILD PAGE HTML
// ───────────────────────────────────────────── */
// const buildPage = (
//   rows: string,
//   filterLabel: string,
//   isFirst: boolean,
//   isLast: boolean,
//   pageNum: number,
//   totalPages: number
// ): string => {
//   const header = isFirst
//     ? `<div style="background:#fff;text-align:center;padding:16px 24px 14px;border-bottom:2px solid #111;flex-shrink:0;">
//         <div style="font-size:16px;font-weight:800;color:#111;line-height:1.7;">&#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0; &#x0C9C;&#x0CBF;.&#x0CB9;&#x0CC6;&#x0C9A;&#x0CCD;. &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0;&#x0CA8;&#x0CBF;&#x0CB5;&#x0CBE;&#x0CB8;, &#x0CB6;&#x0CBE;&#x0CB8;&#x0C95;&#x0CB0;&#x0CC1;, &#x0CA4;&#x0CB0;&#x0CC0;&#x0C95;&#x0CC6;&#x0CB0;&#x0CC6; &#x0CB5;&#x0CBF;&#x0CA7;&#x0CBE;&#x0CA8; &#x0CB8;&#x0CAD;&#x0CBE;&#x0C95;&#x0CCD;&#x0CB7;&#x0CC7;&#x0CA4;&#x0CCD;&#x0CB0; &#x0CB0;&#x0CB5;&#x0CB0;&#x0CC1;</div>
//         <div style="font-size:13px;color:#333;margin-top:5px;">
//   ${
//     filterLabel.includes("to") ||
//     filterLabel.includes("/") ||
//     filterLabel.includes("-")
//       ? `${filterLabel} ದಂದು ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`
//       : `${filterLabel} ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`
//   }
// </div>`
//     : `<div style="background:#f3f4f6;text-align:center;padding:10px 20px;border-bottom:1px solid #d1d5db;font-size:12px;color:#333;font-weight:600;flex-shrink:0;">
//         &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0; &#x0C9C;&#x0CBF;.&#x0CB9;&#x0CC6;&#x0C9A;&#x0CCD;. &#x0CB6;&#x0CCD;&#x0CB0;&#x0CC0;&#x0CA8;&#x0CBF;&#x0CB5;&#x0CBE;&#x0CB8; — ${filterLabel} — &#x0CAE;&#x0CC1;&#x0C82;&#x0CA6;&#x0CC1;&#x0CB5;&#x0CB0;&#x0CBF;&#x0CA6;&#x0CC6;...
//       </div>`;

//   const thead = `<tr>${["ದಿನಾಂಕ","ಸಮಯ","ಕಾರ್ಯಕ್ರಮ","ಸ್ಥಳ"].map(h =>
//     `<th style="background:#e5e7eb;color:#111;font-weight:700;font-size:14px;padding:9px 10px;border:1px solid #9ca3af;text-align:center;">${h}</th>`
//   ).join("")}</tr>`;

//   const footer = isLast
//     ? `<div style="border-top:2px solid #111;padding:10px 20px;display:flex;justify-content:space-between;align-items:center;background:#f9fafb;flex-shrink:0;">
//         <div style="font-size:10px;color:#555;">Generated: ${new Date().toLocaleDateString("en-GB")}</div>
//         <div style="text-align:center;line-height:1.7;">
//           <div style="font-size:10px;color:#555;">ಸಹಿ/-</div>
//           <div style="font-weight:700;font-size:13px;color:#111;">ಶ್ರೀನಿವಾಸ ಡಿ.</div>
//           <div style="font-size:10px;color:#555;">ಶಾಸಕರ ಆಪ್ತ ಸಹಾಯಕರು</div>
//         </div>
//         <div style="text-align:right;">
//           <div style="font-size:10px;color:#333;">GHS MLA Office — Tarikere</div>
//           <div style="font-size:10px;color:#333;margin-top:3px;">Page ${pageNum} of ${totalPages}</div>
//         </div>
//       </div>`
//     : `<div style="border-top:1px solid #d1d5db;padding:5px 20px;display:flex;justify-content:flex-end;background:#f9fafb;flex-shrink:0;">
//         <div style="font-size:9px;color:#9ca3af;">Page ${pageNum} of ${totalPages}</div>
//       </div>`;

//   return `
//     <div style="width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;color:#111;display:flex;flex-direction:column;box-sizing:border-box;overflow:hidden;">
//       ${header}
//       <div style="flex:1;overflow:hidden;padding:8px 20px;">
//         <table style="width:100%;border-collapse:collapse;table-layout:fixed;font-size:13px;">
//           <colgroup>
//             <col style="width:${COL_DATE}px"/>
//             <col style="width:${COL_TIME}px"/>
//             <col/>
//             <col style="width:${COL_LOC}px"/>
//           </colgroup>
//           <thead>${thead}</thead>
//           <tbody>${rows}</tbody>
//         </table>
//       </div>
//       ${footer}
//     </div>`;
// };

// /* ─────────────────────────────────────────────
//    CAPTURE ONE PAGE
// ───────────────────────────────────────────── */
// const capturePage = async (html: string): Promise<HTMLCanvasElement> => {
//   const wrap = document.createElement("div");
//   wrap.style.cssText = `position:fixed;top:0;left:-9999px;width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;z-index:99999;pointer-events:none;font-family:'Noto Sans Kannada',serif;`;
//   wrap.innerHTML = html;
//   document.body.appendChild(wrap);
//   await document.fonts.ready;
//   await new Promise(r => setTimeout(r, 800));
//   const canvas = await html2canvas(wrap, {
//     scale: 2.5, useCORS: true, allowTaint: true,
//     backgroundColor: "#ffffff", logging: false,
//     width: PAGE_W, height: PAGE_H,
//     windowWidth: PAGE_W, windowHeight: PAGE_H,
//   });
//   document.body.removeChild(wrap);
//   return canvas;
// };

// /* ─────────────────────────────────────────────
//    EXPORT PDF
// ───────────────────────────────────────────── */
// export const exportPDF = async (
//   monthlyData: any[],
//   fileName: string,
//   filterLabel: string,
//   onStart?: () => void,
//   onDone?: () => void
// ) => {
//   onStart?.();
//   try {
//     const groups     = await measureGroups(monthlyData);
//     const pageChunks = paginateGroups(groups);
//     const total      = pageChunks.length;

//     const pdf  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
//     const pdfW = pdf.internal.pageSize.getWidth();
//     const pdfH = pdf.internal.pageSize.getHeight();

//     for (let i = 0; i < total; i++) {
//       if (i > 0) pdf.addPage();
//       const html = buildPage(pageChunks[i].join(""), filterLabel, i === 0, i === total - 1, i + 1, total);
//       const canvas = await capturePage(html);
//       pdf.addImage(canvas.toDataURL("image/jpeg", 0.97), "JPEG", 0, 0, pdfW, pdfH);
//     }
//     pdf.save(`${fileName}.pdf`);
//   } catch (err) {
//     console.error("PDF export failed:", err);
//     alert("PDF generation failed. Please try again.");
//   } finally {
//     onDone?.();
//   }
// };

// /* ─────────────────────────────────────────────
//    EXPORT EXCEL
// ───────────────────────────────────────────── */
// export const exportExcel = (
//   monthlyData: any[],
//   fileName: string,
//   filterLabel: string
// ) => {
//   const titleRow = ["ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು","","","",""];
//   const subRow   = [`${filterLabel} ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`,"","","",""];
//   const blankRow = ["","","","",""];
//   const headers  = ["ದಿನಾಂಕ","ವಾರ","ಸಮಯ","ಕಾರ್ಯಕ್ರಮ","ಸ್ಥಳ"];
//   const dataRows: any[][] = [];
//   monthlyData.forEach((tp) => {
//     tp.events.forEach((ev: any, idx: number) => {
//       dataRows.push([
//         idx === 0 ? formatDate(tp.date) : "",
//         idx === 0 ? formatWeekdayKannada(tp.date) : "",
//         ev.time || "-",
//         (ev.description || "").replace(/<[^>]*>/g, "").trim(),
//         ev.location || "-",
//       ]);
//     });
//   });
//   const ws = XLSX.utils.aoa_to_sheet([titleRow, subRow, blankRow, headers, ...dataRows]);
//   ws["!merges"] = [
//     { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
//     { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
//   ];
//   ws["!cols"] = [{ wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 62 }, { wch: 34 }];
//   ws["!rows"] = [{ hpt: 26 }, { hpt: 18 }, { hpt: 6 }, { hpt: 18 }];
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Tour Program");
//   const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//   saveAs(
//     new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
//     `${fileName}.xlsx`
//   );
// };



// tpExport.ts — Full update: monthly + weekly + daily PDF & Excel export
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export type ViewMode = "monthly" | "weekly" | "daily";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

// ── Page layout constants ────────────────────────────────────────────────────
const PAGE_W         = 794;
const PAGE_H         = 1123;
const HEADER_H_FIRST = 88;
const HEADER_H_CONT  = 40;
const FOOTER_H_FULL  = 56;  // last page
const FOOTER_H_SLIM  = 24;  // middle pages
const THEAD_H        = 38;
const WEEK_SEP_H     = 30;  // week separator row height estimate
const COL_DATE       = 105;
const COL_TIME       = 78;
const COL_LOC        = 145;
const PAD            = 16;

const sanitizeKeepBold = (html: string): string =>
  (html || "").replace(/<(?!\/?(?:b|strong|br)\b)[^>]*>/gi, "").trim();

// ── ISO week number ──────────────────────────────────────────────────────────
const getISOWeek = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const getWeekRangeLabel = (weekData: any[]): string => {
  if (!weekData.length) return "";
  const dates = weekData.map((tp) => new Date(tp.date)).sort((a, b) => a.getTime() - b.getTime());
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
  return `${fmt(dates[0])} – ${fmt(dates[dates.length - 1])}`;
};

/** Group TP[] by ISO week number */
const groupByWeek = (data: any[]): Map<number, any[]> => {
  const map = new Map<number, any[]>();
  data.forEach((tp) => {
    const wk = getISOWeek(new Date(tp.date));
    if (!map.has(wk)) map.set(wk, []);
    map.get(wk)!.push(tp);
  });
  return map;
};

// ── Budget per page ──────────────────────────────────────────────────────────
const getBudget = (isFirstPage: boolean, isLastPage: boolean): number =>
  PAGE_H
  - (isFirstPage ? HEADER_H_FIRST : HEADER_H_CONT)
  - (isLastPage  ? FOOTER_H_FULL  : FOOTER_H_SLIM)
  - THEAD_H
  - PAD;

// ── Subtitle builder ─────────────────────────────────────────────────────────
const buildSubtitle = (viewMode: ViewMode, filterLabel: string): string => {
  const isRange =
    filterLabel.includes("to") || filterLabel.includes("/") || filterLabel.includes("-");
  if (viewMode === "weekly") return `${filterLabel} ವಾರದ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
  if (viewMode === "daily" || isRange) return `${filterLabel} ದಂದು ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
  return `${filterLabel} ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
};

/* ─────────────────────────────────────────────
   BUILD ONE DATA ROW HTML
───────────────────────────────────────────── */
const buildRow = (
  ev: any,
  tp: any,
  isFirstInGroup: boolean,
  isLastInGroup: boolean,
  viewMode: ViewMode = "monthly"
): string => {
  const bb = isLastInGroup ? "border-bottom:2.5px solid #6b7280;" : "";

  const isWeekly = viewMode === "weekly";
  const dateBg   = isWeekly ? "#f0fdf4" : "#f3f4f6";
  const dateColor = isWeekly ? "#15803d" : "#111";
  const dayColor  = isWeekly ? "#16a34a" : "#555";

  const dateTd = isFirstInGroup
    ? `<td rowspan="${tp.events.length}"
        style="
          border:1px solid #9ca3af;
          ${bb}
          padding:0;
          text-align:center;
          vertical-align:middle;
          font-weight:600;
          background:${dateBg};
          color:${dateColor};
          line-height:1.5;
          width:${COL_DATE}px;
        ">
          <div style="font-size:13px;padding:4px 6px 2px;">${formatDate(tp.date)}</div>
          <div style="font-size:11px;color:${dayColor};padding:0 6px 4px;">${formatWeekdayKannada(tp.date)}</div>
       </td>`
    : "";

  return `<tr>
    ${dateTd}
    <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;text-align:center;font-size:13px;color:${ev.time ? "#111" : "#9ca3af"};vertical-align:middle;white-space:nowrap;width:${COL_TIME}px;">${ev.time || "–"}</td>
    <td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;vertical-align:top;line-height:1.7;word-break:break-word;color:#111;">${sanitizeKeepBold(ev.description || "–")}</td>
    <td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;vertical-align:top;word-break:break-word;color:${ev.location ? "#111" : "#9ca3af"};width:${COL_LOC}px;">${ev.location || "–"}</td>
  </tr>`;
};

/** Build a week separator row (only used in weekly mode) */
const buildWeekSepRow = (weekNum: number, rangeLabel: string): string =>
  `<tr>
    <td colspan="4" style="
      background:#f0fdf4;
      color:#15803d;
      font-weight:700;
      font-size:12px;
      text-align:center;
      padding:6px 10px;
      border:1px solid #86efac;
      letter-spacing:0.03em;
    ">ವಾರ ${weekNum} &nbsp;|&nbsp; ${rangeLabel}</td>
  </tr>`;

/* ─────────────────────────────────────────────
   ROW GROUP — unit of pagination
───────────────────────────────────────────── */
interface RowGroup {
  rows: string[];
  height: number;
  isSeparator?: boolean; // week separator row
}

/* ─────────────────────────────────────────────
   MEASURE ACTUAL GROUP HEIGHTS via hidden DOM
   Works for monthly, weekly and daily
───────────────────────────────────────────── */
const measureGroups = async (
  monthlyData: any[],
  viewMode: ViewMode
): Promise<RowGroup[]> => {
  let allRowsHtml = "";

  // For weekly, we insert separator rows into measurement table too
  const flatGroups: Array<{ gIdx: number; isSep: boolean; sepHtml?: string }> = [];

  if (viewMode === "weekly") {
    const weekMap = groupByWeek(monthlyData);
    const weekKeys = Array.from(weekMap.keys()).sort((a, b) => a - b);
    let gIdx = 0;

    weekKeys.forEach((wk) => {
      const weekData = weekMap.get(wk)!;
      const rangeLabel = getWeekRangeLabel(weekData);
      const sepHtml = buildWeekSepRow(wk, rangeLabel);

      // Separator "group"
      flatGroups.push({ gIdx, isSep: true, sepHtml });
      allRowsHtml += `<tr data-group="${gIdx}" data-sep="1"><td colspan="4" style="background:#f0fdf4;color:#15803d;font-weight:700;font-size:12px;text-align:center;padding:6px 10px;border:1px solid #86efac;">ವಾರ ${wk} | ${rangeLabel}</td></tr>`;
      gIdx++;

      weekData.forEach((tp) => {
        const evCount = tp.events.length;
        flatGroups.push({ gIdx, isSep: false });
        tp.events.forEach((ev: any, idx: number) => {
          const isLast = idx === evCount - 1;
          const bb = isLast ? "border-bottom:2.5px solid #6b7280;" : "";
          allRowsHtml += `<tr data-group="${gIdx}">`;
          if (idx === 0) {
            allRowsHtml += `<td rowspan="${evCount}" style="border:1px solid #9ca3af;${bb}padding:0;text-align:center;vertical-align:middle;font-weight:600;background:#f0fdf4;color:#15803d;line-height:1.5;width:${COL_DATE}px;">
              <div style="font-size:13px;padding:4px 6px 2px;">${formatDate(tp.date)}</div>
              <div style="font-size:11px;color:#16a34a;padding:0 6px 4px;">${formatWeekdayKannada(tp.date)}</div>
            </td>`;
          }
          allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;white-space:nowrap;width:${COL_TIME}px;text-align:center;vertical-align:middle;color:${ev.time ? "#111" : "#9ca3af"};">${ev.time || "–"}</td>`;
          allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;line-height:1.7;word-break:break-word;vertical-align:top;color:#111;">${sanitizeKeepBold(ev.description || "–")}</td>`;
          allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;word-break:break-word;width:${COL_LOC}px;vertical-align:top;color:${ev.location ? "#111" : "#9ca3af"};">${ev.location || "–"}</td>`;
          allRowsHtml += `</tr>`;
        });
        gIdx++;
      });
    });
  } else {
    // Monthly / Daily — original flat layout
    monthlyData.forEach((tp, gIdx) => {
      flatGroups.push({ gIdx, isSep: false });
      const evCount = tp.events.length;
      tp.events.forEach((ev: any, idx: number) => {
        const isLast = idx === evCount - 1;
        const bb = isLast ? "border-bottom:2.5px solid #6b7280;" : "";
        allRowsHtml += `<tr data-group="${gIdx}">`;
        if (idx === 0) {
          allRowsHtml += `<td rowspan="${evCount}" style="border:1px solid #9ca3af;${bb}padding:0;text-align:center;vertical-align:middle;font-weight:600;background:#f3f4f6;color:#111;line-height:1.5;width:${COL_DATE}px;">
            <div style="font-size:13px;padding:4px 6px 2px;">${formatDate(tp.date)}</div>
            <div style="font-size:11px;color:#555;padding:0 6px 4px;">${formatWeekdayKannada(tp.date)}</div>
          </td>`;
        }
        allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;white-space:nowrap;width:${COL_TIME}px;text-align:center;vertical-align:middle;color:${ev.time ? "#111" : "#9ca3af"};">${ev.time || "–"}</td>`;
        allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 12px;font-size:13px;line-height:1.7;word-break:break-word;vertical-align:top;color:#111;">${sanitizeKeepBold(ev.description || "–")}</td>`;
        allRowsHtml += `<td style="border:1px solid #9ca3af;${bb}padding:8px 10px;font-size:13px;word-break:break-word;width:${COL_LOC}px;vertical-align:top;color:${ev.location ? "#111" : "#9ca3af"};">${ev.location || "–"}</td>`;
        allRowsHtml += `</tr>`;
      });
    });
  }

  const container = document.createElement("div");
  container.style.cssText = `position:fixed;top:0;left:-9999px;width:${PAGE_W}px;visibility:hidden;pointer-events:none;z-index:99999;font-family:'Noto Sans Kannada',serif;`;
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
  await new Promise((r) => setTimeout(r, 600));

  const totalGroups = flatGroups.length;
  const groupHeights: number[] = new Array(totalGroups).fill(0);

  container.querySelectorAll<HTMLTableRowElement>("tr[data-group]").forEach((tr) => {
    const g = parseInt(tr.getAttribute("data-group")!, 10);
    groupHeights[g] += tr.getBoundingClientRect().height;
  });

  document.body.removeChild(container);

  // Build RowGroup array matching flatGroups order
  if (viewMode === "weekly") {
    const weekMap = groupByWeek(monthlyData);
    const weekKeys = Array.from(weekMap.keys()).sort((a, b) => a - b);
    const result: RowGroup[] = [];
    let gIdx = 0;

    weekKeys.forEach((wk) => {
      const weekData = weekMap.get(wk)!;
      const rangeLabel = getWeekRangeLabel(weekData);
      // Separator
      result.push({
        rows: [buildWeekSepRow(wk, rangeLabel)],
        height: Math.ceil(groupHeights[gIdx]) || WEEK_SEP_H,
        isSeparator: true,
      });
      gIdx++;

      weekData.forEach((tp) => {
        const evCount = tp.events.length;
        const rows = tp.events.map((ev: any, idx: number) =>
          buildRow(ev, tp, idx === 0, idx === evCount - 1, "weekly")
        );
        result.push({ rows, height: Math.ceil(groupHeights[gIdx]) + 4 });
        gIdx++;
      });
    });

    return result;
  }

  // Monthly / Daily
  return monthlyData.map((tp, gIdx) => {
    const evCount = tp.events.length;
    const rows = tp.events.map((ev: any, idx: number) =>
      buildRow(ev, tp, idx === 0, idx === evCount - 1, viewMode)
    );
    return { rows, height: Math.ceil(groupHeights[gIdx]) + 4 };
  });
};

/* ─────────────────────────────────────────────
   PAGINATE — 2-pass to know isLast correctly
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
        // Don't orphan a week separator at the bottom — flush before it
        if (group.isSeparator) {
          flush();
        } else {
          flush();
        }
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

  const pass1 = doPass(Infinity);
  const guessedLastIdx = pass1.length - 1;
  const pass2 = doPass(guessedLastIdx);
  if (pass2.length > pass1.length) return doPass(pass2.length - 1);
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
  totalPages: number,
  viewMode: ViewMode
): string => {
  const subtitle = buildSubtitle(viewMode, filterLabel);

  const badgeColors: Record<ViewMode, { bg: string; color: string }> = {
    monthly: { bg: "#dbeafe", color: "#1e40af" },
    weekly:  { bg: "#dcfce7", color: "#15803d" },
    daily:   { bg: "#fef9c3", color: "#92400e" },
  };
  const bc = badgeColors[viewMode];

  const badgeLabel: Record<ViewMode, string> = {
    monthly: "ಮಾಸಿಕ",
    weekly:  "ವಾರದ",
    daily:   "ದಿನದ",
  };

  const header = isFirst
    ? `<div style="background:#fff;text-align:center;padding:16px 24px 14px;border-bottom:2px solid #111;flex-shrink:0;">
        <div style="font-size:16px;font-weight:800;color:#111;line-height:1.7;">ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು</div>
        <div style="font-size:13px;color:#333;margin-top:5px;">${subtitle}</div>
        <div style="margin-top:6px;">
          <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;background:${bc.bg};color:${bc.color};">${badgeLabel[viewMode]} ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮ</span>
        </div>
      </div>`
    : `<div style="background:#f3f4f6;text-align:center;padding:10px 20px;border-bottom:1px solid #d1d5db;font-size:12px;color:#333;font-weight:600;flex-shrink:0;">
        ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ — ${filterLabel} — ಮುಂದುವರಿದೆ...
      </div>`;

  const thBg = viewMode === "weekly" ? "#d1fae5" : "#e5e7eb";

  const thead = `<tr>${["ದಿನಾಂಕ","ಸಮಯ","ಕಾರ್ಯಕ್ರಮ","ಸ್ಥಳ"].map(h =>
    `<th style="background:${thBg};color:#111;font-weight:700;font-size:14px;padding:9px 10px;border:1px solid #9ca3af;text-align:center;">${h}</th>`
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
  wrap.style.cssText = `position:fixed;top:0;left:-9999px;width:${PAGE_W}px;height:${PAGE_H}px;background:#fff;z-index:99999;pointer-events:none;font-family:'Noto Sans Kannada',serif;`;
  wrap.innerHTML = html;
  document.body.appendChild(wrap);
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 800));
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
   EXPORT PDF  (monthly | weekly | daily)
───────────────────────────────────────────── */
export const exportPDF = async (
  monthlyData: any[],
  fileName: string,
  filterLabel: string,
  onStart?: () => void,
  onDone?: () => void,
  viewMode: ViewMode = "monthly"
) => {
  onStart?.();
  try {
    const groups     = await measureGroups(monthlyData, viewMode);
    const pageChunks = paginateGroups(groups);
    const total      = pageChunks.length;

    const pdf  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < total; i++) {
      if (i > 0) pdf.addPage();
      const html = buildPage(
        pageChunks[i].join(""),
        filterLabel,
        i === 0,
        i === total - 1,
        i + 1,
        total,
        viewMode
      );
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
   EXPORT EXCEL  (monthly | weekly | daily)
   Weekly adds a "ವಾರ N" grouping row before each week block.
───────────────────────────────────────────── */
export const exportExcel = (
  monthlyData: any[],
  fileName: string,
  filterLabel: string,
  viewMode: ViewMode = "monthly"
) => {
  const subtitle = buildSubtitle(viewMode, filterLabel);

  const titleRow   = ["ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು", "", "", "", ""];
  const subRow     = [subtitle, "", "", "", ""];
  const blankRow   = ["", "", "", "", ""];
  const headers    = ["ದಿನಾಂಕ", "ವಾರ", "ಸಮಯ", "ಕಾರ್ಯಕ್ರಮ", "ಸ್ಥಳ"];

  const dataRows: any[][] = [];
  const merges: XLSX.Range[] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  ];

  // Row index counter (0-based, after title + sub + blank + headers = row 4 onwards)
  let rowIdx = 4;

  if (viewMode === "weekly") {
    const weekMap = groupByWeek(monthlyData);
    const weekKeys = Array.from(weekMap.keys()).sort((a, b) => a - b);

    weekKeys.forEach((wk) => {
      const weekData = weekMap.get(wk)!;
      const rangeLabel = getWeekRangeLabel(weekData);

      // Week separator row (merged across all 5 cols)
      dataRows.push([`ವಾರ ${wk}  |  ${rangeLabel}`, "", "", "", ""]);
      merges.push({ s: { r: rowIdx, c: 0 }, e: { r: rowIdx, c: 4 } });
      rowIdx++;

      weekData.forEach((tp) => {
        tp.events.forEach((ev: any, idx: number) => {
          dataRows.push([
            idx === 0 ? formatDate(tp.date) : "",
            idx === 0 ? formatWeekdayKannada(tp.date) : "",
            ev.time || "-",
            (ev.description || "").replace(/<[^>]*>/g, "").trim(),
            ev.location || "-",
          ]);
          rowIdx++;
        });
      });
    });
  } else {
    // Monthly / Daily — original flat layout
    monthlyData.forEach((tp) => {
      tp.events.forEach((ev: any, idx: number) => {
        dataRows.push([
          idx === 0 ? formatDate(tp.date) : "",
          idx === 0 ? formatWeekdayKannada(tp.date) : "",
          ev.time || "-",
          (ev.description || "").replace(/<[^>]*>/g, "").trim(),
          ev.location || "-",
        ]);
        rowIdx++;
      });
    });
  }

  const ws = XLSX.utils.aoa_to_sheet([titleRow, subRow, blankRow, headers, ...dataRows]);
  ws["!merges"] = merges;
  ws["!cols"]   = [{ wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 62 }, { wch: 34 }];
  ws["!rows"]   = [{ hpt: 26 }, { hpt: 18 }, { hpt: 6 }, { hpt: 18 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tour Program");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
    `${fileName}.xlsx`
  );
};