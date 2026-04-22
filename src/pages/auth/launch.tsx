import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import basavanna from "../../assets/images/basavanna.png";
import Logo from "../../assets/images/logo.png";

export default function LaunchPage() {
  const [count, setCount] = useState(20);
  const [launched, setLaunched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setLaunched(true);

      // 🎉 Confetti Blast Effect
      const duration = 3000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };

      runConfetti();

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [count, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-200 via-white to-orange-200 px-4 text-center overflow-hidden">
      {/* Basavanna Image */}
      <img
        src={basavanna}
        alt="Basavanna"
        className="w-24 h-24 md:w-24 md:h-24 object-cover rounded-full shadow-2xl mb-6 border-4 border-white animate-fadeIn"
      />

      {/* Main Text */}
      <h1 className="text-xl sm:text-2xl md:text-2xl font-extrabold text-orange-700 mb-4 animate-pulse leading-snug">
       ಬಸವ ಜಯಂತಿಯ ಶುಭಾಶಯಗಳು
      </h1>

      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="w-52 sm:w-64 md:w-96 lg:w-[800px] h-auto mb-3 drop-shadow-2xl animate-[zoomIn_1.5s_ease-in-out]"
      />

      {/* Welcome Text */}
      <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent animate-[fadeInUp_1s_ease-in-out]">
        GHS WEB APPLICATION ಗೆ ಸುಸ್ವಾಗತ
      </h2>

      {/* Date */}
      <p className="text-lg md:text-2xl text-gray-900 mt-3 mb-4 font-medium">
        Date: 20/04/2026
      </p>

      {/* Countdown */}
      {!launched ? (
       <div className="text-7xl sm:text-7xl md:text-9xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-bounce drop-shadow-lg">
       {count}
     </div>
      ) : (
        <div className="text-7xl sm:text-7xl md:text-9xl font-extrabold text-green-600 animate-[zoomIn_1s_ease-in-out]">
          🚀 Launched!
        </div>
      )}

      {/* Decorative Glow */}
      <div className="absolute w-[300px] h-[300px] bg-orange-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-pink-300 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
    </div>
  );
}
