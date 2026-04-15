# RBAC Deployment Checklist

## Frontend Implementation Status: ✅ COMPLETE

### Phase 1: Core System
- [x] `lib/roles.ts` - 5 roles, 23 permissions, navigation mapping
- [x] `lib/authorization.ts` - Permission checking utilities
- [x] `app/context/AuthContext.tsx` - Multi-role support
- [x] `app/components/layout/RoleGuard.tsx` - Route protection
- [x] `app/(main)/unauthorized/page.tsx` - 403 error page

### Phase 2: Page Protection
- [x] Dashboard page
- [x] Orders page
- [x] Vendors page  
- [x] Settlements page
- [x] Returns page
- [x] Analytics page
- [x] Settings page

### Phase 3: Layout Updates
- [x] Role-based navigation filtering
- [x] Role badge display in sidebar
- [x] Dynamic module visibility

### Phase 4: Testing & Documentation
- [x] 40+ test cases (tests/rbac.test.ts)
- [x] Full documentation (RBAC_IMPLEMENTATION.md)
- [x] Quick reference guide (RBAC_QUICK_REFERENCE.md)
- [x] Implementation summary (RBAC_IMPLEMENTATION_SUMMARY.md)

---

## Backend Integration: ⚠️ REQUIRED

### Phase 1: Authentication Endpoint Updates

**File**: `backend/src/routes/auth.routes.ts` (or similar)

#### Current (OLD)
```javascript
POST /auth/login
Response: {
  token: "jwt-token",
  user: { id, email, name, role: "order_team" }  // ❌ Single role
}
```

#### Required (NEW)
```javascript
POST /auth/login
Response: {
  token: "jwt-token",
  user: { 
    id, 
    email, 
    name, 
    roles: ["order_team", "support_team"]  // ✅ Array of roles
  }
}

// JWT Payload
{
  sub: user_id,
  email: "user@example.com",
  roles: ["order_team", "support_team"],  // ✅ Array in token
  iat: timestamp,
  exp: timestamp
}
```

**Why**: Frontend expects `roles` array for multi-role support. Single role will break RBAC system.

### Phase 2: API Endpoint Permission Validation

#### Setup Role Middleware

```javascript
// backend/src/middleware/roleMiddleware.ts
import jwt from 'jsonwebtoken'

export function checkRoles(...requiredRoles: string[]) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userRoles = decoded.roles || []
    
    // Check if user has at least one required role
    const hasRole = requiredRoles.some(role => userRoles.includes(role))
    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    
    req.user = decoded
    next()
  }
}
```

#### Apply to API Routes

```javascript
// Orders endpoints - require orders permissions
app.get('/api/admin/orders', 
  checkRoles('master_admin', 'order_team', 'finance_team'),
  handleGetOrders
)

app.patch('/api/admin/orders/:id/status',
  checkRoles('master_admin', 'order_team'),  // order_team can update
  handleUpdateOrderStatus
)

// Vendors endpoints - require vendor management
app.post('/api/admin/vendors/kyc',
  checkRoles('master_admin', 'catalog_team'),
  handleVendorKYC
)

// Settlements - only finance_team can approve
app.post('/api/admin/settlements/:id/approve',
  checkRoles('master_admin', 'finance_team'),
  handleApproveSettlement
)

// Analytics - only finance_team and master_admin
app.get('/api/admin/analytics/dashboard',
  checkRoles('master_admin', 'finance_team'),
  handleAnalytics
)

// Settings - only master_admin
app.post('/api/admin/settings/users',
  checkRoles('master_admin'),
  handleUserManagement
)
```

### Phase 3: Database Updates

#### User Model
```sql
-- OLD
ALTER TABLE users ADD COLUMN role VARCHAR(50);

-- NEW - Change to array
ALTER TABLE users ADD COLUMN roles TEXT[] DEFAULT ARRAY['user'];
-- or
ALTER TABLE users ADD COLUMN roles JSON DEFAULT '[]'::json;

-- Migrate existing data
UPDATE users SET roles = ARRAY[role] WHERE role IS NOT NULL;
```

#### User Roles Table (Optional, for complex role management)
```sql
CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Migrate from single role
INSERT INTO user_roles (user_id, role)
SELECT id, role FROM users WHERE role IS NOT NULL;

-- When querying
SELECT roles FROM (
  SELECT ARRAY_AGG(role) as roles FROM user_roles WHERE user_id = $1
) subquery;
```

