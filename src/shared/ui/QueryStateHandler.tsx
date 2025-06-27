import type { ReactNode } from 'react';

import { LoaderCircle } from 'lucide-react';

type QueryStateHandlerProps = {
  children: ReactNode;
  isLoading: boolean;
  isError: boolean;
};

export const QueryStateHandler = ({ children, isLoading, isError }: QueryStateHandlerProps) => (
  <>
    {isLoading && (
      <div className="flex items-center gap-x-2">
        <LoaderCircle className="size-4 animate-spin" /> Lade...
      </div>
    )}
    {isError && <div>Fehler...</div>}
    {!isLoading && !isError && <>{children}</>}
  </>
);
