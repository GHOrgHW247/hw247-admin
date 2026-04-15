# RBAC Quick Reference Guide

## Quick Start

### 1. Protect a Page with RoleGuard

```typescript
import { RoleGuard } from '@/app/components/layout/RoleGuard'

function PageContent() {
  return <div>Page content</div>
}

export default function Page() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'order_team']}>
      <PageContent />
    </RoleGuard>
  )
}
```

### 2. Check Permissions in Components

```typescript
import { useAuth } from '@/app/context/AuthContext'

export function MyButton() {
  const { hasPermission } = useAuth()

  if (!hasPermission('orders.update_status')) return null

  return <button>Update Status</button>
}
```

### 3. Check Roles in Components

```typescript
import { useAuth } from '@/app/context/AuthContext'

export function AdminPanel() {
  const { hasRole } = useAuth()

  return (
    <div>
      {hasRole('master_admin') && <AdminControls />}
    </div>
  )
}
```

## Roles Cheat Sheet

| Role | Modules | Key Permissions |
|------|---------|---|
| **master_admin** | All 7 modules | All permissions |
| **order_team** | Dashboard, Orders, Returns | orders.*, returns.* |
| **catalog_team** | Dashboard, Vendors | vendors.* |
| **finance_team** | Dashboard, Settlements, Analytics | settlements.*, analytics.* |
| **support_team** | Dashboard, Orders, Returns | returns.*, orders.view |

## Permission Formats

### Single Permission Check
```typescript
hasPermission('orders.view')           // true if has permission
hasPermission('orders.*')              // wildcard: any orders permission
```

### Multiple Permissions (All Required)
```typescript
hasPermission(['orders.view', 'orders.update_status'])
```

### Any Permission (At Least One)
```typescript
hasAnyPermission(['orders.view', 'vendors.view'])
```

### Resource.Action Format
```typescript
// Used internally for all permissions
'orders.view'           // resource=orders, action=view
'vendors.manage_kyc'    // resource=vendors, action=manage_kyc
'settlements.approve'   // resource=settlements, action=approve
```

## RoleGuard Variations

### Required Roles (Any)
```typescript
<RoleGuard requiredRoles={['master_admin', 'order_team']}>
  <Content />
</RoleGuard>
```

### Required Permissions (All)
```typescript
<RoleGuard requiredPermissions={['orders.view', 'orders.update_status']}>
  <Content />
</RoleGuard>
```

### Redirect on Unauthorized
```typescript
<RoleGuard 
  requiredRoles={['master_admin']}
  redirectOnUnauthorized
  redirectUrl="/dashboard"
>
  <Content />
</RoleGuard>
```

### Custom Fallback UI
```typescript
<RoleGuard 
  requiredRoles={['master_admin']}
  fallback={<CustomUnauthorized />}
>
  <Content />
</RoleGuard>
```

### No Requirements (Auth Check Only)
```typescript
<RoleGuard>  {/* Checks only that user is authenticated */}
  <Content />
</RoleGuard>
```

## useAuth Hook API

```typescript
const {
  user,                    // { id, name, email, role } | null
  roles,                   // Role[] - user's roles
  permissions,             // Set<string> - all user's permissions
  isLoading,              // boolean
  isAuthenticated,        // boolean
  login,                  // (email, password) => Promise<void>
  logout,                 // () => Promise<void>
  hasPermission,          // (perm: string | string[]) => boolean
  hasRole,                // (role: Role | Role[]) => boolean
  hasAnyPermission,       // (perms: string[]) => boolean
  hasAllPermissions,      // (perms: string[]) => boolean
  canAccess,              // (resource, action) => boolean
  getAccessibleModules,   // () => string[]
} = useAuth()
```

## AuthorizationService API

```typescript
import { AuthorizationService } from '@/lib/authorization'

// Static permission checks
AuthorizationService.hasPermission(perms, 'orders.view')
AuthorizationService.hasAnyPermission(perms, ['orders.view', 'vendors.view'])
AuthorizationService.hasAllPermissions(perms, ['orders.view', 'orders.update'])
AuthorizationService.canAccess(perms, 'orders', 'view')

// Role checks
AuthorizationService.roleHasPermission('order_team', 'orders.view')
AuthorizationService.rolesHavePermission(['order_team', 'finance_team'], 'orders.view')

// Module access
AuthorizationService.getAccessibleModules(['order_team'])  // ['dashboard', 'orders', 'returns']
AuthorizationService.getAccessibleRoutes(['order_team'])   // ['/dashboard', '/orders', ...]
AuthorizationService.getFilteredNavigation(['order_team']) // [NavItem, ...]

// Permission combining
AuthorizationService.getCombinedPermissions(['order_team', 'finance_team']) // Set<string>
```

## Common Patterns

### Feature Flag Based on Permission
```typescript
export function UpdateOrderButton() {
  const { hasPermission } = useAuth()

  if (!hasPermission('orders.update_status')) return null

  return <button>Update Status</button>
}
```

