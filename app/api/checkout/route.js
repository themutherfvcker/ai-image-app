// app/api/checkout/route.js
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function handleCheckout(req) {
  try {
    // Load Stripe at runtime
    const { default: Stripe } = await import('stripe');
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: 'STRIPE_SECRET_KEY missing' },
        { status: 500 }
      );
    }

    // Require Supabase auth (Bearer token) and bind checkout to user id
    const authHeader = req.headers.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''
    if (!accessToken) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 })
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken)
    if (authErr || !user) return NextResponse.json({ ok: false, error: 'AUTH_INVALID' }, { status: 401 })
    const uid = user.id

    // Parse inputs
    let credits = 100;
    const method = req.method || 'GET';
    let successUrl = '';
    let cancelUrl = '';
    if (method === 'GET') {
      const url = new URL(req.url);
      credits = Math.max(
        1,
        Math.min(100000, parseInt(url.searchParams.get('credits') || '100', 10))
      );
      successUrl = url.searchParams.get('success_url') || '';
      cancelUrl = url.searchParams.get('cancel_url') || '';
    } else {
      const body = await req.json().catch(() => ({}));
      const c = parseInt(String(body.credits ?? '100'), 10);
      credits = Math.max(1, Math.min(100000, isNaN(c) ? 100 : c));
      successUrl = typeof body.success_url === 'string' ? body.success_url : '';
      cancelUrl = typeof body.cancel_url === 'string' ? body.cancel_url : '';
    }

    // Build success/cancel URLs from the actual request host (fixes “new user at 25” issue)
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const stripe = new Stripe(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl || `${origin}/success`,
      cancel_url: cancelUrl || `${origin}/cancel`,
      // Keep a fixed $5 AUD price; let credits vary (e.g., 25, 100, etc.)
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: `${credits} AI credits` },
            unit_amount: 500, // $5 AUD total
          },
          quantity: 1,
        },
      ],
      metadata: { userId: uid, credits: String(credits) },
      client_reference_id: uid,
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

export async function GET(req) { return handleCheckout(req); }
export async function POST(req) { return handleCheckout(req); }
