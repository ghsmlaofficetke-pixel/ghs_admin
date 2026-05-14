import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IndividualWorksTable from "./individualTable";
import CommunityWorksTable from "./communityTable";

export default function VillageWorks() {
  const { id: villageId } = useParams<{ id: string }>();

  const [activeType, setActiveType] =
    useState<"individual" | "community">("individual");

  if (!villageId) return null;

  return (
   <div className="flex flex-col h-[calc(100vh-130px)] bg-white rounded-lg overflow-hidden">

  {/* ===== HEADER (STICKY LEVEL 1) ===== */}
  <div className="sticky top-0 z-10 bg-white p-2 border-b">

    <div className="flex gap-2">
  <button
    onClick={() => setActiveType("individual")}
    className={`flex-1 sm:flex-none px-4 py-1 text-[11px] sm:text-[13px] rounded-lg ${
      activeType === "individual"
        ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
        : "bg-gray-200"
    }`}
  >
    ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳು
  </button>

  <button
    onClick={() => setActiveType("community")}
    className={`flex-1 sm:flex-none px-4 py-1 text-[11px] sm:text-[13px] rounded-lg ${
      activeType === "community"
        ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
        : "bg-gray-200"
    }`}
  >
    ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು
  </button>
</div>
  </div>

  {/* ===== CHILD CONTENT SCROLL ===== */}
  <div className="flex-1 overflow-hidden">
    {activeType === "individual" && (
      <IndividualWorksTable villageId={villageId} />
    )}
    {activeType === "community" && (
      <CommunityWorksTable villageId={villageId} />
    )}
  </div>
</div>
  );
}