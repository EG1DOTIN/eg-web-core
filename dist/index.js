var An = Object.defineProperty;
var In = (t, e, n) => e in t ? An(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var q = (t, e, n) => In(t, typeof e != "symbol" ? e + "" : e, n);
import { jsx as r, jsxs as d, Fragment as ce } from "react/jsx-runtime";
import { createContext as wr, useState as _, useCallback as te, useEffect as Y, useContext as kr, useMemo as ee, useRef as xe } from "react";
const er = ["light", "light-gray", "dark", "crystal", "slate-dark", "clamui-dark"], Sr = "eg_theme", Cr = wr(void 0), gl = ({
  children: t,
  defaultTheme: e = "light-gray",
  storageKey: n = Sr,
  allowedThemes: i = er
}) => {
  const [o, a] = _(() => {
    if (typeof window > "u") return e;
    try {
      const h = localStorage.getItem(n);
      if (h && i.includes(h))
        return h;
    } catch {
    }
    return e;
  }), l = (h) => h === "dark" || h === "clamui-dark" || h === "slate-dark" || h === "crystal", s = te((h) => {
    if (typeof document > "u") return;
    document.documentElement.setAttribute("data-theme", h);
    const m = l(h);
    document.body && (document.body.setAttribute("data-theme", h), m ? (document.body.classList.add("dark-theme"), document.body.classList.remove("light-theme")) : (document.body.classList.add("light-theme"), document.body.classList.remove("dark-theme")));
    try {
      localStorage.setItem(n, h), (n === "mchess_theme" || h === "dark" || h === "light") && localStorage.setItem("mchess_theme", m ? "dark" : "light");
    } catch {
    }
  }, [n]);
  Y(() => {
    s(o);
  }, [o, s]);
  const p = te((h) => {
    a(h), s(h);
  }, [s]), c = te(() => {
    a((h) => {
      let m;
      if (i && i.length === 2)
        m = h === i[0] ? i[1] : i[0];
      else {
        const f = l(h);
        i.includes("dark") && i.includes("light") ? m = f ? "light" : "dark" : m = f ? "light-gray" : "dark";
      }
      return s(m), m;
    });
  }, [i, s]), g = te(() => {
    a((h) => {
      const m = i && i.length > 0 ? i : er, f = m.indexOf(h), y = m[(f + 1) % m.length];
      return s(y), y;
    });
  }, [i, s]), u = l(o);
  return /* @__PURE__ */ r(Cr.Provider, { value: { theme: o, setTheme: p, toggleTheme: c, cycleTheme: g, isDark: u, allowedThemes: i }, children: t });
}, wt = () => {
  const t = kr(Cr);
  if (!t)
    throw new Error("useTheme must be used within a ThemeProvider");
  return t;
}, hl = (t = Sr, e = "light-gray") => `
(function() {
  try {
    var saved = localStorage.getItem('${t}') || '${e}';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', '${e}');
  }
})();
`.trim(), Ke = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  appId: ""
};
let Me = null;
function Ln() {
  return typeof window > "u" ? Promise.resolve(null) : window.firebase && window.firebase.firestore ? Promise.resolve(window.firebase) : Me || (Me = new Promise((t, e) => {
    function n(i) {
      return new Promise((o, a) => {
        if (document.querySelector(`script[src="${i}"]`)) {
          o();
          return;
        }
        const s = document.createElement("script");
        s.src = i, s.async = !0, s.crossOrigin = "anonymous", s.onload = () => o(), s.onerror = (p) => a(p), document.head.appendChild(s);
      });
    }
    n("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js").then(() => n("https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js")).then(() => t(window.firebase)).catch((i) => {
      Me = null, e(i);
    });
  }), Me);
}
let Re = null;
function _n() {
  return typeof window > "u" ? Promise.resolve(null) : window.firebase && window.firebase.auth && window.firebase.firestore ? Promise.resolve(window.firebase) : Re || (Re = new Promise((t, e) => {
    function n(i) {
      return new Promise((o, a) => {
        if (document.querySelector(`script[src="${i}"]`)) {
          o();
          return;
        }
        const s = document.createElement("script");
        s.src = i, s.async = !0, s.crossOrigin = "anonymous", s.onload = () => o(), s.onerror = (p) => a(p), document.head.appendChild(s);
      });
    }
    n("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js").then(() => n("https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js")).then(() => n("https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js")).then(() => t(window.firebase)).catch((i) => {
      Re = null, e(i);
    });
  }), Re);
}
async function Le(t = Ke, e, n = {}) {
  if (typeof window > "u")
    return { app: null, db: null, auth: null };
  n.includeAuth ? await _n() : await Ln();
  const i = window.firebase;
  if (!i)
    throw new Error("[eg-web-core] Firebase SDK could not be loaded.");
  let o = null;
  if (e) {
    const s = i.apps && i.apps.find((p) => p && p.name === e);
    if (s)
      o = s;
    else if (t && t.apiKey)
      o = i.initializeApp(t, e);
    else
      throw new Error(`[eg-web-core] Cannot initialize Firebase app "${e}": valid apiKey is required.`);
  } else {
    const s = i.apps && i.apps.find((p) => p && p.name === "[DEFAULT]");
    if (s)
      o = s;
    else if (t && t.apiKey)
      o = i.initializeApp(t);
    else if (i.apps && i.apps.length > 0)
      o = i.apps[0];
    else
      throw new Error("[eg-web-core] Cannot initialize default Firebase app: valid apiKey is required.");
  }
  const a = o.firestore ? o.firestore() : null, l = n.includeAuth && o.auth || o.auth ? o.auth() : null;
  return window.firebaseApp = o, a && (window.db = a), { app: o, db: a, auth: l };
}
async function Tn(t = Ke, e) {
  const { db: n } = await Le(t, e);
  return n;
}
async function Nt(t = Ke, e) {
  const { auth: n } = await Le(t, e, { includeAuth: !0 });
  return n;
}
const Ar = {
  messages: "messages",
  analytics: "visitor_analytics",
  adminLockout: "admin_lockout",
  adminAuditLog: "admin_login_log"
}, Ir = wr({
  config: Ke,
  appName: "web-app",
  collections: Ar,
  db: null,
  isReady: !1,
  error: null
}), ul = ({
  children: t,
  config: e = Ke,
  appName: n = "web-app",
  collections: i,
  autoInit: o = !0
}) => {
  const [a, l] = _(null), [s, p] = _(!1), [c, g] = _(null), u = ee(() => ({
    ...Ar,
    ...i || {}
  }), [i]);
  Y(() => {
    if (!o || !e.apiKey) return;
    let m = !0;
    return Le(e, n === "web-app" ? void 0 : n).then(({ db: f }) => {
      m && (l(f), p(!0));
    }).catch((f) => {
      m && (console.warn("[FirebaseProvider] Firebase auto-init warning:", f), g(f instanceof Error ? f : new Error(String(f))));
    }), () => {
      m = !1;
    };
  }, [e, n, o]);
  const h = ee(() => ({
    config: e,
    appName: n,
    collections: u,
    db: a,
    isReady: s,
    error: c
  }), [e, n, u, a, s, c]);
  return /* @__PURE__ */ r(Ir.Provider, { value: h, children: t });
}, kt = () => kr(Ir), Wt = ({
  variant: t = "primary",
  size: e = "md",
  icon: n,
  children: i,
  className: o = "",
  style: a,
  disabled: l,
  ...s
}) => /* @__PURE__ */ d(
  "button",
  {
    type: "button",
    className: `eg-button eg-button--${t} eg-button--${e} eg-button-${t} eg-button-${e} ${o}`,
    disabled: l,
    style: a,
    ...s,
    children: [
      n && /* @__PURE__ */ r("span", { className: "eg-button__icon", style: { display: "inline-flex" }, children: n }),
      i
    ]
  }
), ye = ({
  children: t,
  variant: e = "neutral",
  size: n = "md",
  className: i = "",
  style: o
}) => /* @__PURE__ */ r(
  "span",
  {
    className: `eg-badge eg-badge--${e} eg-badge--${n} eg-badge-${e} eg-badge-${n} ${i}`,
    style: o,
    children: t
  }
), dt = ({
  isOpen: t,
  onClose: e,
  title: n,
  children: i,
  maxWidth: o = "560px",
  footer: a
}) => (Y(() => {
  const l = (s) => {
    s.key === "Escape" && e();
  };
  return t && (document.body.style.overflow = "hidden", window.addEventListener("keydown", l)), () => {
    document.body.style.overflow = "", window.removeEventListener("keydown", l);
  };
}, [t, e]), t ? /* @__PURE__ */ r(
  "div",
  {
    role: "dialog",
    "aria-modal": "true",
    className: "eg-modal-backdrop",
    onClick: (l) => {
      l.target === l.currentTarget && e();
    },
    children: /* @__PURE__ */ d("div", { className: "eg-modal-container", style: { maxWidth: o }, children: [
      n && /* @__PURE__ */ d("div", { className: "eg-modal-header", children: [
        /* @__PURE__ */ r("h3", { className: "eg-modal-header__title", children: n }),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: e,
            "aria-label": "Close modal",
            className: "eg-modal-header__close",
            children: /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ r("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ r("div", { className: "eg-modal-body", children: i }),
      a && /* @__PURE__ */ r("div", { className: "eg-modal-footer", children: a })
    ] })
  }
) : null), Lr = ({
  id: t = "themeToggleBtn",
  className: e = "",
  size: n = "md",
  showLabel: i = !1,
  mode: o = "auto"
}) => {
  const { theme: a, toggleTheme: l, cycleTheme: s, isDark: p, allowedThemes: c } = wt(), g = o === "toggle" || o === "auto" && c && c.length <= 2, u = g ? l : s, h = n === "sm" ? 18 : n === "lg" ? 24 : 20;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      id: t,
      onClick: u,
      className: `eg-theme-toggle eg-theme-toggle--${n} ${e}`,
      title: g ? p ? "Switch to Light Theme" : "Switch to Dark Theme" : `Current theme: ${a}. Click to switch theme.`,
      "aria-label": g ? p ? "Switch to Light Theme" : "Switch to Dark Theme" : `Current theme: ${a}. Click to cycle themes.`,
      children: [
        a === "crystal" ? (
          // Crystal / Gem SVG
          /* @__PURE__ */ d(
            "svg",
            {
              width: h,
              height: h,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              style: { color: "#a855f7" },
              children: [
                /* @__PURE__ */ r("path", { d: "M6 3h12l4 6-10 12L2 9z" }),
                /* @__PURE__ */ r("path", { d: "M11 3v18" }),
                /* @__PURE__ */ r("path", { d: "M2 9h20" })
              ]
            }
          )
        ) : p ? (
          // Moon SVG
          /* @__PURE__ */ r(
            "svg",
            {
              width: h,
              height: h,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              style: { color: "#38bdf8" },
              children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
            }
          )
        ) : (
          // Sun SVG
          /* @__PURE__ */ d(
            "svg",
            {
              width: h,
              height: h,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              style: { color: "#f59e0b" },
              children: [
                /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
                /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
                /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
                /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
                /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
                /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
                /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
                /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
                /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
              ]
            }
          )
        ),
        i && /* @__PURE__ */ r("span", { style: { fontSize: "13px", textTransform: "capitalize", fontWeight: 500 }, children: a })
      ]
    }
  );
}, Wn = ({
  storageKey: t = "notifications_seen_v1",
  initialItems: e = [],
  fetchUrl: n,
  maxItems: i = 5
} = {}) => {
  const [o, a] = _(e), [l, s] = _(() => {
    if (typeof window > "u") return [];
    try {
      const m = localStorage.getItem(t);
      return m ? JSON.parse(m) : [];
    } catch {
      return [];
    }
  }), p = te(
    (m) => {
      if (s(m), !(typeof window > "u"))
        try {
          localStorage.setItem(t, JSON.stringify(m));
        } catch (f) {
          console.warn("[useNotifications] Could not persist read notification IDs:", f);
        }
    },
    [t]
  );
  Y(() => {
    if (!n) return;
    let m = !0;
    return fetch(n).then((f) => f.ok ? f.json() : null).then((f) => {
      if (!m || !f) return;
      const y = Array.isArray(f) ? f : Array.isArray(f.news) ? f.news : Array.isArray(f.updates) ? f.updates : [];
      a(y);
    }).catch((f) => {
      console.warn("[useNotifications] Failed to fetch notification feed:", f);
    }), () => {
      m = !1;
    };
  }, [n]);
  const c = ee(() => o.slice(0, i).map((m) => {
    const f = m;
    return {
      id: m.id || String(f.version || Math.random()),
      title: m.title || String(f.title || "Update"),
      description: m.description || f.message || "",
      date: m.date || f.date || "",
      link: m.link || f.link || "",
      category: m.category || f.badge || "",
      read: l.includes(m.id)
    };
  }), [o, l, i]), g = ee(() => c.filter((m) => !m.read).length, [c]), u = te(
    (m) => {
      l.includes(m) || p([...l, m]);
    },
    [l, p]
  ), h = te(() => {
    const m = Array.from(/* @__PURE__ */ new Set([...l, ...o.map((f) => f.id)]));
    p(m);
  }, [o, l, p]);
  return {
    notifications: c,
    unreadCount: g,
    hasUnread: g > 0,
    markAsRead: u,
    markAllAsRead: h,
    setItems: a
  };
}, $n = /* @__PURE__ */ new Set(["http:", "https:", "mailto:", "tel:"]), ne = (t, e = "#") => {
  if (typeof t != "string" || !t.trim()) return e;
  const n = t.trim(), i = n.replace(/[\x00-\x1F\x7F-\x9F]+/g, "").trim();
  if (!i) return e;
  if (/^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,[a-zA-Z0-9+/=]+$/i.test(i))
    return n;
  if (/^(javascript|vbscript|data|blob|file):/i.test(i))
    return e;
  const o = i.indexOf(":");
  if (o !== -1) {
    const a = i.slice(0, o + 1).toLowerCase();
    if (/^[a-z][a-z0-9+.-]*:$/i.test(a) && !$n.has(a))
      return e;
  }
  return n;
}, Bn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "EMBED",
  "APPLET",
  "BASE",
  "META",
  "LINK",
  "FORM"
]), Ae = (t) => {
  if (!t || typeof t != "string") return "";
  let e = t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "").replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "").replace(/<embed\b[^>]*>/gi, "").replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "").replace(/<base\b[^>]*>/gi, "").replace(/<meta\b[^>]*>/gi, "").replace(/<link\b[^>]*>/gi, "").replace(/(?:[\s/]|&[\w#]+;)+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "").replace(/(href|action|formaction)\s*=\s*(['"])\s*(?:javascript|vbscript|data|blob):.*?\2/gi, '$1="#"').replace(/(src|xlink:href)\s*=\s*(['"])\s*(?:javascript|vbscript|data:(?!image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,)|blob):.*?\2/gi, '$1="#"');
  if (typeof window < "u" && typeof DOMParser < "u")
    try {
      const i = new DOMParser().parseFromString(e, "text/html"), o = (a) => {
        if (a.nodeType === Node.ELEMENT_NODE) {
          const s = a, p = s.tagName.toUpperCase();
          if (Bn.has(p)) {
            s.remove();
            return;
          }
          const c = Array.from(s.attributes);
          for (const g of c) {
            const u = g.name.toLowerCase(), h = g.value;
            if (u.startsWith("on")) {
              s.removeAttribute(g.name);
              continue;
            }
            ["href", "src", "action", "formaction", "xlink:href"].includes(u) && ne(h, "#") === "#" && s.setAttribute(g.name, "#"), u === "style" && /(expression|javascript:|url\(["']?data:)/i.test(h) && s.removeAttribute("style");
          }
        }
        let l = a.firstChild;
        for (; l; ) {
          const s = l.nextSibling;
          o(l), l = s;
        }
      };
      return o(i.body), i.body.innerHTML;
    } catch {
      return e;
    }
  return e;
}, Mn = ({
  storageKey: t = "eg_seen_updates",
  fetchUrl: e = "data/updates.json",
  items: n,
  allUpdatesUrl: i = "updates",
  onNavigate: o
}) => {
  const [a, l] = _(!1), [s, p] = _({}), c = xe(null), { isDark: g } = wt(), u = Wn({
    storageKey: t,
    fetchUrl: e
  }), h = n || u.notifications, m = n ? n.filter((x) => !x.read).length : u.unreadCount, f = u.markAsRead, y = u.markAllAsRead, k = () => {
    if (!c.current) return {};
    const x = c.current.getBoundingClientRect(), b = typeof window < "u" ? window.innerWidth : 1024, w = Math.min(360, b - 24);
    if (b <= 768 || x.right - 320 < 12) {
      const I = x.bottom + 8, T = Math.max(12, Math.min(b - w - 12, x.right - w));
      return {
        position: "fixed",
        top: `${I}px`,
        left: `${T}px`,
        right: "auto",
        width: `${w}px`,
        maxWidth: "calc(100vw - 24px)",
        zIndex: 9999
      };
    } else
      return {
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        left: "auto",
        width: "320px",
        maxWidth: "90vw",
        zIndex: 1e3
      };
  }, v = () => {
    a ? l(!1) : (p(k()), l(!0));
  };
  return Y(() => {
    if (!a) return;
    const x = () => {
      p(k());
    };
    return x(), window.addEventListener("resize", x), window.addEventListener("scroll", x, !0), () => {
      window.removeEventListener("resize", x), window.removeEventListener("scroll", x, !0);
    };
  }, [a]), Y(() => {
    const x = (b) => {
      c.current && !c.current.contains(b.target) && l(!1);
    };
    return a && document.addEventListener("mousedown", x), () => {
      document.removeEventListener("mousedown", x);
    };
  }, [a]), /* @__PURE__ */ d("div", { ref: c, className: "header-notify-wrapper eg-notify-wrapper", style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ d(
      "button",
      {
        type: "button",
        id: "headerNotifyBtn",
        className: "header-cta-btn cta-notify eg-notify-bell-btn",
        onClick: v,
        "aria-label": "View notifications",
        "aria-expanded": a,
        style: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          background: "transparent",
          border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))",
          borderRadius: "var(--eg-radius-md, 8px)",
          color: "var(--eg-text-primary, inherit)",
          cursor: "pointer",
          transition: "all var(--eg-transition-fast, 150ms)"
        },
        onMouseEnter: (x) => {
          x.currentTarget.style.borderColor = "var(--eg-border-hover, #10b981)", x.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))";
        },
        onMouseLeave: (x) => {
          x.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", x.currentTarget.style.backgroundColor = "transparent";
        },
        children: [
          /* @__PURE__ */ d(
            "svg",
            {
              width: "20",
              height: "20",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ r("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
                /* @__PURE__ */ r("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
              ]
            }
          ),
          m > 0 && /* @__PURE__ */ r(
            "span",
            {
              id: "headerNotifyBadge",
              className: "notify-badge unread-pulse",
              style: {
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "#ef4444",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                minWidth: "18px",
                height: "18px",
                lineHeight: "18px",
                borderRadius: "9999px",
                textAlign: "center",
                padding: "0 4px",
                boxShadow: "0 0 8px rgba(239, 68, 68, 0.6)"
              },
              children: m > 9 ? "9+" : m
            }
          )
        ]
      }
    ),
    a && /* @__PURE__ */ d(
      "div",
      {
        id: "headerNotifyDropdown",
        className: "notify-dropdown eg-notify-dropdown",
        role: "region",
        "aria-label": "Recent notifications",
        style: {
          position: "absolute",
          right: 0,
          top: "calc(100% + 10px)",
          width: "320px",
          maxWidth: "90vw",
          ...s,
          background: "var(--eg-bg-surface-elevated, #ffffff)",
          border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
          borderRadius: "var(--eg-radius-lg, 12px)",
          boxShadow: "var(--eg-shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.15))",
          overflow: "hidden",
          fontFamily: "var(--eg-font-sans, sans-serif)"
        },
        children: [
          /* @__PURE__ */ d(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
                background: "var(--eg-bg-subtle, #f1f5f9)"
              },
              children: [
                /* @__PURE__ */ r("span", { style: { fontWeight: 600, fontSize: "14px", color: "var(--eg-text-primary, #0f172a)" }, children: "What's New" }),
                m > 0 && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: y,
                    style: {
                      background: "none",
                      border: "none",
                      color: "var(--eg-color-sky, #0284c7)",
                      fontSize: "12px",
                      fontWeight: 500,
                      cursor: "pointer",
                      padding: 0
                    },
                    children: "Mark all read"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ r("div", { style: { maxHeight: "340px", overflowY: "auto" }, children: h.length === 0 ? /* @__PURE__ */ r(
            "div",
            {
              style: {
                padding: "24px 16px",
                textAlign: "center",
                color: "var(--eg-text-muted, #94a3b8)",
                fontSize: "13px"
              },
              children: "No new announcements"
            }
          ) : h.map((x) => /* @__PURE__ */ d(
            "div",
            {
              onClick: () => {
                f(x.id), o && (o(i), l(!1));
              },
              style: {
                padding: "12px 16px",
                borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))",
                background: x.read ? "transparent" : g ? "rgba(56, 189, 248, 0.08)" : "rgba(14, 165, 233, 0.08)",
                cursor: "pointer",
                transition: "background 0.15s ease"
              },
              onMouseEnter: (b) => {
                b.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))";
              },
              onMouseLeave: (b) => {
                b.currentTarget.style.backgroundColor = x.read ? "transparent" : g ? "rgba(56, 189, 248, 0.08)" : "rgba(14, 165, 233, 0.08)";
              },
              children: [
                /* @__PURE__ */ d(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                      gap: "8px"
                    },
                    children: [
                      /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            fontWeight: x.read ? 500 : 700,
                            fontSize: "13px",
                            color: "var(--eg-text-primary, #0f172a)",
                            flex: 1
                          },
                          children: x.title
                        }
                      ),
                      x.category && /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            background: x.category.includes("ENHANC") ? g ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.14)" : x.category.includes("FEAT") ? g ? "rgba(56, 189, 248, 0.2)" : "rgba(14, 165, 233, 0.14)" : x.category.includes("BUG") ? g ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.14)" : x.category.includes("OPT") ? g ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.14)" : g ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.14)",
                            color: x.category.includes("ENHANC") ? g ? "#c084fc" : "#7e22ce" : x.category.includes("FEAT") ? g ? "#38bdf8" : "#0369a1" : x.category.includes("BUG") ? g ? "#f87171" : "#b91c1c" : x.category.includes("OPT") ? g ? "#fbbf24" : "#b45309" : g ? "#34d399" : "#047857"
                          },
                          children: x.category
                        }
                      ),
                      !x.read && /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "var(--eg-color-sky, #0284c7)",
                            flexShrink: 0
                          }
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  "p",
                  {
                    style: {
                      margin: 0,
                      fontSize: "12px",
                      color: "var(--eg-text-secondary, #475569)",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    },
                    children: x.description
                  }
                ),
                x.date && /* @__PURE__ */ r(
                  "span",
                  {
                    style: {
                      display: "block",
                      marginTop: "4px",
                      fontSize: "11px",
                      color: "var(--eg-text-muted, #94a3b8)"
                    },
                    children: x.date
                  }
                )
              ]
            },
            x.id
          )) }),
          /* @__PURE__ */ r(
            "div",
            {
              style: {
                padding: "10px 16px",
                textAlign: "center",
                borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
                background: "var(--eg-bg-subtle, #f1f5f9)"
              },
              children: /* @__PURE__ */ r(
                "a",
                {
                  href: ne(i),
                  onClick: (x) => {
                    o && (x.preventDefault(), o(i), l(!1));
                  },
                  style: {
                    color: "var(--eg-color-primary, #10b981)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none"
                  },
                  children: "View all updates →"
                }
              )
            }
          )
        ]
      }
    )
  ] });
};
function Dt() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
var _e = Dt();
function _r(t) {
  _e = t;
}
var je = { exec: () => null };
function X(t, e = "") {
  let n = typeof t == "string" ? t : t.source;
  const i = {
    replace: (o, a) => {
      let l = typeof a == "string" ? a : a.source;
      return l = l.replace(le.caret, "$1"), n = n.replace(o, l), i;
    },
    getRegex: () => new RegExp(n, e)
  };
  return i;
}
var le = {
  codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
  outputLinkReplace: /\\([\[\]])/g,
  indentCodeCompensation: /^(\s+)(?:```)/,
  beginningSpace: /^\s+/,
  endingHash: /#$/,
  startingSpaceChar: /^ /,
  endingSpaceChar: / $/,
  nonSpaceChar: /[^ ]/,
  newLineCharGlobal: /\n/g,
  tabCharGlobal: /\t/g,
  multipleSpaceGlobal: /\s+/g,
  blankLine: /^[ \t]*$/,
  doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
  blockquoteStart: /^ {0,3}>/,
  blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
  blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
  listReplaceTabs: /^\t+/,
  listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
  listIsTask: /^\[[ xX]\] /,
  listReplaceTask: /^\[[ xX]\] +/,
  anyLine: /\n.*\n/,
  hrefBrackets: /^<(.*)>$/,
  tableDelimiter: /[:|]/,
  tableAlignChars: /^\||\| *$/g,
  tableRowBlankLine: /\n[ \t]*$/,
  tableAlignRight: /^ *-+: *$/,
  tableAlignCenter: /^ *:-+: *$/,
  tableAlignLeft: /^ *:-+ *$/,
  startATag: /^<a /i,
  endATag: /^<\/a>/i,
  startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
  endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
  startAngleBracket: /^</,
  endAngleBracket: />$/,
  pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
  unicodeAlphaNumeric: /[\p{L}\p{N}]/u,
  escapeTest: /[&<>"']/,
  escapeReplace: /[&<>"']/g,
  escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
  escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
  unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
  caret: /(^|[^\[])\^/g,
  percentDecode: /%25/g,
  findPipe: /\|/g,
  splitPipe: / \|/,
  slashPipe: /\\\|/g,
  carriageReturn: /\r\n|\r/g,
  spaceLine: /^ +$/gm,
  notSpaceStart: /^\S*/,
  endingNewline: /\n$/,
  listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`),
  nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),
  hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),
  fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`),
  headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`),
  htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i")
}, Rn = /^(?:[ \t]*(?:\n|$))+/, zn = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, En = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ze = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Nn = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, jt = /(?:[*+-]|\d{1,9}[.)])/, Tr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Wr = X(Tr).replace(/bull/g, jt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Dn = X(Tr).replace(/bull/g, jt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Pt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, jn = /^[^\n]+/, Ht = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Pn = X(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ht).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Hn = X(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, jt).getRegex(), St = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ft = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Fn = X(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ft).replace("tag", St).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), $r = X(Pt).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", St).getRegex(), On = X(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", $r).getRegex(), Ot = {
  blockquote: On,
  code: zn,
  def: Pn,
  fences: En,
  heading: Nn,
  hr: Ze,
  html: Fn,
  lheading: Wr,
  list: Hn,
  newline: Rn,
  paragraph: $r,
  table: je,
  text: jn
}, tr = X(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", St).getRegex(), Vn = {
  ...Ot,
  lheading: Dn,
  table: tr,
  paragraph: X(Pt).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", tr).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", St).getRegex()
}, Un = {
  ...Ot,
  html: X(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ft).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: je,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: X(Pt).replace("hr", Ze).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Wr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Gn = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, qn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Br = /^( {2,}|\\)\n(?!\s*$)/, Kn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Ct = /[\p{P}\p{S}]/u, Vt = /[\s\p{P}\p{S}]/u, Mr = /[^\s\p{P}\p{S}]/u, Zn = X(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vt).getRegex(), Rr = /(?!~)[\p{P}\p{S}]/u, Yn = /(?!~)[\s\p{P}\p{S}]/u, Jn = /(?:[^\s\p{P}\p{S}]|~)/u, Xn = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, zr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Qn = X(zr, "u").replace(/punct/g, Ct).getRegex(), ei = X(zr, "u").replace(/punct/g, Rr).getRegex(), Er = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ti = X(Er, "gu").replace(/notPunctSpace/g, Mr).replace(/punctSpace/g, Vt).replace(/punct/g, Ct).getRegex(), ri = X(Er, "gu").replace(/notPunctSpace/g, Jn).replace(/punctSpace/g, Yn).replace(/punct/g, Rr).getRegex(), ni = X(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Mr).replace(/punctSpace/g, Vt).replace(/punct/g, Ct).getRegex(), ii = X(/\\(punct)/, "gu").replace(/punct/g, Ct).getRegex(), oi = X(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ai = X(Ft).replace("(?:-->|$)", "-->").getRegex(), li = X(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", ai).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), pt = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, si = X(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", pt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Nr = X(/^!?\[(label)\]\[(ref)\]/).replace("label", pt).replace("ref", Ht).getRegex(), Dr = X(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ht).getRegex(), ci = X("reflink|nolink(?!\\()", "g").replace("reflink", Nr).replace("nolink", Dr).getRegex(), Ut = {
  _backpedal: je,
  // only used for GFM url
  anyPunctuation: ii,
  autolink: oi,
  blockSkip: Xn,
  br: Br,
  code: qn,
  del: je,
  emStrongLDelim: Qn,
  emStrongRDelimAst: ti,
  emStrongRDelimUnd: ni,
  escape: Gn,
  link: si,
  nolink: Dr,
  punctuation: Zn,
  reflink: Nr,
  reflinkSearch: ci,
  tag: li,
  text: Kn,
  url: je
}, di = {
  ...Ut,
  link: X(/^!?\[(label)\]\((.*?)\)/).replace("label", pt).getRegex(),
  reflink: X(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", pt).getRegex()
}, $t = {
  ...Ut,
  emStrongRDelimAst: ri,
  emStrongLDelim: ei,
  url: X(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, pi = {
  ...$t,
  br: X(Br).replace("{2,}", "*").getRegex(),
  text: X($t.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, tt = {
  normal: Ot,
  gfm: Vn,
  pedantic: Un
}, ze = {
  normal: Ut,
  gfm: $t,
  breaks: pi,
  pedantic: di
}, gi = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, rr = (t) => gi[t];
function me(t, e) {
  if (e) {
    if (le.escapeTest.test(t))
      return t.replace(le.escapeReplace, rr);
  } else if (le.escapeTestNoEncode.test(t))
    return t.replace(le.escapeReplaceNoEncode, rr);
  return t;
}
function nr(t) {
  try {
    t = encodeURI(t).replace(le.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function ir(t, e) {
  var a;
  const n = t.replace(le.findPipe, (l, s, p) => {
    let c = !1, g = s;
    for (; --g >= 0 && p[g] === "\\"; ) c = !c;
    return c ? "|" : " |";
  }), i = n.split(le.splitPipe);
  let o = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !((a = i.at(-1)) != null && a.trim()) && i.pop(), e)
    if (i.length > e)
      i.splice(e);
    else
      for (; i.length < e; ) i.push("");
  for (; o < i.length; o++)
    i[o] = i[o].trim().replace(le.slashPipe, "|");
  return i;
}
function Ee(t, e, n) {
  const i = t.length;
  if (i === 0)
    return "";
  let o = 0;
  for (; o < i && t.charAt(i - o - 1) === e; )
    o++;
  return t.slice(0, i - o);
}
function hi(t, e) {
  if (t.indexOf(e[1]) === -1)
    return -1;
  let n = 0;
  for (let i = 0; i < t.length; i++)
    if (t[i] === "\\")
      i++;
    else if (t[i] === e[0])
      n++;
    else if (t[i] === e[1] && (n--, n < 0))
      return i;
  return n > 0 ? -2 : -1;
}
function or(t, e, n, i, o) {
  const a = e.href, l = e.title || null, s = t[1].replace(o.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  const p = {
    type: t[0].charAt(0) === "!" ? "image" : "link",
    raw: n,
    href: a,
    title: l,
    text: s,
    tokens: i.inlineTokens(s)
  };
  return i.state.inLink = !1, p;
}
function ui(t, e, n) {
  const i = t.match(n.other.indentCodeCompensation);
  if (i === null)
    return e;
  const o = i[1];
  return e.split(`
`).map((a) => {
    const l = a.match(n.other.beginningSpace);
    if (l === null)
      return a;
    const [s] = l;
    return s.length >= o.length ? a.slice(o.length) : a;
  }).join(`
`);
}
var gt = class {
  // set by the lexer
  constructor(t) {
    q(this, "options");
    q(this, "rules");
    // set by the lexer
    q(this, "lexer");
    this.options = t || _e;
  }
  space(t) {
    const e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0)
      return {
        type: "space",
        raw: e[0]
      };
  }
  code(t) {
    const e = this.rules.block.code.exec(t);
    if (e) {
      const n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return {
        type: "code",
        raw: e[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? n : Ee(n, `
`)
      };
    }
  }
  fences(t) {
    const e = this.rules.block.fences.exec(t);
    if (e) {
      const n = e[0], i = ui(n, e[3] || "", this.rules);
      return {
        type: "code",
        raw: n,
        lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2],
        text: i
      };
    }
  }
  heading(t) {
    const e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        const i = Ee(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return {
        type: "heading",
        raw: e[0],
        depth: e[1].length,
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  hr(t) {
    const e = this.rules.block.hr.exec(t);
    if (e)
      return {
        type: "hr",
        raw: Ee(e[0], `
`)
      };
  }
  blockquote(t) {
    const e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = Ee(e[0], `
`).split(`
`), i = "", o = "";
      const a = [];
      for (; n.length > 0; ) {
        let l = !1;
        const s = [];
        let p;
        for (p = 0; p < n.length; p++)
          if (this.rules.other.blockquoteStart.test(n[p]))
            s.push(n[p]), l = !0;
          else if (!l)
            s.push(n[p]);
          else
            break;
        n = n.slice(p);
        const c = s.join(`
`), g = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${c}` : c, o = o ? `${o}
${g}` : g;
        const u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(g, a, !0), this.lexer.state.top = u, n.length === 0)
          break;
        const h = a.at(-1);
        if ((h == null ? void 0 : h.type) === "code")
          break;
        if ((h == null ? void 0 : h.type) === "blockquote") {
          const m = h, f = m.raw + `
` + n.join(`
`), y = this.blockquote(f);
          a[a.length - 1] = y, i = i.substring(0, i.length - m.raw.length) + y.raw, o = o.substring(0, o.length - m.text.length) + y.text;
          break;
        } else if ((h == null ? void 0 : h.type) === "list") {
          const m = h, f = m.raw + `
` + n.join(`
`), y = this.list(f);
          a[a.length - 1] = y, i = i.substring(0, i.length - h.raw.length) + y.raw, o = o.substring(0, o.length - m.raw.length) + y.raw, n = f.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return {
        type: "blockquote",
        raw: i,
        tokens: a,
        text: o
      };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim();
      const i = n.length > 1, o = {
        type: "list",
        raw: "",
        ordered: i,
        start: i ? +n.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      const a = this.rules.other.listItemRegex(n);
      let l = !1;
      for (; t; ) {
        let p = !1, c = "", g = "";
        if (!(e = a.exec(t)) || this.rules.block.hr.test(t))
          break;
        c = e[0], t = t.substring(c.length);
        let u = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (v) => " ".repeat(3 * v.length)), h = t.split(`
`, 1)[0], m = !u.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, g = u.trimStart()) : m ? f = e[1].length + 1 : (f = e[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, g = u.slice(f), f += e[1].length), m && this.rules.other.blankLine.test(h) && (c += h + `
`, t = t.substring(h.length + 1), p = !0), !p) {
          const v = this.rules.other.nextBulletRegex(f), x = this.rules.other.hrRegex(f), b = this.rules.other.fencesBeginRegex(f), w = this.rules.other.headingBeginRegex(f), I = this.rules.other.htmlBeginRegex(f);
          for (; t; ) {
            const T = t.split(`
`, 1)[0];
            let C;
            if (h = T, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), C = h) : C = h.replace(this.rules.other.tabCharGlobal, "    "), b.test(h) || w.test(h) || I.test(h) || v.test(h) || x.test(h))
              break;
            if (C.search(this.rules.other.nonSpaceChar) >= f || !h.trim())
              g += `
` + C.slice(f);
            else {
              if (m || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(u) || w.test(u) || x.test(u))
                break;
              g += `
` + h;
            }
            !m && !h.trim() && (m = !0), c += T + `
`, t = t.substring(T.length + 1), u = C.slice(f);
          }
        }
        o.loose || (l ? o.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (l = !0));
        let y = null, k;
        this.options.gfm && (y = this.rules.other.listIsTask.exec(g), y && (k = y[0] !== "[ ] ", g = g.replace(this.rules.other.listReplaceTask, ""))), o.items.push({
          type: "list_item",
          raw: c,
          task: !!y,
          checked: k,
          loose: !1,
          text: g,
          tokens: []
        }), o.raw += c;
      }
      const s = o.items.at(-1);
      if (s)
        s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
      else
        return;
      o.raw = o.raw.trimEnd();
      for (let p = 0; p < o.items.length; p++)
        if (this.lexer.state.top = !1, o.items[p].tokens = this.lexer.blockTokens(o.items[p].text, []), !o.loose) {
          const c = o.items[p].tokens.filter((u) => u.type === "space"), g = c.length > 0 && c.some((u) => this.rules.other.anyLine.test(u.raw));
          o.loose = g;
        }
      if (o.loose)
        for (let p = 0; p < o.items.length; p++)
          o.items[p].loose = !0;
      return o;
    }
  }
  html(t) {
    const e = this.rules.block.html.exec(t);
    if (e)
      return {
        type: "html",
        block: !0,
        raw: e[0],
        pre: e[1] === "pre" || e[1] === "script" || e[1] === "style",
        text: e[0]
      };
  }
  def(t) {
    const e = this.rules.block.def.exec(t);
    if (e) {
      const n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return {
        type: "def",
        tag: n,
        raw: e[0],
        href: i,
        title: o
      };
    }
  }
  table(t) {
    var l;
    const e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2]))
      return;
    const n = ir(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = (l = e[3]) != null && l.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = {
      type: "table",
      raw: e[0],
      header: [],
      align: [],
      rows: []
    };
    if (n.length === i.length) {
      for (const s of i)
        this.rules.other.tableAlignRight.test(s) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(s) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(s) ? a.align.push("left") : a.align.push(null);
      for (let s = 0; s < n.length; s++)
        a.header.push({
          text: n[s],
          tokens: this.lexer.inline(n[s]),
          header: !0,
          align: a.align[s]
        });
      for (const s of o)
        a.rows.push(ir(s, a.header.length).map((p, c) => ({
          text: p,
          tokens: this.lexer.inline(p),
          header: !1,
          align: a.align[c]
        })));
      return a;
    }
  }
  lheading(t) {
    const e = this.rules.block.lheading.exec(t);
    if (e)
      return {
        type: "heading",
        raw: e[0],
        depth: e[2].charAt(0) === "=" ? 1 : 2,
        text: e[1],
        tokens: this.lexer.inline(e[1])
      };
  }
  paragraph(t) {
    const e = this.rules.block.paragraph.exec(t);
    if (e) {
      const n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return {
        type: "paragraph",
        raw: e[0],
        text: n,
        tokens: this.lexer.inline(n)
      };
    }
  }
  text(t) {
    const e = this.rules.block.text.exec(t);
    if (e)
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        tokens: this.lexer.inline(e[0])
      };
  }
  escape(t) {
    const e = this.rules.inline.escape.exec(t);
    if (e)
      return {
        type: "escape",
        raw: e[0],
        text: e[1]
      };
  }
  tag(t) {
    const e = this.rules.inline.tag.exec(t);
    if (e)
      return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: e[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: e[0]
      };
  }
  link(t) {
    const e = this.rules.inline.link.exec(t);
    if (e) {
      const n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n))
          return;
        const a = Ee(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0)
          return;
      } else {
        const a = hi(e[2], "()");
        if (a === -2)
          return;
        if (a > -1) {
          const s = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + a;
          e[2] = e[2].substring(0, a), e[0] = e[0].substring(0, s).trim(), e[3] = "";
        }
      }
      let i = e[2], o = "";
      if (this.options.pedantic) {
        const a = this.rules.other.pedanticHrefTitle.exec(i);
        a && (i = a[1], o = a[3]);
      } else
        o = e[3] ? e[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), or(e, {
        href: i && i.replace(this.rules.inline.anyPunctuation, "$1"),
        title: o && o.replace(this.rules.inline.anyPunctuation, "$1")
      }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      const i = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = e[i.toLowerCase()];
      if (!o) {
        const a = n[0].charAt(0);
        return {
          type: "text",
          raw: a,
          text: a
        };
      }
      return or(n, o, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const a = [...i[0]].length - 1;
      let l, s, p = a, c = 0;
      const g = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (g.lastIndex = 0, e = e.slice(-1 * t.length + a); (i = g.exec(e)) != null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l) continue;
        if (s = [...l].length, i[3] || i[4]) {
          p += s;
          continue;
        } else if ((i[5] || i[6]) && a % 3 && !((a + s) % 3)) {
          c += s;
          continue;
        }
        if (p -= s, p > 0) continue;
        s = Math.min(s, s + p + c);
        const u = [...i[0]][0].length, h = t.slice(0, a + i.index + u + s);
        if (Math.min(a, s) % 2) {
          const f = h.slice(1, -1);
          return {
            type: "em",
            raw: h,
            text: f,
            tokens: this.lexer.inlineTokens(f)
          };
        }
        const m = h.slice(2, -2);
        return {
          type: "strong",
          raw: h,
          text: m,
          tokens: this.lexer.inlineTokens(m)
        };
      }
    }
  }
  codespan(t) {
    const e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " ");
      const i = this.rules.other.nonSpaceChar.test(n), o = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return i && o && (n = n.substring(1, n.length - 1)), {
        type: "codespan",
        raw: e[0],
        text: n
      };
    }
  }
  br(t) {
    const e = this.rules.inline.br.exec(t);
    if (e)
      return {
        type: "br",
        raw: e[0]
      };
  }
  del(t) {
    const e = this.rules.inline.del.exec(t);
    if (e)
      return {
        type: "del",
        raw: e[0],
        text: e[2],
        tokens: this.lexer.inlineTokens(e[2])
      };
  }
  autolink(t) {
    const e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, i;
      return e[2] === "@" ? (n = e[1], i = "mailto:" + n) : (n = e[1], i = n), {
        type: "link",
        raw: e[0],
        text: n,
        href: i,
        tokens: [
          {
            type: "text",
            raw: n,
            text: n
          }
        ]
      };
    }
  }
  url(t) {
    var n;
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let i, o;
      if (e[2] === "@")
        i = e[0], o = "mailto:" + i;
      else {
        let a;
        do
          a = e[0], e[0] = ((n = this.rules.inline._backpedal.exec(e[0])) == null ? void 0 : n[0]) ?? "";
        while (a !== e[0]);
        i = e[0], e[1] === "www." ? o = "http://" + e[0] : o = e[0];
      }
      return {
        type: "link",
        raw: e[0],
        text: i,
        href: o,
        tokens: [
          {
            type: "text",
            raw: i,
            text: i
          }
        ]
      };
    }
  }
  inlineText(t) {
    const e = this.rules.inline.text.exec(t);
    if (e) {
      const n = this.lexer.state.inRawBlock;
      return {
        type: "text",
        raw: e[0],
        text: e[0],
        escaped: n
      };
    }
  }
}, be = class Bt {
  constructor(e) {
    q(this, "tokens");
    q(this, "options");
    q(this, "state");
    q(this, "tokenizer");
    q(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || _e, this.options.tokenizer = this.options.tokenizer || new gt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      other: le,
      block: tt.normal,
      inline: ze.normal
    };
    this.options.pedantic ? (n.block = tt.pedantic, n.inline = ze.pedantic) : this.options.gfm && (n.block = tt.gfm, this.options.breaks ? n.inline = ze.breaks : n.inline = ze.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: tt,
      inline: ze
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, n) {
    return new Bt(n).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, n) {
    return new Bt(n).inlineTokens(e);
  }
  /**
   * Preprocessing
   */
  lex(e) {
    e = e.replace(le.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      const i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], i = !1) {
    var o, a, l;
    for (this.options.pedantic && (e = e.replace(le.tabCharGlobal, "    ").replace(le.spaceLine, "")); e; ) {
      let s;
      if ((a = (o = this.options.extensions) == null ? void 0 : o.block) != null && a.some((c) => (s = c.call({ lexer: this }, e, n)) ? (e = e.substring(s.raw.length), n.push(s), !0) : !1))
        continue;
      if (s = this.tokenizer.space(e)) {
        e = e.substring(s.raw.length);
        const c = n.at(-1);
        s.raw.length === 1 && c !== void 0 ? c.raw += `
` : n.push(s);
        continue;
      }
      if (s = this.tokenizer.code(e)) {
        e = e.substring(s.raw.length);
        const c = n.at(-1);
        (c == null ? void 0 : c.type) === "paragraph" || (c == null ? void 0 : c.type) === "text" ? (c.raw += `
` + s.raw, c.text += `
` + s.text, this.inlineQueue.at(-1).src = c.text) : n.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.list(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.html(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.def(e)) {
        e = e.substring(s.raw.length);
        const c = n.at(-1);
        (c == null ? void 0 : c.type) === "paragraph" || (c == null ? void 0 : c.type) === "text" ? (c.raw += `
` + s.raw, c.text += `
` + s.raw, this.inlineQueue.at(-1).src = c.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
          href: s.href,
          title: s.title
        });
        continue;
      }
      if (s = this.tokenizer.table(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(e)) {
        e = e.substring(s.raw.length), n.push(s);
        continue;
      }
      let p = e;
      if ((l = this.options.extensions) != null && l.startBlock) {
        let c = 1 / 0;
        const g = e.slice(1);
        let u;
        this.options.extensions.startBlock.forEach((h) => {
          u = h.call({ lexer: this }, g), typeof u == "number" && u >= 0 && (c = Math.min(c, u));
        }), c < 1 / 0 && c >= 0 && (p = e.substring(0, c + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(p))) {
        const c = n.at(-1);
        i && (c == null ? void 0 : c.type) === "paragraph" ? (c.raw += `
` + s.raw, c.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = c.text) : n.push(s), i = p.length !== e.length, e = e.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(e)) {
        e = e.substring(s.raw.length);
        const c = n.at(-1);
        (c == null ? void 0 : c.type) === "text" ? (c.raw += `
` + s.raw, c.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = c.text) : n.push(s);
        continue;
      }
      if (e) {
        const c = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(c);
          break;
        } else
          throw new Error(c);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(e, n = []) {
    var s, p, c;
    let i = e, o = null;
    if (this.tokens.links) {
      const g = Object.keys(this.tokens.links);
      if (g.length > 0)
        for (; (o = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; )
          g.includes(o[0].slice(o[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (o = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; )
      i = i.slice(0, o.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; (o = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; )
      i = i.slice(0, o.index) + "[" + "a".repeat(o[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    let a = !1, l = "";
    for (; e; ) {
      a || (l = ""), a = !1;
      let g;
      if ((p = (s = this.options.extensions) == null ? void 0 : s.inline) != null && p.some((h) => (g = h.call({ lexer: this }, e, n)) ? (e = e.substring(g.raw.length), n.push(g), !0) : !1))
        continue;
      if (g = this.tokenizer.escape(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.tag(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.link(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(g.raw.length);
        const h = n.at(-1);
        g.type === "text" && (h == null ? void 0 : h.type) === "text" ? (h.raw += g.raw, h.text += g.text) : n.push(g);
        continue;
      }
      if (g = this.tokenizer.emStrong(e, i, l)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.codespan(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.br(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.del(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (g = this.tokenizer.autolink(e)) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      if (!this.state.inLink && (g = this.tokenizer.url(e))) {
        e = e.substring(g.raw.length), n.push(g);
        continue;
      }
      let u = e;
      if ((c = this.options.extensions) != null && c.startInline) {
        let h = 1 / 0;
        const m = e.slice(1);
        let f;
        this.options.extensions.startInline.forEach((y) => {
          f = y.call({ lexer: this }, m), typeof f == "number" && f >= 0 && (h = Math.min(h, f));
        }), h < 1 / 0 && h >= 0 && (u = e.substring(0, h + 1));
      }
      if (g = this.tokenizer.inlineText(u)) {
        e = e.substring(g.raw.length), g.raw.slice(-1) !== "_" && (l = g.raw.slice(-1)), a = !0;
        const h = n.at(-1);
        (h == null ? void 0 : h.type) === "text" ? (h.raw += g.raw, h.text += g.text) : n.push(g);
        continue;
      }
      if (e) {
        const h = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else
          throw new Error(h);
      }
    }
    return n;
  }
}, ht = class {
  // set by the parser
  constructor(t) {
    q(this, "options");
    q(this, "parser");
    this.options = t || _e;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    var a;
    const i = (a = (e || "").match(le.notSpaceStart)) == null ? void 0 : a[0], o = t.replace(le.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + me(i) + '">' + (n ? o : me(o, !0)) + `</code></pre>
` : "<pre><code>" + (n ? o : me(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    const e = t.ordered, n = t.start;
    let i = "";
    for (let l = 0; l < t.items.length; l++) {
      const s = t.items[l];
      i += this.listitem(s);
    }
    const o = e ? "ol" : "ul", a = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + o + a + `>
` + i + "</" + o + `>
`;
  }
  listitem(t) {
    var n;
    let e = "";
    if (t.task) {
      const i = this.checkbox({ checked: !!t.checked });
      t.loose ? ((n = t.tokens[0]) == null ? void 0 : n.type) === "paragraph" ? (t.tokens[0].text = i + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = i + " " + me(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({
        type: "text",
        raw: i + " ",
        text: i + " ",
        escaped: !0
      }) : e += i + " ";
    }
    return e += this.parser.parse(t.tokens, !!t.loose), `<li>${e}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", n = "";
    for (let o = 0; o < t.header.length; o++)
      n += this.tablecell(t.header[o]);
    e += this.tablerow({ text: n });
    let i = "";
    for (let o = 0; o < t.rows.length; o++) {
      const a = t.rows[o];
      n = "";
      for (let l = 0; l < a.length; l++)
        n += this.tablecell(a[l]);
      i += this.tablerow({ text: n });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    const e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  /**
   * span level renderer
   */
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${me(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    const i = this.parser.parseInline(n), o = nr(t);
    if (o === null)
      return i;
    t = o;
    let a = '<a href="' + t + '"';
    return e && (a += ' title="' + me(e) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    const o = nr(t);
    if (o === null)
      return me(n);
    t = o;
    let a = `<img src="${t}" alt="${n}"`;
    return e && (a += ` title="${me(e)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : me(t.text);
  }
}, Gt = class {
  // no need for block level renderers
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}, ve = class Mt {
  constructor(e) {
    q(this, "options");
    q(this, "renderer");
    q(this, "textRenderer");
    this.options = e || _e, this.options.renderer = this.options.renderer || new ht(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Gt();
  }
  /**
   * Static Parse Method
   */
  static parse(e, n) {
    return new Mt(n).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, n) {
    return new Mt(n).parseInline(e);
  }
  /**
   * Parse Loop
   */
  parse(e, n = !0) {
    var o, a;
    let i = "";
    for (let l = 0; l < e.length; l++) {
      const s = e[l];
      if ((a = (o = this.options.extensions) == null ? void 0 : o.renderers) != null && a[s.type]) {
        const c = s, g = this.options.extensions.renderers[c.type].call({ parser: this }, c);
        if (g !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(c.type)) {
          i += g || "";
          continue;
        }
      }
      const p = s;
      switch (p.type) {
        case "space": {
          i += this.renderer.space(p);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(p);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(p);
          continue;
        }
        case "code": {
          i += this.renderer.code(p);
          continue;
        }
        case "table": {
          i += this.renderer.table(p);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(p);
          continue;
        }
        case "list": {
          i += this.renderer.list(p);
          continue;
        }
        case "html": {
          i += this.renderer.html(p);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(p);
          continue;
        }
        case "text": {
          let c = p, g = this.renderer.text(c);
          for (; l + 1 < e.length && e[l + 1].type === "text"; )
            c = e[++l], g += `
` + this.renderer.text(c);
          n ? i += this.renderer.paragraph({
            type: "paragraph",
            raw: g,
            text: g,
            tokens: [{ type: "text", raw: g, text: g, escaped: !0 }]
          }) : i += g;
          continue;
        }
        default: {
          const c = 'Token with "' + p.type + '" type was not found.';
          if (this.options.silent)
            return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return i;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(e, n = this.renderer) {
    var o, a;
    let i = "";
    for (let l = 0; l < e.length; l++) {
      const s = e[l];
      if ((a = (o = this.options.extensions) == null ? void 0 : o.renderers) != null && a[s.type]) {
        const c = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += c || "";
          continue;
        }
      }
      const p = s;
      switch (p.type) {
        case "escape": {
          i += n.text(p);
          break;
        }
        case "html": {
          i += n.html(p);
          break;
        }
        case "link": {
          i += n.link(p);
          break;
        }
        case "image": {
          i += n.image(p);
          break;
        }
        case "strong": {
          i += n.strong(p);
          break;
        }
        case "em": {
          i += n.em(p);
          break;
        }
        case "codespan": {
          i += n.codespan(p);
          break;
        }
        case "br": {
          i += n.br(p);
          break;
        }
        case "del": {
          i += n.del(p);
          break;
        }
        case "text": {
          i += n.text(p);
          break;
        }
        default: {
          const c = 'Token with "' + p.type + '" type was not found.';
          if (this.options.silent)
            return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return i;
  }
}, Tt, ct = (Tt = class {
  constructor(t) {
    q(this, "options");
    q(this, "block");
    this.options = t || _e;
  }
  /**
   * Process markdown before marked
   */
  preprocess(t) {
    return t;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(t) {
    return t;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(t) {
    return t;
  }
  /**
   * Provide function to tokenize markdown
   */
  provideLexer() {
    return this.block ? be.lex : be.lexInline;
  }
  /**
   * Provide function to parse tokens
   */
  provideParser() {
    return this.block ? ve.parse : ve.parseInline;
  }
}, q(Tt, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
])), Tt), fi = class {
  constructor(...t) {
    q(this, "defaults", Dt());
    q(this, "options", this.setOptions);
    q(this, "parse", this.parseMarkdown(!0));
    q(this, "parseInline", this.parseMarkdown(!1));
    q(this, "Parser", ve);
    q(this, "Renderer", ht);
    q(this, "TextRenderer", Gt);
    q(this, "Lexer", be);
    q(this, "Tokenizer", gt);
    q(this, "Hooks", ct);
    this.use(...t);
  }
  /**
   * Run callback for every token
   */
  walkTokens(t, e) {
    var i, o;
    let n = [];
    for (const a of t)
      switch (n = n.concat(e.call(this, a)), a.type) {
        case "table": {
          const l = a;
          for (const s of l.header)
            n = n.concat(this.walkTokens(s.tokens, e));
          for (const s of l.rows)
            for (const p of s)
              n = n.concat(this.walkTokens(p.tokens, e));
          break;
        }
        case "list": {
          const l = a;
          n = n.concat(this.walkTokens(l.items, e));
          break;
        }
        default: {
          const l = a;
          (o = (i = this.defaults.extensions) == null ? void 0 : i.childTokens) != null && o[l.type] ? this.defaults.extensions.childTokens[l.type].forEach((s) => {
            const p = l[s].flat(1 / 0);
            n = n.concat(this.walkTokens(p, e));
          }) : l.tokens && (n = n.concat(this.walkTokens(l.tokens, e)));
        }
      }
    return n;
  }
  use(...t) {
    const e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      const i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((o) => {
        if (!o.name)
          throw new Error("extension name required");
        if ("renderer" in o) {
          const a = e.renderers[o.name];
          a ? e.renderers[o.name] = function(...l) {
            let s = o.renderer.apply(this, l);
            return s === !1 && (s = a.apply(this, l)), s;
          } : e.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const a = e[o.level];
          a ? a.unshift(o.tokenizer) : e[o.level] = [o.tokenizer], o.start && (o.level === "block" ? e.startBlock ? e.startBlock.push(o.start) : e.startBlock = [o.start] : o.level === "inline" && (e.startInline ? e.startInline.push(o.start) : e.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (e.childTokens[o.name] = o.childTokens);
      }), i.extensions = e), n.renderer) {
        const o = this.defaults.renderer || new ht(this.defaults);
        for (const a in n.renderer) {
          if (!(a in o))
            throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a))
            continue;
          const l = a, s = n.renderer[l], p = o[l];
          o[l] = (...c) => {
            let g = s.apply(o, c);
            return g === !1 && (g = p.apply(o, c)), g || "";
          };
        }
        i.renderer = o;
      }
      if (n.tokenizer) {
        const o = this.defaults.tokenizer || new gt(this.defaults);
        for (const a in n.tokenizer) {
          if (!(a in o))
            throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a))
            continue;
          const l = a, s = n.tokenizer[l], p = o[l];
          o[l] = (...c) => {
            let g = s.apply(o, c);
            return g === !1 && (g = p.apply(o, c)), g;
          };
        }
        i.tokenizer = o;
      }
      if (n.hooks) {
        const o = this.defaults.hooks || new ct();
        for (const a in n.hooks) {
          if (!(a in o))
            throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a))
            continue;
          const l = a, s = n.hooks[l], p = o[l];
          ct.passThroughHooks.has(a) ? o[l] = (c) => {
            if (this.defaults.async)
              return Promise.resolve(s.call(o, c)).then((u) => p.call(o, u));
            const g = s.call(o, c);
            return p.call(o, g);
          } : o[l] = (...c) => {
            let g = s.apply(o, c);
            return g === !1 && (g = p.apply(o, c)), g;
          };
        }
        i.hooks = o;
      }
      if (n.walkTokens) {
        const o = this.defaults.walkTokens, a = n.walkTokens;
        i.walkTokens = function(l) {
          let s = [];
          return s.push(a.call(this, l)), o && (s = s.concat(o.call(this, l))), s;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return be.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return ve.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (n, i) => {
      const o = { ...i }, a = { ...this.defaults, ...o }, l = this.onError(!!a.silent, !!a.async);
      if (this.defaults.async === !0 && o.async === !1)
        return l(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof n > "u" || n === null)
        return l(new Error("marked(): input parameter is undefined or null"));
      if (typeof n != "string")
        return l(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
      a.hooks && (a.hooks.options = a, a.hooks.block = t);
      const s = a.hooks ? a.hooks.provideLexer() : t ? be.lex : be.lexInline, p = a.hooks ? a.hooks.provideParser() : t ? ve.parse : ve.parseInline;
      if (a.async)
        return Promise.resolve(a.hooks ? a.hooks.preprocess(n) : n).then((c) => s(c, a)).then((c) => a.hooks ? a.hooks.processAllTokens(c) : c).then((c) => a.walkTokens ? Promise.all(this.walkTokens(c, a.walkTokens)).then(() => c) : c).then((c) => p(c, a)).then((c) => a.hooks ? a.hooks.postprocess(c) : c).catch(l);
      try {
        a.hooks && (n = a.hooks.preprocess(n));
        let c = s(n, a);
        a.hooks && (c = a.hooks.processAllTokens(c)), a.walkTokens && this.walkTokens(c, a.walkTokens);
        let g = p(c, a);
        return a.hooks && (g = a.hooks.postprocess(g)), g;
      } catch (c) {
        return l(c);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        const i = "<p>An error occurred:</p><pre>" + me(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e)
        return Promise.reject(n);
      throw n;
    };
  }
}, Ie = new fi();
function Z(t, e) {
  return Ie.parse(t, e);
}
Z.options = Z.setOptions = function(t) {
  return Ie.setOptions(t), Z.defaults = Ie.defaults, _r(Z.defaults), Z;
};
Z.getDefaults = Dt;
Z.defaults = _e;
Z.use = function(...t) {
  return Ie.use(...t), Z.defaults = Ie.defaults, _r(Z.defaults), Z;
};
Z.walkTokens = function(t, e) {
  return Ie.walkTokens(t, e);
};
Z.parseInline = Ie.parseInline;
Z.Parser = ve;
Z.parser = ve.parse;
Z.Renderer = ht;
Z.TextRenderer = Gt;
Z.Lexer = be;
Z.lexer = be.lex;
Z.Tokenizer = gt;
Z.Hooks = ct;
Z.parse = Z;
Z.options;
Z.setOptions;
Z.use;
Z.walkTokens;
Z.parseInline;
ve.parse;
be.lex;
class mi {
  constructor() {
    q(this, "products", null);
    q(this, "blogs", null);
    q(this, "news", null);
    q(this, "pages", null);
    q(this, "registeredPrefixes", /* @__PURE__ */ new Set(["cache_", "gh_version_", "analytics_"]));
    q(this, "registeredKeys", /* @__PURE__ */ new Set(["analytics_consent", "analytics_optout", "analytics_session"]));
    q(this, "CACHE_TTL_DEV", 6e4);
    // 60s
    q(this, "CACHE_TTL_PROD", 36e5);
    q(this, "KNOWN_APP_SLUGS", []);
    q(this, "KNOWN_BLOG_IDS", []);
  }
  // 1 hour
  /**
   * Registers a storage key prefix for local persistence and cache purging.
   * Consumers (e.g. eg1.in, mchess.eg1.in, av.eg1.in) register their own application prefixes.
   */
  registerStoragePrefix(e) {
    e && typeof e == "string" && this.registeredPrefixes.add(e);
  }
  /**
   * Registers a specific storage key for cache management and purging.
   */
  registerStorageKey(e) {
    e && typeof e == "string" && this.registeredKeys.add(e);
  }
  isDev() {
    if (typeof window > "u") return !1;
    const e = window.location.hostname;
    return e === "localhost" || e === "127.0.0.1" || window.location.protocol === "file:";
  }
  getTTL() {
    return this.isDev() ? this.CACHE_TTL_DEV : this.CACHE_TTL_PROD;
  }
  getPersistent(e) {
    if (typeof window > "u") return null;
    try {
      if (window.location.search.includes("nocache") || window.location.search.includes("refresh"))
        return null;
      const n = localStorage.getItem(e), i = localStorage.getItem(`${e}_time`);
      if (n && i && Date.now() - parseInt(i, 10) < this.getTTL())
        return JSON.parse(n);
    } catch (n) {
      console.warn(`[DataCache] Persistent cache read error for ${e}:`, n);
    }
    return null;
  }
  setPersistent(e, n) {
    if (!(typeof window > "u"))
      try {
        localStorage.setItem(e, JSON.stringify(n)), localStorage.setItem(`${e}_time`, Date.now().toString());
      } catch (i) {
        console.warn(`[DataCache] Persistent cache write error for ${e}:`, i);
      }
  }
  clearCache(e) {
    if (!(typeof window > "u") && (!e || e === "ALL")) {
      this.products = null, this.news = null, this.pages = null, this.blogs = null;
      try {
        const n = Array.from(this.registeredPrefixes), i = this.registeredKeys;
        Object.keys(localStorage).filter(
          (a) => i.has(a) || n.some((l) => a.startsWith(l))
        ).forEach((a) => localStorage.removeItem(a));
      } catch (n) {
        console.warn("[DataCache] Error clearing localStorage:", n);
      }
    }
  }
  /**
   * Fetches website content JSON (news, page intros, copy)
   */
  async getWebsiteContent(e = "data/website_content.json") {
    const n = `eg_website_content_v2_${encodeURIComponent(e)}`, i = this.getPersistent(n);
    if (i) return i;
    try {
      const o = await fetch(e);
      if (!o.ok) throw new Error(`HTTP error ${o.status}`);
      const a = await o.json();
      return this.setPersistent(n, a), a;
    } catch (o) {
      return console.warn("[DataCache] Failed to fetch website_content.json:", o), null;
    }
  }
  /**
   * Fetches news items
   */
  async getNews(e = "data/website_content.json") {
    if (this.news && this.news.length > 0) return this.news;
    const n = await this.getWebsiteContent(e);
    return n && Array.isArray(n.news) ? (this.news = n.news, this.news) : [];
  }
  /**
   * Fetches static page content snippet by key (e.g., 'about', 'contact', 'apps')
   */
  async getPageContent(e, n = "data/website_content.json") {
    const i = await this.getWebsiteContent(n);
    if (!i) return null;
    const o = i.pages || i;
    return o && o[e] ? o[e] : i[e] ? i[e] : null;
  }
  /**
   * Registers application slugs for Markdown fallback ingestion.
   */
  registerAppSlugs(e) {
    this.KNOWN_APP_SLUGS = Array.from(/* @__PURE__ */ new Set([...this.KNOWN_APP_SLUGS, ...e]));
  }
  /**
   * Helper to parse YAML frontmatter and Markdown body of an application file.
   */
  parseAppMarkdown(e, n) {
    if (!e) return null;
    const i = e.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
    if (!i) return null;
    const o = i[1], a = (i[2] || "").trim(), l = {}, s = o.split(/\r?\n/);
    let p = null;
    for (let f = 0; f < s.length; f++) {
      const y = s[f], k = y.trim();
      if (!k || k.startsWith("#")) continue;
      const v = /^(\s{2,}|\t)/.test(y), x = y.indexOf(":");
      if (x === -1) continue;
      const b = y.slice(0, x).trim();
      let w = y.slice(x + 1).trim();
      const I = w.startsWith('"') && w.endsWith('"') || w.startsWith("'") && w.endsWith("'");
      I && (w = w.slice(1, -1)), v && p ? ((!l[p] || typeof l[p] != "object") && (l[p] = {}), l[p][b] = w) : w === "" && !I ? (p = b, l[p] = {}) : (p = null, l[b] = w);
    }
    let c = "";
    try {
      c = Ae(Z.parse(a));
    } catch {
      c = Ae("<p>" + a.replace(/\n\n+/g, "</p><p>") + "</p>");
    }
    const g = l.name || l.product_name || l.title || n || "Unknown App", u = l.slug || n || g.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-"), h = l.id || u;
    let m = "1.0.0";
    return l.version && typeof l.version == "object" ? m = l.version["version-string"] || l.version.versionString || l.version.version || "1.0.0" : typeof l.version == "string" && (m = l.version), {
      id: h,
      title: g,
      name: g,
      slug: u,
      category: l.category || l.categories || "General",
      categories: l.categories || l.category || "General",
      product_type: l.product_type || "Desktop App",
      version: m,
      rawVersion: l.version,
      active: l.active !== void 0 ? l.active : "1",
      icon: typeof l.icon == "string" && l.icon.trim() || typeof l.imageUrl == "string" && l.imageUrl.trim() || "",
      imageUrl: typeof l.imageUrl == "string" && l.imageUrl.trim() || typeof l.icon == "string" && l.icon.trim() || "",
      short_description: l.short_description || l.description || "",
      description: l.description || l.short_description || "",
      full_description: c || l.description || l.short_description || "",
      markdownBody: a,
      webapp_link: l.webapp_link || "",
      attach_upload_file_1: l.attach_upload_file_1 || "",
      button1: l.button1 || (l.product_type === "WebApp" && l.webapp_link ? { LAUNCH: l.webapp_link, sameTab: "false" } : { "VIEW DETAILS": `apps?title=${u}`, sameTab: "true" }),
      button2: l.button2 || (l.attach_upload_file_1 ? { DOWNLOAD: l.attach_upload_file_1, sameTab: "true" } : void 0),
      createdAt: l.createdAt || "",
      updatedAt: l.updatedAt || ""
    };
  }
  getRequestedAppSlug() {
    if (typeof window > "u" || !window.location || !window.location.search) return null;
    try {
      const e = new URLSearchParams(window.location.search), n = e.get("title") || e.get("id");
      if (n)
        return n.trim().toLowerCase().replace(/_/g, "-");
    } catch {
    }
    return null;
  }
  /**
   * Fetches applications/products catalog with dynamic markdown ingestion,
   * chronological sorting, and static JSON fallback.
   */
  async getProducts(e = "data/apps.json") {
    const n = typeof e == "string" ? { productsUrl: e } : e, i = n.productsUrl || "data/apps.json", o = n.mdDir ? n.mdDir.endsWith("/") ? n.mdDir : `${n.mdDir}/` : "data/apps/", a = n.filterActive !== !1;
    if (this.products && this.products.length > 0)
      return a ? this.products.filter((g) => g.active === "1" || g.active === 1 || g.active === !0 || g.active === void 0) : this.products;
    const l = (n.slugs && n.slugs.length > 0 ? n.slugs : this.KNOWN_APP_SLUGS).slice(), s = this.getRequestedAppSlug();
    s && !l.includes(s) && l.unshift(s);
    const p = n.mdDir ? `eg_apps_cache_v5_md_${encodeURIComponent(o)}_${l.join("_")}` : `eg_apps_cache_v5_${encodeURIComponent(i)}`, c = this.getPersistent(p);
    if (c && Array.isArray(c) && c.length > 0)
      return this.products = c, a ? c.filter((g) => g.active === "1" || g.active === 1 || g.active === !0 || g.active === void 0) : c;
    try {
      const g = o.startsWith("/") || o.startsWith("http") ? o : `/${o}`, u = o.replace(/^\/+/, ""), h = l.map(async (y) => {
        try {
          const k = y.trim(), v = Array.from(
            /* @__PURE__ */ new Set([
              `${g}${k.toLowerCase()}.md`,
              `${g}${k}.md`,
              `${u}${k.toLowerCase()}.md`,
              `${u}${k}.md`
            ])
          );
          let x = null;
          for (const b of v)
            try {
              const w = await fetch(b);
              if (w.ok) {
                x = await w.text();
                break;
              }
            } catch {
            }
          return x ? this.parseAppMarkdown(x, k) : null;
        } catch {
          return null;
        }
      }), f = (await Promise.all(h)).filter((y) => y !== null);
      if (f.length > 0)
        return f.sort((y, k) => {
          const v = new Date(y.createdAt || y.updatedAt || 0).getTime(), x = new Date(k.createdAt || k.updatedAt || 0).getTime();
          return !isNaN(v) && !isNaN(x) && v !== x ? x - v : String(k.id || "").localeCompare(String(y.id || ""));
        }), this.products = f, this.setPersistent(p, f), a ? f.filter((y) => y.active === "1" || y.active === 1 || y.active === !0 || y.active === void 0) : f;
    } catch (g) {
      console.warn("[DataCache] Failed loading markdown apps:", g);
    }
    try {
      const g = await fetch(i);
      if (!g.ok) throw new Error(`HTTP error ${g.status}`);
      const u = await g.json();
      return u.sort((h, m) => {
        const f = new Date(h.createdAt || h.updatedAt || 0).getTime(), y = new Date(m.createdAt || m.updatedAt || 0).getTime();
        return !isNaN(f) && !isNaN(y) && f !== y ? y - f : String(m.id || "").localeCompare(String(h.id || ""));
      }), this.products = u, this.setPersistent(p, u), a ? u.filter((h) => h.active === "1" || h.active === 1 || h.active === !0 || h.active === void 0) : u;
    } catch (g) {
      return console.warn("[DataCache] Failed to fetch apps.json fallback:", g), [];
    }
  }
  /**
   * Extracts 'owner/repo' from GitHub URLs
   */
  extractGithubRepo(e) {
    if (!e || typeof e != "string") return null;
    const n = e.match(/github\.com\/([^/]+)\/([^/\s#?]+)/i);
    if (n) {
      const i = n[1];
      let o = n[2];
      return o.endsWith(".git") && (o = o.slice(0, -4)), ["features", "about", "topics", "collections", "site", "orgs", "users", "pricing", "explore"].includes(i.toLowerCase()) ? null : `${i}/${o}`;
    }
    return null;
  }
  /**
   * Finds any GitHub repository referenced in a product object
   */
  findGithubRepoInProduct(e) {
    if (!e) return null;
    const n = [], i = (o) => {
      o && (typeof o == "string" ? n.push(o) : typeof o == "object" && Object.values(o).forEach((a) => {
        typeof a == "string" && n.push(a);
      }));
    };
    i(e.button1), i(e.button2), typeof e.webapp_link == "string" && n.push(e.webapp_link);
    for (const o of n) {
      const a = this.extractGithubRepo(o);
      if (a) return a;
    }
    return null;
  }
  /**
   * Fetches latest release or tag version from GitHub with local caching
   */
  async getGithubVersion(e) {
    var o;
    if (!e || typeof window > "u" || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(e)) return null;
    const n = `gh_version_${e.replace(/[^a-zA-Z0-9_]/g, "_")}`, i = this.getPersistent(n);
    if (i) return i;
    try {
      const a = await fetch(`https://api.github.com/repos/${e}/releases/latest`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (a.ok) {
        const s = await a.json();
        let p = s.tag_name || s.name;
        if (p)
          return p = p.trim().replace(/^v/i, ""), this.setPersistent(n, p), p;
      }
      const l = await fetch(`https://api.github.com/repos/${e}/tags?per_page=1`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (l.ok) {
        const s = await l.json();
        if (Array.isArray(s) && s.length > 0 && ((o = s[0]) != null && o.name)) {
          const p = s[0].name.trim().replace(/^v/i, "");
          return this.setPersistent(n, p), p;
        }
      }
    } catch (a) {
      console.warn(`[DataCache] Could not fetch GitHub version for ${e}:`, a);
    }
    return null;
  }
  /**
   * Synchronizes version numbers from GitHub in background and updates elements
   */
  async syncGithubVersions(e, n) {
    if (!(!Array.isArray(e) || e.length === 0))
      for (const i of e) {
        const o = this.findGithubRepoInProduct(i);
        o && this.getGithubVersion(o).then((a) => {
          a && (i.version = a, n && n(i.id, a));
        });
      }
  }
  /**
   * Resolves display version string for a product
   */
  resolveProductVersion(e) {
    if (!e) return "1.0.0";
    const n = e.rawVersion || e.version;
    if (n && typeof n == "object") {
      const o = n["fetch-github"] === !0 || String(n["fetch-github"]).toLowerCase() === "true" || n.fetchGithub === !0 || String(n.fetchGithub).toLowerCase() === "true", a = n["version-string"] || n.versionString || n.version || "1.0.0";
      if (o) {
        const l = this.findGithubRepoInProduct(e);
        if (l && typeof window < "u") {
          const s = `gh_version_${l.replace(/[^a-zA-Z0-9_]/g, "_")}`, p = this.getPersistent(s);
          if (p) return p.trim();
        }
      }
      return String(a).trim();
    }
    if (e.version && typeof e.version == "string" && e.version.trim())
      return e.version.trim().replace(/^v/i, "");
    const i = this.findGithubRepoInProduct(e);
    if (i && typeof window < "u") {
      const o = `gh_version_${i.replace(/[^a-zA-Z0-9_]/g, "_")}`, a = this.getPersistent(o);
      if (a) return a;
    }
    return "1.0.0";
  }
  /**
   * Registers blog article IDs for Markdown fallback ingestion.
   */
  registerBlogIds(e) {
    this.KNOWN_BLOG_IDS = Array.from(/* @__PURE__ */ new Set([...this.KNOWN_BLOG_IDS, ...e]));
  }
  /**
   * Helper to parse YAML frontmatter and Markdown body of a blog post file.
   */
  parseBlogMarkdown(e, n) {
    if (!e) return null;
    const i = e.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/);
    if (!i) return null;
    const o = i[1], a = (i[2] || "").trim(), l = {}, s = o.split(/\r?\n/);
    for (const k of s) {
      const v = k.trim();
      if (!v || v.startsWith("#")) continue;
      const x = k.indexOf(":");
      if (x === -1) continue;
      const b = k.slice(0, x).trim();
      let w = k.slice(x + 1).trim();
      w.startsWith('"') && w.endsWith('"') || w.startsWith("'") && w.endsWith("'") ? w = w.slice(1, -1) : w.startsWith("[") && w.endsWith("]") && (w = w.slice(1, -1).split(",").map((T) => T.trim().replace(/^["']|["']$/g, "")).filter(Boolean)), l[b] = w;
    }
    const p = String(l.id || n || "").trim().replace(/^id/i, ""), c = l.title || l.heading || `Blog ${p}`, g = Array.isArray(l.tags) ? l.tags : l.category ? [l.category] : ["General"], u = (l.short_description || l.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), h = u.length > 140 ? u.slice(0, 140) + "..." : u, m = (a || "").split(/\s+/).length, y = `${Math.max(1, Math.round(m / 200))} min read`;
    return {
      id: p,
      slug: l.slug || `post-${p}`,
      title: c,
      heading: l.heading || c,
      description: h,
      short_description: h,
      content: a,
      date: l.createdAt || l.release_date || l.date || "2026",
      author: l.author || "Author",
      tags: g,
      category: l.category || (g.length > 0 ? g[0] : "General"),
      readingTime: l.readingTime || y,
      output_image: l.output_image || l.imageUrl || `assets/img/blog/id${p}.webp`
    };
  }
  /**
   * Fetches blog articles dataset from blog-index.json or individual Markdown files.
   */
  async getBlogs(e = "data/blog-index.json", n = "data/blog/", i) {
    if (this.blogs && this.blogs.length > 0) return this.blogs;
    const o = `eg_blogs_cache_v3_${encodeURIComponent(e)}`, a = this.getPersistent(o);
    if (a && Array.isArray(a) && a.length > 0)
      return this.blogs = a, a;
    try {
      const s = await fetch(e);
      if (s.ok) {
        const p = await s.json();
        if (Array.isArray(p) && p.length > 0) {
          const c = p.map((g) => {
            const u = String(g.id).trim().replace(/^id/i, ""), h = Array.isArray(g.tags) ? g.tags.flatMap((m) => m.split(",").map((f) => f.trim())).filter(Boolean) : [g.category || "General"];
            return {
              ...g,
              id: u,
              slug: g.slug || `post-${u}`,
              tags: h,
              category: g.category || (h.length > 0 ? h[0] : "General"),
              short_description: g.short_description || g.description || "",
              description: g.description || g.short_description || "",
              output_image: g.output_image || g.imageUrl || `assets/img/blog/id${u}.webp`
            };
          });
          return c.sort((g, u) => {
            const h = Number(g.id), m = Number(u.id);
            return !isNaN(h) && !isNaN(m) ? m - h : String(u.date || "").localeCompare(String(g.date || ""));
          }), this.blogs = c, this.setPersistent(o, c), c;
        }
      }
    } catch {
    }
    const l = i && i.length > 0 ? i : this.KNOWN_BLOG_IDS;
    if (l.length === 0)
      return [];
    try {
      const s = l.map(async (g) => {
        try {
          const u = await fetch(`${n}id${g}.md`);
          if (u.ok) {
            const h = await u.text();
            return this.parseBlogMarkdown(h, g);
          }
        } catch {
        }
        return null;
      }), c = (await Promise.all(s)).filter((g) => g !== null);
      if (c.sort((g, u) => {
        const h = Number(g.id), m = Number(u.id);
        return !isNaN(h) && !isNaN(m) ? m - h : String(u.date || "").localeCompare(String(g.date || ""));
      }), c.length > 0)
        return this.blogs = c, this.setPersistent(o, c), c;
    } catch (s) {
      console.warn("[DataCache] Failed to load blog markdown files:", s);
    }
    return [];
  }
}
const we = new mi(), fl = (t) => t.slug ? t.slug : (t.title || t.name || `app-${t.id}`).trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-"), xi = (t) => t.slug && !/^post-\d+$/i.test(t.slug) && !/^article-\d+$/i.test(t.slug) && !/^\d+$/.test(t.slug) ? t.slug : String(t.heading || t.title || `article-${t.id}`).trim().replace(/c\+\+/gi, "cpp").replace(/c#/gi, "csharp").replace(/f#/gi, "fsharp").replace(/\.net\b/gi, "dotnet").replace(/&/g, " and ").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-") || `article-${t.id}`, ar = ({
  className: t = "",
  size: e = "md",
  showLabel: n = !1,
  customKeys: i,
  onRefreshComplete: o
}) => {
  const [a, l] = _(!1), s = async () => {
    if (!(a || typeof window > "u")) {
      l(!0);
      try {
        we.clearCache("ALL");
        try {
          localStorage.removeItem("analytics_consent"), localStorage.removeItem("analytics_optout"), localStorage.removeItem("analytics_session"), i && Array.isArray(i) && i.forEach((c) => localStorage.removeItem(c)), sessionStorage.clear();
        } catch (c) {
          console.warn("[CacheBuster] Storage reset error:", c);
        }
        if ("caches" in window) {
          const c = await window.caches.keys();
          await Promise.all(c.map((g) => window.caches.delete(g)));
        }
        if ("serviceWorker" in navigator) {
          const c = await navigator.serviceWorker.getRegistrations();
          await Promise.all(c.map((g) => g.unregister()));
        }
      } catch (c) {
        console.warn("[CacheBuster] Cache clearance error:", c);
      }
      if (o)
        o();
      else {
        const c = new URL(window.location.href);
        c.searchParams.set("reload", Date.now().toString()), window.location.href = c.toString();
      }
    }
  }, p = e === "sm" ? 16 : e === "lg" ? 22 : 18;
  return /* @__PURE__ */ d(
    "button",
    {
      type: "button",
      id: "headerCacheRefreshBtn",
      onClick: s,
      disabled: a,
      title: "Clear cache and reload latest version",
      "aria-label": "Clear cache and reload latest version",
      className: `eg-cache-buster ${t}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: e === "sm" ? "6px" : "8px",
        background: "transparent",
        border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))",
        borderRadius: "var(--eg-radius-md, 8px)",
        color: "var(--eg-text-primary, inherit)",
        cursor: a ? "wait" : "pointer",
        transition: "all var(--eg-transition-fast, 150ms)"
      },
      onMouseEnter: (c) => {
        c.currentTarget.style.borderColor = "var(--eg-border-hover, #10b981)", c.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))";
      },
      onMouseLeave: (c) => {
        c.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", c.currentTarget.style.backgroundColor = "transparent";
      },
      children: [
        /* @__PURE__ */ r(
          "svg",
          {
            width: p,
            height: p,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            style: {
              animation: a ? "egSpin 1s linear infinite" : "none"
            },
            children: /* @__PURE__ */ r("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
          }
        ),
        n && /* @__PURE__ */ r("span", { style: { fontSize: "13px", fontWeight: 500 }, children: a ? "Refreshing..." : "Clear Cache" }),
        /* @__PURE__ */ r("style", { children: `
        @keyframes egSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` })
      ]
    }
  );
}, ml = ({
  items: t,
  intervalMs: e = 4500,
  label: n = "News",
  theme: i = "auto",
  className: o = "",
  style: a = {}
}) => {
  const [l, s] = _(0), [p, c] = _(!1), { isDark: g } = wt();
  if (Y(() => {
    if (!t || t.length <= 1 || p) return;
    const x = setInterval(() => {
      s((b) => (b + 1) % t.length);
    }, e);
    return () => clearInterval(x);
  }, [t, e, p]), !t || t.length === 0) return null;
  const u = t[l], h = i === "dark" ? !0 : i === "light" ? !1 : g, m = h ? "rgba(255, 255, 255, 0.08)" : "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))", f = h ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))", y = h ? "#ffffff" : "var(--eg-text-primary, #0f172a)", k = h ? "#cbd5e1" : "var(--eg-text-secondary, #475569)", v = h ? "#94a3b8" : "var(--eg-text-muted, #94a3b8)";
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-totem-ticker ${o}`,
      onMouseEnter: () => c(!0),
      onMouseLeave: () => c(!1),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 16px",
        background: m,
        border: f,
        borderRadius: "var(--eg-radius-md, 8px)",
        fontSize: "13.5px",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        overflow: "hidden",
        backdropFilter: h ? "blur(8px)" : void 0,
        WebkitBackdropFilter: h ? "blur(8px)" : void 0,
        ...a
      },
      children: [
        n && /* @__PURE__ */ r(
          "span",
          {
            style: {
              background: "var(--eg-color-primary, #10b981)",
              color: "#ffffff",
              padding: "2px 8px",
              borderRadius: "var(--eg-radius-xs, 4px)",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              flexShrink: 0
            },
            children: n
          }
        ),
        /* @__PURE__ */ r("div", { style: { flex: 1, minWidth: 0, overflow: "hidden" }, children: /* @__PURE__ */ d(
          "a",
          {
            href: ne(u.link),
            style: {
              color: y,
              textDecoration: "none",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "block",
              transition: "color 0.15s ease"
            },
            onMouseEnter: (x) => {
              x.currentTarget.style.color = "var(--eg-color-primary, #10b981)";
            },
            onMouseLeave: (x) => {
              x.currentTarget.style.color = y;
            },
            children: [
              /* @__PURE__ */ r("strong", { children: u.title }),
              u.description && /* @__PURE__ */ d("span", { style: { color: k, marginLeft: "8px" }, children: [
                "— ",
                u.description
              ] })
            ]
          }
        ) }),
        t.length > 1 && /* @__PURE__ */ d("div", { style: { display: "flex", gap: "4px", flexShrink: 0 }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => s((x) => (x - 1 + t.length) % t.length),
              "aria-label": "Previous headline",
              style: {
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: v,
                padding: "2px 4px",
                fontSize: "16px"
              },
              children: "‹"
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => s((x) => (x + 1) % t.length),
              "aria-label": "Next headline",
              style: {
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: v,
                padding: "2px 4px",
                fontSize: "16px"
              },
              children: "›"
            }
          )
        ] })
      ]
    }
  );
}, qt = ({
  isOpen: t,
  onClose: e,
  title: n,
  url: i,
  description: o = "",
  imageUrl: a
}) => {
  const [l, s] = _(!1), p = i || (typeof window < "u" ? window.location.href : ""), c = async () => {
    try {
      await navigator.clipboard.writeText(p), s(!0), setTimeout(() => s(!1), 2500);
    } catch {
    }
  }, g = encodeURIComponent(p), u = o && o.trim() && o.trim() !== n.trim() ? `${n} - ${o.trim()}` : n, h = encodeURIComponent(u), m = [
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${h}%20${g}`,
      color: "#25D366"
    },
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${h}&url=${g}`,
      color: "#1DA1F2"
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${g}`,
      color: "#0A66C2"
    },
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${g}`,
      color: "#1877F2"
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${g}&text=${h}`,
      color: "#229ED9"
    },
    {
      name: "Reddit",
      url: `https://reddit.com/submit?url=${g}&title=${h}`,
      color: "#FF4500"
    }
  ];
  return /* @__PURE__ */ r(dt, { isOpen: t, onClose: e, title: `Share "${n}"`, maxWidth: "480px", children: /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    (a || o) && /* @__PURE__ */ d(
      "div",
      {
        style: {
          display: "flex",
          gap: "12px",
          alignItems: "center",
          padding: "10px 12px",
          background: "var(--eg-bg-subtle, rgba(255, 255, 255, 0.04))",
          border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.1))",
          borderRadius: "var(--eg-radius-md, 8px)",
          overflow: "hidden"
        },
        children: [
          a && /* @__PURE__ */ r(
            "img",
            {
              src: a,
              alt: n,
              style: {
                width: "58px",
                height: "58px",
                objectFit: "cover",
                borderRadius: "6px",
                flexShrink: 0,
                backgroundColor: "rgba(0, 0, 0, 0.1)"
              },
              onError: (f) => {
                f.currentTarget.style.display = "none";
              }
            }
          ),
          /* @__PURE__ */ d("div", { style: { minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  margin: 0,
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "var(--eg-text-primary, #f8fafc)",
                  lineHeight: 1.35,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical"
                },
                children: n
              }
            ),
            o && o.trim() !== n.trim() && /* @__PURE__ */ r(
              "div",
              {
                style: {
                  margin: "4px 0 0 0",
                  fontSize: "12px",
                  color: "var(--eg-text-muted, #94a3b8)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                },
                children: o
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ r("p", { style: { margin: 0, fontSize: "13px", color: "var(--eg-text-secondary, #cbd5e1)" }, children: "Share this link with friends, developers, or colleagues:" }),
    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "10px" }, children: m.map((f) => /* @__PURE__ */ r(
      "a",
      {
        href: ne(f.url),
        target: "_blank",
        rel: "noopener noreferrer",
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          borderRadius: "var(--eg-radius-md, 8px)",
          background: "var(--eg-bg-subtle, rgba(255, 255, 255, 0.06))",
          border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))",
          color: "var(--eg-text-primary, #f8fafc)",
          fontSize: "13px",
          fontWeight: 500,
          textDecoration: "none",
          transition: "all 0.15s ease"
        },
        onMouseEnter: (y) => {
          y.currentTarget.style.borderColor = f.color, y.currentTarget.style.color = f.color;
        },
        onMouseLeave: (y) => {
          y.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", y.currentTarget.style.color = "var(--eg-text-primary, #f8fafc)";
        },
        children: f.name
      },
      f.name
    )) }),
    /* @__PURE__ */ d("div", { children: [
      /* @__PURE__ */ r(
        "label",
        {
          style: {
            display: "block",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--eg-text-muted, #94a3b8)",
            marginBottom: "6px"
          },
          children: "Direct Link"
        }
      ),
      /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px" }, children: [
        /* @__PURE__ */ r(
          "input",
          {
            type: "text",
            readOnly: !0,
            value: p,
            style: {
              flex: 1,
              padding: "8px 12px",
              borderRadius: "var(--eg-radius-md, 8px)",
              border: "1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))",
              background: "var(--eg-bg-input, #0f172a)",
              color: "var(--eg-text-primary, #f8fafc)",
              fontSize: "13px",
              fontFamily: "var(--eg-font-mono, monospace)"
            }
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: c,
            style: {
              padding: "8px 16px",
              background: l ? "#10b981" : "var(--eg-color-primary, #2563eb)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--eg-radius-md, 8px)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease",
              flexShrink: 0
            },
            children: l ? "Copied!" : "Copy"
          }
        )
      ] })
    ] })
  ] }) });
}, ke = "analytics_consent", Ye = "analytics_session", yi = 50, bi = 3500, vi = () => {
  const t = /* @__PURE__ */ new Date(), e = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
  return `${e}-${n}-${i}`;
}, wi = (t) => /windows/i.test(t) ? "Windows" : /macintosh|mac os x/i.test(t) ? "macOS" : /linux/i.test(t) ? "Linux" : /android/i.test(t) ? "Android" : /iphone|ipad|ipod/i.test(t) ? "iOS" : "Unknown OS", ki = (t) => /edg\//i.test(t) ? "Edge" : /opr\/|opera/i.test(t) ? "Opera" : /chrome|crios/i.test(t) ? "Chrome" : /firefox|fxios/i.test(t) ? "Firefox" : /safari/i.test(t) && !/chrome|crios/i.test(t) ? "Safari" : "Unknown Browser", Si = async () => {
  const t = {
    ip: "Unknown",
    city: "Unknown",
    region: "Unknown",
    country: "Unknown",
    org: "Unknown",
    postal: "Unknown"
  };
  if (typeof window > "u") return t;
  try {
    const e = new AbortController(), n = setTimeout(() => e.abort(), bi);
    try {
      const o = await fetch("https://ipapi.co/json/", { signal: e.signal });
      if (clearTimeout(n), o.ok) {
        const a = await o.json();
        return {
          ip: a.ip || "Unknown",
          city: a.city || "Unknown",
          region: a.region || "Unknown",
          country: a.country_name || a.country || "Unknown",
          org: a.org || "Unknown",
          postal: a.postal || "Unknown"
        };
      }
    } catch {
    }
    const i = await fetch("https://ipwho.is/");
    if (i.ok) {
      const o = await i.json();
      return {
        ip: o.ip || "Unknown",
        city: o.city || "Unknown",
        region: o.region || "Unknown",
        country: o.country || "Unknown",
        org: o.connection && o.connection.isp || "Unknown",
        postal: o.postal || "Unknown"
      };
    }
  } catch {
  }
  return t;
}, Kt = (t) => {
  if (typeof window > "u") return !1;
  try {
    const e = t || ke;
    return localStorage.getItem(e) === "denied" ? !0 : localStorage.getItem("analytics_optout") === "true";
  } catch {
    return !1;
  }
}, Ci = (t) => {
  if (typeof window > "u") return !1;
  try {
    if (Kt(t)) return !1;
    const e = t || ke;
    return localStorage.getItem(e) === "granted";
  } catch {
    return !1;
  }
}, jr = (t) => {
  if (typeof window > "u") return !1;
  try {
    const e = t || Ye;
    return !!sessionStorage.getItem(e);
  } catch {
    return !1;
  }
}, Ai = (t) => {
  if (!(typeof window > "u"))
    try {
      const e = t || Ye;
      sessionStorage.setItem(e, "1");
    } catch {
    }
}, Ii = async (t, e = {}) => {
  if (typeof window > "u" || Kt(e.consentStorageKey) || jr(e.sessionStorageKey)) return null;
  const n = t || (typeof window < "u" && window.location.hostname ? window.location.hostname : "web-app"), i = navigator.userAgent || "", o = wi(i), a = ki(i), l = window.location.pathname + (window.location.search || "");
  let s = "Direct";
  if (document.referrer)
    try {
      s = new URL(document.referrer, window.location.href).hostname || "Direct";
    } catch {
      s = "Unknown";
    }
  const p = window.screen ? `${window.screen.width}x${window.screen.height}` : "Unknown", c = typeof Intl < "u" && Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown", g = navigator.language || "en", u = await Si();
  return {
    id: typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID() : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    appName: n,
    pageVisited: l || "/",
    referrer: s,
    ip: u.ip,
    city: u.city,
    region: u.region,
    country: u.country,
    org: u.org,
    postal: u.postal,
    timezone: c,
    os: o,
    browser: a,
    screen: p,
    language: g
  };
}, Li = async (t, e, n = {}) => {
  var g, u, h, m, f, y, k;
  if (!t || !e) return !1;
  const i = n.collectionName || "visitor_analytics", o = n.pageSize || yi, a = vi(), l = {};
  for (const [v, x] of Object.entries(e))
    l[v] = x == null ? "" : String(x);
  const s = typeof window < "u" && ((u = (g = window.firebase) == null ? void 0 : g.firestore) == null ? void 0 : u.FieldValue) || ((h = t == null ? void 0 : t.constructor) == null ? void 0 : h.FieldValue) || ((y = (f = (m = t == null ? void 0 : t.app) == null ? void 0 : m.firebase) == null ? void 0 : f.firestore) == null ? void 0 : y.FieldValue) || ((k = t == null ? void 0 : t.firestore) == null ? void 0 : k.FieldValue), p = s && typeof s.serverTimestamp == "function" ? s.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString(), c = t.collection(i).doc("meta");
  try {
    return await t.runTransaction(async (v) => {
      const x = await v.get(c);
      let b = 1, w = 0, I = 0, T = a, C = 0;
      if (x && (typeof x.exists == "function" ? x.exists() : x.exists)) {
        const P = x.data() || {};
        b = P.currentPage || 1, w = P.currentCount || 0, I = P.totalVisitors || 0, P.todayDate === a ? C = P.todayCount || 0 : (T = a, C = 0);
      }
      w >= o && (b++, w = 0);
      const M = t.collection(i).doc(`page_${b}`);
      let W;
      s && typeof s.arrayUnion == "function" ? W = s.arrayUnion(l) : W = [l], v.set(
        M,
        {
          pageNum: b,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          logs: W
        },
        { merge: !0 }
      ), v.set(
        c,
        {
          currentPage: b,
          currentCount: w + 1,
          totalVisitors: I + 1,
          todayDate: T,
          todayCount: C + 1,
          lastUpdated: p
        },
        { merge: !0 }
      );
    }), !0;
  } catch (v) {
    const x = (v == null ? void 0 : v.message) || String(v);
    if ((v == null ? void 0 : v.code) === "permission-denied" || x.toLowerCase().includes("permission"))
      console.error(
        `[writeVisitorLogToFirestore] Firestore permission denied for collection "${i}". Security rules must allow create/update on page documents and read/write on meta document. Please check firestore.rules in Firebase Console. Details: ${x}`
      );
    else {
      console.warn("[writeVisitorLogToFirestore] Transaction failed, attempting direct batch fallback:", v);
      try {
        const b = await c.get();
        let w = 1, I = 0, T = 0, C = 0, M = a;
        if (b && (typeof b.exists == "function" ? b.exists() : b.exists)) {
          const R = b.data() || {};
          w = R.currentPage || 1, I = R.currentCount || 0, T = R.totalVisitors || 0, R.todayDate === a && (C = R.todayCount || 0);
        }
        I >= o && (w++, I = 0);
        const W = t.collection(i).doc(`page_${w}`), P = s && typeof s.arrayUnion == "function" ? s.arrayUnion(l) : [l];
        return await W.set(
          {
            pageNum: w,
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
            logs: P
          },
          { merge: !0 }
        ), await c.set(
          {
            currentPage: w,
            currentCount: I + 1,
            totalVisitors: T + 1,
            todayDate: M,
            todayCount: C + 1,
            lastUpdated: p
          },
          { merge: !0 }
        ), !0;
      } catch (b) {
        console.warn("[writeVisitorLogToFirestore] Direct fallback also failed:", b);
      }
    }
    return !1;
  }
}, xl = ({
  privacyPolicyUrl: t = "privacypolicy",
  storageKey: e,
  message: n = "We collect anonymous telemetry to optimize tools & apps performance.",
  privacyPolicyLabel: i = "Privacy Policy",
  acceptLabel: o = "OK",
  declineLabel: a = "Decline",
  onConsentChange: l
}) => {
  const [s, p] = _(!1), c = e || ke;
  Y(() => {
    try {
      localStorage.getItem(c) || localStorage.getItem(ke) || localStorage.getItem("analytics_consent") || p(!0);
    } catch {
    }
    const u = () => {
      p(!0);
    }, h = (m) => {
      const f = m;
      (f.detail === "granted" || f.detail === "denied") && p(!1);
    };
    if (window.addEventListener("show_consent_banner", u), window.addEventListener("analytics_consent_changed", h), typeof window < "u") {
      const m = {
        showConsentBanner: () => {
          window.dispatchEvent(new CustomEvent("show_consent_banner"));
        },
        grantConsent: () => g("granted"),
        denyConsent: () => g("denied")
      };
      window.AnalyticsTracker = m;
    }
    return () => {
      window.removeEventListener("show_consent_banner", u), window.removeEventListener("analytics_consent_changed", h);
    };
  }, [c]);
  const g = (u) => {
    try {
      localStorage.setItem(c, u), c !== ke && localStorage.setItem(ke, u), localStorage.setItem("analytics_consent", u), u === "denied" ? (localStorage.setItem("analytics_optout", "true"), sessionStorage.removeItem(Ye)) : localStorage.removeItem("analytics_optout");
    } catch {
    }
    p(!1), window.dispatchEvent(new CustomEvent("analytics_consent_changed", { detail: u })), window.dispatchEvent(new CustomEvent("eg_consent_changed", { detail: u })), l && l(u);
  };
  return s ? /* @__PURE__ */ d(
    "aside",
    {
      id: "analytics-consent-banner",
      "aria-label": "Privacy and Cookie Consent",
      className: "eg-consent-banner",
      children: [
        /* @__PURE__ */ d("div", { className: "eg-consent-banner__content", children: [
          /* @__PURE__ */ r("span", { children: n }),
          " ",
          t && /* @__PURE__ */ r(
            "a",
            {
              href: ne(t),
              className: "eg-consent-banner__link",
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ d("div", { className: "eg-consent-banner__actions", children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => g("denied"),
              className: "eg-consent-banner__btn-decline",
              children: a
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => g("granted"),
              className: "eg-consent-banner__btn-accept",
              children: o
            }
          )
        ] })
      ]
    }
  ) : null;
}, yl = ({
  storageKey: t = ke,
  legacyKeys: e = [],
  sessionStorageKey: n = Ye,
  title: i = "Analytics & Telemetry Preferences",
  description: o,
  showToggle: a = !0,
  showReopenBannerBtn: l = !0,
  showResetBtn: s = !0,
  onConsentChange: p,
  className: c = "",
  style: g = {}
}) => {
  const [u, h] = _("pending"), m = te(() => {
    try {
      const x = localStorage.getItem(t);
      if (x === "granted" || x === "denied") return x;
      if (e && e.length > 0)
        for (const b of e) {
          const w = localStorage.getItem(b);
          if (w === "denied" || w === "true") return "denied";
          if (w === "granted") return "granted";
        }
    } catch {
    }
    return "pending";
  }, [t, e]);
  Y(() => {
    h(m());
    const x = (b) => {
      const w = b;
      w.detail === "granted" || w.detail === "denied" ? h(w.detail) : h(m());
    };
    return window.addEventListener("analytics_consent_changed", x), window.addEventListener("storage", x), () => {
      window.removeEventListener("analytics_consent_changed", x), window.removeEventListener("storage", x);
    };
  }, [m]);
  const f = (x) => {
    try {
      if (localStorage.setItem(t, x), localStorage.setItem("analytics_consent", x), e && e.length > 0)
        for (const b of e)
          localStorage.setItem(b, x);
      x === "denied" ? localStorage.setItem("analytics_optout", "true") : localStorage.removeItem("analytics_optout"), x === "denied" && n && sessionStorage.removeItem(n);
    } catch {
    }
    h(x), window.dispatchEvent(new CustomEvent("analytics_consent_changed", { detail: x })), window.dispatchEvent(new CustomEvent("eg_consent_changed", { detail: x })), p && p(x);
  }, y = () => {
    try {
      localStorage.removeItem(t), localStorage.removeItem("analytics_consent"), localStorage.removeItem("analytics_optout"), e.forEach((x) => localStorage.removeItem(x)), n && sessionStorage.removeItem(n);
    } catch {
    }
    h("pending"), window.dispatchEvent(new CustomEvent("show_consent_banner")), window.dispatchEvent(new CustomEvent("eg_show_consent_banner"));
  }, k = () => {
    window.dispatchEvent(new CustomEvent("show_consent_banner")), window.dispatchEvent(new CustomEvent("eg_show_consent_banner"));
  }, v = u === "granted";
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-consent-control-card ${c}`,
      style: {
        background: "var(--eg-bg-surface-elevated, var(--eg-bg-surface, #ffffff))",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
        borderRadius: "var(--eg-radius-lg, 12px)",
        padding: "24px",
        margin: "28px 0",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        color: "var(--eg-text-primary, #0f172a)",
        ...g
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px"
            },
            children: [
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ r("h3", { style: { margin: 0, fontSize: "1.2rem", fontWeight: 700 }, children: i }),
                o && /* @__PURE__ */ r(
                  "p",
                  {
                    style: {
                      margin: "4px 0 0",
                      fontSize: "13.5px",
                      color: "var(--eg-text-muted, #64748b)"
                    },
                    children: o
                  }
                )
              ] }),
              /* @__PURE__ */ d(
                "div",
                {
                  role: "status",
                  "aria-live": "polite",
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    letterSpacing: "0.2px",
                    background: u === "granted" ? "rgba(16, 185, 129, 0.12)" : u === "denied" ? "rgba(239, 68, 68, 0.12)" : "rgba(148, 163, 184, 0.15)",
                    color: u === "granted" ? "#10b981" : u === "denied" ? "#ef4444" : "var(--eg-text-muted, #64748b)",
                    border: `1px solid ${u === "granted" ? "rgba(16, 185, 129, 0.35)" : u === "denied" ? "rgba(239, 68, 68, 0.35)" : "rgba(148, 163, 184, 0.3)"}`
                  },
                  children: [
                    /* @__PURE__ */ r(
                      "span",
                      {
                        style: {
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "currentColor",
                          display: "inline-block"
                        }
                      }
                    ),
                    u === "granted" ? "Tracking Active (Anonymous)" : u === "denied" ? "Tracking Disabled (Opted Out)" : "Consent Notice Pending"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r(
          "p",
          {
            style: {
              fontSize: "13.5px",
              lineHeight: 1.65,
              color: "var(--eg-text-secondary, #334155)",
              margin: "0 0 20px"
            },
            children: u === "granted" ? /* @__PURE__ */ d(ce, { children: [
              /* @__PURE__ */ r("strong", { children: "Telemetry is currently active:" }),
              " Non-invasive, anonymous performance metrics (operating system, browser family, approximate location) are collected via our 50-record Batched Bucket Pattern to maintain service performance. No personal identification, message content, or precise GPS coordinates are ever recorded."
            ] }) : u === "denied" ? /* @__PURE__ */ d(ce, { children: [
              /* @__PURE__ */ r("strong", { children: "Telemetry is completely blocked:" }),
              " You have opted out of all usage telemetry. An opt-out flag is preserved in your browser's local storage, preventing any diagnostic tracking on this and future visits."
            ] }) : /* @__PURE__ */ d(ce, { children: [
              /* @__PURE__ */ r("strong", { children: "Default consent state:" }),
              " No preference has been recorded yet. The floating consent notice will be displayed until you choose to accept or decline."
            ] })
          }
        ),
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              paddingTop: "16px",
              borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))"
            },
            children: [
              a && /* @__PURE__ */ d(
                "label",
                {
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    userSelect: "none",
                    fontWeight: 600,
                    fontSize: "14px"
                  },
                  children: [
                    /* @__PURE__ */ d(
                      "div",
                      {
                        style: {
                          position: "relative",
                          width: "46px",
                          height: "24px",
                          borderRadius: "12px",
                          background: v ? "#10b981" : "var(--eg-bg-toggle-off, #cbd5e1)",
                          transition: "background 0.2s ease"
                        },
                        children: [
                          /* @__PURE__ */ r(
                            "input",
                            {
                              type: "checkbox",
                              checked: v,
                              onChange: (x) => f(x.target.checked ? "granted" : "denied"),
                              "aria-label": "Toggle anonymous performance telemetry",
                              style: {
                                position: "absolute",
                                opacity: 0,
                                width: "100%",
                                height: "100%",
                                cursor: "pointer",
                                margin: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ r(
                            "span",
                            {
                              style: {
                                position: "absolute",
                                top: "3px",
                                left: v ? "24px" : "3px",
                                width: "18px",
                                height: "18px",
                                borderRadius: "50%",
                                background: "#ffffff",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
                                transition: "left 0.2s ease"
                              }
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ r("span", { children: v ? "Allow Anonymous Telemetry (Enabled)" : "Opt Out of Telemetry (Disabled)" })
                  ]
                }
              ),
              /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: [
                l && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    id: "btnReopenConsent",
                    onClick: k,
                    style: {
                      background: "rgba(0, 0, 0, 0.05)",
                      border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
                      color: "var(--eg-text-primary, #0f172a)",
                      padding: "7px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    },
                    onMouseEnter: (x) => {
                      x.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                    },
                    onMouseLeave: (x) => {
                      x.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                    },
                    children: "Show Floating Banner"
                  }
                ),
                s && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: y,
                    style: {
                      background: "transparent",
                      border: "1px dashed var(--eg-border-default, rgba(0, 0, 0, 0.2))",
                      color: "var(--eg-text-muted, #64748b)",
                      padding: "7px 14px",
                      borderRadius: "6px",
                      fontSize: "12.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease"
                    },
                    onMouseEnter: (x) => {
                      x.currentTarget.style.color = "var(--eg-color-danger, #ef4444)", x.currentTarget.style.borderColor = "var(--eg-color-danger, #ef4444)";
                    },
                    onMouseLeave: (x) => {
                      x.currentTarget.style.color = "var(--eg-text-muted, #64748b)", x.currentTarget.style.borderColor = "var(--eg-border-default, rgba(0, 0, 0, 0.2))";
                    },
                    children: "Reset to Defaults"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}, Pr = ({
  mainText: t = "BRAND",
  textColor: e,
  domainText: n = "",
  hoverRevealDomain: i = !0,
  domainColor: o,
  domainHoverColor: a,
  bylineText: l = "",
  showByline: s = !!l,
  hoverRevealByline: p = !0,
  bylineColor: c,
  bylineHoverColor: g,
  badgeBg: u,
  badgeHoverBg: h,
  ringBorder: m,
  ringHoverBorder: f,
  icon: y,
  fontFamily: k = "inherit",
  fontSize: v,
  size: x = 80,
  shape: b = "circle",
  innerRing: w = b === "circle",
  ringOnHoverOnly: I = !1,
  theme: T = "auto",
  dataInfo: C,
  onClick: M,
  className: W = "",
  style: P = {}
}) => {
  const [R, E] = _(!1), { isDark: j } = wt(), z = T === "dark" ? !0 : T === "light" ? !1 : j, O = v || Math.round(x * 0.38), $ = Math.round(x * 0.135), L = Math.max(7, Math.round(x * 0.075)), S = Math.max(3, Math.round(x * 0.045)), N = I ? R : !0, A = b === "none" || I && !R ? "transparent" : z ? R ? "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.08))" : "var(--eg-bg-surface, rgba(255, 255, 255, 0.04))" : R ? "var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))" : "var(--eg-bg-surface, rgba(0, 0, 0, 0.02))", D = b === "none" || I && !R ? "transparent" : R ? h || u || A : u || A, V = I && !R ? "transparent" : z ? R ? "var(--eg-border-hover, rgba(255, 255, 255, 0.35))" : "var(--eg-border-default, rgba(255, 255, 255, 0.15))" : R ? "var(--eg-border-hover, rgba(0, 0, 0, 0.25))" : "var(--eg-border-default, rgba(0, 0, 0, 0.12))", B = I && !R ? "transparent" : R ? f || m || V : m || V, H = e || (z ? "#ffffff" : "var(--eg-text-primary, #0f172a)"), U = z ? i ? R ? "var(--eg-text-primary, #ffffff)" : "var(--eg-text-secondary, rgba(255, 255, 255, 0.45))" : "var(--eg-text-primary, #ffffff)" : i ? R ? "var(--eg-text-primary, #0f172a)" : "var(--eg-text-secondary, rgba(0, 0, 0, 0.45))" : "var(--eg-text-primary, #0f172a)", G = R ? a || o || U : o || U, J = z ? p ? R ? "var(--eg-text-secondary, rgba(255, 255, 255, 0.6))" : "var(--eg-text-muted, rgba(255, 255, 255, 0.25))" : "var(--eg-text-secondary, rgba(255, 255, 255, 0.6))" : p ? R ? "var(--eg-text-secondary, rgba(0, 0, 0, 0.6))" : "var(--eg-text-muted, rgba(0, 0, 0, 0.25))" : "var(--eg-text-secondary, rgba(0, 0, 0, 0.6))", F = R ? g || c || J : c || J, oe = b === "circle" ? "50%" : b === "rounded" ? `${Math.max(6, Math.round(x * 0.18))}px` : b === "square" ? "4px" : "0";
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-logo-badge ${W}`,
      onClick: M,
      onMouseEnter: () => E(!0),
      onMouseLeave: () => E(!1),
      style: {
        width: `${x}px`,
        height: `${x}px`,
        borderRadius: oe,
        background: D,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        boxShadow: b !== "none" && N ? z ? "0 2px 10px rgba(0, 0, 0, 0.25)" : "0 2px 8px rgba(0, 0, 0, 0.04)" : "none",
        transition: "background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: M ? "pointer" : "default",
        overflow: "visible",
        // Prevents cursive clipping
        boxSizing: "border-box",
        flexShrink: 0,
        ...P
      },
      children: [
        w && b !== "none" && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "absolute",
              top: `${S}px`,
              left: `${S}px`,
              right: `${S}px`,
              bottom: `${S}px`,
              border: `1.5px solid ${B}`,
              borderRadius: oe,
              pointerEvents: "none",
              opacity: N ? 1 : 0,
              transition: "opacity 0.25s ease, border-color 0.25s ease"
            }
          }
        ),
        /* @__PURE__ */ d(
          "div",
          {
            className: "eg-logo-content",
            style: {
              position: "relative",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              marginTop: s ? `${-Math.round(x * 0.04)}px` : "0",
              zIndex: 2,
              overflow: "visible",
              maxWidth: "100%",
              padding: "0 4px"
            },
            children: [
              y && /* @__PURE__ */ r("span", { style: { marginRight: t ? "6px" : "0" }, children: y }),
              t && /* @__PURE__ */ r(
                "span",
                {
                  className: "eg-logo-main-text",
                  style: {
                    fontFamily: k,
                    color: H,
                    fontSize: `${O}px`,
                    lineHeight: 1.15,
                    fontWeight: k.includes("cursive") || k.includes("Vibes") ? 300 : 700,
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.5px",
                    padding: "0 2px",
                    WebkitFontSmoothing: "antialiased",
                    textShadow: z && R ? "0 0 10px rgba(255, 255, 255, 0.2)" : "none",
                    transition: "color 0.25s ease"
                  },
                  children: t
                }
              ),
              n && /* @__PURE__ */ r(
                "span",
                {
                  className: "eg-logo-domain-text",
                  style: {
                    fontFamily: 'var(--eg-font-sans, "Plus Jakarta Sans", sans-serif)',
                    fontSize: `${$}px`,
                    fontWeight: 500,
                    color: G,
                    marginLeft: "2.5px",
                    position: "relative",
                    top: `${-Math.round(x * 0.03)}px`,
                    lineHeight: 1,
                    transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  },
                  children: n
                }
              )
            ]
          }
        ),
        s && l && /* @__PURE__ */ r(
          "span",
          {
            className: "eg-logo-byline",
            "data-info": C,
            style: {
              position: "absolute",
              bottom: `${Math.round(x * 0.1)}px`,
              fontFamily: 'var(--eg-font-sans, "Plus Jakarta Sans", sans-serif)',
              fontSize: `${L}px`,
              fontStyle: "italic",
              fontWeight: 300,
              color: F,
              letterSpacing: "0.3px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 2,
              transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            },
            children: l
          }
        )
      ]
    }
  );
}, _i = ({
  variant: t = "primary",
  preset: e,
  id: n = "backToTopBtn",
  threshold: i,
  backgroundColor: o,
  hoverBackgroundColor: a,
  color: l,
  bottom: s = "25px",
  right: p = "25px",
  className: c = "",
  style: g = {}
}) => {
  const [u, h] = _(!1), [m, f] = _("down"), [y, k] = _(!1), v = e === "mchess" || e === "accent" ? "accent" : t, x = te(() => {
    const C = window.scrollY || document.documentElement.scrollTop || 0, M = document.documentElement.scrollHeight || document.body.scrollHeight || 0, W = window.innerHeight || document.documentElement.clientHeight || 0, P = M - W;
    if (P <= 80) {
      h(!1);
      return;
    }
    const R = Math.min(Math.max(P / 2, 300), 800), E = i !== void 0 ? i : R;
    h(!0), f(C < E ? "down" : "up");
  }, [i]);
  Y(() => (x(), window.addEventListener("scroll", x, { passive: !0 }), window.addEventListener("resize", x, { passive: !0 }), () => {
    window.removeEventListener("scroll", x), window.removeEventListener("resize", x);
  }), [x]);
  const b = () => {
    if (m === "down") {
      const C = document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      window.scrollTo({ top: C, behavior: "smooth" });
    } else
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (!u) return null;
  const w = m === "down" ? "Scroll to Bottom" : "Scroll to Top", I = `eg-smart-scroll-btn--${v}`, T = {
    bottom: s,
    right: p,
    ...o ? { backgroundColor: y && a ? a : o } : {},
    ...l ? { color: l } : {},
    ...g
  };
  return /* @__PURE__ */ r(
    "button",
    {
      type: "button",
      id: n,
      className: `back-to-top-btn eg-smart-scroll-btn ${I} ${c}`.trim(),
      onClick: b,
      onMouseEnter: () => k(!0),
      onMouseLeave: () => k(!1),
      title: w,
      "aria-label": w,
      "data-direction": m,
      style: T,
      children: /* @__PURE__ */ r(
        "svg",
        {
          width: "18",
          height: "18",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2.8",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          style: {
            transform: m === "down" ? "translateY(1px)" : "translateY(-1px)"
          },
          children: m === "down" ? /* @__PURE__ */ r("polyline", { points: "6 9 12 15 18 9" }) : /* @__PURE__ */ r("polyline", { points: "18 15 12 9 6 15" })
        }
      )
    }
  );
}, Ti = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 320 512",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" })
  }
), Wi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" })
  }
), Hr = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
  }
), bl = Hr, $i = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" })
  }
), Zt = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 384 512",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M19 272.47c-11.2 -4.98 -19 -16.2 -19 -29.24v-0.02v-137.21c0 -0.02 0 -0.04 0 -0.06 0 -6.61 2.68 -12.6 7 -16.94l9 -9l-14.21 -28.42c-1.14 -2.27 -1.79 -4.86 -1.79 -7.57v-0.01c0 -6.62 5.38 -12 12 -12h147.94c106 0 191.92 86 191.92 192v192h-319.86v-14.52c0 -0.01 -0.08 0.03 -0.08 0.02 0 -31.31 18.03 -58.45 44.27 -71.58l57.22 -28.65c15.75 -7.88 26.53 -24.13 26.53 -42.93v-0.01v-50.33l-22.12 11.08c-6.19 3.1 -10.84 8.79 -12.55 15.65l-9.22 30.65c-2.81 9.36 -9.77 16.9 -18.76 20.5l-12.78 5.12c-3.67 1.47 -7.72 2.27 -11.91 2.27c-4.62 0 -9.01 -0.98 -12.97 -2.74zM52 128c-11.04 0 -20 8.96 -20 20s8.96 20 20 20 20 -8.96 20 -20 -8.96 -20 -20 -20zM368 448c8.83 0 16 7.17 16 16v32c0 8.83 -7.17 16 -16 16h-352c-8.83 0 -16 -7.17 -16 -16v-32c0 -8.83 7.17 -16 16 -16h352z" })
  }
), Bi = Zt, Fr = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 320 512",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M105.10 224.00c-29.39 -18.38 -49.10 -50.78 -49.10 -88.00c0.00 -57.40 46.60 -104.00 104.00 -104.00s104.00 46.60 104.00 104.00c0.00 37.22 -19.71 69.62 -49.10 88.00h25.10c8.83 -0.00 16.00 7.17 16.00 16.00v32.00c0.00 8.83 -7.17 16.00 -16.00 16.00h-16.00v5.49c0.00 44.00 4.11 86.60 24.00 122.51h-176.00c19.86 -35.91 24.00 -78.51 24.00 -122.51v-5.49h-16.00c-8.83 -0.00 -16.00 -7.17 -16.00 -16.00v-32.00c0.00 -8.83 7.17 -16.00 16.00 -16.00h25.10zM304.00 448.00c8.83 -0.00 16.00 7.17 16.00 16.00v32.00c0.00 8.83 -7.17 16.00 -16.00 16.00h-288.00c-8.83 -0.00 -16.00 -7.17 -16.00 -16.00v-32.00c0.00 -8.83 7.17 -16.00 16.00 -16.00h288.00z" })
  }
), Mi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 2a3.5 3.5 0 0 0-3.5 3.5c0 1.25.66 2.34 1.64 2.95C8.36 9.47 7 11.58 7 14.07v1.43c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-1.43c0-2.49-1.36-4.6-3.14-5.62A3.49 3.49 0 0 0 15.5 5.5 3.5 3.5 0 0 0 12 2zm-6 17a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H6z" })
  }
), Or = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 512 512",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432c3.2-18.7-14.7-32.7-35.6-24.8z" })
  }
), vl = Or, Ri = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" })
  }
), zi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" })
  }
), Ei = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" })
  }
), Ni = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })
  }
), Di = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" })
  }
), ji = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.25-.562 1.25-1.25 0-.69-.562-1.25-1.25-1.25zm5.5 0c-.688 0-1.25.56-1.25 1.25 0 .688.562 1.25 1.25 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.465 4.417a.364.364 0 0 0-.046.513c.738.868 2.062 1.07 2.76 1.07.7 0 2.023-.202 2.761-1.07a.364.364 0 0 0-.047-.513.364.364 0 0 0-.512.047c-.51.6-.1.498-2.202.732-1.704 0-1.692-.132-2.202-.732a.364.364 0 0 0-.512-.047z" })
  }
), Pi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.61.03-5.23.03-7.85 0-3.33-.02-6.66-.02-9.98z" })
  }
), Hi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.269h-2.149V6.269h2.149zm-5.731 0v6.269H9.851V6.269h2.15z" })
  }
), Fi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.26 18.3 1.5 15.342 1.5 11.696c0-3.834.81-6.834 2.408-8.916C5.584.815 8.48 0 12.186 0c3.785 0 6.697.834 8.653 2.48 1.944 1.635 3.011 4.07 3.172 7.237h-3.46c-.15-2.222-.84-3.874-2.05-4.912-1.34-1.148-3.414-1.745-6.166-1.745-2.825 0-4.98.618-6.406 1.837-1.402 1.2-2.144 3.078-2.144 5.799 0 2.766.713 4.67 2.12 5.658 1.34 1.034 3.42 1.558 6.18 1.558 2.05 0 3.73-.34 5.03-1.01.69-.356 1.25-.844 1.67-1.455.45-.65.74-1.46.86-2.418H12.18V9.897h10.32c.11.83.16 1.7.16 2.6 0 3.48-.96 6.37-2.85 8.58C17.96 23.08 15.36 24 12.186 24z" })
  }
), Oi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.511.914 5.086.322 7.702.25 10.993.25 11.45c0 2.222.067 4.444.2 6.666.19 3.056 1.785 5.777 4.887 6.185 2.58.337 5.088-.04 7.42-1.111l-.16-2.217c-2.02.664-4.22.756-6.28.172-.88-.248-1.75-.724-1.92-1.684a4.42 4.42 0 0 1-.08-.916h.05c1.88.75 3.86 1.13 5.86 1.13h.1c2.81 0 5.46-.35 8.16-1.04 2.87-.73 4.49-3.27 4.67-6.23.23-3.79.16-7.14-.07-9.092zm-4.32 8.625h-2.5v-6.5c0-1.37-.58-2.07-1.73-2.07-1.27 0-1.9.82-1.9 2.45v3.52h-2.5v-3.52c0-1.63-.63-2.45-1.9-2.45-1.15 0-1.73.7-1.73 2.07v6.5H6.07v-6.7c0-1.37.35-2.46 1.05-3.26.72-.8 1.66-1.22 2.83-1.22 1.35 0 2.4.52 3.11 1.57l.63 1.06.63-1.06c.71-1.05 1.76-1.57 3.11-1.57 1.17 0 2.11.42 2.83 1.22.7.8 1.05 1.89 1.05 3.26v6.7z" })
  }
), Vi = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" })
  }
), Ui = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308a.747.747 0 0 1-1.026.248c-2.809-1.716-6.345-2.105-10.51-1.153a.75.75 0 1 1-.334-1.463c4.561-1.041 8.486-.604 11.622 1.312a.748.748 0 0 1 .248 1.056zm1.47-3.268a.936.936 0 0 1-1.288.308c-3.216-1.977-8.118-2.548-11.922-1.393a.936.936 0 1 1-.548-1.79c4.347-1.319 9.74-.683 13.45 1.597a.936.936 0 0 1 .308 1.278zm.126-3.41c-3.856-2.29-10.222-2.502-13.916-1.381a1.124 1.124 0 1 1-.652-2.152c4.25-1.29 11.28-1.042 15.728 1.594a1.124 1.124 0 0 1-1.16 1.939z" })
  }
), Yt = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" })
  }
), At = ({
  size: t = 18,
  color: e = "currentColor",
  className: n = "",
  style: i,
  ...o
}) => /* @__PURE__ */ r(
  "svg",
  {
    width: t,
    height: t,
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" })
  }
), Vr = ({ name: t, ...e }) => {
  const n = (t || "").toLowerCase().trim();
  switch (n) {
    case "facebook":
    case "facebook-f":
    case "fb":
      return /* @__PURE__ */ r(Ti, { ...e });
    case "instagram":
    case "ig":
    case "insta":
      return /* @__PURE__ */ r(Wi, { ...e });
    case "x":
    case "twitter":
    case "x-twitter":
    case "x (twitter)":
      return /* @__PURE__ */ r(Hr, { ...e });
    case "youtube":
    case "yt":
      return /* @__PURE__ */ r($i, { ...e });
    case "lichess":
      return /* @__PURE__ */ r(Bi, { ...e });
    case "chess-knight":
    case "knight":
      return /* @__PURE__ */ r(Zt, { ...e });
    case "chess-pawn":
    case "pawn":
      return /* @__PURE__ */ r(Fr, { ...e });
    case "chesscom":
    case "chess.com":
      return /* @__PURE__ */ r(Mi, { ...e });
    case "github":
    case "gh":
      return /* @__PURE__ */ r(Ri, { ...e });
    case "linkedin":
      return /* @__PURE__ */ r(zi, { ...e });
    case "discord":
      return /* @__PURE__ */ r(Ei, { ...e });
    case "telegram":
    case "tg":
      return /* @__PURE__ */ r(Ni, { ...e });
    case "whatsapp":
    case "wa":
      return /* @__PURE__ */ r(Di, { ...e });
    case "reddit":
      return /* @__PURE__ */ r(ji, { ...e });
    case "tiktok":
      return /* @__PURE__ */ r(Pi, { ...e });
    case "twitch":
      return /* @__PURE__ */ r(Hi, { ...e });
    case "threads":
      return /* @__PURE__ */ r(Fi, { ...e });
    case "mastodon":
      return /* @__PURE__ */ r(Oi, { ...e });
    case "pinterest":
      return /* @__PURE__ */ r(Vi, { ...e });
    case "spotify":
      return /* @__PURE__ */ r(Ui, { ...e });
    case "paper-plane":
    case "paperplane":
    case "send":
    case "send-message":
      return /* @__PURE__ */ r(Or, { ...e });
    case "email":
    case "mail":
    case "envelope":
      return /* @__PURE__ */ r(Yt, { ...e });
    case "globe":
    case "web":
    case "website":
      return /* @__PURE__ */ r(At, { ...e });
    default:
      return n.length > 0 ? /* @__PURE__ */ r(
        "span",
        {
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: e.size || 18,
            height: e.size || 18,
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase"
          },
          children: n[0]
        }
      ) : null;
  }
}, Gi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ r("polyline", { points: "12 19 5 12 12 5" })
] }), qi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
  /* @__PURE__ */ r("polyline", { points: "12 5 19 12 12 19" })
] }), Ki = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "19", x2: "12", y2: "5" }),
  /* @__PURE__ */ r("polyline", { points: "5 12 12 5 19 12" })
] }), Zi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
  /* @__PURE__ */ r("polyline", { points: "19 12 12 19 5 12" })
] }), Yi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) }), Ji = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "9 18 15 12 9 6" }) }), Xi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "18 15 12 9 6 15" }) }), Qi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "6 9 12 15 18 9" }) }), eo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }), Ur = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
] }), wl = Ur, to = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
] }), Gr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
] }), kl = Gr, qr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21.5 2v6h-6" }),
  /* @__PURE__ */ r("path", { d: "M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
] }), Sl = qr, ro = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "1 4 1 10 7 10" }),
  /* @__PURE__ */ r("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" })
] }), no = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "23 4 23 10 17 10" }),
  /* @__PURE__ */ r("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })
] }), io = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ r("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] }), oo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ r("polyline", { points: "17 8 12 3 7 8" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
] }), ao = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
] }), lo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
  /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
] }), so = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }), co = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "4", y1: "21", x2: "4", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "4", y1: "10", x2: "4", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "21", x2: "20", y2: "16" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "12", x2: "20", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "14", x2: "7", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "8", x2: "15", y2: "8" }),
  /* @__PURE__ */ r("line", { x1: "17", y1: "16", x2: "23", y2: "16" })
] }), po = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "5 3 19 12 5 21 5 3" }) }), go = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1" })
] }), ho = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("rect", { x: "5", y: "5", width: "14", height: "14", rx: "2" }) }), uo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "19 20 9 12 19 4 19 20" }),
  /* @__PURE__ */ r("line", { x1: "5", y1: "19", x2: "5", y2: "5", stroke: e, strokeWidth: "2.5", strokeLinecap: "round" })
] }), fo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "5 4 15 12 5 20 5 4" }),
  /* @__PURE__ */ r("line", { x1: "19", y1: "5", x2: "19", y2: "19", stroke: e, strokeWidth: "2.5", strokeLinecap: "round" })
] }), mo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "11 19 2 12 11 5 11 19" }),
  /* @__PURE__ */ r("polygon", { points: "22 19 13 12 22 5 22 19" })
] }), xo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "13 19 22 12 13 5 13 19" }),
  /* @__PURE__ */ r("polygon", { points: "2 19 11 12 2 5 2 19" })
] }), yo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }), bo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
  /* @__PURE__ */ r("polyline", { points: "9 21 3 21 3 15" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "3", x2: "14", y2: "10" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "21", x2: "10", y2: "14" })
] }), vo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "4 14 10 14 10 20" }),
  /* @__PURE__ */ r("polyline", { points: "20 10 14 10 14 4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "10", x2: "21", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "3", y2: "21" })
] }), wo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
  /* @__PURE__ */ r("polyline", { points: "9 22 9 12 15 12 15 22" })
] }), ko = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
  /* @__PURE__ */ r("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
] }), So = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
] }), Co = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" })
] }), Ao = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Io = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Lo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "3 6 5 6 21 6" }),
  /* @__PURE__ */ r("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
] }), _o = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ r("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
] }), To = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) }), Wo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, stroke: e, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }), $o = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, stroke: e, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }), Bo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("polyline", { points: "12 6 12 12 16 14" })
] }), Mo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
] }), Ro = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12", y2: "12", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12.01", y2: "8", strokeWidth: "3" })
] }), zo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "9", x2: "12", y2: "13", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
] }), Eo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
  /* @__PURE__ */ r("polyline", { points: "22 4 12 14.01 9 11.01", strokeWidth: "2.5" })
] }), No = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "9", x2: "9", y2: "15", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "9", x2: "15", y2: "15", strokeWidth: "2.5" })
] }), Do = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
] }), Kr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ r("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
] }), Cl = Kr, jo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }), Po = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
  /* @__PURE__ */ r("polyline", { points: "9 12 11 14 15 10", strokeWidth: "2.5" })
] }), Ho = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "6", y: "8", width: "12", height: "12", rx: "6" }),
  /* @__PURE__ */ r("path", { d: "M12 2v6M4 11h4M16 11h4M4 17h4M16 17h4M7 5l2.5 3M17 5l-2.5 3" })
] }), Fo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
] }), Oo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "16 18 22 12 16 6" }),
  /* @__PURE__ */ r("polyline", { points: "8 6 2 12 8 18" })
] }), Vo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
  /* @__PURE__ */ r("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
  /* @__PURE__ */ r("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
] }), Uo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "2", width: "20", height: "8", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("rect", { x: "2", y: "14", width: "20", height: "8", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "6.01", y2: "6", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "18", x2: "6.01", y2: "18", strokeWidth: "2.5" })
] }), Go = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" }) }), Zr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
  /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "6", height: "6", fill: e }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "1", x2: "9", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "1", x2: "15", y2: "4" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "20", x2: "9", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "20", x2: "15", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "9", x2: "23", y2: "9" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "15", x2: "23", y2: "15" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "9", x2: "4", y2: "9" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "15", x2: "4", y2: "15" })
] }), Al = Zr, qo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "10", rx: "2" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "5", r: "2" }),
  /* @__PURE__ */ r("path", { d: "M12 7v4" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "16", x2: "8.01", y2: "16", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "16", y1: "16", x2: "16.01", y2: "16", strokeWidth: "2.5" })
] }), Ko = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }),
  /* @__PURE__ */ r("path", { d: "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" })
] }), Zo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2" }),
  /* @__PURE__ */ r("rect", { x: "7", y: "4", width: "4", height: "8", rx: "1" })
] }), Yr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) }), Il = Yr, Jr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ll = Jr, Yo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" }) }), Jo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M2 10v4a2 2 0 0 0 2 2h4l6 4V4L8 8H4a2 2 0 0 0-2 2z" }),
  /* @__PURE__ */ r("path", { d: "M18 8a5 5 0 0 1 0 8M21 5a9 9 0 0 1 0 14" })
] }), Xo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M6 3h12v7a6 6 0 0 1-12 0V3zM9 21h6M12 16v5" }) }), Qo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "14", r: "7" }),
  /* @__PURE__ */ r("polyline", { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" })
] }), Xr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "6" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: e })
] }), _l = Xr, ea = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v4h1.5a2.5 2.5 0 0 1 0 5H2v4a2 2 0 0 0 2 2h4v-1.5a2.5 2.5 0 0 1 5 0V21h4a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" }) }), ta = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8z" }) }), Qr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }) }), Tl = Qr, ra = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6z" }) }), na = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "7", r: "4" })
] }), ia = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ r("circle", { cx: "9", cy: "7", r: "4" }),
  /* @__PURE__ */ r("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
  /* @__PURE__ */ r("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
] }), oa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "2", y1: "22", x2: "22", y2: "22" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "2", x2: "2", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "2", x2: "22", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "2", y1: "7", x2: "22", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "5", y1: "10", x2: "5", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "10", x2: "9", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "10", x2: "15", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "19", y1: "10", x2: "19", y2: "18" })
] }), aa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("polygon", { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76", fill: e })
] }), la = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M11 17l-5-5a2.828 2.828 0 1 1 4-4l1 1 1-1a2.828 2.828 0 1 1 4 4l-5 5z" }),
  /* @__PURE__ */ r("path", { d: "M12 11l4 4 5-5M2 13l4-4" })
] }), sa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" }) }), Wl = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "7", width: "20", height: "15", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("polyline", { points: "17 2 12 7 7 2" })
] }), Jt = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }),
  /* @__PURE__ */ r("path", { d: "M6 12v5c3 3 9 3 12 0v-5" })
] }), $l = Jt, Bl = Jt, en = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "6", width: "20", height: "12", rx: "6" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "10", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "10", x2: "8", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "13", x2: "15.01", y2: "13", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "11", x2: "18.01", y2: "11", strokeWidth: "2.5" })
] }), Ml = en, tn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M9.5 2A4.5 4.5 0 0 0 5 6.5c0 .3.03.6.09.89A4.5 4.5 0 0 0 3 11a4.5 4.5 0 0 0 2.5 4 4.5 4.5 0 0 0 4 4.5V2zm5 0A4.5 4.5 0 0 1 19 6.5c0 .3-.03.6-.09.89A4.5 4.5 0 0 1 21 11a4.5 4.5 0 0 1-2.5 4 4.5 4.5 0 0 1-4 4.5V2z" }),
  /* @__PURE__ */ r("path", { d: "M9.5 12h5" })
] }), Rl = tn, rn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M8 2h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 0-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2z" }),
  /* @__PURE__ */ r("path", { d: "M4 18a2 2 0 0 0 2 2h13" }),
  /* @__PURE__ */ r("path", { d: "M8 7h8M8 11h6" })
] }), zl = rn, El = At, Nl = At, ca = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" })
] }), da = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
] }), pa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z", fill: e, fillOpacity: "0.2" }),
  /* @__PURE__ */ r("path", { d: "M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z" }),
  /* @__PURE__ */ r("rect", { x: "4", y: "18", width: "16", height: "3", rx: "1", fill: e })
] }), nn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }) }), Dl = nn, on = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M3 3v18h18" }),
  /* @__PURE__ */ r("polyline", { points: "19 9 14 14 10 10 7 13" })
] }), jl = on, ga = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
  /* @__PURE__ */ r("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" })
] }), an = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "10", r: "3" })
] }), Pl = an, Hl = Yt, ln = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "3.01", y2: "6", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "3.01", y2: "12", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "3.01", y2: "18", strokeWidth: "2.5" })
] }), Fl = ln, ha = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ r("polyline", { points: "12 7 12 12 15 15" })
] }), ua = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4" }) }), fa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "9", y: "2", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "2", y: "18", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "16", y: "18", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("path", { d: "M12 6v6m0 0H5v6m7-6h7v6" })
] }), sn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "3", x2: "12", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "4", y1: "7", x2: "20", y2: "7" }),
  /* @__PURE__ */ r("path", { d: "M4 7l-2 7a3 3 0 0 0 6 0L6 7zm14 0l-2 7a3 3 0 0 0 6 0L20 7z" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "21", x2: "16", y2: "21" })
] }), Ol = sn, cn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "9", cy: "11", r: "1.5", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "15", cy: "11", r: "1.5", fill: e }),
  /* @__PURE__ */ r("path", { d: "M12 2a8 8 0 0 0-8 8c0 3 1.5 5 2.5 6.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2.5c1-1.5 2.5-3.5 2.5-6.5a8 8 0 0 0-8-8z" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "18", x2: "10", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "18", x2: "14", y2: "21" })
] }), Vl = cn, ma = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
  /* @__PURE__ */ r("path", { d: "M12 2v3M10 2h4M19 6l-1.5 1.5" })
] }), xa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5" }) }), ya = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "8", x2: "6.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "8", x2: "10.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "8", x2: "14.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "8", x2: "18.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "6.01", y2: "12", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "12", x2: "18.01", y2: "12", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "16", x2: "15", y2: "16" })
] }), dn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
  /* @__PURE__ */ r("polyline", { points: "2 12 12 17 22 12" }),
  /* @__PURE__ */ r("polyline", { points: "2 17 12 22 22 17" })
] }), Ul = dn, ba = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "13.5", cy: "6.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "17.5", cy: "10.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "8.5", cy: "7.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "6.5", cy: "12.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.24-.28-.39-.63-.39-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z" })
] }), va = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "22", y1: "12", x2: "18", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "2", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "6", x2: "12", y2: "2" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "22", x2: "12", y2: "18" })
] }), pn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "6", cy: "6", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "18", r: "3" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
  /* @__PURE__ */ r("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
  /* @__PURE__ */ r("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
] }), Gl = pn, gn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "6", y1: "3", x2: "6", y2: "15" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "6", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "18", r: "3" }),
  /* @__PURE__ */ r("path", { d: "M18 9a9 9 0 0 1-9 9" })
] }), ql = gn, hn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "18", cy: "5", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "12", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "19", r: "3" }),
  /* @__PURE__ */ r("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
  /* @__PURE__ */ r("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
] }), Kl = hn, un = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" }) }), Zl = un, wa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 512 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M501.97 187.35l-71.09 177.72c-2.45 6.13-7.51 10.74-13.8 12.59l-42.92 12.63c-3.15.93-6.49.52-9.33-1.15l-108.83-64-108.83 64c-2.84 1.67-6.18 2.08-9.33 1.15l-42.92-12.63c-6.29-1.85-11.35-6.46-13.8-12.59L10.03 187.35C4.25 172.9 14.86 157.5 30.41 157.5c6.51 0 12.82 2.76 17.26 7.56l72.97 78.85 41.56-173.18C165.26 56.44 178.69 48 193.28 48h125.44c14.59 0 28.02 8.44 31.08 22.73l41.56 173.18 72.97-78.85c4.44-4.8 10.75-7.56 17.26-7.56 15.55 0 26.16 15.4 20.38 29.85zM448 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h384c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), ka = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 448 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M384 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm48-272h-40.42c-1.35-25.13-13.43-47.53-31.95-63.02L382.72 48H320V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32h-64V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32H65.28l23.09 48.98C69.85 112.47 57.77 134.87 56.42 160H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h34.61c16.29 88.58 87.27 160 173.39 160s157.1-71.42 173.39-160H432c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), Sa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 384 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M384 128V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32h-64V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32H96V48c0-8.84-7.16-16-16-16H32c-8.84 0-16 7.16-16 16v80c0 14.59 9.87 27.08 24 30.65v146.7c-14.13 3.57-24 16.06-24 30.65 0 17.67 14.33 32 32 32h288c17.67 0 32-14.33 32-32 0-14.59-9.87-27.08-24-30.65V158.65c14.13-3.57 24-16.06 24-30.65zM352 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), Ca = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 320 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M160 0c-44.18 0-80 35.82-80 80 0 16.27 4.95 31.33 13.31 44.07C64.95 145.45 48 181.76 48 224c0 38.64 14.19 72.44 37.66 96H48c-26.51 0-48 21.49-48 48v16h320v-16c0-26.51-21.49-48-48-48h-37.66C257.81 296.44 272 262.64 272 224c0-42.24-16.95-78.55-45.31-99.93C235.05 111.33 240 96.27 240 80c0-44.18-35.82-80-80-80zm128 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h256c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), Aa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ d("svg", { width: t, height: t, viewBox: "0 0 24 24", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", stroke: e, strokeWidth: "2", fill: "none" }),
  /* @__PURE__ */ r("rect", { x: "3", y: "3", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "12", y: "3", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "7.5", y: "7.5", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "16.5", y: "7.5", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "3", y: "12", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "12", y: "12", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "7.5", y: "16.5", width: "4.5", height: "4.5", fill: e }),
  /* @__PURE__ */ r("rect", { x: "16.5", y: "16.5", width: "4.5", height: "4.5", fill: e })
] }), Yl = ({ name: t, ...e }) => {
  const n = (t || "").toLowerCase().trim().replace(/^fa[srbld]?\s+fa-/, "").replace(/^fa-/, "").replace(/\s+/g, "-");
  switch (n) {
    case "arrow-left":
    case "long-arrow-left":
    case "arrowleft":
      return /* @__PURE__ */ r(Gi, { ...e });
    case "arrow-right":
    case "long-arrow-right":
    case "arrowright":
      return /* @__PURE__ */ r(qi, { ...e });
    case "arrow-up":
    case "arrowup":
      return /* @__PURE__ */ r(Ki, { ...e });
    case "arrow-down":
    case "arrowdown":
      return /* @__PURE__ */ r(Zi, { ...e });
    case "chevron-left":
    case "angle-left":
      return /* @__PURE__ */ r(Yi, { ...e });
    case "chevron-right":
    case "angle-right":
      return /* @__PURE__ */ r(Ji, { ...e });
    case "chevron-up":
    case "angle-up":
      return /* @__PURE__ */ r(Xi, { ...e });
    case "chevron-down":
    case "angle-down":
      return /* @__PURE__ */ r(Qi, { ...e });
    case "check":
      return /* @__PURE__ */ r(eo, { ...e });
    case "close":
    case "times":
      return /* @__PURE__ */ r(Ur, { ...e });
    case "search":
      return /* @__PURE__ */ r(to, { ...e });
    case "menu":
    case "bars":
      return /* @__PURE__ */ r(Gr, { ...e });
    case "refresh":
    case "sync":
    case "sync-alt":
    case "redo-alt":
      return /* @__PURE__ */ r(qr, { ...e });
    case "undo":
      return /* @__PURE__ */ r(ro, { ...e });
    case "redo":
      return /* @__PURE__ */ r(no, { ...e });
    case "download":
      return /* @__PURE__ */ r(io, { ...e });
    case "upload":
      return /* @__PURE__ */ r(oo, { ...e });
    case "copy":
      return /* @__PURE__ */ r(ao, { ...e });
    case "external-link":
    case "external-link-alt":
      return /* @__PURE__ */ r(lo, { ...e });
    case "filter":
      return /* @__PURE__ */ r(so, { ...e });
    case "sliders":
    case "sliders-h":
      return /* @__PURE__ */ r(co, { ...e });
    case "play":
      return /* @__PURE__ */ r(po, { ...e });
    case "pause":
      return /* @__PURE__ */ r(go, { ...e });
    case "stop":
      return /* @__PURE__ */ r(ho, { ...e });
    case "step-backward":
      return /* @__PURE__ */ r(uo, { ...e });
    case "step-forward":
      return /* @__PURE__ */ r(fo, { ...e });
    case "fast-backward":
      return /* @__PURE__ */ r(mo, { ...e });
    case "fast-forward":
      return /* @__PURE__ */ r(xo, { ...e });
    case "spinner":
      return /* @__PURE__ */ r(yo, { ...e });
    case "expand":
      return /* @__PURE__ */ r(bo, { ...e });
    case "compress":
      return /* @__PURE__ */ r(vo, { ...e });
    case "home":
      return /* @__PURE__ */ r(wo, { ...e });
    case "bell":
      return /* @__PURE__ */ r(ko, { ...e });
    case "lock":
      return /* @__PURE__ */ r(So, { ...e });
    case "unlock":
    case "unlock-alt":
      return /* @__PURE__ */ r(Co, { ...e });
    case "sun":
      return /* @__PURE__ */ r(Ao, { ...e });
    case "moon":
      return /* @__PURE__ */ r(Io, { ...e });
    case "trash":
      return /* @__PURE__ */ r(Lo, { ...e });
    case "edit":
      return /* @__PURE__ */ r(_o, { ...e });
    case "bookmark":
      return /* @__PURE__ */ r(To, { ...e });
    case "star":
      return /* @__PURE__ */ r(Wo, { ...e });
    case "heart":
      return /* @__PURE__ */ r($o, { ...e });
    case "clock":
      return /* @__PURE__ */ r(Bo, { ...e });
    case "calendar":
    case "calendar-alt":
    case "calendar-day":
    case "calendar-check":
      return /* @__PURE__ */ r(Mo, { ...e });
    case "info":
    case "info-circle":
      return /* @__PURE__ */ r(Ro, { ...e });
    case "warning":
    case "exclamation-triangle":
      return /* @__PURE__ */ r(zo, { ...e });
    case "check-circle":
      return /* @__PURE__ */ r(Eo, { ...e });
    case "times-circle":
      return /* @__PURE__ */ r(No, { ...e });
    case "question":
    case "question-circle":
      return /* @__PURE__ */ r(Do, { ...e });
    case "cog":
    case "cogs":
    case "settings":
      return /* @__PURE__ */ r(Kr, { ...e });
    case "shield":
    case "shield-alt":
    case "user-shield":
      return /* @__PURE__ */ r(jo, { ...e });
    case "shield-check":
      return /* @__PURE__ */ r(Po, { ...e });
    case "bug":
    case "virus":
      return /* @__PURE__ */ r(Ho, { ...e });
    case "desktop":
    case "tv":
      return /* @__PURE__ */ r(Fo, { ...e });
    case "code":
    case "laptop-code":
    case "terminal":
      return /* @__PURE__ */ r(Oo, { ...e });
    case "database":
      return /* @__PURE__ */ r(Vo, { ...e });
    case "server":
      return /* @__PURE__ */ r(Uo, { ...e });
    case "cloud":
      return /* @__PURE__ */ r(Go, { ...e });
    case "cpu":
    case "microchip":
      return /* @__PURE__ */ r(Zr, { ...e });
    case "robot":
      return /* @__PURE__ */ r(qo, { ...e });
    case "rocket":
      return /* @__PURE__ */ r(Ko, { ...e });
    case "microscope":
    case "vial":
      return /* @__PURE__ */ r(Zo, { ...e });
    case "wrench":
    case "tools":
      return /* @__PURE__ */ r(Yr, { ...e });
    case "bolt":
    case "zap":
    case "lightning":
      return /* @__PURE__ */ r(Jr, { ...e });
    case "sparkles":
    case "magic":
      return /* @__PURE__ */ r(Yo, { ...e });
    case "bullhorn":
      return /* @__PURE__ */ r(Jo, { ...e });
    case "trophy":
      return /* @__PURE__ */ r(Xo, { ...e });
    case "medal":
      return /* @__PURE__ */ r(Qo, { ...e });
    case "target":
    case "bullseye":
      return /* @__PURE__ */ r(Xr, { ...e });
    case "puzzle":
    case "puzzle-piece":
      return /* @__PURE__ */ r(ea, { ...e });
    case "quote":
    case "quote-left":
    case "quote-right":
      return /* @__PURE__ */ r(ta, { ...e });
    case "book":
    case "book-open":
      return /* @__PURE__ */ r(Qr, { ...e });
    case "newspaper":
    case "blog":
      return /* @__PURE__ */ r(ra, { ...e });
    case "user":
      return /* @__PURE__ */ r(na, { ...e });
    case "users":
    case "user-friends":
      return /* @__PURE__ */ r(ia, { ...e });
    case "landmark":
      return /* @__PURE__ */ r(oa, { ...e });
    case "compass":
      return /* @__PURE__ */ r(aa, { ...e });
    case "handshake":
    case "hands-helping":
      return /* @__PURE__ */ r(la, { ...e });
    case "flag":
    case "flag-checkered":
      return /* @__PURE__ */ r(sa, { ...e });
    case "graduation-cap":
    case "academic-cap":
    case "learn":
    case "chalkboard-teacher":
      return /* @__PURE__ */ r(Jt, { ...e });
    case "gamepad":
    case "controller":
      return /* @__PURE__ */ r(en, { ...e });
    case "brain":
    case "train":
      return /* @__PURE__ */ r(tn, { ...e });
    case "scroll":
    case "parchment":
      return /* @__PURE__ */ r(rn, { ...e });
    case "globe":
    case "globe-asia":
    case "world":
    case "online":
      return /* @__PURE__ */ r(At, { ...e });
    case "eye":
    case "watch":
    case "view":
      return /* @__PURE__ */ r(ca, { ...e });
    case "eye-slash":
      return /* @__PURE__ */ r(da, { ...e });
    case "crown":
      return /* @__PURE__ */ r(pa, { ...e });
    case "fire":
    case "flame":
    case "hot":
      return /* @__PURE__ */ r(nn, { ...e });
    case "chart-line":
    case "graph":
    case "analytics":
      return /* @__PURE__ */ r(on, { ...e });
    case "clipboard":
    case "clipboard-check":
      return /* @__PURE__ */ r(ga, { ...e });
    case "map-marker":
    case "map-marker-alt":
    case "pin":
      return /* @__PURE__ */ r(an, { ...e });
    case "envelope":
    case "mail":
    case "email":
      return /* @__PURE__ */ r(Yt, { ...e });
    case "list":
    case "list-alt":
    case "list-ol":
    case "list-ul":
      return /* @__PURE__ */ r(ln, { ...e });
    case "history":
      return /* @__PURE__ */ r(ha, { ...e });
    case "signal":
    case "wifi":
      return /* @__PURE__ */ r(ua, { ...e });
    case "network-wired":
      return /* @__PURE__ */ r(fa, { ...e });
    case "balance-scale":
    case "scale":
    case "justice":
      return /* @__PURE__ */ r(sn, { ...e });
    case "skull":
    case "skull-crossbones":
      return /* @__PURE__ */ r(cn, { ...e });
    case "stopwatch":
      return /* @__PURE__ */ r(ma, { ...e });
    case "lightbulb":
      return /* @__PURE__ */ r(xa, { ...e });
    case "keyboard":
      return /* @__PURE__ */ r(ya, { ...e });
    case "layer-group":
    case "layers":
      return /* @__PURE__ */ r(dn, { ...e });
    case "palette":
      return /* @__PURE__ */ r(ba, { ...e });
    case "crosshairs":
      return /* @__PURE__ */ r(va, { ...e });
    case "cut":
    case "scissors":
      return /* @__PURE__ */ r(pn, { ...e });
    case "code-branch":
    case "fork":
      return /* @__PURE__ */ r(gn, { ...e });
    case "share":
    case "share-alt":
      return /* @__PURE__ */ r(hn, { ...e });
    case "door-open":
    case "sign-out-alt":
    case "logout":
      return /* @__PURE__ */ r(un, { ...e });
    case "chess":
    case "chess-board":
      return /* @__PURE__ */ r(Aa, { ...e });
    case "chess-queen":
    case "queen":
      return /* @__PURE__ */ r(wa, { ...e });
    case "chess-king":
    case "king":
      return /* @__PURE__ */ r(ka, { ...e });
    case "chess-knight":
    case "knight":
      return /* @__PURE__ */ r(Zt, { ...e });
    case "chess-pawn":
    case "pawn":
      return /* @__PURE__ */ r(Fr, { ...e });
    case "chess-rook":
    case "rook":
      return /* @__PURE__ */ r(Sa, { ...e });
    case "chess-bishop":
    case "bishop":
      return /* @__PURE__ */ r(Ca, { ...e });
    default:
      return /* @__PURE__ */ r(Vr, { name: n, ...e });
  }
}, Jl = ({
  preset: t = "generic",
  brandLogo: e,
  logoComponent: n,
  logoSize: i,
  logoTheme: o,
  brandTitle: a,
  brandSubtitle: l,
  brandUrl: s = "index.html",
  navLinks: p,
  githubUrl: c,
  currentPath: g = "index.html",
  showForkRibbon: u = !1,
  forkRibbonUrl: h,
  forkRibbonText: m = "FORK ME",
  forkRibbonPosition: f = "right",
  showNotificationBell: y = !0,
  notificationFetchUrl: k,
  notificationStorageKey: v = "notifications_seen_updates",
  showThemeToggle: x = !0,
  showCacheBuster: b = !0,
  quickAction: w,
  customControls: I,
  containerMaxWidth: T = "var(--eg-container-max, min(1536px, 94%))",
  containerPadding: C = "0 clamp(16px, 2.5vw, 32px)",
  onNavigate: M,
  className: W = "",
  style: P = {}
}) => {
  const [R, E] = _(!1), [j, z] = _(null), O = xe(null);
  Y(() => {
    const A = (D) => {
      O.current && !O.current.contains(D.target) && z(null);
    };
    return document.addEventListener("mousedown", A), () => document.removeEventListener("mousedown", A);
  }, []);
  const $ = [
    { label: "HOME", href: "index.html" }
  ], L = p && p.length > 0 ? p : $, S = (A, D, V) => {
    if (!(V || D.startsWith("http://") || D.startsWith("https://"))) {
      if (D === "#" || D === "javascript:void(0);") {
        A.preventDefault();
        return;
      }
      M && (A.preventDefault(), M(D), E(!1), z(null));
    }
  }, N = (A) => {
    if (A.active) return !0;
    const D = g.replace(/^\/+/, "").split("?")[0].split("#")[0].toLowerCase().replace(/\.html$/, "") || "index", V = A.href.replace(/^\/+/, "").split("?")[0].split("#")[0].toLowerCase().replace(/\.html$/, "");
    return D === V || (V === "index" || V === "") && (D === "" || D === "index") ? !0 : A.children ? A.children.some((B) => N(B)) : !1;
  };
  return /* @__PURE__ */ d(
    "header",
    {
      className: `eg-header ${W}`,
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
        position: "sticky",
        top: 0,
        zIndex: 900,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "background var(--eg-transition-normal, 220ms)",
        ...P
      },
      children: [
        u && h && /* @__PURE__ */ r(
          "div",
          {
            className: "github-fork-ribbon-wrapper",
            style: {
              position: "absolute",
              top: 0,
              ...f === "right" ? { right: 0 } : { left: 0 },
              width: "115px",
              height: "115px",
              overflow: "hidden",
              zIndex: 10005,
              pointerEvents: "none"
            },
            children: /* @__PURE__ */ d(
              "a",
              {
                href: h,
                target: "_blank",
                rel: "noopener noreferrer",
                title: "Fork me on GitHub",
                "aria-label": "Fork me on GitHub",
                className: "github-fork-ribbon",
                style: {
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  width: "155px",
                  top: "24px",
                  ...f === "right" ? { right: "-38px", transform: "rotate(45deg)" } : { left: "-38px", transform: "rotate(-45deg)" },
                  background: "linear-gradient(135deg, #24292e 0%, #161b22 100%)",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "6px 0",
                  fontSize: "11px",
                  fontWeight: 800,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.45)",
                  border: "1px dashed rgba(255, 255, 255, 0.4)",
                  borderLeft: "none",
                  borderRight: "none",
                  pointerEvents: "auto",
                  letterSpacing: "0.8px",
                  lineHeight: 1,
                  transition: "all 0.25s ease"
                },
                onMouseEnter: (A) => {
                  A.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)", A.currentTarget.style.color = "#ffffff", A.currentTarget.style.boxShadow = "0 6px 18px rgba(16, 185, 129, 0.5)";
                },
                onMouseLeave: (A) => {
                  A.currentTarget.style.background = "linear-gradient(135deg, #24292e 0%, #161b22 100%)", A.currentTarget.style.color = "#ffffff", A.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.45)";
                },
                children: [
                  /* @__PURE__ */ r("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ r("path", { d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" }) }),
                  m !== "" && /* @__PURE__ */ r("span", { children: m || "FORK ME" })
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ r(
          "div",
          {
            className: "eg-header-container",
            style: {
              maxWidth: T,
              margin: "0 auto",
              padding: C
            },
            children: /* @__PURE__ */ d(
              "div",
              {
                className: "eg-header-inner",
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: "74px",
                  padding: "4px 0",
                  gap: "28px"
                },
                children: [
                  /* @__PURE__ */ r(
                    "div",
                    {
                      className: "eg-header-left-brand",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexShrink: 0,
                        marginRight: "20px",
                        marginLeft: u && f === "left" ? "48px" : "0"
                      },
                      children: /* @__PURE__ */ r(
                        "a",
                        {
                          href: s,
                          onClick: (A) => S(A, s),
                          style: { textDecoration: "none", display: "flex", alignItems: "center" },
                          title: a || "Home",
                          children: e || n ? e || n : a ? /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column" }, children: [
                            /* @__PURE__ */ r(
                              "span",
                              {
                                style: {
                                  fontWeight: 800,
                                  fontSize: "20px",
                                  letterSpacing: "-0.3px",
                                  color: "var(--eg-text-primary, #0f172a)"
                                },
                                children: a
                              }
                            ),
                            l && /* @__PURE__ */ r(
                              "span",
                              {
                                style: {
                                  fontSize: "11px",
                                  color: "var(--eg-text-muted, #94a3b8)",
                                  fontWeight: 500
                                },
                                children: l
                              }
                            )
                          ] }) : /* @__PURE__ */ r(Pr, { size: i || 56, theme: o || "auto", mainText: "APP" })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ r(
                    "nav",
                    {
                      ref: O,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                      },
                      className: "eg-desktop-nav",
                      children: L.map((A) => {
                        const D = N(A), V = A.children && A.children.length > 0, B = j === A.label;
                        return V ? /* @__PURE__ */ d("div", { style: { position: "relative" }, children: [
                          /* @__PURE__ */ d(
                            "button",
                            {
                              type: "button",
                              onClick: () => z(B ? null : A.label),
                              style: {
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "transparent",
                                border: "none",
                                color: D ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #475569)",
                                fontWeight: D ? 700 : 600,
                                fontSize: "13.5px",
                                padding: "8px 6px",
                                cursor: "pointer",
                                borderBottom: D ? "2px solid var(--eg-color-primary, #10b981)" : "2px solid transparent",
                                letterSpacing: "0.5px"
                              },
                              children: [
                                A.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: A.icon }),
                                /* @__PURE__ */ r("span", { children: A.label }),
                                /* @__PURE__ */ r("span", { style: { fontSize: "10px", transform: B ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }, children: "▼" })
                              ]
                            }
                          ),
                          B && /* @__PURE__ */ r(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                minWidth: "190px",
                                background: "var(--eg-bg-surface-elevated, #ffffff)",
                                border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
                                borderRadius: "8px",
                                boxShadow: "var(--eg-shadow-lg, 0 12px 30px rgba(0, 0, 0, 0.15))",
                                padding: "6px",
                                zIndex: 1e3,
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px"
                              },
                              children: A.children.map((H) => {
                                const U = N(H);
                                return /* @__PURE__ */ d(
                                  "a",
                                  {
                                    href: ne(H.href),
                                    target: H.external ? "_blank" : void 0,
                                    rel: H.external ? "noopener noreferrer" : void 0,
                                    onClick: (G) => S(G, H.href, H.external),
                                    style: {
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      textDecoration: "none",
                                      fontSize: "13px",
                                      fontWeight: U ? 700 : 500,
                                      color: U ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #0f172a)",
                                      background: U ? "rgba(16, 185, 129, 0.12)" : "transparent",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: "8px",
                                      transition: "all 0.15s ease"
                                    },
                                    onMouseEnter: (G) => {
                                      U || (G.currentTarget.style.background = "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))");
                                    },
                                    onMouseLeave: (G) => {
                                      U || (G.currentTarget.style.background = "transparent");
                                    },
                                    children: [
                                      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                                        H.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: H.icon }),
                                        /* @__PURE__ */ r("span", { children: H.label })
                                      ] }),
                                      H.external && /* @__PURE__ */ r("span", { style: { fontSize: "11px", opacity: 0.7 }, children: "↗" })
                                    ]
                                  },
                                  H.label
                                );
                              })
                            }
                          )
                        ] }, A.label) : /* @__PURE__ */ d(
                          "a",
                          {
                            href: ne(A.href),
                            target: A.external ? "_blank" : void 0,
                            rel: A.external ? "noopener noreferrer" : void 0,
                            onClick: (H) => S(H, A.href, A.external),
                            style: A.highlight ? {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              color: "#ffffff",
                              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                              textDecoration: "none",
                              fontWeight: 800,
                              fontSize: "13px",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.35)",
                              borderBottom: "none",
                              transition: "all 0.15s ease",
                              letterSpacing: "0.4px"
                            } : {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              color: D ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #475569)",
                              textDecoration: "none",
                              fontWeight: D ? 700 : 600,
                              fontSize: "13.5px",
                              padding: "8px 6px",
                              borderBottom: D ? "2px solid var(--eg-color-primary, #10b981)" : "2px solid transparent",
                              transition: "all 0.15s ease",
                              letterSpacing: "0.5px"
                            },
                            children: [
                              A.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: A.icon }),
                              /* @__PURE__ */ r("span", { children: A.label })
                            ]
                          },
                          A.href
                        );
                      })
                    }
                  ),
                  /* @__PURE__ */ d(
                    "div",
                    {
                      className: "eg-header-right-controls",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexShrink: 0,
                        marginLeft: "20px",
                        marginRight: u && f === "right" ? "48px" : "0"
                      },
                      children: [
                        y && /* @__PURE__ */ r(
                          Mn,
                          {
                            onNavigate: M,
                            fetchUrl: k,
                            storageKey: v
                          }
                        ),
                        w,
                        c && /* @__PURE__ */ r(
                          "a",
                          {
                            href: c,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            title: "Explore on GitHub",
                            "aria-label": "Explore on GitHub",
                            className: "eg-header-control-desktop-only",
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "7px 9px",
                              background: "transparent",
                              border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))",
                              borderRadius: "var(--eg-radius-md, 8px)",
                              color: "var(--eg-text-primary, inherit)",
                              textDecoration: "none",
                              transition: "all 0.15s ease"
                            },
                            children: /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 16 16", fill: "currentColor", children: /* @__PURE__ */ r("path", { d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" }) })
                          }
                        ),
                        x && /* @__PURE__ */ r(Lr, {}),
                        b && /* @__PURE__ */ r("span", { className: "eg-header-control-desktop-only", children: /* @__PURE__ */ r(ar, {}) }),
                        I,
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => E(!R),
                            className: "eg-mobile-toggle",
                            "aria-label": "Toggle navigation menu",
                            "aria-expanded": R,
                            style: {
                              display: "none",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px",
                              background: "transparent",
                              border: "1px solid var(--eg-border-default, rgba(0,0,0,0.15))",
                              borderRadius: "8px",
                              cursor: "pointer",
                              color: "var(--eg-text-primary, inherit)"
                            },
                            children: /* @__PURE__ */ r("span", { style: { fontSize: "18px" }, children: R ? "✕" : "☰" })
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ r("style", { children: `
        @media (max-width: 860px) {
          .eg-desktop-nav {
            display: none !important;
          }
          .eg-mobile-toggle {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .github-fork-ribbon-wrapper {
            display: none !important;
          }
          .eg-header-container {
            padding: 0 12px !important;
          }
          .eg-header-inner {
            min-height: 64px !important;
            padding: 4px 0 !important;
            gap: 8px !important;
          }
          .eg-header-left-brand {
            margin-left: 0 !important;
            margin-right: 0 !important;
            gap: 8px !important;
            flex-shrink: 1 !important;
            min-width: 0 !important;
          }
          .eg-header-right-controls {
            margin-left: auto !important;
            margin-right: 0 !important;
            gap: 6px !important;
            flex-shrink: 0 !important;
          }
          .eg-header-control-desktop-only {
            display: none !important;
          }
          .eg-mobile-toggle {
            display: inline-flex !important;
            padding: 6px 8px !important;
            min-width: 34px !important;
            height: 34px !important;
          }
          .eg-logo-badge {
            width: 44px !important;
            height: 44px !important;
          }
          .eg-logo-main-text {
            font-size: 18px !important;
          }
          .eg-logo-domain-text {
            font-size: 7.5px !important;
          }
          .eg-logo-byline {
            display: none !important;
          }
        }
        @media (max-width: 400px) {
          .eg-header-container {
            padding: 0 6px !important;
          }
          .eg-header-inner {
            gap: 4px !important;
          }
          .eg-header-right-controls {
            gap: 4px !important;
          }
          .eg-mobile-toggle {
            padding: 5px 6px !important;
            min-width: 30px !important;
            height: 30px !important;
          }
        }
      ` }),
        R && /* @__PURE__ */ d(
          "div",
          {
            className: "eg-header-mobile-drawer",
            style: {
              borderTop: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))",
              background: "var(--eg-bg-surface-elevated, var(--eg-bg-surface, #1e293b))",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            },
            children: [
              L.map((A) => {
                const D = N(A);
                return A.children && A.children.length > 0 ? /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                  /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--eg-text-muted, #94a3b8)", padding: "6px 0" }, children: [
                    A.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: A.icon }),
                    /* @__PURE__ */ r("span", { children: A.label })
                  ] }),
                  A.children.map((B) => /* @__PURE__ */ d(
                    "a",
                    {
                      href: ne(B.href),
                      onClick: (H) => S(H, B.href, B.external),
                      style: {
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: N(B) ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #0f172a)",
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      },
                      children: [
                        B.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: B.icon }),
                        /* @__PURE__ */ r("span", { children: B.label })
                      ]
                    },
                    B.label
                  ))
                ] }, A.label) : /* @__PURE__ */ d(
                  "a",
                  {
                    href: ne(A.href),
                    onClick: (B) => S(B, A.href, A.external),
                    style: A.highlight ? {
                      padding: "10px 14px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.35)"
                    } : {
                      padding: "10px 12px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      color: D ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #0f172a)",
                      background: D ? "rgba(16, 185, 129, 0.12)" : "transparent",
                      fontWeight: 600,
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    },
                    children: [
                      A.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: A.icon }),
                      /* @__PURE__ */ r("span", { children: A.label })
                    ]
                  },
                  A.href
                );
              }),
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))",
                    marginTop: "6px"
                  },
                  children: [
                    b && /* @__PURE__ */ r(ar, {}),
                    c && /* @__PURE__ */ d(
                      "a",
                      {
                        href: ne(c),
                        target: "_blank",
                        rel: "noopener noreferrer",
                        style: {
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "13px",
                          color: "var(--eg-text-secondary, #64748b)",
                          textDecoration: "none",
                          fontWeight: 600
                        },
                        children: [
                          /* @__PURE__ */ r("span", { children: "GitHub Repository" }),
                          /* @__PURE__ */ r("span", { children: "↗" })
                        ]
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}, Xl = ({
  preset: t = "generic",
  brandLogo: e,
  logoComponent: n,
  logoSize: i = 96,
  logoTheme: o = "dark",
  brandTitle: a,
  brandSubtitle: l,
  aboutText: s,
  aboutReadMoreUrl: p = "about",
  socialLinks: c,
  socialAlignment: g = "left",
  contactAlignment: u = "left",
  followLabel: h = "Follow",
  contactLabel: m = "Contact",
  contactButtonText: f = "Send Message",
  contactUrl: y = "contact",
  sections: k,
  copyrightText: v,
  privacyPolicyUrl: x = "privacypolicy",
  developedByText: b,
  developedByUrl: w,
  developedByPrefix: I,
  showBackToTop: T = !1,
  containerMaxWidth: C = "var(--eg-container-max, min(1536px, 94%))",
  containerPadding: M = "0 clamp(16px, 2.5vw, 32px)",
  onNavigate: W,
  className: P = "",
  style: R = {}
}) => {
  const [E, j] = _(s || "");
  Y(() => {
    if (s) return;
    let L = !0;
    return we.getPageContent("about").then((S) => {
      if (!L || !S) return;
      const N = (D) => {
        if (!D) return "";
        try {
          if (typeof document < "u") {
            const V = document.createElement("div");
            return V.innerHTML = D, V.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((H) => H.remove()), (V.textContent || V.innerText || "").replace(/\s+/g, " ").replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, "").trim();
          }
        } catch {
        }
        return D.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "").replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, "").trim();
      };
      let A = N(S.title || "");
      if (!A && S.content && (A = N(S.content)), A) {
        let D = A;
        if (A.length > 135) {
          const V = A.slice(0, 135), B = V.lastIndexOf(" ");
          D = (B > 0 ? V.slice(0, B) : V).trim() + "...";
        }
        j(D);
      }
    }), () => {
      L = !1;
    };
  }, [s, t]);
  const z = (L, S, N) => {
    N || S.startsWith("http://") || S.startsWith("https://") || W && (L.preventDefault(), W(S));
  }, O = k || [], $ = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ d(
    "footer",
    {
      className: `eg-footer ${P}`,
      style: {
        background: "var(--eg-bg-footer, #1e2229)",
        color: "var(--eg-text-footer, #cbd5e1)",
        borderTop: "1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.08))",
        padding: "52px 20px 24px",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        ...R
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              maxWidth: C,
              margin: "0 auto",
              padding: M
            },
            children: [
              /* @__PURE__ */ d(
                "div",
                {
                  className: "eg-footer-grid",
                  style: {
                    gap: "40px",
                    marginBottom: "40px"
                  },
                  children: [
                    /* @__PURE__ */ d("div", { className: "eg-footer-col eg-footer-col-about", children: [
                      /* @__PURE__ */ r("div", { style: { marginBottom: "14px" }, children: e || n ? e || n : a ? /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column" }, children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "20px", fontWeight: 800, color: "var(--eg-text-footer-title, #ffffff)" }, children: a }),
                        l && /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "var(--eg-text-footer-muted, #94a3b8)" }, children: l })
                      ] }) : /* @__PURE__ */ r(Pr, { size: i, theme: o || "dark", mainText: "APP" }) }),
                      /* @__PURE__ */ d(
                        "p",
                        {
                          style: {
                            fontSize: "13.5px",
                            lineHeight: 1.6,
                            color: "var(--eg-text-footer-muted, #94a3b8)",
                            margin: "0 0 10px",
                            textAlign: "left",
                            textJustify: "inter-word"
                          },
                          children: [
                            /* @__PURE__ */ r("span", { children: E }),
                            p && /* @__PURE__ */ d(ce, { children: [
                              " ",
                              /* @__PURE__ */ r(
                                "a",
                                {
                                  href: p,
                                  onClick: (L) => z(L, p),
                                  className: "footer-readmore-link",
                                  style: {
                                    fontSize: "13px",
                                    fontWeight: 600,
                                    color: "var(--eg-color-primary, #10b981)",
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                    display: "inline-block",
                                    marginLeft: "4px"
                                  },
                                  children: "Read more →"
                                }
                              )
                            ] })
                          ]
                        }
                      )
                    ] }),
                    c && !k ? /* @__PURE__ */ d(ce, { children: [
                      /* @__PURE__ */ d(
                        "div",
                        {
                          className: "eg-footer-col eg-footer-col-social",
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: g === "center" ? "center" : g === "right" ? "flex-end" : "flex-start",
                            textAlign: g
                          },
                          children: [
                            /* @__PURE__ */ r(
                              "h4",
                              {
                                style: {
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "var(--eg-text-footer-title, #ffffff)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.8px",
                                  margin: "0 0 16px",
                                  textAlign: g,
                                  width: "100%"
                                },
                                children: h
                              }
                            ),
                            /* @__PURE__ */ r(
                              "div",
                              {
                                className: "eg-footer-social-wrap",
                                style: {
                                  display: "flex",
                                  gap: "10px",
                                  justifyContent: g === "center" ? "center" : g === "right" ? "flex-end" : "flex-start",
                                  flexWrap: "wrap"
                                },
                                children: (c || []).map((L) => /* @__PURE__ */ r(
                                  "a",
                                  {
                                    href: ne(L.url),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    title: L.name,
                                    "aria-label": L.name,
                                    style: {
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      width: "38px",
                                      height: "38px",
                                      borderRadius: "8px",
                                      background: "rgba(255, 255, 255, 0.06)",
                                      border: "1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.12))",
                                      color: "var(--eg-text-footer, #cbd5e1)",
                                      textDecoration: "none",
                                      transition: "all 0.15s ease"
                                    },
                                    onMouseEnter: (S) => {
                                      S.currentTarget.style.color = "#10b981", S.currentTarget.style.borderColor = "#10b981", S.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                                    },
                                    onMouseLeave: (S) => {
                                      S.currentTarget.style.color = "var(--eg-text-footer, #cbd5e1)", S.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)", S.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                                    },
                                    children: L.icon || /* @__PURE__ */ r(Vr, { name: L.name, size: 18 })
                                  },
                                  L.name
                                ))
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ d(
                        "div",
                        {
                          className: "eg-footer-col eg-footer-col-contact",
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: u === "center" ? "center" : u === "right" ? "flex-end" : "flex-start",
                            textAlign: u
                          },
                          children: [
                            /* @__PURE__ */ r(
                              "h4",
                              {
                                style: {
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: "var(--eg-text-footer-title, #ffffff)",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.8px",
                                  margin: "0 0 16px",
                                  textAlign: u,
                                  width: "100%"
                                },
                                children: m
                              }
                            ),
                            /* @__PURE__ */ d(
                              "a",
                              {
                                href: y,
                                onClick: (L) => z(L, y),
                                style: {
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  padding: "10px 18px",
                                  borderRadius: "8px",
                                  background: "rgba(16, 185, 129, 0.15)",
                                  border: "1px solid rgba(16, 185, 129, 0.35)",
                                  color: "#10b981",
                                  textDecoration: "none",
                                  fontWeight: 600,
                                  fontSize: "13.5px",
                                  transition: "all 0.15s ease"
                                },
                                onMouseEnter: (L) => {
                                  L.currentTarget.style.background = "#10b981", L.currentTarget.style.color = "#064e3b";
                                },
                                onMouseLeave: (L) => {
                                  L.currentTarget.style.background = "rgba(16, 185, 129, 0.15)", L.currentTarget.style.color = "#10b981";
                                },
                                children: [
                                  /* @__PURE__ */ r("span", { children: "✉" }),
                                  /* @__PURE__ */ r("span", { children: f })
                                ]
                              }
                            )
                          ]
                        }
                      )
                    ] }) : O.map((L) => /* @__PURE__ */ d("div", { className: "eg-footer-col", children: [
                      /* @__PURE__ */ r(
                        "h4",
                        {
                          style: {
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--eg-text-footer-title, #ffffff)",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                            marginBottom: "16px"
                          },
                          children: L.title
                        }
                      ),
                      L.customContent ? L.customContent : L.links ? /* @__PURE__ */ r("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }, children: L.links.map((S) => /* @__PURE__ */ r("li", { children: /* @__PURE__ */ d(
                        "a",
                        {
                          href: ne(S.href),
                          target: S.external ? "_blank" : void 0,
                          rel: S.external ? "noopener noreferrer" : void 0,
                          onClick: (N) => z(N, S.href, S.external),
                          style: {
                            color: "var(--eg-text-footer, #cbd5e1)",
                            textDecoration: "none",
                            fontSize: "13.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "color 0.15s ease"
                          },
                          onMouseEnter: (N) => {
                            N.currentTarget.style.color = "var(--eg-color-primary, #10b981)";
                          },
                          onMouseLeave: (N) => {
                            N.currentTarget.style.color = "var(--eg-text-footer, #cbd5e1)";
                          },
                          children: [
                            S.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: S.icon }),
                            /* @__PURE__ */ r("span", { children: S.label }),
                            S.external && "↗"
                          ]
                        }
                      ) }, S.label)) }) : null
                    ] }, L.title))
                  ]
                }
              ),
              /* @__PURE__ */ d(
                "div",
                {
                  className: "eg-footer-bottom-bar",
                  style: {
                    borderTop: "1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.08))",
                    paddingTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    fontSize: "12.5px",
                    color: "var(--eg-text-footer-muted, #94a3b8)"
                  },
                  children: [
                    /* @__PURE__ */ r("div", { children: v || `© ${$} ${a || "Application"}. All rights reserved.` }),
                    /* @__PURE__ */ d("div", { style: { display: "flex", gap: "14px", alignItems: "center" }, children: [
                      /* @__PURE__ */ r(
                        "a",
                        {
                          href: x,
                          onClick: (L) => z(L, x),
                          style: { color: "inherit", textDecoration: "none" },
                          children: "Privacy Policy"
                        }
                      ),
                      b && /* @__PURE__ */ d(ce, { children: [
                        /* @__PURE__ */ r("span", { children: "•" }),
                        /* @__PURE__ */ d("span", { children: [
                          I ? `${I} ` : "Developed By: ",
                          /* @__PURE__ */ r(
                            "a",
                            {
                              href: w,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              style: { color: "var(--eg-color-primary, #10b981)", textDecoration: "none" },
                              children: b
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    T && /* @__PURE__ */ r(_i, { variant: t === "mchess" ? "accent" : "primary" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r("style", { children: `
        .eg-footer-grid {
          display: grid;
          grid-template-columns: ${c && !k ? "minmax(280px, 1.3fr) 1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))"};
        }
        @media (max-width: 768px) {
          .eg-footer-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
            text-align: center !important;
          }
          .eg-footer-col {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .eg-footer-col h4 {
            text-align: center !important;
          }
          .eg-footer-col p {
            text-align: center !important;
          }
          .eg-footer-col .eg-logo-badge {
            margin: 0 auto !important;
          }
          .eg-footer-social-wrap {
            justify-content: center !important;
          }
          .eg-footer-bottom-bar {
            flex-direction: column !important;
            text-align: center !important;
            justify-content: center !important;
            gap: 12px !important;
          }
        }
      ` })
      ]
    }
  );
}, Ql = ({
  slides: t,
  intervalMs: e = 5e3,
  autoPlay: n = !0,
  className: i = "",
  onButtonClick: o
}) => {
  const l = t || [
    {
      title: "Modular Component Architecture",
      subtitle: "Universal React components, design tokens, and high-performance utilities built for modern web applications.",
      badge: "Architecture",
      buttonLabel: "Learn More",
      buttonHref: "#",
      crystalThemeIndex: 1
    },
    {
      title: "Responsive & Accessible Design",
      subtitle: "Dynamic dark/light themes, touch-optimized layouts, and strict accessibility standards across all screen sizes.",
      badge: "User Experience",
      buttonLabel: "Explore Components",
      buttonHref: "#",
      crystalThemeIndex: 2
    },
    {
      title: "High Performance & Security",
      subtitle: "Zero-overhead styling tokens, offline caching, and defense-in-depth sanitization built right in.",
      badge: "Performance",
      buttonLabel: "Get Started",
      buttonHref: "#",
      crystalThemeIndex: 3
    }
  ], [s, p] = _(0);
  Y(() => {
    if (!n || l.length <= 1) return;
    const u = setInterval(() => {
      p((h) => (h + 1) % l.length);
    }, e);
    return () => clearInterval(u);
  }, [n, l.length, e]);
  const c = l[s], g = `crystal-theme-${c.crystalThemeIndex || s % 6 + 1}`;
  return /* @__PURE__ */ d(
    "div",
    {
      id: "mainContentHeaderslide",
      className: `eg-image-slider ${g} ${i}`,
      style: {
        position: "relative",
        minHeight: "340px",
        padding: "60px 20px",
        background: "var(--eg-crystal-gradient, linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%))",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "background 0.8s ease-in-out",
        borderRadius: "var(--eg-radius-lg, 12px)",
        margin: "16px 0 32px",
        overflow: "hidden",
        boxShadow: "var(--eg-shadow-lg, 0 12px 32px rgba(0, 0, 0, 0.4))"
      },
      children: [
        /* @__PURE__ */ d("div", { style: { maxWidth: "780px", zIndex: 2, animation: "egSliderFade 0.6s ease" }, children: [
          c.badge && /* @__PURE__ */ r(
            "span",
            {
              style: {
                display: "inline-block",
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                padding: "4px 14px",
                borderRadius: "9999px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "16px",
                border: "1px solid rgba(255, 255, 255, 0.25)"
              },
              children: c.badge
            }
          ),
          /* @__PURE__ */ r(
            "h1",
            {
              style: {
                fontSize: "var(--eg-text-4xl, 2.5rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.5px",
                margin: "0 0 16px",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.4)"
              },
              children: c.title
            }
          ),
          c.subtitle && /* @__PURE__ */ r(
            "p",
            {
              style: {
                fontSize: "var(--eg-text-lg, 1.15rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 auto 28px",
                maxWidth: "620px"
              },
              children: c.subtitle
            }
          ),
          c.buttonLabel && /* @__PURE__ */ d(
            "a",
            {
              href: ne(c.buttonHref),
              onClick: (u) => {
                o && (u.preventDefault(), o(c));
              },
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                color: "#0f172a",
                padding: "12px 28px",
                borderRadius: "var(--eg-radius-pill, 9999px)",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
              },
              onMouseEnter: (u) => {
                u.currentTarget.style.transform = "translateY(-2px)", u.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.35)";
              },
              onMouseLeave: (u) => {
                u.currentTarget.style.transform = "translateY(0)", u.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.25)";
              },
              children: [
                c.buttonLabel,
                " →"
              ]
            }
          )
        ] }),
        l.length > 1 && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "absolute",
              bottom: "16px",
              display: "flex",
              gap: "8px",
              zIndex: 3
            },
            children: l.map((u, h) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => p(h),
                "aria-label": `Go to slide ${h + 1}`,
                style: {
                  width: h === s ? "28px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: h === s ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0
                }
              },
              h
            ))
          }
        ),
        /* @__PURE__ */ r("style", { children: `
        @keyframes egSliderFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` })
      ]
    }
  );
}, es = ({
  children: t,
  narrow: e = !1,
  wide: n = !1,
  fluid: i = !1,
  className: o = "",
  style: a
}) => /* @__PURE__ */ r(
  "div",
  {
    className: `eg-container ${i ? "eg-container--fluid" : n ? "eg-container--wide" : e ? "eg-container--narrow" : "eg-container--default"} ${o}`,
    style: a,
    children: t
  }
), ts = ({
  children: t,
  id: e,
  className: n = "",
  style: i,
  padded: o = !0
}) => /* @__PURE__ */ r(
  "section",
  {
    id: e,
    className: `eg-section ${o ? "eg-section--padded" : "eg-section--unpadded"} ${n}`,
    style: i,
    children: t
  }
), rs = ({
  title: t,
  subtitle: e,
  badge: n,
  className: i = "",
  style: o
}) => /* @__PURE__ */ d(
  "div",
  {
    className: `eg-page-header ${i}`,
    style: o,
    children: [
      n && /* @__PURE__ */ r("span", { className: "eg-page-header__badge", children: n }),
      /* @__PURE__ */ r("h1", { className: "eg-page-header__title", children: t }),
      e && /* @__PURE__ */ r("p", { className: "eg-page-header__subtitle", children: e })
    ]
  }
), lr = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>", Ia = ({ product: t, onSelect: e }) => {
  const [n, i] = _(!1), o = we.resolveProductVersion(t), a = (u) => {
    if (!u || typeof u != "string" || !u.trim()) return lr;
    let h = u.trim();
    return h.startsWith("./img/") ? h = "./assets/" + h.slice(2) : h.startsWith("img/") && (h = "assets/" + h), h;
  }, l = (u, h) => {
    if (!u) return null;
    let m = h, f = "#", y = "";
    if (typeof u == "string")
      f = u;
    else if (typeof u == "object" && u !== null) {
      const v = u;
      if (v.label && v.url)
        m = String(v.label), f = String(v.url);
      else {
        const x = ["sametab", "target", "icon", "class", "btnclass", "rel"];
        for (const [b, w] of Object.entries(v))
          if (!x.includes(b.toLowerCase()) && typeof w == "string") {
            m = b, f = w;
            break;
          }
      }
      v.icon && typeof v.icon == "string" && (y = v.icon);
    }
    if (!f || f === "#") return null;
    const k = f.startsWith("http://") || f.startsWith("https://");
    return {
      label: m,
      url: ne(f),
      isExternal: k,
      icon: y
    };
  }, s = l(
    t.button1,
    t.product_type === "WebApp" ? "Launch" : "View Details"
  ) || (t.webapp_link ? { label: "Launch", url: ne(t.webapp_link), isExternal: !0 } : null), p = l(
    t.button2,
    t.attach_upload_file_1 ? "Download" : "Source Code"
  ), c = s && (s.label.toUpperCase().includes("DETAIL") || s.url.includes("title=") || s.url.includes("id=") || !s.isExternal);
  return /* @__PURE__ */ d(
    "article",
    {
      className: "eg-product-card",
      onClick: (u) => {
        const h = u.target;
        h.closest("a") || h.closest("button") || e && e(t);
      },
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "var(--eg-radius-lg, 12px)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))",
        position: "relative",
        overflow: "hidden",
        cursor: e ? "pointer" : "default"
      },
      onMouseEnter: (u) => {
        u.currentTarget.style.transform = "translateY(-4px)", u.currentTarget.style.boxShadow = "var(--eg-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12))", u.currentTarget.style.borderColor = "var(--eg-color-primary, #10b981)";
      },
      onMouseLeave: (u) => {
        u.currentTarget.style.transform = "translateY(0)", u.currentTarget.style.boxShadow = "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))", u.currentTarget.style.borderColor = "var(--eg-border-default, rgba(0, 0, 0, 0.1))";
      },
      children: [
        /* @__PURE__ */ d("div", { children: [
          /* @__PURE__ */ d(
            "div",
            {
              className: "eg-product-card-header",
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: "14px"
              },
              children: [
                /* @__PURE__ */ r(
                  "img",
                  {
                    src: a(t.icon || t.imageUrl || t.image),
                    alt: t.title || t.name || "App icon",
                    onError: (u) => {
                      u.currentTarget.onerror = null, u.currentTarget.src = lr;
                    },
                    style: {
                      width: "52px",
                      height: "52px",
                      borderRadius: "10px",
                      objectFit: "contain",
                      background: "var(--eg-bg-canvas, #f1f5f9)",
                      border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
                      padding: "4px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ d("div", { style: { flex: "1 1 auto", minWidth: 0 }, children: [
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "8px"
                      },
                      children: [
                        /* @__PURE__ */ r(
                          "h3",
                          {
                            style: {
                              margin: 0,
                              fontSize: "17px",
                              fontWeight: 700,
                              color: "var(--eg-text-primary, #0f172a)",
                              lineHeight: 1.3,
                              wordBreak: "break-word"
                            },
                            children: t.title || t.name
                          }
                        ),
                        /* @__PURE__ */ d("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }, children: [
                          t.category && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.category }),
                          /* @__PURE__ */ d(ye, { variant: "primary", size: "sm", children: [
                            "v",
                            o
                          ] })
                        ] })
                      ]
                    }
                  ),
                  t.subtitle && /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "var(--eg-text-muted, #94a3b8)", fontWeight: 500, display: "block", marginTop: "2px" }, children: t.subtitle })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ r(
            "p",
            {
              style: {
                fontSize: "13.5px",
                color: "var(--eg-text-secondary, #475569)",
                lineHeight: 1.55,
                margin: "0 0 18px",
                minHeight: "42px",
                wordBreak: "break-word"
              },
              children: t.short_description || t.description
            }
          )
        ] }),
        /* @__PURE__ */ d(
          "div",
          {
            className: "eg-product-card-actions",
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "10px",
              paddingTop: "16px",
              borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))"
            },
            children: [
              /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", flex: "1 1 auto" }, children: [
                s && (c && e ? /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => e(t),
                    style: {
                      padding: "8px 16px",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      background: "var(--eg-color-primary, #10b981)",
                      color: "#ffffff",
                      border: "none",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: s.label
                  }
                ) : /* @__PURE__ */ r(
                  "a",
                  {
                    href: s.url,
                    target: s.isExternal ? "_blank" : void 0,
                    rel: s.isExternal ? "noopener noreferrer" : void 0,
                    onClick: (u) => {
                      !s.isExternal && e && (u.preventDefault(), e(t));
                    },
                    style: {
                      padding: "8px 16px",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      background: "var(--eg-color-primary, #10b981)",
                      color: "#ffffff",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      transition: "opacity 0.15s ease",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: s.label
                  }
                )),
                p && /* @__PURE__ */ r(
                  "a",
                  {
                    href: p.url,
                    target: p.isExternal ? "_blank" : void 0,
                    rel: p.isExternal ? "noopener noreferrer" : void 0,
                    style: {
                      padding: "8px 14px",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                      border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.1))",
                      color: "var(--eg-text-primary, #0f172a)",
                      fontSize: "13px",
                      fontWeight: 600,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: p.label
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: (u) => {
                    u.stopPropagation(), i(!0);
                  },
                  title: "Share application",
                  style: {
                    background: "transparent",
                    border: "none",
                    color: "var(--eg-text-muted, #94a3b8)",
                    cursor: "pointer",
                    padding: "6px",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  },
                  children: /* @__PURE__ */ d("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ r("circle", { cx: "18", cy: "5", r: "3" }),
                    /* @__PURE__ */ r("circle", { cx: "6", cy: "12", r: "3" }),
                    /* @__PURE__ */ r("circle", { cx: "18", cy: "19", r: "3" }),
                    /* @__PURE__ */ r("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
                    /* @__PURE__ */ r("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r(
          qt,
          {
            isOpen: n,
            onClose: () => i(!1),
            title: t.title || t.name || "Application",
            description: t.short_description || t.description
          }
        )
      ]
    }
  );
}, ns = ({ products: t, onSelect: e }) => /* @__PURE__ */ r("div", { className: "eg-product-grid", children: t.map((n) => /* @__PURE__ */ r(Ia, { product: n, onSelect: e }, n.id)) }), sr = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>", is = ({
  product: t,
  onBack: e,
  backLabel: n = "← Back to all applications",
  customActions: i,
  className: o = "",
  style: a
}) => {
  const [l, s] = _(!1), p = we.resolveProductVersion(t), c = (f) => {
    if (!f || typeof f != "string" || !f.trim()) return sr;
    let y = f.trim();
    return y.startsWith("./img/") ? y = "./assets/" + y.slice(2) : y.startsWith("img/") && (y = "assets/" + y), y;
  }, u = (() => {
    const f = [], y = (x, b) => {
      if (!x) return null;
      let w = b, I = "#", T = "";
      if (typeof x == "string")
        I = x;
      else if (typeof x == "object" && x !== null) {
        const W = x;
        if (W.label && W.url)
          w = String(W.label), I = String(W.url);
        else {
          const P = ["sametab", "target", "icon", "class", "btnclass", "rel"];
          for (const [R, E] of Object.entries(W))
            if (!P.includes(R.toLowerCase()) && typeof E == "string") {
              w = R, I = E;
              break;
            }
        }
        W.icon && typeof W.icon == "string" && (T = W.icon);
      }
      if (!I || I === "#") return null;
      const C = w.toUpperCase().trim();
      if (C === "VIEW DETAILS" || C === "DETAILS" || C === "VIEW APP" || I.includes(`title=${t.slug}`) || I.includes(`id=${t.id}`))
        return null;
      const M = I.startsWith("http://") || I.startsWith("https://");
      return {
        label: w,
        url: ne(I),
        isExternal: M,
        icon: T
      };
    }, k = y(
      t.button1,
      t.product_type === "WebApp" ? "Launch WebApp" : "Open Website"
    );
    k && f.push(k);
    const v = y(t.button2, "Download");
    return v && f.push(v), f.length === 0 && t.webapp_link && f.push({
      label: "Launch Application",
      url: ne(t.webapp_link),
      isExternal: !0
    }), f;
  })(), h = t.full_description || t.description || t.short_description || "No detailed description available.", m = Ae(
    h.includes("<") ? h : `<p>${h.replace(/\n\n+/g, "</p><p>")}</p>`
  );
  return /* @__PURE__ */ d(
    "article",
    {
      className: `eg-product-detail ${o}`,
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
        borderRadius: "var(--eg-radius-lg, 14px)",
        padding: "32px",
        boxShadow: "var(--eg-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06))",
        maxWidth: "100%",
        boxSizing: "border-box",
        ...a
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              gap: "24px",
              alignItems: "flex-start",
              flexWrap: "wrap",
              borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
              paddingBottom: "28px",
              marginBottom: "28px"
            },
            children: [
              /* @__PURE__ */ r(
                "img",
                {
                  src: c(t.icon || t.imageUrl || t.image),
                  alt: t.title || t.name || "Application Icon",
                  onError: (f) => {
                    f.currentTarget.onerror = null, f.currentTarget.src = sr;
                  },
                  style: {
                    width: "100px",
                    height: "100px",
                    borderRadius: "16px",
                    objectFit: "contain",
                    background: "var(--eg-bg-canvas, #f8fafc)",
                    border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))",
                    padding: "8px",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ d("div", { style: { flex: "1 1 300px", minWidth: 0 }, children: [
                /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }, children: [
                  /* @__PURE__ */ r(
                    "h1",
                    {
                      style: {
                        margin: 0,
                        fontSize: "clamp(1.5rem, 3vw, 2rem)",
                        fontWeight: 700,
                        color: "var(--eg-text-primary, #0f172a)",
                        lineHeight: 1.25
                      },
                      children: t.title || t.name
                    }
                  ),
                  /* @__PURE__ */ d("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: [
                    t.category && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.category }),
                    t.product_type && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.product_type }),
                    /* @__PURE__ */ d(ye, { variant: "primary", size: "sm", children: [
                      "v",
                      p
                    ] })
                  ] })
                ] }),
                t.subtitle && /* @__PURE__ */ r(
                  "p",
                  {
                    style: {
                      margin: "0 0 12px 0",
                      fontSize: "14px",
                      color: "var(--eg-text-muted, #64748b)",
                      fontWeight: 500
                    },
                    children: t.subtitle
                  }
                ),
                /* @__PURE__ */ d("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }, children: [
                  u.map((f, y) => /* @__PURE__ */ d(
                    "a",
                    {
                      href: f.url,
                      target: f.isExternal ? "_blank" : void 0,
                      rel: f.isExternal ? "noopener noreferrer" : void 0,
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        padding: "10px 22px",
                        minHeight: "42px",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        backgroundColor: y === 0 ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))",
                        color: y === 0 ? "#ffffff" : "var(--eg-text-primary, #0f172a)",
                        border: y === 0 ? "1px solid transparent" : "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))",
                        boxShadow: y === 0 ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none"
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: f.label }),
                        f.isExternal && /* @__PURE__ */ d("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                          /* @__PURE__ */ r("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                          /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
                          /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
                        ] })
                      ]
                    },
                    y
                  )),
                  /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => s(!0),
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 18px",
                        minHeight: "42px",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        fontSize: "13.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        background: "transparent",
                        border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))",
                        color: "var(--eg-text-secondary, #475569)",
                        transition: "all 0.15s ease"
                      },
                      children: [
                        /* @__PURE__ */ d("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ r("circle", { cx: "18", cy: "5", r: "3" }),
                          /* @__PURE__ */ r("circle", { cx: "6", cy: "12", r: "3" }),
                          /* @__PURE__ */ r("circle", { cx: "18", cy: "19", r: "3" }),
                          /* @__PURE__ */ r("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
                          /* @__PURE__ */ r("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
                        ] }),
                        /* @__PURE__ */ r("span", { children: "Share" })
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r("style", { children: `
        .eg-product-detail-body h1,
        .eg-product-detail-body h2,
        .eg-product-detail-body h3,
        .eg-product-detail-body h4 {
          color: var(--eg-text-primary, #0f172a);
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }
        .eg-product-detail-body p {
          color: var(--eg-text-secondary, #334155);
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .eg-product-detail-body ul,
        .eg-product-detail-body ol {
          color: var(--eg-text-secondary, #334155);
          margin: 12px 0 18px 24px;
          padding-left: 8px;
          line-height: 1.65;
        }
        .eg-product-detail-body li {
          margin-bottom: 6px;
        }
        .eg-product-detail-body table {
          width: 100%;
          max-width: 720px;
          border-collapse: collapse;
          margin: 20px 0 24px 0;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          overflow: hidden;
        }
        .eg-product-detail-body th,
        .eg-product-detail-body td {
          padding: 10px 14px;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12));
          text-align: left;
        }
        .eg-product-detail-body th {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.04));
          color: var(--eg-text-primary, #0f172a);
          font-weight: 600;
        }
        .eg-product-detail-body td {
          color: var(--eg-text-secondary, #334155);
        }
        .eg-product-detail-body code {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.06));
          color: var(--eg-color-primary, #10b981);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
        }
        .eg-product-detail-body pre {
          background: var(--eg-bg-canvas, #1e293b);
          color: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 16px 0;
        }
      ` }),
        /* @__PURE__ */ r(
          "div",
          {
            className: "eg-product-detail-body",
            dangerouslySetInnerHTML: { __html: m },
            style: {
              fontSize: "15px",
              lineHeight: 1.7,
              color: "var(--eg-text-primary, #0f172a)"
            }
          }
        ),
        i && /* @__PURE__ */ r("div", { style: { marginTop: "24px" }, children: i }),
        /* @__PURE__ */ r(
          "div",
          {
            style: {
              marginTop: "32px",
              paddingTop: "20px",
              borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            },
            children: e ? /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: e,
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))",
                  border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))",
                  color: "var(--eg-text-primary, #0f172a)",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: /* @__PURE__ */ r("span", { children: n })
              }
            ) : /* @__PURE__ */ r(
              "a",
              {
                href: "apps",
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))",
                  border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))",
                  color: "var(--eg-text-primary, #0f172a)",
                  fontSize: "13.5px",
                  fontWeight: 600,
                  textDecoration: "none"
                },
                children: /* @__PURE__ */ r("span", { children: n })
              }
            )
          }
        ),
        /* @__PURE__ */ r(
          qt,
          {
            isOpen: l,
            onClose: () => s(!1),
            title: t.title || t.name || "Application",
            description: t.description || t.short_description,
            imageUrl: t.imageUrl || t.iconUrl || void 0
          }
        )
      ]
    }
  );
};
function Te() {
  if (!(typeof window > "u"))
    return window.mermaid;
}
function Pe() {
  if (!(typeof window > "u"))
    return window.Prism;
}
let rt = null, nt = null;
function La(t) {
  return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Ce(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function cr() {
  if (typeof document > "u") return !1;
  const t = document.documentElement.getAttribute("data-theme") || "";
  return t.includes("dark") || t.includes("crystal") || t === "clamui-dark";
}
function _a() {
  if (typeof window > "u") return Promise.resolve(null);
  const t = Te();
  return t ? Promise.resolve(t) : rt || (rt = new Promise((e) => {
    const n = document.querySelector("script[data-mermaid-script]");
    if (n) {
      n.addEventListener("load", () => {
        it(), e(Te() || null);
      }), n.addEventListener("error", () => e(null));
      return;
    }
    const i = document.createElement("script");
    i.src = "/vendor/mermaid.min.js", i.async = !0, i.setAttribute("data-mermaid-script", "true"), i.onload = () => {
      it(), e(Te() || null);
    }, i.onerror = () => {
      const o = document.createElement("script");
      o.src = "vendor/mermaid.min.js", o.async = !0, o.onload = () => {
        it(), e(Te() || null);
      }, o.onerror = () => {
        const a = document.createElement("script");
        a.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js", a.async = !0, a.onload = () => {
          it(), e(Te() || null);
        }, a.onerror = () => {
          console.warn("Unable to load Mermaid script."), e(null);
        }, document.head.appendChild(a);
      }, document.head.appendChild(o);
    }, document.head.appendChild(i);
  }), rt);
}
function it() {
  const t = Te();
  if (t)
    try {
      t.initialize({
        startOnLoad: !1,
        theme: cr() ? "dark" : "default",
        themeVariables: cr() ? {
          darkMode: !0,
          background: "#0d0e12",
          primaryColor: "#1b1b24",
          primaryTextColor: "#f4f4f6",
          primaryBorderColor: "#00dc82",
          lineColor: "#38bdf8",
          secondaryColor: "#15151c",
          tertiaryColor: "#101015"
        } : void 0,
        securityLevel: "loose",
        fontFamily: "var(--eg-font-sans, -apple-system, sans-serif)"
      });
    } catch (e) {
      console.warn("Mermaid initialization warning:", e);
    }
}
function Ta() {
  if (typeof window > "u") return Promise.resolve(null);
  const t = Pe();
  return t ? Promise.resolve(t) : nt || (nt = new Promise((e) => {
    const n = document.createElement("script");
    n.src = "/vendor/prism.bundle.js", n.async = !0, n.onload = () => e(Pe() || null), n.onerror = () => {
      const i = document.createElement("script");
      i.src = "vendor/prism.bundle.js", i.async = !0, i.onload = () => e(Pe() || null), i.onerror = () => e(null), document.head.appendChild(i);
    }, document.head.appendChild(n);
  }), nt);
}
const dr = {
  NOTE: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  TIP: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5h6.18z"></path></svg>',
  IMPORTANT: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  WARNING: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  CAUTION: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
};
function Wa(t) {
  return t.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s*<br\s*\/?>)?([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
    (e, n, i) => {
      const o = n.toUpperCase(), a = dr[o] || dr.NOTE;
      return `
        <div class="docs-alert ${o.toLowerCase()}">
          <div class="docs-alert-icon">${a}</div>
          <div class="docs-alert-content">
            <div class="docs-alert-title">${o}</div>
            <div class="docs-alert-body">${i}</div>
          </div>
        </div>
      `;
    }
  );
}
function fn(t) {
  !t || !t.languages || !t.languages.javascript || (t.languages.typescript || (t.languages.typescript = t.languages.extend("javascript", {
    "class-name": {
      pattern: /(\b(?:class|interface|extends|implements|instanceof|new|type)\s+)[\w.\\]+/,
      lookbehind: !0
    },
    keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|readonly|return|set|static|super|switch|this|throw|try|type|typeof|undefined|var|void|while|with|yield|declare|namespace|module|abstract|keyof|is|never|unknown|any|boolean|number|string)\b/
  }), t.languages.ts = t.languages.typescript), t.languages.tsx || (t.languages.tsx = t.languages.extend("javascript", {
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
          inside: {
            punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    }
  }), t.languages.jsx = t.languages.tsx));
}
function mn(t, e) {
  var x;
  const n = (e || "").toLowerCase().trim();
  if (typeof window < "u") {
    const b = Pe();
    if (b) {
      fn(b);
      const w = n === "ts" || n === "typescript" ? "typescript" : n === "tsx" ? "tsx" : n === "jsx" ? "jsx" : n === "js" ? "javascript" : n === "py" ? "python" : n === "sh" || n === "shell" ? "bash" : n, I = (x = b.languages) == null ? void 0 : x[w];
      if (I && typeof b.highlight == "function")
        try {
          return b.highlight(t, I, w);
        } catch {
        }
    }
  }
  const i = /python|py/i.test(n), o = /c\+\+|cpp|c|csharp|c#/i.test(n), a = /bash|sh|shell|zsh/i.test(n), l = /css|scss|less/i.test(n), s = /json/i.test(n), p = !i && !o && !a && !l && !s, c = [];
  let g = 0;
  const u = (b, w) => {
    const I = `eghigh_${g++}`;
    return c.push({
      placeholder: I,
      html: `<span class="${b}">${Ce(w)}</span>`
    }), I;
  };
  let h = t;
  i || a ? (i && (h = h.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
    (b) => u("hljs-comment token comment", b)
  )), h = h.replace(/(#.*$)/gm, (b) => u("hljs-comment token comment", b))) : (h = h.replace(/(\/\*[\s\S]*?\*\/)/g, (b) => u("hljs-comment token comment", b)), h = h.replace(/(\/\/.*$)/gm, (b) => u("hljs-comment token comment", b))), o && (h = h.replace(/^(#\s*[a-zA-Z_]+.*)$/gm, (b) => u("hljs-meta token important", b))), h = h.replace(
    /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    (b) => u("hljs-string token string", b)
  ), p && (h = h.replace(/(<\/)([a-zA-Z0-9_.-]+)(>)/g, (b, w, I, T) => u("hljs-punctuation token punctuation", w) + u("hljs-tag token tag", I) + u("hljs-punctuation token punctuation", T)), h = h.replace(/(<[A-Za-z0-9_.-]+)([^>]*?)(\/?>)/g, (b, w, I, T) => {
    const C = w.slice(1), M = u("hljs-punctuation token punctuation", "<") + u("hljs-tag token tag", C), W = I.replace(
      /\b([a-zA-Z_:][a-zA-Z0-9_.-]*)(?=\s*=)/g,
      (R) => u("hljs-attr token attr-name", R)
    ), P = u("hljs-punctuation token punctuation", T);
    return M + W + P;
  })), h = h.replace(
    /\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
    (b) => u("hljs-number token number", b)
  );
  const m = /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|readonly|return|set|static|super|switch|this|throw|true|try|type|typeof|var|void|while|with|yield|declare|namespace|module|abstract|keyof|is)\b/g, f = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|self|cls)\b/g, y = /\b(alignas|alignof|auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while)\b/g, k = /\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|return|exit|echo|export|source|local|sudo|npm|npx|git|cd|mkdir|rm|cp|mv)\b/g;
  p ? h = h.replace(m, (b) => u("hljs-keyword token keyword", b)) : i ? h = h.replace(f, (b) => u("hljs-keyword token keyword", b)) : o ? h = h.replace(y, (b) => u("hljs-keyword token keyword", b)) : a && (h = h.replace(k, (b) => u("hljs-keyword token keyword", b))), h = h.replace(
    /\b(?!(?:eghigh|return|if|for|while|switch|catch|void|typeof|delete|await|yield)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    (b, w) => u("hljs-title function_ token function", w)
  ), p && (h = h.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b/g, (b) => u("hljs-type token class-name", b)), h = h.replace(
    /\b(string|number|boolean|any|unknown|never|void)\b/g,
    (b) => u("hljs-type token class-name", b)
  )), p && (h = h.replace(
    /(=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?)/g,
    (b) => u("hljs-operator token operator", b)
  )), s && (h = h.replace(/"([^"]+)"\s*(?=:)/g, (b, w) => `"${u("hljs-attr token property", w)}"`));
  let v = Ce(h);
  for (let b = c.length - 1; b >= 0; b--)
    v = v.replace(c[b].placeholder, c[b].html);
  return v;
}
function $a() {
  const t = new Z.Renderer();
  return t.heading = function(e, n) {
    let i = 1, o = "";
    if (typeof e == "object" && e !== null && "tokens" in e) {
      const s = e;
      i = s.depth || 1, o = this.parser ? this.parser.parseInline(s.tokens) : s.text || "";
    } else
      o = String(e || ""), i = Number(n || 1);
    const a = o.replace(/<[^>]*>/g, "").trim(), l = La(a);
    return `<h${i} id="${l}"><span>${o}</span><a href="#${l}" class="header-anchor" aria-label="Permalink to ${a}">#</a></h${i}>
`;
  }, t.code = function(e, n) {
    let i = "", o = "";
    if (typeof e == "object" && e !== null && "text" in e) {
      const s = e;
      i = s.text || "", o = (s.lang || "").trim().toLowerCase();
    } else
      i = String(e || ""), o = String(n || "").trim().toLowerCase();
    if (o === "mermaid" || i.startsWith("graph ") || i.startsWith("sequenceDiagram") || i.startsWith("flowchart ") || i.startsWith("classDiagram") || i.startsWith("stateDiagram") || i.startsWith("erDiagram") || i.startsWith("gantt") || i.startsWith("pie")) {
      const s = Ce(i);
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
            <pre class="mermaid" data-raw-source="${encodeURIComponent(i)}">${s}</pre>
          </div>
          <div class="mermaid-source-pane">
            <pre><code>${s}</code></pre>
          </div>
        </div>
      `;
    }
    const a = o ? o.toUpperCase() : "CODE", l = mn(i, o);
    return `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-block-lang">${a}</span>
          <button type="button" class="code-copy-btn" aria-label="Copy code block">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre class="language-${o}"><code class="language-${o} hljs hljs-rendered">${l}</code></pre>
      </div>
    `;
  }, t.image = function(e, n, i) {
    let o = "", a = "", l = "";
    if (typeof e == "object" && e !== null && "href" in e) {
      const g = e;
      o = g.href || "", a = g.title || "", l = g.text || "";
    } else
      o = String(e || ""), a = String(n || ""), l = String(i || "");
    const s = ne(o), p = l ? ` alt="${Ce(l)}"` : "", c = a ? ` title="${Ce(a)}"` : "";
    return `
      <figure class="docs-image-figure">
        <img src="${s}"${p}${c} class="docs-image" loading="lazy" />
        ${a ? `<figcaption class="docs-image-caption">${Ce(a)}</figcaption>` : ""}
      </figure>
    `;
  }, t.table = function(e, n) {
    if (typeof e == "object" && e !== null && "header" in e) {
      const a = e;
      let l = "";
      a.header.forEach((p) => {
        l += `<th>${this.parser ? this.parser.parseInline(p.tokens) : p.text}</th>`;
      });
      let s = "";
      return a.rows.forEach((p) => {
        s += "<tr>", p.forEach((c) => {
          s += `<td>${this.parser ? this.parser.parseInline(c.tokens) : c.text}</td>`;
        }), s += "</tr>";
      }), `
        <div class="table-responsive-wrapper">
          <table>
            <thead><tr>${l}</tr></thead>
            <tbody>${s}</tbody>
          </table>
        </div>
      `;
    }
    const i = String(e || ""), o = String(n || "");
    return `
      <div class="table-responsive-wrapper">
        <table>
          <thead>${i}</thead>
          <tbody>${o}</tbody>
        </table>
      </div>
    `;
  }, t.link = function(e, n, i) {
    let o = "", a = "", l = "";
    if (typeof e == "object" && e !== null && "href" in e) {
      const u = e;
      o = u.href || "", a = u.title || "", l = this.parser ? this.parser.parseInline(u.tokens) : u.text || "";
    } else
      o = String(e || ""), a = String(n || ""), l = String(i || "");
    if (!o) return l;
    if (o.startsWith("#"))
      return `<a href="${o}" class="docs-internal-anchor">${l}</a>`;
    const s = ne(o), p = a ? ` title="${Ce(a)}"` : "", g = /^https?:\/\//i.test(s) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${s}"${g}${p}>${l}</a>`;
  }, t;
}
function xn(t) {
  if (!t || !t.trim()) return "";
  const e = $a();
  let n = "";
  try {
    n = Z.parse(t, { renderer: e, gfm: !0 });
  } catch (o) {
    console.warn("Marked parsing error:", o), n = Z.parse(t);
  }
  const i = Wa(n);
  return Ae(i);
}
let he = 1, Ne = 0, De = 0, Lt = !1, pr = 0, gr = 0;
function Ba() {
  let t = document.getElementById("egMermaidGlobalModal");
  if (t) return t;
  t = document.createElement("div"), t.id = "egMermaidGlobalModal", t.className = "mermaid-modal-overlay", t.innerHTML = `
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
  `, document.body.appendChild(t);
  const e = t.querySelector("#egMermaidModalClose"), n = t.querySelector("#egMermaidCloseBtn2"), i = t.querySelector("#egMermaidZoomIn"), o = t.querySelector("#egMermaidZoomOut"), a = t.querySelector("#egMermaidZoomReset"), l = t.querySelector("#egMermaidModalBody"), s = () => {
    const c = t == null ? void 0 : t.querySelector("#egMermaidViewport"), g = t == null ? void 0 : t.querySelector("#egMermaidZoomBadge");
    c && (c.style.transform = `translate(${Ne}px, ${De}px) scale(${he})`), g && (g.textContent = `${Math.round(he * 100)}%`);
  }, p = () => {
    if (!t) return;
    t.classList.remove("open"), document.body.style.overflow = "";
    const c = t.querySelector("#egMermaidViewport");
    c && (c.innerHTML = "");
  };
  return e == null || e.addEventListener("click", p), n == null || n.addEventListener("click", p), t.addEventListener("click", (c) => {
    c.target === t && p();
  }), i == null || i.addEventListener("click", () => {
    he = Math.min(6, Number((he + 0.25).toFixed(2))), s();
  }), o == null || o.addEventListener("click", () => {
    he = Math.max(0.2, Number((he - 0.25).toFixed(2))), s();
  }), a == null || a.addEventListener("click", () => {
    he = 1, Ne = 0, De = 0, s();
  }), l && (l.addEventListener(
    "wheel",
    (c) => {
      const g = c;
      g.preventDefault();
      const u = g.deltaY < 0 ? 0.15 : -0.15;
      he = Math.max(0.15, Math.min(6, Number((he + u).toFixed(2)))), s();
    },
    { passive: !1 }
  ), l.addEventListener("mousedown", (c) => {
    const g = c;
    Lt = !0, pr = g.clientX - Ne, gr = g.clientY - De;
  }), window.addEventListener("mouseup", () => {
    Lt = !1;
  }), l.addEventListener("mousemove", (c) => {
    if (!Lt) return;
    const g = c;
    g.preventDefault(), Ne = g.clientX - pr, De = g.clientY - gr, s();
  })), document.addEventListener("keydown", (c) => {
    c.key === "Escape" && (t != null && t.classList.contains("open")) && p();
  }), t;
}
function ot(t, e = "Architecture & Flow Diagram") {
  var b;
  const n = Ba(), i = n.querySelector("#egMermaidModalTitle"), o = n.querySelector("#egMermaidViewport"), a = n.querySelector("#egMermaidModalBody");
  if (!o || !t) return;
  const l = t.closest(".mermaid-wrapper");
  if (l) {
    const w = l.querySelector(".mermaid-container svg");
    w && (t = w);
  }
  i && (i.textContent = e), o.innerHTML = "";
  const s = t.cloneNode(!0);
  let p = 1e3, c = 600;
  const g = (b = s.viewBox) == null ? void 0 : b.baseVal;
  if (g && g.width > 0 && g.height > 0)
    p = g.width, c = g.height;
  else {
    const w = t.getBoundingClientRect();
    w.width > 0 && w.height > 0 && (p = w.width, c = w.height);
  }
  const u = t.getAttribute("viewBox");
  u ? s.setAttribute("viewBox", u) : s.setAttribute("viewBox", `0 0 ${p} ${c}`), s.setAttribute("width", `${p}`), s.setAttribute("height", `${c}`), s.style.width = `${p}px`, s.style.height = `${c}px`, s.style.minWidth = `${p}px`, s.style.maxWidth = "none", s.style.display = "block", n.classList.add("open"), document.body.style.overflow = "hidden", o.appendChild(s);
  const h = a ? a.getBoundingClientRect() : null, m = h && h.width > 0 ? h.width - 80 : 1100, f = h && h.height > 0 ? h.height - 80 : 700, y = m / p, k = f / c, v = Math.min(y, k, 1.2);
  he = Number(Math.max(0.3, v).toFixed(2)), Ne = 0, De = 0, o.style.transform = `translate(0px, 0px) scale(${he})`;
  const x = n.querySelector("#egMermaidZoomBadge");
  x && (x.textContent = `${Math.round(he * 100)}%`);
}
let at = null;
function Ma() {
  if (typeof document > "u") return {};
  if (at && document.body.contains(at))
    return at;
  const t = document.createElement("div");
  t.className = "mermaid-modal-overlay docs-image-modal-overlay", t.id = "egImageLightboxOverlay", t.setAttribute("role", "dialog"), t.setAttribute("aria-modal", "true"), t.setAttribute("aria-label", "Image Lightbox Preview"), t.innerHTML = `
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
  `, document.body.appendChild(t);
  const e = t.querySelector("#egImageModalClose"), n = () => {
    t.classList.remove("open"), document.body.style.overflow = "";
  };
  return e == null || e.addEventListener("click", n), t.addEventListener("click", (i) => {
    i.target === t && n();
  }), window.addEventListener("keydown", (i) => {
    i.key === "Escape" && t.classList.contains("open") && n();
  }), at = t, t;
}
function Ra(t, e) {
  if (typeof document > "u") return;
  const n = Ma(), i = n.querySelector("#egImageModalTitle"), o = n.querySelector("#egImageModalImg");
  i && (i.textContent = e || "Image Preview"), o && (o.src = t), n.classList.add("open"), document.body.style.overflow = "hidden";
}
function za(t) {
  if (t.dataset.dragEnabled) return;
  t.dataset.dragEnabled = "1";
  let e = !1, n = 0, i = 0;
  t.addEventListener("mousedown", (o) => {
    o.target.closest("button, a") || (e = !0, n = o.pageX - t.offsetLeft, i = t.scrollLeft);
  }), window.addEventListener("mouseup", () => {
    e = !1;
  }), t.addEventListener("mouseleave", () => {
    e = !1;
  }), t.addEventListener("mousemove", (o) => {
    if (!e) return;
    o.preventDefault();
    const l = (o.pageX - t.offsetLeft - n) * 1.5;
    t.scrollLeft = i - l;
  });
}
function yn(t, e) {
  if (!t || typeof window > "u") return;
  t.querySelectorAll(".mermaid").length > 0 ? _a().then((a) => {
    if (!a) return;
    const l = t.querySelectorAll(".mermaid");
    l.length !== 0 && (typeof a.run == "function" ? a.run({ nodes: l }).then(() => lt(t, e)).catch(() => lt(t, e)) : typeof a.init == "function" && (a.init(void 0, l), lt(t, e)));
  }).catch((a) => {
    console.warn("Mermaid enhancement notice:", a);
  }) : t.querySelectorAll(".mermaid-wrapper").length > 0 && lt(t, e), t.querySelectorAll(".code-copy-btn").forEach((a) => {
    a.dataset.bound || (a.dataset.bound = "1", a.addEventListener("click", async (l) => {
      var c;
      l.preventDefault();
      const s = (c = a.closest(".code-block-wrapper")) == null ? void 0 : c.querySelector("pre");
      if (!s) return;
      const p = s.innerText;
      try {
        await navigator.clipboard.writeText(p);
        const g = a.innerHTML;
        a.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>Copied!</span>
        `, a.classList.add("copied"), setTimeout(() => {
          a.innerHTML = g, a.classList.remove("copied");
        }, 2e3);
      } catch (g) {
        console.warn("Clipboard write error:", g);
      }
    }));
  });
  const i = (a) => {
    if (a) {
      fn(a);
      try {
        a.highlightAllUnder(t);
      } catch {
      }
    }
    t.querySelectorAll("pre code").forEach((l) => {
      if (l.closest(".mermaid-wrapper") || l.querySelector(".token, .hljs-keyword, .hljs-string, .hljs-tag")) return;
      const p = (l.className || "").match(/language-([a-zA-Z0-9_-]+)/), c = p ? p[1] : "", g = l.textContent || "";
      g && (l.innerHTML = mn(g, c));
    });
  }, o = Pe();
  o ? i(o) : Ta().then((a) => {
    i(a);
  }), t.querySelectorAll(".docs-image").forEach((a) => {
    a.dataset.lightboxBound || (a.dataset.lightboxBound = "1", a.style.cursor = "zoom-in", a.addEventListener("click", () => {
      Ra(a.src, a.alt || a.title || "Documentation Image Preview");
    }));
  });
}
function lt(t, e) {
  t.dataset.mermaidDelegated || (t.dataset.mermaidDelegated = "1", t.addEventListener("click", (n) => {
    const i = n.target, o = i == null ? void 0 : i.closest(".mermaid-expand-btn");
    if (o) {
      n.preventDefault(), n.stopPropagation();
      const a = o.closest(".mermaid-wrapper"), l = a == null ? void 0 : a.querySelector(".mermaid-container svg");
      l && (e ? e(l, "Architecture & Flow Diagram") : ot(l, "Architecture & Flow Diagram"));
    }
  }), t.addEventListener("dblclick", (n) => {
    const i = n.target, o = i == null ? void 0 : i.closest(".mermaid-container");
    if (o) {
      n.preventDefault();
      const a = o.querySelector("svg");
      a && (e ? e(a, "Architecture & Flow Diagram") : ot(a, "Architecture & Flow Diagram"));
    }
  })), t.querySelectorAll(".mermaid-wrapper").forEach((n) => {
    var g;
    const i = n.querySelector(".mermaid-container");
    if (!i) return;
    const o = i.querySelector("svg");
    if (o) {
      const u = (g = o.viewBox) == null ? void 0 : g.baseVal;
      u && u.width > 600 && (o.style.minWidth = `${Math.max(u.width, 800)}px`);
    }
    za(i);
    const a = n.querySelector(".mermaid-expand-btn");
    a && !a.dataset.bound && (a.dataset.bound = "1", a.addEventListener("click", (u) => {
      u.preventDefault(), u.stopPropagation();
      const h = i.querySelector("svg");
      h && (e ? e(h, "Architecture & Flow Diagram") : ot(h, "Architecture & Flow Diagram"));
    })), i.dataset.dblBound || (i.dataset.dblBound = "1", i.addEventListener("dblclick", () => {
      const u = i.querySelector("svg");
      u && (e ? e(u, "Architecture & Flow Diagram") : ot(u, "Architecture & Flow Diagram"));
    }));
    const l = n.querySelector(".mermaid-source-btn"), s = n.querySelector(".mermaid-source-pane");
    l && s && !l.dataset.bound && (l.dataset.bound = "1", l.addEventListener("click", (u) => {
      u.preventDefault();
      const h = s.style.display !== "block";
      s.style.display = h ? "block" : "none", l.innerHTML = `<span>${h ? "Hide Source" : "View Source"}</span>`;
    }));
    const p = n.querySelector(".mermaid-copy-btn"), c = n.querySelector(".mermaid");
    p && c && !p.dataset.bound && (p.dataset.bound = "1", p.addEventListener("click", async (u) => {
      u.preventDefault();
      const h = c.dataset.rawSource ? decodeURIComponent(c.dataset.rawSource) : c.innerText;
      try {
        await navigator.clipboard.writeText(h), p.innerHTML = "<span>Copied!</span>", setTimeout(() => {
          p.innerHTML = "<span>Copy</span>";
        }, 2e3);
      } catch {
      }
    }));
  });
}
function Ea(t) {
  if (!t) return { meta: {}, body: "" };
  const e = t.match(/^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/);
  if (!e) return { meta: {}, body: t };
  const n = e[1], i = e[2], o = {};
  return n.split(/\r?\n/).forEach((a) => {
    const l = a.trim();
    if (!l || l.startsWith("#")) return;
    const s = a.indexOf(":");
    if (s === -1) return;
    const p = a.slice(0, s).trim();
    let c = a.slice(s + 1).trim();
    c.startsWith('"') && c.endsWith('"') || c.startsWith("'") && c.endsWith("'") ? c = c.slice(1, -1) : c.startsWith("[") && c.endsWith("]") && (c = c.slice(1, -1).split(",").map((g) => g.trim().replace(/^["']|["']$/g, "")).filter(Boolean)), o[p] = c;
  }), { meta: o, body: i };
}
function hr(t) {
  if (!t) return "";
  let e = t.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "");
  e = e.replace(/<!--\[endif\]-->/gi, "");
  const n = e.split(`
`);
  let i = !1;
  return n.map((a) => a.trim().startsWith("```") ? (i = !i, a) : (i || (a = a.replace(/^(\s*\d+\.)\s+\d+\.\s*/, "$1 "), a = a.replace(/^(\s*\d+\.)\s+\d+\.\*\*/, "$1 **"), a = a.replace(/\u00a0/g, " "), a = a.replace(/\*\*([^\*\n]+?)\*\*/g, (l, s) => {
    const p = s.trim();
    if (!p) return l;
    const c = /^\s/.test(s) ? " " : "", g = /\s$/.test(s) ? " " : "";
    return c + "**" + p + "**" + g;
  }), a = a.replace(new RegExp("(?<!\\*)\\*([^\\*\\n]+?)\\*(?!\\*)", "g"), (l, s) => {
    const p = s.trim();
    if (!p) return l;
    const c = /^\s/.test(s) ? " " : "", g = /\s$/.test(s) ? " " : "";
    return c + "*" + p + "*" + g;
  })), a)).join(`
`);
}
const Xt = ({
  content: t,
  url: e,
  metadata: n = {},
  title: i,
  author: o,
  date: a,
  category: l,
  tags: s,
  readingTime: p,
  imageUrl: c,
  description: g,
  short_description: u,
  textAlign: h = "justify",
  onBack: m,
  backLabel: f = "Back",
  showShare: y = !0,
  shareUrl: k,
  showRaw: v = !0,
  showToc: x = !1,
  headerExtra: b,
  footerExtra: w,
  className: I = "",
  style: T
}) => {
  const [C, M] = _(""), [W, P] = _(!!(e && !t)), [R, E] = _(null), [j, z] = _(!1), [O, $] = _(!1), [L, S] = _(!1), N = xe(null);
  Y(() => {
    if (!e || t) return;
    let K = !0;
    return P(!0), E(null), fetch(e).then((re) => {
      if (!re.ok) throw new Error(`Failed to load markdown: HTTP ${re.status}`);
      return re.text();
    }).then((re) => {
      K && (M(re), P(!1));
    }).catch((re) => {
      K && (E(re instanceof Error ? re.message : String(re)), P(!1));
    }), () => {
      K = !1;
    };
  }, [e, t]);
  const { parsedMeta: A, markdownBody: D } = ee(() => {
    const K = t !== void 0 ? t : C, { meta: re, body: ge } = Ea(K);
    return { parsedMeta: re, markdownBody: ge };
  }, [t, C]), V = i || n.title || n.heading || A.title || A.heading || "", B = o || n.author || A.author || "", H = a || n.date || A.date || A.createdAt || "", U = l || n.category || A.category || (Array.isArray(A.tags) && A.tags.length > 0 ? A.tags[0] : "") || "", G = ee(() => s && s.length > 0 ? s : n.tags && n.tags.length > 0 ? n.tags : Array.isArray(A.tags) ? A.tags : typeof A.tags == "string" ? [A.tags] : [], [s, n.tags, A.tags]), J = c || n.output_image || n.imageUrl || A.output_image || A.imageUrl || "", F = g || u || n.short_description || n.description || (typeof A.short_description == "string" ? A.short_description : void 0) || (typeof A.description == "string" ? A.description : void 0) || "", oe = k || (typeof window < "u" ? window.location.href : ""), ie = ee(() => J ? J.startsWith("http://") || J.startsWith("https://") ? J : typeof window < "u" ? `${window.location.origin}/${J.replace(/^\//, "")}` : J : "", [J]), ae = async () => {
    const K = F && F.trim() && F.trim() !== V.trim() ? `${V} - ${F.trim()}` : V;
    if (typeof navigator < "u" && typeof navigator.share == "function")
      try {
        await navigator.share({
          title: V,
          text: K,
          url: oe
        });
        return;
      } catch (re) {
        if (re && re.name === "AbortError")
          return;
      }
    z(!0);
  }, de = ee(() => hr(D), [D]), Be = ee(() => {
    if (!F.trim()) return "";
    try {
      const K = Z.parseInline(hr(F));
      return Ae(K);
    } catch {
      return Ae(F);
    }
  }, [F]), pe = ee(() => {
    if (p) return p;
    if (n.readingTime) return n.readingTime;
    if (A.readingTime) return A.readingTime;
    const K = (de || "").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(K / 200))} min read`;
  }, [p, n.readingTime, A.readingTime, de]), Se = ee(() => de.trim() ? xn(de) : "", [de]), et = ee(() => {
    if (!x || !de) return [];
    const K = de.split(`
`), re = [];
    return K.forEach((ge) => {
      if (ge.startsWith("## ") || ge.startsWith("### ")) {
        const Q = ge.startsWith("## ") ? 2 : 3, ue = ge.replace(/^#{2,3}\s+/, "").trim(), fe = ue.toLowerCase().replace(/[^\w]+/g, "-");
        re.push({ level: Q, text: ue, id: fe });
      }
    }), re;
  }, [x, de]);
  return Y(() => {
    N.current && yn(N.current);
  }, [Se]), W ? /* @__PURE__ */ r("div", { style: { textAlign: "center", padding: "60px 20px", color: "var(--eg-text-muted, #94a3b8)" }, children: /* @__PURE__ */ r("p", { style: { fontSize: "15px", fontWeight: 600 }, children: "Loading document..." }) }) : R ? /* @__PURE__ */ d(
    "div",
    {
      style: {
        padding: "24px",
        background: "rgba(239, 68, 68, 0.08)",
        border: "1px solid rgba(239, 68, 68, 0.25)",
        borderRadius: "10px",
        color: "var(--eg-color-danger, #ef4444)",
        margin: "20px 0"
      },
      children: [
        /* @__PURE__ */ r("p", { style: { fontWeight: 700, margin: "0 0 6px" }, children: "Failed to load Markdown document" }),
        /* @__PURE__ */ r("p", { style: { fontSize: "13.5px", margin: 0 }, children: R }),
        m && /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: m,
            style: {
              marginTop: "12px",
              background: "transparent",
              border: "none",
              color: "var(--eg-color-primary, #b8860b)",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0
            },
            children: [
              "← ",
              f
            ]
          }
        )
      ]
    }
  ) : /* @__PURE__ */ d(
    "article",
    {
      className: `eg-markdown-viewer ${I}`,
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "var(--eg-radius-lg, 14px)",
        padding: "clamp(16px, 3.5vw, 36px)",
        boxShadow: "var(--eg-shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06))",
        boxSizing: "border-box",
        maxWidth: "100%",
        overflow: "hidden",
        ...T
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px",
              flexWrap: "wrap",
              gap: "12px"
            },
            children: [
              m ? /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: m,
                  style: {
                    background: "transparent",
                    border: "none",
                    color: "var(--eg-color-primary, #b8860b)",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  },
                  children: [
                    /* @__PURE__ */ r("span", { children: "←" }),
                    /* @__PURE__ */ r("span", { children: f })
                  ]
                }
              ) : /* @__PURE__ */ r("div", {}),
              /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                y && /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    onClick: ae,
                    style: {
                      background: "transparent",
                      border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))",
                      color: "var(--eg-text-secondary, #475569)",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    },
                    children: [
                      /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("circle", { cx: "18", cy: "5", r: "3" }),
                        /* @__PURE__ */ r("circle", { cx: "6", cy: "12", r: "3" }),
                        /* @__PURE__ */ r("circle", { cx: "18", cy: "19", r: "3" }),
                        /* @__PURE__ */ r("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
                        /* @__PURE__ */ r("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: "Share" })
                    ]
                  }
                ),
                v && /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    onClick: () => $(!0),
                    style: {
                      background: "transparent",
                      border: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.12))",
                      color: "var(--eg-text-secondary, #475569)",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    },
                    title: "View raw Markdown source",
                    children: [
                      /* @__PURE__ */ d("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("polyline", { points: "16 18 22 12 16 6" }),
                        /* @__PURE__ */ r("polyline", { points: "8 6 2 12 8 18" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: "View Raw" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        (V || U || B || H) && /* @__PURE__ */ d(
          "header",
          {
            style: {
              marginBottom: "28px",
              borderBottom: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))",
              paddingBottom: "20px"
            },
            children: [
              (U || G.length > 0) && /* @__PURE__ */ d("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }, children: [
                U && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: U }),
                G.filter((K) => K.toLowerCase() !== U.toLowerCase()).map((K) => /* @__PURE__ */ d(ye, { variant: "neutral", size: "sm", children: [
                  "#",
                  K
                ] }, K))
              ] }),
              V && /* @__PURE__ */ r(
                "h1",
                {
                  style: {
                    fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
                    fontWeight: 800,
                    color: "var(--eg-text-primary, #0f172a)",
                    lineHeight: 1.3,
                    margin: "0 0 14px",
                    wordBreak: "break-word"
                  },
                  children: V
                }
              ),
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--eg-text-muted, #94a3b8)",
                    fontSize: "13.5px"
                  },
                  children: [
                    B && /* @__PURE__ */ d("span", { children: [
                      "By ",
                      /* @__PURE__ */ r("strong", { children: B })
                    ] }),
                    B && H && /* @__PURE__ */ r("span", { children: "•" }),
                    H && /* @__PURE__ */ r("span", { children: H }),
                    pe && /* @__PURE__ */ d(ce, { children: [
                      /* @__PURE__ */ r("span", { children: "•" }),
                      /* @__PURE__ */ r("span", { children: pe })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        J && /* @__PURE__ */ r(
          "div",
          {
            style: {
              marginBottom: "28px",
              borderRadius: "10px",
              overflow: "hidden",
              maxHeight: "420px",
              background: "var(--eg-bg-canvas, #f8fafc)"
            },
            children: /* @__PURE__ */ r(
              "img",
              {
                src: J,
                alt: V || "Featured",
                style: { width: "100%", height: "auto", display: "block", objectFit: "contain" },
                onError: (K) => {
                  K.currentTarget.parentElement.style.display = "none";
                }
              }
            )
          }
        ),
        Be && /* @__PURE__ */ r(
          "div",
          {
            className: "blog-description eg-article-description",
            style: {
              fontSize: "clamp(1.05rem, 0.92rem + 0.45vw, 1.18rem)",
              lineHeight: 1.8,
              color: "var(--eg-text-primary, #0f172a)",
              marginBottom: "22px",
              fontWeight: 500,
              letterSpacing: "0.01em",
              fontStyle: "normal",
              textAlign: h,
              textJustify: "inter-word"
            },
            dangerouslySetInnerHTML: { __html: Be }
          }
        ),
        et.length > 0 && /* @__PURE__ */ d(
          "nav",
          {
            style: {
              margin: "0 0 28px",
              padding: "16px 20px",
              background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.03))",
              borderRadius: "8px",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))"
            },
            children: [
              /* @__PURE__ */ r(
                "h4",
                {
                  style: {
                    margin: "0 0 10px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    color: "var(--eg-text-muted, #64748b)"
                  },
                  children: "Table of Contents"
                }
              ),
              /* @__PURE__ */ r("ul", { style: { margin: 0, paddingLeft: "18px", listStyleType: "disc" }, children: et.map((K) => /* @__PURE__ */ r(
                "li",
                {
                  style: {
                    marginLeft: K.level === 3 ? "16px" : "0",
                    marginBottom: "4px",
                    fontSize: "13.5px"
                  },
                  children: /* @__PURE__ */ r(
                    "a",
                    {
                      href: `#${K.id}`,
                      onClick: (re) => {
                        re.preventDefault();
                        const ge = document.getElementById(K.id);
                        ge && (ge.scrollIntoView({ behavior: "smooth", block: "start" }), typeof window < "u" && window.history.replaceState && window.history.replaceState(null, "", `#${K.id}`));
                      },
                      style: { color: "var(--eg-color-primary, #b8860b)", textDecoration: "none" },
                      children: K.text
                    }
                  )
                },
                K.id
              )) })
            ]
          }
        ),
        b,
        /* @__PURE__ */ r("style", { children: `
        .eg-article-markdown-body {
          word-break: break-word;
          overflow-wrap: break-word;
          max-width: 100%;
        }
        .eg-article-markdown-body h1,
        .eg-article-markdown-body h2,
        .eg-article-markdown-body h3,
        .eg-article-markdown-body h4 {
          color: var(--eg-text-primary, #0f172a);
          margin-top: 28px;
          margin-bottom: 12px;
          font-weight: 700;
          line-height: 1.35;
          scroll-margin-top: 80px;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .eg-article-markdown-body p,
        .eg-article-markdown-body li {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .blog-description,
        .eg-article-description {
          text-align: ${h};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body p {
          color: var(--eg-text-primary, #0f172a);
          line-height: 1.8;
          font-size: 15.5px;
          margin-bottom: 18px;
          text-align: ${h};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body ul,
        .eg-article-markdown-body ol {
          color: var(--eg-text-primary, #0f172a);
          margin: 14px 0 20px 24px;
          padding-left: 8px;
          line-height: 1.7;
        }
        .eg-article-markdown-body li {
          margin-bottom: 8px;
          text-align: left;
          line-height: 1.7;
        }
        .eg-article-markdown-body blockquote {
          margin: 20px 0;
          padding: 12px 20px;
          border-left: 4px solid var(--eg-color-primary, #b8860b);
          background: var(--eg-bg-subtle, rgba(0,0,0,0.03));
          border-radius: 0 8px 8px 0;
          text-align: ${h};
          text-align-last: left;
          text-justify: inter-word;
        }
        .eg-article-markdown-body table {
          display: block;
          width: 100%;
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-collapse: collapse;
          margin: 22px 0 26px 0;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15));
          border-radius: 8px;
        }
        .eg-article-markdown-body th,
        .eg-article-markdown-body td {
          padding: 11px 16px;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15));
          text-align: left;
          font-size: 14.5px;
        }
        .eg-article-markdown-body th {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.05));
          color: var(--eg-text-primary, #0f172a);
          font-weight: 700;
        }
        .eg-article-markdown-body td {
          color: var(--eg-text-primary, #0f172a);
        }
        .eg-article-markdown-body code:not(pre code) {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.06));
          color: var(--eg-color-primary, #b8860b);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
        }
        .eg-article-markdown-body blockquote {
          margin: 20px 0;
          padding: 12px 20px;
          border-left: 4px solid var(--eg-color-primary, #b8860b);
          background: var(--eg-bg-subtle, rgba(0,0,0,0.03));
          border-radius: 0 8px 8px 0;
        }
        .eg-article-markdown-body img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
        }

        /* GitHub Dark Syntax Highlighting */
        .eg-code-wrapper pre code.hljs {
          display: block;
          overflow-x: auto;
          background: #0d1117 !important;
          color: #e6edf3 !important;
        }
        .hljs-keyword,
        .hljs-operator {
          color: #ff7b72 !important;
          font-weight: 600;
        }
        .hljs-built_in,
        .hljs-type {
          color: #ffa657 !important;
        }
        .hljs-string,
        .hljs-regexp {
          color: #a5d6ff !important;
        }
        .hljs-comment,
        .hljs-quote {
          color: #8b949e !important;
          font-style: italic;
        }
        .hljs-number,
        .hljs-literal {
          color: #79c0ff !important;
        }
        .hljs-meta,
        .hljs-meta .hljs-keyword {
          color: #79c0ff !important;
          font-weight: 600;
        }
        .hljs-title,
        .hljs-title.function_,
        .hljs-title.class_ {
          color: #d2a8ff !important;
        }
        .hljs-attr,
        .hljs-attribute,
        .hljs-variable,
        .hljs-template-variable {
          color: #ffa657 !important;
        }
        .hljs-name,
        .hljs-tag,
        .hljs-selector-tag {
          color: #7ee787 !important;
        }
      ` }),
        /* @__PURE__ */ r(
          "div",
          {
            ref: N,
            className: "eg-article-markdown-body",
            dangerouslySetInnerHTML: { __html: Se }
          }
        ),
        w,
        m && /* @__PURE__ */ r("div", { style: { marginTop: "36px", paddingTop: "20px", borderTop: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))" }, children: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: m,
            style: {
              background: "transparent",
              border: "none",
              color: "var(--eg-color-primary, #b8860b)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            },
            children: [
              /* @__PURE__ */ r("span", { children: "←" }),
              /* @__PURE__ */ r("span", { children: f })
            ]
          }
        ) }),
        y && /* @__PURE__ */ r(
          qt,
          {
            isOpen: j,
            onClose: () => z(!1),
            title: V,
            url: oe,
            description: F,
            imageUrl: ie
          }
        ),
        v && O && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px"
            },
            onClick: () => $(!1),
            children: /* @__PURE__ */ d(
              "div",
              {
                style: {
                  width: "100%",
                  maxWidth: "840px",
                  maxHeight: "85vh",
                  background: "var(--eg-bg-surface, #ffffff)",
                  border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
                  borderRadius: "14px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                },
                onClick: (K) => K.stopPropagation(),
                children: [
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                        borderBottom: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                        fontWeight: 700,
                        fontSize: "14px"
                      },
                      children: [
                        /* @__PURE__ */ d("span", { children: [
                          "Raw Markdown Source (",
                          V || "Document",
                          ")"
                        ] }),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => $(!1),
                            style: {
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "inherit"
                            },
                            children: "✕"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ r("div", { style: { flex: 1, padding: "16px", overflowY: "auto" }, children: /* @__PURE__ */ r(
                    "textarea",
                    {
                      style: {
                        width: "100%",
                        height: "420px",
                        backgroundColor: "#090d16",
                        color: "#e2e8f0",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "12px",
                        fontFamily: "var(--eg-font-mono, monospace)",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        resize: "none",
                        boxSizing: "border-box"
                      },
                      readOnly: !0,
                      value: de
                    }
                  ) }),
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        padding: "12px 20px",
                        background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                        borderTop: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px"
                      },
                      children: [
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => $(!1),
                            style: {
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "1px solid var(--eg-border-default, rgba(0,0,0,0.2))",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: "Close"
                          }
                        ),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: async () => {
                              try {
                                await navigator.clipboard.writeText(de), S(!0), setTimeout(() => S(!1), 2e3);
                              } catch {
                              }
                            },
                            style: {
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "none",
                              background: "var(--eg-color-primary, #10b981)",
                              color: "#ffffff",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: L ? "Copied!" : "Copy Markdown"
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
}, os = Xt, ur = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='none'><rect width='200' height='120' fill='%231e293b'/><path d='M60 40h80M60 60h60M60 80h40' stroke='%2394a3b8' stroke-width='4' stroke-linecap='round'/><circle cx='155' cy='75' r='12' fill='%2338bdf8' opacity='0.7'/></svg>", Na = ({
  post: t,
  onSelect: e,
  showExcerpt: n = !1,
  fallbackImageUrl: i,
  className: o = "",
  style: a
}) => {
  const l = t.output_image || t.imageUrl || i || ur, s = t.category || (t.tags && t.tags.length > 0 ? t.tags[0] : "General"), p = t.short_description || t.description || "";
  return /* @__PURE__ */ d(
    "article",
    {
      className: `eg-blog-card ${o}`,
      onClick: () => e && e(t),
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "var(--eg-radius-lg, 12px)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: e ? "pointer" : "default",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))",
        ...a
      },
      onMouseEnter: (c) => {
        e && (c.currentTarget.style.transform = "translateY(-3px)", c.currentTarget.style.boxShadow = "var(--eg-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12))", c.currentTarget.style.borderColor = "var(--eg-color-primary, #b8860b)");
      },
      onMouseLeave: (c) => {
        e && (c.currentTarget.style.transform = "translateY(0)", c.currentTarget.style.boxShadow = "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))", c.currentTarget.style.borderColor = "var(--eg-border-default, rgba(0, 0, 0, 0.1))");
      },
      children: [
        /* @__PURE__ */ d("div", { children: [
          /* @__PURE__ */ r("div", { style: { width: "100%", height: "180px", overflow: "hidden", background: "var(--eg-bg-canvas, #f1f5f9)" }, children: /* @__PURE__ */ r(
            "img",
            {
              src: l,
              alt: t.title,
              loading: "lazy",
              onError: (c) => {
                c.currentTarget.onerror = null, c.currentTarget.src = i || ur;
              },
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.3s ease"
              }
            }
          ) }),
          /* @__PURE__ */ d("div", { style: { padding: "20px 20px 16px" }, children: [
            /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }, children: [
              /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: s }),
              /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "var(--eg-text-muted, #94a3b8)", fontWeight: 500 }, children: t.date })
            ] }),
            /* @__PURE__ */ r(
              "h3",
              {
                style: {
                  margin: "0",
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--eg-text-primary, #0f172a)",
                  lineHeight: 1.35,
                  wordBreak: "break-word"
                },
                children: t.title
              }
            ),
            n && p && /* @__PURE__ */ r(
              "p",
              {
                style: {
                  fontSize: "13.5px",
                  color: "var(--eg-text-secondary, #475569)",
                  lineHeight: 1.55,
                  marginTop: "10px",
                  marginBottom: "14px",
                  wordBreak: "break-word",
                  textAlign: "justify",
                  textJustify: "inter-word"
                },
                children: p
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              padding: "12px 20px 16px",
              borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "var(--eg-text-muted, #94a3b8)" }, children: t.readingTime || "2 min read" }),
              /* @__PURE__ */ d(
                "span",
                {
                  style: {
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--eg-color-primary, #b8860b)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  },
                  children: [
                    /* @__PURE__ */ r("span", { children: "Read more" }),
                    /* @__PURE__ */ r("span", { children: "→" })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}, as = ({
  post: t,
  onBack: e,
  textAlign: n = "justify",
  showToc: i = !0,
  showShare: o = !0,
  shareUrl: a,
  className: l = "",
  style: s
}) => {
  const p = xi(t), c = a || (typeof window < "u" ? `${window.location.origin}${window.location.pathname.endsWith(".html") ? "/blog.html" : "/blog"}?title=${p}` : ""), g = t.output_image || t.imageUrl || `assets/img/blog/id${t.id}.webp`;
  return /* @__PURE__ */ r(
    Xt,
    {
      content: t.content || t.full_description,
      url: !t.content && !t.full_description ? `data/blog/id${t.id}.md` : void 0,
      description: t.short_description || t.description,
      textAlign: n,
      showToc: i,
      showShare: o,
      shareUrl: c,
      imageUrl: g,
      metadata: {
        id: t.id,
        title: t.title || t.heading,
        author: t.author,
        date: t.date,
        category: t.category,
        tags: t.tags,
        readingTime: t.readingTime,
        imageUrl: g,
        output_image: g,
        short_description: t.short_description || t.description,
        description: t.description || t.short_description
      },
      onBack: e,
      backLabel: "Back to Blog Articles",
      className: l,
      style: s
    }
  );
}, ls = ({
  categories: t,
  recentPosts: e,
  selectedCategory: n,
  searchQuery: i = "",
  onSearchChange: o,
  onCategorySelect: a,
  onPostSelect: l
}) => /* @__PURE__ */ d("aside", { className: "eg-blog-sidebar", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
  o && /* @__PURE__ */ d(
    "div",
    {
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "12px",
        padding: "18px",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))"
      },
      children: [
        /* @__PURE__ */ r(
          "label",
          {
            htmlFor: "sidebarSearchInput",
            style: {
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--eg-text-muted, #64748b)",
              marginBottom: "10px"
            },
            children: "Search Blog"
          }
        ),
        /* @__PURE__ */ r(
          "input",
          {
            id: "sidebarSearchInput",
            type: "text",
            placeholder: "search blog here",
            value: i,
            onChange: (s) => o(s.target.value),
            style: {
              width: "100%",
              padding: "9px 14px",
              borderRadius: "8px",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
              background: "var(--eg-bg-surface, #ffffff)",
              color: "var(--eg-text-primary, #0f172a)",
              fontSize: "13.5px",
              outline: "none",
              boxSizing: "border-box"
            }
          }
        )
      ]
    }
  ),
  t && t.length > 0 && /* @__PURE__ */ d(
    "div",
    {
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "12px",
        padding: "18px",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))"
      },
      children: [
        /* @__PURE__ */ r(
          "h4",
          {
            style: {
              margin: "0 0 14px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--eg-text-muted, #64748b)"
            },
            children: "Categories"
          }
        ),
        /* @__PURE__ */ d("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }, children: [
          /* @__PURE__ */ r("li", { children: /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => a && a(null),
              style: {
                width: "100%",
                textAlign: "left",
                background: n ? "transparent" : "var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))",
                border: "none",
                borderRadius: "6px",
                padding: "7px 10px",
                fontSize: "13.5px",
                fontWeight: n ? 500 : 700,
                color: n ? "var(--eg-text-primary, #0f172a)" : "var(--eg-color-primary, #b8860b)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              },
              children: /* @__PURE__ */ r("span", { children: "All Topics" })
            }
          ) }),
          t.map((s) => {
            const p = (n == null ? void 0 : n.toLowerCase()) === s.name.toLowerCase();
            return /* @__PURE__ */ r("li", { children: /* @__PURE__ */ d(
              "button",
              {
                type: "button",
                onClick: () => a && a(s.name),
                style: {
                  width: "100%",
                  textAlign: "left",
                  background: p ? "var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  padding: "7px 10px",
                  fontSize: "13.5px",
                  fontWeight: p ? 700 : 500,
                  color: p ? "var(--eg-color-primary, #b8860b)" : "var(--eg-text-primary, #0f172a)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                },
                children: [
                  /* @__PURE__ */ r("span", { children: s.name }),
                  /* @__PURE__ */ r(
                    "span",
                    {
                      style: {
                        fontSize: "11px",
                        background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.06))",
                        padding: "2px 7px",
                        borderRadius: "999px",
                        color: "var(--eg-text-muted, #64748b)"
                      },
                      children: s.count
                    }
                  )
                ]
              }
            ) }, s.name);
          })
        ] })
      ]
    }
  ),
  e && e.length > 0 && /* @__PURE__ */ d(
    "div",
    {
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "12px",
        padding: "18px",
        boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))"
      },
      children: [
        /* @__PURE__ */ r(
          "h4",
          {
            style: {
              margin: "0 0 14px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--eg-text-muted, #64748b)"
            },
            children: "Recent Articles"
          }
        ),
        /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: e.slice(0, 5).map((s) => /* @__PURE__ */ r(
          "div",
          {
            onClick: () => l && l(s),
            style: {
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: l ? "pointer" : "default",
              textDecoration: "none"
            },
            children: /* @__PURE__ */ d("div", { style: { flex: "1 1 auto" }, children: [
              /* @__PURE__ */ r(
                "h5",
                {
                  style: {
                    margin: "0 0 4px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--eg-text-primary, #0f172a)",
                    lineHeight: 1.35
                  },
                  children: s.title
                }
              ),
              /* @__PURE__ */ r("span", { style: { fontSize: "11.5px", color: "var(--eg-text-muted, #94a3b8)" }, children: s.date })
            ] })
          },
          s.id
        )) })
      ]
    }
  )
] }), ss = ({
  posts: t,
  pageSize: e = 6,
  currentPage: n,
  showExcerpt: i = !1,
  fallbackImageUrl: o,
  onPageChange: a,
  onSelectPost: l
}) => {
  const [s, p] = _(1), c = n !== void 0 ? n : s, g = Math.max(1, Math.ceil(t.length / e)), u = (f) => {
    const y = Math.max(1, Math.min(g, f));
    a ? a(y) : p(y);
  }, h = ee(() => {
    const f = (c - 1) * e;
    return t.slice(f, f + e);
  }, [t, c, e]), m = ee(() => {
    if (g <= 5)
      return Array.from({ length: g }, (y, k) => k + 1);
    const f = [];
    return c <= 3 ? f.push(1, 2, 3, "...", g) : c >= g - 2 ? f.push(1, "...", g - 2, g - 1, g) : f.push(1, "...", c, "...", g), f;
  }, [g, c]);
  return /* @__PURE__ */ d("div", { children: [
    h.length === 0 ? /* @__PURE__ */ r("div", { style: { padding: "60px 20px", textAlign: "center", color: "var(--eg-text-muted, #94a3b8)" }, children: "No articles match your criteria." }) : /* @__PURE__ */ r(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
          gap: "clamp(16px, 2.5vw, 24px)"
        },
        children: h.map((f) => /* @__PURE__ */ r(
          Na,
          {
            post: f,
            showExcerpt: i,
            fallbackImageUrl: o,
            onSelect: l
          },
          f.id
        ))
      }
    ),
    g > 1 && /* @__PURE__ */ d(
      "div",
      {
        className: "eg-pagination-controls",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "32px"
        },
        children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: c === 1,
              onClick: () => u(c - 1),
              style: {
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--eg-border-default, rgba(0,0,0,0.12))",
                background: "var(--eg-bg-surface, #ffffff)",
                color: "var(--eg-text-primary, #0f172a)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: c === 1 ? "not-allowed" : "pointer",
                opacity: c === 1 ? 0.5 : 1
              },
              children: "« Prev"
            }
          ),
          m.map((f, y) => {
            if (f === "...")
              return /* @__PURE__ */ r(
                "span",
                {
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "24px",
                    height: "34px",
                    color: "var(--eg-text-muted, #94a3b8)",
                    fontWeight: 700,
                    userSelect: "none"
                  },
                  children: "…"
                },
                `ellipsis-${y}`
              );
            const k = Number(f), v = k === c;
            return /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => u(k),
                style: {
                  minWidth: "34px",
                  height: "34px",
                  padding: "0 8px",
                  borderRadius: "6px",
                  border: v ? "1px solid var(--eg-color-primary, #b8860b)" : "1px solid var(--eg-border-default, rgba(0,0,0,0.12))",
                  background: v ? "var(--eg-color-primary, #b8860b)" : "var(--eg-bg-surface, #ffffff)",
                  color: v ? "#ffffff" : "var(--eg-text-primary, #0f172a)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer"
                },
                children: k
              },
              k
            );
          }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: c === g,
              onClick: () => u(c + 1),
              style: {
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--eg-border-default, rgba(0,0,0,0.12))",
                background: "var(--eg-bg-surface, #ffffff)",
                color: "var(--eg-text-primary, #0f172a)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: c === g ? "not-allowed" : "pointer",
                opacity: c === g ? 0.5 : 1
              },
              children: "Next »"
            }
          )
        ]
      }
    )
  ] });
};
function Da(t) {
  if (t == null || isNaN(t) || t <= 0) return "";
  const e = ["B", "KB", "MB", "GB"], n = Math.floor(Math.log(t) / Math.log(1024));
  return `${(t / Math.pow(1024, n)).toFixed(n === 0 ? 0 : 1)} ${e[n] || "MB"}`;
}
function ja(t) {
  if (!t) return "Recent";
  try {
    const e = new Date(t);
    return isNaN(e.getTime()) ? t : e.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch {
    return t;
  }
}
function Pa(t) {
  const e = t.toLowerCase();
  return e.endsWith(".exe") || e.endsWith(".msi") || e.endsWith(".zip") && (e.includes("win") || e.includes("windows")) ? "windows" : e.endsWith(".appimage") || e.endsWith(".tar.gz") || e.endsWith(".deb") || e.endsWith(".rpm") ? "linux" : e.endsWith(".dmg") || e.endsWith(".zip") && (e.includes("mac") || e.includes("darwin")) ? "macos" : e.includes("checksum") || e.includes("sha256") || e.endsWith(".txt") || e.endsWith(".asc") ? "checksum" : e.endsWith(".zip") ? "windows" : "other";
}
function Ha(t) {
  if (!t) return [];
  const e = t.split(/\r?\n/), n = [];
  for (const i of e) {
    const o = i.trim(), a = o.match(/^[-*•]\s+(.*)$/) || o.match(/^\d+\.\s+(.*)$/);
    if (a && a[1]) {
      const l = a[1].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").trim();
      l.length > 5 && !l.startsWith("http") && n.push(l);
    }
    if (n.length >= 8) break;
  }
  return n;
}
function Fa(t) {
  const e = (t || "").trim().toUpperCase();
  return e.includes("ENHANC") ? "ENHANCEMENT" : e.includes("OPT") ? "OPTIMIZATION" : e.includes("FEAT") ? "FEATURE" : e.includes("BUG") || e.includes("FIX") || e.includes("REPAIR") ? "BUG-FIX" : e.includes("SEC") ? "SECURITY" : e.includes("APP") ? "APP" : e.includes("MAINT") ? "MAINTENANCE" : "ENHANCEMENT";
}
async function fr(t, e = {}) {
  const n = t.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, ""), i = n.replace(/[^a-zA-Z0-9_-]/g, "_"), o = e.cacheKey || `eg_gh_releases_${i}`, a = `${o}_time`, l = `eg_gh_ratelimit_${i}`, s = e.cacheTtlMs ?? 15 * 60 * 1e3;
  if (!e.forceRefresh && typeof window < "u") {
    try {
      const p = localStorage.getItem(a), c = localStorage.getItem(o);
      if (p && c && Date.now() - Number(p) < s) {
        const g = JSON.parse(c);
        if (Array.isArray(g) && g.length > 0)
          return g;
      }
    } catch {
    }
    try {
      const p = localStorage.getItem(l);
      if (p && Date.now() < Number(p)) {
        const c = localStorage.getItem(o);
        if (c) {
          const g = JSON.parse(c);
          if (Array.isArray(g) && g.length > 0) return g;
        }
      }
    } catch {
    }
  }
  try {
    const p = await fetch(`https://api.github.com/repos/${n}/releases`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });
    if (p.ok) {
      const c = await p.json();
      if (Array.isArray(c)) {
        const u = (e.filterPrereleases ? c.filter((h) => !h.prerelease) : c).map((h, m) => {
          const f = h.tag_name || "", y = f.replace(/^v/, ""), k = Ha(h.body), v = Array.isArray(h.assets) ? h.assets.map((w) => {
            const I = Pa(w.name), T = w.name.toLowerCase().endsWith(".exe") || w.name.toLowerCase().endsWith(".msi") || w.name.toLowerCase().endsWith(".dmg") || w.name.toLowerCase().endsWith(".appimage"), C = w.name.toLowerCase().endsWith(".zip") || w.name.toLowerCase().endsWith(".tar.gz");
            return {
              name: w.name,
              size: w.size,
              browser_download_url: w.browser_download_url,
              contentType: w.content_type,
              platform: I,
              isInstaller: T,
              isArchive: C
            };
          }) : [], x = n.split("/")[1] || n, b = (h.body || "").replace(/<!--[\s\S]*?-->/g, "").trim();
          return {
            id: String(h.id || f),
            version: y,
            title: h.name || `${x} ${f}`,
            date: ja(h.published_at || h.created_at),
            timestamp: h.published_at ? new Date(h.published_at).getTime() : Date.now(),
            type: "release",
            category: m === 0 ? "FEATURE" : "ENHANCEMENT",
            badge: m === 0 ? "Latest Release" : "Release",
            description: b ? b.slice(0, 260) + (b.length > 260 ? "..." : "") : `Official GitHub release for ${x} ${f}.`,
            highlights: k,
            link: h.html_url,
            linkText: "View on GitHub →",
            rawBody: b,
            assets: v,
            htmlUrl: h.html_url,
            isLatest: m === 0,
            prerelease: h.prerelease
          };
        });
        if (typeof window < "u" && u.length > 0)
          try {
            localStorage.setItem(o, JSON.stringify(u)), localStorage.setItem(a, String(Date.now())), localStorage.removeItem(l);
          } catch {
          }
        return u;
      }
    } else if ((p.status === 403 || p.status === 429) && typeof window < "u")
      try {
        localStorage.setItem(l, String(Date.now() + 15 * 60 * 1e3));
      } catch {
      }
  } catch (p) {
    console.warn(`[updatesService] Live GitHub releases fetch failed for ${n}:`, p);
  }
  if (typeof window < "u")
    try {
      const p = localStorage.getItem(o);
      if (p) {
        const c = JSON.parse(p);
        if (Array.isArray(c) && c.length > 0) return c;
      }
    } catch {
    }
  return [];
}
async function mr(t, e = {}) {
  try {
    const n = e.forceRefresh ? `${t}${t.includes("?") ? "&" : "?"}_t=${Date.now()}` : t, i = await fetch(n);
    if (!i.ok)
      throw new Error(`Failed to fetch updates JSON: HTTP ${i.status}`);
    const o = await i.json();
    return (Array.isArray(o) ? o : o && Array.isArray(o.updates) ? o.updates : []).map((l, s) => {
      const p = String(l.id || `update-${s}`), c = (l.type || "website").toLowerCase(), g = Fa(l.category || l.badge), u = typeof l.link == "string" && l.link.startsWith("http");
      let h = "Release Notes →";
      return c === "app" ? h = u ? "Open Application ↗" : "Open Application →" : c === "website" && (h = "Release Notes →"), {
        id: p,
        version: l.version ? String(l.version).replace(/^v/, "") : void 0,
        title: l.title || `Update ${p}`,
        date: l.date || "Recent",
        type: c,
        category: g,
        icon: l.icon || (g === "BUG-FIX" ? "tool" : g === "FEATURE" ? "star" : g === "OPTIMIZATION" ? "speedometer" : g === "APP" ? "grid" : "sparkles"),
        badge: l.badge || (s === 0 ? "New" : void 0),
        description: l.description || "",
        highlights: Array.isArray(l.highlights) ? l.highlights : void 0,
        link: l.link || "#",
        linkText: l.linkText || h,
        target: l.target,
        rawBody: l.rawBody || l.description,
        isLatest: s === 0
      };
    });
  } catch (n) {
    return console.warn(`[updatesService] Failed to load updates JSON from ${t}:`, n), [];
  }
}
async function Oa(t) {
  const { updatesUrl: e, githubRepo: n, preferGitHub: i = !1, cacheTtlMs: o, forceRefresh: a } = t;
  if (i && n) {
    const l = await fr(n, { cacheTtlMs: o, forceRefresh: a });
    return l.length > 0 ? l : e ? mr(e, { forceRefresh: a }) : [];
  }
  if (e) {
    const l = await mr(e, { forceRefresh: a });
    if (l.length > 0) return l;
  }
  return n ? fr(n, { cacheTtlMs: o, forceRefresh: a }) : [];
}
function Va(t, e) {
  const n = (t || e || "").toLowerCase();
  return n.includes("enhanc") || n.includes("spark") ? /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("path", { d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" }),
    /* @__PURE__ */ r("path", { d: "M20 3v4" }),
    /* @__PURE__ */ r("path", { d: "M22 5h-4" }),
    /* @__PURE__ */ r("path", { d: "M4 17v2" }),
    /* @__PURE__ */ r("path", { d: "M5 18H3" })
  ] }) : n.includes("opt") || n.includes("speed") || n.includes("gauge") ? /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("path", { d: "m12 14 4-4" }),
    /* @__PURE__ */ r("path", { d: "M3.34 19a10 10 0 1 1 17.32 0" })
  ] }) : n.includes("feat") || n.includes("star") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }) : n.includes("bug") || n.includes("fix") || n.includes("tool") || n.includes("wrench") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) }) : n.includes("app") || n.includes("grid") ? /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1.5" })
  ] }) : n.includes("sec") || n.includes("shield") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }) : /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] });
}
function Ua(t) {
  const e = (t || "").toUpperCase();
  return e.includes("ENHANC") ? { color: "#0284c7", bg: "rgba(2, 132, 199, 0.12)", border: "rgba(2, 132, 199, 0.28)" } : e.includes("OPT") ? { color: "#2563eb", bg: "rgba(37, 99, 235, 0.12)", border: "rgba(37, 99, 235, 0.28)" } : e.includes("FEAT") ? { color: "#d97706", bg: "rgba(217, 119, 6, 0.12)", border: "rgba(217, 119, 6, 0.28)" } : e.includes("BUG") || e.includes("FIX") ? { color: "#059669", bg: "rgba(5, 150, 105, 0.12)", border: "rgba(5, 150, 105, 0.28)" } : e.includes("SEC") ? { color: "#dc2626", bg: "rgba(220, 38, 38, 0.12)", border: "rgba(220, 38, 38, 0.28)" } : e.includes("APP") ? { color: "#7c3aed", bg: "rgba(124, 58, 237, 0.12)", border: "rgba(124, 58, 237, 0.28)" } : { color: "#64748b", bg: "rgba(100, 116, 139, 0.12)", border: "rgba(100, 116, 139, 0.28)" };
}
const cs = ({
  updates: t,
  title: e,
  subtitle: n,
  filterTabs: i,
  defaultFilter: o = "all",
  showFilterCounts: a = !0,
  showSearch: l = !0,
  searchPlaceholder: s = "Search updates & releases...",
  onNavigate: p,
  onUpdateClick: c,
  seenStorageKey: g = "eg_seen_updates",
  emptyMessage: u = "No updates found matching your criteria.",
  getActionLabel: h,
  className: m = "",
  style: f = {}
}) => {
  const [y, k] = _(o), [v, x] = _(""), b = ee(() => {
    if (i && i.length > 0) return i;
    const C = t.some((W) => (W.type || "").toLowerCase() === "website"), M = t.some((W) => (W.type || "").toLowerCase() === "app");
    return C || M ? [
      { id: "all", label: "All Updates", filter: () => !0 },
      { id: "website", label: "Website", filter: (W) => (W.type || "").toLowerCase() === "website" },
      { id: "app", label: "Apps", filter: (W) => (W.type || "").toLowerCase() === "app" }
    ] : [{ id: "all", label: "All Updates", filter: () => !0 }];
  }, [i, t]), w = ee(() => {
    const C = {};
    return b.forEach((M) => {
      M.id === "all" ? C[M.id] = t.length : M.filter ? C[M.id] = t.filter(M.filter).length : C[M.id] = t.filter((W) => (W.type || W.category || "").toLowerCase() === M.id.toLowerCase()).length;
    }), C;
  }, [b, t]), I = ee(() => {
    let C = t;
    const M = b.find((W) => W.id === y);
    if (M && M.id !== "all" && (M.filter ? C = C.filter(M.filter) : C = C.filter((W) => (W.type || W.category || "").toLowerCase() === M.id.toLowerCase())), v.trim()) {
      const W = v.toLowerCase();
      C = C.filter(
        (P) => P.title.toLowerCase().includes(W) || P.version && P.version.toLowerCase().includes(W) || P.description && P.description.toLowerCase().includes(W) || P.category && P.category.toLowerCase().includes(W) || Array.isArray(P.highlights) && P.highlights.some((R) => R.toLowerCase().includes(W))
      );
    }
    return C;
  }, [t, b, y, v]), T = te(
    (C, M) => {
      if (c && c(M), typeof window < "u" && M.id)
        try {
          const P = localStorage.getItem(g), R = P ? JSON.parse(P) : [];
          R.includes(M.id) || (R.push(M.id), localStorage.setItem(g, JSON.stringify(R)));
        } catch {
        }
      const W = M.link;
      W && !W.startsWith("http://") && !W.startsWith("https://") && p && (C.preventDefault(), p(W));
    },
    [p, c, g]
  );
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-updates-timeline-container ${m}`,
      style: {
        maxWidth: "920px",
        margin: "0 auto",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        ...f
      },
      children: [
        (e || n) && /* @__PURE__ */ d("div", { style: { textAlign: "center", marginBottom: "32px" }, children: [
          e && /* @__PURE__ */ r(
            "h1",
            {
              style: {
                fontSize: "var(--eg-text-3xl, 2.2rem)",
                fontWeight: 800,
                color: "var(--eg-text-primary, #0f172a)",
                margin: "0 0 10px",
                letterSpacing: "-0.5px"
              },
              children: e
            }
          ),
          n && /* @__PURE__ */ r(
            "p",
            {
              style: {
                fontSize: "var(--eg-text-base, 1rem)",
                color: "var(--eg-text-secondary, #64748b)",
                maxWidth: "680px",
                margin: "0 auto",
                lineHeight: 1.6
              },
              children: n
            }
          )
        ] }),
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "32px",
              background: "var(--eg-bg-surface, #ffffff)",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))",
              borderRadius: "var(--eg-radius-xl, 16px)",
              padding: "12px 18px",
              boxShadow: "var(--eg-shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.04))"
            },
            children: [
              /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, role: "tablist", children: b.map((C) => {
                const M = y === C.id, W = w[C.id];
                return /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": M,
                    onClick: () => k(C.id),
                    style: {
                      padding: "7px 15px",
                      borderRadius: "9999px",
                      fontSize: "13.5px",
                      fontWeight: M ? 700 : 600,
                      border: M ? "1px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                      background: M ? "var(--eg-color-primary, #10b981)" : "transparent",
                      color: M ? "#ffffff" : "var(--eg-text-secondary, #475569)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.18s ease",
                      boxShadow: M ? "0 2px 8px rgba(16, 185, 129, 0.28)" : "none"
                    },
                    children: [
                      /* @__PURE__ */ r("span", { children: C.label }),
                      a && W !== void 0 && /* @__PURE__ */ d(
                        "span",
                        {
                          style: {
                            fontSize: "11.5px",
                            opacity: M ? 0.92 : 0.65,
                            fontWeight: 600
                          },
                          children: [
                            "(",
                            W,
                            ")"
                          ]
                        }
                      )
                    ]
                  },
                  C.id
                );
              }) }),
              l && /* @__PURE__ */ d("div", { style: { position: "relative", minWidth: "220px", flex: "1 1 220px", maxWidth: "320px" }, children: [
                /* @__PURE__ */ d(
                  "svg",
                  {
                    width: "15",
                    height: "15",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "var(--eg-text-muted, #94a3b8)",
                    strokeWidth: "2.2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    style: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
                    children: [
                      /* @__PURE__ */ r("circle", { cx: "11", cy: "11", r: "8" }),
                      /* @__PURE__ */ r("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "text",
                    value: v,
                    onChange: (C) => x(C.target.value),
                    placeholder: s,
                    style: {
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: "8px",
                      border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
                      background: "var(--eg-bg-canvas, #f8fafc)",
                      color: "var(--eg-text-primary, #0f172a)",
                      fontSize: "13px",
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "border-color 0.15s ease"
                    }
                  }
                )
              ] })
            ]
          }
        ),
        I.length === 0 && /* @__PURE__ */ d(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "60px 20px",
              background: "var(--eg-bg-surface, #ffffff)",
              borderRadius: "16px",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))",
              color: "var(--eg-text-muted, #94a3b8)"
            },
            children: [
              /* @__PURE__ */ d("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", style: { margin: "0 auto 12px", opacity: 0.5 }, children: [
                /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ r("line", { x1: "8", y1: "12", x2: "16", y2: "12" })
              ] }),
              /* @__PURE__ */ r("p", { style: { margin: 0, fontSize: "15px", fontWeight: 600 }, children: u })
            ]
          }
        ),
        /* @__PURE__ */ d("div", { style: { position: "relative", paddingLeft: "32px" }, children: [
          I.length > 0 && /* @__PURE__ */ r(
            "div",
            {
              style: {
                position: "absolute",
                left: "12px",
                top: "12px",
                bottom: "24px",
                width: "2px",
                background: "var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                zIndex: 0
              }
            }
          ),
          I.map((C, M) => {
            const W = Ua(C.category || C.badge), P = Va(C.category, C.icon), R = !!(C.link && C.link.startsWith("http"));
            let E = C.linkText;
            if (h)
              E = h(C);
            else if (!E) {
              const j = (C.type || "").toLowerCase();
              j === "app" ? E = R ? "Open Application ↗" : "Open Application →" : j === "website" ? E = "Release Notes →" : E = R ? "View on GitHub →" : "View Details →";
            }
            return /* @__PURE__ */ d(
              "article",
              {
                id: C.version ? `v-${C.version}` : void 0,
                style: {
                  position: "relative",
                  marginBottom: "36px",
                  zIndex: 1
                },
                children: [
                  /* @__PURE__ */ r(
                    "div",
                    {
                      style: {
                        position: "absolute",
                        left: "-32px",
                        top: "16px",
                        width: "26px",
                        height: "26px",
                        borderRadius: "50%",
                        background: W.bg,
                        color: W.color,
                        border: `2px solid ${W.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 0 4px var(--eg-bg-canvas, #f8fafc)",
                        zIndex: 2
                      },
                      children: /* @__PURE__ */ r("div", { style: { transform: "scale(0.65)" }, children: P })
                    }
                  ),
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        background: "var(--eg-bg-surface, #ffffff)",
                        border: C.isLatest ? "1.5px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))",
                        borderRadius: "var(--eg-radius-xl, 16px)",
                        padding: "24px 28px",
                        boxShadow: C.isLatest ? "0 6px 20px rgba(16, 185, 129, 0.08)" : "var(--eg-shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.03))",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
                      },
                      children: [
                        /* @__PURE__ */ d(
                          "div",
                          {
                            style: {
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "12px",
                              marginBottom: "14px",
                              paddingBottom: "12px",
                              borderBottom: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.06))"
                            },
                            children: [
                              /* @__PURE__ */ d("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }, children: [
                                /* @__PURE__ */ r(
                                  "span",
                                  {
                                    style: {
                                      padding: "3px 10px",
                                      borderRadius: "6px",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.6px",
                                      color: W.color,
                                      background: W.bg,
                                      border: `1px solid ${W.border}`
                                    },
                                    children: C.category || "UPDATE"
                                  }
                                ),
                                C.version && /* @__PURE__ */ d(
                                  "span",
                                  {
                                    style: {
                                      fontSize: "14px",
                                      fontWeight: 800,
                                      color: "var(--eg-text-primary, #0f172a)",
                                      letterSpacing: "-0.2px"
                                    },
                                    children: [
                                      "v",
                                      C.version
                                    ]
                                  }
                                ),
                                C.isLatest && /* @__PURE__ */ r(ye, { variant: "success", size: "sm", children: "Latest Release" }),
                                C.type && /* @__PURE__ */ d(
                                  "span",
                                  {
                                    style: {
                                      fontSize: "11.5px",
                                      fontWeight: 600,
                                      color: "var(--eg-text-muted, #94a3b8)",
                                      textTransform: "capitalize"
                                    },
                                    children: [
                                      "• ",
                                      C.type === "website" ? "Core Website" : C.type === "app" ? "Application" : C.type
                                    ]
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ d(
                                "time",
                                {
                                  style: {
                                    fontSize: "12.5px",
                                    color: "var(--eg-text-muted, #94a3b8)",
                                    fontWeight: 500,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px"
                                  },
                                  children: [
                                    /* @__PURE__ */ d("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                                      /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                                      /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                                      /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                                      /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                                    ] }),
                                    C.date
                                  ]
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ r(
                          "h3",
                          {
                            style: {
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color: "var(--eg-text-primary, #0f172a)",
                              margin: "0 0 10px",
                              lineHeight: 1.4
                            },
                            children: C.title
                          }
                        ),
                        C.description && /* @__PURE__ */ r(
                          "p",
                          {
                            style: {
                              fontSize: "14px",
                              color: "var(--eg-text-secondary, #475569)",
                              lineHeight: 1.65,
                              margin: "0 0 16px"
                            },
                            children: C.description
                          }
                        ),
                        Array.isArray(C.highlights) && C.highlights.length > 0 && /* @__PURE__ */ r(
                          "div",
                          {
                            style: {
                              background: "var(--eg-bg-canvas, rgba(0, 0, 0, 0.02))",
                              borderRadius: "8px",
                              padding: "12px 18px",
                              marginBottom: "16px",
                              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.05))"
                            },
                            children: /* @__PURE__ */ r(
                              "ul",
                              {
                                style: {
                                  margin: 0,
                                  paddingLeft: "16px",
                                  fontSize: "13.5px",
                                  color: "var(--eg-text-secondary, #475569)",
                                  lineHeight: 1.7,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px"
                                },
                                children: C.highlights.map((j, z) => /* @__PURE__ */ r("li", { children: j }, z))
                              }
                            )
                          }
                        ),
                        Array.isArray(C.assets) && C.assets.length > 0 && /* @__PURE__ */ d(
                          "div",
                          {
                            style: {
                              background: "var(--eg-bg-canvas, rgba(0, 0, 0, 0.02))",
                              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))",
                              borderRadius: "10px",
                              padding: "10px 14px",
                              marginBottom: "16px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: "8px"
                            },
                            children: [
                              /* @__PURE__ */ d("span", { style: { fontSize: "12px", fontWeight: 700, color: "var(--eg-text-muted, #94a3b8)" }, children: [
                                "Download Binaries (",
                                C.version ? `v${C.version}` : "Release",
                                "):"
                              ] }),
                              /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" }, children: C.assets.map((j) => {
                                const z = Da(j.size), $ = j.platform === "windows" ? "primary" : j.platform === "checksum" ? "neutral" : "info";
                                return /* @__PURE__ */ r(
                                  "a",
                                  {
                                    href: ne(j.browser_download_url),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    style: { textDecoration: "none" },
                                    children: /* @__PURE__ */ d(ye, { variant: $, size: "sm", children: [
                                      /* @__PURE__ */ r("span", { children: j.name }),
                                      z && /* @__PURE__ */ d("span", { style: { opacity: 0.75, fontSize: "10.5px" }, children: [
                                        "(",
                                        z,
                                        ")"
                                      ] })
                                    ] })
                                  },
                                  j.name
                                );
                              }) })
                            ]
                          }
                        ),
                        C.link && /* @__PURE__ */ r("div", { style: { display: "flex", justifyContent: "flex-start", marginTop: "12px" }, children: /* @__PURE__ */ r(
                          "a",
                          {
                            href: ne(C.link),
                            target: R ? "_blank" : void 0,
                            rel: R ? "noopener noreferrer" : void 0,
                            onClick: (j) => T(j, C),
                            style: { textDecoration: "none" },
                            children: /* @__PURE__ */ r(Wt, { variant: "secondary", size: "sm", children: E })
                          }
                        ) })
                      ]
                    }
                  )
                ]
              },
              C.id || M
            );
          })
        ] })
      ]
    }
  );
}, ds = ({
  articles: t,
  defaultArticleId: e,
  className: n = "",
  style: i = {}
}) => {
  var O;
  const [o, a] = _(e || ((O = t[0]) == null ? void 0 : O.id) || ""), [l, s] = _(""), [p, c] = _({}), [g, u] = _(!1), [h, m] = _(!1), [f, y] = _(!1), [k, v] = _(null), x = xe(null), b = ($) => {
    v($), setTimeout(() => v(null), 2500);
  };
  Y(() => {
    const $ = () => {
      window.innerWidth > 900 && y(!1);
    };
    return window.addEventListener("resize", $), () => window.removeEventListener("resize", $);
  }, []), Y(() => {
    const $ = (L) => {
      L.key === "Escape" && (y(!1), m(!1));
    };
    return window.addEventListener("keydown", $), () => window.removeEventListener("keydown", $);
  }, []), Y(() => {
    if (f) {
      const $ = document.body.style.overflow;
      return document.body.style.overflow = "hidden", () => {
        document.body.style.overflow = $;
      };
    }
  }, [f]);
  const w = ee(() => {
    const $ = {};
    return t.forEach((L) => {
      const S = L.category || "General";
      $[S] || ($[S] = []), $[S].push(L);
    }), $;
  }, [t]), I = t.findIndex(($) => $.id === o), T = t[I] || t[0], C = I > 0 ? t[I - 1] : null, M = I < t.length - 1 ? t[I + 1] : null, W = ee(() => {
    if (!(T != null && T.content)) return [];
    const $ = T.content.split(`
`), L = [];
    return $.forEach((S) => {
      if (S.startsWith("## ") || S.startsWith("### ")) {
        const N = S.startsWith("## ") ? 2 : 3, A = S.replace(/^#{2,3}\s+/, "").trim(), D = A.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
        L.push({ level: N, text: A, id: D });
      }
    }), L;
  }, [T]), P = ee(() => T != null && T.content ? Ae(xn(T.content)) : "", [T]);
  Y(() => {
    yn(x.current);
  }, [P, o]);
  const R = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href), b("Documentation link copied to clipboard!");
    } catch {
      b("Failed to copy link.");
    }
  }, E = async () => {
    if (T)
      try {
        await navigator.clipboard.writeText(T.content), u(!0), b("Raw markdown copied to clipboard!"), setTimeout(() => u(!1), 2e3);
      } catch {
        b("Failed to copy raw markdown.");
      }
  }, j = ($) => {
    c((L) => ({ ...L, [$]: !L[$] }));
  }, z = ($) => /* @__PURE__ */ d(ce, { children: [
    /* @__PURE__ */ r("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        placeholder: "Search documentation...",
        value: l,
        onChange: (L) => s(L.target.value),
        style: {
          width: "100%",
          padding: "9px 12px",
          borderRadius: "6px",
          border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
          background: "var(--eg-bg-input, #ffffff)",
          color: "inherit",
          fontSize: "13px",
          outline: "none",
          boxSizing: "border-box"
        }
      }
    ) }),
    /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: Object.entries(w).map(([L, S]) => {
      const N = S.filter(
        (D) => D.title.toLowerCase().includes(l.toLowerCase()) || D.category.toLowerCase().includes(l.toLowerCase()) || D.tags && D.tags.some((V) => V.toLowerCase().includes(l.toLowerCase()))
      );
      if (N.length === 0) return null;
      const A = p[L];
      return /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: () => j(L),
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              background: "transparent",
              border: "none",
              padding: "4px 0",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "var(--eg-text-muted, #94a3b8)",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ r("span", { children: L }),
              /* @__PURE__ */ r("span", { style: { fontSize: "10px" }, children: A ? "▶" : "▼" })
            ]
          }
        ),
        !A && /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "3px", marginTop: "6px" }, children: N.map((D) => {
          const V = D.id === o;
          return /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              onClick: () => {
                a(D.id), $ && y(!1), window.scrollTo({ top: 0, behavior: "smooth" });
              },
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid transparent",
                background: V ? "rgba(16, 185, 129, 0.12)" : "transparent",
                color: V ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #475569)",
                fontWeight: V ? 600 : 500,
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease"
              },
              children: [
                /* @__PURE__ */ r("span", { children: D.title }),
                D.readingTime && /* @__PURE__ */ r("span", { style: { fontSize: "10px", opacity: 0.7 }, children: D.readingTime })
              ]
            },
            D.id
          );
        }) })
      ] }, L);
    }) })
  ] });
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-docs-viewer-root ${n}`.trim(),
      style: i,
      children: [
        f && /* @__PURE__ */ r(
          "div",
          {
            className: "eg-docs-drawer-backdrop",
            onClick: () => y(!1),
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 99990
            }
          }
        ),
        /* @__PURE__ */ d(
          "aside",
          {
            className: `eg-docs-mobile-drawer ${f ? "open" : ""}`,
            style: {
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "min(340px, 86vw)",
              maxWidth: "360px",
              background: "var(--eg-bg-surface, #ffffff)",
              borderRight: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.45)",
              zIndex: 99995,
              display: f ? "flex" : "none",
              flexDirection: "column",
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 18px",
                    borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
                    background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.02))"
                  },
                  children: [
                    /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ r("span", { style: { fontSize: "18px" }, children: "📑" }),
                      /* @__PURE__ */ r("span", { style: { fontWeight: 800, fontSize: "15px", color: "var(--eg-text-primary, #0f172a)" }, children: "Documentation" })
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => y(!1),
                        "aria-label": "Close navigation",
                        style: {
                          background: "transparent",
                          border: "none",
                          fontSize: "18px",
                          cursor: "pointer",
                          color: "var(--eg-text-secondary, #64748b)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        },
                        children: "✕"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ d("div", { style: { flex: 1, overflowY: "auto", padding: "16px 18px", boxSizing: "border-box" }, children: [
                z(!0),
                W.length > 0 && /* @__PURE__ */ d("div", { style: { marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))" }, children: [
                  /* @__PURE__ */ r(
                    "h5",
                    {
                      style: {
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "var(--eg-text-muted, #94a3b8)",
                        margin: "0 0 10px"
                      },
                      children: "On This Page"
                    }
                  ),
                  /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: W.map(($, L) => /* @__PURE__ */ r(
                    "a",
                    {
                      href: `#${$.id}`,
                      onClick: () => y(!1),
                      style: {
                        fontSize: $.level === 2 ? "12.5px" : "11.5px",
                        padding: "4px 8px",
                        paddingLeft: $.level === 2 ? "8px" : "18px",
                        color: "var(--eg-text-secondary, #64748b)",
                        textDecoration: "none",
                        lineHeight: 1.4,
                        borderRadius: "4px"
                      },
                      children: $.text
                    },
                    L
                  )) })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r(
          "aside",
          {
            className: "eg-docs-desktop-sidebar",
            style: {
              background: "var(--eg-bg-surface, #ffffff)",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
              borderRadius: "var(--eg-radius-lg, 12px)",
              padding: "18px 16px",
              position: "sticky",
              top: "84px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))"
            },
            children: z(!1)
          }
        ),
        /* @__PURE__ */ r(
          "main",
          {
            style: {
              background: "var(--eg-bg-surface, #ffffff)",
              border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
              borderRadius: "var(--eg-radius-lg, 12px)",
              padding: "clamp(20px, 3.5vw, 48px)",
              minHeight: "600px",
              boxShadow: "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
              minWidth: 0
            },
            children: T ? /* @__PURE__ */ d("div", { children: [
              /* @__PURE__ */ r("div", { className: "eg-docs-mobile-bar", style: { display: "none", marginBottom: "18px" }, children: /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  onClick: () => y(!0),
                  "aria-label": "Open documentation navigation menu",
                  style: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
                    background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                    color: "var(--eg-text-primary, #0f172a)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    textAlign: "left",
                    gap: "10px",
                    boxShadow: "var(--eg-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.04))",
                    boxSizing: "border-box"
                  },
                  children: [
                    /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0, overflow: "hidden" }, children: [
                      /* @__PURE__ */ d("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { color: "var(--eg-color-primary, #10b981)", flexShrink: 0 }, children: [
                        /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                      ] }),
                      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }, children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--eg-text-muted, #94a3b8)", flexShrink: 0, fontWeight: 700 }, children: "Topic:" }),
                        /* @__PURE__ */ r("span", { style: { fontWeight: 700, color: "var(--eg-color-primary, #10b981)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: (T == null ? void 0 : T.title) || "Select Article" })
                      ] })
                    ] }),
                    /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "var(--eg-text-secondary, #475569)", flexShrink: 0 }, children: [
                      /* @__PURE__ */ r("span", { children: "Menu" }),
                      /* @__PURE__ */ r("span", { style: { fontSize: "10px" }, children: "▼" })
                    ] })
                  ]
                }
              ) }),
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    paddingBottom: "16px",
                    marginBottom: "24px",
                    borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))"
                  },
                  children: [
                    /* @__PURE__ */ d(
                      "div",
                      {
                        style: {
                          fontSize: "12.5px",
                          color: "var(--eg-text-muted, #94a3b8)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        },
                        children: [
                          /* @__PURE__ */ r("span", { children: "Docs" }),
                          /* @__PURE__ */ r("span", { children: "/" }),
                          /* @__PURE__ */ r("span", { children: T.category }),
                          /* @__PURE__ */ r("span", { children: "/" }),
                          /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-primary, #10b981)", fontWeight: 600 }, children: T.title })
                        ]
                      }
                    ),
                    /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ d(
                        "button",
                        {
                          type: "button",
                          onClick: R,
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
                            background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                            color: "var(--eg-text-secondary, #475569)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          title: "Copy link to document",
                          children: [
                            /* @__PURE__ */ d("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                              /* @__PURE__ */ r("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
                            ] }),
                            /* @__PURE__ */ r("span", { children: "Share" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ d(
                        "button",
                        {
                          type: "button",
                          onClick: () => m(!0),
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.15))",
                            background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                            color: "var(--eg-text-secondary, #475569)",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer"
                          },
                          title: "View raw Markdown source",
                          children: [
                            /* @__PURE__ */ d("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("polyline", { points: "16 18 22 12 16 6" }),
                              /* @__PURE__ */ r("polyline", { points: "8 6 2 12 8 18" })
                            ] }),
                            /* @__PURE__ */ r("span", { children: "View Raw" })
                          ]
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ r(
                "div",
                {
                  ref: x,
                  className: "eg-markdown-content",
                  dangerouslySetInnerHTML: { __html: P },
                  style: {
                    fontSize: "15.5px",
                    lineHeight: 1.75,
                    color: "var(--eg-text-secondary, #334155)"
                  }
                }
              ),
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    marginTop: "48px",
                    paddingTop: "24px",
                    borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px"
                  },
                  children: [
                    C ? /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          a(C.id), window.scrollTo({ top: 0, behavior: "smooth" });
                        },
                        style: {
                          padding: "12px 18px",
                          borderRadius: "8px",
                          border: "1px solid var(--eg-border-default, rgba(0,0,0,0.1))",
                          background: "transparent",
                          cursor: "pointer",
                          textAlign: "left"
                        },
                        children: [
                          /* @__PURE__ */ r("div", { style: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }, children: "← Previous" }),
                          /* @__PURE__ */ r("div", { style: { fontSize: "13.5px", fontWeight: 700, color: "var(--eg-color-primary, #10b981)" }, children: C.title })
                        ]
                      }
                    ) : /* @__PURE__ */ r("div", {}),
                    M ? /* @__PURE__ */ d(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          a(M.id), window.scrollTo({ top: 0, behavior: "smooth" });
                        },
                        style: {
                          padding: "12px 18px",
                          borderRadius: "8px",
                          border: "1px solid var(--eg-border-default, rgba(0,0,0,0.1))",
                          background: "transparent",
                          cursor: "pointer",
                          textAlign: "right"
                        },
                        children: [
                          /* @__PURE__ */ r("div", { style: { fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }, children: "Next →" }),
                          /* @__PURE__ */ r("div", { style: { fontSize: "13.5px", fontWeight: 700, color: "var(--eg-color-primary, #10b981)" }, children: M.title })
                        ]
                      }
                    ) : /* @__PURE__ */ r("div", {})
                  ]
                }
              )
            ] }) : /* @__PURE__ */ r("p", { style: { color: "var(--eg-text-muted, #94a3b8)" }, children: "No article selected." })
          }
        ),
        /* @__PURE__ */ d(
          "aside",
          {
            className: "eg-docs-toc",
            style: {
              position: "sticky",
              top: "84px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              padding: "8px 12px"
            },
            children: [
              /* @__PURE__ */ r(
                "h5",
                {
                  style: {
                    fontSize: "11.5px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "var(--eg-text-muted, #94a3b8)",
                    margin: "0 0 12px"
                  },
                  children: "On This Page"
                }
              ),
              W.length === 0 ? /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#94a3b8" }, children: "Overview" }) : /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: W.map(($, L) => /* @__PURE__ */ r(
                "a",
                {
                  href: `#${$.id}`,
                  style: {
                    fontSize: $.level === 2 ? "12.5px" : "11.5px",
                    paddingLeft: $.level === 2 ? "0px" : "12px",
                    color: "var(--eg-text-secondary, #64748b)",
                    textDecoration: "none",
                    lineHeight: 1.4,
                    transition: "color 0.15s ease"
                  },
                  onMouseEnter: (S) => S.currentTarget.style.color = "var(--eg-color-primary, #10b981)",
                  onMouseLeave: (S) => S.currentTarget.style.color = "var(--eg-text-secondary, #64748b)",
                  children: $.text
                },
                L
              )) })
            ]
          }
        ),
        h && T && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px"
            },
            onClick: () => m(!1),
            children: /* @__PURE__ */ d(
              "div",
              {
                style: {
                  width: "100%",
                  maxWidth: "840px",
                  maxHeight: "85vh",
                  background: "var(--eg-bg-surface, #ffffff)",
                  border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.12))",
                  borderRadius: "14px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.35)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                },
                onClick: ($) => $.stopPropagation(),
                children: [
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                        borderBottom: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                        fontWeight: 700,
                        fontSize: "14px"
                      },
                      children: [
                        /* @__PURE__ */ d("span", { children: [
                          "Raw Markdown Source (",
                          T.title,
                          ")"
                        ] }),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => m(!1),
                            style: {
                              background: "transparent",
                              border: "none",
                              fontSize: "16px",
                              cursor: "pointer",
                              color: "inherit"
                            },
                            children: "✕"
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ r("div", { style: { flex: 1, padding: "16px", overflowY: "auto" }, children: /* @__PURE__ */ r(
                    "textarea",
                    {
                      style: {
                        width: "100%",
                        height: "420px",
                        backgroundColor: "#090d16",
                        color: "#e2e8f0",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                        padding: "12px",
                        fontFamily: "var(--eg-font-mono, monospace)",
                        fontSize: "13px",
                        lineHeight: 1.5,
                        resize: "none",
                        boxSizing: "border-box"
                      },
                      readOnly: !0,
                      value: T.content
                    }
                  ) }),
                  /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        padding: "12px 20px",
                        background: "var(--eg-bg-subtle, rgba(0, 0, 0, 0.04))",
                        borderTop: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px"
                      },
                      children: [
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => m(!1),
                            style: {
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "1px solid var(--eg-border-default, rgba(0,0,0,0.2))",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: "Close"
                          }
                        ),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: E,
                            style: {
                              padding: "6px 14px",
                              borderRadius: "6px",
                              border: "none",
                              background: "var(--eg-color-primary, #10b981)",
                              color: "#ffffff",
                              fontWeight: 600,
                              cursor: "pointer",
                              fontSize: "13px"
                            },
                            children: g ? "Copied!" : "Copy Markdown"
                          }
                        )
                      ]
                    }
                  )
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: () => y(!0),
            className: "eg-docs-floating-menu-btn",
            "aria-label": "Open documentation topics",
            children: [
              /* @__PURE__ */ d("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
              ] }),
              /* @__PURE__ */ r("span", { children: "Topics" })
            ]
          }
        ),
        k && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "var(--eg-bg-surface-elevated, #1e293b)",
              border: "1px solid var(--eg-color-primary, #10b981)",
              color: "var(--eg-color-primary, #10b981)",
              padding: "10px 18px",
              borderRadius: "8px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              fontSize: "13px",
              fontWeight: 600,
              zIndex: 999999
            },
            children: k
          }
        )
      ]
    }
  );
};
function Ga() {
  const t = ["+", "-", "*"], e = t[Math.floor(Math.random() * t.length)];
  let n = Math.floor(Math.random() * 9) + 1, i = Math.floor(Math.random() * 9) + 1;
  if (e === "-" && n < i) {
    const l = n;
    n = i, i = l;
  }
  let o = 0;
  return e === "+" ? o = n + i : e === "-" ? o = n - i : e === "*" && (o = n * i), {
    num1: n,
    num2: i,
    op: e,
    expected: o,
    prompt: `What is ${n} ${{ "+": "+", "-": "−", "*": "×" }[e]} ${i}?`
  };
}
function $e(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e ^= t.charCodeAt(n), e = Math.imul(e, 16777619);
  return (e >>> 0).toString(16);
}
function Je() {
  if (typeof window > "u") return "unknown_machine";
  try {
    let t = "";
    try {
      t = localStorage.getItem("eg_client_guid") || sessionStorage.getItem("eg_client_guid") || "", t || (t = "cg_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36), localStorage.setItem("eg_client_guid", t), sessionStorage.setItem("eg_client_guid", t));
    } catch {
    }
    const e = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}` : "", n = typeof Intl < "u" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "", i = [
      navigator.userAgent || "",
      navigator.platform || "",
      navigator.language || "",
      e,
      n,
      navigator.hardwareConcurrency || "",
      t
    ].join("###");
    return $e(i);
  } catch {
    return "fallback_machine";
  }
}
function qa(t) {
  return t ? t.replace(/^angle\s*\([^,]*,\s*/i, "").replace(/,\s*opengl\s*[\d.]*\s*\)$/i, "").replace(/\b(direct3d\d*|opengl|vs_\d_\d|ps_\d_\d|d3d\d*|\/pcie\/sse\d*)\b/gi, "").replace(/\([rR]\)|\([tT][mM]\)|[®™]/g, "").replace(/[(),]/g, " ").replace(/\s+/g, " ").trim().toLowerCase() : "";
}
function Xe() {
  if (typeof window > "u") return "unknown_core_hardware";
  try {
    const t = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}` : "", e = typeof Intl < "u" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "", n = (/* @__PURE__ */ new Date()).getTimezoneOffset(), i = typeof navigator < "u" ? (navigator.platform || "").replace(/\s+/g, "").toLowerCase() : "", o = typeof navigator < "u" && navigator.hardwareConcurrency || 0, a = typeof navigator < "u" && navigator.maxTouchPoints || 0, l = [t, e, n, i, o, a].join("###");
    return $e(l);
  } catch {
    return "fallback_core_hardware";
  }
}
function Qe() {
  if (typeof window > "u") return "unknown_hardware";
  try {
    const t = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}` : "", e = typeof Intl < "u" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "", n = (/* @__PURE__ */ new Date()).getTimezoneOffset(), i = typeof navigator < "u" ? (navigator.platform || "").replace(/\s+/g, "").toLowerCase() : "", o = typeof navigator < "u" && navigator.hardwareConcurrency || 0, a = typeof navigator < "u" && navigator.maxTouchPoints || 0;
    let l = "";
    try {
      if (typeof document < "u") {
        const p = document.createElement("canvas"), c = p.getContext("webgl") || p.getContext("experimental-webgl");
        if (c) {
          const g = c.getExtension("WEBGL_debug_renderer_info");
          if (g) {
            const u = String(c.getParameter(g.UNMASKED_RENDERER_WEBGL) || "");
            l = qa(u);
          }
        }
      }
    } catch {
    }
    const s = [t, e, n, i, o, a, l].join("###");
    return $e(s);
  } catch {
    return "fallback_hardware";
  }
}
function It(t, e, n) {
  const i = (e || "").trim().toLowerCase(), o = (n || "").replace(/\D/g, ""), a = (t || "").trim().toLowerCase();
  return {
    emailHash: i ? $e(i) : "",
    phoneHash: o ? $e(o) : "",
    nameHash: a ? $e(a) : ""
  };
}
const ut = "eg_contact_submissions_v2", Fe = "eg_rl_dev_", Oe = "eg_rl_hw_", Ve = "eg_rl_hwcore_", Ue = "eg_rl_em_", Ge = "eg_rl_ph_", ft = "c_rl_hw_", mt = "c_rl_hwcore_", xt = "c_rl_dev_", Rt = "c_rl_em_", zt = "c_rl_ph_";
function bn(t = "lastMessageTime", e = 24, n = !1) {
  if (typeof window > "u") return { allowed: !0 };
  const i = typeof t == "string" ? { rateLimitKey: t, rateLimitHours: e } : t, o = i.rateLimitHours ?? 24;
  if (o <= 0) return { allowed: !0 };
  const a = Date.now(), l = o * 60 * 60 * 1e3, s = i.rateLimitKey || "lastMessageTime", p = Je(), c = Qe(), g = Xe(), { emailHash: u, phoneHash: h } = It(i.name, i.email, i.contact);
  let m = 0, f = "general";
  try {
    const y = localStorage.getItem(s) || sessionStorage.getItem(s);
    if (y) {
      const k = parseInt(y, 10);
      !isNaN(k) && a - k < l && k > m && (m = k, f = "general");
    }
  } catch {
  }
  try {
    const y = `${Fe}${p}`, k = localStorage.getItem(y) || sessionStorage.getItem(y);
    if (k) {
      const v = parseInt(k, 10);
      !isNaN(v) && a - v < l && v > m && (m = v, f = "machine");
    }
  } catch {
  }
  try {
    const y = `${Oe}${c}`, k = localStorage.getItem(y) || sessionStorage.getItem(y);
    if (k) {
      const v = parseInt(k, 10);
      !isNaN(v) && a - v < l && v > m && (m = v, f = "machine");
    }
  } catch {
  }
  try {
    const y = `${Ve}${g}`, k = localStorage.getItem(y) || sessionStorage.getItem(y);
    if (k) {
      const v = parseInt(k, 10);
      !isNaN(v) && a - v < l && v > m && (m = v, f = "machine");
    }
  } catch {
  }
  if (u)
    try {
      const y = `${Ue}${u}`, k = localStorage.getItem(y) || sessionStorage.getItem(y);
      if (k) {
        const v = parseInt(k, 10);
        !isNaN(v) && a - v < l && v > m && (m = v, f = "email");
      }
    } catch {
    }
  if (h)
    try {
      const y = `${Ge}${h}`, k = localStorage.getItem(y) || sessionStorage.getItem(y);
      if (k) {
        const v = parseInt(k, 10);
        !isNaN(v) && a - v < l && v > m && (m = v, f = "contact");
      }
    } catch {
    }
  try {
    const y = localStorage.getItem(ut);
    if (y) {
      const k = JSON.parse(y);
      if (Array.isArray(k))
        for (const v of k)
          !v.timestamp || a - v.timestamp >= l || ((v.machineHash && v.machineHash === p || v.hardwareHash && v.hardwareHash === c || v.hardwareCoreHash && v.hardwareCoreHash === g) && v.timestamp > m && (m = v.timestamp, f = "machine"), u && v.emailHash && v.emailHash === u && v.timestamp > m && (m = v.timestamp, f = "email"), h && v.phoneHash && v.phoneHash === h && v.timestamp > m && (m = v.timestamp, f = "contact"));
    }
  } catch {
  }
  if (m > 0) {
    const y = a - m, k = l - y, v = Math.max(1, Math.ceil(k / (60 * 60 * 1e3))), x = Math.max(1, Math.ceil(k / (60 * 1e3)));
    let b = `You have already sent a message recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`;
    return f === "email" ? b = `A message was already submitted using this email address recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "contact" ? b = `A message was already submitted using this contact number recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "machine" && (b = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`), {
      allowed: !1,
      hoursRemaining: v,
      minutesRemaining: x,
      reason: f,
      message: b
    };
  }
  return { allowed: !0 };
}
async function Ka(t, e = {}) {
  if (!t || typeof t.collection != "function")
    return { allowed: !0 };
  const n = e.rateLimitHours ?? 24;
  if (n <= 0) return { allowed: !0 };
  const i = e.analyticsCollection || "visitor_analytics", o = Date.now(), a = n * 60 * 60 * 1e3, l = Qe(), s = Xe(), p = Je(), { emailHash: c, phoneHash: g } = It(e.name, e.email, e.contact), u = t.collection(i), h = [
    { key: `${ft}${l}`, reason: "machine", promise: u.doc(`${ft}${l}`).get().catch(() => null) },
    { key: `${mt}${s}`, reason: "machine", promise: u.doc(`${mt}${s}`).get().catch(() => null) },
    { key: `${xt}${p}`, reason: "machine", promise: u.doc(`${xt}${p}`).get().catch(() => null) }
  ];
  c && h.push({
    key: `${Rt}${c}`,
    reason: "email",
    promise: u.doc(`${Rt}${c}`).get().catch(() => null)
  }), g && h.push({
    key: `${zt}${g}`,
    reason: "contact",
    promise: u.doc(`${zt}${g}`).get().catch(() => null)
  });
  let m = 0, f = "machine";
  try {
    const y = await Promise.all(h.map((k) => k.promise));
    for (let k = 0; k < y.length; k++) {
      const v = y[k];
      if (v && (typeof v.exists == "function" ? v.exists() : v.exists)) {
        const x = v.data() || {}, b = typeof x.timestamp == "number" ? x.timestamp : 0;
        b > 0 && o - b < a && b > m && (m = b, f = h[k].reason);
      }
    }
  } catch {
    return { allowed: !0 };
  }
  if (m > 0) {
    const y = o - m, k = a - y, v = Math.max(1, Math.ceil(k / (60 * 60 * 1e3))), x = Math.max(1, Math.ceil(k / (60 * 1e3)));
    let b = `You have already sent a message recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`;
    f === "email" ? b = `A message was already submitted using this email address recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "contact" ? b = `A message was already submitted using this contact number recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "machine" && (b = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`);
    try {
      We({
        name: e.name,
        email: e.email,
        contact: e.contact
      });
    } catch {
    }
    return {
      allowed: !1,
      hoursRemaining: v,
      minutesRemaining: x,
      reason: f,
      message: b
    };
  }
  return { allowed: !0 };
}
async function Za(t, e = {}) {
  if (!t || typeof t.collection != "function") return;
  const n = e.analyticsCollection || "visitor_analytics", i = Qe(), o = Xe(), a = Je(), { emailHash: l, phoneHash: s } = It(e.name, e.email, e.contact), p = Date.now(), c = {
    timestamp: p,
    type: "contact_rate_limit",
    appName: e.appName || (typeof window < "u" ? window.location.hostname : "web-app"),
    createdAt: new Date(p).toISOString()
  }, g = t.collection(n), u = [
    g.doc(`${ft}${i}`).set(c).catch(() => {
    }),
    g.doc(`${mt}${o}`).set(c).catch(() => {
    }),
    g.doc(`${xt}${a}`).set(c).catch(() => {
    })
  ];
  l && u.push(g.doc(`${Rt}${l}`).set(c).catch(() => {
  })), s && u.push(g.doc(`${zt}${s}`).set(c).catch(() => {
  }));
  try {
    await Promise.allSettled(u);
  } catch {
  }
}
function We(t = "lastMessageTime") {
  if (typeof window > "u") return;
  const e = typeof t == "string" ? { rateLimitKey: t } : t || {}, n = e.rateLimitKey || "lastMessageTime", i = Date.now(), o = i.toString(), a = Je(), l = Qe(), s = Xe(), { emailHash: p, phoneHash: c, nameHash: g } = It(e.name, e.email, e.contact);
  try {
    localStorage.setItem(n, o), sessionStorage.setItem(n, o), localStorage.setItem(`${Fe}${a}`, o), sessionStorage.setItem(`${Fe}${a}`, o), localStorage.setItem(`${Oe}${l}`, o), sessionStorage.setItem(`${Oe}${l}`, o), localStorage.setItem(`${Ve}${s}`, o), sessionStorage.setItem(`${Ve}${s}`, o), p && (localStorage.setItem(`${Ue}${p}`, o), sessionStorage.setItem(`${Ue}${p}`, o)), c && (localStorage.setItem(`${Ge}${c}`, o), sessionStorage.setItem(`${Ge}${c}`, o));
    const u = localStorage.getItem(ut);
    let h = [];
    if (u)
      try {
        h = JSON.parse(u), Array.isArray(h) || (h = []);
      } catch {
        h = [];
      }
    const m = i - 48 * 60 * 60 * 1e3;
    h = h.filter((f) => f.timestamp && f.timestamp > m), h.push({
      timestamp: i,
      machineHash: a,
      hardwareHash: l,
      hardwareCoreHash: s,
      emailHash: p || void 0,
      phoneHash: c || void 0,
      nameHash: g || void 0
    }), localStorage.setItem(ut, JSON.stringify(h.slice(-30)));
  } catch {
  }
}
async function ps(t = "lastMessageTime", e, n = "visitor_analytics") {
  if (!(typeof window > "u"))
    try {
      localStorage.removeItem(t), sessionStorage.removeItem(t), localStorage.removeItem(ut);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const o = localStorage.key(i);
        o && (o.startsWith(Fe) || o.startsWith(Oe) || o.startsWith(Ve) || o.startsWith(Ue) || o.startsWith(Ge)) && localStorage.removeItem(o);
      }
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const o = sessionStorage.key(i);
        o && (o.startsWith(Fe) || o.startsWith(Oe) || o.startsWith(Ve) || o.startsWith(Ue) || o.startsWith(Ge)) && sessionStorage.removeItem(o);
      }
      if (e && typeof e.collection == "function") {
        const i = Qe(), o = Xe(), a = Je(), l = e.collection(n);
        await Promise.allSettled([
          l.doc(`${ft}${i}`).delete().catch(() => {
          }),
          l.doc(`${mt}${o}`).delete().catch(() => {
          }),
          l.doc(`${xt}${a}`).delete().catch(() => {
          })
        ]);
      }
    } catch {
    }
}
function xr(t, e, n, i, o, a) {
  if (!(typeof window > "u"))
    try {
      const l = "eg_offline_contact_messages", s = JSON.parse(localStorage.getItem(l) || "[]");
      s.push({
        ...t,
        name: e,
        email: n,
        contact: i,
        message: o,
        appName: a.appName || t.appName || (typeof window < "u" ? window.location.hostname : "web-app"),
        id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        userAgent: typeof navigator < "u" ? navigator.userAgent : ""
      }), localStorage.setItem(l, JSON.stringify(s.slice(-20)));
    } catch {
    }
}
async function vn(t, e = "messages", n) {
  if (!t || typeof t.collection != "function" || typeof window > "u") return 0;
  try {
    const i = "eg_offline_contact_messages", o = localStorage.getItem(i);
    if (!o) return 0;
    const a = JSON.parse(o);
    if (!Array.isArray(a) || a.length === 0) return 0;
    let l = 0;
    const s = [];
    for (const p of a)
      try {
        const c = n ? n(p) : {
          name: p.name || "Anonymous",
          email: p.email || "",
          contact: p.contact || "",
          message: p.message || "",
          createdAt: p.createdAt ? new Date(p.createdAt) : /* @__PURE__ */ new Date()
        };
        await t.collection(e).add(c), l++;
      } catch {
        s.push(p);
      }
    return s.length === 0 ? localStorage.removeItem(i) : localStorage.setItem(i, JSON.stringify(s)), l;
  } catch {
    return 0;
  }
}
async function Ya(t, e = {}) {
  var x, b, w, I, T;
  const n = e.collectionName || "messages", i = e.rateLimitKey || "lastMessageTime", o = e.rateLimitHours ?? 24, a = e.allowLocalhostBypass ?? !1, l = bn({
    name: t.name,
    email: t.email,
    contact: t.contact,
    rateLimitKey: i,
    rateLimitHours: o,
    allowLocalhostBypass: a
  });
  if (!l.allowed)
    return {
      success: !1,
      rateLimited: !0,
      message: l.message || "You have sent a message recently. Please try again tomorrow."
    };
  const s = (t.name || "").trim(), p = (t.email || "").trim(), c = (t.contact || "").trim(), g = (t.message || "").trim();
  if (!s || !p || !g)
    return {
      success: !1,
      message: "Please fill in all required fields (Name, Email, Message)."
    };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p) || p.length > 255)
    return {
      success: !1,
      message: "Please enter a valid email address."
    };
  const h = s.slice(0, 100), m = p.slice(0, 255), f = c.slice(0, 50), y = g.slice(0, 5e3);
  if (e.onSubmit)
    try {
      const C = await e.onSubmit({
        ...t,
        name: h,
        email: m,
        contact: f,
        message: y,
        appName: e.appName || t.appName || (typeof window < "u" ? window.location.hostname : "web-app")
      });
      return We({
        name: h,
        email: m,
        contact: f,
        rateLimitKey: i
      }), C && typeof C == "object" && "success" in C ? C : {
        success: !0,
        message: "Thank you for reaching out! Your message has been received and we will get back to you shortly."
      };
    } catch (C) {
      return {
        success: !1,
        message: (C == null ? void 0 : C.message) || "Failed to submit inquiry via custom handler."
      };
    }
  let k = e.db;
  if (!k && e.firebaseConfig && e.firebaseConfig.apiKey)
    try {
      k = (await Le(e.firebaseConfig, e.appName)).db;
    } catch (C) {
      console.warn("[contactService] Failed to initialize Firebase with provided config:", C);
    }
  if (!k && typeof window < "u" && (k = window.db || ((b = (x = window.firebase) == null ? void 0 : x.firestore) == null ? void 0 : b.call(x)), !k && ((w = window.firebaseApp) != null && w.firestore) && (k = window.firebaseApp.firestore())), k && typeof k.collection == "function")
    try {
      const C = typeof window < "u" ? window.firebase : null, M = (T = (I = C == null ? void 0 : C.firestore) == null ? void 0 : I.FieldValue) != null && T.serverTimestamp ? C.firestore.FieldValue.serverTimestamp() : /* @__PURE__ */ new Date(), W = {
        name: h,
        email: m,
        contact: f,
        message: y,
        appName: e.appName || t.appName || (typeof window < "u" ? window.location.hostname : "web-app"),
        createdAt: M
      }, P = e.transformPayload ? e.transformPayload(W) : {
        name: h,
        email: m,
        contact: f,
        message: y,
        createdAt: M
      }, R = await Ka(k, {
        name: h,
        email: m,
        contact: f,
        rateLimitHours: o,
        analyticsCollection: e.analyticsCollection || "visitor_analytics"
      });
      if (!R.allowed)
        return {
          success: !1,
          rateLimited: !0,
          message: R.message || "You have sent a message recently. Please try again tomorrow."
        };
      const E = await k.collection(n).add(P);
      return We({
        name: h,
        email: m,
        contact: f,
        rateLimitKey: i
      }), Za(k, {
        name: h,
        email: m,
        contact: f,
        appName: e.appName || t.appName,
        analyticsCollection: e.analyticsCollection || "visitor_analytics"
      }).catch(() => {
      }), vn(k, n, e.transformPayload).catch(() => {
      }), {
        success: !0,
        docId: (E == null ? void 0 : E.id) || "submitted",
        message: "Thank you for reaching out! Your message has been received and we will get back to you shortly."
      };
    } catch (C) {
      return console.error("[contactService] Firestore write failed:", C), typeof navigator < "u" && !navigator.onLine ? (xr(t, h, m, f, y, e), We({
        name: h,
        email: m,
        contact: f,
        rateLimitKey: i
      }), {
        success: !0,
        offlineFallback: !0,
        message: "You appear to be offline. Your message has been saved and will be sent automatically once reconnected."
      }) : {
        success: !1,
        message: C != null && C.message ? `Failed to deliver message: ${C.message}` : "Failed to deliver message to server. Please try again later."
      };
    }
  return typeof navigator < "u" && !navigator.onLine ? (xr(t, h, m, f, y, e), We({
    name: h,
    email: m,
    contact: f,
    rateLimitKey: i
  }), {
    success: !0,
    offlineFallback: !0,
    message: "You appear to be offline. Your message has been saved locally and will be delivered once reconnected."
  }) : {
    success: !1,
    message: "Backend message delivery service is not configured or unavailable. Please contact us directly via email."
  };
}
const gs = ({
  title: t = "Any message?",
  subtitle: e,
  submitButtonText: n = "Send Enquiry ⮠",
  requireContactNumber: i = !0,
  enableCaptcha: o = !0,
  lazyCaptcha: a = !0,
  rateLimitHours: l = 24,
  rateLimitKey: s = "lastMessageTime",
  maxMessageLength: p = 2e3,
  firestoreCollection: c,
  analyticsCollection: g,
  db: u,
  firebaseConfig: h,
  appName: m,
  allowLocalhostBypass: f = !1,
  transformPayload: y,
  onSubmit: k,
  channels: v,
  channelsTitle: x = "Connect on Other Platforms",
  channelsSubtitle: b,
  successTitle: w = "Thank You for Contacting Us!",
  successMessage: I = "Your message has been received. We will get back to you shortly.",
  className: T = "",
  style: C
}) => {
  var K, re, ge;
  const M = kt(), W = u || M.db, P = h || ((K = M.config) != null && K.apiKey ? M.config : void 0), R = m || (M.appName !== "web-app" ? M.appName : "web-app"), E = c || ((re = M.collections) == null ? void 0 : re.messages) || "messages", j = g || ((ge = M.collections) == null ? void 0 : ge.analytics) || "visitor_analytics", [z, O] = _(""), [$, L] = _(""), [S, N] = _(""), [A, D] = _(""), [V, B] = _(""), [H, U] = _(null), [G, J] = _(!a), [F, oe] = _(!1), [ie, ae] = _(null), [de, Be] = _(!1);
  Y(() => {
    let Q = !0;
    async function ue() {
      try {
        let fe = W;
        !fe && (P != null && P.apiKey) && (fe = (await Le(P, R === "web-app" ? void 0 : R)).db), Q && fe && await vn(fe, E, y);
      } catch {
      }
    }
    return ue(), () => {
      Q = !1;
    };
  }, [W, P, R, E, y]);
  const pe = te(() => {
    U(Ga()), B("");
  }, []), Se = () => {
    o && !G && (J(!0), H || pe());
  };
  Y(() => {
    o && G && !H && pe();
  }, [o, G, H, pe]);
  const et = async (Q) => {
    Q.preventDefault(), ae(null);
    const ue = bn({
      name: z.trim(),
      email: $.trim(),
      contact: S.trim(),
      rateLimitKey: s,
      rateLimitHours: l,
      allowLocalhostBypass: f
    });
    if (!ue.allowed) {
      ae({
        type: "error",
        message: ue.message || "You have sent a message recently. Please try again tomorrow."
      });
      return;
    }
    if (o) {
      if (!H) {
        pe(), ae({ type: "error", message: "Please complete the anti-spam verification challenge." });
        return;
      }
      const se = parseInt(V.trim(), 10);
      if (isNaN(se) || se !== H.expected) {
        ae({ type: "error", message: "Incorrect anti-spam verification answer. Please try again." }), pe();
        return;
      }
    }
    if (!z.trim() || !$.trim() || !A.trim()) {
      ae({ type: "error", message: "Please fill in all required fields (Name, Email, Message)." });
      return;
    }
    if (i && !S.trim()) {
      ae({ type: "error", message: "Please provide a valid contact phone number." });
      return;
    }
    oe(!0);
    const fe = {
      name: z.trim(),
      email: $.trim(),
      contact: S.trim(),
      message: A.trim(),
      appName: R
    };
    try {
      let se;
      k ? (se = await k(fe), se.success && We({
        name: z.trim(),
        email: $.trim(),
        contact: S.trim(),
        rateLimitKey: s
      })) : se = await Ya(fe, {
        collectionName: E,
        analyticsCollection: j,
        rateLimitKey: s,
        rateLimitHours: l,
        db: W,
        firebaseConfig: P,
        appName: R,
        allowLocalhostBypass: f,
        transformPayload: y
      }), se.success ? (Be(!0), ae({
        type: "success",
        message: se.message || I
      }), O(""), L(""), N(""), D(""), B(""), a && J(!1)) : (ae({
        type: "error",
        message: se.message || "Failed to submit inquiry. Please try again later."
      }), o && pe());
    } catch (se) {
      ae({
        type: "error",
        message: (se == null ? void 0 : se.message) || "An unexpected error occurred. Please try again later."
      }), o && pe();
    } finally {
      oe(!1);
    }
  };
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-contact-portal ${T}`,
      style: {
        display: "grid",
        gridTemplateColumns: v && v.length > 0 ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "1fr",
        gap: "32px",
        alignItems: "start",
        ...C
      },
      children: [
        /* @__PURE__ */ d("div", { className: "eg-contact-portal-card", children: [
          t && /* @__PURE__ */ r(
            "h3",
            {
              style: {
                margin: "0 0 6px",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--eg-text-primary, #0f172a)",
                letterSpacing: "-0.01em"
              },
              children: t
            }
          ),
          e && /* @__PURE__ */ r(
            "p",
            {
              style: {
                margin: "0 0 24px",
                fontSize: "14px",
                color: "var(--eg-text-muted, #64748b)",
                lineHeight: 1.55
              },
              children: e
            }
          ),
          ie && /* @__PURE__ */ d(
            "div",
            {
              style: {
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "22px",
                fontSize: "14px",
                lineHeight: 1.5,
                fontWeight: 500,
                background: ie.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${ie.type === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                color: ie.type === "success" ? "var(--eg-color-success, #15803d)" : "var(--eg-color-danger, #b91c1c)"
              },
              children: [
                ie.type === "success" ? "✓ " : "⚠️ ",
                ie.message
              ]
            }
          ),
          de ? /* @__PURE__ */ d("div", { style: { textAlign: "center", padding: "24px 0" }, children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "rgba(34, 197, 94, 0.12)",
                  color: "#16a34a",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "16px"
                },
                children: "✓"
              }
            ),
            /* @__PURE__ */ r("h4", { style: { margin: "0 0 8px", fontSize: "19px", fontWeight: 700, color: "var(--eg-text-primary, #0f172a)" }, children: w }),
            /* @__PURE__ */ r("p", { style: { margin: "0 0 24px", color: "var(--eg-text-secondary, #475569)", fontSize: "14.5px", lineHeight: 1.6 }, children: I }),
            /* @__PURE__ */ r(
              Wt,
              {
                variant: "outline",
                size: "md",
                onClick: () => {
                  Be(!1), ae(null), o && pe();
                },
                children: "Send Another Enquiry"
              }
            )
          ] }) : /* @__PURE__ */ d("form", { id: "contactForm", onSubmit: et, children: [
            /* @__PURE__ */ d("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ d("label", { htmlFor: "txtname", className: "eg-contact-input-label", children: [
                "Name ",
                /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
              ] }),
              /* @__PURE__ */ r(
                "input",
                {
                  id: "txtname",
                  name: "name",
                  type: "text",
                  required: !0,
                  value: z,
                  onFocus: Se,
                  onChange: (Q) => O(Q.target.value),
                  placeholder: "Your full name",
                  className: "eg-contact-input"
                }
              )
            ] }),
            /* @__PURE__ */ d("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ d("label", { htmlFor: "txtemail", className: "eg-contact-input-label", children: [
                "Email Address ",
                /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
              ] }),
              /* @__PURE__ */ r(
                "input",
                {
                  id: "txtemail",
                  name: "email",
                  type: "email",
                  required: !0,
                  value: $,
                  onFocus: Se,
                  onChange: (Q) => L(Q.target.value),
                  placeholder: "name@example.com",
                  className: "eg-contact-input"
                }
              )
            ] }),
            /* @__PURE__ */ d("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ d("label", { htmlFor: "txtcontact", className: "eg-contact-input-label", children: [
                "Contact Number ",
                i ? /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" }) : /* @__PURE__ */ r("span", { style: { fontWeight: 400, color: "var(--eg-text-muted, #94a3b8)" }, children: "(Optional)" })
              ] }),
              /* @__PURE__ */ r(
                "input",
                {
                  id: "txtcontact",
                  name: "contact",
                  type: "tel",
                  required: i,
                  maxLength: 15,
                  pattern: "[0-9+ -]*",
                  value: S,
                  onFocus: Se,
                  onChange: (Q) => N(Q.target.value),
                  placeholder: "Phone or mobile number",
                  className: "eg-contact-input"
                }
              )
            ] }),
            o && G && H && /* @__PURE__ */ d("div", { className: "eg-contact-captcha-box", id: "botCheckContainer", children: [
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ d(
                  "label",
                  {
                    htmlFor: "txtbot",
                    style: {
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--eg-text-primary, #0f172a)",
                      marginBottom: "4px"
                    },
                    children: [
                      "Anti-Spam Verification: ",
                      H.prompt,
                      " ",
                      /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ r("span", { style: { fontSize: "11.5px", color: "var(--eg-text-muted, #94a3b8)" }, children: "Solve the arithmetic problem above to verify you are human" })
              ] }),
              /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    id: "txtbot",
                    name: "botAnswer",
                    type: "number",
                    required: !0,
                    value: V,
                    onChange: (Q) => B(Q.target.value),
                    placeholder: "Answer",
                    style: {
                      width: "100px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.2))",
                      background: "var(--eg-bg-surface, #ffffff)",
                      color: "var(--eg-text-primary, #0f172a)",
                      fontSize: "14px",
                      fontWeight: 600,
                      textAlign: "center"
                    }
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: pe,
                    title: "Generate new arithmetic problem",
                    style: {
                      background: "transparent",
                      border: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.12))",
                      borderRadius: "6px",
                      padding: "7px 9px",
                      cursor: "pointer",
                      color: "var(--eg-text-secondary, #475569)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    },
                    children: /* @__PURE__ */ r("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ r("path", { d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" }) })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ d("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }, children: [
                /* @__PURE__ */ d("label", { htmlFor: "txtenq", className: "eg-contact-input-label", style: { marginBottom: 0 }, children: [
                  "Your Message ",
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
                ] }),
                p && /* @__PURE__ */ d("span", { style: { fontSize: "12px", color: "var(--eg-text-muted, #94a3b8)", fontWeight: 500 }, children: [
                  A.length,
                  " / ",
                  p
                ] })
              ] }),
              /* @__PURE__ */ r(
                "textarea",
                {
                  id: "txtenq",
                  name: "message",
                  required: !0,
                  rows: 5,
                  maxLength: p,
                  value: A,
                  onFocus: Se,
                  onChange: (Q) => D(Q.target.value),
                  placeholder: "Write your comments, feedback, or feature request here...",
                  className: "eg-contact-input",
                  style: { resize: "vertical" }
                }
              )
            ] }),
            /* @__PURE__ */ r("div", { style: { marginTop: "26px" }, children: /* @__PURE__ */ r(
              Wt,
              {
                type: "submit",
                id: "btnsend",
                variant: "primary",
                size: "md",
                disabled: F,
                style: { width: "100%", justifyContent: "center" },
                children: F ? "Sending Enquiry..." : n
              }
            ) })
          ] })
        ] }),
        v && v.length > 0 && /* @__PURE__ */ d("div", { className: "eg-contact-portal-card", children: [
          /* @__PURE__ */ r(
            "h3",
            {
              style: {
                margin: "0 0 6px",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--eg-text-primary, #0f172a)",
                letterSpacing: "-0.01em"
              },
              children: x
            }
          ),
          b && /* @__PURE__ */ r(
            "p",
            {
              style: {
                margin: "0 0 20px",
                fontSize: "13.5px",
                color: "var(--eg-text-muted, #64748b)",
                lineHeight: 1.5
              },
              children: b
            }
          ),
          /* @__PURE__ */ r("div", { style: { marginTop: "16px" }, children: v.map((Q) => {
            const ue = /* @__PURE__ */ d(ce, { children: [
              Q.icon && /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "var(--eg-bg-canvas, #f1f5f9)",
                    color: "var(--eg-color-primary, #b8860b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0
                  },
                  children: Q.icon
                }
              ),
              /* @__PURE__ */ d("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ r("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--eg-text-primary, #0f172a)" }, children: Q.label }),
                /* @__PURE__ */ r(
                  "div",
                  {
                    style: {
                      fontSize: "13px",
                      color: Q.href ? "var(--eg-color-primary, #b8860b)" : "var(--eg-text-secondary, #475569)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: Q.value
                  }
                ),
                Q.description && /* @__PURE__ */ r("div", { style: { fontSize: "11.5px", color: "var(--eg-text-muted, #94a3b8)", marginTop: "2px" }, children: Q.description })
              ] }),
              Q.href && /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #94a3b8)", fontSize: "15px" }, children: "↗" })
            ] });
            return Q.href ? /* @__PURE__ */ r(
              "a",
              {
                href: ne(Q.href),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "eg-contact-channel-item",
                children: ue
              },
              Q.id
            ) : /* @__PURE__ */ r("div", { className: "eg-contact-channel-item", children: ue }, Q.id);
          }) })
        ] })
      ]
    }
  );
};
function Ja(t, e, n = "string") {
  if (t == null && e == null) return 0;
  if (t == null) return -1;
  if (e == null) return 1;
  switch (n) {
    case "number": {
      const i = Number(t) || 0, o = Number(e) || 0;
      return i - o;
    }
    case "date": {
      const i = new Date(t).getTime() || 0, o = new Date(e).getTime() || 0;
      return i - o;
    }
    case "ip": {
      const i = String(t).trim(), o = String(e).trim(), a = i.split(".").map((s) => parseInt(s, 10) || 0), l = o.split(".").map((s) => parseInt(s, 10) || 0);
      for (let s = 0; s < 4; s++) {
        const p = (a[s] || 0) - (l[s] || 0);
        if (p !== 0) return p;
      }
      return 0;
    }
    case "string":
    default:
      return String(t).localeCompare(String(e), void 0, { sensitivity: "base", numeric: !0 });
  }
}
function yr(t) {
  if (t == null) return '""';
  let e = String(t);
  return (e.includes('"') || e.includes(",") || e.includes(`
`) || e.includes("\r")) && (e = `"${e.replace(/"/g, '""')}"`), e;
}
function wn({
  data: t,
  columns: e,
  keyExtractor: n,
  defaultPageSize: i = 15,
  pageSizeOptions: o = [10, 15, 25, 50, 100],
  searchable: a = !0,
  searchPlaceholder: l = "Search records...",
  searchKeys: s,
  exportable: p = !0,
  exportFileName: c = "export.csv",
  loading: g = !1,
  emptyMessage: u = "No matching records found.",
  toolbarSlot: h,
  onRowClick: m,
  initialSortKey: f,
  initialSortDirection: y = null,
  style: k,
  className: v = ""
}) {
  const [x, b] = _(""), [w, I] = _(f || null), [T, C] = _(y), [M, W] = _(i), [P, R] = _(1), E = ee(() => {
    if (!x.trim()) return t;
    const B = x.toLowerCase().trim();
    return t.filter((H) => s && s.length > 0 ? s.some((U) => {
      const G = e.find((F) => F.key === U), J = G != null && G.getValue ? G.getValue(H) : H[U];
      return J != null && String(J).toLowerCase().includes(B);
    }) : e.some((U) => {
      const G = U.getValue ? U.getValue(H) : H[U.key];
      return G != null && String(G).toLowerCase().includes(B);
    }));
  }, [t, x, s, e]), j = ee(() => {
    if (!w || !T) return E;
    const B = e.find((G) => G.key === w), H = (B == null ? void 0 : B.sortType) || "string";
    return [...E].sort((G, J) => {
      const F = B != null && B.getValue ? B.getValue(G) : G[w], oe = B != null && B.getValue ? B.getValue(J) : J[w], ie = Ja(F, oe, H);
      return T === "desc" ? -ie : ie;
    });
  }, [E, w, T, e]), z = (B) => {
    b(B.target.value), R(1);
  }, O = (B) => {
    w !== B ? (I(B), C("asc")) : T === "asc" ? C("desc") : T === "desc" ? (C(null), I(null)) : C("asc"), R(1);
  }, $ = j.length, L = Math.max(1, Math.ceil($ / M)), S = Math.min(Math.max(1, P), L), N = ee(() => {
    const B = (S - 1) * M;
    return j.slice(B, B + M);
  }, [j, S, M]), A = $ === 0 ? 0 : (S - 1) * M + 1, D = Math.min(S * M, $), V = te(() => {
    if (j.length === 0) return;
    const B = e.map((oe) => yr(oe.label)).join(","), H = j.map((oe) => e.map((ie) => {
      const ae = ie.getValue ? ie.getValue(oe) : oe[ie.key];
      return yr(ae);
    }).join(",")), U = "\uFEFF" + [B, ...H].join(`\r
`), G = new Blob([U], { type: "text/csv;charset=utf-8;" }), J = URL.createObjectURL(G), F = document.createElement("a");
    F.href = J, F.setAttribute("download", c), document.body.appendChild(F), F.click(), document.body.removeChild(F), URL.revokeObjectURL(J);
  }, [j, e, c]);
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-datagrid-container ${v}`,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        background: "var(--eg-bg-secondary, #111827)",
        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
        borderRadius: "var(--eg-radius-lg, 14px)",
        overflow: "hidden",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
        ...k
      },
      children: [
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--eg-space-3, 12px)",
              padding: "var(--eg-space-4, 16px)",
              borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))"
            },
            children: [
              /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "var(--eg-space-3, 12px)", flex: "1 1 280px" }, children: [
                a && /* @__PURE__ */ d("div", { style: { position: "relative", width: "100%", maxWidth: "340px" }, children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "text",
                      value: x,
                      onChange: z,
                      placeholder: l,
                      style: {
                        width: "100%",
                        padding: "8px 12px 8px 36px",
                        background: "var(--eg-bg-primary, #030712)",
                        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        color: "var(--eg-text-primary, #f9fafb)",
                        fontSize: "var(--eg-text-sm, 0.875rem)",
                        outline: "none"
                      }
                    }
                  ),
                  /* @__PURE__ */ d(
                    "svg",
                    {
                      width: "16",
                      height: "16",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "var(--eg-text-muted, #9ca3af)",
                      strokeWidth: "2",
                      style: {
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none"
                      },
                      children: [
                        /* @__PURE__ */ r("circle", { cx: "11", cy: "11", r: "8" }),
                        /* @__PURE__ */ r("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                      ]
                    }
                  )
                ] }),
                h
              ] }),
              /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "var(--eg-space-3, 12px)" }, children: [
                /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--eg-text-xs, 0.8125rem)", color: "var(--eg-text-muted, #9ca3af)" }, children: [
                  /* @__PURE__ */ r("span", { children: "Show:" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: M,
                      onChange: (B) => {
                        W(Number(B.target.value)), R(1);
                      },
                      style: {
                        background: "var(--eg-bg-primary, #030712)",
                        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                        borderRadius: "var(--eg-radius-sm, 6px)",
                        color: "var(--eg-text-primary, #f9fafb)",
                        padding: "4px 8px",
                        fontSize: "var(--eg-text-xs, 0.8125rem)",
                        cursor: "pointer",
                        outline: "none"
                      },
                      children: o.map((B) => /* @__PURE__ */ r("option", { value: B, children: B }, B))
                    }
                  )
                ] }),
                p && /* @__PURE__ */ d(
                  "button",
                  {
                    type: "button",
                    onClick: V,
                    disabled: j.length === 0,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      fontSize: "var(--eg-text-xs, 0.8125rem)",
                      fontWeight: 500,
                      cursor: j.length === 0 ? "not-allowed" : "pointer",
                      opacity: j.length === 0 ? 0.5 : 1,
                      transition: "background var(--eg-transition-fast, 150ms)"
                    },
                    children: [
                      /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                        /* @__PURE__ */ r("polyline", { points: "7 10 12 15 17 10" }),
                        /* @__PURE__ */ r("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: "Export CSV" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ r("div", { style: { width: "100%", overflowX: "auto" }, children: /* @__PURE__ */ d(
          "table",
          {
            style: {
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              fontSize: "var(--eg-text-sm, 0.875rem)"
            },
            children: [
              /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ r(
                "tr",
                {
                  style: {
                    background: "var(--eg-bg-tertiary, #1a2234)",
                    borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))"
                  },
                  children: e.map((B) => {
                    const H = w === B.key, U = B.sortable !== !1;
                    return /* @__PURE__ */ r(
                      "th",
                      {
                        onClick: () => U && O(B.key),
                        style: {
                          padding: "12px 16px",
                          color: H ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #d1d5db)",
                          fontWeight: 600,
                          fontSize: "var(--eg-text-xs, 0.8125rem)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          cursor: U ? "pointer" : "default",
                          userSelect: "none",
                          whiteSpace: "nowrap",
                          width: B.width,
                          textAlign: B.align || "left",
                          transition: "color var(--eg-transition-fast, 150ms)"
                        },
                        children: /* @__PURE__ */ d(
                          "div",
                          {
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              justifyContent: B.align === "right" ? "flex-end" : B.align === "center" ? "center" : "flex-start"
                            },
                            children: [
                              /* @__PURE__ */ r("span", { children: B.label }),
                              U && /* @__PURE__ */ r("span", { style: { fontSize: "0.75rem", opacity: H ? 1 : 0.35 }, children: H && T === "asc" ? "▲" : H && T === "desc" ? "▼" : "⇅" })
                            ]
                          }
                        )
                      },
                      B.key
                    );
                  })
                }
              ) }),
              /* @__PURE__ */ r("tbody", { children: g ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", { colSpan: e.length, style: { padding: "36px", textAlign: "center" }, children: /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    color: "var(--eg-text-muted, #9ca3af)"
                  },
                  children: [
                    /* @__PURE__ */ r(
                      "div",
                      {
                        style: {
                          width: "28px",
                          height: "28px",
                          border: "3px solid rgba(16, 185, 129, 0.2)",
                          borderTopColor: "var(--eg-color-primary, #10b981)",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite"
                        }
                      }
                    ),
                    /* @__PURE__ */ r("span", { children: "Loading data records..." })
                  ]
                }
              ) }) }) : N.length === 0 ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r(
                "td",
                {
                  colSpan: e.length,
                  style: {
                    padding: "36px",
                    textAlign: "center",
                    color: "var(--eg-text-muted, #9ca3af)"
                  },
                  children: u
                }
              ) }) : N.map((B, H) => {
                const U = n ? n(B, H) : H;
                return /* @__PURE__ */ r(
                  "tr",
                  {
                    onClick: () => m && m(B, H),
                    style: {
                      borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.04))",
                      cursor: m ? "pointer" : "default",
                      transition: "background var(--eg-transition-fast, 150ms)",
                      background: H % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)"
                    },
                    children: e.map((G) => {
                      const J = G.getValue ? G.getValue(B) : B[G.key];
                      return /* @__PURE__ */ r(
                        "td",
                        {
                          style: {
                            padding: "12px 16px",
                            color: "var(--eg-text-primary, #f9fafb)",
                            textAlign: G.align || "left",
                            whiteSpace: "normal",
                            wordBreak: "break-word"
                          },
                          children: G.render ? G.render(B, H) : J != null ? String(J) : "—"
                        },
                        G.key
                      );
                    })
                  },
                  U
                );
              }) })
            ]
          }
        ) }),
        /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "var(--eg-space-3, 12px)",
              padding: "var(--eg-space-3, 12px) var(--eg-space-4, 16px)",
              borderTop: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))",
              background: "var(--eg-bg-secondary, #111827)",
              fontSize: "var(--eg-text-xs, 0.8125rem)",
              color: "var(--eg-text-muted, #9ca3af)"
            },
            children: [
              /* @__PURE__ */ d("div", { children: [
                "Showing ",
                /* @__PURE__ */ r("strong", { children: A }),
                " to ",
                /* @__PURE__ */ r("strong", { children: D }),
                " of",
                " ",
                /* @__PURE__ */ r("strong", { children: $ }),
                " entries",
                x && ` (filtered from ${t.length} total)`
              ] }),
              /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => R(1),
                    disabled: S <= 1,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S <= 1 ? "not-allowed" : "pointer",
                      opacity: S <= 1 ? 0.4 : 1
                    },
                    children: "« First"
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => R((B) => Math.max(1, B - 1)),
                    disabled: S <= 1,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S <= 1 ? "not-allowed" : "pointer",
                      opacity: S <= 1 ? 0.4 : 1
                    },
                    children: "‹ Prev"
                  }
                ),
                /* @__PURE__ */ d("span", { style: { padding: "0 6px", fontWeight: 600, color: "var(--eg-text-primary, #f9fafb)" }, children: [
                  "Page ",
                  S,
                  " of ",
                  L
                ] }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => R((B) => Math.min(L, B + 1)),
                    disabled: S >= L,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S >= L ? "not-allowed" : "pointer",
                      opacity: S >= L ? 0.4 : 1
                    },
                    children: "Next ›"
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => R(L),
                    disabled: S >= L,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S >= L ? "not-allowed" : "pointer",
                      opacity: S >= L ? 0.4 : 1
                    },
                    children: "Last »"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
}
const He = ({
  title: t,
  value: e,
  subtitle: n,
  icon: i,
  iconBgColor: o = "rgba(16, 185, 129, 0.12)",
  iconColor: a = "var(--eg-color-primary, #10b981)",
  trend: l,
  onClick: s,
  style: p,
  className: c = ""
}) => {
  const g = !!s;
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-stat-card ${c}`,
      onClick: s,
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "var(--eg-space-5, 20px)",
        background: "var(--eg-bg-secondary, #111827)",
        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
        borderRadius: "var(--eg-radius-lg, 14px)",
        boxShadow: "0 4px 16px -2px rgba(0, 0, 0, 0.2)",
        cursor: g ? "pointer" : "default",
        transition: "transform var(--eg-transition-fast, 150ms), border-color var(--eg-transition-fast, 150ms)",
        position: "relative",
        overflow: "hidden",
        minHeight: "120px",
        ...p
      },
      children: [
        /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }, children: [
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ r(
              "span",
              {
                style: {
                  fontSize: "var(--eg-text-xs, 0.8125rem)",
                  fontWeight: 600,
                  color: "var(--eg-text-muted, #9ca3af)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                },
                children: t
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  fontSize: "var(--eg-text-3xl, 2rem)",
                  fontWeight: 700,
                  color: "var(--eg-text-primary, #f9fafb)",
                  marginTop: "var(--eg-space-1, 4px)",
                  lineHeight: 1.1,
                  fontFamily: "var(--eg-font-sans, inherit)"
                },
                children: typeof e == "number" ? e.toLocaleString() : e
              }
            )
          ] }),
          i && /* @__PURE__ */ r(
            "div",
            {
              style: {
                width: "44px",
                height: "44px",
                borderRadius: "var(--eg-radius-md, 10px)",
                background: o,
                color: a,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              },
              children: i
            }
          )
        ] }),
        (n || l) && /* @__PURE__ */ d(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "var(--eg-space-3, 12px)",
              fontSize: "var(--eg-text-xs, 0.75rem)"
            },
            children: [
              l && /* @__PURE__ */ d(
                "span",
                {
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2px",
                    fontWeight: 600,
                    color: l.direction === "up" ? "#34d399" : l.direction === "down" ? "#f87171" : "var(--eg-text-muted, #9ca3af)"
                  },
                  children: [
                    l.direction === "up" ? "▲" : l.direction === "down" ? "▼" : "●",
                    " ",
                    l.value
                  ]
                }
              ),
              n && /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)" }, children: n })
            ]
          }
        )
      ]
    }
  );
}, hs = ({
  brandTitle: t = "Admin Portal",
  brandSubtitle: e = "Security & Control",
  logo: n,
  navItems: i,
  activeNavId: o,
  onNavSelect: a,
  user: l,
  onLogout: s,
  currentTitle: p,
  headerActions: c,
  children: g,
  style: u,
  className: h = ""
}) => {
  const [m, f] = _(!1), [y, k] = _(!1), v = (w) => {
    w.onClick && w.onClick(), a && a(w.id), k(!1);
  }, x = i.find((w) => w.id === o), b = p || (x == null ? void 0 : x.label) || t;
  return /* @__PURE__ */ d(
    "div",
    {
      className: `eg-admin-layout ${h}`,
      style: {
        display: "flex",
        minHeight: "100vh",
        background: "var(--eg-bg-primary, #030712)",
        color: "var(--eg-text-primary, #f9fafb)",
        fontFamily: "var(--eg-font-sans, inherit)",
        position: "relative",
        ...u
      },
      children: [
        y && /* @__PURE__ */ r(
          "div",
          {
            onClick: () => k(!1),
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 99990
            }
          }
        ),
        /* @__PURE__ */ d(
          "aside",
          {
            style: {
              width: m ? "72px" : "260px",
              background: "var(--eg-bg-secondary, #111827)",
              borderRight: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "width var(--eg-transition-normal, 220ms), transform var(--eg-transition-normal, 220ms)",
              zIndex: 99995,
              position: "sticky",
              top: 0,
              height: "100vh",
              flexShrink: 0,
              ...y ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "280px",
                transform: "translateX(0)"
              } : {}
            },
            children: [
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ d(
                  "div",
                  {
                    style: {
                      padding: m ? "16px 8px" : "20px 16px",
                      borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: m ? "center" : "space-between",
                      gap: "12px"
                    },
                    children: [
                      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }, children: [
                        n ? /* @__PURE__ */ r("div", { style: { flexShrink: 0 }, children: n }) : /* @__PURE__ */ r(
                          "div",
                          {
                            style: {
                              width: "36px",
                              height: "36px",
                              borderRadius: "var(--eg-radius-md, 10px)",
                              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))",
                              border: "1px solid rgba(16, 185, 129, 0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--eg-color-primary, #10b981)",
                              flexShrink: 0
                            },
                            children: /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                              /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                            ] })
                          }
                        ),
                        !m && /* @__PURE__ */ d("div", { style: { overflow: "hidden", whiteSpace: "nowrap" }, children: [
                          /* @__PURE__ */ r(
                            "div",
                            {
                              style: {
                                fontSize: "var(--eg-text-base, 1rem)",
                                fontWeight: 700,
                                color: "var(--eg-text-primary, #f9fafb)",
                                lineHeight: 1.2
                              },
                              children: t
                            }
                          ),
                          e && /* @__PURE__ */ r(
                            "div",
                            {
                              style: {
                                fontSize: "var(--eg-text-xs, 0.75rem)",
                                color: "var(--eg-text-muted, #9ca3af)"
                              },
                              children: e
                            }
                          )
                        ] })
                      ] }),
                      !y && /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          onClick: () => f(!m),
                          style: {
                            background: "transparent",
                            border: "none",
                            color: "var(--eg-text-muted, #9ca3af)",
                            cursor: "pointer",
                            padding: "4px",
                            display: m ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          },
                          title: m ? "Expand sidebar" : "Collapse sidebar",
                          children: /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ r("path", { d: "M15 18l-6-6 6-6" }) })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ r("nav", { style: { padding: "12px 8px", display: "flex", flexDirection: "column", gap: "4px" }, children: i.map((w) => {
                  const I = w.id === o;
                  return /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: () => v(w),
                      title: m ? w.label : void 0,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: m ? "center" : "space-between",
                        gap: "12px",
                        width: "100%",
                        padding: m ? "10px 0" : "10px 14px",
                        background: I ? "var(--eg-color-emerald-glow, rgba(0, 220, 130, 0.12))" : "transparent",
                        border: "1px solid",
                        borderColor: I ? "rgba(16, 185, 129, 0.25)" : "transparent",
                        borderRadius: "var(--eg-radius-md, 10px)",
                        color: I ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #d1d5db)",
                        fontSize: "var(--eg-text-sm, 0.875rem)",
                        fontWeight: I ? 600 : 500,
                        cursor: "pointer",
                        transition: "all var(--eg-transition-fast, 150ms)"
                      },
                      children: [
                        /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                          w.icon && /* @__PURE__ */ r(
                            "span",
                            {
                              style: {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.1rem"
                              },
                              children: w.icon
                            }
                          ),
                          !m && /* @__PURE__ */ r("span", { children: w.label })
                        ] }),
                        !m && w.badge != null && /* @__PURE__ */ r(
                          "span",
                          {
                            style: {
                              padding: "2px 8px",
                              borderRadius: "var(--eg-radius-pill, 9999px)",
                              fontSize: "var(--eg-text-xs, 0.75rem)",
                              fontWeight: 600,
                              background: w.badgeColor || "var(--eg-bg-tertiary, #1f2937)",
                              color: "var(--eg-text-primary, #f9fafb)"
                            },
                            children: w.badge
                          }
                        )
                      ]
                    },
                    w.id
                  );
                }) })
              ] }),
              /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    padding: m ? "12px 8px" : "16px",
                    borderTop: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))"
                  },
                  children: m ? /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => f(!1),
                      style: {
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        color: "var(--eg-text-muted, #9ca3af)",
                        cursor: "pointer",
                        padding: "8px 0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      title: "Expand sidebar",
                      children: /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ r("path", { d: "M9 18l6-6-6-6" }) })
                    }
                  ) : l ? /* @__PURE__ */ d(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px"
                      },
                      children: [
                        /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }, children: [
                          l.photoURL ? /* @__PURE__ */ r(
                            "img",
                            {
                              src: l.photoURL,
                              alt: l.email,
                              style: { width: "32px", height: "32px", borderRadius: "50%" }
                            }
                          ) : /* @__PURE__ */ r(
                            "div",
                            {
                              style: {
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: "var(--eg-color-primary, #10b981)",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                flexShrink: 0
                              },
                              children: l.email.charAt(0).toUpperCase()
                            }
                          ),
                          /* @__PURE__ */ d("div", { style: { overflow: "hidden", whiteSpace: "nowrap" }, children: [
                            /* @__PURE__ */ r(
                              "div",
                              {
                                style: {
                                  fontSize: "var(--eg-text-xs, 0.8125rem)",
                                  fontWeight: 600,
                                  color: "var(--eg-text-primary, #f9fafb)",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden"
                                },
                                children: l.displayName || l.email.split("@")[0]
                              }
                            ),
                            /* @__PURE__ */ r(
                              "div",
                              {
                                style: {
                                  fontSize: "0.7rem",
                                  color: "var(--eg-text-muted, #9ca3af)",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden"
                                },
                                children: l.email
                              }
                            )
                          ] })
                        ] }),
                        s && /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: s,
                            style: {
                              background: "transparent",
                              border: "none",
                              color: "#f87171",
                              cursor: "pointer",
                              padding: "6px",
                              borderRadius: "var(--eg-radius-sm, 6px)"
                            },
                            title: "Sign Out",
                            children: /* @__PURE__ */ d("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                              /* @__PURE__ */ r("polyline", { points: "16 17 21 12 16 7" }),
                              /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
                            ] })
                          }
                        )
                      ]
                    }
                  ) : null
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: "100vh" }, children: [
          /* @__PURE__ */ d(
            "header",
            {
              style: {
                height: "64px",
                background: "var(--eg-bg-secondary, #111827)",
                borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 var(--eg-space-6, 24px)",
                position: "sticky",
                top: 0,
                zIndex: 99980
              },
              children: [
                /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => k(!0),
                      style: {
                        display: "none",
                        background: "transparent",
                        border: "none",
                        color: "var(--eg-text-primary, #f9fafb)",
                        cursor: "pointer",
                        padding: "6px"
                      },
                      className: "eg-admin-mobile-toggle",
                      children: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                      ] })
                    }
                  ),
                  /* @__PURE__ */ r(
                    "h2",
                    {
                      style: {
                        fontSize: "var(--eg-text-lg, 1.125rem)",
                        fontWeight: 700,
                        color: "var(--eg-text-primary, #f9fafb)",
                        margin: 0
                      },
                      children: b
                    }
                  )
                ] }),
                /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                  c,
                  /* @__PURE__ */ r(Lr, {}),
                  s && /* @__PURE__ */ d(
                    "button",
                    {
                      type: "button",
                      onClick: s,
                      style: {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        color: "#f87171",
                        fontSize: "var(--eg-text-xs, 0.8125rem)",
                        fontWeight: 600,
                        cursor: "pointer"
                      },
                      children: [
                        /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                          /* @__PURE__ */ r("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
                          /* @__PURE__ */ r("polyline", { points: "16 17 21 12 16 7" }),
                          /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "9", y2: "12" })
                        ] }),
                        /* @__PURE__ */ r("span", { children: "Sign Out" })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ r(
            "main",
            {
              style: {
                flex: 1,
                padding: "var(--eg-space-6, 24px)",
                maxWidth: "1600px",
                width: "100%",
                boxSizing: "border-box"
              },
              children: g
            }
          )
        ] }),
        /* @__PURE__ */ r("style", { children: `
        @media (max-width: 768px) {
          .eg-admin-mobile-toggle {
            display: flex !important;
          }
          aside {
            display: ${y ? "flex !important" : "none !important"};
          }
        }
      ` })
      ]
    }
  );
}, kn = "EG_ADMIN_SALT_2026", Xa = 3, Qa = 24 * 60 * 60 * 1e3, Qt = "eg_admin_pin_verified_uid", el = 18;
async function tl(t, e = kn) {
  if (typeof window > "u" || !window.crypto || !window.crypto.subtle)
    throw new Error("[eg-web-core] Web Crypto API is unavailable in this environment.");
  const i = new TextEncoder().encode(t + e), o = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(o)).map((l) => l.toString(16).padStart(2, "0")).join("");
}
async function yt() {
  if (typeof window > "u") return "unknown";
  try {
    const t = new AbortController(), e = setTimeout(() => t.abort(), 3e3), n = await fetch("https://api.ipify.org?format=json", { signal: t.signal });
    return clearTimeout(e), (await n.json()).ip || "unknown";
  } catch {
    return "unknown";
  }
}
function bt(t) {
  return t ? t.replace(/\./g, "_").replace(/[^a-zA-Z0-9_]/g, "") : "unknown";
}
async function vt(t, e = {}) {
  const n = {
    locked: !1,
    unlocksAt: null,
    failCount: 0,
    hoursRemaining: 0
  };
  if (!t || t === "unknown") return n;
  try {
    const i = e.db || window.db;
    if (!i) {
      if (typeof window < "u") {
        const u = localStorage.getItem(`admin_lock_${bt(t)}`);
        if (u) {
          const h = JSON.parse(u), m = new Date(h.unlocksAt);
          if (/* @__PURE__ */ new Date() < m) {
            const f = Math.max(1, Math.ceil((m.getTime() - Date.now()) / 36e5));
            return { locked: !0, unlocksAt: m, failCount: h.failCount || 3, hoursRemaining: f };
          }
        }
      }
      return n;
    }
    const o = e.lockoutCollection || "admin_lockout", a = i.collection(o).doc(bt(t)), l = await a.get();
    if (!l.exists) return n;
    const s = l.data() || {}, p = s.failCount || 0;
    if (!s.lockedUntil)
      return { ...n, failCount: p };
    const c = s.lockedUntil.toDate ? s.lockedUntil.toDate() : new Date(s.lockedUntil), g = /* @__PURE__ */ new Date();
    if (g < c) {
      const u = c.getTime() - g.getTime(), h = Math.max(1, Math.ceil(u / 36e5));
      return {
        locked: !0,
        unlocksAt: c,
        failCount: p,
        hoursRemaining: h
      };
    } else {
      try {
        await a.update({ failCount: 0, lockedUntil: null });
      } catch {
      }
      return n;
    }
  } catch (i) {
    return console.warn("[eg-web-core] checkAdminLockout error (fail-open):", i.message), n;
  }
}
async function Et(t, e, n, i = {}) {
  var s, p, c, g, u, h, m, f;
  const o = i.maxFailAttempts ?? Xa, a = i.lockoutDurationMs ?? Qa, l = bt(t);
  try {
    const y = i.db || window.db;
    if (y) {
      const k = i.lockoutCollection || "admin_lockout", v = y.collection(k).doc(l), x = await v.get(), w = (x.exists && x.data().failCount || 0) + 1, I = {
        ipAddress: t,
        email: e,
        failCount: w,
        lastFailAt: ((c = (p = (s = window.firebase) == null ? void 0 : s.firestore) == null ? void 0 : p.FieldValue) == null ? void 0 : c.serverTimestamp()) || /* @__PURE__ */ new Date()
      };
      if (w >= o) {
        const T = new Date(Date.now() + a), C = (u = (g = window.firebase) == null ? void 0 : g.firestore) == null ? void 0 : u.Timestamp;
        I.lockedUntil = C ? C.fromDate(T) : T.toISOString(), I.lockedAt = ((f = (m = (h = window.firebase) == null ? void 0 : h.firestore) == null ? void 0 : m.FieldValue) == null ? void 0 : f.serverTimestamp()) || /* @__PURE__ */ new Date();
      }
      await v.set(I, { merge: !0 });
    } else if (typeof window < "u") {
      const k = `admin_lock_${l}`, v = localStorage.getItem(k), b = ((v ? JSON.parse(v) : { failCount: 0 }).failCount || 0) + 1, w = { ip: t, email: e, failCount: b };
      b >= o && (w.unlocksAt = new Date(Date.now() + a).toISOString()), localStorage.setItem(k, JSON.stringify(w));
    }
    await Sn({
      email: e,
      ipAddress: t,
      outcome: n,
      userAgent: typeof navigator < "u" ? navigator.userAgent : "",
      uid: null,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, i);
  } catch (y) {
    console.warn("[eg-web-core] recordAdminFailedAttempt warning:", y.message);
  }
}
async function rl(t, e = {}) {
  const n = bt(t);
  try {
    const i = e.db || window.db;
    if (i) {
      const o = e.lockoutCollection || "admin_lockout";
      await i.collection(o).doc(n).delete();
    }
    typeof window < "u" && localStorage.removeItem(`admin_lock_${n}`);
  } catch {
  }
}
async function Sn(t, e = {}) {
  try {
    const n = e.db || window.db;
    if (!n) return;
    const i = e.logCollection || "admin_login_log", o = n.collection(i).doc("meta");
    await n.runTransaction(async (a) => {
      var u, h, m, f;
      const l = await a.get(o);
      let s = 1, p = 0;
      l.exists && (s = l.data().currentPage || 1, p = l.data().currentCount || 0), p >= el && (s++, p = 0);
      const c = n.collection(i).doc(`page_${s}`), g = window.firebase;
      a.set(
        c,
        {
          pageNum: s,
          logs: (h = (u = g == null ? void 0 : g.firestore) == null ? void 0 : u.FieldValue) != null && h.arrayUnion ? g.firestore.FieldValue.arrayUnion({
            ...t,
            timestamp: t.timestamp || (/* @__PURE__ */ new Date()).toISOString()
          }) : [{ ...t, timestamp: t.timestamp || (/* @__PURE__ */ new Date()).toISOString() }]
        },
        { merge: !0 }
      ), a.set(o, {
        currentPage: s,
        currentCount: p + 1,
        lastUpdated: ((f = (m = g == null ? void 0 : g.firestore) == null ? void 0 : m.FieldValue) == null ? void 0 : f.serverTimestamp()) || /* @__PURE__ */ new Date()
      });
    });
  } catch (n) {
    console.warn("[eg-web-core] logAdminLoginAttempt failed (non-critical):", n.message);
  }
}
function br(t, e = Qt) {
  if (typeof window > "u" || !t) return !1;
  try {
    return sessionStorage.getItem(e) === t;
  } catch {
    return !1;
  }
}
function nl(t, e = Qt) {
  if (!(typeof window > "u" || !t))
    try {
      sessionStorage.setItem(e, t);
    } catch {
    }
}
function qe(t = Qt) {
  if (!(typeof window > "u"))
    try {
      sessionStorage.removeItem(t);
    } catch {
    }
}
async function il(t = {}) {
  const e = await yt(), n = await vt(e, t);
  if (n.locked)
    throw new Error(
      `Access is temporarily blocked due to repeated failed attempts. Please try again in ${n.hoursRemaining} hour(s).`
    );
  const i = await Nt(t.firebaseConfig, t.appName), o = window.firebase;
  if (!i || !o || !o.auth)
    throw new Error("[eg-web-core] Firebase Authentication SDK is unavailable.");
  try {
    o.auth.Auth && o.auth.Auth.Persistence && await i.setPersistence(o.auth.Auth.Persistence.SESSION);
  } catch {
  }
  const a = new o.auth.GoogleAuthProvider();
  let l = null;
  try {
    l = await i.signInWithPopup(a);
  } catch (c) {
    throw c.code === "auth/popup-closed-by-user" ? new Error("Sign-in popup was cancelled by user.") : (await Et(e, "unknown-google-user", "fail_google", t), c);
  }
  const s = l.user;
  if (!s || !s.email)
    throw new Error("No user profile received from Google Authentication.");
  const p = t.allowedEmails;
  if (p && p.length > 0 && !p.some((g) => g.toLowerCase() === s.email.toLowerCase()))
    throw await i.signOut(), qe(t.sessionKey), await Et(e, s.email, "fail_unauthorized", t), new Error(`Unauthorized account (${s.email}). Access to this administrative portal is restricted.`);
  return {
    uid: s.uid,
    email: s.email,
    displayName: s.displayName,
    photoURL: s.photoURL
  };
}
async function ol(t, e, n = {}) {
  var g, u;
  const i = n.pinLength ?? 16, o = t.replace(/\D/g, "");
  if (o.length !== i)
    return {
      success: !1,
      error: `PIN must be exactly ${i} numeric digits. Received ${o.length}.`
    };
  const a = n.ip || await yt(), l = await vt(a, n);
  if (l.locked)
    return {
      success: !1,
      error: `Access blocked due to excessive failed attempts. Try again in ${l.hoursRemaining} hour(s).`
    };
  const s = n.salt || n.pinSalt || kn, p = await tl(o, s);
  let c = !1;
  if (n.expectedPinHash)
    c = n.expectedPinHash.toLowerCase() === p.toLowerCase();
  else
    try {
      const h = n.db || await Tn(n.firebaseConfig), m = n.securityCollection || "admin_security", f = await h.collection(m).doc(e.uid).get();
      if (f.exists)
        c = (((g = f.data()) == null ? void 0 : g.pinHash) || "").toLowerCase() === p.toLowerCase();
      else {
        const y = await h.collection(m).doc("config").get();
        y.exists && (c = (((u = y.data()) == null ? void 0 : u.pinHash) || "").toLowerCase() === p.toLowerCase());
      }
    } catch (h) {
      return {
        success: !1,
        error: `Database error while verifying PIN: ${h.message}`
      };
    }
  return c ? (nl(e.uid, n.sessionKey), await rl(a, n), await Sn({
    email: e.email,
    ipAddress: a,
    outcome: "success",
    userAgent: typeof navigator < "u" ? navigator.userAgent : "",
    uid: e.uid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, n), { success: !0 }) : (qe(n.sessionKey), await Et(a, e.email, "fail_pin", n), {
    success: !1,
    error: "Incorrect security PIN. Access denied."
  });
}
async function al(t = {}) {
  qe(t.sessionKey);
  try {
    const e = await Nt(t.firebaseConfig);
    e && typeof e.signOut == "function" && await e.signOut();
  } catch (e) {
    console.warn("[eg-web-core] adminSignOut warning:", e.message);
  }
}
function Cn(t = {}) {
  const [e, n] = _(null), [i, o] = _(!1), [a, l] = _(!0), [s, p] = _(null), [c, g] = _("unknown"), [u, h] = _({
    locked: !1,
    unlocksAt: null,
    failCount: 0,
    hoursRemaining: 0
  }), m = te(async () => {
    try {
      const b = c !== "unknown" ? c : await yt();
      if (b !== "unknown") {
        g(b);
        const w = await vt(b, t);
        h(w);
      }
    } catch {
    }
  }, [c, t]);
  Y(() => {
    let b = !0;
    async function w() {
      l(!0);
      try {
        const I = await yt();
        if (b) {
          g(I);
          const C = await vt(I, t);
          h(C);
        }
        const T = await Nt(t.firebaseConfig, t.appName);
        T && typeof T.onAuthStateChanged == "function" ? T.onAuthStateChanged((C) => {
          if (b) {
            if (C && C.email) {
              if (t.allowedEmails && t.allowedEmails.length > 0 && !t.allowedEmails.some(
                (R) => R.toLowerCase() === C.email.toLowerCase()
              )) {
                qe(t.sessionKey), n(null), o(!1), l(!1), T.signOut();
                return;
              }
              const M = {
                uid: C.uid,
                email: C.email,
                displayName: C.displayName,
                photoURL: C.photoURL
              };
              n(M);
              const W = br(C.uid, t.sessionKey);
              o(W);
            } else
              n(null), o(!1);
            l(!1);
          }
        }) : l(!1);
      } catch (I) {
        b && (p(I.message || "Failed to initialize administrative security layer."), l(!1));
      }
    }
    return w(), () => {
      b = !1;
    };
  }, [t.sessionKey, t.firebaseConfig, t.appName]);
  const f = te(async () => {
    p(null), l(!0);
    try {
      const b = await il(t);
      n(b);
      const w = br(b.uid, t.sessionKey);
      return o(w), await m(), l(!1), b;
    } catch (b) {
      return p(b.message || "Google authentication failed."), await m(), l(!1), null;
    }
  }, [t, m]), y = te(
    async (b, w = {}) => {
      if (!e)
        return p("Please sign in with Google first."), !1;
      p(null), l(!0);
      try {
        const I = await ol(b, e, {
          ...t,
          ...w,
          ip: c
        });
        return I.success ? (o(!0), p(null), await m(), l(!1), !0) : (o(!1), p(I.error || "Incorrect security PIN."), await m(), l(!1), !1);
      } catch (I) {
        return o(!1), p(I.message || "Failed to verify security PIN."), await m(), l(!1), !1;
      }
    },
    [e, t, c, m]
  ), k = te(async () => {
    l(!0);
    try {
      await al(t), n(null), o(!1), p(null);
    } finally {
      l(!1);
    }
  }, [t]), v = te(() => {
    qe(t.sessionKey), o(!1);
  }, [t.sessionKey]), x = te(() => {
    p(null);
  }, []);
  return {
    user: e,
    isPinVerified: i,
    isAuthenticated: !!(e && i),
    isLoading: a,
    error: s,
    lockout: u,
    clientIP: c,
    loginWithGoogle: f,
    verifyPin: y,
    logout: k,
    resetPinPrompt: v,
    refreshLockout: m,
    clearError: x
  };
}
const ll = ({
  title: t = "Admin Portal",
  subtitle: e = "Sign in with your authorized administrator credentials",
  logo: n,
  allowedEmails: i,
  pinConfig: o,
  authConfig: a,
  onSuccess: l,
  style: s,
  className: p = ""
}) => {
  const c = {
    ...a,
    ...i ? { allowedEmails: i } : {},
    ...o != null && o.salt ? { pinSalt: o.salt } : {}
  }, {
    user: g,
    isAuthenticated: u,
    isLoading: h,
    error: m,
    lockout: f,
    loginWithGoogle: y,
    verifyPin: k,
    logout: v,
    clearError: x
  } = Cn(c), [b, w] = _(["", "", "", ""]), [I, T] = _(!1), [C, M] = _(!1), W = [
    xe(null),
    xe(null),
    xe(null),
    xe(null)
  ];
  Y(() => {
    u && g && l && l(g);
  }, [u, g, l]), Y(() => {
    g && !u && setTimeout(() => {
      var $;
      ($ = W[0].current) == null || $.focus();
    }, 100);
  }, [g, u]);
  const P = ($, L) => {
    var A;
    const S = L.replace(/\D/g, "");
    if (S.length > 4) {
      E(S);
      return;
    }
    const N = [...b];
    N[$] = S, w(N), S.length === 4 && $ < 3 && ((A = W[$ + 1].current) == null || A.focus());
  }, R = ($, L) => {
    var S;
    L.key === "Backspace" && b[$].length === 0 && $ > 0 && ((S = W[$ - 1].current) == null || S.focus());
  }, E = ($) => {
    var V, B, H, U;
    const L = $.replace(/\D/g, "").slice(0, 16), S = L.slice(0, 4), N = L.slice(4, 8), A = L.slice(8, 12), D = L.slice(12, 16);
    w([S, N, A, D]), L.length >= 16 ? (V = W[3].current) == null || V.focus() : L.length >= 12 ? (B = W[3].current) == null || B.focus() : L.length >= 8 ? (H = W[2].current) == null || H.focus() : L.length >= 4 && ((U = W[1].current) == null || U.focus());
  }, j = ($) => {
    $.preventDefault();
    const L = $.clipboardData.getData("text");
    E(L);
  }, z = async ($) => {
    $.preventDefault(), x();
    const L = b.join("");
    if (L.length !== 16)
      return;
    M(!0);
    const S = await k(L, o);
    M(!1), S && g && l && l(g);
  }, O = b.join("").length;
  return /* @__PURE__ */ r(
    "div",
    {
      className: `eg-admin-login-wrapper ${p}`,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh",
        padding: "var(--eg-space-4, 16px)",
        ...s
      },
      children: /* @__PURE__ */ d(
        "div",
        {
          className: "eg-admin-login-card",
          style: {
            width: "100%",
            maxWidth: "460px",
            background: "var(--eg-bg-secondary, #111827)",
            border: "1px solid var(--eg-border, rgba(255,255,255,0.08))",
            borderRadius: "var(--eg-radius-xl, 20px)",
            padding: "var(--eg-space-8, 32px)",
            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4)",
            position: "relative",
            overflow: "hidden"
          },
          children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, var(--eg-color-emerald-glow, rgba(0, 220, 130, 0.15)) 0%, transparent 70%)",
                  pointerEvents: "none"
                }
              }
            ),
            /* @__PURE__ */ d("div", { style: { textAlign: "center", marginBottom: "var(--eg-space-6, 24px)" }, children: [
              n ? /* @__PURE__ */ r("div", { style: { display: "inline-flex", marginBottom: "var(--eg-space-3, 12px)" }, children: n }) : /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    width: "56px",
                    height: "56px",
                    borderRadius: "var(--eg-radius-lg, 14px)",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--eg-color-primary, #10b981)",
                    marginBottom: "var(--eg-space-3, 12px)"
                  },
                  children: /* @__PURE__ */ d("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                    /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                    /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                  ] })
                }
              ),
              /* @__PURE__ */ r(
                "h1",
                {
                  style: {
                    fontSize: "var(--eg-text-2xl, 1.5rem)",
                    fontWeight: 700,
                    color: "var(--eg-text-primary, #f9fafb)",
                    margin: "0 0 var(--eg-space-1, 4px) 0",
                    fontFamily: "var(--eg-font-sans, inherit)"
                  },
                  children: t
                }
              ),
              /* @__PURE__ */ r(
                "p",
                {
                  style: {
                    fontSize: "var(--eg-text-sm, 0.875rem)",
                    color: "var(--eg-text-muted, #9ca3af)",
                    margin: 0
                  },
                  children: g ? "Enter your 16-digit security PIN" : e
                }
              )
            ] }),
            f.locked && /* @__PURE__ */ d(
              "div",
              {
                style: {
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "var(--eg-radius-md, 10px)",
                  padding: "var(--eg-space-3, 12px) var(--eg-space-4, 16px)",
                  color: "#f87171",
                  fontSize: "var(--eg-text-sm, 0.875rem)",
                  marginBottom: "var(--eg-space-4, 16px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                },
                children: [
                  /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { flexShrink: 0 }, children: [
                    /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
                    /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                    /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                  ] }),
                  /* @__PURE__ */ d("span", { children: [
                    "Too many failed attempts. Access blocked for ",
                    /* @__PURE__ */ d("strong", { children: [
                      f.hoursRemaining,
                      " hour(s)"
                    ] }),
                    "."
                  ] })
                ]
              }
            ),
            m && !f.locked && /* @__PURE__ */ d(
              "div",
              {
                style: {
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "var(--eg-radius-md, 10px)",
                  padding: "var(--eg-space-3, 12px) var(--eg-space-4, 16px)",
                  color: "#f87171",
                  fontSize: "var(--eg-text-sm, 0.875rem)",
                  marginBottom: "var(--eg-space-4, 16px)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                },
                children: [
                  /* @__PURE__ */ r("span", { children: m }),
                  /* @__PURE__ */ r(
                    "button",
                    {
                      onClick: x,
                      style: {
                        background: "transparent",
                        border: "none",
                        color: "#f87171",
                        cursor: "pointer",
                        padding: "2px 6px",
                        fontSize: "1rem"
                      },
                      children: "✕"
                    }
                  )
                ]
              }
            ),
            !g && /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-4, 16px)" }, children: [
              /* @__PURE__ */ d(
                "button",
                {
                  type: "button",
                  disabled: h || f.locked,
                  onClick: () => y(),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    width: "100%",
                    padding: "12px 20px",
                    background: f.locked ? "var(--eg-bg-tertiary, #1f2937)" : "#ffffff",
                    color: f.locked ? "var(--eg-text-muted, #9ca3af)" : "#1f2937",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "var(--eg-radius-md, 10px)",
                    fontSize: "var(--eg-text-base, 1rem)",
                    fontWeight: 600,
                    cursor: f.locked || h ? "not-allowed" : "pointer",
                    transition: "all var(--eg-transition-normal, 220ms)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    opacity: f.locked ? 0.6 : 1
                  },
                  children: [
                    /* @__PURE__ */ d("svg", { width: "20", height: "20", viewBox: "0 0 24 24", children: [
                      /* @__PURE__ */ r(
                        "path",
                        {
                          fill: "#4285F4",
                          d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "path",
                        {
                          fill: "#34A853",
                          d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "path",
                        {
                          fill: "#FBBC05",
                          d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "path",
                        {
                          fill: "#EA4335",
                          d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ r("span", { children: h ? "Connecting to Google..." : "Sign in with Google" })
                  ]
                }
              ),
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    justifyContent: "center",
                    fontSize: "var(--eg-text-xs, 0.75rem)",
                    color: "var(--eg-text-muted, #9ca3af)",
                    marginTop: "var(--eg-space-2, 8px)"
                  },
                  children: [
                    /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                      /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                    ] }),
                    /* @__PURE__ */ r("span", { children: "Restricted administrator access. Two-factor challenge required." })
                  ]
                }
              )
            ] }),
            g && !u && /* @__PURE__ */ d("form", { onSubmit: z, style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-4, 16px)" }, children: [
              /* @__PURE__ */ d(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    background: "var(--eg-bg-tertiary, #1f2937)",
                    borderRadius: "var(--eg-radius-md, 10px)",
                    border: "1px solid var(--eg-border, rgba(255,255,255,0.06))"
                  },
                  children: [
                    /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }, children: [
                      g.photoURL ? /* @__PURE__ */ r(
                        "img",
                        {
                          src: g.photoURL,
                          alt: g.email,
                          style: { width: "24px", height: "24px", borderRadius: "50%" }
                        }
                      ) : /* @__PURE__ */ r(
                        "div",
                        {
                          style: {
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            background: "var(--eg-color-primary, #10b981)",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            fontWeight: 700
                          },
                          children: g.email.charAt(0).toUpperCase()
                        }
                      ),
                      /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            fontSize: "var(--eg-text-xs, 0.8125rem)",
                            color: "var(--eg-text-primary, #f9fafb)",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            maxWidth: "220px"
                          },
                          children: g.email
                        }
                      )
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => v(),
                        style: {
                          background: "none",
                          border: "none",
                          color: "var(--eg-color-sky, #38bdf8)",
                          fontSize: "var(--eg-text-xs, 0.75rem)",
                          cursor: "pointer",
                          padding: "2px 4px",
                          fontWeight: 500
                        },
                        children: "Switch"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ d("div", { children: [
                /* @__PURE__ */ d(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "var(--eg-space-2, 8px)"
                    },
                    children: [
                      /* @__PURE__ */ r(
                        "label",
                        {
                          style: {
                            fontSize: "var(--eg-text-xs, 0.75rem)",
                            fontWeight: 600,
                            color: "var(--eg-text-secondary, #d1d5db)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em"
                          },
                          children: "16-Digit Master Security PIN"
                        }
                      ),
                      /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          onClick: () => T(!I),
                          style: {
                            background: "none",
                            border: "none",
                            color: "var(--eg-text-muted, #9ca3af)",
                            fontSize: "var(--eg-text-xs, 0.75rem)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px"
                          },
                          children: I ? "Hide" : "Show"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "repeat(4, 1fr)",
                      gap: "8px"
                    },
                    children: [0, 1, 2, 3].map(($) => /* @__PURE__ */ r(
                      "input",
                      {
                        ref: W[$],
                        type: I ? "text" : "password",
                        inputMode: "numeric",
                        maxLength: 4,
                        value: b[$],
                        onChange: (L) => P($, L.target.value),
                        onKeyDown: (L) => R($, L),
                        onPaste: $ === 0 ? j : void 0,
                        placeholder: "••••",
                        autoComplete: "off",
                        style: {
                          width: "100%",
                          height: "48px",
                          textAlign: "center",
                          fontSize: "1.25rem",
                          fontFamily: "var(--eg-font-mono, monospace)",
                          fontWeight: 600,
                          letterSpacing: "0.15em",
                          background: "var(--eg-bg-primary, #030712)",
                          border: b[$].length === 4 ? "1px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                          borderRadius: "var(--eg-radius-md, 10px)",
                          color: "var(--eg-text-primary, #f9fafb)",
                          outline: "none",
                          transition: "border-color var(--eg-transition-fast, 150ms)",
                          boxSizing: "border-box"
                        }
                      },
                      $
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "submit",
                  disabled: O !== 16 || C || f.locked,
                  style: {
                    width: "100%",
                    padding: "12px 20px",
                    background: O === 16 && !C && !f.locked ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
                    color: O === 16 && !C && !f.locked ? "#ffffff" : "var(--eg-text-muted, #9ca3af)",
                    border: "none",
                    borderRadius: "var(--eg-radius-md, 10px)",
                    fontSize: "var(--eg-text-base, 1rem)",
                    fontWeight: 600,
                    cursor: O === 16 && !C && !f.locked ? "pointer" : "not-allowed",
                    transition: "all var(--eg-transition-normal, 220ms)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  },
                  children: C ? /* @__PURE__ */ d(ce, { children: [
                    /* @__PURE__ */ r(
                      "span",
                      {
                        style: {
                          width: "16px",
                          height: "16px",
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#ffffff",
                          borderRadius: "50%",
                          animation: "spin 0.8s linear infinite",
                          display: "inline-block"
                        }
                      }
                    ),
                    /* @__PURE__ */ r("span", { children: "Verifying SHA-256 Hash..." })
                  ] }) : /* @__PURE__ */ d(ce, { children: [
                    /* @__PURE__ */ d("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                      /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" })
                    ] }),
                    /* @__PURE__ */ r("span", { children: "Verify & Unlock Portal" })
                  ] })
                }
              ),
              /* @__PURE__ */ r(
                "div",
                {
                  style: {
                    textAlign: "center",
                    fontSize: "var(--eg-text-xs, 0.75rem)",
                    color: "var(--eg-text-muted, #9ca3af)"
                  },
                  children: "3 consecutive incorrect attempts trigger a 24-hour IP block."
                }
              )
            ] })
          ]
        }
      )
    }
  );
}, us = ({
  children: t,
  authConfig: e,
  pinConfig: n,
  loginProps: i,
  loadingFallback: o
}) => {
  const a = {
    ...e,
    ...n != null && n.salt ? { pinSalt: n.salt } : {}
  }, { user: l, isAuthenticated: s, isLoading: p, logout: c } = Cn(a);
  return p ? o ? /* @__PURE__ */ r(ce, { children: o }) : /* @__PURE__ */ d(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: "var(--eg-space-4, 16px)",
        color: "var(--eg-text-muted, #9ca3af)"
      },
      children: [
        /* @__PURE__ */ r(
          "div",
          {
            style: {
              width: "36px",
              height: "36px",
              border: "3px solid rgba(16, 185, 129, 0.2)",
              borderTopColor: "var(--eg-color-primary, #10b981)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }
          }
        ),
        /* @__PURE__ */ r("span", { style: { fontSize: "var(--eg-text-sm, 0.875rem)", fontWeight: 500 }, children: "Verifying administrative authorization..." })
      ]
    }
  ) : !s || !l ? /* @__PURE__ */ r(
    ll,
    {
      authConfig: a,
      pinConfig: n,
      ...i
    }
  ) : typeof t == "function" ? /* @__PURE__ */ r(ce, { children: t({ user: l, logout: c }) }) : /* @__PURE__ */ r(ce, { children: t });
};
function vr() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
const fs = ({
  db: t,
  collectionName: e,
  domains: n,
  customFetcher: i,
  style: o,
  className: a = ""
}) => {
  var j;
  const l = kt(), s = e || ((j = l.collections) == null ? void 0 : j.analytics) || "visitor_analytics", [p, c] = _({
    totalVisitors: 0,
    todayCount: 0,
    todayDate: vr(),
    currentPage: 1
  }), [g, u] = _(1), [h, m] = _(1), [f, y] = _([]), [k, v] = _(!0), [x, b] = _("All Domains"), [w, I] = _(null), [T, C] = _("details"), M = te(async (z) => {
    var O, $;
    v(!0);
    try {
      if (i) {
        const U = await i();
        c(U.meta), y(U.logs), m(U.meta.currentPage || 1), v(!1);
        return;
      }
      const L = t || l.db || window.db || (($ = (O = window.firebase) == null ? void 0 : O.firestore) == null ? void 0 : $.call(O));
      if (!L) {
        v(!1);
        return;
      }
      const S = await L.collection(s).doc("meta").get();
      let N = 1, A = 0, D = 0;
      if (S.exists) {
        const U = S.data() || {};
        A = U.totalVisitors || 0, N = U.currentPage || 1;
        const G = vr();
        D = U.todayDate === G && U.todayCount || 0, c({
          totalVisitors: A,
          todayCount: D,
          todayDate: U.todayDate || G,
          currentPage: N
        });
      }
      m(N);
      const B = Math.max(1, N - (z ?? g) + 1), H = await L.collection(s).doc(`page_${B}`).get();
      if (H.exists) {
        const J = ((H.data() || {}).logs || []).map((F, oe) => {
          const ie = [];
          F.city && F.city !== "Unknown" && F.city !== "N/A" && ie.push(F.city), F.region && F.region !== "Unknown" && F.region !== "N/A" && ie.push(F.region), F.country && F.country !== "Unknown" && F.country !== "N/A" && ie.push(F.country);
          const ae = ie.length > 0 ? ie.join(", ") : "Unknown";
          return {
            id: F.id || `v_log_${B}_${oe}`,
            timestamp: F.timestamp || "",
            appName: F.appName || "web-app",
            pageVisited: F.pageVisited || "/",
            referrer: F.referrer || "Direct",
            ip: F.ip || "Unknown",
            city: F.city || "Unknown",
            region: F.region || "Unknown",
            country: F.country || "Unknown",
            postal: F.postal || "N/A",
            org: F.org || "",
            timezone: F.timezone || "Unknown",
            os: F.os || "Unknown",
            browser: F.browser || "Unknown",
            screen: F.screen || "N/A",
            language: F.language || "en",
            location: ae,
            raw: F
          };
        });
        J.reverse(), y(J);
      } else
        y([]);
    } catch (L) {
      console.warn("[eg-web-core] loadAnalytics warning:", L.message);
    } finally {
      v(!1);
    }
  }, [t, l.db, s, i, g]);
  Y(() => {
    M();
  }, [M]);
  const W = (z) => {
    const O = Math.max(1, Math.min(z, h));
    u(O), M(O);
  }, P = ee(() => n && n.length > 0 ? n : ["All Domains", ...Array.from(new Set(f.map((O) => O.appName).filter(Boolean)))], [n, f]), R = ee(() => x === "All Domains" ? f : f.filter((z) => z.appName.toLowerCase().includes(x.toLowerCase())), [f, x]), E = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortType: "date",
      width: "180px",
      render: (z) => {
        if (!z.timestamp) return "—";
        const O = new Date(z.timestamp);
        return /* @__PURE__ */ d("div", { style: { fontSize: "0.8125rem" }, children: [
          /* @__PURE__ */ r("div", { style: { fontWeight: 600 }, children: O.toLocaleDateString() }),
          /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.75rem" }, children: O.toLocaleTimeString() })
        ] });
      }
    },
    {
      key: "appName",
      label: "Application / Domain",
      width: "150px",
      render: (z) => /* @__PURE__ */ r(
        "span",
        {
          style: {
            padding: "3px 8px",
            borderRadius: "var(--eg-radius-sm, 6px)",
            background: "rgba(56, 189, 248, 0.12)",
            color: "var(--eg-color-sky, #38bdf8)",
            fontSize: "0.75rem",
            fontWeight: 600
          },
          children: z.appName
        }
      )
    },
    {
      key: "pageVisited",
      label: "Page Visited",
      render: (z) => /* @__PURE__ */ r(
        "span",
        {
          style: {
            fontFamily: "var(--eg-font-mono, monospace)",
            fontSize: "0.8125rem",
            color: "var(--eg-text-primary, #f9fafb)"
          },
          children: z.pageVisited
        }
      )
    },
    {
      key: "location",
      label: "Location",
      render: (z) => /* @__PURE__ */ r("span", { children: z.location || "Unknown" })
    },
    {
      key: "ip",
      label: "IP Address",
      sortType: "ip",
      width: "130px",
      render: (z) => /* @__PURE__ */ r("span", { style: { fontFamily: "var(--eg-font-mono, monospace)", fontSize: "0.8125rem" }, children: z.ip })
    },
    {
      key: "os",
      label: "OS / Device",
      width: "120px",
      render: (z) => /* @__PURE__ */ r("span", { children: z.os || "Unknown" })
    },
    {
      key: "browser",
      label: "Browser",
      width: "120px",
      render: (z) => /* @__PURE__ */ r("span", { children: z.browser || "Unknown" })
    },
    {
      key: "actions",
      label: "Action",
      sortable: !1,
      align: "center",
      width: "90px",
      render: (z) => /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: (O) => {
            O.stopPropagation(), I(z), C("details");
          },
          style: {
            padding: "4px 8px",
            background: "var(--eg-bg-tertiary, #1f2937)",
            border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
            borderRadius: "var(--eg-radius-sm, 6px)",
            color: "var(--eg-color-primary, #10b981)",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer"
          },
          children: "View"
        }
      )
    }
  ];
  return /* @__PURE__ */ d("div", { className: `eg-admin-analytics-view ${a}`.trim(), style: o, children: [
    /* @__PURE__ */ d("div", { className: "eg-admin-analytics-view__stats", children: [
      /* @__PURE__ */ r(
        He,
        {
          title: "Total Unique Visitors",
          value: p.totalVisitors,
          subtitle: "Cumulative across all recorded domains",
          icon: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ r("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
            /* @__PURE__ */ r("circle", { cx: "9", cy: "7", r: "4" }),
            /* @__PURE__ */ r("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
            /* @__PURE__ */ r("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
          ] }),
          iconBgColor: "rgba(16, 185, 129, 0.15)",
          iconColor: "var(--eg-color-primary, #10b981)"
        }
      ),
      /* @__PURE__ */ r(
        He,
        {
          title: "Today's Visitors",
          value: p.todayCount,
          subtitle: `Date: ${p.todayDate}`,
          trend: { value: "Active", direction: "up" },
          icon: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
            /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
            /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
            /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
          ] }),
          iconBgColor: "rgba(56, 189, 248, 0.15)",
          iconColor: "var(--eg-color-sky, #38bdf8)"
        }
      ),
      /* @__PURE__ */ r(
        He,
        {
          title: "Telemetry Storage Buckets",
          value: `${g} / ${h}`,
          subtitle: "50 visitor logs per bucket page",
          icon: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ r("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
            /* @__PURE__ */ r("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
            /* @__PURE__ */ r("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
          ] }),
          iconBgColor: "rgba(245, 158, 11, 0.15)",
          iconColor: "var(--eg-color-amber, #f59e0b)"
        }
      )
    ] }),
    /* @__PURE__ */ r(
      wn,
      {
        data: R,
        columns: E,
        keyExtractor: (z) => z.id,
        loading: k,
        exportFileName: `analytics_bucket_${g}.csv`,
        toolbarSlot: /* @__PURE__ */ d("div", { className: "eg-admin-analytics-view__toolbar", children: [
          /* @__PURE__ */ r(
            "select",
            {
              value: x,
              onChange: (z) => b(z.target.value),
              className: "eg-admin-analytics-view__filter-select",
              children: P.map((z) => /* @__PURE__ */ r("option", { value: z, children: z }, z))
            }
          ),
          /* @__PURE__ */ d("div", { className: "eg-admin-analytics-view__stepper", children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                disabled: g <= 1 || k,
                onClick: () => W(g - 1),
                className: "eg-admin-analytics-view__stepper-btn",
                style: {
                  cursor: g <= 1 ? "not-allowed" : "pointer",
                  opacity: g <= 1 ? 0.3 : 1
                },
                title: "Newer bucket",
                children: "‹"
              }
            ),
            /* @__PURE__ */ d("span", { className: "eg-admin-analytics-view__stepper-label", children: [
              "Bucket ",
              g,
              " of ",
              h
            ] }),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                disabled: g >= h || k,
                onClick: () => W(g + 1),
                className: "eg-admin-analytics-view__stepper-btn",
                style: {
                  cursor: g >= h ? "not-allowed" : "pointer",
                  opacity: g >= h ? 0.3 : 1
                },
                title: "Older bucket",
                children: "›"
              }
            )
          ] }),
          /* @__PURE__ */ d(
            "button",
            {
              type: "button",
              onClick: () => M(),
              disabled: k,
              className: "eg-admin-analytics-view__refresh-btn",
              style: { cursor: k ? "not-allowed" : "pointer" },
              children: [
                /* @__PURE__ */ d(
                  "svg",
                  {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    style: {
                      animation: k ? "spin 0.8s linear infinite" : "none"
                    },
                    children: [
                      /* @__PURE__ */ r("path", { d: "M23 4v6h-6" }),
                      /* @__PURE__ */ r("path", { d: "M1 20v-6h6" }),
                      /* @__PURE__ */ r("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                    ]
                  }
                ),
                /* @__PURE__ */ r("span", { children: "Refresh" })
              ]
            }
          )
        ] })
      }
    ),
    w && /* @__PURE__ */ r(
      dt,
      {
        isOpen: !!w,
        onClose: () => I(null),
        title: /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ r("span", { children: "Visitor Telemetry Details" }),
          /* @__PURE__ */ r(
            "span",
            {
              style: {
                fontSize: "0.75rem",
                padding: "2px 6px",
                borderRadius: "4px",
                background: "rgba(56, 189, 248, 0.15)",
                color: "var(--eg-color-sky, #38bdf8)"
              },
              children: w.appName
            }
          )
        ] }),
        maxWidth: "700px",
        footer: /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
          /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => C("details"),
                style: {
                  padding: "4px 10px",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "none",
                  background: T === "details" ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  cursor: "pointer"
                },
                children: "Formatted Details"
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => C("json"),
                style: {
                  padding: "4px 10px",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "none",
                  background: T === "json" ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
                  color: "#ffffff",
                  fontSize: "0.75rem",
                  cursor: "pointer"
                },
                children: "Raw JSON"
              }
            )
          ] }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => I(null),
              style: {
                padding: "6px 16px",
                background: "var(--eg-bg-tertiary, #1f2937)",
                border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "var(--eg-text-primary, #f9fafb)",
                fontSize: "0.8125rem",
                cursor: "pointer"
              },
              children: "Close"
            }
          )
        ] }),
        children: T === "details" ? /* @__PURE__ */ r(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              fontSize: "0.8125rem",
              maxHeight: "60vh",
              overflowY: "auto",
              padding: "4px"
            },
            children: [
              { label: "Timestamp", val: w.timestamp ? new Date(w.timestamp).toLocaleString() : "N/A" },
              { label: "Application", val: w.appName },
              { label: "Page Visited", val: w.pageVisited },
              { label: "Referrer", val: w.referrer || "Direct" },
              { label: "IP Address", val: w.ip },
              { label: "City", val: w.city || "Unknown" },
              { label: "Region / State", val: w.region || "Unknown" },
              { label: "Country", val: w.country || "Unknown" },
              { label: "Postal Code", val: w.postal || "N/A" },
              { label: "ISP / Organization", val: w.org || "N/A" },
              { label: "Timezone", val: w.timezone || "Unknown" },
              { label: "Operating System", val: w.os || "Unknown" },
              { label: "Browser", val: w.browser || "Unknown" },
              { label: "Screen Resolution", val: w.screen || "N/A" },
              { label: "Language", val: w.language || "en" }
            ].map((z, O) => /* @__PURE__ */ d(
              "div",
              {
                style: {
                  padding: "8px 12px",
                  background: "var(--eg-bg-primary, #030712)",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "1px solid var(--eg-border, rgba(255,255,255,0.06))"
                },
                children: [
                  /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", textTransform: "uppercase" }, children: z.label }),
                  /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-primary, #f9fafb)", marginTop: "2px", wordBreak: "break-all" }, children: z.val })
                ]
              },
              O
            ))
          }
        ) : /* @__PURE__ */ r(
          "pre",
          {
            style: {
              background: "var(--eg-bg-primary, #030712)",
              padding: "16px",
              borderRadius: "var(--eg-radius-md, 8px)",
              color: "var(--eg-color-emerald, #00dc82)",
              fontFamily: "var(--eg-font-mono, monospace)",
              fontSize: "0.75rem",
              maxHeight: "60vh",
              overflow: "auto",
              border: "1px solid var(--eg-border, rgba(255,255,255,0.08))"
            },
            children: JSON.stringify(w.raw || w, null, 2)
          }
        )
      }
    )
  ] });
};
function st(t) {
  if (!t) return null;
  if (typeof t == "string" || typeof t == "number") {
    const e = new Date(t);
    return isNaN(e.getTime()) ? null : e;
  }
  if (typeof t == "object" && t !== null && "seconds" in t) {
    const e = Number(t.seconds);
    return new Date(e * 1e3);
  }
  return t instanceof Date ? t : null;
}
const ms = ({
  db: t,
  firebaseConfig: e,
  collectionName: n,
  customFetcher: i,
  customDeleteHandler: o,
  title: a = "Contact Inquiries & Messages",
  style: l,
  className: s = ""
}) => {
  var P, R;
  const p = kt(), c = t || p.db, g = n || ((P = p.collections) == null ? void 0 : P.messages) || "messages", [u, h] = _([]), [m, f] = _(!0), [y, k] = _(null), [v, x] = _(null), [b, w] = _(!1), I = te(async () => {
    var E, j, z;
    f(!0);
    try {
      if (i) {
        const S = await i();
        h(S), f(!1);
        return;
      }
      let O = c || window.db || ((j = (E = window.firebase) == null ? void 0 : E.firestore) == null ? void 0 : j.call(E));
      if (!O && (e != null && e.apiKey || (z = p.config) != null && z.apiKey))
        try {
          const S = e || p.config, { db: N } = await Le(S, p.appName === "web-app" ? void 0 : p.appName);
          O = N;
        } catch (S) {
          console.warn("[AdminMessagesView] Auto-init Firebase error:", S);
        }
      if (!O) {
        f(!1);
        return;
      }
      const L = (await O.collection(g).orderBy("createdAt", "desc").limit(100).get()).docs.map((S) => {
        const N = S.data() || {};
        let A = null;
        return N.createdAt && (A = N.createdAt.toDate ? N.createdAt.toDate() : new Date(N.createdAt)), {
          id: S.id,
          name: N.name || "Anonymous",
          email: N.email || "N/A",
          contact: N.contact || "",
          message: N.message || "",
          appName: N.appName || "web-app",
          createdAt: A,
          userAgent: N.userAgent,
          ip: N.ip
        };
      });
      h(L);
    } catch (O) {
      console.warn("[eg-web-core] loadMessages warning:", O.message);
    } finally {
      f(!1);
    }
  }, [c, g, i, e, p.config, p.appName]);
  Y(() => {
    I();
  }, [I]);
  const T = async () => {
    var E, j;
    if (v) {
      w(!0);
      try {
        if (o)
          await o(v.id);
        else {
          const z = c || window.db || ((j = (E = window.firebase) == null ? void 0 : E.firestore) == null ? void 0 : j.call(E));
          z && await z.collection(g).doc(v.id).delete();
        }
        h((z) => z.filter((O) => O.id !== v.id)), (y == null ? void 0 : y.id) === v.id && k(null), x(null);
      } catch (z) {
        alert(`Failed to delete message: ${z.message}`);
      } finally {
        w(!1);
      }
    }
  }, C = u.length, M = u.filter((E) => {
    const j = st(E.createdAt);
    if (!j) return !1;
    const z = /* @__PURE__ */ new Date();
    return j.getDate() === z.getDate() && j.getMonth() === z.getMonth() && j.getFullYear() === z.getFullYear();
  }).length, W = [
    {
      key: "createdAt",
      label: "Received Date",
      sortType: "date",
      width: "160px",
      getValue: (E) => {
        const j = st(E.createdAt);
        return j ? j.getTime() : 0;
      },
      render: (E) => {
        const j = st(E.createdAt);
        return j ? /* @__PURE__ */ d("div", { style: { fontSize: "0.8125rem" }, children: [
          /* @__PURE__ */ r("div", { style: { fontWeight: 600 }, children: j.toLocaleDateString() }),
          /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.75rem" }, children: j.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
        ] }) : "—";
      }
    },
    {
      key: "name",
      label: "Sender",
      width: "150px",
      render: (E) => /* @__PURE__ */ r("div", { style: { fontWeight: 600, color: "var(--eg-text-primary, #f9fafb)" }, children: E.name })
    },
    {
      key: "email",
      label: "Email",
      width: "180px",
      render: (E) => /* @__PURE__ */ r(
        "a",
        {
          href: `mailto:${E.email}?subject=Regarding%20your%20inquiry%20to%20${encodeURIComponent(E.appName || "our portal")}`,
          style: {
            color: "var(--eg-color-sky, #38bdf8)",
            textDecoration: "none",
            fontSize: "0.8125rem"
          },
          onClick: (j) => j.stopPropagation(),
          children: E.email
        }
      )
    },
    {
      key: "contact",
      label: "Contact / Phone",
      width: "130px",
      render: (E) => /* @__PURE__ */ r("span", { children: E.contact || "—" })
    },
    {
      key: "appName",
      label: "Application",
      width: "120px",
      render: (E) => /* @__PURE__ */ r(
        "span",
        {
          style: {
            padding: "2px 8px",
            borderRadius: "var(--eg-radius-sm, 6px)",
            background: "rgba(99, 102, 241, 0.12)",
            color: "var(--eg-color-indigo, #818cf8)",
            fontSize: "0.75rem",
            fontWeight: 600
          },
          children: E.appName || "General"
        }
      )
    },
    {
      key: "message",
      label: "Message",
      render: (E) => /* @__PURE__ */ r(
        "div",
        {
          style: {
            maxHeight: "44px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            color: "var(--eg-text-secondary, #d1d5db)",
            fontSize: "0.8125rem",
            lineHeight: 1.4
          },
          children: E.message
        }
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: !1,
      align: "right",
      width: "140px",
      render: (E) => /* @__PURE__ */ d("div", { style: { display: "flex", gap: "6px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: (j) => {
              j.stopPropagation(), k(E);
            },
            style: {
              padding: "4px 8px",
              background: "var(--eg-bg-tertiary, #1f2937)",
              border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
              borderRadius: "var(--eg-radius-sm, 6px)",
              color: "var(--eg-color-primary, #10b981)",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer"
            },
            title: "View message details",
            children: "View"
          }
        ),
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: (j) => {
              j.stopPropagation(), x(E);
            },
            style: {
              padding: "4px 8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              borderRadius: "var(--eg-radius-sm, 6px)",
              color: "#f87171",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer"
            },
            title: "Delete message",
            children: "Delete"
          }
        )
      ] })
    }
  ];
  return /* @__PURE__ */ d("div", { className: `eg-admin-messages-view ${s}`.trim(), style: l, children: [
    a && /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: /* @__PURE__ */ r("h2", { style: { fontSize: "var(--eg-text-xl, 1.25rem)", fontWeight: 700, margin: 0, color: "var(--eg-text-primary, #f9fafb)" }, children: a }) }),
    /* @__PURE__ */ d("div", { className: "eg-admin-messages-view__stats", children: [
      /* @__PURE__ */ r(
        He,
        {
          title: "Total Inquiries",
          value: C,
          subtitle: "All received user contact messages",
          icon: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ r("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
            /* @__PURE__ */ r("polyline", { points: "22,6 12,13 2,6" })
          ] }),
          iconBgColor: "rgba(56, 189, 248, 0.15)",
          iconColor: "var(--eg-color-sky, #38bdf8)"
        }
      ),
      /* @__PURE__ */ r(
        He,
        {
          title: "Received Today",
          value: M,
          subtitle: "Messages logged in the last 24 hours",
          icon: /* @__PURE__ */ d("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
            /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ r("polyline", { points: "12 6 12 12 16 14" })
          ] }),
          iconBgColor: "rgba(16, 185, 129, 0.15)",
          iconColor: "var(--eg-color-primary, #10b981)"
        }
      )
    ] }),
    /* @__PURE__ */ r(
      wn,
      {
        data: u,
        columns: W,
        keyExtractor: (E) => E.id,
        loading: m,
        exportFileName: "contact_inquiries.csv",
        onRowClick: (E) => k(E),
        toolbarSlot: /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: () => I(),
            disabled: m,
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              background: "var(--eg-bg-primary, #030712)",
              border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
              borderRadius: "var(--eg-radius-md, 8px)",
              color: "var(--eg-text-primary, #f9fafb)",
              fontSize: "var(--eg-text-xs, 0.8125rem)",
              cursor: m ? "not-allowed" : "pointer"
            },
            children: [
              /* @__PURE__ */ d(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  style: { animation: m ? "spin 0.8s linear infinite" : "none" },
                  children: [
                    /* @__PURE__ */ r("path", { d: "M23 4v6h-6" }),
                    /* @__PURE__ */ r("path", { d: "M1 20v-6h6" }),
                    /* @__PURE__ */ r("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
                  ]
                }
              ),
              /* @__PURE__ */ r("span", { children: "Refresh Messages" })
            ]
          }
        )
      }
    ),
    y && /* @__PURE__ */ r(
      dt,
      {
        isOpen: !!y,
        onClose: () => k(null),
        title: /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ d("span", { children: [
          "Inquiry from ",
          y.name
        ] }) }),
        maxWidth: "640px",
        footer: /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => {
                x(y);
              },
              style: {
                padding: "6px 14px",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "#f87171",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer"
              },
              children: "Delete"
            }
          ),
          /* @__PURE__ */ d("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ d(
              "a",
              {
                href: `mailto:${y.email}?subject=Re:%20Inquiry%20regarding%20${encodeURIComponent(y.appName || "our portal")}`,
                style: {
                  padding: "6px 16px",
                  background: "var(--eg-color-primary, #10b981)",
                  color: "#ffffff",
                  borderRadius: "var(--eg-radius-md, 8px)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                },
                children: [
                  /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ r("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }),
                    /* @__PURE__ */ r("polyline", { points: "22,6 12,13 2,6" })
                  ] }),
                  /* @__PURE__ */ r("span", { children: "Reply via Email" })
                ]
              }
            ),
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => k(null),
                style: {
                  padding: "6px 16px",
                  background: "var(--eg-bg-tertiary, #1f2937)",
                  border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                  borderRadius: "var(--eg-radius-md, 8px)",
                  color: "var(--eg-text-primary, #f9fafb)",
                  fontSize: "0.8125rem",
                  cursor: "pointer"
                },
                children: "Close"
              }
            )
          ] })
        ] }),
        children: /* @__PURE__ */ d("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ d(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "8px",
                background: "var(--eg-bg-primary, #030712)",
                padding: "12px",
                borderRadius: "var(--eg-radius-md, 8px)",
                border: "1px solid var(--eg-border, rgba(255,255,255,0.06))",
                fontSize: "0.8125rem"
              },
              children: [
                /* @__PURE__ */ d("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Email:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)", fontWeight: 600 }, children: y.email })
                ] }),
                /* @__PURE__ */ d("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Contact / Phone:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)" }, children: y.contact || "None" })
                ] }),
                /* @__PURE__ */ d("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Date Received:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)" }, children: ((R = st(y.createdAt)) == null ? void 0 : R.toLocaleString()) || "N/A" })
                ] }),
                /* @__PURE__ */ d("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Target App:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-sky, #38bdf8)" }, children: y.appName || "General" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "var(--eg-text-muted, #9ca3af)",
                  marginBottom: "6px"
                },
                children: "Inquiry Message:"
              }
            ),
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  background: "var(--eg-bg-primary, #030712)",
                  border: "1px solid var(--eg-border, rgba(255,255,255,0.08))",
                  borderRadius: "var(--eg-radius-md, 8px)",
                  padding: "16px",
                  color: "var(--eg-text-primary, #f9fafb)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: "40vh",
                  overflowY: "auto"
                },
                children: y.message
              }
            )
          ] })
        ] })
      }
    ),
    v && /* @__PURE__ */ r(
      dt,
      {
        isOpen: !!v,
        onClose: () => x(null),
        title: "Confirm Message Deletion",
        maxWidth: "440px",
        footer: /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", width: "100%" }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => x(null),
              style: {
                padding: "6px 14px",
                background: "var(--eg-bg-tertiary, #1f2937)",
                border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "var(--eg-text-primary, #f9fafb)",
                fontSize: "0.8125rem",
                cursor: "pointer"
              },
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: b,
              onClick: T,
              style: {
                padding: "6px 14px",
                background: "#ef4444",
                border: "none",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "#ffffff",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: b ? "not-allowed" : "pointer"
              },
              children: b ? "Deleting..." : "Delete Permanently"
            }
          )
        ] }),
        children: /* @__PURE__ */ d("p", { style: { color: "var(--eg-text-secondary, #d1d5db)", fontSize: "0.875rem", margin: 0 }, children: [
          "Are you sure you want to permanently delete the message from ",
          /* @__PURE__ */ r("strong", { children: v.name }),
          "? This action cannot be undone."
        ] })
      }
    )
  ] });
};
function _t(t) {
  return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function sl() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
const xs = ({
  initialMetadata: t,
  initialBody: e = "",
  categories: n = ["Programming", "Tutorial", "Architecture", "Security", "Announcements"],
  defaultAuthor: i = "Admin",
  onSave: o,
  title: a = "Blog Article Editor",
  style: l,
  className: s = ""
}) => {
  const [p, c] = _({
    title: (t == null ? void 0 : t.title) || "",
    slug: (t == null ? void 0 : t.slug) || (t != null && t.title ? _t(t.title) : ""),
    date: (t == null ? void 0 : t.date) || sl(),
    author: (t == null ? void 0 : t.author) || i,
    category: (t == null ? void 0 : t.category) || n[0] || "General",
    tags: (t == null ? void 0 : t.tags) || ["Guide", "Web"],
    description: (t == null ? void 0 : t.description) || ""
  }), [g, u] = _(
    e || `## Overview

Introduce the core topic and key concepts.

## Getting Started

Explain the initial steps, requirements, or prerequisites.

\`\`\`ts
// Example code snippet
export function example() {
  console.log("Hello, World!");
}
\`\`\`

## Key Benefits & Architecture

Detail the design decisions and advantages.

## Conclusion

Summarize findings and next steps.`
  ), [h, m] = _(""), [f, y] = _(!0), [k, v] = _("split"), [x, b] = _(!1), [w, I] = _(!1), T = xe(null), C = (S) => {
    c((N) => ({
      ...N,
      title: S,
      slug: f ? _t(S) : N.slug
    }));
  }, M = (S) => {
    const N = S.trim().replace(/^#/, "");
    N && !p.tags.includes(N) && c((A) => ({
      ...A,
      tags: [...A.tags, N]
    })), m("");
  }, W = (S) => {
    c((N) => ({
      ...N,
      tags: N.tags.filter((A) => A !== S)
    }));
  }, P = (S) => {
    S.key === "Enter" || S.key === "," ? (S.preventDefault(), M(h)) : S.key === "Backspace" && !h && p.tags.length > 0 && W(p.tags[p.tags.length - 1]);
  }, R = (S, N = "") => {
    const A = T.current;
    if (!A) return;
    const D = A.selectionStart, V = A.selectionEnd, B = A.value, H = B.slice(D, V), U = `${S}${H || "text"}${N}`, G = B.slice(0, D) + U + B.slice(V);
    u(G), setTimeout(() => {
      A.focus(), A.setSelectionRange(D + S.length, D + S.length + (H ? H.length : 4));
    }, 50);
  }, E = te(() => [
    "---",
    `title: "${p.title.replace(/"/g, '\\"')}"`,
    `slug: "${p.slug}"`,
    `date: "${p.date}"`,
    `author: "${p.author.replace(/"/g, '\\"')}"`,
    `category: "${p.category}"`,
    `tags: [${p.tags.map((N) => `"${N}"`).join(", ")}]`,
    `description: "${p.description.replace(/"/g, '\\"')}"`,
    "---",
    "",
    g
  ].join(`
`), [p, g]), j = async () => {
    try {
      await navigator.clipboard.writeText(E()), b(!0), setTimeout(() => b(!1), 2200);
    } catch (S) {
      console.error("Clipboard copy failed:", S);
    }
  }, z = () => {
    const S = E(), N = new Blob([S], { type: "text/markdown;charset=utf-8" }), A = URL.createObjectURL(N), D = document.createElement("a");
    D.href = A, D.download = `${p.slug || "article"}.md`, document.body.appendChild(D), D.click(), document.body.removeChild(D), URL.revokeObjectURL(A);
  }, O = async () => {
    if (o)
      try {
        I(!0), await o(E(), p);
      } catch (S) {
        console.error("Error saving post:", S);
      } finally {
        I(!1);
      }
  }, $ = p.description.length, L = $ >= 120 && $ <= 160;
  return /* @__PURE__ */ d("div", { className: `eg-admin-blog-editor ${s}`.trim(), style: l, children: [
    /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__top-bar", children: [
      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
        /* @__PURE__ */ r("h2", { className: "eg-admin-blog-editor__title", children: a }),
        /* @__PURE__ */ r("div", { className: "eg-admin-blog-editor__mode-switcher", children: ["split", "edit", "preview"].map((S) => /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: () => v(S),
            className: `eg-admin-blog-editor__mode-btn ${k === S ? "eg-admin-blog-editor__mode-btn--active" : "eg-admin-blog-editor__mode-btn--inactive"}`,
            children: S === "split" ? "Split View" : S === "edit" ? "Editor" : "Preview"
          },
          S
        )) })
      ] }),
      /* @__PURE__ */ d("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: j,
            className: `eg-admin-blog-editor__btn ${x ? "eg-admin-blog-editor__btn--copied" : "eg-admin-blog-editor__btn--copy"}`,
            children: [
              /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                /* @__PURE__ */ r("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
              ] }),
              /* @__PURE__ */ r("span", { children: x ? "Copied Markdown!" : "Copy Markdown" })
            ]
          }
        ),
        /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            onClick: z,
            className: "eg-admin-blog-editor__btn eg-admin-blog-editor__btn--download",
            children: [
              /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                /* @__PURE__ */ r("polyline", { points: "7 10 12 15 17 10" }),
                /* @__PURE__ */ r("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
              ] }),
              /* @__PURE__ */ r("span", { children: "Download .md" })
            ]
          }
        ),
        o && /* @__PURE__ */ d(
          "button",
          {
            type: "button",
            disabled: w,
            onClick: O,
            className: "eg-admin-blog-editor__btn eg-admin-blog-editor__btn--save",
            style: { cursor: w ? "not-allowed" : "pointer" },
            children: [
              /* @__PURE__ */ d("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                /* @__PURE__ */ r("polyline", { points: "17 21 17 13 7 13 7 21" }),
                /* @__PURE__ */ r("polyline", { points: "7 3 7 8 15 8" })
              ] }),
              /* @__PURE__ */ r("span", { children: w ? "Saving..." : "Save Article" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__form-panel", children: [
      /* @__PURE__ */ d("div", { style: { gridColumn: "span 2" }, children: [
        /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", children: "Article Title *" }),
        /* @__PURE__ */ r(
          "input",
          {
            type: "text",
            value: p.title,
            onChange: (S) => C(S.target.value),
            placeholder: "e.g. Modern Full-Stack Architecture with React & Cloud Services",
            className: "eg-admin-blog-editor__input",
            style: { fontSize: "0.9375rem", fontWeight: 600 }
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }, children: [
          /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", style: { marginBottom: 0 }, children: "URL Slug *" }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => y(!f),
              style: {
                background: "none",
                border: "none",
                color: f ? "var(--eg-color-sky, #38bdf8)" : "var(--eg-color-amber, #f59e0b)",
                fontSize: "0.7rem",
                cursor: "pointer"
              },
              children: f ? "🔒 Auto Sync" : "🔓 Custom Override"
            }
          )
        ] }),
        /* @__PURE__ */ r(
          "input",
          {
            type: "text",
            value: p.slug,
            disabled: f,
            onChange: (S) => c({ ...p, slug: _t(S.target.value) }),
            placeholder: "article-url-slug",
            className: "eg-admin-blog-editor__input",
            style: {
              background: f ? "var(--eg-bg-tertiary, #1f2937)" : "var(--eg-bg-primary, #030712)",
              color: f ? "var(--eg-text-muted, #9ca3af)" : "var(--eg-text-primary, #f9fafb)",
              fontFamily: "var(--eg-font-mono, monospace)"
            }
          }
        )
      ] }),
      /* @__PURE__ */ d("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }, children: [
        /* @__PURE__ */ d("div", { children: [
          /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", children: "Category" }),
          /* @__PURE__ */ r(
            "select",
            {
              value: p.category,
              onChange: (S) => c({ ...p, category: S.target.value }),
              className: "eg-admin-blog-editor__input",
              style: { cursor: "pointer" },
              children: n.map((S) => /* @__PURE__ */ r("option", { value: S, children: S }, S))
            }
          )
        ] }),
        /* @__PURE__ */ d("div", { children: [
          /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", children: "Author" }),
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              value: p.author,
              onChange: (S) => c({ ...p, author: S.target.value }),
              className: "eg-admin-blog-editor__input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d("div", { style: { gridColumn: "span 2" }, children: [
        /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", children: "Tags (Press Enter or Comma to add)" }),
        /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__tags-box", children: [
          p.tags.map((S) => /* @__PURE__ */ d("span", { className: "eg-admin-blog-editor__tag-chip", children: [
            "#",
            S,
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => W(S),
                className: "eg-admin-blog-editor__tag-remove",
                children: "✕"
              }
            )
          ] }, S)),
          /* @__PURE__ */ r(
            "input",
            {
              type: "text",
              value: h,
              onChange: (S) => m(S.target.value),
              onKeyDown: P,
              placeholder: p.tags.length === 0 ? "Type tag and press Enter..." : "",
              style: {
                flex: 1,
                minWidth: "120px",
                background: "transparent",
                border: "none",
                color: "var(--eg-text-primary, #f9fafb)",
                fontSize: "0.8125rem",
                outline: "none"
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ d("div", { style: { gridColumn: "span 2" }, children: [
        /* @__PURE__ */ d("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }, children: [
          /* @__PURE__ */ r("label", { className: "eg-admin-blog-editor__label", style: { marginBottom: 0 }, children: "Summary Description (for SEO Cards & Previews) *" }),
          /* @__PURE__ */ d(
            "span",
            {
              style: {
                fontSize: "0.7rem",
                fontWeight: 600,
                color: L ? "#34d399" : "var(--eg-text-muted, #9ca3af)"
              },
              children: [
                $,
                " chars (Recommended: 120-160)"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ r(
          "textarea",
          {
            rows: 2,
            value: p.description,
            onChange: (S) => c({ ...p, description: S.target.value }),
            placeholder: "A concise, compelling overview of the article topics...",
            className: "eg-admin-blog-editor__input",
            style: { lineHeight: 1.5, resize: "vertical" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ d(
      "div",
      {
        className: "eg-admin-blog-editor__workspace",
        style: {
          gridTemplateColumns: k === "split" ? "1fr 1fr" : "1fr"
        },
        children: [
          (k === "split" || k === "edit") && /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__pane", children: [
            /* @__PURE__ */ r("div", { className: "eg-admin-blog-editor__toolbar", children: [
              { label: "B", title: "Bold", action: () => R("**", "**") },
              { label: "I", title: "Italic", action: () => R("*", "*") },
              { label: "H2", title: "Heading 2", action: () => R("## ") },
              { label: "H3", title: "Heading 3", action: () => R("### ") },
              { label: "`Code`", title: "Inline Code", action: () => R("`", "`") },
              { label: "``` Block", title: "Code Block", action: () => R("```ts\n", "\n```") },
              { label: "Quote", title: "Blockquote", action: () => R("> ") },
              { label: "List", title: "Bullet List", action: () => R("- ") },
              { label: "Link", title: "Hyperlink", action: () => R("[", "](https://example.com)") }
            ].map((S, N) => /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                title: S.title,
                onClick: S.action,
                className: "eg-admin-blog-editor__toolbar-btn",
                children: S.label
              },
              N
            )) }),
            /* @__PURE__ */ r(
              "textarea",
              {
                ref: T,
                value: g,
                onChange: (S) => u(S.target.value),
                placeholder: "Write your article in Markdown format...",
                className: "eg-admin-blog-editor__textarea"
              }
            )
          ] }),
          (k === "split" || k === "preview") && /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__pane", children: [
            /* @__PURE__ */ r(
              "div",
              {
                style: {
                  padding: "8px 16px",
                  background: "var(--eg-bg-tertiary, #1a2234)",
                  borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--eg-text-muted, #9ca3af)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em"
                },
                children: "Live Rendered Preview"
              }
            ),
            /* @__PURE__ */ d("div", { className: "eg-admin-blog-editor__preview-pane", children: [
              /* @__PURE__ */ d("div", { style: { marginBottom: "24px", borderBottom: "1px solid var(--eg-border, rgba(255,255,255,0.08))", paddingBottom: "16px" }, children: [
                /* @__PURE__ */ r(
                  "span",
                  {
                    style: {
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(16, 185, 129, 0.15)",
                      color: "var(--eg-color-primary, #10b981)",
                      fontSize: "0.75rem",
                      fontWeight: 600
                    },
                    children: p.category
                  }
                ),
                /* @__PURE__ */ r(
                  "h1",
                  {
                    style: {
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: "var(--eg-text-primary, #f9fafb)",
                      margin: "12px 0 8px 0",
                      lineHeight: 1.25
                    },
                    children: p.title || "Untitled Article"
                  }
                ),
                /* @__PURE__ */ d("div", { style: { fontSize: "0.8125rem", color: "var(--eg-text-muted, #9ca3af)" }, children: [
                  "By ",
                  p.author,
                  " • ",
                  p.date
                ] }),
                p.description && /* @__PURE__ */ r(
                  "p",
                  {
                    style: {
                      fontSize: "0.9375rem",
                      color: "var(--eg-text-secondary, #d1d5db)",
                      fontStyle: "italic",
                      marginTop: "8px"
                    },
                    children: p.description
                  }
                )
              ] }),
              /* @__PURE__ */ r(Xt, { content: g })
            ] })
          ] })
        ]
      }
    )
  ] });
}, ys = (t = "data/apps.json") => {
  const [e, n] = _([]), [i, o] = _(!0), [a, l] = _(null), s = typeof t == "string" ? t : JSON.stringify(t), p = ee(() => typeof t == "string" ? { productsUrl: t, syncGithub: !1 } : { syncGithub: !1, ...t }, [s]), c = te(async () => {
    try {
      o(!0);
      const g = await we.getProducts(p.productsUrl || t);
      n([...g]), p.syncGithub && we.syncGithubVersions(g, (u, h) => {
        n(
          (m) => m.map((f) => f.id === u ? { ...f, version: h } : f)
        );
      });
    } catch (g) {
      l(g instanceof Error ? g : new Error(String(g)));
    } finally {
      o(!1);
    }
  }, [s]);
  return Y(() => {
    c();
  }, [c]), { products: e, loading: i, error: a, refresh: c };
}, bs = (t, e, n) => {
  const [i, o] = _([]), [a, l] = _(!0), [s, p] = _(null), c = te(async () => {
    try {
      l(!0);
      const g = await we.getBlogs(t, e, n);
      o([...g]);
    } catch (g) {
      p(g instanceof Error ? g : new Error(String(g)));
    } finally {
      l(!1);
    }
  }, [t, e, n]);
  return Y(() => {
    c();
  }, [c]), { blogs: i, loading: a, error: s, refresh: c };
}, vs = (t) => {
  const [e, n] = _([]), [i, o] = _(!0);
  return Y(() => {
    let a = !0;
    return we.getNews(t).then((l) => {
      a && (n(l), o(!1));
    }), () => {
      a = !1;
    };
  }, [t]), { news: e, loading: i };
}, ws = (t, e) => {
  const [n, i] = _(null), [o, a] = _(!0);
  return Y(() => {
    let l = !0;
    return we.getPageContent(t, e).then((s) => {
      l && (i(s), a(!1));
    }), () => {
      l = !1;
    };
  }, [t, e]), { content: n, loading: o };
}, ks = ({
  appName: t,
  firebaseConfig: e,
  firestoreCollection: n,
  consentStorageKey: i,
  sessionStorageKey: o,
  onLogReady: a,
  enabled: l = !0,
  requireExplicitConsent: s = !1
} = {}) => {
  var y, k;
  const p = kt(), c = e || ((y = p.config) != null && y.apiKey ? p.config : void 0), g = t || (p.appName && p.appName !== "web-app" ? p.appName : typeof window < "u" && window.location.hostname ? window.location.hostname : "web-app"), u = n || ((k = p.collections) == null ? void 0 : k.analytics) || "visitor_analytics", h = i || ke, m = o || Ye, f = xe(!1);
  Y(() => {
    if (!l) return;
    let v = !0;
    const x = async () => {
      if (!Kt(h) && !(s && !Ci(h)) && !jr(m) && !f.current) {
        f.current = !0;
        try {
          const w = await Ii(g, {
            consentStorageKey: h,
            sessionStorageKey: m
          });
          if (!v || !w) {
            f.current = !1;
            return;
          }
          let I = !0;
          if (c && c.apiKey)
            try {
              const { db: T } = await Le(c, g === "web-app" ? void 0 : g);
              T ? I = await Li(T, w, {
                collectionName: u
              }) : I = !1;
            } catch (T) {
              I = !1, console.warn("[useVisitorTracker] Auto Firestore write warning:", T);
            }
          a && Promise.resolve(a(w)).catch((T) => {
            console.warn("[useVisitorTracker] Custom log handler error:", T);
          }), I && Ai(m);
        } finally {
          f.current = !1;
        }
      }
    };
    x();
    const b = (w) => {
      w.detail === "granted" && x();
    };
    return window.addEventListener("analytics_consent_changed", b), window.addEventListener("eg_consent_changed", b), () => {
      v = !1, window.removeEventListener("analytics_consent_changed", b), window.removeEventListener("eg_consent_changed", b);
    };
  }, [g, c, u, h, m, a, l, s]);
};
function Ss(t = "data/updates.json") {
  const e = typeof t == "string" ? t.includes("/") && !t.endsWith(".json") ? { githubRepo: t } : { updatesUrl: t } : t, [n, i] = _(e.initialUpdates || []), [o, a] = _(!e.initialUpdates || e.initialUpdates.length === 0), [l, s] = _(null), p = te(async (g = !1) => {
    a(!0), s(null);
    try {
      const u = await Oa({ ...e, forceRefresh: g });
      i(u);
    } catch (u) {
      s(u instanceof Error ? u : new Error(String(u)));
    } finally {
      a(!1);
    }
  }, [e.updatesUrl, e.githubRepo, e.preferGitHub, e.cacheTtlMs]);
  Y(() => {
    p(!1);
  }, [p]);
  const c = te(() => p(!0), [p]);
  return {
    updates: n,
    loading: o,
    error: l,
    refresh: c
  };
}
export {
  $l as AcademicCapIcon,
  fs as AdminAnalyticsView,
  us as AdminAuthGuard,
  xs as AdminBlogEditor,
  hs as AdminLayout,
  ll as AdminLoginForm,
  ms as AdminMessagesView,
  jl as AnalyticsIcon,
  Zi as ArrowDownIcon,
  Gi as ArrowLeftIcon,
  qi as ArrowRightIcon,
  Ki as ArrowUpIcon,
  yi as BUCKET_PAGE_SIZE,
  ye as Badge,
  sn as BalanceScaleIcon,
  kl as BarsIcon,
  ko as BellIcon,
  Na as BlogCard,
  ss as BlogList,
  as as BlogPostView,
  ls as BlogSidebar,
  Jr as BoltIcon,
  Qr as BookIcon,
  Tl as BookOpenIcon,
  To as BookmarkIcon,
  tn as BrainIcon,
  Ho as BugIcon,
  Jo as BullhornIcon,
  _l as BullseyeIcon,
  Wt as Button,
  xt as CLOUD_DEV_PREFIX,
  Rt as CLOUD_EMAIL_PREFIX,
  mt as CLOUD_HWCORE_PREFIX,
  ft as CLOUD_HW_PREFIX,
  zt as CLOUD_PHONE_PREFIX,
  ke as CONSENT_STORAGE_KEY,
  ar as CacheBuster,
  Mo as CalendarIcon,
  on as ChartLineIcon,
  Eo as CheckCircleIcon,
  eo as CheckIcon,
  Ca as ChessBishopIcon,
  Aa as ChessBoardIcon,
  Mi as ChessComIcon,
  ka as ChessKingIcon,
  Zt as ChessKnightIcon,
  Fr as ChessPawnIcon,
  wa as ChessQueenIcon,
  Sa as ChessRookIcon,
  Qi as ChevronDownIcon,
  Yi as ChevronLeftIcon,
  Ji as ChevronRightIcon,
  Xi as ChevronUpIcon,
  ga as ClipboardIcon,
  Bo as ClockIcon,
  Ur as CloseIcon,
  Go as CloudIcon,
  gn as CodeBranchIcon,
  Oo as CodeIcon,
  Kr as CogIcon,
  aa as CompassIcon,
  vo as CompressIcon,
  xl as ConsentBanner,
  yl as ConsentControl,
  gs as ContactForm,
  es as Container,
  Ml as ControllerIcon,
  ao as CopyIcon,
  Zr as CpuIcon,
  va as CrosshairsIcon,
  pa as CrownIcon,
  pn as CutIcon,
  Ar as DEFAULT_FIREBASE_COLLECTIONS,
  Ke as DEFAULT_FIREBASE_CONFIG,
  Qa as DEFAULT_LOCKOUT_DURATION_MS,
  Xa as DEFAULT_MAX_FAIL_ATTEMPTS,
  kn as DEFAULT_PIN_SALT,
  Qt as DEFAULT_SESSION_KEY,
  we as DataCache,
  mi as DataCacheService,
  wn as DataGrid,
  Vo as DatabaseIcon,
  Fo as DesktopIcon,
  Ei as DiscordIcon,
  ds as DocsViewer,
  un as DoorOpenIcon,
  io as DownloadIcon,
  _o as EditIcon,
  Yt as EnvelopeIcon,
  bo as ExpandIcon,
  lo as ExternalLinkIcon,
  ca as EyeIcon,
  da as EyeSlashIcon,
  Ti as FacebookIcon,
  mo as FastBackwardIcon,
  xo as FastForwardIcon,
  so as FilterIcon,
  nn as FireIcon,
  Ir as FirebaseContext,
  ul as FirebaseProvider,
  sa as FlagIcon,
  Dl as FlameIcon,
  Xl as Footer,
  ql as ForkIcon,
  en as GamepadIcon,
  Ri as GitHubIcon,
  El as GlobeAsiaIcon,
  At as GlobeIcon,
  Jt as GraduationCapIcon,
  la as HandshakeIcon,
  Jl as Header,
  $o as HeartIcon,
  ha as HistoryIcon,
  wo as HomeIcon,
  Yl as Icon,
  Ql as ImageSlider,
  Ro as InfoIcon,
  Wi as InstagramIcon,
  ya as KeyboardIcon,
  el as LOGS_PER_BUCKET_DOC,
  oa as LandmarkIcon,
  dn as LayerGroupIcon,
  Ul as LayersIcon,
  Bl as LearnIcon,
  Bi as LichessIcon,
  xa as LightbulbIcon,
  zi as LinkedInIcon,
  Fl as ListAltIcon,
  ln as ListIcon,
  So as LockIcon,
  Pr as Logo,
  Hl as MailIcon,
  Pl as MapMarkerIcon,
  an as MapPinIcon,
  Xt as MarkdownViewer,
  Oi as MastodonIcon,
  os as MdViewer,
  Qo as MedalIcon,
  Gr as MenuIcon,
  Al as MicrochipIcon,
  Zo as MicroscopeIcon,
  dt as Modal,
  Io as MoonIcon,
  fa as NetworkWiredIcon,
  ra as NewspaperIcon,
  Mn as NotificationBell,
  rs as PageHeader,
  ba as PaletteIcon,
  Or as PaperPlaneIcon,
  zl as ParchmentIcon,
  go as PauseIcon,
  Vi as PinterestIcon,
  po as PlayIcon,
  Ia as ProductCard,
  is as ProductDetail,
  ns as ProductGrid,
  ea as PuzzleIcon,
  Do as QuestionCircleIcon,
  ta as QuoteIcon,
  ji as RedditIcon,
  no as RedoIcon,
  qr as RefreshIcon,
  qo as RobotIcon,
  Ko as RocketIcon,
  Ye as SESSION_STORAGE_KEY,
  Sr as STORAGE_KEY,
  Ol as ScaleIcon,
  Gl as ScissorsIcon,
  rn as ScrollIcon,
  to as SearchIcon,
  ts as Section,
  vl as SendMailIcon,
  Uo as ServerIcon,
  Cl as SettingsIcon,
  Kl as ShareAltIcon,
  hn as ShareIcon,
  qt as ShareModal,
  Po as ShieldCheckIcon,
  jo as ShieldIcon,
  Zl as SignOutIcon,
  ua as SignalIcon,
  Vl as SkullCrossbonesIcon,
  cn as SkullIcon,
  co as SlidersIcon,
  _i as SmartScrollButton,
  Vr as SocialIcon,
  Yo as SparklesIcon,
  yo as SpinnerIcon,
  Ui as SpotifyIcon,
  Wo as StarIcon,
  He as StatCard,
  uo as StepBackwardIcon,
  fo as StepForwardIcon,
  ho as StopIcon,
  ma as StopwatchIcon,
  Ao as SunIcon,
  Sl as SyncIcon,
  er as THEMES,
  Xr as TargetIcon,
  Ni as TelegramIcon,
  Cr as ThemeContext,
  gl as ThemeProvider,
  Lr as ThemeToggle,
  Fi as ThreadsIcon,
  Pi as TikTokIcon,
  No as TimesCircleIcon,
  wl as TimesIcon,
  Il as ToolsIcon,
  ml as TotemTicker,
  Rl as TrainIcon,
  Lo as TrashIcon,
  Xo as TrophyIcon,
  Wl as TvIcon,
  Hi as TwitchIcon,
  bl as TwitterIcon,
  ro as UndoIcon,
  Co as UnlockIcon,
  cs as UpdatesTimeline,
  oo as UploadIcon,
  na as UserIcon,
  ia as UsersIcon,
  zo as WarningIcon,
  Di as WhatsAppIcon,
  Nl as WorldIcon,
  Yr as WrenchIcon,
  Hr as XTwitterIcon,
  $i as YouTubeIcon,
  Ll as ZapIcon,
  al as adminSignOut,
  Ii as assembleVisitorLog,
  vt as checkAdminLockout,
  Ka as checkCloudContactRateLimit,
  bn as checkContactRateLimit,
  rl as clearAdminLockout,
  qe as clearAdminSession,
  ps as clearContactRateLimit,
  tl as computePinHash,
  $a as createCustomMarkedRenderer,
  ki as detectBrowser,
  wi as detectOS,
  Pa as detectPlatform,
  yn as enhanceMarkdownContainer,
  _n as ensureFirebaseAuthSDK,
  Ln as ensureFirebaseSDK,
  _a as ensureMermaidLoaded,
  Ta as ensurePrismLoaded,
  Ce as escapeHtmlEntities,
  Ha as extractHighlightsFromMarkdown,
  Si as fetchGeoLocation,
  fr as fetchGitHubReleases,
  mr as fetchUpdatesFromJson,
  vn as flushOfflineContactMessages,
  Da as formatBytes,
  ja as formatReleaseDate,
  Ga as generateMathCaptcha,
  fl as getAppSlug,
  xi as getBlogSlug,
  yt as getClientIP,
  Nt as getFirebaseAuth,
  Tn as getFirestore,
  hl as getFoucPreventScript,
  Xe as getHardwareCoreFingerprint,
  Qe as getHardwareFingerprint,
  Je as getMachineFingerprint,
  vi as getTodayDateString,
  It as getUserIdentityHashes,
  mn as highlightCode,
  Le as initFirebase,
  br as isAdminSessionVerified,
  Kt as isConsentDenied,
  Ci as isConsentGranted,
  jr as isSessionLogged,
  Oa as loadUpdates,
  Sn as logAdminLoginAttempt,
  Ai as markSessionLogged,
  Fa as normalizeCategory,
  qa as normalizeGpuRenderer,
  hr as normalizeMarkdown,
  Ra as openImageLightbox,
  ot as openMermaidFullscreenModal,
  xn as parseMarkdownToHtml,
  Et as recordAdminFailedAttempt,
  Za as recordCloudContactRateLimit,
  We as recordContactSubmissionTime,
  Ae as sanitizeHtml,
  bt as sanitizeIPKey,
  ne as sanitizeUrl,
  nl as setAdminSessionVerified,
  il as signInWithGooglePopup,
  La as slugify,
  Ya as submitContactInquiry,
  Wa as transformAlertCallouts,
  Cn as useAdminAuth,
  bs as useBlogs,
  kt as useFirebase,
  vs as useNews,
  Wn as useNotifications,
  ws as usePageContent,
  ys as useProducts,
  wt as useTheme,
  Ss as useUpdates,
  ks as useVisitorTracker,
  ol as verifyAdminPin,
  Li as writeVisitorLogToFirestore
};
//# sourceMappingURL=index.js.map
