import { JSX, useEffect, useState, type PropsWithChildren } from 'react';

import { type User } from '~/entities/user/model/types';
import { AuthContext } from '~/shared/hooks/auth/useContext';

export const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
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

  const login = async (email: string, password: string): Promise<void> => {
    console.log('Login mit E-Mail:', password);
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

  const logout = (): void => {
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

// Move to a separate file to avoid Fast Refresh warning
