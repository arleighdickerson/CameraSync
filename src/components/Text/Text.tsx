import React from 'react';

// components
import { TextProps, Text as DefaultText } from 'react-native';

function Text(props: TextProps) {
  return <DefaultText {...props} />;
}

export default Text;
