'use client';

/**
 * Safe internal redirect URL validation.
 * Only allows redirects to internal paths that are explicitly whitelisted.
 * Prevents open redirect vulnerabilities from untrusted query parameters.
 */

const ALLOWED_REDIRECT_PATHS = [
  '/fiokom',
  '/oktato',
  '/admin',
  '/belepes',
  '/regisztracio',
  '/elfelejtett-jelszo',
  '/jelszo-visszaallitas',
  '/oktato-jelentkezes',
  '/',
];

/**
 * Validates if a redirect target is safe (internal and whitelisted).
 * @param redirect - The redirect target URL or path
 * @returns The safe redirect path, or '/' if invalid
 */
export function validateSafeRedirect(redirect: string | null): string {
  if (!redirect || typeof redirect !== 'string') {
    return '/';
  }

  // Remove leading/trailing whitespace
  redirect = redirect.trim();

  // Prevent protocol-relative URLs (//example.com) and absolute URLs
  if (redirect.startsWith('//') || redirect.startsWith('http://') || redirect.startsWith('https://')) {
    return '/';
  }

  // Ensure path starts with /
  if (!redirect.startsWith('/')) {
    return '/';
  }

  // Extract base path (remove query parameters and fragments)
  const basePathMatch = redirect.match(/^([^?#]+)/);
  if (!basePathMatch) {
    return '/';
  }

  const basePath = basePathMatch[1];

  // Check if path is in whitelist
  if (ALLOWED_REDIRECT_PATHS.some(allowed => basePath === allowed || basePath.startsWith(allowed + '/'))) {
    return redirect; // Return full path with params/fragments if valid
  }

  return '/';
}

/**
 * Gets the redirect path from URL search params or fallback.
 * @param params - URLSearchParams or next/navigation searchParams
 * @param fallback - Default redirect if param is invalid (default: '/')
 * @returns Safe redirect path
 */
export function getSafeRedirectFromParams(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
  fallback: string = '/'
): string {
  let redirect: string | null = null;

  if (params instanceof URLSearchParams) {
    redirect = params.get('redirect');
  } else {
    // Handle Next.js useSearchParams record format
    redirect = typeof params.redirect === 'string' ? params.redirect : null;
  }

  if (!redirect) {
    return validateSafeRedirect(fallback);
  }

  return validateSafeRedirect(redirect);
}
