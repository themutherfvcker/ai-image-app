import { NextResponse } from "next/server";
import { editTo16x9 } from "@/lib/ratio16/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { imageDataUrl, prompt } = await req.json();
    if (!imageDataUrl || !prompt) {
      return NextResponse.json({ error: "Missing imageDataUrl or prompt" }, { status: 400 });
    }
    const out = await editTo16x9(imageDataUrl, prompt);
    return NextResponse.json({ imageDataUrl: out }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
