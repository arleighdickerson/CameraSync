import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { reducer as formReducer } from 'redux-form';
import {
  createNavigationReducer,
  createReactNavigationReduxMiddleware,
  createReduxContainer,
} from 'react-navigation-redux-helpers';

import * as TYPES from './types';
import { container } from './ioc';
import routes from './routes';
import { compose, applyMiddleware, StoreEnhancer, Middleware } from 'redux';

import registerHandlers from './registerHandlers';
import readyCallback from './readyCallback';
import createDuckRuntime from './createDuckRuntime';

const AppNavigator = createStackNavigator(routes);

const mapStateToProps = (state: any) => ({ state: state.nav });

// reducers that do not belong to any ducks
const reducers = {
  form: formReducer,
  nav:  createNavigationReducer(AppNavigator),
};

// user-defined redux store middleware
const middlewares: Array<Middleware> = [
  createReactNavigationReduxMiddleware(mapStateToProps),
];

// user-defined redux store enhancers
const enhancers: Array<StoreEnhancer> = [];

const createRootEnhancer = () => (
  __DEV__ // dev tools will only be hooked up if we're in dev mode
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
  enhancers:   [createRootEnhancer()],
});

container.bind(TYPES.DuckRuntime.identifier).toConstantValue(duckRuntime);
container.bind(TYPES.RootDuck.identifier).toDynamicValue(() => duckRuntime.duck);
container.bind(TYPES.Store.identifier).toDynamicValue(() => duckRuntime.store);

registerHandlers(duckRuntime.store);
readyCallback(duckRuntime.store);

const App = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(App);

export default () => (
  <Provider store={duckRuntime.store}>
    <AppWithNavigationState/>
  </Provider>
);
