import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  isPhoneNumberAuthorized,
  updateLastAccess,
  AUTHORIZED_USERS,
} from "./config/authorized-users";
import { FREE_NAVLINKS } from "./constants/navbar";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/users",
  "/mandate",
  "/update",
  "/settings",
  "/gold",
  "/silver",
  "/block",
  "/admin-only",
];

export async function middleware(request: NextRequest) {
  console.log("API________HITTTTTT")
  const { pathname } = request.nextUrl;

  /* ================= API ROUTES ================= */
  if (pathname.startsWith("/api/")) {
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.phone) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isPhoneNumberAuthorized(token.phone as string)) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    updateLastAccess(token.phone as string);
    return NextResponse.next();
  }

  /* ================= PAGE ROUTES ================= */
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.phone) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const phoneNumber = token.phone as string;

    if (!isPhoneNumberAuthorized(phoneNumber)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const user = AUTHORIZED_USERS.find(
      (u) => u.phoneNumber === phoneNumber
    );

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }




    const menu = FREE_NAVLINKS.find(n => n.href === pathname);


    if (menu?.permission && !user?.permissions.includes(menu.permission)) {
      return NextResponse.redirect(new URL("/unauthorised", request.url));
    }

    return NextResponse.next();

  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
