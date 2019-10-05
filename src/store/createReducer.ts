import { Reducer, combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';

const lookup = new WeakMap<Reducer, string[]/*{ [key: string]: Reducer }*/>();

export default (reducers: any) => {
  const allReducers = ({
    // reducers added at runtime
    ...reducers,
    // reducers known at compiletime
    form,
    // reducers from modules
    ..._.mapValues(modules, (v) => v.default),
  });

  const rootReducer = combineReducers(allReducers);

  lookup.set(rootReducer, Object.keys(allReducers));

  return rootReducer;
};

export const getReducerKeys = (root: Reducer) => {
  if (!lookup.has(root)) {
    throw new Error('key not found in lookup map');
  }
  return lookup.get(root);
};
