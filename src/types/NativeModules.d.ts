import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';
import { PermissionSource } from 'src/modules/permissions/sources/PermissionSource';

declare module 'react-native';

export interface NativeModules {
    Permissions: PermissionSource,
    Devices: DeviceSource
}
