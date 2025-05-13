import type { JSX } from 'react';

export const LoadingSpinner = (): JSX.Element => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      <p className="mt-2 text-sm text-gray-600">Lade Anwendung...</p>
    </div>
  </div>
);
