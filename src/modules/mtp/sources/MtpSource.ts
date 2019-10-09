import { MtpObjectInfo } from 'modules/mtp/models';

export interface MtpSource {
    readonly EVENT_MTP_SCAN: string;
    scan: () => Promise<MtpObjectInfo[]>
    copyOne: () => Promise<boolean>
}
