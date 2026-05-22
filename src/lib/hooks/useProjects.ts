import { useState, useEffect } from "react";
import { app } from "@/lib/app/facade";
import type { Project } from "@/lib/dashboard/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const data = app.dashboard.listProjects();
      setProjects(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, error, refetch: () => setProjects(app.dashboard.listProjects()) };
}
