"use client"
import { useEffect, useRef, useState } from "react"
import { getSupabase } from "@/lib/supabaseClient"

export default function NB169Embed() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
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

  function getChildOrigin() {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : 'https://www.nanobanana-ai.dev'
      return new URL(appSrc, base).origin
    } catch {
      return '*'
    }
  }

  // After auth, attempt to notify the iframe to open its upload dialog.
  function requestOpenUpload() {
    try {
      const win = iframeRef.current?.contentWindow
      if (!win) return
      const targetOrigin = getChildOrigin()
      win.postMessage({ type: 'NB169_OPEN_UPLOAD' }, targetOrigin)
      // Note: if the embed doesn't implement this listener, nothing happens. That's OK.
    } catch {}
  }

  // Listen for upload intent coming from the iframe and route to /auth/signin if unauthenticated
  useEffect(() => {
    function onMessage(e) {
      const type = e?.data?.type || e?.data
      const expectedOrigin = getChildOrigin()
      const fromIframe = e.source === iframeRef.current?.contentWindow
      const originOk = expectedOrigin === '*' || e.origin === expectedOrigin
      if (!fromIframe || !originOk) return

      if (type === 'NB169_UPLOAD_CLICKED' || type === 'NB169_REQUIRE_AUTH') {
        if (!isAuthed) {
          try {
            sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app')
            sessionStorage.setItem('nb_169_open_upload_after_auth', '1')
          } catch {}
          window.location.href = '/auth/signin'
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [isAuthed])

  function handleIframeFocus() {
    if (!isAuthed) {
      try {
        sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app')
        sessionStorage.setItem('nb_169_open_upload_after_auth', '1')
      } catch {}
      // No overlay — just route to sign-in
      window.location.href = '/auth/signin'
    }
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
      <iframe ref={iframeRef} src={appSrc} className="w-full h-full border-0" loading="eager" title="16:9 Image Generator" onFocus={handleIframeFocus} />
    </div>
  )
}

