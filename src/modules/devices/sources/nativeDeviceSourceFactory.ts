import { DeviceSource, DeviceSourceWrapper } from './DeviceSource';


const createSource = () => {
  const { Devices } = require('react-native').NativeModules;
  return new DeviceSourceWrapper(Devices);
};

function createFactory(): () => DeviceSource {
  let instance: DeviceSource | null = null;
  return () => {
    if (instance === null) {
      instance = createSource();
    }
    return instance;
  };
}

export const nativeDeviceSourceFactory = createFactory();
