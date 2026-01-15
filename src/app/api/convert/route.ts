import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink, mkdir, rm } from "fs/promises";
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
import * as XLSX from "xlsx";

const execAsync = promisify(exec);

/* ---------------- FORMAT DEFINITIONS ---------------- */

const FORMAT_CATEGORIES = {
  image: ["jpg", "jpeg", "png", "webp", "tiff"],
  document: ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "md"],
  spreadsheet: ["csv", "xlsx"],
  data: ["json"],
};

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  tiff: "image/tiff",
  txt: "text/plain",
  html: "text/html",
  csv: "text/csv",
  json: "application/json",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/* ---------------- CONVERSION MATRIX ---------------- */

function buildConversionMatrix() {
  const matrix: Record<string, string[]> = {};
  const allFormats = Object.values(FORMAT_CATEGORIES).flat();

  for (const from of allFormats) {
    matrix[from] = [];

    for (const to of allFormats) {
      if (from === to) continue;

      if (
        FORMAT_CATEGORIES.image.includes(from) &&
        (FORMAT_CATEGORIES.image.includes(to) || to === "pdf")
      ) matrix[from].push(to);

      if (
        FORMAT_CATEGORIES.document.includes(from) &&
        FORMAT_CATEGORIES.document.includes(to)
      ) matrix[from].push(to);

      if (
        FORMAT_CATEGORIES.spreadsheet.includes(from) &&
        FORMAT_CATEGORIES.spreadsheet.includes(to)
      ) matrix[from].push(to);

      if (from === "md" && ["pdf", "html", "txt"].includes(to))
        matrix[from].push(to);

      if (from === "json" && ["txt", "csv", "pdf"].includes(to))
        matrix[from].push(to);
    }
  }

  return matrix;
}

const CONVERSION_MATRIX = buildConversionMatrix();

/* ---------------- HELPERS ---------------- */

function getExt(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function isSupported(from: string, to: string) {
  return CONVERSION_MATRIX[from]?.includes(to);
}

/* ---------------- CONVERTERS ---------------- */

async function convertImage(input: string, output: string, format: string) {
  const img = sharp(input);

  if (format === "pdf") {
    const buffer = await img.png().toBuffer();
    const meta = await img.metadata();

    const pdf = await PDFDocument.create();
    const png = await pdf.embedPng(buffer);
    const page = pdf.addPage([
      meta.width || 800,
      meta.height || 600,
    ]);

    page.drawImage(png, {
      x: 0,
      y: 0,
      width: meta.width || 800,
      height: meta.height || 600,
    });

    await writeFile(output, await pdf.save());
  } else {
    await img.toFormat(format as any).toFile(output);
  }
}

async function textToPdf(input: string, output: string) {
  const text = await readFile(input, "utf-8");
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 170);

  let y = 20;
  for (const line of lines) {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 7;
  }

  await writeFile(output, Buffer.from(doc.output("arraybuffer")));
}

async function convertDocx(input: string, output: string, format: string) {
  if (format === "txt") {
    const r = await mammoth.extractRawText({ path: input });
    await writeFile(output, r.value, "utf-8");
  }

  if (format === "html") {
    const r = await mammoth.convertToHtml({ path: input });
    await writeFile(output, r.value, "utf-8");
  }

  if (format === "pdf") {
    const r = await mammoth.extractRawText({ path: input });
    const tmp = `${input}.txt`;
    await writeFile(tmp, r.value, "utf-8");
    await textToPdf(tmp, output);
    await unlink(tmp);
  }
}

async function convertPdf(input: string, output: string, format: string) {
  if (format === "txt") {
    await execAsync(`pdftotext "${input}" "${output}"`);
  }

  if (["jpg", "png"].includes(format)) {
    await execAsync(
      `pdftoppm -${format === "jpg" ? "jpeg" : format} -singlefile "${input}" "${output.replace(
        "." + format,
        ""
      )}"`
    );
  }
}

async function convertMarkdown(input: string, output: string, format: string) {
  const md = await readFile(input, "utf-8");

  if (format === "txt") await writeFile(output, md);
  if (format === "html") await writeFile(output, await marked(md));
  if (format === "pdf") await textToPdf(input, output);
}

async function convertCsv(input: string, output: string, format: string) {
  const wb = XLSX.read(await readFile(input, "utf-8"), { type: "string" });
  const buf = XLSX.write(wb, { bookType: format as any, type: "buffer" });
  await writeFile(output, buf);
}

async function convertJson(input: string, output: string, format: string) {
  const data = JSON.parse(await readFile(input, "utf-8"));

  if (format === "txt")
    await writeFile(output, JSON.stringify(data, null, 2));

  if (format === "csv") {
    if (!Array.isArray(data)) throw new Error("JSON must be an array");
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => row[h]));
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    await writeFile(output, csv);
  }

  if (format === "pdf") {
    const tmp = `${input}.txt`;
    await writeFile(tmp, JSON.stringify(data, null, 2));
    await textToPdf(tmp, output);
    await unlink(tmp);
  }
}

/* ---------------- DISPATCHER ---------------- */

async function performConversion(
  input: string,
  output: string,
  from: string,
  to: string
) {
  if (FORMAT_CATEGORIES.image.includes(from))
    return convertImage(input, output, to);

  if (from === "txt" && to === "pdf") return textToPdf(input, output);
  if (from === "docx") return convertDocx(input, output, to);
  if (from === "pdf") return convertPdf(input, output, to);
  if (from === "md") return convertMarkdown(input, output, to);
  if (from === "csv") return convertCsv(input, output, to);
  if (from === "json") return convertJson(input, output, to);

  if (["doc", "pptx", "odt", "rtf", "xlsx"].includes(from)) {
    await execAsync(
      `soffice --headless --convert-to ${to} "${input}" --outdir "${path.dirname(output)}"`
    );
    return;
  }

  throw new Error(`Unsupported conversion: ${from} → ${to}`);
}

/* ---------------- POST ---------------- */

export async function POST(req: NextRequest) {
  let workDir = "";
  let inputPath = "";
  let outputPath = "";

  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const target = form.get("outputFormat") as string;

    if (!file || !target)
      return NextResponse.json({ error: "Missing file or output format" }, { status: 400 });

    if (file.size > 50 * 1024 * 1024)
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 413 });

    const from = getExt(file.name);
    const to = target.toLowerCase();

    if (!isSupported(from, to)) {
      return NextResponse.json(
        { error: "Unsupported conversion", from, to, allowedTargets: CONVERSION_MATRIX[from] || [] },
        { status: 400 }
      );
    }

    workDir = path.join(os.tmpdir(), randomUUID());
    await mkdir(workDir, { recursive: true });

    const base = randomUUID();
    inputPath = path.join(workDir, `${base}.${from}`);
    outputPath = path.join(workDir, `${base}.${to}`);

    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
    await performConversion(inputPath, outputPath, from, to);

    const outputBuffer = await readFile(outputPath);

    return new Response(new Uint8Array(outputBuffer), {
      headers: {
        "Content-Type": MIME_TYPES[to] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="converted.${to}"`,
      },
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: "Conversion failed", detail: e.message },
      { status: 500 }
    );
  } finally {
    try {
      if (workDir) await rm(workDir, { recursive: true, force: true });
    } catch {}
  }
}

/* ---------------- GET ---------------- */

export async function GET() {
  return NextResponse.json({
    supportedConversions: CONVERSION_MATRIX,
    categories: FORMAT_CATEGORIES,
    maxFileSizeMB: 50,
  });
}
