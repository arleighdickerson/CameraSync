import * as reactNavigation from 'react-navigation';
import Home from 'routes/Home';
import * as Gallery from 'routes/Gallery';

export const createNavigator = () => reactNavigation.createSwitchNavigator({
  Home: {
    screen: Home,
    path:   '/',
  },
  GalleryGrid: {
    screen: Gallery.Grid,
    path:   '/gallery',
  },
  GalleryDetail: {
    screen: Gallery.Detail,
    path:   '/gallery/:id',
    params: {
      id: 0,
    },
  },
}, {
  initialRouteName: 'Home',
  backBehavior:     'initialRoute',
});
