import React from 'react';
import { Text, View } from 'react-native';

import * as styles from 'assets/shared.styles';
import withHeader from 'components/withHeader';

const CommitList = () => (
  <View style={styles.container}>
    <Text>Placeholder for second screen</Text>
  </View>
);

// @ts-ignore
export default withHeader({ title: 'Commits' })(CommitList);

