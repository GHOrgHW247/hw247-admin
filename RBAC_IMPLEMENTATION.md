# Role-Based Access Control (RBAC) Implementation Guide

## Overview

The HW247 Admin Portal implements a comprehensive Role-Based Access Control (RBAC) system that enables different user personas to access different features of the admin dashboard. The system supports:

- **5 Built-in Roles**: Master Admin, Order Team, Catalog Team, Finance Team, Support Team
- **Multi-Role Support**: Users can have multiple roles with combined permissions
- **Granular Permissions**: Fine-grained permission checks using "resource.action" format
- **Module-Level Access**: Navigation filtering based on accessible modules
- **Easy Extensibility**: Simple configuration to add new roles and permissions

## Architecture

### Core Components

1. **`lib/roles.ts`** - Role configuration and definitions
2. **`lib/authorization.ts`** - Authorization utility functions
3. **`app/context/AuthContext.tsx`** - Auth state management with RBAC
4. **`app/components/layout/RoleGuard.tsx`** - Route protection component
5. **`app/(main)/unauthorized/page.tsx`** - 403 unauthorized page

### Data Flow

```
User Login
    ↓
Backend returns JWT with roles array
    ↓
AuthContext initializes
    ↓
Extract roles and compute combined permissions
    ↓
Store in React Context (roles + permissions Set)
    ↓
RoleGuard checks roles/permissions on protected routes
    ↓
Layout filters navigation based on accessible modules
```

## Role Definitions

### 1. Master Admin (`master_admin`)
**Purpose**: Full platform access with all administrative capabilities

**Permissions**: 
- Dashboard, Orders, Vendors, Settlements, Returns, Analytics, Settings
- Can create, read, update, delete all resources
- Can manage users and roles
- Can view all reports and audit logs

**Modules**: All 7 modules visible

**Use Case**: Platform admins, system administrators

### 2. Order Team (`order_team`)
**Purpose**: Manage orders and returns

**Permissions**:
- View and update order status
- View returns and manage disputes
- View settlements (read-only)
- Dashboard access

**Modules**: Dashboard, Orders, Returns

**Use Case**: Customer service teams, order fulfillment teams

### 3. Catalog Team (`catalog_team`)
**Purpose**: Manage vendors and catalogs

**Permissions**:
- Full vendor management (KYC, documents, performance)
- Vendor payout management
- Vendor export capabilities
- Dashboard access

**Modules**: Dashboard, Vendors

**Use Case**: Vendor onboarding teams, catalog managers

### 4. Finance Team (`finance_team`)
**Purpose**: Financial operations and reporting

**Permissions**:
- Full settlements management (view, approve, process)
- Analytics and custom reports
- View orders (read-only)
- Dashboard access

**Modules**: Dashboard, Settlements, Analytics

**Use Case**: Accounting teams, financial analysts

### 5. Support Team (`support_team`)
**Purpose**: Customer support and dispute resolution

**Permissions**:
- Full returns management (view, manage disputes, approve/reject)
- View orders (read-only)
- Dashboard access

**Modules**: Dashboard, Orders, Returns

**Use Case**: Support teams, dispute resolution specialists

## Usage Guide

### Using RoleGuard in Components

Protect a page with RoleGuard:

```typescript
// app/(main)/vendors/page.tsx
import { RoleGuard } from '@/app/components/layout/RoleGuard'

function VendorsPageContent() {
  // Page content
}

export default function VendorsPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'catalog_team']}>
      <VendorsPageContent />
    </RoleGuard>
  )
}
```

### Using useAuth Hook

Access user roles and permissions in components:

```typescript
import { useAuth } from '@/app/context/AuthContext'

export function MyComponent() {
  const { user, roles, permissions, hasPermission, hasRole } = useAuth()

  // Check single permission
  if (hasPermission('orders.view')) {
    // Show orders content
  }

  // Check multiple permissions (all required)
  if (hasPermission(['orders.view', 'orders.update_status'])) {
    // Show order update UI
  }

  // Check any of several roles
  if (hasRole(['master_admin', 'order_team'])) {
    // Show order-related UI
  }

  // Check specific permission with resource.action
  if (hasPermission('settlements.approve')) {
    // Show settlement approval button
  }
}
```

