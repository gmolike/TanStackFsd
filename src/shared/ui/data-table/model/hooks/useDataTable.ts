// model/hooks/useDataTable.ts
import { useMemo } from 'react';

import type { Row, Table } from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { convertTableDefinition, getColumnVisibility } from '../converters/table-converter';
import type { DataTableProps } from '../types/props';
import type { ExtractFieldIds, TableDefinition } from '../types/table-definition';
import { computeDisplayRows } from '../utils/display-utils';

import { useTableFeatures } from './useTableFeatures';
import { useTableSearch } from './useTableSearch';
import { useTableSelection } from './useTableSelection';
import { useTableState } from './useTableState';

export type DataTableController<TData> = {
  // Table Instance
  table: Table<TData>;

  // State
  state: ReturnType<typeof useTableState>;
  search: ReturnType<typeof useTableSearch>;
  selection: ReturnType<typeof useTableSelection>;
  features: ReturnType<typeof useTableFeatures>;

  // Loading/Error States
  isLoading: boolean;
  hasError: boolean;
  isEmpty: boolean;
  error: Error | null;

  // Computed Values
  displayRows: Array<Row<TData>>;
  filteredRowsCount: number;
  isTableExpanded: boolean;
  showExpandButton: boolean;

  // Actions
  handleExpandToggle: () => void;
  handleGlobalFilterChange: (value: string) => void;

  // Pass through props
  callbacks: {
    onRowClick?: (row: TData) => void;
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onAdd?: () => void;
  };

  ui: {
    searchPlaceholder: string;
    addButtonText?: string;
    showColumnToggle: boolean;
    showColumnToggleText: boolean;
  };
};

export const useDataTable = <
  TData extends Record<string, unknown> = Record<string, unknown>,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
>(
  props: DataTableProps<TData, TTableDef>,
): DataTableController<TData> => {
  // Verwende alle Spalten als Standard, wenn selectableColumns nicht angegeben
  const effectiveSelectableColumns = useMemo(
    () =>
      props.selectableColumns ||
      (props.tableDefinition.fields.map((field) => field.id) as Array<ExtractFieldIds<TTableDef>>),
    [props.selectableColumns, props.tableDefinition.fields],
  );

  // Convert TableDefinition to Columns
  const columns = useMemo(
    () =>
      convertTableDefinition(props.tableDefinition, effectiveSelectableColumns as Array<string>, {
        onEdit: props.onEdit,
        onDelete: props.onDelete,
      }),
    [props.tableDefinition, effectiveSelectableColumns, props.onEdit, props.onDelete],
  );

  // State Management
  const state = useTableState(props);
  const search = useTableSearch(props);
  const selection = useTableSelection(props);
  const features = useTableFeatures(props);

  // Column Visibility
  const columnVisibility = useMemo(
    () => getColumnVisibility(props.tableDefinition, effectiveSelectableColumns as Array<string>),
    [props.tableDefinition, effectiveSelectableColumns],
  );

  // Table Instance
  const table = useReactTable<TData>({
    data: props.data,
    columns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      globalFilter: search.state.globalFilter,
      rowSelection: selection.state.rowSelection,
    },
    onSortingChange: state.setSorting,
    onColumnFiltersChange: state.setColumnFilters,
    onColumnVisibilityChange: state.setColumnVisibility,
    onGlobalFilterChange: search.setGlobalFilter,
    onRowSelectionChange: selection.setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize: props.pageSize ?? 10,
      },
      columnVisibility,
    },
  });

  // Computed Values
  const isLoading = props.isLoading === true && props.data.length === 0;
  const hasError = !!props.error;
  const isEmpty = !isLoading && !hasError && props.data.length === 0;
  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const isTableExpanded = props.expandable ? state.isExpanded : true;
  const showExpandButton =
    props.expandable === true && filteredRowsCount > (props.initialRowCount ?? 5);

  // Display Rows - Include filter/sort state in dependencies
  const displayRows = useMemo(
    () => computeDisplayRows(table, { isExpanded: state.isExpanded }, props),
    [table, state.isExpanded, props],
  );

  // Actions
  const handleExpandToggle = () => {
    state.setIsExpanded(!state.isExpanded);
  };

  const handleGlobalFilterChange = (value: string) => {
    search.setGlobalFilter(value);
  };

  return {
    // Table Instance
    table,

    // State
    state,
    search,
    selection,
    features,

    // Loading/Error States
    isLoading,
    hasError,
    isEmpty,
    error: props.error || null,

    // Computed Values
    displayRows,
    filteredRowsCount,
    isTableExpanded,
    showExpandButton,

    // Actions
    handleExpandToggle,
    handleGlobalFilterChange,

    // Pass through props
    callbacks: {
      onRowClick: props.onRowClick,
      onEdit: props.onEdit,
      onDelete: props.onDelete,
      onAdd: props.onAdd,
    },

    ui: {
      searchPlaceholder: props.searchPlaceholder ?? 'Suchen...',
      addButtonText: props.addButtonText,
      showColumnToggle: props.showColumnToggle !== false,
      showColumnToggleText: props.showColumnToggleText === true,
    },
  };
};
