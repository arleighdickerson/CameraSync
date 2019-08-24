import { isDeviceInfo, DeviceInfo } from './DeviceInfo';

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
