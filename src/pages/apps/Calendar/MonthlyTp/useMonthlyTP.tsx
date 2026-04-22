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
