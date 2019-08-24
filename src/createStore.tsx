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

import createReducer from './reducers';
import rootSaga from './rootSaga';

export interface StoreConfiguration {
    reducers: { [key: string]: Reducer },
    middleware?: Middleware[],
    enhancers?: StoreEnhancer[]
}

export default ({ reducers, middleware = [], enhancers = [] }: StoreConfiguration): Store => {
  const sagaMiddleWare = createSagaMiddleware();

  const defaultMiddleware = [
    sagaMiddleWare,
  ];

  const enhancer = (
    __DEV__
      ? require('remote-redux-devtools').composeWithDevTools({
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
