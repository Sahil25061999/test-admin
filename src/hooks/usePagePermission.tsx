"use client";

import { useSession } from "next-auth/react";

export function usePagePermission(permission: number) {
  const { data } = useSession();
  const phoneNumber = data?.phone;
  return data?.user?.permissions?.includes(permission);
}
