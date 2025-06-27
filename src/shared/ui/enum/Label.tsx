import type { BaseEnumProps } from './model/types';
import { getEnumLabel } from './model/utils';

export interface EnumLabelProps<T extends Record<string, string | number>>
  extends BaseEnumProps<T> {
  fallback?: string;
  className?: string;
}

/**
 * EnumLabel Component
 * @description Zeigt den Label eines Enum-Wertes als Text an
 * @param value - Der Enum-Wert (Key oder Value)
 * @param config - Enum Config mit optionalen Labels
 * @param fallback - Fallback-Text wenn Wert nicht gefunden
 * @param className - CSS Klassen
 * @example
 * ```tsx
 * <EnumLabel
 *   value={obligation.status}
 *   config={obligationStatusConfig}
 *   enumObj={ObligationStatus}
 *   className="font-semibold"
 * />
 * ```
 */
export function EnumLabel<T extends Record<string, string | number>>({
  value,
  config,
  fallback = '-',
  className,
}: Readonly<EnumLabelProps<T>>) {
  const label = getEnumLabel(value, config.variants, config.enumObj, fallback);
  return <span className={className}>{label}</span>;
}
