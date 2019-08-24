import { DeviceInfo } from './DeviceInfo';

export * from './DeviceEvent.guard';

function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

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
