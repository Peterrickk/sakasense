"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEMO_PASSWORD, DEMO_USER } from "./data";
import type { User } from "./types";

const AUTH_KEY = "sakasense_auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUser(JSON.parse(raw) as User);
    } catch {
      localStorage.removeItem(AUTH_KEY);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    if (
      email.toLowerCase() === DEMO_USER.email.toLowerCase() &&
      password === DEMO_PASSWORD
    ) {
      setUser(DEMO_USER);
      localStorage.setItem(AUTH_KEY, JSON.stringify(DEMO_USER));
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password. Try the demo account." };
  };

  const register = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 350));
    const newUser: User = {
      ...DEMO_USER,
      id: "user-new",
      name,
      email,
      subscriptionTier: "free",
    };
    setUser(newUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
