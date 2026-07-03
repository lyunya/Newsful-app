import { createContext, useCallback, useContext, useState } from 'react';
import NewsfulApi from '../services/newsful-api';
import { TokenStorage, UserStorage } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => TokenStorage.get());
  const [user, setUser] = useState(() => UserStorage.get());

  const storeSession = useCallback(({ authToken, user: nextUser }) => {
    TokenStorage.set(authToken);
    UserStorage.set(nextUser);
    setToken(authToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (credentials) => storeSession(await NewsfulApi.login(credentials)),
    [storeSession]
  );

  const register = useCallback(
    async (credentials) => storeSession(await NewsfulApi.register(credentials)),
    [storeSession]
  );

  const logout = useCallback(() => {
    TokenStorage.clear();
    UserStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
