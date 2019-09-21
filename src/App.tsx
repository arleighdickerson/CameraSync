import React from 'react';
import dependencies from './AppDependencies';
import { Provider } from 'react-redux';

export default () => (
  <Provider store={dependencies.store}>
    <dependencies.AppWithNavigationState/>
  </Provider>
);
