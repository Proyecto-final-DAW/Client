import { useState } from 'react';
import type { ReactNode } from 'react';

import type { UserInfo } from '../features/user/core/domain/models/UserInfo';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  const setSession = (newToken: string, newUser: UserInfo) => {
    setToken(newToken);
    setUser(newUser);
  };

  const updateUser = (newUser: UserInfo) => {
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setSession, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
