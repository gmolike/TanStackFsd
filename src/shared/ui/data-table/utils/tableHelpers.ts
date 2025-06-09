// src/shared/ui/data-table/utils/tableHelpers.ts

import type { DataTableProps } from '../types';
import { tablePresets } from '../types';

/**
 * Erstellt eine Standard-Konfiguration basierend auf einem Preset
 *
 * @param preset - Name des Presets
 * @param overrides - Überschreibungen für das Preset
 * @returns Kombinierte Konfiguration
 *
 * @example
 * ```tsx
 * const config = createTableConfig('dashboard', {
 *   pageSize: 10,
 *   onAddClick: () => navigate('/new')
 * });
 * ```
 */
export const createTableConfig = <TData, TValue>(
  preset: keyof typeof tablePresets,
  overrides?: Partial<DataTableProps<TData, TValue>>,
): Partial<DataTableProps<TData, TValue>> => {
  const presetConfig = tablePresets[preset];
  return {
    ...presetConfig,
    ...overrides,
  };
};

/**
 * Konvertiert Column Labels für die DataTable
 *
 * @param labels - Label-Objekt
 * @returns Formatierte Labels
 *
 * @example
 * ```tsx
 * const labels = formatColumnLabels({
 *   firstName: 'Vorname',
 *   lastName: 'Nachname',
 *   email: 'E-Mail'
 * });
 * ```
 */
export const formatColumnLabels = (labels: Record<string, string>): Record<string, string> => {
  const formatted: Record<string, string> = {};

  Object.entries(labels).forEach(([key, value]) => {
    // Konvertiere camelCase zu readable format falls kein Label vorhanden
    if (!value) {
      formatted[key] = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
    } else {
      formatted[key] = value;
    }
  });

  return formatted;
};

/**
 * Erstellt eine leere Daten-Struktur für Skeleton-Loading
 *
 * @param count - Anzahl der Skeleton-Zeilen
 * @returns Array mit Dummy-Daten
 */
export const createSkeletonData = <TData extends Record<string, unknown>>(
  count: number,
): Array<TData> =>
  Array.from(
    { length: count },
    (_, index) =>
      ({
        id: `skeleton-${index}`,
      }) as unknown as TData,
  );
