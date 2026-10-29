import React, { useState, useEffect } from 'react';

export type AntivirusState = 'protected' | 'warning' | 'danger';
export type DesktopTab = 'dashboard' | 'scan' | 'quarantine' | 'logs' | 'settings';

export interface QuarantinedItem {
  id: string;
  fileName: string;
  threatName: string;
  quarantinedAt: string;
  originalPath: string;
  size: string;
}

const INITIAL_QUARANTINE_ITEMS: QuarantinedItem[] = [
  {
    id: 'q-1',
    fileName: 'invoice_march_2026.pdf.exe',
    threatName: 'Win.Trojan.Agent-99214',
    quarantinedAt: '2026-10-18 14:22:05',
    originalPath: '/home/user/Downloads/invoice_march_2026.pdf.exe',
    size: '1.4 MB',
  },
  {
    id: 'q-2',
    fileName: 'eicar.com.txt',
    threatName: 'Win.Test.EICAR_HDB-1',
    quarantinedAt: '2026-10-19 09:15:30',
    originalPath: '/tmp/eicar.com.txt',
    size: '68 Bytes',
  },
  {
    id: 'q-3',
    fileName: 'suspicious_payload.py',
    threatName: 'Unix.Ransom.LockBit-77',
    quarantinedAt: '2026-10-20 18:40:12',
    originalPath: '/var/tmp/suspicious_payload.py',
    size: '320 KB',
  },
];

