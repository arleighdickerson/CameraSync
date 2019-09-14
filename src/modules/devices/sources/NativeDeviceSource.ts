import { DeviceSourceWrapper } from './DeviceSourceWrapper';
import { DeviceSource } from './DeviceSource';
// import assert from 'assert';
import { injectable } from 'inversify';

const resolveNativeModule = (() => {
  let nativeModule: DeviceSource | null = null;
  return (): DeviceSource => {
    if (nativeModule === null) {
      const { NativeModules } = require('react-native');
      // assert(NativeModules, 'react-native.NativeModules apparently not present');
      const { Devices } = NativeModules;
      // assert(NativeModules, 'react-native.NativeModules.Devices apparently not present');
      nativeModule = Devices;
    }
    return <DeviceSource>nativeModule;
  };
})();

@injectable()
export class NativeDeviceSource extends DeviceSourceWrapper {
  get delegate() {
    return resolveNativeModule();
  }
}
