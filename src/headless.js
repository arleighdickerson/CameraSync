import { NativeModules } from 'react-native';

const { UsbDevices } = NativeModules;

export default async (taskData) => {
  console.log('startup')
  try {
    const evt = await UsbDevices.readEvent();
    console.log('got event');
    console.log(evt);
  } catch (e) {
    console.log('got error');
    console.error(e);
  }
}
