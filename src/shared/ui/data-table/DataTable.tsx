// shared/ui/data-table/DataTable.tsx
import { useMemo, useState } from 'react';

import type { ColumnFiltersState, SortingState, VisibilityState } from '@tanstack/react-table';
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
import {
  convertTableDefinition,
  getColumnVisibility,
  getSearchableColumns,
} from './model/table-converter';
import type { DataTableProps } from './model/table-definition';

/**
 * CSDoc: DataTable Component
 * @description Hauptkomponente für Tabellen - arbeitet ausschließlich mit TableDefinition
 * @param tableDefinition - Definition mit Labels und Fields
 * @param selectableColumns - Array der anzuzeigenden Spalten IDs
 * @param data - Daten-Array
 * @example
 * ```tsx
 * <DataTable
 *   tableDefinition={teamTableDefinition}
 *   selectableColumns={['name', 'email', 'status']}
 *   data={teamMembers}
 *   onRowClick={(member) => navigate(`/team/${member.id}`)}
 * />
 * ```
 */
export const DataTable = <TData extends Record<string, unknown> = Record<string, unknown>>({
  // Core Props
  tableDefinition,
  selectableColumns,
  data,

  // State Props
  isLoading = false,
  error,

  // Callbacks
  onRowClick,
  onEdit,
  onDelete,
  onAdd,
  onRetry,

  // UI Options
  searchPlaceholder = 'Suchen...',
  addButtonText,
  showColumnToggle = true,
  showColumnToggleText = false,

  // Features
  expandable = false,
  initialRowCount = 5,
  expandButtonText,
  stickyHeader = false,
  maxHeight,
  pageSize = 20,
  selectedRowId,

  // Styling
  className,
  containerClassName,

  // Custom Components
  emptyStateComponent: EmptyStateComponent,
  errorStateComponent: ErrorStateComponent,
}: DataTableProps<TData>) => {
  // State
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(!expandable);

  // Convert TableDefinition to Columns
  const columns = useMemo(
    () => convertTableDefinition(tableDefinition, selectableColumns, { onEdit, onDelete }),
    [tableDefinition, selectableColumns, onEdit, onDelete],
  );

  // Column Visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() =>
    getColumnVisibility(tableDefinition, selectableColumns),
  );

  // Searchable Columns
  const searchableColumns = useMemo(() => getSearchableColumns(tableDefinition), [tableDefinition]);

  // Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Computed values
  const filteredRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;
  const displayRows =
    expandable && !isExpanded ? filteredRows.slice(0, initialRowCount) : paginatedRows;

  const showExpandButton = expandable && filteredRows.length > initialRowCount;

  // Loading State
  if (isLoading && data.length === 0) {
    return (
      <div className={cn('space-y-4', className)}>
        <TableSkeleton
          columns={columns}
          rows={10}
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
  if (data.length === 0) {
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
        columnLabels={tableDefinition.labels}
        showColumnToggle={showColumnToggle}
        showColumnToggleText={showColumnToggleText}
        onAddClick={onAdd}
        addButtonText={addButtonText}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        searchableColumns={searchableColumns}
      />

      {/* Table */}
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
                const rowOriginal = row.original as TData & { id?: string };
                const rowId = rowOriginal.id;
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

      {/* Footer */}
      {(isExpanded || !expandable) && displayRows.length > 0 && <TablePagination table={table} />}

      {showExpandButton && (
        <ExpandButton
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
          collapsedCount={initialRowCount}
          totalCount={filteredRows.length}
          customText={expandButtonText}
        />
      )}
    </div>
  );
};
