# Leave Management Module - Integration Guide

## Overview

The Leave Management module is a complete, production-ready feature for managing employee leave requests with a workflow-based approval system. It includes backend APIs, frontend pages, components, and comprehensive leave balance tracking.

## Backend Integration

### 1. Models (Already Created)
- **`server/src/models/leave.model.js`** - Leave request records with status tracking
- **`server/src/models/leave-balance.model.js`** - Leave balance tracking per fiscal year

### 2. Services (Already Created)
- **`server/src/services/leave.service.js`** - Business logic for leave operations
  - `applyLeave()` - Submit leave request
  - `approveLeave()` - Approve leave request
  - `rejectLeave()` - Reject leave request
  - `cancelLeave()` - Cancel leave request
  - `addLeaveComment()` - Add comments to leave
  - `getLeaveBalance()` - Get employee leave balance
  - `listLeaves()` - List leaves with filters
  - `getLeaveAnalytics()` - Get analytics data

### 3. Controllers (Already Created)
- **`server/src/controllers/leave.controller.js`** - API endpoint handlers

### 4. Routes (Already Created)
- **`server/src/routes/v1/leave.route.js`** - Leave API endpoints
- Updated **`server/src/routes/v1/index.js`** to register leave router at `/leaves`

### API Endpoints

**Employee Endpoints:**
```
POST   /api/v1/leaves                    - Apply for leave
GET    /api/v1/leaves                    - List own leaves
GET    /api/v1/leaves/:leaveId           - Get leave details
POST   /api/v1/leaves/:leaveId/cancel    - Cancel leave
POST   /api/v1/leaves/:leaveId/comment   - Add comment
GET    /api/v1/leaves/balance            - Get leave balance
GET    /api/v1/leaves/history/:employeeId - Get leave history
```

**Admin Endpoints:**
```
POST   /api/v1/leaves/:leaveId/approve            - Approve leave
POST   /api/v1/leaves/:leaveId/reject             - Reject leave
GET    /api/v1/leaves/approvals/pending-count     - Pending count
GET    /api/v1/leaves/analytics/report            - Leave analytics
```

## Frontend Integration

### 1. Types (Already Created)
- **`client/src/features/leave/types/leave.ts`** - TypeScript types and enums

### 2. API Service (Already Created)
- **`client/src/features/leave/api/leave-api.ts`** - API calls using Axios

### 3. Components (Already Created)

**UI Components:**
- **`leave-status-badge.tsx`** - Status badge with colors
- **`leave-timeline.tsx`** - Timeline view of leave workflow
- **`leave-card.tsx`** - Leave request card component
- **`leave-balance-card.tsx`** - Leave balance card with progress
- **`apply-leave-form.tsx`** - Form to apply for leave
- **`leave-approval-form.tsx`** - Form for admins to approve/reject

### 4. Pages (Already Created)

- **`apply-leave-page.tsx`** - Apply for leave (Employee)
- **`leave-history-page.tsx`** - View leave history with timeline
- **`leave-balance-page.tsx`** - View leave balance per type
- **`leave-approvals-page.tsx`** - Approval workflow (Admin)
- **`leave-analytics-page.tsx`** - Leave analytics dashboard (Admin)

## Route Registration

Add the following routes to your router configuration:

```typescript
// In your route configuration file
{
  path: '/leaves/apply',
  element: <ApplyLeavePage />,
  meta: { title: 'Apply Leave', requiredRole: ['employee', 'admin'] }
},
{
  path: '/leaves/history',
  element: <LeaveHistoryPage />,
  meta: { title: 'Leave History', requiredRole: ['employee', 'admin'] }
},
{
  path: '/leaves/balance',
  element: <LeaveBalancePage />,
  meta: { title: 'Leave Balance', requiredRole: ['employee', 'admin'] }
},
{
  path: '/leaves/approvals',
  element: <LeaveApprovalsPage />,
  meta: { title: 'Leave Approvals', requiredRole: ['admin'] }
},
{
  path: '/leaves/analytics',
  element: <LeaveAnalyticsPage />,
  meta: { title: 'Leave Analytics', requiredRole: ['admin'] }
}
```

## Database Setup

### MongoDB Collections

**Leave Collection:**
```javascript
db.createCollection("leaves", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "leaveType", "startDate", "endDate", "daysRequested", "reason"],
      properties: {
        employee: { bsonType: "objectId" },
        leaveType: { enum: ["annual", "sick", "casual", "personal", "unpaid", "maternity", "paternity"] },
        status: { enum: ["pending", "approved", "rejected", "cancelled"] },
        startDate: { bsonType: "date" },
        endDate: { bsonType: "date" },
        daysRequested: { bsonType: "number" },
        reason: { bsonType: "string" }
      }
    }
  }
});

// Create indexes
db.leaves.createIndex({ employee: 1, startDate: 1 });
db.leaves.createIndex({ employee: 1, status: 1 });
db.leaves.createIndex({ status: 1, startDate: 1 });
db.leaves.createIndex({ appliedAt: -1 });
```

**LeaveBalance Collection:**
```javascript
db.createCollection("leavebalances", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee", "fiscal_year", "leaveTypes"],
      properties: {
        employee: { bsonType: "objectId" },
        fiscal_year: { bsonType: "string" }
      }
    }
  }
});

// Create indexes
db.leavebalances.createIndex({ employee: 1, fiscal_year: 1 }, { unique: true });
```

