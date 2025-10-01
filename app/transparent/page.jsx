"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function TransparentToolsPage() {
  const [url, setUrl] = useState("")
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState("")
  const iframeRef = useRef(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_TRANSPARENT_APP_URL || "/transparent-app/index.html"
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const u = new URL(base)
      u.searchParams.set('embedded', '1')
      if (origin) u.searchParams.set('origin', origin)
      setUrl(u.toString())
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
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) setAccessToken(session.access_token)
      } catch {}
      setLoading(false)
    })()
  }, [])

  // Send token to iframe after load (if app listens for it)
  useEffect(() => {
    if (!accessToken) return
    const el = iframeRef.current
    if (!el) return
    const onLoad = () => {
      try {
        el.contentWindow?.postMessage({ type: 'NB_AUTH', accessToken }, '*')
      } catch {}
    }
    el.addEventListener('load', onLoad)
    return () => el.removeEventListener('load', onLoad)
  }, [accessToken])

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

  // Append token in hash to avoid server logs capturing it
  const iframeSrc = accessToken ? `${url}#access_token=${encodeURIComponent(accessToken)}` : url

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Transparent Image Tools</h1>
          <p className="text-sm text-gray-600">Embedded external app. Your data stays within that app.</p>
        </div>
        <div className="aspect-video w-full">
          <iframe ref={iframeRef} src={iframeSrc} title="Transparent Image Generator" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer" />
        </div>
        <div className="px-4 py-3 border-t text-sm text-gray-600">
          Having trouble? <a className="text-yellow-700 hover:text-yellow-800 underline" href={url || "/transparent-app/index.html"} target="_blank" rel="noopener noreferrer">Open in a new tab</a>.
        </div>
      </div>
    </main>
  )
}

