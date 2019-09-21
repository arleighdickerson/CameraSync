import { Reducer, combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';

export default (reducers: { [key: string]: Reducer }) => combineReducers({
  ...reducers,
  form,
  ..._.mapValues(modules, (v) => v.default),
});
