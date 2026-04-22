import React from "react";
import { TP } from "../../../../api/tp";
import "./index.css";
import DOMPurify from "dompurify";

/* =========================
   Helpers
========================= */
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const formatWeekdayKannada = (date: string) =>
  new Date(date).toLocaleDateString("kn-IN", { weekday: "long" });

interface Props {
  month: string;
  year: number;
  data: TP[];
}

const MonthlyTPPreview = React.forwardRef<HTMLDivElement, Props>(
  ({ month, year, data }, ref) => {
    return (
      <div
        ref={ref}
        className="tp-wrapper break-avoid"
      >
        {/* Header */}
        <div className="tp-header">
          <h1>
            ಶ್ರೀ ಜಿ.ಹೆಚ್. ಶ್ರೀನಿವಾಸ, ಶಾಸಕರು, ತರೀಕೆರೆ ವಿಧಾನ ಸಭಾಕ್ಷೇತ್ರ ರವರು
          </h1>
          <p>
            {month} {year} ರ ಮಾಹೆಯಲ್ಲಿ ಕೈಗೊಳ್ಳಲಿರುವ ಪ್ರವಾಸ ಕಾರ್ಯಕ್ರಮಗಳು
          </p>
        </div>

        {/* Table */}
        <table className="tp-table">
          <thead>
            <tr>
              <th style={{ width: "100px" }}>ದಿನಾಂಕ</th>
              <th style={{ width: "80px" }}>ಸಮಯ</th>
              <th>ಕಾರ್ಯಕ್ರಮ</th>
              <th style={{ width: "150px" }}>ಸ್ಥಳ</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((tp) =>
              tp?.events?.map((ev, idx) => (
                <tr key={`${tp._id}-${idx}`}>
                  {idx === 0 && (
                    <td rowSpan={tp.events.length} className="date-cell">
                      <div>{formatDate(tp.date)}</div>
                      <div className="weekday">
                        {formatWeekdayKannada(tp.date)}
                      </div>
                    </td>
                  )}
                  <td className={!ev.time ? "text-center" : ""}>{ev?.time || "-"}</td>

                  <td>
                  <div
    className="leading-relaxed [&_p]:m-0 [&_p]:mb-1"
    dangerouslySetInnerHTML={{
      __html: DOMPurify?.sanitize(ev?.description),
    }}
  />
</td>
                  <td className={!ev.location ? "text-center" : ""}>{ev.location || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="tp-footer">
          <div>ಸಹಿ/-</div>
          <div className="bold">ಶ್ರೀನಿವಾಸ ಡಿ.</div>
          <div>ಶಾಸಕರ ಆಪ್ತ ಸಹಾಯಕರು</div>
        </div>
      </div>
    );
  }
);

export default MonthlyTPPreview;