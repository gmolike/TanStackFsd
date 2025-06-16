# create-files.ps1

Write-Host "Creating all DataTable files..." -ForegroundColor Green

# Define files with their content
$files = @{
  # Model - Hooks
  "model\hooks\useDataTable.ts"         = @"
import { useMemo } from 'react';
import { useReactTable } from '@tanstack/react-table';
import type { DataTableProps } from '../types/props';

export const useDataTable = <TData, TTableDef>(props: DataTableProps<TData, TTableDef>) => {
  // TODO: Implement main controller hook
  return {} as any;
};
"@

  "model\hooks\useTableState.ts"        = @"
import { useState } from 'react';
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/react-table';

export const useTableState = (props: any) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
  };
};
"@

  "model\hooks\useTableSearch.ts"       = @"
import { useState } from 'react';

export const useTableSearch = (props: any, state: any) => {
  const [globalFilter, setGlobalFilter] = useState('');

  return {
    state: { globalFilter },
    setGlobalFilter,
  };
};
"@

  "model\hooks\useTableSelection.ts"    = @"
import { useState } from 'react';

export const useTableSelection = (props: any, state: any) => {
  const [rowSelection, setRowSelection] = useState({});

  return {
    state: { rowSelection },
    setRowSelection,
  };
};
"@

  "model\hooks\useTableFeatures.ts"     = @"
import { useMemo } from 'react';

export const useTableFeatures = (props: any) => {
  return useMemo(() => ({
    hasToolbar: true,
    hasPagination: true,
    hasExpand: false,
    hasSelection: false,
  }), [props]);
};
"@

  # Model - Types
  "model\types\table-definition.ts"     = @"
export type FieldDefinition<TData = unknown> = {
  id: string;
  accessor?: string | ((row: TData) => unknown);
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  defaultVisible?: boolean;
  cell?: React.ComponentType<{ value: unknown; row: TData }> | 'default' | 'actions';
  width?: number | string;
};

export type TableDefinition<TData = unknown> = {
  labels: Record<string, string>;
  fields: Array<FieldDefinition<TData>>;
};

export type ExtractFieldIds<T extends TableDefinition<any>> =
  T extends TableDefinition<infer _> ? T['fields'][number]['id'] : never;
"@

  "model\types\props.ts"                = @"
import type { TableDefinition, ExtractFieldIds } from './table-definition';

export type DataTableProps<
  TData = unknown,
  TTableDef extends TableDefinition<TData> = TableDefinition<TData>,
> = {
  tableDefinition: TTableDef;
  selectableColumns?: Array<ExtractFieldIds<TTableDef>>;
  data: Array<TData>;
  isLoading?: boolean;
  error?: Error | null;

  onRowClick?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onAdd?: () => void;
  onRetry?: () => void;

  searchPlaceholder?: string;
  addButtonText?: string;
  showColumnToggle?: boolean;
  showColumnToggleText?: boolean;

  expandable?: boolean;
  initialRowCount?: number;
  expandButtonText?: {
    expand?: string;
    collapse?: string;
  };
  stickyHeader?: boolean;
  stickyActionColumn?: boolean;
  maxHeight?: string;
  pageSize?: number;
  selectedRowId?: string | null;
  selectedId?: unknown;
  idKey?: string;

  className?: string;
  containerClassName?: string;

  emptyStateComponent?: React.ComponentType;
  errorStateComponent?: React.ComponentType<{ error: Error; onRetry?: () => void }>;
};
"@

  "model\types\state.ts"                = @"
import type { SortingState, ColumnFiltersState, VisibilityState } from '@tanstack/react-table';

export type TableState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: Record<string, boolean>;
  globalFilter: string;
  isExpanded: boolean;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};
"@

  # Model - Converters
  "model\converters\table-converter.ts" = @"
import type { ColumnDef } from '@tanstack/react-table';
import type { TableDefinition } from '../types/table-definition';

