"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import UserNav from "@/app/components/UserNav"
import { getSupabase } from "@/lib/supabaseClient"

export default function Navbar() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const firstFocusRef = useRef(null)

  useEffect(() => {
    try {
      const supabase = getSupabase()
      supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data?.user))
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
        setIsAuthed(!!session?.user)
      })
      return () => subscription?.unsubscribe()
    } catch {
      // ignore
    }
  }, [])

  // Close on route change (best-effort)
  useEffect(() => {
    const onHash = () => setOpen(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Focus trap for mobile drawer
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    try { firstFocusRef.current?.focus() } catch {}
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      try { prev && prev.focus && prev.focus() } catch {}
    }
  }, [open])

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="mr-2 inline-flex items-center justify-center sm:hidden p-2 rounded-md border text-gray-700 hover:bg-gray-50"
              aria-label="Open menu"
              aria-expanded={open ? 'true' : 'false'}
              onClick={() => setOpen(true)}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <Link href="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="https://nanobanana.ai/_next/image?url=%2Fbanana-decoration.png&w=640&q=75"
                alt="Nano Banana"
              />
              <span className="ml-2 text-xl font-bold text-gray-900">Nano Banana</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/generator" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Image Editor</Link>
            <Link href="/showcase" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Showcase</Link>
            <Link href="/#pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Pricing</Link>
            <Link href="/16-9-image-generator" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">16:9 Image Generator</Link>
            <Link href="/transparent" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Transparent</Link>
            <Link href="/developers" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">API</Link>
            <Link href="/toolbox" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Toolbox</Link>
            <Link href="/account" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500">Account</Link>
          </div>
          <div className="flex items-center">
            <UserNav />
            {!isAuthed && (
              <Link
                href="/generator"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Try Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="sm:hidden">
          <div className="fixed inset-0 bg-black/40" aria-hidden onClick={() => setOpen(false)} />
          <div ref={panelRef} role="dialog" aria-modal="true" className="fixed inset-y-0 left-0 w-80 max-w-[85%] bg-white shadow-xl safe-area flex flex-col">
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <span className="text-lg font-semibold">Menu</span>
              <button ref={firstFocusRef} className="p-2 rounded-md border text-gray-700 hover:bg-gray-50" onClick={() => setOpen(false)} aria-label="Close menu">
                <svg className="h-5 w-5" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <nav className="p-4 space-y-1">
              <Link onClick={() => setOpen(false)} href="/generator" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Image Editor</Link>
              <Link onClick={() => setOpen(false)} href="/showcase" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Showcase</Link>
              <Link onClick={() => setOpen(false)} href="/#pricing" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Pricing</Link>
              <Link onClick={() => setOpen(false)} href="/16-9-image-generator" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">16:9 Image Generator</Link>
              <Link onClick={() => setOpen(false)} href="/transparent" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Transparent</Link>
              <Link onClick={() => setOpen(false)} href="/developers" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">API</Link>
              <Link onClick={() => setOpen(false)} href="/toolbox" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Toolbox</Link>
              <Link onClick={() => setOpen(false)} href="/account" className="block px-3 py-3 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50">Account</Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}

