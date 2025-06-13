import type { CellProps } from './index';

export const TextCell = <TRow = unknown,>({ value }: CellProps<unknown, TRow>) => (
  <div className="truncate">
    {typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? (
      String(value)
    ) : (
      <span className="text-muted-foreground">-</span>
    )}
  </div>
);
