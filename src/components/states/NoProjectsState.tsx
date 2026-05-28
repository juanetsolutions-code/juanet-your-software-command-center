import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export function NoProjectsState() {
  return (
    <EmptyState
      icon={<FolderKanban className="h-10 w-10" />}
      title="No projects yet"
      description="Your projects will appear here once created."
      action={
        <Link
          to="/dashboard/requests"
          className="h-9 px-4 rounded-md bg-gradient-to-r from-brand-blue to-brand-violet text-primary-foreground"
        >
          Request a project
        </Link>
      }
    />
  );
}
