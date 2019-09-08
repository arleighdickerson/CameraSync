import { Permissions, Devices } from './sources';

declare module 'react-native';

export interface NativeModules {
    Permissions: Permissions,
    Devices: Devices
}
