import React from 'react';
import { AuthContext } from '~/shared/hooks/auth/type';

export const useContext = React.createContext<AuthContext | null>(null);
