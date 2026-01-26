import { Navbar } from "../../components/index.component";
import React, { Suspense } from "react";
import "../../app/globals.css";
import { Loading } from "../../components/loading";
import { requireAuth, requireAuthorization } from "../../lib/server-auth";
import Sidebar from "../../components/ui/Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // Server-side authorization check - middleware handles routing
  await requireAuth();
  await requireAuthorization();





  return (
    <div className="p-4 flex flex-col gap-6 md:flex-row overflow-hidden">
      <Navbar />
      <main className="relative md:ml-64 w-full min-h-screen ">
        <Suspense fallback={<Loading />}>
          <div className="z-40">{children}</div>
        </Suspense>
        <Sidebar />
      </main>
    </div>
  );
}
