/**
 * Pure utility functions for QR Code Generator - testable without DOM
 */

// Node.js compatibility for btoa/atob (not available in Node by default)
const safeBtoa = (str) =>
  typeof btoa !== 'undefined'
    ? btoa(str)
    : Buffer.from(str, 'binary').toString('base64');
const safeAtob = (str) =>
  typeof atob !== 'undefined'
    ? atob(str)
    : Buffer.from(str, 'base64').toString('binary');

/**
 * Encodes text for use in shareable URL (base64 of URI-encoded text)
 * @param {string} text - Raw text to encode
 * @returns {string} Base64 encoded string
 */
export function encodeTextForURL(text) {
  return safeBtoa(encodeURIComponent(text));
}

/**
 * Decodes text from shareable URL parameter
 * @param {string} encodedText - Base64 encoded text from URL
 * @returns {string} Decoded text
 */
export function decodeTextFromURL(encodedText) {
  return decodeURIComponent(safeAtob(encodedText));
}

/**
 * Creates a shareable URL with encoded text and size parameters
 * @param {string} text - Content for the QR code
 * @param {string|number} size - QR code size in pixels
 * @param {string} baseUrl - Base URL (origin + pathname)
 * @returns {string} Full shareable URL
 */
export function createShareableURL(text, size, baseUrl = 'http://localhost/') {
  const encodedText = encodeTextForURL(text);
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl.replace(/\/?$/, '')}${separator}text=${encodedText}&size=${size}`;
}

/**
 * Parses shareable URL and extracts text and size
 * @param {string} url - Full URL or query string
 * @returns {{ text: string|null, size: string|null }}
 */
export function parseShareableURL(url) {
  try {
    const urlObj = url.startsWith('http') ? new URL(url) : new URL(url, 'http://localhost');
    const encodedText = urlObj.searchParams.get('text');
    const size = urlObj.searchParams.get('size');
    return {
      text: encodedText ? decodeTextFromURL(encodedText) : null,
      size: size || null,
    };
  } catch {
    return { text: null, size: null };
  }
}
