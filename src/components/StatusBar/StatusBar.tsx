import React from 'react';
import {
  StyleProp,
  ViewStyle,
} from 'react-native';

// components
import { View } from 'react-native';

// styles
import styles from './styles';

type Props = {
    style?: StyleProp<ViewStyle>
}


function StatusBar({ style }: Props) {
  return (
    <View style={[styles.statusBar, style || {}]}/>
  );
}

StatusBar.defaultProps = {
  style: [],
};

export default StatusBar;
