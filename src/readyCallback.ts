// import * as deviceActions from './modules/devices';
import { Store } from 'redux';
import * as TYPES from './types';
import { getToken } from 'inversify-token';
import { container } from './ioc';

// @todo make this work with duck
export default (store: Store) => {
  const { creators } = getToken(container, TYPES.DeviceDuck);
  store.dispatch(creators.initDeviceList());
};
