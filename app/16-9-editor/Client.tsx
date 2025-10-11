"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

type ActiveTab = "imageToImage" | "textToImage";

interface HistoryItem { prompt: string; imageSrc: string }

export default function Client() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("imageToImage");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultI2IPrompt = useMemo(() => (
    "Please perform an outpainting task. Using the first image as the source content, extend its scene, style, and lighting to completely fill the blank canvas provided in the second image. The final result should be a single, seamless, and cohesive 16:9 image. Do not add borders or frames."
  ), []);

  const onChooseFile = useCallback(() => {
    try { inputRef.current?.showPicker?.() } catch { inputRef.current?.click() }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const buf = await file.arrayBuffer();
    const b64 = typeof window !== "undefined" ? btoa(String.fromCharCode(...new Uint8Array(buf))) : "";
    const dataUrl = `data:${file.type};base64,${b64}`;
    setOriginalImage(dataUrl);
    setEditedImage(null);
    setError(null);
    setPrompt(defaultI2IPrompt);
    setHistory([]);
  }, [defaultI2IPrompt]);

  const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    if (f) await handleImageUpload(f);
    // reset to allow reselect same file
    e.currentTarget.value = "";
  }, [handleImageUpload]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) { setError("Please enter a prompt."); return }
    if (activeTab === 'imageToImage' && !originalImage) { setError('Please upload an image for image-to-image generation.'); return }

    setIsLoading(true); setError(null); setEditedImage(null);
    try {
      let out: string = "";
      if (activeTab === 'imageToImage') {
        const res = await fetch('/api/ratio16/edit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ imageDataUrl: originalImage, prompt }) });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 429) {
            const ra = Number(res.headers.get('Retry-After') || 30);
            throw new Error(`The image service is rate-limited. Try again in ~${ra}s.`);
          }
          throw new Error(j?.error || 'Failed to edit image');
        }
        out = j.imageDataUrl as string;
      } else {
        const res = await fetch('/api/ratio16/text', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ prompt }) });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 429) {
            const ra = Number(res.headers.get('Retry-After') || 30);
            throw new Error(`The image service is rate-limited. Try again in ~${ra}s.`);
          }
          throw new Error(j?.error || 'Failed to generate image');
        }
        out = j.imageDataUrl as string;
      }
      setEditedImage(out);
      setHistory((h) => [{ prompt, imageSrc: out }, ...h]);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, originalImage, prompt]);

  const handleUseAsInput = useCallback(() => {
    if (!editedImage) return;
    setActiveTab('imageToImage');
    setOriginalImage(editedImage);
    setEditedImage(null);
    setPrompt(defaultI2IPrompt);
    setError(null);
  }, [editedImage, defaultI2IPrompt]);

  const handleDownload = useCallback(() => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    const mimeType = editedImage.substring(editedImage.indexOf(':') + 1, editedImage.indexOf(';'));
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `generated-image-${Date.now()}.${extension}`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }, [editedImage]);

  const handleReset = useCallback(() => {
    setOriginalImage(null); setEditedImage(null); setPrompt(""); setError(null); setIsLoading(false); setHistory([]); setActiveTab('imageToImage');
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="flex flex-col">
        <div className="flex">
          <button onClick={() => { setActiveTab('imageToImage'); setEditedImage(null); setError(null); setPrompt(defaultI2IPrompt); }} className={`px-6 py-3 text-md font-semibold ${activeTab==='imageToImage'?'bg-gray-800 text-white':'bg-gray-200 text-gray-700'}`}>Image to Image</button>
          <button onClick={() => { setActiveTab('textToImage'); setEditedImage(null); setError(null); setPrompt(''); }} className={`px-6 py-3 text-md font-semibold ${activeTab==='textToImage'?'bg-gray-800 text-white':'bg-gray-200 text-gray-700'}`}>Text to Image</button>
        </div>
        <div className="bg-white rounded-b-2xl p-6 shadow flex flex-col space-y-6 flex-grow border">
          {activeTab === 'imageToImage' && (
            <div>
              {!originalImage ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="mb-3 text-gray-600">Upload an image to convert to 16:9</p>
                  <button onClick={onChooseFile} className="px-4 py-2 rounded-md bg-yellow-500 text-white">Choose File</button>
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Image</h3>
                  <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                    <img src={originalImage} alt="Original" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prompt</label>
            <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={4} className="w-full rounded-md border-gray-300 focus:ring-yellow-500 focus:border-yellow-500" placeholder={activeTab==='textToImage'?"A photorealistic image of a futuristic city...":"e.g., make the sky a vibrant sunset"}/>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button disabled={isLoading || !prompt.trim() || (activeTab==='imageToImage' && !originalImage)} onClick={handleGenerate} className="px-4 py-2 rounded-md bg-yellow-600 text-white disabled:opacity-50">
              {isLoading ? 'Generating…' : 'Generate 16:9 Image'}
            </button>
            <button disabled={isLoading} onClick={handleReset} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800">Start Over</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-center min-h-[400px] border">
        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
          {isLoading && <div className="text-gray-600">Editing your image…</div>}
          {error && <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-md text-center w-full">{error}</div>}
          {!isLoading && !error && editedImage && (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full rounded-lg overflow-hidden bg-black aspect-video">
                <img src={editedImage} alt="Generated" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={handleUseAsInput} className="px-4 py-2 rounded-md border border-gray-300">Use This Image as Input</button>
                <button onClick={handleDownload} className="px-4 py-2 rounded-md bg-yellow-600 text-white">Download Image</button>
              </div>
            </div>
          )}
          {!isLoading && !error && !editedImage && (
            <div className="text-gray-500 text-center">Your 16:9 generated image will appear here.</div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Editing History</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {history.map((h, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border">
                <div className="rounded-md overflow-hidden bg-black aspect-video mb-2">
                  <img src={h.imageSrc} alt={`History ${i+1}`} className="w-full h-full object-contain" />
                </div>
                <div className="text-sm text-gray-700">{h.prompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
