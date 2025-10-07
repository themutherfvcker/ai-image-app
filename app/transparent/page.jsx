"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function TransparentToolsPage() {
  const [url, setUrl] = useState("")
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [html, setHtml] = useState("")
  const [loadErr, setLoadErr] = useState("")
  const containerRef = useRef(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_TRANSPARENT_APP_URL || "/transparent-app/index.html"
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const u = new URL(base, origin)
      u.searchParams.set('embedded', '1')
      setUrl(u.pathname + u.search)
    } catch {
      setUrl(base)
    }
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthed(!!user)
      } catch {}
      setLoading(false)
    })()
  }, [])

  // Load and inject the built app HTML (frameless)
  useEffect(() => {
    let cancelled = false
    if (!isAuthed || !url) return
    ;(async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (!cancelled) setHtml(text)
      } catch (e) {
        if (!cancelled) setLoadErr("Transparent app is not deployed at /public/transparent-app/. Run the sync workflow or copy the build.")
      }
    })()
    return () => { cancelled = true }
  }, [isAuthed, url])

  useEffect(() => {
    if (!html || !containerRef.current) return
    const host = containerRef.current
    // Clear existing
    while (host.firstChild) host.removeChild(host.firstChild)
    // Parse HTML and execute scripts
    const temp = document.createElement('div')
    temp.innerHTML = html
    const scripts = Array.from(temp.querySelectorAll('script'))
    scripts.forEach(s => s.parentNode?.removeChild(s))
    host.innerHTML = temp.innerHTML
    scripts.forEach(old => {
      const s = document.createElement('script')
      if (old.src) s.src = old.src
      if (old.type) s.type = old.type
      for (const attr of old.attributes) {
        if (attr.name !== 'src' && attr.name !== 'type') s.setAttribute(attr.name, attr.value)
      }
      if (old.textContent) s.textContent = old.textContent
      host.appendChild(s)
    })
  }, [html])

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center text-gray-600">Loading…</div>
      </main>
    )
  }

  if (!isAuthed) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to use Transparent Tools</h1>
          <p className="mt-2 text-gray-600">Generate transparent images and palettes.</p>
          <div className="mt-6">
            <Link href="/account" className="inline-flex items-center px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700">Sign in</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white overflow-hidden">
        <div className="lg:text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Transparent Image Tools</h1>
          <p className="mt-1 text-gray-600">Runs directly on this page. Requires auth.</p>
        </div>
        {loadErr ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            {loadErr}
          </div>
        ) : (
          <div ref={containerRef} className="w-full min-h-[70vh]" />
        )}
      </div>

      {/* Transparent FAQ */}
      <section id="transparent-faq" className="mt-12 bg-white rounded-lg shadow-sm p-6">
        <div className="lg:text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Transparent – Background Remover FAQ</h2>
          <p className="mt-1 text-gray-600">Answers to common questions about transparent PNGs and workflow.</p>
        </div>
        <div className="grid gap-3">
          {[ 
            { q: "What is Transparent?", a: "A background‑removal service that exports clean PNGs with transparency for ecommerce and design." },
            { q: "Which files work best?", a: "High‑resolution PNG/JPG with clear subject/background separation. Avoid heavy compression artifacts." },
            { q: "Does it keep hair and fine edges?", a: "Yes—edge handling is optimized for hair, fur, and semi‑transparent regions where possible." },
            { q: "How do I download a transparent PNG?", a: "Generate, then choose PNG export. The checkerboard preview denotes transparency." },
            { q: "Commercial usage?", a: "Yes—exports can be used commercially subject to our Terms and your rights to the input image." },
            { q: "File limits?", a: "See the upload UI for current size limits (commonly up to 10 MB per image)." },
            { q: "Tips for best cut‑outs?", a: "Use images with contrast between subject and background; prompt with context like ‘keep hair wisps’." },
            { q: "Troubleshooting halos?", a: "Try generating at higher resolution or refine the prompt to clarify edge treatment and background color spill." }
          ].map(({ q, a }) => (
            <details key={q} className="rounded-xl border border-slate-200 bg-white p-4 [&_summary]:cursor-pointer">
              <summary className="text-lg font-semibold text-slate-900" id={q.replace(/\s+/g, '-').toLowerCase()}>{q}</summary>
              <div className="mt-2 text-slate-700 leading-relaxed">{a}</div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": "https://www.nanobanana-ai.dev/transparent#faq",
          isPartOf: { "@id": "https://www.nanobanana-ai.dev/#website" },
          about: { "@id": "https://www.nanobanana-ai.dev/#app" },
          mainEntity: [
            { "@type": "Question", name: "What is Transparent?", acceptedAnswer: { "@type": "Answer", text: "A background‑removal service that exports clean PNGs with transparency for ecommerce and design." }},
            { "@type": "Question", name: "Which files work best?", acceptedAnswer: { "@type": "Answer", text: "High‑resolution PNG/JPG with clear subject/background separation. Avoid heavy compression artifacts." }},
            { "@type": "Question", name: "Does it keep hair and fine edges?", acceptedAnswer: { "@type": "Answer", text: "Yes—edge handling is optimized for hair, fur, and semi‑transparent regions where possible." }},
            { "@type": "Question", name: "How do I download a transparent PNG?", acceptedAnswer: { "@type": "Answer", text: "Generate, then choose PNG export. The checkerboard preview denotes transparency." }},
            { "@type": "Question", name: "Commercial usage?", acceptedAnswer: { "@type": "Answer", text: "Yes—exports can be used commercially subject to our Terms and your rights to the input image." }},
            { "@type": "Question", name: "File limits?", acceptedAnswer: { "@type": "Answer", text: "See the upload UI for current size limits (commonly up to 10 MB per image)." }},
            { "@type": "Question", name: "Tips for best cut‑outs?", acceptedAnswer: { "@type": "Answer", text: "Use images with contrast between subject and background; prompt with context like ‘keep hair wisps’." }},
            { "@type": "Question", name: "Troubleshooting halos?", acceptedAnswer: { "@type": "Answer", text: "Try generating at higher resolution or refine the prompt to clarify edge treatment and background color spill." }}
          ]
        }) }}
      />
    </main>
  )
}

