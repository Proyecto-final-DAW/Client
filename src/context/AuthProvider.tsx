import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode; }) => {
   const [token, setToken] = useState<string | null>(null);
   const [user, setUser] = useState<User | null>(null);

   const login = (newToken: string, newUser: User) => {
      setToken(newToken);
      setUser(newUser);
   };

   const register = (newToken: string, newUser: User) => {
      setToken(newToken);
      setUser(newUser);
   };

   const logout = () => {
      setToken(null);
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ token, user, login, register, logout }}>
         {children}
      </AuthContext.Provider>
   );
};