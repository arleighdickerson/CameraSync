import { Reducer, combineReducers } from 'redux';

// reducers
import form from './form';

export default (reducers: { [key: string]: Reducer }) => combineReducers({
  ...reducers,
  form,
});
