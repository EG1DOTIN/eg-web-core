import React from 'react';
import {
  IconProps,
  SocialIcon,
  ChessKnightIcon,
  ChessPawnIcon,
  GlobeIcon,
  EnvelopeIcon,
} from './SocialIcons';

export type { IconProps };

/* ==========================================================================
   Navigation, Arrows & Basic Actions
   ========================================================================== */

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const ArrowUpIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
export const TimesIcon = CloseIcon;

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
export const BarsIcon = MenuIcon;

export const RefreshIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M21.5 2v6h-6" />
    <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
  </svg>
);
export const SyncIcon = RefreshIcon;

export const UndoIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

export const RedoIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export const SlidersIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

/* ==========================================================================
   Media & Interactive Controls
   ========================================================================== */

export const PlayIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const StopIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
  </svg>
);

export const StepBackwardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="19 20 9 12 19 4 19 20" />
    <line x1="5" y1="19" x2="5" y2="5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const StepForwardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="5" x2="19" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const FastBackwardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="11 19 2 12 11 5 11 19" />
    <polygon points="22 19 13 12 22 5 22 19" />
  </svg>
);

export const FastForwardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="13 19 22 12 13 5 13 19" />
    <polygon points="2 19 11 12 2 5 2 19" />
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

export const ExpandIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const CompressIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="10" y1="14" x2="3" y2="21" />
  </svg>
);

/* ==========================================================================
   UI, System, Alerts & Preferences
   ========================================================================== */

export const HomeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const UnlockIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const BookmarkIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2.5" />
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.5" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2.5" />
  </svg>
);

export const TimesCircleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2.5" />
    <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2.5" />
  </svg>
);

export const QuestionCircleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2.5" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
export const SettingsIcon = CogIcon;

/* ==========================================================================
   Tech, Engineering, Software & Antivirus
   ========================================================================== */

export const ShieldIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" strokeWidth="2.5" />
  </svg>
);

export const BugIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="6" y="8" width="12" height="12" rx="6" />
    <path d="M12 2v6M4 11h4M16 11h4M4 17h4M16 17h4M7 5l2.5 3M17 5l-2.5 3" />
  </svg>
);

export const DesktopIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2.5" />
    <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2.5" />
  </svg>
);

export const CloudIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
  </svg>
);

export const CpuIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" fill={color} />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);
export const MicrochipIcon = CpuIcon;

export const RobotIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="2.5" />
    <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="2.5" />
  </svg>
);

export const RocketIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
  </svg>
);

export const MicroscopeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14h-1M9 14h2" />
    <rect x="7" y="4" width="4" height="8" rx="1" />
  </svg>
);

export const WrenchIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);
export const ToolsIcon = WrenchIcon;

export const BoltIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
export const ZapIcon = BoltIcon;

export const SparklesIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
  </svg>
);

export const BullhornIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M2 10v4a2 2 0 0 0 2 2h4l6 4V4L8 8H4a2 2 0 0 0-2 2z" />
    <path d="M18 8a5 5 0 0 1 0 8M21 5a9 9 0 0 1 0 14" />
  </svg>
);

export const TrophyIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M6 3h12v7a6 6 0 0 1-12 0V3zM9 21h6M12 16v5" />
  </svg>
);

export const MedalIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="14" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export const TargetIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);
export const BullseyeIcon = TargetIcon;

export const PuzzleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M20.5 11H19V7a2 2 0 0 0-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4a2 2 0 0 0-2 2v4h1.5a2.5 2.5 0 0 1 0 5H2v4a2 2 0 0 0 2 2h4v-1.5a2.5 2.5 0 0 1 5 0V21h4a2 2 0 0 0 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z" />
  </svg>
);

export const QuoteIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8zm13 0c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 0 4-1 6-1 8z" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
export const BookOpenIcon = BookIcon;

