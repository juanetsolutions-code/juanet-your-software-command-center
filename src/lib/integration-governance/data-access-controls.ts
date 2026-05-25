export class DataAccessControls {
  check(tenantId: string, resource: string): boolean {
    return true;
  }
}

export const dataAccessControls = new DataAccessControls();
