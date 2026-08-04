import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/fiokom', '/oktato', '/admin'];
const authRoutes = ['/belepes', '/regisztracio', '/elfelejtett-jelszo', '/jelszo-visszaallitas'];
const publicRoutes = ['/fiok-felfuggesztve', '/nincs-jogosultsag'];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Record<string, unknown> | undefined)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (user && isAuthRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/fiokom';
    redirectUrl.searchParams.delete('redirect');
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect unauthenticated users from protected routes to login
  if (!user && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/belepes';
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check suspended status for protected routes
  if (user && isProtectedRoute(pathname) && !publicRoutes.includes(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('status, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.status === 'suspended') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/fiok-felfuggesztve';
      return NextResponse.redirect(redirectUrl);
    }

    // Role-based access control
    if (pathname.startsWith('/oktato') && profile?.role !== 'instructor' && profile?.role !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/oktato-jelentkezes';
      return NextResponse.redirect(redirectUrl);
    }

    if (pathname.startsWith('/admin') && profile?.role !== 'admin') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/nincs-jogosultsag';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
