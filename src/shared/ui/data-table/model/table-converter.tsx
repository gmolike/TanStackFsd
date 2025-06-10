// shared/ui/data-table/components/table-converter.tsx
import type { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import React from 'react';
import { Button } from '~/shared/shadcn';
import {
  ActionsCell,
  BooleanCell,
  DateCell,
  EmailCell,
  PhoneCell,
  TextCell,
} from './CellTemplates';
import type { FieldDefinition, TableDefinition } from './table-definition';

/**
 * Erstellt den Header für eine Column
 */
const createHeader = <TData,>(label: string, sortable?: boolean) => {
  if (sortable !== false) {
    return ({ column }: HeaderContext<TData, unknown>) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-3 h-8 text-xs font-medium uppercase tracking-wider hover:bg-transparent"
      >
        {label}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return () => <span className="text-xs font-medium uppercase tracking-wider">{label}</span>;
};

/**
 * Erstellt die Cell-Render-Funktion für Custom Components
 */
const createCustomCellRenderer = <TData,>(
  field: FieldDefinition<TData>,
  Component: React.ComponentType<any>,
) => {
  return ({ getValue, row }: CellContext<TData, unknown>) => {
    if (field.accessor) {
      const value = getValue();
      const props = field.cellProps ? field.cellProps(value as any, row.original) : { value };
      return <Component {...props} />;
    } else {
      const props = field.cellProps
        ? field.cellProps(undefined, row.original)
        : { row: row.original };
      return <Component {...props} />;
    }
  };
};

/**
 * Konvertiert eine Field Definition zu einer TanStack Column Definition
 */
const fieldToColumn = <TData,>(
  field: FieldDefinition<TData>,
  label: string,
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  },
): ColumnDef<TData, unknown> => {
  const column: ColumnDef<TData, unknown> = {
    id: field.id,
    enableSorting: field.sortable ?? true,
    enableGlobalFilter: field.searchable ?? true,
    enableColumnFilter: field.filterable ?? false,
  };

  // Accessor
  if (field.accessor) {
    if (typeof field.accessor === 'function') {
      column.accessorFn = field.accessor;
    } else {
      column.accessorKey = field.accessor as keyof TData;
    }
  }

  // Header
  column.header = createHeader<TData>(label, field.sortable);

  // Cell
  if (field.cellComponent) {
    column.cell = createCustomCellRenderer(field, field.cellComponent);
  } else if (field.cellTemplate) {
    // Direkte Zuordnung der Templates ohne dynamischen Zugriff
    switch (field.cellTemplate) {
      case 'actions':
        column.cell = ({ row }: CellContext<TData, unknown>) => (
          <ActionsCell
            row={row.original}
            onEdit={callbacks?.onEdit}
            onDelete={callbacks?.onDelete}
          />
        );
        break;
      case 'email':
        column.cell = ({ getValue }: CellContext<TData, unknown>) => (
          <EmailCell value={getValue()} />
        );
        break;
      case 'phone':
        column.cell = ({ getValue }: CellContext<TData, unknown>) => (
          <PhoneCell value={getValue()} />
        );
        break;
      case 'date':
        column.cell = ({ getValue }: CellContext<TData, unknown>) => (
          <DateCell value={getValue()} />
        );
        break;
      case 'boolean':
        column.cell = ({ getValue }: CellContext<TData, unknown>) => (
          <BooleanCell value={getValue()} />
        );
        break;
      case 'text':
      default:
        column.cell = ({ getValue }: CellContext<TData, unknown>) => (
          <TextCell value={getValue()} />
        );
        break;
    }
  } else {
    // Default: Text Template
    column.cell = ({ getValue }: CellContext<TData, unknown>) => <TextCell value={getValue()} />;
  }

  // Width
  if (field.width) {
    column.size = typeof field.width === 'number' ? field.width : undefined;
  }

  return column;
};

/**
 * Konvertiert eine Table Definition zu TanStack Columns
 */
export const convertTableDefinition = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: string[],
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  },
): ColumnDef<TData, unknown>[] => {
  // Filter fields basierend auf selectableColumns
  const fieldsToShow = selectableColumns
    ? definition.fields.filter((field) => selectableColumns.includes(field.id))
    : definition.fields;

  // Konvertiere zu Columns
  return fieldsToShow.map((field) =>
    fieldToColumn(field, definition.labels[field.id] || field.id, callbacks),
  );
};

/**
 * Extrahiert Column Visibility aus der Definition
 */
export const getColumnVisibility = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: string[],
): Record<string, boolean> => {
  const visibility: Record<string, boolean> = {};

  definition.fields.forEach((field) => {
    if (selectableColumns) {
      visibility[field.id] = selectableColumns.includes(field.id);
    } else {
      visibility[field.id] = field.defaultVisible ?? true;
    }
  });

  return visibility;
};

/**
 * Extrahiert searchable columns
 */
export const getSearchableColumns = <TData,>(definition: TableDefinition<TData>): string[] => {
  return definition.fields.filter((field) => field.searchable === true).map((field) => field.id);
};
