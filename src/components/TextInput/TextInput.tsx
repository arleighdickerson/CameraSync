import React, { Component } from 'react';
import {
  StyleProp,
  ViewStyle,
  TextInput as Input,
  TextInputProps as InputProps, View, Text,
} from 'react-native';

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

      const errorMessage = this.shouldDisplayError() ? error[0] : undefined;

      return (
        <View style={[styles.defaultContainer, containerStyle]}>
          <Input
            onBlur={input.onBlur}
            onChange={input.onChange}
            onFocus={input.onFocus}
            value={input.value}
            {...rest}
          />
          {
            errorMessage
              ? (
                <Text style={[styles.defaultError, errorStyle]}>
                  {errorMessage}
                </Text>
              )
              : null
          }
        </View>
      );
    }
}

export default TextInput;
