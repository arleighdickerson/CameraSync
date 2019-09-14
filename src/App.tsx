import React from 'react';
import { connect, Provider } from 'react-redux';
import * as TYPES from './types';
import { container } from './ioc';
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
import { reducer as formReducer } from 'redux-form';
import {
  compose,
  applyMiddleware,
  StoreEnhancer,
  Middleware,
} from 'redux';

import registerHandlers from './registerHandlers';
import readyCallback from './readyCallback';

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
  // middlewares is empty because our middlewares are composed directly onto the "root enhancer"
  middlewares: [],
  // as are the rest of our enhancers (if are defined)
  enhancers:   [
    // this is the "root enhancer"
    createRootEnhancer(),
  ],
});

container.bind(TYPES.Store.identifier).toConstantValue(duckRuntime.store);
container.bind(TYPES.RootDuck.identifier).toConstantValue(duckRuntime.duck);

registerHandlers(duckRuntime.store);
readyCallback(duckRuntime.store);

const App = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(App);

export default () => (
  <Provider store={duckRuntime.store}>
    <AppWithNavigationState/>
  </Provider>
);
