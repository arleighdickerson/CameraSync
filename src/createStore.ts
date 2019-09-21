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

import { isTest } from './util/env';
import createReducer from './reducers';
import rootSaga from './sagas';

const remoteDevTools = require('remote-redux-devtools');

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middleware?: Middleware[],
    enhancers?: StoreEnhancer[]
}

export interface StoreOptions {
    devTools: boolean
}

const createDefaultOptions = (): StoreOptions => ({
  devTools: __DEV__ && !isTest,
});

export default ({ reducers, middleware = [], enhancers = [] }: StoreConfiguration, options?: StoreOptions): Store => {
  const { devTools } = { ...createDefaultOptions(), ...options };

  const sagaMiddleWare = createSagaMiddleware();

  const defaultMiddleware = [
    sagaMiddleWare,
  ];

  const enhancer = (
    devTools
      ? remoteDevTools.composeWithDevTools({
        realtime: true,
        port:     8000,
      })
      : compose
  )(
    applyMiddleware(...defaultMiddleware, ...middleware),
    ...enhancers
  );

  // create store
  const store = createStore(createReducer(reducers), enhancer);

  // start sags
  sagaMiddleWare.run(rootSaga);

  return store;
};
