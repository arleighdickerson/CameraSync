import {
  createStandardAction,
} from 'typesafe-actions';

import { makeTypes } from 'util/typeHelpers';
import { DeviceList, DeviceInfo } from './models';

const types = makeTypes({
  INIT_DEVICE_LIST:   null,
  ATTACH_ALL_DEVICES: null,
  DETACH_ALL_DEVICES: null,
  ATTACH_DEVICE:      null,
  DETACH_DEVICE:      null,
}, (v, k) => 'devices/' + k);

export { types as actionTypes };

export const initDeviceList = createStandardAction(types.INIT_DEVICE_LIST)();
export const attachAll = createStandardAction(types.ATTACH_ALL_DEVICES).map(
  (deviceList: DeviceList): { payload: DeviceList } => ({
    payload: deviceList,
  })
);
export const detachAll = createStandardAction(types.DETACH_ALL_DEVICES)();
export const attach = createStandardAction(types.ATTACH_DEVICE).map(
  (deviceInfo: DeviceInfo): { payload: DeviceInfo } => ({
    payload: deviceInfo,
  })
);
export const detach = createStandardAction(types.DETACH_DEVICE).map(
  (deviceName: string): { payload: { deviceName: string } } => ({
    payload: { deviceName },
  })
);

