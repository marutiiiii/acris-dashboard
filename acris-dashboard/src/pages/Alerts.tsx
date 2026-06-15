import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { RiskBadge } from "@/components/shared/Badges";
import { EmptyState, SkeletonPage } from "@/components/shared/States";
import { alerts as mockAlerts, Risk } from "@/mocks";
import { Bell, CheckCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const borderLeft = (r: string) =>
  r === "High" ? "hsl(var(--risk-high))" : r === "Medium" ? "hsl(var(--risk-medium))" : "hsl(var(--risk-low))";

interface DisplayAlert {
  id: string;
  message: string;
  time: string;
  risk: Risk;
  regulationId?: string;
  isRead: boolean;
}

export default function Alerts() {
  const [selectedRisk, setSelectedRisk] = useState<Risk | "All">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Unread" | "Read">("All");
  const [loading, setLoading] = useState(true);
  const [liveAlerts, setLiveAlerts] = useState<DisplayAlert[]>([]);

  const loadAlerts = () => {
    api.listAlerts()
      .then((res) => {
        const mapped = (res || []).map((n: any) => ({
          id: n.id,
          message: n.title + " — " + n.message,
          time: new Date(n.created_at).toLocaleTimeString() + " today",
          risk: n.severity as Risk,
          regulationId: "Circular",
          isRead: n.is_read
        }));
        setLiveAlerts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load alerts", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const displayAlerts = useMemo(() => {
    if (liveAlerts.length > 0) return liveAlerts;
    
    // Fallback to mocks
    return mockAlerts.map(a => ({
      ...a,
      isRead: false // mocks don't have default isRead, default to unread
    }));
  }, [liveAlerts]);

  const toggleRead = async (id: string, currentlyRead: boolean) => {
    // If it's a mock alert, handle locally
    const isMock = !liveAlerts.some(a => a.id === id);
    
    if (isMock) {
      setLiveAlerts(prev => {
        const index = prev.findIndex(x => x.id === id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index].isRead = !currentlyRead;
          return updated;
        }
        // If it's pure mock from mockAlerts, add it to liveAlerts with toggled read state
        const original = mockAlerts.find(x => x.id === id);
        if (original) {
          return [...prev, { ...original, isRead: !currentlyRead }];
        }
        return prev;
      });
      return;
    }

    try {
      if (!currentlyRead) {
        await api.markAlertRead(id);
        setLiveAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
        toast({ title: "Alert read", description: "Marked alert as read." });
      } else {
        // Toggle back to unread locally or ignore (standard read toggling)
        setLiveAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: false } : a));
      }
    } catch (err: any) {
      toast({ title: "Failed to update alert", description: err.message, variant: "destructive" });
    }
  };

  const markAllRead = async () => {
    const unreadAlerts = displayAlerts.filter(a => !a.isRead);
    if (unreadAlerts.length === 0) return;

    try {
      // Mark all read in backend
      await Promise.all(unreadAlerts.map(a => api.markAlertRead(a.id).catch(() => {})));
      setLiveAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
      toast({
        title: "Alerts Updated",
        description: "All alerts have been marked as read.",
      });
    } catch (err) {
      // Fallback local update
      setLiveAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    }
  };

  const filteredAlerts = useMemo(() => {
    return displayAlerts.filter((a) => {
      const matchesRisk = selectedRisk === "All" || a.risk === selectedRisk;
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Read" && a.isRead) ||
        (statusFilter === "Unread" && !a.isRead);
      return matchesRisk && matchesStatus;
    });
  }, [displayAlerts, selectedRisk, statusFilter]);

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Alerts Feed" subtitle="Real-time compliance alerts and regulator notifications" />
        {displayAlerts.some(a => !a.isRead) && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground hover:text-foreground border border-border rounded text-xs font-semibold hover:bg-muted/80 transition-colors h-fit self-start sm:self-center"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between border-b pb-4">
        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Severity:</span>
          <div className="flex border border-border rounded-md p-0.5 bg-muted/30">
            {(["All", "High", "Medium", "Low"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  selectedRisk === r
                    ? "bg-card text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Status:</span>
          <div className="flex border border-border rounded-md p-0.5 bg-muted/30">
            {(["All", "Unread", "Read"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  statusFilter === s
                    ? "bg-card text-foreground shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground border border-transparent"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No alerts found"
          description="No notifications match the selected severity and status filters."
        />
      ) : (
        <div className="space-y-2">
          {filteredAlerts.map((a) => {
            const isRead = a.isRead;
            return (
              <div
                key={a.id}
                onClick={() => toggleRead(a.id, isRead)}
                className={`section-container flex items-start justify-between p-4 border-l-4 hover:bg-muted/20 cursor-pointer transition-all ${
                  isRead ? "opacity-60 bg-muted/10 border-muted" : "bg-card"
                }`}
                style={{ borderLeftColor: isRead ? undefined : borderLeft(a.risk) }}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Bell className={`h-4 w-4 mt-0.5 ${isRead ? "text-muted-foreground/60" : "text-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm leading-relaxed ${isRead ? "text-muted-foreground line-through" : "text-foreground font-medium"}`}>
                      {a.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      <span>{a.time}</span>
                      {a.regulationId && (
                        <>
                          <span>·</span>
                          <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">{a.regulationId}</span>
                        </>
                      )}
                      <span>·</span>
                      <span className="flex items-center gap-1 hover:text-foreground">
                        {isRead ? (
                          <>
                            <EyeOff className="h-3 w-3" /> Mark as unread
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" /> Mark as read
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <RiskBadge risk={a.risk} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
