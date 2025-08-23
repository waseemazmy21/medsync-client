"use client";

import { login as loginService, loginData, register as registerService, registerData, getUser } from "@/services/authService";
import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from '@/lib/types'

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (loginData: loginData) => Promise<void>;
  logout: () => void;
  register: (data: registerData) => Promise<void>;
  setUser: (user: User) => void
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrate, setHydrate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHydrate(true);
  }, [])

  useEffect(() => {
    if (!hydrate) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      getUser()
        .then((res) => setUser(res.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [hydrate]);

  const login = async (data: loginData) => {
    const res = await loginService(data);
    setUser(res.data.user);
  };

  const register = async (data: registerData) => {
    const res = await registerService(data);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

