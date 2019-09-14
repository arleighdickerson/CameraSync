import { Store } from 'redux';
import * as env from 'src/util/env';


export default (store: Store) => {
  require('./modules/devices/registerHandlers').default(store);
};
