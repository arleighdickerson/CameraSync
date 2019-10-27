export * from './DeviceInfo.guard';

/** @see {isDeviceInfo} ts-auto-guard:type-guard */
export interface DeviceInfo {
    deviceProtocol: number
    deviceSubclass: number
    productId: number
    vendorId: number
    deviceId: number
    serialNumber: string
    version: string
    productName: string
    manufacturerName: string
    deviceName: string
    //  hasPermission: boolean
}
