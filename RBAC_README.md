# HW247 Admin Portal - Role-Based Access Control (RBAC)

> A comprehensive, production-ready role-based access control system for the HW247 admin portal with support for 5 roles, 23 granular permissions, and multi-role user support.

## 🎯 Quick Overview

The RBAC system enables:
- **5 Pre-built Roles**: Master Admin, Order Team, Catalog Team, Finance Team, Support Team
- **Multi-Role Users**: Users can have multiple roles with combined permissions
- **Page-Level Access Control**: Automatically protect pages based on user roles
- **Component-Level Checks**: Hide/show features based on permissions
- **Navigation Filtering**: Sidebar automatically shows only accessible modules
- **Easy Extensibility**: Add new roles or permissions with simple config changes

## 📚 Documentation

Choose the right doc based on your role:

| Document | For | Purpose |
|----------|-----|---------|
| **This File** | Everyone | Overview and getting started |
| `RBAC_QUICK_REFERENCE.md` | Developers | Copy-paste examples and quick API reference |
| `RBAC_IMPLEMENTATION.md` | Architects, Senior Devs | Deep dive into architecture and extensibility |
| `RBAC_IMPLEMENTATION_SUMMARY.md` | PMs, Leads | What was built and current status |
| `DEPLOYMENT_CHECKLIST.md` | DevOps, Leads | Deployment steps and backend integration |
| `tests/rbac.test.ts` | QA, Developers | 40+ test cases for verification |

## 🚀 Getting Started (5 minutes)

### 1. Check User's Current Role
```typescript
import { useAuth } from '@/app/context/AuthContext'

export function MyComponent() {
  const { roles, user } = useAuth()
  
  console.log('User roles:', roles)  // ['order_team']
  console.log('User info:', user)    // { id, name, email }
}
```

### 2. Protect a Page
```typescript
import { RoleGuard } from '@/app/components/layout/RoleGuard'

function PageContent() {
  return <div>Orders Management</div>
}

export default function OrdersPage() {
  return (
    <RoleGuard requiredRoles={['master_admin', 'order_team']}>
      <PageContent />
    </RoleGuard>
  )
}
```

### 3. Hide/Show Based on Permission
```typescript
const { hasPermission } = useAuth()

if (hasPermission('orders.update_status')) {
  return <UpdateStatusButton />
}
```

## 📋 The 5 Roles

### Master Admin 👑
**Full access to everything**
- All 7 modules: Dashboard, Orders, Vendors, Settlements, Returns, Analytics, Settings
- All 23 permissions
- Can manage users and roles

### Order Team 📦
**Manages orders and returns**
- Modules: Dashboard, Orders, Returns
- Can: View/update orders, manage returns & disputes, view settlements
- Cannot: Approve settlements, manage vendors, view analytics

### Catalog Team 🏪
**Manages vendor onboarding**
- Modules: Dashboard, Vendors
- Can: Manage vendor KYC, documents, performance, payouts
- Cannot: View orders, approve settlements

### Finance Team 💰
**Handles financial operations**
- Modules: Dashboard, Settlements, Analytics
- Can: View/approve settlements, view analytics & reports, view orders
- Cannot: Update order status, manage vendors

### Support Team 🆘
**Resolves customer issues**
- Modules: Dashboard, Orders, Returns
- Can: Manage returns, resolve disputes, view orders
- Cannot: Approve settlements, manage vendors

## 🔐 Permission Format

All permissions follow `resource.action` format:

```
orders.view              // View orders
orders.update_status     // Update order status
vendors.manage_kyc       // Full KYC management
settlements.approve      // Approve settlements
analytics.view           // View analytics dashboard
settings.manage_users    // Manage admin users
returns.manage_dispute   // Handle return disputes
```

## 💡 Common Use Cases

### Conditionally Render a Button
```typescript
const { hasPermission } = useAuth()

return (
  <button disabled={!hasPermission('orders.update_status')}>
    Update Status
  </button>
)
```

### Redirect on Permission Denied
```typescript
<RoleGuard 
  requiredRoles={['master_admin']}
  redirectOnUnauthorized
  redirectUrl="/dashboard"
>
  <SettingsPage />
</RoleGuard>
```

### Check Multiple Roles (Any One)
```typescript
const { hasRole } = useAuth()

if (hasRole(['master_admin', 'catalog_team'])) {
  return <VendorManagement />
}
```

