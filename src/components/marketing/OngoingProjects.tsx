import { motion } from "motion/react";
import { ongoingProjects } from "@/lib/site";
import { Section, SectionHeader } from "./Section";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  "Planning": "bg-white/10 text-muted-foreground",
  "In Progress": "bg-brand-blue/20 text-brand-cyan",
  "QA": "bg-amber-500/15 text-amber-300",
  "Launching": "bg-brand-violet/25 text-violet-200",
};

export function OngoingProjects() {
  return (
    <Section>
      <SectionHeader
        eyebrow="Live builds"
        title="Ongoing projects, in the open"
        description="Public progress for the systems we're currently building — transparency by default."
      />
      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ongoingProjects.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass rounded-2xl p-5 hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold tracking-tight">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.client}</p>
              </div>
              <span className={cn("text-[10px] uppercase tracking-wider px-2 py-1 rounded-full", statusColor[p.status])}>
                {p.status}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="text-foreground font-medium">{p.progress}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Tag className="h-3 w-3" />{p.category}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" />{p.due}</span>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
