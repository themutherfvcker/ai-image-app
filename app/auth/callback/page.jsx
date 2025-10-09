"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingView />}> 
      <CallbackInner />
    </Suspense>
  );
}

function LoadingView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-gray-900">Signing you in…</h1>
        <p className="mt-2 text-sm text-gray-600">Completing Google authentication.</p>
      </div>
    </div>
  );
}

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const finalize = async () => {
      try {
        const urlError = searchParams?.get("error_description") || searchParams?.get("error");
        if (urlError) {
          setError(urlError);
          return;
        }

        const { getSupabase } = await import("@/lib/supabaseClient");
        const supabase = getSupabase();
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError) {
          setError(exchangeError.message || "Authentication failed.");
          return;
        }

        // If a redirect target was explicitly requested in either sessionStorage or the querystring, honor it first
        try {
          const redir = sessionStorage.getItem('nb_redirect_after_auth')
          const qsNext = searchParams?.get('next') || ''
          const next = (qsNext && qsNext.startsWith('/')) ? qsNext : (redir || '')
          if (next) {
            sessionStorage.removeItem('nb_redirect_after_auth')
            // Use location.replace to avoid Next history quirks
            window.location.replace(next)
            return;
          }
        } catch {}

        // Attempt to resume a pending pricing action (checkout/subscription)
        try {
          const pendingRaw = sessionStorage.getItem("nb_pricing_pending");
          if (pendingRaw) {
            const pending = JSON.parse(pendingRaw);
            const { getSupabase } = await import("@/lib/supabaseClient");
            const supabase2 = getSupabase();
            const { data: { session } } = await supabase2.auth.getSession();
            const access = session?.access_token || "";
            if (access) {
              const hdrs = { "Content-Type": "application/json", Authorization: `Bearer ${access}` };
              const origin = window.location.origin;
              let resp;
              if (pending?.action === "subscription") {
                resp = await fetch("/api/subscription", {
                  method: "POST",
                  headers: hdrs,
                  body: JSON.stringify({
                    plan: pending?.plan || undefined,
                    success_url: `${origin}/success`,
                    cancel_url: `${origin}/cancel`,
                  }),
                });
              } else if (pending?.action === "credits") {
                resp = await fetch("/api/checkout", {
                  method: "POST",
                  headers: hdrs,
                  body: JSON.stringify({
                    success_url: `${origin}/success`,
                    cancel_url: `${origin}/cancel`,
                  }),
                });
              }
              if (resp) {
                const j = await resp.json().catch(() => ({}));
                if (resp.ok && j?.url) {
                  sessionStorage.removeItem("nb_pricing_pending");
                  window.location.href = j.url;
                  return;
                }
              }
              // If we couldn't start checkout, fall through to show pricing
              sessionStorage.removeItem("nb_pricing_pending");
            }
          }
        } catch {}

        // If this page is opened as a popup, notify opener and close
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: "NB_AUTH_COMPLETE" }, "*");
            window.close();
            return;
          }
        } catch {}

        // Fallback: navigate normally if not a popup
        setTimeout(() => {
          if (!isMounted) return;
          // Prefer returning to pricing if a pending action was set
          try {
            const hadPending = !!sessionStorage.getItem("nb_pricing_pending");
            if (hadPending) {
              router.replace("/#pricing");
              return;
            }
          } catch {}
          // Final fallback: return to the 16:9 page (app section)
          router.replace("/16-9-image-generator#app");
        }, 250);
      } catch (e) {
        setError(e?.message || "Authentication failed. Please try again.");
      }
    };

    finalize();
    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-gray-900">Signing you in…</h1>
        <p className="mt-2 text-sm text-gray-600">Completing Google authentication.</p>
        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}
      </div>
    </div>
  );
}

