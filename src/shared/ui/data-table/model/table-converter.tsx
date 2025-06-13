// shared/ui/data-table/model/table-converter.tsx

import type {
  AccessorColumnDef,
  CellContext,
  ColumnDef,
  DisplayColumnDef,
  HeaderContext,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import { ActionsCell, TextCell } from '../components/CellTemplates';

import type { FieldDefinition, TableDefinition } from './table-definition';

/**
 * Erstellt den Header für eine Column
 */
const createHeader = <TData,>(label: string, sortable?: boolean) => {
  if (sortable !== false) {
    return ({ column }: HeaderContext<TData, unknown>) => {
      const isSorted = column.getIsSorted();

      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-3 h-8 text-xs font-medium uppercase tracking-wider hover:bg-transparent"
        >
          {label}
          {isSorted === 'asc' && <ArrowUp className="ml-2 h-4 w-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-2 h-4 w-4" />}
          {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
        </Button>
      );
    };
  }

  return () => <span className="text-xs font-medium uppercase tracking-wider">{label}</span>;
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
): ColumnDef<TData> => {
  // Basis-Column-Eigenschaften
  let size: number | undefined;
  if (field.width !== undefined) {
    size = typeof field.width === 'number' ? field.width : undefined;
  } else {
    size = undefined;
  }

  const baseColumn = {
    id: field.id,
    enableSorting: field.sortable ?? true,
    enableGlobalFilter: field.searchable ?? true,
    enableColumnFilter: field.filterable ?? false,
    header: createHeader<TData>(label, field.sortable),
    size,
  };

  // Wenn wir einen Accessor haben, erstelle eine AccessorColumnDef
  if (field.accessor) {
    const accessorColumn: AccessorColumnDef<TData> = {
      ...baseColumn,
      ...(typeof field.accessor === 'function'
        ? { accessorFn: field.accessor }
        : { accessorKey: field.accessor as keyof TData }),
    };

    // Cell renderer
    if (!field.cell || field.cell === 'default') {
      accessorColumn.cell = ({ getValue }: CellContext<TData, unknown>) => (
        <TextCell value={getValue()} />
      );
    } else if (field.cell === 'actions') {
      accessorColumn.cell = ({ row }: CellContext<TData, unknown>) => (
        <ActionsCell
          row={row.original}
          onEdit={callbacks?.onEdit ? (rowData) => callbacks.onEdit?.(rowData as TData) : undefined}
          onDelete={
            callbacks?.onDelete ? (rowData) => callbacks.onDelete?.(rowData as TData) : undefined
          }
        />
      );
    } else {
      const CellComponent = field.cell;
      accessorColumn.cell = ({ getValue, row }: CellContext<TData, unknown>) => (
        <CellComponent value={getValue()} row={row.original} />
      );
    }

    return accessorColumn;
  }

  // Ohne Accessor erstelle eine DisplayColumnDef (z.B. für Actions)
  const displayColumn: DisplayColumnDef<TData> = {
    ...baseColumn,
  };

  // Cell renderer für Display Columns
  if (field.cell === 'actions') {
    displayColumn.cell = ({ row }: CellContext<TData, unknown>) => (
      <ActionsCell
        row={row.original}
        onEdit={callbacks?.onEdit ? (rowData) => callbacks.onEdit?.(rowData as TData) : undefined}
        onDelete={
          callbacks?.onDelete ? (rowData) => callbacks.onDelete?.(rowData as TData) : undefined
        }
      />
    );
  } else if (field.cell && field.cell !== 'default') {
    const CellComponent = field.cell;
    displayColumn.cell = ({ row }: CellContext<TData, unknown>) => (
      <CellComponent value={undefined} row={row.original} />
    );
  } else {
    displayColumn.cell = () => <TextCell value="" />;
  }

  return displayColumn;
};

/**
 * Konvertiert eine Table Definition zu TanStack Columns
 */
export const convertTableDefinition = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: Array<string>,
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  },
): Array<ColumnDef<TData>> => {
  // Wenn keine selectableColumns angegeben, verwende alle Felder
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
  selectableColumns?: Array<string>,
): Record<string, boolean> => {
  const visibility: Record<string, boolean> = {};

  definition.fields.forEach((field) => {
    if (selectableColumns) {
      visibility[field.id] = selectableColumns.includes(field.id);
    } else {
      // Wenn keine selectableColumns, zeige alle als sichtbar
      visibility[field.id] = true;
    }
  });

  return visibility;
};

/**
 * Extrahiert searchable columns
 */
export const getSearchableColumns = <TData,>(definition: TableDefinition<TData>): Array<string> =>
  definition.fields.filter((field) => field.searchable === true).map((field) => field.id);
