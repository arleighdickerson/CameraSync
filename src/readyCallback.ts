import * as deviceActions from './modules/devices';
import { Store } from 'redux';

export default (store: Store) => {
  store.dispatch(deviceActions.initDeviceList());
};
