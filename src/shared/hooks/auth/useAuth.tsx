import { useContext } from 'react';
import { AuthContext } from '~/shared/hooks/auth/useContext';
import { AuthContextType } from '~/shared/hooks/auth/type';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
