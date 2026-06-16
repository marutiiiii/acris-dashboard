import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Target, Puzzle, Calendar, Info, ChevronDown, Check, AlertCircle } from "lucide-react";
import { SkeletonPage } from "@/components/shared/States";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const tooltipStyle = {
  background: "#0c142b",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 8,
  fontSize: 11,
  color: "#fff",
};

// Mini Sparkline Generator Component
function MiniSparkline({ color }: { color: "green" | "blue" | "purple" | "orange" }) {
  const strokeColor = 
    color === "green" ? "#10b981" : 
    color === "blue" ? "#3b82f6" : 
    color === "purple" ? "#a855f7" : "#f97316";
  
  const fillGradient = `url(#sparklineGrad-${color})`;

  return (
    <svg viewBox="0 0 100 25" className="w-full h-8 mt-2.5 flex-shrink-0 select-none">
      <defs>
        <linearGradient id={`sparklineGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path 
        d="M0,18 C15,10 30,22 45,12 C60,18 75,8 100,14" 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.8" 
        strokeLinecap="round"
      />
      <path 
        d="M0,18 C15,10 30,22 45,12 C60,18 75,8 100,14 L100,25 L0,25 Z" 
        fill={fillGradient} 
      />
    </svg>
  );
}

export default function Dashboard() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [regs, setRegs] = useState<any[]>([]);
  const [showInfoBanner, setShowInfoBanner] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.auditReadiness(),
      api.regulationsLatest()
    ]).then(([res, regRes]) => {
      if (!active) return;
      setData(res);
      setRegs(regRes.regulations || []);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to load dashboard data", err);
      if (active) {
        setData({
          score: 84,
          total: 9,
          completed: 1,
          overdue: 1,
          departments: [
            { department: "Compliance", readinessScore: 85, openFindings: 3, criticalFindings: 1, closedFindings: 18, missingEvidence: 2, risk: "Low" },
            { department: "Legal", readinessScore: 85, openFindings: 4, criticalFindings: 0, closedFindings: 11, missingEvidence: 1, risk: "Low" },
            { department: "Operations", readinessScore: 85, openFindings: 7, criticalFindings: 2, closedFindings: 22, missingEvidence: 3, risk: "Medium" },
            { department: "IT", readinessScore: 85, openFindings: 5, criticalFindings: 1, closedFindings: 19, missingEvidence: 3, risk: "Medium" },
            { department: "Cybersecurity", readinessScore: 85, openFindings: 9, criticalFindings: 3, closedFindings: 14, missingEvidence: 3, risk: "High" },
            { department: "Audit", readinessScore: 85, openFindings: 1, criticalFindings: 0, closedFindings: 24, missingEvidence: 3, risk: "Low" }
          ],
          insights: [
            { title: "3 regulations require attention this week", description: "RBI, CERT-In and NPCI changes overlap on KYC and payments. Prioritize Compliance & IT.", severity: "High", trend: { value: 12, suffix: "%" } },
            { title: "Compliance readiness stands at 84%", description: "Driven by MAP closures in Legal and Compliance over the last 30 days.", severity: "Low", trend: { value: 6, suffix: "%" } },
            { title: "Operations has highest risk exposure", description: "7 open findings, 2 critical. Recommend reallocating 2 reviewers to clear backlog.", severity: "Medium", trend: { value: -3, suffix: "%", inverse: true } }
          ],
          complianceTrend: [
            { month: "Apr 23", score: 78 }, { month: "Apr 30", score: 80 }, { month: "May 07", score: 82 },
            { month: "May 14", score: 81 }, { month: "May 21", score: 85 }
          ],
          mapProgress: [
            { week: "W1", completed: 4, inProgress: 6, pending: 5 },
            { week: "W2", completed: 6, inProgress: 5, pending: 4 },
            { week: "W3", completed: 9, inProgress: 4, pending: 3 },
            { week: "W4", completed: 1, inProgress: 8, pending: 2 }
          ]
        });
        setLoading(false);
      }
    });

    return () => { active = false; };
  }, []);

  if (loading || !data) {
    return <SkeletonPage />;
  }

  // Donuts Risk Breakdown Data
  const riskDist = [
    { name: "High", value: 22, color: "#ef4444" },
    { name: "Medium", value: 68, color: "#f97316" },
    { name: "Low", value: 66, color: "#10b981" },
  ];

  const handleLoopClick = (stepName: string) => {
    toast({
      title: "Operating Loop Detail",
      description: `Filtering regulations and audit items related to: ${stepName}`,
    });
  };

  return (
    <div className="space-y-6 text-slate-100 select-none pb-8">
      {/* Header Info */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard</h1>
        <p className="text-xs text-slate-400">Compliance posture across regulations, action points, and audit readiness.</p>
      </div>

      {/* Dismissible Info Callout */}
      {showInfoBanner && (
        <div className="bg-[#0b1329] border border-slate-800/60 rounded-xl p-4 text-xs text-slate-300 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>This is the executive overview. Each card below shows a key compliance metric. Click any card to drill into details. Switch to Expert mode in the top bar for a denser layout.</span>
          </div>
          <button 
            onClick={() => setShowInfoBanner(false)}
            className="text-slate-500 hover:text-white text-xs font-semibold px-2 focus:outline-none"
          >
            ×
          </button>
        </div>
      )}

      {/* ReguFlow Operating Loop (Regulation -> Action -> Proof) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Regulation ➔ Action ➔ Proof</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold cursor-pointer hover:text-slate-300 transition-colors">
            <span>ReguFlow operating loop</span>
            <Info className="w-3 h-3" />
          </div>
        </div>

        {/* 6 Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1 */}
          <div 
            onClick={() => handleLoopClick("Regulation Detected")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Regulation Detected</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-[9px] text-emerald-500 font-bold">20% vs last month</span>
            </div>
            <MiniSparkline color="green" />
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => handleLoopClick("Clause Changes Found")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Clause Changes Found</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">47</span>
              <span className="text-[9px] text-emerald-500 font-bold">18% vs last month</span>
            </div>
            <MiniSparkline color="green" />
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => handleLoopClick("Impact Assessed")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Impact Assessed</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">8</span>
              <span className="text-[9px] text-emerald-500 font-bold">12% vs last month</span>
            </div>
            <MiniSparkline color="green" />
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => handleLoopClick("MAPs Generated")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>MAPs Generated</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">9</span>
              <span className="text-[9px] text-blue-400 font-bold">29% vs last month</span>
            </div>
            <MiniSparkline color="blue" />
          </div>

          {/* Card 5 */}
          <div 
            onClick={() => handleLoopClick("Departments Assigned")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Departments Assigned</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">6</span>
              <span className="text-[9px] text-purple-400 font-bold">15% vs last month</span>
            </div>
            <MiniSparkline color="purple" />
          </div>

          {/* Card 6 */}
          <div 
            onClick={() => handleLoopClick("Audit Ready")}
            className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-3.5 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Audit Ready</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-white">84%</span>
              <span className="text-[9px] text-orange-400 font-bold">11% vs last month</span>
            </div>
            <MiniSparkline color="orange" />
          </div>
        </div>
      </div>

      {/* Middle Split Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: TODAY'S COMPLIANCE PRIORITY */}
        <div className="bg-gradient-to-br from-[#0c142b] to-[#0a1024] border border-slate-800/40 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Today's Compliance Priority</span>
              <span className="text-[10px] text-slate-500 font-medium">May 22, 2025</span>
              <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded text-[9px] uppercase tracking-wide">High</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug max-w-sm">
              RBI Digital Lending Circular — KYC Workflow Update
            </h3>

            <div className="flex items-center gap-8 pt-1">
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500">Modified Clauses</span>
                <span className="block text-xl font-extrabold text-white mt-0.5">4</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold tracking-wider text-slate-500">Risk Score</span>
                <span className="block text-xl font-extrabold text-red-500 mt-0.5">High</span>
              </div>
            </div>
          </div>

          {/* Svg Document Graphic */}
          <div className="flex-shrink-0 select-none">
            <svg viewBox="0 0 120 120" className="w-24 h-24 opacity-40 lg:opacity-75">
              <g transform="translate(20, 20)">
                <rect x="16" y="16" width="55" height="70" rx="4" fill="none" stroke="#3b82f6" strokeWidth="1.2" opacity="0.3" />
                <rect x="8" y="8" width="55" height="70" rx="4" fill="#0f1b3e" stroke="#2563eb" strokeWidth="1.5" opacity="0.7" />
                <rect x="0" y="0" width="55" height="70" rx="4" fill="#0c142b" stroke="#3b82f6" strokeWidth="1.8" />
                <line x1="10" y1="15" x2="45" y2="15" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="10" y1="25" x2="45" y2="25" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10" y1="35" x2="35" y2="35" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="10" y1="45" x2="40" y2="45" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="50" cy="60" r="10" fill="#22c55e" stroke="#040814" strokeWidth="1.5" />
                <path d="M47,60 L49,62 L53,58" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            </svg>
          </div>
        </div>

        {/* Right: AFFECTED DEPARTMENTS */}
        <div className="bg-gradient-to-br from-[#0c142b] to-[#0a1024] border border-slate-800/40 rounded-xl p-5 flex items-center justify-between shadow-md relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Affected Departments</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded text-[9px]">Compliance</span>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded text-[9px]">IT</span>
                <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded text-[9px]">Operations</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">Recommended Action</span>
              <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
                Update KYC verification workflow and re-paper FLDG contracts before deadline.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-semibold">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Deadline: Jun 15, 2025</span>
              </div>
              
              <button 
                onClick={() => nav("/document-analysis")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all"
              >
                <span>View Analysis</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* 3D Shield Cube SVG */}
          <div className="flex-shrink-0 select-none ml-2">
            <svg viewBox="0 0 160 160" className="w-24 h-24 lg:w-28 lg:h-28">
              <defs>
                <radialGradient id="cubeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </radialGradient>
                <filter id="cubeBlur" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" />
                </filter>
              </defs>
              <circle cx="80" cy="80" r="50" fill="url(#cubeGlow)" filter="url(#cubeBlur)" />
              <g transform="translate(80, 85)" className="animate-float">
                <ellipse cx="0" cy="30" rx="35" ry="17.5" fill="#0c142b" stroke="#3b82f6" strokeWidth="1.5" />
                <ellipse cx="0" cy="30" rx="25" ry="12.5" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="3 3" />
                
                <g transform="translate(0, -10)">
                  <polygon points="0,-35 28,-16 28,16 0,35 -28,16 -28,-16" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.35" />
                  <polygon points="0,-35 28,-16 28,16 0,35 -28,16 -28,-16" fill="#1e3a8a" opacity="0.1" />
                  
                  <g transform="scale(0.75)">
                    <path 
                      d="M-15,-18 L0,-24 L15,-18 L15,0 C15,10 0,20 0,20 C0,20 -15,10 -15,0 Z" 
                      fill="url(#shieldGrad)" 
                      stroke="#60a5fa" 
                      strokeWidth="1.8" 
                    />
                    <path 
                      d="M-6,-1 L-2,3 L7,-5" 
                      fill="none" 
                      stroke="#ffffff" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Lower Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: COMPLIANCE HEALTH */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Compliance Health</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold">↑ 8% vs last month</span>
          </div>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-emerald-500">87%</span>
            <span className="text-[10px] text-slate-400 font-semibold">Target 95%</span>
          </div>

          <div className="space-y-1.5 mt-4">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "87%" }} />
              {/* Target line indicator */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500" style={{ left: "95%" }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Previous: 83%</span>
              <span>Target: 95%</span>
            </div>
          </div>
        </div>

        {/* Card 2: AUDIT READINESS */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Audit Readiness</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">↑ 4%</span>
          </div>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-blue-500">{data.score}%</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Open findings</span>
              <span className="text-xs font-bold text-red-500">29</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Due this week</span>
              <span className="text-xs font-bold text-red-500">15</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overdue</span>
              <span className="text-xs font-bold text-emerald-500">{data.overdue}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</span>
              <span className="text-xs font-bold text-red-500">{data.departments.length}</span>
            </div>
          </div>
        </div>

        {/* Card 3: ACTIVE REGULATIONS */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Active Regulations</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold">↑ 1 new</span>
          </div>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-white">3</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">New this week</span>
              <span className="text-xs font-bold text-blue-400">3</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">High risk</span>
              <span className="text-xs font-bold text-red-500">2</span>
            </div>
          </div>
        </div>

        {/* Card 4: PENDING MAPS */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Pending MAPs</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold">↑ 2 vs last week</span>
          </div>
          
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold text-[#f97316]">8</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col border-r border-slate-800/40 pr-2">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Pending</span>
              <span className="text-xs font-bold text-[#f97316] mt-0.5">7</span>
            </div>
            <div className="flex flex-col border-r border-slate-800/40 pr-2">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Overdue</span>
              <span className="text-xs font-bold text-red-500 mt-0.5">1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">Completed</span>
              <span className="text-xs font-bold text-emerald-500 mt-0.5">1</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Chart Rows */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Compliance Trend Chart Card (2 columns) */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Compliance Trend</span>
            <div className="flex items-center gap-3">
              {/* Dropdown Selector */}
              <div className="flex items-center gap-1 bg-[#070d1e] border border-slate-800/50 rounded px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-400 cursor-pointer">
                <span>30 Days</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-semibold">↑ 8% vs last 30 days</span>
            </div>
          </div>

          <div className="w-full h-[180px] mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.complianceTrend}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="100">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} stroke="rgba(255,255,255,0.05)" />
                <YAxis domain={[70, 100]} tick={{ fontSize: 9, fill: '#64748b' }} stroke="rgba(255,255,255,0.05)" />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Score"]} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  dot={{ r: 3.5, fill: "#3b82f6", strokeWidth: 0 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Card (1 column) */}
        <div className="bg-[#0c142b]/60 border border-slate-800/40 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
            Risk Distribution
          </div>

          <div className="grid grid-cols-12 gap-3 items-center mt-4">
            {/* Donut Column */}
            <div className="col-span-7 relative w-full h-[140px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={riskDist} 
                    dataKey="value" 
                    nameKey="name" 
                    innerRadius={42} 
                    outerRadius={56}
                    stroke="none"
                  >
                    {riskDist.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white leading-none">156</span>
                <span className="text-[8px] text-slate-500 uppercase font-bold mt-1 tracking-wider">Total Risks</span>
              </div>
            </div>

            {/* Legend Column */}
            <div className="col-span-5 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-red-500" />
                  <span className="text-slate-400">High</span>
                </div>
                <span className="text-white font-semibold">22 (14%)</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-orange-500" />
                  <span className="text-slate-400">Medium</span>
                </div>
                <span className="text-white font-semibold">68 (44%)</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-emerald-500" />
                  <span className="text-slate-400">Low</span>
                </div>
                <span className="text-white font-semibold">66 (42%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
