"use client";
import Image from "next/image";
import { LoginForm } from "../../components/loginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gradient-to-br from-amber-50 via-white to-yellow-50 px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Image
          className="mx-auto drop-shadow-md"
          height={80}
          width={80}
          src="/aura-logo-dark.svg"
          alt="Aura logo"
          priority
        />
        <p className="mt-4 text-xs font-semibold tracking-widest text-amber-600 uppercase">
          The real aura only comes from gold
        </p>
        <h2 className="mt-10 text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}