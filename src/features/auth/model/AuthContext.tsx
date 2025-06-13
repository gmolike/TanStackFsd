// src/features/auth/model/AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';

import type { User } from '~/entities/user';

import { apiClient } from '~/shared/api/client';

// ================= TYPES =================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;

  // Utilities
  hasRole: (role: string | Array<string>) => boolean;
  hasPermission: (permission: string | Array<string>) => boolean;
}

// ================= CONTEXT =================

const AuthContext = createContext<AuthContextType | null>(null);

// ================= TOKEN MANAGEMENT =================

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly TOKEN_EXPIRY_KEY = 'tokenExpiry';

  static setTokens(tokens: AuthTokens): void {
    const expiryTime = Date.now() + tokens.expiresIn * 1000;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return true;

    return Date.now() > parseInt(expiry, 10);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  static hasValidToken(): boolean {
    return !!(this.getAccessToken() && !this.isTokenExpired());
  }
}

// ================= AUTH API =================

const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    return apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/login', credentials, {
      skipAuth: true,
    });
  },

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    return apiClient.post<{ user: User; tokens: AuthTokens }>('/auth/register', data, {
      skipAuth: true,
    });
  },

  async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.post('/auth/logout', { refreshToken });
      } catch (error) {
        // Ignore logout errors
        console.warn('Logout API call failed:', error);
      }
    }
  },

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return apiClient.post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true });
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};

// ================= AUTH PROVIDER =================

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // ================= ACTIONS =================

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { user: loggedInUser, tokens } = await authApi.login(credentials);

      TokenManager.setTokens(tokens);
      setUser(loggedInUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login fehlgeschlagen';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const { user: registeredUser, tokens } = await authApi.register(data);

      TokenManager.setTokens(tokens);
      setUser(registeredUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registrierung fehlgeschlagen';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      if (!TokenManager.hasValidToken()) {
        return;
      }

      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.warn('Failed to refresh user:', error);
      // Don't clear tokens here, let the API client handle token refresh
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // ================= UTILITY FUNCTIONS =================

  const hasRole = useCallback(
    (role: string | Array<string>): boolean => {
      if (!user?.roles) return false;

      const roles = Array.isArray(role) ? role : [role];
      return roles.some((r) => user.roles.includes(r));
    },
    [user],
  );

  const hasPermission = useCallback(
    (permission: string | Array<string>): boolean => {
      if (!user?.permissions) return false;

      const permissions = Array.isArray(permission) ? permission : [permission];
      return permissions.some((p) => user.permissions.includes(p));
    },
    [user],
  );

  // ================= INITIALIZATION =================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Check if we have valid tokens
        if (TokenManager.hasValidToken()) {
          await refreshUser();
        } else {
          // Try to refresh token if we have a refresh token
          const refreshToken = TokenManager.getRefreshToken();
          if (refreshToken) {
            try {
              const tokens = await authApi.refreshToken();
              TokenManager.setTokens(tokens);
              await refreshUser();
            } catch (error) {
              console.warn('Token refresh failed:', error);
              TokenManager.clearTokens();
            }
          }
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error);
        TokenManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUser]);

  // ================= TOKEN REFRESH ON FOCUS =================

  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && TokenManager.isTokenExpired()) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, refreshUser]);

  // ================= CONTEXT VALUE =================

  const contextValue: AuthContextType = {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    register,
    logout,
    refreshUser,
    clearError,

    // Utilities
    hasRole,
    hasPermission,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// ================= HOOK =================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ================= AUTH GUARDS =================

export const useRequireAuth = (redirectTo = '/login'): AuthContextType => {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [auth.isAuthenticated, auth.isLoading, redirectTo]);

  return auth;
};

export const useRequireRole = (
  requiredRole: string | Array<string>,
  redirectTo = '/forbidden',
): AuthContextType => {
  const auth = useRequireAuth();

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated && !auth.hasRole(requiredRole)) {
      window.location.href = redirectTo;
    }
  }, [auth, requiredRole, redirectTo]);

  return auth;
};

// ================= DEFAULT EXPORT =================

export default AuthProvider;
