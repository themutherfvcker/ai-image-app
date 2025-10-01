"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function TransparentToolsPage() {
  const [url, setUrl] = useState("")
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = process.env.NEXT_PUBLIC_TRANSPARENT_APP_URL || "https://transparent.nanobanana-ai.dev"
    setUrl(u)
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
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Transparent Image Tools</h1>
          <p className="text-sm text-gray-600">Embedded external app. Your data stays within that app.</p>
        </div>
        <div className="aspect-video w-full">
          <iframe src={url} title="Transparent Image Generator" className="w-full h-full" loading="lazy" referrerPolicy="no-referrer" />
        </div>
      </div>
    </main>
  )
}

