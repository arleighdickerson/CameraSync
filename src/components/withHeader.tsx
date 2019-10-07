import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import React, {
  Component,
  ComponentClass,
  PureComponent,
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SharedStyleProp } from 'assets';
import { NavigationActions } from 'react-navigation';

import * as styles from 'assets/shared.styles';

const containerStyle: SharedStyleProp = {
  alignItems:        'center',
  height:            50,
  justifyContent:    'center',
  paddingHorizontal: 0,
  paddingTop:        0,
  width:             '100%',
};

const centerContainerStyle: SharedStyleProp = { paddingRight: 20 };

const buttonStyle: SharedStyleProp = {
  alignItems:     'center',
  height:         48,
  justifyContent: 'center',
  paddingRight:   5,
  width:          40,
};

const textStyle = { color: '#fff' };


type Props = {
    goBack: () => any
    goHome: () => any
}

const withHeader = ({ title = '' } ) => (WrappedComponent: Component<any>) => {
  class ComponentWrappedWithHeader extends PureComponent<Props> {
    render() {
      // @ts-ignore
      const horizontalComponent = (name, size, onPress) => (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
          <Icon name={name} size={size} color="#fff"/>
        </TouchableOpacity>
      );

      const centerComponent = (title: string) => ({
        text:  title.toUpperCase(),
        style: textStyle,
      });

      return (
        <View style={styles.container}>
          <Header
            containerStyle={containerStyle}
            centerContainerStyle={centerContainerStyle}
            leftComponent={horizontalComponent('chevron-left', 20, this.props.goBack)}
            centerComponent={centerComponent(title)}
            rightComponent={horizontalComponent('home', 25, this.props.goHome)}
          />
          <WrappedComponent/>
        </View>
      );
    }
  }

  const mapDispatchToProps = (dispatch: Dispatch) => ({
    goBack: () => dispatch(NavigationActions.back()),
    goHome: () => dispatch(NavigationActions.navigate({ routeName: 'Home' })),
  });

  return connect(null, mapDispatchToProps)(ComponentWrappedWithHeader);
};

export default withHeader;
