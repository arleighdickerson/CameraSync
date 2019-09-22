import {
  createReducer,
  createStandardAction,
  TypeConstant,
} from 'typesafe-actions';
import { makeTypes } from 'util/typeHelpers';
import containerModule from './inversify.module';
import saga from './sagas';

export { saga, containerModule };

const types = makeTypes({
  REQUEST_STORAGE:    null,
  STORAGE_GRANTED:    null,
  STORAGE_DENIED:     null,
  REQUEST_DEVICE:     null,
  DEVICE_GRANTED:     null,
  DEVICE_DENIED:      null,
  FORGET_DEVICE:      null,
  FORGET_ALL_DEVICES: null,
}, 'permissions/');

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

type PermissionsState = {
    devices: { [key: string]: boolean }
    storage: boolean | null,
}

const initialState: PermissionsState = {
  devices: {},
  storage: null,
};

function cloneState(state: PermissionsState): PermissionsState {
  return {
    devices: { ...state.devices },
    storage: state.storage,
  };
}

const setStorage = (state: PermissionsState, storage: boolean | null) => ({
  ...cloneState(state),
  storage,
});

const setDevice = (state: PermissionsState, deviceName: string, value: boolean) => {
  const newState = cloneState(state);
  newState.devices[deviceName] = value;
  return newState;
};

export default createReducer(cloneState(initialState) as PermissionsState)
  .handleAction(storageDenied, (state) => {
    return setStorage(state, false);
  })
  .handleAction(storageGranted, (state) => {
    return setStorage(state, true);
  })
  .handleAction(deviceDenied, (state, action) => {
    return setDevice(state, <string>action.payload.deviceName, false);
  })
  .handleAction(deviceGranted, (state, action) => {
    return setDevice(state, <string>action.payload.deviceName, true);
  })
  .handleAction(forgetDevice, (state, action) => {
    const newState = cloneState(state);
    delete newState.devices[action.payload.deviceName];
    return newState;
  })
  .handleAction(forgetAllDevices, (state) => {
    return { devices: {}, storage: state.storage };
  });
