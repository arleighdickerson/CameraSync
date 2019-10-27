import * as reactNavigation from 'react-navigation';
import Home from 'routes/Home';
import Commit from 'routes/Commit';
import CameraRoll from 'routes/CameraRoll';

export const createNavigator = () => reactNavigation.createSwitchNavigator({
  Home: {
    screen: Home,
    path:   '/',
  },
  Commit: {
    screen: Commit,
    path:   '/commit',
  },
  CameraRoll: {
    screen: CameraRoll,
    path:   '/camera-roll',
  },
}, {
  initialRouteName: 'Home',
  backBehavior:     'initialRoute',
});
