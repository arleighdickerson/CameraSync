export * from './MtpObjectInfo.guard';

/** @see {isMtpObjectInfo} ts-auto-guard:type-guard */
export interface MtpObjectInfo {
    name: string,
    // negative value of milliseconds before "now" the item was modified
    // divide by 1000 for unix timestamp diff from now
    dateCreated: number,
    dateModified: number,
    imagePixWidth: number,
    imagePixHeight: number,
    thumbnail?: string // base64-encoded
}
