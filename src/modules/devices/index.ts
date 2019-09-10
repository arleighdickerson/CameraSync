import * as typesafe from 'typesafe-actions';
import * as redux from 'redux';
import * as models from './models';
import { DeviceList } from './models';
import * as TYPES from './sources/types';

export enum actionTypes {
    INIT_DEVICE_LIST = 'devices/INIT_DEVICE_LIST',
    ATTACH_ALL_DEVICES = 'devices/ATTACH_ALL_DEVICES',
    DETACH_ALL_DEVICES = 'devices/DETACH_ALL_DEVICES',
    ATTACH_DEVICE = 'devices/ATTACH_DEVICE',
    DETACH_DEVICE = 'devices/DETACH_DEVICE',
}

interface DeviceInfo extends models.DeviceInfo {
}

type DeviceState = DeviceList | null

export const initDeviceList = () => typesafe.action(actionTypes.INIT_DEVICE_LIST);
export const attachAll = (deviceList: DeviceList) => typesafe.action(actionTypes.ATTACH_ALL_DEVICES, deviceList);
export const detachAll = () => typesafe.action(actionTypes.DETACH_ALL_DEVICES);
export const attach = (deviceInfo: DeviceInfo) => typesafe.action(actionTypes.ATTACH_DEVICE, deviceInfo);
export const detach = (deviceName: string) => typesafe.action(actionTypes.DETACH_DEVICE, { deviceName });

function cloneDeviceList(deviceList: DeviceList): DeviceList {
  const newState: DeviceState = {};
  Object.keys(deviceList).forEach(key => {
    newState[key] = { ...(deviceList[key]) };
  });
  return newState;
}

const initialState: DeviceState = {};

const reducer: redux.Reducer = (state: DeviceState = initialState, action: any) => {
  switch (action.type) {
  case actionTypes.ATTACH_ALL_DEVICES: {
    const oldState = cloneDeviceList(state || {});
    const newState = cloneDeviceList(action.payload);
    return { ...oldState, ...newState };
  }
  case actionTypes.DETACH_ALL_DEVICES: {
    return {};
  }
  case actionTypes.ATTACH_DEVICE: {
    return {
      ...cloneDeviceList(state || {}),
      [action.payload.deviceName]: { ...action.payload },
    };
  }
  case actionTypes.DETACH_DEVICE: {
    const newState = cloneDeviceList(state || {});
    delete newState[action.payload.deviceName];
    return newState;
  }
  default:
    return state;
  }
};

export { TYPES };
export default reducer;
