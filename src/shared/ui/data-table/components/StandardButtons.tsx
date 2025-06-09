// src/shared/ui/data-table/standard-buttons.tsx
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '~/shared/shadcn';

/**
 * Standard Edit Button für Tabellen
 * @description Einheitlicher Edit-Button für alle Tabellen
 */
export type TableEditButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

export const TableEditButton = ({ onClick, label = 'Bearbeiten' }: TableEditButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
  >
    <Edit className="h-4 w-4" />
  </Button>
);

/**
 * Standard Delete Button für Tabellen
 * @description Einheitlicher Delete-Button für alle Tabellen
 */
export type TableDeleteButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
};

export const TableDeleteButton = ({ onClick, label = 'Löschen' }: TableDeleteButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    title={label}
    className="text-destructive hover:bg-destructive/10"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
);

/**
 * Kompakter Delete Button
 * @description Wie er auf der Detail-Seite verwendet wird
 */
export const CompactDeleteButton = ({
  onClick,
  label = 'Löschen',
}: {
  onClick: () => void;
  label?: string;
}) => (
  <Button variant="destructive" size="sm" onClick={onClick}>
    {label}
  </Button>
);
