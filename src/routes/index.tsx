import * as reactNavigation from 'react-navigation';
import Home from 'routes/Home';
import Commit from 'routes/Commit';

export const createNavigator = () => reactNavigation.createSwitchNavigator({
  Home: {
    screen: Home,
    path:   '/',
  },
  Commit: {
    screen: Commit,
    path:   '/commit',
  },
}, {
  initialRouteName: 'Home',
  backBehavior:     'initialRoute',
});
