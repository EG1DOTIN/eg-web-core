/**
 * Security & Sanitization Utilities
 * Provides defense-in-depth protection against Cross-Site Scripting (XSS)
 * and malicious URI schemes in dynamic Markdown content and product links.
 */
/**
 * Validates and sanitizes a URL using strict protocol whitelisting and control character stripping.
 * Prevents `javascript:`, `vbscript:`, `data:`, `blob:`, and obfuscated URI schemes.
 *
 * @param url - The input URL to validate.
 * @param defaultUrl - The fallback URL if invalid (defaults to '#').
 * @returns A safe URL string.
 *
 * @example
 * ```ts
 * sanitizeUrl("javascript:alert(1)"); // Returns "#"
 * sanitizeUrl("https://example.com"); // Returns "https://example.com"
 * sanitizeUrl("/updates.html");       // Returns "/updates.html"
 * ```
 */
export declare const sanitizeUrl: (url: unknown, defaultUrl?: string) => string;
/**
 * Sanitizes an HTML string generated from Markdown or external sources before
 * rendering with `dangerouslySetInnerHTML`.
 *
 * Employs a multi-tier defense:
 * 1. Robust regex sanitization stripping dangerous tags, event handlers, and malicious protocols.
 * 2. In-browser sandboxed DOMParser traversal when available to eliminate edge-case DOM XSS payloads.
 *
 * @param html - Raw HTML string to sanitize.
 * @returns Clean, safe HTML string.
 *
 * @example
 * ```ts
 * const clean = sanitizeHtml('<p>Hello</p><script>alert(1)</script>');
 * // Returns: '<p>Hello</p>'
 * ```
 */
export declare const sanitizeHtml: (html: string) => string;
