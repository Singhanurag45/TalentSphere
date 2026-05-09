# Leave Management Module - Deployment Checklist

## Pre-Deployment Verification

### Backend Setup
- [ ] Leave model created in MongoDB
- [ ] LeaveBalance model created in MongoDB
- [ ] Indexes created on collections
- [ ] Service logic implemented and tested
- [ ] Validation schemas defined with Zod
- [ ] Controller endpoints working
- [ ] Routes registered at `/api/v1/leaves`
- [ ] Error handling implemented
- [ ] CORS configured if needed
- [ ] Rate limiting configured

### Frontend Setup
- [ ] Leave types defined with enums
- [ ] API service created with TypeScript
- [ ] All 8 components built and tested
- [ ] All 5 pages created and routing setup
- [ ] Form validation working
- [ ] Status badges displaying correctly
- [ ] Timeline rendering properly
- [ ] Charts rendering with data
- [ ] Responsive design tested
- [ ] Dark mode support verified

### Configuration
- [ ] Fiscal year settings configured
- [ ] Leave type allocations set
- [ ] Database connection string valid
- [ ] API endpoints reachable
- [ ] CORS headers configured
- [ ] Environment variables set

---

## Integration Steps

### Step 1: Database Setup
```bash
# Connect to MongoDB
mongosh

# Create indexes
db.leaves.createIndex({ employee: 1, startDate: 1 })
db.leaves.createIndex({ employee: 1, status: 1 })
db.leaves.createIndex({ status: 1, startDate: 1 })
db.leaves.createIndex({ appliedAt: -1 })

db.leavebalances.createIndex({ employee: 1, fiscal_year: 1 }, { unique: true })
```

### Step 2: Backend Integration
```javascript
// In routes/v1/index.js - Add leave router
import { leaveRouter } from "./leave.route.js";
v1Router.use("/leaves", leaveRouter);
```

### Step 3: Frontend Route Registration
```typescript
// In your app router or routes config
const leaveRoutes = [
  {
    path: '/leaves/apply',
    element: <ApplyLeavePage />,
    meta: { requiresAuth: true, roles: ['employee', 'admin'] }
  },
  {
    path: '/leaves/history',
    element: <LeaveHistoryPage />,
    meta: { requiresAuth: true, roles: ['employee', 'admin'] }
  },
  {
    path: '/leaves/balance',
    element: <LeaveBalancePage />,
    meta: { requiresAuth: true, roles: ['employee', 'admin'] }
  },
  {
    path: '/leaves/approvals',
    element: <LeaveApprovalsPage />,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/leaves/analytics',
    element: <LeaveAnalyticsPage />,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
];
```

### Step 4: Navigation Integration
```typescript
// In sidebar or navigation component
const leaveMenu = {
  label: 'Leave',
  icon: Calendar,
  items: [
    { label: 'Apply Leave', href: '/leaves/apply', roles: ['employee', 'admin'] },
    { label: 'My History', href: '/leaves/history', roles: ['employee', 'admin'] },
    { label: 'My Balance', href: '/leaves/balance', roles: ['employee', 'admin'] },
    { label: 'Approvals', href: '/leaves/approvals', roles: ['admin'] },
    { label: 'Analytics', href: '/leaves/analytics', roles: ['admin'] },
  ]
};
```

---

## Testing Checklist

### API Testing
- [ ] POST /leaves - Apply leave returns 201
- [ ] GET /leaves - List works with pagination
- [ ] GET /leaves/balance - Returns correct balance
- [ ] POST /leaves/:id/approve - Updates status
- [ ] POST /leaves/:id/reject - Updates status
- [ ] GET /leaves/analytics/report - Returns data
- [ ] Invalid requests return 400
- [ ] Unauthorized requests return 401
- [ ] Forbidden requests return 403

### UI Testing
- [ ] Apply form validation works
- [ ] Date picker functions properly
- [ ] Balance display updates
- [ ] Approval workflow buttons work
- [ ] Timeline displays correctly
- [ ] Charts render with data
- [ ] Pagination works
- [ ] Filters work
- [ ] Status badges display correctly
- [ ] Responsive on mobile

### Permission Testing
- [ ] Employee can only see own leaves
- [ ] Employee cannot approve leaves
- [ ] Admin can see all leaves
- [ ] Admin can approve/reject
- [ ] Admin can view analytics
- [ ] Unauthorized access blocked

### Data Testing
- [ ] Balance updates on approval
- [ ] Balance restored on rejection
- [ ] Overlapping leaves prevented
- [ ] Future dates only allowed
- [ ] Comments save correctly
- [ ] Timestamps accurate
- [ ] Pagination limits work
- [ ] Filters apply correctly

---

## Deployment Steps

### 1. Development Environment
```bash
# Backend
cd server
npm install # if needed
npm start

# Frontend (separate terminal)
cd client
npm install # if needed
npm run dev
```

### 2. Staging Deployment
- [ ] Deploy backend to staging server
- [ ] Deploy frontend to staging
- [ ] Run full test suite
- [ ] Test with real database
- [ ] Performance test (load test)
- [ ] Security review
- [ ] Get approval

### 3. Production Deployment
- [ ] Backup production database
- [ ] Deploy backend services
- [ ] Deploy frontend bundles
- [ ] Verify all endpoints
- [ ] Monitor error logs
- [ ] Verify database migrations
- [ ] Seed initial balances
- [ ] Announce to users

