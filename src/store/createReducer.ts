import { combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';

export default (reducers: any) => combineReducers({
  // reducers added at runtime
  ...reducers,
  // reducers known at compiletime
  form,
  // reducers from modules
  ..._.mapValues(modules, (v) => v.default),
});
