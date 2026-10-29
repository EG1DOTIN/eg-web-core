import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import '../tokens/tokens.css';
import {
  ThemeProvider,
  Header,
  Footer,
  ImageSlider,
  SlideItem,
  Container,
  Section,
  PageHeader,
  TotemTicker,
  ProductGrid,
  BlogList,
  UpdatesTimeline,
  DocsViewer,
  MarkdownViewer,
  Button,
  Badge,
  Modal,
  ConsentBanner,
  ConsentControl,
  ContactForm,
  ProductItem,
  BlogPostItem,
  UpdateEntry,
} from '../index';
import { CORE_DOCUMENTATION_ARTICLES } from './docsData';

/* -------------------------------------------------------------------------- */
/* Consumer Web App Example Mock Data (Acme Demo Store)                       */
/* -------------------------------------------------------------------------- */

const EXAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 'demo-widget-a',
    slug: 'acme-demo-widget-a',
    title: 'Acme Demo Widget A',
    subtitle: 'Illustrative Component Model & Card Template',
    category: 'Sample Widgets',
    description:
      'A simple demonstration product showing how ProductGrid, badges, pricing slots, and action buttons render with responsive styling.',
    version: '1.0.0-demo',
    webapp_link: '#',
    button1: { label: 'Sample Action', url: '#' },
    button2: { label: 'Demo Docs', url: '#insights' },
  },
  {
    id: 'sample-tshirt',
    slug: 'acme-sample-tshirt',
    title: 'Acme Sample T-Shirt',
    subtitle: 'Demonstration Retail Apparel Item',
    category: 'Apparel Demo',
    description:
      'Placeholder e-commerce product showcasing retail layout tags, size indicators, and secondary modal trigger actions.',
    version: 'Sample Item',
    webapp_link: '#',
    button1: { label: 'View Sample', url: '#' },
    button2: { label: 'Size Chart', url: '#' },
  },
  {
    id: 'test-gadget-pro',
    slug: 'acme-test-gadget-pro',
    title: 'Acme Test Gadget Pro',
    subtitle: 'Sample Hardware & Specifications Preview',
    category: 'Electronics Demo',
    description:
      'Dummy hardware specification item showing feature bullet points, tags, and container grid responsiveness across mobile and desktop.',
    version: 'Beta-0.1',
    webapp_link: '#',
    button1: { label: 'Inspect Specs', url: '#' },
    button2: { label: 'Demo Manual', url: '#' },
  },
];

const EXAMPLE_BLOG_POSTS: BlogPostItem[] = [
  {
    id: '1',
    slug: 'welcome-to-acme-demo-store',
    title: 'Welcome to the Acme Demo Store Example',
    description:
      'An illustrative guide demonstrating how BlogList, MarkdownViewer, and reading time tags format dynamic posts in your app.',
    date: 'Oct 26, 2026',
    author: 'Demo Author',
    readingTime: '3 min read',
    tags: ['sample', 'demo', 'tutorial'],
    content: `
### Example Markdown Article
This is an illustrative sample article demonstrating the **MarkdownViewer** component provided by \`eg-web-core\`.

- **Formatted Lists**: Automatic typography and padding using design tokens.
- **Code Highlighting**: Syntax styling for snippets and command examples.
- **Zero-Backend Reads**: Static Markdown content rendered directly without expensive cloud queries.

\`\`\`tsx
import { BlogList, MarkdownViewer } from 'eg-web-core';
\`\`\`
    `,
  },
  {
    id: '2',
    slug: 'customizing-components-in-consumer-apps',
    title: 'How Consumer Applications Customize Base Library Components',
    description:
      'A walkthrough showing how website projects configure logos, headers, footers, and color themes.',
    date: 'Oct 22, 2026',
    author: 'Sample Staff',
    readingTime: '4 min read',
    tags: ['guide', 'architecture', 'theming'],
    content: `
### Complete Configurability
Consumer applications configure their own visual identity by passing simple props or wrapping base components:

- **Custom Logo**: Use \`brandLogo\` in \`<Header />\` to render your customized project logo.
- **Neutral Defaults**: Components work out-of-the-box without hardcoded vendor branding.
- **Theme Variables**: Easily switch between light, dark, and crystal gradient color themes.
    `,
  },
];

