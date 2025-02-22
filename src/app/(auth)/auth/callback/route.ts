// ref: https://github.com/vercel/next.js/blob/canary/examples/with-supabase/app/auth/callback/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';
import { getURL } from '@/utils/get-url';

const siteUrl = getURL();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');

  const supabase = await createSupabaseServerClient();

  if (code) {
    // Handle OAuth callback
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // Handle Email verification
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (error) {
      return NextResponse.redirect(`${siteUrl}/login?error=Could not verify email`);
    }
  }

  // Check if user is subscribed, if not redirect to pricing page
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) {
    return NextResponse.redirect(`${siteUrl}/login`);
  }

  const { data: userSubscription } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (!userSubscription) {
    return NextResponse.redirect(`${siteUrl}/pricing`);
  } else {
    return NextResponse.redirect(`${siteUrl}`);
  }
}
