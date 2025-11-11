import { requirePermission, requireAdmin, getCurrentUser } from "../../lib/server-auth";
import { ReactNode } from "react";

interface AuthWrapperProps {
  children: ReactNode;
  permission?: string;
  requireAdminRole?: boolean;
  fallback?: ReactNode;
}

/**
 * Server-side component wrapper for pages that need specific permissions
 */
export async function AuthWrapper({ 
  children, 
  permission, 
  requireAdminRole = false,
  fallback 
}: AuthWrapperProps) {
  try {
    if (requireAdminRole) {
      await requireAdmin();
    } else if (permission) {
      await requirePermission(permission);
    } else {
      await requirePermission("all");
    }

    return <>{children}</>;
  } catch (error) {
    // If authorization fails, show fallback or redirect
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Default fallback - redirect will be handled by requirePermission
    return null;
  }
}

/**
 * Server-side component wrapper for admin-only pages
 */
export async function AdminWrapper({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AuthWrapper requireAdminRole fallback={fallback}>
      {children}
    </AuthWrapper>
  );
}

/**
 * Server-side component wrapper for pages that need user permission
 */
export async function UserPermissionWrapper({ 
  children, 
  permission, 
  fallback 
}: { 
  children: ReactNode; 
  permission: string; 
  fallback?: ReactNode 
}) {
  return (
    <AuthWrapper permission={permission} fallback={fallback}>
      {children}
    </AuthWrapper>
  );
}

/**
 * Server-side component that shows user info
 */
export async function UserInfo() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">User Information</h3>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phoneNumber}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Permissions:</strong> {user.permissions.join(", ")}</p>
        {user.lastAccess && (
          <p><strong>Last Access:</strong> {new Date(user.lastAccess).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
} 