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
    // 🔹 Check if already running as installed app
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 🔹 Listen for install event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 🔹 When app installed
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      alert("Install not available in this browser.");
      return;
    }

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  // 🔹 Hide button if installed OR no install event available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-5 md:right-15 right-10 z-50">
      <button
        onClick={installApp}
        className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-xl hover:scale-105 transition"
      >
        Install App
      </button>
    </div>
  );
}
