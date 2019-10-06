import { Reducer, combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';
import { DependencyOptions } from 'App';
import * as reduxPersist from 'redux-persist';

export default (runtimeReducers: any, options: DependencyOptions) => {
  const reducers = ({
    // reducers to be added at runtime
    ...runtimeReducers,
    // reducers known at compiletime
    form,
    // reducers from modules
    ..._.mapValues(modules, (v) => v.default),
  });

  let rootReducer: Reducer = combineReducers(reducers);


  if (options.persistConfig) {
    rootReducer = reduxPersist.persistReducer(options.persistConfig, rootReducer);
  }

  return rootReducer;

};
