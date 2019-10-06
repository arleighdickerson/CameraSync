import { createSelector } from 'reselect';
import { DeviceInfo, DeviceList } from './models';
import { DeviceState } from './reducer';

const getDevices = (state: { devices: DeviceState }) => state.devices || {};

type ActiveDevice = DeviceInfo | null;

export const getActiveDevice = createSelector(
  [getDevices],
  (devices: DeviceList): ActiveDevice => {
    const values: DeviceInfo[] = Object.values(devices);
    return values.length === 0 ? null : values[0];
  }
);
