import { motion } from "framer-motion";
import { StatusBadge } from "@/components/app/StatusBadge";
import type { Project } from "@/lib/dashboard";

export interface ProjectPipelineRowProps {
  project: Project;
  index?: number;
}

export function ProjectPipelineRow({ project, index = 0 }: ProjectPipelineRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className="grid grid-cols-12 items-center gap-3"
    >
      <div className="col-span-5">
        <div className="text-sm font-medium truncate flex items-center gap-2">
          {project.name}
        </div>
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <StatusBadge status={project.status} />
          <span>{project.dueLabel}</span>
        </div>
      </div>
      <div className="col-span-5">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 * index }}
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
          />
        </div>
      </div>
      <div className="col-span-2 text-right text-xs text-muted-foreground">
        {project.progress}%
      </div>
    </motion.div>
  );
}
