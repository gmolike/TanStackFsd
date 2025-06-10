// shared/ui/data-table/cell-templates/index.tsx
import { Mail, Phone } from 'lucide-react';

import { TableDeleteButton, TableEditButton } from './CellButtons';

/**
 * Standard Cell Templates
 * Wiederverwendbare Zellen-Vorlagen für häufige Datentypen
 */

// Text Cell - Standard für Text
export const TextCell = ({ value }: { value: unknown }) => (
  <div className="truncate">{String(value ?? '')}</div>
);

// Email Cell
export const EmailCell = ({ value }: { value: unknown }) => (
  <div className="flex items-center gap-2">
    <Mail className="h-4 w-4 text-muted-foreground" />
    <a
      href={`mailto:${value}`}
      className="truncate text-sm hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {String(value)}
    </a>
  </div>
);

// Phone Cell
export const PhoneCell = ({ value }: { value: unknown }) => {
  if (!value || String(value).trim() === '') {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Phone className="h-4 w-4 text-muted-foreground" />
      <a
        href={`tel:${value}`}
        className="text-sm hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {String(value)}
      </a>
    </div>
  );
};

// Date Cell
export const DateCell = ({ value }: { value: unknown }) => {
  if (!value) return <span className="text-muted-foreground">-</span>;

  const date = value instanceof Date ? value : new Date(String(value));

  if (isNaN(date.getTime())) {
    return <span className="text-muted-foreground">-</span>;
  }

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

// Boolean Cell
export const BooleanCell = ({ value }: { value: unknown }) => (
  <span className={value ? 'text-green-600' : 'text-gray-400'}>{value ? '✓' : '-'}</span>
);

// Actions Cell - Benötigt onEdit und onDelete als Props
export const ActionsCell = ({
  row,
  onEdit,
  onDelete,
}: {
  row: unknown;
  onEdit?: (row: unknown) => void;
  onDelete?: (row: unknown) => void;
}) => (
  <div className="flex items-center gap-2">
    {onEdit && <TableEditButton onClick={() => onEdit(row)} />}
    {onDelete && <TableDeleteButton onClick={() => onDelete(row)} />}
  </div>
);

/**
 * Cell Template Registry
 * Mappt Template-Namen zu Komponenten
 */
export const cellTemplates = {
  text: TextCell,
  email: EmailCell,
  phone: PhoneCell,
  date: DateCell,
  boolean: BooleanCell,
  actions: ActionsCell,
} as const;

export type CellTemplateName = keyof typeof cellTemplates;
