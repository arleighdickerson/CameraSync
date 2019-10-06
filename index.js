/**
 * @format
 */

import 'core-js/es7/reflect';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);
