import { createContext } from 'react';

import type { User } from '../features/user/core/domain/models/User';
import type { UserInfo } from '../features/user/core/domain/models/UserInfo';

export interface AuthContextType {
  token: string | null;
  user: User | UserInfo | null;
  setSession: (token: string, user: User | UserInfo) => void;
  updateUser: (user: User | UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
