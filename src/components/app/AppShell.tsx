import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Search,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavItem = { label: string; to: string; icon: LucideIcon };

export function AppShell({
  brand,
  items,
  children,
}: {
  brand: string;
  items: NavItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = (user?.fullName ?? "JN")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = user?.role === "admin" ? "Admin" : "Client";

  async function handleLogout() {
    await signOut();
    navigate({ to: "/auth/login" });
  }

  return (
    <div className="min-h-screen flex">
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl transition-all duration-300",
          open ? "w-64" : "w-16",
        )}
      >
        <div className="h-16 flex items-center gap-2 px-4 border-b border-sidebar-border">
          <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet text-primary-foreground shrink-0">
            <Sparkles className="h-4 w-4" />
          </span>
          {open && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Juanet<span className="text-brand-cyan">.</span></div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{brand}</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {items.map((it) => {
            const active = pathname === it.to || (it.to !== "/" && pathname.startsWith(it.to));
            const Icon = it.icon;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                  active
                    ? "bg-white/5 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-gradient-to-b from-brand-cyan to-brand-violet" />
                )}
                <Icon className="h-4 w-4 shrink-0" />
                {open && <span className="truncate">{it.label}</span>}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="m-2 h-9 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center justify-center gap-2"
        >
          {open ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          {open && <span>Collapse</span>}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 bg-background/60 backdrop-blur-xl sticky top-0 z-30">
          <div className="h-full px-4 md:px-6 flex items-center gap-3">
            <div className="md:hidden">
              <Link to="/" className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-brand-cyan to-brand-violet">
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search projects, files, people..."
                className="w-full h-9 pl-9 pr-3 rounded-md bg-white/5 border border-border/60 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-brand-blue/60"
              />
            </div>
            <button className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-white/5">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-brand-cyan" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-9 pl-1 pr-2 flex items-center gap-2 rounded-md hover:bg-white/5">
                  <span className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet grid place-items-center text-[11px] font-semibold">
                    {initials}
                  </span>
                  <span className="hidden sm:block text-xs text-left">
                    <span className="block leading-tight">{user?.fullName ?? "Guest"}</span>
                    <span className="block text-muted-foreground leading-tight">{roleLabel}</span>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                  {user?.email ?? "Not signed in"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/dashboard" })}>
                  <UserIcon className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
