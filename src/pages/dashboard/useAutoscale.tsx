import { useEffect, useState } from "react";

export const useAutoScale = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const baseWidth = 1440;
      const baseHeight = 900;

      const scaleX = window.innerWidth / baseWidth;
      const scaleY = window.innerHeight / baseHeight;

      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return scale;
};