export const NewspaperIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const LandmarkIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="2" y1="22" x2="22" y2="22" />
    <line x1="12" y1="2" x2="2" y2="7" />
    <line x1="12" y1="2" x2="22" y2="7" />
    <line x1="2" y1="7" x2="22" y2="7" />
    <line x1="5" y1="10" x2="5" y2="18" />
    <line x1="9" y1="10" x2="9" y2="18" />
    <line x1="15" y1="10" x2="15" y2="18" />
    <line x1="19" y1="10" x2="19" y2="18" />
  </svg>
);

export const CompassIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={color} />
  </svg>
);

export const HandshakeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M11 17l-5-5a2.828 2.828 0 1 1 4-4l1 1 1-1a2.828 2.828 0 1 1 4 4l-5 5z" />
    <path d="M12 11l4 4 5-5M2 13l4-4" />
  </svg>
);

export const FlagIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </svg>
);

export const TvIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
    <polyline points="17 2 12 7 7 2" />
  </svg>
);

export const GraduationCapIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);
export const AcademicCapIcon = GraduationCapIcon;
export const LearnIcon = GraduationCapIcon;

export const GamepadIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="6" />
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="15" y1="13" x2="15.01" y2="13" strokeWidth="2.5" />
    <line x1="18" y1="11" x2="18.01" y2="11" strokeWidth="2.5" />
  </svg>
);
export const ControllerIcon = GamepadIcon;

export const BrainIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5c0 .3.03.6.09.89A4.5 4.5 0 0 0 3 11a4.5 4.5 0 0 0 2.5 4 4.5 4.5 0 0 0 4 4.5V2zm5 0A4.5 4.5 0 0 1 19 6.5c0 .3-.03.6-.09.89A4.5 4.5 0 0 1 21 11a4.5 4.5 0 0 1-2.5 4 4.5 4.5 0 0 1-4 4.5V2z" />
    <path d="M9.5 12h5" />
  </svg>
);
export const TrainIcon = BrainIcon;

export const ScrollIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M8 2h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 0-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2z" />
    <path d="M4 18a2 2 0 0 0 2 2h13" />
    <path d="M8 7h8M8 11h6" />
  </svg>
);
export const ParchmentIcon = ScrollIcon;

export const GlobeAsiaIcon = GlobeIcon;
export const WorldIcon = GlobeIcon;

export const EyeIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeSlashIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const CrownIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z" fill={color} fillOpacity="0.2" />
    <path d="M2 4l3 12h14l3-12-6 7-4-11-4 11-6-7z" />
    <rect x="4" y="18" width="16" height="3" rx="1" fill={color} />
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
export const FlameIcon = FireIcon;

export const ChartLineIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M3 3v18h18" />
    <polyline points="19 9 14 14 10 10 7 13" />
  </svg>
);
export const AnalyticsIcon = ChartLineIcon;

export const ClipboardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
export const MapMarkerIcon = MapPinIcon;

export const MailIcon = EnvelopeIcon;

export const ListIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
  </svg>
);
export const ListAltIcon = ListIcon;

export const HistoryIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </svg>
);

export const SignalIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4" />
  </svg>
);

export const NetworkWiredIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="9" y="2" width="6" height="4" rx="1" />
    <rect x="2" y="18" width="6" height="4" rx="1" />
    <rect x="16" y="18" width="6" height="4" rx="1" />
    <path d="M12 6v6m0 0H5v6m7-6h7v6" />
  </svg>
);

export const BalanceScaleIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="4" y1="7" x2="20" y2="7" />
    <path d="M4 7l-2 7a3 3 0 0 0 6 0L6 7zm14 0l-2 7a3 3 0 0 0 6 0L20 7z" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);
export const ScaleIcon = BalanceScaleIcon;

export const SkullIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="9" cy="11" r="1.5" fill={color} />
    <circle cx="15" cy="11" r="1.5" fill={color} />
    <path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5 2.5 6.5V19a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2.5c1-1.5 2.5-3.5 2.5-6.5a8 8 0 0 0-8-8z" />
    <line x1="10" y1="18" x2="10" y2="21" />
    <line x1="14" y1="18" x2="14" y2="21" />
  </svg>
);
export const SkullCrossbonesIcon = SkullIcon;

