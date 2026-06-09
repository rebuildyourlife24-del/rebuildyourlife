'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserProfile as User, AuthResponse, LoginRequest, RegisterRequest } from '@rebuildyourlife/shared';
import { api, formatApiError } from './api';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('ryl_access_token', accessToken);
  localStorage.setItem('ryl_refresh_token', refreshToken);
}

function clearTokens() {
  localStorage.removeItem('ryl_access_token');
  localStorage.removeItem('ryl_refresh_token');
}

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ryl_access_token');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setState({ user: null, isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await api.get<User>('/user/me');
      setState({
        user: response.data,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch {
      clearTokens();
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const { user, tokens } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const { user, tokens } = response.data;
    setTokens(tokens.accessToken, tokens.refreshToken);
    setState({ user, isLoading: false, isAuthenticated: true });
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setState({ user: null, isLoading: false, isAuthenticated: false });
    window.location.href = '/auth/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(): AuthContextValue {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      window.location.href = '/auth/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}

export { formatApiError };
