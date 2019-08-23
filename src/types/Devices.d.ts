export type DeviceInfo = {
    deviceProtocol: number,
    deviceSubclass: number,
    productId: number,
    vendorId: number,
    deviceId: number,
    serialNumber: string,
    version: string,
    productName: string,
    manufacturerName: string,
    deviceName: string,
}

export type DeviceList = {
    [key: string]: DeviceInfo
}

declare module 'react-native';

export interface NativeModules {
    Devices: {
        EVENT_DEVICE_ATTACHED: string;
        EVENT_DEVICE_DETACHED: string;
        E_DEVICE_MISSING: string;
        E_NO_DEVICES_CONNECTED: string;
        fetchAll: () => Promise<DeviceList>,
    }
}
