"use client";

import { BloodType, Gender } from "@/lib/types";
import { login as loginService, loginData, register as registerService, registerData } from "@/services/authService";
import api from "@/services/axios-instance";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import Cookies from "js-cookie";

type User = {
  _id: string;
  name: string;
  email: string;
  role:string;
  image?: string;
  phone: string;
  gender: Gender;
  birthDate: Date;
  bloodType: BloodType;
  allergies: string[]
};

type AuthContextType = {
  user: User | null;
  login: (loginData: loginData) => Promise<void>;
  logout: () => void;
  register: (data: registerData) => Promise<void>; 
  setUser: (user: User) => void
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // const [loading, setLoading] = useState(true);

  // محاولة جلب المستخدم عند التحميل (إذا فيه توكن)
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     getUser()
  //       .then((res) => setUser(res.data))
  //       .catch(() => setUser(null))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  // }, []);

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
    <AuthContext.Provider value={{ user, login, logout, register ,setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