### Check Multiple Permissions (All Required)
```typescript
const { hasPermission } = useAuth()

if (hasPermission(['orders.view', 'orders.update_status'])) {
  return <OrderUpdateForm />
}
```

## 📁 Where RBAC Code Lives

```
hw247-admin/
├── lib/
│   ├── roles.ts                    ← Role & permission definitions
│   └── authorization.ts            ← Authorization utilities
├── app/
│   ├── context/
│   │   └── AuthContext.tsx         ← Auth state with RBAC
│   └── components/
│       └── layout/
│           └── RoleGuard.tsx       ← Route protection component
└── app/(main)/
    ├── [all pages]                 ← Protected with RoleGuard
    └── unauthorized/page.tsx       ← 403 error page
```

## 🔍 Check Implementation Status

### All Pages Protected ✅
- ✅ Dashboard (`/dashboard`)
- ✅ Orders (`/orders`)
- ✅ Vendors (`/vendors`)
- ✅ Settlements (`/settlements`)
- ✅ Returns (`/returns`)
- ✅ Analytics (`/analytics`)
- ✅ Settings (`/settings`)

### Navigation Filtering ✅
- ✅ Sidebar shows only accessible modules
- ✅ Role badge displays in user panel
- ✅ Sidebar highlights active page

### Permission Checking ✅
- ✅ useAuth hook works in components
- ✅ hasPermission() supports single and multiple
- ✅ Wildcard matching supported (e.g., "orders.*")

## 🧪 Run Tests

Verify RBAC is working correctly:

```bash
npm test tests/rbac.test.ts
```

This runs 40+ test cases covering:
- All roles and permissions
- Navigation filtering
- Multi-role combining
- Permission checking
- Page access requirements

## 🛠️ Customizing Roles

### Add a New Role

1. Open `lib/roles.ts`
2. Add to ROLES object:
```typescript
export const ROLES = {
  // ... existing roles
  NEW_ROLE: 'new_role',
}
```

3. Define permissions:
```typescript
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  // ... existing
  new_role: [
    'dashboard.view',
    'orders.view',
    // Add specific permissions
  ],
}
```

4. Define navigation:
```typescript
export const ROLE_NAVIGATION: Record<Role, string[]> = {
  // ... existing
  new_role: ['dashboard', 'orders'],  // Accessible modules
}
```

5. Add display info:
```typescript
export const ROLE_DISPLAY: Record<Role, RoleDisplayInfo> = {
  // ... existing
  new_role: {
    label: 'New Role',
    description: 'Role description',
    color: 'bg-blue-100 text-blue-800',
  },
}
```

6. Update backend to return new role in JWT

7. Protect pages that need the new role:
```typescript
<RoleGuard requiredRoles={['master_admin', 'new_role']}>
  <PageContent />
</RoleGuard>
```

### Add a New Permission

1. Open `lib/roles.ts`
2. Add to appropriate roles in ROLE_PERMISSIONS:
```typescript
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  order_team: [
    // ... existing
    'new_resource.new_action',  // Add here
  ],
}
```

3. Use in components:
```typescript
if (hasPermission('new_resource.new_action')) {
  // Show feature
}
```

## ⚠️ Important Notes

### For Frontend Developers
- ✅ All pages are protected - users see only what they can access
- ✅ Use `useAuth()` for permission checks in components
- ✅ Use `<RoleGuard>` to protect pages or sections
- ✅ Changes to roles/permissions only need `lib/roles.ts` update

### For Backend Developers
- ⚠️ **IMPORTANT**: Update JWT to return `roles: string[]` instead of `role: string`
- ⚠️ Add role validation middleware to all API endpoints
- ⚠️ Return 403 Forbidden for permission denials
- See `DEPLOYMENT_CHECKLIST.md` for detailed backend integration steps

### For QA/Testers
- Test with each of the 5 roles to verify access control
- Check that users can only see modules they're allowed to
- Verify unauthorized pages show helpful error message
- Test multi-role users (if backend supports)
- Run `npm test tests/rbac.test.ts` to verify all tests pass

### For Security
- ✅ Client-side checks are for UX only (hiding features)
- ⚠️ Server-side validation is REQUIRED for actual security
- Always validate permissions on backend API calls
- Don't trust client-side permission checks alone
- Keep JWT tokens short-lived (< 1 hour)
- Always use HTTPS in production

