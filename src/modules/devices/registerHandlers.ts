import { Store } from 'redux';

import { isDeviceEvent } from './models';

import { container } from 'src/ioc';
import { getToken } from 'inversify-token';
import * as TYPES from 'src/types';
import { EventEmitter } from 'events';
import { DeviceDuck } from './duck';

// @todo make this work with duck
export default (store: Store) => {
  const deviceDuck: DeviceDuck = getToken(container, TYPES.DeviceDuck);

  const { deviceSource, creators } = deviceDuck;

  const emitter: EventEmitter = container.get(TYPES.EventSource.identifier);
  emitter.addListener(deviceSource.EVENT_DEVICE_ATTACHED, (evt) => {
    if (isDeviceEvent(evt)) {
      store.dispatch(creators.attach(evt.payload));
    }
  });
  emitter.addListener(deviceSource.EVENT_DEVICE_DETACHED, evt => {
    if (isDeviceEvent(evt)) {
      store.dispatch(creators.detach(evt.payload.deviceName));
    }
  });
};
