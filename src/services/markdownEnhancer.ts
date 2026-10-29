/**
 * @file markdownEnhancer.ts
 * @description Production-grade, high-performance Markdown & Diagram Enhancer for EG-Web-Core.
 *
 * Implements full functionalities matching av.eg1.in:
 * 1. Interactive Mermaid Architecture & Flow Diagrams with:
 *    - In-page container with scroll/drag-to-scroll
 *    - Header with diagram badge, scroll hint, "View Source", "Copy", and "Fullscreen" expand
 *    - Fullscreen Diagram Zoom & Pan Modal with +/- zoom, reset, mouse wheel zooming, drag-to-pan, and Esc exit
 * 2. GitHub Dark code blocks with language tags, copy buttons with "Copied!" feedback, and syntax highlighting.
 * 3. GitHub-style alert callouts ([!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]).
 * 4. Responsive table wrappers preventing layout breaks.
 * 5. Heading permalinks with slugified anchor IDs.
 */

import { marked } from 'marked';
import { sanitizeHtml, sanitizeUrl } from './sanitizer';

// --------------------------------------------------------------------------
// 1. Types & Local Interfaces (Zero Global Pollution to prevent TS2717)
// --------------------------------------------------------------------------

interface MermaidApi {
  initialize: (config: Record<string, unknown>) => void;
  run?: (options: { nodes: ArrayLike<HTMLElement> }) => Promise<void>;
  init?: (config?: unknown, nodes?: ArrayLike<HTMLElement>) => void;
  render?: (id: string, text: string) => Promise<{ svg: string }>;
}

interface PrismApi {
  highlightAllUnder: (container: Element) => void;
  highlightElement: (element: Element) => void;
}

function getGlobalMermaid(): MermaidApi | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { mermaid?: MermaidApi }).mermaid;
}

function getGlobalPrism(): PrismApi | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { Prism?: PrismApi }).Prism;
}

let mermaidLoadingPromise: Promise<MermaidApi | null> | null = null;
let prismLoadingPromise: Promise<PrismApi | null> | null = null;

// --------------------------------------------------------------------------
// 2. Slugify & Helpers
// --------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function escapeHtmlEntities(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function isDarkTheme(): boolean {
  if (typeof document === 'undefined') return false;
  const theme = document.documentElement.getAttribute('data-theme') || '';
  return theme.includes('dark') || theme.includes('crystal') || theme === 'clamui-dark';
}

// --------------------------------------------------------------------------
// 3. Script Lazy Loaders (Local vendor assets with CDN fallback)
// --------------------------------------------------------------------------

export function ensureMermaidLoaded(): Promise<MermaidApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const currentMermaid = getGlobalMermaid();
  if (currentMermaid) return Promise.resolve(currentMermaid);

  if (mermaidLoadingPromise) return mermaidLoadingPromise;

  mermaidLoadingPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-mermaid-script]');
    if (existing) {
      existing.addEventListener('load', () => {
        initMermaid();
        resolve(getGlobalMermaid() || null);
      });
      existing.addEventListener('error', () => resolve(null));
      return;
    }

    const script = document.createElement('script');
    // Try local vendor first, then fallback
    script.src = '/vendor/mermaid.min.js';
    script.async = true;
    script.setAttribute('data-mermaid-script', 'true');

    script.onload = () => {
      initMermaid();
      resolve(getGlobalMermaid() || null);
    };

    script.onerror = () => {
      // Fallback 1: relative vendor path
      const fbScript = document.createElement('script');
      fbScript.src = 'vendor/mermaid.min.js';
      fbScript.async = true;
      fbScript.onload = () => {
        initMermaid();
        resolve(getGlobalMermaid() || null);
      };
      fbScript.onerror = () => {
        // Fallback 2: CDN
        const cdnScript = document.createElement('script');
        cdnScript.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
        cdnScript.async = true;
        cdnScript.onload = () => {
          initMermaid();
          resolve(getGlobalMermaid() || null);
        };
        cdnScript.onerror = () => {
          console.warn('Unable to load Mermaid script.');
          resolve(null);
        };
        document.head.appendChild(cdnScript);
      };
      document.head.appendChild(fbScript);
    };

    document.head.appendChild(script);
  });

  return mermaidLoadingPromise;
}

function initMermaid(): void {
  const m = getGlobalMermaid();
  if (!m) return;
  try {
    m.initialize({
      startOnLoad: false,
      theme: isDarkTheme() ? 'dark' : 'default',
      themeVariables: isDarkTheme()
        ? {
            darkMode: true,
            background: '#0d0e12',
            primaryColor: '#1b1b24',
            primaryTextColor: '#f4f4f6',
            primaryBorderColor: '#00dc82',
            lineColor: '#38bdf8',
            secondaryColor: '#15151c',
            tertiaryColor: '#101015',
          }
        : undefined,
      securityLevel: 'loose',
      fontFamily: 'var(--eg-font-sans, -apple-system, sans-serif)',
    });
  } catch (err) {
    console.warn('Mermaid initialization warning:', err);
  }
}

