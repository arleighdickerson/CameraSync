import React from 'react';
import { Provider } from 'react-redux';
import dependencies from './inversify.module';

export default () => (
  <Provider store={dependencies.store}>
    <dependencies.AppWithNavigationState/>
  </Provider>
);
