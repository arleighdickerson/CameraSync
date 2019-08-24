import { DeviceList } from './index';

export type DevicesModule = {
    EVENT_DEVICE_ATTACHED: string;
    EVENT_DEVICE_DETACHED: string;
    E_DEVICE_MISSING: string;
    E_NO_DEVICES_CONNECTED: string;
    fetchAll: () => Promise<DeviceList>;
}

declare module 'react-native';

export default interface NativeModules {
    Devices: DevicesModule
}
