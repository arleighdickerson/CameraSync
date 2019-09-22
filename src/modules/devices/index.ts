import {
  createReducer,
  createStandardAction,
} from 'typesafe-actions';
import { makeTypes } from 'util/typeHelpers';
import containerModule from './inversify.module';
import saga from './sagas';
import * as models from './models';

export { saga, containerModule };

const types = makeTypes({
  INIT_DEVICE_LIST:   null,
  ATTACH_ALL_DEVICES: null,
  DETACH_ALL_DEVICES: null,
  ATTACH_DEVICE:      null,
  DETACH_DEVICE:      null,
}, 'devices/');

export { types as actionTypes };

interface DeviceInfo extends models.DeviceInfo {
}

interface DeviceList extends models.DeviceList {
}

type DeviceState = DeviceList | null

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

function cloneDeviceList(deviceList: DeviceList): DeviceList {
  const newState: DeviceState = {};
  Object.keys(deviceList).forEach(key => {
    newState[key] = { ...(deviceList[key]) };
  });
  return newState;
}

const initialState: DeviceState = null;

export default createReducer(initialState as DeviceState)
  .handleAction(attachAll, (state, action) => {
    const oldState = cloneDeviceList(state || {});
    const newState = cloneDeviceList(action.payload);
    return { ...oldState, ...newState };
  })
  .handleAction(detachAll, () => {
    return {};
  })
  .handleAction(attach, (state, action) => {
    return {
      ...cloneDeviceList(state || {}),
      [action.payload.deviceName]: { ...action.payload },
    };
  })
  .handleAction(detach, (state, action) => {
    const newState = cloneDeviceList(state || {});
    delete newState[action.payload.deviceName];
    return newState;
  });
