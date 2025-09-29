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

    // Resolve a usable priceId; accept product ids by looking up default price
    const stripe = new Stripe(secret);
    let priceId = typeof bodyPriceId === 'string' && bodyPriceId ? bodyPriceId : '';
    if (!priceId && typeof plan === 'string' && plan) {
      const key = plan.toUpperCase();
      const envPriceKey = `STRIPE_PRICE_ID_${key}`; // e.g., STRIPE_PRICE_ID_BASIC
      priceId = process.env[envPriceKey] || '';
      if (!priceId) {
        const envProductKey = `STRIPE_PRODUCT_ID_${key}`; // e.g., STRIPE_PRODUCT_ID_BASIC
        const productId = process.env[envProductKey] || '';
        if (productId) {
          try {
            const product = await stripe.products.retrieve(productId);
            const def = product?.default_price;
            if (typeof def === 'string' && def.startsWith('price_')) priceId = def;
            else if (def && typeof def === 'object' && def.id) priceId = def.id;
            if (!priceId) {
              const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
              if (prices?.data?.length) priceId = prices.data[0].id;
            }
          } catch {}
        }
      }
    }
    if (!priceId) {
      priceId = process.env.STRIPE_PRICE_ID_SUB || '';
      if (!priceId) {
        const productId = process.env.STRIPE_PRODUCT_ID_SUB || '';
        if (productId) {
          try {
            const product = await stripe.products.retrieve(productId);
            const def = product?.default_price;
            if (typeof def === 'string' && def.startsWith('price_')) priceId = def;
            else if (def && typeof def === 'object' && def.id) priceId = def.id;
            if (!priceId) {
              const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
              if (prices?.data?.length) priceId = prices.data[0].id;
            }
          } catch {}
        }
      }
    }
    if (!priceId) {
      return NextResponse.json(
        { ok: false, error: 'Missing Stripe price. Provide priceId, STRIPE_PRICE_ID_*, or STRIPE_PRODUCT_ID_* with default price.' },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [ { price: priceId, quantity: 1 } ],
      metadata: { userId: uid },
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

