# TalentSphere HRMS

TalentSphere HRMS is a full-stack Human Resource Management System for managing employees, attendance, leave workflows, dashboards, reports, and organization settings.

The project is organized as a monorepo with a React frontend and an Express/MongoDB backend.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Forms and validation: React Hook Form, Zod
- Data fetching: TanStack Query, Axios
- UI utilities: Framer Motion, Lucide React, Sonner toasts, Recharts
- Reports: jsPDF, jsPDF AutoTable

## Project Structure

```text
NewHRMS/
  client/   React + Vite frontend
  server/   Express + MongoDB backend
```

## Features

### Authentication and Roles

- JWT-based authentication
- Refresh-token cookie support
- Role-based route access for admin and employee users
- Protected dashboard layouts for each role

### Employee Management

- Add, edit, view, and manage employees
- Employee profile page and profile cards
- Department, designation, employment type, salary, skills, and contact details
- Admin employee listing with filters and actions

### Leave Management

- Employee leave application flow
- Leave balance by leave type
- Leave history with timeline
- Admin leave approval page
- Status filters for all, pending, approved, rejected, and cancelled leaves
- Approve/reject workflow with comments and reasons
- Automatic balance movement:
  - On apply: pending leave increases
  - On approve: pending decreases and used increases
  - On reject: pending decreases
  - Dashboard available leave uses `allocated - used - pending`

### Dashboard

- Employee dashboard shows real leave balance, used days, and pending requests
- Admin dashboard shows latest leave requests and approval counts
- Dashboard cards use live API data where available
- Attendance and performance chart widgets

### Notifications

- In-app notification bell in the top navbar
- Admin receives a notification when an employee submits a leave request
- Employee receives a notification when a leave request is approved or rejected
- Unread notification count
- Mark single notification as read
- Mark all notifications as read
- Notification links navigate to leave approvals or leave history

### Settings

- Organization settings
- Branding settings
- Leave policy settings
- Attendance policy settings
- Notification preferences
- Security and role settings

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB running locally or a MongoDB connection string

### 1. Configure Server

Create `server/.env` from `server/.env.example`.

```env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
API_VERSION=v1
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/newhrms
JWT_ACCESS_SECRET=replace_with_access_secret
JWT_REFRESH_SECRET=replace_with_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REFRESH_COOKIE_NAME=hrms_refresh_token
COOKIE_SECURE=false
SEED_ADMIN_EMAIL=admin@newhrms.com
SEED_ADMIN_PASSWORD=Admin@12345
```

Install and run the backend:

```bash
cd server
npm install
npm run dev
```

Backend API runs at:

```text
http://localhost:3000/api/v1
```

Health check:

```text
GET http://localhost:3000/api/v1/health
```

### 2. Configure Client

Create `client/.env` from `client/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Install and run the frontend:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Demo Login Credentials

### Admin

- Email: `admin@newhrms.com`
- Password: `Admin@12345`

### Guest Employee

- Email: `employee.guest@newhrms.com`
- Password: `Employee@123`

## Important Frontend Routes

- `/dashboard` - role-based dashboard home
- `/employees` - admin employee management
- `/employees/:employeeId` - employee profile
- `/leaves` - role-based leave redirect
- `/leaves/apply` - employee apply leave
- `/leaves/history` - employee leave history
- `/leaves/balance` - leave balance
- `/leaves/approvals` - admin approval page
- `/leaves/analytics` - admin leave analytics
- `/settings` - role-based settings area

## Main API Routes

### Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`

### Employees

- `GET /api/v1/employees`
- `POST /api/v1/employees`
- `GET /api/v1/employees/:employeeId`
- `PATCH /api/v1/employees/:employeeId`
- `DELETE /api/v1/employees/:employeeId`

### Leaves

- `POST /api/v1/leaves`
- `GET /api/v1/leaves`
- `GET /api/v1/leaves/:leaveId`
- `GET /api/v1/leaves/balance`
- `GET /api/v1/leaves/history/:employeeId?`
- `POST /api/v1/leaves/:leaveId/approve`
- `POST /api/v1/leaves/:leaveId/reject`
- `POST /api/v1/leaves/:leaveId/cancel`
- `GET /api/v1/leaves/approvals/pending-count`
- `GET /api/v1/leaves/analytics/report`

### Notifications

- `GET /api/v1/notifications`
- `PATCH /api/v1/notifications/:notificationId/read`
- `PATCH /api/v1/notifications/read-all`

## Leave Workflow

1. Employee applies for leave from `/leaves/apply`.
2. Backend validates dates, overlapping leaves, and available balance.
3. Leave is created with `pending` status.
4. Employee pending balance increases.
5. Admin receives a notification.
6. Admin reviews the request from `/leaves/approvals`.
7. If approved:
   - Leave status becomes `approved`
   - Pending balance decreases
   - Used balance increases
   - Employee receives an approval notification
8. If rejected:
   - Leave status becomes `rejected`
   - Pending balance decreases
   - Rejection reason is stored
   - Employee receives a rejection notification
9. Employee can view final status in `/leaves/history`.

## Build

Build the frontend:

```bash
cd client
npm run build
```

Start the backend normally:

```bash
cd server
npm start
```

## Notes

- Restart the backend after adding or changing models/routes.
- Ensure MongoDB is running before starting the server.
- The admin seed user is configured from `server/.env`.
- The notification system stores in-app notifications in MongoDB.
