"use client"
import Image from "next/image";
import { LoginForm } from "../../components/loginForm";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  // const [loading,setLoading] = useState(true)
  
  return (
    <div className="flex h-screen flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image className="mx-auto" height={80} width={80} src="/aura-logo-dark.svg" alt="aura-logo" />

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Sign in to your account</h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