export const StopwatchIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="13" r="8" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <path d="M12 2v3M10 2h4M19 6l-1.5 1.5" />
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A6 6 0 1 0 7.5 11.5c.76.76 1.23 1.52 1.41 2.5" />
  </svg>
);

export const KeyboardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <line x1="6" y1="8" x2="6.01" y2="8" strokeWidth="2" />
    <line x1="10" y1="8" x2="10.01" y2="8" strokeWidth="2" />
    <line x1="14" y1="8" x2="14.01" y2="8" strokeWidth="2" />
    <line x1="18" y1="8" x2="18.01" y2="8" strokeWidth="2" />
    <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="2" />
    <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="2" />
    <line x1="9" y1="16" x2="15" y2="16" />
  </svg>
);

export const LayerGroupIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 12 12 17 22 12" />
    <polyline points="2 17 12 22 22 17" />
  </svg>
);
export const LayersIcon = LayerGroupIcon;

export const PaletteIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="13.5" cy="6.5" r=".8" fill={color} />
    <circle cx="17.5" cy="10.5" r=".8" fill={color} />
    <circle cx="8.5" cy="7.5" r=".8" fill={color} />
    <circle cx="6.5" cy="12.5" r=".8" fill={color} />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.24-.28-.39-.63-.39-1.02 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z" />
  </svg>
);

export const CrosshairsIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="22" y1="12" x2="18" y2="12" />
    <line x1="6" y1="12" x2="2" y2="12" />
    <line x1="12" y1="6" x2="12" y2="2" />
    <line x1="12" y1="22" x2="12" y2="18" />
  </svg>
);

export const CutIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);
export const ScissorsIcon = CutIcon;

export const CodeBranchIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);
export const ForkIcon = CodeBranchIcon;

export const ShareIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
export const ShareAltIcon = ShareIcon;

export const DoorOpenIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);
export const SignOutIcon = DoorOpenIcon;

/* ==========================================================================
   Chess Pieces & Board Vector Icons
   ========================================================================== */

export const ChessQueenIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M501.97 187.35l-71.09 177.72c-2.45 6.13-7.51 10.74-13.8 12.59l-42.92 12.63c-3.15.93-6.49.52-9.33-1.15l-108.83-64-108.83 64c-2.84 1.67-6.18 2.08-9.33 1.15l-42.92-12.63c-6.29-1.85-11.35-6.46-13.8-12.59L10.03 187.35C4.25 172.9 14.86 157.5 30.41 157.5c6.51 0 12.82 2.76 17.26 7.56l72.97 78.85 41.56-173.18C165.26 56.44 178.69 48 193.28 48h125.44c14.59 0 28.02 8.44 31.08 22.73l41.56 173.18 72.97-78.85c4.44-4.8 10.75-7.56 17.26-7.56 15.55 0 26.16 15.4 20.38 29.85zM448 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h384c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
  </svg>
);

export const ChessKingIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 448 512" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M384 432H64c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm48-272h-40.42c-1.35-25.13-13.43-47.53-31.95-63.02L382.72 48H320V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32h-64V16c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16v32H65.28l23.09 48.98C69.85 112.47 57.77 134.87 56.42 160H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h34.61c16.29 88.58 87.27 160 173.39 160s157.1-71.42 173.39-160H432c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
  </svg>
);

export const ChessRookIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M384 128V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32h-64V48c0-8.84-7.16-16-16-16h-48c-8.84 0-16 7.16-16 16v32H96V48c0-8.84-7.16-16-16-16H32c-8.84 0-16 7.16-16 16v80c0 14.59 9.87 27.08 24 30.65v146.7c-14.13 3.57-24 16.06-24 30.65 0 17.67 14.33 32 32 32h288c17.67 0 32-14.33 32-32 0-14.59-9.87-27.08-24-30.65V158.65c14.13-3.57 24-16.06 24-30.65zM352 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
  </svg>
);

