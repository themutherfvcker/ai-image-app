"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function SixteenNinePage() {
  const [mode, setMode] = useState("generate") // generate | convert
  const [file, setFile] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [outUrl, setOutUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { getSupabase } = await import("@/lib/supabaseClient")
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthed(!!user)
      } catch {}
    })()
  }, [])

  async function onRun() {
    setLoading(true); setError(""); setOutUrl("")
    try {
      const fd = new FormData()
      fd.append("mode", mode)
      fd.append("ratio", "16:9")
      if (prompt) fd.append("prompt", prompt)
      if (mode === "convert" && file) fd.append("file", file)
      const r = await fetch("/api/nb169", { method: "POST", body: fd })
      const j = await r.json()
      if (!r.ok || !j?.url) throw new Error(j?.error || `HTTP ${r.status}`)
      setOutUrl(j.url)
    } catch (e) {
      setError(e?.message || "Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">16:9 Image Creator</h1>
        <p className="text-gray-600">Generate 16:9 images or convert any image to 16:9 with composition-aware framing.</p>
      </header>

      <div className="flex gap-2">
        <button className={`px-4 py-2 rounded-md border ${mode === 'generate' ? 'bg-yellow-600 text-white border-yellow-600' : ''}`} onClick={() => setMode('generate')}>Generate 16:9</button>
        <button className={`px-4 py-2 rounded-md border ${mode === 'convert' ? 'bg-yellow-600 text-white border-yellow-600' : ''}`} onClick={() => setMode('convert')}>Convert to 16:9</button>
      </div>

      <section className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload (optional for Generate, required for Convert)</label>
          <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt (optional)</label>
          <textarea className="w-full border rounded-md p-3" placeholder="e.g., cinematic portrait, shallow depth of field, clean background" value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRun} disabled={loading || (mode==='convert' && !file)} className="px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60">
            {loading ? "Processing…" : (mode === 'generate' ? 'Generate 16:9' : 'Convert to 16:9')}
          </button>
          {!isAuthed && <Link href="/account" className="text-sm text-yellow-700 underline">Sign in</Link>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {outUrl && (
          <div className="pt-4">
            <img src={outUrl} alt="result" className="w-full rounded-lg border" />
            <div className="flex gap-3 pt-3">
              <a className="underline" href={outUrl} download>Download</a>
              <Link className="underline" href="/#pricing">Need more credits?</Link>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why 16:9 matters</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>YouTube thumbnails & hero banners</li>
          <li>Website headers & presentation covers</li>
          <li>Social video covers</li>
        </ul>
      </section>
    </main>
  )
}

