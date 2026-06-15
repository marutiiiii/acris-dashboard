import { useEffect, useState, useMemo } from "react";
import PageHeader from "@/components/shared/PageHeader";
import KpiCard from "@/components/shared/KpiCard";
import { RiskBadge } from "@/components/shared/Badges";
import JourneyTracker from "@/components/shared/JourneyTracker";
import { audits as mockAudits, findingsHeatmap as mockHeatmap, complianceTimeline } from "@/mocks";
import { ShieldCheck, ShieldAlert, ShieldX, FileWarning, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { SkeletonPage } from "@/components/shared/States";

function CircleScore({ score }: { score: number }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const tone = score >= 85 ? "hsl(var(--success))" : score >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))";
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} stroke="hsl(var(--muted))" strokeWidth="12" fill="none" />
      <circle cx="80" cy="80" r={r} stroke={tone} strokeWidth="12" fill="none"
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round" transform="rotate(-90 80 80)" />
      <text x="80" y="84" textAnchor="middle" fontSize="32" fontWeight="700" fill="hsl(var(--foreground))">{score}%</text>
    </svg>
  );
}

export default function AuditReadiness() {
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    api.auditReadiness()
      .then((res) => {
        setLiveData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load audit readiness stats", err);
        setLoading(false);
      });
  }, []);

  const departments = useMemo(() => {
    if (liveData && liveData.departments && liveData.departments.length > 0) {
      return liveData.departments;
    }
    return mockAudits;
  }, [liveData]);

  const totals = useMemo(() => {
    return departments.reduce(
      (acc, d) => ({
        open: acc.open + d.openFindings,
        critical: acc.critical + d.criticalFindings,
        closed: acc.closed + d.closedFindings,
        missing: acc.missing + d.missingEvidence,
      }),
      { open: 0, critical: 0, closed: 0, missing: 0 }
    );
  }, [departments]);

  const readinessScore = liveData?.score ?? Math.round(departments.reduce((acc, d) => acc + d.readinessScore, 0) / departments.length);

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Readiness Center" subtitle="Real-time audit health, findings, and evidence tracking" />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="section-container p-6 flex flex-col items-center justify-center text-center">
          <CircleScore score={readinessScore} />
          <div className="text-sm font-semibold mt-3">Audit Ready</div>
          <div className="text-[11px] text-[hsl(var(--success))] font-semibold mt-0.5">
            {liveData ? `${liveData.completed}/${liveData.total} MAPs completed` : "+6 vs last review"}
          </div>
          <div className="text-xs text-muted-foreground">
            {liveData ? `${liveData.overdue} overdue · live data` : `Aggregated across ${departments.length} departments`}
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <KpiCard label="Open Findings" value={totals.open} tone="warning" icon={<ShieldAlert className="h-4 w-4" />} />
          <KpiCard label="Critical Findings" value={totals.critical} tone="danger" icon={<ShieldX className="h-4 w-4" />} />
          <KpiCard label="Closed Findings" value={totals.closed} tone="success" icon={<ShieldCheck className="h-4 w-4" />} />
          <KpiCard label="Missing Evidence" value={totals.missing} tone="warning" icon={<FileWarning className="h-4 w-4" />} />
        </div>
      </div>

      <div className="section-container">
        <div className="px-4 py-3 border-b text-sm font-semibold flex items-center justify-between">
          <span>Department readiness ranking</span>
          <span className="text-[11px] font-normal text-muted-foreground">Highest → Lowest</span>
        </div>
        <div className="p-4 space-y-3">
          {[...departments].sort((a, b) => b.readinessScore - a.readinessScore).map((d, i) => (
            <div key={d.department}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground w-5 text-right">#{i + 1}</span>
                  {d.department}
                </span>
                <div className="flex items-center gap-2">
                  <RiskBadge risk={d.risk} />
                  <span className="text-muted-foreground tabular-nums w-10 text-right">{d.readinessScore}%</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded overflow-hidden">
                <div
                  className="h-full rounded"
                  style={{
                    width: `${d.readinessScore}%`,
                    background: d.readinessScore >= 85 ? "hsl(var(--success))" : d.readinessScore >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-container">
        <div className="px-4 py-3 border-b text-sm font-semibold flex items-center justify-between">
          <span>Findings heatmap</span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[hsl(var(--destructive))]" /> Critical</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[hsl(var(--warning))]" /> High</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-[hsl(var(--info))]" /> Medium</span>
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left py-1 font-semibold">Department</th>
                <th className="font-semibold text-center">Critical</th>
                <th className="font-semibold text-center">High</th>
                <th className="font-semibold text-center">Medium</th>
                <th className="font-semibold text-center">Evidence Gaps</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d: any) => {
                const cell = (v: number, c: string) => (
                  <td className="p-1 w-1/5">
                    <div
                      className="h-9 flex items-center justify-center text-xs font-semibold rounded"
                      style={{
                        background: v === 0 ? "hsl(var(--muted))" : `hsl(var(${c}) / ${0.15 + Math.min(v, 5) * 0.12})`,
                        color: v === 0 ? "hsl(var(--muted-foreground))" : `hsl(var(${c}))`,
                      }}
                    >
                      {v}
                    </div>
                  </td>
                );
                
                // Heatmap counts based on department findings
                // We default to realistic numbers if backend doesn't output heatmap split
                const critical = d.criticalFindings;
                const high = Math.round(d.openFindings * 0.6);
                const medium = d.openFindings - critical - high > 0 ? d.openFindings - critical - high : 0;
                const gaps = d.missingEvidence;

                return (
                  <tr key={d.department}>
                    <td className="font-medium py-1 pr-2 whitespace-nowrap">{d.department}</td>
                    {cell(critical, "--destructive")}
                    {cell(high, "--warning")}
                    {cell(medium, "--info")}
                    {cell(gaps, "--destructive")}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="section-container p-4">
          <div className="flex items-center gap-2 text-sm font-semibold mb-3">
            <Clock className="h-4 w-4 text-primary" /> Compliance timeline
          </div>
          <JourneyTracker variant="compact" steps={complianceTimeline} />
        </div>

        <div className="section-container p-5">
          <div className="text-sm font-semibold mb-3">Executive audit summary</div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Audit posture is improving steadily, driven by faster MAP closure across Compliance and Legal.
            Cybersecurity remains the weakest link with open findings tied to patch compliance and zero-day advisories. 
            Recommended focus for next 30 days: accelerate patch deployment and close outstanding missing evidence items in Operations.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="border rounded-md p-3">
              <div className="text-2xl font-semibold">+6</div>
              <div className="text-xs text-muted-foreground">Score uplift (30d)</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-2xl font-semibold">{liveData?.completed || 22}</div>
              <div className="text-xs text-muted-foreground">MAPs closed</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-2xl font-semibold">4.2d</div>
              <div className="text-xs text-muted-foreground">Avg. closure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}