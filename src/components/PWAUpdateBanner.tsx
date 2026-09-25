import { useEffect, useState } from "react";

type UpdateInfo = {
  version: string | null;
  notes: string | null;
};

export default function PWAUpdateBanner() {
  const [updateFn, setUpdateFn] = useState<((reloadPage?: boolean) => Promise<void>) | null>(null);
  const [info, setInfo] = useState<UpdateInfo>({ version: null, notes: null });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      const pendingUpdateFn = customEvent.detail.updateSW;

      fetch("/manifest.webmanifest", { cache: "no-store" })
        .then((res) => res.json())
        .then((manifest) => {
          const newVersion = manifest?.version ?? null;

          // ✅ Don't show if already on this version
          if (newVersion && newVersion === __APP_VERSION__) return;

          // ✅ Don't show if user already dismissed this version
          const dismissed = localStorage.getItem('pwa-dismissed-version');
          if (newVersion && dismissed === newVersion) return;

          setInfo({ version: newVersion, notes: manifest?.release_notes ?? null });
          setUpdateFn(() => pendingUpdateFn);
        })
        .catch(() => {
          setUpdateFn(() => pendingUpdateFn);
        });
    };
    window.addEventListener('pwa-update-available', handler);
    return () => window.removeEventListener('pwa-update-available', handler);
  }, []);

  if (!updateFn) return null;

  const handleUpdate = () => {
    if (updating) return;
    setUpdating(true);
    updateFn(true);
  };

  const handleDismiss = () => {
    // ✅ Remember dismissed version so popup doesn't re-appear
    if (info.version) localStorage.setItem('pwa-dismissed-version', info.version);
    setUpdateFn(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.55)',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: '16px',
          padding: '28px 24px',
          width: '100%',
          maxWidth: '360px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '40px', lineHeight: 1 }}>🚀</div>

        <div style={{ fontWeight: 700, fontSize: '18px', marginTop: '12px' }}>
          ಹೊಸ ಅಪ್ಡೇಟ್ ಲಭ್ಯ ಇದೆ!
        </div>

        {info.version && (
          <div
            style={{
              display: 'inline-block',
              marginTop: '8px',
              background: '#eff6ff',
              color: '#1a56db',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '999px',
              padding: '4px 12px',
            }}
          >
            ಆವೃತ್ತಿ (Version) {info.version}
          </div>
        )}

        <div style={{ fontSize: '13px', color: '#475569', marginTop: '14px', lineHeight: 1.6 }}>
          {info.notes || 'ಹೊಸ ಫೀಚರ್‌ಗಳು ಮತ್ತು ಸುಧಾರಣೆಗಳು ಲಭ್ಯ ಇವೆ.'}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
          <button
            onClick={handleDismiss}
            disabled={updating}
            style={{
              flex: 1,
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 0',
              fontWeight: 600,
              fontSize: '14px',
              cursor: updating ? 'not-allowed' : 'pointer',
              opacity: updating ? 0.6 : 1,
            }}
          >
            ನಂತರ
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating}
            style={{
              flex: 1.4,
              background: '#1a56db',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 0',
              fontWeight: 700,
              fontSize: '14px',
              cursor: updating ? 'not-allowed' : 'pointer',
              opacity: updating ? 0.85 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {updating ? (
              <>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.5)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'pwa-update-spin 0.7s linear infinite',
                  }}
                />
                ಅಪ್ಡೇಟ್ ಆಗುತ್ತಿದೆ...
              </>
            ) : (
              'ಈಗ ಅಪ್ಡೇಟ್ ಮಾಡಿ'
            )}
          </button>
        </div>
      </div>

      <style>
        {`@keyframes pwa-update-spin { to { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
}