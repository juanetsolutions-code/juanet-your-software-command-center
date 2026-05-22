/**
 * Optional Global Data Provider
 * Safe to use or ignore. Does not break the app if not mounted.
 *
 * Provides:
 * - Tenant context injection
 * - Basic prefetching hooks
 * - Cache hydration hooks
 */

import { createContext, useContext, ReactNode } from "react";
import { getTenantContext, clearTenantCaches } from "@/lib/dashboard/tenant-context";

interface DataProviderContextValue {
  prefetchDashboard: () => void;
  clearCache: () => void;
  tenant: ReturnType<typeof getTenantContext>;
}

const DataContext = createContext<DataProviderContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const tenant = getTenantContext();

  const value: DataProviderContextValue = {
    prefetchDashboard: () => {
      // Future: prefetch via facade + cache
      console.debug("[DataProvider] Prefetch triggered (no-op for now)");
    },
    clearCache: () => {
      clearTenantCaches();
    },
    tenant,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataProvider() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    // Safe fallback if provider is not used
    return {
      prefetchDashboard: () => {},
      clearCache: () => {},
      tenant: getTenantContext(),
    };
  }
  return ctx;
}

export default DataProvider;
