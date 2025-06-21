// /app/api/convert/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";
import { randomUUID } from "crypto";
import sharp from "sharp";
import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import XLSX from "xlsx";

const execAsync = promisify(exec);

const CONVERSION_MATRIX = {
  jpg: ["png", "pdf", "webp", "tiff"],
  jpeg: ["png", "pdf", "webp", "tiff"],
  png: ["jpg", "jpeg", "pdf", "webp", "tiff"],
  webp: ["jpg", "jpeg", "png", "pdf", "tiff"],
  tiff: ["jpg", "jpeg", "png", "pdf", "webp"],
  pdf: ["txt", "docx", "jpg", "png"],
  docx: ["pdf", "txt", "html"],
  doc: ["pdf", "txt", "html", "docx"],
  txt: ["pdf", "docx", "html"],
  html: ["pdf", "docx", "txt"],
  rtf: ["pdf", "docx", "txt"],
  odt: ["pdf", "docx", "txt"],
  xlsx: ["pdf", "csv"],
  pptx: ["pdf"],
  md: ["pdf", "html", "txt"],
  csv: ["xlsx", "pdf"],
  json: ["txt", "pdf", "csv"]
};

function isConversionSupported(fromExt: string, toExt: string): boolean {
  return CONVERSION_MATRIX[fromExt as keyof typeof CONVERSION_MATRIX]?.includes(toExt) || false;
}

async function convertImage(inputPath: string, outputPath: string, outputFormat: string) {
  const sharpInstance = sharp(inputPath);
  const format = outputFormat.toLowerCase();
  if (format === "pdf") {
    const imageBuffer = await sharpInstance.png().toBuffer();
    const { width, height } = await sharpInstance.metadata();
    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(imageBuffer);
    const page = pdfDoc.addPage([width || 800, height || 600]);
    page.drawImage(pngImage, { x: 0, y: 0, width: width || 800, height: height || 600 });
    const pdfBytes = await pdfDoc.save();
    await writeFile(outputPath, pdfBytes);
  } else {
    await sharpInstance.toFormat(format as keyof sharp.FormatEnum).toFile(outputPath);
  }
}

async function convertTextToPdf(inputPath: string, outputPath: string) {
  const textContent = await readFile(inputPath, "utf-8");
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(textContent, doc.internal.pageSize.getWidth() - 40);
  let y = 20;
  for (const line of lines) {
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 7;
  }
  const buffer = Buffer.from(doc.output("arraybuffer"));
  await writeFile(outputPath, buffer);
}

async function convertDocx(inputPath: string, outputPath: string, format: string) {
  const out = format.toLowerCase();
  if (out === "txt") {
    const result = await mammoth.extractRawText({ path: inputPath });
    await writeFile(outputPath, result.value, "utf-8");
  } else if (out === "html") {
    const result = await mammoth.convertToHtml({ path: inputPath });
    await writeFile(outputPath, result.value, "utf-8");
  } else if (out === "pdf") {
    const html = await mammoth.convertToHtml({ path: inputPath });
    const tmpTxtPath = path.join(path.dirname(outputPath), "tmp.txt");
    await writeFile(tmpTxtPath, html.value, "utf-8");
    await convertTextToPdf(tmpTxtPath, outputPath);
  } else {
    throw new Error(`Unsupported DOCX conversion to ${out}`);
  }
}

async function convertPdf(inputPath: string, outputPath: string, outputFormat: string) {
  const out = outputFormat.toLowerCase();
  if (out === "txt") {
    await execAsync(`pdftotext \"${inputPath}\" \"${outputPath}\"`);
  } else if (["jpg", "png"].includes(out)) {
    await execAsync(`pdftoppm -${out === "jpg" ? "jpeg" : out} -singlefile \"${inputPath}\" \"${outputPath.replace(`.${out}`, "")}\"`);
  } else {
    throw new Error(`Unsupported PDF conversion to: ${out}`);
  }
}

