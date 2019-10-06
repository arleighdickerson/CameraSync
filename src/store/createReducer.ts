import { Reducer, combineReducers } from 'redux';

// reducers
import { reducer as form } from 'redux-form';
import * as modules from '../modules';
import _ from 'lodash';
import { StoreOptions } from './createStore';
import AsyncStorage from '@react-native-community/async-storage';
import * as reduxPersist from 'redux-persist';

export default (runtimeReducers: any, options: StoreOptions) => {
  const reducers = ({
    // reducers added at runtime
    ...runtimeReducers,
    // reducers known at compiletime
    form,
    // reducers from modules
    ..._.mapValues(modules, (v) => v.default),
  });

  let rootReducer: Reducer = combineReducers(reducers);


  if (options.persistStore) {
    const persistConfig = {
      key:       'root',
      storage:   AsyncStorage,
      blacklist: Object.keys(reducers), // blacklisting everything for now
    };

    rootReducer = reduxPersist.persistReducer(persistConfig, rootReducer);
  }

  return rootReducer;

};
