import { makeTypes } from 'util/typeHelpers';
import { createStandardAction, TypeConstant } from 'typesafe-actions';
import { DeviceInfo } from './models';

const types = makeTypes({
  INIT_DEVICE:               null,
  ATTACH_DEVICE:             null,
  DETACH_DEVICE:             null,
  REQUEST_DEVICE_PERMISSION: null,
  DEVICE_PERMISSION_GRANTED: null,
  DEVICE_PERMISSION_DENIED:  null,
}, (v, k) => 'mtp/' + k);

const createAction = <T extends TypeConstant>(type: T) => createStandardAction(type)();

export const initDevice = createAction(types.INIT_DEVICE);

export const attachDevice = createStandardAction(types.ATTACH_DEVICE).map(
  (deviceInfo: DeviceInfo): { payload: DeviceInfo } => ({
    payload: deviceInfo,
  })
);

export const detachDevice = createAction(types.DETACH_DEVICE);
export const requestDevicePermission = createAction(types.REQUEST_DEVICE_PERMISSION);
export const devicePermissionGranted = createAction(types.DEVICE_PERMISSION_GRANTED);
export const devicePermissionDenied = createAction(types.DEVICE_PERMISSION_DENIED);

export { types as actionTypes };