export interface DesktopPreviewSimulatorProps {
  appName?: string;
  version?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Interactive PySide6 Qt desktop antivirus GUI simulator for web browsers.
 * Replicates a desktop security interface with a 3-tier status matrix
 * (Protected/Warning/Danger), 4 scan profiles, live scanning modal,
 * Quarantine threat manager, terminal activity logs, and settings tabs.
 *
 * @example
 * ```tsx
 * <DesktopPreviewSimulator appName="Security Suite" version="1.0.0" />
 * ```
 */
export const DesktopPreviewSimulator: React.FC<DesktopPreviewSimulatorProps> = ({
  appName = 'Security Suite',
  version = '1.0.0',
  className = '',
  style = {},
}) => {
  const [activeTab, setActiveTab] = useState<DesktopTab>('dashboard');
  const [statusState, setStatusState] = useState<AntivirusState>('protected');

  // Scanning engine state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProfile, setScanProfile] = useState('Quick Scan');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanPath, setCurrentScanPath] = useState('');
  const [scannedFilesCount, setScannedFilesCount] = useState(14820);
  const [scanElapsedSecs, setScanElapsedSecs] = useState(0);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Quarantine state
  const [quarantineItems, setQuarantineItems] = useState(INITIAL_QUARANTINE_ITEMS);
  const [selectedQuarantineId, setSelectedQuarantineId] = useState<string | null>(null);

  // Settings demo
  const [guestId, setGuestId] = useState('Guest88419203');
  const [guestGenerated, setGuestGenerated] = useState(false);

  const mockFilePaths = [
    '/usr/bin/python3.11',
    '/lib/x86_64-linux-gnu/libc.so.6',
    '/etc/ssl/certs/ca-certificates.crt',
    '/var/log/syslog',
    '/home/user/Downloads/package.tar.gz',
    '/usr/local/bin/docker',
    '/opt/google/chrome/chrome',
    '/home/user/.bashrc',
    '/var/cache/apt/archives/lock',
    '/home/user/Documents/project_plan.docx',
    '/usr/lib/systemd/systemd',
  ];

  // Scan progress timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isScanning) {
      timer = setInterval(() => {
        setScanElapsedSecs((s) => s + 1);
        setScanProgress((prev) => {
          if (prev >= 100) {
            setIsScanning(false);
            return 100;
          }
          const next = prev + 4;
          setScannedFilesCount((c) => c + Math.floor(Math.random() * 28) + 12);
          setCurrentScanPath(mockFilePaths[Math.floor(Math.random() * mockFilePaths.length)]);
          return next;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isScanning]);

  const handleStartScan = (profile = 'Quick Scan') => {
    setScanProfile(profile);
    setScanProgress(0);
    setScanElapsedSecs(0);
    setIsScanning(true);
    setIsScanModalOpen(true);
  };

  const handleCancelScan = () => {
    setIsScanning(false);
    setIsScanModalOpen(false);
  };

  const handleRestoreQuarantine = () => {
    if (!selectedQuarantineId) return;
    setQuarantineItems((prev) => prev.filter((item) => item.id !== selectedQuarantineId));
    setSelectedQuarantineId(null);
  };

  const handleDeleteQuarantine = () => {
    if (!selectedQuarantineId) return;
    setQuarantineItems((prev) => prev.filter((item) => item.id !== selectedQuarantineId));
    setSelectedQuarantineId(null);
  };

  const handleGenerateGuestId = () => {
    const rand = Math.floor(10000000 + Math.random() * 90000000);
    setGuestId(`Guest${rand}`);
    setGuestGenerated(true);
  };

  return (
    <div
      className={`eg-desktop-preview-window desktop-preview-window ${className}`}
      style={{
        maxWidth: '1020px',
        margin: '0 auto',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        background: '#15151c',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.75), 0 0 1px rgba(255, 255, 255, 0.2)',
        fontFamily: 'var(--eg-font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        color: '#f4f4f6',
        ...style,
      }}
    >
      {/* 1. Native Window Titlebar */}
      <div
        style={{
          background: '#0b0b0e',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#00dc82' }} />
        </div>
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#a0a0ab' }}>
          {appName} v{version} — System Security Suite (Qt6 / ClamAV®)
        </span>
        {/* Interactive 3-Tier State Matrix Switcher */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['protected', 'warning', 'danger'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusState(st)}
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                background: statusState === st ? (st === 'protected' ? '#00dc82' : st === 'warning' ? '#f59e0b' : '#ef4444') : 'rgba(255, 255, 255, 0.08)',
                color: statusState === st ? '#000' : '#888',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Window Body with Left Qt Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '480px' }}>
        {/* Left Qt Sidebar */}
        <div
          style={{
            background: '#101015',
            padding: '20px 12px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'scan', label: 'Scan Engine', icon: '🔍' },
              { id: 'quarantine', label: 'Quarantine', icon: '☣️' },
              { id: 'logs', label: 'Scan Logs', icon: '📜' },
              { id: 'settings', label: 'Settings', icon: '⚙️' },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as DesktopTab)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: active ? 'rgba(0, 220, 130, 0.15)' : 'transparent',
                    color: active ? '#00dc82' : '#a0a0ab',
                    fontWeight: active ? 700 : 500,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Engine Status Widget in Sidebar */}
          <div
            style={{
              padding: '12px',
              background: '#15151c',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <span style={{ fontSize: '11px', color: '#6e6e7c', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
              Engine Status
            </span>
            <span
              style={{
                fontSize: '12.5px',
                color: statusState === 'danger' ? '#ef4444' : '#00dc82',
                fontWeight: 600,
              }}
            >
              {statusState === 'danger' ? '✕ Offline (Error)' : '● Online (v0.103.11)'}
            </span>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ padding: '28px', background: '#15151c', overflowY: 'auto' }}>
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              {/* 3-Tier Status Banner */}
              <div
                style={{
                  background:
                    statusState === 'protected'
                      ? 'rgba(0, 220, 130, 0.08)'
                      : statusState === 'warning'
                      ? 'rgba(234, 179, 8, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                  border: `1px solid ${
                    statusState === 'protected'
                      ? 'rgba(0, 220, 130, 0.3)'
                      : statusState === 'warning'
                      ? 'rgba(234, 179, 8, 0.3)'
                      : 'rgba(239, 68, 68, 0.3)'
                  }`,
                  borderRadius: '10px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '18px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '38px' }}>
                  {statusState === 'protected' ? '🛡️' : statusState === 'warning' ? '⚠️' : '❌'}
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 4px',
                      fontSize: '18px',
                      color:
                        statusState === 'protected'
                          ? '#00dc82'
                          : statusState === 'warning'
                          ? '#f59e0b'
                          : '#ef4444',
                      fontWeight: 800,
                    }}
                  >
                    {statusState === 'protected'
                      ? 'System Protected'
                      : statusState === 'warning'
                      ? 'System at Risk (Real-Time Guard Disabled)'
                      : 'Engine Not Detected'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#a0a0ab' }}>
                    {statusState === 'protected'
                      ? 'Real-time filesystem protection is active. Virus signatures are up to date.'
                      : statusState === 'warning'
                      ? 'Real-Time Guard is turned off. Background monitoring is currently halted.'
                      : 'ClamAV daemon was not found in PATH or configured folders. Configure engine in Settings.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartScan('Quick Scan')}
                  style={{
                    background: statusState === 'danger' ? '#ef4444' : '#00dc82',
                    color: '#0b0b0e',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {statusState === 'danger' ? 'Configure...' : 'Scan Now →'}
                </button>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#1b1b24', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6e6e7c', textTransform: 'uppercase', fontWeight: 700 }}>
                    Signatures Database
                  </span>
                  <p style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: 800, color: '#f4f4f6' }}>
                    8,650,420 defs
                  </p>
                </div>
                <div style={{ background: '#1b1b24', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6e6e7c', textTransform: 'uppercase', fontWeight: 700 }}>
                    Last Scanned Items
                  </span>
                  <p style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: 800, color: '#f4f4f6' }}>
                    {scannedFilesCount.toLocaleString()} files
                  </p>
                </div>
                <div style={{ background: '#1b1b24', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#6e6e7c', textTransform: 'uppercase', fontWeight: 700 }}>
                    Active Quarantine
                  </span>
                  <p style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>
                    {quarantineItems.length} threats isolated
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('scan');
                    handleStartScan('Full System Scan');
                  }}
                  style={{
                    background: '#00dc82',
                    color: '#0b0b0e',
                    fontWeight: 700,
                    fontSize: '13.5px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Full System Audit
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('quarantine')}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    cursor: 'pointer',
                  }}
                >
                  View Quarantine ({quarantineItems.length})
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SCAN ENGINE */}
          {activeTab === 'scan' && (
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Antivirus Scan Profiles</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '24px' }}>
                {[
                  { title: 'Quick Scan', desc: 'High-priority system binaries & memory areas', icon: '⚡' },
                  { title: 'Full System Scan', desc: 'Entire root filesystem, all attached drives & storage', icon: '💽' },
                  { title: 'Memory Scan', desc: 'Running process spaces & active shared libraries', icon: '🧠' },
                  { title: 'Custom Path Scan', desc: 'Inspect user-selected files, directories, or archives', icon: '📂' },
                ].map((profile) => (
                  <div
                    key={profile.title}
                    style={{
                      background: '#1b1b24',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '20px' }}>{profile.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{profile.title}</h4>
                      </div>
                      <p style={{ margin: 0, fontSize: '12.5px', color: '#a0a0ab' }}>{profile.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartScan(profile.title)}
                      disabled={isScanning}
                      style={{
                        background: 'rgba(0, 220, 130, 0.15)',
                        border: '1px solid #00dc82',
                        color: '#00dc82',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        cursor: isScanning ? 'not-allowed' : 'pointer',
                        alignSelf: 'flex-start',
                      }}
                    >
                      Launch Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUARANTINE MANAGER */}
          {activeTab === 'quarantine' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Isolated Threat Quarantine</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleRestoreQuarantine}
                    disabled={!selectedQuarantineId}
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid #3b82f6',
                      color: '#60a5fa',
                      fontSize: '12.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: selectedQuarantineId ? 'pointer' : 'not-allowed',
                      opacity: selectedQuarantineId ? 1 : 0.4,
                    }}
                  >
                    Restore File
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteQuarantine}
                    disabled={!selectedQuarantineId}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#ef4444',
                      fontSize: '12.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: selectedQuarantineId ? 'pointer' : 'not-allowed',
                      opacity: selectedQuarantineId ? 1 : 0.4,
                    }}
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>

              {/* Table */}
              <div style={{ background: '#101015', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#0b0b0e', color: '#a0a0ab', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <th style={{ padding: '10px 14px' }}>File Name</th>
                      <th style={{ padding: '10px 14px' }}>Threat Classification</th>
                      <th style={{ padding: '10px 14px' }}>Quarantined Date</th>
                      <th style={{ padding: '10px 14px' }}>Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarantineItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6e6e7c' }}>
                          Quarantine vault is empty. No active threats detected.
                        </td>
                      </tr>
                    ) : (
                      quarantineItems.map((item) => {
                        const isSelected = item.id === selectedQuarantineId;
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedQuarantineId(item.id)}
                            style={{
                              background: isSelected ? 'rgba(0, 220, 130, 0.12)' : 'transparent',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                            }}
                          >
                            <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f4f4f6' }}>
                              {item.fileName}
                            </td>
                            <td style={{ padding: '10px 14px', color: '#ef4444', fontWeight: 600 }}>
                              {item.threatName}
                            </td>
                            <td style={{ padding: '10px 14px', color: '#a0a0ab' }}>{item.quarantinedAt}</td>
                            <td style={{ padding: '10px 14px', color: '#6e6e7c' }}>{item.size}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SCAN LOGS */}
          {activeTab === 'logs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Engine Log Terminal</h3>
                <span style={{ fontSize: '11px', color: '#6e6e7c' }}>/var/log/clamav/clamd.log</span>
              </div>
              <div
                style={{
                  background: '#101015',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'var(--eg-font-mono, monospace)',
                  fontSize: '12px',
                  color: '#a0a0ab',
                  height: '280px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div>[INFO] {appName} initializing daemon link...</div>
                <div>[INFO] ClamAV® daemon engine v0.103.11 loaded</div>
                <div>[INFO] Virus database daily.cvd v27140 loaded (8,650,420 signatures)</div>
                <div>[SCAN] Automated fast audit initialized on root partition</div>
                <div>[WARN] Found suspicious binary pattern in /home/user/Downloads/invoice_march_2026.pdf.exe</div>
                <div style={{ color: '#ef4444' }}>[ALERT] Threat detected: Win.Trojan.Agent-99214</div>
                <div style={{ color: '#00dc82' }}>[ACTION] Successfully relocated threat to /var/lib/clamav/quarantine/</div>
                <div>[SCAN] Real-time filesystem monitor daemon running on port 3310</div>
              </div>
            </div>
          )}

          {/* TAB 5: PREFERENCES / SETTINGS */}
          {activeTab === 'settings' && (
            <div>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Security Preferences</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#a0a0ab', display: 'block', marginBottom: '6px' }}>
                    ClamAV Engine Binary Path
                  </label>
                  <input
                    type="text"
                    defaultValue="/usr/bin/clamscan"
                    style={{
                      width: '100%',
                      maxWidth: '440px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#101015',
                      color: '#fff',
                      fontSize: '13px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Automatic background database updates (FreshClam daily synchronization)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Scan archive and compressed package contents (.zip, .tar.gz, .iso, .deb)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Automatically isolate detected threats into encrypted Quarantine</span>
                </label>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                  <label style={{ fontSize: '12px', color: '#a0a0ab', display: 'block', marginBottom: '6px' }}>
                    Telemetry & Privacy Control (One-Time Guest Identifier)
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={guestId}
                      readOnly
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: '#101015',
                        color: '#00dc82',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        width: '200px',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateGuestId}
                      disabled={guestGenerated}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        border: 'none',
                        background: guestGenerated ? '#334155' : 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '12.5px',
                        cursor: guestGenerated ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {guestGenerated ? 'Guest ID Generated' : 'Generate New ID'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Modal Scan Progress Dialog */}
      {isScanModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
        >
          <div
            style={{
              background: '#15151c',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '28px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {isScanning ? `Running ${scanProfile}...` : 'Scan Completed!'}
              </h3>
              <span style={{ fontSize: '12px', color: '#a0a0ab' }}>Elapsed: {scanElapsedSecs}s</span>
            </div>

            <div style={{ background: '#101015', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '12px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${scanProgress}%`,
                  background: '#00dc82',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#a0a0ab', marginBottom: '16px' }}>
              <span>Progress: {scanProgress}%</span>
              <span>Scanned Files: {scannedFilesCount.toLocaleString()}</span>
            </div>

            {isScanning && (
              <div
                style={{
                  fontSize: '11.5px',
                  fontFamily: 'monospace',
                  color: '#6e6e7c',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '20px',
                }}
              >
                Target: {currentScanPath}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {isScanning ? (
                <button
                  type="button"
                  onClick={handleCancelScan}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel Scan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsScanModalOpen(false)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '6px',
                    background: '#00dc82',
                    border: 'none',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Close Summary
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
