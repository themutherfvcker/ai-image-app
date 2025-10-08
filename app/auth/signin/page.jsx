"use client"
import { useEffect, useState } from "react"
import SignInModal from "@/app/components/SignInModal"
import Link from "next/link"

export default function SignInPage() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    // If a redirect target wasn't set already, default to returning to the 16:9 app upload window
    try {
      const existing = sessionStorage.getItem('nb_redirect_after_auth')
      if (!existing) sessionStorage.setItem('nb_redirect_after_auth', '/16-9-image-generator#app')
    } catch {}
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign in to continue</h1>
        <p className="mt-2 text-gray-600">After you sign in, we’ll take you back to the 16:9 upload window.</p>
        <div className="mt-6">
          <button onClick={() => setOpen(true)} className="inline-flex items-center px-5 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700">Open sign in</button>
        </div>
        <div className="mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 underline">Back to home</Link>
        </div>
      </div>
      <SignInModal open={open} onClose={() => setOpen(false)} />
    </main>
  )
}

