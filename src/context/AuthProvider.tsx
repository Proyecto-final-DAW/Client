import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { UserInfo } from "../features/user/core/domain/models/UserInfo";

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
   const [token, setToken] = useState<string | null>(null);
   const [user, setUser] = useState<UserInfo | null>(null);

   const setSession = (newToken: string, newUser: UserInfo) => {
      setToken(newToken);
      setUser(newUser);
   };

   const logout = () => {
      setToken(null);
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ token, user, setSession, logout }}>
         {children}
      </AuthContext.Provider>
   );
};