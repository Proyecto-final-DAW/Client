import { useState } from 'react';
import type { ReactNode } from 'react';

import type { User } from '../features/user/core/domain/models/User';
import type { UserInfo } from '../features/user/core/domain/models/UserInfo';
import { AuthContext } from './AuthContext';

const STORAGE_KEY_TOKEN = 'auth_token';
const STORAGE_KEY_USER = 'auth_user';

const loadFromStorage = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_TOKEN)
  );
  const [user, setUser] = useState<User | UserInfo | null>(() =>
    loadFromStorage<User | UserInfo>(STORAGE_KEY_USER)
  );

  const setSession = (newToken: string, newUser: User | UserInfo) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
  };

  const updateUser = (newUser: User | UserInfo) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setSession, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
