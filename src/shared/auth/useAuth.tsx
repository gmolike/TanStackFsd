import { useContext } from 'react';

import { Context } from './context';
import { AuthType } from './type';

export const useAuthentication = (): AuthType => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
