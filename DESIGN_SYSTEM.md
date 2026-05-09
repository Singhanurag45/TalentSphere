# NewHRMS Design System

Design direction: friendly enterprise SaaS inspired by Deel, Rippling, and BambooHR.

Core traits:
- Rounded interface with pill controls
- Soft depth and floating widgets
- Professional hierarchy with approachable colors
- Clean enterprise spacing and strong readability

---

## 1) Typography System

Primary stack:
- Heading: `Manrope`, fallback `Inter`
- Body/UI: `Inter`
- Data/Code: `JetBrains Mono`

Scale (desktop first):
- Display 2XL: `48/52`, `700`
- Display XL: `40/46`, `700`
- Display LG: `32/38`, `700`
- H1: `30/38`, `700`
- H2: `24/32`, `700`
- H3: `20/28`, `600`
- H4: `18/26`, `600`
- Body LG: `18/28`, `400`
- Body MD: `16/24`, `400`
- Body SM: `14/22`, `400`
- Label MD: `14/20`, `500`
- Label SM: `12/18`, `500`

Rules:
- Keep heading tracking slightly tight (`-0.02em` to `-0.03em`)
- Use `500` for interactive labels, `400` for paragraph copy
- Minimum body text size: `14px`

---

## 2) Color Palette

Semantic colors are provided as CSS variables in `src/styles/design-tokens.css`.

Brand palette intent:
- Primary Blue: trust, productivity actions
- Secondary Violet: modern, high-value highlights
- Success Green, Warning Amber, Danger Red, Info Cyan
- Soft pastel variants for widgets and stat cards

Usage:
- Primary buttons, active nav: `primary`
- Section highlights/chips: `secondary-soft`, `accent`
- Data status: `success|warning|danger|info` (+ `-soft` for backgrounds)
- Neutral surfaces: `background`, `card`, `muted`

Contrast:
- Always use `*-foreground` on semantic backgrounds
- In dark mode, avoid pure black surfaces to preserve a premium look

---

## 3) Spacing System

Base step: `4px` with Tailwind scale.

Practical spacing rhythm:
- Micro: `2, 4, 6, 8`
- Component internal: `12, 16, 20`
- Section spacing: `24, 32, 40`
- Page block spacing: `48, 56, 64`

Layout rules:
- Card padding: `p-4` mobile, `p-5` desktop
- Form vertical gap: `gap-4`
- Dense toolbars: `gap-2`, standard toolbars: `gap-3`

---

## 4) Grid System

Container:
- Max width: `1400px` (set in Tailwind container)
- Horizontal padding: `16px` mobile, `24px` tablet, `32px` desktop

Dashboard:
- Desktop: `grid-cols-dashboard` (`260px + content`)
- Tablet: collapsible sidebar with full-width content
- Mobile: single-column stack

Content grids:
- KPI cards: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- Main analytics + activity: `xl:grid-cols-3` with `col-span-2 / 1`

---

## 5) Border Radius System

Use generous radius to keep a friendly SaaS tone:
- Inputs/buttons (pill): `rounded-full`
- Small chips: `rounded-xl`
- Cards/widgets: `rounded-2xl`
- Large modal surfaces: `rounded-2xl` or `rounded-[1.75rem]`

Avoid mixed radius in same block unless nested by hierarchy.

---

## 6) Shadow System

Shadow tokens (in Tailwind):
- `shadow-soft`: subtle controls and rows
- `shadow-card`: default card elevation
- `shadow-float`: modals, floating widget panels
- `shadow-focus`: accessible ring-style focus enhancement

Rules:
- One dominant shadow per component
- Increase shadow only for interactive/floating states

---

## 7) Button Variants (ShadCN compatible intent)

Base button style:
- Height `44px` (`h-11`)
- Pill shape `rounded-full`
- Horizontal padding `px-5`
- Medium weight `font-medium`
- Focus ring with semantic `ring`

Variants:
- `primary`: filled `bg-primary text-primary-foreground`
- `secondary`: filled `bg-secondary text-secondary-foreground`
- `outline`: `bg-background border-input hover:bg-muted`
- `ghost`: transparent with subtle muted hover
- `soft`: pastel background (`bg-primary-soft text-primary`)
- `danger`: `bg-danger text-danger-foreground`

Sizes:
- `sm`: `h-9 px-4 text-sm`
- `md`: `h-11 px-5 text-sm`
- `lg`: `h-12 px-6 text-base`
- Icon-only: `h-10 w-10 rounded-full`

---

## 8) Form Styles

Inputs/select/textarea:
- Pill for input/select, rounded-xl/2xl for textarea
- Border: `border-input`
- Focus: ring + border color shift to `primary`
- Helper text: `text-sm text-muted-foreground`

Label and grouping:
- Label: `text-sm font-medium`
- Vertical rhythm: `space-y-2` within field, `gap-4` across fields
- Two-column forms at `lg:` with equal or 2:1 field distribution

Validation:
- Error text: `text-danger text-sm`
- Error input: `border-danger focus:ring-danger/25`
- Success state: icon + `text-success`

---

## 9) Table Styles

Table shell:
- Container: `.hrms-table-shell`
- Header row: muted background, sticky for long data
- Row height: `48px` minimum
- Cell paddings: `px-4 py-3`