### Using AuthorizationService

Server-side or static permission checks:

```typescript
import { AuthorizationService } from '@/lib/authorization'
import { Role } from '@/lib/roles'

// Check if role has permission
const canApprove = AuthorizationService.roleHasPermission('finance_team', 'settlements.approve')

// Check if any role has permission
const canAccess = AuthorizationService.rolesHavePermission(
  ['order_team', 'finance_team'],
  'orders.view'
)

// Get accessible modules for roles
const modules = AuthorizationService.getAccessibleModules(['order_team'])
// Returns: ['dashboard', 'orders', 'returns']

// Filter navigation
const navItems = AuthorizationService.getFilteredNavigation(['catalog_team'])
```

## Protected Pages

| Page | Route | Required Roles | Permissions |
|------|-------|---|---|
| Dashboard | `/dashboard` | Any authenticated user | `dashboard.view` |
| Orders | `/orders` | master_admin, order_team, finance_team | `orders.view`, `orders.update_status` |
| Vendors | `/vendors` | master_admin, catalog_team | `vendors.view`, `vendors.manage_*` |
| Settlements | `/settlements` | master_admin, finance_team | `settlements.view`, `settlements.approve` |
| Returns | `/returns` | master_admin, order_team, support_team | `returns.view`, `returns.manage_dispute` |
| Analytics | `/analytics` | master_admin, finance_team | `analytics.view`, `analytics.export` |
| Settings | `/settings` | master_admin only | `settings.manage_users`, `settings.manage_roles` |

## Extending the System

### Adding a New Role

1. **Add to `lib/roles.ts`**:

```typescript
export const ROLES = {
  MASTER_ADMIN: 'master_admin',
  // ... existing roles
  NEW_ROLE: 'new_role',  // Add new role
}

// Define permissions
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  // ... existing roles
  new_role: [
    'dashboard.view',
    'orders.view',
    // Add specific permissions
  ],
}

// Define navigation
export const ROLE_NAVIGATION: Record<Role, string[]> = {
  // ... existing roles
  new_role: ['dashboard', 'orders'],  // Accessible modules
}

// Add display info
export const ROLE_DISPLAY: Record<Role, RoleDisplayInfo> = {
  // ... existing roles
  new_role: {
    label: 'New Role',
    description: 'Role description',
    color: 'bg-color text-color',  // Tailwind classes
  },
}
```

2. **Update Backend** to return the new role in JWT tokens

3. **Add Page Protection** if role should access new pages:

```typescript
export default function NewPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'new_role']}>
      <NewPageContent />
    </RoleGuard>
  )
}
```

### Adding a New Permission

1. **Add to `lib/roles.ts` ROLE_PERMISSIONS**:

```typescript
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  master_admin: [
    // ... existing permissions
    'new_resource.new_action',  // Add new permission
  ],
  // ... other roles
}
```

2. **Use in Components**:

```typescript
const { hasPermission } = useAuth()

if (hasPermission('new_resource.new_action')) {
  // Show feature
}
```

### Adding a New Module/Tab

1. **Define Navigation Item** in `lib/roles.ts`:

```typescript
export const ALL_NAV_ITEMS: NavItem[] = [
  // ... existing items
  {
    href: '/new-module',
    label: 'New Module',
    icon: '📱',
    moduleKey: 'new_module',
  },
]
```

2. **Add to Role Navigation**:

```typescript
export const ROLE_NAVIGATION: Record<Role, string[]> = {
  master_admin: ['dashboard', 'orders', /* ... */, 'new_module'],
  // ... other roles - add to those that should see it
}
```

