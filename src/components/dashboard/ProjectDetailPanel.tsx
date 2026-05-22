import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";
import type { Project, ProjectTimelineEvent } from "@/lib/dashboard";

export interface ProjectDetailPanelProps {
  project: Project;
  timeline: ProjectTimelineEvent[];
}

export function ProjectDetailPanel({ project, timeline }: ProjectDetailPanelProps) {
  return (
    <motion.aside
      key={project.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-2xl p-5 h-fit lg:sticky lg:top-20"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {project.category}
          </div>
          <h2 className="mt-1 text-lg font-semibold">{project.name}</h2>
          <div className="text-xs text-muted-foreground">{project.client}</div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            key={project.id + "bar"}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
        <Meta label="Lead" value={project.leadName} />
        <Meta label="Due" value={project.dueLabel} />
        <Meta label="Last update" value={project.updatedLabel} />
        <Meta label="Status" value={project.status} className="capitalize" />
      </div>

      <div className="mt-6">
        <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
          Timeline
        </div>
        <ol className="relative border-l border-white/10 pl-5 space-y-4">
          {timeline.map((s) => (
            <li key={s.id} className="relative">
              <span
                className={cn(
                  "absolute -left-[27px] top-0.5 h-3 w-3 rounded-full border-2",
                  s.done ? "bg-brand-cyan border-brand-cyan" : "bg-background border-white/20",
                )}
              />
              <div className="text-sm flex items-center gap-2">
                {s.title}
                {s.done && <CheckCircle2 className="h-3 w-3 text-brand-cyan" />}
              </div>
              <div className="text-[11px] text-muted-foreground">{s.dateLabel}</div>
            </li>
          ))}
        </ol>
      </div>
    </motion.aside>
  );
}

function Meta({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-sm", className)}>{value}</div>
    </div>
  );
}
