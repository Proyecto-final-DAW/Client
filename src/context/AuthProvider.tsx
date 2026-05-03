import axios from 'axios';
import { useState } from 'react';

import { API_ENDPOINTS } from '../config/api';
import type { UserInfo } from '../shared/core/domain/models/UserInfo';
import { AuthContext } from './AuthContext';
import type { AuthUser } from './AuthContext';

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

const normalizeAuthUser = (user: AuthUser | null | undefined): UserInfo => {
  const safeUser = (user ?? {}) as Partial<UserInfo>;
  return {
    ...(safeUser as UserInfo),
    onboarding_completed:
      typeof user === 'object' &&
      user !== null &&
      'onboarding_completed' in user
        ? (user as UserInfo).onboarding_completed
        : false,
    profileImage:
      typeof user === 'object' && user !== null && 'profileImage' in user
        ? (user as UserInfo).profileImage
        : undefined,
  };
};

export const AuthProvider = (props: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_TOKEN)
  );
  const [user, setUser] = useState<UserInfo | null>(() =>
    (() => {
      const stored = loadFromStorage<AuthUser>(STORAGE_KEY_USER);
      return stored ? normalizeAuthUser(stored) : null;
    })()
  );

  const setSession = (newToken: string, newUser: AuthUser) => {
    const normalized = normalizeAuthUser(newUser);
    setToken(newToken);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalized));
  };

  const setUserOnly = (newUser: AuthUser) => {
    const normalized = normalizeAuthUser(newUser);
    setToken(null);
    setUser(normalized);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalized));
  };

  const updateUser = (newUser: UserInfo) => {
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
  };

  const logout = () => {
    const currentToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (currentToken) {
      axios
        .post(
          API_ENDPOINTS.logout,
          {},
          { headers: { Authorization: `Bearer ${currentToken}` } }
        )
        .catch(() => {});
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        setSession,
        setUser: setUserOnly,
        updateUser,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
