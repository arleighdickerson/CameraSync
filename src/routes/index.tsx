import {
  createDrawerNavigator,
  // createStackNavigator
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';

const routes = () => createDrawerNavigator({
  Home: {
    screen: HomeScreen,
  },
  Settings: {
    screen: SettingsScreen,
  },
});

export default routes;
