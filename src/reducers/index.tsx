import { Reducer, combineReducers } from 'redux';

// reducers
import form from './form';
import devices from '../modules/devices';
import permissions from '../modules/permissions';

export default (reducers: { [key: string]: Reducer }) => combineReducers({
  ...reducers,
  form,
  devices,
  permissions,
});
