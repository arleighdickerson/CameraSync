import * as typesafe from 'typesafe-actions';
import * as redux from 'redux';
import * as TYPES from './sources/types';

export enum actionTypes {
    REQUEST_STORAGE = 'permissions/REQUEST_STORAGE',
    STORAGE_GRANTED = 'permissions/STORAGE_GRANTED',
    STORAGE_DENIED = 'permissions/STORAGE_DENIED',
    REQUEST_DEVICE = 'permissions/REQUEST_DEVICE',
    DEVICE_GRANTED = 'permissions/DEVICE_GRANTED',
    DEVICE_DENIED = 'permissions/DEVICE_DENIED',
    FORGET_DEVICE = 'permissions/FORGET_DEVICE',
    FORGET_ALL_DEVICES = 'permissions/FORGET_ALL_DEVICES',
}

const createStorageAction = (type: string) => typesafe.createAction(type, action => {
  return () => action({});
});

export const requestStorage = createStorageAction(actionTypes.REQUEST_STORAGE);
export const storageGranted = createStorageAction(actionTypes.STORAGE_GRANTED);
export const storageDenied = createStorageAction(actionTypes.STORAGE_DENIED);

const createDeviceAction = (type: string) => typesafe.createAction(type, action => {
  return (deviceName: string) => action({ deviceName });
});

export const requestDevice = createDeviceAction(actionTypes.REQUEST_DEVICE);
export const deviceGranted = createDeviceAction(actionTypes.DEVICE_GRANTED);
export const deviceDenied = createDeviceAction(actionTypes.DEVICE_DENIED);
export const forgetDevice = createDeviceAction(actionTypes.FORGET_DEVICE);

export const forgetAllDevices = typesafe.createAction(actionTypes.FORGET_ALL_DEVICES);

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


const reducer: redux.Reducer = (state: PermissionsState = initialState, action: any) => {
  switch (action.type) {
  case actionTypes.STORAGE_DENIED: {
    return setStorage(state, false);
  }
  case actionTypes.STORAGE_GRANTED: {
    return setStorage(state, true);
  }
  case actionTypes.DEVICE_DENIED: {
    return setDevice(state, action.payload.deviceName, false);
  }
  case actionTypes.DEVICE_GRANTED: {
    return setDevice(state, action.payload.deviceName, true);
  }
  case actionTypes.FORGET_DEVICE: {
    const newState = cloneState(state);
    delete newState.devices[action.payload.deviceName];
    return newState;
  }
  case actionTypes.FORGET_ALL_DEVICES: {
    return { devices: {}, storage: state.storage };
  }
  default:
    return state;
  }
};
export { TYPES };
export default reducer;
