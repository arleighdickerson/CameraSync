import { NativeModules, DeviceEventEmitter } from 'react-native';

const { UsbDevices } = NativeModules;

function handler(event) {
  console.log(event.eventCode);
  console.log(event.param1);
  console.log(event.param2);
  console.log(event.param3);
}

export default async () => {
  const auths = await Promise.all([
    UsbDevices.authorizeStorage(),
    UsbDevices.authorizeDevice(),
  ]);

  console.log(auths);

  DeviceEventEmitter.addListener('MTP_EVENT', handler);

  UsbDevices.start();
}
