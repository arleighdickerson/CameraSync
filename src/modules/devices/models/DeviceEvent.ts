import { strEnum } from 'util/typeHelpers';
import { DeviceInfo } from './DeviceInfo';

export * from './DeviceEvent.guard';

const DeviceEventType = strEnum([
  'EVENT_DEVICE_ATTACHED',
  'EVENT_DEVICE_DETACHED',
]);

type DeviceEventType = keyof typeof DeviceEventType;

/** @see {isDeviceEvent} ts-auto-guard:type-guard */
export interface DeviceEvent {
    type: DeviceEventType,
    payload: DeviceInfo,
    error: boolean
}
