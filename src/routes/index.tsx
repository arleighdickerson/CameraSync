import { NavigationRouteConfigMap } from 'react-navigation';
import ExampleScreen from './ExampleScreen';

const routes = (): NavigationRouteConfigMap => ({
  Example: {
    screen: ExampleScreen,
  },
  path: 'example',
});

export default routes;
