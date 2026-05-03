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

/**
 * Returns false if the JWT is missing, malformed, or expired (with a small
 * skew so a token expiring "now" is treated as expired). Local-only check —
 * the server still validates the signature on every request; this just
 * avoids booting the app in a "logged in" state with a token that will be
 * rejected on the first network call.
 */
const SKEW_MS = 5_000;
const isJwtUsable = (token: string | null): boolean => {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    // Base64url → base64 → JSON.
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    if (typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 > Date.now() + SKEW_MS;
  } catch {
    return false;
  }
};

const loadInitialToken = (): string | null => {
  const stored = localStorage.getItem(STORAGE_KEY_TOKEN);
  if (isJwtUsable(stored)) return stored;
  // Stale token: clear it so the next render doesn't try to use it.
  if (stored !== null) {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }
  return null;
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
  const [token, setToken] = useState<string | null>(loadInitialToken);
  const [user, setUser] = useState<UserInfo | null>(() => {
    // Only surface a stored user if there's a usable token — otherwise the
    // app would boot showing the user as logged in without auth.
    if (!loadInitialToken()) return null;
    const stored = loadFromStorage<AuthUser>(STORAGE_KEY_USER);
    return stored ? normalizeAuthUser(stored) : null;
  });

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
