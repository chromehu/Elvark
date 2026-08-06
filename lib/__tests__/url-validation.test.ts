import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  getUrlErrorMessage,
  validateAndNormalizeUrl,
} from '../url-validation';

describe('url-validation', () => {
  describe('validateAndNormalizeUrl', () => {
    it('accepts an empty optional value', () => {
      const result = validateAndNormalizeUrl('', true);
      assert.equal(result.valid, true);
      assert.equal(result.normalized, null);
      assert.equal(result.error, undefined);
    });

    it('rejects an empty required value', () => {
      const result = validateAndNormalizeUrl('', false);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'EMPTY_REQUIRED');
    });

    it('rejects non-string input', () => {
      const result = validateAndNormalizeUrl(123 as unknown as string);
      assert.equal(result.valid, false);
      assert.equal(result.error, 'INVALID_FORMAT');
    });

    it('rejects control characters', () => {
      const result = validateAndNormalizeUrl('https://example.com\n');
      assert.equal(result.valid, false);
      assert.equal(result.error, 'INVALID_CHARACTERS');
    });

    it('adds HTTPS when the protocol is omitted', () => {
      const result = validateAndNormalizeUrl('example.com');
      assert.equal(result.valid, true);
      assert.equal(result.normalized, 'https://example.com/');
    });

    it('keeps a valid HTTPS path and query', () => {
      const result = validateAndNormalizeUrl(
        'https://example.com/profile?id=1'
      );
      assert.equal(result.valid, true);
      assert.equal(
        result.normalized,
        'https://example.com/profile?id=1'
      );
    });

    it('rejects dangerous protocols', () => {
      for (const value of [
        'javascript:alert(1)',
        'data:text/html,test',
        'file:///etc/passwd',
      ]) {
        const result = validateAndNormalizeUrl(value);
        assert.equal(result.valid, false);
        assert.equal(result.error, 'DANGEROUS_PROTOCOL');
      }
    });

    it('rejects unsupported protocols', () => {
      const result = validateAndNormalizeUrl('ftp://example.com');
      assert.equal(result.valid, false);
      assert.equal(result.error, 'PROTOCOL_NOT_ALLOWED');
    });

    it('rejects embedded credentials', () => {
      const result = validateAndNormalizeUrl(
        'https://user:pass@example.com'
      );
      assert.equal(result.valid, false);
      assert.equal(result.error, 'CREDENTIALS_NOT_ALLOWED');
    });

    it('rejects backslashes', () => {
      const result = validateAndNormalizeUrl(
        'https://example.com\\..'
      );
      assert.equal(result.valid, false);
      assert.equal(result.error, 'INVALID_FORMAT');
    });

    it('rejects values over the maximum length', () => {
      const result = validateAndNormalizeUrl(
        `https://example.com/${'a'.repeat(2048)}`
      );
      assert.equal(result.valid, false);
      assert.equal(result.error, 'TOO_LONG');
    });

    it('accepts HTTP in development', () => {
      const originalEnvironment = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      try {
        const result = validateAndNormalizeUrl(
          'http://example.com'
        );
        assert.equal(result.valid, true);
        assert.equal(result.normalized, 'http://example.com/');
      } finally {
        process.env.NODE_ENV = originalEnvironment;
      }
    });

    it('rejects HTTP in production', () => {
      const originalEnvironment = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      try {
        const result = validateAndNormalizeUrl(
          'http://example.com'
        );
        assert.equal(result.valid, false);
        assert.equal(result.error, 'PROTOCOL_NOT_ALLOWED');
      } finally {
        process.env.NODE_ENV = originalEnvironment;
      }
    });
  });

  describe('getUrlErrorMessage', () => {
    it('returns Hungarian messages for validation errors', () => {
      assert.match(
        getUrlErrorMessage('EMPTY_REQUIRED'),
        /kötelező/
      );
      assert.match(
        getUrlErrorMessage('DANGEROUS_PROTOCOL'),
        /protokoll/
      );
      assert.match(
        getUrlErrorMessage('INVALID_FORMAT'),
        /formátum/
      );
      assert.match(
        getUrlErrorMessage('CREDENTIALS_NOT_ALLOWED'),
        /hitelesítő/
      );
    });
  });
});
