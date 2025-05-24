import type { JSX } from 'react';

import { Toaster } from '~/shared/shadcn/toaster';

import { AuthProvider } from './providers/auth-provider';
import { QueryProvider } from './providers/query-provider';
import { RouterProvider } from './providers/router-provider';

export const App = (): JSX.Element => (
  <QueryProvider>
    <AuthProvider>
      <Toaster />
      <RouterProvider />
    </AuthProvider>
  </QueryProvider>
);
