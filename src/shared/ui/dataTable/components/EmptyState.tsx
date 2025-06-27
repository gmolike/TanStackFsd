import { FileX2 } from 'lucide-react';

/**
 * Empty State für DataTable
 *
 * @component
 */
export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <FileX2 className="mb-4 h-12 w-12 text-muted-foreground" />
    <h3 className="mb-2 text-lg font-semibold">Keine Daten vorhanden</h3>
    <p className="text-sm text-muted-foreground">Es wurden keine Einträge gefunden.</p>
  </div>
);