const EXAMPLE_UPDATES: UpdateEntry[] = [
  {
    id: 'upd-1-2-0',
    version: '1.2.0-demo',
    date: 'October 2026',
    title: 'Acme Demo Store Version 1.2 Update',
    category: 'FEATURE',
    description: 'Sample release changelog entry demonstrating the UpdatesTimeline component.',
    highlights: [
      'Added sample widget product cards to demonstrate the ProductGrid layout.',
      'Demonstrated responsive grid behavior across mobile, tablet, and desktop.',
      'Tested modal contact form dialogs with math CAPTCHA verification.',
    ],
  },
  {
    id: 'upd-1-0-0',
    version: '1.0.0-demo',
    date: 'September 2026',
    title: 'Initial Demo Application Setup',
    category: 'SETUP',
    description: 'Initial demonstration application demonstrating EGWebCore component integration.',
    highlights: [
      'Configured universal Header and Footer custom presets.',
      'Enabled ThemeToggle, NotificationBell, and interactive news ticker.',
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Portal Hero Banner Slides (Consumer Portals & Architecture News Highlights) */
/* -------------------------------------------------------------------------- */

const PORTAL_HERO_SLIDES: SlideItem[] = [
  {
    title: 'Modular Component Architecture',
    subtitle: 'Universal React 18 UI primitives, unified design tokens, and high-performance layout components designed for scalable, resilient web applications.',
    badge: 'Core Architecture',
    buttonLabel: 'Explore Components',
    buttonHref: '#components',
    crystalThemeIndex: 1,
  },
  {
    title: 'Zero Firestore Billing Spikes',
    subtitle: 'DataCache static JSON + SWR caching shields backend quotas from unexpected cost spikes with deterministic sub-millisecond client loads.',
    badge: 'Architecture News',
    buttonLabel: 'Read Caching Guide',
    buttonHref: '#docs',
    crystalThemeIndex: 2,
  },
  {
    title: 'Batched Bucket Telemetry & 2FA Defense',
    subtitle: '50-record bucket telemetry reduces cloud write operations by 98% with hardened three-tier administrative lockout defense.',
    badge: 'Security News',
    buttonLabel: 'Security Specs',
    buttonHref: '#docs',
    crystalThemeIndex: 3,
  },
  {
    title: 'Responsive & Accessible Design System',
    subtitle: 'Dynamic dark/light themes, widescreen responsive layouts, and WCAG accessibility standards across all screen sizes.',
    badge: 'Design System',
    buttonLabel: 'Explore Playground',
    buttonHref: '#components',
    crystalThemeIndex: 4,
  },
];

/* -------------------------------------------------------------------------- */
/* Main Application Component: Dual-Mode EGWebCore Portal & Sample App        */
/* -------------------------------------------------------------------------- */

export const ShowcaseApp: React.FC = () => {
  // 'portal': The Official EGWebCore Library Website
  // 'example': The Full Consumer Web App Example (Acme Demo Store)
  const [appMode, setAppMode] = useState<'portal' | 'example'>('portal');

  // Active section in Portal mode: 'overview' | 'features' | 'docs' | 'components'
  const [portalSection, setPortalSection] = useState<'overview' | 'features' | 'docs' | 'components'>('overview');

  // Interactive Modal State
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('npm install eg-web-core');
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2200);
  };

  return (
    <ThemeProvider defaultTheme="light-gray">
      {/* ================================================================== */}
      {/* MODE 1: OFFICIAL EGWEBCORE LIBRARY WEBSITE & PORTAL                */}
      {/* ================================================================== */}
      {appMode === 'portal' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Official Library Header */}
          <Header
            preset="generic"
            brandLogo={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '18px',
                  }}
                >
                  ⚡
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '19px',
                        letterSpacing: '-0.3px',
                        color: 'var(--eg-text-primary, #0f172a)',
                      }}
                    >
                      EGWebCore <span style={{ color: '#10b981' }}>Library</span>
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: 'var(--eg-color-primary, #10b981)',
                        border: '1px solid rgba(16, 185, 129, 0.28)',
                        lineHeight: '1.3',
                      }}
                    >
                      v1.0.0
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '6px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        color: 'var(--eg-color-sky, #0284c7)',
                        border: '1px solid rgba(56, 189, 248, 0.28)',
                        lineHeight: '1.3',
                      }}
                    >
                      Open Source (MIT)
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--eg-text-muted, #94a3b8)',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Universal React UI & Design Tokens Engine
                  </span>
                </div>
              </div>
            }
            brandUrl="#"
            containerMaxWidth="var(--eg-container-wide, min(1680px, 96%))"
            containerPadding="0 clamp(16px, 2.5vw, 32px)"
            showForkRibbon={true}
            forkRibbonUrl="https://github.com/EG1DOTIN/eg-web-core"
            forkRibbonText="FORK ME"
            forkRibbonPosition="right"
            githubUrl="https://github.com/EG1DOTIN/eg-web-core"
            showThemeToggle={true}
            showNotificationBell={true}
            showCacheBuster={true}
            navLinks={[
              {
                label: 'OVERVIEW',
                href: '#overview',
                active: portalSection === 'overview',
              },
              {
                label: 'FEATURES',
                href: '#features',
                active: portalSection === 'features',
              },
              {
                label: 'DOCUMENTATION',
                href: '#docs',
                active: portalSection === 'docs',
              },
              {
                label: 'COMPONENTS',
                href: '#components',
                active: portalSection === 'components',
              },
              {
                label: '🛍️ SAMPLE APP',
                href: '#example',
                highlight: true,
              },
            ]}
            onNavigate={(href) => {
              if (href === '#example') {
                setAppMode('example');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#overview') {
                setPortalSection('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#features') {
                setPortalSection('features');
              } else if (href === '#docs') {
                setPortalSection('docs');
              } else if (href === '#components') {
                setPortalSection('components');
              }
            }}
          />

          <Container wide style={{ flex: 1, paddingBottom: '60px' }}>
            {/* Portal Navigation Pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                margin: '24px 0 28px',
              }}
            >
              {(
                [
                  { id: 'overview', label: '📖 Overview & Quickstart', icon: '⚡' },
                  { id: 'features', label: '✨ Core Features', icon: '🎨' },
                  { id: 'docs', label: '📚 Full Documentation (eg-web-core/docs)', icon: '📑' },
                  { id: 'components', label: '🧩 Interactive Playground', icon: '🛠️' },
                ] as const
              ).map((tab) => {
                const isActive = portalSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPortalSection(tab.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '30px',
                      border: isActive
                        ? '1px solid var(--eg-color-primary, #10b981)'
                        : '1px solid var(--eg-border-subtle, rgba(0, 0, 0, 0.1))',
                      background: isActive ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-bg-surface, #ffffff)',
                      color: isActive ? '#ffffff' : 'var(--eg-text-primary, #0f172a)',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 4px 14px rgba(16, 185, 129, 0.25)' : 'none',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ------------------------------------------------------------ */}
            {/* Section 1: Overview & Hero                                   */}
            {/* ------------------------------------------------------------ */}
            {portalSection === 'overview' && (
              <>
                {/* Changing Banner Card (ImageSlider) Positioned on Top */}
                <div style={{ marginBottom: '32px' }}>
                  <ImageSlider
                    slides={PORTAL_HERO_SLIDES}
                    intervalMs={6000}
                    onButtonClick={(slide) => {
                      if (slide.buttonHref === '#docs') {
                        setPortalSection('docs');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (slide.buttonHref === '#components') {
                        setPortalSection('components');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else if (slide.buttonHref === '#features') {
                        setPortalSection('features');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  />
                </div>

                {/* Hero Showcase Banner */}
                <div
                  style={{
                    padding: '48px 36px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
                    marginBottom: '40px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          border: '1px solid rgba(52, 211, 153, 0.4)',
                          borderRadius: '20px',
                          padding: '4px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                        }}
                      >
                        Official Open-Source Library (MIT)
                      </span>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>Dual-Mode Vite & Next.js Compatible</span>
                    </div>

                    <h1
                      style={{
                        fontSize: 'clamp(28px, 4vw, 44px)',
                        fontWeight: 900,
                        lineHeight: 1.15,
                        margin: '0 0 16px',
                        letterSpacing: '-0.8px',
                      }}
                    >
                      Build Lightning-Fast, Resilient Web Apps with{' '}
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        EGWebCore
                      </span>
                    </h1>

                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: 1.6,
                        color: '#cbd5e1',
                        margin: '0 0 28px',
                        maxWidth: '720px',
                      }}
                    >
                      A battle-tested React library delivering universal CSS design tokens, zero-backend-read caching,
                      defense-in-depth sanitization, and responsive layout primitives with zero breaking changes across multiple consumer websites.
                    </p>

                    {/* Action Buttons (Single prominent example link) */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', marginBottom: '32px' }}>
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          setAppMode('example');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '12px 28px',
                          fontSize: '15px',
                          fontWeight: 800,
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        }}
                      >
                        🛍️ Explore Sample Application
                      </Button>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setPortalSection('docs')}
                        style={{
                          padding: '12px 24px',
                          fontSize: '15px',
                          color: '#ffffff',
                          borderColor: 'rgba(255, 255, 255, 0.25)',
                        }}
                      >
                        📖 View Documentation
                      </Button>
                    </div>

                    {/* Install Snippet */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(0, 0, 0, 0.45)',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        fontFamily: 'var(--eg-font-mono, monospace)',
                        fontSize: '14px',
                      }}
                    >
                      <span style={{ color: '#94a3b8' }}>$</span>
                      <span style={{ color: '#38bdf8' }}>npm install eg-web-core</span>
                      <button
                        type="button"
                        onClick={handleCopyInstall}
                        style={{
                          background: copiedInstall ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          marginLeft: '10px',
                          transition: 'background 0.2s',
                        }}
                      >
                        {copiedInstall ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px',
                  }}
                >
                  {[
                    { metric: '0 Layout Shift', label: 'CSS Custom Property Tokens', desc: 'Fluid clamp scaling across all devices.' },
                    { metric: '98% Savings', label: 'Batched Bucket Telemetry', desc: '50-record aggregation prevents quota burns.' },
                    { metric: '0 Firestore Reads', label: 'DataCache & SWR Strategy', desc: 'Static JSON with offline fallback.' },
                    { metric: '100% Type-Safe', label: 'Full TypeScript 5.7+ Coverage', desc: 'Self-documenting APIs with JSDocs.' },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '24px',
                        borderRadius: '12px',
                        background: 'var(--eg-bg-surface, #ffffff)',
                        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                        boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
                      }}
                    >
                      <div style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', marginBottom: '6px' }}>
                        {stat.metric}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--eg-text-primary, #0f172a)', marginBottom: '4px' }}>
                        {stat.label}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--eg-text-muted, #94a3b8)' }}>
                        {stat.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Section 2: Core Features Grid                                */}
            {/* ------------------------------------------------------------ */}
            {portalSection === 'features' && (
              <Section>
                <PageHeader
                  badge="Architecture & Capabilities"
                  title="Engineered for Performance, Scalability & Security"
                  subtitle="Everything required to build enterprise web portals and consumer applications with zero design debt."
                />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {[
                    {
                      icon: '🎨',
                      title: 'Universal Design Tokens',
                      desc: 'Single source of truth in tokens.css. Supports 6 crystal gradient themes, dark/light adaptive switching, and FOUC prevention.',
                      badge: 'Design System',
                    },
                    {
                      icon: '⚡',
                      title: 'Zero-Read DataCache',
                      desc: 'Stale-while-revalidate client caching with localStorage fallback, eliminating cloud billing spikes and network latency.',
                      badge: 'Performance',
                    },
                    {
                      icon: '🛡️',
                      title: 'Defense-in-Depth Sanitization',
                      desc: 'Strict HTML parsing via marked + sanitizeHtml and sanitizeUrl blocking XSS, dangerous protocols, and tab-napping.',
                      badge: 'Security',
                    },
                    {
                      icon: '📊',
                      title: 'Batched Bucket Telemetry',
                      desc: 'Aggregates visitor tracking events into 50-record buckets, cutting Firestore write operations by up to 98%.',
                      badge: 'Cloud Optimization',
                    },
                    {
                      icon: '🧩',
                      title: 'Comprehensive Component Suite',
                      desc: 'Modular Headers, Footers, ProductGrids, BlogLists, DocsViewer, Modals, Badges, and TotemTickers ready out-of-the-box.',
                      badge: 'Components',
                    },
                    {
                      icon: '🔒',
                      title: 'Zero-Regression Guarantees',
                      desc: 'Generic website-agnostic defaults with complete customization props ensuring no consumer project ever breaks.',
                      badge: 'Compatibility',
                    },
                  ].map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '28px',
                        background: 'var(--eg-bg-surface, #ffffff)',
                        borderRadius: '14px',
                        border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                        boxShadow: 'var(--eg-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <span style={{ fontSize: '32px' }}>{feat.icon}</span>
                          <Badge variant="info">{feat.badge}</Badge>
                        </div>
                        <h3 style={{ margin: '0 0 10px', fontSize: '18px', fontWeight: 800 }}>{feat.title}</h3>
                        <p style={{ margin: '0', fontSize: '14px', lineHeight: 1.6, color: 'var(--eg-text-secondary, #475569)' }}>
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Section 3: Full Documentation (from eg-web-core/docs)        */}
            {/* ------------------------------------------------------------ */}
            {portalSection === 'docs' && (
              <Section>
                <PageHeader
                  badge="Official Documentation"
                  title="Authoritative Library Reference"
                  subtitle="Rendered live from eg-web-core/docs/*.md with interactive search, Table of Contents, and copyable code."
                />
                <DocsViewer articles={CORE_DOCUMENTATION_ARTICLES} defaultArticleId="overview" />
              </Section>
            )}

            {/* ------------------------------------------------------------ */}
            {/* Section 4: Interactive Component Playground                  */}
            {/* ------------------------------------------------------------ */}
            {portalSection === 'components' && (
              <Section>
                <PageHeader
                  badge="Interactive Playground"
                  title="UI Component Primitives & Widgets"
                  subtitle="Buttons, Badges, Modals, Consent Controls, and Form primitives."
                />

                {/* Button Variants & Sizes */}
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--eg-bg-surface, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
                    Button Variants & Sizes
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <Button variant="primary" size="md">
                      Primary Button
                    </Button>
                    <Button variant="secondary" size="md">
                      Secondary Button
                    </Button>
                    <Button variant="outline" size="md">
                      Outline Button
                    </Button>
                    <Button variant="danger" size="md">
                      Danger Button
                    </Button>
                    <Button variant="ghost" size="md">
                      Ghost Button
                    </Button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                    <Button variant="primary" size="sm">
                      Small Button
                    </Button>
                    <Button variant="primary" size="md">
                      Medium Button
                    </Button>
                    <Button variant="primary" size="lg">
                      Large Button
                    </Button>
                    <Button variant="outline" size="md" onClick={() => setDemoModalOpen(true)}>
                      🪟 Open Interactive Modal
                    </Button>
                  </div>
                </div>

                {/* Badge Variants */}
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--eg-bg-surface, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700 }}>
                    Badge Variants
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <Badge variant="primary">Primary Badge</Badge>
                    <Badge variant="success">Success Badge</Badge>
                    <Badge variant="warning">Warning Badge</Badge>
                    <Badge variant="danger">Danger Badge</Badge>
                    <Badge variant="info">Info Badge</Badge>
                    <Badge variant="neutral">Neutral Badge</Badge>
                  </div>
                </div>

                {/* Consent Control */}
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--eg-bg-surface, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>
                    User Consent & Privacy Preferences
                  </h3>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--eg-text-muted, #94a3b8)' }}>
                    GDPR-compliant telemetry and analytics consent controller.
                  </p>
                  <ConsentControl />
                </div>

                {/* Standalone Markdown & Architecture Viewer Component */}
                <div
                  style={{
                    padding: '24px',
                    background: 'var(--eg-bg-surface, #ffffff)',
                    borderRadius: '12px',
                    border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.1))',
                    marginBottom: '24px',
                  }}
                >
                  <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700 }}>
                    MarkdownViewer Component with Interactive Mermaid & Syntax Highlighting
                  </h3>
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--eg-text-muted, #94a3b8)' }}>
                    Standalone markdown article renderer with Frontmatter metadata, Fullscreen Diagram Modal, dark code blocks, and callout alerts.
                  </p>
                  <MarkdownViewer
                    content={`---
title: "Distributed Architecture & Stream Pipeline"
author: "EG-Web-Core Architecture Team"
date: "October 2026"
category: "Engineering"
tags: ["Architecture", "Mermaid", "Streams"]
readingTime: "4 min read"
description: "A showcase of dynamic Mermaid flowcharts, GitHub dark syntax highlighting, and callout alerts."
---

## ⚡ Architectural Data Pipeline

\`\`\`mermaid
graph TD
    Client["Client Browser"] -->|HTTPS / WSS| Ingress["Ingress Gateway"]
    Ingress --> Engine["EG-Web-Core Engine"]
    Engine --> Cache["DataCache (Local LRU)"]
    Engine --> Telemetry["VisitorTracker (50-Batch)"]
    Telemetry --> Storage["Encrypted Storage Bucket"]
\`\`\`

> [!NOTE]
> Mermaid diagrams in EG-Web-Core support **Fullscreen expand**, mouse drag-to-scroll, and raw source toggling.

> [!TIP]
> Code blocks feature 1-click clipboard copying and vibrant syntax highlighting for TSX, TypeScript, Python, C++, and Bash.

\`\`\`tsx
import React, { useState } from 'react';
import { Button, Modal, Badge } from 'eg-web-core';

// Production React component demonstration
export const DemoWidget: React.FC<{ initialCount?: number }> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState<number>(initialCount);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="demo-widget-container">
      <Badge variant="primary">Active v1.0.0</Badge>
      <Button variant="primary" size="md" onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Quick Start">
        <p>EG-Web-Core universal UI primitives ready out-of-the-box.</p>
      </Modal>
    </div>
  );
};
\`\`\`

## 🖼️ Markdown Image Support & Lightbox Preview

![EG-Web-Core Image Engine](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0NjAiIGhlaWdodD0iMTMwIiB2aWV3Qm94PSIwIDAgNDYwIDEzMCI+PHJlY3Qgd2lkdGg9IjQ2MCIgaGVpZ2h0PSIxMzAiIHJ4PSIxNCIgZmlsbD0iIzBkMGUxMiIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzEwYjk4MSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtd2VpZ2h0PSI3MDAiPuKaoSBFRy1XZWItQ29yZSBVbml2ZXJzYWwgSW1hZ2UgRW5naW5lPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiI+UE5HLCBKUEcsIEdJRiwgV2ViUCwgU1ZHLCAmYW1wOyBEYXRhIFVSSXMg4oCiIENsaWNrIHRvIEV4cGFuZCE8L3RleHQ+PC9zdmc+ "Click to expand image lightbox")
`}
                  />
                </div>
              </Section>
            )}
          </Container>

          {/* Official Library Footer */}
          <Footer
            preset="generic"
            containerMaxWidth="var(--eg-container-wide, min(1680px, 96%))"
            containerPadding="0 clamp(16px, 2.5vw, 32px)"
            onNavigate={(href) => {
              if (href === '#example') {
                setAppMode('example');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#docs') {
                setPortalSection('docs');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#components') {
                setPortalSection('components');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#features') {
                setPortalSection('features');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (href === '#overview') {
                setPortalSection('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            brandLogo={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>⚡</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  EGWebCore <span style={{ color: '#10b981' }}>Library</span>
                </span>
              </div>
            }
            brandSubtitle="Open-Source Modular Design System & UI Component Suite"
            aboutText="A unified, high-performance open-source React component library providing design tokens, layout primitives, and resilient client services for modern web applications."
            copyrightText="© 2026 EGWebCore Library • Open Source (MIT)"
            developedByText="EG1"
            developedByUrl="https://eg1.in"
            privacyPolicyUrl="#"
            sections={[
              {
                title: 'Library Documentation',
                links: [
                  { label: 'Architecture & Overview', href: '#docs' },
                  { label: 'Design Tokens & Theming', href: '#docs' },
                  { label: 'Layout Components', href: '#docs' },
                  { label: 'UI Primitives & Modals', href: '#docs' },
                  { label: 'Hooks & DataCache Service', href: '#docs' },
                  { label: 'MIT Open-Source License', href: 'https://github.com/EG1DOTIN/eg-web-core' },
                ],
              },
              {
                title: 'Consumer Ecosystem',
                links: [
                  { label: 'EG1 Main Portal', href: 'https://eg1.in' },
                  { label: 'Marwadi Chess Platform', href: 'https://mchess.eg1.in' },
                  { label: 'pyEGClamUI Antivirus Portal', href: 'https://av.eg1.in' },
                  { label: 'Sample Store Application', href: '#example' },
                ],
              },
            ]}
          />
        </div>
      )}

      {/* ================================================================== */}
      {/* MODE 2: FULL CONSUMER WEB APP EXAMPLE (Acme Demo Store)            */}
      {/* ================================================================== */}
      {appMode === 'example' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Persistent Return Bar */}
          <div
            style={{
              background: 'linear-gradient(90deg, #1e1b4b 0%, #064e3b 100%)',
              color: '#ffffff',
              padding: '10px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              position: 'sticky',
              top: 0,
              zIndex: 9999,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span>
                <strong>SAMPLE APPLICATION</strong> — Demonstrating an illustrative sample app (<strong>Acme Demo Store</strong>) built with <strong>EGWebCore Library</strong>.
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAppMode('portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              ← Back to EGWebCore Library
            </Button>
          </div>

          {/* Consumer Web App Header (Completely transformed brand & nav) */}
          <Header
            preset="custom"
            brandLogo={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '20px',
                  }}
                >
                  🛍️
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '19px',
                      letterSpacing: '-0.3px',
                      color: 'var(--eg-text-primary, #0f172a)',
                    }}
                  >
                    Acme <span style={{ color: '#10b981' }}>Demo Store</span>
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--eg-text-muted, #94a3b8)',
                      fontWeight: 600,
                      letterSpacing: '0.4px',
                    }}
                  >
                    Sample E-Commerce & Catalog Application
                  </span>
                </div>
              </div>
            }
            brandUrl="#"
            containerMaxWidth="var(--eg-container-wide, min(1680px, 96%))"
            containerPadding="0 clamp(16px, 2.5vw, 32px)"
            showForkRibbon={false}
            showThemeToggle={true}
            showNotificationBell={true}
            showCacheBuster={true}
            navLinks={[
              { label: 'DEMO PRODUCTS', href: '#products', active: true },
              { label: 'SAMPLE POSTS', href: '#insights' },
              { label: 'CHANGELOG', href: '#releases' },
              { label: 'SAMPLE CONTACT', href: '#contact' },
            ]}
            quickAction={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAppMode('portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ← Exit Demo
              </Button>
            }
          />

          <Container wide style={{ flex: 1, paddingBottom: '60px' }}>
            {/* Consumer Hero Slider */}
            <div style={{ marginTop: '20px' }}>
              <ImageSlider />
            </div>

            {/* Consumer News Ticker */}
            <TotemTicker
              items={[
                {
                  id: '1',
                  title: 'Acme Demo Store v1.2 Active',
                  description: 'This is an illustrative sample demonstration showcasing EGWebCore layout and components.',
                },
                {
                  id: '2',
                  title: 'Demonstration Notice',
                  description: 'All products, blog posts, and contact forms on this page are non-real sample mockups.',
                },
              ]}
            />

            {/* Consumer Products Section */}
            <Section id="products">
              <PageHeader
                badge="Demo Catalog"
                title="Sample Products Showcase"
                subtitle="Illustrating how ProductGrid and ProductCard look in an e-commerce or product catalog web app."
              />
              <ProductGrid products={EXAMPLE_PRODUCTS} />
            </Section>

            {/* Consumer Blog / Insights Section */}
            <Section id="insights">
              <PageHeader
                badge="Sample Articles"
                title="Demo Blog & Guides"
                subtitle="Illustrating how BlogList and MarkdownViewer render in a documentation or content portal."
              />
              <BlogList posts={EXAMPLE_BLOG_POSTS} />
            </Section>

            {/* Consumer Updates Timeline */}
            <Section id="releases">
              <PageHeader
                badge="Changelog"
                title="Sample Release Timeline"
                subtitle="Illustrating how UpdatesTimeline renders version badges, release dates, and highlight bullet points."
              />
              <UpdatesTimeline updates={EXAMPLE_UPDATES} />
            </Section>

            {/* Consumer Contact Form */}
            <Section id="contact">
              <PageHeader
                badge="Sample Form"
                title="Demo Contact Inquiry"
                subtitle="A sample contact form demonstrating math CAPTCHA, form validation, and feedback states."
              />
              <ContactForm
                title="Send a Sample Message (Demo)"
                subtitle="This is a demonstration form. Submissions will log to your browser console without storing data."
                requireContactNumber={false}
                enableCaptcha={true}
                onSubmit={async (payload) => {
                  console.log('Sample Demo Contact Inquiry:', payload);
                  return {
                    success: true,
                    message: 'Thank you! Your sample message has been received in the demo environment.',
                  };
                }}
                channels={[
                  {
                    id: 'email',
                    label: 'Sample Desk',
                    value: 'demo@example.com',
                    href: 'mailto:demo@example.com',
                  },
                  {
                    id: 'docs',
                    label: 'Sample Help',
                    value: 'help.example.com',
                    href: '#',
                  },
                ]}
              />
            </Section>
          </Container>

          {/* Consumer Web App Footer */}
          <Footer
            preset="custom"
            containerMaxWidth="var(--eg-container-wide, min(1680px, 96%))"
            containerPadding="0 clamp(16px, 2.5vw, 32px)"
            brandLogo={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '22px' }}>🛍️</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>
                  Acme <span style={{ color: '#10b981' }}>Demo Store</span>
                </span>
              </div>
            }
            brandSubtitle="Sample Demo Application"
            aboutText="Acme Demo Store is an illustrative demonstration application built with EGWebCore Library to show reusable components, theming, and layout primitives."
            copyrightText="© 2026 Acme Demo Store (Illustrative Example). Powered by EGWebCore."
            developedByText="Return to EGWebCore Library Portal"
            developedByUrl="#"
            onNavigate={() => {
              setAppMode('portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            sections={[
              {
                title: 'Sample Products',
                links: [
                  { label: 'Acme Demo Widget A', href: '#products' },
                  { label: 'Acme Sample T-Shirt', href: '#products' },
                  { label: 'Acme Test Gadget Pro', href: '#products' },
                ],
              },
              {
                title: 'Sample Resources',
                links: [
                  { label: 'Welcome to Acme Demo Store', href: '#insights' },
                  { label: 'Customizing Components Guide', href: '#insights' },
                  { label: 'Sample Release Timeline', href: '#releases' },
                ],
              },
            ]}
          />
        </div>
      )}

      {/* Interactive Modal Dialog (Usable from playground) */}
      <Modal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        title="EGWebCore Interactive Dialog"
        maxWidth="520px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" size="sm" onClick={() => setDemoModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={() => setDemoModalOpen(false)}>
              Confirm Action
            </Button>
          </div>
        }
      >
        <p style={{ margin: '0 0 12px', fontSize: '14px', lineHeight: 1.6, color: 'var(--eg-text-secondary, #475569)' }}>
          This accessible modal dialog is powered by <code>&lt;Modal&gt;</code> from the <code>eg-web-core</code> library.
        </p>
        <p style={{ margin: '0', fontSize: '14px', lineHeight: 1.6, color: 'var(--eg-text-secondary, #475569)' }}>
          It features backdrop blur, focus trapping, keyboard ESC dismissal, and automatic body scroll locking.
        </p>
      </Modal>

      {/* Global GDPR Consent Banner */}
      <ConsentBanner />
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<ShowcaseApp />);
