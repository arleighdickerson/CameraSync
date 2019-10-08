export interface MtpSource {
    readonly EVENT_MTP_SCAN: string;
    sync: () => Promise<true>
}