### Conditional Rendering Based on Role
```typescript
export function Dashboard() {
  const { hasRole } = useAuth()

  return (
    <div>
      {hasRole('master_admin') && <AdminPanel />}
      {hasRole('order_team') && <OrdersPanel />}
      {hasRole('catalog_team') && <VendorsPanel />}
      {hasRole('finance_team') && <FinancePanel />}
    </div>
  )
}
```

### API Call with Permission Check
```typescript
async function updateOrderStatus(orderId: string, status: string) {
  const { hasPermission } = useAuth()

  if (!hasPermission('orders.update_status')) {
    throw new Error('Insufficient permissions')
  }

  // Make API call
}
```

### Multi-Role Requirement
```typescript
<RoleGuard requiredRoles={['master_admin', 'order_team', 'support_team']}>
  <ReturnManagement />
</RoleGuard>
```

## Page Access Configuration

```typescript
// app/(main)/orders/page.tsx
<RoleGuard requiredRoles={['master_admin', 'order_team', 'finance_team']}>

// app/(main)/vendors/page.tsx
<RoleGuard requiredRoles={['master_admin', 'catalog_team']}>

// app/(main)/settlements/page.tsx
<RoleGuard requiredRoles={['master_admin', 'finance_team']}>

// app/(main)/returns/page.tsx
<RoleGuard requiredRoles={['master_admin', 'order_team', 'support_team']}>

// app/(main)/analytics/page.tsx
<RoleGuard requiredRoles={['master_admin', 'finance_team']}>

// app/(main)/settings/page.tsx
<RoleGuard requiredRoles={['master_admin']}>

// app/(main)/dashboard/page.tsx
<RoleGuard>  {/* Any authenticated user */}
```

## Adding New Roles

1. **Add to roles.ts**:
```typescript
export const ROLES = {
  NEW_ROLE: 'new_role',
}

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  new_role: ['dashboard.view', 'orders.view'],
}

export const ROLE_NAVIGATION: Record<Role, string[]> = {
  new_role: ['dashboard', 'orders'],
}

export const ROLE_DISPLAY: Record<Role, RoleDisplayInfo> = {
  new_role: {
    label: 'New Role',
    description: 'Description',
    color: 'bg-color text-color',
  },
}
```

2. **Update Backend** to return new role in JWT

3. **Protect Pages** with new role:
```typescript
<RoleGuard requiredRoles={['master_admin', 'new_role']}>
```

## Adding New Permissions

1. **Add to ROLE_PERMISSIONS in roles.ts**:
```typescript
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  order_team: [
    // ... existing
    'new_resource.new_action',
  ],
}
```

2. **Use in Components**:
```typescript
if (hasPermission('new_resource.new_action')) {
  // Show feature
}
```

## Testing

```typescript
// In your component tests
import { useAuth } from '@/app/context/AuthContext'

jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    hasPermission: jest.fn((perm) => perm === 'orders.view'),
    hasRole: jest.fn((role) => role === 'order_team'),
    roles: ['order_team'],
  })),
}))
```

## Errors & Troubleshooting

### "Cannot find RoleGuard"
- Import: `import { RoleGuard } from '@/app/components/layout/RoleGuard'`

### "useAuth must be used within AuthProvider"
- Ensure `AuthProvider` wraps your app in `app/layout.tsx`

### Permission check always returns false
- Check permission string format: `'resource.action'`
- Verify user's role has that permission in `ROLE_PERMISSIONS`

### User can't see navigation item
- Check role is in `ROLE_NAVIGATION['role_name']`
- Verify `moduleKey` matches in `ALL_NAV_ITEMS`

## File Locations

```
hw247-admin/
├── lib/
│   ├── roles.ts                    # Role definitions & permissions
│   └── authorization.ts             # Authorization utilities
├── app/
│   ├── context/
│   │   └── AuthContext.tsx         # Auth state with RBAC
│   └── components/
│       └── layout/
│           └── RoleGuard.tsx       # Route protection component
└── app/(main)/
    ├── dashboard/page.tsx          # Protected pages
    ├── orders/page.tsx
    ├── vendors/page.tsx
    ├── settlements/page.tsx
    ├── returns/page.tsx
    ├── analytics/page.tsx
    ├── settings/page.tsx
    └── unauthorized/page.tsx       # 403 page
```

## Performance Tips

1. **Use Set.has()** for permission checks (O(1) lookup)
2. **Cache permission results** in component state if needed frequently
3. **Use useAuth hook** instead of AuthorizationService in components
4. **Filter navigation at layout level** not per component
5. **Combine multiple role checks** into single call: `hasRole(['role1', 'role2'])`

## Security Notes

⚠️ **Client-side checks are NOT secure** - always validate on backend
✅ **Use client-side checks** for UX (hiding buttons, showing loading)
✅ **Always validate on backend** for actual data/API access
✅ **Send roles in JWT** for fast client-side decisions
✅ **Verify roles on every API call** on backend
✅ **Use HTTPS** for all communication
✅ **Keep tokens short-lived** (< 1 hour)

---

For full documentation, see: `RBAC_IMPLEMENTATION.md`
