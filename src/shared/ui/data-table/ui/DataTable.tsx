import { cn } from '~/shared/lib/utils';

import { DataTableProvider } from '../lib/context';
import { useDataTable } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';
import type { TableDefinition } from '../model/types/table-definition';

import { ExpandButton } from './features/ExpandButton';
import { Pagination } from './features/Pagination';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';
import { LoadingState } from './states/LoadingState';
import { TableContainer } from './table/TableContainer';
import { TableToolbar } from './toolbar/TableToolbar';

/**
 * CSDoc: DataTable Component
 * @description Eine flexible Tabellen-Komponente mit Sortierung, Filterung und Pagination
 * @param tableDefinition - Die Table Definition mit Labels und Fields
 * @param selectableColumns - Welche Spalten sollen angezeigt werden
 * @param data - Array der anzuzeigenden Daten
 * @param onRowClick - Optional: Callback beim Klick auf eine Zeile
 * @example
 * ```tsx
 * <DataTable
 *   tableDefinition={teamTableDefinition}
 *   selectableColumns={['name', 'email', 'department']}
 *   data={teamMembers}
 *   onRowClick={(member) => navigate(`/team/${member.id}`)}
 * />
 * ```
 */
export const DataTable = <
  TData extends Record<string, unknown>,
  TTableDef extends TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
) => {
  const controller = useDataTable(props);

  // Loading State - wenn noch keine Daten geladen wurden
  if (controller.isLoading) {
    return (
      <div className={props.className}>
        <LoadingState />
      </div>
    );
  }

  // Error State
  if (controller.hasError) {
    const ErrorComponent = props.errorStateComponent || ErrorState;
    return (
      <div className={props.className}>
        <ErrorComponent error={controller.error!} onRetry={props.onRetry} />
      </div>
    );
  }

  // Empty State - wenn keine Daten vorhanden sind
  if (controller.isEmpty) {
    const EmptyComponent = props.emptyStateComponent || EmptyState;
    return (
      <div className={props.className}>
        <EmptyComponent />
      </div>
    );
  }

  // Normal Render mit allen Features
  return (
    <DataTableProvider value={controller} props={props}>
      <div className={cn('space-y-4', props.className)}>
        {/* Toolbar - wenn Features aktiviert sind */}
        {controller.features.hasToolbar && <TableToolbar />}

        {/* Table Container mit dem eigentlichen Table */}
        <TableContainer />

        {/* Pagination - nur wenn nicht expandable oder wenn expandable und expandiert */}
        {!props.expandable && controller.features.hasPagination && (
          <div className="py-2">
            <Pagination />
          </div>
        )}

        {/* Expand Button - wenn expandable Feature aktiviert ist */}
        {controller.features.hasExpand && controller.showExpandButton && (
          <ExpandButton
            isExpanded={controller.isTableExpanded}
            onToggle={controller.handleExpandToggle}
            collapsedCount={props.initialRowCount ?? 5}
            totalCount={controller.filteredRowsCount}
            customText={props.expandButtonText}
          />
        )}
      </div>
    </DataTableProvider>
  );
};
