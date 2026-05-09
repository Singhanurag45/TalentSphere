# Leave Management - Developer Quick Reference

## Quick Start Guide

### For Frontend Developers

#### 1. Import Components
```typescript
import { ApplyLeavePage } from '@/features/leave/pages/apply-leave-page';
import { LeaveHistoryPage } from '@/features/leave/pages/leave-history-page';
import { LeaveApprovalsPage } from '@/features/leave/pages/leave-approvals-page';
import { LeaveAnalyticsPage } from '@/features/leave/pages/leave-analytics-page';
import { LeaveBalancePage } from '@/features/leave/pages/leave-balance-page';
```

#### 2. Using Leave API
```typescript
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  listLeaves,
  getLeaveBalance,
  getLeaveAnalytics,
} from '@/features/leave/api/leave-api';

// Apply for leave
const leaveRequest = await applyLeave({
  leaveType: 'annual',
  startDate: '2024-06-01',
  endDate: '2024-06-05',
  daysRequested: 5,
  reason: 'Family vacation'
});

// Get leave balance
const balance = await getLeaveBalance();
console.log(balance.leaveTypes.annual.available); // 15 days

// List leaves
const { items, meta } = await listLeaves({ status: 'pending', page: 1, limit: 10 });

// Admin: Approve leave
await approveLeave('leaveId123', { comment: 'Enjoy your break!' });

// Admin: Reject leave
await rejectLeave('leaveId123', { rejectionReason: 'Budget constraint' });

// Admin: Get analytics
const analytics = await getLeaveAnalytics({ groupBy: 'leaveType' });
```

#### 3. Using Components
```typescript
// Status badge
import { LeaveStatusBadge } from '@/features/leave/components/leave-status-badge';
<LeaveStatusBadge status="approved" />

// Leave card
import { LeaveCard } from '@/features/leave/components/leave-card';
<LeaveCard 
  leave={leaveData}
  onClick={() => navigate(`/leaves/${leaveData._id}`)}
  showApprovalActions={true}
  onApprove={handleApprove}
  onReject={handleReject}
/>

// Balance card
import { LeaveBalanceCard } from '@/features/leave/components/leave-balance-card';
<LeaveBalanceCard 
  leaveType="annual"
  balance={balanceData.leaveTypes.annual}
/>

// Timeline
import { LeaveTimeline } from '@/features/leave/components/leave-timeline';
<LeaveTimeline leave={leaveData} />

// Apply form
import { ApplyLeaveForm } from '@/features/leave/components/apply-leave-form';
<ApplyLeaveForm 
  onSubmit={handleSubmit}
  isLoading={isLoading}
  availableBalance={balances}
/>

// Approval form
import { LeaveApprovalForm } from '@/features/leave/components/leave-approval-form';
<LeaveApprovalForm 
  onApprove={handleApprove}
  onReject={handleReject}
  isLoading={isLoading}
/>
```

---

### For Backend Developers

#### 1. Using Leave Service
```javascript
import {
  applyLeave,
  approveLeave,
  rejectLeave,
  getLeaveBalance,
  listLeaves,
  getLeaveAnalytics,
} from '../services/leave.service.js';

// Employee applies for leave
const leave = await applyLeave(
  {
    leaveType: 'annual',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-05'),
    daysRequested: 5,
    reason: 'Family vacation',
  },
  authUser // { id, role, email }
);

// Admin approves leave
const approvedLeave = await approveLeave(leaveId, adminUser, 'Approved - enjoy!');

// Admin rejects leave
const rejectedLeave = await rejectLeave(leaveId, adminUser, 'Budget constraints');

// Get employee leave balance
const balance = await getLeaveBalance(employeeId, '2024-2025');

// List leaves with filters
const { items, pagination } = await listLeaves(
  {
    page: 1,
    limit: 10,
    status: 'pending',
    leaveType: 'annual',
  },
  authUser
);

// Get analytics
const analytics = await getLeaveAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  groupBy: 'leaveType',
});
```

#### 2. API Endpoints Reference

**Apply Leave**
```bash
POST /api/v1/leaves
Content-Type: application/json

{
  "leaveType": "annual",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "daysRequested": 5,
  "reason": "Family vacation",
  "attachments": [
    { "fileName": "doc.pdf", "fileUrl": "https://..." }
  ]
}

Response:
{
  "success": true,
  "message": "Leave application submitted successfully",
  "data": {
    "_id": "...",
    "employee": { ... },
    "leaveType": "annual",
    "status": "pending",
    "startDate": "2024-06-01T00:00:00Z",
    "endDate": "2024-06-05T00:00:00Z",
    "daysRequested": 5,
    ...
  }
}
```

**Get Leave Balance**
```bash
GET /api/v1/leaves/balance

Response:
{
  "success": true,
  "message": "Leave balance fetched successfully",
  "data": {
    "_id": "...",
    "employee": { ... },
    "fiscal_year": "2024-2025",
    "leaveTypes": {
      "annual": {
        "allocated": 20,
        "used": 5,
        "pending": 0,
        "carried_over": 0
      },
      ...
    }
  }
}
```

**List Leaves**
```bash
GET /api/v1/leaves?page=1&limit=10&status=pending&leaveType=annual

Response:
{
  "success": true,
  "message": "Leave applications fetched successfully",
  "data": [ { ... }, { ... } ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

**Approve Leave**
```bash
POST /api/v1/leaves/:leaveId/approve
Content-Type: application/json

{
  "comment": "Approved - enjoy your break!"
}

Response:
{
  "success": true,
  "message": "Leave approved successfully",
  "data": { ... }
}
```

**Reject Leave**
```bash
POST /api/v1/leaves/:leaveId/reject
Content-Type: application/json

