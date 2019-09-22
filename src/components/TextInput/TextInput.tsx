import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// components
import { InputProps, Input } from 'react-native-elements';

// styles
import styles from './styles';

type Meta = {
    active?: boolean,
    dirty?: boolean,
    error: Array<any>,
    touched?: boolean,
}

interface Props {
    meta: Meta,
    input: InputProps,
    containerStyle: StyleProp<ViewStyle>,
    errorStyle: StyleProp<ViewStyle>
}

class TextInput extends Component<Props> {
    static defaultProps = {
      meta: {
        error: [],
      },
    };

    shouldDisplayError = () => {
      const {
        meta: {
          active,
          dirty,
          error,
          touched,
        },
      } = this.props;

      return error && !active && (dirty || touched);
    };

    render() {
      const {
        containerStyle,
        errorStyle,
        input = {},
        meta: {
          error = [],
        },
        ...rest
      } = this.props;

      return (
        <Input
          containerStyle={[styles.defaultContainer, containerStyle]}
          onBlur={input.onBlur}
          onChange={input.onChange}
          onFocus={input.onFocus}
          value={input.value}
          errorMessage={
            // @todo test this
            this.shouldDisplayError()
              ? error[0]
              : undefined
          }
          errorStyle={[styles.defaultError, errorStyle]}
          {...rest}
        />
      );
    }
}

export default TextInput;
