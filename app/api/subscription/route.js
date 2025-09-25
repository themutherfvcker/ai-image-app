// app/api/subscription/route.js
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { default: Stripe } = await import('stripe');
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: 'Missing STRIPE_SECRET_KEY' },
        { status: 500 }
      );
    }

    // Require Supabase auth (Bearer token) to bind subscription to a user id
    const authHeader = req.headers.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''
    if (!accessToken) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 })
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken)
    if (authErr || !user) return NextResponse.json({ ok: false, error: 'AUTH_INVALID' }, { status: 401 })
    const uid = user.id

    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const body = await req.json().catch(() => ({}));
    const { success_url, cancel_url, priceId: bodyPriceId, plan } = body || {};

    // Resolve priceId: prefer explicit priceId, then by plan env, else default env
    let priceId = typeof bodyPriceId === 'string' && bodyPriceId ? bodyPriceId : '';
    if (!priceId && typeof plan === 'string' && plan) {
      const key = plan.toUpperCase();
      const envKey = `STRIPE_PRICE_ID_${key}`; // e.g., STRIPE_PRICE_ID_BASIC
      priceId = process.env[envKey] || '';
    }
    if (!priceId) {
      priceId = process.env.STRIPE_PRICE_ID_SUB || '';
    }
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: 'Missing Stripe price ID. Provide body.priceId or set STRIPE_PRICE_ID_SUB (or STRIPE_PRICE_ID_{PLAN}).' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [ { price: priceId, quantity: 1 } ],
      metadata: { uid },
      client_reference_id: uid,
      success_url: success_url || `${origin}/success`,
      cancel_url: cancel_url || `${origin}/cancel`,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

