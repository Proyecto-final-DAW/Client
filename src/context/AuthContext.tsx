import { createContext } from "react";

export interface User {
   id: number;
   email: string;
}

export interface AuthContextType {
   token: string | null;
   user: User | null;
   login: (token: string, user: User) => void;
   register: (token: string, user: User) => void;
   logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);