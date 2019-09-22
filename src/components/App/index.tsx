import React from 'react';
import { Provider } from 'react-redux';
import Splash from 'components/Splash';
import PersistGate from 'components/PersistGate';
import dependencies from './inversify.module';

const afterLift = () => {
};

export default () => (
  <Provider store={dependencies.store}>
    <PersistGate
      ready={dependencies.ready}
      loading={<Splash/>}
      afterLift={afterLift}
    >
      <dependencies.AppWithNavigationState/>
    </PersistGate>
  </Provider>
);
