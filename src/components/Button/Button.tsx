import React from 'react';

// components
import {
  Button as ReactNativeElementsButton,
  ButtonProps,
} from 'react-native-elements';

// styles
import styles from './styles';

const Button = (props: ButtonProps) => {
  const {
    containerStyle,
    buttonStyle,
    titleStyle,
    ...rest
  } = props;

  return (
    <ReactNativeElementsButton
      containerStyle={[styles.defaultButtonContainer, containerStyle]}
      buttonStyle={[styles.defaultButton, buttonStyle]}
      titleStyle={[styles.defaultText, titleStyle]}
      {...rest} />
  );
};

export default Button;
