import React from 'react';
import { Provider } from 'react-redux';

import PersistGate from 'components/PersistGate';
import Splash from 'components/Splash';
import { createGhostObject } from 'util/ghostObject';

import Dependencies from './Dependencies';

import { Props } from './index';

const Content = (props: { dependencies: Dependencies }) => {
  const { AppWithNavigationState } = props.dependencies;
  return <AppWithNavigationState/>;
};

export default class RootContainer extends React.PureComponent<Props> {
    static defaultProps = createGhostObject(() => ({
      dependencies: new Dependencies(),
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