export function ensurePrismLoaded(): Promise<PrismApi | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const currentPrism = getGlobalPrism();
  if (currentPrism) return Promise.resolve(currentPrism);

  if (prismLoadingPromise) return prismLoadingPromise;

  prismLoadingPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = '/vendor/prism.bundle.js';
    script.async = true;
    script.onload = () => resolve(getGlobalPrism() || null);
    script.onerror = () => {
      const fb = document.createElement('script');
      fb.src = 'vendor/prism.bundle.js';
      fb.async = true;
      fb.onload = () => resolve(getGlobalPrism() || null);
      fb.onerror = () => resolve(null);
      document.head.appendChild(fb);
    };
    document.head.appendChild(script);
  });

  return prismLoadingPromise;
}

// --------------------------------------------------------------------------
// 4. GitHub-Style Callout Alert SVGs & Transformer
// --------------------------------------------------------------------------

const ALERT_SVG_STRINGS: Record<string, string> = {
  NOTE: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  TIP: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path></svg>`,
  IMPORTANT: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
  WARNING: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  CAUTION: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
};

export function transformAlertCallouts(html: string): string {
  return html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (_, type, content) => {
      const t = type.toUpperCase();
      const iconSvg = ALERT_SVG_STRINGS[t] || ALERT_SVG_STRINGS.NOTE;
      return `
        <div class="docs-alert ${t.toLowerCase()}">
          <div class="docs-alert-icon">${iconSvg}</div>
          <div class="docs-alert-content">
            <div class="docs-alert-title">${t}</div>
            <div class="docs-alert-body">${content}</div>
          </div>
        </div>
      `;
    }
  );
}

// --------------------------------------------------------------------------
// 5. High-Fidelity Multi-Language Syntax Highlighting Engine
// --------------------------------------------------------------------------

function initPrismExtensions(prism: any): void {
  if (!prism || !prism.languages) return;
  const js = prism.languages.javascript;
  if (!js) return;

  if (!prism.languages.typescript) {
    prism.languages.typescript = prism.languages.extend('javascript', {
      'class-name': {
        pattern: /(\b(?:class|interface|extends|implements|instanceof|new|type)\s+)[\w.\\]+/,
        lookbehind: true,
      },
      keyword:
        /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|readonly|return|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield|declare|namespace|module|abstract|keyof|is|never|unknown|any|boolean|number|string)\b/,
    });
    prism.languages.ts = prism.languages.typescript;
  }

  if (!prism.languages.tsx) {
    prism.languages.tsx = prism.languages.extend('javascript', {
      tag: {
        pattern:
          /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
        greedy: true,
        inside: {
          tag: {
            pattern: /^<\/?[^\s>\/]+/,
            inside: {
              punctuation: /^<\/?/,
              namespace: /^[^\s>\/:]+:/,
            },
          },
          'attr-value': {
            pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
            inside: {
              punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/],
            },
          },
          punctuation: /\/?>/,
          'attr-name': {
            pattern: /[^\s>\/]+/,
            inside: {
              namespace: /^[^\s>\/:]+:/,
            },
          },
        },
      },
    });
    prism.languages.jsx = prism.languages.tsx;
  }
}

export function highlightCode(rawCode: string, lang: string): string {
  const language = (lang || '').toLowerCase().trim();

  // 1. Try Prism if loaded and configured
  if (typeof window !== 'undefined') {
    const prism = getGlobalPrism();
    if (prism) {
      initPrismExtensions(prism);
      const grammarKey =
        language === 'ts' || language === 'typescript'
          ? 'typescript'
          : language === 'tsx'
          ? 'tsx'
          : language === 'jsx'
          ? 'jsx'
          : language === 'js'
          ? 'javascript'
          : language === 'py'
          ? 'python'
          : language === 'sh' || language === 'shell'
          ? 'bash'
          : language;
      const grammar = (prism as any).languages?.[grammarKey];
      if (grammar && typeof (prism as any).highlight === 'function') {
        try {
          return (prism as any).highlight(rawCode, grammar, grammarKey);
        } catch (_) {}
      }
    }
  }

  // 2. High-precision procedural syntax highlighter with GitHub Dark palette
  const isPython = /python|py/i.test(language);
  const isCpp = /c\+\+|cpp|c|csharp|c#/i.test(language);
  const isBash = /bash|sh|shell|zsh/i.test(language);
  const isCss = /css|scss|less/i.test(language);
  const isJson = /json/i.test(language);
  const isJs = !isPython && !isCpp && !isBash && !isCss && !isJson;

  const tokens: Array<{ placeholder: string; html: string }> = [];
  let tokenIdx = 0;
  const storeToken = (cls: string, text: string) => {
    const ph = `\x02eghigh_${tokenIdx++}\x03`;
    tokens.push({
      placeholder: ph,
      html: `<span class="${cls}">${escapeHtmlEntities(text)}</span>`,
    });
    return ph;
  };

  let processed = rawCode;

  // Comments
  if (isPython || isBash) {
    if (isPython) {
      processed = processed.replace(/("""[\s\S]*?"""|'''[\s\S]*?''')/g, (m) =>
        storeToken('hljs-comment token comment', m)
      );
    }
    processed = processed.replace(/(#.*$)/gm, (m) => storeToken('hljs-comment token comment', m));
  } else {
    processed = processed.replace(/(\/\*[\s\S]*?\*\/)/g, (m) => storeToken('hljs-comment token comment', m));
    processed = processed.replace(/(\/\/.*$)/gm, (m) => storeToken('hljs-comment token comment', m));
  }

  // C++ / Preprocessor
  if (isCpp) {
    processed = processed.replace(/^(#\s*[a-zA-Z_]+.*)$/gm, (m) => storeToken('hljs-meta token important', m));
  }

  // Strings (Double, Single, Template literals)
  processed = processed.replace(/(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (m) =>
    storeToken('hljs-string token string', m)
  );

  // JSX / HTML Tags & Components
  if (isJs) {
    // Closing tags: </Component> or </div>
    processed = processed.replace(/(<\/)([a-zA-Z0-9_.-]+)(>)/g, (_m, p1, p2, p3) => {
      return (
        storeToken('hljs-punctuation token punctuation', p1) +
        storeToken('hljs-tag token tag', p2) +
        storeToken('hljs-punctuation token punctuation', p3)
      );
    });

    // Opening tags and their attributes: <Button variant="primary" onClick=... >
    processed = processed.replace(/(<[A-Za-z0-9_.-]+)([^>]*?)(\/?>)/g, (_full, openTag, attrs, closeBracket) => {
      const tagContent = openTag.slice(1);
      const highlightedTag =
        storeToken('hljs-punctuation token punctuation', '<') +
        storeToken('hljs-tag token tag', tagContent);
      const highlightedAttrs = attrs.replace(/\b([a-zA-Z_:][a-zA-Z0-9_.-]*)(?=\s*=)/g, (attrName: string) =>
        storeToken('hljs-attr token attr-name', attrName)
      );
      const highlightedClose = storeToken('hljs-punctuation token punctuation', closeBracket);
      return highlightedTag + highlightedAttrs + highlightedClose;
    });
  }

  // Numbers (Hex, floats, integers)
  processed = processed.replace(/\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, (m) =>
    storeToken('hljs-number token number', m)
  );

  // Keywords (Run BEFORE function call matching to prevent `return(` or `if(` from matching as functions)
  const jsKeywords =
    /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|readonly|return|set|static|super|switch|this|throw|true|try|type|typeof|var|void|while|with|yield|declare|namespace|module|abstract|keyof|is)\b/g;
  const pyKeywords =
    /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|self|cls)\b/g;
  const cppKeywords =
    /\b(alignas|alignof|auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while)\b/g;
  const bashKeywords =
    /\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|return|exit|echo|export|source|local|sudo|npm|npx|git|cd|mkdir|rm|cp|mv)\b/g;

  if (isJs) {
    processed = processed.replace(jsKeywords, (m) => storeToken('hljs-keyword token keyword', m));
  } else if (isPython) {
    processed = processed.replace(pyKeywords, (m) => storeToken('hljs-keyword token keyword', m));
  } else if (isCpp) {
    processed = processed.replace(cppKeywords, (m) => storeToken('hljs-keyword token keyword', m));
  } else if (isBash) {
    processed = processed.replace(bashKeywords, (m) => storeToken('hljs-keyword token keyword', m));
  }

  // Functions (not matching control flow keywords or token placeholders)
  processed = processed.replace(
    /\b(?!(?:eghigh|return|if|for|while|switch|catch|void|typeof|delete|await|yield)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    (_m, name) => storeToken('hljs-title function_ token function', name)
  );

  // Capitalized Types, Interfaces, & React Components
  if (isJs) {
    processed = processed.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b/g, (m) => storeToken('hljs-type token class-name', m));
    // TypeScript primitive types
    processed = processed.replace(/\b(string|number|boolean|any|unknown|never|void)\b/g, (m) =>
      storeToken('hljs-type token class-name', m)
    );
  }

  // Arrow functions & operators
  if (isJs) {
    processed = processed.replace(/(=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?)/g, (m) =>
      storeToken('hljs-operator token operator', m)
    );
  }

  // JSON keys
  if (isJson) {
    processed = processed.replace(/"([^"]+)"\s*(?=:)/g, (_m, key) => `"${storeToken('hljs-attr token property', key)}"`);
  }

  let finalHtml = escapeHtmlEntities(processed);
  for (let i = tokens.length - 1; i >= 0; i--) {
    finalHtml = finalHtml.replace(tokens[i].placeholder, tokens[i].html);
  }

  return finalHtml;
}

// --------------------------------------------------------------------------
// 6. Custom Marked Renderer Factory
// --------------------------------------------------------------------------

export function createCustomMarkedRenderer(): InstanceType<typeof marked.Renderer> {
  const renderer = new marked.Renderer();

  // Heading with permalink anchor
  renderer.heading = function (arg1: any, arg2?: any) {
    let depth = 1;
    let text = '';
    if (typeof arg1 === 'object' && arg1 !== null && 'tokens' in arg1) {
      const obj = arg1 as { depth?: number; tokens: any[]; text?: string };
      depth = obj.depth || 1;
      text = this.parser ? this.parser.parseInline(obj.tokens) : (obj.text || '');
    } else {
      text = String(arg1 || '');
      depth = Number(arg2 || 1);
    }
    const clean = text.replace(/<[^>]*>/g, '').trim();
    const slug = slugify(clean);
    return `<h${depth} id="${slug}"><span>${text}</span><a href="#${slug}" class="header-anchor" aria-label="Permalink to ${clean}">#</a></h${depth}>\n`;
  };

  // Code & Mermaid blocks
  renderer.code = function (arg1: unknown, arg2?: unknown) {
    let text = '';
    let lang = '';
    if (typeof arg1 === 'object' && arg1 !== null && 'text' in arg1) {
      const obj = arg1 as { text: string; lang?: string };
      text = obj.text || '';
      lang = (obj.lang || '').trim().toLowerCase();
    } else {
      text = String(arg1 || '');
      lang = String(arg2 || '').trim().toLowerCase();
    }

    // Mermaid Diagram
    if (
      lang === 'mermaid' ||
      text.startsWith('graph ') ||
      text.startsWith('sequenceDiagram') ||
      text.startsWith('flowchart ') ||
      text.startsWith('classDiagram') ||
      text.startsWith('stateDiagram') ||
      text.startsWith('erDiagram') ||
      text.startsWith('gantt') ||
      text.startsWith('pie')
    ) {
      const encodedSource = escapeHtmlEntities(text);
      return `
        <div class="mermaid-wrapper">
          <div class="mermaid-header">
            <span class="mermaid-header-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Architecture &amp; Flow Diagram</span>
            </span>
            <div class="mermaid-header-actions">
              <span class="mermaid-scroll-hint">↔ Scroll or Drag to Explore</span>
              <button type="button" class="mermaid-action-btn mermaid-expand-btn" aria-label="Expand Diagram Fullscreen">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <span>Fullscreen</span>
              </button>
              <button type="button" class="mermaid-action-btn mermaid-source-btn" aria-label="Toggle diagram source code">
                <span>View Source</span>
              </button>
              <button type="button" class="mermaid-action-btn mermaid-copy-btn" aria-label="Copy diagram source">
                <span>Copy</span>
              </button>
            </div>
          </div>
          <div class="mermaid-container" title="Click and drag to scroll • Double-click for Fullscreen">
            <pre class="mermaid" data-raw-source="${encodeURIComponent(text)}">${encodedSource}</pre>
          </div>
          <div class="mermaid-source-pane">
            <pre><code>${encodedSource}</code></pre>
          </div>
        </div>
      `;
    }

    // Standard Code Block (Vibrant Syntax Highlighting pre-rendered)
    const displayLang = lang ? lang.toUpperCase() : 'CODE';
    const highlighted = highlightCode(text, lang);

    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-block-lang">${displayLang}</span>
          <button type="button" class="code-copy-btn" aria-label="Copy code block">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre class="language-${lang}"><code class="language-${lang} hljs hljs-rendered">${highlighted}</code></pre>
      </div>
    `;
  };

  // Documentation Images (png, jpg, jpeg, gif, webp, svg, data URIs) with lightbox support
  renderer.image = function (arg1: any, arg2?: any, arg3?: any) {
    let href = '';
    let title = '';
    let text = '';
    if (typeof arg1 === 'object' && arg1 !== null && 'href' in arg1) {
      const obj = arg1 as { href: string; title?: string; text?: string };
      href = obj.href || '';
      title = obj.title || '';
      text = obj.text || '';
    } else {
      href = String(arg1 || '');
      title = String(arg2 || '');
      text = String(arg3 || '');
    }

    const safeSrc = sanitizeUrl(href);
    const altAttr = text ? ` alt="${escapeHtmlEntities(text)}"` : '';
    const titleAttr = title ? ` title="${escapeHtmlEntities(title)}"` : '';

    return `
      <figure class="docs-image-figure">
        <img src="${safeSrc}"${altAttr}${titleAttr} class="docs-image" loading="lazy" />
        ${title ? `<figcaption class="docs-image-caption">${escapeHtmlEntities(title)}</figcaption>` : ''}
      </figure>
    `;
  };

  // Responsive Table Wrapper
  renderer.table = function (arg1: any, arg2?: any) {
    if (typeof arg1 === 'object' && arg1 !== null && 'header' in arg1) {
      const obj = arg1 as { header: any[]; rows: any[][] };
      let headerHtml = '';
      obj.header.forEach((cell) => {
        headerHtml += `<th>${this.parser ? this.parser.parseInline(cell.tokens) : cell.text}</th>`;
      });
      let bodyHtml = '';
      obj.rows.forEach((row) => {
        bodyHtml += '<tr>';
        row.forEach((cell) => {
          bodyHtml += `<td>${this.parser ? this.parser.parseInline(cell.tokens) : cell.text}</td>`;
        });
        bodyHtml += '</tr>';
      });
      return `
        <div class="table-responsive-wrapper">
          <table>
            <thead><tr>${headerHtml}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </div>
      `;
    }

    const header = String(arg1 || '');
    const body = String(arg2 || '');
    return `
      <div class="table-responsive-wrapper">
        <table>
          <thead>${header}</thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    `;
  };

  // Safe links
  renderer.link = function (arg1: any, arg2?: any, arg3?: any) {
    let href = '';
    let title = '';
    let text = '';
    if (typeof arg1 === 'object' && arg1 !== null && 'href' in arg1) {
      const obj = arg1 as { href: string; title?: string | null; tokens: any[]; text?: string };
      href = obj.href || '';
      title = obj.title || '';
      text = this.parser ? this.parser.parseInline(obj.tokens) : (obj.text || '');
    } else {
      href = String(arg1 || '');
      title = String(arg2 || '');
      text = String(arg3 || '');
    }

    if (!href) return text;
    if (href.startsWith('#')) {
      return `<a href="${href}" class="docs-internal-anchor">${text}</a>`;
    }

    const safeUrl = sanitizeUrl(href);
    const titleAttr = title ? ` title="${escapeHtmlEntities(title)}"` : '';
    const isExternal = /^https?:\/\//i.test(safeUrl);
    const targetRel = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${safeUrl}"${targetRel}${titleAttr}>${text}</a>`;
  };

  return renderer;
}

// --------------------------------------------------------------------------
// 7. Universal parseMarkdownToHtml Parser
// --------------------------------------------------------------------------

export function parseMarkdownToHtml(markdown: string): string {
  if (!markdown || !markdown.trim()) return '';
  const renderer = createCustomMarkedRenderer();
  let rawHtml = '';

  try {
    rawHtml = marked.parse(markdown, { renderer, gfm: true }) as string;
  } catch (err) {
    console.warn('Marked parsing error:', err);
    rawHtml = marked.parse(markdown) as string;
  }

  // Transform GitHub Alert Callouts
  const transformed = transformAlertCallouts(rawHtml);

  // Security Sanitization
  return sanitizeHtml(transformed);
}

// --------------------------------------------------------------------------
// 8. Fullscreen Mermaid Diagram Zoom & Pan Modal Controller (DOM Singleton)
// --------------------------------------------------------------------------

let modalCurrentZoom = 1;
let modalPanX = 0;
let modalPanY = 0;
let isPanningModal = false;
let modalStartX = 0;
let modalStartY = 0;

function createOrGetMermaidModal(): HTMLElement {
  let modalOverlay = document.getElementById('egMermaidGlobalModal');
  if (modalOverlay) return modalOverlay;

  modalOverlay = document.createElement('div');
  modalOverlay.id = 'egMermaidGlobalModal';
  modalOverlay.className = 'mermaid-modal-overlay';
  modalOverlay.innerHTML = `
    <div class="mermaid-modal-box" role="dialog" aria-modal="true" aria-label="Fullscreen Diagram Viewer">
      <div class="mermaid-modal-header">
        <div class="mermaid-modal-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span id="egMermaidModalTitle">Architecture &amp; Flow Diagram</span>
        </div>
        <div class="mermaid-modal-tools">
          <span id="egMermaidZoomBadge" class="mermaid-zoom-badge">100%</span>
          <button type="button" id="egMermaidZoomIn" class="mermaid-tool-btn" title="Zoom In">+</button>
          <button type="button" id="egMermaidZoomOut" class="mermaid-tool-btn" title="Zoom Out">-</button>
          <button type="button" id="egMermaidZoomReset" class="mermaid-tool-btn" title="Reset Zoom">Reset</button>
          <button type="button" id="egMermaidModalClose" class="mermaid-tool-btn" title="Close (Esc)" style="margin-left: 8px;">✕</button>
        </div>
      </div>
      <div id="egMermaidModalBody" class="mermaid-modal-body">
        <div id="egMermaidViewport" class="mermaid-modal-viewport"></div>
      </div>
      <div class="mermaid-modal-footer">
        <span class="mermaid-hint">Tip: Click and drag to pan • Mouse wheel to zoom • Press Esc to close</span>
        <button type="button" id="egMermaidCloseBtn2" class="mermaid-action-btn">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Wire up modal event handlers
  const closeBtn1 = modalOverlay.querySelector('#egMermaidModalClose');
  const closeBtn2 = modalOverlay.querySelector('#egMermaidCloseBtn2');
  const zoomInBtn = modalOverlay.querySelector('#egMermaidZoomIn');
  const zoomOutBtn = modalOverlay.querySelector('#egMermaidZoomOut');
  const zoomResetBtn = modalOverlay.querySelector('#egMermaidZoomReset');
  const modalBody = modalOverlay.querySelector('#egMermaidModalBody');

  const updateTransform = () => {
    const vp = modalOverlay?.querySelector<HTMLElement>('#egMermaidViewport');
    const badge = modalOverlay?.querySelector('#egMermaidZoomBadge');
    if (vp) {
      vp.style.transform = `translate(${modalPanX}px, ${modalPanY}px) scale(${modalCurrentZoom})`;
    }
    if (badge) {
      badge.textContent = `${Math.round(modalCurrentZoom * 100)}%`;
    }
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    const vp = modalOverlay.querySelector('#egMermaidViewport');
    if (vp) vp.innerHTML = '';
  };

  closeBtn1?.addEventListener('click', closeModal);
  closeBtn2?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  zoomInBtn?.addEventListener('click', () => {
    modalCurrentZoom = Math.min(6.0, Number((modalCurrentZoom + 0.25).toFixed(2)));
    updateTransform();
  });

  zoomOutBtn?.addEventListener('click', () => {
    modalCurrentZoom = Math.max(0.2, Number((modalCurrentZoom - 0.25).toFixed(2)));
    updateTransform();
  });

  zoomResetBtn?.addEventListener('click', () => {
    modalCurrentZoom = 1;
    modalPanX = 0;
    modalPanY = 0;
    updateTransform();
  });

  if (modalBody) {
    // Wheel zoom
    modalBody.addEventListener(
      'wheel',
      (e) => {
        const we = e as WheelEvent;
        we.preventDefault();
        const delta = we.deltaY < 0 ? 0.15 : -0.15;
        modalCurrentZoom = Math.max(0.15, Math.min(6.0, Number((modalCurrentZoom + delta).toFixed(2))));
        updateTransform();
      },
      { passive: false }
    );

    // Mouse drag to pan
    modalBody.addEventListener('mousedown', (e) => {
      const me = e as MouseEvent;
      isPanningModal = true;
      modalStartX = me.clientX - modalPanX;
      modalStartY = me.clientY - modalPanY;
    });

    window.addEventListener('mouseup', () => {
      isPanningModal = false;
    });

    modalBody.addEventListener('mousemove', (e) => {
      if (!isPanningModal) return;
      const me = e as MouseEvent;
      me.preventDefault();
      modalPanX = me.clientX - modalStartX;
      modalPanY = me.clientY - modalStartY;
      updateTransform();
    });
  }

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) {
      closeModal();
    }
  });

  return modalOverlay;
}

export function openMermaidFullscreenModal(svgEl: SVGElement, title = 'Architecture & Flow Diagram'): void {
  const overlay = createOrGetMermaidModal();
  const titleSpan = overlay.querySelector('#egMermaidModalTitle');
  const viewport = overlay.querySelector<HTMLElement>('#egMermaidViewport');
  const body = overlay.querySelector<HTMLElement>('#egMermaidModalBody');
  if (!viewport || !svgEl) return;

  // Safeguard: Ensure we always display the actual diagram SVG from .mermaid-container, never the header title icon
  const wrapper = svgEl.closest('.mermaid-wrapper');
  if (wrapper) {
    const actualDiagram = wrapper.querySelector<SVGElement>('.mermaid-container svg');
    if (actualDiagram) {
      svgEl = actualDiagram;
    }
  }

  if (titleSpan) titleSpan.textContent = title;
  viewport.innerHTML = '';

  const clonedSvg = svgEl.cloneNode(true) as SVGElement;

  // Determine explicit dimensions
  let width = 1000;
  let height = 600;

  const viewBox = (clonedSvg as SVGSVGElement).viewBox?.baseVal;
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    width = viewBox.width;
    height = viewBox.height;
  } else {
    const bcr = svgEl.getBoundingClientRect();
    if (bcr.width > 0 && bcr.height > 0) {
      width = bcr.width;
      height = bcr.height;
    }
  }

  const existingViewBox = svgEl.getAttribute('viewBox');
  if (existingViewBox) {
    clonedSvg.setAttribute('viewBox', existingViewBox);
  } else {
    clonedSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }
  clonedSvg.setAttribute('width', `${width}`);
  clonedSvg.setAttribute('height', `${height}`);
  clonedSvg.style.width = `${width}px`;
  clonedSvg.style.height = `${height}px`;
  clonedSvg.style.minWidth = `${width}px`;
  clonedSvg.style.maxWidth = 'none';
  clonedSvg.style.display = 'block';

  // Open modal FIRST to ensure modal body dimensions are measurable
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  viewport.appendChild(clonedSvg);

  // Calculate fit zoom
  const bodyRect = body ? body.getBoundingClientRect() : null;
  const availWidth = bodyRect && bodyRect.width > 0 ? bodyRect.width - 80 : 1100;
  const availHeight = bodyRect && bodyRect.height > 0 ? bodyRect.height - 80 : 700;

  const scaleX = availWidth / width;
  const scaleY = availHeight / height;
  const fitZoom = Math.min(scaleX, scaleY, 1.2);

  modalCurrentZoom = Number(Math.max(0.3, fitZoom).toFixed(2));
  modalPanX = 0;
  modalPanY = 0;

  viewport.style.transform = `translate(0px, 0px) scale(${modalCurrentZoom})`;
  const badge = overlay.querySelector('#egMermaidZoomBadge');
  if (badge) badge.textContent = `${Math.round(modalCurrentZoom * 100)}%`;
}

// --------------------------------------------------------------------------
// 8.5. Fullscreen Image Lightbox Modal Controller (DOM Singleton)
// --------------------------------------------------------------------------

let activeImageModal: HTMLElement | null = null;

function getOrCreateImageLightbox(): HTMLElement {
  if (typeof document === 'undefined') return {} as HTMLElement;
  if (activeImageModal && document.body.contains(activeImageModal)) {
    return activeImageModal;
  }

  const overlay = document.createElement('div');
  overlay.className = 'mermaid-modal-overlay docs-image-modal-overlay';
  overlay.id = 'egImageLightboxOverlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image Lightbox Preview');

  overlay.innerHTML = `
    <div class="mermaid-modal-box docs-image-modal-box" style="max-width: 1000px; height: auto; max-height: 90vh;">
      <div class="mermaid-modal-header">
        <div class="mermaid-modal-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span id="egImageModalTitle">Image Preview</span>
        </div>
        <button type="button" class="mermaid-tool-btn" id="egImageModalClose" aria-label="Close Preview">✕</button>
      </div>
      <div class="mermaid-modal-body" style="padding: 24px; cursor: default; overflow: auto; background: #07080a; display: flex; align-items: center; justify-content: center;">
        <img id="egImageModalImg" src="" alt="Preview" style="max-width: 100%; max-height: 75vh; object-fit: contain; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.7); display: block;" />
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#egImageModalClose');
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  activeImageModal = overlay;
  return overlay;
}

export function openImageLightbox(src: string, title?: string): void {
  if (typeof document === 'undefined') return;
  const overlay = getOrCreateImageLightbox();
  const titleEl = overlay.querySelector('#egImageModalTitle');
  const imgEl = overlay.querySelector<HTMLImageElement>('#egImageModalImg');

  if (titleEl) titleEl.textContent = title || 'Image Preview';
  if (imgEl) imgEl.src = src;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// --------------------------------------------------------------------------
// 9. Horizontal Drag to Scroll Helper
// --------------------------------------------------------------------------

function enableDragToScroll(container: HTMLElement): void {
  if (container.dataset.dragEnabled) return;
  container.dataset.dragEnabled = '1';

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  container.addEventListener('mousedown', (e) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });
  container.addEventListener('mouseleave', () => {
    isDown = false;
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeft - walk;
  });
}

// --------------------------------------------------------------------------
// 10. enhanceMarkdownContainer (Master DOM Enhancer)
// --------------------------------------------------------------------------

export function enhanceMarkdownContainer(
  container: HTMLElement | null,
  onOpenDiagramModal?: (svg: SVGElement, title: string) => void
): void {
  if (!container || typeof window === 'undefined') return;

  // 1. Process Mermaid Diagrams
  const mermaidNodes = container.querySelectorAll<HTMLElement>('.mermaid');
  if (mermaidNodes.length > 0) {
    ensureMermaidLoaded()
      .then((m) => {
        if (!m) return;
        const currentNodes = container.querySelectorAll<HTMLElement>('.mermaid');
        if (currentNodes.length === 0) return;

        if (typeof m.run === 'function') {
          m.run({ nodes: currentNodes })
            .then(() => postProcessMermaidDiagrams(container, onOpenDiagramModal))
            .catch(() => postProcessMermaidDiagrams(container, onOpenDiagramModal));
        } else if (typeof m.init === 'function') {
          m.init(undefined, currentNodes);
          postProcessMermaidDiagrams(container, onOpenDiagramModal);
        }
      })
      .catch((err) => {
        console.warn('Mermaid enhancement notice:', err);
      });
  } else if (container.querySelectorAll('.mermaid-wrapper').length > 0) {
    postProcessMermaidDiagrams(container, onOpenDiagramModal);
  }

  // 2. Attach Code Copy Buttons
  container.querySelectorAll<HTMLButtonElement>('.code-copy-btn').forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const pre = btn.closest('.code-block-wrapper')?.querySelector('pre');
      if (!pre) return;
      const codeText = pre.innerText;

      try {
        await navigator.clipboard.writeText(codeText);
        const originalHtml = btn.innerHTML;
        btn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    });
  });

  // 3. Syntax Highlighting via Prism or Procedural Engine
  const applyHighlighting = (prismInstance: PrismApi | null) => {
    if (prismInstance) {
      initPrismExtensions(prismInstance);
      try {
        prismInstance.highlightAllUnder(container);
      } catch (_) {}
    }

    // Procedural highlighting pass for any block without tokens
    container.querySelectorAll<HTMLElement>('pre code').forEach((codeEl) => {
      if (codeEl.closest('.mermaid-wrapper')) return;
      if (codeEl.querySelector('.token, .hljs-keyword, .hljs-string, .hljs-tag')) return;

      const cls = codeEl.className || '';
      const match = cls.match(/language-([a-zA-Z0-9_-]+)/);
      const lang = match ? match[1] : '';
      const text = codeEl.textContent || '';
      if (text) {
        codeEl.innerHTML = highlightCode(text, lang);
      }
    });
  };

  const prism = getGlobalPrism();
  if (prism) {
    applyHighlighting(prism);
  } else {
    ensurePrismLoaded().then((loadedPrism) => {
      applyHighlighting(loadedPrism);
    });
  }

  // 4. Documentation Image Lightbox Click Handler
  container.querySelectorAll<HTMLImageElement>('.docs-image').forEach((img) => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = '1';
    img.style.cursor = 'zoom-in';

    img.addEventListener('click', () => {
      openImageLightbox(img.src, img.alt || img.title || 'Documentation Image Preview');
    });
  });
}

