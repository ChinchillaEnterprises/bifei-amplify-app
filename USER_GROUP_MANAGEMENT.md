# User Group Management Guide

## Overview
The Golden Dragon Restaurant app now has three user groups with different access levels:

### 1. **Customer** (Default)
- Can make reservations
- Can order food for delivery
- Can view menu
- Basic app functions

### 2. **Restaurant Host**
- All customer permissions PLUS:
- Check and manage reservations
- View and update order status
- View member information
- Access to Host Dashboard at `/admin/host`

### 3. **Maintenance** (Admin)
- Full system access including:
- User management
- Menu management
- Database operations
- System logs
- Access to all dashboards

## How to Assign User Groups

### Option 1: AWS Console (Manual)
1. Go to AWS Cognito Console
2. Find your User Pool (created by Amplify)
3. Go to "Users and groups" → "Groups"
4. Create groups if not exists: `customer`, `restaurantHost`, `maintenance`
5. Go to "Users" tab
6. Select a user
7. Click "Add to group"
8. Select the appropriate group

### Option 2: AWS CLI Commands
```bash
# Add user to restaurant host group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id YOUR_USER_POOL_ID \
  --username USER_EMAIL \
  --group-name restaurantHost

# Add user to maintenance group
aws cognito-idp admin-add-user-to-group \
  --user-pool-id YOUR_USER_POOL_ID \
  --username USER_EMAIL \
  --group-name maintenance

# Remove user from group
aws cognito-idp admin-remove-user-from-group \
  --user-pool-id YOUR_USER_POOL_ID \
  --username USER_EMAIL \
  --group-name GROUP_NAME
```

### Option 3: Programmatic (Lambda Trigger)
You can create a Post Confirmation Lambda trigger that automatically assigns users to groups based on their email domain or other criteria.

Example: Users with @restaurant.com email become restaurant hosts:

```javascript
exports.handler = async (event) => {
  const email = event.request.userAttributes.email;
  
  if (email.endsWith('@restaurant.com')) {
    // Add to restaurantHost group
    const params = {
      GroupName: 'restaurantHost',
      UserPoolId: event.userPoolId,
      Username: event.userName
    };
    await cognito.adminAddUserToGroup(params).promise();
  } else {
    // Add to customer group by default
    const params = {
      GroupName: 'customer',
      UserPoolId: event.userPoolId,
      Username: event.userName
    };
    await cognito.adminAddUserToGroup(params).promise();
  }
  
  return event;
};
```

## Testing Different Roles

### Test Accounts Setup
1. Create test accounts for each role:
   - customer@test.com → Customer group
   - host@test.com → Restaurant Host group
   - admin@test.com → Maintenance group

2. Assign groups using AWS Console or CLI

3. Login with each account to test permissions

## Permissions Matrix

| Feature | Customer | Restaurant Host | Maintenance |
|---------|----------|-----------------|-------------|
| View Menu | ✅ | ✅ | ✅ |
| Make Reservation | ✅ | ✅ | ✅ |
| Order Delivery | ✅ | ✅ | ✅ |
| View Own Orders | ✅ | ✅ | ✅ |
| Manage All Reservations | ❌ | ✅ | ✅ |
| Update Order Status | ❌ | ✅ | ✅ |
| View All Members | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Menu Management | ❌ | ❌ | ✅ |
| Database Operations | ❌ | ❌ | ✅ |
| System Logs | ❌ | ❌ | ✅ |

## Security Notes
- Groups are stored in JWT tokens after authentication
- Permissions are enforced both client-side (UI) and server-side (API)
- Always validate permissions on the backend
- Regular users cannot elevate their own permissions

## Dashboard URLs
- Customer: Main app at `/`
- Restaurant Host: `/admin/host`
- Maintenance: `/admin/maintenance`

## Implementation Details
- Groups are defined in `/amplify/auth/resource.ts`
- Data access rules in `/amplify/data/resource.ts`
- Auth context with group checking in `/app/providers/AuthProvider.tsx`
- Role-based navigation in `/app/components/Navigation.tsx`