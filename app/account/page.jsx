"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"
import SignInModal from "@/app/components/SignInModal"
import { getSupabase } from "@/lib/supabaseClient"

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")
  const [balance, setBalance] = useState(null)
  const [plan, setPlan] = useState("—")
  const [ledgers, setLedgers] = useState([])
  const [jobs, setJobs] = useState([])
  const [isAuthed, setIsAuthed] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [pageL, setPageL] = useState(1)
  const [hasMoreL, setHasMoreL] = useState(false)
  const [pageJ, setPageJ] = useState(1)
  const [hasMoreJ, setHasMoreJ] = useState(false)

  useEffect(() => {
    // Track auth state for rendering
    try {
      const supabase = getSupabase()
      supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data?.user))
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
        setIsAuthed(!!session?.user)
      })
      return () => subscription?.unsubscribe()
    } catch {}
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const supabase = getSupabase()
        const { data: { session } } = await supabase.auth.getSession()
        const access = session?.access_token || ""
        if (!access) {
          // Not authenticated: do NOT show cookie-based data
          setErr("Please sign in to view your account.")
          setLedgers([])
          setJobs([])
          setBalance(null)
          setPlan("free")
          return
        }

        const headers = { Authorization: `Bearer ${access}` }
        // Normalize cookie to canonical id and load data for auth user only
        await fetch("/api/session", { cache: "no-store", headers })
        const [ledgerRes, jobsRes] = await Promise.all([
          fetch(`/api/ledger?page=1&pageSize=10`, { cache: "no-store", headers }),
          fetch(`/api/jobs?page=1&pageSize=12`, { cache: "no-store", headers }),
        ])
        const lj = await ledgerRes.json()
        const jj = await jobsRes.json()
        if (!ledgerRes.ok || !lj?.ok) throw new Error(lj?.error || "Failed to load ledger")
        setBalance(lj.user?.credits ?? null)
        setPlan(lj.user?.plan || "free")
        setLedgers(lj.ledgers || [])
        setPageL(1); setHasMoreL(!!lj?.hasMore)
        if (jobsRes.ok && jj?.ok) {
          setJobs(jj.jobs || [])
          setPageJ(1); setHasMoreJ(!!jj?.hasMore)
        }
      } catch (e) {
        setErr(e?.message || "Failed to load account")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function loadMoreLedgers() {
    try {
      const { getSupabase } = await import("@/lib/supabaseClient")
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
      const next = pageL + 1
      const r = await fetch(`/api/ledger?page=${next}&pageSize=10`, { cache: "no-store", headers })
      const j = await r.json()
      if (r.ok && j?.ok) {
        setLedgers(prev => [...prev, ...(j.ledgers || [])])
        setPageL(next); setHasMoreL(!!j?.hasMore)
      }
    } catch {}
  }

  async function loadMoreJobs() {
    try {
      const { getSupabase } = await import("@/lib/supabaseClient")
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
      const next = pageJ + 1
      const r = await fetch(`/api/jobs?page=${next}&pageSize=12`, { cache: "no-store", headers })
      const j = await r.json()
      if (r.ok && j?.ok) {
        setJobs(prev => [...prev, ...(j.jobs || [])])
        setPageJ(next); setHasMoreJ(!!j?.hasMore)
      }
    } catch {}
  }

  async function goCheckout() {
    try {
      const r = await fetch("/api/checkout?credits=100", { method: "GET" })
      const j = await r.json()
      if (j?.url) window.location.href = j.url
    } catch {}
  }

  async function openPortal() {
    try {
      const r = await fetch("/api/billing-portal", { method: "POST" })
      const j = await r.json()
      if (j?.url) window.location.href = j.url
    } catch {}
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow-sm rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Sign in to view your account</h1>
            <p className="mt-2 text-gray-600">Check your credits, history, and subscription details.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  try { sessionStorage.setItem('nb_redirect_after_auth', '/account') } catch {}
                  setShowSignIn(true)
                }}
                className="inline-flex items-center px-4 py-2 rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
              >
                Sign in
              </button>
            </div>
            {err && <div className="mt-4 text-sm text-red-600">{err}</div>}
          </div>
        </main>
        <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Profile & Billing */}
        <section className="lg:col-span-4 space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-5">
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-600 mt-1">Signed in via uid cookie session.</p>
            <div className="mt-3 text-sm text-gray-700 flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Plan: {plan}</span>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Credits</h2>
              <div className="flex items-center gap-2">
                <div className={`text-sm px-3 py-1 rounded-full ${typeof balance === 'number' && balance < 5 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{balance ?? "—"}</div>
                <button onClick={() => window.location.reload()} className="text-xs text-gray-600 hover:text-gray-800 underline">Refresh</button>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={goCheckout} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-yellow-600 text-white hover:bg-yellow-700">Add 100 credits</button>
              <button onClick={openPortal} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border hover:bg-gray-50">Manage subscription</button>
            </div>
            <p className="text-xs text-gray-500">Payments powered by Stripe.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-5">
            <h2 className="text-base font-semibold text-gray-900">Credit history</h2>
            {ledgers.length === 0 ? (
              <p className="text-sm text-gray-500 mt-2">No usage yet.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm">
                {ledgers.map((l, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <div className="text-gray-700">
                      <span className="mr-2 inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700">{l.reason}</span>
                      <span className="text-gray-500">{new Date(l.createdAt).toLocaleString()}</span>
                    </div>
                    <div className={l.delta < 0 ? "text-red-600" : "text-green-700"}>{l.delta > 0 ? `+${l.delta}` : l.delta}</div>
                  </li>
                ))}
              </ul>
            )}
            {hasMoreL && (
              <div className="mt-3">
                <button onClick={loadMoreLedgers} className="text-sm text-yellow-700 hover:text-yellow-800 underline">Load more</button>
              </div>
            )}
          </div>
        </section>

        {/* Right: Recent generations */}
        <section className="lg:col-span-8">
          <div className="bg-white shadow-sm rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Recent generations</h2>
              <Link href="/generator" className="text-sm text-yellow-700 hover:text-yellow-800">Open editor</Link>
            </div>

            {loading ? (
              <div className="h-48 grid place-items-center text-gray-500">Loading…</div>
            ) : err ? (
              <div className="text-sm text-red-600">{err}</div>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-gray-500">No jobs yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((j) => (
                  <div key={j.id} className="border rounded-md p-3">
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span>{new Date(j.createdAt).toLocaleString()}</span>
                      <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{j.mode === 'image' ? 'I→I' : 'T→I'}</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-800 line-clamp-3" title={j.prompt}>{j.prompt}</div>
                    <div className="mt-2 text-xs text-gray-500">{j.latencyMs} ms • {j.success ? 'ok' : 'failed'}</div>
                  </div>
                ))}
              </div>
            )}
            {hasMoreJ && (
              <div className="mt-3">
                <button onClick={loadMoreJobs} className="text-sm text-yellow-700 hover:text-yellow-800 underline">Load more</button>
              </div>
            )}
          </div>
        </section>
      </main>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </div>
  )
}

