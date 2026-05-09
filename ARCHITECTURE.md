# NewHRMS Frontend Architecture

Production-ready frontend architecture for:
- React + Vite
- Tailwind + ShadCN UI
- React Router
- React Query
- Axios
- Framer Motion

No feature pages are included in this scaffold.

## 1) Folder Structure

```text
src/
  app/
    layouts/
      auth-layout.tsx
      dashboard-layout.tsx
      public-layout.tsx
    app-router.tsx
    error-boundary.tsx
    providers.tsx
    query-client.ts
  features/
    auth/
      lib/
        route-guards.tsx
      model/
        auth-context.tsx
  shared/
    api/
      api-client.ts
      endpoints.ts
    config/
      env.ts
      routes.ts
    lib/
      cn.ts
      roles.ts
    types/
      auth.ts
    ui/
      feedback/
        app-toaster.tsx
      states/
        app-loader.tsx
        error-state.tsx
        section-skeleton.tsx
  main.tsx
```

Guideline:
- `app`: app composition and global wiring
- `features`: business-capability modules
- `shared`: framework-agnostic and reusable pieces

## 2) Routing Architecture

- Single route map in `shared/config/routes.ts`.
- Router assembled in `app/app-router.tsx`.
- Guard hierarchy:
  - `RequireAuth`: checks authentication.
  - `RequireRole`: checks role access per route (`admin` / `employee`).
- Layout-wrapped route groups:
  - Public routes -> `PublicLayout`
  - Auth routes -> `AuthLayout`
  - App routes -> `DashboardLayout` + guards

Pattern:
- Keep route definitions declarative and role metadata co-located.
- Keep page-level lazy imports in route modules when features are added.

## 3) Layout Architecture

Layouts are structural shells only:
- `PublicLayout`: marketing/help/public docs pages
- `AuthLayout`: login/reset pages
- `DashboardLayout`: authenticated shell (sidebar + navbar + content)

Rules:
- No business logic in layouts.
- Use `Outlet` and shared UI primitives.
- Keep responsive behavior centralized at layout level.

## 4) Shared Component Structure

Inside `shared/ui`:
- `feedback`: toast, alerts, banners
- `states`: loaders, skeletons, empty/error states
- `data-display`, `forms`, `navigation` (add as app grows)

Rules:
- Shared components are domain-agnostic.
- Feature-specific components stay inside `features/<feature>/ui`.

## 5) API Handling Pattern

- Axios instance in `shared/api/api-client.ts`.
- Request/response interceptors for:
  - access token attachment
  - response normalization
  - auth error handling
- Endpoint constants in `shared/api/endpoints.ts`.

Use React Query for all server state:
- Query keys are centralized per feature.
- Mutations invalidate relevant keys only.
- Never store server responses in local global state unless needed.

## 6) State Management Strategy

State split:
- Server state: React Query
- Session/auth state: lightweight React Context (`features/auth/model/auth-context.tsx`)
- UI ephemeral state: local component state
- Cross-page UI state (if needed): small client store later (Zustand pattern optional)

This keeps architecture simple and scalable without over-abstracting early.

## 7) Naming Conventions

Files/folders:
- Use kebab-case: `dashboard-layout.tsx`, `route-guards.tsx`
- Components/types: PascalCase exports
- Hooks: `useXxx`
- Constants: UPPER_SNAKE_CASE

Patterns:
- `*.tsx` for view code
- `*.ts` for logic/config/types
- Avoid `index.ts` barrels until module boundaries stabilize

## 8) Feature-Based Architecture Rules

Each feature can grow like:

```text
features/
  employees/
    api/
    model/
    ui/
    routes/
    types/
```

Rules:
- Feature never imports from another feature directly.
- Shared contracts go to `shared/types` or `shared/lib`.
- Routing can stay centralized in app router, but feature route objects should be exported from `features/<feature>/routes`.

## Cross-Cutting Requirements

- Error boundary: global `AppErrorBoundary`
- Loading states:
  - `AppLoader` for app bootstrap
  - `SectionSkeleton` for route/module loading
- Toast system: `AppToaster` mounted once in `AppProviders`
- Protected + role-based routing: `RequireAuth`, `RequireRole`

## Scale Notes

- Keep modules independent and testable.
- Introduce code-splitting with lazy routes per feature.
- Add request cancellation + retry tuning in Query Client for high-traffic dashboards.
