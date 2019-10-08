import { DeviceSource } from 'modules/devices/sources/DeviceSource';
import { PermissionSource } from 'modules/permissions/sources/PermissionSource';
import { MtpSource } from 'modules/mtp/sources/MtpSource';

declare module 'react-native';

export interface NativeModules {
    Permissions: PermissionSource,
    Devices: DeviceSource,
    Mtp: MtpSource
}
