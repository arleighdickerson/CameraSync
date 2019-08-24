import { isDeviceInfo } from './index.guard';

export * from './index.guard';
export * from './index.d';

/** @see {isDeviceInfo} ts-auto-guard:type-guard */
export interface DeviceInfo {
    deviceProtocol: number
    deviceSubclass: number
    productId: number
    vendorId: number
    deviceId: number
    serialNumber: string
    version: string
    productName: string
    manufacturerName: string
    deviceName: string
}

export interface DeviceList {
    [key: string]: DeviceInfo
}

export function isDeviceList(obj: any): obj is DeviceList {
  if (typeof obj !== 'object') {
    return false;
  }

  for (let key of Object.keys(obj)) {
    if (!isDeviceInfo(obj[key])) {
      return false;
    }
  }

  return true;
}


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