export const convertTableDefinition = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: Array<string>,
  callbacks?: {
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
  },
): Array<ColumnDef<TData>> => {
  // TODO: Implement conversion logic
  return [];
};

export const getColumnVisibility = <TData,>(
  definition: TableDefinition<TData>,
  selectableColumns?: Array<string>,
): Record<string, boolean> => {
  const visibility: Record<string, boolean> = {};
  definition.fields.forEach((field) => {
    visibility[field.id] = selectableColumns ? selectableColumns.includes(field.id) : true;
  });
  return visibility;
};

export const getSearchableColumns = <TData,>(
  definition: TableDefinition<TData>
): Array<string> =>
  definition.fields.filter((field) => field.searchable === true).map((field) => field.id);
"@

  # Model - Utils
  "model\utils\table-helpers.ts"        = @"
export const createSkeletonData = <TData extends Record<string, unknown>>(
  count: number,
): Array<TData> =>
  Array.from(
    { length: count },
    (_, index) =>
      ({
        id: `skeleton-`${index}`,
      }) as unknown as TData,
  );
"@

  "model\utils\filter-utils.ts"         = @"
export const globalFilterFn = (
  row: any,
  columnId: string,
  filterValue: string,
  searchableColumns?: string[]
) => {
  if (!filterValue) return true;

  const search = filterValue.toLowerCase();

  if (searchableColumns && searchableColumns.length > 0) {
    return searchableColumns.some((column) => {
      const value = row.getValue(column);
      return String(value).toLowerCase().includes(search);
    });
  }

  return String(row.getValue(columnId)).toLowerCase().includes(search);
};
"@

  "model\utils\display-utils.ts"        = @"
import type { Row } from '@tanstack/react-table';

export const computeDisplayRows = <TData,>(
  table: any,
  state: any,
  props: any
): Array<Row<TData>> => {
  const allRows = table.getFilteredRowModel().rows;
  const paginatedRows = table.getPaginationRowModel().rows;

  if (props.expandable && !state.isExpanded) {
    return allRows.slice(0, props.initialRowCount || 5);
  }

  return paginatedRows;
};
"@

  # UI - Main
  "ui\DataTable.tsx"                    = @"
import { DataTableProvider } from './DataTableProvider';
import { TableContainer } from './table/TableContainer';
import { TableToolbar } from './toolbar/TableToolbar';
import { ExpandButton } from './features/ExpandButton';
import { Pagination } from './features/Pagination';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';
import { LoadingState } from './states/LoadingState';
import { useDataTable } from '../model/hooks/useDataTable';
import type { DataTableProps } from '../model/types/props';

export const DataTable = <TData, TTableDef>(props: DataTableProps<TData, TTableDef>) => {
  const controller = useDataTable(props);

  return (
    <DataTableProvider value={controller}>
      <div className={props.className}>
        <TableContainer />
      </div>
    </DataTableProvider>
  );
};
"@

  "ui\DataTableProvider.tsx"            = @"
import { createContext, useContext } from 'react';

const DataTableContext = createContext<any>(null);

export const DataTableProvider = ({ children, value }: any) => (
  <DataTableContext.Provider value={value}>{children}</DataTableContext.Provider>
);

export const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTableContext must be used within DataTableProvider');
  }
  return context;
};
"@

  # UI - Table
  "ui\table\TableContainer.tsx"         = @"
export const TableContainer = () => {
  return <div>TableContainer</div>;
};
"@

  "ui\table\TableHeader.tsx"            = @"
export const TableHeader = () => {
  return <thead>TableHeader</thead>;
};
"@

  "ui\table\TableBody.tsx"              = @"
export const TableBody = () => {
  return <tbody>TableBody</tbody>;
};
"@

  "ui\table\TableRow.tsx"               = @"
export const TableRow = ({ row }: any) => {
  return <tr>TableRow</tr>;
};
"@

  # UI - Cells
  "ui\cells\index.ts"                   = @"
export { TextCell } from './TextCell';
export { EmailCell } from './EmailCell';
export { PhoneCell } from './PhoneCell';
export { DateCell } from './DateCell';
export { BooleanCell } from './BooleanCell';
export { ActionsCell } from './ActionsCell';
"@

  "ui\cells\TextCell.tsx"               = @"
export const TextCell = ({ value }: { value: unknown }) => (
  <div className="truncate">{String(value)}</div>
);
"@

  "ui\cells\EmailCell.tsx"              = @"
import { Mail } from 'lucide-react';

export const EmailCell = ({ value }: { value: unknown }) => (
  <div className="flex items-center gap-2">
    <Mail className="h-4 w-4 text-muted-foreground" />
    <a href={`mailto:`${value}`} className="truncate text-sm hover:underline">
      {String(value)}
    </a>
  </div>
);
"@

  "ui\cells\PhoneCell.tsx"              = @"
import { Phone } from 'lucide-react';

export const PhoneCell = ({ value }: { value: unknown }) => {
  if (!value) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex items-center gap-2">
      <Phone className="h-4 w-4 text-muted-foreground" />
      <a href={`tel:`${value}`} className="text-sm hover:underline">
        {String(value)}
      </a>
    </div>
  );
};
"@

  "ui\cells\DateCell.tsx"               = @"
export const DateCell = ({ value }: { value: unknown }) => {
  if (!value) return <span className="text-muted-foreground">-</span>;

  const date = new Date(String(value));
  return (
    <div>
      {date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })}
    </div>
  );
};
"@

  "ui\cells\BooleanCell.tsx"            = @"
export const BooleanCell = ({ value }: { value: unknown }) => (
  <span className={value ? 'text-green-600' : 'text-gray-400'}>{value ? '✓' : '-'}</span>
);
"@

  "ui\cells\ActionsCell.tsx"            = @"
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const ActionsCell = ({ row, onEdit, onDelete }: any) => (
  <div className="flex items-center gap-2">
    {onEdit && (
      <Button variant="ghost" size="icon" onClick={() => onEdit(row)}>
        <Edit className="h-4 w-4" />
      </Button>
    )}
    {onDelete && (
      <Button variant="ghost" size="icon" onClick={() => onDelete(row)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    )}
  </div>
);
"@

  # UI - Headers
  "ui\headers\index.ts"                 = @"
export { SimpleHeader } from './SimpleHeader';
export { SortableHeader } from './SortableHeader';
export { FilterableHeader } from './FilterableHeader';
"@

  "ui\headers\SimpleHeader.tsx"         = @"
export const SimpleHeader = ({ label }: { label: string }) => (
  <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
);
"@

  "ui\headers\SortableHeader.tsx"       = @"
import { ArrowUpDown } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const SortableHeader = ({ label, column }: any) => (
  <Button
    variant="ghost"
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {label}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);
"@

  "ui\headers\FilterableHeader.tsx"     = @"
export const FilterableHeader = ({ label, column }: any) => (
  <div>{label}</div>
);
"@

  # UI - Toolbar
  "ui\toolbar\TableToolbar.tsx"         = @"
import { SearchInput } from './SearchInput';
import { ColumnToggle } from './ColumnToggle';
import { Plus } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const TableToolbar = () => {
  return (
    <div className="flex items-center justify-between">
      <SearchInput />
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
        <ColumnToggle />
      </div>
    </div>
  );
};
"@

  "ui\toolbar\SearchInput.tsx"          = @"
import { InputShadcn as Input } from '~/shared/shadcn';

export const SearchInput = () => {
  return <Input placeholder="Search..." className="h-8 w-[200px] lg:w-[300px]" />;
};
"@

  "ui\toolbar\ColumnToggle.tsx"         = @"
import { Settings2 } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const ColumnToggle = () => {
  return (
    <Button variant="outline" size="sm">
      <Settings2 className="h-4 w-4" />
    </Button>
  );
};
"@

  "ui\toolbar\BulkActions.tsx"          = @"
export const BulkActions = () => {
  return <div>BulkActions</div>;
};
"@

  # UI - States
  "ui\states\EmptyState.tsx"            = @"
import { FileX2 } from 'lucide-react';

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <FileX2 className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-lg font-semibold">Keine Daten vorhanden</h3>
    <p className="text-sm text-muted-foreground">Es wurden keine Einträge gefunden.</p>
  </div>
);
"@

  "ui\states\ErrorState.tsx"            = @"
import { AlertCircle } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const ErrorState = ({ error, onRetry }: any) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
    <h3 className="mb-2 text-lg font-semibold">Fehler beim Laden</h3>
    <p className="mb-4 text-sm text-muted-foreground">{error?.message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        Erneut versuchen
      </Button>
    )}
  </div>
);
"@

  "ui\states\LoadingState.tsx"          = @"
export const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <div className="text-muted-foreground">Loading...</div>
  </div>
);
"@

  "ui\states\SkeletonState.tsx"         = @"
import { Skeleton } from '~/shared/shadcn';

export const SkeletonState = ({ rows = 10 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);
"@

  # UI - Features
  "ui\features\ExpandButton.tsx"        = @"
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const ExpandButton = ({ isExpanded, onToggle, totalCount }: any) => (
  <div className="flex justify-center border-t py-4">
    <Button variant="ghost" onClick={onToggle} className="gap-2">
      {isExpanded ? (
        <>
          <ChevronUp className="h-4 w-4" />
          Weniger anzeigen
        </>
      ) : (
        <>
          <ChevronDown className="h-4 w-4" />
          Alle {totalCount} Einträge anzeigen
        </>
      )}
    </Button>
  </div>
);
"@

  "ui\features\Pagination.tsx"          = @"
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '~/shared/shadcn';

export const Pagination = ({ table }: any) => (
  <div className="flex items-center justify-between px-2">
    <div className="text-sm text-muted-foreground">
      Seite {1} von {1}
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="icon" disabled>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" disabled>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
"@

  "ui\features\ExportButton.tsx"        = @"
export const ExportButton = () => {
  return <div>ExportButton</div>;
};
"@

  "ui\features\FilterPresets.tsx"       = @"
export const FilterPresets = () => {
  return <div>FilterPresets</div>;
};
"@

  # Lib
  "lib\constants.ts"                    = @"
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];
export const DEFAULT_DEBOUNCE_MS = 300;
"@

  "lib\defaults.ts"                     = @"
export const defaultTableConfig = {
  pageSize: 10,
  showColumnToggle: true,
  enableGlobalFilter: true,
  stickyHeader: false,
};
"@

  "lib\context.tsx"                     = @"
export { DataTableProvider, useDataTableContext } from '../ui/DataTableProvider';
"@

  # Index
  "index.ts"                            = @"
// Main Component
export { DataTable } from './ui/DataTable';

// Types
export type {
  DataTableProps,
  ExtractFieldIds,
  FieldDefinition,
  TableDefinition
} from './model/types/table-definition';

// Cells
export * from './ui/cells';

// Headers
export * from './ui/headers';

// States
export { EmptyState } from './ui/states/EmptyState';
export { ErrorState } from './ui/states/ErrorState';
export { LoadingState } from './ui/states/LoadingState';

// Features
export { ExpandButton } from './ui/features/ExpandButton';
export { Pagination } from './ui/features/Pagination';

// Utils
export * from './model/converters/table-converter';
"@
}

# Create all files
foreach ($file in $files.GetEnumerator()) {
  $filePath = $file.Key
  $content = $file.Value

  # Create the file with content
  New-Item -ItemType File -Path $filePath -Value $content -Force | Out-Null
  Write-Host "Created: $filePath" -ForegroundColor Cyan
}

Write-Host "`nAll files created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Move existing logic from old files to new structure" -ForegroundColor White
Write-Host "2. Update imports in existing files" -ForegroundColor White
Write-Host "3. Test the refactored component" -ForegroundColor White
