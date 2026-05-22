import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Sparkles } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border/60">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
              <span className="font-semibold">
                {site.name}
                <span className="text-brand-cyan">.</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">{site.description}</p>

            <form className="mt-6 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 h-10 px-3 rounded-md bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-brand-blue/60"
              />
              <button className="h-10 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground">
                Subscribe
              </button>
            </form>
          </div>

          <FooterCol
            title="Company"
            links={[
              { label: "About", to: "/about" },
              { label: "Portfolio", to: "/portfolio" },
              { label: "Projects", to: "/projects" },
              { label: "Contact", to: "/contact" },
            ]}
          />
          <FooterCol
            title="Services"
            links={[
              { label: "Custom Software", to: "/services" },
              { label: "SaaS Platforms", to: "/services" },
              { label: "Automation", to: "/services" },
              { label: "Cloud Infra", to: "/services" },
            ]}
          />
          <FooterCol
            title="Platform"
            links={[
              { label: "Shop", to: "/shop" },
              { label: "Client Portal", to: "/dashboard" },
              { label: "Admin", to: "/admin" },
              { label: "Licenses", to: "/dashboard/licenses" },
            ]}
          />
        </div>

        <div className="mt-14 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/" className="hover:text-foreground">
              Terms
            </Link>
            <div className="flex items-center gap-3 ml-2">
              <a href="#" aria-label="GitHub" className="hover:text-foreground">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-foreground">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-foreground">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4">{title}</h4>
      <ul className="space-y-2.5 text-sm text-muted-foreground">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="hover:text-foreground transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
