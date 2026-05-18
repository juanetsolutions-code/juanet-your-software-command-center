import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, User2 } from "lucide-react";
import { StatusBadge } from "@/components/app/StatusBadge";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/dashboard";

export interface ProjectCardProps {
  project: Project;
  active?: boolean;
  index?: number;
  onSelect?: (project: Project) => void;
}

export function ProjectCard({ project, active, index = 0, onSelect }: ProjectCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(project)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "w-full text-left glass rounded-2xl p-5 transition-all hover:bg-white/[0.06]",
        active && "ring-1 ring-brand-blue/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium truncate">{project.name}</h3>
            <StatusBadge status={project.status} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {project.client} • {project.category}
          </div>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
          />
        </div>
        <span className="text-xs text-muted-foreground w-10 text-right">
          {project.progress}%
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {project.dueLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <User2 className="h-3 w-3" /> {project.leadName}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {project.updatedLabel}
        </span>
      </div>
    </motion.button>
  );
}
