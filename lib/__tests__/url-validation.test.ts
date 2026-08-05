import { validateAndNormalizeUrl, getUrlErrorMessage } from '../url-validation';

describe('url-validation', () => {
  describe('validateAndNormalizeUrl', () => {
    it('accepts empty value with allowEmpty=true', () => {
      const result = validateAndNormalizeUrl('', true);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('rejects empty value with allowEmpty=false', () => {
      const result = validateAndNormalizeUrl('', false);
      expect(result.valid).toBe(false);
      expect(result.normalized).toBeNull();
      expect(result.error).toBe('EMPTY_REQUIRED');
    });

    it('accepts null with allowEmpty=true', () => {
      const result = validateAndNormalizeUrl(null, true);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeNull();
    });

    it('rejects null with allowEmpty=false', () => {
      const result = validateAndNormalizeUrl(null, false);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('EMPTY_REQUIRED');
    });

    it('accepts undefined with allowEmpty=true', () => {
      const result = validateAndNormalizeUrl(undefined, true);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeNull();
    });

    it('rejects undefined with allowEmpty=false', () => {
      const result = validateAndNormalizeUrl(undefined, false);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('EMPTY_REQUIRED');
    });

    it('rejects non-string type', () => {
      const result = validateAndNormalizeUrl(123 as unknown as string);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_FORMAT');
    });

    it('accepts whitespace-only with allowEmpty=true', () => {
      const result = validateAndNormalizeUrl('   ', true);
      expect(result.valid).toBe(true);
      expect(result.normalized).toBeNull();
    });

    it('rejects whitespace-only with allowEmpty=false', () => {
      const result = validateAndNormalizeUrl('   ', false);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('EMPTY_REQUIRED');
    });

    it('rejects newline character in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\n');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CHARACTERS');
    });

    it('rejects carriage return in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\r');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CHARACTERS');
    });

    it('rejects tab character in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\t');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CHARACTERS');
    });

    it('rejects null byte in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\x00');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CHARACTERS');
    });

    it('rejects DEL character (0x7F) in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\x7f');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_CHARACTERS');
    });

    it('adds https:// protocol when missing', () => {
      const result = validateAndNormalizeUrl('example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('https://example.com/');
    });

    it('adds https:// to path with protocol omitted', () => {
      const result = validateAndNormalizeUrl('linkedin.com/in/example');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('https://linkedin.com/in/example');
    });

    it('accepts valid HTTPS URL', () => {
      const result = validateAndNormalizeUrl('https://example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('https://example.com/');
    });

    it('accepts HTTPS URL with path and query', () => {
      const result = validateAndNormalizeUrl('https://example.com/profile?id=1');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('https://example.com/profile?id=1');
    });

    it('rejects javascript: protocol', () => {
      const result = validateAndNormalizeUrl('javascript:alert(1)');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('DANGEROUS_PROTOCOL');
    });

    it('rejects data: protocol', () => {
      const result = validateAndNormalizeUrl('data:text/html,test');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('DANGEROUS_PROTOCOL');
    });

    it('rejects file: protocol', () => {
      const result = validateAndNormalizeUrl('file:///etc/passwd');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('DANGEROUS_PROTOCOL');
    });

    it('rejects ftp: protocol', () => {
      const result = validateAndNormalizeUrl('ftp://example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('PROTOCOL_NOT_ALLOWED');
    });

    it('rejects URL with embedded credentials', () => {
      const result = validateAndNormalizeUrl('https://user:pass@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('CREDENTIALS_NOT_ALLOWED');
    });

    it('rejects URL with username only', () => {
      const result = validateAndNormalizeUrl('https://user@example.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('CREDENTIALS_NOT_ALLOWED');
    });

    it('rejects backslashes in URL', () => {
      const result = validateAndNormalizeUrl('https://example.com\\..');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_FORMAT');
    });

    it('rejects URL exceeding max length', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2048);
      const result = validateAndNormalizeUrl(longUrl);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('TOO_LONG');
    });

    it('rejects malformed URL', () => {
      const result = validateAndNormalizeUrl('ht!tp://ex ample');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_FORMAT');
    });

    it('accepts valid subdomain URL', () => {
      const result = validateAndNormalizeUrl('https://profile.example.com');
      expect(result.valid).toBe(true);
      expect(result.normalized).toBe('https://profile.example.com/');
    });

    it('accepts http in development environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      try {
        const result = validateAndNormalizeUrl('http://example.com');
        expect(result.valid).toBe(true);
        expect(result.normalized).toBe('http://example.com/');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });

    it('rejects http in production environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      try {
        const result = validateAndNormalizeUrl('http://example.com');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('PROTOCOL_NOT_ALLOWED');
      } finally {
        process.env.NODE_ENV = originalEnv;
      }
    });
  });

  describe('getUrlErrorMessage', () => {
    it('returns Hungarian message for EMPTY_REQUIRED', () => {
      const msg = getUrlErrorMessage('EMPTY_REQUIRED');
      expect(msg).toContain('kötelező');
    });

    it('returns Hungarian message for DANGEROUS_PROTOCOL', () => {
      const msg = getUrlErrorMessage('DANGEROUS_PROTOCOL');
      expect(msg).toContain('protokoll');
    });

    it('returns Hungarian message for INVALID_FORMAT', () => {
      const msg = getUrlErrorMessage('INVALID_FORMAT');
      expect(msg).toContain('formátum');
    });

    it('returns Hungarian message for CREDENTIALS_NOT_ALLOWED', () => {
      const msg = getUrlErrorMessage('CREDENTIALS_NOT_ALLOWED');
      expect(msg).toContain('hitelesítő');
    });
  });
});
