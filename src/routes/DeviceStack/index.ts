import { createStackNavigator } from 'react-navigation-stack';
import DeviceList from './DeviceList';
import DeviceDetail from './DeviceDetail';

// screens

const DeviceStack = createStackNavigator({
  DeviceDetail: {
    screen: DeviceDetail,
  },
  DeviceList: {
    screen: DeviceList,
  },
}, {
  headerMode:       'none',
  initialRouteName: 'DeviceList',
  /*
    navigationOptions: {
      gesturesEnabled: false,
    },
     */
});

export default DeviceStack;
