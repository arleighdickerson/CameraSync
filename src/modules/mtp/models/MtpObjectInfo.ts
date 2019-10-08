export * from './MtpObjectInfo.guard';

/** @see {isMtpObjectInfo} ts-auto-guard:type-guard */
export interface MtpObjectInfo {
    name: string,
    dateCreated: number,
    dateModified: number
}
