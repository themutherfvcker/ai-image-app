/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"
import SignInModal from "@/app/components/SignInModal"
import UserNav from "@/app/components/UserNav"

const STYLE_CHIPS = [
  { label: "Photorealistic", text: "ultra realistic, natural lighting, 50mm lens, high detail" },
  { label: "Cinematic", text: "cinematic lighting, volumetric, dramatic shadows, 35mm film look" },
  { label: "Studio Portrait", text: "studio portrait, softbox lighting, sharp eyes, skin texture" },
  { label: "Fashion Editorial", text: "editorial fashion, clean backdrop, professional styling" },
  { label: "Moody", text: "moody, low-key lighting, high contrast, grain" },
  { label: "Vibrant", text: "vibrant colors, crisp detail, punchy contrast" },
]

const ASPECTS = [
  { k: "1:1",  w: 1024, h: 1024 },
  { k: "3:4",  w: 960,  h: 1280 },
  { k: "4:3",  w: 1280, h: 960  },
  { k: "16:9", w: 1536, h: 864  },
  { k: "9:16", w: 864,  h: 1536 },
]

export default function GeneratorPage() {
  const [balance, setBalance] = useState(null)
  const [activeTab, setActiveTab] = useState("text") // "text" | "image"

  // Generation inputs
  const [prompt, setPrompt] = useState("a cinematic banana astronaut on the moon, 35mm film look")
  const [aspect, setAspect] = useState("1:1")
  const [strength, setStrength] = useState(0.6) // only for image→image

  // UI state
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [resultUrl, setResultUrl] = useState("")
  const [history, setHistory] = useState([]) // [{url, at, prompt, mode, aspect}]
  const [showSignIn, setShowSignIn] = useState(false)

  // Upload state (image→image)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const dropRef = useRef(null)
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState("")

// Using build-time Tailwind via globals.css; removed AOS/CDN usage

  // Credits
  useEffect(() => {
    ;(async () => {
      try {
        const { getSupabase } = await import("@/lib/supabaseClient")
        const supabase = getSupabase()
        const { data: { session } } = await supabase.auth.getSession()
        const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
        const r = await fetch("/api/session", { cache: "no-store", headers })
        const j = await r.json()
        if (typeof j?.balance === "number") setBalance(j.balance)
      } catch {}
    })()
  }, [])

  // Cleanup preview URL
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  // Prefill from query params (e.g., /generator?tab=i2i&prompt=...)
  useEffect(() => {
    if (typeof window === "undefined") return
    // Restore any pending state saved before auth redirect
    try {
      const pending = sessionStorage.getItem("nb_pending_generate")
      if (pending) {
        const parsed = JSON.parse(pending)
        if (parsed?.activeTab === "image") setActiveTab("image")
        if (typeof parsed?.prompt === "string") setPrompt(parsed.prompt)
        if (typeof parsed?.imageDataUrl === "string" && parsed.imageDataUrl) {
          setPendingImageDataUrl(parsed.imageDataUrl)
          setPreviewUrl(parsed.imageDataUrl)
        }
        // we cannot restore the File object; this uses a data URL snapshot
        sessionStorage.removeItem("nb_pending_generate")
      }
    } catch {}
    const sp = new URLSearchParams(window.location.search)
    const tab = sp.get("tab") || ""
    const qp = sp.get("prompt") || ""
    if (tab === "i2i") setActiveTab("image")
    if (tab === "t2i") setActiveTab("text")
    if (qp) setPrompt(qp)
  }, [])

  // Close sign-in modal on successful auth; if we have pending image data URL, auto-generate
  useEffect(() => {
    const supabase = getSupabase()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setShowSignIn(false)
        if (pendingImageDataUrl && activeTab === "image" && prompt.trim()) {
          try {
            setBusy(true)
            setError("")
            setResultUrl("")
            const resp = await fetch("/api/vertex/edit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: prompt.trim(), imageDataUrl: pendingImageDataUrl, meta: { aspect, strength } }),
              cache: "no-store",
            })
            const j = await safeReadJson(resp)
            if (!resp.ok || !j?.ok) throw new Error(j?.error || `HTTP ${resp.status}`)
            setResultUrl(j.dataUrl || "")
            setBalance(typeof j.balance === "number" ? j.balance : balance)
            setHistory((h) => [{ url: j.dataUrl, at: Date.now(), prompt, mode: "image", aspect }, ...h].slice(0, 40))
          } catch (e) {
            setError(e?.message || "Generation failed")
          } finally {
            setBusy(false)
            setPendingImageDataUrl("")
          }
        }
      }
    })
    return () => subscription?.unsubscribe()
  }, [pendingImageDataUrl, activeTab, prompt, aspect, strength, balance])

  // Compression helper (JSON-safe)
  async function fileToDataUrlCompressed(file, maxDim = 1536, jpegQuality = 0.9) {
    const okTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!okTypes.includes(file.type)) throw new Error("Please upload PNG, JPG, or WEBP.")
    if (file.size > 10 * 1024 * 1024) throw new Error("Image is too large. Keep under ~10MB.")

    const blobUrl = URL.createObjectURL(file)
    const img = await new Promise((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error("Could not read image"))
      i.src = blobUrl
    })
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    const target = ASPECTS.find(a => a.k === aspect) || ASPECTS[0]
    const maxTarget = Math.max(target.w, target.h)
    const scale = Math.min(1, maxTarget / Math.max(w, h))
    const outW = Math.max(1, Math.round(w * scale))
    const outH = Math.max(1, Math.round(h * scale))

    const cvs = document.createElement("canvas")
    cvs.width = outW
    cvs.height = outH
    const ctx = cvs.getContext("2d")
    ctx.drawImage(img, 0, 0, outW, outH)
    const dataUrl = cvs.toDataURL("image/jpeg", jpegQuality)
    URL.revokeObjectURL(blobUrl)

    const approxBytes = Math.ceil((dataUrl.length - "data:image/jpeg;base64,".length) * 3 / 4)
    if (approxBytes > 5 * 1024 * 1024) {
      throw new Error("Compressed image still too big. Try a smaller image.")
    }
    return dataUrl
  }

  function setPreviewFile(file) {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }
  function clearPreview() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Drag & drop (only when image tab is active)
  useEffect(() => {
    if (activeTab !== "image") return
    const el = dropRef.current
    if (!el) return
    const onDrag = (e) => {
      e.preventDefault(); e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
      else if (e.type === "dragleave") setDragActive(false)
    }
    const onDrop = (e) => {
      e.preventDefault(); e.stopPropagation(); setDragActive(false)
      const f = e.dataTransfer?.files?.[0]; if (f) setPreviewFile(f)
    }
    el.addEventListener("dragenter", onDrag)
    el.addEventListener("dragover", onDrag)
    el.addEventListener("dragleave", onDrag)
    el.addEventListener("drop", onDrop)
    return () => {
      el.removeEventListener("dragenter", onDrag)
      el.removeEventListener("dragover", onDrag)
      el.removeEventListener("dragleave", onDrag)
      el.removeEventListener("drop", onDrop)
    }
  }, [activeTab, previewUrl])

  function applyChip(chipText) {
    if (!prompt || prompt === "a cinematic banana astronaut on the moon, 35mm film look") {
      setPrompt(chipText)
    } else {
      setPrompt(prev => `${prev.trim().replace(/\.$/, "")}. ${chipText}`)
    }
  }

  // ---- Robust JSON reader (fixes your error) ----
  async function safeReadJson(resp) {
    const raw = await resp.text(); // read once
    if (!raw) {
      // empty body — build a helpful message
      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status} ${resp.statusText} (empty body)`)
      }
      // ok + empty is also unexpected here
      throw new Error("Empty response from server")
    }
    try {
      return JSON.parse(raw)
    } catch {
      // Non-JSON (often an HTML error page). Trim preview so it’s readable.
      const preview = raw.slice(0, 300).replace(/\s+/g, " ")
      throw new Error(`Non-JSON from server (status ${resp.status}). Preview: ${preview}`)
    }
  }

  // Generate
  async function onGenerate() {
    // Require auth
    try {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Persist pending state so we can restore after auth
        try {
          let imageDataUrl = ""
          if (activeTab === "image") {
            const file = fileInputRef.current?.files?.[0] || null
            if (file) {
              try {
                imageDataUrl = await fileToDataUrlCompressed(file, 1536, 0.9)
              } catch {}
            }
          }
          sessionStorage.setItem("nb_pending_generate", JSON.stringify({ activeTab, prompt, imageDataUrl }))
        } catch {}
        setShowSignIn(true)
        return
      }
    } catch {}
    setBusy(true)
    setError("")
    setResultUrl("")
    try {
      if (!prompt.trim()) throw new Error("Please enter a prompt.")

      const meta = { aspect, strength }
      let resp
      if (activeTab === "image") {
        const file = fileInputRef.current?.files?.[0] || null
        if (!file) throw new Error("Please upload a reference image.")
        const imageDataUrl = await fileToDataUrlCompressed(file, 1536, 0.9)
        {
          const supabase = getSupabase()
          const { data: { session } } = await supabase.auth.getSession()
          const authHeaders = { "Content-Type": "application/json" }
          if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`
          resp = await fetch("/api/vertex/edit", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ prompt: prompt.trim(), imageDataUrl, meta }),
            cache: "no-store",
          })
        }
      } else {
        {
          const supabase = getSupabase()
          const { data: { session } } = await supabase.auth.getSession()
          const authHeaders = { "Content-Type": "application/json" }
          if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`
          resp = await fetch("/api/vertex/imagine", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ prompt: prompt.trim(), meta }),
            cache: "no-store",
          })
        }
      }

      if (resp.status === 401) { setShowSignIn(true); return }
      const j = await safeReadJson(resp)   // <--- use robust reader
      if (!resp.ok || !j?.ok) {
        throw new Error(j?.error || `HTTP ${resp.status}`)
      }
      setResultUrl(j.dataUrl || "")
      setBalance(typeof j.balance === "number" ? j.balance : balance)
      setHistory((h) => [{ url: j.dataUrl, at: Date.now(), prompt, mode: activeTab, aspect }, ...h].slice(0, 40))
    } catch (e) {
      setError(e?.message || "Generation failed")
    } finally {
      setBusy(false)
    }
  }

  const aspectHelp = "Aspect ratio hint (client-side). Your API may ignore it unless implemented server-side."

  function handleTryCase(tab, examplePrompt) {
    if (tab === "image") setActiveTab("image"); else setActiveTab("text");
    setPrompt(examplePrompt);
    try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* NAV (match homepage) */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex-shrink-0 flex items-center">
                  <img
                    className="h-8 w-auto"
                    src="https://nanobanana.ai/_next/image?url=%2Fbanana-decoration.png&w=640&q=75"
                    alt="Nano Banana"
                  />
                  <span className="ml-2 text-xl font-bold text-gray-900">Nano Banana</span>
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Link href="/generator" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500">Image Editor</Link>
                <Link href="/showcase" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Showcase</Link>
                <Link href="/#pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Pricing</Link>
                <Link href="/developers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">API</Link>
                <a href="#faq" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">FAQ</a>
                
                <Link href="/account" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Account</Link>
              </div>
              <div className="flex items-center">
                <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mr-3">
                  Credits: {balance ?? "—"}
                </div>
                <UserNav />
                <button
                  onClick={() => setShowSignIn(true)}
                  className="ml-1 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Try Now
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Title */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="lg:text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Nano Banana AI Image Generator by Google</h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-3xl lg:mx-auto">Edit images instantly with Google Nano Banana. The Nano Banana AI image generator makes it simple to transfer styles, add or remove objects, replace elements, or adjust gestures and expressions with just a prompt. Create seamless edits online using text or image instructions, powered by Gemini 2.5 Flash Image.</p>
            </div>
          </div>
        </section>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: controls */}
          <section className="lg:col-span-4">
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 space-y-5">
              {/* Tabs */}
              <div className="flex rounded-lg overflow-hidden border">
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium ${activeTab === "text" ? "bg-yellow-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("text")}
                >
                  Text → Image
                </button>
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium ${activeTab === "image" ? "bg-yellow-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                  onClick={() => setActiveTab("image")}
                >
                  Image → Image
                </button>
              </div>

              {/* Quick styles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Styles</h3>
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setPrompt("")}
                  >
                    Clear prompt
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STYLE_CHIPS.map((c) => (
                    <button
                      key={c.label}
                      type="button"
                      className="px-3 py-1.5 rounded-full text-xs font-medium border hover:bg-gray-50"
                      onClick={() => applyChip(c.text)}
                      title={c.text}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect + strength */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                    title={aspectHelp}
                  >
                    {ASPECTS.map((a) => (
                      <option key={a.k} value={a.k}>{a.k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Edit Strength {activeTab === "image" ? `(${strength.toFixed(2)})` : ""}
                  </label>
                  <input
                    type="range"
                    className="mt-2 w-full"
                    min={0} max={1} step={0.05}
                    disabled={activeTab !== "image"}
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    title="Lower = follow image more. Higher = follow prompt more."
                  />
                </div>
              </div>

              {/* Upload (image→image only) */}
              {activeTab === "image" && (
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Reference Image</h2>
                    <button className="text-xs text-gray-500 hover:text-gray-700" onClick={clearPreview}>Clear</button>
                  </div>

                  <div
                    ref={dropRef}
                    className={[
                      "rounded-md border-2 border-dashed",
                      dragActive ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-gray-50"
                    ].join(" ")}
                  >
                    <label htmlFor="file-input" className="cursor-pointer block">
                      <div className="px-6 py-6 text-center">
                        {previewUrl ? (
                          <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 rounded-md border" />
                        ) : null}
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium text-yellow-700 hover:text-yellow-800">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to ~10MB</p>
                      </div>
                    </label>
                    <input
                      id="file-input"
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) setPreviewFile(f)
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Prompt */}
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="mt-1 w-full rounded-md border-gray-300 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder={activeTab === "image" ? "Describe the edits you want to apply…" : "Describe the image you want to generate…"}
                />
              </div>

              <button
                onClick={onGenerate}
                disabled={busy}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60"
              >
                {busy ? "Generating…" : activeTab === "image" ? "Apply Edits (−1 credit)" : "Generate (−1 credit)"}
              </button>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <p className="text-xs text-gray-500">
                Aspect & strength are hints. Your API can read them from <code>meta</code> if implemented.
              </p>
            </div>
          </section>

          {/* Right: result & history */}
          <section className="lg:col-span-8 space-y-6">
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Result</h2>
                {resultUrl && (
                  <div className="flex gap-3">
                    <a
                      href={resultUrl}
                      download="nanobanana.png"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-black"
                    >
                      Download PNG
                    </a>
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                      onClick={() => setResultUrl("")}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {!resultUrl && (
                <div className="h-72 border rounded-md grid place-items-center text-gray-500">
                  {busy ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"></circle>
                        <path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75"></path>
                      </svg>
                      <span>Generating…</span>
                    </div>
                  ) : (
                    <span>Generated image will appear here</span>
                  )}
                </div>
              )}

              {resultUrl && (
                <div className="space-y-3">
                  <img src={resultUrl} alt="Result" className="w-full h-auto rounded-md border" />
                </div>
              )}
            </div>

            {/* Local history */}
            <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">History (local)</h2>
                {history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No history yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {history.map((h, i) => (
                    <button
                      key={i}
                      className="group border rounded-md overflow-hidden text-left"
                      onClick={() => setResultUrl(h.url)}
                      title={`${h.mode === "image" ? "Image→Image" : "Text→Image"} • ${h.aspect} • ${h.prompt}`}
                    >
                      <img src={h.url} alt="" className="w-full h-32 object-cover group-hover:opacity-90" />
                      <div className="p-2 text-[11px] text-gray-600 line-clamp-2">
                        <span className="mr-1 inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {h.mode === "image" ? "I→I" : "T→I"}
                        </span>
                        <span className="mr-1 inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                          {h.aspect}
                        </span>
                        {h.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* How it Works */}
        <section id="how-it-works" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">How it Works</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Edit with text, not layers</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Describe your edit and let Nano Banana handle the details. No masking or manual cutouts.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[{
                n: 1, t: "Choose a mode", d: "Start with Text→Image or upload a reference for Image→Image.",
              },{
                n: 2, t: "Describe your edit", d: "Type what you want changed. Add a style chip for a quick look.",
              },{
                n: 3, t: "Generate", d: "Get a result in seconds. Keep faces and scene details consistent.",
              }].map((s) => (
                <div key={s.n} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-6 sm:p-6">
                    <div className="text-yellow-700 font-semibold">Step {s.n}</div>
                    <h3 className="mt-1 text-lg font-medium text-gray-900">{s.t}</h3>
                    <p className="mt-2 text-sm text-gray-500">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Why Choose Nano Banana?</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Core Nano Banana Features</p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Natural-language editing with identity and scene preservation built-in.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Natural Language Editing", "Edit images using plain text prompts—no masks or layers required."],
                ["Character Consistency", "Maintain faces and details across edits and versions."],
                ["Scene Preservation", "Blend edits with the original background for realistic results."],
                ["One-Shot Editing", "High-quality results in a single pass for most edits."],
                ["Multi-Image Context", "Use references to guide style, identity, or scene."],
                ["Built for UGC", "Perfect for creators and marketers needing on-brand visuals."],
              ].map(([title, body]) => (
                <div key={title} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <p className="mt-3 text-sm text-gray-600">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Use Cases */}
        <section id="use-cases" className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-8">
              <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Popular Use Cases</h2>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">What people make with Nano Banana</p>
              <p className="mt-2 text-gray-600">Click “Try this” to prefill the editor instantly.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Remove Background", tab: "image", prompt: "Remove the background and place the subject on a clean white background." },
                { title: "Change Clothing Color", tab: "image", prompt: "Change the jacket to a deep navy blue while keeping fabric texture." },
                { title: "Product Ad", tab: "text", prompt: "A premium product photo on a marble countertop with soft morning light." },
                { title: "Portrait Cleanup", tab: "image", prompt: "Gently remove blemishes, even skin tone, keep pores and realistic texture." },
                { title: "Cinematic Scene", tab: "text", prompt: "A cinematic banana astronaut on the moon, 35mm film look, dramatic lighting." },
                { title: "Social Post", tab: "text", prompt: "High-contrast vibrant image with bold composition for social media." },
              ].map((c, i) => (
                <div key={i} className="bg-white rounded-xl shadow hover:shadow-lg transition">
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.prompt}</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => handleTryCase(c.tab, c.prompt)} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border hover:bg-gray-50">Try this</button>
                      <Link href={c.tab === "image" ? "/showcase/remove-background" : "/showcase"} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100">Learn more</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Help Center</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</p>
            </div>
            <div className="mt-10 max-w-3xl mx-auto">
              <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">Do I need any editing skills?</dt>
                  <dd className="mt-2 text-base text-gray-500">No. Just describe the change you want with plain English.</dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">Will it keep faces consistent?</dt>
                  <dd className="mt-2 text-base text-gray-500">Yes. Identity preservation is built into our pipeline.</dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">What formats do you support?</dt>
                  <dd className="mt-2 text-base text-gray-500">Upload PNG, JPG, or WEBP up to ~10MB.</dd>
                </div>
                <div>
                  <dt className="text-lg leading-6 font-medium text-gray-900">Can I use results commercially?</dt>
                  <dd className="mt-2 text-base text-gray-500">Yes—great for UGC, ads, and product visuals.</dd>
                </div>
              </dl>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  { "@type": "Question", "name": "Do I need any editing skills?", "acceptedAnswer": { "@type": "Answer", "text": "No. Just describe the change you want with plain English." } },
                  { "@type": "Question", "name": "Will it keep faces consistent?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Identity preservation is built into our pipeline." } },
                  { "@type": "Question", "name": "What formats do you support?", "acceptedAnswer": { "@type": "Answer", "text": "Upload PNG, JPG, or WEBP up to ~10MB." } },
                  { "@type": "Question", "name": "Can I use results commercially?", "acceptedAnswer": { "@type": "Answer", "text": "Yes—great for UGC, ads, and product visuals." } }
                ]
              }) }}
            />
          </div>
        </section>

        {/* Trust & CTA */}
        <section className="py-12 bg-yellow-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Ready to try Nano Banana?</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-yellow-100 sm:mt-4">Fast, consistent edits for creators and teams.</p>
            <div className="mt-8">
              <Link href="/pricing" className="inline-flex items-center px-6 py-3 rounded-md text-yellow-700 bg-white hover:bg-gray-50">Buy Credits</Link>
            </div>
          </div>
        </section>
      </div>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  )
}
