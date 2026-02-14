import { createContext } from 'react';

import type { UserInfo } from '../features/user/core/domain/models/UserInfo';

export interface AuthContextType {
  token: string | null;
  user: UserInfo | null;
  /** Saves the session with the token and user returned by the API (after login or register with auto-login). */
  setSession: (token: string, user: UserInfo) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
