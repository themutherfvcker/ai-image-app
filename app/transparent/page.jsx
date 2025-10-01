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
    </main>
  )
}

