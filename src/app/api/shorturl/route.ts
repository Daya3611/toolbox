import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { long_url } = await req.json();

    if (!long_url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    const res = await fetch("https://cleanuri.com/api/v1/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `url=${encodeURIComponent(long_url)}`,
    });

    const result = await res.json();

    if (!res.ok || result.error) {
      return NextResponse.json(
        { error: result.error || "CleanURI API error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ shortUrl: result.result_url });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Error", message: error.message },
      { status: 500 }
    );
  }
}
