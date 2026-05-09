# TalentSphere HRMS

Monorepo for the TalentSphere HRMS platform.

## Project Structure

- `client/` -> React + Vite frontend
- `server/` -> Express + MongoDB backend

## Run Locally

### 1) Client

```bash
cd client
npm install
npm run dev
```

### 2) Server

```bash
cd server
npm install
npm run dev
```

## API Base

- Base URL: `http://localhost:3000/api/v1`
- Health: `GET http://localhost:3000/api/v1/health`

## Demo Login Credentials

### Admin

- Email: `admin@newhrms.com`
- Password: `Admin@12345`

### Guest Employee

- Email: `employee.guest@newhrms.com`
- Password: `Employee@123`

## Leave Management Module

Implemented leave workflow with role-based access and responsive UI.

### Features

- Apply leave (employee)
- Approve leave (admin)
- Reject leave (admin)
- Leave balance tracking
- Leave history with timeline view
- Leave analytics dashboard (admin)

### Workflow Summary

1. Employee submits leave request
2. Request goes to `pending`
3. Admin approves or rejects
4. Leave balances are updated automatically
5. Employee can review full leave history and status timeline

### Main Leave Routes

Frontend:
- `/leaves` (role-based redirect)
- `/leaves/apply`
- `/leaves/history`
- `/leaves/balance`
- `/leaves/approvals` (admin)
- `/leaves/analytics` (admin)

Backend:
- `POST /api/v1/leaves` (apply)
- `POST /api/v1/leaves/:leaveId/approve` (admin)
- `POST /api/v1/leaves/:leaveId/reject` (admin)
- `GET /api/v1/leaves/balance`
- `GET /api/v1/leaves/history/:employeeId?`
- `GET /api/v1/leaves/analytics/report` (admin)

## In-Depth Feature Flows

### 1) Apply Leave (Employee)

**Goal:** Employee submits a leave request with validation and workflow tracking.

**Frontend flow**
1. Employee opens `/leaves/apply`.
2. UI fetches current leave balance via `GET /api/v1/leaves/balance`.
3. Employee fills reusable `ApplyLeaveForm`:
   - Leave type
   - Start and end date
   - Reason
4. Form performs client-side checks:
   - Required fields
   - End date is after/equal to start date
   - Reason length minimum
   - Balance check for paid leave types
5. On submit, frontend calls `POST /api/v1/leaves`.
6. Success feedback toast is shown and user is redirected to `/leaves/history`.

**Backend flow**
1. Request passes authentication middleware (`requireAuth`).
2. Payload is validated by `applyLeaveSchema`.
3. Service resolves employee profile from authenticated user email.
4. Server validations:
   - Date range valid
   - No past leave application
   - No overlapping pending/approved leave
   - Sufficient leave balance (except unpaid leave)
5. Leave document is created with status `pending`.
6. Pending count is deducted in leave balance (`leaveTypes.<type>.pending += daysRequested`).
7. API responds with created leave data.

**Data impact**
- `leaves` collection: new pending leave entry
- `leave_balances` collection: pending days incremented

---

### 2) Approve Leave (Admin)

**Goal:** Admin reviews pending requests and approves valid ones.

**Frontend flow**
1. Admin opens `/leaves/approvals`.
2. Pending requests are fetched via `GET /api/v1/leaves?status=pending`.
3. Admin selects a request to view details + timeline.
4. Admin uses `LeaveApprovalForm` and confirms approval (optional comment).
5. Frontend calls `POST /api/v1/leaves/:leaveId/approve`.
6. On success, list refreshes and pending count decreases.

**Backend flow**
1. Route enforces:
   - Authenticated user
   - Role check (`admin`)
2. Payload validated with `approveLeaveSchema`.
3. Service checks:
   - Leave exists
   - Current status is `pending`
4. Leave status updates to `approved` with approver + timestamp.
5. Optional comment is appended to leave comments.
6. Leave balance updates:
   - `pending -= daysRequested`
   - `used += daysRequested`
7. Response returns updated leave record.

**Data impact**
- `leaves`: status -> `approved`
- `leave_balances`: pending to used movement

---

### 3) Reject Leave (Admin)

**Goal:** Admin rejects leave request with mandatory reason for traceability.

