"use server";

import { GoogleGenAI, Modality } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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

export async function editTo16x9(originalDataUrl: string, prompt: string): Promise<string> {
  const src = dataUrlToParts(originalDataUrl);
  const tmplDataUrl = await getBlank1920x1080DataUrl();
  const tmpl = dataUrlToParts(tmplDataUrl);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        { inlineData: { data: src.base64Data, mimeType: src.mimeType } },
        { inlineData: { data: tmpl.base64Data, mimeType: tmpl.mimeType } },
        { text: "Outpaint the first image into the second image's full 1920×1080 frame; fill all edges naturally, no borders or frames; preserve subject and lighting.\n\nUser request: " + prompt },
      ],
    },
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });

  const cand = (response as any)?.candidates?.[0];
  for (const part of cand?.content?.parts ?? []) {
    const anyPart = part as any;
    if (anyPart.inlineData?.mimeType?.startsWith("image/")) {
      const mime = anyPart.inlineData.mimeType;
      const data = anyPart.inlineData.data;
      return `data:${mime};base64,${data}`;
    }
  }

  const fallback = (response as any)?.generatedImages?.[0]?.image?.imageBytes;
  if (fallback) return `data:image/png;base64,${fallback}`;

  throw new Error("No image returned from model");
}
