import { useMemo, useState, useEffect } from "react";
import { DndContext, DragEndEvent, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import PageHeader from "@/components/shared/PageHeader";
import EnhancedKpiCard from "@/components/shared/EnhancedKpiCard";
import StatusPipeline from "@/components/shared/StatusPipeline";
import Drawer from "@/components/shared/Drawer";
import { RiskBadge } from "@/components/shared/Badges";
import { BeginnerHint, SkeletonPage } from "@/components/shared/States";
import { useIsBeginner } from "@/state/CopilotContext";
import { maps as mockMaps, MAP, MapStatus } from "@/mocks";
import { Calendar, User, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const COLUMNS: MapStatus[] = ["Pending", "Assigned", "In Progress", "Review", "Completed"];

function Card({ map }: { map: MAP }) {
  const isCompleted = map.status === "Completed";
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: map.id,
    disabled: isCompleted,
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const sevColor =
    map.severity === "Critical" ? "hsl(var(--risk-critical))"
    : map.severity === "High" ? "hsl(var(--risk-high))"
    : map.severity === "Medium" ? "hsl(var(--risk-medium))"
    : "hsl(var(--risk-low))";
  
  // Format owner initials
  const initials = map.owner 
    ? map.owner.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() 
    : "—";

  return (
    <div
      ref={setNodeRef}
      style={{ ...(style || {}), borderLeft: `4px solid ${sevColor}` }}
      {...(!isCompleted ? listeners : {})}
      {...(!isCompleted ? attributes : {})}
      className={`bg-card border border-border rounded-md p-3 shadow-sm transition-all ${
        isCompleted
          ? "cursor-default opacity-85"
          : "cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5"
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono font-semibold text-muted-foreground flex items-center gap-1">
          {map.id.substring(0, 8)}
          {isCompleted && <Lock className="h-3 w-3 text-muted-foreground/85" />}
        </span>
        <RiskBadge risk={map.severity} />
      </div>
      <div className="text-sm font-medium leading-snug mb-2">{map.title}</div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1" title={map.owner || "Unowned"}><User className="h-3 w-3" />{initials}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{map.dueDate}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{map.department || "Compliance"}</div>
    </div>
  );
}

function Column({ status, cards, onOpen }: { status: MapStatus; cards: MAP[]; onOpen: (m: MAP) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={`bg-muted/40 border border-border rounded-md flex flex-col min-h-[400px] transition-all ${isOver ? "ring-2 ring-primary bg-primary/5" : ""}`}>
      <div className="px-3 py-2 border-b bg-card rounded-t-md flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider">{status}</span>
        <span className="text-xs text-muted-foreground">{cards.length}</span>
      </div>
      <div className="p-2 space-y-2 flex-1">
        {cards.map((c) => (
          <div key={c.id} onDoubleClick={() => onOpen(c)}>
            <Card map={c} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Maps() {
  const [items, setItems] = useState<MAP[]>([]);
  const [open, setOpen] = useState<MAP | null>(null);
  const isBeginner = useIsBeginner();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [loading, setLoading] = useState(true);

  const loadMaps = () => {
    api.listMaps()
      .then((res) => {
        // Map backend properties to frontend model structure
        const mapped = (res || []).map((m: any) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          owner: m.owner || "Compliance Team",
          ownerInitials: m.owner ? m.owner.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() : "CT",
          department: m.owner ? m.owner.replace(" Team", "") : "Compliance",
          dueDate: m.deadline || new Date().toISOString().slice(0, 10),
          severity: m.severity,
          status: m.status as MapStatus,
          regulationId: m.clause_ref || "Circular",
          evidenceRequired: m.severity === "Critical" ? ["QA Validation", "Security Log Scan"] : ["Verification Record"],
          impact: m.description
        }));
        
        // Fallback to mock data if DB has no maps yet (for pristine demo run)
        setItems(mapped.length > 0 ? mapped : mockMaps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load maps", err);
        setItems(mockMaps);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMaps();
  }, []);

  const kpis = useMemo(() => ({
    total: items.length,
    pending: items.filter((m) => m.status === "Pending").length,
    assigned: items.filter((m) => m.status === "Assigned").length,
    inProgress: items.filter((m) => m.status === "In Progress").length,
    completed: items.filter((m) => m.status === "Completed").length,
    overdue: items.filter((m) => m.status !== "Completed" && new Date(m.dueDate) < new Date()).length,
  }), [items]);

  const onDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const target = over.id as MapStatus;
    const card = items.find((m) => m.id === active.id);
    if (!card) return;

    if (card.status === "Completed") {
      toast({
        title: "Workflow Locked",
        description: "Completed MAPs cannot be moved.",
        variant: "destructive",
      });
      return;
    }

    const sourceIndex = COLUMNS.indexOf(card.status);
    const targetIndex = COLUMNS.indexOf(target);

    // Enforce sequential status flow
    if (Math.abs(targetIndex - sourceIndex) > 1) {
      toast({
        title: "Workflow Violation",
        description: `Cannot move MAP from "${card.status}" directly to "${target}". Status transitions must be sequential (Pending ➔ Assigned ➔ In Progress ➔ Review ➔ Completed).`,
        variant: "destructive",
      });
      return;
    }

    // Optimistically update local items state
    const previousItems = [...items];
    setItems((arr) => arr.map((m) => (m.id === active.id ? { ...m, status: target } : m)));

    try {
      // Persist to backend database
      await api.updateMapStatus(card.id, target);
      toast({
        title: "MAP status updated",
        description: `"${card.title}" moved to "${target}".`,
      });
    } catch (err: any) {
      // Revert change on server-side rejection or network error
      setItems(previousItems);
      toast({
        title: "Failed to update MAP",
        description: err.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <PageHeader title="Measurable Action Points" subtitle="Compliance tasks generated from regulation changes, tracked through completion" />

      {isBeginner && (
        <BeginnerHint>Drag cards between columns to update status. Double-click a card to see full details.</BeginnerHint>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <EnhancedKpiCard
          label="Total MAPs"
          value={kpis.total}
          progress={{ current: kpis.completed, target: kpis.total, label: "Completion" }}
        />
        <EnhancedKpiCard
          label="Pending"
          value={kpis.pending}
          tone="warning"
          subMetrics={[{ label: "Avg Age", value: "4.1 days" }]}
        />
        <EnhancedKpiCard
          label="Assigned"
          value={kpis.assigned}
          tone="info"
          subMetrics={[{ label: "Owners", value: "3 depts" }]}
        />
        <EnhancedKpiCard
          label="In Progress"
          value={kpis.inProgress}
          tone="info"
          subMetrics={[{ label: "Active", value: "2 owners" }]}
        />
        <EnhancedKpiCard
          label="Completed"
          value={kpis.completed}
          tone="success"
          trend={{ value: 14, label: "this week" }}
        />
        <EnhancedKpiCard
          label="Overdue"
          value={kpis.overdue}
          tone="danger"
          trend={{ value: -25, suffix: "%", label: "vs Q1", inverse: true }}
        />
      </div>

      <StatusPipeline
        title="Workflow progress"
        steps={[
          { label: "Pending", count: kpis.pending, tone: "warning" },
          { label: "Assigned", count: kpis.assigned, tone: "info" },
          { label: "In Progress", count: kpis.inProgress, tone: "info" },
          { label: "Review", count: items.filter((m) => m.status === "Review").length, tone: "warning" },
          { label: "Completed", count: kpis.completed, tone: "success" },
        ]}
      />

      <div className="flex flex-wrap gap-2 text-[11px]">
        <span className="text-muted-foreground mr-1">Severity:</span>
        {[
          { label: "Critical", c: "hsl(var(--risk-critical))" },
          { label: "High", c: "hsl(var(--risk-high))" },
          { label: "Medium", c: "hsl(var(--risk-medium))" },
          { label: "Low", c: "hsl(var(--risk-low))" },
        ].map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1 px-2 py-0.5 border border-border rounded bg-card">
            <span className="w-2 h-2 rounded-sm" style={{ background: s.c }} /> {s.label}
          </span>
        ))}
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {COLUMNS.map((c) => (
            <Column key={c} status={c} cards={items.filter((m) => m.status === c)} onOpen={setOpen} />
          ))}
        </div>
      </DndContext>

      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.title}>
        {open && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs">{open.id.substring(0, 8)}</span>
              <RiskBadge risk={open.severity} />
              <span className="text-xs text-muted-foreground">{open.department}</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Description</div>
              <p>{open.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Owner</div>
                <div>{open.owner}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Due date</div>
                <div>{open.dueDate}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Related regulation</div>
                <div className="font-mono">{open.regulationId}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Status</div>
                <div>{open.status}</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Impact</div>
              <p className="text-muted-foreground">{open.impact}</p>
            </div>
            {open.evidenceRequired && open.evidenceRequired.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Evidence required</div>
                <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                  {open.evidenceRequired.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}