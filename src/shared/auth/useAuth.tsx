import { useContext } from 'react';

import { Context } from './context';
import type { AuthType } from './type';

export const useAuthentication = (): AuthType => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
