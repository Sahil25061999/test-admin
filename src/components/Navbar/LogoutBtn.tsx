'use client';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import React from 'react'
import { signOut } from 'next-auth/react';

export function LogoutBtn() {
  const router = useRouter();

  const handleLogout = () => {
    // localStorage.clear();
    signOut({
      callbackUrl: "/login",
    });
    router.replace("/login");
  };

  return (
    <div
    onClick={handleLogout}
    className={` cursor-pointer px-3 flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group `}
  >
    <PowerIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

    <span className="ms-3">Logout</span>
  </div>
  )
}
