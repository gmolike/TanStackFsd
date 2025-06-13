import { Phone } from 'lucide-react';

import type { CellProps } from './index';

export const PhoneCell = <TRow = unknown,>({
  value,
}: CellProps<string | number | null | undefined, TRow>) => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (typeof value !== 'string' && typeof value !== 'number')
  ) {
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
