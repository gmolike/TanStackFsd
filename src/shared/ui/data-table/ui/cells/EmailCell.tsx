import { Mail } from 'lucide-react';

import type { CellProps } from './index';

export const EmailCell = <TRow = unknown,>({
  value,
}: CellProps<string | null | undefined, TRow>) => {
  if (!value || typeof value !== 'string') {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Mail className="h-4 w-4 text-muted-foreground" />
      <a
        href={`mailto:${value}`}
        className="truncate text-sm hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {value}
      </a>
    </div>
  );
};
