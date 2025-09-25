"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"

export default function UserNav() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [credits, setCredits] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    ;(async () => {
      try {
        const r = await fetch("/api/session", { cache: "no-store" })
        const j = await r.json()
        if (typeof j?.balance === "number") setCredits(j.balance)
      } catch {}
    })()
  }, [user])

  useEffect(() => {
    function onClick(e) {
      if (!menuOpen) return
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    window.addEventListener("click", onClick)
    return () => window.removeEventListener("click", onClick)
  }, [menuOpen])

  if (!user) return null

  const initials = (user.user_metadata?.full_name || user.email || "U").trim().slice(0, 1).toUpperCase()

  return (
    <div className="ml-3 relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="inline-flex items-center gap-2 px-2 py-1 rounded-full border hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold">
          {initials}
        </span>
        {typeof credits === "number" && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{credits}</span>
        )}
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1 z-50">
          <Link href="/account" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Account</Link>
          <Link href="/pricing" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Buy credits</Link>
          <button
            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={async () => {
              try {
                const supabase = getSupabase()
                await supabase.auth.signOut({ scope: 'global' })
                setMenuOpen(false)
                setUser(null)
                try { window.dispatchEvent(new Event('storage')) } catch {}
              } catch {}
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

