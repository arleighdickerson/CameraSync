import { createReducer } from 'typesafe-actions';
import {
  attach,
  attachAll,
  detach,
  detachAll,
} from './actions';
import { DeviceList } from './models';
function cloneDeviceList(deviceList: DeviceList): DeviceList {
  const newState: DeviceState = {};
  Object.keys(deviceList).forEach(key => {
    newState[key] = { ...(deviceList[key]) };
  });
  return newState;
}

export type DeviceState = DeviceList | null
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

/*
  .handleAction(changeActiveDevice, (state, action) => {
    const key = action.payload.deviceName;
    const tempState = cloneDeviceList(state || {});

    const activeDevice = tempState[key];
    delete tempState[key];

    const newState: DeviceState = { [key]: activeDevice };
    Object.entries(tempState).forEach(([k, v]) => {
      newState[k] = v;
    });

    return newState;
  });
 */
