export * from './MtpObjectInfo.guard';

/** @see {isMtpObjectInfo} ts-auto-guard:type-guard */
export interface MtpObjectInfo {
    objectHandle: number,
    name: string,
    imagePixWidth: number,
    imagePixHeight: number,
    // unix timestamps
    dateCreated: number,
    dateModified: number,
    // base64-encoded thumbnail
    thumbnail?: string
}
