import { strEnum } from 'util/typeHelpers';
import { MtpObjectInfo } from './MtpObjectInfo';

export * from './MtpEvent.guard';

const MtpEventType = strEnum([
  'EVENT_MTP_SCAN',
]);

type MtpEventType = keyof typeof MtpEventType;

/** @see {isMtpEvent} ts-auto-guard:type-guard */
export interface MtpEvent {
    type: MtpEventType,
    payload: MtpObjectInfo,
    error: boolean
}
