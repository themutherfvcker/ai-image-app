// app/api/ledger/route.ts
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs';

export async function GET() {
  try {
    const jar = await cookies();
    const hdrs = await headers();
    const authHeader = hdrs.get('authorization') || ''
    const m = /^(Bearer)\s+(.+)$/i.exec(authHeader)
    const accessToken = m?.[2] || ''

    // Prefer Supabase auth user id as canonical id when available
    let uid = ''
    if (accessToken) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
      const { data: { user } } = await supabase.auth.getUser(accessToken)
      if (user?.id) uid = user.id
    }
    if (!uid) uid = jar.get('uid')?.value || ''
    if (!uid) return NextResponse.json({ ok: false, error: 'No user id available.' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { id: uid },
      select: { id: true, credits: true, plan: true },
    });

    const ledgers = await prisma.creditLedger.findMany({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { createdAt: true, delta: true, reason: true, ref: true },
    });

    return NextResponse.json({ ok: true, user, ledgers });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
