// /app/api/compress-image/route.ts
import sharp from "sharp";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const targetSizeKB = parseInt(formData.get("targetSizeKB") as string); // in KB

  const buffer = Buffer.from(await file.arrayBuffer());

  // Start compressing with binary search on quality
  let minQuality = 10;
  let maxQuality = 90;
  let bestOutput: Buffer = buffer;

  for (let i = 0; i < 7; i++) {
    const quality = Math.floor((minQuality + maxQuality) / 2);
    const output = await sharp(buffer).jpeg({ quality }).toBuffer();

    const sizeKB = output.length / 1024;

    if (sizeKB <= targetSizeKB) {
      bestOutput = output;
      minQuality = quality + 1; // try better quality
    } else {
      maxQuality = quality - 1; // too big
    }
  }

  return new Response(bestOutput, {
    headers: { "Content-Type": "image/jpeg" },
  });
}
