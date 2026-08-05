'use client';

/**
 * Safe URL validation and normalization utility.
 * Validates URLs for website and social media profiles.
 * Ensures only valid URLs are stored in the database.
 */

/**
 * Validates and normalizes a URL for storage.
 * Ensures the URL has a protocol and is well-formed.
 * @param url - The URL to validate
 * @returns The normalized URL, or null if invalid
 */
export function validateAndNormalizeUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  url = url.trim();
  if (!url) {
    return null;
  }

  try {
    // Add protocol if missing
    let urlToValidate = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      urlToValidate = 'https://' + url;
    }

    // Validate with URL constructor
    const parsed = new URL(urlToValidate);

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }

    // Return the full URL with protocol
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Checks if a URL is valid without normalizing it.
 * Used for form validation feedback.
 * @param url - The URL to check
 * @returns true if valid
 */
export function isValidUrl(url: string): boolean {
  return validateAndNormalizeUrl(url) !== null;
}
