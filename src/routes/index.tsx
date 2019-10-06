import * as reactNavigation from 'react-navigation';
import DeviceStack from './DeviceStack';

export const createNavigator = () => reactNavigation.createSwitchNavigator({
  DeviceStack: {
    screen: DeviceStack,
    // navigationOptions: { backBehavior: 'none' },
  },
}, {
  initialRouteName: 'DeviceStack',
  backBehavior:     'none',
});
