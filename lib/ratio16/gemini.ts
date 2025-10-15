"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";

// Lazy-init AI client to avoid throwing at import/build time
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (aiClient) return aiClient;
  const key = process.env.API_KEY;
  if (!key) {
    // Only throw at request time, not during module import
    throw new Error("Missing API_KEY");
  }
  aiClient = new GoogleGenAI({ apiKey: key });
  return aiClient;
}

// Model config with optional fallback
const MODEL_PRIMARY = process.env.GENAI_MODEL_PRIMARY || "gemini-2.5-flash-image";
const MODEL_FALLBACK = process.env.GENAI_MODEL_FALLBACK || "";

// Cache the real 1920×1080 template (PNG in /public). Loaded once per runtime.
let cachedBlankBase64: string | null = null;
async function getBlank1920x1080DataUrl() {
  if (cachedBlankBase64) return cachedBlankBase64;
  const p = path.join(process.cwd(), "public", "ratio16", "blank-1920x1080.png");
  const buf = await fs.readFile(p);
  cachedBlankBase64 = `data:image/png;base64,${buf.toString("base64")}`;
  return cachedBlankBase64;
}

function dataUrlToParts(dataUrl: string): { base64Data: string; mimeType: string } {
  const [header, data] = dataUrl.split(",");
  const m = header.match(/data:(.*?);base64/);
  if (!m) throw new Error("Invalid data URL");
  return { base64Data: data, mimeType: m[1] };
}

const SYSTEM_HINT =
  "Outpaint the first image into the second image's full 1920×1080 frame; fill edges naturally; no borders or frames; preserve subject and lighting.";

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

async function callModel(model: string, parts: any[]) {
  const ai = getAi();
  return ai.models.generateContent({
    model,

    // Most SDK versions expect an ARRAY with a role:
    contents: [{ role: "user", parts }],

    // ✅ Use this with your SDK version
    // (older typings expose imageGenerationConfig, not generationConfig)
    // @ts-expect-error: field exists on backend but may be missing in local types
    imageGenerationConfig: { aspectRatio: "16:9" },

    // Keep minimal; IMAGE is enough
    config: { responseModalities: [Modality.IMAGE] },
  });
}

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
    if (out) return out;
    throw new Error("No image returned from model");
  } catch (e: any) {
    const code = e?.error?.code || e?.response?.data?.error?.code;
    if (code === 429 && MODEL_FALLBACK) {
      const resp2 = await callModel(MODEL_FALLBACK, parts);
      const out2 = preferInlineImage(resp2);
      if (out2) return out2;
    }
    throw e;
  }
}

export async function textTo16x9(prompt: string): Promise<string> {
  const tmpl = dataUrlToParts(await getBlank1920x1080DataUrl());
  const parts = [
    { inlineData: { data: tmpl.base64Data, mimeType: tmpl.mimeType } },
    { text: `Generate a photorealistic scene that completely fills a 1920×1080 frame. No borders or frames. Natural perspective and lighting.\n\nUser request: ${prompt}` },
  ];
  try {
    const resp = await callModel(MODEL_PRIMARY, parts);
    const out = preferInlineImage(resp);
    if (out) return out;
    throw new Error("No image returned from model");
  } catch (e: any) {
    const code = e?.error?.code || e?.response?.data?.error?.code;
    if (code === 429 && MODEL_FALLBACK) {
      const resp2 = await callModel(MODEL_FALLBACK, parts);
      const out2 = preferInlineImage(resp2);
      if (out2) return out2;
    }
    throw e;
  }
}
