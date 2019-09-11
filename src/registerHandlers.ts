import { Store } from 'redux';
import * as env from 'src/util/env';


export default (store: Store) => {
  if (!env.isJest) {
    require('./modules/devices/registerHandlers').default(store);
  }
};