### Phase 4: JWT Configuration

#### Update JWT Creation
```javascript
// OLD
function createJWT(user) {
  return jwt.sign({
    sub: user.id,
    email: user.email,
    role: user.role,  // ❌ Single
  }, secret, { expiresIn: '24h' })
}

// NEW
function createJWT(user) {
  const roles = Array.isArray(user.role) 
    ? user.role 
    : [user.role]  // Handle legacy single role
    
  return jwt.sign({
    sub: user.id,
    email: user.email,
    roles: roles,  // ✅ Array
  }, secret, { expiresIn: '24h' })
}
```

#### Update JWT Verification
```javascript
// OLD
function verifyJWT(token) {
  const decoded = jwt.verify(token, secret)
  const role = decoded.role  // ❌
  return { role }
}

// NEW
function verifyJWT(token) {
  const decoded = jwt.verify(token, secret)
  const roles = decoded.roles || []  // ✅
  return { roles }
}
```

---

## Deployment Steps

### Step 1: Frontend Deployment (Ready Now)
```bash
# 1. Build frontend
npm run build

# 2. Test locally
npm run dev
# Try different roles:
# - master_admin (all pages visible)
# - order_team (only orders, returns, dashboard)
# - catalog_team (only vendors, dashboard)
# - finance_team (only settlements, analytics, dashboard)
# - support_team (only returns, orders-view, dashboard)

# 3. Deploy to staging/production
npm run build && npm run start
```

### Step 2: Backend Updates (BEFORE frontend goes live)

**Timeline**: 
1. Update JWT endpoint (1 hour)
2. Add role validation middleware (1 hour)
3. Apply to all API routes (2-3 hours)
4. Database migration (30 mins with downtime)
5. Testing (1-2 hours)

**Suggested Approach**:
1. Create new login endpoint `/auth/v2/login` that returns `roles` array
2. Keep old endpoint for backward compatibility
3. Update frontend to use new endpoint
4. Migrate all users to new system
5. Deprecate old endpoint

### Step 3: Migration Strategy

**Option A: Parallel Deployment (Recommended)**
```
Week 1:
- Deploy backend with new `/auth/v2/login` endpoint
- Update test users to have roles array
- Frontend still uses old endpoint (backward compat)

Week 2:
- Update frontend to use new roles array
- Deploy RBAC frontend
- Test with staging backend
- Monitor for issues

Week 3:
- Full production deployment
- Monitor permission denials
- Keep old endpoint for fallback
```

**Option B: Big Bang (Riskier)**
```
- Update everything at once
- Requires coordinated deployment
- High risk if issues occur
- Only recommended for small platforms
```

---

## Verification Checklist

### Frontend ✅
- [x] All pages protected with RoleGuard
- [x] Navigation filters by role
- [x] Permission checks work in components
- [x] Unauthorized page displays correctly
- [x] Tests pass (40+ test cases)
- [x] No console errors
- [x] Responsive design maintained

### Backend ⏳ (Pending)
- [ ] JWT returns `roles` array instead of `role`
- [ ] All API endpoints validate roles
- [ ] Database supports array of roles
- [ ] Backward compatibility tested
- [ ] Downtime plan documented
- [ ] Rollback plan documented
- [ ] API documentation updated

### Integration ⏳ (Pending)
- [ ] Frontend can parse `roles` array from JWT
- [ ] Permission denials logged
- [ ] User creation includes role assignment
- [ ] Role changes reflected in new JWTs
- [ ] Multi-role combinations tested
- [ ] End-to-end tests pass

---

## Example: Complete Flow

### User A: Order Team
```javascript
// 1. Login
POST /auth/login
{ email: "order@example.com", password: "..." }

// 2. Response
{
  token: "eyJ...",
  user: { 
    id: 123, 
    email: "order@example.com",
    roles: ["order_team"]  // ✅ Array
  }
}

// 3. AuthContext initializes
roles = ["order_team"]
permissions = new Set([
  "dashboard.view",
  "orders.view",
  "orders.update_status",
  "returns.view",
  "returns.manage_dispute",
  "settlements.view"  // View only, can't approve
])

// 4. Navigation shows only accessible modules
Navigation Items:
✅ Dashboard
✅ Orders
✅ Returns
❌ Vendors (hidden)
❌ Settlements (hidden)
❌ Analytics (hidden)
❌ Settings (hidden)

// 5. Access /vendors
RoleGuard checks requiredRoles: ['master_admin', 'catalog_team']
User roles: ['order_team']
❌ Denied → Redirect to /unauthorized

// 6. Try to update settlement approval
API Call: PATCH /api/admin/settlements/456/approve
Backend checks: role must be 'master_admin' or 'finance_team'
❌ Denied → 403 Forbidden

// 7. Try to view orders (allowed)
API Call: GET /api/admin/orders
Backend checks: role must be 'master_admin', 'order_team', or 'finance_team'
✅ Allowed → Return orders data
```

