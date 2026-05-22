import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Star, Download } from "lucide-react";
import { products } from "@/lib/site";
import { Section, SectionHeader } from "./Section";

export function MarketplacePreview({ full = false }: { full?: boolean }) {
  const list = full ? products : products.slice(0, 3);
  return (
    <Section>
      {!full && (
        <SectionHeader
          eyebrow="Marketplace"
          title="Production-ready software, licensed instantly"
          description="Buy battle-tested systems with self-hosted licenses, source delivery and updates."
        />
      )}
      <div
        className={`mt-12 grid gap-4 ${full ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-3"}`}
      >
        {list.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group glass rounded-2xl p-5 hover:bg-white/[0.06] transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {p.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                {p.rating}
                <span className="text-muted-foreground">({p.reviews})</span>
              </span>
            </div>
            <h3 className="mt-3 font-semibold tracking-tight">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-xl font-semibold text-gradient-brand">${p.price}</div>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-xs font-medium bg-white/5 hover:bg-white/10 transition">
                <Download className="h-3.5 w-3.5" /> License
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      {!full && (
        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg glass hover:bg-white/[0.08]"
          >
            Browse the marketplace
          </Link>
        </div>
      )}
    </Section>
  );
}
