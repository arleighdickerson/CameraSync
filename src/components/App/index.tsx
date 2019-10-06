import { AppDependencies } from './AppDependencies';
import { Store } from 'redux';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import PersistGate from '../PersistGate';
import Splash from '../Splash';
import { OuterProps } from './Wrapper';
import { createGhostObject, singletonize } from '../../util/ghostObject';

export type Props = {
    dependencies: AppDependencies
} & OuterProps


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
