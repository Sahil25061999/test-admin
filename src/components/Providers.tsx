"use client";

import { Toast } from "./toast";
import { ToastProvider } from "../context/toast.context";
import { NavWidthProvider } from "../context/navbar.context";
import { AuthProvider } from "../context/auth";
import { BulkTxnProvider } from "../context/bulkTxn.context";
import { SessionProvider } from "next-auth/react";
import { ConfigProvider } from "antd";
import AppContextProvider from "../context/app";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <AppContextProvider>
          <ToastProvider>
            <BulkTxnProvider>
              <ConfigProvider>
                {children}
              </ConfigProvider>
            </BulkTxnProvider>
            <Toast />
          </ToastProvider>
        </AppContextProvider>
      </AuthProvider>
    </SessionProvider>
  );
}