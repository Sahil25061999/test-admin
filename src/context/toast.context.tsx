"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface ToastContent {
  title: string;
  description: string;
  variant: "neutral" | "success" | "error" | "warning";
  display: boolean;
}

interface ToastContextType {
  toast: (options: Partial<ToastContent>) => void;
  content: ToastContent;
}

const initialState: ToastContent = {
  title: "",
  description: "",
  variant: "neutral",
  display: false,
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [content, setContent] = useState<ToastContent>(initialState);

  const toast = ({
    title = "",
    description = "",
    variant = "neutral",
    display = true,
  }: Partial<ToastContent>) => {
    setContent({
      title,
      description,
      variant,
      display,
    });
  };

  useEffect(() => {
    if (content.display) {
      const timer = setTimeout(() => {
        setContent(initialState);
      }, 1000 * 3);
      
      return () => clearTimeout(timer);
    }
  }, [content.display]);

  return (
    <ToastContext.Provider value={{ toast, content }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
