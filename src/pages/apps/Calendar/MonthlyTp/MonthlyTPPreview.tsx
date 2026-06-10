import React, { forwardRef } from "react";
import { TP } from "../../../../api/tp";
import DOMPurify from "dompurify";

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

// ── View mode type ──────────────────────────────────────────────────────────
export type ViewMode = "monthly" | "weekly" | "daily";

interface Props {
  month: string;
  year: number;
  data: TP[];
  filterLabel?: string;
  viewMode?: ViewMode;
}

// ── Responsive CSS ──────────────────────────────────────────────────────────
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
  .mtp-header-badge {
    display: inline-block;
    margin-top: 6px;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .mtp-header-badge-monthly {
    background: #dbeafe;
    color: #1e40af;
  }
  .mtp-header-badge-weekly {
    background: #dcfce7;
    color: #15803d;
  }
  .mtp-header-badge-daily {
    background: #fef9c3;
    color: #92400e;
  }

  /* ── Scroll wrapper ── */
  .mtp-table-scroll {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -2px;
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

  /* ── Summary strip ── */
  .mtp-summary {
    margin-top: 10px;
    margin-bottom: 4px;
    padding: 6px 10px;
    background: #f1f5f9;
    border-radius: 6px;
    font-size: 11px;
    color: #475569;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }
  .mtp-summary-item { display: flex; gap: 4px; align-items: center; }
  .mtp-summary-dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  }

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
    .mtp-summary { font-size: 10px; gap: 10px; }
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

// ── Column widths ────────────────────────────────────────────────────────────
const COL = { date: 100, time: 75, loc: 130 } as const;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build subtitle based on viewMode + filterLabel */
const buildSubtitle = (viewMode: ViewMode, filterLabel: string): string => {
  if (viewMode === "weekly") {
    return `${filterLabel} ರ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
  }
  if (viewMode === "daily") {
    return `${filterLabel} ದಂದು ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
  }
  return `${filterLabel} ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು`;
};

const BADGE_LABEL: Record<ViewMode, string> = {
  monthly: "ಮಾಸಿಕ ವೀಕ್ಷಣೆ",
  weekly:  "ವಾರದ ವೀಕ್ಷಣೆ",
  daily:   "ದಿನದ ವೀಕ್ಷಣೆ",
};

// ── Component ────────────────────────────────────────────────────────────────
const MonthlyTPPreview = forwardRef<HTMLDivElement, Props>(
  ({ month, year, data, filterLabel, viewMode = "monthly" }, ref) => {
    ensureStyle();
    const label = filterLabel ?? `${month} ${year}`;

    // Total events count for summary
    const totalEvents = data?.reduce((sum, tp) => sum + (tp.events?.length ?? 0), 0) ?? 0;
    const totalDays   = data?.length ?? 0;

    // ── Render rows: monthly/daily = flat list, weekly = grouped by week ──
    const renderRows = () => {
      if (!data || data.length === 0) {
        return (
          <tr className="mtp-empty">
            <td colSpan={4}>ಆಯ್ಕೆ ಮಾಡಿದ ಅವಧಿಗೆ ಯಾವುದೇ ಕಾರ್ಯಕ್ರಮ ಇಲ್ಲ</td>
          </tr>
        );
      }

      // Monthly / Weekly / Daily — flat rendering
      return (
        <>
          {data.map((tp) =>
            tp?.events?.map((ev, idx) => {
              const isFirst = idx === 0;
              const rowClass = idx % 2 === 0 ? "mtp-row-even" : "mtp-row-odd";

              return (
                <tr key={`${tp._id}-${idx}`} className={rowClass}>
                  {isFirst && (
                    <td
                      className={`mtp-date-cell${viewMode === "weekly" ? " mtp-date-cell-weekly" : ""}`}
                      rowSpan={tp.events.length}
                    >
                      <div className="mtp-date-main">{formatDate(tp.date)}</div>
                      <div className="mtp-date-day">{formatWeekdayKannada(tp.date)}</div>
                    </td>
                  )}
                  <td className={"mtp-time-cell" + (ev.time ? "" : " mtp-time-empty")}>
                    {ev.time || "–"}
                  </td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(ev?.description ?? ""),
                      }}
                    />
                  </td>
                  <td className={ev.location ? "" : "mtp-loc-empty"}>
                    {ev.location || "–"}
                  </td>
                </tr>
              );
            })
          )}
        </>
      );
    };

    return (
      <div ref={ref} className="mtp-root">

        {/* ── Header ── */}
        <div className="mtp-header">
          <h1 className="mtp-header-title">
            ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು
          </h1>
          <p className="mtp-header-sub">
            {buildSubtitle(viewMode, label)}
          </p>
          <span className={`mtp-header-badge mtp-header-badge-${viewMode}`}>
            {BADGE_LABEL[viewMode]}
          </span>
        </div>

        {/* ── Summary strip ── */}
        {totalEvents > 0 && (
          <div className="mtp-summary">
            <div className="mtp-summary-item">
              <div className="mtp-summary-dot" style={{ background: "#3b82f6" }} />
              <span>{totalDays} ದಿನಗಳು</span>
            </div>
            <div className="mtp-summary-item">
              <div className="mtp-summary-dot" style={{ background: "#10b981" }} />
              <span>{totalEvents} ಕಾರ್ಯಕ್ರಮಗಳು</span>
            </div>
            {viewMode === "weekly" && (
              <div className="mtp-summary-item">
                <div className="mtp-summary-dot" style={{ background: "#f59e0b" }} />
                <span>{data?.length ?? 0} ದಿನಗಳು</span>
              </div>
            )}
          </div>
        )}

        {/* ── Mobile scroll hint ── */}
        <div className="mtp-scroll-hint" aria-hidden="true">← ಸ್ಕ್ರಾಲ್ ಮಾಡಿ →</div>

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
            <tbody>{renderRows()}</tbody>
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