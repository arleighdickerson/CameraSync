import { NativeModules, DeviceEventEmitter } from 'react-native';
import { DeviceList } from './types/Devices';

const { Devices } = NativeModules;

export default async () => {
  const info: DeviceList = await Devices.fetchAll();
  console.log(info);

  DeviceEventEmitter.addListener(Devices.EVENT_DEVICE_ATTACHED, (evt) => {
    console.dir(evt);
    console.log('');
  });
  DeviceEventEmitter.addListener(Devices.EVENT_DEVICE_DETACHED, evt => {
    console.dir(evt);
    console.log('');
  });
};
