import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 🔹 1. Check localStorage (MAIN FIX)
    const installed = localStorage.getItem("pwaInstalled");
    if (installed === "true") {
      setIsInstalled(true);
      return;
    }

    // 🔹 2. Detect standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      localStorage.setItem("pwaInstalled", "true");
    }

    // 🔹 3. Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 🔹 4. Listen for successful install
    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      localStorage.setItem("pwaInstalled", "true"); // 🔥 important
    };

    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      alert("Install option not available in this browser.");
      return;
    }

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setIsInstalled(true);
      localStorage.setItem("pwaInstalled", "true"); // 🔥 important
    }

    setDeferredPrompt(null);
  };

  // 🔹 Hide button if already installed OR not available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-5 md:right-15 right-5 z-50">
      <button
        onClick={installApp}
        className="bg-blue-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition text-sm md:text-base"
      >
        📲 Install App
      </button>
    </div>
  );
}