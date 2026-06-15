import { useState, useMemo, useEffect } from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown, Search, Download } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { EmptyState, SkeletonPage } from "@/components/shared/States";
import { auditLogs as mockLogs } from "@/mocks";
import { useAuth } from "@/state/AuthContext";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

type SortKey = "source" | "timestamp";
type SortDir = "asc" | "desc";

interface DisplayLog {
  source: string;
  clause: string;
  reasoning: string;
  timestamp: string;
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="inline h-3 w-3 ml-1 opacity-30" />;
  return sortDir === "asc" ? <ArrowUp className="inline h-3 w-3 ml-1" /> : <ArrowDown className="inline h-3 w-3 ml-1" />;
}

export default function AuditLogs() {
  const { user } = useAuth();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [liveLogs, setLiveLogs] = useState<DisplayLog[]>([]);

  const userRole = user?.user_metadata?.role ?? "Compliance Officer";
  const isAdmin = userRole.toLowerCase().includes("admin") || userRole.toLowerCase().includes("officer"); // compliance officer has export rights for mvp testing

  const loadLogs = (query?: string) => {
    api.listAuditLogs(query)
      .then((res) => {
        const mapped = (res || []).map((l: any) => ({
          source: l.entity_type,
          clause: l.action,
          reasoning: l.description || "—",
          timestamp: new Date(l.created_at).toLocaleString()
        }));
        setLiveLogs(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load audit logs", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLogs(searchTerm || undefined);
  }, [searchTerm]);

  const displayLogs = useMemo(() => {
    if (liveLogs.length > 0) return liveLogs;
    
    // Fallback to mocks if DB is empty
    return mockLogs.filter((l) => {
      const search = searchTerm.toLowerCase();
      return (
        l.source.toLowerCase().includes(search) ||
        l.clause.toLowerCase().includes(search) ||
        l.reasoning.toLowerCase().includes(search)
      );
    });
  }, [liveLogs, searchTerm]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return displayLogs;
    return [...displayLogs].sort((a, b) => {
      const cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [displayLogs, sortKey, sortDir]);

  const handleExport = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: `Exporting audit logs requires Administrator privileges. Current role: ${userRole}.`,
        variant: "destructive",
      });
      return;
    }

    const headers = ["Source", "Clause", "Reasoning", "Timestamp"];
    const rows = displayLogs.map((l) => [l.source, l.clause, l.reasoning, l.timestamp]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `reguflow_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${displayLogs.length} audit logs to CSV.`,
    });
  };

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Audit Logs" subtitle="AI analysis trail and regulatory reasoning history" />
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 border border-transparent rounded text-xs font-semibold transition-all h-fit self-start sm:self-center"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground border border-border bg-card rounded-md px-3 h-10 w-full sm:w-80">
        <Search className="h-4 w-4" />
        <input
          type="text"
          placeholder="Search logs..."
          className="border-0 bg-transparent text-sm flex-1 placeholder:text-muted-foreground/60 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="section-container">
        {sorted.length === 0 ? (
          <EmptyState
            title={searchTerm ? "No search results" : "No audit logs"}
            description={searchTerm ? "Try searching for a different term." : "No analysis events have been recorded yet."}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort("source")}>Source<SortIcon col="source" sortKey={sortKey} sortDir={sortDir} /></th>
                <th>Clause</th>
                <th>AI Reasoning</th>
                <th className="cursor-pointer select-none hover:text-foreground" onClick={() => toggleSort("timestamp")}>Timestamp<SortIcon col="timestamp" sortKey={sortKey} sortDir={sortDir} /></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l, i) => (
                <tr key={i}>
                  <td className="font-mono text-xs font-medium">{l.source}</td>
                  <td className="font-medium">{l.clause}</td>
                  <td className="text-muted-foreground">{l.reasoning}</td>
                  <td className="text-xs text-muted-foreground whitespace-nowrap">{l.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
