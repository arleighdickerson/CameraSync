import React from 'react';
import { connect, Provider } from 'react-redux';

import {
  createStackNavigator,
} from 'react-navigation';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';

import routes from './routes';
import createDuckRuntime from './createDuckRuntime';
import registerHandlers from './registerHandlers';
import readyCallback from './readyCallback';
import { reducer as formReducer } from 'redux-form';
import {
  compose,
  applyMiddleware,
  StoreEnhancer,
  Middleware,
} from 'redux';

const AppNavigator = createStackNavigator(routes);

const mapStateToProps = (state: any) => ({ state: state.nav });

const reducers = {
  form: formReducer,
  nav:  createNavigationReducer(AppNavigator),
};

const middlewares: Array<Middleware> = [
  createReactNavigationReduxMiddleware(mapStateToProps),
];

const enhancers: Array<StoreEnhancer> = [];

const createDevToolsEnhancer = () => (
  __DEV__
    ? require('remote-redux-devtools').composeWithDevTools({
      realtime: true,
      port:     8000,
    })
    : compose
)(
  applyMiddleware(...middlewares),
  ...enhancers
);

const duckRuntime = createDuckRuntime({
  reducers,
  middlewares: [],
  enhancers:   [createDevToolsEnhancer()],
});

registerHandlers(duckRuntime.store);
readyCallback(duckRuntime.store);

const App = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(App);

export default () => (
  <Provider store={duckRuntime.store}>
    <AppWithNavigationState/>
  </Provider>
);
