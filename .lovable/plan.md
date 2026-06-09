
# ReguFlow AI — Frontend Polish Pass

A frontend-only refinement to sharpen storytelling, demo impact, and enterprise feel. No backend, no new workflows, no redesign — additive polish on existing pages and shared components.

## 1. New shared components

Reusable, enterprise-styled, used across pages.

- `src/components/shared/JourneyTracker.tsx` — horizontal 6-step Regulation → Action → Proof workflow with status, count, progress; variants: `dashboard` (full) and `compact` (timeline).
- `src/components/shared/FocusTodayCard.tsx` — featured "Today's Compliance Priority" card with risk, modified clauses, affected departments, recommended action, CTA.
- `src/components/shared/ModeBanner.tsx` — slim banner under TopBar showing active Copilot mode + enabled features; animated swap (200–300ms fade) on mode change.
- `src/components/shared/TrendIndicator.tsx` — `↑6%` / `↓3%` pill with semantic color (success/danger/muted).
- `src/components/shared/EnhancedKpiCard.tsx` — extends current `KpiCard` with optional sub-metrics row + mini progress bar + trend indicator (keeps original `KpiCard` untouched as base).
- `src/components/shared/InsightCard.tsx` — AI-style executive insight card (icon + headline + body + severity stripe).
- `src/components/shared/StatusPipeline.tsx` — horizontal status bar (Pending → Assigned → In Progress → Review → Completed) with counts; used in MAPs and Document Analysis.
- `src/components/shared/Skeleton.tsx` extensions — table-row, card, chart skeletons for consistent loading.

## 2. Page-level changes (additive only)

### Dashboard (`src/pages/Dashboard.tsx`)
1. Insert `JourneyTracker` directly below `PageHeader`.
2. Replace existing "high priority" strip with `FocusTodayCard` (keeps strip data, richer layout).
3. Swap 4 of the 6 KPI cards to `EnhancedKpiCard`:
   - Compliance Health → score + trend + previous month + target + mini bar
   - Audit Readiness → % + open findings + missing evidence + controls verified
   - Active Regulations → total + new this week + high-risk count
   - Pending MAPs → pending + overdue + assigned + completed
4. Add **Recent Regulation Activity** table section (mock data already in `regulations` mock; render change type + status columns).
5. Add **Compliance Timeline** section using `JourneyTracker` compact variant with mock timestamps.
6. Convert "Executive insights" block to use `InsightCard` grid with trend indicators.
7. Chart polish: add hover tooltips with units, legends, `TrendIndicator` next to chart titles.

### TopBar / Layout
- Mount `ModeBanner` in `src/components/Layout.tsx` between `TopBar` and `<main>`. Banner content reads from `CopilotContext`; fades on change.

### CopilotContext (`src/state/CopilotContext.tsx`)
- No API change. Add a small `useCopilotFeatures()` helper returning the feature list per mode (used by `ModeBanner` and Beginner/Expert affordances).

### Beginner / Expert affordances
- Beginner: render existing `BeginnerHint` callouts on Regulations, MAPs, Document Analysis, Audit Readiness with onboarding copy + recommended next action.
- Expert: tighter row padding on `data-table` (via `data-copilot-mode="expert"` selector in `index.css`), show keyboard shortcut hints (`⌘K`, `J/K`) in TopBar and table footers, show bulk-action toolbar shell on tables.
- Transition: 200ms CSS fade on body `[data-copilot-mode]` change via existing utility.

### Document Analysis (`src/pages/DocumentAnalysis.tsx`)
- Upgrade dropzone: explicit drag/hover/success states, document icon, file metadata.
- Replace pipeline stages with `StatusPipeline` + per-stage shimmer while active.
- Add **Results Summary** card (added / removed / modified clauses, affected departments, risk score) at top of results.

### Change Detection (`src/pages/ChangeDetection.tsx`)
- Add **Executive Summary Banner** (changes detected, high risk, affected depts, audit exposure).
- Tune diff colors via existing tokens: added = `success/10` bg, modified = `warning/10`, removed = `destructive/10`.
- Make existing summary panel `sticky top-4` on `lg:` viewports.

### MAPs / Kanban (`src/pages/Maps.tsx`)
- Add `StatusPipeline` above the board.
- Card polish: severity left border (4px), hover elevation (shadow-md), 200ms transitions on drag-over column.
- Add severity legend chip row.

### Audit Readiness (`src/pages/AuditReadiness.tsx`)
- Enlarge readiness ring (existing) and add "Audit Ready" label + delta.
- Add **Department Ranking** sorted list (uses existing `audits` mock).
- Add **Findings Heatmap** (simple CSS grid colored by severity counts).
- Add **Executive Summary** text block above timeline.

### All pages — micro UX
- Use shared `Skeleton` variants in initial render states.
- Standardize hover (`hover:bg-muted/50`), focus rings (`focus-visible:ring-1`), section spacing (`space-y-6`).

## 3. Mocks (`src/mocks/index.ts`)

Additive only; no changes to existing keys.
- `journeySteps` — 6 steps with `{label, count, status, progress}`.
- `focusToday` — single object for the focus card.
- `kpiDetails` — sub-metrics for the 4 enhanced KPIs.
- `recentActivity` — derived view of regulations with `changeType` and `status`.
- `complianceTimeline` — 5–6 timestamped events.
- `executiveInsights` — 3–4 narrative insights with severity + trend.
- `findingsHeatmap` — department × severity counts.
- `copilotFeatures` — feature lists per mode.

## 4. Styling

Inside existing tokens — no new color system.
- Add utility classes in `src/index.css`: `.pipeline-step`, `.mode-banner`, `.insight-card`, `[data-copilot-mode="expert"] .data-table td { @apply py-1.5; }`, `[data-copilot-mode="expert"] .data-table th { @apply py-1.5; }`.
- Use existing `animate-fade-in` for mode transitions; no new keyframes.

## 5. Responsive sweep

Manual pass via preview at 1366, 1024, 768, 414:
- Sidebar collapses (existing behavior verified).
- Tables: `overflow-x-auto` wrappers on Dashboard, Regulations, AuditLogs, Reports.
- Kanban: horizontal scroll on `<lg`.
- Charts: `ResponsiveContainer` already in use; verify heights.
- Drawers: full-width on mobile.

## 6. Out of scope (explicit)

- No new routes, no backend, no APIs, no auth, no AI calls.
- No redesign of color system, no border-radius/shadow overhaul beyond existing tokens.
- No rewrite of existing page logic — purely additive composition with new shared components.

## Execution order

1. Shared components + mocks (parallel writes).
2. Layout + TopBar + ModeBanner + Copilot mode CSS.
3. Dashboard (largest impact).
4. Document Analysis, Change Detection, MAPs, Audit Readiness.
5. Responsive + skeleton/empty/error state sweep across remaining pages.
6. Preview verification at desktop + tablet + mobile widths.
