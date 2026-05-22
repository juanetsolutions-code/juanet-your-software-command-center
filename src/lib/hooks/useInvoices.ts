import { useState, useEffect } from "react";
import { app } from "@/lib/app/facade";
import type { Invoice } from "@/lib/dashboard/types";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const data = app.getInvoices();
      setInvoices(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markPaid = (id: string) => {
    app.markInvoicePaid(id);
  };

  return { invoices, loading, error, markPaid };
}
