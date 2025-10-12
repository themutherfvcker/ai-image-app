"use client";

import React from "react";
import NextImage from "next/image";

async function editImageAndEnforceAspectRatio(imageDataUrl: string, prompt: string): Promise<string> {
  const res = await fetch("/api/ratio16/edit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ imageDataUrl, prompt }),
  });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 429) {
      const ra = Number(res.headers.get("Retry-After") || 30);
      throw new Error(`The image service is rate-limited. Try again in ~${ra}s.`);
    }
    throw new Error(json?.error || "Failed to edit image");
  }
  return json.imageDataUrl as string;
}

type State = {
  file?: File;
  srcDataUrl?: string;
  outDataUrl?: string;
  prompt: string;
  busy: boolean;
  error?: string;
  retryAfter?: number;
};

export default function HomeBannerTool() {
  const [s, setS] = React.useState<State>({
    prompt:
      "Extend background naturally to fill 1920×1080. Keep subject centered. No borders or frames.",
    busy: false,
  });

  const toDataUrlMax = React.useCallback(async (file: File, maxSide = 2048) => {
    const url = URL.createObjectURL(file);
    const img = document.createElement('img') as HTMLImageElement;
    img.src = url;
    await new Promise<void>((ok, err) => {
      img.onload = () => ok();
      img.onerror = () => err(new Error("Could not load image"));
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    if (scale === 1) {
      const buf = await file.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
      return `data:${file.type};base64,${b64}`;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  const onFile = async (f: File) => {
    try {
      const dataUrl = await toDataUrlMax(f, 2048);
      setS((p) => ({ ...p, file: f, srcDataUrl: dataUrl, outDataUrl: undefined, error: undefined }));
    } catch (e: any) {
      setS((p) => ({ ...p, error: e?.message || "Failed to read image" }));
    }
  };

  const onGenerate = async () => {
    if (!s.srcDataUrl) return;
    setS((p) => ({ ...p, busy: true, error: undefined, retryAfter: undefined }));
    try {
      const out = await editImageAndEnforceAspectRatio(s.srcDataUrl, s.prompt);
      setS((p) => ({ ...p, outDataUrl: out, busy: false }));
    } catch (e: any) {
      const msg = e?.message || "Failed to edit image";
      const m = msg.match(/(~?(\d+))s/);
      const retry = m ? Number(m[2]) : undefined;
      setS((p) => ({ ...p, error: msg, busy: false, retryAfter: retry }));
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/40 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <label className="block text-sm font-medium text-zinc-300">
            Upload an image (we’ll outpaint to 1920×1080)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            className="mt-2 block w-full cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 py-2 text-sm text-zinc-200"
          />
        </div>
        <button
          onClick={onGenerate}
          disabled={!s.srcDataUrl || s.busy}
          className="mt-3 inline-flex items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-600/80 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 md:mt-0"
          title={!s.srcDataUrl ? "Upload an image first" : "Generate 16:9"}
        >
          {s.busy ? "Generating…" : "Create 16:9"}
        </button>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-zinc-300">Prompt (optional)</label>
        <textarea
          className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-800/60 p-3 text-sm text-zinc-200"
          rows={3}
          value={s.prompt}
          onChange={(e) => setS((p) => ({ ...p, prompt: e.target.value }))}
        />
      </div>

      {s.error && (
        <div className="mt-3 rounded-lg border border-red-400/30 bg-red-900/20 p-3 text-sm text-red-200">
          {s.error}
          {typeof s.retryAfter === "number" && s.retryAfter > 0 && (
            <span className="ml-2 opacity-80">Try again in ~{s.retryAfter}s.</span>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-3">
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">Original</div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800/60 ring-1 ring-inset ring-zinc-700/20">
            {s.srcDataUrl ? (
              <NextImage
                src={s.srcDataUrl}
                alt="Original"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                Upload an image
              </div>
            )}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-3">
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
            16:9 Result (1920×1080)
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800/60 ring-1 ring-inset ring-zinc-700/20">
            {s.outDataUrl ? (
              <NextImage
                src={s.outDataUrl}
                alt="Result"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-500">
                Click “Create 16:9”
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-400">
        Secure: processed server-side; no borders or stretching—true 1920×1080.
      </p>
    </div>
  );
}
