import { createReducer } from 'typesafe-actions';
import * as actions from './actions';

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
  .handleAction(actions.storageDenied, (state) => {
    return setStorage(state, false);
  })
  .handleAction(actions.storageGranted, (state) => {
    return setStorage(state, true);
  })
  .handleAction(actions.deviceDenied, (state, action) => {
    return setDevice(state, <string>action.payload.deviceName, false);
  })
  .handleAction(actions.deviceGranted, (state, action) => {
    return setDevice(state, <string>action.payload.deviceName, true);
  })
  .handleAction(actions.forgetDevice, (state, action) => {
    const newState = cloneState(state);
    delete newState.devices[action.payload.deviceName];
    return newState;
  })
  .handleAction(actions.forgetAllDevices, (state) => {
    return { devices: {}, storage: state.storage };
  });
