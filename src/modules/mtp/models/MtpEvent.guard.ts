/*
 * Generated type guards for "MtpEvent.ts".
 * WARNING: Do not manually change this file.
 */
import { isMtpObjectInfo } from "./MtpObjectInfo.guard";
import { MtpEvent } from "./MtpEvent";

export function isMtpEvent(obj: any, _argumentName?: string): obj is MtpEvent {
    return (
        typeof obj === "object" &&
        obj.type === "EVENT_MTP_SCAN" &&
        isMtpObjectInfo(obj.payload) as boolean &&
        typeof obj.error === "boolean"
    )
}
