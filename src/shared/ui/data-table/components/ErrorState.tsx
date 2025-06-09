// ===== ErrorState.tsx =====
// src/shared/ui/data-table/components/ErrorState.tsx
import { AlertCircle } from 'lucide-react';

import { Button } from '~/shared/shadcn';

/**
 * Error State Props
 */
type ErrorStateProps = {
  /** Fehler-Objekt */
  error: Error;
  /** Retry-Callback */
  onRetry?: () => void;
};

/**
 * Error State für DataTable
 *
 * @component
 * @param props - Error State Konfiguration
 */
export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
    <h3 className="mb-2 text-lg font-semibold">Fehler beim Laden</h3>
    <p className="mb-4 text-sm text-muted-foreground">
      {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm">
        Erneut versuchen
      </Button>
    )}
  </div>
);
