# Server-Side Authentication System

## Overview

The application now uses server-side authentication and authorization checks, providing better security, performance, and user experience compared to client-side checks.

## Key Benefits

### 🔒 **Enhanced Security**
- Authentication checks happen on the server before page loads
- No client-side token exposure
- Immediate redirects for unauthorized access
- No flashing content or temporary unauthorized states

### ⚡ **Better Performance**
- No client-side authentication checks
- Faster page loads
- Reduced JavaScript bundle size
- Server-side rendering with proper authentication

### 🎯 **Improved User Experience**
- No client-side redirects
- Immediate access control
- Clean URL handling
- SEO-friendly pages

## Architecture

### Before (Client-Side)
```
Client Request → Page Loads → Client Checks Auth → Redirect (if needed)
```

### After (Server-Side)
```
Client Request → Server Checks Auth → Page Loads (if authorized) or Redirect
```

## Implementation

### 1. Server-Side Utilities (`src/lib/server-auth.ts`)

```typescript
// Get current session
const session = await getCurrentSession();

// Check if user is authenticated
const isAuth = await isAuthenticated();

// Check if user is authorized
const isAuthz = await isAuthorized();

// Require authentication
await requireAuth();

// Require authorization
await requireAuthorization();

// Check specific permissions
const hasPerm = await hasPermission("users");

// Require admin role
await requireAdmin();
```

### 2. Layout Protection

Both protected layouts now use server-side authentication:

```typescript
// src/app/(protected)/layout.tsx
export default async function Layout({ children }) {
  await requireAuthorization(); // Server-side check
  return <>{children}</>;
}
```

### 3. Page-Level Protection

Individual pages can require specific permissions:

```typescript
// Admin-only page
export default async function AdminPage() {
  await requireAdmin();
  return <div>Admin content</div>;
}

// Permission-specific page
export default async function UserManagementPage() {
  await requirePermission("users");
  return <div>User management content</div>;
}
```

## Usage Examples

### Basic Authentication Check

```typescript
import { requireAuthorization } from "../../lib/server-auth";

export default async function ProtectedPage() {
  await requireAuthorization();
  
  return <div>Protected content</div>;
}
```

### Admin-Only Pages

```typescript
import { requireAdmin } from "../../lib/server-auth";

export default async function AdminPage() {
  await requireAdmin();
  
  return <div>Admin-only content</div>;
}
```

### Permission-Based Access

```typescript
import { requirePermission } from "../../lib/server-auth";

export default async function TransactionPage() {
  await requirePermission("transactions");
  
  return <div>Transaction management</div>;
}
```

### Getting User Information

```typescript
import { getCurrentUser } from "../../lib/server-auth";

export default async function UserProfilePage() {
  const user = await getCurrentUser();
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <p>Permissions: {user?.permissions.join(", ")}</p>
    </div>
  );
}
```

## Error Handling

### Automatic Redirects
- Unauthenticated users → `/login`
- Unauthorized users → `/gold-redemption`
- Insufficient permissions → `/gold-redemption`

### Custom Redirects
```typescript
await requireAuth("/custom-login");
await requireAuthorization("/custom-unauthorized");
await requirePermission("admin", "/custom-admin");
```

## Security Features

### 1. **Server-Side Session Validation**
- All session checks happen on the server
- No client-side token manipulation
- Secure session handling

### 2. **Phone Number Authorization**
- Only authorized phone numbers can access the application
- Automatic blocking of unauthorized users
- Logging of all access attempts

### 3. **Role-Based Access Control**
- Admin, Manager, Operator roles
- Granular permission system
- Permission-based page access

### 4. **Automatic Redirects**
- Immediate redirects for unauthorized access
- No client-side authentication delays
- Clean URL handling

## Performance Benefits

### 1. **Reduced Client-Side Code**
- No client-side authentication logic
- Smaller JavaScript bundles
- Faster initial page loads

### 2. **Server-Side Rendering**
- Pages render with proper authentication state
- SEO-friendly content
- Better Core Web Vitals

### 3. **Immediate Access Control**
- No client-side redirects
- No flashing unauthorized content
- Better user experience

## Migration from Client-Side

### Before (Client-Side Layout)
```typescript
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.phone) {
      if (!authorizedNumbers.includes(session.phone)) {
        router.replace("/gold-redemption");
      }
    }
  }, [session]);

  return <>{children}</>;
}
```

### After (Server-Side Layout)
```typescript
import { requireAuthorization } from "../../lib/server-auth";

export default async function Layout({ children }) {
  await requireAuthorization();
  return <>{children}</>;
}
```

## Best Practices

### 1. **Use Server-Side Checks**
- Always use server-side authentication for protected routes
- Avoid client-side authentication checks
- Use `requireAuthorization()` in layouts

### 2. **Specific Permissions**
- Use `requirePermission()` for specific features
- Use `requireAdmin()` for admin-only content
- Avoid overly broad permissions

### 3. **Error Handling**
- Provide meaningful error messages
- Use appropriate redirect destinations
- Log authentication failures

### 4. **Performance**
- Keep authentication checks minimal
- Cache user information when appropriate
- Use efficient permission checks

## Troubleshooting

### Common Issues

1. **"Cannot use 'use client' in Server Component"**
   - Remove `"use client"` directive
   - Use server-side authentication utilities

2. **"Session is undefined"**
   - Check NextAuth configuration
   - Verify session handling in authOptions

3. **"Permission denied"**
   - Check user permissions in authorized-users.ts
   - Verify phone number is in authorized list

4. **"Redirect not working"**
   - Ensure redirect is called in server component
   - Check redirect destination exists

### Debug Mode

Enable debug logging in server-auth.ts:
```typescript
console.log("Session:", session);
console.log("User:", user);
console.log("Permissions:", permissions);
```

## Future Enhancements

1. **Database Integration**
   - Store authorized users in database
   - Dynamic user management
   - Audit trails

2. **Advanced Permissions**
   - Resource-level permissions
   - Time-based access
   - IP-based restrictions

3. **Caching**
   - Session caching
   - Permission caching
   - User data caching

4. **Monitoring**
   - Authentication metrics
   - Access pattern analysis
   - Security alerts 