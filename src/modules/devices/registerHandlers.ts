import { Store } from 'redux';

/*
import { isDeviceEvent } from './models';
import * as env from '../../util/env';
import { NativeModules, DeviceEventEmitter as emitter } from 'react-native';
import * as actions from '.';
const { Devices } = NativeModules;
*/

// @todo make this work with duck
export default (store: Store) => {
  /*
    if (!env.isJest) {
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
    }
    */
};
