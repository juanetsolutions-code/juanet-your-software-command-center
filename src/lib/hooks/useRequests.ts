import { useState, useEffect } from "react";
import { app } from "@/lib/app/facade";
import type { ServiceRequest } from "@/lib/dashboard/types";

export function useRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const data = app.dashboard.listRequests();
      setRequests(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { requests, loading, error, refetch: () => setRequests(app.dashboard.listRequests()) };
}
