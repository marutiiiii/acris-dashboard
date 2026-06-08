import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CopilotMode = "beginner" | "intermediate" | "expert";

interface CopilotState {
  mode: CopilotMode;
  setMode: (m: CopilotMode) => void;
}

const Ctx = createContext<CopilotState | null>(null);
const STORAGE_KEY = "reguflow.copilot.mode";

export function CopilotProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<CopilotMode>(() => {
    if (typeof window === "undefined") return "intermediate";
    return (localStorage.getItem(STORAGE_KEY) as CopilotMode) || "intermediate";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.copilotMode = mode;
  }, [mode]);

  return <Ctx.Provider value={{ mode, setMode: setModeState }}>{children}</Ctx.Provider>;
}

export function useCopilot() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCopilot must be used within CopilotProvider");
  return v;
}

export const useIsBeginner = () => useCopilot().mode === "beginner";
export const useIsExpert = () => useCopilot().mode === "expert";
*** Add File: src/state/ThemeContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: () => void } | null>(null);
const KEY = "reguflow.theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(KEY) as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
}
*** Add File: src/components/shared/PageHeader.tsx
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
*** Add File: src/components/shared/Badges.tsx
import type { Risk, Severity } from "@/mocks";

const riskColor = (r: string) =>
  r === "High" || r === "Critical"
    ? "bg-[hsl(var(--risk-high)/0.12)] text-[hsl(var(--risk-high))] border-[hsl(var(--risk-high)/0.4)]"
    : r === "Medium"
    ? "bg-[hsl(var(--risk-medium)/0.12)] text-[hsl(var(--risk-medium))] border-[hsl(var(--risk-medium)/0.4)]"
    : "bg-[hsl(var(--risk-low)/0.12)] text-[hsl(var(--risk-low))] border-[hsl(var(--risk-low)/0.4)]";

export function RiskBadge({ risk }: { risk: Risk | Severity | string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border ${riskColor(risk)}`}>
      {risk}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s.includes("complete") || s === "active" || s === "healthy"
      ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.4)]"
      : s.includes("pending") || s.includes("attention") || s.includes("review")
      ? "bg-[hsl(var(--warning)/0.12)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.4)]"
      : s.includes("progress") || s.includes("assigned")
      ? "bg-[hsl(var(--info)/0.12)] text-[hsl(var(--info))] border-[hsl(var(--info)/0.4)]"
      : s.includes("critical") || s.includes("overdue")
      ? "bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.4)]"
      : "bg-muted text-muted-foreground border-border";
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${cls}`}>{status}</span>;
}
*** Add File: src/components/shared/States.tsx
import { ReactNode } from "react";
import { Inbox, Loader2, AlertCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </div>
  );
}

export function EmptyState({ title = "No data", description, action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground/60" />
      <div className="text-sm font-medium">{title}</div>
      {description && <div className="text-xs text-muted-foreground max-w-sm">{description}</div>}
      {action}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-12 text-sm text-destructive">
      <AlertCircle className="h-4 w-4" /> {message}
    </div>
  );
}

export function BeginnerHint({ children }: { children: ReactNode }) {
  return (
    <div className="border border-[hsl(var(--info)/0.4)] bg-[hsl(var(--info)/0.08)] text-sm rounded-md px-3 py-2">
      <span className="font-semibold text-[hsl(var(--info))] mr-2">Tip</span>
      <span className="text-foreground/80">{children}</span>
    </div>
  );
}
*** Add File: src/components/shared/KpiCard.tsx
import { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  delta?: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  icon?: ReactNode;
}

const toneClass: Record<string, string> = {
  default: "text-foreground",
  success: "text-[hsl(var(--success))]",
  warning: "text-[hsl(var(--warning))]",
  danger: "text-[hsl(var(--destructive))]",
  info: "text-[hsl(var(--info))]",
};

export default function KpiCard({ label, value, delta, tone = "default", icon }: Props) {
  return (
    <div className="kpi-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
      </div>
      <div className={`text-2xl font-semibold ${toneClass[tone]}`}>{value}</div>
      {delta && <div className="text-xs text-muted-foreground mt-1">{delta}</div>}
    </div>
  );
}
*** Add File: src/components/shared/Drawer.tsx
import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, width = "max-w-xl" }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-foreground/30" onClick={onClose} />
      <aside className={`w-full ${width} bg-card border-l border-border shadow-md flex flex-col`}>
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5">{children}</div>
      </aside>
    </div>
  );
}
*** Add File: src/components/shared/Logo.tsx
export default function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-8 h-8";
  return (
    <div className="flex items-center gap-2">
      <div className={`${dim} bg-primary text-primary-foreground flex items-center justify-center rounded font-bold text-sm`}>
        R
      </div>
      <div className="leading-tight">
        <div className="font-bold text-sidebar-primary-foreground text-sm tracking-tight">ReguFlow AI</div>
        <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/70">Compliance Engine</div>
      </div>
    </div>
  );
}