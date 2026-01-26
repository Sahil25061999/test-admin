
"use client";

import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { FREE_NAVLINKS, NAVLINKS } from "../constants/navbar";
import { AUTHORIZED_USERS } from "../config/authorized-users";

export default function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data } = useSession();

  const menu = FREE_NAVLINKS.find((n) => n.href === pathname);
  const user = AUTHORIZED_USERS.find((u) => u.phoneNumber === data?.phone);

  console.log("RouteTracker:", {
    pathname,
    searchParams: searchParams.toString(),
    sessionData: data,
    matchedMenu: menu,
    matchedUser: user,
  });

  if (menu?.permission && user?.permissions.includes(menu.permission)) {
    return true;
  }

  return false;
}