**Frontend flow**
1. Admin opens a pending request in `/leaves/approvals`.
2. Admin switches to reject mode in `LeaveApprovalForm`.
3. Admin enters rejection reason.
4. Frontend calls `POST /api/v1/leaves/:leaveId/reject`.
5. UI updates card/status/timeline after success.

**Backend flow**
1. Route enforces auth + admin role.
2. `rejectLeaveSchema` validates `rejectionReason`.
3. Service checks leave existence and `pending` status.
4. Leave status set to `rejected` with:
   - approver
   - processed timestamp
   - rejection reason
5. Leave balance updates:
   - `pending -= daysRequested`
   - No increment in `used`
6. Response returns updated leave.

**Data impact**
- `leaves`: status -> `rejected` and reason captured
- `leave_balances`: pending reduced

---

### 4) Leave Balances (Employee/Admin)

**Goal:** Show real-time available, used, and pending leave capacity.

**Frontend flow**
1. User opens `/leaves/balance` (or side panel in apply flow).
2. Frontend requests `GET /api/v1/leaves/balance`.
3. UI renders:
   - Total allocated
   - Used
   - Pending
   - Leave-type cards (annual, sick, casual, etc.)
4. Available balance logic:
   - `available = allocated - used - pending`

**Backend flow**
1. Auth middleware validates requester.
2. Query schema validates optional `employeeId` and `fiscalYear`.
3. Service fetches leave balance by employee and fiscal year.
4. If missing, appropriate not-found response is returned.

**Data source**
- `leave_balances` with per-leave-type counters:
  - `allocated`
  - `used`
  - `pending`
  - `carried_over`

---

### 5) Leave History + Timeline (Employee/Admin)

**Goal:** Provide complete audit trail of leave lifecycle.

**Frontend flow**
1. User opens `/leaves/history`.
2. Frontend fetches paginated leaves via `GET /api/v1/leaves`.
3. User can filter by status and leave type.
4. On selecting an item, detail panel shows:
   - leave metadata
   - reason
   - status badge
   - timeline (applied, approved/rejected, pending state)
   - comments history

**Backend flow**
1. Auth middleware validates user.
2. Query schema validates pagination and filters.
3. Service applies role-based access:
   - Employee: own leaves only
   - Admin: can query broader dataset
4. Results are sorted by latest application date.
5. API returns items + pagination meta.

**Audit consistency**
- Every decision is reflected in timeline-ready fields:
  - `appliedAt`, `approvedAt`
  - `appliedBy`, `approvedBy`
  - `status`, `rejectionReason`
  - `comments[]`

---

### 6) Leave Analytics (Admin)

**Goal:** Give admin actionable insights on leave usage patterns.

**Frontend flow**
1. Admin opens `/leaves/analytics`.
2. Frontend requests analytics grouped by:
   - leave type
   - status
3. Dashboard renders:
   - summary KPIs (requests, total days, average duration)
   - charts (bar/pie)
   - insight highlights (most used type, approval rate)

**Backend flow**
1. Route enforces auth + admin role.
2. Query validated by `leaveAnalyticsSchema`.
3. Service builds aggregation pipeline on `leaves`:
   - Match approved records (and optional date filters)
   - Group by requested dimension (`leaveType`, `status`, `employee`)
   - Compute `count` and `totalDays`
4. Returns aggregated dataset for chart consumption.

**Business value**
- Detect high leave categories
- Track policy impact
- Monitor approval behavior
- Support staffing planning

---

### 7) Role-Based Access Control Matrix

- Employee:
  - Apply leave
  - View own balance
  - View own history and timeline
  - Cancel own eligible leave
- Admin:
  - View pending approvals
  - Approve/reject leave
  - View analytics
  - View broader leave datasets

All protected routes use auth middleware, and admin-sensitive routes additionally enforce role checks.

---

### 8) Validation and Error Handling Strategy

- Shared schema validation at API boundary (Zod)
- Business rule validation in service layer
- Consistent API response envelope for success/error
- User-friendly toast messages in frontend
- Timeline/comments preserve decision context for enterprise auditability

## Notes

- Admin user is seeded from `server/.env` (`SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).
- Ensure MongoDB is running before starting the server.
