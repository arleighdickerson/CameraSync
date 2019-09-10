import { Permissions } from './sources';
import { DeviceSource } from 'src/modules/devices/sources/DeviceSource';

declare module 'react-native';

export interface NativeModules {
    Permissions: Permissions,
    Devices: DeviceSource
}
