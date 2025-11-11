# API Migration Guide: Client-Side to Server-Side

This document outlines the migration of API calls from client-side to server-side in the Aura Admin Panel.

## Overview

The application has been migrated from making direct external API calls on the client-side to using server-side API routes that proxy requests to external services. This improves security, performance, and maintainability.

## Architecture Changes

### Before (Client-Side)
```
Client Component → axios instance → External API
```

### After (Server-Side)
```
Client Component → fetch() → Next.js API Route → External API
```

## New Server-Side API Routes

### 1. Authentication
- **Route**: `/api/auth/send-otp`
- **Method**: POST
- **Purpose**: Send OTP to user's phone
- **Client Usage**: 
```javascript
const response = await fetch('/api/auth/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ countryCode, phone })
});
```

### 2. Users
- **Route**: `/api/users`
- **Method**: GET
- **Purpose**: Fetch user list with filters
- **Client Usage**:
```javascript
const params = { name, phone, page, limit, status };
const searchParams = new URLSearchParams(params);
const response = await fetch(`/api/users?${searchParams.toString()}`);
```

### 3. User Details
- **Route**: `/api/user/[phone]`
- **Method**: GET
- **Purpose**: Fetch user profile, wallet, transactions
- **Client Usage**:
```javascript
const response = await fetch(`/api/user/${phone}?type=profile`);
```

### 4. Transactions
- **Route**: `/api/transactions`
- **Method**: GET
- **Purpose**: Fetch transaction list with filters
- **Client Usage**:
```javascript
const params = { url, txn_type, offset, limit, startdate, enddate };
const searchParams = new URLSearchParams(params);
const response = await fetch(`/api/transactions?${searchParams.toString()}`);
```

### 5. Redemption Operations
- **Route**: `/api/redemption`
- **Method**: GET
- **Purpose**: Execute, cancel, or process redemption transactions
- **Client Usage**:
```javascript
const params = { action: 'execute', product_name, txn_id, new_status, notes };
const searchParams = new URLSearchParams(params);
const response = await fetch(`/api/redemption?${searchParams.toString()}`);
```

### 6. Deposits
- **Route**: `/api/deposit`
- **Method**: POST
- **Purpose**: Deposit gold or silver
- **Client Usage**:
```javascript
const response = await fetch('/api/deposit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount, phone, notes, type: 'gold' })
});
```

### 7. Data Operations
- **Route**: `/api/data`
- **Method**: GET
- **Purpose**: Get prices and conversion data
- **Client Usage**:
```javascript
const params = { action: 'prices', product: '24KGOLD' };
const searchParams = new URLSearchParams(params);
const response = await fetch(`/api/data?${searchParams.toString()}`);
```

### 8. Discounts
- **Route**: `/api/discount`
- **Method**: POST
- **Purpose**: Create offers and vouchers
- **Client Usage**:
```javascript
const response = await fetch('/api/discount', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'offer', ...data })
});
```

### 9. Invoices
- **Route**: `/api/invoices/[txnid]`
- **Method**: GET
- **Purpose**: Download invoice for transaction
- **Client Usage**:
```javascript
const response = await fetch(`/api/invoices/${txnid}`);
```

## Utility Functions

### Server-Side Utilities (`src/lib/api-utils.ts`)
- `createAuthenticatedApi()`: Creates authenticated axios instance
- `handleApiError()`: Standardized error handling
- `encryptToken()`: Token encryption for external API

### Client-Side Utilities (`src/lib/client-api.ts`)
- `clientApi`: Centralized client-side API functions
- Replaces direct axios calls with fetch to server routes

## Migration Steps for Components

### 1. Replace axios imports
```javascript
// Before
import { useAuthAxios } from "../hooks/useAuthAxios";
const apiInstance = useAuthAxios();

// After
import { clientApi } from "../lib/client-api";
```

### 2. Replace API calls
```javascript
// Before
const res = await apiInstance.get("admin/v1/users", { params });

// After
const res = await fetch("/api/users?" + new URLSearchParams(params));
const data = await res.json();
```

### 3. Update error handling
```javascript
// Before
if (e?.response?.data?.message) {
  toast({ description: e.response.data.message });
}

// After
if (data?.success === false) {
  toast({ description: data.message });
}
```

## Benefits

### Security
- API keys and tokens are no longer exposed to the client
- Authentication is handled server-side
- Request validation and sanitization

### Performance
- Reduced client-side bundle size
- Server-side caching opportunities
- Better error handling and retry logic

### Maintainability
- Centralized API logic
- Easier to implement rate limiting
- Consistent error handling
- Better debugging capabilities

## Environment Variables

Ensure these environment variables are set:
```env
NEXT_PUBLIC_CHRYSUS_URI=https://your-api-endpoint.com/
NEXTAUTH_SECRET=your-nextauth-secret
```

## Authentication Flow

1. User logs in via NextAuth
2. Session contains access token
3. Server-side API routes use session token
4. External API calls are authenticated server-side

## Error Handling

All server-side routes include:
- Authentication checks
- Standardized error responses
- Proper HTTP status codes
- Detailed error logging

## Testing

To test the migration:
1. Ensure all environment variables are set
2. Test authentication flow
3. Verify all API endpoints work
4. Check error handling
5. Test with different user roles

## Rollback Plan

If issues arise:
1. Keep old client-side code commented
2. Use feature flags to switch between old/new
3. Monitor error rates and performance
4. Have fallback mechanisms ready

## Next Steps

1. Complete migration of remaining components
2. Add comprehensive error handling
3. Implement caching strategies
4. Add rate limiting
5. Set up monitoring and logging
6. Performance optimization 