// src/context/AuthContext.tsx
import { createContext } from 'react';
import type { User } from 'firebase/auth'; 

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;  // thêm loading state
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);