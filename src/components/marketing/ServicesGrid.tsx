import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { services } from "@/lib/site";
import { Section, SectionHeader } from "./Section";

export function ServicesGrid() {
  return (
    <Section id="services">
      <SectionHeader
        eyebrow="Services"
        title="Everything you need to ship modern software"
        description="From custom apps to AI and enterprise systems — one accountable team, end-to-end."
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => {
          const Icon = (Icons[s.icon as keyof typeof Icons] || Icons.Sparkles) as Icons.LucideIcon;
          return (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group relative rounded-2xl glass p-5 overflow-hidden hover:bg-white/[0.06] transition-colors"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--brand-blue)_30%,transparent),transparent_60%)]" />
              <div className="relative">
                <div className="h-10 w-10 rounded-lg grid place-items-center bg-gradient-to-br from-brand-blue/30 to-brand-violet/30 border border-white/10">
                  <Icon className="h-5 w-5 text-brand-cyan" />
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
