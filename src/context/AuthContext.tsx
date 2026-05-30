/* e:\claude_repos\trigital\openloyalty-master\frontend-react\src\context\AuthContext.tsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, isEnforcedMock, setEnforceMock } from '../services/api';

export interface User {
  username: string;
  role: 'admin' | 'customer' | 'seller';
  id?: string;
  posLocation?: string;
  name?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  toasts: Toast[];
  demoMode: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (username: string, password: string, role: 'admin' | 'customer' | 'seller') => Promise<void>;
  logout: () => void;
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  setDemoMode: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [demoMode, setDemoModeState] = useState(isEnforcedMock());
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('ol_theme') as 'light' | 'dark') || 'dark'
  );

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ol_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Bootstrap session from local storage
  useEffect(() => {
    const token = localStorage.getItem('ol_jwt_token');
    const role = localStorage.getItem('ol_user_role') as User['role'];
    const username = localStorage.getItem('ol_username');
    const posLocation = localStorage.getItem('ol_pos_location') || undefined;
    const name = localStorage.getItem('ol_name') || undefined;

    if (token && role && username) {
      // Dev customer ID hardcode matching backend dev@openloyalty.io ID
      const id = role === 'customer' ? '8f3b20cd-9d18-498c-8f19-3543d8a5712e' : undefined;
      setUser({ username, role, id, posLocation, name });
    }
    setLoading(false);

    // Watch for unauthorized events
    const handleUnauthorized = () => {
      logout();
      showToast('Session expired, please login again.', 'warning');
    };

    window.addEventListener('ol_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('ol_unauthorized', handleUnauthorized);
  }, []);

  const login = async (username: string, password: string, role: 'admin' | 'customer' | 'seller') => {
    setLoading(true);
    try {
      const res = await api.login(username, password, role);
      
      // Customer has a hardcoded dev id in mock and backend
      const id = role === 'customer' ? '8f3b20cd-9d18-498c-8f19-3543d8a5712e' : undefined;
      
      setUser({
        username: res.username,
        role: role,
        id,
        posLocation: res.posLocation,
        name: res.name
      });
      showToast(`Welcome back, ${username}!`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Authentication failed', 'danger');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Toast Management
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setDemoMode = (val: boolean) => {
    setEnforceMock(val);
    setDemoModeState(val);
    showToast(`Switched to ${val ? 'Offline Demo DB' : 'NestJS Server'} mode`, 'info');
    // Clear token when switching modes to prevent cors/role leakage
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        toasts,
        demoMode,
        theme,
        toggleTheme,
        login,
        logout,
        showToast,
        dismissToast,
        setDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
