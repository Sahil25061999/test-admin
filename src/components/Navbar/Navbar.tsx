"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AuraIcon from "../../../public/Aura_Logo_Shine_.png";
import { NAVLINKS } from "../../constants/navbar";
import { NavDropDownItem } from "./NavbarDropDownItem";
import { NavItem } from "./NavItem";
import { LogoutBtn } from "./LogoutBtn";
import { NavbarOpenBtn } from "./NavbarOpenBtn";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import {
  getAuthorizedNavLinks,
  getUserByPhoneNumber,
} from "../../config/authorized-users";
import { NavbarSkeleton } from "./NavbarSkeleton";

export function Navbar() {
  const [displayNav, setNav] = useState(false);
  const [authorizedNavlinks, setAuthorizedNavLinks] = useState<any[]>([]);
  const [unauthorized, setUnauthorized] = useState(true);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const handleToggleNavbar = () => setNav((p) => !p);

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.phone) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }

    const user = getUserByPhoneNumber(session.phone);
    if (!user) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }

    setAuthorizedNavLinks(
      getAuthorizedNavLinks(NAVLINKS, user.permissions)
    );
    setUnauthorized(false);
    setLoading(false);
  }, [session, status]);

  if (loading) return <NavbarSkeleton />;

  if (unauthorized) {
    return (
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r flex items-center justify-center">
        <span className="text-sm font-medium text-red-500">
          Unauthorized Access
        </span>
      </aside>
    );
  }

  return (
    <>
      <NavbarOpenBtn handleToggleNavbar={handleToggleNavbar} />

      {/* Mobile Overlay */}
      {displayNav && (
        <div
          onClick={handleToggleNavbar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64
          bg-white border-r
          transition-transform duration-300 ease-out
          ${displayNav ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">

          {/* ===== Header ===== */}
          <div className="px-5 py-5 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Image src={AuraIcon} alt="Aura" width={28} height={28} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  Aura Gold
                </p>
                <p className="text-xs text-gray-500">
                  Admin Panel
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleNavbar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* ===== Navigation ===== */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {authorizedNavlinks.length === 0 ? (
              <p className="px-3 text-sm text-gray-500">
                No access granted
              </p>
            ) : (
              <ul className="space-y-1">
                {authorizedNavlinks.map((item) =>
                  item.type === "dropdown" ? (
                    <NavDropDownItem
                      key={item.route}
                      item={item}
                      pathname=""
                    />
                  ) : (
                    <NavItem key={item.route} item={item} />
                  )
                )}
              </ul>
            )}
          </nav>

          {/* ===== Footer ===== */}
          <div className="border-t px-4 py-3">
            <LogoutBtn />
          </div>
        </div>
      </aside>
    </>
  );
}
