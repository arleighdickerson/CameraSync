import React, { ComponentClass, lazy, ReactNode } from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import Splash from 'components/Splash';
import PersistGate from 'components/PersistGate';
import { AppDependencies } from './AppDependencies';
import { lazyWrap } from '../../util/reactUtil';

type OuterProps = {
    afterLift?: () => any
}

type InnerProps = {
    store: Store,
    ready: Promise<void>,
    children?: ReactNode
} & OuterProps;

export const Wrapper = (props: InnerProps) => (
  <Provider store={props.store}>
    <PersistGate
      ready={props.ready}
      loading={<Splash/>}
      afterLift={props.afterLift}
    >
      {props.children}
    </PersistGate>
  </Provider>
);

type ComponentCreator = (WrappedComponent: ComponentClass, dependencies: AppDependencies) => React.FunctionComponent<OuterProps>;

const createComponent: ComponentCreator = (
  WrappedComponent,
  dependencies
) => (props: OuterProps) => (
  <Wrapper {...props} store={dependencies.store} ready={dependencies.ready}>
    <WrappedComponent/>
  </Wrapper>
);

export const wrap: ComponentCreator = (WrappedComponent, dependencies) => lazyWrap(
  () => createComponent(WrappedComponent, dependencies)
);
