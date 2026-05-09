# HRMS Backend Architecture (Production Foundation)

## 1) Folder Structure

```text
server/
  .env.example
  package.json
  src/
    app.js
    index.js
    server.js
    config/
      database.js
      env.js
      logger.js
    constants/
      http-status.js
      roles.js
    controllers/
      auth.controller.js
      health.controller.js
    middlewares/
      auth.middleware.js
      error.middleware.js
      not-found.middleware.js
      request-id.middleware.js
      request-logger.middleware.js
      role.middleware.js
      security.middleware.js
      validate.middleware.js
    models/
      refresh-token.model.js
      user.model.js
    routes/
      index.js
      v1/
        auth.route.js
        health.route.js
        index.js
    schemas/
      auth.schema.js
    services/
      token.service.js
    utils/
      api-error.js
      api-response.js
      async-handler.js
```

## 2) Base Server Setup

- `src/index.js`: process entrypoint.
- `src/server.js`: startup orchestration (DB connect -> app listen).
- `src/app.js`: express app creation + middleware + versioned routes.
- API versioning path: `${API_PREFIX}/${API_VERSION}` (default `/api/v1`).

## 3) Middleware Architecture

Execution order:
1. `request-id.middleware.js`
2. `security.middleware.js` (helmet, cors, parser, compression, rate limit)
3. `request-logger.middleware.js` (morgan -> structured logger)
4. versioned routers
5. `not-found.middleware.js`
6. `error.middleware.js`

Cross-cutting middleware:
- `validate.middleware.js` for Zod request validation.
- `auth.middleware.js` for JWT access token verification.
- `role.middleware.js` for role-based authorization.

## 4) Error Handling System

- Operational errors are represented by `ApiError`.
- Single global error serializer in `error.middleware.js`.
- Standardized failure payload:
  - `success: false`
  - `message`
  - `error` details (safe/operational only)
- Unknown/internal errors return generic server-safe details.

## 5) Authentication Architecture

JWT approach:
- Access token: short-lived (`JWT_ACCESS_EXPIRES_IN`, default 15m)
- Refresh token: longer-lived (`JWT_REFRESH_EXPIRES_IN`, default 7d)

Key files:
- `services/token.service.js`: sign/verify token utilities.
- `models/refresh-token.model.js`: persistent refresh-token session store.
- `routes/v1/auth.route.js`: login, refresh-token, me endpoints.
- `middlewares/auth.middleware.js`: access token gate.

Current scaffold note:
- Auth controller includes a minimal placeholder identity flow.
- Replace with real user lookup + password hash validation before production launch.

## 6) API Response Standard

Success:
```json
{
  "success": true,
  "message": "Human readable summary",
  "data": {},
  "meta": null,
  "error": null
}
```

Error:
```json
{
  "success": false,
  "message": "Human readable error",
  "data": null,
  "meta": null,
  "error": {}
}
```

## 7) Environment Variable Structure

Defined in `.env.example`:
- Runtime: `NODE_ENV`, `PORT`
- API namespacing: `API_PREFIX`, `API_VERSION`
- CORS: `CLIENT_ORIGIN`
- Database: `MONGODB_URI`
- JWT secrets: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- JWT TTL: `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`

Env loading and required checks are centralized in `config/env.js`.

## 8) Security Best Practices Included

- `helmet` for secure headers.
- CORS configured with explicit client origin and credentials support.
- request size limits on JSON/urlencoded parsers.
- global rate limiting.
- compression enabled.
- auth tokens verified for protected routes.
- role guard middleware for access control boundaries.
- refresh tokens modeled with revocation + TTL index support.

## Next Steps (when you add business modules)

- Build feature modules under `controllers + routes + schemas + services`.
- Add password hashing (`bcryptjs`) and credential verification in auth service.
- Store hashed refresh tokens and rotate on each refresh.
- Add audit logging per critical action (approval, payroll, leave policy changes).
