import { MtpObjectInfo, DeviceInfo } from '../models';

export interface MtpSource {
    readonly EVENT_DEVICE_ATTACHED: string;
    readonly EVENT_DEVICE_DETACHED: string;
    getDeviceInfo: () => Promise<DeviceInfo | null>
    requestDevicePermission: () => Promise<boolean>,
    requestStoragePermission: () => Promise<boolean>,
    scanObjectHandles: () => Promise<MtpObjectInfo[]>
}
