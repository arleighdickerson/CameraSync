import { DeviceList } from '../models';

export interface DeviceSource {
    readonly EVENT_DEVICE_ATTACHED: string;
    readonly EVENT_DEVICE_DETACHED: string;
    readonly E_DEVICE_MISSING: string;
    readonly E_NO_DEVICES_CONNECTED: string;
    fetchAll: () => Promise<DeviceList>;
}
