import React from 'react';

type C<P> = React.Component<P, any> | React.FunctionComponent<P>

export const lazyWrap = <P, T extends C<P>>
  (factory: () => T): React.FunctionComponent<P> => {
  let Component: any;

  return (props?: P) => {
    if (!Component) {
      Component = factory();
    }
    return <Component {...props} />;
  };
};
