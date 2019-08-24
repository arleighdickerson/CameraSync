import { Store } from 'redux';
import { NativeModules, DeviceEventEmitter as emitter } from 'react-native';
import { isDeviceEvent } from './models';
import * as actions from '.';

const { Devices } = NativeModules;

export default (store: Store) => {
  emitter.addListener(Devices.EVENT_DEVICE_ATTACHED, (evt) => {
    if (isDeviceEvent(evt)) {
      store.dispatch(actions.attach(evt.payload));
    }
  });
  emitter.addListener(Devices.EVENT_DEVICE_DETACHED, evt => {
    if (isDeviceEvent(evt)) {
      store.dispatch(actions.detach(evt.payload.deviceName));
    }
  });
};
