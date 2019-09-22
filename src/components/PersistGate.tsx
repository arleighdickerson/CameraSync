import { PureComponent, ReactNode as Node } from 'react';

interface Props {
    loading?: Node,
    ready: Promise<any>,
    beforeLift: () => any,
    afterLift: () => any
}

interface State {
    bootstrapped: boolean,
    subscribed: boolean,
}

export default class PersistGate extends PureComponent<Props, State> {
    static defaultProps = {
      loading:    null,
      beforeLift: null,
      afterLift:  null,
    };

    state = {
      bootstrapped: false,
      subscribed:   true,
    };

    componentDidMount() {
      if (!this.state.bootstrapped) {
        this.props.ready.then(() => {
          if (this.state.subscribed) {
            this.setState({ bootstrapped: true, subscribed: false });
          }
        });
      }
    }

    componentWillUpdate(nextProps: Props, nextState: State) {
      if (!this.state.bootstrapped && nextState.bootstrapped) {
        if (this.props.beforeLift) {
          this.props.beforeLift();
        }
      }
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
      if (!prevState.bootstrapped && this.state.bootstrapped) {
        if (this.props.afterLift) {
          this.props.afterLift();
        }
      }
    }

    componentWillUnmount() {
      this.setState({ subscribed: false });
    }

    render() {
      return this.state.bootstrapped ? this.props.children : this.props.loading;
    }
}
