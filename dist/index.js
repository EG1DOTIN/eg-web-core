var Cn = Object.defineProperty;
var An = (t, e, n) => e in t ? Cn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var q = (t, e, n) => An(t, typeof e != "symbol" ? e + "" : e, n);
import { jsx as r, jsxs as c, Fragment as se } from "react/jsx-runtime";
import { createContext as vr, useState as W, useCallback as te, useEffect as Y, useContext as wr, useMemo as ee, useRef as me } from "react";
const Jt = ["light", "light-gray", "dark", "crystal", "slate-dark", "clamui-dark"], kr = "eg_theme", Sr = vr(void 0), gl = ({
  children: t,
  defaultTheme: e = "light-gray",
  storageKey: n = kr,
  allowedThemes: i = Jt
}) => {
  const [o, a] = W(() => {
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
    const x = l(h);
    document.body && (document.body.setAttribute("data-theme", h), x ? (document.body.classList.add("dark-theme"), document.body.classList.remove("light-theme")) : (document.body.classList.add("light-theme"), document.body.classList.remove("dark-theme")));
    try {
      localStorage.setItem(n, h), (n === "mchess_theme" || h === "dark" || h === "light") && localStorage.setItem("mchess_theme", x ? "dark" : "light");
    } catch {
    }
  }, [n]);
  Y(() => {
    s(o);
  }, [o, s]);
  const p = te((h) => {
    a(h), s(h);
  }, [s]), d = te(() => {
    a((h) => {
      let x;
      if (i && i.length === 2)
        x = h === i[0] ? i[1] : i[0];
      else {
        const f = l(h);
        i.includes("dark") && i.includes("light") ? x = f ? "light" : "dark" : x = f ? "light-gray" : "dark";
      }
      return s(x), x;
    });
  }, [i, s]), g = te(() => {
    a((h) => {
      const x = i && i.length > 0 ? i : Jt, f = x.indexOf(h), b = x[(f + 1) % x.length];
      return s(b), b;
    });
  }, [i, s]), u = l(o);
  return /* @__PURE__ */ r(Sr.Provider, { value: { theme: o, setTheme: p, toggleTheme: d, cycleTheme: g, isDark: u, allowedThemes: i }, children: t });
}, vt = () => {
  const t = wr(Sr);
  if (!t)
    throw new Error("useTheme must be used within a ThemeProvider");
  return t;
}, hl = (t = kr, e = "light-gray") => `
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
let _e = null;
function In() {
  return typeof window > "u" ? Promise.resolve(null) : window.firebase && window.firebase.firestore ? Promise.resolve(window.firebase) : _e || (_e = new Promise((t, e) => {
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
      _e = null, e(i);
    });
  }), _e);
}
let Me = null;
function Ln() {
  return typeof window > "u" ? Promise.resolve(null) : window.firebase && window.firebase.auth && window.firebase.firestore ? Promise.resolve(window.firebase) : Me || (Me = new Promise((t, e) => {
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
      Me = null, e(i);
    });
  }), Me);
}
async function Le(t = Ke, e, n = {}) {
  if (typeof window > "u")
    return { app: null, db: null, auth: null };
  n.includeAuth ? await Ln() : await In();
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
async function Dt(t = Ke, e) {
  const { auth: n } = await Le(t, e, { includeAuth: !0 });
  return n;
}
const Cr = {
  messages: "messages",
  analytics: "visitor_analytics",
  adminLockout: "admin_lockout",
  adminAuditLog: "admin_login_log"
}, Ar = vr({
  config: Ke,
  appName: "web-app",
  collections: Cr,
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
  const [a, l] = W(null), [s, p] = W(!1), [d, g] = W(null), u = ee(() => ({
    ...Cr,
    ...i || {}
  }), [i]);
  Y(() => {
    if (!o || !e.apiKey) return;
    let x = !0;
    return Le(e, n === "web-app" ? void 0 : n).then(({ db: f }) => {
      x && (l(f), p(!0));
    }).catch((f) => {
      x && (console.warn("[FirebaseProvider] Firebase auto-init warning:", f), g(f instanceof Error ? f : new Error(String(f))));
    }), () => {
      x = !1;
    };
  }, [e, n, o]);
  const h = ee(() => ({
    config: e,
    appName: n,
    collections: u,
    db: a,
    isReady: s,
    error: d
  }), [e, n, u, a, s, d]);
  return /* @__PURE__ */ r(Ar.Provider, { value: h, children: t });
}, wt = () => wr(Ar), Wt = ({
  variant: t = "primary",
  size: e = "md",
  icon: n,
  children: i,
  className: o = "",
  style: a,
  disabled: l,
  ...s
}) => {
  const p = {
    sm: { padding: "6px 12px", fontSize: "12.5px", borderRadius: "6px" },
    md: { padding: "9px 18px", fontSize: "14px", borderRadius: "8px" },
    lg: { padding: "12px 24px", fontSize: "15.5px", borderRadius: "10px" }
  }[e], d = {
    primary: {
      background: "var(--eg-color-primary, #10b981)",
      color: "#ffffff",
      border: "none"
    },
    secondary: {
      background: "var(--eg-bg-surface-elevated, #1a2742)",
      color: "var(--eg-text-primary, #f8fafc)",
      border: "1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))"
    },
    outline: {
      background: "transparent",
      color: "var(--eg-color-primary, #10b981)",
      border: "1px solid var(--eg-color-primary, #10b981)"
    },
    ghost: {
      background: "transparent",
      color: "var(--eg-text-primary, inherit)",
      border: "none"
    },
    danger: {
      background: "#ef4444",
      color: "#ffffff",
      border: "none"
    }
  }[t];
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      className: `eg-button eg-button-${t} ${o}`,
      disabled: l,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontWeight: 600,
        fontFamily: "var(--eg-font-sans, sans-serif)",
        cursor: l ? "not-allowed" : "pointer",
        opacity: l ? 0.6 : 1,
        transition: "all var(--eg-transition-fast, 150ms)",
        ...p,
        ...d,
        ...a
      },
      ...s,
      children: [
        n && /* @__PURE__ */ r("span", { style: { display: "inline-flex" }, children: n }),
        i
      ]
    }
  );
}, ye = ({
  children: t,
  variant: e = "neutral",
  size: n = "md",
  className: i = "",
  style: o
}) => {
  const a = {
    primary: {
      background: "rgba(16, 185, 129, 0.14)",
      color: "#10b981",
      border: "1px solid rgba(16, 185, 129, 0.25)"
    },
    success: {
      background: "rgba(0, 220, 130, 0.14)",
      color: "#00dc82",
      border: "1px solid rgba(0, 220, 130, 0.25)"
    },
    warning: {
      background: "rgba(245, 158, 11, 0.14)",
      color: "#f59e0b",
      border: "1px solid rgba(245, 158, 11, 0.25)"
    },
    danger: {
      background: "rgba(239, 68, 68, 0.14)",
      color: "#ef4444",
      border: "1px solid rgba(239, 68, 68, 0.25)"
    },
    info: {
      background: "rgba(56, 189, 248, 0.14)",
      color: "#38bdf8",
      border: "1px solid rgba(56, 189, 248, 0.25)"
    },
    neutral: {
      background: "var(--eg-bg-subtle, rgba(255, 255, 255, 0.08))",
      color: "var(--eg-text-secondary, #cbd5e1)",
      border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))"
    }
  }[e], l = n === "sm" ? { padding: "2px 6px", fontSize: "11px", borderRadius: "4px" } : { padding: "3px 10px", fontSize: "12px", borderRadius: "6px" };
  return /* @__PURE__ */ r(
    "span",
    {
      className: `eg-badge eg-badge-${e} ${i}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontWeight: 600,
        fontFamily: "var(--eg-font-sans, sans-serif)",
        lineHeight: 1.2,
        ...l,
        ...a,
        ...o
      },
      children: t
    }
  );
}, ct = ({
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
}, [t, e]), t ? /* @__PURE__ */ c(
  "div",
  {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      background: "rgba(0, 0, 0, 0.65)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      animation: "egFadeIn 0.2s ease-out"
    },
    onClick: (l) => {
      l.target === l.currentTarget && e();
    },
    children: [
      /* @__PURE__ */ c(
        "div",
        {
          style: {
            width: "100%",
            maxWidth: o,
            background: "var(--eg-bg-surface-elevated, #1a2742)",
            border: "1px solid var(--eg-border-default, rgba(255, 255, 255, 0.15))",
            borderRadius: "var(--eg-radius-lg, 14px)",
            boxShadow: "var(--eg-shadow-lg, 0 16px 40px rgba(0, 0, 0, 0.6))",
            color: "var(--eg-text-primary, #f8fafc)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100vh - 40px)",
            animation: "egScaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            fontFamily: "var(--eg-font-sans, sans-serif)"
          },
          children: [
            n && /* @__PURE__ */ c(
              "div",
              {
                style: {
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.08))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "var(--eg-bg-subtle, #0f172a)"
                },
                children: [
                  /* @__PURE__ */ r("h3", { style: { margin: 0, fontSize: "17px", fontWeight: 600 }, children: n }),
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: e,
                      "aria-label": "Close modal",
                      style: {
                        background: "transparent",
                        border: "none",
                        color: "var(--eg-text-muted, #94a3b8)",
                        cursor: "pointer",
                        padding: "4px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      children: /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                        /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                      ] })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ r("div", { style: { padding: "20px", overflowY: "auto", flex: 1 }, children: i }),
            a && /* @__PURE__ */ r(
              "div",
              {
                style: {
                  padding: "14px 20px",
                  borderTop: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.08))",
                  background: "var(--eg-bg-subtle, #0f172a)",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px"
                },
                children: a
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ r("style", { children: `
        @keyframes egFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes egScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      ` })
    ]
  }
) : null), Ir = ({
  id: t = "themeToggleBtn",
  className: e = "",
  size: n = "md",
  showLabel: i = !1,
  mode: o = "auto"
}) => {
  const { theme: a, toggleTheme: l, cycleTheme: s, isDark: p, allowedThemes: d } = vt(), g = o === "toggle" || o === "auto" && d && d.length <= 2, u = g ? l : s, h = n === "sm" ? 18 : n === "lg" ? 24 : 20, x = n === "sm" ? "6px" : n === "lg" ? "10px" : "8px";
  return /* @__PURE__ */ c(
    "button",
    {
      type: "button",
      id: t,
      onClick: u,
      className: `eg-theme-toggle ${e}`,
      title: g ? p ? "Switch to Light Theme" : "Switch to Dark Theme" : `Current theme: ${a}. Click to switch theme.`,
      "aria-label": g ? p ? "Switch to Light Theme" : "Switch to Dark Theme" : `Current theme: ${a}. Click to cycle themes.`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: x,
        background: "transparent",
        border: "1px solid var(--eg-border-subtle, rgba(255, 255, 255, 0.12))",
        borderRadius: "var(--eg-radius-md, 8px)",
        color: "var(--eg-text-primary, inherit)",
        cursor: "pointer",
        transition: "all var(--eg-transition-fast, 150ms)"
      },
      onMouseEnter: (f) => {
        f.currentTarget.style.borderColor = "var(--eg-border-hover, #10b981)", f.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))";
      },
      onMouseLeave: (f) => {
        f.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", f.currentTarget.style.backgroundColor = "transparent";
      },
      children: [
        a === "crystal" ? (
          // Crystal / Gem SVG
          /* @__PURE__ */ c(
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
          /* @__PURE__ */ c(
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
  const [o, a] = W(e), [l, s] = W(() => {
    if (typeof window > "u") return [];
    try {
      const x = localStorage.getItem(t);
      return x ? JSON.parse(x) : [];
    } catch {
      return [];
    }
  }), p = te(
    (x) => {
      if (s(x), !(typeof window > "u"))
        try {
          localStorage.setItem(t, JSON.stringify(x));
        } catch (f) {
          console.warn("[useNotifications] Could not persist read notification IDs:", f);
        }
    },
    [t]
  );
  Y(() => {
    if (!n) return;
    let x = !0;
    return fetch(n).then((f) => f.ok ? f.json() : null).then((f) => {
      if (!x || !f) return;
      const b = Array.isArray(f) ? f : Array.isArray(f.news) ? f.news : Array.isArray(f.updates) ? f.updates : [];
      a(b);
    }).catch((f) => {
      console.warn("[useNotifications] Failed to fetch notification feed:", f);
    }), () => {
      x = !1;
    };
  }, [n]);
  const d = ee(() => o.slice(0, i).map((x) => {
    const f = x;
    return {
      id: x.id || String(f.version || Math.random()),
      title: x.title || String(f.title || "Update"),
      description: x.description || f.message || "",
      date: x.date || f.date || "",
      link: x.link || f.link || "",
      category: x.category || f.badge || "",
      read: l.includes(x.id)
    };
  }), [o, l, i]), g = ee(() => d.filter((x) => !x.read).length, [d]), u = te(
    (x) => {
      l.includes(x) || p([...l, x]);
    },
    [l, p]
  ), h = te(() => {
    const x = Array.from(/* @__PURE__ */ new Set([...l, ...o.map((f) => f.id)]));
    p(x);
  }, [o, l, p]);
  return {
    notifications: d,
    unreadCount: g,
    hasUnread: g > 0,
    markAsRead: u,
    markAllAsRead: h,
    setItems: a
  };
}, zn = /* @__PURE__ */ new Set(["http:", "https:", "mailto:", "tel:"]), ne = (t, e = "#") => {
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
    if (/^[a-z][a-z0-9+.-]*:$/i.test(a) && !zn.has(a))
      return e;
  }
  return n;
}, Rn = /* @__PURE__ */ new Set([
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
          if (Rn.has(p)) {
            s.remove();
            return;
          }
          const d = Array.from(s.attributes);
          for (const g of d) {
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
}, Bn = ({
  storageKey: t = "eg_seen_updates",
  fetchUrl: e = "data/updates.json",
  items: n,
  allUpdatesUrl: i = "updates",
  onNavigate: o
}) => {
  const [a, l] = W(!1), [s, p] = W({}), d = me(null), { isDark: g } = vt(), u = Wn({
    storageKey: t,
    fetchUrl: e
  }), h = n || u.notifications, x = n ? n.filter((m) => !m.read).length : u.unreadCount, f = u.markAsRead, b = u.markAllAsRead, C = () => {
    if (!d.current) return {};
    const m = d.current.getBoundingClientRect(), y = typeof window < "u" ? window.innerWidth : 1024, w = Math.min(360, y - 24);
    if (y <= 768 || m.right - 320 < 12) {
      const L = m.bottom + 8, z = Math.max(12, Math.min(y - w - 12, m.right - w));
      return {
        position: "fixed",
        top: `${L}px`,
        left: `${z}px`,
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
    a ? l(!1) : (p(C()), l(!0));
  };
  return Y(() => {
    if (!a) return;
    const m = () => {
      p(C());
    };
    return m(), window.addEventListener("resize", m), window.addEventListener("scroll", m, !0), () => {
      window.removeEventListener("resize", m), window.removeEventListener("scroll", m, !0);
    };
  }, [a]), Y(() => {
    const m = (y) => {
      d.current && !d.current.contains(y.target) && l(!1);
    };
    return a && document.addEventListener("mousedown", m), () => {
      document.removeEventListener("mousedown", m);
    };
  }, [a]), /* @__PURE__ */ c("div", { ref: d, className: "header-notify-wrapper eg-notify-wrapper", style: { position: "relative", display: "inline-block" }, children: [
    /* @__PURE__ */ c(
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
        onMouseEnter: (m) => {
          m.currentTarget.style.borderColor = "var(--eg-border-hover, #10b981)", m.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))";
        },
        onMouseLeave: (m) => {
          m.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", m.currentTarget.style.backgroundColor = "transparent";
        },
        children: [
          /* @__PURE__ */ c(
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
          x > 0 && /* @__PURE__ */ r(
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
              children: x > 9 ? "9+" : x
            }
          )
        ]
      }
    ),
    a && /* @__PURE__ */ c(
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
          /* @__PURE__ */ c(
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
                x > 0 && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: b,
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
          ) : h.map((m) => /* @__PURE__ */ c(
            "div",
            {
              onClick: () => {
                f(m.id), o && (o(i), l(!1));
              },
              style: {
                padding: "12px 16px",
                borderBottom: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.06))",
                background: m.read ? "transparent" : g ? "rgba(56, 189, 248, 0.08)" : "rgba(14, 165, 233, 0.08)",
                cursor: "pointer",
                transition: "background 0.15s ease"
              },
              onMouseEnter: (y) => {
                y.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))";
              },
              onMouseLeave: (y) => {
                y.currentTarget.style.backgroundColor = m.read ? "transparent" : g ? "rgba(56, 189, 248, 0.08)" : "rgba(14, 165, 233, 0.08)";
              },
              children: [
                /* @__PURE__ */ c(
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
                            fontWeight: m.read ? 500 : 700,
                            fontSize: "13px",
                            color: "var(--eg-text-primary, #0f172a)",
                            flex: 1
                          },
                          children: m.title
                        }
                      ),
                      m.category && /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            background: m.category.includes("ENHANC") ? g ? "rgba(168, 85, 247, 0.2)" : "rgba(168, 85, 247, 0.14)" : m.category.includes("FEAT") ? g ? "rgba(56, 189, 248, 0.2)" : "rgba(14, 165, 233, 0.14)" : m.category.includes("BUG") ? g ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.14)" : m.category.includes("OPT") ? g ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.14)" : g ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.14)",
                            color: m.category.includes("ENHANC") ? g ? "#c084fc" : "#7e22ce" : m.category.includes("FEAT") ? g ? "#38bdf8" : "#0369a1" : m.category.includes("BUG") ? g ? "#f87171" : "#b91c1c" : m.category.includes("OPT") ? g ? "#fbbf24" : "#b45309" : g ? "#34d399" : "#047857"
                          },
                          children: m.category
                        }
                      ),
                      !m.read && /* @__PURE__ */ r(
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
                    children: m.description
                  }
                ),
                m.date && /* @__PURE__ */ r(
                  "span",
                  {
                    style: {
                      display: "block",
                      marginTop: "4px",
                      fontSize: "11px",
                      color: "var(--eg-text-muted, #94a3b8)"
                    },
                    children: m.date
                  }
                )
              ]
            },
            m.id
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
                  onClick: (m) => {
                    o && (m.preventDefault(), o(i), l(!1));
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
function Et() {
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
var Te = Et();
function Lr(t) {
  Te = t;
}
var Ne = { exec: () => null };
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
}, _n = /^(?:[ \t]*(?:\n|$))+/, Mn = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, $n = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Ze = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Dn = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, jt = /(?:[*+-]|\d{1,9}[.)])/, Tr = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Wr = X(Tr).replace(/bull/g, jt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), En = X(Tr).replace(/bull/g, jt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Nt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, jn = /^[^\n]+/, Pt = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Nn = X(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Pt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Pn = X(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, jt).getRegex(), kt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ht = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Hn = X(
  "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))",
  "i"
).replace("comment", Ht).replace("tag", kt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), zr = X(Nt).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", kt).getRegex(), Fn = X(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", zr).getRegex(), Ft = {
  blockquote: Fn,
  code: Mn,
  def: Nn,
  fences: $n,
  heading: Dn,
  hr: Ze,
  html: Hn,
  lheading: Wr,
  list: Pn,
  newline: _n,
  paragraph: zr,
  table: Ne,
  text: jn
}, er = X(
  "^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", kt).getRegex(), On = {
  ...Ft,
  lheading: En,
  table: er,
  paragraph: X(Nt).replace("hr", Ze).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", er).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", kt).getRegex()
}, Vn = {
  ...Ft,
  html: X(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  ).replace("comment", Ht).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Ne,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: X(Nt).replace("hr", Ze).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Wr).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Un = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gn = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Rr = /^( {2,}|\\)\n(?!\s*$)/, qn = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, St = /[\p{P}\p{S}]/u, Ot = /[\s\p{P}\p{S}]/u, Br = /[^\s\p{P}\p{S}]/u, Kn = X(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Ot).getRegex(), _r = /(?!~)[\p{P}\p{S}]/u, Zn = /(?!~)[\s\p{P}\p{S}]/u, Yn = /(?:[^\s\p{P}\p{S}]|~)/u, Qn = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<[^<>]*?>/g, Mr = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, Xn = X(Mr, "u").replace(/punct/g, St).getRegex(), Jn = X(Mr, "u").replace(/punct/g, _r).getRegex(), $r = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", ei = X($r, "gu").replace(/notPunctSpace/g, Br).replace(/punctSpace/g, Ot).replace(/punct/g, St).getRegex(), ti = X($r, "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, Zn).replace(/punct/g, _r).getRegex(), ri = X(
  "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)",
  "gu"
).replace(/notPunctSpace/g, Br).replace(/punctSpace/g, Ot).replace(/punct/g, St).getRegex(), ni = X(/\\(punct)/, "gu").replace(/punct/g, St).getRegex(), ii = X(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), oi = X(Ht).replace("(?:-->|$)", "-->").getRegex(), ai = X(
  "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>"
).replace("comment", oi).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), dt = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, li = X(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", dt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Dr = X(/^!?\[(label)\]\[(ref)\]/).replace("label", dt).replace("ref", Pt).getRegex(), Er = X(/^!?\[(ref)\](?:\[\])?/).replace("ref", Pt).getRegex(), si = X("reflink|nolink(?!\\()", "g").replace("reflink", Dr).replace("nolink", Er).getRegex(), Vt = {
  _backpedal: Ne,
  // only used for GFM url
  anyPunctuation: ni,
  autolink: ii,
  blockSkip: Qn,
  br: Rr,
  code: Gn,
  del: Ne,
  emStrongLDelim: Xn,
  emStrongRDelimAst: ei,
  emStrongRDelimUnd: ri,
  escape: Un,
  link: li,
  nolink: Er,
  punctuation: Kn,
  reflink: Dr,
  reflinkSearch: si,
  tag: ai,
  text: qn,
  url: Ne
}, ci = {
  ...Vt,
  link: X(/^!?\[(label)\]\((.*?)\)/).replace("label", dt).getRegex(),
  reflink: X(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", dt).getRegex()
}, zt = {
  ...Vt,
  emStrongRDelimAst: ti,
  emStrongLDelim: Jn,
  url: X(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, di = {
  ...zt,
  br: X(Rr).replace("{2,}", "*").getRegex(),
  text: X(zt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, tt = {
  normal: Ft,
  gfm: On,
  pedantic: Vn
}, $e = {
  normal: Vt,
  gfm: zt,
  breaks: di,
  pedantic: ci
}, pi = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, tr = (t) => pi[t];
function xe(t, e) {
  if (e) {
    if (le.escapeTest.test(t))
      return t.replace(le.escapeReplace, tr);
  } else if (le.escapeTestNoEncode.test(t))
    return t.replace(le.escapeReplaceNoEncode, tr);
  return t;
}
function rr(t) {
  try {
    t = encodeURI(t).replace(le.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function nr(t, e) {
  var a;
  const n = t.replace(le.findPipe, (l, s, p) => {
    let d = !1, g = s;
    for (; --g >= 0 && p[g] === "\\"; ) d = !d;
    return d ? "|" : " |";
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
function De(t, e, n) {
  const i = t.length;
  if (i === 0)
    return "";
  let o = 0;
  for (; o < i && t.charAt(i - o - 1) === e; )
    o++;
  return t.slice(0, i - o);
}
function gi(t, e) {
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
function ir(t, e, n, i, o) {
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
function hi(t, e, n) {
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
var pt = class {
  // set by the lexer
  constructor(t) {
    q(this, "options");
    q(this, "rules");
    // set by the lexer
    q(this, "lexer");
    this.options = t || Te;
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
        text: this.options.pedantic ? n : De(n, `
`)
      };
    }
  }
  fences(t) {
    const e = this.rules.block.fences.exec(t);
    if (e) {
      const n = e[0], i = hi(n, e[3] || "", this.rules);
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
        const i = De(n, "#");
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
        raw: De(e[0], `
`)
      };
  }
  blockquote(t) {
    const e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = De(e[0], `
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
        const d = s.join(`
`), g = d.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${d}` : d, o = o ? `${o}
${g}` : g;
        const u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(g, a, !0), this.lexer.state.top = u, n.length === 0)
          break;
        const h = a.at(-1);
        if ((h == null ? void 0 : h.type) === "code")
          break;
        if ((h == null ? void 0 : h.type) === "blockquote") {
          const x = h, f = x.raw + `
` + n.join(`
`), b = this.blockquote(f);
          a[a.length - 1] = b, i = i.substring(0, i.length - x.raw.length) + b.raw, o = o.substring(0, o.length - x.text.length) + b.text;
          break;
        } else if ((h == null ? void 0 : h.type) === "list") {
          const x = h, f = x.raw + `
` + n.join(`
`), b = this.list(f);
          a[a.length - 1] = b, i = i.substring(0, i.length - h.raw.length) + b.raw, o = o.substring(0, o.length - x.raw.length) + b.raw, n = f.substring(a.at(-1).raw.length).split(`
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
        let p = !1, d = "", g = "";
        if (!(e = a.exec(t)) || this.rules.block.hr.test(t))
          break;
        d = e[0], t = t.substring(d.length);
        let u = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (v) => " ".repeat(3 * v.length)), h = t.split(`
`, 1)[0], x = !u.trim(), f = 0;
        if (this.options.pedantic ? (f = 2, g = u.trimStart()) : x ? f = e[1].length + 1 : (f = e[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, g = u.slice(f), f += e[1].length), x && this.rules.other.blankLine.test(h) && (d += h + `
`, t = t.substring(h.length + 1), p = !0), !p) {
          const v = this.rules.other.nextBulletRegex(f), m = this.rules.other.hrRegex(f), y = this.rules.other.fencesBeginRegex(f), w = this.rules.other.headingBeginRegex(f), L = this.rules.other.htmlBeginRegex(f);
          for (; t; ) {
            const z = t.split(`
`, 1)[0];
            let A;
            if (h = z, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), A = h) : A = h.replace(this.rules.other.tabCharGlobal, "    "), y.test(h) || w.test(h) || L.test(h) || v.test(h) || m.test(h))
              break;
            if (A.search(this.rules.other.nonSpaceChar) >= f || !h.trim())
              g += `
` + A.slice(f);
            else {
              if (x || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || y.test(u) || w.test(u) || m.test(u))
                break;
              g += `
` + h;
            }
            !x && !h.trim() && (x = !0), d += z + `
`, t = t.substring(z.length + 1), u = A.slice(f);
          }
        }
        o.loose || (l ? o.loose = !0 : this.rules.other.doubleBlankLine.test(d) && (l = !0));
        let b = null, C;
        this.options.gfm && (b = this.rules.other.listIsTask.exec(g), b && (C = b[0] !== "[ ] ", g = g.replace(this.rules.other.listReplaceTask, ""))), o.items.push({
          type: "list_item",
          raw: d,
          task: !!b,
          checked: C,
          loose: !1,
          text: g,
          tokens: []
        }), o.raw += d;
      }
      const s = o.items.at(-1);
      if (s)
        s.raw = s.raw.trimEnd(), s.text = s.text.trimEnd();
      else
        return;
      o.raw = o.raw.trimEnd();
      for (let p = 0; p < o.items.length; p++)
        if (this.lexer.state.top = !1, o.items[p].tokens = this.lexer.blockTokens(o.items[p].text, []), !o.loose) {
          const d = o.items[p].tokens.filter((u) => u.type === "space"), g = d.length > 0 && d.some((u) => this.rules.other.anyLine.test(u.raw));
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
    const n = nr(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = (l = e[3]) != null && l.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
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
        a.rows.push(nr(s, a.header.length).map((p, d) => ({
          text: p,
          tokens: this.lexer.inline(p),
          header: !1,
          align: a.align[d]
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
        const a = De(n.slice(0, -1), "\\");
        if ((n.length - a.length) % 2 === 0)
          return;
      } else {
        const a = gi(e[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), ir(e, {
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
      return ir(n, o, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
    if (!(i[1] || i[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
      const a = [...i[0]].length - 1;
      let l, s, p = a, d = 0;
      const g = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (g.lastIndex = 0, e = e.slice(-1 * t.length + a); (i = g.exec(e)) != null; ) {
        if (l = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !l) continue;
        if (s = [...l].length, i[3] || i[4]) {
          p += s;
          continue;
        } else if ((i[5] || i[6]) && a % 3 && !((a + s) % 3)) {
          d += s;
          continue;
        }
        if (p -= s, p > 0) continue;
        s = Math.min(s, s + p + d);
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
        const x = h.slice(2, -2);
        return {
          type: "strong",
          raw: h,
          text: x,
          tokens: this.lexer.inlineTokens(x)
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
}, be = class Rt {
  constructor(e) {
    q(this, "tokens");
    q(this, "options");
    q(this, "state");
    q(this, "tokenizer");
    q(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Te, this.options.tokenizer = this.options.tokenizer || new pt(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      other: le,
      block: tt.normal,
      inline: $e.normal
    };
    this.options.pedantic ? (n.block = tt.pedantic, n.inline = $e.pedantic) : this.options.gfm && (n.block = tt.gfm, this.options.breaks ? n.inline = $e.breaks : n.inline = $e.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: tt,
      inline: $e
    };
  }
  /**
   * Static Lex Method
   */
  static lex(e, n) {
    return new Rt(n).lex(e);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(e, n) {
    return new Rt(n).inlineTokens(e);
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
      if ((a = (o = this.options.extensions) == null ? void 0 : o.block) != null && a.some((d) => (s = d.call({ lexer: this }, e, n)) ? (e = e.substring(s.raw.length), n.push(s), !0) : !1))
        continue;
      if (s = this.tokenizer.space(e)) {
        e = e.substring(s.raw.length);
        const d = n.at(-1);
        s.raw.length === 1 && d !== void 0 ? d.raw += `
` : n.push(s);
        continue;
      }
      if (s = this.tokenizer.code(e)) {
        e = e.substring(s.raw.length);
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "paragraph" || (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + s.raw, d.text += `
` + s.text, this.inlineQueue.at(-1).src = d.text) : n.push(s);
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
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "paragraph" || (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + s.raw, d.text += `
` + s.raw, this.inlineQueue.at(-1).src = d.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = {
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
        let d = 1 / 0;
        const g = e.slice(1);
        let u;
        this.options.extensions.startBlock.forEach((h) => {
          u = h.call({ lexer: this }, g), typeof u == "number" && u >= 0 && (d = Math.min(d, u));
        }), d < 1 / 0 && d >= 0 && (p = e.substring(0, d + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(p))) {
        const d = n.at(-1);
        i && (d == null ? void 0 : d.type) === "paragraph" ? (d.raw += `
` + s.raw, d.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = d.text) : n.push(s), i = p.length !== e.length, e = e.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(e)) {
        e = e.substring(s.raw.length);
        const d = n.at(-1);
        (d == null ? void 0 : d.type) === "text" ? (d.raw += `
` + s.raw, d.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = d.text) : n.push(s);
        continue;
      }
      if (e) {
        const d = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(d);
          break;
        } else
          throw new Error(d);
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
    var s, p, d;
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
      if ((d = this.options.extensions) != null && d.startInline) {
        let h = 1 / 0;
        const x = e.slice(1);
        let f;
        this.options.extensions.startInline.forEach((b) => {
          f = b.call({ lexer: this }, x), typeof f == "number" && f >= 0 && (h = Math.min(h, f));
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
}, gt = class {
  // set by the parser
  constructor(t) {
    q(this, "options");
    q(this, "parser");
    this.options = t || Te;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    var a;
    const i = (a = (e || "").match(le.notSpaceStart)) == null ? void 0 : a[0], o = t.replace(le.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + xe(i) + '">' + (n ? o : xe(o, !0)) + `</code></pre>
` : "<pre><code>" + (n ? o : xe(o, !0)) + `</code></pre>
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
      t.loose ? ((n = t.tokens[0]) == null ? void 0 : n.type) === "paragraph" ? (t.tokens[0].text = i + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = i + " " + xe(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({
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
    return `<code>${xe(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    const i = this.parser.parseInline(n), o = rr(t);
    if (o === null)
      return i;
    t = o;
    let a = '<a href="' + t + '"';
    return e && (a += ' title="' + xe(e) + '"'), a += ">" + i + "</a>", a;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    const o = rr(t);
    if (o === null)
      return xe(n);
    t = o;
    let a = `<img src="${t}" alt="${n}"`;
    return e && (a += ` title="${xe(e)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : xe(t.text);
  }
}, Ut = class {
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
}, ve = class Bt {
  constructor(e) {
    q(this, "options");
    q(this, "renderer");
    q(this, "textRenderer");
    this.options = e || Te, this.options.renderer = this.options.renderer || new gt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Ut();
  }
  /**
   * Static Parse Method
   */
  static parse(e, n) {
    return new Bt(n).parse(e);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(e, n) {
    return new Bt(n).parseInline(e);
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
        const d = s, g = this.options.extensions.renderers[d.type].call({ parser: this }, d);
        if (g !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(d.type)) {
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
          let d = p, g = this.renderer.text(d);
          for (; l + 1 < e.length && e[l + 1].type === "text"; )
            d = e[++l], g += `
` + this.renderer.text(d);
          n ? i += this.renderer.paragraph({
            type: "paragraph",
            raw: g,
            text: g,
            tokens: [{ type: "text", raw: g, text: g, escaped: !0 }]
          }) : i += g;
          continue;
        }
        default: {
          const d = 'Token with "' + p.type + '" type was not found.';
          if (this.options.silent)
            return console.error(d), "";
          throw new Error(d);
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
        const d = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (d !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += d || "";
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
          const d = 'Token with "' + p.type + '" type was not found.';
          if (this.options.silent)
            return console.error(d), "";
          throw new Error(d);
        }
      }
    }
    return i;
  }
}, Tt, st = (Tt = class {
  constructor(t) {
    q(this, "options");
    q(this, "block");
    this.options = t || Te;
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
])), Tt), ui = class {
  constructor(...t) {
    q(this, "defaults", Et());
    q(this, "options", this.setOptions);
    q(this, "parse", this.parseMarkdown(!0));
    q(this, "parseInline", this.parseMarkdown(!1));
    q(this, "Parser", ve);
    q(this, "Renderer", gt);
    q(this, "TextRenderer", Ut);
    q(this, "Lexer", be);
    q(this, "Tokenizer", pt);
    q(this, "Hooks", st);
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
        const o = this.defaults.renderer || new gt(this.defaults);
        for (const a in n.renderer) {
          if (!(a in o))
            throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a))
            continue;
          const l = a, s = n.renderer[l], p = o[l];
          o[l] = (...d) => {
            let g = s.apply(o, d);
            return g === !1 && (g = p.apply(o, d)), g || "";
          };
        }
        i.renderer = o;
      }
      if (n.tokenizer) {
        const o = this.defaults.tokenizer || new pt(this.defaults);
        for (const a in n.tokenizer) {
          if (!(a in o))
            throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a))
            continue;
          const l = a, s = n.tokenizer[l], p = o[l];
          o[l] = (...d) => {
            let g = s.apply(o, d);
            return g === !1 && (g = p.apply(o, d)), g;
          };
        }
        i.tokenizer = o;
      }
      if (n.hooks) {
        const o = this.defaults.hooks || new st();
        for (const a in n.hooks) {
          if (!(a in o))
            throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a))
            continue;
          const l = a, s = n.hooks[l], p = o[l];
          st.passThroughHooks.has(a) ? o[l] = (d) => {
            if (this.defaults.async)
              return Promise.resolve(s.call(o, d)).then((u) => p.call(o, u));
            const g = s.call(o, d);
            return p.call(o, g);
          } : o[l] = (...d) => {
            let g = s.apply(o, d);
            return g === !1 && (g = p.apply(o, d)), g;
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
        return Promise.resolve(a.hooks ? a.hooks.preprocess(n) : n).then((d) => s(d, a)).then((d) => a.hooks ? a.hooks.processAllTokens(d) : d).then((d) => a.walkTokens ? Promise.all(this.walkTokens(d, a.walkTokens)).then(() => d) : d).then((d) => p(d, a)).then((d) => a.hooks ? a.hooks.postprocess(d) : d).catch(l);
      try {
        a.hooks && (n = a.hooks.preprocess(n));
        let d = s(n, a);
        a.hooks && (d = a.hooks.processAllTokens(d)), a.walkTokens && this.walkTokens(d, a.walkTokens);
        let g = p(d, a);
        return a.hooks && (g = a.hooks.postprocess(g)), g;
      } catch (d) {
        return l(d);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        const i = "<p>An error occurred:</p><pre>" + xe(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e)
        return Promise.reject(n);
      throw n;
    };
  }
}, Ie = new ui();
function Z(t, e) {
  return Ie.parse(t, e);
}
Z.options = Z.setOptions = function(t) {
  return Ie.setOptions(t), Z.defaults = Ie.defaults, Lr(Z.defaults), Z;
};
Z.getDefaults = Et;
Z.defaults = Te;
Z.use = function(...t) {
  return Ie.use(...t), Z.defaults = Ie.defaults, Lr(Z.defaults), Z;
};
Z.walkTokens = function(t, e) {
  return Ie.walkTokens(t, e);
};
Z.parseInline = Ie.parseInline;
Z.Parser = ve;
Z.parser = ve.parse;
Z.Renderer = gt;
Z.TextRenderer = Ut;
Z.Lexer = be;
Z.lexer = be.lex;
Z.Tokenizer = pt;
Z.Hooks = st;
Z.parse = Z;
Z.options;
Z.setOptions;
Z.use;
Z.walkTokens;
Z.parseInline;
ve.parse;
be.lex;
class fi {
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
      const b = s[f], C = b.trim();
      if (!C || C.startsWith("#")) continue;
      const v = /^(\s{2,}|\t)/.test(b), m = b.indexOf(":");
      if (m === -1) continue;
      const y = b.slice(0, m).trim();
      let w = b.slice(m + 1).trim();
      const L = w.startsWith('"') && w.endsWith('"') || w.startsWith("'") && w.endsWith("'");
      L && (w = w.slice(1, -1)), v && p ? ((!l[p] || typeof l[p] != "object") && (l[p] = {}), l[p][y] = w) : w === "" && !L ? (p = y, l[p] = {}) : (p = null, l[y] = w);
    }
    let d = "";
    try {
      d = Ae(Z.parse(a));
    } catch {
      d = Ae("<p>" + a.replace(/\n\n+/g, "</p><p>") + "</p>");
    }
    const g = l.name || l.product_name || l.title || n || "Unknown App", u = l.slug || n || g.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-"), h = l.id || u;
    let x = "1.0.0";
    return l.version && typeof l.version == "object" ? x = l.version["version-string"] || l.version.versionString || l.version.version || "1.0.0" : typeof l.version == "string" && (x = l.version), {
      id: h,
      title: g,
      name: g,
      slug: u,
      category: l.category || l.categories || "General",
      categories: l.categories || l.category || "General",
      product_type: l.product_type || "Desktop App",
      version: x,
      rawVersion: l.version,
      active: l.active !== void 0 ? l.active : "1",
      icon: typeof l.icon == "string" && l.icon.trim() || typeof l.imageUrl == "string" && l.imageUrl.trim() || "",
      imageUrl: typeof l.imageUrl == "string" && l.imageUrl.trim() || typeof l.icon == "string" && l.icon.trim() || "",
      short_description: l.short_description || l.description || "",
      description: l.description || l.short_description || "",
      full_description: d || l.description || l.short_description || "",
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
    const n = typeof e == "string" ? { productsUrl: e } : e, i = n.productsUrl || "data/apps.json", o = n.mdDir || "data/apps/", a = n.filterActive !== !1;
    if (this.products && this.products.length > 0)
      return a ? this.products.filter((g) => g.active === "1" || g.active === 1 || g.active === !0 || g.active === void 0) : this.products;
    const l = `eg_apps_cache_v4_${encodeURIComponent(i)}`, s = this.getPersistent(l);
    if (s && Array.isArray(s) && s.length > 0)
      return this.products = s, a ? s.filter((g) => g.active === "1" || g.active === 1 || g.active === !0 || g.active === void 0) : s;
    const p = (n.slugs && n.slugs.length > 0 ? n.slugs : this.KNOWN_APP_SLUGS).slice(), d = this.getRequestedAppSlug();
    d && !p.includes(d) && p.unshift(d);
    try {
      const g = p.map(async (x) => {
        try {
          const f = x.trim(), b = [
            `${o}${f.toLowerCase()}.md`,
            `${o}${f}.md`
          ];
          let C = null;
          for (const v of b)
            try {
              const m = await fetch(v);
              if (m.ok) {
                C = await m.text();
                break;
              }
            } catch {
            }
          return C ? this.parseAppMarkdown(C, f) : null;
        } catch {
          return null;
        }
      }), h = (await Promise.all(g)).filter((x) => x !== null);
      if (h.length > 0)
        return h.sort((x, f) => {
          const b = new Date(x.createdAt || x.updatedAt || 0).getTime(), C = new Date(f.createdAt || f.updatedAt || 0).getTime();
          return !isNaN(b) && !isNaN(C) && b !== C ? C - b : String(f.id || "").localeCompare(String(x.id || ""));
        }), this.products = h, this.setPersistent(l, h), a ? h.filter((x) => x.active === "1" || x.active === 1 || x.active === !0 || x.active === void 0) : h;
    } catch (g) {
      console.warn("[DataCache] Failed loading markdown apps:", g);
    }
    try {
      const g = await fetch(i);
      if (!g.ok) throw new Error(`HTTP error ${g.status}`);
      const u = await g.json();
      return u.sort((h, x) => {
        const f = new Date(h.createdAt || h.updatedAt || 0).getTime(), b = new Date(x.createdAt || x.updatedAt || 0).getTime();
        return !isNaN(f) && !isNaN(b) && f !== b ? b - f : String(x.id || "").localeCompare(String(h.id || ""));
      }), this.products = u, this.setPersistent(l, u), a ? u.filter((h) => h.active === "1" || h.active === 1 || h.active === !0 || h.active === void 0) : u;
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
    for (const C of s) {
      const v = C.trim();
      if (!v || v.startsWith("#")) continue;
      const m = C.indexOf(":");
      if (m === -1) continue;
      const y = C.slice(0, m).trim();
      let w = C.slice(m + 1).trim();
      w.startsWith('"') && w.endsWith('"') || w.startsWith("'") && w.endsWith("'") ? w = w.slice(1, -1) : w.startsWith("[") && w.endsWith("]") && (w = w.slice(1, -1).split(",").map((z) => z.trim().replace(/^["']|["']$/g, "")).filter(Boolean)), l[y] = w;
    }
    const p = String(l.id || n || "").trim().replace(/^id/i, ""), d = l.title || l.heading || `Blog ${p}`, g = Array.isArray(l.tags) ? l.tags : l.category ? [l.category] : ["General"], u = (l.short_description || l.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), h = u.length > 140 ? u.slice(0, 140) + "..." : u, x = (a || "").split(/\s+/).length, b = `${Math.max(1, Math.round(x / 200))} min read`;
    return {
      id: p,
      slug: l.slug || `post-${p}`,
      title: d,
      heading: l.heading || d,
      description: h,
      short_description: h,
      content: a,
      date: l.createdAt || l.release_date || l.date || "2026",
      author: l.author || "Author",
      tags: g,
      category: l.category || (g.length > 0 ? g[0] : "General"),
      readingTime: l.readingTime || b,
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
          const d = p.map((g) => {
            const u = String(g.id).trim().replace(/^id/i, ""), h = Array.isArray(g.tags) ? g.tags.flatMap((x) => x.split(",").map((f) => f.trim())).filter(Boolean) : [g.category || "General"];
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
          return d.sort((g, u) => {
            const h = Number(g.id), x = Number(u.id);
            return !isNaN(h) && !isNaN(x) ? x - h : String(u.date || "").localeCompare(String(g.date || ""));
          }), this.blogs = d, this.setPersistent(o, d), d;
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
      }), d = (await Promise.all(s)).filter((g) => g !== null);
      if (d.sort((g, u) => {
        const h = Number(g.id), x = Number(u.id);
        return !isNaN(h) && !isNaN(x) ? x - h : String(u.date || "").localeCompare(String(g.date || ""));
      }), d.length > 0)
        return this.blogs = d, this.setPersistent(o, d), d;
    } catch (s) {
      console.warn("[DataCache] Failed to load blog markdown files:", s);
    }
    return [];
  }
}
const we = new fi(), fl = (t) => t.slug ? t.slug : (t.title || t.name || `app-${t.id}`).trim().toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-"), xi = (t) => t.slug && !/^post-\d+$/i.test(t.slug) && !/^article-\d+$/i.test(t.slug) && !/^\d+$/.test(t.slug) ? t.slug : String(t.heading || t.title || `article-${t.id}`).trim().replace(/c\+\+/gi, "cpp").replace(/c#/gi, "csharp").replace(/f#/gi, "fsharp").replace(/\.net\b/gi, "dotnet").replace(/&/g, " and ").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s-]+/g, "-") || `article-${t.id}`, or = ({
  className: t = "",
  size: e = "md",
  showLabel: n = !1,
  customKeys: i,
  onRefreshComplete: o
}) => {
  const [a, l] = W(!1), s = async () => {
    if (!(a || typeof window > "u")) {
      l(!0);
      try {
        we.clearCache("ALL");
        try {
          localStorage.removeItem("analytics_consent"), localStorage.removeItem("analytics_optout"), localStorage.removeItem("analytics_session"), i && Array.isArray(i) && i.forEach((d) => localStorage.removeItem(d)), sessionStorage.clear();
        } catch (d) {
          console.warn("[CacheBuster] Storage reset error:", d);
        }
        if ("caches" in window) {
          const d = await window.caches.keys();
          await Promise.all(d.map((g) => window.caches.delete(g)));
        }
        if ("serviceWorker" in navigator) {
          const d = await navigator.serviceWorker.getRegistrations();
          await Promise.all(d.map((g) => g.unregister()));
        }
      } catch (d) {
        console.warn("[CacheBuster] Cache clearance error:", d);
      }
      if (o)
        o();
      else {
        const d = new URL(window.location.href);
        d.searchParams.set("reload", Date.now().toString()), window.location.href = d.toString();
      }
    }
  }, p = e === "sm" ? 16 : e === "lg" ? 22 : 18;
  return /* @__PURE__ */ c(
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
      onMouseEnter: (d) => {
        d.currentTarget.style.borderColor = "var(--eg-border-hover, #10b981)", d.currentTarget.style.backgroundColor = "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.05))";
      },
      onMouseLeave: (d) => {
        d.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", d.currentTarget.style.backgroundColor = "transparent";
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
}, xl = ({
  items: t,
  intervalMs: e = 4500,
  label: n = "News",
  theme: i = "auto",
  className: o = "",
  style: a = {}
}) => {
  const [l, s] = W(0), [p, d] = W(!1), { isDark: g } = vt();
  if (Y(() => {
    if (!t || t.length <= 1 || p) return;
    const m = setInterval(() => {
      s((y) => (y + 1) % t.length);
    }, e);
    return () => clearInterval(m);
  }, [t, e, p]), !t || t.length === 0) return null;
  const u = t[l], h = i === "dark" ? !0 : i === "light" ? !1 : g, x = h ? "rgba(255, 255, 255, 0.08)" : "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))", f = h ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))", b = h ? "#ffffff" : "var(--eg-text-primary, #0f172a)", C = h ? "#cbd5e1" : "var(--eg-text-secondary, #475569)", v = h ? "#94a3b8" : "var(--eg-text-muted, #94a3b8)";
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-totem-ticker ${o}`,
      onMouseEnter: () => d(!0),
      onMouseLeave: () => d(!1),
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px 16px",
        background: x,
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
        /* @__PURE__ */ r("div", { style: { flex: 1, minWidth: 0, overflow: "hidden" }, children: /* @__PURE__ */ c(
          "a",
          {
            href: ne(u.link),
            style: {
              color: b,
              textDecoration: "none",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              display: "block",
              transition: "color 0.15s ease"
            },
            onMouseEnter: (m) => {
              m.currentTarget.style.color = "var(--eg-color-primary, #10b981)";
            },
            onMouseLeave: (m) => {
              m.currentTarget.style.color = b;
            },
            children: [
              /* @__PURE__ */ r("strong", { children: u.title }),
              u.description && /* @__PURE__ */ c("span", { style: { color: C, marginLeft: "8px" }, children: [
                "— ",
                u.description
              ] })
            ]
          }
        ) }),
        t.length > 1 && /* @__PURE__ */ c("div", { style: { display: "flex", gap: "4px", flexShrink: 0 }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => s((m) => (m - 1 + t.length) % t.length),
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
              onClick: () => s((m) => (m + 1) % t.length),
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
}, Gt = ({
  isOpen: t,
  onClose: e,
  title: n,
  url: i,
  description: o = "",
  imageUrl: a
}) => {
  const [l, s] = W(!1), p = i || (typeof window < "u" ? window.location.href : ""), d = async () => {
    try {
      await navigator.clipboard.writeText(p), s(!0), setTimeout(() => s(!1), 2500);
    } catch {
    }
  }, g = encodeURIComponent(p), u = o && o.trim() && o.trim() !== n.trim() ? `${n} - ${o.trim()}` : n, h = encodeURIComponent(u), x = [
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
  return /* @__PURE__ */ r(ct, { isOpen: t, onClose: e, title: `Share "${n}"`, maxWidth: "480px", children: /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
    (a || o) && /* @__PURE__ */ c(
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
          /* @__PURE__ */ c("div", { style: { minWidth: 0, flex: 1 }, children: [
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
    /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "10px" }, children: x.map((f) => /* @__PURE__ */ r(
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
        onMouseEnter: (b) => {
          b.currentTarget.style.borderColor = f.color, b.currentTarget.style.color = f.color;
        },
        onMouseLeave: (b) => {
          b.currentTarget.style.borderColor = "var(--eg-border-subtle, rgba(255, 255, 255, 0.12))", b.currentTarget.style.color = "var(--eg-text-primary, #f8fafc)";
        },
        children: f.name
      },
      f.name
    )) }),
    /* @__PURE__ */ c("div", { children: [
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
      /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px" }, children: [
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
            onClick: d,
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
}, ke = "analytics_consent", Ye = "analytics_session", mi = 50, yi = 3500, bi = () => {
  const t = /* @__PURE__ */ new Date(), e = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
  return `${e}-${n}-${i}`;
}, vi = (t) => /windows/i.test(t) ? "Windows" : /macintosh|mac os x/i.test(t) ? "macOS" : /linux/i.test(t) ? "Linux" : /android/i.test(t) ? "Android" : /iphone|ipad|ipod/i.test(t) ? "iOS" : "Unknown OS", wi = (t) => /edg\//i.test(t) ? "Edge" : /opr\/|opera/i.test(t) ? "Opera" : /chrome|crios/i.test(t) ? "Chrome" : /firefox|fxios/i.test(t) ? "Firefox" : /safari/i.test(t) && !/chrome|crios/i.test(t) ? "Safari" : "Unknown Browser", ki = async () => {
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
    const e = new AbortController(), n = setTimeout(() => e.abort(), yi);
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
}, qt = (t) => {
  if (typeof window > "u") return !1;
  try {
    const e = t || ke;
    return localStorage.getItem(e) === "denied" ? !0 : localStorage.getItem("analytics_optout") === "true";
  } catch {
    return !1;
  }
}, Si = (t) => {
  if (typeof window > "u") return !1;
  try {
    if (qt(t)) return !1;
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
}, Ci = (t) => {
  if (!(typeof window > "u"))
    try {
      const e = t || Ye;
      sessionStorage.setItem(e, "1");
    } catch {
    }
}, Ai = async (t, e = {}) => {
  if (typeof window > "u" || qt(e.consentStorageKey) || jr(e.sessionStorageKey)) return null;
  const n = t || (typeof window < "u" && window.location.hostname ? window.location.hostname : "web-app"), i = navigator.userAgent || "", o = vi(i), a = wi(i), l = window.location.pathname + (window.location.search || "");
  let s = "Direct";
  if (document.referrer)
    try {
      s = new URL(document.referrer, window.location.href).hostname || "Direct";
    } catch {
      s = "Unknown";
    }
  const p = window.screen ? `${window.screen.width}x${window.screen.height}` : "Unknown", d = typeof Intl < "u" && Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown", g = navigator.language || "en", u = await ki();
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
    timezone: d,
    os: o,
    browser: a,
    screen: p,
    language: g
  };
}, Ii = async (t, e, n = {}) => {
  var g, u, h, x, f, b, C;
  if (!t || !e) return !1;
  const i = n.collectionName || "visitor_analytics", o = n.pageSize || mi, a = bi(), l = {};
  for (const [v, m] of Object.entries(e))
    l[v] = m == null ? "" : String(m);
  const s = typeof window < "u" && ((u = (g = window.firebase) == null ? void 0 : g.firestore) == null ? void 0 : u.FieldValue) || ((h = t == null ? void 0 : t.constructor) == null ? void 0 : h.FieldValue) || ((b = (f = (x = t == null ? void 0 : t.app) == null ? void 0 : x.firebase) == null ? void 0 : f.firestore) == null ? void 0 : b.FieldValue) || ((C = t == null ? void 0 : t.firestore) == null ? void 0 : C.FieldValue), p = s && typeof s.serverTimestamp == "function" ? s.serverTimestamp() : (/* @__PURE__ */ new Date()).toISOString(), d = t.collection(i).doc("meta");
  try {
    return await t.runTransaction(async (v) => {
      const m = await v.get(d);
      let y = 1, w = 0, L = 0, z = a, A = 0;
      if (m && (typeof m.exists == "function" ? m.exists() : m.exists)) {
        const j = m.data() || {};
        y = j.currentPage || 1, w = j.currentCount || 0, L = j.totalVisitors || 0, j.todayDate === a ? A = j.todayCount || 0 : (z = a, A = 0);
      }
      w >= o && (y++, w = 0);
      const R = t.collection(i).doc(`page_${y}`);
      let B;
      s && typeof s.arrayUnion == "function" ? B = s.arrayUnion(l) : B = [l], v.set(
        R,
        {
          pageNum: y,
          lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
          logs: B
        },
        { merge: !0 }
      ), v.set(
        d,
        {
          currentPage: y,
          currentCount: w + 1,
          totalVisitors: L + 1,
          todayDate: z,
          todayCount: A + 1,
          lastUpdated: p
        },
        { merge: !0 }
      );
    }), !0;
  } catch (v) {
    const m = (v == null ? void 0 : v.message) || String(v);
    if ((v == null ? void 0 : v.code) === "permission-denied" || m.toLowerCase().includes("permission"))
      console.error(
        `[writeVisitorLogToFirestore] Firestore permission denied for collection "${i}". Security rules must allow create/update on page documents and read/write on meta document. Please check firestore.rules in Firebase Console. Details: ${m}`
      );
    else {
      console.warn("[writeVisitorLogToFirestore] Transaction failed, attempting direct batch fallback:", v);
      try {
        const y = await d.get();
        let w = 1, L = 0, z = 0, A = 0, R = a;
        if (y && (typeof y.exists == "function" ? y.exists() : y.exists)) {
          const I = y.data() || {};
          w = I.currentPage || 1, L = I.currentCount || 0, z = I.totalVisitors || 0, I.todayDate === a && (A = I.todayCount || 0);
        }
        L >= o && (w++, L = 0);
        const B = t.collection(i).doc(`page_${w}`), j = s && typeof s.arrayUnion == "function" ? s.arrayUnion(l) : [l];
        return await B.set(
          {
            pageNum: w,
            lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
            logs: j
          },
          { merge: !0 }
        ), await d.set(
          {
            currentPage: w,
            currentCount: L + 1,
            totalVisitors: z + 1,
            todayDate: R,
            todayCount: A + 1,
            lastUpdated: p
          },
          { merge: !0 }
        ), !0;
      } catch (y) {
        console.warn("[writeVisitorLogToFirestore] Direct fallback also failed:", y);
      }
    }
    return !1;
  }
}, ml = ({
  privacyPolicyUrl: t = "privacypolicy",
  storageKey: e,
  message: n = "We collect anonymous telemetry to optimize tools & apps performance.",
  privacyPolicyLabel: i = "Privacy Policy",
  acceptLabel: o = "OK",
  declineLabel: a = "Decline",
  onConsentChange: l
}) => {
  const [s, p] = W(!1), d = e || ke;
  Y(() => {
    try {
      localStorage.getItem(d) || localStorage.getItem(ke) || localStorage.getItem("analytics_consent") || p(!0);
    } catch {
    }
    const u = () => {
      p(!0);
    }, h = (x) => {
      const f = x;
      (f.detail === "granted" || f.detail === "denied") && p(!1);
    };
    if (window.addEventListener("show_consent_banner", u), window.addEventListener("analytics_consent_changed", h), typeof window < "u") {
      const x = {
        showConsentBanner: () => {
          window.dispatchEvent(new CustomEvent("show_consent_banner"));
        },
        grantConsent: () => g("granted"),
        denyConsent: () => g("denied")
      };
      window.AnalyticsTracker = x;
    }
    return () => {
      window.removeEventListener("show_consent_banner", u), window.removeEventListener("analytics_consent_changed", h);
    };
  }, [d]);
  const g = (u) => {
    try {
      localStorage.setItem(d, u), d !== ke && localStorage.setItem(ke, u), localStorage.setItem("analytics_consent", u), u === "denied" ? (localStorage.setItem("analytics_optout", "true"), sessionStorage.removeItem(Ye)) : localStorage.removeItem("analytics_optout");
    } catch {
    }
    p(!1), window.dispatchEvent(new CustomEvent("analytics_consent_changed", { detail: u })), window.dispatchEvent(new CustomEvent("eg_consent_changed", { detail: u })), l && l(u);
  };
  return s ? /* @__PURE__ */ c(
    "aside",
    {
      id: "analytics-consent-banner",
      "aria-label": "Privacy and Cookie Consent",
      style: {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: "680px",
        background: "rgba(15, 23, 42, 0.94)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#f8fafc",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        padding: "14px 20px",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "14px",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        fontSize: "13.5px",
        lineHeight: 1.5,
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ c("div", { style: { flex: "1 1 240px", minWidth: 0 }, children: [
          /* @__PURE__ */ r("span", { children: n }),
          " ",
          t && /* @__PURE__ */ r(
            "a",
            {
              href: ne(t),
              style: {
                color: "#60a5fa",
                textDecoration: "underline",
                marginLeft: "6px",
                fontWeight: 500
              },
              children: i
            }
          )
        ] }),
        /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => g("denied"),
              style: {
                background: "rgba(255, 255, 255, 0.08)",
                color: "#cbd5e1",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                padding: "7px 15px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s ease"
              },
              onMouseEnter: (u) => {
                u.currentTarget.style.background = "rgba(239, 68, 68, 0.2)", u.currentTarget.style.borderColor = "#ef4444", u.currentTarget.style.color = "#fca5a5";
              },
              onMouseLeave: (u) => {
                u.currentTarget.style.background = "rgba(255, 255, 255, 0.08)", u.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.22)", u.currentTarget.style.color = "#cbd5e1";
              },
              children: a
            }
          ),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => g("granted"),
              style: {
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                padding: "7px 18px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease"
              },
              onMouseEnter: (u) => {
                u.currentTarget.style.background = "#1d4ed8";
              },
              onMouseLeave: (u) => {
                u.currentTarget.style.background = "#2563eb";
              },
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
  className: d = "",
  style: g = {}
}) => {
  const [u, h] = W("pending"), x = te(() => {
    try {
      const m = localStorage.getItem(t);
      if (m === "granted" || m === "denied") return m;
      if (e && e.length > 0)
        for (const y of e) {
          const w = localStorage.getItem(y);
          if (w === "denied" || w === "true") return "denied";
          if (w === "granted") return "granted";
        }
    } catch {
    }
    return "pending";
  }, [t, e]);
  Y(() => {
    h(x());
    const m = (y) => {
      const w = y;
      w.detail === "granted" || w.detail === "denied" ? h(w.detail) : h(x());
    };
    return window.addEventListener("analytics_consent_changed", m), window.addEventListener("storage", m), () => {
      window.removeEventListener("analytics_consent_changed", m), window.removeEventListener("storage", m);
    };
  }, [x]);
  const f = (m) => {
    try {
      if (localStorage.setItem(t, m), localStorage.setItem("analytics_consent", m), e && e.length > 0)
        for (const y of e)
          localStorage.setItem(y, m);
      m === "denied" ? localStorage.setItem("analytics_optout", "true") : localStorage.removeItem("analytics_optout"), m === "denied" && n && sessionStorage.removeItem(n);
    } catch {
    }
    h(m), window.dispatchEvent(new CustomEvent("analytics_consent_changed", { detail: m })), window.dispatchEvent(new CustomEvent("eg_consent_changed", { detail: m })), p && p(m);
  }, b = () => {
    try {
      localStorage.removeItem(t), localStorage.removeItem("analytics_consent"), localStorage.removeItem("analytics_optout"), e.forEach((m) => localStorage.removeItem(m)), n && sessionStorage.removeItem(n);
    } catch {
    }
    h("pending"), window.dispatchEvent(new CustomEvent("show_consent_banner")), window.dispatchEvent(new CustomEvent("eg_show_consent_banner"));
  }, C = () => {
    window.dispatchEvent(new CustomEvent("show_consent_banner")), window.dispatchEvent(new CustomEvent("eg_show_consent_banner"));
  }, v = u === "granted";
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-consent-control-card ${d}`,
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
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("div", { children: [
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
              /* @__PURE__ */ c(
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
            children: u === "granted" ? /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("strong", { children: "Telemetry is currently active:" }),
              " Non-invasive, anonymous performance metrics (operating system, browser family, approximate location) are collected via our 50-record Batched Bucket Pattern to maintain service performance. No personal identification, message content, or precise GPS coordinates are ever recorded."
            ] }) : u === "denied" ? /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("strong", { children: "Telemetry is completely blocked:" }),
              " You have opted out of all usage telemetry. An opt-out flag is preserved in your browser's local storage, preventing any diagnostic tracking on this and future visits."
            ] }) : /* @__PURE__ */ c(se, { children: [
              /* @__PURE__ */ r("strong", { children: "Default consent state:" }),
              " No preference has been recorded yet. The floating consent notice will be displayed until you choose to accept or decline."
            ] })
          }
        ),
        /* @__PURE__ */ c(
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
              a && /* @__PURE__ */ c(
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
                    /* @__PURE__ */ c(
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
                              onChange: (m) => f(m.target.checked ? "granted" : "denied"),
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
              /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: [
                l && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    id: "btnReopenConsent",
                    onClick: C,
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
                    onMouseEnter: (m) => {
                      m.currentTarget.style.background = "rgba(0, 0, 0, 0.1)";
                    },
                    onMouseLeave: (m) => {
                      m.currentTarget.style.background = "rgba(0, 0, 0, 0.05)";
                    },
                    children: "Show Floating Banner"
                  }
                ),
                s && /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: b,
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
                    onMouseEnter: (m) => {
                      m.currentTarget.style.color = "var(--eg-color-danger, #ef4444)", m.currentTarget.style.borderColor = "var(--eg-color-danger, #ef4444)";
                    },
                    onMouseLeave: (m) => {
                      m.currentTarget.style.color = "var(--eg-text-muted, #64748b)", m.currentTarget.style.borderColor = "var(--eg-border-default, rgba(0, 0, 0, 0.2))";
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
}, Nr = ({
  mainText: t = "BRAND",
  textColor: e,
  domainText: n = "",
  hoverRevealDomain: i = !0,
  domainColor: o,
  domainHoverColor: a,
  bylineText: l = "",
  showByline: s = !!l,
  hoverRevealByline: p = !0,
  bylineColor: d,
  bylineHoverColor: g,
  badgeBg: u,
  badgeHoverBg: h,
  ringBorder: x,
  ringHoverBorder: f,
  icon: b,
  fontFamily: C = "inherit",
  fontSize: v,
  size: m = 80,
  shape: y = "circle",
  innerRing: w = y === "circle",
  ringOnHoverOnly: L = !1,
  theme: z = "auto",
  dataInfo: A,
  onClick: R,
  className: B = "",
  style: j = {}
}) => {
  const [I, E] = W(!1), { isDark: H } = vt(), $ = z === "dark" ? !0 : z === "light" ? !1 : H, U = v || Math.round(m * 0.38), _ = Math.round(m * 0.135), T = Math.max(7, Math.round(m * 0.075)), S = Math.max(3, Math.round(m * 0.045)), N = L ? I : !0, k = y === "none" || L && !I ? "transparent" : $ ? I ? "var(--eg-bg-surface-hover, rgba(255, 255, 255, 0.08))" : "var(--eg-bg-surface, rgba(255, 255, 255, 0.04))" : I ? "var(--eg-bg-surface-hover, rgba(0, 0, 0, 0.04))" : "var(--eg-bg-surface, rgba(0, 0, 0, 0.02))", D = y === "none" || L && !I ? "transparent" : I ? h || u || k : u || k, O = L && !I ? "transparent" : $ ? I ? "var(--eg-border-hover, rgba(255, 255, 255, 0.35))" : "var(--eg-border-default, rgba(255, 255, 255, 0.15))" : I ? "var(--eg-border-hover, rgba(0, 0, 0, 0.25))" : "var(--eg-border-default, rgba(0, 0, 0, 0.12))", M = L && !I ? "transparent" : I ? f || x || O : x || O, P = e || ($ ? "#ffffff" : "var(--eg-text-primary, #0f172a)"), V = $ ? i ? I ? "var(--eg-text-primary, #ffffff)" : "var(--eg-text-secondary, rgba(255, 255, 255, 0.45))" : "var(--eg-text-primary, #ffffff)" : i ? I ? "var(--eg-text-primary, #0f172a)" : "var(--eg-text-secondary, rgba(0, 0, 0, 0.45))" : "var(--eg-text-primary, #0f172a)", G = I ? a || o || V : o || V, Q = $ ? p ? I ? "var(--eg-text-secondary, rgba(255, 255, 255, 0.6))" : "var(--eg-text-muted, rgba(255, 255, 255, 0.25))" : "var(--eg-text-secondary, rgba(255, 255, 255, 0.6))" : p ? I ? "var(--eg-text-secondary, rgba(0, 0, 0, 0.6))" : "var(--eg-text-muted, rgba(0, 0, 0, 0.25))" : "var(--eg-text-secondary, rgba(0, 0, 0, 0.6))", F = I ? g || d || Q : d || Q, oe = y === "circle" ? "50%" : y === "rounded" ? `${Math.max(6, Math.round(m * 0.18))}px` : y === "square" ? "4px" : "0";
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-logo-badge ${B}`,
      onClick: R,
      onMouseEnter: () => E(!0),
      onMouseLeave: () => E(!1),
      style: {
        width: `${m}px`,
        height: `${m}px`,
        borderRadius: oe,
        background: D,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        boxShadow: y !== "none" && N ? $ ? "0 2px 10px rgba(0, 0, 0, 0.25)" : "0 2px 8px rgba(0, 0, 0, 0.04)" : "none",
        transition: "background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        cursor: R ? "pointer" : "default",
        overflow: "visible",
        // Prevents cursive clipping
        boxSizing: "border-box",
        flexShrink: 0,
        ...j
      },
      children: [
        w && y !== "none" && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "absolute",
              top: `${S}px`,
              left: `${S}px`,
              right: `${S}px`,
              bottom: `${S}px`,
              border: `1.5px solid ${M}`,
              borderRadius: oe,
              pointerEvents: "none",
              opacity: N ? 1 : 0,
              transition: "opacity 0.25s ease, border-color 0.25s ease"
            }
          }
        ),
        /* @__PURE__ */ c(
          "div",
          {
            className: "eg-logo-content",
            style: {
              position: "relative",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "center",
              marginTop: s ? `${-Math.round(m * 0.04)}px` : "0",
              zIndex: 2,
              overflow: "visible",
              maxWidth: "100%",
              padding: "0 4px"
            },
            children: [
              b && /* @__PURE__ */ r("span", { style: { marginRight: t ? "6px" : "0" }, children: b }),
              t && /* @__PURE__ */ r(
                "span",
                {
                  className: "eg-logo-main-text",
                  style: {
                    fontFamily: C,
                    color: P,
                    fontSize: `${U}px`,
                    lineHeight: 1.15,
                    fontWeight: C.includes("cursive") || C.includes("Vibes") ? 300 : 700,
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.5px",
                    padding: "0 2px",
                    WebkitFontSmoothing: "antialiased",
                    textShadow: $ && I ? "0 0 10px rgba(255, 255, 255, 0.2)" : "none",
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
                    fontSize: `${_}px`,
                    fontWeight: 500,
                    color: G,
                    marginLeft: "2.5px",
                    position: "relative",
                    top: `${-Math.round(m * 0.03)}px`,
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
            "data-info": A,
            style: {
              position: "absolute",
              bottom: `${Math.round(m * 0.1)}px`,
              fontFamily: 'var(--eg-font-sans, "Plus Jakarta Sans", sans-serif)',
              fontSize: `${T}px`,
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
}, Li = ({
  variant: t = "primary",
  preset: e,
  id: n = "backToTopBtn",
  threshold: i,
  backgroundColor: o,
  hoverBackgroundColor: a,
  color: l,
  bottom: s = "25px",
  right: p = "25px",
  className: d = "",
  style: g = {}
}) => {
  const [u, h] = W("down"), [x, f] = W(!1), [b, C] = W(!1), v = te(() => {
    if (typeof window > "u" || typeof document > "u") return;
    const j = window.scrollY || document.documentElement.scrollTop || 0, I = document.documentElement.scrollHeight || document.body.scrollHeight || 0, E = window.innerHeight || document.documentElement.clientHeight || 0, H = I - E;
    if (H <= 80) {
      f(!1);
      return;
    }
    f(!0);
    const $ = i ?? Math.min(300, H * 0.35);
    j < $ ? h("down") : h("up");
  }, [i]);
  Y(() => {
    v();
    let j = !1;
    const I = () => {
      j || (window.requestAnimationFrame(() => {
        v(), j = !1;
      }), j = !0);
    };
    return window.addEventListener("scroll", I, { passive: !0 }), window.addEventListener("resize", I, { passive: !0 }), () => {
      window.removeEventListener("scroll", I), window.removeEventListener("resize", I);
    };
  }, [v]);
  const m = (j) => {
    if (j.preventDefault(), !(typeof window > "u"))
      if (u === "down") {
        const I = document.documentElement.scrollHeight || document.body.scrollHeight || 0, E = window.innerHeight || 0;
        window.scrollTo({
          top: Math.max(0, I - E),
          behavior: "smooth"
        });
      } else
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
  }, y = t === "accent" || e === "mchess", w = o || (y ? "rgba(245, 158, 11, 0.75)" : "var(--eg-color-primary, #10b981)"), L = a || (y ? "#f59e0b" : "var(--eg-color-primary-hover, #059669)"), z = l || (y ? "#0f172a" : "#ffffff"), A = y ? "0 4px 14px rgba(245, 158, 11, 0.38)" : "0 4px 14px rgba(0, 0, 0, 0.25)", R = y ? "0 6px 20px rgba(212, 175, 55, 0.65)" : "0 6px 20px rgba(16, 185, 129, 0.5)";
  if (!x) return null;
  const B = u === "down" ? "Scroll to Bottom" : "Scroll to Top";
  return /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r(
      "button",
      {
        type: "button",
        id: n,
        className: `back-to-top-btn ${d}`,
        onClick: m,
        onMouseEnter: () => C(!0),
        onMouseLeave: () => C(!1),
        title: B,
        "aria-label": B,
        "data-direction": u,
        style: {
          position: "fixed",
          bottom: s,
          right: p,
          width: "46px",
          height: "46px",
          borderRadius: "50%",
          backgroundColor: b ? L : w,
          color: z,
          border: "1px solid rgba(255, 255, 255, 0.25)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: b ? R : A,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: b ? "translateY(-3px) scale(1.06)" : "none",
          opacity: b ? 1 : 0.85,
          padding: 0,
          ...g
        },
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
              display: "block",
              transition: "transform 0.25s ease",
              transform: u === "down" ? "translateY(1px)" : "translateY(-1px)"
            },
            children: u === "down" ? /* @__PURE__ */ r("polyline", { points: "6 9 12 15 18 9" }) : /* @__PURE__ */ r("polyline", { points: "18 15 12 9 6 15" })
          }
        )
      }
    ),
    /* @__PURE__ */ r("style", { children: `
        @media (max-width: 768px) {
          #${n}.back-to-top-btn {
            bottom: 16px !important;
            right: 16px !important;
            width: 42px !important;
            height: 42px !important;
            z-index: 1000 !important;
            opacity: 0.82 !important;
          }
          #${n}.back-to-top-btn svg {
            width: 16px !important;
            height: 16px !important;
          }
        }
      ` })
  ] });
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
), Pr = ({
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
), bl = Pr, zi = ({
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
), Kt = ({
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
), Ri = Kt, Hr = ({
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
), Bi = ({
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
), Fr = ({
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
), vl = Fr, _i = ({
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
    children: /* @__PURE__ */ r("path", { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" })
  }
), $i = ({
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
    children: /* @__PURE__ */ r("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })
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
    children: /* @__PURE__ */ r("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.07 3.25-1.55 3.32-3.36.07-2.61.03-5.23.03-7.85 0-3.33-.02-6.66-.02-9.98z" })
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
    children: /* @__PURE__ */ r("path", { d: "M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.119V2.149h17.194v11.463zm-3.582-7.343v6.269h-2.149V6.269h2.149zm-5.731 0v6.269H9.851V6.269h2.15z" })
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
    children: /* @__PURE__ */ r("path", { d: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.26 18.3 1.5 15.342 1.5 11.696c0-3.834.81-6.834 2.408-8.916C5.584.815 8.48 0 12.186 0c3.785 0 6.697.834 8.653 2.48 1.944 1.635 3.011 4.07 3.172 7.237h-3.46c-.15-2.222-.84-3.874-2.05-4.912-1.34-1.148-3.414-1.745-6.166-1.745-2.825 0-4.98.618-6.406 1.837-1.402 1.2-2.144 3.078-2.144 5.799 0 2.766.713 4.67 2.12 5.658 1.34 1.034 3.42 1.558 6.18 1.558 2.05 0 3.73-.34 5.03-1.01.69-.356 1.25-.844 1.67-1.455.45-.65.74-1.46.86-2.418H12.18V9.897h10.32c.11.83.16 1.7.16 2.6 0 3.48-.96 6.37-2.85 8.58C17.96 23.08 15.36 24 12.186 24z" })
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
    children: /* @__PURE__ */ r("path", { d: "M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.511.914 5.086.322 7.702.25 10.993.25 11.45c0 2.222.067 4.444.2 6.666.19 3.056 1.785 5.777 4.887 6.185 2.58.337 5.088-.04 7.42-1.111l-.16-2.217c-2.02.664-4.22.756-6.28.172-.88-.248-1.75-.724-1.92-1.684a4.42 4.42 0 0 1-.08-.916h.05c1.88.75 3.86 1.13 5.86 1.13h.1c2.81 0 5.46-.35 8.16-1.04 2.87-.73 4.49-3.27 4.67-6.23.23-3.79.16-7.14-.07-9.092zm-4.32 8.625h-2.5v-6.5c0-1.37-.58-2.07-1.73-2.07-1.27 0-1.9.82-1.9 2.45v3.52h-2.5v-3.52c0-1.63-.63-2.45-1.9-2.45-1.15 0-1.73.7-1.73 2.07v6.5H6.07v-6.7c0-1.37.35-2.46 1.05-3.26.72-.8 1.66-1.22 2.83-1.22 1.35 0 2.4.52 3.11 1.57l.63 1.06.63-1.06c.71-1.05 1.76-1.57 3.11-1.57 1.17 0 2.11.42 2.83 1.22.7.8 1.05 1.89 1.05 3.26v6.7z" })
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
    children: /* @__PURE__ */ r("path", { d: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" })
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
    children: /* @__PURE__ */ r("path", { d: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.508 17.308a.747.747 0 0 1-1.026.248c-2.809-1.716-6.345-2.105-10.51-1.153a.75.75 0 1 1-.334-1.463c4.561-1.041 8.486-.604 11.622 1.312a.748.748 0 0 1 .248 1.056zm1.47-3.268a.936.936 0 0 1-1.288.308c-3.216-1.977-8.118-2.548-11.922-1.393a.936.936 0 1 1-.548-1.79c4.347-1.319 9.74-.683 13.45 1.597a.936.936 0 0 1 .308 1.278zm.126-3.41c-3.856-2.29-10.222-2.502-13.916-1.381a1.124 1.124 0 1 1-.652-2.152c4.25-1.29 11.28-1.042 15.728 1.594a1.124 1.124 0 0 1-1.16 1.939z" })
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
    viewBox: "0 0 24 24",
    fill: e,
    className: n,
    style: { display: "inline-block", verticalAlign: "middle", ...i },
    "aria-hidden": "true",
    ...o,
    children: /* @__PURE__ */ r("path", { d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" })
  }
), Ct = ({
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
), Or = ({ name: t, ...e }) => {
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
      return /* @__PURE__ */ r(Pr, { ...e });
    case "youtube":
    case "yt":
      return /* @__PURE__ */ r(zi, { ...e });
    case "lichess":
      return /* @__PURE__ */ r(Ri, { ...e });
    case "chess-knight":
    case "knight":
      return /* @__PURE__ */ r(Kt, { ...e });
    case "chess-pawn":
    case "pawn":
      return /* @__PURE__ */ r(Hr, { ...e });
    case "chesscom":
    case "chess.com":
      return /* @__PURE__ */ r(Bi, { ...e });
    case "github":
    case "gh":
      return /* @__PURE__ */ r(_i, { ...e });
    case "linkedin":
      return /* @__PURE__ */ r(Mi, { ...e });
    case "discord":
      return /* @__PURE__ */ r($i, { ...e });
    case "telegram":
    case "tg":
      return /* @__PURE__ */ r(Di, { ...e });
    case "whatsapp":
    case "wa":
      return /* @__PURE__ */ r(Ei, { ...e });
    case "reddit":
      return /* @__PURE__ */ r(ji, { ...e });
    case "tiktok":
      return /* @__PURE__ */ r(Ni, { ...e });
    case "twitch":
      return /* @__PURE__ */ r(Pi, { ...e });
    case "threads":
      return /* @__PURE__ */ r(Hi, { ...e });
    case "mastodon":
      return /* @__PURE__ */ r(Fi, { ...e });
    case "pinterest":
      return /* @__PURE__ */ r(Oi, { ...e });
    case "spotify":
      return /* @__PURE__ */ r(Vi, { ...e });
    case "paper-plane":
    case "paperplane":
    case "send":
    case "send-message":
      return /* @__PURE__ */ r(Fr, { ...e });
    case "email":
    case "mail":
    case "envelope":
      return /* @__PURE__ */ r(Zt, { ...e });
    case "globe":
    case "web":
    case "website":
      return /* @__PURE__ */ r(Ct, { ...e });
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
}, Ui = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
  /* @__PURE__ */ r("polyline", { points: "12 19 5 12 12 5" })
] }), Gi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "5", y1: "12", x2: "19", y2: "12" }),
  /* @__PURE__ */ r("polyline", { points: "12 5 19 12 12 19" })
] }), qi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "19", x2: "12", y2: "5" }),
  /* @__PURE__ */ r("polyline", { points: "5 12 12 5 19 12" })
] }), Ki = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
  /* @__PURE__ */ r("polyline", { points: "19 12 12 19 5 12" })
] }), Zi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "15 18 9 12 15 6" }) }), Yi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "9 18 15 12 9 6" }) }), Qi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "18 15 12 9 6 15" }) }), Xi = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "6 9 12 15 18 9" }) }), Ji = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polyline", { points: "20 6 9 17 4 12" }) }), Vr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
] }), wl = Vr, eo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "11", cy: "11", r: "8" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
] }), Ur = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
] }), kl = Ur, Gr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21.5 2v6h-6" }),
  /* @__PURE__ */ r("path", { d: "M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" })
] }), Sl = Gr, to = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "1 4 1 10 7 10" }),
  /* @__PURE__ */ r("path", { d: "M3.51 15a9 9 0 1 0 2.13-9.36L1 10" })
] }), ro = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "23 4 23 10 17 10" }),
  /* @__PURE__ */ r("path", { d: "M20.49 15a9 9 0 1 1-2.12-9.36L23 10" })
] }), no = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ r("polyline", { points: "7 10 12 15 17 10" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
] }), io = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
  /* @__PURE__ */ r("polyline", { points: "17 8 12 3 7 8" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
] }), oo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
] }), ao = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
  /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
] }), lo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }), so = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "4", y1: "21", x2: "4", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "4", y1: "10", x2: "4", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "21", x2: "20", y2: "16" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "12", x2: "20", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "14", x2: "7", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "8", x2: "15", y2: "8" }),
  /* @__PURE__ */ r("line", { x1: "17", y1: "16", x2: "23", y2: "16" })
] }), co = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "5 3 19 12 5 21 5 3" }) }), po = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "6", y: "4", width: "4", height: "16", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "14", y: "4", width: "4", height: "16", rx: "1" })
] }), go = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("rect", { x: "5", y: "5", width: "14", height: "14", rx: "2" }) }), ho = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "19 20 9 12 19 4 19 20" }),
  /* @__PURE__ */ r("line", { x1: "5", y1: "19", x2: "5", y2: "5", stroke: e, strokeWidth: "2.5", strokeLinecap: "round" })
] }), uo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "5 4 15 12 5 20 5 4" }),
  /* @__PURE__ */ r("line", { x1: "19", y1: "5", x2: "19", y2: "19", stroke: e, strokeWidth: "2.5", strokeLinecap: "round" })
] }), fo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "11 19 2 12 11 5 11 19" }),
  /* @__PURE__ */ r("polygon", { points: "22 19 13 12 22 5 22 19" })
] }), xo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "13 19 22 12 13 5 13 19" }),
  /* @__PURE__ */ r("polygon", { points: "2 19 11 12 2 5 2 19" })
] }), mo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2.5", strokeLinecap: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" }) }), yo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
  /* @__PURE__ */ r("polyline", { points: "9 21 3 21 3 15" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "3", x2: "14", y2: "10" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "21", x2: "10", y2: "14" })
] }), bo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "4 14 10 14 10 20" }),
  /* @__PURE__ */ r("polyline", { points: "20 10 14 10 14 4" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "10", x2: "21", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "3", y2: "21" })
] }), vo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
  /* @__PURE__ */ r("polyline", { points: "9 22 9 12 15 12 15 22" })
] }), wo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }),
  /* @__PURE__ */ r("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })
] }), ko = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
] }), So = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 9.9-1" })
] }), Co = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
  /* @__PURE__ */ r("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
] }), Ao = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) }), Io = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "3 6 5 6 21 6" }),
  /* @__PURE__ */ r("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
] }), Lo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
  /* @__PURE__ */ r("path", { d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
] }), To = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) }), Wo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, stroke: e, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }), zo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, stroke: e, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }), Ro = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("polyline", { points: "12 6 12 12 16 14" })
] }), Bo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
] }), _o = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12", y2: "12", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12.01", y2: "8", strokeWidth: "3" })
] }), Mo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "9", x2: "12", y2: "13", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
] }), $o = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
  /* @__PURE__ */ r("polyline", { points: "22 4 12 14.01 9 11.01", strokeWidth: "2.5" })
] }), Do = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "9", x2: "9", y2: "15", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "9", x2: "15", y2: "15", strokeWidth: "2.5" })
] }), Eo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12.01", y2: "17", strokeWidth: "3" })
] }), qr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" }),
  /* @__PURE__ */ r("path", { d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" })
] }), Cl = qr, jo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }), No = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
  /* @__PURE__ */ r("polyline", { points: "9 12 11 14 15 10", strokeWidth: "2.5" })
] }), Po = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "6", y: "8", width: "12", height: "12", rx: "6" }),
  /* @__PURE__ */ r("path", { d: "M12 2v6M4 11h4M16 11h4M4 17h4M16 17h4M7 5l2.5 3M17 5l-2.5 3" })
] }), Ho = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
] }), Fo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polyline", { points: "16 18 22 12 16 6" }),
  /* @__PURE__ */ r("polyline", { points: "8 6 2 12 8 18" })
] }), Oo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
  /* @__PURE__ */ r("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
  /* @__PURE__ */ r("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
] }), Vo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "2", width: "20", height: "8", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("rect", { x: "2", y: "14", width: "20", height: "8", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "6", x2: "6.01", y2: "6", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "18", x2: "6.01", y2: "18", strokeWidth: "2.5" })
] }), Uo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" }) }), Kr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
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
] }), Al = Kr, Go = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "10", rx: "2" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "5", r: "2" }),
  /* @__PURE__ */ r("path", { d: "M12 7v4" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "16", x2: "8.01", y2: "16", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "16", y1: "16", x2: "16.01", y2: "16", strokeWidth: "2.5" })
] }), qo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }),
  /* @__PURE__ */ r("path", { d: "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" })
] }), Ko = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2" }),
  /* @__PURE__ */ r("rect", { x: "7", y: "4", width: "4", height: "8", rx: "1" })
] }), Zr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) }), Il = Zr, Yr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }), Ll = Yr, Zo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" }) }), Yo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M2 10v4a2 2 0 0 0 2 2h4l6 4V4L8 8H4a2 2 0 0 0-2 2z" }),
  /* @__PURE__ */ r("path", { d: "M18 8a5 5 0 0 1 0 8M21 5a9 9 0 0 1 0 14" })
] }), Qo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M6 3h12v7a6 6 0 0 1-12 0V3zM9 21h6M12 16v5" }) }), Xo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "14", r: "7" }),
  /* @__PURE__ */ r("polyline", { points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" })
] }), Qr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "6" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "2", fill: e })
] }), Tl = Qr, Jo = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v4h1.5a2.5 2.5 0 0 1 0 5H2v4a2 2 0 0 0 2 2h4v-1.5a2.5 2.5 0 0 1 5 0V21h4a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" }) }), ea = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8z" }) }), Xr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" }) }), Wl = Xr, ta = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6z" }) }), ra = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "7", r: "4" })
] }), na = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
  /* @__PURE__ */ r("circle", { cx: "9", cy: "7", r: "4" }),
  /* @__PURE__ */ r("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
  /* @__PURE__ */ r("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
] }), ia = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "2", y1: "22", x2: "22", y2: "22" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "2", x2: "2", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "2", x2: "22", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "2", y1: "7", x2: "22", y2: "7" }),
  /* @__PURE__ */ r("line", { x1: "5", y1: "10", x2: "5", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "10", x2: "9", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "10", x2: "15", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "19", y1: "10", x2: "19", y2: "18" })
] }), oa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("polygon", { points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76", fill: e })
] }), aa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M11 17l-5-5a2.828 2.828 0 1 1 4-4l1 1 1-1a2.828 2.828 0 1 1 4 4l-5 5z" }),
  /* @__PURE__ */ r("path", { d: "M12 11l4 4 5-5M2 13l4-4" })
] }), la = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" }) }), zl = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "7", width: "20", height: "15", rx: "2", ry: "2" }),
  /* @__PURE__ */ r("polyline", { points: "17 2 12 7 7 2" })
] }), Yt = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M22 10v6M2 10l10-5 10 5-10 5z" }),
  /* @__PURE__ */ r("path", { d: "M6 12v5c3 3 9 3 12 0v-5" })
] }), Rl = Yt, Bl = Yt, Jr = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "6", width: "20", height: "12", rx: "6" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "10", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "10", x2: "8", y2: "14" }),
  /* @__PURE__ */ r("line", { x1: "15", y1: "13", x2: "15.01", y2: "13", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "11", x2: "18.01", y2: "11", strokeWidth: "2.5" })
] }), _l = Jr, en = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M9.5 2A4.5 4.5 0 0 0 5 6.5c0 .3.03.6.09.89A4.5 4.5 0 0 0 3 11a4.5 4.5 0 0 0 2.5 4 4.5 4.5 0 0 0 4 4.5V2zm5 0A4.5 4.5 0 0 1 19 6.5c0 .3-.03.6-.09.89A4.5 4.5 0 0 1 21 11a4.5 4.5 0 0 1-2.5 4 4.5 4.5 0 0 1-4 4.5V2z" }),
  /* @__PURE__ */ r("path", { d: "M9.5 12h5" })
] }), Ml = en, tn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M8 2h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 0-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2z" }),
  /* @__PURE__ */ r("path", { d: "M4 18a2 2 0 0 0 2 2h13" }),
  /* @__PURE__ */ r("path", { d: "M8 7h8M8 11h6" })
] }), $l = tn, Dl = Ct, El = Ct, sa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "3" })
] }), ca = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
  /* @__PURE__ */ r("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
] }), da = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z", fill: e, fillOpacity: "0.2" }),
  /* @__PURE__ */ r("path", { d: "M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z" }),
  /* @__PURE__ */ r("rect", { x: "4", y: "18", width: "16", height: "3", rx: "1", fill: e })
] }), rn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }) }), jl = rn, nn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M3 3v18h18" }),
  /* @__PURE__ */ r("polyline", { points: "19 9 14 14 10 10 7 13" })
] }), Nl = nn, pa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
  /* @__PURE__ */ r("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" })
] }), on = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }),
  /* @__PURE__ */ r("circle", { cx: "12", cy: "10", r: "3" })
] }), Pl = on, Hl = Zt, an = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "8", y1: "6", x2: "21", y2: "6" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "12", x2: "21", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "18", x2: "21", y2: "18" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "3.01", y2: "6", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "3.01", y2: "12", strokeWidth: "2.5" }),
  /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "3.01", y2: "18", strokeWidth: "2.5" })
] }), Fl = an, ga = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "9" }),
  /* @__PURE__ */ r("polyline", { points: "12 7 12 12 15 15" })
] }), ha = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4" }) }), ua = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "9", y: "2", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "2", y: "18", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("rect", { x: "16", y: "18", width: "6", height: "4", rx: "1" }),
  /* @__PURE__ */ r("path", { d: "M12 6v6m0 0H5v6m7-6h7v6" })
] }), ln = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "12", y1: "3", x2: "12", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "4", y1: "7", x2: "20", y2: "7" }),
  /* @__PURE__ */ r("path", { d: "M4 7l-2 7a3 3 0 0 0 6 0L6 7zm14 0l-2 7a3 3 0 0 0 6 0L20 7z" }),
  /* @__PURE__ */ r("line", { x1: "8", y1: "21", x2: "16", y2: "21" })
] }), Ol = ln, sn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "9", cy: "11", r: "1.5", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "15", cy: "11", r: "1.5", fill: e }),
  /* @__PURE__ */ r("path", { d: "M12 2a8 8 0 0 0-8 8c0 3 1.5 5 2.5 6.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2.5c1-1.5 2.5-3.5 2.5-6.5a8 8 0 0 0-8-8z" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "18", x2: "10", y2: "21" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "18", x2: "14", y2: "21" })
] }), Vl = sn, fa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "13", r: "8" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
  /* @__PURE__ */ r("path", { d: "M12 2v3M10 2h4M19 6l-1.5 1.5" })
] }), xa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5" }) }), ma = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "8", x2: "6.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "10", y1: "8", x2: "10.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "14", y1: "8", x2: "14.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "8", x2: "18.01", y2: "8", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "6.01", y2: "12", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "18", y1: "12", x2: "18.01", y2: "12", strokeWidth: "2" }),
  /* @__PURE__ */ r("line", { x1: "9", y1: "16", x2: "15", y2: "16" })
] }), cn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("polygon", { points: "12 2 2 7 12 12 22 7 12 2" }),
  /* @__PURE__ */ r("polyline", { points: "2 12 12 17 22 12" }),
  /* @__PURE__ */ r("polyline", { points: "2 17 12 22 22 17" })
] }), Ul = cn, ya = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "13.5", cy: "6.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "17.5", cy: "10.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "8.5", cy: "7.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("circle", { cx: "6.5", cy: "12.5", r: ".8", fill: e }),
  /* @__PURE__ */ r("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.24-.28-.39-.63-.39-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z" })
] }), ba = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
  /* @__PURE__ */ r("line", { x1: "22", y1: "12", x2: "18", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "6", y1: "12", x2: "2", y2: "12" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "6", x2: "12", y2: "2" }),
  /* @__PURE__ */ r("line", { x1: "12", y1: "22", x2: "12", y2: "18" })
] }), dn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "6", cy: "6", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "18", r: "3" }),
  /* @__PURE__ */ r("line", { x1: "20", y1: "4", x2: "8.12", y2: "15.88" }),
  /* @__PURE__ */ r("line", { x1: "14.47", y1: "14.48", x2: "20", y2: "20" }),
  /* @__PURE__ */ r("line", { x1: "8.12", y1: "8.12", x2: "12", y2: "12" })
] }), Gl = dn, pn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("line", { x1: "6", y1: "3", x2: "6", y2: "15" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "6", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "18", r: "3" }),
  /* @__PURE__ */ r("path", { d: "M18 9a9 9 0 0 1-9 9" })
] }), ql = pn, gn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
  /* @__PURE__ */ r("circle", { cx: "18", cy: "5", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "6", cy: "12", r: "3" }),
  /* @__PURE__ */ r("circle", { cx: "18", cy: "19", r: "3" }),
  /* @__PURE__ */ r("line", { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" }),
  /* @__PURE__ */ r("line", { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" })
] }), Kl = gn, hn = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: e, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" }) }), Zl = hn, va = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 512 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M501.97 187.35l-71.09 177.72c-2.45 6.13-7.51 10.74-13.8 12.59l-42.92 12.63c-3.15.93-6.49.52-9.33-1.15l-108.83-64-108.83 64c-2.84 1.67-6.18 2.08-9.33 1.15l-42.92-12.63c-6.29-1.85-11.35-6.46-13.8-12.59L10.03 187.35C4.25 172.9 14.86 157.5 30.41 157.5c6.51 0 12.82 2.76 17.26 7.56l72.97 78.85 41.56-173.18C165.26 56.44 178.69 48 193.28 48h125.44c14.59 0 28.02 8.44 31.08 22.73l41.56 173.18 72.97-78.85c4.44-4.8 10.75-7.56 17.26-7.56 15.55 0 26.16 15.4 20.38 29.85zM448 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h384c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), wa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 448 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M384 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm48-272h-40.42c-1.35-25.13-13.43-47.53-31.95-63.02L382.72 48H320V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32h-64V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32H65.28l23.09 48.98C69.85 112.47 57.77 134.87 56.42 160H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h34.61c16.29 88.58 87.27 160 173.39 160s157.1-71.42 173.39-160H432c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), ka = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 384 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M384 128V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32h-64V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32H96V48c0-8.84-7.16-16-16-16H32c-8.84 0-16 7.16-16 16v80c0 14.59 9.87 27.08 24 30.65v146.7c-14.13 3.57-24 16.06-24 30.65 0 17.67 14.33 32 32 32h288c17.67 0 32-14.33 32-32 0-14.59-9.87-27.08-24-30.65V158.65c14.13-3.57 24-16.06 24-30.65zM352 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), Sa = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ r("svg", { width: t, height: t, viewBox: "0 0 320 512", fill: e, className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: /* @__PURE__ */ r("path", { d: "M160 0c-44.18 0-80 35.82-80 80 0 16.27 4.95 31.33 13.31 44.07C64.95 145.45 48 181.76 48 224c0 38.64 14.19 72.44 37.66 96H48c-26.51 0-48 21.49-48 48v16h320v-16c0-26.51-21.49-48-48-48h-37.66C257.81 296.44 272 262.64 272 224c0-42.24-16.95-78.55-45.31-99.93C235.05 111.33 240 96.27 240 80c0-44.18-35.82-80-80-80zm128 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h256c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" }) }), Ca = ({ size: t = 18, color: e = "currentColor", className: n = "", style: i, ...o }) => /* @__PURE__ */ c("svg", { width: t, height: t, viewBox: "0 0 24 24", className: n, style: { display: "inline-block", verticalAlign: "middle", ...i }, "aria-hidden": "true", ...o, children: [
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
      return /* @__PURE__ */ r(Ui, { ...e });
    case "arrow-right":
    case "long-arrow-right":
    case "arrowright":
      return /* @__PURE__ */ r(Gi, { ...e });
    case "arrow-up":
    case "arrowup":
      return /* @__PURE__ */ r(qi, { ...e });
    case "arrow-down":
    case "arrowdown":
      return /* @__PURE__ */ r(Ki, { ...e });
    case "chevron-left":
    case "angle-left":
      return /* @__PURE__ */ r(Zi, { ...e });
    case "chevron-right":
    case "angle-right":
      return /* @__PURE__ */ r(Yi, { ...e });
    case "chevron-up":
    case "angle-up":
      return /* @__PURE__ */ r(Qi, { ...e });
    case "chevron-down":
    case "angle-down":
      return /* @__PURE__ */ r(Xi, { ...e });
    case "check":
      return /* @__PURE__ */ r(Ji, { ...e });
    case "close":
    case "times":
      return /* @__PURE__ */ r(Vr, { ...e });
    case "search":
      return /* @__PURE__ */ r(eo, { ...e });
    case "menu":
    case "bars":
      return /* @__PURE__ */ r(Ur, { ...e });
    case "refresh":
    case "sync":
    case "sync-alt":
    case "redo-alt":
      return /* @__PURE__ */ r(Gr, { ...e });
    case "undo":
      return /* @__PURE__ */ r(to, { ...e });
    case "redo":
      return /* @__PURE__ */ r(ro, { ...e });
    case "download":
      return /* @__PURE__ */ r(no, { ...e });
    case "upload":
      return /* @__PURE__ */ r(io, { ...e });
    case "copy":
      return /* @__PURE__ */ r(oo, { ...e });
    case "external-link":
    case "external-link-alt":
      return /* @__PURE__ */ r(ao, { ...e });
    case "filter":
      return /* @__PURE__ */ r(lo, { ...e });
    case "sliders":
    case "sliders-h":
      return /* @__PURE__ */ r(so, { ...e });
    case "play":
      return /* @__PURE__ */ r(co, { ...e });
    case "pause":
      return /* @__PURE__ */ r(po, { ...e });
    case "stop":
      return /* @__PURE__ */ r(go, { ...e });
    case "step-backward":
      return /* @__PURE__ */ r(ho, { ...e });
    case "step-forward":
      return /* @__PURE__ */ r(uo, { ...e });
    case "fast-backward":
      return /* @__PURE__ */ r(fo, { ...e });
    case "fast-forward":
      return /* @__PURE__ */ r(xo, { ...e });
    case "spinner":
      return /* @__PURE__ */ r(mo, { ...e });
    case "expand":
      return /* @__PURE__ */ r(yo, { ...e });
    case "compress":
      return /* @__PURE__ */ r(bo, { ...e });
    case "home":
      return /* @__PURE__ */ r(vo, { ...e });
    case "bell":
      return /* @__PURE__ */ r(wo, { ...e });
    case "lock":
      return /* @__PURE__ */ r(ko, { ...e });
    case "unlock":
    case "unlock-alt":
      return /* @__PURE__ */ r(So, { ...e });
    case "sun":
      return /* @__PURE__ */ r(Co, { ...e });
    case "moon":
      return /* @__PURE__ */ r(Ao, { ...e });
    case "trash":
      return /* @__PURE__ */ r(Io, { ...e });
    case "edit":
      return /* @__PURE__ */ r(Lo, { ...e });
    case "bookmark":
      return /* @__PURE__ */ r(To, { ...e });
    case "star":
      return /* @__PURE__ */ r(Wo, { ...e });
    case "heart":
      return /* @__PURE__ */ r(zo, { ...e });
    case "clock":
      return /* @__PURE__ */ r(Ro, { ...e });
    case "calendar":
    case "calendar-alt":
    case "calendar-day":
    case "calendar-check":
      return /* @__PURE__ */ r(Bo, { ...e });
    case "info":
    case "info-circle":
      return /* @__PURE__ */ r(_o, { ...e });
    case "warning":
    case "exclamation-triangle":
      return /* @__PURE__ */ r(Mo, { ...e });
    case "check-circle":
      return /* @__PURE__ */ r($o, { ...e });
    case "times-circle":
      return /* @__PURE__ */ r(Do, { ...e });
    case "question":
    case "question-circle":
      return /* @__PURE__ */ r(Eo, { ...e });
    case "cog":
    case "cogs":
    case "settings":
      return /* @__PURE__ */ r(qr, { ...e });
    case "shield":
    case "shield-alt":
    case "user-shield":
      return /* @__PURE__ */ r(jo, { ...e });
    case "shield-check":
      return /* @__PURE__ */ r(No, { ...e });
    case "bug":
    case "virus":
      return /* @__PURE__ */ r(Po, { ...e });
    case "desktop":
    case "tv":
      return /* @__PURE__ */ r(Ho, { ...e });
    case "code":
    case "laptop-code":
    case "terminal":
      return /* @__PURE__ */ r(Fo, { ...e });
    case "database":
      return /* @__PURE__ */ r(Oo, { ...e });
    case "server":
      return /* @__PURE__ */ r(Vo, { ...e });
    case "cloud":
      return /* @__PURE__ */ r(Uo, { ...e });
    case "cpu":
    case "microchip":
      return /* @__PURE__ */ r(Kr, { ...e });
    case "robot":
      return /* @__PURE__ */ r(Go, { ...e });
    case "rocket":
      return /* @__PURE__ */ r(qo, { ...e });
    case "microscope":
    case "vial":
      return /* @__PURE__ */ r(Ko, { ...e });
    case "wrench":
    case "tools":
      return /* @__PURE__ */ r(Zr, { ...e });
    case "bolt":
    case "zap":
    case "lightning":
      return /* @__PURE__ */ r(Yr, { ...e });
    case "sparkles":
    case "magic":
      return /* @__PURE__ */ r(Zo, { ...e });
    case "bullhorn":
      return /* @__PURE__ */ r(Yo, { ...e });
    case "trophy":
      return /* @__PURE__ */ r(Qo, { ...e });
    case "medal":
      return /* @__PURE__ */ r(Xo, { ...e });
    case "target":
    case "bullseye":
      return /* @__PURE__ */ r(Qr, { ...e });
    case "puzzle":
    case "puzzle-piece":
      return /* @__PURE__ */ r(Jo, { ...e });
    case "quote":
    case "quote-left":
    case "quote-right":
      return /* @__PURE__ */ r(ea, { ...e });
    case "book":
    case "book-open":
      return /* @__PURE__ */ r(Xr, { ...e });
    case "newspaper":
    case "blog":
      return /* @__PURE__ */ r(ta, { ...e });
    case "user":
      return /* @__PURE__ */ r(ra, { ...e });
    case "users":
    case "user-friends":
      return /* @__PURE__ */ r(na, { ...e });
    case "landmark":
      return /* @__PURE__ */ r(ia, { ...e });
    case "compass":
      return /* @__PURE__ */ r(oa, { ...e });
    case "handshake":
    case "hands-helping":
      return /* @__PURE__ */ r(aa, { ...e });
    case "flag":
    case "flag-checkered":
      return /* @__PURE__ */ r(la, { ...e });
    case "graduation-cap":
    case "academic-cap":
    case "learn":
    case "chalkboard-teacher":
      return /* @__PURE__ */ r(Yt, { ...e });
    case "gamepad":
    case "controller":
      return /* @__PURE__ */ r(Jr, { ...e });
    case "brain":
    case "train":
      return /* @__PURE__ */ r(en, { ...e });
    case "scroll":
    case "parchment":
      return /* @__PURE__ */ r(tn, { ...e });
    case "globe":
    case "globe-asia":
    case "world":
    case "online":
      return /* @__PURE__ */ r(Ct, { ...e });
    case "eye":
    case "watch":
    case "view":
      return /* @__PURE__ */ r(sa, { ...e });
    case "eye-slash":
      return /* @__PURE__ */ r(ca, { ...e });
    case "crown":
      return /* @__PURE__ */ r(da, { ...e });
    case "fire":
    case "flame":
    case "hot":
      return /* @__PURE__ */ r(rn, { ...e });
    case "chart-line":
    case "graph":
    case "analytics":
      return /* @__PURE__ */ r(nn, { ...e });
    case "clipboard":
    case "clipboard-check":
      return /* @__PURE__ */ r(pa, { ...e });
    case "map-marker":
    case "map-marker-alt":
    case "pin":
      return /* @__PURE__ */ r(on, { ...e });
    case "envelope":
    case "mail":
    case "email":
      return /* @__PURE__ */ r(Zt, { ...e });
    case "list":
    case "list-alt":
    case "list-ol":
    case "list-ul":
      return /* @__PURE__ */ r(an, { ...e });
    case "history":
      return /* @__PURE__ */ r(ga, { ...e });
    case "signal":
    case "wifi":
      return /* @__PURE__ */ r(ha, { ...e });
    case "network-wired":
      return /* @__PURE__ */ r(ua, { ...e });
    case "balance-scale":
    case "scale":
    case "justice":
      return /* @__PURE__ */ r(ln, { ...e });
    case "skull":
    case "skull-crossbones":
      return /* @__PURE__ */ r(sn, { ...e });
    case "stopwatch":
      return /* @__PURE__ */ r(fa, { ...e });
    case "lightbulb":
      return /* @__PURE__ */ r(xa, { ...e });
    case "keyboard":
      return /* @__PURE__ */ r(ma, { ...e });
    case "layer-group":
    case "layers":
      return /* @__PURE__ */ r(cn, { ...e });
    case "palette":
      return /* @__PURE__ */ r(ya, { ...e });
    case "crosshairs":
      return /* @__PURE__ */ r(ba, { ...e });
    case "cut":
    case "scissors":
      return /* @__PURE__ */ r(dn, { ...e });
    case "code-branch":
    case "fork":
      return /* @__PURE__ */ r(pn, { ...e });
    case "share":
    case "share-alt":
      return /* @__PURE__ */ r(gn, { ...e });
    case "door-open":
    case "sign-out-alt":
    case "logout":
      return /* @__PURE__ */ r(hn, { ...e });
    case "chess":
    case "chess-board":
      return /* @__PURE__ */ r(Ca, { ...e });
    case "chess-queen":
    case "queen":
      return /* @__PURE__ */ r(va, { ...e });
    case "chess-king":
    case "king":
      return /* @__PURE__ */ r(wa, { ...e });
    case "chess-knight":
    case "knight":
      return /* @__PURE__ */ r(Kt, { ...e });
    case "chess-pawn":
    case "pawn":
      return /* @__PURE__ */ r(Hr, { ...e });
    case "chess-rook":
    case "rook":
      return /* @__PURE__ */ r(ka, { ...e });
    case "chess-bishop":
    case "bishop":
      return /* @__PURE__ */ r(Sa, { ...e });
    default:
      return /* @__PURE__ */ r(Or, { name: n, ...e });
  }
}, Ql = ({
  preset: t = "generic",
  brandLogo: e,
  logoComponent: n,
  logoSize: i,
  logoTheme: o,
  brandTitle: a,
  brandSubtitle: l,
  brandUrl: s = "index.html",
  navLinks: p,
  githubUrl: d,
  currentPath: g = "index.html",
  showForkRibbon: u = !1,
  forkRibbonUrl: h,
  forkRibbonText: x = "FORK ME",
  forkRibbonPosition: f = "right",
  showNotificationBell: b = !0,
  notificationFetchUrl: C,
  notificationStorageKey: v = "notifications_seen_updates",
  showThemeToggle: m = !0,
  showCacheBuster: y = !0,
  quickAction: w,
  customControls: L,
  containerMaxWidth: z = "var(--eg-container-max, min(1536px, 94%))",
  containerPadding: A = "0 clamp(16px, 2.5vw, 32px)",
  onNavigate: R,
  className: B = "",
  style: j = {}
}) => {
  const [I, E] = W(!1), [H, $] = W(null), U = me(null);
  Y(() => {
    const k = (D) => {
      U.current && !U.current.contains(D.target) && $(null);
    };
    return document.addEventListener("mousedown", k), () => document.removeEventListener("mousedown", k);
  }, []);
  const _ = [
    { label: "HOME", href: "index.html" }
  ], T = p && p.length > 0 ? p : _, S = (k, D, O) => {
    if (!(O || D.startsWith("http://") || D.startsWith("https://"))) {
      if (D === "#" || D === "javascript:void(0);") {
        k.preventDefault();
        return;
      }
      R && (k.preventDefault(), R(D), E(!1), $(null));
    }
  }, N = (k) => {
    if (k.active) return !0;
    const D = g.replace(/^\/+/, "").split("?")[0].split("#")[0].toLowerCase().replace(/\.html$/, "") || "index", O = k.href.replace(/^\/+/, "").split("?")[0].split("#")[0].toLowerCase().replace(/\.html$/, "");
    return D === O || (O === "index" || O === "") && (D === "" || D === "index") ? !0 : k.children ? k.children.some((M) => N(M)) : !1;
  };
  return /* @__PURE__ */ c(
    "header",
    {
      className: `eg-header ${B}`,
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
        ...j
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
            children: /* @__PURE__ */ c(
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
                onMouseEnter: (k) => {
                  k.currentTarget.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)", k.currentTarget.style.color = "#ffffff", k.currentTarget.style.boxShadow = "0 6px 18px rgba(16, 185, 129, 0.5)";
                },
                onMouseLeave: (k) => {
                  k.currentTarget.style.background = "linear-gradient(135deg, #24292e 0%, #161b22 100%)", k.currentTarget.style.color = "#ffffff", k.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.45)";
                },
                children: [
                  /* @__PURE__ */ r("svg", { width: "14", height: "14", viewBox: "0 0 16 16", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ r("path", { d: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" }) }),
                  x !== "" && /* @__PURE__ */ r("span", { children: x || "FORK ME" })
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
              maxWidth: z,
              margin: "0 auto",
              padding: A
            },
            children: /* @__PURE__ */ c(
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
                          onClick: (k) => S(k, s),
                          style: { textDecoration: "none", display: "flex", alignItems: "center" },
                          title: a || "Home",
                          children: e || n ? e || n : a ? /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column" }, children: [
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
                          ] }) : /* @__PURE__ */ r(Nr, { size: i || 56, theme: o || "auto", mainText: "APP" })
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ r(
                    "nav",
                    {
                      ref: U,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                      },
                      className: "eg-desktop-nav",
                      children: T.map((k) => {
                        const D = N(k), O = k.children && k.children.length > 0, M = H === k.label;
                        return O ? /* @__PURE__ */ c("div", { style: { position: "relative" }, children: [
                          /* @__PURE__ */ c(
                            "button",
                            {
                              type: "button",
                              onClick: () => $(M ? null : k.label),
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
                                k.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: k.icon }),
                                /* @__PURE__ */ r("span", { children: k.label }),
                                /* @__PURE__ */ r("span", { style: { fontSize: "10px", transform: M ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }, children: "▼" })
                              ]
                            }
                          ),
                          M && /* @__PURE__ */ r(
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
                              children: k.children.map((P) => {
                                const V = N(P);
                                return /* @__PURE__ */ c(
                                  "a",
                                  {
                                    href: ne(P.href),
                                    target: P.external ? "_blank" : void 0,
                                    rel: P.external ? "noopener noreferrer" : void 0,
                                    onClick: (G) => S(G, P.href, P.external),
                                    style: {
                                      padding: "8px 12px",
                                      borderRadius: "6px",
                                      textDecoration: "none",
                                      fontSize: "13px",
                                      fontWeight: V ? 700 : 500,
                                      color: V ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #0f172a)",
                                      background: V ? "rgba(16, 185, 129, 0.12)" : "transparent",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: "8px",
                                      transition: "all 0.15s ease"
                                    },
                                    onMouseEnter: (G) => {
                                      V || (G.currentTarget.style.background = "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))");
                                    },
                                    onMouseLeave: (G) => {
                                      V || (G.currentTarget.style.background = "transparent");
                                    },
                                    children: [
                                      /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                                        P.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: P.icon }),
                                        /* @__PURE__ */ r("span", { children: P.label })
                                      ] }),
                                      P.external && /* @__PURE__ */ r("span", { style: { fontSize: "11px", opacity: 0.7 }, children: "↗" })
                                    ]
                                  },
                                  P.label
                                );
                              })
                            }
                          )
                        ] }, k.label) : /* @__PURE__ */ c(
                          "a",
                          {
                            href: ne(k.href),
                            target: k.external ? "_blank" : void 0,
                            rel: k.external ? "noopener noreferrer" : void 0,
                            onClick: (P) => S(P, k.href, k.external),
                            style: k.highlight ? {
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
                              k.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: k.icon }),
                              /* @__PURE__ */ r("span", { children: k.label })
                            ]
                          },
                          k.href
                        );
                      })
                    }
                  ),
                  /* @__PURE__ */ c(
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
                        b && /* @__PURE__ */ r(
                          Bn,
                          {
                            onNavigate: R,
                            fetchUrl: C,
                            storageKey: v
                          }
                        ),
                        w,
                        d && /* @__PURE__ */ r(
                          "a",
                          {
                            href: d,
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
                        m && /* @__PURE__ */ r(Ir, {}),
                        y && /* @__PURE__ */ r("span", { className: "eg-header-control-desktop-only", children: /* @__PURE__ */ r(or, {}) }),
                        L,
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => E(!I),
                            className: "eg-mobile-toggle",
                            "aria-label": "Toggle navigation menu",
                            "aria-expanded": I,
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
                            children: /* @__PURE__ */ r("span", { style: { fontSize: "18px" }, children: I ? "✕" : "☰" })
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
        I && /* @__PURE__ */ c(
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
              T.map((k) => {
                const D = N(k);
                return k.children && k.children.length > 0 ? /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                  /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "var(--eg-text-muted, #94a3b8)", padding: "6px 0" }, children: [
                    k.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: k.icon }),
                    /* @__PURE__ */ r("span", { children: k.label })
                  ] }),
                  k.children.map((M) => /* @__PURE__ */ c(
                    "a",
                    {
                      href: ne(M.href),
                      onClick: (P) => S(P, M.href, M.external),
                      style: {
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        color: N(M) ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #0f172a)",
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      },
                      children: [
                        M.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: M.icon }),
                        /* @__PURE__ */ r("span", { children: M.label })
                      ]
                    },
                    M.label
                  ))
                ] }, k.label) : /* @__PURE__ */ c(
                  "a",
                  {
                    href: ne(k.href),
                    onClick: (M) => S(M, k.href, k.external),
                    style: k.highlight ? {
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
                      k.icon && /* @__PURE__ */ r("span", { style: { display: "inline-flex", alignItems: "center" }, children: k.icon }),
                      /* @__PURE__ */ r("span", { children: k.label })
                    ]
                  },
                  k.href
                );
              }),
              /* @__PURE__ */ c(
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
                    y && /* @__PURE__ */ r(or, {}),
                    d && /* @__PURE__ */ c(
                      "a",
                      {
                        href: ne(d),
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
  socialLinks: d,
  socialAlignment: g = "left",
  contactAlignment: u = "left",
  followLabel: h = "Follow",
  contactLabel: x = "Contact",
  contactButtonText: f = "Send Message",
  contactUrl: b = "contact",
  sections: C,
  copyrightText: v,
  privacyPolicyUrl: m = "privacypolicy",
  developedByText: y,
  developedByUrl: w,
  developedByPrefix: L,
  showBackToTop: z = !1,
  containerMaxWidth: A = "var(--eg-container-max, min(1536px, 94%))",
  containerPadding: R = "0 clamp(16px, 2.5vw, 32px)",
  onNavigate: B,
  className: j = "",
  style: I = {}
}) => {
  const [E, H] = W(s || "");
  Y(() => {
    if (s) return;
    let T = !0;
    return we.getPageContent("about").then((S) => {
      if (!T || !S) return;
      const N = (D) => {
        if (!D) return "";
        try {
          if (typeof document < "u") {
            const O = document.createElement("div");
            return O.innerHTML = D, O.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((P) => P.remove()), (O.textContent || O.innerText || "").replace(/\s+/g, " ").replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, "").trim();
          }
        } catch {
        }
        return D.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "").replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, "").trim();
      };
      let k = N(S.title || "");
      if (!k && S.content && (k = N(S.content)), k) {
        let D = k;
        if (k.length > 135) {
          const O = k.slice(0, 135), M = O.lastIndexOf(" ");
          D = (M > 0 ? O.slice(0, M) : O).trim() + "...";
        }
        H(D);
      }
    }), () => {
      T = !1;
    };
  }, [s, t]);
  const $ = (T, S, N) => {
    N || S.startsWith("http://") || S.startsWith("https://") || B && (T.preventDefault(), B(S));
  }, U = C || [], _ = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ c(
    "footer",
    {
      className: `eg-footer ${j}`,
      style: {
        background: "var(--eg-bg-footer, #1e2229)",
        color: "var(--eg-text-footer, #cbd5e1)",
        borderTop: "1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.08))",
        padding: "52px 20px 24px",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        ...I
      },
      children: [
        /* @__PURE__ */ c(
          "div",
          {
            style: {
              maxWidth: A,
              margin: "0 auto",
              padding: R
            },
            children: [
              /* @__PURE__ */ c(
                "div",
                {
                  className: "eg-footer-grid",
                  style: {
                    gap: "40px",
                    marginBottom: "40px"
                  },
                  children: [
                    /* @__PURE__ */ c("div", { className: "eg-footer-col eg-footer-col-about", children: [
                      /* @__PURE__ */ r("div", { style: { marginBottom: "14px" }, children: e || n ? e || n : a ? /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column" }, children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "20px", fontWeight: 800, color: "var(--eg-text-footer-title, #ffffff)" }, children: a }),
                        l && /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "var(--eg-text-footer-muted, #94a3b8)" }, children: l })
                      ] }) : /* @__PURE__ */ r(Nr, { size: i, theme: o || "dark", mainText: "APP" }) }),
                      /* @__PURE__ */ c(
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
                            p && /* @__PURE__ */ c(se, { children: [
                              " ",
                              /* @__PURE__ */ r(
                                "a",
                                {
                                  href: p,
                                  onClick: (T) => $(T, p),
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
                    d && !C ? /* @__PURE__ */ c(se, { children: [
                      /* @__PURE__ */ c(
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
                                children: (d || []).map((T) => /* @__PURE__ */ r(
                                  "a",
                                  {
                                    href: ne(T.url),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    title: T.name,
                                    "aria-label": T.name,
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
                                    children: T.icon || /* @__PURE__ */ r(Or, { name: T.name, size: 18 })
                                  },
                                  T.name
                                ))
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ c(
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
                                children: x
                              }
                            ),
                            /* @__PURE__ */ c(
                              "a",
                              {
                                href: b,
                                onClick: (T) => $(T, b),
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
                                onMouseEnter: (T) => {
                                  T.currentTarget.style.background = "#10b981", T.currentTarget.style.color = "#064e3b";
                                },
                                onMouseLeave: (T) => {
                                  T.currentTarget.style.background = "rgba(16, 185, 129, 0.15)", T.currentTarget.style.color = "#10b981";
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
                    ] }) : U.map((T) => /* @__PURE__ */ c("div", { className: "eg-footer-col", children: [
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
                          children: T.title
                        }
                      ),
                      T.customContent ? T.customContent : T.links ? /* @__PURE__ */ r("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }, children: T.links.map((S) => /* @__PURE__ */ r("li", { children: /* @__PURE__ */ c(
                        "a",
                        {
                          href: ne(S.href),
                          target: S.external ? "_blank" : void 0,
                          rel: S.external ? "noopener noreferrer" : void 0,
                          onClick: (N) => $(N, S.href, S.external),
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
                    ] }, T.title))
                  ]
                }
              ),
              /* @__PURE__ */ c(
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
                    /* @__PURE__ */ r("div", { children: v || `© ${_} ${a || "Application"}. All rights reserved.` }),
                    /* @__PURE__ */ c("div", { style: { display: "flex", gap: "14px", alignItems: "center" }, children: [
                      /* @__PURE__ */ r(
                        "a",
                        {
                          href: m,
                          onClick: (T) => $(T, m),
                          style: { color: "inherit", textDecoration: "none" },
                          children: "Privacy Policy"
                        }
                      ),
                      y && /* @__PURE__ */ c(se, { children: [
                        /* @__PURE__ */ r("span", { children: "•" }),
                        /* @__PURE__ */ c("span", { children: [
                          L ? `${L} ` : "Developed By: ",
                          /* @__PURE__ */ r(
                            "a",
                            {
                              href: w,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              style: { color: "var(--eg-color-primary, #10b981)", textDecoration: "none" },
                              children: y
                            }
                          )
                        ] })
                      ] })
                    ] }),
                    z && /* @__PURE__ */ r(Li, { variant: t === "mchess" ? "accent" : "primary" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ r("style", { children: `
        .eg-footer-grid {
          display: grid;
          grid-template-columns: ${d && !C ? "minmax(280px, 1.3fr) 1fr 1fr" : "repeat(auto-fit, minmax(220px, 1fr))"};
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
}, Jl = ({
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
  ], [s, p] = W(0);
  Y(() => {
    if (!n || l.length <= 1) return;
    const u = setInterval(() => {
      p((h) => (h + 1) % l.length);
    }, e);
    return () => clearInterval(u);
  }, [n, l.length, e]);
  const d = l[s], g = `crystal-theme-${d.crystalThemeIndex || s % 6 + 1}`;
  return /* @__PURE__ */ c(
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
        /* @__PURE__ */ c("div", { style: { maxWidth: "780px", zIndex: 2, animation: "egSliderFade 0.6s ease" }, children: [
          d.badge && /* @__PURE__ */ r(
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
              children: d.badge
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
              children: d.title
            }
          ),
          d.subtitle && /* @__PURE__ */ r(
            "p",
            {
              style: {
                fontSize: "var(--eg-text-lg, 1.15rem)",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.9)",
                margin: "0 auto 28px",
                maxWidth: "620px"
              },
              children: d.subtitle
            }
          ),
          d.buttonLabel && /* @__PURE__ */ c(
            "a",
            {
              href: ne(d.buttonHref),
              onClick: (u) => {
                o && (u.preventDefault(), o(d));
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
                d.buttonLabel,
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
}) => {
  const l = i ? "100%" : n ? "var(--eg-container-wide, min(1680px, 96%))" : e ? "var(--eg-container-narrow, 880px)" : "var(--eg-container-max, min(1536px, 94%))";
  return /* @__PURE__ */ r(
    "div",
    {
      className: `eg-container ${o}`,
      style: {
        maxWidth: l,
        margin: "0 auto",
        padding: "0 clamp(16px, 2.5vw, 32px)",
        boxSizing: "border-box",
        ...a
      },
      children: t
    }
  );
}, ts = ({
  children: t,
  id: e,
  className: n = "",
  style: i,
  padded: o = !0
}) => /* @__PURE__ */ r(
  "section",
  {
    id: e,
    className: `eg-section ${n}`,
    style: {
      padding: o ? "40px 0" : "0",
      ...i
    },
    children: t
  }
), rs = ({
  title: t,
  subtitle: e,
  badge: n,
  className: i = "",
  style: o
}) => /* @__PURE__ */ c(
  "div",
  {
    className: `eg-page-header ${i}`,
    style: {
      margin: "28px 0 36px",
      textAlign: "center",
      ...o
    },
    children: [
      n && /* @__PURE__ */ r(
        "span",
        {
          style: {
            display: "inline-block",
            padding: "3px 12px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            background: "rgba(16, 185, 129, 0.12)",
            color: "var(--eg-color-primary, #10b981)",
            marginBottom: "10px"
          },
          children: n
        }
      ),
      /* @__PURE__ */ r(
        "h1",
        {
          style: {
            fontSize: "var(--eg-text-3xl, 2rem)",
            fontWeight: 800,
            color: "var(--eg-text-primary, #0f172a)",
            margin: "0 0 10px",
            letterSpacing: "-0.5px"
          },
          children: t
        }
      ),
      e && /* @__PURE__ */ r(
        "p",
        {
          style: {
            fontSize: "var(--eg-text-base, 1rem)",
            color: "var(--eg-text-secondary, #64748b)",
            maxWidth: "760px",
            margin: "0 auto",
            lineHeight: 1.6
          },
          children: e
        }
      )
    ]
  }
), ar = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>", Aa = ({ product: t, onSelect: e }) => {
  const [n, i] = W(!1), o = we.resolveProductVersion(t), a = (u) => {
    if (!u || typeof u != "string" || !u.trim()) return ar;
    let h = u.trim();
    return h.startsWith("./img/") ? h = "./assets/" + h.slice(2) : h.startsWith("img/") && (h = "assets/" + h), h;
  }, l = (u, h) => {
    if (!u) return null;
    let x = h, f = "#", b = "";
    if (typeof u == "string")
      f = u;
    else if (typeof u == "object" && u !== null) {
      const v = u;
      if (v.label && v.url)
        x = String(v.label), f = String(v.url);
      else {
        const m = ["sametab", "target", "icon", "class", "btnclass", "rel"];
        for (const [y, w] of Object.entries(v))
          if (!m.includes(y.toLowerCase()) && typeof w == "string") {
            x = y, f = w;
            break;
          }
      }
      v.icon && typeof v.icon == "string" && (b = v.icon);
    }
    if (!f || f === "#") return null;
    const C = f.startsWith("http://") || f.startsWith("https://");
    return {
      label: x,
      url: ne(f),
      isExternal: C,
      icon: b
    };
  }, s = l(
    t.button1,
    t.product_type === "WebApp" ? "Launch" : "View Details"
  ) || (t.webapp_link ? { label: "Launch", url: ne(t.webapp_link), isExternal: !0 } : null), p = l(
    t.button2,
    t.attach_upload_file_1 ? "Download" : "Source Code"
  ), d = s && (s.label.toUpperCase().includes("DETAIL") || s.url.includes("title=") || s.url.includes("id=") || !s.isExternal);
  return /* @__PURE__ */ c(
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
        /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ c(
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
                      u.currentTarget.onerror = null, u.currentTarget.src = ar;
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
                /* @__PURE__ */ c("div", { style: { flex: "1 1 auto", minWidth: 0 }, children: [
                  /* @__PURE__ */ c(
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
                        /* @__PURE__ */ c("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap", flexShrink: 0 }, children: [
                          t.category && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.category }),
                          /* @__PURE__ */ c(ye, { variant: "primary", size: "sm", children: [
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
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px", flexWrap: "wrap", flex: "1 1 auto" }, children: [
                s && (d && e ? /* @__PURE__ */ r(
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
                  children: /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
          Gt,
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
}, ns = ({ products: t, onSelect: e }) => /* @__PURE__ */ r(
  "div",
  {
    className: "eg-product-grid",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
      gap: "24px",
      width: "100%",
      boxSizing: "border-box"
    },
    children: t.map((n) => /* @__PURE__ */ r(Aa, { product: n, onSelect: e }, n.id))
  }
), lr = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%231e293b'/><text x='50%' y='63%' font-family='sans-serif' font-weight='bold' font-size='38' fill='%2338bdf8' text-anchor='middle'>APP</text></svg>", is = ({
  product: t,
  onBack: e,
  backLabel: n = "← Back to all applications",
  customActions: i,
  className: o = "",
  style: a
}) => {
  const [l, s] = W(!1), p = we.resolveProductVersion(t), d = (f) => {
    if (!f || typeof f != "string" || !f.trim()) return lr;
    let b = f.trim();
    return b.startsWith("./img/") ? b = "./assets/" + b.slice(2) : b.startsWith("img/") && (b = "assets/" + b), b;
  }, u = (() => {
    const f = [], b = (m, y) => {
      if (!m) return null;
      let w = y, L = "#", z = "";
      if (typeof m == "string")
        L = m;
      else if (typeof m == "object" && m !== null) {
        const B = m;
        if (B.label && B.url)
          w = String(B.label), L = String(B.url);
        else {
          const j = ["sametab", "target", "icon", "class", "btnclass", "rel"];
          for (const [I, E] of Object.entries(B))
            if (!j.includes(I.toLowerCase()) && typeof E == "string") {
              w = I, L = E;
              break;
            }
        }
        B.icon && typeof B.icon == "string" && (z = B.icon);
      }
      if (!L || L === "#") return null;
      const A = w.toUpperCase().trim();
      if (A === "VIEW DETAILS" || A === "DETAILS" || A === "VIEW APP" || L.includes(`title=${t.slug}`) || L.includes(`id=${t.id}`))
        return null;
      const R = L.startsWith("http://") || L.startsWith("https://");
      return {
        label: w,
        url: ne(L),
        isExternal: R,
        icon: z
      };
    }, C = b(
      t.button1,
      t.product_type === "WebApp" ? "Launch WebApp" : "Open Website"
    );
    C && f.push(C);
    const v = b(t.button2, "Download");
    return v && f.push(v), f.length === 0 && t.webapp_link && f.push({
      label: "Launch Application",
      url: ne(t.webapp_link),
      isExternal: !0
    }), f;
  })(), h = t.full_description || t.description || t.short_description || "No detailed description available.", x = Ae(
    h.includes("<") ? h : `<p>${h.replace(/\n\n+/g, "</p><p>")}</p>`
  );
  return /* @__PURE__ */ c(
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
        /* @__PURE__ */ c(
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
                  src: d(t.icon || t.imageUrl || t.image),
                  alt: t.title || t.name || "Application Icon",
                  onError: (f) => {
                    f.currentTarget.onerror = null, f.currentTarget.src = lr;
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
              /* @__PURE__ */ c("div", { style: { flex: "1 1 300px", minWidth: 0 }, children: [
                /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }, children: [
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
                  /* @__PURE__ */ c("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: [
                    t.category && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.category }),
                    t.product_type && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: t.product_type }),
                    /* @__PURE__ */ c(ye, { variant: "primary", size: "sm", children: [
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
                /* @__PURE__ */ c("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }, children: [
                  u.map((f, b) => /* @__PURE__ */ c(
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
                        backgroundColor: b === 0 ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-subtle, rgba(0, 0, 0, 0.05))",
                        color: b === 0 ? "#ffffff" : "var(--eg-text-primary, #0f172a)",
                        border: b === 0 ? "1px solid transparent" : "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.15))",
                        boxShadow: b === 0 ? "0 4px 12px rgba(16, 185, 129, 0.3)" : "none"
                      },
                      children: [
                        /* @__PURE__ */ r("span", { children: f.label }),
                        f.isExternal && /* @__PURE__ */ c("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                          /* @__PURE__ */ r("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
                          /* @__PURE__ */ r("polyline", { points: "15 3 21 3 21 9" }),
                          /* @__PURE__ */ r("line", { x1: "10", y1: "14", x2: "21", y2: "3" })
                        ] })
                      ]
                    },
                    b
                  )),
                  /* @__PURE__ */ c(
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
                        /* @__PURE__ */ c("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
            dangerouslySetInnerHTML: { __html: x },
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
          Gt,
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
function We() {
  if (!(typeof window > "u"))
    return window.mermaid;
}
function Pe() {
  if (!(typeof window > "u"))
    return window.Prism;
}
let rt = null, nt = null;
function Ia(t) {
  return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function Ce(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sr() {
  if (typeof document > "u") return !1;
  const t = document.documentElement.getAttribute("data-theme") || "";
  return t.includes("dark") || t.includes("crystal") || t === "clamui-dark";
}
function La() {
  if (typeof window > "u") return Promise.resolve(null);
  const t = We();
  return t ? Promise.resolve(t) : rt || (rt = new Promise((e) => {
    const n = document.querySelector("script[data-mermaid-script]");
    if (n) {
      n.addEventListener("load", () => {
        it(), e(We() || null);
      }), n.addEventListener("error", () => e(null));
      return;
    }
    const i = document.createElement("script");
    i.src = "/vendor/mermaid.min.js", i.async = !0, i.setAttribute("data-mermaid-script", "true"), i.onload = () => {
      it(), e(We() || null);
    }, i.onerror = () => {
      const o = document.createElement("script");
      o.src = "vendor/mermaid.min.js", o.async = !0, o.onload = () => {
        it(), e(We() || null);
      }, o.onerror = () => {
        const a = document.createElement("script");
        a.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js", a.async = !0, a.onload = () => {
          it(), e(We() || null);
        }, a.onerror = () => {
          console.warn("Unable to load Mermaid script."), e(null);
        }, document.head.appendChild(a);
      }, document.head.appendChild(o);
    }, document.head.appendChild(i);
  }), rt);
}
function it() {
  const t = We();
  if (t)
    try {
      t.initialize({
        startOnLoad: !1,
        theme: sr() ? "dark" : "default",
        themeVariables: sr() ? {
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
const cr = {
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
      const o = n.toUpperCase(), a = cr[o] || cr.NOTE;
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
function un(t) {
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
function fn(t, e) {
  var m;
  const n = (e || "").toLowerCase().trim();
  if (typeof window < "u") {
    const y = Pe();
    if (y) {
      un(y);
      const w = n === "ts" || n === "typescript" ? "typescript" : n === "tsx" ? "tsx" : n === "jsx" ? "jsx" : n === "js" ? "javascript" : n === "py" ? "python" : n === "sh" || n === "shell" ? "bash" : n, L = (m = y.languages) == null ? void 0 : m[w];
      if (L && typeof y.highlight == "function")
        try {
          return y.highlight(t, L, w);
        } catch {
        }
    }
  }
  const i = /python|py/i.test(n), o = /c\+\+|cpp|c|csharp|c#/i.test(n), a = /bash|sh|shell|zsh/i.test(n), l = /css|scss|less/i.test(n), s = /json/i.test(n), p = !i && !o && !a && !l && !s, d = [];
  let g = 0;
  const u = (y, w) => {
    const L = `eghigh_${g++}`;
    return d.push({
      placeholder: L,
      html: `<span class="${y}">${Ce(w)}</span>`
    }), L;
  };
  let h = t;
  i || a ? (i && (h = h.replace(
    /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
    (y) => u("hljs-comment token comment", y)
  )), h = h.replace(/(#.*$)/gm, (y) => u("hljs-comment token comment", y))) : (h = h.replace(/(\/\*[\s\S]*?\*\/)/g, (y) => u("hljs-comment token comment", y)), h = h.replace(/(\/\/.*$)/gm, (y) => u("hljs-comment token comment", y))), o && (h = h.replace(/^(#\s*[a-zA-Z_]+.*)$/gm, (y) => u("hljs-meta token important", y))), h = h.replace(
    /(`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
    (y) => u("hljs-string token string", y)
  ), p && (h = h.replace(/(<\/)([a-zA-Z0-9_.-]+)(>)/g, (y, w, L, z) => u("hljs-punctuation token punctuation", w) + u("hljs-tag token tag", L) + u("hljs-punctuation token punctuation", z)), h = h.replace(/(<[A-Za-z0-9_.-]+)([^>]*?)(\/?>)/g, (y, w, L, z) => {
    const A = w.slice(1), R = u("hljs-punctuation token punctuation", "<") + u("hljs-tag token tag", A), B = L.replace(
      /\b([a-zA-Z_:][a-zA-Z0-9_.-]*)(?=\s*=)/g,
      (I) => u("hljs-attr token attr-name", I)
    ), j = u("hljs-punctuation token punctuation", z);
    return R + B + j;
  })), h = h.replace(
    /\b(0x[0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
    (y) => u("hljs-number token number", y)
  );
  const x = /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|readonly|return|set|static|super|switch|this|throw|true|try|type|typeof|var|void|while|with|yield|declare|namespace|module|abstract|keyof|is)\b/g, f = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|False|finally|for|from|global|if|import|in|is|lambda|None|nonlocal|not|or|pass|raise|return|True|try|while|with|yield|self|cls)\b/g, b = /\b(alignas|alignof|auto|bool|break|case|catch|char|class|const|constexpr|continue|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|while)\b/g, C = /\b(if|then|else|elif|fi|case|esac|for|select|while|until|do|done|in|function|time|return|exit|echo|export|source|local|sudo|npm|npx|git|cd|mkdir|rm|cp|mv)\b/g;
  p ? h = h.replace(x, (y) => u("hljs-keyword token keyword", y)) : i ? h = h.replace(f, (y) => u("hljs-keyword token keyword", y)) : o ? h = h.replace(b, (y) => u("hljs-keyword token keyword", y)) : a && (h = h.replace(C, (y) => u("hljs-keyword token keyword", y))), h = h.replace(
    /\b(?!(?:eghigh|return|if|for|while|switch|catch|void|typeof|delete|await|yield)\b)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    (y, w) => u("hljs-title function_ token function", w)
  ), p && (h = h.replace(/\b([A-Z][a-zA-Z0-9_$]*)\b/g, (y) => u("hljs-type token class-name", y)), h = h.replace(
    /\b(string|number|boolean|any|unknown|never|void)\b/g,
    (y) => u("hljs-type token class-name", y)
  )), p && (h = h.replace(
    /(=>|===|!==|==|!=|<=|>=|&&|\|\||\?\?)/g,
    (y) => u("hljs-operator token operator", y)
  )), s && (h = h.replace(/"([^"]+)"\s*(?=:)/g, (y, w) => `"${u("hljs-attr token property", w)}"`));
  let v = Ce(h);
  for (let y = d.length - 1; y >= 0; y--)
    v = v.replace(d[y].placeholder, d[y].html);
  return v;
}
function za() {
  const t = new Z.Renderer();
  return t.heading = function(e, n) {
    let i = 1, o = "";
    if (typeof e == "object" && e !== null && "tokens" in e) {
      const s = e;
      i = s.depth || 1, o = this.parser ? this.parser.parseInline(s.tokens) : s.text || "";
    } else
      o = String(e || ""), i = Number(n || 1);
    const a = o.replace(/<[^>]*>/g, "").trim(), l = Ia(a);
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
    const a = o ? o.toUpperCase() : "CODE", l = fn(i, o);
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
    const s = ne(o), p = l ? ` alt="${Ce(l)}"` : "", d = a ? ` title="${Ce(a)}"` : "";
    return `
      <figure class="docs-image-figure">
        <img src="${s}"${p}${d} class="docs-image" loading="lazy" />
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
        s += "<tr>", p.forEach((d) => {
          s += `<td>${this.parser ? this.parser.parseInline(d.tokens) : d.text}</td>`;
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
  const e = za();
  let n = "";
  try {
    n = Z.parse(t, { renderer: e, gfm: !0 });
  } catch (o) {
    console.warn("Marked parsing error:", o), n = Z.parse(t);
  }
  const i = Wa(n);
  return Ae(i);
}
let he = 1, Ee = 0, je = 0, It = !1, dr = 0, pr = 0;
function Ra() {
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
    const d = t == null ? void 0 : t.querySelector("#egMermaidViewport"), g = t == null ? void 0 : t.querySelector("#egMermaidZoomBadge");
    d && (d.style.transform = `translate(${Ee}px, ${je}px) scale(${he})`), g && (g.textContent = `${Math.round(he * 100)}%`);
  }, p = () => {
    if (!t) return;
    t.classList.remove("open"), document.body.style.overflow = "";
    const d = t.querySelector("#egMermaidViewport");
    d && (d.innerHTML = "");
  };
  return e == null || e.addEventListener("click", p), n == null || n.addEventListener("click", p), t.addEventListener("click", (d) => {
    d.target === t && p();
  }), i == null || i.addEventListener("click", () => {
    he = Math.min(6, Number((he + 0.25).toFixed(2))), s();
  }), o == null || o.addEventListener("click", () => {
    he = Math.max(0.2, Number((he - 0.25).toFixed(2))), s();
  }), a == null || a.addEventListener("click", () => {
    he = 1, Ee = 0, je = 0, s();
  }), l && (l.addEventListener(
    "wheel",
    (d) => {
      const g = d;
      g.preventDefault();
      const u = g.deltaY < 0 ? 0.15 : -0.15;
      he = Math.max(0.15, Math.min(6, Number((he + u).toFixed(2)))), s();
    },
    { passive: !1 }
  ), l.addEventListener("mousedown", (d) => {
    const g = d;
    It = !0, dr = g.clientX - Ee, pr = g.clientY - je;
  }), window.addEventListener("mouseup", () => {
    It = !1;
  }), l.addEventListener("mousemove", (d) => {
    if (!It) return;
    const g = d;
    g.preventDefault(), Ee = g.clientX - dr, je = g.clientY - pr, s();
  })), document.addEventListener("keydown", (d) => {
    d.key === "Escape" && (t != null && t.classList.contains("open")) && p();
  }), t;
}
function ot(t, e = "Architecture & Flow Diagram") {
  var y;
  const n = Ra(), i = n.querySelector("#egMermaidModalTitle"), o = n.querySelector("#egMermaidViewport"), a = n.querySelector("#egMermaidModalBody");
  if (!o || !t) return;
  const l = t.closest(".mermaid-wrapper");
  if (l) {
    const w = l.querySelector(".mermaid-container svg");
    w && (t = w);
  }
  i && (i.textContent = e), o.innerHTML = "";
  const s = t.cloneNode(!0);
  let p = 1e3, d = 600;
  const g = (y = s.viewBox) == null ? void 0 : y.baseVal;
  if (g && g.width > 0 && g.height > 0)
    p = g.width, d = g.height;
  else {
    const w = t.getBoundingClientRect();
    w.width > 0 && w.height > 0 && (p = w.width, d = w.height);
  }
  const u = t.getAttribute("viewBox");
  u ? s.setAttribute("viewBox", u) : s.setAttribute("viewBox", `0 0 ${p} ${d}`), s.setAttribute("width", `${p}`), s.setAttribute("height", `${d}`), s.style.width = `${p}px`, s.style.height = `${d}px`, s.style.minWidth = `${p}px`, s.style.maxWidth = "none", s.style.display = "block", n.classList.add("open"), document.body.style.overflow = "hidden", o.appendChild(s);
  const h = a ? a.getBoundingClientRect() : null, x = h && h.width > 0 ? h.width - 80 : 1100, f = h && h.height > 0 ? h.height - 80 : 700, b = x / p, C = f / d, v = Math.min(b, C, 1.2);
  he = Number(Math.max(0.3, v).toFixed(2)), Ee = 0, je = 0, o.style.transform = `translate(0px, 0px) scale(${he})`;
  const m = n.querySelector("#egMermaidZoomBadge");
  m && (m.textContent = `${Math.round(he * 100)}%`);
}
let at = null;
function Ba() {
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
function _a(t, e) {
  if (typeof document > "u") return;
  const n = Ba(), i = n.querySelector("#egImageModalTitle"), o = n.querySelector("#egImageModalImg");
  i && (i.textContent = e || "Image Preview"), o && (o.src = t), n.classList.add("open"), document.body.style.overflow = "hidden";
}
function Ma(t) {
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
function mn(t, e) {
  if (!t || typeof window > "u") return;
  t.querySelectorAll(".mermaid").length > 0 ? La().then((a) => {
    if (!a) return;
    const l = t.querySelectorAll(".mermaid");
    l.length !== 0 && (typeof a.run == "function" ? a.run({ nodes: l }).then(() => lt(t, e)).catch(() => lt(t, e)) : typeof a.init == "function" && (a.init(void 0, l), lt(t, e)));
  }).catch((a) => {
    console.warn("Mermaid enhancement notice:", a);
  }) : t.querySelectorAll(".mermaid-wrapper").length > 0 && lt(t, e), t.querySelectorAll(".code-copy-btn").forEach((a) => {
    a.dataset.bound || (a.dataset.bound = "1", a.addEventListener("click", async (l) => {
      var d;
      l.preventDefault();
      const s = (d = a.closest(".code-block-wrapper")) == null ? void 0 : d.querySelector("pre");
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
      un(a);
      try {
        a.highlightAllUnder(t);
      } catch {
      }
    }
    t.querySelectorAll("pre code").forEach((l) => {
      if (l.closest(".mermaid-wrapper") || l.querySelector(".token, .hljs-keyword, .hljs-string, .hljs-tag")) return;
      const p = (l.className || "").match(/language-([a-zA-Z0-9_-]+)/), d = p ? p[1] : "", g = l.textContent || "";
      g && (l.innerHTML = fn(g, d));
    });
  }, o = Pe();
  o ? i(o) : Ta().then((a) => {
    i(a);
  }), t.querySelectorAll(".docs-image").forEach((a) => {
    a.dataset.lightboxBound || (a.dataset.lightboxBound = "1", a.style.cursor = "zoom-in", a.addEventListener("click", () => {
      _a(a.src, a.alt || a.title || "Documentation Image Preview");
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
    Ma(i);
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
    const p = n.querySelector(".mermaid-copy-btn"), d = n.querySelector(".mermaid");
    p && d && !p.dataset.bound && (p.dataset.bound = "1", p.addEventListener("click", async (u) => {
      u.preventDefault();
      const h = d.dataset.rawSource ? decodeURIComponent(d.dataset.rawSource) : d.innerText;
      try {
        await navigator.clipboard.writeText(h), p.innerHTML = "<span>Copied!</span>", setTimeout(() => {
          p.innerHTML = "<span>Copy</span>";
        }, 2e3);
      } catch {
      }
    }));
  });
}
function $a(t) {
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
    let d = a.slice(s + 1).trim();
    d.startsWith('"') && d.endsWith('"') || d.startsWith("'") && d.endsWith("'") ? d = d.slice(1, -1) : d.startsWith("[") && d.endsWith("]") && (d = d.slice(1, -1).split(",").map((g) => g.trim().replace(/^["']|["']$/g, "")).filter(Boolean)), o[p] = d;
  }), { meta: o, body: i };
}
function gr(t) {
  if (!t) return "";
  let e = t.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, "");
  e = e.replace(/<!--\[endif\]-->/gi, "");
  const n = e.split(`
`);
  let i = !1;
  return n.map((a) => a.trim().startsWith("```") ? (i = !i, a) : (i || (a = a.replace(/^(\s*\d+\.)\s+\d+\.\s*/, "$1 "), a = a.replace(/^(\s*\d+\.)\s+\d+\.\*\*/, "$1 **"), a = a.replace(/\u00a0/g, " "), a = a.replace(/\*\*([^\*\n]+?)\*\*/g, (l, s) => {
    const p = s.trim();
    if (!p) return l;
    const d = /^\s/.test(s) ? " " : "", g = /\s$/.test(s) ? " " : "";
    return d + "**" + p + "**" + g;
  }), a = a.replace(new RegExp("(?<!\\*)\\*([^\\*\\n]+?)\\*(?!\\*)", "g"), (l, s) => {
    const p = s.trim();
    if (!p) return l;
    const d = /^\s/.test(s) ? " " : "", g = /\s$/.test(s) ? " " : "";
    return d + "*" + p + "*" + g;
  })), a)).join(`
`);
}
const Qt = ({
  content: t,
  url: e,
  metadata: n = {},
  title: i,
  author: o,
  date: a,
  category: l,
  tags: s,
  readingTime: p,
  imageUrl: d,
  description: g,
  short_description: u,
  textAlign: h = "justify",
  onBack: x,
  backLabel: f = "Back",
  showShare: b = !0,
  shareUrl: C,
  showRaw: v = !0,
  showToc: m = !1,
  headerExtra: y,
  footerExtra: w,
  className: L = "",
  style: z
}) => {
  const [A, R] = W(""), [B, j] = W(!!(e && !t)), [I, E] = W(null), [H, $] = W(!1), [U, _] = W(!1), [T, S] = W(!1), N = me(null);
  Y(() => {
    if (!e || t) return;
    let K = !0;
    return j(!0), E(null), fetch(e).then((re) => {
      if (!re.ok) throw new Error(`Failed to load markdown: HTTP ${re.status}`);
      return re.text();
    }).then((re) => {
      K && (R(re), j(!1));
    }).catch((re) => {
      K && (E(re instanceof Error ? re.message : String(re)), j(!1));
    }), () => {
      K = !1;
    };
  }, [e, t]);
  const { parsedMeta: k, markdownBody: D } = ee(() => {
    const K = t !== void 0 ? t : A, { meta: re, body: ge } = $a(K);
    return { parsedMeta: re, markdownBody: ge };
  }, [t, A]), O = i || n.title || n.heading || k.title || k.heading || "", M = o || n.author || k.author || "", P = a || n.date || k.date || k.createdAt || "", V = l || n.category || k.category || (Array.isArray(k.tags) && k.tags.length > 0 ? k.tags[0] : "") || "", G = ee(() => s && s.length > 0 ? s : n.tags && n.tags.length > 0 ? n.tags : Array.isArray(k.tags) ? k.tags : typeof k.tags == "string" ? [k.tags] : [], [s, n.tags, k.tags]), Q = d || n.output_image || n.imageUrl || k.output_image || k.imageUrl || "", F = g || u || n.short_description || n.description || (typeof k.short_description == "string" ? k.short_description : void 0) || (typeof k.description == "string" ? k.description : void 0) || "", oe = C || (typeof window < "u" ? window.location.href : ""), ie = ee(() => Q ? Q.startsWith("http://") || Q.startsWith("https://") ? Q : typeof window < "u" ? `${window.location.origin}/${Q.replace(/^\//, "")}` : Q : "", [Q]), ae = async () => {
    const K = F && F.trim() && F.trim() !== O.trim() ? `${O} - ${F.trim()}` : O;
    if (typeof navigator < "u" && typeof navigator.share == "function")
      try {
        await navigator.share({
          title: O,
          text: K,
          url: oe
        });
        return;
      } catch (re) {
        if (re && re.name === "AbortError")
          return;
      }
    $(!0);
  }, de = ee(() => gr(D), [D]), Be = ee(() => {
    if (!F.trim()) return "";
    try {
      const K = Z.parseInline(gr(F));
      return Ae(K);
    } catch {
      return Ae(F);
    }
  }, [F]), pe = ee(() => {
    if (p) return p;
    if (n.readingTime) return n.readingTime;
    if (k.readingTime) return k.readingTime;
    const K = (de || "").split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(K / 200))} min read`;
  }, [p, n.readingTime, k.readingTime, de]), Se = ee(() => de.trim() ? xn(de) : "", [de]), et = ee(() => {
    if (!m || !de) return [];
    const K = de.split(`
`), re = [];
    return K.forEach((ge) => {
      if (ge.startsWith("## ") || ge.startsWith("### ")) {
        const J = ge.startsWith("## ") ? 2 : 3, ue = ge.replace(/^#{2,3}\s+/, "").trim(), fe = ue.toLowerCase().replace(/[^\w]+/g, "-");
        re.push({ level: J, text: ue, id: fe });
      }
    }), re;
  }, [m, de]);
  return Y(() => {
    N.current && mn(N.current);
  }, [Se]), B ? /* @__PURE__ */ r("div", { style: { textAlign: "center", padding: "60px 20px", color: "var(--eg-text-muted, #94a3b8)" }, children: /* @__PURE__ */ r("p", { style: { fontSize: "15px", fontWeight: 600 }, children: "Loading document..." }) }) : I ? /* @__PURE__ */ c(
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
        /* @__PURE__ */ r("p", { style: { fontSize: "13.5px", margin: 0 }, children: I }),
        x && /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: x,
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
  ) : /* @__PURE__ */ c(
    "article",
    {
      className: `eg-markdown-viewer ${L}`,
      style: {
        background: "var(--eg-bg-surface, #ffffff)",
        border: "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
        borderRadius: "var(--eg-radius-lg, 14px)",
        padding: "clamp(16px, 3.5vw, 36px)",
        boxShadow: "var(--eg-shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06))",
        boxSizing: "border-box",
        maxWidth: "100%",
        overflow: "hidden",
        ...z
      },
      children: [
        /* @__PURE__ */ c(
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
              x ? /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: x,
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
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                b && /* @__PURE__ */ c(
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
                      /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
                v && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => _(!0),
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
                      /* @__PURE__ */ c("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
        (O || V || M || P) && /* @__PURE__ */ c(
          "header",
          {
            style: {
              marginBottom: "28px",
              borderBottom: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))",
              paddingBottom: "20px"
            },
            children: [
              (V || G.length > 0) && /* @__PURE__ */ c("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }, children: [
                V && /* @__PURE__ */ r(ye, { variant: "neutral", size: "sm", children: V }),
                G.filter((K) => K.toLowerCase() !== V.toLowerCase()).map((K) => /* @__PURE__ */ c(ye, { variant: "neutral", size: "sm", children: [
                  "#",
                  K
                ] }, K))
              ] }),
              O && /* @__PURE__ */ r(
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
                  children: O
                }
              ),
              /* @__PURE__ */ c(
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
                    M && /* @__PURE__ */ c("span", { children: [
                      "By ",
                      /* @__PURE__ */ r("strong", { children: M })
                    ] }),
                    M && P && /* @__PURE__ */ r("span", { children: "•" }),
                    P && /* @__PURE__ */ r("span", { children: P }),
                    pe && /* @__PURE__ */ c(se, { children: [
                      /* @__PURE__ */ r("span", { children: "•" }),
                      /* @__PURE__ */ r("span", { children: pe })
                    ] })
                  ]
                }
              )
            ]
          }
        ),
        Q && /* @__PURE__ */ r(
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
                src: Q,
                alt: O || "Featured",
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
        et.length > 0 && /* @__PURE__ */ c(
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
        y,
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
        x && /* @__PURE__ */ r("div", { style: { marginTop: "36px", paddingTop: "20px", borderTop: "1px solid var(--eg-border-subtle, rgba(0,0,0,0.08))" }, children: /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: x,
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
        b && /* @__PURE__ */ r(
          Gt,
          {
            isOpen: H,
            onClose: () => $(!1),
            title: O,
            url: oe,
            description: F,
            imageUrl: ie
          }
        ),
        v && U && /* @__PURE__ */ r(
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
            onClick: () => _(!1),
            children: /* @__PURE__ */ c(
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
                  /* @__PURE__ */ c(
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
                        /* @__PURE__ */ c("span", { children: [
                          "Raw Markdown Source (",
                          O || "Document",
                          ")"
                        ] }),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => _(!1),
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
                  /* @__PURE__ */ c(
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
                            onClick: () => _(!1),
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
                            children: T ? "Copied!" : "Copy Markdown"
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
}, os = Qt, hr = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='none'><rect width='200' height='120' fill='%231e293b'/><path d='M60 40h80M60 60h60M60 80h40' stroke='%2394a3b8' stroke-width='4' stroke-linecap='round'/><circle cx='155' cy='75' r='12' fill='%2338bdf8' opacity='0.7'/></svg>", Da = ({
  post: t,
  onSelect: e,
  showExcerpt: n = !1,
  fallbackImageUrl: i,
  className: o = "",
  style: a
}) => {
  const l = t.output_image || t.imageUrl || i || hr, s = t.category || (t.tags && t.tags.length > 0 ? t.tags[0] : "General"), p = t.short_description || t.description || "";
  return /* @__PURE__ */ c(
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
      onMouseEnter: (d) => {
        e && (d.currentTarget.style.transform = "translateY(-3px)", d.currentTarget.style.boxShadow = "var(--eg-shadow-md, 0 8px 24px rgba(0, 0, 0, 0.12))", d.currentTarget.style.borderColor = "var(--eg-color-primary, #b8860b)");
      },
      onMouseLeave: (d) => {
        e && (d.currentTarget.style.transform = "translateY(0)", d.currentTarget.style.boxShadow = "var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))", d.currentTarget.style.borderColor = "var(--eg-border-default, rgba(0, 0, 0, 0.1))");
      },
      children: [
        /* @__PURE__ */ c("div", { children: [
          /* @__PURE__ */ r("div", { style: { width: "100%", height: "180px", overflow: "hidden", background: "var(--eg-bg-canvas, #f1f5f9)" }, children: /* @__PURE__ */ r(
            "img",
            {
              src: l,
              alt: t.title,
              loading: "lazy",
              onError: (d) => {
                d.currentTarget.onerror = null, d.currentTarget.src = i || hr;
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
          /* @__PURE__ */ c("div", { style: { padding: "20px 20px 16px" }, children: [
            /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }, children: [
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
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c(
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
  const p = xi(t), d = a || (typeof window < "u" ? `${window.location.origin}${window.location.pathname.endsWith(".html") ? "/blog.html" : "/blog"}?title=${p}` : ""), g = t.output_image || t.imageUrl || `assets/img/blog/id${t.id}.webp`;
  return /* @__PURE__ */ r(
    Qt,
    {
      content: t.content || t.full_description,
      url: !t.content && !t.full_description ? `data/blog/id${t.id}.md` : void 0,
      description: t.short_description || t.description,
      textAlign: n,
      showToc: i,
      showShare: o,
      shareUrl: d,
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
}) => /* @__PURE__ */ c("aside", { className: "eg-blog-sidebar", style: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
  o && /* @__PURE__ */ c(
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
  t && t.length > 0 && /* @__PURE__ */ c(
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
        /* @__PURE__ */ c("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }, children: [
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
            return /* @__PURE__ */ r("li", { children: /* @__PURE__ */ c(
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
  e && e.length > 0 && /* @__PURE__ */ c(
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
            children: /* @__PURE__ */ c("div", { style: { flex: "1 1 auto" }, children: [
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
  const [s, p] = W(1), d = n !== void 0 ? n : s, g = Math.max(1, Math.ceil(t.length / e)), u = (f) => {
    const b = Math.max(1, Math.min(g, f));
    a ? a(b) : p(b);
  }, h = ee(() => {
    const f = (d - 1) * e;
    return t.slice(f, f + e);
  }, [t, d, e]), x = ee(() => {
    if (g <= 5)
      return Array.from({ length: g }, (b, C) => C + 1);
    const f = [];
    return d <= 3 ? f.push(1, 2, 3, "...", g) : d >= g - 2 ? f.push(1, "...", g - 2, g - 1, g) : f.push(1, "...", d, "...", g), f;
  }, [g, d]);
  return /* @__PURE__ */ c("div", { children: [
    h.length === 0 ? /* @__PURE__ */ r("div", { style: { padding: "60px 20px", textAlign: "center", color: "var(--eg-text-muted, #94a3b8)" }, children: "No articles match your criteria." }) : /* @__PURE__ */ r(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 260px), 1fr))",
          gap: "clamp(16px, 2.5vw, 24px)"
        },
        children: h.map((f) => /* @__PURE__ */ r(
          Da,
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
    g > 1 && /* @__PURE__ */ c(
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
              disabled: d === 1,
              onClick: () => u(d - 1),
              style: {
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--eg-border-default, rgba(0,0,0,0.12))",
                background: "var(--eg-bg-surface, #ffffff)",
                color: "var(--eg-text-primary, #0f172a)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: d === 1 ? "not-allowed" : "pointer",
                opacity: d === 1 ? 0.5 : 1
              },
              children: "« Prev"
            }
          ),
          x.map((f, b) => {
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
                `ellipsis-${b}`
              );
            const C = Number(f), v = C === d;
            return /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => u(C),
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
                children: C
              },
              C
            );
          }),
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              disabled: d === g,
              onClick: () => u(d + 1),
              style: {
                padding: "7px 12px",
                borderRadius: "6px",
                border: "1px solid var(--eg-border-default, rgba(0,0,0,0.12))",
                background: "var(--eg-bg-surface, #ffffff)",
                color: "var(--eg-text-primary, #0f172a)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: d === g ? "not-allowed" : "pointer",
                opacity: d === g ? 0.5 : 1
              },
              children: "Next »"
            }
          )
        ]
      }
    )
  ] });
};
function Ea(t) {
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
function Na(t) {
  const e = t.toLowerCase();
  return e.endsWith(".exe") || e.endsWith(".msi") || e.endsWith(".zip") && (e.includes("win") || e.includes("windows")) ? "windows" : e.endsWith(".appimage") || e.endsWith(".tar.gz") || e.endsWith(".deb") || e.endsWith(".rpm") ? "linux" : e.endsWith(".dmg") || e.endsWith(".zip") && (e.includes("mac") || e.includes("darwin")) ? "macos" : e.includes("checksum") || e.includes("sha256") || e.endsWith(".txt") || e.endsWith(".asc") ? "checksum" : e.endsWith(".zip") ? "windows" : "other";
}
function Pa(t) {
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
function Ha(t) {
  const e = (t || "").trim().toUpperCase();
  return e.includes("ENHANC") ? "ENHANCEMENT" : e.includes("OPT") ? "OPTIMIZATION" : e.includes("FEAT") ? "FEATURE" : e.includes("BUG") || e.includes("FIX") || e.includes("REPAIR") ? "BUG-FIX" : e.includes("SEC") ? "SECURITY" : e.includes("APP") ? "APP" : e.includes("MAINT") ? "MAINTENANCE" : "ENHANCEMENT";
}
async function ur(t, e = {}) {
  const n = t.replace(/^https?:\/\/github\.com\//, "").replace(/\/$/, ""), i = n.replace(/[^a-zA-Z0-9_-]/g, "_"), o = e.cacheKey || `eg_gh_releases_${i}`, a = `${o}_time`, l = `eg_gh_ratelimit_${i}`, s = e.cacheTtlMs ?? 15 * 60 * 1e3;
  if (!e.forceRefresh && typeof window < "u") {
    try {
      const p = localStorage.getItem(a), d = localStorage.getItem(o);
      if (p && d && Date.now() - Number(p) < s) {
        const g = JSON.parse(d);
        if (Array.isArray(g) && g.length > 0)
          return g;
      }
    } catch {
    }
    try {
      const p = localStorage.getItem(l);
      if (p && Date.now() < Number(p)) {
        const d = localStorage.getItem(o);
        if (d) {
          const g = JSON.parse(d);
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
      const d = await p.json();
      if (Array.isArray(d)) {
        const u = (e.filterPrereleases ? d.filter((h) => !h.prerelease) : d).map((h, x) => {
          const f = h.tag_name || "", b = f.replace(/^v/, ""), C = Pa(h.body), v = Array.isArray(h.assets) ? h.assets.map((w) => {
            const L = Na(w.name), z = w.name.toLowerCase().endsWith(".exe") || w.name.toLowerCase().endsWith(".msi") || w.name.toLowerCase().endsWith(".dmg") || w.name.toLowerCase().endsWith(".appimage"), A = w.name.toLowerCase().endsWith(".zip") || w.name.toLowerCase().endsWith(".tar.gz");
            return {
              name: w.name,
              size: w.size,
              browser_download_url: w.browser_download_url,
              contentType: w.content_type,
              platform: L,
              isInstaller: z,
              isArchive: A
            };
          }) : [], m = n.split("/")[1] || n, y = (h.body || "").replace(/<!--[\s\S]*?-->/g, "").trim();
          return {
            id: String(h.id || f),
            version: b,
            title: h.name || `${m} ${f}`,
            date: ja(h.published_at || h.created_at),
            timestamp: h.published_at ? new Date(h.published_at).getTime() : Date.now(),
            type: "release",
            category: x === 0 ? "FEATURE" : "ENHANCEMENT",
            badge: x === 0 ? "Latest Release" : "Release",
            description: y ? y.slice(0, 260) + (y.length > 260 ? "..." : "") : `Official GitHub release for ${m} ${f}.`,
            highlights: C,
            link: h.html_url,
            linkText: "View on GitHub →",
            rawBody: y,
            assets: v,
            htmlUrl: h.html_url,
            isLatest: x === 0,
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
        const d = JSON.parse(p);
        if (Array.isArray(d) && d.length > 0) return d;
      }
    } catch {
    }
  return [];
}
async function fr(t, e = {}) {
  try {
    const n = e.forceRefresh ? `${t}${t.includes("?") ? "&" : "?"}_t=${Date.now()}` : t, i = await fetch(n);
    if (!i.ok)
      throw new Error(`Failed to fetch updates JSON: HTTP ${i.status}`);
    const o = await i.json();
    return (Array.isArray(o) ? o : o && Array.isArray(o.updates) ? o.updates : []).map((l, s) => {
      const p = String(l.id || `update-${s}`), d = (l.type || "website").toLowerCase(), g = Ha(l.category || l.badge), u = typeof l.link == "string" && l.link.startsWith("http");
      let h = "Release Notes →";
      return d === "app" ? h = u ? "Open Application ↗" : "Open Application →" : d === "website" && (h = "Release Notes →"), {
        id: p,
        version: l.version ? String(l.version).replace(/^v/, "") : void 0,
        title: l.title || `Update ${p}`,
        date: l.date || "Recent",
        type: d,
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
async function Fa(t) {
  const { updatesUrl: e, githubRepo: n, preferGitHub: i = !1, cacheTtlMs: o, forceRefresh: a } = t;
  if (i && n) {
    const l = await ur(n, { cacheTtlMs: o, forceRefresh: a });
    return l.length > 0 ? l : e ? fr(e, { forceRefresh: a }) : [];
  }
  if (e) {
    const l = await fr(e, { forceRefresh: a });
    if (l.length > 0) return l;
  }
  return n ? ur(n, { cacheTtlMs: o, forceRefresh: a }) : [];
}
function Oa(t, e) {
  const n = (t || e || "").toLowerCase();
  return n.includes("enhanc") || n.includes("spark") ? /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("path", { d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" }),
    /* @__PURE__ */ r("path", { d: "M20 3v4" }),
    /* @__PURE__ */ r("path", { d: "M22 5h-4" }),
    /* @__PURE__ */ r("path", { d: "M4 17v2" }),
    /* @__PURE__ */ r("path", { d: "M5 18H3" })
  ] }) : n.includes("opt") || n.includes("speed") || n.includes("gauge") ? /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("path", { d: "m12 14 4-4" }),
    /* @__PURE__ */ r("path", { d: "M3.34 19a10 10 0 1 1 17.32 0" })
  ] }) : n.includes("feat") || n.includes("star") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }) : n.includes("bug") || n.includes("fix") || n.includes("tool") || n.includes("wrench") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("path", { d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }) }) : n.includes("app") || n.includes("grid") ? /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1.5" }),
    /* @__PURE__ */ r("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1.5" })
  ] }) : n.includes("sec") || n.includes("shield") ? /* @__PURE__ */ r("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ r("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }) : /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
    /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
  ] });
}
function Va(t) {
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
  onUpdateClick: d,
  seenStorageKey: g = "eg_seen_updates",
  emptyMessage: u = "No updates found matching your criteria.",
  getActionLabel: h,
  className: x = "",
  style: f = {}
}) => {
  const [b, C] = W(o), [v, m] = W(""), y = ee(() => {
    if (i && i.length > 0) return i;
    const A = t.some((B) => (B.type || "").toLowerCase() === "website"), R = t.some((B) => (B.type || "").toLowerCase() === "app");
    return A || R ? [
      { id: "all", label: "All Updates", filter: () => !0 },
      { id: "website", label: "Website", filter: (B) => (B.type || "").toLowerCase() === "website" },
      { id: "app", label: "Apps", filter: (B) => (B.type || "").toLowerCase() === "app" }
    ] : [{ id: "all", label: "All Updates", filter: () => !0 }];
  }, [i, t]), w = ee(() => {
    const A = {};
    return y.forEach((R) => {
      R.id === "all" ? A[R.id] = t.length : R.filter ? A[R.id] = t.filter(R.filter).length : A[R.id] = t.filter((B) => (B.type || B.category || "").toLowerCase() === R.id.toLowerCase()).length;
    }), A;
  }, [y, t]), L = ee(() => {
    let A = t;
    const R = y.find((B) => B.id === b);
    if (R && R.id !== "all" && (R.filter ? A = A.filter(R.filter) : A = A.filter((B) => (B.type || B.category || "").toLowerCase() === R.id.toLowerCase())), v.trim()) {
      const B = v.toLowerCase();
      A = A.filter(
        (j) => j.title.toLowerCase().includes(B) || j.version && j.version.toLowerCase().includes(B) || j.description && j.description.toLowerCase().includes(B) || j.category && j.category.toLowerCase().includes(B) || Array.isArray(j.highlights) && j.highlights.some((I) => I.toLowerCase().includes(B))
      );
    }
    return A;
  }, [t, y, b, v]), z = te(
    (A, R) => {
      if (d && d(R), typeof window < "u" && R.id)
        try {
          const j = localStorage.getItem(g), I = j ? JSON.parse(j) : [];
          I.includes(R.id) || (I.push(R.id), localStorage.setItem(g, JSON.stringify(I)));
        } catch {
        }
      const B = R.link;
      B && !B.startsWith("http://") && !B.startsWith("https://") && p && (A.preventDefault(), p(B));
    },
    [p, d, g]
  );
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-updates-timeline-container ${x}`,
      style: {
        maxWidth: "920px",
        margin: "0 auto",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        ...f
      },
      children: [
        (e || n) && /* @__PURE__ */ c("div", { style: { textAlign: "center", marginBottom: "32px" }, children: [
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
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, role: "tablist", children: y.map((A) => {
                const R = b === A.id, B = w[A.id];
                return /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    role: "tab",
                    "aria-selected": R,
                    onClick: () => C(A.id),
                    style: {
                      padding: "7px 15px",
                      borderRadius: "9999px",
                      fontSize: "13.5px",
                      fontWeight: R ? 700 : 600,
                      border: R ? "1px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))",
                      background: R ? "var(--eg-color-primary, #10b981)" : "transparent",
                      color: R ? "#ffffff" : "var(--eg-text-secondary, #475569)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.18s ease",
                      boxShadow: R ? "0 2px 8px rgba(16, 185, 129, 0.28)" : "none"
                    },
                    children: [
                      /* @__PURE__ */ r("span", { children: A.label }),
                      a && B !== void 0 && /* @__PURE__ */ c(
                        "span",
                        {
                          style: {
                            fontSize: "11.5px",
                            opacity: R ? 0.92 : 0.65,
                            fontWeight: 600
                          },
                          children: [
                            "(",
                            B,
                            ")"
                          ]
                        }
                      )
                    ]
                  },
                  A.id
                );
              }) }),
              l && /* @__PURE__ */ c("div", { style: { position: "relative", minWidth: "220px", flex: "1 1 220px", maxWidth: "320px" }, children: [
                /* @__PURE__ */ c(
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
                    onChange: (A) => m(A.target.value),
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
        L.length === 0 && /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("svg", { width: "40", height: "40", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", style: { margin: "0 auto 12px", opacity: 0.5 }, children: [
                /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ r("line", { x1: "8", y1: "12", x2: "16", y2: "12" })
              ] }),
              /* @__PURE__ */ r("p", { style: { margin: 0, fontSize: "15px", fontWeight: 600 }, children: u })
            ]
          }
        ),
        /* @__PURE__ */ c("div", { style: { position: "relative", paddingLeft: "32px" }, children: [
          L.length > 0 && /* @__PURE__ */ r(
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
          L.map((A, R) => {
            const B = Va(A.category || A.badge), j = Oa(A.category, A.icon), I = !!(A.link && A.link.startsWith("http"));
            let E = A.linkText;
            if (h)
              E = h(A);
            else if (!E) {
              const H = (A.type || "").toLowerCase();
              H === "app" ? E = I ? "Open Application ↗" : "Open Application →" : H === "website" ? E = "Release Notes →" : E = I ? "View on GitHub →" : "View Details →";
            }
            return /* @__PURE__ */ c(
              "article",
              {
                id: A.version ? `v-${A.version}` : void 0,
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
                        background: B.bg,
                        color: B.color,
                        border: `2px solid ${B.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 0 4px var(--eg-bg-canvas, #f8fafc)",
                        zIndex: 2
                      },
                      children: /* @__PURE__ */ r("div", { style: { transform: "scale(0.65)" }, children: j })
                    }
                  ),
                  /* @__PURE__ */ c(
                    "div",
                    {
                      style: {
                        background: "var(--eg-bg-surface, #ffffff)",
                        border: A.isLatest ? "1.5px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border-default, rgba(0, 0, 0, 0.08))",
                        borderRadius: "var(--eg-radius-xl, 16px)",
                        padding: "24px 28px",
                        boxShadow: A.isLatest ? "0 6px 20px rgba(16, 185, 129, 0.08)" : "var(--eg-shadow-sm, 0 2px 6px rgba(0, 0, 0, 0.03))",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
                      },
                      children: [
                        /* @__PURE__ */ c(
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
                              /* @__PURE__ */ c("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }, children: [
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
                                      color: B.color,
                                      background: B.bg,
                                      border: `1px solid ${B.border}`
                                    },
                                    children: A.category || "UPDATE"
                                  }
                                ),
                                A.version && /* @__PURE__ */ c(
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
                                      A.version
                                    ]
                                  }
                                ),
                                A.isLatest && /* @__PURE__ */ r(ye, { variant: "success", size: "sm", children: "Latest Release" }),
                                A.type && /* @__PURE__ */ c(
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
                                      A.type === "website" ? "Core Website" : A.type === "app" ? "Application" : A.type
                                    ]
                                  }
                                )
                              ] }),
                              /* @__PURE__ */ c(
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
                                    /* @__PURE__ */ c("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                                      /* @__PURE__ */ r("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", ry: "2" }),
                                      /* @__PURE__ */ r("line", { x1: "16", y1: "2", x2: "16", y2: "6" }),
                                      /* @__PURE__ */ r("line", { x1: "8", y1: "2", x2: "8", y2: "6" }),
                                      /* @__PURE__ */ r("line", { x1: "3", y1: "10", x2: "21", y2: "10" })
                                    ] }),
                                    A.date
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
                            children: A.title
                          }
                        ),
                        A.description && /* @__PURE__ */ r(
                          "p",
                          {
                            style: {
                              fontSize: "14px",
                              color: "var(--eg-text-secondary, #475569)",
                              lineHeight: 1.65,
                              margin: "0 0 16px"
                            },
                            children: A.description
                          }
                        ),
                        Array.isArray(A.highlights) && A.highlights.length > 0 && /* @__PURE__ */ r(
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
                                children: A.highlights.map((H, $) => /* @__PURE__ */ r("li", { children: H }, $))
                              }
                            )
                          }
                        ),
                        Array.isArray(A.assets) && A.assets.length > 0 && /* @__PURE__ */ c(
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
                              /* @__PURE__ */ c("span", { style: { fontSize: "12px", fontWeight: 700, color: "var(--eg-text-muted, #94a3b8)" }, children: [
                                "Download Binaries (",
                                A.version ? `v${A.version}` : "Release",
                                "):"
                              ] }),
                              /* @__PURE__ */ r("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" }, children: A.assets.map((H) => {
                                const $ = Ea(H.size), _ = H.platform === "windows" ? "primary" : H.platform === "checksum" ? "neutral" : "info";
                                return /* @__PURE__ */ r(
                                  "a",
                                  {
                                    href: ne(H.browser_download_url),
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                    style: { textDecoration: "none" },
                                    children: /* @__PURE__ */ c(ye, { variant: _, size: "sm", children: [
                                      /* @__PURE__ */ r("span", { children: H.name }),
                                      $ && /* @__PURE__ */ c("span", { style: { opacity: 0.75, fontSize: "10.5px" }, children: [
                                        "(",
                                        $,
                                        ")"
                                      ] })
                                    ] })
                                  },
                                  H.name
                                );
                              }) })
                            ]
                          }
                        ),
                        A.link && /* @__PURE__ */ r("div", { style: { display: "flex", justifyContent: "flex-start", marginTop: "12px" }, children: /* @__PURE__ */ r(
                          "a",
                          {
                            href: ne(A.link),
                            target: I ? "_blank" : void 0,
                            rel: I ? "noopener noreferrer" : void 0,
                            onClick: (H) => z(H, A),
                            style: { textDecoration: "none" },
                            children: /* @__PURE__ */ r(Wt, { variant: "secondary", size: "sm", children: E })
                          }
                        ) })
                      ]
                    }
                  )
                ]
              },
              A.id || R
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
  var U;
  const [o, a] = W(e || ((U = t[0]) == null ? void 0 : U.id) || ""), [l, s] = W(""), [p, d] = W({}), [g, u] = W(!1), [h, x] = W(!1), [f, b] = W(!1), [C, v] = W(null), m = me(null), y = (_) => {
    v(_), setTimeout(() => v(null), 2500);
  };
  Y(() => {
    const _ = () => {
      window.innerWidth > 900 && b(!1);
    };
    return window.addEventListener("resize", _), () => window.removeEventListener("resize", _);
  }, []), Y(() => {
    const _ = (T) => {
      T.key === "Escape" && (b(!1), x(!1));
    };
    return window.addEventListener("keydown", _), () => window.removeEventListener("keydown", _);
  }, []), Y(() => {
    if (f) {
      const _ = document.body.style.overflow;
      return document.body.style.overflow = "hidden", () => {
        document.body.style.overflow = _;
      };
    }
  }, [f]);
  const w = ee(() => {
    const _ = {};
    return t.forEach((T) => {
      const S = T.category || "General";
      _[S] || (_[S] = []), _[S].push(T);
    }), _;
  }, [t]), L = t.findIndex((_) => _.id === o), z = t[L] || t[0], A = L > 0 ? t[L - 1] : null, R = L < t.length - 1 ? t[L + 1] : null, B = ee(() => {
    if (!(z != null && z.content)) return [];
    const _ = z.content.split(`
`), T = [];
    return _.forEach((S) => {
      if (S.startsWith("## ") || S.startsWith("### ")) {
        const N = S.startsWith("## ") ? 2 : 3, k = S.replace(/^#{2,3}\s+/, "").trim(), D = k.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
        T.push({ level: N, text: k, id: D });
      }
    }), T;
  }, [z]), j = ee(() => z != null && z.content ? Ae(xn(z.content)) : "", [z]);
  Y(() => {
    mn(m.current);
  }, [j, o]);
  const I = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href), y("Documentation link copied to clipboard!");
    } catch {
      y("Failed to copy link.");
    }
  }, E = async () => {
    if (z)
      try {
        await navigator.clipboard.writeText(z.content), u(!0), y("Raw markdown copied to clipboard!"), setTimeout(() => u(!1), 2e3);
      } catch {
        y("Failed to copy raw markdown.");
      }
  }, H = (_) => {
    d((T) => ({ ...T, [_]: !T[_] }));
  }, $ = (_) => /* @__PURE__ */ c(se, { children: [
    /* @__PURE__ */ r("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ r(
      "input",
      {
        type: "text",
        placeholder: "Search documentation...",
        value: l,
        onChange: (T) => s(T.target.value),
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
    /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: Object.entries(w).map(([T, S]) => {
      const N = S.filter(
        (D) => D.title.toLowerCase().includes(l.toLowerCase()) || D.category.toLowerCase().includes(l.toLowerCase()) || D.tags && D.tags.some((O) => O.toLowerCase().includes(l.toLowerCase()))
      );
      if (N.length === 0) return null;
      const k = p[T];
      return /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => H(T),
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
              /* @__PURE__ */ r("span", { children: T }),
              /* @__PURE__ */ r("span", { style: { fontSize: "10px" }, children: k ? "▶" : "▼" })
            ]
          }
        ),
        !k && /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "3px", marginTop: "6px" }, children: N.map((D) => {
          const O = D.id === o;
          return /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: () => {
                a(D.id), _ && b(!1), window.scrollTo({ top: 0, behavior: "smooth" });
              },
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid transparent",
                background: O ? "rgba(16, 185, 129, 0.12)" : "transparent",
                color: O ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #475569)",
                fontWeight: O ? 600 : 500,
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
      ] }, T);
    }) })
  ] });
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-docs-viewer-root ${n}`,
      style: {
        display: "grid",
        gridTemplateColumns: "280px minmax(0, 1fr) 240px",
        gap: "32px",
        alignItems: "start",
        fontFamily: "var(--eg-font-sans, sans-serif)",
        color: "var(--eg-text-primary, #0f172a)",
        position: "relative",
        ...i
      },
      children: [
        /* @__PURE__ */ r("style", { children: `
        @keyframes egDocsDrawerSlideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes egDocsFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .eg-docs-drawer-backdrop {
          animation: egDocsFadeIn 0.2s ease;
        }
        .eg-docs-mobile-drawer {
          animation: egDocsDrawerSlideIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .eg-docs-floating-menu-btn {
          display: none;
        }
        .eg-docs-mobile-bar {
          display: none;
        }
        @media (max-width: 1200px) {
          .eg-docs-viewer-root {
            grid-template-columns: 260px minmax(0, 1fr) !important;
            gap: 24px !important;
          }
          .eg-docs-viewer-root > aside.eg-docs-toc {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .eg-docs-viewer-root {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }
          .eg-docs-desktop-sidebar {
            display: none !important;
          }
          .eg-docs-toc {
            display: none !important;
          }
          .eg-docs-mobile-bar {
            display: block !important;
          }
          .eg-docs-floating-menu-btn {
            display: inline-flex !important;
            align-items: center;
            gap: 7px;
            position: fixed;
            bottom: 24px;
            left: 20px;
            z-index: 850;
            padding: 10px 18px;
            border-radius: 9999px;
            background: var(--eg-color-primary, #10b981);
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 16px rgba(16, 185, 129, 0.45), 0 2px 6px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .eg-docs-floating-menu-btn:hover {
            background: var(--eg-color-primary-hover, #059669);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.55);
          }
          .eg-docs-floating-menu-btn:active {
            transform: scale(0.96);
          }
        }
      ` }),
        f && /* @__PURE__ */ r(
          "div",
          {
            className: "eg-docs-drawer-backdrop",
            onClick: () => b(!1),
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
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c(
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
                    /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ r("span", { style: { fontSize: "18px" }, children: "📑" }),
                      /* @__PURE__ */ r("span", { style: { fontWeight: 800, fontSize: "15px", color: "var(--eg-text-primary, #0f172a)" }, children: "Documentation" })
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => b(!1),
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
              /* @__PURE__ */ c("div", { style: { flex: 1, overflowY: "auto", padding: "16px 18px", boxSizing: "border-box" }, children: [
                $(!0),
                B.length > 0 && /* @__PURE__ */ c("div", { style: { marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08))" }, children: [
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
                  /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: B.map((_, T) => /* @__PURE__ */ r(
                    "a",
                    {
                      href: `#${_.id}`,
                      onClick: () => b(!1),
                      style: {
                        fontSize: _.level === 2 ? "12.5px" : "11.5px",
                        padding: "4px 8px",
                        paddingLeft: _.level === 2 ? "8px" : "18px",
                        color: "var(--eg-text-secondary, #64748b)",
                        textDecoration: "none",
                        lineHeight: 1.4,
                        borderRadius: "4px"
                      },
                      children: _.text
                    },
                    T
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
            children: $(!1)
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
            children: z ? /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ r("div", { className: "eg-docs-mobile-bar", style: { display: "none", marginBottom: "18px" }, children: /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  onClick: () => b(!0),
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
                    /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0, overflow: "hidden" }, children: [
                      /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { color: "var(--eg-color-primary, #10b981)", flexShrink: 0 }, children: [
                        /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                      ] }),
                      /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "6px", minWidth: 0, overflow: "hidden" }, children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.6px", color: "var(--eg-text-muted, #94a3b8)", flexShrink: 0, fontWeight: 700 }, children: "Topic:" }),
                        /* @__PURE__ */ r("span", { style: { fontWeight: 700, color: "var(--eg-color-primary, #10b981)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: (z == null ? void 0 : z.title) || "Select Article" })
                      ] })
                    ] }),
                    /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "var(--eg-text-secondary, #475569)", flexShrink: 0 }, children: [
                      /* @__PURE__ */ r("span", { children: "Menu" }),
                      /* @__PURE__ */ r("span", { style: { fontSize: "10px" }, children: "▼" })
                    ] })
                  ]
                }
              ) }),
              /* @__PURE__ */ c(
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
                    /* @__PURE__ */ c(
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
                          /* @__PURE__ */ r("span", { children: z.category }),
                          /* @__PURE__ */ r("span", { children: "/" }),
                          /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-primary, #10b981)", fontWeight: 600 }, children: z.title })
                        ]
                      }
                    ),
                    /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          onClick: I,
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
                            /* @__PURE__ */ c("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
                              /* @__PURE__ */ r("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
                            ] }),
                            /* @__PURE__ */ r("span", { children: "Share" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ c(
                        "button",
                        {
                          type: "button",
                          onClick: () => x(!0),
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
                            /* @__PURE__ */ c("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
                  ref: m,
                  className: "eg-markdown-content",
                  dangerouslySetInnerHTML: { __html: j },
                  style: {
                    fontSize: "15.5px",
                    lineHeight: 1.75,
                    color: "var(--eg-text-secondary, #334155)"
                  }
                }
              ),
              /* @__PURE__ */ c(
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
                    A ? /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          a(A.id), window.scrollTo({ top: 0, behavior: "smooth" });
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
                          /* @__PURE__ */ r("div", { style: { fontSize: "13.5px", fontWeight: 700, color: "var(--eg-color-primary, #10b981)" }, children: A.title })
                        ]
                      }
                    ) : /* @__PURE__ */ r("div", {}),
                    R ? /* @__PURE__ */ c(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          a(R.id), window.scrollTo({ top: 0, behavior: "smooth" });
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
                          /* @__PURE__ */ r("div", { style: { fontSize: "13.5px", fontWeight: 700, color: "var(--eg-color-primary, #10b981)" }, children: R.title })
                        ]
                      }
                    ) : /* @__PURE__ */ r("div", {})
                  ]
                }
              )
            ] }) : /* @__PURE__ */ r("p", { style: { color: "var(--eg-text-muted, #94a3b8)" }, children: "No article selected." })
          }
        ),
        /* @__PURE__ */ c(
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
              B.length === 0 ? /* @__PURE__ */ r("span", { style: { fontSize: "12px", color: "#94a3b8" }, children: "Overview" }) : /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: B.map((_, T) => /* @__PURE__ */ r(
                "a",
                {
                  href: `#${_.id}`,
                  style: {
                    fontSize: _.level === 2 ? "12.5px" : "11.5px",
                    paddingLeft: _.level === 2 ? "0px" : "12px",
                    color: "var(--eg-text-secondary, #64748b)",
                    textDecoration: "none",
                    lineHeight: 1.4,
                    transition: "color 0.15s ease"
                  },
                  onMouseEnter: (S) => S.currentTarget.style.color = "var(--eg-color-primary, #10b981)",
                  onMouseLeave: (S) => S.currentTarget.style.color = "var(--eg-text-secondary, #64748b)",
                  children: _.text
                },
                T
              )) })
            ]
          }
        ),
        h && z && /* @__PURE__ */ r(
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
            onClick: () => x(!1),
            children: /* @__PURE__ */ c(
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
                onClick: (_) => _.stopPropagation(),
                children: [
                  /* @__PURE__ */ c(
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
                        /* @__PURE__ */ c("span", { children: [
                          "Raw Markdown Source (",
                          z.title,
                          ")"
                        ] }),
                        /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            onClick: () => x(!1),
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
                      value: z.content
                    }
                  ) }),
                  /* @__PURE__ */ c(
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
                            onClick: () => x(!1),
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
        /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => b(!0),
            className: "eg-docs-floating-menu-btn",
            "aria-label": "Open documentation topics",
            children: [
              /* @__PURE__ */ c("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                /* @__PURE__ */ r("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                /* @__PURE__ */ r("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
              ] }),
              /* @__PURE__ */ r("span", { children: "Topics" })
            ]
          }
        ),
        C && /* @__PURE__ */ r(
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
            children: C
          }
        )
      ]
    }
  );
}, Ua = [
  {
    id: "q-1",
    fileName: "invoice_march_2026.pdf.exe",
    threatName: "Win.Trojan.Agent-99214",
    quarantinedAt: "2026-10-18 14:22:05",
    originalPath: "/home/user/Downloads/invoice_march_2026.pdf.exe",
    size: "1.4 MB"
  },
  {
    id: "q-2",
    fileName: "eicar.com.txt",
    threatName: "Win.Test.EICAR_HDB-1",
    quarantinedAt: "2026-10-19 09:15:30",
    originalPath: "/tmp/eicar.com.txt",
    size: "68 Bytes"
  },
  {
    id: "q-3",
    fileName: "suspicious_payload.py",
    threatName: "Unix.Ransom.LockBit-77",
    quarantinedAt: "2026-10-20 18:40:12",
    originalPath: "/var/tmp/suspicious_payload.py",
    size: "320 KB"
  }
], ps = ({
  appName: t = "Security Suite",
  version: e = "1.0.0",
  className: n = "",
  style: i = {}
}) => {
  const [o, a] = W("dashboard"), [l, s] = W("protected"), [p, d] = W(!1), [g, u] = W("Quick Scan"), [h, x] = W(0), [f, b] = W(""), [C, v] = W(14820), [m, y] = W(0), [w, L] = W(!1), [z, A] = W(Ua), [R, B] = W(null), [j, I] = W("Guest88419203"), [E, H] = W(!1), $ = [
    "/usr/bin/python3.11",
    "/lib/x86_64-linux-gnu/libc.so.6",
    "/etc/ssl/certs/ca-certificates.crt",
    "/var/log/syslog",
    "/home/user/Downloads/package.tar.gz",
    "/usr/local/bin/docker",
    "/opt/google/chrome/chrome",
    "/home/user/.bashrc",
    "/var/cache/apt/archives/lock",
    "/home/user/Documents/project_plan.docx",
    "/usr/lib/systemd/systemd"
  ];
  Y(() => {
    let k;
    return p && (k = setInterval(() => {
      y((D) => D + 1), x((D) => {
        if (D >= 100)
          return d(!1), 100;
        const O = D + 4;
        return v((M) => M + Math.floor(Math.random() * 28) + 12), b($[Math.floor(Math.random() * $.length)]), O;
      });
    }, 250)), () => clearInterval(k);
  }, [p]);
  const U = (k = "Quick Scan") => {
    u(k), x(0), y(0), d(!0), L(!0);
  }, _ = () => {
    d(!1), L(!1);
  }, T = () => {
    R && (A((k) => k.filter((D) => D.id !== R)), B(null));
  }, S = () => {
    R && (A((k) => k.filter((D) => D.id !== R)), B(null));
  }, N = () => {
    const k = Math.floor(1e7 + Math.random() * 9e7);
    I(`Guest${k}`), H(!0);
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-desktop-preview-window desktop-preview-window ${n}`,
      style: {
        maxWidth: "1020px",
        margin: "0 auto",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        background: "#15151c",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.2)",
        fontFamily: 'var(--eg-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: "#f4f4f6",
        ...i
      },
      children: [
        /* @__PURE__ */ c(
          "div",
          {
            style: {
              background: "#0b0b0e",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              userSelect: "none"
            },
            children: [
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ r("span", { style: { width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" } }),
                /* @__PURE__ */ r("span", { style: { width: "12px", height: "12px", borderRadius: "50%", background: "#f59e0b" } }),
                /* @__PURE__ */ r("span", { style: { width: "12px", height: "12px", borderRadius: "50%", background: "#00dc82" } })
              ] }),
              /* @__PURE__ */ c("span", { style: { fontSize: "12.5px", fontWeight: 600, color: "#a0a0ab" }, children: [
                t,
                " v",
                e,
                " — System Security Suite (Qt6 / ClamAV®)"
              ] }),
              /* @__PURE__ */ r("div", { style: { display: "flex", gap: "4px" }, children: ["protected", "warning", "danger"].map((k) => /* @__PURE__ */ r(
                "button",
                {
                  type: "button",
                  onClick: () => s(k),
                  style: {
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: l === k ? k === "protected" ? "#00dc82" : k === "warning" ? "#f59e0b" : "#ef4444" : "rgba(255, 255, 255, 0.08)",
                    color: l === k ? "#000" : "#888",
                    fontWeight: 700,
                    cursor: "pointer"
                  },
                  children: k
                },
                k
              )) })
            ]
          }
        ),
        /* @__PURE__ */ c("div", { style: { display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "480px" }, children: [
          /* @__PURE__ */ c(
            "div",
            {
              style: {
                background: "#101015",
                padding: "20px 12px",
                borderRight: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              },
              children: [
                /* @__PURE__ */ r("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
                  { id: "dashboard", label: "Dashboard", icon: "📊" },
                  { id: "scan", label: "Scan Engine", icon: "🔍" },
                  { id: "quarantine", label: "Quarantine", icon: "☣️" },
                  { id: "logs", label: "Scan Logs", icon: "📜" },
                  { id: "settings", label: "Settings", icon: "⚙️" }
                ].map((k) => {
                  const D = o === k.id;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      onClick: () => a(k.id),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "none",
                        background: D ? "rgba(0, 220, 130, 0.15)" : "transparent",
                        color: D ? "#00dc82" : "#a0a0ab",
                        fontWeight: D ? 700 : 500,
                        fontSize: "13.5px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease"
                      },
                      children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "16px" }, children: k.icon }),
                        /* @__PURE__ */ r("span", { children: k.label })
                      ]
                    },
                    k.id
                  );
                }) }),
                /* @__PURE__ */ c(
                  "div",
                  {
                    style: {
                      padding: "12px",
                      background: "#15151c",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.05)"
                    },
                    children: [
                      /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "#6e6e7c", display: "block", textTransform: "uppercase", fontWeight: 700 }, children: "Engine Status" }),
                      /* @__PURE__ */ r(
                        "span",
                        {
                          style: {
                            fontSize: "12.5px",
                            color: l === "danger" ? "#ef4444" : "#00dc82",
                            fontWeight: 600
                          },
                          children: l === "danger" ? "✕ Offline (Error)" : "● Online (v0.103.11)"
                        }
                      )
                    ]
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ c("div", { style: { padding: "28px", background: "#15151c", overflowY: "auto" }, children: [
            o === "dashboard" && /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c(
                "div",
                {
                  style: {
                    background: l === "protected" ? "rgba(0, 220, 130, 0.08)" : l === "warning" ? "rgba(234, 179, 8, 0.08)" : "rgba(239, 68, 68, 0.08)",
                    border: `1px solid ${l === "protected" ? "rgba(0, 220, 130, 0.3)" : l === "warning" ? "rgba(234, 179, 8, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                    borderRadius: "10px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    marginBottom: "24px"
                  },
                  children: [
                    /* @__PURE__ */ r("div", { style: { fontSize: "38px" }, children: l === "protected" ? "🛡️" : l === "warning" ? "⚠️" : "❌" }),
                    /* @__PURE__ */ c("div", { style: { flex: 1 }, children: [
                      /* @__PURE__ */ r(
                        "h4",
                        {
                          style: {
                            margin: "0 0 4px",
                            fontSize: "18px",
                            color: l === "protected" ? "#00dc82" : l === "warning" ? "#f59e0b" : "#ef4444",
                            fontWeight: 800
                          },
                          children: l === "protected" ? "System Protected" : l === "warning" ? "System at Risk (Real-Time Guard Disabled)" : "Engine Not Detected"
                        }
                      ),
                      /* @__PURE__ */ r("p", { style: { margin: 0, fontSize: "13px", color: "#a0a0ab" }, children: l === "protected" ? "Real-time filesystem protection is active. Virus signatures are up to date." : l === "warning" ? "Real-Time Guard is turned off. Background monitoring is currently halted." : "ClamAV daemon was not found in PATH or configured folders. Configure engine in Settings." })
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => U("Quick Scan"),
                        style: {
                          background: l === "danger" ? "#ef4444" : "#00dc82",
                          color: "#0b0b0e",
                          fontWeight: 700,
                          fontSize: "13.5px",
                          padding: "10px 18px",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap"
                        },
                        children: l === "danger" ? "Configure..." : "Scan Now →"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ c("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }, children: [
                /* @__PURE__ */ c("div", { style: { background: "#1b1b24", padding: "16px", borderRadius: "8px" }, children: [
                  /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "#6e6e7c", textTransform: "uppercase", fontWeight: 700 }, children: "Signatures Database" }),
                  /* @__PURE__ */ r("p", { style: { margin: "6px 0 0", fontSize: "18px", fontWeight: 800, color: "#f4f4f6" }, children: "8,650,420 defs" })
                ] }),
                /* @__PURE__ */ c("div", { style: { background: "#1b1b24", padding: "16px", borderRadius: "8px" }, children: [
                  /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "#6e6e7c", textTransform: "uppercase", fontWeight: 700 }, children: "Last Scanned Items" }),
                  /* @__PURE__ */ c("p", { style: { margin: "6px 0 0", fontSize: "18px", fontWeight: 800, color: "#f4f4f6" }, children: [
                    C.toLocaleString(),
                    " files"
                  ] })
                ] }),
                /* @__PURE__ */ c("div", { style: { background: "#1b1b24", padding: "16px", borderRadius: "8px" }, children: [
                  /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "#6e6e7c", textTransform: "uppercase", fontWeight: 700 }, children: "Active Quarantine" }),
                  /* @__PURE__ */ c("p", { style: { margin: "6px 0 0", fontSize: "18px", fontWeight: 800, color: "#ef4444" }, children: [
                    z.length,
                    " threats isolated"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ c("div", { style: { display: "flex", gap: "12px" }, children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      a("scan"), U("Full System Scan");
                    },
                    style: {
                      background: "#00dc82",
                      color: "#0b0b0e",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer"
                    },
                    children: "Full System Audit"
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: () => a("quarantine"),
                    style: {
                      background: "rgba(255, 255, 255, 0.08)",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "13.5px",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      cursor: "pointer"
                    },
                    children: [
                      "View Quarantine (",
                      z.length,
                      ")"
                    ]
                  }
                )
              ] })
            ] }),
            o === "scan" && /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ r("h3", { style: { margin: "0 0 16px", fontSize: "18px", fontWeight: 700 }, children: "Antivirus Scan Profiles" }),
              /* @__PURE__ */ r("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "24px" }, children: [
                { title: "Quick Scan", desc: "High-priority system binaries & memory areas", icon: "⚡" },
                { title: "Full System Scan", desc: "Entire root filesystem, all attached drives & storage", icon: "💽" },
                { title: "Memory Scan", desc: "Running process spaces & active shared libraries", icon: "🧠" },
                { title: "Custom Path Scan", desc: "Inspect user-selected files, directories, or archives", icon: "📂" }
              ].map((k) => /* @__PURE__ */ c(
                "div",
                {
                  style: {
                    background: "#1b1b24",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "12px"
                  },
                  children: [
                    /* @__PURE__ */ c("div", { children: [
                      /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }, children: [
                        /* @__PURE__ */ r("span", { style: { fontSize: "20px" }, children: k.icon }),
                        /* @__PURE__ */ r("h4", { style: { margin: 0, fontSize: "15px", fontWeight: 700 }, children: k.title })
                      ] }),
                      /* @__PURE__ */ r("p", { style: { margin: 0, fontSize: "12.5px", color: "#a0a0ab" }, children: k.desc })
                    ] }),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => U(k.title),
                        disabled: p,
                        style: {
                          background: "rgba(0, 220, 130, 0.15)",
                          border: "1px solid #00dc82",
                          color: "#00dc82",
                          fontWeight: 700,
                          fontSize: "12.5px",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: p ? "not-allowed" : "pointer",
                          alignSelf: "flex-start"
                        },
                        children: "Launch Profile"
                      }
                    )
                  ]
                },
                k.title
              )) })
            ] }),
            o === "quarantine" && /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                /* @__PURE__ */ r("h3", { style: { margin: 0, fontSize: "18px", fontWeight: 700 }, children: "Isolated Threat Quarantine" }),
                /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px" }, children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: T,
                      disabled: !R,
                      style: {
                        background: "rgba(59, 130, 246, 0.2)",
                        border: "1px solid #3b82f6",
                        color: "#60a5fa",
                        fontSize: "12.5px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        cursor: R ? "pointer" : "not-allowed",
                        opacity: R ? 1 : 0.4
                      },
                      children: "Restore File"
                    }
                  ),
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: S,
                      disabled: !R,
                      style: {
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid #ef4444",
                        color: "#ef4444",
                        fontSize: "12.5px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        cursor: R ? "pointer" : "not-allowed",
                        opacity: R ? 1 : 0.4
                      },
                      children: "Delete Permanently"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ r("div", { style: { background: "#101015", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255, 255, 255, 0.08)" }, children: /* @__PURE__ */ c("table", { style: { width: "100%", fontSize: "12.5px", borderCollapse: "collapse", textAlign: "left" }, children: [
                /* @__PURE__ */ r("thead", { children: /* @__PURE__ */ c("tr", { style: { background: "#0b0b0e", color: "#a0a0ab", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }, children: [
                  /* @__PURE__ */ r("th", { style: { padding: "10px 14px" }, children: "File Name" }),
                  /* @__PURE__ */ r("th", { style: { padding: "10px 14px" }, children: "Threat Classification" }),
                  /* @__PURE__ */ r("th", { style: { padding: "10px 14px" }, children: "Quarantined Date" }),
                  /* @__PURE__ */ r("th", { style: { padding: "10px 14px" }, children: "Size" })
                ] }) }),
                /* @__PURE__ */ r("tbody", { children: z.length === 0 ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", { colSpan: 4, style: { padding: "24px", textAlign: "center", color: "#6e6e7c" }, children: "Quarantine vault is empty. No active threats detected." }) }) : z.map((k) => {
                  const D = k.id === R;
                  return /* @__PURE__ */ c(
                    "tr",
                    {
                      onClick: () => B(k.id),
                      style: {
                        background: D ? "rgba(0, 220, 130, 0.12)" : "transparent",
                        cursor: "pointer",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.04)"
                      },
                      children: [
                        /* @__PURE__ */ r("td", { style: { padding: "10px 14px", fontWeight: 600, color: "#f4f4f6" }, children: k.fileName }),
                        /* @__PURE__ */ r("td", { style: { padding: "10px 14px", color: "#ef4444", fontWeight: 600 }, children: k.threatName }),
                        /* @__PURE__ */ r("td", { style: { padding: "10px 14px", color: "#a0a0ab" }, children: k.quarantinedAt }),
                        /* @__PURE__ */ r("td", { style: { padding: "10px 14px", color: "#6e6e7c" }, children: k.size })
                      ]
                    },
                    k.id
                  );
                }) })
              ] }) })
            ] }),
            o === "logs" && /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                /* @__PURE__ */ r("h3", { style: { margin: 0, fontSize: "18px", fontWeight: 700 }, children: "Engine Log Terminal" }),
                /* @__PURE__ */ r("span", { style: { fontSize: "11px", color: "#6e6e7c" }, children: "/var/log/clamav/clamd.log" })
              ] }),
              /* @__PURE__ */ c(
                "div",
                {
                  style: {
                    background: "#101015",
                    borderRadius: "8px",
                    padding: "16px",
                    fontFamily: "var(--eg-font-mono, monospace)",
                    fontSize: "12px",
                    color: "#a0a0ab",
                    height: "280px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  },
                  children: [
                    /* @__PURE__ */ c("div", { children: [
                      "[INFO] ",
                      t,
                      " initializing daemon link..."
                    ] }),
                    /* @__PURE__ */ r("div", { children: "[INFO] ClamAV® daemon engine v0.103.11 loaded" }),
                    /* @__PURE__ */ r("div", { children: "[INFO] Virus database daily.cvd v27140 loaded (8,650,420 signatures)" }),
                    /* @__PURE__ */ r("div", { children: "[SCAN] Automated fast audit initialized on root partition" }),
                    /* @__PURE__ */ r("div", { children: "[WARN] Found suspicious binary pattern in /home/user/Downloads/invoice_march_2026.pdf.exe" }),
                    /* @__PURE__ */ r("div", { style: { color: "#ef4444" }, children: "[ALERT] Threat detected: Win.Trojan.Agent-99214" }),
                    /* @__PURE__ */ r("div", { style: { color: "#00dc82" }, children: "[ACTION] Successfully relocated threat to /var/lib/clamav/quarantine/" }),
                    /* @__PURE__ */ r("div", { children: "[SCAN] Real-time filesystem monitor daemon running on port 3310" })
                  ]
                }
              )
            ] }),
            o === "settings" && /* @__PURE__ */ c("div", { children: [
              /* @__PURE__ */ r("h3", { style: { margin: "0 0 16px", fontSize: "18px", fontWeight: 700 }, children: "Security Preferences" }),
              /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", gap: "16px", fontSize: "13.5px" }, children: [
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("label", { style: { fontSize: "12px", color: "#a0a0ab", display: "block", marginBottom: "6px" }, children: "ClamAV Engine Binary Path" }),
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "text",
                      defaultValue: "/usr/bin/clamscan",
                      style: {
                        width: "100%",
                        maxWidth: "440px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        background: "#101015",
                        color: "#fff",
                        fontSize: "13px",
                        fontFamily: "monospace"
                      }
                    }
                  )
                ] }),
                /* @__PURE__ */ c("label", { style: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }, children: [
                  /* @__PURE__ */ r("input", { type: "checkbox", defaultChecked: !0 }),
                  /* @__PURE__ */ r("span", { children: "Automatic background database updates (FreshClam daily synchronization)" })
                ] }),
                /* @__PURE__ */ c("label", { style: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }, children: [
                  /* @__PURE__ */ r("input", { type: "checkbox", defaultChecked: !0 }),
                  /* @__PURE__ */ r("span", { children: "Scan archive and compressed package contents (.zip, .tar.gz, .iso, .deb)" })
                ] }),
                /* @__PURE__ */ c("label", { style: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }, children: [
                  /* @__PURE__ */ r("input", { type: "checkbox", defaultChecked: !0 }),
                  /* @__PURE__ */ r("span", { children: "Automatically isolate detected threats into encrypted Quarantine" })
                ] }),
                /* @__PURE__ */ c("div", { style: { borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }, children: [
                  /* @__PURE__ */ r("label", { style: { fontSize: "12px", color: "#a0a0ab", display: "block", marginBottom: "6px" }, children: "Telemetry & Privacy Control (One-Time Guest Identifier)" }),
                  /* @__PURE__ */ c("div", { style: { display: "flex", gap: "10px", alignItems: "center" }, children: [
                    /* @__PURE__ */ r(
                      "input",
                      {
                        type: "text",
                        value: j,
                        readOnly: !0,
                        style: {
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          background: "#101015",
                          color: "#00dc82",
                          fontSize: "13px",
                          fontFamily: "monospace",
                          width: "200px"
                        }
                      }
                    ),
                    /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: N,
                        disabled: E,
                        style: {
                          padding: "8px 14px",
                          borderRadius: "6px",
                          border: "none",
                          background: E ? "#334155" : "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                          fontSize: "12.5px",
                          cursor: E ? "not-allowed" : "pointer"
                        },
                        children: E ? "Guest ID Generated" : "Generate New ID"
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        w && /* @__PURE__ */ r(
          "div",
          {
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "20px"
            },
            children: /* @__PURE__ */ c(
              "div",
              {
                style: {
                  background: "#15151c",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "12px",
                  padding: "28px",
                  maxWidth: "520px",
                  width: "100%",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.8)"
                },
                children: [
                  /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }, children: [
                    /* @__PURE__ */ r("h3", { style: { margin: 0, fontSize: "18px", fontWeight: 800 }, children: p ? `Running ${g}...` : "Scan Completed!" }),
                    /* @__PURE__ */ c("span", { style: { fontSize: "12px", color: "#a0a0ab" }, children: [
                      "Elapsed: ",
                      m,
                      "s"
                    ] })
                  ] }),
                  /* @__PURE__ */ r("div", { style: { background: "#101015", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "12px" }, children: /* @__PURE__ */ r(
                    "div",
                    {
                      style: {
                        height: "100%",
                        width: `${h}%`,
                        background: "#00dc82",
                        transition: "width 0.2s ease"
                      }
                    }
                  ) }),
                  /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#a0a0ab", marginBottom: "16px" }, children: [
                    /* @__PURE__ */ c("span", { children: [
                      "Progress: ",
                      h,
                      "%"
                    ] }),
                    /* @__PURE__ */ c("span", { children: [
                      "Scanned Files: ",
                      C.toLocaleString()
                    ] })
                  ] }),
                  p && /* @__PURE__ */ c(
                    "div",
                    {
                      style: {
                        fontSize: "11.5px",
                        fontFamily: "monospace",
                        color: "#6e6e7c",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "20px"
                      },
                      children: [
                        "Target: ",
                        f
                      ]
                    }
                  ),
                  /* @__PURE__ */ r("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px" }, children: p ? /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: _,
                      style: {
                        padding: "8px 16px",
                        borderRadius: "6px",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid #ef4444",
                        color: "#ef4444",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer"
                      },
                      children: "Cancel Scan"
                    }
                  ) : /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => L(!1),
                      style: {
                        padding: "8px 20px",
                        borderRadius: "6px",
                        background: "#00dc82",
                        border: "none",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer"
                      },
                      children: "Close Summary"
                    }
                  ) })
                ]
              }
            )
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
function Re(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e ^= t.charCodeAt(n), e = Math.imul(e, 16777619);
  return (e >>> 0).toString(16);
}
function Qe() {
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
    return Re(i);
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
    return Re(l);
  } catch {
    return "fallback_core_hardware";
  }
}
function Je() {
  if (typeof window > "u") return "unknown_hardware";
  try {
    const t = window.screen ? `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth || 24}` : "", e = typeof Intl < "u" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "", n = (/* @__PURE__ */ new Date()).getTimezoneOffset(), i = typeof navigator < "u" ? (navigator.platform || "").replace(/\s+/g, "").toLowerCase() : "", o = typeof navigator < "u" && navigator.hardwareConcurrency || 0, a = typeof navigator < "u" && navigator.maxTouchPoints || 0;
    let l = "";
    try {
      if (typeof document < "u") {
        const p = document.createElement("canvas"), d = p.getContext("webgl") || p.getContext("experimental-webgl");
        if (d) {
          const g = d.getExtension("WEBGL_debug_renderer_info");
          if (g) {
            const u = String(d.getParameter(g.UNMASKED_RENDERER_WEBGL) || "");
            l = qa(u);
          }
        }
      }
    } catch {
    }
    const s = [t, e, n, i, o, a, l].join("###");
    return Re(s);
  } catch {
    return "fallback_hardware";
  }
}
function At(t, e, n) {
  const i = (e || "").trim().toLowerCase(), o = (n || "").replace(/\D/g, ""), a = (t || "").trim().toLowerCase();
  return {
    emailHash: i ? Re(i) : "",
    phoneHash: o ? Re(o) : "",
    nameHash: a ? Re(a) : ""
  };
}
const ht = "eg_contact_submissions_v2", Fe = "eg_rl_dev_", Oe = "eg_rl_hw_", Ve = "eg_rl_hwcore_", Ue = "eg_rl_em_", Ge = "eg_rl_ph_", ut = "c_rl_hw_", ft = "c_rl_hwcore_", xt = "c_rl_dev_", _t = "c_rl_em_", Mt = "c_rl_ph_";
function yn(t = "lastMessageTime", e = 24, n = !1) {
  if (typeof window > "u") return { allowed: !0 };
  const i = typeof t == "string" ? { rateLimitKey: t, rateLimitHours: e } : t, o = i.rateLimitHours ?? 24;
  if (o <= 0) return { allowed: !0 };
  const a = Date.now(), l = o * 60 * 60 * 1e3, s = i.rateLimitKey || "lastMessageTime", p = Qe(), d = Je(), g = Xe(), { emailHash: u, phoneHash: h } = At(i.name, i.email, i.contact);
  let x = 0, f = "general";
  try {
    const b = localStorage.getItem(s) || sessionStorage.getItem(s);
    if (b) {
      const C = parseInt(b, 10);
      !isNaN(C) && a - C < l && C > x && (x = C, f = "general");
    }
  } catch {
  }
  try {
    const b = `${Fe}${p}`, C = localStorage.getItem(b) || sessionStorage.getItem(b);
    if (C) {
      const v = parseInt(C, 10);
      !isNaN(v) && a - v < l && v > x && (x = v, f = "machine");
    }
  } catch {
  }
  try {
    const b = `${Oe}${d}`, C = localStorage.getItem(b) || sessionStorage.getItem(b);
    if (C) {
      const v = parseInt(C, 10);
      !isNaN(v) && a - v < l && v > x && (x = v, f = "machine");
    }
  } catch {
  }
  try {
    const b = `${Ve}${g}`, C = localStorage.getItem(b) || sessionStorage.getItem(b);
    if (C) {
      const v = parseInt(C, 10);
      !isNaN(v) && a - v < l && v > x && (x = v, f = "machine");
    }
  } catch {
  }
  if (u)
    try {
      const b = `${Ue}${u}`, C = localStorage.getItem(b) || sessionStorage.getItem(b);
      if (C) {
        const v = parseInt(C, 10);
        !isNaN(v) && a - v < l && v > x && (x = v, f = "email");
      }
    } catch {
    }
  if (h)
    try {
      const b = `${Ge}${h}`, C = localStorage.getItem(b) || sessionStorage.getItem(b);
      if (C) {
        const v = parseInt(C, 10);
        !isNaN(v) && a - v < l && v > x && (x = v, f = "contact");
      }
    } catch {
    }
  try {
    const b = localStorage.getItem(ht);
    if (b) {
      const C = JSON.parse(b);
      if (Array.isArray(C))
        for (const v of C)
          !v.timestamp || a - v.timestamp >= l || ((v.machineHash && v.machineHash === p || v.hardwareHash && v.hardwareHash === d || v.hardwareCoreHash && v.hardwareCoreHash === g) && v.timestamp > x && (x = v.timestamp, f = "machine"), u && v.emailHash && v.emailHash === u && v.timestamp > x && (x = v.timestamp, f = "email"), h && v.phoneHash && v.phoneHash === h && v.timestamp > x && (x = v.timestamp, f = "contact"));
    }
  } catch {
  }
  if (x > 0) {
    const b = a - x, C = l - b, v = Math.max(1, Math.ceil(C / (60 * 60 * 1e3))), m = Math.max(1, Math.ceil(C / (60 * 1e3)));
    let y = `You have already sent a message recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`;
    return f === "email" ? y = `A message was already submitted using this email address recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "contact" ? y = `A message was already submitted using this contact number recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "machine" && (y = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`), {
      allowed: !1,
      hoursRemaining: v,
      minutesRemaining: m,
      reason: f,
      message: y
    };
  }
  return { allowed: !0 };
}
async function Ka(t, e = {}) {
  if (!t || typeof t.collection != "function")
    return { allowed: !0 };
  const n = e.rateLimitHours ?? 24;
  if (n <= 0) return { allowed: !0 };
  const i = e.analyticsCollection || "visitor_analytics", o = Date.now(), a = n * 60 * 60 * 1e3, l = Je(), s = Xe(), p = Qe(), { emailHash: d, phoneHash: g } = At(e.name, e.email, e.contact), u = t.collection(i), h = [
    { key: `${ut}${l}`, reason: "machine", promise: u.doc(`${ut}${l}`).get().catch(() => null) },
    { key: `${ft}${s}`, reason: "machine", promise: u.doc(`${ft}${s}`).get().catch(() => null) },
    { key: `${xt}${p}`, reason: "machine", promise: u.doc(`${xt}${p}`).get().catch(() => null) }
  ];
  d && h.push({
    key: `${_t}${d}`,
    reason: "email",
    promise: u.doc(`${_t}${d}`).get().catch(() => null)
  }), g && h.push({
    key: `${Mt}${g}`,
    reason: "contact",
    promise: u.doc(`${Mt}${g}`).get().catch(() => null)
  });
  let x = 0, f = "machine";
  try {
    const b = await Promise.all(h.map((C) => C.promise));
    for (let C = 0; C < b.length; C++) {
      const v = b[C];
      if (v && (typeof v.exists == "function" ? v.exists() : v.exists)) {
        const m = v.data() || {}, y = typeof m.timestamp == "number" ? m.timestamp : 0;
        y > 0 && o - y < a && y > x && (x = y, f = h[C].reason);
      }
    }
  } catch {
    return { allowed: !0 };
  }
  if (x > 0) {
    const b = o - x, C = a - b, v = Math.max(1, Math.ceil(C / (60 * 60 * 1e3))), m = Math.max(1, Math.ceil(C / (60 * 1e3)));
    let y = `You have already sent a message recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`;
    f === "email" ? y = `A message was already submitted using this email address recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "contact" ? y = `A message was already submitted using this contact number recently. Please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending another message.` : f === "machine" && (y = `A message was already sent from this device/browser recently. To minimize spam, please wait approximately ${v} hour${v === 1 ? "" : "s"} before sending again.`);
    try {
      ze({
        name: e.name,
        email: e.email,
        contact: e.contact
      });
    } catch {
    }
    return {
      allowed: !1,
      hoursRemaining: v,
      minutesRemaining: m,
      reason: f,
      message: y
    };
  }
  return { allowed: !0 };
}
async function Za(t, e = {}) {
  if (!t || typeof t.collection != "function") return;
  const n = e.analyticsCollection || "visitor_analytics", i = Je(), o = Xe(), a = Qe(), { emailHash: l, phoneHash: s } = At(e.name, e.email, e.contact), p = Date.now(), d = {
    timestamp: p,
    type: "contact_rate_limit",
    appName: e.appName || (typeof window < "u" ? window.location.hostname : "web-app"),
    createdAt: new Date(p).toISOString()
  }, g = t.collection(n), u = [
    g.doc(`${ut}${i}`).set(d).catch(() => {
    }),
    g.doc(`${ft}${o}`).set(d).catch(() => {
    }),
    g.doc(`${xt}${a}`).set(d).catch(() => {
    })
  ];
  l && u.push(g.doc(`${_t}${l}`).set(d).catch(() => {
  })), s && u.push(g.doc(`${Mt}${s}`).set(d).catch(() => {
  }));
  try {
    await Promise.allSettled(u);
  } catch {
  }
}
function ze(t = "lastMessageTime") {
  if (typeof window > "u") return;
  const e = typeof t == "string" ? { rateLimitKey: t } : t || {}, n = e.rateLimitKey || "lastMessageTime", i = Date.now(), o = i.toString(), a = Qe(), l = Je(), s = Xe(), { emailHash: p, phoneHash: d, nameHash: g } = At(e.name, e.email, e.contact);
  try {
    localStorage.setItem(n, o), sessionStorage.setItem(n, o), localStorage.setItem(`${Fe}${a}`, o), sessionStorage.setItem(`${Fe}${a}`, o), localStorage.setItem(`${Oe}${l}`, o), sessionStorage.setItem(`${Oe}${l}`, o), localStorage.setItem(`${Ve}${s}`, o), sessionStorage.setItem(`${Ve}${s}`, o), p && (localStorage.setItem(`${Ue}${p}`, o), sessionStorage.setItem(`${Ue}${p}`, o)), d && (localStorage.setItem(`${Ge}${d}`, o), sessionStorage.setItem(`${Ge}${d}`, o));
    const u = localStorage.getItem(ht);
    let h = [];
    if (u)
      try {
        h = JSON.parse(u), Array.isArray(h) || (h = []);
      } catch {
        h = [];
      }
    const x = i - 48 * 60 * 60 * 1e3;
    h = h.filter((f) => f.timestamp && f.timestamp > x), h.push({
      timestamp: i,
      machineHash: a,
      hardwareHash: l,
      hardwareCoreHash: s,
      emailHash: p || void 0,
      phoneHash: d || void 0,
      nameHash: g || void 0
    }), localStorage.setItem(ht, JSON.stringify(h.slice(-30)));
  } catch {
  }
}
async function gs(t = "lastMessageTime", e, n = "visitor_analytics") {
  if (!(typeof window > "u"))
    try {
      localStorage.removeItem(t), sessionStorage.removeItem(t), localStorage.removeItem(ht);
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const o = localStorage.key(i);
        o && (o.startsWith(Fe) || o.startsWith(Oe) || o.startsWith(Ve) || o.startsWith(Ue) || o.startsWith(Ge)) && localStorage.removeItem(o);
      }
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const o = sessionStorage.key(i);
        o && (o.startsWith(Fe) || o.startsWith(Oe) || o.startsWith(Ve) || o.startsWith(Ue) || o.startsWith(Ge)) && sessionStorage.removeItem(o);
      }
      if (e && typeof e.collection == "function") {
        const i = Je(), o = Xe(), a = Qe(), l = e.collection(n);
        await Promise.allSettled([
          l.doc(`${ut}${i}`).delete().catch(() => {
          }),
          l.doc(`${ft}${o}`).delete().catch(() => {
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
async function bn(t, e = "messages", n) {
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
        const d = n ? n(p) : {
          name: p.name || "Anonymous",
          email: p.email || "",
          contact: p.contact || "",
          message: p.message || "",
          createdAt: p.createdAt ? new Date(p.createdAt) : /* @__PURE__ */ new Date()
        };
        await t.collection(e).add(d), l++;
      } catch {
        s.push(p);
      }
    return s.length === 0 ? localStorage.removeItem(i) : localStorage.setItem(i, JSON.stringify(s)), l;
  } catch {
    return 0;
  }
}
async function Ya(t, e = {}) {
  var m, y, w, L, z;
  const n = e.collectionName || "messages", i = e.rateLimitKey || "lastMessageTime", o = e.rateLimitHours ?? 24, a = e.allowLocalhostBypass ?? !1, l = yn({
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
  const s = (t.name || "").trim(), p = (t.email || "").trim(), d = (t.contact || "").trim(), g = (t.message || "").trim();
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
  const h = s.slice(0, 100), x = p.slice(0, 255), f = d.slice(0, 50), b = g.slice(0, 5e3);
  if (e.onSubmit)
    try {
      const A = await e.onSubmit({
        ...t,
        name: h,
        email: x,
        contact: f,
        message: b,
        appName: e.appName || t.appName || (typeof window < "u" ? window.location.hostname : "web-app")
      });
      return ze({
        name: h,
        email: x,
        contact: f,
        rateLimitKey: i
      }), A && typeof A == "object" && "success" in A ? A : {
        success: !0,
        message: "Thank you for reaching out! Your message has been received and we will get back to you shortly."
      };
    } catch (A) {
      return {
        success: !1,
        message: (A == null ? void 0 : A.message) || "Failed to submit inquiry via custom handler."
      };
    }
  let C = e.db;
  if (!C && e.firebaseConfig && e.firebaseConfig.apiKey)
    try {
      C = (await Le(e.firebaseConfig, e.appName)).db;
    } catch (A) {
      console.warn("[contactService] Failed to initialize Firebase with provided config:", A);
    }
  if (!C && typeof window < "u" && (C = window.db || ((y = (m = window.firebase) == null ? void 0 : m.firestore) == null ? void 0 : y.call(m)), !C && ((w = window.firebaseApp) != null && w.firestore) && (C = window.firebaseApp.firestore())), C && typeof C.collection == "function")
    try {
      const A = typeof window < "u" ? window.firebase : null, R = (z = (L = A == null ? void 0 : A.firestore) == null ? void 0 : L.FieldValue) != null && z.serverTimestamp ? A.firestore.FieldValue.serverTimestamp() : /* @__PURE__ */ new Date(), B = {
        name: h,
        email: x,
        contact: f,
        message: b,
        appName: e.appName || t.appName || (typeof window < "u" ? window.location.hostname : "web-app"),
        createdAt: R
      }, j = e.transformPayload ? e.transformPayload(B) : {
        name: h,
        email: x,
        contact: f,
        message: b,
        createdAt: R
      }, I = await Ka(C, {
        name: h,
        email: x,
        contact: f,
        rateLimitHours: o,
        analyticsCollection: e.analyticsCollection || "visitor_analytics"
      });
      if (!I.allowed)
        return {
          success: !1,
          rateLimited: !0,
          message: I.message || "You have sent a message recently. Please try again tomorrow."
        };
      const E = await C.collection(n).add(j);
      return ze({
        name: h,
        email: x,
        contact: f,
        rateLimitKey: i
      }), Za(C, {
        name: h,
        email: x,
        contact: f,
        appName: e.appName || t.appName,
        analyticsCollection: e.analyticsCollection || "visitor_analytics"
      }).catch(() => {
      }), bn(C, n, e.transformPayload).catch(() => {
      }), {
        success: !0,
        docId: (E == null ? void 0 : E.id) || "submitted",
        message: "Thank you for reaching out! Your message has been received and we will get back to you shortly."
      };
    } catch (A) {
      return console.error("[contactService] Firestore write failed:", A), typeof navigator < "u" && !navigator.onLine ? (xr(t, h, x, f, b, e), ze({
        name: h,
        email: x,
        contact: f,
        rateLimitKey: i
      }), {
        success: !0,
        offlineFallback: !0,
        message: "You appear to be offline. Your message has been saved and will be sent automatically once reconnected."
      }) : {
        success: !1,
        message: A != null && A.message ? `Failed to deliver message: ${A.message}` : "Failed to deliver message to server. Please try again later."
      };
    }
  return typeof navigator < "u" && !navigator.onLine ? (xr(t, h, x, f, b, e), ze({
    name: h,
    email: x,
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
const hs = ({
  title: t = "Any message?",
  subtitle: e,
  submitButtonText: n = "Send Enquiry ⮠",
  requireContactNumber: i = !0,
  enableCaptcha: o = !0,
  lazyCaptcha: a = !0,
  rateLimitHours: l = 24,
  rateLimitKey: s = "lastMessageTime",
  maxMessageLength: p = 2e3,
  firestoreCollection: d,
  analyticsCollection: g,
  db: u,
  firebaseConfig: h,
  appName: x,
  allowLocalhostBypass: f = !1,
  transformPayload: b,
  onSubmit: C,
  channels: v,
  channelsTitle: m = "Connect on Other Platforms",
  channelsSubtitle: y,
  successTitle: w = "Thank You for Contacting Us!",
  successMessage: L = "Your message has been received. We will get back to you shortly.",
  className: z = "",
  style: A
}) => {
  var K, re, ge;
  const R = wt(), B = u || R.db, j = h || ((K = R.config) != null && K.apiKey ? R.config : void 0), I = x || (R.appName !== "web-app" ? R.appName : "web-app"), E = d || ((re = R.collections) == null ? void 0 : re.messages) || "messages", H = g || ((ge = R.collections) == null ? void 0 : ge.analytics) || "visitor_analytics", [$, U] = W(""), [_, T] = W(""), [S, N] = W(""), [k, D] = W(""), [O, M] = W(""), [P, V] = W(null), [G, Q] = W(!a), [F, oe] = W(!1), [ie, ae] = W(null), [de, Be] = W(!1);
  Y(() => {
    let J = !0;
    async function ue() {
      try {
        let fe = B;
        !fe && (j != null && j.apiKey) && (fe = (await Le(j, I === "web-app" ? void 0 : I)).db), J && fe && await bn(fe, E, b);
      } catch {
      }
    }
    return ue(), () => {
      J = !1;
    };
  }, [B, j, I, E, b]);
  const pe = te(() => {
    V(Ga()), M("");
  }, []), Se = () => {
    o && !G && (Q(!0), P || pe());
  };
  Y(() => {
    o && G && !P && pe();
  }, [o, G, P, pe]);
  const et = async (J) => {
    J.preventDefault(), ae(null);
    const ue = yn({
      name: $.trim(),
      email: _.trim(),
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
      if (!P) {
        pe(), ae({ type: "error", message: "Please complete the anti-spam verification challenge." });
        return;
      }
      const ce = parseInt(O.trim(), 10);
      if (isNaN(ce) || ce !== P.expected) {
        ae({ type: "error", message: "Incorrect anti-spam verification answer. Please try again." }), pe();
        return;
      }
    }
    if (!$.trim() || !_.trim() || !k.trim()) {
      ae({ type: "error", message: "Please fill in all required fields (Name, Email, Message)." });
      return;
    }
    if (i && !S.trim()) {
      ae({ type: "error", message: "Please provide a valid contact phone number." });
      return;
    }
    oe(!0);
    const fe = {
      name: $.trim(),
      email: _.trim(),
      contact: S.trim(),
      message: k.trim(),
      appName: I
    };
    try {
      let ce;
      C ? (ce = await C(fe), ce.success && ze({
        name: $.trim(),
        email: _.trim(),
        contact: S.trim(),
        rateLimitKey: s
      })) : ce = await Ya(fe, {
        collectionName: E,
        analyticsCollection: H,
        rateLimitKey: s,
        rateLimitHours: l,
        db: B,
        firebaseConfig: j,
        appName: I,
        allowLocalhostBypass: f,
        transformPayload: b
      }), ce.success ? (Be(!0), ae({
        type: "success",
        message: ce.message || L
      }), U(""), T(""), N(""), D(""), M(""), a && Q(!1)) : (ae({
        type: "error",
        message: ce.message || "Failed to submit inquiry. Please try again later."
      }), o && pe());
    } catch (ce) {
      ae({
        type: "error",
        message: (ce == null ? void 0 : ce.message) || "An unexpected error occurred. Please try again later."
      }), o && pe();
    } finally {
      oe(!1);
    }
  };
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-contact-portal ${z}`,
      style: {
        display: "grid",
        gridTemplateColumns: v && v.length > 0 ? "minmax(0, 1.4fr) minmax(0, 1fr)" : "1fr",
        gap: "32px",
        alignItems: "start",
        ...A
      },
      children: [
        /* @__PURE__ */ r("style", { children: `
        .eg-contact-portal-card {
          background: var(--eg-bg-surface, #ffffff);
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1));
          border-radius: var(--eg-radius-lg, 14px);
          padding: clamp(20px, 3.5vw, 36px);
          box-shadow: var(--eg-shadow-sm, 0 1px 4px rgba(0, 0, 0, 0.06));
          box-sizing: border-box;
        }
        .eg-contact-input-group {
          position: relative;
          margin-bottom: 20px;
        }
        .eg-contact-input-label {
          display: block;
          font-size: 13.5px;
          font-weight: 600;
          color: var(--eg-text-primary, #0f172a);
          margin-bottom: 7px;
        }
        .eg-contact-input {
          width: 100%;
          box-sizing: border-box;
          padding: 11px 14px;
          border-radius: 8px;
          border: 1px solid var(--eg-border-default, rgba(0, 0, 0, 0.16));
          background: var(--eg-bg-canvas, #f8fafc);
          color: var(--eg-text-primary, #0f172a);
          font-size: 14.5px;
          font-family: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .eg-contact-input:focus {
          outline: none;
          border-color: var(--eg-color-primary, #b8860b);
          box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.15);
          background: var(--eg-bg-surface, #ffffff);
        }
        .eg-contact-captcha-box {
          background: var(--eg-bg-subtle, rgba(0, 0, 0, 0.03));
          border: 1px dashed var(--eg-border-default, rgba(0, 0, 0, 0.2));
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .eg-contact-channel-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.08));
          background: var(--eg-bg-surface, #ffffff);
          margin-bottom: 12px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .eg-contact-channel-item:hover {
          transform: translateY(-2px);
          border-color: var(--eg-color-primary, #b8860b);
          box-shadow: var(--eg-shadow-sm, 0 4px 12px rgba(0,0,0,0.06));
        }
        @media (max-width: 860px) {
          .eg-contact-portal {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      ` }),
        /* @__PURE__ */ c("div", { className: "eg-contact-portal-card", children: [
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
          ie && /* @__PURE__ */ c(
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
          de ? /* @__PURE__ */ c("div", { style: { textAlign: "center", padding: "24px 0" }, children: [
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
            /* @__PURE__ */ r("p", { style: { margin: "0 0 24px", color: "var(--eg-text-secondary, #475569)", fontSize: "14.5px", lineHeight: 1.6 }, children: L }),
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
          ] }) : /* @__PURE__ */ c("form", { id: "contactForm", onSubmit: et, children: [
            /* @__PURE__ */ c("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ c("label", { htmlFor: "txtname", className: "eg-contact-input-label", children: [
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
                  value: $,
                  onFocus: Se,
                  onChange: (J) => U(J.target.value),
                  placeholder: "Your full name",
                  className: "eg-contact-input"
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ c("label", { htmlFor: "txtemail", className: "eg-contact-input-label", children: [
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
                  value: _,
                  onFocus: Se,
                  onChange: (J) => T(J.target.value),
                  placeholder: "name@example.com",
                  className: "eg-contact-input"
                }
              )
            ] }),
            /* @__PURE__ */ c("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ c("label", { htmlFor: "txtcontact", className: "eg-contact-input-label", children: [
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
                  onChange: (J) => N(J.target.value),
                  placeholder: "Phone or mobile number",
                  className: "eg-contact-input"
                }
              )
            ] }),
            o && G && P && /* @__PURE__ */ c("div", { className: "eg-contact-captcha-box", id: "botCheckContainer", children: [
              /* @__PURE__ */ c("div", { children: [
                /* @__PURE__ */ c(
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
                      P.prompt,
                      " ",
                      /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ r("span", { style: { fontSize: "11.5px", color: "var(--eg-text-muted, #94a3b8)" }, children: "Solve the arithmetic problem above to verify you are human" })
              ] }),
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ r(
                  "input",
                  {
                    id: "txtbot",
                    name: "botAnswer",
                    type: "number",
                    required: !0,
                    value: O,
                    onChange: (J) => M(J.target.value),
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
            /* @__PURE__ */ c("div", { className: "eg-contact-input-group", children: [
              /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }, children: [
                /* @__PURE__ */ c("label", { htmlFor: "txtenq", className: "eg-contact-input-label", style: { marginBottom: 0 }, children: [
                  "Your Message ",
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-danger, #ef4444)" }, children: "*" })
                ] }),
                p && /* @__PURE__ */ c("span", { style: { fontSize: "12px", color: "var(--eg-text-muted, #94a3b8)", fontWeight: 500 }, children: [
                  k.length,
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
                  value: k,
                  onFocus: Se,
                  onChange: (J) => D(J.target.value),
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
        v && v.length > 0 && /* @__PURE__ */ c("div", { className: "eg-contact-portal-card", children: [
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
              children: m
            }
          ),
          y && /* @__PURE__ */ r(
            "p",
            {
              style: {
                margin: "0 0 20px",
                fontSize: "13.5px",
                color: "var(--eg-text-muted, #64748b)",
                lineHeight: 1.5
              },
              children: y
            }
          ),
          /* @__PURE__ */ r("div", { style: { marginTop: "16px" }, children: v.map((J) => {
            const ue = /* @__PURE__ */ c(se, { children: [
              J.icon && /* @__PURE__ */ r(
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
                  children: J.icon
                }
              ),
              /* @__PURE__ */ c("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ r("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--eg-text-primary, #0f172a)" }, children: J.label }),
                /* @__PURE__ */ r(
                  "div",
                  {
                    style: {
                      fontSize: "13px",
                      color: J.href ? "var(--eg-color-primary, #b8860b)" : "var(--eg-text-secondary, #475569)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: J.value
                  }
                ),
                J.description && /* @__PURE__ */ r("div", { style: { fontSize: "11.5px", color: "var(--eg-text-muted, #94a3b8)", marginTop: "2px" }, children: J.description })
              ] }),
              J.href && /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #94a3b8)", fontSize: "15px" }, children: "↗" })
            ] });
            return J.href ? /* @__PURE__ */ r(
              "a",
              {
                href: ne(J.href),
                target: "_blank",
                rel: "noopener noreferrer",
                className: "eg-contact-channel-item",
                children: ue
              },
              J.id
            ) : /* @__PURE__ */ r("div", { className: "eg-contact-channel-item", children: ue }, J.id);
          }) })
        ] })
      ]
    }
  );
};
function Qa(t, e, n = "string") {
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
function mr(t) {
  if (t == null) return '""';
  let e = String(t);
  return (e.includes('"') || e.includes(",") || e.includes(`
`) || e.includes("\r")) && (e = `"${e.replace(/"/g, '""')}"`), e;
}
function vn({
  data: t,
  columns: e,
  keyExtractor: n,
  defaultPageSize: i = 15,
  pageSizeOptions: o = [10, 15, 25, 50, 100],
  searchable: a = !0,
  searchPlaceholder: l = "Search records...",
  searchKeys: s,
  exportable: p = !0,
  exportFileName: d = "export.csv",
  loading: g = !1,
  emptyMessage: u = "No matching records found.",
  toolbarSlot: h,
  onRowClick: x,
  initialSortKey: f,
  initialSortDirection: b = null,
  style: C,
  className: v = ""
}) {
  const [m, y] = W(""), [w, L] = W(f || null), [z, A] = W(b), [R, B] = W(i), [j, I] = W(1), E = ee(() => {
    if (!m.trim()) return t;
    const M = m.toLowerCase().trim();
    return t.filter((P) => s && s.length > 0 ? s.some((V) => {
      const G = e.find((F) => F.key === V), Q = G != null && G.getValue ? G.getValue(P) : P[V];
      return Q != null && String(Q).toLowerCase().includes(M);
    }) : e.some((V) => {
      const G = V.getValue ? V.getValue(P) : P[V.key];
      return G != null && String(G).toLowerCase().includes(M);
    }));
  }, [t, m, s, e]), H = ee(() => {
    if (!w || !z) return E;
    const M = e.find((G) => G.key === w), P = (M == null ? void 0 : M.sortType) || "string";
    return [...E].sort((G, Q) => {
      const F = M != null && M.getValue ? M.getValue(G) : G[w], oe = M != null && M.getValue ? M.getValue(Q) : Q[w], ie = Qa(F, oe, P);
      return z === "desc" ? -ie : ie;
    });
  }, [E, w, z, e]), $ = (M) => {
    y(M.target.value), I(1);
  }, U = (M) => {
    w !== M ? (L(M), A("asc")) : z === "asc" ? A("desc") : z === "desc" ? (A(null), L(null)) : A("asc"), I(1);
  }, _ = H.length, T = Math.max(1, Math.ceil(_ / R)), S = Math.min(Math.max(1, j), T), N = ee(() => {
    const M = (S - 1) * R;
    return H.slice(M, M + R);
  }, [H, S, R]), k = _ === 0 ? 0 : (S - 1) * R + 1, D = Math.min(S * R, _), O = te(() => {
    if (H.length === 0) return;
    const M = e.map((oe) => mr(oe.label)).join(","), P = H.map((oe) => e.map((ie) => {
      const ae = ie.getValue ? ie.getValue(oe) : oe[ie.key];
      return mr(ae);
    }).join(",")), V = "\uFEFF" + [M, ...P].join(`\r
`), G = new Blob([V], { type: "text/csv;charset=utf-8;" }), Q = URL.createObjectURL(G), F = document.createElement("a");
    F.href = Q, F.setAttribute("download", d), document.body.appendChild(F), F.click(), document.body.removeChild(F), URL.revokeObjectURL(Q);
  }, [H, e, d]);
  return /* @__PURE__ */ c(
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
        ...C
      },
      children: [
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "var(--eg-space-3, 12px)", flex: "1 1 280px" }, children: [
                a && /* @__PURE__ */ c("div", { style: { position: "relative", width: "100%", maxWidth: "340px" }, children: [
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "text",
                      value: m,
                      onChange: $,
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
                  /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "var(--eg-space-3, 12px)" }, children: [
                /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "var(--eg-text-xs, 0.8125rem)", color: "var(--eg-text-muted, #9ca3af)" }, children: [
                  /* @__PURE__ */ r("span", { children: "Show:" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: R,
                      onChange: (M) => {
                        B(Number(M.target.value)), I(1);
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
                      children: o.map((M) => /* @__PURE__ */ r("option", { value: M, children: M }, M))
                    }
                  )
                ] }),
                p && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: O,
                    disabled: H.length === 0,
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
                      cursor: H.length === 0 ? "not-allowed" : "pointer",
                      opacity: H.length === 0 ? 0.5 : 1,
                      transition: "background var(--eg-transition-fast, 150ms)"
                    },
                    children: [
                      /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
        /* @__PURE__ */ r("div", { style: { width: "100%", overflowX: "auto" }, children: /* @__PURE__ */ c(
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
                  children: e.map((M) => {
                    const P = w === M.key, V = M.sortable !== !1;
                    return /* @__PURE__ */ r(
                      "th",
                      {
                        onClick: () => V && U(M.key),
                        style: {
                          padding: "12px 16px",
                          color: P ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #d1d5db)",
                          fontWeight: 600,
                          fontSize: "var(--eg-text-xs, 0.8125rem)",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          cursor: V ? "pointer" : "default",
                          userSelect: "none",
                          whiteSpace: "nowrap",
                          width: M.width,
                          textAlign: M.align || "left",
                          transition: "color var(--eg-transition-fast, 150ms)"
                        },
                        children: /* @__PURE__ */ c(
                          "div",
                          {
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              justifyContent: M.align === "right" ? "flex-end" : M.align === "center" ? "center" : "flex-start"
                            },
                            children: [
                              /* @__PURE__ */ r("span", { children: M.label }),
                              V && /* @__PURE__ */ r("span", { style: { fontSize: "0.75rem", opacity: P ? 1 : 0.35 }, children: P && z === "asc" ? "▲" : P && z === "desc" ? "▼" : "⇅" })
                            ]
                          }
                        )
                      },
                      M.key
                    );
                  })
                }
              ) }),
              /* @__PURE__ */ r("tbody", { children: g ? /* @__PURE__ */ r("tr", { children: /* @__PURE__ */ r("td", { colSpan: e.length, style: { padding: "36px", textAlign: "center" }, children: /* @__PURE__ */ c(
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
              ) }) : N.map((M, P) => {
                const V = n ? n(M, P) : P;
                return /* @__PURE__ */ r(
                  "tr",
                  {
                    onClick: () => x && x(M, P),
                    style: {
                      borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.04))",
                      cursor: x ? "pointer" : "default",
                      transition: "background var(--eg-transition-fast, 150ms)",
                      background: P % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)"
                    },
                    children: e.map((G) => {
                      const Q = G.getValue ? G.getValue(M) : M[G.key];
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
                          children: G.render ? G.render(M, P) : Q != null ? String(Q) : "—"
                        },
                        G.key
                      );
                    })
                  },
                  V
                );
              }) })
            ]
          }
        ) }),
        /* @__PURE__ */ c(
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
              /* @__PURE__ */ c("div", { children: [
                "Showing ",
                /* @__PURE__ */ r("strong", { children: k }),
                " to ",
                /* @__PURE__ */ r("strong", { children: D }),
                " of",
                " ",
                /* @__PURE__ */ r("strong", { children: _ }),
                " entries",
                m && ` (filtered from ${t.length} total)`
              ] }),
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => I(1),
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
                    onClick: () => I((M) => Math.max(1, M - 1)),
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
                /* @__PURE__ */ c("span", { style: { padding: "0 6px", fontWeight: 600, color: "var(--eg-text-primary, #f9fafb)" }, children: [
                  "Page ",
                  S,
                  " of ",
                  T
                ] }),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => I((M) => Math.min(T, M + 1)),
                    disabled: S >= T,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S >= T ? "not-allowed" : "pointer",
                      opacity: S >= T ? 0.4 : 1
                    },
                    children: "Next ›"
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    onClick: () => I(T),
                    disabled: S >= T,
                    style: {
                      padding: "4px 8px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))",
                      borderRadius: "var(--eg-radius-sm, 6px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: S >= T ? "not-allowed" : "pointer",
                      opacity: S >= T ? 0.4 : 1
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
  className: d = ""
}) => {
  const g = !!s;
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-stat-card ${d}`,
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
        /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }, children: [
          /* @__PURE__ */ c("div", { children: [
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
        (n || l) && /* @__PURE__ */ c(
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
              l && /* @__PURE__ */ c(
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
}, us = ({
  brandTitle: t = "Admin Portal",
  brandSubtitle: e = "Security & Control",
  logo: n,
  navItems: i,
  activeNavId: o,
  onNavSelect: a,
  user: l,
  onLogout: s,
  currentTitle: p,
  headerActions: d,
  children: g,
  style: u,
  className: h = ""
}) => {
  const [x, f] = W(!1), [b, C] = W(!1), v = (w) => {
    w.onClick && w.onClick(), a && a(w.id), C(!1);
  }, m = i.find((w) => w.id === o), y = p || (m == null ? void 0 : m.label) || t;
  return /* @__PURE__ */ c(
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
        b && /* @__PURE__ */ r(
          "div",
          {
            onClick: () => C(!1),
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 99990
            }
          }
        ),
        /* @__PURE__ */ c(
          "aside",
          {
            style: {
              width: x ? "72px" : "260px",
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
              ...b ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: "280px",
                transform: "translateX(0)"
              } : {}
            },
            children: [
              /* @__PURE__ */ c("div", { children: [
                /* @__PURE__ */ c(
                  "div",
                  {
                    style: {
                      padding: x ? "16px 8px" : "20px 16px",
                      borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: x ? "center" : "space-between",
                      gap: "12px"
                    },
                    children: [
                      /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }, children: [
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
                            children: /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                              /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                              /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                            ] })
                          }
                        ),
                        !x && /* @__PURE__ */ c("div", { style: { overflow: "hidden", whiteSpace: "nowrap" }, children: [
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
                      !b && /* @__PURE__ */ r(
                        "button",
                        {
                          type: "button",
                          onClick: () => f(!x),
                          style: {
                            background: "transparent",
                            border: "none",
                            color: "var(--eg-text-muted, #9ca3af)",
                            cursor: "pointer",
                            padding: "4px",
                            display: x ? "none" : "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          },
                          title: x ? "Expand sidebar" : "Collapse sidebar",
                          children: /* @__PURE__ */ r("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ r("path", { d: "M15 18l-6-6 6-6" }) })
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ r("nav", { style: { padding: "12px 8px", display: "flex", flexDirection: "column", gap: "4px" }, children: i.map((w) => {
                  const L = w.id === o;
                  return /* @__PURE__ */ c(
                    "button",
                    {
                      type: "button",
                      onClick: () => v(w),
                      title: x ? w.label : void 0,
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: x ? "center" : "space-between",
                        gap: "12px",
                        width: "100%",
                        padding: x ? "10px 0" : "10px 14px",
                        background: L ? "var(--eg-color-emerald-glow, rgba(0, 220, 130, 0.12))" : "transparent",
                        border: "1px solid",
                        borderColor: L ? "rgba(16, 185, 129, 0.25)" : "transparent",
                        borderRadius: "var(--eg-radius-md, 10px)",
                        color: L ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-secondary, #d1d5db)",
                        fontSize: "var(--eg-text-sm, 0.875rem)",
                        fontWeight: L ? 600 : 500,
                        cursor: "pointer",
                        transition: "all var(--eg-transition-fast, 150ms)"
                      },
                      children: [
                        /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
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
                          !x && /* @__PURE__ */ r("span", { children: w.label })
                        ] }),
                        !x && w.badge != null && /* @__PURE__ */ r(
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
                    padding: x ? "12px 8px" : "16px",
                    borderTop: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))"
                  },
                  children: x ? /* @__PURE__ */ r(
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
                  ) : l ? /* @__PURE__ */ c(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px"
                      },
                      children: [
                        /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }, children: [
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
                          /* @__PURE__ */ c("div", { style: { overflow: "hidden", whiteSpace: "nowrap" }, children: [
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
                            children: /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
        /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0, minHeight: "100vh" }, children: [
          /* @__PURE__ */ c(
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
                /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => C(!0),
                      style: {
                        display: "none",
                        background: "transparent",
                        border: "none",
                        color: "var(--eg-text-primary, #f9fafb)",
                        cursor: "pointer",
                        padding: "6px"
                      },
                      className: "eg-admin-mobile-toggle",
                      children: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
                      children: y
                    }
                  )
                ] }),
                /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                  d,
                  /* @__PURE__ */ r(Ir, {}),
                  s && /* @__PURE__ */ c(
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
                        /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
            display: ${b ? "flex !important" : "none !important"};
          }
        }
      ` })
      ]
    }
  );
}, wn = "EG_ADMIN_SALT_2026", Xa = 3, Ja = 24 * 60 * 60 * 1e3, Xt = "eg_admin_pin_verified_uid", el = 18;
async function tl(t, e = wn) {
  if (typeof window > "u" || !window.crypto || !window.crypto.subtle)
    throw new Error("[eg-web-core] Web Crypto API is unavailable in this environment.");
  const i = new TextEncoder().encode(t + e), o = await crypto.subtle.digest("SHA-256", i);
  return Array.from(new Uint8Array(o)).map((l) => l.toString(16).padStart(2, "0")).join("");
}
async function mt() {
  if (typeof window > "u") return "unknown";
  try {
    const t = new AbortController(), e = setTimeout(() => t.abort(), 3e3), n = await fetch("https://api.ipify.org?format=json", { signal: t.signal });
    return clearTimeout(e), (await n.json()).ip || "unknown";
  } catch {
    return "unknown";
  }
}
function yt(t) {
  return t ? t.replace(/\./g, "_").replace(/[^a-zA-Z0-9_]/g, "") : "unknown";
}
async function bt(t, e = {}) {
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
        const u = localStorage.getItem(`admin_lock_${yt(t)}`);
        if (u) {
          const h = JSON.parse(u), x = new Date(h.unlocksAt);
          if (/* @__PURE__ */ new Date() < x) {
            const f = Math.max(1, Math.ceil((x.getTime() - Date.now()) / 36e5));
            return { locked: !0, unlocksAt: x, failCount: h.failCount || 3, hoursRemaining: f };
          }
        }
      }
      return n;
    }
    const o = e.lockoutCollection || "admin_lockout", a = i.collection(o).doc(yt(t)), l = await a.get();
    if (!l.exists) return n;
    const s = l.data() || {}, p = s.failCount || 0;
    if (!s.lockedUntil)
      return { ...n, failCount: p };
    const d = s.lockedUntil.toDate ? s.lockedUntil.toDate() : new Date(s.lockedUntil), g = /* @__PURE__ */ new Date();
    if (g < d) {
      const u = d.getTime() - g.getTime(), h = Math.max(1, Math.ceil(u / 36e5));
      return {
        locked: !0,
        unlocksAt: d,
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
async function $t(t, e, n, i = {}) {
  var s, p, d, g, u, h, x, f;
  const o = i.maxFailAttempts ?? Xa, a = i.lockoutDurationMs ?? Ja, l = yt(t);
  try {
    const b = i.db || window.db;
    if (b) {
      const C = i.lockoutCollection || "admin_lockout", v = b.collection(C).doc(l), m = await v.get(), w = (m.exists && m.data().failCount || 0) + 1, L = {
        ipAddress: t,
        email: e,
        failCount: w,
        lastFailAt: ((d = (p = (s = window.firebase) == null ? void 0 : s.firestore) == null ? void 0 : p.FieldValue) == null ? void 0 : d.serverTimestamp()) || /* @__PURE__ */ new Date()
      };
      if (w >= o) {
        const z = new Date(Date.now() + a), A = (u = (g = window.firebase) == null ? void 0 : g.firestore) == null ? void 0 : u.Timestamp;
        L.lockedUntil = A ? A.fromDate(z) : z.toISOString(), L.lockedAt = ((f = (x = (h = window.firebase) == null ? void 0 : h.firestore) == null ? void 0 : x.FieldValue) == null ? void 0 : f.serverTimestamp()) || /* @__PURE__ */ new Date();
      }
      await v.set(L, { merge: !0 });
    } else if (typeof window < "u") {
      const C = `admin_lock_${l}`, v = localStorage.getItem(C), y = ((v ? JSON.parse(v) : { failCount: 0 }).failCount || 0) + 1, w = { ip: t, email: e, failCount: y };
      y >= o && (w.unlocksAt = new Date(Date.now() + a).toISOString()), localStorage.setItem(C, JSON.stringify(w));
    }
    await kn({
      email: e,
      ipAddress: t,
      outcome: n,
      userAgent: typeof navigator < "u" ? navigator.userAgent : "",
      uid: null,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }, i);
  } catch (b) {
    console.warn("[eg-web-core] recordAdminFailedAttempt warning:", b.message);
  }
}
async function rl(t, e = {}) {
  const n = yt(t);
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
async function kn(t, e = {}) {
  try {
    const n = e.db || window.db;
    if (!n) return;
    const i = e.logCollection || "admin_login_log", o = n.collection(i).doc("meta");
    await n.runTransaction(async (a) => {
      var u, h, x, f;
      const l = await a.get(o);
      let s = 1, p = 0;
      l.exists && (s = l.data().currentPage || 1, p = l.data().currentCount || 0), p >= el && (s++, p = 0);
      const d = n.collection(i).doc(`page_${s}`), g = window.firebase;
      a.set(
        d,
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
        lastUpdated: ((f = (x = g == null ? void 0 : g.firestore) == null ? void 0 : x.FieldValue) == null ? void 0 : f.serverTimestamp()) || /* @__PURE__ */ new Date()
      });
    });
  } catch (n) {
    console.warn("[eg-web-core] logAdminLoginAttempt failed (non-critical):", n.message);
  }
}
function yr(t, e = Xt) {
  if (typeof window > "u" || !t) return !1;
  try {
    return sessionStorage.getItem(e) === t;
  } catch {
    return !1;
  }
}
function nl(t, e = Xt) {
  if (!(typeof window > "u" || !t))
    try {
      sessionStorage.setItem(e, t);
    } catch {
    }
}
function qe(t = Xt) {
  if (!(typeof window > "u"))
    try {
      sessionStorage.removeItem(t);
    } catch {
    }
}
async function il(t = {}) {
  const e = await mt(), n = await bt(e, t);
  if (n.locked)
    throw new Error(
      `Access is temporarily blocked due to repeated failed attempts. Please try again in ${n.hoursRemaining} hour(s).`
    );
  const i = await Dt(t.firebaseConfig, t.appName), o = window.firebase;
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
  } catch (d) {
    throw d.code === "auth/popup-closed-by-user" ? new Error("Sign-in popup was cancelled by user.") : (await $t(e, "unknown-google-user", "fail_google", t), d);
  }
  const s = l.user;
  if (!s || !s.email)
    throw new Error("No user profile received from Google Authentication.");
  const p = t.allowedEmails;
  if (p && p.length > 0 && !p.some((g) => g.toLowerCase() === s.email.toLowerCase()))
    throw await i.signOut(), qe(t.sessionKey), await $t(e, s.email, "fail_unauthorized", t), new Error(`Unauthorized account (${s.email}). Access to this administrative portal is restricted.`);
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
  const a = n.ip || await mt(), l = await bt(a, n);
  if (l.locked)
    return {
      success: !1,
      error: `Access blocked due to excessive failed attempts. Try again in ${l.hoursRemaining} hour(s).`
    };
  const s = n.salt || n.pinSalt || wn, p = await tl(o, s);
  let d = !1;
  if (n.expectedPinHash)
    d = n.expectedPinHash.toLowerCase() === p.toLowerCase();
  else
    try {
      const h = n.db || await Tn(n.firebaseConfig), x = n.securityCollection || "admin_security", f = await h.collection(x).doc(e.uid).get();
      if (f.exists)
        d = (((g = f.data()) == null ? void 0 : g.pinHash) || "").toLowerCase() === p.toLowerCase();
      else {
        const b = await h.collection(x).doc("config").get();
        b.exists && (d = (((u = b.data()) == null ? void 0 : u.pinHash) || "").toLowerCase() === p.toLowerCase());
      }
    } catch (h) {
      return {
        success: !1,
        error: `Database error while verifying PIN: ${h.message}`
      };
    }
  return d ? (nl(e.uid, n.sessionKey), await rl(a, n), await kn({
    email: e.email,
    ipAddress: a,
    outcome: "success",
    userAgent: typeof navigator < "u" ? navigator.userAgent : "",
    uid: e.uid,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }, n), { success: !0 }) : (qe(n.sessionKey), await $t(a, e.email, "fail_pin", n), {
    success: !1,
    error: "Incorrect security PIN. Access denied."
  });
}
async function al(t = {}) {
  qe(t.sessionKey);
  try {
    const e = await Dt(t.firebaseConfig);
    e && typeof e.signOut == "function" && await e.signOut();
  } catch (e) {
    console.warn("[eg-web-core] adminSignOut warning:", e.message);
  }
}
function Sn(t = {}) {
  const [e, n] = W(null), [i, o] = W(!1), [a, l] = W(!0), [s, p] = W(null), [d, g] = W("unknown"), [u, h] = W({
    locked: !1,
    unlocksAt: null,
    failCount: 0,
    hoursRemaining: 0
  }), x = te(async () => {
    try {
      const y = d !== "unknown" ? d : await mt();
      if (y !== "unknown") {
        g(y);
        const w = await bt(y, t);
        h(w);
      }
    } catch {
    }
  }, [d, t]);
  Y(() => {
    let y = !0;
    async function w() {
      l(!0);
      try {
        const L = await mt();
        if (y) {
          g(L);
          const A = await bt(L, t);
          h(A);
        }
        const z = await Dt(t.firebaseConfig, t.appName);
        z && typeof z.onAuthStateChanged == "function" ? z.onAuthStateChanged((A) => {
          if (y) {
            if (A && A.email) {
              if (t.allowedEmails && t.allowedEmails.length > 0 && !t.allowedEmails.some(
                (I) => I.toLowerCase() === A.email.toLowerCase()
              )) {
                qe(t.sessionKey), n(null), o(!1), l(!1), z.signOut();
                return;
              }
              const R = {
                uid: A.uid,
                email: A.email,
                displayName: A.displayName,
                photoURL: A.photoURL
              };
              n(R);
              const B = yr(A.uid, t.sessionKey);
              o(B);
            } else
              n(null), o(!1);
            l(!1);
          }
        }) : l(!1);
      } catch (L) {
        y && (p(L.message || "Failed to initialize administrative security layer."), l(!1));
      }
    }
    return w(), () => {
      y = !1;
    };
  }, [t.sessionKey, t.firebaseConfig, t.appName]);
  const f = te(async () => {
    p(null), l(!0);
    try {
      const y = await il(t);
      n(y);
      const w = yr(y.uid, t.sessionKey);
      return o(w), await x(), l(!1), y;
    } catch (y) {
      return p(y.message || "Google authentication failed."), await x(), l(!1), null;
    }
  }, [t, x]), b = te(
    async (y, w = {}) => {
      if (!e)
        return p("Please sign in with Google first."), !1;
      p(null), l(!0);
      try {
        const L = await ol(y, e, {
          ...t,
          ...w,
          ip: d
        });
        return L.success ? (o(!0), p(null), await x(), l(!1), !0) : (o(!1), p(L.error || "Incorrect security PIN."), await x(), l(!1), !1);
      } catch (L) {
        return o(!1), p(L.message || "Failed to verify security PIN."), await x(), l(!1), !1;
      }
    },
    [e, t, d, x]
  ), C = te(async () => {
    l(!0);
    try {
      await al(t), n(null), o(!1), p(null);
    } finally {
      l(!1);
    }
  }, [t]), v = te(() => {
    qe(t.sessionKey), o(!1);
  }, [t.sessionKey]), m = te(() => {
    p(null);
  }, []);
  return {
    user: e,
    isPinVerified: i,
    isAuthenticated: !!(e && i),
    isLoading: a,
    error: s,
    lockout: u,
    clientIP: d,
    loginWithGoogle: f,
    verifyPin: b,
    logout: C,
    resetPinPrompt: v,
    refreshLockout: x,
    clearError: m
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
  const d = {
    ...a,
    ...i ? { allowedEmails: i } : {},
    ...o != null && o.salt ? { pinSalt: o.salt } : {}
  }, {
    user: g,
    isAuthenticated: u,
    isLoading: h,
    error: x,
    lockout: f,
    loginWithGoogle: b,
    verifyPin: C,
    logout: v,
    clearError: m
  } = Sn(d), [y, w] = W(["", "", "", ""]), [L, z] = W(!1), [A, R] = W(!1), B = [
    me(null),
    me(null),
    me(null),
    me(null)
  ];
  Y(() => {
    u && g && l && l(g);
  }, [u, g, l]), Y(() => {
    g && !u && setTimeout(() => {
      var _;
      (_ = B[0].current) == null || _.focus();
    }, 100);
  }, [g, u]);
  const j = (_, T) => {
    var k;
    const S = T.replace(/\D/g, "");
    if (S.length > 4) {
      E(S);
      return;
    }
    const N = [...y];
    N[_] = S, w(N), S.length === 4 && _ < 3 && ((k = B[_ + 1].current) == null || k.focus());
  }, I = (_, T) => {
    var S;
    T.key === "Backspace" && y[_].length === 0 && _ > 0 && ((S = B[_ - 1].current) == null || S.focus());
  }, E = (_) => {
    var O, M, P, V;
    const T = _.replace(/\D/g, "").slice(0, 16), S = T.slice(0, 4), N = T.slice(4, 8), k = T.slice(8, 12), D = T.slice(12, 16);
    w([S, N, k, D]), T.length >= 16 ? (O = B[3].current) == null || O.focus() : T.length >= 12 ? (M = B[3].current) == null || M.focus() : T.length >= 8 ? (P = B[2].current) == null || P.focus() : T.length >= 4 && ((V = B[1].current) == null || V.focus());
  }, H = (_) => {
    _.preventDefault();
    const T = _.clipboardData.getData("text");
    E(T);
  }, $ = async (_) => {
    _.preventDefault(), m();
    const T = y.join("");
    if (T.length !== 16)
      return;
    R(!0);
    const S = await C(T, o);
    R(!1), S && g && l && l(g);
  }, U = y.join("").length;
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
      children: /* @__PURE__ */ c(
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
            /* @__PURE__ */ c("div", { style: { textAlign: "center", marginBottom: "var(--eg-space-6, 24px)" }, children: [
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
                  children: /* @__PURE__ */ c("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
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
            f.locked && /* @__PURE__ */ c(
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
                  /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { flexShrink: 0 }, children: [
                    /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
                    /* @__PURE__ */ r("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                    /* @__PURE__ */ r("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                  ] }),
                  /* @__PURE__ */ c("span", { children: [
                    "Too many failed attempts. Access blocked for ",
                    /* @__PURE__ */ c("strong", { children: [
                      f.hoursRemaining,
                      " hour(s)"
                    ] }),
                    "."
                  ] })
                ]
              }
            ),
            x && !f.locked && /* @__PURE__ */ c(
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
                  /* @__PURE__ */ r("span", { children: x }),
                  /* @__PURE__ */ r(
                    "button",
                    {
                      onClick: m,
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
            !g && /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-4, 16px)" }, children: [
              /* @__PURE__ */ c(
                "button",
                {
                  type: "button",
                  disabled: h || f.locked,
                  onClick: () => b(),
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
                    /* @__PURE__ */ c("svg", { width: "20", height: "20", viewBox: "0 0 24 24", children: [
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
              /* @__PURE__ */ c(
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
                    /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ r("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                      /* @__PURE__ */ r("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
                    ] }),
                    /* @__PURE__ */ r("span", { children: "Restricted administrator access. Two-factor challenge required." })
                  ]
                }
              )
            ] }),
            g && !u && /* @__PURE__ */ c("form", { onSubmit: $, style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-4, 16px)" }, children: [
              /* @__PURE__ */ c(
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
                    /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }, children: [
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
              /* @__PURE__ */ c("div", { children: [
                /* @__PURE__ */ c(
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
                          onClick: () => z(!L),
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
                          children: L ? "Hide" : "Show"
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
                    children: [0, 1, 2, 3].map((_) => /* @__PURE__ */ r(
                      "input",
                      {
                        ref: B[_],
                        type: L ? "text" : "password",
                        inputMode: "numeric",
                        maxLength: 4,
                        value: y[_],
                        onChange: (T) => j(_, T.target.value),
                        onKeyDown: (T) => I(_, T),
                        onPaste: _ === 0 ? H : void 0,
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
                          border: y[_].length === 4 ? "1px solid var(--eg-color-primary, #10b981)" : "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                          borderRadius: "var(--eg-radius-md, 10px)",
                          color: "var(--eg-text-primary, #f9fafb)",
                          outline: "none",
                          transition: "border-color var(--eg-transition-fast, 150ms)",
                          boxSizing: "border-box"
                        }
                      },
                      _
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ r(
                "button",
                {
                  type: "submit",
                  disabled: U !== 16 || A || f.locked,
                  style: {
                    width: "100%",
                    padding: "12px 20px",
                    background: U === 16 && !A && !f.locked ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
                    color: U === 16 && !A && !f.locked ? "#ffffff" : "var(--eg-text-muted, #9ca3af)",
                    border: "none",
                    borderRadius: "var(--eg-radius-md, 10px)",
                    fontSize: "var(--eg-text-base, 1rem)",
                    fontWeight: 600,
                    cursor: U === 16 && !A && !f.locked ? "pointer" : "not-allowed",
                    transition: "all var(--eg-transition-normal, 220ms)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px"
                  },
                  children: A ? /* @__PURE__ */ c(se, { children: [
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
                  ] }) : /* @__PURE__ */ c(se, { children: [
                    /* @__PURE__ */ c("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
}, fs = ({
  children: t,
  authConfig: e,
  pinConfig: n,
  loginProps: i,
  loadingFallback: o
}) => {
  const a = {
    ...e,
    ...n != null && n.salt ? { pinSalt: n.salt } : {}
  }, { user: l, isAuthenticated: s, isLoading: p, logout: d } = Sn(a);
  return p ? o ? /* @__PURE__ */ r(se, { children: o }) : /* @__PURE__ */ c(
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
  ) : typeof t == "function" ? /* @__PURE__ */ r(se, { children: t({ user: l, logout: d }) }) : /* @__PURE__ */ r(se, { children: t });
};
function br() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
const xs = ({
  db: t,
  collectionName: e,
  domains: n,
  customFetcher: i,
  style: o,
  className: a = ""
}) => {
  var H;
  const l = wt(), s = e || ((H = l.collections) == null ? void 0 : H.analytics) || "visitor_analytics", [p, d] = W({
    totalVisitors: 0,
    todayCount: 0,
    todayDate: br(),
    currentPage: 1
  }), [g, u] = W(1), [h, x] = W(1), [f, b] = W([]), [C, v] = W(!0), [m, y] = W("All Domains"), [w, L] = W(null), [z, A] = W("details"), R = te(async ($) => {
    var U, _;
    v(!0);
    try {
      if (i) {
        const V = await i();
        d(V.meta), b(V.logs), x(V.meta.currentPage || 1), v(!1);
        return;
      }
      const T = t || l.db || window.db || ((_ = (U = window.firebase) == null ? void 0 : U.firestore) == null ? void 0 : _.call(U));
      if (!T) {
        v(!1);
        return;
      }
      const S = await T.collection(s).doc("meta").get();
      let N = 1, k = 0, D = 0;
      if (S.exists) {
        const V = S.data() || {};
        k = V.totalVisitors || 0, N = V.currentPage || 1;
        const G = br();
        D = V.todayDate === G && V.todayCount || 0, d({
          totalVisitors: k,
          todayCount: D,
          todayDate: V.todayDate || G,
          currentPage: N
        });
      }
      x(N);
      const M = Math.max(1, N - ($ ?? g) + 1), P = await T.collection(s).doc(`page_${M}`).get();
      if (P.exists) {
        const Q = ((P.data() || {}).logs || []).map((F, oe) => {
          const ie = [];
          F.city && F.city !== "Unknown" && F.city !== "N/A" && ie.push(F.city), F.region && F.region !== "Unknown" && F.region !== "N/A" && ie.push(F.region), F.country && F.country !== "Unknown" && F.country !== "N/A" && ie.push(F.country);
          const ae = ie.length > 0 ? ie.join(", ") : "Unknown";
          return {
            id: F.id || `v_log_${M}_${oe}`,
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
        Q.reverse(), b(Q);
      } else
        b([]);
    } catch (T) {
      console.warn("[eg-web-core] loadAnalytics warning:", T.message);
    } finally {
      v(!1);
    }
  }, [t, l.db, s, i, g]);
  Y(() => {
    R();
  }, [R]);
  const B = ($) => {
    const U = Math.max(1, Math.min($, h));
    u(U), R(U);
  }, j = ee(() => n && n.length > 0 ? n : ["All Domains", ...Array.from(new Set(f.map((U) => U.appName).filter(Boolean)))], [n, f]), I = ee(() => m === "All Domains" ? f : f.filter(($) => $.appName.toLowerCase().includes(m.toLowerCase())), [f, m]), E = [
    {
      key: "timestamp",
      label: "Timestamp",
      sortType: "date",
      width: "180px",
      render: ($) => {
        if (!$.timestamp) return "—";
        const U = new Date($.timestamp);
        return /* @__PURE__ */ c("div", { style: { fontSize: "0.8125rem" }, children: [
          /* @__PURE__ */ r("div", { style: { fontWeight: 600 }, children: U.toLocaleDateString() }),
          /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.75rem" }, children: U.toLocaleTimeString() })
        ] });
      }
    },
    {
      key: "appName",
      label: "Application / Domain",
      width: "150px",
      render: ($) => /* @__PURE__ */ r(
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
          children: $.appName
        }
      )
    },
    {
      key: "pageVisited",
      label: "Page Visited",
      render: ($) => /* @__PURE__ */ r(
        "span",
        {
          style: {
            fontFamily: "var(--eg-font-mono, monospace)",
            fontSize: "0.8125rem",
            color: "var(--eg-text-primary, #f9fafb)"
          },
          children: $.pageVisited
        }
      )
    },
    {
      key: "location",
      label: "Location",
      render: ($) => /* @__PURE__ */ r("span", { children: $.location || "Unknown" })
    },
    {
      key: "ip",
      label: "IP Address",
      sortType: "ip",
      width: "130px",
      render: ($) => /* @__PURE__ */ r("span", { style: { fontFamily: "var(--eg-font-mono, monospace)", fontSize: "0.8125rem" }, children: $.ip })
    },
    {
      key: "os",
      label: "OS / Device",
      width: "120px",
      render: ($) => /* @__PURE__ */ r("span", { children: $.os || "Unknown" })
    },
    {
      key: "browser",
      label: "Browser",
      width: "120px",
      render: ($) => /* @__PURE__ */ r("span", { children: $.browser || "Unknown" })
    },
    {
      key: "actions",
      label: "Action",
      sortable: !1,
      align: "center",
      width: "90px",
      render: ($) => /* @__PURE__ */ r(
        "button",
        {
          type: "button",
          onClick: (U) => {
            U.stopPropagation(), L($), A("details");
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
  return /* @__PURE__ */ c("div", { className: `eg-admin-analytics-view ${a}`, style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-6, 24px)", ...o }, children: [
    /* @__PURE__ */ c(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--eg-space-4, 16px)"
        },
        children: [
          /* @__PURE__ */ r(
            He,
            {
              title: "Total Unique Visitors",
              value: p.totalVisitors,
              subtitle: "Cumulative across all recorded domains",
              icon: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
              icon: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
              icon: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }),
                /* @__PURE__ */ r("path", { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
                /* @__PURE__ */ r("path", { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
              ] }),
              iconBgColor: "rgba(245, 158, 11, 0.15)",
              iconColor: "var(--eg-color-amber, #f59e0b)"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ r(
      vn,
      {
        data: I,
        columns: E,
        keyExtractor: ($) => $.id,
        loading: C,
        exportFileName: `analytics_bucket_${g}.csv`,
        toolbarSlot: /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }, children: [
          /* @__PURE__ */ r(
            "select",
            {
              value: m,
              onChange: ($) => y($.target.value),
              style: {
                background: "var(--eg-bg-primary, #030712)",
                border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "var(--eg-text-primary, #f9fafb)",
                padding: "7px 12px",
                fontSize: "var(--eg-text-xs, 0.8125rem)",
                cursor: "pointer",
                outline: "none"
              },
              children: j.map(($) => /* @__PURE__ */ r("option", { value: $, children: $ }, $))
            }
          ),
          /* @__PURE__ */ c(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "var(--eg-bg-primary, #030712)",
                padding: "2px 6px",
                borderRadius: "var(--eg-radius-md, 8px)",
                border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))"
              },
              children: [
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    disabled: g <= 1 || C,
                    onClick: () => B(g - 1),
                    style: {
                      background: "none",
                      border: "none",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: g <= 1 ? "not-allowed" : "pointer",
                      opacity: g <= 1 ? 0.3 : 1,
                      padding: "4px 6px"
                    },
                    title: "Newer bucket",
                    children: "‹"
                  }
                ),
                /* @__PURE__ */ c(
                  "span",
                  {
                    style: {
                      fontSize: "var(--eg-text-xs, 0.75rem)",
                      color: "var(--eg-text-muted, #9ca3af)",
                      whiteSpace: "nowrap"
                    },
                    children: [
                      "Bucket ",
                      g,
                      " of ",
                      h
                    ]
                  }
                ),
                /* @__PURE__ */ r(
                  "button",
                  {
                    type: "button",
                    disabled: g >= h || C,
                    onClick: () => B(g + 1),
                    style: {
                      background: "none",
                      border: "none",
                      color: "var(--eg-text-primary, #f9fafb)",
                      cursor: g >= h ? "not-allowed" : "pointer",
                      opacity: g >= h ? 0.3 : 1,
                      padding: "4px 6px"
                    },
                    title: "Older bucket",
                    children: "›"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ c(
            "button",
            {
              type: "button",
              onClick: () => R(),
              disabled: C,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "7px 12px",
                background: "var(--eg-bg-primary, #030712)",
                border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "var(--eg-text-primary, #f9fafb)",
                fontSize: "var(--eg-text-xs, 0.8125rem)",
                cursor: C ? "not-allowed" : "pointer"
              },
              children: [
                /* @__PURE__ */ c(
                  "svg",
                  {
                    width: "14",
                    height: "14",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    style: {
                      animation: C ? "spin 0.8s linear infinite" : "none"
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
      ct,
      {
        isOpen: !!w,
        onClose: () => L(null),
        title: /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
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
        footer: /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
          /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ r(
              "button",
              {
                type: "button",
                onClick: () => A("details"),
                style: {
                  padding: "4px 10px",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "none",
                  background: z === "details" ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
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
                onClick: () => A("json"),
                style: {
                  padding: "4px 10px",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "none",
                  background: z === "json" ? "var(--eg-color-primary, #10b981)" : "var(--eg-bg-tertiary, #1f2937)",
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
              onClick: () => L(null),
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
        children: z === "details" ? /* @__PURE__ */ r(
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
            ].map(($, U) => /* @__PURE__ */ c(
              "div",
              {
                style: {
                  padding: "8px 12px",
                  background: "var(--eg-bg-primary, #030712)",
                  borderRadius: "var(--eg-radius-sm, 6px)",
                  border: "1px solid var(--eg-border, rgba(255,255,255,0.06))"
                },
                children: [
                  /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", textTransform: "uppercase" }, children: $.label }),
                  /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-primary, #f9fafb)", marginTop: "2px", wordBreak: "break-all" }, children: $.val })
                ]
              },
              U
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
}, ms = ({
  db: t,
  firebaseConfig: e,
  collectionName: n,
  customFetcher: i,
  customDeleteHandler: o,
  title: a = "Contact Inquiries & Messages",
  style: l,
  className: s = ""
}) => {
  var j;
  const p = wt(), d = t || p.db, g = n || ((j = p.collections) == null ? void 0 : j.messages) || "messages", [u, h] = W([]), [x, f] = W(!0), [b, C] = W(null), [v, m] = W(null), [y, w] = W(!1), L = te(async () => {
    var I, E, H;
    f(!0);
    try {
      if (i) {
        const T = await i();
        h(T), f(!1);
        return;
      }
      let $ = d || window.db || ((E = (I = window.firebase) == null ? void 0 : I.firestore) == null ? void 0 : E.call(I));
      if (!$ && (e != null && e.apiKey || (H = p.config) != null && H.apiKey))
        try {
          const T = e || p.config, { db: S } = await Le(T, p.appName === "web-app" ? void 0 : p.appName);
          $ = S;
        } catch (T) {
          console.warn("[AdminMessagesView] Auto-init Firebase error:", T);
        }
      if (!$) {
        f(!1);
        return;
      }
      const _ = (await $.collection(g).orderBy("createdAt", "desc").limit(100).get()).docs.map((T) => {
        const S = T.data() || {};
        let N = null;
        return S.createdAt && (N = S.createdAt.toDate ? S.createdAt.toDate() : new Date(S.createdAt)), {
          id: T.id,
          name: S.name || "Anonymous",
          email: S.email || "N/A",
          contact: S.contact || "",
          message: S.message || "",
          appName: S.appName || "web-app",
          createdAt: N,
          userAgent: S.userAgent,
          ip: S.ip
        };
      });
      h(_);
    } catch ($) {
      console.warn("[eg-web-core] loadMessages warning:", $.message);
    } finally {
      f(!1);
    }
  }, [d, g, i, e, p.config, p.appName]);
  Y(() => {
    L();
  }, [L]);
  const z = async () => {
    var I, E;
    if (v) {
      w(!0);
      try {
        if (o)
          await o(v.id);
        else {
          const H = d || window.db || ((E = (I = window.firebase) == null ? void 0 : I.firestore) == null ? void 0 : E.call(I));
          H && await H.collection(g).doc(v.id).delete();
        }
        h((H) => H.filter(($) => $.id !== v.id)), (b == null ? void 0 : b.id) === v.id && C(null), m(null);
      } catch (H) {
        alert(`Failed to delete message: ${H.message}`);
      } finally {
        w(!1);
      }
    }
  }, A = u.length, R = u.filter((I) => {
    if (!I.createdAt) return !1;
    const E = new Date(I.createdAt), H = /* @__PURE__ */ new Date();
    return E.getDate() === H.getDate() && E.getMonth() === H.getMonth() && E.getFullYear() === H.getFullYear();
  }).length, B = [
    {
      key: "createdAt",
      label: "Received Date",
      sortType: "date",
      width: "160px",
      getValue: (I) => I.createdAt ? new Date(I.createdAt).getTime() : 0,
      render: (I) => {
        if (!I.createdAt) return "—";
        const E = new Date(I.createdAt);
        return /* @__PURE__ */ c("div", { style: { fontSize: "0.8125rem" }, children: [
          /* @__PURE__ */ r("div", { style: { fontWeight: 600 }, children: E.toLocaleDateString() }),
          /* @__PURE__ */ r("div", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.75rem" }, children: E.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
        ] });
      }
    },
    {
      key: "name",
      label: "Sender",
      width: "150px",
      render: (I) => /* @__PURE__ */ r("div", { style: { fontWeight: 600, color: "var(--eg-text-primary, #f9fafb)" }, children: I.name })
    },
    {
      key: "email",
      label: "Email",
      width: "180px",
      render: (I) => /* @__PURE__ */ r(
        "a",
        {
          href: `mailto:${I.email}?subject=Regarding%20your%20inquiry%20to%20${encodeURIComponent(I.appName || "our portal")}`,
          style: {
            color: "var(--eg-color-sky, #38bdf8)",
            textDecoration: "none",
            fontSize: "0.8125rem"
          },
          onClick: (E) => E.stopPropagation(),
          children: I.email
        }
      )
    },
    {
      key: "contact",
      label: "Contact / Phone",
      width: "130px",
      render: (I) => /* @__PURE__ */ r("span", { children: I.contact || "—" })
    },
    {
      key: "appName",
      label: "Application",
      width: "120px",
      render: (I) => /* @__PURE__ */ r(
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
          children: I.appName || "General"
        }
      )
    },
    {
      key: "message",
      label: "Message",
      render: (I) => /* @__PURE__ */ r(
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
          children: I.message
        }
      )
    },
    {
      key: "actions",
      label: "Actions",
      sortable: !1,
      align: "right",
      width: "140px",
      render: (I) => /* @__PURE__ */ c("div", { style: { display: "flex", gap: "6px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ r(
          "button",
          {
            type: "button",
            onClick: (E) => {
              E.stopPropagation(), C(I);
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
            onClick: (E) => {
              E.stopPropagation(), m(I);
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
  return /* @__PURE__ */ c("div", { className: `eg-admin-messages-view ${s}`, style: { display: "flex", flexDirection: "column", gap: "var(--eg-space-6, 24px)", ...l }, children: [
    a && /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: /* @__PURE__ */ r("h2", { style: { fontSize: "var(--eg-text-xl, 1.25rem)", fontWeight: 700, margin: 0, color: "var(--eg-text-primary, #f9fafb)" }, children: a }) }),
    /* @__PURE__ */ c(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--eg-space-4, 16px)"
        },
        children: [
          /* @__PURE__ */ r(
            He,
            {
              title: "Total Inquiries",
              value: A,
              subtitle: "All received user contact messages",
              icon: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
              value: R,
              subtitle: "Messages logged in the last 24 hours",
              icon: /* @__PURE__ */ c("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ r("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ r("polyline", { points: "12 6 12 12 16 14" })
              ] }),
              iconBgColor: "rgba(16, 185, 129, 0.15)",
              iconColor: "var(--eg-color-primary, #10b981)"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ r(
      vn,
      {
        data: u,
        columns: B,
        keyExtractor: (I) => I.id,
        loading: x,
        exportFileName: "contact_inquiries.csv",
        onRowClick: (I) => C(I),
        toolbarSlot: /* @__PURE__ */ c(
          "button",
          {
            type: "button",
            onClick: () => L(),
            disabled: x,
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
              cursor: x ? "not-allowed" : "pointer"
            },
            children: [
              /* @__PURE__ */ c(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  style: { animation: x ? "spin 0.8s linear infinite" : "none" },
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
    b && /* @__PURE__ */ r(
      ct,
      {
        isOpen: !!b,
        onClose: () => C(null),
        title: /* @__PURE__ */ r("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: /* @__PURE__ */ c("span", { children: [
          "Inquiry from ",
          b.name
        ] }) }),
        maxWidth: "640px",
        footer: /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => {
                m(b);
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
          /* @__PURE__ */ c("div", { style: { display: "flex", gap: "8px" }, children: [
            /* @__PURE__ */ c(
              "a",
              {
                href: `mailto:${b.email}?subject=Re:%20Inquiry%20regarding%20${encodeURIComponent(b.appName || "our portal")}`,
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
                  /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
                onClick: () => C(null),
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
        children: /* @__PURE__ */ c("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ c(
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
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Email:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)", fontWeight: 600 }, children: b.email })
                ] }),
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Contact / Phone:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)" }, children: b.contact || "None" })
                ] }),
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Date Received:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-primary, #f9fafb)" }, children: b.createdAt ? new Date(b.createdAt).toLocaleString() : "N/A" })
                ] }),
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-text-muted, #9ca3af)", fontSize: "0.7rem", display: "block" }, children: "Target App:" }),
                  /* @__PURE__ */ r("span", { style: { color: "var(--eg-color-sky, #38bdf8)" }, children: b.appName || "General" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ c("div", { children: [
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
                children: b.message
              }
            )
          ] })
        ] })
      }
    ),
    v && /* @__PURE__ */ r(
      ct,
      {
        isOpen: !!v,
        onClose: () => m(null),
        title: "Confirm Message Deletion",
        maxWidth: "440px",
        footer: /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "flex-end", gap: "8px", width: "100%" }, children: [
          /* @__PURE__ */ r(
            "button",
            {
              type: "button",
              onClick: () => m(null),
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
              disabled: y,
              onClick: z,
              style: {
                padding: "6px 14px",
                background: "#ef4444",
                border: "none",
                borderRadius: "var(--eg-radius-md, 8px)",
                color: "#ffffff",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: y ? "not-allowed" : "pointer"
              },
              children: y ? "Deleting..." : "Delete Permanently"
            }
          )
        ] }),
        children: /* @__PURE__ */ c("p", { style: { color: "var(--eg-text-secondary, #d1d5db)", fontSize: "0.875rem", margin: 0 }, children: [
          "Are you sure you want to permanently delete the message from ",
          /* @__PURE__ */ r("strong", { children: v.name }),
          "? This action cannot be undone."
        ] })
      }
    )
  ] });
};
function Lt(t) {
  return t.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function sl() {
  const t = /* @__PURE__ */ new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
const ys = ({
  initialMetadata: t,
  initialBody: e = "",
  categories: n = ["Programming", "Tutorial", "Architecture", "Security", "Announcements"],
  defaultAuthor: i = "Admin",
  onSave: o,
  title: a = "Blog Article Editor",
  style: l,
  className: s = ""
}) => {
  const [p, d] = W({
    title: (t == null ? void 0 : t.title) || "",
    slug: (t == null ? void 0 : t.slug) || (t != null && t.title ? Lt(t.title) : ""),
    date: (t == null ? void 0 : t.date) || sl(),
    author: (t == null ? void 0 : t.author) || i,
    category: (t == null ? void 0 : t.category) || n[0] || "General",
    tags: (t == null ? void 0 : t.tags) || ["Guide", "Web"],
    description: (t == null ? void 0 : t.description) || ""
  }), [g, u] = W(
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
  ), [h, x] = W(""), [f, b] = W(!0), [C, v] = W("split"), [m, y] = W(!1), [w, L] = W(!1), z = me(null), A = (S) => {
    d((N) => ({
      ...N,
      title: S,
      slug: f ? Lt(S) : N.slug
    }));
  }, R = (S) => {
    const N = S.trim().replace(/^#/, "");
    N && !p.tags.includes(N) && d((k) => ({
      ...k,
      tags: [...k.tags, N]
    })), x("");
  }, B = (S) => {
    d((N) => ({
      ...N,
      tags: N.tags.filter((k) => k !== S)
    }));
  }, j = (S) => {
    S.key === "Enter" || S.key === "," ? (S.preventDefault(), R(h)) : S.key === "Backspace" && !h && p.tags.length > 0 && B(p.tags[p.tags.length - 1]);
  }, I = (S, N = "") => {
    const k = z.current;
    if (!k) return;
    const D = k.selectionStart, O = k.selectionEnd, M = k.value, P = M.slice(D, O), V = `${S}${P || "text"}${N}`, G = M.slice(0, D) + V + M.slice(O);
    u(G), setTimeout(() => {
      k.focus(), k.setSelectionRange(D + S.length, D + S.length + (P ? P.length : 4));
    }, 50);
  }, E = te(() => {
    const S = p.tags.map((k) => `  - "${k}"`).join(`
`), N = p.description.replace(/"/g, '\\"');
    return `---
title: "${p.title}"
slug: "${p.slug}"
date: "${p.date}"
author: "${p.author}"
category: "${p.category}"
description: "${N}"
tags:
${S}
---

${g}
`;
  }, [p, g]), H = () => {
    const S = E();
    navigator.clipboard.writeText(S).then(() => {
      y(!0), setTimeout(() => y(!1), 2e3);
    });
  }, $ = () => {
    const S = E(), N = new Blob([S], { type: "text/markdown;charset=utf-8;" }), k = URL.createObjectURL(N), D = document.createElement("a");
    D.href = k, D.download = `${p.slug || "article"}.md`, document.body.appendChild(D), D.click(), document.body.removeChild(D), URL.revokeObjectURL(k);
  }, U = async () => {
    if (o) {
      L(!0);
      try {
        await o(E(), p);
      } finally {
        L(!1);
      }
    }
  }, _ = p.description.length, T = _ >= 120 && _ <= 160;
  return /* @__PURE__ */ c(
    "div",
    {
      className: `eg-admin-blog-editor ${s}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "var(--eg-space-6, 24px)",
        width: "100%",
        ...l
      },
      children: [
        /* @__PURE__ */ c(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              background: "var(--eg-bg-secondary, #111827)",
              padding: "var(--eg-space-4, 16px) var(--eg-space-5, 20px)",
              borderRadius: "var(--eg-radius-lg, 14px)",
              border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))"
            },
            children: [
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                /* @__PURE__ */ r(
                  "h2",
                  {
                    style: {
                      fontSize: "var(--eg-text-lg, 1.125rem)",
                      fontWeight: 700,
                      color: "var(--eg-text-primary, #f9fafb)",
                      margin: 0
                    },
                    children: a
                  }
                ),
                /* @__PURE__ */ r(
                  "div",
                  {
                    style: {
                      display: "inline-flex",
                      background: "var(--eg-bg-primary, #030712)",
                      padding: "2px",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.1))"
                    },
                    children: ["split", "edit", "preview"].map((S) => /* @__PURE__ */ r(
                      "button",
                      {
                        type: "button",
                        onClick: () => v(S),
                        style: {
                          padding: "4px 10px",
                          borderRadius: "var(--eg-radius-sm, 6px)",
                          border: "none",
                          background: C === S ? "var(--eg-color-primary, #10b981)" : "transparent",
                          color: C === S ? "#ffffff" : "var(--eg-text-muted, #9ca3af)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          cursor: "pointer",
                          transition: "background var(--eg-transition-fast, 150ms)"
                        },
                        children: S === "split" ? "Split View" : S === "edit" ? "Editor" : "Preview"
                      },
                      S
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: H,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      background: m ? "rgba(16, 185, 129, 0.2)" : "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid",
                      borderColor: m ? "var(--eg-color-primary, #10b981)" : "var(--eg-border, rgba(255,255,255,0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: m ? "var(--eg-color-primary, #10b981)" : "var(--eg-text-primary, #f9fafb)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer"
                    },
                    children: [
                      /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                        /* @__PURE__ */ r("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: m ? "Copied Markdown!" : "Copy Markdown" })
                    ]
                  }
                ),
                /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    onClick: $,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      background: "var(--eg-bg-tertiary, #1f2937)",
                      border: "1px solid var(--eg-border, rgba(255,255,255,0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer"
                    },
                    children: [
                      /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                        /* @__PURE__ */ r("polyline", { points: "7 10 12 15 17 10" }),
                        /* @__PURE__ */ r("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: "Download .md" })
                    ]
                  }
                ),
                o && /* @__PURE__ */ c(
                  "button",
                  {
                    type: "button",
                    disabled: w,
                    onClick: U,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 14px",
                      background: "var(--eg-color-primary, #10b981)",
                      border: "none",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: "#ffffff",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: w ? "not-allowed" : "pointer"
                    },
                    children: [
                      /* @__PURE__ */ c("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ r("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }),
                        /* @__PURE__ */ r("polyline", { points: "17 21 17 13 7 13 7 21" }),
                        /* @__PURE__ */ r("polyline", { points: "7 3 7 8 15 8" })
                      ] }),
                      /* @__PURE__ */ r("span", { children: w ? "Saving..." : "Save Article" })
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ c(
          "div",
          {
            style: {
              background: "var(--eg-bg-secondary, #111827)",
              border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
              borderRadius: "var(--eg-radius-lg, 14px)",
              padding: "var(--eg-space-5, 20px)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--eg-space-4, 16px)"
            },
            children: [
              /* @__PURE__ */ c("div", { style: { gridColumn: "span 2" }, children: [
                /* @__PURE__ */ r("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)", marginBottom: "4px" }, children: "Article Title *" }),
                /* @__PURE__ */ r(
                  "input",
                  {
                    type: "text",
                    value: p.title,
                    onChange: (S) => A(S.target.value),
                    placeholder: "e.g. Modern Full-Stack Architecture with React & Cloud Services",
                    style: {
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--eg-bg-primary, #030712)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      outline: "none",
                      boxSizing: "border-box"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { children: [
                /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }, children: [
                  /* @__PURE__ */ r("label", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)" }, children: "URL Slug *" }),
                  /* @__PURE__ */ r(
                    "button",
                    {
                      type: "button",
                      onClick: () => b(!f),
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
                    onChange: (S) => d({ ...p, slug: Lt(S.target.value) }),
                    placeholder: "article-url-slug",
                    style: {
                      width: "100%",
                      padding: "8px 12px",
                      background: f ? "var(--eg-bg-tertiary, #1f2937)" : "var(--eg-bg-primary, #030712)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: f ? "var(--eg-text-muted, #9ca3af)" : "var(--eg-text-primary, #f9fafb)",
                      fontFamily: "var(--eg-font-mono, monospace)",
                      fontSize: "0.8125rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }, children: [
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)", marginBottom: "4px" }, children: "Category" }),
                  /* @__PURE__ */ r(
                    "select",
                    {
                      value: p.category,
                      onChange: (S) => d({ ...p, category: S.target.value }),
                      style: {
                        width: "100%",
                        padding: "8px 12px",
                        background: "var(--eg-bg-primary, #030712)",
                        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        color: "var(--eg-text-primary, #f9fafb)",
                        fontSize: "0.8125rem",
                        outline: "none",
                        cursor: "pointer"
                      },
                      children: n.map((S) => /* @__PURE__ */ r("option", { value: S, children: S }, S))
                    }
                  )
                ] }),
                /* @__PURE__ */ c("div", { children: [
                  /* @__PURE__ */ r("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)", marginBottom: "4px" }, children: "Author" }),
                  /* @__PURE__ */ r(
                    "input",
                    {
                      type: "text",
                      value: p.author,
                      onChange: (S) => d({ ...p, author: S.target.value }),
                      style: {
                        width: "100%",
                        padding: "8px 12px",
                        background: "var(--eg-bg-primary, #030712)",
                        border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                        borderRadius: "var(--eg-radius-md, 8px)",
                        color: "var(--eg-text-primary, #f9fafb)",
                        fontSize: "0.8125rem",
                        outline: "none",
                        boxSizing: "border-box"
                      }
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ c("div", { style: { gridColumn: "span 2" }, children: [
                /* @__PURE__ */ r("label", { style: { display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)", marginBottom: "4px" }, children: "Tags (Press Enter or Comma to add)" }),
                /* @__PURE__ */ c(
                  "div",
                  {
                    style: {
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      background: "var(--eg-bg-primary, #030712)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      minHeight: "42px"
                    },
                    children: [
                      p.tags.map((S) => /* @__PURE__ */ c(
                        "span",
                        {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "2px 8px",
                            background: "rgba(16, 185, 129, 0.15)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            borderRadius: "var(--eg-radius-sm, 6px)",
                            color: "var(--eg-color-primary, #10b981)",
                            fontSize: "0.75rem",
                            fontWeight: 600
                          },
                          children: [
                            "#",
                            S,
                            /* @__PURE__ */ r(
                              "button",
                              {
                                type: "button",
                                onClick: () => B(S),
                                style: {
                                  background: "none",
                                  border: "none",
                                  color: "var(--eg-color-primary, #10b981)",
                                  cursor: "pointer",
                                  padding: "0 2px",
                                  fontSize: "0.75rem"
                                },
                                children: "✕"
                              }
                            )
                          ]
                        },
                        S
                      )),
                      /* @__PURE__ */ r(
                        "input",
                        {
                          type: "text",
                          value: h,
                          onChange: (S) => x(S.target.value),
                          onKeyDown: j,
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
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ c("div", { style: { gridColumn: "span 2" }, children: [
                /* @__PURE__ */ c("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }, children: [
                  /* @__PURE__ */ r("label", { style: { fontSize: "0.75rem", fontWeight: 600, color: "var(--eg-text-muted, #9ca3af)" }, children: "Summary Description (for SEO Cards & Previews) *" }),
                  /* @__PURE__ */ c(
                    "span",
                    {
                      style: {
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        color: T ? "#34d399" : "var(--eg-text-muted, #9ca3af)"
                      },
                      children: [
                        _,
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
                    onChange: (S) => d({ ...p, description: S.target.value }),
                    placeholder: "A concise, compelling overview of the article topics...",
                    style: {
                      width: "100%",
                      padding: "8px 12px",
                      background: "var(--eg-bg-primary, #030712)",
                      border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.12))",
                      borderRadius: "var(--eg-radius-md, 8px)",
                      color: "var(--eg-text-primary, #f9fafb)",
                      fontSize: "0.8125rem",
                      lineHeight: 1.5,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box"
                    }
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ c(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: C === "split" ? "1fr 1fr" : "1fr",
              gap: "var(--eg-space-4, 16px)",
              minHeight: "600px"
            },
            children: [
              (C === "split" || C === "edit") && /* @__PURE__ */ c(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--eg-bg-secondary, #111827)",
                    border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
                    borderRadius: "var(--eg-radius-lg, 14px)",
                    overflow: "hidden"
                  },
                  children: [
                    /* @__PURE__ */ r(
                      "div",
                      {
                        style: {
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: "4px",
                          padding: "8px 12px",
                          background: "var(--eg-bg-tertiary, #1a2234)",
                          borderBottom: "1px solid var(--eg-border, rgba(255, 255, 255, 0.06))"
                        },
                        children: [
                          { label: "B", title: "Bold", action: () => I("**", "**") },
                          { label: "I", title: "Italic", action: () => I("*", "*") },
                          { label: "H2", title: "Heading 2", action: () => I("## ") },
                          { label: "H3", title: "Heading 3", action: () => I("### ") },
                          { label: "`Code`", title: "Inline Code", action: () => I("`", "`") },
                          { label: "``` Block", title: "Code Block", action: () => I("```ts\n", "\n```") },
                          { label: "Quote", title: "Blockquote", action: () => I("> ") },
                          { label: "List", title: "Bullet List", action: () => I("- ") },
                          { label: "Link", title: "Hyperlink", action: () => I("[", "](https://example.com)") }
                        ].map((S, N) => /* @__PURE__ */ r(
                          "button",
                          {
                            type: "button",
                            title: S.title,
                            onClick: S.action,
                            style: {
                              padding: "4px 8px",
                              background: "var(--eg-bg-secondary, #111827)",
                              border: "1px solid var(--eg-border, rgba(255,255,255,0.08))",
                              borderRadius: "var(--eg-radius-sm, 6px)",
                              color: "var(--eg-text-primary, #f9fafb)",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer"
                            },
                            children: S.label
                          },
                          N
                        ))
                      }
                    ),
                    /* @__PURE__ */ r(
                      "textarea",
                      {
                        ref: z,
                        value: g,
                        onChange: (S) => u(S.target.value),
                        placeholder: "Write your article in Markdown format...",
                        style: {
                          flex: 1,
                          width: "100%",
                          padding: "16px",
                          background: "var(--eg-bg-primary, #030712)",
                          color: "var(--eg-text-primary, #f9fafb)",
                          fontFamily: "var(--eg-font-mono, monospace)",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          border: "none",
                          outline: "none",
                          resize: "none",
                          boxSizing: "border-box",
                          minHeight: "520px"
                        }
                      }
                    )
                  ]
                }
              ),
              (C === "split" || C === "preview") && /* @__PURE__ */ c(
                "div",
                {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    background: "var(--eg-bg-secondary, #111827)",
                    border: "1px solid var(--eg-border, rgba(255, 255, 255, 0.08))",
                    borderRadius: "var(--eg-radius-lg, 14px)",
                    overflow: "hidden"
                  },
                  children: [
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
                    /* @__PURE__ */ c(
                      "div",
                      {
                        style: {
                          flex: 1,
                          padding: "24px",
                          overflowY: "auto",
                          maxHeight: "700px",
                          background: "var(--eg-bg-primary, #030712)"
                        },
                        children: [
                          /* @__PURE__ */ c("div", { style: { marginBottom: "24px", borderBottom: "1px solid var(--eg-border, rgba(255,255,255,0.08))", paddingBottom: "16px" }, children: [
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
                            /* @__PURE__ */ c("div", { style: { fontSize: "0.8125rem", color: "var(--eg-text-muted, #9ca3af)" }, children: [
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
                          /* @__PURE__ */ r(Qt, { content: g })
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
}, bs = (t = "data/apps.json") => {
  const [e, n] = W([]), [i, o] = W(!0), [a, l] = W(null), s = typeof t == "string" ? { productsUrl: t, syncGithub: !1 } : { syncGithub: !1, ...t }, p = te(async () => {
    try {
      o(!0);
      const d = await we.getProducts(s.productsUrl || t);
      n([...d]), s.syncGithub && we.syncGithubVersions(d, (g, u) => {
        n(
          (h) => h.map((x) => x.id === g ? { ...x, version: u } : x)
        );
      });
    } catch (d) {
      l(d instanceof Error ? d : new Error(String(d)));
    } finally {
      o(!1);
    }
  }, [t]);
  return Y(() => {
    p();
  }, [p]), { products: e, loading: i, error: a, refresh: p };
}, vs = (t, e, n) => {
  const [i, o] = W([]), [a, l] = W(!0), [s, p] = W(null), d = te(async () => {
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
    d();
  }, [d]), { blogs: i, loading: a, error: s, refresh: d };
}, ws = (t) => {
  const [e, n] = W([]), [i, o] = W(!0);
  return Y(() => {
    let a = !0;
    return we.getNews(t).then((l) => {
      a && (n(l), o(!1));
    }), () => {
      a = !1;
    };
  }, [t]), { news: e, loading: i };
}, ks = (t, e) => {
  const [n, i] = W(null), [o, a] = W(!0);
  return Y(() => {
    let l = !0;
    return we.getPageContent(t, e).then((s) => {
      l && (i(s), a(!1));
    }), () => {
      l = !1;
    };
  }, [t, e]), { content: n, loading: o };
}, Ss = ({
  appName: t,
  firebaseConfig: e,
  firestoreCollection: n,
  consentStorageKey: i,
  sessionStorageKey: o,
  onLogReady: a,
  enabled: l = !0,
  requireExplicitConsent: s = !1
} = {}) => {
  var b, C;
  const p = wt(), d = e || ((b = p.config) != null && b.apiKey ? p.config : void 0), g = t || (p.appName && p.appName !== "web-app" ? p.appName : typeof window < "u" && window.location.hostname ? window.location.hostname : "web-app"), u = n || ((C = p.collections) == null ? void 0 : C.analytics) || "visitor_analytics", h = i || ke, x = o || Ye, f = me(!1);
  Y(() => {
    if (!l) return;
    let v = !0;
    const m = async () => {
      if (!qt(h) && !(s && !Si(h)) && !jr(x) && !f.current) {
        f.current = !0;
        try {
          const w = await Ai(g, {
            consentStorageKey: h,
            sessionStorageKey: x
          });
          if (!v || !w) {
            f.current = !1;
            return;
          }
          let L = !0;
          if (d && d.apiKey)
            try {
              const { db: z } = await Le(d, g === "web-app" ? void 0 : g);
              z ? L = await Ii(z, w, {
                collectionName: u
              }) : L = !1;
            } catch (z) {
              L = !1, console.warn("[useVisitorTracker] Auto Firestore write warning:", z);
            }
          a && Promise.resolve(a(w)).catch((z) => {
            console.warn("[useVisitorTracker] Custom log handler error:", z);
          }), L && Ci(x);
        } finally {
          f.current = !1;
        }
      }
    };
    m();
    const y = (w) => {
      w.detail === "granted" && m();
    };
    return window.addEventListener("analytics_consent_changed", y), window.addEventListener("eg_consent_changed", y), () => {
      v = !1, window.removeEventListener("analytics_consent_changed", y), window.removeEventListener("eg_consent_changed", y);
    };
  }, [g, d, u, h, x, a, l, s]);
};
function Cs(t = "data/updates.json") {
  const e = typeof t == "string" ? t.includes("/") && !t.endsWith(".json") ? { githubRepo: t } : { updatesUrl: t } : t, [n, i] = W(e.initialUpdates || []), [o, a] = W(!e.initialUpdates || e.initialUpdates.length === 0), [l, s] = W(null), p = te(async (g = !1) => {
    a(!0), s(null);
    try {
      const u = await Fa({ ...e, forceRefresh: g });
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
  const d = te(() => p(!0), [p]);
  return {
    updates: n,
    loading: o,
    error: l,
    refresh: d
  };
}
export {
  Rl as AcademicCapIcon,
  xs as AdminAnalyticsView,
  fs as AdminAuthGuard,
  ys as AdminBlogEditor,
  us as AdminLayout,
  ll as AdminLoginForm,
  ms as AdminMessagesView,
  Nl as AnalyticsIcon,
  Ki as ArrowDownIcon,
  Ui as ArrowLeftIcon,
  Gi as ArrowRightIcon,
  qi as ArrowUpIcon,
  mi as BUCKET_PAGE_SIZE,
  ye as Badge,
  ln as BalanceScaleIcon,
  kl as BarsIcon,
  wo as BellIcon,
  Da as BlogCard,
  ss as BlogList,
  as as BlogPostView,
  ls as BlogSidebar,
  Yr as BoltIcon,
  Xr as BookIcon,
  Wl as BookOpenIcon,
  To as BookmarkIcon,
  en as BrainIcon,
  Po as BugIcon,
  Yo as BullhornIcon,
  Tl as BullseyeIcon,
  Wt as Button,
  xt as CLOUD_DEV_PREFIX,
  _t as CLOUD_EMAIL_PREFIX,
  ft as CLOUD_HWCORE_PREFIX,
  ut as CLOUD_HW_PREFIX,
  Mt as CLOUD_PHONE_PREFIX,
  ke as CONSENT_STORAGE_KEY,
  or as CacheBuster,
  Bo as CalendarIcon,
  nn as ChartLineIcon,
  $o as CheckCircleIcon,
  Ji as CheckIcon,
  Sa as ChessBishopIcon,
  Ca as ChessBoardIcon,
  Bi as ChessComIcon,
  wa as ChessKingIcon,
  Kt as ChessKnightIcon,
  Hr as ChessPawnIcon,
  va as ChessQueenIcon,
  ka as ChessRookIcon,
  Xi as ChevronDownIcon,
  Zi as ChevronLeftIcon,
  Yi as ChevronRightIcon,
  Qi as ChevronUpIcon,
  pa as ClipboardIcon,
  Ro as ClockIcon,
  Vr as CloseIcon,
  Uo as CloudIcon,
  pn as CodeBranchIcon,
  Fo as CodeIcon,
  qr as CogIcon,
  oa as CompassIcon,
  bo as CompressIcon,
  ml as ConsentBanner,
  yl as ConsentControl,
  hs as ContactForm,
  es as Container,
  _l as ControllerIcon,
  oo as CopyIcon,
  Kr as CpuIcon,
  ba as CrosshairsIcon,
  da as CrownIcon,
  dn as CutIcon,
  Cr as DEFAULT_FIREBASE_COLLECTIONS,
  Ke as DEFAULT_FIREBASE_CONFIG,
  Ja as DEFAULT_LOCKOUT_DURATION_MS,
  Xa as DEFAULT_MAX_FAIL_ATTEMPTS,
  wn as DEFAULT_PIN_SALT,
  Xt as DEFAULT_SESSION_KEY,
  we as DataCache,
  fi as DataCacheService,
  vn as DataGrid,
  Oo as DatabaseIcon,
  Ho as DesktopIcon,
  ps as DesktopPreviewSimulator,
  $i as DiscordIcon,
  ds as DocsViewer,
  hn as DoorOpenIcon,
  no as DownloadIcon,
  Lo as EditIcon,
  Zt as EnvelopeIcon,
  yo as ExpandIcon,
  ao as ExternalLinkIcon,
  sa as EyeIcon,
  ca as EyeSlashIcon,
  Ti as FacebookIcon,
  fo as FastBackwardIcon,
  xo as FastForwardIcon,
  lo as FilterIcon,
  rn as FireIcon,
  Ar as FirebaseContext,
  ul as FirebaseProvider,
  la as FlagIcon,
  jl as FlameIcon,
  Xl as Footer,
  ql as ForkIcon,
  Jr as GamepadIcon,
  _i as GitHubIcon,
  Dl as GlobeAsiaIcon,
  Ct as GlobeIcon,
  Yt as GraduationCapIcon,
  aa as HandshakeIcon,
  Ql as Header,
  zo as HeartIcon,
  ga as HistoryIcon,
  vo as HomeIcon,
  Yl as Icon,
  Jl as ImageSlider,
  _o as InfoIcon,
  Wi as InstagramIcon,
  ma as KeyboardIcon,
  el as LOGS_PER_BUCKET_DOC,
  ia as LandmarkIcon,
  cn as LayerGroupIcon,
  Ul as LayersIcon,
  Bl as LearnIcon,
  Ri as LichessIcon,
  xa as LightbulbIcon,
  Mi as LinkedInIcon,
  Fl as ListAltIcon,
  an as ListIcon,
  ko as LockIcon,
  Nr as Logo,
  Hl as MailIcon,
  Pl as MapMarkerIcon,
  on as MapPinIcon,
  Qt as MarkdownViewer,
  Fi as MastodonIcon,
  os as MdViewer,
  Xo as MedalIcon,
  Ur as MenuIcon,
  Al as MicrochipIcon,
  Ko as MicroscopeIcon,
  ct as Modal,
  Ao as MoonIcon,
  ua as NetworkWiredIcon,
  ta as NewspaperIcon,
  Bn as NotificationBell,
  rs as PageHeader,
  ya as PaletteIcon,
  Fr as PaperPlaneIcon,
  $l as ParchmentIcon,
  po as PauseIcon,
  Oi as PinterestIcon,
  co as PlayIcon,
  Aa as ProductCard,
  is as ProductDetail,
  ns as ProductGrid,
  Jo as PuzzleIcon,
  Eo as QuestionCircleIcon,
  ea as QuoteIcon,
  ji as RedditIcon,
  ro as RedoIcon,
  Gr as RefreshIcon,
  Go as RobotIcon,
  qo as RocketIcon,
  Ye as SESSION_STORAGE_KEY,
  kr as STORAGE_KEY,
  Ol as ScaleIcon,
  Gl as ScissorsIcon,
  tn as ScrollIcon,
  eo as SearchIcon,
  ts as Section,
  vl as SendMailIcon,
  Vo as ServerIcon,
  Cl as SettingsIcon,
  Kl as ShareAltIcon,
  gn as ShareIcon,
  Gt as ShareModal,
  No as ShieldCheckIcon,
  jo as ShieldIcon,
  Zl as SignOutIcon,
  ha as SignalIcon,
  Vl as SkullCrossbonesIcon,
  sn as SkullIcon,
  so as SlidersIcon,
  Li as SmartScrollButton,
  Or as SocialIcon,
  Zo as SparklesIcon,
  mo as SpinnerIcon,
  Vi as SpotifyIcon,
  Wo as StarIcon,
  He as StatCard,
  ho as StepBackwardIcon,
  uo as StepForwardIcon,
  go as StopIcon,
  fa as StopwatchIcon,
  Co as SunIcon,
  Sl as SyncIcon,
  Jt as THEMES,
  Qr as TargetIcon,
  Di as TelegramIcon,
  Sr as ThemeContext,
  gl as ThemeProvider,
  Ir as ThemeToggle,
  Hi as ThreadsIcon,
  Ni as TikTokIcon,
  Do as TimesCircleIcon,
  wl as TimesIcon,
  Il as ToolsIcon,
  xl as TotemTicker,
  Ml as TrainIcon,
  Io as TrashIcon,
  Qo as TrophyIcon,
  zl as TvIcon,
  Pi as TwitchIcon,
  bl as TwitterIcon,
  to as UndoIcon,
  So as UnlockIcon,
  cs as UpdatesTimeline,
  io as UploadIcon,
  ra as UserIcon,
  na as UsersIcon,
  Mo as WarningIcon,
  Ei as WhatsAppIcon,
  El as WorldIcon,
  Zr as WrenchIcon,
  Pr as XTwitterIcon,
  zi as YouTubeIcon,
  Ll as ZapIcon,
  al as adminSignOut,
  Ai as assembleVisitorLog,
  bt as checkAdminLockout,
  Ka as checkCloudContactRateLimit,
  yn as checkContactRateLimit,
  rl as clearAdminLockout,
  qe as clearAdminSession,
  gs as clearContactRateLimit,
  tl as computePinHash,
  za as createCustomMarkedRenderer,
  wi as detectBrowser,
  vi as detectOS,
  Na as detectPlatform,
  mn as enhanceMarkdownContainer,
  Ln as ensureFirebaseAuthSDK,
  In as ensureFirebaseSDK,
  La as ensureMermaidLoaded,
  Ta as ensurePrismLoaded,
  Ce as escapeHtmlEntities,
  Pa as extractHighlightsFromMarkdown,
  ki as fetchGeoLocation,
  ur as fetchGitHubReleases,
  fr as fetchUpdatesFromJson,
  bn as flushOfflineContactMessages,
  Ea as formatBytes,
  ja as formatReleaseDate,
  Ga as generateMathCaptcha,
  fl as getAppSlug,
  xi as getBlogSlug,
  mt as getClientIP,
  Dt as getFirebaseAuth,
  Tn as getFirestore,
  hl as getFoucPreventScript,
  Xe as getHardwareCoreFingerprint,
  Je as getHardwareFingerprint,
  Qe as getMachineFingerprint,
  bi as getTodayDateString,
  At as getUserIdentityHashes,
  fn as highlightCode,
  Le as initFirebase,
  yr as isAdminSessionVerified,
  qt as isConsentDenied,
  Si as isConsentGranted,
  jr as isSessionLogged,
  Fa as loadUpdates,
  kn as logAdminLoginAttempt,
  Ci as markSessionLogged,
  Ha as normalizeCategory,
  qa as normalizeGpuRenderer,
  gr as normalizeMarkdown,
  _a as openImageLightbox,
  ot as openMermaidFullscreenModal,
  xn as parseMarkdownToHtml,
  $t as recordAdminFailedAttempt,
  Za as recordCloudContactRateLimit,
  ze as recordContactSubmissionTime,
  Ae as sanitizeHtml,
  yt as sanitizeIPKey,
  ne as sanitizeUrl,
  nl as setAdminSessionVerified,
  il as signInWithGooglePopup,
  Ia as slugify,
  Ya as submitContactInquiry,
  Wa as transformAlertCallouts,
  Sn as useAdminAuth,
  vs as useBlogs,
  wt as useFirebase,
  ws as useNews,
  Wn as useNotifications,
  ks as usePageContent,
  bs as useProducts,
  vt as useTheme,
  Cs as useUpdates,
  Ss as useVisitorTracker,
  ol as verifyAdminPin,
  Ii as writeVisitorLogToFirestore
};
//# sourceMappingURL=index.js.map
