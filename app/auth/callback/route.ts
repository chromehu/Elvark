import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { validateSafeRedirect } from '@/lib/redirect';

/**
 * Supabase SSR callback route for email confirmation and password recovery.
 * Handles auth callback codes from Supabase and exchanges them for sessions.
 *
 * Route: /auth/callback?code=...
 * Configured in Supabase Authentication > URL Configuration > Redirect URLs
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect');

  if (!code) {
    // No code provided - redirect to login or home
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      // Redirect to login on error
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/belepes';
      redirectUrl.searchParams.delete('code');
      redirectUrl.searchParams.set('error', 'auth_failed');
      return NextResponse.redirect(redirectUrl);
    }

    // Validate and use safe redirect
    const safeRedirect = validateSafeRedirect(redirect || '/fiokom');
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = safeRedirect;
    redirectUrl.searchParams.delete('code');
    redirectUrl.searchParams.delete('redirect');

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('Unexpected auth callback error:', err);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/belepes';
    redirectUrl.searchParams.delete('code');
    redirectUrl.searchParams.set('error', 'unexpected_error');
    return NextResponse.redirect(redirectUrl);
  }
}
