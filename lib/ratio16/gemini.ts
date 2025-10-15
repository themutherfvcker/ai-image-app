"use server";

import sharp from "sharp";
import { GoogleGenAI, Modality } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";

// ---------- Helpers ----------

async function ensureExact1920x1080(dataUrl: string): Promise<string> {
  const [hdr, b64] = dataUrl.split(",");
  const buf = Buffer.from(b64, "base64");
  const meta = await sharp(buf).metadata();
  if (meta.width === 1920 && meta.height === 1080) return dataUrl;
  const out = await sharp(buf).resize(1920, 1080, { fit: "cover" }).png().toBuffer();
  return `data:image/png;base64,${out.toString("base64")}`;
}

function dataUrlToParts(dataUrl: string): { base64Data: string; mimeType: string } {
  const [header, data] = dataUrl.split(",");
  const m = header.match(/data:(.*?);base64/);
  if (!m) throw new Error("Invalid data URL");
  return { base64Data: data, mimeType: m[1] };
}

function preferInlineImage(response: any): string | null {
  const cand = response?.candidates?.[0];
  for (const part of cand?.content?.parts ?? []) {
    const anyp: any = part;
    if (anyp.inlineData?.mimeType?.startsWith("image/")) {
      return `data:${anyp.inlineData.mimeType};base64,${anyp.inlineData.data}`;
    }
  }
  const fallback = (response as any)?.generatedImages?.[0]?.image?.imageBytes;
  if (fallback) return `data:image/png;base64,${fallback}`;
  return null;
}

// ---------- AI Client ----------

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (aiClient) return aiClient;
  const key = process.env.API_KEY;
  if (!key) throw new Error("Missing API_KEY");
  aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

// ---------- Model & Template ----------

const MODEL_PRIMARY = process.env.GENAI_MODEL_PRIMARY || "gemini-2.5-flash-image";
const MODEL_FALLBACK = process.env.GENAI_MODEL_FALLBACK || "";

let cachedBlankBase64: string | null = null;
async function getBlank1920x1080DataUrl() {
  if (cachedBlankBase64) return cachedBlankBase64;
  const p = path.join(process.cwd(), "public", "ratio16", "blank-1920x1080.png");
  const buf = await fs.readFile(p);
  cachedBlankBase64 = `data:image/png;base64,${buf.toString("base64")}`;
  return cachedBlankBase64;
}

const SYSTEM_HINT =
  "Outpaint the first image into the second image's full 1920×1080 frame; fill edges naturally; no borders or frames; preserve subject and lighting.";

// ---------- Model Call ----------

async function callModel(model: string, parts: any[]) {
  const ai = getAi();
  // Cast to any to tolerate SDK typing differences across versions
  return (ai.models as any).generateContent({
    model,
    // Most strict SDKs want an array and an explicit role
    contents: [{ role: "user", parts }],
    // Older typings use imageGenerationConfig; generationConfig may not be typed
    imageGenerationConfig: { aspectRatio: "16:9" },
    // Keep minimal to avoid 400s on some versions
    config: { responseModalities: [Modality.IMAGE] },
  } as any);
}

// ---------- Public API ----------

export async function editTo16x9(originalDataUrl: string, prompt: string): Promise<string> {
  const src = dataUrlToParts(originalDataUrl);
  const tmpl = dataUrlToParts(await getBlank1920x1080DataUrl());
  const parts = [
    { inlineData: { data: src.base64Data, mimeType: src.mimeType } },
    { inlineData: { data: tmpl.base64Data, mimeType: tmpl.mimeType } },
    { text: `${SYSTEM_HINT}\n\nUser request: ${prompt}` },
  ];

  try {
    const resp = await callModel(MODEL_PRIMARY, parts);
    const out = preferInlineImage(resp);
    if (out) return await ensureExact1920x1080(out);
    throw new Error("No image returned from model");
  } catch (e: any) {
    const code = e?.error?.code || e?.response?.data?.error?.code || e?.status;
    if (code === 429 && MODEL_FALLBACK) {
      const resp2 = await callModel(MODEL_FALLBACK, parts);
      const out2 = preferInlineImage(resp2);
      if (out2) return await ensureExact1920x1080(out2);
    }
    throw e;
  }
}

export async function textTo16x9(prompt: string): Promise<string> {
  const tmpl = dataUrlToParts(await getBlank1920x1080DataUrl());
  const parts = [
    { inlineData: { data: tmpl.base64Data, mimeType: tmpl.mimeType } },
    {
      text:
        "Generate a photorealistic scene that completely fills a 1920×1080 frame. " +
        "No borders or frames. Natural perspective and lighting.\n\nUser request: " +
        prompt,
    },
  ];

  try {
    const resp = await callModel(MODEL_PRIMARY, parts);
    const out = preferInlineImage(resp);
    if (out) return await ensureExact1920x1080(out);
    throw new Error("No image returned from model");
  } catch (e: any) {
    const code = e?.error?.code || e?.response?.data?.error?.code || e?.status;
    if (code === 429 && MODEL_FALLBACK) {
      const resp2 = await callModel(MODEL_FALLBACK, parts);
      const out2 = preferInlineImage(resp2);
      if (out2) return await ensureExact1920x1080(out2);
    }
    throw e;
  }
}
