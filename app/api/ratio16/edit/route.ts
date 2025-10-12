import { NextResponse } from "next/server";
import { editTo16x9 } from "@/lib/ratio16/gemini";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { imageDataUrl, prompt } = await req.json();
    if (!imageDataUrl || !prompt) {
      return NextResponse.json({ error: "Missing imageDataUrl or prompt" }, { status: 400 });
    }
    if (typeof imageDataUrl !== "string" || !imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "imageDataUrl must be a data URL (data:image/...;base64,...)" }, { status: 400 });
    }
    const out = await editTo16x9(imageDataUrl, prompt);
    return NextResponse.json({ imageDataUrl: out }, { status: 200 });
  } catch (e: any) {
    const raw = e?.response?.data || e?.error || e;
    const str = typeof raw === "string" ? raw : JSON.stringify(raw);
    let status = 500;
    let retry = 0;
    try {
      const obj = typeof raw === "object" ? raw : JSON.parse(str);
      const code = obj?.error?.code || obj?.code;
      if (code === 429) {
        status = 429;
        const rd = obj?.error?.details?.find?.((d: any) => d["@type"]?.includes("RetryInfo"))?.retryDelay
                 || obj?.retryDelay;
        if (typeof rd === "string" && rd.endsWith("s")) retry = parseInt(rd.replace("s",""), 10) || 30;
      }
    } catch {}
    const res = NextResponse.json({ error: "editTo16x9 failed", details: str?.slice(0, 2000) }, { status });
    if (retry) res.headers.set("Retry-After", String(retry));
    return res;
  }
}
