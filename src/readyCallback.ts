// import * as deviceActions from './modules/devices';
import { Store } from 'redux';
import * as deviceModule from './modules/devices';

// @todo make this work with duck
export default (store: Store) => {
  store.dispatch(deviceModule.initDeviceList());
};
