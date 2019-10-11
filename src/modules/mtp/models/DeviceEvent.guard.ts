/*
 * Generated type guards for "DeviceEvent.ts".
 * WARNING: Do not manually change this file.
 */
import { isDeviceInfo } from "./DeviceInfo.guard";
import { DeviceEvent } from "./DeviceEvent";

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
