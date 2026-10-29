/**
 * @file AdminAnalyticsView.tsx
 * @description Comprehensive Visitor Analytics administrative console.
 * Integrates with the Batched Bucket Pattern (50 visitor logs per page document)
 * to minimize Cloud Firestore read quota usage while exposing full 16-field telemetry,
 * real-time domain filtering, multi-column sorting, modal inspection, and CSV export.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StatCard } from './StatCard';
import { DataGrid, DataGridColumn } from './DataGrid';
import { Modal } from '../common/Modal';
import { useFirebase } from '../../theme/FirebaseContext';

export interface AnalyticsLogItem {
  id: string;
  timestamp: string;
  appName: string;
  pageVisited: string;
  referrer?: string;
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  postal?: string;
  org?: string;
  timezone?: string;
  os?: string;
  browser?: string;
  screen?: string;
  language?: string;
  location?: string;
  raw?: any;
}

export interface AnalyticsMetaState {
  totalVisitors: number;
  todayCount: number;
  todayDate: string;
  currentPage: number;
}

export interface AdminAnalyticsViewProps {
  /** Firestore database instance (defaults to window.db) */
  db?: any;
  /** Collection name storing analytics meta and pages (default: 'visitor_analytics') */
  collectionName?: string;
  /** Domain list for filtering. If omitted, domains are automatically extracted from loaded records */
  domains?: string[];
  /** Optional custom fetcher override (for custom backends or static previews) */
  customFetcher?: () => Promise<{ meta: AnalyticsMetaState; logs: AnalyticsLogItem[] }>;
  /** Custom wrapper style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

function getTodayIsoDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  db: propDb,
  collectionName,
  domains,
  customFetcher,
  style,
  className = '',
}) => {
  const firebaseCtx = useFirebase();
  const targetCollection = collectionName || firebaseCtx.collections?.analytics || 'visitor_analytics';
  const [meta, setMeta] = useState<AnalyticsMetaState>({
    totalVisitors: 0,
    todayCount: 0,
    todayDate: getTodayIsoDate(),
    currentPage: 1,
  });
  const [bucketPage, setBucketPage] = useState<number>(1);
  const [totalBuckets, setTotalBuckets] = useState<number>(1);
  const [logs, setLogs] = useState<AnalyticsLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [activeLogModal, setActiveLogModal] = useState<AnalyticsLogItem | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'json'>('details');

  // Load analytics metadata and bucket documents
  const loadAnalytics = useCallback(async (targetBucket?: number) => {
    setLoading(true);
    try {
      if (customFetcher) {
        const res = await customFetcher();
        setMeta(res.meta);
        setLogs(res.logs);
        setTotalBuckets(res.meta.currentPage || 1);
        setLoading(false);
        return;
      }

      const firestore = propDb || firebaseCtx.db || (window as any).db || (window as any).firebase?.firestore?.();
      if (!firestore) {
        setLoading(false);
        return;
      }

      // 1. Fetch meta doc (1 read)
      const metaSnap = await firestore.collection(targetCollection).doc('meta').get();
      let maxBucket = 1;
      let totalCount = 0;
      let todayCount = 0;

      if (metaSnap.exists) {
        const m = metaSnap.data() || {};
        totalCount = m.totalVisitors || 0;
        maxBucket = m.currentPage || 1;
        const todayStr = getTodayIsoDate();
        todayCount = m.todayDate === todayStr ? m.todayCount || 0 : 0;
        setMeta({
          totalVisitors: totalCount,
          todayCount,
          todayDate: m.todayDate || todayStr,
          currentPage: maxBucket,
        });
      }

      setTotalBuckets(maxBucket);
      const chosenBucket = targetBucket != null ? targetBucket : bucketPage;

      // In bucket pattern: UI Page 1 maps to latest Firestore bucket (maxBucket)
      const targetDocNum = Math.max(1, maxBucket - chosenBucket + 1);

      // 2. Fetch bucket document (1 read, up to 50 logs)
      const pageSnap = await firestore.collection(targetCollection).doc(`page_${targetDocNum}`).get();

      if (pageSnap.exists) {
        const pageData = pageSnap.data() || {};
        const rawLogs = pageData.logs || [];

        const parsedLogs: AnalyticsLogItem[] = rawLogs.map((entry: any, idx: number) => {
          const locParts = [];
          if (entry.city && entry.city !== 'Unknown' && entry.city !== 'N/A') locParts.push(entry.city);
          if (entry.region && entry.region !== 'Unknown' && entry.region !== 'N/A') locParts.push(entry.region);
          if (entry.country && entry.country !== 'Unknown' && entry.country !== 'N/A') locParts.push(entry.country);
          const locationStr = locParts.length > 0 ? locParts.join(', ') : 'Unknown';

          return {
            id: entry.id || `v_log_${targetDocNum}_${idx}`,
            timestamp: entry.timestamp || '',
            appName: entry.appName || 'web-app',
            pageVisited: entry.pageVisited || '/',
            referrer: entry.referrer || 'Direct',
            ip: entry.ip || 'Unknown',
            city: entry.city || 'Unknown',
            region: entry.region || 'Unknown',
            country: entry.country || 'Unknown',
            postal: entry.postal || 'N/A',
            org: entry.org || '',
            timezone: entry.timezone || 'Unknown',
            os: entry.os || 'Unknown',
            browser: entry.browser || 'Unknown',
            screen: entry.screen || 'N/A',
            language: entry.language || 'en',
            location: locationStr,
            raw: entry,
          };
        });

        // Most recent first within bucket
        parsedLogs.reverse();
        setLogs(parsedLogs);
      } else {
        setLogs([]);
      }
    } catch (err: any) {
      console.warn('[eg-web-core] loadAnalytics warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, [propDb, firebaseCtx.db, targetCollection, customFetcher, bucketPage]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const handleBucketChange = (newBucketPage: number) => {
    const clamped = Math.max(1, Math.min(newBucketPage, totalBuckets));
    setBucketPage(clamped);
    loadAnalytics(clamped);
  };

  // Domain options and filtering
  const computedDomains = useMemo(() => {
    if (domains && domains.length > 0) return domains;
    const extracted = Array.from(new Set(logs.map((l) => l.appName).filter(Boolean)));
    return ['All Domains', ...extracted];
  }, [domains, logs]);

  const filteredLogs = useMemo(() => {
    if (selectedDomain === 'All Domains') return logs;
    return logs.filter((l) => l.appName.toLowerCase().includes(selectedDomain.toLowerCase()));
  }, [logs, selectedDomain]);

  // Column definitions for DataGrid
  const columns: DataGridColumn<AnalyticsLogItem>[] = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      sortType: 'date',
      width: '180px',
      render: (row) => {
        if (!row.timestamp) return '—';
        const d = new Date(row.timestamp);
        return (
          <div style={{ fontSize: '0.8125rem' }}>
            <div style={{ fontWeight: 600 }}>{d.toLocaleDateString()}</div>
            <div style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.75rem' }}>
              {d.toLocaleTimeString()}
            </div>
          </div>
        );
      },
    },
    {
      key: 'appName',
      label: 'Application / Domain',
      width: '150px',
      render: (row) => (
        <span
          style={{
            padding: '3px 8px',
            borderRadius: 'var(--eg-radius-sm, 6px)',
            background: 'rgba(56, 189, 248, 0.12)',
            color: 'var(--eg-color-sky, #38bdf8)',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {row.appName}
        </span>
      ),
    },
    {
      key: 'pageVisited',
      label: 'Page Visited',
      render: (row) => (
        <span
          style={{
            fontFamily: 'var(--eg-font-mono, monospace)',
            fontSize: '0.8125rem',
            color: 'var(--eg-text-primary, #f9fafb)',
          }}
        >
          {row.pageVisited}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (row) => <span>{row.location || 'Unknown'}</span>,
    },
    {
      key: 'ip',
      label: 'IP Address',
      sortType: 'ip',
      width: '130px',
      render: (row) => (
        <span style={{ fontFamily: 'var(--eg-font-mono, monospace)', fontSize: '0.8125rem' }}>
          {row.ip}
        </span>
      ),
    },
    {
      key: 'os',
      label: 'OS / Device',
      width: '120px',
      render: (row) => <span>{row.os || 'Unknown'}</span>,
    },
    {
      key: 'browser',
      label: 'Browser',
      width: '120px',
      render: (row) => <span>{row.browser || 'Unknown'}</span>,
    },
    {
      key: 'actions',
      label: 'Action',
      sortable: false,
      align: 'center',
      width: '90px',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveLogModal(row);
            setModalTab('details');
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
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className={`eg-admin-analytics-view ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--eg-space-6, 24px)', ...style }}>
      {/* 3 Top Metric StatCards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--eg-space-4, 16px)',
        }}
      >
        <StatCard
          title="Total Unique Visitors"
          value={meta.totalVisitors}
          subtitle="Cumulative across all recorded domains"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          iconBgColor="rgba(16, 185, 129, 0.15)"
          iconColor="var(--eg-color-primary, #10b981)"
        />

        <StatCard
          title="Today's Visitors"
          value={meta.todayCount}
          subtitle={`Date: ${meta.todayDate}`}
          trend={{ value: 'Active', direction: 'up' }}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          iconBgColor="rgba(56, 189, 248, 0.15)"
          iconColor="var(--eg-color-sky, #38bdf8)"
        />

        <StatCard
          title="Telemetry Storage Buckets"
          value={`${bucketPage} / ${totalBuckets}`}
          subtitle="50 visitor logs per bucket page"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          }
          iconBgColor="rgba(245, 158, 11, 0.15)"
          iconColor="var(--eg-color-amber, #f59e0b)"
        />
      </div>

      {/* Main DataGrid Section with Bucket Navigator Toolbar */}
      <DataGrid<AnalyticsLogItem>
        data={filteredLogs}
        columns={columns}
        keyExtractor={(row) => row.id}
        loading={loading}
        exportFileName={`analytics_bucket_${bucketPage}.csv`}
        toolbarSlot={
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Domain Filter */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              style={{
                background: 'var(--eg-bg-primary, #030712)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: 'var(--eg-text-primary, #f9fafb)',
                padding: '7px 12px',
                fontSize: 'var(--eg-text-xs, 0.8125rem)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {computedDomains.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>

            {/* Bucket Page Stepper */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--eg-bg-primary, #030712)',
                padding: '2px 6px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
              }}
            >
              <button
                type="button"
                disabled={bucketPage <= 1 || loading}
                onClick={() => handleBucketChange(bucketPage - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--eg-text-primary, #f9fafb)',
                  cursor: bucketPage <= 1 ? 'not-allowed' : 'pointer',
                  opacity: bucketPage <= 1 ? 0.3 : 1,
                  padding: '4px 6px',
                }}
                title="Newer bucket"
              >
                ‹
              </button>
              <span
                style={{
                  fontSize: 'var(--eg-text-xs, 0.75rem)',
                  color: 'var(--eg-text-muted, #9ca3af)',
                  whiteSpace: 'nowrap',
                }}
              >
                Bucket {bucketPage} of {totalBuckets}
              </span>
              <button
                type="button"
                disabled={bucketPage >= totalBuckets || loading}
                onClick={() => handleBucketChange(bucketPage + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--eg-text-primary, #f9fafb)',
                  cursor: bucketPage >= totalBuckets ? 'not-allowed' : 'pointer',
                  opacity: bucketPage >= totalBuckets ? 0.3 : 1,
                  padding: '4px 6px',
                }}
                title="Older bucket"
              >
                ›
              </button>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => loadAnalytics()}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
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
                style={{
                  animation: loading ? 'spin 0.8s linear infinite' : 'none',
                }}
              >
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        }
      />

      {/* Complete 16-Field Telemetry Details Modal */}
      {activeLogModal && (
        <Modal
          isOpen={Boolean(activeLogModal)}
          onClose={() => setActiveLogModal(null)}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Visitor Telemetry Details</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--eg-color-sky, #38bdf8)',
                }}
              >
                {activeLogModal.appName}
              </span>
            </div>
          }
          maxWidth="700px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setModalTab('details')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--eg-radius-sm, 6px)',
                    border: 'none',
                    background: modalTab === 'details' ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-bg-tertiary, #1f2937)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Formatted Details
                </button>
                <button
                  type="button"
                  onClick={() => setModalTab('json')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--eg-radius-sm, 6px)',
                    border: 'none',
                    background: modalTab === 'json' ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-bg-tertiary, #1f2937)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Raw JSON
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveLogModal(null)}
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
          }
        >
          {modalTab === 'details' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                fontSize: '0.8125rem',
                maxHeight: '60vh',
                overflowY: 'auto',
                padding: '4px',
              }}
            >
              {[
                { label: 'Timestamp', val: activeLogModal.timestamp ? new Date(activeLogModal.timestamp).toLocaleString() : 'N/A' },
                { label: 'Application', val: activeLogModal.appName },
                { label: 'Page Visited', val: activeLogModal.pageVisited },
                { label: 'Referrer', val: activeLogModal.referrer || 'Direct' },
                { label: 'IP Address', val: activeLogModal.ip },
                { label: 'City', val: activeLogModal.city || 'Unknown' },
                { label: 'Region / State', val: activeLogModal.region || 'Unknown' },
                { label: 'Country', val: activeLogModal.country || 'Unknown' },
                { label: 'Postal Code', val: activeLogModal.postal || 'N/A' },
                { label: 'ISP / Organization', val: activeLogModal.org || 'N/A' },
                { label: 'Timezone', val: activeLogModal.timezone || 'Unknown' },
                { label: 'Operating System', val: activeLogModal.os || 'Unknown' },
                { label: 'Browser', val: activeLogModal.browser || 'Unknown' },
                { label: 'Screen Resolution', val: activeLogModal.screen || 'N/A' },
                { label: 'Language', val: activeLogModal.language || 'en' },
              ].map((field, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--eg-bg-primary, #030712)',
                    borderRadius: 'var(--eg-radius-sm, 6px)',
                    border: '1px solid var(--eg-border, rgba(255,255,255,0.06))',
                  }}
                >
                  <div style={{ color: 'var(--eg-text-muted, #9ca3af)', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    {field.label}
                  </div>
                  <div style={{ color: 'var(--eg-text-primary, #f9fafb)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {field.val}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <pre
              style={{
                background: 'var(--eg-bg-primary, #030712)',
                padding: '16px',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: 'var(--eg-color-emerald, #00dc82)',
                fontFamily: 'var(--eg-font-mono, monospace)',
                fontSize: '0.75rem',
                maxHeight: '60vh',
                overflow: 'auto',
                border: '1px solid var(--eg-border, rgba(255,255,255,0.08))',
              }}
            >
              {JSON.stringify(activeLogModal.raw || activeLogModal, null, 2)}
            </pre>
          )}
        </Modal>
      )}
    </div>
  );
};