### User B: Master Admin with Multiple Roles
```javascript
// 1. Login
POST /auth/login
{ email: "admin@example.com", password: "..." }

// 2. Response
{
  token: "eyJ...",
  user: { 
    id: 456, 
    email: "admin@example.com",
    roles: ["master_admin", "order_team", "finance_team"]  // ✅ Multiple
  }
}

// 3. AuthContext combines permissions
permissions = Combined set from all 3 roles
Total permissions: All 23 permissions
Includes both "orders.update_status" and "settlements.approve"

// 4. Navigation shows all modules
Navigation Items:
✅ Dashboard
✅ Orders
✅ Vendors
✅ Settlements
✅ Returns
✅ Analytics
✅ Settings

// 5. All API calls succeed
Can approve settlements (finance_team)
Can manage vendors (master_admin)
Can update order status (order_team)
```

---

## Risk Assessment

### Low Risk (Frontend)
- ✅ Completely isolated changes
- ✅ Comprehensive tests included
- ✅ Can be deployed anytime
- ✅ Full rollback by reverting files

### Medium Risk (Backend JWT Update)
- ⚠️ Affects authentication flow
- ⚠️ Database schema change
- ⚠️ All clients must update
- ✅ Can run parallel endpoints for compatibility

### Mitigation Strategies
1. **Parallel Endpoints**: Old and new JWT endpoints coexist
2. **Feature Flags**: Toggle RBAC enforcement gradually
3. **Monitoring**: Log all permission checks
4. **Rollback Plan**: Revert to single-role system if needed
5. **Staging Testing**: Full test in staging before production

---

## Support & Troubleshooting

### Common Issues After Deployment

**Issue**: "roles is not an array"
- **Cause**: Backend still returning `role: string` instead of `roles: array`
- **Fix**: Update backend JWT endpoint

**Issue**: Users see "Unauthorized" for all pages
- **Cause**: JWT roles are empty or missing
- **Fix**: Check backend is populating roles array

**Issue**: Old role-based logic still active
- **Cause**: Multiple auth providers or cached roles
- **Fix**: Clear localStorage and reload

**Issue**: Some users have no roles assigned
- **Cause**: Legacy data not migrated
- **Fix**: Run database migration or set default role

### Debug Mode

Enable debug logs in browser console:
```javascript
// In AuthContext or useAuth
console.log('User roles:', roles)
console.log('User permissions:', Array.from(permissions))
console.log('Has permission:', hasPermission('orders.view'))
```

---

## Success Criteria

Frontend RBAC is successful when:
- ✅ All tests pass
- ✅ Different users see different navigation
- ✅ Unauthorized access shows helpful error
- ✅ Permission checks work in components
- ✅ No console errors in any role scenario
- ✅ Documentation is clear
- ✅ Team can add new roles easily

Backend RBAC is successful when:
- ✅ JWT returns roles array
- ✅ All endpoints validate permissions
- ✅ Denied requests return 403
- ✅ Granted requests proceed normally
- ✅ Multi-role combinations work
- ✅ No security bypasses found
- ✅ Performance impact < 5ms

---

## Contact & Questions

For questions about the RBAC implementation:

1. **Architecture**: See `RBAC_IMPLEMENTATION.md`
2. **Quick Help**: See `RBAC_QUICK_REFERENCE.md`
3. **Testing**: Run `npm test tests/rbac.test.ts`
4. **Code Review**: Check implementation in `lib/roles.ts` and `lib/authorization.ts`

---

**Status**: Ready for Backend Integration  
**Frontend Ready**: ✅  
**Backend Ready**: ⏳ (Needs JWT and validation updates)  
**Overall Deployment Timeline**: 1-2 weeks
