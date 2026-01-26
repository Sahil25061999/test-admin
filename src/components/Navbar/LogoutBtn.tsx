"use client";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import React from "react";
import { signOut } from "next-auth/react";

export function LogoutBtn() {
  const router = useRouter();

  const handleLogout = () => {
    signOut({
      callbackUrl: "/login",
    });
    router.replace("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 group"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-500 transition-colors group-hover:text-gray-900" />
      <span className="text-sm font-medium">Logout</span>
    </button>
  );
}