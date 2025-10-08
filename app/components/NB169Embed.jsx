"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import SignInModal from "@/app/components/SignInModal"
import { getSupabase } from "@/lib/supabaseClient"

export default function NB169Embed() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSignIn, setShowSignIn] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthed(!!user)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
          setIsAuthed(!!session?.user)
        })
        return () => subscription?.unsubscribe()
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const appSrc = (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_169_APP_URL || "https://nano-banana-16-9-image-creator.vercel.app/") : "https://nano-banana-16-9-image-creator.vercel.app/")

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh] grid place-items-center text-gray-600">
        Loading…
      </div>
    )
  }

  if (!isAuthed) {
    return (
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[60vh] md:h-[65vh] grid place-items-center text-center p-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Sign in to use the 16:9 Image Generator</h3>
          <p className="mt-2 text-gray-600 max-w-prose mx-auto">You will be returned here to the upload window after login.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => { try { sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app') } catch {}; setShowSignIn(true) }}
              className="inline-flex items-center justify-center px-6 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
            >
              Sign in
            </button>
            <Link href="/pricing" className="inline-flex items-center justify-center px-6 py-2 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200">Buy credits</Link>
          </div>
        </div>
        <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh]">
      <iframe src={appSrc} className="w-full h-full border-0" loading="eager" title="16:9 Image Generator" />
    </div>
  )
}

