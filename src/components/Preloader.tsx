// src/components/Preloader.tsx
// ✅ Page load ಆಗ್ತಿರುವಾಗ ಕಾಣಿಸಲು - top progress bar

const Preloader = () => (
  <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
    <div
      className="h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600"
      style={{
        animation: "progressBar 1.2s ease-in-out infinite",
        transformOrigin: "left center",
      }}
    />
    <style>{`
      @keyframes progressBar {
        0%   { transform: scaleX(0); opacity: 1; }
        60%  { transform: scaleX(0.7); opacity: 1; }
        100% { transform: scaleX(1); opacity: 0; }
      }
    `}</style>
  </div>
);

export default Preloader;


// ============================================================
// ✅ SKELETON LOADER - table/list load ಆಗ್ತಿರುವಾಗ ಬಳಸಿ
// Usage:  <TableSkeleton rows={5} cols={4} />
// ============================================================
export const TableSkeleton = ({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) => (
  <div className="w-full overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
    {/* Header */}
    <div className="flex gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ flex: i === 0 ? 2 : 1 }}
        />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div
        key={rowIdx}
        className="flex gap-3 border-t border-gray-100 dark:border-gray-700 px-4 py-3"
      >
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div
            key={colIdx}
            className="h-3 rounded-md bg-gray-100 dark:bg-gray-700/60 animate-pulse"
            style={{
              flex: colIdx === 0 ? 2 : 1,
              animationDelay: `${(rowIdx * cols + colIdx) * 40}ms`,
            }}
          />
        ))}
      </div>
    ))}
  </div>
);


// ============================================================
// ✅ CARD SKELETON - dashboard cards ಗಾಗಿ
// Usage:  <CardSkeleton count={3} />
// ============================================================
export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-xl border border-gray-100 dark:border-gray-700 p-5 space-y-3 animate-pulse"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div className="flex justify-between items-center">
          <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-7 w-16 rounded-md bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-32 rounded-md bg-gray-100 dark:bg-gray-700/60" />
      </div>
    ))}
  </div>
);


// ============================================================
// ✅ FULL PAGE LOADER - route change ಮಾಡುವಾಗ
// Usage:  <PageLoader />
// ============================================================
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-10 h-10 rounded-full border-[3px] border-blue-500/30 border-t-blue-500"
        style={{ animation: "spin 0.8s linear infinite" }}
      />
      <span className="text-sm text-gray-400 dark:text-gray-500">
        ಲೋಡ್ ಆಗ್ತಿದೆ...
      </span>
    </div>
    <style>{`
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>
);