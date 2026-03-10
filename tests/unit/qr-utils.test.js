import { describe, it, expect } from 'vitest';
import {
  encodeTextForURL,
  decodeTextFromURL,
  createShareableURL,
  parseShareableURL,
} from '../../src/qr-utils.js';

describe('encodeTextForURL', () => {
  it('encodes plain text to base64', () => {
    expect(encodeTextForURL('Hello')).toBe('SGVsbG8=');
  });

  it('encodes URLs with special characters', () => {
    const encoded = encodeTextForURL('https://example.com/path?foo=bar');
    expect(decodeTextFromURL(encoded)).toBe('https://example.com/path?foo=bar');
  });

  it('encodes Unicode text', () => {
    const encoded = encodeTextForURL('日本語');
    expect(decodeTextFromURL(encoded)).toBe('日本語');
  });

  it('encodes empty string', () => {
    expect(encodeTextForURL('')).toBe('');
  });
});

describe('decodeTextFromURL', () => {
  it('decodes base64 encoded text', () => {
    expect(decodeTextFromURL('SGVsbG8=')).toBe('Hello');
  });

  it('decodes URL-encoded content', () => {
    const encoded = encodeTextForURL('Hello World');
    expect(decodeTextFromURL(encoded)).toBe('Hello World');
  });

  it('round-trips with encodeTextForURL', () => {
    const inputs = ['Hello', 'https://test.com', 'Special chars: !@#$%', '日本語', ''];
    inputs.forEach((input) => {
      expect(decodeTextFromURL(encodeTextForURL(input))).toBe(input);
    });
  });
});

describe('createShareableURL', () => {
  it('creates URL with text and size parameters', () => {
    const url = createShareableURL('Hello', 200, 'http://localhost/');
    expect(url).toContain('?text=');
    expect(url).toContain('&size=200');
    expect(url).toMatch(/^http:\/\/localhost\?text=/);
  });

  it('uses default baseUrl when not provided', () => {
    const url = createShareableURL('test', 128);
    expect(url).toMatch(/^http:\/\/localhost\/?/);
    expect(url).toContain('size=128');
  });

  it('handles baseUrl with existing path', () => {
    const url = createShareableURL('data', 256, 'https://example.com/qr');
    expect(url).toMatch(/^https:\/\/example\.com\/qr/);
    expect(url).toContain('text=');
    expect(url).toContain('size=256');
  });

  it('encodes text correctly in URL', () => {
    const url = createShareableURL('Hello World', 200, 'http://test.com');
    const parsed = parseShareableURL(url);
    expect(parsed.text).toBe('Hello World');
    expect(parsed.size).toBe('200');
  });
});

describe('parseShareableURL', () => {
  it('extracts text and size from full URL', () => {
    const url = createShareableURL('My QR Content', 384, 'https://example.com');
    const parsed = parseShareableURL(url);
    expect(parsed.text).toBe('My QR Content');
    expect(parsed.size).toBe('384');
  });

  it('returns null for missing parameters', () => {
    const parsed = parseShareableURL('http://localhost/?foo=bar');
    expect(parsed.text).toBeNull();
    expect(parsed.size).toBeNull();
  });

  it('handles query string only', () => {
    const fullUrl = createShareableURL('test', 512, 'http://localhost/');
    const queryPart = fullUrl.split('?')[1];
    const parsed = parseShareableURL('http://dummy.com/?' + queryPart);
    expect(parsed.text).toBe('test');
    expect(parsed.size).toBe('512');
  });

  it('handles invalid URL gracefully', () => {
    const parsed = parseShareableURL('not-a-valid-url');
    expect(parsed.text).toBeNull();
    expect(parsed.size).toBeNull();
  });
});
