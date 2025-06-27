import type {
  AccessorColumnDef,
  CellContext,
  ColumnDef,
  DisplayColumnDef,
  HeaderContext,
  SortingFnOption,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '~/shared/shadcn';

import { ActionsCell, TextCell } from '../components/CellTemplates';

import type { ExtractedKey, FieldDefinition, TableDefinition } from './tableDefinition';

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
          {isSorted === 'asc' && <ArrowUp className="ml-2 size-4" />}
          {isSorted === 'desc' && <ArrowDown className="ml-2 size-4" />}
          {!isSorted && <ArrowUpDown className="ml-2 size-4 opacity-50" />}
        </Button>
      );
    };
  }

  return () => <span className="text-xs font-medium uppercase tracking-wider">{label}</span>;
};

/**
 * Rendert die Cell basierend auf field.cell
 */
const renderCell = <TData,>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldDefinition<TData, any>,
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  },
) => {
  // Actions Cell
  if (field.cell === 'actions') {
    return ({ row }: CellContext<TData, unknown>) => (
      <ActionsCell
        row={row.original}
        onEdit={callbacks?.onEdit ? (rowData) => callbacks.onEdit?.(rowData as TData) : undefined}
        onDelete={
          callbacks?.onDelete ? (rowData) => callbacks.onDelete?.(rowData as TData) : undefined
        }
      />
    );
  }

  // Default Text Cell
  if (!field.cell || field.cell === 'default') {
    return ({ getValue }: CellContext<TData, unknown>) => <TextCell value={getValue()} />;
  }

  // Custom Component Cell
  if (typeof field.cell !== 'string') {
    const CellComponent = field.cell;
    return ({ getValue, row }: CellContext<TData, unknown>) => (
      <CellComponent value={getValue()} row={row.original} />
    );
  }

  // Fallback
  return ({ getValue }: CellContext<TData, unknown>) => <TextCell value={getValue()} />;
};

/**
 * Konvertiert eine Field Definition zu einer TanStack Column Definition
 */
const fieldToColumn = <TData, TFieldId extends string = string>(
  field: FieldDefinition<TData, TFieldId>,
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
    sortingFn: (
      (): SortingFnOption<TData> => (rowA, rowB, columnId) =>
        String(rowA.original[columnId as keyof TData]).localeCompare(
          String(rowB.original[columnId as keyof TData]),
        )
    )(),
    enableSorting: field.sortable !== false,
    enableGlobalFilter: field.searchable !== false,
    enableColumnFilter: field.filterable ?? false,
    header: createHeader<TData>(label, field.sortable),
    size,
  };

  // Spezialbehandlung für "actions" Column (keine Daten, nur Buttons)
  if (field.id === 'actions') {
    const displayColumn: DisplayColumnDef<TData> = {
      ...baseColumn,
      cell: renderCell(field, callbacks),
    };
    return displayColumn;
  }

  // Normale Accessor Column
  if (field.accessor) {
    const accessorColumn: AccessorColumnDef<TData> = {
      ...baseColumn,
      ...(typeof field.accessor === 'function'
        ? { accessorFn: field.accessor }
        : { accessorKey: field.accessor as unknown as keyof TData }),
      cell: renderCell(field, callbacks),
    };
    return accessorColumn;
  }

  // Ohne expliziten Accessor, verwende field.id als accessorKey
  const accessorColumn: AccessorColumnDef<TData> = {
    ...baseColumn,
    accessorKey: field.id as unknown as keyof TData,
    cell: renderCell(field, callbacks),
  };

  return accessorColumn;
};

/**
 * Konvertiert eine Table Definition zu TanStack Columns
 */
export const convertTableDefinition = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: Array<ExtractedKey<TData> | 'actions'>,
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
  selectableColumns?: Array<ExtractedKey<TData> | 'actions'>,
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
