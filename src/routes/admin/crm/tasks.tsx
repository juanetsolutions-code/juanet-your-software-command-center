import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, Plus, Calendar, User, AlertCircle, Clock } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";

export const Route = createFileRoute("/admin/crm/tasks")({
  component: AdminTasksPage,
  head: () => ({
    meta: [
      { title: "Tasks | Admin Console" },
      { name: "description", content: "Sales follow-ups and task management." },
    ],
  }),
});

type TaskItem = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string;
  entityType: "lead" | "contact" | "deal";
  status: "pending" | "in_progress" | "completed";
};

const mockTasks: TaskItem[] = [
  { id: "t1", title: "Follow up with Alex Johnson", priority: "high", entityType: "lead", status: "pending", dueDate: "2024-02-12" },
  { id: "t2", title: "Send proposal to Maria", priority: "urgent", entityType: "lead", status: "pending", dueDate: "2024-02-10" },
  { id: "t3", title: "Demo for BizGroup", priority: "medium", entityType: "deal", status: "in_progress", dueDate: "2024-02-15" },
];

function PriorityDot({ priority }: { priority: TaskItem["priority"] }) {
  const colors = {
    low: "bg-gray-400",
    medium: "bg-amber-400",
    high: "bg-orange-400",
    urgent: "bg-red-400",
  };
  return <div className={`h-2 w-2 rounded-full ${colors[priority]}`} />;
}

function AdminTasksPage() {
  const tasks = mockTasks;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Follow-ups, reminders, and sales activities.
          </p>
        </div>
        <Link
          to="/admin/crm/tasks"
          className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
        >
          <Plus className="h-4 w-4" /> New task
        </Link>
      </header>

      {tasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-10 w-10" />}
          title="No tasks yet"
          description="Your follow-ups will appear here."
        />
      ) : (
        <div className="glass rounded-2xl divide-y divide-border/60">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 hover:bg-white/[0.03]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <PriorityDot priority={task.priority} />
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="capitalize">{task.entityType}</span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`text-xs capitalize px-2 py-1 rounded-full ${
                  task.priority === "urgent" ? "bg-red-500/15 text-red-400" :
                  task.priority === "high" ? "bg-orange-500/15 text-orange-400" :
                  "bg-white/5"
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}