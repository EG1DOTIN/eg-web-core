# EG-Web-Core Custom Hooks (`src/hooks/`)

This directory provides headless React state and data-fetching hooks decoupled from UI presentation.

---

## 🪝 Available Custom Hooks

| Hook | Source File | Purpose | Key Return Values |
|---|---|---|---|
| `useProducts` | [`useProducts.ts`](./useProducts.ts) | Fetches and caches product catalog JSON with category filtering | `{ products, loading, error, refresh }` |
| `useNews` | [`useNews.ts`](./useNews.ts) | Loads announcements and blog posts from JSON store | `{ news, loading, error }` |
| `useUpdates` | [`useUpdates.ts`](./useUpdates.ts) | Parses changelog updates with tag taxonomy | `{ updates, loading, categories }` |
| `useNotifications` | [`useNotifications.ts`](./useNotifications.ts) | Tracks unseen update count in `localStorage` | `{ unreadCount, markAllAsRead, latestItems }` |
| `useVisitorTracker`| [`useVisitorTracker.ts`](./useVisitorTracker.ts) | GDPR-compliant 50-record batched bucket telemetry writer | `{ trackEvent, consentGranted }` |
| `useAdminAuth` | [`useAdminAuth.ts`](./useAdminAuth.ts) | Google OAuth + 16-Digit PIN 2FA verification | `{ user, isPinVerified, login, verifyPin, logout }` |
| `useScrollPosition`| [`useScrollPosition.ts`](./useScrollPosition.ts) | Debounced window scroll watcher for sticky headers and scroll-to-top | `{ scrollY, isScrollingUp, atTop, atBottom }` |

---

## 📋 How to Add a New Hook

1. Create `src/hooks/useMyFeature.ts`.
2. Define clear TypeScript interfaces for options and return values.
3. Export from `src/hooks/index.ts` and `src/index.ts`.
4. Run `npm run typecheck` to verify strict compilation.

