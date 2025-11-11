"use client";

import { Toast } from "./toast";
import { ToastProvider } from "../context/toast.context";
import { NavWidthProvider } from "../context/navbar.context";
import { AuthProvider } from "../context/auth";
import { BulkTxnProvider } from "../context/bulkTxn.context";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ToastProvider>
          <BulkTxnProvider>
            <ConfigProvider>
              {children}
            </ConfigProvider>
          </BulkTxnProvider>
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </SessionProvider>
  );
} 