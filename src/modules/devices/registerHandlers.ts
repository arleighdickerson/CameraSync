import { Store } from 'redux';

import { isDeviceEvent } from './models';
import { NativeModules } from 'react-native';

const { Devices } = NativeModules;
import { container } from 'src/ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';
import { EventEmitter } from 'events';

// @todo make this work with duck
export default (store: Store) => {
  const { creators } = getToken(container, TYPES.DeviceDuck);

  const emitter: EventEmitter = container.get(TYPES.EventSource.identifier);
  emitter.addListener(Devices.EVENT_DEVICE_ATTACHED, (evt) => {
    if (isDeviceEvent(evt)) {
      store.dispatch(creators.attach(evt.payload));
    }
  });
  emitter.addListener(Devices.EVENT_DEVICE_DETACHED, evt => {
    if (isDeviceEvent(evt)) {
      store.dispatch(creators.detach(evt.payload.deviceName));
    }
  });
};
