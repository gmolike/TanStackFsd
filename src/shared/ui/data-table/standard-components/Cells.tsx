// src/shared/ui/data-table/standard-cells.tsx
import { Mail, Phone } from 'lucide-react';

/**
 * Standard Email Cell
 * @description Einheitliche Darstellung von E-Mail-Adressen in Tabellen
 */
export type StandardEmailCellProps = {
  email: string;
  variant?: 'default' | 'icon' | 'link';
};

export const StandardEmailCell = ({ email, variant = 'default' }: StandardEmailCellProps) => {
  switch (variant) {
    case 'icon':
      return (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="truncate text-sm">{email}</span>
        </div>
      );

    case 'link':
      return (
        <a
          href={`mailto:${email}`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {email}
        </a>
      );

    default:
      return <div className="lowercase">{email}</div>;
  }
};

/**
 * Standard Phone Cell
 * @description Einheitliche Darstellung von Telefonnummern in Tabellen
 */
export type StandardPhoneCellProps = {
  phone?: string;
  variant?: 'default' | 'icon' | 'link';
  placeholder?: string;
};

export const StandardPhoneCell = ({
  phone,
  variant = 'default',
  placeholder = '-',
}: StandardPhoneCellProps) => {
  if (!phone || phone.trim() === '') {
    return <span className="text-muted-foreground">{placeholder}</span>;
  }

  switch (variant) {
    case 'icon':
      return (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{phone}</span>
        </div>
      );

    case 'link':
      return (
        <a
          href={`tel:${phone}`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {phone}
        </a>
      );

    default:
      return <div>{phone}</div>;
  }
};

/**
 * Standard Contact Cell
 * @description Kombinierte Darstellung von E-Mail und Telefon
 */
export type StandardContactCellProps = {
  email: string;
  phone?: string;
  variant?: 'default' | 'icon' | 'link';
};

export const StandardContactCell = ({
  email,
  phone,
  variant = 'icon',
}: StandardContactCellProps) => (
  <div className="space-y-1">
    <StandardEmailCell email={email} variant={variant} />
    {phone && <StandardPhoneCell phone={phone} variant={variant} />}
  </div>
);
