/**
 * src/utils/pdf.ts
 * ✅ html2pdf.js CJS → ESM dynamic import wrapper
 *
 * Usage:
 *   import { generatePDF } from "../../../utils/pdf";
 *   await generatePDF(element, { filename: "report.pdf", orientation: "landscape" });
 */

export interface PdfOptions {
  filename?: string;
  margin?: number | [number, number, number, number];
  image?: { type: string; quality: number };
  html2canvas?: Record<string, any>;
  jsPDF?: { unit: string; format: string; orientation: string };
  pagebreak?: { mode: string[] };
}

export async function generatePDF(
  element: HTMLElement,
  options: PdfOptions = {}
): Promise<void> {
  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = (html2pdfModule as any).default ?? html2pdfModule;

  const finalOptions: PdfOptions = {
    filename: options.filename ?? "document.pdf",
    margin: options.margin ?? 10,
    image: options.image ?? { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      scrollY: 0,
      letterRendering: true,
      ...(options.html2canvas ?? {}),
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: options.jsPDF?.orientation ?? "portrait",
      ...(options.jsPDF ?? {}),
    },
    pagebreak: options.pagebreak ?? { mode: ["avoid-all", "css"] },
  };

  await html2pdf().from(element).set(finalOptions).save();
}

// ✅ Landscape shorthand
export async function generateLandscapePDF(
  element: HTMLElement,
  filename = "document.pdf"
): Promise<void> {
  return generatePDF(element, {
    filename,
    margin: [8, 6, 8, 6],
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
  });
}