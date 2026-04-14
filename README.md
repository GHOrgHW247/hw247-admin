# HW247 Admin Portal

Admin portal for order management, vendor approval, settlement processing, return handling, and analytics reporting.

## Features

- 🏢 **Admin Dashboard** - Platform overview with KPI metrics
- 📦 **Order Management** - Advanced filtering, detail views, force status changes, batch dispatch
- 🏪 **Vendor Management** - Approval workflows, KYC verification, bank details, document management
- 💰 **Settlements** - Settlement generation, approval, payout tracking, tax tracking (GST/TDS), Tally XML export
- 🔄 **Returns** - Return list, detail views, force approval/rejection, escalation tracking
- 📊 **Analytics** - KPI metrics, trend charts, vendor performance, custom reports, exports

## Tech Stack

- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** NestJS (hw247-api)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens
- **API Client:** Axios with interceptors

## Project Structure

```
hw247-admin/
├── app/
│   ├── (auth)/login/              [Admin login page]
│   ├── (main)/
│   │   ├── dashboard/             [Dashboard overview]
│   │   ├── orders/                [Order management]
│   │   ├── vendors/               [Vendor management]
│   │   ├── settlements/           [Settlement processing]
│   │   ├── returns/               [Return management]
│   │   ├── analytics/             [Analytics & reporting]
│   │   └── settings/              [Admin settings]
│   ├── globals.css                [Global styles]
│   ├── layout.tsx                 [Root layout]
│   └── page.tsx                   [Root page redirect]
├── lib/
│   ├── api.ts                     [Axios client with auth]
│   ├── types.ts                   [TypeScript interfaces]
│   └── utils.ts                   [Utility functions]
├── public/                        [Static assets]
├── .env.example                   [Environment template]
├── .env.local                     [Local development env]
├── tsconfig.json                  [TypeScript config]
├── next.config.js                 [Next.js config]
├── tailwind.config.js             [Tailwind CSS config]
└── package.json                   [Dependencies]
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- hw247-api running on `localhost:4000`

### Installation

```bash
# Clone the repository
git clone https://github.com/GHOrgHW247/hw247-admin.git
cd hw247-admin

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server (runs on port 3000)
npm run dev

# Open browser
# http://localhost:3000
```

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Type Checking

```bash
# Check TypeScript types
npm run type-check
```

### Linting

```bash
# Run ESLint
npm run lint
```

## API Integration

The admin portal connects to the backend API (hw247-api) at `/api/v1/admin/`:

### Authentication Endpoints
```
POST /admin/auth/login              # Admin login
POST /admin/auth/logout             # Admin logout
```

### Order Management (Phase H.1)
```
GET    /admin/orders                # List orders
GET    /admin/orders/{id}           # Get order detail
POST   /admin/orders/{id}/force-status    # Change order status
POST   /admin/orders/batch-dispatch       # Batch dispatch
```

### Vendor Management (Phase H.1B + H.2)
```
GET    /admin/vendors               # List vendors
GET    /admin/vendors/{id}          # Get vendor detail
POST   /admin/vendors/{id}/approve  # Approve vendor
PUT    /admin/vendors/{id}/kyc      # Update KYC
POST   /admin/vendors/{id}/documents # Upload documents
```

### Settlements (Phase H.3)
```
GET    /admin/settlements           # List settlements
POST   /admin/settlements/generate  # Generate settlements
POST   /admin/settlements/{id}/approve # Approve settlement
GET    /admin/settlements/{id}/tally-xml # Export Tally XML
```

### Returns (Phase H.4)
```
GET    /admin/returns               # List returns
POST   /admin/returns/{rma}/force-approval # Force approve
```

### Analytics (Phase H.5)
```
GET    /admin/analytics/dashboard   # Dashboard metrics
GET    /admin/reports/generate      # Generate custom reports
```

## Authentication

The portal uses JWT tokens stored in `localStorage`:

```typescript
// Login
localStorage.setItem('admin_token', token)

// API requests automatically include token via axios interceptor
Authorization: Bearer {token}

// Logout
localStorage.removeItem('admin_token')
```

## Development Roadmap

### Week 1: Setup & Foundation ✅
- [x] Initialize Next.js 15 project
- [x] Configure TypeScript, Tailwind CSS
- [x] Setup authentication flow
- [x] Create dashboard skeleton
- [ ] Deploy to staging

### Week 2: Order Management
- [ ] Orders list with filters
- [ ] Order detail view
- [ ] Force status change modal
- [ ] Batch dispatch UI
- [ ] Packing slip print center

### Week 3: Vendor Management
- [ ] Vendor approval workflow
- [ ] KYC verification UI
- [ ] Bank details modal
- [ ] Document upload manager
- [ ] Catalog approval workflow
- [ ] Performance metrics dashboard

### Week 4: Settlements & Returns
- [ ] Settlement generation & approval
- [ ] Payout tracking
- [ ] GST/TDS breakdown
- [ ] Tally XML export
- [ ] Return management list
- [ ] Escalation tracking

### Week 5: Analytics & Polish
- [ ] Analytics dashboard
- [ ] Custom report builder
- [ ] Export functionality
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Production deployment

## Testing

```bash
# Run tests (when implemented)
npm test

# Run E2E tests (when implemented)
npm run test:e2e
```

## Performance

- Dashboard load time: <3s
- List page load time: <2s
- API response time: <500ms
- Lighthouse score: >90

## Security

- JWT authentication for all requests
- Admin-only routes with auth guards
- Audit logging for all actions
- No sensitive data in localStorage beyond JWT
- CORS configured for backend only

## Contributing

1. Create feature branch from `main`
2. Make changes following code style
3. Commit with descriptive messages
4. Push to feature branch
5. Create PR with description

## Deployment

### Staging
```bash
git push origin main:staging
# Automated deployment to staging environment
```

### Production
```bash
git tag v1.0.0
git push origin v1.0.0
# Automated deployment to production
```

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process using port 3000
# On Windows: netstat -ano | findstr :3000
# Then use: taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

### API Connection Error
- Verify hw247-api is running on `localhost:4000`
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify JWT token in localStorage

### TypeScript Errors
```bash
npm run type-check
# Fix errors shown
```

## Documentation

- [Admin Portal Index](../ProjectDocs/ADMIN_PORTAL_INDEX.md) - Documentation navigation
- [Gap Analysis](../ProjectDocs/ADMIN_PORTAL_GAP_ANALYSIS.md) - Customer requirements analysis
- [Implementation Steps](../ProjectDocs/ADMIN_IMPLEMENTATION_STEPS.md) - Week-by-week plan
- [Repo Structure](../ProjectDocs/ADMIN_REPO_STRUCTURE.md) - Project organization

## Support

For issues or questions, check the project documentation or contact the development team.

---

**Status:** 🟢 Week 1 Setup Complete - Ready for Week 2 Implementation

Last Updated: 2026-04-14
