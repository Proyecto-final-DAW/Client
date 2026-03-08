import { createContext } from 'react';

import type { UserInfo } from '../features/user/core/domain/models/UserInfo';

export interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  setSession: (token: string, user: UserInfo) => void;
  updateUser: (user: UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
