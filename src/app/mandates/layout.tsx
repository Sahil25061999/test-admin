"use client";
import { Navbar } from "../../components/index.component";
import React, { Suspense } from "react";
import "../../app/globals.css";
import style from "./layout.module.css";
// import { NavWidthProvider, useNavWidth } from '@/context/NavWidthContext';
import { Loading } from "../../components/index.component";

export default function Layout({ children }) {
  return (
    <div className="p-4 flex gap-6">
      <Navbar />
      <main className=" w-full pt-2">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
}