async function convertMarkdown(inputPath: string, outputPath: string, outputFormat: string) {
  const content = await readFile(inputPath, "utf-8");
  const out = outputFormat.toLowerCase();
  if (out === "txt") await writeFile(outputPath, content, "utf-8");
  else if (out === "html") await writeFile(outputPath, await marked(content), "utf-8");
  else if (out === "pdf") await convertTextToPdf(inputPath, outputPath);
  else throw new Error(`Unsupported markdown to ${outputFormat}`);
}

async function convertCsv(inputPath: string, outputPath: string, outputFormat: string) {
  const content = await readFile(inputPath, "utf-8");
  const workbook = XLSX.read(content, { type: "string" });
  const buffer = XLSX.write(workbook, { bookType: outputFormat as XLSX.BookType, type: "buffer" });
  await writeFile(outputPath, buffer);
}

async function convertJson(inputPath: string, outputPath: string, outputFormat: string) {
  const content = await readFile(inputPath, "utf-8");
  const data = JSON.parse(content);
  const out = outputFormat.toLowerCase();
  if (out === "txt") await writeFile(outputPath, JSON.stringify(data, null, 2));
  else if (out === "pdf") await convertTextToPdf(inputPath, outputPath);
  else if (out === "csv") {
    if (!Array.isArray(data)) throw new Error("Only array of objects supported for CSV");
    const header = Object.keys(data[0]);
    const rows = data.map(row => header.map(key => row[key]));
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    await writeFile(outputPath, csv);
  } else throw new Error(`Unsupported JSON to ${out}`);
}

async function performConversion(inputPath: string, outputPath: string, inputExt: string, outputFormat: string) {
  const ext = inputExt.toLowerCase();
  const out = outputFormat.toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "tiff"].includes(ext)) return convertImage(inputPath, outputPath, out);
  if (ext === "txt" && out === "pdf") return convertTextToPdf(inputPath, outputPath);
  if (ext === "docx") return convertDocx(inputPath, outputPath, out);
  if (ext === "pdf") return convertPdf(inputPath, outputPath, out);
  if (ext === "md") return convertMarkdown(inputPath, outputPath, out);
  if (ext === "csv") return convertCsv(inputPath, outputPath, out);
  if (ext === "json") return convertJson(inputPath, outputPath, out);

  throw new Error(`Conversion from ${ext} to ${out} not supported`);
}

export async function POST(req: NextRequest) {
  let inputPath = "";
  let outputPath = "";

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const outputFormat = formData.get("outputFormat") as string;

    if (!file || !outputFormat) return NextResponse.json({ error: "Missing file or output format" }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: "File size exceeds 50MB" }, { status: 413 });

    const originalExt = file.name.split(".").pop()?.toLowerCase() || "tmp";
    const outputExt = outputFormat.toLowerCase();

    if (!isConversionSupported(originalExt, outputExt)) return NextResponse.json({ error: `Unsupported conversion: ${originalExt} to ${outputExt}` }, { status: 400 });

    const tempDir = path.join(os.tmpdir(), `converter-${randomUUID()}`);
    await mkdir(tempDir, { recursive: true });

    const baseName = randomUUID();
    inputPath = path.join(tempDir, `${baseName}.${originalExt}`);
    outputPath = path.join(tempDir, `${baseName}.${outputExt}`);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(inputPath, Buffer.from(arrayBuffer));

    await performConversion(inputPath, outputPath, originalExt, outputExt);
    const convertedBuffer = await readFile(outputPath);

    const contentTypes: { [key: string]: string } = {
      pdf: "application/pdf",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      txt: "text/plain",
      html: "text/html",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      tiff: "image/tiff",
      csv: "text/csv",
      json: "application/json",
      md: "text/markdown",
    };

    return new Response(convertedBuffer, {
      headers: {
        "Content-Type": contentTypes[outputExt] || "application/octet-stream",
        "Content-Disposition": `attachment; filename=converted.${outputExt}`,
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    try {
      if (inputPath) await unlink(inputPath);
      if (outputPath) await unlink(outputPath);
    } catch {}

    return NextResponse.json({ error: "Conversion failed", detail: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    supportedConversions: CONVERSION_MATRIX,
    maxFileSize: "50MB",
    toolsUsed: ["sharp", "mammoth", "pdf-lib", "jsPDF", "marked", "xlsx"],
  });
}