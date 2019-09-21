import { Store } from 'redux';

import { isDeviceEvent } from './models';
import * as deviceModule from './';
import { container } from 'src/ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';
import { EventEmitter } from 'events';

export default (store: Store) => {
  const deviceSource = getToken(container, TYPES.DeviceSource);
  const emitter: EventEmitter = getToken(container, TYPES.EventSource);

  const listeners = {
    [deviceSource.EVENT_DEVICE_ATTACHED]: (evt: any) => {
      if (isDeviceEvent(evt)) {
        store.dispatch(deviceModule.attach(evt.payload));
      }
    },
    [deviceSource.EVENT_DEVICE_DETACHED]: (evt: any) => {
      if (isDeviceEvent(evt)) {
        store.dispatch(deviceModule.detach(evt.payload.deviceName));
      }
    },
  };

  Object.entries(listeners).forEach(([name, listener]) => {
    emitter.removeAllListeners(name);
    emitter.addListener(name, listener);
  });
};