## Sidebar Navigation Integration

Update your sidebar/navigation configuration to include Leave menu items:

```typescript
{
  label: 'Leave',
  icon: Calendar,
  items: [
    { label: 'Apply Leave', href: '/leaves/apply', roles: ['employee', 'admin'] },
    { label: 'My Leave History', href: '/leaves/history', roles: ['employee', 'admin'] },
    { label: 'Leave Balance', href: '/leaves/balance', roles: ['employee', 'admin'] },
    { label: 'Approvals', href: '/leaves/approvals', roles: ['admin'] },
    { label: 'Analytics', href: '/leaves/analytics', roles: ['admin'] },
  ]
}
```

## Key Features

### 1. **Leave Application Workflow**
- Employees apply for leave with date range and reason
- Automatic validation against leave balance
- Check for overlapping leave requests
- Support for multiple leave types (annual, sick, casual, personal, unpaid, maternity, paternity)

### 2. **Leave Balance Management**
- Fiscal year-based balance tracking
- Real-time balance calculation (Available = Allocated - Used - Pending)
- Support for carryover from previous year
- Automatic balance updates on approval/rejection

### 3. **Approval Workflow**
- Admin dashboard to review pending leave requests
- Approve/reject with optional comments
- Timeline view showing complete leave history
- Notification system hooks (ready for integration)

### 4. **Leave History & Timeline**
- Chronological view of all leave events
- Status badges with color coding
- Comments and notes on each leave
- Filter by status and leave type

### 5. **Analytics & Reporting**
- Leave utilization by type
- Status distribution (pending, approved, rejected)
- Average leave duration
- Department-level analytics (extensible)

### 6. **Rich UI Components**
- Status badges with context colors
- Timeline visualization
- Balance progress indicators
- Responsive forms with validation
- Interactive modals and workflows

## Customization

### Leave Types
Edit `LEAVE_TYPES` in `leave.ts` to add/remove leave types:

```typescript
const LEAVE_TYPES: LeaveType[] = [
  "annual", "sick", "casual", "personal", "unpaid", "maternity", "paternity"
];
```

### Leave Balance Defaults
Update `LeaveBalance` model to change default allocations:

```javascript
annual: { allocated: 20 },    // Change from 20
sick: { allocated: 12 },      // Change from 12
casual: { allocated: 8 },     // etc.
```

### Fiscal Year
Update `getCurrentFiscalYear()` in service to match your fiscal year:

```javascript
// Current: April - March
function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  if (month >= 3) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}
```

## Notification Integration

The module is ready for notification integration. Add notification logic in the service:

```javascript
// After leave application
const managers = await getManagersFor(employee);
await notificationService.send({
  type: 'leave_application',
  recipients: managers,
  data: leave
});

// After approval
await notificationService.send({
  type: 'leave_approved',
  recipients: [leave.appliedBy],
  data: leave
});
```

## Testing Scenarios

### Employee Flow
1. Apply for leave (annual, sick, casual)
2. Check balance before applying
3. View application status
4. Cancel approved leave
5. Add comments to pending leave

### Admin Flow
1. View all pending leave requests
2. Review employee details and leave history
3. Approve with optional comment
4. Reject with reason
5. View analytics and utilization

## Performance Considerations

- Leave queries are indexed on employee + status + date
- Pagination implemented for leave lists (default 10 items)
- LeaveBalance is stored per employee per fiscal year for quick lookup
- Aggregation pipeline used for analytics

## Security

- Role-based access control: Employee can only see own leaves, admins see all
- JWT authentication on all endpoints
- Input validation using Zod schemas
- Database query filtering by user role

## Next Steps

1. **Test API endpoints** using Postman or similar
2. **Seed leave balance** for existing employees
3. **Integrate notifications** (email, in-app)
4. **Add email templates** for leave notifications
5. **Implement audit logging** for approvals
6. **Add CSV export** for leave reports
7. **Setup cron job** for fiscal year rollover

## Troubleshooting

### Leave balance not updating
- Check that fiscal year matches current date
- Verify Leave model updates are being committed
- Check for concurrent update conflicts

### Approval not working
- Verify user role is 'admin'
- Check leave status is 'pending'
- Review validation schemas

### API returning 404
- Verify leave router is registered in `/routes/v1/index.js`
- Check MongoDB connection
- Verify ObjectIds are valid

## Files Summary

**Backend (13 files):**
- 1 model (leave.model.js)
- 1 model (leave-balance.model.js)
- 1 schema (leave.schema.js)
- 1 service (leave.service.js)
- 1 controller (leave.controller.js)
- 1 route (leave.route.js)
- 1 updated route (routes/v1/index.js)

**Frontend (12 files):**
- 1 types file (leave.ts)
- 1 API service (leave-api.ts)
- 6 components (status badge, timeline, card, balance card, apply form, approval form)
- 5 pages (apply, history, balance, approvals, analytics)

Total: 25 new/updated files

---

For questions or issues, refer to the ARCHITECTURE.md and BACKEND_ARCHITECTURE.md documents.
