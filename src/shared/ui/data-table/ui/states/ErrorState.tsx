import { AlertCircle } from 'lucide-react';

import { Button } from '~/shared/shadcn';

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

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
