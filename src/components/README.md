# EG-Web-Core Components Directory (`src/components/`)

This directory houses all generic, accessible, website-agnostic React components used across EG1 web platforms.

---

## 📁 Subdirectory Structure

| Directory | Scope & Purpose | Example Components |
|---|---|---|
| [`common/`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/components/common) | Universal UI primitives & feedback widgets | `Button`, `Badge`, `Modal`, `Spinner`, `SmartScrollButton`, `ConsentBanner`, `NotificationBell` |
| [`layout/`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/components/layout) | Structural page layouts & shells | `Container`, `Section`, `Header`, `Footer`, `ImageSlider` |
| [`content/`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/components/content) | Information display & catalog views | `ProductCard`, `ProductGrid`, `ProductDetail`, `MarkdownArticle`, `TableOfContents` |
| [`admin/`](file:///home/gautam/AntigravityProjects/EG1-LIVE-WEBSITES/eg-web-core/src/components/admin) | Administrative back-office suite | `AdminLayout`, `AdminDataTable`, `AdminAuditLog`, `AdminStatsCard` |

---

## 📋 How to Add a New Component

1. **Create Component & Styles**:
   Create `MyComponent.tsx` and `MyComponent.css` in the appropriate subdirectory.
2. **Follow Critical Rule 5 (Neutral Defaults)**:
   - Provide default props for every optional attribute.
   - Do not hardcode brand-specific names, URLs, or colors. Use CSS variables (`var(--eg-...)`).
3. **Export Hierarchy**:
   - Add export to `src/components/<category>/index.ts`
   - Add export to `src/index.ts`
4. **Compile & Build**:
   ```bash
   npm run build
   ```

---

## 🎨 Token Usage in Components

Always utilize standardized tokens rather than hardcoded colors:
```css
/* Recommended */
.eg-custom-card {
  background: var(--eg-bg-surface);
  color: var(--eg-text-primary);
  border: 1px solid var(--eg-border-subtle);
  border-radius: var(--eg-radius-md);
}
```

