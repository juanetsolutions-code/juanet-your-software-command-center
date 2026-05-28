import { Receipt, CreditCard, Activity } from "lucide-react";
import { EmptyState } from "@/components/states/EmptyState";
import { Link } from "@tanstack/react-router";

export function NoInvoicesState() {
  return (
    <EmptyState
      icon={<Receipt className="h-10 w-10" />}
      title="No invoices"
      description="You have no invoices to display. They'll appear here when created."
      action={
        <Link
          to="/dashboard/projects"
          className="h-9 px-4 rounded-md border border-white/10 bg-white/5"
        >
          View projects
        </Link>
      }
    />
  );
}

export function NoPaymentsState() {
  return (
    <EmptyState
      icon={<CreditCard className="h-10 w-10" />}
      title="No payment methods"
      description="Add a payment method to manage billing."
    />
  );
}

export function NoActivityState() {
  return (
    <EmptyState
      icon={<Activity className="h-10 w-10" />}
      title="No activity yet"
      description="Recent activity will appear here as it happens."
    />
  );
}
