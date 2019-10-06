// @ts-ignore

import {
  createStore,
  applyMiddleware,
  Store,
  Reducer,
  StoreEnhancer,
  Middleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { RunSagaOptions } from '@redux-saga/core';
import * as reduxPersist from 'redux-persist';
import _ from 'lodash';

import createComposer from './createComposer';
import createReducer, { getReducerKeys } from './createReducer';
import rootSaga from './rootSaga';
import Deferred from 'util/Deferred';

import AsyncStorage from '@react-native-community/async-storage';

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middleware?: Middleware[],
    enhancers?: StoreEnhancer[],
    sagaMiddlewareOptions?: RunSagaOptions<any, any>
}

export interface StoreOptions {
    devTools: boolean,
    persistStore: boolean
}

const createDefaultOptions = (): StoreOptions => ({
  devTools:     true,
  persistStore: true,// __DEV__ && !isTest,
});

export type CreatedStore = {
    store: Store,
    persistor: reduxPersist.Persistor | null,
    ready: Promise<void>
}

export default ({ reducers, middleware = [], enhancers = [], sagaMiddlewareOptions }: StoreConfiguration, options?: StoreOptions): CreatedStore => {
  const opts = { ...createDefaultOptions(), ...options };

  const sagaMiddleWare = createSagaMiddleware(sagaMiddlewareOptions);

  const defaultMiddleware = [
    sagaMiddleWare,
  ];

  const compose = createComposer(opts.devTools, {
    port: 8000,
  });

  const enhancer = compose(
    applyMiddleware(...defaultMiddleware, ...middleware),
    ...enhancers
  );

  let rootReducer: Reducer = createReducer(reducers);

  if (opts.persistStore) {
    const persistConfig = {
      key:       'root',
      storage:   AsyncStorage,
      blacklist: getReducerKeys(rootReducer), // blacklisting everything for now
    };

    rootReducer = reduxPersist.persistReducer(persistConfig, rootReducer);
  }

  // create store
  const store = createStore(
    rootReducer,
    enhancer
  );

  let ready: Promise<void> = Promise.resolve();
  let persistor = null;

  if (opts.persistStore) {

    const deferred: Deferred<void> = new Deferred();
    ready = deferred.promise;

    const persistorOptions = null; // enhancer?

    const callback = (error?: any) => {
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve();
      }
    };

    persistor = reduxPersist.persistStore(store, persistorOptions, callback);

    const unsubscribe = store.subscribe(() => {
      if (_.get(store.getState(), '_persist.rehydrated', false)) {
        unsubscribe();
        // start sags
        sagaMiddleWare.run(rootSaga);
      }
    });
  } else {
    // start sags
    sagaMiddleWare.run(rootSaga);
  }

  return {
    store,
    persistor,
    ready,
  };
};
