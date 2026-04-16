"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { AxiosResponse } from "axios";
import { getMe } from "@/lib/api";

interface User {
  user_id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

const getStoredToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [loading, setLoading] = useState<boolean>(true);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (!token) {
      // No token — not loading, use a ref-based approach to avoid setState in effect
      // We use a microtask to defer setLoading out of the synchronous effect body
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    getMe()
      .then((res: AxiosResponse<User>) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    getMe().then((res: AxiosResponse<User>) => setUser(res.data));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);