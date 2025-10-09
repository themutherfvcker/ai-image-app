"use client"

import { useEffect, useRef, useCallback } from "react"
import { getSupabase } from "@/lib/supabaseClient"

export default function ClientFrame() {
  const iframeRef = useRef(null)

  const postToChild = useCallback((message) => {
    try {
      const w = iframeRef.current?.contentWindow
      if (!w) return
      w.postMessage(message, window.location.origin)
    } catch {}
  }, [])

  useEffect(() => {
    const onMsg = async (e) => {
      if (e.origin !== window.location.origin) return
      const type = e?.data?.type
      if (!type) return

      if (type === 'NB169_UPLOAD_CLICKED') {
        try { sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app') } catch {}
        const supabase = getSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          const baseUrl = window.location.origin
          const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent('/16-9-image-generator#app')}`
          await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
          return
        }
        // If already authenticated, do NOT send NB169_OPEN_UPLOAD here because the user
        // has already initiated the picker via their click; sending it would cause
        // a double-open (close then reopen) behavior on some browsers.
      }

      if (type === 'NB169_CHILD_READY') {
        let shouldAuto = false
        try { shouldAuto = (sessionStorage.getItem('nb_redirect_after_auth') || '') !== '' } catch {}
        // Also honor a URL hint ?auto=1
        try {
          const sp = new URLSearchParams(window.location.search)
          if (sp.get('auto') === '1') shouldAuto = true
        } catch {}
        if (shouldAuto) {
          postToChild({ type: 'NB169_OPEN_UPLOAD' })
          try { sessionStorage.removeItem('nb_redirect_after_auth') } catch {}
          // Remove auto=1 from URL to avoid repeated auto-open on reloads
          try {
            const url = new URL(window.location.href)
            url.searchParams.delete('auto')
            window.history.replaceState(null, '', url.toString())
          } catch {}
        }
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [postToChild])

  return (
    <iframe
      ref={iframeRef}
      src={process.env.NEXT_PUBLIC_169_APP_URL || "/nb169-app/index.html"}
      className="w-full h-full border-0"
      loading="eager"
      title="16:9 Image Generator"
    />
  )
}
