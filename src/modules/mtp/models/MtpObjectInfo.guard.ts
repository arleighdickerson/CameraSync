/*
 * Generated type guards for "MtpObjectInfo.ts".
 * WARNING: Do not manually change this file.
 */
import { MtpObjectInfo } from "./MtpObjectInfo";

export function isMtpObjectInfo(obj: any, _argumentName?: string): obj is MtpObjectInfo {
    return (
        typeof obj === "object" &&
        typeof obj.objectHandle === "number" &&
        typeof obj.name === "string" &&
        typeof obj.dateCreated === "number" &&
        typeof obj.dateModified === "number" &&
        typeof obj.imagePixWidth === "number" &&
        typeof obj.imagePixHeight === "number" &&
        (
            typeof obj.thumbnail === "undefined" ||
            typeof obj.thumbnail === "string"
        )
    )
}
