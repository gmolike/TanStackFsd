import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <div className="flex items-center justify-center py-8">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Lade Daten...</p>
    </div>
  </div>
);
