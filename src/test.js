import { NativeModules, DeviceEventEmitter } from 'react-native';

const { Permissions, Devices } = NativeModules;

function handler(event) {
  console.log(event.eventCode);
  console.log(event.param1);
  console.log(event.param2);
  console.log(event.param3);
}

export default async () => {
  /*
try {
  const hasStorage = await Permissions.hasStorage();
  const hasDevice = await Permissions.hasDevice(null);

  const storageWasAuthorized = await Permissions.authorizeStorage();
  const deviceWasAuthorized = await Permissions.authorizeDevice(null);

  console.log({
    hasStorage,
    hasDevice,
    storageWasAuthorized,
    deviceWasAuthorized,
  });
} catch (e) {
  console.dir(e);
}*/

  const info = await Devices.fetchAll();
  console.log(info);
};
