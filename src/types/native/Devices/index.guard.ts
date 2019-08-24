/*
 * Generated type guards for "index.ts".
 * WARNING: Do not manually change this file.
 */
import { DeviceInfo, DeviceEvent } from "./index";

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
        typeof obj.deviceName === "string"
    )
}

export function isDeviceEvent(obj: any, _argumentName?: string): obj is DeviceEvent {
    return (
        typeof obj === "object" &&
        (
            obj.type === "EVENT_DEVICE_ATTACHED" ||
            obj.type === "EVENT_DEVICE_DETACHED"
        ) &&
        isDeviceInfo(obj.payload) as boolean &&
        typeof obj.error === "boolean"
    )
}
