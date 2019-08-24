import * as typesafe from 'typesafe-actions';
import * as redux from 'redux';
import * as models from './models';

enum actionTypes {
    ATTACH_DEVICE = 'devices/ATTACH_DEVICE',
    DETACH_DEVICE = 'devices/DETACH_DEVICE',
}

interface DeviceInfo extends models.DeviceInfo {
}

interface DeviceState {
    [key: string]: DeviceInfo
}

export const attach = (deviceInfo: DeviceInfo) => typesafe.action(actionTypes.ATTACH_DEVICE, deviceInfo);
export const detach = (deviceName: string) => typesafe.action(actionTypes.DETACH_DEVICE, deviceName);

function cloneState(oldState: DeviceState): DeviceState {
  const newState: DeviceState = {};
  Object.keys(oldState).forEach(key => {
    newState[key] = { ...(oldState[key]) };
  });
  return newState;
}

const initialState: DeviceState = {};

const reducer: redux.Reducer = (state: DeviceState = initialState, action: any) => {
  switch (action.type) {
  case actionTypes.ATTACH_DEVICE:
    return {
      ...cloneState(state),
      [action.payload.deviceName]: { ...action.payload },
    };
  case actionTypes.DETACH_DEVICE:
    const newState = cloneState(state);
    delete newState[action.payload.deviceName];
    return newState;
  default:
    return state;
  }
};

export default reducer;
