import { Store } from 'redux';
import { env } from 'src/util';


export default (store: Store) => {
  if (!env.isJest) {
    require('./modules/devices/registerHandlers').default(store);
  }
};
