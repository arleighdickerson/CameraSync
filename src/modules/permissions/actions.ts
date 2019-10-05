import {
  createStandardAction,
  TypeConstant,
} from 'typesafe-actions';

import { makeTypes } from 'util/typeHelpers';

const types = makeTypes({
  REQUEST_STORAGE:    null,
  STORAGE_GRANTED:    null,
  STORAGE_DENIED:     null,
  REQUEST_DEVICE:     null,
  DEVICE_GRANTED:     null,
  DEVICE_DENIED:      null,
  FORGET_DEVICE:      null,
  FORGET_ALL_DEVICES: null,
}, (v, k) => 'permissions/' + k);

export { types as actionTypes };

const createStorageAction = <T extends TypeConstant>(type: T) => createStandardAction(type)(); // .map(() => ({}));
export const requestStorage = createStorageAction(types.REQUEST_STORAGE);
export const storageGranted = createStorageAction(types.STORAGE_GRANTED);
export const storageDenied = createStorageAction(types.STORAGE_DENIED);

type DeviceName = {
    deviceName: string
}
const createDeviceAction = <T extends TypeConstant>(type: T) => createStandardAction(type).map(
  (deviceName: string): { payload: DeviceName } => ({
    payload: { deviceName },
  })
);

export const requestDevice = createDeviceAction(types.REQUEST_DEVICE);
export const deviceGranted = createDeviceAction(types.DEVICE_GRANTED);
export const deviceDenied = createDeviceAction(types.DEVICE_DENIED);
export const forgetDevice = createDeviceAction(types.FORGET_DEVICE);

export const forgetAllDevices = createStandardAction(types.FORGET_ALL_DEVICES)();

