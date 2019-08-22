import { NativeModules, DeviceEventEmitter } from 'react-native';

const { UsbDevices } = NativeModules;

function handler(event) {
  console.log(event.eventCode);
  console.log(event.param1);
  console.log(event.param2);
  console.log(event.param3);
}

export default async () => {
  await Promise.all([
    UsbDevices.authorizeStorage(),
    UsbDevices.authorizeDevice(),
  ]);

  try {
    await UsbDevices.start();
  } catch (e) {
    console.log(e);
  }
};
