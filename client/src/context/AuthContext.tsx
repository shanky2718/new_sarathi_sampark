import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  onboardComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sarathi_token');
      if (token) {
        try {
          const userData = await api.auth.me();
          setUser(userData);
        } catch (error) {
          console.error('Session verification failed, logging out.', error);
          api.auth.logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await api.auth.login({ email, password });
      setUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const result = await api.auth.register(data);
      setUser(result.user);
    } catch (error) {
      setLoading(false);
      throw error;
    }
    setLoading(false);
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
  };

  const onboardComplete = async () => {
    try {
      await api.auth.onboard();
      setUser((prev: any) => prev ? { ...prev, onboarded: true } : null);
    } catch (error) {
      console.error('Failed to complete onboarding update.', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, onboardComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext;
