import { useState, useRef, useEffect } from "react";
import MobileFooter from "./mobilefooter"; 

const Footer = () => {
  const [open, setOpen] = useState<null | "support" | "contact">(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
<footer className="bg-white md:bg-white sm:h-14 h-16 sticky bottom-0 flex items-center justify-center border-t z-50">

  {/* DESKTOP SAME */}
  <div className="hidden md:flex justify-between w-full items-center px-6 text-gray-600">
    <div className="text-sm font-semibold">
      {new Date().getFullYear()} © GHS MLA Office - Tarikere
    </div>

    <div className="flex gap-4 items-center">
      <a href="https://tarikeremlaghsrinivas.com/" target="_blank">About</a>
      <span>|</span>
      <span>Support</span>
      <span>|</span>
      <span>Contact</span>
    </div>
  </div>

  {/* ✅ MOBILE NAV */}
  <div className="md:hidden w-full flex justify-between items-center px-4">


 <MobileFooter />



  </div>

</footer>
  );
};

export default Footer;