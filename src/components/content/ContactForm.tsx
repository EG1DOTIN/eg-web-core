import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../common/Button';
import {
  generateMathCaptcha,
  checkContactRateLimit,
  recordContactSubmissionTime,
  submitContactInquiry,
  flushOfflineContactMessages,
  MathCaptchaChallenge,
  ContactMessagePayload,
} from '../../services/contactService';
import { FirebaseAppConfig, initFirebase } from '../../services/firebase';
import { useFirebase } from '../../theme/FirebaseContext';
import { sanitizeUrl } from '../../services/sanitizer';

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface ContactFormProps {
  /** Section / card title (default: "Any message?") */
  title?: string;
  /** Section / card subtitle or helper description */
  subtitle?: string;
  /** Form submission button label (default: "Send Enquiry ⮠") */
  submitButtonText?: string;
  /** Whether phone / contact number is required (default: true) */
  requireContactNumber?: boolean;
  /** Whether to enable arithmetic anti-spam CAPTCHA (default: true) */
  enableCaptcha?: boolean;
  /** Whether to lazy-load the CAPTCHA only upon user input focus (default: true) */
  lazyCaptcha?: boolean;
  /** Sliding window rate limiting in hours (default: 24, set 0 to disable) */
  rateLimitHours?: number;
  /** LocalStorage key for tracking submission rate limit (default: "lastMessageTime") */
  rateLimitKey?: string;
  /** Target Cloud Firestore collection name (defaults to FirebaseContext.collections.messages or "messages") */
  firestoreCollection?: string;
  /** Collection storing cross-browser and cross-device rate limit records (defaults to 'visitor_analytics') */
  analyticsCollection?: string;
  /** Direct Firestore database instance (defaults to useFirebase().db or window.db) */
  db?: any;
  /** Explicit Firebase app config for direct initialization */
  firebaseConfig?: FirebaseAppConfig;
  /** Application or domain name attached to inquiry payload (defaults to FirebaseContext appName or 'web-app') */
  appName?: string;
  /** Whether to bypass rate-limiting when testing on localhost (default: true) */
  allowLocalhostBypass?: boolean;
  /** Custom payload transformer to adapt to custom Firestore schema / security rules */
  transformPayload?: (payload: ContactMessagePayload) => Record<string, any>;
  /** Custom submission handler override (e.g. for non-Firebase backends: Supabase, REST, Webhooks) */
  onSubmit?: (payload: ContactMessagePayload) => Promise<{ success: boolean; message?: string }>;
  /** Direct communication channels for side column */
  channels?: ContactChannel[];
  /** Side column heading (default: "Connect on Other Platforms") */
  channelsTitle?: string;
  /** Side column subtitle */
  channelsSubtitle?: string;
  /** Success banner heading */
  successTitle?: string;
  /** Success message text */
  successMessage?: string;
  /** Maximum allowed character length for message (default: 2000, matching Firestore limits) */
  maxMessageLength?: number;
  /** Custom CSS class */
  className?: string;
  /** Custom container style */
  style?: React.CSSProperties;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Any message?',
  subtitle,
  submitButtonText = 'Send Enquiry ⮠',
  requireContactNumber = true,
  enableCaptcha = true,
  lazyCaptcha = true,
  rateLimitHours = 24,
  rateLimitKey = 'lastMessageTime',
  maxMessageLength = 2000,
  firestoreCollection,
  analyticsCollection,
  db: propDb,
  firebaseConfig,
  appName,
  allowLocalhostBypass = false,
  transformPayload,
  onSubmit,
  channels,
  channelsTitle = 'Connect on Other Platforms',
  channelsSubtitle,
  successTitle = 'Thank You for Contacting Us!',
  successMessage = 'Your message has been received. We will get back to you shortly.',
  className = '',
  style,
}) => {
  const firebaseCtx = useFirebase();
  const activeDb = propDb || firebaseCtx.db;
  const activeFirebaseConfig = firebaseConfig || (firebaseCtx.config?.apiKey ? firebaseCtx.config : undefined);
  const activeAppName = appName || (firebaseCtx.appName !== 'web-app' ? firebaseCtx.appName : 'web-app');
  const targetCollection = firestoreCollection || firebaseCtx.collections?.messages || 'messages';
  const targetAnalyticsCollection = analyticsCollection || firebaseCtx.collections?.analytics || 'visitor_analytics';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [botAnswer, setBotAnswer] = useState('');

  // CAPTCHA challenge state
  const [captcha, setCaptcha] = useState<MathCaptchaChallenge | null>(null);
  const [captchaActive, setCaptchaActive] = useState(!lazyCaptcha);

  // Status feedback
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  // Background auto-sync of any offline queued messages when DB/config becomes available
  useEffect(() => {
    let active = true;
    async function initAndSync() {
      try {
        let currentDb = activeDb;
        if (!currentDb && activeFirebaseConfig?.apiKey) {
          const res = await initFirebase(activeFirebaseConfig, activeAppName === 'web-app' ? undefined : activeAppName);
          currentDb = res.db;
        }
        if (active && currentDb) {
          await flushOfflineContactMessages(currentDb, targetCollection, transformPayload);
        }
      } catch (err) {
        // Non-blocking background flush
      }
    }
    initAndSync();
    return () => {
      active = false;
    };
  }, [activeDb, activeFirebaseConfig, activeAppName, targetCollection, transformPayload]);

  // Initialize or regenerate CAPTCHA challenge
  const regenerateCaptcha = useCallback(() => {
    setCaptcha(generateMathCaptcha());
    setBotAnswer('');
  }, []);

  // Trigger CAPTCHA on initial user input focus
  const handleInputFocus = () => {
    if (enableCaptcha && !captchaActive) {
      setCaptchaActive(true);
      if (!captcha) regenerateCaptcha();
    }
  };

  useEffect(() => {
    if (enableCaptcha && captchaActive && !captcha) {
      regenerateCaptcha();
    }
  }, [enableCaptcha, captchaActive, captcha, regenerateCaptcha]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    // 1. Check rate limit across machine fingerprint and submitted user identity (name, email, phone)
    const rateCheck = checkContactRateLimit({
      name: name.trim(),
      email: email.trim(),
      contact: contact.trim(),
      rateLimitKey,
      rateLimitHours,
      allowLocalhostBypass,
    });
    if (!rateCheck.allowed) {
      setAlert({
        type: 'error',
        message: rateCheck.message || 'You have sent a message recently. Please try again tomorrow.',
      });
      return;
    }

    // 2. Validate CAPTCHA
    if (enableCaptcha) {
      if (!captcha) {
        regenerateCaptcha();
        setAlert({ type: 'error', message: 'Please complete the anti-spam verification challenge.' });
        return;
      }

      const parsedAnswer = parseInt(botAnswer.trim(), 10);
      if (isNaN(parsedAnswer) || parsedAnswer !== captcha.expected) {
        setAlert({ type: 'error', message: 'Incorrect anti-spam verification answer. Please try again.' });
        regenerateCaptcha();
        return;
      }
    }

    // 3. Field presence check
    if (!name.trim() || !email.trim() || !message.trim()) {
      setAlert({ type: 'error', message: 'Please fill in all required fields (Name, Email, Message).' });
      return;
    }

    if (requireContactNumber && !contact.trim()) {
      setAlert({ type: 'error', message: 'Please provide a valid contact phone number.' });
      return;
    }

    setSubmitting(true);

    const payload: ContactMessagePayload = {
      name: name.trim(),
      email: email.trim(),
      contact: contact.trim(),
      message: message.trim(),
      appName: activeAppName,
    };

    try {
      let res: { success: boolean; message?: string };
      if (onSubmit) {
        res = await onSubmit(payload);
        if (res.success) {
          recordContactSubmissionTime({
            name: name.trim(),
            email: email.trim(),
            contact: contact.trim(),
            rateLimitKey,
          });
        }
      } else {
        res = await submitContactInquiry(payload, {
          collectionName: targetCollection,
          analyticsCollection: targetAnalyticsCollection,
          rateLimitKey,
          rateLimitHours,
          db: activeDb,
          firebaseConfig: activeFirebaseConfig,
          appName: activeAppName,
          allowLocalhostBypass,
          transformPayload,
        });
      }

      if (res.success) {
        setSubmittedSuccessfully(true);
        setAlert({
          type: 'success',
          message: res.message || successMessage,
        });
        // Reset form inputs
        setName('');
        setEmail('');
        setContact('');
        setMessage('');
        setBotAnswer('');
        if (lazyCaptcha) setCaptchaActive(false);
      } else {
        setAlert({
          type: 'error',
          message: res.message || 'Failed to submit inquiry. Please try again later.',
        });
        if (enableCaptcha) regenerateCaptcha();
      }
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err?.message || 'An unexpected error occurred. Please try again later.',
      });
      if (enableCaptcha) regenerateCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`eg-contact-portal ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: channels && channels.length > 0 ? 'minmax(0, 1.4fr) minmax(0, 1fr)' : '1fr',
        gap: '32px',
        alignItems: 'start',
        ...style,
      }}
    >
      <style>{`
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
      `}</style>

      {/* Main Form Column */}
      <div className="eg-contact-portal-card">
        {title && (
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #0f172a)',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p
            style={{
              margin: '0 0 24px',
              fontSize: '14px',
              color: 'var(--eg-text-muted, #64748b)',
              lineHeight: 1.55,
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Feedback Alert Banner */}
        {alert && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '22px',
              fontSize: '14px',
              lineHeight: 1.5,
              fontWeight: 500,
              background: alert.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${alert.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: alert.type === 'success' ? 'var(--eg-color-success, #15803d)' : 'var(--eg-color-danger, #b91c1c)',
            }}
          >
            {alert.type === 'success' ? '✓ ' : '⚠️ '}
            {alert.message}
          </div>
        )}

        {submittedSuccessfully ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.12)',
                color: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '16px',
              }}
            >
              ✓
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 700, color: 'var(--eg-text-primary, #0f172a)' }}>
              {successTitle}
            </h4>
            <p style={{ margin: '0 0 24px', color: 'var(--eg-text-secondary, #475569)', fontSize: '14.5px', lineHeight: 1.6 }}>
              {successMessage}
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setSubmittedSuccessfully(false);
                setAlert(null);
                if (enableCaptcha) regenerateCaptcha();
              }}
            >
              Send Another Enquiry
            </Button>
          </div>
        ) : (
          <form id="contactForm" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="eg-contact-input-group">
              <label htmlFor="txtname" className="eg-contact-input-label">
                Name <span style={{ color: 'var(--eg-color-danger, #ef4444)' }}>*</span>
              </label>
              <input
                id="txtname"
                name="name"
                type="text"
                required
                value={name}
                onFocus={handleInputFocus}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="eg-contact-input"
              />
            </div>

            {/* Email Input */}
            <div className="eg-contact-input-group">
              <label htmlFor="txtemail" className="eg-contact-input-label">
                Email Address <span style={{ color: 'var(--eg-color-danger, #ef4444)' }}>*</span>
              </label>
              <input
                id="txtemail"
                name="email"
                type="email"
                required
                value={email}
                onFocus={handleInputFocus}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="eg-contact-input"
              />
            </div>

            {/* Contact Phone Number Input */}
            <div className="eg-contact-input-group">
              <label htmlFor="txtcontact" className="eg-contact-input-label">
                Contact Number {requireContactNumber ? <span style={{ color: 'var(--eg-color-danger, #ef4444)' }}>*</span> : <span style={{ fontWeight: 400, color: 'var(--eg-text-muted, #94a3b8)' }}>(Optional)</span>}
              </label>
              <input
                id="txtcontact"
                name="contact"
                type="tel"
                required={requireContactNumber}
                maxLength={15}
                pattern="[0-9+ -]*"
                value={contact}
                onFocus={handleInputFocus}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone or mobile number"
                className="eg-contact-input"
              />
            </div>

            {/* Arithmetic Anti-Spam CAPTCHA */}
            {enableCaptcha && captchaActive && captcha && (
              <div className="eg-contact-captcha-box" id="botCheckContainer">
                <div>
                  <label
                    htmlFor="txtbot"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--eg-text-primary, #0f172a)',
                      marginBottom: '4px',
                    }}
                  >
                    Anti-Spam Verification: {captcha.prompt}{' '}
                    <span style={{ color: 'var(--eg-color-danger, #ef4444)' }}>*</span>
                  </label>
                  <span style={{ fontSize: '11.5px', color: 'var(--eg-text-muted, #94a3b8)' }}>
                    Solve the arithmetic problem above to verify you are human
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    id="txtbot"
                    name="botAnswer"
                    type="number"
                    required
                    value={botAnswer}
                    onChange={(e) => setBotAnswer(e.target.value)}
                    placeholder="Answer"
                    style={{
                      width: '100px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid var(--eg-border-default, rgba(0, 0, 0, 0.2))',
                      background: 'var(--eg-bg-surface, #ffffff)',
                      color: 'var(--eg-text-primary, #0f172a)',
                      fontSize: '14px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}
                  />
                  <button
                    type="button"
                    onClick={regenerateCaptcha}
                    title="Generate new arithmetic problem"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--eg-border-subtle, rgba(0,0,0,0.12))',
                      borderRadius: '6px',
                      padding: '7px 9px',
                      cursor: 'pointer',
                      color: 'var(--eg-text-secondary, #475569)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Message Textarea */}
            <div className="eg-contact-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                <label htmlFor="txtenq" className="eg-contact-input-label" style={{ marginBottom: 0 }}>
                  Your Message <span style={{ color: 'var(--eg-color-danger, #ef4444)' }}>*</span>
                </label>
                {maxMessageLength && (
                  <span style={{ fontSize: '12px', color: 'var(--eg-text-muted, #94a3b8)', fontWeight: 500 }}>
                    {message.length} / {maxMessageLength}
                  </span>
                )}
              </div>
              <textarea
                id="txtenq"
                name="message"
                required
                rows={5}
                maxLength={maxMessageLength}
                value={message}
                onFocus={handleInputFocus}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your comments, feedback, or feature request here..."
                className="eg-contact-input"
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Submit Action */}
            <div style={{ marginTop: '26px' }}>
              <Button
                type="submit"
                id="btnsend"
                variant="primary"
                size="md"
                disabled={submitting}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {submitting ? 'Sending Enquiry...' : submitButtonText}
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Direct Communication Channels Column */}
      {channels && channels.length > 0 && (
        <div className="eg-contact-portal-card">
          <h3
            style={{
              margin: '0 0 6px',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--eg-text-primary, #0f172a)',
              letterSpacing: '-0.01em',
            }}
          >
            {channelsTitle}
          </h3>
          {channelsSubtitle && (
            <p
              style={{
                margin: '0 0 20px',
                fontSize: '13.5px',
                color: 'var(--eg-text-muted, #64748b)',
                lineHeight: 1.5,
              }}
            >
              {channelsSubtitle}
            </p>
          )}

          <div style={{ marginTop: '16px' }}>
            {channels.map((ch) => {
              const Content = (
                <>
                  {ch.icon && (
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--eg-bg-canvas, #f1f5f9)',
                        color: 'var(--eg-color-primary, #b8860b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {ch.icon}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--eg-text-primary, #0f172a)' }}>
                      {ch.label}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: ch.href ? 'var(--eg-color-primary, #b8860b)' : 'var(--eg-text-secondary, #475569)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ch.value}
                    </div>
                    {ch.description && (
                      <div style={{ fontSize: '11.5px', color: 'var(--eg-text-muted, #94a3b8)', marginTop: '2px' }}>
                        {ch.description}
                      </div>
                    )}
                  </div>
                  {ch.href && (
                    <span style={{ color: 'var(--eg-text-muted, #94a3b8)', fontSize: '15px' }}>↗</span>
                  )}
                </>
              );

              return ch.href ? (
                <a
                  key={ch.id}
                  href={sanitizeUrl(ch.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eg-contact-channel-item"
                >
                  {Content}
                </a>
              ) : (
                <div key={ch.id} className="eg-contact-channel-item">
                  {Content}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
