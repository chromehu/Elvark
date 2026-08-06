/**
 * Safe URL validation and normalization utility.
 * Validates URLs for website and social media profiles.
 * Ensures only valid URLs are stored in the database.
 *
 * Reusable from both server and client code.
 */

// Maximum URL length to prevent DoS
const MAX_URL_LENGTH = 2048;

// Protocols that are dangerous and must be rejected
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'data:',
  'file:',
  'vbscript:',
  'about:',
];

export type UrlValidationError =
  | 'EMPTY_REQUIRED'
  | 'TOO_LONG'
  | 'DANGEROUS_PROTOCOL'
  | 'INVALID_FORMAT'
  | 'CREDENTIALS_NOT_ALLOWED'
  | 'INVALID_HOSTNAME'
  | 'PROTOCOL_NOT_ALLOWED'
  | 'INVALID_CHARACTERS';

const ERROR_MESSAGES_HU: Record<UrlValidationError, string> = {
  EMPTY_REQUIRED: 'Az URL megadása kötelező.',
  TOO_LONG: 'Az URL túl hosszú (maximum 2048 karakter).',
  DANGEROUS_PROTOCOL: 'Érvénytelen URL protokoll.',
  INVALID_FORMAT: 'Érvénytelen URL formátum.',
  CREDENTIALS_NOT_ALLOWED: 'A beágyazott hitelesítő adatokat tartalmazó URL-ek nem megengedettek.',
  INVALID_HOSTNAME: 'Érvénytelen állomásnév.',
  PROTOCOL_NOT_ALLOWED: 'Ez a protokoll nem engedélyezett.',
  INVALID_CHARACTERS: 'Az URL érvénytelen karaktereket tartalmaz.',
};

/**
 * Gets the allowed protocols for the current environment.
 * Production only allows https://, development allows both.
 * @returns Array of allowed protocol strings (e.g. ['https:'])
 */
function getAllowedProtocols(): string[] {
  const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
  return isDev ? ['http:', 'https:'] : ['https:'];
}

/**
 * Validates that a URL is safe, well-formed, and canonical.
 * @param url - The URL to validate (may be empty or null)
 * @param allowEmpty - If true, empty/null values are valid and return normalized: null
 * @returns { valid: boolean; normalized: string | null; error?: UrlValidationError }
 *   - valid: true if URL is safe and well-formed (or empty and allowEmpty=true)
 *   - normalized: the canonical URL string, or null if valid-empty
 *   - error: error code for form validation (only if valid=false)
 */
export function validateAndNormalizeUrl(
  url: string | null | undefined,
  allowEmpty = true
): {
  valid: boolean;
  normalized: string | null;
  error?: UrlValidationError;
} {
  // Handle non-string types - only string or null/undefined are acceptable
  if (url !== null && url !== undefined && typeof url !== 'string') {
    return {
      valid: false,
      normalized: null,
      error: 'INVALID_FORMAT',
    };
  }

  // Handle empty/null input
  if (!url) {
    return {
      valid: allowEmpty,
      normalized: null,
      error: allowEmpty ? undefined : 'EMPTY_REQUIRED',
    };
  }

  // Check for control characters BEFORE trimming
  if (/[\x00-\x1f\x7f]/.test(url)) {
    return { valid: false, normalized: null, error: 'INVALID_CHARACTERS' };
  }

  const trimmed = url.trim();

  // Empty after trimming
  if (!trimmed) {
    return {
      valid: allowEmpty,
      normalized: null,
      error: allowEmpty ? undefined : 'EMPTY_REQUIRED',
    };
  }

  // Check length before processing
  if (trimmed.length > MAX_URL_LENGTH) {
    return {
      valid: false,
      normalized: null,
      error: 'TOO_LONG',
    };
  }

  // Reject obviously dangerous protocols
  const lowerUrl = trimmed.toLowerCase();
  if (DANGEROUS_PROTOCOLS.some(proto => lowerUrl.startsWith(proto))) {
    return { valid: false, normalized: null, error: 'DANGEROUS_PROTOCOL' };
  }

  // Reject URLs with backslashes (URL confusion attacks)
  if (trimmed.includes('\\')) {
    return { valid: false, normalized: null, error: 'INVALID_FORMAT' };
  }

  try {
    let urlToValidate = trimmed;

    // Add https:// if no protocol specified
    if (!trimmed.includes('://')) {
      urlToValidate = 'https://' + trimmed;
    }

    // Parse and validate
    const parsed = new URL(urlToValidate);

    // Check protocol is in allowed list
    const allowedProtocols = getAllowedProtocols();
    if (!allowedProtocols.includes(parsed.protocol)) {
      return {
        valid: false,
        normalized: null,
        error: 'PROTOCOL_NOT_ALLOWED',
      };
    }

    // Reject URLs with embedded username or password
    if (parsed.username || parsed.password) {
      return {
        valid: false,
        normalized: null,
        error: 'CREDENTIALS_NOT_ALLOWED',
      };
    }

    // Ensure hostname is present
    if (!parsed.hostname) {
      return { valid: false, normalized: null, error: 'INVALID_HOSTNAME' };
    }

    // Return canonical URL
    return { valid: true, normalized: parsed.toString() };
  } catch {
    return { valid: false, normalized: null, error: 'INVALID_FORMAT' };
  }
}

