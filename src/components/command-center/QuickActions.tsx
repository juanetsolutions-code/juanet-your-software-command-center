import { type ReactNode } from "react";
import {
  PlusCircle,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export interface QuickAction {
  label: string;
  to: string;
  icon?: ReactNode;
  variant?: "default" | "primary";
}

export interface QuickActionsProps {
  actions?: QuickAction[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  const defaultActions: QuickAction[] = [
    { label: "New Request", to: "/dashboard/requests", icon: <PlusCircle className="h-4 w-4" /> },
    {
      label: "View Projects",
      to: "/dashboard/projects",
      icon: <FolderKanban className="h-4 w-4" />,
    },
    { label: "Messages", to: "/dashboard/messages", icon: <MessageSquare className="h-4 w-4" /> },
    { label: "Billing", to: "/dashboard/payments", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const activeActions = actions ?? defaultActions;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {activeActions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={
              action.variant === "primary"
                ? "h-9 px-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground glow-primary hover:opacity-90 transition-opacity"
                : "h-9 px-4 inline-flex items-center gap-2 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            }
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
