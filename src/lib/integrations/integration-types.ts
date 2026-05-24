/**
 * Integration Types.
 */

export interface Integration {
  id: string;
  tenantId: string;
  type: string;
  config: Record<string, any>;
  enabled: boolean;
}
