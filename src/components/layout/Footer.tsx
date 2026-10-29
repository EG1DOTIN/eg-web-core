import React, { useState, useEffect } from 'react';
import { DataCache } from '../../services/DataCache';
import { sanitizeUrl } from '../../services/sanitizer';
import { Logo } from '../common/Logo';
import { SmartScrollButton } from '../common/SmartScrollButton';
import { SocialIcon } from '../common/SocialIcons';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}

export interface FooterSection {
  title: string;
  links?: FooterLink[];
  customContent?: React.ReactNode;
}

export interface SocialLinkItem {
  name: string;
  url: string;
  icon?: React.ReactNode;
}

export interface FooterProps {
  preset?: 'generic' | 'eg1' | 'mchess' | 'clamui' | 'custom';
  brandLogo?: React.ReactNode;
  logoComponent?: React.ReactNode;
  logoSize?: number;
  logoTheme?: 'light' | 'dark' | 'auto';
  brandTitle?: string;
  brandSubtitle?: string;
  aboutText?: string;
  aboutReadMoreUrl?: string;
  socialLinks?: SocialLinkItem[];
  socialAlignment?: 'left' | 'center' | 'right';
  contactAlignment?: 'left' | 'center' | 'right';
  followLabel?: string;
  contactLabel?: string;
  contactButtonText?: string;
  contactUrl?: string;
  sections?: FooterSection[];
  copyrightText?: string;
  privacyPolicyUrl?: string;
  developedByText?: string;
  developedByUrl?: string;
  developedByPrefix?: string;
  showBackToTop?: boolean;
  containerMaxWidth?: string | number;
  containerPadding?: string | number;
  onNavigate?: (href: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Universal application footer with configurable column structure, brand logo,
 * about text, social links, contact forms, and legal links.
 *
 * @example
 * ```tsx
 * <Footer
 *   brandTitle="My Application"
 *   aboutText="Modern modular web application."
 * />
 * ```
 */
export const Footer: React.FC<FooterProps> = ({
  preset = 'generic',
  brandLogo,
  logoComponent,
  logoSize = 96,
  logoTheme = 'dark',
  brandTitle,
  brandSubtitle,
  aboutText,
  aboutReadMoreUrl = 'about.html',
  socialLinks,
  socialAlignment = 'left',
  contactAlignment = 'left',
  followLabel = 'Follow',
  contactLabel = 'Contact',
  contactButtonText = 'Send Message',
  contactUrl = 'contact.html',
  sections,
  copyrightText,
  privacyPolicyUrl = 'privacypolicy.html',
  developedByText,
  developedByUrl,
  developedByPrefix,
  showBackToTop = false,
  containerMaxWidth = 'var(--eg-container-max, min(1536px, 94%))',
  containerPadding = '0 clamp(16px, 2.5vw, 32px)',
  onNavigate,
  className = '',
  style = {},
}) => {
  const [dynamicAbout, setDynamicAbout] = useState(aboutText || '');

  useEffect(() => {
    if (aboutText) return;
    let active = true;

    DataCache.getPageContent('about').then((aboutPage) => {
      if (!active || !aboutPage) return;

      const extractCleanText = (htmlContent: string) => {
        if (!htmlContent) return '';
        try {
          if (typeof document !== 'undefined') {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => h.remove());
            const text = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ');
            return text.replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, '').trim();
          }
        } catch {
          // Fallback to regex
        }
        return htmlContent
          .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '')
          .replace(/<[^>]*>?/gm, ' ')
          .replace(/\s+/g, ' ')
          .replace(/^ABOUT\s*[^:\n-]+\s*[:-]?\s*/i, '')
          .trim();
      };

      let cleanText = extractCleanText(aboutPage.title || '');
      if (!cleanText && aboutPage.content) {
        cleanText = extractCleanText(aboutPage.content);
      }

      if (cleanText) {
        let snippet = cleanText;
        if (cleanText.length > 135) {
          const truncated = cleanText.slice(0, 135);
          const lastSpace = truncated.lastIndexOf(' ');
          snippet = (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).trim() + '...';
        }
        setDynamicAbout(snippet);
      }
    });

    return () => {
      active = false;
    };
  }, [aboutText, preset]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (external || href.startsWith('http://') || href.startsWith('https://')) return;
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  const navSections = sections || [];
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`eg-footer ${className}`}
      style={{
        background: 'var(--eg-bg-footer, #1e2229)',
        color: 'var(--eg-text-footer, #cbd5e1)',
        borderTop: '1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.08))',
        padding: '52px 20px 24px',
        fontFamily: 'var(--eg-font-sans, sans-serif)',
        ...style,
      }}
    >
      <div
        style={{
          maxWidth: containerMaxWidth,
          margin: '0 auto',
          padding: containerPadding,
        }}
      >
        <div
          className="eg-footer-grid"
          style={{
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Column 1: Brand Info & About */}
          <div className="eg-footer-col eg-footer-col-about">
            <div style={{ marginBottom: '14px' }}>
              {brandLogo || logoComponent ? (
                brandLogo || logoComponent
              ) : brandTitle ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--eg-text-footer-title, #ffffff)' }}>
                    {brandTitle}
                  </span>
                  {brandSubtitle && (
                    <span style={{ fontSize: '11px', color: 'var(--eg-text-footer-muted, #94a3b8)' }}>
                      {brandSubtitle}
                    </span>
                  )}
                </div>
              ) : (
                <Logo size={logoSize} theme={logoTheme || 'dark'} mainText="APP" />
              )}
            </div>

            <p
              style={{
                fontSize: '13.5px',
                lineHeight: 1.6,
                color: 'var(--eg-text-footer-muted, #94a3b8)',
                margin: '0 0 10px',
                textAlign: 'left',
                textJustify: 'inter-word',
              }}
            >
              <span>{dynamicAbout}</span>
              {aboutReadMoreUrl && (
                <>
                  {' '}
                  <a
                    href={aboutReadMoreUrl}
                    onClick={(e) => handleLinkClick(e, aboutReadMoreUrl)}
                    className="footer-readmore-link"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--eg-color-primary, #10b981)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                      marginLeft: '4px',
                    }}
                  >
                    Read more &rarr;
                  </a>
                </>
              )}
            </p>
          </div>

          {/* Column 2 & 3: Social follow & Contact (or custom sections) */}
          {socialLinks && !sections ? (
            <>
              {/* Column 2: Follow & Social Channels */}
              <div
                className="eg-footer-col eg-footer-col-social"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems:
                    socialAlignment === 'center'
                      ? 'center'
                      : socialAlignment === 'right'
                      ? 'flex-end'
                      : 'flex-start',
                  textAlign: socialAlignment,
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--eg-text-footer-title, #ffffff)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    margin: '0 0 16px',
                    textAlign: socialAlignment,
                    width: '100%',
                  }}
                >
                  {followLabel}
                </h4>
                <div
                  className="eg-footer-social-wrap"
                  style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent:
                      socialAlignment === 'center'
                        ? 'center'
                        : socialAlignment === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {(socialLinks || []).map((s) => (
                    <a
                      key={s.name}
                      href={sanitizeUrl(s.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      aria-label={s.name}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.12))',
                        color: 'var(--eg-text-footer, #cbd5e1)',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#10b981';
                        e.currentTarget.style.borderColor = '#10b981';
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--eg-text-footer, #cbd5e1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      }}
                    >
                      {s.icon || <SocialIcon name={s.name} size={18} />}
                    </a>
                  ))}
                </div>
              </div>

              {/* Column 3: Contact & Message */}
              <div
                className="eg-footer-col eg-footer-col-contact"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems:
                    contactAlignment === 'center'
                      ? 'center'
                      : contactAlignment === 'right'
                      ? 'flex-end'
                      : 'flex-start',
                  textAlign: contactAlignment,
                }}
              >
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--eg-text-footer-title, #ffffff)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    margin: '0 0 16px',
                    textAlign: contactAlignment,
                    width: '100%',
                  }}
                >
                  {contactLabel}
                </h4>
                <a
                  href={contactUrl}
                  onClick={(e) => handleLinkClick(e, contactUrl)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#10b981',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.color = '#064e3b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                    e.currentTarget.style.color = '#10b981';
                  }}
                >
                  <span>✉</span>
                  <span>{contactButtonText}</span>
                </a>
              </div>
            </>
          ) : (
            navSections.map((sec) => (
              <div key={sec.title} className="eg-footer-col">
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--eg-text-footer-title, #ffffff)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginBottom: '16px',
                  }}
                >
                  {sec.title}
                </h4>
                {sec.customContent ? (
                  sec.customContent
                ) : sec.links ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {sec.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={sanitizeUrl(link.href)}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          onClick={(e) => handleLinkClick(e, link.href, link.external)}
                          style={{
                            color: 'var(--eg-text-footer, #cbd5e1)',
                            textDecoration: 'none',
                            fontSize: '13.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = 'var(--eg-color-primary, #10b981)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'var(--eg-text-footer, #cbd5e1)';
                          }}
                        >
                          {link.icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{link.icon}</span>}
                          <span>{link.label}</span>
                          {link.external && '↗'}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          )}
        </div>

        {/* Bottom Attribution Bar */}
        <div
          className="eg-footer-bottom-bar"
          style={{
            borderTop: '1px solid var(--eg-border-footer, rgba(255, 255, 255, 0.08))',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '12.5px',
            color: 'var(--eg-text-footer-muted, #94a3b8)',
          }}
        >
          <div>
            {copyrightText || `© ${currentYear} ${brandTitle || 'Application'}. All rights reserved.`}
          </div>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <a
              href={privacyPolicyUrl}
              onClick={(e) => handleLinkClick(e, privacyPolicyUrl)}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Privacy Policy
            </a>
            {developedByText && (
              <>
                <span>•</span>
                <span>
                  {developedByPrefix ? `${developedByPrefix} ` : 'Developed By: '}
                  <a
                    href={developedByUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--eg-color-primary, #10b981)', textDecoration: 'none' }}
                  >
                    {developedByText}
                  </a>
                </span>
              </>
            )}
          </div>
            {showBackToTop && (
              <SmartScrollButton variant={preset === 'mchess' ? 'accent' : 'primary'} />
            )}
          </div>
        </div>

      {/* Embedded Responsive Media Queries */}
      <style>{`
        .eg-footer-grid {
          display: grid;
          grid-template-columns: ${socialLinks && !sections ? 'minmax(280px, 1.3fr) 1fr 1fr' : 'repeat(auto-fit, minmax(220px, 1fr))'};
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
      `}</style>
    </footer>
  );
};
