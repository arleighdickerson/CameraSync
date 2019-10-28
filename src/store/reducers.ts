import { Reducer, combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';
import * as reduxPersist from 'redux-persist';
import { DependencyOptions } from 'ioc/AppDependencies';
import { StateType } from 'typesafe-actions';

const staticReducers = {
  form,
  // reducers from modules
  ..._.mapValues(modules, (v) => v.default),
};

const staticReducer = combineReducers(staticReducers);

export type RootState = StateType<typeof staticReducer>;

export default (runtimeReducers: any, options: DependencyOptions) => {
  const reducers = ({
    // reducers to be added at runtime
    ...runtimeReducers,
    // reducers known at compiletime
    ...staticReducers,
    // reducers from modules
  });

  let rootReducer: Reducer = combineReducers(reducers);


  if (options.persistConfig) {
    rootReducer = reduxPersist.persistReducer(options.persistConfig, rootReducer);
  }

  return rootReducer;

};
