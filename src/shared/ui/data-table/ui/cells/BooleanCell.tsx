import type { CellProps } from './index';

export const BooleanCell = <TRow = unknown,>({
  value,
}: CellProps<boolean | null | undefined, TRow>) => (
  <span className={value ? 'text-green-600' : 'text-gray-400'}>{value ? '✓' : '-'}</span>
);
