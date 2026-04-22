import { useState } from "react";
import AdhiveshanaPdfPage from "./adhiveshanapdf";
import AdhiveshanaQuestionPage from "./adhiveshana";

export default function AdhiveshanaMainPage() {
  const [tab, setTab] = useState<"pdf" | "question">("pdf");

  return (
    <div className="p-2 s">
      {/* Tabs */}
      <div className="flex gap-3 mb-6 font-bold">
        <button
          onClick={() => setTab("pdf")}
          className={`px-4 py-2 rounded ${
            tab === "pdf"
              ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white font-bold"
              : "bg-gray-200"
          }`}
        >
          ಪ್ರಶ್ನೋತ್ತರಗಳು
        </button>

        <button
          onClick={() => setTab("question")}
          className={`px-4 py-2 rounded ${
            tab === "question"
              ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
              : "bg-gray-200"
          }`}
        >
          ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು
        </button>
      </div>

      {/* Content */}
      {tab === "pdf" ? (
        <AdhiveshanaPdfPage />
      ) : (
        <AdhiveshanaQuestionPage />
      )}
    </div>
  );
}