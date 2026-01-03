"use client";

import { setAuthHandlers } from "@/services/authServices";
import { useState, ReactNode, useEffect } from "react";
import { createContext } from "react";

interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  token: Token | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokenObj: Token) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<Token | null>(null);

  useEffect(() => {
    try {
      const tokenData = localStorage.getItem("token");
      if (tokenData) {
        setToken(JSON.parse(tokenData));
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);
  const login = (tokenObj: Token) => {
    localStorage.setItem("token", JSON.stringify(tokenObj));
    setToken(tokenObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    setAuthHandlers({ login, logout });
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, isLoading, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
