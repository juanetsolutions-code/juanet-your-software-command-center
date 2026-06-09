import { useQuery } from "@tanstack/react-query";
import { ensureOrganization } from "./bootstrap";

/**
 * Returns the active organization UUID (real Supabase row).
 * Auto-creates org + membership on first call.
 */
export function useOrganizationId() {
  return useQuery({
    queryKey: ["organization-id"],
    queryFn: () => ensureOrganization(),
    staleTime: Infinity,
  });
}
