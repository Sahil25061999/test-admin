import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/route";
import { isPhoneNumberAuthorized, getUserByPhoneNumber, AUTHORIZED_USERS } from "../config/authorized-users";
import { redirect } from "next/navigation";

export interface CustomSession {
  accessToken?: string;
  refreshToken?: string;
  phone?: string;
}

/**
 * Get the current session on the server side
 */
export async function getCurrentSession(): Promise<CustomSession | null> {
  try {
    const session = await getServerSession(authOptions) as CustomSession | null;
    return session;
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getCurrentSession();
  return !!session?.phone;
}

/**
 * Check if the current user is authorized
 */
export async function isAuthorized(): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session?.phone) return false;
  return isPhoneNumberAuthorized(session.phone);
}

/**
 * Get current user's phone number
 */
export async function getCurrentUserPhone(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.phone || null;
}

/**
 * Get current user's details
 */
export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session?.phone) return null;
  
  return getUserByPhoneNumber(session.phone);
}

/**
 * Require authentication - redirect if not authenticated
 */
export async function requireAuth(redirectTo: string = "/login") {
  const session = await getCurrentSession();
  if (!session?.phone) {
    redirect(redirectTo);
  }
  return session;
}

/**
 * Require authorization - redirect if not authorized
 */
export async function requireAuthorization(redirectTo: string = "/gold-redemption") {
  const session = await getCurrentSession();
  console.log("SESSION getCurrentSession==>", session);
  
  if (!session?.phone) {
    redirect("/login");
  }
  
  if (!isPhoneNumberAuthorized(session.phone)) {
    redirect("/login");
  }
  
  console.log("AUTHORIZED_USERS==>", AUTHORIZED_USERS);
  const user = AUTHORIZED_USERS.find(user => user.phoneNumber === session.phone);
  console.log("USER==>", user);
  
  // If user doesn't have "all" permissions, they can only access limited pages
  if (!user?.permissions.includes("all")) {
    // For users with limited permissions, only allow access to gold-redemption
    // The layout will handle the routing based on the user's permissions
    return session;
  }
  
  // Users with "all" permissions can access everything
  return session;
}

/**
 * Check if user has specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  
  return user.permissions.includes("all") || user.permissions.includes(permission);
}

/**
 * Require specific permission - redirect if not authorized
 */
export async function requirePermission(permission: string, redirectTo: string = "/gold-redemption") {
  const session = await requireAuth();
  
  // if (!await hasPermission(permission)) {
  //   redirect(redirectTo);
  // }
  
  return session;
}

/**
 * Get user role
 */
export async function getUserRole(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.role || null;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

/**
 * Require admin role - redirect if not admin
 */
export async function requireAdmin(redirectTo: string = "/gold-redemption") {
  const session = await requireAuth();
  
  if (!await isAdmin()) {
    redirect(redirectTo);
  }
  
  return session;
} 

/**
 * Check if user has full permissions (can access protected routes)
 */
export async function hasFullPermissions(): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session?.phone || !isPhoneNumberAuthorized(session.phone)) {
    return false;
  }
  
  const user = AUTHORIZED_USERS.find(user => user.phoneNumber === session.phone);
  return user?.permissions.includes("all") || false;
}

/**
 * Require authorization with layout-based routing
 */
export async function requireAuthorizationWithLayout() {
  const session = await getCurrentSession();
  console.log("SESSION getCurrentSession==>", session);
  
  if (!session?.phone) {
    redirect("/login");
  }
  
  if (!isPhoneNumberAuthorized(session.phone)) {
    redirect("/login");
  }
  
  console.log("AUTHORIZED_USERS==>", AUTHORIZED_USERS);
  const user = AUTHORIZED_USERS.find(user => user.phoneNumber === session.phone);
  console.log("USER==>", user);
  
  // If user doesn't have "all" permissions, redirect to limited access
  // if (!user?.permissions.includes("all")) {
  //   redirect("/gold-redemption");
  // }
  
  // Users with "all" permissions can access protected routes
  return session;
}

/**
 * Require authorization for limited access routes
 */
export async function requireLimitedAuthorization() {
  const session = await getCurrentSession();
  console.log("SESSION getCurrentSession==>", session);
  
  if (!session?.phone) {
    redirect("/login");
  }
  
  if (!isPhoneNumberAuthorized(session.phone)) {
    redirect("/login");
  }
  
  console.log("AUTHORIZED_USERS==>", AUTHORIZED_USERS);
  const user = AUTHORIZED_USERS.find(user => user.phoneNumber === session.phone);
  console.log("USER==>", user);
  
  // Allow access to limited routes for all authorized users
  return session;
} 