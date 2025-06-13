// model/utils/table-helpers.ts
/**
 * Erstellt eine leere Daten-Struktur für Skeleton-Loading
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

/**
 * Formatiert Column Labels
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
