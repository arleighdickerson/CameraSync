import { Store } from 'redux';
import registerHandlers from './modules/devices/registerHandlers';

export default (store: Store) => {
  registerHandlers(store);
};
