import { createContext } from 'react';

import type { User } from '../features/user/core/domain/models/User';
import type { UserInfo } from '../shared/core/domain/models/UserInfo';

export type AuthUser = User | UserInfo;

export interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  setSession: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  updateUser: (user: UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
