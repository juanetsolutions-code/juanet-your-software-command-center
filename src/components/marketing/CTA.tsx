import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-10 md:p-16 text-center">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-blue/30 blur-[120px]" />
          <div className="absolute -bottom-32 right-0 w-[500px] h-[300px] rounded-full bg-brand-violet/30 blur-[120px]" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
              Ready to build your next system or digital presence ?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Request a project, license a platform, or book a strategy call. We respond within one
              business day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary"
              >
                Request a project <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg glass hover:bg-white/[0.08]"
              >
                Browse marketplace
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-lg hover:bg-white/5"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