export const ChessBishopIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 320 512" fill={color} className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <path d="M160 0c-44.18 0-80 35.82-80 80 0 16.27 4.95 31.33 13.31 44.07C64.95 145.45 48 181.76 48 224c0 38.64 14.19 72.44 37.66 96H48c-26.51 0-48 21.49-48 48v16h320v-16c0-26.51-21.49-48-48-48h-37.66C257.81 296.44 272 262.64 272 224c0-42.24-16.95-78.55-45.31-99.93C235.05 111.33 240 96.27 240 80c0-44.18-35.82-80-80-80zm128 432H32c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h256c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16z" />
  </svg>
);

export const ChessBoardIcon: React.FC<IconProps> = ({ size = 18, color = 'currentColor', className = '', style, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', ...style }} aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="2" fill="none" />
    <rect x="3" y="3" width="4.5" height="4.5" fill={color} />
    <rect x="12" y="3" width="4.5" height="4.5" fill={color} />
    <rect x="7.5" y="7.5" width="4.5" height="4.5" fill={color} />
    <rect x="16.5" y="7.5" width="4.5" height="4.5" fill={color} />
    <rect x="3" y="12" width="4.5" height="4.5" fill={color} />
    <rect x="12" y="12" width="4.5" height="4.5" fill={color} />
    <rect x="7.5" y="16.5" width="4.5" height="4.5" fill={color} />
    <rect x="16.5" y="16.5" width="4.5" height="4.5" fill={color} />
  </svg>
);

/* ==========================================================================
   Universal Icon Dispatcher Component
   ========================================================================== */

export interface IconComponentProps extends IconProps {
  name: string;
}

/**
 * Universal Icon Component for eg-web-core.
 * Renders any vector icon by name, accepting FontAwesome names (e.g. 'fas fa-robot', 'fa-bolt'),
 * standard names (e.g. 'robot', 'bolt', 'search'), or social names ('facebook', 'github', 'x').
 *
 * @example
 * ```tsx
 * <Icon name="bullhorn" size={20} color="#f59e0b" />
 * <Icon name="fas fa-robot" size={24} />
 * <Icon name="shield-check" size={18} color="#10b981" />
 * ```
 */
export const Icon: React.FC<IconComponentProps> = ({ name, ...props }) => {
  const clean = (name || '')
    .toLowerCase()
    .trim()
    .replace(/^fa[srbld]?\s+fa-/, '')
    .replace(/^fa-/, '')
    .replace(/\s+/g, '-');

  switch (clean) {
    // Navigation & Actions
    case 'arrow-left':
    case 'long-arrow-left':
    case 'arrowleft':
      return <ArrowLeftIcon {...props} />;
    case 'arrow-right':
    case 'long-arrow-right':
    case 'arrowright':
      return <ArrowRightIcon {...props} />;
    case 'arrow-up':
    case 'arrowup':
      return <ArrowUpIcon {...props} />;
    case 'arrow-down':
    case 'arrowdown':
      return <ArrowDownIcon {...props} />;
    case 'chevron-left':
    case 'angle-left':
      return <ChevronLeftIcon {...props} />;
    case 'chevron-right':
    case 'angle-right':
      return <ChevronRightIcon {...props} />;
    case 'chevron-up':
    case 'angle-up':
      return <ChevronUpIcon {...props} />;
    case 'chevron-down':
    case 'angle-down':
      return <ChevronDownIcon {...props} />;
    case 'check':
      return <CheckIcon {...props} />;
    case 'close':
    case 'times':
      return <CloseIcon {...props} />;
    case 'search':
      return <SearchIcon {...props} />;
    case 'menu':
    case 'bars':
      return <MenuIcon {...props} />;
    case 'refresh':
    case 'sync':
    case 'sync-alt':
    case 'redo-alt':
      return <RefreshIcon {...props} />;
    case 'undo':
      return <UndoIcon {...props} />;
    case 'redo':
      return <RedoIcon {...props} />;
    case 'download':
      return <DownloadIcon {...props} />;
    case 'upload':
      return <UploadIcon {...props} />;
    case 'copy':
      return <CopyIcon {...props} />;
    case 'external-link':
    case 'external-link-alt':
      return <ExternalLinkIcon {...props} />;
    case 'filter':
      return <FilterIcon {...props} />;
    case 'sliders':
    case 'sliders-h':
      return <SlidersIcon {...props} />;

    // Media & Interactive
    case 'play':
      return <PlayIcon {...props} />;
    case 'pause':
      return <PauseIcon {...props} />;
    case 'stop':
      return <StopIcon {...props} />;
    case 'step-backward':
      return <StepBackwardIcon {...props} />;
    case 'step-forward':
      return <StepForwardIcon {...props} />;
    case 'fast-backward':
      return <FastBackwardIcon {...props} />;
    case 'fast-forward':
      return <FastForwardIcon {...props} />;
    case 'spinner':
      return <SpinnerIcon {...props} />;
    case 'expand':
      return <ExpandIcon {...props} />;
    case 'compress':
      return <CompressIcon {...props} />;

    // UI, System & Status
    case 'home':
      return <HomeIcon {...props} />;
    case 'bell':
      return <BellIcon {...props} />;
    case 'lock':
      return <LockIcon {...props} />;
    case 'unlock':
    case 'unlock-alt':
      return <UnlockIcon {...props} />;
    case 'sun':
      return <SunIcon {...props} />;
    case 'moon':
      return <MoonIcon {...props} />;
    case 'trash':
      return <TrashIcon {...props} />;
    case 'edit':
      return <EditIcon {...props} />;
    case 'bookmark':
      return <BookmarkIcon {...props} />;
    case 'star':
      return <StarIcon {...props} />;
    case 'heart':
      return <HeartIcon {...props} />;
    case 'clock':
      return <ClockIcon {...props} />;
    case 'calendar':
    case 'calendar-alt':
    case 'calendar-day':
    case 'calendar-check':
      return <CalendarIcon {...props} />;
    case 'info':
    case 'info-circle':
      return <InfoIcon {...props} />;
    case 'warning':
    case 'exclamation-triangle':
      return <WarningIcon {...props} />;
    case 'check-circle':
      return <CheckCircleIcon {...props} />;
    case 'times-circle':
      return <TimesCircleIcon {...props} />;
    case 'question':
    case 'question-circle':
      return <QuestionCircleIcon {...props} />;
    case 'cog':
    case 'cogs':
    case 'settings':
      return <CogIcon {...props} />;

    // Tech, Engineering, Antivirus
    case 'shield':
    case 'shield-alt':
    case 'user-shield':
      return <ShieldIcon {...props} />;
    case 'shield-check':
      return <ShieldCheckIcon {...props} />;
    case 'bug':
    case 'virus':
      return <BugIcon {...props} />;
    case 'desktop':
    case 'tv':
      return <DesktopIcon {...props} />;
    case 'code':
    case 'laptop-code':
    case 'terminal':
      return <CodeIcon {...props} />;
    case 'database':
      return <DatabaseIcon {...props} />;
    case 'server':
      return <ServerIcon {...props} />;
    case 'cloud':
      return <CloudIcon {...props} />;
    case 'cpu':
    case 'microchip':
      return <CpuIcon {...props} />;
    case 'robot':
      return <RobotIcon {...props} />;
    case 'rocket':
      return <RocketIcon {...props} />;
    case 'microscope':
    case 'vial':
      return <MicroscopeIcon {...props} />;
    case 'wrench':
    case 'tools':
      return <WrenchIcon {...props} />;
    case 'bolt':
    case 'zap':
    case 'lightning':
      return <BoltIcon {...props} />;
    case 'sparkles':
    case 'magic':
      return <SparklesIcon {...props} />;
    case 'bullhorn':
      return <BullhornIcon {...props} />;
    case 'trophy':
      return <TrophyIcon {...props} />;
    case 'medal':
      return <MedalIcon {...props} />;
    case 'target':
    case 'bullseye':
      return <TargetIcon {...props} />;
    case 'puzzle':
    case 'puzzle-piece':
      return <PuzzleIcon {...props} />;
    case 'quote':
    case 'quote-left':
    case 'quote-right':
      return <QuoteIcon {...props} />;
    case 'book':
    case 'book-open':
      return <BookIcon {...props} />;
    case 'newspaper':
    case 'blog':
      return <NewspaperIcon {...props} />;
    case 'user':
      return <UserIcon {...props} />;
    case 'users':
    case 'user-friends':
      return <UsersIcon {...props} />;
    case 'landmark':
      return <LandmarkIcon {...props} />;
    case 'compass':
      return <CompassIcon {...props} />;
    case 'handshake':
    case 'hands-helping':
      return <HandshakeIcon {...props} />;
    case 'flag':
    case 'flag-checkered':
      return <FlagIcon {...props} />;
    case 'graduation-cap':
    case 'academic-cap':
    case 'learn':
    case 'chalkboard-teacher':
      return <GraduationCapIcon {...props} />;
    case 'gamepad':
    case 'controller':
      return <GamepadIcon {...props} />;
    case 'brain':
    case 'train':
      return <BrainIcon {...props} />;
    case 'scroll':
    case 'parchment':
      return <ScrollIcon {...props} />;
    case 'globe':
    case 'globe-asia':
    case 'world':
    case 'online':
      return <GlobeIcon {...props} />;
    case 'eye':
    case 'watch':
    case 'view':
      return <EyeIcon {...props} />;
    case 'eye-slash':
      return <EyeSlashIcon {...props} />;
    case 'crown':
      return <CrownIcon {...props} />;
    case 'fire':
    case 'flame':
    case 'hot':
      return <FireIcon {...props} />;
    case 'chart-line':
    case 'graph':
    case 'analytics':
      return <ChartLineIcon {...props} />;
    case 'clipboard':
    case 'clipboard-check':
      return <ClipboardIcon {...props} />;
    case 'map-marker':
    case 'map-marker-alt':
    case 'pin':
      return <MapPinIcon {...props} />;
    case 'envelope':
    case 'mail':
    case 'email':
      return <EnvelopeIcon {...props} />;
    case 'list':
    case 'list-alt':
    case 'list-ol':
    case 'list-ul':
      return <ListIcon {...props} />;
    case 'history':
      return <HistoryIcon {...props} />;
    case 'signal':
    case 'wifi':
      return <SignalIcon {...props} />;
    case 'network-wired':
      return <NetworkWiredIcon {...props} />;
    case 'balance-scale':
    case 'scale':
    case 'justice':
      return <BalanceScaleIcon {...props} />;
    case 'skull':
    case 'skull-crossbones':
      return <SkullIcon {...props} />;
    case 'stopwatch':
      return <StopwatchIcon {...props} />;
    case 'lightbulb':
      return <LightbulbIcon {...props} />;
    case 'keyboard':
      return <KeyboardIcon {...props} />;
    case 'layer-group':
    case 'layers':
      return <LayerGroupIcon {...props} />;
    case 'palette':
      return <PaletteIcon {...props} />;
    case 'crosshairs':
      return <CrosshairsIcon {...props} />;
    case 'cut':
    case 'scissors':
      return <CutIcon {...props} />;
    case 'code-branch':
    case 'fork':
      return <CodeBranchIcon {...props} />;
    case 'share':
    case 'share-alt':
      return <ShareIcon {...props} />;
    case 'door-open':
    case 'sign-out-alt':
    case 'logout':
      return <DoorOpenIcon {...props} />;

    // Chess Pieces & Board
    case 'chess':
    case 'chess-board':
      return <ChessBoardIcon {...props} />;
    case 'chess-queen':
    case 'queen':
      return <ChessQueenIcon {...props} />;
    case 'chess-king':
    case 'king':
      return <ChessKingIcon {...props} />;
    case 'chess-knight':
    case 'knight':
      return <ChessKnightIcon {...props} />;
    case 'chess-pawn':
    case 'pawn':
      return <ChessPawnIcon {...props} />;
    case 'chess-rook':
    case 'rook':
      return <ChessRookIcon {...props} />;
    case 'chess-bishop':
    case 'bishop':
      return <ChessBishopIcon {...props} />;

    // Delegate to SocialIcon for social and platform logos
    default:
      return <SocialIcon name={clean} {...props} />;
  }
};
