"use client";
import { createContext, useContext, useLayoutEffect, useState } from "react";
import { CHRYSUS_API, refreshInstance } from "../config";

interface AuthContextType {
  token: string;
  setToken: (token: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  refreshToken: string;
  setRefreshToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [phone, setPhone] = useState("");

  useLayoutEffect(() => {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const phone = localStorage.getItem("phone");
    
    if (token) {
      setToken(token);
      setRefreshToken(refreshToken || "");
      CHRYSUS_API.defaults.headers.common.Authorization = "Bearer " + token;
      refreshInstance.defaults.headers.common.Authorization = "Bearer " + (refreshToken || "");
    }
    if (phone) {
      setPhone(phone);
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <AuthContext.Provider value={{ token, setToken, phone, setPhone, refreshToken, setRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
