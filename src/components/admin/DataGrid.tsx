/**
 * @file DataGrid.tsx
 * @description Highly performant, fully generic administrative DataGrid component.
 * Features:
 *   - Multi-type column sorting (string, number, date, IPv4 octets).
 *   - Instant real-time text searching & multi-column filtering.
 *   - Configurable pagination with page size selector.
 *   - One-click safe CSV export with quote & comma escaping.
 *   - Loading skeletons and customizable empty states.
 */

import React, { useState, useMemo, useCallback } from 'react';

export type SortType = 'string' | 'number' | 'date' | 'ip';
export type SortDirection = 'asc' | 'desc' | null;

export interface DataGridColumn<T> {
  /** Property key or identifier */
  key: string;
  /** Header label displayed in table */
  label: string;
  /** Whether the column can be clicked to sort (default: true) */
  sortable?: boolean;
  /** Data sorting comparison type (default: 'string') */
  sortType?: SortType;
  /** Custom cell rendering function */
  render?: (row: T, index: number) => React.ReactNode;
  /** Text alignment in header and cell */
  align?: 'left' | 'center' | 'right';
  /** Explicit column width (e.g. '120px', '25%') */
  width?: string;
  /** Custom extractor for sorting and searching when key is nested */
  getValue?: (row: T) => any;
}

export interface DataGridProps<T> {
  /** Array of data records to display */
  data: T[];
  /** Column schema definitions */
  columns: DataGridColumn<T>[];
  /** Unique key extractor for each row item */
  keyExtractor?: (row: T, index: number) => string | number;
  /** Default page size (default: 15) */
  defaultPageSize?: number;
  /** Available page size choices (default: [10, 15, 25, 50, 100]) */
  pageSizeOptions?: number[];
  /** Whether to show the search bar (default: true) */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Specific column keys to search. If omitted, searches all string/number columns. */
  searchKeys?: string[];
  /** Whether to show the CSV Export button (default: true) */
  exportable?: boolean;
  /** CSV download filename (default: 'export.csv') */
  exportFileName?: string;
  /** Shows loading indicator */
  loading?: boolean;
  /** Message to display when no records match or array is empty */
  emptyMessage?: string;
  /** Slot for extra controls beside the search bar */
  toolbarSlot?: React.ReactNode;
  /** Row click callback */
  onRowClick?: (row: T, index: number) => void;
  /** Initial sort key */
  initialSortKey?: string;
  /** Initial sort direction (default: 'asc') */
  initialSortDirection?: SortDirection;
  /** Custom wrapper style */
  style?: React.CSSProperties;
  /** Custom class name */
  className?: string;
}

/**
 * Compares two values based on a designated SortType.
 */
function compareValues(a: any, b: any, type: SortType = 'string'): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;

  switch (type) {
    case 'number': {
      const numA = Number(a) || 0;
      const numB = Number(b) || 0;
      return numA - numB;
    }
    case 'date': {
      const timeA = new Date(a).getTime() || 0;
      const timeB = new Date(b).getTime() || 0;
      return timeA - timeB;
    }
    case 'ip': {
      const strA = String(a).trim();
      const strB = String(b).trim();
      const octetsA = strA.split('.').map((n) => parseInt(n, 10) || 0);
      const octetsB = strB.split('.').map((n) => parseInt(n, 10) || 0);
      for (let i = 0; i < 4; i++) {
        const diff = (octetsA[i] || 0) - (octetsB[i] || 0);
        if (diff !== 0) return diff;
      }
      return 0;
    }
    case 'string':
    default: {
      return String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
    }
  }
}

/**
 * Escapes a cell value for standard CSV compatibility.
 */
