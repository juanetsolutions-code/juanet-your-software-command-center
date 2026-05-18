import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { portfolio, type PortfolioItem } from "@/lib/site";
import { Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

const categories = ["All", "School", "CRM", "Inventory", "LMS", "Hospital", "Finance"] as const;

export function PortfolioGrid({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const items = useMemo<PortfolioItem[]>(
    () => (filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <Section>
      {!compact && (
        <SectionHeader
          eyebrow="Portfolio"
          title="Systems we've built and shipped"
          description="A snapshot of platforms powering schools, hospitals, agencies and finance teams."
        />
      )}

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "h-9 px-4 rounded-full text-xs font-medium transition",
              filter === c
                ? "bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
                : "glass hover:bg-white/[0.08] text-muted-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.a
            href="#"
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group glass rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/30 via-transparent to-brand-violet/30" />
              <div className="absolute inset-0 bg-grid opacity-40" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="glass-strong rounded-xl px-4 py-3 text-center">
                  <div className="text-xs text-muted-foreground">{item.category}</div>
                  <div className="mt-0.5 font-semibold tracking-tight text-gradient-brand">{item.title.split("—")[0]}</div>
                </div>
              </div>
              <div className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full glass-strong opacity-0 group-hover:opacity-100 transition">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{item.tagline}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </Section>
  );
}
