import type { JSX } from 'react';

import { AuthProvider } from './providers/auth-provider';
import { QueryProvider } from './providers/query-provider';
import { RouterProvider } from './providers/router-provider';

export const App = (): JSX.Element => (
  <QueryProvider>
    <AuthProvider>
      <RouterProvider />
    </AuthProvider>
  </QueryProvider>
);