{
  "rejectionReason": "Budget constraints this quarter"
}

Response:
{
  "success": true,
  "message": "Leave rejected successfully",
  "data": { ... }
}
```

**Get Analytics**
```bash
GET /api/v1/leaves/analytics/report?groupBy=leaveType

Response:
{
  "success": true,
  "message": "Leave analytics fetched successfully",
  "data": [
    {
      "_id": "annual",
      "totalDays": 150,
      "count": 30
    },
    {
      "_id": "sick",
      "totalDays": 80,
      "count": 20
    }
  ]
}
```

---

#### 3. Database Query Examples

**Find all pending leaves for review**
```javascript
const pendingLeaves = await Leave.find({ status: 'pending' })
  .populate('employee appliedBy')
  .sort({ appliedAt: -1 })
  .limit(10);
```

**Get employee's leave history**
```javascript
const history = await Leave.find({ employee: employeeId })
  .sort({ appliedAt: -1 })
  .exec();
```

**Get leave balance for current fiscal year**
```javascript
const balance = await LeaveBalance.findOne({
  employee: employeeId,
  fiscal_year: '2024-2025',
});
```

**Calculate utilization**
```javascript
const stats = await Leave.aggregate([
  { $match: { status: 'approved' } },
  {
    $group: {
      _id: '$leaveType',
      totalDays: { $sum: '$daysRequested' },
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
]);
```

---

## Data Models

### Leave Document
```json
{
  "_id": "ObjectId",
  "employee": "ObjectId(ref:Employee)",
  "leaveType": "annual|sick|casual|personal|unpaid|maternity|paternity",
  "status": "pending|approved|rejected|cancelled",
  "startDate": "Date",
  "endDate": "Date",
  "daysRequested": "Number",
  "reason": "String",
  "appliedAt": "Date",
  "appliedBy": "ObjectId(ref:User)",
  "approvedAt": "Date",
  "approvedBy": "ObjectId(ref:User)",
  "rejectionReason": "String|null",
  "comments": [
    {
      "author": "ObjectId(ref:User)",
      "text": "String",
      "createdAt": "Date"
    }
  ],
  "attachments": [
    {
      "fileName": "String",
      "fileUrl": "String",
      "uploadedAt": "Date"
    }
  ],
  "notificationsSent": [
    {
      "type": "application|approval|rejection|reminder",
      "sentAt": "Date",
      "recipients": ["ObjectId"]
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### LeaveBalance Document
```json
{
  "_id": "ObjectId",
  "employee": "ObjectId(ref:Employee)",
  "fiscal_year": "2024-2025",
  "leaveTypes": {
    "annual": {
      "allocated": 20,
      "used": 5,
      "pending": 2,
      "carried_over": 0
    },
    "sick": { ... },
    "casual": { ... },
    "personal": { ... },
    "unpaid": { ... },
    "maternity": { ... },
    "paternity": { ... }
  },
  "lastUpdated": "Date",
  "updatedBy": "ObjectId(ref:User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Common Tasks

### Task: Add custom leave type
1. Update `LeaveType` type in `leave.ts`
2. Add to `LEAVE_TYPES` array in leave pages
3. Add to enum in `leave.schema.js`
4. Update `LeaveBalance` model with new type
5. Add color config in `LEAVE_STATUS_CONFIG`

### Task: Extend leave with attachments
Attachments are already supported! They're stored in the `attachments` array:
```javascript
attachments: [
  {
    fileName: "medical_certificate.pdf",
    fileUrl: "https://storage.example.com/...",
    uploadedAt: Date.now()
  }
]
```

### Task: Add SMS notifications
Hook into the service after leave actions:
```javascript
// In leave.service.js after approveLeave
await smsService.send({
  phone: leave.employee.phone,
  message: `Your leave request has been approved!`
});
```

### Task: Generate leave report
```javascript
const report = await Leave.find({
  status: 'approved',
  startDate: { $gte: new Date('2024-01-01') }
}).exec();

// Convert to CSV and send
```

---

## Validation Rules

### Leave Application
- Start date must not be in the past
- End date must be after or equal to start date
- Employee must have sufficient balance (except unpaid)
- No overlapping approved/pending leaves
- Reason must be at least 10 characters

### Approval/Rejection
- Leave must be in 'pending' status
- Rejection reason required when rejecting
- Comment is optional but recommended

### Balance
- Cannot have negative balance
- Pending days reserved until approval/rejection
- New fiscal year rolls over remaining balance

---

## Error Codes

| Status | Message | Meaning |
|--------|---------|---------|
| 400 | Insufficient leave balance | Employee doesn't have enough days |
| 400 | You have overlapping leave applications | Conflicting leave dates |
| 400 | Cannot apply for past leaves | Start date is in past |
| 400 | Start date must be before end date | Invalid date range |
| 401 | Invalid email or password | Auth failed |
| 403 | Not authorized to cancel this leave | Permission denied |
| 404 | Leave request not found | Invalid leave ID |
| 409 | Conflict | Concurrent update issue |

---

## Performance Tips

1. **Indexing:** Queries on employee, status, and dates are indexed
2. **Pagination:** Always use pagination for list queries
3. **Caching:** Cache leave balance for current session
4. **Aggregation:** Use MongoDB aggregation for analytics
5. **Batch:** Bulk update balances at fiscal year end

---

## Testing Checklist

- [ ] Apply for various leave types
- [ ] Check balance updates correctly
- [ ] Approve and verify status change
- [ ] Reject with reason
- [ ] Cancel approved leave
- [ ] Add comments
- [ ] View timeline
- [ ] Check analytics
- [ ] Test role permissions
- [ ] Verify validations

---

For full documentation, see `LEAVE_MANAGEMENT_INTEGRATION.md`
