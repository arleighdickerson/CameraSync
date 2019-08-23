import { NativeModules, DeviceEventEmitter } from 'react-native';

const { UsbDevices } = NativeModules;

function handler(event) {
  console.log(event.eventCode);
  console.log(event.param1);
  console.log(event.param2);
  console.log(event.param3);
}

export default async () => {
  const hasStorage = await UsbDevices.hasStorage();
  const hasDevice = await UsbDevices.hasDevice();

  const storageWasAuthorized = await UsbDevices.authorizeStorage();
  const deviceWasAuthorized = await UsbDevices.authorizeDevice();

  console.log({
    hasStorage,
    hasDevice,
    storageWasAuthorized,
    deviceWasAuthorized,
  });
};