function postProcessMermaidDiagrams(
  container: HTMLElement,
  onOpenDiagramModal?: (svg: SVGElement, title: string) => void
): void {
  // Container-level delegation ensures buttons and double-clicks always work even after re-renders
  if (!container.dataset.mermaidDelegated) {
    container.dataset.mermaidDelegated = '1';
    container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      const expandBtn = target?.closest<HTMLButtonElement>('.mermaid-expand-btn');
      if (expandBtn) {
        e.preventDefault();
        e.stopPropagation();
        const wrapper = expandBtn.closest('.mermaid-wrapper');
        const diagramSvg = wrapper?.querySelector<SVGElement>('.mermaid-container svg');
        if (diagramSvg) {
          if (onOpenDiagramModal) {
            onOpenDiagramModal(diagramSvg, 'Architecture & Flow Diagram');
          } else {
            openMermaidFullscreenModal(diagramSvg, 'Architecture & Flow Diagram');
          }
        }
      }
    });

    container.addEventListener('dblclick', (e) => {
      const target = e.target as HTMLElement | null;
      const diagramBox = target?.closest<HTMLElement>('.mermaid-container');
      if (diagramBox) {
        e.preventDefault();
        const diagramSvg = diagramBox.querySelector<SVGElement>('svg');
        if (diagramSvg) {
          if (onOpenDiagramModal) {
            onOpenDiagramModal(diagramSvg, 'Architecture & Flow Diagram');
          } else {
            openMermaidFullscreenModal(diagramSvg, 'Architecture & Flow Diagram');
          }
        }
      }
    });
  }

  container.querySelectorAll<HTMLElement>('.mermaid-wrapper').forEach((wrapper) => {
    const diagramContainer = wrapper.querySelector<HTMLElement>('.mermaid-container');
    if (!diagramContainer) return;

    const svg = diagramContainer.querySelector<SVGElement>('svg');
    if (svg) {
      // Preserve minimum width so diagrams are never crushed
      const viewBox = (svg as SVGSVGElement).viewBox?.baseVal;
      if (viewBox && viewBox.width > 600) {
        svg.style.minWidth = `${Math.max(viewBox.width, 800)}px`;
      }
    }

    // Enable horizontal mouse drag to scroll
    enableDragToScroll(diagramContainer);

    // Wire Fullscreen Expand Button directly
    const expandBtn = wrapper.querySelector<HTMLButtonElement>('.mermaid-expand-btn');
    if (expandBtn && !expandBtn.dataset.bound) {
      expandBtn.dataset.bound = '1';
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const diagramSvg = diagramContainer.querySelector<SVGElement>('svg');
        if (!diagramSvg) return;
        if (onOpenDiagramModal) {
          onOpenDiagramModal(diagramSvg, 'Architecture & Flow Diagram');
        } else {
          openMermaidFullscreenModal(diagramSvg, 'Architecture & Flow Diagram');
        }
      });
    }

    // Wire Double-Click on diagram container for fullscreen
    if (!diagramContainer.dataset.dblBound) {
      diagramContainer.dataset.dblBound = '1';
      diagramContainer.addEventListener('dblclick', () => {
        const diagramSvg = diagramContainer.querySelector<SVGElement>('svg');
        if (!diagramSvg) return;
        if (onOpenDiagramModal) {
          onOpenDiagramModal(diagramSvg, 'Architecture & Flow Diagram');
        } else {
          openMermaidFullscreenModal(diagramSvg, 'Architecture & Flow Diagram');
        }
      });
    }

    // Wire View Source Toggle Button
    const sourceBtn = wrapper.querySelector<HTMLButtonElement>('.mermaid-source-btn');
    const sourcePane = wrapper.querySelector<HTMLElement>('.mermaid-source-pane');
    if (sourceBtn && sourcePane && !sourceBtn.dataset.bound) {
      sourceBtn.dataset.bound = '1';
      sourceBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isHidden = sourcePane.style.display !== 'block';
        sourcePane.style.display = isHidden ? 'block' : 'none';
        sourceBtn.innerHTML = `<span>${isHidden ? 'Hide Source' : 'View Source'}</span>`;
      });
    }

    // Wire Diagram Copy Button
    const copyBtn = wrapper.querySelector<HTMLButtonElement>('.mermaid-copy-btn');
    const preMermaid = wrapper.querySelector<HTMLElement>('.mermaid');
    if (copyBtn && preMermaid && !copyBtn.dataset.bound) {
      copyBtn.dataset.bound = '1';
      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const rawSource = preMermaid.dataset.rawSource
          ? decodeURIComponent(preMermaid.dataset.rawSource)
          : preMermaid.innerText;

        try {
          await navigator.clipboard.writeText(rawSource);
          copyBtn.innerHTML = `<span>Copied!</span>`;
          setTimeout(() => {
            copyBtn.innerHTML = `<span>Copy</span>`;
          }, 2000);
        } catch (_) {}
      });
    }
  });
}
