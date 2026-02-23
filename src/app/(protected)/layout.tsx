import { Navbar } from "../../components/index.component";
import React, { Suspense } from "react";
import "../../app/globals.css";
import { Loading } from "../../components/loading";
import { requireAuth, requireAuthorization } from "../../lib/server-auth";
import Sidebar from "../../components/ui/Sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  await requireAuthorization();

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar />
      <Sidebar />
      <main className="md:ml-64 flex-1 h-full overflow-y-auto overflow-x-hidden p-4">
        <Suspense fallback={<Loading />}>
          <div className="z-40">{children}</div>
        </Suspense>
      </main>
    </div>
  );
}