import {
  FaHome,
  FaBars,
  FaGlobe,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

const MobileFooter = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full z-30 md:hidden">
      {/* Safe-area padding for iPhones */}
      <div className="pb-[env(safe-area-inset-bottom)]">
        <div className="mx-1 mb-1">
          {/* Outer pill container */}
          <div
            className="relative flex items-center justify-around h-[64px] rounded-[28px] px-3"
        style={{
  background: "linear-gradient(135deg, #f0f7ff, #e0f2fe)",
  border: "1px solid #e5e7eb",
  boxShadow:
    "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
}}
          >
            {/* INSTAGRAM */}
            <a
              href="https://www.instagram.com/srinivasgowdahanumaiah?igsh=OHZhbXhwNG1mZXRt"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-[3px] min-w-[48px] py-1 px-2 rounded-xl transition-all active:scale-95"
            >
              <FaInstagram
                size={20}
                style={{ color: "#e1306c", filter: "drop-shadow(0 0 6px rgba(225,48,108,0.4))" }}
              />
              <span className="text-[10px] tracking-wide text-[#265899] font-bold">Insta</span>
            </a>

            {/* FACEBOOK */}
            <a
              href="https://www.facebook.com/share/1BHPueXXoe/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-[3px] min-w-[48px] py-1 px-2 rounded-xl transition-all active:scale-95"
            >
              <FaFacebookF
                size={20}
                style={{ color: "#4267B2", filter: "drop-shadow(0 0 6px rgba(66,103,178,0.4))" }}
              />
              <span className="text-[10px] tracking-wide text-[#265899] font-bold">FB</span>
            </a>

            {/* HOME — floating pill center button */}
          <button
  onClick={() => (window.location.href = "/dashboard")}
  className="relative flex flex-col items-center -mt-7 active:scale-95 transition-transform"
>
  {/* outer ring */}
  <div
    className="w-[62px] h-[62px] rounded-full flex items-center justify-center"
    style={{
      background: "linear-gradient(to right, #76a0e6, #cffafe)",
      border: "1px solid #93c5fd",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    {/* inner button */}
    <div
      className="w-[48px] h-[48px] rounded-full flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #93c5fd, #22d3ee)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <FaHome size={20} color="#1e3a8a" />
    </div>
  </div>

  <span className="text-[10px] text-[#265899] font-bold mt-[3px]">Home</span>
</button>

            {/* ABOUT */}
            <a
              href="https://tarikeremlaghsrinivas.com/"
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-[3px] min-w-[48px] py-1 px-2 rounded-xl transition-all active:scale-95"
            >
              <FaGlobe size={20} className="text-gradient-to-r from-[#2466d1] to-cyan-500" />
              <span className="text-[10px] tracking-wide text-[#265899] font-bold">About</span>
            </a>

            {/* MENU */}
            <button
              onClick={() => {
                const html = document.documentElement;
                html.classList.toggle("sidenav-enable");
                html.classList.toggle("overlay-enable");
              }}
              className="relative flex flex-col items-center gap-[3px] min-w-[48px] py-1 px-2 rounded-xl transition-all active:scale-95"
            >
              <FaBars size={20} className="text-gradient-to-r from-[#2466d1] to-cyan-500" />
              <span className="text-[10px] tracking-wide text-[#265899] font-bold">Menu</span>
              {/* active dot */}
              <span
                className="absolute bottom-[-6px] w-[5px] h-[5px] rounded-full bg-sky-400"
                style={{ boxShadow: "0 0 6px rgba(96,165,250,0.8)" }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFooter;