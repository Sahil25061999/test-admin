# Phone Number API Access Restriction

## Overview

This feature restricts API access to only specific phone numbers that are authorized to use the admin panel. This provides an additional layer of security beyond authentication.

## How It Works

### 1. Middleware Check
The middleware (`src/middleware.ts`) intercepts all API requests and:
- Extracts the phone number from the user's session token
- Checks if the phone number is in the authorized list
- Blocks access if the phone number is not authorized
- Logs all access attempts for monitoring

### 2. Authorized Users Configuration
Authorized users are managed in `src/config/authorized-users.ts`:

```typescript
export const AUTHORIZED_USERS: AuthorizedUser[] = [
  {
    phoneNumber: "9876543210",
    name: "Admin User",
    role: "admin",
    permissions: ["all"],
  },
  {
    phoneNumber: "9876543211", 
    name: "Manager User",
    role: "manager",
    permissions: ["users", "transactions", "redemption"],
  },
  // Add more users here
];
```

### 3. User Roles and Permissions

#### Admin Role
- Full access to all features
- Can manage authorized users
- Can view all data and reports

#### Manager Role
- Access to users, transactions, and redemption
- Cannot manage authorized users
- Limited administrative access

#### Operator Role
- Access to transactions and redemption only
- No administrative functions
- Basic operational access

## API Endpoints

### Protected Endpoints
All API endpoints except `/api/auth/*` require an authorized phone number:

- `/api/users` - User management
- `/api/transactions` - Transaction operations
- `/api/redemption` - Redemption operations
- `/api/deposit` - Deposit operations
- `/api/data` - Data operations
- `/api/discount` - Discount operations
- `/api/invoices` - Invoice operations
- `/api/upis` - UPI operations

### Admin Endpoints
- `/api/admin/authorized-users` - Manage authorized users

## Managing Authorized Users

### Adding a New User
```bash
curl -X POST /api/admin/authorized-users \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543213",
    "name": "New User",
    "role": "operator",
    "permissions": ["transactions", "redemption"]
  }'
```

### Removing a User
```bash
curl -X DELETE /api/admin/authorized-users?phoneNumber=9876543213
```

### Listing All Users
```bash
curl -X GET /api/admin/authorized-users
```

## Error Responses

### Unauthorized Access (401)
```json
{
  "success": false,
  "message": "Unauthorized - No token provided"
}
```

### Access Denied (403)
```json
{
  "success": false,
  "message": "Access denied - Phone number not authorized for API access"
}
```

## Monitoring and Logging

### Access Logs
The middleware logs all API access attempts:
- Successful access: `Authorized API access by phone number: 9876543210 to /api/users`
- Failed access: `Unauthorized API access attempt by phone number: 1234567890`

### Last Access Tracking
Each authorized user's last access time is automatically updated when they make API requests.

## Security Features

1. **Token Validation**: Ensures valid authentication before checking phone number
2. **Phone Number Verification**: Only allows access to pre-authorized numbers
3. **Role-Based Permissions**: Different access levels based on user role
4. **Access Logging**: Tracks all access attempts for security monitoring
5. **Admin Protection**: Only admin users can manage the authorized user list

## Configuration

### Environment Variables
Make sure these are set in your `.env.local`:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Adding New Authorized Users
1. Edit `src/config/authorized-users.ts`
2. Add the new user to the `AUTHORIZED_USERS` array
3. Restart the development server (or deploy to production)

### Production Deployment
For production, consider:
- Storing authorized users in a database
- Implementing dynamic user management
- Adding audit trails for user changes
- Setting up alerts for unauthorized access attempts

## Testing

### Test Authorized Access
```bash
# Login with an authorized phone number
curl -X POST /api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"countryCode": "91", "phone": "9876543210"}'
```

### Test Unauthorized Access
```bash
# Try to access API with unauthorized phone number
curl -X GET /api/users \
  -H "Authorization: Bearer your-token"
# Should return 403 Forbidden
```

## Troubleshooting

### Common Issues

1. **"Unauthorized - No token provided"**
   - User is not logged in
   - Session token is missing or expired

2. **"Access denied - Phone number not authorized"**
   - Phone number not in authorized list
   - Add phone number to `AUTHORIZED_USERS` array

3. **"Internal server error"**
   - Check server logs for detailed error
   - Verify environment variables are set

### Debug Mode
Enable debug logging by adding to middleware:
```typescript
console.log('Token:', token);
console.log('Phone number:', phoneNumber);
console.log('Authorized:', isPhoneNumberAuthorized(phoneNumber));
```

## Best Practices

1. **Regular Review**: Periodically review the authorized user list
2. **Role Principle**: Assign minimum required permissions
3. **Monitoring**: Set up alerts for unauthorized access attempts
4. **Backup**: Keep a backup of authorized user configurations
5. **Documentation**: Document all authorized users and their roles

## Future Enhancements

- Database storage for authorized users
- Dynamic user management interface
- Advanced permission system
- Audit trail for all access attempts
- Integration with external identity providers 