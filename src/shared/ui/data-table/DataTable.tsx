/* eslint-disable @typescript-eslint/no-explicit-any */
// src/shared/ui/data-table/DataTable.tsx
import { useMemo } from 'react';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { cn } from '~/shared/lib/utils';
import {
  Card,
  CardContent,
  ShadCnTable,
  ShadCnTableBody,
  ShadCnTableCell,
  ShadCnTableHead,
  ShadCnTableHeader,
  ShadCnTableRow,
} from '~/shared/shadcn';

import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { ExpandButton } from './components/ExpandButton';
import { TablePagination } from './components/TablePagination';
import { TableSkeleton } from './components/TableSkeleton';
import { TableToolbar } from './components/TableToolbar';
import { useTableState } from './hooks/useTableState';
import type { DataTableProps } from './types';

/**
 * DataTable Component
 *
 * Eine vereinheitlichte DataTable-Komponente die verschiedene Features kombiniert:
 * - Loading States mit Skeleton
 * - Expandable/Collapsible Rows
 * - Client-side Pagination, Sortierung und Filterung
 * - Spaltenauswahl und globale Suche
 * - Error und Empty States
 */
export const DataTable = <TData extends { id?: string }, TValue = unknown>({
  // Basis Props
  columns,
  data,
  searchPlaceholder = 'Suche...',
  onRowClick,
  className,
  containerClassName,

  // Standard-Konfigurationen
  defaultSorting = [],
  defaultColumnVisibility = {},
  pageSize = 10,

  // UI Features
  showColumnToggle = true,
  showColumnToggleText = false,
  onAddClick,
  addButtonText,
  columnLabels,
  selectedRowId,

  // Loading & Error States
  withSkeleton = false,
  isLoading: isLoadingProp = false,
  skeletonRows = 10,
  error,
  onRetry,
  emptyStateComponent: EmptyStateComponent,
  errorStateComponent: ErrorStateComponent,

  // Expandable Features
  expandable = false,
  initialRowCount = 5,
  expandButtonText,

  // Advanced Features
  enableRowSelection = false,
  enableGlobalFilter = true,
  stickyHeader = false,
  maxHeight,
}: DataTableProps<TData, TValue>) => {
  // State Management
  const {
    state,
    actions: {
      setSorting,
      setColumnFilters,
      setColumnVisibility,
      setRowSelection,
      setGlobalFilter,
      toggleExpanded,
    },
  } = useTableState({
    defaultSorting,
    defaultColumnVisibility,
    expandable,
  });

  // Table Instance mit korrekten Typen
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      globalFilter: enableGlobalFilter ? state.globalFilter : undefined,
    },
    onSortingChange: setSorting as any,
    onColumnFiltersChange: setColumnFilters as any,
    onColumnVisibilityChange: setColumnVisibility as any,
    onRowSelectionChange: enableRowSelection ? (setRowSelection as any) : undefined,
    onGlobalFilterChange: enableGlobalFilter ? (setGlobalFilter as any) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    enableRowSelection,
    initialState: {
      pagination: {
        pageSize: expandable && !state.isExpanded ? initialRowCount : pageSize,
      },
    },
  });

  // Berechnete Werte
  const isTableExpanded = expandable ? state.isExpanded : true;
  const shouldShowSkeleton = withSkeleton && isLoadingProp;
  const hasData = data.length > 0;
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const showExpandButton = expandable && filteredRowsCount > initialRowCount;

  // Ersetze displayRows komplett mit:
  const allRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;

  // Wähle die richtigen Rows basierend auf dem State
  const displayRows = useMemo(() => {
    // Wenn Pagination aktiv ist, nutze paginatedRows
    if (!expandable || isTableExpanded) {
      return paginatedRows;
    }
    // Sonst nutze gefilterte Rows mit Limit
    return allRows.slice(0, initialRowCount);
  }, [expandable, isTableExpanded, paginatedRows, allRows, initialRowCount]);

  // Handle Expand Toggle mit Pagination-Anpassung
  const handleExpandToggle = () => {
    if (state.isExpanded) {
      // Beim Kollabieren
      table.setPageSize(initialRowCount);
      table.setPageIndex(0);
    } else {
      // Beim Expandieren
      table.setPageSize(pageSize);
    }
    toggleExpanded();
  };

  // Helper für Row-ID
  const getRowId = (row: TData): string => {
    if (row.id) return row.id;
    // Fallback für Rows ohne ID
    return JSON.stringify(row);
  };

  // Loading State
  if (shouldShowSkeleton) {
    return (
      <div className={cn('space-y-4', className)}>
        <TableSkeleton
          columns={columns}
          rows={skeletonRows}
          showToolbar={true}
          showPagination={!expandable}
        />
      </div>
    );
  }

  // Error State
  if (error) {
    const ErrorComponent = ErrorStateComponent || ErrorState;
    return (
      <div className={cn('space-y-4', className)}>
        <Card>
          <CardContent className="py-8">
            <ErrorComponent error={error} onRetry={onRetry} />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty State (keine Daten)
  if (!hasData && !isLoadingProp) {
    const EmptyComponent = EmptyStateComponent || EmptyState;
    return (
      <div className={cn('space-y-4', className)}>
        <Card>
          <CardContent className="py-12">
            <EmptyComponent />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <TableToolbar
        table={table}
        searchPlaceholder={searchPlaceholder}
        columnLabels={columnLabels}
        showColumnToggle={showColumnToggle}
        showColumnToggleText={showColumnToggleText}
        onAddClick={onAddClick}
        addButtonText={addButtonText}
        globalFilter={state.globalFilter}
        onGlobalFilterChange={enableGlobalFilter ? setGlobalFilter : undefined}
      />

      {/* Table Container */}
      <div
        className={cn(
          'overflow-auto rounded-md border',
          stickyHeader && 'relative',
          containerClassName,
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        <ShadCnTable>
          <ShadCnTableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-background' : ''}>
            {table.getHeaderGroups().map((headerGroup) => (
              <ShadCnTableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <ShadCnTableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </ShadCnTableHead>
                ))}
              </ShadCnTableRow>
            ))}
          </ShadCnTableHeader>

          <ShadCnTableBody>
            {displayRows.length ? (
              displayRows.map((row) => {
                const rowId = getRowId(row.original);
                const isSelected = selectedRowId === rowId;

                return (
                  <ShadCnTableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => onRowClick?.(row.original)}
                    className={cn(
                      onRowClick ? 'cursor-pointer hover:bg-muted/50' : '',
                      isSelected && 'bg-muted/50',
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <ShadCnTableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </ShadCnTableCell>
                    ))}
                  </ShadCnTableRow>
                );
              })
            ) : (
              <ShadCnTableRow>
                <ShadCnTableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Keine Ergebnisse gefunden.
                </ShadCnTableCell>
              </ShadCnTableRow>
            )}
          </ShadCnTableBody>
        </ShadCnTable>
      </div>

      {/* Pagination oder Expand Button */}
      {isTableExpanded && !expandable && displayRows.length > 0 && (
        <TablePagination table={table} />
      )}

      {showExpandButton && (
        <ExpandButton
          isExpanded={state.isExpanded}
          onToggle={handleExpandToggle}
          collapsedCount={initialRowCount}
          totalCount={filteredRowsCount}
          customText={expandButtonText}
        />
      )}
    </div>
  );
};
