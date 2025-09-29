"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getSupabase } from "@/lib/supabaseClient"
import SignInModal from "@/app/components/SignInModal"

export default function PricingSection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState("subscription") // "credits" | "subscription"
  const [showSignIn, setShowSignIn] = useState(false)

  async function createSubscription(planKey) {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    const authHeaders = { "Content-Type": "application/json" }
    if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`
    const r = await fetch("/api/subscription", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        success_url: `${location.origin}/success`,
        cancel_url: `${location.origin}/cancel`,
        plan: planKey ? String(planKey || "").toUpperCase() : undefined,
      }),
    })
    const j = await r.json()
    if (!r.ok || !j?.url) throw new Error(j?.error || `HTTP ${r.status}`)
    window.location.href = j.url
  }

  async function createCheckout() {
    const supabase = getSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    const authHeaders = { "Content-Type": "application/json" }
    if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        success_url: `${location.origin}/success`,
        cancel_url: `${location.origin}/cancel`,
      }),
    })
    const j = await r.json()
    if (!r.ok || !j?.url) throw new Error(j?.error || `HTTP ${r.status}`)
    window.location.href = j.url
  }

  async function onSubscribe() {
    setLoading(true)
    setError("")
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        try { sessionStorage.setItem("nb_pricing_pending", JSON.stringify({ action: "subscription" })) } catch {}
        setShowSignIn(true)
        return
      }
      await createSubscription()
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  async function onBuy() {
    setLoading(true)
    setError("")
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        try { sessionStorage.setItem("nb_pricing_pending", JSON.stringify({ action: "credits" })) } catch {}
        setShowSignIn(true)
        return
      }
      await createCheckout()
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  async function onSubscribePlan(planKey) {
    setLoading(true)
    setError("")
    try {
      const supabase = getSupabase()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        try { sessionStorage.setItem("nb_pricing_pending", JSON.stringify({ action: "subscription", plan: String(planKey || "").toUpperCase() })) } catch {}
        setShowSignIn(true)
        return
      }
      await createSubscription(planKey)
    } catch (e) {
      setError(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const supabase = getSupabase()
    const resume = async () => {
      try {
        const raw = sessionStorage.getItem("nb_pricing_pending")
        if (!raw) return
        const pending = JSON.parse(raw)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        sessionStorage.removeItem("nb_pricing_pending")
        setShowSignIn(false)
        setLoading(true)
        if (pending?.action === "subscription") await createSubscription(pending?.plan)
        else if (pending?.action === "credits") await createCheckout()
      } catch {} finally { setLoading(false) }
    }
    resume()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => { if (session?.user) resume() })
    return () => subscription?.unsubscribe()
  }, [])

  return (
    <section id="pricing" className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-yellow-600 font-semibold tracking-wide uppercase">Plans</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Choose Your Nano Banana AI Image Generation Plan</p>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 lg:mx-auto">Start generating instantly. Credits never expire. Upgrade anytime.</p>
        </div>

        <div className="flex justify-center mt-8 mb-6">
          <div className="inline-flex rounded-full border bg-white p-1">
            <button onClick={() => setMode("credits")} className={`px-4 py-2 text-sm font-medium rounded-full ${mode === "credits" ? "bg-yellow-600 text-white" : "text-gray-700"}`}>Credits</button>
            <button onClick={() => setMode("subscription")} className={`px-4 py-2 text-sm font-medium rounded-full ${mode === "subscription" ? "bg-yellow-600 text-white" : "text-gray-700"}`}>Subscription</button>
          </div>
        </div>

        {mode === "credits" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div id="pricing-credits-100" className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h3 className="text-2xl font-bold">Starter</h3>
              <p className="text-gray-500 mt-1">For testing and light use</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$5<span className="text-2xl align-top ml-1">AUD</span></div>
                <div className="text-gray-500 mt-1">100 credits</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {["1 credit per generate","Fast queue","Email support","Commercial use"].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button onClick={onBuy} disabled={loading} className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60">{loading ? "Redirecting…" : "Buy 100 credits ($5)"}</button>
              {error && <p className="mt-3 text-sm text-red-600">Error: {error}</p>}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div id="pricing-basic" className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h3 className="text-2xl font-bold">Basic</h3>
              <p className="text-gray-500 mt-1">Great for getting started</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$8.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Personal use</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {["100 monthly credits included","Up to 50 high‑quality images per month","Access to all style templates","Standard generation speed","Basic email support","JPG and PNG downloads","Unused credits roll over to next billing cycle"].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button onClick={() => onSubscribePlan('BASIC')} disabled={loading} className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60">{loading ? "Redirecting…" : "Subscribe $8.99/mo"}</button>
            </div>

            <div id="pricing-standard" className="relative bg-white rounded-2xl shadow p-8 border ring-1 ring-yellow-300 flex flex-col h-full">
              <div className="absolute -top-3 right-6"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">Most Popular</span></div>
              <h3 className="text-2xl font-bold">Standard</h3>
              <p className="text-gray-500 mt-1">For regular creators</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$27.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Priority features</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {["400 monthly credits included","Up to 250 high‑quality images per month","All style templates + advanced controls","Priority generation speed","Standard support (email + queue)","JPG and PNG downloads","Unused credits roll over to next billing cycle"].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button onClick={() => onSubscribePlan('STANDARD')} disabled={loading} className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60">{loading ? "Redirecting…" : "Subscribe $27.99/mo"}</button>
            </div>

            <div id="pricing-premium" className="bg-white rounded-2xl shadow p-8 border flex flex-col h-full">
              <h3 className="text-2xl font-bold">Premium</h3>
              <p className="text-gray-500 mt-1">For teams and power users</p>
              <div className="mt-6">
                <div className="text-5xl font-extrabold">$77.99<span className="text-2xl align-top ml-1">/mo</span></div>
                <div className="text-gray-500 mt-1">Best value</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-gray-700 flex-1 min-h-[220px]">
                {["1200 monthly credits included","Up to 800 high‑quality images per month","All templates + premium features & team seats","Top‑priority generation speed","Priority support (fast response)","JPG and PNG downloads","Unused credits roll over to next billing cycle"].map((t) => (
                  <li key={t} className="flex items-center"><svg className="h-4 w-4 text-yellow-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>{t}</li>
                ))}
              </ul>
              <button onClick={() => onSubscribePlan('PREMIUM')} disabled={loading} className="mt-auto w-full inline-flex items-center justify-center px-4 py-3 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60">{loading ? "Redirecting…" : "Subscribe $77.99/mo"}</button>
            </div>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-500">Taxes/VAT may apply at checkout. Payments are processed by Stripe.</p>
      </div>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </section>
  )
}

