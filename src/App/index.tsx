import React from 'react';
import { Provider } from 'react-redux';

import PersistGate from 'components/PersistGate';
import Splash from 'components/Splash';
import { createGhostObject } from 'util/ghostObject';

import AppDependencies from 'ioc/AppDependencies';

export type Props = {
    dependencies: AppDependencies,
    afterLift?: () => any
}

const Content = (props: { dependencies: AppDependencies }) => {
  const { AppWithNavigationState } = props.dependencies;
  return <AppWithNavigationState/>;
};

export default class App extends React.PureComponent<Props> {
    static defaultProps = createGhostObject(() => ({
      dependencies: new AppDependencies(),
    }));

    render() {
      return (
        <Provider store={this.props.dependencies.store}>
          <PersistGate
            ready={this.props.dependencies.ready}
            loading={<Splash/>}
            afterLift={this.props.afterLift}
          >
            <Content dependencies={this.props.dependencies}/>
          </PersistGate>
        </Provider>
      );
    }
}
