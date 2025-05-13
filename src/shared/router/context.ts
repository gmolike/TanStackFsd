import type { QueryClient } from '@tanstack/react-query';

import type { AuthContextType } from '~/shared/auth';

// Router context interface
export interface RouterContext {
  auth: AuthContextType;
  queryClient: QueryClient;
}
