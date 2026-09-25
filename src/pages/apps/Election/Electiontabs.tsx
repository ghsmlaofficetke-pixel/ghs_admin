import { useState } from "react";
import CandidatesTab from "./Candidatestab";
import SummaryTab from "./Summarytab";
import PdfsTab from "./Pdfstab";
import { ElectionType } from "../../../api/election";
import { FiUsers, FiFileText, FiChevronLeft } from "react-icons/fi";
import { FaChartPie, FaVoteYea } from "react-icons/fa";

type SubTab = "candidates" | "summary" | "pdf";

export default function ElectionTabs({
  electionType,
  years,
  title,
}: {
  electionType: ElectionType;
  years: string[];
  title?: string;
}) {
  const [year, setYear] = useState<string | null>(null);
  const [subTab, setSubTab] = useState<SubTab>("candidates");

  /* ── YEAR SELECTION LANDING ── */
  if (!year) {
    return (
      <>
        <style>{`
          .el-landing {
            min-height: calc(100vh - 158px);
            background: #f0f4f8;
            font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 32px 16px;
          }
          .el-landing-icon {
            width: 64px; height: 64px; border-radius: 20px;
            background: linear-gradient(135deg, #2466d1, #06b6d4);
            display: flex; align-items: center; justify-content: center;
            color: #fff; margin-bottom: 14px;
            box-shadow: 0 8px 24px rgba(36,102,209,0.3);
          }
          .el-landing-title {
            font-size: 20px; font-weight: 800; color: #1a3d7c;
            margin-bottom: 4px; text-align: center;
          }
          .el-landing-sub {
            font-size: 13px; color: #64748b; margin-bottom: 32px; text-align: center;
          }
          .el-year-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
            width: 100%;
            max-width: 600px;
          }
          .el-year-card {
            background: #fff;
            border: 2px solid #e2e8f0;
            border-radius: 16px;
            padding: 28px 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.18s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .el-year-card:hover {
            border-color: #2466d1;
            background: linear-gradient(135deg, #eff6ff, #f0fdff);
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(36,102,209,0.18);
          }
          .el-year-card-year {
            font-size: 28px; font-weight: 800; color: #1a3d7c; margin-bottom: 6px;
          }
          .el-year-card:hover .el-year-card-year { color: #2466d1; }
          .el-year-card-label {
            font-size: 12px; color: #94a3b8; font-weight: 500;
          }
          @media (max-width: 480px) {
            .el-year-grid { grid-template-columns: 1fr 1fr; }
            .el-landing { padding: 24px 12px; }
          }
        `}</style>
        <div className="el-landing">
          <div className="el-landing-icon">
            <FaVoteYea size={28} />
          </div>
          <div className="el-landing-title">{title || "ಚುನಾವಣೆ"}</div>
          <div className="el-landing-sub">ವರ್ಷ ಆಯ್ಕೆ ಮಾಡಿ</div>
          <div className="el-year-grid">
            {years.map((y) => (
              <div
                key={y}
                className="el-year-card"
                onClick={() => { setYear(y); setSubTab("candidates"); }}
              >
                <div className="el-year-card-year">{y}</div>
                <div className="el-year-card-label">ಚುನಾವಣೆ ವರ್ಷ</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── DETAIL VIEW (after year selected) ── */
  return (
    <>
      <style>{`
        .mel-main {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── TOP BAR */
        .mel-topbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px 0;
          flex-shrink: 0;
          background: #f0f4f8;
        }
        .mel-back-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 14px; border-radius: 8px;
          background: #fff; color: #1a3d7c;
          border: 1.5px solid #e2e8f0;
          cursor: pointer; font-size: 13px; font-weight: 600;
          transition: all 0.15s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          flex-shrink: 0;
          white-space: nowrap;
        }
        .mel-back-btn:hover {
          background: #eff6ff; border-color: #93c5fd; color: #2466d1;
        }
        .mel-topbar-title {
          flex: 1; text-align: center;
          font-size: 14px; font-weight: 700; color: #1a3d7c;
        }
        .mel-topbar-title span { color: #2466d1; }
        .mel-topbar-spacer { width: 90px; flex-shrink: 0; }

        /* ── YEAR TABS */
        .mel-year-tabs {
          display: flex;
          gap: 6px;
          padding: 10px 14px 0;
          background: #f0f4f8;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .mel-year-tab {
          padding: 7px 20px;
          border-radius: 8px 8px 0 0;
          font-size: 13px; font-weight: 700;
          border: none; cursor: pointer;
          transition: all 0.15s ease;
          outline: none; position: relative;
        }
        .mel-year-tab-active {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff;
          box-shadow: 0 -2px 10px rgba(36,102,209,0.25);
        }
        .mel-year-tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0; height: 2px;
          background: #fff;
        }
        .mel-year-tab-inactive { background: #e2e8f0; color: #64748b; }
        .mel-year-tab-inactive:hover { background: #cbd5e1; color: #1e293b; }

        /* ── SUB TABS */
        .mel-sub-tabs {
          display: flex;
          gap: 4px;
          padding: 8px 14px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .mel-sub-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 20px;
          font-size: 12.5px; font-weight: 600;
          border: 1px solid #e2e8f0;
          cursor: pointer; transition: all 0.15s ease;
          background: #f8fafc; color: #64748b;
        }
        .mel-sub-tab-active {
          background: #eff6ff; color: #2466d1; border-color: #93c5fd;
        }
        .mel-sub-tab:hover { background: #eef2f7; }

        /* ── CONTENT */
        .mel-content {
          flex: 1; min-height: 0;
          background: #f0f4f8;
          display: flex; flex-direction: column;
        }

        @media (max-width: 480px) {
          .mel-year-tab { padding: 6px 13px; font-size: 12px; }
          .mel-year-tabs { padding: 8px 10px 0; }
          .mel-sub-tabs { padding: 6px 10px; gap: 3px; }
          .mel-sub-tab { padding: 6px 10px; font-size: 11.5px; }
          .mel-topbar-spacer { width: 70px; }
          .mel-back-btn { padding: 6px 10px; font-size: 12px; }
        }
      `}</style>

      <div className="mel-main">

        {/* ── TOP BAR with Back button */}
        <div className="mel-topbar">
          <button className="mel-back-btn" onClick={() => setYear(null)}>
            <FiChevronLeft size={15} /> ಹಿಂದೆ
          </button>
          <div className="mel-topbar-title">
            {title && <>{title} — </>}<span>{year}</span>
          </div>
          <div className="mel-topbar-spacer" />
        </div>

        {/* ── YEAR TABS */}
        <div className="mel-year-tabs">
          {years.map((y) => (
            <button
              key={y}
              className={`mel-year-tab ${year === y ? "mel-year-tab-active" : "mel-year-tab-inactive"}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>

        {/* ── SUB TABS */}
        <div className="mel-sub-tabs">
          <button
            className={`mel-sub-tab ${subTab === "candidates" ? "mel-sub-tab-active" : ""}`}
            onClick={() => setSubTab("candidates")}
          >
            <FiUsers size={13} /> ಅಭ್ಯರ್ಥಿಗಳು
          </button>
          <button
            className={`mel-sub-tab ${subTab === "summary" ? "mel-sub-tab-active" : ""}`}
            onClick={() => setSubTab("summary")}
          >
            <FaChartPie size={13} /> ಸಾರಾಂಶ
          </button>
          <button
            className={`mel-sub-tab ${subTab === "pdf" ? "mel-sub-tab-active" : ""}`}
            onClick={() => setSubTab("pdf")}
          >
            <FiFileText size={13} /> PDF ದಾಖಲೆಗಳು
          </button>
        </div>

        {/* ── CONTENT */}
        <div className="mel-content">
          {subTab === "candidates" && (
            <CandidatesTab key={`c-${electionType}-${year}`} electionType={electionType} year={year} />
          )}
          {subTab === "summary" && (
            <SummaryTab key={`s-${electionType}-${year}`} electionType={electionType} year={year} />
          )}
          {subTab === "pdf" && (
            <PdfsTab key={`p-${electionType}-${year}`} electionType={electionType} year={year} />
          )}
        </div>
      </div>
    </>
  );
}
