import { Reducer, combineReducers } from 'redux';

// reducers
import form from './form';
import devices from '../modules/devices';

export default (reducers: { [key: string]: Reducer }) => combineReducers({
  ...reducers,
  form,
  devices,
});
