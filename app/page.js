"use client";
// page has a server shell; client islands are used where needed

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { getSupabase } from "@/lib/supabaseClient";
import SignInModal from "@/app/components/SignInModal";
import JsonLdRaw from "@/app/components/JsonLdRaw";
import PricingSection from "@/app/components/PricingSection";

function BeforeAfter({ beforeSrc, afterSrc, altBefore, altAfter }) {
  const containerRef = useRef(null);
  const [percent, setPercent] = useState(50);
  const [beforeSource, setBeforeSource] = useState(beforeSrc);
  const [afterSource, setAfterSource] = useState(afterSrc);

  function clamp(v) { return Math.max(0, Math.min(100, v)); }

  function setFromX(clientX) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    setPercent(clamp((x / rect.width) * 100));
  }

  function onPointerDown(e) {
    e.preventDefault();
    const move = (ev) => setFromX(ev.clientX ?? ev.touches?.[0]?.clientX ?? 0);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowLeft") setPercent((p) => clamp(p - 5));
    if (e.key === "ArrowRight") setPercent((p) => clamp(p + 5));
  }

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl shadow before-after" style={{ aspectRatio: "16/9" }}>
      {/* Labels */}
      <div className="absolute top-3 left-3 z-10">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500 text-white shadow">After</span>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-900 text-white/90 shadow">Before</span>
      </div>
      <img
        src={beforeSource}
        alt={altBefore}
        loading="lazy"
        decoding="async"
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => setBeforeSource("https://picsum.photos/seed/nb-before/1600/900")}
      />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${percent}%` }}>
        <img
          src={afterSource}
          alt={altAfter}
          loading="lazy"
          decoding="async"
          sizes="100vw"
          className="w-full h-full object-cover"
          onError={() => setAfterSource("https://picsum.photos/seed/nb-after/1600/900")}
        />
      </div>
      <button
        type="button"
        className="absolute top-1/2 left-[var(--x,50%)] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center border"
        style={{ left: `calc(${percent}% )` }}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label="Reveal after image"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none" className="text-gray-700">
          <path d="M8 12h8M10 9l-3 3 3 3M14 15l3-3-3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

function ExamplesSection() {
  function tryExample(tab, prompt) {
    const u = new URL(location.origin + "/generator")
    u.searchParams.set("tab", tab)
    u.searchParams.set("prompt", prompt)
    window.location.href = u.toString()
  }

  const EXAMPLE_ITEMS = [
    {
      slug: "change-background",
      title: "Change background",
      desc: "Replace the background while keeping the subject intact.",
      tab: "i2i",
      prompt: "Replace the background with a clean studio backdrop.",
      beforeFile: "change-background-before.jpeg",
      afterFile: "change-background-after.png",
    },
    {
      slug: "change-clothing-color",
      title: "Change clothing color",
      desc: "Recolor garments without losing texture.",
      tab: "i2i",
      prompt: "Change the jacket to a deep navy blue while keeping fabric texture.",
      beforeFile: "change-clothing-color-before.jpeg",
      afterFile: "change-clothing-color-after.png",
    },
    {
      slug: "change-product",
      title: "Product retouching",
      desc: "Adjust product color/background for cleaner presentation.",
      tab: "i2i",
      prompt: "Refine the product color and set on a neutral, soft-lit background.",
      beforeFile: "change-product-before.jpg",
      afterFile: "change-product-after.png",
    },
    {
      slug: "bedroom",
      title: "Room staging",
      desc: "Enhance interior look with balanced tones and cleanup.",
      tab: "i2i",
      prompt: "Stage the bedroom with bright, cozy tones and clean lines.",
      beforeFile: "Bedroom-before.png",
      afterFile: "Bedroom-after.png",
    },
    {
      slug: "add-person",
      title: "Add a person",
      desc: "Composite a new person into the scene naturally.",
      tab: "i2i",
      prompt: "Add a person standing next to the subject with matching lighting.",
      beforeFile: "add-person-before1.jpeg",
      afterFile: "add-person-after1.jpeg",
    },
    {
      slug: "outfit-cleanup",
      title: "Outfit cleanup",
      desc: "Tidy clothing and remove distractions from the outfit.",
      tab: "i2i",
      prompt: "Clean up the outfit and remove distracting elements while keeping texture.",
      beforeFile: "remove-clothing-before.jpeg",
      afterFile: "remove-clothing-after.png",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-8">
          <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">See real Nano Banana edits</h2>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">Nano Banana - Before and after examples</p>
          <p className="mt-2 text-gray-600">Move the handle to compare. Click “Try this” to prefill the editor.</p>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {EXAMPLE_ITEMS.map((c, i) => {
            const before = c.beforeFile ? `/examples/${c.beforeFile}` : `/examples/${c.slug}-before.jpg`;
            const after = c.afterFile ? `/examples/${c.afterFile}` : `/examples/${c.slug}-after.jpg`;
            return (
            <div key={i} className="bg-white rounded-xl shadow hover:shadow-lg transition">
              <BeforeAfter beforeSrc={before} afterSrc={after} altBefore={`${c.title} before`} altAfter={`${c.title} after`} />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{c.desc}</p>
                <button onClick={() => tryExample(c.tab, c.prompt)} className="mt-3 inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border hover:bg-gray-50">
                  Try this
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Presets and aspect ratios for the generator UI (client-side hints)
const STYLE_CHIPS = [
  { label: "Photorealistic", text: "ultra realistic, natural lighting, 50mm lens, high detail" },
  { label: "Cinematic", text: "cinematic lighting, volumetric, dramatic shadows, 35mm film look" },
  { label: "Studio Portrait", text: "studio portrait, softbox lighting, sharp eyes, skin texture" },
  { label: "Fashion Editorial", text: "editorial fashion, clean backdrop, professional styling" },
  { label: "Moody", text: "moody, low-key lighting, high contrast, grain" },
  { label: "Vibrant", text: "vibrant colors, crisp detail, punchy contrast" },
];

const ASPECTS = [
  { k: "1:1",  w: 1024, h: 1024 },
  { k: "3:4",  w: 960,  h: 1280 },
  { k: "4:3",  w: 1280, h: 960  },
  { k: "16:9", w: 1536, h: 864  },
  { k: "9:16", w: 864,  h: 1536 },
];

function HomeGeneratorSection({ showSignIn, onShowSignIn }) {
  const [activeTab, setActiveTab] = useState("i2i");
  const [t2iPrompt, setT2iPrompt] = useState("");
  const [i2iPrompt, setI2iPrompt] = useState("");
  const [i2iFile, setI2iFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isAuthed, setIsAuthed] = useState(false);
  const [pendingImageDataUrl, setPendingImageDataUrl] = useState("");
  const uploadInputRef = useRef(null);
  const router = useRouter();
  // Added advanced controls + local history
  const [aspect, setAspect] = useState("1:1");
  const [strength, setStrength] = useState(0.6);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchBalance();
  }, []);

  // After the user authenticates (Google/Email), close modal and (if pending) auto-generate
  useEffect(() => {
    const supabase = getSupabase();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session?.user);
      if (session?.user) {
        onShowSignIn(false);
        // Resume pending generate if any
        try {
          const raw = sessionStorage.getItem("nb_home_pending_generate");
          if (raw) {
            const pending = JSON.parse(raw);
            if (pending?.tab === "i2i") {
              setActiveTab("i2i");
              if (typeof pending.prompt === "string") setI2iPrompt(pending.prompt);
              if (typeof pending.imageDataUrl === "string" && pending.imageDataUrl) {
                setPendingImageDataUrl(pending.imageDataUrl);
                setPreviewUrl(pending.imageDataUrl);
                // Auto-generate using JSON endpoint
                (async () => {
                  try {
                    setLoading(true);
                    setError("");
                    setResultUrl(null);
                    const { data: { session: sess } } = await supabase.auth.getSession();
                    const authHeaders = { "Content-Type": "application/json" };
                    if (sess?.access_token) authHeaders["Authorization"] = `Bearer ${sess.access_token}`;
                    const resp = await fetch("/api/vertex/edit", {
                      method: "POST",
                      headers: authHeaders,
                      body: JSON.stringify({ prompt: pending.prompt || "", imageDataUrl: pending.imageDataUrl })
                    });
                    const data = await resp.json();
                    if (!resp.ok || !data?.ok) throw new Error(data?.error || `HTTP ${resp.status}`);
                    setResultUrl(data.dataUrl);
                    fetchBalance();
                  } catch (e) {
                    setError(e?.message || "Failed to generate image.");
                  } finally {
                    setLoading(false);
                    setPendingImageDataUrl("");
                    sessionStorage.removeItem("nb_home_pending_generate");
                  }
                })();
              }
            } else if (pending?.tab === "t2i") {
              setActiveTab("t2i");
              if (typeof pending.prompt === "string") setT2iPrompt(pending.prompt);
              (async () => {
                try {
                  setLoading(true);
                  setError("");
                  setResultUrl(null);
                  const { data: { session: sess } } = await supabase.auth.getSession();
                  const authHeaders = { "Content-Type": "application/json" };
                  if (sess?.access_token) authHeaders["Authorization"] = `Bearer ${sess.access_token}`;
                  const resp = await fetch("/api/vertex/imagine", {
                    method: "POST",
                    headers: authHeaders,
                    body: JSON.stringify({ prompt: pending.prompt || "" })
                  });
                  const data = await resp.json();
                  if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`);
                  setResultUrl(data.dataUrl);
                  fetchBalance();
                } catch (e) {
                  setError(e?.message || "Failed to generate image.");
                } finally {
                  setLoading(false);
                  sessionStorage.removeItem("nb_home_pending_generate");
                }
              })();
            }
          }
          // If user asked to upload before auth, trigger file picker now
          const ask = sessionStorage.getItem("nb_home_ask_upload");
          if (ask === '1') {
            sessionStorage.removeItem("nb_home_ask_upload");
            setActiveTab("i2i");
            setTimeout(() => { try { uploadInputRef.current?.click(); } catch {} }, 250);
          }
        } catch {}
      }
    });
    return () => subscription?.unsubscribe();
  }, [router]);

  // Also handle popup auth completion message to ensure upload opens
  useEffect(() => {
    function onMessage(e) {
      if (!e?.data || e.data.type !== 'NB_AUTH_COMPLETE') return;
      try {
        onShowSignIn(false);
        const ask = sessionStorage.getItem('nb_home_ask_upload');
        if (ask === '1') {
          sessionStorage.removeItem('nb_home_ask_upload');
          setActiveTab('i2i');
          setTimeout(() => { try { uploadInputRef.current?.click(); } catch {} }, 250);
        }
      } catch {}
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onShowSignIn]);

  // On mount after redirect: if already authenticated, resume pending
  useEffect(() => {
    (async () => {
      try {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const raw = sessionStorage.getItem("nb_home_pending_generate");
        if (!raw) return;
        const pending = JSON.parse(raw);
        if (pending?.tab === "i2i") {
          setActiveTab("i2i");
          if (typeof pending.prompt === "string") setI2iPrompt(pending.prompt);
          if (typeof pending.imageDataUrl === "string" && pending.imageDataUrl) {
            setPendingImageDataUrl(pending.imageDataUrl);
            setPreviewUrl(pending.imageDataUrl);
            setLoading(true);
            setError("");
            setResultUrl(null);
            try {
                      const { data: { session: sess } } = await supabase.auth.getSession();
                      const authHeaders = { "Content-Type": "application/json" };
                      if (sess?.access_token) authHeaders["Authorization"] = `Bearer ${sess.access_token}`;
                      const resp = await fetch("/api/vertex/edit", {
                        method: "POST",
                        headers: authHeaders,
                        body: JSON.stringify({ prompt: pending.prompt || "", imageDataUrl: pending.imageDataUrl })
                      });
              const data = await resp.json();
              if (!resp.ok || !data?.ok) throw new Error(data?.error || `HTTP ${resp.status}`);
              setResultUrl(data.dataUrl);
              fetchBalance();
            } catch (e) {
              setError(e?.message || "Failed to generate image.");
            } finally {
              setLoading(false);
              setPendingImageDataUrl("");
              sessionStorage.removeItem("nb_home_pending_generate");
            }
          }
        } else if (pending?.tab === "t2i") {
          setActiveTab("t2i");
          if (typeof pending.prompt === "string") setT2iPrompt(pending.prompt);
          setLoading(true);
          setError("");
          setResultUrl(null);
          try {
                    const { data: { session: sess } } = await supabase.auth.getSession();
                    const authHeaders = { "Content-Type": "application/json" };
                    if (sess?.access_token) authHeaders["Authorization"] = `Bearer ${sess.access_token}`;
                    const resp = await fetch("/api/vertex/imagine", {
                      method: "POST",
                      headers: authHeaders,
                      body: JSON.stringify({ prompt: pending.prompt || "" })
                    });
            const data = await resp.json();
            if (!resp.ok) throw new Error(data?.error || `HTTP ${resp.status}`);
            setResultUrl(data.dataUrl);
            fetchBalance();
          } catch (e) {
            setError(e?.message || "Failed to generate image.");
          } finally {
            setLoading(false);
            sessionStorage.removeItem("nb_home_pending_generate");
          }
        }
      } catch {}
    })();
  }, []);

  // Helper: read file as data URL (basic; no compression)
  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(new Error("Could not read image"));
      r.readAsDataURL(file);
    });
  }

  const fetchBalance = async () => {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {};
      const r = await fetch("/api/session", { cache: "no-store", headers });
      const j = await r.json();
      if (typeof j?.balance === "number") setBalance(j.balance);
    } catch (e) {
      console.error("Error fetching balance:", e.message);
      setBalance(0);
    }
  };

  const handleGenerate = async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Save pending state and open sign-in
      try {
        if (activeTab === "t2i") {
          sessionStorage.setItem("nb_home_pending_generate", JSON.stringify({ tab: "t2i", prompt: t2iPrompt }));
        } else {
          let imageDataUrl = "";
          if (i2iFile) {
            try { imageDataUrl = String(await fileToDataUrl(i2iFile)); } catch {}
          }
          sessionStorage.setItem("nb_home_pending_generate", JSON.stringify({ tab: "i2i", prompt: i2iPrompt, imageDataUrl }));
        }
      } catch {}
      onShowSignIn(true);
      return;
    }

    setError("");
    setResultUrl(null);
    setLoading(true);

    try {
      let response;
      if (activeTab === "t2i") {
        if (!t2iPrompt) { setError("Please enter a prompt."); return; }
        {
          const supabase = getSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          const authHeaders = { "Content-Type": "application/json" };
          if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`;
          response = await fetch("/api/vertex/imagine", {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({ prompt: t2iPrompt }),
          });
        }
      } else {
        if (!i2iFile) { setError("Please choose an image."); return; }
        if (!i2iPrompt) { setError("Please enter an edit prompt."); return; }

        const formData = new FormData();
        formData.append("prompt", i2iPrompt);
        formData.append("image", i2iFile);

        {
          const supabase = getSupabase();
          const { data: { session } } = await supabase.auth.getSession();
          const authHeaders = {};
          if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`;
          response = await fetch("/api/vertex/edit", {
            method: "POST",
            headers: authHeaders,
            body: formData,
          });
        }
      }

      if (response.status === 401) { onShowSignIn(true); return; }
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || "Failed to generate image."); }

      setResultUrl(data.dataUrl);
      // Update local history
      try {
        const entry = {
          url: data.dataUrl,
          at: Date.now(),
          mode: activeTab,
          aspect,
          prompt: activeTab === "t2i" ? t2iPrompt : i2iPrompt,
        };
        setHistory((h) => [entry, ...h].slice(0, 24));
      } catch {}
      fetchBalance(); // Refresh balance after generation
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Revoke preview URL on unmount/change to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Listen for “Try this” examples to prefill editor state
  useEffect(() => {
    function onTry(e) {
      const { tab, prompt } = e.detail || {};
      if (tab === "i2i") setActiveTab("i2i"); else if (tab === "t2i") setActiveTab("t2i");
      if (typeof prompt === "string") {
        if (tab === "i2i") setI2iPrompt(prompt); else setT2iPrompt(prompt);
      }
    }
    window.addEventListener("nb-try-example", onTry);
    return () => window.removeEventListener("nb-try-example", onTry);
  }, []);

  async function startSubscription() {
    try {
      const supabase = getSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders = { "Content-Type": "application/json" };
      if (session?.access_token) authHeaders["Authorization"] = `Bearer ${session.access_token}`;
      const res = await fetch("/api/subscription", { method: "POST", headers: authHeaders, body: JSON.stringify({}) });
      const j = await res.json();
      if (res.status === 401) { onShowSignIn(true); return; }
      if (res.ok && j?.url) window.location.href = j.url;
      else throw new Error(j?.error || "Subscription failed");
    } catch (e) {
      setError(e?.message || "Subscription failed");
    }
  }

  async function handleUploadClick(e) {
    try {
      const supabase = getSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        sessionStorage.setItem("nb_home_ask_upload", '1');
        sessionStorage.setItem("nb_home_pending_generate", JSON.stringify({ tab: "i2i", prompt: i2iPrompt || "" }));
        onShowSignIn(true);
        return;
      }
      uploadInputRef.current?.click();
    } catch {
      // If Supabase client/env is unavailable, prefer prompting sign-in instead of bypassing
      sessionStorage.setItem("nb_home_ask_upload", '1');
      onShowSignIn(true);
    }
  }

  const FAQ_JSONLD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://www.nanobanana-ai.dev/#faq",
    "mainEntity": [
      { "@type": "Question", "name": "What is Nano Banana?", "acceptedAnswer": { "@type": "Answer", "text": "Nano Banana (nanobanana) is an AI image editor powered by Google Gemini 2.5 Flash image editor. It preserves faces, identity, and scene while you edit with simple text prompts." } },
      { "@type": "Question", "name": "How does it work?", "acceptedAnswer": { "@type": "Answer", "text": "Upload an image or start from text, describe your edit in natural language, and generate. Powered by Gemini 2.5 Flash, no manual masking is required." } },
      { "@type": "Question", "name": "Is it better than other tools?", "acceptedAnswer": { "@type": "Answer", "text": "Our nanobanana AI image editor focuses on consistent characters and scene preservation, delivering realistic results across edits and versions." } },
      { "@type": "Question", "name": "Can I use it commercially?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The Nano Banana AI image editor is great for UGC, social, and marketing where brand and identity consistency matters." } }
    ]
  }

  return (
    <section id="generator" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* FAQ schema for the homepage FAQ */}
        <JsonLdRaw id="faq-jsonld" data={FAQ_JSONLD} />
        <div className="lg:text-center">
          <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">AI Image Editor</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Try the Nano Banana Editor</p>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-600 lg:mx-auto">
            {isAuthed ? (
              <>Credits: <span className="font-semibold">{balance}</span></>
            ) : (
              <>Sign in to start generating images</>
            )}
          </p>
          
        </div>

        <div className="mt-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Tabs and Inputs */}
          <section className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-start mb-6 gap-0 w-full">
                <button
                  onClick={() => setActiveTab("i2i")}
                  className={`w-1/2 sm:w-auto px-4 py-2 rounded-l-md text-sm font-medium ${activeTab === "i2i" ? "bg-yellow-600 text-white" : "bg-white text-gray-800 border"}`}
                >
                  Image to Image
                </button>
                <button
                  onClick={() => setActiveTab("t2i")}
                  className={`w-1/2 sm:w-auto px-4 py-2 rounded-r-md text-sm font-medium ${activeTab === "t2i" ? "bg-yellow-600 text-white" : "bg-white text-gray-800 border"}`}
                >
                  Text to Image
                </button>
              </div>

              {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

              {activeTab === "i2i" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 px-4 py-2"
                    >
                      Upload a file
                    </button>
                    <input
                      ref={uploadInputRef}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onClick={async (e) => {
                        try {
                          const supabase = getSupabase();
                          const { data: { user } } = await supabase.auth.getUser();
                          if (!user) {
                            e.preventDefault();
                            sessionStorage.setItem("nb_home_ask_upload", '1');
                            sessionStorage.setItem("nb_home_pending_generate", JSON.stringify({ tab: "i2i", prompt: i2iPrompt || "" }));
                            onShowSignIn(true);
                            return false;
                          }
                        } catch {
                          e.preventDefault();
                          sessionStorage.setItem("nb_home_ask_upload", '1');
                          onShowSignIn(true);
                          return false;
                        }
                        return true;
                      }}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setI2iFile(f);
                          if (previewUrl) URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(URL.createObjectURL(f));
                        }
                      }}
                    />
                    <p className="pl-1 text-gray-600">or drag and drop</p>
                    <p className="text-xs text-gray-600">PNG, JPG up to 10 MB</p>
                    {previewUrl && (
                      <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 rounded-md border mt-3" />
                    )}
                    {i2iFile && <p className="text-sm text-gray-700 mt-2 truncate">Selected file: {i2iFile.name}</p>}
                  </div>
                  {/* Styles */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Styles</h3>
                      <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => setI2iPrompt("")}>Clear prompt</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_CHIPS.map((c) => (
                        <button key={c.label} type="button" className="px-3 py-1.5 rounded-full text-xs font-medium border hover:bg-gray-50" onClick={() => setI2iPrompt((p) => p ? `${p.trim().replace(/\.$/, "")}. ${c.text}` : c.text)} title={c.text}>{c.label}</button>
                      ))}
                    </div>
                  </div>
                  {/* Aspect + Strength */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                      <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:ring-yellow-600 focus:border-yellow-600">
                        {ASPECTS.map((a) => (<option key={a.k} value={a.k}>{a.k}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Edit Strength ({strength.toFixed(2)})</label>
                      <input type="range" min={0} max={1} step={0.05} value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))} className="mt-2 w-full" />
                    </div>
                  </div>
                  <textarea
                    rows="4"
                    className="w-full rounded-md border-gray-300 focus:ring-yellow-600 focus:border-yellow-600"
                    placeholder="Describe the edit you want to apply…"
                    value={i2iPrompt}
                    onChange={(e) => setI2iPrompt(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Apply Edits (−1 credit)"}
                  </button>
                </div>
              )}

              {activeTab === "t2i" && (
                <div className="space-y-4">
                  {/* Styles */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-900">Styles</h3>
                      <button className="text-xs text-gray-500 hover:text-gray-700" onClick={() => setT2iPrompt("")}>Clear prompt</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STYLE_CHIPS.map((c) => (
                        <button key={c.label} type="button" className="px-3 py-1.5 rounded-full text-xs font-medium border hover:bg-gray-50" onClick={() => setT2iPrompt((p) => p ? `${p.trim().replace(/\.$/, "")}. ${c.text}` : c.text)} title={c.text}>{c.label}</button>
                      ))}
                    </div>
                  </div>
                  {/* Aspect */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                    <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="mt-1 w-full rounded-md border-gray-300 focus:ring-yellow-600 focus:border-yellow-600">
                      {ASPECTS.map((a) => (<option key={a.k} value={a.k}>{a.k}</option>))}
                    </select>
                  </div>
                  <textarea
                    rows="4"
                    className="w-full rounded-md border-gray-300 focus:ring-yellow-600 focus:border-yellow-600"
                    placeholder="A cinematic banana astronaut on the moon, 35mm film look"
                    value={t2iPrompt}
                    onChange={(e) => setT2iPrompt(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
                  >
                    {loading ? "Generating..." : "Generate (−1 credit)"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Right: Output */}
          <section className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Output</h3>
                {resultUrl && (
                  <div className="flex gap-3">
                    <a
                      href={resultUrl}
                      download="nano-banana-image.png"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-black"
                    >
                      Download PNG
                    </a>
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
                      onClick={() => setResultUrl(null)}
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {!resultUrl && (
                <div className="h-72 border rounded-md grid place-items-center text-gray-500">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25"></circle>
                        <path d="M4 12a8 8 0 018-8" strokeWidth="4" className="opacity-75"></path>
                      </svg>
                      <span>Generating…</span>
                    </div>
                  ) : (
                    <span>No image yet. Enter a prompt and generate.</span>
                  )}
                </div>
              )}

              {resultUrl && (
                <img src={resultUrl} alt="Generated Image" className="w-full h-auto rounded-md border" />
              )}
            </div>
            {/* Local history */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">History (local)</h3>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-xs text-gray-500 hover:text-gray-700">Clear all</button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No history yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {history.map((h, i) => (
                    <button key={i} className="group border rounded-md overflow-hidden text-left" onClick={() => setResultUrl(h.url)} title={`${h.mode === "i2i" ? "Image→Image" : "Text→Image"} • ${h.aspect} • ${h.prompt}`}>
                      <img src={h.url} alt="" className="w-full h-32 object-cover group-hover:opacity-90" />
                      <div className="p-2 text-[11px] text-gray-600 line-clamp-2">
                        <span className="mr-1 inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{h.mode === "i2i" ? "I→I" : "T→I"}</span>
                        <span className="mr-1 inline-block px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">{h.aspect}</span>
                        {h.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  // -------- Vanta / Lib init --------
  const vantaRef = useRef(null);
  const vantaInstance = useRef(null);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const supabase = getSupabase();
      supabase.auth.getUser().then(({ data }) => setIsAuthed(!!data?.user));
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
        setIsAuthed(!!session?.user);
      });
      return () => subscription?.unsubscribe();
    } catch {
      // ignore
    }
  }, []);

  // Lazy-load Vanta when hero enters viewport
  useEffect(() => {
    let isDestroyed = false;
    const target = vantaRef.current;
    if (!target) return;

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.head.appendChild(s);
      });
    }

    async function ensureVanta() {
      if (window.VANTA && window.THREE) return;
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
      await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js');
    }

    const observer = new IntersectionObserver(async (entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting || isDestroyed) return;
      observer.disconnect();
      try {
        await ensureVanta();
        if (!isDestroyed && !vantaInstance.current && window.VANTA && window.THREE) {
          vantaInstance.current = window.VANTA.GLOBE({
            el: target,
            THREE: window.THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xffc107,
            backgroundColor: 0xf6d365,
            size: 0.8,
          });
        }
      } catch {}
    }, { rootMargin: '200px' });

    observer.observe(target);
    return () => {
      isDestroyed = true;
      observer.disconnect();
      if (vantaInstance.current?.destroy) {
        vantaInstance.current.destroy();
        vantaInstance.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* JSON-LD: WebApplication + WebPage (Home) */}
      <JsonLdRaw
        id="app-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": "https://www.nanobanana-ai.dev/#app",
          "name": "Nano Banana – AI Image Editor",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "url": "https://www.nanobanana-ai.dev/",
          "publisher": { "@id": "https://www.nanobanana-ai.dev/#org" },
          "offers": [
            {
              "@type": "Offer",
              "@id": "https://www.nanobanana-ai.dev/#offer-credits-100",
              "url": "https://www.nanobanana-ai.dev/#pricing",
              "name": "100 credits",
              "price": "5.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "@id": "https://www.nanobanana-ai.dev/#offer-basic",
              "url": "https://www.nanobanana-ai.dev/#pricing-basic",
              "name": "Basic subscription",
              "price": "8.99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "@id": "https://www.nanobanana-ai.dev/#offer-standard",
              "url": "https://www.nanobanana-ai.dev/#pricing-standard",
              "name": "Standard subscription",
              "price": "27.99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "@id": "https://www.nanobanana-ai.dev/#offer-premium",
              "url": "https://www.nanobanana-ai.dev/#pricing-premium",
              "name": "Premium subscription",
              "price": "77.99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ]
        }}
      />
      <JsonLdRaw
        id="webpage-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://www.nanobanana-ai.dev/#webpage",
          "url": "https://www.nanobanana-ai.dev/",
          "name": "Nano Banana – Text-Based AI Photo Editor · Change Anything. Keep What Matters.",
          "isPartOf": { "@id": "https://www.nanobanana-ai.dev/#org" },
          "about": { "@id": "https://www.nanobanana-ai.dev/#app" }
        }}
      />
      {/* Vanta/Three are loaded dynamically on intersection */}

      {/* Minimal custom styles for hero + banana float */}
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04); }
        .banana-float { animation: nb-float 6s ease-in-out infinite; }
        @keyframes nb-float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
      `}</style>


      {/* HERO */}
      <div className="hero-gradient relative overflow-hidden">
        <div ref={vantaRef} id="home" className="absolute inset-0 pointer-events-none" aria-hidden="true" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Copy */}
            <div className="relative z-10">
              <h1 className="fluid-h1 tracking-tight font-extrabold">
                <span className="text-gray-900">Nano Banana - </span>
                <span className="text-white">Advanced AI Image Editor</span>
              </h1>
              <h2 className="mt-3 md:mt-4 text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                Experience the REAL Nano Banana advanced AI image editor powered by Google's Gemini 2.5 Flash Image API.
              </h2>
              <p className="mt-2 text-xs sm:text-base md:text-xl text-gray-900">
                EASILY transform images with simple text commands while achieving consistent characters. No need to search for hours for nanobanana. Create stunning visuals with REAL nano-banana AI image technology.
              </p>
              <h3 className="mt-2 text-base sm:text-lg text-gray-800 italic">
                Independent, convenient, easy-to-use service utilizing Google's Nano Banana API technology.
              </h3>
              
            </div>

            {/* Banana visual (stacks on mobile; absolute only on lg+) */}
            <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[460px]">
              <img
                className="banana-float absolute inset-x-0 bottom-0 mx-auto w-64 sm:w-80 lg:w-[520px] lg:bottom-[-24px] lg:right-0 lg:left-auto lg:mx-0"
                src="https://nanobanana.ai/_next/image?url=%2Fbanana-decoration.png&w=640&q=75"
                alt="Banana decoration"
                width="520"
                height="520"
                fetchpriority="low"
                decoding="async"
                loading="lazy"
                sizes="(min-width: 1024px) 520px, (min-width: 640px) 20rem, 16rem"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GENERATOR (inline) */}
      <HomeGeneratorSection showSignIn={showSignIn} onShowSignIn={setShowSignIn} />

      {/* EXAMPLES (Before/After) */}
      <ExamplesSection />

      {/* FEATURES */}
      <section id="features" className="py-12 bg-white cv-lazy" loading="lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Why Choose Nano Banana?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Core Nano Banana Features</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Natural-language editing with unmatched consistency. Keep faces and identities while changing anything else.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["message-square", "Natural Language Editing", "Edit images using plain text prompts—no masks or layers required."],
              ["user", "Character Consistency", "Maintain faces and details across edits and variations."],
              ["image", "Scene Preservation", "Blend edits with the original background so results look seamless."],
              ["zap", "One-Shot Editing", "High-quality results in a single pass for most edits."],
              ["layers", "Multi-Image Context", "Use multiple references to guide style, identity, or scene."],
              ["award", "AI UGC Creation", "Perfect for influencers and marketers needing consistent on-brand visuals."],
            ].map(([icon, title, body]) => (
              <div key={title} className="feature-card bg-white overflow-hidden shadow rounded-lg transition duration-300 ease-in-out">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      {icon === "message-square" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                        </svg>
                      )}
                      {icon === "user" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                      {icon === "image" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      )}
                      {icon === "zap" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      )}
                      {icon === "layers" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" />
                          <polyline points="2 17 12 22 22 17" />
                          <polyline points="2 12 12 17 22 12" />
                        </svg>
                      )}
                      {icon === "award" && (
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7" />
                          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 16:9 CREATOR (embedded app) */}
      <section id="sixteen-nine" className="py-12 bg-gray-50 cv-lazy" loading="lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">16:9 Image Creator</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">YouTube & Hero Banners, Perfectly Framed</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">Generate native 16:9 or convert any image while preserving composition.</p>
          </div>
          <div className="mt-6 h-[calc(100vh-6rem)]">
            <iframe
              src="https://nano-banana-16-9-image-creator.vercel.app/"
              className="w-full h-full border-0 rounded-lg shadow-sm"
              loading="eager"
              title="16:9 Image Generator"
            />
          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="showcase" className="py-12 bg-gray-50 cv-lazy" loading="lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Lightning-Fast Nano Banana AI Creations</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Nano Banana Showcase</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">See what Nano Banana can do in seconds.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <img className="w-full h-auto object-cover rounded-md" src={`https://picsum.photos/seed/nb${n}/640/360`} alt={`Showcase ${n}`} width="640" height="360" loading="lazy" decoding="async" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Sample {n}</h3>
                  <p className="mt-1 text-sm text-gray-500">Generated with the Nano Banana editor.</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/generator"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Try the Generator
            </a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-12 bg-white cv-lazy" data-aos="fade-up" loading="lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">User Reviews</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">What creators are saying.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ["AIArtistPro", "Digital Creator", "https://i.pravatar.cc/100?img=11", "Changed my workflow. Consistency is incredible—way ahead of anything I used before."],
              ["ContentCreator", "UGC Specialist", "https://i.pravatar.cc/100?img=12", "Keeping faces across edits is the real superpower. Clients notice the difference."],
              ["PhotoEditor", "Pro Editor", "https://i.pravatar.cc/100?img=13", "One-shot edits that look natural. Background blends are smooth and realistic."],
            ].map(([name, role, avatar, quote]) => (
              <div key={name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={avatar} alt={name} width="40" height="40" loading="lazy" decoding="async" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                      <p className="text-sm text-gray-500">{role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-gray-600">&ldquo;{quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING (moved before FAQ) */}
      <PricingSection />

      {/* FAQ */}
      <section id="faq" className="py-12 bg-gray-50 cv-lazy" loading="lazy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-yellow-700 font-semibold tracking-wide uppercase">Help Center</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">Frequently Asked Questions</p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">What is Nano Banana?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  A text-based photo editor that understands complex instructions and preserves the details you care about.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">How does it work?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Upload an image (or start from text), describe your edit, and generate. No manual masking required.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">Is it better than other tools?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We focus on identity and scene preservation so results look consistent across edits and versions.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900">Can I use it commercially?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes—great for UGC, social, and marketing where brand/identity consistency matters.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-yellow-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to revolutionize your image editing?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-yellow-100 sm:mt-4">
            Join creators using Nano Banana for fast, consistent edits.
          </p>
          <div className="mt-8">
            <a
              href="#generator"
              className="inline-flex items-center px-6 py-3 rounded-md text-yellow-700 bg-white hover:bg-gray-50"
            >
              Try Nano Banana Now
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Nano Banana</h3>
              <p className="mt-4 text-base text-gray-300">AI Image Editor</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><a href="#features" className="text-base text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#showcase" className="text-base text-gray-300 hover:text-white">Showcase</a></li>
                <li><a href="#reviews" className="text-base text-gray-300 hover:text-white">Reviews</a></li>
                <li><a href="/pricing" className="text-base text-gray-300 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul role="list" className="mt-4 space-y-4">
                <li><a href="/about" className="text-base text-gray-300 hover:text-white">About</a></li>
                <li><a href="/contact" className="text-base text-gray-300 hover:text-white">Contact</a></li>
                <li><a href="/refunds" className="text-base text-gray-300 hover:text-white">Refunds</a></li>
                <li><a href="/terms" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                <li><a href="/privacy" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">&copy; 2023 Nano Banana. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
  );
}

