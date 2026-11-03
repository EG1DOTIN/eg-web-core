# EG-Web-Core Custom Hooks (`src/hooks/`)

This directory provides headless React state and data-fetching hooks decoupled from UI presentation.

---

## 🪝 Available Custom Hooks

| Hook | Source File | Purpose | Key Return Values |
|---|---|---|---|
| `useProducts` | [`useProducts.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useProducts.ts) | Fetches and caches product catalog JSON with category filtering | `{ products, loading, error, refresh }` |
| `useNews` | [`useNews.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useNews.ts) | Loads announcements and blog posts from JSON store | `{ news, loading, error }` |
| `useUpdates` | [`useUpdates.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useUpdates.ts) | Parses changelog updates with tag taxonomy | `{ updates, loading, categories }` |
| `useNotifications` | [`useNotifications.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useNotifications.ts) | Tracks unseen update count in `localStorage` | `{ unreadCount, markAllAsRead, latestItems }` |
| `useVisitorTracker`| [`useVisitorTracker.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useVisitorTracker.ts) | GDPR-compliant 50-record batched bucket telemetry writer | `{ trackEvent, consentGranted }` |
| `useAdminAuth` | [`useAdminAuth.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useAdminAuth.ts) | Google OAuth + 16-Digit PIN 2FA verification | `{ user, isPinVerified, login, verifyPin, logout }` |
| `useScrollPosition`| [`useScrollPosition.ts`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/hooks/useScrollPosition.ts) | Debounced window scroll watcher for sticky headers and scroll-to-top | `{ scrollY, isScrollingUp, atTop, atBottom }` |

---

## 📋 How to Add a New Hook

1. Create `src/hooks/useMyFeature.ts`.
2. Define clear TypeScript interfaces for options and return values.
3. Export from `src/hooks/index.ts` and `src/index.ts`.
4. Run `npm run typecheck` to verify strict compilation.