---

## Post-Deployment Verification

### Immediate (First Day)
- [ ] All API endpoints responding
- [ ] Frontend pages loading
- [ ] Authentication working
- [ ] Database queries executing
- [ ] No error logs
- [ ] Performance acceptable
- [ ] Mobile responsive

### First Week
- [ ] Test real workflows
- [ ] Check balance calculations
- [ ] Verify approvals workflow
- [ ] Monitor system performance
- [ ] Gather user feedback
- [ ] Check error rates
- [ ] Review analytics

### Ongoing
- [ ] Monitor database growth
- [ ] Watch error logs
- [ ] Check approval queue
- [ ] Performance trending
- [ ] User satisfaction
- [ ] Plan enhancements

---

## Backup & Recovery

### Backup Strategy
```bash
# Daily backup of MongoDB
mongodump --uri="mongodb://..." --out=/backups/leave_backup_$(date +%Y%m%d)

# Weekly full backup
# Store off-site
```

### Recovery Plan
```bash
# Restore from backup
mongorestore --uri="mongodb://..." /backups/leave_backup_YYYYMMDD
```

---

## Monitoring & Alerts

### Metrics to Monitor
- API response times (target: <500ms)
- Database query times (target: <200ms)
- Error rate (target: <0.1%)
- Active users
- Leave applications/day
- Approval rate

### Alerts to Configure
- [ ] High error rate (>1%)
- [ ] API response time >2s
- [ ] Database down
- [ ] Disk space low
- [ ] Memory usage high

---

## Troubleshooting Guide

### Issue: API returns 404
- [ ] Verify leave router registered in v1/index.js
- [ ] Check MongoDB connection
- [ ] Verify ObjectIds are valid
- [ ] Check collection names in models

### Issue: Balance not updating
- [ ] Check LeaveBalance collection exists
- [ ] Verify fiscal year matches current date
- [ ] Check for MongoDB update errors
- [ ] Verify employee exists

### Issue: Page not loading
- [ ] Check frontend build successful
- [ ] Verify API endpoint URL
- [ ] Check CORS configuration
- [ ] Check authentication token

### Issue: Approval not working
- [ ] Verify user role is 'admin'
- [ ] Check leave status is 'pending'
- [ ] Verify ObjectIds are valid
- [ ] Check database permissions

### Issue: Date validation failing
- [ ] Check date format (ISO 8601)
- [ ] Verify dates are after current date
- [ ] Check for timezone issues
- [ ] Validate date picker output

---

## Performance Optimization

### Database
- [x] Indexes created on common queries
- [x] Fiscal year composite index for LeaveBalance
- [x] Status + date index for filtering
- [x] Employee ID index for queries

### Frontend
- [ ] Lazy load pages (React.lazy)
- [ ] Code split components
- [ ] Implement virtualization for large lists
- [ ] Cache API responses
- [ ] Optimize bundle size

### Backend
- [ ] Enable response compression
- [ ] Implement request caching
- [ ] Use connection pooling
- [ ] Optimize queries
- [ ] Add rate limiting

---

## Security Checklist

- [x] JWT authentication required
- [x] Role-based access control
- [x] Input validation with Zod
- [x] SQL injection prevention
- [x] XSS prevention
- [ ] CSRF protection (if applicable)
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Secrets not in code
- [ ] Error messages don't leak info

---

## Documentation Status

- [x] LEAVE_MANAGEMENT_INTEGRATION.md - Full setup guide
- [x] LEAVE_MANAGEMENT_QUICK_REFERENCE.md - Developer reference
- [x] LEAVE_MANAGEMENT_BUILD_SUMMARY.md - Completion report
- [x] This deployment checklist
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Video tutorial (optional)
- [ ] Admin guide (optional)
- [ ] User guide (optional)

---

## Sign-Off

### Development Team
- Backend: ✓ Complete
- Frontend: ✓ Complete
- Testing: ⚠️ Manual testing recommended
- Documentation: ✓ Complete

### QA Testing
- [ ] Functionality: Pass/Fail
- [ ] Performance: Pass/Fail
- [ ] Security: Pass/Fail
- [ ] UI/UX: Pass/Fail

### Deployment Approval
- [ ] Technical Lead: _________________
- [ ] Product Manager: _________________
- [ ] Security Team: _________________
- [ ] Operations: _________________

### Go-Live Date: __________

---

## Support Contact

For issues during deployment:
- Backend issues: Developer
- Frontend issues: UI Developer
- Database issues: DBA
- Deployment issues: DevOps

---

## Post-Launch Monitoring Plan

### Week 1: Daily Review
- Monitor error logs
- Check API response times
- Review user feedback
- Watch approval queue

### Month 1: Weekly Review
- Performance trends
- User adoption
- Feature requests
- Bug fixes

### Ongoing: Monthly Review
- KPI tracking
- Enhancement planning
- Maintenance scheduling
- Security updates

---

## Rollback Plan

If critical issues found:

1. **Notify stakeholders** - Immediate communication
2. **Stop new deployments** - Pause further changes
3. **Identify issue** - Root cause analysis
4. **Prepare rollback** - Database backup ready
5. **Execute rollback** - Restore previous version
6. **Verify** - Test functionality
7. **Communicate** - Status update to users

---

*Last Updated: May 9, 2026*  
*Version: 1.0*  
*Status: Ready for Deployment*
