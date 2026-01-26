import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getExt(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;
    const target = form.get("outputFormat") as string;

    if (!file || !target) {
      return NextResponse.json(
        { error: "Missing file or output format" },
        { status: 400 }
      );
    }

    const from = getExt(file.name);
    const to = target.toLowerCase();

    const apiToken = process.env.CONVERTAPI_TOKEN!;
    const convertUrl =
      `https://v2.convertapi.com/convert/${from}/to/${to}` +
      `?Secret=${apiToken}`;

    const apiForm = new FormData();
    apiForm.append("File", file);

    let response = await fetch(convertUrl, {
      method: "POST",
      body: apiForm,
    });

    let result = await response.json();

    // 🔁 WAIT UNTIL CONVERSION IS DONE
    if (result.Status === "Processing") {
      const conversionId = result.ConversionId;

      for (let i = 0; i < 15; i++) {
        await sleep(2000);

        const statusResponse = await fetch(
          `https://v2.convertapi.com/convert/status/${conversionId}?Secret=${apiToken}`
        );

        const statusResult = await statusResponse.json();

        if (statusResult.Status === "Completed") {
          result = statusResult;
          break;
        }

        if (statusResult.Status === "Failed") {
          throw new Error(statusResult.Message || "Conversion failed");
        }
      }
    }

    if (!result.Files || !result.Files.length) {
      throw new Error("Conversion did not return output file");
    }

    const fileUrl = result.Files[0].Url;

    const outputResponse = await fetch(fileUrl);

    if (!outputResponse.ok) {
      throw new Error("Failed to download converted file");
    }

    const buffer = await outputResponse.arrayBuffer();

    return new Response(Buffer.from(buffer), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="converted.${to}"`,
      },
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Conversion failed",
        detail: err.message,
      },
      { status: 500 }
    );
  }
}
