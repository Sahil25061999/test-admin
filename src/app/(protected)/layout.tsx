import { Navbar } from "../../components/index.component";
import React, { Suspense } from "react";
import "../../app/globals.css";
import { Loading } from "../../components/loading";
import { requireAuth } from "../../lib/server-auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Server-side authorization check - middleware handles routing
  await requireAuth();

  return (
    <div className="p-4 flex flex-col gap-6 md:flex-row overflow-hidden">
      <Navbar />
      <main className="relative p-4 md:ml-64 w-full min-h-screen bg-purple-100 rounded-3xl overflow-hidden">
        <Suspense fallback={<Loading />}>
          <div className="z-40">{children}</div>
        </Suspense>
      </main>
    </div>
  );
}
