import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { type User } from '~/entities/user/model/types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Beim Initialisieren den Benutzer aus dem lokalen Speicher laden
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulieren eines API-Aufrufs
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo-Benutzer erstellen (in echter App würde das von einer API kommen)
      const loggedInUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        role: 'admin',
      };

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error('Login fehlgeschlagen:', error);
      throw new Error('Login fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
