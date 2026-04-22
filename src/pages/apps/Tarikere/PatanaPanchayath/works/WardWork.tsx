import { useParams } from "react-router-dom";
import { useState } from "react";

import WardIndividualWorksTable from "./WardIndWorkTable";
import WardCommunityWorksTable from "./WardComWorkTable";

export default function WardWorks() {

  const { id: wardId } = useParams<{ id: string }>();

  const [activeType,setActiveType] =
    useState<"individual"|"community">("individual");

  if(!wardId) return null;

  return (

    <div className="flex flex-col h-[calc(100vh-250px)] bg-white rounded-lg overflow-hidden">

      {/* TOGGLE */}

      <div className="sticky top-0 z-30 bg-white p-2 border-b  flex gap-6">

        <button
          onClick={()=>setActiveType("individual")}
          className={`w-full sm:w-auto px-4 py-1 text-[9px] sm:text-[13px] rounded-lg transition-all font-bold
          ${
            activeType==="individual"
            ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white "
            : "bg-gray-200"
          }`}
        >
          ವೈಯಕ್ತಿಕ ಫಲಾನುಭವಿಗಳ ವಿವರ
        </button>

        <button
          onClick={()=>setActiveType("community")}
          className={`w-full sm:w-auto px-4 py-1 text-[9px] sm:text-[13px] rounded-lg transition-all font-bold  
          ${
            activeType==="community"
            ? "bg-gradient-to-r from-[#2466d1] to-cyan-500 text-white"
            : "bg-gray-200"
          }`}
        >
          ಸಮುದಾಯ ಕಾಮಗಾರಿಗಳು
        </button>

      </div>

      {activeType==="individual" && (
        <WardIndividualWorksTable wardId={wardId}/>
      )}

      {activeType==="community" && (
        <WardCommunityWorksTable wardId={wardId}/>
      )}

    </div>

  );

}