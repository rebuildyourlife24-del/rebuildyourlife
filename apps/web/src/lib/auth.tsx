'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserProfile as User, LoginRequest, RegisterRequest } from '@rebuildyourlife/shared';
import { getSessionAction, logoutAction } from '@/app/actions/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  setUser: (user: User | null) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const setUser = useCallback((user: User | null) => {
    setState({ user, isLoading: false, isAuthenticated: !!user });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const result = await getSessionAction();
      if (result.success && result.user) {
        setState({
          user: result.user as any,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // login and register are bypassed by LoginPage and RegisterPage using actions directly
  const login = useCallback(async (_credentials: LoginRequest) => {}, []);
  const register = useCallback(async (_data: RegisterRequest) => {}, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setState({ user: null, isLoading: false, isAuthenticated: false });
    window.location.href = '/auth/login';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setUser,
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
