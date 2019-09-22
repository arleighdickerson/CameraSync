import * as reactNavigation from 'react-navigation';
import DeviceStack from './DeviceStack';
import Splash from 'components/Splash';

const routes = () => reactNavigation.createSwitchNavigator({
  DeviceStack: {
    screen: DeviceStack,
    // navigationOptions: { backBehavior: 'none' },
  },
  Splash: {
    screen: Splash,
  },
}, {
  initialRouteName: 'DeviceStack',
  backBehavior:     'none',
});

export default routes;