## 🎓 Learning Path

**30 minutes**: Start here
1. Read this README
2. Look at one protected page (e.g., `app/(main)/orders/page.tsx`)
3. Try accessing with different roles

**1 hour**: Understand the system
4. Read `RBAC_QUICK_REFERENCE.md`
5. Try implementing a component with permission checks
6. Run the test suite

**2-3 hours**: Master it
7. Read `RBAC_IMPLEMENTATION.md` for deep dive
8. Understand the architecture
9. Try adding a new role
10. Review test cases

## 🚀 Next Steps

### For Frontend
- [x] RBAC system is complete and ready to use
- [ ] Start using in new features
- [ ] Gradually add to existing features
- [ ] Run tests before each deployment

### For Backend
- [ ] Update JWT to return roles array (see DEPLOYMENT_CHECKLIST.md)
- [ ] Add role validation to API endpoints
- [ ] Migrate database schema if needed
- [ ] Test with staging environment

### For DevOps
- See `DEPLOYMENT_CHECKLIST.md` for:
  - Backend integration requirements
  - Deployment strategy
  - Rollback plan
  - Monitoring setup

## 🤔 FAQ

**Q: Can a user have multiple roles?**  
A: Yes! The system supports `roles: ['order_team', 'support_team']` and combines permissions from both.

**Q: How are permissions checked?**  
A: Using efficient Set-based lookups - O(1) time complexity. `permissions.has('orders.view')`

**Q: What if I need very granular permissions?**  
A: Current format scales well. You can extend to "resource.action.object" if needed.

**Q: How do I test with different roles?**  
A: See `RBAC_QUICK_REFERENCE.md` for testing patterns, or look at `tests/rbac.test.ts`

**Q: Is this production-ready?**  
A: Yes! Full implementation with 40+ tests. Just need backend JWT update before deploying.

**Q: Can I customize everything?**  
A: Yes! All configuration is in `lib/roles.ts` - that's your single source of truth.

## 📞 Need Help?

1. **Quick answers**: `RBAC_QUICK_REFERENCE.md`
2. **Architecture questions**: `RBAC_IMPLEMENTATION.md`
3. **Deployment issues**: `DEPLOYMENT_CHECKLIST.md`
4. **Test verification**: Run `npm test tests/rbac.test.ts`
5. **Code examples**: Check any protected page (e.g., `app/(main)/orders/page.tsx`)

## ✨ Key Features Summary

| Feature | Status | Notes |
|---------|--------|-------|
| 5 Pre-built Roles | ✅ | Master Admin, Order Team, Catalog Team, Finance Team, Support Team |
| Multi-Role Support | ✅ | Users can have multiple roles |
| 23 Granular Permissions | ✅ | Fine-grained control across 7 modules |
| Route Protection | ✅ | RoleGuard component for pages |
| Component-Level Checks | ✅ | useAuth hook for conditional rendering |
| Navigation Filtering | ✅ | Sidebar shows only accessible modules |
| Easy Extensibility | ✅ | Add roles/permissions via config |
| Comprehensive Tests | ✅ | 40+ test cases |
| Full Documentation | ✅ | 5 documentation files |
| Production Ready | ✅ | After backend JWT update |

---

## 📈 System Architecture

```
User Login
    ↓
Backend returns JWT with roles array: ["order_team"]
    ↓
AuthContext initializes and computes combined permissions
    ↓
React components use useAuth() hook for permission checks
    ↓
Navigation sidebar filters based on accessible modules
    ↓
RoleGuard protects pages by checking requiredRoles
    ↓
Unauthorized users see 403 page with helpful info
```

## 🎉 Success!

You now have a complete RBAC system that:
- ✅ Protects all admin pages
- ✅ Filters navigation per role
- ✅ Enables component-level permission checks
- ✅ Supports multiple roles per user
- ✅ Is fully extensible for future growth
- ✅ Has comprehensive test coverage
- ✅ Is well-documented

**Current Status**: Frontend Complete ✅ | Backend Integration Needed ⏳

---

**Last Updated**: 2026-04-15  
**Status**: Production Ready (Frontend)  
**Next Step**: Backend JWT and API validation (See DEPLOYMENT_CHECKLIST.md)
