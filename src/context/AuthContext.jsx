import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

function readStoredAdmin() {
  try {
    const raw = localStorage.getItem('lilyAdminUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem('lilyAdminUser');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem('lilyAdminToken')
  );
  const [admin, setAdmin] = useState(readStoredAdmin);

  const logout = () => {
    localStorage.removeItem('lilyAdminToken');
    localStorage.removeItem('lilyAdminUser');
    setToken(null);
    setAdmin(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('lily-admin-unauthorized', handleUnauthorized);
    return () =>
      window.removeEventListener('lily-admin-unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });

    localStorage.setItem('lilyAdminToken', data.token);
    localStorage.setItem('lilyAdminUser', JSON.stringify(data.admin));
    setToken(data.token);
    setAdmin(data.admin);

    return data;
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      login,
      logout,
      isAuthenticated: Boolean(token),
    }),
    [token, admin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
