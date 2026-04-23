import { useState } from 'react';

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

const normalizeAuthUser = (user: User | UserInfo): UserInfo => ({
  ...user,
  onboarding_completed:
    'onboarding_completed' in user ? user.onboarding_completed : false,
  profileImage: 'profileImage' in user ? user.profileImage : undefined,
});

export const AuthProvider = (props: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_TOKEN)
  );
  const [user, setUser] = useState<UserInfo | null>(() =>
    (() => {
      const stored = loadFromStorage<User | UserInfo>(STORAGE_KEY_USER);
      return stored ? normalizeAuthUser(stored) : null;
    })()
  );

  const setSession = (newToken: string, newUser: User | UserInfo) => {
    const normalized = normalizeAuthUser(newUser);
    setToken(newToken);
    setUser(normalized);
    localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(normalized));
  };

  const updateUser = (newUser: UserInfo) => {
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
      {props.children}
    </AuthContext.Provider>
  );
};
