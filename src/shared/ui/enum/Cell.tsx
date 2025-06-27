import { EnumBadge } from './Badge';
import { EnumLabel } from './Label';
import type { EnumConfigBundle } from './model/types';

export type EnumCellDisplayMode = 'badge' | 'label';

export const createEnumCell =
  <T extends Record<string, string | number>>(
    config: EnumConfigBundle<T>,
    displayAs: EnumCellDisplayMode = 'label',
  ) =>
  ({ value }: { value: unknown }) => {
    const props = {
      value: value as keyof T | T[keyof T] | null,
      config,
    } as const;

    return displayAs === 'badge' ? <EnumBadge {...props} /> : <EnumLabel {...props} />;
  };
