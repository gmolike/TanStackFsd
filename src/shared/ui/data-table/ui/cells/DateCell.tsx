import type { CellProps } from './index';

export const DateCell = <TRow = unknown,>({
  value,
}: CellProps<string | Date | number | null | undefined, TRow>) => {
  if (!value) return <span className="text-muted-foreground">-</span>;

  let date: Date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    date = new Date(value);
  } else {
    return <span className="text-muted-foreground">-</span>;
  }

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
