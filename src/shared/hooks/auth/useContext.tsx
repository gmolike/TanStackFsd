import { createContext } from 'react';
import { AuthContextType } from '~/shared/hooks/auth/type';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
