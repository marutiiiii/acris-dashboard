import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, GitCompareArrows, Target,
  BrainCircuit, FileText, Bell, ClipboardList, Building2,
  FileUp, KanbanSquare, ShieldCheck, ChevronLeft, Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const navGroups: { title: string; items: { label: string; path: string; icon: any; badge?: number }[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/", icon: LayoutDashboard },
      { label: "Regulations", path: "/regulations", icon: BookOpen }
    ],
  },
  {
    title: "Analysis",
    items: [
      { label: "Document Analysis", path: "/document-analysis", icon: FileUp },
      { label: "Change Detection", path: "/change-detection", icon: GitCompareArrows },
      { label: "Impact Analysis", path: "/impact-analysis", icon: Target },
      { label: "AI Copilot", path: "/copilot", icon: BrainCircuit },
    ],
  },
  {
    title: "Actions",
    items: [
      { label: "MAP Management", path: "/maps", icon: KanbanSquare },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Audit Readiness", path: "/audit-readiness", icon: ShieldCheck },
      { label: "Reports", path: "/reports", icon: FileText },
      { label: "Alerts", path: "/alerts", icon: Bell, badge: 3 },
      { label: "Audit Logs", path: "/audit-logs", icon: ClipboardList },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Company Profile", path: "/company-profile", icon: Building2 },
    ],
  },
];

export default function Sidebar() {
  const handleCollapse = () => {
    toast({
      title: "Collapse Sidebar",
      description: "Sidebar collapse is a pro feature! Upgrade your plan to customize your workspace.",
    });
  };

  const handleUpgrade = () => {
    toast({
      title: "Subscription Plan",
      description: "Redirecting to checkout... Thank you for upgrading to ReguFlow Premium!",
    });
  };

  return (
    <aside className="w-[260px] min-h-screen bg-[#070d1e] flex-shrink-0 flex flex-col border-r border-slate-800/40 justify-between select-none">
      
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white font-extrabold text-sm tracking-tighter">R</span>
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight block">ReguFlow <span className="text-blue-500">AI</span></span>
              <span className="block text-[7px] font-bold tracking-widest text-blue-400 uppercase -mt-1">COMPLIANCE ENGINE</span>
            </div>
          </div>
          <button 
            onClick={handleCollapse}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-md border border-slate-800/40 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-4 px-3 py-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1 text-[9px] uppercase tracking-widest font-extrabold text-slate-500">
                {group.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-all font-medium",
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/10"
                          : "text-slate-400 hover:bg-[#0c142b]/60 hover:text-white"
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Upgrade Plan Box */}
      <div className="px-4 py-4 border-t border-slate-800/40">
        <div className="bg-gradient-to-br from-[#0c142b]/80 to-[#0f1b3e]/40 border border-slate-800/40 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 w-12 h-12 bg-blue-500/10 rounded-full blur-xl group-hover:scale-150 transition-all duration-700" />
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/15 flex items-center justify-center border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-white font-bold text-xs">Upgrade your plan</span>
          </div>
          
          <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
            Unlock advanced AI features and premium support.
          </p>
          
          <button 
            onClick={handleUpgrade}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-2 text-[10px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Upgrade Now
          </button>
        </div>
      </div>

    </aside>
  );
}

