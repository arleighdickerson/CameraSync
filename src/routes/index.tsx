import { NavigationRouteConfigMap } from 'react-navigation';
import ExampleScreen from './ExampleScreen';

const routes: NavigationRouteConfigMap = Object.freeze({
  Example: {
    screen: ExampleScreen,
  },
  path: 'example',
});

export default routes;
