"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function AccountPage() {
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState("")
  const [balance, setBalance] = useState(null)
  const [plan, setPlan] = useState("—")
  const [ledgers, setLedgers] = useState([])
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        // Ensure uid cookie and get balance
        await fetch("/api/session", { cache: "no-store" })
        const [ledgerRes, jobsRes] = await Promise.all([
          fetch("/api/ledger", { cache: "no-store" }),
          fetch("/api/jobs", { cache: "no-store" }),
        ])
        const lj = await ledgerRes.json()
        const jj = await jobsRes.json()
        if (lj?.ok) {
          setBalance(lj.user?.credits ?? null)
          setPlan(lj.user?.plan || "free")
          setLedgers(lj.ledgers || [])
        } else {
          throw new Error(lj?.error || "Failed to load ledger")
        }
        if (jj?.ok) setJobs(jj.jobs || [])
      } catch (e) {
        setErr(e?.message || "Failed to load account")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img className="h-8 w-auto" src="/banana-decoration.png" alt="Nano Banana" />
            <Link href="/" className="text-lg font-semibold text-gray-900">Nano Banana</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600">Account</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/generator" className="text-sm text-gray-700 hover:text-gray-900">Generator</Link>
            <Link href="/pricing" className="text-sm text-gray-700 hover:text-gray-900">Pricing</Link>
          </div>
        </div>
      </header>

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
              <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">{balance ?? "—"}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={goCheckout} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-yellow-600 text-white hover:bg-yellow-700">Add 100 credits</button>
              <button onClick={openPortal} className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border hover:bg-gray-50">Manage subscription</button>
            </div>
            <p className="text-xs text-gray-500">Payments powered by Stripe.</p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-5">
            <h2 className="text-base font-semibold text-gray-900">Usage (last 10)</h2>
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
          </div>
        </section>
      </main>
    </div>
  )
}

