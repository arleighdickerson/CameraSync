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
import createStore from './createStore';

const AppNavigator = createStackNavigator(routes);

const mapStateToProps = (state: any) => ({ state: state.nav });

const store = createStore({
  reducers: {
    nav: createNavigationReducer(AppNavigator),
  },
  middleware: [
    createReactNavigationReduxMiddleware(mapStateToProps),
  ],
});

const App = createReduxContainer(AppNavigator);
const AppWithNavigationState = connect(mapStateToProps)(App);
 require('./test').default();
export default () => (
  <Provider store={store}>
    <AppWithNavigationState/>
  </Provider>
);
