"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import UserNav from "@/app/components/UserNav"
import { getSupabase } from "@/lib/supabaseClient"

export default function Navbar() {
  const [isAuthed, setIsAuthed] = useState(false)

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

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
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
            <Link href="/pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-yellow-500">Pricing</Link>
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
    </nav>
  )
}

