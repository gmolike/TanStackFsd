import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JSX, type PropsWithChildren, useState } from 'react';

export const QueryProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
