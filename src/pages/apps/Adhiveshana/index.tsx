import { useState } from "react";
import AdhiveshanaPdfPage from "./adhiveshanapdf";
import AdhiveshanaQuestionPage from "./adhiveshana";

export default function AdhiveshanaMainPage() {
  const [tab, setTab] = useState<"pdf" | "question">("pdf");

  return (
    <>
      <style>{`
        .adhi-main {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 158px);
          min-height: 0;
          background: #f0f4f8;
          font-family: 'Segoe UI', 'Noto Sans Kannada', sans-serif;
          overflow: hidden;
        }

        /* ── TAB BAR */
        .adhi-tabs {
          display: flex;
          gap: 6px;
          padding: 10px 14px 0;
          background: #f0f4f8;
          flex-shrink: 0;
        }

        .adhi-tab {
          padding: 8px 20px;
          border-radius: 8px 8px 0 0;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          outline: none;
        }

        .adhi-tab-active {
          background: linear-gradient(135deg, #2466d1, #06b6d4);
          color: #fff;
          box-shadow: 0 -2px 10px rgba(36,102,209,0.25);
        }
        .adhi-tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 0;
          height: 2px;
          background: #fff;
        }

        .adhi-tab-inactive {
          background: #e2e8f0;
          color: #64748b;
        }
        .adhi-tab-inactive:hover {
          background: #cbd5e1;
          color: #1e293b;
        }

        /* ── CONTENT */
        .adhi-content {
          flex: 1;
          min-height: 0;
          background: #f0f4f8;
          display: flex;
          flex-direction: column;
        }

        /* Override child page heights when nested */
        .adhi-content .ap-root,
        .adhi-content .aq-root {
          height: 100% !important;
        }

        @media (max-width: 480px) {
          .adhi-tab {
            padding: 7px 14px;
            font-size: 12px;
          }
          .adhi-tabs {
            padding: 8px 10px 0;
          }
        }
      `}</style>

      <div className="adhi-main">
        {/* ── TABS */}
        <div className="adhi-tabs">
          <button
            className={`adhi-tab ${tab === "pdf" ? "adhi-tab-active" : "adhi-tab-inactive"}`}
            onClick={() => setTab("pdf")}
          >
            ಪ್ರಶ್ನೋತ್ತರಗಳ ದಾಖಲೆ
          </button>
          <button
            className={`adhi-tab ${tab === "question" ? "adhi-tab-active" : "adhi-tab-inactive"}`}
            onClick={() => setTab("question")}
          >
            ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು
          </button>
        </div>

        {/* ── CONTENT */}
        <div className="adhi-content">
          {tab === "pdf" ? <AdhiveshanaPdfPage /> : <AdhiveshanaQuestionPage />}
        </div>
      </div>
    </>
  );
}