/**
 * @file AdminMessagesView.tsx
 * @description Administrative view for reviewing, responding to, and managing
 * contact inquiries and customer messages submitted across EG web portals.
 * Features:
 *   - Live Firestore loading with server/client pagination and multi-field search.
 *   - Quick-action Reply button with prepopulated mailto subject and headers.
 *   - Inquiry detail view modal with full message body formatting and metadata.
 *   - Protected deletion with two-step confirmation dialog.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StatCard } from './StatCard';
import { DataGrid, DataGridColumn } from './DataGrid';
import { Modal } from '../common/Modal';
import { useFirebase } from '../../theme/FirebaseContext';
import { FirebaseAppConfig, initFirebase } from '../../services/firebase';

export interface AdminMessageItem {
  id: string;
  name: string;
  email: string;
  contact?: string;
  message: string;
  appName?: string;
  createdAt?: any;
  userAgent?: string;
  ip?: string;
  [key: string]: any;
}

export interface AdminMessagesViewProps {
  /** Firestore database instance (defaults to useFirebase().db or window.db) */
  db?: any;
  /** Firebase app configuration */
  firebaseConfig?: FirebaseAppConfig;
  /** Collection name storing messages (default: 'messages') */
  collectionName?: string;
  /** Optional custom fetcher override (e.g. for custom backends) */
  customFetcher?: () => Promise<AdminMessageItem[]>;
  /** Optional custom delete handler */
  customDeleteHandler?: (id: string) => Promise<void>;
  /** Title for the view (default: 'Contact Inquiries & Messages') */
  title?: string;
  /** Custom wrapper style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

export const AdminMessagesView: React.FC<AdminMessagesViewProps> = ({
  db: propDb,
  firebaseConfig,
  collectionName,
  customFetcher,
  customDeleteHandler,
  title = 'Contact Inquiries & Messages',
  style,
  className = '',
}) => {
  const firebaseCtx = useFirebase();
  const db = propDb || firebaseCtx.db;
  const targetCollection = collectionName || firebaseCtx.collections?.messages || 'messages';

  const [messages, setMessages] = useState<AdminMessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMessage, setActiveMessage] = useState<AdminMessageItem | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<AdminMessageItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Fetch messages
  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      if (customFetcher) {
        const data = await customFetcher();
        setMessages(data);
        setLoading(false);
        return;
      }

      let firestore = db || (window as any).db || (window as any).firebase?.firestore?.();
      if (!firestore && (firebaseConfig?.apiKey || firebaseCtx.config?.apiKey)) {
        try {
          const cfg = firebaseConfig || firebaseCtx.config;
          const { db: initDb } = await initFirebase(cfg, firebaseCtx.appName === 'web-app' ? undefined : firebaseCtx.appName);
          firestore = initDb;
        } catch (e) {
          console.warn('[AdminMessagesView] Auto-init Firebase error:', e);
        }
      }

      if (!firestore) {
        setLoading(false);
        return;
      }

      const snap = await firestore
        .collection(targetCollection)
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();

      const items: AdminMessageItem[] = snap.docs.map((doc: any) => {
        const data = doc.data() || {};
        let createdTime: any = null;
        if (data.createdAt) {
          createdTime = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
        }

        return {
          id: doc.id,
          name: data.name || 'Anonymous',
          email: data.email || 'N/A',
          contact: data.contact || '',
          message: data.message || '',
          appName: data.appName || 'web-app',
          createdAt: createdTime,
          userAgent: data.userAgent,
          ip: data.ip,
        };
      });

      setMessages(items);
    } catch (err: any) {
      console.warn('[eg-web-core] loadMessages warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, [db, targetCollection, customFetcher, firebaseConfig, firebaseCtx.config, firebaseCtx.appName]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Execute deletion
  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);

    try {
      if (customDeleteHandler) {
        await customDeleteHandler(messageToDelete.id);
      } else {
        const firestore = db || (window as any).db || (window as any).firebase?.firestore?.();
        if (firestore) {
          await firestore.collection(targetCollection).doc(messageToDelete.id).delete();
        }
      }

      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      if (activeMessage?.id === messageToDelete.id) {
        setActiveMessage(null);
      }
      setMessageToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete message: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Metrics
  const totalCount = messages.length;
  const todayCount = messages.filter((m) => {
    if (!m.createdAt) return false;
    const d = new Date(m.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const columns: DataGridColumn<AdminMessageItem>[] = [
    {
      key: 'createdAt',
      label: 'Received Date',
      sortType: 'date',
      width: '160px',
      getValue: (row) => (row.createdAt ? new Date(row.createdAt).getTime() : 0),
      render: (row) => {
        if (!row.createdAt) return '—';
        const d = new Date(row.createdAt);
        return (
          <div style={{ fontSize: '0.8125rem' }}>
            <div style={{ fontWeight: 600 }}>{d.toLocaleDateString()}</div>
            <div style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.75rem' }}>
              {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'name',
      label: 'Sender',
      width: '150px',
      render: (row) => (
        <div style={{ fontWeight: 600, color: 'var(--eg-text-primary, #f9fafb)' }}>
          {row.name}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '180px',
      render: (row) => (
        <a
          href={`mailto:${row.email}?subject=Regarding%20your%20inquiry%20to%20${encodeURIComponent(row.appName || 'our portal')}`}
          style={{
            color: 'var(--eg-color-sky, #38bdf8)',
            textDecoration: 'none',
            fontSize: '0.8125rem',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {row.email}
        </a>
      ),
    },
    {
      key: 'contact',
      label: 'Contact / Phone',
      width: '130px',
      render: (row) => <span>{row.contact || '—'}</span>,
    },
    {
      key: 'appName',
      label: 'Application',
      width: '120px',
      render: (row) => (
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 'var(--eg-radius-sm, 6px)',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--eg-color-indigo, #818cf8)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {row.appName || 'General'}
        </span>
      ),
    },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <div
          style={{
            maxHeight: '44px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            color: 'var(--eg-text-secondary, #d1d5db)',
            fontSize: '0.8125rem',
            lineHeight: 1.4,
          }}
        >
          {row.message}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'right',
      width: '140px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMessage(row);
            }}
            style={{
              padding: '4px 8px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255,255,255,0.12))',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: 'var(--eg-color-primary, #10b981)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="View message details"
          >
            View
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMessageToDelete(row);
            }}
            style={{
              padding: '4px 8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: '#f87171',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Delete message"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={`eg-admin-messages-view ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eg-space-6, 24px)', ...style }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 'var(--eg-text-xl, 1.25rem)', fontWeight: 700, margin: 0, color: 'var(--eg-text-primary, #f9fafb)' }}>
            {title}
          </h2>
        </div>
      )}
      {/* Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--eg-space-4, 16px)',
        }}
      >
        <StatCard
          title="Total Inquiries"
          value={totalCount}
          subtitle="All received user contact messages"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
          iconBgColor="rgba(56, 189, 248, 0.15)"
          iconColor="var(--eg-color-sky, #38bdf8)"
        />

        <StatCard
          title="Received Today"
          value={todayCount}
          subtitle="Messages logged in the last 24 hours"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
          iconBgColor="rgba(16, 185, 129, 0.15)"
          iconColor="var(--eg-color-primary, #10b981)"
        />
      </div>

      {/* Messages DataGrid */}
      <DataGrid<AdminMessageItem>
        data={messages}
        columns={columns}
        keyExtractor={(row) => row.id}
        loading={loading}
        exportFileName="contact_inquiries.csv"
        onRowClick={(row) => setActiveMessage(row)}
        toolbarSlot={
          <button
            type="button"
            onClick={() => loadMessages()}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              background: 'var(--eg-bg-primary, #030712)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              borderRadius: 'var(--eg-radius-md, 8px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              fontSize: 'var(--eg-text-xs, 0.8125rem)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>Refresh Messages</span>
          </button>
        }
      />

      {/* Message Inspection Modal */}
      {activeMessage && (
        <Modal
          isOpen={Boolean(activeMessage)}
          onClose={() => setActiveMessage(null)}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Inquiry from {activeMessage.name}</span>
            </div>
          }
          maxWidth="640px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setMessageToDelete(activeMessage);
                }}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: '#f87171',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`mailto:${activeMessage.email}?subject=Re:%20Inquiry%20regarding%20${encodeURIComponent(activeMessage.appName || 'our portal')}`}
                  style={{
                    padding: '6px 16px',
                    background: 'var(--eg-color-primary, #10b981)',
                    color: '#ffffff',
                    borderRadius: 'var(--eg-radius-md, 8px)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>Reply via Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  style={{
                    padding: '6px 16px',
                    background: 'var(--eg-bg-tertiary, #1f2937)',
                    border: '1px solid var(--eg-border, rgba(255,255,255,0.12))',
                    borderRadius: 'var(--eg-radius-md, 8px)',
                    color: 'var(--eg-text-primary, #f9fafb)',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Metadata Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '8px',
                background: 'var(--eg-bg-primary, #030712)',
                padding: '12px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                border: '1px solid var(--eg-border, rgba(255,255,255,0.06))',
                fontSize: '0.8125rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.7rem', display: 'block' }}>Email:</span>
                <span style={{ color: 'var(--eg-text-primary, #f9fafb)', fontWeight: 600 }}>{activeMessage.email}</span>
              </div>
              <div>
                <span style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.7rem', display: 'block' }}>Contact / Phone:</span>
                <span style={{ color: 'var(--eg-text-primary, #f9fafb)' }}>{activeMessage.contact || 'None'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.7rem', display: 'block' }}>Date Received:</span>
                <span style={{ color: 'var(--eg-text-primary, #f9fafb)' }}>
                  {activeMessage.createdAt ? new Date(activeMessage.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.7rem', display: 'block' }}>Target App:</span>
                <span style={{ color: 'var(--eg-color-sky, #38bdf8)' }}>{activeMessage.appName || 'General'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--eg-text-muted, #9ca3af)',
                  marginBottom: '6px',
                }}
              >
                Inquiry Message:
              </div>
              <div
                style={{
                  background: 'var(--eg-bg-primary, #030712)',
                  border: '1px solid var(--eg-border, rgba(255,255,255,0.08))',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  padding: '16px',
                  color: 'var(--eg-text-primary, #f9fafb)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  maxHeight: '40vh',
                  overflowY: 'auto',
                }}
              >
                {activeMessage.message}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <Modal
          isOpen={Boolean(messageToDelete)}
          onClose={() => setMessageToDelete(null)}
          title="Confirm Message Deletion"
          maxWidth="440px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
              <button
                type="button"
                onClick={() => setMessageToDelete(null)}
                style={{
                  padding: '6px 14px',
                  background: 'var(--eg-bg-tertiary, #1f2937)',
                  border: '1px solid var(--eg-border, rgba(255,255,255,0.12))',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: 'var(--eg-text-primary, #f9fafb)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                style={{
                  padding: '6px 14px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: '#ffffff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: deleting ? 'not-allowed' : 'pointer',
                }}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          }
        >
          <p style={{ color: 'var(--eg-text-secondary, #d1d5db)', fontSize: '0.875rem', margin: 0 }}>
            Are you sure you want to permanently delete the message from <strong>{messageToDelete.name}</strong>? This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};
