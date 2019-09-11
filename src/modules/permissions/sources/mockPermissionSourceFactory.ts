import { MockPermissionSource } from './MockPermissionSource';
import { PermissionSource } from './PermissionSource';

export const mockPermissionSourceFactory = (): PermissionSource => new MockPermissionSource();

