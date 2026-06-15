import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, BookOpen, KanbanSquare, ShieldCheck, Activity, Lightbulb, Clock } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import EnhancedKpiCard from "@/components/shared/EnhancedKpiCard";
import JourneyTracker from "@/components/shared/JourneyTracker";
import FocusTodayCard from "@/components/shared/FocusTodayCard";
import InsightCard from "@/components/shared/InsightCard";
import TrendIndicator from "@/components/shared/TrendIndicator";
import { RiskBadge } from "@/components/shared/Badges";
import { BeginnerHint, SkeletonPage } from "@/components/shared/States";
import { useIsBeginner, useIsExpert } from "@/state/CopilotContext";
import { api } from "@/lib/api";
import { journeySteps, focusToday, complianceTimeline } from "@/mocks";

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 6,
  fontSize: 12,
};

export default function Dashboard() {
  const nav = useNavigate();
  const isBeginner = useIsBeginner();
  const isExpert = useIsExpert();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeRegsCount, setActiveRegsCount] = useState(8);
  const [highRiskCount, setHighRiskCount] = useState(3);
  const [regs, setRegs] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      api.auditReadiness(),
      api.regulationsLatest()
    ]).then(([res, regRes]) => {
      if (!active) return;
      setData(res);
      const regList = regRes.regulations || [];
      setRegs(regList);
      if (regList.length > 0) {
        setActiveRegsCount(regList.length);
        // Calculate high risk count from regulations list if present
        const highRisk = regList.filter((r: any) => r.risk === "High" || (r.riskScore && r.riskScore >= 75)).length;
        setHighRiskCount(highRisk || 3);
      }
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
          recentActivity: [
            { id: "RBI-2026-001", title: "Digital Lending Master Direction", source: "RBI", changeType: "Modified", risk: "High", status: "Active", time: "2h ago" },
            { id: "CERT-2026-006", title: "Critical Java Middleware CVE", source: "CERT-In", changeType: "New", risk: "High", status: "Active", time: "4h ago" },
            { id: "NPCI-2026-005", title: "UPI Velocity & Risk Controls", source: "NPCI", changeType: "Updated", risk: "Medium", status: "Active", time: "1d ago" }
          ],
          insights: [
            { title: "3 regulations require attention this week", description: "RBI, CERT-In and NPCI changes overlap on KYC and payments. Prioritize Compliance & IT.", severity: "High", trend: { value: 12, suffix: "%" } },
            { title: "Compliance readiness stands at 84%", description: "Driven by MAP closures in Legal and Compliance over the last 30 days.", severity: "Low", trend: { value: 6, suffix: "%" } },
            { title: "Operations has highest risk exposure", description: "7 open findings, 2 critical. Recommend reallocating 2 reviewers to clear backlog.", severity: "Medium", trend: { value: -3, suffix: "%", inverse: true } }
          ],
          complianceTrend: [
            { month: "Dec", score: 78 }, { month: "Jan", score: 80 }, { month: "Feb", score: 82 },
            { month: "Mar", score: 81 }, { month: "Apr", score: 85 }, { month: "May", score: 84 }
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

  // Calculate dynamic risk distribution based on live regulations if available, or fallback
  const riskDist = [
    { name: "High", value: regs.filter((r) => r.risk === "High" || r.risk_level === "High" || r.risk_level === "Critical").length || 3, color: "hsl(var(--risk-high))" },
    { name: "Medium", value: regs.filter((r) => r.risk === "Medium" || r.risk_level === "Medium").length || 3, color: "hsl(var(--risk-medium))" },
    { name: "Low", value: regs.filter((r) => r.risk === "Low" || r.risk_level === "Low").length || 2, color: "hsl(var(--risk-low))" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Compliance posture across regulations, action points, and audit readiness"
      />

      {isBeginner && (
        <BeginnerHint>
          This is the executive overview. Each card below shows a key compliance metric. Click any card
          to drill into details. Switch to Expert mode in the top bar for a denser layout.
        </BeginnerHint>
      )}

      <JourneyTracker steps={journeySteps} />

      <FocusTodayCard {...focusToday} />

      <div className={`grid gap-3 ${isExpert ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
        <EnhancedKpiCard
          label="Compliance Health"
          value={`${Math.round(data.score * 1.03) > 100 ? 100 : Math.round(data.score * 1.03)}%`}
          tone="success"
          icon={<Activity className="h-4 w-4" />}
          trend={{ value: 6, suffix: "%", label: "vs last mo." }}
          progress={{ current: data.score, target: 95, label: `Target 95%` }}
          subMetrics={[
            { label: "Previous", value: "81%" },
            { label: "Target", value: "95%" },
          ]}
        />
        <EnhancedKpiCard
          label="Audit Readiness"
          value={`${data.score}%`}
          tone="info"
          icon={<ShieldCheck className="h-4 w-4" />}
          trend={{ value: 4, suffix: "%" }}
          subMetrics={[
            { label: "Open findings", value: data.departments.reduce((sum: number, d: any) => sum + d.openFindings, 0), tone: "warning" },
            { label: "Missing evidence", value: data.departments.reduce((sum: number, d: any) => sum + d.missingEvidence, 0), tone: "danger" },
            { label: "Controls verified", value: 142, tone: "success" },
            { label: "Departments", value: data.departments.length },
          ]}
        />
        <EnhancedKpiCard
          label="Active Regulations"
          value={activeRegsCount}
          icon={<BookOpen className="h-4 w-4" />}
          trend={{ value: 3, suffix: " new" }}
          subMetrics={[
            { label: "New this week", value: 3, tone: "info" },
            { label: "High risk", value: highRiskCount, tone: "danger" },
          ]}
        />
        <EnhancedKpiCard
          label="Pending MAPs"
          value={data.total - data.completed}
          tone="warning"
          icon={<KanbanSquare className="h-4 w-4" />}
          trend={{ value: -2, suffix: "", inverse: true, label: "vs last wk" }}
          subMetrics={[
            { label: "Pending", value: data.total - data.completed - data.overdue, tone: "warning" },
            { label: "Overdue", value: data.overdue, tone: "danger" },
            { label: "Completed", value: data.completed, tone: "success" },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="section-container p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">Compliance trend</div>
            <TrendIndicator value={6} label="vs last mo." />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.complianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, "Score"]} />
              <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="section-container p-4">
          <div className="text-sm font-semibold mb-3">Risk distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={riskDist} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                {riskDist.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="section-container p-4 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold">MAP progress (last 4 weeks)</div>
            <TrendIndicator value={31} label="completion" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.mapProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="completed" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="inProgress" stackId="a" fill="hsl(var(--info))" />
              <Bar dataKey="pending" stackId="a" fill="hsl(var(--warning))" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-container p-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Lightbulb className="h-4 w-4 text-primary" /> Executive insights
          </div>
          <div className="space-y-2">
            {data.insights.map((i: any) => (
              <InsightCard key={i.title} title={i.title} description={i.description} severity={i.severity} trend={i.trend} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="section-container lg:col-span-2">
          <div className="px-4 py-3 border-b text-sm font-semibold flex items-center justify-between">
            Recent regulation activity
            <button onClick={() => nav("/regulations")} className="text-xs text-primary hover:underline">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Regulation</th>
                  <th>Source</th>
                  <th>Change Type</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((r: any, idx: number) => (
                  <tr key={idx} className="cursor-pointer" onClick={() => nav("/regulations")}>
                    <td>
                      <div className="font-medium">{r.title}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{r.id || "Circular"}</div>
                    </td>
                    <td className="text-muted-foreground">{r.source}</td>
                    <td><span className="text-xs px-2 py-0.5 border border-border rounded bg-muted/40">{r.changeType}</span></td>
                    <td><RiskBadge risk={r.risk} /></td>
                    <td className="text-muted-foreground text-xs">{r.status}</td>
                    <td className="text-muted-foreground text-xs">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section-container p-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Clock className="h-4 w-4 text-primary" /> Compliance timeline
          </div>
          <JourneyTracker variant="compact" steps={complianceTimeline} />
        </div>
      </div>

    </div>
  );
}
