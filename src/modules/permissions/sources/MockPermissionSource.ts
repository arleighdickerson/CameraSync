import { PermissionSource } from './PermissionSource';
import { injectable } from 'inversify';

@injectable()
export class MockPermissionSource implements PermissionSource {
  hasStorage() {
    return Promise.resolve(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasDevice(name?: string) {
    return Promise.resolve(false);
  }

  authorizeStorage() {
    return Promise.resolve(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  authorizeDevice(name?: string) {
    return Promise.resolve(false);
  }
}
