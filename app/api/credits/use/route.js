// app/api/credits/use/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Require Supabase Bearer auth for credit-affecting action
    const authHeader = request.headers.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''
    if (!accessToken) return NextResponse.json({ ok: false, error: 'AUTH_REQUIRED' }, { status: 401 })
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    const { data: { user }, error: authErr } = await supabase.auth.getUser(accessToken)
    if (authErr || !user) return NextResponse.json({ ok: false, error: 'AUTH_INVALID' }, { status: 401 })
    const uid = user.id

    const { amount } = await request.json().catch(() => ({ amount: 1 }));
    const spend = Number.isFinite(amount) ? Math.max(1, Math.min(1000, Math.floor(amount))) : 1;

    let newBalance = null;

    await prisma.$transaction(async (tx) => {
      // Decrement only if there are enough credits (atomic)
      const updated = await tx.user.updateMany({
        where: { id: uid, credits: { gte: spend } },
        data: { credits: { decrement: spend } },
      });

      if (updated.count === 0) {
        throw new Error('INSUFFICIENT_CREDITS');
      }

      await tx.creditLedger.create({
        data: { userId: uid, delta: -spend, reason: 'usage:generate', ref: undefined },
      });

      const after = await tx.user.findUnique({ where: { id: uid }, select: { credits: true } });
      newBalance = after?.credits ?? null;
    });

    return NextResponse.json({ ok: true, credits: newBalance });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const status = msg === 'INSUFFICIENT_CREDITS' ? 402 : 500; // 402 = Payment Required (nice semantic)
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
