// src/shared/ui/expandable-data-table/types.ts
import type { ColumnDef, VisibilityState } from '@tanstack/react-table';

export type ExpandableDataTableProps<TData, TValue> = {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  initialRowCount?: number;
  onRowClick?: (row: TData) => void;
  className?: string;
  containerClassName?: string;
  searchPlaceholder?: string;
  columnLabels?: Record<string, string>;
  showColumnToggle?: boolean;
  onAddClick?: () => void;
  addButtonText?: string;
  defaultColumnVisibility?: VisibilityState;
};

export type ExpandButtonProps = {
  isExpanded: boolean;
  onToggle: () => void;
  collapsedCount: number;
  totalCount: number;
};
