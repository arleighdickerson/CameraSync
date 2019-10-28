import * as reactNavigation from 'react-navigation';
import Home from 'routes/Home';
import Gallery from 'routes/Gallery';

export const createNavigator = () => reactNavigation.createSwitchNavigator({
  Home: {
    screen: Home,
    path:   '/',
  },
  Gallery: {
    screen: Gallery,
    path:   '/gallery',
  },
}, {
  initialRouteName: 'Home',
  backBehavior:     'initialRoute',
});
