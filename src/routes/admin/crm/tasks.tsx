import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Search, Plus, MoreHorizontal, Clock, Check, User, X } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/lib/crm/tasks/task-service";

export const Route = createFileRoute("/admin/crm/tasks")({
  component: AdminTasksPage,
  head: () => ({
    meta: [
      { title: "Tasks | Admin Console" },
      { name: "description", content: "Manage sales follow-up tasks." },
    ],
  }),
});

const fetchTasks = async () => {
  return taskService.getAll();
};

function AdminTasksPage() {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => fetchTasks(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="text-muted-foreground">Loading tasks...</span>
      </div>
    );
  }

  const tasksArray = tasks ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">Follow-up tasks and to-dos.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search tasks..."
              className="h-10 pl-9 pr-4 rounded-lg text-sm bg-white/5 border border-white/10 focus:outline-none focus:border-brand-cyan/50 w-48"
            />
          </div>
          <Link
            to="/admin/crm/tasks"
            className="h-10 px-4 inline-flex items-center gap-2 rounded-lg text-sm bg-brand-cyan text-brand-navy font-medium hover:bg-brand-cyan/90"
          >
            <Plus className="h-4 w-4" /> Add task
          </Link>
        </div>
      </header>

      {tasksArray.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="h-10 w-10" />}
          title="No tasks yet"
          description="Tasks will appear here when leads need follow-up."
        />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tasksArray.map((task) => (
                <tr key={task.id} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-medium">{task.title}</td>
                  <td className="py-3 px-4 text-muted-foreground capitalize">{task.type}</td>
                  <td className="py-3 px-4 capitalize">{task.priority}</td>
                  <td className="py-3 px-4 capitalize">{task.status}</td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-white/10 rounded">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
