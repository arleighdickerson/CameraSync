import { DeviceSourceWrapper } from './DeviceSourceWrapper';
import { DeviceSource } from './DeviceSource';
// import assert from 'assert';
import { injectable } from 'inversify';

export const factory = (): DeviceSource => {
  const { Devices } = require('react-native').NativeModules;
  if (!Devices) {
    throw new Error(
      'NativeModules.Devices not found. Are you sure we\'re running in a native environment?'
    );
  }
  return Devices;
};

@injectable()
export class NativeDeviceSource extends DeviceSourceWrapper {
  get delegate() {
    return factory();
  }
}
