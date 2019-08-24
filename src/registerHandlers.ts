import registerDeviceHandlers from './modules/devices/registerHandlers';
import { Store } from 'redux';

export default (store: Store) => {
  registerDeviceHandlers(store);
};
