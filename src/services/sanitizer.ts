/**
 * Security & Sanitization Utilities
 * Provides defense-in-depth protection against Cross-Site Scripting (XSS)
 * and malicious URI schemes in dynamic Markdown content and product links.
 */

// Permitted protocols for external and internal navigation
const SAFE_URL_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

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
export const sanitizeUrl = (url: unknown, defaultUrl = '#'): string => {
  if (typeof url !== 'string' || !url.trim()) return defaultUrl;
  const raw = url.trim();

  // Strip ASCII control characters, NULL bytes (\0), and non-printable characters
  // Browsers discard \x00-\x1F when parsing URL protocols (e.g., "java\x00script:")
  const cleaned = raw.replace(/[\x00-\x1F\x7F-\x9F]+/g, '').trim();
  if (!cleaned) return defaultUrl;

  // Permit safe image data URIs (PNG, JPEG, GIF, WebP, SVG)
  if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[a-zA-Z0-9+/=]+$/i.test(cleaned)) {
    return raw;
  }

  // Immediately reject dangerous protocols
  if (/^(javascript|vbscript|data|blob|file):/i.test(cleaned)) {
    return defaultUrl;
  }

  // Check if URL has an explicit protocol scheme
  const colonIndex = cleaned.indexOf(':');
  if (colonIndex !== -1) {
    const protocolCandidate = cleaned.slice(0, colonIndex + 1).toLowerCase();
    // If it looks like a protocol (letters and allowed protocol characters before ':')
    if (/^[a-z][a-z0-9+.-]*:$/i.test(protocolCandidate)) {
      if (!SAFE_URL_PROTOCOLS.has(protocolCandidate)) {
        return defaultUrl;
      }
    }
  }

  return raw;
};

// Forbidden element tags that must never be rendered in user-supplied HTML
const FORBIDDEN_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'APPLET',
  'BASE',
  'META',
  'LINK',
  'FORM',
]);

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
export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';

  // 1. Initial Regex Normalization Pass
  let sanitized = html
    // Strip script, style, iframe, object, embed, applet, base, meta, link tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, '')
    .replace(/<base\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    // Strip inline DOM event handlers (e.g. onload=, onclick=, onerror=, onbegin=)
    // Matches whitespace, slash separator (<svg/onload=), or HTML entities
    .replace(/(?:[\s/]|&[\w#]+;)+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')
    // Neutralize dangerous URI protocols in attributes (href, src, action, formaction, xlink:href)
    // Preserves safe image data URIs (data:image/...) while blocking dangerous protocols
    .replace(/(href|action|formaction)\s*=\s*(['"])\s*(?:javascript|vbscript|data|blob):.*?\2/gi, '$1="#"')
    .replace(/(src|xlink:href)\s*=\s*(['"])\s*(?:javascript|vbscript|data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)|blob):.*?\2/gi, '$1="#"');

  // 2. In-Browser Sandboxed DOMParser Validation (Defense-in-Depth)
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(sanitized, 'text/html');

      // Recursively inspect and sanitize DOM nodes
      const sanitizeNode = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toUpperCase();

          // Remove forbidden tags
          if (FORBIDDEN_TAGS.has(tagName)) {
            el.remove();
            return;
          }

          // Inspect and scrub all attributes
          const attributes = Array.from(el.attributes);
          for (const attr of attributes) {
            const attrName = attr.name.toLowerCase();
            const attrVal = attr.value;

            // Strip any on* event handler
            if (attrName.startsWith('on')) {
              el.removeAttribute(attr.name);
              continue;
            }

            // Sanitize URL attributes
            if (['href', 'src', 'action', 'formaction', 'xlink:href'].includes(attrName)) {
              const safe = sanitizeUrl(attrVal, '#');
              if (safe === '#') {
                el.setAttribute(attr.name, '#');
              }
            }

            // Strip style attributes with CSS expression or javascript: injection
            if (attrName === 'style' && /(expression|javascript:|url\(["']?data:)/i.test(attrVal)) {
              el.removeAttribute('style');
            }
          }
        }

        // Walk children
        let child = node.firstChild;
        while (child) {
          const next = child.nextSibling;
          sanitizeNode(child);
          child = next;
        }
      };

      sanitizeNode(doc.body);
      return doc.body.innerHTML;
    } catch {
      // Fallback to regex-cleaned string if DOMParser encounters an environment issue
      return sanitized;
    }
  }

  return sanitized;
};
