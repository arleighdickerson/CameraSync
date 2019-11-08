import React from 'react';
import { Text } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';

export interface DetailViewProps extends NavigationScreenProps {
}

export default function DetailView(props: DetailViewProps) {
  const id = props.navigation.getParam('id', 'abc');
  return (
    <Text>{id}</Text>
  );
}
