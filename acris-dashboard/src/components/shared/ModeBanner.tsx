import { useCopilot, useCopilotFeatures } from "@/state/CopilotContext";
import { Check, Settings, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LABEL: Record<string, string> = {
  beginner: "Beginner Compliance Officer",
  intermediate: "Intermediate Compliance Officer",
  expert: "Expert Compliance Lead",
};

export default function ModeBanner() {
  const { mode } = useCopilot();
  const features = useCopilotFeatures();

  const handleCustomize = () => {
    toast({
      title: "Customize Dashboard",
      description: "Custom widgets are a pro feature! Upgrade your plan to customize your layout.",
    });
  };

  return (
    <div
      key={mode}
      className="mode-banner animate-fade-in border-b border-slate-800/40 bg-[#070d1e] px-6 py-2 flex items-center justify-between text-[11px] select-none"
    >
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        <div className="flex items-center gap-1.5 text-slate-300">
          <User className="h-3.5 w-3.5 text-blue-500" />
          <span>Active mode:</span>
          <span className="font-bold text-white">{LABEL[mode]}</span>
        </div>
        <div className="h-3 w-px bg-slate-800/60 hidden sm:block" />
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          {features.map((f) => (
            <span key={f} className="inline-flex items-center gap-1 text-slate-400 font-medium">
              <Check className="h-3 w-3 text-emerald-500 stroke-[3]" /> {f}
            </span>
          ))}
        </div>
      </div>
      
      <button 
        onClick={handleCustomize}
        className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-white bg-[#0c142b]/60 border border-slate-800/40 hover:border-slate-700/80 rounded-md transition-all font-semibold"
      >
        <Settings className="w-3.5 h-3.5" />
        <span>Customize Dashboard</span>
      </button>
    </div>
  );
}