/**
 * Gets the Hungarian user-facing error message for a validation error code.
 * @param error - The error code
 * @returns Hungarian error message
 */
export function getUrlErrorMessage(error: UrlValidationError): string {
  return ERROR_MESSAGES_HU[error] || 'Érvénytelen URL.';
}

/**
 * Checks if a URL is valid without normalizing it.
 * Used for form validation feedback.
 * @param url - The URL to check
 * @param allowEmpty - If true, empty strings are considered valid
 * @returns true if valid
 */
export function isValidUrl(url: string | null | undefined, allowEmpty = true): boolean {
  const result = validateAndNormalizeUrl(url, allowEmpty);
  return result.valid;
}

/**
 * Normalizes a URL for storage, rejecting invalid non-empty input.
 * Used when storing user-submitted URLs to the database.
 * Empty optional values return null.
 * Invalid non-empty values throw an error.
 * @param url - The URL to normalize
 * @param allowEmpty - If false, throws on empty input
 * @returns The normalized URL, or null if empty and allowEmpty=true
 * @throws Error if URL is invalid (non-empty but malformed)
 */
export function normalizeUrlForStorage(url: string | null | undefined, allowEmpty = true): string | null {
  const result = validateAndNormalizeUrl(url, allowEmpty);

  if (!result.valid) {
    const errorMsg = result.error ? getUrlErrorMessage(result.error) : 'Érvénytelen URL.';
    throw new Error(`URL validation failed: ${errorMsg}`);
  }

  return result.normalized;
}

/**
 * Validation test cases (for reference/documentation).
 *
 * ACCEPTED CASES:
 * - "example.com" → https://example.com/
 * - "https://example.com" → https://example.com/
 * - "https://example.com/profile?id=1" → https://example.com/profile?id=1
 * - "linkedin.com/in/example" → https://linkedin.com/in/example
 * - "https://my-site.co.uk/page" → https://my-site.co.uk/page
 * - "" (empty, allowEmpty=true) → null, valid=true
 * - "   " (whitespace, allowEmpty=true) → null, valid=true
 * - null (allowEmpty=true) → null, valid=true
 * - undefined (allowEmpty=true) → null, valid=true
 * - "http://example.com" (development) → http://example.com/
 *
 * REJECTED CASES:
 * - "" (empty, allowEmpty=false) → error='EMPTY_REQUIRED', valid=false
 * - "   " (whitespace, allowEmpty=false) → error='EMPTY_REQUIRED', valid=false
 * - "javascript:alert(1)" → error='DANGEROUS_PROTOCOL', valid=false
 * - "data:text/html,test" → error='DANGEROUS_PROTOCOL', valid=false
 * - "file:///etc/passwd" → error='DANGEROUS_PROTOCOL', valid=false
 * - "ftp://example.com" → error='PROTOCOL_NOT_ALLOWED', valid=false
 * - "https://user:pass@example.com" → error='CREDENTIALS_NOT_ALLOWED', valid=false
 * - "http://example.com" (production) → error='PROTOCOL_NOT_ALLOWED', valid=false
 * - "ht!tp://ex ample" → error='INVALID_FORMAT', valid=false
 * - URL > 2048 chars → error='TOO_LONG', valid=false
 * - "https://example.com\\\.." → error='INVALID_FORMAT', valid=false
 * - URL with control character (newline, tab, etc) → error='INVALID_CHARACTERS', valid=false
 */
