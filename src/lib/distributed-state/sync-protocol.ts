export interface SyncHandshake {
  clientId: string;
  lastKnownVersion: number;
  capabilities: string[];
}

export interface SyncResponse {
  serverVersion: number;
  acceptedCapabilities: string[];
  resumeFrom: number;
}

export function negotiate(
  req: SyncHandshake,
  serverVersion: number,
  supported: string[],
): SyncResponse {
  return {
    serverVersion,
    acceptedCapabilities: req.capabilities.filter((c) => supported.includes(c)),
    resumeFrom: Math.min(req.lastKnownVersion, serverVersion),
  };
}
