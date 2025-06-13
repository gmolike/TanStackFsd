import { useDataTable } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';
import type { TableDefinition } from '../model/types/table-definition';

import { DataTableProvider } from './DataTableProvider';
import { ExpandButton } from './features/ExpandButton';
import { Pagination } from './features/Pagination';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';
import { LoadingState } from './states/LoadingState';
import { TableContainer } from './table/TableContainer';
import { TableToolbar } from './toolbar/TableToolbar';

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
    return (
      <div className={props.className}>
        <ErrorState error={controller.error} onRetry={props.onRetry} />
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
      <div className={props.className}>
        {/* Toolbar - wenn Features aktiviert sind */}
        {controller.features.hasToolbar && <TableToolbar />}

        {/* Table Container mit dem eigentlichen Table */}
        <TableContainer />

        {/* Pagination - wenn aktiviert und nicht im kollabierten Zustand */}
        {controller.features.hasPagination && controller.isTableExpanded && <Pagination />}

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
