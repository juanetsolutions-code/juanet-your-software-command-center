import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { marketingNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-4",
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={cn(
            "flex items-center justify-between rounded-2xl px-4 md:px-5 h-14 transition-all",
            scrolled ? "glass-strong shadow-lg" : "glass",
          )}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet text-primary-foreground shadow-[0_0_20px_-2px_var(--brand-blue)]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="font-semibold tracking-tight text-base">
              {site.name}
              <span className="text-brand-cyan">.</span>
            </span>
          </Link>

          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {marketingNav.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors relative",
                      active && "text-foreground",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
            >
              Client Portal
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden grid place-items-center h-9 w-9 rounded-md hover:bg-white/5"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden mt-2 glass-strong rounded-2xl p-4 animate-fade-in">
            <ul className="flex flex-col">
              {marketingNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block px-3 py-2.5 rounded-md text-sm hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  to="/dashboard"
                  className="block text-center h-10 leading-10 rounded-md text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
