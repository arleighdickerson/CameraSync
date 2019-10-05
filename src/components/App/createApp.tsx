import React from 'react';
import { Provider } from 'react-redux';
import Splash from 'components/Splash';
import PersistGate from 'components/PersistGate';
import { AppDependencies } from './AppDependencies';
import { lazyWrap } from 'util/reactUtil';

export type AppProps = {
    afterLift?: () => any
}

const createApp = (dependencies: AppDependencies) => {
  const App: React.FunctionComponent<AppProps> = (props: AppProps) => {

    return (
      <Provider store={dependencies.store}>
        <PersistGate
          ready={dependencies.ready}
          loading={<Splash/>}
          afterLift={props.afterLift}
        >
          <dependencies.AppWithNavigationState/>
        </PersistGate>
      </Provider>
    );
  };

  return App;
};

export default (dependencies: AppDependencies) => lazyWrap(() => createApp(dependencies));
