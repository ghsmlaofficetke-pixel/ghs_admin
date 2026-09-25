// import { TP } from "../../../../api/tp";

// export const getMonthlyTP = (
//   allTp: TP[],
//   month: number,
//   year: number
// ) => {
//   return allTp
//     .filter((tp) => {
//       const d = new Date(tp.date);
//       return d.getMonth() === month && d.getFullYear() === year;
//     })
//     .sort((a, b) => {
//       return new Date(a.date).getTime() - new Date(b.date).getTime(); // 1 → 31
//     });
// };



import { TP } from "../../../../api/tp";

export const getMonthlyTP = (
  allTp: TP[],
  month: number,
  year: number
) => {
  return allTp
    .filter((tp) => {
      const d = new Date(tp.date);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime(); // 1 → 31
    });
};

/* ── TIME PARSER — "hh:mm AM/PM" or "HH:mm" → minutes (no time → end) ── */
const timeToMinutes = (t?: string): number => {
  if (!t || !t.trim()) return Number.MAX_SAFE_INTEGER;
  const m = t.trim().match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])?$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3]?.toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  return h * 60 + min;
};

/** Sort every TP's events chronologically by time — "date time wise" order */
export const sortEventsByTime = (data: TP[]): TP[] =>
  data.map((tp) => ({
    ...tp,
    events: [...(tp.events || [])].sort(
      (a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)
    ),
  }));

/** Guarantee every TP has ≥1 (possibly blank) event so a row always renders */
export const normalizeEmptyEvents = (data: TP[]): TP[] =>
  data.map((tp) => ({
    ...tp,
    events:
      tp.events && tp.events.length > 0
        ? tp.events
        : [{ time: "", title: "", description: "", location: "" }],
  }));

const toDateStr = (d: Date) => {
  const yr = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${yr}-${mo}-${da}`;
};

/**
 * Fill every calendar date in [start, end] with a row.
 * Dates that have no TP record get an empty placeholder
 * (rendered as a dashed row in preview / PDF / Excel).
 */
export const fillEmptyDates = (data: TP[], start: Date, end: Date): TP[] => {
  const byDate = new Map(data.map((tp) => [String(tp.date).slice(0, 10), tp]));
  const result: TP[] = [];

  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (cur <= last) {
    const dStr = toDateStr(cur);
    const existing = byDate.get(dStr);
    if (existing && existing.events && existing.events.length > 0) {
      result.push(existing);
    } else {
      result.push({
        ...(existing || ({} as TP)),
        date: dStr,
        events: [],
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
};

/**
 * One-call helper: fill missing dates in range, guarantee every
 * row has ≥1 event, then sort chronologically by time.
 * Used by Preview, PDF and Excel — so all three always match.
 */
export const buildDisplayRange = (data: TP[], start: Date, end: Date): TP[] =>
  sortEventsByTime(normalizeEmptyEvents(fillEmptyDates(data, start, end)));