Behavior:
- Zebra optional (`odd:bg-background even:bg-muted/35`)
- Hover row: `hover:bg-primary-soft/60`
- Selection row: `bg-accent`

Enterprise readability:
- Left-align text except numeric columns
- Use monospaced numerics for payroll and currency figures

---

## 10) Card Styles

Card archetypes:
- Standard: white/dark surface + border + `shadow-card`
- Soft stat card: pastel background + low shadow (`hrms-card-soft`)
- Interactive card: add hover lift (`hover:-translate-y-0.5 hover:shadow-float`)

Card anatomy:
- Header row with title + action
- Metric/value zone (large font)
- Footer/meta row for trends

---

## 11) Modal Styles

Surface:
- Width: `max-w-lg` standard, `max-w-3xl` workflow modals
- Radius: `rounded-2xl`
- Shadow: `shadow-float`
- Backdrop: `bg-slate-900/50` with subtle blur

Structure:
- Header with title and concise supporting text
- Body sections separated by `space-y-4`
- Footer with right-aligned CTAs, primary action last

---

## 12) Toast Notification Styles

Placement:
- Top-right desktop, top-center mobile

Visual:
- Rounded-xl, border, soft shadow
- Icon badge with semantic color
- Title + optional supporting line

Types:
- Success: green tint
- Warning: amber tint
- Error: red tint
- Info: cyan tint

Motion:
- Enter: `animate-slide-in-up`
- Exit: opacity fade + slight upward motion

---

## 13) Sidebar Design

Layout:
- Width `260px` desktop, overlay drawer on mobile
- Surface uses `sidebar` tokens
- Vertical section grouping with clear labels

Items:
- Height `40-44px`, pill active state
- Active item: `bg-sidebar-active text-sidebar-active-foreground`
- Inactive hover: `bg-muted/60`
- Include icon + label; badge counts optional

Bottom area:
- Workspace/account switcher
- Compact help/support links

---

## 14) Navbar Design

Top bar:
- Height `64px`
- Sticky with translucent background (`bg-background/90`) and blur
- Left: page title + breadcrumbs
- Right: global search, quick actions, notifications, user menu

Controls:
- Search input rounded-full with leading icon
- Icon buttons are circular with muted hover

---

## 15) Mobile Responsiveness Rules

Breakpoints:
- `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536

Rules:
- Collapse sidebar to drawer below `lg`
- KPI cards move from 4/3 columns to 2 then 1
- Reduce modal to near full-screen on mobile (`max-h-[90vh]`)
- Preserve minimum tap target `44x44`
- Keep key actions sticky where useful (e.g., form submit bar)

Typography on small screens:
- Shift one step down for display headings
- Maintain body at `14-16px`

---

## 16) Dark Mode System

Strategy:
- Class-based dark mode (`.dark`)
- Keep same semantic token names; swap values only
- Preserve pastel intent with deeper muted tints in dark

Dark mode rules:
- Use rich navy-charcoal surfaces, not pure black
- Increase border contrast slightly for component separation
- Keep primary/secondary vivid enough for accessibility
- Soften shadow opacity but maintain depth layering

---

## Reusable UI Patterns

1. KPI widget:
- Icon chip + label + value + delta chip
- Optional sparkline area

2. Split analytics block:
- Main chart card (2 cols) + activity list (1 col)

3. People directory panel:
- Search row + filters + table/list + side detail drawer

4. Workflow action bar:
- Sticky top or bottom with primary CTA + secondary actions

5. Empty state:
- Friendly illustration zone + one action + one assistive link

---

## Component Styling Guide (ShadCN + Tailwind)

Use these style conventions with generated ShadCN components:
- `Button`: override default radius to pill and use semantic variants
- `Input/Select`: apply `hrms-input`
- `Card`: default `rounded-2xl shadow-card border`
- `DialogContent`: `rounded-2xl shadow-float`
- `Table`: wrap with `hrms-table-shell`
- `Toast`: semantic background tint + icon slot + rounded-xl

Suggested utility recipes:
- Primary CTA:
  - `inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-soft transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20`
- Soft widget:
  - `rounded-2xl border border-transparent bg-primary-soft p-5 shadow-soft`
- Floating panel:
  - `rounded-2xl border bg-card p-4 shadow-float`

---

## Example Dashboard Styling Blueprint

Page scaffold:
- Root: `min-h-screen bg-background`
- Main grid: `lg:grid lg:grid-cols-dashboard`
- Sidebar: fixed desktop column / drawer mobile
- Content shell: `.hrms-page py-6 md:py-8`

Hero row:
- Greeting block + time filter + primary action button

KPI row:
- 4 soft cards on `xl`, 2 on `sm`, 1 on mobile
- Pastel backgrounds rotate between `primary-soft`, `secondary-soft`, `info-soft`, `success-soft`

Middle row:
- Left: attendance or payroll trend chart card
- Right: pending approvals card with quick actions

Bottom row:
- Employee activity table in `hrms-table-shell`
- Floating helper widget anchored bottom-right on desktop

---

## Design Tokens Reference (implemented)

Files:
- `tailwind.config.ts`
- `src/styles/design-tokens.css`

How to activate:
1. Import `src/styles/design-tokens.css` in your app entry file.
2. Ensure `darkMode: ["class"]` is used.
3. Toggle dark mode by adding/removing `.dark` on `html` or `body`.

This gives you a complete scalable foundation ready for ShadCN component implementation.
