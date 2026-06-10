import { useEffect, useState } from "react";

export default function PWAUpdateBanner() {
  const [updateFn, setUpdateFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setUpdateFn(() => customEvent.detail.updateSW);
    };
    window.addEventListener('pwa-update-available', handler);
    return () => window.removeEventListener('pwa-update-available', handler);
  }, []);

  if (!updateFn) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#1e293b',
        color: '#fff',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        minWidth: '280px',
        maxWidth: '90vw',
      }}
    >
      <span style={{ fontSize: '20px' }}>🔄</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '14px' }}>New Update Available</div>
        <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '2px' }}>
          App update ready aagide
        </div>
      </div>
      <button
        onClick={() => {
          updateFn();        // SW activate + reload
          setUpdateFn(null);
        }}
        style={{
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: '13px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Update
      </button>
      <button
        onClick={() => setUpdateFn(null)}
        style={{
          background: 'transparent',
          color: '#94a3b8',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0 4px',
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
