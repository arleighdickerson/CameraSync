/*
 * Generated type guards for "DeviceInfo.ts".
 * WARNING: Do not manually change this file.
 */
import { DeviceInfo } from "./DeviceInfo";

export function isDeviceInfo(obj: any, _argumentName?: string): obj is DeviceInfo {
    return (
        typeof obj === "object" &&
        typeof obj.deviceProtocol === "number" &&
        typeof obj.deviceSubclass === "number" &&
        typeof obj.productId === "number" &&
        typeof obj.vendorId === "number" &&
        typeof obj.deviceId === "number" &&
        typeof obj.serialNumber === "string" &&
        typeof obj.version === "string" &&
        typeof obj.productName === "string" &&
        typeof obj.manufacturerName === "string" &&
        typeof obj.deviceName === "string" &&
        typeof obj.hasPermission === "boolean"
    )
}
