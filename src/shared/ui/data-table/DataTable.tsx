// src/shared/ui/data-table/DataTable.tsx
import { flexRender } from '@tanstack/react-table';

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
import { useDataTableController } from './model/useDataTableController';
import type { DataTableProps } from './types';

/**
 * DataTable Component
 *
 * Eine vereinheitlichte DataTable-Komponente für verschiedene Use-Cases.
 * Die Business-Logik ist im useDataTableController gekapselt.
 */
export const DataTable = <TData extends { id?: string }, TValue = unknown>(
  props: DataTableProps<TData, TValue>,
) => {
  const {
    // Props for UI
    searchPlaceholder,
    onRowClick,
    className,
    containerClassName,
    showColumnToggle,
    showColumnToggleText,
    onAddClick,
    addButtonText,
    columnLabels,
    selectedRowId,
    error,
    onRetry,
    emptyStateComponent: EmptyStateComponent,
    errorStateComponent: ErrorStateComponent,
    expandable,
    expandButtonText,
    stickyHeader,
    maxHeight,
    enableGlobalFilter = true,
    isLoading,
    skeletonRows = 10,
    searchableColumns,
  } = props;

  // Controller Hook - enthält die gesamte Logik
  const controller = useDataTableController(props);
  const {
    table,
    state,
    displayRows,
    hasData,
    filteredRowsCount,
    showExpandButton,
    shouldShowSkeleton,
    handleExpandToggle,
    handleGlobalFilterChange,
    getRowId,
    columns,
  } = controller;

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

  // Empty State
  if (!hasData && !isLoading) {
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
        onGlobalFilterChange={enableGlobalFilter !== false ? handleGlobalFilterChange : undefined}
        searchableColumns={searchableColumns}
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
      {controller.isTableExpanded && !expandable && displayRows.length > 0 && (
        <TablePagination table={table} />
      )}

      {showExpandButton && (
        <ExpandButton
          isExpanded={state.isExpanded}
          onToggle={handleExpandToggle}
          collapsedCount={props.initialRowCount || 5}
          totalCount={filteredRowsCount}
          customText={expandButtonText}
        />
      )}
    </div>
  );
};
