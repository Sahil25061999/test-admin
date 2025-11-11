import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { 
  isPhoneNumberAuthorized, 
  getUserByPhoneNumber, 
  updateLastAccess,
  hasPermission,
  AUTHORIZED_USERS
} from "./config/authorized-users";

// Define which routes belong to which layout
const PROTECTED_ROUTES = [
  '/dashboard',
  '/users',
  '/mandate',
  '/update',
  '/settings',
  '/gold',
  '/silver',
  '/block',
  '/admin-only'
];

const LIMITED_ACCESS_ROUTES = [
  '/gold-redemption',
  '/silver-redemption'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the request is for API routes
  if (pathname.startsWith("/api/")) {
    // Skip phone number check for auth endpoints
    if (pathname.startsWith("/api/auth/")) {
      return NextResponse.next();
    }

    try {
      // Get the session token
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Something went wrong" },
          { status: 401 }
        );
      }

      // Extract phone number from token
      const phoneNumber = token.phone as string;
      
      if (!phoneNumber) {
        return NextResponse.json(
          { success: false, message: "Something went wrong" },
          { status: 401 }
        );
      }

      // Check if phone number is authorized
      if (!isPhoneNumberAuthorized(phoneNumber)) {
        return NextResponse.json(
          { 
            success: false, 
            message: "Something went wrong" 
          },
          { status: 403 }
        );
      }

      // Update last access time
      updateLastAccess(phoneNumber);

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // Handle page-level authorization routing
  const isLimitedAccessRoute = LIMITED_ACCESS_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/')) && !isLimitedAccessRoute;
  
  if (isProtectedRoute || isLimitedAccessRoute) {
    
    try {
      // Get the session token
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });

      if (!token?.phone) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const phoneNumber = token.phone as string;
      
      if (!isPhoneNumberAuthorized(phoneNumber)) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Check user permissions
      const user = AUTHORIZED_USERS.find(user => user.phoneNumber === phoneNumber);
      const hasFullPermissions = user?.permissions.includes("all") || false;
      

      // If user is trying to access protected routes but doesn't have full permissions
      if (isProtectedRoute && !hasFullPermissions) {
        return NextResponse.redirect(new URL("/gold-redemption", request.url));
      }

      // Update last access time
      updateLastAccess(phoneNumber);

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware page routing error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For other routes, continue with normal flow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 