import { makeTypes } from 'util/typeHelpers';
import {
  createAsyncAction,
  createStandardAction,
  TypeConstant,
} from 'typesafe-actions';
import { DeviceInfo, MtpObjectInfo } from './models';

const types = makeTypes({
  INIT_DEVICE:                null,
  ATTACH_DEVICE:              null,
  DETACH_DEVICE:              null,
  REQUEST_DEVICE_PERMISSION:  null,
  DEVICE_PERMISSION_GRANTED:  null,
  DEVICE_PERMISSION_DENIED:   null,
  REQUEST_STORAGE_PERMISSION: null,
  STORAGE_PERMISSION_GRANTED: null,
  STORAGE_PERMISSION_DENIED:  null,
  SCAN_OBJECTS_REQUEST:       null,
  SCAN_OBJECTS_SUCCESS:       null,
  SCAN_OBJECTS_FAILURE:       null,
}, (v, k) => 'mtp/' + k);

export const initDevice = createStandardAction(types.INIT_DEVICE)();

export const attachDevice = createStandardAction(types.ATTACH_DEVICE)<DeviceInfo>();

export const detachDevice = createStandardAction(types.DETACH_DEVICE)();

export const requestDevicePermission = createStandardAction(types.REQUEST_DEVICE_PERMISSION)();
export const devicePermissionGranted = createStandardAction(types.DEVICE_PERMISSION_GRANTED)();
export const devicePermissionDenied = createStandardAction(types.DEVICE_PERMISSION_DENIED)();

export const requestStoragePermission = createStandardAction(types.REQUEST_STORAGE_PERMISSION)();
export const storagePermissionGranted = createStandardAction(types.STORAGE_PERMISSION_GRANTED)();
export const storagePermissionDenied = createStandardAction(types.STORAGE_PERMISSION_DENIED)();

export const scanObjectsAsync = createAsyncAction(
  types.SCAN_OBJECTS_REQUEST,
  types.SCAN_OBJECTS_SUCCESS,
  types.SCAN_OBJECTS_FAILURE
)<undefined, MtpObjectInfo[], Error>();

export { types as actionTypes };
