import { useCopilot, useCopilotFeatures } from "@/state/CopilotContext";
import { Sparkles, Check } from "lucide-react";

const LABEL: Record<string, string> = {
  beginner: "Beginner Compliance Officer",
  intermediate: "Intermediate Compliance Officer",
  expert: "Expert Compliance Lead",
};

export default function ModeBanner() {
  const { mode } = useCopilot();
  const features = useCopilotFeatures();
  return (
    <div
      key={mode}
      className="mode-banner animate-fade-in border-b border-border bg-muted/40 px-6 py-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs"
    >
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">Active mode</span>
        <span className="font-semibold text-foreground">{LABEL[mode]}</span>
      </div>
      <div className="h-3 w-px bg-border hidden sm:block" />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {features.map((f) => (
          <span key={f} className="inline-flex items-center gap-1 text-muted-foreground">
            <Check className="h-3 w-3 text-[hsl(var(--success))]" /> {f}
          </span>
        ))}
      </div>
    </div>
  );
}