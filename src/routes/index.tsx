import * as reactNavigation from 'react-navigation';
import DeviceStack from './DeviceStack';

const routes = () => reactNavigation.createSwitchNavigator({
  DeviceStack: {
    screen: DeviceStack,
    // navigationOptions: { backBehavior: 'none' },
  },
}, {
  initialRouteName: 'DeviceStack',
  backBehavior:     'none',
});

export default routes;
