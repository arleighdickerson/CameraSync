import {
  compose,
  createStore,
  applyMiddleware,
  Store,
  Reducer,
  StoreEnhancer,
  Middleware,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as reduxPersist from 'redux-persist';

import { isTest } from 'util/env';
import createReducer from './createReducer';
import rootSaga from './rootSaga';
import Deferred from 'util/Deferred';


export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middleware?: Middleware[],
    enhancers?: StoreEnhancer[]
}

export interface StoreOptions {
    devTools: boolean,
    persistStore: boolean
}

const createDefaultOptions = (): StoreOptions => ({
  devTools:     __DEV__ && !isTest,
  persistStore: __DEV__ && !isTest,
});

export type CreatedStore = {
    store: Store,
    persistor: reduxPersist.Persistor | null,
    ready: Promise<void>
}

export default ({ reducers, middleware = [], enhancers = [] }: StoreConfiguration, options?: StoreOptions): CreatedStore => {
  const opts = { ...createDefaultOptions(), ...options };

  const sagaMiddleWare = createSagaMiddleware();

  const defaultMiddleware = [
    sagaMiddleWare,
  ];

  const enhancer = (
    opts.devTools
      ? require('remote-redux-devtools').composeWithDevTools({
        realtime: true,
        port:     8000,
      })
      : compose
  )(
    applyMiddleware(...defaultMiddleware, ...middleware),
    ...enhancers
  );

  let rootReducer: any = createReducer(reducers);

  if (opts.persistStore) {
    const persistConfig = {
      key:     'root',
      storage: require('@react-native-community/async-storage').default,
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
  }

  // start sags
  sagaMiddleWare.run(rootSaga);

  return {
    store,
    persistor,
    ready,
  };
};
