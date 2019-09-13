import { PermissionSource } from './PermissionSource';

export abstract class PermissionSourceWrapper implements PermissionSource {
    protected abstract get delegate(): PermissionSource;

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