3. **Create Page with RoleGuard**:

```typescript
// app/(main)/new-module/page.tsx
export default function NewModulePage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'other_role']}>
      <NewModuleContent />
    </RoleGuard>
  )
}
```

## Permission Naming Convention

Follow the "resource.action" format:

**Resources**: dashboard, orders, vendors, settlements, returns, analytics, settings

**Actions**: 
- `view` - Read access
- `update_*` - Specific update actions (e.g., `update_status`)
- `manage_*` - Full management including create/update/delete
- `approve` - Approval workflows
- `export` - Export capabilities
- `*_users` - User management
- `*_roles` - Role management

**Examples**:
- `orders.view` - View orders
- `orders.update_status` - Update order status
- `vendors.manage_kyc` - Full KYC management
- `settlements.approve` - Approve settlements
- `analytics.export` - Export reports
- `settings.manage_users` - Manage users

## Testing

Run the RBAC tests:

```bash
npm test tests/rbac.test.ts
```

The test suite verifies:
- All roles are defined
- Permissions are correctly mapped to roles
- Navigation filtering works
- Multi-role permission combining works
- Page access requirements are met
- Permission naming conventions are followed

## Error Handling

When a user lacks permission:

1. **Page-level**: Redirected to `/unauthorized` or shown fallback UI
2. **Component-level**: Feature conditionally hidden based on permission
3. **Sidebar**: Navigation items filtered based on accessible modules

Example unauthorized page at `/unauthorized`:
- Shows user's current roles
- Shows required roles for the page
- Provides "Go to Dashboard" button
- Suggests contacting administrator

## Hybrid Storage

Role information is stored in two places:

1. **JWT Token** (Primary):
   - Roles array stored in token
   - Sent with every request
   - Backend validates permissions

2. **AuthContext** (Secondary):
   - Cached in React Context
   - Used for client-side UI decisions
   - Periodically synced with backend

This hybrid approach provides:
- Fast client-side permission checks
- Security through backend validation
- Consistency through periodic sync

## Next Steps

1. **Update Backend** to return `roles` array instead of single `role` in JWT
2. **Sync Roles** from backend on login and periodically
3. **Add New Roles** by extending `lib/roles.ts`
4. **Create Dashboard Variants** for each role (optional persona-specific views)
5. **Add Permission Decorators** for API routes (if building API layer)

## Troubleshooting

### User can't see a module

1. Check `ROLE_NAVIGATION` includes module for user's role
2. Verify user's JWT contains correct roles array
3. Check AuthContext properly initialized role list

### Permission check returns false

1. Verify permission string follows "resource.action" format
2. Check permission is in ROLE_PERMISSIONS for user's roles
3. Use wildcard: `hasPermission('orders.*')` to check all orders permissions

### RoleGuard shows unauthorized page

1. Check requiredRoles prop has correct role names
2. Verify user's roles in AuthContext (use browser dev tools)
3. Check AuthContext initialized before component mounted

## Best Practices

1. **Always use RoleGuard** for sensitive pages
2. **Hide sensitive features** with permission checks in components
3. **Combine client and server checks** for security
4. **Keep permissions granular** for flexibility
5. **Document role requirements** in code comments
6. **Test with different roles** before deploying
7. **Monitor permission denials** in logs for security issues
8. **Update backend** when adding new permissions

## Summary

The RBAC system provides:

✅ **5 Pre-configured Roles** - Ready to use out of the box  
✅ **Granular Permissions** - Fine-grained control with "resource.action" format  
✅ **Multi-Role Support** - Users can have multiple roles  
✅ **Easy Extension** - Add new roles/permissions with simple config changes  
✅ **Security First** - Client-side caching with server-side validation  
✅ **Good UX** - Clear error messages and permission feedback  
✅ **Comprehensive Tests** - Full test coverage of RBAC logic  

The system is designed to grow with your platform. Start with the 5 pre-configured roles, then customize and extend as needed!
