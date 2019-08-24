import { DeviceList } from '../modules/devices/models'

declare module 'react-native';

export interface NativeModules {
    Permissions: {
        hasStorage: () => Promise<boolean>,
        hasDevice: (name?: string) => Promise<boolean>,
        authorizeStorage: () => Promise<boolean>,
        authorizeDevice: (name?: string) => Promise<boolean>,
    }
    Devices: {
        EVENT_DEVICE_ATTACHED: string;
        EVENT_DEVICE_DETACHED: string;
        E_DEVICE_MISSING: string;
        E_NO_DEVICES_CONNECTED: string;
        fetchAll: () => Promise<DeviceList>;
    }
}
