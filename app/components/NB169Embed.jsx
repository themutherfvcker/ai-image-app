"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import SignInModal from "@/app/components/SignInModal"
import { getSupabase } from "@/lib/supabaseClient"

export default function NB169Embed() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSignIn, setShowSignIn] = useState(false)
  const [overlayActive, setOverlayActive] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      try {
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        setIsAuthed(!!user)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
          setIsAuthed(!!session?.user)
          if (session?.user) {
            setOverlayActive(false)
            // If user came here intending to upload, try to ask the app to open upload
            try {
              const flag = sessionStorage.getItem('nb_169_open_upload_after_auth')
              if (flag === '1') {
                sessionStorage.removeItem('nb_169_open_upload_after_auth')
                requestOpenUpload()
              }
            } catch {}
          }
        })
        return () => subscription?.unsubscribe()
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Prefer env; fall back to public deployment
  const appSrc = (typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_169_APP_URL || "https://nano-banana-16-9-image-creator.vercel.app/") : "https://nano-banana-16-9-image-creator.vercel.app/")

  // After auth, attempt to notify the iframe to open its upload dialog.
  function requestOpenUpload() {
    try {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      win.postMessage({ type: 'NB169_OPEN_UPLOAD' }, '*')
      // Note: if the embed doesn't implement this listener, nothing happens. That's OK.
    } catch {}
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh] grid place-items-center text-gray-600">
        Loading…
      </div>
    )
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden h-[70vh] md:h-[75vh]">
      {/* The app itself */}
      <iframe ref={iframeRef} src={appSrc} className="w-full h-full border-0" loading="eager" title="16:9 Image Generator" />

      {/* Click-capture overlay when not authed */}
      {!isAuthed && (
        <button
          type="button"
          onClick={() => {
            setOverlayActive(true)
            try { sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app'); sessionStorage.setItem('nb_169_open_upload_after_auth', '1') } catch {}
            setShowSignIn(true)
          }}
          className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center"
          aria-label="Sign in to upload"
        >
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-gray-900">Sign in to upload an image</h3>
            <p className="mt-2 text-gray-700">We’ll bring you right back to the upload window after you finish signing in.</p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="inline-flex items-center px-5 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700">Sign in</span>
              <Link href="/pricing" className="inline-flex items-center px-5 py-2 rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200">Buy credits</Link>
            </div>
            <p className="mt-2 text-xs text-gray-500">If the upload dialog doesn’t open automatically after login, click “Upload” again.</p>
          </div>
        </button>
      )}

      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  )
}

