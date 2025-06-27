import { BooleanDisplay, DateDisplay, EmailDisplay, TextDisplay } from '../../display';
import { Phone } from '../../display/Phone';

import { TableDeleteButton, TableEditButton } from './CellButtons';

/**
 * Standard Cell Templates
 * Wiederverwendbare Zellen-Vorlagen für häufige Datentypen
 */

// Text Cell - Standard für Text
export const TextCell = ({ value }: { value: unknown }) => (
  <TextDisplay text={value as string | undefined | null} />
);

export const EmailCell = ({ value }: { value: unknown }) => (
  <EmailDisplay email={value as string | undefined} withIcon />
);

export const PhoneCell = ({ value }: { value: unknown }) => (
  <Phone phone={value as string | null | undefined} />
);

export const DateCell = ({ value }: { value: unknown }) => (
  <DateDisplay date={value as string | Date | number | null | undefined} />
);

export const BooleanCell = ({ value }: { value: unknown }) => (
  <BooleanDisplay value={value as boolean} />
);

export const ActionsCell = ({
  row,
  onEdit,
  onDelete,
}: {
  row: unknown;
  onEdit?: (rowData: unknown) => void;
  onDelete?: (rowData: unknown) => void;
}) => (
  <div className="flex items-center gap-2">
    {onEdit && <TableEditButton onClick={() => onEdit(row)} />}
    {onDelete && <TableDeleteButton onClick={() => onDelete(row)} />}
  </div>
);
