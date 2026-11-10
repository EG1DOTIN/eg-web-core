import { default as React } from 'react';
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
 * Highly performant, generic administrative DataGrid with search, pagination, sorting, and CSV export.
 *
 * @param props - DataGridProps configuration
 * @returns Fully styled administrative data table component
 *
 * @example
 * ```tsx
 * <DataGrid
 *   data={users}
 *   columns={[
 *     { key: 'name', label: 'User Name', sortable: true },
 *     { key: 'email', label: 'Email Address' },
 *   ]}
 *   exportFileName="users.csv"
 * />
 * ```
 */
export declare function DataGrid<T>({ data, columns, keyExtractor, defaultPageSize, pageSizeOptions, searchable, searchPlaceholder, searchKeys, exportable, exportFileName, loading, emptyMessage, toolbarSlot, onRowClick, initialSortKey, initialSortDirection, style, className, }: DataGridProps<T>): React.ReactElement;
