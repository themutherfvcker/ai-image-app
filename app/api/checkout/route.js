// app/api/checkout/route.js
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Determine how many credits to award based on the paid amount
function creditsForAmount(amountCents, currency) {
  const curr = String(currency || 'aud').toLowerCase();
  // Default: 20 credits per 1 currency unit (e.g., 5 AUD -> 100 credits)
  const perUnit = curr === 'aud'
    ? Number(process.env.CREDITS_PER_AUD || process.env.CREDITS_PER_UNIT || '20')
    : Number(process.env.CREDITS_PER_UNIT || '20');
  const wholeUnits = Math.floor(Math.max(0, Number(amountCents) || 0) / 100);
  const credits = Math.floor(wholeUnits * perUnit);
  return Math.max(1, credits);
}

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
    const method = req.method || 'GET';
    let successUrl = '';
    let cancelUrl = '';
    if (method === 'GET') {
      const url = new URL(req.url);
      successUrl = url.searchParams.get('success_url') || '';
      cancelUrl = url.searchParams.get('cancel_url') || '';
    } else {
      const body = await req.json().catch(() => ({}));
      successUrl = typeof body.success_url === 'string' ? body.success_url : '';
      cancelUrl = typeof body.cancel_url === 'string' ? body.cancel_url : '';
    }

    // Build success/cancel URLs from the actual request host (fixes “new user at 25” issue)
    const hdrs = await headers();
    const host = hdrs.get('host');
    const proto = hdrs.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;

    const stripe = new Stripe(secret);
    // Fixed price item: 500 AUD cents. Compute displayed credits based on amount and currency.
    const unitAmountCents = 500; // $5 AUD
    const currency = 'aud';
    const displayCredits = creditsForAmount(unitAmountCents, currency);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl || `${origin}/success`,
      cancel_url: cancelUrl || `${origin}/cancel`,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: `${displayCredits} AI credits` },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      // Do not trust client inputs for credits; award in webhook from amount_total
      metadata: { userId: uid },
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
