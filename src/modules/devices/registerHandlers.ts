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

  emitter.addListener(deviceSource.EVENT_DEVICE_ATTACHED, (evt) => {
    if (isDeviceEvent(evt)) {
      store.dispatch(deviceModule.attach(evt.payload));
    }
  });
  emitter.addListener(deviceSource.EVENT_DEVICE_DETACHED, evt => {
    if (isDeviceEvent(evt)) {
      store.dispatch(deviceModule.detach(evt.payload.deviceName));
    }
  });
};
