import { Store } from 'redux';


export default (store: Store) => {
  require('./modules/devices/registerHandlers').default(store);
};
