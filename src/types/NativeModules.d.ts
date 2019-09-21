import { DeviceSource } from 'modules/devices/sources/DeviceSource';
import { PermissionSource } from 'modules/permissions/sources/PermissionSource';

declare module 'react-native';

export interface NativeModules {
    Permissions: PermissionSource,
    Devices: DeviceSource
}
