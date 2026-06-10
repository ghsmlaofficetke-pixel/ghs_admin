import map from "../../assets/images/brands/poster.webp";
import { Leaf, Landmark, Construction, Newspaper, Filter, Mic } from "lucide-react";

const HobliDashboard = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-3">

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-start">

        {/* MAP CARD — desktop only */}
        <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm p-2 sm:p-3">
          <div className="w-full flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={map}
              alt="Tarikere Taluk Map"
              className="w-full max-w-full h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-3 w-full">

          {/* ACTION CARD */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-md p-2 sm:p-3">
            <div className="grid grid-cols-2 gap-2">

              {/* MANAVI */}
              <a
                href="/apps/consolidation"
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded-full
                bg-gradient-to-r from-pink-500 to-rose-500
                text-white text-xs sm:text-sm font-medium shadow
                hover:scale-105 active:scale-95 transition"
              >
                <Filter size={16} />
                ಮನವಿಗಳು
              </a>

              {/* WORK */}
              <a
                href="/apps/consolidationwork"
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded-full
                bg-gradient-to-r from-[#2466d1] to-cyan-500
                text-white text-xs sm:text-sm font-medium shadow
                hover:scale-105 active:scale-95 transition"
              >
                <Filter size={16} />
                ಅಭಿವೃಧ್ದಿ ಕೆಲಸಗಳು
              </a>
               </div>

              {/* VOICE QUERY */}
              {/* <a
                href="/apps/voice-query"
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-2 rounded-full
                bg-gradient-to-r from-violet-500 to-purple-600
                text-white text-xs sm:text-sm font-medium shadow
                hover:scale-105 active:scale-95 transition"
              >
                <Mic size={16} />
                ಧ್ವನಿ ಹುಡುಕಾಟ
              </a> */}

           
          </div>

          {/* INFO CARD */}
          <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-col">

            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-[#285799]">
                ಕ್ಷೇತ್ರದ ಪ್ರಮುಖ ಮಾಹಿತಿ
              </h2>
              <a
                href="/apps/statdata"
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                bg-gradient-to-r from-[#2466d1] to-cyan-500
                text-white text-xs sm:text-sm font-medium shadow
                hover:scale-105 transition"
              >
                ಇನ್ನಷ್ಟು
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
              <InfoItem icon={<Newspaper className="text-purple-600" size={18} />} text="ಒಟ್ಟು ಜನಸಂಖ್ಯೆ : 2,45,960" bg="bg-purple-50" />
              <InfoItem icon={<Leaf className="text-blue-600" size={18} />} text="ಪ್ರಮುಖ ಬೆಳೆಗಳು : ಅಡಿಕೆ, ತೆಂಗು" bg="bg-blue-50" />
              <InfoItem icon={<Landmark className="text-green-600" size={18} />} text="ಪ್ರಮುಖ ಸ್ಥಳಗಳು : ದೇವಸ್ಥಾನಗಳು, ಜಲಪಾತಗಳು" bg="bg-green-50" />
              <InfoItem icon={<Construction className="text-yellow-600" size={18} />} text="ಅಭಿವೃದ್ಧಿ ಕಾಮಗಾರಿಗಳು : ಪ್ರಗತಿಯಲ್ಲಿವೆ" bg="bg-yellow-50" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, text, bg }: any) => (
  <div className={`flex items-start gap-3 p-2 sm:p-3 rounded-xl ${bg} hover:shadow transition`}>
    <div className="mt-1 shrink-0">{icon}</div>
    <p className="text-xs sm:text-sm font-medium text-gray-800 leading-snug">
      {text}
    </p>
  </div>
);

export default HobliDashboard;