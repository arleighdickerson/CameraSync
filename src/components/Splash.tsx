import React from 'react';
import {
  ActivityIndicator, ActivityIndicatorProps,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex:           1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection:  'row',
    justifyContent: 'space-around',
    padding:        10,
  },
});

export default function Splash(props: ActivityIndicatorProps) {
  return (
    <View style={[styles.container, styles.horizontal]}>
      <ActivityIndicator {...props}/>
    </View>
  );
}

Splash.defaultProps = {
  size: 'large',
};
