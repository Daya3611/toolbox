export const runtime = "nodejs";
import sharp from "sharp";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const targetSizeKB = parseInt(formData.get("targetSizeKB") as string); // in KB

  if (!file || isNaN(targetSizeKB)) {
    return new Response("Invalid file or target size", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let minQuality = 1;
  let maxQuality = 100;
  let bestOutput: Buffer | null = null;
  let bestSizeDiff = Infinity;

  for (let i = 0; i < 10; i++) {
    const quality = Math.floor((minQuality + maxQuality) / 2);

    const output = await sharp(buffer).jpeg({ quality }).toBuffer();
    const sizeKB = output.length / 1024;

    const diff = Math.abs(sizeKB - targetSizeKB);
    if (diff < bestSizeDiff) {
      bestSizeDiff = diff;
      bestOutput = output;
    }

    if (sizeKB > targetSizeKB) {
      maxQuality = quality - 1;
    } else {
      minQuality = quality + 1;
    }
  }

  if (!bestOutput) {
    return new Response("Compression failed", { status: 500 });
  }

  return new Response(bestOutput, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
