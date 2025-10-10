"use server";

import { GoogleGenAI, Modality } from "@google/genai";
// If you prefer a file in /public/ratio16/blank-1920x1080.png, you can
// swap this inline data URL with an fs.readFile as needed.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Inline 1x1 black PNG; small but sufficient as a target cue for 16:9.
// The model doesn't require the template to be 1920x1080; it's just a target.
const ONE_BY_ONE_BLACK = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9U4gq/0AAAAASUVORK5CYII=";
async function getBlank1920x1080DataUrl() {
  return `data:image/png;base64,${ONE_BY_ONE_BLACK}`;
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
        { text: prompt },
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
