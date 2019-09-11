export interface PermissionSource {
    hasStorage: () => Promise<boolean>,
    hasDevice: (name?: string) => Promise<boolean>,
    authorizeStorage: () => Promise<boolean>,
    authorizeDevice: (name?: string) => Promise<boolean>,
}

export class PermissionSourceWrapper implements PermissionSource {
  constructor(private readonly delegate: PermissionSource) {
  }

  hasStorage() {
    return this.delegate.hasStorage();
  }

  hasDevice(name?: string) {
    return this.delegate.hasDevice(name);
  }

  authorizeStorage() {
    return this.delegate.authorizeStorage();
  }

  authorizeDevice(name?: string) {
    return this.delegate.authorizeDevice(name);
  }
}
