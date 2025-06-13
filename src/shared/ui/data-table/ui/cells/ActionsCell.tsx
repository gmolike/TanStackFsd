import { Edit, Trash2 } from 'lucide-react';

import { Button } from '~/shared/shadcn';

export type ActionsCellProps<TRow = unknown> = {
  row: TRow;
  onEdit?: (rowData: TRow) => void;
  onDelete?: (rowData: TRow) => void;
};

export const ActionsCell = <TRow = unknown,>({ row, onEdit, onDelete }: ActionsCellProps<TRow>) => (
  <div className="flex items-center gap-2">
    {onEdit && (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onEdit(row);
        }}
        title="Bearbeiten"
      >
        <Edit className="h-4 w-4" />
      </Button>
    )}
    {onDelete && (
      <Button
        variant="ghost"
        size="icon"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(row);
        }}
        title="Löschen"
        className="text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    )}
  </div>
);

// Button Type Definitions
export type TableButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label?: string;
};

export type CompactButtonProps = {
  onClick: () => void;
  label?: string;
};

// Export zusätzliche Button-Komponenten für andere Verwendungen
export const TableEditButton = ({ onClick, label = 'Bearbeiten' }: TableButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
  >
    <Edit className="h-4 w-4" />
  </Button>
);

export const TableDeleteButton = ({ onClick, label = 'Löschen' }: TableButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
    className="text-destructive hover:bg-destructive/10"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

export const CompactDeleteButton = ({ onClick, label = 'Löschen' }: CompactButtonProps) => (
  <Button variant="destructive" size="sm" onClick={onClick}>
    {label}
  </Button>
);
