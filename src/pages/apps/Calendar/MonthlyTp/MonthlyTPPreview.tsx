import React from "react";
import { TP } from "../../../../api/tp";
import DOMPurify from "dompurify";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

interface Props {
  month: string;
  year: number;
  data: TP[];
  filterLabel?: string;
}

// ── Responsive helpers ──────────────────────────────────────────────────────
// We target ≤600 px as "mobile" by injecting a <style> tag once per render.
// All layout tweaks live in CSS classes; inline styles handle only structural
// / dynamic values so SSR and print still work correctly.

const RESPONSIVE_CSS = `
  .mtp-root {
    font-family: 'Noto Sans Kannada', 'Noto Serif Kannada', serif;
    background: #fff;
    color: #111;
    width: 100%;
    box-sizing: border-box;
    padding: 16px 18px;
    border: 2px solid #1e40af;
    border-radius: 8px;
  }

  /* ── Header ── */
  .mtp-header {
    text-align: center;
    border-bottom: 2px solid #1e40af;
    padding-bottom: 12px;
    margin-bottom: 14px;
  }
  .mtp-header-title {
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    line-height: 1.65;
    color: #1e3a8a;
  }
  .mtp-header-sub {
    font-size: 12.5px;
    margin: 5px 0 0;
    color: #374151;
    line-height: 1.5;
  }

  /* ── Scroll wrapper ── */
  .mtp-table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -2px; /* bleed to border edge */
  }
  .mtp-scroll-hint {
    display: none;
    font-size: 10.5px;
    color: #9ca3af;
    text-align: right;
    margin-bottom: 4px;
    letter-spacing: 0.02em;
  }

  /* ── Table ── */
  .mtp-table {
    width: 100%;
    min-width: 460px;
    border-collapse: collapse;
    table-layout: fixed;
    font-size: 12px;
  }
  .mtp-table th {
    background: #dbeafe;
    color: #1e3a8a;
    font-weight: 700;
    font-size: 12.5px;
    padding: 9px 10px;
    border: 1px solid #94a3b8;
    text-align: center;
  }
  .mtp-table td {
    border: 1px solid #94a3b8;
    padding: 7px 9px;
    vertical-align: top;
    font-size: 12px;
    line-height: 1.65;
    word-break: break-word;
  }

  /* ── Date cell ── */
  .mtp-date-cell {
    text-align: center;
    vertical-align: middle !important;
    background: #eff6ff;
    color: #1e3a8a;
    font-weight: 600;
    line-height: 1.55;
  }
  .mtp-date-main { font-size: 12.5px; }
  .mtp-date-day  { font-size: 10.5px; color: #3b82f6; margin-top: 2px; }

  /* ── Time cell ── */
  .mtp-time-cell {
    text-align: center;
    vertical-align: middle !important;
    white-space: nowrap;
  }
  .mtp-time-empty { color: #9ca3af; }

  /* ── Location cell ── */
  .mtp-loc-empty { color: #9ca3af; text-align: center; }

  /* ── Row stripe ── */
  .mtp-row-even { background: #f8fafc; }
  .mtp-row-odd  { background: #ffffff; }

  /* ── Empty state ── */
  .mtp-empty td {
    text-align: center;
    padding: 24px;
    color: #9ca3af;
    font-size: 12.5px;
    border: 1px solid #94a3b8;
  }

  /* ── Footer ── */
  .mtp-footer {
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #cbd5e1;
    text-align: right;
    font-size: 12.5px;
    line-height: 1.85;
    color: #374151;
  }
  .mtp-footer-name { font-weight: 700; }

  /* ── Mobile overrides (≤ 600 px) ── */
  @media (max-width: 600px) {
    .mtp-root {
      padding: 12px 10px;
      border-radius: 6px;
    }
    .mtp-header-title { font-size: 13px; }
    .mtp-header-sub   { font-size: 11.5px; }
    .mtp-scroll-hint  { display: block; }

    .mtp-table th  { font-size: 11.5px; padding: 7px 6px; }
    .mtp-table td  { font-size: 11px;   padding: 6px 7px; }

    .mtp-date-main { font-size: 11.5px; }
    .mtp-date-day  { font-size: 10px;   }

    .mtp-footer { font-size: 11.5px; margin-top: 14px; }
  }

  /* ── Print ── */
  @media print {
    .mtp-root         { border: none; padding: 0; }
    .mtp-scroll-hint  { display: none !important; }
    .mtp-table-scroll { overflow: visible; }
    .mtp-table        { min-width: 0; font-size: 11pt; }
  }
`;

