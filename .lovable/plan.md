

## ACRIS – Autonomous Compliance & Regulatory Intelligence System

A traditional enterprise-style compliance dashboard with sharp edges, dense layouts, and table-driven UI. All mock data included, ready for backend integration.

### Design System
- **No border-radius anywhere** — override Tailwind/shadcn defaults to 0
- Colors: white background, dark blue primary (#1e3a8a), risk colors (red/yellow/green), grey borders (#d1d5db)
- Font: system-ui/Inter, tight spacing, flat design, no shadows/gradients

### Layout
- **Fixed left sidebar** — text-based navigation with all 9 routes (Dashboard, Regulations, Change Detection, Impact Analysis, AI Explanation, Reports, Alerts, Audit Logs, Company Profile)
- **Top bar** — search input, notification icon, user name
- **Main content area** — grid-based, border-separated sections

### Pages (9 total)

1. **Dashboard** — stat boxes (Total Regulations, High Risk Alerts, Pending Actions, Reports Generated), simple bar chart using recharts, recent updates table
2. **Regulations** — filterable table (Title, Source, Date, Risk, Status) with dropdown filters
3. **Change Detection** — split-pane diff view with green/red/yellow highlights for added/removed/modified text
4. **Impact Analysis** — affected departments list, risk level, impact summary paragraph, confidence score progress bar
5. **AI Explanation** — original text display, simplified explanation, "Explain Simply" / "Explain Technically" buttons
6. **Report Viewer** — structured sections (Summary, Impact, Actions, Deadlines), Download PDF and Print buttons
7. **Alerts** — simple list with alert message, time, risk level badges
8. **Audit Logs** — bordered table (Source, Clause, AI Reasoning, Timestamp)
9. **Company Profile** — form with industry dropdown, services text input, risk preference radio buttons, rectangular submit button

### Key Details
- All components use sharp rectangular styling
- Mock/sample data for every page
- Status badges as colored text labels
- Loading states use plain text, no skeleton animations
- "What should I do?" advisory text section on Dashboard
- Routes wired up with React Router