function formatCsvCell(val: any): string {
  if (val == null) return '""';
  let str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function DataGrid<T>({
  data,
  columns,
  keyExtractor,
  defaultPageSize = 15,
  pageSizeOptions = [10, 15, 25, 50, 100],
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys,
  exportable = true,
  exportFileName = 'export.csv',
  loading = false,
  emptyMessage = 'No matching records found.',
  toolbarSlot,
  onRowClick,
  initialSortKey,
  initialSortDirection = null,
  style,
  className = '',
}: DataGridProps<T>): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string | null>(initialSortKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // 1. Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase().trim();

    return data.filter((row: any) => {
      if (searchKeys && searchKeys.length > 0) {
        return searchKeys.some((k) => {
          const col = columns.find((c) => c.key === k);
          const val = col?.getValue ? col.getValue(row) : row[k];
          return val != null && String(val).toLowerCase().includes(term);
        });
      }

      // Default: inspect all columns
      return columns.some((col) => {
        const val = col.getValue ? col.getValue(row) : row[col.key];
        return val != null && String(val).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchKeys, columns]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredData;
    const activeColumn = columns.find((c) => c.key === sortKey);
    const sortType = activeColumn?.sortType || 'string';

    const sorted = [...filteredData].sort((rowA: any, rowB: any) => {
      const valA = activeColumn?.getValue ? activeColumn.getValue(rowA) : rowA[sortKey];
      const valB = activeColumn?.getValue ? activeColumn.getValue(rowB) : rowB[sortKey];
      const result = compareValues(valA, valB, sortType);
      return sortDirection === 'desc' ? -result : result;
    });

    return sorted;
  }, [filteredData, sortKey, sortDirection, columns]);

  // Reset page when search or sort changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Toggle sort order
  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
    } else {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      } else {
        setSortDirection('asc');
      }
    }
    setCurrentPage(1);
  };

  // 3. Pagination Slicing
  const totalEntries = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, safePage, pageSize]);

  const startIndexDisplay = totalEntries === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndexDisplay = Math.min(safePage * pageSize, totalEntries);

  // 4. CSV Export Handler
  const handleExportCsv = useCallback(() => {
    if (sortedData.length === 0) return;

    const headers = columns.map((col) => formatCsvCell(col.label)).join(',');
    const rows = sortedData.map((row: any) => {
      return columns
        .map((col) => {
          const val = col.getValue ? col.getValue(row) : row[col.key];
          return formatCsvCell(val);
        })
        .join(',');
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sortedData, columns, exportFileName]);

  return (
    <div
      className={`eg-datagrid-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        background: 'var(--eg-bg-secondary, #111827)',
        border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
        borderRadius: 'var(--eg-radius-lg, 14px)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        ...style,
      }}
    >
      {/* Top Toolbar: Search + Extra Slot + Export + Page Size */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--eg-space-3, 12px)',
          padding: 'var(--eg-space-4, 16px)',
          borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eg-space-3, 12px)', flex: '1 1 280px' }}>
          {searchable && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 36px',
                  background: 'var(--eg-bg-primary, #030712)',
                  border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                  borderRadius: 'var(--eg-radius-md, 8px)',
                  color: 'var(--eg-text-primary, #f9fafb)',
                  fontSize: 'var(--eg-text-sm, 0.875rem)',
                  outline: 'none',
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--eg-text-muted, #9ca3af)"
                strokeWidth="2"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          )}
          {toolbarSlot}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--eg-space-3, 12px)' }}>
          {/* Page size dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--eg-text-xs, 0.8125rem)', color: 'var(--eg-text-muted, #9ca3af)' }}>
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                background: 'var(--eg-bg-primary, #030712)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--eg-radius-sm, 6px)',
                color: 'var(--eg-text-primary, #f9fafb)',
                padding: '4px 8px',
                fontSize: 'var(--eg-text-xs, 0.8125rem)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Export CSV button */}
          {exportable && (
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={sortedData.length === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'var(--eg-bg-tertiary, #1f2937)',
                border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.12))',
                borderRadius: 'var(--eg-radius-md, 8px)',
                color: 'var(--eg-text-primary, #f9fafb)',
                fontSize: 'var(--eg-text-xs, 0.8125rem)',
                fontWeight: 500,
                cursor: sortedData.length === 0 ? 'not-allowed' : 'pointer',
                opacity: sortedData.length === 0 ? 0.5 : 1,
                transition: 'background var(--eg-transition-fast, 150ms)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* Table Body Area */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: 'var(--eg-text-sm, 0.875rem)',
          }}
        >
          <thead>
            <tr
              style={{
                background: 'var(--eg-bg-tertiary, #1a2234)',
                borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.08))',
              }}
            >
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const canSort = col.sortable !== false;

                return (
                  <th
                    key={col.key}
                    onClick={() => canSort && handleSort(col.key)}
                    style={{
                      padding: '12px 16px',
                      color: isSorted ? 'var(--eg-color-primary, #10b981)' : 'var(--eg-text-secondary, #d1d5db)',
                      fontWeight: 600,
                      fontSize: 'var(--eg-text-xs, 0.8125rem)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      cursor: canSort ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      width: col.width,
                      textAlign: col.align || 'left',
                      transition: 'color var(--eg-transition-fast, 150ms)',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                      }}
                    >
                      <span>{col.label}</span>
                      {canSort && (
                        <span style={{ fontSize: '0.75rem', opacity: isSorted ? 1 : 0.35 }}>
                          {isSorted && sortDirection === 'asc' ? '▲' : isSorted && sortDirection === 'desc' ? '▼' : '⇅'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '36px', textAlign: 'center' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      color: 'var(--eg-text-muted, #9ca3af)',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '3px solid rgba(16, 185, 129, 0.2)',
                        borderTopColor: 'var(--eg-color-primary, #10b981)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }}
                    />
                    <span>Loading data records...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: '36px',
                    textAlign: 'center',
                    color: 'var(--eg-text-muted, #9ca3af)',
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => {
                const rowKey = keyExtractor ? keyExtractor(row, rIdx) : rIdx;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row, rIdx)}
                    style={{
                      borderBottom: '1px solid var(--eg-border, rgba(255, 255, 255, 0.04))',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background var(--eg-transition-fast, 150ms)',
                      background: rIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
                    }}
                  >
                    {columns.map((col) => {
                      const cellValue = col.getValue ? col.getValue(row) : (row as any)[col.key];

                      return (
                        <td
                          key={col.key}
                          style={{
                            padding: '12px 16px',
                            color: 'var(--eg-text-primary, #f9fafb)',
                            textAlign: col.align || 'left',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                          }}
                        >
                          {col.render ? col.render(row, rIdx) : cellValue != null ? String(cellValue) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Pagination Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--eg-space-3, 12px)',
          padding: 'var(--eg-space-3, 12px) var(--eg-space-4, 16px)',
          borderTop: '1px solid var(--eg-border, rgba(255, 255, 255, 0.06))',
          background: 'var(--eg-bg-secondary, #111827)',
          fontSize: 'var(--eg-text-xs, 0.8125rem)',
          color: 'var(--eg-text-muted, #9ca3af)',
        }}
      >
        <div>
          Showing <strong>{startIndexDisplay}</strong> to <strong>{endIndexDisplay}</strong> of{' '}
          <strong>{totalEntries}</strong> entries
          {searchTerm && ` (filtered from ${data.length} total)`}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={safePage <= 1}
            style={{
              padding: '4px 8px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
              opacity: safePage <= 1 ? 0.4 : 1,
            }}
          >
            « First
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            style={{
              padding: '4px 8px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
              opacity: safePage <= 1 ? 0.4 : 1,
            }}
          >
            ‹ Prev
          </button>

          <span style={{ padding: '0 6px', fontWeight: 600, color: 'var(--eg-text-primary, #f9fafb)' }}>
            Page {safePage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            style={{
              padding: '4px 8px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: safePage >= totalPages ? 0.4 : 1,
            }}
          >
            Next ›
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage >= totalPages}
            style={{
              padding: '4px 8px',
              background: 'var(--eg-bg-tertiary, #1f2937)',
              border: '1px solid var(--eg-border, rgba(255, 255, 255, 0.1))',
              borderRadius: 'var(--eg-radius-sm, 6px)',
              color: 'var(--eg-text-primary, #f9fafb)',
              cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
              opacity: safePage >= totalPages ? 0.4 : 1,
            }}
          >
            Last »
          </button>
        </div>
      </div>
    </div>
  );
}