// Inject stylesheet once (idempotent)
let styleInjected = false;
function ensureStyle() {
  if (styleInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.setAttribute("data-mtp", "1");
  el.textContent = RESPONSIVE_CSS;
  document.head.appendChild(el);
  styleInjected = true;
}

// ── Column widths (match tpExport.ts for visual parity) ─────────────────────
const COL = { date: 100, time: 75, loc: 130 } as const;

const MonthlyTPPreview = React.forwardRef<HTMLDivElement, Props>(
  ({ month, year, data, filterLabel }, ref) => {
    ensureStyle();
    const label = filterLabel ?? `${month} ${year}`;

    return (
      <div ref={ref} className="mtp-root">

        {/* ── Header ── */}
        <div className="mtp-header">
          <h1 className="mtp-header-title">
            ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು
          </h1>
          <p className="mtp-header-sub">
            {label} ರ ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು
          </p>
        </div>

        {/* ── Mobile scroll hint ── */}
        <div className="mtp-scroll-hint" aria-hidden="true">
          ← ಸ್ಕ್ರಾಲ್ ಮಾಡಿ →
        </div>

        {/* ── Table ── */}
        <div className="mtp-table-scroll">
          <table className="mtp-table">
            <colgroup>
              <col style={{ width: COL.date }} />
              <col style={{ width: COL.time }} />
              <col />
              <col style={{ width: COL.loc }} />
            </colgroup>

            <thead>
              <tr>
                {["ದಿನಾಂಕ", "ಸಮಯ", "ಕಾರ್ಯಕ್ರಮ", "ಸ್ಥಳ"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(!data || data.length === 0) && (
                <tr className="mtp-empty">
                  <td colSpan={4}>
                    ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಕ್ಕೆ ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮ ಇಲ್ಲ
                  </td>
                </tr>
              )}

              {data?.map((tp) =>
                tp?.events?.map((ev, idx) => {
                  const isFirst = idx === 0;
                  const rowClass =
                    idx % 2 === 0 ? "mtp-row-even" : "mtp-row-odd";

                  return (
                    <tr key={`${tp._id}-${idx}`} className={rowClass}>
                      {/* Date cell spans all events in the group */}
                      {isFirst && (
                        <td
                          className="mtp-date-cell"
                          rowSpan={tp.events.length}
                        >
                          <div className="mtp-date-main">
                            {formatDate(tp.date)}
                          </div>
                          <div className="mtp-date-day">
                            {formatWeekdayKannada(tp.date)}
                          </div>
                        </td>
                      )}

                      {/* Time */}
                      <td
                        className={
                          "mtp-time-cell" +
                          (ev.time ? "" : " mtp-time-empty")
                        }
                      >
                        {ev.time || "–"}
                      </td>

                      {/* Description */}
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(ev?.description ?? ""),
                          }}
                        />
                      </td>

                      {/* Location */}
                      <td
                        className={ev.location ? "" : "mtp-loc-empty"}
                      >
                        {ev.location || "–"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="mtp-footer tp-preview-footer">
          <div>ಸಹಿ/-</div>
          <div className="mtp-footer-name">ಶ್ರೀನಿವಾಸ ಡಿ.</div>
          <div>ಶಾಸಕರ ಆಪ್ತ ಸಹಾಯಕರು</div>
        </div>

      </div>
    );
  }
);

MonthlyTPPreview.displayName = "MonthlyTPPreview";
export default MonthlyTPPreview;